import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { isahitComparison } from "@/data/compare/isahit";

export const metadata = buildComparisonMetadata(isahitComparison);

export default function IsahitComparisonPage() {
  return <ComparisonPage data={isahitComparison} />;
}
