import type { ForcedChoiceQuestion, Quiz, RatingQuestion } from "@/lib/types";
import { getTagKey } from "@/lib/scoring";

/** Reads all the text out of a PDF file, client-side, using pdf.js. */
export async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const buffer = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buffer }).promise;

  const pageTexts: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const items = content.items as { str?: string }[];
    pageTexts.push(items.map((it) => it.str ?? "").join(" "));
  }
  return pageTexts.join("\n").replace(/\s+/g, " ").trim();
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Marriage Compatibility (and any other rating-scale-by-category quiz):
 * scans the PDF text for each known category name followed, within a short
 * window, by an "X.X / 5" figure — that's how every results view (By
 * score or By category) prints it. Requires most categories to be found,
 * to avoid confidently misreading an unrelated PDF. */
export function parseCategoryScoresFromPdfText(
  quiz: Quiz,
  text: string
): Record<string, number> | null {
  const categories = quiz.categories ?? [];
  if (categories.length === 0) return null;

  const found: Record<string, number> = {};
  for (const cat of categories) {
    const re = new RegExp(
      `${escapeRegExp(cat.name)}[^0-9]{0,60}?(\\d(?:\\.\\d)?)\\s*/\\s*5`,
      "i"
    );
    const m = text.match(re);
    if (m) {
      const val = parseFloat(m[1]);
      if (!Number.isNaN(val)) found[cat.id] = val;
    }
  }

  // Require most categories to have matched — a handful missing (odd
  // line wraps etc.) is fine, but a mostly-empty match means this
  // probably isn't the right PDF.
  if (Object.keys(found).length < Math.ceil(categories.length * 0.7)) {
    return null;
  }
  return found;
}

/** Converts parsed per-category target averages back into a full set of
 * per-question answers that will reproduce (very close to) those
 * averages when run back through the normal scoring function — so the
 * rest of the app doesn't need to know the data came from a PDF. */
export function synthesizeCategoryAnswers(
  quiz: Quiz,
  categoryAverages: Record<string, number>
): Record<string, number> {
  const questions = quiz.questions as RatingQuestion[];
  const tagKey = getTagKey(questions[0], ["id", "text"]);
  const maxPoints = Math.max(...(quiz.answerOptions?.map((o) => o.points) ?? [5]));
  const midpoint = Math.round((maxPoints + 1) / 2);

  const byCategory = new Map<string, RatingQuestion[]>();
  for (const q of questions) {
    const cat = q[tagKey];
    const list = byCategory.get(cat) ?? [];
    list.push(q);
    byCategory.set(cat, list);
  }

  const answers: Record<string, number> = {};
  for (const [catId, qs] of byCategory.entries()) {
    const target = categoryAverages[catId];
    if (target === undefined) {
      qs.forEach((q) => {
        answers[q.id] = midpoint;
      });
      continue;
    }
    const n = qs.length;
    const base = Math.max(1, Math.min(maxPoints, Math.floor(target)));
    const remainder = Math.max(
      0,
      Math.min(n, Math.round((target - base) * n))
    );
    qs.forEach((q, i) => {
      answers[q.id] = i < remainder ? Math.min(maxPoints, base + 1) : base;
    });
  }
  return answers;
}

/** Temperament-style (rating-scale-then-result, tag-based) and forced-choice
 * (Love Languages-style) quizzes: finds which result title is printed in the
 * PDF. Titles are matched by their two halves (before/after the em dash)
 * rather than requiring an exact dash-character match, since PDF text
 * extraction of special characters can be inconsistent.
 *
 * A results page (and its printed PDF) can legitimately contain more than
 * one result title — the primary result plus a "secondary tendency" box
 * below it. When more than one title matches, the primary is always the
 * one that appears first in reading order, so we take the earliest match
 * rather than rejecting the PDF outright. */
export function parseDominantTagFromPdfText(
  quiz: Quiz,
  text: string
): string | null {
  const results = quiz.results ?? {};
  const matches: { tag: string; index: number }[] = [];

  for (const [tag, content] of Object.entries(results)) {
    const parts = content.title.split(/\s+[—–-]\s+/);
    const pattern =
      parts.length === 2
        ? `${escapeRegExp(parts[0])}[\\s\\S]{0,8}${escapeRegExp(parts[1])}`
        : escapeRegExp(content.title);
    const m = new RegExp(pattern, "i").exec(text);
    if (m) {
      matches.push({ tag, index: m.index });
    }
  }

  if (matches.length === 0) return null;
  matches.sort((a, b) => a.index - b.index);
  return matches[0].tag;
}

/** All questions tagged for the matched dominant get max points, everything
 * else 0 — guarantees that tag scores highest when re-run through the
 * normal tag-scoring function, without needing to reverse-engineer the
 * original per-question answers (which aren't printed anywhere). */
export function synthesizeTagAnswers(
  quiz: Quiz,
  dominantTag: string
): Record<string, number> {
  const questions = quiz.questions as RatingQuestion[];
  const tagKey = getTagKey(questions[0], ["id", "text"]);
  const maxPoints = Math.max(...(quiz.answerOptions?.map((o) => o.points) ?? [1]));

  const answers: Record<string, number> = {};
  for (const q of questions) {
    answers[q.id] = q[tagKey] === dominantTag ? maxPoints : 0;
  }
  return answers;
}

/** Forced-choice (e.g. Love Languages): picks the matched-dominant option
 * on every question where it's offered — guaranteeing it "wins" every one
 * of its appearances. For questions where it isn't offered at all, picks
 * whichever of the two remaining languages currently has fewer picks, so
 * no other language can accidentally rack up enough picks to rival the
 * real dominant one. */
export function synthesizeForcedChoiceAnswers(
  quiz: Quiz,
  dominantTag: string
): Record<string, "A" | "B"> {
  const questions = quiz.questions as ForcedChoiceQuestion[];
  const counts: Record<string, number> = {};
  const answers: Record<string, "A" | "B"> = {};

  for (const q of questions) {
    const tagA = getTagKey(q.optionA as unknown as Record<string, unknown>, ["text"]);
    const tagB = getTagKey(q.optionB as unknown as Record<string, unknown>, ["text"]);
    const langA = q.optionA[tagA];
    const langB = q.optionB[tagB];

    let choice: "A" | "B";
    if (langA === dominantTag) choice = "A";
    else if (langB === dominantTag) choice = "B";
    else choice = (counts[langA] ?? 0) <= (counts[langB] ?? 0) ? "A" : "B";

    const chosenLang = choice === "A" ? langA : langB;
    counts[chosenLang] = (counts[chosenLang] ?? 0) + 1;
    answers[q.id] = choice;
  }
  return answers;
}

/** Top-level entry point: given an uploaded PDF file and the quiz it
 * should belong to, returns a synthesized answers object ready to store
 * exactly like a normal quiz-taking session would, or null if the PDF
 * doesn't look like a results PDF for this quiz. */
export async function parseResultsPdf(
  quiz: Quiz,
  file: File
): Promise<Record<string, number | "A" | "B"> | null> {
  const text = await extractPdfText(file);

  if (quiz.flow === "rating-scale-by-category") {
    const scores = parseCategoryScoresFromPdfText(quiz, text);
    return scores ? synthesizeCategoryAnswers(quiz, scores) : null;
  }

  if (quiz.flow === "rating-scale-then-result") {
    const tag = parseDominantTagFromPdfText(quiz, text);
    return tag ? synthesizeTagAnswers(quiz, tag) : null;
  }

  if (quiz.flow === "forced-choice-then-result") {
    const tag = parseDominantTagFromPdfText(quiz, text);
    return tag ? synthesizeForcedChoiceAnswers(quiz, tag) : null;
  }

  return null;
}

export type NamedPdfSection = { name: string | null; text: string };

/** Splits PDF text into per-person sections using the "{Name}'s result(s)"
 * marker every multiSubject results page prints as an eyebrow above that
 * person's result (see ResultCard/ChildTemperamentResult usage in
 * ResultsView.tsx). A single-person PDF yields one section. A two-person
 * "How We Compare" PDF (Temperament, Love Languages) yields two, one per
 * name, each scoped to that person's own text. A PDF with no such marker
 * at all — a single-subject quiz like Parenting Style or Love Languages
 * (Child), which never prints a name — yields one section with
 * `name: null`, signaling the caller needs to ask who it belongs to. */
export function splitPdfTextByNamedSections(text: string): NamedPdfSection[] {
  // Single capitalized word only — PDF text extraction flattens line
  // breaks into plain spaces, so a two-word allowance here would risk
  // greedily grabbing the last word of whatever sentence precedes the
  // marker (e.g. "...The Connector Lukas's result" misreading as name
  // "Connector Lukas", which also truncates the *previous* person's
  // section text and can silently drop their result).
  const re = /([A-Z][A-Za-z'-]*)'s results?\b/g;
  const matches: { name: string; index: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    matches.push({ name: m[1], index: m.index });
  }

  if (matches.length === 0) {
    return [{ name: null, text }];
  }

  return matches.map((match, i) => {
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
    return { name: match.name, text: text.slice(match.index, end) };
  });
}

export type FamilyPdfMatch = {
  name: string | null;
  quiz: Quiz;
  answers: Record<string, number | "A" | "B">;
};

/** Tries every eligible quiz's tag parser against each named section of a
 * PDF's text, returning one match per (name, quiz) pair successfully
 * detected — used by the Family Summary page, which doesn't know ahead of
 * time which assessment(s) an uploaded PDF contains, or how many people
 * are in it. Only tag-based quizzes are considered (rating-scale-by-
 * category quizzes like Marriage Compatibility are out of scope here and
 * simply won't match).
 *
 * Love Languages (Spouse) and Love Languages (Child) share identical
 * result titles ("Words of Affirmation" etc.), so tag-title matching
 * alone can't tell them apart. The one reliable signal is that a results
 * page always headers itself with its own exact quiz title (see
 * ResultsShell in ResultsView.tsx: "{quiz.title} — Your Results") — so
 * that's checked first, once, against the whole PDF, and preferred over
 * plain tag-title matching whenever it's present. */
export function parseFamilyPdfSections(
  quizzes: Quiz[],
  text: string
): FamilyPdfMatch[] {
  const eligible = quizzes.filter((q) => q.flow !== "rating-scale-by-category");
  const titleMatchedQuiz = eligible.find((q) => text.includes(q.title));
  const ordered = titleMatchedQuiz
    ? [titleMatchedQuiz, ...eligible.filter((q) => q !== titleMatchedQuiz)]
    : eligible;

  const sections = splitPdfTextByNamedSections(text);
  const matches: FamilyPdfMatch[] = [];

  for (const section of sections) {
    for (const quiz of ordered) {
      const tag = parseDominantTagFromPdfText(quiz, section.text);
      if (!tag) continue;
      const answers =
        quiz.flow === "forced-choice-then-result"
          ? synthesizeForcedChoiceAnswers(quiz, tag)
          : synthesizeTagAnswers(quiz, tag);
      matches.push({ name: section.name, quiz, answers });
      break;
    }
  }

  return matches;
}
