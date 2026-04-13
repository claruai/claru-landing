import ComparisonPage from "@/app/compare/_components/ComparisonPage";
import { buildComparisonMetadata } from "@/app/compare/_components/metadata";
import { ezdiaComparison } from "@/data/compare/ezdia";

export const metadata = buildComparisonMetadata(ezdiaComparison);

export default function EzdiaComparisonPage() {
  return <ComparisonPage data={ezdiaComparison} />;
}
