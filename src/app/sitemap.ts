import type { MetadataRoute } from "next";
import { getAllCaseStudies } from "@/lib/case-studies";
import { getAllJobs } from "@/lib/jobs";

const BASE = "https://claru.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // ── Static pages ───────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/case-studies`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/data-catalog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/jobs`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/for-annotators`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/labeling`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/data`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    // Pillar landing pages
    { url: `${BASE}/pillars/acquire`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/pillars/enrich`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/pillars/prepare`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/pillars/validate`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    // Pillar sub-pages: Acquire
    { url: `${BASE}/pillars/acquire/data-licensing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/pillars/acquire/egocentric-video`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/pillars/acquire/synthetic-data`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    // Pillar sub-pages: Enrich
    { url: `${BASE}/pillars/enrich/expert-annotation`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/pillars/enrich/rlhf`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/pillars/enrich/video-annotation`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    // Pillar sub-pages: Prepare
    { url: `${BASE}/pillars/prepare/deduplication`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/pillars/prepare/multimodal-alignment`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/pillars/prepare/quality-scoring`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    // Pillar sub-pages: Validate
    { url: `${BASE}/pillars/validate/benchmark-curation`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/pillars/validate/bias-detection`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/pillars/validate/red-teaming`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    // Legal
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/prohibited-use`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/job-applicant-privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // ── Dynamic: Case Studies ──────────────────────────────────────────
  const caseStudyPages: MetadataRoute.Sitemap = getAllCaseStudies().map(
    (cs) => ({
      url: `${BASE}/case-studies/${cs.slug}`,
      lastModified: cs.datePublished ?? now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  // ── Dynamic: Jobs ──────────────────────────────────────────────────
  const jobPages: MetadataRoute.Sitemap = getAllJobs().map((job) => ({
    url: `${BASE}/jobs/${job.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...caseStudyPages, ...jobPages];
}
