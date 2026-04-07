import type { LabPageData } from "./types";

const page: LabPageData = {
  slug: "nvidia-isaac",
  companyName: "NVIDIA Isaac / GR00T",
  companyDescription:
    "NVIDIA's Isaac platform provides simulation, training, and deployment infrastructure for robots. Project GR00T is their humanoid foundation model initiative. Isaac Sim and Isaac Lab are the dominant simulation environments for robot learning, while NVIDIA's Omniverse enables digital twin creation at industrial scale.",
  keyProducts: ["Isaac Sim", "Isaac Lab", "Project GR00T", "Omniverse"],
  researchFocus: [
    "Simulation-based robot training at scale",
    "Humanoid foundation models (GR00T)",
    "Sim-to-real transfer and domain randomization",
    "Digital twins for industrial robotics",
    "GPU-accelerated physics simulation",
  ],
  dataNeedsSummary:
    "NVIDIA's Isaac ecosystem is the simulation backbone for most robotics companies, but simulation fidelity depends on real-world calibration data. Project GR00T needs massive human motion and manipulation datasets to train humanoid foundation models. Isaac Sim's value proposition depends on demonstrable sim-to-real transfer — which requires real-world validation datasets to prove.",
  dataNeeds: [
    {
      title: "Real-world validation data for sim-to-real calibration",
      source: "Isaac Sim and Isaac Lab documentation on domain randomization",
      description: "Real-world sensor recordings from diverse environments to calibrate simulation parameters — surface properties, lighting models, object physics — and validate sim-to-real transfer.",
    },
    {
      title: "Human motion data for GR00T humanoid foundation model",
      source: "Project GR00T announcement at GTC 2024",
      description: "Large-scale human motion capture and video data showing whole-body movements, dexterous manipulation, and locomotion for pretraining humanoid control models.",
    },
    {
      title: "Digital twin validation datasets",
      source: "Omniverse digital twin deployment for industrial customers",
      description: "Real-world facility scans and sensor data for validating digital twin accuracy — ensuring simulated environments match their real-world counterparts.",
    },
    {
      title: "Multi-embodiment demonstration data for Isaac Lab benchmarks",
      source: "Isaac Lab as the standard training environment for diverse robot platforms",
      description: "Real-world manipulation and locomotion demonstrations across multiple robot platforms (humanoids, quadrupeds, industrial arms) to benchmark Isaac Lab's sim-to-real transfer quality per embodiment.",
    },
    {
      title: "Material and object property ground truth",
      source: "PhysX engine calibration requirements for realistic contact simulation",
      description: "Measured physical properties of real-world objects — friction coefficients, mass, deformability, surface roughness — paired with manipulation recordings to improve PhysX contact model accuracy for sim-to-real training.",
    },
  ],
  dataMatches: [
    {
      labNeed: "Real-world validation data for sim-to-real calibration",
      claruOffering: "Egocentric Activity Dataset + Custom Calibration Collection",
      rationale: "Claru's diverse real-world video provides broad visual distribution data for validating simulation rendering. Custom collection with calibrated sensors enables precise sim-to-real calibration for specific material and lighting parameters.",
    },
    {
      labNeed: "Human motion data for GR00T humanoid foundation model",
      claruOffering: "Egocentric Activity Dataset (~386K clips) + Custom Motion Collection",
      rationale: "Claru's activity dataset captures real human motion patterns. Targeted collection with body-worn IMUs and cameras can produce the whole-body motion data GR00T needs at scale.",
    },
    {
      labNeed: "Digital twin validation datasets",
      claruOffering: "Custom Facility Data Collection",
      rationale: "Claru can collect structured scans and sensor recordings in real facilities across its global network, providing the ground-truth data needed to validate Omniverse digital twins.",
    },
    {
      labNeed: "Material and object property ground truth",
      claruOffering: "Custom Object Property Measurement Campaigns",
      rationale: "Claru collectors can systematically measure and record physical properties of everyday objects using standardized protocols — friction, mass, compliance — paired with manipulation video, to provide the ground-truth calibration data that PhysX needs for realistic contact simulation.",
    },
  ],
  keyPapers: [
    {
      id: "nvidia-groot-2024",
      title: "Project GR00T: Foundation Model for Humanoid Robots",
      authors: "NVIDIA",
      venue: "GTC 2024",
      year: 2024,
      url: "https://developer.nvidia.com/project-groot",
    },
    {
      id: "makoviychuk-isaac-gym-2021",
      title: "Isaac Gym: High Performance GPU-Based Physics Simulation for Robot Learning",
      authors: "Makoviychuk et al.",
      venue: "NeurIPS 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2108.10470",
    },
    {
      id: "tobin-domain-rand-2017",
      title: "Domain Randomization for Transferring Deep Neural Networks from Simulation to the Real World",
      authors: "Tobin et al.",
      venue: "IROS 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1703.06907",
    },
    {
      id: "mittal-isaac-lab-2023",
      title: "Orbit: A Unified Simulation Framework for Interactive Robot Learning Environments",
      authors: "Mittal et al.",
      venue: "RA-L 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2301.04195",
    },
    {
      id: "rudin-anymal-2022",
      title: "Learning to Walk in Minutes Using Massively Parallel Deep RL",
      authors: "Rudin et al.",
      venue: "CoRL 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2109.11978",
    },
    {
      id: "handa-dextreme-2023",
      title: "DeXtreme: Transfer of Agile In-Hand Manipulation from Simulation to Reality",
      authors: "Handa et al.",
      venue: "ICRA 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2210.13702",
    },
  ],
  technicalAnalysis:
    "NVIDIA occupies the infrastructure layer of the robotics stack. Isaac Sim and Isaac Lab are used by most major robotics companies for training — from Figure AI to Agility Robotics to Boston Dynamics. This position creates a unique relationship with real-world data: NVIDIA does not deploy robots itself, but the value of its simulation platform depends critically on how well simulated experiences transfer to real robots.\n\nDomain randomization — the technique of varying simulation parameters during training to achieve robust transfer — is NVIDIA's core contribution to sim-to-real. But domain randomization ranges need to be calibrated against real-world measurements. Without real-world data showing the actual distribution of surface friction, lighting conditions, and object properties, randomization ranges are set by guesswork. Over-broad ranges waste training compute on unrealistic configurations; over-narrow ranges fail to cover real-world variability.\n\nProject GR00T represents NVIDIA's entry into the model layer — not just providing simulation infrastructure but training foundation models for humanoid robots. This ambition requires massive datasets of human motion to pretrain models that understand whole-body movement, dexterous manipulation, and locomotion. The scale of data needed mirrors the language model paradigm: millions of hours of human activity video plus structured motion capture data.\n\nThe Omniverse digital twin business creates yet another data demand. Industrial customers use Omniverse to create digital replicas of factories, warehouses, and construction sites. The commercial value depends on twin accuracy — which requires real-world validation data to verify. Claru's ability to collect structured facility data across diverse industrial environments provides the ground-truth measurements that keep digital twins grounded in physical reality.\n\nIsaac Lab (formerly Orbit) has become the standard training framework for robot RL policies, supporting dozens of robot platforms. Each platform's sim-to-real gap is different — a quadruped's ground contact differs from a humanoid's, which differs from an industrial arm's. Characterizing and closing these per-embodiment gaps requires real-world demonstration data from each platform type, creating a multiplied data demand that grows with every new robot supported by Isaac Lab.",

  metaTitle: "Real-World Data for NVIDIA Isaac & GR00T Platform | Claru",
  metaDescription:
    "Sim-to-real calibration, human motion, and digital twin validation data for NVIDIA's Isaac simulation platform and Project GR00T humanoid foundation model.",
  primaryKeyword: "NVIDIA Isaac training data",
  secondaryKeywords: ["GR00T training data", "Isaac Sim calibration data", "sim-to-real validation data", "Omniverse digital twin data"],
  canonicalPath: "/for/nvidia-isaac",
  h1: "Training Data for NVIDIA Isaac & GR00T",
  heroSubtitle:
    "NVIDIA powers robotics simulation. Here is how real-world data keeps Isaac grounded in physical reality and fuels the GR00T humanoid foundation model.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Labs", href: "/for" },
    { label: "NVIDIA Isaac", href: "/for/nvidia-isaac" },
  ],
  sections: [
    {
      type: "prose",
      heading: "About NVIDIA Isaac and GR00T",
      paragraphs: [
        "NVIDIA's robotics ecosystem spans simulation, training infrastructure, and foundation models. Isaac Sim provides GPU-accelerated physics simulation based on NVIDIA's PhysX engine. Isaac Lab (formerly Orbit) offers a standardized framework for training robot control policies via reinforcement learning. Together, they constitute the dominant training stack for the robotics industry — used by humanoid startups, industrial automation companies, and academic labs worldwide.",
        "Project GR00T, announced at GTC 2024 by CEO Jensen Huang, is NVIDIA's bid to build a foundation model for humanoid robots. GR00T aims to be the equivalent of GPT for physical robots — a single pretrained model that understands human motion, manipulation, and interaction, which can then be fine-tuned for specific robot platforms and tasks. The initiative leverages NVIDIA's GPU infrastructure advantage to train at scales that few other organizations can match.",
        "Omniverse provides the digital twin platform that connects NVIDIA's simulation capabilities to industrial applications. Factories, warehouses, and logistics facilities are replicated as photorealistic digital environments where robot behaviors can be tested and validated before real-world deployment. Major customers including BMW, PepsiCo, and Siemens use Omniverse digital twins for production planning and robot validation.",
      ],
    },
    {
      type: "stats",
      heading: "NVIDIA Robotics at a Glance",
      stats: [
        { value: "Isaac", label: "Simulation Platform" },
        { value: "GR00T", label: "Humanoid FM" },
        { value: "1000+", label: "Isaac Customers" },
        { value: "GTC 24", label: "GR00T Launch" },
        { value: "PhysX 5", label: "Physics Engine" },
      ],
    },
    {
      type: "prose",
      heading: "Research Focus and Key Projects",
      paragraphs: [
        "Isaac Gym (now Isaac Lab) demonstrated that massively parallel GPU-based simulation could train robot locomotion policies in minutes rather than days. By running thousands of simulation instances simultaneously on a single GPU, NVIDIA compressed the RL training loop from weeks to hours. This approach has been adopted by virtually every humanoid and quadruped robot company for locomotion policy training.",
        "DeXtreme (Handa et al., 2023) showcased NVIDIA's sim-to-real transfer capabilities for dexterous manipulation. The project trained a policy entirely in Isaac Gym to perform agile in-hand manipulation of objects with an Allegro hand, then transferred it to the real robot with minimal adaptation. This demonstrated that sufficient domain randomization in simulation can bridge even the challenging contact-rich manipulation gap.",
        "GR00T extends beyond simulation into the model layer. The foundation model approach requires pretraining on massive human motion datasets — not just robot data — because human demonstrations provide the richest signal for understanding physical interaction. NVIDIA's vision is that GR00T-pretrained models will be fine-tuned by each robot manufacturer for their specific hardware, with NVIDIA providing the pretrained base model as a platform service.",
      ],
    },
    {
      type: "comparison-table",
      heading: "NVIDIA Robotics Platform Components",
      description: "The key components of NVIDIA's robotics ecosystem and their data dependencies.",
      columns: ["Platform", "Function", "Data Dependency", "User Base"],
      rows: [
        { "Platform": "Isaac Sim", "Function": "Physics simulation", "Data Dependency": "Real-world calibration data", "User Base": "All robotics companies" },
        { "Platform": "Isaac Lab", "Function": "RL training framework", "Data Dependency": "Per-embodiment validation data", "User Base": "Robot policy developers" },
        { "Platform": "GR00T", "Function": "Humanoid foundation model", "Data Dependency": "Massive human motion data", "User Base": "Humanoid robot companies" },
        { "Platform": "Omniverse", "Function": "Digital twin creation", "Data Dependency": "Facility scans and measurements", "User Base": "Industrial customers" },
      ],
    },
    {
      type: "prose",
      heading: "Data Requirements Analysis",
      paragraphs: [
        "NVIDIA's sim-to-real gap is fundamentally a data calibration problem. Domain randomization works by varying simulation parameters during training, but the randomization ranges must be informed by real-world measurements. For contact-rich manipulation, this means measuring real friction coefficients, deformability, and mass distributions of objects the robot will handle. For locomotion, it means measuring real floor surface properties, slope gradients, and obstacle geometries.",
        "GR00T's foundation model ambition creates a massive data appetite. Pretraining a model that understands human motion requires diverse whole-body movement data — walking, running, climbing, reaching, grasping, carrying, gesturing — across different body types, ages, and environments. The scale target is comparable to the text data used for large language models: billions of tokens, here represented as millions of motion frames.",
        "The digital twin validation problem is ongoing rather than one-time. As real facilities change — new equipment, rearranged layouts, seasonal lighting variations — digital twins must be updated. Continuous validation data from real environments ensures twins remain accurate over time, making this a recurring data need rather than a single collection campaign.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports NVIDIA Isaac",
      paragraphs: [
        "Claru provides the real-world ground truth that keeps NVIDIA's simulation stack connected to physical reality. For Isaac Sim calibration, Claru collectors can measure and record physical properties of objects and environments using standardized protocols — friction coefficients, surface roughness, lighting conditions — providing the parameter distributions that inform domain randomization ranges.",
        "For GR00T, Claru's egocentric activity dataset and custom motion collection campaigns provide the diverse human motion data needed for foundation model pretraining. Body-worn cameras and IMU sensors capture whole-body movement patterns in real-world settings — not motion capture studio data, but authentic motion from real activities in real environments.",
        "For Omniverse digital twins, Claru's global network can perform structured facility scans and environmental measurements in factories, warehouses, and commercial spaces worldwide. This provides the diverse real-world reference data that validates digital twin accuracy across different facility types, geographic regions, and operational contexts.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "makoviychuk-isaac-gym-2021",
          title: "Isaac Gym: High Performance GPU-Based Physics Simulation for Robot Learning",
          authors: "Makoviychuk et al.",
          venue: "NeurIPS 2021",
          year: 2021,
          url: "https://arxiv.org/abs/2108.10470",
        },
        {
          id: "mittal-isaac-lab-2023",
          title: "Orbit: A Unified Simulation Framework for Interactive Robot Learning Environments",
          authors: "Mittal et al.",
          venue: "RA-L 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2301.04195",
        },
        {
          id: "handa-dextreme-2023",
          title: "DeXtreme: Transfer of Agile In-Hand Manipulation from Simulation to Reality",
          authors: "Handa et al.",
          venue: "ICRA 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2210.13702",
        },
        {
          id: "tobin-domain-rand-2017",
          title: "Domain Randomization for Transferring Deep Neural Networks from Simulation to the Real World",
          authors: "Tobin et al.",
          venue: "IROS 2017",
          year: 2017,
          url: "https://arxiv.org/abs/1703.06907",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Why does NVIDIA's simulation platform need real-world data?",
      answer: "Isaac Sim's value depends on sim-to-real transfer quality. Domain randomization ranges must be calibrated against real-world measurements of surface friction, lighting, and object properties. Without this calibration, randomization is based on guesswork — over-broad ranges waste compute, over-narrow ranges miss real-world variability.",
    },
    {
      question: "What data does Project GR00T need for humanoid foundation models?",
      answer: "GR00T needs massive datasets of human motion — whole-body movement, dexterous manipulation, locomotion — to pretrain models that understand physical interaction. Like language models, this foundation model approach requires millions of hours of human activity data plus structured motion capture recordings.",
    },
    {
      question: "How does real-world data validate Omniverse digital twins?",
      answer: "Digital twins must accurately replicate their real-world counterparts. Validation requires real-world sensor recordings — facility scans, lighting measurements, surface properties — collected in the actual environments being twinned. This ground-truth data ensures simulated environments match reality for reliable robot training.",
    },
    {
      question: "What is domain randomization and why does it need calibration?",
      answer: "Domain randomization varies simulation parameters (friction, lighting, object mass) during robot training to produce policies robust to real-world variation. Without real-world measurements to set randomization ranges, the ranges are guessed — too broad wastes compute training on impossible scenarios, too narrow fails to cover actual real-world conditions. Real-world calibration data sets appropriate randomization bounds.",
    },
    {
      question: "How does NVIDIA's platform role amplify the data need?",
      answer: "As the simulation provider for most robotics companies, NVIDIA's data needs are multiplicative. Each robot platform trained in Isaac Lab has a different sim-to-real gap. Characterizing and closing these gaps requires real-world data from each embodiment type — humanoids, quadrupeds, industrial arms — creating demand that grows with every new robot platform in the ecosystem.",
    },
  ],
  ctaHeading: "Ground Simulation in Reality",
  ctaDescription: "Discuss real-world calibration and validation data for NVIDIA's robotics ecosystem.",
  relatedGlossaryTerms: ["sim-to-real-gap", "domain-randomization", "synthetic-data", "groot-n1"],
  relatedGuidePages: ["how-to-bridge-sim-to-real-gap", "how-to-evaluate-sim-to-real-transfer"],
  relatedSolutionSlugs: [],
};

export default page;
