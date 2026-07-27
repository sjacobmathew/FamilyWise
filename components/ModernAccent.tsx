const BLOB_PATH =
  "M100,22 C138,20 176,44 178,88 C180,132 150,172 104,178 C60,184 26,152 22,110 C18,66 58,24 100,22 Z";

const DOT_CLUSTERS: Record<string, { cx: number; cy: number; r: number }[]> = {
  a: [
    { cx: 40, cy: 50, r: 9 },
    { cx: 80, cy: 34, r: 6 },
    { cx: 110, cy: 66, r: 12 },
    { cx: 60, cy: 100, r: 5 },
    { cx: 140, cy: 110, r: 8 },
    { cx: 95, cy: 140, r: 6 },
    { cx: 150, cy: 150, r: 10 },
  ],
  b: [
    { cx: 100, cy: 40, r: 11 },
    { cx: 60, cy: 70, r: 6 },
    { cx: 140, cy: 80, r: 7 },
    { cx: 100, cy: 100, r: 13 },
    { cx: 50, cy: 130, r: 8 },
    { cx: 130, cy: 140, r: 5 },
  ],
};

type Variant = "ring" | "disc" | "halfDisc" | "dots" | "plus" | "arc" | "blob" | "squiggle";

export default function ModernAccent({
  variant,
  color,
  width,
  rotate = 0,
  opacity = 0.85,
  dotSet = "a",
  className = "",
  style,
}: {
  variant: Variant;
  color: string;
  width: string;
  rotate?: number;
  opacity?: number;
  dotSet?: "a" | "b";
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`shrink-0 ${className}`}
      style={{ width, aspectRatio: "1 / 1", transform: `rotate(${rotate}deg)`, ...style }}
    >
      <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true" focusable="false">
        {variant === "ring" && (
          <circle cx="100" cy="100" r="72" fill="none" stroke={color} strokeWidth="14" opacity={opacity} />
        )}
        {variant === "disc" && <circle cx="100" cy="100" r="72" fill={color} opacity={opacity} />}
        {variant === "halfDisc" && (
          <path d="M100,16 A84,84 0 0,1 100,184 Z" fill={color} opacity={opacity} />
        )}
        {variant === "arc" && (
          <path
            d="M26,120 A80,80 0 0,1 152,34"
            fill="none"
            stroke={color}
            strokeWidth="16"
            strokeLinecap="round"
            opacity={opacity}
          />
        )}
        {variant === "squiggle" && (
          <path
            d="M14,120 Q56,70 100,110 T186,90"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            opacity={opacity}
          />
        )}
        {variant === "plus" && (
          <g opacity={opacity}>
            <rect x="82" y="20" width="36" height="160" rx="18" fill={color} />
            <rect x="20" y="82" width="160" height="36" rx="18" fill={color} />
          </g>
        )}
        {variant === "blob" && <path d={BLOB_PATH} fill={color} opacity={opacity} />}
        {variant === "dots" &&
          DOT_CLUSTERS[dotSet].map((d, i) => (
            <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={color} opacity={opacity} />
          ))}
      </svg>
    </div>
  );
}
