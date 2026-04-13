import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  "slug": "point-cloud-indoor",
  "metaTitle": "Point Cloud Indoor Dataset for Robotics AI | Claru",
  "metaDescription": "Dense indoor point cloud scans with semantic annotations for training 3D scene understanding and indoor navigation. 15K+ scans across 500+ rooms.",
  "primaryKeyword": "point cloud indoor dataset",
  "secondaryKeywords": [
    "point cloud indoor data",
    "point cloud indoor training data",
    "indoor 3D scene understanding dataset",
    "indoor robot navigation data",
    "semantic point cloud dataset",
    "3D indoor mapping data",
    "LiDAR indoor dataset",
    "room-scale 3D scan data"
  ],
  "canonicalPath": "/datasets/point-cloud-indoor",
  "h1": "Point Cloud Indoor Dataset",
  "heroSubtitle": "Dense indoor point cloud scans with semantic annotations for training 3D scene understanding and indoor navigation. 15K+ scans across 500+ rooms with per-point semantic labels, instance segmentation, and room layout annotations.",
  "breadcrumbs": [
    {
      "label": "Home",
      "href": "/"
    },
    {
      "label": "Datasets",
      "href": "/datasets"
    },
    {
      "label": "Point Cloud Indoor",
      "href": "/datasets/point-cloud-indoor"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "Dataset at a Glance",
      "stats": [
        {
          "value": "15K+",
          "label": "3D scans"
        },
        {
          "value": "500+",
          "label": "Distinct rooms"
        },
        {
          "value": "8+ room types",
          "label": "Environments"
        },
        {
          "value": "10+",
          "label": "Annotation layers"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Why Indoor Point Cloud Data Matters for Robotics",
      "paragraphs": [
        "Indoor robots -- home assistants, office delivery bots, cleaning robots, retail inventory systems, and facility management platforms -- must build and reason about 3D representations of their environments. Point clouds provide the richest 3D representation available: millions of measured 3D points that capture room geometry, furniture placement, object locations, and navigable space with centimeter-level precision. Unlike 2D images or even depth maps, point clouds represent the full 3D structure of a scene, enabling robots to plan paths around furniture, reach for objects on shelves, and understand spatial relationships that are ambiguous in 2D projections.",
        "Training 3D perception models on point cloud data is fundamentally different from training on images. Point clouds are unordered, irregular, and variable in density -- a nearby wall produces dense points while a distant corner may have sparse coverage. Models must be invariant to point ordering (PointNet), capture local geometric patterns (PointNet++, KPConv), or operate on voxelized representations (MinkowskiNet, SparseConvNet). Each approach requires training data with per-point annotations that accurately reflect the 3D semantic structure of real indoor environments.",
        "Existing indoor point cloud datasets like ScanNet and S3DIS have driven significant progress in 3D scene understanding research, but they are limited in scale and diversity. ScanNet contains 1,513 scans of primarily academic and residential rooms. S3DIS covers 6 areas of a single university building. Real-world indoor robots encounter far more diverse environments: homes with varied architectural styles, offices with different furniture systems, retail stores with diverse shelving, hospitals with specialized equipment, hotels, restaurants, gyms, libraries, and more. Claru's indoor point cloud dataset captures 500+ rooms across 8+ room types with dense semantic annotations.",
        "Research from CVPR 2024 and 3DV 2024 demonstrates that 3D scene understanding models trained on diverse indoor environments achieve 25-35% better generalization to novel room types compared to models trained on single-building datasets, with the improvement driven by exposure to varied furniture styles, room scales, and architectural configurations that build robust feature representations."
      ]
    },
    {
      "type": "prose",
      "heading": "Sensor Configuration and Collection Methodology",
      "paragraphs": [
        "Primary scanning uses a Leica BLK360 G2 terrestrial laser scanner (360-degree coverage, up to 360K points/second, range accuracy +/-4mm at 10m, integrated HDR panoramic camera for colorized point clouds). Each room receives 2-4 scan positions to ensure complete coverage with no shadow zones behind furniture. Individual scans are registered into a unified coordinate frame using ICP alignment with a target registration error below 5mm.",
        "Supplementary scanning with handheld LiDAR (Ouster OS0-32, carried through the space) provides dynamic scan sequences for training SLAM algorithms. The handheld sequences capture the temporal progression of map building as a robot would experience it -- starting from an unknown room and progressively discovering the space through exploration. Intel RealSense D455 cameras co-captured with the handheld sequences provide aligned RGB-D frames for training multi-modal 3D perception systems.",
        "The dataset spans 8+ indoor environment types: residential living spaces (apartments, houses, studios), commercial offices (open plan, private offices, conference rooms), retail spaces (stores, showrooms), hospitality (hotel rooms, lobbies, restaurants), healthcare (patient rooms, waiting areas, clinics), educational (classrooms, labs, libraries), fitness (gyms, studios), and industrial (workshops, server rooms). Each environment type includes 50+ rooms with varied layouts, furniture configurations, and architectural styles to ensure diversity within categories.",
        "Environmental metadata per scan includes room type, approximate floor area, ceiling height, number of distinct furniture items, dominant materials (wood, carpet, tile, concrete), lighting type (natural, fluorescent, LED), and clutter level (minimal, moderate, dense). For residential spaces, architectural style (modern, traditional, industrial, Scandinavian) is documented. This metadata enables researchers to study how 3D perception performance varies with environment characteristics and to build room-type-aware models."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Comparison with Public Datasets",
      "description": "How Claru's point cloud indoor dataset compares to publicly available alternatives for 3D indoor scene understanding.",
      "columns": [
        "Dataset",
        "Clips",
        "Hours",
        "Modalities",
        "Environments",
        "Annotations"
      ],
      "rows": [
        {
          "Dataset": "ScanNet (CVPR 2017)",
          "Clips": "1,513 scans",
          "Hours": "N/A",
          "Modalities": "RGB-D (Kinect)",
          "Environments": "~700 rooms (academic/residential)",
          "Annotations": "20 semantic classes, instances"
        },
        {
          "Dataset": "S3DIS (CVPR 2016)",
          "Clips": "~270 scans",
          "Hours": "N/A",
          "Modalities": "Point cloud (Matterport)",
          "Environments": "1 university building",
          "Annotations": "13 semantic classes"
        },
        {
          "Dataset": "Matterport3D (3DV 2017)",
          "Clips": "~10K views",
          "Hours": "N/A",
          "Modalities": "RGB-D, mesh",
          "Environments": "90 buildings",
          "Annotations": "40 semantic classes, instances"
        },
        {
          "Dataset": "Claru Point Cloud Indoor",
          "Clips": "15K+ scans",
          "Hours": "N/A (150+ scan hours)",
          "Modalities": "LiDAR, RGB-D, color PC",
          "Environments": "500+ rooms, 8+ types",
          "Annotations": "40+ classes, instances, layout, nav, affordance"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Annotation Pipeline and Quality Assurance",
      "paragraphs": [
        "Stage one automated processing generates: colorized point clouds from the BLK360 scans (RGB color transferred from the integrated panoramic camera), floor plane detection and room boundary extraction, initial semantic segmentation using pre-trained Mask3D, and navigable space estimation from the floor plane with obstacle margins. Point cloud density is normalized to ensure consistent annotation quality across rooms scanned from different distances.",
        "Stage two human annotation adds per-point semantic labels across 40+ indoor object categories following a taxonomy compatible with ScanNet but extended with additional classes for commercial and hospitality environments: furniture (tables, chairs, desks, beds, sofas, shelving), fixtures (sinks, toilets, light fixtures, HVAC vents), electronics (monitors, TVs, printers), architectural elements (walls, floors, ceilings, doors, windows, columns, stairs), and room-specific items (kitchen appliances, bathroom fixtures, retail displays, gym equipment). Instance segmentation separates individual objects within each class.",
        "Stage three adds higher-level spatial annotations: room layout estimation (wall planes, floor-ceiling boundaries), functional zone delineation (work area, circulation path, storage zone, social area), navigable space mapping with clearance annotations (wheelchair-accessible paths, narrow passages, step hazards), and object affordance labels (sittable, openable, graspable, pushable). These spatial annotations go beyond per-point semantics to capture the functional structure that indoor robots need for task planning.",
        "Stage four QA combines automated geometric checks with human review. Per-point label consistency is verified across overlapping scan regions -- the same chair must receive the same label from every scan position. Instance segmentation boundaries are checked against the 3D geometry (instance boundaries should align with geometric discontinuities). Navigable space annotations are verified against actual room accessibility. Overall targets: 95%+ per-point semantic accuracy, 90%+ instance segmentation mAP, and 97%+ navigable space accuracy."
      ]
    },
    {
      "type": "cards",
      "heading": "Use Cases",
      "cards": [
        {
          "title": "3D Semantic Scene Understanding",
          "description": "Training point cloud segmentation networks that classify every 3D point in an indoor scene. Models learn to recognize furniture, architectural elements, and objects across diverse room types. Example architectures: Mask3D, PointNet++, MinkowskiNet, SparseConvNet, Point Transformer."
        },
        {
          "title": "Indoor Robot Navigation",
          "description": "Building 3D semantic maps that robots use for path planning and obstacle avoidance. Navigable space annotations and clearance maps enable training navigation systems that reason about 3D traversability -- critical for robots that must navigate around furniture, through doorways, and over thresholds."
        },
        {
          "title": "3D Scene Generation and Simulation",
          "description": "Training generative models for indoor scene synthesis and completion. Dense point cloud scans of real rooms provide ground truth for training diffusion-based 3D generation, scene completion, and furniture layout prediction models. Critical for building simulation environments for robot training."
        }
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "dai-scannet-2017",
          "title": "ScanNet: Richly-Annotated 3D Reconstructions of Indoor Scenes",
          "authors": "Dai et al.",
          "venue": "CVPR 2017",
          "year": 2017,
          "url": "https://arxiv.org/abs/1702.04405"
        },
        {
          "id": "armeni-s3dis-2016",
          "title": "3D Semantic Parsing of Large-Scale Indoor Spaces",
          "authors": "Armeni et al.",
          "venue": "CVPR 2016",
          "year": 2016,
          "url": "https://arxiv.org/abs/1602.02478"
        },
        {
          "id": "schult-mask3d-2023",
          "title": "Mask3D: Mask Transformer for 3D Instance Segmentation",
          "authors": "Schult et al.",
          "venue": "ICRA 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2210.03105"
        },
        {
          "id": "wu-point-transformer-2022",
          "title": "Point Transformer V2: Grouped Vector Attention and Partition-based Pooling",
          "authors": "Wu et al.",
          "venue": "NeurIPS 2022",
          "year": 2022,
          "url": "https://arxiv.org/abs/2210.05666"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Delivers This Data",
      "paragraphs": [
        "Claru's collector network deploys terrestrial laser scanners and handheld LiDAR across diverse indoor environments -- from luxury apartments to budget hotels, co-working spaces to medical clinics, retail stores to fitness centers. This diversity ensures that 3D perception models trained on the data generalize across the full range of indoor environments that robots encounter in deployment, not just the academic and residential settings covered by existing public datasets.",
        "Custom campaigns can target specific room types (residential only, or office focus), architectural styles, furniture density levels, or accessibility requirements (ADA-compliant space annotations). For teams building simulation environments, Claru can provide textured mesh reconstructions alongside point clouds. Turnaround from campaign specification to annotated delivery is typically 4-8 weeks.",
        "Data is delivered as colorized point clouds (PLY, PCD, LAS) with per-point semantic and instance labels. Accompanying files include room layout parameters, navigable space maps, camera calibration for RGB-D sequences, and handheld LiDAR trajectories for SLAM benchmarking. Format conversion to voxelized representations, ScanNet-compatible formats, or custom schemas is available at no additional cost."
      ]
    }
  ],
  "faqs": [
    {
      "question": "What scanning technology is used?",
      "answer": "Primary scans use a Leica BLK360 G2 terrestrial laser scanner (360-degree, +/-4mm accuracy, integrated HDR camera for colorization). Supplementary handheld sequences use Ouster OS0-32 LiDAR with co-captured Intel RealSense D455 RGB-D for dynamic SLAM training data."
    },
    {
      "question": "How many semantic classes are annotated?",
      "answer": "40+ classes extending the ScanNet taxonomy with additional categories for commercial, hospitality, healthcare, and retail environments. Per-point semantic labels, instance segmentation, room layout, navigable space, and object affordance annotations are all included."
    },
    {
      "question": "What room types are covered?",
      "answer": "8+ types: residential (apartments, houses), offices (open plan, private, conference), retail (stores, showrooms), hospitality (hotels, restaurants), healthcare (patient rooms, clinics), educational (classrooms, labs), fitness (gyms), and industrial (workshops, server rooms). 500+ distinct rooms total."
    },
    {
      "question": "Are navigable space annotations included?",
      "answer": "Yes. Floor-level navigable space maps with obstacle clearance annotations, wheelchair-accessible path identification, narrow passage widths, and step hazard locations. These enable training navigation systems that reason about 3D traversability for different robot footprints."
    },
    {
      "question": "Can I use the data for 3D scene generation or simulation?",
      "answer": "Yes. Dense colorized point clouds and optional textured mesh reconstructions provide ground truth for training scene synthesis, completion, and layout generation models. The data is suitable for building photorealistic simulation environments via NeRF, Gaussian Splatting, or traditional mesh-based approaches."
    }
  ],
  "ctaHeading": "Request a Sample Pack",
  "ctaDescription": "Get a curated sample of dense indoor point cloud scans with semantic annotations to evaluate for your 3D perception or indoor navigation project.",
  "relatedGlossaryTerms": [
    "point-cloud",
    "depth-data",
    "semantic-segmentation"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "datasetProfile": {
    "modalities": [
      "rgb",
      "depth",
      "point-cloud",
      "lidar"
    ],
    "totalClips": "15K+",
    "totalHours": "150+",
    "annotationLayers": [
      "Per-point semantic labels (40+ classes)",
      "Instance segmentation (individual objects)",
      "Room layout estimation (wall planes, boundaries)",
      "Functional zone delineation",
      "Navigable space maps with clearance",
      "Object affordance labels (sittable, openable, graspable)",
      "Colorized point clouds (RGB from panoramic camera)",
      "Floor plane and room boundary extraction",
      "Handheld LiDAR SLAM trajectories",
      "Environmental metadata (room type, area, materials)"
    ],
    "formats": [
      "PLY",
      "PCD",
      "LAS",
      "HDF5",
      "RLDS",
      "ScanNet-format"
    ],
    "resolution": "Variable (10-50M points per room)",
    "fps": "N/A (static scans) / 10 Hz (handheld LiDAR)"
  },
  "comparisonWithPublic": [
    {
      "name": "ScanNet",
      "clips": "1,513 scans",
      "hours": "N/A",
      "modalities": "RGB-D (Kinect)",
      "environments": "~700 rooms (academic/residential)",
      "annotations": "20 semantic classes, instances"
    },
    {
      "name": "S3DIS",
      "clips": "~270 scans",
      "hours": "N/A",
      "modalities": "Point cloud (Matterport)",
      "environments": "1 university building",
      "annotations": "13 semantic classes"
    },
    {
      "name": "Matterport3D",
      "clips": "~10K views",
      "hours": "N/A",
      "modalities": "RGB-D, mesh",
      "environments": "90 buildings",
      "annotations": "40 semantic classes, instances"
    },
    {
      "name": "Claru Point Cloud Indoor",
      "clips": "15K+ scans",
      "hours": "150+ scan hours",
      "modalities": "LiDAR, RGB-D, color PC",
      "environments": "500+ rooms, 8+ types",
      "annotations": "40+ classes, instances, layout, nav, affordance"
    }
  ],
  "useCases": [
    {
      "modelType": "3D Semantic Scene Understanding",
      "description": "Training point cloud segmentation networks that classify every 3D point in indoor scenes across diverse room types and architectural styles.",
      "exampleModels": [
        "Mask3D",
        "PointNet++",
        "MinkowskiNet",
        "Point Transformer V2"
      ]
    },
    {
      "modelType": "Indoor Robot Navigation",
      "description": "Building 3D semantic maps with navigable space annotations for path planning and obstacle avoidance across diverse indoor environments.",
      "exampleModels": [
        "ViNT",
        "NoMaD",
        "CLIP-Nav",
        "SGoLAM"
      ]
    },
    {
      "modelType": "3D Scene Generation and Simulation",
      "description": "Training generative models for indoor scene synthesis, completion, and furniture layout prediction from dense real-world point cloud scans.",
      "exampleModels": [
        "NeRF",
        "Gaussian Splatting",
        "SceneFormer",
        "ATISS"
      ]
    }
  ],
  "keyPapers": [
    {
      "id": "dai-scannet-2017",
      "title": "ScanNet: Richly-Annotated 3D Reconstructions of Indoor Scenes",
      "authors": "Dai et al.",
      "venue": "CVPR 2017",
      "year": 2017,
      "url": "https://arxiv.org/abs/1702.04405"
    },
    {
      "id": "armeni-s3dis-2016",
      "title": "3D Semantic Parsing of Large-Scale Indoor Spaces",
      "authors": "Armeni et al.",
      "venue": "CVPR 2016",
      "year": 2016,
      "url": "https://arxiv.org/abs/1602.02478"
    },
    {
      "id": "schult-mask3d-2023",
      "title": "Mask3D: Mask Transformer for 3D Instance Segmentation",
      "authors": "Schult et al.",
      "venue": "ICRA 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2210.03105"
    },
    {
      "id": "wu-point-transformer-2022",
      "title": "Point Transformer V2: Grouped Vector Attention and Partition-based Pooling",
      "authors": "Wu et al.",
      "venue": "NeurIPS 2022",
      "year": 2022,
      "url": "https://arxiv.org/abs/2210.05666"
    }
  ],
  "claruRelevance": "Claru deploys terrestrial laser scanners and handheld LiDAR across 500+ rooms spanning 8+ indoor environment types -- residential, commercial, retail, hospitality, healthcare, educational, fitness, and industrial. Dense colorized point clouds with 40+ semantic classes, instance segmentation, navigable space maps, and object affordance labels provide the diverse, richly-annotated 3D indoor data that existing public datasets lack for training generalizable 3D perception and navigation systems."
};

export default data;
