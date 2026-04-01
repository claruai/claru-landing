import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { telusDigitalComparison } from "@/data/compare/telus-digital";

export const metadata = buildComparisonMetadata(telusDigitalComparison);

export default function TelusDigitalComparisonPage() {
  return <ComparisonPage data={telusDigitalComparison} />;
}
