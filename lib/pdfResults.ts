import type { Quiz, RatingQuestion } from "@/lib/types";
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

/** Temperament-style (rating-scale-then-result, tag-based) quizzes: finds
 * which single result title is printed in the PDF. Titles are matched by
 * their two halves (before/after the em dash) rather than requiring an
 * exact dash-character match, since PDF text extraction of special
 * characters can be inconsistent. */
export function parseDominantTagFromPdfText(
  quiz: Quiz,
  text: string
): string | null {
  const results = quiz.results ?? {};
  const matches: string[] = [];

  for (const [tag, content] of Object.entries(results)) {
    const parts = content.title.split(/\s+[—–-]\s+/);
    const pattern =
      parts.length === 2
        ? `${escapeRegExp(parts[0])}[\\s\\S]{0,8}${escapeRegExp(parts[1])}`
        : escapeRegExp(content.title);
    if (new RegExp(pattern, "i").test(text)) {
      matches.push(tag);
    }
  }

  return matches.length === 1 ? matches[0] : null;
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

/** Top-level entry point: given an uploaded PDF file and the quiz it
 * should belong to, returns a synthesized answers object ready to store
 * exactly like a normal quiz-taking session would, or null if the PDF
 * doesn't look like a results PDF for this quiz. */
export async function parseResultsPdf(
  quiz: Quiz,
  file: File
): Promise<Record<string, number> | null> {
  const text = await extractPdfText(file);

  if (quiz.flow === "rating-scale-by-category") {
    const scores = parseCategoryScoresFromPdfText(quiz, text);
    return scores ? synthesizeCategoryAnswers(quiz, scores) : null;
  }

  if (quiz.flow === "rating-scale-then-result") {
    const tag = parseDominantTagFromPdfText(quiz, text);
    return tag ? synthesizeTagAnswers(quiz, tag) : null;
  }

  return null;
}
