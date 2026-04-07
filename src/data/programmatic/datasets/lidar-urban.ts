import type { DatasetPageData } from "./types";
const data: DatasetPageData = {
  slug: "lidar-urban",
  metaTitle: "Urban LiDAR Point Cloud Dataset for Autonomous Systems | Claru",
  metaDescription: "Urban LiDAR dataset with 3D object detection and semantic labels for training autonomous vehicles, delivery robots, and urban mapping AI. 60K+ scans across 40+ cities.",
  primaryKeyword: "urban lidar dataset",
  secondaryKeywords: ["lidar point cloud dataset","urban 3D mapping data","autonomous vehicle lidar data","city lidar scan dataset","3D object detection training data","urban perception dataset"],
  canonicalPath: "/datasets/lidar-urban",
  h1: "Urban LiDAR Point Cloud Dataset",
  heroSubtitle: "Dense LiDAR scans of real urban environments — streets, intersections, parking structures, pedestrian zones — captured across diverse cities with 3D bounding boxes, semantic segmentation, and lane-level annotations for training autonomous navigation and urban mapping systems.",
  breadcrumbs: [{ label: "Home", href: "/" },{ label: "Datasets", href: "/datasets" },{ label: "Urban LiDAR", href: "/datasets/lidar-urban" }],
  sections: [
    { type: "prose", heading: "Why Urban LiDAR Data Matters", paragraphs: [
      "LiDAR provides the geometric backbone for autonomous navigation in urban environments. Unlike cameras, LiDAR delivers precise distance measurements unaffected by lighting conditions — working equally well at night, in direct sunlight, and through light rain. Urban autonomous systems including self-driving vehicles, delivery robots, and mobile mapping platforms depend on LiDAR for accurate 3D scene understanding.",
      "Urban environments present unique challenges for LiDAR perception: dense pedestrian traffic, varied vehicle types (cars, trucks, bicycles, scooters), complex intersection geometry, construction zones, and the vertical complexity of multi-story buildings creating shadow regions. Training data must capture this full urban complexity across diverse city layouts and traffic patterns.",
      "The gap between available academic LiDAR datasets and real-world requirements is significant. Most public datasets cover a small number of cities with limited weather and lighting variation. Models trained on these narrow distributions fail when deployed in cities with different road widths, intersection designs, vegetation patterns, and traffic densities."
    ]},
    { type: "stats", heading: "Dataset at a Glance", stats: [{ value: "60K+", label: "LiDAR scans" },{ value: "400+", label: "Hours of driving" },{ value: "40+", label: "Cities covered" },{ value: "8+", label: "Annotation layers" }]},
    { type: "prose", heading: "Collection Methodology", paragraphs: [
      "Claru deploys vehicle-mounted LiDAR rigs (Ouster OS1-128, Velodyne Alpha Prime, or equivalent) synchronized with GPS/IMU and multi-camera arrays across urban environments. Collection routes cover arterial roads, residential streets, downtown cores, industrial zones, and highway on/off ramps to ensure comprehensive coverage of urban driving scenarios.",
      "Each collection vehicle captures 10-20Hz LiDAR point clouds synchronized with 30fps camera imagery and centimeter-accurate RTK GPS positioning. Sessions span 30-90 minutes of continuous driving across varied traffic conditions including rush hour, midday, nighttime, and weekend traffic patterns.",
      "Geographic diversity spans 40+ cities across North America, Europe, and Asia, covering different road design standards, signage systems, lane configurations, and urban density profiles. Seasonal collection captures leaf-on and leaf-off vegetation, wet and dry road surfaces, and varying sun angles that affect LiDAR return intensity."
    ]},
    { type: "cards", heading: "Annotation Layers", cards: [
      { title: "3D Bounding Boxes", description: "Oriented 3D bounding boxes for all dynamic objects: vehicles, pedestrians, cyclists, scooters, strollers. Includes velocity vectors and track IDs for object tracking.", icon: "📦" },
      { title: "Semantic Segmentation", description: "Per-point semantic labels: road surface, sidewalk, building, vegetation, pole, sign, vehicle, pedestrian, bicycle. 20+ categories aligned with standard autonomous driving taxonomies.", icon: "🎨" },
      { title: "Lane Markings", description: "3D polyline annotations for lane boundaries, stop lines, crosswalks, and turn arrows extracted from LiDAR intensity returns and verified against camera imagery.", icon: "🛣️" },
      { title: "Static Map Elements", description: "Traffic lights, stop signs, speed limit signs, traffic cones, and barriers annotated with 3D positions and state labels for HD map construction.", icon: "🚦" }
    ]},
    { type: "comparison-table", heading: "Comparison with Public LiDAR Datasets", columns: ["Dataset","Scans","Cities","Classes","Annotation Type"], rows: [
      { Dataset: "nuScenes", Scans: "400K", Cities: "2", Classes: "23", "Annotation Type": "3D boxes, semantic" },
      { Dataset: "Waymo Open", Scans: "230K", Cities: "6", Classes: "4", "Annotation Type": "3D boxes, tracking" },
      { Dataset: "KITTI", Scans: "15K", Cities: "1", Classes: "8", "Annotation Type": "3D boxes" },
      { Dataset: "Claru Urban LiDAR", Scans: "60K+", Cities: "40+", Classes: "20+", "Annotation Type": "3D boxes, semantic, lanes, maps" }
    ]},
    { type: "prose", heading: "Use Cases and Model Training", paragraphs: [
      "3D object detection models for autonomous vehicles train on the annotated LiDAR scans to detect and classify vehicles, pedestrians, and cyclists in point cloud data. The geographic diversity across 40+ cities ensures models learn features that generalize beyond the specific road geometries and traffic patterns of any single city.",
      "Semantic segmentation networks for LiDAR process the per-point labels to build scene understanding models that classify every point in a scan. These models form the geometric backbone of autonomous driving perception stacks, distinguishing drivable surface from sidewalk, building from vegetation, and static from dynamic objects.",
      "HD map construction pipelines use the lane marking and static map element annotations as training data for automated map building systems. These systems must detect lane boundaries, traffic signs, and infrastructure elements from LiDAR scans to maintain high-definition maps at continental scale."
    ]}
  ],
  faqs: [
    { question: "What LiDAR sensors are used for collection?", answer: "Primary collection uses Ouster OS1-128 and Velodyne Alpha Prime sensors providing 128-channel point clouds at 10-20Hz. Each scan contains 100K-300K points with intensity and ambient returns. Sensor configurations can be customized for specific project requirements." },
    { question: "How many cities are covered?", answer: "The dataset covers 40+ cities across North America, Europe, and Asia including major metropolitan areas, mid-size cities, and suburban environments. Each city contributes diverse road types, intersection configurations, and traffic patterns." },
    { question: "Is camera imagery synchronized with LiDAR?", answer: "Yes. All LiDAR collection includes synchronized multi-camera imagery (typically 6 cameras providing 360-degree coverage) and centimeter-accurate RTK GPS positioning. Camera-LiDAR extrinsic calibration is provided for sensor fusion applications." }
  ],
  ctaHeading: "Request an Urban LiDAR Sample Pack",
  ctaDescription: "Get sample urban LiDAR scans with full 3D annotations for your autonomous driving or urban mapping project.",
  relatedGlossaryTerms: ["lidar","point-cloud","3d-object-detection","semantic-segmentation"],
  relatedGuidePages: [],
  relatedSolutionSlugs: [],
  datasetProfile: { modalities: ["lidar","rgb"], totalClips: "60,000+", totalHours: "400+", annotationLayers: ["3D bounding boxes","Semantic segmentation","Lane markings","Static map elements","Object tracking","Velocity vectors"], formats: ["RLDS","HDF5","PCD","LAS","nuScenes format"], resolution: "128-channel LiDAR", fps: "10-20 Hz" },
  comparisonWithPublic: [
    { name: "nuScenes", clips: "400K", hours: "~5.5", modalities: "LiDAR, camera, radar", environments: "2 cities", annotations: "3D boxes, semantic" },
    { name: "Waymo Open", clips: "230K", hours: "~6.4", modalities: "LiDAR, camera", environments: "6 cities", annotations: "3D boxes, tracking" }
  ],
  useCases: [
    { modelType: "3D Object Detection", description: "Annotated LiDAR scans train point cloud detection models to identify vehicles, pedestrians, and cyclists for autonomous driving.", exampleModels: ["PointPillars","CenterPoint","VoxelNet"] },
    { modelType: "Semantic Segmentation", description: "Per-point labels enable training LiDAR segmentation networks for scene understanding in autonomous systems.", exampleModels: ["Cylinder3D","SalsaNext","RandLA-Net"] },
    { modelType: "HD Map Construction", description: "Lane and infrastructure annotations train automated HD map building pipelines for autonomous vehicle deployment.", exampleModels: ["MapTR","VectorMapNet"] }
  ],
  keyPapers: [
    { id: "caesar-nuscenes-2020", title: "nuScenes: A Multimodal Dataset for Autonomous Driving", authors: "Caesar et al.", venue: "CVPR 2020", year: 2020, url: "https://arxiv.org/abs/1903.11027" },
    { id: "sun-waymo-2020", title: "Scalability in Perception for Autonomous Driving: Waymo Open Dataset", authors: "Sun et al.", venue: "CVPR 2020", year: 2020, url: "https://arxiv.org/abs/1912.04838" },
    { id: "lang-pointpillars-2019", title: "PointPillars: Fast Encoders for Object Detection from Point Clouds", authors: "Lang et al.", venue: "CVPR 2019", year: 2019, url: "https://arxiv.org/abs/1812.05784" }
  ],
  claruRelevance: "Claru deploys LiDAR collection vehicles across 40+ cities, providing the geographic diversity that single-city academic datasets lack. Each scan receives multi-layer annotation including 3D bounding boxes, semantic segmentation, and lane-level labels through Claru's quality-controlled annotation pipeline. Data is delivered in your preferred format including nuScenes-compatible packaging."
};
export default data;
