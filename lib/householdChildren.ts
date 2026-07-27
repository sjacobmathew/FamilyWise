export type HouseholdChild = {
  name: string;
  age?: number;
  temperament: string;
};

const KEY = "familywise:household-children";

export function readHouseholdChildren(): HouseholdChild[] {
  if (typeof window === "undefined") return [];
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HouseholdChild[]) : [];
  } catch {
    return [];
  }
}

export function writeHouseholdChildren(children: HouseholdChild[]): void {
  sessionStorage.setItem(KEY, JSON.stringify(children));
}
