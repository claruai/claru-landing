import type { LabPageData } from "./types";

const page: LabPageData = {
  slug: "physical-intelligence",
  companyName: "Physical Intelligence",
  companyDescription:
    "Physical Intelligence (Pi) is building foundation models for robot control. Their pi0 model is a vision-language-action generalist that can control multiple robot embodiments from a single pretrained model, trained on massive datasets of robotic manipulation and human activity data.",
  keyProducts: ["pi0 Foundation Model", "pi0-FAST"],
  researchFocus: [
    "Foundation models for robot control",
    "Cross-embodiment generalization",
    "Vision-language-action models",
    "Large-scale robot data curation",
    "Flow matching for action generation",
  ],
  dataNeedsSummary:
    "Physical Intelligence's foundation model approach is the most data-intensive strategy in robotics. pi0 requires massive, diverse datasets spanning multiple robot embodiments, task types, and environments. Their explicit goal of building a single model that works across different robots means they need data from as many embodiments and contexts as possible.",
  dataNeeds: [
    {
      title: "Cross-embodiment manipulation data",
      source: "pi0 paper demonstrating multi-robot generalization (Black et al., 2024)",
      description: "Manipulation demonstrations from diverse robot platforms — single-arm, dual-arm, mobile manipulators — to train policies that transfer across embodiments.",
    },
    {
      title: "Internet-scale human activity video",
      source: "Foundation model pretraining strategy for visual representations",
      description: "Massive quantities of diverse human activity video for pretraining visual encoders that understand physical interactions, object affordances, and spatial relationships.",
    },
    {
      title: "Language-conditioned task demonstrations",
      source: "pi0's language-conditioned control capabilities",
      description: "Robot demonstrations paired with natural language instructions across hundreds of distinct tasks, enabling zero-shot generalization to novel instructions.",
    },
    {
      title: "Dexterous manipulation with multi-finger hands",
      source: "Pi's research direction toward dexterous manipulation policies",
      description: "Demonstrations of complex multi-finger manipulation — tool use, in-hand reorientation, precision assembly — from dexterous robot hands and human hand recordings with finger-level tracking.",
    },
    {
      title: "Long-horizon household and industrial tasks",
      source: "pi0 evaluation suite including multi-step laundry folding and table bussing",
      description: "Complete recordings of extended manipulation sequences — laundry folding, dish loading, table clearing, kit assembly — where task success depends on planning across dozens of sequential manipulation primitives.",
    },
  ],
  dataMatches: [
    {
      labNeed: "Cross-embodiment manipulation data",
      claruOffering: "Manipulation Trajectory Dataset + Custom Multi-Robot Collection",
      rationale: "Claru's manipulation data spans multiple recording setups and interaction types. Custom collection campaigns can target specific robot embodiments to fill coverage gaps in Pi's training distribution.",
    },
    {
      labNeed: "Internet-scale human activity video",
      claruOffering: "Egocentric Activity Dataset (~386K clips)",
      rationale: "Claru's curated egocentric dataset provides high-quality, annotated human activity data that is more useful for pretraining than raw internet video — with temporal annotations, activity labels, and object-level ground truth.",
    },
    {
      labNeed: "Language-conditioned task demonstrations",
      claruOffering: "Custom Language-Paired Data Collection",
      rationale: "Claru can coordinate collection campaigns where diverse tasks are performed with concurrent natural language narration, producing the language-action pairs Pi needs for instruction following.",
    },
    {
      labNeed: "Long-horizon household and industrial tasks",
      claruOffering: "Egocentric Activity Dataset + Custom Long-Horizon Collection",
      rationale: "Claru's egocentric recordings capture complete multi-step household and workplace tasks. Targeted campaigns can collect specific long-horizon task sequences with standardized annotation for planning model training.",
    },
  ],
  keyPapers: [
    {
      id: "black-pi0-2024",
      title: "pi0: A Vision-Language-Action Flow Model for General Robot Control",
      authors: "Black et al.",
      venue: "arXiv 2410.24164",
      year: 2024,
      url: "https://arxiv.org/abs/2410.24164",
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
      id: "team-octo-2024",
      title: "Octo: An Open-Source Generalist Robot Policy",
      authors: "Team Octo",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2405.12213",
    },
    {
      id: "pertsch-pi0-fast-2025",
      title: "Fast and Transferable Robot Action Tokenization",
      authors: "Pertsch et al.",
      venue: "arXiv 2501.02572",
      year: 2025,
      url: "https://arxiv.org/abs/2501.02572",
    },
    {
      id: "brohan-rt2-2023",
      title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2307.15818",
    },
    {
      id: "lipson-flow-matching-2023",
      title: "Flow Matching for Generative Modeling",
      authors: "Lipman et al.",
      venue: "ICLR 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2210.02747",
    },
  ],
  technicalAnalysis:
    "Physical Intelligence represents the most ambitious data bet in robotics. Their pi0 model is designed as a foundation model for robot control — a single pretrained model that can be fine-tuned to control any robot embodiment for any task. This is the GPT moment for robotics, and like language models, it demands data at a scale that dwarfs previous robot learning efforts.\n\nThe pi0 architecture combines a vision encoder pretrained on internet-scale data, a language model for instruction understanding, and an action decoder trained on robot manipulation data. This hybrid approach means Pi needs three distinct data streams: visual pretraining data (human activities, object interactions), language-action pairs (instructions matched to demonstrations), and multi-embodiment robot data (manipulation recordings from diverse platforms).\n\nThe cross-embodiment requirement is particularly challenging. For pi0 to generalize across robots with different kinematic structures, sensor configurations, and action spaces, the training data must span this variety. The Open X-Embodiment dataset provides a starting point, but its coverage is biased toward tabletop manipulation with single-arm robots. Pi needs data from humanoids, mobile manipulators, dual-arm systems, and specialized end-effectors to achieve true generalization.\n\npi0's use of flow matching for action generation is a technical distinction with data implications. Unlike diffusion-based approaches that model the noise-to-action process, flow matching learns a direct velocity field that maps from noise to actions. This architecture can learn multi-modal action distributions effectively — critical for tasks where multiple strategies are valid — but it requires training data that demonstrates this variety. For cloth folding, this means demonstrations showing different folding strategies; for object placement, different valid locations and orientations.\n\nClaru's role in this ecosystem is providing the curated, annotated data that raw internet scraping cannot. While Pi can harvest millions of hours of YouTube video for visual pretraining, the robot-relevant subset — close-up manipulation, task completion, physical interactions — requires human curation and annotation. Claru's purpose-collected datasets with temporal annotations, object labels, and activity segmentation provide significantly higher training signal per frame than uncurated internet video.\n\nThe pi0-FAST follow-up introduced a more efficient action tokenization that speeds inference while maintaining quality. This architecture improvement does not reduce data requirements — it makes the model faster to run but not cheaper to train. The data bottleneck remains the binding constraint on foundation model quality.",

  metaTitle: "Training Data for Physical Intelligence (Pi) & pi0 | Claru",
  metaDescription:
    "Cross-embodiment manipulation, human activity video, and language-conditioned data for Physical Intelligence's pi0 foundation model for robot control.",
  primaryKeyword: "Physical Intelligence training data",
  secondaryKeywords: ["pi0 training data", "robot foundation model data", "cross-embodiment data", "VLA model training data"],
  canonicalPath: "/for/physical-intelligence",
  h1: "Training Data for Physical Intelligence",
  heroSubtitle:
    "Physical Intelligence is building the GPT of robotics. Here is how diverse, curated real-world data feeds the pi0 foundation model.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Labs", href: "/for" },
    { label: "Physical Intelligence", href: "/for/physical-intelligence" },
  ],
  sections: [
    {
      type: "prose",
      heading: "About Physical Intelligence",
      paragraphs: [
        "Physical Intelligence was founded in 2024 by a team of robotics and AI researchers including Karol Hausman (formerly Google DeepMind), Sergey Levine (UC Berkeley), Chelsea Finn (Stanford), and Brian Ichter (Google DeepMind). The founding team represents some of the most cited researchers in robot learning, having authored foundational papers on RT-2, diffusion policy, and cross-embodiment learning.",
        "The company raised over $400 million in funding before publishing its first paper, reflecting investor conviction that foundation models for robotics are the next major AI frontier. Physical Intelligence's core bet is that the same scaling laws that produced GPT-4 and DALL-E apply to robot control — given enough diverse data and model capacity, a single foundation model can learn to control any robot.",
        "Pi's first public model, pi0, demonstrated cross-embodiment control across multiple robot platforms from a single pretrained checkpoint. The model handles single-arm tabletop manipulation, dual-arm bimanual tasks, and mobile manipulation using the same architecture and weights — differentiated only by fine-tuning on embodiment-specific data. The follow-up pi0-FAST model introduced faster action tokenization for real-time deployment.",
      ],
    },
    {
      type: "stats",
      heading: "Physical Intelligence at a Glance",
      stats: [
        { value: "2024", label: "Founded" },
        { value: "$400M+", label: "Total Funding" },
        { value: "pi0", label: "Foundation Model" },
        { value: "Multi", label: "Robot Embodiments" },
        { value: "Flow", label: "Action Generation" },
      ],
    },
    {
      type: "prose",
      heading: "Research Focus and Key Projects",
      paragraphs: [
        "pi0 uses a vision-language-action architecture where a pretrained vision-language model is augmented with an action generation head based on flow matching. The flow matching approach models actions as continuous trajectories rather than discrete tokens, enabling smooth and multi-modal action generation. This is particularly important for manipulation tasks where multiple valid strategies exist — the model can represent all of them rather than collapsing to a single average behavior.",
        "The cross-embodiment capability of pi0 is achieved through a unified action representation that abstracts over specific robot kinematics. During pretraining, the model sees demonstrations from multiple robot platforms and learns to associate visual observations and language instructions with actions independent of the specific robot morphology. Fine-tuning on embodiment-specific data then maps this general understanding to particular joint configurations.",
        "The Octo model, developed by several Pi founders while at UC Berkeley, served as a precursor to pi0. Octo is an open-source generalist robot policy trained on the Open X-Embodiment dataset that demonstrated cross-embodiment transfer was feasible. Pi0 scales this approach with proprietary data, larger model capacity, and the flow matching action generation architecture.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Robot Foundation Model Approaches",
      description: "How Physical Intelligence's pi0 compares to other robot foundation model efforts.",
      columns: ["Model", "Developer", "Action Generation", "Cross-Embodiment"],
      rows: [
        { "Model": "pi0", "Developer": "Physical Intelligence", "Action Generation": "Flow matching", "Cross-Embodiment": "Yes (multi-robot)" },
        { "Model": "RT-2", "Developer": "Google DeepMind", "Action Generation": "Token prediction", "Cross-Embodiment": "Single robot" },
        { "Model": "Octo", "Developer": "UC Berkeley", "Action Generation": "Diffusion", "Cross-Embodiment": "Yes (open-source)" },
        { "Model": "RT-X", "Developer": "X-Embodiment Collab.", "Action Generation": "Token prediction", "Cross-Embodiment": "Yes (22 robots)" },
      ],
    },
    {
      type: "prose",
      heading: "Data Requirements Analysis",
      paragraphs: [
        "Pi0's data requirements are defined by three concurrent scaling pressures: visual pretraining scale (billions of images and video frames), language-action pairing scale (millions of instruction-demonstration pairs), and cross-embodiment scale (demonstration data from dozens of robot platforms). These three dimensions multiply — more embodiments times more tasks times more environments creates a combinatorial data demand.",
        "The quality bar for Pi's training data is also higher than for typical VLA research. Flow matching learns smooth action trajectories, which means training demonstrations must be temporally consistent and kinematically valid. Noisy or choppy demonstrations degrade flow matching quality more than they would degrade discrete action prediction. This favors purpose-collected, quality-controlled data over scraped internet content.",
        "Long-horizon tasks represent an emerging data frontier for Pi. The pi0 evaluation suite includes laundry folding and table bussing — tasks that require dozens of sequential manipulation primitives coordinated over minutes. Training models for these extended tasks requires demonstration data that captures the full task arc including error detection, recovery, and adaptive replanning.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Physical Intelligence",
      paragraphs: [
        "Claru provides three data streams that map directly to pi0's architecture. For visual pretraining, Claru's egocentric activity dataset offers 386K+ curated clips with temporal annotations — higher training signal than equivalent volumes of uncurated internet video. For language-action pairing, Claru can coordinate narrated collection campaigns where collectors describe their actions in natural language while performing manipulation tasks.",
        "For cross-embodiment data, Claru's collection network can deploy standardized recording protocols across different robot platforms and locations simultaneously. This enables coordinated multi-embodiment data collection at a scale that academic collaborations (like Open X-Embodiment) struggle to sustain beyond initial collection efforts.",
        "The quality control dimension is equally important. Claru's collection protocols enforce consistent recording quality — stable camera positions, adequate lighting, complete task execution, and verified annotations — producing the kinematically clean data that flow matching architectures require for effective training.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "black-pi0-2024",
          title: "pi0: A Vision-Language-Action Flow Model for General Robot Control",
          authors: "Black et al.",
          venue: "arXiv 2410.24164",
          year: 2024,
          url: "https://arxiv.org/abs/2410.24164",
        },
        {
          id: "pertsch-pi0-fast-2025",
          title: "Fast and Transferable Robot Action Tokenization",
          authors: "Pertsch et al.",
          venue: "arXiv 2501.02572",
          year: 2025,
          url: "https://arxiv.org/abs/2501.02572",
        },
        {
          id: "team-octo-2024",
          title: "Octo: An Open-Source Generalist Robot Policy",
          authors: "Team Octo",
          venue: "RSS 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2405.12213",
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
      question: "Why does Physical Intelligence need so much training data?",
      answer: "pi0 is a foundation model for robot control — it must learn physics, object properties, task structure, and motor control from data rather than hand-coded rules. Like language models, this generalist approach requires orders of magnitude more data than task-specific systems. Cross-embodiment generalization further multiplies the data requirement.",
    },
    {
      question: "What makes curated data better than internet video for pi0?",
      answer: "While internet video provides broad visual pretraining, robot-relevant content — close-up manipulation, task completion, physical interactions — is a small fraction. Curated datasets with temporal annotations, object labels, and activity segmentation provide significantly higher training signal per frame than uncurated video scraped at scale.",
    },
    {
      question: "How does cross-embodiment data work?",
      answer: "Cross-embodiment training data comes from multiple robot platforms with different kinematic structures, sensors, and action spaces. This diversity forces the model to learn embodiment-agnostic representations of manipulation — understanding what to do (pick up the cup) separately from how to do it (specific joint angles for each robot).",
    },
    {
      question: "What is flow matching and why does it matter for data quality?",
      answer: "Flow matching generates robot actions by learning a continuous velocity field from noise to actions, producing smooth trajectories. This requires temporally consistent training demonstrations — jerky or noisy recordings degrade flow matching quality more than discrete action prediction. Purpose-collected data with stable recording setups outperforms scraped content for this architecture.",
    },
    {
      question: "How does pi0 differ from Google DeepMind's RT-2?",
      answer: "Both are VLA models, but pi0 uses flow matching for continuous action generation (RT-2 uses discrete token prediction), pi0 trains on multi-embodiment data from day one (RT-2 was single-robot), and pi0 targets commercial deployment across many robot platforms (RT-2 is primarily a research model). Pi0's approach requires more diverse training data but produces more broadly capable policies.",
    },
  ],
  ctaHeading: "Fuel the Robot Foundation Model",
  ctaDescription: "Discuss diverse, curated training data for Physical Intelligence's pi0 foundation model.",
  relatedGlossaryTerms: ["vla", "cross-embodiment-data", "foundation-model-robotics", "pi-zero"],
  relatedGuidePages: ["how-to-build-a-cross-embodiment-dataset", "how-to-create-action-labels-for-vla"],
  relatedSolutionSlugs: [],
};

export default page;
