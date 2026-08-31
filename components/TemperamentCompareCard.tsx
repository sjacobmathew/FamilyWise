import type { NormalizedResult } from "@/lib/scoring";
import {
  TEMPERAMENT_GLANCE,
  DEFAULT_GLANCE,
  TEMPERAMENT_PAIR_INSIGHT,
  DEFAULT_PAIR_INSIGHT,
  pairInsightKey,
} from "@/lib/childTemperamentContent";
import { THEME_ICON } from "@/components/ChildTemperamentResult";
import { HeartIcon, SunIcon } from "@/components/HomeIcons";

type Person = {
  name: string;
  dominantTag: string;
  dominant: NormalizedResult;
};

const IDENTITY = [
  { color: "#D9776E", bg: "#FBE1DE" },
  { color: "#9B90C9", bg: "#EFEBF9" },
];

export default function TemperamentCompareCard({
  people,
}: {
  people: Person[];
}) {
  const [a, b] = people;
  const insight =
    TEMPERAMENT_PAIR_INSIGHT[pairInsightKey(a.dominantTag, b.dominantTag)] ??
    DEFAULT_PAIR_INSIGHT;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-2xl font-semibold text-walnut">
        How {a.name} &amp; {b.name} compare
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {[a, b].map((p, i) => {
          const ThemeIcon = THEME_ICON[p.dominantTag] ?? SunIcon;
          const identity = IDENTITY[i];
          return (
            <div key={p.name} className="rounded-3xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: identity.bg, color: identity.color }}
                >
                  <ThemeIcon className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-walnut-soft">{p.name}</p>
                  <h3 className="font-display text-xl font-semibold text-walnut">
                    {p.dominant.title}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl bg-forest-soft/60 p-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-forest">
          <HeartIcon className="h-5 w-5" />
        </span>
        <h3 className="font-display mt-3 text-xl font-semibold text-walnut">
          How you connect
        </h3>
        <p className="mt-2 text-base leading-relaxed text-walnut">{insight}</p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-walnut-soft">
          Side by side
        </h3>
        <div className="mt-4 flex flex-col divide-y divide-border">
          {(
            [
              ["thinksAndFeels", "Thinks & feels"],
              ["relates", "Relates"],
              ["reacts", "Reacts"],
              ["needs", "Needs"],
            ] as const
          ).map(([key, label]) => {
            const glanceA = TEMPERAMENT_GLANCE[a.dominantTag] ?? DEFAULT_GLANCE;
            const glanceB = TEMPERAMENT_GLANCE[b.dominantTag] ?? DEFAULT_GLANCE;
            return (
              <div key={key} className="grid gap-2 py-4 sm:grid-cols-[120px_1fr_1fr] sm:gap-4">
                <p className="text-sm font-semibold text-walnut-soft">{label}</p>
                <p className="text-sm text-walnut">
                  <span className="font-semibold" style={{ color: IDENTITY[0].color }}>
                    {a.name}:
                  </span>{" "}
                  {glanceA[key]}
                </p>
                <p className="text-sm text-walnut">
                  <span className="font-semibold" style={{ color: IDENTITY[1].color }}>
                    {b.name}:
                  </span>{" "}
                  {glanceB[key]}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
