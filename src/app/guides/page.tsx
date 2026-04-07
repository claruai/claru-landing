import type { Metadata } from "next";
import Link from "next/link";
import GeoPageShell from "@/app/components/content/GeoPageShell";
import { getAllGuidePages } from "@/data/programmatic/guides/index";
import type { GuidePageData } from "@/data/programmatic/types";

// =============================================================================
// META
// =============================================================================

export const metadata: Metadata = {
  title: "Physical AI & Robotics Data Guides (2026) | Claru",
  description:
    "Step-by-step guides for collecting, annotating, and building training datasets for robotics, VLA models, and embodied AI. 40 practical guides from Claru AI.",
  keywords: [
    "robotics data collection guide",
    "robot training data how-to",
    "teleoperation data guide",
    "manipulation dataset guide",
    "VLA training data guide",
    "physical AI data pipeline",
  ],
  openGraph: {
    title: "Physical AI & Robotics Data Guides (2026)",
    description:
      "40 practical, step-by-step guides for building training datasets for robots, VLA models, and embodied AI.",
    type: "article",
    url: "https://claru.ai/guides",
    siteName: "Claru",
    images: [
      {
        url: "/images/og-v2.webp",
        width: 1200,
        height: 630,
        alt: "Physical AI & Robotics Data Guides - Claru",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Physical AI & Robotics Data Guides (2026) | Claru",
    description:
      "40 practical guides for collecting, annotating, and building training datasets for robotics and embodied AI.",
  },
  alternates: {
    canonical: "https://claru.ai/guides",
  },
};

// =============================================================================
// JSON-LD
// =============================================================================

function buildJsonLd(guides: GuidePageData[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://claru.ai",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Guides",
            item: "https://claru.ai/guides",
          },
        ],
      },
      {
        "@type": "ItemList",
        itemListElement: guides.map((g, i) => ({
          "@type": "HowTo",
          position: i + 1,
          name: g.h1,
          description: g.heroSubtitle,
          url: `https://claru.ai/guides/${g.slug}`,
        })),
      },
    ],
  };
}

// =============================================================================
// CATEGORY HELPERS
// =============================================================================

type GuideCategory =
  | "collect"
  | "annotate"
  | "build"
  | "create"
  | "setup"
  | "evaluate"
  | "other";

const CATEGORY_ORDER: GuideCategory[] = [
  "collect",
  "build",
  "annotate",
  "create",
  "setup",
  "evaluate",
  "other",
];

const CATEGORY_LABELS: Record<GuideCategory, string> = {
  collect: "Data Collection",
  build: "Dataset Building",
  annotate: "Annotation & Labeling",
  create: "Dataset Creation",
  setup: "Infrastructure & Setup",
  evaluate: "Evaluation & Quality",
  other: "Advanced Topics",
};

function categorizeGuide(slug: string): GuideCategory {
  if (slug.includes("collect-") || slug.includes("collect-")) return "collect";
  if (slug.includes("build-")) return "build";
  if (slug.includes("annotate-") || slug.includes("label-")) return "annotate";
  if (slug.includes("create-")) return "create";
  if (slug.includes("setup-") || slug.includes("convert-")) return "setup";
  if (
    slug.includes("evaluate-") ||
    slug.includes("measure-") ||
    slug.includes("deduplicate-") ||
    slug.includes("preprocess-")
  )
    return "evaluate";
  return "other";
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "#6BCB77",
  intermediate: "#92B090",
  advanced: "#D4A574",
};

// =============================================================================
// PAGE
// =============================================================================

export default function GuidesPage() {
  const allGuides = getAllGuidePages();
  const totalGuides = allGuides.length;

  const groupedGuides = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    guides: allGuides.filter((g) => categorizeGuide(g.slug) === cat),
  })).filter((group) => group.guides.length > 0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildJsonLd(allGuides)),
        }}
      />

      {/* SEO Shell */}
      <div className="sr-only">
        <h1>Physical AI &amp; Robotics Training Data Guides</h1>
        <p>
          {totalGuides} step-by-step guides for collecting, annotating, and
          building training datasets for robotics, VLA models, and embodied AI.
          Maintained by Claru AI.
        </p>
        {allGuides.map((g) => (
          <article key={g.slug}>
            <h2>{g.h1}</h2>
            <p>{g.heroSubtitle}</p>
          </article>
        ))}
      </div>

      <GeoPageShell>
        {/* Hero */}
        <section className="w-full pt-32 pb-12 md:pt-40 md:pb-16">
          <div className="mx-auto max-w-5xl px-6">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol
                className="flex flex-wrap items-center gap-1.5 text-sm"
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontFamily:
                    "var(--font-jetbrains, 'JetBrains Mono', monospace)",
                }}
              >
                <li>
                  <Link
                    href="/"
                    className="transition-colors hover:text-white"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="select-none">
                  /
                </li>
                <li aria-current="page" style={{ color: "#92B090" }}>
                  Guides
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
              Physical AI &amp; Robotics Data Guides
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/70">
              Step-by-step guides for collecting, annotating, and building
              training datasets for robots, VLA models, and embodied AI systems.
            </p>

            <p
              className="mt-3 text-sm"
              style={{
                fontFamily:
                  "var(--font-jetbrains, 'JetBrains Mono', monospace)",
                color: "#92B090",
              }}
            >
              {totalGuides} guides &mdash; last updated April 2026
            </p>
          </div>
        </section>

        {/* Category Nav */}
        <section className="w-full pb-10">
          <div className="mx-auto max-w-5xl px-6">
            <nav
              aria-label="Guide categories"
              className="flex flex-wrap gap-2"
            >
              {groupedGuides.map((group) => (
                <a
                  key={group.category}
                  href={`#cat-${group.category}`}
                  className="inline-flex items-center rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:border-white/30 hover:text-white"
                  style={{
                    fontFamily:
                      "var(--font-jetbrains, 'JetBrains Mono', monospace)",
                  }}
                >
                  {group.label}{" "}
                  <span className="ml-1.5 text-white/30">
                    ({group.guides.length})
                  </span>
                </a>
              ))}
            </nav>
          </div>
        </section>

        {/* Guide Listing */}
        <section className="w-full pb-24">
          <div className="mx-auto max-w-5xl px-6">
            <div className="space-y-20">
              {groupedGuides.map((group) => (
                <div
                  key={group.category}
                  id={`cat-${group.category}`}
                  className="scroll-mt-24"
                >
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white md:text-2xl">
                      {group.label}
                    </h2>
                    <div
                      className="mt-3 h-px w-full"
                      style={{
                        background:
                          "linear-gradient(to right, rgba(146,176,144,0.4), transparent)",
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {group.guides.map((guide) => (
                      <Link
                        key={guide.slug}
                        href={`/guides/${guide.slug}`}
                        className="group rounded-lg border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.05] scroll-mt-24"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h3 className="text-base font-semibold text-white group-hover:underline leading-snug">
                            {guide.h1.replace(/^How to /i, "")}
                          </h3>
                          <span
                            className="shrink-0 mt-0.5 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                            style={{
                              color:
                                DIFFICULTY_COLORS[guide.difficulty] ||
                                "#92B090",
                              borderColor:
                                DIFFICULTY_COLORS[guide.difficulty] ||
                                "#92B090",
                              border: "1px solid",
                              opacity: 0.7,
                            }}
                          >
                            {guide.difficulty}
                          </span>
                        </div>

                        <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-4">
                          {guide.heroSubtitle}
                        </p>

                        <div className="flex items-center gap-4">
                          <span
                            className="text-xs text-white/40"
                            style={{
                              fontFamily:
                                "var(--font-jetbrains, 'JetBrains Mono', monospace)",
                            }}
                          >
                            {guide.steps.length} steps
                          </span>
                          <span
                            className="text-xs text-white/40"
                            style={{
                              fontFamily:
                                "var(--font-jetbrains, 'JetBrains Mono', monospace)",
                            }}
                          >
                            ~{guide.estimatedTime}
                          </span>
                          <span
                            className="ml-auto text-xs font-medium transition-colors"
                            style={{ color: "#92B090" }}
                          >
                            Read guide &rarr;
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Need Expert Help With Your Data Pipeline?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Claru handles the end-to-end data pipeline for physical AI teams
              &mdash; from collection protocol design through annotation,
              validation, and delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-medium transition-all"
                style={{
                  backgroundColor: "#92B090",
                  color: "#0a0908",
                }}
              >
                Get in Touch
              </Link>
              <Link
                href="/glossary"
                className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-medium border border-white/20 text-white transition-colors hover:bg-white/5"
              >
                Browse the Glossary
              </Link>
            </div>
          </div>
        </section>
      </GeoPageShell>
    </>
  );
}
