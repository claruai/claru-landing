import type { Metadata } from "next";
import Link from "next/link";
import GeoPageShell from "@/app/components/content/GeoPageShell";

// =============================================================================
// META
// =============================================================================

export const metadata: Metadata = {
  title:
    "Egocentric Video Datasets: First-Person Video Data for Embodied AI | Claru",
  description:
    "Commercial egocentric video datasets from Claru. 500K+ first-person clips with depth, segmentation, and pose annotations. A scalable alternative to Ego4D.",
  keywords: [
    "egocentric video data",
    "egocentric video dataset",
    "first-person video dataset",
    "egocentric data collection",
    "ego4d alternative",
    "epic kitchens alternative",
    "first person video AI",
    "wearable camera dataset",
    "egocentric activity recognition",
    "egocentric video annotation",
  ],
  openGraph: {
    title:
      "Egocentric Video Datasets: First-Person Video Data for Embodied AI",
    description:
      "Commercial egocentric video datasets from Claru. 500K+ first-person clips, multi-layer annotations. Scalable alternative to Ego4D.",
    type: "article",
    url: "https://claru.ai/egocentric-video-datasets",
    siteName: "Claru",
    images: [
      {
        url: "/images/og-v2.webp",
        width: 1200,
        height: 630,
        alt: "Claru — Egocentric Video Datasets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Egocentric Video Datasets | Claru",
    description:
      "First-person video data for embodied AI. 500K+ clips, 10,000+ contributors, multi-layer annotations.",
  },
  alternates: {
    canonical: "https://claru.ai/egocentric-video-datasets",
  },
};

// =============================================================================
// FAQ JSON-LD
// =============================================================================

const faqItems = [
  {
    question: "What is egocentric video data?",
    answer:
      "Egocentric video data is video recorded from a first-person perspective, typically using a wearable camera mounted on the head, chest, or wrist. Unlike third-person video (recorded from a fixed external viewpoint), egocentric video captures what the wearer sees — the same viewpoint that a robot's head or wrist camera would have. This makes egocentric data uniquely valuable for training embodied AI systems: visuomotor policies, world models, activity recognition systems, and hand-object interaction models. Egocentric video naturally captures attention (where the person looks), intention (what they reach for), and manipulation (how they grasp and use objects) in a way that third-person video cannot.",
  },
  {
    question: "How is Claru's egocentric data different from Ego4D?",
    answer:
      "Ego4D is a large-scale academic dataset released by a consortium of universities. It provides 3,670 hours of egocentric video from 923 participants across 9 countries with standardized benchmarks. Claru's egocentric data differs in several important ways. First, commercial licensing: Ego4D restricts commercial use and requires academic affiliation, while Claru's data is fully commercially licensed for production training. Second, scale on demand: Ego4D is a fixed dataset; Claru can collect additional egocentric data on demand — specific environments, specific tasks, specific camera configurations — through a network of 10,000+ contributors. Third, enrichment depth: Claru provides 6+ annotation layers per clip (depth, segmentation, pose, optical flow, captions, action labels) as standard; Ego4D provides annotations for specific benchmark tasks. Fourth, freshness: Ego4D was collected over a fixed time period; Claru continuously collects new data, ensuring the dataset reflects current environments and objects.",
  },
  {
    question: "What environments does Claru collect egocentric video in?",
    answer:
      "Claru collects egocentric video across 12+ environment categories: residential kitchens and living spaces, commercial kitchens and restaurants, retail stores and shopping environments, warehouses and logistics facilities, manufacturing and assembly lines, office environments, outdoor urban spaces (sidewalks, parks, transit), outdoor rural and agricultural settings, workshops (carpentry, metalwork, electronics repair), healthcare and clinical settings, gyms and fitness facilities, and vehicle interiors. Each environment category includes multiple specific locations to ensure visual diversity — different lighting conditions, layouts, object arrangements, and cultural contexts across 100+ cities worldwide.",
  },
  {
    question: "What annotation layers are available on egocentric video?",
    answer:
      "Claru provides six standard annotation layers on egocentric video clips. Monocular depth estimation: per-frame depth maps providing 3D spatial information. Semantic segmentation: per-pixel object class labels (100+ categories). Instance segmentation: per-pixel instance IDs distinguishing individual objects of the same class. Human and hand pose estimation: 2D and 3D joint positions for full body and detailed hand articulation, critical for understanding manipulation. Optical flow: dense motion vectors between consecutive frames, capturing dynamic scene information. AI-generated captions: natural language descriptions of activities, objects, and spatial relationships in each clip. Additional custom annotation layers — action boundary labels, object affordance annotations, gaze estimation — are available on request.",
  },
  {
    question: "How many egocentric video clips does Claru have?",
    answer:
      "Claru's egocentric video collection contains 500,000+ clips across three parallel capture pipelines. The wearable camera pipeline has produced 386,000+ clips from GoPro and similar cameras worn during real-world activities. The smartphone capture pipeline adds clips recorded from phone-mounted cameras in complementary scenarios. The activity-specific pipeline collects targeted clips for particular tasks (cooking specific recipes, performing specific assembly operations, navigating specific routes) based on client requirements. The collection is continuously growing — Claru's network of 10,000+ contributors can be deployed to collect additional data for specific environments, tasks, or scenarios within days.",
  },
  {
    question: "Can Claru collect egocentric data for a specific task or environment?",
    answer:
      "Yes. Custom egocentric data collection is one of Claru's core services. The process starts with a task specification developed in collaboration with the client's ML team: what activities need to be captured, in what environments, from what camera viewpoint (head-mounted, chest-mounted, wrist-mounted), at what resolution and frame rate, and with what metadata. Claru then deploys contributors from its 10,000+ person network who match the environmental requirements (e.g., baristas for coffee shop data, warehouse workers for logistics data, home cooks for kitchen data). Collection campaigns typically produce first clips within 48 hours and can scale to thousands of clips per week. All custom data comes with the full enrichment pipeline (depth, segmentation, pose, flow, captions) and a project-specific quality assurance process.",
  },
  {
    question: "What formats is egocentric video data delivered in?",
    answer:
      "Claru delivers egocentric video datasets in the formats robotics and ML teams actually use. Video files are delivered as MP4 (H.264 or H.265 encoding) or as extracted frame sequences in PNG or WebP format. Annotations are delivered as Parquet files (for tabular metadata), NumPy arrays (for dense annotations like depth maps and segmentation masks), and JSON (for structured labels like pose keypoints and action boundaries). For streaming training at scale, Claru packages datasets in WebDataset format (tar shards with co-located video and annotation files). HDF5 and RLDS formats are available for reinforcement learning pipelines. All deliveries include a manifest file with SHA-256 checksums and a datasheet documenting collection methodology, annotator demographics, and known limitations.",
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

export default function EgocentricVideoDatasetsPage() {
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
                  Egocentric Video Datasets
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
              Egocentric Video Datasets: First-Person Video Data for
              Embodied AI
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl text-white/70">
              Robots see the world from their own perspective. Training
              data should match that perspective. Claru provides
              commercially licensed egocentric video with multi-layer
              annotations &mdash; 500,000+ clips from 10,000+ contributors
              in 100+ cities, enriched with depth, segmentation, pose, and
              action labels.
            </p>
          </div>
        </section>

        {/* ── What Is Egocentric Video ────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              What Is Egocentric Video and Why It Matters for AI
            </h2>

            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Egocentric (first-person) video is recorded from the
                perspective of the person performing an activity. A camera
                worn on the head, chest, or wrist captures what the wearer
                sees &mdash; the same viewpoint a robot&apos;s onboard camera
                would have.
              </p>

              <p>
                This viewpoint distinction is not cosmetic. It is
                architecturally fundamental for several reasons:
              </p>

              <ul className="space-y-3 pl-4">
                {[
                  {
                    bold: "Viewpoint matching.",
                    text: "A visuomotor policy trained on third-person video must learn an implicit viewpoint transformation before it can predict actions from first-person observations. Egocentric training data eliminates this unnecessary learning burden.",
                  },
                  {
                    bold: "Attention signal.",
                    text: "In egocentric video, the camera naturally points where the person is looking and reaching. This implicit attention signal is free information for models learning which objects and regions are task-relevant.",
                  },
                  {
                    bold: "Hand-object interaction.",
                    text: "Egocentric cameras capture detailed views of hand-object interactions — precisely the manipulation information robotics models need to learn grasping, tool use, and assembly.",
                  },
                  {
                    bold: "Occlusion patterns.",
                    text: "The occlusion patterns in egocentric video (hands occluding objects, objects occluding each other from the manipulator's perspective) match the occlusion patterns a deployed robot will encounter.",
                  },
                ].map((item) => (
                  <li key={item.bold} className="flex gap-2">
                    <span className="text-white/30 select-none">&bull;</span>
                    <span>
                      <strong className="text-white">{item.bold}</strong>{" "}
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>

              <p>
                As the robotics field has converged on visuomotor policies
                (models that directly map visual observations to motor
                commands), egocentric video has become the most important
                single data modality for robot learning.
              </p>
            </div>
          </div>
        </section>

        {/* ── Comparison with Academic Datasets ───────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Egocentric Video Datasets: Academic vs. Commercial
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Several academic egocentric datasets exist. Here is how they
              compare to Claru&apos;s commercially licensed collection.
            </p>

            {/* Comparison Table */}
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                      Feature
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                      Ego4D
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                      EPIC-KITCHENS
                    </th>
                    <th
                      className="px-4 py-3 font-mono text-xs uppercase tracking-wider"
                      style={{ color: "#92B090" }}
                    >
                      Claru
                    </th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  {[
                    {
                      feature: "Total Hours",
                      ego4d: "3,670 hours",
                      epic: "100+ hours",
                      claru: "10,000+ hours (growing)",
                    },
                    {
                      feature: "Clip Count",
                      ego4d: "~9,600 videos",
                      epic: "~90,000 clips",
                      claru: "500,000+ clips",
                    },
                    {
                      feature: "Contributors",
                      ego4d: "923 participants",
                      epic: "45 participants",
                      claru: "10,000+ contributors",
                    },
                    {
                      feature: "Geographic Spread",
                      ego4d: "9 countries",
                      epic: "4 cities",
                      claru: "100+ cities, 14+ countries",
                    },
                    {
                      feature: "Environment Types",
                      ego4d: "Mixed (daily activities)",
                      epic: "Kitchens only",
                      claru: "12+ categories (kitchen, warehouse, workshop, retail, outdoor, etc.)",
                    },
                    {
                      feature: "Commercial License",
                      ego4d: "No (research only)",
                      epic: "No (research only)",
                      claru: "Yes (full commercial rights)",
                    },
                    {
                      feature: "Custom Collection",
                      ego4d: "No (fixed dataset)",
                      epic: "No (fixed dataset)",
                      claru: "Yes (task-specific, on demand)",
                    },
                    {
                      feature: "Depth Annotations",
                      ego4d: "Limited",
                      epic: "No",
                      claru: "Yes (monocular depth on all clips)",
                    },
                    {
                      feature: "Segmentation",
                      ego4d: "Partial (benchmark subsets)",
                      epic: "Partial (object detections)",
                      claru: "Yes (semantic + instance on all clips)",
                    },
                    {
                      feature: "Hand Pose",
                      ego4d: "Partial (benchmark subsets)",
                      epic: "No",
                      claru: "Yes (2D + 3D hand pose on all clips)",
                    },
                    {
                      feature: "Freshness",
                      ego4d: "Fixed (2022 collection)",
                      epic: "Fixed (2018-2023 collection)",
                      claru: "Continuously updated (new data weekly)",
                    },
                  ].map((row, i) => (
                    <tr
                      key={row.feature}
                      className={
                        i % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                      }
                    >
                      <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                        {row.feature}
                      </td>
                      <td className="px-4 py-3">{row.ego4d}</td>
                      <td className="px-4 py-3">{row.epic}</td>
                      <td className="px-4 py-3 font-medium text-white">
                        {row.claru}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 space-y-4 text-white/80 leading-relaxed">
              <p>
                Academic datasets like Ego4D and EPIC-KITCHENS have been
                invaluable for advancing egocentric vision research. They
                provide standardized benchmarks that enable fair comparison
                across methods.
              </p>
              <p>
                However, they were not designed for commercial production
                use. Licensing restrictions prevent use in proprietary
                training pipelines. Fixed datasets cannot be expanded to
                cover new environments or tasks. Annotation coverage is
                limited to specific benchmark tasks rather than the full
                enrichment stack ML teams need.
              </p>
              <p>
                Claru provides the commercial alternative:{" "}
                <strong className="text-white">
                  fully licensed egocentric video that can be expanded,
                  customized, and enriched
                </strong>{" "}
                to the exact specifications your training pipeline
                requires.
              </p>
            </div>
          </div>
        </section>

        {/* ── Types of Egocentric Data ────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Types of Egocentric Video Data
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Claru collects egocentric video across diverse activity
              categories to support different physical AI use cases.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Kitchen and Food Preparation",
                  content:
                    "Cooking, food prep, dishwashing, kitchen organization. Covers 200+ kitchen layouts with diverse cookware, ingredients, and appliance types. Critical for household robotics and restaurant automation research.",
                  stat: "120K+ clips",
                },
                {
                  title: "Workshop and Repair",
                  content:
                    "Carpentry, electronics repair, sewing, phone repair, small engine work. Captures fine-grained tool use and multi-step assembly operations. Essential for training dexterous manipulation policies.",
                  stat: "80K+ clips",
                },
                {
                  title: "Warehouse and Logistics",
                  content:
                    "Picking, packing, shelving, inventory management, cart operations. Collected in real commercial warehouses with authentic product variety and bin configurations. Directly applicable to warehouse robotics.",
                  stat: "60K+ clips",
                },
                {
                  title: "Retail and Commercial",
                  content:
                    "Shopping, product interaction, checkout operations, store navigation. Captures human behavior in commercial spaces for service robotics and retail automation applications.",
                  stat: "45K+ clips",
                },
                {
                  title: "Outdoor and Navigation",
                  content:
                    "Sidewalk walking, park navigation, urban traversal, transit use. Provides the visual and locomotion data needed for mobile robots, delivery systems, and autonomous navigation.",
                  stat: "90K+ clips",
                },
                {
                  title: "Custom Task-Specific",
                  content:
                    "Targeted collection for client-specific tasks: specific manufacturing operations, specific household routines, specific agricultural activities. Collected on demand with custom protocols developed with the client's ML team.",
                  stat: "On demand",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">
                      {card.title}
                    </h3>
                    <span
                      className="text-xs font-mono whitespace-nowrap ml-3"
                      style={{ color: "#92B090" }}
                    >
                      {card.stat}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {card.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Annotation Layers ───────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Annotation Layers on Every Clip
            </h2>
            <p className="text-white/70 mb-12 text-lg">
              Raw video is the starting point, not the deliverable. Claru
              enriches every egocentric clip with multiple annotation
              layers that provide the supervision signals ML models need.
            </p>

            <div className="space-y-8">
              {[
                {
                  layer: "Monocular Depth Estimation",
                  description:
                    "Per-frame depth maps computed using state-of-the-art monocular depth models. Provides metric or relative depth at every pixel, enabling 3D scene understanding from a single camera. Depth maps are calibrated against LiDAR ground truth where available and cross-validated against segmentation boundaries for geometric consistency.",
                  format: "16-bit PNG or NumPy float32 arrays",
                },
                {
                  layer: "Semantic and Instance Segmentation",
                  description:
                    "Per-pixel labels with 100+ object categories (furniture, appliances, food items, tools, containers, surfaces) plus instance IDs distinguishing individual objects. Enables models to identify what objects are present, where they are, and which specific instance is being interacted with.",
                  format: "Indexed PNG masks or NumPy uint16 arrays",
                },
                {
                  layer: "Human and Hand Pose Estimation",
                  description:
                    "Full-body 2D and 3D joint positions (17+ keypoints) plus detailed hand articulation (21 keypoints per hand). Critical for understanding manipulation: which fingers are in contact with which object, what grasp type is being used, what is the hand trajectory during a reaching motion.",
                  format: "JSON keypoint arrays or COCO-format annotations",
                },
                {
                  layer: "Optical Flow",
                  description:
                    "Dense motion vectors between consecutive frames, capturing both camera motion and object motion. Optical flow provides the dynamic information that complements the static information in depth and segmentation — it reveals which parts of the scene are moving, how fast, and in what direction.",
                  format: "Float16 flow fields in .flo or NumPy format",
                },
                {
                  layer: "AI-Generated Captions",
                  description:
                    "Natural language descriptions of the activity, objects, and spatial relationships in each clip. Generated by vision-language models and validated for accuracy. Enables language-grounded learning — training models to associate visual observations with natural language instructions.",
                  format: "UTF-8 text with per-clip and per-segment granularity",
                },
                {
                  layer: "Action Boundary Labels",
                  description:
                    "Temporal annotations marking the start and end of discrete actions within each clip: reach, grasp, lift, transport, place, cut, pour, stir. Labels follow a structured verb-noun taxonomy developed for robotics applications. Available on request as a custom annotation layer.",
                  format: "JSON with timestamp ranges and verb-noun labels",
                },
              ].map((ann) => (
                <div
                  key={ann.layer}
                  className="border-l-2 pl-6"
                  style={{ borderColor: "rgba(146,176,144,0.4)" }}
                >
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {ann.layer}
                  </h3>
                  <p className="text-white/70 leading-relaxed mb-2">
                    {ann.description}
                  </p>
                  <span className="text-xs font-mono text-white/40">
                    Format: {ann.format}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Collection Methodology ──────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              How Claru Collects Egocentric Video at Scale
            </h2>

            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Claru operates three parallel egocentric capture
                pipelines, each optimized for different collection
                scenarios:
              </p>

              <div className="space-y-6 pl-4 border-l border-white/10">
                <div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    Pipeline 1: Wearable Camera Network
                  </h3>
                  <p>
                    10,000+ contributors worldwide are equipped with GoPro
                    or similar wearable cameras and capture video during
                    their regular activities. Contributors are recruited
                    from specific demographic and occupational backgrounds
                    to ensure environmental diversity. A barista captures
                    coffee shop operations. A warehouse worker captures
                    logistics activities. A home cook captures kitchen
                    tasks. This distributed approach produces data from the
                    true distribution of real-world environments —
                    diversity that no lab or studio setup can replicate.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    Pipeline 2: Managed Smartphone Capture
                  </h3>
                  <p>
                    For scenarios where wearable cameras are impractical,
                    contributors use phone-mounted cameras following
                    specific protocols for angle, stability, and duration.
                    This pipeline is faster to deploy (no hardware
                    shipping) and captures complementary viewpoints.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    Pipeline 3: Activity-Specific Collection
                  </h3>
                  <p>
                    Targeted campaigns designed for specific client
                    requirements. Example: a client needs 5,000 clips of
                    hand-washing procedures in commercial kitchens. Claru
                    recruits contributors from the target demographic,
                    develops a task protocol specifying camera placement,
                    lighting requirements, and activity sequence, and
                    deploys the campaign. First clips are available within
                    48 hours. Same-day quality assurance catches issues
                    early.
                  </p>
                </div>
              </div>

              <p>
                All three pipelines feed into the same enrichment stack:
                depth, segmentation, pose, flow, and captions are computed
                automatically, then validated by human annotators. The
                result is a continuously growing egocentric video
                collection with consistent annotation quality regardless
                of capture source.
              </p>
            </div>
          </div>
        </section>

        {/* ── Stats ───────────────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-10">
              Collection at a Glance
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  stat: "500K+",
                  label: "Egocentric clips",
                  context: "across 12+ environment categories",
                },
                {
                  stat: "10,000+",
                  label: "Contributors",
                  context: "in 100+ cities across 14+ countries",
                },
                {
                  stat: "386K+",
                  label: "Wearable camera clips",
                  context: "from the GoPro capture pipeline alone",
                },
                {
                  stat: "6+",
                  label: "Annotation layers",
                  context: "depth, segmentation, pose, flow, captions, actions",
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

        {/* ── Related Resources ───────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Related Solutions and Case Studies
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  href: "/egocentric-video-data",
                  title: "Egocentric Video Data for Physical AI",
                  desc: "Buyer's guide: environments covered, annotation types, sample pack pricing, and turnaround.",
                },
                {
                  href: "/training-data-for-robotics",
                  title: "Training Data for Robotics",
                  desc: "Complete overview of robotics training data types and collection.",
                },
                {
                  href: "/physical-ai-training-data",
                  title: "Physical AI Training Data",
                  desc: "Real-world datasets for models that understand physics.",
                },
                {
                  href: "/embodied-ai-datasets",
                  title: "Embodied AI Datasets",
                  desc: "Training data for agents that act in the real world.",
                },
                {
                  href: "/case-studies/egocentric-video-collection",
                  title: "Case Study: Egocentric Video Collection",
                  desc: "Large-scale first-person capture across 500 contributors.",
                },
                {
                  href: "/case-studies/workplace-egocentric-data",
                  title: "Case Study: Workplace Egocentric Data",
                  desc: "Egocentric video from 10 workplace categories.",
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

        {/* ── FAQ ─────────────────────────────────────────────────────── */}
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
                  <p className="text-white/70 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <section className="w-full py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Need Egocentric Video for Your Model?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Whether you need to license existing egocentric datasets or
              commission custom collection for specific tasks and
              environments, Claru can help.
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
