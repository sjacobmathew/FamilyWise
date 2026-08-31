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
