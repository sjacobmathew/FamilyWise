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

// Per-quiz sidebar illustration — only quizzes with a matching image get
// one; everything else falls back to the plain text intro.
const SIDEBAR_ILLUSTRATION: Record<string, string> = {
  "love-languages": "/marriage-couple.png",
  "child-temperament": "/kid-thinking.png",
  "love-languages-child": "/kid-thinking.png",
  "parenting-style": "/parenting-family.png",
};

// Real pixel dimensions per quiz's illustration, so it doesn't get
// stretched/squished to a mismatched aspect ratio.
const ILLUSTRATION_SIZE: Record<string, [number, number]> = {
  "love-languages": [520, 347],
  "child-temperament": [520, 347],
  "love-languages-child": [520, 347],
  "parenting-style": [475, 340],
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
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <Link
            href={isPerChild ? `/quiz/${quiz.quizId}` : "/"}
            className="flex w-fit items-center gap-1 text-sm font-medium text-walnut-soft hover:text-sienna"
          >
            <BackArrowIcon className="h-3.5 w-3.5" />
            {isPerChild
              ? `Back to ${quiz.multiSubject?.subjectLabelPlural ?? "list"}`
              : "All quizzes"}
          </Link>
          <div className="mt-3">
            <SteppedProgress current={index + 1} total={total} />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-10 lg:grid-cols-[220px_1fr_220px]">
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
              Takes about {estMinutes} min
            </span>
            <span className="flex items-center gap-2">
              <LockIcon className="h-4 w-4 text-forest" />
              Your answers stay private
            </span>
          </div>
        </div>

        {/* center — current question */}
        <div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
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
                <h2 className="font-display mt-2 text-2xl font-semibold text-walnut sm:text-3xl">
                  {question.text}
                </h2>
                <p className="mt-2 text-base text-walnut-soft">
                  Choose the answer that best describes it.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  {(quiz.answerOptions ?? []).map((option, i) => {
                    const style = SENTIMENT[i % SENTIMENT.length];
                    const Icon = style.Icon;
                    const isSelected = selected === option.points;
                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => selectAnswer(option.points)}
                        className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                          isSelected
                            ? "border-forest"
                            : "border-border hover:border-forest/60"
                        }`}
                      >
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                          style={{ backgroundColor: style.bg, color: style.color }}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="text-lg text-walnut">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={goBack}
              disabled={index === 0}
              className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-base font-semibold text-walnut transition hover:border-forest disabled:opacity-40"
            >
              <BackArrowIcon className="h-4 w-4" />
              Back
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={selected === undefined}
              className="flex items-center gap-2 rounded-full bg-forest px-6 py-2.5 text-base font-semibold text-paper transition hover:bg-forest-dark disabled:opacity-40"
            >
              {isLast ? (isPerChild ? "Save & continue" : "See my results") : "Next"}
              <ArrowIcon className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-6 flex items-center justify-center gap-2 text-sm text-walnut-soft">
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
