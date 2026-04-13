import type { FormatPageData } from "./types";

const data: FormatPageData = {
  "slug": "nuscenes-format",
  "metaTitle": "nuScenes Format for Robotics Data | Claru",
  "metaDescription": "The nuScenes format is the de facto standard for autonomous driving datasets. Learn its schema, annotation structure, and how Claru delivers compatible data.",
  "primaryKeyword": "nuScenes format robotics",
  "secondaryKeywords": [
    "nuScenes format robotics data",
    "nuScenes robotics training data",
    "nuScenes robotics dataset format",
    "nuscenes-format robot data",
    "nuScenes relational schema",
    "nuScenes devkit",
    "autonomous driving dataset format"
  ],
  "canonicalPath": "/formats/nuscenes-format",
  "h1": "nuScenes Format: Complete Guide for Robotics Data",
  "heroSubtitle": "The nuScenes format is the de facto standard for autonomous driving datasets. Learn its schema, annotation structure, and how Claru delivers compatible data.",
  "breadcrumbs": [
    {
      "label": "Home",
      "href": "/"
    },
    {
      "label": "Formats",
      "href": "/formats"
    },
    {
      "label": "nuScenes Format",
      "href": "/formats/nuscenes-format"
    }
  ],
  "sections": [
    {
      "type": "prose",
      "heading": "Schema and Structure",
      "paragraphs": [
        "nuScenes uses a relational database schema stored as JSON files, designed by Motional (formerly nuTonomy) for their 2019 autonomous driving benchmark. The schema consists of interconnected tables: scene.json (20-second driving segments), sample.json (keyframes at 2 Hz), sample_data.json (all sensor data at native rates, including non-keyframe sweeps), ego_pose.json (vehicle pose at every sample_data timestamp), calibrated_sensor.json (per-sensor intrinsics and extrinsics), sensor.json (sensor metadata), instance.json (unique object instances tracked across time), sample_annotation.json (per-keyframe 3D bounding boxes), and category.json (object class taxonomy with 23 classes). Every record has a unique 32-character hexadecimal token, and records reference each other via these tokens, creating a fully linked relational graph.",
        "The linking structure enables powerful temporal queries. Each sample has prev and next tokens pointing to adjacent keyframes, enabling trajectory extraction. Each sample_annotation has prev and next tokens linking the same object instance across time, enabling per-object tracking without a separate tracking file. The sample_data table links to the physical sensor files (images, LiDAR point clouds stored as .pcd.bin) and includes is_key_frame flag to distinguish 2 Hz keyframes from intermediate sweeps (12 Hz for cameras, 20 Hz for LiDAR). This means a single nuScenes sample aggregates data from 6 cameras, 1 LiDAR, and 5 radars at a given timestamp, with each sensor's data accessible through sample_data tokens.",
        "Annotations in nuScenes encode 3D bounding boxes as center position (x, y, z) in the global coordinate frame, size (width, length, height) in meters, and orientation as a quaternion (w, x, y, z). Each annotation carries a visibility level (1-4 from 0-40% visible to 80-100% visible), an attribute token linking to descriptive attributes (e.g., vehicle.moving, pedestrian.sitting, cycle.with_rider), and instance and category tokens for tracking identity and class. The global coordinate frame convention means that annotations do not need to be re-projected per camera, as the ego_pose and calibrated_sensor tables provide the transformations needed to project any annotation into any sensor's coordinate frame."
      ]
    },
    {
      "type": "cards",
      "heading": "Frameworks and Models Using nuScenes Format",
      "cards": [
        {
          "title": "nuScenes-devkit",
          "description": "Official Python SDK for loading, querying, rendering, and evaluating nuScenes data, with built-in visualization tools for camera, LiDAR, and radar data."
        },
        {
          "title": "MMDetection3D",
          "description": "OpenMMLab's 3D detection framework with native nuScenes data loaders supporting BEVFusion, FCOS3D, DETR3D, and 15+ architectures."
        },
        {
          "title": "OpenPCDet",
          "description": "Point cloud detection framework supporting nuScenes format alongside KITTI, with CenterPoint and TransFusion models."
        },
        {
          "title": "BEVFormer / BEVFusion",
          "description": "Bird's-eye-view perception models that fuse multi-camera and LiDAR data, using nuScenes as their primary benchmark."
        },
        {
          "title": "UniAD",
          "description": "Unified Autonomous Driving framework performing detection, tracking, motion prediction, and planning on nuScenes data."
        },
        {
          "title": "StreamPETR / SparseDrive",
          "description": "Temporal 3D perception models that exploit nuScenes' linked sample structure for multi-frame feature aggregation."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Reading and Writing nuScenes Format Data in Python",
      "paragraphs": [
        "The nuscenes-devkit (pip install nuscenes-devkit) provides the NuScenes class as the primary data access interface. Initialization with nusc = NuScenes(version='v1.0-trainval', dataroot='/data/nuscenes') loads all JSON tables into memory and builds an index for token-based lookups. Accessing a scene's data follows the relational chain: get a scene token, then iterate samples via sample['next'] tokens, get sample_data for each sensor, and load the actual file with nusc.get_sample_data(sd_token). The devkit provides render methods: nusc.render_sample(sample_token) overlays 3D boxes on all camera views, and nusc.render_pointcloud_in_image(sample_token, camera_channel='CAM_FRONT') projects LiDAR points onto camera images.",
        "Creating a nuScenes-compatible dataset requires building all relational JSON tables with consistent token references. Each table entry needs a unique 32-character hex token (generated with uuid.uuid4().hex), and all foreign key references must be valid. The minimum viable dataset requires: sensor.json (defining your sensor configuration), calibrated_sensor.json (intrinsics and extrinsics per sensor), ego_pose.json (vehicle pose per frame), sample.json (keyframes), sample_data.json (linking keyframes to sensor files), and optionally sample_annotation.json, instance.json, and category.json for annotations. The nuScenes devkit validates token consistency on load and will raise errors for dangling references.",
        "For large-scale dataset creation, the nuScenes team recommends generating JSON tables programmatically from a structured pipeline. The ego_pose entries must be synchronized with sensor timestamps (within 50ms tolerance for keyframe association), and calibrated_sensor extrinsics must be expressed as translation (x, y, z in meters) and rotation (quaternion w, x, y, z) from the sensor frame to the ego vehicle frame. LiDAR point clouds are stored as .pcd.bin files containing (x, y, z, intensity, ring_index) as 5 float32 values per point, while images are standard JPEG files. The devkit's splits.json defines train/val/test scene assignments."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "When to Use nuScenes Format vs Alternatives",
      "description": "nuScenes is the richest format for multi-sensor temporal driving data, but simpler formats may suffice for some applications.",
      "columns": [
        "Format",
        "Best For",
        "Temporal Linking",
        "Sensor Fusion",
        "Complexity"
      ],
      "rows": [
        {
          "Format": "nuScenes",
          "Best For": "Multi-sensor driving with tracking",
          "Temporal Linking": "Native (token chains)",
          "Sensor Fusion": "6 cameras + LiDAR + radar",
          "Complexity": "High (relational schema)"
        },
        {
          "Format": "KITTI",
          "Best For": "Single-frame 3D detection",
          "Temporal Linking": "Sequential indices only",
          "Sensor Fusion": "Stereo + LiDAR",
          "Complexity": "Low (flat files)"
        },
        {
          "Format": "Waymo Open",
          "Best For": "Large-scale diverse driving",
          "Temporal Linking": "Native (segments)",
          "Sensor Fusion": "5 cameras + 5 LiDARs",
          "Complexity": "High (protobuf)"
        },
        {
          "Format": "Argoverse 2",
          "Best For": "HD maps + 3D detection + forecasting",
          "Temporal Linking": "Native (sequences)",
          "Sensor Fusion": "7 cameras + 2 LiDARs",
          "Complexity": "Moderate (Feather/Parquet)"
        },
        {
          "Format": "ONCE",
          "Best For": "Semi-supervised 3D detection",
          "Temporal Linking": "Sequence-based",
          "Sensor Fusion": "Camera + LiDAR",
          "Complexity": "Low-Moderate"
        }
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Converting from Other Formats",
      "columns": [
        "Source Format",
        "Tool / Library",
        "Complexity",
        "Notes"
      ],
      "rows": [
        {
          "Source Format": "KITTI",
          "Tool / Library": "nuscenes-devkit converters",
          "Complexity": "moderate",
          "Notes": "Map KITTI's file-based structure to nuScenes relational schema; requires synthesizing ego_pose and instance tokens."
        },
        {
          "Source Format": "ROS bag (multi-sensor)",
          "Tool / Library": "Custom Python pipeline",
          "Complexity": "complex",
          "Notes": "Extract all sensor topics, compute ego poses from odometry/SLAM, build complete relational tables with token references."
        },
        {
          "Source Format": "Waymo Open",
          "Tool / Library": "Custom Python (waymo SDK + nuscenes writer)",
          "Complexity": "complex",
          "Notes": "Map Waymo's protobuf segments to nuScenes scenes; transform coordinate frames and annotation conventions."
        },
        {
          "Source Format": "Custom sensor logs",
          "Tool / Library": "Custom Python",
          "Complexity": "complex",
          "Notes": "Requires building the full relational schema from raw timestamps, calibration files, and pose logs."
        },
        {
          "Source Format": "Argoverse 2",
          "Tool / Library": "Custom Python (av2 SDK + nuscenes writer)",
          "Complexity": "moderate",
          "Notes": "Map AV2 sequence structure to nuScenes scene/sample/sample_data hierarchy with coordinate transforms."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "nuScenes Format Beyond Autonomous Driving",
      "paragraphs": [
        "While nuScenes was designed for outdoor autonomous driving, its relational schema is general enough for any multi-sensor robotics application. Several indoor robotics teams have adapted nuScenes format for warehouse navigation, using the same scene/sample/ego_pose structure to represent robot trajectories through shelving aisles with multi-camera and LiDAR perception. The format's native support for arbitrary sensor configurations (defined in sensor.json and calibrated_sensor.json) means any combination of cameras, depth sensors, LiDAR, radar, and IMU can be represented without schema changes.",
        "The nuScenes detection metrics (NDS, mAP, mATE, mASE, mAOE, mAVE, mAAE) have become the standard evaluation protocol for 3D object detection. The nuScenes Detection Score (NDS) is a composite metric combining mean Average Precision (mAP) with five True Positive metrics measuring translation error (ATE), scale error (ASE), orientation error (AOE), velocity error (AVE), and attribute error (AAE). This multi-dimensional evaluation captures aspects of detection quality that single-metric evaluations miss, particularly velocity estimation accuracy which is critical for motion planning. The nuScenes tracking metrics (AMOTA, AMOTP) similarly extend CLEAR MOT metrics for 3D multi-object tracking evaluation.",
        "The nuScenes ecosystem continues to expand with derivative datasets and benchmarks: nuScenes-lidarseg (per-point LiDAR semantic segmentation with 32 classes), nuScenes-panoptic (combined LiDAR semantic and instance segmentation), nuScenes prediction (agent motion forecasting from 2-second history to 6-second future), and nuPlan (a large-scale planning benchmark). All use the same relational schema with task-specific annotation extensions, demonstrating the format's extensibility. For robotics teams building multi-task perception systems, this unified format means a single data pipeline serves detection, segmentation, tracking, and prediction models."
      ]
    },
    {
      "type": "citation-list",
      "heading": "References",
      "citations": [
        {
          "id": "caesar-nuscenes-2020",
          "title": "nuScenes: A Multimodal Dataset for Autonomous Driving",
          "authors": "Caesar et al.",
          "venue": "CVPR 2020",
          "year": 2020,
          "url": "https://arxiv.org/abs/1903.11027"
        },
        {
          "id": "fong-panoptic-2022",
          "title": "Panoptic nuScenes: A Large-Scale Benchmark for LiDAR Panoptic Segmentation",
          "authors": "Fong et al.",
          "venue": "RA-L 2022",
          "year": 2022,
          "url": "https://arxiv.org/abs/2109.03805"
        },
        {
          "id": "liu-bevfusion-2023",
          "title": "BEVFusion: Multi-Task Multi-Sensor Fusion with Unified Bird's-Eye View Representation",
          "authors": "Liu et al.",
          "venue": "ICRA 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2205.13542"
        },
        {
          "id": "hu-uniad-2023",
          "title": "Planning-oriented Autonomous Driving",
          "authors": "Hu et al.",
          "venue": "CVPR 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2212.10156"
        },
        {
          "id": "caesar-nuplan-2022",
          "title": "nuPlan: A closed-loop ML-based planning benchmark for autonomous vehicles",
          "authors": "Caesar et al.",
          "venue": "CVPR 2022 Workshop",
          "year": 2022,
          "url": "https://arxiv.org/abs/2106.11810"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Claru Data Delivery in nuScenes Format",
      "paragraphs": [
        "Claru delivers multi-sensor driving data in nuScenes format with the complete relational schema: scene, sample, sample_data, ego_pose, calibrated_sensor, instance, sample_annotation, and category tables with consistent 32-character hex tokens. Ego poses are computed from high-precision GNSS/INS systems or LiDAR-based SLAM, achieving centimeter-level accuracy. Camera and LiDAR calibration is performed using multi-target calibration procedures with sub-pixel reprojection error.",
        "Every delivery is validated by loading through the nuScenes-devkit and running the built-in integrity checks (token consistency, temporal ordering, calibration validity). For teams running BEV perception models (BEVFormer, BEVFusion, StreamPETR), we ensure proper camera extrinsic conventions and provide pre-computed coordinate transformation matrices. Large deliveries follow the nuScenes sharding convention with version-tagged directories and splits.json defining scene assignments. Custom sensor configurations (e.g., 8-camera surround view, dual LiDAR, radar arrays) are fully supported through the sensor.json and calibrated_sensor.json tables."
      ]
    }
  ],
  "faqs": [
    {
      "question": "What sensor configurations does nuScenes format support?",
      "answer": "The format supports arbitrary sensor configurations through its relational sensor and calibrated_sensor tables. Any combination of cameras (any resolution, FOV, frame rate), LiDAR (any number of units, any beam count), radar (any configuration), and IMU can be represented. Each sensor gets a unique token, and calibrated_sensor entries store per-sensor intrinsics (camera matrix for cameras, empty for LiDAR/radar) and extrinsics (translation + quaternion rotation from sensor to ego frame). The original nuScenes uses 6 cameras, 1 LiDAR, and 5 radars, but custom datasets can define any configuration."
    },
    {
      "question": "Is nuScenes format only for autonomous driving?",
      "answer": "While designed for driving, the relational schema is fully general for any multi-sensor robotics application. Teams have adapted it for warehouse navigation robots (using the same scene/sample/ego_pose structure for indoor trajectories), agricultural vehicles (with crop-specific category taxonomies), and construction site monitoring (with heavy equipment tracking). The key advantage over simpler formats is native support for multi-sensor temporal data with tracked object instances, which is valuable in any multi-sensor perception system regardless of domain."
    },
    {
      "question": "How large are typical nuScenes-format datasets?",
      "answer": "The original nuScenes dataset is approximately 350 GB for the full trainval split (1000 scenes, 40K keyframes). Storage scales roughly linearly with scene count and sensor configuration: each 20-second scene with 6 cameras at 12 Hz, LiDAR at 20 Hz, and 5 radars at 13 Hz produces about 350 MB of sensor data. Claru's driving datasets in nuScenes format range from 100 GB (small focused datasets) to several TB (city-scale collections). For teams with storage constraints, the format supports partial loading (specific scenes or sensors only) through the relational structure."
    },
    {
      "question": "How does nuScenes format handle LiDAR point clouds?",
      "answer": "LiDAR data is stored as .pcd.bin files containing 5 float32 values per point: x, y, z (in the LiDAR sensor coordinate frame), intensity (reflectance), and ring_index (laser beam number). Points are stored as a flat binary array, loaded with np.fromfile(path, dtype=np.float32).reshape(-1, 5). To transform points to the ego frame, apply the calibrated_sensor extrinsic transform. To project to the global frame, additionally apply the ego_pose transform. Multi-sweep accumulation (combining multiple LiDAR rotations for denser point clouds) uses the ego_pose and sample_data timestamps to align sweeps."
    },
    {
      "question": "What evaluation metrics does nuScenes define?",
      "answer": "nuScenes defines the nuScenes Detection Score (NDS), a composite metric combining mean Average Precision (mAP at IoU thresholds 0.5, 1, 2, 4 meters center distance) with five True Positive metrics: mean Average Translation Error (mATE), mean Average Scale Error (mASE), mean Average Orientation Error (mAOE), mean Average Velocity Error (mAVE), and mean Average Attribute Error (mAAE). NDS = (1/10) * [5*mAP + sum(1-min(1, metric) for metric in TP_metrics)]. For tracking, nuScenes uses AMOTA (Average Multi-Object Tracking Accuracy) and AMOTP (Average Multi-Object Tracking Precision). All metrics are computed by the nuscenes-devkit evaluation module."
    }
  ],
  "ctaHeading": "Get Data in nuScenes Format",
  "ctaDescription": "Claru delivers multi-sensor robotics data in nuScenes format with complete relational schema, precise calibration, and devkit-validated annotations. Tell us your requirements.",
  "relatedGlossaryTerms": [
    "rlds",
    "cross-embodiment-data",
    "data-enrichment"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "fileExtensions": [
    ".json",
    ".pcd.bin",
    ".jpg"
  ],
  "schemaDescription": "nuScenes uses a relational database schema stored as JSON files with 32-character hex token references: scene.json (20s segments), sample.json (2 Hz keyframes), sample_data.json (all sensor data at native rates), ego_pose.json (vehicle position/orientation as translation + quaternion), calibrated_sensor.json (per-sensor intrinsics and extrinsics), sample_annotation.json (3D bounding boxes as center + size + quaternion in global frame with visibility, attributes, and instance tracking tokens). Sensor data (images as JPEG, LiDAR as .pcd.bin with x/y/z/intensity/ring) is stored as files referenced by sample_data tokens.",
  "frameworksUsing": [
    {
      "name": "nuScenes-devkit",
      "description": "Official Python SDK for loading, querying, rendering, and evaluating nuScenes data with built-in visualization.",
      "url": "https://github.com/nutonomy/nuscenes-devkit"
    },
    {
      "name": "MMDetection3D",
      "description": "OpenMMLab's 3D detection framework with native nuScenes loaders supporting BEVFusion, FCOS3D, DETR3D, and 15+ architectures.",
      "url": "https://github.com/open-mmlab/mmdetection3d"
    },
    {
      "name": "OpenPCDet",
      "description": "Point cloud detection framework supporting nuScenes format with CenterPoint and TransFusion models.",
      "url": "https://github.com/open-mmlab/OpenPCDet"
    },
    {
      "name": "BEVFormer / BEVFusion",
      "description": "Bird's-eye-view perception models fusing multi-camera and LiDAR data on nuScenes benchmark."
    },
    {
      "name": "UniAD",
      "description": "Unified Autonomous Driving framework for detection, tracking, motion prediction, and planning on nuScenes."
    },
    {
      "name": "StreamPETR",
      "description": "Temporal 3D perception model exploiting nuScenes' linked sample structure for multi-frame feature aggregation."
    }
  ],
  "conversions": [
    {
      "sourceFormat": "KITTI",
      "toolOrLibrary": "nuscenes-devkit converters",
      "complexity": "moderate",
      "notes": "Map KITTI file structure to nuScenes relational schema; requires synthesizing ego_pose and instance tokens."
    },
    {
      "sourceFormat": "ROS bag (multi-sensor)",
      "toolOrLibrary": "Custom Python pipeline",
      "complexity": "complex",
      "notes": "Extract all sensor topics, compute ego poses from odometry/SLAM, build relational tables with token references."
    },
    {
      "sourceFormat": "Waymo Open",
      "toolOrLibrary": "Custom Python (waymo SDK)",
      "complexity": "complex",
      "notes": "Map Waymo protobuf segments to nuScenes scenes; transform coordinate frames and annotation conventions."
    },
    {
      "sourceFormat": "Custom sensor logs",
      "toolOrLibrary": "Custom Python",
      "complexity": "complex",
      "notes": "Build full relational schema from raw sensor timestamps, calibration files, and pose logs."
    },
    {
      "sourceFormat": "Argoverse 2",
      "toolOrLibrary": "Custom Python (av2 SDK)",
      "complexity": "moderate",
      "notes": "Map AV2 sequence structure to nuScenes scene/sample/sample_data hierarchy with coordinate transforms."
    }
  ],
  "keyPapers": [
    {
      "id": "caesar-nuscenes-2020",
      "title": "nuScenes: A Multimodal Dataset for Autonomous Driving",
      "authors": "Caesar et al.",
      "venue": "CVPR 2020",
      "year": 2020,
      "url": "https://arxiv.org/abs/1903.11027"
    },
    {
      "id": "fong-panoptic-2022",
      "title": "Panoptic nuScenes: A Large-Scale Benchmark for LiDAR Panoptic Segmentation",
      "authors": "Fong et al.",
      "venue": "RA-L 2022",
      "year": 2022,
      "url": "https://arxiv.org/abs/2109.03805"
    },
    {
      "id": "liu-bevfusion-2023",
      "title": "BEVFusion: Multi-Task Multi-Sensor Fusion with Unified Bird's-Eye View Representation",
      "authors": "Liu et al.",
      "venue": "ICRA 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2205.13542"
    },
    {
      "id": "hu-uniad-2023",
      "title": "Planning-oriented Autonomous Driving",
      "authors": "Hu et al.",
      "venue": "CVPR 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2212.10156"
    },
    {
      "id": "caesar-nuplan-2022",
      "title": "nuPlan: A closed-loop ML-based planning benchmark for autonomous vehicles",
      "authors": "Caesar et al.",
      "venue": "CVPR 2022 Workshop",
      "year": 2022,
      "url": "https://arxiv.org/abs/2106.11810"
    }
  ],
  "claruDelivery": "Claru delivers multi-sensor data in nuScenes format with complete relational schema, precise ego poses from GNSS/INS or LiDAR SLAM, and sub-pixel camera-LiDAR calibration. Every delivery passes nuScenes-devkit integrity checks and includes custom sensor configurations, version-tagged directories, and splits.json for train/val/test assignment."
};

export default data;
