import type { ContentPageData } from "./types";

const safetyCriticalRobotData: ContentPageData = {
  // -- Identity & SEO --
  slug: "safety-critical-robot-data",
  title: "Safety-Critical Robot Data: Training Data for ISO 10218 and TS 15066 Compliance",
  metaTitle: "Safety-Critical Robot Training Data | Claru",
  metaDescription:
    "Training data for safety-certified robotic systems. Human proximity detection, force limiting, and collision avoidance data aligned with ISO 10218 and ISO/TS 15066.",
  primaryKeyword: "safety-critical robot data",
  secondaryKeywords: [
    "robot safety training data",
    "collaborative robot safety data",
    "ISO 10218 robot data",
    "TS 15066 compliance data",
    "human-robot interaction safety",
    "cobot safety dataset",
  ],
  breadcrumbLabel: "Safety-Critical Robot Data",
  ogCategory: "solution",

  // -- Hero --
  heroSubtitle:
    "Robots operating near humans must detect, predict, and react to human proximity with the reliability that safety standards demand. ISO 10218 and ISO/TS 15066 define the requirements; training data determines whether a learned perception system can meet them. The consequences of insufficient safety data are not degraded performance but physical harm.",

  // -- Problem Section --
  problem: {
    heading: "Why Is Safety-Critical Robot Data Different from Standard Training Data?",
    sections: [
      {
        heading: "Why Is Safety-Critical Robot Data Different from Standard Training Data?",
        content:
          "Standard robot training data optimizes for task completion: pick success rate, navigation efficiency, manipulation accuracy. Safety-critical data must optimize for a fundamentally different objective: ensuring that the robot never causes harm to nearby humans, even at the cost of task performance. ISO 10218 defines safety requirements for industrial robot systems including protective stop, speed limitation, and safety-rated monitored stop functions. ISO/TS 15066 extends these requirements to collaborative robot applications where humans and robots share workspace, specifying permissible force and pressure limits for different body regions. Training a learned perception system to enforce these standards requires data that comprehensively covers the scenarios where safety interventions are necessary: humans entering the robot workspace from unexpected directions, partial occlusion behind equipment, unusual postures, and edge cases where human detection is most difficult and most critical.",
        citationIds: ["iso10218-2011", "ts15066-2016"],
      },
      {
        heading: "What Makes Human Proximity Detection Data So Hard to Collect?",
        content:
          "Collecting safety-relevant human proximity data presents a chicken-and-egg problem: you need data of humans near operating robots to train safety systems, but operating robots near humans without adequate safety systems is itself dangerous. SafetyBench evaluated the safety performance of robot policies across diverse scenarios and found that most failure modes involve edge cases where humans appear in unexpected positions relative to the robot workspace. DROID and Open X-Embodiment contain some instances of humans in the frame but without safety-specific annotations: body region proximity labels, approach velocity vectors, or occlusion state indicators. The data that safety systems need — systematic coverage of all directions of approach, partial visibility conditions, and rapid entry scenarios — is precisely the data that is most dangerous to collect without an already-functioning safety system.",
        citationIds: ["safetybench-2024", "droid-2024"],
      },
      {
        heading: "How Do Current Datasets Fail Safety Certification Requirements?",
        content:
          "Safety certification under ISO 10218 and TS 15066 requires demonstrating that the perception system can reliably detect humans across a defined range of conditions with a specified false negative rate. No existing public robot dataset was designed to support this certification process. The datasets that include human presence data — such as EPIC-KITCHENS for activity recognition or COCO for person detection — were not collected with safety-critical annotation requirements: body region segmentation at the resolution TS 15066 requires, approach velocity measurement, or systematic coverage of edge-case viewing conditions. Building a safety-certified learned perception system requires purpose-built data collection programs that systematically enumerate and capture the detection scenarios that certification testing will evaluate.",
        citationIds: ["iso10218-2011", "ts15066-2016"],
      },
    ],
  },

  // -- Landscape / Comparison --
  landscape: {
    heading: "How Do Existing Datasets Support Safety-Critical Robot Training?",
    description:
      "The table below compares data sources relevant to safety-critical robot perception against Claru custom collection. No open dataset was designed for safety certification; all require significant additional annotation and scenario coverage.",
    datasets: [
      {
        name: "COCO (Person Detection)",
        scale: "200K+ labeled images, 250K+ person instances",
        tasks: "Person detection and pose estimation",
        environments: "Web-scraped images; diverse but uncontrolled",
        limitations:
          "Not robot-centric viewpoints; no proximity or approach velocity labels; no body region force-limit annotations; no systematic edge-case coverage",
        isClaru: false,
      },
      {
        name: "DROID",
        scale: "76K trajectories with some human presence",
        tasks: "Manipulation with incidental human observations",
        environments: "Research labs; humans occasionally in frame",
        limitations:
          "No safety-specific annotations; human presence is incidental not systematic; no proximity zones or approach vectors",
        isClaru: false,
      },
      {
        name: "Open X-Embodiment",
        scale: "1M+ trajectories; humans occasionally present",
        tasks: "Manipulation tasks with bystanders in some datasets",
        environments: "Research labs across 22 platforms",
        limitations:
          "No safety annotations; human presence is uncontrolled; no body region labels or force-limit mapping",
        isClaru: false,
      },
      {
        name: "SafetyBench (Sim)",
        scale: "Benchmark scenarios for robot safety evaluation",
        tasks: "Safety performance evaluation across diverse scenarios",
        environments: "Simulated environments with controlled human models",
        limitations:
          "Evaluation benchmark only; simulation; no real-world training data; limited to scenario definitions",
        isClaru: false,
      },
      {
        name: "Claru Custom",
        scale: "386K+ video clips, ~500 contributors, configurable safety-scenario protocols",
        tasks: "Configurable: human proximity detection, approach direction coverage, body region annotation, occlusion edge cases, rapid entry scenarios",
        environments: "Real workplaces, manufacturing floors, warehouses; actual human-robot shared workspace conditions",
        limitations:
          "Requires engagement lead time (days to launch, 1-2 week calibration); not a public benchmark; safety scenarios require careful protocol design",
        isClaru: true,
      },
    ],
  },

  // -- Solution Section --
  solution: {
    heading: "How Does Claru Build Safety-Critical Robot Training Data?",
    sections: [
      {
        heading: "How Does Systematic Scenario Coverage Support Safety Certification?",
        content:
          "ISO 10218 and TS 15066 certification requires demonstrating reliable human detection across a defined envelope of conditions. Claru's safety data collection programs are designed around the specific detection scenarios that certification testing evaluates. The structured activity taxonomy is extended with safety-specific scenario definitions: approach from all cardinal directions and angles, varying approach speeds from walking to running, partial occlusion behind equipment and shelving, unusual human postures (crouching, reaching overhead, bending), and simultaneous multi-person scenarios. Each scenario is systematically captured with multiple human subjects across diverse body types, clothing, and skin tones to ensure the perception model generalizes across the human variation it will encounter in deployment. The collection protocol tracks coverage completion against the full scenario matrix to identify gaps before data delivery.",
        citationIds: ["iso10218-2011", "ts15066-2016"],
      },
      {
        heading: "How Does Body Region Annotation Meet TS 15066 Force-Limit Requirements?",
        content:
          "ISO/TS 15066 specifies different permissible contact force and pressure limits for 29 body regions, from the skull (maximum 130N) to the hand (maximum 260N). A safety perception system must not only detect human presence but identify which body region is closest to the robot and at what distance, so that force-limiting controls can be set appropriately. Claru's annotation pipeline provides body region segmentation at the resolution TS 15066 requires, labeling the specific body parts within the robot's proximity zone across every frame. SafetyBench showed that most safety failures occur in edge cases where body region identification is ambiguous — a reaching arm partially behind a panel, legs visible under a table while the torso is occluded. Claru's edge-case collection protocols specifically target these ambiguous conditions where body region identification is hardest and most critical for correct force limiting.",
        citationIds: ["ts15066-2016", "safetybench-2024"],
      },
      {
        heading: "How Does Real-Environment Capture Address Deployment-Specific Safety Risks?",
        content:
          "Safety risks are environment-specific: a warehouse robot faces different proximity scenarios than a manufacturing cobot or a hospital service robot. DROID's lab environments do not represent the visual conditions of a working factory floor with heavy equipment, poor lighting, reflective surfaces, and workers wearing varied protective equipment. Claru's collection programs deploy into the actual deployment environments where the robot will operate, capturing the environment-specific safety scenarios that matter. The workplace egocentric program demonstrated capture across 10 workplace categories in multiple countries, producing data that reflects real working conditions including lighting variation, equipment configurations, and worker behavior patterns. For safety-critical applications, this environment-specific capture ensures that the training data covers the exact conditions that the safety perception system must handle reliably in production.",
        citationIds: ["droid-2024"],
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
      question: "What safety standards does Claru's robot data support?",
      answer:
        "Claru's safety data collection programs are designed to support certification under ISO 10218 (safety requirements for industrial robots) and ISO/TS 15066 (collaborative robot safety including force and pressure limits for 29 body regions). Data collection protocols enumerate the specific detection scenarios that certification testing evaluates and systematically capture coverage across the full scenario matrix.",
    },
    {
      question: "How does Claru ensure comprehensive edge-case coverage for safety data?",
      answer:
        "Safety scenario coverage is tracked against a defined matrix covering approach directions, speeds, occlusion conditions, human postures, body types, and multi-person configurations. The collection protocol tracks completion percentage against each scenario dimension and identifies coverage gaps before data delivery. Edge cases where human detection is most difficult (partial occlusion, unusual postures, rapid entry) receive dedicated collection focus.",
    },
    {
      question: "Does Claru provide body region annotations for TS 15066 compliance?",
      answer:
        "Yes. The annotation pipeline provides body region segmentation at the resolution ISO/TS 15066 requires, identifying the 29 specified body regions with per-frame labels indicating which regions are within the robot's proximity zones. This enables force-limiting controllers to set appropriate thresholds based on the specific body part at risk of contact.",
    },
    {
      question: "Can safety data be collected in my specific deployment environment?",
      answer:
        "Yes. Claru deploys data collection directly into target deployment environments. Safety risks are environment-specific, so training data must reflect the actual conditions: lighting, equipment layout, worker behavior, protective equipment, and proximity scenarios specific to the deployment site. Previous workplace programs have captured data across 10+ workplace categories in multiple countries.",
    },
  ],

  // -- Research Citations --
  citations: [
    {
      id: "iso10218-2011",
      title:
        "ISO 10218-1:2011 — Robots and Robotic Devices: Safety Requirements for Industrial Robots",
      authors: "International Organization for Standardization",
      venue: "ISO Standard",
      year: 2011,
      url: "https://www.iso.org/standard/51330.html",
      keyClaim:
        "Defines safety requirements for industrial robot systems including protective stop, speed limitation, and safety-rated monitored stop functions for human-robot coexistence.",
    },
    {
      id: "ts15066-2016",
      title:
        "ISO/TS 15066:2016 — Robots and Robotic Devices: Collaborative Robots",
      authors: "International Organization for Standardization",
      venue: "ISO Technical Specification",
      year: 2016,
      url: "https://www.iso.org/standard/62996.html",
      keyClaim:
        "Specifies safety requirements for collaborative robot applications including permissible force and pressure limits for 29 body regions during human-robot contact.",
    },
    {
      id: "safetybench-2024",
      title:
        "SafetyBench: Evaluating the Safety of Robot Manipulation Policies",
      authors: "Tung et al.",
      venue: "arXiv 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2410.17636",
      keyClaim:
        "Evaluated safety performance across diverse robot scenarios; found that most safety failures involve edge cases where humans appear in unexpected positions relative to the robot workspace.",
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
        "76,000 manipulation trajectories with incidental human presence in some frames; no safety-specific annotations or systematic human proximity coverage.",
    },
  ],

  // -- Internal Linking --
  pillarLinks: [
    "/training-data/robotics",
    "/models/safety-perception",
  ],

  // -- Related Content Pages --
  relatedSlugs: [
    "warehouse-robotics-data",
    "humanoid-robot-training-data",
    "multi-robot-training-data",
  ],
};

export default safetyCriticalRobotData;
