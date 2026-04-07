import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-build-a-cross-embodiment-dataset",
  metaTitle: "How to Build a Cross-Embodiment Robot Dataset (2026 Guide) | Claru",
  metaDescription: "Guide to building cross-embodiment datasets that span multiple robot platforms, including action space normalization, RLDS formatting, and embodiment-agnostic representations.",
  primaryKeyword: "how to build a cross-embodiment robot dataset",
  secondaryKeywords: ["cross-embodiment dataset","multi-robot dataset","RLDS dataset","Open X-Embodiment","robot foundation model data"],
  canonicalPath: "/guides/how-to-build-a-cross-embodiment-dataset",
  h1: "How to Build a Cross-Embodiment Robot Dataset",
  heroSubtitle: "Guide to building cross-embodiment datasets that span multiple robot platforms, including action space normalization, RLDS formatting, and embodiment-agnostic representations.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Build a Cross-Embodiment Robot Dataset", href: "/guides/how-to-build-a-cross-embodiment-dataset" },
  ],
  sections: [],
  faqs: [
    {
      question: "What robots should a cross-embodiment dataset include?",
      answer: "Cover at least 3 morphologically distinct platforms to test generalization. A good minimum set: one 7-DoF arm with parallel-jaw gripper (Franka Emika Panda), one 6-DoF arm with different kinematics (UR5e), and one mobile manipulator or dual-arm system (ALOHA, Stretch RE1). The Open X-Embodiment dataset includes 22 robot types. For practical dataset building, 3-5 robot types with 500+ demonstrations each gives better cross-embodiment training signal than 20 types with 50 demonstrations each."
    },
    {
      question: "How do you handle different action spaces across robots?",
      answer: "Normalize to a common action representation. The standard approach from RT-X is 7-dimensional end-effector delta actions: (dx, dy, dz, droll, dpitch, dyaw, gripper). Map each robot's native action space to this common space using forward kinematics. For robots with different gripper types (parallel-jaw vs. suction vs. dexterous hand), map gripper state to a normalized 0-1 range where 0 is fully open and 1 is fully closed. For dexterous hands, this lossy compression works for simple grasps but loses finger-level detail. Include the raw robot-specific actions alongside the normalized actions so downstream users can choose."
    },
    {
      question: "Do I need the same tasks on every robot?",
      answer: "Include a shared task subset (5-10 tasks executable on all platforms) plus robot-specific tasks that leverage each platform's capabilities. The shared tasks enable direct cross-embodiment comparison and are the primary training signal for generalization. Pick tasks that are physically achievable on all included robots: pick-and-place, drawer open/close, and button pressing work on most arm platforms. Robot-specific tasks (bimanual folding on ALOHA, mobile navigation on Stretch) add diversity but should be secondary in volume."
    },
    {
      question: "What is the RLDS format and why does it matter for cross-embodiment?",
      answer: "RLDS (Reinforcement Learning Datasets) is a TFRecord-based format adopted by the Open X-Embodiment consortium and used by RT-X, Octo, and OpenVLA. It stores episodes as sequences of steps, each containing observations, actions, rewards, and metadata. RLDS matters because it is the de facto standard for cross-embodiment training: every major robot foundation model consumes RLDS data. Deviating from RLDS means your data cannot be used with these models without conversion. Use the tfds RLDS builder to create your dataset and validate with `tfds.load()` to ensure compatibility."
    },
    {
      question: "How much data per embodiment is needed for foundation model training?",
      answer: "For fine-tuning existing foundation models (Octo, OpenVLA), 100-500 demonstrations per robot on your target task domain produce meaningful adaptation. For training a new cross-embodiment model from scratch, you need 10,000+ demonstrations across all embodiments combined, with at least 1,000 per robot type. The Open X-Embodiment dataset contains over 1 million episodes across 22 robots. Diminishing returns set in around 5,000 demonstrations per embodiment for shared task families, but rare scenarios (cluttered scenes, novel objects) continue to benefit from more data."
    }
  ],
  ctaHeading: "Need Help With This?",
  ctaDescription: "Talk to a Claru data collection specialist about your specific requirements.",
  relatedGlossaryTerms: ["cross-embodiment-data","open-x-embodiment","rlds","foundation-model-robotics"],
  relatedGuidePages: ["how-to-convert-data-to-rlds-format","how-to-build-a-manipulation-dataset"],
  relatedSolutionSlugs: ["vla-training-data"],
  difficulty: "advanced",
  estimatedTime: "6-12 weeks",
  prerequisites: [
    "Access to 2+ robot platforms with different morphologies (e.g., Franka Panda + UR5e, or Franka + ALOHA)",
    "Teleoperation interface for each platform (GELLO, UMI, VR controller, or kinesthetic teaching)",
    "Python 3.9+ with TensorFlow Datasets, NumPy, and robotics-toolbox-python installed",
    "Understanding of RLDS format specification and the Open X-Embodiment data conventions",
    "Shared task set achievable across all target platforms",
    "Storage for large multi-robot datasets (plan for 100GB+ at scale)"
  ],
  tools: ["TensorFlow Datasets","RLDS","Octo","OpenVLA","ROS2","robotics-toolbox-python","Python","NumPy","h5py","Apache Beam"],
  steps: [
    {
      stepNumber: 1,
      title: "Define the Common Task Set and Per-Robot Configurations",
      description: "A cross-embodiment dataset is only useful if it contains semantically equivalent tasks performed by different robots. Start by defining a shared task set of 5-15 tasks that all target robots can physically execute, plus optional per-robot task extensions.\n\nFor the shared set, choose tasks that test fundamental manipulation capabilities: pick-and-place (single object to target zone), drawer open and close, button pressing, object reorientation, and stacking. For each shared task, write a single task specification that is robot-agnostic: describe the initial conditions (e.g., 'object centered on table within 15cm radius of robot base center'), success criteria ('object placed within 3cm of target marker and stationary for 0.5 seconds'), and failure conditions. Crucially, define the task in terms of end-effector outcomes, not joint-space motions.\n\nFor each robot platform, document the kinematic configuration: URDF file path, joint limits, end-effector frame definition, gripper type and range, control frequency, and workspace boundaries. Create a per-robot config file: `robot_config_franka.json` containing `{\"dof\": 7, \"ee_frame\": \"panda_hand_tcp\", \"gripper_range_m\": [0.0, 0.08], \"control_hz\": 20, \"workspace\": {\"x\": [-0.4, 0.4], \"y\": [0.2, 0.8], \"z\": [0.0, 0.5]}}`. This config is used during data collection and again during normalization.\n\nMap the workspace boundaries across robots. The physical workspace may differ (Franka reaches 0.855m, UR5e reaches 0.85m, but their mounting positions may put different table regions in reach). Identify the common reachable workspace and restrict all shared task initial conditions to this overlap zone. This ensures that task difficulty is comparable across robots -- a pick-and-place at the edge of one robot's workspace but the center of another's is not a fair comparison.\n\nDesign 2-5 per-robot extension tasks that exploit unique capabilities. For a dual-arm ALOHA: bimanual handoff, collaborative assembly. For a mobile Stretch: navigate-then-manipulate, drawer open from different approach angles. These tasks increase dataset diversity and allow the foundation model to learn robot-specific affordances.",
      tools: ["Python", "JSON Schema", "robotics-toolbox-python"],
      tips: [
        "Test every shared task on every robot before committing to the task set. A task that is trivial on one robot (stacking on Franka) may be infeasible on another (stacking on a Stretch arm with limited dexterity).",
        "Define success criteria in Cartesian space, not joint space. Joint-space success criteria are inherently embodiment-specific.",
        "Include a calibration task (reach to 5 known points in the shared workspace) that is run on every robot at the start of each collection session. This provides a cross-embodiment coordinate frame alignment check."
      ]
    },
    {
      stepNumber: 2,
      title: "Normalize Observation and Action Spaces",
      description: "The core engineering challenge of cross-embodiment datasets is mapping different robots' proprietary sensor data and control interfaces to a common representation. The RT-X project established conventions that have become the standard.\n\nFor actions, normalize to 7-dimensional end-effector deltas: (dx, dy, dz, droll, dpitch, dyaw, gripper_delta) in the robot's base frame. Compute these from the robot's native action space using forward kinematics. For a Franka controlled in joint space: at each timestep, compute the current and next end-effector poses using `robot.fkine(q_current)` and `robot.fkine(q_next)`, then compute the delta as the relative SE(3) transformation. Express rotation deltas as axis-angle or Euler angles (matching the convention your target model expects -- Octo uses axis-angle, OpenVLA uses Euler). Normalize gripper commands to a 0-1 range: `gripper_normalized = (gripper_width - gripper_min) / (gripper_max - gripper_min)`.\n\nFor observations, define a common observation dictionary: `image` (uint8, H x W x 3 -- resize all cameras to a common resolution, typically 256x256 or 224x224), `wrist_image` (uint8, same resolution if available), `state` (float32, robot proprioception), and `language_instruction` (string). The `state` vector should follow the convention: [ee_x, ee_y, ee_z, ee_quat_x, ee_quat_y, ee_quat_z, ee_quat_w, gripper_width]. This 8-dimensional state vector is computable from any robot's joint state via forward kinematics and is the input that cross-embodiment models consume.\n\nFor image observations, address camera differences across robots. Wrist cameras on different robots have different intrinsics, mounting positions, and fields of view. Do not simply concatenate images from different cameras -- instead, standardize by cropping to the workspace-relevant region and resizing to 256x256. Apply minimal preprocessing (only resize and center-crop, no color augmentation at dataset-creation time). Store the original camera intrinsics in metadata so downstream users can undo the crop if needed.\n\nInclude the robot's embodiment identifier as a per-episode metadata field: `embodiment_id = \"franka_panda\"`. This enables embodiment-conditional architectures that route through different adapter layers per robot. The Open X-Embodiment convention uses a string identifier; register yours in a `EMBODIMENT_REGISTRY.json` to avoid collision with the official OXE dataset names.",
      tools: ["robotics-toolbox-python", "OpenCV", "NumPy", "Python"],
      tips: [
        "Always store both the normalized common-space action AND the raw robot-specific action. Users training embodiment-specific policies want the raw actions; users training foundation models want the normalized ones.",
        "Check that the sign conventions match across robots. Franka's x-axis may point forward while UR5e's points in a different direction depending on mounting. Align all robots to a common base frame convention (x-forward, y-left, z-up) before computing normalized actions.",
        "Validate normalization by plotting the action distributions per robot. If one robot's normalized actions are bimodally distributed while another's are uniform, the normalization may have a sign error or offset."
      ]
    },
    {
      stepNumber: 3,
      title: "Collect Demonstrations Across All Platforms",
      description: "Run parallel collection campaigns across all robot platforms, collecting the shared task set on every robot and the per-robot extensions on their respective platforms. Coordination across platforms is critical to maintaining dataset consistency.\n\nFor each robot, set up the collection environment to be as similar as possible. Use the same table, same objects (from the YCB object set or a shared custom object set), and similar lighting conditions. Photograph each setup from a fixed overhead position to document the workspace layout. While exact replication across labs is impossible (different rooms, slightly different table heights), matching the key variables reduces confounding factors.\n\nUse the best available teleoperation interface for each robot. For Franka, GELLO provides the most natural bilateral control. For UR5e, the UMI (Universal Manipulation Interface) gripper-centric approach works well. For ALOHA, use the built-in leader-follower teleoperation. The teleoperation interface will differ across robots, and this is acceptable -- the goal is to produce high-quality demonstrations on each platform, not to standardize the collection method.\n\nRun the shared tasks in a round-robin schedule: collect 50 demonstrations of Task 1 on Robot A, then 50 of Task 1 on Robot B, then 50 of Task 1 on Robot C, before moving to Task 2. This ensures that if collection is interrupted, you have balanced coverage across robots for completed tasks rather than 500 demonstrations on one robot and zero on another.\n\nRecord data in each robot's native format (rosbag2 for ROS-based systems, HDF5 for robomimic-based systems). Convert to the common representation in a separate post-processing step rather than recording directly in the common format. This preserves the full-fidelity robot-specific data and lets you fix normalization bugs without re-collecting.\n\nTarget 200-500 demonstrations per robot per shared task for fine-tuning existing foundation models. For training a new model from scratch, aim for 1,000+ per robot per task. Include 10-20% failure demonstrations per task per robot -- failure modes differ across embodiments and these differences are training signal, not noise.",
      tools: ["GELLO", "UMI", "ALOHA teleop", "ROS2", "rosbag2", "h5py"],
      tips: [
        "Use the same object instances across robots, not just the same object types. Physical variation between two 'identical' YCB mugs (slightly different weight, surface finish) introduces a confound. Ship objects between collection sites if needed.",
        "Synchronize operator training across platforms. If possible, have the same operators collect data on all robots so operator-specific biases are shared rather than confounded with embodiment effects.",
        "Run the calibration task (5 reference points) at the start of every session on every robot. This provides a post-hoc check that the robots' coordinate frames are consistent."
      ]
    },
    {
      stepNumber: 4,
      title: "Convert to RLDS Format",
      description: "Convert all collected data to the RLDS format, the standard consumed by cross-embodiment foundation models (RT-X, Octo, OpenVLA). RLDS stores episodes as TFRecord files where each episode is a sequence of steps, and each step contains observations, actions, reward, and metadata.\n\nCreate a dataset builder by subclassing `tfds.core.GeneratorBasedBuilder`. Define the feature specification matching the Open X-Embodiment conventions:\n\n```python\nfeatures = tfds.features.FeaturesDict({\n  'steps': tfds.features.Dataset({\n    'observation': tfds.features.FeaturesDict({\n      'image': tfds.features.Image(shape=(256, 256, 3)),\n      'wrist_image': tfds.features.Image(shape=(256, 256, 3)),\n      'state': tfds.features.Tensor(shape=(8,), dtype=tf.float32),\n    }),\n    'action': tfds.features.Tensor(shape=(7,), dtype=tf.float32),\n    'reward': tfds.features.Scalar(dtype=tf.float32),\n    'is_first': tf.bool,\n    'is_last': tf.bool,\n    'is_terminal': tf.bool,\n    'language_instruction': tfds.features.Text(),\n  }),\n  'episode_metadata': tfds.features.FeaturesDict({\n    'embodiment': tfds.features.Text(),\n    'task': tfds.features.Text(),\n    'success': tf.bool,\n  }),\n})\n```\n\nWrite a conversion script per robot platform that reads the native format and yields episodes in the RLDS schema. For each robot, load the raw episode, apply the action normalization from Step 2, resize images to 256x256, compute the 8-dimensional state vector from joint states, and emit one step per timestep. Handle camera availability differences: if a robot lacks a wrist camera, fill `wrist_image` with zeros and document this in the metadata.\n\nValidate the converted dataset by loading it with `tfds.load('your_dataset')` and checking: all tensors have the expected shape, action ranges fall within [-1, 1] after normalization (clip outliers and log warnings for values exceeding [-2, 2]), images are correctly oriented and not corrupted, and language instructions are populated for every step. Run a visualization script that renders one episode per robot per task to visually confirm the data looks correct.\n\nFor large datasets (100K+ episodes), use Apache Beam for parallel conversion: `python build_dataset.py --pipeline_type=beam --beam_runner=DirectRunner --num_workers=8`. This parallelizes the IO-heavy conversion across multiple CPU cores and handles fault tolerance (resuming from the last successful episode if the job is interrupted).",
      tools: ["TensorFlow Datasets", "Apache Beam", "Python", "NumPy"],
      tips: [
        "Follow the Open X-Embodiment naming conventions exactly. The embodiment string, task string, and observation key names must match what Octo and OpenVLA expect. Deviating even slightly (e.g., 'rgb_image' instead of 'image') will cause silent failures during model loading.",
        "Store both a 'raw_action' field (robot-specific, un-normalized) and the 'action' field (7-DoF normalized) in the RLDS record. This costs minimal extra storage and lets users train both cross-embodiment and per-robot models from the same dataset.",
        "Run the RLDS dataset through Octo's data loading pipeline (even if you will not train Octo) to verify compatibility. If Octo can load and iterate one batch, any RLDS-consuming model can."
      ]
    },
    {
      stepNumber: 5,
      title: "Validate Cross-Embodiment Consistency",
      description: "After conversion, verify that the dataset is actually useful for cross-embodiment training by checking statistical consistency and running diagnostic training experiments.\n\nCompute per-embodiment statistics and check for distributional alignment. For actions: plot the distribution of each action dimension across embodiments. The x, y, z deltas should have similar ranges if the workspace normalization from Step 2 was correct. If Franka actions have 3x the range of UR5e actions on the same pick-and-place task, the normalization has a scaling error. Use `np.histogram(actions[:, dim], bins=50)` per dimension per embodiment and compare. Rotation action distributions will differ more (different kinematics cause different rotation strategies for the same task) -- this is expected and acceptable.\n\nFor observations: compute the mean and variance of the proprioceptive state vector per embodiment. End-effector positions should cluster in the shared workspace region. If one robot's states are offset by 0.5m on the x-axis, the base frame alignment is wrong. Compute t-SNE embeddings of a random sample of images per embodiment. If the embeddings cluster by robot rather than by task, the visual domains are too different for naive cross-embodiment training and you may need visual domain randomization.\n\nRun a diagnostic training experiment. Train a simple behavioral cloning model (2-layer MLP on state + ResNet-18 on images) on three dataset configurations: (A) Franka-only data, (B) UR5e-only data, and (C) pooled cross-embodiment data. Evaluate each model on held-out episodes from both robots. If configuration (C) outperforms (A) and (B) on the other robot's test set, the cross-embodiment data provides positive transfer. If (C) is worse than per-robot training, the action normalization or observation alignment has a problem that must be fixed before scaling.\n\nCheck language instruction consistency. For the same task across robots, the language instruction must be identical. If Franka episodes say 'pick up the red block' and UR5e episodes say 'grasp the red cube', the language conditioning will not transfer across embodiments. Normalize all language instructions to a canonical form per task and verify programmatically.",
      tools: ["NumPy", "Matplotlib", "scikit-learn", "PyTorch", "TensorFlow"],
      tips: [
        "The diagnostic training experiment is the most informative validation step. If cross-embodiment pooling does not help, no amount of data scaling will fix the underlying alignment problem. Run this test before investing in large-scale collection.",
        "Pay special attention to gripper normalization. A gripper_normalized value of 0.5 should mean the same physical gap (approximately) on all robots. If the Franka gripper at 0.5 is 4cm open and the UR5e gripper at 0.5 is 8cm open, grasping policies will not transfer.",
        "Include per-embodiment eval splits that are never mixed across robots. This lets you measure within-robot performance (generalization to new initial conditions) separately from cross-robot transfer (generalization to new morphologies)."
      ]
    },
    {
      stepNumber: 6,
      title: "Package, Document, and Release",
      description: "Package the dataset for consumption by foundation model training pipelines. The release should enable any lab to download the data and begin training within an hour.\n\nStructure the release as a TFDS dataset with named configs per embodiment: `your_dataset/franka_panda`, `your_dataset/ur5e`, `your_dataset/aloha`, and `your_dataset/all` (the combined dataset). Each config contains the episodes for that embodiment with consistent schemas. Users can load a single embodiment (`tfds.load('your_dataset/franka_panda')`) or the full pool (`tfds.load('your_dataset/all')`).\n\nGenerate comprehensive metadata. For the dataset-level: total episodes per embodiment, total steps per embodiment, task distribution per embodiment, success rates per task per embodiment, and action space statistics (min, max, mean, std per dimension per embodiment). For the per-episode level: embodiment ID, task name, success flag, episode length, and operator ID. For the per-step level: all observation and action tensor shapes and dtypes.\n\nCreate a data card following the Open X-Embodiment template. Include: collection setup photos for each robot, URDF or kinematic descriptions, sensor specifications (camera models, proprioceptive sensor specs), action normalization formulas with derivations, language instruction vocabulary, known limitations (e.g., 'UR5e demonstrations have 20% higher grasp failure rate due to gripper compliance'), and intended use cases.\n\nProvide integration code for the major foundation models: a one-file adapter that loads your dataset into Octo's training pipeline, a config file for OpenVLA fine-tuning, and an example training script that runs 100 steps of cross-embodiment BC to verify the pipeline works. Test these integrations yourself before releasing.\n\nHost the dataset on a cloud storage bucket (GCS or S3) with public read access and register it with TFDS so users can download with `tfds.load()`. For very large datasets (> 100GB), also provide a torrent or academic download link. Publish the dataset alongside a technical report (even a 4-page workshop paper) describing the collection protocol, normalization choices, and baseline results. A dataset without published baselines sees 70% less adoption than one with baselines.",
      tools: ["TensorFlow Datasets", "Google Cloud Storage", "Python", "Markdown"],
      tips: [
        "Test the full download-to-training pipeline on a clean machine (not your development environment). Missing dependencies, hardcoded paths, and environment-specific configurations are the top complaints from dataset users.",
        "Include a 'mini' dataset split (50 episodes per embodiment) that downloads in under 1 minute. Researchers use this to test their training code before downloading the full multi-GB dataset.",
        "Version the dataset with semantic versioning (v1.0, v1.1, v2.0). Adding new embodiments or re-normalizing actions is a minor version bump. Changing the observation schema is a major version bump. Never silently update a released version."
      ]
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
      venue: "CoRL 2024",
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
  claruRelevance: "Cross-embodiment datasets demand collection infrastructure across multiple robot platforms and the data engineering to normalize heterogeneous sensor data into a unified format. Claru operates collection cells with Franka Emika Panda, UR5e, xArm, and custom manipulators across our facility network, running identical task suites with matched object sets and calibrated workspaces. We handle the hardest parts: bilateral teleoperation on each platform to produce high-quality demonstrations, per-robot action space normalization to the 7-DoF RT-X convention, RLDS conversion with validated schemas, and cross-embodiment consistency checks including diagnostic training experiments. For labs building or fine-tuning robot foundation models like Octo or OpenVLA, Claru delivers ready-to-train RLDS datasets spanning multiple embodiments with language instructions, quality-filtered episodes, and published baseline results.",
};

export default data;
