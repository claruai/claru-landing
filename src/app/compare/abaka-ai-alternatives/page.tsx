import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { abakaComparison } from "@/data/compare/abaka-ai";

export const metadata = buildComparisonMetadata(abakaComparison);

export default function AbakaComparisonPage() {
  return <ComparisonPage data={abakaComparison} />;
}
