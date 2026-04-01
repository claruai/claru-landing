import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { labelYourDataComparison } from "@/data/compare/label-your-data";

export const metadata = buildComparisonMetadata(labelYourDataComparison);

export default function LabelYourDataComparisonPage() {
  return <ComparisonPage data={labelYourDataComparison} />;
}
