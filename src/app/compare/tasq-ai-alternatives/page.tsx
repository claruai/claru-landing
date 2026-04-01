import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { tasqAiComparison } from "@/data/compare/tasq-ai";

export const metadata = buildComparisonMetadata(tasqAiComparison);

export default function TasqAiComparisonPage() {
  return <ComparisonPage data={tasqAiComparison} />;
}
