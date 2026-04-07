import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "teleoperation",
  metaTitle: "Teleoperation Data for Robot Learning (2026) | Claru",
  metaDescription:
    "Scalable teleoperation data collection for robot imitation learning: VR, leader-follower, exoskeleton interfaces with synchronized multi-modal recordings.",
  primaryKeyword: "teleoperation data for robotics",
  secondaryKeywords: [
    "teleop data collection",
    "teleoperation demonstrations",
    "robot teleoperation dataset",
    "leader-follower teleoperation data",
    "VR teleoperation robotics",
    "bilateral teleoperation dataset",
  ],
  canonicalPath: "/training-data/teleoperation",
  h1: "Teleoperation Training Data",
  heroSubtitle:
    "High-throughput teleoperation data for imitation learning — collected via leader-follower, VR, and exoskeleton interfaces with synchronized video, proprioception, and action labels.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Teleoperation", href: "/training-data/teleoperation" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Teleoperation: The Gold Standard for Robot Demonstrations",
      paragraphs: [
        "Teleoperation — where a human remotely controls a robot to perform tasks — is the primary method for collecting high-quality robot demonstration data. Unlike kinesthetic teaching (physically guiding the robot) or autonomous exploration, teleoperation combines human task intelligence with the robot's actual kinematic and dynamic constraints, producing demonstrations that are both naturally varied and physically executable. Every major robot learning dataset of the past three years — RT-1, DROID, Open X-Embodiment, ALOHA — relies on teleoperated demonstrations as the foundational data source.",
        "The choice of teleoperation interface fundamentally shapes the data quality and throughput. Leader-follower systems like ALOHA (Zhao et al., 2023) and GELLO (Wu et al., 2024) offer sub-millimeter positional fidelity and natural bimanual control, but require custom hardware costing $5K-20K per station. VR-based teleoperation using Meta Quest or HTC Vive provides lower entry cost but introduces 20-50 ms latency and kinematic mismatch between human and robot workspaces. Exoskeleton interfaces offer the best kinematic correspondence but cost $50K-200K per station. Each interface type produces demonstrations with subtly different quality characteristics: leader-follower data preserves fine-grained force modulation, VR data captures spatial reasoning well but loses force sensitivity, and exoskeleton data provides the most natural motion profiles but is least scalable.",
        "At scale, the economics of teleoperation data collection are driven by operator throughput and quality. Experienced teleoperators on tabletop tasks typically achieve 20-40 successful demonstrations per hour with leader-follower systems, compared to 10-20 with VR and 5-10 with kinesthetic teaching. Google's RT-1 data collection campaign (Brohan et al., 2022) employed 13 robots with scripted teleoperators over 17 months, collecting 130,000 demonstrations — a benchmark for scale that few organizations can match independently. The DROID dataset (Khazatsky et al., 2024) distributed collection across 13 institutions with standardized Franka Panda arms and 3D SpaceMouse interfaces, producing 76,000 demonstrations in 12 months with consistent quality.",
        "Data quality in teleoperation is not just about sensor fidelity — it is about demonstration naturalness. Policies trained on jerky, hesitant teleoperation perform measurably worse than those trained on fluid demonstrations from experienced operators. Mandlekar et al. (2021) showed that filtering the top 50% of demonstrations by smoothness and efficiency metrics improved Behavioral Cloning success rates by 12-18% across tasks. This makes operator selection, training, and fatigue management as important as hardware selection for dataset quality.",
      ],
    },
    {
      type: "stats",
      heading: "Data Scale Benchmarks",
      stats: [
        { value: "130K", label: "Demonstrations in RT-1 (17 months)" },
        { value: "76K", label: "Demonstrations in DROID (13 institutions)" },
        { value: "20-40/hr", label: "Leader-follower throughput" },
        { value: "<1 ms", label: "Leader-follower synchronization" },
        { value: "30-50 Hz", label: "Standard video capture rate" },
        { value: "386K+", label: "Claru clips available" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Teleoperation Interface Comparison",
      description:
        "Each teleoperation interface trades off cost, throughput, fidelity, and operator learning curve. This comparison helps select the right interface for your data needs.",
      columns: [
        "Interface",
        "Cost per Station",
        "Throughput (demos/hr)",
        "Positional Fidelity",
        "Latency",
        "Best For",
      ],
      rows: [
        {
          Interface: "Leader-follower (ALOHA/GELLO)",
          "Cost per Station": "$5K-20K",
          "Throughput (demos/hr)": "20-40",
          "Positional Fidelity": "Sub-millimeter",
          Latency: "<1 ms",
          "Best For": "Dexterous manipulation, bimanual tasks",
        },
        {
          Interface: "VR headset (Quest/Vive)",
          "Cost per Station": "$500-2K",
          "Throughput (demos/hr)": "10-20",
          "Positional Fidelity": "2-5 mm",
          Latency: "20-50 ms",
          "Best For": "Spatial reasoning, pick-and-place",
        },
        {
          Interface: "3D SpaceMouse",
          "Cost per Station": "$300-500",
          "Throughput (demos/hr)": "15-30",
          "Positional Fidelity": "1-3 mm",
          Latency: "5-15 ms",
          "Best For": "Single-arm tasks, standardized collection",
        },
        {
          Interface: "Exoskeleton (haptic)",
          "Cost per Station": "$50K-200K",
          "Throughput (demos/hr)": "15-25",
          "Positional Fidelity": "Sub-millimeter",
          Latency: "<5 ms",
          "Best For": "Force-sensitive tasks, natural motion",
        },
        {
          Interface: "Hand retargeting (vision-based)",
          "Cost per Station": "$500-2K",
          "Throughput (demos/hr)": "10-20",
          "Positional Fidelity": "3-8 mm",
          Latency: "30-80 ms",
          "Best For": "Dexterous hands, multi-finger tasks",
        },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Teleoperation-Driven Policy Learning",
      paragraphs: [
        "The dominant paradigm in 2024-2026 is to train large visuomotor policies on teleoperated demonstration data. RT-2 (Brohan et al., 2023) fine-tuned a vision-language model on 130K teleoperated episodes and achieved emergent generalization — following novel language instructions for object manipulation without task-specific demonstrations. OpenVLA (Kim et al., 2024) replicated this approach with open-source models and 970K episodes from the Open X-Embodiment dataset, achieving 16.5% absolute improvement over RT-2-X on real robot evaluation. The key finding across all these systems is that data diversity — more tasks, more objects, more environments — matters more than data volume for a single task.",
        "Diffusion Policy (Chi et al., 2023) demonstrated that policy architecture innovation can dramatically reduce the data requirement. By modeling the multimodal action distribution with a denoising diffusion process, Diffusion Policy achieves 85-95% success rates on contact-rich tasks from just 50-200 teleoperated demonstrations — compared to 200-500 demonstrations needed for standard Behavioral Cloning. ACT (Zhao et al., 2023) achieves similar data efficiency through action chunking, predicting sequences of 50-100 future actions at once. Both architectures are now standard choices for consuming teleoperation data.",
        "The DROID dataset (Khazatsky et al., 2024) represents the current best practice for distributed teleoperation collection. Using a standardized hardware setup (Franka Panda + 3 cameras + 3D SpaceMouse) across 13 institutions, DROID collected 76,000 demonstrations covering 564 tasks in 86 environments. The standardization enabled cross-institution data aggregation while the distribution enabled environment diversity no single lab could achieve. Policies trained on DROID show 20% higher success rates on held-out tasks compared to single-institution datasets of equivalent size, validating the diversity hypothesis.",
        "The emerging frontier is scaling teleoperation data to millions of demonstrations for training robot foundation models. Physical Intelligence's pi0 model, Nvidia's GR00T, and Google DeepMind's Gemini Robotics all target million-demonstration-scale training. At this scale, the bottleneck shifts from data quality to data logistics: managing thousands of collection hours across dozens of stations while maintaining format consistency, sensor calibration, and quality standards. This is fundamentally a data operations problem, not a research problem.",
      ],
    },
    {
      type: "prose",
      heading: "Scaling Teleoperation Collection",
      paragraphs: [
        "Parallelization is the key to economical large-scale teleoperation data. Running multiple collection stations simultaneously with rotating operators can achieve 200-500 demonstrations per day per site. Claru operates teleoperation collection stations across multiple facilities with standardized hardware configurations, enabling parallel collection at throughputs of 1,000+ demonstrations per week while maintaining quality standards. Each station is calibrated to a common specification, ensuring that data from different stations is interchangeable for training.",
        "Data quality in teleoperation collection is maintained through three layers: (1) real-time automated checks for sensor synchronization, episode completeness, and task success; (2) per-session human review of sampled episodes for demonstration quality (smoothness, efficiency, naturalness); (3) dataset-level statistical validation after collection batches complete, including action distribution analysis and per-task success rate verification. Episodes failing quality gates are flagged for re-collection while operators and hardware are still configured, avoiding expensive re-mobilization.",
        "Operator management is the most underappreciated factor in teleoperation data quality. A fresh operator produces measurably smoother demonstrations than one who has been teleoperating for two hours straight. Cognitive fatigue manifests as increased jerkiness, longer episode duration, and higher failure rates. Claru enforces 45-minute collection sessions with 15-minute breaks, rotates operators across tasks to prevent adaptation bias, and tracks per-operator quality metrics to identify when retraining is needed. Operators complete a qualification protocol for each task before production collection begins.",
        "Format standardization is critical for downstream consumption. Claru delivers teleoperation data in RLDS format (compatible with OpenVLA, Octo, RT-X), HDF5 (Diffusion Policy, ACT), or custom formats with full metadata including camera intrinsics/extrinsics, robot URDF, action space definitions, and task specification documents. All data ships with a validation script that confirms format compliance, sensor alignment, and episode completeness before the client begins training.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Teleoperation Datasets",
      description:
        "Major teleoperation datasets vary in scale, interface, and task diversity. Understanding existing data helps identify gaps for custom collection.",
      columns: [
        "Dataset",
        "Year",
        "Scale",
        "Interface",
        "Robot",
        "Tasks",
      ],
      rows: [
        {
          Dataset: "RT-1 (Brohan et al.)",
          Year: "2022",
          Scale: "130K demos",
          Interface: "Custom bilateral",
          Robot: "Everyday Robot",
          Tasks: "700+ instructions",
        },
        {
          Dataset: "DROID (Khazatsky et al.)",
          Year: "2024",
          Scale: "76K demos",
          Interface: "3D SpaceMouse",
          Robot: "Franka Panda",
          Tasks: "564 tasks, 86 environments",
        },
        {
          Dataset: "ALOHA (Zhao et al.)",
          Year: "2023",
          Scale: "~300 demos",
          Interface: "Leader-follower",
          Robot: "ViperX 300 pair",
          Tasks: "6 bimanual tasks",
        },
        {
          Dataset: "Open X-Embodiment",
          Year: "2024",
          Scale: "970K+ episodes",
          Interface: "Mixed",
          Robot: "22 embodiments",
          Tasks: "527 skills",
        },
        {
          Dataset: "BridgeData V2",
          Year: "2024",
          Scale: "60K demos",
          Interface: "VR + SpaceMouse",
          Robot: "WidowX 250",
          Tasks: "13 skills, 24 environments",
        },
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Teleoperation Data Needs",
      paragraphs: [
        "Claru operates a distributed network of teleoperation collection stations equipped with ALOHA-style leader-follower systems, 3D SpaceMouse interfaces, and multi-view camera arrays. Each station is built to a standardized specification with calibrated multi-view cameras (2-4 per station), hardware-synchronized sensor streams, and validated action space mappings. We support Franka Panda, UR5e, ViperX 300, and custom robot platforms, with data formatted for the target architecture from collection start.",
        "Our operator pipeline ensures consistently high-quality demonstrations. Each operator completes a task-specific qualification protocol before production collection, demonstrating required success rates, trajectory smoothness above threshold, and episode duration within target ranges. During collection, we enforce 45-minute session limits with mandatory breaks, rotate operators across tasks, and run automated quality scoring on every episode. Per-operator dashboards track quality metrics over time, enabling early detection of fatigue or skill regression.",
        "Claru delivers teleoperation data in all major formats — RLDS (OpenVLA, Octo, RT-X), HDF5 (Diffusion Policy, ACT), Zarr, and custom schemas — with complete metadata packages including camera intrinsics and extrinsics, robot URDF files, action space definitions, task specification documents, and per-episode quality scores. Every dataset ships with a validation script and format compliance certificate. For clients building robot foundation models, we support continuous collection campaigns producing 1,000+ quality demonstrations per week at sustained throughput.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "zhao-aloha-2023",
          title:
            "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
          authors: "Zhao et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2304.13705",
        },
        {
          id: "brohan-rt1-2022",
          title: "RT-1: Robotics Transformer for Real-World Control at Scale",
          authors: "Brohan et al.",
          venue: "RSS 2023",
          year: 2022,
          url: "https://arxiv.org/abs/2212.06817",
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
          id: "brohan-rt2-2023",
          title:
            "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
          authors: "Brohan et al.",
          venue: "arXiv 2307.15818",
          year: 2023,
          url: "https://arxiv.org/abs/2307.15818",
        },
        {
          id: "khazatsky-droid-2024",
          title:
            "DROID: A Large-Scale In-The-Wild Robot Manipulation Dataset",
          authors: "Khazatsky et al.",
          venue: "RSS 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2403.12945",
        },
        {
          id: "kim-openvla-2024",
          title:
            "OpenVLA: An Open-Source Vision-Language-Action Model",
          authors: "Kim et al.",
          venue: "arXiv 2406.09246",
          year: 2024,
          url: "https://arxiv.org/abs/2406.09246",
        },
      ],
    },
  ],
  faqs: [
    {
      question:
        "Which teleoperation interface produces the highest quality data?",
      answer:
        "Leader-follower systems (like ALOHA or GELLO) produce the highest fidelity data with sub-millimeter positional accuracy and zero kinematic mismatch since the leader arm mirrors the follower exactly. ACT achieved 20% higher success rates when trained on leader-follower versus VR-collected demonstrations. For budget-constrained projects, VR teleoperation is a viable alternative with 15-25% lower downstream policy performance. The 3D SpaceMouse offers the best balance of cost and quality for single-arm tasks — DROID standardized on it across 13 institutions precisely because of this cost-quality tradeoff.",
    },
    {
      question:
        "How many operators should I use to avoid demonstration bias?",
      answer:
        "A minimum of 5-10 operators is recommended for datasets over 1,000 demonstrations. Single-operator datasets exhibit systematic style biases (approach angles, speed profiles, grasp preferences) that can limit policy generalization. The Open X-Embodiment project used 20+ operators across institutions. DROID used 3-5 operators per institution across 13 sites. Claru rotates operators on standardized schedules to maximize demonstration diversity while maintaining quality consistency through per-operator qualification protocols.",
    },
    {
      question:
        "What is the optimal demonstration length for manipulation tasks?",
      answer:
        "Episodes should be as short as the task allows — typically 5-30 seconds for tabletop pick-and-place, 30-120 seconds for multi-step tasks like kitchen cooking, and 2-5 minutes for long-horizon assembly or navigation-manipulation sequences. Shorter episodes improve training data efficiency and reduce the chance of operator fatigue degrading quality within an episode. For long-horizon tasks, consider decomposing into subtask episodes with phase annotations rather than recording the full sequence as one episode.",
    },
    {
      question:
        "How does teleoperation data quality compare to kinesthetic teaching?",
      answer:
        "Teleoperation consistently outperforms kinesthetic teaching for policy training quality. Kinesthetic teaching introduces the human's arm dynamics into the demonstration (the operator physically supports the robot's weight), creating artifacts that do not reflect how the robot moves autonomously. Teleoperation with leader-follower systems produces demonstrations within the robot's natural dynamic range. The throughput difference is also significant: teleoperation produces 3-5x more demonstrations per hour because the operator does not need direct physical access to the robot workspace between episodes.",
    },
    {
      question:
        "What data formats should teleoperation datasets use?",
      answer:
        "RLDS (Reinforcement Learning Datasets) is the emerging standard for cross-platform compatibility, used by OpenVLA, Octo, RT-X, and the Open X-Embodiment ecosystem. HDF5 remains the preferred format for Diffusion Policy and ACT due to its efficient random-access reads during training. Zarr offers cloud-native streaming for large-scale distributed training. For maximum flexibility, collect and store in one canonical format with conversion scripts to the others. Every format must include camera calibration, action space specification, and episode-level metadata alongside the raw sensor streams.",
    },
    {
      question:
        "How important is camera placement and calibration for teleoperation data?",
      answer:
        "Camera setup is critical because the policy will only have access to the same camera viewpoints at deployment. A minimum of two cameras — one third-person overview and one wrist-mounted eye-in-hand — is standard. DROID uses three cameras (two fixed third-person plus one wrist). All cameras must be calibrated (intrinsics and extrinsics) and rigidly mounted to prevent drift between collection sessions. Frame synchronization across cameras must be within 5 ms; hardware triggering is preferred over software synchronization. Poorly calibrated or misaligned cameras are the most common source of wasted teleoperation data.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Teleoperation Data",
  ctaDescription:
    "Tell us your specific requirements and we will scope a data collection plan tailored to your teleoperation use case.",
  relatedGlossaryTerms: [
    "teleoperation-data",
    "behavioral-cloning",
    "imitation-learning",
    "action-space",
  ],
  relatedGuidePages: [
    "how-to-collect-teleoperation-data",
    "how-to-setup-a-teleoperation-rig",
  ],
  relatedSolutionSlugs: ["teleoperation-data"],
  dataRequirements: {
    modality: "RGB multi-view + proprioception + end-effector actions",
    volumeRange: "1K-100K demonstrations depending on task diversity",
    temporalResolution: "30-50 Hz video, 50-100 Hz proprioception/actions",
    keyAnnotations: [
      "End-effector delta pose actions",
      "Joint position targets",
      "Task success/failure",
      "Phase segmentation",
      "Language instructions",
      "Demonstration quality score (smoothness, efficiency)",
    ],
  },
  relevantModels: [
    "ACT/ALOHA",
    "Diffusion Policy",
    "OpenVLA",
    "RT-2",
    "Octo",
    "Pi-zero",
  ],
  environmentTypes: [
    "Kitchen",
    "Tabletop",
    "Office",
    "Warehouse",
    "Laboratory",
    "Outdoor",
  ],
  keyPapers: [
    {
      id: "zhao-aloha-2023",
      title:
        "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
      authors: "Zhao et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.13705",
    },
    {
      id: "brohan-rt1-2022",
      title: "RT-1: Robotics Transformer for Real-World Control at Scale",
      authors: "Brohan et al.",
      venue: "RSS 2023",
      year: 2022,
      url: "https://arxiv.org/abs/2212.06817",
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
      id: "khazatsky-droid-2024",
      title:
        "DROID: A Large-Scale In-The-Wild Robot Manipulation Dataset",
      authors: "Khazatsky et al.",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2403.12945",
    },
    {
      id: "kim-openvla-2024",
      title: "OpenVLA: An Open-Source Vision-Language-Action Model",
      authors: "Kim et al.",
      venue: "arXiv 2406.09246",
      year: 2024,
      url: "https://arxiv.org/abs/2406.09246",
    },
  ],
  claruRelevance:
    "Claru operates a distributed network of teleoperation collection stations equipped with ALOHA-style leader-follower systems, 3D SpaceMouse interfaces, and multi-view camera arrays. We support Franka Panda, UR5e, ViperX 300, and custom platforms with standardized calibration across all stations. Our trained teleoperators achieve 30+ successful demonstrations per hour on tabletop tasks, with quality maintained through 45-minute session limits, per-operator qualification protocols, and automated per-episode quality scoring. We deliver in all major formats (RLDS, HDF5, Zarr) with complete metadata including camera calibration, robot URDF, action space definitions, and task specifications. For foundation model training campaigns, we sustain 1,000+ quality demonstrations per week with continuous quality monitoring and format compliance verification.",
};

export default data;
