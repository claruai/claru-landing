import type { LabPageData } from "./types";

const page: LabPageData = {
  slug: "unitree",
  companyName: "Unitree Robotics",
  companyDescription:
    "Unitree Robotics is a Chinese robotics company producing affordable quadruped and humanoid robots. Their G1 and H1 humanoids and Go2 quadruped are designed for accessibility, targeting both research and commercial markets with hardware at a fraction of competitors' prices.",
  keyProducts: ["G1 Humanoid", "H1 Humanoid", "Go2 Quadruped"],
  researchFocus: [
    "Affordable humanoid and quadruped platforms",
    "Reinforcement learning for locomotion",
    "Whole-body manipulation",
    "Outdoor and unstructured environment navigation",
    "Community-driven robot learning ecosystem",
  ],
  dataNeedsSummary:
    "Unitree's strategy of making humanoid hardware accessible to a broad research and commercial market amplifies the data bottleneck — more deployments mean more domain-specific data requirements. Their G1 humanoid at $16K creates demand for affordable, scalable training data that matches the hardware's diverse target applications from warehouse work to outdoor patrol.",
  dataNeeds: [
    {
      title: "Diverse locomotion terrain data",
      source: "Unitree G1 and H1 demonstration videos showing outdoor traversal",
      description: "Walking data across outdoor terrain — grass, gravel, slopes, stairs, curbs — with full kinematic recordings for training robust locomotion controllers.",
    },
    {
      title: "Object manipulation in varied settings",
      source: "G1 manipulation demonstrations and research collaborations",
      description: "Tabletop and standing manipulation demonstrations across diverse environments, capturing the range of tasks the affordable G1 platform is expected to perform.",
    },
    {
      title: "Multi-environment navigation data",
      source: "Go2 and humanoid deployment in indoor and outdoor settings",
      description: "Navigation trajectories in indoor corridors, outdoor paths, construction sites, and mixed terrain for training environment-agnostic navigation policies.",
    },
    {
      title: "Community research task data from university labs",
      source: "Unitree's large installed base at research universities worldwide",
      description: "Aggregated manipulation and locomotion data from the hundreds of university labs using Unitree platforms, covering a long tail of research tasks and environments that no single lab explores.",
    },
    {
      title: "Human-following and social navigation data",
      source: "Go2 and G1 use cases in service, security, and companion applications",
      description: "Data on following humans through crowds, maintaining appropriate social distances, and navigating pedestrian-dense environments — required for service, companion, and security patrol applications.",
    },
  ],
  dataMatches: [
    {
      labNeed: "Diverse locomotion terrain data",
      claruOffering: "Custom Outdoor Locomotion Collection",
      rationale: "Claru's collectors in 100+ cities can capture body-worn sensor data across diverse outdoor terrain types — parks, urban environments, industrial areas — providing the geographic and surface diversity needed for robust locomotion policies.",
    },
    {
      labNeed: "Object manipulation in varied settings",
      claruOffering: "Manipulation Trajectory Dataset + Egocentric Activity Dataset",
      rationale: "Claru's existing manipulation data covers diverse object interactions, while egocentric video provides visual context for tabletop and standing tasks across real-world environments.",
    },
    {
      labNeed: "Multi-environment navigation data",
      claruOffering: "Egocentric Activity Dataset + Custom Navigation Collection",
      rationale: "Existing egocentric video captures human navigation patterns, supplemented by purpose-collected navigation data with standardized sensor packages in target environments.",
    },
    {
      labNeed: "Human-following and social navigation data",
      claruOffering: "Egocentric Activity Dataset + Custom Social Navigation Collection",
      rationale: "Claru's egocentric dataset captures first-person views of walking through populated environments. Targeted collection in pedestrian-dense areas provides the social navigation data needed for companion and patrol applications.",
    },
  ],
  keyPapers: [
    {
      id: "unitree-g1-2024",
      title: "Unitree G1: An Affordable General-Purpose Humanoid",
      authors: "Unitree Robotics",
      venue: "Company Technical Specifications",
      year: 2024,
      url: "https://www.unitree.com/g1/",
    },
    {
      id: "fu-minimial-sim2real-2024",
      title: "Humanoid Locomotion as Next Token Prediction",
      authors: "Fu et al.",
      venue: "arXiv 2402.19469",
      year: 2024,
      url: "https://arxiv.org/abs/2402.19469",
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
      id: "cheng-parkour-2024",
      title: "Extreme Parkour with Legged Robots",
      authors: "Cheng et al.",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2309.14341",
    },
    {
      id: "he-agile-loco-2024",
      title: "Learning Human-to-Humanoid Real-Time Whole-Body Teleoperation",
      authors: "He et al.",
      venue: "arXiv 2403.04436",
      year: 2024,
      url: "https://arxiv.org/abs/2403.04436",
    },
    {
      id: "zhuang-robot-parkour-2023",
      title: "Robot Parkour Learning",
      authors: "Zhuang et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2309.05665",
    },
  ],
  technicalAnalysis:
    "Unitree's business model creates a unique dynamic in the training data market. By pricing the G1 humanoid at roughly $16,000 — an order of magnitude less than competitors — they are democratizing access to humanoid hardware. But this accessibility means their robots will be deployed in far more diverse settings than any single company's internal data collection can cover.\n\nResearch labs buying G1 units for university projects need data tailored to their specific research domains. Commercial customers deploying G1 for patrol, inspection, or light logistics need data from their specific operating environments. This creates a long-tail data distribution that Unitree cannot possibly serve from in-house collection alone.\n\nThe locomotion challenge is particularly relevant for Unitree. Their reinforcement learning-based locomotion controllers are primarily trained in simulation using Isaac Gym. While these policies transfer reasonably well to flat indoor surfaces, the outdoor terrain traversal that many customers want — grass, gravel, slopes, construction debris — requires real-world data to calibrate the sim-to-real gap. Each terrain type has unique contact dynamics that simulation engines model imprecisely.\n\nFor manipulation, the G1's relatively compact form factor means it operates in different workspace geometry than larger humanoids like Atlas or Figure 02. Training data needs to match this specific embodiment's reach envelope, force capabilities, and camera viewpoints. Claru's ability to collect data using standardized protocols but in diverse physical environments addresses both the embodiment-specific and environment-diversity requirements simultaneously.\n\nUnitree's Go2 quadruped has become the most popular research quadruped worldwide due to its combination of capability and price. This massive installed base creates a community data opportunity — hundreds of labs are training Go2 controllers for different tasks, but their data remains siloed. A distributed data collection framework that standardizes recording protocols across this user community could create the most diverse quadruped locomotion dataset ever assembled.\n\nThe social navigation dimension is increasingly important as Unitree robots move from research labs into service roles. Security patrol, companion assistance, and delivery applications all require robots to navigate among pedestrians — predicting human movement, maintaining appropriate distances, and responding to social cues. This demands data collected in crowded real-world environments like shopping malls, office buildings, and public sidewalks.",

  metaTitle: "Training Data for Unitree G1 & H1 Humanoid Robots | Claru",
  metaDescription:
    "Diverse locomotion, manipulation, and navigation data for Unitree's affordable G1 and H1 humanoid robot platforms and Go2 quadruped.",
  primaryKeyword: "Unitree training data",
  secondaryKeywords: ["Unitree G1 data", "H1 humanoid data", "affordable humanoid training data", "Go2 robot data"],
  canonicalPath: "/for/unitree",
  h1: "Training Data for Unitree Robotics",
  heroSubtitle:
    "Unitree is making humanoid robots accessible to everyone. Here is how diverse, affordable training data matches the scale of their hardware ecosystem.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Labs", href: "/for" },
    { label: "Unitree", href: "/for/unitree" },
  ],
  sections: [
    {
      type: "prose",
      heading: "About Unitree Robotics",
      paragraphs: [
        "Unitree Robotics was founded in 2016 in Hangzhou, China, with the mission of making advanced legged robots affordable and accessible. The company first gained attention with its A1 and Go1 quadruped robots, which undercut competitors like Boston Dynamics by an order of magnitude on price while delivering comparable locomotion performance. This price-disruption strategy has made Unitree the most widely adopted legged robot platform in academic research worldwide.",
        "In 2024, Unitree expanded into humanoid robotics with the G1 and H1 platforms. The G1, priced at approximately $16,000, is the most affordable general-purpose humanoid robot on the market — positioning it as the default choice for university robotics labs, startups, and commercial pilot programs that cannot justify the $100K+ price tags of competing humanoids from Figure AI, Boston Dynamics, or Agility Robotics.",
        "Unitree has sold thousands of robot units across more than 50 countries, creating the largest installed base of any legged robot platform. This massive deployment creates a natural ecosystem effect: more users means more research, more applications, and more demand for diverse training data across the long tail of use cases that Unitree's affordable hardware enables.",
      ],
    },
    {
      type: "stats",
      heading: "Unitree at a Glance",
      stats: [
        { value: "2016", label: "Founded" },
        { value: "$16K", label: "G1 Starting Price" },
        { value: "23 DOF", label: "G1 Joints" },
        { value: "50+", label: "Countries" },
        { value: "1000s", label: "Robots Deployed" },
        { value: "China", label: "Headquarters" },
      ],
    },
    {
      type: "prose",
      heading: "Research Focus and Key Platforms",
      paragraphs: [
        "The Go2 quadruped is Unitree's most successful product, widely used in robotics research for locomotion, navigation, and mobile manipulation studies. Research groups have demonstrated Go2 performing extreme parkour (Cheng et al., 2024), navigating unstructured outdoor environments, and serving as a mobile manipulation platform when equipped with arm attachments. The Go2's popularity in research creates a large base of published locomotion policies that benefit from real-world terrain data.",
        "The G1 humanoid features 23 degrees of freedom, dexterous grippers, and a compact form factor designed for indoor environments. Recent demonstrations have shown G1 performing whole-body manipulation, stair climbing, and outdoor walking. The platform's affordability is driving adoption for both research and early commercial applications including security patrol, inspection, and light logistics.",
        "The H1 is Unitree's premium humanoid platform, standing taller than G1 with additional degrees of freedom and higher payload capacity. H1 targets more demanding applications — industrial inspection, heavy logistics, and advanced manipulation research — where the compact G1's reach and payload limitations become binding constraints. Together, G1 and H1 cover a broad range of humanoid applications at price points accessible to the majority of potential users.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Unitree Platform Comparison",
      description: "How Unitree's robot platforms compare in specifications and target applications.",
      columns: ["Platform", "Type", "Price", "DOF", "Target Use"],
      rows: [
        { "Platform": "Go2", "Type": "Quadruped", "Price": "~$1,600", "DOF": "12", "Target Use": "Research, patrol, inspection" },
        { "Platform": "G1", "Type": "Humanoid", "Price": "~$16,000", "DOF": "23", "Target Use": "Research, light logistics, service" },
        { "Platform": "H1", "Type": "Humanoid", "Price": "~$90,000", "DOF": "26+", "Target Use": "Industrial, advanced manipulation" },
      ],
    },
    {
      type: "prose",
      heading: "Data Requirements Analysis",
      paragraphs: [
        "Unitree's affordability-driven deployment model creates a data diversity challenge that is the inverse of most robotics companies. Rather than a few robots in controlled environments needing deep data on specific tasks, Unitree has thousands of robots across 50+ countries needing broad data across a long tail of applications. Security patrol in a Tokyo office building requires different data than outdoor inspection at a Brazilian construction site.",
        "The sim-to-real gap for locomotion is Unitree's most pressing data challenge. Their RL-based locomotion controllers are trained in Isaac Gym and transfer well to flat surfaces, but outdoor terrain — grass, gravel, mud, sand, snow, uneven pavement — introduces contact dynamics that simulators model poorly. Each terrain type needs real-world data to calibrate the sim-to-real transfer. Given Unitree's global deployment footprint, this means terrain data from diverse geographic and climatic conditions.",
        "For the G1 humanoid specifically, manipulation data must account for its compact form factor. The G1's reach envelope, force capabilities, and camera viewpoints differ from larger humanoids like Figure 02 or Atlas. Training data collected on other platforms does not transfer directly — G1 needs demonstrations matched to its specific embodiment geometry. This creates a demand for G1-specific data collection at a scale proportional to the platform's rapidly growing user base.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Unitree Robotics",
      paragraphs: [
        "Claru's global collector network maps naturally to Unitree's global deployment footprint. With collectors in 100+ cities across diverse geographic and climatic regions, Claru can provide the terrain diversity, environmental variety, and cultural context that Unitree's worldwide user base demands. Outdoor locomotion data from parks in Seoul, sidewalks in Berlin, and construction sites in Dubai — this geographic breadth matches the breadth of Unitree's deployments.",
        "For G1 and H1 manipulation data, Claru can collect embodiment-matched demonstrations by deploying data collection in environments where Unitree humanoids will actually operate. Office lobbies, retail stores, warehouse aisles, and residential spaces — each captured with recording setups calibrated to the G1's camera height and reach envelope.",
        "Claru's egocentric activity dataset provides a ready-made pretraining resource for any Unitree platform targeting human-centric environments. First-person video of humans navigating crowded spaces, performing household tasks, and interacting with everyday objects captures the visual patterns and activity structures that Unitree robots must understand to operate effectively alongside people.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "unitree-g1-2024",
          title: "Unitree G1: An Affordable General-Purpose Humanoid",
          authors: "Unitree Robotics",
          venue: "Company Technical Specifications",
          year: 2024,
          url: "https://www.unitree.com/g1/",
        },
        {
          id: "cheng-parkour-2024",
          title: "Extreme Parkour with Legged Robots",
          authors: "Cheng et al.",
          venue: "ICRA 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2309.14341",
        },
        {
          id: "he-agile-loco-2024",
          title: "Learning Human-to-Humanoid Real-Time Whole-Body Teleoperation",
          authors: "He et al.",
          venue: "arXiv 2403.04436",
          year: 2024,
          url: "https://arxiv.org/abs/2403.04436",
        },
        {
          id: "zhuang-robot-parkour-2023",
          title: "Robot Parkour Learning",
          authors: "Zhuang et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2309.05665",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "What training data does the Unitree G1 humanoid need?",
      answer: "The G1 needs diverse locomotion data across outdoor terrain, manipulation demonstrations matched to its compact form factor and reach envelope, and navigation data from both indoor and outdoor environments. The affordable price point means the robot will be deployed in many different contexts, requiring broad data coverage.",
    },
    {
      question: "How does Unitree's affordable pricing affect training data requirements?",
      answer: "Lower hardware costs mean more diverse deployments — university labs, small businesses, outdoor patrol, light logistics. This creates a long-tail of data needs that no single organization can serve. Distributed data collection across many environments and task types becomes essential.",
    },
    {
      question: "Can simulation alone train Unitree robots for outdoor use?",
      answer: "Simulation-trained locomotion policies transfer well to flat indoor surfaces but struggle with outdoor terrain. Grass, gravel, slopes, and construction debris have contact dynamics that Isaac Gym and MuJoCo model imprecisely. Real-world terrain data is needed to calibrate and validate sim-to-real transfer for outdoor deployments.",
    },
    {
      question: "Why does Unitree's global deployment create unique data challenges?",
      answer: "Unitree has thousands of robots deployed across 50+ countries. A security patrol robot in Tokyo needs different data than an inspection robot in Brazil. This geographic and application diversity creates a long-tail data demand that requires collection across many environments, terrain types, and cultural contexts — not just a single lab or region.",
    },
    {
      question: "How does G1's form factor affect training data compatibility?",
      answer: "The G1 is more compact than most humanoids, with a different reach envelope, camera height, and force capability. Training data collected on larger platforms like Figure 02 or Atlas does not transfer directly — the visual perspective, workspace geometry, and manipulation strategies differ. G1 needs data collected from its specific embodiment perspective or matched to its physical dimensions.",
    },
  ],
  ctaHeading: "Data for Every Unitree Deployment",
  ctaDescription: "Discuss scalable data solutions that match the breadth of Unitree's affordable robot ecosystem.",
  relatedGlossaryTerms: ["humanoid-robot", "sim-to-real-gap", "cross-embodiment-data", "robot-learning"],
  relatedGuidePages: ["how-to-bridge-sim-to-real-gap", "how-to-collect-multimodal-robot-data"],
  relatedSolutionSlugs: [],
};

export default page;
