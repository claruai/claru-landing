import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "bin-picking",
  metaTitle: "Bin Picking Training Data for Warehouse Robotics | Claru",
  metaDescription:
    "Training data for robotic bin picking: cluttered bin grasping, singulation, and sorting. Point cloud and RGB-D datasets with grasp annotations for warehouse automation.",
  primaryKeyword: "bin picking training data",
  secondaryKeywords: [
    "bin picking dataset",
    "warehouse picking data",
    "robotic singulation data",
    "grasp planning dataset",
    "cluttered bin grasping data",
    "warehouse automation training data",
  ],
  canonicalPath: "/training-data/bin-picking",
  h1: "Bin Picking Training Data",
  heroSubtitle:
    "Bin picking datasets for warehouse and logistics automation — cluttered scene point clouds, grasp pose annotations, and singulation strategies for training robust picking policies across thousands of SKUs.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Bin Picking", href: "/training-data/bin-picking" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Bin Picking and Why Is Data the Bottleneck?",
      paragraphs: [
        "Bin picking — grasping individual items from cluttered containers — is the highest-value manipulation task in logistics and manufacturing. Despite its apparent simplicity, production bin picking must handle 10,000+ SKU categories with 99.5%+ pick success rates and sub-2-second cycle times to match human throughput. The warehouse automation market is projected to exceed $30 billion by 2028, and the primary technical barrier is not hardware but data: training perception and grasp planning systems that generalize across the extreme diversity of object shapes, weights, materials, and packing configurations found in real distribution centers.",
        "The difficulty compounds in cluttered scenes where objects overlap, stack, and occlude each other in unpredictable ways. A bin of mixed e-commerce products might contain rigid boxes of varying sizes, flexible polybag-wrapped items, cylindrical cans, oddly shaped consumer goods, and loose accessories — all packed randomly by upstream processes. Grasp planning in these scenarios requires reasoning about object instance segmentation under heavy occlusion, support relationships between stacked items, grasp approach trajectories that avoid collisions with bin walls and neighboring objects, and singulation strategies when no clean grasp is available on the target item.",
        "The Dex-Net project (Mahler et al., 2017) established the foundational approach of training grasp quality predictors on large-scale synthetic data. Dex-Net 2.0 trained on 6.7 million synthetic point clouds with analytic grasp quality metrics, achieving 93% grasp success on novel objects in isolation. However, the sim-to-real transfer gap for cluttered bin scenes remains significant: success rates drop 10-20% in dense clutter compared to isolated objects because simulation cannot perfectly model the complex multi-body contact physics of packed bins.",
        "Leading deployed bin picking systems close this gap with continuous real-world data collection. Covariant's Brain system collects data from every pick attempt across its deployed fleet, accumulating millions of real grasps that capture the true distribution of failure modes — suction seal failures on curved surfaces, finger-grasp slippage on smooth plastic, collision-induced drops during extraction. For organizations building new bin picking capabilities, bootstrapping policies from human-collected demonstration data with real product inventory dramatically reduces the months-long autonomous data collection phase needed to reach production reliability.",
      ],
    },
    {
      type: "stats",
      heading: "Bin Picking Data by the Numbers",
      stats: [
        { value: "99.5%", label: "Pick success rate target for production" },
        { value: "<2 sec", label: "Target cycle time per pick" },
        { value: "10K+", label: "SKU categories in typical e-commerce warehouse" },
        { value: "6.7M", label: "Synthetic grasps in Dex-Net 2.0 training" },
        { value: "1B+", label: "Grasp annotations in GraspNet-1Billion" },
        { value: "93%", label: "Dex-Net success on novel isolated objects" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Grasping Approach",
      description:
        "Different grasp planning architectures have distinct data requirements. Choose based on your gripper type and deployment constraints.",
      columns: [
        "Approach",
        "Data Volume",
        "Primary Modality",
        "Key Annotations",
        "Best For",
      ],
      rows: [
        {
          Approach: "Dex-Net (analytic grasp quality)",
          "Data Volume": "1M+ synthetic + 10K real for calibration",
          "Primary Modality": "Depth images / point clouds",
          "Key Annotations": "Grasp pose + analytic quality score",
          "Best For": "Parallel-jaw grippers; known object geometry",
        },
        {
          Approach: "Contact-GraspNet (6-DoF learned)",
          "Data Volume": "10K-100K real scenes with grasp labels",
          "Primary Modality": "Full 3D point clouds",
          "Key Annotations": "6-DoF grasp pose + contact points + success label",
          "Best For": "Multi-finger grippers; cluttered scenes",
        },
        {
          Approach: "Suction grasp planning",
          "Data Volume": "50K-500K suction attempts with outcome",
          "Primary Modality": "RGB-D + surface normal estimates",
          "Key Annotations": "Suction point + seal quality + surface flatness",
          "Best For": "High-speed picking; flat/convex surfaces",
        },
        {
          Approach: "End-to-end visuomotor BC",
          "Data Volume": "10K-50K full pick-place demonstrations",
          "Primary Modality": "Multi-view RGB + proprioception",
          "Key Annotations": "Full trajectory + grasp success + SKU label",
          "Best For": "Novel gripper designs; combined pick-place",
        },
        {
          Approach: "Foundation model fine-tuning (RT-2, OpenVLA)",
          "Data Volume": "5K-20K demonstrations + language labels",
          "Primary Modality": "RGB images + language instruction",
          "Key Annotations": "Language-annotated pick demonstrations",
          "Best For": "Flexible picking with language-specified targets",
        },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Learned Bin Picking",
      paragraphs: [
        "GraspNet-1Billion (Fang et al., 2020) created the largest public grasp dataset to date: 1.12 billion grasp poses across 190 cluttered scenes with 88 object categories. Each scene was captured from 256 camera viewpoints with full RGB-D data, and grasps were evaluated using analytic force-closure metrics. Models trained on GraspNet-1Billion achieve 67.3% AP on unseen clutter configurations, establishing the benchmark for 6-DoF grasp detection in clutter. The dataset's scale demonstrated that grasp prediction accuracy continues to improve with more data even beyond 100 million training examples.",
        "Contact-GraspNet (Sundermeyer et al., 2021) improved cluttered-scene grasping by predicting 6-DoF grasps conditioned on local contact geometry. On the GraspNet benchmark, Contact-GraspNet achieved 73.5% grasp success rate in dense clutter — a 6-point improvement over the baseline. The key architectural insight was predicting grasps from contact point features rather than global scene features, which naturally handles occlusion because each grasp depends only on local geometry. This approach translates directly to real-world deployment where partial point clouds from a single viewpoint are the norm.",
        "AnyGrasp (Fang et al., 2023) pushed toward production-grade bin picking by combining geometric grasp prediction with temporal tracking. AnyGrasp processes point clouds at 50 ms per frame on an NVIDIA RTX 3090, enabling real-time grasp planning at 20 Hz — fast enough for conveyor picking applications. In real-world bin picking trials with 50+ object categories, AnyGrasp achieved 95.6% first-grasp success rate on isolated objects and 89.2% in moderate clutter, with cycle times under 3 seconds including motion planning and execution.",
        "For production deployment at Amazon-scale throughput, the Sparrow system (Hogan et al., 2024) demonstrated that learned picking policies can achieve 99%+ pick reliability when trained on fleet-collected data. Sparrow combines a learned grasp scorer with a classical motion planner, training the grasp scorer on 1.2 million real pick attempts collected from 50+ deployed stations over 6 months. The critical finding was that the long tail of failure modes (transparent objects, extreme aspect ratios, deformable packaging) required at least 500K real picks to adequately cover, explaining why purely simulation-trained systems plateau at 90-95% reliability.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Bin Picking Data",
      paragraphs: [
        "Production bin picking data collection requires standardized picking stations designed for throughput and consistency. The core sensing setup is a structured-light depth sensor (Photoneo PhoXi or Zivid One+) mounted above the bin, providing 0.1-0.3 mm depth accuracy at the working distance. Structured-light sensors are preferred over time-of-flight for bin picking because they handle the sharp depth discontinuities at bin edges and between stacked objects without the multipath interference artifacts that plague ToF sensors in confined spaces. A secondary RGB camera provides color and texture information for SKU identification.",
        "Data collection throughput for bin picking depends heavily on the bin replenishment strategy. Manual bin replenishment by an operator limits throughput to 200-400 picks per hour, with significant idle time between bins. Automated replenishment using a second robot arm or gravity-fed bin rotation can sustain 500-800 picks per hour. For maximum coverage of clutter configurations, bins should be randomized between collection sessions: dump all objects back into the bin, shake to create a new random packing, and resume collection. Each unique packing configuration typically yields 5-15 picks before the bin becomes too sparse for meaningful clutter data.",
        "Annotation requirements for bin picking data vary by the target algorithm. For grasp planning models (Dex-Net, GraspNet-style), the minimum annotation is the 6-DoF grasp pose and binary success outcome. For end-to-end visuomotor policies, full trajectories with proprioceptive data are needed. For SKU-aware picking systems, each pick must be annotated with the target object's SKU category, and per-object instance segmentation masks enable training detection models alongside grasp planners. Clutter density should be annotated per scene (number of visible objects, occlusion percentage) to enable curriculum learning from sparse to dense configurations.",
        "Claru collects bin picking data using standardized stations with industrial-grade Photoneo depth sensors, automated bin rotation for packing randomization, and real product inventory shipped from client fulfillment centers. Our collection protocol randomizes bin configurations between sessions, captures multi-viewpoint point clouds (top + 2 angled views) per pick, and records the full pick-and-place cycle including grasp approach, contact, extraction, transport, and placement. We deliver 500-1,500 annotated pick attempts per station per day with 6-DoF grasp poses, point cloud snapshots, success labels, and optional SKU classification.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets for Bin Picking",
      description:
        "Public bin picking and grasping datasets range from small real-world collections to massive synthetic corpora. Most focus on grasp detection rather than full pick-and-place trajectories.",
      columns: [
        "Dataset",
        "Year",
        "Scale",
        "Real/Sim",
        "Grasp Types",
        "Clutter Level",
      ],
      rows: [
        {
          Dataset: "Dex-Net 2.0 (Mahler et al.)",
          Year: "2017",
          Scale: "6.7M grasps on 1,500 3D models",
          "Real/Sim": "Synthetic + 1K real test grasps",
          "Grasp Types": "Parallel-jaw (4-DoF)",
          "Clutter Level": "Isolated objects only",
        },
        {
          Dataset: "GraspNet-1Billion (Fang et al.)",
          Year: "2020",
          Scale: "1.12B grasp poses, 190 scenes, 88 objects",
          "Real/Sim": "Real RGB-D, analytic grasp labels",
          "Grasp Types": "6-DoF parallel-jaw",
          "Clutter Level": "Moderate (5-15 objects per scene)",
        },
        {
          Dataset: "ACRONYM (Eppner et al.)",
          Year: "2021",
          Scale: "17.7M grasps on 8,872 ShapeNet objects",
          "Real/Sim": "Fully synthetic",
          "Grasp Types": "6-DoF parallel-jaw",
          "Clutter Level": "Isolated and packed scenes",
        },
        {
          Dataset: "AnyGrasp (Fang et al.)",
          Year: "2023",
          Scale: "Real-time inference; pretrained on GraspNet",
          "Real/Sim": "Real deployment + synthetic pretraining",
          "Grasp Types": "6-DoF any gripper",
          "Clutter Level": "Dense (20+ objects)",
        },
        {
          Dataset: "DexGraspNet (Wang et al.)",
          Year: "2023",
          Scale: "1.32B grasps for dexterous hands on 5,355 objects",
          "Real/Sim": "Fully synthetic (IsaacGym)",
          "Grasp Types": "Multi-finger dexterous grasps",
          "Clutter Level": "Isolated objects",
        },
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Bin Picking Data Needs",
      paragraphs: [
        "Claru operates standardized bin picking stations optimized for data collection throughput in logistics and manufacturing scenarios. Each station features a Photoneo PhoXi or Zivid structured-light sensor (0.1 mm depth accuracy) for primary point cloud capture, supplemented by RGB cameras for texture and SKU identification. Automated bin rotation randomizes packing configurations between collection batches, ensuring diverse clutter patterns that stress-test grasp planners against the full spectrum of real-world bin states.",
        "We collect data on real product inventory, not proxy objects. Clients ship representative SKU samples (typically 100-500 items covering their top volume categories) to our collection facilities, where operators perform supervised pick-and-place operations across randomized bin configurations. Each pick attempt is recorded as a complete package: pre-pick point cloud from 2-3 viewpoints, 6-DoF grasp pose at contact, full trajectory from approach through extraction and placement, and binary success label with failure mode classification (missed grasp, slip, collision, suction seal failure).",
        "Claru delivers bin picking datasets formatted for direct ingestion by GraspNet, Contact-GraspNet, Dex-Net, AnyGrasp, or custom architectures. Standard deliverables include aligned point clouds with per-point segmentation masks, 6-DoF grasp pose annotations in the sensor frame, success labels with failure taxonomy, and SKU category labels when applicable. For clients building end-to-end visuomotor policies, we provide full pick-place trajectories with proprioceptive data. Our daily throughput of 500-1,500 annotated picks per station enables rapid dataset scaling to the 10K-100K pick range needed for production-grade systems.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "mahler-dexnet-2017",
          title:
            "Dex-Net 2.0: Deep Learning to Plan Robust Grasps with Synthetic Point Clouds and Analytic Grasp Metrics",
          authors: "Mahler et al.",
          venue: "RSS 2017",
          year: 2017,
          url: "https://arxiv.org/abs/1703.09312",
        },
        {
          id: "fang-graspnet-2020",
          title:
            "GraspNet-1Billion: A Large-Scale Benchmark for General Object Grasping",
          authors: "Fang et al.",
          venue: "CVPR 2020",
          year: 2020,
          url: "https://arxiv.org/abs/1912.13470",
        },
        {
          id: "sundermeyer-contact-2021",
          title:
            "Contact-GraspNet: Efficient 6-DoF Grasp Generation in Cluttered Scenes",
          authors: "Sundermeyer et al.",
          venue: "ICRA 2021",
          year: 2021,
          url: "https://arxiv.org/abs/2103.14127",
        },
        {
          id: "fang-anygrasp-2023",
          title:
            "AnyGrasp: Robust and Efficient Grasp Perception in Spatial and Temporal Domains",
          authors: "Fang et al.",
          venue: "T-RO 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2212.08390",
        },
        {
          id: "eppner-acronym-2021",
          title:
            "ACRONYM: A Large-Scale Grasp Dataset",
          authors: "Eppner et al.",
          venue: "ICRA 2021",
          year: 2021,
          url: "https://arxiv.org/abs/2011.09584",
        },
      ],
    },
  ],
  faqs: [
    {
      question:
        "How many SKU categories should a bin picking dataset cover?",
      answer:
        "Start with the top 100 SKU categories by order volume, which typically represent 60-80% of picks in an e-commerce warehouse. Each category needs 50-200 pick attempts across varying clutter configurations (sparse, moderate, dense). Expand to 500-1,000 categories for full production deployment. Group geometrically similar SKUs into categories (all cylindrical cans, all flat boxes, etc.) to reduce the total number of categories needed. Claru can collect data on your actual product inventory shipped to our facilities.",
    },
    {
      question:
        "What success rate should the raw data have?",
      answer:
        "Aim for 70-85% raw pick success rate in the training data. If success is above 95%, the operator is cherry-picking easy grasps and the dataset lacks the failure diversity needed for robust training. Below 60% suggests hardware issues (sensor calibration, gripper maintenance) that will contaminate the data with non-informative failures. Failed picks provide essential negative training signal — the model learns which grasps and approach trajectories to avoid. Label failure modes (missed contact, slip, collision, suction seal break) for curriculum training.",
    },
    {
      question: "Single grasp or full pick-and-place?",
      answer:
        "Always collect full pick-and-place cycles. The extraction trajectory (lifting the object out of a cluttered bin without colliding with neighbors) is a critical failure point that pure grasp data misses. The place trajectory matters for downstream sorting and packing. Full cycles also capture drops during transport, which account for 15-25% of production pick failures. If your application is pure grasping without placement (e.g., decluttering for inspection), still record the extraction phase through bin clearance.",
    },
    {
      question:
        "How do you handle transparent and reflective objects?",
      answer:
        "Transparent and reflective objects cause depth sensor artifacts (holes, flying pixels, multipath interference) that must be represented in training data to prevent systematic failures. Collect these as a dedicated subset using polarized lighting or cross-modal approaches (combine structured light with stereo RGB depth). Include 10-15% of picks on transparent/reflective items. The GraspNet benchmark found that models trained without transparent objects achieve only 23% grasp success on them versus 71% when 10% of training data includes transparent items.",
    },
    {
      question:
        "Can synthetic data replace real bin picking data?",
      answer:
        "Synthetic data is excellent for pretraining grasp quality predictors — Dex-Net 2.0's 6.7 million synthetic grasps bootstrap strong features. However, the sim-to-real gap for cluttered bin picking (contact physics, sensor noise, material diversity) means synthetic-only models plateau at 85-90% success while production requires 99%+. The most cost-effective approach is synthetic pretraining followed by real-data fine-tuning: 1M synthetic grasps + 10K real grasps outperforms 100K real grasps alone by 5-8% success rate.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Bin Picking Data",
  ctaDescription:
    "Send us your top SKU categories and target throughput requirements, and we will design a bin picking data collection plan with your actual products.",
  relatedGlossaryTerms: [
    "grasping-dataset",
    "6-dof-grasp-planning",
    "point-cloud",
    "depth-data",
    "sim-to-real-gap",
  ],
  relatedGuidePages: [
    "how-to-build-a-grasping-dataset",
    "how-to-preprocess-point-clouds-for-training",
  ],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality:
      "RGB-D + structured-light point clouds + 6-DoF grasp pose + gripper state + force (optional)",
    volumeRange: "10K-500K picking attempts across SKU categories",
    temporalResolution:
      "30 Hz RGB-D, per-pick point cloud snapshots (2-3 viewpoints), binary pick outcome",
    keyAnnotations: [
      "6-DoF grasp pose at contact",
      "Pick success/failure with failure mode classification",
      "Per-object instance segmentation masks",
      "SKU category label",
      "Clutter density score (object count, occlusion percentage)",
      "Full pick-place trajectory with proprioceptive data",
    ],
  },
  relevantModels: [
    "GraspNet / GraspNet-1Billion",
    "Contact-GraspNet",
    "AnyGrasp",
    "Dex-Net 2.0 / 4.0",
    "Suction grasp networks",
    "End-to-end visuomotor policies",
  ],
  environmentTypes: [
    "Warehouse bin station",
    "Tote-to-tote picking",
    "Shelf picking (Kiva-style)",
    "Conveyor singulation",
    "Mixed-SKU palletization",
    "Returns processing",
  ],
  keyPapers: [
    {
      id: "mahler-dexnet-2017",
      title:
        "Dex-Net 2.0: Deep Learning to Plan Robust Grasps with Synthetic Point Clouds and Analytic Grasp Metrics",
      authors: "Mahler et al.",
      venue: "RSS 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1703.09312",
    },
    {
      id: "fang-graspnet-2020",
      title:
        "GraspNet-1Billion: A Large-Scale Benchmark for General Object Grasping",
      authors: "Fang et al.",
      venue: "CVPR 2020",
      year: 2020,
      url: "https://arxiv.org/abs/1912.13470",
    },
    {
      id: "sundermeyer-contact-2021",
      title:
        "Contact-GraspNet: Efficient 6-DoF Grasp Generation in Cluttered Scenes",
      authors: "Sundermeyer et al.",
      venue: "ICRA 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2103.14127",
    },
    {
      id: "fang-anygrasp-2023",
      title:
        "AnyGrasp: Robust and Efficient Grasp Perception in Spatial and Temporal Domains",
      authors: "Fang et al.",
      venue: "T-RO 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2212.08390",
    },
    {
      id: "eppner-acronym-2021",
      title: "ACRONYM: A Large-Scale Grasp Dataset",
      authors: "Eppner et al.",
      venue: "ICRA 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2011.09584",
    },
  ],
  claruRelevance:
    "Claru operates standardized bin picking stations for data collection at warehouse-scale throughput. Each station features industrial-grade Photoneo or Zivid structured-light sensors with 0.1 mm depth accuracy, automated bin rotation for packing configuration randomization, and capacity for real product inventory shipped from client fulfillment centers. We collect full pick-and-place cycles with 6-DoF grasp pose annotations, multi-viewpoint point clouds, success labels with failure mode taxonomy, and optional SKU classification and instance segmentation masks. Daily throughput reaches 500-1,500 annotated pick attempts per station, enabling rapid scaling to the 10K-100K range needed for production-grade grasp planning systems. Data is formatted for direct ingestion by GraspNet, Contact-GraspNet, Dex-Net, AnyGrasp, or custom architectures. For clients bootstrapping new picking systems, Claru's real-product demonstration data closes the critical sim-to-real gap that limits synthetic-only training to 85-90% reliability.",
};

export default data;
