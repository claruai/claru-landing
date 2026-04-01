import Link from "next/link";
import { isValidElement, type ReactNode } from "react";
import GeoPageShell from "@/app/components/content/GeoPageShell";
import type { ComparisonData } from "@/data/compare/types";

function nodeToText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }

  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(nodeToText).join(" ").replace(/\s+/g, " ").trim();
  }

  if (isValidElement(node)) {
    return nodeToText(node.props?.children);
  }

  return "";
}

function buildJsonLd(data: ComparisonData) {
  const url = `https://claru.ai/compare/${data.slug}`;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: nodeToText(item.answer),
      },
    })),
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.meta.title,
    description: data.meta.description,
    author: {
      "@type": "Organization",
      name: "Claru",
      url: "https://claru.ai",
    },
    publisher: {
      "@type": "Organization",
      name: "Claru",
      url: "https://claru.ai",
      logo: {
        "@type": "ImageObject",
        url: `https://claru.ai${data.meta.ogImage}`,
      },
    },
    datePublished: data.meta.published,
    dateModified: data.meta.modified,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
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
        name: "Compare",
        item: "https://claru.ai/compare",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: data.hero.breadcrumbLabel,
        item: url,
      },
    ],
  };

  const claruOrganizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Claru",
    url: "https://claru.ai",
  };

  const competitorOrganizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: data.competitor.name,
    url: data.competitor.siteUrl,
  };

  const claruServiceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Physical AI training data",
    serviceType: "Physical AI training data",
    provider: {
      "@type": "Organization",
      name: "Claru",
      url: "https://claru.ai",
    },
    url,
  };

  return [
    faqJsonLd,
    articleJsonLd,
    breadcrumbJsonLd,
    claruOrganizationJsonLd,
    competitorOrganizationJsonLd,
    claruServiceJsonLd,
  ];
}

export default function ComparisonPage({ data }: { data: ComparisonData }) {
  const jsonLd = buildJsonLd(data);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <GeoPageShell>
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="w-full pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="mx-auto max-w-4xl px-6">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol
                className="flex flex-wrap items-center gap-1.5 text-sm"
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                }}
              >
                <li>
                  <a href="/" className="transition-colors hover:text-white">
                    Home
                  </a>
                </li>
                <li aria-hidden="true" className="select-none">
                  /
                </li>
                <li>
                  <span className="transition-colors">Compare</span>
                </li>
                <li aria-hidden="true" className="select-none">
                  /
                </li>
                <li aria-current="page" style={{ color: "#92B090" }}>
                  {data.hero.breadcrumbLabel}
                </li>
              </ol>
            </nav>

            <span className="mb-6 inline-block font-mono text-xs uppercase tracking-[0.3em] text-[var(--accent-primary)]">
              {data.hero.eyebrow}
            </span>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
              {data.hero.title}
            </h1>

            <div className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl text-white/70">
              {data.hero.subtitle}
            </div>

            <p className="mt-4 max-w-2xl text-sm text-white/40 italic">
              Last updated: {data.hero.lastUpdated}. If anything here is
              inaccurate, email{" "}
              <a
                href="mailto:contact@claru.ai"
                style={{ color: "#92B090" }}
                className="not-italic"
              >
                contact@claru.ai
              </a>
              .
            </p>
          </div>
        </section>

        {/* ── TL;DR ──────────────────────────────────────────────── */}
        <section className="w-full py-12 md:py-16 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-6">
              {data.tldr.title}
            </h2>
            <ul className="space-y-4 text-white/80 leading-relaxed">
              {data.tldr.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3">
                  <span
                    className="mt-1 h-1.5 w-1.5 flex-none rounded-full"
                    style={{ backgroundColor: "#92B090" }}
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Overview ─────────────────────────────────────────── */}
        {data.overview ? (
          <section className="w-full py-16 md:py-24">
            <div className="mx-auto max-w-4xl px-6">
              <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
                {data.overview.title}
              </h2>
              <div className="prose-custom space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
                {data.overview.paragraphs.map((paragraph, index) => (
                  <p key={`${data.overview?.title}-${index}`}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* ── Snapshot ─────────────────────────────────────────── */}
        {data.snapshot ? (
          <section className="w-full py-16 md:py-24 bg-white/[0.02]">
            <div className="mx-auto max-w-4xl px-6">
              <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
                {data.snapshot.title}
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {data.snapshot.columns.map((column) => (
                  <div
                    key={column.title}
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-6"
                  >
                    <div className="text-xs font-mono uppercase tracking-[0.25em] text-white/50">
                      {column.title}
                    </div>
                    <dl className="mt-5 space-y-3">
                      {column.items.map((item) => (
                        <div key={`${column.title}-${item.label}`}>
                          <dt className="text-xs uppercase text-white/40">
                            {item.label}
                          </dt>
                          <dd className="text-sm text-white/75 mt-1">
                            {item.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* ── Key Claims ───────────────────────────────────────── */}
        {data.keyClaims ? (
          <section className="w-full py-16 md:py-24">
            <div className="mx-auto max-w-4xl px-6">
              <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
                {data.keyClaims.title}
              </h2>
              <ul className="space-y-4 text-white/80 leading-relaxed">
                {data.keyClaims.claims.map((claim, index) => (
                  <li key={`${data.keyClaims?.title}-${index}`} className="flex gap-3">
                    <span
                      className="mt-1 h-1.5 w-1.5 flex-none rounded-full"
                      style={{ backgroundColor: "#92B090" }}
                    />
                    <span>{claim}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {/* ── Strengths ─────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              {data.strengths.title}
            </h2>
            <div className="text-white/70 mb-10 text-lg">
              {data.strengths.intro}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.strengths.cards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {card.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Alternatives ───────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              {data.alternatives.title}
            </h2>
            <div className="text-white/70 mb-10 text-lg">
              {data.alternatives.intro}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.alternatives.cards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {card.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comparison Table ──────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              {data.comparison.title}
            </h2>
            <div className="text-white/70 mb-10 text-lg max-w-4xl">
              {data.comparison.intro}
            </div>

            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50 min-w-[140px]">
                      Dimension
                    </th>
                    {data.comparison.columns.map((col) => (
                      <th
                        key={col.key}
                        className="px-4 py-3 font-mono text-xs uppercase tracking-wider min-w-[190px]"
                        style={{
                          color: col.highlight ? "#92B090" : "rgba(255,255,255,0.5)",
                        }}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  {data.comparison.rows.map((row, i) => (
                    <tr
                      key={row.dimension}
                      className={i % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"}
                    >
                      <td className="px-4 py-3 font-medium text-white align-top">
                        {row.dimension}
                      </td>
                      {data.comparison.columns.map((col) => (
                        <td
                          key={`${row.dimension}-${col.key}`}
                          className="px-4 py-3 align-top"
                          style={{
                            color: col.highlight ? "rgba(146,176,144,0.9)" : undefined,
                          }}
                        >
                          {row.values[col.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Deep Dive ────────────────────────────────────────── */}
        {data.deepDive ? (
          <section className="w-full py-16 md:py-24 bg-white/[0.02]">
            <div className="mx-auto max-w-4xl px-6">
              <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
                {data.deepDive.title}
              </h2>
              <p className="text-white/70 mb-10 text-lg">
                {data.deepDive.intro}
              </p>
              <div className="prose-custom space-y-8 text-white/80 leading-relaxed text-base md:text-lg">
                {data.deepDive.blocks.map((block) => (
                  <div key={block.title}>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      {block.title}
                    </h3>
                    <div className="space-y-4">
                      {block.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* ── Fit ─────────────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-semibold md:text-3xl text-white mb-6">
                  {data.fit.competitorTitle}
                </h2>
                <ul className="space-y-4 text-white/75">
                  {data.fit.competitorBullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full"
                        style={{ backgroundColor: "rgba(255,255,255,0.4)" }}
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-semibold md:text-3xl text-white mb-6">
                  {data.fit.claruTitle}
                </h2>
                <ul className="space-y-4 text-white/75">
                  {data.fit.claruBullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full"
                        style={{ backgroundColor: "#92B090" }}
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pipeline ───────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              {data.pipeline.title}
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              {data.pipeline.intro}
            </p>

            <div className="space-y-8">
              {data.pipeline.steps.map((phase) => (
                <div key={phase.step} className="flex gap-6">
                  <div
                    className="flex-none w-12 h-12 rounded-lg flex items-center justify-center text-sm font-mono font-bold"
                    style={{
                      backgroundColor: "rgba(146,176,144,0.15)",
                      color: "#92B090",
                    }}
                  >
                    {phase.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {phase.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {phase.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Proof ──────────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-10">
              {data.proof.title}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.proof.stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-5"
                >
                  <div
                    className="text-3xl md:text-4xl font-bold font-mono mb-1"
                    style={{ color: "#92B090" }}
                  >
                    {item.stat}
                  </div>
                  <div className="text-sm font-medium text-white mb-1">
                    {item.label}
                  </div>
                  <div className="text-xs text-white/50 leading-relaxed">
                    {item.context}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Related Alternatives ──────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              {data.related.title}
            </h2>
            <p className="text-white/70 mb-10 text-lg">{data.related.intro}</p>

            <div className="grid gap-4">
              {data.related.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-5 py-4 transition-colors hover:bg-white/[0.04]"
                >
                  <div>
                    <div className="text-white font-medium">{link.title}</div>
                    <div className="text-xs text-white/50 mt-1">
                      {link.desc}
                    </div>
                  </div>
                  <span className="text-xs text-[var(--accent-primary)] transition-transform group-hover:translate-x-1">
                    View
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Decision ─────────────────────────────────────────── */}
        {data.decision ? (
          <section className="w-full py-16 md:py-24 bg-white/[0.02]">
            <div className="mx-auto max-w-4xl px-6">
              <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
                {data.decision.title}
              </h2>
              <div className="prose-custom space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
                {data.decision.paragraphs.map((paragraph, index) => (
                  <p key={`${data.decision?.title}-${index}`}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* ── Sources ──────────────────────────────────────────── */}
        {data.sources.length ? (
          <section className="w-full py-16 md:py-24">
            <div className="mx-auto max-w-4xl px-6">
              <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
                Sources
              </h2>
              <div className="space-y-3">
                {data.sources.map((source) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white/70 transition-colors hover:border-white/20 hover:text-white"
                  >
                    {source.label}
                  </a>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-10">
              {data.faq.title}
            </h2>

            <div className="space-y-8">
              {data.faq.items.map((faq) => (
                <div
                  key={faq.question}
                  className="border-b border-white/10 pb-8 last:border-none"
                >
                  <h3 className="text-lg font-medium text-white mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-white/70 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="w-full py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              {data.cta.title}
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              {data.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={data.cta.primary.href}
                className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-medium transition-all"
                style={{
                  backgroundColor: "#92B090",
                  color: "#0a0908",
                }}
              >
                {data.cta.primary.label}
              </a>
              <Link
                href={data.cta.secondary.href}
                className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-medium border border-white/20 text-white transition-colors hover:bg-white/5"
              >
                {data.cta.secondary.label}
              </Link>
            </div>
          </div>
        </section>
      </GeoPageShell>
    </>
  );
}
