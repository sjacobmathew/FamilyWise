"use client";

import Link from "next/link";
import type { Quiz } from "@/lib/types";
import {
  DISCERNMENT_NOTE,
  OPENING_PRAYER,
  SCRIPTURE_REFERENCE,
  SCRIPTURE_TEXT,
} from "@/lib/charism";
import {
  ArrowIcon,
  BackArrowIcon,
  BookmarkIcon,
  CheckCircleIcon,
  ClockIcon,
  CrossIcon,
  LeafSprig,
  LockIcon,
  StarIcon,
} from "@/components/HomeIcons";

function IntroCard({
  icon,
  title,
  tint = "bg-card",
  children,
}: {
  icon: React.ReactNode;
  title: string;
  tint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`rounded-3xl border border-border ${tint} p-6 shadow-sm sm:p-8`}>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-soft text-forest">
          {icon}
        </span>
        <h2 className="font-display text-2xl font-semibold text-walnut">{title}</h2>
      </div>
      <div className="mt-4 flex flex-col gap-4 text-lg leading-relaxed text-walnut-soft">
        {children}
      </div>
    </section>
  );
}

export default function CharismIntro({
  quiz,
  onBegin,
}: {
  quiz: Quiz;
  onBegin: () => void;
}) {
  return (
    <div className="flex-1 bg-paper pb-16">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <Link
            href="/"
            className="flex w-fit items-center gap-1 text-sm font-medium text-walnut-soft hover:text-sienna"
          >
            <BackArrowIcon className="h-3.5 w-3.5" />
            All quizzes
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 pt-10">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#F6EDE3] px-4 py-1.5 text-sm font-medium text-[#5A4C3C]">
            <CrossIcon className="h-4 w-4" />
            Before you begin
          </span>
          <h1 className="font-display mt-5 text-4xl font-semibold text-walnut sm:text-5xl">
            {quiz.title}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-walnut-soft">
            Take a quiet moment first. This is an invitation to reflect, not a test.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-6">
          <IntroCard icon={<CrossIcon className="h-5 w-5" />} title="Begin in prayer">
            <p>
              Before you answer the questions, pause and ask for the grace to recognize
              the gifts God has given you, to seek His will, and to be guided by the Holy
              Spirit as you answer honestly.
            </p>
            {OPENING_PRAYER.length > 0 && (
              <div className="flex flex-col gap-3 rounded-2xl bg-[#FBF6EC] p-5 text-center italic text-[#4A4A4A]">
                {OPENING_PRAYER.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
          </IntroCard>

          <IntroCard icon={<BookmarkIcon className="h-5 w-5" />} title="Scripture foundation">
            <p className="font-display text-xl font-semibold text-walnut">
              {SCRIPTURE_REFERENCE}
            </p>
            {SCRIPTURE_TEXT.length > 0 && (
              <div className="flex flex-col gap-3 rounded-2xl bg-[#FBF6EC] p-5 italic text-[#4A4A4A]">
                {SCRIPTURE_TEXT.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
            {SCRIPTURE_TEXT.length === 0 && (
              <p>
                It teaches that there are different spiritual gifts, forms of service,
                and workings, but the same Spirit and the same Lord — and that the
                manifestation of the Spirit is given for the benefit of others.
              </p>
            )}
          </IntroCard>

          <IntroCard icon={<StarIcon className="h-5 w-5" />} title="About the assessment">
            <div className="flex flex-wrap gap-2 text-sm font-semibold text-forest">
              <span className="rounded-full bg-forest-soft px-3 py-1">
                {quiz.questions.length} questions
              </span>
              <span className="rounded-full bg-forest-soft px-3 py-1">18 charism areas</span>
              <span className="flex items-center gap-1.5 rounded-full bg-forest-soft px-3 py-1">
                <ClockIcon className="h-3.5 w-3.5" />
                {quiz.estimatedMinutes ?? "15–20"} minutes
              </span>
            </div>
            <p>
              The FamilyWise Charism Assessment is an introductory tool for reflecting on
              the gifts the Holy Spirit may be giving a person for service to God and
              others.
            </p>
            <p>
              Charisms, or spiritual gifts, are special graces given by the Holy Spirit and
              are intended to be exercised in service of God and the good of others.
              FamilyWise presents the assessment within a Catholic Christian framework and
              understands charisms in light of the Church&rsquo;s teaching, including
              Catechism of the Catholic Church §2003.
            </p>
            <p>
              The assessment is an introductory aid to discernment, not a definitive
              declaration of a person&rsquo;s charisms. A high score can indicate an area
              worth exploring, but genuine discernment develops through prayer, lived
              experience, service, reflection, and guidance from the Church and trusted
              spiritual mentors. The purpose is not simply to identify what a person is
              good at, but to help them prayerfully consider how their gifts may be used in
              love of God and neighbor.
            </p>
          </IntroCard>

          <IntroCard icon={<CheckCircleIcon className="h-5 w-5" />} title="How to complete it">
            <p>
              Read each statement and rate how true it is of you as you actually are,
              rather than how you think you should behave or feel. Be as honest as
              possible. When unsure, your first honest response will often be the most
              useful.
            </p>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(quiz.answerOptions ?? []).map((o) => (
                <li
                  key={o.label}
                  className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-paper px-3 py-4 text-center"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-soft text-base font-bold text-forest">
                    {o.points}
                  </span>
                  <span className="text-base font-semibold text-walnut">{o.label}</span>
                </li>
              ))}
            </ul>
            <p>
              Answer every question. Do not choose an answer because you believe a
              particular charism is more desirable, more spiritual, or more suitable for
              ministry. The goal is honest self-reflection.
            </p>
          </IntroCard>

          <IntroCard
            icon={<LeafSprig className="h-5 w-5 text-forest" />}
            title="A note on discernment"
            tint="bg-forest-soft/40"
          >
            <p>{DISCERNMENT_NOTE}</p>
          </IntroCard>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={onBegin}
            className="flex items-center gap-2 rounded-full bg-forest px-8 py-3.5 text-lg font-semibold text-paper transition hover:bg-forest-dark"
          >
            Begin the assessment
            <ArrowIcon className="h-4 w-4" />
          </button>
          <p className="flex items-center gap-2 text-sm text-walnut-soft">
            <LockIcon className="h-4 w-4" />
            Your answers are private — nothing is saved once you close this tab.
          </p>
          <p className="mt-2 max-w-md text-center text-xs text-walnut-soft">
            Adapted from the introductory pages of the Saint Bernadette Catholic Church
            Spiritual Gifts Assessment.
          </p>
        </div>
      </div>
    </div>
  );
}
