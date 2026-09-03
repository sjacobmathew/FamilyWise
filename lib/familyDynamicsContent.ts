// Static content + light aggregation logic for the Family Summary
// dashboard. Everything here is illustrative, in the same spirit as
// lib/childTemperamentContent.ts's TEMPERAMENT_PAIR_INSIGHT — short,
// non-clinical copy built directly from each quiz's own result content
// (strengths/growthEdges), never invented from nothing.

export type FamilyMemberProfile = {
  name: string;
  temperamentTag?: string;
  temperamentTitle?: string;
  temperamentStrengths?: string[];
  loveLanguageTag?: string;
  loveLanguageTitle?: string;
  parentingStyleTag?: string;
  parentingStyleTitle?: string;
  parentingStyleDescription?: string;
};

export type Headline = { title: string; description: string };

/** Roughly where each temperament sits on a Sensitive↔Active (x) and
 * Reserved↔Expressive (y) plane, loosely following the classic DISC-style
 * "social styles" quadrant mapping (Driver/Expressive/Amiable/Analytical)
 * onto the four temperaments. This is an illustrative placement, not a
 * measured trait score. Family members sharing a temperament are fanned
 * out evenly around this same point by the chart itself (see
 * FamilySummaryView's QuadrantChart), so they never overlap. */
export const TEMPERAMENT_QUADRANT: Record<string, { x: number; y: number }> = {
  sanguine: { x: 0.5, y: 0.6 }, // active + expressive
  choleric: { x: 0.6, y: -0.5 }, // active + reserved
  melancholic: { x: -0.6, y: -0.4 }, // sensitive + reserved
  phlegmatic: { x: -0.5, y: 0.3 }, // sensitive + mildly expressive
};

export const LOVE_LANGUAGE_STRENGTH_HEADLINE: Record<string, Headline> = {
  touch: {
    title: "Strong Affection",
    description: "Physical touch is a leading way this family shows and feels love.",
  },
  words: {
    title: "Encouragement Culture",
    description: "This family uplifts and motivates each other with words.",
  },
  time: {
    title: "Present With Each Other",
    description: "Quality time together is a real strength for this family.",
  },
  service: {
    title: "We Show Up For Each Other",
    description: "Acts of service are a natural way this family cares for one another.",
  },
  gifts: {
    title: "Thoughtful Gestures",
    description: "Small tokens of thoughtfulness carry real weight in this family.",
  },
};

export const LOVE_LANGUAGE_GROWTH_HEADLINE: Record<string, Headline> = {
  touch: {
    title: "Physical Affection",
    description: "Build in more everyday physical affection — it goes a long way here.",
  },
  words: {
    title: "Saying It Out Loud",
    description: "Voice appreciation more often — it's easy to assume it's understood.",
  },
  time: {
    title: "Time & Attention",
    description: "Intentionally create one-on-one moments — it's the least-represented language right now.",
  },
  service: {
    title: "Small Acts of Help",
    description: "Look for small, unasked-for ways to lighten each other's load.",
  },
  gifts: {
    title: "Thinking of Each Other",
    description: "A small, thoughtful surprise now and then can mean more than expected.",
  },
};

export const TEMPERAMENT_FAMILY_STRENGTH_HEADLINE: Record<string, Headline> = {
  sanguine: {
    title: "Joyful & Social Home",
    description: "This family brings energy, laughter and connection everywhere it goes.",
  },
  choleric: {
    title: "Natural Leadership",
    description: "Clear direction and follow-through keep this family moving forward.",
  },
  melancholic: {
    title: "Deep, Thoughtful Bonds",
    description: "This family notices the details and cares deeply beneath the surface.",
  },
  phlegmatic: {
    title: "Calm, Steady Home",
    description: "This family is easy to be around and rarely the source of conflict.",
  },
};

export const TEMPERAMENT_FAMILY_GROWTH_HEADLINE: Record<string, Headline> = {
  sanguine: {
    title: "Follow-through & Consistency",
    description: "Support each other in finishing what you start, together.",
  },
  choleric: {
    title: "Slowing Down Together",
    description: "Make space for others' pace, not just the fastest path forward.",
  },
  melancholic: {
    title: "Managing Moods",
    description: "Build healthy ways to handle big feelings with grace, not spirals.",
  },
  phlegmatic: {
    title: "Speaking Up",
    description: "Encourage voicing real preferences, not just keeping the peace.",
  },
};

/** Short adjective-style blurb per temperament, for the compact "Temperament
 * Overview" cards — distinct from the longer `description`/`inFamily` copy
 * used on the full result cards elsewhere in the app. */
export const TEMPERAMENT_SHORT_BLURB: Record<string, string> = {
  sanguine: "Energetic, enthusiastic, people-oriented",
  choleric: "Confident, decisive, natural leader",
  melancholic: "Thoughtful, observant, deep-feeling",
  phlegmatic: "Calm, steady, easygoing",
};

export const PARENTING_STYLE_FAMILY_HEADLINE: Record<string, Headline> = {
  authoritative: {
    title: "Balanced Leadership",
    description: "Clear boundaries with warmth create a safe space to grow.",
  },
  authoritarian: {
    title: "Clear Expectations",
    description: "Everyone knows exactly where they stand in this house.",
  },
  permissive: {
    title: "Warm & Low-Conflict",
    description: "This home is warm, responsive and rarely a source of tension.",
  },
  uninvolved: {
    title: "Room to Reconnect",
    description: "There's an opportunity to build more regular one-on-one time.",
  },
};

/** Given tag → count maps, returns the tag with the highest count (ties
 * broken by first-seen order), or null if nothing was counted. */
function mostCommon(counts: Map<string, number>): string | null {
  let best: string | null = null;
  let bestCount = 0;
  for (const [tag, count] of counts) {
    if (count > bestCount) {
      best = tag;
      bestCount = count;
    }
  }
  return best;
}

function leastCommon(counts: Map<string, number>): string | null {
  let best: string | null = null;
  let bestCount = Infinity;
  for (const [tag, count] of counts) {
    if (count < bestCount) {
      best = tag;
      bestCount = count;
    }
  }
  return best;
}

function countTag(members: FamilyMemberProfile[], key: "temperamentTag" | "loveLanguageTag") {
  const counts = new Map<string, number>();
  for (const m of members) {
    const tag = m[key];
    if (!tag) continue;
    counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return counts;
}

export function buildFamilyStrengths(members: FamilyMemberProfile[]): Headline[] {
  const out: Headline[] = [];

  const loveCounts = countTag(members, "loveLanguageTag");
  const dominantLove = mostCommon(loveCounts);
  if (dominantLove && LOVE_LANGUAGE_STRENGTH_HEADLINE[dominantLove]) {
    out.push(LOVE_LANGUAGE_STRENGTH_HEADLINE[dominantLove]);
  }

  const tempCounts = countTag(members, "temperamentTag");
  const dominantTemp = mostCommon(tempCounts);
  if (dominantTemp && TEMPERAMENT_FAMILY_STRENGTH_HEADLINE[dominantTemp]) {
    out.push(TEMPERAMENT_FAMILY_STRENGTH_HEADLINE[dominantTemp]);
  }

  const parentingTag = members.find((m) => m.parentingStyleTag)?.parentingStyleTag;
  if (parentingTag && PARENTING_STYLE_FAMILY_HEADLINE[parentingTag]) {
    out.push(PARENTING_STYLE_FAMILY_HEADLINE[parentingTag]);
  }

  return out;
}

export function buildFamilyGrowthAreas(members: FamilyMemberProfile[]): Headline[] {
  const out: Headline[] = [];

  const tempCounts = countTag(members, "temperamentTag");
  const dominantTemp = mostCommon(tempCounts);
  if (dominantTemp && TEMPERAMENT_FAMILY_GROWTH_HEADLINE[dominantTemp]) {
    out.push(TEMPERAMENT_FAMILY_GROWTH_HEADLINE[dominantTemp]);
  }

  const loveCounts = countTag(members, "loveLanguageTag");
  const leastLove = leastCommon(loveCounts);
  if (leastLove && LOVE_LANGUAGE_GROWTH_HEADLINE[leastLove]) {
    out.push(LOVE_LANGUAGE_GROWTH_HEADLINE[leastLove]);
  }

  return out;
}
