import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { hubXyzComparison } from "@/data/compare/hub-xyz";

export const metadata = buildComparisonMetadata(hubXyzComparison);

export default function HubXyzComparisonPage() {
  return <ComparisonPage data={hubXyzComparison} />;
}
