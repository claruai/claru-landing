import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { digitalBricksComparison } from "@/data/compare/digital-bricks";

export const metadata = buildComparisonMetadata(digitalBricksComparison);

export default function DigitalBricksComparisonPage() {
  return <ComparisonPage data={digitalBricksComparison} />;
}
