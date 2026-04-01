import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { cvatComparison } from "@/data/compare/cvat";

export const metadata = buildComparisonMetadata(cvatComparison);

export default function CvatComparisonPage() {
  return <ComparisonPage data={cvatComparison} />;
}
