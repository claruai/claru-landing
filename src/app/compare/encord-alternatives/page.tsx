import type { Metadata} from "next";
import Link from "next/link";
import GeoPageShell from "@/app/components/content/GeoPageShell";

// =============================================================================
// META
// =============================================================================

export const metadata: Metadata = {
  title:
    "Encord Alternatives for Physical AI Training Data (2026) | Claru",
  description:
    "Encord builds a broad physical AI data platform. Claru delivers training-ready data as a service. Compare platform vs. service for robotics, drones, and embodied AI.",
  keywords: [
    "Encord alternative",
    "Encord alternatives",
    "Encord competitor",
    "Encord vs Claru",
    "Encord for robotics",
    "Encord physical AI",
    "physical AI training data",
    "robotics data annotation",
    "robotics data platform",
    "annotation platform vs data service",
    "AI data infrastructure",
    "physical AI data pipeline",
  ],
  openGraph: {
    title:
      "Encord Alternatives: Training-Ready Data for Physical AI (2026)",
    description:
      "Encord is building a physical AI data platform. Claru delivers training-ready physical AI data as a service. Compare both approaches for robotics and embodied AI.",
    type: "article",
    url: "https://claru.ai/compare/encord-alternatives",
    siteName: "Claru",
    images: [
      {
        url: "/images/og-v2.webp",
        width: 1200,
        height: 630,
        alt: "Encord Alternatives for Physical AI Training Data — Claru",
     },
    ],
 },
  twitter: {
    card: "summary_large_image",
    title: "Encord Alternatives: Training-Ready Data for Physical AI (2026)",
    description:
      "Platform vs. service for physical AI data. Encord gives you tools to build your own pipeline. Claru delivers training-ready datasets. A side-by-side comparison.",
 },
  alternates: {
    canonical: "https://claru.ai/compare/encord-alternatives",
 },
};

// =============================================================================
// FAQ JSON-LD
// =============================================================================

const faqItems = [
  {
    question:
      "What is the main difference between Encord and Claru for physical AI data?",
    answer:
      "Encord is a data infrastructure platform — it provides software tools for AI teams to manage, curate, annotate, and evaluate their own data. Teams bring their own data, their own annotators or use Encord's workflows, and build their pipeline on top of Encord's tooling. Claru is a data service — it captures real-world video through 10,000+ trained collectors, enriches every clip with depth maps, pose estimation, segmentation, and optical flow, has expert annotators label action boundaries and affordances, and delivers training-ready datasets in robotics-native formats. The core difference is platform (tools to build your own pipeline) vs. service (training-ready data delivered to you).",
 },
  {
    question:
      "Does Encord capture physical AI data or is it annotation-only?",
    answer:
      "Encord is a software platform, not a data capture service. Teams using Encord bring their own data — video, LiDAR point clouds, sensor data, images — and use Encord's tools to manage, curate, annotate, and evaluate that data. Encord does not operate a data collection network or capture video on your behalf. Claru operates the full pipeline: 10,000+ contributors with wearable cameras across 100+ cities capture egocentric video, managed teleoperation records demonstrations on specific robot hardware, and game-based capture produces interaction data at 60 FPS. If you already have data and need better tooling, Encord is strong. If you need data captured and delivered, that is what Claru does.",
 },
  {
    question:
      "How does Encord's data volume (5PB+) compare to Claru's scale?",
    answer:
      "Encord reports 5+ petabytes of data on its platform as of early 2026 — this represents data that Encord's customers have uploaded and processed through the platform, not data that Encord captured or owns. Encord serves 300+ AI teams globally, including Woven by Toyota and Skydio. Claru has delivered 3.7 million+ human annotations, 500,000+ egocentric video clips, and operates 10,000+ trained data collectors across 100+ cities — focused exclusively on physical AI. The numbers measure different things: Encord measures data processed through its software; Claru measures data captured, enriched, annotated, and delivered as a service.",
 },
  {
    question:
      "When should I choose Encord over Claru for robotics data?",
    answer:
      "Choose Encord when your team already has large volumes of physical AI data (from your own robots, vehicles, or drones) and needs better tooling to manage, curate, annotate, and evaluate it. Encord's platform supports 2D, 3D, LiDAR, radar, video, and sensor fusion with built-in QA, version control, and model evaluation workflows. Choose Claru when you need training data delivered — when you do not yet have the data, when you need deep enrichment (depth, pose, segmentation, optical flow) as training inputs, or when you need expert annotators trained on physical AI tasks like grasp types and action boundaries. Many teams use both: Encord for managing their internal data pipeline, Claru for sourcing and delivering new training data.",
 },
  {
    question:
      "Can I use Encord and Claru together?",
    answer:
      "Yes. The platform-vs-service distinction means they address different parts of the data lifecycle. Some teams use Claru to capture, enrich, and annotate new datasets, then import those datasets into Encord's platform for ongoing curation, model evaluation, and active learning workflows. Encord manages the data pipeline; Claru fills the pipeline with training-ready physical AI data. This is a common pattern for teams that have both internal data (managed via Encord) and external data needs (sourced via Claru).",
 },
  {
    question:
      "How does Encord's annotation tooling compare to Claru's enrichment pipeline?",
    answer:
      "Encord offers AI-assisted annotation with human-in-the-loop workflows, claiming up to 3x faster labeling and 6x faster video annotation. Their tools include embedding-based curation, natural language search, model-assisted labeling, and quality assurance workflows. These are annotation productivity tools — they help human annotators work faster. Claru's enrichment pipeline produces computational training inputs that are not annotations at all: depth maps from Depth Anything V2, segmentation masks from SAM3, pose estimation from ViTPose, and optical flow from RAFT. These outputs are delivered as aligned side-channels that models consume directly during training. One improves annotation throughput; the other produces training-ready input features.",
 },
  {
    question:
      "What is Encord's pricing model compared to Claru's?",
    answer:
      "Encord offers a software platform with tiered pricing — typically a subscription or enterprise license based on data volume, users, and features. Teams pay for the platform and then use their own resources (or Encord's workflows) for annotation. Claru uses project-based pricing that bundles capture, enrichment, and annotation into a single deliverable. There are no platform fees, no long-term commitments, and no separate charges for enrichment layers. The cost models reflect the difference: Encord is a tool you operate; Claru is a service that delivers output.",
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
// ARTICLE JSON-LD
// =============================================================================

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Encord Alternatives for Physical AI Training Data (2026)",
  description:
    "Encord builds a broad physical AI data platform. Claru delivers training-ready data as a service. Compare platform vs. service for robotics, drones, and embodied AI.",
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
    "@id": "https://claru.ai/compare/encord-alternatives",
 },
};

// =============================================================================
// BREADCRUMB JSON-LD
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
      name: "Compare",
      item: "https://claru.ai/compare",
   },
    {
      "@type": "ListItem",
      position: 3,
      name: "Encord Alternatives",
      item: "https://claru.ai/compare/encord-alternatives",
   },
  ],
};

// =============================================================================
// COMPARISON TABLE DATA
// =============================================================================

const comparisonRows = [
  {
    dimension: "Business Model",
    encord:
      "Software platform — tools for teams to manage, curate, annotate, and evaluate their own data",
    claru:
      "Data service — captures, enriches, annotates, and delivers training-ready datasets end-to-end",
 },
  {
    dimension: "Data Capture",
    encord:
      "No capture — teams bring their own data (video, LiDAR, sensor, images) to the platform",
    claru:
      "10,000+ trained collectors with wearable cameras across 100+ cities; managed teleoperation; game-based capture at 60 FPS",
 },
  {
    dimension: "Annotation Tooling",
    encord:
      "AI-assisted HITL workflows, up to 3x faster labeling, 6x faster video annotation, embedding-based curation, model-assisted labeling",
    claru:
      "Expert annotators trained on physical AI: grasp types, affordances, action boundaries, manipulation intent — project-specific guidelines co-developed with client ML teams",
 },
  {
    dimension: "Enrichment",
    encord:
      "Natural language search, embedding-based filtering, auto-tagging for annotation productivity — tools to help annotators work faster",
    claru:
      "6 cross-validated layers on every clip: depth maps (Depth Anything V2), pose (ViTPose), segmentation (SAM3), optical flow (RAFT), AI captions — delivered as training inputs",
 },
  {
    dimension: "Data Modalities",
    encord:
      "2D, 3D, LiDAR, radar, video, medical imaging, audio, sensor fusion — broad multimodal support",
    claru:
      "Video, egocentric video, teleoperation recordings, manipulation sequences, game-based capture — 100% physical AI focused",
 },
  {
    dimension: "Model Evaluation",
    encord:
      "RLHF, rubric-based evaluation, pairwise comparison, embedding-based edge case discovery, active learning integration",
    claru:
      "Dataset datasheets with methodology documentation, cross-validation reports on enrichment quality, per-clip quality scoring",
 },
  {
    dimension: "Scale / Customers",
    encord:
      "5PB+ data on platform, 300+ physical AI teams, Woven by Toyota, Skydio, Zipline; $110M total raised at $550M valuation",
    claru:
      "3.7M+ human annotations, 500K+ egocentric clips, 10,000+ collectors across 100+ cities; 5+ frontier lab partnerships",
 },
  {
    dimension: "Delivery Formats",
    encord:
      "COCO, Pascal VOC, custom annotation exports; data stays on platform or exports via API",
    claru:
      "WebDataset, HDF5, RLDS, Parquet — robotics-native formats with aligned enrichment side-channels; S3/GCS delivery",
 },
  {
    dimension: "Pricing Model",
    encord:
      "Platform subscription — tiered by data volume, users, and features; enterprise contracts available",
    claru:
      "Project-based pricing — capture + enrichment + annotation bundled; no platform fees, no long-term commitment required",
 },
  {
    dimension: "Best For",
    encord:
      "Teams with existing data that need better tooling for annotation, curation, QA, and evaluation workflows",
    claru:
      "Teams that need training-ready physical AI data delivered — capture, enrichment, annotation, and format conversion included",
 },
];

// =============================================================================
// PAGE
// =============================================================================

export default function EncordAlternativesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([faqJsonLd, articleJsonLd, breadcrumbJsonLd]),
       }}
      />

      <GeoPageShell>
        {/* -- Hero --------------------------------------------------------- */}
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
                  <a
                    href="/"
                    className="transition-colors hover:text-white"
                  >
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
                <li aria-current="page" style={{ color: "#92B090"}}>
                  Encord Alternatives
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
              Encord Alternatives: Training-Ready Data for Physical AI
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl text-white/70">
              <a
                href="https://encord.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#92B090"}}
                className="underline underline-offset-2"
              >
                Encord
              </a>{" "}
              is building a broad{" "}
              <Link
                href="/physical-ai-training-data"
                style={{ color: "#92B090"}}
                className="underline underline-offset-2"
              >
                physical AI
              </Link>{" "}
              data platform &mdash; software tools for managing, curating,
              annotating, and evaluating data. Claru is a physical AI data
              service &mdash; we capture, enrich, annotate, and deliver
              training-ready datasets. Platform vs. service. This page
              compares both approaches so you can decide which fits your
              team.
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

        {/* -- TL;DR -------------------------------------------------------- */}
        <section className="w-full py-12 md:py-16 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-6">
              TL;DR
            </h2>

            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 md:p-8 space-y-4 text-white/80 leading-relaxed">
              <p>
                <strong className="text-white">Encord</strong> is a
                well-funded ($110M raised, $550M valuation) data
                infrastructure platform for physical AI. They give you
                tools to manage, curate, annotate, and evaluate your own
                data &mdash; 2D, 3D, LiDAR, video, sensor fusion. 300+
                AI teams use the platform, including Woven by Toyota and
                Skydio. If you want to build your own data pipeline with
                best-in-class tooling, Encord is strong.
              </p>
              <p>
                <strong className="text-white">Claru</strong> is a
                physical AI data service. We capture real-world video
                through 10,000+ trained collectors, enrich every clip
                with depth maps, pose estimation, segmentation, and
                optical flow, and have expert annotators label intent,
                affordances, and edge cases. We deliver training-ready
                datasets in{" "}
                <Link
                  href="/training-data-for-robotics"
                  style={{ color: "#92B090"}}
                  className="underline underline-offset-2"
                >
                  robotics-native formats
                </Link>
                . If you want data delivered, that is what we do.
              </p>
              <p>
                The question is:{" "}
                <strong className="text-white">
                  do you need tools to process data you already have, or do
                  you need training-ready data delivered?
                </strong>{" "}
                If the former, evaluate Encord. If the latter, talk to us.
                Many teams use both.
              </p>
            </div>
          </div>
        </section>

        {/* -- Platform vs. Service ----------------------------------------- */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Platform vs. Service: Two Models for Physical AI Data
            </h2>

            <div className="prose-custom space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                <a
                  href="https://encord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#92B090"}}
                  className="underline underline-offset-2"
                >
                  Encord
                </a>{" "}
                was founded by Ulrik Stig Hansen and Eric Landau, who saw
                a growing gap between advanced AI models and the
                fragmented, manual data infrastructure teams depended on.
                Their answer was a unified platform that consolidates data
                management, curation, annotation, and evaluation into one
                toolchain. In February 2026, they raised a{" "}
                <a
                  href="https://siliconangle.com/2026/02/26/physical-ai-data-infrastructure-startup-encord-lands-60m-accelerate-intelligent-robot-drone-development/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#92B090"}}
                  className="underline underline-offset-2"
                >
                  $60M Series C
                </a>{" "}
                led by Wellington Management at a $550M valuation,
                bringing total funding to $110M. As co-CEO Hansen put it:
                &ldquo;You can have the most sophisticated model in the
                world, but it will still fail if the data feeding it is
                incomplete.&rdquo;
              </p>

              <p>
                Claru took a different approach.{" "}
                <Link
                  href="/about"
                  style={{ color: "#92B090"}}
                  className="underline underline-offset-2"
                >
                  Our founders
                </Link>{" "}
                built the licensed data infrastructure at Moonvalley
                ($154M raised) and saw that physical AI teams did not
                just need better tooling &mdash; they needed someone to
                build the dataset for them. Most robotics startups do
                not have 50-person annotation ops teams. They have ML
                researchers who want training data delivered so they can
                focus on model development. Claru is that delivery
                mechanism: we capture, enrich, annotate, and ship.
              </p>

              <p>
                This is{" "}
                <strong className="text-white">
                  platform vs. service
                </strong>
                , and neither model is inherently better. Encord gives
                you infrastructure to operate your own data pipeline at
                scale. Claru takes the data problem off your plate
                entirely. The right choice depends on your team&apos;s
                structure, your existing data assets, and where your
                bottleneck actually sits.
              </p>

              <p>
                The{" "}
                <a
                  href="https://www.nvidia.com/en-us/ai/physical-ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#92B090"}}
                  className="underline underline-offset-2"
                >
                  physical AI market
                </a>{" "}
                is projected to exceed $30 billion annually, with over
                400 million intelligent robots expected to come online in
                the next four years. Both platform and service models
                will be needed to meet that demand. The question is which
                model matches your team&apos;s current needs.
              </p>
            </div>
          </div>
        </section>

        {/* -- Where the Approaches Diverge --------------------------------- */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Where the Approaches Diverge for Physical AI
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Encord and Claru both serve physical AI teams, but the
              overlap is smaller than it appears. Here are the key
              architectural differences.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Data Capture vs. Data Management",
                  description:
                    "Encord does not capture data. Teams bring video, LiDAR, sensor data, and images to the platform. Encord's value is in managing, organizing, and processing that data efficiently. Claru operates three parallel capture pipelines: wearable camera networks (10,000+ contributors, 100+ cities), managed teleoperation on client hardware, and game-based capture at 60 FPS. If you have data, Encord helps you manage it. If you need data, Claru captures it.",
               },
                {
                  title: "Annotation Tooling vs. Annotation Service",
                  description:
                    "Encord provides annotation tools — AI-assisted labeling, human-in-the-loop workflows, embedding-based curation, and quality assurance. Your team (or contractors) operates those tools. Claru provides annotation as a service — our annotators are trained specifically on physical AI tasks: grasp types, action boundaries, manipulation intent, object affordances. You get labeled data, not labeling software.",
               },
                {
                  title: "Enrichment Architecture",
                  description:
                    "Encord's AI features focus on annotation productivity: auto-tagging, natural language search, embedding-based filtering, and model-assisted labeling. These help annotators work faster. Claru's enrichment pipeline produces computational training inputs: depth maps (Depth Anything V2), segmentation masks (SAM3), pose estimation (ViTPose 2D/3D), optical flow (RAFT), and AI captions. These outputs are not annotation aids — they are training-ready features that models consume directly.",
               },
                {
                  title: "Delivery Model",
                  description:
                    "Encord is a SaaS platform — data lives on the platform and exports via API or standard formats (COCO, Pascal VOC). Claru delivers datasets directly to your infrastructure: WebDataset for streaming training, HDF5 for dense trajectories, RLDS for reinforcement learning, Parquet for metadata. Every delivery includes enrichment layers as aligned side-channels, manifests with checksums, and datasheets documenting methodology.",
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

        {/* -- Comparison Table --------------------------------------------- */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Encord vs. Claru: Side-by-Side Comparison
            </h2>
            <p className="text-white/70 mb-10 text-lg max-w-4xl">
              An honest comparison across the dimensions that matter
              for physical AI teams. Both companies have real
              capabilities &mdash; the question is which architecture
              fits your needs.
            </p>

            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50 min-w-[140px]">
                      Dimension
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50 min-w-[220px]">
                      Encord
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
                        {row.encord}
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

        {/* -- When Encord Is the Right Choice ------------------------------ */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              When Encord Is the Right Choice
            </h2>

            <div className="prose-custom space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Encord is a well-funded, fast-growing company with real
                technology. If your project fits these profiles, they may
                be the better choice:
              </p>

              <ul className="space-y-4 list-none pl-0">
                {[
                  {
                    title: "You already have large volumes of physical AI data",
                    desc: "If your robots, vehicles, or drones are capturing data at scale and your bottleneck is managing, curating, and annotating that data efficiently, Encord's platform is purpose-built for this. Their support for 2D, 3D, LiDAR, radar, and sensor fusion means your multimodal data can live in one place.",
                 },
                  {
                    title: "You have (or want to build) an internal annotation team",
                    desc: "Encord's AI-assisted labeling tools — 3x faster annotation, 6x faster video labeling, model-assisted pre-labeling — make human annotators more productive. If you have an existing annotation team and want to scale their throughput, Encord's tooling can accelerate that significantly.",
                 },
                  {
                    title: "You need model evaluation alongside annotation",
                    desc: "Encord offers RLHF workflows, rubric-based evaluation, pairwise comparison, and embedding-based edge case discovery within the same platform as annotation. If your workflow involves tight iteration between annotation, training, and evaluation, having these in one tool reduces context switching.",
                 },
                  {
                    title: "You work across many data modalities",
                    desc: "Encord supports images, video, LiDAR, point clouds, medical imaging, audio, and sensor fusion. If your team works across autonomous vehicles, drones, and robotics — each with different sensor stacks — Encord's broad modality support consolidates your toolchain.",
                 },
                  {
                    title: "You need an audit trail and compliance infrastructure",
                    desc: "Encord creates audit trails for annotation decisions, supports version control for datasets, and provides lineage tracking. For teams in regulated industries (medical robotics, autonomous vehicles), this compliance infrastructure can be a requirement, not a feature.",
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
                If your challenge is data infrastructure and annotation
                tooling, Encord is a strong option. Their $60M Series C
                and 300+ customer base validate the platform approach for
                teams that want to own their data pipeline.
              </p>
            </div>
          </div>
        </section>

        {/* -- When You Need a Data Service --------------------------------- */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              When You Need a Physical AI Data Service
            </h2>

            <div className="prose-custom space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                The case for a data service becomes clear when your
                bottleneck is not tooling but data itself. If any of
                these describe your situation, a delivery-focused
                provider like Claru is worth evaluating.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "You need data captured, not just annotated",
                  description:
                    "Encord manages data you already have. Claru captures data you need. If your project requires egocentric video from diverse real-world environments, teleoperation demonstrations on specific hardware, or game-based interaction data — you need a capture service, not a management platform. Claru's 10,000+ contributor network spans 100+ cities with wearable cameras, managed teleoperation, and custom game-based pipelines.",
               },
                {
                  title: "Your models need enrichment as training inputs",
                  description:
                    "Robotics models consume depth maps, pose estimation, segmentation masks, and optical flow as direct training inputs — not just annotations on video. Claru's enrichment pipeline produces these at scale, cross-validates them for physical consistency, and delivers them as aligned side-channels. This is computational enrichment for training, not auto-tagging for annotation productivity.",
               },
                {
                  title: "You do not have (or want) an annotation ops team",
                  description:
                    "Many robotics startups have 10-50 ML researchers and zero annotation specialists. Building an annotation team, training them on physical AI tasks, managing quality, and operating tooling is a full-time operations challenge. Claru's annotators are already trained on grasp types, action boundaries, manipulation intent, and affordances. You describe what your model needs to learn; we deliver labeled data.",
               },
                {
                  title: "You need robotics-native delivery formats",
                  description:
                    "Your training pipeline expects WebDataset for streaming, HDF5 for dense trajectories, RLDS for reinforcement learning, or Parquet for metadata queries — with enrichment layers as aligned side-channels. Claru delivers in these formats natively. Exporting from an annotation platform and converting to robotics-native formats is engineering overhead that a data service eliminates.",
               },
                {
                  title: "Speed on custom datasets matters",
                  description:
                    "Claru scopes and delivers pilot datasets in days, not weeks. If you need a specific dataset — manipulation demonstrations in a particular environment, egocentric video of a particular task — captured, enriched, annotated, and delivered on a tight timeline, a service that owns the entire pipeline can move faster than a platform you need to configure and operate yourself.",
               },
                {
                  title: "Physical AI is your only data need",
                  description:
                    "If you are a robotics company and physical AI training data is the only external data you purchase, you do not need a multi-modality platform. You need a partner whose entire organization — engineering, operations, annotation workforce — is optimized for your specific use case. Claru does one thing: physical AI data. Nothing else.",
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

        {/* -- Claru's Pipeline --------------------------------------------- */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Claru&apos;s Pipeline: Data as a Service for Physical AI
            </h2>
            <p className="text-white/70 mb-12 text-lg">
              Claru was not a platform that added data services. It was
              built as a{" "}
              <Link
                href="/training-data-for-robotics"
                style={{ color: "#92B090"}}
                className="underline underline-offset-2"
              >
                physical AI data delivery service
              </Link>{" "}
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
                    "Every clip passes through a multi-model enrichment pipeline. Monocular depth estimation (Depth Anything V2) generates per-frame depth maps. Semantic segmentation (SAM3) labels every pixel with object class and instance identity. Human pose estimation (ViTPose) extracts 2D and 3D joint positions for hand-object interaction analysis. Optical flow (RAFT) computes dense motion fields between frames. AI-generated captions provide natural language descriptions. All outputs are cross-validated: depth against segmentation boundaries, pose against temporal smoothness.",
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

        {/* -- The Enrichment Difference ------------------------------------ */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Annotation Productivity vs. Training-Ready Enrichment
            </h2>

            <div className="prose-custom space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Both Encord and Claru use AI models in their workflows.
                But the purpose is different, and the distinction matters
                for robotics teams choosing between them.
              </p>

              <p>
                <strong className="text-white">
                  Encord&apos;s AI in the pipeline
                </strong>{" "}
                focuses on making annotation faster and smarter.
                Model-assisted pre-labeling suggests annotations that
                humans refine. Embedding-based curation surfaces
                interesting or edge-case samples from large datasets.
                Natural language search lets annotators find specific
                data quickly. Active learning integration identifies
                which samples to label next for maximum model
                improvement. These features accelerate the
                annotation workflow &mdash; and for teams with large
                annotation operations, this can be transformative.
              </p>

              <p>
                <strong className="text-white">
                  Claru&apos;s enrichment pipeline
                </strong>{" "}
                produces data that becomes part of the training dataset
                itself. Depth maps from{" "}
                <a
                  href="https://depth-anything-v2.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#92B090"}}
                  className="underline underline-offset-2"
                >
                  Depth Anything V2
                </a>{" "}
                are per-frame geometric representations that VLA models
                use to understand 3D scene structure. Pose estimates from
                ViTPose are training inputs that teach manipulation
                policies about human body kinematics. Segmentation masks
                from SAM3 enable instance-level object reasoning.
                Optical flow from RAFT captures motion dynamics. These
                are not annotation aids &mdash; they are training-ready
                input features delivered as aligned side-channels.
              </p>

              <p>
                The question is: does your team need{" "}
                <strong className="text-white">
                  faster annotation tooling
                </strong>{" "}
                or{" "}
                <strong className="text-white">
                  enrichment layers delivered as training inputs
                </strong>
                ? If your bottleneck is annotation throughput on data
                you already have, Encord&apos;s AI-assisted tooling is
                the right investment. If your bottleneck is getting
                enriched, annotated data in the first place,
                Claru&apos;s service model is more direct.
              </p>
            </div>
          </div>
        </section>

        {/* -- Encord's Growth and Market Position -------------------------- */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Encord&apos;s Growth and Market Position
            </h2>

            <div className="prose-custom space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Encord&apos;s trajectory is worth understanding.
                Founded by Ulrik Stig Hansen and Eric Landau, the
                company has grown aggressively:
              </p>

              <ul className="space-y-3 list-none pl-0">
                {[
                  "Revenue grew 10x over the past 18 months",
                  "Data on platform grew from 1PB to 5PB+ (3x the volume used to train GPT-4)",
                  "300+ physical AI teams on the platform globally",
                  "$110M total funding at $550M valuation (Series C led by Wellington Management)",
                  "150+ team across US and UK, representing 40+ nationalities",
                  "Key customers include Woven by Toyota (autonomous vehicles), Skydio (drones), and Zipline (delivery drones)",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span
                      className="mt-2 h-1.5 w-1.5 rounded-full flex-none"
                      style={{ backgroundColor: "#92B090"}}
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <p>
                This growth reflects real demand for physical AI data
                infrastructure. As robotics and autonomous systems move
                from research to deployment, teams need better tooling
                for the data pipeline &mdash; and Encord is building
                that tooling.
              </p>

              <p>
                Claru serves a different segment of that same market. We
                work with frontier AI labs that need training data
                delivered, not tooling to build their own pipeline. Both
                companies are growing because the physical AI data
                market itself is growing &mdash;{" "}
                <a
                  href="https://www.nvidia.com/en-us/ai/physical-ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#92B090"}}
                  className="underline underline-offset-2"
                >
                  400 million intelligent robots
                </a>{" "}
                coming online will need both platforms and services.
              </p>
            </div>
          </div>
        </section>

        {/* -- Proof Points ------------------------------------------------- */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-10">
              Claru by the Numbers
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  stat: "3.7M+",
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

        {/* -- Other Alternatives ------------------------------------------- */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Other Encord Alternatives Worth Considering
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Depending on whether you need a platform, a service, or
              something in between, these other providers may also be
              relevant.
            </p>

            <div className="space-y-8">
              {[
                {
                  name: "Labelbox",
                  type: "Annotation platform",
                  description:
                    "Labelbox is a broad AI data platform that has expanded into robotics capture, annotation, RLHF, and model evaluation. Like Encord, it is a platform — but broader (NLP, images, video, robotics) rather than physical-AI-focused. Strengths: Alignerr expert network (1.5M+ workers), RLHF for LLMs, custom evaluations. Weaknesses: breadth can mean less depth in any one vertical. Best when you need one platform across many AI modalities.",
                  link: "/compare/labelbox-alternatives",
                  linkText: "See our Labelbox comparison",
               },
                {
                  name: "Scale AI",
                  type: "Enterprise labeling",
                  description:
                    "Scale AI is the enterprise standard for data labeling at massive scale. Primarily annotation-only: you bring data, they label it. Strengths: proven at enterprise scale, strong quality controls, massive workforce. Weaknesses: enterprise pricing, annotation-only model, generalist rather than specialist. Best for high-volume annotation on existing data.",
                  link: "/compare/scale-ai-alternatives",
                  linkText: "See our Scale AI comparison",
               },
                {
                  name: "Surge AI",
                  type: "Expert annotation",
                  description:
                    "Surge AI provides expert human annotation through a curated workforce, focused on quality over volume. Excellent for RLHF and NLP tasks. Strengths: high annotation quality, vetted annotators. Weaknesses: annotation-only, NLP-focused, limited video and physical AI capabilities. Best for LLM training data.",
                  link: "/compare/surge-ai-alternatives",
                  linkText: "See our Surge AI comparison",
               },
                {
                  name: "Appen",
                  type: "Crowd labeling",
                  description:
                    "Appen is one of the original crowd-sourced data labeling companies with nearly 30 years of operation. Recently expanded into physical AI with LiDAR annotation. Strengths: massive global workforce, linguistic diversity. Weaknesses: quality concerns in recent years, crowd model less suited for specialized physical AI tasks. Best for high-volume multilingual NLP.",
                  link: "/compare/appen-alternatives",
                  linkText: "See our Appen comparison",
               },
                {
                  name: "Luel (YC W26)",
                  type: "Data marketplace",
                  description:
                    "Luel is a two-sided marketplace for rights-cleared multimodal data. Fast access to raw licensed footage. Strengths: speed, rights management, contributor network. Weaknesses: no enrichment pipeline, no custom capture, raw data only. Best for teams that need raw licensed video and handle enrichment in-house.",
                  link: "/compare/claru-vs-luel",
                  linkText: "See our Luel comparison",
               },
                {
                  name: "CVAT",
                  type: "Open-source platform",
                  description:
                    "Computer Vision Annotation Tool — open-source annotation platform from Intel. Similar in concept to Encord but self-hosted and free. Strengths: no licensing cost, flexible, strong community. Weaknesses: self-hosted (DevOps required), no data capture, no enrichment, no managed workforce. Best for teams that want full control and have engineering resources.",
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

        {/* -- Making the Decision ------------------------------------------ */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              How to Decide: Platform vs. Data Service
            </h2>

            <div className="prose-custom space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                The decision comes down to where your bottleneck sits
                and what your team looks like.
              </p>

              <p>
                <strong className="text-white">
                  Choose Encord if:
                </strong>{" "}
                You have significant volumes of data from your own
                robots, vehicles, or drones and need better tooling to
                manage, curate, and annotate it. You have (or are
                building) an annotation team and want to accelerate their
                throughput. You need model evaluation alongside
                annotation. You work across multiple sensor modalities
                and want one unified platform. Your compliance
                requirements demand audit trails and version control.
              </p>

              <p>
                <strong className="text-white">
                  Choose Claru if:
                </strong>{" "}
                You need training data delivered, not tooling to build
                your own pipeline. You need data captured from real-world
                environments, not just annotated. Your models require
                deep computational enrichment (depth, pose, segmentation,
                optical flow) as training inputs. Your{" "}
                <Link
                  href="/embodied-ai-datasets"
                  style={{ color: "#92B090"}}
                  className="underline underline-offset-2"
                >
                  annotation tasks
                </Link>{" "}
                require physical AI domain expertise. You need delivery
                in{" "}
                <Link
                  href="/egocentric-video-datasets"
                  style={{ color: "#92B090"}}
                  className="underline underline-offset-2"
                >
                  robotics-native formats
                </Link>{" "}
                with enrichment side-channels. You want fast turnaround
                without building annotation ops.
              </p>

              <p>
                <strong className="text-white">
                  Use both if:
                </strong>{" "}
                You have internal data that needs platform-grade
                management (Encord) and external data needs that
                require a delivery service (Claru). This is a common
                architecture for robotics companies that capture some
                data themselves and source additional training data
                from specialist providers. Encord manages your internal
                pipeline; Claru fills it with training-ready physical
                AI data.
              </p>
            </div>
          </div>
        </section>

        {/* -- Related Resources -------------------------------------------- */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
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
                  href: "/compare/labelbox-alternatives",
                  title: "Labelbox Alternatives",
                  desc: "Broad platform vs. physical AI specialist for robotics data.",
               },
                {
                  href: "/compare/scale-ai-alternatives",
                  title: "Scale AI Alternatives",
                  desc: "Enterprise labeling vs. specialized physical AI data services.",
               },
                {
                  href: "/compare/surge-ai-alternatives",
                  title: "Surge AI Alternatives",
                  desc: "NLP annotation expertise vs. physical AI data delivery.",
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
                  href: "/data-catalog",
                  title: "Browse the Data Catalog",
                  desc: "Explore 25+ licensed datasets across robotics, video, and multimodal AI.",
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

        {/* -- FAQ ---------------------------------------------------------- */}
        <section className="w-full py-16 md:py-24">
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

        {/* -- CTA ---------------------------------------------------------- */}
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
              <a
                href="/#contact"
                className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-medium transition-all"
                style={{
                  backgroundColor: "#92B090",
                  color: "#0a0908",
               }}
              >
                Get Started
              </a>
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
