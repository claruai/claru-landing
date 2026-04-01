import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { innodataComparison } from "@/data/compare/innodata";

export const metadata = buildComparisonMetadata(innodataComparison);

export default function InnodataComparisonPage() {
  return <ComparisonPage data={innodataComparison} />;
}
