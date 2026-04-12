"use client";

import { useState } from "react";
import Link from "next/link";
import type { OSSDataset } from "@/types/oss-datasets";
import OSSDatasetCard from "./OSSDatasetCard";
import { formatCount } from "@/app/lib/utils";

// ---------------------------------------------------------------------------
// Share / Copy-link button
// ---------------------------------------------------------------------------
function ShareButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/datasets/${slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Physical AI Dataset", url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // fallback: copy manually
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      title="Copy link to this dataset"
      className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[12px] text-white/50 transition-colors hover:border-white/20 hover:text-white/80"
      style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#92B090" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ color: "#92B090" }}>copied</span>
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M8 4H9a1 1 0 011 1v5a1 1 0 01-1 1H4a1 1 0 01-1-1v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="2" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          copy link
        </>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Metadata Grid Item
// ---------------------------------------------------------------------------
function MetaItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt
        className="text-[11px] uppercase tracking-wider text-white/40 mb-1"
        style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
      >
        {label}
      </dt>
      <dd className="text-sm text-white/80">{children}</dd>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tag Pill
// ---------------------------------------------------------------------------
function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-[#92B090]"
      style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
    >
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
interface OSSDatasetDetailProps {
  dataset: OSSDataset;
  relatedDatasets: OSSDataset[];
}

export default function OSSDatasetDetail({
  dataset,
  relatedDatasets,
}: OSSDatasetDetailProps) {
  const hfUrl = `https://huggingface.co/datasets/${dataset.dataset_id}`;

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 pt-32 md:pt-40">
        <ol
          className="flex items-center gap-1.5 text-sm"
          style={{
            color: "rgba(255,255,255,0.5)",
            fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)",
          }}
        >
          <li>
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
          </li>
          <li aria-hidden="true" className="select-none">/</li>
          <li>
            <Link href="/datasets" className="transition-colors hover:text-white">Datasets</Link>
          </li>
          <li aria-hidden="true" className="select-none">/</li>
          <li aria-current="page" className="truncate max-w-[200px]" style={{ color: "#92B090" }}>
            {dataset.name}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {dataset.author && (
            <span
              className="text-[12px] text-white/40"
              style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
            >
              {dataset.author}
            </span>
          )}
          {dataset.year_released && (
            <span className="text-[12px] text-white/30">
              {dataset.year_released}
            </span>
          )}
          {dataset.license && (
            <span
              className="rounded border border-white/10 px-1.5 py-0.5 text-[11px] text-white/50"
              style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
            >
              {dataset.license}
            </span>
          )}
          {dataset.is_gated && (
            <span
              className="rounded border border-amber-500/30 px-1.5 py-0.5 text-[11px] text-amber-400/70"
              style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
            >
              gated
            </span>
          )}
        </div>

        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            {dataset.name}
          </h1>
          <div className="flex-shrink-0 mt-1">
            <ShareButton slug={dataset.slug} />
          </div>
        </div>

        {dataset.description && (
          <p className="text-lg text-white/60 leading-relaxed max-w-3xl">
            {dataset.description}
          </p>
        )}

        {/* Stats row */}
        <div
          className="flex flex-wrap gap-6 mt-6 text-sm"
          style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
        >
          <div>
            <span className="text-white/40">Downloads</span>
            <span className="ml-2 text-white">{formatCount(dataset.hf_downloads)}</span>
          </div>
          {dataset.num_episodes && (
            <div>
              <span className="text-white/40">Episodes</span>
              <span className="ml-2 text-white">{dataset.num_episodes}</span>
            </div>
          )}
          {dataset.total_hours && (
            <div>
              <span className="text-white/40">Hours</span>
              <span className="ml-2 text-white">{dataset.total_hours}</span>
            </div>
          )}
          {dataset.hf_likes > 0 && (
            <div>
              <span className="text-white/40">Likes</span>
              <span className="ml-2 text-white">{dataset.hf_likes}</span>
            </div>
          )}
        </div>
      </header>

      {/* Inactive notice */}
      {!dataset.is_active && (
        <div className="mb-8 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-sm text-amber-400/80">
            This dataset is no longer available on HuggingFace. The metadata
            below was last verified on{" "}
            {dataset.last_verified_at
              ? new Date(dataset.last_verified_at).toLocaleDateString()
              : "unknown date"}
            .
          </p>
        </div>
      )}

      {/* Low completeness notice */}
      {(dataset.extraction_completeness ?? 0) < 0.25 && (
        <div className="mb-8 rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <p className="text-sm text-white/50">
            Partial metadata -- some fields could not be extracted from the dataset description.
          </p>
        </div>
      )}

      {/* Why This Matters */}
      {dataset.physical_ai_relevance && (
        <section className="mb-10">
          <div
            className="rounded-lg border-l-2 bg-white/[0.02] p-5"
            style={{ borderLeftColor: "#92B090" }}
          >
            <h2
              className="text-[11px] uppercase tracking-wider text-[#92B090] mb-2"
              style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
            >
              Why This Matters for Physical AI
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              {dataset.physical_ai_relevance}
            </p>
          </div>
        </section>
      )}

      {/* Technical Profile */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-4">Technical Profile</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 rounded-lg border border-white/10 bg-white/[0.02] p-6">
          {dataset.modalities.length > 0 && (
            <MetaItem label="Modalities">
              <div className="flex flex-wrap gap-1.5">
                {dataset.modalities.map((m) => (
                  <TagPill key={m}>{m}</TagPill>
                ))}
              </div>
            </MetaItem>
          )}

          {dataset.robot_embodiments.length > 0 && (
            <MetaItem label="Robot Embodiments">
              <div className="flex flex-wrap gap-1.5">
                {dataset.robot_embodiments.map((r) => (
                  <TagPill key={r}>{r}</TagPill>
                ))}
              </div>
            </MetaItem>
          )}

          {dataset.action_space && (
            <MetaItem label="Action Space">
              <span
                className="text-white/70"
                style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
              >
                {dataset.action_space}
              </span>
            </MetaItem>
          )}

          {dataset.environment_type.length > 0 && (
            <MetaItem label="Environment">
              <div className="flex flex-wrap gap-1.5">
                {dataset.environment_type.map((e) => (
                  <TagPill key={e}>{e}</TagPill>
                ))}
              </div>
            </MetaItem>
          )}

          {dataset.task_types.length > 0 && (
            <MetaItem label="Task Types">
              <div className="flex flex-wrap gap-1.5">
                {dataset.task_types.map((t) => (
                  <TagPill key={t}>{t}</TagPill>
                ))}
              </div>
            </MetaItem>
          )}

          {dataset.num_episodes && (
            <MetaItem label="Episodes">
              <span style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>
                {dataset.num_episodes}
              </span>
            </MetaItem>
          )}

          {dataset.total_hours && (
            <MetaItem label="Total Hours">
              <span style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>
                {dataset.total_hours}
              </span>
            </MetaItem>
          )}

          {dataset.data_format && (
            <MetaItem label="Data Format">
              <TagPill>{dataset.data_format}</TagPill>
            </MetaItem>
          )}

          {dataset.annotation_types.length > 0 && (
            <MetaItem label="Annotation Types">
              <div className="flex flex-wrap gap-1.5">
                {dataset.annotation_types.map((a) => (
                  <TagPill key={a}>{a}</TagPill>
                ))}
              </div>
            </MetaItem>
          )}

          {dataset.license && (
            <MetaItem label="License">
              <span style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}>
                {dataset.license}
              </span>
            </MetaItem>
          )}
        </dl>
      </section>

      {/* Parent project badge */}
      {dataset.parent_project && (
        <section className="mb-10">
          <Link
            href={`/datasets?q=${encodeURIComponent(dataset.parent_project)}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[12px] text-white/60 hover:border-white/20 hover:text-white/80 transition-colors"
            style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
          >
            Part of the {dataset.parent_project} family
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </Link>
        </section>
      )}

      {/* Community Signals */}
      {(
        (dataset.citation_count && dataset.citation_count > 0) ||
        ((dataset.hf_discussion_count ?? 0) > 0) ||
        (dataset.reddit_posts?.length > 0) ||
        (dataset.hf_downloads_rank && dataset.hf_downloads_rank !== "bottom_50_pct")
      ) && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-4">Community Signals</h2>
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-6 space-y-6">

            {/* Downloads rank badge */}
            {dataset.hf_downloads_rank && dataset.hf_downloads_rank !== "bottom_50_pct" && (
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium"
                  style={{
                    backgroundColor: "rgba(146, 176, 144, 0.12)",
                    border: "1px solid rgba(146, 176, 144, 0.3)",
                    color: "#92B090",
                    fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)",
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 1L6.18 3.39L8.85 3.76L6.93 5.63L7.36 8.29L5 7.05L2.64 8.29L3.07 5.63L1.15 3.76L3.82 3.39L5 1Z" fill="#92B090" />
                  </svg>
                  {dataset.hf_downloads_rank === "top_1_pct" && "Top 1% by downloads"}
                  {dataset.hf_downloads_rank === "top_5_pct" && "Top 5% by downloads"}
                  {dataset.hf_downloads_rank === "top_10_pct" && "Top 10% by downloads"}
                  {dataset.hf_downloads_rank === "top_25_pct" && "Top 25% by downloads"}
                  {dataset.hf_downloads_rank === "top_50_pct" && "Top 50% by downloads"}
                </span>
              </div>
            )}

            {/* Citation count + citing papers */}
            {dataset.citation_count && dataset.citation_count > 0 ? (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="text-[11px] uppercase tracking-wider text-white/40"
                    style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
                  >
                    Academic Citations
                  </span>
                  <span
                    className="text-sm font-medium text-white"
                    style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
                  >
                    {dataset.citation_count}
                  </span>
                </div>
                {(dataset.citing_papers_sample?.length ?? 0) > 0 && (
                  <ul className="space-y-2">
                    {dataset.citing_papers_sample!.map((paper, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 flex-shrink-0 h-1 w-1 rounded-full bg-white/20" />
                        <div>
                          {paper.url ? (
                            <a
                              href={paper.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-white/70 hover:text-white transition-colors"
                            >
                              {paper.title}
                            </a>
                          ) : (
                            <span className="text-sm text-white/70">{paper.title}</span>
                          )}
                          {(paper.year || paper.venue) && (
                            <span
                              className="ml-2 text-[11px] text-white/30"
                              style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
                            >
                              {[paper.year, paper.venue].filter(Boolean).join(" · ")}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}

            {/* HuggingFace Discussions */}
            {(dataset.hf_discussion_count ?? 0) > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="text-[11px] uppercase tracking-wider text-white/40"
                    style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
                  >
                    HuggingFace Discussions
                  </span>
                  <span
                    className="text-sm font-medium text-white"
                    style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
                  >
                    {dataset.hf_discussion_count}
                  </span>
                </div>
                {(dataset.hf_discussions_sample?.length ?? 0) > 0 && (
                  <ul className="space-y-2">
                    {dataset.hf_discussions_sample!.map((disc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 flex-shrink-0 h-1 w-1 rounded-full bg-white/20" />
                        <div className="flex items-center gap-2 min-w-0">
                          {disc.url ? (
                            <a
                              href={disc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-white/70 hover:text-white transition-colors truncate"
                            >
                              {disc.title}
                            </a>
                          ) : (
                            <span className="text-sm text-white/70 truncate">{disc.title}</span>
                          )}
                          {disc.upvotes > 0 && (
                            <span
                              className="flex-shrink-0 text-[11px] text-white/30"
                              style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
                            >
                              ↑{disc.upvotes}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Reddit — only show if there are ML-subreddit posts */}
            {dataset.reddit_posts?.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="text-[11px] uppercase tracking-wider text-white/40"
                    style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
                  >
                    Reddit (ML Communities)
                  </span>
                  <span
                    className="text-sm font-medium text-white"
                    style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
                  >
                    {dataset.reddit_posts.length} post{dataset.reddit_posts.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <ul className="space-y-2">
                  {dataset.reddit_posts.slice(0, 3).map((post, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 flex-shrink-0 h-1 w-1 rounded-full bg-white/20" />
                      <div className="min-w-0">
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-white/70 hover:text-white transition-colors line-clamp-2"
                        >
                          {post.title}
                        </a>
                        <span
                          className="text-[11px] text-white/30"
                          style={{ fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)" }}
                        >
                          r/{post.subreddit} · ↑{post.score}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </section>
      )}

      {/* Download / Access */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-4">Access</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href={hfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70 hover:border-white/20 hover:text-white transition-colors"
          >
            View on HuggingFace
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          {dataset.paper_url && (
            <a
              href={dataset.paper_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70 hover:border-white/20 hover:text-white transition-colors"
            >
              Read Paper
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}
        </div>

        {dataset.is_gated && (
          <p className="mt-3 text-sm text-amber-400/70">
            This dataset requires access approval from the author on HuggingFace.
          </p>
        )}
      </section>

      {/* Claru CTA */}
      <section className="mb-16 rounded-lg border border-[#92B090]/20 bg-[#92B090]/5 p-6">
        <h2 className="text-base font-semibold text-white mb-2">
          Need custom {dataset.modalities[0] || "physical AI"} data?
        </h2>
        <p className="text-sm text-white/60 mb-4">
          Claru builds purpose-built datasets for{" "}
          {dataset.environment_type[0] || "any environment"} applications with
          dense human annotations and quality assurance.
        </p>
        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all"
          style={{ backgroundColor: "#92B090", color: "#0a0908" }}
        >
          Request a Sample Pack
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </Link>
      </section>

      {/* Related Datasets */}
      {relatedDatasets.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Related Datasets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedDatasets.map((ds) => (
              <OSSDatasetCard key={ds.slug} dataset={ds} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
