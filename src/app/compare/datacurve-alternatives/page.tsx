import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { datacurveComparison } from "@/data/compare/datacurve";

export const metadata = buildComparisonMetadata(datacurveComparison);

export default function DatacurveComparisonPage() {
  return <ComparisonPage data={datacurveComparison} />;
}
