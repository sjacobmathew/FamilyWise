export default function SteppedProgress({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const percent = total ? (current / total) * 100 : 0;
  const segments = 10;
  const filled = Math.round((current / total) * segments);

  return (
    <div className="flex flex-col items-center gap-2">
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
      <span className="text-sm font-medium text-walnut-soft">
        Question {current} of {total}
      </span>
    </div>
  );
}
