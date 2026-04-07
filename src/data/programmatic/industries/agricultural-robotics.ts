import type { IndustryPageData } from "./types";

const data: IndustryPageData = {
  "slug": "agricultural-robotics",
  "metaTitle": "Agricultural Robotics Training Data | Claru",
  "metaDescription": "Training data for agricultural robots: harvesting, weeding, crop monitoring, and livestock management. Diverse crop types, seasons, and terrain conditions.",
  "primaryKeyword": "agricultural robotics training data",
  "secondaryKeywords": [
    "agricultural robotics data",
    "agricultural robotics AI data",
    "agricultural robotics AI",
    "agricultural robotics datasets"
  ],
  "canonicalPath": "/industries/agricultural-robotics",
  "h1": "Agricultural Robotics Training Data",
  "heroSubtitle": "Training data for agricultural robots: harvesting, weeding, crop monitoring, and livestock management. Diverse crop types, seasons, and terrain conditions.",
  "breadcrumbs": [
    {
      "label": "Home",
      "href": "/"
    },
    {
      "label": "Industries",
      "href": "/industries"
    },
    {
      "label": "Agricultural Robotics",
      "href": "/industries/agricultural-robotics"
    }
  ],
  "sections": [
    {
      "type": "cards",
      "heading": "Regulatory Requirements",
      "cards": [
        {
          "title": "EPA Regulations (United States)",
          "description": "Environmental Protection Agency rules on pesticide application and environmental monitoring. Data for autonomous spraying systems must include spray drift modeling data and non-target species identification training."
        },
        {
          "title": "EU CAP Cross-Compliance (European Union)",
          "description": "Common Agricultural Policy environmental and animal welfare standards. Agricultural robots operating under EU CAP must demonstrate compliance with environmental buffer zones and wildlife protection areas."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Environment Characteristics",
      "cards": [
        {
          "title": "Open-Field Conditions",
          "description": "Unstructured outdoor environments with variable weather, lighting, and terrain. Data challenge: Extreme lighting variation (dawn to noon), dust, rain, and fog degrade camera sensors. GPS accuracy varies with tree canopy cover."
        },
        {
          "title": "Seasonal Variation",
          "description": "Crops change appearance dramatically across growth stages and seasons. Data challenge: Models must generalize across growth stages. Training data must span the full growing season for each crop type."
        },
        {
          "title": "Organic Material Complexity",
          "description": "Plants, soil, insects, and fungi present highly variable visual appearance. Data challenge: Distinguishing crops from weeds, healthy from diseased tissue, and ripe from unripe fruit requires training data with expert botanical annotations."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Common Robotics Tasks",
      "cards": [
        {
          "title": "Autonomous Harvesting",
          "description": "Identifying ripe produce and executing gentle picks without damaging fruit or plant. Data requirements: Close-up RGB-D video of fruit/vegetable clusters at various ripeness stages, 6-DoF pick trajectories, force profiles for gentle grasping."
        },
        {
          "title": "Precision Weeding",
          "description": "Identifying and targeting individual weeds among crops for mechanical or chemical removal. Data requirements: High-res overhead and oblique images with per-plant species labels. Multi-spectral data for early-stage weed detection."
        },
        {
          "title": "Crop Health Monitoring",
          "description": "Detecting disease, nutrient deficiency, pest damage, and irrigation stress from aerial and ground imagery. Data requirements: Multi-temporal aerial imagery (drone) and ground-level photos with pathologist-labeled disease annotations."
        },
        {
          "title": "Livestock Monitoring",
          "description": "Tracking animal health, behavior, and location for welfare monitoring and herd management. Data requirements: Multi-camera barn/pasture video with individual animal tracking, behavior classification, and health indicator labels."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Relevant Data Modalities",
      "paragraphs": [
        "RGB video, Multispectral, Thermal, LiDAR, GPS/RTK are the primary data modalities for agricultural robotics training data. Each modality captures different aspects of the agricultural robotics environment, and the optimal sensor mix depends on the specific robotic application."
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "vougioukas-ag-robot-2019",
          "title": "Agricultural Robotics: An Overview",
          "authors": "Vougioukas",
          "venue": "Annual Review of Control, Robotics 2019",
          "year": 2019,
          "url": "https://www.annualreviews.org/doi/abs/10.1146/annurev-control-053018-023617"
        },
        {
          "id": "sa-weedmap-2018",
          "title": "WeedMap: A Large-Scale Semantic Weed Mapping Framework",
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
      "heading": "How Claru Serves This Industry",
      "paragraphs": [
        "Claru captures agricultural data across 15+ crop types and multiple growing seasons. Our field collection teams operate drone rigs for aerial coverage and ground-level sensor platforms for close-up crop interaction data. Annotations are reviewed by agricultural scientists for botanical accuracy."
      ]
    }
  ],
  "faqs": [
    {
      "question": "What crop types does Claru cover?",
      "answer": "Currently 15+ crops including corn, wheat, soybeans, cotton, vineyards, orchards (apple, citrus), leafy greens, berries, and specialty vegetables. Custom crop collection available on request."
    },
    {
      "question": "Does the data span multiple growing seasons?",
      "answer": "Yes. Multi-seasonal collection captures each crop from planting through harvest, including the visual variation that single-season datasets miss."
    },
    {
      "question": "What sensor platforms are used for agricultural data?",
      "answer": "DJI Matrice drones with RGB and multispectral cameras for aerial views, and ground-level rigs with RealSense depth cameras, thermal cameras, and RTK GPS for field-level data."
    },
    {
      "question": "How are weed species identified in annotations?",
      "answer": "Weed annotations are reviewed by agronomists who identify species from visual characteristics. Common species are labeled at species level; rare specimens at genus level."
    },
    {
      "question": "Is nighttime data available for greenhouse operations?",
      "answer": "Yes. Greenhouse collection includes artificial lighting conditions relevant to year-round growing operations."
    }
  ],
  "ctaHeading": "Discuss Agricultural Robotics Data Needs",
  "ctaDescription": "Tell us about your agricultural robotics project. Claru will scope a data collection and annotation plan tailored to your requirements.",
  "relatedGlossaryTerms": [
    "embodied-ai",
    "physical-ai",
    "teleoperation-data"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "regulations": [
    {
      "name": "EPA Regulations",
      "jurisdiction": "United States",
      "description": "Environmental Protection Agency rules on pesticide application and environmental monitoring.",
      "dataImplications": "Data for autonomous spraying systems must include spray drift modeling data and non-target species identification training."
    },
    {
      "name": "EU CAP Cross-Compliance",
      "jurisdiction": "European Union",
      "description": "Common Agricultural Policy environmental and animal welfare standards.",
      "dataImplications": "Agricultural robots operating under EU CAP must demonstrate compliance with environmental buffer zones and wildlife protection areas."
    }
  ],
  "environmentCharacteristics": [
    {
      "characteristic": "Open-Field Conditions",
      "description": "Unstructured outdoor environments with variable weather, lighting, and terrain.",
      "dataChallenge": "Extreme lighting variation (dawn to noon), dust, rain, and fog degrade camera sensors. GPS accuracy varies with tree canopy cover."
    },
    {
      "characteristic": "Seasonal Variation",
      "description": "Crops change appearance dramatically across growth stages and seasons.",
      "dataChallenge": "Models must generalize across growth stages. Training data must span the full growing season for each crop type."
    },
    {
      "characteristic": "Organic Material Complexity",
      "description": "Plants, soil, insects, and fungi present highly variable visual appearance.",
      "dataChallenge": "Distinguishing crops from weeds, healthy from diseased tissue, and ripe from unripe fruit requires training data with expert botanical annotations."
    }
  ],
  "commonTasks": [
    {
      "task": "Autonomous Harvesting",
      "description": "Identifying ripe produce and executing gentle picks without damaging fruit or plant.",
      "dataRequirements": "Close-up RGB-D video of fruit/vegetable clusters at various ripeness stages, 6-DoF pick trajectories, force profiles for gentle grasping."
    },
    {
      "task": "Precision Weeding",
      "description": "Identifying and targeting individual weeds among crops for mechanical or chemical removal.",
      "dataRequirements": "High-res overhead and oblique images with per-plant species labels. Multi-spectral data for early-stage weed detection."
    },
    {
      "task": "Crop Health Monitoring",
      "description": "Detecting disease, nutrient deficiency, pest damage, and irrigation stress from aerial and ground imagery.",
      "dataRequirements": "Multi-temporal aerial imagery (drone) and ground-level photos with pathologist-labeled disease annotations."
    },
    {
      "task": "Livestock Monitoring",
      "description": "Tracking animal health, behavior, and location for welfare monitoring and herd management.",
      "dataRequirements": "Multi-camera barn/pasture video with individual animal tracking, behavior classification, and health indicator labels."
    }
  ],
  "relevantModalities": [
    "RGB video",
    "Multispectral",
    "Thermal",
    "LiDAR",
    "GPS/RTK"
  ],
  "keyPapers": [
    {
      "id": "vougioukas-ag-robot-2019",
      "title": "Agricultural Robotics: An Overview",
      "authors": "Vougioukas",
      "venue": "Annual Review of Control, Robotics 2019",
      "year": 2019,
      "url": "https://www.annualreviews.org/doi/abs/10.1146/annurev-control-053018-023617"
    },
    {
      "id": "sa-weedmap-2018",
      "title": "WeedMap: A Large-Scale Semantic Weed Mapping Framework",
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
  "claruRelevance": "Claru captures agricultural data across 15+ crop types and multiple growing seasons. Our field collection teams operate drone rigs for aerial coverage and ground-level sensor platforms for close-up crop interaction data. Annotations are reviewed by agricultural scientists for botanical accuracy."
};

export default data;
