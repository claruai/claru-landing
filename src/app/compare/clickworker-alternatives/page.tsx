import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { clickworkerComparison } from "@/data/compare/clickworker";

export const metadata = buildComparisonMetadata(clickworkerComparison);

export default function ClickworkerComparisonPage() {
  return <ComparisonPage data={clickworkerComparison} />;
}
