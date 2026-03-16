import type { ContentPageData } from "./types";

const egocentricVideoData: ContentPageData = {
  // -- Identity & SEO --
  slug: "egocentric-video-data",
  title: "Custom Egocentric Video Data Collection for Embodied AI",
  metaTitle: "Egocentric Video Data for Embodied AI | Claru",
  metaDescription:
    "Egocentric video data collected at scale for robotics and world models. 386K+ clips across 3 pipelines with same-day QA. Compare Ego4D, EgoScale, EgoDex, and Claru.",
  primaryKeyword: "egocentric video data",
  secondaryKeywords: [
    "first-person video dataset",
    "egocentric video collection",
    "embodied AI training data",
    "robot learning video data",
    "wearable camera dataset",
    "egocentric manipulation data",
  ],
  breadcrumbLabel: "Egocentric Video Data",
  ogCategory: "solution",

  // -- Hero --
  heroSubtitle:
    "Frontier robotics and world-model research demands massive volumes of first-person video showing natural human behavior in diverse real-world environments. Public datasets top out at thousands of hours with fixed activity distributions. Custom collection closes the gap between what open data provides and what your model actually needs.",

  // -- Problem Section --
  problem: {
    heading: "Why Is Egocentric Video Data Critical for Embodied AI?",
    sections: [
      {
        heading:
          "What Makes Egocentric Video Data Critical for Robot Learning?",
        content:
          "Egocentric video data captures the world from the perspective of the actor performing a task, providing the visual grounding that embodied AI models need to connect perception with action. Unlike third-person footage, first-person video preserves the spatial relationships between hands, tools, and objects as they appear during manipulation. Ego4D demonstrated this at scale with 3,670 hours of egocentric footage from 931 participants across 74 worldwide locations, establishing benchmarks for episodic memory, hand-object interaction, and social understanding. EgoScale extended the paradigm further, training a VLA model on 20,854 hours of action-labeled egocentric human video and identifying a log-linear scaling law between data scale and dexterous manipulation performance. The consistent finding across these benchmarks is that egocentric perspective is not a stylistic choice but a structural requirement: models trained on third-person video systematically fail to predict hand-object contact timing, grasp pose, and tool orientation from a first-person viewpoint.",
        citationIds: ["ego4d-2022", "egoscale-2025"],
      },
      {
        heading:
          "Why Do Public Egocentric Datasets Fall Short for Frontier Research?",
        content:
          "Public egocentric datasets provide broad coverage but lack the specificity that frontier labs require. Ego4D covers 74 locations but was not designed for robotic manipulation; its activity distribution skews toward passive observation rather than fine-grained hand interactions. EgoDex addresses hand pose with 829 hours of footage and 25-joint hand annotations across 194 tasks, but its environment diversity is constrained to controlled indoor settings. The DROID dataset offers 76,000 robot manipulation trajectories across 564 scenes, yet its 350 hours of paired video represent a fraction of what large-scale policy training consumes. Open X-Embodiment aggregated over 1 million trajectories from 22 robot platforms but remains, by the authors' own assessment, constrained within naive short-horizon tasks. For a lab training world models or general-purpose manipulation policies, no single public dataset delivers the combination of scale, environment diversity, activity granularity, and annotation depth required. The result is a data procurement problem masquerading as a data availability problem.",
        citationIds: [
          "egodex-2025",
          "droid-2024",
          "open-x-embodiment-2024",
        ],
      },
      {
        heading:
          "How Does Data Quality Affect Egocentric Model Performance?",
        content:
          "Data quality in egocentric video is not a single metric but a composite of frame-level properties: resolution, stability, field of view, temporal coverage of manipulation phases, and consistency of capture angle relative to the task workspace. EgoScale's scaling law shows that validation loss decreases predictably as egocentric data volume grows, and that this loss reduction correlates with real robot performance — meaning data quality and volume jointly determine downstream policy quality. EgoDex demonstrated that hand-pose annotation quality directly determines downstream grasp prediction accuracy, with 25-joint per-hand annotations at 30 fps providing substantially better supervision than coarse bounding-box labels. Claru enforces quality at the capture level through automated upload-time validation of resolution, duration, orientation, and file integrity, followed by same-day human QA. In the egocentric video collection project, this pipeline processed 386,000+ clips from approximately 500 contributors with same-day turnaround, catching quality issues before they propagated into delivered batches.",
        citationIds: ["egoscale-2025", "egodex-2025"],
      },
    ],
  },

  // -- Landscape / Comparison --
  landscape: {
    heading:
      "How Do Open Egocentric Datasets Compare to Custom Collection?",
    description:
      "The table below compares major public egocentric video datasets against Claru custom collection. Scale, environment diversity, and activity granularity vary widely. Public datasets serve as pre-training foundations; custom collection fills the distribution gaps specific to your research agenda.",
    datasets: [
      {
        name: "Ego4D",
        scale: "3,670 hours, 931 participants",
        tasks: "Episodic memory, hand-object interaction, social understanding, forecasting",
        environments: "74 locations across 9 countries; kitchens, workshops, outdoor",
        limitations:
          "Activity distribution skews toward passive observation; not designed for fine-grained manipulation; fixed annotation schema",
        isClaru: false,
      },
      {
        name: "EgoScale",
        scale: "20,854 hours of action-labeled egocentric video",
        tasks: "Dexterous manipulation VLA pretraining; log-linear scaling law identification",
        environments: "Diverse egocentric human video including wrist motion and retargeted dexterous hand actions",
        limitations:
          "Focused on dexterous manipulation transfer; limited to wrist/hand tasks; not a general-purpose activity benchmark",
        isClaru: false,
      },
      {
        name: "EgoDex",
        scale: "829 hours, 194 tasks",
        tasks: "Bimanual hand-object interaction, 25-joint hand pose tracking",
        environments: "Controlled indoor settings; limited environment diversity",
        limitations:
          "Indoor-only capture; constrained to research lab environments; fixed task set",
        isClaru: false,
      },
      {
        name: "DROID",
        scale: "76K trajectories, 350 hours, 564 scenes",
        tasks: "Robot manipulation with paired video and action labels",
        environments: "Research labs and structured workspaces across 13 institutions, 50 data collectors",
        limitations:
          "Robot-centric (not human egocentric); limited to lab environments; fixed robot morphologies (Franka Panda only)",
        isClaru: false,
      },
      {
        name: "Claru Custom",
        scale: "386K+ clips, ~500 contributors, 3 parallel pipelines",
        tasks: "Configurable per engagement: manipulation, locomotion, cooking, driving, workplace tasks across 10 categories",
        environments: "Global coverage; real homes, workplaces, outdoor; 10 workplace categories including barista, carpentry, tailoring",
        limitations:
          "Requires engagement lead time (days to launch, 1-2 week calibration); not a public benchmark",
        isClaru: true,
      },
    ],
  },

  // -- Solution Section --
  solution: {
    heading:
      "How Does Claru Collect Research-Grade Egocentric Video at Scale?",
    sections: [
      {
        heading:
          "What Is the Three-Pipeline Architecture for Egocentric Capture?",
        content:
          "Claru operates three parallel capture pipelines, each optimized for different data requirements. The first pipeline deploys GoPro and DJI wearable cameras for high-fidelity, wide-angle egocentric capture of manipulation tasks, cooking, and locomotion, producing 219,000+ clips. The second pipeline uses smartphone cameras for rapid, high-volume capture of everyday activities across diverse environments, producing 155,000+ clips. The third pipeline targets specific activity categories with structured task instructions, producing 12,000+ precisely labeled clips covering actions like pouring, cutting, assembling, folding, and fastening. This architecture means each stream can be independently tuned: GoPro footage for high-fidelity manipulation, smartphone for environmental diversity, activity-specific for rare interaction types. In Claru's workplace egocentric data project, the smartphone pipeline extended into 10 real workplace categories including barista stations, carpentry workshops, and tailoring studios, capturing 4K video at 60 fps during normal business operations.",
        citationIds: [],
      },
      {
        heading:
          "How Does Same-Day QA Maintain Annotation-Ready Quality?",
        content:
          "Quality assurance at Claru runs within 24 hours of every submission. Automated checks at upload time validate resolution, duration, orientation, and file integrity before clips enter the annotation pipeline. An in-house QA team then runs continuous validation on flagged submissions, providing specific remediation instructions to contributors. Real-time dashboards enable dynamic rebalancing across geographies and activity types as research priorities shift. The structured activity taxonomy used by Claru was co-developed through three iterative revision cycles, testing draft categories against real captured footage to resolve gaps and ambiguities. The final taxonomy organized activities by environment (kitchen, workshop, outdoor), motor complexity (gross motor, fine manipulation, locomotion), and interaction type (tool use, object transfer, environmental navigation). Every clip is annotated with structured activity classifications and enriched metadata including environment type, lighting conditions, number of objects involved, and interaction complexity score.",
        citationIds: [],
      },
      {
        heading:
          "How Does Claru Scale Contributor Networks Globally?",
        content:
          "Claru maintains a contributor network of approximately 500 global participants with onboarding taking under 48 hours per contributor. The operational model delivers weekly batches feeding the lab's training pipeline continuously, compressing the research iteration cycle from months to days. In the egocentric video collection engagement, requirements evolved week by week, with updated task instructions pushed to contributors within 48 hours of specification changes. The workplace egocentric data program demonstrated that real businesses can serve as scalable data sources through a side-revenue model: 10 workplace categories across multiple countries, with workers capturing footage during normal workflow using standard smartphones. Geographic and demographic diversity across contributors reduces the distribution shift between training data and real-world deployment, addressing a core limitation of lab-collected datasets like DROID (13 institutions, Franka-only hardware) and EgoDex (controlled indoor settings).",
        citationIds: ["droid-2024", "egodex-2025"],
      },
    ],
  },

  // -- Case Studies --
  caseStudySlugs: ["egocentric-video-collection", "workplace-egocentric-data"],

  // -- Dataset Showcase --
  datasetIds: [],

  // -- FAQ --
  faqs: [
    {
      question:
        "How much egocentric video data do I need to train an embodied AI model?",
      answer:
        "Scale requirements depend on task complexity and model architecture. EgoScale identified a log-linear scaling law between egocentric human video volume and dexterous manipulation performance, training on 20,854 hours to validate that validation loss correlates with real robot success rates. Claru's egocentric collection projects have delivered 386K+ clips. For manipulation policies, hundreds of hours of task-specific footage paired with structured annotations typically outperform thousands of hours of unstructured video.",
    },
    {
      question:
        "What capture hardware does Claru use for egocentric video collection?",
      answer:
        "Claru runs three parallel capture pipelines with different hardware. GoPro and DJI wearable cameras provide high-fidelity wide-angle capture for manipulation and locomotion tasks. Standard smartphones enable rapid high-volume capture with zero hardware logistics, producing 4K video at 60 fps. The choice of hardware per pipeline is driven by the research specification rather than a one-size-fits-all approach.",
    },
    {
      question:
        "How does custom egocentric data differ from public datasets like Ego4D?",
      answer:
        "Public datasets like Ego4D provide broad pre-training coverage with 3,670 hours across 74 locations, but their activity distributions and annotation schemas are fixed. Custom collection through Claru targets the specific activity types, environments, and annotation formats your model requires. Task instructions, quality thresholds, and activity taxonomies are configured per engagement and updated weekly as research priorities shift.",
    },
    {
      question:
        "How quickly can Claru start collecting egocentric video data?",
      answer:
        "Claru launches production capture pipelines within days of engagement. The core infrastructure for contributor onboarding, capture apps, QA pipelines, and delivery formatting is reusable across pipeline types. A 1-2 week calibration phase translates your research specifications into contributor instructions and QA criteria. After calibration, weekly delivery batches begin feeding your training pipeline continuously.",
    },
    {
      question:
        "Can egocentric video data be collected in real workplace environments?",
      answer:
        "Yes. Claru's workplace egocentric data program captured first-person video across 10 real workplace categories including barista stations, carpentry workshops, tailoring studios, and screen printing studios. Workers recorded during normal business operations using standard smartphones with minimal disruption. This approach captures the improvisation, physical constraints, and contextual decision-making absent from staged lab environments.",
    },
  ],

  // -- Research Citations --
  citations: [
    {
      id: "ego4d-2022",
      title:
        "Ego4D: Around the World in 3,000 Hours of Egocentric Video",
      authors: "Grauman et al.",
      venue: "CVPR 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2110.07058",
      keyClaim:
        "3,670 hours of egocentric video from 931 participants across 74 locations, establishing benchmarks for episodic memory, hand-object interaction, and social understanding.",
    },
    {
      id: "egoscale-2025",
      title:
        "EgoScale: Scaling Dexterous Manipulation with Diverse Egocentric Human Data",
      authors: "Zheng et al.",
      venue: "arXiv 2025",
      year: 2025,
      url: "https://arxiv.org/abs/2602.16710",
      keyClaim:
        "Trained a VLA model on 20,854 hours of action-labeled egocentric human video; identified a log-linear scaling law between human data scale and downstream dexterous manipulation performance.",
    },
    {
      id: "egodex-2025",
      title:
        "EgoDex: Learning Dexterous Manipulation from Large-Scale Egocentric Video",
      authors: "Li et al.",
      venue: "arXiv 2025",
      year: 2025,
      url: "https://arxiv.org/abs/2505.11709",
      keyClaim:
        "829 hours of egocentric footage with 25-joint per-hand annotations across 194 bimanual tasks, enabling dexterous manipulation policy learning from human demonstrations.",
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
        "76,000 robot manipulation trajectories totaling 350 hours across 564 scenes and 13 institutions (50 data collectors), all on Franka Panda hardware.",
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
        "Aggregated 1M+ trajectories from 22 robot platforms but remains constrained within naive short-horizon tasks, highlighting the gap between data aggregation and task complexity.",
    },
  ],

  // -- Internal Linking --
  pillarLinks: ["/pillars/acquire/egocentric-video"],

  // -- Related Content Pages --
  relatedSlugs: [
    "vla-training-data",
    "manipulation-trajectory-data",
    "sim-to-real-data",
  ],
};

export default egocentricVideoData;
