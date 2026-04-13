import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { voxel51Comparison } from "@/data/compare/voxel51";

export const metadata = buildComparisonMetadata(voxel51Comparison);

export default function Voxel51ComparisonPage() {
  return <ComparisonPage data={voxel51Comparison} />;
}
