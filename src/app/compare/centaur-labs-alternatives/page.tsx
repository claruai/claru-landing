import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { centaurComparison } from "@/data/compare/centaur-labs";

export const metadata = buildComparisonMetadata(centaurComparison);

export default function CentaurComparisonPage() {
  return <ComparisonPage data={centaurComparison} />;
}
