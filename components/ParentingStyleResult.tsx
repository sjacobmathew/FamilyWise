import type { Quiz } from "@/lib/types";
import type { NormalizedResult, TagScore } from "@/lib/scoring";
import { getTagKey } from "@/lib/scoring";
import {
  BadgeIcon,
  CheckCircleIcon,
  HeartIcon,
  LeafSprig,
  LightbulbIcon,
  MountainIcon,
  PottedPlantIcon,
} from "@/components/HomeIcons";

function matchTier(percent: number): string {
  if (percent >= 85) return "Strongly you!";
  if (percent >= 60) return "Great balance!";
  return "A mixed style";
}

export default function ParentingStyleResult({
  quiz,
  primary,
  result,
}: {
  quiz: Quiz;
  primary: TagScore;
  result: NormalizedResult;
}) {
  const tagKey = getTagKey(quiz.questions[0] as Record<string, unknown>, ["id", "text"]);
  const questionCount = quiz.questions.filter(
    (q) => (q as unknown as Record<string, string>)[tagKey] === primary.tag
  ).length;
  const maxPoints = Math.max(...(quiz.answerOptions?.map((o) => o.points) ?? [1]));
  const maxPossible = questionCount * maxPoints || 1;
  const percent = Math.round((primary.value / maxPossible) * 100);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-forest-soft text-forest">
              <BadgeIcon className="h-8 w-8" />
            </span>
            <div>
              <span className="font-times text-lg text-sienna">Your result</span>
              <h2 className="font-display text-[2rem] font-semibold text-walnut sm:text-[2.5rem]">
                {result.title}
              </h2>
              <p className="mt-2 max-w-lg text-lg leading-relaxed text-walnut-soft">
                {result.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <svg viewBox="0 0 100 58" className="h-24 w-40">
              <path
                d="M10,55 A40,40 0 0 1 90,55"
                fill="none"
                stroke="#ECE7DC"
                strokeWidth="9"
                strokeLinecap="round"
                pathLength={100}
              />
              <path
                d="M10,55 A40,40 0 0 1 90,55"
                fill="none"
                stroke="#7C9473"
                strokeWidth="9"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray={`${percent} 100`}
              />
              <foreignObject x="30" y="16" width="40" height="20">
                <div className="flex justify-center text-forest">
                  <HeartIcon className="h-5 w-5" />
                </div>
              </foreignObject>
              <text x="50" y="50" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1C1C1C" fontFamily="var(--font-display)">
                {percent}%
              </text>
            </svg>
            <span className="-mt-2 text-sm text-walnut-soft">Match</span>
            <span className="rounded-full bg-forest-soft px-4 py-1.5 text-sm font-semibold text-forest">
              {matchTier(percent)}
            </span>
          </div>
        </div>
      </div>

      {(result.strengths?.length || result.growthEdges?.length) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {result.strengths?.length ? (
            <div className="rounded-3xl bg-forest-soft/50 p-6">
              <h3 className="flex items-center gap-2 text-xl font-semibold text-forest">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                  <LeafSprig className="h-4 w-4 text-forest" />
                </span>
                Your strengths
              </h3>
              <ul className="mt-3 flex flex-col gap-2">
                {result.strengths.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-base text-walnut">
                    <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {result.growthEdges?.length ? (
            <div className="rounded-3xl bg-gold-soft/50 p-6">
              <h3 className="flex items-center gap-2 text-xl font-semibold text-gold">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                  <MountainIcon className="h-4 w-4 text-gold" />
                </span>
                Growth edges
              </h3>
              <ul className="mt-3 flex flex-col gap-2">
                {result.growthEdges.map((g) => (
                  <li key={g} className="flex items-start gap-2 text-base text-walnut">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}

      {result.tips.length > 0 && (
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-8">
          <h3 className="flex items-center gap-2 text-xl font-semibold text-walnut">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sienna-soft text-sienna">
              <LightbulbIcon className="h-4 w-4" />
            </span>
            Personalized tips for you
          </h3>
          <ol className="mt-4 flex flex-col gap-4">
            {result.tips.map((tip, i) => (
              <li key={tip} className="flex items-start gap-3 border-b border-border pb-4 last:border-0 last:pb-0">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sienna-soft text-sm font-bold text-sienna">
                  {i + 1}
                </span>
                <p className="text-base leading-relaxed text-walnut-soft">{tip}</p>
              </li>
            ))}
          </ol>
          <PottedPlantIcon className="pointer-events-none absolute bottom-4 right-6 hidden h-16 w-16 text-forest/40 sm:block" />
        </div>
      )}
    </div>
  );
}
