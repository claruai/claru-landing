import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { centificComparison } from "@/data/compare/centific";

export const metadata = buildComparisonMetadata(centificComparison);

export default function CentificComparisonPage() {
  return <ComparisonPage data={centificComparison} />;
}
