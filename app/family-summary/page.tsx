import { getAllQuizzes } from "@/lib/quizzes";
import FamilySummaryView from "@/components/FamilySummaryView";

export default function FamilySummaryPage() {
  // Marriage Compatibility is a rating-scale-by-category quiz and is out
  // of scope for this page — only the tag-based per-person assessments
  // (Temperament, Love Languages, Parenting Style, and their child
  // variants) are aggregated here.
  const quizzes = getAllQuizzes().filter(
    (q) => q.flow !== "rating-scale-by-category"
  );

  return <FamilySummaryView quizzes={quizzes} />;
}
