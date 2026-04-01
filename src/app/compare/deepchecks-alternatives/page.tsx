import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { deepchecksComparison } from "@/data/compare/deepchecks";

export const metadata = buildComparisonMetadata(deepchecksComparison);

export default function DeepchecksComparisonPage() {
  return <ComparisonPage data={deepchecksComparison} />;
}
