import type { TagScore } from "./scoring";

export const CHARISM_QUIZ_ID = "charism-assessment";

/** Each charism has seven 0–3 questions, so 0–21. */
export const CHARISM_MAX_SCORE = 21;

export type CharismBand = {
  label: string;
  min: number;
  max: number;
};

// Source-style bands. The original PDF overlaps at 6; FamilyWise resolves
// that by placing 6 in the 6–10 band.
export const CHARISM_BANDS: CharismBand[] = [
  { label: "Very strong indication", min: 16, max: 21 },
  { label: "Strong indication", min: 11, max: 15 },
  { label: "Lower indication", min: 6, max: 10 },
  { label: "Low indication", min: 0, max: 5 },
];

export function bandForCharismScore(score: number): CharismBand {
  return (
    CHARISM_BANDS.find((b) => score >= b.min && score <= b.max) ??
    CHARISM_BANDS[CHARISM_BANDS.length - 1]
  );
}

export type RankedCharism = TagScore & {
  /** Standard competition rank: 19, 18, 17, 17 → 1, 2, 3, 3. */
  rank: number;
  /** True when another charism shares this exact score. */
  tied: boolean;
};

/** Ranks every charism by score (highest first), preserving ties. Ties are
 * never broken — equal scores share a rank and keep the spec's card order. */
export function rankCharisms(scores: TagScore[]): RankedCharism[] {
  const sorted = scores
    .map((s, order) => ({ ...s, order }))
    .sort((a, b) => b.value - a.value || a.order - b.order);

  return sorted.map((s) => {
    const rank = sorted.findIndex((x) => x.value === s.value) + 1;
    const tied = sorted.filter((x) => x.value === s.value).length > 1;
    return { tag: s.tag, value: s.value, rank, tied };
  });
}

/** Every charism holding rank 3 or better — so a tie for third place shows
 * all of the tied charisms rather than arbitrarily dropping one. */
export function strongestIndicatedCharisms(ranked: RankedCharism[]): RankedCharism[] {
  return ranked.filter((r) => r.rank <= 3);
}

export function ordinal(rank: number): string {
  const mod100 = rank % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${rank}th`;
  switch (rank % 10) {
    case 1:
      return `${rank}st`;
    case 2:
      return `${rank}nd`;
    case 3:
      return `${rank}rd`;
    default:
      return `${rank}th`;
  }
}

// ---------------------------------------------------------------------------
// Intro / results copy
// ---------------------------------------------------------------------------

/** The scripture passage, in the exact wording used by that same source PDF.
 * One string per paragraph. While empty, the intro shows the reference and a
 * summary only. */
export const SCRIPTURE_TEXT: string[] = [
  "\u201CThere are different kinds of spiritual gifts but the same Spirit; there are different forms of service but the same Lord; there are different workings but the same God who produces all of them in everyone. To each individual the manifestation of the Spirit is given for some benefit.\u201D",
];

export const SCRIPTURE_REFERENCE = "1 Corinthians 12:4–11";

export const RESULTS_NOTE =
  "Your responses suggest these may be some of the spiritual gifts God is developing in you. This assessment is a tool for reflection and discernment rather than a definitive determination of a charism.";

export const DISCERNMENT_NOTE =
  "A charism is given for the good of others and for the building up of the Church. The results should therefore be approached prayerfully and relationally, not as a personality label or a fixed identity. The assessment can help identify areas for further discernment, but the result itself should not be presented as proof that a person definitely possesses a particular charism.";
