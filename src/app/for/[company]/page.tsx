import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ogImageUrl } from "@/lib/og";
import {
  getLabPage,
  getAllLabSlugs,
} from "@/data/programmatic/labs/index";
import { buildLabJsonLd } from "@/lib/wave4-jsonld";
import GeoPageShell from "@/app/components/content/GeoPageShell";
import ContentFAQ from "@/app/components/content/ContentFAQ";
import type { LabPageData } from "@/data/programmatic/labs/types";
import type { PageSection, ProgrammaticCitation } from "@/data/programmatic/types";

// ==========================================================================
// STATIC GENERATION
// ==========================================================================

export async function generateStaticParams() {
  const slugs = getAllLabSlugs();
  return slugs.map((company) => ({ company }));
}

// ==========================================================================
// DYNAMIC METADATA — overrides parent layout's noindex for lab pages
// ==========================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ company: string }>;
}): Promise<Metadata> {
  const { company } = await params;
  const page = getLabPage(company);

  if (!page) return {};

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.secondaryKeywords,
    robots: {
      index: true,
      follow: true,
    },
    other: {
      "X-Robots-Tag": "index, follow",
    },
    alternates: {
      canonical: page.canonicalPath,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      type: "article",
      url: `https://claru.ai${page.canonicalPath}`,
      images: [
        {
          url: ogImageUrl(page.h1, { category: "lab" }),
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
    },
  };
}

// ==========================================================================
// SECTION RENDERERS (lab-specific)
// ==========================================================================

function DataNeedsSection({ page }: { page: LabPageData }) {
  return (
    <section className="w-full py-10 md:py-14">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-4">
          Known Data Requirements
        </h2>
        <p
          className="text-base leading-relaxed md:text-lg mb-8"
          style={{ color: "rgba(255,255,255,0.75)" }}
        >
          {page.dataNeedsSummary}
        </p>
        <div className="space-y-6">
          {page.dataNeeds.map((need, i) => (
            <div
              key={i}
              className="rounded-lg border border-white/10 bg-white/[0.03] p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-1">
                {need.title}
              </h3>
              <p
                className="text-xs mb-3"
                style={{
                  color: "#92B090",
                  fontFamily:
                    "var(--font-jetbrains, 'JetBrains Mono', monospace)",
                }}
              >
                Source: {need.source}
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {need.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DataMatchesSection({ page }: { page: LabPageData }) {
  return (
    <section className="w-full py-10 md:py-14 bg-white/[0.02]">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-8">
          How Claru Data Addresses These Needs
        </h2>
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "rgba(146,176,144,0.1)" }}>
                {["Lab Need", "Claru Offering", "Rationale"].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left font-medium"
                    style={{
                      color: "#92B090",
                      fontFamily:
                        "var(--font-jetbrains, 'JetBrains Mono', monospace)",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {page.dataMatches.map((match, i) => (
                <tr key={i} className="border-t border-white/5">
                  <td
                    className="px-4 py-3 font-medium"
                    style={{ color: "rgba(255,255,255,0.85)" }}
                  >
                    {match.labNeed}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{ color: "#92B090" }}
                  >
                    {match.claruOffering}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    {match.rationale}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function TechnicalAnalysisSection({ page }: { page: LabPageData }) {
  return (
    <section className="w-full py-10 md:py-14">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-6">
          Technical Data Analysis
        </h2>
        <div className="space-y-4">
          {page.technicalAnalysis.split("\n\n").map((p, i) => (
            <p
              key={i}
              className="text-base leading-relaxed md:text-lg"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function CitationListSection({
  heading,
  citations,
}: {
  heading: string;
  citations: ProgrammaticCitation[];
}) {
  return (
    <section className="w-full py-10 md:py-14 bg-white/[0.02]">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-6">
          {heading}
        </h2>
        <ol className="list-none space-y-4">
          {citations.map((c, i) => (
            <li
              key={c.id}
              className="text-sm leading-relaxed md:text-base"
            >
              <span
                className="mr-2 font-bold"
                style={{
                  color: "#92B090",
                  fontFamily:
                    "var(--font-jetbrains, 'JetBrains Mono', monospace)",
                }}
              >
                [{i + 1}]
              </span>
              <span style={{ color: "rgba(255,255,255,0.8)" }}>
                {c.authors}.{" "}
                <span className="italic">
                  &ldquo;{c.title}.&rdquo;
                </span>{" "}
                {c.venue}, {c.year}.
              </span>
              {c.url && (
                <>
                  {" "}
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 font-medium transition-opacity hover:opacity-80"
                    style={{ color: "#92B090" }}
                  >
                    Link <span aria-hidden="true">&rarr;</span>
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

function renderSection(section: PageSection, index: number) {
  if (section.type === "stats") {
    return (
      <section key={index} className="w-full py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-6">
          {section.heading && (
            <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-8">
              {section.heading}
            </h2>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {section.stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div
                  className="text-3xl font-bold md:text-4xl"
                  style={{ color: "#92B090" }}
                >
                  {stat.value}
                </div>
                <div
                  className="mt-2 text-sm"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  if (section.type === "cards") {
    return (
      <section key={index} className="w-full py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-8">
            {section.heading}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.cards.map((card, i) => (
              <div
                key={i}
                className="rounded-lg border border-white/10 bg-white/[0.03] p-6"
              >
                {card.icon && (
                  <span className="text-2xl mb-3 block">{card.icon}</span>
                )}
                <h3 className="text-lg font-semibold text-white mb-2">
                  {card.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  return null;
}

function CrossLinks({
  relatedGlossaryTerms,
  relatedGuidePages,
}: {
  relatedGlossaryTerms: string[];
  relatedGuidePages: string[];
}) {
  const hasLinks = relatedGlossaryTerms.length > 0 || relatedGuidePages.length > 0;
  if (!hasLinks) return null;

  return (
    <section className="w-full py-10 md:py-14 bg-white/[0.02]">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-xl font-semibold text-white mb-6">
          Related Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {relatedGlossaryTerms.map((slug) => (
            <Link
              key={slug}
              href={`/glossary/${slug}`}
              className="group flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div>
                <span
                  className="text-xs uppercase tracking-wider"
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    fontFamily:
                      "var(--font-jetbrains, 'JetBrains Mono', monospace)",
                  }}
                >
                  Glossary
                </span>
                <div
                  className="text-sm font-medium group-hover:underline mt-1"
                  style={{ color: "#92B090" }}
                >
                  {slug
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}{" "}
                  &rarr;
                </div>
              </div>
            </Link>
          ))}
          {relatedGuidePages.map((slug) => (
            <Link
              key={slug}
              href={`/guides/${slug}`}
              className="group flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div>
                <span
                  className="text-xs uppercase tracking-wider"
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    fontFamily:
                      "var(--font-jetbrains, 'JetBrains Mono', monospace)",
                  }}
                >
                  Guide
                </span>
                <div
                  className="text-sm font-medium group-hover:underline mt-1"
                  style={{ color: "#92B090" }}
                >
                  {slug
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}{" "}
                  &rarr;
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================================================
// PAGE (SERVER COMPONENT)
// ==========================================================================

export default async function LabPage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  const page = getLabPage(company);

  if (!page) {
    notFound();
  }

  const jsonLd = buildLabJsonLd(page);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GeoPageShell>
        <article>
          {/* Hero */}
          <section
            className="w-full pt-32 pb-12 md:pt-40 md:pb-16"
            style={{ backgroundColor: "#0a0908" }}
          >
            <div className="mx-auto max-w-4xl px-6">
              <nav aria-label="Breadcrumb" className="mb-8">
                <ol
                  className="flex flex-wrap items-center gap-1.5 text-sm"
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontFamily:
                      "var(--font-jetbrains, 'JetBrains Mono', monospace)",
                  }}
                >
                  {page.breadcrumbs.map((crumb, i) => (
                    <li key={crumb.href} className="flex items-center gap-1.5">
                      {i > 0 && (
                        <span aria-hidden="true" className="select-none">
                          /
                        </span>
                      )}
                      {i === page.breadcrumbs.length - 1 ? (
                        <span aria-current="page" style={{ color: "#92B090" }}>
                          {crumb.label}
                        </span>
                      ) : (
                        <Link
                          href={crumb.href}
                          className="transition-colors hover:text-white"
                        >
                          {crumb.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>

              <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
                {page.h1}
              </h1>
              <p
                className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {page.heroSubtitle}
              </p>
            </div>
          </section>

          {/* Company Profile */}
          <section className="w-full py-10 md:py-14">
            <div className="mx-auto max-w-4xl px-6">
              <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-6">
                About {page.companyName}
              </h2>
              <p
                className="text-base leading-relaxed md:text-lg mb-6"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                {page.companyDescription}
              </p>
              <div className="flex flex-wrap gap-2">
                {page.researchFocus.map((focus) => (
                  <span
                    key={focus}
                    className="inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm font-medium"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {focus}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Stats + Cards sections */}
          {page.sections.map((section, i) => renderSection(section, i))}

          {/* Data Needs */}
          <DataNeedsSection page={page} />

          {/* Data Matches */}
          <DataMatchesSection page={page} />

          {/* Technical Analysis */}
          <TechnicalAnalysisSection page={page} />

          {/* Key Papers */}
          {page.keyPapers.length > 0 && (
            <CitationListSection
              heading="Key Research & References"
              citations={page.keyPapers}
            />
          )}

          {/* FAQ */}
          {page.faqs.length > 0 && (
            <ContentFAQ
              faqs={page.faqs.map((f) => ({
                question: f.question,
                answer: f.answer,
              }))}
            />
          )}

          {/* Cross-links */}
          <CrossLinks
            relatedGlossaryTerms={page.relatedGlossaryTerms}
            relatedGuidePages={page.relatedGuidePages}
          />

          {/* CTA */}
          <section className="w-full py-20 md:py-28">
            <div className="mx-auto max-w-4xl px-6 text-center">
              <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
                {page.ctaHeading}
              </h2>
              <p
                className="text-lg mb-8 max-w-2xl mx-auto"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {page.ctaDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-medium transition-all"
                  style={{ backgroundColor: "#92B090", color: "#0a0908" }}
                >
                  Schedule a Call
                </Link>
                <Link
                  href="/data-catalog"
                  className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-medium border border-white/20 text-white transition-colors hover:bg-white/5"
                >
                  Browse the Data Catalog
                </Link>
              </div>
            </div>
          </section>
        </article>
      </GeoPageShell>
    </>
  );
}
