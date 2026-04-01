import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { welodataComparison } from "@/data/compare/welodata";

export const metadata = buildComparisonMetadata(welodataComparison);

export default function WelodataAlternativesPage() {
  return <ComparisonPage data={welodataComparison} />;
}
