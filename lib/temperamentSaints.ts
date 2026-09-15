// Patron saints paired with each temperament, shown on the Temperament
// (Spouse) results page. Bible verse pairings and "other saints" lists are
// as supplied by the site owner.

export type TemperamentSaintInfo = {
  name: string;
  bibleVerse: string;
  bibleReference: string;
  otherSaints: string[];
  accent: string;
  accentSoft: string;
  image?: { src: string; width: number; height: number };
};

export const TEMPERAMENT_SAINTS: Record<string, TemperamentSaintInfo> = {
  sanguine: {
    name: "St. Teresa of Avila",
    bibleVerse: "Rejoice in the Lord always!",
    bibleReference: "Phil 4:4",
    otherSaints: ["St. Peter", "St. Francis Xavier", "St. Francis of Assisi"],
    accent: "#C99A4B",
    accentSoft: "#F5EAD3",
    image: { src: "/saints/st-teresa-of-avila.png", width: 436, height: 592 },
  },
  choleric: {
    name: "St. Paul",
    bibleVerse: "Whatever you do, work heartily, as for the Lord and not for men.",
    bibleReference: "Col 3:23",
    otherSaints: [
      "St. James",
      "St. Ignatius of Loyola",
      "St. Jerome",
      "Mother Angelica",
    ],
    accent: "#D9776E",
    accentSoft: "#FBE1DE",
    image: { src: "/saints/st-paul.png", width: 426, height: 510 },
  },
  melancholic: {
    name: "St. John the Apostle",
    bibleVerse: "Weeping may endure for a night but joy comes with the morning.",
    bibleReference: "Psalm 30:6",
    otherSaints: ["St. John Henry Newman", "St. Therese", "St. Bernard of Clairvaux"],
    accent: "#9B90C9",
    accentSoft: "#EFEBF9",
    image: { src: "/saints/st-john-the-apostle.png", width: 376, height: 572 },
  },
  phlegmatic: {
    name: "St. Thomas Aquinas",
    bibleVerse: "Blessed are the peacemakers, for they will be called children of God.",
    bibleReference: "Matt 5:9",
    otherSaints: ["Pope St. John XXIII", "St. Faustina"],
    accent: "#7EA3A1",
    accentSoft: "#E4EEED",
    image: { src: "/saints/st-thomas-aquinas.png", width: 386, height: 564 },
  },
};
