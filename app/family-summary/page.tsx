import { getAllQuizzes } from "@/lib/quizzes";
import { CHARISM_QUIZ_ID } from "@/lib/charism";
import FamilySummaryView from "@/components/FamilySummaryView";

export default function FamilySummaryPage() {
  // Marriage Compatibility is a rating-scale-by-category quiz and is out
  // of scope for this page — only the tag-based per-person assessments
  // (Temperament, Love Languages, Parenting Style, and their child
  // variants) are aggregated here. The Charism Assessment is excluded too:
  // it has no slot on the dashboard, and its generic result titles
  // ("Giving", "Wisdom"...) could be mistaken for matches in other PDFs.
  const quizzes = getAllQuizzes().filter(
    (q) =>
      q.flow !== "rating-scale-by-category" && q.quizId !== CHARISM_QUIZ_ID
  );

  return <FamilySummaryView quizzes={quizzes} />;
}
