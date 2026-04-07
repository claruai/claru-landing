import type { LabPageData } from "./types";

const page: LabPageData = {
  slug: "skild-ai",
  companyName: "Skild AI",
  companyDescription:
    "Skild AI is building a general-purpose foundation model for robots, aiming to create a single scalable model that enables any robot to perform any task. Founded by CMU robotics professors Deepak Pathak and Abhinav Gupta, Skild emphasizes learning from massive, diverse data rather than hand-engineered control.",
  keyProducts: ["Skild Brain Foundation Model"],
  researchFocus: [
    "General-purpose robot foundation models",
    "Sim-to-real transfer at scale",
    "Multi-task robot learning",
    "Scalable robot data pipelines",
    "Curiosity-driven and self-supervised robot learning",
  ],
  dataNeedsSummary:
    "Skild's mission to build a universal robot brain demands the most diverse dataset in robotics. Their model must learn from data spanning different embodiments, environments, and tasks simultaneously. Founded by researchers who pioneered large-scale robot learning at CMU, Skild understands that the quality and diversity of training data is the primary determinant of model capability.",
  dataNeeds: [
    {
      title: "Massive multi-task manipulation data",
      source: "Skild AI research publications and founding mission",
      description: "Hundreds of distinct manipulation tasks captured across diverse environments and object categories to train a generalist manipulation policy.",
    },
    {
      title: "Real-world environment diversity",
      source: "Sim-to-real focus in Skild's research approach",
      description: "Data from hundreds of distinct real-world environments to calibrate simulation parameters and validate sim-to-real transfer across diverse conditions.",
    },
    {
      title: "Cross-modal sensor data",
      source: "Foundation model architecture requiring multiple input modalities",
      description: "Synchronized multi-modal recordings — RGB, depth, tactile, proprioception, language — to train multi-modal fusion in the foundation model.",
    },
    {
      title: "Locomotion data across robot morphologies",
      source: "Skild's demonstrated cross-embodiment locomotion capabilities",
      description: "Walking, running, and traversal recordings from bipedal humanoids, quadrupeds, and wheeled platforms across diverse terrain types to train universal locomotion controllers.",
    },
    {
      title: "Failure and recovery demonstration data",
      source: "Robustness requirements for general-purpose deployment",
      description: "Recordings of manipulation and locomotion failures paired with successful recovery strategies — dropped objects, slipped grasps, trip recovery — to train models that handle real-world uncertainty rather than only learning from successful demonstrations.",
    },
  ],
  dataMatches: [
    {
      labNeed: "Massive multi-task manipulation data",
      claruOffering: "Manipulation Trajectory Dataset + Custom Multi-Task Collection",
      rationale: "Claru's existing manipulation data spans diverse tasks, supplemented by coordinated collection campaigns targeting specific task categories that fill gaps in Skild's training distribution.",
    },
    {
      labNeed: "Real-world environment diversity",
      claruOffering: "Egocentric Activity Dataset (100+ cities) + Custom Collection",
      rationale: "Claru's global presence across 100+ cities provides unmatched environmental diversity. Purpose-collected data from these locations offers real-world conditions that calibrate sim-to-real models.",
    },
    {
      labNeed: "Cross-modal sensor data",
      claruOffering: "Multi-Modal Custom Collection Campaigns",
      rationale: "Claru can equip collectors with standardized multi-sensor packages (cameras, depth sensors, IMUs) to produce synchronized multi-modal recordings at scale across distributed locations.",
    },
    {
      labNeed: "Failure and recovery demonstration data",
      claruOffering: "Custom Failure-Recovery Collection Campaigns",
      rationale: "Claru can design collection protocols that intentionally capture manipulation failures and subsequent recovery attempts, providing the failure-mode training data that typical success-only datasets lack.",
    },
  ],
  keyPapers: [
    {
      id: "pathak-curiosity-2017",
      title: "Curiosity-driven Exploration by Self-Supervised Prediction",
      authors: "Pathak et al.",
      venue: "ICML 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1705.05363",
    },
    {
      id: "gupta-embodied-2022",
      title: "Embodied Intelligence via Learning and Evolution",
      authors: "Gupta et al.",
      venue: "Nature Communications",
      year: 2022,
      url: "https://www.nature.com/articles/s41467-021-25874-z",
    },
    {
      id: "open-x-embodiment-2024",
      title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Open X-Embodiment Collaboration",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864",
    },
    {
      id: "pathak-self-supervised-2019",
      title: "Self-Supervised Exploration via Disagreement",
      authors: "Pathak et al.",
      venue: "ICML 2019",
      year: 2019,
      url: "https://arxiv.org/abs/1906.04161",
    },
    {
      id: "agrawal-learning-to-poke-2016",
      title: "Learning to Poke by Poking: Experiential Learning of Intuitive Physics",
      authors: "Agrawal et al.",
      venue: "NeurIPS 2016",
      year: 2016,
      url: "https://arxiv.org/abs/1606.07419",
    },
    {
      id: "nair-r3m-2022",
      title: "R3M: A Universal Visual Representation for Robot Manipulation",
      authors: "Nair et al.",
      venue: "CoRL 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2203.12601",
    },
  ],
  technicalAnalysis:
    "Skild AI emerges from the CMU robotics tradition that has consistently pushed the boundaries of robot learning at scale. Co-founders Deepak Pathak and Abhinav Gupta bring complementary expertise — Pathak in self-supervised learning and curiosity-driven exploration, Gupta in embodied intelligence and visual learning — that converges on a data-centric approach to robot intelligence.\n\nSkild's technical strategy bets heavily on the scaling hypothesis: that a sufficiently large and diverse training dataset, combined with an appropriately scaled model architecture, will produce emergent robot capabilities analogous to what was observed in language models. This bet makes data the strategic resource — more diverse, higher-quality data directly translates to more capable robot policies.\n\nThe sim-to-real pipeline is central to Skild's approach. They use simulation to generate large quantities of synthetic manipulation data, then calibrate simulation parameters using real-world data to improve transfer fidelity. This calibration step requires real-world recordings from diverse environments — different lighting conditions, surface materials, object properties, and workspace configurations. The broader the real-world calibration set, the more accurately simulation can approximate reality.\n\nThe multi-task dimension is equally data-hungry. A general-purpose robot brain must handle hundreds or thousands of distinct tasks — from picking up small objects to opening doors to operating tools. Each task category needs sufficient demonstrations to learn the relevant manipulation primitives. Covering this task space requires a systematic data collection effort that maps the space of useful robot behaviors and ensures adequate coverage of each task category.\n\nSkild's emphasis on cross-embodiment learning — their demos show the same model controlling humanoids, quadrupeds, and drones — creates another data axis. Each embodiment introduces unique kinematic constraints, sensor configurations, and contact dynamics. The model must learn to abstract across these differences, which requires sufficient data from each embodiment type to learn the commonalities and differences.\n\nThe failure-recovery dimension is an underappreciated data need. Most robot learning datasets contain only successful demonstrations, producing models that perform well in ideal conditions but fail catastrophically when anything goes wrong. For a general-purpose deployment, robots must handle dropped objects, slipped grasps, unexpected collisions, and environmental changes. Training robust recovery behaviors requires data that includes failures and the strategies used to recover from them.",

  metaTitle: "Training Data for Skild AI Robot Foundation Model | Claru",
  metaDescription:
    "Multi-task manipulation, environmental diversity, and multi-modal data for Skild AI's general-purpose robot foundation model from CMU robotics.",
  primaryKeyword: "Skild AI training data",
  secondaryKeywords: ["robot foundation model data", "general purpose robot data", "CMU robotics data", "multi-task robot learning data"],
  canonicalPath: "/for/skild-ai",
  h1: "Training Data for Skild AI",
  heroSubtitle:
    "Skild AI is building a universal robot brain. Here is how massive, diverse real-world data trains a foundation model for any robot doing any task.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Labs", href: "/for" },
    { label: "Skild AI", href: "/for/skild-ai" },
  ],
  sections: [
    {
      type: "prose",
      heading: "About Skild AI",
      paragraphs: [
        "Skild AI was founded in 2023 by Deepak Pathak and Abhinav Gupta, both professors at Carnegie Mellon University's Robotics Institute. Pathak is known for his work on curiosity-driven exploration and self-supervised robot learning. Gupta pioneered visual learning approaches to embodied intelligence. Together, they represent the data-centric school of robot learning that treats robot intelligence as primarily a scaling problem.",
        "The company raised over $300 million in funding at a valuation exceeding $1.5 billion, making it one of the most well-funded robotics AI startups. Investors include Coatue Management, Lightspeed Venture Partners, SoftBank, and Jeff Bezos. The scale of investment reflects the capital intensity of their approach — building a universal robot brain requires massive compute for training and massive data for learning.",
        "Skild's demonstrations have shown a single model controlling robots across dramatically different morphologies: bipedal humanoids walking, quadruped robots climbing stairs, and drone platforms navigating environments. This cross-morphology capability, if it scales, would allow robot manufacturers to adopt Skild's foundation model as a base intelligence layer regardless of their hardware design.",
      ],
    },
    {
      type: "stats",
      heading: "Skild AI at a Glance",
      stats: [
        { value: "2023", label: "Founded" },
        { value: "$300M+", label: "Total Funding" },
        { value: "$1.5B+", label: "Valuation" },
        { value: "CMU", label: "Research Origin" },
        { value: "Multi", label: "Robot Morphologies" },
      ],
    },
    {
      type: "prose",
      heading: "Research Focus and Key Projects",
      paragraphs: [
        "Skild's founding research contributions established the intellectual foundation for their company. Pathak's curiosity-driven exploration (ICML 2017) showed that robots can learn meaningful behaviors by seeking novel experiences rather than optimizing hand-designed rewards — a self-supervised approach that reduces dependence on labeled data. Gupta's work on embodied intelligence demonstrated that visual learning from diverse environments produces robots that generalize to novel situations.",
        "The Skild Brain foundation model combines these insights at scale. Rather than training separate models for each task or embodiment, Skild trains a single large model on data from all available sources simultaneously. The hypothesis is that shared representations emerge across tasks and embodiments — the concept of 'picking up' is similar whether executed by a humanoid hand or a quadruped's jaw, and a model trained on both learns a more general representation of grasping than either alone.",
        "Skild's sim-to-real pipeline uses GPU-accelerated physics simulation (primarily Isaac Gym/Lab) to generate large volumes of synthetic training data, then uses real-world data to calibrate simulation parameters and validate transfer quality. This hybrid approach allows them to achieve the scale of simulation with the fidelity of real-world data — but only if the real-world calibration data is sufficiently diverse to cover the environments where robots will be deployed.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Foundation Model Data Requirements",
      description: "How Skild's universal foundation model approach drives data requirements across multiple dimensions.",
      columns: ["Dimension", "Requirement", "Current Gap", "Collection Approach"],
      rows: [
        { "Dimension": "Tasks", "Requirement": "1000+ distinct tasks", "Current Gap": "Most datasets cover <50 tasks", "Collection Approach": "Systematic task taxonomy + targeted campaigns" },
        { "Dimension": "Environments", "Requirement": "500+ distinct settings", "Current Gap": "Lab environments dominate", "Collection Approach": "Global distributed collection" },
        { "Dimension": "Embodiments", "Requirement": "10+ robot platforms", "Current Gap": "Most data from 1-2 robots", "Collection Approach": "Multi-platform coordination" },
        { "Dimension": "Failures", "Requirement": "Failure-recovery pairs", "Current Gap": "Datasets are success-only", "Collection Approach": "Intentional failure protocols" },
      ],
    },
    {
      type: "prose",
      heading: "Data Requirements Analysis",
      paragraphs: [
        "Skild's universal model ambition creates data requirements along four simultaneous dimensions: task diversity (hundreds of distinct manipulation and locomotion tasks), environment diversity (homes, offices, factories, outdoors), embodiment diversity (humanoids, quadrupeds, industrial arms, drones), and modality diversity (RGB, depth, tactile, proprioceptive, language). These dimensions are multiplicative — covering all combinations requires data at a scale that no single organization can generate internally.",
        "The sim-to-real calibration requirement is particularly demanding because Skild targets cross-morphology transfer. A quadruped's ground contact dynamics differ from a humanoid's, which differ from a wheeled robot's. Calibrating simulation for each embodiment type requires real-world data from that specific platform type in diverse environments. The calibration dataset must grow with every new embodiment Skild supports.",
        "Failure and recovery data is a strategic differentiator. Most robot learning datasets contain only successful task completions, producing models that are brittle when conditions deviate from training. For commercial deployment, robots must handle dropped objects, slipped grasps, and unexpected obstacles. Training these recovery behaviors requires data that intentionally captures failures and the strategies used to recover.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Skild AI",
      paragraphs: [
        "Claru's global collector network is uniquely suited to Skild's environmental diversity requirements. With collectors in 100+ cities performing standardized data collection protocols, Claru can rapidly generate manipulation and activity data from hundreds of distinct real-world environments — a scale of environmental diversity that no single lab or teleoperation facility can match.",
        "For multi-modal data, Claru can equip collectors with standardized sensor packages — cameras, depth sensors, IMUs, force sensors — producing synchronized multi-modal recordings that train Skild's multi-modal fusion architecture. The standardization ensures data compatibility across collection sites while the geographic distribution provides environmental variety.",
        "Claru can also design collection protocols that intentionally capture failure modes and recovery strategies. By including deliberate perturbation tasks — asking collectors to attempt difficult grasps, handle slippery objects, or work in cluttered conditions — Claru produces the failure-recovery training data that success-only datasets lack. This data is essential for building the robust, deployment-ready policies Skild needs for commercial applications.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "pathak-curiosity-2017",
          title: "Curiosity-driven Exploration by Self-Supervised Prediction",
          authors: "Pathak et al.",
          venue: "ICML 2017",
          year: 2017,
          url: "https://arxiv.org/abs/1705.05363",
        },
        {
          id: "gupta-embodied-2022",
          title: "Embodied Intelligence via Learning and Evolution",
          authors: "Gupta et al.",
          venue: "Nature Communications",
          year: 2022,
          url: "https://www.nature.com/articles/s41467-021-25874-z",
        },
        {
          id: "nair-r3m-2022",
          title: "R3M: A Universal Visual Representation for Robot Manipulation",
          authors: "Nair et al.",
          venue: "CoRL 2022",
          year: 2022,
          url: "https://arxiv.org/abs/2203.12601",
        },
        {
          id: "open-x-embodiment-2024",
          title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
          authors: "Open X-Embodiment Collaboration",
          venue: "ICRA 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2310.08864",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "What is Skild AI's approach to robot intelligence?",
      answer: "Skild bets on the scaling hypothesis — that a sufficiently large and diverse dataset with an appropriately scaled model will produce emergent robot capabilities, similar to what happened with language models. This makes training data the strategic bottleneck: more diverse, higher-quality data directly translates to more capable robot policies.",
    },
    {
      question: "Why does a robot foundation model need real-world data if it uses simulation?",
      answer: "Skild uses simulation for data generation but calibrates simulation parameters using real-world recordings. Without diverse real-world calibration data, simulated environments drift from physical reality — surfaces are too smooth, objects too rigid, lighting too uniform. Real-world data from many environments keeps simulation grounded in physical truth.",
    },
    {
      question: "How many tasks does a general-purpose robot model need to learn?",
      answer: "A truly general-purpose model must handle hundreds or thousands of distinct manipulation and navigation tasks. Each task category needs sufficient demonstrations to learn relevant primitives. This requires systematic data collection that maps the full space of useful robot behaviors and ensures adequate coverage across task types.",
    },
    {
      question: "Why is failure data important for Skild's foundation model?",
      answer: "Most robot datasets contain only successful demonstrations, producing models that work in ideal conditions but fail when anything goes wrong. For commercial deployment, robots must handle dropped objects, slipped grasps, and unexpected obstacles. Training failure recovery requires data that captures failures and the strategies used to recover from them — a data type almost entirely absent from existing datasets.",
    },
    {
      question: "How does Skild's cross-morphology capability work?",
      answer: "Skild trains a single model on data from multiple robot morphologies — humanoids, quadrupeds, drones. The model learns abstract representations of tasks (what to do) that are shared across embodiments, while also learning embodiment-specific control (how to do it on each platform). This requires sufficient data from each morphology to learn both the shared and specific components.",
    },
  ],
  ctaHeading: "Power the Universal Robot Brain",
  ctaDescription: "Discuss massive-scale, diverse training data for Skild AI's foundation model.",
  relatedGlossaryTerms: ["foundation-model-robotics", "cross-embodiment-data", "sim-to-real-gap", "robot-learning"],
  relatedGuidePages: ["how-to-build-a-cross-embodiment-dataset", "how-to-evaluate-sim-to-real-transfer"],
  relatedSolutionSlugs: [],
};

export default page;
