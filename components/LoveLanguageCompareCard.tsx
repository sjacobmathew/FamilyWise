import type { NormalizedResult } from "@/lib/scoring";
import {
  ChatBubbleIcon,
  ClockIcon,
  CheckCircleIcon,
  GiftIcon,
  HandIcon,
  HeartIcon,
} from "@/components/HomeIcons";

type Person = {
  name: string;
  dominantTag: string;
  dominant: NormalizedResult;
};

const LANGUAGE_ICON: Record<string, (props: { className?: string }) => React.ReactNode> = {
  words: ChatBubbleIcon,
  time: ClockIcon,
  service: CheckCircleIcon,
  gifts: GiftIcon,
  touch: HandIcon,
};

const IDENTITY = [
  { color: "#D9776E", bg: "#FBE1DE" },
  { color: "#9B90C9", bg: "#EFEBF9" },
];

export default function LoveLanguageCompareCard({
  people,
}: {
  people: Person[];
}) {
  const [a, b] = people;
  const sameLanguage = a.dominantTag === b.dominantTag;

  const insight = sameLanguage
    ? `${a.name} and ${b.name} share the same love language — ${a.dominant.title}. You likely already know instinctively how to make each other feel loved, since it's the same language you'd naturally want spoken back to you too.`
    : `${a.name} speaks ${a.dominant.title} and ${b.name} speaks ${b.dominant.title} — two different love languages. The biggest opportunity here is to intentionally speak your partner's language, not just your own natural one, since what makes you feel loved may not be what makes them feel loved.`;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-2xl font-semibold text-walnut">
        How {a.name} &amp; {b.name} compare
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {[a, b].map((p, i) => {
          const ThemeIcon = LANGUAGE_ICON[p.dominantTag] ?? HeartIcon;
          const identity = IDENTITY[i];
          return (
            <div key={p.name} className="rounded-3xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: identity.bg, color: identity.color }}
                >
                  <ThemeIcon className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-walnut-soft">{p.name}</p>
                  <h3 className="font-display text-xl font-semibold text-walnut">
                    {p.dominant.title}
                  </h3>
                </div>
              </div>
              <p className="mt-3 text-base text-walnut-soft">{p.dominant.description}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl bg-forest-soft/60 p-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-forest">
          <HeartIcon className="h-5 w-5" />
        </span>
        <h3 className="font-display mt-3 text-xl font-semibold text-walnut">
          How you connect
        </h3>
        <p className="mt-2 text-base leading-relaxed text-walnut">{insight}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[a, b].map((p, i) => (
          <div key={p.name} className="rounded-3xl border border-border bg-card p-6">
            <h3 className="text-sm font-bold uppercase tracking-wide text-walnut-soft">
              How to love {p.name}
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              {p.dominant.tips.map((tip, idx) => (
                <li key={idx} className="flex gap-2 text-base text-walnut">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: IDENTITY[i].color }}
                  />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
