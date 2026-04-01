import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { cinderComparison } from "@/data/compare/cinder";

export const metadata = buildComparisonMetadata(cinderComparison);

export default function CinderComparisonPage() {
  return <ComparisonPage data={cinderComparison} />;
}
