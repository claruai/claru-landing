import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { lightwheelComparison } from "@/data/compare/lightwheel";

export const metadata = buildComparisonMetadata(lightwheelComparison);

export default function LightwheelComparisonPage() {
  return <ComparisonPage data={lightwheelComparison} />;
}
