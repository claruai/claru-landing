// ---------------------------------------------------------------------------
// Content Page: Teleoperation Data
// ---------------------------------------------------------------------------
// Tier 2 cluster page targeting "teleoperation data" keyword.
// Links up to /pillars/acquire/egocentric-video pillar page.
// ---------------------------------------------------------------------------

import type { ContentPageData } from "./types";

const teleoperationData: ContentPageData = {
  // -- Identity & SEO --
  slug: "teleoperation-data",
  title: "Teleoperation Dataset Collection for Robot Learning",
  metaTitle: "Teleoperation Data Collection for Robotics | Claru",
  metaDescription:
    "Scale teleoperation data collection beyond lab constraints. Claru delivers diverse operator demonstrations across real environments — 386K+ clips captured with managed global contributors.",
  primaryKeyword: "teleoperation data",
  secondaryKeywords: [
    "teleoperation dataset",
    "robot teleoperation demonstrations",
    "remote robot operation data",
    "teleoperation for robot learning",
    "demonstration data collection",
    "robot imitation learning data",
  ],
  breadcrumbLabel: "Teleoperation Data",
  ogCategory: "solution",

  // -- Hero --
  heroSubtitle:
    "Teleoperation generates the highest-quality demonstration data for robot learning — a human operator directly controlling the robot produces state-action pairs that imitation learning algorithms consume without inference. But current teleoperation pipelines produce fewer than 200 demonstrations per day and require $50K-150K hardware rigs per station. Claru scales demonstration collection by deploying managed contributor networks across real-world environments, capturing the behavioral diversity that single-lab teleoperation cannot provide.",

  // -- Problem Section --
  problem: {
    heading:
      "Why Is Teleoperation Data Collection Still a Bottleneck for Robot Learning?",
    sections: [
      {
        heading: "The Scale Problem: Labs Produce Fewer Than 200 Demos per Day",
        content:
          "Teleoperation is the gold standard for robot demonstration data because it captures the exact state-action mapping that imitation learning requires — no inverse dynamics inference, no reward engineering, no sim-to-real transfer. Yet even the most advanced teleoperation systems generate less than 0.1% of the state-action space a general-purpose policy needs. A typical lab setup produces 50-200 demonstrations per day depending on task complexity and reset time [1]. The DROID dataset — one of the largest teleoperation efforts to date — collected 76,000 episodes across 564 scenes, but this required coordinated effort across 13 institutions over 18 months [4]. Scaling teleoperation within a single lab hits hard constraints: operator fatigue limits sessions to 2-4 hours, hardware maintenance creates downtime, and a single location provides no environmental diversity.",
        citationIds: ["humanplus-2024", "droid-2024"],
      },
      {
        heading: "The Hardware Barrier: $50K-150K per Teleoperation Station",
        content:
          "Traditional teleoperation requires specialized hardware that creates a steep cost curve. Exoskeleton-based systems (Gello, ALOHA) cost $50K-150K per station including the leader arm, follower robot, and instrumentation. VR-based approaches have dropped costs — Open-TeleVision demonstrated a full VR teleoperation station for under $1,000 with 1-10mm control accuracy [3] — but still require the follower robot hardware at each collection site. The ACE system reduced the vision component to a single hand-facing camera for 3D hand pose estimation, enabling cross-platform teleoperation without per-robot calibration [2]. HumanPlus went further, using a single $50 RGB camera to track full-body human poses and retarget them to a humanoid robot, achieving 60-100% success rates across tasks after just 40 hours of training data [1]. Despite these advances, every approach still requires a physical robot at the collection site — and the robot is the bottleneck, not the interface.",
        citationIds: [
          "humanplus-2024",
          "ace-2024",
          "open-television-2024",
        ],
      },
      {
        heading: "The Diversity Problem: Lab Environments Do Not Represent Deployment",
        content:
          "Even with cheaper interfaces and faster collection rates, lab-based teleoperation produces data from a narrow environmental distribution. A teleoperation dataset collected in 3 university kitchens does not capture the lighting variation, clutter density, counter heights, or tool configurations of the thousands of real kitchens where a home robot would operate. The same policy that achieves 85% success in the training kitchen may drop to 40% in a novel kitchen with different cabinet layouts and unfamiliar utensils. This distribution gap is distinct from the sim-to-real gap — it exists entirely within the real world, between the data collection environment and the deployment environment. Addressing it requires collecting demonstrations across hundreds of distinct physical locations, which is operationally infeasible for any single lab.",
        citationIds: ["droid-2024", "open-x-embodiment-2024"],
      },
    ],
  },

  // -- Landscape / Comparison --
  landscape: {
    heading:
      "How Do Teleoperation Data Collection Approaches Compare?",
    description:
      "Four distinct approaches to teleoperation data collection have emerged, each making different trade-offs between data quality, collection speed, hardware cost, and environmental diversity. The choice depends on whether the downstream task prioritizes precise force-torque trajectories or broad behavioral coverage across environments.",
    datasets: [
      {
        name: "VR-Based Teleoperation (Open-TeleVision)",
        scale: "50-200 demos/day per station",
        tasks: "Bimanual manipulation, object handoff",
        environments: "Single lab per VR station",
        limitations:
          "Under $1K/station but requires follower robot at each site; 1-10mm accuracy; limited to robot's workspace",
        isClaru: false,
      },
      {
        name: "Exoskeleton Systems (ALOHA, Gello)",
        scale: "50-150 demos/day per station",
        tasks: "Dexterous manipulation, insertion",
        environments: "Single lab per hardware rig",
        limitations:
          "$50K-150K per station; operator fatigue limits sessions to 2-4 hours; no environment diversity",
        isClaru: false,
      },
      {
        name: "Camera-Based Shadowing (HumanPlus, ACE)",
        scale: "100-300 demos/day per operator",
        tasks: "Full-body humanoid control, hand manipulation",
        environments: "Any environment with camera setup",
        limitations:
          "Single $50 camera (HumanPlus) but still needs robot for deployment; 40 hours training data minimum; cross-embodiment transfer unproven at scale",
        isClaru: false,
      },
      {
        name: "Claru Managed Collection Network",
        scale: "386K+ clips across prior engagements; ~500 global contributors",
        tasks: "Manipulation, locomotion, tool use, workplace tasks across 10+ categories",
        environments:
          "Real kitchens, workshops, barista stations, carpentry shops, retail — multi-country coverage",
        limitations:
          "Captures human demonstrations (not robot state-action pairs); requires post-processing for robot policy training",
        isClaru: true,
      },
    ],
  },

  // -- Solution Section --
  solution: {
    heading:
      "How Does Claru Scale Teleoperation-Quality Data Beyond Lab Constraints?",
    sections: [
      {
        heading: "Distributed Human Demonstration Capture as a Teleoperation Complement",
        content:
          "Claru addresses the teleoperation bottleneck from the opposite direction: instead of scaling robot-in-the-loop collection (which is constrained by hardware), Claru scales human demonstration capture across hundreds of real environments and retrains the pipeline to feed robot learning algorithms. In the egocentric video collection engagement, Claru deployed approximately 500 contributors across three parallel capture pipelines — GoPro wearables (219,000 clips), smartphones (155,000 clips), and activity-specific task recording (12,000 clips) — delivering 386,000+ first-person video clips with same-day QA [5]. This approach generates the behavioral diversity that lab-based teleoperation cannot match: the same task (pouring, cutting, assembling) performed by hundreds of different people in hundreds of different environments, producing the distributional coverage that general-purpose policies require.",
        citationIds: ["humanplus-2024", "ace-2024"],
      },
      {
        heading: "Workplace-Embedded Collection for Deployment-Relevant Demonstrations",
        content:
          "Claru's workplace egocentric data program captures demonstrations in the exact environments where robots will operate. Active businesses across 10 workplace categories — barista stations, carpentry shops, tailoring studios, phone repair, furniture assembly, and more — serve as data collection sites, with workers recording 4K/60fps first-person video during normal workflow [6]. This produces demonstration data with three properties that lab teleoperation lacks: genuine environmental constraints (cluttered spaces, time pressure, safety hazards), naturalistic behavior (improvised tool use, adaptive task sequencing), and demographic diversity (workers of varying age, experience, and physical ability performing the same tasks differently). For teleoperation data consumers, these properties translate directly into more robust policies because the training distribution matches the deployment distribution.",
        citationIds: ["open-television-2024", "droid-2024"],
      },
      {
        heading: "From Video Demonstrations to Robot-Consumable Training Data",
        content:
          "Human video demonstrations require post-processing to become actionable training data for robot policies. Claru annotates every clip with structured metadata — environment type, lighting conditions, object count, interaction complexity score, and activity classification from a co-developed taxonomy — enabling downstream pipelines to extract the features robot learning algorithms consume. Recent advances in cross-embodiment transfer (HumanPlus achieving 60-100% success from video-only demonstrations [1], ACE's single-camera hand pose estimation [2]) demonstrate that the gap between human video and robot-executable policy is narrowing. Claru's data includes the environmental diversity and behavioral variation that these cross-embodiment methods need but that lab-collected demonstrations do not provide. The combination of Claru's scaled human demonstrations with a lab's targeted robot teleoperation produces coverage across both the behavioral and physical action spaces.",
        citationIds: ["humanplus-2024", "ace-2024"],
      },
    ],
  },

  // -- Case Studies --
  caseStudySlugs: [
    "egocentric-video-collection",
    "workplace-egocentric-data",
  ],

  // -- Dataset Showcase --
  datasetIds: [],

  // -- FAQ --
  faqs: [
    {
      question:
        "What is the difference between teleoperation data and human demonstration data?",
      answer:
        "Teleoperation data captures state-action pairs where a human directly controls a robot, producing trajectories in the robot's own action space. Human demonstration data captures the same tasks performed by humans without robot mediation, typically as video. Teleoperation data can be consumed directly by imitation learning algorithms; human demonstration data requires cross-embodiment transfer or action extraction. Claru specializes in scaled human demonstration collection, which provides the behavioral diversity that complements smaller teleoperation datasets.",
    },
    {
      question:
        "How many teleoperation demonstrations does a robot policy typically need?",
      answer:
        "Between 50 and 5,000 demonstrations per task, depending on the algorithm and task complexity. HumanPlus achieved 60-100% success with 40 hours of training data across diverse tasks. DROID collected 76,000 episodes for multi-task generalization. Claru's approach reduces the number of robot-in-the-loop demonstrations needed by providing broad human demonstration coverage — labs typically need 5-10x fewer robot demonstrations when pre-training on diverse human video data.",
    },
    {
      question:
        "Can human video demonstrations replace robot teleoperation entirely?",
      answer:
        "Not yet for precision manipulation tasks requiring force-torque feedback. HumanPlus and ACE demonstrate that camera-based systems can retarget human poses to robots with 60-100% success on gross motor tasks, but contact-rich manipulation (insertion, fastening, deformable object handling) still benefits from direct robot-in-the-loop teleoperation. Claru's data serves as a complement — providing the environmental and behavioral diversity at scale — while targeted teleoperation provides the embodiment-specific precision for the final 5-10% of task performance.",
    },
    {
      question:
        "What hardware and format does Claru deliver teleoperation-adjacent data in?",
      answer:
        "Claru captures with GoPro and DJI wearable cameras (219K clips at high-fidelity wide-angle) and smartphones (155K clips at 4K/60fps). Data is delivered as per-frame image sequences with structured metadata: timestamps, activity labels, environment descriptors, interaction complexity scores, and object counts. The format is compatible with standard robotics training frameworks including RT-X, Octo, and OpenVLA data loaders.",
    },
  ],

  // -- Research Citations --
  citations: [
    {
      id: "humanplus-2024",
      title:
        "HumanPlus: Humanoid Shadowing and Imitation from Humans",
      authors: "Fu et al.",
      venue: "arXiv 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2406.10454",
      keyClaim:
        "Single $50 RGB camera tracks full-body human poses and retargets to a humanoid robot, achieving 60-100% task success after 40 hours of training data.",
    },
    {
      id: "ace-2024",
      title:
        "ACE: A Cross-Platform Visual-Exoskeletonless Teleoperation System",
      authors: "Wang et al.",
      venue: "arXiv 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2408.11805",
      keyClaim:
        "Hand-facing camera estimates 3D hand poses for teleoperation without per-robot calibration, enabling cross-platform demonstration collection.",
    },
    {
      id: "open-television-2024",
      title:
        "Open-TeleVision: Teleoperation with Immersive Active Visual Feedback",
      authors: "Cheng et al.",
      venue: "arXiv 2024",
      year: 2024,
      url: "https://robot-tv.github.io",
      keyClaim:
        "Full VR teleoperation station for under $1,000 achieving 1-10mm control accuracy, demonstrating that hardware cost is no longer the primary bottleneck for collection scale.",
    },
    {
      id: "droid-2024",
      title:
        "DROID: A Large-Scale In-The-Wild Robot Manipulation Dataset",
      authors: "Khazatsky et al.",
      venue: "arXiv 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2403.12945",
      keyClaim:
        "76,000 demonstration episodes across 564 scenes and 86 tasks collected across 13 institutions over 18 months, illustrating the multi-lab coordination required for large-scale teleoperation.",
    },
    {
      id: "open-x-embodiment-2024",
      title:
        "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Collaboration et al.",
      venue: "arXiv 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864",
      keyClaim:
        "1M+ episodes across 22 robot embodiments show that cross-embodiment data improves transfer, but collection remains bottlenecked by hardware availability and lab environment diversity.",
    },
  ],

  // -- Internal Linking --
  pillarLinks: ["/pillars/acquire/egocentric-video"],

  // -- Related Content Pages --
  relatedSlugs: [
    "egocentric-video-data",
    "manipulation-trajectory-data",
    "vla-training-data",
  ],
};

export default teleoperationData;
