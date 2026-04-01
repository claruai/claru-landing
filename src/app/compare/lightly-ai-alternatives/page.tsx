import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { lightlyAiComparison } from "@/data/compare/lightly-ai";

export const metadata = buildComparisonMetadata(lightlyAiComparison);

export default function LightlyAiComparisonPage() {
  return <ComparisonPage data={lightlyAiComparison} />;
}
