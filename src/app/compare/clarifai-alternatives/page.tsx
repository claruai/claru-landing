import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { clarifaiComparison } from "@/data/compare/clarifai";

export const metadata = buildComparisonMetadata(clarifaiComparison);

export default function ClarifaiAlternativesPage() {
  return <ComparisonPage data={clarifaiComparison} />;
}
