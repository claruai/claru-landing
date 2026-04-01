import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { roboflowComparison } from "@/data/compare/roboflow";

export const metadata = buildComparisonMetadata(roboflowComparison);

export default function RoboflowComparisonPage() {
  return <ComparisonPage data={roboflowComparison} />;
}
