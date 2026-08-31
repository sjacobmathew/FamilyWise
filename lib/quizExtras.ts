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
  "marriage-compatibility":
    "Think about how things usually are between you, not just recent events.",
};

export const DEFAULT_TIP =
  "Answer honestly based on how things usually are, not how you wish they were.";

/** One short description per Marriage Compatibility category — used both
 * as the "About this section" sidebar copy and the "Why this matters?"
 * popover, so it's written to work as a single, reusable sentence. */
export const CATEGORY_INFO: Record<string, string> = {
  overall: "How satisfied you feel with your marriage day to day, overall.",
  emotional: "How connected, affectionate, and emotionally in-tune you are with each other.",
  communication: "How you talk, listen, and work through disagreements together.",
  time: "How much quality time you spend together and how you use it.",
  finances: "How you handle money together — trust, teamwork, and financial stress.",
  sexual: "How connected and communicative you are in your physical relationship.",
  parenting: "How well you work as a team raising your children.",
  intimacy: "How safe, known, and emotionally close you feel with each other.",
  acceptance: "How fully you feel accepted for who you really are, flaws included.",
  forgiveness: "How you handle hurt, apologies, and moving past conflict.",
  spirituality: "How aligned you are in faith, values, and what you're building your life around.",
  friendship: "How much you genuinely enjoy each other's company as friends.",
  family: "How you navigate boundaries with extended family and friends.",
  jesusyouth: "Your shared involvement in Jesus Youth and how it fits into your marriage.",
};

export const DEFAULT_CATEGORY_INFO =
  "These questions explore an important part of your relationship.";
