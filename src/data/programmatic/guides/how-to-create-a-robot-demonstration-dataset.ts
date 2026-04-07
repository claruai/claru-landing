import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-create-a-robot-demonstration-dataset",
  metaTitle: "How to Create a Robot Demonstration Dataset from Scratch (2026 Guide) | Claru",
  metaDescription: "End-to-end guide to building robot demonstration datasets covering teleoperation interfaces, episode recording, multi-modal observation design, and policy-ready formatting.",
  primaryKeyword: "how to create a robot demonstration dataset from scratch",
  secondaryKeywords: ["robot demonstration dataset","imitation learning dataset","teleoperation dataset creation","robot data collection pipeline","behavioral cloning data"],
  canonicalPath: "/guides/how-to-create-a-robot-demonstration-dataset",
  h1: "How to Create a Robot Demonstration Dataset from Scratch",
  heroSubtitle: "End-to-end guide to building robot demonstration datasets from zero — covering teleoperation hardware, observation design, episode recording pipelines, quality assurance, and formatting for imitation learning and VLA model training.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Create a Robot Demonstration Dataset from Scratch", href: "/guides/how-to-create-a-robot-demonstration-dataset" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Demonstration Datasets Are the Foundation of Modern Robot Learning",
      paragraphs: [
        "Every major advance in robot manipulation over the past three years — RT-2, Diffusion Policy, ACT, Octo, OpenVLA — was trained on human demonstration data. Unlike reinforcement learning, which requires millions of environment interactions and a carefully shaped reward function, imitation learning from demonstrations is sample-efficient, stable to train, and produces natural-looking robot behavior. The limiting factor is no longer the algorithm — it is the data.",
        "Building a demonstration dataset from scratch is a multi-disciplinary engineering challenge that spans hardware integration (teleoperation rigs, sensors, recording pipelines), human factors (operator training, fatigue management, quality monitoring), and data engineering (normalization, formatting, validation). The most common failure mode is not technical — it is organizational: teams that skip protocol design and pilot testing waste 30-50% of their collection budget on data that is too low-quality or too low-diversity to train a useful policy.",
        "This guide covers the end-to-end process from specification through deployment, with emphasis on the quality control systems and validation checks that separate datasets that train successful policies from datasets that produce confused, hesitant robots."
      ]
    },
    {
      type: "stats",
      heading: "Demonstration Dataset Scale Guidelines",
      stats: [
        { value: "50-100", label: "Demos for ACT single-task (most efficient)" },
        { value: "100-200", label: "Demos for Diffusion Policy single-task" },
        { value: "20-50", label: "Demos for fine-tuning Octo/OpenVLA per task" },
        { value: "90%+", label: "Operator success rate threshold for production" },
        { value: "3-5", label: "Operators minimum for dataset diversity" },
        { value: "20-40", label: "Quality episodes per operator per hour" }
      ]
    },
    {
      type: "pipeline",
      heading: "Demonstration Dataset Creation Pipeline",
      steps: [
        { stepNumber: 1, title: "Specify", description: "Define tasks, observation-action contract, sensor modalities, coordinate frames, and target model input spec." },
        { stepNumber: 2, title: "Build Infrastructure", description: "Set up teleoperation hardware, recording pipeline, sensor synchronization, and per-episode validation hooks." },
        { stepNumber: 3, title: "Train & Pilot", description: "Train operators to proficiency, run a 50-100 episode pilot, validate with a smoke-test policy training." },
        { stepNumber: 4, title: "Collect at Scale", description: "Execute structured collection shifts with real-time QA dashboard, coverage tracking, and operator rotation." },
        { stepNumber: 5, title: "Post-Process", description: "Clean, filter, normalize, and deduplicate. Compute normalization statistics on training split only." },
        { stepNumber: 6, title: "Format & Validate", description: "Convert to RLDS/HDF5, generate stratified splits, run a training smoke test, and ship with documentation." }
      ]
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Policy Architecture",
      columns: ["Architecture", "Demos (Single Task)", "Demos (Multi-Task)", "Key Data Quality Factor"],
      rows: [
        { "Architecture": "Behavioral Cloning (MLP)", "Demos (Single Task)": "1,000-5,000", "Demos (Multi-Task)": "5K-50K", "Key Data Quality Factor": "Unimodal demonstrations" },
        { "Architecture": "ACT (Action Chunking Transformer)", "Demos (Single Task)": "50-100", "Demos (Multi-Task)": "500-2,000", "Key Data Quality Factor": "Smooth, consistent trajectories" },
        { "Architecture": "Diffusion Policy", "Demos (Single Task)": "100-200", "Demos (Multi-Task)": "1K-5K", "Key Data Quality Factor": "Multi-modal strategy diversity" },
        { "Architecture": "OpenVLA / Octo (fine-tuning)", "Demos (Single Task)": "20-50", "Demos (Multi-Task)": "200-1,000", "Key Data Quality Factor": "Format compatibility with base model" }
      ]
    },
    {
      type: "cards",
      heading: "Dataset Quality Assurance Layers",
      cards: [
        {
          title: "Per-Episode Automated Checks",
          description: "Run after every episode: verify task completion, check for pauses > 3 seconds, flag excessive jerk (> 50 m/s^3), and validate sensor data completeness."
        },
        {
          title: "Per-Session Monitoring",
          description: "Every 50 episodes: compute rolling success rate, duration distribution, and action velocity statistics. Rotate operators if quality degrades."
        },
        {
          title: "Per-Dataset Validation",
          description: "After collection: compute inter-operator DTW agreement, action distribution analysis, and stratified split verification. Remove bottom 10-15% by quality score."
        },
        {
          title: "Training Smoke Test",
          description: "The definitive check: train a lightweight policy and evaluate on validation split. If success rate > 50% on easy tasks, the data is likely clean."
        }
      ]
    },
    {
      type: "prose",
      heading: "The Collect-Evaluate-Expand Iteration Cycle",
      paragraphs: [
        "Building a robot demonstration dataset is not a single-pass process. The most effective approach is an iterative cycle: collect a pilot dataset, train a policy, evaluate on real hardware, identify failure modes, collect targeted demonstrations addressing those failures, and retrain. Each iteration improves the policy's weakest capabilities without wasting collection budget on scenarios the policy already handles well.",
        "The first iteration (50-100 episodes) validates the infrastructure: recording pipeline, operator training, data format, and training loop. If a simple BC policy achieves >30% success on the easiest task variant, the pipeline is working. The second iteration (200-500 episodes) builds breadth: diverse initial conditions, multiple operators, and full task vocabulary coverage. The third iteration (500-2,000 episodes) targets depth: additional demonstrations specifically for the failure modes observed during the second iteration's evaluation.",
        "Track failure modes systematically. After each evaluation round, categorize every failure: grasp_miss (gripper closes on empty space), grasp_slip (object drops during transport), collision (robot hits an obstacle), wrong_target (picks the wrong object), and timeout (policy hesitates and does not complete). Plot failure mode frequency across iterations — a healthy dataset development process shows each failure mode decreasing over successive collection rounds as targeted demonstrations address them.",
        "Budget 2-3 iteration cycles and allocate collection budget accordingly: 20% for the pilot, 40% for breadth, and 40% for targeted depth. Teams that spend their entire budget in a single collection pass almost always end up with a dataset that has systematic gaps revealed only during the first real-hardware evaluation."
      ]
    }
  ],
  faqs: [
    {
      question: "What teleoperation interface should I use for collecting robot demonstrations?",
      answer: "The choice depends on your robot's action space and the dexterity required. For 6/7-DoF arms performing tabletop manipulation, a 3Dconnexion SpaceMouse controlling end-effector velocity is the industry standard — operators reach proficiency in 2-3 hours and can produce 30-50 quality demonstrations per hour. For bimanual tasks requiring simultaneous two-arm coordination, the GELLO system (a low-cost 3D-printed replica of the target robot acting as a leader arm) provides kinesthetic teaching with proprioceptive feedback. For dexterous hand manipulation, VR controllers (Meta Quest 3) with finger tracking via the hand-tracking SDK provide intuitive control of high-DoF hands (16-24 joints). For mobile manipulation, combine a SpaceMouse for arm control with a gamepad joystick for base velocity. Record the raw teleoperator input alongside the robot's executed trajectory — the gap between commanded and executed actions reveals dynamics that models must learn to compensate for."
    },
    {
      question: "How many demonstrations do I need for different policy architectures?",
      answer: "Data requirements vary by architecture and task complexity. Behavioral Cloning (BC) with a simple MLP policy needs 1,000-5,000 demonstrations per task but is fragile to distribution shift. Action Chunking Transformer (ACT) achieves strong single-task performance with 50-100 demonstrations because temporal action chunking regularizes the policy. Diffusion Policy similarly works well with 100-200 demonstrations for single-task settings due to its multi-modal action distribution modeling. For multi-task learning with a shared policy, multiply the per-task requirement by the number of task variants. Foundation models like Octo and OpenVLA are pretrained on 800K+ episodes from Open X-Embodiment and can be fine-tuned on as few as 20-50 demonstrations per new task, but the demonstrations must be high quality and match the model's expected observation format. Start with a 50-episode pilot, train a policy, evaluate, and scale based on observed failure modes."
    },
    {
      question: "How should I handle multi-camera setups in demonstration datasets?",
      answer: "Multi-camera setups are standard for modern robot learning because different viewpoints provide complementary information. The typical configuration is a wrist-mounted camera (eye-in-hand) for close-range manipulation detail and one or two external cameras for workspace context. Each camera stream must be calibrated independently (intrinsics via ChArUco board, extrinsics via hand-eye calibration for wrist cameras or PnP with known fiducials for fixed cameras). Store all streams as separate keys in your observation dict (e.g., obs/image_primary, obs/image_wrist) rather than concatenating them — this lets models learn which view to attend to for which task phase. Ensure all cameras are hardware-synchronized or software-synchronized within 10 ms. Different models expect different camera configurations: RT-2 and Octo use a single primary image, while Diffusion Policy and ACT benefit from multi-view input. Record all views regardless of your current model choice — you cannot recover unrecorded viewpoints later."
    },
    {
      question: "What is the best action representation for demonstration datasets?",
      answer: "The action representation is the single most impactful data design choice for policy performance. The two dominant conventions are delta end-effector pose (7-DoF: dx, dy, dz, droll, dpitch, dyaw, gripper) and absolute joint positions (N-DoF for N joints plus gripper). Delta EE is more intuitive for teleoperation and transfers better across robot embodiments because it abstracts away kinematic differences. Absolute joint positions preserve richer information about the arm configuration and avoid inverse kinematics ambiguity, but they are embodiment-specific. Most current VLA models (RT-2, Octo, OpenVLA) use delta EE with position control. Diffusion Policy and ACT work well with both but slightly prefer delta EE for contact-rich tasks. Whichever you choose, normalize actions to the [-1, 1] range using training set statistics (per-dimension min-max or standard normalization) and store the normalization parameters alongside the dataset. Never mix action conventions within a dataset."
    },
    {
      question: "How do I ensure demonstration quality is good enough for policy learning?",
      answer: "Quality assurance operates at three levels: per-demonstration, per-session, and per-dataset. Per-demonstration: after each episode, run automated checks — verify task completion (did the object reach the goal?), check for teleoperator pauses longer than 3 seconds (which create action distribution discontinuities), and flag episodes with excessive jerk in the end-effector trajectory (computed as the third derivative of position, thresholded at 50 m/s^3 for typical tabletop tasks). Per-session: every 50 episodes, compute the success rate, average episode duration, and action velocity distribution. If success rate drops below 80% or duration increases by more than 20%, the operator may be fatigued — rotate to a fresh operator. Per-dataset: after collection, compute inter-operator agreement by having 2-3 operators perform the same 20 task instances and measuring DTW distance between their trajectories. High variance suggests the task specification is ambiguous and operators are using different strategies, which will confuse a unimodal policy. Remove the bottom 10-15% of demonstrations by quality score before training."
    }
  ],
  ctaHeading: "Need a Demonstration Dataset Built?",
  ctaDescription: "Claru builds robot demonstration datasets end-to-end. We provide teleoperation operators, sensor rigs, environment setup, and delivery in your target format.",
  relatedGlossaryTerms: ["imitation-learning","behavioral-cloning","teleoperation-data"],
  relatedGuidePages: ["how-to-collect-teleoperation-data","how-to-create-action-labels-for-vla"],
  relatedSolutionSlugs: ["teleoperation-data"],
  difficulty: "advanced",
  estimatedTime: "4-8 weeks",
  prerequisites: ["Robot platform with teleoperation capability (arm + gripper minimum)","ROS2 or equivalent robot middleware","RGB-D camera(s) with calibration equipment","Python 3.10+ with standard ML stack","Understanding of target model input spec"],
  tools: ["ROS2","SpaceMouse or GELLO","Intel RealSense SDK","Python","NumPy","h5py","PyTorch","RLDS"],
  steps: [
    {
      stepNumber: 1,
      title: "Specify the Task Suite and Observation-Action Contract",
      description: "Define exactly which tasks the dataset will cover and the precise input-output contract between the data and the model. Start by writing a task specification document for each task: the initial state distribution (how objects are arranged at the start), the goal condition (what constitutes success), the expected episode duration, and any safety constraints. For a tabletop pick-and-place task, the spec might read: 'Pick a single object from a randomized position within a 30x40cm workspace area and place it in a target bin at a fixed location. Success: object is in the bin and gripper is open. Expected duration: 10-30 seconds at 10 Hz control. Initial state: 1 of 10 object models placed uniformly random in the workspace.'\n\nThe observation-action contract specifies the exact tensor shapes, dtypes, coordinate frames, and units for every modality. For a typical bimanual manipulation setup targeting Diffusion Policy: observations include image_left (256x256x3 uint8), image_right (256x256x3 uint8), image_wrist_left (256x256x3 uint8), image_wrist_right (256x256x3 uint8), joint_positions_left (7, float32, radians), joint_positions_right (7, float32, radians), ee_pose_left (7, float32, meters + quaternion), ee_pose_right (7, float32, meters + quaternion). Actions: delta_ee_left (7, float32, [-1,1] normalized), delta_ee_right (7, float32, [-1,1] normalized), gripper_left (1, float32, 0=closed 1=open), gripper_right (1, float32). Control frequency: 10 Hz. This contract is the single source of truth — share it with the ML team, the teleoperation operators, and the data pipeline engineers before any data is collected.",
      tools: ["Markdown/Notion for spec documents"],
      tips: ["Cross-reference your observation contract against the published model's dataloader code, not just the paper — papers often omit normalization details"]
    },
    {
      stepNumber: 2,
      title: "Set Up the Teleoperation and Recording Infrastructure",
      description: "Build and test the full hardware and software stack end-to-end before collecting a single demonstration. The teleoperation stack consists of three layers: the input device driver (SpaceMouse, GELLO, VR controller), the control interface (converting input commands to robot actions), and the recording pipeline (capturing synchronized observations and actions to disk).\n\nFor SpaceMouse teleoperation with a Franka Panda, use the deoxys library or franka_ros2 to accept end-effector velocity commands at 100 Hz from the device driver, apply workspace limits and velocity scaling (typically 0.2 m/s max linear, 1.0 rad/s max angular), run the IK solver to generate joint commands, and stream to the robot's real-time controller. For GELLO, the leader arm's joint positions are read at 50 Hz via Dynamixel servos and mapped to the follower arm through joint-space correspondence (accounting for any kinematic differences between the GELLO replica and the target robot). Record the full robot state (joint positions, velocities, torques, EE pose) at 100 Hz and camera streams at 30 Hz. Use hardware synchronization via PTP or a shared trigger line — the recording node should log the maximum observed timestamp discrepancy for each episode as a quality metric.\n\nBuild the recording pipeline as a ROS2 node that uses message_filters.ApproximateTimeSynchronizer to align all topics. Write each episode to a single HDF5 file with the structure: /observations/{modality_name} as datasets, /actions as a dataset, and /metadata as JSON attributes. Run 10 test episodes and verify: no dropped frames (expected frame count matches actual), no NaN values in any channel, image-action temporal alignment within 15 ms, and file sizes within expected range. This infrastructure testing phase typically takes 3-5 days and saves weeks of wasted collection time.",
      tools: ["ROS2 Humble", "deoxys or franka_ros2", "SpaceMouse driver", "message_filters", "h5py"],
      tips: ["Record a 'canary' episode where you perform a known motion (e.g., move EE in a square) and verify it visually in the recorded data — this catches coordinate frame bugs immediately"]
    },
    {
      stepNumber: 3,
      title: "Train Teleoperators and Run a Pilot Collection",
      description: "Human operators are the bottleneck in demonstration quality. Invest time in operator training before scaling collection. A training program for SpaceMouse teleoperation should include: (1) Free exploration session (30 minutes) where the operator moves the robot without any task objective to build intuition for the control mapping, velocity limits, and workspace boundaries. (2) Simple task practice (60 minutes) performing the easiest task variant repeatedly until reaching >90% success rate. (3) Full task vocabulary practice (2-3 hours) covering all task variants at increasing difficulty. (4) Timed collection practice where the operator maintains quality while working at production speed.\n\nTrack operator proficiency metrics: success rate, average episode duration, action smoothness (measured as mean jerk magnitude), and task completion time variance. Set minimum proficiency thresholds — typically >90% success rate and <20% duration variance — before an operator contributes to the production dataset. Run a pilot collection of 50-100 episodes covering all task variants. Use the pilot data to: (a) validate the full recording pipeline by training a simple BC policy and evaluating it, (b) compute baseline statistics for quality thresholds, (c) estimate total collection time and cost for the full dataset, and (d) identify protocol ambiguities where operators made different strategic choices. Revise the task specification based on pilot findings. This pilot phase costs 2-5% of the total collection budget but prevents far more expensive mistakes during full-scale collection.",
      tools: ["Custom teleoperation interface", "Streamlit dashboard for metrics tracking"],
      tips: ["Pair new operators with experienced ones for the first 30 minutes — tacit knowledge about control feel transfers much faster through observation than written protocols"]
    },
    {
      stepNumber: 4,
      title: "Execute Full-Scale Collection with Real-Time QA",
      description: "Run production data collection in structured shifts with clear roles and real-time quality monitoring. A typical collection station has three roles: teleoperator (performs demonstrations), environment resetter (randomizes object positions and configurations between episodes to ensure diversity), and QA monitor (watches a live dashboard and flags issues). For high-throughput collection, rotate teleoperators every 90 minutes and aim for 20-40 episodes per hour per station depending on task complexity.\n\nBuild a real-time QA dashboard (Streamlit or Grafana) that displays: total episodes collected vs. target, per-task-variant coverage heat map showing which combinations of objects, positions, and configurations have been demonstrated, rolling success rate over the last 50 episodes per operator, action smoothness distribution with outlier flagging, and recording integrity metrics (frame drops, timestamp gaps, sync drift). Configure automated alerts: if frame dropout rate exceeds 1%, if any operator's success rate drops below 80%, or if a task variant has fewer demonstrations than the minimum diversity threshold. Flag problematic episodes for immediate review — it is far cheaper to re-record a demonstration while the setup is still configured than to discover the issue weeks later.\n\nFor diversity, implement a coverage tracker that monitors the Cartesian product of variation axes. If your task has 10 objects, 5 initial positions, and 3 lighting conditions, you have 150 unique configurations. The tracker should show which configurations have been demonstrated and prioritize under-represented ones in the collection schedule. Aim for at least 3 demonstrations per unique configuration for the training split.",
      tools: ["Streamlit", "pandas", "matplotlib", "ROS2 bag recording as backup"],
      tips: ["Always run a parallel ROS bag recording as a backup — if an HDF5 file is corrupted, you can reconstruct the episode from the bag"]
    },
    {
      stepNumber: 5,
      title: "Post-Process: Clean, Filter, and Normalize",
      description: "After collection, run a systematic post-processing pipeline that transforms raw recordings into training-ready data. The pipeline has four stages: cleaning, filtering, normalization, and augmentation.\n\nCleaning: Identify and remove corrupted episodes — files with incorrect sizes, truncated recordings, or sensor dropouts exceeding your threshold (typically >2% frame loss). Detect and remove duplicate episodes by computing trajectory fingerprints: encode each episode's action sequence with a 1D-CNN or compute the sequence hash after discretizing actions to 0.01 resolution. For the common case of an operator accidentally recording the same episode twice (hitting record without resetting the environment), duplicates will have near-zero DTW distance. Filtering: Remove low-quality demonstrations using a composite quality score. Compute per-episode metrics: success (binary), smoothness (inverse of mean jerk magnitude), efficiency (ratio of straight-line distance to actual path length), and completion time percentile. Rank episodes by composite score and remove the bottom 10-15%. For failure episodes you intentionally want to keep, tag them explicitly in metadata rather than relying on the quality filter.\n\nNormalization: Compute per-channel statistics (mean and standard deviation) across the training split for actions and proprioceptive observations. Store these statistics as a JSON sidecar file. Apply standard normalization: (x - mean) / std for each dimension. For image observations, normalize to [0, 1] float32 or keep as uint8 [0, 255] depending on your model's expectation. For quaternion actions, ensure consistent convention (Hamilton qx,qy,qz,qw) and normalize to unit length. Augmentation: For image observations, apply random crops, color jitter, and random erasing at training time (not at dataset creation time) — store the full-resolution images and let the dataloader handle augmentation.",
      tools: ["NumPy", "scipy", "fastdtw", "h5py", "scikit-learn"],
      tips: ["Save normalization statistics with the dataset — models must use identical statistics at inference time, and recomputing them is a common source of deployment bugs"]
    },
    {
      stepNumber: 6,
      title: "Format, Split, and Validate for Training",
      description: "Convert the processed dataset to your target format and validate end-to-end. For RLDS format (needed for Octo, RT-X, OpenVLA): implement a custom TFDS DatasetBuilder with a features_dict matching your observation-action contract. Each episode becomes one example in the RLDS Dataset with a steps feature containing the sequence of (observation, action, reward, is_first, is_last, is_terminal) tuples. Build with tfds build and validate by loading 100 episodes through tfds.load. For HDF5 (Diffusion Policy, ACT, robomimic): your existing HDF5 files likely already match the expected structure. Verify alignment with the target codebase by running the model's dataset loading code on your data and checking that a single training batch loads without errors.\n\nGenerate train/validation/test splits deterministically. Use stratified splitting: sort episodes into strata by (task_variant, operator_id, environment_config), then assign 80/10/10 within each stratum using a seeded random shuffle. This ensures each split contains a representative sample of all task variants and prevents information leakage from temporal adjacency (consecutive episodes from the same session should not appear in both train and test). Validate the splits by computing the Earth Mover's Distance between action distributions across splits — they should be statistically similar.\n\nFinal validation: train a lightweight policy (BC with a 2-layer MLP, 50 epochs) on the training split and evaluate on the validation split. If the validation loss plateaus at a reasonable level and the policy achieves >50% success rate on the easiest task variant, the dataset is likely clean. If training diverges or success rate is near zero, there is a data bug — check action normalization, coordinate frame consistency, and observation-action temporal alignment. Ship the dataset with a comprehensive datasheet documenting: collection methodology, task specifications, observation-action contract, normalization statistics, known limitations, and a working dataloader example.",
      tools: ["tensorflow-datasets", "h5py", "PyTorch DataLoader", "Zarr (optional)", "Jupyter"],
      tips: ["Include the exact git commit hash of the model codebase you validated against in the dataset documentation — API drift in model repos is a common source of 'the data worked last month' issues"]
    }
  ],
  keyPapers: [
    {
      id: "zhao-aloha-2023",
      title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware (ALOHA)",
      authors: "Zhao et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.13705"
    },
    {
      id: "chi-diffusion-policy-2023",
      title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137"
    },
    {
      id: "open-x-embodiment-2024",
      title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Open X-Embodiment Collaboration",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864"
    },
    {
      id: "wu-gello-2024",
      title: "GELLO: A General, Low-Cost, and Intuitive Teleoperation Framework for Robot Manipulators",
      authors: "Wu et al.",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2309.13037"
    }
  ],
  claruRelevance: "Claru builds robot demonstration datasets from scratch for teams training imitation learning policies. We operate teleoperation stations across 100+ cities with trained operators experienced in SpaceMouse, GELLO, and VR-based collection. We handle the full pipeline — environment setup, operator training, real-time QA, post-processing, and delivery in RLDS, HDF5, or your custom format — enabling your ML team to focus on model development.",
};

export default data;
