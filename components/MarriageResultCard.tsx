"use client";

import { useState } from "react";
import type { CategoryScore } from "@/lib/scoring";
import {
  CheckCircleIcon,
  HeartIcon,
  LeafSprig,
  SproutIcon,
} from "@/components/HomeIcons";

const BAND_DISPLAY: Record<CategoryScore["band"], string> = {
  "Real Strength": "Excellent",
  "Solid Ground": "Solid Ground",
  "Room to Grow": "Room to Grow",
};

const BAND_ACCENT: Record<CategoryScore["band"], { color: string; bg: string; bar: string }> = {
  "Real Strength": { color: "#7C9473", bg: "#E9F0E3", bar: "bg-forest" },
  "Solid Ground": { color: "#9B90C9", bg: "#EFEBF9", bar: "bg-[#9B90C9]" },
  "Room to Grow": { color: "#D98F89", bg: "#FBE9E6", bar: "bg-sienna" },
};

function overallTier(score: number): {
  headline: string;
  description: string;
  pill: string;
} {
  if (score >= 4) {
    return {
      headline: "A thriving relationship",
      description:
        "You have a strong, healthy foundation across most areas of your marriage. Keep nurturing what's working.",
      pill: "Thriving together",
    };
  }
  if (score >= 3) {
    return {
      headline: "A strong foundation, with room to grow",
      description:
        "You have many strengths as a couple. With attention and intention, the areas that need more care can become your greatest opportunities for growth.",
      pill: "Room to grow together",
    };
  }
  return {
    headline: "A relationship worth investing in",
    description:
      "Several areas could use more attention right now. That's not a bad sign — it's a clear, honest starting point to grow from together.",
    pill: "Room to grow together",
  };
}

export default function MarriageResultCard({
  name,
  categories,
}: {
  name?: string;
  categories: CategoryScore[];
}) {
  const [view, setView] = useState<"score" | "category">("score");

  const overall =
    categories.reduce((sum, c) => sum + c.average, 0) / (categories.length || 1);
  const tier = overallTier(overall);

  const strong = categories.filter((c) => c.band === "Real Strength");
  const stable = categories.filter((c) => c.band === "Solid Ground");
  const explore = categories.filter((c) => c.band === "Room to Grow");
  const sorted = [...categories].sort((a, b) => b.average - a.average);

  // Donut segments, proportional to how many categories fall in each band.
  const total = categories.length || 1;
  const circumference = 2 * Math.PI * 54;
  const seg = (count: number) => (count / total) * circumference;
  const strongLen = seg(strong.length);
  const stableLen = seg(stable.length);
  const exploreLen = seg(explore.length);

  const who = name ? `${name}'s` : "Your";

  return (
    <div className="flex flex-col gap-8">
      {/* snapshot */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto_260px] lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wide text-forest">
              {who} relationship snapshot
            </span>
            <h2 className="font-display mt-2 text-3xl font-semibold text-walnut">
              {tier.headline}
            </h2>
            <p className="mt-3 max-w-md text-base leading-relaxed text-walnut-soft">
              {tier.description}
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 justify-self-center">
            <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#ECE7DC" strokeWidth="10" />
              {strongLen > 0 && (
                <circle
                  cx="60" cy="60" r="54" fill="none" stroke="#7C9473" strokeWidth="10"
                  strokeDasharray={`${strongLen} ${circumference - strongLen}`}
                  strokeLinecap="round"
                />
              )}
              {stableLen > 0 && (
                <circle
                  cx="60" cy="60" r="54" fill="none" stroke="#9B90C9" strokeWidth="10"
                  strokeDasharray={`${stableLen} ${circumference - stableLen}`}
                  strokeDashoffset={-strongLen}
                  strokeLinecap="round"
                />
              )}
              {exploreLen > 0 && (
                <circle
                  cx="60" cy="60" r="54" fill="none" stroke="#D98F89" strokeWidth="10"
                  strokeDasharray={`${exploreLen} ${circumference - exploreLen}`}
                  strokeDashoffset={-(strongLen + stableLen)}
                  strokeLinecap="round"
                />
              )}
              <text x="60" y="55" textAnchor="middle" className="rotate-90" style={{ transform: "rotate(90deg)", transformOrigin: "60px 60px" }}>
                <tspan x="60" dy="0" fontSize="10" fill="#6B6B6B" fontFamily="var(--font-body)">Overall Score</tspan>
                <tspan x="60" dy="22" fontSize="24" fontWeight="700" fill="#1C1C1C" fontFamily="var(--font-display)">
                  {overall.toFixed(1)}
                  <tspan fontSize="12" fill="#6B6B6B">/5</tspan>
                </tspan>
              </text>
            </svg>
            <span className="rounded-full bg-sienna-soft px-4 py-1.5 text-sm font-semibold text-sienna">
              {tier.pill}
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {[
              { label: "Strong areas", count: strong.length, note: "You're doing really well here!", color: "#7C9473", bg: "#E9F0E3", Icon: HeartIcon },
              { label: `Stable area${stable.length === 1 ? "" : "s"}`, count: stable.length, note: "A good foundation to build on.", color: "#9B90C9", bg: "#EFEBF9", Icon: SproutIcon },
              { label: "Areas to explore", count: explore.length, note: "These may need more attention.", color: "#D98F89", bg: "#FBE9E6", Icon: SproutIcon },
            ].map((row) => (
              <div key={row.label} className="flex items-start gap-3">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: row.bg, color: row.color }}
                >
                  <row.Icon className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-walnut">
                    {row.label} <span className="text-walnut-soft">· {row.count} area{row.count === 1 ? "" : "s"}</span>
                  </p>
                  <p className="text-xs text-walnut-soft">{row.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* landscape */}
      <div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-semibold text-walnut">
              {who} relationship landscape
            </h3>
            <p className="mt-1 text-base text-walnut-soft">
              Here&apos;s how {name ? `${name} scored` : "you scored"} in each area, from highest to lowest.
            </p>
          </div>
          <div className="flex gap-1 rounded-full border border-border bg-card p-1">
            <button
              type="button"
              onClick={() => setView("score")}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                view === "score" ? "bg-forest text-paper" : "text-walnut-soft"
              }`}
            >
              By score
            </button>
            <button
              type="button"
              onClick={() => setView("category")}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                view === "category" ? "bg-forest text-paper" : "text-walnut-soft"
              }`}
            >
              By category
            </button>
          </div>
        </div>

        {view === "category" ? (
          <div className="mt-6 flex flex-col gap-3">
            {sorted.map((c) => {
              const accent = BAND_ACCENT[c.band];
              return (
                <div key={c.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-display text-lg font-semibold text-walnut">{c.name}</h4>
                    <span
                      className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
                      style={{ backgroundColor: accent.bg, color: accent.color }}
                    >
                      {BAND_DISPLAY[c.band]}
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-paper">
                    <div className={`h-full rounded-full ${accent.bar}`} style={{ width: `${Math.max(4, c.percent)}%` }} />
                  </div>
                  <p className="mt-1 text-sm text-walnut-soft">{c.average.toFixed(1)} / 5</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {[
              { title: "Strong Areas", list: strong, Icon: SproutIcon, color: "#7C9473", bg: "#E9F0E3" },
              { title: `Stable Area${stable.length === 1 ? "" : "s"}`, list: stable, Icon: SproutIcon, color: "#9B90C9", bg: "#EFEBF9" },
              { title: "Areas to Explore", list: explore, Icon: SproutIcon, color: "#D98F89", bg: "#FBE9E6" },
            ].map((col) => (
              <div key={col.title} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: col.bg, color: col.color }}
                  >
                    <col.Icon className="h-4 w-4" />
                  </span>
                  <h4 className="text-base font-bold text-walnut">{col.title}</h4>
                </div>
                {col.list.length === 0 ? (
                  <p className="mt-3 text-sm text-walnut-soft">Nothing in this band yet.</p>
                ) : (
                  <div className="mt-3 flex flex-col gap-3">
                    {col.list.map((c) => (
                      <div key={c.id}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-walnut">{c.name}</span>
                          <span className="text-walnut-soft">{c.average.toFixed(1)} / 5</span>
                        </div>
                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-paper">
                          <div className={`h-full rounded-full ${BAND_ACCENT[c.band].bar}`} style={{ width: `${Math.max(4, c.percent)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl p-5" style={{ backgroundColor: "#E9F0E3" }}>
            <h4 className="flex items-center gap-2 text-sm font-bold text-walnut">
              <CheckCircleIcon className="h-4 w-4 text-forest" />
              What&apos;s working well
            </h4>
            <p className="mt-1 text-sm text-walnut-soft">
              You and your partner have a strong foundation in these key areas.
            </p>
            {strong.length > 0 && (
              <ul className="mt-3 flex flex-col gap-1.5">
                {strong.map((c) => (
                  <li key={c.id} className="flex items-center gap-2 text-sm text-walnut">
                    <CheckCircleIcon className="h-4 w-4 shrink-0 text-forest" />
                    {c.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-2xl p-5" style={{ backgroundColor: "#EFEBF9" }}>
            <h4 className="flex items-center gap-2 text-sm font-bold text-walnut">
              <SproutIcon className="h-4 w-4 text-[#9B90C9]" />
              {stable.length > 1 ? "Stable areas" : "A stable area"}
            </h4>
            <p className="mt-1 text-sm text-walnut-soft">
              {stable.length > 0
                ? `${stable.map((c) => c.name).join(", ")} — a good foundation to build on.`
                : "No areas landed here this time — that's alright."}
            </p>
          </div>
          <div className="rounded-2xl p-5" style={{ backgroundColor: "#FBE9E6" }}>
            <h4 className="flex items-center gap-2 text-sm font-bold text-walnut">
              <LeafSprig className="h-4 w-4 text-sienna" />
              Areas to focus on
            </h4>
            <p className="mt-1 text-sm text-walnut-soft">
              These areas may need more attention and intentional effort.
            </p>
            {explore.length > 0 && (
              <ul className="mt-3 flex flex-col gap-1.5">
                {explore.map((c) => (
                  <li key={c.id} className="flex items-center gap-2 text-sm text-walnut">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sienna" />
                    {c.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
