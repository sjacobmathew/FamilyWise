import type { SaintInfo } from "@/lib/loveLanguageSaints";
import {
  ChatBubbleIcon,
  ClockIcon,
  CheckCircleIcon,
  GiftIcon,
  HandIcon,
} from "@/components/HomeIcons";

const LANGUAGE_ICON: Record<
  string,
  (props: { className?: string }) => React.ReactNode
> = {
  words: ChatBubbleIcon,
  time: ClockIcon,
  service: CheckCircleIcon,
  gifts: GiftIcon,
  touch: HandIcon,
};

// A hand-deckled circle shape (irregular, not a perfect circle) used to
// give the saint badge a "cut paper" edge instead of a clean die-cut one.
const DECKLE_EDGE =
  "polygon(98.6% 50.0%, 94.9% 64.6%, 91.4% 80.1%, 77.4% 87.7%, 65.5% 97.8%, 50.0% 98.9%, 35.6% 94.2%, 20.6% 90.5%, 12.5% 77.2%, 3.0% 65.3%, 3.4% 50.0%, 5.6% 35.6%, 10.0% 21.0%, 19.1% 7.4%, 35.5% 5.3%, 50.0% 2.2%, 65.8% 1.5%, 81.5% 6.7%, 90.9% 20.2%, 96.8% 34.8%)";

export default function PatronSaintCard({
  tag,
  saint,
}: {
  tag: string;
  saint: SaintInfo;
}) {
  const Icon = LANGUAGE_ICON[tag];

  return (
    <div
      className="mt-6 overflow-hidden rounded-2xl border border-border p-6 sm:p-7"
      style={{ background: saint.accentSoft }}
    >
      <span
        className="text-xs font-bold uppercase tracking-wide"
        style={{ color: saint.accent }}
      >
        Your patron saint
      </span>

      <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <div
          className="shrink-0"
          style={{
            filter: "drop-shadow(0 6px 10px rgba(28,28,28,0.18))",
            transform: "rotate(-4deg)",
          }}
        >
          <div
            className="flex h-28 w-28 items-center justify-center bg-[#FBFAF7]"
            style={{ clipPath: DECKLE_EDGE, color: saint.accent }}
          >
            {Icon ? <Icon className="h-11 w-11" /> : null}
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h3
            className="font-display text-2xl font-semibold italic"
            style={{ color: saint.accent }}
          >
            {saint.name}
          </h3>
          <p className="mt-2 text-lg leading-relaxed text-walnut-soft">
            {saint.story}
          </p>
          <p
            className="mt-3 text-sm font-semibold uppercase tracking-wide"
            style={{ color: saint.accent }}
          >
            {saint.patronOf}
          </p>
        </div>
      </div>
    </div>
  );
}
