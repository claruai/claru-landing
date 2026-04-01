import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { labelStudioComparison } from "@/data/compare/label-studio";

export const metadata = buildComparisonMetadata(labelStudioComparison);

export default function LabelStudioComparisonPage() {
  return <ComparisonPage data={labelStudioComparison} />;
}
