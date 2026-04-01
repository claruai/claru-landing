import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { playmentComparison } from "@/data/compare/playment";

export const metadata = buildComparisonMetadata(playmentComparison);

export default function PlaymentComparisonPage() {
  return <ComparisonPage data={playmentComparison} />;
}
