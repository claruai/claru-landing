import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { cloudfactoryComparison } from "@/data/compare/cloudfactory";

export const metadata = buildComparisonMetadata(cloudfactoryComparison);

export default function CloudfactoryComparisonPage() {
  return <ComparisonPage data={cloudfactoryComparison} />;
}
