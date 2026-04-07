import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "packing",
  metaTitle: "Packing Task Training Data for Robotics | Claru",
  metaDescription:
    "Training data for robotic packing: box filling, item arrangement, and order fulfillment. Dense manipulation demonstrations with spatial reasoning and deformable packaging.",
  primaryKeyword: "robotic packing training data",
  secondaryKeywords: [
    "packing task dataset",
    "robot packing demonstrations",
    "order fulfillment data",
    "box packing training data",
    "bin packing robot dataset",
    "logistics packing automation data",
  ],
  canonicalPath: "/training-data/packing",
  h1: "Packing Task Training Data",
  heroSubtitle:
    "Packing datasets for warehouse and e-commerce automation — item arrangement inside boxes, cartons, and totes with spatial reasoning annotations, deformable packaging handling, and multi-item sequence planning for robust order fulfillment policies.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Packing Task", href: "/training-data/packing" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Robotic Packing and Why Does Data Matter?",
      paragraphs: [
        "Robotic packing — arranging items into containers for shipping or storage — is the mirror image of bin picking and arguably the harder problem. While picking requires selecting one item from clutter, packing requires placing multiple items into a constrained volume in a stable, damage-free configuration that minimizes void space. Amazon ships over 5 billion packages annually, and the packing station remains one of the most labor-intensive nodes in fulfillment operations. The 3D bin packing problem is NP-hard even for rigid cuboids; real-world packing with irregular shapes, fragile items, and deformable packaging materials like bubble wrap and air pillows is orders of magnitude more complex.",
        "The data challenge in packing is fundamentally about spatial reasoning under constraints. A packing policy must simultaneously reason about item placement order (heavy items first, fragile items on top), geometric fit (maximizing volume utilization while maintaining stability), packing material insertion (void fill, separators, cushioning), and box flap closure or tape sealing. Human packers solve these constraints through years of spatial intuition — they can look at a set of items and mentally simulate stable arrangements in seconds. Transferring this spatial reasoning to robots requires demonstrations that capture not just the final placement poses but the entire decision process: which item to place next, where to position it, how to adjust neighboring items, and when to add protective packaging.",
        "Current robotic packing systems rely heavily on heuristic algorithms that work for uniform products but fail on the mixed-item orders that dominate e-commerce. The Online 3D Bin Packing Problem benchmark (Zhao et al., 2022) showed that reinforcement learning policies trained on 500K+ episodes can achieve 72.1% volume utilization on random cuboid sets — competitive with the best-first-fit-decreasing heuristic at 68.5% — but real warehouse items are not cuboids. Deformable items like clothing, bags, and pouches cannot be modeled as rigid bodies, and their placement behavior depends on how they drape and compress against neighboring items. Learning these physics from demonstration data is currently the only viable path to general packing policies.",
        "The economic incentive is enormous. McKinsey estimates that warehouse labor costs account for 65% of total fulfillment operating expenses, and packing stations require 2-3 workers per shift in a typical facility. Dimensional weight pricing by carriers means that poor packing directly increases shipping costs — a 10% improvement in volume utilization can save $0.15-$0.50 per package at scale. For a fulfillment center shipping 100,000 packages daily, that translates to $5.5-$18.3 million in annual savings from packing optimization alone, before accounting for labor cost reduction.",
      ],
    },
    {
      type: "stats",
      heading: "Packing Data by the Numbers",
      stats: [
        { value: "72.1%", label: "RL policy volume utilization on 3D bin packing" },
        { value: "5B+", label: "Amazon packages shipped annually" },
        { value: "65%", label: "Fulfillment cost from warehouse labor (McKinsey)" },
        { value: "500K+", label: "Training episodes for competitive RL packing" },
        { value: "10-15%", label: "Volume utilization gain from learned policies" },
        { value: "2-3 sec", label: "Target cycle time per item placement" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Packing Approach",
      description:
        "Different learning methods for packing have distinct data needs. Hybrid approaches combining spatial planning with learned placement are currently most effective.",
      columns: [
        "Approach",
        "Data Volume",
        "Key Modalities",
        "Spatial Reasoning",
        "Strengths",
      ],
      rows: [
        {
          Approach: "Online 3D Bin Packing RL",
          "Data Volume": "500K-2M simulated episodes",
          "Key Modalities": "Heightmap + item dimensions + placement mask",
          "Spatial Reasoning": "Learned via reward shaping",
          Strengths: "Handles online item arrival; optimizes utilization",
        },
        {
          Approach: "Behavioral Cloning from demonstrations",
          "Data Volume": "5K-50K real packing demonstrations",
          "Key Modalities": "RGB-D + proprioception + item identity",
          "Spatial Reasoning": "Implicit in demonstration quality",
          Strengths: "Handles deformable items; captures human heuristics",
        },
        {
          Approach: "Diffusion Policy for placement",
          "Data Volume": "1K-10K demonstrations per item category",
          "Key Modalities": "Multi-view RGB + depth + proprioception",
          "Spatial Reasoning": "Multimodal action distribution",
          Strengths: "Handles placement ambiguity; multiple valid solutions",
        },
        {
          Approach: "Sim-to-Real with domain randomization",
          "Data Volume": "1M+ sim episodes + 1K-5K real calibration",
          "Key Modalities": "Simulated heightmaps + real RGB-D for transfer",
          "Spatial Reasoning": "Physics-based in simulation",
          Strengths: "Scalable to new box sizes; fast iteration",
        },
        {
          Approach: "Foundation model fine-tuning (SpatialVLM)",
          "Data Volume": "10K-50K annotated packing sequences",
          "Key Modalities": "RGB images + language + spatial relations",
          "Spatial Reasoning": "Pretrained spatial reasoning + fine-tuning",
          Strengths: "Generalizes across item categories; language-conditioned",
        },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Learned Packing",
      paragraphs: [
        "The Online 3D Bin Packing problem has been the primary benchmark for learned packing policies. Zhao et al. (2022) formulated the problem as a Markov Decision Process where items arrive one at a time and the agent must place each item before seeing the next. Their PCT (Packing Configuration Transformer) architecture achieved 72.1% volume utilization on sequences of 50 random cuboids, outperforming all heuristic baselines. The key insight was representing the container state as a heightmap and using attention over candidate placement positions, allowing the policy to reason about global packing quality rather than greedy local placement.",
        "For real-world packing with irregular items, simulation alone is insufficient. Ha et al. (2024) demonstrated a sim-to-real pipeline for packing grocery items into bags, training in IsaacGym with 3D-scanned item meshes and transferring to a Franka Panda arm. The system achieved 82% packing success on 20 common grocery items, but performance dropped to 61% on deformable items (bread bags, chip bags) where simulation contact models diverge significantly from reality. This 21-percentage-point gap on deformable items underscores the need for real-world demonstration data that captures the actual physics of soft item packing.",
        "PackIt (Goyal et al., 2020) explored learning geometric packing directly from 3D shape understanding. Given a set of items and a container, PackIt predicts a packing configuration by iteratively selecting items and placement poses using a learned shape-conditioned policy. On a benchmark of 12 household object categories, PackIt achieved 64% valid packing configurations versus 41% for a random placement baseline. However, PackIt operates on known 3D models and does not handle the perception challenge of estimating item geometry from sensor data in a cluttered staging area.",
        "The most promising recent direction combines large vision-language models with physical reasoning. SpatialVLM (Chen et al., 2024) demonstrated that fine-tuning a VLM on spatial relationship annotations enables 3D spatial reasoning from 2D images — predicting relative positions, containment relationships, and stability assessments. While not yet applied specifically to packing, the spatial reasoning capabilities (83% accuracy on relative position questions, 76% on stability prediction) suggest that VLM-based packing planners could leverage pretrained spatial understanding with task-specific fine-tuning on packing demonstrations.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Packing Data",
      paragraphs: [
        "Packing data collection requires a staged workspace that mirrors real fulfillment station ergonomics. The setup includes an item staging area (conveyor or tote) where products arrive, a box selection station with multiple container sizes, packing material dispensers (air pillows, kraft paper, bubble wrap), and an overhead + side camera array to capture the evolving container state from multiple viewpoints. Depth sensing is critical for tracking the evolving heightmap inside the container — structured-light sensors (Zivid, Photoneo) mounted 60-80 cm above the box opening provide 0.2 mm accuracy across the packing volume.",
        "Each packing demonstration captures the full order fulfillment sequence: box selection based on item set, item retrieval from the staging area, placement into the container with chosen orientation and position, void fill insertion, and box closure. Annotations must include item identity and measured dimensions, placement pose (6-DoF relative to the container), placement order within the sequence, contact state with neighboring items, void fill type and placement, and container fill level (percentage of volume utilized). For deformable items, additional annotations capture the deformation state — compressed height versus free-standing height, draping contact area, and whether the item was folded or compressed during placement.",
        "Operator training for packing data collection focuses on consistent high-quality packing that balances volume utilization with item protection. We define packing quality metrics: volume utilization (target 75%+ for mixed items), stability (no item shifts when the box is tilted 15 degrees), damage prevention (fragile items cushioned, heavy items on bottom), and presentation (items visible and identifiable for quality inspection). Operators follow a standardized protocol: assess items, select box, place heaviest items first on the bottom layer, fill gaps with medium items, add cushioning around fragile items, place lightweight items on top, and add void fill. Each operator completes a 50-order qualification round with quality scoring before production collection begins.",
        "For maximum diversity, packing sessions rotate through multiple order profiles: single-item orders (baseline placement data), multi-item homogeneous orders (stacking and layering patterns), multi-item heterogeneous orders (mixed-category spatial reasoning), orders with fragile items (protective packing strategies), and orders with deformable items (clothing, pouches). Each order profile contributes distinct aspects of packing intelligence. Single-item data teaches optimal item orientation and box selection; multi-item data teaches spatial sequencing and stability reasoning; fragile-item data teaches protective placement heuristics.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets and Benchmarks for Robotic Packing",
      description:
        "Public packing datasets are scarce compared to picking datasets. Most research uses synthetic benchmarks, creating an opportunity for real-world demonstration data.",
      columns: [
        "Dataset / Benchmark",
        "Year",
        "Scale",
        "Item Types",
        "Key Features",
        "Limitations",
      ],
      rows: [
        {
          "Dataset / Benchmark": "Online 3D-BPP (Zhao et al.)",
          Year: "2022",
          Scale: "Unlimited procedural generation",
          "Item Types": "Random cuboids only",
          "Key Features": "Online arrival; heightmap state representation",
          Limitations: "No irregular shapes; no deformable items",
        },
        {
          "Dataset / Benchmark": "PackIt (Goyal et al.)",
          Year: "2020",
          Scale: "12 object categories, 1K test instances",
          "Item Types": "ShapeNet household objects",
          "Key Features": "3D shape reasoning; geometric packing",
          Limitations: "Known 3D models required; no real sensor data",
        },
        {
          "Dataset / Benchmark": "RoboCasa Packing subtasks",
          Year: "2024",
          Scale: "500+ trajectories",
          "Item Types": "Household items in kitchen containers",
          "Key Features": "Full manipulation trajectories; diverse items",
          Limitations: "Loose tolerance; limited to kitchen context",
        },
        {
          "Dataset / Benchmark": "TAX-Pose placement",
          Year: "2022",
          Scale: "Single-object placement demonstrations",
          "Item Types": "Rigid objects with defined receptacles",
          "Key Features": "SE(3) relative placement; few-shot learning",
          Limitations: "Single item at a time; no multi-item reasoning",
        },
        {
          "Dataset / Benchmark": "Amazon Packing Challenge",
          Year: "2015-2017",
          Scale: "Competition format; limited public data",
          "Item Types": "Real e-commerce products",
          "Key Features": "Real products; combined picking + packing",
          Limitations: "Not publicly available as training data",
        },
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Packing Data Needs",
      paragraphs: [
        "Claru operates packing data collection stations designed to replicate real fulfillment center workflows with instrumentation for high-fidelity demonstration capture. Each station features a multi-camera array (2 overhead + 2 side-mounted RGB-D sensors synchronized at 30 Hz) covering the full packing workspace from box selection through closure. A Zivid structured-light sensor mounted directly above the container captures sub-millimeter heightmaps of the evolving packing state after each item placement, providing the ground-truth spatial data needed for heightmap-based policies.",
        "We collect packing demonstrations on real product inventory supplied by clients, covering the full spectrum of item categories: rigid boxes, cylindrical containers, flexible pouches, clothing, fragile electronics, and irregularly shaped consumer goods. Our operators are trained on standardized packing protocols with quality scoring on volume utilization, stability, and damage prevention. Each demonstration captures the complete sequence from box selection through item placement, void fill insertion, and closure — annotated with per-item placement poses, contact states, packing material usage, and fill level progression.",
        "Claru delivers packing datasets formatted for direct ingestion by 3D bin packing RL environments, Diffusion Policy architectures, or custom sequence planning models. Standard deliverables include per-placement heightmaps, 6-DoF item poses relative to the container, placement order sequences, item dimension annotations, void fill placement data, and final volume utilization scores. For clients building end-to-end packing systems, we provide full manipulation trajectories with proprioceptive data covering the grasp-transport-place cycle for each item. Our daily throughput of 200-500 complete order packing demonstrations enables rapid dataset scaling for production packing policy training.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "zhao-bpp-2022",
          title:
            "Learning Efficient Online 3D Bin Packing on Packing Configuration Trees",
          authors: "Zhao et al.",
          venue: "ICLR 2022",
          year: 2022,
          url: "https://arxiv.org/abs/2206.01922",
        },
        {
          id: "goyal-packit-2020",
          title:
            "PackIt: A Virtual Environment for Geometric Planning",
          authors: "Goyal et al.",
          venue: "ICML 2020",
          year: 2020,
          url: "https://arxiv.org/abs/2007.13279",
        },
        {
          id: "ha-sim2real-packing-2024",
          title:
            "Sim-to-Real Transfer for Robotic Packing with Domain Randomization",
          authors: "Ha et al.",
          venue: "ICRA 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2401.01530",
        },
        {
          id: "chen-spatialvlm-2024",
          title:
            "SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities",
          authors: "Chen et al.",
          venue: "CVPR 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2401.12168",
        },
        {
          id: "duan-packing-rl-2019",
          title:
            "Multi-Robot Collaborative Dense Bin Packing",
          authors: "Duan et al.",
          venue: "IROS 2019",
          year: 2019,
          url: "https://arxiv.org/abs/1911.08941",
        },
      ],
    },
  ],
  faqs: [
    {
      question:
        "How many packing demonstrations are needed to train a robust policy?",
      answer:
        "For single-item placement into a known box size, 500-2,000 demonstrations per item category typically suffice for behavioral cloning with Diffusion Policy. For multi-item sequence packing with mixed categories, 5,000-50,000 complete order demonstrations are recommended to cover the combinatorial space of item arrangements. Start with your top 10 SKU categories and 200 demonstrations each to validate the pipeline before scaling. RL approaches can supplement with 500K+ simulated episodes using rigid-body approximations, but real demonstrations remain essential for deformable items.",
    },
    {
      question:
        "Can packing data be collected in simulation only?",
      answer:
        "Simulation works well for rigid cuboid packing benchmarks but breaks down for real-world packing with deformable items, packaging materials, and irregular shapes. The sim-to-real gap for deformable packing is 15-25 percentage points — simulation-trained policies achieve 60-65% success on real deformable items versus 80-85% with real demonstration data. The most cost-effective approach is simulation pretraining for spatial reasoning on rigid items, followed by real-world fine-tuning with 1,000-5,000 demonstrations covering deformable items and packing material handling.",
    },
    {
      question:
        "What sensors are needed for packing data collection?",
      answer:
        "The minimum setup is an overhead RGB-D sensor for container state tracking and a side-mounted RGB camera for item identification. For high-quality data, use a structured-light depth sensor (Zivid or Photoneo) mounted 60-80 cm above the box opening for sub-millimeter heightmaps, plus 2-3 additional RGB cameras for multi-view item tracking. Force/torque sensing at the wrist helps capture compression behavior during deformable item placement. All sensors should be synchronized at 30 Hz minimum.",
    },
    {
      question:
        "How do you handle the combinatorial explosion of item orderings?",
      answer:
        "For an order with N items, there are N! possible placement sequences. Rather than collecting all permutations, we focus on collecting the optimal sequence determined by packing heuristics (heavy-first-bottom-up) plus 3-5 variation sequences that explore alternative valid orderings. The policy learns a placement priority function rather than memorizing specific sequences. For production diversity, we randomize the item arrival order during collection — the operator decides the placement order, providing natural supervision for sequence planning.",
    },
    {
      question:
        "What volume utilization should we target in training data?",
      answer:
        "Human packers in production fulfillment centers achieve 70-80% volume utilization on mixed-item orders. Training data should target 75%+ utilization, which is sufficient to train policies that match or exceed heuristic baselines (68-72%). Include 10-15% of demonstrations with intentionally suboptimal packing (60-65% utilization) as negative examples — this teaches the policy to distinguish good from poor spatial arrangements. Exclude demonstrations below 50% utilization, which indicate operator error or exceptionally difficult item combinations that add noise without useful signal.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Packing Task Data",
  ctaDescription:
    "Tell us about your fulfillment operations — product categories, box sizes, and throughput targets — and we will design a packing data collection plan matched to your specific requirements.",
  relatedGlossaryTerms: [
    "manipulation-trajectory",
    "spatial-reasoning",
    "sim-to-real-gap",
    "behavioral-cloning",
    "depth-data",
  ],
  relatedGuidePages: [
    "how-to-build-a-manipulation-dataset",
    "how-to-preprocess-point-clouds-for-training",
  ],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "RGB-D + heightmaps + proprioception + item dimensions + packing material state",
    volumeRange: "5K-50K complete order packing demonstrations",
    temporalResolution:
      "30 Hz video, per-placement heightmap snapshots, per-item placement annotations",
    keyAnnotations: [
      "Per-item 6-DoF placement pose relative to container",
      "Placement order within the packing sequence",
      "Container heightmap state after each placement",
      "Volume utilization percentage progression",
      "Item identity, dimensions, and weight",
      "Void fill type and placement annotations",
    ],
  },
  relevantModels: [
    "Packing Configuration Transformer (PCT)",
    "Diffusion Policy",
    "SpatialVLM",
    "PackIt",
    "TAX-Pose",
    "Online 3D-BPP RL policies",
  ],
  environmentTypes: [
    "E-commerce fulfillment center",
    "Warehouse packing station",
    "Grocery bagging station",
    "Pharmaceutical packaging line",
    "Electronics packaging cell",
    "Returns processing station",
  ],
  keyPapers: [
    {
      id: "zhao-bpp-2022",
      title:
        "Learning Efficient Online 3D Bin Packing on Packing Configuration Trees",
      authors: "Zhao et al.",
      venue: "ICLR 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2206.01922",
    },
    {
      id: "goyal-packit-2020",
      title:
        "PackIt: A Virtual Environment for Geometric Planning",
      authors: "Goyal et al.",
      venue: "ICML 2020",
      year: 2020,
      url: "https://arxiv.org/abs/2007.13279",
    },
    {
      id: "chen-spatialvlm-2024",
      title:
        "SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities",
      authors: "Chen et al.",
      venue: "CVPR 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2401.12168",
    },
    {
      id: "ha-sim2real-packing-2024",
      title:
        "Sim-to-Real Transfer for Robotic Packing with Domain Randomization",
      authors: "Ha et al.",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2401.01530",
    },
  ],
  claruRelevance:
    "Claru operates packing data collection stations that replicate real fulfillment center workflows with high-fidelity multi-sensor instrumentation. Each station features a Zivid structured-light sensor for sub-millimeter container heightmaps, a synchronized multi-camera array (2 overhead + 2 side RGB-D at 30 Hz), and packing material dispensers for realistic void fill demonstrations. We collect demonstrations on real product inventory supplied by clients, covering rigid boxes, deformable clothing, fragile electronics, and irregular consumer goods. Operators follow standardized packing protocols with quality scoring on volume utilization (75%+ target), stability, and damage prevention. Deliverables include per-placement heightmaps, 6-DoF item poses, placement sequences, item dimension annotations, and volume utilization scores — formatted for direct ingestion by 3D bin packing RL environments, Diffusion Policy, or custom sequence planning architectures. Daily throughput of 200-500 complete order demonstrations enables rapid dataset scaling for production packing systems.",
};

export default data;
