import type { NormalizedResult } from "@/lib/scoring";

export default function ResultCard({
  result,
  eyebrow,
}: {
  result: NormalizedResult;
  eyebrow?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
      {eyebrow && (
        <span className="font-times text-xl text-sienna">{eyebrow}</span>
      )}
      <h2 className="mt-1 text-[2.25rem] font-bold text-walnut sm:text-[2.75rem]">
        {result.title}
      </h2>
      {result.description && (
        <p className="mt-3 text-xl leading-relaxed text-walnut-soft">
          {result.description}
        </p>
      )}

      {(result.strengths?.length || result.growthEdges?.length) && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {result.strengths?.length ? (
            <div>
              <h3 className="text-xl font-semibold text-forest">
                Strengths
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.strengths.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-forest-soft px-3 py-1 text-base font-medium text-forest"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {result.growthEdges?.length ? (
            <div>
              <h3 className="text-xl font-semibold text-gold">
                Growth edges
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.growthEdges.map((g) => (
                  <span
                    key={g}
                    className="rounded-full bg-gold-soft px-3 py-1 text-base font-medium text-gold"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {result.tips.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-walnut">Tips</h3>
          <ul className="mt-2 flex flex-col gap-2">
            {result.tips.map((tip) => (
              <li
                key={tip}
                className="flex gap-2 text-xl leading-relaxed text-walnut-soft"
              >
                <span className="mt-0.5 text-sienna">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
