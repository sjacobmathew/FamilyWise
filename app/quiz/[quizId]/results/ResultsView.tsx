"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
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
import CategoryBreakdown from "@/components/CategoryBreakdown";
import SiblingTipCard from "@/components/SiblingTipCard";
import HouseholdChildrenForm from "@/components/HouseholdChildrenForm";
import ModernAccent from "@/components/ModernAccent";
import PrivacyNote from "@/components/PrivacyNote";
import { childAnswersKey, rosterKey } from "@/lib/childRoster";

const FOREST = "var(--color-forest)";
const SIENNA = "var(--color-sienna)";
const GOLD = "var(--color-gold)";

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

  const isParentingStyle = quiz.quizId === "parenting-style";
  const parentScores =
    quiz.flow === "forced-choice-then-result"
      ? scoreForcedChoice(quiz, answers as Record<string, "A" | "B">)
      : scoreRatingByTag(quiz, answers as Record<string, number>);
  const [parentPrimary, parentSecondary] = parentScores;
  const showHousehold =
    isParentingStyle &&
    Boolean(parentPrimary) &&
    Boolean(quiz.results?.[parentPrimary?.tag ?? ""]);

  return (
    <ResultsShell quiz={quiz} retakeHref={`/quiz/${quiz.quizId}`}>
      {quiz.flow === "rating-scale-by-category" ? (
        <CategoryResults
          quiz={quiz}
          answers={answers as Record<string, number>}
        />
      ) : (
        <SingleResult quiz={quiz} answers={answers} />
      )}

      {showHousehold && (
        <div className="mt-10">
          <HouseholdChildrenForm
            quizId={quiz.quizId}
            parent={{
              dominant: capitalize(parentPrimary!.tag),
              secondary:
                parentSecondary && parentSecondary.value > 0
                  ? capitalize(parentSecondary.tag)
                  : undefined,
            }}
          />
        </div>
      )}
    </ResultsShell>
  );
}

function ResultsShell({
  quiz,
  retakeHref,
  retakeLabel = "Retake this quiz",
  maxWidthClass = "max-w-3xl",
  children,
}: {
  quiz: Quiz;
  retakeHref: string;
  retakeLabel?: string;
  maxWidthClass?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 overflow-x-hidden bg-paper pb-16">
      <div className="relative overflow-hidden border-b border-border bg-card">
        <ModernAccent variant="blob" color={GOLD} width="120px" rotate={-8} opacity={0.6} className="absolute hidden sm:block print:hidden" style={{ position: "absolute", top: "6%", right: "5%" }} />
        <ModernAccent variant="ring" color={SIENNA} width="90px" opacity={0.55} className="absolute hidden md:block print:hidden" style={{ position: "absolute", bottom: "8%", left: "5%" }} />
        <ModernAccent variant="dots" dotSet="a" color={FOREST} width="70px" opacity={0.7} className="absolute hidden xl:block print:hidden" style={{ position: "absolute", top: "55%", left: "4%" }} />

        <div className={`relative mx-auto ${maxWidthClass} px-6 py-8`}>
          <Link
            href="/"
            className="text-sm font-medium text-walnut-soft hover:text-sienna print:hidden"
          >
            ← All quizzes
          </Link>
          <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
            <h1 className="text-4xl font-bold text-walnut sm:text-5xl">
              {quiz.title} — Your Results
            </h1>
            <button
              type="button"
              onClick={() => window.print()}
              className="font-times shrink-0 rounded border border-forest px-4 py-2 text-lg text-forest hover:bg-forest-soft print:hidden"
            >
              Download as PDF
            </button>
          </div>
        </div>
      </div>

      <div className={`relative mx-auto ${maxWidthClass} px-6 py-8`}>
        <ModernAccent variant="arc" color={SIENNA} width="100px" rotate={14} opacity={0.6} className="absolute hidden xl:block print:hidden" style={{ position: "absolute", top: "8%", right: "-13%" }} />
        <ModernAccent variant="halfDisc" color={FOREST} width="90px" rotate={100} opacity={0.5} className="absolute hidden xl:block print:hidden" style={{ position: "absolute", top: "55%", left: "-14%" }} />

        {children}

        <div className="mt-10 flex flex-col items-center gap-4 print:hidden">
          <Link
            href={retakeHref}
            className="font-times text-2xl text-sienna hover:text-forest"
          >
            {retakeLabel}
          </Link>
          <PrivacyNote>
            This result wasn&apos;t saved anywhere — closing or refreshing
            this page clears it for good.
          </PrivacyNote>
        </div>
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
      <h1 className="text-4xl font-bold text-walnut">No results yet</h1>
      <p className="max-w-sm text-xl text-walnut-soft">{message}</p>
      <Link
        href={ctaHref ?? `/quiz/${quizId}`}
        className="font-times rounded bg-forest px-6 py-3 text-2xl text-paper"
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
      <ResultCard result={primaryResult} eyebrow="Your result" />
      {secondaryResult && (
        <div className="rounded-lg border border-border bg-card p-5">
          <span className="text-base font-semibold uppercase tracking-wide text-walnut-soft">
            Your secondary tendency
          </span>
          <h3 className="mt-1 text-2xl font-bold text-walnut">
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
  return <CategoryBreakdown categories={categories} />;
}

type ChildResult = {
  name: string;
  dominantTag: string;
  dominant: NormalizedResult;
  secondaryTag: string | null;
  secondary: NormalizedResult | null;
};

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function pairs<T>(arr: T[]): [T, T][] {
  const result: [T, T][] = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      result.push([arr[i], arr[j]]);
    }
  }
  return result;
}

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
      const answers = JSON.parse(raw) as Record<string, number>;
      const scores = scoreRatingByTag(quiz, answers);
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

  return (
    <ResultsShell
      quiz={quiz}
      retakeHref={`/quiz/${quiz.quizId}`}
      retakeLabel={`Manage ${subjectLabelPlural} & retake`}
      maxWidthClass="max-w-3xl"
    >
      <div className="flex flex-col gap-10">
        {children.map((c) => (
          <div key={c.name} className="flex flex-col gap-6">
            <ResultCard result={c.dominant} eyebrow={`${c.name}'s result`} />
            {c.secondary && (
              <div className="rounded-lg border border-border bg-card p-5">
                <span className="text-base font-semibold uppercase tracking-wide text-walnut-soft">
                  Secondary blend
                </span>
                <h3 className="mt-1 text-2xl font-bold text-walnut">
                  {c.secondary.title}
                </h3>
              </div>
            )}
          </div>
        ))}
      </div>

      {children.length > 1 && (
        <>
          <div className="mt-10 flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-walnut">Sibling tips</h2>
            {pairs(children).map(([a, b]) => (
              <SiblingTipCard
                key={`${a.name}::${b.name}`}
                quizId={quiz.quizId}
                childA={{
                  name: a.name,
                  dominant: capitalize(a.dominantTag),
                  secondary: a.secondaryTag ? capitalize(a.secondaryTag) : undefined,
                }}
                childB={{
                  name: b.name,
                  dominant: capitalize(b.dominantTag),
                  secondary: b.secondaryTag ? capitalize(b.secondaryTag) : undefined,
                }}
              />
            ))}
          </div>
        </>
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

  return (
    <ResultsShell
      quiz={quiz}
      retakeHref={`/quiz/${quiz.quizId}`}
      retakeLabel={`Manage ${subjectLabelPlural} & retake`}
      maxWidthClass={people.length > 1 ? "max-w-4xl" : "max-w-3xl"}
    >
      <div className={people.length > 1 ? "grid gap-8 sm:grid-cols-2" : ""}>
        {people.map((p) => (
          <div key={p.name}>
            <h3 className="mb-3 text-2xl font-bold text-walnut">
              {p.name}&apos;s results
            </h3>
            <CategoryBreakdown categories={p.categories} />
          </div>
        ))}
      </div>
    </ResultsShell>
  );
}
