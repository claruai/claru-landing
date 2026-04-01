import type { Metadata } from "next";
import Link from "next/link";
import GeoPageShell from "@/app/components/content/GeoPageShell";

// =============================================================================
// META
// =============================================================================

export const metadata: Metadata = {
  title:
    "Physical AI Training Data: Real-World Datasets for Models That Understand Physics | Claru",
  description:
    "Real-world training data for physical AI from Claru. Video, demonstrations, and annotations for robotics, world models, and embodied agents. 3.7M+ annotations.",
  keywords: [
    "physical AI training data",
    "physical AI datasets",
    "data for physical AI",
    "world model training data",
    "physical intelligence data",
    "real world AI data",
    "physics-aware AI training",
    "spatial AI data",
    "3D understanding dataset",
    "physical reasoning data",
  ],
  openGraph: {
    title:
      "Physical AI Training Data: Real-World Datasets for Models That Understand Physics",
    description:
      "Real-world training data for physical AI from Claru. Purpose-built for robotics, world models, and embodied agents. 3.7M+ annotations from 10,000+ contributors.",
    type: "article",
    url: "https://claru.ai/physical-ai-training-data",
    siteName: "Claru",
    images: [
      {
        url: "/images/og-v2.webp",
        width: 1200,
        height: 630,
        alt: "Claru — Physical AI Training Data",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Physical AI Training Data | Claru",
    description:
      "Real-world datasets for physical AI. Robotics, world models, embodied agents. 3.7M+ annotations, 500K+ clips.",
  },
  alternates: {
    canonical: "https://claru.ai/physical-ai-training-data",
  },
};

// =============================================================================
// FAQ JSON-LD
// =============================================================================

const faqItems = [
  {
    question: "What is physical AI?",
    answer:
      "Physical AI refers to artificial intelligence systems that understand and interact with the physical world. Unlike language models or image classifiers that operate on digital inputs, physical AI systems must reason about gravity, friction, object permanence, spatial relationships, and cause-and-effect in three-dimensional space. Physical AI encompasses robotics (manipulation, locomotion, navigation), world models (learned simulators that predict how physical scenes evolve), embodied agents (systems that perceive and act in real environments), and autonomous vehicles. The common thread is that these systems must understand physics — not from equations, but from observations of how the real world actually works.",
  },
  {
    question: "Why does physical AI need different training data than other AI systems?",
    answer:
      "Physical AI models must learn representations of 3D space, object physics, temporal dynamics, and action consequences — none of which are captured in static images or text. A language model learns from token sequences. An image classifier learns from labeled photographs. A physical AI system needs video with depth, segmentation, and pose annotations; demonstration trajectories with action labels; multi-view observations of the same scene; and temporal sequences long enough to capture cause-and-effect relationships. The data must also be embodiment-specific: a dataset collected from a ceiling-mounted camera is not useful for training a wrist-mounted camera policy. Physical AI training data is fundamentally multi-modal, temporally structured, and grounded in specific physical contexts.",
  },
  {
    question: "What is a world model and what data does it need?",
    answer:
      "A world model is a learned simulator that predicts how a physical scene will evolve over time. Given a current observation and an action (or no action), a world model outputs a predicted future observation. World models are trained on large volumes of video showing physical interactions: objects falling, sliding, colliding, being manipulated, and deforming. The training data needs to cover diverse physical phenomena — rigid body dynamics, soft body deformation, fluid behavior, articulated object motion — across many environments and lighting conditions. Claru's egocentric video datasets provide this diversity: 500,000+ clips from kitchens, workshops, warehouses, and outdoor environments, each enriched with depth maps, segmentation masks, and optical flow to provide the supervision signals world models require.",
  },
  {
    question: "Can synthetic data replace real-world data for physical AI?",
    answer:
      "Synthetic data from simulators like IsaacSim, MuJoCo, or Habitat is valuable for pre-training and for learning task structure, but it cannot fully replace real-world data for physical AI. The fundamental issue is the sim-to-real gap: simulated environments do not perfectly reproduce real-world physics (contact dynamics, deformable objects, friction models), visual appearance (lighting, textures, material properties), or environmental diversity (clutter patterns, object arrangements, background variation). Policies trained exclusively on synthetic data typically experience 30-60% performance degradation when deployed on real hardware. The most effective approach combines synthetic pre-training with real-world fine-tuning. Claru provides the real-world data component — the data that bridges the gap between simulation and deployment.",
  },
  {
    question: "How does Claru's data pipeline work for physical AI?",
    answer:
      "Claru's pipeline has four stages. Capture: raw video and sensor data are collected through wearable cameras (10,000+ contributors), managed teleoperation (client-specific robot hardware), or game-based capture (custom environments logging synchronized video and inputs). Enrich: automated models process every clip — monocular depth estimation, semantic segmentation, instance segmentation, human/hand pose estimation, optical flow, and AI-generated captions. All enrichment layers are cross-validated for consistency. Annotate: human annotators add task-specific labels including action boundaries, object affordances, quality scores, and domain-specific metadata. Deliver: datasets are packaged in standard ML formats (WebDataset, Parquet, HDF5, RLDS) with datasheets documenting methodology and intended use.",
  },
  {
    question: "What companies are building physical AI?",
    answer:
      "Physical AI is being pursued across several verticals. In robotics: companies building manipulation systems (warehouse picking, assembly, food preparation), humanoid robots (bipedal platforms for general-purpose tasks), and mobile robots (delivery, inspection, agriculture). In world models: research labs and startups training learned simulators from video data for planning and prediction. In autonomous vehicles: self-driving car and truck companies that need to understand physical scene dynamics. In embodied AI research: academic and industrial labs building agents that can perceive, reason about, and act in physical environments. Claru works with frontier labs across these verticals, though we do not disclose specific client names.",
  },
  {
    question: "What annotation layers are most important for physical AI?",
    answer:
      "The most critical annotation layers for physical AI training data are: depth maps (providing 3D spatial understanding from 2D observations), semantic and instance segmentation (identifying every object and its boundaries), human and hand pose estimation (for manipulation and interaction understanding), action labels (temporal boundaries of discrete actions with verb-noun descriptions), optical flow (dense motion fields capturing inter-frame dynamics), and object affordance annotations (which parts of objects can be grasped, pushed, or operated). Claru provides all of these layers through a combination of automated enrichment models and human annotation, with cross-validation between layers to ensure consistency.",
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

export default function PhysicalAITrainingDataPage() {
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
                  Physical AI Training Data
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
              Physical AI Training Data: Real-World Datasets for Models That
              Understand Physics
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl text-white/70">
              Physical AI systems &mdash; robots, world models, embodied agents
              &mdash; cannot learn physics from text or static images. They need
              video of the real world: objects falling, hands grasping, tools
              operating, people navigating. Claru provides this data at scale.
            </p>
          </div>
        </section>

        {/* ── What Is Physical AI ─────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              What Is Physical AI and Why Does It Need Different Data?
            </h2>

            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Physical AI is artificial intelligence that operates in the
                physical world. It includes any system that must understand
                three-dimensional space, predict how objects move and interact,
                or take physical actions based on sensory input. This is
                fundamentally different from language models (which process
                token sequences) or image classifiers (which label static
                photographs).
              </p>

              <p>
                A physical AI system solving a simple task &mdash; picking up
                a cup from a cluttered table &mdash; must understand depth
                (how far away is the cup), geometry (what shape is the cup,
                where is the handle), physics (how heavy is it, will it tip
                if grasped from the side), semantics (that is a cup, not a
                bowl), and dynamics (the cup will move when I push it, the
                liquid will slosh). This multi-layered understanding cannot
                be learned from internet text or stock photography.
              </p>

              <p>
                <strong className="text-white">
                  Physical AI requires training data that captures how the
                  real world works
                </strong>
                : video showing physical interactions, depth information
                revealing 3D structure, segmentation maps identifying object
                boundaries, pose estimates tracking how hands and bodies
                move, and action labels describing what is happening and
                when. This data must come from diverse real-world
                environments, not just simulation, because no simulator
                perfectly reproduces the visual and physical complexity of
                reality.
              </p>
            </div>
          </div>
        </section>

        {/* ── The Physical AI Stack ───────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              The Physical AI Stack: Where Training Data Fits
            </h2>
            <p className="text-white/70 mb-12 text-lg">
              Physical AI is not a single model &mdash; it is a stack of
              capabilities, each requiring distinct data.
            </p>

            <div className="space-y-8">
              {[
                {
                  layer: "Perception",
                  description:
                    "The system must build a 3D understanding of its environment from raw sensor input. This includes depth estimation, object detection and segmentation, scene reconstruction, and spatial relationship reasoning. Training perception requires video with ground-truth depth, segmentation masks, and 3D bounding boxes.",
                  data: "Egocentric video with depth maps, semantic segmentation, instance segmentation",
                  link: "/egocentric-video-datasets",
                },
                {
                  layer: "World Modeling",
                  description:
                    "A world model predicts how the scene will change — what happens if I push this object? Where will it land? World models are trained on video sequences showing physical interactions, learning the implicit physics of the environment. They need diverse footage of objects being manipulated, dropped, stacked, poured, and rearranged.",
                  data: "Long-duration video of physical interactions with optical flow and action labels",
                  link: "/embodied-ai-datasets",
                },
                {
                  layer: "Policy Learning",
                  description:
                    "The policy maps observations to actions — given what I see, what should I do? Policies are trained via imitation learning (mimicking demonstrations) or reinforcement learning (optimizing a reward signal). Both require paired observation-action data: what the robot saw and what it did, synchronized at millisecond precision.",
                  data: "Manipulation trajectories, teleoperation demonstrations, action-labeled egocentric video",
                  link: "/training-data-for-robotics",
                },
                {
                  layer: "Language Grounding",
                  description:
                    "Modern physical AI systems accept natural language instructions. Grounding language to physical actions requires data where natural language descriptions are paired with the corresponding physical demonstrations. This enables systems like RT-2 and Octo to follow instructions like 'pick up the red cup and place it on the shelf.'",
                  data: "Video-caption pairs, instruction-following demonstrations, natural language action labels",
                  link: "/solutions/vla-training-data",
                },
              ].map((item) => (
                <div
                  key={item.layer}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {item.layer}
                  </h3>
                  <p className="text-white/70 leading-relaxed mb-3">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span
                      className="text-xs font-mono uppercase tracking-wider"
                      style={{ color: "#92B090" }}
                    >
                      Data needed:
                    </span>
                    <span className="text-sm text-white/60">{item.data}</span>
                  </div>
                  <Link
                    href={item.link}
                    className="inline-block mt-3 text-sm font-medium underline underline-offset-2"
                    style={{ color: "#92B090" }}
                  >
                    Related datasets &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Synthetic Data Alone Is Not Enough ───────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Why Synthetic Data Alone Is Not Enough for Physical AI
            </h2>

            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Simulation has made remarkable progress. Engines like
                NVIDIA IsaacSim, MuJoCo, and PyBullet can render
                photorealistic scenes and simulate rigid body physics at
                real-time speeds. For many teams, synthetic data is the
                starting point for pre-training.
              </p>

              <p>
                But simulation has fundamental limitations that create a
                persistent gap between simulated and real-world
                performance:
              </p>

              <ul className="space-y-3 pl-4">
                {[
                  {
                    bold: "Visual distribution mismatch.",
                    text: "Simulated textures, lighting, and materials do not fully capture the variability of real environments. A robot trained on simulated kitchens will encounter real countertops, reflective surfaces, transparent objects, and clutter patterns that no simulator has modeled.",
                  },
                  {
                    bold: "Physics approximation.",
                    text: "Real-world contact dynamics — friction, deformation, compliance, granular materials, liquids — are approximated in simulation, not reproduced. A policy that works perfectly in MuJoCo may fail when the real object is slightly heavier, more slippery, or more compliant than the simulated version.",
                  },
                  {
                    bold: "Long-tail scenarios.",
                    text: "Real environments contain an effectively infinite variety of objects, arrangements, and disturbances. Simulation can model known variations, but it cannot anticipate every real-world surprise. A child's toy on the floor, a wet surface, an unexpected reflection — these edge cases determine whether a deployed system works or fails.",
                  },
                  {
                    bold: "Sensor noise and calibration.",
                    text: "Real cameras have lens distortion, motion blur, rolling shutter artifacts, and varying exposure. Real depth sensors have noise patterns that differ from simulated depth. Training on clean synthetic data produces policies that are brittle to sensor imperfections.",
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
                The current standard approach is{" "}
                <strong className="text-white">
                  pre-train on synthetic data, then fine-tune on real-world
                  data
                </strong>
                . The synthetic data provides task structure and volume.
                The real-world data provides the visual and physical
                fidelity needed for deployment. Claru provides the
                real-world side of this equation &mdash; the data that
                cannot be generated in a simulator.
              </p>
            </div>
          </div>
        </section>

        {/* ── Claru's Data Pipeline ───────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Claru&apos;s End-to-End Data Pipeline for Physical AI
            </h2>
            <p className="text-white/70 mb-12 text-lg">
              From raw video capture through multi-layer enrichment to
              delivery in your training pipeline&apos;s native format.
            </p>

            {/* Pipeline visualization */}
            <div className="flex flex-col md:flex-row md:items-stretch gap-4 mb-12">
              {[
                {
                  label: "Capture",
                  items: [
                    "Wearable cameras (GoPro, smartphones)",
                    "Managed teleoperation",
                    "Game-based capture",
                    "10,000+ contributors",
                    "100+ cities worldwide",
                  ],
                },
                {
                  label: "Enrich",
                  items: [
                    "Monocular depth estimation",
                    "Semantic + instance segmentation",
                    "Human + hand pose estimation",
                    "Optical flow computation",
                    "AI-generated captions",
                  ],
                },
                {
                  label: "Annotate",
                  items: [
                    "Action boundary labels",
                    "Object affordance tags",
                    "Quality scoring (blur, occlusion)",
                    "Domain-specific metadata",
                    "Cross-annotator validation",
                  ],
                },
                {
                  label: "Deliver",
                  items: [
                    "WebDataset, HDF5, Parquet, RLDS",
                    "S3 or GCS delivery",
                    "Datasheet + methodology docs",
                    "Checksums + manifests",
                    "Custom format support",
                  ],
                },
              ].map((stage, i) => (
                <div
                  key={stage.label}
                  className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] p-5"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="w-7 h-7 rounded flex items-center justify-center text-xs font-mono font-bold"
                      style={{
                        backgroundColor: "rgba(146,176,144,0.15)",
                        color: "#92B090",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {stage.label}
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {stage.items.map((item) => (
                      <li
                        key={item}
                        className="text-xs text-white/60 flex items-start gap-1.5"
                      >
                        <span className="text-white/30 mt-0.5">&#8226;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="space-y-4 text-white/80 leading-relaxed">
              <p>
                Every stage of the pipeline is designed for the specific
                requirements of physical AI research. Capture protocols
                ensure consistent camera perspectives and sufficient
                temporal resolution (minimum 30 FPS, 60 FPS for
                fast-motion tasks). Enrichment models are selected and
                validated for the robotics domain — our depth estimation
                pipeline is calibrated against LiDAR ground truth where
                available. Annotation guidelines are developed in
                collaboration with each client&apos;s ML team to ensure labels
                match the exact format and granularity their training code
                expects.
              </p>
            </div>
          </div>
        </section>

        {/* ── Stats ───────────────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-10">
              Physical AI Data at Scale
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[
                {
                  stat: "3.7M+",
                  label: "Human annotations",
                  context:
                    "across egocentric video, game environments, and custom captures — not automated labels, but human-verified annotations",
                },
                {
                  stat: "500K+",
                  label: "Egocentric video clips",
                  context:
                    "first-person video from real-world environments including kitchens, workshops, warehouses, and outdoor spaces",
                },
                {
                  stat: "10,000+",
                  label: "Data contributors",
                  context:
                    "trained collectors with wearable cameras deployed across 100+ cities on 6 continents",
                },
                {
                  stat: "25+",
                  label: "Licensed datasets",
                  context:
                    "commercially available datasets built for robotics, video generation, and embodied AI research",
                },
                {
                  stat: "10,000+",
                  label: "Hours of game capture",
                  context:
                    "synchronized video and input data from custom game environments with perfect action labels",
                },
                {
                  stat: "6",
                  label: "Enrichment layers",
                  context:
                    "depth, segmentation, pose, optical flow, captions, and action labels applied to every clip",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-5"
                >
                  <div
                    className="text-3xl font-bold font-mono mb-1"
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

        {/* ── Who Is Building Physical AI ──────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              The Physical AI Landscape
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Physical AI has moved from research papers to funded companies
              with deployment timelines. Here is where the field stands.
            </p>

            <div className="space-y-6 text-white/80 leading-relaxed">
              <p>
                <strong className="text-white">Humanoid robotics</strong>{" "}
                has attracted billions in venture capital. Multiple companies
                have demonstrated bipedal platforms performing warehouse
                tasks, household chores, and factory operations. These
                systems universally rely on imitation learning from human
                demonstrations — and they are all data-constrained.
              </p>

              <p>
                <strong className="text-white">World models</strong> are
                emerging as a foundational capability. Learned simulators
                trained on video data can predict future states of physical
                scenes, enabling planning without explicit physics engines.
                Video generation companies and robotics labs are converging
                on world models as a shared technical layer — and both need
                the same input: diverse video of physical interactions.
              </p>

              <p>
                <strong className="text-white">
                  Vision-language-action (VLA) models
                </strong>{" "}
                represent the current frontier of robot policy architectures.
                These models combine pre-trained vision-language backbones
                with action prediction heads, enabling robots to follow
                natural language instructions. VLA models are more
                data-efficient than previous approaches but still require
                tens of thousands of real-world demonstrations for robust
                deployment.
              </p>

              <p>
                <strong className="text-white">Autonomous systems</strong>{" "}
                beyond robotics — self-driving vehicles, drones, agricultural
                equipment — face the same data challenge: they need diverse
                real-world observations to handle the long tail of
                scenarios that simulation cannot cover.
              </p>

              <p>
                Across all of these verticals, the pattern is the same.
                The algorithms have converged on learned policies. The
                hardware is advancing rapidly. The binding constraint is{" "}
                <strong className="text-white">data</strong> — specifically,
                real-world data that captures the diversity and complexity
                of physical environments.
              </p>
            </div>
          </div>
        </section>

        {/* ── Related Resources ───────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Explore Related Data Solutions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  href: "/training-data-for-robotics",
                  title: "Training Data for Robotics",
                  desc: "Purpose-built datasets for robot manipulation, navigation, and locomotion.",
                },
                {
                  href: "/egocentric-video-datasets",
                  title: "Egocentric Video Datasets",
                  desc: "First-person video data for embodied AI and world models.",
                },
                {
                  href: "/embodied-ai-datasets",
                  title: "Embodied AI Datasets",
                  desc: "Training data for agents that perceive and act in the real world.",
                },
                {
                  href: "/solutions/vla-training-data",
                  title: "VLA Training Data",
                  desc: "Vision-language-action data from collection to policy.",
                },
                {
                  href: "/solutions/sim-to-real-data",
                  title: "Sim-to-Real Data Collection",
                  desc: "Real-world data to bridge the simulation-to-deployment gap.",
                },
                {
                  href: "/case-studies/egocentric-video-collection",
                  title: "Case Study: Egocentric Collection",
                  desc: "Large-scale first-person video capture across 500 contributors.",
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
              Building a Physical AI System? Start With the Right Data.
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Tell us what your model needs to understand about the
              physical world. We&apos;ll design the dataset.
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
