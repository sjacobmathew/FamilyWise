import Link from "next/link";
import type { Quiz } from "@/lib/types";

const FLOW_LABELS: Record<Quiz["flow"], string> = {
  "rating-scale-then-result": "Rate yourself",
  "forced-choice-then-result": "Pick one",
  "rating-scale-by-category": "Rate & compare",
};

export default function QuizCard({ quiz }: { quiz: Quiz }) {
  return (
    <Link
      href={`/quiz/${quiz.quizId}`}
      className="group flex flex-col justify-between rounded border border-border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div>
        <span className="font-times inline-block rounded-full bg-sienna-soft px-3 py-1 text-lg text-sienna">
          {FLOW_LABELS[quiz.flow]}
        </span>
        <h3 className="mt-3 text-2xl font-bold text-walnut">{quiz.title}</h3>
        <p className="mt-2 text-xl leading-relaxed text-walnut-soft">
          {quiz.description}
        </p>
      </div>
      <div className="font-times mt-5 flex items-center gap-1 text-2xl text-sienna">
        Take the quiz
        <span className="transition group-hover:translate-x-1">→</span>
      </div>
    </Link>
  );
}
