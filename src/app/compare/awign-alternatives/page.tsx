import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { awignComparison } from "@/data/compare/awign";

export const metadata = buildComparisonMetadata(awignComparison);

export default function AwignComparisonPage() {
  return <ComparisonPage data={awignComparison} />;
}
