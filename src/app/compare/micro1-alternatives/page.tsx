import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { micro1Comparison } from "@/data/compare/micro1";

export const metadata = buildComparisonMetadata(micro1Comparison);

export default function Micro1ComparisonPage() {
  return <ComparisonPage data={micro1Comparison} />;
}
