import type { MetadataRoute } from "next";
import { getAllCaseStudies } from "@/lib/case-studies";
import { getAllJobs } from "@/lib/jobs";
import { getAllContentPages } from "@/data/content-pages";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAllGlossaryDeepSlugs } from "@/data/programmatic/glossary-deep/index";
import { getAllGuideSlugs } from "@/data/programmatic/guides/index";
import { getAllTaskSlugs } from "@/data/programmatic/tasks/index";
import { getAllModelSlugs } from "@/data/programmatic/models/index";
import { getAllDatasetSlugs } from "@/data/programmatic/datasets/index";
import { fetchAllOSSSlugs } from "@/lib/oss-datasets";
import { getAllFormatSlugs } from "@/data/programmatic/formats/index";
import { getAllIndustrySlugs } from "@/data/programmatic/industries/index";
import { getAllLabSlugs } from "@/data/programmatic/labs/index";
import { getAllBenchmarkSlugs } from "@/data/programmatic/benchmarks/index";
import { getAllAcademicAltSlugs } from "@/data/programmatic/academic-alts/index";

const BASE = "https://claru.ai";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // ── Static pages ───────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/case-studies`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/data-catalog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/jobs`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/for-annotators`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    // GEO landing pages — physical AI / robotics keyword clusters
    { url: `${BASE}/training-data-for-robotics`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/physical-ai-training-data`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/egocentric-video-datasets`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/embodied-ai-datasets`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    // Tier 3 content pages — pillar guides, listicles, deep-dives
    { url: `${BASE}/vla-training-data-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/blog/best-egocentric-data-providers`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog/data-enrichment-pipeline-physical-ai`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog/vlm-vs-vla`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog/vla-training-data-volume`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog/sim-to-real-gap`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog/physical-ai-stack`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    // Comparison pages
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

  // ── Dynamic: Blog Posts ────────────────────────────────────────────
  // Blog index always present; individual slugs fetched from Supabase.
  const blogIndexEntry: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  let blogPostPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("slug, published_at, updated_at")
      .eq("status", "published");

    blogPostPages = (data ?? []).map(
      (post: { slug: string; published_at: string | null; updated_at: string }) => ({
        url: `${BASE}/blog/${post.slug}`,
        lastModified: post.updated_at ?? post.published_at ?? now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })
    );
  } catch {
    // Graceful degradation — sitemap still works if Supabase is unavailable
  }

  // ── Dynamic: Glossary Deep Pages ────────────────────────────────
  const glossaryDeepPages: MetadataRoute.Sitemap = getAllGlossaryDeepSlugs().map(
    (slug) => ({
      url: `${BASE}/glossary/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })
  );

  // ── Dynamic: Guide Pages ──────────────────────────────────────────
  const guidePages: MetadataRoute.Sitemap = getAllGuideSlugs().map(
    (slug) => ({
      url: `${BASE}/guides/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })
  );

  // ── Dynamic: Task Pages ────────────────────────────────────────
  const taskPages: MetadataRoute.Sitemap = getAllTaskSlugs().map((slug) => ({
    url: `${BASE}/training-data/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // ── Dynamic: Model Pages ───────────────────────────────────────
  const modelPages: MetadataRoute.Sitemap = getAllModelSlugs().map((slug) => ({
    url: `${BASE}/models/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // ── Dynamic: Dataset Pages (Static Claru + OSS from Supabase) ──
  const staticDatasetSlugs = new Set(getAllDatasetSlugs());
  let ossSlugs: string[] = [];
  try {
    ossSlugs = await fetchAllOSSSlugs();
  } catch {
    // Graceful degradation
  }

  const datasetPages: MetadataRoute.Sitemap = [
    ...getAllDatasetSlugs().map((slug) => ({
      url: `${BASE}/datasets/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...ossSlugs
      .filter((slug) => !staticDatasetSlugs.has(slug))
      .map((slug) => ({
        url: `${BASE}/datasets/${slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  ];

  // ── Dynamic: Format Pages ──────────────────────────────────────
  const formatPages: MetadataRoute.Sitemap = getAllFormatSlugs().map((slug) => ({
    url: `${BASE}/formats/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // ── Dynamic: Industry Pages ────────────────────────────────────
  const industryPages: MetadataRoute.Sitemap = getAllIndustrySlugs().map((slug) => ({
    url: `${BASE}/industries/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // ── Dynamic: Lab Pages ─────────────────────────────────────────
  const labPages: MetadataRoute.Sitemap = getAllLabSlugs().map((slug) => ({
    url: `${BASE}/for/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // ── Dynamic: Benchmark Pages ───────────────────────────────────
  const benchmarkPages: MetadataRoute.Sitemap = getAllBenchmarkSlugs().map((slug) => ({
    url: `${BASE}/benchmarks/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // ── Dynamic: Academic Alt Pages ────────────────────────────────
  const academicAltPages: MetadataRoute.Sitemap = getAllAcademicAltSlugs().map((slug) => ({
    url: `${BASE}/compare/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // ── Hub Pages ──────────────────────────────────────────────────
  const hubPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/training-data`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE}/models`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE}/datasets`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE}/formats`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE}/industries`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE}/benchmarks`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE}/for`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE}/glossary`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE}/guides`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE}/solutions`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE}/compare`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
  ];

  return [
    ...staticPages,
    ...caseStudyPages,
    ...jobPages,
    ...solutionPages,
    ...blogIndexEntry,
    ...blogPostPages,
    ...glossaryDeepPages,
    ...guidePages,
    ...taskPages,
    ...modelPages,
    ...datasetPages,
    ...formatPages,
    ...industryPages,
    ...labPages,
    ...benchmarkPages,
    ...academicAltPages,
    ...hubPages,
  ];
}
