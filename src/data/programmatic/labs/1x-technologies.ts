import type { LabPageData } from "./types";

const page: LabPageData = {
  slug: "1x-technologies",
  companyName: "1X Technologies",
  companyDescription:
    "1X Technologies (formerly Halodi Robotics) builds androids designed for everyday work. Founded in 2014 in Moss, Norway, the company has relocated its AI headquarters to Sunnyvale, California and raised over $125 million from investors including OpenAI, EQT Ventures, Samsung NEXT, and Tiger Global. Their EVE wheeled humanoid is deployed in commercial security and logistics, while the NEO bipedal humanoid — priced at $20,000 for early access — targets consumer households with deliveries beginning in 2026. VP of AI Eric Jang, formerly of Google Brain, has been one of the field's most vocal advocates for the thesis that robot intelligence is fundamentally a data scaling problem.",
  keyProducts: [
    "EVE (wheeled humanoid, commercial deployment)",
    "NEO (bipedal humanoid, consumer, $20K)",
    "World Model (learned physics simulator)",
    "Redwood AI (vision-language robot controller)",
  ],
  researchFocus: [
    "Large-scale teleoperation data collection",
    "End-to-end imitation learning from human demonstrations",
    "Learned world models for physical prediction",
    "Domestic and commercial task generalization",
    "Neural network-based whole-body control",
  ],
  dataNeedsSummary:
    "1X's approach to robot intelligence centers on massive data collection — they have explicitly stated that data volume is the primary bottleneck for android intelligence. VP of AI Eric Jang's widely-read essay 'All You Need Is Data' argues that sufficiently diverse demonstration data, combined with modern neural network architectures, can produce android intelligence without hand-engineered control. Their NEO humanoid needs diverse demonstrations of household tasks, egocentric video for visual pretraining and world model training, and multi-environment recordings to achieve the generalization required for consumer deployment across millions of unique homes.",
  dataNeeds: [
    {
      title: "Large-scale teleoperation demonstrations across diverse homes",
      source: "1X VP of AI Eric Jang's 'All You Need Is Data' essay and public statements, 2024",
      description:
        "Thousands of hours of teleoperated task demonstrations across diverse household and commercial environments, with full sensor recordings including RGB, depth, proprioception, and force feedback. Must span hundreds of distinct physical environments to match the diversity of consumer homes where NEO will deploy.",
    },
    {
      title: "Household activity video for World Model pretraining",
      source: "NEO product positioning and 1X World Model architecture description",
      description:
        "First-person and third-person video of humans performing common household tasks — cleaning, organizing, cooking, laundry, setting tables — to train the World Model that serves as 1X's learned physics simulator. The World Model predicts future visual states from current observations and proposed actions, requiring video that captures how objects and environments change during manipulation.",
    },
    {
      title: "Multi-environment object interaction data for generalization",
      source: "1X research publications and Eric Jang's data scaling presentations",
      description:
        "Object manipulation recordings captured across many different physical environments — varying kitchen layouts, living rooms, bedrooms, offices — to train policies that generalize beyond the training distribution. The consumer deployment target means NEO must handle objects and environments it has never seen in training data.",
    },
    {
      title: "Language-grounded demonstrations for Redwood AI",
      source: "1X Redwood AI announcement and NEO product demonstrations",
      description:
        "Manipulation and navigation demonstrations paired with natural language instructions for training the Redwood AI vision-language model that controls NEO in real time. Instructions must span the full range of household commands a consumer might issue, from simple ('pick up that cup') to compositional ('put the dishes from the counter into the dishwasher').",
    },
    {
      title: "Long-horizon task recordings spanning multi-step activities",
      source: "NEO domestic assistance target applications",
      description:
        "Complete recordings of multi-step household activities (e.g., preparing a meal from start to cleanup, doing a full load of laundry, organizing a room) that capture task dependencies, state tracking, and error recovery. Consumer household tasks are inherently long-horizon, requiring policies that maintain context across minutes of execution.",
    },
  ],
  dataMatches: [
    {
      labNeed: "Large-scale teleoperation demonstrations across diverse homes",
      claruOffering: "Manipulation Trajectory Dataset + Custom Multi-Home Collection",
      rationale:
        "Claru's existing manipulation trajectories plus custom teleoperation campaigns leverage a distributed collector network that operates in their own homes — producing data with authentic residential diversity across 100+ cities. This provides parallel data collection across dozens of environments simultaneously, matching 1X's data scaling philosophy.",
    },
    {
      labNeed: "Household activity video for World Model pretraining",
      claruOffering: "Egocentric Activity Dataset (~386K clips)",
      rationale:
        "Claru's egocentric dataset contains 386K+ clips of human activities in real environments with temporal annotations and activity labels. The dataset captures how objects, scenes, and environments change during manipulation — exactly the visual dynamics that 1X's World Model needs to predict. This provides a substantial pretraining corpus without requiring robot-specific data collection.",
    },
    {
      labNeed: "Multi-environment object interaction data for generalization",
      claruOffering: "Cross-environment Data Collection Campaigns",
      rationale:
        "Claru's presence in 100+ cities means object interaction data can be collected across diverse home layouts, furniture styles, kitchen configurations, and cultural contexts. Each collector's home is a unique environment, producing the distributional breadth that consumer deployment demands — different countertops, different appliances, different household objects, different lighting.",
    },
    {
      labNeed: "Language-grounded demonstrations for Redwood AI",
      claruOffering: "Custom Language-Paired Data Collection",
      rationale:
        "Claru's annotation pipeline pairs demonstrations with diverse natural language instructions written by human annotators. Multiple phrasings per task provide the instruction diversity that Redwood AI's language backbone needs for robust understanding of natural consumer commands.",
    },
    {
      labNeed: "Long-horizon task recordings spanning multi-step activities",
      claruOffering: "Custom Long-Horizon Activity Collection",
      rationale:
        "Claru can coordinate collection campaigns where collectors perform complete multi-step household activities — full cooking sequences, complete laundry cycles, room organization sessions — in their own homes. These recordings capture authentic task dependencies, temporal structure, and the natural variation of real domestic workflows.",
    },
  ],
  keyPapers: [
    {
      id: "jang-data-2024",
      title: "All You Need Is Data",
      authors: "Jang, E.",
      venue: "1X Technologies Blog",
      year: 2024,
      url: "https://www.1x.tech/discover/all-you-need-is-data",
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
      id: "chi-diffusion-policy-2023",
      title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137",
    },
    {
      id: "black-pi0-2024",
      title: "pi-zero: A Vision-Language-Action Flow Model for General Robot Control",
      authors: "Black et al.",
      venue: "arXiv 2410.24164",
      year: 2024,
      url: "https://arxiv.org/abs/2410.24164",
    },
    {
      id: "brohan-rt2-2023",
      title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2307.15818",
    },
  ],
  technicalAnalysis:
    "1X Technologies has been more explicit than any other humanoid company about the centrality of data to their approach. VP of AI Eric Jang — formerly a research scientist at Google Brain where he worked on robotic grasping and reinforcement learning — has publicly argued that the path to android intelligence is fundamentally a data problem. In his widely-read essay 'All You Need Is Data,' Jang argued that given sufficient demonstrations of human behavior, neural networks can learn the visuomotor policies needed for general-purpose robots. This philosophy drives their massive teleoperation infrastructure and creates an insatiable demand for diverse, high-quality demonstration data.\n\nThe technical architecture behind 1X's approach relies on two key components. The World Model is a learned simulator that predicts future visual states from current observations and proposed actions. Rather than hand-building physics engines to predict how the world behaves, 1X trains neural networks on video data to learn these predictions implicitly. This approach requires massive quantities of video showing physical interactions in diverse environments — the exact kind of data that purpose-built collection campaigns produce more efficiently than web scraping. Redwood AI is a vision-language model that processes camera feeds and natural language instructions to generate robot control signals in real time. Together, these systems allow NEO to understand verbal commands, visually perceive its environment, predict the consequences of actions, and execute physical tasks.\n\nThe end-to-end imitation learning pipeline maps directly from visual observations to motor commands without decomposing robot behavior into separate perception, planning, and control modules. This architectural choice means the network must implicitly learn physics, object properties, spatial relationships, and task structure entirely from raw demonstrations — demanding orders of magnitude more training data than modular systems where each component can be trained on different data types.\n\nNEO's target domain — consumer household assistance — is the most data-hungry deployment context imaginable. Homes vary enormously in layout, furniture, object placement, lighting, and cultural norms. A robot that can fold laundry in one apartment needs demonstrations across different clothing types, folding surfaces, laundry room configurations, and home environments to generalize reliably. The long tail of household variation — regional appliance differences, cultural norms around food preparation, idiosyncratic organization systems — is essentially infinite. No amount of data from a single teleoperation studio can cover this variation.\n\nThe consumer price point creates additional pressure. At $20,000, NEO must work reliably out of the box in each customer's unique home environment. Unlike industrial robots that can be professionally calibrated for a specific workspace, consumer robots face immediate deployment in unknown environments. This requires either exhaustive pretraining data that covers the full distribution of home environments, or extremely efficient adaptation mechanisms that can customize behavior with minimal local data. 1X is betting on the former approach — and that bet requires data at unprecedented scale and diversity.\n\nAs 1X scales from hundreds to thousands of deployed NEO units, each robot operating in a unique home becomes both a deployment endpoint and a potential data collection node. But bootstrapping this fleet requires initial training data from diverse homes before deployment — a chicken-and-egg problem that external data collection partnerships solve directly.",

  metaTitle: "Training Data for 1X Technologies' NEO & EVE Robots | Claru",
  metaDescription:
    "How large-scale demonstration data, egocentric video, and multi-environment recordings support 1X Technologies' data-driven approach to android intelligence.",
  primaryKeyword: "1X Technologies training data",
  secondaryKeywords: ["NEO robot data", "1X data collection", "android training data", "teleoperation data at scale"],
  canonicalPath: "/for/1x-technologies",
  h1: "Training Data for 1X Technologies",
  heroSubtitle:
    "1X Technologies believes data is the bottleneck for android intelligence. Here is how purpose-collected real-world data accelerates their path to general-purpose robots.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Labs", href: "/for" },
    { label: "1X Technologies", href: "/for/1x-technologies" },
  ],
  sections: [
    {
      type: "prose",
      heading: "About 1X Technologies",
      paragraphs: [
        "1X Technologies, formerly Halodi Robotics, was founded in 2014 in Moss, Norway and has since relocated its AI headquarters to Sunnyvale, California. The company's VP of AI, Eric Jang — a former Google Brain research scientist whose work on robotic grasping and reinforcement learning was among the most cited in the field — has been one of the most vocal advocates for the thesis that robot intelligence is fundamentally a data problem. In his widely-read essay 'All You Need Is Data,' Jang argued that sufficiently diverse demonstration data, combined with modern neural network architectures, can produce android intelligence without hand-engineered control.",
        "The company's flagship NEO humanoid was launched for Early Access pre-order in October 2025 at $20,000, with U.S. deliveries beginning in 2026. NEO is designed as the world's first consumer-ready humanoid robot built for everyday living — targeting household tasks like cooking assistance, cleaning, organizing, and companionship. The company's EVE platform, a wheeled humanoid, has been deployed in commercial settings for security patrol and light logistics, serving as both a revenue generator and a data collection platform.",
        "1X has raised over $125 million from investors including OpenAI (their first investment in a physical AI company), EQT Ventures, Samsung NEXT, Tiger Global, and the Norwegian sovereign wealth fund. The OpenAI investment is particularly significant as it signals alignment between 1X's data-centric robot learning approach and OpenAI's broader vision for physical AI. The company plans to deploy thousands of robots in 2025, tens of thousands in 2026, and scale to hundreds of thousands by 2027.",
      ],
    },
    {
      type: "stats",
      heading: "1X Technologies at a Glance",
      stats: [
        { value: "2014", label: "Founded (as Halodi)" },
        { value: "$125M+", label: "Total Funding" },
        { value: "NEO", label: "Flagship Humanoid" },
        { value: "$20K", label: "NEO Price" },
        { value: "World Model", label: "Core AI Architecture" },
        { value: "2026", label: "Consumer Deliveries" },
      ],
    },
    {
      type: "prose",
      heading: "Research Focus and Data Philosophy",
      paragraphs: [
        "1X's approach is distinctive in the humanoid industry for its explicit data-centrism. Rather than investing primarily in simulation-first pipelines like many competitors, 1X collects real-world data directly from its robot fleet and dedicated teleoperation studios. 'We collect a large, diverse set of robot data with our humanoids, both Eve and NEO,' Jang has explained. 'We train a robotic foundation model that captures all kinds of knowledge about the world, and then we turn that into a helpful assistant.'",
        "The World Model architecture represents 1X's bet on learned simulation. Rather than hand-building physics engines to predict how objects behave when pushed, lifted, or dropped, 1X trains neural networks on video data to learn these predictions implicitly. The World Model observes the current state of the environment (camera images, proprioceptive readings) and a proposed action, then predicts the resulting future state. This learned simulation is used for planning — the robot can mentally simulate multiple action sequences and choose the one most likely to achieve the goal. Training this model requires enormous quantities of video showing how physical interactions change the state of the world across diverse environments.",
        "The Redwood AI system serves as NEO's real-time controller — a vision-language model that processes camera feeds and natural language instructions to generate robot actions. This system enables the conversational human-robot interaction that 1X has demonstrated: a user can tell NEO to 'set the table for dinner' and the robot breaks this into subtasks, perceives the current state of the kitchen, and executes the necessary manipulation and navigation sequences.",
      ],
    },
    {
      type: "comparison-table",
      heading: "1X vs. Other Consumer-Oriented Humanoid Companies",
      description: "How 1X's approach compares to competitors targeting consumer and commercial markets.",
      columns: ["Dimension", "1X Technologies", "Figure AI", "Tesla Optimus", "Unitree H1"],
      rows: [
        { Dimension: "Target Market", "1X Technologies": "Consumer homes first", "Figure AI": "Manufacturing + logistics", "Tesla Optimus": "Tesla factories first", "Unitree H1": "Research + developer" },
        { Dimension: "Price Point", "1X Technologies": "$20K (NEO)", "Figure AI": "Enterprise pricing", "Tesla Optimus": "Target <$20K at scale", "Unitree H1": "~$90K" },
        { Dimension: "AI Philosophy", "1X Technologies": "Data scaling > algorithms", "Figure AI": "VLA w/ OpenAI", "Tesla Optimus": "FSD-derived stack", "Unitree H1": "Open platform" },
        { Dimension: "Data Strategy", "1X Technologies": "Massive teleop collection", "Figure AI": "Helix VLA training", "Tesla Optimus": "Factory fleet learning", "Unitree H1": "Community-driven" },
        { Dimension: "Key Investor", "1X Technologies": "OpenAI", "Figure AI": "Microsoft, NVIDIA", "Tesla Optimus": "Tesla-funded", "Unitree H1": "Public company" },
      ],
    },
    {
      type: "prose",
      heading: "Data Requirements Analysis",
      paragraphs: [
        "NEO's consumer deployment context makes environmental diversity the critical data challenge. Homes vary enormously in layout, furniture, object placement, lighting, and cultural norms. A robot that can fold laundry in one apartment needs thousands of demonstrations across different clothing types, folding surfaces, and home configurations to generalize reliably. Single-site teleoperation studios produce data from one environment — the same room, the same objects, the same lighting. This fundamental mismatch between single-site data and multi-environment deployment is the core problem that distributed data collection solves.",
        "The egocentric video dimension is equally critical. 1X uses video of human activities to pretrain visual encoders and the World Model — teaching the AI to understand the spatial structure of manipulation tasks, the physical dynamics of object interactions, and the temporal progression of multi-step activities before fine-tuning on robot-specific data. Purpose-collected, annotated human activity video provides dramatically higher training signal per frame than raw internet video — with temporal annotations, activity labels, and object-level ground truth that make pretraining more sample-efficient.",
        "The long-horizon task challenge is unique to consumer household applications. Industrial robots perform repetitive short-horizon tasks (pick, place, weld). Household tasks are inherently long-horizon: cooking a meal involves retrieving ingredients, washing vegetables, chopping, cooking, plating, and cleaning up — a 20-30 minute sequence with dozens of subtasks, each requiring different manipulation skills. Training policies for these long-horizon tasks requires complete episode recordings with temporal annotations marking subtask boundaries, state changes, and error recovery moments.",
        "As 1X scales from hundreds to thousands of deployed NEO units, each robot operating in a unique home environment becomes both a deployment and a data collection opportunity. But bootstrapping this fleet requires initial training data from diverse homes before deployment — a chicken-and-egg problem that external data collection solves directly.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports 1X Technologies",
      paragraphs: [
        "Claru's distributed collector network spanning 100+ cities directly addresses 1X's environmental diversity bottleneck. Collectors operating in their own homes produce manipulation and activity data with authentic residential diversity — different furniture, different kitchens, different household objects, different cultural contexts — that single-site teleoperation studios cannot provide. This is not incremental improvement; it is a categorical difference in data distribution that directly translates to better generalization for deployed robots.",
        "Claru's existing egocentric activity dataset of 386K+ clips provides a substantial pretraining corpus for 1X's World Model and visual encoders. The dataset captures human activities in real environments with temporal annotations and activity labels, offering significantly higher training signal per frame than uncurated internet video. This data directly supports the learned physics simulation that 1X's World Model architecture requires — showing how objects move, deform, and interact when humans manipulate them.",
        "For language-grounded demonstrations, Claru can coordinate collection campaigns where diverse household tasks are performed with concurrent natural language narration, producing the language-action pairs that 1X's Redwood AI system needs for instruction-following capabilities in NEO. Multiple phrasings per task type — 'clean the counter,' 'wipe down the kitchen surface,' 'make the countertop clean' — provide the instruction diversity that robust language grounding requires.",
      ],
    },
    {
      type: "cards",
      heading: "Core Data Requirements",
      cards: [
        {
          title: "Teleoperation Demonstrations",
          description: "Thousands of hours of teleoperated task demonstrations across diverse home environments with full multi-modal sensor recordings.",
          icon: "🎮",
        },
        {
          title: "Household Activity Video",
          description: "First-person and third-person video of domestic tasks — cleaning, cooking, organizing — for World Model pretraining and task understanding.",
          icon: "🏠",
        },
        {
          title: "Environmental Diversity",
          description: "Object manipulation data collected across hundreds of different homes and commercial spaces to train generalizable consumer-grade policies.",
          icon: "🌐",
        },
        {
          title: "Language-Grounded Demonstrations",
          description: "Task demonstrations paired with diverse natural language descriptions for Redwood AI's instruction-following capabilities.",
          icon: "🗣️",
        },
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "jang-data-2024",
          title: "All You Need Is Data",
          authors: "Jang, E.",
          venue: "1X Technologies Blog",
          year: 2024,
          url: "https://www.1x.tech/discover/all-you-need-is-data",
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
          id: "chi-diffusion-policy-2023",
          title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
          authors: "Chi et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2303.04137",
        },
        {
          id: "black-pi0-2024",
          title: "pi-zero: A Vision-Language-Action Flow Model for General Robot Control",
          authors: "Black et al.",
          venue: "arXiv 2410.24164",
          year: 2024,
          url: "https://arxiv.org/abs/2410.24164",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Why does 1X Technologies prioritize data volume over algorithmic innovation?",
      answer: "VP of AI Eric Jang argues that robot intelligence is fundamentally a data scaling problem, not an algorithm problem. Their end-to-end imitation learning approach requires the network to implicitly learn physics, object properties, and task structure from raw demonstrations — which demands orders of magnitude more data than modular systems. More diverse demonstrations from more environments directly translate to better generalization. The scaling laws that govern language models apply similarly to robot policies: performance improves predictably with more diverse training data.",
    },
    {
      question: "What kind of data does NEO need for household tasks?",
      answer: "NEO needs teleoperated demonstrations of common household tasks (cleaning, cooking, organizing) collected across many different homes with varying layouts, furniture, and object placement. It also needs egocentric video of humans performing these tasks for World Model pretraining, language-paired demonstrations for Redwood AI instruction following, and long-horizon activity recordings that capture multi-step task dependencies.",
    },
    {
      question: "What is 1X's World Model and why does it need data?",
      answer: "The World Model is a learned physics simulator — a neural network that predicts future visual states from current observations and proposed actions. Instead of hand-coding physics rules, it learns physical dynamics from video data. The World Model needs massive quantities of video showing how objects and environments change during physical interactions: pushing objects, opening containers, pouring liquids, folding fabric. More diverse video from more environments produces more accurate physical predictions.",
    },
    {
      question: "How does the $20,000 NEO price affect data requirements?",
      answer: "The consumer price point means NEO must work reliably in unknown home environments without professional calibration. Unlike industrial robots that operate in controlled, pre-mapped workspaces, NEO faces immediate deployment in homes it has never seen. This requires pretraining data diverse enough to cover the full distribution of consumer home environments — or extremely efficient adaptation mechanisms. 1X is betting on the data-scaling approach, which demands training data from hundreds to thousands of distinct residential environments.",
    },
    {
      question: "How can Claru help scale 1X's data collection?",
      answer: "Claru operates a global network of 10,000+ data collectors across 100+ cities who can perform standardized data collection in their own homes and local environments. This provides the environmental diversity and collection throughput that single-site teleoperation studios cannot achieve. Each collector's home is a unique data collection environment — different furniture, appliances, layouts, lighting — matching 1X's philosophy that more data from more environments is the path to consumer-grade robot generalization.",
    },
  ],
  ctaHeading: "Scale 1X's Data Collection Pipeline",
  ctaDescription: "Discuss how Claru's global collector network can accelerate android intelligence through purpose-built demonstration data.",
  relatedGlossaryTerms: ["imitation-learning", "teleoperation-data", "cross-embodiment-data", "behavioral-cloning", "world-model"],
  relatedGuidePages: ["how-to-collect-teleoperation-data", "how-to-build-a-manipulation-dataset"],
  relatedSolutionSlugs: [],
};

export default page;
