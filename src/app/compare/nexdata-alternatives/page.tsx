import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { nexdataComparison } from "@/data/compare/nexdata";

export const metadata = buildComparisonMetadata(nexdataComparison);

export default function NexdataAlternativesPage() {
  return <ComparisonPage data={nexdataComparison} />;
}
