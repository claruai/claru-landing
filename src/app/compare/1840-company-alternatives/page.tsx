import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { company1840Comparison } from "@/data/compare/1840-company";

export const metadata = buildComparisonMetadata(company1840Comparison);

export default function Company1840ComparisonPage() {
  return <ComparisonPage data={company1840Comparison} />;
}
