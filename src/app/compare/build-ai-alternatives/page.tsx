import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { buildAiComparison } from "@/data/compare/build-ai";

export const metadata = buildComparisonMetadata(buildAiComparison);

export default function BuildAiAlternativesPage() {
  return <ComparisonPage data={buildAiComparison} />;
}
