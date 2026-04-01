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
    slug: "sepal-ai-alternatives",
    competitor: "Sepal AI",
    summary:
      "Sepal AI focuses on expert-led RL environments and evaluation data. Physical AI teams often need real-world capture, enrichment, and robotics-native delivery.",
  },
  {
    slug: "humanloop-alternatives",
    competitor: "Humanloop",
    summary:
      "Humanloop focuses on LLM evaluation, prompt management, and observability. Physical AI teams need capture and enrichment pipelines instead of eval tooling.",
  },
  {
    slug: "segments-ai-alternatives",
    competitor: "Segments.ai",
    summary:
      "Segments.ai provides 2D and 3D annotation tools for images and point clouds. Claru delivers capture and enrichment for physical AI datasets.",
  },
  {
    slug: "datasaur-alternatives",
    competitor: "Datasaur",
    summary:
      "Datasaur focuses on text labeling workflows and LLM Labs. Physical AI teams need real-world data capture and enrichment.",
  },
  {
    slug: "welodata-alternatives",
    competitor: "Welo Data",
    summary:
      "Welo Data provides annotation services across modalities. Claru focuses on capture and enrichment for robotics training data.",
  },
  {
    slug: "kanerika-alternatives",
    competitor: "Kanerika",
    summary:
      "Kanerika offers enterprise AI services and a DataOps platform. Claru focuses on capture and enrichment for physical AI datasets.",
  },
  {
    slug: "turing-alternatives",
    competitor: "Turing",
    summary:
      "Turing provides AI talent pods and system delivery. Claru delivers robotics-ready datasets with capture and enrichment.",
  },
  {
    slug: "anthromind-alternatives",
    competitor: "Anthromind",
    summary:
      "Anthromind focuses on LLM evaluation and fine-tuning data. Claru focuses on physical-world capture and enrichment.",
  },
  {
    slug: "ayadata-alternatives",
    competitor: "Aya Data",
    summary:
      "Aya Data provides data annotation and collection services. Claru specializes in physical AI capture and enrichment.",
  },
  {
    slug: "objectways-alternatives",
    competitor: "Objectways",
    summary:
      "Objectways delivers human-in-the-loop labeling across modalities. Claru focuses on capture and enrichment for robotics.",
  },
  {
    slug: "welocalize-alternatives",
    competitor: "Welocalize",
    summary:
      "Welocalize (Welo Data) provides AI data services across modalities. Claru focuses on robotics-ready data capture.",
  },
  {
    slug: "abaka-ai-alternatives",
    competitor: "Abaka AI",
    summary:
      "Abaka AI provides data collection and annotation workflows. Claru focuses on capture and enrichment for physical AI.",
  },
  {
    slug: "ocular-ai-alternatives",
    competitor: "Ocular AI",
    summary:
      "Ocular AI provides an annotation platform and QA workflows. Claru delivers capture and enrichment for robotics data.",
  },
  {
    slug: "lxt-alternatives",
    competitor: "LXT",
    summary:
      "LXT delivers global data collection and annotation services. Claru focuses on physical-world capture and enrichment.",
  },
  {
    slug: "cloudfactory-alternatives",
    competitor: "CloudFactory",
    summary:
      "CloudFactory offers a data labeling platform and managed workforce. Claru focuses on capture and enrichment.",
  },
  {
    slug: "innodata-alternatives",
    competitor: "Innodata",
    summary:
      "Innodata provides data annotation services across modalities. Claru focuses on physical AI capture and enrichment.",
  },
  {
    slug: "centaur-labs-alternatives",
    competitor: "Centaur Labs",
    summary:
      "Centaur Labs focuses on expert medical labeling and datasets. Claru focuses on physical-world capture for robotics.",
  },
  {
    slug: "roboflow-alternatives",
    competitor: "Roboflow",
    summary:
      "Roboflow offers annotation, dataset management, and export workflows for computer vision teams. Claru focuses on capture and enrichment for physical AI.",
  },
  {
    slug: "label-studio-alternatives",
    competitor: "Label Studio",
    summary:
      "Label Studio is an open-source data labeling platform. Claru focuses on capture and enrichment for robotics-ready datasets.",
  },
  {
    slug: "alignerr-alternatives",
    competitor: "Alignerr",
    summary:
      "Alignerr has limited public product details. Claru provides a clear capture and enrichment pipeline for physical AI.",
  },
  {
    slug: "isahit-alternatives",
    competitor: "iSahit",
    summary:
      "iSahit provides managed data labeling services. Claru focuses on capture and enrichment for physical AI datasets.",
  },
  {
    slug: "telus-digital-alternatives",
    competitor: "TELUS Digital",
    summary:
      "TELUS Digital offers data for AI training and annotation services. Claru focuses on capture and enrichment for robotics data.",
  },
  {
    slug: "dataloop-alternatives",
    competitor: "Dataloop",
    summary:
      "Dataloop provides an AI data platform with annotation workflows. Claru focuses on capture and enrichment for physical AI.",
  },
  {
    slug: "joinstellar-alternatives",
    competitor: "Joinstellar",
    summary:
      "Joinstellar promotes flexible work for AI training and data annotation. Claru focuses on capture and enrichment for robotics.",
  },
  {
    slug: "superannotate-alternatives",
    competitor: "SuperAnnotate",
    summary:
      "SuperAnnotate offers an annotation platform and AI data services. Claru focuses on capture and enrichment for physical AI.",
  },
  {
    slug: "centific-alternatives",
    competitor: "Centific",
    summary:
      "Centific offers AI data services and the Data Canvas annotation platform. Claru focuses on capture and enrichment for robotics.",
  },
  {
    slug: "lightwheel-alternatives",
    competitor: "Lightwheel",
    summary:
      "Lightwheel's EgoSuite focuses on egocentric human data. Claru focuses on capture and enrichment for physical AI datasets.",
  },
  {
    slug: "tasq-ai-alternatives",
    competitor: "Tasq.ai",
    summary:
      "Tasq.ai offers human-in-the-loop data and evaluation workflows. Claru focuses on capture and enrichment for robotics.",
  },
  {
    slug: "redbrick-ai-alternatives",
    competitor: "RedBrick AI",
    summary:
      "RedBrick AI focuses on medical imaging annotation. Claru focuses on capture and enrichment for physical AI datasets.",
  },
  {
    slug: "cinder-alternatives",
    competitor: "Cinder",
    summary:
      "Cinder provides Trust & Safety operations with labeling and QA workflows. Claru focuses on capture and enrichment for physical AI datasets.",
  },
  {
    slug: "defined-ai-alternatives",
    competitor: "Defined.ai",
    summary:
      "Defined.ai offers a training data marketplace plus collection and labeling services. Claru focuses on capture and enrichment for physical AI.",
  },
  {
    slug: "invisible-tech-alternatives",
    competitor: "Invisible Technologies",
    summary:
      "Invisible provides training data services and annotation workflows. Claru focuses on capture and enrichment for physical AI datasets.",
  },
  {
    slug: "macgence-alternatives",
    competitor: "Macgence",
    summary:
      "Macgence provides data annotation services across modalities. Claru focuses on capture and enrichment for physical AI datasets.",
  },
  {
    slug: "epinote-alternatives",
    competitor: "Epinote",
    summary:
      "Epinote offers workflow tooling for data collection, annotation, and QA. Claru focuses on capture and enrichment for physical AI.",
  },
  {
    slug: "awign-alternatives",
    competitor: "Awign",
    summary:
      "Awign provides data annotation and AI data services, including video datasets. Claru focuses on capture and enrichment for robotics data.",
  },
  {
    slug: "superb-ai-alternatives",
    competitor: "Superb AI",
    summary:
      "Superb AI offers a computer vision annotation platform and managed labeling. Claru focuses on capture and enrichment for physical AI.",
  },
  {
    slug: "bright-data-alternatives",
    competitor: "Bright Data",
    summary:
      "Bright Data provides web data collection and datasets. Claru focuses on capture and enrichment for physical AI datasets.",
  },
  {
    slug: "blomega-alternatives",
    competitor: "Blomega",
    summary:
      "Public product details are limited. Claru provides a clear capture and enrichment pipeline for physical AI datasets.",
  },
  {
    slug: "clickworker-alternatives",
    competitor: "Clickworker",
    summary:
      "Clickworker provides crowd-based image and video labeling. Claru focuses on capture and enrichment for physical AI datasets.",
  },
  {
    slug: "playment-alternatives",
    competitor: "Playment",
    summary:
      "Playment provides annotation APIs and labeling workflows. Claru focuses on capture and enrichment for physical AI datasets.",
  },
  {
    slug: "labellerr-alternatives",
    competitor: "Labellerr",
    summary:
      "Labellerr provides a data annotation platform with automation. Claru focuses on capture and enrichment for physical AI datasets.",
  },
  {
    slug: "encord-alternatives",
    competitor: "Encord",
    summary:
      "Encord is building a physical AI data platform ($110M raised, 5PB+ data). Claru delivers training-ready data as a service. Platform vs. service -- different models for different teams.",
  },
  {
    slug: "asimov-yc-w26-alternatives",
    competitor: "Asimov",
    summary:
      "Asimov focuses on egocentric human activity data and rich annotations. Claru focuses on capture and enrichment across physical AI tasks.",
  },
  {
    slug: "basicai-alternatives",
    competitor: "BasicAI",
    summary:
      "BasicAI provides data annotation services and a labeling platform across modalities. Claru focuses on capture and enrichment for physical AI.",
  },
  {
    slug: "revelo-alternatives",
    competitor: "Revelo",
    summary:
      "Revelo provides expert human data for code LLMs (SFT, RLHF, preference data). Claru focuses on physical-world capture and enrichment.",
  },
  {
    slug: "lightly-ai-alternatives",
    competitor: "Lightly",
    summary:
      "Lightly focuses on CV data curation and labeling workflows. Claru focuses on capture and enrichment for physical AI.",
  },
  {
    slug: "cvat-alternatives",
    competitor: "CVAT",
    summary:
      "CVAT is an open-source annotation platform for images, video, and 3D data. Claru focuses on capture and enrichment for robotics.",
  },
  {
    slug: "stack-ai-alternatives",
    competitor: "Stack AI",
    summary:
      "Stack AI is a workflow builder for AI agents and automations. Claru focuses on capture and enrichment for physical AI datasets.",
  },
  {
    slug: "samasource-alternatives",
    competitor: "Sama (Samasource)",
    summary:
      "Sama provides managed annotation and validation services across modalities. Claru focuses on capture and enrichment for robotics data.",
  },
  {
    slug: "digital-bricks-alternatives",
    competitor: "Digital Bricks",
    summary:
      "Digital Bricks provides data labeling and annotation services across modalities. Claru focuses on capture and enrichment for robotics.",
  },
  {
    slug: "ezdia-alternatives",
    competitor: "EZdia",
    summary:
      "EZdia provides data annotation services and human-in-the-loop workflows. Claru focuses on capture and enrichment for physical AI.",
  },
  {
    slug: "1840-company-alternatives",
    competitor: "1840 & Company",
    summary:
      "1840 & Company provides managed data labeling services across CV, NLP, and audio. Claru focuses on capture and enrichment.",
  },
  {
    slug: "datacurve-alternatives",
    competitor: "Datacurve",
    summary:
      "Datacurve provides frontier coding data for foundation models. Claru focuses on physical-world capture and enrichment.",
  },
  {
    slug: "humansignal-alternatives",
    competitor: "HumanSignal",
    summary:
      "HumanSignal provides Label Studio and enterprise labeling workflows. Claru focuses on capture and enrichment for physical AI.",
  },
  {
    slug: "hub-xyz-alternatives",
    competitor: "Hub.xyz",
    summary:
      "Hub.xyz offers an API for real-world training data with AI + HITL annotation. Claru focuses on capture and enrichment.",
  },
  {
    slug: "hive-alternatives",
    competitor: "Hive",
    summary:
      "Hive provides managed data collection and annotation services at scale. Claru focuses on capture and enrichment for robotics.",
  },
  {
    slug: "acgence-alternatives",
    competitor: "Acgence",
    summary:
      "Acgence provides AI data generation, collection, and annotation services. Claru focuses on capture and enrichment.",
  },
  {
    slug: "cortex-ai-alternatives",
    competitor: "Cortex AI",
    summary:
      "Cortex AI focuses on egocentric data and robot trajectories for robotics. Claru focuses on capture and enrichment across tasks.",
  },
  {
    slug: "lionbridge-ai-alternatives",
    competitor: "Lionbridge AI",
    summary:
      "Lionbridge AI provides managed AI data services and annotation. Claru focuses on capture and enrichment for physical AI.",
  },
  {
    slug: "voxel51-alternatives",
    competitor: "Voxel51",
    summary:
      "Voxel51 provides the FiftyOne visual AI data platform for dataset management. Claru focuses on capture and enrichment.",
  },
  {
    slug: "rws-trainai-alternatives",
    competitor: "RWS TrainAI",
    summary:
      "RWS TrainAI provides managed labeling services with vetted specialists. Claru focuses on capture and enrichment.",
  },
  {
    slug: "deepen-ai-alternatives",
    competitor: "Deepen AI",
    summary:
      "Deepen AI provides physical AI data tooling for annotation and calibration. Claru focuses on capture and enrichment.",
  },
  {
    slug: "humans-in-the-loop-alternatives",
    competitor: "Humans in the Loop",
    summary:
      "Humans in the Loop provides managed annotation services across CV tasks. Claru focuses on capture and enrichment for physical AI.",
  },
  {
    slug: "helpware-alternatives",
    competitor: "Helpware",
    summary:
      "Helpware provides data labeling services across text, image, audio, and video. Claru focuses on capture and enrichment.",
  },
  {
    slug: "keymakr-alternatives",
    competitor: "Keymakr",
    summary:
      "Keymakr provides image, video, and LiDAR annotation services. Claru focuses on capture and enrichment for robotics.",
  },
  {
    slug: "ango-ai-alternatives",
    competitor: "Ango AI",
    summary:
      "Ango AI provides a data annotation platform and workflow tooling. Claru focuses on capture and enrichment.",
  },
  {
    slug: "deepchecks-alternatives",
    competitor: "Deepchecks",
    summary:
      "Deepchecks provides AI testing and monitoring tooling. Claru focuses on capture and enrichment for physical AI.",
  },
  {
    slug: "micro1-alternatives",
    competitor: "micro1",
    summary:
      "micro1 provides a human data engine and robotics data programs. Claru focuses on capture and enrichment across tasks.",
  },
  {
    slug: "cogito-tech-alternatives",
    competitor: "Cogito Tech",
    summary:
      "Cogito Tech provides data labeling services across image, video, and 3D point cloud. Claru focuses on capture and enrichment.",
  },
  {
    slug: "opentrain-ai-alternatives",
    competitor: "OpenTrain AI",
    summary:
      "OpenTrain AI provides trainer operations and a vetted expert network. Claru focuses on capture and enrichment for robotics.",
  },
  {
    slug: "snorkel-ai-alternatives",
    competitor: "Snorkel AI",
    summary:
      "Snorkel AI provides data-centric tooling for training data development. Claru focuses on capture and enrichment.",
  },
  {
    slug: "label-your-data-alternatives",
    competitor: "Label Your Data",
    summary:
      "Label Your Data provides managed labeling services across image, video, and 3D. Claru focuses on capture and enrichment.",
  },
  {
    slug: "clarifai-alternatives",
    competitor: "Clarifai",
    summary:
      "Clarifai offers a computer vision AI platform for image and video analysis. Claru focuses on capture and enrichment for physical AI.",
  },
  {
    slug: "wow-ai-alternatives",
    competitor: "Wow AI",
    summary:
      "Wow AI provides data products, custom collection, and labeling via a contributor network. Claru focuses on capture and enrichment.",
  },
  {
    slug: "imerit-alternatives",
    competitor: "iMerit",
    summary:
      "iMerit delivers expert-led annotation and model development services. Claru focuses on capture and enrichment for robotics data.",
  },
  {
    slug: "hasty-ai-alternatives",
    competitor: "Hasty",
    summary:
      "Hasty offers AI-assisted annotation tooling with quality control workflows. Claru focuses on capture and enrichment for physical AI.",
  },
  {
    slug: "alegion-alternatives",
    competitor: "Alegion",
    summary:
      "Alegion provides data annotation and data collection services. Claru focuses on capture and enrichment for robotics-ready datasets.",
  },
  {
    slug: "supervisely-alternatives",
    competitor: "Supervisely",
    summary:
      "Supervisely is a computer vision platform for annotation and model development across image, video, and LiDAR. Claru focuses on capture and enrichment.",
  },
  {
    slug: "v7-labs-alternatives",
    competitor: "V7 Labs",
    summary:
      "V7 Labs highlights V7 Go, an AI agent platform for document-heavy workflows. Claru focuses on capture and enrichment for physical AI.",
  },
  {
    slug: "mercor-alternatives",
    competitor: "Mercor",
    summary:
      "Mercor is a talent marketplace for remote AI roles. Claru focuses on capture and enrichment for robotics training data.",
  },
  {
    slug: "understand-ai-alternatives",
    competitor: "Understand.ai",
    summary:
      "Understand.ai positions itself as a ground truth partner for autonomous programs. Claru focuses on capture and enrichment for physical AI.",
  },
  {
    slug: "build-ai-alternatives",
    competitor: "Build AI",
    summary:
      "Build AI highlights robotics data scaling and the EGOCENTRIC-100K dataset. Claru focuses on capture and enrichment for robotics data.",
  },
  {
    slug: "prodigy-alternatives",
    competitor: "Prodigy",
    summary:
      "Prodigy is a downloadable annotation tool for NLP and computer vision tasks. Claru focuses on capture and enrichment for physical AI.",
  },
  {
    slug: "nexdata-alternatives",
    competitor: "Nexdata",
    summary:
      "Nexdata provides off-the-shelf datasets plus data collection and annotation services. Claru focuses on capture and enrichment for physical AI.",
  },
  {
    slug: "toloka-alternatives",
    competitor: "Toloka",
    summary:
      "Toloka offers an AI-guided data labeling platform with a human expert workforce. Claru focuses on capture and enrichment for robotics data.",
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
