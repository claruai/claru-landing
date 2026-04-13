import type { LabPageData } from "./types";

const page: LabPageData = {
  slug: "toyota-research",
  companyName: "Toyota Research Institute",
  companyDescription:
    "Toyota Research Institute (TRI) applies AI to robotics, autonomous driving, and materials science. Their robotics program focuses on assistive robots for aging populations, household manipulation, and diffusion policy-based robot learning — with a distinctive emphasis on contact-rich manipulation and deformable object handling.",
  keyProducts: ["TRI Home Robots", "Diffusion Policy Research Platform"],
  researchFocus: [
    "Diffusion policy for robot manipulation",
    "Household assistive robotics",
    "Contact-rich and deformable manipulation",
    "Large behavior models for robots",
    "Bimanual manipulation with ALOHA systems",
  ],
  dataNeedsSummary:
    "TRI's diffusion policy research and assistive robotics program require extensive household manipulation data — particularly for contact-rich tasks involving deformable objects like cloth, food, and flexible packaging. Their vision of robots assisting aging populations demands training data from real home environments with authentic objects and task configurations.",
  dataNeeds: [
    {
      title: "Household manipulation with deformable objects",
      source: "TRI diffusion policy papers (Chi et al., 2023) and assistive robotics program",
      description: "Manipulation demonstrations involving cloth folding, food preparation, flexible packaging, and other deformable object interactions in real kitchen and living environments.",
    },
    {
      title: "Contact-rich manipulation recordings",
      source: "TRI's emphasis on tasks requiring complex contact dynamics",
      description: "Multi-modal recordings of tasks like wiping surfaces, loading dishwashers, and stacking irregular objects where contact mechanics drive task success.",
    },
    {
      title: "Assistive interaction data with elderly populations",
      source: "Toyota's strategic focus on aging society solutions",
      description: "Data on assistance tasks relevant to elderly individuals — reaching high shelves, opening containers, organizing medications — in real home settings.",
    },
    {
      title: "Bimanual ALOHA-style demonstration data",
      source: "TRI's adoption and extension of the ALOHA bimanual teleoperation system",
      description: "Two-armed teleoperation demonstrations for precise bimanual tasks — pouring liquids, serving meals, folding laundry — using ALOHA-style low-cost hardware for scalable data collection.",
    },
    {
      title: "Kitchen activity sequences with state annotations",
      source: "TRI's household robot program targeting cooking assistance",
      description: "Complete kitchen task recordings — meal preparation, cleaning, organizing — annotated with object states (raw/cooked, clean/dirty, open/closed) and task phase boundaries for training state-aware manipulation policies.",
    },
  ],
  dataMatches: [
    {
      labNeed: "Household manipulation with deformable objects",
      claruOffering: "Custom Household Manipulation Collection",
      rationale: "Claru can collect household manipulation data in real homes across its 100+ city network — with authentic kitchens, real cloth, actual food items — providing the environmental and object diversity that lab settings cannot match.",
    },
    {
      labNeed: "Contact-rich manipulation recordings",
      claruOffering: "Manipulation Trajectory Dataset with force annotations",
      rationale: "Claru's manipulation data includes contact-rich interactions with multi-modal recordings suitable for training contact-aware policies like diffusion policy.",
    },
    {
      labNeed: "Assistive interaction data with elderly populations",
      claruOffering: "Egocentric Activity Dataset + Custom Assistive Task Collection",
      rationale: "Claru's egocentric video captures daily activities including assistance-relevant tasks, with the option for targeted collection of elderly-assistance scenarios in real homes.",
    },
    {
      labNeed: "Kitchen activity sequences with state annotations",
      claruOffering: "Egocentric Activity Dataset + Custom Kitchen Collection",
      rationale: "Claru's egocentric dataset captures real cooking and kitchen activities from first-person perspective. Targeted kitchen collection campaigns with state annotations produce the phase-labeled data diffusion policies need for long-horizon meal preparation tasks.",
    },
  ],
  keyPapers: [
    {
      id: "chi-diffusion-policy-2023",
      title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137",
    },
    {
      id: "zhao-aloha-2023",
      title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
      authors: "Zhao et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.13705",
    },
    {
      id: "ha-scaling-manip-2024",
      title: "Scaling Up and Distilling Down: Language-Guided Robot Skill Acquisition",
      authors: "Ha et al.",
      venue: "CoRL 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2307.14535",
    },
    {
      id: "chi-diffusion-policy-3d-2024",
      title: "Diffusion Policy Policy Optimization",
      authors: "Chi et al.",
      venue: "arXiv",
      year: 2024,
      url: "https://diffusion-policy.cs.columbia.edu/",
    },
    {
      id: "zhao-aloha2-2024",
      title: "ALOHA 2: An Enhanced Low-Cost Hardware for Bimanual Teleoperation",
      authors: "Zhao et al.",
      venue: "arXiv",
      year: 2024,
      url: "https://aloha-2.github.io/",
    },
    {
      id: "bharadhwaj-track2act-2024",
      title: "Track2Act: Predicting Point Tracks from Internet Videos Enables Diverse Zero-Shot Robot Manipulation",
      authors: "Bharadhwaj et al.",
      venue: "arXiv 2405.01527",
      year: 2024,
      url: "https://arxiv.org/abs/2405.01527",
    },
  ],
  technicalAnalysis:
    "TRI occupies a unique position in the robotics landscape — backed by Toyota's resources and strategic interest in aging-society solutions, they combine cutting-edge AI research with a clear deployment target: household assistive robots. Their diffusion policy work (Chi et al., 2023) has become one of the most influential approaches in robot learning, and their continued development of this framework drives specific data requirements.\n\nDiffusion policy excels at contact-rich manipulation precisely because it can model multi-modal action distributions — when there are multiple valid ways to fold a cloth or load a dishwasher, the diffusion model captures this distribution rather than averaging across modes. But this capability demands training data that contains diverse solutions to the same task. For cloth folding alone, TRI needs demonstrations showing different folding strategies, cloth types, surface conditions, and starting configurations.\n\nThe deformable object challenge is particularly data-hungry. Deformable objects — cloth, food items, flexible packaging, cables — have effectively infinite state spaces that cannot be exhaustively explored in simulation. While simulators can model simple cloth physics, the interaction between real fabric, real surfaces, and real grippers involves friction, material compliance, and draping dynamics that differ dramatically from simulation. Real-world demonstrations of deformable manipulation are irreplaceable.\n\nTRI's assistive robotics vision adds a demographic dimension to the data requirement. Robots that assist elderly individuals must understand home environments as configured by actual residents — not standardized laboratory kitchens. Medicine bottles in bathroom cabinets, groceries in varying refrigerator layouts, clothing in diverse closet configurations. Claru's ability to collect data in real homes across many locations provides the environmental authenticity that TRI's assistive vision demands.\n\nThe ALOHA bimanual system, originally developed at Stanford and adopted extensively by TRI, has become the standard hardware for scalable bimanual data collection. ALOHA's low cost (~$20K per setup) makes it practical to deploy multiple collection stations, but the data diversity is still limited by the environments where stations are placed. TRI's adoption of ALOHA-style systems creates a natural partnership with Claru's distributed collection model — deploying low-cost teleoperation rigs across Claru's collector network to generate bimanual demonstration data from diverse real-world settings.\n\nTRI's recent Track2Act work demonstrates learning manipulation from internet videos by predicting point tracks — visual correspondences that show how objects move during manipulation. This approach can leverage Claru's large-scale egocentric video as a pretraining resource, since first-person cooking and household videos naturally contain the dense manipulation observations that point-track models need.",

  metaTitle: "Training Data for Toyota Research Institute Robotics | Claru",
  metaDescription:
    "Household manipulation, deformable object, and assistive robotics data for Toyota Research Institute's diffusion policy research and home robot program.",
  primaryKeyword: "Toyota Research Institute robotics data",
  secondaryKeywords: ["TRI training data", "diffusion policy data", "household robot data", "assistive robotics data"],
  canonicalPath: "/for/toyota-research",
  h1: "Training Data for Toyota Research Institute",
  heroSubtitle:
    "TRI pioneered diffusion policy for robot manipulation. Here is how real-world household data trains the next generation of assistive robots.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Labs", href: "/for" },
    { label: "Toyota Research Institute", href: "/for/toyota-research" },
  ],
  sections: [
    {
      type: "prose",
      heading: "About Toyota Research Institute",
      paragraphs: [
        "Toyota Research Institute was established in 2015 with a $1 billion investment from Toyota Motor Corporation, making it one of the best-funded industrial AI research labs in the world. Based in Los Altos Hills, California, TRI operates research programs in robotics, autonomous driving, and materials science — each driven by Toyota's long-term strategic interests.",
        "The robotics division at TRI is led by Russ Tedrake, a former MIT professor and one of the most influential figures in robot manipulation research. Under Tedrake's leadership, TRI has produced groundbreaking work on diffusion policy, large behavior models, and scalable data collection systems. Their research has a distinctive practical focus: every project is evaluated against the question of whether it brings TRI closer to robots that can assist people in their homes.",
        "Toyota's investment in TRI is motivated by Japan's aging demographics — by 2040, over 35% of Japan's population will be over 65. Toyota sees assistive robots not as a technology experiment but as a business necessity. TRI's robotics research is ultimately aimed at creating robots that can help elderly individuals with daily tasks: cooking, cleaning, medication management, and mobility assistance in their own homes.",
      ],
    },
    {
      type: "stats",
      heading: "TRI Robotics at a Glance",
      stats: [
        { value: "$1B", label: "Initial Investment" },
        { value: "2015", label: "Founded" },
        { value: "Toyota", label: "Parent Company" },
        { value: "Diffusion", label: "Key Innovation" },
        { value: "Home", label: "Target Domain" },
      ],
    },
    {
      type: "prose",
      heading: "Research Focus and Key Projects",
      paragraphs: [
        "Diffusion policy (Chi et al., 2023) is TRI's most cited and influential contribution. The approach treats robot action generation as a denoising diffusion process — the same technique behind image generators like DALL-E — adapted to produce robot motor commands. Diffusion policy's key advantage is its ability to model multi-modal action distributions: when multiple strategies can solve a task (different ways to fold a cloth, different routes to load a dishwasher), diffusion policy captures all valid options rather than averaging them into a single wrong answer.",
        "The ALOHA bimanual teleoperation system, developed with Stanford researchers, provides TRI with a scalable data collection pipeline. ALOHA uses low-cost hardware (~$20K per setup) to enable human teleoperators to perform two-handed manipulation tasks while recording full kinematic data. TRI has deployed multiple ALOHA stations to generate bimanual demonstration data at a scale that traditional teleoperation systems cannot match.",
        "TRI's Large Behavior Model (LBM) initiative aims to scale robot learning by training on diverse datasets of human and robot behavior. Like large language models, LBMs are trained on broad data distributions and then fine-tuned for specific tasks. This approach requires massive quantities of manipulation demonstration data spanning many tasks, environments, and object types — creating a direct demand for the kind of diverse, quality-controlled data Claru provides.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Manipulation Policy Approaches",
      description: "How TRI's diffusion policy compares to other leading approaches for robot manipulation learning.",
      columns: ["Approach", "Multi-Modal Actions", "Contact-Rich Tasks", "Data Efficiency"],
      rows: [
        { "Approach": "Diffusion Policy (TRI)", "Multi-Modal Actions": "Excellent", "Contact-Rich Tasks": "Excellent", "Data Efficiency": "Moderate" },
        { "Approach": "Behavioral Cloning", "Multi-Modal Actions": "Poor (averages modes)", "Contact-Rich Tasks": "Moderate", "Data Efficiency": "Good" },
        { "Approach": "VLA Token Prediction", "Multi-Modal Actions": "Good", "Contact-Rich Tasks": "Moderate", "Data Efficiency": "Poor (needs scale)" },
        { "Approach": "Reinforcement Learning", "Multi-Modal Actions": "Good", "Contact-Rich Tasks": "Poor (needs reward)", "Data Efficiency": "Very poor" },
      ],
    },
    {
      type: "prose",
      heading: "Data Requirements Analysis",
      paragraphs: [
        "Diffusion policy's multi-modal capability creates a specific data demand: diverse solutions to the same task. Standard imitation learning datasets typically show one way to perform each task. Diffusion policy works best when training data shows multiple valid strategies — different folding techniques for the same cloth, different loading orders for the same dishwasher. This diversity requirement multiplies the data needed per task category.",
        "Deformable objects present the hardest data challenge in manipulation. A piece of cloth can be in effectively infinite configurations, and its behavior during manipulation depends on fabric type, moisture level, surface friction, and grasp location. Simulation can approximate cloth physics but misses the material-specific behaviors that determine real-world success. Each cloth type, each fabric weight, each surface material requires real-world demonstrations to train reliable policies.",
        "The assistive context demands data from real homes rather than laboratory kitchens. Elderly residents configure their homes differently from lab environments — items stored in non-standard locations, furniture arranged for mobility aids, kitchens organized according to decades of personal habit. Training data from real homes across diverse demographics and geographic regions is essential for building assistive policies that work in the homes where they will actually be deployed.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Toyota Research Institute",
      paragraphs: [
        "Claru's global collector network directly addresses TRI's household data diversity requirements. By collecting manipulation data in real homes across 100+ cities, Claru provides the environmental variety that no single lab or teleoperation facility can generate. Each home contributes unique kitchen layouts, object arrangements, lighting conditions, and surface materials.",
        "For deformable object manipulation, Claru can collect data using real fabrics, actual food items, and authentic household objects in the settings where they naturally occur. This produces training data with the material diversity and environmental authenticity that lab-collected data inherently lacks.",
        "Claru's egocentric activity dataset of 386K+ clips provides a ready-made pretraining resource for TRI's large behavior model initiative. First-person video of cooking, cleaning, and household tasks captures the manipulation patterns and task structures that assistive robots need to understand — providing broad visual grounding before fine-tuning on robot-specific demonstration data.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "chi-diffusion-policy-2023",
          title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
          authors: "Chi et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2303.04137",
        },
        {
          id: "zhao-aloha-2023",
          title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
          authors: "Zhao et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2304.13705",
        },
        {
          id: "ha-scaling-manip-2024",
          title: "Scaling Up and Distilling Down: Language-Guided Robot Skill Acquisition",
          authors: "Ha et al.",
          venue: "CoRL 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2307.14535",
        },
        {
          id: "bharadhwaj-track2act-2024",
          title: "Track2Act: Predicting Point Tracks from Internet Videos Enables Diverse Zero-Shot Robot Manipulation",
          authors: "Bharadhwaj et al.",
          venue: "arXiv 2405.01527",
          year: 2024,
          url: "https://arxiv.org/abs/2405.01527",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "What is diffusion policy and why does it need real-world data?",
      answer: "Diffusion policy (Chi et al., 2023) learns robot manipulation by modeling the distribution of successful actions using a denoising diffusion process. It excels at contact-rich tasks with multiple valid solutions. It needs diverse real-world demonstrations showing different strategies for the same task — something only achievable through data collected in varied physical environments.",
    },
    {
      question: "Why are deformable objects so challenging for robot learning?",
      answer: "Deformable objects (cloth, food, cables) have effectively infinite state spaces. Simulators model simple deformable physics but miss the friction, material compliance, and draping dynamics of real materials. Real-world demonstrations of deformable manipulation are irreplaceable because the gap between simulated and real deformable object physics remains large.",
    },
    {
      question: "How does TRI's assistive focus shape their data needs?",
      answer: "Assistive robots must work in real homes as configured by actual residents — not standardized lab environments. This means training data from real kitchens, bathrooms, and living spaces with authentic object placements and configurations. Data diversity across many homes and resident preferences is essential for robust assistance.",
    },
    {
      question: "What is the ALOHA system and how does it relate to data collection?",
      answer: "ALOHA is a low-cost (~$20K) bimanual teleoperation system that enables human operators to perform two-handed manipulation tasks while recording full kinematic data. TRI uses ALOHA stations to generate bimanual demonstration data at scale. The platform's low cost makes it practical to deploy across many collection sites, scaling data diversity alongside volume.",
    },
    {
      question: "Why does Toyota invest in assistive robotics?",
      answer: "Japan faces a severe demographic challenge — by 2040, over 35% of the population will be over 65. Toyota views assistive robots as a business necessity, not just a research experiment. TRI's robotics research aims to create robots that help elderly individuals with daily tasks in their own homes, making real-world household data essential for deployment.",
    },
  ],
  ctaHeading: "Real-World Data for Assistive Robots",
  ctaDescription: "Discuss household manipulation and assistive interaction data for TRI's robotics program.",
  relatedGlossaryTerms: ["diffusion-policy", "contact-rich-manipulation", "behavioral-cloning", "egocentric-video"],
  relatedGuidePages: ["how-to-train-a-diffusion-policy", "how-to-collect-kitchen-activity-data"],
  relatedSolutionSlugs: [],
};

export default page;
