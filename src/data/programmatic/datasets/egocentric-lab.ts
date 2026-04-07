import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  slug: "egocentric-lab",
  metaTitle: "Egocentric Lab Video Dataset for Robotics AI | Claru",
  metaDescription:
    "First-person laboratory video dataset with manipulation annotations for training robotic lab assistants, liquid handling, and embodied AI research. 85K+ clips across 30+ lab types.",
  primaryKeyword: "egocentric lab video dataset",
  secondaryKeywords: [
    "lab robot training data",
    "first-person laboratory video",
    "egocentric pipetting data",
    "lab automation training data",
    "robotic lab assistant dataset",
    "scientific workflow video data",
  ],
  canonicalPath: "/datasets/egocentric-lab",
  h1: "Egocentric Lab Video Dataset",
  heroSubtitle:
    "First-person video of real laboratory workflows — pipetting, centrifuging, microscopy, sample handling — captured across diverse wet labs, dry labs, and cleanrooms with dense manipulation annotations for training robotic lab assistants and scientific automation systems.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Datasets", href: "/datasets" },
    { label: "Egocentric Lab", href: "/datasets/egocentric-lab" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Lab Video Data Matters for Robotics",
      paragraphs: [
        "Laboratories are one of the highest-value target environments for robotic automation. Pharmaceutical companies, biotech startups, and academic research labs spend billions annually on repetitive manual tasks — pipetting, plate handling, reagent preparation, centrifugation — that are ideal candidates for robotic automation. Training models for these tasks requires video data captured in real lab environments with the precision and sterility constraints that define laboratory work.",
        "The egocentric viewpoint is essential because it captures the operator's perspective during complex protocols. A head-mounted camera records exactly what a lab technician sees: pipette tips at close range, microplate wells partially occluded by the operator's hands, small-volume liquid transfers that are invisible from a room-scale camera, and the constant context-switching between bench areas, instruments, and reagent storage that characterizes real lab workflows.",
        "Lab environments present unique perception challenges that kitchen or warehouse data cannot address. Transparent vessels (glass flasks, plastic tubes, microplates) create reflection and refraction artifacts. Small objects (pipette tips, microcentrifuge tubes, slides) require high spatial resolution. Color-coded reagents and labels demand accurate color perception. Sterile technique imposes movement constraints that differ fundamentally from everyday object manipulation.",
      ],
    },
    {
      type: "stats",
      heading: "Dataset at a Glance",
      stats: [
        { value: "85K+", label: "Video clips" },
        { value: "550+", label: "Hours recorded" },
        { value: "30+", label: "Lab environments" },
        { value: "12+", label: "Annotation layers" },
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology",
      paragraphs: [
        "Claru collectors wear lightweight head-mounted cameras while performing genuine laboratory protocols in their own facilities. This includes wet lab procedures (cell culture, PCR preparation, ELISA assays, buffer preparation), dry lab tasks (sample weighing, powder handling, equipment calibration), and cleanroom operations (wafer handling, sterile assembly). Each session follows a real protocol rather than scripted actions, generating authentic data with natural timing, error recovery, and the multi-step reasoning that lab work demands.",
        "Collection sessions range from 20 minutes to 2 hours of continuous activity, depending on the protocol. Collectors are recruited from diverse lab types — university research labs, pharmaceutical QC labs, clinical diagnostics labs, and biotech startups — ensuring the dataset covers variation in equipment brands, bench layouts, PPE requirements, and protocol standards. This diversity is critical for training models that generalize beyond a single laboratory setup.",
        "Raw video is captured at 1080p resolution at 30fps. Each session includes metadata: lab type classification, equipment inventory, protocol name and description, and PPE worn. For a subset of collections, we deploy RealSense depth cameras and wrist-mounted IMU sensors to capture depth and motion data alongside RGB video.",
      ],
    },
    {
      type: "cards",
      heading: "Annotation Layers",
      cards: [
        {
          title: "Protocol Step Segments",
          description:
            "Start/end timestamps for every discrete protocol step: aspirate, dispense, vortex, centrifuge, incubate. Taxonomy covers 150+ lab-specific actions across wet lab, dry lab, and cleanroom protocols.",
          icon: "🧪",
        },
        {
          title: "Hand-Instrument Contact",
          description:
            "Per-frame labels marking which hand holds which instrument (pipette, forceps, spatula) with grasp type classification. Critical for training robotic tool-use policies.",
          icon: "🤲",
        },
        {
          title: "Liquid Level Tracking",
          description:
            "Annotations tracking liquid volumes in transparent vessels across frames — essential for training visual liquid handling systems that must detect fill levels through transparent containers.",
          icon: "💧",
        },
        {
          title: "Equipment State Labels",
          description:
            "Status annotations for lab instruments: centrifuge running/stopped, hood sash position, incubator door open/closed. Enables training models that understand instrument affordances and sequencing constraints.",
          icon: "⚙️",
        },
      ],
    },
    {
      type: "comparison-table",
      heading: "Comparison with Public Lab Datasets",
      description:
        "How Claru's lab video compares to publicly available datasets relevant to laboratory automation.",
      columns: ["Dataset", "Clips", "Hours", "Lab Types", "Annotations"],
      rows: [
        {
          Dataset: "Ego4D (lab subset)",
          Clips: "~5K",
          Hours: "~30",
          "Lab Types": "~10",
          Annotations: "Narrations, hands",
        },
        {
          Dataset: "OMSCS Lab Videos",
          Clips: "~2K",
          Hours: "~50",
          "Lab Types": "3",
          Annotations: "Step descriptions",
        },
        {
          Dataset: "Claru Lab",
          Clips: "85K+",
          Hours: "550+",
          "Lab Types": "30+",
          Annotations: "Steps, instruments, liquids, equipment state, depth",
        },
      ],
    },
    {
      type: "prose",
      heading: "Use Cases and Model Training",
      paragraphs: [
        "Lab automation companies building robotic pipetting and sample handling systems need demonstrations that capture the dexterity, precision, and protocol-awareness of expert technicians. Claru's lab dataset provides the visual observation sequences these systems need, with temporal annotations aligned to standard lab protocol taxonomies that researchers can map to robotic action spaces.",
        "Vision systems for lab instrument monitoring benefit from the equipment state annotations. A model trained on hours of centrifuge, incubator, and hood interactions learns to recognize instrument states, predict when operations complete, and coordinate multi-instrument workflows — the perception backbone for autonomous lab orchestration systems.",
        "Pharmaceutical and biotech companies developing digital twin simulations of their lab processes use this data to validate simulation fidelity. By comparing real egocentric video of a protocol against simulated execution, teams can identify where their digital models diverge from physical reality — particularly for liquid handling dynamics, which remain difficult to simulate accurately.",
      ],
    },
  ],
  faqs: [
    {
      question: "What types of laboratory environments are included?",
      answer:
        "The dataset covers wet labs (biology, chemistry, pharmaceutical QC), dry labs (materials science, electronics), cleanrooms (semiconductor, sterile manufacturing), and clinical diagnostics labs. Over 30 unique lab environments are represented across university, corporate, and clinical settings in North America and Europe.",
    },
    {
      question: "How is sterile technique handled during collection?",
      answer:
        "Collectors follow their facility's standard PPE and sterility protocols during recording. The head-mounted camera is positioned to avoid interference with safety equipment. For BSL-2+ environments, we use cameras that can be surface-decontaminated between sessions. All collection follows facility-specific safety approvals.",
    },
    {
      question: "Can the data be delivered in RLDS or HDF5 format?",
      answer:
        "Yes. Claru delivers lab video data in any standard robotics format including RLDS, HDF5, WebDataset, zarr, and LeRobot format. We handle all format conversion as part of the delivery pipeline.",
    },
  ],
  ctaHeading: "Request a Lab Video Sample Pack",
  ctaDescription:
    "Get a curated sample of egocentric lab video with full annotations to evaluate for your lab automation or scientific robotics project.",
  relatedGlossaryTerms: [
    "egocentric-video",
    "hand-object-interaction",
    "activity-annotation",
    "temporal-annotation",
  ],
  relatedGuidePages: [],
  relatedSolutionSlugs: [],
  datasetProfile: {
    modalities: ["rgb", "depth"],
    totalClips: "85,000+",
    totalHours: "550+",
    annotationLayers: [
      "Protocol step segments",
      "Hand-instrument contact",
      "Liquid level tracking",
      "Equipment state labels",
      "Object bounding boxes",
      "Grasp type classification",
    ],
    formats: ["RLDS", "HDF5", "WebDataset", "MP4+JSON"],
    resolution: "1920x1080",
    fps: "30 fps",
  },
  comparisonWithPublic: [
    {
      name: "Ego4D (lab subset)",
      clips: "~5K",
      hours: "~30",
      modalities: "RGB",
      environments: "~10 labs",
      annotations: "Narrations, hands",
    },
    {
      name: "OMSCS Lab Videos",
      clips: "~2K",
      hours: "~50",
      modalities: "RGB",
      environments: "3 labs",
      annotations: "Step descriptions",
    },
  ],
  useCases: [
    {
      modelType: "Lab Automation Policies",
      description:
        "Protocol-aware manipulation demonstrations train robotic systems to execute multi-step lab workflows with the precision and sequencing that laboratory protocols demand.",
      exampleModels: ["RT-2", "OpenVLA", "Octo"],
    },
    {
      modelType: "Instrument Monitoring Systems",
      description:
        "Equipment state annotations enable training visual monitoring systems that track instrument status, predict operation completion, and coordinate multi-instrument workflows.",
      exampleModels: ["VideoMAE", "InternVideo"],
    },
    {
      modelType: "Liquid Handling Vision",
      description:
        "Liquid level annotations train perception systems to detect fill levels in transparent vessels — essential for automated pipetting and reagent dispensing.",
      exampleModels: ["DINO", "SAM", "Grounding DINO"],
    },
  ],
  keyPapers: [
    {
      id: "grauman-ego4d-2022",
      title: "Ego4D: Around the World in 3,000 Hours of Egocentric Video",
      authors: "Grauman et al.",
      venue: "CVPR 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2110.07058",
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
      id: "arnold-lab-automation-2024",
      title: "Towards Autonomous Laboratory: A Survey of Lab Automation and Robotics",
      authors: "Arnold et al.",
      venue: "Science Robotics 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2405.09960",
    },
  ],
  claruRelevance:
    "Claru operates a distributed network of 10,000+ collectors, including trained lab technicians across university, pharmaceutical, and biotech facilities. Unlike academic datasets limited to a few research labs, Claru's collection spans diverse real-world lab environments with authentic protocols. Every clip receives multi-layer annotation through Claru's quality-controlled pipeline, delivering training-ready data in your preferred format within weeks.",
};

export default data;
