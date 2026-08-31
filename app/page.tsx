import Link from "next/link";
import Image from "next/image";
import { getQuizzesByCategory } from "@/lib/quizzes";
import ExploreCategories from "@/components/ExploreCategories";
import { HeartIcon, LockIcon, PlayIcon } from "@/components/HomeIcons";

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
                href="#assessments"
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
            className="mx-auto w-full max-w-md"
          />
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
