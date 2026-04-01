import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { wowAiComparison } from "@/data/compare/wow-ai";

export const metadata = buildComparisonMetadata(wowAiComparison);

export default function WowAiAlternativesPage() {
  return <ComparisonPage data={wowAiComparison} />;
}
