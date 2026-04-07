import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-collect-teleoperation-data",
  metaTitle: "How to Collect Teleoperation Data (2026 Guide) | Claru",
  metaDescription: "Step-by-step guide to collecting high-quality teleoperation data for robot learning. Covers hardware setup, operator training, quality control, and data formatting.",
  primaryKeyword: "how to collect teleoperation data",
  secondaryKeywords: ["teleoperation data collection", "teleop data guide", "collect robot demonstrations", "robot data collection pipeline"],
  canonicalPath: "/guides/how-to-collect-teleoperation-data",
  h1: "How to Collect Teleoperation Data for Robot Learning",
  heroSubtitle: "A practical guide to collecting teleoperation demonstration data for training robot manipulation policies. Covers choosing a teleoperation interface, setting up recording infrastructure, training operators, managing collection campaigns, and validating data quality. Designed for ML engineers and data teams building datasets for behavioral cloning, Diffusion Policy, and VLA model training.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Collect Teleoperation Data", href: "/guides/how-to-collect-teleoperation-data" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Teleoperation Data Quality Determines Policy Performance",
      paragraphs: [
        "Teleoperation data is the foundation of modern robot learning. Every major imitation learning architecture — Diffusion Policy, ACT, OpenVLA, Octo — learns directly from human demonstrations captured through teleoperation. The quality of these demonstrations directly bounds what the trained policy can achieve: a policy trained on jerky, inconsistent teleop data will produce jerky, inconsistent robot behavior.",
        "The critical insight is that teleoperation data collection is not a recording problem — it is a human performance problem. The hardware and software are commoditized (SpaceMouse, GELLO, RealSense cameras, ROS2 recording). The differentiator is operator skill, collection protocol design, and systematic quality control. Teams that invest in operator training and real-time quality monitoring consistently produce datasets that train 2-3x better policies than teams that focus only on episode count.",
        "This guide covers the full pipeline from hardware selection through operator training, campaign management, quality validation, and formatting. It is designed for ML engineers who need to build a teleoperation dataset from scratch and want to avoid the common pitfalls that waste weeks of collection effort."
      ]
    },
    {
      type: "stats",
      heading: "Teleoperation Data Collection Benchmarks",
      stats: [
        { value: "20-40", label: "Quality episodes per 90-minute session" },
        { value: "3-5", label: "Operators minimum per task for diversity" },
        { value: "10-30%", label: "Typical episode failure rate" },
        { value: "<10ms", label: "Target sensor synchronization tolerance" },
        { value: "4-8 hrs", label: "Operator training before quality demos" },
        { value: "80%+", label: "Minimum operator success rate threshold" }
      ]
    },
    {
      type: "comparison-table",
      heading: "Teleoperation Interfaces Compared",
      description: "Choose based on your task complexity, budget, and target policy architecture.",
      columns: ["Interface", "DOF Control", "Operator Training Time", "Cost", "Best For"],
      rows: [
        { "Interface": "SpaceMouse", "DOF Control": "6-DOF EE velocity", "Operator Training Time": "2-3 hours", "Cost": "$200-400", "Best For": "Single-arm tabletop manipulation" },
        { "Interface": "VR Controllers (Quest 3)", "DOF Control": "6-DOF + gripper trigger", "Operator Training Time": "4-8 hours", "Cost": "$500", "Best For": "Spatial reasoning tasks, long-reach" },
        { "Interface": "GELLO Leader Arms", "DOF Control": "Full joint-space bilateral", "Operator Training Time": "1-2 hours", "Cost": "$2,000-5,000", "Best For": "Bimanual, contact-rich tasks" },
        { "Interface": "ALOHA Leader-Follower", "DOF Control": "Bimanual joint-space", "Operator Training Time": "2-4 hours", "Cost": "$20,000+", "Best For": "Fine-grained bimanual manipulation" },
        { "Interface": "Data Gloves", "DOF Control": "16-24 DOF dexterous", "Operator Training Time": "8-16 hours", "Cost": "$10,000+", "Best For": "Multi-finger hand control" }
      ]
    },
    {
      type: "cards",
      heading: "Common Collection Pitfalls",
      cards: [
        {
          title: "Single-Operator Bias",
          description: "Datasets from one operator memorize that person's habits (approach angles, grasp preferences). Always use 3-5 operators minimum and track per-operator trajectory diversity."
        },
        {
          title: "Insufficient State Randomization",
          description: "Collecting 1,000 episodes with the same object layout teaches the policy one scenario extremely well. Randomize object positions, orientations, and selections between episodes."
        },
        {
          title: "Ignoring Failed Episodes",
          description: "Deleting all failed attempts removes valuable negative signal. Keep failures labeled with taxonomy codes — they improve reward model training and recovery behavior."
        },
        {
          title: "Post-Hoc Quality Issues",
          description: "Discovering calibration drift or sensor dropouts after a 2-week collection campaign wastes the entire effort. Run per-episode validation checks in real time."
        }
      ]
    },
    {
      type: "prose",
      heading: "Scaling Collection Campaigns Beyond 1,000 Episodes",
      paragraphs: [
        "Most teleoperation datasets in published papers contain 100-500 episodes. Scaling to 5,000-50,000 episodes — the range needed for multi-task foundation model training — introduces challenges that small-scale collection never encounters. The primary scaling bottleneck is not hardware or operator time, but quality consistency across weeks of collection.",
        "At scale, implement a campaign-based structure: divide the total collection target into campaigns of 500 episodes each. At the end of each campaign, run a full quality audit before starting the next. The audit includes: action velocity statistics (flag campaigns where the distribution has shifted from the baseline), per-operator success rate trends (detect fatigue or habit degradation), and environmental drift checks (camera calibration verification, robot zero-position check).",
        "Multi-station parallelism is the most effective way to increase throughput. Two identical collection stations running simultaneously double throughput with minimal additional coordination cost. Each station should have independent recording infrastructure and QA monitoring. Centralize only the campaign management layer — which task variants have been covered, which operator-task combinations need more data, and aggregate quality metrics.",
        "For datasets that will be published or used for foundation model training, track provenance metadata exhaustively: robot serial number, firmware version, operator ID, session date/time, room temperature, and lighting conditions. This metadata enables fine-grained dataset filtering and helps diagnose mysterious training failures months after collection."
      ]
    }
  ],
  faqs: [
    {
      question: "What teleoperation interface should I use?",
      answer: "For 6-7 DOF manipulation arms: VR controllers (Meta Quest 3) provide intuitive 6-DOF control with low setup cost (~$500). For bimanual manipulation: leader-follower arms (ALOHA, GELLO) provide natural two-handed coordination with force feedback. For dexterous manipulation: exoskeletons or data gloves provide finger-level control but cost $10,000+. For prototyping: keyboard/spacemouse teleoperation is cheapest to set up but produces lower-quality demonstrations due to limited control bandwidth.",
    },
    {
      question: "How many operators should I use?",
      answer: "Use at least 3-5 different operators per task to prevent operator-specific biases from dominating the dataset. A single operator develops habits (always approaching from the same angle, always using the same grasp) that the policy memorizes rather than learning the underlying task. Rotating operators ensures the dataset captures diverse strategies. Each operator needs 4-8 hours of practice before their demonstrations reach consistent quality.",
    },
    {
      question: "What is the typical failure rate during collection?",
      answer: "Expect 10-30% of episodes to fail (incomplete task, dropped objects, system errors). The failure rate is highest for new operators (30-40%) and decreases with experience (10-15% for skilled operators). Do not discard failed episodes automatically — label them with the failure mode and keep them in the dataset. Failed episodes are valuable for training failure recovery policies and as negative examples for reward model training.",
    },
    {
      question: "How do I handle synchronization between sensors?",
      answer: "Use hardware timestamps (not system clock) for all sensor streams. Synchronize cameras using an external trigger or PTP (Precision Time Protocol). Record the timestamp of each frame/action in a shared timeline and verify alignment by recording a known event (hand clap, LED flash) visible to all cameras and checking that timestamps align within 10ms. Post-collection, interpolate lower-frequency streams (robot state at 50 Hz) to align with higher-frequency streams (camera at 30 Hz) using linear interpolation.",
    },
  ],
  ctaHeading: "Need Professional Teleoperation Data Collection?",
  ctaDescription: "Claru handles end-to-end teleoperation data collection on your robot hardware, with trained operators, quality monitoring, and delivery in your preferred format.",
  relatedGlossaryTerms: ["teleoperation-data", "vla", "behavioral-cloning", "imitation-learning", "manipulation-trajectory"],
  relatedGuidePages: ["how-to-setup-a-teleoperation-rig", "how-to-create-action-labels-for-vla"],
  relatedSolutionSlugs: ["teleoperation-data"],
  difficulty: "intermediate",
  estimatedTime: "2-6 weeks",
  prerequisites: [
    "Target robot hardware (manipulator arm with gripper)",
    "Teleoperation interface (VR controllers, leader-follower arms, or spacemouse)",
    "1-3 cameras (wrist-mounted and/or fixed scene cameras)",
    "Task specification document defining what the robot should learn",
  ],
  tools: ["ROS2", "Intel RealSense SDK", "HDF5", "RLDS", "GoPro (for egocentric reference video)"],
  steps: [
    {
      stepNumber: 1,
      title: "Choose Your Teleoperation Interface",
      description: "Select the teleoperation interface that matches your robot's capabilities and your target task complexity. For single-arm manipulation with a parallel-jaw gripper: VR controllers (Meta Quest 3, HTC Vive) provide 6-DOF end-effector control and a trigger for gripper open/close. The operator wears the headset to see the robot's camera feed and uses one hand controller to command the arm.\n\nFor bimanual manipulation: use ALOHA-style leader-follower arms, where two identical robot arms serve as the input device. The operator physically moves the leader arms and the follower arms mirror the motion. This provides natural force feedback and bimanual coordination. For dexterous manipulation (individual finger control): data gloves or exoskeletons map finger positions to a dexterous gripper or hand. Evaluate each option on: control bandwidth (how many DOF can the operator command simultaneously), latency (must be under 50ms for responsive control), and operator fatigue (sessions should last 90+ minutes without excessive strain).",
      tools: ["Meta Quest SDK", "ROS2 teleoperation packages"],
      tips: ["VR teleoperation has a learning curve — budget 4-8 hours per operator for training before quality demonstrations begin.", "Test the teleoperation latency end-to-end before committing to an interface. Latency above 100ms produces jerky demonstrations."],
    },
    {
      stepNumber: 2,
      title: "Set Up Recording Infrastructure",
      description: "Configure the data recording pipeline to capture all sensor streams with proper synchronization. Mount cameras rigidly — any movement between collection sessions invalidates the calibration and creates a domain gap. Run camera calibration (intrinsic and extrinsic) and save the calibration files with the dataset.\n\nSet up the recording software to capture: RGB images from each camera at 15-30 fps, depth maps (if using RGB-D cameras) at the same rate, robot joint positions and velocities at 50-200 Hz (from the robot controller), end-effector pose at the control frequency, gripper state (width or binary), and timestamps for every data point in a unified clock. Implement automatic validation that runs after each episode: check for missing frames (>2% frame drop = flag for review), verify timestamp monotonicity, and confirm file integrity. Store each episode as a self-contained unit (one HDF5 file or RLDS episode) with all metadata included.",
      tools: ["ROS2", "rosbag2", "Intel RealSense SDK", "HDF5"],
      tips: ["Record at the highest practical frequency and downsample later — it is easy to reduce frequency but impossible to increase it after collection.", "Use SSD storage, not HDD — writing 3 camera streams at 30 fps requires sustained write bandwidth that HDDs cannot provide."],
    },
    {
      stepNumber: 3,
      title: "Design the Task Protocol and Train Operators",
      description: "Write a detailed task protocol that specifies: the task goal (what the robot should accomplish), the initial state distribution (how to randomize object positions, which objects to use), the success criteria (how to determine if the episode succeeded), how to handle failures (re-record immediately or label and move on), and the diversity requirements (vary approach angles, grasp strategies, object selections).\n\nTrain operators on the protocol with a supervised practice session of 20-50 episodes. During practice, provide real-time feedback on demonstration quality: flag jerky motions, unnecessarily long pauses, and inconsistent task execution. Measure each operator's success rate and trajectory smoothness during practice. Only graduate operators to production collection when they achieve >80% success rate and smooth, consistent motions. Plan for 3-5 operators rotating through collection to ensure dataset diversity.",
      tips: ["Write the protocol as a checklist, not a paragraph. Operators under time pressure skip paragraphs but follow checklists.", "Include photos of correct and incorrect initial configurations in the protocol."],
    },
    {
      stepNumber: 4,
      title: "Run the Collection Campaign",
      description: "Execute data collection following the protocol, with real-time quality monitoring. Organize collection into sessions of 90 minutes with 15-minute breaks — demonstration quality degrades measurably after 2 hours of continuous work. Each session should produce 20-40 episodes depending on task complexity.\n\nImplement a real-time monitoring dashboard showing: total episodes completed (vs. target), success rate (rolling window of last 20 episodes), average episode duration (flag outliers), and diversity metrics (which task variations have been covered, which are underrepresented). Have a supervisor review 10-20% of episodes from each session within 24 hours. This catches systematic issues (camera moved, robot calibration drifted, operator developing bad habits) before they contaminate a large portion of the dataset. If quality drops, pause collection and investigate.",
      tools: ["Grafana (for dashboards)", "custom monitoring scripts"],
      tips: ["Set daily targets by episode count AND quality metrics — 100 poor episodes are worse than 50 good ones.", "End each day by backing up the collected data to a separate drive."],
    },
    {
      stepNumber: 5,
      title: "Run Post-Collection Quality Validation",
      description: "After collection, run comprehensive automated validation across the entire dataset. Check every episode for: timestamp synchronization (max drift between camera and action timestamps), data completeness (no missing frames, no truncated episodes), action value range (all actions within the robot's joint limits), image quality (blur detection, exposure check, camera occlusion), and file integrity (all expected fields present, correct data types).\n\nCompute dataset-level statistics: action distribution per dimension (should be smooth, not concentrated at extreme values), episode duration distribution (flag outliers for manual review), task success rate by operator (identify if one operator has significantly lower quality), approach direction distribution (check for spatial bias), and grasp type distribution (ensure variety). Flag the bottom 15-20% of episodes by a composite quality score (smoothness + success + duration) for manual review and potential removal.",
      tips: ["Automate everything you can but always do a manual review of flagged episodes — automated metrics miss context-dependent issues.", "Compute and report inter-operator consistency metrics to verify that the dataset does not have operator-specific biases."],
    },
    {
      stepNumber: 6,
      title: "Format, Split, and Package the Dataset",
      description: "Convert the validated dataset into the target training format. For RLDS: create TFRecord files following the RLDS specification, with each episode as a sequence of steps containing observation, action, reward, and metadata tensors. For HDF5: create one file per episode with standardized group names (observations/rgb, observations/depth, actions/joint_positions, etc.). For zarr: create a chunked array store optimized for random access during training.\n\nGenerate train/validation/test splits (80/10/10 or 90/5/5). Split by episode, not by frame — all frames from one episode must be in the same split. Stratify the split by task variation to ensure each split covers the full task distribution. Create a dataset card (following Hugging Face DatasetCard conventions) documenting: dataset size, task descriptions, robot specifications, camera parameters, action space definition, known limitations, and licensing. Include a Python dataloader and example training script that loads a batch, visualizes an episode, and verifies data integrity.",
      tools: ["tensorflow_datasets (for RLDS)", "h5py", "zarr"],
      tips: ["Never split by frame within an episode — this creates data leakage where training and validation contain frames from the same trajectory.", "Include normalization statistics (per-dimension mean, std, min, max) in the dataset metadata."],
    },
  ],
  keyPapers: [
    {
      id: "walke-bridge-2023",
      title: "BridgeData V2: A Dataset for Robot Learning at Scale",
      authors: "Walke et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2308.12952",
    },
    {
      id: "chi-umi-2024",
      title: "Universal Manipulation Interface: In-The-Wild Robot Teaching Without a Robot",
      authors: "Chi et al.",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2402.10329",
    },
    {
      id: "zhao-aloha-2023",
      title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
      authors: "Zhao et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.13705",
    },
  ],
  claruRelevance: "Claru specializes in professional teleoperation data collection. Our team of 10,000+ trained operators has collected demonstrations across diverse robot platforms and environments. We handle end-to-end pipeline from protocol design through operator training, collection campaign management, quality validation, and delivery in your preferred format (RLDS, HDF5, zarr). Contact us to discuss your specific data collection requirements.",
};

export default data;
