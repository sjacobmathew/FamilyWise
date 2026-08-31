"use client";

import { useState } from "react";
import type { CategoryScore } from "@/lib/scoring";
import {
  CheckCircleIcon,
  ArrowIcon,
  BrainIcon,
  ChatBubbleIcon,
  ClockIcon,
  DollarIcon,
  HeartIcon,
  HomeIcon,
  LeafSprig,
  PersonIcon,
  ScaleIcon,
  SmileyIcon,
  SproutIcon,
  StarIcon,
  TrophyIcon,
  TwoPersonIcon,
} from "@/components/HomeIcons";

type Band = CategoryScore["band"];

function bandFor(percent: number): Band {
  if (percent < 60) return "Room to Grow";
  if (percent <= 80) return "Solid Ground";
  return "Real Strength";
}

const CATEGORY_ICON: Record<string, (p: { className?: string }) => React.ReactNode> = {
  overall: HeartIcon,
  emotional: BrainIcon,
  communication: ChatBubbleIcon,
  time: ClockIcon,
  finances: DollarIcon,
  sexual: TwoPersonIcon,
  parenting: TwoPersonIcon,
  intimacy: HeartIcon,
  acceptance: SmileyIcon,
  forgiveness: SproutIcon,
  spirituality: StarIcon,
  friendship: TwoPersonIcon,
  family: HomeIcon,
  jesusyouth: LeafSprig,
};

function Donut({
  strong,
  stable,
  explore,
  total,
  score,
}: {
  strong: number;
  stable: number;
  explore: number;
  total: number;
  score: number;
}) {
  const circumference = 2 * Math.PI * 44;
  const seg = (n: number) => (n / (total || 1)) * circumference;
  const strongLen = seg(strong);
  const stableLen = seg(stable);
  const exploreLen = seg(explore);

  return (
    <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
      <circle cx="50" cy="50" r="44" fill="none" stroke="#ECE7DC" strokeWidth="9" />
      {strongLen > 0 && (
        <circle cx="50" cy="50" r="44" fill="none" stroke="#7C9473" strokeWidth="9" strokeDasharray={`${strongLen} ${circumference - strongLen}`} strokeLinecap="round" />
      )}
      {stableLen > 0 && (
        <circle cx="50" cy="50" r="44" fill="none" stroke="#9B90C9" strokeWidth="9" strokeDasharray={`${stableLen} ${circumference - stableLen}`} strokeDashoffset={-strongLen} strokeLinecap="round" />
      )}
      {exploreLen > 0 && (
        <circle cx="50" cy="50" r="44" fill="none" stroke="#D98F89" strokeWidth="9" strokeDasharray={`${exploreLen} ${circumference - exploreLen}`} strokeDashoffset={-(strongLen + stableLen)} strokeLinecap="round" />
      )}
      <text x="50" y="53" textAnchor="middle" style={{ transform: "rotate(90deg)", transformOrigin: "50px 50px" }}>
        <tspan x="50" dy="-2" fontSize="20" fontWeight="700" fill="#1C1C1C" fontFamily="var(--font-display)">
          {score.toFixed(1)}
        </tspan>
        <tspan x="50" dy="14" fontSize="8" fill="#6B6B6B" fontFamily="var(--font-body)">/5</tspan>
      </text>
    </svg>
  );
}

function bandCounts(categories: CategoryScore[]) {
  return {
    strong: categories.filter((c) => c.band === "Real Strength").length,
    stable: categories.filter((c) => c.band === "Solid Ground").length,
    explore: categories.filter((c) => c.band === "Room to Grow").length,
  };
}

function pillLabel(percent: number): string {
  if (percent < 60) return "Room to grow together";
  if (percent <= 80) return "Solid ground together";
  return "Thriving together";
}

export default function MarriageCompareCard({
  people,
}: {
  people: { name: string; categories: CategoryScore[] }[];
}) {
  const [view, setView] = useState<"scores" | "categories">("scores");
  const [a, b] = people;

  const aOverall = a.categories.reduce((s, c) => s + c.average, 0) / (a.categories.length || 1);
  const bOverall = b.categories.reduce((s, c) => s + c.average, 0) / (b.categories.length || 1);
  const together = (aOverall + bOverall) / 2;

  const aCounts = bandCounts(a.categories);
  const bCounts = bandCounts(b.categories);

  const rows = a.categories.map((catA) => {
    const catB = b.categories.find((c) => c.id === catA.id) ?? catA;
    const combinedAvg = (catA.average + catB.average) / 2;
    const combinedPercent = (combinedAvg / (catA.maxPoints || 5)) * 100;
    const combinedBand = bandFor(combinedPercent);
    const diff = catA.average - catB.average;
    return {
      id: catA.id,
      name: catA.name,
      aAvg: catA.average,
      bAvg: catB.average,
      aPercent: catA.percent,
      bPercent: catB.percent,
      diff,
      combinedBand,
    };
  });

  const strongTogether = rows.filter((r) => r.combinedBand === "Real Strength");
  const stableTogether = rows.filter((r) => r.combinedBand === "Solid Ground");
  const exploreTogether = rows.filter((r) => r.combinedBand === "Room to Grow");

  const biggestGaps = [...rows]
    .filter((r) => Math.abs(r.diff) > 0)
    .sort((x, y) => Math.abs(y.diff) - Math.abs(x.diff))
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-8">
      {/* snapshot row */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_260px]">
        {[
          { name: a.name, overall: aOverall, counts: aCounts, color: "#D9776E", bg: "#FBE1DE" },
          null,
          { name: b.name, overall: bOverall, counts: bCounts, color: "#9B90C9", bg: "#EFEBF9" },
        ].map((p, i) =>
          p ? (
            <div key={p.name} className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-6">
              <span className="flex items-center gap-2 text-sm font-bold text-walnut">
                <span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: p.bg, color: p.color }}>
                  <PersonIcon className="h-4 w-4" />
                </span>
                {p.name}
              </span>
              <Donut {...p.counts} total={p.counts.strong + p.counts.stable + p.counts.explore} score={p.overall} />
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{ backgroundColor: p.bg, color: p.color }}
              >
                {pillLabel((p.overall / 5) * 100)}
              </span>
            </div>
          ) : (
            <div key="together" className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-6">
              <span className="text-sm font-bold text-forest">Our relationship score</span>
              <Donut
                strong={strongTogether.length}
                stable={stableTogether.length}
                explore={exploreTogether.length}
                total={rows.length}
                score={together}
              />
              <span className="rounded-full bg-sienna-soft px-3 py-1 text-xs font-semibold text-sienna">
                {pillLabel((together / 5) * 100)}
              </span>
            </div>
          )
        )}

        <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6">
          {[
            { label: "Strong areas", count: strongTogether.length, note: "You're doing really well here!", color: "#7C9473", bg: "#E9F0E3", Icon: HeartIcon },
            { label: "Stable areas", count: stableTogether.length, note: "A good foundation to build on.", color: "#9B90C9", bg: "#EFEBF9", Icon: LeafSprig },
            { label: "Areas to explore", count: exploreTogether.length, note: "These may need more attention.", color: "#D98F89", bg: "#FBE9E6", Icon: SproutIcon },
          ].map((row) => (
            <div key={row.label} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: row.bg, color: row.color }}>
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

      {/* compare by area */}
      <div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-semibold text-walnut">Compare by area</h3>
            <p className="mt-1 flex items-center gap-4 text-base text-walnut-soft">
              Your scores across {rows.length} key areas
            </p>
            <div className="mt-2 flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 font-medium text-[#D9776E]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#D9776E]" /> {a.name}
              </span>
              <span className="flex items-center gap-1.5 font-medium text-[#9B90C9]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#9B90C9]" /> {b.name}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-walnut-soft">View as:</span>
            <div className="flex gap-1 rounded-full border border-border bg-card p-1">
              <button type="button" onClick={() => setView("scores")} className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${view === "scores" ? "bg-forest text-paper" : "text-walnut-soft"}`}>
                Scores
              </button>
              <button type="button" onClick={() => setView("categories")} className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${view === "categories" ? "bg-forest text-paper" : "text-walnut-soft"}`}>
                Categories
              </button>
            </div>
          </div>
        </div>

        {view === "scores" ? (
          <div className="mt-6 flex flex-col gap-3">
            {rows.map((r) => {
              const CatIcon = CATEGORY_ICON[r.id] ?? HeartIcon;
              const higherIsA = r.diff > 0;
              const higherIsB = r.diff < 0;
              return (
                <div key={r.id} className="grid grid-cols-[1fr_1fr_auto_1fr] items-center gap-4 rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest-soft text-forest">
                      <CatIcon className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm font-medium text-walnut">{r.name}</span>
                  </div>
                  <div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-paper">
                      <div className="h-full rounded-full bg-[#D9776E]" style={{ width: `${Math.max(4, r.aPercent)}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-walnut-soft">{r.aAvg.toFixed(1)} / 5</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-walnut-soft">
                    {higherIsA && <ArrowIcon className="h-3 w-3 -rotate-180 text-[#D9776E]" />}
                    <span className={`rounded-full px-2 py-1 ${r.diff === 0 ? "bg-paper" : "bg-sienna-soft text-sienna"}`}>
                      {r.diff === 0 ? "0.0" : (r.diff > 0 ? "+" : "") + r.diff.toFixed(1)}
                    </span>
                    {higherIsB && <ArrowIcon className="h-3 w-3 text-[#9B90C9]" />}
                  </div>
                  <div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-paper">
                      <div className="h-full rounded-full bg-[#9B90C9]" style={{ width: `${Math.max(4, r.bPercent)}%` }} />
                    </div>
                    <p className="mt-1 text-right text-xs text-walnut-soft">{r.bAvg.toFixed(1)} / 5</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {[
              { title: "Strong Areas", list: strongTogether, color: "#7C9473", bg: "#E9F0E3" },
              { title: "Stable Areas", list: stableTogether, color: "#9B90C9", bg: "#EFEBF9" },
              { title: "Areas to Explore", list: exploreTogether, color: "#D98F89", bg: "#FBE9E6" },
            ].map((col) => (
              <div key={col.title} className="rounded-2xl border border-border bg-card p-5">
                <h4 className="text-base font-bold" style={{ color: col.color }}>{col.title}</h4>
                {col.list.length === 0 ? (
                  <p className="mt-3 text-sm text-walnut-soft">Nothing in this band yet.</p>
                ) : (
                  <div className="mt-3 flex flex-col gap-2">
                    {col.list.map((r) => (
                      <div key={r.id} className="flex items-center justify-between text-sm">
                        <span className="text-walnut">{r.name}</span>
                        <span className="text-walnut-soft">
                          {r.aAvg.toFixed(1)} / {r.bAvg.toFixed(1)}
                        </span>
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
              <TrophyIcon className="h-4 w-4 text-forest" />
              What you both do well
            </h4>
            <p className="mt-1 text-sm text-walnut-soft">These are your shared strengths as a couple.</p>
            {strongTogether.length > 0 && (
              <ul className="mt-3 flex flex-col gap-1.5">
                {strongTogether.map((r) => (
                  <li key={r.id} className="flex items-center gap-2 text-sm text-walnut">
                    <CheckCircleIcon className="h-4 w-4 shrink-0 text-forest" />
                    {r.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-2xl p-5" style={{ backgroundColor: "#EFEBF9" }}>
            <h4 className="flex items-center gap-2 text-sm font-bold text-walnut">
              <ScaleIcon className="h-4 w-4 text-[#9B90C9]" />
              Where perspectives differ
            </h4>
            <p className="mt-1 text-sm text-walnut-soft">These areas show the biggest differences in how you scored.</p>
            {biggestGaps.length > 0 && (
              <ul className="mt-3 flex flex-col gap-1.5">
                {biggestGaps.map((r) => (
                  <li key={r.id} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-walnut">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: r.diff < 0 ? "#9B90C9" : "#D9776E" }}
                      />
                      {r.name}
                    </span>
                    <span className="font-semibold text-walnut-soft">
                      {r.diff > 0 ? "+" : ""}
                      {r.diff.toFixed(1)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-2xl p-5" style={{ backgroundColor: "#FBE9E6" }}>
            <h4 className="flex items-center gap-2 text-sm font-bold text-walnut">
              <SproutIcon className="h-4 w-4 text-sienna" />
              Areas to focus together
            </h4>
            <p className="mt-1 text-sm text-walnut-soft">These areas may need more attention and intentional effort.</p>
            {exploreTogether.length > 0 && (
              <ul className="mt-3 flex flex-col gap-1.5">
                {exploreTogether.map((r) => (
                  <li key={r.id} className="flex items-center gap-2 text-sm text-walnut">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sienna" />
                    {r.name}
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
