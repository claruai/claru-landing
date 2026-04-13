import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-collect-multimodal-robot-data",
  metaTitle: "How to Collect Multimodal Robot Data (2026 Guide) | Claru",
  metaDescription: "Step-by-step guide to collecting multimodal robot data — covering RGB-D cameras, force-torque sensors, proprioception, language annotations, and synchronization for VLA model training.",
  primaryKeyword: "how to collect multimodal robot data",
  secondaryKeywords: ["multimodal robot dataset","multi-sensor robot data","vision language action data","robot sensor fusion data","multimodal manipulation data"],
  canonicalPath: "/guides/how-to-collect-multimodal-robot-data",
  h1: "How to Collect Multimodal Robot Data",
  heroSubtitle: "A practitioner's guide to building multimodal robot datasets — covering sensor selection, time synchronization, language annotation, and formatting for vision-language-action model training.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Collect Multimodal Robot Data", href: "/guides/how-to-collect-multimodal-robot-data" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Multi-Modal Data Powers the Next Generation of Robot Foundation Models",
      paragraphs: [
        "The frontier of robot learning has moved decisively toward multi-modal foundation models. RT-2 conditions on vision and language. Octo processes RGB, proprioception, and language. Research systems like RoboFlamingo add depth and force sensing. Each additional modality provides information that the others cannot: cameras see objects but not contact forces, force-torque sensors feel interactions but not scene layout, and language descriptions provide task context that neither sensor captures.",
        "Collecting synchronized multi-modal data is the most technically demanding form of robot data collection. It requires precise temporal alignment across sensors running at different rates (cameras at 30 Hz, proprioception at 100 Hz, force-torque at 1,000 Hz), careful calibration of spatial transforms between sensor frames, and language annotation that grounds instructions to specific visual and physical states.",
        "The reward for this complexity is data that trains more capable, more generalizable policies. Multi-modal policies can leverage depth for precise placement, force sensing for contact-rich tasks, and language for zero-shot task specification — capabilities that vision-only policies fundamentally cannot learn."
      ]
    },
    {
      type: "stats",
      heading: "Multimodal Data Collection Parameters",
      stats: [
        { value: "< 1ms", label: "Target hardware sync precision (PTP)" },
        { value: "< 20ms", label: "Acceptable software sync tolerance" },
        { value: "1.5-2 MB/s", label: "Compressed data rate (2 cameras + proprio + F/T)" },
        { value: "15-25", label: "Multimodal episodes per collection hour" },
        { value: "3 tiers", label: "Language annotation granularity levels" },
        { value: "5-15%", label: "Episodes failing cross-modal consistency checks" }
      ]
    },
    {
      type: "comparison-table",
      heading: "VLA Model Modality Requirements",
      columns: ["Model", "RGB Cameras", "Depth", "Proprioception", "Force/Torque", "Language"],
      rows: [
        { "Model": "RT-2", "RGB Cameras": "1 (320x256)", "Depth": "No", "Proprioception": "No", "Force/Torque": "No", "Language": "Required" },
        { "Model": "Octo", "RGB Cameras": "1-2 (256x256)", "Depth": "Optional", "Proprioception": "Required (7-DoF EE)", "Force/Torque": "No", "Language": "Required" },
        { "Model": "OpenVLA", "RGB Cameras": "1 (224x224)", "Depth": "No", "Proprioception": "No", "Force/Torque": "No", "Language": "Required" },
        { "Model": "Diffusion Policy", "RGB Cameras": "2-3 (96-256)", "Depth": "Optional", "Proprioception": "Required (joint-space)", "Force/Torque": "Optional", "Language": "No" }
      ]
    },
    {
      type: "cards",
      heading: "Cross-Modal Validation Checks",
      cards: [
        {
          title: "EE Position vs. Camera",
          description: "Project the FK-computed end-effector position into each camera frame using calibrated extrinsics. If it does not align with the visible gripper, extrinsic calibration has drifted."
        },
        {
          title: "Force-Contact Agreement",
          description: "Force spikes should temporally coincide with visible contact events in RGB. A systematic offset indicates sensor synchronization error — compute cross-correlation to quantify lag."
        },
        {
          title: "Joint Velocity vs. EE Motion",
          description: "Differentiated joint states through forward kinematics should produce EE velocities consistent with observed gripper motion. Mismatches indicate URDF errors or FK bugs."
        },
        {
          title: "Depth-FK Consistency",
          description: "Depth values at the gripper location should match the FK-computed camera-to-gripper distance. Deviations beyond 2cm indicate depth sensor miscalibration or alignment error."
        }
      ]
    },
    {
      type: "prose",
      heading: "Handling Missing Modalities in Cross-Embodiment Datasets",
      paragraphs: [
        "When building multimodal datasets for foundation models that train on data from multiple robot platforms, not every platform will have every modality. Some robots have force-torque sensors, others do not. Some have depth cameras, others only RGB. The Open X-Embodiment project solved this with modality masking: define a union observation spec containing all possible modalities, fill missing modalities with zero tensors, and set a boolean modality_mask to indicate which modalities are present.",
        "This approach requires discipline at the data formatting level. Every episode in the dataset must have the same tensor shapes for the same modality keys, regardless of whether the data is real or a zero-padded placeholder. The model learns to route information through available modalities and ignore masked-out ones. During training, the loss function should not penalize predictions conditioned on missing modalities — this is typically handled by the model architecture rather than the data format.",
        "For datasets that will be mixed with Open X-Embodiment data, follow the RT-X data conventions exactly: images as uint8 PNG-encoded, proprioception as 7-DoF end-effector pose in robot base frame (x, y, z, qx, qy, qz, qw), actions as 7-DoF delta end-effector targets plus gripper, and language as raw string text. Any deviation from these conventions — even something as minor as quaternion ordering (wxyz vs. xyzw) — will produce training artifacts when mixed with the 22+ existing datasets in the RT-X collection.",
        "Document the modality availability matrix for your dataset prominently in the dataset card: which episodes have which modalities, what percentage of the dataset includes each optional modality, and the quality level of each modality (e.g., 'depth available but noisy on reflective surfaces in 15% of episodes'). This transparency lets downstream users make informed decisions about which modalities to train on."
      ]
    }
  ],
  faqs: [
    {
      question: "What sensor modalities should a multimodal robot dataset include?",
      answer: "The minimum viable multimodal setup for current VLA models includes RGB images (at least one third-person and one wrist camera), proprioceptive state (joint positions and velocities), and language task descriptions. From there, each additional modality adds specific value: depth maps (from RealSense D435i or ZED 2i) enable 3D spatial reasoning and are critical for contact-rich tasks; force-torque sensing (ATI Mini45 or Robotiq FT 300, ~$3,000-5,000) captures interaction forces invisible to cameras, essential for insertion, wiping, and deformable object tasks; tactile sensing (DIGIT or GelSight) provides fingertip contact geometry; audio captures contact sounds (bottle caps clicking, zippers closing) that signal task completion; and point clouds from LiDAR or multi-view stereo provide full 3D scene representation. RT-2 uses only RGB + language. Octo uses RGB + proprioception + language. Research frontiers like RoboFlamingo and ManipLLM add depth and force. Start with RGB + proprioception + language, then add modalities based on your task requirements."
    },
    {
      question: "How do you synchronize multiple sensor streams in a robot dataset?",
      answer: "Sensor synchronization is the make-or-break technical challenge of multimodal data collection. Hardware synchronization is always preferred: connect cameras to a shared trigger line (RealSense D435i supports GPIO hardware sync), run the robot controller and force-torque sensor on a real-time kernel (PREEMPT_RT), and use PTP (IEEE 1588 Precision Time Protocol) across all networked devices. This achieves sub-millisecond alignment. For software synchronization, use ROS2 message_filters.ApproximateTimeSynchronizer with a slop tolerance matched to your slowest sensor rate — typically 33 ms for 30 Hz cameras. Record the maximum observed timestamp discrepancy per episode as a quality metric. Discard any episode where discrepancy exceeds 50 ms. A common pitfall: RealSense cameras report USB-level timestamps that differ from ROS header timestamps by 10-30 ms. Always use the device-level hardware timestamp (rs2_get_frame_timestamp) and convert to ROS time using a calibrated offset."
    },
    {
      question: "How do you add language annotations to multimodal robot data?",
      answer: "Language annotations come in three tiers of granularity. Tier 1: task-level descriptions written at collection time by the operator — one sentence per episode like 'Pick up the red cup and place it on the coaster.' Tier 2: step-level narrations added post-hoc by annotators who watch episode replays and segment into sub-goals — 'Approach the cup. Grasp the cup handle. Lift the cup. Move to the coaster. Lower the cup. Release.' Tier 3: dense frame-level captions generated by vision-language models (LLaVA, GPT-4V) describing the scene state at sampled keyframes. For VLA training, Tier 1 is the minimum requirement — RT-2 and OpenVLA condition on single-sentence task instructions. Tier 2 enables hierarchical policy learning and is used by SayCan and Inner Monologue. Tier 3 is experimental but promising for grounding language to visual features. Budget 30 seconds per episode for Tier 1 (operator writes during environment reset), 3-5 minutes per episode for Tier 2 (human annotator), and 10-20 seconds per episode for Tier 3 (automated VLM inference). Always store the raw language text alongside the episode, not just tokenized representations."
    },
    {
      question: "What is the recommended data rate and storage budget for multimodal datasets?",
      answer: "Data rates compound quickly across modalities. A typical multimodal episode at 10 Hz control frequency with two 256x256 RGB cameras, one 256x256 depth camera, 7-DoF proprioception, 6-axis force-torque, and language generates roughly 4.5 MB/second: 2 cameras x 256x256x3 bytes x 10 fps = 3.9 MB/s for RGB, 256x256x4 bytes x 10 fps = 2.6 MB/s for depth (float32), 13 floats x 4 bytes x 100 Hz = 5.2 KB/s for proprioception, and 6 floats x 4 bytes x 1000 Hz = 24 KB/s for force-torque. With PNG compression on images, effective rate drops to roughly 1.5-2 MB/second. A 30-second episode is 45-60 MB. For a 10,000-episode dataset, budget 450-600 GB of raw storage. Use gzip level 4 for HDF5 datasets and PNG encoding for RLDS image features. Maintain a copy of raw uncompressed data on a separate drive — recompression to a different format is trivial, but recovering from lossy compression artifacts in depth maps is impossible."
    },
    {
      question: "Can I combine multimodal data from different robot platforms?",
      answer: "Yes, and cross-embodiment multimodal datasets are the foundation of current foundation model research. Open X-Embodiment combines data from 22 robot platforms with varying sensor suites into a unified training mixture. The key is a standardized observation-action interface: images are resized to a common resolution (256x256), proprioception is expressed as end-effector pose (7-DoF: xyz + quaternion) rather than robot-specific joint angles, and actions use delta end-effector targets with a binary gripper command. Modalities that only exist on some robots (depth, force-torque, tactile) are handled via masking — the model learns to predict actions from whatever modalities are available. Implement this by defining a union observation spec that includes all possible modalities, then filling missing modalities with zero tensors and setting a corresponding modality_mask boolean to False. The critical requirement is that shared modalities must use identical conventions: images in the same orientation and color space, positions in meters, quaternions in the same convention (xyzw), and forces in Newtons."
    }
  ],
  ctaHeading: "Need Multimodal Robot Data?",
  ctaDescription: "Claru builds multimodal robot datasets with synchronized vision, proprioception, force, tactile, and language annotations. Talk to a specialist about your sensor suite and model requirements.",
  relatedGlossaryTerms: ["proprioceptive-data","depth-data","teleoperation-data","egocentric-video","vla"],
  relatedGuidePages: ["how-to-create-a-robot-demonstration-dataset","how-to-convert-data-to-rlds-format"],
  relatedSolutionSlugs: ["teleoperation-data","vla-training-data"],
  difficulty: "intermediate",
  estimatedTime: "3-6 weeks",
  prerequisites: ["Robot platform with ROS2 support","RGB-D camera(s) and optional force-torque sensor","Real-time kernel or PTP-capable network","Python 3.10+ with h5py, NumPy, and OpenCV","Understanding of target VLA model input requirements"],
  tools: ["ROS2","Intel RealSense SDK","ATI Force-Torque Sensor","Python","NumPy","h5py","message_filters","RLDS"],
  steps: [
    {
      stepNumber: 1,
      title: "Audit Target Model Requirements and Define the Modality Spec",
      description: "Different VLA architectures consume different modality combinations, and mismatches between your dataset and the target model are the most common source of wasted collection effort. Start by reading the model's dataloader code (not the paper — papers omit normalization details). RT-2 expects a single 320x256 RGB image and a natural language instruction. Octo expects a primary RGB image (256x256), an optional wrist image (128x128), proprioceptive state as a 7-DoF end-effector pose, and a language instruction tokenized with T5. Diffusion Policy expects multi-view RGB images (2-3 cameras at 96x96 to 256x256) and joint-space proprioception and actions. OpenVLA expects a single 224x224 RGB image, language instruction, and 7-DoF delta end-effector action.\n\nCreate a modality specification table with columns: modality name, tensor shape, dtype, units, coordinate frame, sampling rate, and which target models require it. For example: rgb_primary: (256,256,3) uint8, BGR order (OpenCV default), 10 Hz, base frame, required by all. depth_primary: (256,256) float32, meters, 10 Hz, camera frame, required by 3D-aware models. joint_positions: (7,) float64, radians, 100 Hz, joint frame. ee_pose: (7,) float64, [meters, quaternion xyzw], 100 Hz, base frame. force_torque: (6,) float64, [N, Nm], 1000 Hz, sensor frame. language_instruction: string, one per episode. Freeze this spec before configuring any hardware. If you plan to train on multiple architectures, define the union of all required modalities — it is far cheaper to record extra modalities you may not immediately need than to re-collect data when you switch architectures.",
      tools: ["Target model source code", "Markdown spec document"],
      tips: ["Clone the target model repo and run its dataloader on a dummy dataset to verify the exact tensor shapes and normalization expected — do this before collecting a single episode"]
    },
    {
      stepNumber: 2,
      title: "Configure Sensors and Build the Synchronization Pipeline",
      description: "Install and calibrate each sensor in the modality spec. For RGB-D cameras, mount an Intel RealSense D435i at the primary viewpoint (typically 45-degree angle, 0.5-1.0m from workspace) and optionally a D405 on the robot's wrist. Calibrate intrinsics with a ChArUco board (target reprojection error <0.3 px) and extrinsics via hand-eye calibration. For force-torque sensing, mount the ATI Mini45 or Robotiq FT 300 between the robot's wrist flange and the gripper, zero the sensor after mounting (with gripper attached, before any payload), and record the gravity compensation offset. For proprioception, subscribe to the robot's /joint_states topic at 100+ Hz and compute forward kinematics for the end-effector pose using the official URDF.\n\nBuild the synchronization pipeline as a ROS2 node. Use message_filters.ApproximateTimeSynchronizer for sensor topics running at different rates. The synchronizer groups messages within a configurable slop window — set this to half the period of your slowest sensor (e.g., 16 ms for 30 Hz cameras). On each synchronized callback, pack all modalities into a single observation dictionary. For high-rate sensors (force-torque at 1000 Hz, joint states at 100 Hz), downsample to the target control frequency (typically 10-20 Hz) using the most recent reading before the synchronized timestamp. Store the raw high-rate streams as separate datasets for researchers who need them. Test the full pipeline by recording 10 episodes and verifying: zero NaN values, no all-black image frames, force-torque readings within sensor range (not saturated), and maximum cross-modality timestamp discrepancy below 20 ms.",
      tools: ["ROS2 Humble", "Intel RealSense SDK 2.0", "ATI sensor driver", "message_filters"],
      tips: ["Run cameras in hardware-sync mode by connecting their GPIO trigger lines — this eliminates per-frame jitter that software sync cannot fully resolve"]
    },
    {
      stepNumber: 3,
      title: "Design the Task Suite with Language Annotations",
      description: "Define the task suite and, crucially, the language annotation protocol. For VLA model training, every episode needs a natural language instruction that describes the task goal. Write a task catalogue with 3 language template variations per task to prevent models from memorizing specific phrasings: for a pick-and-place task, templates might be 'Pick up the {object} and place it on the {target}', 'Move the {object} to the {target}', and 'Put the {object} on top of the {target}'. Randomize which template is used for each episode.\n\nFor richer language supervision, add step-level narrations. Train annotators to narrate episodes post-hoc using a standardized vocabulary: 'reach toward the {object}', 'close gripper on {object}', 'lift {object} to height', 'transport {object} toward {target}', 'lower {object} onto {target}', 'open gripper'. These narrations become the training signal for hierarchical policy learning and language-conditioned sub-goal prediction. Design 15-30 tasks spanning increasing complexity: single-object pick-and-place, multi-object sorting, tool use (e.g., scooping with a spoon), articulated object manipulation (opening drawers, turning faucets), and multi-step sequential tasks (set a table: place plate, then fork, then knife). For each task, specify the required modalities — force-torque is critical for insertion and wiping tasks but optional for open-space transport. Create a task-modality matrix to guide collection scheduling.",
      tools: ["Task catalogue template", "Language template randomizer script"],
      tips: ["Have 3 different people write the language templates for each task — single-author templates develop stylistic patterns that models exploit as shortcuts instead of grounding language to actions"]
    },
    {
      stepNumber: 4,
      title: "Execute Multimodal Collection with Cross-Modal Quality Checks",
      description: "Run collection sessions with real-time monitoring of all modality streams. A multimodal collection station has more failure modes than a vision-only setup: force-torque sensors drift after thermal cycling (re-zero every 30 minutes), depth cameras produce holes on reflective surfaces (monitor depth completion rate), and high-rate proprioception recording can drop samples under CPU load (verify actual vs. expected sample count). Build a Streamlit dashboard with one panel per modality showing: RGB stream thumbnail, depth completion percentage, force-torque magnitude plot, joint position trace, and recording health indicators.\n\nFor each episode, the recording pipeline should: (1) display the language instruction template to the operator, (2) wait for the operator to confirm the scene is set up correctly, (3) record a 0.5-second pre-episode buffer (captures initial state), (4) record the episode until the operator signals completion or timeout, (5) run immediate validation — check all modalities present, no NaN values, frame counts match expected duration, force-torque not saturated. If any check fails, alert the operator to re-record immediately. Store each episode as a single HDF5 file with group structure: /observations/{modality_name}, /actions, /language_instruction (as string attribute), and /metadata (JSON with task_id, operator_id, success, timestamps). At production pace, expect 15-25 multimodal episodes per hour — slower than vision-only due to additional sensor checks and environment resets.",
      tools: ["Streamlit", "h5py", "matplotlib for real-time plotting"],
      tips: ["Record a 'sensor health' episode at the start of each session: move the robot through a known trajectory and verify all modality readings match expected values — this catches drift, miscalibration, and loose cable connections before they corrupt an hour of data"]
    },
    {
      stepNumber: 5,
      title: "Post-Process and Align Modalities to a Common Timeline",
      description: "After collection, run a post-processing pipeline that aligns all modalities to a uniform timeline and computes derived features. The raw data contains modalities at different rates (images at 30 Hz, proprioception at 100 Hz, force-torque at 1000 Hz) that were approximately synchronized during recording. Now resample everything to the target control frequency (typically 10 or 20 Hz). For downsampled modalities, take the nearest-neighbor sample before the target timestamp. For derived features, compute: end-effector velocity via Savitzky-Golay differentiation of the EE pose trajectory (window=11, order=3), grasp state changes (open-to-close and close-to-open transitions from gripper width thresholding), contact detection from force-torque magnitude thresholding (>2N typically indicates contact), and per-frame language relevance if using dense narrations.\n\nRun cross-modal consistency validation: (1) project the end-effector position into each camera frame using the calibrated extrinsics and verify it falls near the visible gripper (catches extrinsic calibration drift). (2) Check that force spikes temporally coincide with visible contact events in the RGB stream. (3) Verify that joint velocities are consistent with observed end-effector motion (catches URDF or FK bugs). (4) For depth data, verify that depth values at the gripper location are consistent with the forward-kinematics-computed distance. Flag episodes that fail cross-modal consistency for manual review. Expect to flag 5-15% of episodes; about half will be recoverable via recalibration of the alignment, the rest should be discarded.",
      tools: ["scipy.signal (Savitzky-Golay)", "NumPy", "OpenCV", "Open3D"],
      tips: ["Store the pre-processed and post-processed data separately — reprocessing from raw is time-consuming but sometimes necessary when you discover a systematic calibration error"]
    },
    {
      stepNumber: 6,
      title: "Format for VLA Training and Validate End-to-End",
      description: "Convert the post-processed dataset to your target training format. For RLDS (Octo, RT-X, OpenVLA): implement a TFDS DatasetBuilder with a features_dict that includes all modalities. Map image modalities to tfds.features.Image (use PNG encoding for RGB, float32 for depth), proprioceptive state to tfds.features.Tensor, language to tfds.features.Text, and add a modality_mask boolean tensor indicating which modalities are present in each episode (critical for mixed-embodiment datasets). For HDF5 (Diffusion Policy, ACT): your existing HDF5 files likely need only normalization. Compute per-modality statistics (mean, std) across the training split and store them as a JSON sidecar.\n\nGenerate stratified train/val/test splits (80/10/10) stratified by task variant and modality availability — ensure each split contains examples with all modality combinations. Final validation: load 100 episodes through the target model's dataloader and verify that a forward pass produces outputs of the expected shape (this catches subtle dtype mismatches, incorrect normalization, and modality key name mismatches). For multimodal datasets, additionally verify that masking a modality (replacing it with zeros and setting the mask to False) does not cause NaN outputs — models must gracefully handle missing modalities. Ship the dataset with: modality specification document, calibration files (camera intrinsics/extrinsics, FT zero offsets), normalization statistics, a working dataloader example, and a visualization script that renders all modalities for a single episode as a synchronized multi-panel video.",
      tools: ["tensorflow-datasets", "h5py", "PyTorch DataLoader", "imageio"],
      tips: ["Always include the URDF of the robot that collected the data — downstream users need it for coordinate frame transformations, inverse kinematics, and simulation"]
    }
  ],
  keyPapers: [
    {
      id: "open-x-embodiment-2024",
      title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Open X-Embodiment Collaboration",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864"
    },
    {
      id: "team-octo-2024",
      title: "Octo: An Open-Source Generalist Robot Policy",
      authors: "Octo Model Team",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2405.12213"
    },
    {
      id: "kim-openvla-2024",
      title: "OpenVLA: An Open-Source Vision-Language-Action Model",
      authors: "Kim et al.",
      venue: "arXiv 2406.09246",
      year: 2024,
      url: "https://arxiv.org/abs/2406.09246"
    },
    {
      id: "brohan-rt2-2023",
      title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2307.15818"
    }
  ],
  claruRelevance: "Claru builds synchronized multimodal robot datasets for VLA model training. Our collection rigs integrate RGB-D cameras, force-torque sensors, proprioceptive recording, and language annotation pipelines with sub-millisecond synchronization. We deliver in RLDS, HDF5, or custom formats with complete calibration files, normalization statistics, and working dataloaders — enabling your team to start training immediately.",
};

export default data;
