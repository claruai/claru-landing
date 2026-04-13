import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ogImageUrl } from "@/lib/og";
import {
  getBenchmarkPage,
  getAllBenchmarkSlugs,
} from "@/data/programmatic/benchmarks/index";
import { buildBenchmarkJsonLd } from "@/lib/wave4-jsonld";
import GeoPageShell from "@/app/components/content/GeoPageShell";
import ContentFAQ from "@/app/components/content/ContentFAQ";
import type { BenchmarkPageData } from "@/data/programmatic/benchmarks/types";
import type { PageSection, ProgrammaticCitation } from "@/data/programmatic/types";

// ==========================================================================
// STATIC GENERATION
// ==========================================================================

export async function generateStaticParams() {
  const slugs = getAllBenchmarkSlugs();
  return slugs.map((benchmark) => ({ benchmark }));
}

// ==========================================================================
// DYNAMIC METADATA
// ==========================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ benchmark: string }>;
}): Promise<Metadata> {
  const { benchmark } = await params;
  const page = getBenchmarkPage(benchmark);

  if (!page) return {};

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.secondaryKeywords,
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
          url: ogImageUrl(page.h1, { category: "benchmark" }),
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
// SECTION RENDERERS
// ==========================================================================

function BenchmarkProfileSection({ page }: { page: BenchmarkPageData }) {
  const specs = [
    { label: "Task Set", value: page.taskSet },
    { label: "Observation Space", value: page.observationSpace },
    { label: "Action Space", value: page.actionSpace },
    { label: "Evaluation Protocol", value: page.evaluationProtocol },
  ];

  return (
    <section className="w-full py-10 md:py-14">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-6">
          Benchmark Profile
        </h2>
        <p
          className="text-base leading-relaxed md:text-lg mb-8"
          style={{ color: "rgba(255,255,255,0.75)" }}
        >
          {page.benchmarkDescription}
        </p>
        <div className="space-y-4">
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="rounded-lg border border-white/10 bg-white/[0.03] p-5"
            >
              <dt
                className="text-xs uppercase tracking-wider mb-2"
                style={{
                  color: "#92B090",
                  fontFamily:
                    "var(--font-jetbrains, 'JetBrains Mono', monospace)",
                }}
              >
                {spec.label}
              </dt>
              <dd
                className="text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                {spec.value}
              </dd>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SimToRealSection({ page }: { page: BenchmarkPageData }) {
  return (
    <section className="w-full py-10 md:py-14 bg-white/[0.02]">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-6">
          The Sim-to-Real Gap
        </h2>
        <div className="space-y-4">
          {page.simToRealGap.split("\n\n").map((p, i) => (
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

function RealWorldDataSection({ page }: { page: BenchmarkPageData }) {
  return (
    <section className="w-full py-10 md:py-14">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-6">
          Real-World Data Needed
        </h2>
        <div className="space-y-4 mb-8">
          {page.realWorldDataNeeds.split("\n\n").map((p, i) => (
            <p
              key={i}
              className="text-base leading-relaxed md:text-lg"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              {p}
            </p>
          ))}
        </div>
        <h3 className="text-xl font-semibold text-white mb-4">
          Complementary Claru Datasets
        </h3>
        <div className="space-y-4">
          {page.complementaryDatasets.map((ds, i) => (
            <div
              key={i}
              className="rounded-lg border border-white/10 bg-white/[0.03] p-6"
            >
              <h4 className="text-base font-semibold mb-2" style={{ color: "#92B090" }}>
                {ds.name}
              </h4>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {ds.rationale}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechnicalAnalysisSection({ page }: { page: BenchmarkPageData }) {
  return (
    <section className="w-full py-10 md:py-14 bg-white/[0.02]">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-6">
          Bridging the Gap: Technical Analysis
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
    <section className="w-full py-10 md:py-14">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-6">
          {heading}
        </h2>
        <ol className="list-none space-y-4">
          {citations.map((c, i) => (
            <li key={c.id} className="text-sm leading-relaxed md:text-base">
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
                <span className="italic">&ldquo;{c.title}.&rdquo;</span>{" "}
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
                <div className="text-3xl font-bold md:text-4xl" style={{ color: "#92B090" }}>
                  {stat.value}
                </div>
                <div className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  if (section.type === "comparison-table") {
    return (
      <section key={index} className="w-full py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl text-white mb-4">
            {section.heading}
          </h2>
          {section.description && (
            <p className="text-base leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.7)" }}>
              {section.description}
            </p>
          )}
          <div className="overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "rgba(146,176,144,0.1)" }}>
                  {section.columns.map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left font-medium"
                      style={{ color: "#92B090", fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row, i) => (
                  <tr key={i} className="border-t border-white/5">
                    {section.columns.map((col) => (
                      <td key={col} className="px-4 py-3" style={{ color: "rgba(255,255,255,0.7)" }}>
                        {row[col] || "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }
  return null;
}

// ==========================================================================
// PAGE (SERVER COMPONENT)
// ==========================================================================

export default async function BenchmarkPage({
  params,
}: {
  params: Promise<{ benchmark: string }>;
}) {
  const { benchmark } = await params;
  const page = getBenchmarkPage(benchmark);

  if (!page) {
    notFound();
  }

  const jsonLd = buildBenchmarkJsonLd(page);

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

          {/* Stats */}
          {page.sections.map((section, i) => renderSection(section, i))}

          {/* Benchmark Profile */}
          <BenchmarkProfileSection page={page} />

          {/* Sim-to-Real Gap */}
          <SimToRealSection page={page} />

          {/* Real-World Data Needs + Complementary Datasets */}
          <RealWorldDataSection page={page} />

          {/* Technical Analysis */}
          <TechnicalAnalysisSection page={page} />

          {/* Key Papers */}
          {page.keyPapers.length > 0 && (
            <CitationListSection
              heading="Key Papers"
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
          {(page.relatedGlossaryTerms.length > 0 ||
            page.relatedGuidePages.length > 0) && (
            <section className="w-full py-10 md:py-14 bg-white/[0.02]">
              <div className="mx-auto max-w-4xl px-6">
                <h2 className="text-xl font-semibold text-white mb-6">
                  Related Resources
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {page.relatedGlossaryTerms.map((slug) => (
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
                  {page.relatedGuidePages.map((slug) => (
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
          )}

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
                  Get in Touch
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
