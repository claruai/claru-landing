import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-build-a-grasping-dataset",
  metaTitle: "How to Build a Grasping Dataset for Robot Learning (2026 Guide) | Claru",
  metaDescription: "Step-by-step guide to building grasping datasets for robot learning — covering object selection, grasp pose labeling, success metrics, and formatting for grasp prediction models.",
  primaryKeyword: "how to build a grasping dataset for robot learning",
  secondaryKeywords: ["robot grasping dataset","grasp pose dataset","grasp prediction training data","pick and place dataset","robot grasp quality"],
  canonicalPath: "/guides/how-to-build-a-grasping-dataset",
  h1: "How to Build a Grasping Dataset for Robot Learning",
  heroSubtitle: "A practitioner's guide to building grasping datasets — from object set design and grasp pose labeling through success metric computation, antipodal quality scoring, and formatting for GraspNet, Contact-GraspNet, and policy-based grasp learning.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Build a Grasping Dataset for Robot Learning", href: "/guides/how-to-build-a-grasping-dataset" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Grasping Datasets Are Foundational to Robot Manipulation",
      paragraphs: [
        "Grasping is the gateway capability for any manipulator robot. A robot that cannot reliably grasp objects cannot perform any downstream task — pick-and-place, assembly, tool use, or deformable object manipulation all begin with a successful grasp. The quality and diversity of your grasping dataset directly determines how robustly your robot handles novel objects in deployment.",
        "Modern grasp prediction models like Contact-GraspNet and AnyGrasp learn to propose SE(3) grasp poses from point cloud observations, while policy-based approaches like Diffusion Policy learn full approach-grasp-lift trajectories from demonstrations. Both require large-scale datasets with diverse objects, multiple grasp strategies per object, and validated success labels. The GraspNet-1Billion benchmark set the standard with 1.1 billion grasp poses across 88 objects, but domain-specific datasets (warehouse SKUs, kitchen utensils, surgical instruments) still require custom collection.",
        "This guide walks through building a grasping dataset from object set curation through multi-view point cloud capture, grasp recording, quality metric computation, and formatting for the major grasp prediction architectures."
      ]
    },
    {
      type: "stats",
      heading: "Grasping Dataset Scale References",
      stats: [
        { value: "30-50", label: "Minimum objects across 5-8 categories" },
        { value: "5K-50K", label: "Grasp attempts for robust training" },
        { value: "200+", label: "Grasps per object for quality prediction" },
        { value: "50/50", label: "Success/failure ratio for Dex-Net style training" },
        { value: "4,096-20K", label: "Point cloud size per scene (points)" },
        { value: "<0.3px", label: "Target camera calibration reprojection error" }
      ]
    },
    {
      type: "cards",
      heading: "Grasp Quality Metrics Explained",
      cards: [
        {
          title: "Epsilon Quality (Force Closure)",
          description: "The minimum wrench the gripper can resist in any direction while maintaining a stable grasp. Computed from contact points and surface normals. Values range from 0 (marginal) to ~0.1 (very stable)."
        },
        {
          title: "Antipodal Score",
          description: "Cosine similarity between the two contact normals for a parallel-jaw grasp. A score of 1.0 means the normals are perfectly opposed — the ideal configuration for force closure."
        },
        {
          title: "Clearance Distance",
          description: "Minimum distance between the gripper body and any non-target surface during the approach trajectory. Low clearance grasps are feasible but collision-prone in cluttered scenes."
        },
        {
          title: "Volume Quality",
          description: "Volume of the convex hull of the grasp wrench space. Measures overall wrench resistance across all directions — higher volume means a more versatile, stable grasp."
        }
      ]
    },
    {
      type: "comparison-table",
      heading: "Grasp Prediction Architectures and Data Requirements",
      columns: ["Model", "Input Format", "Grasp Representation", "Typical Training Scale"],
      rows: [
        { "Model": "Contact-GraspNet", "Input Format": "Partial point cloud (Nx3)", "Grasp Representation": "SE(3) pose + quality", "Typical Training Scale": "17K scenes, 1B+ grasps (sim)" },
        { "Model": "GraspNet-1Billion", "Input Format": "Multi-view RGBD + point cloud", "Grasp Representation": "SE(3) pose + score", "Typical Training Scale": "190 scenes, 88 objects" },
        { "Model": "Dex-Net / GQ-CNN", "Input Format": "Depth image patch (32x32)", "Grasp Representation": "Planar [x,y,theta,width]", "Typical Training Scale": "6.7M grasps (sim + real)" },
        { "Model": "AnyGrasp", "Input Format": "Single-view point cloud", "Grasp Representation": "SE(3) + width + score", "Typical Training Scale": "~1B grasps (sim)" }
      ]
    },
    {
      type: "prose",
      heading: "Sim-to-Real Transfer for Grasping Datasets",
      paragraphs: [
        "The most data-efficient approach to building grasping datasets combines large-scale simulated grasping with targeted real-world data. Dex-Net trained on 6.7 million simulated grasps and transferred to real robots with minimal fine-tuning. Isaac Sim and MuJoCo provide physics engines capable of simulating parallel-jaw and multi-finger grasps at thousands of attempts per second.",
        "To build a hybrid sim-real dataset: first, generate 100K-1M simulated grasps across your target object set using mesh models from photogrammetry or manufacturer CAD files. Use domain randomization on object pose (SO(3) rotation), table friction (0.3-0.8 coefficient), camera viewpoint (azimuth and elevation jitter), and rendering parameters (lighting, texture, background). Second, collect 5,000-10,000 real-world grasps to calibrate the sim-to-real gap and provide the model with real sensor noise characteristics.",
        "The critical success factor is matching the simulated and real observation distributions. Generate simulated point clouds using the same camera intrinsics, resolution, and noise model as your real sensor. For RealSense depth, add Gaussian noise with sigma proportional to depth squared (matching the sensor's known error model). If your simulated point clouds look noticeably cleaner than real ones, the model will overfit to simulation and fail on real data.",
        "Validate sim-to-real transfer by evaluating the hybrid-trained model on a held-out set of purely real grasps. If performance on real grasps is within 5% of performance on simulated grasps, the transfer is working well. A larger gap indicates the simulation is not realistic enough — investigate depth noise modeling, object texture accuracy, and gripper dynamics."
      ]
    }
  ],
  faqs: [
    {
      question: "How many objects should a grasping dataset include?",
      answer: "Object diversity directly determines grasp policy generalization. For a single-gripper policy targeting household environments, the GraspNet-1Billion benchmark uses 88 objects across 10 categories and has become the standard reference. Start with a minimum of 30-50 objects spanning 5-8 categories: boxes (cereal, tissue), cylinders (bottles, cans), irregular shapes (fruits, tools), thin objects (pens, utensils), deformable objects (bags, plush toys), and transparent objects (glasses, containers). Each object should appear in at least 200 grasp attempts (successful and failed) for robust grasp quality prediction. For bin picking applications, include objects that stack and nest. For tabletop manipulation, include objects of varying mass (10g to 2kg), friction coefficients, and compliance. Source objects from standardized sets like the YCB Object Set (77 objects with 3D models) or the EGAD benchmark (2,000+ procedurally generated shapes) for reproducibility."
    },
    {
      question: "What grasp representations should the dataset include?",
      answer: "Modern grasp datasets should include multiple representations to support different model architectures. The primary representations are: (1) SE(3) grasp pose — a 4x4 homogeneous transformation matrix specifying the gripper position and orientation at the moment of grasp closure, stored as [x,y,z] translation in meters plus a 3x3 rotation matrix or quaternion. This is the input format for GraspNet and Contact-GraspNet. (2) Planar grasp parameters — for top-down parallel-jaw grasping, store [x, y, theta, width, quality] where x,y is the grasp center in pixel coordinates, theta is the grasp angle (0-180 degrees), width is the jaw opening distance, and quality is a success probability. This is used by GG-CNN and Dex-Net. (3) Grasp trajectory — the full approach-grasp-lift-retract sequence as a time series of end-effector poses, useful for policy learning methods. Always include the gripper width at closure and a binary success label. For antipodal grasps, compute and store the epsilon quality metric (minimum wrench resistance) and the force closure boolean."
    },
    {
      question: "How do you label grasp success reliably?",
      answer: "Grasp success labeling requires a clear, unambiguous definition and consistent evaluation protocol. The standard definition: a grasp is successful if the robot can close the gripper on the object, lift it to a height of 20cm above the surface, hold for 3 seconds, and the object remains in the gripper throughout. For automated labeling at scale, attach a force-torque sensor between the wrist and gripper — a sustained force reading above 2N during the hold phase indicates the object is securely grasped. Alternatively, use a load cell under the picking surface: if weight decreases by the object's known mass after the lift, the grasp succeeded. For post-hoc labeling from video data, train a binary classifier on 500 manually labeled grasp attempts using the final 5 frames of each attempt. Achieve at least 95% accuracy on a held-out set before deploying automated labeling. Always store the raw force/weight readings alongside the binary label so thresholds can be adjusted later."
    },
    {
      question: "Should a grasping dataset include failed grasps?",
      answer: "Yes — failed grasps are essential for training grasp quality predictors. A dataset of only successful grasps teaches the model what good grasps look like but provides no signal about what makes grasps fail. Dex-Net 2.0 used a 50/50 success/failure ratio and showed that failure examples significantly improved grasp quality prediction. For policy-based methods (Diffusion Policy, ACT), failures provide negative supervision that prevents the policy from learning fragile grasp strategies. Collect failures both naturally (they will occur during teleop collection — typically 10-20% of attempts) and intentionally (deliberately attempt grasps from challenging angles, on object edges, and with insufficient force). Label failures with a failure taxonomy: gripper_slip (object escapes during lift), collision (gripper hits table or other objects), missed (gripper closes on empty space), unstable (object drops during hold), and approach_failure (could not reach the grasp pose). This taxonomy enables per-failure-type analysis during model evaluation."
    },
    {
      question: "What depth sensing setup produces the best point clouds for grasp prediction?",
      answer: "Grasp prediction models (Contact-GraspNet, AnyGrasp) consume point clouds as input, so depth sensor quality directly impacts model performance. The Intel RealSense D435i (structured light stereo) produces acceptable point clouds at 640x480 at ranges of 0.3-3m but struggles with reflective, transparent, and dark objects. The Azure Kinect DK (time-of-flight) handles a wider range of materials but has lower spatial resolution. For production-quality grasp datasets, use a multi-view stereo rig: mount 3-4 RealSense cameras at 30-45 degree angles around the workspace and fuse their depth maps using TSDF volume integration (Open3D's ScalableTSDF). This eliminates single-view occlusions and holes. Process point clouds to robot base frame using calibrated extrinsics. Downsample to 4,096-20,000 points using farthest point sampling (not random — FPS preserves geometric detail at object edges where grasp candidates concentrate). Remove table plane points using RANSAC plane fitting with a 1cm inlier threshold."
    }
  ],
  ctaHeading: "Need a Grasping Dataset?",
  ctaDescription: "Claru builds grasping datasets with diverse object sets, multi-view point clouds, SE(3) grasp poses, and validated success labels. Talk to a specialist about your gripper and model requirements.",
  relatedGlossaryTerms: ["dexterous-manipulation","hand-object-interaction","point-cloud","depth-data"],
  relatedGuidePages: ["how-to-collect-dexterous-manipulation-data","how-to-preprocess-point-clouds-for-training"],
  relatedSolutionSlugs: ["manipulation-trajectory-data"],
  difficulty: "intermediate",
  estimatedTime: "3-6 weeks",
  prerequisites: ["Robot arm with parallel-jaw gripper","RGB-D camera(s) for point cloud capture","Object set (30+ objects across 5+ categories)","Python 3.10+ with Open3D, NumPy, and PyTorch","Grasp simulation tools (optional: GraspIt!, Isaac Sim)"],
  tools: ["Open3D","Intel RealSense SDK","GraspIt!","Python","NumPy","h5py","trimesh","PyTorch"],
  steps: [
    {
      stepNumber: 1,
      title: "Design the Object Set and Grasp Taxonomy",
      description: "Curate an object set that spans the shape, size, material, and mass diversity your grasp policy must handle in deployment. Use the YCB Object Set as a starting baseline — it includes 77 objects with calibrated 3D models, mass measurements, and friction coefficients. Supplement with domain-specific objects: for warehouse automation, add common SKUs (boxes, bottles, bags, pouches); for kitchen manipulation, add utensils, fruits, and containers of varying rigidity.\n\nFor each object, record: 3D mesh model (from photogrammetry or manufacturer CAD), mass (grams), bounding box dimensions (mm), material category (rigid, deformable, transparent, reflective), friction coefficient (if measurable), and representative photographs from 4 angles. Define the grasp taxonomy: for a parallel-jaw gripper, categorize grasps by approach direction (top-down, side, angled), contact location (center, edge, handle), and jaw opening width. For multi-finger hands, use the Feix taxonomy subset relevant to your hand. Create a minimum coverage matrix: each object must have at least 10 successful grasps per approach direction for the training split.",
      tools: ["YCB Object Set", "Meshlab for 3D scanning", "Caliper for measurements"],
      tips: ["Include 5-10 adversarial objects that are deliberately hard to grasp (shiny metal tools, thin flat objects, soft bags) — these stress-test your grasp model and reveal failure modes early"]
    },
    {
      stepNumber: 2,
      title: "Set Up the Point Cloud Capture and Grasp Recording Pipeline",
      description: "Build the sensing and recording infrastructure. For point cloud capture, mount 2-3 Intel RealSense D435i cameras around the workspace at 30-45 degree angles, each calibrated for intrinsics (ChArUco board, reprojection error < 0.3px) and extrinsics (hand-eye calibration to robot base frame). Fuse multi-view depth maps using Open3D's TSDF volume integration: create a volume with voxel_size=0.002 (2mm resolution), integrate each camera's RGBD frame with its calibrated pose, and extract the fused point cloud with volume.extract_point_cloud(). This produces dense, hole-free point clouds even for partially occluded objects.\n\nBuild the grasp recording pipeline: before each grasp attempt, capture the scene point cloud. Record the full grasp trajectory as a sequence of end-effector poses at 20 Hz: approach (from 10cm above), pre-grasp (5cm above contact), contact (gripper at object surface), close (gripper closing), lift (straight up 20cm), hold (3-second static hold). After the hold phase, record the success label (object still in gripper?), the gripper width at closure, and the force readings if available. Store each attempt as one record with fields: scene_pointcloud (Nx6 float32 for XYZ+RGB), grasp_pose (4x4 float64), gripper_width (float32 in meters), success (bool), failure_type (string, null if successful), and trajectory (Tx7 float64 for timestep x [x,y,z,qx,qy,qz,qw]).",
      tools: ["Intel RealSense SDK 2.0", "Open3D", "ROS2 for trajectory recording"],
      tips: ["Capture the scene point cloud before every grasp attempt, not once per scene reset — objects shift slightly between attempts, and stale point clouds create misaligned grasp labels"]
    },
    {
      stepNumber: 3,
      title: "Collect Grasps: Teleoperation and Autonomous Exploration",
      description: "Combine teleoperated grasps (high quality, diverse strategies) with autonomous exploration (high volume, systematic coverage). For teleoperated collection, operators use a SpaceMouse to position the gripper, then execute the grasp-lift-hold sequence. Target 30-50 teleoperated grasps per object covering all feasible approach directions. For autonomous exploration, use heuristic sampling: generate candidate grasp poses by sampling antipodal pairs on the object's point cloud using the approach from Dex-Net — for each point, compute the surface normal, generate a gripper approach along the anti-normal direction, and check for collision using a simplified gripper mesh. Execute the top 50-100 candidates per object and record success/failure.\n\nAim for a dataset of 5,000-50,000 grasp attempts across your full object set. Dex-Net 2.0 trained on 6.7 million simulated grasps; for real-world data, 10,000-50,000 real grasps supplemented with simulated data produces strong results. Ensure balanced coverage: track grasps per (object, approach_direction) pair and prioritize under-represented combinations. For each scene configuration, scatter 1-5 objects randomly on the workspace (varying clutter density from isolated objects to dense piles). Record the scene configuration metadata: object IDs, approximate poses, and clutter level.",
      tools: ["SpaceMouse for teleoperation", "Antipodal grasp sampler", "Collision checking (trimesh)"],
      tips: ["Run autonomous exploration overnight on isolated objects first to build the bulk of the dataset, then add cluttered scenes during supervised sessions — unsupervised clutter grasping risks damaging objects or the robot"]
    },
    {
      stepNumber: 4,
      title: "Compute Grasp Quality Metrics and Enrich Labels",
      description: "Augment binary success labels with continuous grasp quality metrics that provide richer training signal. Compute these metrics for every grasp attempt:\n\n(1) Epsilon quality: the minimum magnitude wrench that can be resisted in any direction while maintaining force closure. Compute using the GraspIt! engine or analytically from the contact points and normals. Values range from 0 (marginal grasp) to ~0.1 (very stable). (2) Volume quality: the volume of the grasp wrench space convex hull, measuring the overall wrench resistance. (3) Antipodal score: for parallel-jaw grasps, the cosine similarity between the two contact normals (1.0 = perfectly antipodal). (4) Clearance: minimum distance between the gripper and any non-target surface (table, other objects) during the approach trajectory. Low clearance grasps are feasible but collision-prone in deployment.\n\nAdditionally, enrich with derived labels: grasp_type (top_down, side, angled based on the approach vector's angle relative to the table normal), contact_type (face, edge, vertex based on local surface curvature at contact points), and task_relevant (boolean: is this grasp suitable for subsequent manipulation, e.g., grasping a mug by the handle vs. the body). Store all metrics as additional columns alongside each grasp record.",
      tools: ["GraspIt!", "Open3D for normal estimation", "NumPy for geometric computations"],
      tips: ["Compute epsilon quality even for failed grasps — low epsilon on a failed grasp confirms the quality metric is predictive; high epsilon on a failed grasp reveals that your failure taxonomy needs expansion (maybe the failure was due to slip, not geometry)"]
    },
    {
      stepNumber: 5,
      title: "Validate Dataset Quality and Remove Labeling Errors",
      description: "Run a comprehensive validation pipeline before packaging the dataset. (1) Point cloud quality: for each scene, check that the fused point cloud has at least 1,000 points per object (detected by segmenting via known object poses), no NaN or Inf values, and spatial extent matching the known object dimensions within 5%. Flag scenes where point cloud quality is degraded (depth holes, registration artifacts). (2) Grasp label consistency: cross-validate success labels against grasp quality metrics. Grasps labeled successful but with epsilon quality < 0.001 are suspicious — verify with the recorded trajectory video. Grasps labeled failed but with high epsilon may indicate a labeling error or a force-based failure not captured by geometric quality. (3) Object distribution: verify each object has the minimum target number of grasps across approach directions. (4) Scene diversity: compute the distribution of clutter levels and verify adequate coverage from single-object to dense pile scenes.\n\nFor grasp pose accuracy, reproject each grasp pose into the corresponding camera image and verify that the gripper visualization aligns with the actual gripper position visible in the RGB frame. Misalignment indicates camera calibration drift — recalibrate and re-collect affected sessions. Remove the bottom 5% of records by a composite quality score combining point cloud density, label confidence, and calibration accuracy.",
      tools: ["Open3D for visualization", "matplotlib", "Custom QA scripts"],
      tips: ["Render 100 random grasps as point cloud visualizations with the gripper mesh overlaid — visual inspection catches calibration errors and pose labeling bugs that statistical checks miss"]
    },
    {
      stepNumber: 6,
      title: "Format for Grasp Prediction Models and Package",
      description: "Convert the validated dataset into formats compatible with major grasp prediction architectures. For Contact-GraspNet: each sample needs a partial point cloud (Nx3 float32 in camera frame), camera intrinsics, and a set of SE(3) grasp poses with quality labels. For GraspNet-1Billion compatibility: organize by scene, with each scene containing multiple object point clouds and a grasp annotation file mapping grasp_id to (object_id, grasp_pose, quality_score). For Dex-Net / GQ-CNN: render depth images from the scene point cloud at the resolution expected by the model (32x32 or 64x64 centered on each grasp candidate) and pair with the grasp parameters [x, y, theta, width] and quality label.\n\nGenerate stratified train/validation/test splits stratified by both object identity and scene configuration. The standard protocol: hold out 10% of objects as entirely unseen (test only) to measure generalization to novel objects, and split the remaining 90% of objects 80/10/10 by scene. For benchmark compatibility, also provide an 'image-wise' split where no RGB image appears in both train and test. Package the dataset with: point clouds in .npz format, grasp annotations in JSON, a PyTorch Dataset class with configurable output format (SE3 poses or planar parameters), a visualization script rendering grasps on point clouds, and a dataset card documenting the object set, collection protocol, quality metrics, and split definitions.",
      tools: ["Open3D", "NumPy", "PyTorch", "h5py or .npz files"],
      tips: ["Include the raw RGB-D images alongside the fused point clouds — some models (GG-CNN, FC-GraspNet) operate on depth images rather than point clouds, and having both avoids re-collection"]
    }
  ],
  keyPapers: [
    {
      id: "fang-graspnet-2020",
      title: "GraspNet-1Billion: A Large-Scale Benchmark for General Object Grasping",
      authors: "Fang et al.",
      venue: "CVPR 2020",
      year: 2020,
      url: "https://arxiv.org/abs/1912.13470"
    },
    {
      id: "sundermeyer-contact-graspnet-2021",
      title: "Contact-GraspNet: Efficient 6-DoF Grasp Generation in Cluttered Scenes",
      authors: "Sundermeyer et al.",
      venue: "ICRA 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2103.14127"
    },
    {
      id: "mahler-dexnet-2017",
      title: "Dex-Net 2.0: Deep Learning to Plan Robust Grasps with Synthetic Point Clouds and Analytic Grasp Metrics",
      authors: "Mahler et al.",
      venue: "RSS 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1703.09312"
    }
  ],
  claruRelevance: "Claru builds grasping datasets with diverse object sets, multi-view fused point clouds, SE(3) grasp poses with quality metrics, and validated success labels. We handle the full pipeline from object set curation and sensor calibration through data collection, quality scoring, and formatting for Contact-GraspNet, GraspNet, Dex-Net, and policy-based architectures.",
};

export default data;
