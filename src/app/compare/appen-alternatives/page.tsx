import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { appenComparison } from "@/data/compare/appen";

export const metadata = buildComparisonMetadata(appenComparison);

export default function AppenAlternativesPage() {
  return <ComparisonPage data={appenComparison} />;
}
