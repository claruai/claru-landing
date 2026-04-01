import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { tolokaComparison } from "@/data/compare/toloka";

export const metadata = buildComparisonMetadata(tolokaComparison);

export default function TolokaAlternativesPage() {
  return <ComparisonPage data={tolokaComparison} />;
}
