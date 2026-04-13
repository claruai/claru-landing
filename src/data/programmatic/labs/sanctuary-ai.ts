import type { LabPageData } from "./types";

const page: LabPageData = {
  slug: "sanctuary-ai",
  companyName: "Sanctuary AI",
  companyDescription:
    "Sanctuary AI is building Phoenix, a general-purpose humanoid robot with industry-leading dexterous hands. The company's Carbon AI system aims to replicate human-like intelligence for manipulation-heavy tasks, with a focus on retail, logistics, and manufacturing applications.",
  keyProducts: ["Phoenix Gen 7"],
  researchFocus: [
    "Dexterous hand manipulation",
    "General-purpose task learning",
    "Teleoperation-based data collection at scale",
    "Embodied AI with human-like hand dexterity",
    "Autonomous task decomposition and execution",
  ],
  dataNeedsSummary:
    "Sanctuary AI's emphasis on dexterous hands — Phoenix has the most human-like hand design among commercial humanoids — creates acute demand for fine-grained manipulation data. Their Carbon AI system needs demonstrations of precision grasping, in-hand manipulation, and bimanual coordination at a scale that only distributed data collection can provide.",
  dataNeeds: [
    {
      title: "Fine-grained dexterous manipulation",
      source: "Sanctuary AI emphasis on human-like hand dexterity and Carbon AI",
      description: "Precision grasping, in-hand manipulation, and finger-level coordination demonstrations with multi-camera and tactile sensor recordings.",
    },
    {
      title: "Retail and commercial task demonstrations",
      source: "Sanctuary AI deployment targets in retail and logistics",
      description: "Task demonstrations for retail scenarios — shelf stocking, product sorting, package handling — captured in real store environments.",
    },
    {
      title: "Bimanual coordination sequences",
      source: "Phoenix's dual-arm design and task requirements",
      description: "Two-handed task demonstrations where both hands coordinate — opening containers, folding items, assembling products — with synchronized multi-modal recordings.",
    },
    {
      title: "Tool use and object manipulation with articulated grippers",
      source: "Phoenix's articulated hand design enabling tool use unlike simplified grippers",
      description: "Demonstrations of using everyday tools — scissors, screwdrivers, tongs, pens — where the high-DOF hand must adapt grip configuration to tool geometry and apply task-appropriate force profiles.",
    },
    {
      title: "Teleoperation demonstration data with haptic feedback",
      source: "Sanctuary AI's teleoperation pipeline for Carbon AI training",
      description: "High-fidelity teleoperation recordings with synchronized haptic feedback, capturing the teleoperator's force intentions alongside the robot's executed motions for learning compliant manipulation policies.",
    },
  ],
  dataMatches: [
    {
      labNeed: "Fine-grained dexterous manipulation",
      claruOffering: "Custom Dexterous Manipulation Collection",
      rationale: "Claru can coordinate collection campaigns focused on precision grasping and in-hand manipulation tasks using multi-camera setups that capture the finger-level detail needed for dexterous policy learning.",
    },
    {
      labNeed: "Retail and commercial task demonstrations",
      claruOffering: "Egocentric Activity Dataset + Custom Retail Collection",
      rationale: "Claru's existing activity video covers retail-adjacent scenarios, with targeted collection campaigns in partner retail environments for domain-specific training data.",
    },
    {
      labNeed: "Bimanual coordination sequences",
      claruOffering: "Manipulation Trajectory Dataset with bimanual annotations",
      rationale: "Claru's manipulation data includes multi-arm coordination recordings with temporal synchronization — critical for learning bimanual policies where timing and force distribution between hands matters.",
    },
    {
      labNeed: "Tool use and object manipulation with articulated grippers",
      claruOffering: "Egocentric Activity Dataset + Custom Tool Use Collection",
      rationale: "Claru's egocentric dataset captures real humans using everyday tools from a first-person perspective. Targeted tool-use collection campaigns can produce the high-detail, multi-angle recordings that dexterous tool manipulation policies require.",
    },
  ],
  keyPapers: [
    {
      id: "sanctuary-carbon-2024",
      title: "Carbon: A General-Purpose AI Control System for Humanoid Robots",
      authors: "Sanctuary AI",
      venue: "Company Technical Overview",
      year: 2024,
      url: "https://sanctuary.ai/resources/",
    },
    {
      id: "shaw-dexterous-2023",
      title: "Learning Dexterous Manipulation from Human Demonstrations",
      authors: "Shaw et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.04547",
    },
    {
      id: "chen-dexhand-2023",
      title: "Visual Dexterity: In-Hand Reorientation of Novel Objects",
      authors: "Chen et al.",
      venue: "ICRA 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2211.11744",
    },
    {
      id: "qi-hand-teleop-2023",
      title: "General In-Hand Object Rotation with Vision and Touch",
      authors: "Qi et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2309.09979",
    },
    {
      id: "arunachalam-dexterous-2023",
      title: "Holo-Dex: Teaching Dexterity with Immersive Mixed Reality",
      authors: "Arunachalam et al.",
      venue: "ICRA 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2210.06463",
    },
    {
      id: "mandikal-dexvip-2022",
      title: "DexVIP: Learning Dexterous Grasping with Human Hand Pose Priors",
      authors: "Mandikal and Grauman",
      venue: "CoRL 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2202.00164",
    },
  ],
  technicalAnalysis:
    "Sanctuary AI has made a deliberate bet on dexterity. While other humanoid companies use simplified grippers or two-finger claws, Phoenix features highly articulated hands designed to match human dexterity. This design decision unlocks a broader range of manipulation tasks but creates a proportionally larger data requirement — dexterous manipulation in a 20+ DOF hand space requires far more demonstrations than simple parallel-jaw grasping.\n\nThe Carbon AI control system is designed to learn from human demonstrations at scale. Sanctuary operates a teleoperation pipeline where human operators control Phoenix remotely, generating training data with every shift. However, the diversity of demonstrations is limited by the number and variety of teleoperation environments. A single teleoperation studio produces data from one physical setting — the same table, the same objects, the same lighting.\n\nClaru's distributed collection network addresses this diversity gap directly. By coordinating collectors across 100+ locations to perform standardized manipulation tasks with local objects and environments, Claru can provide the environmental variety that single-site teleoperation cannot. Each collector location contributes unique surface textures, object geometries, lighting conditions, and workspace configurations.\n\nThe retail deployment context adds another dimension. Shelf stocking, product sorting, and package handling in real stores involve objects with diverse geometries, materials, and weights — from fragile glass bottles to heavy canned goods. Training data must capture this product diversity across different store layouts and shelf configurations. Claru's ability to collect data in actual retail environments provides the authentic visual and physical context that laboratory mockups cannot replicate.\n\nPhoenix's articulated hands also enable tool use — a capability that most humanoids with simple grippers cannot attempt. Using scissors, operating a screwdriver, holding tongs, or writing with a pen requires the hand to adapt its grip configuration to the tool geometry and apply force profiles specific to each tool's mechanics. Training this capability requires demonstrations of diverse tool use tasks, a data type that barely exists in current robot learning datasets.\n\nThe 7th generation Phoenix robot represents Sanctuary's latest hardware iteration, with improved actuators, lighter weight, and enhanced sensory feedback. Each hardware generation shifts the optimal training data distribution slightly, as new actuator capabilities enable previously impossible manipulation strategies. This creates an ongoing need for fresh training data that exploits the latest hardware capabilities.",

  metaTitle: "Training Data for Sanctuary AI's Phoenix Humanoid | Claru",
  metaDescription:
    "Dexterous manipulation, retail task, and bimanual coordination data for Sanctuary AI's Phoenix humanoid robot and Carbon AI control system.",
  primaryKeyword: "Sanctuary AI training data",
  secondaryKeywords: ["Phoenix humanoid data", "dexterous manipulation data", "Carbon AI training", "retail robot data"],
  canonicalPath: "/for/sanctuary-ai",
  h1: "Training Data for Sanctuary AI",
  heroSubtitle:
    "Sanctuary AI's Phoenix has the most dexterous hands in commercial humanoid robotics. Here is how real-world data trains those hands to work.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Labs", href: "/for" },
    { label: "Sanctuary AI", href: "/for/sanctuary-ai" },
  ],
  sections: [
    {
      type: "prose",
      heading: "About Sanctuary AI",
      paragraphs: [
        "Sanctuary AI was founded in 2018 in Vancouver, Canada, with the mission of creating the world's first human-like intelligence in general-purpose robots. The company's core thesis is that human-level dexterity is a prerequisite for general-purpose robotics — robots that cannot match human hand capabilities will always be limited to a narrow subset of useful tasks.",
        "Phoenix, now in its 7th generation, is designed around this dexterity-first principle. The robot features highly articulated hands with 20+ degrees of freedom, capable of precision pinch grasps, power grasps, and in-hand manipulation. This hand design is paired with Carbon, Sanctuary's proprietary AI control system that learns manipulation policies from human teleoperator demonstrations.",
        "Sanctuary AI has raised over $175 million in funding and operates teleoperator facilities where human pilots remotely control Phoenix robots to generate training data. The company has announced deployment partnerships with Magna International for automotive manufacturing and with several retail chains for store operations.",
      ],
    },
    {
      type: "stats",
      heading: "Sanctuary AI at a Glance",
      stats: [
        { value: "2018", label: "Founded" },
        { value: "20+ DOF", label: "Hand Dexterity" },
        { value: "Phoenix 7", label: "Current Generation" },
        { value: "$175M+", label: "Total Funding" },
        { value: "Canada", label: "Headquarters" },
      ],
    },
    {
      type: "prose",
      heading: "Research Focus and Key Projects",
      paragraphs: [
        "Sanctuary's research centers on the Carbon AI system — the control intelligence that maps visual observations to dexterous motor commands. Carbon is trained primarily through imitation learning from teleoperation data. Human operators wear haptic gloves and use motion tracking to control Phoenix remotely, and every teleoperation session generates training data that improves Carbon's autonomous capabilities.",
        "The teleoperation-to-autonomy pipeline is Sanctuary's key technical differentiator. Rather than training in simulation and transferring to real robots, Sanctuary collects real-world data through teleoperation and trains directly on these demonstrations. This avoids the sim-to-real gap entirely for manipulation tasks, but it means the quality and diversity of teleoperation data directly determine model capability.",
        "Recent work has focused on scaling Carbon's task repertoire beyond single manipulation primitives to multi-step task sequences. Stocking a shelf, for example, involves perceiving the target location, selecting the product, grasping it appropriately for its shape and weight, navigating to the shelf, and placing it with the correct orientation. Each step requires different dexterity skills, and the planning across steps adds a cognitive dimension beyond pure motor control.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Humanoid Hand Dexterity Comparison",
      description: "How Phoenix's hand design compares to other commercial humanoid robots.",
      columns: ["Robot", "Hand DOF", "Grip Types", "Tool Use", "Tactile Feedback"],
      rows: [
        { "Robot": "Phoenix (Sanctuary)", "Hand DOF": "20+", "Grip Types": "Precision + power + pinch", "Tool Use": "Yes", "Tactile Feedback": "Yes" },
        { "Robot": "Figure 02", "Hand DOF": "16", "Grip Types": "Power + precision", "Tool Use": "Limited", "Tactile Feedback": "Partial" },
        { "Robot": "Atlas (BD)", "Hand DOF": "12", "Grip Types": "Power + pinch", "Tool Use": "Limited", "Tactile Feedback": "No" },
        { "Robot": "Digit (Agility)", "Hand DOF": "N/A", "Grip Types": "Parallel jaw only", "Tool Use": "No", "Tactile Feedback": "No" },
      ],
    },
    {
      type: "prose",
      heading: "Data Requirements Analysis",
      paragraphs: [
        "Phoenix's 20+ DOF hands create a high-dimensional action space that requires significantly more training data than simplified grippers. A parallel-jaw gripper has 1-2 DOF and needs only open/close decisions. Phoenix's hand must coordinate 20+ joints simultaneously for each grasp, with force requirements varying by finger and by task phase. This dimensionality explosion means that thousands of demonstrations of a given task type may be needed where a simple gripper requires only dozens.",
        "The environmental diversity challenge is compounded by Sanctuary's teleoperation model. Each teleoperation studio is a fixed physical environment — the same room, the same table, the same set of objects. Training data from a single studio produces policies that work well in that studio but struggle to generalize to novel environments with different lighting, surfaces, and objects. Overcoming this requires either building many studios (expensive) or augmenting teleoperation data with demonstrations from diverse real-world environments.",
        "Retail and logistics tasks add product-level diversity to the data requirement. A store contains thousands of unique products with different shapes, weights, materials, and packaging. Phoenix must handle fragile glass bottles alongside heavy canned goods, flexible produce bags alongside rigid boxes. Training data must cover this product diversity to produce reliable manipulation policies for real store deployment.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Sanctuary AI",
      paragraphs: [
        "Claru directly addresses Sanctuary's environmental diversity bottleneck. While Sanctuary's teleoperation studios produce high-quality demonstrations in controlled settings, Claru's distributed collection network provides the environmental variety needed for generalization. Collectors in real homes, stores, warehouses, and offices perform standardized manipulation tasks with locally available objects, producing demonstrations across hundreds of distinct environments.",
        "For retail-specific data, Claru can deploy collectors in actual store environments to capture product handling, shelf stocking, and sorting tasks with real merchandise. This provides the authentic visual and physical conditions — store lighting, shelf configurations, real product packaging — that laboratory mockups cannot replicate.",
        "Claru's egocentric activity dataset also serves as a pretraining resource for Carbon. First-person video of humans performing dexterous tasks — cooking, cleaning, crafting, tool use — captures the hand-object interaction patterns that Phoenix's dexterous hands are designed to replicate. This visual pretraining data helps Carbon understand task structure and object affordances before fine-tuning on robot-specific demonstrations.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "sanctuary-carbon-2024",
          title: "Carbon: A General-Purpose AI Control System for Humanoid Robots",
          authors: "Sanctuary AI",
          venue: "Company Technical Overview",
          year: 2024,
          url: "https://sanctuary.ai/resources/",
        },
        {
          id: "shaw-dexterous-2023",
          title: "Learning Dexterous Manipulation from Human Demonstrations",
          authors: "Shaw et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2304.04547",
        },
        {
          id: "arunachalam-dexterous-2023",
          title: "Holo-Dex: Teaching Dexterity with Immersive Mixed Reality",
          authors: "Arunachalam et al.",
          venue: "ICRA 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2210.06463",
        },
        {
          id: "mandikal-dexvip-2022",
          title: "DexVIP: Learning Dexterous Grasping with Human Hand Pose Priors",
          authors: "Mandikal and Grauman",
          venue: "CoRL 2022",
          year: 2022,
          url: "https://arxiv.org/abs/2202.00164",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Why does Phoenix's dexterous hand design require more training data?",
      answer: "Phoenix's 20+ DOF hands create a high-dimensional action space for manipulation. Unlike simple grippers with 1-2 DOF, dexterous hands need demonstrations that cover finger-level coordination, in-hand manipulation, precision grasping, and force distribution — requiring orders of magnitude more demonstration data to train reliable policies.",
    },
    {
      question: "How does Sanctuary AI currently collect training data?",
      answer: "Sanctuary operates a teleoperation pipeline where human operators remotely control Phoenix, generating training data during each session. However, this single-site approach limits environmental diversity. Distributed data collection across many locations provides the variety needed for policies that generalize beyond the teleoperation studio.",
    },
    {
      question: "What retail-specific data does Phoenix need?",
      answer: "Phoenix needs demonstrations of shelf stocking, product sorting, and package handling in real store environments with diverse products (varying shapes, weights, materials, fragility). Training data must cover different store layouts, shelf configurations, and product categories to enable reliable retail deployment.",
    },
    {
      question: "Can Phoenix use tools unlike other humanoid robots?",
      answer: "Yes. Phoenix's 20+ DOF articulated hands can adapt grip configuration to different tool geometries — holding scissors, operating screwdrivers, using tongs. Most competing humanoids with simplified grippers cannot perform tool use. Training this capability requires demonstrations of diverse tool interactions, a data type that barely exists in current robot learning datasets.",
    },
    {
      question: "Why does environmental diversity matter more for teleoperation-trained robots?",
      answer: "Robots trained through teleoperation learn directly from real demonstrations — avoiding the sim-to-real gap but inheriting the environmental biases of the teleoperation studio. If all training data comes from one room with one set of objects, the policy overfits to those conditions. Diverse real-world data from many environments is essential to break this overfitting.",
    },
  ],
  ctaHeading: "Train Phoenix's Dexterous Hands",
  ctaDescription: "Discuss fine-grained manipulation data for Sanctuary AI's humanoid robot platform.",
  relatedGlossaryTerms: ["dexterous-manipulation", "hand-object-interaction", "behavioral-cloning", "teleoperation-data"],
  relatedGuidePages: ["how-to-collect-dexterous-manipulation-data", "how-to-annotate-hand-object-interactions"],
  relatedSolutionSlugs: [],
};

export default page;
