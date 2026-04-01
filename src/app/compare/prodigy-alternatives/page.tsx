import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { prodigyComparison } from "@/data/compare/prodigy";

export const metadata = buildComparisonMetadata(prodigyComparison);

export default function ProdigyAlternativesPage() {
  return <ComparisonPage data={prodigyComparison} />;
}
