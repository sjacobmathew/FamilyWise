// sessionStorage helpers for the Family Summary page — same flat-key,
// no-server-storage style as lib/childRoster.ts, but keyed by name
// directly rather than a per-quiz roster, since a family member here is
// shared across several assessments at once.

const MEMBERS_KEY = "familywise:family:members";
const ANSWERS_PREFIX = "familywise:family:answers:";

export type FamilyMember = {
  name: string;
};

export function familyAnswersKey(name: string, quizId: string): string {
  return `${ANSWERS_PREFIX}${name}:${quizId}`;
}

export function readFamilyMembers(): FamilyMember[] {
  if (typeof window === "undefined") return [];
  const raw = sessionStorage.getItem(MEMBERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeFamilyMembers(members: FamilyMember[]): void {
  sessionStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
}

/** Adds a member if one doesn't already exist, matched by a
 * case-insensitive, trimmed name comparison — so a second PDF naming
 * "jimmy " lands on the same card as an earlier "Jimmy". */
export function ensureFamilyMember(name: string): FamilyMember[] {
  const trimmed = name.trim();
  const members = readFamilyMembers();
  const exists = members.some((m) => m.name.toLowerCase() === trimmed.toLowerCase());
  if (exists) return members;

  const next = [...members, { name: trimmed }];
  writeFamilyMembers(next);
  return next;
}

export function removeFamilyMember(name: string): FamilyMember[] {
  const next = readFamilyMembers().filter(
    (m) => m.name.toLowerCase() !== name.toLowerCase()
  );
  writeFamilyMembers(next);
  if (typeof window !== "undefined") {
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(`${ANSWERS_PREFIX}${name}:`)) {
        sessionStorage.removeItem(key);
      }
    }
  }
  return next;
}

export function readFamilyAnswers(
  name: string,
  quizId: string
): Record<string, number | "A" | "B"> | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(familyAnswersKey(name, quizId));
  return raw ? JSON.parse(raw) : null;
}

export function writeFamilyAnswers(
  name: string,
  quizId: string,
  answers: Record<string, number | "A" | "B">
): void {
  sessionStorage.setItem(familyAnswersKey(name, quizId), JSON.stringify(answers));
}
