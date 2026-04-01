import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { samasourceComparison } from "@/data/compare/samasource";

export const metadata = buildComparisonMetadata(samasourceComparison);

export default function SamasourceComparisonPage() {
  return <ComparisonPage data={samasourceComparison} />;
}
