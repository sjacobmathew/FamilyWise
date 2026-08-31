"use client";

import { useState } from "react";
import { siblingTipKey } from "@/lib/childRoster";

type ChildTemperamentInfo = {
  name: string;
  age?: number;
  dominant: string;
  secondary?: string;
};

export default function SiblingTipCard({
  quizId,
  childA,
  childB,
}: {
  quizId: string;
  childA: ChildTemperamentInfo;
  childB: ChildTemperamentInfo;
}) {
  const cacheKey = siblingTipKey(quizId, childA.name, childB.name);
  const [tip, setTip] = useState<string | null>(() =>
    typeof window !== "undefined" ? sessionStorage.getItem(cacheKey) : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function fetchTip() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/sibling-tip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childA, childB }),
      });
      if (!res.ok) throw new Error("request failed");
      const data = await res.json();
      if (!data.tip) throw new Error("empty tip");
      sessionStorage.setItem(cacheKey, data.tip);
      setTip(data.tip);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  if (tip) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="font-times text-lg text-sienna">
          {childA.name} &amp; {childB.name}
        </p>
        <p className="mt-2 text-lg leading-relaxed text-walnut-soft">{tip}</p>
        <button
          type="button"
          onClick={fetchTip}
          disabled={loading}
          className="mt-3 text-sm font-medium text-walnut-soft hover:text-sienna disabled:opacity-50 print:hidden"
        >
          {loading ? "Regenerating…" : "Regenerate tip"}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/60 p-5 print:hidden">
      {error && (
        <p className="mb-2 text-base text-sienna">
          Couldn&apos;t generate a tip right now — try again.
        </p>
      )}
      <button
        type="button"
        onClick={fetchTip}
        disabled={loading}
        className="rounded-full bg-forest px-5 py-2.5 text-lg text-paper hover:bg-forest-dark disabled:opacity-60"
      >
        {loading
          ? "Thinking…"
          : `Get tips for ${childA.name} & ${childB.name}'s temperament mix`}
      </button>
    </div>
  );
}
