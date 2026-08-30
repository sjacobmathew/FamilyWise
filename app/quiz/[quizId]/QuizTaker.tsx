"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type {
  ForcedChoiceQuestion,
  Quiz,
  RatingQuestion,
} from "@/lib/types";
import { countAnswered, getTagKey } from "@/lib/scoring";
import ProgressBar from "@/components/ProgressBar";
import RatingQuestionCard from "@/components/RatingQuestionCard";
import ForcedChoiceQuestionCard from "@/components/ForcedChoiceQuestionCard";
import PrivacyNote from "@/components/PrivacyNote";
import ChildRoster from "@/components/ChildRoster";
import { childAnswersKey } from "@/lib/childRoster";

const ANSWERS_STORAGE_PREFIX = "familywise:answers:";

function isForcedChoice(
  question: RatingQuestion | ForcedChoiceQuestion
): question is ForcedChoiceQuestion {
  return "optionA" in question;
}

export default function QuizTaker({ quiz }: { quiz: Quiz }) {
  if (quiz.multiSubject) {
    return <MultiSubjectQuizTaker quiz={quiz} />;
  }

  return (
    <QuestionsFlow
      quiz={quiz}
      storageKey={`${ANSWERS_STORAGE_PREFIX}${quiz.quizId}`}
      onSubmitted={(router) => router.push(`/quiz/${quiz.quizId}/results`)}
    />
  );
}

function MultiSubjectQuizTaker({ quiz }: { quiz: Quiz }) {
  const searchParams = useSearchParams();
  const child = searchParams.get("child");

  if (!child) {
    return <ChildRoster quiz={quiz} />;
  }

  return (
    <QuestionsFlow
      quiz={quiz}
      storageKey={childAnswersKey(quiz.quizId, child)}
      subjectName={child}
      onSubmitted={(router) => router.push(`/quiz/${quiz.quizId}`)}
    />
  );
}

function QuestionsFlow({
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
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const isPerChild = Boolean(subjectName);

  // When the quiz defines named categories, tag each question with the
  // category label that should appear above it — only on the first
  // question of each run, so the label reads as a section heading rather
  // than repeating on every question. Categories marked `optional` aren't
  // required to submit and don't count toward progress.
  const categoryNames = new Map(
    (quiz.categories ?? []).map((c) => [c.id, c.name])
  );
  const optionalCategoryIds = new Set(
    (quiz.categories ?? []).filter((c) => c.optional).map((c) => c.id)
  );
  const tagKey =
    quiz.categories && quiz.questions.length > 0 && !isForcedChoice(quiz.questions[0])
      ? getTagKey(quiz.questions[0] as Record<string, unknown>, ["id", "text"])
      : null;
  let lastCategoryId: string | undefined;
  const questionItems = quiz.questions.map((question, i) => {
    let categoryLabel: string | null = null;
    let optional = false;
    if (tagKey && !isForcedChoice(question)) {
      const catId = (question as RatingQuestion)[tagKey];
      optional = optionalCategoryIds.has(catId);
      if (catId !== lastCategoryId) {
        categoryLabel = categoryNames.get(catId) ?? catId;
        lastCategoryId = catId;
      }
    }
    return { question, index: i, categoryLabel, optional };
  });
  const requiredQuestions = questionItems
    .filter((item) => !item.optional)
    .map((item) => item.question);

  const total = requiredQuestions.length;
  const answered = countAnswered({ ...quiz, questions: requiredQuestions }, answers);

  function setAnswer(questionId: string, value: number | "A" | "B") {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function handleSubmit() {
    const firstUnanswered = requiredQuestions.find(
      (q) => answers[q.id] === undefined
    );

    if (firstUnanswered) {
      setAttemptedSubmit(true);
      const el = document.querySelector(
        `[data-question-id="${firstUnanswered.id}"]`
      );
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    sessionStorage.setItem(storageKey, JSON.stringify(answers));
    onSubmitted(router);
  }

  return (
    <div className="flex-1 bg-paper pb-32">
      <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <Link
            href={isPerChild ? `/quiz/${quiz.quizId}` : "/"}
            className="text-sm font-medium text-walnut-soft hover:text-sienna"
          >
            {isPerChild
              ? `← Back to ${quiz.multiSubject?.subjectLabelPlural ?? "list"}`
              : "← All quizzes"}
          </Link>
          <h1 className="mt-1 text-3xl font-bold text-walnut sm:text-4xl">
            {quiz.title}
            {isPerChild && <span className="text-sienna"> — for {subjectName}</span>}
          </h1>
          <div className="mt-3">
            <ProgressBar answered={answered} total={total} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-8">
        {quiz.description && (
          <p className="mb-4 text-xl text-walnut-soft">{quiz.description}</p>
        )}
        {quiz.instructions && (
          <p className="mb-6 rounded-lg bg-sienna-soft px-4 py-3 text-lg text-sienna">
            {quiz.instructions}
          </p>
        )}

        <PrivacyNote className="mb-6">
          Private by design — your answers aren&apos;t saved or sent to a
          server, even if this quiz touches sensitive territory.
        </PrivacyNote>

        <div className="flex flex-col gap-4">
          {questionItems.map(({ question, index, categoryLabel, optional }) => (
            <div key={question.id}>
              {categoryLabel && (
                <h2 className="font-times mb-1 mt-6 flex items-baseline gap-2 text-2xl text-sienna first:mt-0">
                  {categoryLabel}
                  {optional && (
                    <span className="text-sm font-medium text-walnut-soft">
                      optional — skip if it doesn&apos;t apply to you
                    </span>
                  )}
                </h2>
              )}
              <div data-question-id={question.id}>
                {isForcedChoice(question) ? (
                  <ForcedChoiceQuestionCard
                    index={index + 1}
                    optionAText={question.optionA.text}
                    optionBText={question.optionB.text}
                    selected={answers[question.id] as "A" | "B" | undefined}
                    unanswered={
                      !optional &&
                      attemptedSubmit &&
                      answers[question.id] === undefined
                    }
                    onSelect={(choice) => setAnswer(question.id, choice)}
                  />
                ) : (
                  <RatingQuestionCard
                    index={index + 1}
                    text={question.text}
                    answerOptions={quiz.answerOptions ?? []}
                    selected={answers[question.id] as number | undefined}
                    unanswered={
                      !optional &&
                      attemptedSubmit &&
                      answers[question.id] === undefined
                    }
                    onSelect={(points) => setAnswer(question.id, points)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
          <span className="text-base text-walnut-soft">
            {answered === total
              ? isPerChild
                ? `All done for ${subjectName} — ready to save?`
                : "All done — ready to see your results?"
              : `${total - answered} question${
                  total - answered === 1 ? "" : "s"
                } left`}
          </span>
          <button
            type="button"
            onClick={handleSubmit}
            className="font-times rounded bg-forest px-7 py-3 text-2xl text-paper shadow-sm transition hover:bg-forest-dark"
          >
            {isPerChild ? "Save & continue" : "See my results"}
          </button>
        </div>
      </div>
    </div>
  );
}
