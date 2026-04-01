import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { angoAiComparison } from "@/data/compare/ango-ai";

export const metadata = buildComparisonMetadata(angoAiComparison);

export default function AngoAiComparisonPage() {
  return <ComparisonPage data={angoAiComparison} />;
}
