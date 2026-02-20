import { getAllCaseStudies } from "@/lib/case-studies";
import CaseStudiesIndex from "./CaseStudiesIndex";

/**
 * /case-studies -- Server component that loads all case studies at build time
 * and passes them to the interactive client-side CaseStudiesIndex.
 */
export default function CaseStudiesPage() {
  const caseStudies = getAllCaseStudies();

  return <CaseStudiesIndex caseStudies={caseStudies} />;
}
