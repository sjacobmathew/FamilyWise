export type ChildInput = {
  name?: unknown;
  age?: unknown;
  dominant?: unknown;
  secondary?: unknown;
};

export function describeChild(child: ChildInput): string {
  const name = String(child.name);
  const age =
    typeof child.age === "number" && Number.isFinite(child.age)
      ? ` (age ${child.age})`
      : "";
  const secondary =
    typeof child.secondary === "string" && child.secondary
      ? `, secondary temperament: ${child.secondary}`
      : "";
  return `${name}${age} — dominant temperament: ${String(child.dominant)}${secondary}`;
}
