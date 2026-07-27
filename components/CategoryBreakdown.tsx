import type { CategoryScore } from "@/lib/scoring";

const BAND_STYLES: Record<CategoryScore["band"], { bar: string; badge: string }> = {
  "Room to Grow": {
    bar: "bg-sienna",
    badge: "bg-sienna-soft text-sienna",
  },
  "Solid Ground": {
    bar: "bg-gold",
    badge: "bg-gold-soft text-gold",
  },
  "Real Strength": {
    bar: "bg-forest",
    badge: "bg-forest-soft text-forest",
  },
};

export default function CategoryBreakdown({
  categories,
}: {
  categories: CategoryScore[];
}) {
  return (
    <div className="flex flex-col gap-4">
      {categories.map((c) => {
        const styles = BAND_STYLES[c.band];
        return (
          <div key={c.id} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-2xl font-bold text-walnut">{c.name}</h3>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold ${styles.badge}`}
              >
                {c.band}
              </span>
            </div>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-paper">
              <div
                className={`h-full rounded-full ${styles.bar}`}
                style={{ width: `${Math.max(4, c.percent)}%` }}
              />
            </div>
            <p className="mt-1.5 text-base text-walnut-soft">
              Average {c.average.toFixed(1)} / {c.maxPoints}
            </p>
          </div>
        );
      })}
    </div>
  );
}
