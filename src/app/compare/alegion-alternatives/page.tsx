import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { alegionComparison } from "@/data/compare/alegion";

export const metadata = buildComparisonMetadata(alegionComparison);

export default function AlegionAlternativesPage() {
  return <ComparisonPage data={alegionComparison} />;
}
