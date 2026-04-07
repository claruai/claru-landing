import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "point-cloud",
  termSlug: "point-cloud",
  category: "data-modalities",
  metaTitle: "Point Cloud — Definition & Training Data | Claru",
  metaDescription: "A point cloud is a set of 3D coordinates representing surfaces in a scene, captured by LiDAR or depth sensors. Learn how point clouds power robot perception and what data quality matters.",
  primaryKeyword: "point cloud",
  secondaryKeywords: ["3D point cloud", "LiDAR point cloud", "point cloud processing", "3D scan data", "point cloud registration"],
  canonicalPath: "/glossary/point-cloud",
  h1: "Point Cloud: Definition, Applications, and Training Data Requirements",
  heroSubtitle: "A point cloud is an unordered set of three-dimensional coordinates, where each point represents a sampled location on a surface in the physical world. Captured by LiDAR sensors, depth cameras, or stereo vision systems, point clouds provide robots with the geometric understanding of their environment needed for grasping, navigation, and manipulation planning.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Point Cloud", href: "/glossary/point-cloud" },
  ],
  sections: [],
  faqs: [
    {
      question: "What sensors produce point clouds for robotics applications?",
      answer: "The primary sensors for robotics point cloud capture are LiDAR (Light Detection and Ranging), structured-light depth cameras (Intel RealSense, Microsoft Azure Kinect), and time-of-flight cameras. LiDAR produces sparse but long-range point clouds suitable for outdoor navigation and autonomous driving, with densities ranging from 30,000 to over 300,000 points per scan. Structured-light cameras produce dense, short-range point clouds ideal for tabletop manipulation, typically capturing 300,000 to 1 million points at ranges up to 4 meters. Stereo vision systems can also produce point clouds through triangulation, though with less geometric precision. The choice of sensor determines point density, noise characteristics, range, and the types of surfaces that produce reliable returns — all factors that training data must faithfully represent."
    },
    {
      question: "How are point clouds annotated for training machine learning models?",
      answer: "Point cloud annotation assigns labels to individual points or groups of points. For semantic segmentation, each point receives a class label (floor, table, object). For instance segmentation, points belonging to distinct objects receive unique instance IDs. For object detection, annotators draw 3D bounding boxes (oriented cuboids) around objects of interest, specifying position, dimensions, and rotation in all three axes. Registration annotation aligns multiple point cloud scans into a shared coordinate frame. Annotation complexity varies dramatically: a simple 3D bounding box takes 1-3 minutes, while dense per-point semantic labeling of a full scene can take 30-60 minutes. Tools like CloudCompare, Supervisely 3D, and Scale AI's 3D platform are commonly used, with active learning increasingly employed to reduce human annotation burden on large datasets."
    },
    {
      question: "What is the difference between point clouds and depth maps?",
      answer: "A depth map is a 2D image where each pixel stores a distance value from the camera, maintaining the regular grid structure of the image sensor. A point cloud is an unordered set of 3D coordinates in world space, with no inherent grid structure. Depth maps can be converted to point clouds using camera intrinsic parameters (focal length, principal point), and this conversion is lossless. However, the reverse is lossy — projecting a point cloud back to a depth map discards points that occlude each other from the chosen viewpoint. For robotics, both representations have uses: depth maps integrate naturally with 2D convolutional networks, while point clouds work with architectures like PointNet that operate directly on 3D geometry without the viewpoint dependency of image-based representations."
    },
    {
      question: "What challenges affect point cloud quality in real-world robotics?",
      answer: "Several factors degrade point cloud quality in deployment conditions that training data must capture. Sensor noise introduces positional error on each point, typically 1-5mm for structured-light cameras and 1-3cm for LiDAR at range. Transparent and reflective surfaces (glass, polished metal, water) produce missing or erroneous returns because the light does not reflect back to the sensor as expected. Occlusion means that portions of the scene behind foreground objects produce no points. Motion blur occurs when the sensor or scene moves during capture, smearing geometric features. Multi-path interference happens when infrared light bounces off multiple surfaces before returning. Training data that only includes clean, static scenes with opaque matte objects will not prepare models for these real-world degradations — diverse capture conditions are essential."
    },
    {
      question: "How does Claru collect and process point cloud data for physical AI?",
      answer: "Claru captures point cloud data using calibrated depth sensors deployed across diverse real-world environments — homes, kitchens, workshops, retail spaces, and outdoor areas spanning 100+ cities. Our collection protocols include multi-viewpoint capture to minimize occlusion gaps, sensor-specific calibration verification before each session, and environmental diversity requirements covering varied lighting, surface materials, and clutter levels. Point clouds are delivered registered to a common coordinate frame when multi-view capture is used, with per-point confidence scores derived from sensor noise models. We support output in PLY, PCD, LAS, and NumPy array formats, with optional fusion to RGB-D for multimodal training pipelines. Quality control includes automated checks for point density thresholds, coverage completeness, and geometric consistency across overlapping scans."
    }
  ],
  ctaHeading: "Need Point Cloud Training Data?",
  ctaDescription: "Claru captures and annotates 3D point cloud data from diverse real-world environments. Purpose-built for robotics perception, navigation, and manipulation.",
  relatedGlossaryTerms: ["depth-data", "rgb-d-data", "scene-understanding", "pose-estimation"],
  relatedGuidePages: ["how-to-preprocess-point-clouds-for-training"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  longDefinition: "A point cloud is a collection of data points in a three-dimensional coordinate system, where each point is defined by its X, Y, and Z coordinates and optionally carries additional attributes such as color (RGB), intensity, surface normal vectors, or semantic labels. Point clouds represent the geometric structure of physical surfaces and objects as sampled by range-sensing devices — LiDAR scanners, structured-light depth cameras, time-of-flight sensors, or stereo vision systems. Unlike mesh or voxel representations, point clouds are unordered and irregularly spaced, faithfully reflecting the raw measurement geometry of the capture device.\n\nIn robotics and physical AI, point clouds serve as a primary 3D perception modality. A robot arm planning a grasp needs to know the precise 3D shape and position of the target object, the geometry of surrounding obstacles, and the supporting surface — information that point clouds provide directly. Mobile robots use point clouds from LiDAR for simultaneous localization and mapping (SLAM), building geometric maps of their environment while tracking their own position within it. Point clouds from depth cameras mounted on manipulators inform collision avoidance, workspace boundary detection, and object pose estimation.\n\nProcessing point clouds with deep learning required fundamental architectural innovations because standard convolutional neural networks assume regularly gridded inputs. PointNet (Qi et al., 2017) demonstrated that operating directly on raw point sets using shared MLPs and symmetric aggregation functions could match or exceed methods that first converted points to regular grids. PointNet++ introduced hierarchical feature learning through local neighborhoods. Subsequent architectures — Point Transformer, KPConv, MinkowskiNet — brought attention mechanisms and sparse convolutions to point cloud processing, improving performance on segmentation and detection benchmarks while scaling to larger scenes.\n\nThe training data requirements for point cloud models depend heavily on the target application. Object detection in autonomous driving requires millions of annotated LiDAR scans with 3D bounding boxes across diverse traffic scenarios, weather conditions, and geographic regions. Tabletop manipulation requires dense point clouds of objects in cluttered configurations with per-point or per-object semantic labels. Scene reconstruction requires registered multi-view point clouds with ground-truth camera poses. In all cases, the point density, noise characteristics, and environmental conditions of the training data must match the deployment sensor and environment — models trained on clean LiDAR scans from clear weather systematically fail in rain or fog, and models trained on dense structured-light data cannot handle the sparsity of long-range LiDAR.",
  historicalContext: "Point clouds as a data representation predate modern deep learning by decades. Photogrammetry and surveying used point clouds captured by total stations and early laser scanners from the 1980s onward, primarily for mapping, architecture, and civil engineering. The representation became central to computer vision with the introduction of affordable depth sensors — the Velodyne LiDAR units developed for the 2005 DARPA Grand Challenge brought LiDAR point clouds to autonomous driving, while the Microsoft Kinect (2010) democratized depth sensing for indoor applications at consumer price points.\n\nEarly machine learning on point clouds relied on hand-crafted features: spin images, fast point feature histograms (FPFH), and viewpoint feature histograms (VFH) converted local geometric patterns into fixed-length descriptors for classification and registration. These methods worked for specific tasks like object recognition in controlled settings but did not scale to the variability of real-world scenes.\n\nThe breakthrough came with PointNet (Qi et al., 2017), which showed that neural networks could process raw point sets directly without converting them to images or voxels first. PointNet used per-point MLPs followed by a symmetric max-pooling function to achieve permutation invariance — a key requirement since point clouds have no canonical ordering. PointNet++ (Qi et al., 2017) added hierarchical grouping for local feature learning. These architectures catalyzed rapid progress: VoteNet for 3D detection, PointFlow for generation, and FlowNet3D for scene flow estimation all built on the PointNet paradigm.\n\nLarge-scale benchmarks drove standardization. The KITTI dataset (Geiger et al., 2012) established LiDAR-based 3D object detection as a benchmark task. ScanNet (Dai et al., 2017) provided 1,500 reconstructed indoor scenes with dense semantic annotations. nuScenes (Caesar et al., 2020) and Waymo Open Dataset (Sun et al., 2020) scaled autonomous driving benchmarks to hundreds of thousands of annotated frames. For robotics manipulation, datasets like YCB-Video and ACRONYM provided object-centric point clouds with grasp annotations.",
  practicalImplications: "Working with point cloud data in robotics pipelines involves several practical challenges that training data must address. Sensor-specific preprocessing is unavoidable: LiDAR returns include ground plane points that must be filtered for object detection, structured-light cameras produce edge artifacts at depth discontinuities that need removal, and multi-sensor setups require extrinsic calibration to align point clouds from different viewpoints into a shared coordinate frame.\n\nPoint cloud density and coverage determine what models can learn. A tabletop manipulation model needs 1,000+ points per object to estimate shape and grasp affordances, but a navigation model may work with 100 points per obstacle if position accuracy is sufficient. Downsampling strategies (voxel grid filtering, farthest point sampling, random subsampling) should match training and inference — a model trained on voxel-downsampled data at 1cm resolution will behave unpredictably when given 5cm resolution input at deployment.\n\nData augmentation for point clouds differs from image augmentation. Standard transformations include random rotation around the vertical axis, random translation, random scaling, jittering individual point positions with Gaussian noise, and random point dropout. For manipulation tasks, augmenting object poses within physically plausible configurations (objects on surfaces, not floating in mid-air) requires scene-aware augmentation rather than naive geometric transforms.\n\nClaru's point cloud collection pipeline addresses these challenges through sensor-calibrated capture across diverse real-world environments. We deliver data with documented sensor parameters (intrinsics, noise models), registered multi-view scans when full-scene coverage is needed, and annotations that match your model's input requirements — whether that means per-point semantic labels, 3D bounding boxes, or 6-DoF object poses. Quality control includes automated density verification, noise profiling, and coverage completeness checks against the target scene geometry.",
  commonMisconceptions: [
    {
      misconception: "More points always means better model performance.",
      correction: "Beyond a task-dependent threshold, adding more points provides diminishing returns while significantly increasing computational cost. For 3D object detection, most architectures downsample to 16,000-32,000 points regardless of input density. For manipulation, 1,024-4,096 points per object typically capture sufficient geometric detail. What matters more than raw density is coverage completeness — a sparse but evenly distributed point cloud outperforms a dense one with large occlusion gaps. Training data should prioritize diverse viewpoints and complete object coverage over maximum point density."
    },
    {
      misconception: "Point cloud models generalize well across different sensors without retraining.",
      correction: "Different sensors produce point clouds with vastly different characteristics — LiDAR generates sparse, ring-pattern scans; structured-light cameras produce dense, regularly-spaced points with specific edge artifacts; stereo systems create semi-dense clouds with depth-dependent noise. Models trained on one sensor type lose 15-40% accuracy when evaluated on another without fine-tuning. Even within the same sensor family, different models have different noise profiles and point patterns. Training data should be captured with the same sensor model or a close equivalent to the deployment hardware."
    },
    {
      misconception: "RGB images are sufficient for robotics — point clouds add unnecessary complexity.",
      correction: "RGB images lack metric depth information, making precise 3D reasoning difficult. Estimating grasp points, collision distances, or object dimensions from monocular images requires learned depth estimation that introduces error, especially on novel objects and in novel environments. Point clouds provide direct metric 3D measurements, enabling physically grounded planning. The most effective robotics systems combine both modalities — RGB for appearance and texture, point clouds for geometry — rather than choosing one over the other. This is why RGB-D sensors that produce both simultaneously have become standard on manipulation platforms."
    }
  ],
  keyPapers: [
    {
      id: "qi-pointnet-2017",
      title: "PointNet: Deep Learning on Point Sets for 3D Classification and Segmentation",
      authors: "Qi et al.",
      venue: "CVPR 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1612.00593"
    },
    {
      id: "qi-pointnet2-2017",
      title: "PointNet++: Deep Hierarchical Feature Learning on Point Sets in a Metric Space",
      authors: "Qi et al.",
      venue: "NeurIPS 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1706.02413"
    },
    {
      id: "zhao-point-transformer-2021",
      title: "Point Transformer",
      authors: "Zhao et al.",
      venue: "ICCV 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2012.09164"
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
      id: "thomas-kpconv-2019",
      title: "KPConv: Flexible and Deformable Convolution for Point Clouds",
      authors: "Thomas et al.",
      venue: "ICCV 2019",
      year: 2019,
      url: "https://arxiv.org/abs/1904.08889"
    }
  ],
  claruRelevance: "Claru captures and annotates production-grade 3D point cloud data for robotics teams building perception, navigation, and manipulation systems. Our distributed workforce deploys calibrated depth sensors across 100+ cities, capturing the environmental diversity — varied lighting, surface materials, clutter configurations, and scene scales — that point cloud models need to generalize beyond lab settings. We deliver point clouds in PLY, PCD, LAS, and NumPy formats with per-point attributes including RGB color, surface normals, and semantic labels. Multi-view registration, 3D bounding box annotation, and 6-DoF object pose labeling are available through our annotation pipeline, with multi-annotator quality verification ensuring geometric precision. With 3M+ annotated clips in our catalog, Claru provides both the scale and the real-world diversity that close the gap between benchmark performance and reliable deployment.",
};

export default data;
