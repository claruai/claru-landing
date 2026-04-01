import type { Metadata} from "next";
import Link from "next/link";
import GeoPageShell from "@/app/components/content/GeoPageShell";

// =============================================================================
// META
// =============================================================================

export const metadata: Metadata = {
  title:
    "Claru vs Luel: Physical AI Data Compared (2026)",
  description:
    "Claru vs Luel for physical AI training data. Enrichment depth, annotation quality, scale, and pricing compared side by side for robotics teams.",
  keywords: [
    "Claru vs Luel",
    "Luel alternative",
    "Luel vs Claru",
    "Luel competitor",
    "physical AI training data comparison",
    "robotics training data provider",
    "Luel AI review",
    "training data marketplace alternative",
    "enriched training data for robotics",
    "best training data for world models",
  ],
  openGraph: {
    title:
      "Claru vs Luel: Physical AI Training Data Compared (2026)",
    description:
      "Side-by-side comparison of Claru and Luel for robotics and physical AI training data. Enrichment depth, scale, quality control, and delivery models compared.",
    type: "article",
    url: "https://claru.ai/compare/claru-vs-luel",
    siteName: "Claru",
    images: [
      {
        url: "/images/og-v2.webp",
        width: 1200,
        height: 630,
        alt: "Claru vs Luel — Physical AI Training Data Compared",
     },
    ],
 },
  twitter: {
    card: "summary_large_image",
    title: "Claru vs Luel: Physical AI Training Data Compared (2026)",
    description:
      "Enrichment depth, annotation quality, scale, and pricing compared side by side. Find the right provider for your physical AI program.",
 },
  alternates: {
    canonical: "https://claru.ai/compare/claru-vs-luel",
 },
};

// =============================================================================
// FAQ JSON-LD
// =============================================================================

const faqItems = [
  {
    question: "What is the main difference between Claru and Luel?",
    answer:
      "Claru and Luel serve different markets. Claru is 100% focused on physical AI training data — robotics, embodied AI, and world models. Every clip ships with depth maps, pose estimation, segmentation masks, optical flow, and human-labeled action annotations. Claru does not serve NLP, voice, text, or general image classification use cases. Luel is a broad two-sided marketplace for multimodal data across many industries, connecting data contributors with AI companies and delivering raw, rights-cleared media. The core differences are specialization (physical AI only vs. general-purpose) and enrichment depth (6+ annotation layers vs. raw media).",
 },
  {
    question: "Is Luel a good alternative to Claru for robotics training data?",
    answer:
      "It depends on where you are in your research cycle. If you need large volumes of raw, rights-cleared video quickly for prototyping or exploratory research, Luel's marketplace model can deliver fast. However, if you are training production robot policies, world models, or VLAs that require enriched data — depth, pose, segmentation, action labels — Claru is the stronger choice because those annotation layers are built into our standard delivery pipeline. Most robotics teams find that the cost of enriching raw marketplace data themselves exceeds the cost of purchasing pre-enriched data from a specialized provider like Claru.",
 },
  {
    question: "How does Claru's enrichment pipeline compare to buying raw data from Luel?",
    answer:
      "Claru's enrichment pipeline processes every clip through six automated and human annotation stages: monocular depth estimation (using models like Depth Anything V2, validated against LiDAR ground truth), semantic segmentation (SAM3-based instance and part segmentation), human pose estimation (ViTPose 2D/3D joint extraction), optical flow (dense inter-frame motion fields), AI-generated captions (multi-model natural language descriptions), and expert human annotation (action boundaries, object affordances, quality scoring). Luel delivers raw video from its contributor marketplace. To achieve equivalent enrichment, a team purchasing from Luel would need to build or license each of these processing stages independently, which typically costs 3-5x more than purchasing pre-enriched data.",
 },
  {
    question: "How long has Luel been operating compared to Claru?",
    answer:
      "Luel launched in early 2026 as a Y Combinator Winter 2026 startup, founded by two UC Berkeley students. As of March 2026, Luel has been operating for approximately six weeks. Claru (operated by Reka AI Inc.) has been delivering training data to frontier AI labs since 2025 and has completed 4 million+ human annotations across 100+ datasets for clients building world models, robotics systems, and embodied AI. Claru's track record includes delivering 500,000+ egocentric video clips and operating a collector network of 10,000+ contributors in 100+ cities.",
 },
  {
    question: "Does Luel provide depth maps, pose estimation, or segmentation with its data?",
    answer:
      "As of March 2026, Luel's marketplace delivers rights-cleared raw video and images contributed by its network. Luel does not advertise a built-in enrichment pipeline that provides depth maps, pose estimation, segmentation masks, optical flow, or structured action annotations. Teams purchasing from Luel would need to run their own enrichment processing or use third-party annotation services. Claru includes all of these enrichment layers as part of its standard data delivery at no additional processing cost to the customer.",
 },
  {
    question: "Which is better for training world models — Claru or Luel?",
    answer:
      "World models require training data that captures not just visual appearance but physical structure and dynamics — depth, object boundaries, motion patterns, and causal relationships between actions and outcomes. Claru's enriched datasets are purpose-built for this use case: every clip includes depth maps for 3D scene understanding, segmentation for object-level reasoning, optical flow for motion modeling, and action labels for learning causal structure. Luel's raw video can provide visual diversity but lacks these structural annotations. For teams building production world models, Claru's pre-enriched data significantly reduces the time from data acquisition to training. For teams in early exploration phases that need to quickly test hypotheses on diverse raw video, Luel's marketplace speed can be valuable.",
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
  headline: "Claru vs Luel: Physical AI Training Data Compared (2026)",
  description:
    "Claru vs Luel for physical AI training data. Enrichment depth, annotation quality, scale, and pricing compared side by side for robotics teams.",
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
    "@id": "https://claru.ai/compare/claru-vs-luel",
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
      name: "Claru vs Luel",
      item: "https://claru.ai/compare/claru-vs-luel",
   },
  ],
};

// =============================================================================
// COMPARISON TABLE DATA
// =============================================================================

const comparisonRows = [
  {
    dimension: "Founded",
    claru: "2025 (operated by Reka AI Inc.)",
    luel: "2026 (YC W26, ~6 weeks old)",
 },
  {
    dimension: "Model",
    claru: "Vertically integrated for physical AI: capture, enrich, annotate, deliver",
    luel: "Two-sided marketplace: contributors upload across all modalities, buyers browse",
 },
  {
    dimension: "Enrichment",
    claru: "6 layers standard: depth, pose, segmentation, optical flow, captions, human annotations",
    luel: "Raw media only — no built-in enrichment pipeline",
 },
  {
    dimension: "Annotation Quality",
    claru: "Trained human annotators for intent, affordances, edge cases; project-specific guidelines",
    luel: "Crowdsourced contributor metadata; no structured annotation pipeline",
 },
  {
    dimension: "Scale (delivered)",
    claru: "4M+ annotations, 500K+ egocentric clips, 100+ datasets",
    luel: "Claims ~$2M ARR in 6 weeks; published dataset counts unavailable",
 },
  {
    dimension: "Contributor Network",
    claru: "10,000+ trained collectors across 100+ cities",
    luel: "Claims 3M+ contributors (marketplace sign-ups)",
 },
  {
    dimension: "Specialization",
    claru: "100% physical AI: robotics, embodied AI, world models, VLAs — nothing else",
    luel: "General-purpose: voice, text, images, video across many industries",
 },
  {
    dimension: "Delivery Format",
    claru: "WebDataset, HDF5, RLDS, Parquet, custom formats; direct S3/GCS delivery",
    luel: "Standard media downloads via marketplace",
 },
  {
    dimension: "Rights Clearance",
    claru: "All data licensed from contributors with commercial rights",
    luel: "Rights-cleared from contributors — a core value proposition",
 },
  {
    dimension: "Case Studies",
    claru: "Published case studies with real metrics and methodologies",
    luel: "No published case studies as of March 2026",
 },
  {
    dimension: "Content / SEO",
    claru: "4 GEO landing pages, solution pages, case studies",
    luel: "60+ blog posts, strong content velocity",
 },
  {
    dimension: "Pricing",
    claru: "Custom per-project scoping based on volume, complexity, and enrichment requirements",
    luel: "Marketplace pricing; varies by contributor and data type",
 },
];

// =============================================================================
// PAGE
// =============================================================================

export default function ClaruVsLuelPage() {
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
                  <span className="transition-colors">
                    Compare
                  </span>
                </li>
                <li aria-hidden="true" className="select-none">
                  /
                </li>
                <li aria-current="page" style={{ color: "#92B090"}}>
                  Claru vs Luel
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
              Claru vs Luel: Which Training Data Provider Fits Your
              Physical AI Program?
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl text-white/70">
              <a
                href="https://luel.ai"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#92B090"}}
                className="underline underline-offset-2"
              >
                Luel
              </a>{" "}
              is a fast-growing marketplace for multimodal
              training data across many domains. Claru is the only
              company 100% focused on training data for{" "}
              <Link
                href="/physical-ai-training-data"
                style={{ color: "#92B090"}}
                className="underline underline-offset-2"
              >
                physical AI
              </Link>.
              Different tools for different jobs. This page compares
              the two honestly so you can pick the right provider for
              your use case.
            </p>

            <p className="mt-4 max-w-2xl text-sm text-white/40 italic">
              Last updated: March 2026. We update this page as both
              products evolve. If anything here is inaccurate, email{" "}
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
                <strong className="text-white">Luel</strong> is a
                broad marketplace for rights-cleared multimodal data
                — voice, text, images, video, across many industries.
                Fast delivery, large contributor network, YC-backed.
                Good for teams that need diverse raw data quickly.
              </p>
              <p>
                <strong className="text-white">Claru</strong> does
                one thing: training data for physical AI. Every
                dollar, every collector, every pipeline is aimed at
                robotics, embodied AI, and world models. Our founders
                built the licensed data infrastructure at Moonvalley
                ($154M raised). We do not do NLP, voice, text, or
                generic image classification. We capture real-world
                video, enrich it with depth, pose, segmentation, and
                optical flow, and have expert humans annotate intent,
                affordances, and edge cases.
              </p>
              <p>
                The question is not which company is better — it is{" "}
                <strong className="text-white">
                  what are you building?
                </strong>{" "}
                Need voice data or text annotation? Luel is great for
                that. Need to train robots, world models, or embodied
                AI? That is all we do.
              </p>
            </div>
          </div>
        </section>

        {/* ── Side-by-Side Comparison Table ─────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Side-by-Side Comparison
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              A factual comparison across the dimensions that matter
              most when selecting a training data provider for physical
              AI research.
            </p>

            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                      Dimension
                    </th>
                    <th
                      className="px-4 py-3 font-mono text-xs uppercase tracking-wider"
                      style={{ color: "#92B090"}}
                    >
                      Claru
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                      Luel
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
                      <td className="px-4 py-3 font-medium text-white whitespace-nowrap align-top">
                        {row.dimension}
                      </td>
                      <td className="px-4 py-3 align-top">
                        {row.claru}
                      </td>
                      <td className="px-4 py-3 align-top">
                        {row.luel}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Deep Dive: Enrichment ─────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              The Enrichment Gap: Why It Matters
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              This is the single biggest difference between Claru and
              Luel, and it is the factor most likely to determine which
              provider is right for your team.
            </p>

            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Raw video is necessary but not sufficient for training
                physical AI systems. Research benchmarks like{" "}
                <a
                  href="https://ego4d-data.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#92B090"}}
                  className="underline underline-offset-2"
                >
                  Ego4D
                </a>{" "}
                and{" "}
                <a
                  href="https://robotics-transformer-x.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#92B090"}}
                  className="underline underline-offset-2"
                >
                  Open X-Embodiment
                </a>{" "}
                have demonstrated this clearly. A robot learning to pick up a mug
                does not just need to see mugs — it needs to understand
                the 3D geometry of the scene (depth), where the
                human&apos;s hand is relative to the mug (pose), which
                pixels belong to the mug versus the table (segmentation),
                how the mug moves through space (optical flow), and what
                action the human is performing (action labels).
              </p>

              <p>
                This is why enrichment matters. Buying raw video and
                enriching it yourself means building or licensing
                multiple ML pipelines, validating their outputs against
                each other, handling failure cases, and maintaining the
                infrastructure indefinitely. Most teams that go this
                route find the total cost is 3-5x higher than
                purchasing pre-enriched data.
              </p>

              <h3 className="text-xl font-semibold text-white mt-10 mb-4">
                Claru&apos;s Six Enrichment Layers
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    layer: "Depth Estimation",
                    detail:
                      "Per-frame monocular depth maps using state-of-the-art models (Depth Anything V2), cross-validated against LiDAR ground truth where available. Delivered as 16-bit PNG or NumPy arrays.",
                 },
                  {
                    layer: "Semantic Segmentation",
                    detail:
                      "Pixel-level object class, instance ID, and part annotations using SAM3-based models. COCO RLE format for efficient storage and fast mask decoding during training.",
                 },
                  {
                    layer: "Human Pose Estimation",
                    detail:
                      "2D and 3D joint positions extracted via ViTPose for hand-object interaction understanding. Critical for training manipulation policies and grasping models.",
                 },
                  {
                    layer: "Optical Flow",
                    detail:
                      "Dense inter-frame motion fields capturing how every pixel moves between consecutive frames. Essential for learning dynamics and predicting physical interactions.",
                 },
                  {
                    layer: "AI-Generated Captions",
                    detail:
                      "Multi-model natural language descriptions of each clip generated by frontier vision-language models. Provides semantic grounding for VLA training and retrieval.",
                 },
                  {
                    layer: "Expert Human Annotation",
                    detail:
                      "Trained annotators label action boundaries, object affordances, grasp types, quality scores, and edge cases. The labels machines cannot reliably produce on their own.",
                 },
                ].map((item) => (
                  <div
                    key={item.layer}
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div
                      className="text-sm font-mono font-bold mb-2"
                      style={{ color: "#92B090"}}
                    >
                      {item.layer}
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-semibold text-white mt-10 mb-4">
                What Luel Delivers
              </h3>

              <p>
                Luel&apos;s marketplace delivers rights-cleared raw
                video and images uploaded by contributors. The emphasis
                is on speed and volume — Luel claims same-day delivery
                for certain data types. Contributors set their own
                pricing, and buyers browse a catalog of available data.
              </p>

              <p>
                This is a valid model for teams that have their own
                enrichment infrastructure or are in early research
                phases where raw visual diversity matters more than
                annotation depth. But for teams training production
                policies that need structured annotations, raw
                marketplace data is a starting point, not a finish line.
              </p>

              <h3 className="text-xl font-semibold text-white mt-10 mb-4">
                The Real Cost of DIY Enrichment
              </h3>

              <p>
                Teams purchasing raw data from any marketplace (Luel or
                otherwise) and enriching it themselves typically face
                these costs:
              </p>

              <ul className="list-none space-y-3 mt-4">
                {[
                  "Depth estimation pipeline: model selection, GPU infrastructure, validation against ground truth, handling failure cases on transparent/reflective surfaces",
                  "Segmentation pipeline: instance vs. semantic vs. part segmentation, format decisions (COCO RLE, polygon, bitmap), quality filtering",
                  "Pose estimation: 2D vs. 3D, hand-specific models, temporal smoothing, occlusion handling",
                  "Optical flow: method selection (RAFT, FlowFormer), GPU compute at scale, boundary artifact handling",
                  "Human annotation: recruiting and training annotators, building annotation guidelines, QA workflows, inter-annotator agreement tracking",
                  "Integration: aligning all annotations to a shared coordinate frame and temporal index, packaging into training-pipeline-compatible formats",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      className="flex-none mt-1 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: "#92B090"}}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-6">
                For a 100K-clip dataset, building this stack from
                scratch typically takes 2-4 months of ML engineering
                time and $50K-$200K in compute and annotation costs.
                Purchasing pre-enriched data from Claru eliminates this
                overhead entirely.
              </p>
            </div>
          </div>
        </section>

        {/* ── Quality Control ──────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Quality Control: Managed Pipeline vs. Marketplace
            </h2>

            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                The marketplace model and the managed pipeline model
                represent fundamentally different approaches to quality
                assurance. Neither is inherently better — they optimize
                for different things.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
                  <h3
                    className="text-lg font-semibold mb-3"
                    style={{ color: "#92B090"}}
                  >
                    Claru: Managed Pipeline
                  </h3>
                  <ul className="space-y-3 text-sm text-white/70">
                    {[
                      "Trained collectors follow project-specific capture protocols",
                      "Same-day QA: every clip reviewed within 24 hours of capture",
                      "Multi-stage validation: automated checks (resolution, duration, lighting) + human review",
                      "Enrichment cross-validation: depth consistency checked against segmentation boundaries",
                      "Annotator training: project-specific guidelines developed with each client's ML team",
                      "Inter-annotator agreement tracked and reported for every batch",
                      "Reject rates published: clients see exactly what percentage of clips pass QA",
                    ].map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span
                          className="flex-none mt-1 w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: "#92B090"}}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Luel: Marketplace Model
                  </h3>
                  <ul className="space-y-3 text-sm text-white/70">
                    {[
                      "Contributors self-serve: upload data, set pricing, list on marketplace",
                      "Quality varies by contributor — buyers evaluate before purchasing",
                      "Rights clearance verified by platform (a genuine strength)",
                      "Speed advantage: data available same-day from existing contributor inventory",
                      "Buyer-side QA: the purchasing team is responsible for validating fitness for their use case",
                      "Large contributor pool (claims 3M+) provides diversity in content and geography",
                      "No published quality metrics or reject rates as of March 2026",
                    ].map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="flex-none mt-1 w-1.5 h-1.5 rounded-full bg-white/30" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="mt-6">
                The trade-off is clear: Claru&apos;s managed pipeline
                gives you tighter quality guarantees and richer
                annotations, but requires a scoping conversation and
                project timeline. Luel&apos;s marketplace gives you
                faster access to raw data at the cost of downstream
                enrichment and QA work.
              </p>
            </div>
          </div>
        </section>

        {/* ── When to Choose Luel ──────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              When Luel Might Be the Right Choice
            </h2>

            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                We believe in helping researchers make the right
                decision, even when that means pointing you toward a
                competitor. Luel is a legitimate company solving real
                problems. Here is when their model serves you well:
              </p>

              <div className="space-y-4 mt-6">
                {[
                  {
                    title: "You are not building physical AI",
                    description:
                      "If your use case is NLP, voice recognition, text annotation, content moderation, or generic image classification — Luel's broad marketplace is a better fit than Claru. We do not serve those modalities at all.",
                 },
                  {
                    title: "Rapid prototyping with raw video",
                    description:
                      "You are testing a new model architecture and need diverse raw video quickly to validate your approach before investing in enriched data. Luel's same-day delivery and broad catalog can accelerate early-stage experimentation.",
                 },
                  {
                    title: "You have your own enrichment stack",
                    description:
                      "If your team has already built and validated depth, pose, segmentation, and annotation pipelines, you may only need raw input data. In that case, a marketplace that delivers raw video at scale is a reasonable source.",
                 },
                  {
                    title: "Content diversity over annotation depth",
                    description:
                      "Some research (e.g., pre-training large video models on broad visual distributions) benefits more from content diversity than deep per-clip annotations. Luel's 3M+ contributor network could provide geographic and contextual breadth.",
                 },
                  {
                    title: "Budget-constrained exploration",
                    description:
                      "Academic labs or early-stage startups with limited budgets may benefit from marketplace pricing where you can purchase exactly the volume you need without committing to a custom project scope.",
                 },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="border-l-2 border-white/20 pl-6"
                  >
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-white/70">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── When to Choose Claru ─────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              When Claru Is the Better Fit
            </h2>

            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Claru exists for one reason: to provide the training
                data that physical AI systems need to work in the real
                world.{" "}
                <Link
                  href="/about"
                  style={{ color: "#92B090"}}
                  className="underline underline-offset-2"
                >
                  Our team
                </Link>{" "}
                built the licensed data infrastructure at Moonvalley,
                and that singular focus means every part of our pipeline is
                optimized for your use case:
              </p>

              <div className="space-y-4 mt-6">
                {[
                  {
                    title: "Training production robot policies",
                    description:
                      "If your model will be deployed on real hardware — picking items in a warehouse, cooking in a kitchen, navigating a hospital — you need training data with depth, pose, segmentation, and action labels aligned to your robot's observation space. Claru delivers this out of the box.",
                 },
                  {
                    title: "Building world models or video generation systems",
                    description:
                      "World models need to understand physical structure and dynamics, not just visual appearance. Claru's enrichment layers provide the structural annotations (depth, flow, segmentation) that teach models how the physical world works.",
                 },
                  {
                    title: "Training vision-language-action (VLA) models",
                    description:
                      "VLAs require paired visual observations, natural language descriptions, and action labels. Claru's pipeline produces all three: egocentric video, multi-model captions, and human-annotated action boundaries — aligned and packaged in RLDS, WebDataset, or your preferred format.",
                 },
                  {
                    title: "Needing custom data collection at scale",
                    description:
                      "If your training requirements don't match any existing dataset — specific environments, object categories, camera perspectives, or task protocols — Claru designs and executes custom collection campaigns using our 10,000+ trained contributor network.",
                 },
                  {
                    title: "Requiring expert human annotation",
                    description:
                      "Some labels cannot be automated: grasp affordances, human intent, task completion quality, edge case identification. Claru's trained annotators work from project-specific guidelines developed with your ML team.",
                 },
                  {
                    title: "Optimizing total cost of training data",
                    description:
                      "When you factor in the engineering time and compute cost of building your own enrichment pipeline, purchasing pre-enriched data from Claru is typically 3-5x cheaper than buying raw data and processing it yourself. We have already amortized the infrastructure cost across multiple clients.",
                 },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="border-l-2 pl-6"
                    style={{ borderColor: "rgba(146,176,144,0.4)"}}
                  >
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-white/70">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Track Record and Proof Points ────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Track Record: Proof Points at Scale
            </h2>

            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                When evaluating a training data provider, past delivery
                is the strongest signal. Claims are easy; shipping
                millions of annotations at production quality is hard.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                {[
                  {
                    stat: "4M+",
                    label: "Human annotations",
                    context:
                      "delivered across egocentric video, game environments, and custom capture projects",
                 },
                  {
                    stat: "500K+",
                    label: "Egocentric clips",
                    context:
                      "from kitchens, workshops, warehouses, and outdoor environments worldwide",
                 },
                  {
                    stat: "10,000+",
                    label: "Trained collectors",
                    context:
                      "across 100+ cities, following project-specific capture protocols",
                 },
                  {
                    stat: "100+",
                    label: "Active datasets",
                    context:
                      "commercially licensed for robotics, video generation, and embodied AI",
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

              <p className="mt-8">
                Luel is a promising early-stage company backed by Y
                Combinator with impressive early traction (~$2M ARR in
                six weeks is notable). However, as of March 2026, Luel
                has not published case studies, detailed quality
                metrics, or named client references. For teams making a
                high-stakes decision about their training data
                infrastructure, Claru&apos;s established track record
                reduces risk.
              </p>
            </div>
          </div>
        </section>

        {/* ── Physical AI Specialization ───────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Physical AI Specialization vs. General Marketplace
            </h2>

            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Luel is a broad multimodal data marketplace — voice,
                text, images, video, audio across many industries and
                use cases. That breadth is genuinely useful for teams
                building NLP systems, voice assistants, content
                moderation models, or other generalist AI products.
              </p>

              <p>
                Claru does not compete in those categories. We are{" "}
                <Link
                  href="/physical-ai-training-data"
                  style={{ color: "#92B090"}}
                  className="underline underline-offset-2"
                >
                  100% focused on physical AI training data
                </Link>
                . Our founders built the licensed data infrastructure
                at Moonvalley ($154M raised) and redirected that
                expertise entirely toward robotics, embodied AI, and
                world models. We do not do NLP. We do not do voice.
                We do not do generic image classification. Every
                dollar, every pipeline, every collector is aimed at
                the data modalities that physical AI systems consume.
              </p>

              <p>
                That singular focus shows up in concrete ways:
              </p>

              <ul className="list-none space-y-3 mt-4">
                {[
                  "Capture protocols designed for egocentric viewpoints that match robot camera perspectives",
                  "Enrichment models selected and validated specifically for indoor manipulation and navigation scenes",
                  "Annotation taxonomies built around robotics-relevant concepts: grasp types, affordances, action boundaries, contact states",
                  "Delivery formats native to robot learning pipelines: RLDS, WebDataset, HDF5 trajectory files",
                  "Team expertise in the specific data requirements of VLAs, behavior cloning, and world models",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      className="flex-none mt-1 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: "#92B090"}}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-6">
                For teams building NLP systems, voice assistants,
                content moderation, or general image classifiers —
                Luel is a strong choice. They have breadth and speed
                across those modalities. For teams building robots,
                world models, or embodied AI systems — a specialist
                that does nothing else will consistently outperform
                a generalist marketplace on the dimensions that
                matter: enrichment depth, annotation quality, and
                delivery format compatibility.
              </p>
            </div>
          </div>
        </section>

        {/* ── Making the Right Decision ────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              How to Decide: A Framework
            </h2>

            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Rather than making a blanket recommendation, here is a
                decision framework based on the dimensions that actually
                matter:
              </p>

              <div className="overflow-x-auto rounded-lg border border-white/10 mt-6">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.04]">
                      <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                        If you need...
                      </th>
                      <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                        Consider
                      </th>
                      <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                        Why
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-white/70">
                    {[
                      {
                        need: "Raw video quickly for prototyping",
                        pick: "Luel",
                        why: "Marketplace model optimizes for speed and immediate availability",
                     },
                      {
                        need: "Enriched data with depth, pose, segmentation",
                        pick: "Claru",
                        why: "Built-in enrichment pipeline delivers 6 annotation layers standard",
                     },
                      {
                        need: "Expert human annotations (affordances, intent)",
                        pick: "Claru",
                        why: "Trained annotators with project-specific guidelines and QA",
                     },
                      {
                        need: "Broad content diversity across many domains",
                        pick: "Luel",
                        why: "3M+ contributor network spans many content categories",
                     },
                      {
                        need: "Custom data collection campaigns",
                        pick: "Claru",
                        why: "10,000+ trained collectors following structured protocols",
                     },
                      {
                        need: "Robot-specific delivery formats (RLDS, HDF5)",
                        pick: "Claru",
                        why: "Native support for robotics pipeline formats",
                     },
                      {
                        need: "Same-day small-batch delivery",
                        pick: "Luel",
                        why: "Marketplace inventory available for immediate purchase",
                     },
                      {
                        need: "Proven track record with published case studies",
                        pick: "Claru",
                        why: "4M+ annotations delivered; published case studies with metrics",
                     },
                    ].map((row, i) => (
                      <tr
                        key={row.need}
                        className={
                          i % 2 === 0
                            ? "bg-transparent"
                            : "bg-white/[0.02]"
                       }
                      >
                        <td className="px-4 py-3 text-white font-medium align-top">
                          {row.need}
                        </td>
                        <td
                          className="px-4 py-3 font-medium align-top"
                          style={{
                            color:
                              row.pick === "Claru"
                                ? "#92B090"
                                : "rgba(255,255,255,0.7)",
                         }}
                        >
                          {row.pick}
                        </td>
                        <td className="px-4 py-3 align-top">
                          {row.why}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-6">
                Some teams use both: a broad marketplace like Luel for
                early exploration and raw visual diversity, then Claru
                for production-quality enriched datasets once the model
                architecture and data requirements are defined. The two
                serve different functions. Think of it like choosing a
                general contractor versus a structural engineer — both
                are valuable, but for different parts of the project.
              </p>
            </div>
          </div>
        </section>

        {/* ── Related Resources ────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Related Resources
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  href: "/physical-ai-training-data",
                  title: "Physical AI Training Data",
                  desc: "Deep dive into the data modalities physical AI systems need.",
               },
                {
                  href: "/training-data-for-robotics",
                  title: "Training Data for Robotics",
                  desc: "Purpose-built datasets for robot learning, from egocentric video to teleoperation demos.",
               },
                {
                  href: "/egocentric-video-datasets",
                  title: "Egocentric Video Datasets",
                  desc: "First-person video data for visuomotor policies and embodied AI research.",
               },
                {
                  href: "/embodied-ai-datasets",
                  title: "Embodied AI Datasets",
                  desc: "Datasets for agents that perceive and act in the physical world.",
               },
                {
                  href: "/compare/scale-ai-alternatives",
                  title: "Scale AI Alternatives",
                  desc: "How Claru compares to Scale AI for physical AI training data.",
               },
                {
                  href: "/compare/appen-alternatives",
                  title: "Appen Alternatives",
                  desc: "Appen vs Claru for robotics and embodied AI data.",
               },
                {
                  href: "/compare/labelbox-alternatives",
                  title: "Labelbox Alternatives",
                  desc: "Annotation platform vs end-to-end data service for physical AI.",
               },
                {
                  href: "/compare/surge-ai-alternatives",
                  title: "Surge AI Alternatives",
                  desc: "Beyond NLP annotation: end-to-end data for robotics and world models.",
               },
                {
                  href: "/about",
                  title: "About Claru",
                  desc: "Meet the team behind Claru's physical AI data infrastructure.",
               },
                {
                  href: "/data-catalog",
                  title: "Browse the Data Catalog",
                  desc: "Explore Claru's 25+ commercially licensed datasets.",
               },
                {
                  href: "/case-studies",
                  title: "Case Studies",
                  desc: "Real project outcomes with metrics and methodology documentation.",
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

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
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

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section className="w-full py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              See How Claru&apos;s Enriched Data Accelerates Your
              Pipeline
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Tell us what you are building and we will show you how
              Claru&apos;s enriched datasets fit into your training
              pipeline. No pitch deck — just a technical conversation
              about your data requirements.
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
