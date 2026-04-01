import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { ayadataComparison } from "@/data/compare/ayadata";

export const metadata = buildComparisonMetadata(ayadataComparison);

export default function AyadataComparisonPage() {
  return <ComparisonPage data={ayadataComparison} />;
}
