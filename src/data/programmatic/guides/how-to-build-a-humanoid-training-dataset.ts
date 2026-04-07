import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-build-a-humanoid-training-dataset",
  metaTitle: "How to Build a Humanoid Training Dataset (2026 Guide) | Claru",
  metaDescription: "Step-by-step guide to building training datasets for humanoid robots: full-body motion capture, loco-manipulation demonstrations, multi-sensor recording, and data formatting for whole-body control policies.",
  primaryKeyword: "how to build a humanoid training dataset",
  secondaryKeywords: ["humanoid robot training data", "whole-body control dataset", "humanoid demonstration collection", "loco-manipulation dataset"],
  canonicalPath: "/guides/how-to-build-a-humanoid-training-dataset",
  h1: "How to Build a Humanoid Training Dataset",
  heroSubtitle: "A practitioner's guide to building training datasets for humanoid robots — capturing full-body motion, coordinating upper and lower body demonstrations, recording multi-sensor streams across locomotion and manipulation, and formatting data for whole-body control policies like HumanPlus and Humanoid-Gym.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Build a Humanoid Training Dataset", href: "/guides/how-to-build-a-humanoid-training-dataset" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Humanoid Datasets Require a Different Approach",
      paragraphs: [
        "Humanoid robots present a unique data collection challenge: the action space is 30-50+ degrees of freedom spanning bipedal locomotion, torso stabilization, and bimanual manipulation — all coupled through whole-body dynamics. A tabletop manipulation dataset captures 6-7 DoF arm trajectories with the base fixed. A humanoid dataset must simultaneously capture leg joint trajectories for walking and balancing, torso orientation for postural stability, and arm/hand trajectories for manipulation, all while maintaining temporal synchronization across dozens of sensors at 50-200 Hz. The HumanPlus system (Fu et al., 2024) demonstrated that human motion capture retargeted to a humanoid can produce effective whole-body imitation learning, but the data pipeline is substantially more complex than single-arm teleoperation.",
        "The field is converging on two complementary data sources for humanoid training: (1) human motion capture retargeted to the robot's kinematics via inverse kinematics solvers, which scales well but introduces retargeting errors at kinematic limits, and (2) direct teleoperation of the humanoid using exoskeletons or VR full-body tracking, which produces kinematically valid trajectories but is slow and physically demanding for operators. Most production pipelines combine both: motion capture for locomotion and gross body motion, direct teleoperation for fine manipulation segments. The dataset must track which segments use which source for downstream quality filtering.",
      ],
    },
    {
      type: "prose",
      heading: "Sensor Requirements for Full-Body Humanoid Data",
      paragraphs: [
        "A humanoid data collection rig requires sensors across three categories: proprioception (joint encoders, IMUs, force/torque sensors at the feet and wrists), exteroception (cameras covering the full body workspace plus egocentric head-mounted cameras), and ground truth state estimation (external motion capture or SLAM for base pose). At minimum, record all joint positions and velocities at 100 Hz, wrist and ankle force/torque at 200 Hz, 3-4 RGB cameras at 30 Hz covering the workspace from multiple angles, and head-mounted stereo cameras at 30 Hz for the egocentric view. The total data rate for a single humanoid episode is 50-100 MB per minute of recording, compared to 5-10 MB per minute for a tabletop arm setup.",
        "For motion capture retargeting, OptiTrack or Vicon systems tracking the human demonstrator at 120+ Hz provide the gold standard for full-body pose estimation. Budget $50,000-200,000 for a 10-20 camera motion capture installation covering a 5x5 meter capture volume. Lower-cost alternatives include markerless pose estimation from multi-camera RGB (using systems like MediaPipe or OpenPose), which costs only the cameras themselves but introduces 2-5 cm joint position error that compounds during IK retargeting. For direct humanoid teleoperation, the Fourier Intelligence GR-1 and Unitree H1 platforms support joint-level command interfaces that can be driven from VR full-body tracking or exoskeleton inputs.",
      ],
    },
    {
      type: "stats",
      heading: "Humanoid Dataset Scale Benchmarks",
      stats: [
        { value: "30-50+", label: "DoF in typical humanoid action space" },
        { value: "100 Hz", label: "Minimum proprioception recording rate" },
        { value: "10K-50K", label: "Demonstrations for robust whole-body policy" },
        { value: "50-100 MB/min", label: "Raw data rate per recording session" },
      ],
    },
  ],
  faqs: [
    {
      question: "How many demonstrations do I need to train a humanoid whole-body policy?",
      answer: "Current research suggests 10,000-50,000 demonstrations for robust whole-body control. HumanPlus used approximately 40 hours of retargeted human motion data for locomotion and 200-500 teleoperated demonstrations per manipulation task. The locomotion component benefits from large-scale motion capture datasets (AMASS has 40+ hours), while manipulation tasks require task-specific teleoperated data. Budget for 500-2,000 demonstrations per manipulation skill and 20+ hours of locomotion data covering diverse terrains and speeds.",
    },
    {
      question: "Should I use motion capture retargeting or direct teleoperation?",
      answer: "Use both. Motion capture retargeting is efficient for locomotion and gross body motions (walking, turning, crouching, reaching) because these motions are natural for the human demonstrator and can be collected at scale. Direct teleoperation is necessary for fine manipulation tasks (grasping, tool use, object handovers) where the robot's end-effector must interact precisely with objects. A typical production pipeline collects 80% of data through motion capture retargeting and 20% through direct teleoperation.",
    },
    {
      question: "What coordinate frame should humanoid data use?",
      answer: "Use a body-centric coordinate frame with the origin at the robot's pelvis (base link), x-axis pointing forward, z-axis pointing up. Express all joint targets as relative to this base frame. For locomotion, include the base frame velocity (linear and angular) in the world frame. This convention ensures the policy learns body-relative actions that generalize across starting positions and orientations. Store the world-frame base pose separately for trajectory visualization and evaluation.",
    },
    {
      question: "How do I handle the sim-to-real gap for humanoid locomotion data?",
      answer: "Augment real-world demonstrations with simulation data from Isaac Gym or MuJoCo running the humanoid model. Train the locomotion policy primarily in simulation with domain randomization on friction, mass, and motor dynamics, then fine-tune on real-world demonstrations. For manipulation, the sim-to-real gap is larger due to contact physics, so prioritize real-world teleoperated data. The hybrid approach — sim-trained locomotion plus real-world-trained manipulation — is the current best practice used by teams at Figure, Tesla, and 1X.",
    },
  ],
  ctaHeading: "Need Humanoid Training Data at Scale?",
  ctaDescription: "Claru operates motion capture studios and humanoid teleoperation rigs to collect whole-body demonstration data. Tell us your platform and task requirements.",
  relatedGlossaryTerms: ["whole-body-control", "teleoperation-data", "motion-capture"],
  relatedGuidePages: ["how-to-collect-teleoperation-data", "how-to-record-bimanual-demonstrations"],
  relatedSolutionSlugs: ["humanoid-data"],
  difficulty: "advanced",
  estimatedTime: "4-8 weeks",
  prerequisites: [
    "Humanoid robot platform with joint-level command API (e.g., Unitree H1, Fourier GR-1)",
    "Motion capture system or markerless pose estimation setup",
    "VR full-body tracking system for direct teleoperation",
    "Linux workstation with GPU for real-time IK retargeting",
    "5x5 meter minimum capture volume with flat floor",
  ],
  tools: [
    "OptiTrack or Vicon (motion capture)",
    "Isaac Gym or MuJoCo (simulation)",
    "ROS2 (data recording and robot control)",
    "AMASS dataset (motion capture pretraining data)",
    "PyBullet or Pinocchio (inverse kinematics)",
    "HDF5 or RLDS (data storage format)",
  ],
  steps: [
    {
      stepNumber: 1,
      title: "Define the Action Space and Recording Schema",
      description: "Before collecting any data, define the exact action space representation that your target policy will consume. For a typical humanoid (e.g., Unitree H1 with 26 actuated joints), the action vector includes: 10 lower-body joints (hip pitch/roll/yaw, knee, ankle pitch for each leg), 14 upper-body joints (shoulder pitch/roll/yaw, elbow, wrist pitch/roll/yaw for each arm), and optionally 2+ gripper DoF per hand. Define whether actions are joint position targets, joint velocity targets, or joint torque targets — most imitation learning policies use position targets at 50 Hz.\n\nCreate a recording schema document specifying: (1) every data stream with its name, data type, shape, and recording frequency, (2) the coordinate frame conventions (body-centric with pelvis origin), (3) metadata fields (task ID, demonstrator ID, episode quality rating, motion source — mocap vs. teleop), and (4) file naming conventions. This schema document is the single source of truth for the entire pipeline. Every downstream tool — data conversion, quality checking, training loaders — should reference it.\n\nDesign the observation space to match what the deployed policy will receive: joint positions and velocities (proprioception), head-mounted camera images (egocentric vision), and optionally a language instruction embedding. Do not record observations that will not be available at deployment — external motion capture markers, for example, are available during collection but not during autonomous operation. If you use external state estimation during collection, record it in a separate metadata stream, not in the observation vector.",
      tools: ["URDF/MJCF model of the humanoid", "Schema documentation template"],
      tips: ["Export the URDF joint order and limits to a JSON file that all pipeline stages reference — mismatched joint ordering between collection and training is one of the most common and hardest-to-debug errors in humanoid datasets"],
    },
    {
      stepNumber: 2,
      title: "Set Up Motion Capture Retargeting Pipeline",
      description: "Motion capture retargeting converts human demonstrator poses into kinematically valid humanoid joint configurations. Install a motion capture system (OptiTrack Motive, Vicon Tracker) with 10-20 cameras covering a 5x5 meter volume, achieving sub-millimeter marker tracking accuracy. Alternatively, set up a markerless system using 6-8 synchronized RGB cameras with MediaPipe or HaMeR for body pose estimation — cheaper but with 2-5 cm error.\n\nBuild the retargeting pipeline: (1) Human pose estimation outputs a skeleton with 22-24 joint positions in world frame at 120+ Hz. (2) Kinematic mapping associates each human joint with the corresponding humanoid joint using anatomical correspondence. (3) Inverse kinematics (IK) solves for humanoid joint angles that place the robot's end-effectors at the mapped target positions while respecting joint limits. Use differential IK with a damped least-squares solver (Pinocchio or PyBullet) for real-time performance. (4) Post-processing smooths the resulting joint trajectories with a 5 Hz low-pass Butterworth filter to remove IK solver jitter without losing motion dynamics.\n\nThe critical failure mode is kinematic infeasibility: the human demonstrator reaches a pose that the robot cannot achieve due to shorter limbs, fewer DoF, or tighter joint limits. Detect these frames by monitoring IK residual error — if the end-effector position error exceeds 5 cm, flag the frame. Options: clip the motion to the feasible boundary, interpolate through the infeasible segment, or re-collect with instructions for the demonstrator to stay within the robot's reachable workspace. Provide the demonstrator with real-time visual feedback showing the retargeted robot pose alongside their own motion so they can self-correct.",
      tools: ["OptiTrack Motive or Vicon Tracker", "Pinocchio (IK solver)", "MediaPipe (markerless alternative)", "Butterworth filter (scipy.signal)"],
      tips: ["Calibrate the motion capture volume at the start of every collection session — thermal drift in camera positions causes 1-3 mm systematic error that accumulates during retargeting"],
    },
    {
      stepNumber: 3,
      title: "Configure Direct Teleoperation for Manipulation Tasks",
      description: "For tasks requiring precise object interaction — grasping, tool use, object placement — direct teleoperation produces higher-quality data than motion capture retargeting because the demonstrator directly controls the robot's actual end-effectors. Set up a teleoperation interface that maps operator inputs to the humanoid's upper body while a balance controller stabilizes the lower body autonomously.\n\nThe recommended approach is a hybrid control scheme: the operator controls the two arms (14 DoF) through VR hand controllers or a leader-follower arm pair, while a pre-trained locomotion policy or PD balance controller manages the legs (10 DoF) and torso. This reduces the operator's cognitive load from controlling 26+ DoF simultaneously to controlling 14 DoF for arm manipulation. The balance controller should accept optional base velocity commands (forward/backward, left/right, rotation) via foot pedals or a secondary input device so the operator can reposition the robot during manipulation.\n\nBuild the teleoperation software stack: (1) VR hand controller pose tracking at 90 Hz (Meta Quest Pro provides wrist and finger tracking). (2) Cartesian-to-joint-space inverse kinematics mapping each hand controller pose to the corresponding arm joint configuration. (3) Safety filters that enforce joint velocity limits (prevent jerky motions), workspace boundaries (prevent self-collision), and torque limits (prevent hardware damage). (4) Real-time visualization showing the operator the robot's current state and the commanded target overlaid on the camera feeds.\n\nTrain operators for 4-6 hours before production collection. Humanoid teleoperation is significantly more difficult than single-arm teleoperation because the operator must manage two arms simultaneously while the robot's base may sway slightly from the balance controller. Start training with static base tasks (robot standing still, manipulating objects on a table) before progressing to walking-and-manipulating tasks.",
      tools: ["Meta Quest Pro (hand tracking)", "ROS2 control stack", "PD balance controller", "Safety filter node"],
      tips: ["Record the balance controller's lower-body commands as part of the demonstration — even though the operator didn't produce them, the policy needs to learn the coordination between upper-body manipulation and lower-body stabilization"],
    },
    {
      stepNumber: 4,
      title: "Record Multi-Sensor Data with Temporal Synchronization",
      description: "Humanoid data recording involves 10-20 simultaneous data streams that must be temporally synchronized to within 5 ms. Build a centralized recording node that receives all streams and writes them to a single HDF5 file per episode with a shared timestamp column.\n\nData streams to record: (1) Joint positions for all actuated joints at 100 Hz (from motor encoders). (2) Joint velocities at 100 Hz (computed from encoder differentials or direct velocity sensing). (3) Joint torques at 100 Hz (from current sensing or torque sensors). (4) IMU data (orientation, angular velocity, linear acceleration) at 200 Hz from the pelvis and optionally the head. (5) Foot contact force/torque at 200 Hz from force/torque sensors at each ankle. (6) Wrist force/torque at 200 Hz if available. (7) Head-mounted stereo cameras at 30 Hz (egocentric view). (8) 2-4 external cameras at 30 Hz (third-person views for debugging and evaluation). (9) Gripper state (open/close, finger positions) at 100 Hz. (10) Base pose in world frame at 100 Hz (from external motion capture or onboard state estimation). (11) Language instruction text (one per episode). (12) Episode metadata (task ID, demonstrator ID, motion source, quality rating).\n\nUse hardware triggering to synchronize cameras: connect all cameras to a shared GPIO trigger signal from the recording computer so they capture frames at exactly the same instant. For non-camera streams, use the robot's internal clock as the reference and convert all timestamps to a common epoch. Verify synchronization by commanding a sharp, distinctive motion (fast arm wave) and checking that all streams register the motion onset within 5 ms of each other.\n\nEach HDF5 episode file should be structured with top-level groups: /observations (sensor readings the policy will consume), /actions (joint commands that were executed), /metadata (task info, demonstrator info, quality annotations), and /debug (extra streams useful for analysis but not for training, such as external camera views and motion capture markers).",
      tools: ["h5py (HDF5 recording)", "ROS2 message_filters (time synchronization)", "GPIO hardware trigger board", "NTP time synchronization"],
      tips: ["Write a recording health dashboard that shows all stream rates in real-time during collection — a dropped stream is immediately visible as a rate dropping to zero, preventing the loss of entire sessions to silent recording failures"],
    },
    {
      stepNumber: 5,
      title: "Quality Filter and Validate Episodes",
      description: "Humanoid datasets require aggressive quality filtering because failed demonstrations (falls, collisions, kinematic limit violations) can teach the policy dangerous behaviors. Implement automated quality gates that run immediately after each episode is recorded.\n\nAutomatic rejection criteria: (1) Fall detection — if the pelvis height drops below a threshold (e.g., 50% of standing height) at any point, the episode contains a fall and must be discarded. (2) Self-collision — if any detected collision between non-adjacent body links occurs (checked using the collision geometry from the URDF). (3) Joint limit violation — if any joint exceeds its position or velocity limit by more than 5%. (4) Force/torque spike — if any wrist or ankle force/torque exceeds the safe operating range, indicating an uncontrolled contact event. (5) Synchronization failure — if any stream has more than 2% missing frames or timestamp discontinuities exceeding 50 ms.\n\nAutomatic quality scoring (episodes that pass but vary in quality): Compute path smoothness (jerk magnitude integrated over the trajectory — lower is better), task completion time relative to the median, grasp success rate for manipulation tasks, and balance stability (standard deviation of center-of-mass lateral deviation during locomotion). Assign each episode a quality score from 0 to 1 and store it in the metadata. During training, use quality scores for weighted sampling — higher-quality demonstrations get sampled more frequently.\n\nManual review: For every 100 episodes, a human reviewer watches 10 randomly selected episodes at 2x speed, checking for subtle issues that automated filters miss: unnatural motions (the robot moved in a way that a human would not), inconsistent task strategy (different approaches to the same task that would confuse behavioral cloning), and environmental anomalies (objects fell off the table, lighting changed mid-episode). Manual review adds 15-20 minutes per 100 episodes but catches 5-10% of issues that automated filters miss.",
      tools: ["Automated quality gate scripts", "Collision checking (FCL library)", "Trajectory analysis tools (numpy, scipy)"],
      tips: ["Never discard failed episodes permanently — move them to a 'failures' partition. Failed demonstrations are valuable for training failure recovery policies and for identifying systematic issues with the collection setup"],
    },
    {
      stepNumber: 6,
      title: "Format Data for Whole-Body Policy Training",
      description: "Convert the raw HDF5 episodes into the training format expected by your target policy architecture. For humanoid whole-body control, the dominant architectures are: (1) Diffusion Policy adapted for high-DoF action spaces (predicts action chunks of 16-32 timesteps for all joints simultaneously), (2) transformer-based policies like ACT (Action Chunking with Transformers) extended to the full humanoid action space, and (3) hierarchical policies that decompose whole-body control into locomotion and manipulation sub-policies.\n\nFor flat (non-hierarchical) policies: create observation-action pairs where the observation is [joint_positions, joint_velocities, egocentric_image, language_embedding] and the action is the full joint position target vector at the control frequency. Normalize all joint values to [-1, 1] using the joint limits from the URDF. Normalize images to [0, 1] and resize to the policy's expected input resolution (typically 224x224 or 256x256).\n\nFor hierarchical policies: split each episode into locomotion segments (base moving, arms in neutral pose) and manipulation segments (base stationary or slowly moving, arms actively manipulating). Create separate datasets for each sub-policy. The high-level policy receives the full observation and outputs a discrete mode (walk/manipulate) plus mode-specific targets (base velocity for locomotion, end-effector pose for manipulation).\n\nConvert to RLDS format (TensorFlow Datasets) if you plan to use the Open X-Embodiment ecosystem, or to LeRobot format (Hugging Face) for the LeRobot training stack. Both formats expect episodes as sequences of timesteps with standardized field names. Write conversion scripts that validate the output: check that action dimensions match the expected DoF count, that observation images have the correct resolution and channel order, and that episode lengths are within the expected range. Run the training pipeline on 100 converted episodes as a smoke test before processing the full dataset.",
      tools: ["RLDS (TensorFlow Datasets)", "LeRobot (Hugging Face)", "NumPy (normalization)", "OpenCV (image resizing)"],
      tips: ["Include the URDF joint order mapping in the dataset metadata so that anyone loading the data can verify the correspondence between action dimensions and physical joints — joint ordering mismatches are the most common silent error in humanoid datasets"],
    },
  ],
  keyPapers: [
    { id: "fu-humanplus-2024", title: "HumanPlus: Humanoid Shadowing and Imitation from Humans", authors: "Fu et al.", venue: "arXiv 2406.10454", year: 2024, url: "https://arxiv.org/abs/2406.10454" },
    { id: "he-omnih2o-2024", title: "OmniH2O: Universal and Dexterous Human-to-Humanoid Whole-Body Teleoperation and Learning", authors: "He et al.", venue: "CoRL 2024", year: 2024, url: "https://arxiv.org/abs/2406.08858" },
    { id: "radosavovic-humanoid-2024", title: "Real-World Humanoid Locomotion with Reinforcement Learning", authors: "Radosavovic et al.", venue: "Science Robotics 2024", year: 2024, url: "https://arxiv.org/abs/2303.03381" },
  ],
  claruRelevance: "Claru operates motion capture studios and humanoid teleoperation rigs purpose-built for whole-body data collection. Our pipeline handles the full stack — from human demonstrator recruitment and motion capture retargeting through IK validation, multi-sensor synchronized recording, automated quality gating, and delivery in RLDS or LeRobot format. We support Unitree H1/G1, Fourier GR-1, and custom humanoid platforms, with trained operators who specialize in bimanual manipulation tasks requiring simultaneous locomotion and manipulation coordination.",
};

export default data;
