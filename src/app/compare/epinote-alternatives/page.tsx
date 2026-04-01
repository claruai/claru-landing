import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { epinoteComparison } from "@/data/compare/epinote";

export const metadata = buildComparisonMetadata(epinoteComparison);

export default function EpinoteComparisonPage() {
  return <ComparisonPage data={epinoteComparison} />;
}
