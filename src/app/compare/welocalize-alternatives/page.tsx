import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { welocalizeComparison } from "@/data/compare/welocalize";

export const metadata = buildComparisonMetadata(welocalizeComparison);

export default function WelocalizeComparisonPage() {
  return <ComparisonPage data={welocalizeComparison} />;
}
