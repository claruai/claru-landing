import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  "slug": "multi-view-manipulation",
  "metaTitle": "Multi-View Manipulation Dataset for Robotics AI | Claru",
  "metaDescription": "Synchronized multi-camera robot manipulation recordings for 3D-aware policy training. 40K+ trajectories with 3-5 camera angles.",
  "primaryKeyword": "multi-view manipulation dataset",
  "secondaryKeywords": [
    "multi-view robot data",
    "3D manipulation dataset",
    "multi-camera robot training",
    "spatial manipulation data",
    "3D-aware policy training",
    "multi-view grasping data"
  ],
  "canonicalPath": "/datasets/multi-view-manipulation",
  "h1": "Multi-View Manipulation Dataset",
  "heroSubtitle": "Synchronized multi-camera robot manipulation recordings — 3-5 calibrated viewpoints — with 3D annotations for training spatial manipulation policies.",
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
      "label": "Multi-View Manipulation",
      "href": "/datasets/multi-view-manipulation"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "Dataset at a Glance",
      "stats": [
        {
          "value": "40K+",
          "label": "Video clips"
        },
        {
          "value": "250+",
          "label": "Hours recorded"
        },
        {
          "value": "20+ setups",
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
          "Modalities": "RGB-D (sim)",
          "Environments": "Simulated",
          "Annotations": "Actions, keypoints"
        },
        {
          "Dataset": "ManiSkill2",
          "Clips": "200K",
          "Hours": "~100",
          "Modalities": "RGB-D (sim)",
          "Environments": "Simulated",
          "Annotations": "Actions, rewards"
        },
        {
          "Dataset": "Claru Multi-View",
          "Clips": "40K+",
          "Hours": "250+",
          "Modalities": "RGB, Depth, PC",
          "Environments": "20+ real setups",
          "Annotations": "3D poses, actions, camera params"
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Use Cases",
      "cards": [
        {
          "title": "3D-Aware Policies",
          "description": "Policies that reason about full 3D geometry for robust grasping. Example models: PerAct, Act3D, 3D Diffusion Policy."
        },
        {
          "title": "Neural Radiance Fields",
          "description": "Scene representations from multi-view captures for robotics. Example models: NeRF-RL, Ditto, F3RM."
        },
        {
          "title": "Point Cloud Manipulation",
          "description": "Direct 3D processing for manipulation planning. Example models: PointNet++, Contact-GraspNet, VoxPoser."
        }
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "shridhar-peract-2023",
          "title": "Perceiver-Actor: A Multi-Task Transformer for Robotic Manipulation",
          "authors": "Shridhar et al.",
          "venue": "CoRL 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2209.05451"
        },
        {
          "id": "gervet-act3d-2023",
          "title": "Act3D: 3D Feature Field Transformers for Multi-Task Robotic Manipulation",
          "authors": "Gervet et al.",
          "venue": "CoRL 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2306.17817"
        },
        {
          "id": "ze-3ddp-2024",
          "title": "3D Diffusion Policy",
          "authors": "Ze et al.",
          "venue": "RSS 2024",
          "year": 2024,
          "url": "https://arxiv.org/abs/2403.03954"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Delivers This Data",
      "paragraphs": [
        "Claru's multi-view rigs use 3-5 calibrated RGB-D cameras with precise calibration enabling registered point cloud reconstruction. This bridges the gap between simulation-heavy 3D datasets and real-world needs."
      ]
    }
  ],
  "faqs": [
    {
      "question": "How many cameras per scene?",
      "answer": "3 to 5 calibrated RGB-D cameras with full extrinsic/intrinsic parameters per frame."
    },
    {
      "question": "What 3D annotations are included?",
      "answer": "6-DoF object poses, 3D bounding boxes, registered point clouds, surface normals, and camera-to-world transformations."
    },
    {
      "question": "Compatible with NeRF/3DGS?",
      "answer": "Yes. Multi-view images with known camera parameters are directly usable for NeRF, 3D Gaussian Splatting, and other neural 3D methods."
    }
  ],
  "ctaHeading": "Request a Sample Pack",
  "ctaDescription": "Get a curated sample of multi-view manipulation data with full annotations to evaluate for your project.",
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
    "totalClips": "40K+",
    "totalHours": "250+",
    "annotationLayers": [
      "Camera extrinsics/intrinsics",
      "3D object poses",
      "Joint trajectories",
      "Gripper states",
      "3D bounding boxes",
      "Surface normals"
    ],
    "formats": [
      "RLDS",
      "HDF5",
      "zarr",
      "Open3D"
    ],
    "resolution": "1280x720 per camera",
    "fps": "30 fps"
  },
  "comparisonWithPublic": [
    {
      "name": "RLBench",
      "clips": "100K",
      "hours": "~50",
      "modalities": "RGB-D (sim)",
      "environments": "Simulated",
      "annotations": "Actions, keypoints"
    },
    {
      "name": "ManiSkill2",
      "clips": "200K",
      "hours": "~100",
      "modalities": "RGB-D (sim)",
      "environments": "Simulated",
      "annotations": "Actions, rewards"
    },
    {
      "name": "Claru Multi-View",
      "clips": "40K+",
      "hours": "250+",
      "modalities": "RGB, Depth, PC",
      "environments": "20+ real setups",
      "annotations": "3D poses, actions, camera params"
    }
  ],
  "useCases": [
    {
      "modelType": "3D-Aware Policies",
      "description": "Policies that reason about full 3D geometry for robust grasping.",
      "exampleModels": [
        "PerAct",
        "Act3D",
        "3D Diffusion Policy"
      ]
    },
    {
      "modelType": "Neural Radiance Fields",
      "description": "Scene representations from multi-view captures for robotics.",
      "exampleModels": [
        "NeRF-RL",
        "Ditto",
        "F3RM"
      ]
    },
    {
      "modelType": "Point Cloud Manipulation",
      "description": "Direct 3D processing for manipulation planning.",
      "exampleModels": [
        "PointNet++",
        "Contact-GraspNet",
        "VoxPoser"
      ]
    }
  ],
  "keyPapers": [
    {
      "id": "shridhar-peract-2023",
      "title": "Perceiver-Actor: A Multi-Task Transformer for Robotic Manipulation",
      "authors": "Shridhar et al.",
      "venue": "CoRL 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2209.05451"
    },
    {
      "id": "gervet-act3d-2023",
      "title": "Act3D: 3D Feature Field Transformers for Multi-Task Robotic Manipulation",
      "authors": "Gervet et al.",
      "venue": "CoRL 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2306.17817"
    },
    {
      "id": "ze-3ddp-2024",
      "title": "3D Diffusion Policy",
      "authors": "Ze et al.",
      "venue": "RSS 2024",
      "year": 2024,
      "url": "https://arxiv.org/abs/2403.03954"
    }
  ],
  "claruRelevance": "Claru's multi-view rigs use 3-5 calibrated RGB-D cameras with precise calibration enabling registered point cloud reconstruction. This bridges the gap between simulation-heavy 3D datasets and real-world needs."
};

export default data;
