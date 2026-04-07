import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  "slug": "teleoperation-warehouse",
  "metaTitle": "Teleoperation Warehouse Dataset for Robotics AI | Claru",
  "metaDescription": "Robot teleoperation data from warehouse environments with pick-and-place trajectories. 55K+ trajectories across 20+ setups.",
  "primaryKeyword": "teleoperation warehouse dataset",
  "secondaryKeywords": [
    "warehouse robot teleoperation",
    "pick and place robot data",
    "logistics manipulation dataset",
    "bin picking training data",
    "warehouse grasping trajectories",
    "fulfillment robot training"
  ],
  "canonicalPath": "/datasets/teleoperation-warehouse",
  "h1": "Teleoperation Warehouse Dataset",
  "heroSubtitle": "Robot teleoperation data from real warehouse environments — pick-and-place trajectories with force sensing for training logistics manipulation policies.",
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
      "label": "Warehouse",
      "href": "/datasets/teleoperation-warehouse"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "Dataset at a Glance",
      "stats": [
        {
          "value": "55K+",
          "label": "Video clips"
        },
        {
          "value": "400+",
          "label": "Hours recorded"
        },
        {
          "value": "20+ warehouse setups",
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
          "Dataset": "Open X-Embodiment (pick)",
          "Clips": "~100K",
          "Hours": "~300",
          "Modalities": "RGB",
          "Environments": "Lab settings",
          "Annotations": "Actions"
        },
        {
          "Dataset": "GraspNet-1Billion",
          "Clips": "97K grasps",
          "Hours": "~10",
          "Modalities": "RGB-D",
          "Environments": "Lab",
          "Annotations": "6-DoF grasps"
        },
        {
          "Dataset": "Claru Warehouse Teleop",
          "Clips": "55K+",
          "Hours": "400+",
          "Modalities": "RGB, Depth, F/T",
          "Environments": "20+ real warehouses",
          "Annotations": "Actions, forces, success, weights"
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Use Cases",
      "cards": [
        {
          "title": "Bin Picking Systems",
          "description": "Grasping diverse products from cluttered bins. Example models: Covariant Brain, Berkshire Grey, RightHand Robotics."
        },
        {
          "title": "Depalletizing Robots",
          "description": "Picking boxes from pallets with varying sizes and weights. Example models: Boston Dynamics Stretch, Dexterity, Pickle Robot."
        },
        {
          "title": "Sortation Systems",
          "description": "High-speed package sorting by destination. Example models: Berkshire Grey, Plus One Robotics, Ambi Robotics."
        }
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "pinto-grasp-2016",
          "title": "Supersizing Self-supervision: Learning to Grasp from 50K Tries",
          "authors": "Pinto & Gupta",
          "venue": "ICRA 2016",
          "year": 2016,
          "url": "https://arxiv.org/abs/1509.06825"
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
          "id": "open-x-2023",
          "title": "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
          "authors": "Open X-Embodiment Collaboration",
          "venue": "ICRA 2024",
          "year": 2023,
          "url": "https://arxiv.org/abs/2310.08864"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Delivers This Data",
      "paragraphs": [
        "Claru deploys teleoperation rigs in active warehouses with real product diversity — not lab objects. Force/torque sensing captures the manipulation dynamics specific to logistics: varying box weights, deformable packaging, and stacked configurations."
      ]
    }
  ],
  "faqs": [
    {
      "question": "What products are included?",
      "answer": "Full range of warehouse SKUs: cardboard boxes, polybags, bottles, irregular shapes. Weights from 50g to 25kg."
    },
    {
      "question": "How many grasp types are represented?",
      "answer": "12 categories including top, side, pinch, suction, and enveloping grasps, each with approach vector and force profile."
    },
    {
      "question": "Is multi-robot data included?",
      "answer": "Yes. Franka Panda, UR5e, and custom suction-gripper setups across different stations."
    }
  ],
  "ctaHeading": "Request a Sample Pack",
  "ctaDescription": "Get a curated sample of teleoperation warehouse data with full annotations to evaluate for your project.",
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
      "force-torque"
    ],
    "totalClips": "55K+",
    "totalHours": "400+",
    "annotationLayers": [
      "Joint position trajectories",
      "End-effector poses",
      "Gripper state",
      "Task success labels",
      "Object weight estimates",
      "Bin/shelf coordinates"
    ],
    "formats": [
      "RLDS",
      "HDF5",
      "zarr",
      "LeRobot"
    ],
    "resolution": "1280x720",
    "fps": "30 fps"
  },
  "comparisonWithPublic": [
    {
      "name": "Open X-Embodiment (pick)",
      "clips": "~100K",
      "hours": "~300",
      "modalities": "RGB",
      "environments": "Lab settings",
      "annotations": "Actions"
    },
    {
      "name": "GraspNet-1Billion",
      "clips": "97K grasps",
      "hours": "~10",
      "modalities": "RGB-D",
      "environments": "Lab",
      "annotations": "6-DoF grasps"
    },
    {
      "name": "Claru Warehouse Teleop",
      "clips": "55K+",
      "hours": "400+",
      "modalities": "RGB, Depth, F/T",
      "environments": "20+ real warehouses",
      "annotations": "Actions, forces, success, weights"
    }
  ],
  "useCases": [
    {
      "modelType": "Bin Picking Systems",
      "description": "Grasping diverse products from cluttered bins.",
      "exampleModels": [
        "Covariant Brain",
        "Berkshire Grey",
        "RightHand Robotics"
      ]
    },
    {
      "modelType": "Depalletizing Robots",
      "description": "Picking boxes from pallets with varying sizes and weights.",
      "exampleModels": [
        "Boston Dynamics Stretch",
        "Dexterity",
        "Pickle Robot"
      ]
    },
    {
      "modelType": "Sortation Systems",
      "description": "High-speed package sorting by destination.",
      "exampleModels": [
        "Berkshire Grey",
        "Plus One Robotics",
        "Ambi Robotics"
      ]
    }
  ],
  "keyPapers": [
    {
      "id": "pinto-grasp-2016",
      "title": "Supersizing Self-supervision: Learning to Grasp from 50K Tries",
      "authors": "Pinto & Gupta",
      "venue": "ICRA 2016",
      "year": 2016,
      "url": "https://arxiv.org/abs/1509.06825"
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
      "id": "open-x-2023",
      "title": "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      "authors": "Open X-Embodiment Collaboration",
      "venue": "ICRA 2024",
      "year": 2023,
      "url": "https://arxiv.org/abs/2310.08864"
    }
  ],
  "claruRelevance": "Claru deploys teleoperation rigs in active warehouses with real product diversity — not lab objects. Force/torque sensing captures the manipulation dynamics specific to logistics: varying box weights, deformable packaging, and stacked configurations."
};

export default data;
