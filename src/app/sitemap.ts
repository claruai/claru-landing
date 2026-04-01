import type { MetadataRoute } from "next";
import { getAllCaseStudies } from "@/lib/case-studies";
import { getAllJobs } from "@/lib/jobs";
import { getAllContentPages } from "@/data/content-pages";

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
    { url: `${BASE}/solutions`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    // GEO landing pages — physical AI / robotics keyword clusters
    { url: `${BASE}/training-data-for-robotics`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/physical-ai-training-data`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/egocentric-video-datasets`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/embodied-ai-datasets`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    // Tier 3 content pages — pillar guides, listicles, deep-dives
    { url: `${BASE}/vla-training-data-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/blog/best-egocentric-data-providers`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog/data-enrichment-pipeline-physical-ai`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    // Comparison pages
    { url: `${BASE}/compare`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/appen-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/scale-ai-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/claru-vs-luel`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/labelbox-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/surge-ai-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/encord-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/sepal-ai-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/humanloop-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/segments-ai-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/datasaur-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/welodata-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/kanerika-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/turing-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/anthromind-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/ayadata-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/objectways-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/welocalize-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/abaka-ai-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/ocular-ai-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/lxt-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/cloudfactory-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/innodata-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/centaur-labs-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/roboflow-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/label-studio-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/alignerr-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/isahit-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/telus-digital-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/dataloop-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/joinstellar-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/superannotate-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/centific-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/lightwheel-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/tasq-ai-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/redbrick-ai-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/cinder-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/defined-ai-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/invisible-tech-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/macgence-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/epinote-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/awign-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/superb-ai-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/bright-data-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/blomega-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/clickworker-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/playment-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/labellerr-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/asimov-yc-w26-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/basicai-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/revelo-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/lightly-ai-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/cvat-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/stack-ai-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/samasource-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/digital-bricks-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/ezdia-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/1840-company-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/datacurve-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/humansignal-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/hub-xyz-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/hive-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/acgence-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/cortex-ai-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/lionbridge-ai-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/voxel51-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/rws-trainai-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/deepen-ai-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/humans-in-the-loop-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/helpware-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/keymakr-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/ango-ai-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/deepchecks-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/micro1-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/cogito-tech-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/opentrain-ai-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/snorkel-ai-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/label-your-data-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/clarifai-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/wow-ai-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/imerit-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/hasty-ai-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/alegion-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/supervisely-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/v7-labs-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/mercor-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/understand-ai-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/build-ai-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/prodigy-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/nexdata-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare/toloka-alternatives`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
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

  // ── Dynamic: Solution Pages ───────────────────────────────────────
  const solutionPages: MetadataRoute.Sitemap = getAllContentPages().map(
    (page) => ({
      url: `${BASE}/solutions/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  return [...staticPages, ...caseStudyPages, ...jobPages, ...solutionPages];
}
