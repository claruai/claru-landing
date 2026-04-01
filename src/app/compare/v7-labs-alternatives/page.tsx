import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { v7LabsComparison } from "@/data/compare/v7-labs";

export const metadata = buildComparisonMetadata(v7LabsComparison);

export default function V7LabsAlternativesPage() {
  return <ComparisonPage data={v7LabsComparison} />;
}
