import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "warehouse-automation",
  metaTitle: "Warehouse Automation Training Data | Claru",
  metaDescription: "Training data for warehouse robots: order picking, packing, palletizing, sorting. Multi-robot recordings with barcode scanning, bin management, and logistics workflow data.",
  primaryKeyword: "warehouse automation training data",
  secondaryKeywords: ["warehouse robot dataset", "logistics automation data", "order fulfillment robotics data", "bin picking dataset"],
  canonicalPath: "/training-data/warehouse-automation",
  h1: "Warehouse Automation Training Data",
  heroSubtitle: "End-to-end warehouse automation datasets — order picking, bin picking, packing, palletizing, and sorting workflows with barcode integration, SKU-level tracking, multi-robot coordination recordings, and throughput benchmarking across fulfillment environments.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Warehouse Automation", href: "/training-data/warehouse-automation" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Warehouse Automation and Why Does It Require Massive Training Datasets?",
      paragraphs: [
        "Warehouse automation encompasses the robotic systems that handle goods within distribution and fulfillment centers: goods-to-person retrieval (AMRs bringing shelves to pickers), autonomous pick-and-place from bins and shelves, automated packing (placing items into shipping boxes), palletizing (stacking boxes onto pallets in stable configurations), sorting (routing packages to outbound lanes), and last-mile delivery staging. The e-commerce logistics market processes billions of packages annually — Amazon alone ships over 5 billion packages per year in the US — and labor costs represent 65-70% of warehouse operating expenses. The global warehouse automation market exceeded $23 billion in 2024 and is projected to reach $41 billion by 2027.",
        "Companies driving this space include Covariant (AI-powered bin picking), Berkshire Grey (intelligent robotic sorting), Dexterity (robotic palletizing and depalletizing), Locus Robotics and 6 River Systems (AMR-based goods-to-person), Nimble Robotics (robotic pick-and-pack), and RightHand Robotics (piece-picking for e-commerce). Amazon's Sparrow robot and Agility Robotics' Digit humanoid represent the vertically integrated approach. Despite billions in investment, most warehouse robots still handle only a fraction of SKUs (Stock Keeping Units) autonomously. The typical Amazon fulfillment center carries 100,000+ unique SKUs ranging from rigid boxes to deformable pouches to irregularly shaped items, and achieving 95%+ pick success across this diversity requires orders of magnitude more training data than current datasets provide.",
        "The data challenge in warehouse automation is defined by SKU diversity and throughput pressure. A robot that achieves 99% pick success on 100 trained SKUs but fails on novel SKUs is commercially useless — warehouses cannot retrain the system every time a new product arrives. Generalization across SKU appearance (shape, size, weight, material, packaging) is the central technical challenge, and it requires training data that spans thousands of unique products. Simultaneously, warehouse robots must operate at commercial throughput rates (600-1,200 picks per hour for piece-picking, one pallet per 2-3 minutes for palletizing), meaning the training data must include not just successful picks but time-optimized motion trajectories that minimize cycle time while maintaining reliability.",
      ],
    },
    {
      type: "stats",
      heading: "Warehouse Automation Data at a Glance",
      stats: [
        { value: "10K-500K", label: "Operation cycles for training" },
        { value: "100K+", label: "Unique SKUs per fulfillment center" },
        { value: "$23B", label: "Warehouse automation market (2024)" },
        { value: "600-1,200", label: "Target picks per hour" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Warehouse Task",
      description: "Each warehouse automation subtask has distinct throughput, diversity, and sensor requirements.",
      columns: ["Task", "Data Volume", "Key Modalities", "SKU Diversity Need", "Throughput Target"],
      rows: [
        { "Task": "Bin picking (piece-picking)", "Data Volume": "50K-200K picks", "Key Modalities": "RGB-D + suction/gripper state + barcode", "SKU Diversity Need": "1,000+ unique SKUs", "Throughput Target": "600-1,200 picks/hr" },
        { "Task": "Shelf picking (tote to tote)", "Data Volume": "10K-50K episodes", "Key Modalities": "RGB-D + navigation + gripper state", "SKU Diversity Need": "500+ SKUs", "Throughput Target": "300-600 picks/hr" },
        { "Task": "Packing (box loading)", "Data Volume": "10K-50K episodes", "Key Modalities": "RGB-D + weight + box dimensions", "SKU Diversity Need": "200+ item types", "Throughput Target": "200-400 boxes/hr" },
        { "Task": "Palletizing", "Data Volume": "5K-20K patterns", "Key Modalities": "RGB-D + weight + pallet load sensor", "SKU Diversity Need": "50+ box sizes", "Throughput Target": "1 pallet/2-3 min" },
        { "Task": "Sorting (parcel routing)", "Data Volume": "50K-500K scans", "Key Modalities": "RGB + barcode/label reader + weight + dims", "SKU Diversity Need": "All inbound parcels", "Throughput Target": "2,000-4,000/hr" },
        { "Task": "AMR navigation", "Data Volume": "10K-100K traversals", "Key Modalities": "LiDAR + RGB + wheel odometry", "SKU Diversity Need": "N/A", "Throughput Target": "1-2 m/s with obstacle avoidance" },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Warehouse Robot Learning",
      paragraphs: [
        "Bin picking is the most data-intensive warehouse task and has seen the most learning-based progress. Covariant's AI platform uses a foundation model trained on millions of real pick attempts across customer sites, enabling zero-shot generalization to novel SKUs. Their approach — large-scale real-world data collection with automated labeling (success/failure from sensor readings, not human annotation) — demonstrates the data scaling law for warehouse manipulation: pick success rate increases log-linearly with training data volume, and crossing the commercially viable 99% threshold requires 100K+ labeled picks spanning thousands of SKUs. RightHand Robotics' RightPick system uses a suction-based gripper with learned grasp point selection, processing RGB-D point clouds to identify the best suction point on each item. Their published results show 95% first-attempt success on trained SKU categories, dropping to 85% on novel categories — a gap that closes only with additional training data.",
        "Palletizing has traditionally used geometric planners that compute stable packing patterns from known box dimensions. However, real-world palletizing involves boxes that arrive in unpredictable order, are not always perfectly rectangular (damaged, overstuffed, or irregularly shaped), and must be stacked to maximize pallet stability for transport. Dexterity's AI palletizing system learns stacking policies from demonstrations that handle these real-world variations, using force/torque feedback to detect unstable placements and adjust. Their system requires 5,000-10,000 demonstrated palletizing sequences to learn robust stacking patterns across the range of box sizes and arrival orders encountered in a typical warehouse.",
        "Autonomous mobile robots (AMRs) for goods-to-person represent a different data paradigm. Navigation data is primarily collected through fleet telemetry — every robot in a warehouse fleet generates hundreds of traversals per shift, providing abundant driving data. The challenge is not volume but annotation: extracting near-miss events, congestion patterns, and path efficiency metrics from raw telemetry. Locus Robotics and 6 River Systems operate fleets of thousands of AMRs in customer warehouses, and each robot continuously uploads navigation logs. Training data for AMR path planning comes from this fleet data, supplemented with simulation in digital twins of the warehouse floor plan using tools like NVIDIA Isaac Sim or Gazebo with warehouse-specific plugins.",
        "The emerging frontier is multi-robot coordination. A modern fulfillment center may have 50-200 AMRs navigating simultaneously, plus 5-20 stationary picking and packing arms. Orchestrating this fleet to maximize throughput — avoiding congestion at popular aisles, balancing pick workload across stations, and handling robot failures gracefully — requires coordination data that captures fleet-level dynamics, not just individual robot behavior. This is the least explored area of warehouse automation data, and datasets that capture full-fleet telemetry with pick-station synchronization are extremely rare.",
      ],
    },
    {
      type: "prose",
      heading: "Sensor Stack and Collection Methodology for Warehouse Data",
      paragraphs: [
        "The sensor stack for warehouse picking combines vision, touch, and logistics sensors. For bin picking: overhead RGB-D cameras (Intel RealSense L515 or Photoneo PhoXi for high-resolution structured light) provide scene point clouds, a wrist-mounted camera gives close-up views of the grasp zone, suction cup pressure sensors or parallel-jaw force sensors indicate grip quality, and a barcode/RFID reader identifies the picked item for inventory tracking. For palletizing: overhead cameras capture the pallet loading pattern, a load cell under the pallet measures cumulative weight and center-of-mass shift, and box dimension sensors (typically a light curtain array) measure each box before stacking. For AMR navigation: 2D LiDAR (SICK TiM781 or Hokuyo URG-04LX) provides obstacle detection, wheel encoders give odometry, and optional 3D cameras provide vertical obstacle detection.",
        "Collection in active warehouses is operationally complex. Most collection happens alongside live operations, meaning robots are picking real customer orders. This creates pressure to maintain throughput — the warehouse cannot slow down for data collection. The practical approach is instrumented operation: equip production robots with additional logging capability (higher-frequency sensor recording, video storage, extended telemetry) and capture data during normal operations. Alternatively, set up a dedicated test station with a representative selection of SKUs for controlled data collection during off-peak hours. Claru supports both modes: live-operation instrumentation for high-volume, diverse data, and controlled-station collection for systematic coverage of edge cases (fragile items, oddly shaped products, multi-item picks).",
        "SKU diversity is the most critical data axis and the most expensive to achieve. A production bin-picking dataset must include: rigid boxes (varying sizes from envelope to shoebox), poly-bagged items (deformable, reflective, hard to suction), bottles and cylinders (roll-prone), small items (pills, screws — hard to detect and grasp), heavy items (books, tools — require force-limited motion), and multi-packs (shrink-wrapped bundles). Each SKU category requires 50-200 pick attempts to adequately cover the range of bin positions, orientations, and clutter states. For a 1,000-SKU dataset with 100 attempts per SKU, this is 100,000 pick recordings — a major collection effort that justifies professional data services.",
        "Annotations for warehouse data follow the logistics workflow. Each pick episode is labeled with: SKU identifier (matched to warehouse inventory system), pick success/failure with failure taxonomy (suction seal failure, weight exceeded, item dropped, wrong item picked, bin collision), cycle time (approach to post-place), grasp quality metrics (suction vacuum level or jaw force at lift), and item condition (damaged during pick, label obscured). For palletizing, each box placement is annotated with: box dimensions and weight, placement coordinates on the pallet, stacking stability prediction, and pattern compliance. All annotations are linked to the warehouse management system (WMS) through order ID and timestamp, enabling offline analysis of which SKU categories have the highest failure rates and need additional training data.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Platforms and Datasets for Warehouse Automation",
      columns: ["Platform / Dataset", "Year", "Task", "Scale", "SKU Diversity", "Availability"],
      rows: [
        { "Platform / Dataset": "Covariant AI", "Year": "2023", "Task": "Bin picking", "Scale": "Millions of picks", "SKU Diversity": "10K+ SKUs", "Availability": "Proprietary" },
        { "Platform / Dataset": "RightHand RightPick", "Year": "2023", "Task": "Piece-picking", "Scale": "100K+ picks", "SKU Diversity": "1K+ SKUs", "Availability": "Proprietary" },
        { "Platform / Dataset": "Dex-Net 2.0", "Year": "2017", "Task": "Grasping (generic)", "Scale": "6.7M sim grasps", "SKU Diversity": "1,500 3D models", "Availability": "Public (sim)" },
        { "Platform / Dataset": "GraspNet-1Billion", "Year": "2020", "Task": "Grasping (generic)", "Scale": "1B grasp poses", "SKU Diversity": "88 objects", "Availability": "Public" },
        { "Platform / Dataset": "Warehouse Navigation (Locus)", "Year": "2024", "Task": "AMR navigation", "Scale": "1M+ traversals", "SKU Diversity": "N/A", "Availability": "Proprietary" },
        { "Platform / Dataset": "Claru Custom", "Year": "2026", "Task": "Full warehouse pipeline", "Scale": "10K-500K+ operations", "SKU Diversity": "Custom to spec", "Availability": "Built to spec" },
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        { id: "mahler-dexnet-2017", title: "Dex-Net 2.0: Deep Learning to Plan Robust Grasps with Synthetic Point Clouds and Analytic Grasp Metrics", authors: "Mahler et al.", venue: "RSS 2017", year: 2017, url: "https://arxiv.org/abs/1703.09312" },
        { id: "fang-graspnet-2020", title: "GraspNet-1Billion: A Large-Scale Benchmark for General Object Grasping", authors: "Fang et al.", venue: "CVPR 2020", year: 2020, url: "https://arxiv.org/abs/1912.13470" },
        { id: "zeng-transporter-2021", title: "Transporter Networks: Rearranging the Visual World for Robotic Manipulation", authors: "Zeng et al.", venue: "CoRL 2021", year: 2021, url: "https://arxiv.org/abs/2010.14406" },
        { id: "chi-diffusion-2023", title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion", authors: "Chi et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2303.04137" },
      ],
    },
  ],
  faqs: [
    {
      question: "How many pick attempts are needed for a production-grade bin picking model?",
      answer: "For a narrow SKU range (50-100 products, all rigid boxes), 10,000-20,000 real pick attempts achieve 95%+ success. For broad SKU generalization (1,000+ product types including poly-bags, bottles, and irregularly shaped items), 50,000-200,000 labeled picks are typical based on published results from Covariant and RightHand Robotics. The pick success rate increases log-linearly with data volume — doubling the data typically adds 1-2 percentage points of success rate. For novel SKU zero-shot performance, the critical factor is SKU diversity in training, not total volume per SKU. 100 picks per SKU across 1,000 SKUs outperforms 1,000 picks per SKU across 100 SKUs for generalization.",
    },
    {
      question: "What sensor modalities are essential for warehouse automation data?",
      answer: "For bin picking: RGB-D camera (structured light preferred for high-resolution point clouds of cluttered bins), suction/gripper state sensors, and barcode/RFID reader for SKU identification. For palletizing: overhead camera, load cell, and box dimensioning system. For AMR navigation: 2D LiDAR, wheel encoders, and optionally 3D cameras. All warehouse sensors must handle the environmental conditions: variable lighting (some aisles are dim, loading docks have bright sunlight), temperature variation (cold storage at -25 C, ambient at 15-30 C), and dust/particulates from cardboard processing.",
    },
    {
      question: "How do you handle the long tail of unusual SKUs in warehouse data?",
      answer: "The long tail — the thousands of low-frequency SKUs that each appear rarely but collectively represent 30-40% of picks — is the primary data gap in warehouse automation. We address it through three strategies: (1) Systematic edge-case collection: identify the physical properties that make items hard (deformable, reflective, heavy, tiny, slippery) and collect 200+ picks per difficulty category regardless of specific SKU. (2) Synthetic augmentation: generate simulated point clouds of novel SKU geometries using shape completion models to pretrain the grasp planner. (3) Active learning: instrument the production system to flag failed picks and route those SKUs to a dedicated collection station for focused data gathering.",
    },
    {
      question: "Can simulation data supplement real warehouse data?",
      answer: "Simulation is highly effective for warehouse applications — more so than most other robotics domains — because many warehouse items are rigid with known 3D models. Dex-Net 2.0 achieved strong grasp prediction with 6.7 million simulated grasps, and the sim-to-real gap for structured-light depth images in cluttered bins is smaller than for RGB-dependent tasks. However, simulation cannot capture: poly-bag deformation and reflectance, label peeling and barcode placement variation, and the exact bin clutter distributions that arise from real fulfillment workflows. A practical ratio is 80% simulation for pretraining plus 20% real data for calibration and fine-tuning, with the real data focused on the SKU categories that simulation handles poorly (deformable, transparent, reflective).",
    },
    {
      question: "What throughput metrics should be tracked in warehouse training data?",
      answer: "Every pick or place operation should be annotated with cycle time (seconds from approach initiation to post-place retract), broken into phases: approach (moving to grasp location), grasp (suction engagement or jaw closure), extraction (lifting from bin), transport (moving to target location), and place (releasing into target container). Track throughput at the station level: picks per hour, successful picks per hour, and the ratio between them (effective throughput). For palletizing, track time per box placement and total pallet completion time. These metrics enable comparing model versions not just on accuracy (did the pick succeed?) but on productivity (how fast was it?) — both matter for commercial deployment.",
    },
    {
      question: "How do you integrate warehouse data with WMS (Warehouse Management Systems)?",
      answer: "Warehouse manipulation data becomes significantly more valuable when linked to the warehouse management system through SKU identifiers and order metadata. Each pick episode should be tagged with the SKU barcode or RFID that was scanned during the operation, linking the manipulation data to the product database (dimensions, weight, fragility, material category). This enables analysis at the product category level: which SKU types have the highest failure rates, which need custom grasp strategies, and which can be handled by general-purpose policies. Claru's warehouse collection protocol includes barcode and RFID scanning at both the pick and place stations, with automated matching to the WMS product database. We deliver a SKU-indexed performance summary alongside the raw data, identifying the specific products and product categories that need additional training data to reach target success rates.",
    },
    {
      question: "What temperature extremes must warehouse automation sensors handle?",
      answer: "Warehouse environments span a wide temperature range that consumer-grade sensors cannot handle. Ambient warehouses typically operate at 15-30 C, which is within the operating range of all standard sensors. Chilled distribution centers for fresh produce and dairy operate at 2-8 C, where condensation on camera lenses becomes a significant issue — heated lens enclosures or hydrophobic coatings are required. Frozen storage warehouses at -18 to -25 C challenge most electronic components: camera batteries drain 3-5x faster, LCD screens become sluggish, and thermal contraction can break rigid sensor mounts. Deep-freeze environments at -30 C or below (used for ice cream and some pharmaceuticals) require military-grade electronics or heated enclosures. Claru provides climate-appropriate sensor configurations for each warehouse zone, with thermal management (heated enclosures for cold, ventilated enclosures for hot) and condensation prevention (dry nitrogen purge for transitions between temperature zones).",
    },
  ],
  ctaHeading: "Get a Custom Quote for Warehouse Automation Data",
  ctaDescription: "Tell us your target task (picking, packing, palletizing, sorting), SKU diversity requirements, throughput targets, and warehouse environment. We will design a collection plan covering the product diversity and operational conditions your system needs.",
  relatedGlossaryTerms: ["manipulation-trajectory", "behavioral-cloning", "imitation-learning", "point-cloud"],
  relatedGuidePages: ["how-to-build-a-grasping-dataset", "how-to-build-a-manipulation-dataset"],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "RGB-D (structured light) + suction/gripper state + barcode/RFID + weight sensor + LiDAR (AMR)",
    volumeRange: "10K-500K operation cycles",
    temporalResolution: "30 Hz visual, 100 Hz gripper state, event-based barcode, per-cycle logistics metadata",
    keyAnnotations: ["SKU identification (linked to WMS)", "Pick/place success with failure taxonomy", "Cycle time breakdown by phase", "Grasp quality metrics (vacuum level, jaw force)", "Pallet pattern compliance and stability score"],
  },
  relevantModels: ["Bin picking networks (suction + parallel jaw)", "Dex-Net / GraspNet variants", "Transporter Networks for packing", "Palletizing pattern planners", "AMR navigation and fleet coordination"],
  environmentTypes: ["Fulfillment center", "Sortation facility", "Cold storage (-25 C)", "Cross-dock terminal", "Returns processing center"],
  keyPapers: [
    { id: "mahler-dexnet-2017", title: "Dex-Net 2.0: Deep Learning to Plan Robust Grasps with Synthetic Point Clouds and Analytic Grasp Metrics", authors: "Mahler et al.", venue: "RSS 2017", year: 2017, url: "https://arxiv.org/abs/1703.09312" },
    { id: "fang-graspnet-2020", title: "GraspNet-1Billion: A Large-Scale Benchmark for General Object Grasping", authors: "Fang et al.", venue: "CVPR 2020", year: 2020, url: "https://arxiv.org/abs/1912.13470" },
    { id: "zeng-transporter-2021", title: "Transporter Networks: Rearranging the Visual World for Robotic Manipulation", authors: "Zeng et al.", venue: "CoRL 2021", year: 2021, url: "https://arxiv.org/abs/2010.14406" },
    { id: "chi-diffusion-2023", title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion", authors: "Chi et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2303.04137" },
  ],
  claruRelevance: "Claru collects warehouse automation data through both live-operation instrumentation and controlled test-station collection. For bin picking, we build SKU-diverse datasets spanning 500-5,000+ unique products with automated success/failure labeling from suction pressure and gripper force sensors. For palletizing, we capture full pallet-build sequences with box dimensions, placement coordinates, and stability assessments. Our warehouse collection protocol integrates with WMS systems through SKU identifier matching, enabling direct analysis of which product categories need additional training data. All episodes include cycle-time breakdowns by phase, grasp quality metrics, and failure taxonomy labels. We deliver in RLDS, HDF5, or custom formats with sensor calibration, SKU metadata linked to product databases, and stratified splits by SKU category, difficulty level, and warehouse zone. Typical turnaround is 4-8 weeks for datasets of 50,000+ pick episodes.",
};

export default data;
