import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { labellerrComparison } from "@/data/compare/labellerr";

export const metadata = buildComparisonMetadata(labellerrComparison);

export default function LabellerrComparisonPage() {
  return <ComparisonPage data={labellerrComparison} />;
}
