import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { sepalAiComparison } from "@/data/compare/sepal-ai";

export const metadata = buildComparisonMetadata(sepalAiComparison);

export default function SepalAIAlternativesPage() {
  return <ComparisonPage data={sepalAiComparison} />;
}
