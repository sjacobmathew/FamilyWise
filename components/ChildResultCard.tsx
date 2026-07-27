export default function ChildResultCard({
  name,
  dominantTitle,
  secondaryTitle,
}: {
  name: string;
  dominantTitle: string;
  secondaryTitle?: string | null;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <p className="font-times text-lg text-sienna">{name}</p>
      <h3 className="mt-1 text-2xl font-bold text-walnut">{dominantTitle}</h3>
      {secondaryTitle && (
        <p className="mt-2 text-base text-walnut-soft">
          With a touch of{" "}
          <span className="font-semibold text-forest">{secondaryTitle}</span>
        </p>
      )}
    </div>
  );
}
