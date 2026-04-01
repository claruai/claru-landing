import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { helpwareComparison } from "@/data/compare/helpware";

export const metadata = buildComparisonMetadata(helpwareComparison);

export default function HelpwareComparisonPage() {
  return <ComparisonPage data={helpwareComparison} />;
}
