import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  "slug": "synthetic-manipulation",
  "metaTitle": "Synthetic Manipulation Dataset for Robotics AI | Claru",
  "metaDescription": "Procedurally generated manipulation data from physics simulators with perfect state info. 200K+ trajectories for scalable pre-training.",
  "primaryKeyword": "synthetic manipulation dataset",
  "secondaryKeywords": [
    "synthetic robot data",
    "simulation manipulation data",
    "procedural robot training",
    "MuJoCo training data",
    "simulator generated grasping",
    "scalable robot data"
  ],
  "canonicalPath": "/datasets/synthetic-manipulation",
  "h1": "Synthetic Manipulation Dataset",
  "heroSubtitle": "Procedurally generated manipulation trajectories from physics simulators with perfect state information for scalable robot policy pre-training.",
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
      "label": "Synthetic Manipulation",
      "href": "/datasets/synthetic-manipulation"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "Dataset at a Glance",
      "stats": [
        {
          "value": "200K+",
          "label": "Video clips"
        },
        {
          "value": "1,000+",
          "label": "Hours recorded"
        },
        {
          "value": "100+ procedural scenes",
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
          "Dataset": "RLBench",
          "Clips": "100K",
          "Hours": "~50",
          "Modalities": "RGB-D",
          "Environments": "CoppelaSim",
          "Annotations": "Actions, keypoints"
        },
        {
          "Dataset": "ManiSkill2",
          "Clips": "200K",
          "Hours": "~100",
          "Modalities": "RGB-D",
          "Environments": "SAPIEN",
          "Annotations": "Actions, rewards"
        },
        {
          "Dataset": "Claru Synthetic",
          "Clips": "200K+",
          "Hours": "1,000+",
          "Modalities": "RGB, Depth, PC",
          "Environments": "MuJoCo, Isaac",
          "Annotations": "Perfect state, forces, rewards, contacts"
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Use Cases",
      "cards": [
        {
          "title": "Policy Pre-Training",
          "description": "Massive pre-training in simulation before real-world fine-tuning. Example models: Octo, RT-X, OpenVLA."
        },
        {
          "title": "Reward Model Training",
          "description": "Training reward models on synthetic success/failure examples. Example models: VIP, R3M, LIV."
        },
        {
          "title": "Curriculum Learning",
          "description": "Progressively harder task configurations for staged policy training. Example models: ManiSkill, Isaac Gym, RoboCasa."
        }
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "james-rlbench-2020",
          "title": "RLBench: The Robot Learning Benchmark",
          "authors": "James et al.",
          "venue": "IEEE RA-L 2020",
          "year": 2020,
          "url": "https://arxiv.org/abs/1909.12271"
        },
        {
          "id": "gu-maniskill2-2023",
          "title": "ManiSkill2: A Unified Benchmark for Generalizable Manipulation Skills",
          "authors": "Gu et al.",
          "venue": "ICLR 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2302.04659"
        },
        {
          "id": "makoviychuk-isaac-2021",
          "title": "Isaac Gym: High Performance GPU-Based Physics Simulation",
          "authors": "Makoviychuk et al.",
          "venue": "NeurIPS 2021",
          "year": 2021,
          "url": "https://arxiv.org/abs/2108.10470"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Delivers This Data",
      "paragraphs": [
        "Claru generates synthetic manipulation data using MuJoCo and Isaac Sim with procedural scene randomization. Combined with Claru's real-world data, this enables hybrid training pipelines that maximize both scale and realism."
      ]
    }
  ],
  "faqs": [
    {
      "question": "What simulators are used?",
      "answer": "MuJoCo and NVIDIA Isaac Sim with procedural scene generation for domain randomization."
    },
    {
      "question": "How is domain randomization applied?",
      "answer": "Textures, lighting, object poses, camera angles, and physics parameters are randomized per episode."
    },
    {
      "question": "Can synthetic and real data be mixed?",
      "answer": "Yes. Our format pipeline ensures synthetic and real data share identical action spaces and observation formats for seamless co-training."
    }
  ],
  "ctaHeading": "Request a Sample Pack",
  "ctaDescription": "Get a curated sample of synthetic manipulation data with full annotations to evaluate for your project.",
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
    "totalClips": "200K+",
    "totalHours": "1,000+",
    "annotationLayers": [
      "Perfect joint states",
      "Ground truth object poses",
      "Contact forces",
      "Reward signals",
      "Task completion labels",
      "Collision events"
    ],
    "formats": [
      "RLDS",
      "HDF5",
      "zarr",
      "MuJoCo XML"
    ],
    "resolution": "640x480",
    "fps": "30 fps"
  },
  "comparisonWithPublic": [
    {
      "name": "RLBench",
      "clips": "100K",
      "hours": "~50",
      "modalities": "RGB-D",
      "environments": "CoppelaSim",
      "annotations": "Actions, keypoints"
    },
    {
      "name": "ManiSkill2",
      "clips": "200K",
      "hours": "~100",
      "modalities": "RGB-D",
      "environments": "SAPIEN",
      "annotations": "Actions, rewards"
    },
    {
      "name": "Claru Synthetic",
      "clips": "200K+",
      "hours": "1,000+",
      "modalities": "RGB, Depth, PC",
      "environments": "MuJoCo, Isaac",
      "annotations": "Perfect state, forces, rewards, contacts"
    }
  ],
  "useCases": [
    {
      "modelType": "Policy Pre-Training",
      "description": "Massive pre-training in simulation before real-world fine-tuning.",
      "exampleModels": [
        "Octo",
        "RT-X",
        "OpenVLA"
      ]
    },
    {
      "modelType": "Reward Model Training",
      "description": "Training reward models on synthetic success/failure examples.",
      "exampleModels": [
        "VIP",
        "R3M",
        "LIV"
      ]
    },
    {
      "modelType": "Curriculum Learning",
      "description": "Progressively harder task configurations for staged policy training.",
      "exampleModels": [
        "ManiSkill",
        "Isaac Gym",
        "RoboCasa"
      ]
    }
  ],
  "keyPapers": [
    {
      "id": "james-rlbench-2020",
      "title": "RLBench: The Robot Learning Benchmark",
      "authors": "James et al.",
      "venue": "IEEE RA-L 2020",
      "year": 2020,
      "url": "https://arxiv.org/abs/1909.12271"
    },
    {
      "id": "gu-maniskill2-2023",
      "title": "ManiSkill2: A Unified Benchmark for Generalizable Manipulation Skills",
      "authors": "Gu et al.",
      "venue": "ICLR 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2302.04659"
    },
    {
      "id": "makoviychuk-isaac-2021",
      "title": "Isaac Gym: High Performance GPU-Based Physics Simulation",
      "authors": "Makoviychuk et al.",
      "venue": "NeurIPS 2021",
      "year": 2021,
      "url": "https://arxiv.org/abs/2108.10470"
    }
  ],
  "claruRelevance": "Claru generates synthetic manipulation data using MuJoCo and Isaac Sim with procedural scene randomization. Combined with Claru's real-world data, this enables hybrid training pipelines that maximize both scale and realism."
};

export default data;
