import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "depth-data",
  termSlug: "depth-data",
  category: "data-modalities",
  metaTitle: "Depth Data for Robotics — Sensors, Formats & Training Use | Claru",
  metaDescription: "Depth data provides per-pixel distance measurements that give robots 3D understanding of their environment. Learn about depth sensors (LiDAR, stereo, ToF, structured light), monocular depth estimation, and how depth maps improve robot manipulation and navigation policies.",
  primaryKeyword: "depth data",
  secondaryKeywords: ["depth map", "depth sensor data", "3D depth information", "RGBD data", "monocular depth estimation"],
  canonicalPath: "/glossary/depth-data",
  h1: "Depth Data: 3D Perception for Robot Manipulation and Navigation",
  heroSubtitle: "Depth data encodes per-pixel distance from the camera to the scene, transforming 2D images into 3D spatial representations. For physical AI, depth provides the geometric understanding that RGB alone cannot — object distances, surface orientations, collision boundaries, and grasp approach vectors that robot policies need to operate safely in unstructured environments.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Depth Data", href: "/glossary/depth-data" },
  ],
  sections: [],
  faqs: [
    {
      question: "What depth sensors are commonly used in robotics?",
      answer: "Four sensor technologies dominate robotics depth sensing. Structured light sensors (Intel RealSense D400 series, Microsoft Kinect v1) project an IR pattern and triangulate depth from the pattern deformation — accurate to 1-3mm at 0.5-4m range but fail in direct sunlight. Time-of-Flight (ToF) sensors (Microsoft Kinect Azure, PMD) measure round-trip time of emitted light pulses — work at longer ranges (up to 10m) but have lower resolution (640x576 for Azure Kinect). Stereo cameras (ZED, Intel RealSense D400) compute depth from parallax between two calibrated cameras — passive and outdoor-capable but struggle with textureless surfaces. LiDAR (Velodyne, Ouster) provides precise sparse point clouds at long range (100m+) for autonomous vehicles and outdoor robots but is too expensive and low-resolution for tabletop manipulation. For manipulation tasks, the RealSense D405 (short-range, high accuracy) and D435 (medium-range, wider FOV) are the most widely used in research labs.",
    },
    {
      question: "Should I use hardware depth sensors or monocular depth estimation for training data?",
      answer: "For robot learning, hardware depth sensors are strongly preferred because they provide metrically accurate depth — the actual distance in millimeters — which is essential for policies that must compute grasp poses, collision distances, or placement targets in world coordinates. Monocular depth estimation models like Depth Anything V2 (Yang et al., 2024) and MiDaS produce relative depth (ordinal relationships) that is excellent for scene understanding but lacks metric scale without calibration. The exception is when annotating existing RGB-only datasets: monocular depth can add approximate depth channels to historical datasets that were not collected with depth sensors. In this case, models like Metric3D or ZoeDepth can estimate metric depth from single images with errors of 5-15% at typical manipulation distances (0.3-1.5m), which is sufficient for coarse spatial reasoning but not for precision grasping.",
    },
    {
      question: "How should depth data be stored in robot learning datasets?",
      answer: "Depth maps are stored as single-channel 16-bit or 32-bit images where each pixel value represents distance in millimeters (uint16) or meters (float32). The 16-bit millimeter format is more common and more storage-efficient — it supports depths from 0 to 65,535mm (65.5m) with 1mm precision, adequate for all indoor robotics applications. Depth images should be spatially registered (aligned) to the corresponding RGB image so that pixel (u,v) in the RGB image corresponds to the same 3D point as pixel (u,v) in the depth image. Most depth sensors provide this registration in hardware or SDK. The dataset must also include camera intrinsics (focal length fx, fy and principal point cx, cy) so that any depth pixel can be un-projected to a 3D point: X = (u - cx) * Z / fx, Y = (v - cy) * Z / fy, Z = depth[u,v]. Without intrinsics, depth maps cannot be converted to point clouds or used for 3D reasoning.",
    },
    {
      question: "What are common quality issues with depth data and how do you fix them?",
      answer: "Depth sensor data has four systematic failure modes. First, missing depth (holes) on reflective, transparent, or very dark surfaces — glass, mirrors, shiny metal, and black objects absorb or scatter the IR pattern. Inpainting algorithms or learned depth completion networks (like IP-Basic or NLSPN) fill these holes using neighboring valid pixels. Second, flying pixels at depth discontinuities — where foreground and background meet, the sensor produces phantom mid-range readings. Edge-aware filtering or bilateral filtering removes these artifacts. Third, multi-path interference in ToF sensors — concave surfaces cause emitted light to bounce multiple times before returning, producing erroneous depth readings. This is mitigated by per-pixel confidence thresholds. Fourth, temporal noise — even on static scenes, depth readings fluctuate by 1-5mm frame-to-frame. Temporal averaging over 3-5 frames reduces noise without introducing motion blur for static or slow-moving scenes.",
    },
    {
      question: "Is depth data necessary for all robot learning tasks?",
      answer: "No. For tabletop manipulation with a fixed overhead camera and consistent object heights, RGB-only policies often achieve comparable performance to RGB-D policies because the depth variation in the scene is small and predictable. RT-1 and RT-2 both used RGB-only observations for many manipulation tasks. However, depth becomes essential in three scenarios: (1) cluttered environments where objects occlude each other and depth ordering determines grasp priority, (2) tasks requiring precise distance estimation like insertion, stacking, or pouring, and (3) navigation in unstructured environments where obstacle distances vary continuously. 3D Diffusion Policy (Ze et al., 2024) demonstrated that adding depth (via point clouds) to Diffusion Policy improved success rates by 20-35% on tasks involving spatial precision, establishing that depth is most valuable when the task has tight geometric constraints.",
    },
  ],
  ctaHeading: "Need RGB-D Datasets for Robot Learning?",
  ctaDescription: "Claru captures synchronized RGB-D data with calibrated depth sensors, cleaned depth maps, and registered point clouds. Tell us your sensor requirements.",
  relatedGlossaryTerms: ["rgb-d-data", "point-cloud", "monocular-depth-estimation", "depth-anything-v2"],
  relatedGuidePages: ["how-to-annotate-depth-maps"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  longDefinition: "Depth data is a spatial measurement modality that encodes the distance from a camera sensor to each visible surface point in the scene. Represented as a 2D image where pixel values indicate distance (typically in millimeters or meters), a depth map transforms the flat RGB image into a 2.5D representation that captures the three-dimensional geometry of the environment. When combined with camera intrinsic parameters (focal length and principal point), each depth pixel can be un-projected into a 3D point in camera coordinates, enabling construction of dense point clouds from a single viewpoint.\n\nIn robotics, depth data serves as the primary input for spatial reasoning. Grasp planning algorithms like GraspNet and Contact-GraspNet operate on point clouds derived from depth maps to compute 6-DOF grasp poses. Navigation policies use depth to estimate obstacle distances and traversability. Manipulation policies use depth to determine object heights, distances, and surface orientations that RGB images encode only implicitly through learned visual features.\n\nThe relationship between depth data and RGB data is complementary. RGB provides appearance, texture, color, and semantic information (what is this object?). Depth provides geometry, distance, and 3D structure (where is this object and how big is it?). RGB-D — the combination of aligned RGB and depth images — has become the standard observation format for indoor robotics. Most robot learning frameworks (including those based on Open X-Embodiment) accept RGB-D as a primary input modality, with the depth channel processed either as a fourth image channel or converted to a point cloud and processed by 3D encoders like PointNet++ or sparse 3D convolutions.\n\nModern monocular depth estimation models (Depth Anything V2, Metric3D, UniDepth) can generate depth maps from single RGB images, eliminating the need for dedicated depth sensors at inference time. However, these predictions are trained on datasets of real depth sensor data, creating a data dependency: the quality of monocular depth models depends directly on the quality and diversity of the sensor-based depth data used for training and evaluation.",
  historicalContext: "Depth sensing for robotics began with structured light systems in the 1980s. The earliest practical depth cameras used laser stripe triangulation, scanning a line across the scene and computing depth from the line deformation. These systems were slow (seconds per frame) and expensive, limiting their use to industrial inspection.\n\nThe first consumer depth sensor, Microsoft Kinect v1 (2010), revolutionized robotics research by providing 640x480 depth maps at 30fps for under $200. The Kinect used PrimeSense structured light technology, projecting a pseudo-random IR dot pattern and computing depth from the observed pattern distortion. Kinect enabled a wave of RGB-D datasets: NYU Depth V2 (Silberman et al., 2012), SUN RGB-D (Song et al., 2015), and ScanNet (Dai et al., 2017) established benchmarks for depth-based scene understanding.\n\nIntel RealSense cameras (2014-present) became the robotics standard, offering multiple form factors optimized for different range profiles. The D435 (global shutter, 0.2-10m range) became the default third-person camera for robot manipulation setups, while the D405 (0.07-0.5m range, high accuracy) was adopted for wrist-mounted cameras in close-range manipulation.\n\nThe monocular depth estimation revolution began with MiDaS (Ranftl et al., 2020), which trained on a mix of stereo, structured light, and LiDAR datasets to produce the first robust zero-shot depth estimator. Depth Anything (Yang et al., 2024) and Depth Anything V2 scaled this approach with 62 million labeled images, achieving sensor-comparable relative depth accuracy on indoor scenes. These models are now used to generate pseudo-depth labels for RGB-only robot datasets, retroactively adding depth information to historical data that was collected without depth sensors.",
  practicalImplications: "For teams building robot learning datasets with depth, sensor selection and mounting are the first decisions. For tabletop manipulation with a single arm, the standard setup is one RealSense D435 mounted overhead (0.5-1.5m from the workspace) and optionally one D405 mounted on the wrist (0.1-0.5m from objects). The overhead camera provides scene context; the wrist camera provides close-range precision during grasping. Both must be calibrated (intrinsics and extrinsics) and time-synchronized with the robot's control system.\n\nDepth data quality control is essential because raw sensor output contains artifacts. A standard preprocessing pipeline includes: (1) depth filtering to remove readings outside the sensor's reliable range (e.g., clipping below 0.3m and above 3m for the D435), (2) hole filling via inpainting or depth completion for pixels with missing readings (typically 5-15% of pixels on scenes with reflective objects), (3) temporal smoothing over 3-5 frames for static scenes, and (4) optional bilateral filtering to smooth noise while preserving edges. This pipeline should be applied before the data enters the training dataset.\n\nFor large-scale data collection where deploying depth sensors at every capture site is impractical, monocular depth estimation provides a scalable alternative. Depth Anything V2 runs at 30+ fps on a consumer GPU and produces relative depth maps from RGB video. For robotics applications requiring metric depth, Metric3D or ZoeDepth add absolute scale estimation, achieving 5-15% relative error at manipulation distances. The practical workflow is to collect RGB-only video with Claru's distributed collector network, then run monocular depth estimation as a batch processing step to add depth channels. This hybrid approach trades some depth accuracy for massive scale — thousands of diverse environments that would be infeasible to instrument with depth sensors.\n\nPoint cloud generation from depth maps requires careful implementation. The standard un-projection formula (X = (u-cx)*Z/fx, Y = (v-cy)*Z/fy) assumes a pinhole camera model. Real lenses have distortion (radial and tangential) that must be corrected before un-projection, using the distortion coefficients from camera calibration. Failing to correct for distortion produces point clouds with systematic geometric errors at the image periphery, which degrades 3D policy performance.",
  commonMisconceptions: [
    {
      misconception: "Depth sensors work reliably on all surfaces and materials.",
      correction: "Active depth sensors (structured light, ToF) systematically fail on transparent materials (glass, clear plastic), highly reflective surfaces (mirrors, polished metal), and very dark/absorptive surfaces (black objects). These failures produce missing depth values or incorrect readings. In typical indoor scenes, 5-15% of pixels have unreliable depth. For robotics applications involving glass, water, or metallic objects, teams must implement depth completion algorithms or use polarization-based depth sensing techniques that handle these materials better.",
    },
    {
      misconception: "Monocular depth estimation has replaced the need for depth sensors.",
      correction: "Monocular depth models produce impressive relative depth maps but lack the metric accuracy needed for most robot manipulation. A 10% depth error at 0.5m translates to 5cm of positional uncertainty — far too large for grasping or insertion tasks with millimeter tolerances. Monocular depth is valuable for scene understanding, navigation at medium range, and augmenting RGB-only datasets, but hardware depth sensors remain essential for manipulation tasks requiring sub-centimeter precision. The strongest results come from combining both: hardware depth for the manipulation workspace and monocular depth for broader scene context.",
    },
    {
      misconception: "Higher resolution depth sensors always produce better training data.",
      correction: "Depth resolution beyond 640x480 provides diminishing returns for most robot learning tasks because depth images are typically downsampled to 128x128 or 256x256 before being fed to neural networks. The critical quality factor is not resolution but depth accuracy (mm-level precision), temporal stability (low frame-to-frame noise), and fill rate (percentage of pixels with valid readings). A 640x480 sensor with 1mm accuracy and 98% fill rate produces better training data than a 1280x720 sensor with 5mm accuracy and 85% fill rate.",
    },
  ],
  keyPapers: [
    {
      id: "ze-3d-diffusion-2024",
      title: "3D Diffusion Policy: Generalizable Visuomotor Policy Learning via Simple 3D Representations",
      authors: "Ze et al.",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2403.03954",
    },
    {
      id: "yang-depth-anything-v2-2024",
      title: "Depth Anything V2",
      authors: "Yang et al.",
      venue: "NeurIPS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2406.09414",
    },
    {
      id: "ranftl-midas-2020",
      title: "Towards Robust Monocular Depth Estimation: Mixing Datasets for Zero-shot Cross-dataset Transfer",
      authors: "Ranftl et al.",
      venue: "TPAMI 2020",
      year: 2020,
      url: "https://arxiv.org/abs/1907.01341",
    },
    {
      id: "dai-scannet-2017",
      title: "ScanNet: Richly-annotated 3D Reconstructions of Indoor Scenes",
      authors: "Dai et al.",
      venue: "CVPR 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1702.04405",
    },
    {
      id: "sundermeyer-contact-graspnet-2021",
      title: "Contact-GraspNet: Efficient 6-DoF Grasp Generation in Cluttered Scenes",
      authors: "Sundermeyer et al.",
      venue: "ICRA 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2103.14127",
    },
  ],
  claruRelevance: "Claru provides RGB-D datasets with hardware depth from calibrated RealSense sensors, as well as monocular depth augmentation for our large-scale RGB-only video collections. Every depth-equipped capture includes factory-calibrated intrinsics, per-frame extrinsics, and a preprocessed depth channel with hole filling and temporal smoothing applied. Point cloud exports in PLY or PCD format are available on request.\n\nFor teams that need depth data at scale across diverse environments, Claru's monocular depth pipeline runs Depth Anything V2 on our 386,000+ clip catalog, adding depth channels to egocentric and manipulation videos captured in 100+ cities. This provides the environmental diversity needed for robust 3D policy training without requiring depth sensors at every capture location. Datasets ship with both raw sensor depth (where available) and model-estimated depth, letting teams choose the tradeoff between accuracy and scale that fits their application.",
};

export default data;
