import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { deepenAiComparison } from "@/data/compare/deepen-ai";

export const metadata = buildComparisonMetadata(deepenAiComparison);

export default function DeepenAiComparisonPage() {
  return <ComparisonPage data={deepenAiComparison} />;
}
