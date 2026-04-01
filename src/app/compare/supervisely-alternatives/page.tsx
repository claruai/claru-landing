import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { superviselyComparison } from "@/data/compare/supervisely";

export const metadata = buildComparisonMetadata(superviselyComparison);

export default function SuperviselyAlternativesPage() {
  return <ComparisonPage data={superviselyComparison} />;
}
