import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { hastyAiComparison } from "@/data/compare/hasty-ai";

export const metadata = buildComparisonMetadata(hastyAiComparison);

export default function HastyAiAlternativesPage() {
  return <ComparisonPage data={hastyAiComparison} />;
}
