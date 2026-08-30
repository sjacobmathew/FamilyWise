import type {
  ForcedChoiceQuestion,
  Quiz,
  RatingQuestion,
  ResultContent,
} from "./types";

/** Finds the one field on an object that isn't in `excludeKeys` — this is
 * how quiz questions tag themselves with a category, since the tag's field
 * name varies per quiz ("temperament", "style", "language", "category"...). */
export function getTagKey(obj: Record<string, unknown>, excludeKeys: string[]): string {
  const key = Object.keys(obj).find((k) => !excludeKeys.includes(k));
  if (!key) {
    throw new Error(`Expected a tag field beyond ${excludeKeys.join(", ")}`);
  }
  return key;
}

export type RatingAnswers = Record<string, number>; // questionId -> points
export type ForcedChoiceAnswers = Record<string, "A" | "B">; // questionId -> pick

export type TagScore = { tag: string; value: number };

/** Sums points per tag for rating-scale-then-result quizzes. */
export function scoreRatingByTag(quiz: Quiz, answers: RatingAnswers): TagScore[] {
  const questions = quiz.questions as RatingQuestion[];
  if (questions.length === 0) return [];
  const tagKey = getTagKey(questions[0], ["id", "text"]);

  const totals = new Map<string, number>();
  for (const q of questions) {
    const tag = q[tagKey];
    const points = answers[q.id] ?? 0;
    totals.set(tag, (totals.get(tag) ?? 0) + points);
  }

  return Array.from(totals.entries())
    .map(([tag, value]) => ({ tag, value }))
    .sort((a, b) => b.value - a.value);
}

/** Counts picks per tag for forced-choice-then-result quizzes. */
export function scoreForcedChoice(
  quiz: Quiz,
  answers: ForcedChoiceAnswers
): TagScore[] {
  const questions = quiz.questions as ForcedChoiceQuestion[];
  const counts = new Map<string, number>();

  for (const q of questions) {
    const pick = answers[q.id];
    if (!pick) continue;
    const option = pick === "A" ? q.optionA : q.optionB;
    const tagKey = getTagKey(option, ["text"]);
    const tag = option[tagKey];
    counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([tag, value]) => ({ tag, value }))
    .sort((a, b) => b.value - a.value);
}

export type CategoryScore = {
  id: string;
  name: string;
  average: number;
  maxPoints: number;
  percent: number;
  band: "Room to Grow" | "Solid Ground" | "Real Strength";
};

function bandFor(percent: number): CategoryScore["band"] {
  if (percent < 60) return "Room to Grow";
  if (percent <= 80) return "Solid Ground";
  return "Real Strength";
}

/** Averages points per category for rating-scale-by-category quizzes. */
export function scoreByCategory(
  quiz: Quiz,
  answers: RatingAnswers
): CategoryScore[] {
  const questions = quiz.questions as RatingQuestion[];
  if (questions.length === 0) return [];
  const tagKey = getTagKey(questions[0], ["id", "text"]);
  const maxPoints = Math.max(...(quiz.answerOptions?.map((o) => o.points) ?? [1]));

  const sums = new Map<string, { total: number; count: number }>();
  for (const q of questions) {
    const cat = q[tagKey];
    const points = answers[q.id];
    // Skip questions left blank (e.g. an unanswered optional-category
    // question) rather than scoring them as 0 — an optional section
    // someone opted out of shouldn't drag its average down.
    if (points === undefined) continue;
    const entry = sums.get(cat) ?? { total: 0, count: 0 };
    entry.total += points;
    entry.count += 1;
    sums.set(cat, entry);
  }

  const categories =
    quiz.categories ??
    Array.from(sums.keys()).map((id) => ({ id, name: id }));

  // A category nobody answered anything in (an optional section that was
  // skipped entirely) is left out of results rather than shown as a 0.
  return categories
    .filter((c) => (sums.get(c.id)?.count ?? 0) > 0)
    .map((c) => {
      const entry = sums.get(c.id)!;
      const average = entry.total / entry.count;
      const percent = maxPoints ? (average / maxPoints) * 100 : 0;
      return {
        id: c.id,
        name: c.name,
        average,
        maxPoints,
        percent,
        band: bandFor(percent),
      };
    });
}

export type NormalizedResult = {
  title: string;
  description: string;
  strengths?: string[];
  growthEdges?: string[];
  tips: string[];
};

/** Different quiz files use different field names for the same concepts
 * (description vs inFamily, tips vs parentingTips) — flatten to one shape. */
export function normalizeResultContent(rc: ResultContent): NormalizedResult {
  return {
    title: rc.title,
    description: rc.description ?? rc.inFamily ?? "",
    strengths: rc.strengths,
    growthEdges: rc.growthEdges,
    tips: rc.tips ?? rc.parentingTips ?? [],
  };
}

export function countAnswered(
  quiz: Quiz,
  answers: Record<string, unknown>
): number {
  return quiz.questions.filter((q) => answers[q.id] !== undefined).length;
}
