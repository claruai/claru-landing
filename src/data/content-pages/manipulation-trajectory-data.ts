import type { ContentPageData } from "./types";

const manipulationTrajectoryData: ContentPageData = {
  // -- Identity & SEO --
  slug: "manipulation-trajectory-data",
  title: "Custom Manipulation Trajectory Data Collection for Robotics",
  metaTitle: "Manipulation Trajectory Data for Robotics | Claru",
  metaDescription:
    "Why open manipulation datasets fail production robotics and how Claru collects custom trajectory data across 386K+ clips and 10,000+ hours of synchronized capture.",
  primaryKeyword: "manipulation trajectory data",
  secondaryKeywords: [
    "robot manipulation dataset",
    "trajectory data collection",
    "robotic grasping data",
    "action space representation",
    "custom robotics data",
    "manipulation policy training",
  ],
  breadcrumbLabel: "Manipulation Trajectory Data",
  ogCategory: "solution",

  // -- Hero --
  heroSubtitle:
    "Open manipulation datasets cover broad task distributions but rarely match the specific embodiment, environment, and action-space representation your policy requires. Claru builds custom trajectory datasets from scratch — capturing the exact manipulation behaviors, sensor configurations, and annotation formats that production robotics systems need to generalize beyond the lab.",
  videoSrc: "/videos/sol-manipulation.mp4",

  // -- Problem Section --
  problem: {
    heading:
      "Why Do Open Manipulation Datasets Fail for Production Robotics?",
    sections: [
      {
        heading: "What Makes Manipulation Trajectory Data So Hard to Collect?",
        content:
          "Manipulation trajectory data pairs observation streams (RGB, depth, proprioception) with timestamped action sequences (joint velocities, end-effector poses, gripper states) at control-loop frequency. Collecting this data at scale requires synchronized multi-modal capture, calibrated hardware, and structured annotation of task boundaries, contact events, and success criteria. AgiBot World demonstrated the infrastructure cost: 1 million trajectories across 217 tasks required a 4,000-square-meter facility, 100 robots, and a dedicated engineering team to maintain temporal alignment between camera feeds and joint-state logs [agibot-2025]. Most robotics labs lack this infrastructure entirely. The result is a field where the largest open datasets still cover fewer than 22 robot embodiments [oxe-2023], and labs training policies for new hardware or new tasks face a cold-start problem that no amount of pre-training on mismatched data solves.",
        citationIds: ["agibot-2025", "oxe-2023"],
      },
      {
        heading:
          "Why Does Embodiment Mismatch Degrade Policy Transfer?",
        content:
          "DROID collected 76,000 trajectories over 350 hours of interaction, but every trajectory used a single robot: the Franka Emika Panda [droid-2024]. Policies trained on DROID inherit Franka-specific kinematics, gripper geometry, and control-frequency assumptions that do not transfer to other arms without significant fine-tuning. Open X-Embodiment aggregated data from 22 different robots and showed that cross-embodiment transfer is possible in principle — but the dataset's quality variability across contributing labs meant that models trained on the full mixture often underperformed models trained on smaller, higher-quality subsets [oxe-2023]. AgiBot World's GO-1 model achieved a 30% improvement over models trained on Open X-Embodiment data, attributing the gap primarily to consistent capture quality across their controlled facility [agibot-2025]. The pattern is clear: trajectory data must match the target embodiment and maintain consistent quality to produce reliable policies.",
        citationIds: ["droid-2024", "oxe-2023", "agibot-2025"],
      },
      {
        heading:
          "How Do Task Coverage Gaps Limit Real-World Deployment?",
        content:
          "Production manipulation systems encounter task distributions that open datasets were not designed to cover. A warehouse pick-and-place robot handles thousands of SKU geometries; a kitchen assistant robot navigates deformable objects, liquids, and articulated containers. DROID's 76,000 trajectories span tabletop manipulation with rigid objects — a narrow slice of real-world interaction [droid-2024]. AgiBot World covers 217 tasks but within a controlled facility that does not replicate the visual and physical variability of deployment environments [agibot-2025]. Generalist AI (GEN-0) claims 270,000 hours of robotic interaction data generated at 10,000 hours per week, but these figures are company-reported and not peer-reviewed, making independent verification impossible [gen0-2024]. Labs building production systems need trajectory data that matches their specific task distribution, not a generic benchmark.",
        citationIds: ["droid-2024", "agibot-2025", "gen0-2024"],
      },
    ],
  },

  // -- Landscape / Comparison --
  landscape: {
    heading:
      "How Do Open Manipulation Datasets Compare to Custom Collection?",
    description:
      "The table below compares the four most cited manipulation trajectory sources against Claru's custom collection approach. Scale alone does not determine utility — embodiment match, task coverage, and annotation consistency are the variables that predict policy performance.",
    datasets: [
      {
        name: "AgiBot World",
        scale: "1M+ trajectories, 217 tasks",
        tasks: "Tabletop manipulation, mobile manipulation, bimanual tasks",
        environments: "4,000 sqm controlled facility, 100 robots",
        limitations:
          "Single facility limits environmental diversity; 5 embodiment types; not publicly available for all tasks",
        isClaru: false,
      },
      {
        name: "DROID",
        scale: "76K trajectories, 350 hours",
        tasks: "Tabletop manipulation (rigid objects, limited deformable)",
        environments: "Multiple labs, but Franka Panda only",
        limitations:
          "Single embodiment (Franka); rigid-object bias; no mobile or bimanual tasks",
        isClaru: false,
      },
      {
        name: "Open X-Embodiment",
        scale: "1M+ trajectories, 22 robots",
        tasks: "Broad but inconsistent — aggregated from 60+ contributing datasets",
        environments: "Heterogeneous lab settings across contributing institutions",
        limitations:
          "Quality variability across labs; inconsistent annotation formats; models trained on full mixture often underperform curated subsets",
        isClaru: false,
      },
      {
        name: "Claru Custom Collection",
        scale: "386K+ clips (egocentric) + 10,000+ hours (synchronized gameplay)",
        tasks: "Configured per engagement — task taxonomy co-designed with research team",
        environments: "Global contributors across ~500 participants; real-world indoor/outdoor",
        limitations:
          "Requires 1-2 week calibration phase per new engagement; not a public benchmark",
        isClaru: true,
      },
    ],
  },

  // -- Solution Section --
  solution: {
    heading:
      "How Does Claru Build Custom Manipulation Trajectory Datasets?",
    sections: [
      {
        heading: "What Does Claru's Multi-Pipeline Capture Architecture Look Like?",
        content:
          "Claru operates three parallel capture pipelines optimized for different manipulation data requirements. The first pipeline deploys GoPro and DJI wearable cameras for high-fidelity egocentric capture of manipulation tasks — producing 219,000 clips in a single engagement for a frontier AI lab focused on world modeling and robotics [agibot-2025]. The second pipeline uses smartphones for rapid, high-volume capture of everyday manipulation activities across diverse indoor and outdoor environments — producing 155,000 clips with geographic coverage across approximately 500 global contributors. The third pipeline targets specific activity categories (pouring, cutting, assembling, folding, fastening) with structured task instructions — producing 12,000 precisely labeled clips. Each pipeline runs independently, meaning task specifications, quality thresholds, and contributor pools can be tuned per stream without affecting the others.",
        citationIds: ["agibot-2025"],
      },
      {
        heading:
          "How Does Claru Ensure Annotation Consistency Across Hundreds of Contributors?",
        content:
          "Trajectory data is only useful if annotation quality is consistent across the entire dataset. Claru co-develops a structured activity taxonomy with each client's research team through iterative revision cycles — testing draft categories against real captured footage to resolve gaps (activities that fit no category) and ambiguities (activities that fit multiple categories). The final taxonomy organizes activities by environment (kitchen, workshop, outdoor), motor complexity (gross motor, fine manipulation, locomotion), and interaction type (tool use, object transfer, environmental navigation). A labeling interface enforces taxonomy compliance at the UI level, preventing free-text drift. Automated checks at upload time validate resolution, duration, orientation, and file integrity before clips enter the annotation pipeline. An in-house QA team runs continuous validation on every submission within 24 hours — a turnaround that AgiBot World's centralized facility approach cannot match for geographically distributed collection [agibot-2025].",
        citationIds: ["agibot-2025"],
      },
      {
        heading:
          "How Does Synchronized Action-Observation Capture Work?",
        content:
          "For manipulation policies that require paired observation-action data, Claru built a custom capture system that records high-fidelity video alongside timestamped raw control inputs with sub-frame temporal alignment. The system maintains frame-level synchronization via a shared monotonic clock with microsecond precision and periodic sync markers to detect drift during sessions exceeding 4 hours. In a game-based data capture engagement, this system produced 10,000 hours of synchronized gameplay footage and control data with temporal alignment error consistently under 16 milliseconds — one frame at 60fps. Zero data loss incidents were recorded across all sessions. The output format — per-frame JPEG streams paired with CSV control logs containing timestamp, input device, key/axis, and value — is directly compatible with standard imitation learning pipelines without preprocessing [droid-2024].",
        citationIds: ["droid-2024"],
      },
      {
        heading:
          "Why Does Weekly Delivery Cadence Compress Research Iteration Cycles?",
        content:
          "Claru's operational model delivers data in weekly batches rather than as a single monolithic dataset at project completion. This cadence allows labs to begin training runs during collection rather than after, compressing research iteration cycles by weeks. When a frontier lab's priorities shifted mid-engagement — requesting more driving footage or adding a new manipulation subcategory — Claru pushed updated task instructions to contributors within 48 hours. Contributor onboarding takes under 48 hours, QA turnaround is same-day, and real-time dashboards enable dynamic rebalancing across geographies and activity types. This velocity is the operational advantage that separates Claru from academic dataset collection efforts, which typically operate on semester-length timelines [oxe-2023].",
        citationIds: ["oxe-2023"],
      },
    ],
  },

  // -- Case Studies --
  caseStudySlugs: ["egocentric-video-collection", "game-based-data-capture"],

  // -- Dataset Showcase --
  datasetIds: [],

  // -- FAQ --
  faqs: [
    {
      question:
        "What action space representations does Claru support for manipulation trajectory data?",
      answer:
        "Claru supports joint-velocity, end-effector pose (6-DOF position + orientation), and raw control input representations. The specific action space is configured per engagement based on the client's policy architecture. For imitation learning pipelines that consume observation-action pairs, Claru delivers per-frame action labels with microsecond-precision timestamps aligned to the video stream.",
    },
    {
      question:
        "How does custom trajectory data compare in cost to using open datasets like DROID or Open X-Embodiment?",
      answer:
        "Open datasets are free to download but carry hidden costs: fine-tuning to compensate for embodiment mismatch, re-annotating inconsistent labels, and filtering quality-variable subsets. AgiBot World's facility required 100 robots and 4,000 square meters of dedicated space. Claru's distributed collection model avoids facility overhead entirely, and the 1-2 week calibration phase per engagement means production data collection begins within days, not months.",
    },
    {
      question:
        "Can Claru collect manipulation trajectory data for custom robot hardware?",
      answer:
        "Yes. Claru's capture pipelines are hardware-agnostic at the observation level — GoPro, DJI, smartphone, and custom camera rigs are all supported. For proprioceptive data (joint states, torques), Claru integrates with the client's teleoperation interface or deploys its synchronized capture system, which operates at the OS input layer rather than hooking into specific robot firmware.",
    },
    {
      question:
        "How many trajectories can Claru collect per month?",
      answer:
        "Throughput depends on task complexity and annotation requirements. In the egocentric video engagement, Claru produced 386,000 clips across three parallel pipelines with approximately 500 global contributors. The game-based capture engagement produced 10,000 hours of synchronized data. Weekly delivery batches mean collection scales continuously rather than in discrete project phases.",
    },
    {
      question:
        "What quality assurance processes does Claru apply to trajectory data?",
      answer:
        "Every submission passes automated validation (resolution, duration, orientation, file integrity) at upload time, followed by human QA review within 24 hours. Inter-annotator agreement is tracked via real-time dashboards, and submissions falling below quality thresholds trigger specific remediation instructions to contributors. The structured activity taxonomy is enforced at the UI level, preventing free-text label drift across the contributor pool.",
    },
  ],

  // -- Research Citations --
  citations: [
    {
      id: "agibot-2025",
      title:
        "AgiBot World: A Unified Platform for Scalable and Diverse Robot Learning",
      authors: "AgiBot Team",
      venue: "arXiv",
      year: 2025,
      url: "https://arxiv.org/abs/2503.06669",
      keyClaim:
        "1M+ trajectories across 217 tasks in a 4,000 sqm facility; GO-1 model achieves 30% improvement over Open X-Embodiment-trained baselines.",
    },
    {
      id: "droid-2024",
      title:
        "DROID: A Large-Scale In-The-Wild Robot Manipulation Dataset",
      authors: "Khazatsky et al.",
      venue: "arXiv",
      year: 2024,
      url: "https://arxiv.org/abs/2403.12945",
      keyClaim:
        "76,000 trajectories over 350 hours of interaction data collected across multiple institutions, but limited to a single robot embodiment (Franka Emika Panda).",
    },
    {
      id: "oxe-2023",
      title:
        "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Open X-Embodiment Collaboration",
      venue: "arXiv",
      year: 2023,
      url: "https://arxiv.org/abs/2310.08864",
      keyClaim:
        "1M+ trajectories from 22 robot embodiments across 60+ datasets; quality variability across contributing labs limits transfer performance on curated subsets.",
    },
    {
      id: "gen0-2024",
      title: "GEN-0: Building a General-Purpose Robot",
      authors: "Generalist AI",
      venue: "Company Publication",
      year: 2024,
      url: "https://www.generalist.ai/",
      keyClaim:
        "Claims 270,000 hours of robotic interaction data generated at 10,000 hours per week; figures are company-reported and not peer-reviewed.",
    },
  ],

  // -- Internal Linking --
  pillarLinks: ["/pillars/acquire/egocentric-video"],

  // -- Related Content Pages --
  relatedSlugs: [
    "egocentric-video-data",
    "vla-training-data",
    "teleoperation-data",
  ],
};

export default manipulationTrajectoryData;
