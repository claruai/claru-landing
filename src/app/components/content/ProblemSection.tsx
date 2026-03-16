// ---------------------------------------------------------------------------
// ProblemSection — Server Component
// ---------------------------------------------------------------------------
// Renders the "problem" area of a content page: a question-form H2 heading
// followed by structured sections with inline citation links.
// ---------------------------------------------------------------------------

import type { ContentSection, ResearchCitation } from "@/data/content-pages/types";
import { buildCitationMap } from "@/data/content-pages/types";
import CitationLink from "./CitationLink";

interface ProblemSectionProps {
  /** Structured sections with heading, content, and citation IDs */
  sections: ContentSection[];
  /** Full citations array for the page (used to build citation map) */
  citations: ResearchCitation[];
}

export default function ProblemSection({
  sections,
  citations,
}: ProblemSectionProps) {
  if (sections.length === 0) return null;

  const citationMap = buildCitationMap(citations);

  return (
    <section id="problem" className="w-full py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-6">
        {sections.map((section, idx) => (
          <div key={idx} className={idx > 0 ? "mt-12" : ""}>
            {/* Question-form H2 */}
            <h2
              className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl"
              style={{ color: "#FFFFFF" }}
            >
              {section.heading}
            </h2>

            {/* Content paragraphs */}
            <div
              className="mt-5 text-base leading-relaxed md:text-lg"
              style={{ color: "rgba(255, 255, 255, 0.75)" }}
            >
              <p>{section.content}</p>

              {/* Inline citations */}
              {section.citationIds.length > 0 && (
                <span className="ml-1">
                  {section.citationIds.map((cid) => (
                    <CitationLink
                      key={cid}
                      id={cid}
                      citationMap={citationMap}
                    />
                  ))}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
