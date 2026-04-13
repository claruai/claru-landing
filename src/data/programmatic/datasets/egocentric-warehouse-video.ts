import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  "slug": "egocentric-warehouse-video",
  "metaTitle": "Egocentric Warehouse Video Dataset for Robotics AI | Claru",
  "metaDescription": "First-person warehouse activity video with logistics annotations for training warehouse robotics, autonomous mobile robots, and pick-and-place systems. 85K+ clips across 40+ warehouse layouts.",
  "primaryKeyword": "egocentric warehouse video dataset",
  "secondaryKeywords": [
    "warehouse robot training data",
    "logistics video dataset",
    "pick and place training data",
    "autonomous mobile robot data",
    "warehouse activity recognition",
    "fulfillment center video"
  ],
  "canonicalPath": "/datasets/egocentric-warehouse-video",
  "h1": "Egocentric Warehouse Video Dataset",
  "heroSubtitle": "First-person video of real warehouse operations — picking, packing, sorting, and navigation — captured across diverse fulfillment center layouts with logistics-specific annotations for training warehouse robotics and AMR systems.",
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
      "label": "Warehouse Video",
      "href": "/datasets/egocentric-warehouse-video"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "Dataset at a Glance",
      "stats": [
        {
          "value": "85K+",
          "label": "Video clips"
        },
        {
          "value": "600+",
          "label": "Hours recorded"
        },
        {
          "value": "40+ warehouse layouts",
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
          "Dataset": "Ego4D (workplace subset)",
          "Clips": "~15K",
          "Hours": "~80",
          "Modalities": "RGB, IMU",
          "Environments": "Mixed workplace",
          "Annotations": "Narrations, hands"
        },
        {
          "Dataset": "IndustReal",
          "Clips": "8K",
          "Hours": "24",
          "Modalities": "RGB-D",
          "Environments": "Lab warehouse",
          "Annotations": "Assembly actions"
        },
        {
          "Dataset": "Claru Warehouse",
          "Clips": "85K+",
          "Hours": "600+",
          "Modalities": "RGB, Depth",
          "Environments": "40+ real warehouses",
          "Annotations": "Actions, objects, paths, zones"
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Use Cases",
      "cards": [
        {
          "title": "Autonomous Mobile Robots",
          "description": "Navigation and obstacle avoidance in dynamic warehouse environments. Example models: Locus Robotics, 6 River Systems, Fetch Robotics."
        },
        {
          "title": "Pick-and-Place Systems",
          "description": "Grasping diverse products from shelves and bins under operational conditions. Example models: Covariant, RightHand Robotics, Berkshire Grey."
        },
        {
          "title": "Warehouse Safety Monitoring",
          "description": "Detecting unsafe worker behaviors and zone violations in real-time. Example models: Voxel51, Kinema Systems, Dexterity."
        }
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "duan-amr-2023",
          "title": "A Survey on Autonomous Mobile Robot Navigation in Warehouses",
          "authors": "Duan et al.",
          "venue": "Robotics and Autonomous Systems 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2308.05040"
        },
        {
          "id": "mahler-dexnet-2019",
          "title": "Learning Ambidextrous Robot Grasping Policies",
          "authors": "Mahler et al.",
          "venue": "Science Robotics 2019",
          "year": 2019,
          "url": "https://arxiv.org/abs/1903.04349"
        },
        {
          "id": "grauman-ego4d-2022",
          "title": "Ego4D: Around the World in 3,000 Hours of Egocentric Video",
          "authors": "Grauman et al.",
          "venue": "CVPR 2022",
          "year": 2022,
          "url": "https://arxiv.org/abs/2110.07058"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Delivers This Data",
      "paragraphs": [
        "Claru deploys collectors in active fulfillment centers and distribution warehouses across North America, capturing genuine picking, packing, and sorting workflows. Unlike synthetic warehouse simulations, Claru's data includes real product diversity, authentic worker movement patterns, and the visual complexity of operational warehouses."
      ]
    }
  ],
  "faqs": [
    {
      "question": "What types of warehouse operations are covered?",
      "answer": "The dataset covers order picking (goods-to-person and person-to-goods), packing, inventory putaway, cycle counting, forklift operation, and general warehouse navigation across various rack and bin configurations."
    },
    {
      "question": "Are the warehouses real operational facilities?",
      "answer": "Yes. All collection occurs in active warehouses and fulfillment centers during normal operations, capturing authentic product diversity, real worker movement patterns, and operational constraints."
    },
    {
      "question": "What annotation layers are included for AMR training?",
      "answer": "Beyond temporal actions and object tracking, the dataset includes spatial path annotations (2D floor-plane trajectories), zone occupancy labels, pick/place event markers, and worker pose estimation for human-robot interaction modeling."
    }
  ],
  "ctaHeading": "Request a Sample Pack",
  "ctaDescription": "Get a curated sample of egocentric warehouse video data with full annotations to evaluate for your project.",
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
      "depth"
    ],
    "totalClips": "85K+",
    "totalHours": "600+",
    "annotationLayers": [
      "Temporal action segments",
      "Object tracking",
      "Spatial path annotations",
      "Pick/place event labels",
      "Worker pose estimation",
      "Zone occupancy maps"
    ],
    "formats": [
      "RLDS",
      "HDF5",
      "WebDataset",
      "MP4+JSON"
    ],
    "resolution": "1920x1080",
    "fps": "30 fps"
  },
  "comparisonWithPublic": [
    {
      "name": "Ego4D (workplace subset)",
      "clips": "~15K",
      "hours": "~80",
      "modalities": "RGB, IMU",
      "environments": "Mixed workplace",
      "annotations": "Narrations, hands"
    },
    {
      "name": "IndustReal",
      "clips": "8K",
      "hours": "24",
      "modalities": "RGB-D",
      "environments": "Lab warehouse",
      "annotations": "Assembly actions"
    },
    {
      "name": "Claru Warehouse",
      "clips": "85K+",
      "hours": "600+",
      "modalities": "RGB, Depth",
      "environments": "40+ real warehouses",
      "annotations": "Actions, objects, paths, zones"
    }
  ],
  "useCases": [
    {
      "modelType": "Autonomous Mobile Robots",
      "description": "Navigation and obstacle avoidance in dynamic warehouse environments.",
      "exampleModels": [
        "Locus Robotics",
        "6 River Systems",
        "Fetch Robotics"
      ]
    },
    {
      "modelType": "Pick-and-Place Systems",
      "description": "Grasping diverse products from shelves and bins under operational conditions.",
      "exampleModels": [
        "Covariant",
        "RightHand Robotics",
        "Berkshire Grey"
      ]
    },
    {
      "modelType": "Warehouse Safety Monitoring",
      "description": "Detecting unsafe worker behaviors and zone violations in real-time.",
      "exampleModels": [
        "Voxel51",
        "Kinema Systems",
        "Dexterity"
      ]
    }
  ],
  "keyPapers": [
    {
      "id": "duan-amr-2023",
      "title": "A Survey on Autonomous Mobile Robot Navigation in Warehouses",
      "authors": "Duan et al.",
      "venue": "Robotics and Autonomous Systems 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2308.05040"
    },
    {
      "id": "mahler-dexnet-2019",
      "title": "Learning Ambidextrous Robot Grasping Policies",
      "authors": "Mahler et al.",
      "venue": "Science Robotics 2019",
      "year": 2019,
      "url": "https://arxiv.org/abs/1903.04349"
    },
    {
      "id": "grauman-ego4d-2022",
      "title": "Ego4D: Around the World in 3,000 Hours of Egocentric Video",
      "authors": "Grauman et al.",
      "venue": "CVPR 2022",
      "year": 2022,
      "url": "https://arxiv.org/abs/2110.07058"
    }
  ],
  "claruRelevance": "Claru deploys collectors in active fulfillment centers and distribution warehouses across North America, capturing genuine picking, packing, and sorting workflows. Unlike synthetic warehouse simulations, Claru's data includes real product diversity, authentic worker movement patterns, and the visual complexity of operational warehouses."
};

export default data;
