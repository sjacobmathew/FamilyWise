"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Quiz, RatingQuestion } from "@/lib/types";
import { getTagKey } from "@/lib/scoring";
import {
  CATEGORY_INFO,
  DEFAULT_CATEGORY_INFO,
  QUIZ_TIPS,
  DEFAULT_TIP,
} from "@/lib/quizExtras";
import {
  ArrowIcon,
  BackArrowIcon,
  CheckCircleIcon,
  ClockIcon,
  ConcernedFaceIcon,
  ContentFaceIcon,
  HeartIcon,
  LightbulbIcon,
  LockIcon,
  SadFaceIcon,
  ShieldIcon,
  SmileyIcon,
} from "@/components/HomeIcons";

// Ordered worst (1 point) to best (5 points) — indexed by `points - 1`, not
// array position, so it's correct regardless of how a quiz orders its
// answerOptions.
const SENTIMENT_5 = [
  { bg: "#FBE1DE", color: "#D9544A", Icon: SadFaceIcon, caption: "This is not true for us at all" },
  { bg: "#FBE9E6", color: "#D98F89", Icon: SadFaceIcon, caption: "This is mostly not true for us" },
  { bg: "#EFEBF9", color: "#9B90C9", Icon: ConcernedFaceIcon, caption: "This is somewhat true for us" },
  { bg: "#FBF3E1", color: "#C9A063", Icon: ContentFaceIcon, caption: "This is mostly true for us" },
  { bg: "#E9F0E3", color: "#7C9473", Icon: SmileyIcon, caption: "This is very true for us" },
];

export default function CategorySteppedFlow({
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
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [catIndex, setCatIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [whyOpen, setWhyOpen] = useState(false);

  const isPerChild = Boolean(subjectName);
  const questions = quiz.questions as RatingQuestion[];
  const categories = quiz.categories ?? [];
  const tagKey = getTagKey(questions[0], ["id", "text"]);
  const optionalIds = new Set(categories.filter((c) => c.optional).map((c) => c.id));

  const byCategory = categories.map((cat) =>
    questions.filter((q) => q[tagKey] === cat.id)
  );

  const category = categories[catIndex];
  const categoryQuestions = byCategory[catIndex];
  const question = categoryQuestions[qIndex];
  const isOptionalSection = optionalIds.has(category.id);

  const requiredQuestions = questions.filter((q) => !optionalIds.has(q[tagKey]));
  const requiredTotal = requiredQuestions.length;
  const requiredAnswered = requiredQuestions.filter((q) => answers[q.id] !== undefined).length;

  const isLastQuestion =
    catIndex === categories.length - 1 && qIndex === categoryQuestions.length - 1;
  const canAdvance = isOptionalSection || answers[question.id] !== undefined;

  const sectionsCompleted = byCategory.filter((qs, i) =>
    optionalIds.has(categories[i].id)
      ? true
      : qs.every((q) => answers[q.id] !== undefined)
  ).length;
  const remaining = requiredTotal - requiredAnswered;
  const estLow = Math.max(1, Math.round((remaining * 8) / 60));
  const estHigh = Math.max(estLow + 1, Math.round((remaining * 15) / 60));

  function select(points: number) {
    setAnswers((prev) => ({ ...prev, [question.id]: points }));
  }

  function goNext() {
    if (isLastQuestion) {
      sessionStorage.setItem(storageKey, JSON.stringify(answers));
      onSubmitted(router);
      return;
    }
    if (qIndex < categoryQuestions.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      setCatIndex(catIndex + 1);
      setQIndex(0);
    }
    setWhyOpen(false);
  }

  function goBack() {
    if (qIndex > 0) {
      setQIndex(qIndex - 1);
    } else if (catIndex > 0) {
      setCatIndex(catIndex - 1);
      setQIndex(byCategory[catIndex - 1].length - 1);
    }
    setWhyOpen(false);
  }

  function jumpToSection(i: number) {
    const firstUnanswered = byCategory[i].findIndex(
      (q) => answers[q.id] === undefined
    );
    setCatIndex(i);
    setQIndex(firstUnanswered === -1 ? 0 : firstUnanswered);
    setWhyOpen(false);
  }

  const tip = QUIZ_TIPS[quiz.quizId] ?? DEFAULT_TIP;
  const info = CATEGORY_INFO[category.id] ?? DEFAULT_CATEGORY_INFO;

  return (
    <div className="flex-1 bg-paper">
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link
            href={isPerChild ? `/quiz/${quiz.quizId}` : "/"}
            className="flex items-center gap-1 text-sm font-medium text-walnut-soft hover:text-sienna"
          >
            <BackArrowIcon className="h-3.5 w-3.5" />
            {isPerChild
              ? `Back to ${quiz.multiSubject?.subjectLabelPlural ?? "list"}`
              : "All quizzes"}
          </Link>
          <span className="hidden items-center gap-3 text-sm font-medium text-walnut-soft sm:flex">
            Overall progress
            <span className="h-1.5 w-40 overflow-hidden rounded-full bg-forest-soft">
              <span
                className="block h-full rounded-full bg-forest transition-all"
                style={{ width: `${(requiredAnswered / requiredTotal) * 100}%` }}
              />
            </span>
          </span>
          <span className="text-sm font-medium text-walnut-soft">
            {requiredAnswered} of {requiredTotal} answered
          </span>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[240px_1fr_240px]">
        {/* left sidebar */}
        <div className="hidden lg:block">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sienna-soft text-sienna">
            <HeartIcon className="h-8 w-8" />
          </span>
          <span className="mt-4 block text-xs font-bold uppercase tracking-wide text-sienna">
            {quiz.category ?? "Relationships"}
          </span>
          <h1 className="font-display mt-1 text-2xl font-semibold text-walnut">
            Understand your relationship.{" "}
            <span className="text-forest">Build a stronger future together.</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-walnut-soft">
            {quiz.description}
          </p>
          <div className="mt-5 flex flex-col gap-2 text-sm text-walnut-soft">
            <span className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-forest" />
              Takes about 20–25 min
            </span>
            <span className="flex items-center gap-2">
              <LockIcon className="h-4 w-4 text-forest" />
              Your answers are private and secure
            </span>
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-card p-4">
            <h3 className="text-sm font-bold uppercase tracking-wide text-walnut-soft">
              Quiz sections
            </h3>
            <div className="mt-3 flex flex-col gap-1">
              {categories.map((cat, i) => {
                const qs = byCategory[i];
                const answeredHere = qs.filter((q) => answers[q.id] !== undefined).length;
                const isActive = i === catIndex;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => jumpToSection(i)}
                    className={`rounded-lg border-l-2 px-3 py-1.5 text-left transition ${
                      isActive
                        ? "border-forest bg-forest-soft/50"
                        : "border-transparent hover:bg-forest-soft/30"
                    }`}
                  >
                    <span
                      className={`block text-sm ${
                        isActive ? "font-semibold text-walnut" : "text-walnut-soft"
                      }`}
                    >
                      {i + 1}. {cat.name}
                      {optionalIds.has(cat.id) && " (optional)"}
                    </span>
                    <span className="block text-xs text-walnut-soft">
                      {answeredHere} of {qs.length} answered
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-sienna-soft p-5">
            <HeartIcon className="h-5 w-5 text-sienna" />
            <h3 className="mt-2 text-sm font-bold text-walnut">Answer honestly</h3>
            <p className="mt-1 text-sm leading-relaxed text-walnut-soft">
              There are no right or wrong answers. Be honest to get the most
              meaningful insights.
            </p>
          </div>
        </div>

        {/* center */}
        <div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-wide text-forest">
                {category.name}
              </span>
              <button
                type="button"
                onClick={() => setWhyOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-semibold text-walnut-soft transition hover:border-forest hover:text-forest"
              >
                <LightbulbIcon className="h-3.5 w-3.5" />
                Why this matters?
              </button>
            </div>

            {whyOpen && (
              <p className="mt-3 rounded-xl bg-forest-soft/50 p-3 text-sm leading-relaxed text-walnut">
                {info}
              </p>
            )}

            <p className="mt-4 text-sm font-medium text-walnut-soft">
              Question {qIndex + 1} of {categoryQuestions.length}
            </p>
            <h2 className="font-display mt-1 text-2xl font-semibold text-walnut sm:text-3xl">
              {question.text}
            </h2>
            <p className="mt-2 text-base text-walnut-soft">
              Choose the option that best describes your relationship.
            </p>
            {isOptionalSection && (
              <p className="mt-2 text-sm font-medium text-sienna">
                Optional — skip if it doesn&apos;t apply to you.
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3">
              {(quiz.answerOptions ?? []).map((option) => {
                const style = SENTIMENT_5[Math.min(4, Math.max(0, option.points - 1))];
                const Icon = style.Icon;
                const isSelected = answers[question.id] === option.points;
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => select(option.points)}
                    className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-forest"
                        : "border-border hover:border-forest/60"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                        isSelected ? "border-forest" : "border-border"
                      }`}
                    >
                      {isSelected && (
                        <span className="h-2.5 w-2.5 rounded-full bg-forest" />
                      )}
                    </span>
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: style.bg, color: style.color }}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-lg text-walnut">{option.label}</span>
                      <span className="block text-sm text-walnut-soft">{style.caption}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#FBF3E1] p-4">
              <LightbulbIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#C9A063]" />
              <div>
                <p className="text-sm font-bold text-walnut">Tip</p>
                <p className="mt-0.5 text-sm leading-relaxed text-walnut-soft">{tip}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={goBack}
              disabled={catIndex === 0 && qIndex === 0}
              className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-base font-semibold text-walnut transition hover:border-forest disabled:opacity-40"
            >
              <BackArrowIcon className="h-4 w-4" />
              Back
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!canAdvance}
              className="flex items-center gap-2 rounded-full bg-forest px-6 py-2.5 text-base font-semibold text-paper transition hover:bg-forest-dark disabled:opacity-40"
            >
              {isLastQuestion ? (isPerChild ? "Save & continue" : "See my results") : "Next"}
              <ArrowIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8">
            <p className="flex items-center justify-center gap-2 text-sm font-semibold text-walnut-soft">
              Your progress
            </p>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl border border-border bg-card p-3">
                <p className="font-display text-xl font-semibold text-walnut">
                  {sectionsCompleted} of {categories.length}
                </p>
                <p className="text-xs text-walnut-soft">Sections completed</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-3">
                <p className="font-display text-xl font-semibold text-walnut">
                  {requiredAnswered} of {requiredTotal}
                </p>
                <p className="text-xs text-walnut-soft">Questions answered</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-3">
                <p className="font-display text-xl font-semibold text-walnut">
                  {remaining === 0 ? "0 min" : `${estLow}–${estHigh} min`}
                </p>
                <p className="text-xs text-walnut-soft">Estimated time left</p>
              </div>
            </div>
          </div>
        </div>

        {/* right sidebar */}
        <div className="hidden lg:block">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-bold text-walnut">About this section</h3>
            <p className="mt-2 text-sm leading-relaxed text-walnut-soft">{info}</p>

            <h4 className="mt-4 text-sm font-bold text-walnut-soft">Section progress</h4>
            <p className="mt-1 text-sm text-walnut-soft">
              {categoryQuestions.filter((q) => answers[q.id] !== undefined).length} of{" "}
              {categoryQuestions.length} answered
            </p>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-forest-soft">
              <span
                className="block h-full rounded-full bg-forest transition-all"
                style={{
                  width: `${
                    (categoryQuestions.filter((q) => answers[q.id] !== undefined).length /
                      categoryQuestions.length) *
                    100
                  }%`,
                }}
              />
            </div>

            <h4 className="mt-4 text-sm font-bold text-walnut-soft">Section questions</h4>
            <div className="mt-2 flex flex-col gap-2">
              {categoryQuestions.map((q, i) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = i === qIndex;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setQIndex(i);
                      setWhyOpen(false);
                    }}
                    className="flex items-start gap-2 text-left"
                  >
                    {isAnswered ? (
                      <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                    ) : (
                      <span className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-border" />
                    )}
                    <span
                      className={`text-sm leading-snug ${
                        isCurrent
                          ? "font-semibold text-walnut"
                          : "text-walnut-soft"
                      }`}
                    >
                      {q.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 rounded-2xl p-5" style={{ backgroundColor: "#EFEBF9" }}>
            <HeartIcon className="h-5 w-5 text-[#9B90C9]" />
            <h3 className="mt-2 text-sm font-bold text-walnut">Remember</h3>
            <p className="mt-1 text-sm leading-relaxed text-walnut-soft">
              This is about understanding, not judging. Honest answers help
              you grow together.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-6">
          <ShieldIcon className="h-8 w-8 shrink-0 text-forest" />
          <div>
            <p className="text-base font-bold text-walnut">100% private &amp; secure</p>
            <p className="text-sm text-walnut-soft">
              Your answers stay only in this browser tab and are never sent
              anywhere — they disappear as soon as you close it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
