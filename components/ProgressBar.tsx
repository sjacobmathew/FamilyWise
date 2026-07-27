export default function ProgressBar({
  answered,
  total,
}: {
  answered: number;
  total: number;
}) {
  const percent = total ? Math.round((answered / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between text-sm font-medium text-walnut-soft">
        <span>
          {answered} of {total} answered
        </span>
        <span>{percent}%</span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-forest-soft">
        <div
          className="h-full rounded-full bg-forest transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
