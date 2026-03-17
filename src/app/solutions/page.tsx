import type { Metadata } from "next";
import Link from "next/link";
import { getAllContentPages } from "@/data/content-pages";
import { ogImageUrl } from "@/lib/og";

export const metadata: Metadata = {
  title: "AI Training Data Solutions | Claru",
  description:
    "Purpose-built data solutions for frontier AI labs — egocentric video, VLA training data, RLHF annotation, red teaming, and more. Research-backed, expert-collected.",
  alternates: { canonical: "/solutions" },
  openGraph: {
    title: "AI Training Data Solutions | Claru",
    description:
      "Purpose-built data solutions for frontier AI labs — egocentric video, VLA training data, RLHF annotation, red teaming, and more.",
    images: [
      {
        url: ogImageUrl("AI Training Data Solutions", {
          category: "solution",
        }),
        width: 1200,
        height: 630,
      },
    ],
  },
};

const TIER_LABELS: Record<number, string> = {
  1: "Core Solutions",
  2: "Specialized Solutions",
  3: "Guides & Comparisons",
};

const TIER_DESCRIPTIONS: Record<number, string> = {
  1: "End-to-end data collection and annotation for the highest-demand AI training modalities.",
  2: "Targeted solutions for specific data challenges in robotics and model alignment.",
  3: "Research-backed decision guides for teams evaluating data strategies.",
};

export default function SolutionsIndex() {
  const pages = getAllContentPages();

  // Group by tier (derive from slug patterns or use a simple heuristic)
  const tier1 = pages.filter((p) =>
    [
      "egocentric-video-data",
      "vla-training-data",
      "red-teaming-data",
      "video-generation-training-data",
    ].includes(p.slug)
  );
  const tier2 = pages.filter((p) =>
    [
      "manipulation-trajectory-data",
      "expert-rlhf-annotation",
      "sim-to-real-data",
      "teleoperation-data",
    ].includes(p.slug)
  );
  const tier3 = pages.filter((p) =>
    [
      "open-datasets-vs-custom",
      "crowdsourced-vs-expert-rlhf",
      "eu-ai-act-red-teaming",
    ].includes(p.slug)
  );

  const tiers = [
    { level: 1, pages: tier1 },
    { level: 2, pages: tier2 },
    { level: 3, pages: tier3 },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container max-w-4xl">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm font-mono text-[var(--text-muted)]">
              <li>
                <Link
                  href="/"
                  className="hover:text-[var(--accent-primary)] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-[var(--text-secondary)]">Solutions</li>
            </ol>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
            AI Training Data Solutions
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
            Purpose-built data for frontier AI labs. Each solution is backed by
            real project metrics, verified research citations, and Claru&apos;s
            expert human annotation methodology.
          </p>
        </div>
      </section>

      {/* Tier Sections */}
      {tiers.map(({ level, pages: tierPages }) => (
        <section key={level} className="pb-16 md:pb-20">
          <div className="container max-w-4xl">
            <h2 className="text-xs font-mono text-[var(--accent-primary)] uppercase tracking-wider mb-2">
              {TIER_LABELS[level]}
            </h2>
            <p className="text-sm text-[var(--text-muted)] mb-8">
              {TIER_DESCRIPTIONS[level]}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tierPages.map((page) => (
                <Link
                  key={page.slug}
                  href={`/solutions/${page.slug}`}
                  className="group block p-6 bg-[#121210] border border-[#2a2a28] rounded-lg hover:border-[var(--accent-primary)] transition-colors"
                >
                  <h3 className="text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors mb-2">
                    {page.title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] line-clamp-2">
                    {page.metaDescription}
                  </p>
                  <span className="inline-block mt-3 text-xs font-mono text-[var(--accent-primary)]">
                    Learn more →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
