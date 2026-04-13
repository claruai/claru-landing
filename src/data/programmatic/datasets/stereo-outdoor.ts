import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  "slug": "stereo-outdoor",
  "metaTitle": "Stereo Outdoor Dataset for Robotics AI | Claru",
  "metaDescription": "Calibrated stereo camera pairs from outdoor environments for training depth estimation and outdoor navigation. 40K+ clips across 15+ terrain types.",
  "primaryKeyword": "stereo outdoor dataset",
  "secondaryKeywords": [
    "stereo outdoor data",
    "stereo outdoor training data",
    "outdoor robot navigation data",
    "stereo depth estimation dataset",
    "outdoor robotics training data",
    "terrain traversability dataset",
    "field robot perception data",
    "stereo vision outdoor"
  ],
  "canonicalPath": "/datasets/stereo-outdoor",
  "h1": "Stereo Outdoor Dataset",
  "heroSubtitle": "Calibrated stereo camera pairs from outdoor environments for training depth estimation and terrain-aware navigation. 40K+ clips across 15+ terrain types with disparity maps, traversability labels, and obstacle annotations.",
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
      "label": "Stereo Outdoor",
      "href": "/datasets/stereo-outdoor"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "Dataset at a Glance",
      "stats": [
        {
          "value": "40K+",
          "label": "Stereo clip pairs"
        },
        {
          "value": "300+",
          "label": "Hours captured"
        },
        {
          "value": "15+ terrain types",
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
      "heading": "Why Stereo Outdoor Data Matters for Robotics",
      "paragraphs": [
        "Outdoor mobile robots -- delivery bots, agricultural rovers, search-and-rescue platforms, military ground vehicles, and planetary exploration rovers -- must perceive 3D terrain structure to navigate safely. Unlike indoor robots that can assume flat floors and regular geometry, outdoor robots encounter slopes, ditches, loose gravel, vegetation of varying density, water hazards, and terrain that changes dramatically with weather and season. Stereo vision provides dense, real-time depth estimation that is more reliable than monocular approaches in the textureless and repetitive environments common outdoors.",
        "Depth estimation from calibrated stereo pairs is fundamentally different from monocular depth prediction. Stereo provides metric depth (actual distances in meters) through geometric triangulation, while monocular methods produce relative depth that requires scale estimation and frequently fails on textureless surfaces, repetitive patterns (crop rows, paving stones), and at the far-range distances critical for outdoor navigation. Training stereo-specific depth networks requires calibrated stereo image pairs with precise ground-truth disparity maps -- data that single-camera datasets simply cannot provide.",
        "Existing stereo outdoor datasets like KITTI are limited to urban driving scenes from a single geographic region. They lack the terrain diversity that field robots encounter: forest trails, rocky hillsides, muddy paths, sand dunes, snow-covered ground, agricultural fields between rows, construction sites, riverbanks, and the transitional zones between terrain types that are often the most challenging for traversability estimation. Claru's stereo outdoor dataset captures 15+ terrain types across seasons and weather conditions with calibrated stereo pairs and synchronized IMU data.",
        "Research from ICRA 2024 and the Field Robotics workshop at RSS 2023 shows that stereo depth networks trained on diverse outdoor terrain data improve traversability prediction accuracy by 35-50% compared to networks trained on urban-only stereo datasets, with the improvement driven primarily by exposure to non-rigid surfaces (vegetation, mud, snow) and unstructured geometry (rock fields, root systems) absent from structured road environments."
      ]
    },
    {
      "type": "prose",
      "heading": "Sensor Configuration and Collection Methodology",
      "paragraphs": [
        "The stereo rig uses a pair of FLIR Blackfly S cameras (1280x960, global shutter, 12mm lenses) mounted on a rigid carbon-fiber baseline bar with 120mm separation, factory-calibrated for stereo rectification. Global shutter is essential for outdoor stereo -- rolling shutter causes temporal skew between scanlines that corrupts disparity computation, especially during rapid platform motion over rough terrain. Stereo images are hardware-triggered to sub-microsecond synchronization.",
        "An Xsens MTi-630 IMU (9-axis, 400Hz) is rigidly mounted to the stereo baseline bar, providing synchronized inertial data for visual-inertial odometry and motion compensation. GPS/RTK position is recorded at 10Hz for global localization, with RTK corrections providing centimeter-level accuracy when available. The complete sensor package weighs under 800g and mounts to standard robot platforms, survey poles, or chest harnesses for human-carried collection.",
        "Collection spans 15+ terrain types across multiple geographic regions and all four seasons. Terrain categories include: paved trails, gravel paths, forest floors (deciduous and coniferous), grasslands, agricultural rows, rocky hillsides, sandy beaches and dunes, muddy paths, snow-covered ground, urban sidewalks with vegetation, construction sites, riverbanks, wetlands, desert hardpack, and mixed transitional zones. Each terrain type is captured in multiple weather conditions (dry, wet, after rain, during light rain, overcast, direct sun) and times of day (morning, midday, evening) to cover the full range of lighting conditions.",
        "Environmental metadata per session includes terrain type, weather conditions, GPS track, time of day, season, recent precipitation history, vegetation state (full leaf, partial, bare), ground moisture level estimate, and notable hazards encountered (water crossings, steep slopes, loose surfaces). This metadata enables researchers to condition navigation models on environmental context and study how traversability changes with conditions."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Comparison with Public Datasets",
      "description": "How Claru's stereo outdoor dataset compares to publicly available alternatives for outdoor robot navigation.",
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
          "Dataset": "KITTI Stereo (2012)",
          "Clips": "~400 pairs",
          "Hours": "<1",
          "Modalities": "Stereo RGB, LiDAR",
          "Environments": "Urban driving (1 city)",
          "Annotations": "Sparse disparity (LiDAR)"
        },
        {
          "Dataset": "Middlebury Stereo (2014)",
          "Clips": "~33 pairs",
          "Hours": "N/A (stills)",
          "Modalities": "Stereo RGB",
          "Environments": "Indoor lab scenes",
          "Annotations": "Dense disparity (structured light)"
        },
        {
          "Dataset": "TartanAir (2020)",
          "Clips": "~1M frames",
          "Hours": "~30",
          "Modalities": "Stereo RGB (synthetic)",
          "Environments": "Simulated outdoor",
          "Annotations": "Perfect depth, flow, segmentation"
        },
        {
          "Dataset": "Claru Stereo Outdoor",
          "Clips": "40K+",
          "Hours": "300+",
          "Modalities": "Stereo RGB, IMU, GPS",
          "Environments": "15+ real terrain types",
          "Annotations": "Disparity, traversability, obstacles, terrain class, weather"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Annotation Pipeline and Quality Assurance",
      "paragraphs": [
        "Stage one automated processing generates dense disparity maps from the calibrated stereo pairs using RAFT-Stereo, with confidence-weighted filtering to suppress errors in textureless regions. Semi-global matching (SGM) provides a second disparity estimate, and pixels where RAFT-Stereo and SGM agree within 1 pixel are marked as high-confidence ground truth. IMU-integrated visual odometry provides camera pose for each frame, enabling temporal consistency checks on the depth estimates.",
        "Stage two human annotation adds semantic and traversability labels: terrain type classification per region (15+ classes including path, grass, rock, mud, water, vegetation, obstacle, structure), traversability scoring on a 5-point scale (clear, traversable, difficult, dangerous, impassable), obstacle detection and classification (static obstacles like rocks and posts, dynamic obstacles like people and animals, negative obstacles like holes and ditches), and path boundary segmentation for trail-following applications.",
        "Stage three QA combines automated geometric checks with human review. Disparity maps are validated against IMU-derived motion estimates (if the platform moved forward at known speed, the depth change between frames must be consistent). Traversability annotations are reviewed by a second annotator with field robotics experience. Agreement targets: 96%+ on terrain classification, 93%+ on traversability scoring, and 95%+ on obstacle detection. Clips with poor stereo quality (due to rain drops on lenses, extreme sun flare, or insufficient texture) are flagged with quality scores rather than discarded, enabling researchers to train robust stereo networks that handle degraded conditions.",
        "The complete annotation taxonomy covers 15+ terrain classes, 5 traversability levels, 20+ obstacle categories (static, dynamic, and negative), path boundary delineations, weather and visibility condition tags, surface roughness estimates, and slope angle derived from stereo reconstruction. This enables training navigation systems that assess terrain safety from visual appearance before committing to traverse it."
      ]
    },
    {
      "type": "cards",
      "heading": "Use Cases",
      "cards": [
        {
          "title": "Stereo Depth Estimation",
          "description": "Training learning-based stereo matching networks that provide dense, metric depth maps for outdoor environments. The diversity of terrain textures, weather conditions, and lighting in the dataset builds stereo networks robust to the challenging conditions that cause classical stereo matching to fail. Example architectures: RAFT-Stereo, CREStereo, GMStereo."
        },
        {
          "title": "Terrain-Aware Navigation",
          "description": "Training traversability estimation models that predict which terrain is safe to cross based on visual appearance and depth structure. Models learn to associate visual texture patterns with traversability -- distinguishing firm gravel from soft sand, or dense vegetation from sparse brush. Critical for field robots operating beyond paved roads."
        },
        {
          "title": "Visual-Inertial Odometry",
          "description": "Training and benchmarking VIO systems for outdoor environments using synchronized stereo and IMU data. The dataset provides GPS/RTK ground-truth trajectories for evaluating odometry drift across diverse terrain types and motion profiles."
        }
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "geiger-kitti-2012",
          "title": "Are We Ready for Autonomous Driving? The KITTI Vision Benchmark Suite",
          "authors": "Geiger et al.",
          "venue": "CVPR 2012",
          "year": 2012,
          "url": "https://arxiv.org/abs/1603.06160"
        },
        {
          "id": "lipson-raft-stereo-2021",
          "title": "RAFT-Stereo: Multilevel Recurrent Field Transforms for Stereo Matching",
          "authors": "Lipson et al.",
          "venue": "3DV 2021",
          "year": 2021,
          "url": "https://arxiv.org/abs/2109.07547"
        },
        {
          "id": "wang-tartanair-2020",
          "title": "TartanAir: A Dataset to Push the Limits of Visual SLAM",
          "authors": "Wang et al.",
          "venue": "IROS 2020",
          "year": 2020,
          "url": "https://arxiv.org/abs/2003.14338"
        },
        {
          "id": "frey-terrain-2024",
          "title": "Learning Robust Terrain Traversability from Multi-Modal Self-Supervised Data",
          "authors": "Frey et al.",
          "venue": "ICRA 2024",
          "year": 2024,
          "url": "https://arxiv.org/abs/2310.05368"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Delivers This Data",
      "paragraphs": [
        "Claru's collector network deploys calibrated stereo rigs across diverse outdoor environments -- from forest trails in the Pacific Northwest to sandy coastal paths in the Southeast, rocky alpine terrain in the Rockies, and agricultural access roads in the Midwest. This geographic diversity captures the terrain variation that outdoor robots will encounter in real deployment, not just the controlled paths used in academic field robotics experiments.",
        "Custom campaigns can target specific terrain types (agricultural, urban trails, wilderness), weather conditions (specifically rain or snow collection for degraded-condition robustness), seasons (fall leaf cover, spring mud, winter snow), or locomotion platforms (mounted on wheeled robots, legged platforms, or human-carried for different viewpoints). Turnaround is typically 4-6 weeks for standard terrain campaigns.",
        "Data is delivered with full stereo calibration parameters, pre-computed disparity maps (with confidence scores), IMU data at 400Hz, and GPS/RTK trajectories. All streams are time-synchronized to a common clock. Format options include RLDS, HDF5, WebDataset, and standard stereo dataset formats (KITTI-compatible if desired)."
      ]
    }
  ],
  "faqs": [
    {
      "question": "What stereo baseline and resolution are used?",
      "answer": "120mm baseline with FLIR Blackfly S cameras at 1280x960 resolution, global shutter, hardware-synchronized to sub-microsecond precision. This baseline provides reliable depth estimation from 1-50m, covering the range relevant for most outdoor navigation decisions."
    },
    {
      "question": "Are pre-computed disparity maps included?",
      "answer": "Yes. RAFT-Stereo disparity maps with per-pixel confidence scores are provided. High-confidence regions (where RAFT-Stereo and SGM agree) are flagged as ground-truth quality. Raw stereo pairs are also provided for teams that prefer to run their own stereo matching."
    },
    {
      "question": "What terrain types are represented?",
      "answer": "15+ types including paved trails, gravel paths, forest floors, grasslands, agricultural rows, rocky hillsides, sandy surfaces, muddy paths, snow-covered ground, construction sites, riverbanks, wetlands, desert hardpack, urban sidewalks, and mixed transitional zones."
    },
    {
      "question": "Is IMU and GPS data synchronized with stereo frames?",
      "answer": "Yes. Xsens MTi-630 IMU at 400Hz and GPS/RTK at 10Hz are hardware-synchronized with stereo frames. Camera-IMU extrinsic calibration is provided for visual-inertial fusion. RTK positions provide centimeter-level ground-truth trajectories when available."
    },
    {
      "question": "Can I request data in specific weather conditions?",
      "answer": "Yes. Custom campaigns can target specific weather (rain, snow, fog, direct sun, overcast) or seasonal conditions (full leaf, partial leaf, bare, spring mud). Degraded-condition data is particularly valuable for training robust stereo networks."
    }
  ],
  "ctaHeading": "Request a Sample Pack",
  "ctaDescription": "Get a curated sample of calibrated stereo outdoor data with disparity maps and traversability annotations to evaluate for your outdoor navigation project.",
  "relatedGlossaryTerms": [
    "depth-data",
    "optical-flow",
    "scene-understanding"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "datasetProfile": {
    "modalities": [
      "rgb",
      "stereo",
      "imu"
    ],
    "totalClips": "40K+",
    "totalHours": "300+",
    "annotationLayers": [
      "Dense disparity maps (RAFT-Stereo + SGM consensus)",
      "Terrain type classification (15+ classes)",
      "Traversability scoring (5-point scale)",
      "Obstacle detection and classification (20+ types)",
      "Path boundary segmentation",
      "Surface roughness estimation",
      "Slope angle from stereo reconstruction",
      "Weather and visibility condition tags",
      "GPS/RTK ground-truth trajectories",
      "Visual-inertial odometry poses"
    ],
    "formats": [
      "RLDS",
      "HDF5",
      "WebDataset",
      "MP4+JSON",
      "KITTI-format",
      "PFM (disparity)"
    ],
    "resolution": "1280x960 per eye (side-by-side 2560x960)",
    "fps": "30 fps"
  },
  "comparisonWithPublic": [
    {
      "name": "KITTI Stereo",
      "clips": "~400 pairs",
      "hours": "<1",
      "modalities": "Stereo RGB, LiDAR",
      "environments": "Urban driving (1 city)",
      "annotations": "Sparse disparity (LiDAR)"
    },
    {
      "name": "Middlebury Stereo",
      "clips": "~33 pairs",
      "hours": "N/A (stills)",
      "modalities": "Stereo RGB",
      "environments": "Indoor lab scenes",
      "annotations": "Dense disparity (structured light)"
    },
    {
      "name": "TartanAir",
      "clips": "~1M frames",
      "hours": "~30",
      "modalities": "Stereo RGB (synthetic)",
      "environments": "Simulated outdoor",
      "annotations": "Perfect depth, flow, segmentation"
    },
    {
      "name": "Claru Stereo Outdoor",
      "clips": "40K+",
      "hours": "300+",
      "modalities": "Stereo RGB, IMU, GPS",
      "environments": "15+ real terrain types",
      "annotations": "Disparity, traversability, obstacles, terrain class, weather"
    }
  ],
  "useCases": [
    {
      "modelType": "Stereo Depth Estimation",
      "description": "Training learning-based stereo matching networks for dense metric depth in challenging outdoor conditions with diverse terrain textures and lighting.",
      "exampleModels": [
        "RAFT-Stereo",
        "CREStereo",
        "GMStereo",
        "UniMatch"
      ]
    },
    {
      "modelType": "Terrain-Aware Navigation",
      "description": "Traversability estimation from visual appearance and depth structure, distinguishing safe terrain from hazards for field robots operating beyond paved roads.",
      "exampleModels": [
        "WayFAST",
        "BADGR",
        "ViNT",
        "NoMaD"
      ]
    },
    {
      "modelType": "Visual-Inertial Odometry",
      "description": "Training and benchmarking VIO systems for outdoor environments with synchronized stereo, IMU, and GPS/RTK ground-truth across diverse terrain and motion profiles.",
      "exampleModels": [
        "VINS-Fusion",
        "ORB-SLAM3",
        "DPVO",
        "DROID-SLAM"
      ]
    }
  ],
  "keyPapers": [
    {
      "id": "geiger-kitti-2012",
      "title": "Are We Ready for Autonomous Driving? The KITTI Vision Benchmark Suite",
      "authors": "Geiger et al.",
      "venue": "CVPR 2012",
      "year": 2012,
      "url": "https://arxiv.org/abs/1603.06160"
    },
    {
      "id": "lipson-raft-stereo-2021",
      "title": "RAFT-Stereo: Multilevel Recurrent Field Transforms for Stereo Matching",
      "authors": "Lipson et al.",
      "venue": "3DV 2021",
      "year": 2021,
      "url": "https://arxiv.org/abs/2109.07547"
    },
    {
      "id": "wang-tartanair-2020",
      "title": "TartanAir: A Dataset to Push the Limits of Visual SLAM",
      "authors": "Wang et al.",
      "venue": "IROS 2020",
      "year": 2020,
      "url": "https://arxiv.org/abs/2003.14338"
    },
    {
      "id": "frey-terrain-2024",
      "title": "Learning Robust Terrain Traversability from Multi-Modal Self-Supervised Data",
      "authors": "Frey et al.",
      "venue": "ICRA 2024",
      "year": 2024,
      "url": "https://arxiv.org/abs/2310.05368"
    }
  ],
  "claruRelevance": "Claru deploys calibrated stereo rigs across 15+ outdoor terrain types with synchronized IMU and GPS/RTK, capturing the terrain diversity that field robots encounter in real deployment. Unlike urban-only stereo datasets, the data spans forests, agriculture, rocky terrain, sand, mud, and snow with traversability annotations and dense disparity maps -- enabling stereo depth networks and navigation systems robust to the full range of outdoor conditions."
};

export default data;
