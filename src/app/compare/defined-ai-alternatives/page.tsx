import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { definedAiComparison } from "@/data/compare/defined-ai";

export const metadata = buildComparisonMetadata(definedAiComparison);

export default function DefinedAiComparisonPage() {
  return <ComparisonPage data={definedAiComparison} />;
}
