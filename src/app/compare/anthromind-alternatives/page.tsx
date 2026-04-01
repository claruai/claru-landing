import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { anthromindComparison } from "@/data/compare/anthromind";

export const metadata = buildComparisonMetadata(anthromindComparison);

export default function AnthromindComparisonPage() {
  return <ComparisonPage data={anthromindComparison} />;
}
