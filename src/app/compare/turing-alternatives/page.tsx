import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { turingComparison } from "@/data/compare/turing";

export const metadata = buildComparisonMetadata(turingComparison);

export default function TuringComparisonPage() {
  return <ComparisonPage data={turingComparison} />;
}
