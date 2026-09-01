import Link from "next/link";
import type { NormalizedResult } from "@/lib/scoring";
import {
  TEMPERAMENT_GLANCE,
  DEFAULT_GLANCE,
  splitTip,
} from "@/lib/childTemperamentContent";
import {
  BellIcon,
  BrainIcon,
  ChatBubbleIcon,
  ChevronRightIcon,
  CloudRainIcon,
  DownloadIcon,
  HeartIcon,
  LightningIcon,
  MoonIcon,
  PencilIcon,
  RefreshIcon,
  SproutIcon,
  StarIcon,
  SunIcon,
  TwoPersonIcon,
  WaveIcon,
} from "@/components/HomeIcons";

export const THEME_ICON: Record<string, (props: { className?: string }) => React.ReactNode> = {
  sanguine: SunIcon,
  choleric: LightningIcon,
  melancholic: CloudRainIcon,
  phlegmatic: WaveIcon,
};

const TIP_ICONS = [BellIcon, ChatBubbleIcon, PencilIcon, MoonIcon];

export default function ChildTemperamentResult({
  name,
  dominantTag,
  dominant,
  quizId,
  hideGlance = false,
}: {
  name: string;
  dominantTag: string;
  dominant: NormalizedResult;
  quizId: string;
  hideGlance?: boolean;
}) {
  const ThemeIcon = THEME_ICON[dominantTag] ?? SunIcon;
  const glance = TEMPERAMENT_GLANCE[dominantTag] ?? DEFAULT_GLANCE;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      {/* main column */}
      <div className="flex flex-col gap-6">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <span className="font-times text-lg text-sienna">
            {name}&apos;s result
          </span>
          <div className="mt-2 flex flex-wrap items-start gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-sienna-soft text-sienna">
              <ThemeIcon className="h-8 w-8" />
            </span>
            <div className="min-w-[200px] flex-1">
              <h2 className="font-display text-[2rem] font-semibold text-walnut sm:text-[2.5rem]">
                {dominant.title}
              </h2>
              {dominant.description && (
                <p className="mt-2 text-lg leading-relaxed text-walnut-soft">
                  {dominant.description}
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-2xl bg-forest-soft/60 p-4">
            <HeartIcon className="mt-0.5 h-5 w-5 shrink-0 text-forest" />
            <p className="text-base leading-relaxed text-walnut">
              Every temperament is a gift. Understanding {name}&apos;s nature
              will help them thrive with the right support and environment.
            </p>
          </div>
        </div>

        {(dominant.strengths?.length || dominant.growthEdges?.length) && (
          <div className="grid gap-4 sm:grid-cols-2">
            {dominant.strengths?.length ? (
              <div className="rounded-3xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-forest">
                    Strengths
                  </h3>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-soft text-forest">
                    <SproutIcon className="h-4 w-4" />
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {dominant.strengths.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-forest-soft px-3 py-1 text-sm font-medium text-forest"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mt-4 flex items-start gap-2 text-sm text-walnut-soft">
                  <StarIcon className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                  {name}&apos;s strengths are a real gift.
                </p>
              </div>
            ) : null}

            {dominant.growthEdges?.length ? (
              <div className="rounded-3xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-sienna">
                    Growth edges
                  </h3>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sienna-soft text-sienna">
                    <SunIcon className="h-4 w-4" />
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {dominant.growthEdges.map((g) => (
                    <span
                      key={g}
                      className="rounded-full bg-sienna-soft px-3 py-1 text-sm font-medium text-sienna"
                    >
                      {g}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm text-walnut-soft">
                  With support, these are areas {name} can grow with
                  confidence.
                </p>
              </div>
            ) : null}
          </div>
        )}

        {dominant.tips.length > 0 && (
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <h3 className="font-display text-xl font-semibold text-walnut">
              Tips to support {name}
            </h3>
            <ul className="mt-4 flex flex-col gap-4">
              {dominant.tips.map((tip, i) => {
                const [lead, rest] = splitTip(tip);
                const Icon = TIP_ICONS[i % TIP_ICONS.length];
                return (
                  <li key={tip} className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-soft text-forest">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <p className="text-base leading-relaxed text-walnut-soft">
                      <span className="font-semibold text-walnut">{lead}</span>
                      {rest && <>{" — " + rest}</>}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* right sidebar */}
      <div className="flex flex-col gap-6">
        {!hideGlance && (
          <div className="rounded-3xl border border-border bg-card p-6">
            <h3 className="text-sm font-bold uppercase tracking-wide text-walnut-soft">
              Temperament at a glance
            </h3>
            <div className="mt-4 flex flex-col gap-4">
              {[
                { Icon: BrainIcon, label: `How ${name} thinks & feels`, text: glance.thinksAndFeels, bg: "#EFEBF9", color: "#9B90C9" },
                { Icon: TwoPersonIcon, label: `How ${name} relates`, text: glance.relates, bg: "#E9F0E3", color: "#7C9473" },
                { Icon: LightningIcon, label: `How ${name} reacts`, text: glance.reacts, bg: "#FBF3E1", color: "#C9A063" },
                { Icon: HeartIcon, label: `What ${name} needs`, text: glance.needs, bg: "#FBE9E6", color: "#D98F89" },
              ].map((row) => (
                <div key={row.label} className="flex items-start gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: row.bg, color: row.color }}
                  >
                    <row.Icon className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-walnut">{row.label}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-walnut-soft">
                      {row.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-3xl border border-border bg-card p-6">
          <h3 className="text-sm font-bold uppercase tracking-wide text-walnut-soft">
            Next steps
          </h3>
          <div className="mt-3 flex flex-col">
            <Link href={`/quiz/${quizId}`} className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-forest-soft/40">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-soft text-forest">
                <RefreshIcon className="h-4 w-4" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-walnut">
                  Retake quiz for {name}
                </span>
                <span className="block text-xs text-walnut-soft">
                  See if anything has changed
                </span>
              </span>
              <ChevronRightIcon className="h-4 w-4 text-walnut-soft" />
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-forest-soft/40"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-soft text-forest">
                <DownloadIcon className="h-4 w-4" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-walnut">
                  Share results
                </span>
                <span className="block text-xs text-walnut-soft">
                  Get family insights together
                </span>
              </span>
              <ChevronRightIcon className="h-4 w-4 text-walnut-soft" />
            </button>
          </div>
        </div>

        <div className="rounded-3xl p-6" style={{ backgroundColor: "#EFEBF9" }}>
          <HeartIcon className="h-5 w-5 text-[#9B90C9]" />
          <h3 className="font-display mt-3 text-lg font-semibold text-walnut">
            You know {name} best
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-walnut-soft">
            Use these insights as a guide, not a label. Your love, patience
            and consistency matter most.
          </p>
        </div>
      </div>
    </div>
  );
}
