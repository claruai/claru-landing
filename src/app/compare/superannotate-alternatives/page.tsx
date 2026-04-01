import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { superannotateComparison } from "@/data/compare/superannotate";

export const metadata = buildComparisonMetadata(superannotateComparison);

export default function SuperannotateComparisonPage() {
  return <ComparisonPage data={superannotateComparison} />;
}
