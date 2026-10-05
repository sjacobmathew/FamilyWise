export default function SteppedProgress({
  current,
  total,
  compact = false,
}: {
  current: number;
  total: number;
  compact?: boolean;
}) {
  const percent = total ? (current / total) * 100 : 0;
  const segments = 10;
  const filled = Math.round((current / total) * segments);

  const bar = (
    <div className="relative flex w-full max-w-xs gap-1.5">
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full ${
            i < filled ? "bg-forest" : "bg-forest-soft"
          }`}
        />
      ))}
      <div
        className="absolute -top-[3px] h-3.5 w-3.5 rounded-full bg-forest shadow"
        style={{ left: `calc(${percent}% - 7px)` }}
      />
    </div>
  );

  // One row: bar then count, with a shorter count on narrow screens.
  if (compact) {
    return (
      <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
        {bar}
        <span className="shrink-0 text-sm font-medium text-walnut-soft">
          <span className="sm:hidden">
            {current} / {total}
          </span>
          <span className="hidden sm:inline">
            Question {current} of {total}
          </span>
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {bar}
      <span className="text-sm font-medium text-walnut-soft">
        Question {current} of {total}
      </span>
    </div>
  );
}
