import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { humansInTheLoopComparison } from "@/data/compare/humans-in-the-loop";

export const metadata = buildComparisonMetadata(humansInTheLoopComparison);

export default function HumansInTheLoopComparisonPage() {
  return <ComparisonPage data={humansInTheLoopComparison} />;
}
