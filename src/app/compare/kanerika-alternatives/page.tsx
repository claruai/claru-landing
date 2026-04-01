import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { kanerikaComparison } from "@/data/compare/kanerika";

export const metadata = buildComparisonMetadata(kanerikaComparison);

export default function KanerikaComparisonPage() {
  return <ComparisonPage data={kanerikaComparison} />;
}
