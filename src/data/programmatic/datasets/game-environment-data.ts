import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  "slug": "game-environment-data",
  "metaTitle": "Game Environment Dataset for Robotics AI | Claru",
  "metaDescription": "High-fidelity video from game engines for vision model pre-training and sim-to-real transfer. 66K+ clips with perfect ground truth.",
  "primaryKeyword": "game environment training data",
  "secondaryKeywords": [
    "game engine training data",
    "synthetic environment data",
    "virtual world AI training",
    "sim-to-real pre-training",
    "game video for robotics",
    "procedural environment data"
  ],
  "canonicalPath": "/datasets/game-environment-data",
  "h1": "Game Environment Dataset",
  "heroSubtitle": "High-fidelity video from game engines with pixel-perfect ground truth for pre-training vision models, world models, and sim-to-real transfer.",
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
      "label": "Game Environment",
      "href": "/datasets/game-environment-data"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "Dataset at a Glance",
      "stats": [
        {
          "value": "66K+",
          "label": "Video clips"
        },
        {
          "value": "450+",
          "label": "Hours recorded"
        },
        {
          "value": "50+ environments",
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
          "Dataset": "SYNTHIA",
          "Clips": "13K",
          "Hours": "~5",
          "Modalities": "RGB-D (syn)",
          "Environments": "Urban driving sim",
          "Annotations": "Segmentation"
        },
        {
          "Dataset": "Virtual KITTI",
          "Clips": "21K",
          "Hours": "~2",
          "Modalities": "RGB-D (syn)",
          "Environments": "Driving",
          "Annotations": "Everything (GT)"
        },
        {
          "Dataset": "Claru Game Environments",
          "Clips": "66K+",
          "Hours": "450+",
          "Modalities": "RGB, Depth, PC",
          "Environments": "50+ environments",
          "Annotations": "Perfect GT: depth, seg, flow, normals, poses"
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Use Cases",
      "cards": [
        {
          "title": "Vision Pre-Training",
          "description": "Massive supervised pre-training on perfect labels before real-data fine-tuning. Example models: DINOv2, SigLIP, InternImage."
        },
        {
          "title": "World Model Pre-Training",
          "description": "Physically plausible environments for initializing world models. Example models: Genie 2, UniSim, DIAMOND."
        },
        {
          "title": "Sim-to-Real Transfer",
          "description": "Pre-training on synthetic data reduces real-data requirements by 50-80%. Example models: Domain Randomization, RCAN, Transfer from Play."
        }
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "ros-synthia-2016",
          "title": "The SYNTHIA Dataset for Semantic Segmentation",
          "authors": "Ros et al.",
          "venue": "CVPR 2016",
          "year": 2016,
          "url": "https://arxiv.org/abs/1604.01580"
        },
        {
          "id": "tobin-domain-2017",
          "title": "Domain Randomization for Sim-to-Real Transfer",
          "authors": "Tobin et al.",
          "venue": "IROS 2017",
          "year": 2017,
          "url": "https://arxiv.org/abs/1703.06907"
        },
        {
          "id": "bruce-genie2-2024",
          "title": "Genie 2: A Large-Scale Foundation World Model",
          "authors": "Bruce et al.",
          "venue": "DeepMind 2024",
          "year": 2024,
          "url": "https://deepmind.google/discover/blog/genie-2-a-large-scale-foundation-world-model/"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Delivers This Data",
      "paragraphs": [
        "Claru curates game data from 50+ virtual worlds with UE5/Unity fidelity. All data includes pixel-perfect ground truth annotations impossible to produce manually."
      ]
    }
  ],
  "faqs": [
    {
      "question": "What engines are used?",
      "answer": "Unreal Engine 5, Unity HDRP, and custom pipelines across 50+ environments with PBR materials."
    },
    {
      "question": "How are GT annotations generated?",
      "answer": "Extracted from rendering engine: depth from Z-buffer, segmentation from object IDs, flow from motion vectors."
    },
    {
      "question": "Can this replace real data?",
      "answer": "Best as pre-training, reducing real-data needs by 50-80% when combined with real-world fine-tuning."
    }
  ],
  "ctaHeading": "Request a Sample Pack",
  "ctaDescription": "Get a curated sample of game environment data with full annotations to evaluate for your project.",
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
      "point-cloud"
    ],
    "totalClips": "66K+",
    "totalHours": "450+",
    "annotationLayers": [
      "Perfect depth maps",
      "Semantic segmentation (GT)",
      "Instance segmentation (GT)",
      "Surface normals",
      "Optical flow (GT)",
      "Object 3D poses"
    ],
    "formats": [
      "RLDS",
      "HDF5",
      "WebDataset",
      "EXR+MP4"
    ],
    "resolution": "1920x1080",
    "fps": "30-60 fps"
  },
  "comparisonWithPublic": [
    {
      "name": "SYNTHIA",
      "clips": "13K",
      "hours": "~5",
      "modalities": "RGB-D (syn)",
      "environments": "Urban driving sim",
      "annotations": "Segmentation"
    },
    {
      "name": "Virtual KITTI",
      "clips": "21K",
      "hours": "~2",
      "modalities": "RGB-D (syn)",
      "environments": "Driving",
      "annotations": "Everything (GT)"
    },
    {
      "name": "Claru Game Environments",
      "clips": "66K+",
      "hours": "450+",
      "modalities": "RGB, Depth, PC",
      "environments": "50+ environments",
      "annotations": "Perfect GT: depth, seg, flow, normals, poses"
    }
  ],
  "useCases": [
    {
      "modelType": "Vision Pre-Training",
      "description": "Massive supervised pre-training on perfect labels before real-data fine-tuning.",
      "exampleModels": [
        "DINOv2",
        "SigLIP",
        "InternImage"
      ]
    },
    {
      "modelType": "World Model Pre-Training",
      "description": "Physically plausible environments for initializing world models.",
      "exampleModels": [
        "Genie 2",
        "UniSim",
        "DIAMOND"
      ]
    },
    {
      "modelType": "Sim-to-Real Transfer",
      "description": "Pre-training on synthetic data reduces real-data requirements by 50-80%.",
      "exampleModels": [
        "Domain Randomization",
        "RCAN",
        "Transfer from Play"
      ]
    }
  ],
  "keyPapers": [
    {
      "id": "ros-synthia-2016",
      "title": "The SYNTHIA Dataset for Semantic Segmentation",
      "authors": "Ros et al.",
      "venue": "CVPR 2016",
      "year": 2016,
      "url": "https://arxiv.org/abs/1604.01580"
    },
    {
      "id": "tobin-domain-2017",
      "title": "Domain Randomization for Sim-to-Real Transfer",
      "authors": "Tobin et al.",
      "venue": "IROS 2017",
      "year": 2017,
      "url": "https://arxiv.org/abs/1703.06907"
    },
    {
      "id": "bruce-genie2-2024",
      "title": "Genie 2: A Large-Scale Foundation World Model",
      "authors": "Bruce et al.",
      "venue": "DeepMind 2024",
      "year": 2024,
      "url": "https://deepmind.google/discover/blog/genie-2-a-large-scale-foundation-world-model/"
    }
  ],
  "claruRelevance": "Claru curates game data from 50+ virtual worlds with UE5/Unity fidelity. All data includes pixel-perfect ground truth annotations impossible to produce manually."
};

export default data;
