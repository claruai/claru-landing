import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { humanloopComparison } from "@/data/compare/humanloop";

export const metadata = buildComparisonMetadata(humanloopComparison);

export default function HumanloopAlternativesPage() {
  return <ComparisonPage data={humanloopComparison} />;
}
