"use client";

import { useState } from "react";
import Link from "next/link";
import type { Quiz } from "@/lib/types";
import {
  ArrowIcon,
  HeartIcon,
  PersonIcon,
  SmileyIcon,
  TwoPersonIcon,
} from "@/components/HomeIcons";

type CategoryTheme = {
  icon: (props: { className?: string }) => React.ReactNode;
  accent: string;
  soft: string;
  blurb: string;
};

const CATEGORY_THEME: Record<string, CategoryTheme> = {
  Parenting: {
    icon: TwoPersonIcon,
    accent: "#7C9473",
    soft: "#E9F0E3",
    blurb: "Understand your child better and discover your parenting style.",
  },
  Personality: {
    icon: PersonIcon,
    accent: "#9B90C9",
    soft: "#EFEBF9",
    blurb: "Discover your natural personality, strengths and preferences.",
  },
  Relationships: {
    icon: HeartIcon,
    accent: "#D98F89",
    soft: "#FBE9E6",
    blurb: "Strengthen your relationship and deepen your connection.",
  },
};
const FALLBACK_THEME: CategoryTheme = {
  icon: PersonIcon,
  accent: "#7C9473",
  soft: "#E9F0E3",
  blurb: "",
};

function iconForQuiz(quiz: Quiz) {
  switch (quiz.quizId) {
    case "child-temperament":
      return SmileyIcon;
    case "love-languages-child":
    case "love-languages":
    case "marriage-compatibility":
      return HeartIcon;
    case "parenting-style":
    case "temperament":
      return TwoPersonIcon;
    default:
      return PersonIcon;
  }
}

export default function ExploreCategories({
  groups,
}: {
  groups: { category: string; quizzes: Quiz[] }[];
}) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-3">
        {groups.map(({ category, quizzes }) => {
          const theme = CATEGORY_THEME[category] ?? FALLBACK_THEME;
          const Icon = theme.icon;
          const isOpen = open === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setOpen(isOpen ? null : category)}
              aria-expanded={isOpen}
              className="group relative flex min-h-[220px] flex-col justify-between rounded-3xl p-7 text-left transition hover:-translate-y-1"
              style={{
                backgroundColor: theme.soft,
                outline: isOpen ? `2px solid ${theme.accent}` : undefined,
                outlineOffset: isOpen ? "2px" : undefined,
              }}
            >
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="font-display mt-5 text-2xl font-semibold">
                  {category}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#5B5B5B]">
                  {theme.blurb || `${quizzes.length} assessments`}
                </p>
              </div>
              <span
                className="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white transition"
                style={{
                  color: theme.accent,
                  transform: isOpen ? "rotate(90deg)" : undefined,
                }}
              >
                <ArrowIcon className="h-4 w-4" />
              </span>
            </button>
          );
        })}
      </div>

      {groups.map(({ category, quizzes }) => {
        const theme = CATEGORY_THEME[category] ?? FALLBACK_THEME;
        if (open !== category) return null;
        return (
          <div
            key={category}
            className="mt-6 rounded-3xl border border-[#ECE7DC] bg-white p-6 sm:p-8"
          >
            <div
              className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide"
              style={{ color: theme.accent }}
            >
              {category} assessments
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {quizzes.map((quiz) => {
                const QuizIcon = iconForQuiz(quiz);
                return (
                  <Link
                    key={quiz.quizId}
                    href={`/quiz/${quiz.quizId}`}
                    className="group flex items-start gap-3 rounded-2xl border border-[#ECE7DC] p-4 transition hover:border-[#1C1C1C]"
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: theme.soft, color: theme.accent }}
                    >
                      <QuizIcon className="h-5 w-5" />
                    </span>
                    <span className="flex-1">
                      <span className="block font-semibold text-[#1C1C1C]">
                        {quiz.title}
                      </span>
                      <span className="mt-0.5 block text-sm leading-snug text-[#6B6B6B]">
                        {quiz.description}
                      </span>
                    </span>
                    <ArrowIcon className="mt-2 h-4 w-4 shrink-0 text-[#B5B5B5] transition group-hover:translate-x-1 group-hover:text-[#1C1C1C]" />
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
