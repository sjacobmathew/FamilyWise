"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { Quiz } from "@/lib/types";
import { scoreRatingByTag, scoreForcedChoice, normalizeResultContent } from "@/lib/scoring";
import { extractPdfText, parseFamilyPdfSections } from "@/lib/pdfResults";
import {
  readFamilyMembers,
  ensureFamilyMember,
  removeFamilyMember,
  readFamilyAnswers,
  writeFamilyAnswers,
  type FamilyMember,
} from "@/lib/familyRoster";
import {
  TEMPERAMENT_QUADRANT,
  jitterFor,
  buildFamilyStrengths,
  buildFamilyGrowthAreas,
  TEMPERAMENT_SHORT_BLURB,
  type FamilyMemberProfile,
} from "@/lib/familyDynamicsContent";
import PrivacyNote from "@/components/PrivacyNote";
import { THEME_ICON } from "@/components/ChildTemperamentResult";
import {
  PersonIcon,
  HeartIcon,
  ChatBubbleIcon,
  ClockIcon,
  CheckCircleIcon,
  GiftIcon,
  HandIcon,
  SproutIcon,
  LeafSprig,
  ChevronRightIcon,
} from "@/components/HomeIcons";

function noopSubscribe() {
  return () => {};
}

const QUIZ_SLOT: Record<string, "temperament" | "loveLanguage" | "parentingStyle"> = {
  temperament: "temperament",
  "child-temperament": "temperament",
  "love-languages": "loveLanguage",
  "love-languages-child": "loveLanguage",
  "parenting-style": "parentingStyle",
};

const TEMPERAMENT_COLOR: Record<string, string> = {
  sanguine: "#D98F89",
  choleric: "#9B90C9",
  melancholic: "#7C9473",
  phlegmatic: "#C9A063",
};

const LOVE_LANGUAGE_COLOR: Record<string, string> = {
  words: "#9B90C9",
  time: "#7C9473",
  service: "#C9A063",
  gifts: "#D98F89",
  touch: "#D9776E",
};

const LOVE_LANGUAGE_ICON: Record<string, (p: { className?: string }) => React.ReactNode> = {
  words: ChatBubbleIcon,
  time: ClockIcon,
  service: CheckCircleIcon,
  gifts: GiftIcon,
  touch: HandIcon,
};

const LOVE_LANGUAGE_LABEL: Record<string, string> = {
  words: "Words of Affirmation",
  time: "Quality Time",
  service: "Acts of Service",
  gifts: "Receiving Gifts",
  touch: "Physical Touch",
};

const AVATAR_PALETTE = [
  { bg: "#E9F0E3", color: "#7C9473" },
  { bg: "#FBE9E6", color: "#D98F89" },
  { bg: "#EFEBF9", color: "#9B90C9" },
  { bg: "#FBF3E1", color: "#C9A063" },
];

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Strips a temperament title like `Sanguine — The Connector` or
 * `Sanguine — "The Spark"` down to just "Connector" / "Spark". */
function temperamentNickname(title?: string): string | null {
  if (!title) return null;
  const parts = title.split(/\s+[—–-]\s+/);
  const raw = parts.length === 2 ? parts[1] : title;
  return raw.replace(/^["']|["']$/g, "").replace(/^The\s+/i, "").trim();
}

function tagPill(profile: FamilyMemberProfile): string | null {
  const nickname = temperamentNickname(profile.temperamentTitle);
  const words = [nickname, ...(profile.temperamentStrengths ?? []).slice(0, 2).map(capitalize)].filter(
    (w): w is string => Boolean(w)
  );
  return words.length > 0 ? words.join(" • ") : null;
}

type ScoredQuiz = { tag: string; title: string; strengths?: string[]; description?: string };

function scoreQuizForMember(quiz: Quiz, name: string): ScoredQuiz | null {
  const answers = readFamilyAnswers(name, quiz.quizId);
  if (!answers) return null;
  const scores =
    quiz.flow === "forced-choice-then-result"
      ? scoreForcedChoice(quiz, answers as Record<string, "A" | "B">)
      : scoreRatingByTag(quiz, answers as Record<string, number>);
  const [primary] = scores;
  if (!primary || !quiz.results?.[primary.tag]) return null;
  const result = normalizeResultContent(quiz.results[primary.tag]);
  return { tag: primary.tag, title: result.title, strengths: result.strengths, description: result.description };
}

function buildProfile(member: FamilyMember, quizzes: Quiz[]): FamilyMemberProfile {
  const profile: FamilyMemberProfile = {
    name: member.name,
  };
  for (const quiz of quizzes) {
    const slot = QUIZ_SLOT[quiz.quizId];
    if (!slot) continue;
    const scored = scoreQuizForMember(quiz, member.name);
    if (!scored) continue;
    if (slot === "temperament" && !profile.temperamentTag) {
      profile.temperamentTag = scored.tag;
      profile.temperamentTitle = scored.title;
      profile.temperamentStrengths = scored.strengths;
    } else if (slot === "loveLanguage" && !profile.loveLanguageTag) {
      profile.loveLanguageTag = scored.tag;
      profile.loveLanguageTitle = scored.title;
    } else if (slot === "parentingStyle" && !profile.parentingStyleTag) {
      profile.parentingStyleTag = scored.tag;
      profile.parentingStyleTitle = scored.title;
      profile.parentingStyleDescription = scored.description;
    }
  }
  return profile;
}

function Ring({ segments }: { segments: { count: number; color: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.count, 0) || 1;
  const circumference = 2 * Math.PI * 44;
  const withOffsets = segments.reduce<{ count: number; color: string; len: number; offset: number }[]>(
    (acc, seg) => {
      const len = (seg.count / total) * circumference;
      const prev = acc[acc.length - 1];
      const offset = prev ? prev.offset + prev.len : 0;
      return [...acc, { ...seg, len, offset }];
    },
    []
  );

  return (
    <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
      <circle cx="50" cy="50" r="44" fill="none" stroke="#ECE7DC" strokeWidth="10" />
      {withOffsets.map((seg, i) =>
        seg.count === 0 ? null : (
          <circle
            key={i}
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke={seg.color}
            strokeWidth="10"
            strokeDasharray={`${seg.len} ${circumference - seg.len}`}
            strokeDashoffset={-seg.offset}
            strokeLinecap="round"
          />
        )
      )}
    </svg>
  );
}

function QuadrantChart({ people }: { people: { name: string; tag: string }[] }) {
  const size = 280;
  const center = size / 2;
  const scale = 108;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto w-full max-w-xs">
      <line x1={center} y1={14} x2={center} y2={size - 14} stroke="#ECE7DC" strokeWidth="1.5" />
      <line x1={14} y1={center} x2={size - 14} y2={center} stroke="#ECE7DC" strokeWidth="1.5" />
      <text x={center} y={12} textAnchor="middle" fontSize="11" fill="#6B6B6B" fontFamily="var(--font-body)">More Expressive</text>
      <text x={center} y={size - 4} textAnchor="middle" fontSize="11" fill="#6B6B6B" fontFamily="var(--font-body)">More Reserved</text>
      <text x={10} y={center} textAnchor="start" fontSize="11" fill="#6B6B6B" fontFamily="var(--font-body)" transform={`rotate(-90 10 ${center})`}>More Sensitive</text>
      <text x={size - 10} y={center} textAnchor="end" fontSize="11" fill="#6B6B6B" fontFamily="var(--font-body)" transform={`rotate(-90 ${size - 10} ${center})`}>More Active</text>
      {people.map((p) => {
        const base = TEMPERAMENT_QUADRANT[p.tag] ?? { x: 0, y: 0 };
        const j = jitterFor(p.name);
        const x = center + (base.x + j.dx) * scale;
        const y = center - (base.y + j.dy) * scale;
        const color = TEMPERAMENT_COLOR[p.tag] ?? "#6B6B6B";
        return (
          <g key={p.name}>
            <circle cx={x} cy={y} r={15} fill={color} fillOpacity={0.18} />
            <circle cx={x} cy={y} r={7} fill={color} />
            <text x={x} y={y - 15} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1C1C1C" fontFamily="var(--font-body)">
              {p.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

type LogEntry = {
  fileName: string;
  status: "detected" | "unrecognized";
  name?: string;
  quizTitle?: string;
};

type PendingPrompt = {
  id: string;
  fileName: string;
  quiz: Quiz;
  answers: Record<string, number | "A" | "B">;
  draftName: string;
};

export default function FamilySummaryView({ quizzes }: { quizzes: Quiz[] }) {
  const membersJson = useSyncExternalStore(
    noopSubscribe,
    () => JSON.stringify(readFamilyMembers()),
    () => "[]"
  );
  const members: FamilyMember[] = JSON.parse(membersJson);

  const [, setTick] = useState(0);
  const rerender = () => setTick((n) => n + 1);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [pending, setPending] = useState<PendingPrompt[]>([]);

  async function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    setProcessing(true);
    for (const file of files) {
      try {
        const text = await extractPdfText(file);
        const matches = parseFamilyPdfSections(quizzes, text);
        if (matches.length === 0) {
          setLog((l) => [...l, { fileName: file.name, status: "unrecognized" }]);
          continue;
        }
        for (const match of matches) {
          if (match.name) {
            ensureFamilyMember(match.name);
            writeFamilyAnswers(match.name, match.quiz.quizId, match.answers);
            setLog((l) => [
              ...l,
              { fileName: file.name, status: "detected", name: match.name!, quizTitle: match.quiz.title },
            ]);
          } else {
            setPending((p) => [
              ...p,
              {
                id: `${file.name}-${match.quiz.quizId}-${p.length}`,
                fileName: file.name,
                quiz: match.quiz,
                answers: match.answers,
                draftName: "",
              },
            ]);
          }
        }
      } catch {
        setLog((l) => [...l, { fileName: file.name, status: "unrecognized" }]);
      }
    }
    setProcessing(false);
    rerender();
  }

  function confirmPending(id: string) {
    const item = pending.find((p) => p.id === id);
    if (!item) return;
    const trimmed = item.draftName.trim();
    if (!trimmed) return;
    ensureFamilyMember(trimmed);
    writeFamilyAnswers(trimmed, item.quiz.quizId, item.answers);
    setLog((l) => [...l, { fileName: item.fileName, status: "detected", name: trimmed, quizTitle: item.quiz.title }]);
    setPending((p) => p.filter((x) => x.id !== id));
    rerender();
  }

  function handleRemove(name: string) {
    removeFamilyMember(name);
    rerender();
  }

  const profiles = members.map((m) => buildProfile(m, quizzes));
  const hasAnyResults = profiles.some(
    (p) => p.temperamentTag || p.loveLanguageTag || p.parentingStyleTag
  );

  const temperamentCounts = new Map<string, number>();
  const loveLanguageCounts = new Map<string, number>();
  for (const p of profiles) {
    if (p.temperamentTag) temperamentCounts.set(p.temperamentTag, (temperamentCounts.get(p.temperamentTag) ?? 0) + 1);
    if (p.loveLanguageTag) loveLanguageCounts.set(p.loveLanguageTag, (loveLanguageCounts.get(p.loveLanguageTag) ?? 0) + 1);
  }

  const parentingStyleProfiles = profiles.filter((p) => p.parentingStyleTag);
  const strengths = buildFamilyStrengths(profiles);
  const growthAreas = buildFamilyGrowthAreas(profiles);

  const loveLanguageTotal = Array.from(loveLanguageCounts.values()).reduce((a, b) => a + b, 0);

  return (
    <div className="flex-1 bg-paper pb-24">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <h1 className="font-display text-4xl font-semibold text-walnut sm:text-5xl">
            Our Family Summary <LeafSprig className="inline h-8 w-8 text-forest" />
          </h1>
          <p className="mt-2 max-w-xl text-lg text-walnut-soft">
            A snapshot of your family&apos;s strengths, personalities, and love
            in action.
          </p>
          <PrivacyNote className="mt-4">
            Nothing here is saved or sent anywhere — every PDF is read
            entirely on your device, and this summary disappears when you
            close this tab.
          </PrivacyNote>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Upload zone */}
        <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFilesSelected}
            className="hidden"
          />
          <h2 className="font-display text-xl font-semibold text-walnut">
            Drop in your family&apos;s results PDFs
          </h2>
          <p className="mt-1 text-base text-walnut-soft">
            Temperament, Love Languages, or Parenting Style — upload as many
            as you have, from as many family members as you like. This page
            builds itself from whatever you give it.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={processing}
            className="mt-5 rounded-full bg-forest px-6 py-3 text-lg font-semibold text-paper transition hover:bg-forest-dark disabled:opacity-50"
          >
            {processing ? "Reading PDFs…" : "Choose PDFs to upload"}
          </button>
        </div>

        {/* Processing log */}
        {log.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            {log.map((entry, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-2.5 text-sm"
              >
                <span className="text-walnut-soft">{entry.fileName}</span>
                {entry.status === "detected" ? (
                  <span className="font-semibold text-forest">
                    ✓ {entry.name} — {entry.quizTitle}
                  </span>
                ) : (
                  <span className="text-sienna">Couldn&apos;t recognize this file</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pending "who is this for" prompts */}
        {pending.length > 0 && (
          <div className="mt-4 flex flex-col gap-3">
            {pending.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-sienna/40 bg-sienna-soft px-4 py-3 text-sm"
              >
                <span className="text-walnut">
                  Found a <strong>{item.quiz.title}</strong> result in{" "}
                  <span className="text-walnut-soft">{item.fileName}</span> — who is it for?
                </span>
                <input
                  type="text"
                  value={item.draftName}
                  onChange={(e) =>
                    setPending((p) =>
                      p.map((x) => (x.id === item.id ? { ...x, draftName: e.target.value } : x))
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") confirmPending(item.id);
                  }}
                  placeholder="Their name"
                  className="rounded border border-border bg-card px-3 py-1.5 text-sm text-walnut focus:border-sienna focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => confirmPending(item.id)}
                  className="rounded-full bg-forest px-4 py-1.5 text-sm font-semibold text-paper hover:bg-forest-dark"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Family member cards */}
        {members.length > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((member, i) => {
              const profile = profiles[i];
              const palette = AVATAR_PALETTE[i % AVATAR_PALETTE.length];
              const pill = tagPill(profile);
              return (
                <div
                  key={member.name}
                  className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: palette.bg, color: palette.color }}
                      >
                        <PersonIcon className="h-6 w-6" />
                      </span>
                      <p className="font-display text-lg font-semibold text-walnut">{member.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(member.name)}
                      className="text-xs text-walnut-soft hover:text-sienna"
                      aria-label={`Remove ${member.name}`}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 text-sm">
                    <div>
                      <span className="text-walnut-soft">Temperament</span>
                      <p className="font-semibold" style={{ color: palette.color }}>
                        {profile.temperamentTag ? capitalize(profile.temperamentTag) : "—"}
                      </p>
                    </div>
                    <div>
                      <span className="text-walnut-soft">Love Language</span>
                      <p className="font-semibold" style={{ color: palette.color }}>
                        {profile.loveLanguageTitle ?? "—"}
                      </p>
                    </div>
                    {profile.parentingStyleTitle && (
                      <div>
                        <span className="text-walnut-soft">Parenting Style</span>
                        <p className="font-semibold" style={{ color: palette.color }}>
                          {profile.parentingStyleTitle}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* mt-auto anchors the pill to the same bottom edge on
                      every tile in the row, regardless of how many fields
                      (e.g. Parenting Style) a given person has above it —
                      grid rows stretch tiles to equal height by default. */}
                  <div className="mt-auto pt-3">
                    {pill && (
                      <div
                        className="rounded-full px-3 py-1 text-center text-xs font-medium"
                        style={{ backgroundColor: palette.bg, color: palette.color }}
                      >
                        {pill}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {members.length === 0 && (
          <p className="mt-8 text-center text-base text-walnut-soft">
            No family members yet — upload a results PDF above to get started.
          </p>
        )}

        {/* Dashboard */}
        {hasAnyResults && (
          <div className="mt-12 flex flex-col gap-6">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
              <h3 className="text-xs font-bold uppercase tracking-wide text-walnut-soft">
                Our Family at a Glance
              </h3>
              <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col items-center gap-4 text-center">
                  <p className="text-sm font-semibold text-walnut">Temperaments</p>
                  <Ring
                    segments={Array.from(temperamentCounts.entries()).map(([tag, count]) => ({
                      count,
                      color: TEMPERAMENT_COLOR[tag] ?? "#6B6B6B",
                    }))}
                  />
                  <div className="flex flex-col items-start gap-1.5 text-sm text-walnut-soft">
                    {Array.from(temperamentCounts.entries()).map(([tag, count]) => (
                      <span key={tag} className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: TEMPERAMENT_COLOR[tag] }} />
                        {count} {capitalize(tag)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 text-center">
                  <p className="text-sm font-semibold text-walnut">Love Languages</p>
                  <Ring
                    segments={Array.from(loveLanguageCounts.entries()).map(([tag, count]) => ({
                      count,
                      color: LOVE_LANGUAGE_COLOR[tag] ?? "#6B6B6B",
                    }))}
                  />
                  <div className="flex flex-col items-start gap-1.5 text-sm text-walnut-soft">
                    {Array.from(loveLanguageCounts.entries()).map(([tag, count]) => (
                      <span key={tag} className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: LOVE_LANGUAGE_COLOR[tag] }} />
                        {count} {LOVE_LANGUAGE_LABEL[tag] ?? capitalize(tag)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 text-center">
                  <p className="text-sm font-semibold text-walnut">Parenting Style</p>
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-soft text-forest">
                    <HeartIcon className="h-7 w-7" />
                  </span>
                  {parentingStyleProfiles.length === 0 ? (
                    <p className="text-sm text-walnut-soft">Add a Parenting Style PDF to see this</p>
                  ) : parentingStyleProfiles.length === 1 ? (
                    <>
                      <p className="font-display text-lg font-semibold text-walnut">
                        {parentingStyleProfiles[0].parentingStyleTitle}
                      </p>
                      <p className="text-sm text-walnut-soft">{parentingStyleProfiles[0].parentingStyleDescription}</p>
                    </>
                  ) : (
                    <div className="flex w-full flex-col gap-1.5 text-left">
                      {parentingStyleProfiles.map((p) => (
                        <p key={p.name} className="text-sm text-walnut">
                          <span className="font-semibold">{p.name}:</span>{" "}
                          <span className="text-forest">{p.parentingStyleTitle}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <p className="text-center text-sm font-semibold text-walnut sm:text-left">Temperament Overview</p>
                  {temperamentCounts.size === 0 ? (
                    <p className="text-sm text-walnut-soft">Add a Temperament PDF to see this</p>
                  ) : (
                    Array.from(temperamentCounts.entries()).map(([tag, count]) => (
                      <div key={tag} className="flex items-start gap-2.5">
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${TEMPERAMENT_COLOR[tag]}22`, color: TEMPERAMENT_COLOR[tag] }}
                        >
                          {(() => {
                            const Icon = THEME_ICON[tag] ?? HeartIcon;
                            return <Icon className="h-4 w-4" />;
                          })()}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-walnut">
                            {capitalize(tag)} <span className="font-normal text-walnut-soft">({count})</span>
                          </p>
                          <p className="text-sm text-walnut-soft">{TEMPERAMENT_SHORT_BLURB[tag]}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
              <h3 className="text-xs font-bold uppercase tracking-wide text-walnut-soft">
                How We Love &amp; Connect
              </h3>
              <QuadrantChart
                people={profiles
                  .filter((p): p is FamilyMemberProfile & { temperamentTag: string } => Boolean(p.temperamentTag))
                  .map((p) => ({ name: p.name, tag: p.temperamentTag }))}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="flex flex-col gap-6">
                {loveLanguageTotal > 0 && (
                  <div className="rounded-3xl border border-border bg-card p-6">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-walnut-soft">Love Language Blend</h3>
                    <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full">
                      {Array.from(loveLanguageCounts.entries()).map(([tag, count]) => (
                        <div
                          key={tag}
                          style={{
                            width: `${(count / loveLanguageTotal) * 100}%`,
                            backgroundColor: LOVE_LANGUAGE_COLOR[tag] ?? "#6B6B6B",
                          }}
                        />
                      ))}
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-4">
                      {Array.from(loveLanguageCounts.entries()).map(([tag, count]) => {
                        const Icon = LOVE_LANGUAGE_ICON[tag] ?? HeartIcon;
                        return (
                          <div key={tag} className="flex items-center gap-2">
                            <span
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                              style={{ backgroundColor: `${LOVE_LANGUAGE_COLOR[tag]}22`, color: LOVE_LANGUAGE_COLOR[tag] }}
                            >
                              <Icon className="h-4 w-4" />
                            </span>
                            <div>
                              <p className="text-base font-bold text-walnut">
                                {Math.round((count / loveLanguageTotal) * 100)}%
                              </p>
                              <p className="text-xs text-walnut-soft">{LOVE_LANGUAGE_LABEL[tag] ?? capitalize(tag)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="rounded-3xl border border-border bg-card p-6">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-sienna">Areas to Focus Together</h3>
                  <div className="mt-4 flex flex-col gap-4">
                    {growthAreas.length === 0 ? (
                      <p className="text-sm text-walnut-soft">Add a few more results to see this.</p>
                    ) : (
                      growthAreas.map((g) => (
                        <div key={g.title} className="flex items-start gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sienna-soft text-sienna">
                            <CheckCircleIcon className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="font-semibold text-walnut">{g.title}</p>
                            <p className="text-sm text-walnut-soft">{g.description}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card p-6">
                <h3 className="text-xs font-bold uppercase tracking-wide text-forest">Our Family Strengths</h3>
                <div className="mt-4 flex flex-col gap-4">
                  {strengths.length === 0 ? (
                    <p className="text-sm text-walnut-soft">Add a few more results to see this.</p>
                  ) : (
                    strengths.map((s) => (
                      <div key={s.title} className="flex items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-soft text-forest">
                          <SproutIcon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-semibold text-walnut">{s.title}</p>
                          <p className="text-sm text-walnut-soft">{s.description}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-3xl bg-forest-soft/60 p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-forest">
                <HeartIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-lg font-semibold text-walnut">You are doing beautifully</p>
                <p className="mt-1 text-sm text-walnut-soft">
                  Every family is a work in progress. Keep loving, keep learning, and keep showing up for each other.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link href="/" className="flex items-center gap-1 text-sm font-medium text-walnut-soft hover:text-sienna">
            ← All quizzes <ChevronRightIcon className="h-3 w-3 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
