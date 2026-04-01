import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { redbrickAiComparison } from "@/data/compare/redbrick-ai";

export const metadata = buildComparisonMetadata(redbrickAiComparison);

export default function RedbrickAiComparisonPage() {
  return <ComparisonPage data={redbrickAiComparison} />;
}
