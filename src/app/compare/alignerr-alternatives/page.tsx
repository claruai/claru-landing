import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { alignerrComparison } from "@/data/compare/alignerr";

export const metadata = buildComparisonMetadata(alignerrComparison);

export default function AlignerrComparisonPage() {
  return <ComparisonPage data={alignerrComparison} />;
}
