import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  "slug": "rgbd-manipulation",
  "metaTitle": "RGB-D Manipulation Dataset for Robotics AI | Claru",
  "metaDescription": "Paired RGB and depth recordings of manipulation tasks for depth-aware grasping policies. 65K+ trajectories.",
  "primaryKeyword": "rgbd manipulation dataset",
  "secondaryKeywords": [
    "rgbd grasping dataset",
    "depth manipulation data",
    "3D grasping training data",
    "depth-aware robot policy",
    "rgbd bin picking data",
    "depth manipulation trajectories"
  ],
  "canonicalPath": "/datasets/rgbd-manipulation",
  "h1": "RGB-D Manipulation Dataset",
  "heroSubtitle": "Paired RGB-D recordings of robot manipulation with 3D grasp annotations and force measurements for training depth-aware grasping policies.",
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
      "label": "RGB-D Manipulation",
      "href": "/datasets/rgbd-manipulation"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "Dataset at a Glance",
      "stats": [
        {
          "value": "65K+",
          "label": "Video clips"
        },
        {
          "value": "400+",
          "label": "Hours recorded"
        },
        {
          "value": "30+ setups",
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
          "Dataset": "GraspNet-1Billion",
          "Clips": "97K grasps",
          "Hours": "~10",
          "Modalities": "RGB-D",
          "Environments": "190 scenes (lab)",
          "Annotations": "6-DoF grasps"
        },
        {
          "Dataset": "ACRONYM",
          "Clips": "8.8M grasps",
          "Hours": "N/A (sim)",
          "Modalities": "Synthetic depth",
          "Environments": "Simulated",
          "Annotations": "Grasp labels"
        },
        {
          "Dataset": "Claru RGB-D Manipulation",
          "Clips": "65K+",
          "Hours": "400+",
          "Modalities": "RGB-D, F/T",
          "Environments": "30+ real setups",
          "Annotations": "3D grasps, poses, forces, trajectories"
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Use Cases",
      "cards": [
        {
          "title": "6-DoF Grasp Planning",
          "description": "Predicting stable grasps using depth for geometry estimation. Example models: GraspNet, Contact-GraspNet, AnyGrasp."
        },
        {
          "title": "Depth-Conditioned Policies",
          "description": "Policies using depth for spatial reasoning and collision avoidance. Example models: PerAct, 3D Diffusion Policy, RVT."
        },
        {
          "title": "Object Pose Estimation",
          "description": "Estimating 6-DoF poses from RGB-D for manipulation planning. Example models: FoundationPose, MegaPose, BundleSDF."
        }
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "fang-graspnet-2020",
          "title": "GraspNet-1Billion: A Large-Scale Benchmark for General Object Grasping",
          "authors": "Fang et al.",
          "venue": "CVPR 2020",
          "year": 2020,
          "url": "https://arxiv.org/abs/1912.13470"
        },
        {
          "id": "sundermeyer-contact-2021",
          "title": "Contact-GraspNet: Efficient 6-DoF Grasp Generation",
          "authors": "Sundermeyer et al.",
          "venue": "ICRA 2021",
          "year": 2021,
          "url": "https://arxiv.org/abs/2103.14127"
        },
        {
          "id": "wen-foundationpose-2024",
          "title": "FoundationPose: Unified 6D Pose Estimation and Tracking",
          "authors": "Wen et al.",
          "venue": "CVPR 2024",
          "year": 2024,
          "url": "https://arxiv.org/abs/2312.08344"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Delivers This Data",
      "paragraphs": [
        "Claru captures RGB-D manipulation data with diverse real objects — not just YCB benchmarks. Force/torque sensing adds the contact dynamics dimension pure depth datasets lack."
      ]
    }
  ],
  "faqs": [
    {
      "question": "How accurate is depth-RGB registration?",
      "answer": "Factory-calibrated RealSense cameras with sub-pixel alignment, validated per-session with checkerboard targets."
    },
    {
      "question": "What objects are included?",
      "answer": "500+ unique objects spanning household items, tools, food, and industrial components in varying materials and sizes."
    },
    {
      "question": "How are 3D grasps annotated?",
      "answer": "Force/torque contact detection combined with depth-based 3D localization, recording 6-DoF approach poses and grasp types."
    }
  ],
  "ctaHeading": "Request a Sample Pack",
  "ctaDescription": "Get a curated sample of rgb-d manipulation data with full annotations to evaluate for your project.",
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
    "totalClips": "65K+",
    "totalHours": "400+",
    "annotationLayers": [
      "Registered depth maps",
      "3D grasp contact points",
      "Object 6-DoF poses",
      "Collision-free trajectories",
      "Depth segmentation",
      "Surface normals"
    ],
    "formats": [
      "RLDS",
      "HDF5",
      "zarr",
      "Open3D",
      "EXR+MP4"
    ],
    "resolution": "1280x720 RGB / 640x480 Depth",
    "fps": "30 fps"
  },
  "comparisonWithPublic": [
    {
      "name": "GraspNet-1Billion",
      "clips": "97K grasps",
      "hours": "~10",
      "modalities": "RGB-D",
      "environments": "190 scenes (lab)",
      "annotations": "6-DoF grasps"
    },
    {
      "name": "ACRONYM",
      "clips": "8.8M grasps",
      "hours": "N/A (sim)",
      "modalities": "Synthetic depth",
      "environments": "Simulated",
      "annotations": "Grasp labels"
    },
    {
      "name": "Claru RGB-D Manipulation",
      "clips": "65K+",
      "hours": "400+",
      "modalities": "RGB-D, F/T",
      "environments": "30+ real setups",
      "annotations": "3D grasps, poses, forces, trajectories"
    }
  ],
  "useCases": [
    {
      "modelType": "6-DoF Grasp Planning",
      "description": "Predicting stable grasps using depth for geometry estimation.",
      "exampleModels": [
        "GraspNet",
        "Contact-GraspNet",
        "AnyGrasp"
      ]
    },
    {
      "modelType": "Depth-Conditioned Policies",
      "description": "Policies using depth for spatial reasoning and collision avoidance.",
      "exampleModels": [
        "PerAct",
        "3D Diffusion Policy",
        "RVT"
      ]
    },
    {
      "modelType": "Object Pose Estimation",
      "description": "Estimating 6-DoF poses from RGB-D for manipulation planning.",
      "exampleModels": [
        "FoundationPose",
        "MegaPose",
        "BundleSDF"
      ]
    }
  ],
  "keyPapers": [
    {
      "id": "fang-graspnet-2020",
      "title": "GraspNet-1Billion: A Large-Scale Benchmark for General Object Grasping",
      "authors": "Fang et al.",
      "venue": "CVPR 2020",
      "year": 2020,
      "url": "https://arxiv.org/abs/1912.13470"
    },
    {
      "id": "sundermeyer-contact-2021",
      "title": "Contact-GraspNet: Efficient 6-DoF Grasp Generation",
      "authors": "Sundermeyer et al.",
      "venue": "ICRA 2021",
      "year": 2021,
      "url": "https://arxiv.org/abs/2103.14127"
    },
    {
      "id": "wen-foundationpose-2024",
      "title": "FoundationPose: Unified 6D Pose Estimation and Tracking",
      "authors": "Wen et al.",
      "venue": "CVPR 2024",
      "year": 2024,
      "url": "https://arxiv.org/abs/2312.08344"
    }
  ],
  "claruRelevance": "Claru captures RGB-D manipulation data with diverse real objects — not just YCB benchmarks. Force/torque sensing adds the contact dynamics dimension pure depth datasets lack."
};

export default data;
