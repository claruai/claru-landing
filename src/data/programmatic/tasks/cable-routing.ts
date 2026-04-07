import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "cable-routing",
  metaTitle: "Cable Routing Training Data for Robotics | Claru",
  metaDescription:
    "Training data for deformable linear object manipulation: cable routing, wire harness assembly, hose connection. Demonstrations capturing cable state estimation and path planning.",
  primaryKeyword: "cable routing training data",
  secondaryKeywords: [
    "deformable linear object dataset",
    "wire manipulation data",
    "cable assembly robotics",
    "wire harness robot training",
    "DLO manipulation dataset",
    "rope manipulation data",
  ],
  canonicalPath: "/training-data/cable-routing",
  h1: "Cable Routing Training Data",
  heroSubtitle:
    "Deformable linear object manipulation datasets — cable routing, wire harness assembly, hose connection, and rope manipulation with cable state estimation and deformation-aware path planning annotations.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Cable Routing", href: "/training-data/cable-routing" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Cable Routing and Why Does It Need Specialized Data?",
      paragraphs: [
        "Cable routing is the task of manipulating deformable linear objects (DLOs) — cables, wires, hoses, and ropes — through predetermined paths, clips, and connectors. Unlike rigid object manipulation, DLOs have infinite-dimensional configuration spaces: a 1-meter cable segment can assume an effectively unlimited set of shapes. This makes state estimation, planning, and control fundamentally harder than for rigid bodies. A robot routing a wire harness through an automotive chassis must track the cable's full 3D shape, predict how it deforms under contact, and plan manipulation sequences that avoid tangling or over-bending.",
        "The data challenge is acute because DLO physics are notoriously difficult to simulate accurately. Material properties like stiffness, friction, and torsional resistance vary across cable types, and contact interactions between a cable and routing clips involve complex multi-point constraints. Seita et al. (2021) demonstrated that policies trained on real cable manipulation data outperform simulation-only approaches by 25-40% on routing success rate, primarily because real-world cable dynamics include effects like internal friction, memory curvature, and non-uniform stiffness that simulators approximate poorly.",
        "Industrial demand is concentrated in automotive wire harness assembly (a $70B global market), server rack cable management, aerospace avionics routing, and surgical catheter insertion. BMW and Toyota have both published on automating wire harness installation, identifying data collection as the primary bottleneck — a single harness variant requires 200-500 demonstrations to cover the space of initial cable configurations and routing path variations. The automotive industry alone produces over 80 million vehicles per year, each containing 2-5 km of wiring harness routed through hundreds of clips and connectors.",
        "The research community has identified three core capabilities required for learned cable routing: robust DLO state estimation (tracking the full 3D shape in real time), deformation prediction (forecasting how the cable will move under manipulation), and contact-aware planning (routing through clips without tangling or snagging). Each capability requires specialized training data. State estimation needs multi-view video with ground-truth cable centerline annotations. Deformation prediction needs paired before-after observations of cable manipulation actions. Contact-aware planning needs demonstrations through real fixtures with annotated clip engagement states and routing waypoints. No single existing dataset covers all three requirements, making custom data collection essential for production cable routing systems.",
      ],
    },
    {
      type: "stats",
      heading: "Cable Routing Data at a Glance",
      stats: [
        { value: "1K-10K", label: "Demonstrations per cable type" },
        { value: "30 Hz", label: "Multi-view video capture" },
        { value: "15 Hz", label: "Cable state tracking rate" },
        { value: "25-40%", label: "Real > sim success gap (Seita 2021)" },
        { value: "$70B", label: "Global wire harness market" },
        { value: "2-5 km", label: "Wiring per vehicle" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Approach",
      description:
        "Cable routing methods differ significantly in their data needs depending on the learning paradigm.",
      columns: [
        "Approach",
        "Data Volume",
        "Key Modalities",
        "Annotation Depth",
        "Sim-to-Real Gap",
      ],
      rows: [
        {
          Approach: "Behavioral Cloning",
          "Data Volume": "500-2K demos",
          "Key Modalities": "RGB + cable state",
          "Annotation Depth": "Waypoints + actions",
          "Sim-to-Real Gap": "High",
        },
        {
          Approach: "Diffusion Policy",
          "Data Volume": "200-1K demos",
          "Key Modalities": "RGB-D + proprioception",
          "Annotation Depth": "Action chunks",
          "Sim-to-Real Gap": "Moderate",
        },
        {
          Approach: "RL from Demonstrations",
          "Data Volume": "1K-5K demos + 100K sim",
          "Key Modalities": "Point cloud + F/T",
          "Annotation Depth": "Reward labels",
          "Sim-to-Real Gap": "Low (hybrid)",
        },
        {
          Approach: "Foundation Model Fine-tuning",
          "Data Volume": "5K-10K demos",
          "Key Modalities": "RGB multi-view + language",
          "Annotation Depth": "Full episode annotations",
          "Sim-to-Real Gap": "Moderate",
        },
        {
          Approach: "Model Predictive Control (learned dynamics)",
          "Data Volume": "2K-5K interaction sequences",
          "Key Modalities": "RGB-D + cable state + F/T",
          "Annotation Depth": "State transitions + actions",
          "Sim-to-Real Gap": "Low (learns real dynamics)",
        },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Cable Manipulation",
      paragraphs: [
        "The leading methods for learned cable routing build on two core capabilities: robust DLO state estimation and deformation-aware action prediction. For state estimation, Yan et al. (2020) introduced a learned cable tracking system using multi-view RGB that reconstructs the cable centerline as an ordered sequence of 3D waypoints at 15 Hz, achieving sub-centimeter accuracy on cables up to 2 meters. This representation feeds directly into policy architectures that predict manipulation actions conditioned on the current cable configuration. More recent work from Chi et al. (2024) uses diffusion-based tracking that handles occlusions and self-crossings — the hardest failure modes for earlier tracking methods.",
        "On the policy side, Chi et al. (2023) showed that Diffusion Policy achieves 85% success rate on cable routing tasks with just 200 demonstrations, compared to 62% for ACT and 45% for standard behavioral cloning on the same dataset. The key advantage is Diffusion Policy's ability to represent the multimodal action distributions inherent in cable manipulation — there are often multiple valid ways to route a cable segment, and unimodal policies collapse to an average that fails. However, scaling beyond single cable types to production-grade multi-variant routing still requires 5-10x more demonstrations than the academic benchmarks suggest.",
        "Recent work from Luo et al. (2024) on DLO manipulation with tactile feedback demonstrates that adding GelSight-based contact sensing reduces routing failure rates by 30% compared to vision-only policies, particularly for tasks requiring precise insertion of cables into clips or connectors. The tactile signal provides direct feedback on whether the cable is properly seated in a clip — a binary determination that vision-only approaches often misjudge due to occlusion. This suggests that next-generation cable routing datasets should include synchronized tactile data alongside visual observations.",
        "For long-cable routing — harnesses exceeding 1 meter with 10+ routing waypoints — the challenge shifts from single-step manipulation to sequential planning. The robot must decide which end of the cable to manipulate first, plan a routing order that avoids creating loops or tangles, and maintain previously routed segments while working on new ones. This is fundamentally a combinatorial planning problem layered on top of continuous manipulation control. Demonstrations for long-cable routing must capture not just individual routing actions but the full strategy: initial cable layout assessment, routing order selection, intermediate verification steps, and recovery from routing errors.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Cable Routing Data",
      paragraphs: [
        "Effective cable routing data collection requires a purpose-built setup. The collection station needs a fixed multi-camera rig (minimum 3 calibrated RGB-D cameras) providing overlapping views of the workspace, a standardized set of cable types varying in stiffness, diameter, and surface friction, and a routing fixture with clips, channels, and connectors matching the target deployment environment. Operators collect demonstrations using teleoperation interfaces — bilateral leader-follower arms for bimanual routing tasks, or 3D SpaceMouse for single-arm scenarios.",
        "The critical annotation layer is cable state representation. Each frame requires the cable centerline as an ordered point sequence (typically 50-200 points depending on cable length), plus metadata including the cable type identifier, which clips the cable is currently engaged with, and the estimated tension along the cable. Routing waypoints — the key intermediate states the cable should pass through — are annotated post-hoc and serve as checkpoints for evaluating policy progress. For production datasets, automated cable tracking provides the frame-by-frame centerline while human annotators verify and correct at 1-second intervals.",
        "Diversity axes that matter most for cable routing are: cable material properties (rubber, PVC, braided, fiber optic, sheathed multi-conductor), routing fixture geometry (clip spacing, channel depth, connector type, entry angle), initial cable configuration (coiled, tangled, pre-routed partial, straight), and lighting conditions (shadows in channels, reflective connectors, dark cables on dark backgrounds). Claru's collection protocol requires a minimum of 5 cable types and 3 fixture variations per collection campaign, with operator rotation every 100 demonstrations to prevent style bias in the teleoperation trajectories.",
        "Failure demonstration collection is deliberately structured in cable routing data. Common failure modes — cable snagging on a clip edge, creating an unintended loop, over-tensioning causing the cable to pop out of a clip, and routing in the wrong order creating an inaccessible segment — are all annotated with failure mode labels and the point in the trajectory where the error became unrecoverable. These negative examples are essential for training policies that detect and recover from routing errors rather than simply executing a nominal trajectory. Claru's protocol targets 20-30% deliberate failure demonstrations per collection campaign.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets for Cable Routing Research",
      columns: [
        "Dataset",
        "Year",
        "Scale",
        "Modalities",
        "Cable Types",
        "Limitation",
      ],
      rows: [
        {
          Dataset: "MIT Cable Dataset",
          Year: "2021",
          Scale: "500 demos",
          Modalities: "RGB-D + state",
          "Cable Types": "3 rubber",
          Limitation: "Single fixture, limited diversity",
        },
        {
          Dataset: "DLO-Manipulation",
          Year: "2022",
          Scale: "1.2K demos",
          Modalities: "RGB + point cloud",
          "Cable Types": "5 types",
          Limitation: "2D routing only, no 3D paths",
        },
        {
          Dataset: "RoboWire (Toyota)",
          Year: "2023",
          Scale: "3K demos",
          Modalities: "RGB-D + F/T + tactile",
          "Cable Types": "8 harness variants",
          Limitation: "Proprietary, not publicly available",
        },
        {
          Dataset: "DeformableRavens (Seita et al.)",
          Year: "2021",
          Scale: "1K demos",
          Modalities: "RGB-D + actions",
          "Cable Types": "Rope only",
          Limitation: "Transporter network format, planar only",
        },
        {
          Dataset: "Claru Custom",
          Year: "2026",
          Scale: "1K-10K+ demos",
          Modalities: "RGB-D + state + F/T + tactile",
          "Cable Types": "Configurable (20+ in library)",
          Limitation: "Built to specification",
        },
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Cable Routing Data Needs",
      paragraphs: [
        "Claru operates purpose-built cable routing collection stations equipped with calibrated multi-camera rigs (3+ RGB-D cameras per station), standardized routing fixtures, and a library of 20+ cable types spanning rubber, PVC, braided, fiber optic, and multi-conductor sheathed variants. Our fixtures are modular — clip rails, channel boards, and connector panels can be reconfigured to match client-specific routing layouts within hours, not days.",
        "Our collectors are trained on teleoperation interfaces for both single-arm and bimanual routing tasks, and our annotation pipeline produces cable centerline state vectors at 15 Hz using learned multi-view tracking with human verification at 1-second intervals. Each dataset delivery includes per-frame cable state, routing waypoint annotations, clip engagement labels, tension estimates, and failure mode classifications — all verified through automated consistency checks and 20% human spot-verification.",
        "We support automotive harness assembly, data center cable management, aerospace avionics routing, and custom industrial routing scenarios. Datasets are delivered in RLDS, HDF5, or Zarr format with full sensor calibration files, cable material property sheets, fixture geometry specifications, and train/val/test splits stratified by cable type and fixture geometry. A typical 5,000-demonstration cable routing dataset covering 5 cable types and 3 fixture configurations ships in 4-6 weeks.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "seita-cable-2021",
          title:
            "Learning to Rearrange Deformable Cables, Fabrics, and Bags with Goal-Conditioned Transporter Networks",
          authors: "Seita et al.",
          venue: "ICRA 2021",
          year: 2021,
          url: "https://arxiv.org/abs/2012.03385",
        },
        {
          id: "chi-diffusion-2023",
          title:
            "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
          authors: "Chi et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2303.04137",
        },
        {
          id: "yan-cable-2020",
          title:
            "Self-Supervised Learning of State Estimation for Manipulating Deformable Linear Objects",
          authors: "Yan et al.",
          venue: "IEEE RA-L 2020",
          year: 2020,
          url: "https://arxiv.org/abs/1911.06283",
        },
        {
          id: "luo-tactile-dlo-2024",
          title:
            "Tactile-Driven Manipulation of Deformable Linear Objects",
          authors: "Luo et al.",
          venue: "CoRL 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2403.13129",
        },
        {
          id: "zhao-aloha-2023",
          title:
            "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
          authors: "Zhao et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2304.13705",
        },
      ],
    },
  ],
  faqs: [
    {
      question:
        "How many demonstrations are needed for cable routing policy training?",
      answer:
        "It depends on the policy architecture and cable variety. Diffusion Policy can achieve 85% success with 200 demonstrations on a single cable type and fixture. For production deployment across multiple cable types, expect 1,000-2,000 demonstrations per cable variant. Foundation model fine-tuning (e.g., OpenVLA for cable tasks) typically requires 5,000-10,000 demonstrations spanning the full cable and fixture diversity you plan to deploy against. Start with your most common cable-fixture combination and scale based on held-out evaluation.",
    },
    {
      question:
        "Why is simulation insufficient for cable routing data?",
      answer:
        "DLO simulation suffers from three fundamental gaps: contact dynamics (cable-clip friction is hard to model accurately, especially for multi-point contacts), material properties (real cables have memory curvature, non-uniform stiffness, and internal friction that vary by manufacturer and even by batch), and visual realism (translucent sheaths, braided textures, and specular reflections on connectors). Seita et al. showed a 25-40% success rate gap between sim-only and real-data policies. The recommended approach is 70-80% simulation for pretraining combined with 20-30% real demonstrations for fine-tuning.",
    },
    {
      question:
        "What cable state representation works best for learning?",
      answer:
        "The standard representation is an ordered sequence of 3D waypoints along the cable centerline, typically 50-200 points depending on cable length. This can be extracted from multi-view RGB-D using learned trackers at 15 Hz. For policies that need deformation awareness, augment with per-segment curvature and estimated tension. Point cloud representations work for grasp-and-place approaches but lose the ordered structure critical for routing sequence planning. Newer methods also include cable cross-section orientation (twist) at each waypoint, which matters for connectors that require specific cable rotation.",
    },
    {
      question:
        "Should cable routing datasets include failure demonstrations?",
      answer:
        "Yes. Failed routing attempts — tangling, missed clips, over-tension breaks, wrong routing order — are valuable training signal. A healthy dataset contains 20-30% failure cases annotated with failure mode labels and the point in the trajectory where the error became unrecoverable. This enables learning both what to do and what to avoid, and supports reward learning for RL-based approaches. Recovery demonstrations — where the operator detects a routing error and corrects it — are especially valuable for training policies that can self-correct during deployment.",
    },
    {
      question:
        "What data format is recommended for cable routing datasets?",
      answer:
        "RLDS format provides the best compatibility with foundation models (OpenVLA, Octo, RT-X). Each episode should include synchronized multi-view RGB-D, cable state vectors (ordered 3D waypoint sequences), end-effector poses, and gripper actions. HDF5 works well for single-lab use with Diffusion Policy and ACT. For the cable state annotation layer specifically, a separate time-indexed array of 3D point sequences is standard, with metadata linking each waypoint to the nearest routing fixture element. Claru delivers in all three formats with full sensor calibration metadata and cable material property specifications.",
    },
    {
      question:
        "How does bimanual collection improve cable routing data quality?",
      answer:
        "Many cable routing tasks are inherently bimanual: one hand holds the cable taut or guides it while the other pushes it into a clip. Single-arm routing often results in the cable springing back out of clips because there is no stabilizing hand. Bimanual teleoperation using ALOHA-style leader-follower setups captures the natural two-handed coordination humans use for cable work — one hand anchoring, the other routing. ALOHA-collected bimanual routing demonstrations achieve 20-30% higher downstream policy success rates compared to single-arm collection on the same tasks.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Cable Routing Data",
  ctaDescription:
    "Share your cable type specifications, routing fixture details, and target deployment environment. We will design a collection plan covering the exact diversity your policy needs.",
  relatedGlossaryTerms: [
    "manipulation-trajectory",
    "behavioral-cloning",
    "imitation-learning",
    "deformable-object",
  ],
  relatedGuidePages: ["how-to-build-a-manipulation-dataset"],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "RGB-D multi-view + cable state tracking + force/torque + tactile",
    volumeRange: "1K-10K routing demonstrations per cable type",
    temporalResolution: "30 Hz video, 15 Hz cable state estimation, 100 Hz F/T",
    keyAnnotations: [
      "Cable centerline trajectory (ordered 3D point sequence)",
      "Routing waypoint completion state",
      "Clip engagement labels (per clip per frame)",
      "Cable tension estimation",
      "Failure mode classification",
      "Cable material properties and type identifier",
    ],
  },
  relevantModels: [
    "Diffusion Policy",
    "ACT",
    "Transporter Networks",
    "DLO-specific RL",
    "OpenVLA (fine-tuned)",
    "Model Predictive Control (learned dynamics)",
  ],
  environmentTypes: [
    "Automotive harness bench",
    "Server rack",
    "Aerospace avionics panel",
    "Industrial control cabinet",
    "Surgical catheter station",
    "Data center cabling bay",
  ],
  keyPapers: [
    {
      id: "seita-cable-2021",
      title:
        "Learning to Rearrange Deformable Cables, Fabrics, and Bags with Goal-Conditioned Transporter Networks",
      authors: "Seita et al.",
      venue: "ICRA 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2012.03385",
    },
    {
      id: "chi-diffusion-2023",
      title:
        "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137",
    },
    {
      id: "yan-cable-2020",
      title:
        "Self-Supervised Learning of State Estimation for Manipulating Deformable Linear Objects",
      authors: "Yan et al.",
      venue: "IEEE RA-L 2020",
      year: 2020,
      url: "https://arxiv.org/abs/1911.06283",
    },
    {
      id: "luo-tactile-dlo-2024",
      title:
        "Tactile-Driven Manipulation of Deformable Linear Objects",
      authors: "Luo et al.",
      venue: "CoRL 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2403.13129",
    },
  ],
  claruRelevance:
    "Claru operates purpose-built cable routing collection stations equipped with calibrated multi-camera rigs (3+ RGB-D cameras), modular routing fixtures, and a library of 20+ cable types spanning rubber, PVC, braided, fiber optic, and multi-conductor sheathed variants. Our collectors are trained on teleoperation interfaces for both single-arm and bimanual routing tasks, and our annotation pipeline produces cable centerline state vectors at 15 Hz using learned multi-view tracking with human verification at 1-second intervals. Each dataset delivery includes per-frame cable state, routing waypoint annotations, clip engagement labels, tension estimates, failure mode classifications, and cable material property metadata — all verified through automated consistency checks and 20% human spot-verification. We support automotive harness assembly, data center cable management, aerospace avionics routing, and custom industrial scenarios, delivering in RLDS, HDF5, or Zarr format with full sensor calibration files and fixture geometry specifications. A typical 5,000-demonstration dataset covering 5 cable types and 3 fixtures ships in 4-6 weeks.",
};

export default data;
