import type { Metadata} from "next";
import Link from "next/link";
import GeoPageShell from "@/app/components/content/GeoPageShell";

// =============================================================================
// META
// =============================================================================

export const metadata: Metadata = {
  title:
    "Labelbox Alternatives for Physical AI Data (2026)",
  description:
    "Labelbox is a strong annotation platform, but physical AI needs more than labeling. Compare alternatives for robotics data capture and delivery.",
  keywords: [
    "Labelbox alternative",
    "Labelbox alternatives",
    "Labelbox competitor",
    "Labelbox vs Claru",
    "Labelbox for robotics",
    "Labelbox robotics data",
    "physical AI training data",
    "robotics data annotation",
    "end-to-end training data",
    "annotation platform vs data service",
    "video annotation alternative",
    "AI data labeling for robotics",
  ],
  openGraph: {
    title:
      "Labelbox Alternatives: End-to-End Data for Physical AI (2026)",
    description:
      "Labelbox has expanded into robotics data. Claru was built for it from day one. Compare both for physical AI training data.",
    type: "article",
    url: "https://claru.ai/compare/labelbox-alternatives",
    siteName: "Claru",
    images: [
      {
        url: "/images/og-v2.webp",
        width: 1200,
        height: 630,
        alt: "Labelbox Alternatives for Physical AI Training Data — Claru",
     },
    ],
 },
  twitter: {
    card: "summary_large_image",
    title: "Labelbox Alternatives: End-to-End Data for Physical AI (2026)",
    description:
      "Two approaches to robotics data: Labelbox's platform expansion vs. Claru's purpose-built pipeline. A side-by-side comparison.",
 },
  alternates: {
    canonical: "https://claru.ai/compare/labelbox-alternatives",
 },
};

// =============================================================================
// FAQ JSON-LD
// =============================================================================

const faqItems = [
  {
    question:
      "What is the main difference between Labelbox and Claru for robotics data?",
    answer:
      "Labelbox is a broad AI data platform that has expanded into robotics, offering annotation tools, an expert network (Alignerr, 1.5M+ knowledge workers), RLHF data, custom evaluations, and — more recently — robotics data collection with teleoperation capabilities and purpose-built hardware. Claru is a vertically integrated training data service built exclusively for physical AI. Claru captures real-world video through 10,000+ trained collectors, enriches every clip with depth maps, pose estimation, segmentation, and optical flow, then has expert annotators label action boundaries, grasp affordances, and manipulation intent. The key difference: Labelbox serves many AI modalities across its platform; Claru does one thing — physical AI training data — and goes deeper on enrichment and domain expertise for that specific use case.",
 },
  {
    question:
      "Does Labelbox offer robotics data capture?",
    answer:
      "Yes. As of 2026, Labelbox has expanded beyond annotation into robotics data collection. They offer video and trajectory data capture with multiple camera configurations (egocentric, overhead, wrist cameras), teleoperation setups for expert demonstrations, and AI-powered data management workflows that handle ingestion, categorization, and quality assurance. They claim over 1 petabyte of robotics data produced. This is a significant expansion from their original annotation-platform roots. The question for robotics teams is whether a platform expanding into robotics data provides the same depth of enrichment and domain specialization as a provider built exclusively for physical AI from the start.",
 },
  {
    question:
      "How does Labelbox's enrichment compare to Claru's enrichment pipeline?",
    answer:
      "Labelbox's robotics offering includes AI-powered categorization and automated quality checks on captured data, but their publicly documented enrichment focuses on annotation workflows and model-assisted labeling rather than the multi-model computational enrichment pipeline that physical AI models require as training inputs. Claru runs every clip through six automated enrichment stages: monocular depth estimation (Depth Anything V2), semantic segmentation (SAM3), human pose estimation (ViTPose 2D/3D), optical flow, and AI-generated captions. All outputs are cross-validated — depth consistency against segmentation boundaries, pose estimates against temporal smoothness. These enrichment layers are not annotation aids; they are training-ready input features delivered as aligned side-channels alongside the video.",
 },
  {
    question:
      "When should I choose Labelbox over Claru?",
    answer:
      "Choose Labelbox when you need a broad platform that serves multiple AI modalities (NLP, image, video, robotics) under one roof, when you want access to their Alignerr network of 1.5M+ knowledge workers for diverse annotation tasks, when you need custom evaluation benchmarks and arena-style model comparisons, or when your team already uses Labelbox for other AI projects and wants to consolidate vendors. Choose Claru when your work is exclusively physical AI (robotics, world models, embodied AI), when you need deep computational enrichment (depth, pose, segmentation, optical flow) on every clip, when your annotation requires physical AI domain expertise (grasp types, manipulation primitives, affordances), or when you need delivery in robotics-native formats like WebDataset, HDF5, or RLDS.",
 },
  {
    question:
      "Can I use Labelbox and Claru together?",
    answer:
      "Yes. Some teams use Claru for the data they need captured and deeply enriched — egocentric video from diverse environments, teleoperation demonstrations on specific hardware — and Labelbox for managing other annotation projects across their data portfolio. Claru delivers training-ready datasets; Labelbox manages annotation workflows. They address different parts of the data pipeline for teams that work across multiple modalities.",
 },
  {
    question:
      "What is Labelbox's Alignerr expert network?",
    answer:
      "Alignerr is Labelbox's marketplace of 1.5 million knowledge workers across 40+ countries and 200+ domains, including 50,000+ PhDs and 200,000+ Master's degree holders. The network provides human intelligence for RLHF data, custom evaluations, and annotation tasks. This is a significant workforce for broad AI tasks — NLP, reasoning, code review, multimodal evaluation. For physical AI annotation specifically (grasp types, manipulation primitives, action boundaries), the relevant question is whether general knowledge workers can reliably produce the domain-specific labels that robotics models require, regardless of their academic credentials.",
 },
  {
    question:
      "How do Labelbox and Claru compare on scale for robotics?",
    answer:
      "Labelbox claims over 1 petabyte of robotics data produced as of early 2026 and works with over 80% of leading US AI labs across all modalities. Claru has delivered 4 million+ human annotations, 500,000+ egocentric video clips, and operates 10,000+ trained data collectors across 100+ cities — focused exclusively on physical AI. Labelbox's scale is broader (they serve the entire AI industry); Claru's scale is deeper within physical AI specifically. The right comparison depends on whether your robotics data needs are better served by a larger platform with diverse capabilities or a smaller specialist with deeper enrichment and domain focus.",
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

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Labelbox Alternatives for Physical AI (2026)",
  description:
    "Labelbox is a strong annotation platform, but physical AI needs more than labeling. Compare alternatives for robotics data capture and delivery.",
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
      url: "https://claru.ai/images/og-v2.webp",
   },
 },
  datePublished: "2026-03-30",
  dateModified: "2026-03-30",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://claru.ai/compare/labelbox-alternatives",
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
      name: "Labelbox Alternatives",
      item: "https://claru.ai/compare/labelbox-alternatives",
   },
  ],
};

// =============================================================================
// COMPARISON TABLE DATA
// =============================================================================

const comparisonRows = [
  {
    dimension: "Company Focus",
    labelbox:
      "Broad AI data platform: annotation, RLHF, evaluations, robotics — serves all AI modalities",
    claru:
      "100% physical AI: robotics, world models, embodied AI — one vertical, maximum depth",
 },
  {
    dimension: "Data Capture",
    labelbox:
      "Robotics capture with teleoperation, multiple camera configs (ego, overhead, wrist), AI-powered data management; 1PB+ produced",
    claru:
      "10,000+ trained collectors with wearable cameras across 100+ cities; managed teleoperation; game-based capture at 60 FPS",
 },
  {
    dimension: "Enrichment Pipeline",
    labelbox:
      "AI-powered auto-tagging, categorization, and quality checks; model-assisted labeling for annotation efficiency",
    claru:
      "6 cross-validated layers on every clip: depth maps (Depth Anything V2), pose (ViTPose), segmentation (SAM3), optical flow, AI captions — delivered as training inputs",
 },
  {
    dimension: "Annotation Workforce",
    labelbox:
      "Alignerr network: 1.5M+ knowledge workers, 50K+ PhDs, 200+ domains — broad expertise across all AI tasks",
    claru:
      "Specialist annotators trained on physical AI: grasp types, affordances, action boundaries, manipulation intent — narrow but deep",
 },
  {
    dimension: "RLHF Capability",
    labelbox:
      "Full RLHF data pipeline for LLMs: knowledge work rubrics, tuned environments, multimodal scoring",
    claru:
      "RLHF for video and physical AI: preference ranking of video clips, robot behavior evaluation, world model outputs",
 },
  {
    dimension: "Evaluation Tools",
    labelbox:
      "Private benchmarks, arena-style model comparisons, rubric-based multimodal evaluation",
    claru:
      "Dataset datasheets with methodology documentation, cross-validation reports on enrichment quality",
 },
  {
    dimension: "Delivery Formats",
    labelbox:
      "COCO JSON, Pascal VOC, custom annotation exports; standard video formats",
    claru:
      "WebDataset, HDF5, RLDS, Parquet — robotics-native formats with aligned enrichment side-channels",
 },
  {
    dimension: "Pricing Model",
    labelbox:
      "Platform subscription plus per-project or per-task pricing; enterprise contracts available",
    claru:
      "Project-based pricing; capture + enrichment + annotation bundled; no long-term commitment required",
 },
  {
    dimension: "Best For",
    labelbox:
      "AI teams that need one platform across NLP, image, video, and robotics with a large expert network",
    claru:
      "Physical AI teams that need deep enrichment, domain-expert annotation, and robotics-native delivery",
 },
];

// =============================================================================
// PAGE
// =============================================================================

export default function LabelboxAlternativesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([faqJsonLd, articleJsonLd, breadcrumbJsonLd])}}
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
                  <span className="transition-colors">Compare</span>
                </li>
                <li aria-hidden="true" className="select-none">
                  /
                </li>
                <li aria-current="page" style={{ color: "#92B090"}}>
                  Labelbox Alternatives
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
              Labelbox Alternatives: End-to-End Training Data for
              Physical AI
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl text-white/70">
              <a
                href="https://labelbox.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#92B090"}}
                className="underline underline-offset-2"
              >
                Labelbox
              </a>{" "}
              has evolved from annotation software into a
              broad AI data factory &mdash; and they have recently
              expanded into robotics data capture and teleoperation.
              Claru was built from day one for{" "}
              <Link
                href="/physical-ai-training-data"
                style={{ color: "#92B090"}}
                className="underline underline-offset-2"
              >
                physical AI
              </Link>. This page
              compares both approaches honestly, so you can decide
              which fits your robotics program.
            </p>

            <p className="mt-4 max-w-2xl text-sm text-white/40 italic">
              Last updated: March 2026. We update this page as both
              companies evolve. If anything here is inaccurate, email{" "}
              <a
                href="mailto:contact@claru.ai"
                style={{ color: "#92B090"}}
                className="not-italic"
              >
                contact@claru.ai
              </a>
              .
            </p>
          </div>
        </section>

        {/* ── TL;DR ────────────────────────────────────────────────────── */}
        <section className="w-full py-12 md:py-16 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-6">
              TL;DR
            </h2>

            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 md:p-8 space-y-4 text-white/80 leading-relaxed">
              <p>
                <strong className="text-white">Labelbox</strong> is a
                broad AI data platform &mdash; annotation, RLHF,
                evaluations, and now robotics capture with teleoperation.
                Alignerr expert network of 1.5M+ knowledge workers, 1PB+
                robotics data produced, 80%+ of leading US AI labs as
                customers. If you need one platform across NLP, images,
                video, and robotics, Labelbox is a strong choice.
              </p>
              <p>
                <strong className="text-white">Claru</strong> does one
                thing: training data for physical AI. We capture, enrich
                (depth, pose, segmentation, optical flow), annotate
                (grasp types, action boundaries, manipulation intent),
                and deliver in robotics-native formats. Every piece of
                our infrastructure was built for physical AI from day
                one &mdash; not expanded into it.
              </p>
              <p>
                <strong className="text-white">Choose Labelbox</strong>{" "}
                when you need breadth across AI modalities and vendor
                consolidation.{" "}
                <strong className="text-white">Choose Claru</strong> when
                physical AI is your primary focus and you need maximum
                enrichment depth and domain-expert annotation.
              </p>
            </div>
          </div>
        </section>

        {/* ── Two Approaches to Robotics Data ────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Two Approaches to Robotics Training Data
            </h2>

            <div className="prose-custom space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                <a
                  href="https://labelbox.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#92B090"}}
                  className="underline underline-offset-2"
                >
                  Labelbox
                </a>{" "}
                started as an annotation platform and has
                steadily expanded. They now offer RLHF data for
                LLMs, custom model evaluations, an expert network of
                1.5 million knowledge workers (Alignerr), and &mdash;
                most recently &mdash; robotics data collection with
                teleoperation capabilities and purpose-built
                hardware. They claim over 1 petabyte of robotics data
                produced and partnerships with over 80% of leading US
                AI labs.
              </p>

              <p>
                Claru took the opposite approach. Instead of building
                a broad platform and expanding into robotics,{" "}
                <Link
                  href="/about"
                  style={{ color: "#92B090"}}
                  className="underline underline-offset-2"
                >
                  Claru was purpose-built for physical AI from the start
                </Link>.
                Every piece of infrastructure &mdash; the{" "}
                <Link
                  href="/egocentric-video-datasets"
                  style={{ color: "#92B090"}}
                  className="underline underline-offset-2"
                >
                  collector network
                </Link>, the enrichment pipeline, the annotation
                workforce, the delivery formats &mdash; was designed
                for the specific requirements of{" "}
                <Link
                  href="/training-data-for-robotics"
                  style={{ color: "#92B090"}}
                  className="underline underline-offset-2"
                >
                  robotics
                </Link>, world
                models, and{" "}
                <Link
                  href="/embodied-ai-datasets"
                  style={{ color: "#92B090"}}
                  className="underline underline-offset-2"
                >
                  embodied AI
                </Link>. Nothing else.
              </p>

              <p>
                This is the classic{" "}
                <strong className="text-white">
                  platform vs. specialist
                </strong>{" "}
                tradeoff. Labelbox gives you breadth: one vendor for
                NLP, images, video, evaluations, and robotics. Claru
                gives you depth: one vendor that does physical AI
                training data and goes deeper on enrichment, domain
                expertise, and robotics-native delivery than a
                multi-purpose platform can.
              </p>

              <p>
                Neither approach is inherently better. As the demand
                for physical AI data grows &mdash; fueled by initiatives
                like{" "}
                <a
                  href="https://www.nvidia.com/en-us/ai/physical-ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#92B090"}}
                  className="underline underline-offset-2"
                >
                  NVIDIA Isaac and physical AI
                </a>{" "}
                and large-scale research projects such as{" "}
                <a
                  href="https://ego4d-data.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#92B090"}}
                  className="underline underline-offset-2"
                >
                  Ego4D
                </a>{" "}
                &mdash; the right
                choice depends on your team&apos;s specific needs,
                data portfolio, and where your bottleneck actually
                sits.
              </p>
            </div>
          </div>
        </section>

        {/* ── Where the Approaches Diverge ────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Where the Approaches Diverge for Physical AI
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Both companies can capture robotics data and annotate
              it. The differences are in enrichment depth,
              annotation specialization, and delivery infrastructure.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Enrichment as Training Inputs",
                  description:
                    "Labelbox's robotics offering includes AI-powered auto-tagging, categorization, and quality checks. Claru runs every clip through six cross-validated enrichment models: depth estimation (Depth Anything V2, validated against LiDAR), pose estimation (ViTPose 2D/3D), semantic segmentation (SAM3), optical flow, and AI-generated captions. These are not annotation aids — they are training-ready input features delivered as aligned side-channels that robotics models consume directly during training.",
               },
                {
                  title: "Annotation Domain Depth",
                  description:
                    "Labelbox's Alignerr network spans 200+ domains with 1.5M+ workers — excellent breadth for diverse AI tasks. Claru's annotators are trained specifically on physical AI: grasp type classification (power, precision, lateral, hook), action boundary annotation with sub-second temporal precision, object affordance labeling, and intent inference. The tradeoff is breadth vs. depth in a specific domain.",
               },
                {
                  title: "Robotics-Native Delivery",
                  description:
                    "Labelbox exports annotations in COCO JSON, Pascal VOC, and custom formats — standard for image annotation workflows. Claru delivers in the formats robotics pipelines actually consume: WebDataset for streaming training, HDF5 for dense trajectories, RLDS for reinforcement learning, Parquet for metadata. Every delivery includes enrichment layers as aligned side-channels, so there is no format conversion overhead.",
               },
                {
                  title: "Capture Network Architecture",
                  description:
                    "Labelbox offers robotics capture with teleoperation setups and multiple camera configurations. Claru operates three parallel capture pipelines: wearable camera networks (10,000+ contributors, 100+ cities), managed teleoperation on client-specific hardware, and game-based capture producing interaction data with perfect action labels at 60 FPS. Claru's capture network predates their enrichment and annotation — it was the starting point, not an expansion.",
               },
              ].map((card) => (
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

        {/* ── Comparison Table ────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Labelbox vs. Claru: Side-by-Side Comparison
            </h2>
            <p className="text-white/70 mb-10 text-lg max-w-4xl">
              An honest comparison across the dimensions that matter
              for physical AI and robotics teams. Both companies have
              real capabilities &mdash; the question is which
              architecture fits your needs.
            </p>

            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50 min-w-[140px]">
                      Dimension
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50 min-w-[220px]">
                      Labelbox
                    </th>
                    <th
                      className="px-4 py-3 font-mono text-xs uppercase tracking-wider min-w-[220px]"
                      style={{ color: "#92B090"}}
                    >
                      Claru
                    </th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  {comparisonRows.map((row, i) => (
                    <tr
                      key={row.dimension}
                      className={
                        i % 2 === 0
                          ? "bg-transparent"
                          : "bg-white/[0.02]"
                     }
                    >
                      <td className="px-4 py-3 font-medium text-white align-top">
                        {row.dimension}
                      </td>
                      <td className="px-4 py-3 align-top">
                        {row.labelbox}
                      </td>
                      <td
                        className="px-4 py-3 align-top"
                        style={{ color: "rgba(146,176,144,0.9)"}}
                      >
                        {row.claru}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── When Labelbox Is the Right Choice ──────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              When Labelbox Is the Right Choice
            </h2>

            <div className="prose-custom space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Labelbox is a strong company with real capabilities.
                If your project fits these profiles, they may be the
                better choice:
              </p>

              <ul className="space-y-4 list-none pl-0">
                {[
                  {
                    title: "You need one platform for multiple AI modalities",
                    desc: "If your team works on NLP, image classification, video, and robotics data — and you want one vendor and one set of tooling across all of them — Labelbox's breadth is a genuine advantage. Consolidating vendors reduces integration overhead.",
                 },
                  {
                    title: "You want access to a massive expert network",
                    desc: "Labelbox's Alignerr network of 1.5M+ knowledge workers across 200+ domains is a significant asset for diverse annotation tasks. If you need PhD-level annotators for scientific, medical, or reasoning tasks alongside your robotics work, this breadth matters.",
                 },
                  {
                    title: "You need custom model evaluations",
                    desc: "Labelbox offers private benchmarks, arena-style model comparisons, and rubric-based multimodal scoring. If model evaluation is a core part of your workflow, this capability is built into their platform.",
                 },
                  {
                    title: "You need RLHF data for language models",
                    desc: "Labelbox provides full RLHF data pipelines with knowledge work rubrics and tuned environments. If your team trains both LLMs and robotics models, having RLHF and robotics data from one vendor simplifies procurement.",
                 },
                  {
                    title: "You already use Labelbox for other projects",
                    desc: "If your organization has existing Labelbox workflows, expanding into their robotics offering avoids the overhead of onboarding a new vendor. Familiarity and existing contracts reduce friction.",
                 },
                ].map((item) => (
                  <li
                    key={item.title}
                    className="border-l-2 pl-5"
                    style={{ borderColor: "rgba(255,255,255,0.2)"}}
                  >
                    <strong className="text-white">
                      {item.title}.
                    </strong>{" "}
                    {item.desc}
                  </li>
                ))}
              </ul>

              <p>
                If breadth across modalities and vendor consolidation
                are your priorities, Labelbox is a legitimate
                option.
              </p>
            </div>
          </div>
        </section>

        {/* ── When You Need a Specialist ──────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              When You Need a Physical AI Specialist
            </h2>

            <div className="prose-custom space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                The case for a specialist becomes clear when your
                project requires depth that a multi-purpose platform
                may not match. If any of these describe your
                situation, a purpose-built provider like Claru is
                worth evaluating.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Your models need enrichment as input features",
                  description:
                    "Robotics models consume depth maps, pose estimation, segmentation masks, and optical flow as training inputs — not just annotations on top of video. Claru's six-stage enrichment pipeline produces these signals at scale, cross-validates them for physical consistency, and delivers them as aligned side-channels. This is not auto-tagging for annotation efficiency — it is computational enrichment that becomes part of the training data itself.",
               },
                {
                  title: "Your annotation needs domain-specific physical AI expertise",
                  description:
                    "Action boundary annotation with sub-second precision, grasp type classification following robotics taxonomies, object affordance labeling, and manipulation intent inference. These tasks require annotators who understand physical manipulation — not general knowledge workers, regardless of their academic credentials. Claru trains annotators specifically on these tasks with guidelines co-developed with each client's ML team.",
               },
                {
                  title: "You need robotics-native delivery formats",
                  description:
                    "Your training pipeline expects WebDataset for streaming, HDF5 for dense trajectories, RLDS for reinforcement learning, or Parquet for metadata queries — with enrichment layers as aligned side-channels. Generic annotation exports in COCO JSON or CSV require significant post-processing. Claru delivers in the formats your training code already reads.",
               },
                {
                  title: "You want a global wearable camera network for egocentric capture",
                  description:
                    "Claru's 10,000+ trained contributors across 100+ cities capture egocentric video in real kitchens, workshops, warehouses, and outdoor spaces using wearable cameras. This network was built from the start for physical AI data capture — not retrofitted from an annotation platform. If egocentric video from diverse real-world environments is what your model needs, this is a core capability.",
               },
                {
                  title: "Speed on custom physical AI datasets",
                  description:
                    "Claru scopes and delivers pilot datasets in days, not weeks. If you need a specific dataset (manipulation demonstrations in a particular environment, egocentric video of a particular task) captured, enriched, annotated, and delivered on a tight timeline, a specialist that owns the entire pipeline can move faster than a platform coordinating across multiple product lines.",
               },
                {
                  title: "Physical AI is your only data need",
                  description:
                    "If you are a robotics company and physical AI training data is the only data you buy externally, you do not need a multi-purpose platform. You need a partner whose entire organization — engineering, operations, annotation workforce — is optimized for your specific use case. You are paying for focus, not breadth.",
               },
              ].map((card) => (
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

        {/* ── Claru's Pipeline ───────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Claru&apos;s Pipeline: Built for Physical AI from Day One
            </h2>
            <p className="text-white/70 mb-12 text-lg">
              Claru was not an annotation platform that added
              robotics. It was built as a physical AI data service
              from the start. Here is how the pipeline works.
            </p>

            <div className="space-y-12">
              {[
                {
                  step: "01",
                  title: "Capture",
                  content:
                    "Three parallel acquisition pipelines run continuously. Wearable camera capture deploys 10,000+ trained contributors with GoPro cameras across kitchens, workshops, warehouses, retail environments, and outdoor spaces in 100+ cities worldwide. Managed teleoperation coordinates demonstrations on client-specific robot hardware (Franka, UR5, custom rigs) with trained operators following structured task protocols. Game-based capture uses custom environments that log synchronized video and control inputs at 60 FPS, producing interaction data with perfect action labels.",
               },
                {
                  step: "02",
                  title: "Enrich",
                  content:
                    "Every clip passes through a multi-model enrichment pipeline. Monocular depth estimation (Depth Anything V2) generates per-frame depth maps. Semantic segmentation (SAM3) labels every pixel with object class and instance identity. Human pose estimation (ViTPose) extracts 2D and 3D joint positions for hand-object interaction analysis. Optical flow computes dense motion fields between frames. AI-generated captions provide natural language descriptions. All outputs are cross-validated: depth against segmentation boundaries, pose against temporal smoothness. These enrichment layers are training inputs, not annotation aids.",
               },
                {
                  step: "03",
                  title: "Annotate",
                  content:
                    "Expert annotators trained on physical AI add labels automated systems cannot reliably produce. Action boundary annotation marks discrete actions (reach, grasp, lift, transport, place) with sub-second precision. Object affordance labels identify graspable surfaces, support structures, and obstacles. Grasp type classification follows established robotics taxonomies. Intent annotation captures what the person is trying to achieve. Quality scoring flags problematic clips. Every project uses guidelines co-developed with the client's ML team.",
               },
                {
                  step: "04",
                  title: "Deliver",
                  content:
                    "Datasets ship in robotics-native formats. WebDataset for streaming training. HDF5 for dense trajectories. RLDS for reinforcement learning. Parquet for metadata queries. Every delivery includes enrichment layers as aligned side-channels, a manifest with checksums, and a datasheet documenting collection methodology, annotator demographics, known limitations, and intended use cases. Data delivered via S3, GCS, or direct cloud integration.",
               },
              ].map((phase) => (
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

        {/* ── The Enrichment Difference ──────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              The Enrichment Difference: Auto-Tagging vs. Training
              Inputs
            </h2>

            <div className="prose-custom space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Both Labelbox and Claru use AI models in their
                pipelines. But the purpose is different, and the
                distinction matters for robotics teams.
              </p>

              <p>
                <strong className="text-white">
                  Labelbox&apos;s AI in the pipeline
                </strong>{" "}
                focuses on annotation efficiency: auto-tagging
                environments, objects, and tasks; categorizing data
                for project management; identifying collection gaps;
                quality checking annotations. This makes their human
                annotation workflow faster and more consistent.
              </p>

              <p>
                <strong className="text-white">
                  Claru&apos;s enrichment pipeline
                </strong>{" "}
                produces data that becomes part of the training
                dataset itself. Depth maps from{" "}
                <a
                  href="https://depth-anything-v2.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#92B090"}}
                  className="underline underline-offset-2"
                >
                  Depth Anything V2
                </a>{" "}
                are
                not metadata tags &mdash; they are per-frame geometric
                representations that a VLA model uses to understand
                3D scene structure. Pose estimates from ViTPose are
                not annotation aids &mdash; they are training inputs
                that teach manipulation policies about human body
                kinematics. Segmentation masks from SAM3 are not
                categorization &mdash; they are pixel-level object
                identity that enables instance-level reasoning.
              </p>

              <p>
                The question is: does your model need enrichment
                layers as training inputs, or does your annotation
                workflow need AI assistance? If the former, the
                enrichment pipeline architecture matters more than the
                annotation platform.
              </p>
            </div>
          </div>
        </section>

        {/* ── Proof Points ──────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-10">
              Claru by the Numbers
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  stat: "4M+",
                  label: "Human annotations",
                  context:
                    "across egocentric video, game environments, manipulation data, and custom captures",
               },
                {
                  stat: "500K+",
                  label: "Egocentric clips",
                  context:
                    "from real kitchens, workshops, warehouses, and outdoor environments worldwide",
               },
                {
                  stat: "10,000+",
                  label: "Global contributors",
                  context:
                    "trained data collectors with wearable cameras across 100+ cities",
               },
                {
                  stat: "Days",
                  label: "Brief to delivery",
                  context:
                    "pilot datasets scoped and delivered in under a week, not months",
               },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-5"
                >
                  <div
                    className="text-3xl md:text-4xl font-bold font-mono mb-1"
                    style={{ color: "#92B090"}}
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

        {/* ── Other Alternatives ─────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Other Labelbox Alternatives Worth Considering
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Depending on your specific needs, these other providers
              may also be relevant.
            </p>

            <div className="space-y-8">
              {[
                {
                  name: "Scale AI",
                  type: "Enterprise labeling",
                  description:
                    "Scale AI is an enterprise data labeling service with a massive annotation workforce. Like Labelbox, they have expanded beyond pure annotation — but their core remains high-volume labeling for NLP, image, and autonomous vehicle data. Strengths: proven at enterprise scale, strong quality controls, large workforce. Weaknesses: enterprise pricing with long contracts, generalist rather than specialist for physical AI. Best when you need high-volume annotation on existing data with managed quality.",
                  link: "/compare/scale-ai-alternatives",
                  linkText: "See our Scale AI comparison",
               },
                {
                  name: "Surge AI",
                  type: "Expert annotation",
                  description:
                    "Surge AI provides expert human annotation through a curated workforce, focused on quality over volume. Strengths: high annotation quality, strong on RLHF and NLP tasks, vetted annotators. Weaknesses: annotation-only (no capture or enrichment), NLP-focused, limited video capabilities. Best for LLM training data where annotation quality matters more than modality specialization.",
                  link: "/compare/surge-ai-alternatives",
                  linkText: "See our Surge AI comparison",
               },
                {
                  name: "Appen",
                  type: "Crowd labeling",
                  description:
                    "Appen is one of the original crowd-sourced data labeling companies. Strengths: massive global workforce, linguistic diversity, broad task coverage. Weaknesses: quality has declined in recent years, no physical AI specialization. Best for high-volume multilingual NLP projects.",
                  link: "/compare/appen-alternatives",
                  linkText: "See our Appen comparison",
               },
                {
                  name: "Luel (YC W26)",
                  type: "Data marketplace",
                  description:
                    "Luel is a two-sided marketplace for rights-cleared multimodal data. Strengths: fast access to licensed footage, rights management built in. Weaknesses: no enrichment pipeline, no custom capture. Best for teams that need raw licensed video and handle enrichment in-house.",
                  link: "/compare/claru-vs-luel",
                  linkText: "See our Luel comparison",
               },
                {
                  name: "CVAT",
                  type: "Open-source platform",
                  description:
                    "Computer Vision Annotation Tool — an open-source annotation platform originally from Intel. Free to self-host with strong video annotation features. Strengths: no licensing cost, flexible, active community. Weaknesses: self-hosted (requires DevOps), no data capture, no enrichment, no managed workforce. Best for teams that want full control over annotation tooling and have engineering resources to maintain it.",
               },
                {
                  name: "V7 (Darwin)",
                  type: "Annotation platform",
                  description:
                    "V7 offers AI-native annotation tooling with strong auto-labeling. Similar scope to Labelbox's original annotation platform, with emphasis on model-in-the-loop labeling. Strengths: modern auto-labeling, good for medical imaging and manufacturing. Weaknesses: platform-only (no data capture or deep enrichment), not specialized for robotics. Best for teams working on visual AI where auto-annotation accelerates throughput.",
               },
              ].map((alt) => (
                <div
                  key={alt.name}
                  className="border-l-2 pl-6"
                  style={{ borderColor: "rgba(146,176,144,0.4)"}}
                >
                  <div className="flex items-baseline gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {alt.name}
                    </h3>
                    <span
                      className="text-xs font-mono px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: "rgba(146,176,144,0.15)",
                        color: "#92B090",
                     }}
                    >
                      {alt.type}
                    </span>
                  </div>
                  <p className="text-white/70 leading-relaxed">
                    {alt.description}
                  </p>
                  {"link" in alt && alt.link && (
                    <Link
                      href={alt.link}
                      className="inline-block mt-2 text-sm font-medium transition-colors"
                      style={{ color: "#92B090"}}
                    >
                      {alt.linkText} &rarr;
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Making the Decision ────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              How to Decide: Platform Breadth vs. Specialist Depth
            </h2>

            <div className="prose-custom space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                The decision comes down to your team&apos;s data
                portfolio and where you need the most depth.
              </p>

              <p>
                <strong className="text-white">
                  Choose Labelbox if:
                </strong>{" "}
                You work across multiple AI modalities (NLP, image,
                video, robotics) and want one platform and one vendor
                relationship. You value the Alignerr expert network
                for diverse tasks. You need model evaluation
                capabilities alongside data. Your robotics data
                needs are one part of a broader AI data strategy.
              </p>

              <p>
                <strong className="text-white">
                  Choose Claru if:
                </strong>{" "}
                Physical AI is your primary or exclusive focus. You
                need deep computational enrichment (depth, pose,
                segmentation, optical flow) delivered as training
                inputs. Your annotation tasks require
                robotics-specific domain expertise. You want delivery
                in robotics-native formats with enrichment
                side-channels. You need fast turnaround on custom
                physical AI datasets.
              </p>

              <p>
                <strong className="text-white">
                  Use both if:
                </strong>{" "}
                Your organization has diverse AI data needs. Use
                Labelbox for NLP, RLHF, evaluations, and
                general-purpose annotation. Use Claru for physical AI
                data where enrichment depth, domain-expert
                annotation, and robotics-native delivery make the
                difference. Many teams use multiple data partners —
                the right architecture depends on where each type of
                data comes from.
              </p>
            </div>
          </div>
        </section>

        {/* ── Related Resources ──────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Related Solutions and Resources
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  href: "/training-data-for-robotics",
                  title: "Training Data for Robotics",
                  desc: "Purpose-built datasets for robot learning: egocentric video, manipulation, teleoperation.",
               },
                {
                  href: "/physical-ai-training-data",
                  title: "Physical AI Training Data",
                  desc: "Real-world datasets for models that understand physics and embodiment.",
               },
                {
                  href: "/egocentric-video-datasets",
                  title: "Egocentric Video Datasets",
                  desc: "First-person video capture from 10,000+ contributors worldwide.",
               },
                {
                  href: "/embodied-ai-datasets",
                  title: "Embodied AI Datasets",
                  desc: "Grounded, multi-modal datasets for agents that act in the physical world.",
               },
                {
                  href: "/compare/scale-ai-alternatives",
                  title: "Scale AI Alternatives",
                  desc: "Specialized training data providers for physical AI teams.",
               },
                {
                  href: "/compare/surge-ai-alternatives",
                  title: "Surge AI Alternatives",
                  desc: "Beyond NLP annotation: end-to-end data for robotics and world models.",
               },
                {
                  href: "/compare/appen-alternatives",
                  title: "Appen Alternatives",
                  desc: "Crowd labeling vs. physical AI specialization for robotics data.",
               },
                {
                  href: "/compare/claru-vs-luel",
                  title: "Claru vs Luel",
                  desc: "Marketplace raw data vs. end-to-end enriched physical AI data.",
               },
                {
                  href: "/about",
                  title: "About Claru",
                  desc: "Meet the Moonvalley co-founders building physical AI data infrastructure.",
               },
                {
                  href: "/case-studies",
                  title: "Case Studies",
                  desc: "Real project outcomes with metrics and methodology documentation.",
               },
                {
                  href: "/data-catalog",
                  title: "Browse the Data Catalog",
                  desc: "Explore 100+ licensed datasets across robotics, video, and multimodal AI.",
               },
                {
                  href: "/solutions",
                  title: "All Solutions",
                  desc: "Custom data pipelines for acquisition, enrichment, annotation, and validation.",
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
                      style={{ color: "#92B090"}}
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

        {/* ── FAQ ────────────────────────────────────────────────────── */}
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

        {/* ── CTA ────────────────────────────────────────────────────── */}
        <section className="w-full py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Need Training Data for Physical AI?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Tell us what your model needs to learn. We will scope
              the dataset, define the collection protocol, and deliver
              training-ready data &mdash; from capture through expert
              annotation.
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
