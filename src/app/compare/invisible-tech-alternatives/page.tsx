import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { invisibleTechComparison } from "@/data/compare/invisible-tech";

export const metadata = buildComparisonMetadata(invisibleTechComparison);

export default function InvisibleTechComparisonPage() {
  return <ComparisonPage data={invisibleTechComparison} />;
}
