// ---------------------------------------------------------------------------
// ResearchCitations — Server Component
// ---------------------------------------------------------------------------
// Renders a numbered "References" section at the bottom of a content page.
// Each citation shows: [N] Author. "Title." Venue, Year. keyClaim. [Link]
// ---------------------------------------------------------------------------

import type { ResearchCitation } from "@/data/content-pages/types";

interface ResearchCitationsProps {
  /** Array of research citations to render */
  citations: ResearchCitation[];
}

export default function ResearchCitations({
  citations,
}: ResearchCitationsProps) {
  if (citations.length === 0) return null;

  return (
    <section id="references" className="w-full py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2
          className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl"
          style={{ color: "#FFFFFF" }}
        >
          References
        </h2>

        <ol className="mt-8 list-none space-y-5">
          {citations.map((citation, idx) => (
            <li key={citation.id} className="text-sm leading-relaxed md:text-base">
              <span
                className="mr-2 font-bold"
                style={{
                  color: "#92B090",
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                }}
              >
                [{idx + 1}]
              </span>
              <span style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                {citation.authors}.{" "}
                <span className="italic">&ldquo;{citation.title}.&rdquo;</span>{" "}
                {citation.venue}, {citation.year}.{" "}
                <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                  {citation.keyClaim}
                </span>
              </span>
              {citation.url && (
                <>
                  {" "}
                  <a
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 font-medium transition-opacity hover:opacity-80"
                    style={{ color: "#92B090" }}
                  >
                    Link
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                </>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
