import Link from "next/link";
import Image from "next/image";
import { getQuizzesByCategory } from "@/lib/quizzes";
import ExploreCategories from "@/components/ExploreCategories";
import {
  HeartIcon,
  LockIcon,
  PlayIcon,
  PersonIcon,
  TwoPersonIcon,
  HomeIcon,
  CrossIcon,
} from "@/components/HomeIcons";

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
    title: "A Catholic Couples Prayer",
    paragraphs: [
      "Heavenly Father, thank you for the love you have implanted on our hearts. We humbly pray that by the help of your grace we learn love. Lord God, teach us how to love patiently and kindly. To not envy, nor boast nor be proud. To not dishonour one another, to not be self-seeking nor easily angered, to forgive and to keep no record of wrongs. Help us rejoice with the truth and not delight in evil. Teach us love that always protects, always trusts, always hopes, and always perseveres.",
      "Lord Jesus, in your constant mercy and by your death on the cross you have shown us unconditional love. You prove your selfless love for us over and over again. Please teach us to love one another and love others with the same selfless love you have shown us. Help us reject selfish, self-seeking love. Free us to love differently and guide us by your Holy Spirit to have the wisdom and strength to discern and live out what is asked of us. We pray, above all else, that our love for you and our relationship with you is strengthened — that we may grow ever more close to you, and to each other, every single day.",
      "Jesus, we invite you to be at the centre of our lives and at the centre of our relationship. Help us to keep our eyes fixed on you, to put you first, depend on you first, and not on each other. As sons and daughters of our Heavenly King, we pray that in our relationship we live the gospel with our whole lives, be witnesses to the world, bring light to others, and most of all bring glory to you, O Lord Jesus. Virgin Mary, Mother of God, and St. Joseph, her most chaste spouse, please pray for us — for a deeper conversion, trust and understanding, chastity, emotional purity, and a God-honouring relationship.",
      "St. Maria Goretti, St. Ignatius, St. Augustine, St. Thérèse of Lisieux, St. Catherine of Siena, St. Patrick, St. Theresa, St. Francis Xavier — pray for us. Amen.",
    ],
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    Icon: PersonIcon,
    title: "Take a quiz",
    body: "Pick a Parenting, Personality, or Relationships assessment and answer honestly — most take just a few minutes.",
  },
  {
    Icon: TwoPersonIcon,
    title: "Compare with your spouse",
    body: "Take it together live, or each upload your own results PDF, and see a side-by-side “How We Compare” view.",
  },
  {
    Icon: HomeIcon,
    title: "Bring your whole family together",
    body: "Drop in results from everyone — parents and kids — on the Family Summary page for one shared dashboard.",
  },
];

export default function Home() {
  const groups = getQuizzesByCategory();

  return (
    <div className="flex-1 bg-white text-[#1C1C1C]">
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 sm:py-24 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#F6EDE3] px-4 py-1.5 text-sm font-medium text-[#5A4C3C]">
              <HeartIcon className="h-4 w-4" />
              Understand. Connect. Grow together.
            </span>

            <h1 className="font-display mt-6 text-[clamp(2.5rem,6vw,3.75rem)] font-semibold leading-[1.08]">
              Understand
              <br />
              your family.
              <br />
              <span className="text-[#7C9473]">Build stronger</span>
              <br />
              <span className="text-[#7C9473]">relationships.</span>
            </h1>

            <p className="mt-6 max-w-md text-lg leading-relaxed text-[#5B5B5B]">
              FamilyWise provides thoughtful assessments to help you
              understand yourself, your children and your relationships
              better.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="#assessments"
                className="rounded-full bg-[#1C1C1C] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[#333]"
              >
                Explore assessments →
              </Link>
              <Link
                href="#how-it-works"
                className="flex items-center gap-2 rounded-full border border-[#D8D3C8] bg-white px-5 py-3.5 text-base font-semibold text-[#1C1C1C] transition hover:border-[#1C1C1C]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#1C1C1C]">
                  <PlayIcon className="h-3 w-3 translate-x-[1px]" />
                </span>
                See how it works
              </Link>
            </div>

            <p className="mt-6 flex items-center gap-2 text-sm text-[#8A8A8A]">
              <LockIcon className="h-4 w-4" />
              Private by design. Your answers stay on your device.
            </p>
          </div>

          <Image
            src="/hero-family.jpeg"
            alt="Illustration of a family of four embracing"
            width={1076}
            height={976}
            priority
            style={{
              maskImage:
                "radial-gradient(ellipse 68% 68% at center, black 45%, transparent 85%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 68% 68% at center, black 45%, transparent 85%)",
            }}
            className="mx-auto w-full max-w-md"
          />
        </div>
      </section>

      {/* ---------- Prayers ---------- */}
      <section id="prayers" className="border-t border-[#ECE7DC] bg-[#FBFAF7]">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#F6EDE3] px-4 py-1.5 text-sm font-medium text-[#5A4C3C]">
              <CrossIcon className="h-4 w-4" />
              A Catholic Prayer
            </span>
            <h2 className="font-display mt-4 text-3xl font-semibold sm:text-4xl">
              Prayers for Families
            </h2>
            <p className="mt-3 text-lg text-[#6B6B6B]">
              A few words to carry with you, for the people you love most.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-8 sm:grid-cols-2">
            {PRAYERS.map((prayer) => (
              <div
                key={prayer.title}
                className="rounded-3xl border border-[#ECE7DC] bg-[#FBF6EC] p-8 shadow-sm sm:p-10"
              >
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#7C9473]">
                  <CrossIcon className="h-5 w-5" />
                </span>
                <h3 className="font-display mt-5 text-center text-2xl font-semibold">
                  {prayer.title}
                </h3>
                <div className="mt-5 flex flex-col gap-4">
                  {prayer.paragraphs.map((p, i) => (
                    <p
                      key={i}
                      className="text-center text-base italic leading-relaxed text-[#4A4A4A]"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how-it-works" className="border-t border-[#ECE7DC] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              See how it works
            </h2>
            <p className="mt-3 text-lg text-[#6B6B6B]">
              From picking an assessment to seeing your whole family&apos;s
              results together.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-3xl border border-[#ECE7DC] shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/how-it-works.gif"
              alt="Walkthrough of FamilyWise: browsing assessments, taking the Parenting Style quiz, viewing personalized results, and building a Family Summary dashboard from multiple family members' results"
              className="w-full"
            />
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS_STEPS.map(({ Icon, title, body }, i) => (
              <div key={title} className="text-center sm:text-left">
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#F6EDE3] text-[#1C1C1C] sm:mx-0">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-display mt-4 text-xl font-semibold">
                  {i + 1}. {title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-[#6B6B6B]">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- What would you like to explore ---------- */}
      <section id="assessments" className="border-t border-[#ECE7DC] bg-[#FBFAF7]">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              What would you like to explore?
            </h2>
            <p className="mt-3 text-lg text-[#6B6B6B]">
              Choose a category to see its assessments.
            </p>
          </div>

          <div className="mt-10">
            <ExploreCategories groups={groups} />
          </div>
        </div>
      </section>
    </div>
  );
}
