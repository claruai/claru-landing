// ---------------------------------------------------------------------------
// CitationLink — Server Component
// ---------------------------------------------------------------------------
// Renders a superscript [1]-style citation anchor that links to the
// #references section at the bottom of the page. Used inline within
// ProblemSection and other server components.
// ---------------------------------------------------------------------------

interface CitationLinkProps {
  /** The citation ID to look up in the citation map */
  id: string;
  /** Map from citation ID to 1-based reference number */
  citationMap: Map<string, number>;
}

export default function CitationLink({ id, citationMap }: CitationLinkProps) {
  const num = citationMap.get(id);
  if (num === undefined) return null;

  return (
    <a
      href="#references"
      className="no-underline hover:underline"
      style={{ color: "#92B090", fontSize: "0.75em", verticalAlign: "super" }}
      aria-label={`Citation ${num}`}
    >
      [{num}]
    </a>
  );
}
