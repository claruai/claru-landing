import type { ComparisonData } from "@/data/compare/types";
import { claruPipelineSteps, claruProofStats } from "@/data/compare/shared";

const sourceLink = (href: string, label: string) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-xs text-[var(--accent-primary)] underline underline-offset-2"
  >
    {label}
  </a>
);

export const lightwheelComparison: ComparisonData = {
  slug: "lightwheel-alternatives",
  competitor: {
    name: "Lightwheel",
    siteUrl: "https://www.lightwheel.ai",
    category: "Sim2real data pipeline and physical AI data factory",
  },
  meta: {
    title: "Lightwheel Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Lightwheel and Claru for physical AI training data. Lightwheel offers a sim2real pipeline and data factory for physical AI models with simulation and real-world data collection. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Lightwheel alternative",
      "Lightwheel alternatives",
      "Lightwheel vs Claru",
      "sim2real pipeline",
      "physical AI data factory",
      "robotics data capture",
      "egocentric data collection",
      "physical AI training data",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-04-02",
    modified: "2026-04-02",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Lightwheel Alternatives",
    title: "Lightwheel Alternatives: Sim2Real Pipeline vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.lightwheel.ai/lightwheel-platform"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Lightwheel
        </a>{" "}
        positions its platform as an end-to-end sim2real pipeline and data
        factory for physical AI models, spanning simulation, collection, and
        data delivery. If you need capture and enrichment for robotics, Claru is
        built for physical AI from day one.
      </>
    ),
    lastUpdated: "April 2, 2026",
    paragraphs: [
      "Lightwheel AI is a physical AI data company that offers a sim2real pipeline and data factory for building robotics foundation models. The company positions its Lightwheel Lab Enterprise platform as an end-to-end solution spanning simulation data generation, real-world data collection, and calibrated sensor delivery. Lightwheel supports simulation environments like NVIDIA Isaac Sim and MuJoCo, and lists data collection modalities including teleoperation in simulation and reinforcement learning in simulation, alongside ego-centric real-world capture using physical robots.",
      "For physical AI teams, Lightwheel is one of the closest competitors to Claru in the market because both companies operate specifically in the robotics training data space. The key difference lies in emphasis: Lightwheel leads with simulation-driven data generation and sim2real transfer, while Claru leads with real-world field capture and multi-layer enrichment. Teams that rely heavily on simulation for initial policy training and need sim2real bridges may find Lightwheel's approach compelling. Teams whose bottleneck is acquiring diverse real-world manipulation, navigation, or activity recordings with dense spatial enrichment will find Claru's capture-first model more directly addresses their needs.",
    ],
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Lightwheel Lab Enterprise is described as an end-to-end sim2real pipeline and data factory for physical AI models.",
      "The platform supports simulation environments like NVIDIA Isaac Sim and MuJoCo for data generation.",
      "Lightwheel lists rich sensory outputs including RGB/depth visuals, proprioceptive feedback, and tactile data.",
      "Physical parameters include positions, velocities, accelerations, forces, and torques for robots and objects.",
      "Data collection modalities include teleoperation in simulation and reinforcement learning in simulation.",
      "Lightwheel highlights ego-centric real-world data collection with physical robots and objects plus a hardware-agnostic capture platform.",
      "Data delivery includes synchronized, calibrated sensor streams and compatibility with formats like RLDS and LeRobot, with optional annotation.",
      "Claru is purpose-built for physical AI capture and enrichment.",
      "Choose Lightwheel for sim2real pipelines; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Lightwheel Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Lightwheel focuses on sim2real data pipelines and a physical AI data factory. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Lightwheel Lab Enterprise is positioned as an end-to-end sim2real
        pipeline and comprehensive data factory for building physical AI
        models.
        {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[1]")}
      </>,
      <>
        The platform lists simulation environments such as NVIDIA Isaac Sim and
        MuJoCo for data generation.
        {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[2]")}
      </>,
      <>
        Lightwheel highlights rich sensory outputs including RGB/depth visuals,
        proprioceptive feedback, and tactile data.
        {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[3]")}
      </>,
      <>
        Physical parameters include positions, velocities, accelerations,
        forces, and torques for robots and objects.
        {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[4]")}
      </>,
      <>
        Data collection modalities include teleoperation in simulation and
        reinforcement learning in simulation.
        {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[5]")}
      </>,
      <>
        Lightwheel describes ego-centric real-world data collection with
        physical robots and objects and a hardware-agnostic capture platform.
        {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[6]")}
      </>,
      <>
        Data delivery includes synchronized, calibrated sensor streams with
        outputs compatible with RLDS and LeRobot, plus optional annotation
        services.
        {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[7]")}
      </>,
      "If your bottleneck is sim2real data generation and simulation workflows, Lightwheel is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Lightwheel at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Sim2real pipeline and physical AI data factory.
                {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[1]")}
              </>
            ),
          },
          {
            label: "Simulation",
            value: (
              <>
                NVIDIA Isaac Sim and MuJoCo environments for data generation.
                {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[2]")}
              </>
            ),
          },
          {
            label: "Signals",
            value: (
              <>
                RGB/depth visuals, proprioceptive feedback, tactile data.
                {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[3]")}
              </>
            ),
          },
          {
            label: "Physical parameters",
            value: (
              <>
                Positions, velocities, accelerations, forces, torques.
                {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[4]")}
              </>
            ),
          },
          {
            label: "Delivery",
            value: (
              <>
                Synchronized, calibrated sensor streams compatible with RLDS
                and LeRobot.
                {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[7]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing sim2real data pipelines",
          },
        ],
      },
      {
        title: "Claru at a Glance",
        items: [
          {
            label: "Focus",
            value: "Physical AI training data for robotics and world models",
          },
          {
            label: "Capture",
            value: "Wearable camera network plus task-specific collection",
          },
          {
            label: "Enrichment",
            value: "Depth, pose, segmentation, optical flow, aligned captions",
          },
          {
            label: "Best fit",
            value: "Teams that need capture + enrichment for embodied AI",
          },
        ],
      },
    ],
  },
  keyClaims: {
    title: "Key Claims (With Sources)",
    claims: [
      <>
        Lightwheel Lab Enterprise is described as an end-to-end sim2real
        pipeline and data factory for physical AI models.
        {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[1]")}
      </>,
      <>
        The platform supports simulation environments like NVIDIA Isaac Sim and
        MuJoCo.
        {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[2]")}
      </>,
      <>
        Lightwheel lists rich sensory outputs including RGB/depth visuals,
        proprioceptive feedback, and tactile data.
        {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[3]")}
      </>,
      <>
        Physical parameters include positions, velocities, accelerations,
        forces, and torques.
        {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[4]")}
      </>,
      <>
        Data collection modalities include teleoperation and reinforcement
        learning in simulation.
        {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[5]")}
      </>,
      <>
        Lightwheel highlights ego-centric real-world data collection and a
        hardware-agnostic capture platform.
        {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[6]")}
      </>,
      <>
        Data delivery includes synchronized, calibrated sensor streams and
        compatibility with RLDS and LeRobot, with optional annotation.
        {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[7]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Lightwheel Is Strong",
    intro:
      "Lightwheel emphasizes sim2real data generation, simulation workflows, and calibrated sensor delivery for physical AI models.",
    cards: [
      {
        title: "Sim2real data factory",
        description: (
          <>
            Lightwheel positions its platform as a sim2real pipeline and data
            factory for physical AI.
            {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[1]")}
          </>
        ),
      },
      {
        title: "Simulation-driven data",
        description: (
          <>
            Supports simulation environments like NVIDIA Isaac Sim and MuJoCo
            with teleoperation and RL data collection.
            {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[2]")}
            {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[5]")}
          </>
        ),
      },
      {
        title: "Sensor-rich delivery",
        description: (
          <>
            Delivers synchronized, calibrated sensor streams compatible with
            RLDS and LeRobot.
            {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[7]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Lightwheel focuses on sim2real data pipelines. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture breadth",
        description:
          "Claru captures across physical tasks and environments beyond simulation-only data.",
      },
      {
        title: "Enrichment layers",
        description:
          "Depth, pose, and motion signals are generated as first-class outputs, not add-ons.",
      },
      {
        title: "Robotics-ready delivery",
        description:
          "Claru ships datasets in formats that plug directly into robotics stacks.",
      },
    ],
  },
  comparison: {
    title: "Lightwheel vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison highlights sim2real data pipelines versus capture-first physical AI datasets.",
    columns: [
      { key: "lightwheel", label: "Lightwheel" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          lightwheel: (
            <>
              Sim2real pipeline and data factory for physical AI.
              {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Simulation",
        values: {
          lightwheel: (
            <>
              NVIDIA Isaac Sim and MuJoCo environments.
              {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[2]")}
            </>
          ),
          claru: "Real-world capture plus task-specific collection",
        },
      },
      {
        dimension: "Signals",
        values: {
          lightwheel: (
            <>
              RGB/depth visuals, proprioceptive feedback, tactile data.
              {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[3]")}
            </>
          ),
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Delivery",
        values: {
          lightwheel: (
            <>
              Synchronized, calibrated sensor streams (RLDS, LeRobot).
              {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[7]")}
            </>
          ),
          claru: "Robotics-ready dataset formats",
        },
      },
      {
        dimension: "Best fit",
        values: {
          lightwheel: "Teams needing sim2real data pipelines",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Lightwheel vs Claru",
    intro:
      "Lightwheel emphasizes simulation-driven data pipelines. Claru emphasizes capture and enrichment for physical AI datasets.",
    blocks: [
      {
        title: "Simulation vs capture",
        paragraphs: [
          "Lightwheel builds sim2real datasets using simulation environments and structured data delivery.",
          "Claru captures new physical-world data and enriches it for robotics training.",
        ],
      },
      {
        title: "Sensor richness",
        paragraphs: [
          "Lightwheel delivers synchronized sensor streams and physical parameter outputs.",
          "Claru delivers enriched real-world datasets with depth, pose, and motion layers.",
        ],
      },
      {
        title: "Sim2real gap and real-world diversity",
        paragraphs: [
          "The sim2real gap remains one of the biggest challenges in robotics AI. Models trained exclusively on simulation data often struggle to generalize to real-world conditions where lighting varies, surfaces have complex textures, objects deform unpredictably, and human interactions introduce noise that simulators cannot fully replicate. Lightwheel addresses this with its ego-centric real-world data collection capability, but its platform architecture still leads with simulation as the primary data generation method.",
          "Claru takes the opposite approach, prioritizing real-world capture as the foundation and treating enrichment as the computational layer that adds spatial signals to organic recordings. This means datasets capture the full diversity of real-world conditions by default, including environmental variability, naturalistic human behavior, and the unpredictable physics of everyday object interactions that simulators often approximate poorly.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Lightwheel is a fit when simulation data and sim2real workflows are the bottleneck. If your team relies on physics-based simulation for initial policy training and needs structured environments, teleoperation data, and calibrated sensor streams with known physical parameters, Lightwheel's platform is purpose-built for that workflow.",
          "Claru is a fit when real-world capture and enrichment are the bottleneck. If your model needs diverse real-world manipulation, navigation, or activity recordings with dense spatial enrichment signals captured across varied environments and conditions, Claru's capture-first approach is the more direct path to training-ready data.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Lightwheel Is a Fit",
    competitorBullets: [
      "You need sim2real data pipelines built around simulation environments.",
      "You want synchronized, calibrated sensor streams for physical AI.",
      "You want optional annotation services on top of simulation data.",
    ],
    claruTitle: "When Claru Is a Fit",
    claruBullets: [
      "You need physical-world data captured for robotics tasks.",
      "You want enrichment layers like depth, pose, and motion signals.",
      "You need datasets delivered in robotics-native formats.",
    ],
  },
  pipeline: {
    title: "How Claru Delivers Physical AI Data",
    intro:
      "Claru provides an end-to-end pipeline so physical AI teams can move from brief to training-ready data quickly.",
    steps: claruPipelineSteps,
  },
  proof: {
    title: "Claru by the Numbers",
    stats: claruProofStats,
  },
  related: {
    title: "Other Alternatives Worth Considering",
    intro:
      "If you are mapping the data provider landscape, these comparisons cover adjacent options.",
    links: [
      {
        title: "Superb AI Alternatives",
        desc: "CV platform tooling vs physical AI capture.",
        href: "/compare/superb-ai-alternatives",
      },
      {
        title: "Scale AI Alternatives",
        desc: "Enterprise annotation vs physical AI pipelines.",
        href: "/compare/scale-ai-alternatives",
      },
      {
        title: "Appen Alternatives",
        desc: "Global data services vs capture-first robotics datasets.",
        href: "/compare/appen-alternatives",
      },
      {
        title: "Claru vs Luel",
        desc: "Marketplace data vs training-ready physical AI datasets.",
        href: "/compare/claru-vs-luel",
      },
    ],
  },
  decision: {
    title: "How to Choose",
    paragraphs: [
      "Choose Lightwheel when you need sim2real data pipelines and simulation-driven dataset generation.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Lightwheel for simulation data and Claru for real-world capture.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Lightwheel Lab Enterprise?",
        answer: (
          <>
            Lightwheel Lab Enterprise is described as an end-to-end sim2real pipeline and comprehensive data factory for building physical AI models. The platform spans the full data lifecycle from simulation-based data generation through real-world collection to calibrated delivery. Lightwheel positions itself as one of the few companies specifically focused on the robotics training data market, combining simulation environments with real-world capture capabilities and structured sensor output.
            {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[1]")}
          </>
        ),
      },
      {
        question: "What simulation environments does Lightwheel list?",
        answer: (
          <>
            Lightwheel lists NVIDIA Isaac Sim and MuJoCo as supported simulation environments for data generation. These are the two most widely used physics simulators in the robotics research community. Isaac Sim provides photorealistic rendering and GPU-accelerated physics, while MuJoCo excels at fast, accurate contact dynamics. Supporting both allows Lightwheel to serve teams across different simulation preferences and research traditions.
            {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[2]")}
          </>
        ),
      },
      {
        question: "What data does Lightwheel deliver?",
        answer: (
          <>
            Lightwheel delivers synchronized, calibrated sensor streams with rich sensory outputs including RGB and depth visuals, proprioceptive feedback, and tactile data. Physical parameters such as positions, velocities, accelerations, forces, and torques are included for robots and objects. Data is compatible with RLDS and LeRobot formats, and optional annotation services are available on top of the raw sensor data.
            {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[3]")}
            {sourceLink("https://www.lightwheel.ai/lightwheel-platform", "[7]")}
          </>
        ),
      },
      {
        question: "How does Lightwheel compare to Claru for real-world data?",
        answer:
          "Lightwheel's platform architecture leads with simulation and includes ego-centric real-world collection as a complementary capability. Claru leads with real-world field capture as the primary data generation method. If your core need is diverse real-world recordings across varied environments and conditions, with dense spatial enrichment layers generated automatically, Claru's capture-first approach is more direct. If you need structured simulation data with sim2real bridges and calibrated physics parameters, Lightwheel is designed for that workflow.",
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need capture, enrichment, and delivery of robotics-ready datasets from real-world environments. If your model needs diverse manipulation, navigation, or activity recordings that capture the full variability of real-world conditions, including naturalistic human behavior and unpredictable object interactions, Claru's field capture network and automated enrichment pipeline address those needs. Lightwheel is better suited when simulation-driven data generation is the primary workflow.",
      },
    ],
  },
  cta: {
    title: "Need Physical AI Data That Ships Fast?",
    description:
      "Tell us what you are training. We will scope a capture plan and deliver a pilot dataset in days.",
    primary: { label: "Book a call", href: "/contact" },
    secondary: { label: "Explore data catalog", href: "/data-catalog" },
  },
  sources: [
    { label: "Lightwheel Platform", url: "https://www.lightwheel.ai/lightwheel-platform" },
  ],
};
