const ROSTER_PREFIX = "familywise:roster:";
const ANSWERS_PREFIX = "familywise:answers:";
const TIP_PREFIX = "familywise:tip:";

export function rosterKey(quizId: string): string {
  return `${ROSTER_PREFIX}${quizId}`;
}

export function childAnswersKey(quizId: string, childName: string): string {
  return `${ANSWERS_PREFIX}${quizId}:${childName}`;
}

export function householdTipKey(
  quizId: string,
  parent: { dominant: string; secondary?: string },
  children: { name: string; age?: number; dominant: string; secondary?: string }[]
): string {
  const parentPart = `${parent.dominant}|${parent.secondary ?? ""}`;
  const childrenPart = children
    .map((c) => `${c.name}|${c.age ?? ""}|${c.dominant}|${c.secondary ?? ""}`)
    .sort()
    .join("::");
  return `${TIP_PREFIX}household:${quizId}:${parentPart}:${childrenPart}`;
}

export function readRoster(quizId: string): string[] {
  if (typeof window === "undefined") return [];
  const raw = sessionStorage.getItem(rosterKey(quizId));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((n): n is string => typeof n === "string")
      : [];
  } catch {
    return [];
  }
}

export function writeRoster(quizId: string, names: string[]): void {
  sessionStorage.setItem(rosterKey(quizId), JSON.stringify(names));
}
