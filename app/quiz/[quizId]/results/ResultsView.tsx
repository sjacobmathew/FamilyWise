"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Quiz } from "@/lib/types";
import {
  scoreRatingByTag,
  scoreForcedChoice,
  scoreByCategory,
  normalizeResultContent,
  type NormalizedResult,
  type CategoryScore,
} from "@/lib/scoring";
import ResultCard from "@/components/ResultCard";
import ChildTemperamentResult from "@/components/ChildTemperamentResult";
import MarriageResultCard from "@/components/MarriageResultCard";
import MarriageCompareCard from "@/components/MarriageCompareCard";
import ParentingStyleResult from "@/components/ParentingStyleResult";
import TemperamentCompareCard from "@/components/TemperamentCompareCard";
import LoveLanguageCompareCard from "@/components/LoveLanguageCompareCard";
import PrivacyNote from "@/components/PrivacyNote";
import {
  ChevronRightIcon,
  DownloadIcon,
  RefreshIcon,
  TwoPersonIcon,
} from "@/components/HomeIcons";
import { childAnswersKey, rosterKey } from "@/lib/childRoster";

const ANSWERS_STORAGE_PREFIX = "familywise:answers:";

type StoredAnswers = Record<string, number | "A" | "B">;

function noopSubscribe() {
  return () => {};
}

function getServerSnapshot() {
  return null;
}

export default function ResultsView({ quiz }: { quiz: Quiz }) {
  if (quiz.multiSubject) {
    return <MultiSubjectResultsView quiz={quiz} />;
  }

  return <SingleSubjectResultsView quiz={quiz} />;
}

function SingleSubjectResultsView({ quiz }: { quiz: Quiz }) {
  const storageKey = `${ANSWERS_STORAGE_PREFIX}${quiz.quizId}`;
  const raw = useSyncExternalStore(
    noopSubscribe,
    () => sessionStorage.getItem(storageKey),
    getServerSnapshot
  );
  const answers: StoredAnswers | null = raw ? JSON.parse(raw) : null;

  if (answers === null) {
    return (
      <NoResultsYet
        quizId={quiz.quizId}
        message="We couldn't find your answers for this quiz — they may have expired. Let's take it again."
      />
    );
  }

  const isCategoryQuiz = quiz.flow === "rating-scale-by-category";
  const isParentingStyle = quiz.quizId === "parenting-style";

  return (
    <ResultsShell
      quiz={quiz}
      retakeHref={`/quiz/${quiz.quizId}`}
      subtitle={
        isCategoryQuiz
          ? "Here's a personalized look at your relationship and how you can grow together."
          : isParentingStyle
            ? "Here's your unique parenting style, along with your strengths, growth edges and personalized tips."
            : undefined
      }
      headerIcon={<ResultsHeaderIcon quizId={quiz.quizId} />}
      maxWidthClass={isCategoryQuiz || isParentingStyle ? "max-w-5xl" : "max-w-3xl"}
    >
      {isCategoryQuiz ? (
        <CategoryResults
          quiz={quiz}
          answers={answers as Record<string, number>}
        />
      ) : (
        <SingleResult quiz={quiz} answers={answers} />
      )}
    </ResultsShell>
  );
}

function ResultsShell({
  quiz,
  retakeHref,
  retakeLabel = "Retake this quiz",
  maxWidthClass = "max-w-3xl",
  titleOverride,
  subtitle,
  headerIcon,
  hideFooter = false,
  children,
}: {
  quiz: Quiz;
  retakeHref: string;
  retakeLabel?: string;
  maxWidthClass?: string;
  titleOverride?: string;
  subtitle?: string;
  headerIcon?: React.ReactNode;
  hideFooter?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 overflow-x-hidden bg-paper pb-16">
      <div className="relative overflow-hidden border-b border-border bg-card">
        <div className={`relative mx-auto ${maxWidthClass} px-6 py-8`}>
          <Link
            href="/"
            className="text-sm font-medium text-walnut-soft hover:text-sienna print:hidden"
          >
            ← All quizzes
          </Link>
          <div className="mt-2 flex flex-wrap items-start justify-between gap-6">
            <div className="min-w-[240px] flex-1">
              <h1 className="font-display text-4xl font-semibold text-walnut sm:text-5xl">
                {titleOverride ?? `${quiz.title} — Your Results`}
              </h1>
              {subtitle && (
                <p className="mt-2 max-w-lg text-lg text-walnut-soft">{subtitle}</p>
              )}
              <button
                type="button"
                onClick={() => window.print()}
                className="mt-4 flex w-full max-w-xs items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left transition hover:border-forest print:hidden"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-soft text-forest">
                  <DownloadIcon className="h-4 w-4" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-walnut">
                    Download as PDF
                  </span>
                  <span className="block text-xs text-walnut-soft">
                    Save or print your results
                  </span>
                </span>
                <ChevronRightIcon className="h-4 w-4 text-walnut-soft" />
              </button>
            </div>
            {headerIcon}
          </div>
        </div>
      </div>

      <div className={`relative mx-auto ${maxWidthClass} px-6 py-8`}>
        {children}

        {!hideFooter && (
          <div className="mt-10 flex flex-col items-center gap-4 print:hidden">
            <Link
              href={retakeHref}
              className="text-lg font-semibold text-sienna hover:text-forest"
            >
              {retakeLabel}
            </Link>
            <PrivacyNote>
              This result wasn&apos;t saved anywhere — closing or refreshing
              this page clears it for good.
            </PrivacyNote>
          </div>
        )}
      </div>
    </div>
  );
}

function NoResultsYet({
  quizId,
  message,
  ctaHref,
  ctaLabel,
}: {
  quizId: string;
  message: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-paper px-6 py-24 text-center">
      <h1 className="font-display text-4xl font-semibold text-walnut">No results yet</h1>
      <p className="max-w-sm text-xl text-walnut-soft">{message}</p>
      <Link
        href={ctaHref ?? `/quiz/${quizId}`}
        className="rounded-full bg-forest px-6 py-3 text-lg font-semibold text-paper transition hover:bg-forest-dark"
      >
        {ctaLabel ?? "Take the quiz"}
      </Link>
    </div>
  );
}

function SingleResult({
  quiz,
  answers,
}: {
  quiz: Quiz;
  answers: StoredAnswers;
}) {
  const scores =
    quiz.flow === "forced-choice-then-result"
      ? scoreForcedChoice(quiz, answers as Record<string, "A" | "B">)
      : scoreRatingByTag(quiz, answers as Record<string, number>);

  const [primary, secondary] = scores;
  const results = quiz.results ?? {};

  if (!primary || !results[primary.tag]) {
    return (
      <p className="text-xl text-walnut-soft">
        We couldn&apos;t score this quiz — please try retaking it.
      </p>
    );
  }

  const primaryResult = normalizeResultContent(results[primary.tag]);
  const secondaryResult =
    secondary && secondary.value > 0 && results[secondary.tag]
      ? normalizeResultContent(results[secondary.tag])
      : null;

  return (
    <div className="flex flex-col gap-6">
      {quiz.quizId === "parenting-style" ? (
        <ParentingStyleResult quiz={quiz} primary={primary} result={primaryResult} />
      ) : (
        <ResultCard result={primaryResult} eyebrow="Your result" />
      )}
      {secondaryResult && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <span className="text-base font-semibold uppercase tracking-wide text-walnut-soft">
            Your secondary tendency
          </span>
          <h3 className="mt-1 font-display text-2xl font-semibold text-walnut">
            {secondaryResult.title}
          </h3>
          <p className="mt-1 text-lg text-walnut-soft">
            {secondaryResult.description}
          </p>
        </div>
      )}
    </div>
  );
}

function CategoryResults({
  quiz,
  answers,
}: {
  quiz: Quiz;
  answers: Record<string, number>;
}) {
  const categories = scoreByCategory(quiz, answers);
  return <MarriageResultCard categories={categories} />;
}

// Per-quiz results-header illustration.
const HEADER_ILLUSTRATION: Record<string, string> = {
  "marriage-compatibility": "/marriage-couple.png",
  "love-languages": "/marriage-couple.png",
  "child-temperament": "/kid-thinking.png",
  "love-languages-child": "/kid-thinking.png",
  "parenting-style": "/parenting-family.png",
  temperament: "/temperament-couple.png",
};

const ILLUSTRATION_SIZE: Record<string, [number, number]> = {
  "/marriage-couple.png": [520, 347],
  "/kid-thinking.png": [520, 347],
  "/parenting-family.png": [475, 340],
  "/temperament-couple.png": [1536, 1024],
};

function ResultsHeaderIcon({ quizId }: { quizId: string }) {
  const src = HEADER_ILLUSTRATION[quizId];
  if (!src) return null;
  const [width, height] = ILLUSTRATION_SIZE[src] ?? [520, 347];
  return (
    <Image
      src={src}
      alt=""
      width={width}
      height={height}
      className="hidden w-64 shrink-0 sm:block"
    />
  );
}

type ChildResult = {
  name: string;
  dominantTag: string;
  dominant: NormalizedResult;
  secondaryTag: string | null;
  secondary: NormalizedResult | null;
};

function MultiSubjectResultsView({ quiz }: { quiz: Quiz }) {
  const rosterRaw = useSyncExternalStore(
    noopSubscribe,
    () => sessionStorage.getItem(rosterKey(quiz.quizId)),
    getServerSnapshot
  );

  const subjectLabel = quiz.multiSubject?.subjectLabel ?? "person";
  const subjectLabelPlural = quiz.multiSubject?.subjectLabelPlural ?? "people";

  if (rosterRaw === null) {
    return (
      <NoResultsYet
        quizId={quiz.quizId}
        message={`Add your ${subjectLabelPlural} and take the quiz for each one to see results here.`}
        ctaLabel={`Add ${subjectLabelPlural}`}
      />
    );
  }

  const names: string[] = JSON.parse(rosterRaw);

  if (quiz.flow === "rating-scale-by-category") {
    return (
      <MultiSubjectCategoryResultsView
        quiz={quiz}
        names={names}
        subjectLabel={subjectLabel}
        subjectLabelPlural={subjectLabelPlural}
      />
    );
  }

  const results = quiz.results ?? {};

  const children: ChildResult[] = names
    .map((name): ChildResult | null => {
      const raw = sessionStorage.getItem(childAnswersKey(quiz.quizId, name));
      if (!raw) return null;
      const answers = JSON.parse(raw) as StoredAnswers;
      const scores =
        quiz.flow === "forced-choice-then-result"
          ? scoreForcedChoice(quiz, answers as Record<string, "A" | "B">)
          : scoreRatingByTag(quiz, answers as Record<string, number>);
      const [primary, secondary] = scores;
      if (!primary || !results[primary.tag]) return null;

      const isClose =
        Boolean(secondary) &&
        secondary!.value > 0 &&
        primary.value - secondary!.value <= primary.value * 0.25;

      return {
        name,
        dominantTag: primary.tag,
        dominant: normalizeResultContent(results[primary.tag]),
        secondaryTag: isClose ? secondary!.tag : null,
        secondary:
          isClose && results[secondary!.tag]
            ? normalizeResultContent(results[secondary!.tag])
            : null,
      };
    })
    .filter((c): c is ChildResult => c !== null);

  if (children.length === 0) {
    return (
      <NoResultsYet
        quizId={quiz.quizId}
        message={`No results yet — take the quiz for at least one ${subjectLabel} to see results here.`}
        ctaLabel={`Add ${subjectLabelPlural}`}
      />
    );
  }

  const useRichCard =
    quiz.quizId === "child-temperament" || quiz.quizId === "temperament";

  return (
    <ResultsShell
      quiz={quiz}
      retakeHref={`/quiz/${quiz.quizId}`}
      retakeLabel={`Manage ${subjectLabelPlural} & retake`}
      headerIcon={<ResultsHeaderIcon quizId={quiz.quizId} />}
      maxWidthClass={useRichCard ? "max-w-5xl" : "max-w-3xl"}
    >
      <div className="flex flex-col gap-10">
        {children.map((c) =>
          useRichCard ? (
            <ChildTemperamentResult
              key={c.name}
              name={c.name}
              dominantTag={c.dominantTag}
              dominant={c.dominant}
              quizId={quiz.quizId}
              hideGlance={quiz.quizId === "temperament" && children.length === 2}
            />
          ) : (
            <div key={c.name} className="flex flex-col gap-6">
              <ResultCard result={c.dominant} eyebrow={`${c.name}'s result`} />
              {c.secondary && (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <span className="text-base font-semibold uppercase tracking-wide text-walnut-soft">
                    Secondary blend
                  </span>
                  <h3 className="mt-1 font-display text-2xl font-semibold text-walnut">
                    {c.secondary.title}
                  </h3>
                </div>
              )}
            </div>
          )
        )}
      </div>

      {quiz.quizId === "temperament" && children.length === 2 && (
        <div className="mt-14">
          <TemperamentCompareCard people={children} />
        </div>
      )}

      {quiz.quizId === "love-languages" && children.length === 2 && (
        <div className="mt-14">
          <LoveLanguageCompareCard people={children} />
        </div>
      )}
    </ResultsShell>
  );
}

function MultiSubjectCategoryResultsView({
  quiz,
  names,
  subjectLabel,
  subjectLabelPlural,
}: {
  quiz: Quiz;
  names: string[];
  subjectLabel: string;
  subjectLabelPlural: string;
}) {
  const people = names
    .map((name) => {
      const raw = sessionStorage.getItem(childAnswersKey(quiz.quizId, name));
      if (!raw) return null;
      const answers = JSON.parse(raw) as Record<string, number>;
      const categories = scoreByCategory(quiz, answers);
      return { name, categories };
    })
    .filter(
      (p): p is { name: string; categories: CategoryScore[] } => p !== null
    );

  if (people.length === 0) {
    return (
      <NoResultsYet
        quizId={quiz.quizId}
        message={`No results yet — take the quiz for at least one ${subjectLabel} to see results here.`}
        ctaLabel={`Add ${subjectLabelPlural}`}
      />
    );
  }

  const isCompare = people.length === 2;

  return (
    <ResultsShell
      quiz={quiz}
      retakeHref={`/quiz/${quiz.quizId}`}
      retakeLabel={`Manage ${subjectLabelPlural} & retake`}
      maxWidthClass="max-w-5xl"
      titleOverride={isCompare ? `${quiz.title.split("—")[0].trim()} — How We Compare` : undefined}
      subtitle={
        isCompare
          ? "See your relationship strengths, celebrate what's working, and discover where you can grow together."
          : "Here's a personalized look at your relationship and how you can grow together."
      }
      headerIcon={<ResultsHeaderIcon quizId={quiz.quizId} />}
      hideFooter
    >
      {isCompare ? (
        <MarriageCompareCard people={people} />
      ) : (
        <div className="flex flex-col gap-14">
          {people.map((p) => (
            <div key={p.name}>
              {people.length > 1 && (
                <h3 className="mb-4 font-display text-2xl font-semibold text-walnut">
                  {p.name}&apos;s results
                </h3>
              )}
              <MarriageResultCard
                name={people.length > 1 ? p.name : undefined}
                categories={p.categories}
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 flex flex-col items-center gap-5 print:hidden">
        <span className="text-xs font-bold uppercase tracking-wide text-walnut-soft">
          Manage your relationship
        </span>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/quiz/${quiz.quizId}`}
            className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-base font-semibold text-walnut transition hover:border-forest"
          >
            <TwoPersonIcon className="h-4 w-4" />
            {`Manage ${subjectLabelPlural}`}
          </Link>
          <Link
            href={`/quiz/${quiz.quizId}`}
            className="flex items-center gap-2 rounded-full bg-sienna px-5 py-2.5 text-base font-semibold text-paper transition hover:opacity-90"
          >
            <RefreshIcon className="h-4 w-4" />
            Retake quiz
          </Link>
        </div>
        <PrivacyNote>
          This result wasn&apos;t saved anywhere — closing or refreshing this
          page clears it for good.
        </PrivacyNote>
      </div>
    </ResultsShell>
  );
}
