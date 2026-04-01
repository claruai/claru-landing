import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { lionbridgeAiComparison } from "@/data/compare/lionbridge-ai";

export const metadata = buildComparisonMetadata(lionbridgeAiComparison);

export default function LionbridgeAiComparisonPage() {
  return <ComparisonPage data={lionbridgeAiComparison} />;
}
