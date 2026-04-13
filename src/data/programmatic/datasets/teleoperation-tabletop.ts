import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  "slug": "teleoperation-tabletop",
  "metaTitle": "Teleoperation Tabletop Dataset for Robotics AI | Claru",
  "metaDescription": "Robot teleoperation data for tabletop manipulation with dense action labels. 80K+ trajectories across 25+ task families.",
  "primaryKeyword": "teleoperation tabletop manipulation dataset",
  "secondaryKeywords": [
    "tabletop manipulation dataset",
    "robot sorting training data",
    "object stacking robot data",
    "tool use manipulation data",
    "bimanual manipulation data",
    "dexterous tabletop data"
  ],
  "canonicalPath": "/datasets/teleoperation-tabletop",
  "h1": "Teleoperation Tabletop Dataset",
  "heroSubtitle": "Robot teleoperation data for tabletop manipulation — sorting, stacking, tool use — with synchronized camera-action-force triplets for training general-purpose policies.",
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
      "label": "Tabletop",
      "href": "/datasets/teleoperation-tabletop"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "Dataset at a Glance",
      "stats": [
        {
          "value": "80K+",
          "label": "Video clips"
        },
        {
          "value": "500+",
          "label": "Hours recorded"
        },
        {
          "value": "25+ task families",
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
          "Dataset": "RoboTurk",
          "Clips": "111K",
          "Hours": "~200",
          "Modalities": "RGB",
          "Environments": "Lab",
          "Annotations": "Actions"
        },
        {
          "Dataset": "Bridge Data V2",
          "Clips": "60K",
          "Hours": "~200",
          "Modalities": "RGB",
          "Environments": "Lab counter",
          "Annotations": "Actions, language"
        },
        {
          "Dataset": "Claru Tabletop",
          "Clips": "80K+",
          "Hours": "500+",
          "Modalities": "RGB, Depth, F/T",
          "Environments": "25+ task families",
          "Annotations": "Actions, forces, contacts, language, success"
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Use Cases",
      "cards": [
        {
          "title": "Foundation Manipulation Models",
          "description": "General-purpose tabletop policies that transfer across objects and tasks. Example models: Octo, RT-X, OpenVLA."
        },
        {
          "title": "Dexterous Manipulation",
          "description": "Fine-grained finger control for precise manipulation and assembly. Example models: DexNet, DexMV, UniDexGrasp."
        },
        {
          "title": "Language-Conditioned Policies",
          "description": "Following natural language instructions for diverse tabletop tasks. Example models: RT-2, SayCan, CLIPort."
        }
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "mandlekar-roboturk-2019",
          "title": "RoboTurk: A Crowdsourcing Platform for Robotic Skill Learning",
          "authors": "Mandlekar et al.",
          "venue": "CoRL 2019",
          "year": 2019,
          "url": "https://arxiv.org/abs/1811.02790"
        },
        {
          "id": "walke-bridge-2024",
          "title": "BridgeData V2: A Dataset for Robot Learning at Scale",
          "authors": "Walke et al.",
          "venue": "CoRL 2024",
          "year": 2024,
          "url": "https://arxiv.org/abs/2308.12952"
        },
        {
          "id": "team-octo-2024",
          "title": "Octo: An Open-Source Generalist Robot Policy",
          "authors": "Octo Model Team",
          "venue": "RSS 2024",
          "year": 2024,
          "url": "https://arxiv.org/abs/2405.12213"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Delivers This Data",
      "paragraphs": [
        "Claru's tabletop dataset covers 25+ task families with data from multiple robot embodiments, enabling cross-embodiment transfer learning. Force/torque sensing captures contact dynamics critical for precision manipulation."
      ]
    }
  ],
  "faqs": [
    {
      "question": "What task families are covered?",
      "answer": "25+ families: sorting (color, shape, size), stacking, tool use (spatula, tongs, scissors), pouring, insertion, drawer opening, button pressing, and multi-step assembly."
    },
    {
      "question": "How diverse are the object sets?",
      "answer": "Each family uses 50-200 unique objects varying in shape, size, material, and color."
    },
    {
      "question": "Can this train bimanual manipulation?",
      "answer": "A subset of 15K+ trajectories includes bimanual manipulation using dual-arm setups."
    }
  ],
  "ctaHeading": "Request a Sample Pack",
  "ctaDescription": "Get a curated sample of teleoperation tabletop data with full annotations to evaluate for your project.",
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
    "totalClips": "80K+",
    "totalHours": "500+",
    "annotationLayers": [
      "Joint position trajectories",
      "End-effector poses",
      "Gripper state",
      "Task success labels",
      "Contact events",
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
      "name": "RoboTurk",
      "clips": "111K",
      "hours": "~200",
      "modalities": "RGB",
      "environments": "Lab",
      "annotations": "Actions"
    },
    {
      "name": "Bridge Data V2",
      "clips": "60K",
      "hours": "~200",
      "modalities": "RGB",
      "environments": "Lab counter",
      "annotations": "Actions, language"
    },
    {
      "name": "Claru Tabletop",
      "clips": "80K+",
      "hours": "500+",
      "modalities": "RGB, Depth, F/T",
      "environments": "25+ task families",
      "annotations": "Actions, forces, contacts, language, success"
    }
  ],
  "useCases": [
    {
      "modelType": "Foundation Manipulation Models",
      "description": "General-purpose tabletop policies that transfer across objects and tasks.",
      "exampleModels": [
        "Octo",
        "RT-X",
        "OpenVLA"
      ]
    },
    {
      "modelType": "Dexterous Manipulation",
      "description": "Fine-grained finger control for precise manipulation and assembly.",
      "exampleModels": [
        "DexNet",
        "DexMV",
        "UniDexGrasp"
      ]
    },
    {
      "modelType": "Language-Conditioned Policies",
      "description": "Following natural language instructions for diverse tabletop tasks.",
      "exampleModels": [
        "RT-2",
        "SayCan",
        "CLIPort"
      ]
    }
  ],
  "keyPapers": [
    {
      "id": "mandlekar-roboturk-2019",
      "title": "RoboTurk: A Crowdsourcing Platform for Robotic Skill Learning",
      "authors": "Mandlekar et al.",
      "venue": "CoRL 2019",
      "year": 2019,
      "url": "https://arxiv.org/abs/1811.02790"
    },
    {
      "id": "walke-bridge-2024",
      "title": "BridgeData V2: A Dataset for Robot Learning at Scale",
      "authors": "Walke et al.",
      "venue": "CoRL 2024",
      "year": 2024,
      "url": "https://arxiv.org/abs/2308.12952"
    },
    {
      "id": "team-octo-2024",
      "title": "Octo: An Open-Source Generalist Robot Policy",
      "authors": "Octo Model Team",
      "venue": "RSS 2024",
      "year": 2024,
      "url": "https://arxiv.org/abs/2405.12213"
    }
  ],
  "claruRelevance": "Claru's tabletop dataset covers 25+ task families with data from multiple robot embodiments, enabling cross-embodiment transfer learning. Force/torque sensing captures contact dynamics critical for precision manipulation."
};

export default data;
