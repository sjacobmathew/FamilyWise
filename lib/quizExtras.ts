// Small bits of presentational content for the stepped quiz-taking flow
// that don't belong in the quiz data files — one generic tip per quiz,
// reused across all of that quiz's questions (not authored per-question).

export const QUIZ_TIPS: Record<string, string> = {
  "child-temperament":
    "Think about how your child behaves most of the time, rather than on an unusually good or difficult day.",
  temperament:
    "Answer based on how you naturally are most of the time — not how you wish you were, or how you act under pressure.",
  "parenting-style":
    "Go with your everyday instinct as a parent, not how you'd ideally like to respond in a calm moment.",
  "love-languages":
    "Go with whichever statement resonates more, even if neither feels like a perfect fit.",
  "love-languages-child":
    "Encourage picking whichever one feels more true, even if neither is exactly right.",
};

export const DEFAULT_TIP =
  "Answer honestly based on how things usually are, not how you wish they were.";
