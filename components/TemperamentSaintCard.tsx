import Image from "next/image";
import type { TemperamentSaintInfo } from "@/lib/temperamentSaints";
import { SunIcon, LightningIcon, CloudRainIcon, WaveIcon } from "@/components/HomeIcons";

const TEMPERAMENT_ICON: Record<
  string,
  (props: { className?: string }) => React.ReactNode
> = {
  sanguine: SunIcon,
  choleric: LightningIcon,
  melancholic: CloudRainIcon,
  phlegmatic: WaveIcon,
};

// A hand-deckled circle shape (irregular, not a perfect circle) used to
// give the saint badge a "cut paper" edge instead of a clean die-cut one.
const DECKLE_EDGE =
  "polygon(98.6% 50.0%, 94.9% 64.6%, 91.4% 80.1%, 77.4% 87.7%, 65.5% 97.8%, 50.0% 98.9%, 35.6% 94.2%, 20.6% 90.5%, 12.5% 77.2%, 3.0% 65.3%, 3.4% 50.0%, 5.6% 35.6%, 10.0% 21.0%, 19.1% 7.4%, 35.5% 5.3%, 50.0% 2.2%, 65.8% 1.5%, 81.5% 6.7%, 90.9% 20.2%, 96.8% 34.8%)";

// A hand-torn rectangle edge — same idea as DECKLE_EDGE, but shaped for a
// portrait photo instead of an icon badge.
const TORN_EDGE =
  "polygon(0.0% 1.4%, 16.7% 1.7%, 33.3% 2.8%, 50.0% 1.4%, 66.7% 1.5%, 83.3% 1.8%, 100.0% 0.6%, 98.5% 12.5%, 98.1% 25.0%, 97.6% 37.5%, 99.7% 50.0%, 99.1% 62.5%, 99.7% 75.0%, 97.6% 87.5%, 97.9% 100.0%, 83.3% 99.9%, 66.7% 97.1%, 50.0% 97.1%, 33.3% 98.0%, 16.7% 98.2%, 0.0% 99.5%, 0.0% 87.5%, 1.6% 75.0%, 0.2% 62.5%, 0.6% 50.0%, 0.7% 37.5%, 0.1% 25.0%, 1.4% 12.5%)";

export default function TemperamentSaintCard({
  tag,
  saint,
}: {
  tag: string;
  saint: TemperamentSaintInfo;
}) {
  const Icon = TEMPERAMENT_ICON[tag];
  const label = tag.charAt(0).toUpperCase() + tag.slice(1);

  return (
    <div
      className="rounded-3xl border border-border p-6 sm:p-8"
      style={{ background: saint.accentSoft }}
    >
      <span
        className="text-xs font-bold uppercase tracking-wide"
        style={{ color: saint.accent }}
      >
        Your patron saint
      </span>

      <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div
          className="shrink-0"
          style={{
            filter: "drop-shadow(0 8px 14px rgba(28,28,28,0.22))",
            transform: saint.image ? "rotate(-3deg)" : "rotate(-4deg)",
          }}
        >
          {saint.image ? (
            <div
              className="w-36 overflow-hidden bg-[#FBFAF7] sm:w-40"
              style={{ clipPath: TORN_EDGE }}
            >
              <Image
                src={saint.image.src}
                alt={saint.name}
                width={saint.image.width}
                height={saint.image.height}
                className="h-auto w-full"
              />
            </div>
          ) : (
            <div
              className="flex h-28 w-28 items-center justify-center bg-[#FBFAF7]"
              style={{ clipPath: DECKLE_EDGE, color: saint.accent }}
            >
              {Icon ? <Icon className="h-11 w-11" /> : null}
            </div>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h3
            className="font-display text-2xl font-semibold italic"
            style={{ color: saint.accent }}
          >
            {saint.name}
          </h3>

          <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-walnut-soft">
            Bible verse for {label}s
          </p>
          <p className="mt-1 text-lg italic leading-relaxed text-walnut-soft">
            &ldquo;{saint.bibleVerse}&rdquo;{" "}
            <span className="not-italic font-semibold text-walnut">
              ({saint.bibleReference})
            </span>
          </p>

          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-walnut-soft">
            Best forms of prayer for {label}s
          </p>
          <ul className="mt-1 inline-flex flex-col items-start gap-1 text-left">
            {saint.bestFormsOfPrayer.map((form) => (
              <li
                key={form}
                className="flex items-start gap-2 text-base text-walnut-soft"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: saint.accent }} />
                {form}
              </li>
            ))}
          </ul>

          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-walnut-soft">
            Other {label} Saints
          </p>
          <p className="mt-1 text-base text-walnut-soft">
            {saint.otherSaints.join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
}
