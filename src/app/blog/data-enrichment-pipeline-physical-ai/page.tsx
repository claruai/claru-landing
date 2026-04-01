import type { Metadata } from "next";
import Link from "next/link";
import GeoPageShell from "@/app/components/content/GeoPageShell";

// =============================================================================
// META
// =============================================================================

export const metadata: Metadata = {
  title:
    "Data Enrichment Pipeline for Physical AI (2026) | Claru",
  description:
    "How Claru turns raw video into training-ready data with depth maps, pose estimation, segmentation, optical flow, action labels, and metadata at scale.",
  keywords: [
    "data enrichment pipeline",
    "physical AI data enrichment",
    "depth maps for robot training",
    "pose estimation training data",
    "segmentation masks robotics",
    "optical flow robot data",
    "Depth Anything V2",
    "ViTPose robotics",
    "SAM 3 segmentation",
    "RAFT optical flow",
    "video enrichment pipeline",
    "training data preprocessing",
    "robot perception data",
    "enriched training data",
  ],
  openGraph: {
    title:
      "Data Enrichment for Physical AI: Depth, Pose, and Segmentation at Scale",
    description:
      "Technical deep-dive into the 6-layer data enrichment pipeline that transforms raw video into training-ready data for physical AI.",
    type: "article",
    url: "https://claru.ai/blog/data-enrichment-pipeline-physical-ai",
    siteName: "Claru",
    images: [
      {
        url: "/images/og-v2.webp",
        width: 1200,
        height: 630,
        alt: "Data Enrichment for Physical AI — Claru",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Data Enrichment Pipeline for Physical AI (2026) | Claru",
    description:
      "Technical deep-dive into the 6-layer enrichment pipeline for physical AI training data.",
  },
  alternates: {
    canonical:
      "https://claru.ai/blog/data-enrichment-pipeline-physical-ai",
  },
};

// =============================================================================
// JSON-LD: Article
// =============================================================================

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Data Enrichment for Physical AI: Depth, Pose, and Segmentation at Scale",
  description:
    "Technical deep-dive into the 6-layer data enrichment pipeline that transforms raw video into training-ready data for physical AI. Covers Depth Anything V2, ViTPose, SAM 3, RAFT optical flow, InternVideo2, and structured metadata.",
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
    "https://claru.ai/blog/data-enrichment-pipeline-physical-ai",
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
      name: "Data Enrichment Pipeline for Physical AI",
      item: "https://claru.ai/blog/data-enrichment-pipeline-physical-ai",
    },
  ],
};

// =============================================================================
// FAQ JSON-LD
// =============================================================================

const faqItems = [
  {
    question: "What is data enrichment for physical AI?",
    answer:
      "Data enrichment for physical AI is the process of transforming raw video into multi-layered, training-ready data by adding computed annotation layers. Instead of delivering raw RGB frames, enriched data includes per-frame depth maps, human and hand pose estimation, semantic segmentation masks, optical flow fields, temporal action labels, and structured metadata. These layers provide the supervisory signals that physical AI models — particularly VLAs and world models — need to learn 3D spatial understanding, motion dynamics, and object affordances from 2D video.",
  },
  {
    question: "Why can't I just use raw video to train a robot?",
    answer:
      "Raw video provides only pixel-level RGB information. Physical AI models need to understand 3D geometry (how far away objects are), motion dynamics (how objects and people move), scene structure (which pixels belong to which objects), and temporal action structure (what actions are happening and when). Without enrichment layers, the model must learn all of these representations implicitly from raw pixels alone — requiring orders of magnitude more data and compute. Pre-computed enrichment layers provide explicit supervisory signals that dramatically reduce the data and compute needed for effective training.",
  },
  {
    question: "What models does Claru use for data enrichment?",
    answer:
      "Claru's enrichment pipeline uses state-of-the-art open models at each layer: Depth Anything V2 (NeurIPS 2024) for monocular depth estimation with models ranging from 25M to 1.3B parameters; ViTPose and ViTPose++ for 2D and 3D human body and hand pose estimation; SAM 3 (ICLR 2026) for concept-based semantic segmentation across images and video; RAFT for dense optical flow computation between frames; and InternVideo2 combined with expert human annotators for temporal action segmentation and natural language descriptions. All enrichment outputs are cross-validated for temporal consistency and geometric coherence.",
  },
  {
    question: "How much does it cost to build an enrichment pipeline in-house?",
    answer:
      "Building a production-grade enrichment pipeline in-house typically costs $50,000 to $200,000+ in engineering time, plus ongoing GPU compute costs. The engineering investment includes: integrating and optimizing 5-6 different model architectures, building frame-level synchronization and temporal consistency checks, implementing quality assurance and failure detection, scaling to handle hundreds of thousands of clips, and maintaining the pipeline as upstream models are updated. Teams also face a 2-4 month lead time before any enriched data is available for training. Using pre-enriched data from Claru eliminates this engineering overhead and time-to-data delay.",
  },
  {
    question: "What formats does enriched data come in?",
    answer:
      "Claru delivers enriched data in formats compatible with major ML training pipelines. Depth maps are delivered as 16-bit PNG or NumPy arrays with metric scale calibration. Pose estimation outputs come as COCO-format keypoint annotations with confidence scores. Segmentation masks use COCO RLE (Run-Length Encoding) for efficient storage. Optical flow is stored as .flo files or NumPy arrays. Action labels are delivered as temporal annotations with start/end timestamps and natural language descriptions. Complete datasets are packaged as WebDataset (for streaming), HDF5 (for dense arrays), RLDS (for VLA training), or Parquet (for metadata queries).",
  },
  {
    question: "How does enrichment quality affect model performance?",
    answer:
      "Enrichment quality directly impacts downstream model performance. Noisy depth maps teach incorrect spatial relationships, causing grasp planning failures. Inconsistent segmentation masks across frames create flickering object boundaries that confuse temporal reasoning. Missing or incorrect action labels result in models that cannot properly decompose tasks into executable sub-actions. Claru addresses quality through three mechanisms: cross-validation between enrichment layers (depth consistency checked against segmentation boundaries), temporal smoothness constraints (pose estimates validated against physics-based motion models), and human review of statistical outliers flagged by automated quality checks.",
  },
  {
    question: "Can enrichment be applied to existing datasets?",
    answer:
      "Yes. Claru can enrich existing video datasets that teams have already collected or licensed. This is common for teams that have raw teleoperation recordings, surveillance footage, or video datasets acquired from other providers that lack enrichment layers. The enrichment pipeline processes video at scale regardless of source, adding all six annotation layers. Teams retain their original data and receive enriched versions with all layers aligned to the source frame timestamps. This is often the fastest path to training-ready data for teams that already have relevant video content.",
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
// Enrichment layers data
// =============================================================================

const enrichmentLayers = [
  {
    number: "01",
    title: "Depth Estimation",
    model: "Depth Anything V2",
    modelLink: "https://depth-anything-v2.github.io/",
    paperVenue: "NeurIPS 2024",
    description:
      "Every frame receives a per-pixel depth map computed by Depth Anything V2, the state-of-the-art monocular depth estimation foundation model. The model offers configurations from 25M to 1.3B parameters and was trained on 595K synthetic images plus 62M+ real pseudo-labeled images. In robotics evaluations, 89.1% of near-field depth errors (within 2m) fall within 0.5m of ground truth, and it runs 10x faster than diffusion-based alternatives.",
    whyItMatters:
      "Depth maps provide the 3D spatial understanding that physical AI models need to plan reach, grasp, and place actions. Without depth, a model operating on 2D pixels alone cannot distinguish between a cup 30cm away and one 3m away. For VLA models and world models, per-frame depth serves as an explicit supervisory signal for learning spatial relationships — dramatically reducing the amount of raw video needed to learn 3D geometry implicitly.",
    outputFormat: "16-bit PNG or float32 NumPy arrays, one per frame",
  },
  {
    number: "02",
    title: "Human Pose Estimation",
    model: "ViTPose / ViTPose++",
    modelLink: "https://github.com/ViTAE-Transformer/ViTPose",
    paperVenue: "NeurIPS 2022 / TPAMI 2024",
    description:
      "ViTPose extracts 2D and 3D joint positions for every person in every frame, using plain Vision Transformer backbones scaled from 100M to 1B parameters. The flagship model achieves 81.1 AP on COCO test-dev. ViTPose++ extends this to generic body pose estimation — including whole-body and hand keypoints — via task-specific Mixture-of-Expert heads trained on multiple datasets simultaneously.",
    whyItMatters:
      "Pose estimation is essential for human-to-robot transfer learning, the paradigm that NVIDIA's EgoScale and EgoMimic showed dramatically reduces the cost of VLA training. By extracting human body and hand joint positions from egocentric video, pose data enables models to understand manipulation intent, grasp configurations, and bimanual coordination patterns that can be retargeted to robot embodiments. It is also critical for safety systems that need to track humans in the robot's workspace.",
    outputFormat:
      "COCO-format keypoints (x, y, confidence) per joint per frame, plus optional 3D joint positions in camera coordinates",
  },
  {
    number: "03",
    title: "Semantic Segmentation",
    model: "SAM 3 (Segment Anything with Concepts)",
    modelLink: "https://segment-anything.com/",
    paperVenue: "ICLR 2026",
    description:
      "SAM 3, published at ICLR 2026, extends Meta's Segment Anything series to concept-based prompting: the model detects, segments, and tracks objects in images and video using short noun phrases (e.g., 'yellow cup'), image exemplars, or both. Where SAM 1 and SAM 2 required point, box, or mask prompts, SAM 3 unifies image, video, and text in a single architecture with improved boundary quality and temporal stability.",
    whyItMatters:
      "Segmentation masks tell physical AI models which pixels belong to which objects — essential for affordance reasoning (which surfaces can be grasped?), obstacle avoidance (what should the robot not touch?), and scene decomposition (what are the individual objects in this cluttered workspace?). For VLA training, per-object masks combined with depth maps enable the model to construct an implicit 3D scene graph, which is the foundation for generalizable manipulation policies.",
    outputFormat:
      "COCO RLE masks per instance per frame, with object class labels and tracking IDs across frames",
  },
  {
    number: "04",
    title: "Optical Flow",
    model: "RAFT (Recurrent All-Pairs Field Transforms)",
    modelLink:
      "https://github.com/princeton-vl/RAFT",
    paperVenue: "ECCV 2020, widely adopted through 2026",
    description:
      "RAFT computes dense motion fields between consecutive frames, capturing how every pixel moves from one timestep to the next. The architecture uses recurrent iterative refinement over a 4D correlation volume built from all pairs of pixels, producing sub-pixel-accurate flow fields. Recent work (FlowSAM, UnSAMFlow) combines RAFT outputs with SAM segmentation for motion-aware object understanding, computing flow across multiple frame gaps for robustness to noisy inputs.",
    whyItMatters:
      "Optical flow provides explicit motion information that helps physical AI models predict object dynamics and plan interaction trajectories. For manipulation tasks, flow reveals which objects are being moved, how fast they are moving, and whether the robot's own motion is causing apparent motion in the scene (ego-motion separation). For world models, optical flow serves as a dense temporal consistency signal — the model must predict flow fields that are physically plausible.",
    outputFormat:
      ".flo files or float32 NumPy arrays with (u, v) displacement per pixel per frame pair",
  },
  {
    number: "05",
    title: "Temporal Action Labels",
    model: "InternVideo2 + Expert Human Annotation",
    modelLink: "https://github.com/OpenGVLab/InternVideo2",
    paperVenue: "CVPR 2024 (InternVideo2)",
    description:
      "Action labeling combines automated video understanding with expert human annotation. InternVideo2 provides initial temporal action proposals — identifying candidate action segments and generating natural language descriptions. Expert human annotators then refine boundaries to sub-second precision, correct misclassified actions, add fine-grained phase labels (approach, pre-grasp, grasp, lift, transport, place, release), and write diverse natural language instruction paraphrases for each action segment.",
    whyItMatters:
      "VLA models need to decompose complex tasks into executable sub-actions. Without temporal action labels, the model sees manipulation as a continuous stream of motion with no structure. Action labels provide the temporal scaffolding: they teach the model where one action ends and the next begins, what language instruction corresponds to each phase, and how primitive actions compose into complex multi-step tasks. This is the layer that most open datasets lack entirely, and it is the layer where expert human judgment is most irreplaceable.",
    outputFormat:
      "JSON annotations with start/end timestamps, action class, phase label, and 3+ natural language descriptions per segment",
  },
  {
    number: "06",
    title: "Structured Metadata",
    model: "Multi-source: GPS, device sensors, automated classification",
    modelLink: null,
    paperVenue: null,
    description:
      "Every clip receives structured metadata that enables filtering, sampling, and bias analysis across the dataset. This includes: capture device model and settings (resolution, frame rate, FOV), environment classification (indoor/outdoor, kitchen/warehouse/office), geographic region (anonymized to city level), lighting conditions (natural/artificial, brightness level), contributor demographics (age range, handedness), and technical quality scores (motion blur, exposure, compression artifacts).",
    whyItMatters:
      "Metadata enables the systematic dataset curation that determines model quality. Teams need to filter for specific environments, balance across geographic regions, or sample clips meeting minimum quality thresholds. Without structured metadata, dataset curation devolves into manual review of individual clips — a process that does not scale to 500K+ clips. Metadata also supports bias detection and fairness audits required for responsible deployment of physical AI systems.",
    outputFormat:
      "Parquet tables with standardized schema, queryable via SQL or Pandas/Polars",
  },
];

// =============================================================================
// PAGE
// =============================================================================

export default function DataEnrichmentPipelinePage() {
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
                  Data Enrichment Pipeline for Physical AI
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
              Data Enrichment for Physical AI: Depth, Pose, and
              Segmentation at Scale
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl text-white/70">
              Raw video is not training data. The gap between a video clip
              and a training sample is filled by enrichment: the automated
              and human-supervised process of adding depth maps, pose
              estimation, segmentation masks, optical flow, action labels,
              and structured metadata to every frame. This is Claru&apos;s
              single strongest differentiator, and no other provider has
              published a technical description of how it works.
            </p>
          </div>
        </section>

        {/* ── Why Raw Video Isn't Enough ───────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Why Raw Video Is Not Enough for Physical AI
            </h2>

            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                A raw video frame is a 2D array of RGB pixel values. It
                contains no explicit information about depth, object
                boundaries, human pose, motion dynamics, or the semantic
                meaning of what is happening. A{" "}
                <Link
                  href="/vla-training-data-guide"
                  className="underline underline-offset-2"
                  style={{ color: "#92B090" }}
                >
                  Vision-Language-Action model
                </Link>{" "}
                trained on raw pixels alone must learn all of these
                representations implicitly &mdash; requiring orders of
                magnitude more data and compute than a model given
                explicit supervisory signals.
              </p>

              <p>
                Consider what a robot needs to understand to pick up a cup
                from a cluttered table:
              </p>

              <ul className="list-disc list-inside space-y-2 text-white/70">
                <li>
                  <strong className="text-white">Where is the cup?</strong>{" "}
                  Requires depth estimation to localize it in 3D space.
                </li>
                <li>
                  <strong className="text-white">
                    Which pixels are the cup?
                  </strong>{" "}
                  Requires segmentation to isolate it from the background
                  and surrounding objects.
                </li>
                <li>
                  <strong className="text-white">
                    How is the human holding it?
                  </strong>{" "}
                  Requires pose estimation to understand grasp
                  configuration.
                </li>
                <li>
                  <strong className="text-white">
                    Is anything moving nearby?
                  </strong>{" "}
                  Requires optical flow to detect dynamic obstacles.
                </li>
                <li>
                  <strong className="text-white">
                    What action phase are we in?
                  </strong>{" "}
                  Requires action labels to decompose the task into
                  approach, grasp, lift, transport.
                </li>
              </ul>

              <p>
                Each of these is a distinct enrichment layer. Together, they
                transform raw pixels into the structured representation that{" "}
                <Link
                  href="/physical-ai-training-data"
                  className="underline underline-offset-2"
                  style={{ color: "#92B090" }}
                >
                  physical AI systems
                </Link>{" "}
                need to learn effective manipulation, navigation, and
                interaction policies. Every major VLA paper from 2025-2026
                uses some subset of these layers, either as direct model
                inputs or as auxiliary training objectives.
              </p>
            </div>
          </div>
        </section>

        {/* ── The 6-Layer Pipeline ────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              The 6-Layer Enrichment Pipeline
            </h2>
            <p className="text-white/70 mb-12 text-lg">
              Claru runs every video clip through a sequential enrichment
              pipeline. Each layer builds on the outputs of previous layers,
              with cross-validation checks ensuring geometric and temporal
              consistency.
            </p>

            <div className="space-y-16">
              {enrichmentLayers.map((layer) => (
                <div
                  key={layer.number}
                  id={`layer-${layer.number}`}
                  className="scroll-mt-24"
                >
                  <div className="flex items-start gap-5 mb-6">
                    <div
                      className="flex-none w-14 h-14 rounded-lg flex items-center justify-center text-lg font-mono font-bold"
                      style={{
                        backgroundColor: "rgba(146,176,144,0.15)",
                        color: "#92B090",
                      }}
                    >
                      {layer.number}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {layer.title}
                      </h3>
                      <p className="text-sm text-white/40 font-mono mt-0.5">
                        {layer.modelLink ? (
                          <a
                            href={layer.modelLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2 transition-colors hover:text-white/60"
                          >
                            {layer.model}
                          </a>
                        ) : (
                          layer.model
                        )}
                        {layer.paperVenue && (
                          <> &middot; {layer.paperVenue}</>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pl-0 md:pl-[4.75rem]">
                    <p className="text-white/80 leading-relaxed">
                      {layer.description}
                    </p>

                    <div
                      className="rounded-lg p-4"
                      style={{
                        backgroundColor: "rgba(146,176,144,0.06)",
                        borderLeft: "3px solid rgba(146,176,144,0.3)",
                      }}
                    >
                      <h4 className="text-sm font-semibold text-white mb-2">
                        Why It Matters for Physical AI
                      </h4>
                      <p className="text-white/70 text-sm leading-relaxed">
                        {layer.whyItMatters}
                      </p>
                    </div>

                    <p className="text-xs font-mono text-white/30">
                      Output: {layer.outputFormat}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Cross-Validation ──────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Cross-Layer Validation
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Individual enrichment layers are not useful if they
              contradict each other. Claru runs cross-validation checks
              to ensure geometric and temporal consistency.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Depth vs. Segmentation",
                  description:
                    "Object boundaries in segmentation masks are checked against depth discontinuities. If a segmentation mask puts two objects at the same depth when the depth map shows a 50cm gap, the segmentation is flagged for review. Conversely, depth edges that cross segmentation boundaries indicate potential depth estimation artifacts.",
                },
                {
                  title: "Pose vs. Temporal Smoothness",
                  description:
                    "Pose estimates are validated against physics-based motion models. A human wrist cannot teleport 30cm between consecutive frames at 30fps. Pose trajectories that violate kinematic constraints are flagged, interpolated, or sent for manual review. Jitter detection catches high-frequency noise that would corrupt action retargeting.",
                },
                {
                  title: "Flow vs. Segmentation",
                  description:
                    "Optical flow within a rigid object's segmentation mask should be approximately uniform (the whole object moves together). Flow that varies dramatically within a single rigid object indicates either a segmentation error or a flow estimation failure. Deformable objects (cloth, liquids) are exempted from this check.",
                },
                {
                  title: "Action Labels vs. Motion",
                  description:
                    "Action boundary annotations are cross-referenced against detected motion events. A 'grasp' label should coincide with gripper closure and reduced end-effector velocity. A 'lift' label should coincide with upward motion in the depth map. Mismatches are flagged for human review, catching both automated labeling errors and annotator mistakes.",
                },
              ].map((check) => (
                <div
                  key={check.title}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {check.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {check.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DIY vs. Pre-Enriched ─────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Build vs. Buy: DIY Pipeline vs. Pre-Enriched Data
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Many{" "}
              <Link
                href="/training-data-for-robotics"
                className="underline underline-offset-2"
                style={{ color: "#92B090" }}
              >
                robotics teams
              </Link>{" "}
              consider building enrichment pipelines in-house. Here is a
              realistic cost comparison.
            </p>

            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                      Dimension
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                      Build In-House
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                      Pre-Enriched (Claru)
                    </th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  {[
                    {
                      dim: "Engineering Cost",
                      diy: "$50K-$200K+ in ML engineer time to integrate, optimize, and maintain 6 model architectures",
                      pre: "Included in data pricing — no engineering overhead",
                    },
                    {
                      dim: "Time to First Data",
                      diy: "2-4 months to build, test, and validate the pipeline before any data is enriched",
                      pre: "Days — enrichment is already running at scale on 500K+ clips",
                    },
                    {
                      dim: "GPU Compute",
                      diy: "$0.50-$2.00 per clip for full 6-layer enrichment on cloud GPUs (A100/H100)",
                      pre: "Amortized across Claru's clip volume — per-clip cost is significantly lower",
                    },
                    {
                      dim: "Quality Assurance",
                      diy: "Must build custom cross-validation, flagging, and review workflows from scratch",
                      pre: "Cross-layer validation, temporal consistency checks, and human review built in",
                    },
                    {
                      dim: "Model Updates",
                      diy: "Must track upstream model releases (Depth Anything V3, SAM 4, etc.) and re-validate",
                      pre: "Claru updates the pipeline and re-enriches datasets as models improve",
                    },
                    {
                      dim: "Scale",
                      diy: "Limited by team GPU budget and engineering bandwidth",
                      pre: "500K+ clips enriched and growing — marginal cost decreases with scale",
                    },
                  ].map((row, i) => (
                    <tr
                      key={row.dim}
                      className={
                        i % 2 === 0
                          ? "bg-transparent"
                          : "bg-white/[0.02]"
                      }
                    >
                      <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                        {row.dim}
                      </td>
                      <td className="px-4 py-3">{row.diy}</td>
                      <td className="px-4 py-3">{row.pre}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 space-y-4 text-white/80 leading-relaxed">
              <p>
                The calculation is straightforward for most teams: building
                an enrichment pipeline delays training by 2-4 months and
                consumes $50K-$200K+ in engineering time that could be spent
                on model development. Pre-enriched data lets teams start
                training immediately and iterate on model architecture
                rather than data infrastructure.
              </p>
              <p>
                The exception is teams with highly specialized enrichment
                needs (custom sensor modalities, proprietary annotation
                schemas) where off-the-shelf enrichment does not apply. For
                these teams, Claru offers hybrid options: standard layers
                pre-enriched, with custom layers added through managed
                annotation campaigns.
              </p>
            </div>
          </div>
        </section>

        {/* ── Real Pipeline Example ────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              What a Single Enriched Clip Looks Like
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Here is the complete output structure for one 10-second{" "}
              <Link
                href="/egocentric-video-datasets"
                className="underline underline-offset-2"
                style={{ color: "#92B090" }}
              >
                egocentric clip
              </Link>{" "}
              at 30fps (300 frames):
            </p>

            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 font-mono text-sm text-white/70 overflow-x-auto">
              <pre className="whitespace-pre leading-relaxed">
{`clip_00042137/
  video.mp4              # Source RGB video (H.264, 1920x1080, 30fps)
  depth/
    frame_000.png        # 16-bit depth maps (300 frames)
    frame_001.png
    ...
  pose/
    keypoints.json       # COCO-format body + hand keypoints per frame
    pose_3d.npy          # 3D joint positions in camera coords
  segmentation/
    masks.json           # COCO RLE instance masks per frame
    tracking.json        # Cross-frame object tracking IDs
  flow/
    flow_000.npy         # Dense optical flow (u,v) per frame pair
    flow_001.npy
    ...
  actions/
    segments.json        # Temporal action boundaries + language
  metadata.json          # Device, environment, quality scores
  manifest.json          # Checksums, schema version, enrichment models`}
              </pre>
            </div>

            <p className="mt-6 text-white/60 text-sm">
              All enrichment layers are frame-aligned by timestamp. The
              manifest includes SHA-256 checksums for every file and
              records which model version produced each layer, enabling
              full reproducibility.
            </p>
          </div>
        </section>

        {/* ── Who Uses Enriched Data ───────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Who Uses Enriched Training Data
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Enriched data serves different roles depending on the team
              and model architecture.
            </p>

            <div className="space-y-6">
              {[
                {
                  team: "VLA Teams",
                  usage:
                    "Use depth, pose, and action labels as auxiliary training objectives alongside the primary action prediction loss. Depth and segmentation serve as intermediate representations that improve spatial reasoning. Action labels provide the temporal structure for multi-step task decomposition.",
                  link: "/vla-training-data-guide",
                  linkText: "VLA Training Data Guide",
                },
                {
                  team: "World Model Teams",
                  usage:
                    "Use all six enrichment layers as supervisory signals for learning physically-grounded video prediction. Depth consistency across predicted frames validates that the model understands 3D geometry. Optical flow coherence confirms that predicted object motion follows physical laws. Segmentation stability ensures objects maintain identity across predictions.",
                  link: "/physical-ai-training-data",
                  linkText: "Physical AI Training Data",
                },
                {
                  team: "Humanoid Robotics Teams",
                  usage:
                    "Use pose estimation for human-to-robot motion retargeting: extracting human body and hand joint trajectories from egocentric video and mapping them to the robot's kinematic chain. Depth maps provide workspace understanding. Action labels define the task structure that the humanoid needs to replicate.",
                  link: "/training-data-for-robotics",
                  linkText: "Training Data for Robotics",
                },
                {
                  team: "Autonomous Navigation Teams",
                  usage:
                    "Use depth maps for obstacle detection and traversability estimation, segmentation masks for semantic scene understanding (road, sidewalk, obstacle, person), and optical flow for dynamic object tracking and ego-motion estimation.",
                  link: "/embodied-ai-datasets",
                  linkText: "Embodied AI Datasets",
                },
              ].map((item) => (
                <div
                  key={item.team}
                  className="border-l-2 pl-6"
                  style={{ borderColor: "rgba(146,176,144,0.4)" }}
                >
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {item.team}
                  </h3>
                  <p className="text-white/70 leading-relaxed mb-2">
                    {item.usage}
                  </p>
                  <Link
                    href={item.link}
                    className="text-sm font-medium transition-colors"
                    style={{ color: "#92B090" }}
                  >
                    {item.linkText} &rarr;
                  </Link>
                </div>
              ))}
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
                  href: "/blog/best-egocentric-data-providers",
                  title: "Best Egocentric Data Providers (2026)",
                  desc: "Comparison of 7 providers for egocentric video data.",
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
                  href: "/egocentric-video-datasets",
                  title: "Egocentric Video Datasets",
                  desc: "First-person video data for robot perception and VLA pretraining.",
                },
                {
                  href: "/embodied-ai-datasets",
                  title: "Embodied AI Datasets",
                  desc: "Datasets for robots that navigate and interact with the physical world.",
                },
                {
                  href: "/pillars/enrich",
                  title: "Enrich: Claru's Enrichment Platform",
                  desc: "How Claru transforms raw data into training-ready assets.",
                },
                {
                  href: "/pillars/enrich/video-annotation",
                  title: "Video Annotation Services",
                  desc: "Expert annotation for video data at scale.",
                },
                {
                  href: "/data-catalog",
                  title: "Browse the Data Catalog",
                  desc: "Explore Claru's 25+ licensed datasets with live previews.",
                },
                {
                  href: "/compare/claru-vs-luel",
                  title: "Claru vs. Luel",
                  desc: "Enriched data vs. marketplace speed — side-by-side.",
                },
                {
                  href: "/compare/scale-ai-alternatives",
                  title: "Scale AI Alternatives (2026)",
                  desc: "Modern alternatives for enterprise annotation.",
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
              Skip the Pipeline. Start Training.
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Claru delivers enriched training data with depth, pose,
              segmentation, optical flow, and action labels
              pre-computed. Tell us about your model and we&apos;ll
              scope the dataset.
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
