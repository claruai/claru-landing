import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  "slug": "aerial-agricultural",
  "metaTitle": "Aerial Agricultural Dataset for Robotics AI | Claru",
  "metaDescription": "Drone-captured agricultural imagery for precision farming and agricultural robotics. 30K+ clips across 15+ crop types.",
  "primaryKeyword": "aerial agricultural dataset",
  "secondaryKeywords": [
    "agricultural drone dataset",
    "precision farming training data",
    "crop monitoring AI data",
    "agricultural robotics dataset",
    "drone crop analysis",
    "aerial farming video"
  ],
  "canonicalPath": "/datasets/aerial-agricultural",
  "h1": "Aerial Agricultural Dataset",
  "heroSubtitle": "Drone-captured agricultural imagery with crop health annotations for training agricultural robotics and precision farming AI.",
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
      "label": "Aerial Agricultural",
      "href": "/datasets/aerial-agricultural"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "Dataset at a Glance",
      "stats": [
        {
          "value": "30K+",
          "label": "Video clips"
        },
        {
          "value": "200+",
          "label": "Hours recorded"
        },
        {
          "value": "15+ crop types",
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
          "Dataset": "Agriculture-Vision",
          "Clips": "94K images",
          "Hours": "N/A",
          "Modalities": "RGB, NIR",
          "Environments": "US farms",
          "Annotations": "9 crop patterns"
        },
        {
          "Dataset": "WeedMap",
          "Clips": "~1K",
          "Hours": "~5",
          "Modalities": "RGB, Multi-spectral",
          "Environments": "Sugar beets",
          "Annotations": "Weed masks"
        },
        {
          "Dataset": "Claru Aerial Ag",
          "Clips": "30K+",
          "Hours": "200+",
          "Modalities": "RGB, Thermal",
          "Environments": "15+ crops",
          "Annotations": "Health, weeds, rows, growth, pests"
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Use Cases",
      "cards": [
        {
          "title": "Crop Health Monitoring",
          "description": "Identifying stressed, diseased, or nutrient-deficient crops from aerial views. Example models: PlantVillage, CropSight, Taranis."
        },
        {
          "title": "Autonomous Spraying",
          "description": "Targeted herbicide and pesticide application using weed detection. Example models: Blue River See & Spray, Ecorobotix, Carbon Robotics."
        },
        {
          "title": "Yield Prediction",
          "description": "Estimating crop yield from growth stage and health indicators. Example models: Descartes Labs, Indigo Agriculture, Gro Intelligence."
        }
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "chiu-agriculture-2020",
          "title": "Agriculture-Vision: A Large Aerial Image Database for Agricultural Pattern Analysis",
          "authors": "Chiu et al.",
          "venue": "CVPR 2020",
          "year": 2020,
          "url": "https://arxiv.org/abs/2001.01306"
        },
        {
          "id": "sa-weedmap-2018",
          "title": "WeedMap: A Large-Scale Semantic Weed Mapping Framework Using Aerial Multispectral Imaging",
          "authors": "Sa et al.",
          "venue": "Remote Sensing 2018",
          "year": 2018,
          "url": "https://www.mdpi.com/2072-4292/10/9/1423"
        },
        {
          "id": "kamilaris-deep-2018",
          "title": "Deep Learning in Agriculture: A Survey",
          "authors": "Kamilaris & Prenafeta-Boldu",
          "venue": "Computers and Electronics in Agriculture 2018",
          "year": 2018,
          "url": "https://arxiv.org/abs/1807.11809"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Delivers This Data",
      "paragraphs": [
        "Claru operates drone collection campaigns across agricultural regions, capturing RGB and thermal imagery over diverse crop types and growth stages. Thermal data reveals irrigation stress invisible to RGB cameras."
      ]
    }
  ],
  "faqs": [
    {
      "question": "What crops are covered?",
      "answer": "15+ crop types including corn, wheat, soybeans, cotton, vineyards, orchards, leafy greens, and specialty crops across different climate zones."
    },
    {
      "question": "Is multispectral data available?",
      "answer": "Currently RGB and thermal. Multispectral (NDVI) collection is available on request for specific projects."
    },
    {
      "question": "What flight altitudes are used?",
      "answer": "Primary collection at 20-50m AGL for crop-level detail, with 100-200m flights for field-level coverage."
    }
  ],
  "ctaHeading": "Request a Sample Pack",
  "ctaDescription": "Get a curated sample of aerial agricultural data with full annotations to evaluate for your project.",
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
      "thermal"
    ],
    "totalClips": "30K+",
    "totalHours": "200+",
    "annotationLayers": [
      "Crop health indices",
      "Weed detection",
      "Row segmentation",
      "Growth stage classification",
      "Irrigation zones",
      "Pest damage regions"
    ],
    "formats": [
      "RLDS",
      "HDF5",
      "WebDataset",
      "GeoTIFF+MP4"
    ],
    "resolution": "4K (3840x2160)",
    "fps": "30 fps"
  },
  "comparisonWithPublic": [
    {
      "name": "Agriculture-Vision",
      "clips": "94K images",
      "hours": "N/A",
      "modalities": "RGB, NIR",
      "environments": "US farms",
      "annotations": "9 crop patterns"
    },
    {
      "name": "WeedMap",
      "clips": "~1K",
      "hours": "~5",
      "modalities": "RGB, Multi-spectral",
      "environments": "Sugar beets",
      "annotations": "Weed masks"
    },
    {
      "name": "Claru Aerial Ag",
      "clips": "30K+",
      "hours": "200+",
      "modalities": "RGB, Thermal",
      "environments": "15+ crops",
      "annotations": "Health, weeds, rows, growth, pests"
    }
  ],
  "useCases": [
    {
      "modelType": "Crop Health Monitoring",
      "description": "Identifying stressed, diseased, or nutrient-deficient crops from aerial views.",
      "exampleModels": [
        "PlantVillage",
        "CropSight",
        "Taranis"
      ]
    },
    {
      "modelType": "Autonomous Spraying",
      "description": "Targeted herbicide and pesticide application using weed detection.",
      "exampleModels": [
        "Blue River See & Spray",
        "Ecorobotix",
        "Carbon Robotics"
      ]
    },
    {
      "modelType": "Yield Prediction",
      "description": "Estimating crop yield from growth stage and health indicators.",
      "exampleModels": [
        "Descartes Labs",
        "Indigo Agriculture",
        "Gro Intelligence"
      ]
    }
  ],
  "keyPapers": [
    {
      "id": "chiu-agriculture-2020",
      "title": "Agriculture-Vision: A Large Aerial Image Database for Agricultural Pattern Analysis",
      "authors": "Chiu et al.",
      "venue": "CVPR 2020",
      "year": 2020,
      "url": "https://arxiv.org/abs/2001.01306"
    },
    {
      "id": "sa-weedmap-2018",
      "title": "WeedMap: A Large-Scale Semantic Weed Mapping Framework Using Aerial Multispectral Imaging",
      "authors": "Sa et al.",
      "venue": "Remote Sensing 2018",
      "year": 2018,
      "url": "https://www.mdpi.com/2072-4292/10/9/1423"
    },
    {
      "id": "kamilaris-deep-2018",
      "title": "Deep Learning in Agriculture: A Survey",
      "authors": "Kamilaris & Prenafeta-Boldu",
      "venue": "Computers and Electronics in Agriculture 2018",
      "year": 2018,
      "url": "https://arxiv.org/abs/1807.11809"
    }
  ],
  "claruRelevance": "Claru operates drone collection campaigns across agricultural regions, capturing RGB and thermal imagery over diverse crop types and growth stages. Thermal data reveals irrigation stress invisible to RGB cameras."
};

export default data;
