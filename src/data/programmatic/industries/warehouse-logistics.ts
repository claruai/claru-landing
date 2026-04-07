import type { IndustryPageData } from "./types";

const data: IndustryPageData = {
  "slug": "warehouse-logistics",
  "metaTitle": "Warehouse & Logistics Robotics Data | Claru",
  "metaDescription": "Training data for warehouse robots: AMRs, pick-and-place, sortation, and inventory management in fulfillment centers and distribution hubs.",
  "primaryKeyword": "warehouse logistics robotics training data",
  "secondaryKeywords": [
    "warehouse logistics robotics data",
    "warehouse logistics robotics AI data",
    "warehouse logistics AI",
    "warehouse logistics datasets"
  ],
  "canonicalPath": "/industries/warehouse-logistics",
  "h1": "Warehouse & Logistics Robotics Data",
  "heroSubtitle": "Training data for warehouse robots: AMRs, pick-and-place, sortation, and inventory management in fulfillment centers and distribution hubs.",
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
      "label": "Warehouse & Logistics Robotics",
      "href": "/industries/warehouse-logistics"
    }
  ],
  "sections": [
    {
      "type": "cards",
      "heading": "Regulatory Requirements",
      "cards": [
        {
          "title": "OSHA Standards (United States)",
          "description": "Occupational Safety and Health Administration warehouse safety requirements. Training data for warehouse robots operating near humans must include near-miss detection and safety zone violation examples for safety-critical model training."
        },
        {
          "title": "ANSI/RIA R15.08 (United States)",
          "description": "Industrial Mobile Robot Safety standard for AMRs. Data must cover the dynamic obstacle scenarios and human interaction patterns specified in R15.08 safety validation requirements."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Environment Characteristics",
      "cards": [
        {
          "title": "High-Density Racking",
          "description": "Narrow aisles with floor-to-ceiling shelving and varying product densities. Data challenge: Limited field of view in narrow aisles, repetitive visual patterns across shelf bays, and dynamic shelf occupancy."
        },
        {
          "title": "Mixed Human-Robot Zones",
          "description": "Warehouse workers and robots sharing operational space. Data challenge: Robust person detection under varying lighting, partial occlusion by carts and equipment, and diverse worker appearances."
        },
        {
          "title": "Variable Lighting",
          "description": "Warehouse lighting ranges from bright loading docks to dim deep-rack areas. Data challenge: Models must handle 10-1000 lux range within a single navigation path."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Common Robotics Tasks",
      "cards": [
        {
          "title": "Autonomous Navigation",
          "description": "Safe navigation of AMRs through warehouse aisles with dynamic obstacles. Data requirements: Egocentric video from robot height, LiDAR scans, floor-plan maps, dynamic obstacle trajectories, and pedestrian intent prediction data."
        },
        {
          "title": "Pick-and-Place",
          "description": "Grasping diverse products from bins and shelves for order fulfillment. Data requirements: Multi-view product images, depth data for bin picking, grasp trajectory recordings across product categories."
        },
        {
          "title": "Inventory Counting",
          "description": "Autonomous shelf scanning for real-time inventory tracking. Data requirements: Shelf-facing images with product detection annotations, barcode readability labels, and empty-slot detection."
        },
        {
          "title": "Sortation",
          "description": "High-speed package sorting by destination zip code, carrier, or priority. Data requirements: Conveyor-view video with package tracking, label OCR ground truth, and destination classification labels."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Relevant Data Modalities",
      "paragraphs": [
        "RGB video, LiDAR, Depth, IMU, Barcode/OCR are the primary data modalities for warehouse & logistics robotics data. Each modality captures different aspects of the warehouse logistics environment, and the optimal sensor mix depends on the specific robotic application."
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "duan-amr-2023",
          "title": "A Survey on Autonomous Mobile Robot Navigation in Warehouses",
          "authors": "Duan et al.",
          "venue": "Robotics and Autonomous Systems 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2308.05040"
        },
        {
          "id": "mahler-dexnet-2019",
          "title": "Learning Ambidextrous Robot Grasping Policies",
          "authors": "Mahler et al.",
          "venue": "Science Robotics 2019",
          "year": 2019,
          "url": "https://arxiv.org/abs/1903.04349"
        },
        {
          "id": "correll-warehouse-2022",
          "title": "Analysis and Review of the State of Warehouse Robotics",
          "authors": "Correll et al.",
          "venue": "Frontiers in Robotics and AI 2022",
          "year": 2022,
          "url": "https://www.frontiersin.org/articles/10.3389/frobt.2022.800029/full"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Serves This Industry",
      "paragraphs": [
        "Claru captures data in active fulfillment centers during normal operations. Our warehouse collection covers major facility configurations (goods-to-person, person-to-goods, shuttle systems) with real product diversity and authentic worker movement patterns."
      ]
    }
  ],
  "faqs": [
    {
      "question": "Are the warehouses real operational facilities?",
      "answer": "Yes. All collection occurs in active warehouses, capturing authentic operations, real product diversity, and genuine human-robot interaction patterns."
    },
    {
      "question": "What AMR platforms does the data support?",
      "answer": "The data is platform-agnostic. Navigation data includes floor-level and elevated viewpoints matching common AMR sensor heights from 0.3m to 1.5m."
    },
    {
      "question": "Is OSHA safety scenario data included?",
      "answer": "Yes. The dataset includes annotated near-miss events, safety zone violations, and human-present navigation scenarios required for safety-critical model validation."
    },
    {
      "question": "What product types are in the pick-and-place data?",
      "answer": "Thousands of real SKUs: boxes, polybags, bottles, blister packs, and irregular items ranging from 50g to 25kg."
    },
    {
      "question": "Can Claru collect in my specific warehouse?",
      "answer": "Yes. Custom collection campaigns in client warehouses are available with NDA protection and custom annotation requirements."
    }
  ],
  "ctaHeading": "Discuss Warehouse & Logistics Robotics Data Needs",
  "ctaDescription": "Tell us about your warehouse logistics project. Claru will scope a data collection and annotation plan tailored to your requirements.",
  "relatedGlossaryTerms": [
    "embodied-ai",
    "physical-ai",
    "teleoperation-data"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "regulations": [
    {
      "name": "OSHA Standards",
      "jurisdiction": "United States",
      "description": "Occupational Safety and Health Administration warehouse safety requirements.",
      "dataImplications": "Training data for warehouse robots operating near humans must include near-miss detection and safety zone violation examples for safety-critical model training."
    },
    {
      "name": "ANSI/RIA R15.08",
      "jurisdiction": "United States",
      "description": "Industrial Mobile Robot Safety standard for AMRs.",
      "dataImplications": "Data must cover the dynamic obstacle scenarios and human interaction patterns specified in R15.08 safety validation requirements."
    }
  ],
  "environmentCharacteristics": [
    {
      "characteristic": "High-Density Racking",
      "description": "Narrow aisles with floor-to-ceiling shelving and varying product densities.",
      "dataChallenge": "Limited field of view in narrow aisles, repetitive visual patterns across shelf bays, and dynamic shelf occupancy."
    },
    {
      "characteristic": "Mixed Human-Robot Zones",
      "description": "Warehouse workers and robots sharing operational space.",
      "dataChallenge": "Robust person detection under varying lighting, partial occlusion by carts and equipment, and diverse worker appearances."
    },
    {
      "characteristic": "Variable Lighting",
      "description": "Warehouse lighting ranges from bright loading docks to dim deep-rack areas.",
      "dataChallenge": "Models must handle 10-1000 lux range within a single navigation path."
    }
  ],
  "commonTasks": [
    {
      "task": "Autonomous Navigation",
      "description": "Safe navigation of AMRs through warehouse aisles with dynamic obstacles.",
      "dataRequirements": "Egocentric video from robot height, LiDAR scans, floor-plan maps, dynamic obstacle trajectories, and pedestrian intent prediction data."
    },
    {
      "task": "Pick-and-Place",
      "description": "Grasping diverse products from bins and shelves for order fulfillment.",
      "dataRequirements": "Multi-view product images, depth data for bin picking, grasp trajectory recordings across product categories."
    },
    {
      "task": "Inventory Counting",
      "description": "Autonomous shelf scanning for real-time inventory tracking.",
      "dataRequirements": "Shelf-facing images with product detection annotations, barcode readability labels, and empty-slot detection."
    },
    {
      "task": "Sortation",
      "description": "High-speed package sorting by destination zip code, carrier, or priority.",
      "dataRequirements": "Conveyor-view video with package tracking, label OCR ground truth, and destination classification labels."
    }
  ],
  "relevantModalities": [
    "RGB video",
    "LiDAR",
    "Depth",
    "IMU",
    "Barcode/OCR"
  ],
  "keyPapers": [
    {
      "id": "duan-amr-2023",
      "title": "A Survey on Autonomous Mobile Robot Navigation in Warehouses",
      "authors": "Duan et al.",
      "venue": "Robotics and Autonomous Systems 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2308.05040"
    },
    {
      "id": "mahler-dexnet-2019",
      "title": "Learning Ambidextrous Robot Grasping Policies",
      "authors": "Mahler et al.",
      "venue": "Science Robotics 2019",
      "year": 2019,
      "url": "https://arxiv.org/abs/1903.04349"
    },
    {
      "id": "correll-warehouse-2022",
      "title": "Analysis and Review of the State of Warehouse Robotics",
      "authors": "Correll et al.",
      "venue": "Frontiers in Robotics and AI 2022",
      "year": 2022,
      "url": "https://www.frontiersin.org/articles/10.3389/frobt.2022.800029/full"
    }
  ],
  "claruRelevance": "Claru captures data in active fulfillment centers during normal operations. Our warehouse collection covers major facility configurations (goods-to-person, person-to-goods, shuttle systems) with real product diversity and authentic worker movement patterns."
};

export default data;
