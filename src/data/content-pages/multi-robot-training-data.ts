import type { ContentPageData } from "./types";

const multiRobotTrainingData: ContentPageData = {
  // -- Identity & SEO --
  slug: "multi-robot-training-data",
  title: "Multi-Robot Training Data: Coordination and Fleet Learning Datasets",
  metaTitle: "Multi-Robot Training Data for Fleet AI | Claru",
  metaDescription:
    "Training data for multi-robot coordination, fleet learning, and collaborative manipulation. Real-world multi-agent demonstrations for warehouse and logistics.",
  primaryKeyword: "multi-robot training data",
  secondaryKeywords: [
    "multi-agent robot dataset",
    "fleet learning data",
    "robot coordination training",
    "collaborative manipulation data",
    "multi-robot systems dataset",
    "swarm robotics training data",
  ],
  breadcrumbLabel: "Multi-Robot Training Data",
  ogCategory: "solution",

  // -- Hero --
  heroSubtitle:
    "Multi-robot systems are the deployment reality for warehouse automation, agricultural fleets, and construction sites, yet virtually all robot learning datasets capture single-agent interactions. Training a fleet of robots to coordinate tasks, avoid collisions, and share learned skills requires data architectures that no public dataset provides.",

  // -- Problem Section --
  problem: {
    heading: "Why Is Multi-Robot Training Data Fundamentally Different?",
    sections: [
      {
        heading: "Why Is Multi-Robot Training Data Fundamentally Different?",
        content:
          "Single-robot learning assumes an agent operating in isolation: one robot, one workspace, one task at a time. Multi-robot deployments break this assumption entirely. Robots must reason about the positions, intentions, and capabilities of teammates while executing their own tasks. Multi-Agent Reinforcement Learning research has shown that naive application of single-agent policies to multi-robot teams produces coordination failures: robots interfere with each other, duplicate effort, and create deadlocks. The MAPPO algorithm demonstrated that centralized training with decentralized execution significantly outperforms independent learning in cooperative multi-agent tasks, but MAPPO and similar approaches were evaluated primarily in simulation environments with simplified dynamics. Real-world multi-robot coordination requires training data that captures the spatial, temporal, and communication patterns of actual multi-agent operations.",
        citationIds: ["mappo-2022"],
      },
      {
        heading: "What Data Gaps Exist for Multi-Robot Coordination?",
        content:
          "Open X-Embodiment aggregated over 1 million trajectories from 22 robot platforms, but every trajectory captures a single robot operating in isolation. DROID provides 76,000 manipulation demonstrations from individual Franka robots without any multi-agent coordination data. The ManiSkill2 benchmark includes some collaborative tasks in simulation, but the multi-agent scenarios use simplified object dynamics and grid-world-like communication channels rather than realistic sensorimotor coordination. For teams deploying robot fleets in warehouses, farms, or construction sites, the absence of real-world multi-robot demonstration data means that coordination policies must be trained entirely in simulation and transferred zero-shot to production environments, a process with well-documented failure modes.",
        citationIds: ["open-x-embodiment-2024", "droid-2024"],
      },
      {
        heading: "How Do Fleet Operations Create Unique Data Requirements?",
        content:
          "Fleet operations introduce data requirements that single-robot datasets cannot address. Task allocation requires demonstrations of how work is distributed across agents based on proximity, capability, and current load. Collision avoidance in shared workspaces requires multi-viewpoint observation data showing how agents negotiate space. Collaborative manipulation — two or more robots carrying a large object together — requires synchronized action data with inter-robot communication channels. Heterogeneous fleets where different robot types work together add cross-embodiment coordination challenges. RoCo demonstrated that LLM-based multi-robot collaboration can improve task completion in simulated warehouse and household scenarios, but the approach was limited to high-level task decomposition without the low-level coordination data needed for physical interaction between robots.",
        citationIds: ["roco-2024"],
      },
    ],
  },

  // -- Landscape / Comparison --
  landscape: {
    heading: "How Do Existing Datasets Support Multi-Robot Training?",
    description:
      "The table below compares available data sources for multi-robot learning against Claru custom collection. The key finding is that no major open dataset provides real-world multi-agent coordination demonstrations.",
    datasets: [
      {
        name: "Open X-Embodiment",
        scale: "1M+ trajectories, 22 robot platforms",
        tasks: "Single-robot manipulation tasks only",
        environments: "Research labs; individual robot workstations",
        limitations:
          "Zero multi-agent data; every trajectory is single-robot; no coordination or collision avoidance demonstrations",
        isClaru: false,
      },
      {
        name: "ManiSkill2 (Sim)",
        scale: "20+ task families, 2,000+ object instances",
        tasks: "Single and limited multi-agent manipulation in simulation",
        environments: "Simulated tabletop and indoor scenes",
        limitations:
          "Simplified multi-agent tasks; simulation only; no real-world multi-robot dynamics",
        isClaru: false,
      },
      {
        name: "RoCo (Sim)",
        scale: "Benchmark tasks across warehouse and household scenarios",
        tasks: "LLM-based multi-robot task decomposition and coordination",
        environments: "Simulated indoor environments with multiple agents",
        limitations:
          "High-level coordination only; no low-level multi-robot manipulation data; simulation only",
        isClaru: false,
      },
      {
        name: "DROID",
        scale: "76K trajectories, 564 scenes",
        tasks: "Single Franka robot manipulation",
        environments: "13 institutions; lab environments",
        limitations:
          "Single robot only; no multi-agent scenarios; fixed-base manipulation",
        isClaru: false,
      },
      {
        name: "Claru Custom",
        scale: "386K+ video clips, ~500 contributors, configurable multi-viewpoint capture",
        tasks: "Configurable: multi-person collaborative tasks, synchronized multi-viewpoint demonstrations, fleet operation workflows",
        environments: "Real warehouses, workplaces, outdoor sites; multi-agent operational environments",
        limitations:
          "Requires engagement lead time (days to launch, 1-2 week calibration); not a public benchmark",
        isClaru: true,
      },
    ],
  },

  // -- Solution Section --
  solution: {
    heading: "How Does Claru Build Multi-Robot Training Datasets?",
    sections: [
      {
        heading: "How Does Multi-Person Demonstration Data Transfer to Multi-Robot Coordination?",
        content:
          "Humans naturally coordinate on shared tasks: two people carrying a couch through a doorway, a team sorting packages on a warehouse floor, or multiple cooks operating in a shared kitchen. These demonstrations capture the spatial negotiation, implicit communication, and task allocation patterns that multi-robot policies must reproduce. Claru's egocentric video pipeline captures first-person footage from multiple simultaneous contributors, providing multi-viewpoint observations of collaborative activities. The workplace egocentric program has already captured coordinated work across 10 workplace categories where multiple workers operate in shared spaces. When contributors wear cameras simultaneously during collaborative tasks, the resulting data provides the multi-agent observation pairs and coordination patterns that MAPPO-style centralized training requires, grounded in real-world physics rather than simplified simulation.",
        citationIds: ["mappo-2022"],
      },
      {
        heading: "How Does Synchronized Multi-Viewpoint Capture Enable Fleet Training?",
        content:
          "Fleet coordination requires understanding how multiple agents perceive and act on a shared environment simultaneously. Claru's synchronized capture pipeline, proven with sub-16ms temporal alignment in the game-based data capture project, extends to multi-viewpoint scenarios where multiple cameras capture the same workspace from different perspectives. This produces the multi-agent observation data that fleet learning algorithms consume: synchronized first-person views from multiple agents in a shared space, with temporal alignment precise enough to train reactive coordination policies. The same infrastructure that achieved zero data loss across 10,000+ hours of synchronized game capture can deliver the multi-stream temporal precision that multi-robot task allocation and collision avoidance require.",
        citationIds: ["roco-2024"],
      },
      {
        heading: "How Does Claru Address Heterogeneous Fleet Data Needs?",
        content:
          "Production robot fleets often combine different robot types: mobile bases for transport, arms for manipulation, and specialized platforms for inspection. Training coordination policies for heterogeneous fleets requires data showing how different embodiments collaborate on shared objectives. Open X-Embodiment spans 22 robot platforms but has no multi-agent coordination data across them. Claru's collection programs can capture collaborative demonstrations across different task roles and viewpoints, with the structured activity taxonomy annotating role assignments, handoff points, and inter-agent dependencies. The global contributor network of approximately 500 people can be organized into multi-person teams that mirror the composition of target robot fleets, producing demonstration data with the correct ratio of different agent roles and the coordination patterns specific to the deployment scenario.",
        citationIds: ["open-x-embodiment-2024"],
      },
    ],
  },

  // -- Case Studies --
  caseStudySlugs: [],

  // -- Dataset Showcase --
  datasetIds: [],

  // -- FAQ --
  faqs: [
    {
      question: "What types of multi-robot coordination data does Claru provide?",
      answer:
        "Claru provides multi-agent demonstration data capturing collaborative task execution, spatial negotiation, task allocation, and handoff coordination. Data is collected from multi-person teams performing collaborative tasks with synchronized multi-viewpoint cameras. Annotations include agent role labels, inter-agent spatial relationships, task allocation decisions, and temporal coordination patterns.",
    },
    {
      question: "How does Claru capture synchronized data from multiple viewpoints?",
      answer:
        "Claru's synchronized capture pipeline delivers multi-stream video with sub-16ms temporal alignment. Multiple contributors wear cameras simultaneously during collaborative tasks, producing synchronized first-person views of shared workspace operations. This infrastructure was proven at scale with 10,000+ hours of synchronized data capture with zero data loss.",
    },
    {
      question: "Can human team demonstrations train robot fleet coordination policies?",
      answer:
        "Yes. Human teams naturally exhibit the coordination patterns that robot fleets must learn: spatial negotiation in shared workspaces, implicit communication through observation, dynamic task reallocation, and collaborative manipulation. Research in multi-agent learning shows that centralized training on multi-agent demonstrations significantly outperforms independent single-agent learning for cooperative tasks.",
    },
    {
      question: "Does Claru support data for heterogeneous robot fleets?",
      answer:
        "Yes. Collection programs can be designed with multi-person teams where different contributors perform different roles mirroring the composition of the target robot fleet. The structured activity taxonomy annotates role assignments, capability differences, and handoff protocols. Output formats are configured to match the observation and action spaces of each robot type in the fleet.",
    },
  ],

  // -- Research Citations --
  citations: [
    {
      id: "mappo-2022",
      title:
        "The Surprising Effectiveness of PPO in Cooperative Multi-Agent Games",
      authors: "Yu et al.",
      venue: "NeurIPS 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2103.01955",
      keyClaim:
        "MAPPO demonstrated that centralized training with decentralized execution significantly outperforms independent learning in cooperative multi-agent tasks.",
    },
    {
      id: "roco-2024",
      title:
        "RoCo: Dialectic Multi-Robot Collaboration with Large Language Models",
      authors: "Mandi et al.",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2307.04738",
      keyClaim:
        "LLM-based multi-robot collaboration improves task completion in warehouse and household scenarios through dialectic communication between robot agents.",
    },
    {
      id: "open-x-embodiment-2024",
      title:
        "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "O'Brien et al.",
      venue: "arXiv 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864",
      keyClaim:
        "1M+ trajectories spanning 22 robot platforms but containing zero multi-agent coordination data.",
    },
    {
      id: "droid-2024",
      title:
        "DROID: A Large-Scale In-the-Wild Robot Manipulation Dataset",
      authors: "Khazatsky et al.",
      venue: "arXiv 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2403.12945",
      keyClaim:
        "76,000 single-robot manipulation trajectories; no multi-agent coordination demonstrations.",
    },
  ],

  // -- Internal Linking --
  pillarLinks: [
    "/training-data/robotics",
    "/models/multi-agent",
  ],

  // -- Related Content Pages --
  relatedSlugs: [
    "warehouse-robotics-data",
    "humanoid-robot-training-data",
    "safety-critical-robot-data",
  ],
};

export default multiRobotTrainingData;
