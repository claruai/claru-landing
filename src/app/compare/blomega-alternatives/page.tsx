import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { blomegaComparison } from "@/data/compare/blomega";

export const metadata = buildComparisonMetadata(blomegaComparison);

export default function BlomegaComparisonPage() {
  return <ComparisonPage data={blomegaComparison} />;
}
