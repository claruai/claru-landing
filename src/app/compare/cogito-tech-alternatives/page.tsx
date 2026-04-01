import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { cogitoTechComparison } from "@/data/compare/cogito-tech";

export const metadata = buildComparisonMetadata(cogitoTechComparison);

export default function CogitoTechComparisonPage() {
  return <ComparisonPage data={cogitoTechComparison} />;
}
