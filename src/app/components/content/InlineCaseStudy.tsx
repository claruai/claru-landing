// ---------------------------------------------------------------------------
// InlineCaseStudy — Server Component
// ---------------------------------------------------------------------------
// Renders inline proof from a case study JSON: title, 2-4 metric cards,
// methodology excerpt, and a link to the full case study page.
// Returns null (with console.warn) if the JSON is missing — never crashes.
// ---------------------------------------------------------------------------

import { getCaseStudyData } from "@/lib/case-studies-server";

interface InlineCaseStudyProps {
  /** Case study slug (filename without extension) */
  slug: string;
}

export default function InlineCaseStudy({ slug }: InlineCaseStudyProps) {
  const data = getCaseStudyData(slug);

  if (!data) {
    console.warn(
      `[InlineCaseStudy] Case study "${slug}" not found — skipping inline proof section`
    );
    return null;
  }

  // Take up to 4 results for metric cards
  const metrics = data.results.slice(0, 4);

  // Extract first 2-3 sentences from approach for methodology excerpt
  const approachExcerpt = extractSentences(data.approach, 3);

  return (
    <div
      className="rounded-lg p-6 md:p-8"
      style={{
        backgroundColor: "#121210",
        border: "1px solid #2a2a28",
      }}
    >
      {/* Title */}
      <h3
        className="text-xl font-semibold md:text-2xl"
        style={{ color: "#FFFFFF" }}
      >
        {data.title}
      </h3>

      {/* Metric cards */}
      {metrics.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className="rounded-md px-4 py-3"
              style={{
                backgroundColor: "rgba(146, 176, 144, 0.06)",
                border: "1px solid rgba(146, 176, 144, 0.15)",
              }}
            >
              <span
                className="block text-2xl font-bold md:text-3xl"
                style={{
                  color: "#92B090",
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                }}
              >
                {metric.value}
              </span>
              <span
                className="block mt-1 text-xs leading-snug"
                style={{ color: "rgba(255, 255, 255, 0.5)" }}
              >
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Methodology excerpt */}
      {approachExcerpt && (
        <p
          className="mt-6 text-sm leading-relaxed md:text-base"
          style={{ color: "rgba(255, 255, 255, 0.65)" }}
        >
          {approachExcerpt}
        </p>
      )}

      {/* Link to full case study */}
      <a
        href={`/case-studies/${slug}`}
        className="mt-5 inline-flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-80"
        style={{ color: "#92B090" }}
      >
        Read Full Case Study
        <span aria-hidden="true">&rarr;</span>
      </a>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Extracts the first N sentences from a text string.
 */
function extractSentences(text: string, count: number): string {
  if (!text) return "";
  // Split on sentence-ending punctuation followed by a space or end of string
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  if (!sentences) return text;
  return sentences.slice(0, count).join(" ").trim();
}
