import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { superbAiComparison } from "@/data/compare/superb-ai";

export const metadata = buildComparisonMetadata(superbAiComparison);

export default function SuperbAiComparisonPage() {
  return <ComparisonPage data={superbAiComparison} />;
}
