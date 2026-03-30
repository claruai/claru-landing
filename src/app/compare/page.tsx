import type { Metadata } from "next";
import Link from "next/link";
import GeoPageShell from "@/app/components/content/GeoPageShell";

// =============================================================================
// META
// =============================================================================

export const metadata: Metadata = {
  title: "Training Data Provider Comparisons | Claru",
  description:
    "Compare training data providers for physical AI and robotics. See how Claru stacks up against Scale AI, Appen, Labelbox, Surge AI, and Luel for egocentric video, enrichment depth, and delivery speed.",
  keywords: [
    "training data provider comparison",
    "compare training data providers",
    "Scale AI alternative",
    "Appen alternative",
    "Labelbox alternative",
    "Surge AI alternative",
    "Luel alternative",
    "physical AI training data",
    "robotics data labeling comparison",
    "best training data for robotics",
  ],
  openGraph: {
    title: "Training Data Provider Comparisons | Claru",
    description:
      "Side-by-side comparisons of training data providers for physical AI. Claru vs Scale AI, Appen, Labelbox, Surge AI, and Luel.",
    type: "website",
    url: "https://claru.ai/compare",
    siteName: "Claru",
    images: [
      {
        url: "/images/og-v2.webp",
        width: 1200,
        height: 630,
        alt: "Training Data Provider Comparisons — Claru",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Training Data Provider Comparisons | Claru",
    description:
      "Compare training data providers for robotics and physical AI. Claru vs Scale AI, Appen, Labelbox, Surge AI, and Luel.",
  },
  alternates: {
    canonical: "https://claru.ai/compare",
  },
};

// =============================================================================
// COMPARISON DATA
// =============================================================================

const comparisons = [
  {
    slug: "claru-vs-luel",
    competitor: "Luel",
    summary:
      "Luel is a YC-backed marketplace for rights-cleared multimodal data. We go deeper: every clip ships with depth maps, pose estimation, and segmentation masks built in.",
  },
  {
    slug: "scale-ai-alternatives",
    competitor: "Scale AI",
    summary:
      "Scale AI is the enterprise standard for data labeling. But physical AI needs more than labels -- it needs capture, enrichment, and domain-specific annotation from day one.",
  },
  {
    slug: "appen-alternatives",
    competitor: "Appen",
    summary:
      "Appen built the crowd-sourced labeling model. For robotics and embodied AI, you need trained collectors and enrichment pipelines, not generic crowd workers.",
  },
  {
    slug: "labelbox-alternatives",
    competitor: "Labelbox",
    summary:
      "Labelbox is a strong annotation platform. But physical AI teams need end-to-end data infrastructure: capture, enrichment, annotation, and delivery -- not just a labeling tool.",
  },
  {
    slug: "surge-ai-alternatives",
    competitor: "Surge AI",
    summary:
      "Surge AI excels at RLHF for language models. Training robots and world models requires egocentric video, depth data, and manipulation trajectories -- a different kind of data entirely.",
  },
  {
    slug: "encord-alternatives",
    competitor: "Encord",
    summary:
      "Encord is building a physical AI data platform ($110M raised, 5PB+ data). Claru delivers training-ready data as a service. Platform vs. service -- different models for different teams.",
  },
];

// =============================================================================
// JSON-LD
// =============================================================================

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Training Data Provider Comparisons",
  description:
    "Compare training data providers for physical AI and robotics. See how Claru stacks up against Scale AI, Appen, Labelbox, Surge AI, and Luel.",
  url: "https://claru.ai/compare",
  publisher: {
    "@type": "Organization",
    name: "Claru AI",
    url: "https://claru.ai",
  },
  mainEntity: comparisons.map((c) => ({
    "@type": "Article",
    name: `Claru vs ${c.competitor}`,
    url: `https://claru.ai/compare/${c.slug}`,
  })),
};

// =============================================================================
// PAGE
// =============================================================================

export default function ComparePage() {
  return (
    <GeoPageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-5xl px-6 py-24 md:py-36">
        {/* Header */}
        <header className="mb-16">
          <span className="mb-6 inline-block font-mono text-xs uppercase tracking-[0.3em] text-[var(--accent-primary)]">
            {"// COMPARE"}
          </span>
          <h1
            className="font-bold leading-[1.1] tracking-[-0.03em] text-white"
            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
          >
            How Claru Compares
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/50">
            We&apos;re the only company 100% focused on physical AI training
            data. See how we stack up against general-purpose data providers.
          </p>
        </header>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {comparisons.map((c) => (
            <Link
              key={c.slug}
              href={`/compare/${c.slug}`}
              className="group flex flex-col rounded-lg border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-[var(--accent-primary)]/30 hover:bg-white/[0.04]"
            >
              <span className="mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent-primary)]">
                vs
              </span>
              <h2 className="mb-3 text-xl font-semibold text-white">
                {c.competitor}
              </h2>
              <p className="flex-1 text-sm leading-relaxed text-white/40">
                {c.summary}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs text-white/30 transition-colors duration-300 group-hover:text-[var(--accent-primary)]">
                Read comparison
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 rounded-lg border border-white/[0.06] bg-white/[0.02] p-8 text-center">
          <p className="text-base text-white/50">
            Building a robotics or world model and need training data?
          </p>
          <Link
            href="/#contact"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-[var(--accent-primary)] px-8 py-3 text-sm font-semibold text-[#0a0908] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_var(--accent-glow-strong)]"
          >
            Talk to Our Team
          </Link>
        </div>
      </article>
    </GeoPageShell>
  );
}
