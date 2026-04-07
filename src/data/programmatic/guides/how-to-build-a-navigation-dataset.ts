import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-build-a-navigation-dataset",
  metaTitle: "How to Build a Navigation Dataset for Mobile Robots (2026 Guide) | Claru",
  metaDescription: "Step-by-step guide to building navigation datasets for mobile robots, covering sensor fusion, trajectory recording, map annotation, and SLAM integration.",
  primaryKeyword: "how to build a navigation dataset for mobile robots",
  secondaryKeywords: ["mobile robot navigation dataset", "robot navigation training data", "indoor navigation data collection", "visual navigation dataset"],
  canonicalPath: "/guides/how-to-build-a-navigation-dataset",
  h1: "How to Build a Navigation Dataset for Mobile Robots",
  heroSubtitle: "Step-by-step guide to building navigation datasets that combine LiDAR, RGB-D, odometry, and semantic maps for training autonomous mobile robot navigation policies.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Build a Navigation Dataset for Mobile Robots", href: "/guides/how-to-build-a-navigation-dataset" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Environment Diversity Is More Important Than Trajectory Volume",
      paragraphs: [
        "Research from the GNM (General Navigation Model) and ViNT (Visual Navigation Transformer) projects established a clear finding: environment diversity matters more than trajectory count per environment for navigation policy generalization. A policy trained on 50 trajectories each from 50 different buildings generalizes far better to unseen buildings than a policy trained on 2,500 trajectories from a single building. This is because visual navigation policies must learn invariant features (doorways, corridors, open spaces, obstacles) that generalize across floor plans, furniture layouts, lighting conditions, and floor surfaces.",
        "For practitioners, this means the data collection strategy should prioritize accessing many different environments over exhaustively covering any single environment. A practical target is 20-50 distinct environments (different buildings, floors, or significantly different room configurations within large buildings) with 50-100 trajectories each. Within each environment, vary the start and goal positions to cover the full navigable space, collect at different times of day for lighting diversity, and include dynamic elements (people walking, doors opening) in at least 30% of trajectories. Track your environment coverage using a matrix that cross-references building type, floor surface, corridor width, lighting condition, and clutter level.",
      ],
    },
    {
      type: "prose",
      heading: "SLAM Backend Selection and Configuration",
      paragraphs: [
        "The SLAM (Simultaneous Localization and Mapping) backend provides the ground-truth trajectory and map that make navigation data useful for training. For 2D indoor navigation with a planar LiDAR, Google Cartographer is the most mature option: it handles loop closure, supports multi-floor mapping, and produces both an optimized trajectory and an occupancy grid map. Key configuration: set TRAJECTORY_BUILDER_2D.min_range to 0.3m (rejects reflections off the robot body), max_range to match your LiDAR spec (12-25m), and POSE_GRAPH.optimization_problem.odometry_translation_weight to balance wheel odometry and scan matching. Run Cartographer in offline mode after collection for maximum accuracy \u2014 offline mode uses forward and backward temporal smoothing and global optimization over the full trajectory.",
        "For 3D navigation datasets or environments with significant elevation changes (ramps, multi-level spaces), FAST-LIO2 provides real-time 3D LiDAR-inertial odometry with tightly coupled IMU integration. It requires a 3D LiDAR (Velodyne VLP-16 or Ouster OS1-64) and a 6-axis IMU. FAST-LIO2 achieves centimeter-level accuracy in structured environments but may drift in long featureless corridors where LiDAR scans lack distinctive features. For outdoor navigation with GPS availability, fuse RTK-GNSS with IMU using robot_localization (an EKF-based ROS2 package) to achieve 2-5cm position accuracy. Always post-process trajectories after collection: run loop closure optimization, filter GPS multipath artifacts, and verify trajectory smoothness. Report the estimated accuracy in the dataset documentation.",
      ],
    },
  ],
  faqs: [
    {
      question: "Should I use LiDAR, RGB-D cameras, or both for a navigation dataset?",
      answer: "The answer depends on your target deployment platform and policy architecture. For classical navigation stacks (move_base, Nav2), 2D LiDAR (like the RPLiDAR A3 or Hokuyo UTM-30LX) is sufficient and provides reliable distance measurements in a single scan plane. For learning-based visual navigation policies (ViNT, NoMaD, GNM), RGB-D cameras (Intel RealSense D455 or OAK-D Pro) are preferred because they provide the visual features the model learns from. For production-grade datasets that serve multiple downstream models, record both: a 2D or 3D LiDAR for geometric mapping and localization ground truth, plus front-facing and optionally rear-facing RGB-D cameras for visual policy training. The LiDAR point clouds are used to generate ground-truth occupancy maps and to compute accurate odometry via SLAM, which then serves as the position label for every camera frame. Storage costs are manageable since LiDAR scans at 10 Hz compress well, typically adding only 5-10 GB per hour of recording on top of the camera data."
    },
    {
      question: "How do I generate ground-truth trajectories for navigation data?",
      answer: "The gold standard is post-processed LiDAR SLAM using a package like Cartographer, LIO-SAM, or FAST-LIO2. Record raw LiDAR scans and IMU data during collection, then run offline SLAM with loop closure to produce a globally consistent trajectory. Cartographer's offline mode (cartographer_pbstream_to_ros_map) generates both the trajectory and an occupancy grid map simultaneously. Post-processed SLAM is significantly more accurate than real-time SLAM because it can use forward and backward temporal smoothing and optimize over the full trajectory. For outdoor environments where GPS is available, fuse RTK-GNSS with IMU using robot_localization (an EKF-based ROS2 package) to achieve centimeter-level position accuracy. For purely visual datasets without LiDAR, use Structure-from-Motion (COLMAP) or visual-inertial odometry (ORB-SLAM3 in VI mode) on the RGB-D stream, though accuracy degrades in textureless corridors and under motion blur. Always report the estimated trajectory accuracy in your dataset documentation."
    },
    {
      question: "How many environments and trajectories do I need for generalization?",
      answer: "Research from the GNM (General Navigation Model) and ViNT projects shows that environment diversity matters more than trajectory count per environment. GNM trained on data from 6 distinct indoor environments generalized poorly to novel buildings, but scaling to 50+ environments with as few as 20-30 trajectories each produced strong zero-shot transfer. Aim for at least 20 distinct environments (different buildings, floor plans, furniture layouts) with 50-100 trajectories each, for a total of 1,000-5,000 trajectories. Within each environment, vary the start and goal positions to cover the full navigable space, vary the time of day for lighting diversity (morning, afternoon, evening, and artificial light only), and include dynamic elements like people walking through the scene in at least 30% of trajectories. Track your environment coverage using a spreadsheet that logs building ID, floor, room types traversed, lighting condition, and pedestrian density for each recording session."
    },
    {
      question: "What coordinate frame conventions should I use for a navigation dataset?",
      answer: "Follow the REP 103 (ROS Enhancement Proposal) conventions: x-forward, y-left, z-up for the robot body frame, with orientation represented as quaternions in (x, y, z, w) order. All sensor data should be transformed into this common body frame using calibrated extrinsics before storage. For global coordinates, use a fixed world frame aligned with the first scan of the SLAM map, with the z-axis pointing up (gravity-aligned via IMU). Store transformations as 4x4 homogeneous matrices or as separate translation (x, y, z) and quaternion (x, y, z, w) vectors. A common and expensive mistake is mixing ENU (East-North-Up) and NED (North-East-Down) conventions between GPS and IMU data, which results in mirrored trajectories that silently corrupt training. Include a coordinate frame diagram in your dataset documentation and provide a test script that loads one trajectory and plots it overlaid on the occupancy map to visually confirm alignment."
    },
    {
      question: "How do I handle dynamic obstacles and people in navigation data?",
      answer: "Dynamic elements are essential for realistic navigation training, not noise to be removed. Record pedestrian and moving object positions as part of the dataset by running a real-time person detector (YOLOv8 or RT-DETR) on the RGB stream and logging 2D bounding boxes at each timestep, then projecting them into 3D using the depth map. Store these as a separate annotation channel (/episode_N/dynamic_objects) with fields for object class, 3D centroid, bounding box, and velocity estimate from frame-to-frame tracking (using ByteTrack or BoT-SORT). For training social navigation policies, you also need annotations of pedestrian intent: are they walking toward the robot, crossing its path, or standing still. This requires human annotation at 1-2 Hz (not every frame) using a video annotation tool where annotators label pedestrian motion intent categories. Include metadata about pedestrian density per trajectory (empty, sparse with 1-3 people, dense with 5+ people) so downstream users can filter or stratify by difficulty level."
    },
    {
      question: "How accurate does ground-truth localization need to be?",
      answer: "For training visual navigation policies like ViNT and GNM, the ground-truth position accuracy should be within 10-20 cm and the heading accuracy within 5 degrees. Post-processed LiDAR SLAM (Cartographer, FAST-LIO2) typically achieves 5-10 cm accuracy in indoor environments with loop closure, which is sufficient. For social navigation research that requires precise relative positioning between the robot and pedestrians, tighter accuracy (under 5 cm) is needed, requiring either RTK-GPS (outdoors) or a multi-sensor fusion approach (LiDAR plus visual-inertial odometry). Always report the estimated trajectory accuracy in the dataset documentation so downstream users can assess fitness for their application.",
    },
  ],
  ctaHeading: "Need Help With This?",
  ctaDescription: "Talk to a Claru data collection specialist about your mobile robot navigation dataset requirements.",
  relatedGlossaryTerms: ["embodied-ai", "depth-data", "scene-understanding"],
  relatedGuidePages: ["how-to-collect-egocentric-video-data"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  difficulty: "intermediate",
  estimatedTime: "3-6 weeks",
  prerequisites: ["Mobile robot platform (TurtleBot 4, Spot, or custom)", "LiDAR sensor (RPLiDAR A3 or Velodyne VLP-16)", "RGB-D camera (RealSense D455 or OAK-D)", "ROS2 Humble installed on robot compute"],
  tools: ["ROS2", "Cartographer", "Nav2", "FAST-LIO2", "OpenCV", "HDF5", "Open3D"],
  steps: [
    {
      stepNumber: 1,
      title: "Define Navigation Task Taxonomy and Sensor Requirements",
      description: "Specify the navigation behaviors your dataset must capture and the sensor suite needed to support them. Navigation tasks range from point-to-point goal reaching (the robot must navigate from pose A to pose B) to semantic goal navigation (go to the kitchen) to social navigation (reach the goal while maintaining comfortable distance from pedestrians). Each task type requires different annotations: point-to-point needs only start and goal poses, semantic navigation needs room labels on the map, and social navigation needs tracked pedestrian trajectories.\n\nDocument your sensor configuration precisely. A standard indoor navigation setup includes a 2D LiDAR (RPLiDAR A3 at 25 Hz, 25-meter range) mounted at shin height for obstacle detection, a front-facing Intel RealSense D455 (30 Hz RGB at 640x480, depth at 640x480) tilted 10-15 degrees downward to capture the ground plane and approaching obstacles, and a 9-axis IMU (either the camera's built-in IMU or a standalone BNO055) for orientation. For 3D navigation datasets, substitute a 3D LiDAR (Velodyne VLP-16 or Ouster OS1-64) that provides point clouds for 3D SLAM and elevation mapping. Record wheel odometry from the robot base at its native rate (typically 50-100 Hz for differential drive platforms). Specify the exact URDF model of your robot with sensor mounting positions (publish_static_transforms in your launch file), as downstream users need these transforms to project sensor data into common frames."
    },
    {
      stepNumber: 2,
      title: "Build the Recording and SLAM Infrastructure",
      description: "Set up a ROS2-based recording pipeline that captures all sensor streams synchronously and generates accurate ground-truth localization. Install and configure Cartographer for 2D environments or FAST-LIO2 for 3D environments as your SLAM backend. For Cartographer, the critical parameters are TRAJECTORY_BUILDER_2D.min_range (set to 0.3 m to reject reflections off the robot body), TRAJECTORY_BUILDER_2D.max_range (match your LiDAR spec, typically 12-25 m), and POSE_GRAPH.optimization_problem.odometry_translation_weight (tune to balance wheel odometry and scan matching). Run SLAM in offline mode after collection for maximum accuracy: record raw /scan, /imu, and /odom topics to rosbag2 mcap format during collection, then run cartographer_offline_node to generate the optimized trajectory and map.\n\nBuild a recording launcher that starts all sensor drivers, the rosbag2 recorder, and a metadata logger simultaneously. The metadata logger should record environment ID, session ID, trajectory ID (auto-incrementing), start timestamp, operator notes, and any environment configuration (doors open/closed, furniture moved, lighting condition). Use mcap format instead of sqlite3 for rosbag2 because mcap handles large files more efficiently and supports random access reads. Estimate storage at approximately 2-4 GB per 10 minutes of recording with LiDAR plus RGB-D. Set up a post-recording pipeline script that automatically runs offline SLAM on each bag, extracts the optimized trajectory as a CSV (timestamp, x, y, theta), generates an occupancy grid map as a PGM/YAML pair, and runs basic quality checks (trajectory length plausibility, scan match score above threshold, loop closure residuals below 5 cm)."
    },
    {
      stepNumber: 3,
      title: "Design Collection Protocol and Environment Coverage Plan",
      description: "Create a systematic plan that ensures your dataset covers sufficient environmental diversity for policy generalization. Develop an environment matrix with rows for each building or floor plan and columns for key attributes: total navigable area in square meters, number of rooms, corridor width (narrow under 1.5 m, standard 1.5-3 m, wide over 3 m), floor surface type (carpet, tile, concrete), lighting condition (natural, fluorescent, dim), and clutter level (empty, moderate, dense). Target at least 20 distinct environments across this matrix, with no single attribute dominating.\n\nFor each environment, plan trajectory coverage using a grid overlay on the floor plan. Divide the navigable space into 2x2 meter cells and ensure that at least one trajectory passes through each cell. Define start-goal pairs that require the robot to traverse long corridors, make tight turns, pass through doorways, navigate around furniture clusters, and cross open areas. Assign 50-100 trajectories per environment, split into: 60% nominal navigation (clear path, normal speed), 20% challenging scenarios (narrow passages, crowded areas, poor lighting), and 20% recovery situations (dead ends requiring backtracking, blocked paths requiring re-planning).\n\nWrite an operator manual that covers the physical protocol: how to start and stop recording, how to teleoperate the robot (joystick preferred for navigation data since it produces more natural trajectories than keyboard control), what speed to target (0.3-0.5 m/s for indoor environments, matching typical autonomous navigation speeds), how to handle unexpected obstacles (stop recording, clear obstacle, resume from last waypoint), and the session logging procedure. Run a pilot in one environment (30 trajectories) to validate the pipeline and estimate per-trajectory collection time (typically 2-5 minutes including setup)."
    },
    {
      stepNumber: 4,
      title: "Execute Multi-Environment Data Collection",
      description: "Deploy the recording platform across your environment roster, following the coverage plan. Transport the robot to each environment, run an initial mapping session (2-3 laps around the full navigable area) to generate the reference SLAM map, then execute the planned trajectory set. Use the reference map to verify trajectory coverage in real-time: overlay completed trajectories on the occupancy grid and identify cells that still lack coverage.\n\nFor each recording session, follow a strict startup checklist: verify sensor drivers are publishing (ros2 topic hz /scan should show the expected rate), confirm time synchronization (ros2 topic delay /scan should show latency under 10 ms), check disk space (at least 50 GB free for a 2-hour session), and test the emergency stop. During collection, monitor rosbag2 recording status with ros2 bag info to confirm all topics are being captured. After each trajectory, run a quick SLAM sanity check: the offline SLAM trajectory should not have large jumps (teleportation artifacts) or implausible loop closures.\n\nTrack progress using a collection dashboard that shows: environments completed versus target, trajectories per environment versus target, coverage heatmap per environment, average trajectory length, and failure rate (trajectories discarded due to sensor dropouts, SLAM failures, or operator errors). Common failure modes include LiDAR scan dropout in environments with highly reflective surfaces (glass walls, polished floors), depth camera failure in direct sunlight, and wheel odometry drift on slippery surfaces. Document each failure mode and its resolution (adding LiDAR intensity filtering, sun shade for the camera, reducing acceleration limits on slippery floors) in the collection log."
    },
    {
      stepNumber: 5,
      title: "Post-Process, Annotate, and Validate Trajectories",
      description: "Run the full offline processing pipeline on every recorded trajectory. First, execute offline SLAM to produce the optimized trajectory and map. For Cartographer, run cartographer_pbstream_to_ros_map to generate the final occupancy grid, then extract the trajectory using cartographer_dev_pbstream_trajectories_to_proto. Convert the trajectory to a standard format: a numpy array of shape (T, 4) with columns (timestamp_sec, x_meters, y_meters, heading_radians) saved as a .npy or .csv file alongside the original bag.\n\nGenerate semantic annotations on the occupancy grid maps. Use a custom annotation tool (a simple Python GUI with matplotlib imshow and polygon drawing, or Label Studio with image segmentation) to label room types (office, corridor, kitchen, bathroom, lobby, elevator area), door positions and states (open, closed, automatic), and restricted zones (stairs, emergency exits). Store these as a GeoJSON file per map that references pixel coordinates in the occupancy grid image. For navigation datasets that support language-conditioned goals, additionally annotate each trajectory with a natural language instruction (go to the kitchen, navigate to room 204) using the same process described in the language-conditioned dataset guide.\n\nRun validation checks on every processed trajectory. Verify that the trajectory stays within the mapped navigable area (no points inside walls). Check that the velocity profile is physically plausible (no instantaneous jumps exceeding the robot's maximum velocity). Compute the trajectory smoothness by calculating the mean absolute angular velocity and flagging trajectories where it exceeds 1.5 rad/s sustained for more than 2 seconds (indicates jerky teleoperation). Cross-reference the trajectory timestamp range with the bag file duration to catch truncation errors. Generate a per-trajectory quality report card and set a pass threshold: trajectories with SLAM match score below 0.6 or position uncertainty above 0.2 m at any point are flagged for manual review or re-collection."
    },
    {
      stepNumber: 6,
      title: "Format for Training and Publish Dataset Artifacts",
      description: "Convert the processed data into the format your target navigation model expects. For ViNT and NoMaD-style visual navigation models, the expected format is a directory of trajectories where each trajectory is a folder containing sequentially numbered JPEG images (from the front camera), a traj_data.pkl file with position and heading at each timestep, and a metadata.json with environment ID and goal position. Use the gnm_data_utils package as a reference implementation for this format. For LiDAR-based approaches, convert to the Habitat-style format with pre-built 3D meshes and episode JSON files, or provide raw point clouds in PLY format alongside trajectories.\n\nGenerate train/validation/test splits by held-out environments, not by trajectories within the same environment. If you have 25 environments, hold out 3-5 entire environments for testing. This is critical because models that see any trajectory from a test environment during training can memorize the layout rather than learning generalizable navigation behaviors. Within the training environments, hold out 10% of trajectories for validation. Create a splits.json manifest that maps every trajectory ID to its split assignment.\n\nPackage the dataset with comprehensive artifacts. The occupancy grid maps for every environment (as PNG plus YAML with resolution and origin). The semantic annotation GeoJSON files. A dataset card documenting: robot platform, sensor suite with mounting positions, SLAM method and accuracy, total trajectories and hours, environment diversity statistics (number of buildings, total navigable area, geographic regions), known failure modes and limitations, and license. Include a visualization script that renders a trajectory on the occupancy grid with the robot's heading shown as arrows, overlaid with the corresponding camera frames as a side-by-side video. This single artifact lets new users understand the dataset in 30 seconds and is invaluable for debugging integration issues."
    }
  ],
  keyPapers: [
    {
      id: "shah-vint-2023",
      title: "ViNT: A Foundation Model for Visual Navigation",
      authors: "Shah et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2306.14846"
    },
    {
      id: "shah-gnm-2023",
      title: "GNM: A General Navigation Model to Drive Any Robot",
      authors: "Shah et al.",
      venue: "ICRA 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2210.03370"
    },
    {
      id: "sridhar-nomad-2024",
      title: "NoMaD: Goal Masked Diffusion Policies for Navigation and Exploration",
      authors: "Sridhar et al.",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.07896"
    },
    {
      id: "ramakrishnan-habitat-2021",
      title: "Habitat-Matterport 3D Dataset (HM3D): 1000 Large-scale 3D Environments for Embodied AI",
      authors: "Ramakrishnan et al.",
      venue: "NeurIPS 2021 Datasets Track",
      year: 2021,
      url: "https://arxiv.org/abs/2109.08238"
    }
  ],
  claruRelevance: "Claru collects navigation data across 100+ cities, deploying mobile platforms in diverse indoor environments including offices, retail spaces, warehouses, and residential buildings. Our collectors follow standardized trajectory protocols with coverage verification, and our processing pipeline delivers SLAM-optimized trajectories with semantic map annotations. We handle everything from sensor setup through format conversion for ViNT, GNM, or custom training pipelines.",
};

export default data;
