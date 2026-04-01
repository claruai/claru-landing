import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { opentrainAiComparison } from "@/data/compare/opentrain-ai";

export const metadata = buildComparisonMetadata(opentrainAiComparison);

export default function OpentrainAiComparisonPage() {
  return <ComparisonPage data={opentrainAiComparison} />;
}
