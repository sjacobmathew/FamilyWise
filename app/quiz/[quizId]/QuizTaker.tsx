"use client";

import { useState } from "react";
import type { Quiz } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import ChildRoster from "@/components/ChildRoster";
import CharismIntro from "@/components/CharismIntro";
import { CHARISM_QUIZ_ID } from "@/lib/charism";
import SteppedQuestionsFlow from "@/components/SteppedQuestionsFlow";
import CategorySteppedFlow from "@/components/CategorySteppedFlow";
import { childAnswersKey } from "@/lib/childRoster";

const ANSWERS_STORAGE_PREFIX = "familywise:answers:";

// Multi-category quizzes (currently only Marriage Compatibility) use the
// section-based stepped flow, grouped by category with a jumpable section
// list. Everything else uses the simpler single-track stepped flow.
function Flow(props: React.ComponentProps<typeof SteppedQuestionsFlow>) {
  if (props.quiz.flow === "rating-scale-by-category") {
    return <CategorySteppedFlow {...props} />;
  }
  return <SteppedQuestionsFlow {...props} />;
}

export default function QuizTaker({ quiz }: { quiz: Quiz }) {
  if (quiz.multiSubject) {
    return <MultiSubjectQuizTaker quiz={quiz} />;
  }

  if (quiz.quizId === CHARISM_QUIZ_ID) {
    return <CharismQuizTaker quiz={quiz} />;
  }

  return (
    <Flow
      quiz={quiz}
      storageKey={`${ANSWERS_STORAGE_PREFIX}${quiz.quizId}`}
      onSubmitted={(router) => router.push(`/quiz/${quiz.quizId}/results`)}
    />
  );
}

// The Charism Assessment opens on a "Before you begin" screen (prayer,
// Scripture, instructions) before the first question.
function CharismQuizTaker({ quiz }: { quiz: Quiz }) {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <CharismIntro
        quiz={quiz}
        onBegin={() => {
          setStarted(true);
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  return (
    <Flow
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
    <Flow
      quiz={quiz}
      storageKey={childAnswersKey(quiz.quizId, child)}
      subjectName={child}
      onSubmitted={(router) => router.push(`/quiz/${quiz.quizId}`)}
    />
  );
}
