import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getAllQuizzes, getQuizById } from "@/lib/quizzes";
import QuizTaker from "./QuizTaker";

export function generateStaticParams() {
  return getAllQuizzes().map((quiz) => ({ quizId: quiz.quizId }));
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const quiz = getQuizById(quizId);

  if (!quiz) notFound();

  return (
    <Suspense fallback={null}>
      <QuizTaker quiz={quiz} />
    </Suspense>
  );
}
