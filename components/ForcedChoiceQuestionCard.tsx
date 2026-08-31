export default function ForcedChoiceQuestionCard({
  index,
  optionAText,
  optionBText,
  selected,
  unanswered,
  onSelect,
}: {
  index: number;
  optionAText: string;
  optionBText: string;
  selected: "A" | "B" | undefined;
  unanswered: boolean;
  onSelect: (choice: "A" | "B") => void;
}) {
  return (
    <div
      data-question-card
      className={`rounded-2xl border bg-card p-5 transition ${
        unanswered ? "border-sienna" : "border-border"
      }`}
    >
      <p className="mb-4 text-base font-semibold uppercase tracking-wide text-walnut-soft">
        {index}. Which feels more like you?
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            ["A", optionAText],
            ["B", optionBText],
          ] as const
        ).map(([choice, text]) => {
          const isSelected = selected === choice;
          return (
            <button
              key={choice}
              type="button"
              onClick={() => onSelect(choice)}
              className={`rounded-2xl border p-4 text-left text-xl leading-relaxed transition ${
                isSelected
                  ? "border-forest bg-forest-soft text-walnut"
                  : "border-border bg-paper text-walnut-soft hover:border-forest hover:text-walnut"
              }`}
            >
              {text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
