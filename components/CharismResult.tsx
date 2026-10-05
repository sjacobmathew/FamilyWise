import type { Quiz } from "@/lib/types";
import { scoreRatingByTag, type RatingAnswers } from "@/lib/scoring";
import {
  CHARISM_BANDS,
  CHARISM_MAX_SCORE,
  DISCERNMENT_NOTE,
  RESULTS_NOTE,
  bandForCharismScore,
  ordinal,
  rankCharisms,
  strongestIndicatedCharisms,
} from "@/lib/charism";
import { CHARISM_VERSE_TEXT, VERSE_TRANSLATION } from "@/lib/charismVerses";
import { BookmarkIcon, CrossIcon, LeafSprig, StarIcon } from "@/components/HomeIcons";

// Accent per podium position; anything tied into the top group beyond the
// third colour reuses the last one.
const RANK_THEME = [
  { accent: "#7C9473", soft: "#E9F0E3" },
  { accent: "#D98F89", soft: "#FBE9E6" },
  { accent: "#9B90C9", soft: "#EFEBF9" },
];

// One bar colour per band, strongest first (matches CHARISM_BANDS order).
const BAND_COLOR = ["#7C9473", "#9DB295", "#C9A063", "#D8D3C8"];

function bandColor(score: number): string {
  const band = bandForCharismScore(score);
  return BAND_COLOR[CHARISM_BANDS.indexOf(band)] ?? BAND_COLOR[3];
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-border">
      <div
        className="h-full rounded-full"
        style={{ width: `${(score / CHARISM_MAX_SCORE) * 100}%`, backgroundColor: color }}
      />
    </div>
  );
}

export default function CharismResult({
  quiz,
  answers,
}: {
  quiz: Quiz;
  answers: RatingAnswers;
}) {
  const results = quiz.results ?? {};
  const ranked = rankCharisms(scoreRatingByTag(quiz, answers));
  const top = strongestIndicatedCharisms(ranked);

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h2 className="font-display text-3xl font-semibold text-walnut">
          Your Strongest Indicated Charisms
        </h2>
        <div className="mt-4 flex items-start gap-3 rounded-2xl bg-[#FBF6EC] p-5">
          <CrossIcon className="mt-1 h-5 w-5 shrink-0 text-forest" />
          <p className="text-lg leading-relaxed text-walnut-soft">{RESULTS_NOTE}</p>
        </div>

        <div className="mt-6 flex flex-col gap-6">
          {top.map((r) => {
            const card = results[r.tag];
            if (!card) return null;
            const theme = RANK_THEME[Math.min(r.rank, 3) - 1];
            const band = bandForCharismScore(r.value);
            return (
              <article
                key={r.tag}
                className="rounded-3xl border border-border p-6 shadow-sm sm:p-8"
                style={{ backgroundColor: theme.soft }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full px-3 py-1 text-sm font-bold text-paper"
                    style={{ backgroundColor: theme.accent }}
                  >
                    {ordinal(r.rank)}
                    {r.tied ? " (tie)" : ""}
                  </span>
                  <span
                    className="rounded-full bg-white px-3 py-1 text-sm font-semibold"
                    style={{ color: theme.accent }}
                  >
                    {band.label}
                  </span>
                </div>

                <h3 className="font-display mt-3 text-3xl font-semibold text-walnut sm:text-4xl">
                  {card.title}
                </h3>

                <div className="mt-4 flex items-center gap-4">
                  <ScoreBar score={r.value} color={theme.accent} />
                  <span className="shrink-0 text-lg font-semibold text-walnut">
                    {r.value} / {CHARISM_MAX_SCORE}
                  </span>
                </div>

                <p className="mt-5 text-lg leading-relaxed text-walnut-soft">
                  {card.description}
                </p>

                <dl className="mt-6 grid items-start gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                  {card.saint && (
                    <div className="rounded-2xl bg-white/70 p-4">
                      <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-walnut-soft">
                        <StarIcon className="h-4 w-4" />
                        Saint example
                      </dt>
                      <dd className="mt-1 text-lg font-semibold text-walnut">{card.saint}</dd>
                    </div>
                  )}
                  {card.scripture && (
                    <div className="rounded-2xl bg-white/70 p-4">
                      <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-walnut-soft">
                        <BookmarkIcon className="h-4 w-4" />
                        Scripture
                      </dt>
                      <dd className="mt-1 text-lg font-semibold text-walnut">{card.scripture}</dd>
                      {CHARISM_VERSE_TEXT[r.tag] && (
                        <dd className="mt-2 text-base italic leading-relaxed text-walnut-soft">
                          &ldquo;{CHARISM_VERSE_TEXT[r.tag]}&rdquo;
                        </dd>
                      )}
                    </div>
                  )}
                </dl>
              </article>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-walnut-soft">
          Scripture quotations are from the {VERSE_TRANSLATION}, which is in the
          public domain.
        </p>
      </section>

      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h2 className="font-display text-2xl font-semibold text-walnut">All 18 charisms</h2>
        <p className="mt-2 text-base text-walnut-soft">
          Each charism is scored from 0 to {CHARISM_MAX_SCORE} (seven statements, each rated
          0–3). Charisms with the same score share a rank.
        </p>

        <ul className="mt-4 flex flex-wrap gap-2 text-sm">
          {CHARISM_BANDS.map((b, i) => (
            <li
              key={b.label}
              className="flex items-center gap-2 rounded-full border border-border px-3 py-1 text-walnut-soft"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: BAND_COLOR[i] }}
              />
              {b.min}–{b.max} · {b.label}
            </li>
          ))}
        </ul>

        <ol className="mt-5 flex flex-col">
          {ranked.map((r) => {
            const card = results[r.tag];
            if (!card) return null;
            return (
              <li
                key={r.tag}
                className="flex items-center gap-3 border-b border-border py-3 last:border-0"
              >
                <span className="w-7 shrink-0 text-center text-sm font-bold text-walnut-soft">
                  {r.rank}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-base font-semibold text-walnut">{card.title}</span>
                    <span className="shrink-0 text-sm font-semibold text-walnut-soft">
                      {r.value} / {CHARISM_MAX_SCORE}
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <ScoreBar score={r.value} color={bandColor(r.value)} />
                  </div>
                  <span className="mt-1 block text-xs text-walnut-soft">
                    {bandForCharismScore(r.value).label}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="flex items-start gap-3 rounded-3xl bg-forest-soft/40 p-6 sm:p-8">
        <LeafSprig className="mt-1 h-5 w-5 shrink-0 text-forest" />
        <div>
          <h2 className="font-display text-xl font-semibold text-walnut">
            A note on discernment
          </h2>
          <p className="mt-2 text-base leading-relaxed text-walnut-soft">{DISCERNMENT_NOTE}</p>
        </div>
      </section>
    </div>
  );
}
