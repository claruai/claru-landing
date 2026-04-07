import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  "slug": "dashcam-urban",
  "metaTitle": "Dashcam Urban Dataset for Robotics AI | Claru",
  "metaDescription": "Urban dashcam video with traffic annotations for autonomous driving perception. 100K+ clips across 20+ cities.",
  "primaryKeyword": "dashcam urban dataset",
  "secondaryKeywords": [
    "dashcam training data",
    "urban driving dataset",
    "autonomous driving video",
    "traffic detection dataset",
    "road scene understanding",
    "driving world model data"
  ],
  "canonicalPath": "/datasets/dashcam-urban",
  "h1": "Dashcam Urban Dataset",
  "heroSubtitle": "Forward-facing dashcam video from urban driving environments with traffic annotations for training autonomous driving perception and world models.",
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
      "label": "Dashcam Urban",
      "href": "/datasets/dashcam-urban"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "Dataset at a Glance",
      "stats": [
        {
          "value": "100K+",
          "label": "Video clips"
        },
        {
          "value": "800+",
          "label": "Hours recorded"
        },
        {
          "value": "20+ cities",
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
          "Dataset": "nuScenes",
          "Clips": "40K",
          "Hours": "5.5",
          "Modalities": "Multi-sensor",
          "Environments": "2 cities",
          "Annotations": "3D boxes, maps"
        },
        {
          "Dataset": "Waymo Open",
          "Clips": "~200K",
          "Hours": "~6",
          "Modalities": "Multi-sensor",
          "Environments": "3 cities",
          "Annotations": "3D boxes, segmentation"
        },
        {
          "Dataset": "Claru Dashcam",
          "Clips": "100K+",
          "Hours": "800+",
          "Modalities": "RGB, IMU",
          "Environments": "20+ cities",
          "Annotations": "Vehicles, pedestrians, lanes, signs, weather"
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Use Cases",
      "cards": [
        {
          "title": "Driving Perception",
          "description": "Object detection and tracking for autonomous vehicle systems. Example models: BEVFormer, StreamPETR, UniAD."
        },
        {
          "title": "Driving World Models",
          "description": "Learning traffic dynamics and scene evolution from dashcam sequences. Example models: GAIA-1, DriveDreamer, GenAD."
        },
        {
          "title": "Lane Detection",
          "description": "Identifying lane markings and road boundaries in diverse conditions. Example models: LaneATT, CLRNet, MapTR."
        }
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
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
          "id": "sun-waymo-2020",
          "title": "Scalability in Perception for Autonomous Driving: Waymo Open Dataset",
          "authors": "Sun et al.",
          "venue": "CVPR 2020",
          "year": 2020,
          "url": "https://arxiv.org/abs/1912.04838"
        },
        {
          "id": "hu-gaia-2023",
          "title": "GAIA-1: A Generative World Model for Autonomous Driving",
          "authors": "Hu et al.",
          "venue": "arXiv 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2309.17080"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Delivers This Data",
      "paragraphs": [
        "Claru's dashcam collection spans 20+ cities with genuine driving routes, not test tracks. IMU data synchronized with video enables ego-motion estimation for world model training."
      ]
    }
  ],
  "faqs": [
    {
      "question": "What cities are covered?",
      "answer": "20+ cities across North America and Europe with diverse road types: highways, urban streets, suburban roads, and parking structures."
    },
    {
      "question": "How is this different from nuScenes?",
      "answer": "Claru provides orders of magnitude more hours of video from more cities, focused on RGB+IMU rather than full multi-sensor suites, making it ideal for vision-centric approaches."
    },
    {
      "question": "Is ego-motion data included?",
      "answer": "Yes. IMU data at 100Hz is synchronized with video, and camera intrinsics are provided for monocular depth and ego-motion estimation."
    }
  ],
  "ctaHeading": "Request a Sample Pack",
  "ctaDescription": "Get a curated sample of dashcam urban data with full annotations to evaluate for your project.",
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
      "imu"
    ],
    "totalClips": "100K+",
    "totalHours": "800+",
    "annotationLayers": [
      "Vehicle detection/tracking",
      "Pedestrian detection",
      "Lane markings",
      "Traffic signs/signals",
      "Road surface conditions",
      "Weather classification"
    ],
    "formats": [
      "RLDS",
      "HDF5",
      "WebDataset",
      "nuScenes",
      "MP4+JSON"
    ],
    "resolution": "1920x1080",
    "fps": "30 fps"
  },
  "comparisonWithPublic": [
    {
      "name": "nuScenes",
      "clips": "40K",
      "hours": "5.5",
      "modalities": "Multi-sensor",
      "environments": "2 cities",
      "annotations": "3D boxes, maps"
    },
    {
      "name": "Waymo Open",
      "clips": "~200K",
      "hours": "~6",
      "modalities": "Multi-sensor",
      "environments": "3 cities",
      "annotations": "3D boxes, segmentation"
    },
    {
      "name": "Claru Dashcam",
      "clips": "100K+",
      "hours": "800+",
      "modalities": "RGB, IMU",
      "environments": "20+ cities",
      "annotations": "Vehicles, pedestrians, lanes, signs, weather"
    }
  ],
  "useCases": [
    {
      "modelType": "Driving Perception",
      "description": "Object detection and tracking for autonomous vehicle systems.",
      "exampleModels": [
        "BEVFormer",
        "StreamPETR",
        "UniAD"
      ]
    },
    {
      "modelType": "Driving World Models",
      "description": "Learning traffic dynamics and scene evolution from dashcam sequences.",
      "exampleModels": [
        "GAIA-1",
        "DriveDreamer",
        "GenAD"
      ]
    },
    {
      "modelType": "Lane Detection",
      "description": "Identifying lane markings and road boundaries in diverse conditions.",
      "exampleModels": [
        "LaneATT",
        "CLRNet",
        "MapTR"
      ]
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
      "id": "sun-waymo-2020",
      "title": "Scalability in Perception for Autonomous Driving: Waymo Open Dataset",
      "authors": "Sun et al.",
      "venue": "CVPR 2020",
      "year": 2020,
      "url": "https://arxiv.org/abs/1912.04838"
    },
    {
      "id": "hu-gaia-2023",
      "title": "GAIA-1: A Generative World Model for Autonomous Driving",
      "authors": "Hu et al.",
      "venue": "arXiv 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2309.17080"
    }
  ],
  "claruRelevance": "Claru's dashcam collection spans 20+ cities with genuine driving routes, not test tracks. IMU data synchronized with video enables ego-motion estimation for world model training."
};

export default data;
