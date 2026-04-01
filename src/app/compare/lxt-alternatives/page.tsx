import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { lxtComparison } from "@/data/compare/lxt";

export const metadata = buildComparisonMetadata(lxtComparison);

export default function LxtComparisonPage() {
  return <ComparisonPage data={lxtComparison} />;
}
