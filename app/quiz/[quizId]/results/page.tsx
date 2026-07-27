import { notFound } from "next/navigation";
import { getAllQuizzes, getQuizById } from "@/lib/quizzes";
import ResultsView from "./ResultsView";

export function generateStaticParams() {
  return getAllQuizzes().map((quiz) => ({ quizId: quiz.quizId }));
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const quiz = getQuizById(quizId);

  if (!quiz) notFound();

  return <ResultsView quiz={quiz} />;
}
