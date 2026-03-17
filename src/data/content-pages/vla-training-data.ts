import type { ContentPageData } from "./types";

const vlaTrainingData: ContentPageData = {
  // -- Identity & SEO --
  slug: "vla-training-data",
  title: "VLA Training Data: From Collection to Policy",
  metaTitle: "VLA Training Data: Collection to Policy | Claru",
  metaDescription:
    "VLA training data for vision-language-action models. Compare Open X-Embodiment, DROID, and AgiBot World. Claru delivers custom data with 386K+ clips and 10K+ hours.",
  primaryKeyword: "VLA training data",
  secondaryKeywords: [
    "vision-language-action model data",
    "VLA model training",
    "robot policy training data",
    "embodied AI training dataset",
    "action-labeled video data",
    "multimodal robot data",
  ],
  breadcrumbLabel: "VLA Training Data",
  ogCategory: "solution",

  // -- Hero --
  heroSubtitle:
    "Vision-language-action models need paired observation-action data at scales that no single public dataset provides. The bottleneck for VLA research is not architecture or compute but the cost and complexity of collecting diverse, action-labeled demonstrations across real-world environments.",
  videoSrc: "/videos/sol-vla.mp4",

  // -- Problem Section --
  problem: {
    heading: "Why Is Training Data the Bottleneck for VLA Models?",
    sections: [
      {
        heading:
          "Why Is Training Data the Bottleneck for VLA Models?",
        content:
          "Vision-language-action models combine visual perception, language understanding, and physical action generation into a single architecture. Training these models requires data that pairs first-person video with both natural language instructions and ground-truth action sequences. OpenVLA demonstrated that a 7-billion parameter VLA trained on diverse demonstration data outperformed RT-2-X (55 billion parameters) by 16.5% on manipulation benchmarks, proving that data quality and diversity matter more than model scale. RT-2 showed that web-scale vision-language pre-training improves robot policy generalization by 3x, but only when fine-tuned on task-specific demonstrations. The recurring finding is that VLA performance scales with the diversity and precision of action-labeled training data, not with model size or pre-training corpus alone.",
        citationIds: ["openvla-2024", "rt2-2023"],
      },
      {
        heading:
          "What Makes VLA Training Data Different from Standard Video Datasets?",
        content:
          "Standard video datasets provide visual frames without the action labels that VLA models consume. VLA training requires synchronized triplets: visual observation, language instruction, and the action taken at each timestep. Octo was trained on 800,000 trajectories from 25 datasets and outperformed prior generalist baselines by 52%, but the authors noted that cross-dataset action space inconsistency remained a primary source of policy failure. Open X-Embodiment aggregated over 1 million trajectories from 22 robot platforms, yet the authors acknowledged that the collection remains constrained within naive short-horizon tasks. The pi-zero architecture introduced flow matching for continuous action generation, achieving strong results on dexterous manipulation, but required high-quality demonstrations with sub-frame temporal alignment between visual and action streams. These architectural advances share a common dependency: the model is only as capable as the action-labeled data it trains on.",
        citationIds: [
          "octo-2024",
          "open-x-embodiment-2024",
          "pi0-2024",
        ],
      },
      {
        heading:
          "How Do Current Open Datasets Limit VLA Generalization?",
        content:
          "Open VLA datasets suffer from three structural limitations. First, environment diversity is shallow: DROID spans 564 scenes across 13 institutions, but these are overwhelmingly research labs with standardized table-top setups. Second, action space representations vary across datasets, making cross-dataset training lossy. Octo addressed this by tokenizing actions into a shared representation, but at the cost of action precision for tasks requiring sub-centimeter accuracy. Third, task horizon is constrained: Open X-Embodiment's million trajectories are predominantly short-horizon pick-and-place operations, providing minimal supervision for multi-step manipulation sequences. GR00T N1, NVIDIA's open foundation model, requires a heterogeneous data pyramid with consistent action labeling across embodiments — the model's dual-system architecture is sensitive to label consistency. For labs building general-purpose VLA policies, these gaps mean that public data serves as a pre-training foundation but cannot replace task-specific, environment-specific custom collection.",
        citationIds: [
          "droid-2024",
          "octo-2024",
          "groot-n15-2025",
        ],
      },
    ],
  },

  // -- Landscape / Comparison --
  landscape: {
    heading:
      "How Do Open VLA Datasets Compare to Custom Training Data?",
    description:
      "The table below compares the major open datasets used for VLA training against Claru custom collection. Scale alone does not determine VLA performance; action label quality, environment diversity, and task horizon are equally critical.",
    datasets: [
      {
        name: "Open X-Embodiment",
        scale: "1M+ trajectories, 22 robot platforms",
        tasks: "Short-horizon manipulation; pick-and-place, pushing, stacking",
        environments: "Research labs across multiple institutions; standardized setups",
        limitations:
          "Constrained within naive short-horizon tasks; inconsistent action spaces across platforms; limited environment diversity",
        isClaru: false,
      },
      {
        name: "DROID",
        scale: "76K trajectories, 350 hours, 564 scenes",
        tasks: "Table-top manipulation with paired video and action labels",
        environments: "13 institutions; predominantly research lab table-top setups",
        limitations:
          "Lab-centric environments; fixed robot morphologies; limited to manipulation",
        isClaru: false,
      },
      {
        name: "AgiBot World",
        scale: "1M+ trajectories, 100+ real-world scenes",
        tasks: "Mobile manipulation, navigation, household tasks",
        environments: "Real-world indoor environments; kitchens, living rooms, offices",
        limitations:
          "Single robot platform; fixed action space; geographically constrained",
        isClaru: false,
      },
      {
        name: "Claru Custom",
        scale: "386K+ video clips, 10K+ hours game data, ~500 contributors",
        tasks: "Configurable: manipulation, locomotion, cooking, workplace tasks, synchronized observation-action pairs",
        environments: "Global real-world coverage; homes, 10 workplace categories, outdoor; diverse demographics",
        limitations:
          "Requires engagement lead time (days to launch, 1-2 week calibration); not a public benchmark",
        isClaru: true,
      },
    ],
  },

  // -- Solution Section --
  solution: {
    heading:
      "How Does Claru Build VLA Training Datasets from Scratch?",
    sections: [
      {
        heading:
          "How Does Multi-Pipeline Collection Serve VLA Data Requirements?",
        content:
          "VLA models require both visual diversity and action precision. Claru addresses this through parallel collection pipelines purpose-built for different data modalities. The egocentric video pipeline delivers first-person footage at scale: 386,000+ clips across three parallel streams (GoPro wearable, smartphone, and activity-specific capture) from approximately 500 global contributors. The synchronized observation-action pipeline, demonstrated in Claru's game-based data capture project, delivers paired video and timestamped control data with sub-16ms temporal alignment, producing 10,000+ hours of synchronized gameplay and input data with zero data loss incidents. This dual capability means Claru can supply both the broad visual pre-training data that models like RT-2 consume and the precise action-labeled demonstrations that architectures like pi-zero require for fine-tuning.",
        citationIds: ["rt2-2023", "pi0-2024"],
      },
      {
        heading:
          "How Does Claru Ensure Action Label Quality for Policy Training?",
        content:
          "Action label quality determines whether a VLA model can execute the behaviors demonstrated in training data. OpenVLA showed that 7B parameters with high-quality demonstrations outperform 55B parameters with noisier data by 16.5%. Claru's QA pipeline enforces label quality at multiple stages. In the egocentric video collection project, every clip passed automated validation of resolution, duration, and metadata completeness at upload time, followed by same-day human QA review. In the game-based capture project, a custom-built application maintained frame-level temporal alignment via a shared monotonic clock with microsecond precision, validated by replaying logged inputs against recorded footage. The structured activity taxonomy co-developed with research teams through three iterative revision cycles ensures consistent labeling across contributors. Claru's labeling interface enforces taxonomy compliance at the UI level, preventing the free-text annotation drift that degrades cross-contributor consistency.",
        citationIds: ["openvla-2024"],
      },
      {
        heading:
          "How Does Real-World Environment Diversity Improve VLA Generalization?",
        content:
          "GR00T N1 is trained on a heterogeneous data pyramid combining real-robot trajectories, human videos, and synthetic data, but its dual-system architecture requires consistent, high-quality demonstrations across embodiments to generalize to novel settings. Claru's collection programs specifically target the environment diversity gap that lab-collected datasets cannot fill. The workplace egocentric data project captured first-person video across 10 real workplace categories (barista, carpentry, tailoring, furniture assembly, screen printing, phone repair, and more) spanning multiple countries. Workers captured 4K video at 60 fps during normal business operations using standard smartphones. This approach produces training data containing the improvisation, physical constraints, and contextual decision-making that staged environments systematically exclude. For VLA models, this diversity translates directly to improved zero-shot generalization in unseen environments.",
        citationIds: ["groot-n15-2025"],
      },
    ],
  },

  // -- Case Studies --
  caseStudySlugs: [
    "egocentric-video-collection",
    "workplace-egocentric-data",
    "game-based-data-capture",
  ],

  // -- Dataset Showcase --
  datasetIds: [],

  // -- FAQ --
  faqs: [
    {
      question:
        "What is VLA training data and why is it different from standard video data?",
      answer:
        "VLA training data consists of synchronized triplets: visual observations, natural language instructions, and ground-truth action labels at each timestep. Standard video provides frames without action labels. VLA architectures like OpenVLA, RT-2, and pi-zero require all three modalities paired with temporal precision. Claru delivers this through parallel collection pipelines producing action-labeled demonstrations with sub-16ms alignment.",
    },
    {
      question:
        "How much VLA training data is needed for a general-purpose robot policy?",
      answer:
        "Current benchmarks suggest hundreds of thousands of diverse trajectories. Octo trained on 800,000 trajectories from 25 datasets and outperformed prior baselines by 52%. GR00T N1 uses a data pyramid spanning real-robot, human video, and synthetic data. However, diversity matters more than volume: OpenVLA with 7B parameters outperformed RT-2-X at 55B by 16.5% through higher-quality demonstrations. Claru scopes collection based on your model architecture and target task distribution.",
    },
    {
      question:
        "Can Claru provide paired video and action labels for VLA training?",
      answer:
        "Yes. Claru's game-based capture system records synchronized video and timestamped control inputs with sub-16ms temporal alignment and zero data loss. For egocentric manipulation data, the three-pipeline architecture delivers 386K+ clips with structured activity annotations. Both modalities can be combined to produce the observation-action pairs that VLA architectures require.",
    },
    {
      question:
        "How does Claru handle action space inconsistency across data sources?",
      answer:
        "Action space inconsistency is a primary failure mode in cross-dataset VLA training, as Octo's authors documented. Claru addresses this by standardizing action representations within each engagement. The structured activity taxonomy, co-developed with the research team through three iterative revision cycles, enforces consistent labeling at the UI level across all contributors. Output formats are configured to match your model's expected action representation.",
    },
    {
      question:
        "What environments are covered in Claru's VLA training data collection?",
      answer:
        "Claru collects across real-world environments that public datasets underrepresent. The workplace program covers 10 categories including barista stations, carpentry workshops, tailoring studios, and phone repair shops across multiple countries. The egocentric pipeline spans homes, outdoor spaces, and controlled task environments. This diversity reduces the distribution shift between training data and deployment that limits lab-collected datasets like DROID (13 institutions, primarily labs).",
    },
  ],

  // -- Research Citations --
  citations: [
    {
      id: "pi0-2024",
      title:
        "pi-zero: A Vision-Language-Action Flow Model for General Robot Control",
      authors: "Black et al.",
      venue: "arXiv 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2410.24164",
      keyClaim:
        "Introduced flow matching for continuous VLA action generation, achieving strong dexterous manipulation results with high-quality demonstrations requiring sub-frame temporal alignment.",
    },
    {
      id: "groot-n15-2025",
      title:
        "GR00T N1: An Open Foundation Model for Generalist Humanoid Robots",
      authors: "NVIDIA et al.",
      venue: "arXiv 2025",
      year: 2025,
      url: "https://arxiv.org/abs/2503.14734",
      keyClaim:
        "Open VLA foundation model for humanoid robots trained on heterogeneous mixture of real-robot trajectories, human videos, and synthetic data; dual-system architecture (VLM + diffusion transformer) achieves superior manipulation results over imitation learning baselines.",
    },
    {
      id: "openvla-2024",
      title:
        "OpenVLA: An Open-Source Vision-Language-Action Model",
      authors: "Kim et al.",
      venue: "arXiv 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2406.09246",
      keyClaim:
        "7B parameter VLA outperformed RT-2-X (55B) by 16.5% on manipulation benchmarks, demonstrating that data quality and diversity outweigh model scale.",
    },
    {
      id: "rt2-2023",
      title:
        "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan et al.",
      venue: "arXiv 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2307.15818",
      keyClaim:
        "Web-scale vision-language pre-training improved robot policy generalization by 3x, but only when fine-tuned on task-specific robot demonstrations.",
    },
    {
      id: "octo-2024",
      title:
        "Octo: An Open-Source Generalist Robot Policy",
      authors: "Ghosh et al.",
      venue: "arXiv 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2405.12213",
      keyClaim:
        "Trained on 800,000 trajectories from 25 datasets, outperforming prior generalist baselines by 52%; identified cross-dataset action space inconsistency as a primary source of policy failure.",
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
        "Aggregated 1M+ trajectories from 22 robot platforms but remains constrained within naive short-horizon tasks.",
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
        "76,000 robot manipulation trajectories across 564 scenes and 13 institutions; demonstrated value of in-the-wild collection for robot learning.",
    },
  ],

  // -- Internal Linking --
  pillarLinks: [
    "/pillars/acquire/egocentric-video",
    "/pillars/acquire/synthetic-data",
  ],

  // -- Related Content Pages --
  relatedSlugs: [
    "egocentric-video-data",
    "manipulation-trajectory-data",
    "teleoperation-data",
  ],
};

export default vlaTrainingData;
