import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-annotate-depth-maps",
  metaTitle: "How to Annotate Depth Maps (2026 Guide) | Claru",
  metaDescription: "Methods for generating, validating, and annotating depth maps from stereo cameras, structured light sensors, and monocular depth estimation models.",
  primaryKeyword: "how to annotate depth maps",
  secondaryKeywords: ["depth map annotation","depth data labeling","3D annotation guide","depth map quality validation","robot depth perception"],
  canonicalPath: "/guides/how-to-annotate-depth-maps",
  h1: "How to Annotate Depth Maps for Robot Perception",
  heroSubtitle: "Methods for generating, validating, and annotating depth maps from stereo cameras, structured light sensors, and monocular depth estimation models.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Annotate Depth Maps for Robot Perception", href: "/guides/how-to-annotate-depth-maps" },
  ],
  sections: [],
  faqs: [
    {
      question: "What depth resolution is needed for robotic manipulation tasks?",
      answer: "For tabletop manipulation, sub-millimeter depth accuracy (0.1-0.5mm) at working distances of 0.3-1.0m is ideal. Intel RealSense D435 achieves roughly 2% error at 1m, while structured-light sensors like the Photoneo PhoXi achieve 0.05mm accuracy. For navigation tasks, coarser resolution (1-5cm) at longer ranges (1-10m) is acceptable. The key metric is depth accuracy relative to the smallest object feature your policy needs to reason about."
    },
    {
      question: "Should I use stereo depth, structured light, or monocular depth estimation?",
      answer: "Stereo cameras (RealSense D435/D455) are best for general-purpose robotic manipulation: they work in varied lighting, have good range, and cost under $300. Structured light (RealSense L515, Photoneo) gives higher accuracy for close-range precision tasks but struggles in sunlight. Monocular depth models like Depth Anything V2 are useful for enriching existing RGB-only datasets but produce metric-scale errors of 5-15% that require ground-truth calibration."
    },
    {
      question: "How do you handle depth sensor noise on reflective or transparent objects?",
      answer: "Reflective and transparent objects are the primary failure mode for active depth sensors. Three approaches help: (1) Use polarized-light depth sensors or spray objects with temporary matte coating during data collection. (2) Fuse depth from multiple viewpoints to fill holes. (3) Train a depth-completion network (like ClearGrasp) on paired data where you have ground-truth depth from opaque versions of the same geometry. Always annotate depth-confidence masks alongside raw depth."
    },
    {
      question: "What is the best format for storing annotated depth maps?",
      answer: "Store depth as 16-bit unsigned PNG (millimeter scale) or 32-bit float EXR for sub-millimeter precision. Never use 8-bit formats or JPEG compression for depth data. Pair each depth frame with a confidence/validity mask as a separate single-channel image. For datasets targeting RLDS or HDF5 consumers, store depth as numpy arrays with explicit units metadata (e.g., depth_scale: 0.001 for mm-to-meter conversion). Include camera intrinsics (fx, fy, cx, cy) and extrinsics per frame."
    },
    {
      question: "How many annotated depth frames do I need for training a depth-based manipulation policy?",
      answer: "For single-task depth-conditioned grasping (e.g., Dex-Net style), 5,000-50,000 depth-grasp pairs suffice. For multi-task manipulation policies consuming RGB-D input (like PerAct or RVT), you need 100-200 demonstrations per task, each containing 50-200 depth frames at 10-30 Hz. Depth completion or refinement networks require 10,000-100,000 paired noisy/clean depth images. Start with 1,000 annotated frames to validate your pipeline before scaling."
    }
  ],
  ctaHeading: "Need Help With This?",
  ctaDescription: "Talk to a Claru data collection specialist about your specific requirements.",
  relatedGlossaryTerms: ["depth-data","monocular-depth-estimation","depth-anything-v2","rgb-d-data"],
  relatedGuidePages: ["how-to-preprocess-point-clouds-for-training"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  difficulty: "intermediate",
  estimatedTime: "1-3 weeks",
  prerequisites: [
    "RGB-D camera (Intel RealSense D435/D455 or Azure Kinect) or existing RGB video for monocular estimation",
    "Python 3.9+ with OpenCV, Open3D, and NumPy installed",
    "Calibration target (checkerboard or ChArUco board, printed at known dimensions)",
    "Storage infrastructure for 16-bit depth images (roughly 600KB per 640x480 frame)",
    "Understanding of your target model's depth input format (point cloud, depth image, or voxel grid)"
  ],
  tools: ["Depth Anything V2","Open3D","CloudCompare","Label Studio","Intel RealSense SDK","OpenCV","Python","NumPy","Metric3D"],
  steps: [
    {
      stepNumber: 1,
      title: "Choose Your Depth Source and Calibrate Sensors",
      description: "The first decision is whether you are annotating depth from an active sensor (stereo or structured light) or generating pseudo-depth from monocular RGB using a model like Depth Anything V2 or Metric3D. Active sensors give metric depth out of the box but have known failure modes on reflective, transparent, and very dark surfaces. Monocular depth models work on any RGB image but produce relative or affine-ambiguous depth that must be aligned to ground truth.\n\nFor active sensors, run intrinsic calibration using OpenCV's `calibrateCamera()` with a ChArUco board (at least 20 captures from varied angles). Store the intrinsics matrix and distortion coefficients. For stereo pairs, also run `stereoCalibrate()` to get the extrinsic rotation and translation between cameras. Verify reprojection error is below 0.5 pixels. For the Intel RealSense D435, use `rs-enumerate-devices` to confirm firmware version (recommend 5.14+), then run the factory calibration check via `rs2::auto_calibrated_device`. If using monocular estimation, install Depth Anything V2 (`pip install depth-anything-v2`) and validate on a scene with known dimensions. Measure the scale factor by placing an object of known size (e.g., a 10cm calibration cube) in the scene and computing `scale = true_depth / predicted_depth` across 50+ frames.\n\nA common pitfall is assuming the RealSense depth is pre-aligned to RGB. By default it is not. You must enable the `align_to` processing block (`rs2::align(RS2_STREAM_COLOR)`) or depth and RGB pixels will not correspond. Verify alignment by projecting depth edges onto the RGB image and checking they coincide with object boundaries.",
      tools: ["Intel RealSense SDK", "OpenCV", "Depth Anything V2", "Metric3D"],
      tips: [
        "Save calibration data as JSON alongside your dataset. Losing intrinsics after collection means the depth data is unusable for 3D reconstruction.",
        "For RealSense cameras, disable auto-exposure and lock exposure/gain values. Auto-exposure changes cause the infrared projector pattern to shift, creating temporal depth noise.",
        "Run calibration in the same lighting conditions you will collect in. IR-based structured light sensors behave differently under fluorescent vs. natural light."
      ]
    },
    {
      stepNumber: 2,
      title: "Capture Raw Depth Data with Quality Checks",
      description: "Set up your recording pipeline to capture synchronized RGB and depth streams. With the RealSense SDK, use `rs2::pipeline` with a config that enables both `RS2_STREAM_DEPTH` (640x480 at 30fps is standard) and `RS2_STREAM_COLOR` (1280x720 or 640x480). Apply the temporal filter (`rs2::temporal_filter` with `smooth_alpha=0.4`, `smooth_delta=20`) and spatial filter (`rs2::spatial_filter` with `magnitude=2`, `smooth_alpha=0.5`) to reduce noise without over-smoothing edges. Record to rosbag format if using ROS2, or write directly to HDF5 using h5py.\n\nDuring capture, implement real-time quality checks. Compute the percentage of valid (non-zero) depth pixels per frame. For tabletop manipulation scenes, valid coverage should exceed 85%. If it drops below 70%, flag the frame for review. Common causes of missing depth: reflective surfaces (metal objects, glass), very close objects (below the sensor's minimum range of 0.28m for D435), and direct sunlight washing out the infrared pattern.\n\nFor each recording session, capture a reference frame with the calibration object visible. This lets you verify metric accuracy post-hoc. Record at a consistent framerate and include hardware timestamps (not system clock) to avoid jitter. Write a `capture_metadata.json` per session containing sensor serial number, firmware version, filter settings, exposure values, and room temperature (depth accuracy on stereo sensors drifts with thermal expansion).\n\nIf you are generating monocular depth instead of capturing it, batch-process your RGB dataset through Depth Anything V2 using the ViT-L backbone for best quality. Run inference at the native image resolution. The model outputs relative disparity, so you must convert to metric depth using your calibration scale factor from Step 1.",
      tools: ["Intel RealSense SDK", "ROS2", "h5py", "Depth Anything V2"],
      tips: [
        "Record depth as 16-bit unsigned integers in millimeters, not as float32. This halves storage and avoids floating-point precision issues at close range.",
        "Warm up the RealSense sensor for 30+ seconds before recording. The IR projector causes internal heating that shifts depth readings by 1-3mm during the first minute."
      ]
    },
    {
      stepNumber: 3,
      title: "Build the Annotation Schema and Taxonomy",
      description: "Define exactly what annotations you need on top of raw depth. Common depth annotation types for robotics include: (1) semantic segmentation masks identifying which object each depth pixel belongs to, (2) surface-normal maps derived from depth but refined by human annotators at object boundaries, (3) depth-confidence masks separating reliable vs. noisy regions, (4) keypoint annotations in 3D space (e.g., handle positions, pour points), and (5) grasp affordance regions marked on the depth map.\n\nFor each annotation type, create a detailed specification document. For semantic segmentation on depth, define your label taxonomy. A manipulation-focused taxonomy might include: `table_surface`, `target_object`, `distractor_object`, `gripper`, `robot_arm`, `background`, and `void` (for invalid depth). Assign each label a unique integer ID and a display color. Store this mapping in a `taxonomy.json` file that ships with the dataset.\n\nFor 3D keypoint annotation, specify the keypoints per object category with diagrams. For a mug, you might define: `handle_top`, `handle_bottom`, `rim_center`, `base_center`. Annotators will click on the depth image and the annotation tool converts the pixel coordinate plus depth value into a 3D point using the camera intrinsics: `X = (u - cx) * Z / fx`, `Y = (v - cy) * Z / fy`, `Z = depth[v, u]`.\n\nDesign the annotation format before building the tool. Use a standard like COCO-compatible JSON for 2D masks or a custom schema with explicit 3D coordinates. Each annotation record should reference the source frame by timestamp and camera ID, not by filename, to support multi-camera setups.",
      tools: ["Label Studio", "CVAT", "JSON Schema"],
      tips: [
        "Include a void/ignore class for depth pixels where the sensor returned zero or unreliable values. Do not force annotators to label regions with no depth data.",
        "For 3D keypoints, display the back-projected point cloud alongside the depth image so annotators can verify their click landed on the correct 3D location.",
        "Version your taxonomy from day one. Adding a new label mid-annotation requires re-reviewing all previously annotated frames."
      ]
    },
    {
      stepNumber: 4,
      title: "Set Up Annotation Tooling and Workflows",
      description: "Configure Label Studio or CVAT to support depth-specific annotation workflows. In Label Studio, create a project with a custom labeling interface that displays both the RGB image and the depth image side by side. Use the `<Image>` tag for RGB and a colorized depth visualization (apply a JET or TURBO colormap using OpenCV's `cv2.applyColorMap()` on the normalized depth). This dual-view lets annotators see object boundaries clearly in RGB while marking regions on the depth map.\n\nFor semantic segmentation, use Label Studio's polygon or brush tool with the SAM (Segment Anything Model) backend enabled for semi-automatic segmentation. Install the ML backend: `label-studio-ml start sam_backend --port 9090`, then configure the project to use it. Annotators click a point on an object and SAM proposes a mask, which the annotator refines. This cuts per-frame annotation time from 5-10 minutes to 30-90 seconds.\n\nSet up the annotation pipeline as a multi-stage workflow: (1) auto-pre-annotation using SAM or a pre-trained segmentation model to generate initial masks, (2) human refinement where annotators correct boundaries and add missing objects, (3) review stage where a second annotator verifies the corrections. Configure Label Studio's `overlap` parameter to route 20% of frames to two independent annotators for inter-annotator agreement measurement.\n\nFor depth-confidence annotation, create a custom tool or script that computes per-pixel confidence from the raw sensor data. RealSense provides a confidence score via the `rs2::disparity_transform` metadata. Threshold at confidence > 0.5 for reliable pixels. Present this as a pre-filled mask that annotators can override where the automatic confidence is clearly wrong (e.g., marking a valid region as unreliable near depth discontinuities).",
      tools: ["Label Studio", "CVAT", "Segment Anything Model (SAM)", "OpenCV"],
      tips: [
        "Pre-compute colorized depth PNGs before importing into the annotation tool. Do not rely on the tool to render raw 16-bit depth correctly, most will clip or misinterpret the values.",
        "Set annotation time limits per frame (e.g., 3 minutes for segmentation). If a frame takes longer, it likely has edge cases that should be escalated to the review queue rather than over-labored by one annotator."
      ]
    },
    {
      stepNumber: 5,
      title: "Validate Annotations and Measure Quality",
      description: "Run systematic quality checks on all annotations before they enter the training set. For semantic segmentation masks, compute IoU (Intersection over Union) between overlapping annotator submissions. Target IoU above 0.85 for well-defined objects and above 0.70 for ambiguous boundaries (like cloth or deformable objects). Use the formula: `iou = np.sum(mask_a & mask_b) / np.sum(mask_a | mask_b)`. Frames where IoU falls below threshold get routed back for re-annotation.\n\nFor 3D keypoint annotations, compute the Euclidean distance between repeated annotations of the same keypoint. Convert pixel annotations to 3D using the camera intrinsics and depth values, then measure the distance in millimeters. For manipulation-relevant keypoints (grasp points, contact locations), target inter-annotator deviation below 5mm. For coarser landmarks (object center), 10-15mm is acceptable.\n\nRun automated geometric consistency checks. Verify that annotated 3D keypoints lie on or very near the depth surface (within 2mm). Check that segmentation mask boundaries align with depth discontinuities. A common annotation error is labeling a foreground object with pixels that have background depth values at silhouette edges, which corrupts the 3D reconstruction. Detect this by comparing the depth values inside the mask against a robust estimate of the object's depth range using median absolute deviation.\n\nCompute dataset-level statistics: label distribution (ensure no class is under-represented by more than 10x), spatial coverage (keypoints should span the full workspace, not cluster in one region), and depth-range coverage (ensure you have annotations across the full 0.3-2.0m working range). Generate a validation report with histograms and flag any distribution gaps that need additional collection passes.",
      tools: ["NumPy", "Open3D", "Matplotlib", "scikit-learn"],
      tips: [
        "Compute Cohen's kappa alongside IoU. IoU measures spatial overlap but kappa accounts for chance agreement, which matters when most pixels are background.",
        "Visualize the worst 5% of annotations by quality score. These outliers often reveal systematic tool bugs or confused annotators that affect many frames.",
        "Track annotator-level quality metrics. If one annotator consistently scores 20% below average, re-review their entire batch rather than spot-checking."
      ]
    },
    {
      stepNumber: 6,
      title: "Export, Package, and Integrate with Training Pipelines",
      description: "Convert validated annotations into the format your training pipeline expects. For point-cloud-based models like PointNet++ or PerAct, back-project the annotated depth images to point clouds using Open3D: `pcd = o3d.geometry.PointCloud.create_from_depth_image(depth, intrinsic)`. Attach per-point semantic labels by indexing the segmentation mask at each pixel before projection. Downsample to a fixed point count (e.g., 4096 or 8192 points) using `pcd.farthest_point_down_sample(n)` for consistent tensor shapes.\n\nFor voxel-based models (C2F-ARM, RVT), voxelize the labeled point cloud using Open3D's `VoxelGrid.create_from_point_cloud()` with a resolution matching your model's expectations (typically 5mm for tabletop manipulation). Store voxel grids as dense numpy arrays or sparse coordinate tensors.\n\nPackage the final dataset into a standard format. For RLDS (used by RT-X and OpenVLA), structure each episode as a TFRecord with `observation/depth_image` as uint16, `observation/depth_segmentation` as uint8, and `observation/camera_intrinsics` as float32[4]. For HDF5 (used by Diffusion Policy, ACT), group data as `/episode_N/depth`, `/episode_N/segmentation`, `/episode_N/keypoints_3d` with chunked compression (`compression='gzip', compression_opts=4`). Include a `dataset_info.json` with schema version, sensor specs, annotation taxonomy, split assignments, and per-split statistics.\n\nWrite a dataloader that loads and preprocesses depth for training. Include normalization (divide by `depth_scale` to get meters, then clip to working range), augmentation (random depth noise with `sigma=0.002m`, dropout of random depth patches to simulate sensor failure), and the coordinate transform from camera frame to the robot's base frame using the stored extrinsics. Provide a smoke test script that loads one batch, prints tensor shapes, and renders a visualization.",
      tools: ["Open3D", "TensorFlow Datasets", "h5py", "NumPy", "zarr"],
      tips: [
        "Always include raw depth alongside annotations in the final package. Downstream users may want to re-derive point clouds at different resolutions or apply different filters.",
        "Generate a train/val/test split at the scene level, not the frame level. Frames from the same scene in different splits cause data leakage because the background and objects are identical.",
        "Include a README and a single-command visualization script. The first thing every downstream user will do is try to load and visualize one sample. Make this trivial."
      ]
    }
  ],
  keyPapers: [
    {
      id: "yang-depth-anything-v2-2024",
      title: "Depth Anything V2",
      authors: "Yang et al.",
      venue: "NeurIPS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2406.09414"
    },
    {
      id: "yin-metric3d-v2-2024",
      title: "Metric3D v2: A Versatile Monocular Geometric Foundation Model",
      authors: "Yin et al.",
      venue: "IEEE TPAMI 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2404.15506"
    },
    {
      id: "sajjan-cleargrasp-2020",
      title: "ClearGrasp: 3D Shape Estimation of Transparent Objects for Manipulation",
      authors: "Sajjan et al.",
      venue: "ICRA 2020",
      year: 2020,
      url: "https://arxiv.org/abs/1910.02550"
    },
    {
      id: "shridhar-peract-2023",
      title: "Perceiver-Actor: A Multi-Task Transformer for Robotic Manipulation",
      authors: "Shridhar et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2209.05451"
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
  claruRelevance: "Depth map annotation sits at the intersection of sensor expertise and annotation precision where Claru delivers the most value. Our collectors operate calibrated RGB-D rigs (RealSense D435/D455, Azure Kinect) across 100+ locations, capturing depth data in diverse real-world environments that simulated or single-lab datasets cannot match. We handle the full pipeline from camera calibration and synchronized capture through semantic segmentation, 3D keypoint annotation, and depth-confidence masking, all with built-in inter-annotator agreement checks exceeding 0.85 IoU. For teams using monocular depth models like Depth Anything V2 to enrich existing RGB datasets, Claru provides the ground-truth calibration data needed to align predicted depth to metric scale. We deliver in RLDS, HDF5, or custom formats with dataloaders and visualization scripts included, so your engineering team can go from dataset delivery to first training run in hours, not weeks.",
};

export default data;
