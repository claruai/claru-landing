import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { macgenceComparison } from "@/data/compare/macgence";

export const metadata = buildComparisonMetadata(macgenceComparison);

export default function MacgenceComparisonPage() {
  return <ComparisonPage data={macgenceComparison} />;
}
