import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "rgb-d-data",
  termSlug: "rgb-d-data",
  category: "data-modalities",
  metaTitle: "RGB-D Data — Definition & Training Data | Claru",
  metaDescription: "RGB-D data combines color images with per-pixel depth measurements, giving robots both appearance and geometry. Learn how RGB-D powers physical AI and what collection quality matters.",
  primaryKeyword: "RGB-D data",
  secondaryKeywords: ["RGBD dataset", "color and depth data", "RGB-D sensor", "depth camera data", "RGB-D perception"],
  canonicalPath: "/glossary/rgb-d-data",
  h1: "RGB-D Data: Definition, Applications, and Training Data Requirements",
  heroSubtitle: "RGB-D data pairs a standard color (RGB) image with a spatially aligned depth (D) map, providing per-pixel geometric distance measurements alongside visual appearance. This combination gives robots the ability to perceive both what objects look like and where they are in 3D space, making RGB-D the workhorse modality for manipulation, navigation, and scene understanding in physical AI.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "RGB-D Data", href: "/glossary/rgb-d-data" },
  ],
  sections: [],
  faqs: [
    {
      question: "What sensors produce RGB-D data for robotics?",
      answer: "The primary RGB-D sensors used in robotics are structured-light cameras (Intel RealSense D400 series, Microsoft Azure Kinect, Orbbec), time-of-flight cameras (PMD, Lucid Helios), and active stereo systems. Structured-light cameras project an infrared pattern onto the scene and measure distortions to compute depth, achieving 1-3mm accuracy at ranges up to 4 meters. Time-of-flight cameras measure the round-trip time of modulated infrared light, providing longer range (up to 10m) but with slightly more noise. Active stereo systems use two cameras with an IR projector to enable stereo matching in textureless environments. Each technology has characteristic failure modes — structured-light struggles in direct sunlight, time-of-flight suffers from multipath interference in corners, and all IR-based methods produce unreliable depth on transparent and highly reflective surfaces. Training data must represent these sensor-specific artifacts so models learn to handle them."
    },
    {
      question: "How are RGB and depth channels aligned in RGB-D data?",
      answer: "RGB and depth channels come from physically separate sensors (a color camera and a depth sensor) with different positions, orientations, and optical properties. Alignment requires factory-calibrated extrinsic parameters (the rigid transform between the two sensors) and intrinsic parameters (focal length, distortion coefficients for each sensor). The depth image is reprojected into the RGB camera's coordinate frame so that pixel (x, y) in the color image corresponds to pixel (x, y) in the depth map. Misalignment of even 2-3 pixels causes 'depth bleeding' at object edges — the depth boundary does not match the color boundary, creating artifacts that confuse segmentation and grasping algorithms. Quality RGB-D datasets verify alignment accuracy and document the calibration parameters, enabling consuming teams to re-register if needed."
    },
    {
      question: "What are the main quality issues in RGB-D data for training?",
      answer: "Several quality issues affect RGB-D training data. Missing depth values occur on surfaces that do not return the infrared signal — transparent objects (glass, clear plastic), highly reflective surfaces (polished metal, mirrors), very dark surfaces that absorb IR, and regions beyond the sensor's range. These holes can comprise 10-30% of pixels in cluttered indoor scenes. Depth noise increases with distance from the sensor, with structured-light cameras showing approximately quadratic noise growth. Temporal inconsistency between color and depth frames causes motion artifacts when the scene or camera moves quickly — the color image captures a slightly different moment than the depth image. Flying pixels appear at depth discontinuities where the sensor interpolates between foreground and background. Training data pipelines should include depth validation, hole-filling strategies, and documentation of sensor-specific noise models."
    },
    {
      question: "How does RGB-D data compare to monocular depth estimation for robotics?",
      answer: "RGB-D sensors provide direct metric depth measurements at hardware speed with known accuracy characteristics. Monocular depth estimation uses neural networks to predict depth from a single RGB image, which introduces learned biases and scale ambiguity — the model may produce relative depth ordering but not absolute distances. For manipulation tasks requiring millimeter-level precision (grasping, insertion, assembly), RGB-D sensors remain necessary because monocular depth errors of 5-20% at typical ranges (0.5-2m) translate to centimeter-level position errors that cause grasp failures. For navigation and coarse spatial reasoning where 5-10cm accuracy is acceptable, monocular depth can supplement or replace dedicated depth sensors, especially on platforms with weight and power constraints. The tradeoff is cost and reliability versus weight and flexibility."
    },
    {
      question: "How does Claru collect and deliver RGB-D training data?",
      answer: "Claru deploys calibrated RGB-D sensor rigs across diverse real-world environments for data collection. Each setup verifies RGB-depth alignment calibration before recording begins, ensuring pixel-level registration quality. Our collection protocols cover the environmental conditions that matter for robust models: varied lighting (natural, fluorescent, mixed), diverse surface materials (wood, metal, fabric, transparent objects), different clutter levels, and multiple camera viewpoints (tabletop, wrist-mounted, third-person). RGB-D data is delivered with full sensor metadata — intrinsics, extrinsics, depth scale factors, and noise models — in standard formats including ROS bags, Open3D-compatible point clouds, and NumPy arrays. Depth channels undergo automated quality checks for coverage completeness, noise level validation, and RGB-depth alignment verification. For teams building manipulation or navigation models, Claru provides the sensor-accurate, environmentally diverse RGB-D data that closes the gap between lab demonstrations and real-world deployment."
    }
  ],
  ctaHeading: "Need RGB-D Training Data?",
  ctaDescription: "Claru captures calibrated RGB-D data from diverse real-world environments. Pixel-aligned color and depth for manipulation, navigation, and scene understanding models.",
  relatedGlossaryTerms: ["depth-data", "point-cloud", "egocentric-video", "semantic-segmentation"],
  relatedGuidePages: ["how-to-annotate-depth-maps"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  longDefinition: "RGB-D data is a multimodal data format that combines a standard RGB (red, green, blue) color image with a spatially aligned depth map, where each pixel in the depth channel stores the metric distance from the camera to the corresponding surface point in the scene. The 'D' stands for depth, and the combined representation provides both visual appearance information (texture, color, lighting) and geometric information (shape, distance, spatial arrangement) in a single synchronized capture. This makes RGB-D the most widely used perception modality for indoor robotics, tabletop manipulation, and embodied AI systems.\n\nThe depth channel transforms 2D image understanding into 3D spatial reasoning. Given the camera's intrinsic parameters (focal length, principal point), any pixel with a depth value can be backprojected into a 3D point in camera coordinates, and the full depth map can be converted into a point cloud or 3D mesh. This enables metric-scale reasoning that monocular RGB alone cannot provide: determining the physical size of an object, computing the distance to an obstacle, planning collision-free paths, and positioning a gripper at a precise 3D location. For manipulation tasks, the depth channel is often more informative than the color channel — grasp planning depends primarily on object geometry and spatial configuration, not on color or texture.\n\nRGB-D sensors generate data through various physical principles. Structured-light sensors (Intel RealSense D400 series, Azure Kinect) project an infrared pattern and analyze its deformation to triangulate depth. Time-of-flight sensors measure the phase shift of modulated infrared light to compute range. Active stereo systems use two IR cameras with a projected texture to enable stereo matching on textureless surfaces. Each principle produces depth data with different noise characteristics, failure modes, and operating ranges, and training data should capture these sensor-specific properties so that learned models are robust to the artifacts they will encounter in deployment.\n\nThe relationship between RGB-D data quality and downstream model performance is well-documented. Grasp success rates in benchmark evaluations (GraspNet, DexNet) correlate strongly with depth map completeness — missing depth on the target object or gripper approach region directly degrades grasp planning. Scene reconstruction quality for navigation (SLAM, occupancy mapping) depends on depth noise characteristics and temporal consistency. Semantic segmentation models that fuse RGB and depth channels achieve 5-15% higher mIoU than RGB-only models on indoor scene benchmarks, but only when the depth channel is well-calibrated and free of systematic artifacts. Training data with poor depth quality — misaligned registration, excessive holes, or uncorrected noise — can actually hurt performance compared to RGB-only baselines.",
  historicalContext: "RGB-D data became a mainstream research modality with the release of the Microsoft Kinect in November 2010. Priced at $150, the Kinect brought structured-light depth sensing to consumer hardware for the first time, democratizing 3D perception research that previously required expensive LiDAR or multi-camera stereo rigs costing $10,000 or more. Within two years, the Kinect had catalyzed a wave of dataset creation and algorithmic development that transformed indoor scene understanding.\n\nThe NYU Depth V2 dataset (Silberman et al., 2012) provided 1,449 densely labeled RGB-D images of indoor scenes, establishing the benchmark for RGB-D semantic segmentation. SUN RGB-D (Song et al., 2015) scaled this to 10,335 images with 3D bounding box annotations for object detection. ScanNet (Dai et al., 2017) captured 1,513 reconstructed indoor scenes by moving a depth sensor through spaces, creating dense 3D semantic annotations that could be queried from any viewpoint. These datasets drove rapid progress in RGB-D scene understanding and became standard benchmarks for the field.\n\nFor robotics, RGB-D data became central to manipulation research through datasets like YCB-Video (Xiang et al., 2018), which provided RGB-D sequences of objects with 6-DoF pose annotations, and the BigBIRD dataset (Singh et al., 2014), which captured high-resolution multi-view RGB-D data of household objects. The DexNet project (Mahler et al., 2017) demonstrated that depth images alone — without RGB — could train effective grasp planning systems, validating depth as a first-class perception modality for manipulation.\n\nThe evolution of RGB-D sensors continued with Intel RealSense (2014-present), which provided smaller, more accurate depth cameras suitable for robot mounting, and Azure Kinect (2019), which combined time-of-flight depth with a high-resolution color camera. Modern robot learning platforms (Franka, Hello Robot, ALOHA) typically mount one or more RGB-D cameras as standard equipment. The Open X-Embodiment project standardized RGB-D data formats across 22 robot platforms, establishing RLDS-compatible schemas for cross-embodiment training.",
  practicalImplications: "Collecting RGB-D data for robotics training requires careful attention to sensor setup, calibration, and environmental conditions. Camera mounting position determines what the model can perceive: wrist-mounted cameras provide close-range views of manipulation targets but suffer from motion blur during fast arm movements, while fixed overhead cameras provide stable workspace views but may occlude the gripper or target object. Many modern systems use both, creating multi-view RGB-D observations that provide complementary information. Training data should match the deployed camera configuration — models trained on overhead views lose substantial accuracy when evaluated on wrist-mounted camera views and vice versa.\n\nDepth preprocessing is essential before using RGB-D data for training. Raw depth maps contain holes (missing values), flying pixels at depth discontinuities, and noise that increases with distance. Standard preprocessing pipelines include bilateral filtering to smooth noise while preserving edges, hole-filling using image inpainting or nearest-neighbor interpolation, and clipping to the sensor's reliable range. The choice of preprocessing must match between training and inference — a model trained on bilateral-filtered depth will perform poorly on raw, unfiltered depth at deployment.\n\nFor manipulation tasks, the alignment between RGB and depth channels must be verified and documented. Even factory-calibrated sensors can drift over time, and thermal changes during operation shift the calibration. A calibration verification step before each data collection session — capturing a checkerboard or ArUco marker pattern and verifying that depth boundaries align with color boundaries — prevents subtle misalignment errors from contaminating the dataset.\n\nClaru's RGB-D collection pipeline addresses these challenges through standardized sensor calibration protocols, environmental diversity requirements, and automated quality validation. We capture data across kitchens, workshops, retail environments, and outdoor settings with varied lighting conditions and surface materials, delivering datasets with full sensor metadata in formats compatible with all major robot learning frameworks.",
  commonMisconceptions: [
    {
      misconception: "RGB-D sensors provide perfect depth measurements that can be used without preprocessing.",
      correction: "Raw RGB-D depth maps are significantly noisier than they appear. Structured-light sensors produce 1-3mm noise at close range that grows quadratically with distance. Missing depth values cover 10-30% of pixels in typical indoor scenes due to transparent objects, specular surfaces, and range limits. Flying pixels at depth discontinuities create false surfaces. Temporal inconsistency between color and depth frames causes misregistration during motion. Training data must be preprocessed (filtered, hole-filled, clipped) with the same pipeline that will be used at inference, and models should be trained with realistic depth artifacts rather than clean synthetic depth."
    },
    {
      misconception: "Monocular depth estimation has replaced the need for RGB-D sensors in robotics.",
      correction: "Monocular depth estimation has improved dramatically (Depth Anything, MiDaS, ZoeDepth), but it produces relative or approximate metric depth with 5-20% error, not the 1-3mm precision that RGB-D sensors provide at close range. For manipulation tasks where a 5mm error in gripper positioning causes grasp failure, sensor-based depth remains necessary. Monocular estimation is valuable as a complement — filling depth holes on transparent objects, providing depth at ranges beyond the sensor's limit, and enabling perception on platforms where weight and power constraints preclude dedicated depth hardware. The most robust systems fuse sensor depth with monocular estimation rather than relying exclusively on either."
    },
    {
      misconception: "RGB-D data from one sensor model transfers well to another without adaptation.",
      correction: "Different RGB-D sensors produce markedly different depth characteristics. Intel RealSense D435 uses active IR stereo and produces noisy depth at close range but handles sunlight relatively well. Azure Kinect uses time-of-flight and provides cleaner depth but fails in sunlight entirely. Orbbec cameras have different noise profiles and field-of-view characteristics. Models trained on data from one sensor lose 10-25% accuracy when deployed with a different sensor due to these systematic differences. Training data should be collected with the same sensor model used in deployment, or the dataset should include data from multiple sensor types with documented characteristics."
    }
  ],
  keyPapers: [
    {
      id: "silberman-nyuv2-2012",
      title: "Indoor Segmentation and Support Inference from RGBD Images",
      authors: "Silberman et al.",
      venue: "ECCV 2012",
      year: 2012,
      url: "https://cs.nyu.edu/~silberman/papers/indoor_seg_support.pdf"
    },
    {
      id: "dai-scannet-2017",
      title: "ScanNet: Richly-annotated 3D Reconstructions of Indoor Scenes",
      authors: "Dai et al.",
      venue: "CVPR 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1702.04405"
    },
    {
      id: "mahler-dexnet-2017",
      title: "Dex-Net 2.0: Deep Learning to Plan Robust Grasps with Synthetic Point Clouds and Analytic Grasp Metrics",
      authors: "Mahler et al.",
      venue: "RSS 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1703.09312"
    },
    {
      id: "xiang-posecnn-2018",
      title: "PoseCNN: A Convolutional Neural Network for 6D Object Pose Estimation in Cluttered Scenes",
      authors: "Xiang et al.",
      venue: "RSS 2018",
      year: 2018,
      url: "https://arxiv.org/abs/1711.00199"
    },
    {
      id: "song-sunrgbd-2015",
      title: "SUN RGB-D: A RGB-D Scene Understanding Benchmark Suite",
      authors: "Song et al.",
      venue: "CVPR 2015",
      year: 2015,
      url: "https://rgbd.cs.princeton.edu/paper.pdf"
    }
  ],
  claruRelevance: "Claru captures calibrated, high-quality RGB-D data across the diverse real-world environments where physical AI systems must operate reliably. Our collection rigs deploy Intel RealSense, Azure Kinect, and Orbbec sensors with verified RGB-depth alignment, documented intrinsic and extrinsic parameters, and automated depth quality validation. Data is captured across kitchens, workshops, retail spaces, and outdoor environments in 100+ cities, ensuring the environmental diversity — varied lighting, surface materials, clutter levels, and viewpoints — that RGB-D models need to generalize beyond lab settings. We deliver data in ROS bag, Open3D, NumPy, and RLDS formats with full sensor metadata, preprocessing documentation, and per-frame quality scores. With 3M+ annotated clips in our catalog, Claru provides the scale, precision, and real-world diversity that manipulation, navigation, and scene understanding models require for production deployment.",
};

export default data;
