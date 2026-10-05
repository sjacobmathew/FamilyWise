"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ForcedChoiceQuestion, Quiz, RatingQuestion } from "@/lib/types";
import { QUIZ_TIPS, DEFAULT_TIP } from "@/lib/quizExtras";
import SteppedProgress from "@/components/SteppedProgress";
import {
  ArrowIcon,
  BackArrowIcon,
  ClockIcon,
  ConcernedFaceIcon,
  ContentFaceIcon,
  LeafSprig,
  LockIcon,
  SadFaceIcon,
  SmileyIcon,
} from "@/components/HomeIcons";

function isForcedChoice(
  question: RatingQuestion | ForcedChoiceQuestion
): question is ForcedChoiceQuestion {
  return "optionA" in question;
}

const SENTIMENT = [
  { bg: "#E9F0E3", color: "#7C9473", Icon: SmileyIcon },
  { bg: "#FBF3E1", color: "#C9A063", Icon: ContentFaceIcon },
  { bg: "#EFEBF9", color: "#9B90C9", Icon: ConcernedFaceIcon },
  { bg: "#FBE9E6", color: "#D9776E", Icon: SadFaceIcon },
];

// Spacing/type tokens. "compact" (quiz.compact) trades breathing room for
// fitting the question, its choices and the Next button on one screen.
const LAYOUT = {
  roomy: {
    headerRow: "py-4",
    progressWrap: "mt-3",
    page: "gap-8 py-10",
    card: "p-6 sm:p-8",
    title: "mt-2 text-2xl sm:text-3xl",
    prompt: "mt-2 text-base",
    options: "mt-6 gap-3",
    option: "gap-4 p-4",
    badge: "h-10 w-10",
    label: "text-lg",
    nav: "mt-6",
    navButton: "py-2.5",
    privacy: "mt-6 text-sm",
  },
  compact: {
    headerRow: "flex items-center gap-4 py-2",
    progressWrap: "min-w-0 flex-1",
    page: "gap-6 py-3",
    card: "p-4",
    title: "mt-1 text-lg leading-tight sm:text-xl sm:leading-tight",
    prompt: "mt-1 text-sm",
    options: "mt-2.5 gap-1.5",
    option: "gap-3 px-3 py-1.5",
    badge: "h-8 w-8",
    label: "text-base",
    nav: "mt-3",
    navButton: "py-2",
    privacy: "mt-1.5 text-xs",
  },
} as const;

// Neutral badge for quizzes whose scale shouldn't read as good/bad.
const NUMERIC_BADGE = { bg: "#E9F0E3", color: "#7C9473" };

// Per-quiz sidebar illustration — only quizzes with a matching image get
// one; everything else falls back to the plain text intro.
const SIDEBAR_ILLUSTRATION: Record<string, string> = {
  "love-languages": "/marriage-couple.png",
  "child-temperament": "/kid-thinking.png",
  "love-languages-child": "/kid-thinking.png",
  "parenting-style": "/parenting-family.png",
  temperament: "/temperament-couple.png",
};

// Real pixel dimensions per quiz's illustration, so it doesn't get
// stretched/squished to a mismatched aspect ratio.
const ILLUSTRATION_SIZE: Record<string, [number, number]> = {
  "love-languages": [520, 347],
  "child-temperament": [520, 347],
  "love-languages-child": [520, 347],
  "parenting-style": [475, 340],
  temperament: [1536, 1024],
};

export default function SteppedQuestionsFlow({
  quiz,
  storageKey,
  subjectName,
  onSubmitted,
}: {
  quiz: Quiz;
  storageKey: string;
  subjectName?: string;
  onSubmitted: (router: ReturnType<typeof useRouter>) => void;
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number | "A" | "B">>(
    {}
  );
  const [index, setIndex] = useState(0);

  const isPerChild = Boolean(subjectName);
  const total = quiz.questions.length;
  const question = quiz.questions[index];
  const forced = isForcedChoice(question);
  const selected = answers[question.id];
  const isLast = index === total - 1;
  const tip = QUIZ_TIPS[quiz.quizId] ?? DEFAULT_TIP;
  const estMinutes = Math.max(1, Math.round((total * 12) / 60));
  const L = quiz.compact ? LAYOUT.compact : LAYOUT.roomy;

  function selectAnswer(value: number | "A" | "B") {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

  function goNext() {
    if (isLast) {
      sessionStorage.setItem(storageKey, JSON.stringify(answers));
      onSubmitted(router);
    } else {
      setIndex((i) => Math.min(total - 1, i + 1));
    }
  }

  function goBack() {
    setIndex((i) => Math.max(0, i - 1));
  }

  return (
    <div className="flex-1 bg-paper">
      <div className="sticky top-[73px] z-20 border-b border-border bg-card shadow-sm">
        <div className={`mx-auto max-w-5xl px-6 ${L.headerRow}`}>
          <Link
            href={isPerChild ? `/quiz/${quiz.quizId}` : "/"}
            className="flex w-fit shrink-0 items-center gap-1 text-sm font-medium text-walnut-soft hover:text-sienna"
          >
            <BackArrowIcon className="h-3.5 w-3.5" />
            {isPerChild
              ? `Back to ${quiz.multiSubject?.subjectLabelPlural ?? "list"}`
              : "All quizzes"}
          </Link>
          <div className={L.progressWrap}>
            <SteppedProgress
              current={index + 1}
              total={total}
              compact={quiz.compact}
            />
          </div>
        </div>
      </div>

      <div className={`mx-auto grid max-w-5xl px-6 lg:grid-cols-[220px_1fr_220px] ${L.page}`}>
        {/* left sidebar — quiz intro */}
        <div className="hidden lg:block">
          {SIDEBAR_ILLUSTRATION[quiz.quizId] && (
            <Image
              src={SIDEBAR_ILLUSTRATION[quiz.quizId]}
              alt=""
              width={ILLUSTRATION_SIZE[quiz.quizId]?.[0] ?? 520}
              height={ILLUSTRATION_SIZE[quiz.quizId]?.[1] ?? 347}
              className="w-full"
            />
          )}
          {quiz.category && (
            <span
              className={`block text-xs font-bold uppercase tracking-wide text-sienna ${
                SIDEBAR_ILLUSTRATION[quiz.quizId] ? "mt-4" : ""
              }`}
            >
              {quiz.category}
            </span>
          )}
          <h1 className="font-display mt-2 text-2xl font-semibold text-walnut">
            {quiz.title}
            {isPerChild && (
              <span className="text-sienna"> — for {subjectName}</span>
            )}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-walnut-soft">
            {quiz.description}
          </p>
          <div className="mt-6 flex flex-col gap-3 text-sm text-walnut-soft">
            <span className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-forest" />
              Takes about {quiz.estimatedMinutes ?? estMinutes} min
            </span>
            <span className="flex items-center gap-2">
              <LockIcon className="h-4 w-4 text-forest" />
              Your answers stay private
            </span>
          </div>
        </div>

        {/* center — current question */}
        <div>
          <div className={`rounded-3xl border border-border bg-card shadow-sm ${L.card}`}>
            <span className="text-xs font-bold uppercase tracking-wide text-sienna">
              {quiz.title}
            </span>

            {forced ? (
              <>
                <h2 className="font-display mt-2 text-2xl font-semibold text-walnut sm:text-3xl">
                  Which feels more like {isPerChild ? subjectName : "you"}?
                </h2>
                <p className="mt-2 text-base text-walnut-soft">
                  Choose the statement that fits best.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      ["A", question.optionA.text],
                      ["B", question.optionB.text],
                    ] as const
                  ).map(([choice, text]) => {
                    const isSelected = selected === choice;
                    return (
                      <button
                        key={choice}
                        type="button"
                        onClick={() => selectAnswer(choice)}
                        className={`rounded-2xl border p-5 text-left text-lg leading-relaxed transition ${
                          isSelected
                            ? "border-forest bg-forest-soft text-walnut"
                            : "border-border text-walnut-soft hover:border-forest hover:text-walnut"
                        }`}
                      >
                        {text}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <h2 className={`font-display font-semibold text-walnut ${L.title}`}>
                  {question.text}
                </h2>
                <p className={`text-walnut-soft ${L.prompt}`}>
                  {quiz.answerPrompt ?? "Choose the answer that best describes it."}
                </p>
                <div className={`flex flex-col ${L.options}`}>
                  {(quiz.answerOptions ?? []).map((option, i) => {
                    const numeric = quiz.answerDisplay === "numbers";
                    const style = numeric
                      ? NUMERIC_BADGE
                      : SENTIMENT[i % SENTIMENT.length];
                    const Icon = numeric ? null : SENTIMENT[i % SENTIMENT.length].Icon;
                    const isSelected = selected === option.points;
                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => selectAnswer(option.points)}
                        className={`flex items-center rounded-2xl border text-left transition ${L.option} ${
                          isSelected
                            ? "border-forest"
                            : "border-border hover:border-forest/60"
                        }`}
                      >
                        <span
                          className={`flex shrink-0 items-center justify-center rounded-full ${L.badge}`}
                          style={{ backgroundColor: style.bg, color: style.color }}
                        >
                          {Icon ? (
                            <Icon className="h-5 w-5" />
                          ) : (
                            <span className="text-base font-bold">{option.points}</span>
                          )}
                        </span>
                        <span className={`text-walnut ${L.label}`}>
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className={`flex items-center justify-between gap-4 ${L.nav}`}>
            <button
              type="button"
              onClick={goBack}
              disabled={index === 0}
              className={`flex items-center gap-2 rounded-full border border-border px-5 text-base font-semibold text-walnut transition hover:border-forest disabled:opacity-40 ${L.navButton}`}
            >
              <BackArrowIcon className="h-4 w-4" />
              Back
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={selected === undefined}
              className={`flex items-center gap-2 rounded-full bg-forest px-6 text-base font-semibold text-paper transition hover:bg-forest-dark disabled:opacity-40 ${L.navButton}`}
            >
              {isLast ? (isPerChild ? "Save & continue" : "See my results") : "Next"}
              <ArrowIcon className="h-4 w-4" />
            </button>
          </div>

          <p className={`flex items-center justify-center gap-2 text-walnut-soft ${L.privacy}`}>
            <LockIcon className="h-4 w-4" />
            Your answers are private and secure.
          </p>
        </div>

        {/* right sidebar — tip */}
        <div className="hidden lg:block">
          <div className="rounded-3xl bg-forest-soft/60 p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
              <LeafSprig className="h-5 w-5 text-forest" />
            </span>
            <h3 className="font-display mt-4 text-xl font-semibold text-walnut">
              Tip
            </h3>
            <p className="mt-2 text-base leading-relaxed text-walnut-soft">
              {tip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
