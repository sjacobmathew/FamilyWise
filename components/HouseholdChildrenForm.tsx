"use client";

import { useState, useSyncExternalStore } from "react";
import HouseholdTipsCard from "@/components/HouseholdTipsCard";
import {
  readHouseholdChildren,
  writeHouseholdChildren,
  type HouseholdChild,
} from "@/lib/householdChildren";

const TEMPERAMENTS = ["Sanguine", "Choleric", "Melancholic", "Phlegmatic"];

function noopSubscribe() {
  return () => {};
}

export default function HouseholdChildrenForm({
  quizId,
  parent,
}: {
  quizId: string;
  parent: { dominant: string; secondary?: string };
}) {
  const childrenJson = useSyncExternalStore(
    noopSubscribe,
    () => JSON.stringify(readHouseholdChildren()),
    () => "[]"
  );
  const children: HouseholdChild[] = JSON.parse(childrenJson);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [temperament, setTemperament] = useState(TEMPERAMENTS[0]);
  const [, setTick] = useState(0);
  const rerender = () => setTick((n) => n + 1);

  function addChild() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const parsedAge = age.trim() ? Number(age) : undefined;
    const next: HouseholdChild = {
      name: trimmed,
      temperament,
      ...(parsedAge !== undefined && Number.isFinite(parsedAge)
        ? { age: parsedAge }
        : {}),
    };
    writeHouseholdChildren([...children, next]);
    setName("");
    setAge("");
    setTemperament(TEMPERAMENTS[0]);
    rerender();
  }

  function removeChild(index: number) {
    writeHouseholdChildren(children.filter((_, i) => i !== index));
    rerender();
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="text-2xl font-bold text-walnut">
        Parenting Your Household
      </h3>
      <p className="mt-1 text-lg text-walnut-soft">
        Add each child&apos;s name, age, and temperament to get parenting
        tips built around your style and each child.
      </p>

      {children.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {children.map((c, i) => (
            <div
              key={`${c.name}-${i}`}
              className="flex items-center justify-between rounded-lg border border-border bg-paper px-4 py-3"
            >
              <div>
                <span className="font-times text-lg text-sienna">
                  {c.name}
                </span>
                <span className="ml-2 text-base text-walnut-soft">
                  {c.age ? `age ${c.age} · ` : ""}
                  {c.temperament}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeChild(i)}
                className="text-sm text-walnut-soft hover:text-sienna"
                aria-label={`Remove ${c.name}`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-walnut-soft">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addChild();
            }}
            placeholder="Child's name"
            className="mt-1 w-full rounded border border-border bg-paper px-3 py-2 text-lg text-walnut placeholder:text-walnut-soft/60 focus:border-sienna focus:outline-none"
          />
        </div>
        <div className="w-24">
          <label className="block text-sm font-medium text-walnut-soft">
            Age
          </label>
          <input
            type="number"
            min={0}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Optional"
            className="mt-1 w-full rounded border border-border bg-paper px-3 py-2 text-lg text-walnut placeholder:text-walnut-soft/60 focus:border-sienna focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-walnut-soft">
            Temperament
          </label>
          <select
            value={temperament}
            onChange={(e) => setTemperament(e.target.value)}
            className="mt-1 w-full rounded border border-border bg-paper px-3 py-2 text-lg text-walnut focus:border-sienna focus:outline-none"
          >
            {TEMPERAMENTS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={addChild}
          className="font-times rounded border border-forest px-5 py-2.5 text-lg text-forest hover:bg-forest-soft"
        >
          Add child
        </button>
      </div>

      {children.length > 0 && (
        <div className="mt-6">
          <HouseholdTipsCard
            quizId={quizId}
            parent={parent}
            familyChildren={children.map((c) => ({
              name: c.name,
              age: c.age,
              dominant: c.temperament,
            }))}
          />
        </div>
      )}
    </div>
  );
}
