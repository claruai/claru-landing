import type { Metadata } from "next";
import Link from "next/link";
import GeoPageShell from "@/app/components/content/GeoPageShell";

// =============================================================================
// META
// =============================================================================

export const metadata: Metadata = {
  title: "Egocentric Video Data for Physical AI | Claru",
  description:
    "Commercially licensed egocentric video data from Claru. 20+ environment types, hand detection, activity labels, and spatial annotations. Request a sample pack.",
  keywords: [
    "egocentric video data",
    "egocentric video collection",
    "first-person video data",
    "egocentric data provider",
    "VLA training data",
    "embodied AI training data",
    "AR VR training data",
    "egocentric video annotations",
    "hand detection video data",
    "physical AI training data",
  ],
  openGraph: {
    title: "Egocentric Video Data for Physical AI | Claru",
    description:
      "Commercially licensed egocentric video data. 20+ environment types, hand detection, activity labels, depth maps. 10,000+ collectors, 100+ cities.",
    type: "article",
    url: "https://claru.ai/egocentric-video-data",
    siteName: "Claru",
    images: [
      {
        url: "/images/og-v2.webp",
        width: 1200,
        height: 630,
        alt: "Claru — Egocentric Video Data for Physical AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Egocentric Video Data for Physical AI | Claru",
    description:
      "Commercially licensed egocentric video. 20+ environments, hand detection, activity labels, depth maps. Sample packs from $500.",
  },
  alternates: {
    canonical: "https://claru.ai/egocentric-video-data",
  },
};

// =============================================================================
// FAQ JSON-LD
// =============================================================================

const faqItems = [
  {
    question: "What is egocentric video data?",
    answer:
      "Egocentric video data is footage recorded from a first-person perspective — typically a camera worn on the head, chest, or wrist of a human performing real-world activities. The camera captures what the wearer sees: their hands reaching for objects, the surfaces they interact with, the spatial layout of the environment around them. This viewpoint is architecturally significant for AI training because it matches the visual input a robot, AR headset, or wearable device receives in deployment. Models trained on egocentric video learn to interpret scenes, recognize hand-object interactions, and infer intent from the same perspective they will encounter in the real world — without requiring a viewpoint transformation that third-person training data would necessitate.",
  },
  {
    question: "How is egocentric data different from surveillance or dashcam footage?",
    answer:
      "Surveillance and dashcam footage is recorded from a fixed external viewpoint — a camera mounted on a wall or vehicle that observes activity from outside. Egocentric data is captured from the first-person perspective of the person performing the activity. Three differences matter for AI training. First, viewpoint: egocentric video shows the hands, tools, and objects the person is directly manipulating, not a bird's-eye view of the same scene. Second, attention signal: in egocentric footage, the camera naturally follows where the person looks and reaches — this implicit attention signal tells a model which parts of the scene are task-relevant. Third, occlusion: the occlusion patterns in egocentric video (hands blocking objects, objects blocking other objects during manipulation) match what a deployed robot or AR system will actually encounter. Surveillance footage does not contain this information in a usable form for embodied AI training.",
  },
  {
    question: "What environments can you collect egocentric video in?",
    answer:
      "Claru collects egocentric video across 20+ environment categories: restaurants and commercial kitchens, hair and nail salons, farms and agricultural settings, retail and grocery stores, hiking trails and outdoor paths, construction sites, heavy equipment operation, offices, clinics and waiting rooms, gyms and fitness facilities, research labs, sewing and textile work, ceramics studios, jewelry workshops, sidewalks and urban pedestrian environments, transit (buses, trains, stations), residential yards and outdoor home spaces, pharmacies, parks, and commercial storefronts. Custom environment types not on this list are available on request — if your use case requires a specific setting, Claru can recruit collectors with direct access to that environment.",
  },
  {
    question: "How quickly can I get a sample pack?",
    answer:
      "For standard environments, Claru maintains a pre-collected archive of 156+ approved clips across common categories. A sample pack of 10–15 clips can typically be delivered within 48 hours of request. For custom environments or specific activity protocols, collection campaigns produce first clips within 3–5 business days of task specification sign-off. Full dataset campaigns (500+ clips) typically run 2–4 weeks depending on environment availability and geographic requirements. Minimum viable sample packs start at $500–$2,000 for 10–15 clips with basic metadata; pricing for annotated packs depends on annotation layers required.",
  },
  {
    question: "What format is the data delivered in?",
    answer:
      "Video files are delivered as MP4 (H.264 or H.265) or MOV. Resolution ranges from 1080p to 4K; frame rate is 25–60 fps; clip duration is typically 40–180 seconds. Annotation layers are delivered as Parquet files for tabular metadata (activity labels, environment tags, contributor metadata), NumPy arrays for dense per-frame annotations (depth maps, segmentation masks), and JSON for structured labels (hand bounding boxes, pose keypoints, object detections). Datasets can be delivered via S3, GCS, or direct download. WebDataset format (tar shards with co-located video and annotation files) is available for streaming training pipelines. All deliveries include a manifest with SHA-256 checksums and a datasheet documenting collection methodology and known limitations.",
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
// PAGE
// =============================================================================

export default function EgocentricVideoDataPage() {
  return (
    <>
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
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                }}
              >
                <li>
                  <Link href="/" className="transition-colors hover:text-white">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="select-none">/</li>
                <li aria-current="page" style={{ color: "#92B090" }}>
                  Egocentric Video Data
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
              Egocentric Video Data for Physical AI
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl text-white/70">
              Egocentric (first-person) video data is footage recorded from
              the perspective of a person performing real-world activities
              &mdash; captured with head-mounted cameras, GoPro-style rigs,
              or smart glasses. Because this viewpoint matches what a
              robot&apos;s or AR headset&apos;s camera sees, egocentric data
              is the primary training modality for visuomotor policies,
              world models, embodied AI agents, and hand-interaction
              research. Claru provides commercially licensed egocentric
              video with multi-layer annotations from 10,000+ collectors in
              100+ cities.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-medium transition-all"
                style={{ backgroundColor: "#92B090", color: "#0a0908" }}
              >
                Request a Sample Pack
              </Link>
              <Link
                href="/egocentric-video-datasets"
                className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-medium border border-white/20 text-white transition-colors hover:bg-white/5"
              >
                Browse the Dataset
              </Link>
            </div>
          </div>
        </section>

        {/* ── What Makes Our Data Different ───────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-10">
              What Makes Claru&apos;s Egocentric Data Different
            </h2>

            <div className="space-y-8">
              {[
                {
                  heading: "20+ environment types, not just kitchens",
                  body: "Most egocentric datasets are concentrated in kitchen or lab settings. Claru captures across 20+ categories — restaurants, farms, clinics, construction sites, salons, gyms, transit, storefronts, and more — giving models exposure to the full range of real-world environments they will encounter at deployment.",
                },
                {
                  heading: "Multi-layer enrichment on every clip",
                  body: "Raw video ships with hand bounding boxes, activity classification labels, object detection, and optional depth maps and spatial segmentation. Each clip arrives as a complete training-ready unit — not raw footage that requires a separate annotation pipeline before you can use it.",
                },
                {
                  heading: "Custom collection on demand, delivered in days",
                  body: "If the environment or task you need is not in the existing archive, Claru can deploy collectors specifically for it. Task specifications are turned around in 48 hours; most custom campaigns produce first clips within one week. Minimum viable sample packs start at 10–15 clips.",
                },
              ].map((item) => (
                <div
                  key={item.heading}
                  className="border-l-2 pl-6"
                  style={{ borderColor: "rgba(146,176,144,0.4)" }}
                >
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {item.heading}
                  </h3>
                  <p className="text-white/70 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Use Cases ───────────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Use Cases
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Egocentric video powers three converging research areas where
              first-person observation is not a preference but a requirement.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "VLA Model Training",
                  subtitle: "Vision-Language-Action",
                  body: "VLA models like OpenVLA, RT-2, and pi-zero map visual observations directly to robot actions. Training these models requires large volumes of first-person video that matches the robot's onboard camera perspective. Egocentric data from Claru provides the observation-action pairs these architectures need, particularly for manipulation tasks where hand-object interaction is the critical signal. See the complete guide to",
                  link: "/vla-training-data-guide",
                  linkText: "VLA training data",
                },
                {
                  title: "Embodied AI and Robot Learning",
                  subtitle: "Visuomotor Policies",
                  body: "Robots learning from imitation require demonstrations that match their embodiment's camera viewpoint. A manipulator arm with a wrist camera sees the world the same way a person wearing a wrist-mounted GoPro does. Claru's egocentric captures — collected across real workplaces, homes, and outdoor environments — provide the behavioral diversity these policies need to generalize beyond the training lab.",
                  link: "/embodied-ai-datasets",
                  linkText: "Embodied AI datasets",
                },
                {
                  title: "AR/VR and HCI Research",
                  subtitle: "Human-Computer Interaction",
                  body: "Augmented and mixed reality systems that understand user intent must recognize what hands are doing, what objects are nearby, and what action is being performed — all from the first-person perspective of the headset wearer. Egocentric video annotated with hand detection, gaze-aligned activity labels, and object interactions provides the supervision signal for these understanding models.",
                  link: "/physical-ai-training-data",
                  linkText: "Physical AI training data",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-6 flex flex-col"
                >
                  <div className="mb-4">
                    <div
                      className="text-xs font-mono uppercase tracking-wider mb-1"
                      style={{ color: "#92B090" }}
                    >
                      {card.subtitle}
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed flex-1">
                    {card.body}{" "}
                    <Link
                      href={card.link}
                      className="underline underline-offset-2 transition-colors"
                      style={{ color: "#92B090" }}
                    >
                      {card.linkText}
                    </Link>
                    .
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Environment Types ────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Environment Types
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Diverse environments are not a bonus — they are the whole
              point. A model that only saw kitchens during training will fail
              in a warehouse. Claru covers 20+ categories from the start.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[
                "Restaurants",
                "Hair / Nail Salons",
                "Farms",
                "Retail / Grocery",
                "Trails",
                "Construction Sites",
                "Heavy Equipment",
                "Offices",
                "Clinics / Waiting Rooms",
                "Gyms",
                "Labs",
                "Sewing / Textiles",
                "Ceramics Studios",
                "Jewelry Workshops",
                "Sidewalks",
                "Transit",
                "Residential Yards",
                "Pharmacies",
                "Parks",
                "Storefronts",
              ].map((env) => (
                <div
                  key={env}
                  className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white/80 font-mono"
                >
                  {env}
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm text-white/50">
              Custom environments available on request &mdash; contact us
              with your task specification.
            </p>
          </div>
        </section>

        {/* ── Technical Specifications ─────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-10">
              Sample Data Specifications
            </h2>

            <div className="rounded-lg border border-white/10 overflow-hidden">
              <div
                className="px-5 py-3 border-b border-white/10 text-xs font-mono uppercase tracking-wider"
                style={{ color: "#92B090", backgroundColor: "rgba(146,176,144,0.06)" }}
              >
                Clip Properties
              </div>
              <div className="divide-y divide-white/10">
                {[
                  { label: "Resolution", value: "1080p – 4K" },
                  { label: "Frame rate", value: "25 – 60 fps" },
                  { label: "Clip duration", value: "40 – 180 seconds" },
                  { label: "Format", value: "MP4 (H.264 / H.265), MOV" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center px-5 py-3 gap-6"
                  >
                    <span className="w-40 text-sm text-white/50 font-mono shrink-0">
                      {row.label}
                    </span>
                    <span className="text-sm text-white">{row.value}</span>
                  </div>
                ))}
              </div>

              <div
                className="px-5 py-3 border-t border-b border-white/10 text-xs font-mono uppercase tracking-wider mt-0"
                style={{ color: "#92B090", backgroundColor: "rgba(146,176,144,0.06)" }}
              >
                Annotation Layers Available
              </div>
              <div className="divide-y divide-white/10">
                {[
                  {
                    label: "Hand detection",
                    value: "Bounding boxes per frame with left/right classification",
                  },
                  {
                    label: "Activity classification",
                    value: "Clip-level and segment-level verb-noun action labels",
                  },
                  {
                    label: "Object detection",
                    value: "COCO-compatible bounding boxes, 100+ categories",
                  },
                  {
                    label: "Depth maps",
                    value: "Per-frame monocular depth (16-bit PNG or float32 NumPy)",
                  },
                  {
                    label: "Semantic segmentation",
                    value: "Per-pixel class labels + instance IDs (on request)",
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex flex-col sm:flex-row sm:items-center px-5 py-3 gap-1 sm:gap-6"
                  >
                    <span className="sm:w-44 text-sm text-white/50 font-mono shrink-0">
                      {row.label}
                    </span>
                    <span className="text-sm text-white">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ───────────────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  stat: "10,000+",
                  label: "Collectors",
                  context: "in 100+ cities across 14+ countries",
                },
                {
                  stat: "20+",
                  label: "Environment types",
                  context: "covered in the standard collection catalogue",
                },
                {
                  stat: "156+",
                  label: "Pre-approved clips",
                  context: "available for immediate sample delivery",
                },
                {
                  stat: "48 hrs",
                  label: "Sample turnaround",
                  context: "from request to delivery for standard environments",
                },
              ].map((item) => (
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

        {/* ── FAQ ─────────────────────────────────────────────────────── */}
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
                  <p className="text-white/70 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Related Resources ───────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Related Resources
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  href: "/vla-training-data-guide",
                  title: "VLA Training Data: The Complete Guide",
                  desc: "How to source, structure, and enrich data for OpenVLA, RT-2, pi-zero, and GR00T.",
                },
                {
                  href: "/egocentric-video-datasets",
                  title: "Egocentric Video Datasets",
                  desc: "500K+ first-person clips with depth, segmentation, and pose annotations.",
                },
                {
                  href: "/embodied-ai-datasets",
                  title: "Embodied AI Datasets",
                  desc: "Training data for agents that perceive and act in the physical world.",
                },
                {
                  href: "/training-data-for-robotics",
                  title: "Training Data for Robotics",
                  desc: "Complete overview of robotics training data types, collection, and annotation.",
                },
                {
                  href: "/physical-ai-training-data",
                  title: "Physical AI Training Data",
                  desc: "Real-world datasets for models that understand physics and manipulate objects.",
                },
                {
                  href: "/blog/best-egocentric-data-providers",
                  title: "Best Egocentric Data Providers (2026)",
                  desc: "Comparison of commercial and academic egocentric video sources.",
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
                    <div className="text-xs text-white/50 mt-1">{link.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <section className="w-full py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Request a Sample Pack
            </h2>
            <p className="text-white/70 text-lg mb-2 max-w-2xl mx-auto">
              10–15 annotated egocentric clips from any environment type.
              Delivered within 48 hours for standard categories.
            </p>
            <p className="text-white/40 text-sm mb-8">
              Sample packs from $500. Full dataset pricing on request.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-medium transition-all"
                style={{ backgroundColor: "#92B090", color: "#0a0908" }}
              >
                Request a Sample Pack
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
