import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-preprocess-point-clouds-for-training",
  metaTitle: "How to Preprocess Point Clouds for Robot Training (2026 Guide) | Claru",
  metaDescription: "Step-by-step guide to preprocessing point clouds for robot learning: filtering, downsampling, registration, segmentation, and formatting for grasp prediction and manipulation policies.",
  primaryKeyword: "how to preprocess point clouds for robot training",
  secondaryKeywords: ["point cloud preprocessing robotics", "point cloud pipeline robot learning", "3D data preprocessing manipulation", "point cloud filtering downsampling"],
  canonicalPath: "/guides/how-to-preprocess-point-clouds-for-training",
  h1: "How to Preprocess Point Clouds for Robot Training",
  heroSubtitle: "A practitioner's guide to preprocessing 3D point cloud data for robot learning — from depth sensor calibration and noise filtering through multi-view registration, table plane removal, object segmentation, downsampling strategies, and formatting for grasp prediction and manipulation policy architectures.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Preprocess Point Clouds for Robot Training", href: "/guides/how-to-preprocess-point-clouds-for-training" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Point Cloud Preprocessing Matters for Robot Learning",
      paragraphs: [
        "Point clouds are the primary 3D input for grasp prediction models (Contact-GraspNet, AnyGrasp, GraspNet), manipulation policies that reason about 3D geometry (PointNet-based policies, 3D Diffusion Policy), and scene understanding modules that segment objects for pick-and-place. Raw point clouds from depth sensors contain substantial noise, holes, outliers, and artifacts that degrade model performance if not handled properly. A single incorrect point 10 cm away from the true object surface can shift a predicted grasp pose enough to cause failure. Preprocessing transforms raw, noisy sensor output into clean, standardized 3D representations ready for model consumption.",
        "The preprocessing pipeline must be carefully designed for the target model architecture. GraspNet-1Billion expects scene-level point clouds with 20,000+ points in the camera frame. Contact-GraspNet consumes partial point clouds from a single viewpoint. PointNet++ based policies expect downsampled clouds with exactly 1,024 or 4,096 points. 3D Diffusion Policy uses voxelized point clouds at a fixed resolution. Getting the preprocessing wrong — wrong coordinate frame, wrong point count, wrong normalization — causes training to fail silently, producing a model that appears to train but generates useless predictions.",
      ],
    },
    {
      type: "prose",
      heading: "Tool Ecosystem for Point Cloud Processing",
      paragraphs: [
        "Open3D (open3d.org) is the primary library for point cloud preprocessing in robotics. It provides Python bindings for filtering, downsampling, registration, TSDF integration, and surface normal estimation. Open3D's tensor-based API (using DLPack for zero-copy interop with PyTorch) enables GPU-accelerated processing for large point clouds. For visualization during development, Open3D's built-in viewer and draw_geometries() function are the fastest way to inspect intermediate results. CloudCompare is an alternative GUI tool for manual inspection of point cloud quality.",
        "For production pipelines processing thousands of point clouds per day, consider PyTorch3D for GPU-accelerated batch processing — its ball query, kNN, and chamfer distance operations run entirely on GPU. For real-time robot perception (processing a new point cloud every 33ms at 30 Hz), the key optimization is pre-allocating memory and reusing GPU tensors across frames rather than creating new Open3D point cloud objects each time. The Intel RealSense SDK includes built-in post-processing filters (temporal, spatial, hole-filling) that run on the camera's ASIC and are significantly faster than equivalent CPU processing.",
      ],
    },
    {
      type: "prose",
      heading: "Coordinate Frames and Normalization Strategies",
      paragraphs: [
        "Getting the coordinate frame right is the most common source of silent failures in point cloud preprocessing. Grasp prediction models (Contact-GraspNet, GraspNet) typically expect point clouds in the camera frame with the camera intrinsic matrix as a separate input \u2014 these models predict grasps relative to the camera and transform to the robot frame post-prediction. Manipulation policies (3D Diffusion Policy, PointNet-based policies) expect point clouds in the robot base frame so that geometric relationships between objects and the robot are consistent across episodes.",
        "For normalization, two strategies are common. Unit-sphere normalization centers each scene's point cloud at the centroid and scales to fit within a unit sphere (divide by the maximum distance from the centroid). This is standard for classification tasks (ModelNet40, ShapeNet) but loses metric scale information needed for grasp planning. Workspace normalization scales each axis to [-1, 1] based on the robot's workspace bounds, preserving relative proportions and keeping metric scale recoverable. For manipulation tasks, workspace normalization is preferred. Store the normalization parameters (centroid, scale factor, or workspace bounds) as metadata alongside each point cloud so predictions can be mapped back to the original coordinate frame for robot execution.",
      ],
    },
  ],
  faqs: [
    {
      question: "How many points should a preprocessed point cloud contain?",
      answer: "The target point count depends on the model architecture. GraspNet and Contact-GraspNet work well with 15,000-25,000 points per scene. PointNet++ based policies typically expect exactly 1,024 or 4,096 points (specified in the model config). 3D Diffusion Policy uses voxelized representations at 0.005-0.01 m resolution, which produces 5,000-20,000 occupied voxels depending on scene complexity. Always use farthest point sampling (FPS) rather than random sampling for downsampling — FPS preserves geometric detail at object edges and corners where grasp candidates concentrate.",
    },
    {
      question: "Which depth sensor produces the best point clouds for robot manipulation?",
      answer: "For tabletop manipulation at 0.3-1.5 m range, Intel RealSense L515 (LiDAR-based) provides the cleanest single-view point clouds with fewer holes on dark or shiny objects compared to stereo cameras. For multi-view fusion, Intel RealSense D435i (stereo) cameras at 3-4 viewpoints with TSDF fusion produce higher quality than any single sensor. Photoneo PhoXi is the gold standard for industrial bin-picking with sub-millimeter accuracy but costs 10x more. For outdoor robotics, Ouster OS1 or Velodyne VLP-16 LiDAR provide long-range point clouds but at lower density than depth cameras.",
    },
    {
      question: "How do I handle transparent and reflective objects in point clouds?",
      answer: "Transparent and reflective objects are the primary failure mode for active depth sensors — stereo cameras lose stereo matching on specular surfaces, and structured light patterns scatter on glass. Three mitigation strategies: (1) Use polarized depth sensors or apply temporary matte spray coating during data collection. (2) Fuse point clouds from 4+ viewpoints — even if each view has holes, the holes occur at different locations and TSDF fusion fills them. (3) Train a depth completion network (ClearGrasp or TransCG) on paired data with known ground-truth depth. For datasets that will include transparent objects, annotate a 'depth confidence' mask indicating which regions have reliable depth versus hallucinated depth from the sensor.",
    },
    {
      question: "Should point clouds be in camera frame or robot frame?",
      answer: "For grasp prediction models (Contact-GraspNet, GraspNet), provide the point cloud in the camera frame with the camera intrinsic matrix as a separate input — these models predict grasps relative to the camera and transform them to the robot frame post-prediction. For manipulation policies that use point clouds as observations (3D Diffusion Policy, PointNet-based policies), transform the point cloud to the robot base frame using the calibrated camera extrinsics. This ensures that the geometric relationships between objects and the robot are consistent across episodes, which is essential for policy learning.",
    },
  ],
  ctaHeading: "Need Preprocessed Point Cloud Datasets?",
  ctaDescription: "Claru delivers preprocessed, multi-view fused point cloud datasets with table removal, object segmentation, and formatting for your target model architecture.",
  relatedGlossaryTerms: ["point-cloud", "depth-data", "rgb-d-data"],
  relatedGuidePages: ["how-to-build-a-grasping-dataset", "how-to-annotate-depth-maps"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  difficulty: "intermediate",
  estimatedTime: "1-2 weeks",
  prerequisites: ["RGB-D camera(s) with known intrinsics", "Camera-to-robot calibration (extrinsics)", "Python 3.9+ with Open3D, NumPy, and trimesh", "Raw depth frames or pre-captured point clouds"],
  tools: ["Open3D", "NumPy", "trimesh", "Intel RealSense SDK", "PCL (Point Cloud Library)", "PyTorch3D (optional)", "CloudCompare (for visualization)"],
  steps: [
    {
      stepNumber: 1,
      title: "Capture and Validate Raw Depth Data",
      description: "Start with raw depth frames from your RGB-D sensor. For each frame, convert the depth image to a point cloud using the camera intrinsic matrix: for each pixel (u, v) with depth value d, compute the 3D point as x = (u - cx) * d / fx, y = (v - cy) * d / fy, z = d, where (fx, fy) are focal lengths and (cx, cy) is the principal point. In Open3D, this is a single call: o3d.geometry.PointCloud.create_from_depth_image(depth, intrinsic).\n\nValidate the raw point cloud before proceeding. Check: (1) Point count — a 640x480 depth image should produce roughly 200,000-300,000 valid points (pixels with non-zero depth). If you see fewer than 100,000, the sensor may have a coverage problem. (2) Depth range — filter points outside your workspace (typically 0.2-2.0 m for tabletop manipulation). Points beyond the workspace are noise or background. (3) NaN/Inf check — remove any points with non-finite coordinates. (4) RGB alignment — if using RGBD, verify that the color image aligns with the depth by rendering both as a colored point cloud and checking for misalignment at object edges. Misalignment indicates a calibration error between the RGB and depth sensors.\n\nFor multi-camera setups, validate each camera independently before attempting multi-view fusion. A miscalibrated camera will contribute corrupted geometry that degrades the fused point cloud.",
      tools: ["Open3D", "Intel RealSense SDK", "NumPy"],
      tips: ["Capture 10 frames and average the depth values at each pixel to reduce temporal noise — this is especially important for structured-light sensors (RealSense D400 series) which have 1-3 mm depth noise at 1 m range"],
    },
    {
      stepNumber: 2,
      title: "Filter Noise and Remove Outliers",
      description: "Raw point clouds contain two types of noise: statistical noise (points near the true surface but displaced by 1-5 mm) and outlier noise (isolated points far from any surface, caused by sensor artifacts, reflections, or edge effects). Apply a two-stage filtering pipeline.\n\nStage 1 — Statistical outlier removal: For each point, compute the mean distance to its K nearest neighbors (K=20 is a good default). Remove points where the mean neighbor distance exceeds the global mean plus 2 standard deviations. In Open3D: cl, ind = pcd.remove_statistical_outlier(nb_neighbors=20, std_ratio=2.0). This removes isolated outlier points while preserving surface geometry.\n\nStage 2 — Radius outlier removal: Remove points that have fewer than N neighbors within a radius R. Set R based on your sensor's point density (for a RealSense D435 at 1 m, points are approximately 2 mm apart, so R=0.01 m and N=5 works well). In Open3D: cl, ind = pcd.remove_radius_outlier(nb_points=5, radius=0.01). This catches small clusters of noise points that survive statistical filtering.\n\nFor manipulation applications, also apply a workspace bounding box filter: remove all points outside the robot's reachable workspace. This eliminates background objects (walls, ceiling, equipment) that add noise to the point cloud without providing useful information for manipulation. Define the workspace as a 3D bounding box in the robot base frame (e.g., x: [-0.3, 0.7], y: [-0.5, 0.5], z: [table_height - 0.02, table_height + 0.5]).",
      tools: ["Open3D", "NumPy"],
      tips: ["Apply workspace filtering before statistical filtering — removing background points first reduces the total point count by 50-80%, making the statistical outlier computation significantly faster"],
    },
    {
      stepNumber: 3,
      title: "Multi-View Registration and Fusion (if applicable)",
      description: "If using multiple cameras, fuse their point clouds into a single, hole-free 3D representation. Multi-view fusion eliminates single-view occlusions and holes. The standard approach is TSDF (Truncated Signed Distance Function) volume integration.\n\nFirst, transform each camera's point cloud to a common coordinate frame (typically the robot base frame) using the calibrated extrinsic matrices. Verify the registration by visualizing all point clouds overlaid — object surfaces should overlap within 2-3 mm. If misalignment exceeds 5 mm, recalibrate the camera extrinsics.\n\nCreate a TSDF volume: volume = o3d.pipelines.integration.ScalableTSDFVolume(voxel_length=0.002, sdf_trunc=0.01, color_type=o3d.pipelines.integration.TSDFVolumeColorType.RGB8). The voxel_length of 0.002 m (2 mm) provides sufficient resolution for grasping applications. Integrate each camera's RGBD frame: volume.integrate(rgbd, intrinsic, extrinsic_inv). Extract the fused point cloud: pcd = volume.extract_point_cloud(). The resulting point cloud has uniform density, no holes (where cameras overlap), and normals computed from the TSDF gradient.\n\nFor real-time or high-throughput applications, consider using NVIDIA's CUDA-accelerated TSDF implementation (nvblox) or the volumetric fusion in Open3D's tensor-based API. These achieve 10-100x speedup over the CPU implementation, enabling per-frame fusion at 30 Hz.",
      tools: ["Open3D (TSDF integration)", "NumPy", "Optional: nvblox for GPU acceleration"],
      tips: ["Set sdf_trunc to 5x the voxel_length — too small causes holes near surface edges, too large causes blurred geometry. The 5x ratio works well for manipulation-range depth data"],
    },
    {
      stepNumber: 4,
      title: "Segment the Scene: Table Removal and Object Isolation",
      description: "For manipulation tasks, the table plane dominates the point cloud (often 60-80% of total points) and must be removed to focus the model on the objects. Use RANSAC plane fitting to detect the dominant plane.\n\nIn Open3D: plane_model, inliers = pcd.segment_plane(distance_threshold=0.01, ransac_n=3, num_iterations=1000). The distance_threshold of 0.01 m (1 cm) classifies points within 1 cm of the fitted plane as table points. Remove inlier points to get the object point cloud: object_pcd = pcd.select_by_index(inliers, invert=True). Verify the plane normal — it should be approximately [0, 0, 1] in the robot frame (pointing upward). If the normal is significantly tilted, the table may be misaligned or the extrinsic calibration has an error.\n\nAfter table removal, segment individual objects using Euclidean clustering: labels = np.array(object_pcd.cluster_dbscan(eps=0.02, min_points=50)). Each cluster corresponds to one object on the table. This segmentation enables per-object processing (centering, normalization) and per-object grasp prediction. Filter clusters by size: remove clusters with fewer than 100 points (likely noise) or more than 50,000 points (likely merged objects or remaining table fragments).\n\nFor cluttered scenes where objects touch or overlap, Euclidean clustering will merge touching objects into a single cluster. In this case, use the scene-level point cloud for grasp prediction (as Contact-GraspNet does) rather than attempting perfect per-object segmentation.",
      tools: ["Open3D (RANSAC, DBSCAN)", "NumPy"],
      tips: ["Save the table plane parameters (normal and offset) — you can use them later to compute grasp approach angles relative to the table surface and to filter grasps that would collide with the table"],
    },
    {
      stepNumber: 5,
      title: "Downsample to the Target Point Count",
      description: "Models expect point clouds with a specific number of points (or within a specific range). Downsampling must preserve geometric fidelity — especially at object edges and fine features where grasp candidates are most critical.\n\nFarthest Point Sampling (FPS) is the gold standard for downsampling manipulation point clouds. Starting from a random seed point, FPS iteratively selects the point that is farthest from all previously selected points. This produces a spatially uniform subsample that preserves geometric detail at edges and corners. In PyTorch: from torch_cluster import fps; idx = fps(points, ratio=target_n / len(points)). In Open3D, use voxel downsampling as an approximation: pcd_down = pcd.voxel_down_sample(voxel_size=0.003), then adjust voxel_size to hit the target point count.\n\nTarget point counts by model: PointNet/PointNet++ policies: exactly 1,024 or 4,096 (pad with duplicated points if the source cloud is too small). Contact-GraspNet: 20,000 points (scene-level). AnyGrasp: 15,000-30,000 points. 3D Diffusion Policy: voxelize at 0.005-0.01 m resolution.\n\nFor models that accept variable-length point clouds, downsample to a consistent range (e.g., 10,000-20,000) to keep batch processing efficient. Augment during training by applying random downsampling within +-20% of the target count to build robustness to point density variation.\n\nAlways compute and store surface normals after downsampling: pcd_down.estimate_normals(search_param=o3d.geometry.KDTreeSearchParamHybrid(radius=0.02, max_nn=30)). Orient normals toward the camera: pcd_down.orient_normals_towards_camera_location(camera_location). Many grasp prediction models use normal information to determine approach direction.",
      tools: ["Open3D", "torch-cluster (for GPU-accelerated FPS)", "NumPy"],
      tips: ["Never use random subsampling for manipulation point clouds — random sampling under-represents edges and corners (which have fewer points per unit area than flat surfaces), precisely the regions where grasps are most sensitive to geometry"],
    },
    {
      stepNumber: 6,
      title: "Format, Normalize, and Package for Training",
      description: "Convert the preprocessed point cloud into the format expected by your target model. Common formats and their requirements:\n\n(1) NumPy .npz: Store as a dictionary with keys 'points' (Nx3 float32 for XYZ), 'colors' (Nx3 float32 for RGB normalized to [0,1]), 'normals' (Nx3 float32), and 'labels' (Nx1 int32 for object segmentation if available). This is the most portable format.\n\n(2) HDF5: Store each scene as a group with datasets for points, colors, normals, and metadata (camera intrinsics, extrinsics, scene ID). HDF5 supports compression (gzip, lzf) that reduces storage by 3-5x. Use h5py to write.\n\n(3) PyTorch tensor .pt: For direct loading in a PyTorch DataLoader. Store as a dictionary of tensors. Include a collate function that handles variable-length point clouds (pad or subsample to a fixed size within the DataLoader).\n\nNormalization: center each scene's point cloud at the origin by subtracting the centroid, then scale to fit within a unit sphere (divide by the maximum distance from the centroid). Store the centroid and scale factor as metadata so predictions can be mapped back to the original coordinate frame. For robot-frame point clouds, normalizing to the workspace bounding box (each axis scaled to [-1, 1]) is often more useful than unit-sphere normalization.\n\nGenerate train/validation/test splits stratified by scene diversity. Hold out 10% of scenes (not 10% of point clouds from the same scenes) for testing. Include a dataloader script that handles loading, batching, and optional augmentation (random rotation around the z-axis, random jitter of 1-2 mm, random point dropout of 5-10%). Package with a dataset card documenting: sensor type, capture conditions, preprocessing pipeline version, point count statistics, and coordinate frame conventions.",
      tools: ["Open3D", "NumPy", "h5py", "PyTorch"],
      tips: ["Include both the preprocessed point clouds and the raw depth images in the delivered dataset — some models operate on depth images directly (GG-CNN, FC-GraspNet), and having both avoids re-collection if the model architecture changes"],
    },
  ],
  keyPapers: [
    { id: "qi-pointnet-2017", title: "PointNet: Deep Learning on Point Sets for 3D Classification and Segmentation", authors: "Qi et al.", venue: "CVPR 2017", year: 2017, url: "https://arxiv.org/abs/1612.00593" },
    { id: "sundermeyer-contact-graspnet-2021", title: "Contact-GraspNet: Efficient 6-DoF Grasp Generation in Cluttered Scenes", authors: "Sundermeyer et al.", venue: "ICRA 2021", year: 2021, url: "https://arxiv.org/abs/2103.14127" },
    { id: "fang-graspnet-2020", title: "GraspNet-1Billion: A Large-Scale Benchmark for General Object Grasping", authors: "Fang et al.", venue: "CVPR 2020", year: 2020, url: "https://arxiv.org/abs/1912.13470" },
  ],
  claruRelevance: "Claru delivers fully preprocessed point cloud datasets with multi-view TSDF fusion, outlier removal, table plane segmentation, farthest point downsampling, and formatting for your target model architecture. We handle the full pipeline from raw depth sensor capture through calibration, fusion, segmentation, and packaging in .npz, HDF5, or PyTorch tensor formats. Each dataset includes surface normals, camera calibration files, coordinate frame documentation, and a PyTorch DataLoader with augmentation support.",
};

export default data;
