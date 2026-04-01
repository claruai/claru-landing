import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { humansignalComparison } from "@/data/compare/humansignal";

export const metadata = buildComparisonMetadata(humansignalComparison);

export default function HumansignalComparisonPage() {
  return <ComparisonPage data={humansignalComparison} />;
}
