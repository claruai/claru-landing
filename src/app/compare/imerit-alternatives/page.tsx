import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { imeritComparison } from "@/data/compare/imerit";

export const metadata = buildComparisonMetadata(imeritComparison);

export default function IMeritAlternativesPage() {
  return <ComparisonPage data={imeritComparison} />;
}
