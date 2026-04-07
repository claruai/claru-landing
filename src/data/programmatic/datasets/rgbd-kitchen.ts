import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  "slug": "rgbd-kitchen",
  "metaTitle": "RGB-D Kitchen Dataset for Robotics AI | Claru",
  "metaDescription": "Paired RGB and depth video from kitchen environments for depth-aware robot training. 50K+ clips with registered depth maps.",
  "primaryKeyword": "rgbd kitchen dataset",
  "secondaryKeywords": [
    "rgb-d kitchen data",
    "depth sensor kitchen dataset",
    "3D kitchen scene understanding",
    "kitchen robot depth data",
    "rgbd manipulation data",
    "depth-aware cooking robot"
  ],
  "canonicalPath": "/datasets/rgbd-kitchen",
  "h1": "RGB-D Kitchen Dataset",
  "heroSubtitle": "Paired RGB and depth video from real kitchen environments with registered depth maps and 3D annotations for training depth-aware kitchen robots.",
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
      "label": "RGB-D Kitchen",
      "href": "/datasets/rgbd-kitchen"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "Dataset at a Glance",
      "stats": [
        {
          "value": "50K+",
          "label": "Video clips"
        },
        {
          "value": "350+",
          "label": "Hours recorded"
        },
        {
          "value": "30+ kitchens",
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
          "Dataset": "ScanNet",
          "Clips": "1.5K scans",
          "Hours": "~5",
          "Modalities": "RGB-D",
          "Environments": "707 rooms",
          "Annotations": "3D segmentation"
        },
        {
          "Dataset": "NYU Depth V2",
          "Clips": "1.4K",
          "Hours": "~2",
          "Modalities": "RGB-D",
          "Environments": "464 scenes",
          "Annotations": "Depth, segmentation"
        },
        {
          "Dataset": "Claru RGB-D Kitchen",
          "Clips": "50K+",
          "Hours": "350+",
          "Modalities": "RGB-D",
          "Environments": "30+ kitchens",
          "Annotations": "Depth, 3D reconstruction, objects, surfaces"
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Use Cases",
      "cards": [
        {
          "title": "Depth-Aware Manipulation",
          "description": "Using depth for reach planning and collision avoidance in cluttered kitchens. Example models: UniDepth, DepthAnything, ICP grasping."
        },
        {
          "title": "3D Scene Understanding",
          "description": "Building 3D kitchen representations for spatial reasoning. Example models: ScanNet++, Habitat, iGibson."
        },
        {
          "title": "Transparent Object Detection",
          "description": "Using depth discontinuities to detect glass and clear objects. Example models: ClearGrasp, TransCG, Dex-NeRF."
        }
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "dai-scannet-2017",
          "title": "ScanNet: Richly-annotated 3D Reconstructions of Indoor Scenes",
          "authors": "Dai et al.",
          "venue": "CVPR 2017",
          "year": 2017,
          "url": "https://arxiv.org/abs/1702.04405"
        },
        {
          "id": "yang-depth-2024",
          "title": "Depth Anything: Unleashing the Power of Large-Scale Unlabeled Data",
          "authors": "Yang et al.",
          "venue": "CVPR 2024",
          "year": 2024,
          "url": "https://arxiv.org/abs/2401.10891"
        },
        {
          "id": "sajjan-cleargrasp-2020",
          "title": "ClearGrasp: 3D Shape Estimation of Transparent Objects",
          "authors": "Sajjan et al.",
          "venue": "ICRA 2020",
          "year": 2020,
          "url": "https://arxiv.org/abs/1910.02550"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Delivers This Data",
      "paragraphs": [
        "Claru captures synchronized RGB-D data using Intel RealSense cameras with factory-calibrated registration. Kitchen-specific depth data captures challenging geometry: reflective steel, transparent glass, and steam."
      ]
    }
  ],
  "faqs": [
    {
      "question": "What depth sensor is used?",
      "answer": "Intel RealSense D435/D455 at 848x480 depth, synchronized with 1920x1080 RGB at 30fps."
    },
    {
      "question": "How are reflective surfaces handled?",
      "answer": "Processing flags low-confidence depth regions and provides confidence maps. Transparent objects get supplementary boundary annotations."
    },
    {
      "question": "Can depth data be used for 3D reconstruction?",
      "answer": "Yes. Camera parameters enable point cloud generation and TSDF reconstruction. Pre-computed meshes available for a subset."
    }
  ],
  "ctaHeading": "Request a Sample Pack",
  "ctaDescription": "Get a curated sample of rgb-d kitchen data with full annotations to evaluate for your project.",
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
    "totalClips": "50K+",
    "totalHours": "350+",
    "annotationLayers": [
      "Registered depth maps",
      "3D surface reconstruction",
      "Object segmentation with depth",
      "Surface plane estimation",
      "Volumetric occupancy",
      "Distance measurements"
    ],
    "formats": [
      "RLDS",
      "HDF5",
      "WebDataset",
      "Open3D",
      "EXR+MP4"
    ],
    "resolution": "1920x1080 RGB / 848x480 Depth",
    "fps": "30 fps"
  },
  "comparisonWithPublic": [
    {
      "name": "ScanNet",
      "clips": "1.5K scans",
      "hours": "~5",
      "modalities": "RGB-D",
      "environments": "707 rooms",
      "annotations": "3D segmentation"
    },
    {
      "name": "NYU Depth V2",
      "clips": "1.4K",
      "hours": "~2",
      "modalities": "RGB-D",
      "environments": "464 scenes",
      "annotations": "Depth, segmentation"
    },
    {
      "name": "Claru RGB-D Kitchen",
      "clips": "50K+",
      "hours": "350+",
      "modalities": "RGB-D",
      "environments": "30+ kitchens",
      "annotations": "Depth, 3D reconstruction, objects, surfaces"
    }
  ],
  "useCases": [
    {
      "modelType": "Depth-Aware Manipulation",
      "description": "Using depth for reach planning and collision avoidance in cluttered kitchens.",
      "exampleModels": [
        "UniDepth",
        "DepthAnything",
        "ICP grasping"
      ]
    },
    {
      "modelType": "3D Scene Understanding",
      "description": "Building 3D kitchen representations for spatial reasoning.",
      "exampleModels": [
        "ScanNet++",
        "Habitat",
        "iGibson"
      ]
    },
    {
      "modelType": "Transparent Object Detection",
      "description": "Using depth discontinuities to detect glass and clear objects.",
      "exampleModels": [
        "ClearGrasp",
        "TransCG",
        "Dex-NeRF"
      ]
    }
  ],
  "keyPapers": [
    {
      "id": "dai-scannet-2017",
      "title": "ScanNet: Richly-annotated 3D Reconstructions of Indoor Scenes",
      "authors": "Dai et al.",
      "venue": "CVPR 2017",
      "year": 2017,
      "url": "https://arxiv.org/abs/1702.04405"
    },
    {
      "id": "yang-depth-2024",
      "title": "Depth Anything: Unleashing the Power of Large-Scale Unlabeled Data",
      "authors": "Yang et al.",
      "venue": "CVPR 2024",
      "year": 2024,
      "url": "https://arxiv.org/abs/2401.10891"
    },
    {
      "id": "sajjan-cleargrasp-2020",
      "title": "ClearGrasp: 3D Shape Estimation of Transparent Objects",
      "authors": "Sajjan et al.",
      "venue": "ICRA 2020",
      "year": 2020,
      "url": "https://arxiv.org/abs/1910.02550"
    }
  ],
  "claruRelevance": "Claru captures synchronized RGB-D data using Intel RealSense cameras with factory-calibrated registration. Kitchen-specific depth data captures challenging geometry: reflective steel, transparent glass, and steam."
};

export default data;
