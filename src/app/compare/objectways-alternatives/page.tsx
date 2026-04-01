import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { objectwaysComparison } from "@/data/compare/objectways";

export const metadata = buildComparisonMetadata(objectwaysComparison);

export default function ObjectwaysComparisonPage() {
  return <ComparisonPage data={objectwaysComparison} />;
}
