import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { acgenceComparison } from "@/data/compare/acgence";

export const metadata = buildComparisonMetadata(acgenceComparison);

export default function AcgenceComparisonPage() {
  return <ComparisonPage data={acgenceComparison} />;
}
