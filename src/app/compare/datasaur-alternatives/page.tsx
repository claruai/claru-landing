import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { datasaurComparison } from "@/data/compare/datasaur";

export const metadata = buildComparisonMetadata(datasaurComparison);

export default function DatasaurAlternativesPage() {
  return <ComparisonPage data={datasaurComparison} />;
}
