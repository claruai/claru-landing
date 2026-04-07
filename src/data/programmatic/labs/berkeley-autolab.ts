import type { LabPageData } from "./types";

const page: LabPageData = {
  slug: "berkeley-autolab",
  companyName: "UC Berkeley AUTOLAB",
  companyDescription:
    "AUTOLAB at UC Berkeley, led by Professor Ken Goldberg, is a leading robotics research lab focused on automating grasping, manipulation, and surgical robotics. The lab has produced foundational work on Dex-Net (neural grasp planning networks), FogROS (cloud robotics infrastructure), and large-scale grasp planning datasets. AUTOLAB supports 30+ postdocs, PhD students, and undergrads pursuing projects in robust robot grasping for warehouses, homes, and surgery.",
  keyProducts: [
    "Dex-Net (1.0 through 4.0)",
    "FogROS 2 (Cloud Robotics)",
    "AUTOLAB Grasping Benchmark",
    "Large-Scale Grasp Quality Datasets",
  ],
  researchFocus: [
    "Neural grasp planning and bin picking",
    "Cloud robotics infrastructure",
    "Surgical robotics and automation",
    "Large-scale grasping datasets and benchmarks",
    "Sim-to-real transfer for manipulation",
  ],
  dataNeedsSummary:
    "AUTOLAB's grasping research requires massive real-world grasp attempt datasets to train and validate neural grasp planners. Dex-Net models achieve 95%+ success in lab conditions but face a persistent sim-to-real gap in deployment. Their cloud robotics work (FogROS) enables distributed data collection but requires diverse environment data to demonstrate value. Expanding beyond standard object sets to real-world product diversity is the critical frontier.",
  dataNeeds: [
    {
      title: "Real-world grasp attempt data at scale",
      source:
        "Dex-Net series (Mahler et al., RSS 2017 through 2023) and grasping benchmark research",
      description:
        "Thousands of real-world grasp attempts on diverse objects with success/failure labels, approach angles, and grasp quality metrics for training and validating neural grasp planners beyond laboratory object sets.",
    },
    {
      title: "Bin picking data with cluttered scenes",
      source:
        "AUTOLAB industrial bin picking research and logistics partnerships",
      description:
        "Multi-object bin picking recordings showing grasp selection, execution, and replanning in cluttered bins with objects of varying geometries, materials, and weights — reflecting real warehouse product assortments.",
    },
    {
      title: "Diverse object datasets for grasp generalization",
      source:
        "Dex-Net training data requirements for novel object grasping",
      description:
        "RGB-D scans and manipulation recordings of thousands of real-world objects spanning household, industrial, and commercial categories for training grasps that generalize to unseen objects beyond YCB and Google Scanned Objects.",
    },
    {
      title: "Surgical manipulation data",
      source:
        "AUTOLAB surgical robotics research and da Vinci platform work",
      description:
        "Fine-grained manipulation recordings in surgical contexts — suturing, tissue manipulation, instrument handling — with sub-millimeter precision tracking for surgical robot learning.",
    },
    {
      title: "Multi-site distributed grasp data",
      source:
        "FogROS 2 cloud robotics platform (Ichnowski et al., ICRA 2023)",
      description:
        "Grasp attempt data collected simultaneously from robots at multiple physical locations via cloud infrastructure, capturing environmental diversity that single-site collection cannot achieve.",
    },
  ],
  dataMatches: [
    {
      labNeed: "Real-world grasp attempt data at scale",
      claruOffering: "Custom Grasping Data Collection",
      rationale:
        "Claru can coordinate grasp attempt data collection across multiple sites with standardized protocols, producing the scale and diversity of real-world grasp data that single-lab collection cannot achieve. Each site contributes unique objects and environmental conditions.",
    },
    {
      labNeed: "Bin picking data with cluttered scenes",
      claruOffering:
        "Manipulation Trajectory Dataset + Custom Collection",
      rationale:
        "Claru's manipulation data includes cluttered scene interactions. Targeted collection campaigns can produce bin-picking-specific data with varied object assortments and bin configurations reflecting real warehouse product distributions.",
    },
    {
      labNeed: "Diverse object datasets for grasp generalization",
      claruOffering:
        "Egocentric Activity Dataset + Custom Object Scanning",
      rationale:
        "Claru's egocentric data captures objects in natural environments across 100+ cities. Custom scanning campaigns can produce RGB-D object scans from globally diverse product categories — household items, tools, food packaging, electronics — far beyond standard academic object sets.",
    },
    {
      labNeed: "Multi-site distributed grasp data",
      claruOffering: "Distributed Multi-Site Collection Campaigns",
      rationale:
        "Claru's global collector network mirrors the distributed collection model that FogROS enables technically. By coordinating standardized grasp experiments across many physical locations simultaneously, Claru provides the environmental diversity that validates FogROS's distributed architecture.",
    },
  ],
  keyPapers: [
    {
      id: "mahler-dexnet-2017",
      title: "Dex-Net 2.0: Deep Learning to Plan Robust Grasps",
      authors: "Mahler et al.",
      venue: "RSS 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1703.09312",
    },
    {
      id: "ichnowski-fogros-2023",
      title:
        "FogROS 2: An Adaptive and Extensible Platform for Cloud and Fog Robotics",
      authors: "Ichnowski et al.",
      venue: "ICRA 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2210.01732",
    },
    {
      id: "satish-dexnet-policy-2019",
      title:
        "On-Policy Dataset Synthesis for Learning Robot Grasping Policies Using Fully Convolutional Deep Networks",
      authors: "Satish et al.",
      venue: "RA-L 2019",
      year: 2019,
      url: "https://arxiv.org/abs/1909.12832",
    },
    {
      id: "mahler-dexnet-4-2019",
      title:
        "Learning Ambidextrous Robot Grasping Policies",
      authors: "Mahler et al.",
      venue: "Science Robotics, Vol 4",
      year: 2019,
      url: "https://arxiv.org/abs/1903.04184",
    },
    {
      id: "danielczuk-segmenting-2019",
      title:
        "Segmenting Unknown 3D Objects from Real Depth Images using Mask R-CNN Trained on Synthetic Data",
      authors: "Danielczuk et al.",
      venue: "ICRA 2019",
      year: 2019,
      url: "https://arxiv.org/abs/1809.05825",
    },
    {
      id: "goldberg-beyond-2024",
      title:
        "Beyond Planar Grasping: Modeling and Planning for Multi-Fingered Manipulation",
      authors: "Goldberg, K. et al.",
      venue: "AUTOLAB Technical Report",
      year: 2024,
      url: "https://autolab.berkeley.edu/publications.shtml",
    },
  ],
  technicalAnalysis:
    "UC Berkeley's AUTOLAB has been at the forefront of data-driven grasping for over a decade. The Dex-Net series demonstrated that neural networks trained on large synthetic grasp datasets can achieve robust bin picking — Dex-Net 2.0 used 6.7 million synthetic data points to train a robot that could pick up and move real objects with a 99% success rate in controlled laboratory conditions. Dex-Net 4.0 extended this to ambidextrous grasping with both suction and parallel-jaw grippers. These results established that data-driven grasping can match or exceed hand-engineered grasp planners.\n\nHowever, the persistent gap between synthetic grasp quality predictions and real-world grasp success rates reveals the limits of simulation-only training. Dex-Net's synthetic data is generated by rendering 3D object models and computing analytic grasp metrics — but real objects have material properties (surface texture, compliance, friction, contamination), geometric features (rounded edges, thin handles, deformable packaging), and environmental conditions (lighting, clutter, bin geometry) that simulation models imprecisely. Each of these factors contributes to grasp failures that synthetic training cannot anticipate.\n\nAUTOLAB's FogROS cloud robotics platform creates an interesting data collection paradigm. FogROS enables robots in different physical locations to share computation and data through cloud infrastructure. If robots at multiple sites are collecting grasp data simultaneously, the resulting dataset captures far more environmental and object diversity than any single-site collection campaign. Claru's distributed collection model mirrors this philosophy at a larger geographic scale — coordinating standardized grasp experiments across dozens of locations to produce datasets with the diversity that makes neural grasp planners robust in deployment.\n\nThe bin picking research has direct commercial implications that make data quality critical. Amazon, logistics companies, and manufacturers all need robust bin picking systems for warehouse automation. Training these systems requires data from real bins with authentic product assortments — not the standardized object sets (YCB, Google Scanned Objects) used in laboratory evaluations. Real warehouse products include unusual geometries (L-shaped brackets, nested cups), challenging materials (transparent packaging, reflective surfaces), and extreme size variation (tiny screws to large boxes) that academic object sets do not adequately represent.\n\nThe surgical robotics dimension adds requirements for precision manipulation data at a different scale. AUTOLAB's work on surgical robot learning requires demonstrations of tasks like suturing, tissue retraction, and instrument exchange with sub-millimeter tracking accuracy. While distinct from warehouse grasping, the underlying principle is the same: real-world data collected under authentic conditions produces better policies than simulation or laboratory approximations.",

  metaTitle:
    "Training Data for UC Berkeley AUTOLAB & Dex-Net | Claru",
  metaDescription:
    "Real-world grasping, bin picking, and object diversity data for UC Berkeley AUTOLAB's Dex-Net grasp planning and cloud robotics research.",
  primaryKeyword: "Berkeley AUTOLAB training data",
  secondaryKeywords: [
    "Dex-Net training data",
    "grasping dataset",
    "bin picking data",
    "grasp planning data",
  ],
  canonicalPath: "/for/berkeley-autolab",
  h1: "Training Data for UC Berkeley AUTOLAB",
  heroSubtitle:
    "AUTOLAB pioneered neural grasp planning with Dex-Net. Here is how diverse real-world grasping data bridges the gap between simulated and deployed performance.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Labs", href: "/for" },
    {
      label: "Berkeley AUTOLAB",
      href: "/for/berkeley-autolab",
    },
  ],
  sections: [
    {
      type: "prose",
      heading: "About UC Berkeley AUTOLAB",
      paragraphs: [
        "AUTOLAB at UC Berkeley was founded by Professor Ken Goldberg in 1996 and has grown into one of the most influential robotics research labs focused on grasping and manipulation. The lab currently supports over 30 postdocs, PhD students, and undergraduates working on problems spanning warehouse automation, home robotics, and surgical automation. Goldberg holds joint appointments in IEOR and EECS at Berkeley and is a member of the Berkeley AI Research (BAIR) Lab.",
        "The lab's flagship contribution is the Dex-Net series of neural grasp planning systems. Starting with Dex-Net 1.0's million-object grasp quality database and progressing through Dex-Net 4.0's ambidextrous grasping, the series established that deep learning can plan reliable grasps from a single depth image — achieving laboratory success rates exceeding 95%. Dex-Net 2.0's release of 6.7 million synthetic grasp data points remains one of the largest publicly available grasp datasets.",
        "Beyond grasping, AUTOLAB has contributed FogROS 2 — an open-source cloud robotics platform that allows robots to offload computation to cloud or fog nodes. FogROS enables distributed robot fleets to share learned models and data, creating a framework for collective robot learning that becomes more powerful as more robots contribute data from diverse environments.",
      ],
    },
    {
      type: "stats",
      heading: "AUTOLAB at a Glance",
      stats: [
        { value: "1996", label: "Founded" },
        { value: "Dex-Net", label: "Key Innovation" },
        { value: "Ken Goldberg", label: "Director" },
        { value: "6.7M", label: "Synthetic Grasps (Dex-Net 2.0)" },
        { value: "95%+", label: "Lab Grasp Success Rate" },
        { value: "30+", label: "Researchers" },
      ],
    },
    {
      type: "prose",
      heading: "Research Focus and Key Projects",
      paragraphs: [
        "The Dex-Net research program addresses the fundamental question: can robots learn to grasp novel objects reliably from data alone? Dex-Net 2.0 answered affirmatively for parallel-jaw grippers, Dex-Net 3.0 extended this to suction cups, and Dex-Net 4.0 combined both into an ambidextrous system that automatically selects the best gripper type for each object. The underlying technical approach trains convolutional neural networks on grasp quality metrics computed over large databases of 3D object meshes.",
        "FogROS 2 addresses the distributed systems challenge of robot learning. When multiple robots operate in different environments, each collects unique data that could benefit all others. FogROS provides the infrastructure for sharing this data through cloud services — automatically routing computation to available GPUs, synchronizing learned models across robot fleets, and aggregating data from distributed sources. This architecture is a natural fit for data collection campaigns that span multiple physical locations.",
        "AUTOLAB's surgical robotics research applies grasping and manipulation principles to the operating room. Working with da Vinci surgical robot platforms, the lab investigates how learning-based approaches can assist surgeons with tasks like suturing, tissue manipulation, and autonomous tool exchange during procedures. These surgical applications require manipulation data collected at a precision level that exceeds warehouse grasping by an order of magnitude.",
      ],
    },
    {
      type: "prose",
      heading: "Data Requirements Analysis",
      paragraphs: [
        "The sim-to-real gap is AUTOLAB's central data challenge. Dex-Net's synthetic training data is generated by rendering 3D meshes and computing analytic grasp quality scores. But real objects differ from their 3D models in ways that matter for grasping: surface friction varies with material and contamination, thin features deform under contact, packaging material crinkles unpredictably, and object mass distribution affects grasp stability during transport. Closing this gap requires real-world grasp attempt data with success and failure labels across the full diversity of objects that robots encounter in deployment.",
        "The object diversity problem is particularly acute. Standard academic evaluation uses object sets like YCB (77 objects) or Google Scanned Objects (~1,000). Real warehouses handle tens of thousands of distinct products, each with unique geometry, material properties, and packaging. Training neural grasp planners that work on this long tail of real products requires grasp data collected on far more diverse object assortments than any single laboratory can maintain.",
        "The environmental diversity dimension matters because grasp success depends on context: the same object may be easy to pick from a flat surface but challenging in a cluttered bin, easy under bright lighting but difficult in warehouse shadows, easy when dry but problematic when contaminated with dust or moisture. Collecting grasp data across diverse environmental conditions produces planners that are robust to the conditions that real deployment facilities present.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports AUTOLAB",
      paragraphs: [
        "Claru's distributed collector network directly addresses the object and environmental diversity bottleneck. By coordinating grasp data collection across 100+ cities, Claru provides access to household products, industrial parts, food items, and consumer goods from diverse global markets — far exceeding the object diversity available in any university laboratory. Each collection location contributes unique products and environmental conditions.",
        "For bin picking validation, Claru can assemble authentic product assortments that match real warehouse distributions. Rather than testing grasps on curated laboratory object sets, data collected with real products in realistic bin configurations provides the validation signal that logistics companies need before deploying automated picking systems.",
        "Claru's egocentric activity dataset also provides a complementary pretraining resource. First-person video of humans grasping and manipulating objects in natural environments captures the visual patterns and grasp strategies that inform neural grasp planning — providing semantic context about object affordances that pure geometry-based approaches miss.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "mahler-dexnet-2017",
          title:
            "Dex-Net 2.0: Deep Learning to Plan Robust Grasps",
          authors: "Mahler et al.",
          venue: "RSS 2017",
          year: 2017,
          url: "https://arxiv.org/abs/1703.09312",
        },
        {
          id: "ichnowski-fogros-2023",
          title:
            "FogROS 2: An Adaptive Platform for Cloud and Fog Robotics",
          authors: "Ichnowski et al.",
          venue: "ICRA 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2210.01732",
        },
        {
          id: "mahler-dexnet-4-2019",
          title:
            "Learning Ambidextrous Robot Grasping Policies",
          authors: "Mahler et al.",
          venue: "Science Robotics",
          year: 2019,
          url: "https://arxiv.org/abs/1903.04184",
        },
        {
          id: "satish-dexnet-policy-2019",
          title:
            "On-Policy Dataset Synthesis for Learning Robot Grasping Policies",
          authors: "Satish et al.",
          venue: "RA-L 2019",
          year: 2019,
          url: "https://arxiv.org/abs/1909.12832",
        },
      ],
    },
  ],
  faqs: [
    {
      question:
        "Why does Dex-Net need real-world grasp data despite synthetic training?",
      answer:
        "Dex-Net trains on millions of simulated grasps computed over 3D object meshes but faces a persistent sim-to-real gap. Real objects have material properties, surface conditions, friction variations, and geometric details that simulation misses. Real-world grasp attempt data with success/failure labels helps calibrate and validate neural grasp planners for authentic deployment conditions.",
    },
    {
      question:
        "What is the difference between lab grasping data and deployment grasping data?",
      answer:
        "Lab data uses standardized object sets (YCB with 77 objects, Google Scanned Objects with ~1,000) in controlled conditions with consistent lighting and clean surfaces. Deployment data features real products from warehouses with unexpected geometries, materials, contamination, and clutter. Policies trained only on lab data fail on the long tail of real-world objects that warehouses handle.",
    },
    {
      question:
        "How does cloud robotics enable better data collection?",
      answer:
        "AUTOLAB's FogROS 2 platform allows robots at multiple sites to share computation and data through cloud infrastructure. Multiple robots collecting grasp data simultaneously from different locations naturally produce more diverse datasets than single-site collection. Claru's distributed collector network extends this principle further — coordinating data collection across 100+ locations.",
    },
    {
      question: "What is Dex-Net 4.0 and how does it improve on earlier versions?",
      answer:
        "Dex-Net 4.0 combines parallel-jaw and suction grasping into a single ambidextrous system that automatically selects the best gripper type for each object and grasp pose. Earlier versions handled only one gripper type. This ambidextrous approach requires training data from both gripper types across the same object diversity — doubling the data requirement compared to single-gripper systems.",
    },
    {
      question:
        "How does AUTOLAB's surgical robotics research relate to grasping?",
      answer:
        "Surgical robotics applies the same data-driven manipulation principles as warehouse grasping but at much higher precision. Tasks like suturing require sub-millimeter accuracy, tissue manipulation demands force-aware control, and instrument exchange needs reliable grasping under surgical conditions. The underlying approach — learning from demonstration data — is shared, but surgical data collection requires specialized instruments and environments.",
    },
  ],
  ctaHeading: "Real-World Data for Grasp Planning",
  ctaDescription:
    "Discuss diverse grasping and manipulation data for AUTOLAB's neural grasp planning research.",
  relatedGlossaryTerms: [
    "grasping-dataset",
    "6-dof-grasp-planning",
    "depth-data",
    "point-cloud",
  ],
  relatedGuidePages: [
    "how-to-build-a-grasping-dataset",
    "how-to-preprocess-point-clouds-for-training",
  ],
  relatedSolutionSlugs: [],
};

export default page;
