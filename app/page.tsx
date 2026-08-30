import { getQuizzesByCategory } from "@/lib/quizzes";
import QuizCard from "@/components/QuizCard";
import ModernAccent from "@/components/ModernAccent";
import PrivacyNote from "@/components/PrivacyNote";

const FOREST = "var(--color-forest)";
const FOREST_LIGHT = "var(--color-forest-soft)";
const SIENNA = "var(--color-sienna)";
const GOLD = "var(--color-gold)";

const MARGIN_ACCENTS = [
  [
    { variant: "ring" as const, color: SIENNA, rotate: 0 },
    { variant: "dots" as const, color: FOREST, rotate: 0 },
  ],
  [
    { variant: "blob" as const, color: GOLD, rotate: 10 },
    { variant: "arc" as const, color: SIENNA, rotate: -20 },
  ],
  [
    { variant: "halfDisc" as const, color: FOREST, rotate: 180 },
    { variant: "squiggle" as const, color: GOLD, rotate: 0 },
  ],
];

export default function Home() {
  const groups = getQuizzesByCategory();

  return (
    <div className="flex-1 overflow-x-hidden bg-paper">
      <header className="relative overflow-hidden border-b border-border bg-forest">
        {/* Smaller corner-only set for phones — the shapes above are all
            sm:/lg:/xl:-gated and don't show below 640px otherwise. */}
        <ModernAccent variant="ring" color={SIENNA} width="46px" opacity={0.6} className="absolute block sm:hidden" style={{ position: "absolute", top: "6%", left: "5%" }} />
        <ModernAccent variant="blob" color={GOLD} width="54px" rotate={8} opacity={0.6} className="absolute block sm:hidden" style={{ position: "absolute", top: "6%", right: "5%" }} />
        <ModernAccent variant="dots" dotSet="a" color={FOREST_LIGHT} width="38px" opacity={0.8} className="absolute block sm:hidden" style={{ position: "absolute", bottom: "8%", left: "6%" }} />
        <ModernAccent variant="arc" color={SIENNA} width="46px" rotate={-10} opacity={0.6} className="absolute block sm:hidden" style={{ position: "absolute", bottom: "6%", right: "6%" }} />

        <ModernAccent variant="ring" color={SIENNA} width="92px" opacity={0.6} className="absolute hidden sm:block" style={{ position: "absolute", top: "8%", left: "4%" }} />
        <ModernAccent variant="dots" dotSet="a" color={FOREST_LIGHT} width="76px" opacity={0.8} className="absolute hidden sm:block" style={{ position: "absolute", top: "13%", left: "21%" }} />
        <ModernAccent variant="blob" color={GOLD} width="112px" rotate={8} opacity={0.65} className="absolute hidden sm:block" style={{ position: "absolute", top: "5%", right: "5%" }} />
        <ModernAccent variant="halfDisc" color={FOREST_LIGHT} width="82px" rotate={-20} opacity={0.5} className="absolute hidden sm:block" style={{ position: "absolute", top: "16%", right: "23%" }} />
        <ModernAccent variant="plus" color={SIENNA} width="42px" rotate={15} opacity={0.75} className="absolute hidden lg:block" style={{ position: "absolute", bottom: "14%", left: "10%" }} />
        <ModernAccent variant="arc" color={GOLD} width="90px" rotate={-10} opacity={0.6} className="absolute hidden lg:block" style={{ position: "absolute", bottom: "1%", left: "17%" }} />
        <ModernAccent variant="disc" color={FOREST_LIGHT} width="52px" opacity={0.45} className="absolute hidden lg:block" style={{ position: "absolute", bottom: "16%", right: "8%" }} />
        <ModernAccent variant="squiggle" color={SIENNA} width="94px" opacity={0.6} className="absolute hidden lg:block" style={{ position: "absolute", bottom: "6%", right: "25%" }} />
        <ModernAccent variant="dots" dotSet="b" color={GOLD} width="64px" opacity={0.55} className="absolute hidden xl:block" style={{ position: "absolute", top: "42%", left: "1%" }} />
        <ModernAccent variant="ring" color={FOREST_LIGHT} width="60px" opacity={0.5} className="absolute hidden xl:block" style={{ position: "absolute", top: "38%", right: "1%" }} />

        <div className="relative mx-auto max-w-5xl px-6 py-20 text-center sm:py-28">
          <h1 className="font-script whitespace-nowrap text-[clamp(3.5rem,11vw,6.5rem)] font-normal text-paper">
            Family<span className="text-sienna">Wise</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-2xl text-forest-soft">
            Helping families understand, connect, and thrive.
          </p>
          <PrivacyNote className="mt-6 justify-center !text-forest-soft [&>svg]:!text-gold">
            Nothing you answer is saved or sent anywhere — results live only
            in this browser tab, and disappear when you close it.
          </PrivacyNote>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-6 py-14">
        {groups.map(({ category, quizzes }, i) => {
          const [left, right] = MARGIN_ACCENTS[i % MARGIN_ACCENTS.length];
          return (
            <section key={category} className="relative mb-16 last:mb-0">
              <ModernAccent
                variant={left.variant}
                color={left.color}
                rotate={left.rotate}
                width="88px"
                opacity={0.55}
                className="absolute hidden xl:block"
                style={{ position: "absolute", top: "8%", left: "-14%" }}
              />
              <ModernAccent
                variant={right.variant}
                color={right.color}
                rotate={right.rotate}
                width="80px"
                opacity={0.55}
                className="absolute hidden xl:block"
                style={{ position: "absolute", top: "40%", right: "-14%" }}
              />
              <h2 className="mb-6 text-3xl font-bold text-walnut">
                {category}
              </h2>
              <div
                className={
                  quizzes.length === 1
                    ? "max-w-sm"
                    : quizzes.length === 2
                      ? "grid gap-5 sm:grid-cols-2"
                      : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                }
              >
                {quizzes.map((quiz) => (
                  <QuizCard key={quiz.quizId} quiz={quiz} />
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
