import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { cortexAiComparison } from "@/data/compare/cortex-ai";

export const metadata = buildComparisonMetadata(cortexAiComparison);

export default function CortexAiComparisonPage() {
  return <ComparisonPage data={cortexAiComparison} />;
}
