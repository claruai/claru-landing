import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { joinstellarComparison } from "@/data/compare/joinstellar";

export const metadata = buildComparisonMetadata(joinstellarComparison);

export default function JoinstellarComparisonPage() {
  return <ComparisonPage data={joinstellarComparison} />;
}
