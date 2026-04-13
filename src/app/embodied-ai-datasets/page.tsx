import type { Metadata } from "next";
import Link from "next/link";
import GeoPageShell from "@/app/components/content/GeoPageShell";

// =============================================================================
// META
// =============================================================================

export const metadata: Metadata = {
  title:
    "Embodied AI Datasets: Training Data for Agents That Act in the Real World | Claru",
  description:
    "Training data for embodied AI from Claru. Real-world video and annotations for mobile robots, humanoids, and autonomous systems. 4M+ annotations, 500K+ clips.",
  keywords: [
    "embodied AI training data",
    "embodied AI datasets",
    "embodied agent datasets",
    "real-world AI training data",
    "embodied intelligence data",
    "grounded AI datasets",
    "interactive AI training data",
    "embodied perception data",
    "robot learning dataset",
    "embodied navigation data",
  ],
  openGraph: {
    title:
      "Embodied AI Datasets: Training Data for Agents That Act in the Real World",
    description:
      "Real-world training data for embodied AI from Claru. Purpose-built for mobile robots, humanoids, manipulation systems, and autonomous platforms.",
    type: "article",
    url: "https://claru.ai/embodied-ai-datasets",
    siteName: "Claru",
    images: [
      {
        url: "/images/og-v2.webp",
        width: 1200,
        height: 630,
        alt: "Claru — Embodied AI Datasets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Embodied AI Datasets | Claru",
    description:
      "Training data for embodied agents. Real-world video, manipulation demos, multi-layer annotations. 4M+ annotations.",
  },
  alternates: {
    canonical: "https://claru.ai/embodied-ai-datasets",
  },
};

// =============================================================================
// FAQ JSON-LD
// =============================================================================

const faqItems = [
  {
    question: "What is embodied AI?",
    answer:
      "Embodied AI refers to artificial intelligence systems that have a physical body (or control a physical body) and interact with the real world through sensors and actuators. Unlike disembodied AI (language models, image classifiers, recommender systems) that operates entirely in the digital domain, embodied AI must perceive physical environments through cameras, LiDAR, and other sensors, reason about 3D space and physics, and take physical actions — grasping objects, walking, navigating, and manipulating tools. Examples include mobile robots, humanoid robots, robotic arms, autonomous vehicles, drones, and assistive devices. The defining characteristic is the closed loop between perception and action in the physical world.",
  },
  {
    question: "What is the data challenge for embodied AI?",
    answer:
      "Embodied AI faces a unique data challenge compared to other AI domains. Language models can train on trillions of tokens scraped from the internet. Image classifiers can use billions of labeled images. But embodied AI data — demonstrations of physical tasks, sensor recordings from real environments, action-labeled video of manipulation and navigation — cannot be scraped from the web. It must be physically collected, which means deploying cameras and sensors in diverse real-world environments, recording human demonstrations of target tasks, annotating the resulting data with depth, segmentation, pose, and action labels, and validating quality to ensure the data will produce useful policies. This makes embodied AI training data more expensive per sample, harder to scale, and more prone to distribution gaps than digital AI training data.",
  },
  {
    question: "What types of embodied AI systems exist?",
    answer:
      "Embodied AI systems span several categories. Mobile robots navigate and operate in unstructured environments — warehouse floors, hospital corridors, outdoor terrain. Humanoid robots perform bipedal locomotion and bimanual manipulation tasks in spaces designed for humans. Manipulation systems (robotic arms) perform pick-and-place, assembly, food preparation, and tool use in fixed or semi-fixed workspaces. Autonomous vehicles perceive and navigate traffic, road, and off-road environments. Drones perform aerial navigation, inspection, and delivery. Assistive devices provide physical support, rehabilitation, and human augmentation. Each category requires data that reflects its specific sensor configuration, workspace, and task repertoire.",
  },
  {
    question: "Why does real-world data beat simulation for embodied AI?",
    answer:
      "Simulation provides valuable training signal — especially for pre-training and learning task structure — but real-world data remains essential for deployment-ready embodied AI. The reasons are fundamental. First, the sim-to-real gap: simulated environments approximate but do not perfectly reproduce real-world visual appearance (lighting, textures, materials, reflections) or physics (contact dynamics, friction, deformable objects, granular materials). Policies trained purely in simulation typically lose 30-60% of their success rate when transferred to real hardware. Second, long-tail coverage: real environments contain an effectively infinite variety of objects, arrangements, and situations that no simulator can exhaustively model. Real-world data captures this long tail naturally. Third, sensor realism: real cameras have noise, distortion, motion blur, and varying exposure that simulated sensors do not fully replicate. The consensus approach in 2025-2026 is sim-then-real: pre-train in simulation for structure, then fine-tune on real-world data for deployment robustness.",
  },
  {
    question: "What enrichment layers does Claru provide for embodied AI data?",
    answer:
      "Claru provides six standard enrichment layers on all video data. Monocular depth estimation: per-frame depth maps enabling 3D scene understanding from a single camera, calibrated against LiDAR ground truth where available. Semantic segmentation: per-pixel object class labels across 100+ categories. Instance segmentation: per-pixel instance identifiers distinguishing individual objects. Human and hand pose estimation: 2D and 3D joint positions for body (17+ keypoints) and hands (21 keypoints each). Optical flow: dense inter-frame motion vectors capturing scene dynamics. AI-generated captions: natural language descriptions of activities and spatial relationships. Additional layers — action boundary labels, object affordance annotations, 3D mesh reconstruction, contact point annotation — are available as custom enrichment based on project requirements.",
  },
  {
    question: "What delivery formats does Claru support for embodied AI datasets?",
    answer:
      "Claru delivers datasets in the formats embodied AI teams use for training. WebDataset: tar-based shards with co-located video, annotations, and metadata for high-throughput streaming training. Parquet: columnar format for tabular metadata, filtering, and querying. HDF5: hierarchical format for dense numeric arrays like trajectories and depth maps. RLDS (Reinforcement Learning Datasets): TensorFlow Datasets format used by many robotics research pipelines. NumPy archives: for direct integration with PyTorch and JAX training loops. Video is delivered as MP4 (H.264/H.265) or extracted frames (PNG/WebP). All deliveries include SHA-256 checksums, manifests, and datasheets documenting methodology and intended use. Custom formats and direct S3/GCS delivery are standard.",
  },
  {
    question: "How does Claru handle diversity in embodied AI datasets?",
    answer:
      "Diversity in embodied AI data is critical because policies must generalize across environments, objects, and conditions they were not explicitly trained on. Claru addresses diversity across multiple dimensions. Geographic diversity: 10,000+ contributors in 100+ cities across 14+ countries capture data in locally authentic environments. Environmental diversity: 12+ environment categories from residential kitchens to industrial warehouses. Object diversity: hundreds of thousands of unique objects across categories, captured in natural configurations rather than staged setups. Lighting diversity: data collected at different times of day, under different weather conditions, and with different artificial lighting. Demographic diversity: contributors from varied age groups, physical builds, and cultural backgrounds, ensuring manipulation styles and spatial behaviors are broadly represented. Each dataset delivery includes a diversity report quantifying the distribution across these dimensions.",
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

export default function EmbodiedAIDatasetsPage() {
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
                  Embodied AI Datasets
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
              Embodied AI Datasets: Training Data for Agents That Act in
              the Real World
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl text-white/70">
              Embodied AI agents must perceive, reason about, and
              physically interact with their environment. Training them
              requires data that captures the full complexity of the real
              world &mdash; not static images or text, but video with
              depth, segmentation, pose, and action annotations from
              diverse physical environments.
            </p>
          </div>
        </section>

        {/* ── What Is Embodied AI ─────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              What Is Embodied AI and Why Data Is the Bottleneck
            </h2>

            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Embodied AI is the branch of artificial intelligence
                concerned with agents that have physical bodies and
                interact with the real world. Unlike chatbots, image
                generators, or recommendation engines that operate entirely
                in software, embodied AI systems must close the loop
                between perception and action in physical space.
              </p>

              <p>
                A mobile robot navigating a warehouse must perceive
                shelves, pallets, and other robots; plan collision-free
                paths; and execute motor commands to move through the
                space. A humanoid folding laundry must identify garment
                types, determine grasp strategies, and coordinate
                bimanual manipulation while adapting to fabric deformation.
                An autonomous vehicle must detect other road users, predict
                their future trajectories, and control steering and
                acceleration in real time.
              </p>

              <p>
                <strong className="text-white">
                  The common data challenge across all embodied AI is
                  capturing the true distribution of real-world environments
                </strong>
                . Internet scraping — the approach that powered the
                language model revolution — does not work for embodied AI.
                The data these systems need must be physically collected:
                cameras deployed in real environments, human demonstrations
                of real tasks, sensor recordings from real platforms. This
                makes data the binding constraint for embodied AI
                progress.
              </p>
            </div>
          </div>
        </section>

        {/* ── Types of Embodied AI Systems ─────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Types of Embodied AI and Their Data Requirements
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Each category of embodied AI system has distinct data needs
              driven by its sensor configuration, workspace, and task
              repertoire.
            </p>

            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                      System Type
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                      Key Data Needs
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                      Claru Data
                    </th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  {[
                    {
                      type: "Mobile Robots",
                      needs:
                        "Navigation video with depth, obstacle maps, traversability labels, indoor/outdoor diversity",
                      claru:
                        "90K+ outdoor/navigation clips, warehouse footage, indoor navigation data with depth + segmentation",
                    },
                    {
                      type: "Humanoid Robots",
                      needs:
                        "Full-body motion data, bimanual manipulation demos, whole-body egocentric video, locomotion sequences",
                      claru:
                        "Egocentric video with body + hand pose, 10+ workplace categories, diverse manipulation demonstrations",
                    },
                    {
                      type: "Manipulation Systems",
                      needs:
                        "Grasp demonstrations, pick-and-place trajectories, tool use examples, object geometry diversity",
                      claru:
                        "386K+ egocentric manipulation clips, kitchen/workshop/warehouse settings, action boundary labels",
                    },
                    {
                      type: "Autonomous Vehicles",
                      needs:
                        "Driving video with depth, lane detection data, pedestrian and vehicle tracking, diverse road conditions",
                      claru:
                        "Urban navigation footage, depth estimation, pedestrian segmentation, multi-city geographic diversity",
                    },
                    {
                      type: "Drones / Aerial Systems",
                      needs:
                        "Aerial navigation video, altitude estimation, obstacle avoidance scenarios, inspection footage",
                      claru:
                        "Custom aerial capture campaigns, outdoor environment video, depth + segmentation enrichment",
                    },
                    {
                      type: "Assistive Devices",
                      needs:
                        "Human activity video, gesture recognition data, gait analysis footage, daily living activities",
                      claru:
                        "Egocentric daily activity video, hand + body pose, 12+ activity categories, diverse demographics",
                    },
                  ].map((row, i) => (
                    <tr
                      key={row.type}
                      className={
                        i % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                      }
                    >
                      <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                        {row.type}
                      </td>
                      <td className="px-4 py-3">{row.needs}</td>
                      <td className="px-4 py-3">{row.claru}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Why Real-World Data ──────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Why Real-World Data Is Essential for Embodied AI
            </h2>

            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                The argument for real-world data in embodied AI is not
                that simulation is bad &mdash; simulation is a valuable
                tool for pre-training, reward shaping, and safe
                exploration. The argument is that{" "}
                <strong className="text-white">
                  simulation alone is insufficient for deployment-ready
                  policies
                </strong>
                .
              </p>

              <p>
                Here is why, with concrete examples:
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: "The visual domain gap is real and measurable",
                    content:
                      "In controlled experiments, robotic manipulation policies trained on simulated environments and transferred to real hardware without real-world fine-tuning typically show a 30-60% reduction in success rate. The gap comes from visual details simulation misses: the way light reflects off a stainless steel surface, the precise texture of different plastics, the visual clutter of a real kitchen counter. Even photorealistic renderers like NVIDIA Omniverse leave a distribution gap that models notice.",
                  },
                  {
                    title: "Physics simulation is approximate by design",
                    content:
                      "Simulators model rigid body dynamics well, but real-world manipulation involves deformable objects (cloth, food, cables), granular materials (rice, sand, screws), liquids, and compliant contacts (sponges, foam, human skin). A policy trained in simulation to fold towels learns incorrect force expectations because no simulator fully captures fabric dynamics. Real-world demonstrations provide ground-truth physics.",
                  },
                  {
                    title: "Long-tail environments cannot be exhaustively modeled",
                    content:
                      "A warehouse robot will encounter products in packaging that did not exist when the simulation asset library was built. A household robot will face kitchen layouts, appliances, and object arrangements that no simulator anticipated. Real-world data provides natural coverage of the long tail — every real environment is unique in ways that procedural generation cannot fully replicate.",
                  },
                  {
                    title: "Embodiment-specific calibration requires real hardware",
                    content:
                      "The exact camera intrinsics, mounting position, and sensor noise characteristics of a deployed robot can only be captured by running that robot (or a viewpoint-equivalent proxy) in real environments. Simulated sensor models approximate but do not reproduce the actual sensor pipeline.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="border-l-2 pl-6"
                    style={{ borderColor: "rgba(146,176,144,0.4)" }}
                  >
                    <h3 className="text-base font-semibold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Claru's Enrichment Pipeline ──────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Claru&apos;s Multi-Layer Enrichment Pipeline
            </h2>
            <p className="text-white/70 mb-12 text-lg">
              Raw video is the starting material. Claru transforms it into
              training-ready data through automated enrichment and human
              annotation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Depth Estimation",
                  description:
                    "Per-frame monocular depth maps providing 3D spatial understanding from a single camera. Metric or relative depth at every pixel. Calibrated against LiDAR ground truth where available. Enables distance estimation, obstacle detection, and 3D scene reconstruction from 2D video.",
                  output: "16-bit PNG or float32 NumPy arrays",
                },
                {
                  title: "Semantic + Instance Segmentation",
                  description:
                    "Per-pixel labels identifying object class (100+ categories) and individual instance identity. Distinguishes between 'cup A' and 'cup B' on the same table. Provides the object-level understanding embodied agents need for task planning and execution.",
                  output: "Indexed PNG masks or uint16 NumPy arrays",
                },
                {
                  title: "Pose Estimation",
                  description:
                    "2D and 3D joint positions for full body (17+ keypoints) and detailed hand articulation (21 keypoints per hand). Critical for understanding how humans manipulate objects — grasp types, hand trajectories, bimanual coordination patterns.",
                  output: "JSON keypoint arrays or COCO-format",
                },
                {
                  title: "Optical Flow",
                  description:
                    "Dense motion vectors between consecutive frames capturing both camera ego-motion and independent object motion. Reveals scene dynamics: which objects are moving, how fast, in what direction. Complements static depth and segmentation with temporal information.",
                  output: "Float16 .flo files or NumPy arrays",
                },
                {
                  title: "AI-Generated Captions",
                  description:
                    "Natural language descriptions of activities, objects, and spatial relationships in each clip. Generated by vision-language models and validated for accuracy. Enables language-grounded training for instruction-following embodied agents.",
                  output: "UTF-8 text with per-clip granularity",
                },
                {
                  title: "Action Boundary Labels",
                  description:
                    "Temporal annotations marking the start and end of discrete actions: reach, grasp, lift, transport, place, cut, pour, open, close. Follows a structured verb-noun taxonomy. Provided by human annotators for precise temporal boundaries that automated systems cannot reliably detect.",
                  output: "JSON with timestamp ranges + verb-noun labels",
                },
              ].map((layer) => (
                <div
                  key={layer.title}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {layer.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-3">
                    {layer.description}
                  </p>
                  <span className="text-xs font-mono text-white/40">
                    Output: {layer.output}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10 text-white/80 leading-relaxed">
              <p>
                All enrichment layers are cross-validated for consistency.
                Depth boundaries are checked against segmentation edges.
                Pose estimates are validated against temporal smoothness
                constraints. Captions are checked against segmentation
                labels for factual accuracy. This multi-layer consistency
                check ensures that embodied AI models receive coherent,
                non-contradictory supervision signals.
              </p>
            </div>
          </div>
        </section>

        {/* ── Delivery Formats ────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Delivery Formats for Embodied AI Training
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Claru delivers data in the formats embodied AI teams
              actually use — not proprietary formats that require
              conversion.
            </p>

            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                      Format
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                      Best For
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                      Typical Use Case
                    </th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  {[
                    {
                      format: "WebDataset",
                      bestFor: "Streaming training at scale",
                      useCase:
                        "Large-scale pre-training runs where data is read sequentially from sharded tar files",
                    },
                    {
                      format: "Parquet",
                      bestFor: "Metadata, filtering, querying",
                      useCase:
                        "Dataset exploration, subset selection, metadata-driven training curriculum",
                    },
                    {
                      format: "HDF5",
                      bestFor: "Dense numeric arrays",
                      useCase:
                        "Trajectory data, depth map archives, pose sequence storage",
                    },
                    {
                      format: "RLDS / TFDS",
                      bestFor: "RL pipelines",
                      useCase:
                        "Reinforcement learning from demonstrations, offline RL training",
                    },
                    {
                      format: "NumPy Archives",
                      bestFor: "Direct PyTorch/JAX integration",
                      useCase:
                        "Custom training loops that load data directly as numpy arrays",
                    },
                    {
                      format: "HuggingFace Datasets",
                      bestFor: "Broad ecosystem compatibility",
                      useCase:
                        "Teams using the HuggingFace training stack for fine-tuning foundation models",
                    },
                  ].map((row, i) => (
                    <tr
                      key={row.format}
                      className={
                        i % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                      }
                    >
                      <td className="px-4 py-3 font-medium text-white font-mono">
                        {row.format}
                      </td>
                      <td className="px-4 py-3">{row.bestFor}</td>
                      <td className="px-4 py-3">{row.useCase}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-6 text-white/70 leading-relaxed">
              Every delivery includes a SHA-256 checksum manifest and a
              datasheet documenting collection methodology, annotator
              demographics, geographic distribution, known limitations, and
              intended use cases. Custom formats are available on request.
              Data is delivered via S3, GCS, or direct integration with
              your cloud infrastructure.
            </p>
          </div>
        </section>

        {/* ── Stats ───────────────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-10">
              Embodied AI Data at Scale
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[
                {
                  stat: "4M+",
                  label: "Human annotations",
                  context:
                    "across egocentric video, game environments, and custom captures",
                },
                {
                  stat: "500K+",
                  label: "Video clips",
                  context:
                    "egocentric and third-person video from diverse real-world environments",
                },
                {
                  stat: "12+",
                  label: "Environment categories",
                  context:
                    "kitchens, warehouses, workshops, retail, outdoor, offices, and more",
                },
                {
                  stat: "10,000+",
                  label: "Contributors",
                  context:
                    "in 100+ cities across 14+ countries for maximum environmental diversity",
                },
                {
                  stat: "6",
                  label: "Enrichment layers",
                  context:
                    "depth, segmentation, pose, optical flow, captions, and action labels",
                },
                {
                  stat: "100+",
                  label: "Licensed datasets",
                  context:
                    "commercially available for robotics, video generation, and embodied AI",
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

        {/* ── Related Resources ───────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Related Solutions and Case Studies
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  href: "/training-data-for-robotics",
                  title: "Training Data for Robotics",
                  desc: "Purpose-built datasets for robot manipulation, navigation, and locomotion.",
                },
                {
                  href: "/physical-ai-training-data",
                  title: "Physical AI Training Data",
                  desc: "Real-world datasets for models that understand physics.",
                },
                {
                  href: "/egocentric-video-datasets",
                  title: "Egocentric Video Datasets",
                  desc: "First-person video data for embodied perception and action.",
                },
                {
                  href: "/solutions/vla-training-data",
                  title: "VLA Training Data",
                  desc: "Vision-language-action data from collection to policy training.",
                },
                {
                  href: "/solutions/open-datasets-vs-custom",
                  title: "Open Datasets vs. Custom Collection",
                  desc: "When open robotics datasets are enough, and when they are not.",
                },
                {
                  href: "/case-studies/game-based-data-capture",
                  title: "Case Study: Game-Based Data Capture",
                  desc: "10,000+ hours of synchronized video and input from custom game environments.",
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
              Building an Embodied AI System? The Data Exists.
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Tell us about your agent, its sensors, and its tasks.
              We&apos;ll match you with existing datasets or design a
              custom collection.
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
