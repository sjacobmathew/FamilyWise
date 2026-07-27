export default function WatercolorBlob({
  className = "",
  color = "var(--color-blob)",
  seed = 7,
  opacity = 0.55,
}: {
  className?: string;
  color?: string;
  seed?: number;
  opacity?: number;
}) {
  const filterId = `watercolor-rough-${seed}`;

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012"
            numOctaves="3"
            seed={seed}
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="34" />
        </filter>
      </defs>
      <circle
        cx="200"
        cy="200"
        r="165"
        fill={color}
        opacity={opacity}
        filter={`url(#${filterId})`}
      />
    </svg>
  );
}
