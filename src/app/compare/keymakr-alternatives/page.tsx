import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { keymakrComparison } from "@/data/compare/keymakr";

export const metadata = buildComparisonMetadata(keymakrComparison);

export default function KeymakrComparisonPage() {
  return <ComparisonPage data={keymakrComparison} />;
}
