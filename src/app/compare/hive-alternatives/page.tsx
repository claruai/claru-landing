import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { hiveComparison } from "@/data/compare/hive";

export const metadata = buildComparisonMetadata(hiveComparison);

export default function HiveComparisonPage() {
  return <ComparisonPage data={hiveComparison} />;
}
