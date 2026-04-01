import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { understandAiComparison } from "@/data/compare/understand-ai";

export const metadata = buildComparisonMetadata(understandAiComparison);

export default function UnderstandAiAlternativesPage() {
  return <ComparisonPage data={understandAiComparison} />;
}
