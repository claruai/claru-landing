import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { basicAiComparison } from "@/data/compare/basicai";

export const metadata = buildComparisonMetadata(basicAiComparison);

export default function BasicAiComparisonPage() {
  return <ComparisonPage data={basicAiComparison} />;
}
