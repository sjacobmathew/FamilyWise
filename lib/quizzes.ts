import fs from "fs";
import path from "path";
import type { Quiz, RawQuizFlow } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

function normalizeFlow(flow: RawQuizFlow): Quiz["flow"] {
  if (flow === "all-questions-then-result") return "rating-scale-then-result";
  return flow;
}

let cache: Quiz[] | null = null;

export function getAllQuizzes(): Quiz[] {
  if (cache) return cache;

  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.toLowerCase().endsWith(".json"));

  const quizzes = files.map((file) => {
    const raw = fs.readFileSync(path.join(DATA_DIR, file), "utf-8");
    const parsed = JSON.parse(raw) as Quiz;
    return { ...parsed, flow: normalizeFlow(parsed.flow as RawQuizFlow) };
  });

  cache = quizzes;
  return quizzes;
}

export function getQuizById(quizId: string): Quiz | undefined {
  return getAllQuizzes().find((q) => q.quizId === quizId);
}

export function getQuizzesByCategory(): { category: string; quizzes: Quiz[] }[] {
  const quizzes = getAllQuizzes();
  const groups = new Map<string, Quiz[]>();

  for (const quiz of quizzes) {
    const category = quiz.category ?? "Other";
    const existing = groups.get(category) ?? [];
    existing.push(quiz);
    groups.set(category, existing);
  }

  return Array.from(groups.entries())
    .map(([category, quizzes]) => ({ category, quizzes }))
    .sort((a, b) => a.category.localeCompare(b.category));
}
