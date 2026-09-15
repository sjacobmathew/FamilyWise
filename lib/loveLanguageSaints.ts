// Patron saints paired with each love language, shown on the Love
// Languages (Spouse) results page. Facts are drawn from each saint's
// well-documented life; phrasing here is original, not quoted from any
// source.

export type SaintInfo = {
  name: string;
  story: string;
  patronOf: string;
  accent: string;
  accentSoft: string;
};

export const LOVE_LANGUAGE_SAINTS: Record<string, SaintInfo> = {
  words: {
    name: "St. Francis de Sales",
    story:
      "He wrote thousands of personal letters in his lifetime — to strangers, to people struggling in their faith, to anyone who needed encouragement. He believed gentleness did more good than fear ever could, and spent his life proving it.",
    patronOf: "Patron saint of hearing it said out loud.",
    accent: "#D98F89",
    accentSoft: "#FBE9E6",
  },
  service: {
    name: "St. Zita",
    story:
      "She spent nearly sixty years in service to one household, doing ordinary work faithfully and without recognition. She shared what little she had with the poor and never expected anything in return.",
    patronOf: "Patron saint of showing up.",
    accent: "#7C9473",
    accentSoft: "#E9F0E3",
  },
  gifts: {
    name: "St. Nicholas",
    story:
      "He heard that a poor father couldn't provide for his daughters, so — in the middle of the night, without being seen — he tossed bags of gold through the family's window. When he was finally caught in the act, he simply asked them not to tell anyone.",
    patronOf: "Patron saint of remembering what you love.",
    accent: "#C99A4B",
    accentSoft: "#F5EAD3",
  },
  time: {
    name: "St. Mary of Bethany",
    story:
      "While her sister Martha busied herself managing the household, Mary of Bethany chose to simply sit at Jesus's feet and stay there. When Martha complained, Jesus told her Mary had chosen the better part — and it would not be taken from her.",
    patronOf: "Patron saint of just being there.",
    accent: "#9B90C9",
    accentSoft: "#EFEBF9",
  },
  touch: {
    name: "St. Damien of Molokai",
    story:
      "He moved to a leper colony in Hawaii when almost no one else would go near it. For sixteen years he tended wounds with his own hands and built homes and a church alongside the people there — and in time, he contracted the disease himself.",
    patronOf: "Patron saint of not flinching away.",
    accent: "#7EA3A1",
    accentSoft: "#E4EEED",
  },
};
