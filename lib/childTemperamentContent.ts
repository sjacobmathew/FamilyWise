// Presentational content for the richer Child Temperament result card —
// a short "at a glance" breakdown per temperament, plus which theme icon
// to show. Kept in code (not the quiz data file) since it's specific to
// how this one result is displayed, not the scoring/quiz content itself.

export type TemperamentGlance = {
  thinksAndFeels: string;
  relates: string;
  reacts: string;
  needs: string;
};

export const TEMPERAMENT_GLANCE: Record<string, TemperamentGlance> = {
  sanguine: {
    thinksAndFeels: "Lives in the moment — thinks and talks it out loud, out loud.",
    relates: "Makes friends instantly and is the spark of every group.",
    reacts: "Bounces back fast, but loses focus just as fast.",
    needs: "Engaging tasks, lots of positive attention, and gentle structure.",
  },
  choleric: {
    thinksAndFeels: "Decisive and goal-driven — thinks in terms of winning and doing.",
    relates: "A natural leader among peers, sets the agenda for the group.",
    reacts: "Pushes back hard against limits, recovers fast from setbacks.",
    needs: "Real choices, clear reasons for rules, and room to lead.",
  },
  melancholic: {
    thinksAndFeels: "Deeply thoughtful, sensitive, and observant.",
    relates: "Loyal friend, prefers meaningful connections.",
    reacts: "Needs time to adjust, feels things intensely.",
    needs: "Preparation, understanding, and gentle encouragement.",
  },
  phlegmatic: {
    thinksAndFeels: "Calm and even — rarely rushes into a reaction.",
    relates: "An easygoing playmate who avoids drama and conflict.",
    reacts: "Slow to warm up to change, rarely raises a fuss.",
    needs: "Direct questions, patience, and gentle nudges to try new things.",
  },
};

export const DEFAULT_GLANCE: TemperamentGlance = {
  thinksAndFeels: "Has their own natural way of processing the world.",
  relates: "Connects with others in their own way.",
  reacts: "Has their own natural pace for handling change.",
  needs: "Patience, understanding, and consistency.",
};

/** Short, static (no AI call) insight per unordered pair of dominant
 * temperaments, for comparing two people's results side by side. Keyed by
 * the two tags sorted alphabetically and joined with "|". */
export const TEMPERAMENT_PAIR_INSIGHT: Record<string, string> = {
  "choleric|choleric":
    "You're both driven and decisive — you'll get a lot done together, but watch for two strong wills competing for control. Take turns leading.",
  "melancholic|melancholic":
    "You both feel things deeply and think things through — you'll understand each other's need for space, but can also spiral together over small setbacks. Balance each other's worry with reassurance.",
  "phlegmatic|phlegmatic":
    "You're both calm and easygoing — conflict rarely erupts, but decisions can stall while you each wait for the other to speak up. Make a habit of asking each other directly what you want.",
  "sanguine|sanguine":
    "You're both spontaneous and social — expect a lively, ever-changing home, but make sure follow-through and quiet listening get their fair share of attention too.",
  "choleric|sanguine":
    "One of you drives toward the goal, the other brings the fun along the way — a great team once the driven one lets the spontaneous one breathe, and the spontaneous one respects the driven one's need to finish what's started.",
  "melancholic|sanguine":
    "One of you needs quiet and planning, the other thrives on spontaneity and people — you can balance each other beautifully once you stop mistaking each other's pace for carelessness or coldness.",
  "phlegmatic|sanguine":
    "One of you is the calm anchor, the other the spark — a naturally easy match, as long as the anchor speaks up instead of quietly checking out, and the spark doesn't mistake calm for disinterest.",
  "choleric|melancholic":
    "One of you moves fast and decides fast, the other needs time to think it through — you'll get further by slowing down for the details together, rather than one pushing while the other digs in.",
  "choleric|phlegmatic":
    "One of you leads, the other lets things flow — this works well once the leader learns to ask instead of assume, and the easygoing one learns to voice a real preference instead of just going along.",
  "melancholic|phlegmatic":
    "You're both naturally quiet and low-drama, which makes for a peaceful home — just watch that neither of you is quietly unhappy without the other knowing. Check in on purpose.",
};

export const DEFAULT_PAIR_INSIGHT =
  "Every pairing of temperaments has its own natural rhythm — noticing where you each lead and where you each need support is the first step to working well together.";

export function pairInsightKey(tagA: string, tagB: string): string {
  return [tagA, tagB].sort().join("|");
}

/** Splits a tip like "Do X — because Y" into a bold lead-in and the rest.
 * Falls back to a semicolon, then no split at all. */
export function splitTip(tip: string): [string, string] {
  for (const sep of [" — ", "; "]) {
    const i = tip.indexOf(sep);
    if (i > -1) {
      return [tip.slice(0, i), tip.slice(i + sep.length)];
    }
  }
  return [tip, ""];
}
