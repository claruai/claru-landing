import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  "slug": "teleoperation-kitchen",
  "metaTitle": "Teleoperation Kitchen Dataset for Robotics AI | Claru",
  "metaDescription": "Robot teleoperation data from kitchen environments with synchronized camera-action pairs. 45K+ trajectories across 15+ kitchen setups.",
  "primaryKeyword": "teleoperation kitchen dataset",
  "secondaryKeywords": [
    "kitchen robot teleoperation data",
    "cooking robot training trajectories",
    "robot manipulation kitchen data",
    "teleoperated cooking demos",
    "kitchen policy training data",
    "food handling robot data"
  ],
  "canonicalPath": "/datasets/teleoperation-kitchen",
  "h1": "Teleoperation Kitchen Dataset",
  "heroSubtitle": "Robot teleoperation data from real kitchen environments — synchronized camera-action-force triplets for training cooking robot manipulation policies.",
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
      "label": "Kitchen",
      "href": "/datasets/teleoperation-kitchen"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "Dataset at a Glance",
      "stats": [
        {
          "value": "45K+",
          "label": "Video clips"
        },
        {
          "value": "300+",
          "label": "Hours recorded"
        },
        {
          "value": "15+ kitchen setups",
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
          "Dataset": "Bridge Data V2",
          "Clips": "60K",
          "Hours": "~200",
          "Modalities": "RGB",
          "Environments": "1 kitchen",
          "Annotations": "Actions, language"
        },
        {
          "Dataset": "DROID",
          "Clips": "76K",
          "Hours": "~350",
          "Modalities": "RGB-D, wrist",
          "Environments": "Multiple",
          "Annotations": "Actions, language"
        },
        {
          "Dataset": "Claru Kitchen Teleop",
          "Clips": "45K+",
          "Hours": "300+",
          "Modalities": "RGB, Depth, F/T",
          "Environments": "15+ kitchens",
          "Annotations": "Actions, forces, language, success"
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Use Cases",
      "cards": [
        {
          "title": "VLA Kitchen Policies",
          "description": "Language-conditioned manipulation for cooking tasks. Example models: RT-2, OpenVLA, Octo."
        },
        {
          "title": "Diffusion Policy",
          "description": "Multi-modal action prediction for kitchen manipulation. Example models: Diffusion Policy, ACT, pi-zero."
        },
        {
          "title": "Contact-Rich Manipulation",
          "description": "Force-aware manipulation for food handling. Example models: TRILL, ManiSkill2, RoboCasa."
        }
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "walke-bridge-2024",
          "title": "BridgeData V2: A Dataset for Robot Learning at Scale",
          "authors": "Walke et al.",
          "venue": "CoRL 2024",
          "year": 2024,
          "url": "https://arxiv.org/abs/2308.12952"
        },
        {
          "id": "khazatsky-droid-2024",
          "title": "DROID: A Large-Scale In-The-Wild Robot Manipulation Dataset",
          "authors": "Khazatsky et al.",
          "venue": "RSS 2024",
          "year": 2024,
          "url": "https://arxiv.org/abs/2403.12945"
        },
        {
          "id": "chi-diffusion-2023",
          "title": "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
          "authors": "Chi et al.",
          "venue": "RSS 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2303.04137"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Delivers This Data",
      "paragraphs": [
        "Claru operates teleoperation rigs in real kitchens using Franka, UR5, and mobile manipulators. Human operators perform genuine cooking tasks, generating synchronized observation-action pairs with force/torque sensing."
      ]
    }
  ],
  "faqs": [
    {
      "question": "What robot platforms are used?",
      "answer": "Franka Emika Panda, UR5e, and selected mobile manipulators, recording joint positions at 50Hz with force/torque sensors."
    },
    {
      "question": "What kitchen tasks are covered?",
      "answer": "From simple pick-and-place to complex pouring, stirring, cutting, and plating, each with natural language instructions."
    },
    {
      "question": "How is success determined?",
      "answer": "Every trajectory carries a binary success label plus quality score (1-5) from human evaluators with task-specific criteria."
    }
  ],
  "ctaHeading": "Request a Sample Pack",
  "ctaDescription": "Get a curated sample of teleoperation kitchen data with full annotations to evaluate for your project.",
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
    "totalClips": "45K+",
    "totalHours": "300+",
    "annotationLayers": [
      "Joint position trajectories",
      "End-effector poses",
      "Gripper state",
      "Task success labels",
      "Contact force profiles",
      "Language instructions"
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
      "name": "Bridge Data V2",
      "clips": "60K",
      "hours": "~200",
      "modalities": "RGB",
      "environments": "1 kitchen",
      "annotations": "Actions, language"
    },
    {
      "name": "DROID",
      "clips": "76K",
      "hours": "~350",
      "modalities": "RGB-D, wrist",
      "environments": "Multiple",
      "annotations": "Actions, language"
    },
    {
      "name": "Claru Kitchen Teleop",
      "clips": "45K+",
      "hours": "300+",
      "modalities": "RGB, Depth, F/T",
      "environments": "15+ kitchens",
      "annotations": "Actions, forces, language, success"
    }
  ],
  "useCases": [
    {
      "modelType": "VLA Kitchen Policies",
      "description": "Language-conditioned manipulation for cooking tasks.",
      "exampleModels": [
        "RT-2",
        "OpenVLA",
        "Octo"
      ]
    },
    {
      "modelType": "Diffusion Policy",
      "description": "Multi-modal action prediction for kitchen manipulation.",
      "exampleModels": [
        "Diffusion Policy",
        "ACT",
        "pi-zero"
      ]
    },
    {
      "modelType": "Contact-Rich Manipulation",
      "description": "Force-aware manipulation for food handling.",
      "exampleModels": [
        "TRILL",
        "ManiSkill2",
        "RoboCasa"
      ]
    }
  ],
  "keyPapers": [
    {
      "id": "walke-bridge-2024",
      "title": "BridgeData V2: A Dataset for Robot Learning at Scale",
      "authors": "Walke et al.",
      "venue": "CoRL 2024",
      "year": 2024,
      "url": "https://arxiv.org/abs/2308.12952"
    },
    {
      "id": "khazatsky-droid-2024",
      "title": "DROID: A Large-Scale In-The-Wild Robot Manipulation Dataset",
      "authors": "Khazatsky et al.",
      "venue": "RSS 2024",
      "year": 2024,
      "url": "https://arxiv.org/abs/2403.12945"
    },
    {
      "id": "chi-diffusion-2023",
      "title": "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      "authors": "Chi et al.",
      "venue": "RSS 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2303.04137"
    }
  ],
  "claruRelevance": "Claru operates teleoperation rigs in real kitchens using Franka, UR5, and mobile manipulators. Human operators perform genuine cooking tasks, generating synchronized observation-action pairs with force/torque sensing."
};

export default data;
