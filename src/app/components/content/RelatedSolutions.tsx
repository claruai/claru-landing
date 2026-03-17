// ---------------------------------------------------------------------------
// RelatedSolutions — Server Component
// ---------------------------------------------------------------------------
// Renders lateral links to related content pages. Uses the page registry
// to resolve slugs to titles and keywords.
// ---------------------------------------------------------------------------

import { getContentPage } from "@/data/content-pages";

interface RelatedSolutionsProps {
  /** Slugs of related content pages to link to */
  slugs: string[];
}

export default function RelatedSolutions({ slugs }: RelatedSolutionsProps) {
  if (slugs.length === 0) return null;

  // Resolve slugs to page data, filtering out any that don't exist
  const pages = slugs
    .map((slug) => {
      const page = getContentPage(slug);
      if (!page) {
        console.warn(
          `[RelatedSolutions] Content page "${slug}" not found in registry — skipping`
        );
        return null;
      }
      return page;
    })
    .filter(Boolean);

  if (pages.length === 0) return null;

  return (
    <section id="related" className="w-full py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2
          className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl"
          style={{ color: "#FFFFFF" }}
        >
          Related Solutions
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {pages.map((page) => {
            if (!page) return null;
            return (
              <a
                key={page.slug}
                href={`/solutions/${page.slug}`}
                className="group rounded-lg p-5 transition-colors"
                style={{
                  backgroundColor: "#121210",
                  border: "1px solid #2a2a28",
                }}
              >
                <span
                  className="block text-xs uppercase tracking-wider mb-2"
                  style={{
                    color: "#92B090",
                    fontFamily:
                      "var(--font-mono, 'JetBrains Mono', monospace)",
                  }}
                >
                  {page.primaryKeyword}
                </span>
                <span
                  className="block text-base font-medium group-hover:underline md:text-lg"
                  style={{ color: "#FFFFFF" }}
                >
                  {page.title}
                </span>
                <span
                  className="mt-2 inline-flex items-center gap-0.5 text-sm"
                  style={{ color: "#92B090" }}
                >
                  Learn more
                  <span aria-hidden="true">&rarr;</span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
