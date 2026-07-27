"use client";

import { useState } from "react";
import { householdTipKey } from "@/lib/childRoster";

type ParentInfo = {
  dominant: string;
  secondary?: string;
};

type ChildTemperamentInfo = {
  name: string;
  age?: number;
  dominant: string;
  secondary?: string;
};

type HouseholdTips = {
  childTips: { name: string; tip: string }[];
  householdNote: string;
};

export default function HouseholdTipsCard({
  quizId,
  parent,
  familyChildren,
}: {
  quizId: string;
  parent: ParentInfo;
  familyChildren: ChildTemperamentInfo[];
}) {
  const cacheKey = householdTipKey(quizId, parent, familyChildren);
  const [data, setData] = useState<HouseholdTips | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem(cacheKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as HouseholdTips;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function fetchTips() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/household-tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parent, children: familyChildren }),
      });
      if (!res.ok) throw new Error("request failed");
      const json = (await res.json()) as Partial<HouseholdTips>;
      if (!json.childTips || !json.householdNote) throw new Error("bad response");
      const result: HouseholdTips = {
        childTips: json.childTips,
        householdNote: json.householdNote,
      };
      sessionStorage.setItem(cacheKey, JSON.stringify(result));
      setData(result);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  if (data) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex flex-col gap-4">
          {data.childTips.map((ct) => (
            <div key={ct.name} className="rounded-lg bg-forest-soft/50 p-4">
              <p className="font-times text-lg text-sienna">{ct.name}</p>
              <p className="mt-1 text-lg leading-relaxed text-walnut-soft">
                {ct.tip}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-dashed border-border p-4">
          <span className="text-base font-semibold uppercase tracking-wide text-walnut-soft">
            Balancing it all
          </span>
          <p className="mt-1 text-lg leading-relaxed text-walnut-soft">
            {data.householdNote}
          </p>
        </div>
        <button
          type="button"
          onClick={fetchTips}
          disabled={loading}
          className="mt-4 text-sm font-medium text-walnut-soft hover:text-sienna disabled:opacity-50 print:hidden"
        >
          {loading ? "Regenerating…" : "Regenerate"}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-dashed border-border bg-card/60 p-5 print:hidden">
      {error && (
        <p className="mb-2 text-base text-sienna">
          Couldn&apos;t generate tips right now — try again.
        </p>
      )}
      <button
        type="button"
        onClick={fetchTips}
        disabled={loading}
        className="font-times rounded bg-forest px-5 py-2.5 text-lg text-paper hover:bg-forest-dark disabled:opacity-60"
      >
        {loading ? "Thinking…" : "Get parenting tips for your household"}
      </button>
    </div>
  );
}
