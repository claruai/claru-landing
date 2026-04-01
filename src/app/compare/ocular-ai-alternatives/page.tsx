import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { ocularComparison } from "@/data/compare/ocular-ai";

export const metadata = buildComparisonMetadata(ocularComparison);

export default function OcularComparisonPage() {
  return <ComparisonPage data={ocularComparison} />;
}
