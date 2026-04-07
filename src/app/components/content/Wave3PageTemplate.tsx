// ---------------------------------------------------------------------------
// Wave3PageTemplate — Server Component for datasets, formats, industries
// ---------------------------------------------------------------------------
// Renders Wave 3 programmatic pages using the ProgrammaticPageBase data shape.
// Delegates to ProgrammaticPageTemplate with a cast to avoid modifying
// the base template's variant union (which Wave 2 may be editing).
// ---------------------------------------------------------------------------

import ProgrammaticPageTemplate from "./ProgrammaticPageTemplate";
import type { ProgrammaticPageBase } from "@/data/programmatic/types";

interface Wave3PageTemplateProps {
  page: ProgrammaticPageBase;
}

export default function Wave3PageTemplate({ page }: Wave3PageTemplateProps) {
  // The base template renders generic sections, FAQ, cross-links, and CTA
  // for any variant. Variant-specific content (glossary-deep, guide) is
  // skipped when the variant doesn't match — which is exactly what we want.
  return (
    <ProgrammaticPageTemplate
      page={page}
      variant={"generic" as "glossary-deep"}
    />
  );
}
