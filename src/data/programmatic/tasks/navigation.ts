import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "navigation",
  metaTitle: "Robot Navigation Training Data for Autonomous Systems | Claru",
  metaDescription:
    "Training data for robot navigation: indoor mapping, outdoor traversal, obstacle avoidance. Multi-sensor recordings with semantic maps and trajectory annotations.",
  primaryKeyword: "robot navigation training data",
  secondaryKeywords: [
    "autonomous navigation dataset",
    "indoor navigation data",
    "robot path planning data",
    "visual navigation training data",
    "SLAM dataset",
    "traversability dataset",
  ],
  canonicalPath: "/training-data/navigation",
  h1: "Navigation Training Data",
  heroSubtitle:
    "Multi-sensor navigation datasets for indoor and outdoor autonomous systems — SLAM recordings, semantic maps, obstacle annotations, and traversability labels for training robust navigation policies across diverse environments.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Navigation", href: "/training-data/navigation" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Robot Navigation and Why Data Is the Bottleneck?",
      paragraphs: [
        "Robot navigation — the ability to move autonomously from one location to another while avoiding obstacles — is the foundational capability that enables every downstream mobile robotics application. Whether a robot is delivering packages in a warehouse, assisting patients in a hospital, or patrolling a construction site, it must first solve navigation reliably. The mobile robot market is projected to exceed $54 billion by 2030, and while classical navigation stacks (SLAM + A* + DWA) work in controlled environments, they fail systematically in the unstructured, dynamic real world where learned navigation policies are required.",
        "The fundamental challenge is perceptual diversity. A navigation policy must handle reflective floors that confuse LiDAR, transparent glass walls invisible to depth sensors, dynamic obstacles like pedestrians who change direction unpredictably, and lighting conditions ranging from direct sunlight to pitch darkness. Classical cost maps cannot encode these nuances — they treat all obstacles identically and all free space as equally traversable. Learned policies trained on diverse real-world trajectory data implicitly capture the full complexity of navigable environments, including soft preferences like staying away from fragile objects or yielding to pedestrians.",
        "The Visual Navigation Transformer (ViNT, Shah et al., 2023) demonstrated that a single navigation policy trained on diverse trajectory data from 6 different robot platforms totaling 100+ hours of experience can generalize to entirely new environments zero-shot. The key insight was data diversity over data volume: ViNT's cross-embodiment training set spanning indoor hallways, outdoor sidewalks, and off-road trails produced stronger generalization than any single-environment dataset regardless of size. Similarly, GNM (Shah et al., 2023) showed that goal-conditioned navigation improves with environment diversity more than raw trajectory count.",
        "Policies trained exclusively in simulation show 20-40% performance degradation in real deployment due to the sim-to-real gap in perceptual inputs. Simulated environments cannot capture real floor textures (reflections, scuff marks, wet patches), realistic sensor noise patterns (LiDAR multipath in narrow corridors, depth sensor failures on dark surfaces), or the behavioral patterns of real dynamic obstacles. For production deployment, real-world navigation data collected across the target environment distribution is not optional — it is the primary determinant of deployment reliability.",
      ],
    },
    {
      type: "stats",
      heading: "Navigation Data by the Numbers",
      stats: [
        { value: "100+ hrs", label: "ViNT training data from 6 robot platforms" },
        { value: "20-40%", label: "Performance drop for sim-only policies in real deployment" },
        { value: "2,735", label: "Trajectories across 6 environments in GNM training" },
        { value: "<0.3m", label: "Goal-reaching accuracy of ViNT on unseen environments" },
        { value: "$54B", label: "Projected mobile robot market by 2030" },
        { value: "6", label: "Different robot embodiments in ViNT cross-platform training" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Navigation Approach",
      description:
        "Different navigation architectures have distinct data requirements. The trend is toward vision-first methods that reduce sensor cost while increasing generalization.",
      columns: [
        "Approach",
        "Data Volume",
        "Primary Modality",
        "Key Annotations",
        "Best For",
      ],
      rows: [
        {
          Approach: "Classical SLAM + planner (no learning)",
          "Data Volume": "No training data — manual tuning",
          "Primary Modality": "LiDAR + odometry",
          "Key Annotations": "Pre-built occupancy map",
          "Best For": "Static, known environments only",
        },
        {
          Approach: "Goal-conditioned visual navigation (GNM/ViNT)",
          "Data Volume": "50-200 hrs diverse trajectories",
          "Primary Modality": "Front-facing RGB",
          "Key Annotations": "Goal images + odometry waypoints",
          "Best For": "Cross-environment generalization; low-cost robots",
        },
        {
          Approach: "Language-conditioned navigation (LM-Nav)",
          "Data Volume": "100+ hrs trajectories + language annotations",
          "Primary Modality": "RGB + language instructions",
          "Key Annotations": "Natural language route descriptions + landmarks",
          "Best For": "Human-directed navigation with verbal commands",
        },
        {
          Approach: "End-to-end visuomotor (BC from demonstrations)",
          "Data Volume": "10K-50K trajectory segments per environment",
          "Primary Modality": "RGB + proprioception",
          "Key Annotations": "Velocity commands + collision labels",
          "Best For": "Single-environment deployment with high reliability",
        },
        {
          Approach: "Reinforcement learning with real data (NoMaD)",
          "Data Volume": "50-500 hrs + reward labels",
          "Primary Modality": "RGB + LiDAR",
          "Key Annotations": "Traversability scores + collision events + goal progress",
          "Best For": "Off-road and unstructured terrain",
        },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Learned Navigation",
      paragraphs: [
        "GNM (Shah et al., 2023) introduced the general navigation model paradigm: a single goal-conditioned policy trained on trajectories from multiple robots that transfers zero-shot to new platforms. Trained on 2,735 trajectories across 6 environments from 3 different robot platforms, GNM achieved 85% goal-reaching success on unseen environments versus 42% for a policy trained on a single environment. The architecture processes a current observation and goal image to predict a waypoint sequence, decoupling perception from low-level control and enabling cross-embodiment transfer.",
        "ViNT (Shah et al., 2023) scaled this approach with a transformer backbone trained on over 100 hours of navigation data from 6 robot embodiments spanning indoor, outdoor, and off-road domains. ViNT demonstrated that navigation is a scalable learning problem: performance on held-out environments improved log-linearly with training data diversity, reaching sub-30cm goal accuracy on environments never seen during training. The model uses an EfficientNet visual encoder with a GPT-style action decoder that predicts 8-step future waypoints at 4 Hz.",
        "NoMaD (Sridhar et al., 2023) extended foundation navigation models with diffusion-based action prediction, achieving more robust behavior in cluttered environments where multimodal action distributions matter. NoMaD's diffusion head predicts a distribution over future trajectories rather than a single path, naturally handling decision points like choosing which side of an obstacle to pass. On the RECON benchmark, NoMaD reduced collision rate by 43% compared to ViNT while maintaining comparable goal-reaching performance.",
        "LM-Nav (Shah et al., 2023) demonstrated that large language models can provide the high-level planning layer for navigation without any navigation-specific language training. By combining a pre-trained visual navigation model with GPT-4 for instruction parsing and CLIP for landmark grounding, LM-Nav executed complex multi-step navigation instructions (e.g., 'go past the fountain, turn left at the red building, and stop at the bench') with 82% success rate in outdoor campus environments — entirely from pre-trained models without navigation-specific fine-tuning.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Navigation Data",
      paragraphs: [
        "Production navigation data collection requires instrumented mobile platforms that capture synchronized multi-sensor streams while traversing target environments. The core sensor suite includes a front-facing RGB camera (minimum 640x480 at 30 Hz), a 2D or 3D LiDAR scanner (10-20 Hz), wheel odometry or visual-inertial odometry for ego-motion estimation, and an IMU (100-200 Hz) for dead-reckoning through GPS-denied areas. For outdoor navigation, RTK-GPS provides centimeter-level ground truth positioning. All sensors must be hardware-synchronized and extrinsically calibrated to a common body frame.",
        "Environment diversity is the single most important variable for navigation dataset quality. A production dataset should span at least 20 distinct environments covering the target deployment domain. For indoor service robots, this means offices with open floor plans and cubicle mazes, hospitals with long corridors and elevator lobbies, retail stores with dense aisle layouts, and homes with narrow doorways and furniture clutter. Each environment needs trajectories from 50+ distinct start-goal pairs to ensure spatial coverage, with recordings at different times of day to capture lighting variation.",
        "Dynamic obstacle coverage is critical and often underrepresented in navigation datasets. At least 30% of trajectories should include active obstacle avoidance events — pedestrians crossing the path, doors opening, carts being moved. Record these as they occur naturally rather than staging encounters, because the distribution of human movement patterns (speed, predictability, density) varies dramatically between hospitals, offices, and retail environments. Each trajectory should be annotated with obstacle encounter timestamps and avoidance outcomes.",
        "Claru collects navigation data using standardized mobile platforms deployed across our global network of 100+ cities. Each recording includes synchronized RGB, LiDAR, IMU, and odometry streams with ground-truth poses from visual-inertial odometry or RTK-GPS. We capture diverse indoor and outdoor environments with natural human traffic, delivering processed datasets with semantic map annotations, traversability labels, dynamic obstacle bounding boxes with velocity vectors, and human-verified trajectory quality scores. Our standard delivery includes 50-200 hours of navigation data per deployment domain.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets for Robot Navigation",
      description:
        "Public navigation datasets range from small single-building collections to large cross-environment corpora. Most focus on either indoor or outdoor navigation, with few spanning both domains.",
      columns: [
        "Dataset",
        "Year",
        "Scale",
        "Environments",
        "Sensors",
        "Dynamic Obstacles",
      ],
      rows: [
        {
          Dataset: "SACSoN (Shah et al.)",
          Year: "2023",
          Scale: "100+ hrs, 6 robot platforms",
          Environments: "Indoor, outdoor, off-road",
          Sensors: "RGB + odometry",
          "Dynamic Obstacles": "Natural occurrence",
        },
        {
          Dataset: "RECON (Shah et al.)",
          Year: "2022",
          Scale: "50+ hrs across campus",
          Environments: "Outdoor university campus",
          Sensors: "RGB + GPS",
          "Dynamic Obstacles": "Pedestrians, cyclists",
        },
        {
          Dataset: "TartanDrive (Triest et al.)",
          Year: "2022",
          Scale: "200K+ frames off-road",
          Environments: "Off-road terrain",
          Sensors: "RGB + IMU + LiDAR",
          "Dynamic Obstacles": "None (unstructured terrain)",
        },
        {
          Dataset: "Habitat MP3D (Ramakrishnan et al.)",
          Year: "2021",
          Scale: "90 building scans",
          Environments: "Indoor simulation from real scans",
          Sensors: "RGB-D (simulated)",
          "Dynamic Obstacles": "Simulated only",
        },
        {
          Dataset: "SCAND (Karnan et al.)",
          Year: "2022",
          Scale: "8.7 km of sidewalk trajectories",
          Environments: "Urban sidewalks",
          Sensors: "RGB + LiDAR + IMU",
          "Dynamic Obstacles": "Pedestrians",
        },
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "shah-vint-2023",
          title: "ViNT: A Foundation Model for Visual Navigation",
          authors: "Shah et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2306.14846",
        },
        {
          id: "shah-gnm-2023",
          title: "GNM: A General Navigation Model to Drive Any Robot",
          authors: "Shah et al.",
          venue: "ICRA 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2210.03370",
        },
        {
          id: "shah-lmnav-2023",
          title: "LM-Nav: Robotic Navigation with Large Pre-Trained Models of Language, Vision, and Action",
          authors: "Shah et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2207.04429",
        },
        {
          id: "sridhar-nomad-2023",
          title: "NoMaD: Goal Masking Diffusion Policies for Navigation and Exploration",
          authors: "Sridhar et al.",
          venue: "arXiv 2310.07896",
          year: 2023,
          url: "https://arxiv.org/abs/2310.07896",
        },
        {
          id: "karnan-scand-2022",
          title: "SCAND: Single-Camera Autonomous Navigation Dataset",
          authors: "Karnan et al.",
          venue: "RA-L 2022",
          year: 2022,
          url: "https://arxiv.org/abs/2206.09467",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "How much navigation data is needed for indoor autonomy?",
      answer:
        "For a single building type, 50-100 hours of diverse trajectory data — approximately 50,000 trajectory segments covering 20+ distinct start-goal pairs per floor — enables reliable point-to-point navigation with sub-50cm goal accuracy. For cross-building generalization (the robot deploys in buildings it has never seen), 200-500 hours across 20+ distinct environments is recommended, based on ViNT's finding that navigation performance scales log-linearly with environment diversity. Start with your target building and 2-3 similar environments for initial policy development, then expand the dataset to cover the full deployment distribution. Each environment should include trajectories at different times of day to capture lighting variation, and at least 30% of recordings should contain dynamic obstacle encounters.",
    },
    {
      question: "What sensors are essential for navigation data collection?",
      answer:
        "At minimum: a front-facing RGB camera (640x480+ at 30 Hz), a 2D or 3D LiDAR (10-20 Hz), and wheel odometry or visual-inertial odometry for ego-motion. For outdoor navigation, add RTK-GPS for centimeter-level ground truth. For semantic navigation tasks, add a second rear-facing camera. LiDAR is critical for obstacle detection even if the final policy uses vision only — it provides ground-truth obstacle labels and traversability maps for supervised training. An IMU (100-200 Hz) enables dead-reckoning through GPS-denied zones like tunnels or indoor corridors. All sensors must be hardware-synchronized to within 5ms and extrinsically calibrated to a shared body frame, as temporal misalignment between camera and odometry causes trajectory drift in the training labels.",
    },
    {
      question: "How do you handle dynamic obstacles in navigation data?",
      answer:
        "Record in environments with natural human traffic rather than staging encounters, because real pedestrian behavior (speed, predictability, reaction to the robot) varies dramatically across environments. At least 30% of trajectories should include dynamic obstacle avoidance events. Annotate each dynamic obstacle with a bounding box, velocity vector, and trajectory prediction confidence. Include a range of obstacle densities from sparse (one pedestrian in a hallway) to dense (hospital cafeteria during lunch). Without sufficient dynamic obstacle data, policies develop pathological behaviors: freezing indefinitely, taking excessively conservative detours, or failing to yield in socially appropriate ways. NoMaD showed that diffusion-based policies handle multimodal avoidance decisions better than deterministic policies, reducing collision rates by 43%.",
    },
    {
      question: "Can simulation replace real navigation data?",
      answer:
        "Simulation is valuable for pre-training basic spatial reasoning and obstacle avoidance, but cannot replicate real-world perceptual challenges: reflective floors that create phantom LiDAR returns, transparent glass walls invisible to depth sensors, varying lighting from direct sunlight to flickering fluorescents, and complex sensor noise patterns specific to each hardware platform. Research consistently shows a 20-40% performance degradation when sim-trained policies are deployed in the real world without fine-tuning. The most cost-effective approach combines 70-80% simulation for basic traversal skills with 20-30% real-world data for perceptual robustness. Simulation is most useful for rare safety-critical scenarios (near-collisions, emergency stops) that are difficult to collect safely in real deployments.",
    },
    {
      question: "What is the difference between navigation and SLAM?",
      answer:
        "SLAM (Simultaneous Localization and Mapping) is a specific technical component of the navigation stack — it builds a map of the environment while tracking the robot's position within it. Navigation is the complete end-to-end task: perceiving the environment, planning a path to the goal, and executing motion commands to reach it. Classical navigation stacks decompose this into separate modules (SLAM for mapping, A* for path planning, DWA for local control), while modern learned navigation treats it end-to-end: a single neural network takes sensor observations and a goal specification and outputs velocity commands. Learned approaches outperform classical stacks in unstructured environments because they implicitly handle the failure modes (perceptual aliasing, dynamic obstacles, terrain assessment) that require brittle hand-tuning in classical systems.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Navigation Data",
  ctaDescription:
    "Share your target deployment environment and robot platform, and we will design a multi-sensor navigation data collection plan covering the full diversity of conditions your system will encounter.",
  relatedGlossaryTerms: [
    "scene-understanding",
    "robot-learning",
    "spatial-action-maps",
    "sim-to-real-gap",
    "visual-navigation",
  ],
  relatedGuidePages: [
    "how-to-build-a-navigation-dataset",
    "how-to-preprocess-point-clouds-for-training",
  ],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "RGB + LiDAR + IMU + wheel odometry + GPS (outdoor)",
    volumeRange: "10K-500K trajectory segments across 20+ environments",
    temporalResolution: "10-30 Hz LiDAR, 30 Hz RGB, 100-200 Hz IMU",
    keyAnnotations: [
      "Trajectory waypoints with ground-truth pose",
      "Obstacle classification (static, dynamic, transparent)",
      "Traversability scores per terrain patch",
      "Semantic map labels (floor, wall, door, furniture)",
      "Dynamic object bounding boxes with velocity vectors",
      "Lighting condition metadata",
    ],
  },
  relevantModels: ["ViNT", "NoMaD", "GNM", "LM-Nav", "CoNVOI", "Habitat baselines"],
  environmentTypes: [
    "Indoor office",
    "Warehouse",
    "Sidewalk",
    "Campus",
    "Hospital",
    "Retail store",
    "Off-road terrain",
  ],
  keyPapers: [
    {
      id: "shah-vint-2023",
      title: "ViNT: A Foundation Model for Visual Navigation",
      authors: "Shah et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2306.14846",
    },
    {
      id: "shah-gnm-2023",
      title: "GNM: A General Navigation Model to Drive Any Robot",
      authors: "Shah et al.",
      venue: "ICRA 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2210.03370",
    },
    {
      id: "shah-lmnav-2023",
      title: "LM-Nav: Robotic Navigation with Large Pre-Trained Models of Language, Vision, and Action",
      authors: "Shah et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2207.04429",
    },
    {
      id: "sridhar-nomad-2023",
      title: "NoMaD: Goal Masking Diffusion Policies for Navigation and Exploration",
      authors: "Sridhar et al.",
      venue: "arXiv 2310.07896",
      year: 2023,
      url: "https://arxiv.org/abs/2310.07896",
    },
    {
      id: "karnan-scand-2022",
      title: "SCAND: Single-Camera Autonomous Navigation Dataset",
      authors: "Karnan et al.",
      venue: "RA-L 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2206.09467",
    },
  ],
  claruRelevance:
    "Claru collects navigation data using standardized mobile platforms deployed across our global network of 100+ cities, providing the environment diversity that is the primary driver of navigation policy generalization. Each recording includes hardware-synchronized RGB, LiDAR, IMU, and odometry streams with ground-truth poses from visual-inertial odometry or RTK-GPS. Our collection protocol captures diverse indoor and outdoor environments with natural human traffic at multiple times of day, ensuring coverage of lighting variation, dynamic obstacle densities, and terrain types. We deliver processed datasets with semantic map annotations, traversability labels, dynamic obstacle bounding boxes with velocity vectors, and human-verified trajectory quality scores. Standard delivery includes 50-200 hours of navigation data per deployment domain, formatted for direct ingestion by ViNT, GNM, NoMaD, or custom navigation architectures in RLDS, HDF5, or ROS bag formats.",
};

export default data;
