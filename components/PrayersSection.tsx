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
      "Heavenly Father, thank you for the love you have implanted on our hearts. We humbly pray that by the help of your grace we learn love. Lord God, teach us how to love patiently and kindly. To not envy, nor boast nor be proud. To not dishonour one another, to not be self-seeking nor easily angered, to forgive and to keep no record of wrongs. Help us rejoice with the truth and not delight in evil. Teach us love that always protects, always trusts, always hopes, and always perseveres.",
      "Lord Jesus, in your constant mercy and by your death on the cross you have shown us unconditional love. You prove your selfless love for us over and over again. Please teach us to love one another and love others with the same selfless love you have shown us. Help us reject selfish, self-seeking love. Free us to love differently and guide us by your Holy Spirit to have the wisdom and strength to discern and live out what is asked of us. We pray, above all else, that our love for you and our relationship with you is strengthened — that we may grow ever more close to you, and to each other, every single day.",
      "Jesus, we invite you to be at the centre of our lives and at the centre of our relationship. Help us to keep our eyes fixed on you, to put you first, depend on you first, and not on each other. As sons and daughters of our Heavenly King, we pray that in our relationship we live the gospel with our whole lives, be witnesses to the world, bring light to others, and most of all bring glory to you, O Lord Jesus. Virgin Mary, Mother of God, and St. Joseph, her most chaste spouse, please pray for us — for a deeper conversion, trust and understanding, chastity, emotional purity, and a God-honouring relationship.",
      "St. Maria Goretti, St. Ignatius, St. Augustine, St. Thérèse of Lisieux, St. Catherine of Siena, St. Patrick, St. Theresa, St. Francis Xavier — pray for us. Amen.",
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
