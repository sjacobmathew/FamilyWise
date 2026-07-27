import { getQuizzesByCategory } from "@/lib/quizzes";
import QuizCard from "@/components/QuizCard";

export default function Home() {
  const groups = getQuizzesByCategory();

  return (
    <div className="flex-1 bg-cream">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-6 py-14 text-center sm:py-20">
          <h1 className="font-script whitespace-nowrap text-[clamp(2.75rem,10vw,5.5rem)] font-semibold text-ink">
            Family<span className="text-terracotta">Wise</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
            Helping families understand, connect, and thrive.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        {groups.map(({ category, quizzes }) => (
          <section key={category} className="mb-14 last:mb-0">
            <h2 className="mb-5 text-2xl font-semibold text-ink">
              {category}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((quiz) => (
                <QuizCard key={quiz.quizId} quiz={quiz} />
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
