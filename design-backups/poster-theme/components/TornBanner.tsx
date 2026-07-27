export default function TornBanner({
  children,
  className = "",
  color = "var(--color-banner)",
  seed = 4,
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
  seed?: number;
}) {
  const filterId = `torn-edge-${seed}`;

  return (
    <span className={`relative inline-block ${className}`}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter id={filterId} x="-15%" y="-40%" width="130%" height="180%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02 0.09"
              numOctaves="2"
              seed={seed}
              result="noise"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" />
          </filter>
        </defs>
        <rect
          x="2"
          y="8"
          width="96"
          height="84"
          fill={color}
          filter={`url(#${filterId})`}
        />
      </svg>
      <span className="relative block">{children}</span>
    </span>
  );
}
