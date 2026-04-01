import type { Metadata } from "next";
import Link from "next/link";
import GeoPageShell from "@/app/components/content/GeoPageShell";

// =============================================================================
// META
// =============================================================================

export const metadata: Metadata = {
  title:
    "7 Best Egocentric Video Data Providers for Robotics (2026) | Claru",
  description:
    "Side-by-side comparison of 7 egocentric video data providers for robotics and physical AI in 2026. Covers Claru, Luel, Encord, Appen, Labelbox, Ego4D, and Scale AI.",
  keywords: [
    "egocentric video data providers",
    "egocentric data for robotics",
    "first-person video data providers",
    "robotics data providers 2026",
    "egocentric video dataset providers",
    "best egocentric data companies",
    "egocentric video collection services",
    "robotics training data providers",
    "physical AI data providers",
    "wearable camera data collection",
  ],
  openGraph: {
    title:
      "7 Best Egocentric Video Data Providers for Robotics (2026)",
    description:
      "Side-by-side comparison of 7 egocentric video data providers for robotics and physical AI in 2026.",
    type: "article",
    url: "https://claru.ai/blog/best-egocentric-data-providers",
    siteName: "Claru",
    images: [
      {
        url: "/images/og-v2.webp",
        width: 1200,
        height: 630,
        alt: "7 Best Egocentric Video Data Providers for Robotics (2026) — Claru",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "7 Best Egocentric Video Data Providers for Robotics (2026) | Claru",
    description:
      "Comprehensive comparison of the top egocentric video data providers for robotics and physical AI.",
  },
  alternates: {
    canonical: "https://claru.ai/blog/best-egocentric-data-providers",
  },
};

// =============================================================================
// JSON-LD: Article
// =============================================================================

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "7 Best Egocentric Video Data Providers for Robotics (2026)",
  description:
    "Side-by-side comparison of 7 egocentric video data providers for robotics and physical AI in 2026. Covers Claru, Luel, Encord, Appen, Labelbox, Ego4D, and Scale AI.",
  author: {
    "@type": "Organization",
    name: "Claru AI",
    url: "https://claru.ai",
  },
  publisher: {
    "@type": "Organization",
    name: "Claru AI",
    url: "https://claru.ai",
    logo: {
      "@type": "ImageObject",
      url: "https://claru.ai/images/og-v2.webp",
    },
  },
  datePublished: "2026-03-30",
  dateModified: "2026-03-30",
  mainEntityOfPage:
    "https://claru.ai/blog/best-egocentric-data-providers",
  image: "https://claru.ai/images/og-v2.webp",
};

// =============================================================================
// JSON-LD: BreadcrumbList
// =============================================================================

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
      name: "Blog",
      item: "https://claru.ai/blog",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Best Egocentric Data Providers",
      item: "https://claru.ai/blog/best-egocentric-data-providers",
    },
  ],
};

// =============================================================================
// FAQ JSON-LD
// =============================================================================

const faqItems = [
  {
    question: "What is egocentric video data?",
    answer:
      "Egocentric video data is first-person footage captured from the viewpoint of the acting agent — whether human or robot. It is collected using wearable cameras, head-mounted rigs, or cameras fixed to the robot's body. The resulting footage mirrors exactly what a robot's head or wrist camera would see during operation. Models trained on egocentric footage learn to perform tasks from the inside rather than just recognizing actions from an external viewpoint, which directly improves task success rates when robots are deployed in the real world.",
  },
  {
    question: "Why do robotics teams need egocentric data?",
    answer:
      "Robots operate from an egocentric perspective — they see the world through their own cameras, not from a third-person view. Training on egocentric data teaches policies to handle the specific visual challenges of first-person operation: heavy occlusion from the robot's own body, limited field of view, ego-motion, and the particular viewpoint geometry of wrist or head-mounted cameras. NVIDIA's EgoScale research showed that pretraining on egocentric human video improved downstream robot task success rates by 54% compared to training from scratch.",
  },
  {
    question: "How much does egocentric video data cost?",
    answer:
      "Costs vary significantly by provider and scope. Open-source academic datasets like Ego4D are free (under academic licenses) but have limited commercial use rights. Commercial providers typically charge based on volume, complexity, and enrichment level. Raw egocentric video capture ranges from $5-$50 per clip depending on environment requirements and contributor coordination. Enriched data with depth maps, pose estimation, and action labels costs more but saves teams months of in-house pipeline engineering. Custom collection campaigns with specific hardware, environments, and task protocols run from $50K-$500K+ depending on scale.",
  },
  {
    question: "What enrichment layers are important for egocentric robotics data?",
    answer:
      "The most important enrichment layers for egocentric robotics data are: (1) depth maps — per-frame monocular depth estimation providing 3D spatial understanding for grasp planning, (2) human pose estimation — 2D and 3D joint positions for hand-object interaction analysis and human-to-robot transfer learning, (3) semantic segmentation — object-level and part-level masks for scene understanding and affordance reasoning, (4) optical flow — dense motion fields for object dynamics prediction, and (5) action labels — temporal boundaries of manipulation phases (reach, grasp, lift, place) with natural language descriptions. Providers like Claru deliver all five layers pre-computed; others require teams to build enrichment pipelines in-house.",
  },
  {
    question: "Can I use Ego4D data commercially?",
    answer:
      "Ego4D requires a license agreement approved by the Ego4D consortium. The dataset is released under the Ego4D License Agreement, which must be reviewed and accepted before access is granted — a process that typically takes 48 hours. The license permits research use broadly, but commercial use restrictions vary by component and may require additional agreements. Teams building commercial robotics products should review the specific terms for their use case. For unrestricted commercial use, Claru and Luel provide egocentric video data with clear commercial licensing and full consent documentation.",
  },
  {
    question: "What is the difference between a data provider and an annotation platform?",
    answer:
      "A data provider like Claru or Luel captures, processes, and delivers complete datasets — you receive training-ready data. An annotation platform like Encord or Labelbox provides tools for your team to label data you already have. Some providers offer both: Appen has a crowd that can collect and label data through their ADAP platform, and Scale AI provides both self-serve annotation tools (Scale Studio) and managed labeling services (Scale Rapid). The right choice depends on whether you need data or labels. If you lack egocentric video entirely, you need a provider. If you have raw video and need annotations, a platform may suffice.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

// =============================================================================
// Provider data
// =============================================================================

const providers = [
  {
    rank: 1,
    name: "Claru",
    tagline: "Enriched egocentric data built for VLA and physical AI training",
    url: "https://claru.ai",
    whatTheyOffer:
      "Claru captures, enriches, and delivers purpose-built egocentric video datasets for robotics, embodied AI, and world model companies. Every clip comes from Claru's network of 10,000+ trained contributors wearing cameras during real tasks across kitchens, workshops, warehouses, and outdoor environments in 100+ cities worldwide. Data is enriched by default with depth maps (Depth Anything V2), pose estimation (ViTPose), semantic segmentation (SAM), optical flow, and AI-generated captions. Expert human annotators add action boundary labels, object affordances, grasp types, and natural language instruction annotations.",
    strengths: [
      "500K+ enriched egocentric clips — not raw video, but training-ready data with 5+ annotation layers",
      "3.7M+ completed human annotations spanning egocentric video, game environments, and custom captures",
      "Real-world diversity: 100+ cities, thousands of environment types, natural lighting and clutter",
      "Delivered in VLA-native formats: RLDS, WebDataset, HDF5, Parquet — compatible with OpenVLA, Octo, LeRobot",
      "Managed collection campaigns with brief-to-delivery in days, not months",
      "Clear commercial licensing with full consent documentation",
    ],
    limitations: [
      "Not a self-serve marketplace — collection campaigns are scoped in collaboration with clients",
      "Focused on physical AI use cases; not a general-purpose data labeling platform",
    ],
    bestFor:
      "Teams building production VLA models, world models, or humanoid robot systems that need large-scale, enriched egocentric data with commercial licensing and fast turnaround.",
  },
  {
    rank: 2,
    name: "Luel",
    tagline: "Rights-cleared data marketplace with same-day delivery",
    url: "https://www.luel.ai",
    whatTheyOffer:
      "Luel (YC W26) is a two-sided marketplace connecting AI teams with a global network of 3M+ vetted contributors. Teams can license pre-built datasets (including curated Ego4D and Ego-Exo4D subsets) or commission custom egocentric video collection campaigns. The platform emphasizes speed — same-day delivery for off-the-shelf datasets — and compliance, with full rights clearance and consent documentation on every clip. Automated content analysis powered by Google Vertex AI categorizes and verifies footage before delivery.",
    strengths: [
      "Fastest time-to-data: off-the-shelf egocentric datasets available within 24 hours",
      "3M+ contributor network for custom collection at scale",
      "Strong compliance infrastructure: full rights clearance, consent, and audit trails",
      "60+ blog posts and growing content library — strong community presence",
      "Published sample dataset on Hugging Face (1M+ frames, 10+ hours)",
    ],
    limitations: [
      "No deep enrichment pipeline — delivers raw or lightly processed video, not pre-enriched data with depth/pose/segmentation",
      "Launched in early 2026 (YC W26) — limited track record for large-scale production deployments",
      "Marketplace model means quality can vary across contributors",
    ],
    bestFor:
      "Teams that need egocentric video fast and have in-house enrichment pipelines, or researchers who need rights-cleared versions of academic datasets.",
  },
  {
    rank: 3,
    name: "Encord",
    tagline: "Multimodal annotation platform with robotics-native tooling",
    url: "https://encord.com",
    whatTheyOffer:
      "Encord is an all-in-one data annotation and management platform designed for complex multimodal datasets. It handles LiDAR, radar, 3D point clouds, and synchronized video natively, supporting over 5 million labels and 200,000+ video frames per project. Key features include SAM 2 integration for automated object segmentation and tracking, video-native annotation with 6x speed improvements over frame-by-frame tools, and active learning features that surface high-impact samples for human review. The platform integrates with GPT-4o, LLaMA 3.2, and Gemini 1.5 Flash for model-assisted labeling.",
    strengths: [
      "Native support for robotics data types: LiDAR, point clouds, multi-camera setups, synchronized video",
      "SAM 2 integration for automated segmentation and tracking across frames",
      "Active learning data flywheel — improves label quality over time without linear cost increases",
      "Unified platform: curation, annotation, and evaluation in one workflow",
      "Production case studies: Pickle Robot improved grasping precision by 15% after using Encord",
    ],
    limitations: [
      "An annotation platform, not a data provider — you need to bring your own video",
      "No egocentric video capture network or collection infrastructure",
      "Enterprise pricing may be heavy for smaller teams or early-stage research",
    ],
    bestFor:
      "Teams that already have egocentric video and need production-grade annotation tools with multimodal support, especially for mixed LiDAR/video robotics datasets.",
  },
  {
    rank: 4,
    name: "Appen",
    tagline: "Legacy crowd platform expanding into physical AI",
    url: "https://www.appen.com",
    whatTheyOffer:
      "Appen has nearly 30 years in AI training data and operates one of the world's largest contributor networks: 1M+ contributors across 170+ countries. They offer end-to-end data services from collection through annotation and validation, including LiDAR point cloud annotation, multi-camera sensor fusion, robot demonstration trajectories, and embodied interaction logs. Their ADAP platform integrates internal experts with the global crowd, with templates, AI-assisted annotation, and quality monitoring via gold test questions and smart validators. Appen contributed to the Ego4D dataset and has supported robotics programs at Tesla and ABB.",
    strengths: [
      "Massive geographic diversity: 1M+ contributors in 170+ countries for globally representative data",
      "End-to-end pipeline: collection, annotation, validation, and model evaluation in one service",
      "Enterprise security and compliance: PII/PHI handling for regulated industries and defense-adjacent programs",
      "Contributed to Ego4D — proven experience with egocentric video at research scale",
      "Multi-modal annotation: text, image, audio, video, gesture recognition in one workflow",
    ],
    limitations: [
      "Generalist platform — not specialized for physical AI or robotics; egocentric video is one of many data types",
      "Quality concerns with crowd-sourced annotation for specialized robotics tasks requiring domain expertise",
      "Significant financial losses in recent years may impact service quality and investment in new capabilities",
      "Heavy onboarding and pricing built for large enterprise contracts",
    ],
    bestFor:
      "Large enterprises running long-term, multi-modal robotics data programs that need geographic diversity, regulatory compliance, and a proven partner with institutional track record.",
  },
  {
    rank: 5,
    name: "Labelbox",
    tagline: "Annotation platform with the Alignerr expert network",
    url: "https://labelbox.com",
    whatTheyOffer:
      "Labelbox provides a full-featured data labeling platform built around three pillars — Catalog, Annotate, and Model — plus the Alignerr network for managed annotation services. For robotics, the platform handles 3D point clouds, video, geospatial data, and sensor fusion. The Alignerr network provides access to 1.5M+ knowledge workers including 50K+ PhDs and 200K+ Master's degree holders, vetted through an AI interviewer (Zara) that conducts tailored technical interviews. The platform includes Model Foundry for model-assisted labeling, active learning for efficient sample selection, and a Python SDK with S3/GCS/Azure integrations.",
    strengths: [
      "Alignerr network: access to top 3% of data talent with domain expertise across 200+ fields",
      "Strong tooling for robotics: 3D point clouds, video, sensor fusion, multi-camera annotation",
      "Model Foundry: built-in model-assisted labeling and evaluation workflows",
      "Python SDK-first design — integrates well into ML engineering workflows",
      "Active learning features surface the most impactful samples for annotation",
    ],
    limitations: [
      "An annotation platform with a managed workforce — not a data capture or collection service",
      "No egocentric video collection infrastructure or contributor network for field capture",
      "Enterprise pricing; best suited for medium-to-large teams with existing data pipelines",
      "Alignerr network is a general expert pool, not specialized for robotics manipulation or egocentric tasks",
    ],
    bestFor:
      "Teams that have raw egocentric video and need high-quality expert annotation at scale, particularly for tasks requiring domain-specific knowledge (medical robotics, surgical data, etc.).",
  },
  {
    rank: 6,
    name: "Ego4D / Ego-Exo4D (Meta AI)",
    tagline: "Open-source academic baseline for egocentric video research",
    url: "https://ego4d-data.org",
    whatTheyOffer:
      "Ego4D is the world's largest open egocentric video dataset: 3,670 hours of daily-life activity video from 931 camera wearers across 74 locations in 9 countries. Captured with seven different wearable cameras (GoPro, Vuzix Blade, Pupil Labs, and others), portions include audio, 3D meshes, eye gaze, stereo, and synchronized multi-camera streams. Ego-Exo4D extends this with paired egocentric and exocentric views from Project Aria glasses. Both datasets are produced by an international consortium of 13+ universities in partnership with Meta AI, with benchmark suites for episodic memory, hand-object manipulation, audio-visual conversation, and activity forecasting.",
    strengths: [
      "Largest open egocentric dataset by a significant margin (3,670 hours, 931 participants)",
      "Exceptional diversity: 74 locations, 9 countries, hundreds of activity scenarios",
      "Rich multi-modal data: some portions include 3D meshes, eye gaze, stereo video",
      "Established benchmark suite with active research community",
      "Free for research use under the Ego4D License Agreement",
    ],
    limitations: [
      "Academic license — commercial use requires additional agreements and may be restricted for some components",
      "No robot action labels — all data is human-only, requiring retargeting for VLA training",
      "48-hour license approval process; access is not instant",
      "No enrichment layers (depth maps, segmentation, pose) pre-computed — teams must process the raw video themselves",
      "Not a provider — it is a fixed dataset, not a service that can collect new data to your specifications",
    ],
    bestFor:
      "Academic researchers who need a large, diverse egocentric video baseline for pretraining or benchmarking, and who can handle the enrichment and action label gap in-house.",
  },
  {
    rank: 7,
    name: "Scale AI",
    tagline: "Enterprise annotation infrastructure for robotics at scale",
    url: "https://scale.com",
    whatTheyOffer:
      "Scale AI has been in data labeling since 2016, providing annotation infrastructure for autonomous vehicles, robotics, and generative AI. The platform offers two options: Scale Rapid (self-serve annotation with Scale's workforce) and Scale Studio (bring-your-own annotators on Scale's platform). For physical AI, Scale offers a Physical AI Data Engine built on real robot interaction data, active learning tools that surface rare and hard training scenarios, and AI-assisted pre-labeling. In March 2026, Scale launched Scale Labs, an expanded research division for AI model evaluation and safety testing, building on the SEAL lab established in 2023.",
    strengths: [
      "Proven enterprise track record — built annotation infrastructure used across autonomous vehicles and major AI labs",
      "Physical AI Data Engine specifically designed for robot interaction data",
      "Active learning and AI-assisted pre-labeling reduce annotation costs for large-scale projects",
      "Scale Labs (2026) adds rigorous evaluation and safety benchmarking capabilities",
      "LiDAR annotation and map labeling for autonomous driving and outdoor robotics",
    ],
    limitations: [
      "Generalist infrastructure — robotics is one vertical among many, not the core focus",
      "Enterprise pricing and sales-driven onboarding; not built for small teams or quick experiments",
      "Outsourced annotation through Remotasks subsidiary — quality for specialized robotics tasks depends on project management",
      "No egocentric video capture network — Scale annotates data but does not collect it",
      "Expensive relative to specialized providers for comparable volume and quality",
    ],
    bestFor:
      "Large enterprises with significant budgets that need enterprise-grade security, compliance, and annotation infrastructure for mixed robotics data types (LiDAR + video + point clouds).",
  },
];

// =============================================================================
// PAGE
// =============================================================================

export default function BestEgocentricDataProvidersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <GeoPageShell>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="w-full pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="mx-auto max-w-4xl px-6">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol
                className="flex flex-wrap items-center gap-1.5 text-sm"
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontFamily:
                    "var(--font-mono, 'JetBrains Mono', monospace)",
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
                <li>
                  <a
                    href="/blog"
                    className="transition-colors hover:text-white"
                  >
                    Blog
                  </a>
                </li>
                <li aria-hidden="true" className="select-none">
                  /
                </li>
                <li aria-current="page" style={{ color: "#92B090" }}>
                  Best Egocentric Data Providers
                </li>
              </ol>
            </nav>

            <p
              className="text-xs font-mono uppercase tracking-widest mb-4"
              style={{ color: "#92B090" }}
            >
              Last updated: March 2026
            </p>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
              7 Best Egocentric Video Data Providers for Robotics (2026)
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl text-white/70">
              Egocentric video is the fastest-growing data modality in{" "}
              <Link
                href="/training-data-for-robotics"
                className="underline underline-offset-2"
                style={{ color: "#92B090" }}
              >
                robotics training
              </Link>
              . NVIDIA&apos;s EgoScale showed that pretraining on 20,000+
              hours of egocentric human video improves robot task success
              rates by 54%. But where do you get this data? We evaluated
              every major provider across scale, enrichment depth, speed,
              and commercial viability.
            </p>
          </div>
        </section>

        {/* ── Why Egocentric Data Matters ──────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Why Egocentric Data Is Critical for Robotics
            </h2>

            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Robots see the world through their own cameras &mdash;
                head-mounted, wrist-mounted, or chest-mounted. Third-person
                footage from security cameras or human observers captures
                the wrong viewpoint geometry, the wrong occlusion patterns,
                and the wrong ego-motion characteristics. Models trained on
                third-person video learn to{" "}
                <em>recognize</em> actions from the outside. Models trained
                on{" "}
                <Link
                  href="/egocentric-video-datasets"
                  className="underline underline-offset-2"
                  style={{ color: "#92B090" }}
                >
                  egocentric video
                </Link>{" "}
                learn to <em>perform</em> them from the inside.
              </p>

              <p>
                That distinction matters directly for task success rates.
                Research from EgoMimic demonstrated that co-training on
                egocentric human demonstrations alongside robot data
                consistently outperforms robot-only training, and that one
                hour of additional human egocentric data is more valuable
                than one hour of additional robot teleoperation data.
              </p>

              <p>
                The challenge is sourcing egocentric data at the scale and
                quality that production{" "}
                <Link
                  href="/vla-training-data-guide"
                  className="underline underline-offset-2"
                  style={{ color: "#92B090" }}
                >
                  VLA models
                </Link>{" "}
                and{" "}
                <Link
                  href="/physical-ai-training-data"
                  className="underline underline-offset-2"
                  style={{ color: "#92B090" }}
                >
                  physical AI systems
                </Link>{" "}
                require. You cannot scrape egocentric video from the
                internet. Every clip requires a physical person wearing a
                camera in a real environment. The providers below represent
                every viable option for acquiring this data in 2026.
              </p>
            </div>
          </div>
        </section>

        {/* ── How We Evaluated ──────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              How We Evaluated These Providers
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              We assessed each provider across six dimensions that matter
              most to robotics teams building{" "}
              <Link
                href="/embodied-ai-datasets"
                className="underline underline-offset-2"
                style={{ color: "#92B090" }}
              >
                embodied AI datasets
              </Link>
              .
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                {
                  title: "Data Scale",
                  description:
                    "Volume of egocentric video available or collectible",
                },
                {
                  title: "Enrichment Depth",
                  description:
                    "Pre-computed depth, pose, segmentation, action labels",
                },
                {
                  title: "Speed to Delivery",
                  description:
                    "Time from brief to first usable data delivery",
                },
                {
                  title: "Environment Diversity",
                  description:
                    "Range of real-world settings, lighting, and objects",
                },
                {
                  title: "Commercial Licensing",
                  description:
                    "Clear rights for production use, consent documentation",
                },
                {
                  title: "Format Compatibility",
                  description:
                    "Support for RLDS, WebDataset, HDF5, and ML pipelines",
                },
              ].map((criterion) => (
                <div
                  key={criterion.title}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
                >
                  <h3 className="text-sm font-semibold text-white mb-1">
                    {criterion.title}
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    {criterion.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Provider Listings ─────────────────────────────────────── */}
        {providers.map((provider) => (
          <section
            key={provider.name}
            id={provider.name.toLowerCase().replace(/[\s/()]+/g, "-")}
            className={`w-full py-16 md:py-24 ${
              provider.rank % 2 === 0 ? "bg-white/[0.02]" : ""
            }`}
          >
            <div className="mx-auto max-w-4xl px-6">
              <div className="flex items-baseline gap-4 mb-2">
                <span
                  className="text-sm font-mono font-bold"
                  style={{ color: "#92B090" }}
                >
                  #{provider.rank}
                </span>
                <h2 className="text-2xl font-semibold md:text-3xl text-white">
                  {provider.name}
                </h2>
              </div>
              <p className="text-white/50 text-sm mb-6 font-mono">
                {provider.tagline} &middot;{" "}
                <a
                  href={provider.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 transition-colors hover:text-white/70"
                >
                  {provider.url.replace("https://", "")}
                </a>
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-mono uppercase tracking-wider text-white/40 mb-3">
                    What They Offer
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    {provider.whatTheyOffer}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-mono uppercase tracking-wider text-white/40 mb-3">
                      Strengths
                    </h3>
                    <ul className="space-y-2">
                      {provider.strengths.map((s) => (
                        <li
                          key={s}
                          className="flex items-start gap-2 text-sm text-white/70 leading-relaxed"
                        >
                          <span
                            className="mt-1.5 flex-none w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: "#92B090" }}
                          />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-mono uppercase tracking-wider text-white/40 mb-3">
                      Limitations
                    </h3>
                    <ul className="space-y-2">
                      {provider.limitations.map((l) => (
                        <li
                          key={l}
                          className="flex items-start gap-2 text-sm text-white/70 leading-relaxed"
                        >
                          <span className="mt-1.5 flex-none w-1.5 h-1.5 rounded-full bg-white/30" />
                          {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div
                  className="rounded-lg p-4"
                  style={{ backgroundColor: "rgba(146,176,144,0.08)" }}
                >
                  <h3 className="text-sm font-mono uppercase tracking-wider text-white/40 mb-2">
                    Best For
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {provider.bestFor}
                  </p>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* ── Comparison Table ──────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Quick Comparison
            </h2>

            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="px-3 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                      Provider
                    </th>
                    <th className="px-3 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                      Type
                    </th>
                    <th className="px-3 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                      Captures Data
                    </th>
                    <th className="px-3 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                      Enrichment
                    </th>
                    <th className="px-3 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                      Commercial License
                    </th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  {[
                    { name: "Claru", type: "Provider", captures: "Yes", enrichment: "Full (5 layers)", license: "Yes" },
                    { name: "Luel", type: "Marketplace", captures: "Yes", enrichment: "Minimal", license: "Yes" },
                    { name: "Encord", type: "Platform", captures: "No", enrichment: "Tooling only", license: "N/A" },
                    { name: "Appen", type: "Provider + Platform", captures: "Yes", enrichment: "Basic", license: "Yes" },
                    { name: "Labelbox", type: "Platform", captures: "No", enrichment: "Tooling only", license: "N/A" },
                    { name: "Ego4D", type: "Open Dataset", captures: "No", enrichment: "None", license: "Academic" },
                    { name: "Scale AI", type: "Platform + Service", captures: "No", enrichment: "Annotation only", license: "N/A" },
                  ].map((row, i) => (
                    <tr
                      key={row.name}
                      className={
                        i % 2 === 0
                          ? "bg-transparent"
                          : "bg-white/[0.02]"
                      }
                    >
                      <td className="px-3 py-3 font-medium text-white whitespace-nowrap">
                        {row.name}
                      </td>
                      <td className="px-3 py-3">{row.type}</td>
                      <td className="px-3 py-3">{row.captures}</td>
                      <td className="px-3 py-3">{row.enrichment}</td>
                      <td className="px-3 py-3">{row.license}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── How to Choose ────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              How to Choose the Right Provider
            </h2>

            <div className="space-y-6 text-white/80 leading-relaxed">
              <p>
                The right choice depends on what you already have and what
                you need to build.
              </p>

              <div className="space-y-4">
                <div className="border-l-2 pl-6" style={{ borderColor: "rgba(146,176,144,0.4)" }}>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    You need complete, enriched datasets
                  </h3>
                  <p className="text-white/70">
                    Choose <strong className="text-white">Claru</strong>.
                    We deliver training-ready data with depth, pose,
                    segmentation, and action labels pre-computed. No
                    enrichment pipeline to build. Compatible with{" "}
                    <Link
                      href="/vla-training-data-guide"
                      className="underline underline-offset-2"
                      style={{ color: "#92B090" }}
                    >
                      VLA training pipelines
                    </Link>{" "}
                    out of the box.
                  </p>
                </div>

                <div className="border-l-2 pl-6" style={{ borderColor: "rgba(146,176,144,0.4)" }}>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    You need raw video fast
                  </h3>
                  <p className="text-white/70">
                    Choose <strong className="text-white">Luel</strong>.
                    Same-day delivery from their marketplace, with
                    compliance built in. You will need to run enrichment
                    in-house.
                  </p>
                </div>

                <div className="border-l-2 pl-6" style={{ borderColor: "rgba(146,176,144,0.4)" }}>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    You have data and need annotation tools
                  </h3>
                  <p className="text-white/70">
                    Choose <strong className="text-white">Encord</strong>{" "}
                    or <strong className="text-white">Labelbox</strong>.
                    Both provide strong multimodal annotation platforms
                    for robotics data. Encord excels at LiDAR + video
                    fusion; Labelbox provides the Alignerr expert network
                    for domain-specific annotation.
                  </p>
                </div>

                <div className="border-l-2 pl-6" style={{ borderColor: "rgba(146,176,144,0.4)" }}>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    You need a research baseline
                  </h3>
                  <p className="text-white/70">
                    Start with{" "}
                    <strong className="text-white">Ego4D</strong>. It is
                    the largest open egocentric dataset and free for
                    research. But plan for commercial data sourcing before
                    you productionize.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-10">
              Frequently Asked Questions
            </h2>

            <div className="space-y-8">
              {faqItems.map((faq) => (
                <div
                  key={faq.question}
                  className="border-b border-white/10 pb-8 last:border-none"
                >
                  <h3 className="text-lg font-medium text-white mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Related Resources ────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Related Resources
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  href: "/vla-training-data-guide",
                  title: "VLA Training Data: The Complete Guide",
                  desc: "Everything about Vision-Language-Action model data requirements.",
                },
                {
                  href: "/egocentric-video-datasets",
                  title: "Egocentric Video Datasets",
                  desc: "First-person video data for robot perception and VLA pretraining.",
                },
                {
                  href: "/training-data-for-robotics",
                  title: "Training Data for Robotics",
                  desc: "Purpose-built datasets for robot learning and manipulation.",
                },
                {
                  href: "/physical-ai-training-data",
                  title: "Physical AI Training Data",
                  desc: "Real-world datasets for models that understand physics.",
                },
                {
                  href: "/blog/data-enrichment-pipeline-physical-ai",
                  title: "Data Enrichment for Physical AI",
                  desc: "Depth, pose, segmentation, and action labeling at scale.",
                },
                {
                  href: "/embodied-ai-datasets",
                  title: "Embodied AI Datasets",
                  desc: "Datasets for robots that navigate and interact with the physical world.",
                },
                {
                  href: "/compare/claru-vs-luel",
                  title: "Claru vs. Luel",
                  desc: "Side-by-side comparison of enriched data vs. marketplace speed.",
                },
                {
                  href: "/compare/appen-alternatives",
                  title: "Appen Alternatives (2026)",
                  desc: "Modern alternatives for AI training data.",
                },
                {
                  href: "/compare/scale-ai-alternatives",
                  title: "Scale AI Alternatives (2026)",
                  desc: "Enterprise annotation alternatives for robotics teams.",
                },
                {
                  href: "/compare/labelbox-alternatives",
                  title: "Labelbox Alternatives (2026)",
                  desc: "Annotation platform alternatives with robotics focus.",
                },
                {
                  href: "/data-catalog",
                  title: "Browse the Data Catalog",
                  desc: "Explore Claru's 25+ licensed datasets with live previews.",
                },
                {
                  href: "/solutions",
                  title: "Solutions Overview",
                  desc: "Custom data collection and annotation for physical AI teams.",
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <div>
                    <div
                      className="text-sm font-medium group-hover:underline"
                      style={{ color: "#92B090" }}
                    >
                      {link.title}
                    </div>
                    <div className="text-xs text-white/50 mt-1">
                      {link.desc}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <section className="w-full py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Need Enriched Egocentric Data for Your Robotics Model?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Tell us about your model, your deployment environment, and
              your timeline. We&apos;ll scope the dataset and deliver
              training-ready egocentric video with depth, pose,
              segmentation, and action labels.
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
                Get Started
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
      </GeoPageShell>
    </>
  );
}
