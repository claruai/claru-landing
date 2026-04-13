import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-build-a-manipulation-dataset",
  metaTitle: "How to Build a Manipulation Dataset (2026 Guide) | Claru",
  metaDescription: "Complete guide to creating a high-quality manipulation dataset including task design, collection protocols, annotation, and validation.",
  primaryKeyword: "how to build manipulation dataset",
  secondaryKeywords: ["manipulation dataset creation", "robot manipulation data", "build grasp dataset", "tabletop manipulation training data"],
  canonicalPath: "/guides/how-to-build-a-manipulation-dataset",
  h1: "How to Build a Manipulation Dataset for Robot Learning",
  heroSubtitle: "Complete guide to creating a high-quality manipulation dataset including task design, teleoperation setup, multi-camera recording, trajectory annotation, and validation for policy learning.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Build a Manipulation Dataset for Robot Learning", href: "/guides/how-to-build-a-manipulation-dataset" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Dataset Size Guidelines by Model Architecture",
      paragraphs: [
        "The required dataset size depends heavily on the target model architecture and the diversity of the task space. For single-task behavioral cloning with Diffusion Policy, as few as 50-200 high-quality demonstrations can achieve above 80% success rate, as demonstrated in the original Chi et al. paper. ACT achieves similar efficiency for bimanual tasks. For multi-task policies trained from scratch, budget 100-500 demonstrations per task variant, where a variant is a unique combination of object type and goal configuration. Foundation models like Octo and OpenVLA require larger per-task counts (200-1,000) because they must learn a shared representation across tasks.",
        "The relationship between dataset size and performance follows a logarithmic curve: doubling from 50 to 100 demonstrations produces a large jump in success rate, while doubling from 5,000 to 10,000 produces a marginal improvement. This means the first 500 demonstrations are the most valuable per-episode, and quality matters more than quantity at every scale. The BridgeData V2 project collected 60,000 demonstrations across 24 environments and found that filtering the bottom 15% by quality score improved multi-task policy performance by 18% \u2014 equivalent to collecting an additional 10,000 demonstrations. Invest in quality pipelines before investing in collection scale.",
      ],
    },
    {
      type: "prose",
      heading: "Multi-Camera Setup and Calibration for Manipulation Data",
      paragraphs: [
        "Camera placement is one of the most impactful decisions in manipulation dataset design because it determines what the trained policy can see. The minimum setup is two cameras: a wrist-mounted Intel RealSense D405 (compact, high-resolution at close range, ideal for gripper-object interactions) and an external workspace camera (RealSense D435 or ZED 2, mounted on a tripod at 45-60 degrees above the workspace). The wrist camera provides fine-grained contact information invisible from external views, while the external camera provides spatial context for reaching and obstacle avoidance.",
        "Calibrate each camera's intrinsics using OpenCV's checkerboard calibration (cv2.calibrateCamera) with a 9x6 checkerboard pattern captured at 20+ poses, targeting reprojection error below 0.5 pixels. For wrist camera extrinsics (camera-to-end-effector transform), use eye-in-hand calibration: move the robot to 15-20 poses where a fixed ArUco marker is visible, record end-effector poses and marker detections, then solve with cv2.calibrateHandEye using the CALIB_HAND_EYE_TSAI method. Verify calibration by projecting known 3D points into each camera and checking alignment within 3-5 pixels. Set up clock synchronization between the robot controller and cameras using PTP or a hardware trigger line. Test by commanding a fast gripper close and verifying the gripper state change aligns with the visual closure within one frame (33ms at 30 FPS).",
      ],
    },
  ],
  faqs: [
    {
      question: "What action representation should I use for a manipulation dataset?",
      answer: "The choice depends on your target policy architecture. End-effector delta poses (6-DoF position and orientation deltas in the end-effector frame) are the most common representation for imitation learning because they transfer across robot embodiments and are what models like Diffusion Policy and ACT expect by default. Record actions at the control frequency of your robot (typically 10-50 Hz for teleoperation). Joint position targets are necessary if you need precise joint-level control or are training joint-space policies, but they do not transfer between different robot arms. For grasping tasks, include a binary or continuous gripper command as an additional action dimension. Always record both the commanded action and the actual achieved state so you can compute tracking error. Normalize actions to zero-mean unit-variance per dimension across the training set, and store the normalization statistics alongside the dataset so downstream users can apply the same transform."
    },
    {
      question: "How many cameras do I need and where should I place them?",
      answer: "At minimum, use two cameras: one wrist-mounted camera (Intel RealSense D405 is the standard for its compact size and close-range depth) and one third-person workspace camera (RealSense D435 or ZED 2). The wrist camera captures fine-grained gripper-object interactions that are invisible from external views, while the third-person camera provides spatial context for reaching and navigation. For complex tasks involving occlusion (such as placing objects inside containers or behind obstacles), add a second external camera at a 60-90 degree offset from the first. Research from the RoboTurk and MimicGen projects shows that two-camera setups improve policy success rates by 15-30% over single-camera setups. Mount cameras on rigid fixtures, not the robot arm joints, to avoid vibration blur. Calibrate intrinsics using OpenCV's checkerboard calibration (cv2.calibrateCamera) and extrinsics using hand-eye calibration (cv2.calibrateHandEye with the Tsai-Lenz method)."
    },
    {
      question: "How do I handle task failures during data collection?",
      answer: "Develop a clear failure taxonomy and recording protocol before collection begins. Categorize failures into operator errors (wrong grasp point, collision), system errors (communication dropout, sensor failure), and task ambiguity (unclear success criteria). For operator errors, the standard practice is to immediately discard the episode and re-record, since including failed demonstrations without explicit failure labels can confuse imitation learning policies. However, if you plan to train with hindsight relabeling or offline RL methods, failed episodes become valuable training signal. In that case, annotate each episode with a binary success label and optionally a failure mode category. Track your failure rate per task and per operator. A sustained failure rate above 20% indicates a protocol or task design problem that should be addressed before continuing collection. The RoboCasa benchmark demonstrated that including 10-15% annotated failure episodes alongside successful demonstrations improved policy robustness in novel environments."
    },
    {
      question: "What teleoperation interface works best for manipulation data collection?",
      answer: "The three dominant options are leader-follower arms, VR controllers, and 3D SpaceMouse devices, each with distinct trade-offs. Leader-follower setups (such as ALOHA's dual-arm configuration using pairs of ViperX 300 arms) provide the most natural force feedback and are best for bimanual or contact-rich tasks, but require expensive duplicate hardware. VR controllers (Meta Quest 3 with custom IK solvers) offer 6-DoF input with wrist rotation at lower cost and are well-suited for single-arm pick-and-place tasks, though operators need 2-4 hours of practice to achieve smooth trajectories. The 3Dconnexion SpaceMouse is the cheapest option and works well for slow, precise tasks but struggles with fast or reactive manipulation because it lacks direct pose mapping. For most tabletop manipulation datasets, VR controllers offer the best throughput-to-cost ratio at 25-40 successful episodes per hour. Whichever interface you choose, enforce a maximum episode length (typically 15-30 seconds for tabletop tasks) to prevent long idle periods that waste training compute."
    },
    {
      question: "How should I split a manipulation dataset for training and evaluation?",
      answer: "Never split randomly by episode. Instead, split by a held-out axis of variation to test the generalization you actually care about. For object generalization, train on a subset of objects and evaluate on held-out objects from the same categories (for example, train on 8 mug instances, test on 4 unseen mugs). For spatial generalization, train with objects placed in certain workspace regions and evaluate with objects in held-out positions. For environment generalization, collect in multiple table setups or lighting conditions and hold out entire environments. The standard ratio is 80% train, 10% validation, 10% test, but the critical detail is ensuring your test set exercises the generalization axis. Always use the validation set for hyperparameter tuning and early stopping, and report final numbers only on the test set. Document exactly which episodes are in which split using a JSON manifest file that maps episode IDs to split labels. This prevents the common mistake of accidentally training on test episodes after re-processing the dataset."
    },
    {
      question: "What is the most common mistake when building a manipulation dataset?",
      answer: "The most common and costly mistake is not locking down the data specification before collection begins. Changing the action space representation (switching from end-effector deltas to joint positions), the image resolution (switching from 256x256 to 224x224), or the coordinate frame convention (switching from base frame to end-effector frame) after collecting 5,000 episodes means re-collecting from scratch. The data specification should be treated as a contract that requires formal approval to change. Write it in a versioned YAML file, have both the collection team and the model training team sign off, and freeze it before the first production episode is recorded.",
    },
  ],
  ctaHeading: "Need Help With This?",
  ctaDescription: "Talk to a Claru data collection specialist about your specific manipulation dataset requirements.",
  relatedGlossaryTerms: ["manipulation-trajectory", "behavioral-cloning", "action-chunking", "teleoperation-data"],
  relatedGuidePages: ["how-to-collect-teleoperation-data", "how-to-annotate-manipulation-trajectories"],
  relatedSolutionSlugs: ["manipulation-trajectory-data"],
  difficulty: "advanced",
  estimatedTime: "4-8 weeks",
  prerequisites: ["Robot arm with gripper (Franka, UR5e, or ViperX)", "Camera setup (wrist + external RealSense or ZED)", "Teleoperation interface (VR controller, SpaceMouse, or leader-follower)", "Data storage infrastructure (NAS or cloud with 1+ TB available)"],
  tools: ["ROS2", "Intel RealSense SDK", "robomimic", "HDF5", "Label Studio", "RLDS converter", "OpenCV"],
  steps: [
    {
      stepNumber: 1,
      title: "Define Task Suite and Data Specification",
      description: "Start by specifying the exact manipulation tasks, success criteria, and data format your downstream model requires. Create a task specification document that enumerates every task variant (e.g., 'pick mug from table and place on shelf', 'open drawer and retrieve object') with explicit success conditions (object within 2 cm of target pose, drawer open angle greater than 45 degrees). For each task, define the initial state distribution: how many object instances, what positions they can appear in, and what environment variations exist (lighting, background, table surface).\n\nNext, lock down the observation and action specification. Document the exact image resolution (224x224 or 256x256 for most VLA models), frame rate (10-30 Hz), depth map format (16-bit PNG or float32 in meters), proprioceptive state vector layout (joint positions, joint velocities, gripper width, end-effector pose), and action space (end-effector delta SE(3) with gripper command, or joint position targets). Specify the coordinate frame conventions (right-hand rule, z-up, base frame or end-effector frame for actions). Record all of this in a versioned YAML file that becomes the contract between data collection and model training teams. Changing the action representation after collecting 5,000 episodes means re-collecting from scratch, so invest time here. Reference the robomimic dataset format as a well-documented baseline: their HDF5 schema with /data/demo_N/obs, /data/demo_N/actions, and /data/demo_N/rewards groups is widely adopted."
    },
    {
      stepNumber: 2,
      title: "Build and Calibrate the Hardware Stack",
      description: "Assemble the physical data collection cell with precise sensor calibration. For a standard tabletop manipulation setup, mount a Franka Emika Panda or UR5e arm on a rigid table with an Intel RealSense D405 on the wrist (using a 3D-printed bracket that positions the camera 5-8 cm behind the gripper fingertips to avoid occlusion during grasping) and a D435 or D435i on a fixed tripod 60-80 cm above the workspace angled at approximately 45 degrees downward.\n\nCalibrate each camera's intrinsics using OpenCV's cv2.calibrateCamera with a 9x6 checkerboard pattern at 20+ poses, targeting a reprojection error below 0.5 pixels. Calibrate wrist camera extrinsics (camera-to-end-effector transform) using eye-in-hand calibration: move the robot to 15-20 poses where a fixed ArUco marker is visible, record the end-effector poses and marker detections, then solve with cv2.calibrateHandEye using the CALIB_HAND_EYE_TSAI method. For the external camera, calibrate its pose relative to the robot base frame by detecting an ArUco marker mounted on the end-effector at 15+ poses. Verify calibration quality by projecting known 3D points (robot joint positions from forward kinematics) into each camera and checking that the projected points align with the observed robot in the image within 3-5 pixels. Save calibration matrices in the dataset metadata.\n\nSet up clock synchronization between the robot controller, cameras, and any additional sensors using PTP or a hardware trigger line. Test by commanding a fast gripper close while recording: the gripper state change and the visual gripper closure in the camera feed should align within one frame (33 ms at 30 FPS). If they drift, you will train policies that react too early or too late to visual events."
    },
    {
      stepNumber: 3,
      title: "Implement the Teleoperation and Recording Pipeline",
      description: "Build a recording system that captures all modalities synchronously during teleoperation. Use ROS2 as the communication backbone with a custom recorder node that subscribes to camera topics (/camera_wrist/color/image_raw, /camera_external/color/image_raw, /camera_wrist/depth/image_rect_raw), robot state topics (/joint_states, /ee_pose), and the teleoperation command topic. Write all data to HDF5 in real-time using h5py with chunked datasets and gzip compression (level 4 balances speed and size). Structure each episode as /episode_NNNNNN/obs/rgb_wrist (uint8, H x W x 3), /episode_NNNNNN/obs/rgb_external, /episode_NNNNNN/obs/depth_wrist (float32, H x W), /episode_NNNNNN/obs/state (float32, state_dim), /episode_NNNNNN/actions (float32, action_dim), and /episode_NNNNNN/metadata (JSON string with task_id, operator_id, timestamp, success).\n\nConfigure the teleoperation interface. For a VR-based setup (Meta Quest 3 or Quest Pro), use a ROS2 node that reads the controller pose via the OpenXR SDK and maps it to end-effector delta commands through resolved-rate IK with a maximum velocity limit of 0.3 m/s linear and 1.0 rad/s angular to prevent jerky motions. Implement a clutching mechanism (grip button) that pauses command streaming so operators can reposition without moving the robot. Add a trigger button for gripper open/close.\n\nBuild an episode management system: a simple state machine that sequences through reset (move robot to home pose, randomize object placement), ready (wait for operator signal), recording (stream commands and observations), and done (save episode, log metadata). Add real-time quality checks that run after each episode: verify no frames were dropped (compare expected frame count at the recording Hz to actual), check that the episode length is within expected bounds, and compute a smoothness metric on the action trajectory (mean jerk magnitude should be below a threshold you calibrate during pilot collection)."
    },
    {
      stepNumber: 4,
      title: "Execute Structured Data Collection",
      description: "Run collection in three phases: pilot, calibration, and production. The pilot phase (50-100 episodes) validates the entire pipeline end-to-end. Have two different operators each collect 25-50 episodes across all task variants. After the pilot, train a simple behavior cloning policy (a ResNet-18 encoder feeding a 2-layer MLP) on the pilot data and evaluate it on the real robot. If the policy achieves above 30% success rate, the data quality is likely sufficient for scaling. If it fails completely, debug the data pipeline (common issues: action coordinate frame mismatch, image-action temporal misalignment, incorrect gripper command polarity).\n\nThe calibration phase (100-200 episodes) establishes throughput benchmarks and operator skill curves. Measure episodes per hour per operator, success rate per operator, and trajectory quality metrics (smoothness, path length efficiency). Use these metrics to set production targets and identify operators who need additional training. Rotate operators across task variants to prevent single-operator bias from dominating any task.\n\nThe production phase targets your full dataset size (typically 1,000-50,000 episodes depending on model and task complexity). Use a task-variant coverage tracker that assigns collection quotas: for each combination of object instance, initial position bin, and task type, track how many episodes exist and prioritize underfilled cells. This prevents the common failure mode where operators repeatedly collect the easiest variant. Implement a daily quality audit: randomly sample 20 episodes from the previous day's collection, play them back, and rate success/quality. Flag operators whose sampled quality drops below 85% success rate for retraining. Store raw data on a NAS with RAID redundancy and run nightly backup jobs to cloud storage. A single corrupted hard drive containing 2,000 irreplaceable demonstrations is a project-ending event."
    },
    {
      stepNumber: 5,
      title: "Validate, Clean, and Annotate the Dataset",
      description: "Run a comprehensive validation pipeline before any training. Start with automated checks: parse every HDF5 episode file and verify shape consistency (all RGB arrays are H x W x 3, all action arrays have the correct dimensionality), check for NaN or infinite values in proprioceptive data and actions, verify that timestamps are monotonically increasing with gaps no larger than 2x the expected frame period, and confirm that the episode metadata JSON parses correctly and contains all required fields.\n\nNext, compute dataset-level statistics. Generate per-dimension histograms for actions and states across the full dataset. Look for clipping at action limits (indicates the teleoperation interface was saturating), bimodal distributions in position dimensions (might indicate two distinct operator strategies that could confuse a unimodal policy), and outlier episodes where the mean action magnitude exceeds 3 standard deviations from the dataset mean. Compute workspace coverage heatmaps by binning end-effector positions into a 3D grid and visualizing occupancy. Sparse regions indicate task variants that are underrepresented.\n\nFor annotation, add task-level labels (which task variant this episode demonstrates), success labels (binary, determined by checking the final state against the task success criterion), and optionally sub-task boundary timestamps (reach, grasp, transport, place). Use a custom Label Studio project with a video playback interface to enable human annotators to verify success labels and mark sub-task transitions. The inter-annotator agreement for binary success labels should exceed 95%. For sub-task boundaries, accept a temporal tolerance of plus or minus 5 frames (0.5 seconds at 10 Hz). Export annotations as a sidecar JSON file per episode that the training dataloader can merge with the HDF5 observations. This separation keeps the large observation files immutable while allowing annotation iterations."
    },
    {
      stepNumber: 6,
      title: "Format, Package, and Document for Training",
      description: "Convert the validated, annotated dataset into the specific format your target model training pipeline expects. For Diffusion Policy (Chi et al., 2023), this means chunked action sequences: restructure the HDF5 so that each timestep's target is a chunk of the next T_a actions (typically T_a=16 at 10 Hz), and observations include a history window of T_o frames (typically T_o=2). For ACT (Zhao et al., 2023), structure similarly but include the full joint state in the observation and use joint-space actions. For foundation models like Octo or RT-2, convert to RLDS format using the tfds.rlds builder with properly typed features.\n\nGenerate train/validation/test splits by held-out object instances or environment configurations, not by random episode sampling. Create a splits.json manifest that maps every episode ID to its assigned split. Compute and record action normalization statistics (mean and standard deviation per dimension) on the training split only, and include these in the dataset metadata so models apply consistent normalization.\n\nPackage the dataset with comprehensive documentation. The dataset card should specify: robot platform and end-effector, camera models and calibration parameters, teleoperation interface, action space definition with units and coordinate frame, total episodes and hours of data, per-task episode counts, operator count and demographics, collection date range, known biases and limitations (e.g., all operators were right-handed, collection only in daylight), and license terms. Include a Python script (load_dataset.py) that returns a PyTorch Dataset or DataLoader with configurable image transforms, action chunking, and normalization. Include a visualization notebook (visualize_episodes.ipynb) that renders 5 random episodes with RGB frames, overlaid end-effector trajectories, and action profiles. Teams that skip documentation spend 1-3 weeks reverse-engineering data formats before their first training run."
    }
  ],
  keyPapers: [
    {
      id: "chi-diffusion-policy-2023",
      title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137"
    },
    {
      id: "zhao-aloha-2023",
      title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
      authors: "Zhao et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.13705"
    },
    {
      id: "mandlekar-robomimic-2021",
      title: "What Matters in Learning from Offline Human Demonstrations for Robot Manipulation",
      authors: "Mandlekar et al.",
      venue: "CoRL 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2108.03298"
    },
    {
      id: "nasiriany-robocasa-2024",
      title: "RoboCasa: Large-Scale Simulation of Everyday Tasks for Generalist Robots",
      authors: "Nasiriany et al.",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2406.02523"
    }
  ],
  claruRelevance: "Claru provides end-to-end manipulation dataset collection services, from cell design and calibration through teleoperated demonstration collection, annotation, and delivery in your target format. Our operators are trained on standardized teleoperation protocols across Franka, UR, and ViperX platforms, achieving 90%+ success rates on common tabletop tasks. We handle multi-camera calibration, real-time quality monitoring, and format conversion to Diffusion Policy, ACT, RLDS, or custom HDF5 schemas.",
};

export default data;
