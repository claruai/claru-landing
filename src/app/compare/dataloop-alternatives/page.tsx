import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { dataloopComparison } from "@/data/compare/dataloop";

export const metadata = buildComparisonMetadata(dataloopComparison);

export default function DataloopComparisonPage() {
  return <ComparisonPage data={dataloopComparison} />;
}
