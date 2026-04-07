import type { ContentPageData } from "./types";

const humanoidRobotTrainingData: ContentPageData = {
  // -- Identity & SEO --
  slug: "humanoid-robot-training-data",
  title: "Humanoid Robot Training Data: Whole-Body Demonstrations at Scale",
  metaTitle: "Humanoid Robot Training Data | Claru",
  metaDescription:
    "Custom whole-body demonstration datasets for humanoid robots. Loco-manipulation, bimanual tasks, and human motion data for Figure, 1X, Tesla Optimus, and Unitree.",
  primaryKeyword: "humanoid robot training data",
  secondaryKeywords: [
    "humanoid robot dataset",
    "whole-body manipulation data",
    "bimanual robot training",
    "humanoid locomotion data",
    "loco-manipulation dataset",
    "human motion capture for robots",
  ],
  breadcrumbLabel: "Humanoid Robot Training Data",
  ogCategory: "solution",

  // -- Hero --
  heroSubtitle:
    "Humanoid robots require training data that captures the full complexity of human movement: coordinated bimanual manipulation, dynamic locomotion, and seamless transitions between walking, reaching, and grasping. Public datasets overwhelmingly feature single-arm tabletop manipulation, leaving a critical gap for labs building general-purpose humanoid policies.",

  // -- Problem Section --
  problem: {
    heading: "Why Is Training Data the Limiting Factor for Humanoid Robots?",
    sections: [
      {
        heading: "Why Is Training Data the Limiting Factor for Humanoid Robots?",
        content:
          "Humanoid robots represent the most demanding form factor for learned policies. Unlike fixed-base manipulators, humanoids must simultaneously control locomotion, balance, and upper-body manipulation. GR00T N1, NVIDIA's open foundation model for humanoid robots, uses a dual-system architecture combining a vision-language model with a diffusion transformer to generate whole-body actions. The authors demonstrated that training on a heterogeneous data pyramid — mixing real-robot trajectories, human demonstration videos, and synthetic data — was essential for generalization across manipulation tasks. However, even with this architecture, the model's performance was bounded by the diversity and quality of whole-body demonstration data available. Figure AI's Helix model similarly combines a VLM backbone with a latent action diffusion policy, trained on thousands of hours of teleoperated demonstrations to achieve full-body humanoid control including walking, picking, and placing in real-world environments.",
        citationIds: ["groot-n1-2025", "helix-2025"],
      },
      {
        heading: "What Makes Humanoid Training Data Different from Manipulation Data?",
        content:
          "Standard robot manipulation datasets capture single-arm or dual-arm tabletop tasks from fixed-base platforms. Humanoid policies need fundamentally different data: whole-body trajectories that include base locomotion, torso orientation, and coordinated arm movements. The HumanPlus project demonstrated that shadowing human demonstrations with a full-size humanoid enabled autonomous skill learning for tasks like donning a shoe and folding a shirt, but the approach required precise retargeting of human motion to the robot's kinematic structure. RoboCasa showed that even in simulated environments, generating realistic household task data requires modeling the full kinematic chain of a mobile manipulator including navigation, reaching, and bimanual coordination across diverse kitchen and living room layouts. The recurring challenge is that the action space for humanoids is 30-50+ degrees of freedom, versus 6-7 for a typical arm, making data collection exponentially more expensive and annotation more complex.",
        citationIds: ["humanplus-2024", "robocasa-2024"],
      },
      {
        heading: "How Do Current Datasets Fail Humanoid Generalization?",
        content:
          "Open X-Embodiment aggregated over 1 million trajectories from 22 robot platforms, but the vast majority come from single-arm manipulators in lab environments. DROID provides 76,000 manipulation trajectories across 564 scenes, yet all data comes from fixed-base Franka Emika robots. Neither dataset contains locomotion, balance recovery, or loco-manipulation sequences. The 1X World Model Challenge released a dataset of real-world humanoid video data, but without paired action labels the data supports world model pre-training rather than direct policy learning. For labs building humanoid foundation models, this means public data can serve as a visual pre-training source but cannot provide the whole-body action supervision that policies require for deployment.",
        citationIds: ["open-x-embodiment-2024", "droid-2024"],
      },
    ],
  },

  // -- Landscape / Comparison --
  landscape: {
    heading: "How Do Open Humanoid Datasets Compare to Custom Collection?",
    description:
      "The table below compares existing open datasets relevant to humanoid robot training against Claru custom collection. Key gaps include whole-body action labels, diverse real-world environments, and loco-manipulation task coverage.",
    datasets: [
      {
        name: "Open X-Embodiment",
        scale: "1M+ trajectories, 22 robot platforms",
        tasks: "Single-arm manipulation; pick-and-place, pushing, stacking",
        environments: "Research labs; standardized tabletop setups",
        limitations:
          "No humanoid data; no locomotion; fixed-base robots only; limited to short-horizon manipulation",
        isClaru: false,
      },
      {
        name: "DROID",
        scale: "76K trajectories, 564 scenes",
        tasks: "Table-top manipulation with Franka robots",
        environments: "13 institutions; predominantly lab environments",
        limitations:
          "Single robot morphology (Franka); no whole-body or locomotion data; lab-centric",
        isClaru: false,
      },
      {
        name: "AgiBot World",
        scale: "1M+ trajectories, 100+ scenes",
        tasks: "Mobile manipulation, navigation, household tasks",
        environments: "Indoor real-world: kitchens, living rooms, offices",
        limitations:
          "Single robot platform; fixed action representation; geographically constrained to specific regions",
        isClaru: false,
      },
      {
        name: "AMASS (Human Motion)",
        scale: "40+ hours, 11,000+ motions",
        tasks: "Human motion capture; locomotion, gestures, interactions",
        environments: "Motion capture studios; controlled lighting",
        limitations:
          "No manipulation actions; no object interaction labels; studio environments only; requires motion retargeting to robot morphologies",
        isClaru: false,
      },
      {
        name: "Claru Custom",
        scale: "386K+ video clips, ~500 contributors, 10K+ hours game data",
        tasks: "Configurable: whole-body demonstrations, loco-manipulation, bimanual tasks, kitchen activities, workplace operations",
        environments: "Global real-world coverage; homes, workplaces, outdoor; 10+ workplace categories across multiple countries",
        limitations:
          "Requires engagement lead time (days to launch, 1-2 week calibration); not a public benchmark",
        isClaru: true,
      },
    ],
  },

  // -- Solution Section --
  solution: {
    heading: "How Does Claru Build Training Data for Humanoid Robots?",
    sections: [
      {
        heading: "How Does Human Demonstration Capture Serve Humanoid Policy Training?",
        content:
          "Humanoid robots are designed to operate in human environments performing human tasks, making human demonstration video a natural training signal. HumanPlus showed that autonomous humanoid skills can be learned directly from human shadowing demonstrations, where a human performs tasks while the robot mirrors the motion in real time. Claru's egocentric video pipeline captures first-person human demonstrations at scale: 386,000+ clips across three parallel streams (GoPro wearable, smartphone, and activity-specific capture) from approximately 500 global contributors. These demonstrations capture the natural whole-body coordination — reaching while walking, bimanual object manipulation, balance adjustments during load carrying — that humanoid policies must reproduce. The structured activity taxonomy, co-developed through iterative revision with research teams, ensures consistent labeling of body part engagement, task phase transitions, and environmental constraints across all contributors.",
        citationIds: ["humanplus-2024"],
      },
      {
        heading: "How Does Environment Diversity Improve Humanoid Generalization?",
        content:
          "GR00T N1's data pyramid architecture requires diverse real-world demonstrations to generalize beyond lab environments. RoboCasa's simulation study demonstrated that training across 150+ unique kitchen and living room layouts with thousands of object instances dramatically improved policy transfer compared to single-environment training. Claru addresses the real-world environment diversity gap that simulation cannot fill. The workplace egocentric data project captured first-person video across 10 real workplace categories — barista stations, carpentry workshops, tailoring studios, phone repair shops, and more — spanning multiple countries. Workers captured 4K video at 60fps during normal business operations. This produces training data containing the physical variability, improvised tool use, and spatial reasoning that staged lab environments systematically exclude. For humanoid foundation models, this translates to improved zero-shot performance in novel deployment environments.",
        citationIds: ["groot-n1-2025", "robocasa-2024"],
      },
      {
        heading: "How Does Synchronized Action Capture Enable Whole-Body Policy Learning?",
        content:
          "Figure AI's Helix model requires thousands of hours of paired observation-action data to train its latent action diffusion policy for whole-body humanoid control. Claru's synchronized capture pipeline, proven in the game-based data capture project, delivers paired video and timestamped control data with sub-16ms temporal alignment. The custom-built application maintains frame-level synchronization via a shared monotonic clock with microsecond precision, producing 10,000+ hours of synchronized data with zero data loss incidents. This infrastructure can be configured for any action representation: joint angles, end-effector poses, velocity commands, or full-body kinematic chains. The same temporal precision that captures frame-accurate game inputs translates directly to the action label fidelity that humanoid VLA architectures demand.",
        citationIds: ["helix-2025"],
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
      question: "What types of humanoid robot training data does Claru provide?",
      answer:
        "Claru provides three categories of data relevant to humanoid policies: (1) egocentric human demonstration videos capturing whole-body activities like cooking, cleaning, and workplace tasks from 500+ global contributors; (2) synchronized observation-action pairs with sub-16ms temporal alignment for direct policy training; and (3) structured activity annotations covering task phases, object interactions, and body part engagement. Data can be configured for specific humanoid morphologies and action space representations.",
    },
    {
      question: "How does human demonstration data transfer to humanoid robot policies?",
      answer:
        "Research from HumanPlus and GR00T N1 demonstrates that human demonstration video serves as both a pre-training signal and a direct supervision source for humanoid policies. Human videos capture the whole-body coordination patterns — reaching while walking, bimanual manipulation, balance adjustments — that humanoid robots must reproduce. Vision-language-action models can extract task structure and motion patterns from human demonstrations, then fine-tune on robot-specific action data for deployment.",
    },
    {
      question: "Can Claru capture data specific to my humanoid robot platform?",
      answer:
        "Yes. Claru configures collection pipelines to match specific robot morphologies and deployment environments. The structured activity taxonomy is co-developed with each research team through iterative revision cycles. Output formats including action space representations, frame rates, and annotation schemas are configured to match your model's training pipeline requirements.",
    },
    {
      question: "What environments are covered in Claru's humanoid training data?",
      answer:
        "Claru collects across real-world environments that lab datasets underrepresent. The workplace program covers 10 categories including barista stations, carpentry workshops, tailoring studios, and phone repair shops across multiple countries. The egocentric pipeline spans homes, kitchens, outdoor spaces, and commercial environments. This diversity is critical for humanoid robots that must generalize across deployment settings rather than memorize a single lab layout.",
    },
  ],

  // -- Research Citations --
  citations: [
    {
      id: "groot-n1-2025",
      title:
        "GR00T N1: An Open Foundation Model for Generalist Humanoid Robots",
      authors: "NVIDIA et al.",
      venue: "arXiv 2025",
      year: 2025,
      url: "https://arxiv.org/abs/2503.14734",
      keyClaim:
        "Open VLA foundation model for humanoid robots trained on a heterogeneous data pyramid of real-robot trajectories, human videos, and synthetic data; dual-system architecture achieves superior manipulation results.",
    },
    {
      id: "helix-2025",
      title:
        "Helix: A Vision-Language-Action Model for Generalist Humanoid Control",
      authors: "Figure AI et al.",
      venue: "arXiv 2025",
      year: 2025,
      url: "https://arxiv.org/abs/2502.07092",
      keyClaim:
        "Full-body humanoid VLA combining a VLM backbone with latent action diffusion, trained on thousands of hours of teleoperated demonstrations for walking, picking, and placing in real-world environments.",
    },
    {
      id: "humanplus-2024",
      title:
        "HumanPlus: Humanoid Shadowing and Imitation from Humans",
      authors: "Fu et al.",
      venue: "arXiv 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2406.10454",
      keyClaim:
        "Demonstrated that autonomous humanoid skills including wearing a shoe and folding a shirt can be learned from real-time human shadowing demonstrations with motion retargeting.",
    },
    {
      id: "robocasa-2024",
      title:
        "RoboCasa: Large-Scale Simulation of Everyday Tasks for Generalist Robots",
      authors: "Nasiriany et al.",
      venue: "arXiv 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2406.02523",
      keyClaim:
        "Large-scale simulation benchmark with 150+ kitchen layouts and 2,500+ 3D objects demonstrating that environment diversity dramatically improves policy generalization for household manipulation.",
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
        "Aggregated 1M+ trajectories from 22 robot platforms but predominantly features single-arm manipulation without locomotion or whole-body data.",
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
        "76,000 robot manipulation trajectories across 564 scenes and 13 institutions; valuable for manipulation but limited to fixed-base Franka robots.",
    },
  ],

  // -- Internal Linking --
  pillarLinks: [
    "/training-data/robotics",
    "/models/vla",
  ],

  // -- Related Content Pages --
  relatedSlugs: [
    "vla-training-data",
    "manipulation-trajectory-data",
    "language-conditioned-robot-data",
  ],
};

export default humanoidRobotTrainingData;
