import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { mercorComparison } from "@/data/compare/mercor";

export const metadata = buildComparisonMetadata(mercorComparison);

export default function MercorAlternativesPage() {
  return <ComparisonPage data={mercorComparison} />;
}
