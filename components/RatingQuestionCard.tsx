import type { AnswerOption } from "@/lib/types";

export default function RatingQuestionCard({
  index,
  text,
  answerOptions,
  selected,
  unanswered,
  onSelect,
}: {
  index: number;
  text: string;
  answerOptions: AnswerOption[];
  selected: number | undefined;
  unanswered: boolean;
  onSelect: (points: number) => void;
}) {
  return (
    <div
      data-question-card
      className={`rounded-lg border bg-card p-5 transition ${
        unanswered ? "border-sienna" : "border-border"
      }`}
    >
      <p className="text-xl font-medium text-walnut">
        <span className="mr-2 text-walnut-soft">{index}.</span>
        {text}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {answerOptions.map((option) => {
          const isSelected = selected === option.points;
          return (
            <button
              key={option.label}
              type="button"
              onClick={() => onSelect(option.points)}
              className={`font-times rounded-full border px-5 py-2 text-2xl transition ${
                isSelected
                  ? "border-forest bg-forest text-paper"
                  : "border-border bg-paper text-walnut-soft hover:border-forest hover:text-forest"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
