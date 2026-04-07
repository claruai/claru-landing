import type { LabPageData } from "./types";

const page: LabPageData = {
  slug: "google-deepmind-robotics",
  companyName: "Google DeepMind Robotics",
  companyDescription:
    "Google DeepMind's robotics division created RT-1, RT-2, and RT-X — the foundational vision-language-action models that sparked the current wave of robot foundation model research. Their work on the Open X-Embodiment dataset established the first large-scale cross-embodiment robot learning benchmark.",
  keyProducts: ["RT-1", "RT-2", "RT-X", "Open X-Embodiment"],
  researchFocus: [
    "Vision-language-action models for robots",
    "Cross-embodiment robot learning",
    "Internet-scale pretraining for robot control",
    "Large-scale robot data collection and curation",
    "Sim-to-real transfer with generative models",
  ],
  dataNeedsSummary:
    "DeepMind Robotics pioneered the data-scaling approach with RT-2, demonstrating that VLMs pretrained on internet data can be fine-tuned for robot control. Their ongoing work requires ever-larger robot manipulation datasets, more diverse embodiment coverage for RT-X successors, and real-world validation data to prove that scaled pretraining translates to robust real-world performance.",
  dataNeeds: [
    {
      title: "Diverse manipulation data for VLA model scaling",
      source: "RT-2 paper (Brohan et al., 2023) and subsequent scaling research",
      description: "Massive quantities of robot manipulation demonstrations spanning hundreds of objects, tasks, and environments — the data fuel for next-generation VLA models.",
    },
    {
      title: "Cross-embodiment data beyond Open X-Embodiment",
      source: "Open X-Embodiment dataset gaps and RT-X scaling requirements",
      description: "Manipulation recordings from embodiments underrepresented in Open X-Embodiment — humanoids, mobile manipulators, dexterous hands — to improve cross-robot generalization.",
    },
    {
      title: "Real-world deployment validation data",
      source: "Gap between lab benchmarks and commercial deployment requirements",
      description: "Authentic data from target deployment environments — kitchens, offices, retail — to validate that lab-trained models work in real-world conditions.",
    },
    {
      title: "Language-grounded task data at scale",
      source: "RT-2's language-conditioned action generation architecture",
      description: "Manipulation demonstrations paired with diverse natural language descriptions — including paraphrases, implicit instructions, and multi-step task decompositions — to expand the language grounding capabilities of successor VLA models.",
    },
    {
      title: "Long-horizon multi-step task recordings",
      source: "SayCan and Inner Monologue research on task planning",
      description: "Complete recordings of multi-step tasks lasting minutes rather than seconds — kitchen meal preparation, workspace tidying, package assembly — where planning and error recovery are as important as individual manipulation primitives.",
    },
  ],
  dataMatches: [
    {
      labNeed: "Diverse manipulation data for VLA model scaling",
      claruOffering: "Manipulation Trajectory Dataset + Egocentric Activity Dataset",
      rationale: "Claru's combined manipulation and egocentric datasets provide millions of annotated clips showing physical interactions — a curated alternative to raw internet scraping for VLA pretraining.",
    },
    {
      labNeed: "Cross-embodiment data beyond Open X-Embodiment",
      claruOffering: "Custom Multi-Embodiment Collection Campaigns",
      rationale: "Claru can coordinate data collection across different robot platforms to fill specific coverage gaps in DeepMind's cross-embodiment training distribution.",
    },
    {
      labNeed: "Real-world deployment validation data",
      claruOffering: "Custom Environment-Specific Collection",
      rationale: "Claru's global collector network can gather data in real deployment target environments — actual kitchens, real offices, operating retail stores — providing the authentic validation data labs cannot generate internally.",
    },
    {
      labNeed: "Long-horizon multi-step task recordings",
      claruOffering: "Egocentric Activity Dataset (~386K clips) + Custom Long-Horizon Collection",
      rationale: "Claru's egocentric video captures complete multi-step activities in real households and workplaces, with temporal annotations that segment individual steps within longer task sequences.",
    },
  ],
  keyPapers: [
    {
      id: "brohan-rt2-2023",
      title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2307.15818",
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
      id: "brohan-rt1-2023",
      title: "RT-1: Robotics Transformer for Real-World Control at Scale",
      authors: "Brohan et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2212.06817",
    },
    {
      id: "ahn-saycan-2022",
      title: "Do As I Can, Not As I Say: Grounding Language in Robotic Affordances",
      authors: "Ahn et al.",
      venue: "CoRL 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2204.01691",
    },
    {
      id: "huang-inner-monologue-2022",
      title: "Inner Monologue: Embodied Reasoning through Planning with Language Models",
      authors: "Huang et al.",
      venue: "CoRL 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2207.05608",
    },
    {
      id: "bousmalis-robocat-2023",
      title: "RoboCat: A Self-Improving Generalist Agent for Robotic Manipulation",
      authors: "Bousmalis et al.",
      venue: "arXiv 2306.11706",
      year: 2023,
      url: "https://arxiv.org/abs/2306.11706",
    },
  ],
  technicalAnalysis:
    "Google DeepMind Robotics defined the current paradigm of robot learning with their RT series of papers. RT-1 demonstrated that a Transformer trained on large-scale robot data could generalize across tasks and objects. RT-2 showed that pretraining on internet-scale vision-language data dramatically improves robot task understanding. RT-X and Open X-Embodiment proved that training on data from multiple robot embodiments enables cross-robot transfer.\n\nEach successive paper required more data than the last. RT-1 used 130K demonstrations from a single robot. RT-2 added internet-scale VLM pretraining. Open X-Embodiment aggregated data from 22 robot embodiments across 21 institutions. The trajectory is clear: next-generation models will need even larger, more diverse datasets.\n\nThe Open X-Embodiment dataset, while groundbreaking, has known limitations. It is heavily biased toward tabletop manipulation with single-arm robots in laboratory settings. Humanoid data, mobile manipulation data, and dexterous hand data are underrepresented. Outdoor environments, industrial settings, and domestic spaces are scarce. Filling these gaps requires systematic data collection effort beyond what academic labs can contribute organically.\n\nDeepMind's research trajectory also reveals a growing gap between laboratory performance and real-world deployment. Models that achieve impressive success rates on lab benchmarks often fail in authentic environments where lighting, clutter, object variety, and human interference differ from training conditions. Closing this gap requires validation data collected in real deployment environments — something Claru's distributed collection network is uniquely positioned to provide.\n\nThe SayCan and Inner Monologue line of work demonstrates that long-horizon task planning is the next frontier after single-step manipulation. These systems use language models to decompose complex instructions into executable robot actions, but they need training data that captures the full arc of multi-step tasks — including the error detection and recovery behaviors that are absent from single-step demonstration datasets. Kitchen meal preparation, workspace organization, and package assembly are examples of tasks where planning matters as much as manipulation skill.",

  metaTitle: "Training Data for Google DeepMind Robotics (RT-2, RT-X) | Claru",
  metaDescription:
    "Diverse manipulation, cross-embodiment, and real-world validation data for Google DeepMind's RT-2, RT-X, and next-generation vision-language-action robot models.",
  primaryKeyword: "Google DeepMind robotics training data",
  secondaryKeywords: ["RT-2 training data", "RT-X data", "Open X-Embodiment data", "VLA model training data"],
  canonicalPath: "/for/google-deepmind-robotics",
  h1: "Training Data for Google DeepMind Robotics",
  heroSubtitle:
    "DeepMind defined the VLA paradigm with RT-1 and RT-2. Here is how diverse real-world data fuels the next generation of robot foundation models.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Labs", href: "/for" },
    { label: "Google DeepMind Robotics", href: "/for/google-deepmind-robotics" },
  ],
  sections: [
    {
      type: "prose",
      heading: "About Google DeepMind Robotics",
      paragraphs: [
        "Google DeepMind's robotics division emerged from the merger of Google Brain's robotics team (formerly known as Everyday Robots) and DeepMind's embodied AI research group. The combined team has produced some of the most influential work in robot learning, including the RT series of vision-language-action models and the Open X-Embodiment collaborative dataset.",
        "The division operates from Google's Mountain View campus and maintains a fleet of research robots used for large-scale data collection and model evaluation. Their approach is distinctive in that it treats robot learning as primarily a data and model scaling problem — the same paradigm that drove breakthroughs in language and vision models — rather than focusing on novel hardware or control architectures.",
        "DeepMind Robotics has catalyzed the broader field by open-sourcing key datasets and model architectures. The Open X-Embodiment dataset, contributed by 21 institutions spanning 22 robot embodiments, established the first standardized benchmark for cross-embodiment robot learning. This collaborative approach has made DeepMind the de facto center of gravity for the robot foundation model research community.",
      ],
    },
    {
      type: "stats",
      heading: "DeepMind Robotics at a Glance",
      stats: [
        { value: "RT-2", label: "Flagship VLA Model" },
        { value: "22", label: "X-Embodiment Robots" },
        { value: "130K+", label: "RT-1 Demonstrations" },
        { value: "21", label: "Contributing Labs" },
        { value: "1M+", label: "Total Robot Episodes" },
      ],
    },
    {
      type: "prose",
      heading: "Research Focus and Key Projects",
      paragraphs: [
        "The RT (Robotics Transformer) series represents DeepMind's core research arc. RT-1 showed that Transformers can learn generalizable robot control from large demonstration datasets. RT-2 demonstrated that VLM pretraining transfers semantic knowledge to robot actions — a robot trained with RT-2 can follow novel instructions it has never seen during robot data collection, because the language understanding comes from internet-scale pretraining. RT-X extended this to cross-embodiment learning, proving that a single model can improve performance on each individual robot by training on data from all robots simultaneously.",
        "Beyond the RT series, DeepMind Robotics has pursued long-horizon task planning through SayCan and Inner Monologue. These systems decompose complex natural language instructions into sequences of low-level robot actions, using a language model for planning and a manipulation policy for execution. This research creates demand for training data that captures complete multi-step tasks rather than isolated manipulation primitives.",
        "RoboCat, announced in 2023, introduced self-improvement to robot learning — a system that generates new training data by attempting tasks autonomously, then fine-tunes on its successful attempts. While promising, this approach still requires high-quality seed data from human demonstrations to bootstrap the self-improvement loop, particularly for tasks that require precise manipulation or novel object interactions.",
      ],
    },
    {
      type: "comparison-table",
      heading: "RT Model Evolution and Data Requirements",
      description: "How data scale and diversity requirements have grown with each generation of DeepMind's robotics models.",
      columns: ["Model", "Data Scale", "Embodiments", "Key Advance"],
      rows: [
        { "Model": "RT-1 (2023)", "Data Scale": "130K episodes", "Embodiments": "1 robot", "Key Advance": "Transformer for robot control" },
        { "Model": "RT-2 (2023)", "Data Scale": "130K + web VLM", "Embodiments": "1 robot", "Key Advance": "VLM transfer to actions" },
        { "Model": "RT-X (2024)", "Data Scale": "1M+ episodes", "Embodiments": "22 robots", "Key Advance": "Cross-embodiment transfer" },
        { "Model": "Next Gen", "Data Scale": "10M+ (projected)", "Embodiments": "50+ (projected)", "Key Advance": "Real-world generalization" },
      ],
    },
    {
      type: "prose",
      heading: "Data Requirements Analysis",
      paragraphs: [
        "The data scaling trajectory from RT-1 to RT-X reveals a pattern: each generation requires roughly an order of magnitude more data. RT-1 used 130K episodes from one robot. Open X-Embodiment aggregated over 1 million episodes from 22 embodiments. A plausible next-generation target is 10 million+ episodes spanning 50+ embodiments and hundreds of distinct environments.",
        "The current bottleneck is not data volume but data diversity. Open X-Embodiment is dominated by tabletop manipulation in university labs — single-arm robots picking and placing objects on tables under controlled lighting. The distribution is thin on humanoid manipulation, mobile manipulation in homes, outdoor tasks, industrial manipulation, and dexterous hand operations. Filling these distributional gaps requires coordinated collection across many environments and robot platforms.",
        "Deployment validation presents another critical data need. DeepMind's models achieve impressive lab benchmark scores but face a significant gap when tested in real homes, offices, and commercial spaces. Variables like ambient lighting, background clutter, unfamiliar objects, and human activity introduce failure modes that lab evaluation cannot detect. Systematic data collection in real deployment environments is essential for measuring and closing this gap.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports DeepMind Robotics",
      paragraphs: [
        "Claru addresses the distributional gaps in DeepMind's training pipeline. While DeepMind can generate large volumes of data from its in-house robot fleet, the environmental diversity is limited to its Mountain View facilities. Claru's global network of 10,000+ collectors across 100+ cities provides data from real homes, offices, retail stores, and industrial spaces that no single lab can replicate.",
        "For VLA pretraining, Claru's curated egocentric and manipulation datasets provide higher-quality visual grounding data than raw internet video. Every clip has temporal annotations, object labels, and activity segmentation — the structured supervision that accelerates VLA training compared to self-supervised learning on uncurated web data.",
        "For the long-horizon planning frontier, Claru's egocentric activity dataset captures complete multi-step tasks performed by real people in real environments. These recordings show natural error recovery, adaptive replanning, and the kind of improvisation that makes real-world task execution messy and informative — exactly the signal that models need to learn robust task planning.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "brohan-rt2-2023",
          title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
          authors: "Brohan et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2307.15818",
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
          id: "ahn-saycan-2022",
          title: "Do As I Can, Not As I Say: Grounding Language in Robotic Affordances",
          authors: "Ahn et al.",
          venue: "CoRL 2022",
          year: 2022,
          url: "https://arxiv.org/abs/2204.01691",
        },
        {
          id: "bousmalis-robocat-2023",
          title: "RoboCat: A Self-Improving Generalist Agent for Robotic Manipulation",
          authors: "Bousmalis et al.",
          venue: "arXiv 2306.11706",
          year: 2023,
          url: "https://arxiv.org/abs/2306.11706",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "What is a vision-language-action model and why does it need so much data?",
      answer: "A VLA model takes visual observations and language instructions as input and outputs robot actions. It needs three types of data: internet-scale vision-language data for pretraining, robot manipulation demonstrations for action learning, and diverse environment data for generalization. Each component requires massive scale.",
    },
    {
      question: "What are the limitations of the Open X-Embodiment dataset?",
      answer: "Open X-Embodiment is biased toward tabletop manipulation with single-arm robots in laboratory settings. Humanoid data, mobile manipulation, dexterous hand data, outdoor environments, and domestic spaces are underrepresented. Next-generation models need to fill these coverage gaps with purpose-collected data.",
    },
    {
      question: "Why do lab-trained robot models fail in real deployments?",
      answer: "Lab environments have controlled lighting, limited clutter, and standardized objects. Real deployment environments have variable lighting, unexpected objects, human interference, and environmental conditions labs cannot replicate. Validation data from real target environments is essential to measure and close this gap.",
    },
    {
      question: "How does the RT model series use language understanding?",
      answer: "RT-2 co-fine-tunes a vision-language model to output robot actions alongside text. This means the robot inherits the language model's understanding of concepts, spatial relationships, and object properties from internet pretraining. A robot can follow instructions involving objects or actions it has never seen in robot training data, because the semantic understanding transfers from the VLM.",
    },
    {
      question: "What role does self-improvement play in DeepMind's approach?",
      answer: "RoboCat demonstrated that robots can generate their own training data by attempting tasks and learning from successes. However, this self-improvement loop still requires high-quality human demonstration data as a seed — the robot needs initial examples to bootstrap from. Purpose-collected data from diverse environments provides the seed quality and diversity that makes self-improvement effective.",
    },
  ],
  ctaHeading: "Scale Robot Foundation Model Data",
  ctaDescription: "Discuss diverse, curated datasets for next-generation VLA and robot foundation model research.",
  relatedGlossaryTerms: ["vla", "cross-embodiment-data", "open-x-embodiment", "foundation-model-robotics"],
  relatedGuidePages: ["how-to-build-a-cross-embodiment-dataset", "how-to-create-action-labels-for-vla"],
  relatedSolutionSlugs: [],
};

export default page;
