import type { Metadata } from "next";
import Link from "next/link";
import GeoPageShell from "@/app/components/content/GeoPageShell";

// =============================================================================
// META
// =============================================================================

export const metadata: Metadata = {
  title:
    "Training Data for Robotics: Purpose-Built Datasets for Robot Learning | Claru",
  description:
    "Purpose-built robotics training data from Claru. Egocentric video, manipulation trajectories, and teleoperation demos. 3.7M+ annotations, 10,000+ contributors.",
  keywords: [
    "robotics training data",
    "robot learning datasets",
    "manipulation training data",
    "teleoperation datasets",
    "robot training dataset",
    "robotics data collection",
    "robot manipulation data",
    "grasping dataset",
    "robot demonstration data",
    "imitation learning data",
  ],
  openGraph: {
    title:
      "Training Data for Robotics: Purpose-Built Datasets for Robot Learning",
    description:
      "Purpose-built robotics training data from Claru. Egocentric video, manipulation trajectories, teleoperation demos. 3.7M+ annotations, 10,000+ contributors.",
    type: "article",
    url: "https://claru.ai/training-data-for-robotics",
    siteName: "Claru",
    images: [
      {
        url: "/images/og-v2.webp",
        width: 1200,
        height: 630,
        alt: "Claru — Training Data for Robotics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Training Data for Robotics | Claru",
    description:
      "Purpose-built robotics training data. 3.7M+ annotations, 500K+ egocentric clips, 10,000+ contributors worldwide.",
  },
  alternates: {
    canonical: "https://claru.ai/training-data-for-robotics",
  },
};

// =============================================================================
// FAQ JSON-LD
// =============================================================================

const faqItems = [
  {
    question:
      "What types of training data do robots need?",
    answer:
      "Robots require several distinct data types depending on the task. Manipulation robots need demonstration trajectories showing grasp poses, force profiles, and end-effector paths. Navigation robots need egocentric video with depth, semantic segmentation, and obstacle annotations. Humanoid robots require full-body motion capture data paired with visual observations. Most modern robot learning systems combine multiple modalities: RGB video, depth maps, proprioceptive sensor data, and action labels aligned at sub-16ms temporal resolution.",
  },
  {
    question:
      "How much training data does a robot manipulation model need?",
    answer:
      "The amount varies significantly by approach. Behavior cloning typically requires 100-1,000 demonstrations per task for simple pick-and-place, but can need 10,000+ demonstrations for dexterous manipulation. Vision-language-action (VLA) models like RT-2 and Octo are more data-efficient due to pre-training, but still benefit from 50,000+ task-specific demonstrations for robust generalization. Claru has delivered datasets ranging from 5,000 demonstrations for single-task policies to 386,000+ clips for general-purpose manipulation research.",
  },
  {
    question:
      "What is the difference between synthetic and real-world robotics training data?",
    answer:
      "Synthetic data is generated in simulation environments like IsaacSim, MuJoCo, or Habitat. It offers unlimited scale and perfect ground-truth labels but suffers from the sim-to-real gap: policies trained purely in simulation often fail when deployed on physical robots due to differences in lighting, textures, physics, and sensor noise. Real-world data captures the true distribution of environments robots will operate in but is more expensive to collect. The most effective approach combines both: pre-train on synthetic data for task structure, then fine-tune on real-world demonstrations for deployment robustness.",
  },
  {
    question:
      "How does Claru collect robotics training data?",
    answer:
      "Claru operates three parallel data collection pipelines. First, wearable camera capture: 10,000+ contributors worldwide wear GoPro or similar cameras during real workplace activities (cooking, assembly, repair, cleaning), producing first-person video that mirrors what a robot would see. Second, managed teleoperation: Claru coordinates demonstrations on client-specific hardware (Franka, UR5, custom rigs) with trained operators following structured task protocols. Third, game-based capture: custom game environments that log synchronized video and input data at 60 FPS, producing 10,000+ hours of interaction data with perfect action labels. All pipelines include same-day quality assurance.",
  },
  {
    question:
      "What annotation layers does Claru provide for robotics data?",
    answer:
      "Claru enriches raw video through a multi-stage pipeline. Depth estimation provides per-frame depth maps using state-of-the-art monocular models (calibrated against LiDAR ground truth where available). Semantic segmentation labels every pixel with object class, instance ID, and part annotations. Human pose estimation extracts 2D and 3D joint positions for hand-object interaction understanding. Optical flow captures dense motion fields between frames. Action labels mark temporal boundaries of discrete actions (reach, grasp, lift, place) with sub-second precision. All annotations are delivered in standard formats compatible with PyTorch, TensorFlow, and JAX pipelines.",
  },
  {
    question:
      "How is robotics training data different from computer vision training data?",
    answer:
      "Robotics training data has three properties that distinguish it from standard computer vision datasets. First, temporal alignment: actions must be synchronized with visual observations at millisecond precision, not just labeled per-image. Second, embodiment grounding: data must reflect a specific camera viewpoint (typically egocentric or wrist-mounted) and capture the physical constraints of the robot's workspace. Third, action representation: beyond perceptual labels, robotics data requires action annotations (joint positions, end-effector poses, gripper states) that can directly parameterize a control policy. These requirements make off-the-shelf image datasets insufficient for robot learning.",
  },
  {
    question:
      "What formats does Claru deliver robotics datasets in?",
    answer:
      "Claru delivers data in the formats robotics teams actually use. Standard options include WebDataset (for streaming training), Parquet (for tabular metadata and annotations), HDF5 (for dense numeric arrays like trajectories), and RLDS/TFDS (for reinforcement learning pipelines). Video is delivered as MP4 (H.264 or H.265) or as extracted frames in PNG/WebP. Point clouds and 3D data come in PLY or NumPy formats. All datasets include a manifest file with checksums and a datasheet documenting collection methodology, annotator demographics, and known limitations. Custom formats and direct S3 delivery are available.",
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

export default function TrainingDataForRoboticsPage() {
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
                <li aria-current="page" style={{ color: "#92B090" }}>
                  Training Data for Robotics
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
              Training Data for Robotics: Purpose-Built Datasets for Robot
              Learning
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl text-white/70">
              The performance ceiling of every robot learning system is set
              by its training data. Claru provides the real-world video,
              demonstration trajectories, and annotation layers that
              robotics teams need to train policies that work outside the
              lab.
            </p>
          </div>
        </section>

        {/* ── Why Robotics Training Data Matters ──────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Why Robotics Training Data Is the Bottleneck
            </h2>

            <div className="prose-custom space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Robotics has entered the era of learned policies. From
                pick-and-place in warehouses to bipedal locomotion on
                uneven terrain, the dominant paradigm has shifted from
                hand-coded controllers to models that learn from data.
                Behavior cloning, reinforcement learning from human
                feedback, and vision-language-action models all share one
                requirement:{" "}
                <strong className="text-white">
                  large volumes of high-quality, task-relevant training
                  data
                </strong>
                .
              </p>

              <p>
                But robotics data is fundamentally harder to collect than
                image or text data. You cannot scrape it from the internet.
                Each demonstration requires a physical setup, a trained
                operator, and careful quality control. A single corrupted
                trajectory can teach a robot to collide with obstacles. A
                poorly calibrated camera can make depth estimation useless.
              </p>

              <p>
                This is why companies building physical AI systems
                consistently cite data as their primary bottleneck. Not
                compute, not algorithms &mdash; data. The models exist. The
                hardware is improving rapidly. What is missing is the
                volume and diversity of real-world training data needed to
                make policies generalize beyond controlled lab
                environments.
              </p>
            </div>
          </div>
        </section>

        {/* ── Types of Data Robots Need ───────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Types of Training Data Robots Need
            </h2>
            <p className="text-white/70 mb-12 text-lg">
              Different robot learning paradigms require different data
              modalities. Here is what modern robotics research actually
              consumes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Egocentric Video",
                  description:
                    "First-person video from wearable cameras that mirrors the viewpoint of a robot's head or wrist camera. Critical for visuomotor policies that map observations to actions. Claru's network of 10,000+ contributors captures egocentric video across kitchens, workshops, warehouses, and outdoor environments in 100+ cities worldwide.",
                  link: "/egocentric-video-datasets",
                  linkText: "Learn more about egocentric datasets",
                },
                {
                  title: "Manipulation Trajectories",
                  description:
                    "Recorded demonstrations of grasping, placing, assembling, and tool use. Each trajectory includes end-effector poses, gripper states, and synchronized visual observations. Used to train imitation learning policies for arms like Franka Emika, UR5, and custom humanoid manipulators.",
                  link: "/solutions/manipulation-trajectory-data",
                  linkText: "See manipulation data solutions",
                },
                {
                  title: "Teleoperation Demonstrations",
                  description:
                    "Human-guided robot control sessions where an operator drives a robot through tasks using VR controllers, exoskeletons, or leader-follower setups. Produces paired observation-action data at the exact embodiment the policy will be deployed on. Claru manages teleoperation campaigns with trained operators following structured task protocols.",
                  link: "/solutions/teleoperation-data",
                  linkText: "See teleoperation data solutions",
                },
                {
                  title: "Navigation and Exploration Data",
                  description:
                    "Video and sensor recordings from mobile platforms traversing indoor and outdoor environments. Includes depth, IMU, and odometry streams aligned with visual observations. Used to train navigation policies, SLAM systems, and terrain traversability models for mobile robots and autonomous vehicles.",
                  link: "/embodied-ai-datasets",
                  linkText: "Explore embodied AI datasets",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {card.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-4">
                    {card.description}
                  </p>
                  <Link
                    href={card.link}
                    className="text-sm font-medium transition-colors"
                    style={{ color: "#92B090" }}
                  >
                    {card.linkText} &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How Claru Collects Robotics Data ────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              How Claru Collects and Annotates Robotics Training Data
            </h2>
            <p className="text-white/70 mb-12 text-lg">
              Claru operates a vertically integrated pipeline from raw
              capture through enrichment to delivery. Every stage is
              designed for the requirements of robot learning research.
            </p>

            <div className="space-y-12">
              {[
                {
                  step: "01",
                  title: "Capture",
                  content:
                    "Three parallel acquisition pipelines run continuously. Wearable camera capture deploys GoPro-equipped contributors across diverse real-world settings — kitchens, workshops, warehouses, retail environments, outdoor spaces. Managed teleoperation coordinates trained operators on client-specific robot hardware following structured task decompositions. Game-based capture uses custom game environments that log synchronized video and control inputs at 60 FPS, producing dense interaction data with perfect action labels.",
                },
                {
                  step: "02",
                  title: "Enrich",
                  content:
                    "Raw video enters a multi-model enrichment pipeline. Monocular depth estimation generates per-frame depth maps. Semantic segmentation labels every pixel with object class and instance identity. Human pose estimation extracts 2D and 3D joint positions for hand-object interaction analysis. Optical flow computes dense motion fields. AI-generated captions provide natural language descriptions of each clip. All enrichment outputs are cross-validated: depth consistency is checked against segmentation boundaries, pose estimates are validated against temporal smoothness constraints.",
                },
                {
                  step: "03",
                  title: "Annotate",
                  content:
                    "Human annotators add task-specific labels that automated systems cannot reliably produce. Action boundary annotation marks the precise temporal start and end of discrete actions (reach, grasp, lift, transport, place). Object affordance labels identify which surfaces are graspable, which are support surfaces, and which are obstacles. Quality scoring flags clips with occlusions, motion blur, or calibration drift. Annotators follow project-specific guidelines developed in collaboration with each client's ML team.",
                },
                {
                  step: "04",
                  title: "Deliver",
                  content:
                    "Datasets are packaged in the format each team's training pipeline expects. WebDataset for streaming training at scale. HDF5 for dense numeric trajectories. RLDS for reinforcement learning workflows. Parquet for metadata queries and filtering. Every delivery includes a datasheet documenting collection methodology, annotator demographics, known limitations, and intended use cases. Data is delivered via S3, GCS, or direct integration with the client's cloud infrastructure.",
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

        {/* ── Synthetic vs Real-World Data ─────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Synthetic vs. Real-World Data for Robotics
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Both synthetic and real-world data have roles in the robotics
              training stack. The question is not which to use, but when
              each is appropriate and how they combine.
            </p>

            {/* Comparison Table */}
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                      Dimension
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                      Synthetic Data
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                      Real-World Data
                    </th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  {[
                    {
                      dim: "Scale",
                      syn: "Effectively unlimited — generate millions of episodes in parallel",
                      real: "Constrained by physical collection — 100s to 10,000s of demonstrations per campaign",
                    },
                    {
                      dim: "Ground Truth Labels",
                      syn: "Perfect by construction — exact object poses, forces, contacts",
                      real: "Requires manual or model-assisted annotation; some quantities (contact forces) are unobservable",
                    },
                    {
                      dim: "Visual Realism",
                      syn: "Improving but still distinguishable — limited texture, lighting, and material diversity",
                      real: "Captures true visual distribution — real lighting, clutter, specular surfaces, transparency",
                    },
                    {
                      dim: "Physics Fidelity",
                      syn: "Approximate — rigid body is good, deformable objects and liquids remain challenging",
                      real: "Ground truth by definition — includes all real-world physics effects",
                    },
                    {
                      dim: "Domain Gap",
                      syn: "Significant — policies trained in sim frequently fail on real hardware without fine-tuning",
                      real: "Zero domain gap — data comes from the deployment distribution",
                    },
                    {
                      dim: "Cost per Episode",
                      syn: "Low marginal cost after environment setup ($0.01–$0.10 per episode)",
                      real: "Higher per-unit cost ($1–$50 per demonstration depending on complexity)",
                    },
                    {
                      dim: "Diversity",
                      syn: "Limited to modeled variations — only what the simulator supports",
                      real: "Natural diversity — every real environment is unique",
                    },
                    {
                      dim: "Best Used For",
                      syn: "Pre-training, policy structure learning, reward shaping",
                      real: "Fine-tuning, deployment validation, bridging the sim-to-real gap",
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
                      <td className="px-4 py-3">{row.syn}</td>
                      <td className="px-4 py-3">{row.real}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 space-y-4 text-white/80 leading-relaxed">
              <p>
                The most effective robotics teams use synthetic data for
                pre-training and structural learning, then fine-tune on
                real-world demonstrations collected from the target
                deployment environment. This &ldquo;sim-then-real&rdquo;
                approach gets the best of both worlds: the scale of
                simulation and the fidelity of the real world.
              </p>
              <p>
                Claru focuses on the real-world side of this equation
                &mdash; the data that cannot be synthesized. Our{" "}
                <Link
                  href="/solutions/sim-to-real-data"
                  style={{ color: "#92B090" }}
                  className="underline underline-offset-2"
                >
                  sim-to-real data collection
                </Link>{" "}
                is specifically designed to bridge the gap between
                simulation and deployment.
              </p>
            </div>
          </div>
        </section>

        {/* ── Claru by the Numbers ────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-10">
              Claru&apos;s Robotics Data at a Glance
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  stat: "3.7M+",
                  label: "Human annotations",
                  context:
                    "across egocentric video, game environments, and custom captures",
                },
                {
                  stat: "500K+",
                  label: "Egocentric clips",
                  context:
                    "from kitchens, workshops, warehouses, outdoor environments",
                },
                {
                  stat: "10,000+",
                  label: "Global contributors",
                  context:
                    "trained data collectors with wearable cameras across 100+ cities",
                },
                {
                  stat: "25+",
                  label: "Licensed datasets",
                  context:
                    "commercially available for robotics, video generation, and embodied AI research",
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

        {/* ── Use Cases ───────────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Who Uses Robotics Training Data
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Claru works with teams building across the spectrum of
              physical AI, from single-arm manipulation to general-purpose
              humanoids.
            </p>

            <div className="space-y-6">
              {[
                {
                  title: "Warehouse and Logistics Robotics",
                  content:
                    "Pick-and-place, bin picking, palletizing, and depalletizing. These systems need diverse object geometry data — thousands of SKU shapes, sizes, and packaging types — plus varied bin configurations and lighting conditions. Claru provides egocentric and overhead video of real warehouse operations annotated with object bounding boxes, grasp points, and action sequences.",
                },
                {
                  title: "Household and Service Robotics",
                  content:
                    "Cooking, cleaning, laundry, table setting, and general domestic tasks. Training household robots requires demonstrations across hundreds of kitchen layouts, appliance types, and object configurations. Claru's egocentric video dataset includes 386,000+ clips from real homes and workspaces, covering the long-tail of household environments that simulation cannot easily model.",
                },
                {
                  title: "Humanoid Robotics",
                  content:
                    "Full-body locomotion, bimanual manipulation, and human-robot interaction. Humanoid programs need whole-body motion data paired with visual observations from the robot's perspective. Claru collects egocentric video with synchronized body pose annotations, providing the observation-action pairs needed to train visuomotor policies for bipedal platforms.",
                },
                {
                  title: "Surgical and Medical Robotics",
                  content:
                    "Precise instrument manipulation, tissue handling, and surgical workflow recognition. Medical robotics teams need demonstration data collected under controlled protocols with domain-expert operators. Claru coordinates specialized collection campaigns with trained professionals following client-defined task decompositions.",
                },
              ].map((useCase) => (
                <div
                  key={useCase.title}
                  className="border-l-2 pl-6"
                  style={{ borderColor: "rgba(146,176,144,0.4)" }}
                >
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {useCase.content}
                  </p>
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
                  href: "/physical-ai-training-data",
                  title: "Physical AI Training Data",
                  desc: "Real-world datasets for models that understand physics.",
                },
                {
                  href: "/solutions/manipulation-trajectory-data",
                  title: "Manipulation Trajectory Data",
                  desc: "Custom trajectory datasets for robot manipulation policies.",
                },
                {
                  href: "/solutions/teleoperation-data",
                  title: "Teleoperation Dataset Collection",
                  desc: "Scaled human demonstration capture for robot learning.",
                },
                {
                  href: "/solutions/sim-to-real-data",
                  title: "Closing the Sim-to-Real Gap",
                  desc: "Real-world data to bridge simulation-to-deployment performance gaps.",
                },
                {
                  href: "/solutions/vla-training-data",
                  title: "VLA Training Data",
                  desc: "Vision-language-action data from collection to policy.",
                },
                {
                  href: "/case-studies/egocentric-video-collection",
                  title: "Case Study: Egocentric Video Collection",
                  desc: "Large-scale first-person video capture for robotics training.",
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
                  <p className="text-white/70 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <section className="w-full py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Ready to Build Your Robotics Training Dataset?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Tell us what your robot needs to learn. We&apos;ll scope the
              dataset, define the collection protocol, and deliver
              training-ready data.
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
