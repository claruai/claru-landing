import type { LabPageData } from "./types";

const page: LabPageData = {
  slug: "stanford-sail",
  companyName: "Stanford AI Lab (SAIL)",
  companyDescription:
    "Stanford's AI Lab houses multiple robotics groups including Chelsea Finn's IRIS Lab (robot learning), Dorsa Sadigh's ILIAD Lab (human-robot interaction), and Jeannette Bohg's Interactive Perception Lab. SAIL researchers created ALOHA (low-cost bimanual teleop, $20K), Mobile ALOHA ($32K whole-body system), Octo (open-source robot policy), and Bridge V2 (shared manipulation dataset with 60K+ demonstrations).",
  keyProducts: [
    "ALOHA / Mobile ALOHA",
    "Octo (Open-Source Generalist Policy)",
    "Bridge V2 Dataset",
    "ALOHA Unleashed (with DeepMind)",
  ],
  researchFocus: [
    "Low-cost robot learning hardware",
    "Open-source robot policies and datasets",
    "Bimanual and whole-body manipulation",
    "Human-robot interaction and shared autonomy",
    "Large-scale manipulation dataset curation",
  ],
  dataNeedsSummary:
    "Stanford SAIL's open-source approach to robot learning — exemplified by ALOHA hardware, Octo model, and Bridge dataset — creates demand for large, diverse manipulation datasets that the community can build upon. Mobile ALOHA needs household task data from diverse homes. Bridge V2 needs contributions from geographically distributed environments. The ALOHA Unleashed collaboration with DeepMind pushes dexterity requirements further.",
  dataNeeds: [
    {
      title: "Diverse bimanual manipulation data for ALOHA",
      source:
        "ALOHA paper (Zhao et al., RSS 2023) and Mobile ALOHA (CoRL 2024)",
      description:
        "Bimanual teleoperated demonstrations across diverse tasks and environments to train policies on ALOHA-class low-cost hardware platforms. ALOHA Unleashed extends these requirements to complex dexterous tasks like repairing other robots.",
    },
    {
      title: "Mobile manipulation in home environments",
      source:
        "Mobile ALOHA demonstrations of cooking, cleaning, and household tasks",
      description:
        "Mobile manipulation recordings in real home environments — cooking, cleaning, organizing, cabinet operation — with whole-body (base + arms) coordinated demonstrations captured in diverse residential settings.",
    },
    {
      title: "Multi-site data for Bridge dataset expansion",
      source:
        "Bridge V2 dataset (Walke et al., CoRL 2023) and cross-institution data sharing model",
      description:
        "Manipulation data collected across many institutions and environments using Bridge-compatible formats to expand the dataset ecosystem beyond current US-based university contributors.",
    },
    {
      title: "Language-paired manipulation demonstrations",
      source:
        "Octo's language-conditioned control and RT-2 integration research",
      description:
        "Robot demonstrations paired with natural language task descriptions for training Octo and similar language-conditioned policies that follow verbal instructions.",
    },
    {
      title: "Household object interaction at scale",
      source:
        "Mobile ALOHA target of autonomous household assistance",
      description:
        "Object interaction data spanning kitchen utensils, cleaning tools, food items, containers, and furniture — collected in real homes rather than laboratory mockups — with the variety of objects that actual households contain.",
    },
  ],
  dataMatches: [
    {
      labNeed: "Diverse bimanual manipulation data for ALOHA",
      claruOffering:
        "Manipulation Trajectory Dataset + Custom Bimanual Collection",
      rationale:
        "Claru's manipulation data includes bimanual recordings. Custom collection campaigns with ALOHA-compatible recording formats can directly expand available training data for the ALOHA research community beyond Bay Area laboratory environments.",
    },
    {
      labNeed: "Mobile manipulation in home environments",
      claruOffering:
        "Egocentric Activity Dataset + Custom Home Collection",
      rationale:
        "Claru's egocentric video captures human household activities from first-person perspective in real homes across 100+ cities. Targeted mobile manipulation collection in diverse residential environments provides the visual variety Mobile ALOHA needs to generalize beyond Stanford kitchens.",
    },
    {
      labNeed: "Multi-site data for Bridge dataset expansion",
      claruOffering:
        "Distributed Collection in Bridge-Compatible Formats",
      rationale:
        "Claru can coordinate collection across multiple locations using Bridge V2-compatible RLDS recording formats, enabling seamless integration with the existing dataset ecosystem and dramatically expanding geographic coverage.",
    },
    {
      labNeed: "Language-paired manipulation demonstrations",
      claruOffering: "Custom Language-Paired Data Collection",
      rationale:
        "Claru can coordinate collection campaigns where diverse tasks are performed with concurrent natural language narration, producing the language-action pairs that Octo and similar models need for instruction following.",
    },
  ],
  keyPapers: [
    {
      id: "zhao-aloha-2023",
      title:
        "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
      authors: "Zhao, T.Z. et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.13705",
    },
    {
      id: "fu-mobile-aloha-2024",
      title:
        "Mobile ALOHA: Learning Bimanual Mobile Manipulation with Low-Cost Whole-Body Teleoperation",
      authors: "Fu, Z., Zhao, T.Z., Finn, C.",
      venue: "CoRL 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2401.02117",
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
      id: "walke-bridge-v2-2023",
      title:
        "BridgeData V2: A Dataset for Robot Learning at Scale",
      authors: "Walke et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2308.12952",
    },
    {
      id: "aloha-unleashed-2024",
      title: "ALOHA Unleashed: A Simple Recipe for Robot Dexterity",
      authors: "Zhao, T.Z. et al. (with Google DeepMind)",
      venue: "arXiv 2024",
      year: 2024,
      url: "https://aloha-unleashed.github.io/",
    },
    {
      id: "chi-diffusion-policy-2023",
      title:
        "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137",
    },
  ],
  technicalAnalysis:
    "Stanford SAIL's robotics groups have collectively shaped the modern landscape of accessible robot learning. The ALOHA system — a $20K bimanual teleoperation rig built by Tony Zhao and Zipeng Fu under Chelsea Finn's supervision — demonstrated that graduate students can collect high-quality manipulation data without million-dollar hardware. Mobile ALOHA, costing $32K including onboard power and compute, extended this to whole-body household tasks: the robot learned to saut shrimp, clean wine spills, push in chairs, and call elevators. ALOHA Unleashed, a collaboration with Google DeepMind, pushed dexterity further by training robots to repair other robots and perform tasks requiring fine motor control.\n\nOcto created an open-source generalist policy that anyone can fine-tune. Bridge V2 established a cross-institution data sharing standard with 60,000+ demonstrations formatted in the RLDS (Reinforcement Learning Datasets) format. Together, these projects form an ecosystem where hardware is cheap, software is open, and data is shared — democratizing robot learning in ways that previously required corporate-scale resources.\n\nThis accessibility-focused research philosophy creates a specific data bottleneck: the quality and diversity of policies trained on ALOHA is directly limited by the diversity of environments where ALOHA data has been collected. Most ALOHA data comes from a handful of university labs in the San Francisco Bay Area — the same kitchens, the same tables, the same lighting. A policy trained to fold towels in a Stanford lab kitchen overfits to those specific visual features and fails in a kitchen with different countertops, cabinet styles, or lighting conditions.\n\nThe Bridge dataset faces the same challenge at larger scale. While Bridge V2 aggregated data from multiple institutions, the contributing labs are primarily in the western United States and have similar laboratory setups. Expanding Bridge to include data from diverse global environments — different architectural styles, object categories, cultural objects, and regional home designs — would significantly improve the generalization of models like Octo that are trained on it.\n\nClaru's distributed collection network addresses this gap directly. By coordinating ALOHA-compatible and Bridge-compatible data collection across 100+ cities with diverse home environments, Claru can provide the environmental variety that the Stanford ecosystem needs to train policies that work outside the Bay Area. Each location contributes unique visual characteristics — different countertop materials, cabinet styles, lighting conditions, household objects — that make trained policies more robust. The data can be formatted in RLDS for direct compatibility with Bridge V2 and Octo training pipelines.",

  metaTitle:
    "Training Data for Stanford SAIL, ALOHA & Octo | Claru",
  metaDescription:
    "Bimanual manipulation, household task, and multi-site data for Stanford SAIL's ALOHA, Mobile ALOHA, Octo, and Bridge dataset ecosystem.",
  primaryKeyword: "Stanford SAIL robotics training data",
  secondaryKeywords: [
    "ALOHA training data",
    "Octo model data",
    "Bridge dataset expansion",
    "Mobile ALOHA data",
  ],
  canonicalPath: "/for/stanford-sail",
  h1: "Training Data for Stanford SAIL",
  heroSubtitle:
    "Stanford SAIL made robot learning accessible with ALOHA and Octo. Here is how diverse real-world data expands what open-source robot policies can do.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Labs", href: "/for" },
    { label: "Stanford SAIL", href: "/for/stanford-sail" },
  ],
  sections: [
    {
      type: "prose",
      heading: "About Stanford SAIL",
      paragraphs: [
        "The Stanford Artificial Intelligence Laboratory is one of the world's oldest and most influential AI research centers, with robotics groups that have fundamentally shaped how the field approaches robot learning. Chelsea Finn's IRIS Lab focuses on robot learning methods that are accessible, scalable, and practically deployable. Dorsa Sadigh's ILIAD Lab researches human-robot interaction and shared autonomy. Jeannette Bohg's Interactive Perception Lab works on the intersection of perception and manipulation.",
        "The ALOHA project, led by PhD students Tony Zhao and Zipeng Fu, demonstrated that a bimanual teleoperation system built from off-the-shelf components for $20,000 could collect manipulation data of sufficient quality to train impressive imitation learning policies. Mobile ALOHA, presented at CoRL 2024, added a mobile base and whole-body teleoperation for $32,000 total — enabling the robot to cook, clean, and navigate through a home environment autonomously after learning from human demonstrations.",
        "The ALOHA Unleashed project, a collaboration between Stanford and Google DeepMind, pushed the system's capabilities further — training robots to perform highly dexterous tasks including repairing other robots. This work demonstrated that scaling up data collection and training compute can unlock manipulation capabilities that were previously considered beyond the reach of imitation learning.",
      ],
    },
    {
      type: "stats",
      heading: "Stanford SAIL at a Glance",
      stats: [
        { value: "$20K", label: "ALOHA Hardware Cost" },
        { value: "$32K", label: "Mobile ALOHA System" },
        { value: "Octo", label: "Open-Source Policy" },
        { value: "60K+", label: "Bridge V2 Demonstrations" },
        { value: "DeepMind", label: "ALOHA Unleashed Partner" },
        { value: "RLDS", label: "Data Format Standard" },
      ],
    },
    {
      type: "prose",
      heading: "Research Focus and Key Projects",
      paragraphs: [
        "The Bridge V2 dataset established the data sharing infrastructure that makes SAIL's open-source robot learning ecosystem viable. By defining a standardized format (RLDS) for storing robot demonstrations and coordinating contributions from multiple institutions, Bridge V2 created a shared training corpus that any lab can contribute to and benefit from. With 60,000+ demonstrations from multiple robot embodiments and environments, Bridge V2 is the foundation for training generalist policies like Octo.",
        "Octo is SAIL's open-source generalist robot policy — a pretrained model that can be fine-tuned for specific tasks and embodiments with relatively small amounts of additional data. The quality of Octo's pretrained representations directly depends on training data diversity. More environments, tasks, and object categories in pretraining data produce representations that require less fine-tuning data to adapt to new deployments.",
        "Mobile ALOHA's household deployment context defines the frontier of data collection challenges. Teaching a robot to cook requires demonstrations in real kitchens with real ingredients. Teaching it to clean requires demonstrations with actual household messes. Teaching it to organize requires demonstrations in homes with diverse furniture, storage systems, and personal belongings. Laboratory mockups capture none of this authentic diversity.",
      ],
    },
    {
      type: "prose",
      heading: "Data Requirements Analysis",
      paragraphs: [
        "The environmental diversity gap is SAIL's primary data bottleneck. Mobile ALOHA was demonstrated performing impressive household tasks — sauteing shrimp, cleaning spills, organizing cabinets — but exclusively in Stanford laboratory environments. Deploying these policies in real homes requires training data from real homes with the visual variety that actual residential environments contain.",
        "The ALOHA Unleashed collaboration with DeepMind raised the bar for dexterous manipulation data. Tasks like repairing robots require fine motor coordination that demands high-quality demonstration data with precise joint-level annotations. Scaling this to hundreds of dexterous tasks requires distributed collection with consistent quality standards.",
        "Bridge V2's expansion needs are geographic. Currently, contributing institutions are primarily US-based universities. Adding data from Asian, European, African, and South American environments would dramatically improve the global applicability of models trained on the Bridge ecosystem. Each region's homes, objects, and environmental characteristics contribute unique visual diversity.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Stanford SAIL",
      paragraphs: [
        "Claru's global collector network directly solves SAIL's environmental diversity bottleneck. By deploying collectors in 100+ cities who perform standardized manipulation tasks in their own homes, Claru generates training data with the authentic residential diversity that laboratory environments cannot replicate — different countertops, different kitchen layouts, different household objects, different lighting conditions.",
        "For Bridge V2 expansion, Claru can format all collected data in RLDS format for direct integration with the Bridge ecosystem and Octo training pipelines. This enables seamless compatibility with SAIL's existing infrastructure while dramatically expanding geographic and environmental coverage.",
        "Claru's existing egocentric activity dataset of 386K+ clips also provides a complementary pretraining resource. First-person video of human household activities captured across diverse real environments contains the visual patterns and task structures that Mobile ALOHA needs to understand before fine-tuning on robot-specific manipulation demonstrations.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "zhao-aloha-2023",
          title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
          authors: "Zhao et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2304.13705",
        },
        {
          id: "fu-mobile-aloha-2024",
          title: "Mobile ALOHA: Learning Bimanual Mobile Manipulation with Low-Cost Whole-Body Teleoperation",
          authors: "Fu et al.",
          venue: "CoRL 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2401.02117",
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
          id: "walke-bridge-v2-2023",
          title: "BridgeData V2: A Dataset for Robot Learning at Scale",
          authors: "Walke et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2308.12952",
        },
      ],
    },
  ],
  faqs: [
    {
      question:
        "Why does ALOHA need data from diverse environments?",
      answer:
        "Most ALOHA data comes from university labs in the San Francisco Bay Area. Policies trained on this data overfit to Bay Area aesthetics — specific countertop materials, kitchen layouts, and lighting conditions — and fail in environments with different visual characteristics. Data from diverse homes and kitchens across different regions produces policies that generalize broadly.",
    },
    {
      question:
        "What is the Bridge dataset and how can it be expanded?",
      answer:
        "Bridge V2 is a standardized manipulation dataset aggregated from multiple research institutions using the RLDS format, containing 60,000+ demonstrations. It established protocols for cross-institution data sharing. Expansion requires data collection from new, geographically diverse environments using Bridge-compatible recording formats — exactly what distributed collection enables.",
    },
    {
      question:
        "How does Octo benefit from more diverse training data?",
      answer:
        "Octo is an open-source generalist robot policy designed to be fine-tuned for specific tasks. The quality of Octo's pretrained representations depends on training data diversity. More environments, tasks, and object categories in pretraining produce representations that require less fine-tuning data to adapt to new deployments and unseen conditions.",
    },
    {
      question: "What is ALOHA Unleashed?",
      answer:
        "ALOHA Unleashed is a collaboration between Stanford (Tony Zhao, Chelsea Finn) and Google DeepMind that pushes ALOHA's dexterity further. The project demonstrated robots performing highly dexterous tasks including repairing other robots, showing that scaling data collection and training compute can unlock manipulation capabilities previously considered beyond imitation learning.",
    },
    {
      question:
        "How does Mobile ALOHA differ from the original ALOHA?",
      answer:
        "The original ALOHA is a stationary bimanual system ($20K) for tabletop manipulation. Mobile ALOHA ($32K) adds a mobile base and whole-body teleoperation, enabling the robot to navigate through environments while performing bimanual tasks — cooking, cleaning, calling elevators. This whole-body capability requires training data from full-room or full-home environments rather than just tabletops.",
    },
  ],
  ctaHeading: "Expand the Open Robot Learning Ecosystem",
  ctaDescription:
    "Discuss diverse, Bridge-compatible manipulation data for Stanford SAIL's robot learning research.",
  relatedGlossaryTerms: [
    "behavioral-cloning",
    "imitation-learning",
    "diffusion-policy",
    "cross-embodiment-data",
  ],
  relatedGuidePages: [
    "how-to-build-a-manipulation-dataset",
    "how-to-collect-kitchen-activity-data",
  ],
  relatedSolutionSlugs: [],
};

export default page;
