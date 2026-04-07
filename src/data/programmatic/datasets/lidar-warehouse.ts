import type { DatasetPageData } from "./types";
const data: DatasetPageData = {
  slug: "lidar-warehouse",
  metaTitle: "Warehouse LiDAR Dataset for Robot Navigation | Claru",
  metaDescription: "Warehouse LiDAR point cloud dataset with shelf, pallet, and aisle annotations for training autonomous mobile robots, inventory systems, and warehouse automation. 45K+ scans across 20+ facilities.",
  primaryKeyword: "warehouse lidar dataset",
  secondaryKeywords: ["warehouse robot navigation data","indoor lidar dataset","AMR training data","warehouse 3D mapping","pallet detection lidar","logistics robot data"],
  canonicalPath: "/datasets/lidar-warehouse",
  h1: "Warehouse LiDAR Point Cloud Dataset",
  heroSubtitle: "Dense LiDAR scans of real warehouse and logistics facilities — aisles, shelving units, pallet racks, loading docks — with 3D annotations for shelving geometry, pallet positions, obstacle detection, and navigable paths for training autonomous mobile robots.",
  breadcrumbs: [{ label: "Home", href: "/" },{ label: "Datasets", href: "/datasets" },{ label: "Warehouse LiDAR", href: "/datasets/lidar-warehouse" }],
  sections: [
    { type: "prose", heading: "Why Warehouse LiDAR Data Matters", paragraphs: [
      "Autonomous mobile robots (AMRs) are transforming warehouse logistics, but navigation in dense warehouse environments requires precise 3D perception. Unlike outdoor driving where roads provide clear structure, warehouses present narrow aisles, dynamic obstacles (forklifts, workers, carts), varying shelf configurations, and the repetitive visual patterns that confuse camera-based systems. LiDAR provides the geometric precision these robots need.",
      "Warehouse environments have unique characteristics that outdoor LiDAR datasets cannot capture: highly structured but variable shelving geometry, pallets at multiple heights, narrow passages between rack rows, loading dock transitions between indoor and outdoor conditions, and the reflective surfaces of shrink-wrapped pallets and metal shelving. Training data must come from real warehouse environments to capture these domain-specific challenges.",
      "The warehouse automation market is projected to exceed $30 billion by 2027, driven by labor shortages and e-commerce growth. Companies building AMRs, autonomous forklifts, and inventory drones need training data at scale that covers the diversity of real warehouse configurations — not just the single demonstration facility most companies use for development."
    ]},
    { type: "stats", heading: "Dataset at a Glance", stats: [{ value: "45K+", label: "LiDAR scans" },{ value: "300+", label: "Hours captured" },{ value: "20+", label: "Warehouse facilities" },{ value: "10+", label: "Annotation layers" }]},
    { type: "prose", heading: "Collection Methodology", paragraphs: [
      "Claru deploys mobile LiDAR platforms (robot-mounted or hand-carried Ouster sensors) through operating warehouse facilities during normal business hours. Collection covers distribution centers, fulfillment centers, cold storage, retail backrooms, and manufacturing warehouses to ensure representation of diverse facility types and operational conditions.",
      "Each collection session captures point clouds at 10-20Hz as the platform traverses warehouse aisles, cross-aisles, staging areas, loading docks, and transition zones. Sessions include normal operations with active forklifts, workers, and carts providing realistic dynamic obstacle data. Multiple passes at different times of day capture varying occupancy levels.",
      "Facility diversity spans small retail backrooms to million-square-foot distribution centers across different racking systems (selective, drive-in, push-back, carton flow), floor types (concrete, epoxy, mezzanine), and climate conditions (ambient, refrigerated, frozen). Each facility contributes unique layout characteristics that broaden the training distribution."
    ]},
    { type: "cards", heading: "Annotation Layers", cards: [
      { title: "Shelf Geometry", description: "3D bounding boxes and structural models for shelving units, pallet racks, and storage systems. Includes bay/level decomposition for inventory location mapping.", icon: "📐" },
      { title: "Pallet Detection", description: "3D bounding boxes for pallets at all rack levels with occupancy labels (empty/partial/full). Enables automated inventory monitoring from LiDAR scans.", icon: "📦" },
      { title: "Navigable Path Labels", description: "Floor regions labeled as navigable aisle, cross-aisle, staging area, restricted zone, and loading dock. Provides the traversability ground truth for path planning.", icon: "🗺️" },
      { title: "Dynamic Object Tracking", description: "3D boxes with track IDs for forklifts, workers, carts, and other moving objects. Velocity vectors and trajectory segments for motion prediction training.", icon: "🚶" }
    ]},
    { type: "comparison-table", heading: "Comparison with Public Indoor LiDAR Datasets", columns: ["Dataset","Scans","Facilities","Focus","Annotations"], rows: [
      { Dataset: "ScanNet", Scans: "1.5K rooms", Facilities: "707 rooms", Focus: "Residential", Annotations: "Semantic, instance" },
      { Dataset: "Matterport3D", Scans: "10.8K views", Facilities: "90 buildings", Focus: "Residential/commercial", Annotations: "Semantic" },
      { Dataset: "Claru Warehouse LiDAR", Scans: "45K+", Facilities: "20+", Focus: "Warehouse/logistics", Annotations: "Shelves, pallets, paths, dynamics" }
    ]},
    { type: "prose", heading: "Use Cases and Model Training", paragraphs: [
      "AMR navigation systems train on the annotated warehouse LiDAR to build 3D occupancy maps, identify navigable paths, detect dynamic obstacles, and plan collision-free trajectories through dense warehouse aisles. The diversity of facility layouts ensures navigation policies generalize across different racking configurations and aisle widths.",
      "Inventory monitoring systems use the shelf geometry and pallet detection annotations to train models that automatically assess inventory levels from mobile robot LiDAR scans. These systems need to detect pallets at multiple rack heights, estimate fill levels, and identify empty locations — capabilities that require training data from real warehouse environments with authentic pallet arrangements.",
      "Safety systems for autonomous forklifts train on the dynamic object tracking data to detect and predict the movements of workers, manual forklifts, and carts sharing warehouse aisles. The real-world dynamic obstacle data captures the unpredictable movement patterns of human workers that simulation cannot faithfully reproduce."
    ]}
  ],
  faqs: [
    { question: "What types of warehouse facilities are included?", answer: "The dataset covers distribution centers, e-commerce fulfillment centers, cold storage facilities, retail backrooms, and manufacturing warehouses across 20+ facilities. Racking systems include selective, drive-in, push-back, and carton flow configurations with aisle widths from 8 to 14 feet." },
    { question: "Are dynamic obstacles captured during collection?", answer: "Yes. Collection occurs during normal warehouse operations, capturing real forklifts, workers, carts, and other dynamic obstacles with natural movement patterns. Multiple passes at different times provide varying occupancy and activity levels." },
    { question: "Can the data be used for SLAM and mapping?", answer: "Yes. Raw LiDAR sequences with GPS/IMU are provided for SLAM research. Pre-built facility maps are also available for teams focused on navigation and perception rather than mapping. Point cloud data is delivered in standard formats including PCD, LAS, and custom HDF5 packaging." }
  ],
  ctaHeading: "Request a Warehouse LiDAR Sample Pack",
  ctaDescription: "Get sample warehouse LiDAR scans with full annotations for your AMR navigation or inventory automation project.",
  relatedGlossaryTerms: ["lidar","point-cloud","3d-object-detection","autonomous-mobile-robot"],
  relatedGuidePages: [],
  relatedSolutionSlugs: [],
  datasetProfile: { modalities: ["lidar","rgb"], totalClips: "45,000+", totalHours: "300+", annotationLayers: ["Shelf geometry","Pallet detection","Navigable path labels","Dynamic object tracking","Floor type classification","Aisle width measurements"], formats: ["PCD","LAS","HDF5","ROS bags"], resolution: "128-channel LiDAR", fps: "10-20 Hz" },
  comparisonWithPublic: [
    { name: "ScanNet", clips: "1,513 rooms", hours: "N/A", modalities: "RGB-D", environments: "707 residential rooms", annotations: "Semantic, instance segmentation" },
    { name: "Matterport3D", clips: "10.8K panoramas", hours: "N/A", modalities: "RGB-D", environments: "90 buildings", annotations: "Semantic segmentation" }
  ],
  useCases: [
    { modelType: "AMR Navigation", description: "Warehouse LiDAR trains mobile robot navigation systems to build maps, plan paths, and avoid obstacles in dense logistics environments.", exampleModels: ["PointPillars","VoxelNet","BEVFusion"] },
    { modelType: "Inventory Monitoring", description: "Shelf and pallet annotations train automated inventory assessment systems that detect stock levels from mobile robot LiDAR scans.", exampleModels: ["PointNet++","Cylinder3D"] },
    { modelType: "Safety Systems", description: "Dynamic object tracking data trains safety systems that detect and predict worker and forklift movements for collision avoidance.", exampleModels: ["CenterPoint","PointTrack"] }
  ],
  keyPapers: [
    { id: "dai-scannet-2017", title: "ScanNet: Richly-annotated 3D Reconstructions of Indoor Scenes", authors: "Dai et al.", venue: "CVPR 2017", year: 2017, url: "https://arxiv.org/abs/1702.04405" },
    { id: "qi-pointnet2-2017", title: "PointNet++: Deep Hierarchical Feature Learning on Point Sets in a Metric Space", authors: "Qi et al.", venue: "NeurIPS 2017", year: 2017, url: "https://arxiv.org/abs/1706.02413" },
    { id: "yin-centerpoint-2021", title: "Center-Based 3D Object Detection and Tracking", authors: "Yin et al.", venue: "CVPR 2021", year: 2021, url: "https://arxiv.org/abs/2006.11275" }
  ],
  claruRelevance: "Claru partners with warehouse operators to capture LiDAR data in real logistics facilities during normal operations. Unlike lab-based mock warehouses, Claru's data includes authentic racking configurations, real inventory patterns, and genuine dynamic obstacles. Data is delivered with multi-layer 3D annotations ready for training AMR perception and navigation systems."
};
export default data;
