import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { reveloComparison } from "@/data/compare/revelo";

export const metadata = buildComparisonMetadata(reveloComparison);

export default function ReveloComparisonPage() {
  return <ComparisonPage data={reveloComparison} />;
}
