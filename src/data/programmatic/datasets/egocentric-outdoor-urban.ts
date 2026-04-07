import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  "slug": "egocentric-outdoor-urban",
  "metaTitle": "Egocentric Outdoor Urban Video Dataset for Robotics AI | Claru",
  "metaDescription": "First-person urban environment video for training delivery robots, autonomous navigation, and outdoor embodied AI systems. 95K+ clips across 30+ cities.",
  "primaryKeyword": "egocentric outdoor urban video dataset",
  "secondaryKeywords": [
    "urban robot navigation data",
    "sidewalk robot training data",
    "delivery robot dataset",
    "outdoor egocentric video",
    "urban scene understanding",
    "pedestrian navigation dataset"
  ],
  "canonicalPath": "/datasets/egocentric-outdoor-urban",
  "h1": "Egocentric Outdoor Urban Video Dataset",
  "heroSubtitle": "First-person video of urban pedestrian environments — sidewalks, crosswalks, plazas — captured across 30+ cities with navigation annotations for training delivery robots and outdoor autonomous systems.",
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
      "label": "Outdoor Urban Video",
      "href": "/datasets/egocentric-outdoor-urban"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "Dataset at a Glance",
      "stats": [
        {
          "value": "95K+",
          "label": "Video clips"
        },
        {
          "value": "700+",
          "label": "Hours recorded"
        },
        {
          "value": "30+ cities",
          "label": "Environments"
        },
        {
          "value": "6+",
          "label": "Annotation layers"
        }
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Comparison with Public Datasets",
      "description": "How Claru's dataset compares to publicly available alternatives.",
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
          "Dataset": "Cityscapes",
          "Clips": "25K",
          "Hours": "~50",
          "Modalities": "RGB, Stereo",
          "Environments": "50 cities (vehicle)",
          "Annotations": "Semantic segmentation"
        },
        {
          "Dataset": "nuScenes",
          "Clips": "40K",
          "Hours": "5.5",
          "Modalities": "RGB, LiDAR, Radar",
          "Environments": "2 cities (vehicle)",
          "Annotations": "3D boxes, maps"
        },
        {
          "Dataset": "Claru Urban",
          "Clips": "95K+",
          "Hours": "700+",
          "Modalities": "RGB, Depth, IMU",
          "Environments": "30+ cities (pedestrian)",
          "Annotations": "Pedestrians, surfaces, obstacles, weather"
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Use Cases",
      "cards": [
        {
          "title": "Sidewalk Delivery Robots",
          "description": "Navigating pedestrian environments with dynamic foot traffic and urban obstacles. Example models: Serve Robotics, Nuro, Coco."
        },
        {
          "title": "Legged Robot Navigation",
          "description": "Outdoor locomotion and path planning in unstructured urban terrain. Example models: Boston Dynamics Spot, ANYbotics ANYmal, Ghost Robotics."
        },
        {
          "title": "Urban Scene Understanding",
          "description": "Scene parsing for identifying sidewalks, road surfaces, curb cuts, and construction zones. Example models: SegFormer, Mask2Former, OneFormer."
        }
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "cordts-cityscapes-2016",
          "title": "The Cityscapes Dataset for Semantic Urban Scene Understanding",
          "authors": "Cordts et al.",
          "venue": "CVPR 2016",
          "year": 2016,
          "url": "https://arxiv.org/abs/1604.01685"
        },
        {
          "id": "caesar-nuscenes-2020",
          "title": "nuScenes: A Multimodal Dataset for Autonomous Driving",
          "authors": "Caesar et al.",
          "venue": "CVPR 2020",
          "year": 2020,
          "url": "https://arxiv.org/abs/1903.11027"
        },
        {
          "id": "shah-gnm-2023",
          "title": "GNM: A General Navigation Model to Drive Any Robot",
          "authors": "Shah et al.",
          "venue": "ICRA 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2210.03370"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Delivers This Data",
      "paragraphs": [
        "Claru's collector network spans 100+ cities, capturing genuine pedestrian-perspective urban navigation. Unlike vehicle-mounted datasets, Claru's data shows the world from sidewalk height — the perspective delivery robots and legged robots actually operate from."
      ]
    }
  ],
  "faqs": [
    {
      "question": "How does this differ from autonomous driving datasets?",
      "answer": "Driving datasets are captured from vehicle height with vehicle-centric annotations. Claru's urban dataset is captured from pedestrian/robot height (1-1.5m), showing curb details, ground textures, and leg-level obstacles that vehicle datasets miss."
    },
    {
      "question": "What weather conditions are represented?",
      "answer": "The dataset spans clear, overcast, rainy, and snowy conditions across all four seasons, with night captures under artificial lighting. Each clip carries weather metadata for filtering."
    },
    {
      "question": "Is GPS data included?",
      "answer": "Yes. Every outdoor clip includes GPS traces at 1Hz for spatial indexing and geographic diversity verification."
    }
  ],
  "ctaHeading": "Request a Sample Pack",
  "ctaDescription": "Get a curated sample of egocentric outdoor urban video data with full annotations to evaluate for your project.",
  "relatedGlossaryTerms": [
    "egocentric-video",
    "teleoperation-data",
    "depth-data"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "datasetProfile": {
    "modalities": [
      "rgb",
      "depth",
      "imu"
    ],
    "totalClips": "95K+",
    "totalHours": "700+",
    "annotationLayers": [
      "Pedestrian detection",
      "Road surface classification",
      "Traffic signal state",
      "Obstacle mapping",
      "Sidewalk segmentation",
      "Weather condition labels"
    ],
    "formats": [
      "RLDS",
      "HDF5",
      "WebDataset",
      "MP4+JSON",
      "nuScenes"
    ],
    "resolution": "1920x1080",
    "fps": "30 fps"
  },
  "comparisonWithPublic": [
    {
      "name": "Cityscapes",
      "clips": "25K",
      "hours": "~50",
      "modalities": "RGB, Stereo",
      "environments": "50 cities (vehicle)",
      "annotations": "Semantic segmentation"
    },
    {
      "name": "nuScenes",
      "clips": "40K",
      "hours": "5.5",
      "modalities": "RGB, LiDAR, Radar",
      "environments": "2 cities (vehicle)",
      "annotations": "3D boxes, maps"
    },
    {
      "name": "Claru Urban",
      "clips": "95K+",
      "hours": "700+",
      "modalities": "RGB, Depth, IMU",
      "environments": "30+ cities (pedestrian)",
      "annotations": "Pedestrians, surfaces, obstacles, weather"
    }
  ],
  "useCases": [
    {
      "modelType": "Sidewalk Delivery Robots",
      "description": "Navigating pedestrian environments with dynamic foot traffic and urban obstacles.",
      "exampleModels": [
        "Serve Robotics",
        "Nuro",
        "Coco"
      ]
    },
    {
      "modelType": "Legged Robot Navigation",
      "description": "Outdoor locomotion and path planning in unstructured urban terrain.",
      "exampleModels": [
        "Boston Dynamics Spot",
        "ANYbotics ANYmal",
        "Ghost Robotics"
      ]
    },
    {
      "modelType": "Urban Scene Understanding",
      "description": "Scene parsing for identifying sidewalks, road surfaces, curb cuts, and construction zones.",
      "exampleModels": [
        "SegFormer",
        "Mask2Former",
        "OneFormer"
      ]
    }
  ],
  "keyPapers": [
    {
      "id": "cordts-cityscapes-2016",
      "title": "The Cityscapes Dataset for Semantic Urban Scene Understanding",
      "authors": "Cordts et al.",
      "venue": "CVPR 2016",
      "year": 2016,
      "url": "https://arxiv.org/abs/1604.01685"
    },
    {
      "id": "caesar-nuscenes-2020",
      "title": "nuScenes: A Multimodal Dataset for Autonomous Driving",
      "authors": "Caesar et al.",
      "venue": "CVPR 2020",
      "year": 2020,
      "url": "https://arxiv.org/abs/1903.11027"
    },
    {
      "id": "shah-gnm-2023",
      "title": "GNM: A General Navigation Model to Drive Any Robot",
      "authors": "Shah et al.",
      "venue": "ICRA 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2210.03370"
    }
  ],
  "claruRelevance": "Claru's collector network spans 100+ cities, capturing genuine pedestrian-perspective urban navigation. Unlike vehicle-mounted datasets, Claru's data shows the world from sidewalk height — the perspective delivery robots and legged robots actually operate from."
};

export default data;
