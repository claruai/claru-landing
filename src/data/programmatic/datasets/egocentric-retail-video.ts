import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  "slug": "egocentric-retail-video",
  "metaTitle": "Egocentric Retail Video Dataset for Robotics AI | Claru",
  "metaDescription": "First-person retail environment video for training shopping assistants, shelf monitoring robots, and retail analytics AI. 70K+ clips across 25+ store types.",
  "primaryKeyword": "egocentric retail video dataset",
  "secondaryKeywords": [
    "retail robot training data",
    "shopping assistant AI data",
    "shelf monitoring dataset",
    "retail automation video",
    "store navigation data",
    "retail activity recognition"
  ],
  "canonicalPath": "/datasets/egocentric-retail-video",
  "h1": "Egocentric Retail Video Dataset",
  "heroSubtitle": "First-person video of real retail environments — grocery stores, pharmacies, department stores — with product interaction annotations for training retail automation AI.",
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
      "label": "Retail Video",
      "href": "/datasets/egocentric-retail-video"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "Dataset at a Glance",
      "stats": [
        {
          "value": "70K+",
          "label": "Video clips"
        },
        {
          "value": "500+",
          "label": "Hours recorded"
        },
        {
          "value": "25+ store types",
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
          "Dataset": "Metrabs Retail",
          "Clips": "5K",
          "Hours": "15",
          "Modalities": "RGB-D",
          "Environments": "Lab store",
          "Annotations": "Pose, shelves"
        },
        {
          "Dataset": "EgoProceL",
          "Clips": "62",
          "Hours": "8",
          "Modalities": "RGB",
          "Environments": "Mixed",
          "Annotations": "Procedure steps"
        },
        {
          "Dataset": "Claru Retail",
          "Clips": "70K+",
          "Hours": "500+",
          "Modalities": "RGB, Depth",
          "Environments": "25+ store types",
          "Annotations": "Products, shelves, paths, hands, navigation"
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Use Cases",
      "cards": [
        {
          "title": "Shelf Monitoring Robots",
          "description": "Autonomous shelf scanning and out-of-stock detection using mobile platforms. Example models: Simbe Tally, Badger Technologies, BossaNova."
        },
        {
          "title": "Shopping Assistant Robots",
          "description": "Customer interaction and in-store navigation assistance. Example models: Fellow Robots, SoftBank Pepper, LG CLOi."
        },
        {
          "title": "Visual Retail Analytics",
          "description": "Understanding customer behavior and product interaction patterns. Example models: RetailNext, Trax, Standard AI."
        }
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "ragusa-retail-2020",
          "title": "The MECCANO Dataset: Understanding Human-Object Interactions from Egocentric Videos",
          "authors": "Ragusa et al.",
          "venue": "WACV 2021",
          "year": 2020,
          "url": "https://arxiv.org/abs/2010.05654"
        },
        {
          "id": "grauman-ego4d-2022",
          "title": "Ego4D: Around the World in 3,000 Hours of Egocentric Video",
          "authors": "Grauman et al.",
          "venue": "CVPR 2022",
          "year": 2022,
          "url": "https://arxiv.org/abs/2110.07058"
        },
        {
          "id": "li-egoexo4d-2024",
          "title": "Ego-Exo4D: Understanding Skilled Human Activity from First- and Third-Person Perspectives",
          "authors": "Li et al.",
          "venue": "CVPR 2024",
          "year": 2024,
          "url": "https://arxiv.org/abs/2311.18259"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Delivers This Data",
      "paragraphs": [
        "Claru collectors capture first-person video in real retail environments. Unlike ceiling-mounted CCTV datasets, Claru's egocentric perspective matches how shelf-scanning robots perceive their environment. Product-level interaction annotations enable training models that understand shopping behavior at a granular level."
      ]
    }
  ],
  "faqs": [
    {
      "question": "What retail store types are covered?",
      "answer": "Grocery stores, pharmacies, convenience stores, department stores, home improvement stores, and specialty retail, ranging from 2,000 to 100,000+ square feet."
    },
    {
      "question": "How are product interactions annotated?",
      "answer": "Every hand-product contact event is labeled with timestamps, product category, interaction type (pick up, examine, return), and shelf location."
    },
    {
      "question": "Can the data help with planogram compliance?",
      "answer": "Yes. Shelf-state annotations label visible products, positions, and gaps, training models to detect out-of-stock conditions and planogram deviations."
    }
  ],
  "ctaHeading": "Request a Sample Pack",
  "ctaDescription": "Get a curated sample of egocentric retail video data with full annotations to evaluate for your project.",
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
    "totalClips": "70K+",
    "totalHours": "500+",
    "annotationLayers": [
      "Product interaction events",
      "Shelf state classification",
      "Customer path trajectories",
      "Planogram compliance",
      "Hand-product contact",
      "Aisle navigation labels"
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
      "name": "Metrabs Retail",
      "clips": "5K",
      "hours": "15",
      "modalities": "RGB-D",
      "environments": "Lab store",
      "annotations": "Pose, shelves"
    },
    {
      "name": "EgoProceL",
      "clips": "62",
      "hours": "8",
      "modalities": "RGB",
      "environments": "Mixed",
      "annotations": "Procedure steps"
    },
    {
      "name": "Claru Retail",
      "clips": "70K+",
      "hours": "500+",
      "modalities": "RGB, Depth",
      "environments": "25+ store types",
      "annotations": "Products, shelves, paths, hands, navigation"
    }
  ],
  "useCases": [
    {
      "modelType": "Shelf Monitoring Robots",
      "description": "Autonomous shelf scanning and out-of-stock detection using mobile platforms.",
      "exampleModels": [
        "Simbe Tally",
        "Badger Technologies",
        "BossaNova"
      ]
    },
    {
      "modelType": "Shopping Assistant Robots",
      "description": "Customer interaction and in-store navigation assistance.",
      "exampleModels": [
        "Fellow Robots",
        "SoftBank Pepper",
        "LG CLOi"
      ]
    },
    {
      "modelType": "Visual Retail Analytics",
      "description": "Understanding customer behavior and product interaction patterns.",
      "exampleModels": [
        "RetailNext",
        "Trax",
        "Standard AI"
      ]
    }
  ],
  "keyPapers": [
    {
      "id": "ragusa-retail-2020",
      "title": "The MECCANO Dataset: Understanding Human-Object Interactions from Egocentric Videos",
      "authors": "Ragusa et al.",
      "venue": "WACV 2021",
      "year": 2020,
      "url": "https://arxiv.org/abs/2010.05654"
    },
    {
      "id": "grauman-ego4d-2022",
      "title": "Ego4D: Around the World in 3,000 Hours of Egocentric Video",
      "authors": "Grauman et al.",
      "venue": "CVPR 2022",
      "year": 2022,
      "url": "https://arxiv.org/abs/2110.07058"
    },
    {
      "id": "li-egoexo4d-2024",
      "title": "Ego-Exo4D: Understanding Skilled Human Activity from First- and Third-Person Perspectives",
      "authors": "Li et al.",
      "venue": "CVPR 2024",
      "year": 2024,
      "url": "https://arxiv.org/abs/2311.18259"
    }
  ],
  "claruRelevance": "Claru collectors capture first-person video in real retail environments. Unlike ceiling-mounted CCTV datasets, Claru's egocentric perspective matches how shelf-scanning robots perceive their environment. Product-level interaction annotations enable training models that understand shopping behavior at a granular level."
};

export default data;
