export type AnswerOption = {
  label: string;
  points: number;
};

export type RatingQuestion = {
  id: string;
  text: string;
  // exactly one additional field tags this question with its category
  // e.g. "temperament": "sanguine", "style": "authoritative", "category": "finances"
  [tagField: string]: string;
};

export type ForcedChoiceOption = {
  text: string;
  // exactly one additional field tags this option
  // e.g. "language": "words"
  [tagField: string]: string;
};

export type ForcedChoiceQuestion = {
  id: string;
  optionA: ForcedChoiceOption;
  optionB: ForcedChoiceOption;
};

export type ResultContent = {
  title: string;
  description?: string;
  inFamily?: string;
  strengths?: string[];
  growthEdges?: string[];
  tips?: string[];
  parentingTips?: string[];
};

export type QuizCategory = {
  id: string;
  name: string;
  // When true, questions in this category aren't required to submit the
  // quiz, and are left out of scoring/results entirely if left blank.
  optional?: boolean;
};

export type QuizFlow =
  | "rating-scale-then-result"
  | "forced-choice-then-result"
  | "rating-scale-by-category";

// Older data files used this flow name before the spec settled; treated as
// an alias for "rating-scale-then-result" wherever a flow is read.
export type RawQuizFlow = QuizFlow | "all-questions-then-result";

export type Quiz = {
  quizId: string;
  title: string;
  description: string;
  flow: QuizFlow;
  category?: string;
  instructions?: string;
  answerOptions?: AnswerOption[];
  categories?: QuizCategory[];
  questions: (RatingQuestion | ForcedChoiceQuestion)[];
  scoring?: { method?: string };
  results?: Record<string, ResultContent>;
  // When set, this quiz is taken once per subject rather than once per
  // session (add subjects first, then run the full quiz separately for each
  // one). subjectLabel/subjectLabelPlural drive the roster screen's copy
  // ("child"/"children", "spouse"/"spouses", etc.).
  multiSubject?: {
    subjectLabel: string;
    subjectLabelPlural: string;
  };
};
