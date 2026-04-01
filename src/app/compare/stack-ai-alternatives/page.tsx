import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { stackAiComparison } from "@/data/compare/stack-ai";

export const metadata = buildComparisonMetadata(stackAiComparison);

export default function StackAiComparisonPage() {
  return <ComparisonPage data={stackAiComparison} />;
}
