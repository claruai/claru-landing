import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { segmentsAiComparison } from "@/data/compare/segments-ai";

export const metadata = buildComparisonMetadata(segmentsAiComparison);

export default function SegmentsAiAlternativesPage() {
  return <ComparisonPage data={segmentsAiComparison} />;
}
