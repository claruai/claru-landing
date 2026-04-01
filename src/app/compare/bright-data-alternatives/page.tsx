import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { brightDataComparison } from "@/data/compare/bright-data";

export const metadata = buildComparisonMetadata(brightDataComparison);

export default function BrightDataComparisonPage() {
  return <ComparisonPage data={brightDataComparison} />;
}
