import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { rwsTrainAiComparison } from "@/data/compare/rws-trainai";

export const metadata = buildComparisonMetadata(rwsTrainAiComparison);

export default function RwsTrainAiComparisonPage() {
  return <ComparisonPage data={rwsTrainAiComparison} />;
}
