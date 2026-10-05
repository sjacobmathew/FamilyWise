"use client";

import { useState } from "react";
import { CrossIcon, ChevronRightIcon } from "@/components/HomeIcons";

const PRAYERS = [
  {
    title: "A Prayer for Our Children",
    paragraphs: [
      "Heavenly Father, we come before You with grateful hearts, lifting up our children into Your loving hands. You are the Giver of life, the Source of wisdom, and the Keeper of every promise.",
      "Lord, surround our children with Your divine protection. Shield them from harm, evil influences, and fear. Let Your angels guard their steps wherever they go, and let Your light guide their path each day.",
      "Grant them wisdom to make right choices, a heart that loves truth and goodness, and faith that grows stronger even in difficult times.",
      "Fill their minds with peace, their hearts with compassion, and their spirits with courage to stand firm in righteousness.",
      "May they always know they are deeply loved — by You, by us, and by those who walk in Your grace. Bless their dreams, Lord, and help them to become who You created them to be.",
    ],
  },
  {
    title: "A Prayer for Our Marriage",
    paragraphs: [
      "Heavenly Father, we come before You with grateful hearts for the gift of our marriage. Thank You for bringing us together and for the love that You have planted in our hearts. Lord, we ask that You be the foundation of our union, guiding us to grow closer to You and to each other every day.",
      "Teach us to love selflessly, forgive quickly, and serve one another with humility. Help us to honor and respect each other in both word and action, seeking unity and peace in all things. May we always see each other through Your eyes, full of grace and compassion.",
      "Strengthen our bond in times of joy and sustain us in times of trial. Remind us that You are our refuge and strength, and that we can do all things through Christ who gives us strength. May Your Word be the lamp that lights our path, and may we walk together in faith, hope, and love.",
      "Bless our marriage with laughter, patience, and understanding. Help us to build a home that reflects Your love, where we can encourage one another to grow in faith and lead a life that glorifies You.",
      "O Lord Jesus, Virgin Mary, Mother of God, and St. Joseph, her most chaste spouse, please pray for us — for a deeper conversion, trust and understanding, chastity, emotional purity, and a God-honouring relationship. St. Maria Goretti, St. Ignatius, St. Augustine, St. Thérèse of Lisieux, St. Catherine of Siena, St. Patrick, St. Theresa, St. Francis Xavier — pray for us. Amen.",
    ],
  },
];

function PrayerCard({
  title,
  paragraphs,
}: {
  title: string;
  paragraphs: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      className="w-full rounded-3xl border border-[#ECE7DC] bg-[#FBF6EC] p-8 text-left shadow-sm transition hover:border-[#7C9473] sm:p-10"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#7C9473]">
            <CrossIcon className="h-5 w-5" />
          </span>
          <h3 className="font-display text-xl font-semibold sm:text-2xl">
            {title}
          </h3>
        </div>
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#7C9473] transition-transform"
          style={{ transform: open ? "rotate(90deg)" : undefined }}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </span>
      </div>

      {open ? (
        <div className="mt-6 flex flex-col gap-4">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-center text-base italic leading-relaxed text-[#4A4A4A]"
            >
              {p}
            </p>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-center text-sm text-[#8A8A8A]">
          Tap to read the prayer
        </p>
      )}
    </button>
  );
}

export default function PrayersSection() {
  return (
    <section id="prayers" className="border-t border-[#ECE7DC] bg-[#FBFAF7]">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Prayers for Families
          </h2>
          <p className="mt-3 text-lg text-[#6B6B6B]">
            A few words to carry with you, for the people you love most.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-8 sm:grid-cols-2">
          {PRAYERS.map((prayer) => (
            <PrayerCard key={prayer.title} {...prayer} />
          ))}
        </div>
      </div>
    </section>
  );
}
