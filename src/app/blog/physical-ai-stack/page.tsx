import type { Metadata } from "next";
import Link from "next/link";
import GeoPageShell from "@/app/components/content/GeoPageShell";

// =============================================================================
// META
// =============================================================================

export const metadata: Metadata = {
  title: "The Physical AI Stack: From Raw Sensor Data to Robot Action (2026) | Claru",
  description:
    "Layer-by-layer breakdown of the physical AI stack: perception, world model, policy network, and action execution. At each layer: what training data it needs, what models exist, and where the data gaps are.",
  keywords: [
    "physical ai stack explained",
    "physical ai model architecture",
    "how do robots learn from data",
    "embodied ai pipeline",
    "robot perception training data",
    "world model robotics",
    "policy network robot training",
    "robot action execution",
    "physical AI architecture 2026",
    "embodied AI stack",
    "Depth Anything V2",
    "GR00T N1 architecture",
    "Open X-Embodiment policy training",
    "robot learning pipeline",
  ],
  openGraph: {
    title: "The Physical AI Stack: From Raw Sensor Data to Robot Action (2026)",
    description:
      "Layer-by-layer breakdown of how physical AI robots learn: perception (Depth Anything V2), world model (GR00T N1), policy network (Open X-Embodiment), and action execution — with training data requirements at each layer.",
    type: "article",
    url: "https://claru.ai/blog/physical-ai-stack",
    siteName: "Claru",
    images: [
      {
        url: "https://claru.ai/images/og-v2.webp",
        width: 1200,
        height: 630,
        alt: "The Physical AI Stack: From Raw Sensor Data to Robot Action (2026) — Claru",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Physical AI Stack: From Raw Sensor Data to Robot Action (2026) | Claru",
    description:
      "Perception, world model, policy network, action execution — each layer of the physical AI stack, with training data requirements at each level.",
  },
  alternates: {
    canonical: "https://claru.ai/blog/physical-ai-stack",
  },
};

// =============================================================================
// JSON-LD: BlogPosting
// =============================================================================

const blogPostingJsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline:
    "The Physical AI Stack: From Raw Sensor Data to Robot Action (2026)",
  description:
    "Layer-by-layer breakdown of the physical AI stack: perception, world model, policy network, and action execution. At each layer: what training data it needs, what models exist, and where the data gaps are.",
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
  datePublished: "2026-04-02",
  dateModified: "2026-04-02",
  mainEntityOfPage: "https://claru.ai/blog/physical-ai-stack",
  image: "https://claru.ai/images/og-v2.webp",
  isPartOf: {
    "@type": "Blog",
    "@id": "https://claru.ai/blog",
    name: "Claru Blog",
  },
  mentions: [
    {
      "@type": "SoftwareApplication",
      name: "Depth Anything V2",
      url: "https://depth-anything-v2.github.io/",
    },
    {
      "@type": "SoftwareApplication",
      name: "GR00T N1",
      url: "https://developer.nvidia.com/isaac/gr00t",
    },
    {
      "@type": "Dataset",
      name: "Open X-Embodiment",
      url: "https://robotics-transformer-x.github.io/",
    },
    {
      "@type": "SoftwareApplication",
      name: "SAM 2",
      url: "https://ai.meta.com/sam2/",
    },
    {
      "@type": "SoftwareApplication",
      name: "OpenVLA",
      url: "https://openvla.github.io/",
    },
  ],
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
      name: "The Physical AI Stack",
      item: "https://claru.ai/blog/physical-ai-stack",
    },
  ],
};

// =============================================================================
// JSON-LD: FAQPage
// =============================================================================

const faqItems = [
  {
    question: "What is the physical AI stack?",
    answer:
      "The physical AI stack is the layered pipeline that takes raw sensor inputs (RGB images, depth maps, proprioception, IMU readings) and produces physical robot actions (joint angles, end-effector poses, gripper states). It consists of four functional layers: (1) Perception — extracting structured representations from raw sensor data (object locations, 3D structure, semantic labels); (2) World Model — building an internal model of environment state and predicting future states given actions; (3) Policy Network — mapping perceived state and language instructions to action sequences; (4) Action Execution — translating policy outputs to low-level motor commands on hardware. Each layer requires different types of training data.",
  },
  {
    question: "How does perception training data differ from policy training data?",
    answer:
      "Perception training data consists of sensory inputs paired with ground-truth labels about the environment: RGB images with depth maps, segmentation masks, object bounding boxes, or pose estimates. The model learns to infer structure from the raw signal. Policy training data consists of state-action trajectories: observations from the robot's sensors at each timestep paired with the actions taken and the outcomes. The model learns to map state representations to actions. Perception data can be collected at low cost using automated annotation tools (Depth Anything V2 for depth, SAM 2 for segmentation); policy data requires human operators teleoperating robots or performing demonstrations with motion capture, making it far more expensive to collect.",
  },
  {
    question: "What is a world model in robotics?",
    answer:
      "A world model in robotics is an internal representation that captures the current state of the environment and can predict how that state will change given the robot's actions. Unlike a pure reactive policy (which maps current state to action without modeling the future), a world model enables planning: the robot can mentally simulate sequences of actions and their consequences before committing to any of them. World models trained on large video datasets learn physics-like priors — how objects fall, roll, deform, and respond to contact — that help robots reason about novel situations. GR00T N1 uses a world model component trained on NVIDIA's video corpus to provide this prior for its humanoid robot policy.",
  },
  {
    question: "What training data does the perception layer need?",
    answer:
      "Perception layer training data consists of raw sensory inputs (RGB images, depth frames, LiDAR point clouds) paired with ground-truth structural labels: per-pixel depth values, semantic segmentation masks, object instance masks, 3D bounding boxes, or human pose keypoints. For robotics specifically, the perception data should match the visual distribution the robot will encounter in deployment: similar lighting, similar object types, similar backgrounds. Depth Anything V2 was trained on a mixture of labeled data (NYU-Depth V2, SUN RGB-D, KITTI, and others) and unlabeled images pseudo-labeled by a teacher model — this approach achieves strong generalization without requiring manually labeled depth for every new environment.",
  },
  {
    question: "Can the physical AI stack layers be trained independently?",
    answer:
      "In principle yes, and in practice that is how most teams approach it. Perception models (depth estimation, segmentation, pose estimation) are typically pre-trained on large datasets and used as frozen feature extractors or fine-tuned with small domain-specific datasets. World models are trained on video prediction tasks using large video corpora. Policy networks are trained on robot trajectory data, either end-to-end (taking raw pixels as input) or on top of frozen or fine-tuned perception representations. End-to-end training of all layers simultaneously is theoretically possible but requires enormous amounts of robot interaction data and is computationally expensive. Joint training of perception and policy has shown improved performance in some recent work (e.g., R3M from Meta AI, which co-trains a visual representation and a robot policy).",
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
// Stack layers data
// =============================================================================

const stackLayers = [
  {
    layer: "L1",
    name: "Perception",
    input: "Raw sensor data (RGB, depth, LiDAR, IMU)",
    output: "Structured scene representation (object maps, 3D structure, semantic labels)",
    trainingData: "Labeled sensory data: images + depth/segmentation/pose annotations",
    dataVolume: "10K–1M+ labeled frames",
    keyModels: "Depth Anything V2, SAM 2, ViTPose, DINOv2, R3M",
    dataChallenge: "Visual diversity: must cover deployment-environment lighting, objects, and clutter",
  },
  {
    layer: "L2",
    name: "World Model",
    input: "Structured scene representation + action",
    output: "Predicted next state, object dynamics, physics priors",
    trainingData: "Large video corpora with optional action labels; diverse multi-environment video",
    dataVolume: "Millions of video clips",
    keyModels: "GR00T N1 (world model component), UniSim, GROOT",
    dataChallenge: "Physical diversity: contact interactions, deformable objects, fluid dynamics rarely appear in internet video",
  },
  {
    layer: "L3",
    name: "Policy Network",
    input: "Perception + world model state + language instruction",
    output: "Action sequence (joint angles, end-effector poses, gripper states)",
    trainingData: "Robot trajectory data: observation-action-instruction triplets",
    dataVolume: "50K–1M+ trajectories",
    keyModels: "OpenVLA, pi-zero, Octo, GR00T N1 (policy component)",
    dataChallenge: "Task coverage: must include target task types, objects, and environments",
  },
  {
    layer: "L4",
    name: "Action Execution",
    input: "High-level action target from policy",
    output: "Low-level motor commands (torque, velocity, position) at hardware frequency",
    trainingData: "Hardware-specific calibration data, sensor characterization",
    dataVolume: "Varies by hardware (hundreds to thousands of calibration runs)",
    keyModels: "PDcontrollers, impedance controllers, learned residual dynamics",
    dataChallenge: "Hardware specificity: calibration data does not transfer across robot platforms",
  },
];

// =============================================================================
// PAGE
// =============================================================================

export default function PhysicalAiStackPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
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
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                }}
              >
                <li>
                  <Link href="/" className="transition-colors hover:text-white">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="select-none">/</li>
                <li>
                  <Link href="/blog" className="transition-colors hover:text-white">
                    Blog
                  </Link>
                </li>
                <li aria-hidden="true" className="select-none">/</li>
                <li aria-current="page" style={{ color: "#92B090" }}>
                  Physical AI Stack
                </li>
              </ol>
            </nav>

            <p
              className="text-xs font-mono uppercase tracking-widest mb-4"
              style={{ color: "#92B090" }}
            >
              Last updated: April 2026
            </p>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
              The Physical AI Stack: From Raw Sensor Data to Robot Action
              (2026)
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl text-white/70">
              A robot that picks up a cup and places it on a shelf is executing
              four distinct computational layers simultaneously. Each layer has
              its own architecture, its own training data requirements, and its
              own failure modes. This post maps the full stack.
            </p>
          </div>
        </section>

        {/* ── TL;DR Box ─────────────────────────────────────────────── */}
        <section className="w-full pb-12">
          <div className="mx-auto max-w-4xl px-6">
            <div
              className="rounded-lg border p-6"
              style={{
                borderColor: "rgba(146,176,144,0.3)",
                backgroundColor: "rgba(146,176,144,0.05)",
              }}
            >
              <p
                className="text-xs font-mono uppercase tracking-widest mb-4"
                style={{ color: "#92B090" }}
              >
                TL;DR
              </p>
              <ul className="space-y-3">
                {[
                  "The physical AI stack has four layers — perception, world model, policy network, and action execution — each requiring fundamentally different training data.",
                  "Perception models (Depth Anything V2, SAM 2, ViTPose) need labeled sensory data; they can be pre-trained on large public datasets and fine-tuned with smaller domain-specific sets.",
                  "Policy networks (OpenVLA, Octo, GR00T N1) need observation-action-instruction triplets collected through robot teleoperation — this is the hardest and most expensive data to collect in the stack.",
                  "World models need large-scale diverse video to learn physics priors; egocentric video across varied environments provides the distributional breadth internet video lacks for manipulation scenarios.",
                ].map((bullet, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/80 text-sm leading-relaxed">
                    <span
                      className="mt-1 flex-none w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: "#92B090" }}
                    />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Table of Contents ─────────────────────────────────────── */}
        <section className="w-full pb-12">
          <div className="mx-auto max-w-4xl px-6">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-sm font-mono uppercase tracking-wider text-white/50 mb-4">
                In This Post
              </h2>
              <ol className="space-y-2 text-sm text-white/70 list-decimal list-inside">
                <li>
                  <a href="#stack-overview" className="hover:text-white transition-colors">
                    Stack Overview: The Four Layers
                  </a>
                </li>
                <li>
                  <a href="#layer-1-perception" className="hover:text-white transition-colors">
                    Layer 1: Perception
                  </a>
                </li>
                <li>
                  <a href="#layer-2-world-model" className="hover:text-white transition-colors">
                    Layer 2: World Model
                  </a>
                </li>
                <li>
                  <a href="#layer-3-policy" className="hover:text-white transition-colors">
                    Layer 3: Policy Network
                  </a>
                </li>
                <li>
                  <a href="#layer-4-execution" className="hover:text-white transition-colors">
                    Layer 4: Action Execution
                  </a>
                </li>
                <li>
                  <a href="#stack-table" className="hover:text-white transition-colors">
                    Stack Summary Table
                  </a>
                </li>
                <li>
                  <a href="#data-by-layer" className="hover:text-white transition-colors">
                    Training Data by Layer: Where the Gaps Are
                  </a>
                </li>
                <li>
                  <a href="#key-takeaways" className="hover:text-white transition-colors">
                    Key Takeaways
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* ── Stack Overview ────────────────────────────────────────── */}
        <section id="stack-overview" className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Stack Overview: The Four Layers
            </h2>
            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                When a robot arm reaches for a coffee cup, it is executing a
                pipeline that spans from raw photons hitting a camera sensor to
                motor current flowing through servo motors — in under 100
                milliseconds. That pipeline involves four distinct computational
                layers, each with its own training paradigm and data requirements.
              </p>

              {/* ASCII diagram */}
              <div className="rounded-lg bg-black/40 border border-white/10 p-6 font-mono text-sm text-white/70 overflow-x-auto">
                <pre className="whitespace-pre leading-relaxed">{`
  SENSORS                 PHYSICAL AI STACK              HARDWARE
  ─────────               ──────────────────             ─────────

  RGB camera   ──────┐
  Depth sensor ──────┤   ┌─────────────────────┐
  LiDAR        ──────┼──▶│  L1: PERCEPTION      │  objects, 3D structure,
  IMU          ──────┘   │  (Depth Anything V2,  │  semantic labels,
                         │   SAM 2, ViTPose,     │  pose estimates
                         │   DINOv2)             │
                         └──────────┬────────────┘
                                    │
                         ┌──────────▼────────────┐
                         │  L2: WORLD MODEL       │  predicted next state,
                         │  (GR00T N1 think sys,  │  object dynamics,
                         │   UniSim, GROOT)       │  physics priors
                         └──────────┬────────────┘
                                    │
   LANGUAGE    ──────────┐          │
   INSTRUCTION            ├─────────▼────────────┐
                          │  L3: POLICY NETWORK   │  joint angles,
                          │  (OpenVLA, Octo,      │  end-effector pose,
                          │   pi-zero, GR00T N1)  │  gripper state
                          └──────────┬────────────┘
                                     │
                          ┌──────────▼────────────┐
                          │  L4: ACTION EXECUTION  │  torque, velocity,
                          │  (PD controllers,      │  position commands
                          │   impedance control,   │  at 100–1000 Hz
                          │   learned residuals)   │
                          └──────────┬────────────┘
                                     │
                                     ▼
                              ROBOT HARDWARE
                         (motors, joints, grippers)
`}</pre>
              </div>

              <p>
                This layered structure is not unique to any single robot architecture —
                it describes how virtually every physical AI system from autonomous
                vehicles to humanoid robots organizes its computation. The layers can
                be trained separately and composed, or trained jointly end-to-end. Most
                production systems in 2026 use a hybrid: perception is pre-trained on
                large public datasets, world models are trained on large video corpora,
                and policies are fine-tuned on task-specific robot trajectory data.
              </p>
            </div>
          </div>
        </section>

        {/* ── Layer 1: Perception ───────────────────────────────────── */}
        <section id="layer-1-perception" className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <div className="flex items-center gap-3 mb-8">
              <span
                className="font-mono text-xs px-2 py-1 rounded"
                style={{ backgroundColor: "rgba(146,176,144,0.15)", color: "#92B090" }}
              >
                L1
              </span>
              <h2 className="text-2xl font-semibold md:text-3xl text-white">
                Layer 1: Perception
              </h2>
            </div>
            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                The perception layer takes raw sensor inputs — RGB images, depth
                frames, LiDAR point clouds, IMU readings — and transforms them into
                structured representations the rest of the stack can reason over:
                object locations, 3D scene geometry, semantic labels, and agent pose.
              </p>
              <p>
                Perception is the most tractable layer for pre-training on large public
                datasets because the training signal (ground-truth labels) can be
                generated with automated tools applied to existing imagery.
              </p>

              <div className="space-y-4">
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="text-base font-semibold text-white mb-2">
                    Depth Anything V2 — Monocular Depth Estimation
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Depth Anything V2 (University of Hong Kong, 2024) produces per-pixel
                    depth estimates from a single RGB image. It was trained on a mixture
                    of high-quality labeled depth data and 62M unlabeled images
                    pseudo-labeled by a teacher model. The result is a depth estimator
                    that generalizes across environments without requiring depth sensor
                    hardware, making it valuable for robots that use RGB-only cameras.
                    For training data: the base model needs per-pixel depth annotations
                    (from LiDAR, structured light, or stereo cameras); the pseudo-labeling
                    pipeline extends coverage to any RGB imagery.
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="text-base font-semibold text-white mb-2">
                    SAM 2 — Segmentation and Tracking
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    SAM 2 (Meta AI, 2024) segments and tracks objects across video
                    frames with a single prompt (click, bounding box, or mask). For
                    robotics, this enables zero-shot object tracking across manipulation
                    sequences without object-specific training. SAM 2 was trained on
                    SA-1B (1B+ masks) and SA-V (50K+ videos with spatio-temporal masks).
                    The training data requirement is large-scale mask annotation — not
                    action labels — making it substantially cheaper to collect than
                    policy training data.
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="text-base font-semibold text-white mb-2">
                    ViTPose — Human and Hand Pose Estimation
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    ViTPose (Microsoft Research, 2022) is a Vision Transformer-based
                    pose estimation model that achieves strong performance on both human
                    body and hand keypoint detection. For robotics, hand pose estimation
                    is particularly important for understanding manipulation from egocentric
                    video — it enables retargeting of human hand trajectories to robot
                    gripper poses. ViTPose requires datasets with 2D and 3D joint
                    annotation: COCO-WholeBody, MPII, Human3.6M, and InterHand2.6M are
                    the primary training sources.
                  </p>
                </div>
              </div>

              <p>
                <strong className="text-white">Training data requirements at this layer:</strong>{" "}
                Labeled sensory data with ground-truth structural annotations. The key
                challenge is visual diversity — perception models trained on lab images
                transfer poorly to novel deployment environments with different lighting
                and object types. This is where Claru&apos;s 500K+ egocentric clips,
                enriched with Depth Anything V2 depth maps, ViTPose keypoints, and SAM
                segmentation masks, provide training-ready perception data across 100+
                cities and diverse real-world environments.
              </p>
            </div>
          </div>
        </section>

        {/* ── Layer 2: World Model ──────────────────────────────────── */}
        <section id="layer-2-world-model" className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <div className="flex items-center gap-3 mb-8">
              <span
                className="font-mono text-xs px-2 py-1 rounded"
                style={{ backgroundColor: "rgba(146,176,144,0.15)", color: "#92B090" }}
              >
                L2
              </span>
              <h2 className="text-2xl font-semibold md:text-3xl text-white">
                Layer 2: World Model
              </h2>
            </div>
            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                A <strong className="text-white">world model</strong> learns an
                internal representation of environment dynamics: given the current
                state and a proposed action, what will happen next? For robots,
                this means understanding how objects behave under manipulation —
                how a cup slides across a table, how cloth deforms when grasped,
                how a stack of objects responds to contact.
              </p>
              <p>
                World models enable planning: instead of reacting to each observation,
                a robot can mentally simulate candidate action sequences and select
                the one predicted to succeed. This is the computational difference
                between a reactive policy and a deliberative agent.
              </p>
              <p>
                The dominant approach to training world models for physical AI is
                video prediction: train on large video corpora to predict future frames
                given past frames and (optionally) action inputs. The model must learn
                physics-like dynamics to make accurate predictions, developing implicit
                representations of object permanence, gravity, contact, and rigidity.
              </p>

              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <h3 className="text-base font-semibold text-white mb-2">
                  GR00T N1&apos;s Dual-System Architecture
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  GR00T N1 (NVIDIA, 2025) uses a two-system architecture: a
                  &quot;thinking&quot; system based on the Eagle2 VLM for high-level
                  scene understanding and task planning (functioning as a world model
                  for task-level reasoning), and an &quot;acting&quot; system based on
                  a diffusion transformer for generating motor trajectories. The thinking
                  system was pretrained on NVIDIA&apos;s video corpus — including the
                  EgoScale egocentric video initiative — giving it broad priors about
                  how the physical world behaves.
                </p>
              </div>

              <p>
                <strong className="text-white">Training data requirements at this layer:</strong>{" "}
                Diverse video at scale, with a preference for content showing physical
                interactions: objects being picked up, placed, pushed, dropped, and
                manipulated. Internet video is a reasonable starting point but has
                important gaps — it is dominated by filmed content rather than
                first-person manipulation, and it underrepresents the close-range,
                hand-object interactions that matter most for robotics. Egocentric video
                from humans performing everyday manipulation tasks fills this gap.
                Claru&apos;s 500K+ clips across kitchens, workshops, warehouses, and
                outdoor environments are specifically structured for this use case.
              </p>
            </div>
          </div>
        </section>

        {/* ── Layer 3: Policy Network ───────────────────────────────── */}
        <section id="layer-3-policy" className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <div className="flex items-center gap-3 mb-8">
              <span
                className="font-mono text-xs px-2 py-1 rounded"
                style={{ backgroundColor: "rgba(146,176,144,0.15)", color: "#92B090" }}
              >
                L3
              </span>
              <h2 className="text-2xl font-semibold md:text-3xl text-white">
                Layer 3: Policy Network
              </h2>
            </div>
            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                The policy network is the most data-hungry layer in the physical AI
                stack and the hardest data to collect. It takes the structured
                state representation from the perception layer, the predictions from
                the world model, and the natural language instruction, and produces
                the action sequence the robot should execute.
              </p>
              <p>
                Policy training data must be in the form of
                observation-action-instruction triplets: at each timestep, what the
                robot observed, what instruction it was following, and what action it
                took. This requires physically collecting demonstrations —
                either through robot teleoperation or human demonstration retargeted
                to the robot&apos;s action space.
              </p>
              <p>
                The standard public training corpus for policy networks is the{" "}
                <strong className="text-white">Open X-Embodiment dataset</strong>:
                1M+ trajectories across 22 robot embodiments from 21 research
                institutions. OpenVLA was pre-trained on a 970K-trajectory subset.
                Octo used the same data. For task-specific fine-tuning, most teams
                collect additional demonstrations using their specific robot hardware
                in their deployment environment.
              </p>
              <p>
                The key models at this layer in 2026:
              </p>
              <ul className="space-y-2 text-white/70">
                <li className="flex items-start gap-3">
                  <span className="mt-2 flex-none w-1.5 h-1.5 rounded-full bg-white/30" />
                  <span><strong className="text-white">OpenVLA (7B params):</strong> Open-source VLA pretrained on 970K Open X-Embodiment trajectories. Best open option for fine-tuning experiments.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 flex-none w-1.5 h-1.5 rounded-full bg-white/30" />
                  <span><strong className="text-white">Octo (93M params):</strong> Smaller, faster VLA from Berkeley. Runs at 20+ Hz; good baseline for real-time control experiments.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 flex-none w-1.5 h-1.5 rounded-full bg-white/30" />
                  <span><strong className="text-white">pi-zero (Physical Intelligence):</strong> PaliGemma backbone + flow matching action expert for dexterous bimanual tasks. Proprietary weights.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 flex-none w-1.5 h-1.5 rounded-full bg-white/30" />
                  <span><strong className="text-white">GR00T N1 (NVIDIA):</strong> Foundation model for humanoid robots with an Eagle2 VLM thinking system and diffusion transformer action expert.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── Layer 4: Action Execution ─────────────────────────────── */}
        <section id="layer-4-execution" className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <div className="flex items-center gap-3 mb-8">
              <span
                className="font-mono text-xs px-2 py-1 rounded"
                style={{ backgroundColor: "rgba(146,176,144,0.15)", color: "#92B090" }}
              >
                L4
              </span>
              <h2 className="text-2xl font-semibold md:text-3xl text-white">
                Layer 4: Action Execution
              </h2>
            </div>
            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                The action execution layer translates the high-level action targets
                from the policy (end-effector pose targets, desired joint configurations,
                gripper commands) into low-level motor commands that run on hardware
                at 100–1000 Hz — far faster than the policy network runs.
              </p>
              <p>
                This layer operates at the interface between the learned policy and
                physical reality. Even a perfectly specified end-effector pose target
                from the policy must be converted to joint torques through inverse
                kinematics, then tracked by servo controllers that account for
                motor dynamics, gear ratios, and joint limits.
              </p>
              <p>
                Most current physical AI systems use classical control at this layer —
                PD controllers, impedance controllers, or model predictive controllers
                tuned to the specific hardware. The role of learning at this layer
                is smaller than at L1–L3: it is primarily used for residual learning
                (correcting systematic errors in classical controllers) and for
                hardware-specific calibration.
              </p>
              <p>
                <strong className="text-white">Training data requirements at this layer:</strong>{" "}
                Hardware-specific calibration data: motor characterization, joint
                encoder calibration, friction identification. This data does not
                transfer across robot platforms and must be collected fresh for each
                deployment. The volume is small (hundreds to thousands of calibration
                runs) but the specificity requirement is absolute.
              </p>
            </div>
          </div>
        </section>

        {/* ── Stack Summary Table ───────────────────────────────────── */}
        <section id="stack-table" className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Stack Summary Table
            </h2>

            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 font-mono text-white/50 uppercase tracking-wider text-xs">
                      Layer
                    </th>
                    <th className="text-left p-4 font-mono text-white/50 uppercase tracking-wider text-xs hidden sm:table-cell">
                      Output
                    </th>
                    <th className="text-left p-4 font-mono text-white/50 uppercase tracking-wider text-xs">
                      Training Data
                    </th>
                    <th className="text-left p-4 font-mono text-white/50 uppercase tracking-wider text-xs hidden md:table-cell">
                      Key Models
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stackLayers.map((layer, i) => (
                    <tr
                      key={layer.layer}
                      className={`border-b border-white/5 ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-mono text-xs px-1.5 py-0.5 rounded flex-none"
                            style={{ backgroundColor: "rgba(146,176,144,0.15)", color: "#92B090" }}
                          >
                            {layer.layer}
                          </span>
                          <span className="text-white font-medium">{layer.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-white/60 text-xs leading-snug hidden sm:table-cell">
                        {layer.output}
                      </td>
                      <td className="p-4 text-white/70 text-xs leading-snug">
                        {layer.trainingData}
                        <br />
                        <span className="text-white/40 mt-1 block">{layer.dataVolume}</span>
                      </td>
                      <td className="p-4 text-white/50 text-xs leading-snug hidden md:table-cell">
                        {layer.keyModels}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Training Data by Layer ────────────────────────────────── */}
        <section id="data-by-layer" className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Training Data by Layer: Where the Gaps Are
            </h2>
            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                The data supply across the four stack layers is not uniform. Some
                layers have abundant public training data; others face genuine
                scarcity. Understanding where the gaps are helps teams prioritize
                collection efforts.
              </p>

              <div className="space-y-4">
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold text-white">L1: Perception data</h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ color: "#92B090", backgroundColor: "rgba(146,176,144,0.1)" }}>
                      Relatively abundant
                    </span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Large public datasets exist: NYU-Depth V2, SUN RGB-D, COCO-Panoptic,
                    KITTI, and others. The gap is visual diversity for deployment
                    environments — production robots encounter lighting, objects, and
                    clutter that academic datasets don&apos;t cover. Domain-specific
                    enriched video (like Claru&apos;s 500K+ clips with pre-computed
                    depth, segmentation, and pose) closes this gap without requiring
                    teams to collect and annotate from scratch.
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold text-white">L2: World model data</h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded text-yellow-400" style={{ backgroundColor: "rgba(255,200,0,0.1)" }}>
                      Moderate gap
                    </span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Internet video exists at scale, but underrepresents first-person
                    manipulation: the close-range, hand-object interactions that matter
                    for learning manipulation physics. Ego4D (3,670 hours) and EPIC-Kitchens
                    partially address this, but coverage of diverse environments,
                    industrial tasks, and outdoor manipulation is thin.
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold text-white">L3: Policy data</h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded text-red-400" style={{ backgroundColor: "rgba(255,60,60,0.1)" }}>
                      Significant gap
                    </span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    This is the critical bottleneck. Open X-Embodiment provides 1M+
                    trajectories but covers limited task types, limited environments,
                    and limited robot embodiments. DROID adds 76K trajectories across
                    564 environments for better generalization, but the total available
                    policy training data is small compared to what production deployment
                    requires. Every team building a production{" "}
                    <Link
                      href="/physical-ai-training-data"
                      className="underline underline-offset-2"
                      style={{ color: "#92B090" }}
                    >
                      physical AI system
                    </Link>{" "}
                    must collect additional demonstrations for their specific tasks.
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold text-white">L4: Action execution data</h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ color: "#92B090", backgroundColor: "rgba(146,176,144,0.1)" }}>
                      Hardware-specific, not shared
                    </span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Calibration data does not transfer across platforms. Each team
                    collects this for their own hardware. Volume is small; the gap
                    is not quantity but systematic effort — many teams skip rigorous
                    hardware calibration and encounter downstream policy failures that
                    are actually L4 problems misattributed to L3.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Key Takeaways ─────────────────────────────────────────── */}
        <section id="key-takeaways" className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Key Takeaways
            </h2>
            <ul className="space-y-4">
              {[
                "The physical AI stack has four layers (perception, world model, policy network, action execution), each with distinct architecture, training data requirements, and failure modes.",
                "Perception data (labeled sensory inputs) is relatively abundant through public datasets; the gap is visual diversity for deployment environments, which enriched real-world video fills.",
                "World model data needs diverse first-person manipulation video — internet video underrepresents close-range hand-object interactions; egocentric video at scale fills this gap.",
                "Policy data (observation-action-instruction triplets) is the critical bottleneck: Open X-Embodiment provides 1M+ trajectories as a foundation, but task-specific and environment-specific demonstrations must still be collected for production deployment.",
                "Action execution operates on hardware calibration data that is platform-specific and non-transferable — systematic calibration is often neglected and is a common source of unexplained deployment failures.",
                "The practical implication: teams building physical AI systems need to map their data collection strategy to specific stack layers, not treat 'robot training data' as a single undifferentiated category.",
              ].map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-white/80 text-base leading-relaxed">
                  <span
                    className="mt-2 flex-none w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: "#92B090" }}
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────── */}
        <section id="faq" className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-10">
              Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              {faqItems.map((item) => (
                <div key={item.question}>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {item.question}
                  </h3>
                  <p className="text-white/70 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Related Resources ─────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Related Resources
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  href: "/physical-ai-training-data",
                  label: "Physical AI Training Data",
                  desc: "How Claru collects, enriches, and delivers training data for physical AI at each stack layer.",
                },
                {
                  href: "/embodied-ai-datasets",
                  label: "Embodied AI Datasets",
                  desc: "Overview of major embodied AI datasets and their coverage of the physical AI stack.",
                },
                {
                  href: "/glossary#world-model",
                  label: "Glossary: World Model",
                  desc: "Definition of world models in robotics with references to GR00T N1 and UniSim architectures.",
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-5 hover:border-white/20 transition-colors"
                >
                  <p
                    className="text-sm font-semibold mb-1"
                    style={{ color: "#92B090" }}
                  >
                    {link.label}
                  </p>
                  <p className="text-xs text-white/50 leading-relaxed">{link.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </GeoPageShell>
    </>
  );
}
