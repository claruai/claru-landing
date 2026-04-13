import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { asimovYcW26Comparison } from "@/data/compare/asimov-yc-w26";

export const metadata = buildComparisonMetadata(asimovYcW26Comparison);

export default function AsimovYcW26ComparisonPage() {
  return <ComparisonPage data={asimovYcW26Comparison} />;
}
