import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "stacking",
  metaTitle: "Stacking Task Training Data for Robotics | Claru",
  metaDescription:
    "Training data for robotic stacking: block towers, plate stacking, pallet layering. Stability-aware manipulation demonstrations with contact physics and balance reasoning.",
  primaryKeyword: "robotic stacking training data",
  secondaryKeywords: [
    "stacking task dataset",
    "robot stacking demonstrations",
    "block stacking training data",
    "stability-aware manipulation dataset",
    "tower building robot data",
    "pallet stacking automation data",
  ],
  canonicalPath: "/training-data/stacking",
  h1: "Stacking Task Training Data",
  heroSubtitle:
    "Stacking datasets for robotic manipulation research and industrial automation — block towers, plate stacking, pallet layering, and multi-object stability reasoning with contact physics annotations and balance prediction labels.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Stacking Task", href: "/training-data/stacking" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Robotic Stacking and Why Does Data Matter?",
      paragraphs: [
        "Stacking — placing objects on top of each other to form stable structures — is a foundational manipulation skill that tests a robot's understanding of gravity, friction, contact geometry, and structural stability. From building a 6-block tower to layering mixed-size boxes on a pallet, stacking requires the robot to predict whether a placement will result in a stable configuration or a collapse. This is fundamentally a physics reasoning problem: the center of mass must remain within the support polygon, contact surfaces must provide sufficient friction, and the placement must be accurate enough that cumulative errors do not cause the tower to topple as it grows taller.",
        "Stacking benchmarks have become a standard evaluation in robot learning research precisely because they isolate key manipulation competencies. The Block Stacking benchmark in RLBench (James et al., 2020) requires a robot to stack colored blocks in a specified order, testing both grasp planning and placement precision. Performance on this task correlates strongly with general manipulation capability — policies that achieve 90%+ stacking success typically also excel on other contact-rich tasks. The reason is that stacking demands accurate pose estimation, gentle placement with controlled descent speed, and real-time stability assessment — skills that transfer broadly.",
        "Industrial stacking applications extend far beyond toy blocks. Palletizing — arranging boxes, cases, and bags onto pallets for shipping — is a $3.2 billion market segment within warehouse automation. Mixed-case palletizing, where boxes of different sizes must be arranged into stable, space-efficient layers, remains largely manual because heuristic algorithms struggle with the combinatorial complexity of heterogeneous item arrangements. The Robotics Industry Association reports that palletizing robots handle only 15-20% of warehouse palletizing operations, with the remainder performed by human workers at an average cost of $18-25 per hour. Learning-based stacking policies that reason about stability across diverse object geometries could unlock the remaining 80% of this market.",
        "The core data challenge is that stability is a binary outcome that depends on continuous physical parameters. A 1-mm shift in placement position can mean the difference between a stable 8-block tower and a collapse at block 5. Force profiles during placement — the contact force, settling time, and post-placement vibration — contain critical information about whether the structure is marginally stable or robustly stable. Demonstrations must capture not just the final placement pose but the approach trajectory, descent speed, release timing, and post-placement dynamics to teach policies the full physics of stable stacking.",
      ],
    },
    {
      type: "stats",
      heading: "Stacking Data by the Numbers",
      stats: [
        { value: "$3.2B", label: "Palletizing robot market size (2024)" },
        { value: "90%+", label: "Stacking success rate for strong manipulation policies" },
        { value: "1 mm", label: "Placement accuracy threshold for tall towers" },
        { value: "80%", label: "Palletizing still done manually in warehouses" },
        { value: "100-500", label: "Demos per object set for block stacking BC" },
        { value: "6-axis", label: "Force/torque DOF for placement stability" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Stacking Approach",
      description:
        "Stacking policies range from simple behavioral cloning to physics-informed methods that reason explicitly about stability. Data needs vary accordingly.",
      columns: [
        "Approach",
        "Data Volume",
        "Key Modalities",
        "Stability Signal",
        "Strengths",
      ],
      rows: [
        {
          Approach: "Behavioral Cloning",
          "Data Volume": "100-500 demos per tower height",
          "Key Modalities": "RGB-D + proprioception",
          "Stability Signal": "Implicit in demo success",
          Strengths: "Simple; works for fixed object sets",
        },
        {
          Approach: "Diffusion Policy",
          "Data Volume": "50-200 demos per configuration",
          "Key Modalities": "Multi-view RGB + proprioception",
          "Stability Signal": "Multimodal placement distribution",
          Strengths: "Handles placement ambiguity; multiple stable positions",
        },
        {
          Approach: "Physics-informed RL",
          "Data Volume": "500K+ sim episodes + 100 real demos",
          "Key Modalities": "Sim physics state + real force/torque",
          "Stability Signal": "Physics simulator + stability reward",
          Strengths: "Generalizes to novel objects; explicit stability reasoning",
        },
        {
          Approach: "Sim-to-Real with IsaacGym",
          "Data Volume": "1M+ sim episodes + 200 real calibration",
          "Key Modalities": "Sim contact + real RGB-D for domain gap",
          "Stability Signal": "Ground-truth physics in simulation",
          Strengths: "Scalable; diverse object geometry coverage",
        },
        {
          Approach: "Foundation model stacking (RT-2, Octo)",
          "Data Volume": "5K-20K demos + language instructions",
          "Key Modalities": "RGB + language + proprioception",
          "Stability Signal": "Learned from large-scale pretraining",
          Strengths: "Language-conditioned; zero-shot to new objects",
        },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Learned Stacking",
      paragraphs: [
        "RLBench (James et al., 2020) established block stacking as a standard benchmark, with the task requiring a robot arm to stack colored cubes in a specified order. Early behavioral cloning methods achieved 30-50% success on 3-block towers, but modern architectures have dramatically improved. PerAct (Shridhar et al., 2023) uses a 3D voxel-based perceiver to predict next-best actions and achieves 82% success on the RLBench stack_blocks task with 100 demonstrations. The key insight is that 3D spatial reasoning, rather than 2D image features, enables accurate placement prediction for tasks where vertical precision matters.",
        "ACT (Action Chunking with Transformers, Zhao et al., 2023) demonstrated that predicting action sequences rather than single actions dramatically improves stacking performance. On a real-robot block stacking task with the ALOHA bimanual platform, ACT achieved 96% success on 2-block stacking and 78% on 4-block towers using only 50 teleoperated demonstrations. The action chunking approach smooths the transition between approach and placement phases, avoiding the jerky motions that cause instability during block release — a critical failure mode in naive frame-by-frame policies.",
        "For industrial palletizing, DeepMind's work on robotic stacking (Lee et al., 2021) demonstrated multi-object stacking policies learned entirely from simulation. Training in MuJoCo with domain randomization over object sizes, masses, and friction coefficients, their SAC-based policy achieved 85% success on stacking 5 diverse objects into stable configurations in the real world. The 15% failure rate was dominated by thin, flat objects where the contact surface was too small for stable support — a case where real demonstration data showing human strategies for handling thin objects would directly address the failure mode.",
        "The most recent advance combines vision-language models with physical reasoning for instruction-conditioned stacking. SayCan (Ahn et al., 2022) and RT-2 (Brohan et al., 2023) demonstrate that foundation models can decompose high-level stacking instructions ('build a pyramid with red blocks on the bottom') into primitive stacking actions. RT-2 achieves 73% success on novel stacking configurations described in natural language, compared to 23% for the non-VLM baseline. However, these models still struggle with tall structures (5+ objects) where cumulative placement error exceeds stability margins, highlighting the need for precise placement demonstrations.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Stacking Data",
      paragraphs: [
        "Stacking data collection requires precise tracking of both the robot end-effector and the objects being stacked. The minimum sensor setup includes a calibrated overhead RGB-D camera for tracking object poses on the workspace, a wrist-mounted camera for close-range placement guidance, and optionally a 6-axis force/torque sensor at the wrist to capture placement forces and detect instability. Object pose tracking accuracy should be 1 mm or better — achievable with AprilTag fiducial markers on the objects or high-resolution structured-light sensors. For tall tower experiments, a side-mounted camera is essential to observe the tower profile and detect lean or tilt before collapse.",
        "Demonstrations should cover the full spectrum of stacking complexity: 2-object stacks (baseline placement precision), 3-5 object towers (cumulative error management), mixed-size stacking (support polygon reasoning), and unstable object stacking (non-convex bases, round objects). For each configuration, collect both successful demonstrations and near-failure demonstrations where the tower is marginally stable — these edge cases teach the policy the boundary between stable and unstable placements. Record 50-200 demonstrations per configuration, with 20% of demonstrations intentionally including recovery behaviors (nudging a misaligned object, re-grasping after a near-drop).",
        "Annotations for stacking data must capture per-placement stability information: pre-placement tower height and center-of-mass estimate, placement pose (6-DoF relative to the support surface), post-placement settling time (time from release to zero velocity), tower lean angle after placement, and binary stability label (does the tower survive a 5-second observation period without collapse). For force-instrumented setups, annotate the impact force at contact, the damping profile during descent, and the steady-state load distribution. These stability annotations enable reward shaping for RL fine-tuning and quality filtering for behavioral cloning.",
        "For industrial palletizing data, the collection setup scales to full-size boxes (up to 600 mm x 400 mm x 400 mm) on standard 1200 mm x 1000 mm pallets. Overhead structured-light scanning after each box placement captures the evolving pallet surface profile. The key challenge is layer transitions — starting a new layer on top of a completed layer requires precise placement to distribute weight evenly and maintain stack stability. Collect demonstrations that cover single-SKU palletizing (uniform boxes), mixed-SKU palletizing (2-5 box sizes), and interlocking patterns (alternating box orientations for cross-layer stability).",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets and Benchmarks for Robotic Stacking",
      description:
        "Stacking appears in many manipulation benchmarks, but few datasets focus specifically on stacking with stability annotations.",
      columns: [
        "Dataset / Benchmark",
        "Year",
        "Scale",
        "Object Types",
        "Key Features",
        "Limitations",
      ],
      rows: [
        {
          "Dataset / Benchmark": "RLBench stack_blocks (James et al.)",
          Year: "2020",
          Scale: "100-200 demos + unlimited sim generation",
          "Object Types": "Colored cubes (fixed size)",
          "Key Features": "Standardized benchmark; multiple color orders",
          Limitations: "Only uniform cubes; no stability metrics",
        },
        {
          "Dataset / Benchmark": "ALOHA stacking (Zhao et al.)",
          Year: "2023",
          Scale: "50 demonstrations per task variant",
          "Object Types": "Cubes, cylinders, cups",
          "Key Features": "Bimanual; real robot; action chunking",
          Limitations: "Small scale; limited object diversity",
        },
        {
          "Dataset / Benchmark": "ManiSkill2 stacking",
          Year: "2023",
          Scale: "100K+ sim episodes",
          "Object Types": "YCB objects + procedural shapes",
          "Key Features": "Diverse objects; sim physics; large scale",
          Limitations: "Sim-only; no real stability data",
        },
        {
          "Dataset / Benchmark": "DeepMind stacking (Lee et al.)",
          Year: "2021",
          Scale: "Sim training + real evaluation",
          "Object Types": "5 diverse household objects",
          "Key Features": "Multi-object; real-world transfer",
          Limitations: "Not publicly released; limited object count",
        },
        {
          "Dataset / Benchmark": "LIBERO stacking subtasks",
          Year: "2023",
          Scale: "50 demos per subtask",
          "Object Types": "Tabletop objects in LIBERO suite",
          "Key Features": "Lifelong learning benchmark; multi-task",
          Limitations: "Stacking is one of many tasks; limited focus",
        },
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Stacking Data Needs",
      paragraphs: [
        "Claru provides stacking data collection covering the full range from research block-stacking benchmarks to industrial palletizing demonstrations. Our workstations are equipped with calibrated multi-view cameras (overhead + side + wrist-mounted at 30 Hz), optional 6-axis force/torque sensing at the wrist for placement force capture, and precision object tracking via fiducial markers or structured-light scanning with sub-millimeter accuracy. For palletizing data, we operate full-scale stations with standard pallets, real shipping boxes, and overhead scanning for pallet surface profiling.",
        "Our operators are trained on stacking protocols that emphasize placement precision and stability awareness. Each demonstration is quality-scored on placement accuracy (deviation from target pose), tower stability (post-placement settling time and lean angle), and completion rate (successful tower height versus target). We collect demonstrations across configurable difficulty levels: baseline 2-3 object stacks, challenging 5-8 object towers, mixed-geometry stacking, and recovery behaviors from near-failure states.",
        "Claru delivers stacking datasets with per-placement stability annotations, 6-DoF object poses, tower profile measurements, and optional force data — formatted for direct ingestion by PerAct, ACT/ALOHA, Diffusion Policy, or RL fine-tuning pipelines. For palletizing clients, we provide layer-by-layer packing patterns, box placement sequences, and pallet stability metrics. Our collection throughput of 300-800 stacking demonstrations per day per station enables rapid dataset scaling for both research and production applications.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "james-rlbench-2020",
          title: "RLBench: The Robot Learning Benchmark & Learning Environment",
          authors: "James et al.",
          venue: "RA-L 2020",
          year: 2020,
          url: "https://arxiv.org/abs/1909.12271",
        },
        {
          id: "zhao-act-2023",
          title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
          authors: "Zhao et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2304.13705",
        },
        {
          id: "shridhar-peract-2023",
          title: "Perceiver-Actor: A Multi-Task Transformer for Robotic Manipulation",
          authors: "Shridhar et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2209.05451",
        },
        {
          id: "lee-stacking-2021",
          title: "Beyond Pick-and-Place: Tackling Robotic Stacking of Diverse Shapes",
          authors: "Lee et al.",
          venue: "CoRL 2021",
          year: 2021,
          url: "https://arxiv.org/abs/2110.06192",
        },
        {
          id: "brohan-rt2-2023",
          title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
          authors: "Brohan et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2307.15818",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "How many demonstrations are needed for block stacking?",
      answer:
        "For uniform cube stacking, 50-100 demonstrations per target height (2-block, 3-block, etc.) suffice with ACT or Diffusion Policy. For mixed-object stacking with diverse geometries, 200-500 demonstrations per object set are recommended. PerAct achieves 82% success on RLBench stack_blocks with 100 demos. Start with 50 demonstrations of your target configuration to validate the pipeline, then scale to 200+ for production reliability above 90%.",
    },
    {
      question: "Is force/torque data necessary for stacking?",
      answer:
        "Force data significantly improves placement quality but is not strictly required for simple stacking. Vision-only policies achieve 70-85% success on 3-block towers. Force/torque data becomes critical for tall towers (5+ objects) where gentle placement with controlled descent is essential to avoid toppling, and for industrial palletizing where box weight varies and contact forces indicate whether the placement is properly seated. If you have force sensors, collect the data — it improves success rates by 10-15 percentage points on challenging configurations.",
    },
    {
      question: "Can stacking policies transfer across object shapes?",
      answer:
        "Transfer depends on the policy architecture. Position-regression methods (standard BC) show poor transfer — a policy trained on cubes achieves only 30-40% success on cylinders. 3D-aware architectures like PerAct transfer better (60-70% success on novel shapes) because they reason about support surfaces in voxel space. The best transfer comes from physics-informed methods trained on diverse object sets in simulation with 10-20% real demonstrations for domain adaptation. Include at least 5 distinct object geometries in your training data for reasonable generalization.",
    },
    {
      question: "How do you handle tower collapse during data collection?",
      answer:
        "Tower collapses during demonstration are valuable negative examples — include them in the dataset with a failure label and collapse-frame annotation. Aim for 70-85% success rate in raw data collection. If success exceeds 95%, the operator is being too conservative (short towers, centered placements only) and the dataset lacks the challenging edge cases needed for robust training. After a collapse, have the operator rebuild from scratch rather than resuming — this captures the full stacking sequence from the beginning.",
    },
    {
      question: "What placement accuracy is needed for tall towers?",
      answer:
        "Each placement adds positional error. For a 6-block tower with 50 mm cubes, a 2 mm per-placement error accumulates to 12 mm total offset at the top — enough to shift the center of mass outside the support polygon and cause collapse. Target 1 mm or better placement accuracy for towers above 4 objects. Track accuracy using fiducial markers or structured-light scanning after each placement. For palletizing, tolerance is more relaxed (5-10 mm) because box sizes are larger and layer interlocking provides lateral stability.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Stacking Task Data",
  ctaDescription:
    "Tell us about your stacking requirements — object types, target heights, and stability criteria — and we will design a data collection plan for your specific application.",
  relatedGlossaryTerms: [
    "contact-rich-manipulation",
    "manipulation-trajectory",
    "behavioral-cloning",
    "sim-to-real-gap",
    "proprioceptive-data",
  ],
  relatedGuidePages: [
    "how-to-build-a-manipulation-dataset",
    "how-to-label-robot-demonstrations",
  ],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "RGB-D + proprioception + object poses + optional force/torque",
    volumeRange: "100-500 demonstrations per configuration",
    temporalResolution: "30 Hz video, per-placement object pose snapshots, stability annotations",
    keyAnnotations: [
      "Per-placement 6-DoF object pose relative to support surface",
      "Post-placement stability label and settling time",
      "Tower height and lean angle measurements",
      "Object identity, dimensions, and weight",
      "Placement force profile (if force-instrumented)",
      "Success/failure with collapse-frame annotation",
    ],
  },
  relevantModels: [
    "PerAct",
    "ACT / ALOHA",
    "Diffusion Policy",
    "RT-2",
    "SAC (Soft Actor-Critic)",
    "SayCan",
  ],
  environmentTypes: [
    "Research tabletop workspace",
    "Block stacking benchmark station",
    "Industrial palletizing cell",
    "Warehouse pallet loading area",
    "Kitchen plate stacking",
    "Construction material staging",
  ],
  keyPapers: [
    {
      id: "james-rlbench-2020",
      title: "RLBench: The Robot Learning Benchmark & Learning Environment",
      authors: "James et al.",
      venue: "RA-L 2020",
      year: 2020,
      url: "https://arxiv.org/abs/1909.12271",
    },
    {
      id: "zhao-act-2023",
      title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
      authors: "Zhao et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.13705",
    },
    {
      id: "shridhar-peract-2023",
      title: "Perceiver-Actor: A Multi-Task Transformer for Robotic Manipulation",
      authors: "Shridhar et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2209.05451",
    },
    {
      id: "lee-stacking-2021",
      title: "Beyond Pick-and-Place: Tackling Robotic Stacking of Diverse Shapes",
      authors: "Lee et al.",
      venue: "CoRL 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2110.06192",
    },
  ],
  claruRelevance:
    "Claru provides stacking data collection from research block-tower benchmarks to industrial palletizing at full production scale. Our workstations feature calibrated multi-view cameras with sub-millimeter object tracking via fiducial markers or structured-light scanning, optional 6-axis force/torque sensing for placement force capture, and side-mounted cameras for tower profile monitoring. Operators follow stacking protocols emphasizing placement precision and stability, with quality scoring on placement accuracy, settling time, and lean angle. We collect across configurable difficulty levels from 2-object baselines through 8-object towers and mixed-geometry configurations, including intentional recovery behaviors. Deliverables include per-placement stability annotations, 6-DoF object poses, force profiles, and tower profile measurements formatted for PerAct, ACT, Diffusion Policy, or RL pipelines. For industrial palletizing, we provide layer-by-layer packing patterns on standard pallets with real shipping boxes. Daily throughput of 300-800 stacking demonstrations per station enables rapid scaling.",
};

export default data;
