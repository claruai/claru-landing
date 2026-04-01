import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { snorkelAiComparison } from "@/data/compare/snorkel-ai";

export const metadata = buildComparisonMetadata(snorkelAiComparison);

export default function SnorkelAiComparisonPage() {
  return <ComparisonPage data={snorkelAiComparison} />;
}
