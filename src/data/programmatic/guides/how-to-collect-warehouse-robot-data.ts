import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-collect-warehouse-robot-data",
  metaTitle: "How to Collect Warehouse Robot Data for Training (2026 Guide) | Claru",
  metaDescription: "Step-by-step guide to collecting warehouse robot training data covering sensor rigs, palletizing tasks, fleet telemetry, and RLDS formatting for policy learning.",
  primaryKeyword: "how to collect warehouse robot data for training",
  secondaryKeywords: ["warehouse robot training data","logistics robot dataset","palletizing robot data collection","warehouse manipulation data","AMR training data"],
  canonicalPath: "/guides/how-to-collect-warehouse-robot-data",
  h1: "How to Collect Warehouse Robot Data for Training",
  heroSubtitle: "A practitioner's guide to building warehouse-scale robot training datasets — from sensor rig design and task taxonomy through fleet-level telemetry pipelines and final formatting for policy learning.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Collect Warehouse Robot Data for Training", href: "/guides/how-to-collect-warehouse-robot-data" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Warehouse Environments Demand Purpose-Built Training Data",
      paragraphs: [
        "Warehouse and logistics operations are the largest commercial market for robot learning today. Companies deploying pick-and-place, palletizing, and autonomous navigation robots need training data that reflects the specific challenges of warehouse environments: varying SKU inventories, reflective shrink-wrapped packaging, dynamic obstacles (forklifts, human workers), and industrial lighting conditions that differ dramatically from laboratory settings.",
        "Academic datasets collected in university labs suffer from severe domain shift when applied to warehouse tasks. Lab kitchens have consistent lighting and a few dozen objects; warehouses have fluorescent/LED flicker, thousands of SKUs, and working conditions that change with every shift. The result: policies trained on lab data achieve 95% success in the lab and 40% success on the warehouse floor.",
        "This guide covers the specialized requirements of warehouse data collection — from ruggedized sensor rigs and safety protocols through fleet-level telemetry pipelines and formatting for policy training at scale."
      ]
    },
    {
      type: "stats",
      heading: "Warehouse Data Collection Benchmarks",
      stats: [
        { value: "50-200", label: "Demos for single-SKU pick-and-place" },
        { value: "1K-5K", label: "Demos for mixed palletizing" },
        { value: "10K+", label: "Demos for multi-task foundation model fine-tuning" },
        { value: "$3K-8K", label: "Sensor rig cost per collection station" },
        { value: "10-20 Hz", label: "Control frequency for manipulation tasks" },
        { value: "500+ eps", label: "Episodes per quality audit campaign" }
      ]
    },
    {
      type: "comparison-table",
      heading: "Warehouse Task Families and Data Requirements",
      columns: ["Task Family", "Action Space", "Control Frequency", "Key Sensors", "Typical Scale"],
      rows: [
        { "Task Family": "Single-item pick-and-place", "Action Space": "7-DoF EE delta + gripper", "Control Frequency": "10-20 Hz", "Key Sensors": "Wrist RGB-D + head RGB-D", "Typical Scale": "50-200 demos" },
        { "Task Family": "Multi-SKU bin picking", "Action Space": "7-DoF EE delta + gripper", "Control Frequency": "10-20 Hz", "Key Sensors": "Overhead RGB-D + wrist RGB-D", "Typical Scale": "500-2,000 demos" },
        { "Task Family": "Mixed-case palletizing", "Action Space": "7-DoF EE delta + gripper width", "Control Frequency": "10 Hz", "Key Sensors": "Overhead + side RGB-D + F/T", "Typical Scale": "1,000-5,000 demos" },
        { "Task Family": "AMR navigation", "Action Space": "2D velocity (v, omega)", "Control Frequency": "5-10 Hz", "Key Sensors": "LiDAR + stereo + odometry", "Typical Scale": "100+ hours of driving" }
      ]
    },
    {
      type: "cards",
      heading: "Warehouse-Specific Data Challenges",
      cards: [
        {
          title: "Reflective Packaging",
          description: "Shrink-wrapped pallets and metallic packaging create depth sensor failures. Use D455 high-accuracy mode and validate depth completion rate on actual SKUs before collection."
        },
        {
          title: "Safety Compliance (ISO 15066)",
          description: "Data collection alongside human workers requires force-limited mode, geofenced safety zones, and a dedicated safety observer. Budget 2-4 weeks for insurance and facility agreements."
        },
        {
          title: "SKU Diversity",
          description: "Warehouses handle thousands of SKUs with varying sizes, weights, and surface properties. Ensure your dataset covers at least 50 representative SKUs across the size/weight distribution."
        },
        {
          title: "Lighting Variability",
          description: "Industrial fluorescent and LED lighting creates flicker artifacts at certain camera exposure settings. Lock exposure to avoid auto-exposure fluctuations and test for banding."
        }
      ]
    },
    {
      type: "prose",
      heading: "Fleet-Level Data Aggregation for Multi-Robot Deployments",
      paragraphs: [
        "Warehouse environments increasingly deploy multiple robots simultaneously, creating an opportunity to aggregate training data across the fleet. Each robot collecting demonstrations during its normal operation generates a continuous stream of new training data — but fleet data has unique quality and consistency challenges that single-robot collection does not.",
        "The primary challenge is hardware variation across the fleet. Even identical robot models develop individual characteristics over time: gripper friction changes with wear, camera intrinsics drift with temperature cycling, and joint encoders accumulate calibration offsets. Include per-robot calibration metadata with every episode so that downstream users can account for these differences during training. Run a monthly fleet calibration protocol: each robot executes a standardized motion sequence, and the recorded trajectories are compared to a reference to detect and correct drift.",
        "Fleet data deduplication is more important than single-robot deduplication because multiple robots performing the same task in the same environment naturally produce near-identical episodes. Use the trajectory embedding + LSH pipeline described in the deduplication guide, but add robot_id as a stratification dimension — near-duplicates from different robots may actually be valuable (they capture robot-specific dynamics), while near-duplicates from the same robot are redundant.",
        "For fleet data pipelines, implement a centralized data lake that receives episodes from all robots via a nightly sync or real-time streaming. Each robot writes to local storage during operation and uploads completed episodes during idle periods. The central pipeline runs validation, deduplication, enrichment, and format conversion as a batch job. Maintain separate per-robot quality dashboards to detect individual robots whose data quality has degraded."
      ]
    }
  ],
  faqs: [
    {
      question: "What sensor configuration works best for warehouse robot data collection?",
      answer: "The optimal rig depends on the task family. For mobile manipulation (pick-and-place, palletizing), mount a wrist-mounted Intel RealSense D455 for close-range depth, a head-mounted RealSense D435i for workspace context, and an overhead ZED 2i for third-person supervision. Record proprioception at 100 Hz minimum via the robot's joint state publisher. For autonomous mobile robots (AMRs) doing navigation, a Velodyne VLP-16 or Ouster OS1-64 LiDAR combined with a global-shutter stereo pair and wheel odometry is standard. Synchronize all sensors through hardware trigger lines or PTP (Precision Time Protocol) — software timestamps from ROS message headers introduce 5-15 ms jitter that degrades policy training. Budget roughly $3,000-8,000 per data collection station depending on LiDAR inclusion."
    },
    {
      question: "How many demonstrations do warehouse manipulation tasks typically require?",
      answer: "Modern architectures vary widely in data efficiency. For single-SKU pick-and-place with Diffusion Policy or ACT, 50-200 high-quality teleoperation demonstrations can yield >85% success rates. Multi-SKU bin picking across 20-50 object categories typically needs 500-2,000 demonstrations to generalize reliably. Palletizing with mixed box sizes requires 1,000-5,000 demonstrations because the action space includes both grasp pose and placement planning. If training a foundation model like Octo or OpenVLA for multi-task warehouse operation, plan for 10,000+ demonstrations spanning your full task vocabulary. Start with a 200-episode pilot for your highest-priority task, validate that the policy trains successfully, then scale collection based on generalization gaps observed during evaluation."
    },
    {
      question: "How do you handle the safety constraints of collecting data in active warehouses?",
      answer: "Collect data during off-peak shifts or in a dedicated staging area that mirrors real warehouse conditions — same shelving systems, conveyor belts, lighting, and floor surfaces. If collecting alongside human workers, implement geofenced safety zones using the robot's built-in safety controller with force-limited mode enabled (ISO 15066 compliant power and speed limiting). All teleoperation sessions should have a dedicated safety observer with an e-stop in hand. For AMR navigation data, run at reduced speed (0.5 m/s max) with expanded sensor-based stopping zones. Record near-miss events and safety stops as metadata — these become valuable negative examples for training collision avoidance. Insurance and facility agreements should be finalized before any collection begins, as this often takes 2-4 weeks."
    },
    {
      question: "Should warehouse robot data include failure cases or only successful demonstrations?",
      answer: "Include both, but tag them explicitly. A dataset of only successes creates policies that have no model of what failure looks like and cannot recover gracefully. Collect intentional failure demonstrations at roughly a 10-15% ratio: dropped objects, misaligned grasps, path planning failures, and object collisions. Label each episode with a success boolean and a failure taxonomy code (e.g., grasp_slip, collision_static, collision_dynamic, placement_miss, timeout). For reinforcement learning and reward model training, paired success/failure examples from the same initial state are especially valuable. In practice, natural failures during teleoperation collection provide 5-10% of episodes anyway — supplement with deliberate failure recording sessions to reach your target ratio and ensure failure mode coverage."
    },
    {
      question: "What data formats are best for warehouse robot datasets?",
      answer: "For maximum compatibility with current research infrastructure, store episodes in RLDS (Reinforcement Learning Datasets) format backed by TFRecord files. RLDS is the native format for Open X-Embodiment, Octo, and RT-2, and Google's tensorflow_datasets library provides efficient sharding, shuffling, and streaming. If your primary training framework is PyTorch-based (Diffusion Policy, ACT), use HDF5 via the robomimic convention: one HDF5 file per episode with groups for obs, action, and metadata. For very large fleet datasets (100K+ episodes), consider Zarr with DirectoryStore for S3-compatible cloud storage and parallel reads. Regardless of format, include per-episode metadata as JSON sidecar files: robot model, gripper type, task ID, environment configuration hash, operator ID, timestamp, and success label. This metadata enables stratified sampling during training."
    }
  ],
  ctaHeading: "Need Warehouse Robot Data?",
  ctaDescription: "Claru operates data collection infrastructure in warehouse environments across 100+ cities. Talk to a specialist about your palletizing, pick-and-place, or AMR navigation data needs.",
  relatedGlossaryTerms: ["embodied-ai","manipulation-trajectory","scene-understanding"],
  relatedGuidePages: ["how-to-collect-teleoperation-data","how-to-collect-multimodal-robot-data"],
  relatedSolutionSlugs: ["teleoperation-data"],
  difficulty: "intermediate",
  estimatedTime: "3-6 weeks",
  prerequisites: ["Access to warehouse environment or staging area","Robot platform with teleoperation capability","ROS2 Humble or later installed","Sensor rig (RGB-D cameras, optional LiDAR)","Python 3.10+ with NumPy, h5py, and tensorflow-datasets"],
  tools: ["ROS2","Intel RealSense SDK","Python","NumPy","HDF5","RLDS","TensorFlow Datasets","Open3D"],
  steps: [
    {
      stepNumber: 1,
      title: "Define Your Task Taxonomy and Data Specification",
      description: "Warehouse environments contain dozens of distinct manipulation and navigation tasks. Start by building a task taxonomy document that enumerates every task variant you intend to support: single-item pick-and-place from shelf to tote, multi-item bin picking, mixed-case palletizing, depalletizing, conveyor singulation, package scanning and sorting, and AMR navigation with dynamic obstacle avoidance. For each task, specify the observation space (which cameras, what resolution, whether depth is required), the action space (Cartesian end-effector deltas vs. joint position targets, gripper width or binary open/close), the control frequency (typically 10-20 Hz for manipulation, 5-10 Hz for navigation), and the expected episode length.\n\nCreate a formal data spec document using a standardized template that covers: target model architecture and its exact input tensor shapes, required coordinate frames and transforms, object categories with unique IDs for each SKU, environment configuration parameters (shelf heights, aisle widths, conveyor speeds), and minimum diversity requirements — for example, 50 unique SKU models, 5 lighting conditions, 3 shelf configurations. Share this document with all stakeholders (ML team, robotics engineers, collection operators) and sign off before spending money on hardware or scheduling collection sessions. Changes to the data spec mid-collection are the single most expensive mistake teams make.",
      tools: ["Google Docs or Notion for spec documents", "URDF/SDF for robot model reference"],
      tips: ["Map your task taxonomy to Open X-Embodiment task categories if you plan to leverage cross-embodiment pretraining later"]
    },
    {
      stepNumber: 2,
      title: "Design and Calibrate Your Sensor Rig",
      description: "Warehouse data collection demands a sensor rig that captures both the robot's workspace in high fidelity and the broader environment context. A proven configuration for mobile manipulators uses three camera streams: a wrist-mounted Intel RealSense D455 (640x480 at 30 fps, depth + RGB) pointed at the gripper workspace, a head or shoulder-mounted D435i (640x480 at 30 fps) providing the agent's egocentric view, and an overhead or third-person ZED 2i (1280x720 at 15 fps) for supervision and debugging. For proprioception, record the full joint state vector (positions, velocities, efforts) from the robot's /joint_states topic at 100 Hz, plus end-effector pose from the forward kinematics at the same rate.\n\nCalibrate each camera's intrinsics using a ChArUco board with OpenCV's cv2.aruco.calibrateCameraCharuco — aim for reprojection error below 0.3 pixels. Compute extrinsics (camera-to-base transforms) using hand-eye calibration: the eye-in-hand method for the wrist camera (cv2.calibrateHandEye with the Tsai-Lenz solver), and PnP-based registration for fixed cameras using known AprilTag positions in the workspace. Store all calibration data as YAML files alongside the dataset. For depth quality in warehouse environments, note that RealSense infrared stereo struggles with reflective shrink-wrap and dark conveyor belts — enable the D455's built-in IMU and use the high-accuracy preset. Test depth quality on your actual SKU inventory before committing to a collection schedule.",
      tools: ["Intel RealSense SDK 2.0", "OpenCV 4.x", "AprilTag library", "ros2_realsense"],
      tips: ["Run a 30-minute burn-in test to check for thermal drift in depth readings", "Label each camera stream with a unique camera_id in metadata for multi-view reconstruction later"]
    },
    {
      stepNumber: 3,
      title: "Build the Recording Pipeline with Synchronization",
      description: "Sensor synchronization is non-negotiable for policy learning — a 50 ms misalignment between an RGB frame and the corresponding joint state renders the observation-action pair nearly useless. Implement hardware synchronization by connecting all RealSense cameras to a shared hardware trigger line using the D455's GPIO sync port. For joint state recording, use a real-time ROS2 node running in a dedicated executor thread with SCHED_FIFO priority. Timestamp all sensor streams using a single NTP-synchronized clock source; avoid mixing ROS time with camera-internal timestamps.\n\nBuild a recording manager node in Python that subscribes to all sensor topics via message_filters.ApproximateTimeSynchronizer with a slop tolerance of 10 ms. On each synchronized callback, pack the observation into a dictionary: {\"rgb_wrist\": (H,W,3) uint8, \"depth_wrist\": (H,W) float32 in meters, \"rgb_head\": (H,W,3) uint8, \"joint_positions\": (N,) float64, \"ee_pose\": (7,) float64 as [x,y,z,qx,qy,qz,qw], \"gripper_width\": float64}. Write episodes to HDF5 using h5py with gzip compression (level 4 is a good speed/size tradeoff). Each episode is one HDF5 file containing datasets for obs/{modality}, action, and metadata. Implement a post-episode validation hook that checks: no NaN values in joint states, no all-zero depth frames, frame count matches expected duration, and file size is within expected range. Reject and re-record any episode that fails validation before the operator moves to the next trial.",
      tools: ["ROS2 Humble", "h5py", "message_filters", "Python multiprocessing"],
      tips: ["Write raw sensor data first, then run a batch post-processing step for image resizing and normalization — this avoids blocking the recording loop"]
    },
    {
      stepNumber: 4,
      title: "Design Collection Protocols for Each Task Family",
      description: "Write a Standard Operating Procedure (SOP) document for each task in your taxonomy. The SOP should be detailed enough that a new operator can follow it with zero verbal instruction. For a palletizing task, the SOP specifies: (1) Initial state setup — place N boxes of specified dimensions on the source conveyor or staging area in a randomized arrangement, position the pallet at the target location, ensure the robot is at its home configuration. (2) Task execution — the teleoperator picks each box in a specified order (or randomized order, depending on the protocol variant) and places it on the pallet following a specified packing pattern. (3) Episode termination criteria — all boxes placed successfully (success) or timeout after 180 seconds (failure). (4) State randomization between episodes — shuffle box positions, vary the number of boxes (3-8 per episode), rotate pallet orientation by 0 or 90 degrees.\n\nCritically, define the teleoperator interface. For warehouse manipulation, a SpaceMouse (3Dconnexion SpaceMouse Pro) controlling end-effector velocity in Cartesian space is the most common choice — it offers intuitive 6-DoF control and operators reach proficiency after 2-3 hours of practice. Configure deadzone thresholds (typically 0.05 for translation, 0.02 for rotation) to filter hand tremor. Set velocity scaling to 0.15 m/s max translation and 0.8 rad/s max rotation for safe operation around shelving. Run a pilot session of 30 episodes with 2-3 operators to measure: average episode duration, success rate, and inter-operator consistency (compute DTW distance between trajectories for the same task). Use pilot results to refine the SOP, adjust speed limits, and estimate total collection time.",
      tools: ["3Dconnexion SpaceMouse", "teleop_twist_joy or custom teleop node", "DTW (fastdtw Python package)"],
      tips: ["Rotate operators every 90 minutes to prevent fatigue-induced quality degradation", "Record operator ID in episode metadata for later analysis of operator-specific biases"]
    },
    {
      stepNumber: 5,
      title: "Execute Collection with Real-Time Quality Monitoring",
      description: "Run data collection in structured shifts with dedicated roles: one teleoperator, one environment resetter (who randomizes objects between episodes), and one quality monitor watching a live dashboard. Build the dashboard using a simple Streamlit app that displays: episodes completed vs. target (progress bar), rolling success rate over the last 50 episodes, distribution of episode durations (histogram), depth frame dropout rate, and joint state recording gaps. Flag any episode where depth dropout exceeds 2% of frames or where joint state gaps exceed 50 ms for immediate re-recording.\n\nFor warehouse-scale collection targeting 5,000+ episodes, organize work into collection campaigns of 500 episodes each. At the end of each campaign, run an automated quality audit: compute action velocity statistics and flag outliers (episodes where max joint velocity exceeds safety limits suggest teleoperation glitches), verify observation space coverage (e.g., at least 80% of target SKUs appear in the campaign), and check for recording artifacts (duplicate timestamps, zero-length episodes, corrupted HDF5 files). Maintain a collection log spreadsheet tracking: campaign ID, date, operator, robot serial number, environment configuration, episodes recorded, episodes passing QA, and any hardware issues. This log becomes essential for debugging dataset problems months later when training reveals unexpected failures.",
      tools: ["Streamlit", "pandas", "matplotlib", "custom QA scripts"],
      tips: ["Keep a physical logbook at each collection station for operators to note hardware issues, unusual events, or protocol deviations that automated monitoring might miss"]
    },
    {
      stepNumber: 6,
      title: "Post-Process, Validate, and Format for Training",
      description: "After collection completes, run a comprehensive post-processing pipeline. First, apply consistent image preprocessing: resize all camera streams to the target model's input resolution (typically 256x256 or 224x224), convert depth from raw millimeters to normalized float32 meters, and apply the camera intrinsics to correct any lens distortion. Second, compute derived features if your model requires them: end-effector velocity by finite differencing the pose trajectory with a Savitzky-Golay filter (window=11, order=3 from scipy.signal), wrist force/torque if available, and binary contact labels from force thresholds.\n\nFor deduplication, compute a trajectory embedding for each episode by encoding the full joint state sequence through a lightweight 1D-CNN or by computing DTW distance between all episode pairs. Flag episodes with DTW distance below a threshold (calibrate on your pilot data — typically episodes from the same operator performing the same task variant will cluster). Remove exact duplicates and near-duplicates, keeping the highest-quality instance (measured by smoothness of the action trajectory and depth frame completeness). Generate stratified train/validation/test splits (80/10/10) ensuring that splits are stratified by task variant, operator ID, and environment configuration — never leak episodes from the same session across splits. Finally, convert to your target format. For RLDS, implement a custom TFDS DatasetBuilder: define the features_dict matching your observation and action spec, implement _split_generators to map your train/val/test HDF5 files, and run tfds build --data_dir=/path/to/output. Validate the RLDS output by loading 100 random episodes through the standard tfds.load pipeline and visually inspecting observation-action alignment in a Jupyter notebook.",
      tools: ["scipy.signal", "tensorflow-datasets", "h5py", "Zarr", "fastdtw", "Jupyter"],
      tips: ["Always keep a copy of the raw unprocessed data — post-processing bugs are easier to fix when you can re-run from raw", "Publish a dataset card following the Google Model Cards template documenting collection conditions, known biases, and intended use"]
    }
  ],
  keyPapers: [
    {
      id: "brohan-rt2-2023",
      title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2307.15818"
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
      id: "chi-diffusion-policy-2024",
      title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137"
    },
    {
      id: "team-octo-2024",
      title: "Octo: An Open-Source Generalist Robot Policy",
      authors: "Octo Model Team",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2405.12213"
    }
  ],
  claruRelevance: "Claru operates data collection infrastructure purpose-built for warehouse and logistics environments. Our teams have deployed sensor rigs in fulfillment centers, distribution hubs, and manufacturing floors across 100+ cities, collecting teleoperation demonstrations for pick-and-place, palletizing, bin picking, and AMR navigation tasks. We handle the full pipeline — sensor calibration, operator training, real-time QA, post-processing, and delivery in RLDS, HDF5, or Zarr format — so your ML team can focus on model development instead of data engineering.",
};

export default data;
