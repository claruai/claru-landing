import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  "slug": "egocentric-restaurant",
  "metaTitle": "Egocentric Restaurant Video Dataset for Robotics AI | Claru",
  "metaDescription": "First-person restaurant environment video for training food service robots and hospitality automation. 45K+ clips across 15+ restaurant types.",
  "primaryKeyword": "egocentric restaurant video dataset",
  "secondaryKeywords": [
    "egocentric restaurant video data",
    "egocentric restaurant video training data",
    "restaurant robot data",
    "restaurant AI training",
    "restaurant automation data",
    "food service robotics dataset",
    "kitchen robot training data",
    "hospitality automation AI"
  ],
  "canonicalPath": "/datasets/egocentric-restaurant",
  "h1": "Egocentric Restaurant Video Dataset",
  "heroSubtitle": "First-person restaurant environment video for training food service robots and hospitality automation. 45K+ clips across 15+ restaurant types with food handling, plating, and service workflow annotations.",
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
      "label": "Egocentric Restaurant Video",
      "href": "/datasets/egocentric-restaurant"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "Dataset at a Glance",
      "stats": [
        {
          "value": "45K+",
          "label": "Video clips"
        },
        {
          "value": "300+",
          "label": "Hours captured"
        },
        {
          "value": "15+ restaurant types",
          "label": "Environments"
        },
        {
          "value": "11+",
          "label": "Annotation layers"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Why Egocentric Restaurant Data Matters for Robotics",
      "paragraphs": [
        "Food service is one of the fastest-growing markets for robotic automation, driven by labor shortages and the repetitive nature of commercial kitchen and front-of-house tasks. Robots like Bear Robotics Servi, Miso Robotics Flippy, and Richtech Robotics Adam are already deployed in restaurants, but current systems are limited to narrow tasks because they lack the training data needed for generalized food handling, plating, and service workflows. The manipulation complexity of food preparation -- soft deformable ingredients, precise portioning, aesthetic plating, and strict hygiene protocols -- demands training data from the perspective of experienced food service professionals.",
        "Academic kitchen datasets like EPIC-KITCHENS focus on home cooking in residential settings. While valuable for general activity recognition research, they miss the commercial-scale dynamics that restaurant robots encounter: simultaneous ticket management, high-volume batch preparation, strict food safety timing (temperature danger zones), commercial equipment operation (convection ovens, salamanders, immersion circulators), and the coordination between kitchen and front-of-house that defines restaurant service flow.",
        "Claru's egocentric restaurant dataset captures the full spectrum of commercial food service operations across 15+ restaurant types: fast-casual, fine dining, QSR chains, hotel banquet kitchens, cafe and bakery operations, food trucks, ghost kitchens, and institutional cafeterias. Each environment type presents distinct manipulation challenges -- a sushi restaurant requires entirely different dexterity and plating precision than a burger line, and both differ from the batch-scale operations of a hospital cafeteria.",
        "The egocentric perspective captures critical visual cues that food service professionals rely on: the color and texture changes that indicate cooking doneness, the subtle resistance feedback visible in knife technique, the spatial awareness needed to navigate crowded commercial kitchens, and the precise hand-eye coordination of garnishing and plating. These visual patterns are invisible in overhead surveillance footage but are exactly what food service robots need to learn."
      ]
    },
    {
      "type": "prose",
      "heading": "Sensor Configuration and Collection Methodology",
      "paragraphs": [
        "Collection uses chest-mounted GoPro HERO12 cameras in food-safe silicone housings, positioned to capture the hand workspace at the typical counter height (36 inches) where most food preparation occurs. Depth from co-mounted Intel RealSense D455 provides aligned RGB-D at the 0.3-1.2m working distance typical for food prep surfaces. All camera housings are NSF-certified food-safe materials that can be sanitized between sessions using standard restaurant cleaning protocols.",
        "Collectors are active food service professionals -- line cooks, prep cooks, baristas, pastry chefs, servers, bartenders, and kitchen managers -- performing genuine tasks during actual service periods. Sessions capture both prep work (mise en place, batch cooking, dough preparation) and live service (ticket execution, plating, expediting, table service). Collection occurs during real business hours to capture authentic time pressure, multi-ticket management, and the environmental conditions (steam, grease, heat) of operating commercial kitchens.",
        "Metadata recorded for every session includes restaurant type, station position (grill, saute, fry, prep, pastry, bar, expo), menu category being prepared, time of day, service volume level (slow/steady/rush), and an equipment manifest. Kitchen layout sketches document station positions and traffic flow patterns. For front-of-house clips, table layouts and service sequences are logged.",
        "The dataset spans the full environmental range of commercial food service: the intense heat and steam of grill and saute stations, the cold precision of pastry and garde manger, the rapid motion blur of rush-hour line work, the variable lighting from commercial hood ventilation systems, and the cluttered visual complexity of active commercial kitchens where dozens of ingredients, tools, and plates occupy every surface simultaneously."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Comparison with Public Datasets",
      "description": "How Claru's egocentric restaurant dataset compares to publicly available alternatives for food service robotics.",
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
          "Dataset": "EPIC-KITCHENS-100 (IJCV 2022)",
          "Clips": "~90K segments",
          "Hours": "~100",
          "Modalities": "RGB",
          "Environments": "45 home kitchens",
          "Annotations": "Verb-noun actions"
        },
        {
          "Dataset": "YouCook2 (AAAI 2018)",
          "Clips": "~2K videos",
          "Hours": "~176",
          "Modalities": "RGB (YouTube)",
          "Environments": "Home cooking",
          "Annotations": "Recipe steps, descriptions"
        },
        {
          "Dataset": "50 Salads (2013)",
          "Clips": "50 videos",
          "Hours": "~4",
          "Modalities": "RGB-D, accelerometer",
          "Environments": "Lab kitchen",
          "Annotations": "Fine-grained actions"
        },
        {
          "Dataset": "Claru Egocentric Restaurant",
          "Clips": "45K+",
          "Hours": "300+",
          "Modalities": "RGB-D",
          "Environments": "15+ restaurant types",
          "Annotations": "Food state, plating, service flow, tools, hygiene, hand-object"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Annotation Pipeline and Quality Assurance",
      "paragraphs": [
        "Stage one automated pre-labeling applies DINOv2 for ingredient and tool segmentation, SAM2 for instance-level food item and utensil masks, and a custom food-state classifier trained to distinguish raw, cooking, and finished states for common commercial ingredients. Automated thermal zone estimation uses visual cues (steam, color change, surface texture) to flag potential food safety timing events.",
        "Stage two human annotation is performed by annotators with commercial food service experience (ServSafe certified or equivalent). They add domain-specific labels: food preparation action taxonomy (100+ verbs covering cutting techniques, cooking methods, plating movements, and service actions), ingredient state tracking (raw, marinating, cooking, resting, plated, garnished), equipment operation phases, food safety compliance indicators (handwashing, glove changes, temperature checks, cross-contamination risks), and service workflow stages (ticket receive, prep, cook, plate, expo check, serve).",
        "Stage three QA targets 95%+ agreement on action boundaries, 93%+ IoU on food item segmentation, and 97%+ on food safety event detection (food safety annotations are treated as safety-critical, similar to healthcare data). Clips from fine dining environments receive additional plating aesthetics annotations -- garnish placement, sauce distribution, portion geometry -- from annotators with culinary arts training.",
        "The complete taxonomy covers 100+ food service action verbs (julienne, brunoise, saute, deglaze, plate, garnish, bus, reset), 70+ ingredient categories with state attributes, 30+ kitchen tool and equipment types, 15 food safety compliance checkpoints, and 8 service workflow phases. This annotation depth enables training models that understand not just food manipulation mechanics, but the quality standards and safety protocols that define professional food service."
      ]
    },
    {
      "type": "cards",
      "heading": "Use Cases",
      "cards": [
        {
          "title": "Kitchen Manipulation Policies",
          "description": "Training robot arms for food preparation tasks: cutting, portioning, mixing, cooking, and plating. Egocentric demonstrations from professional cooks capture the force modulation, timing cues, and visual quality checks that define skilled food preparation. Example systems: Miso Robotics Flippy, Dexai Robotics Alfred."
        },
        {
          "title": "Food Service Workflow Automation",
          "description": "Optimizing commercial kitchen operations through automated task sequencing, ticket management, and prep scheduling. Models learn the multi-task coordination patterns of experienced kitchen teams during different service volume levels."
        },
        {
          "title": "Food Safety Monitoring",
          "description": "Real-time detection of food safety compliance events: handwashing frequency, glove changes, temperature checks, cross-contamination risks, and time-temperature abuse. The egocentric perspective enables personal safety monitoring for individual food handlers in commercial operations."
        }
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "damen-epic-kitchens-2022",
          "title": "Rescaling Egocentric Vision: Collection, Pipeline and Challenges for EPIC-KITCHENS-100",
          "authors": "Damen et al.",
          "venue": "IJCV 2022",
          "year": 2022,
          "url": "https://arxiv.org/abs/2006.13256"
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
          "id": "zhao-learning-cooking-2023",
          "title": "Learning to Cook: Manipulation of Deformable Food Objects",
          "authors": "Zhao et al.",
          "venue": "ICRA 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2306.07019"
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
        "Claru's collector network includes active food service professionals across 15+ restaurant types in major metropolitan markets. Collection captures the full diversity of commercial food service -- from high-volume QSR lines processing hundreds of orders per hour to fine dining kitchens where a single plate may involve 15 minutes of precision plating. This breadth is essential for training food service robots that must adapt to different operational tempos and quality standards.",
        "Custom campaigns can target specific restaurant types (QSR, fast-casual, fine dining), kitchen stations (grill, saute, pastry, bar), food categories (Asian cuisine knife work, Italian pasta preparation, bakery operations), or front-of-house service tasks. Turnaround from campaign specification to annotated delivery is typically 4-6 weeks.",
        "Data is delivered in your preferred format with all sensor streams time-synchronized. Food safety annotations are available as separate layers that can be included or excluded based on your use case. Annotation exports support RLDS, HDF5, WebDataset, LeRobot, and custom schemas."
      ]
    }
  ],
  "faqs": [
    {
      "question": "What restaurant types are covered?",
      "answer": "15+ types including fast-casual, fine dining, QSR chains, hotel banquet kitchens, cafes, bakeries, food trucks, ghost kitchens, institutional cafeterias, pizzerias, sushi restaurants, taco shops, and barbecue operations. Each type presents distinct manipulation challenges and operational patterns."
    },
    {
      "question": "How does this differ from EPIC-KITCHENS?",
      "answer": "EPIC-KITCHENS captures home cooking in residential kitchens. Claru's dataset captures commercial food service with professional-grade equipment, high-volume operations, multi-ticket coordination, food safety protocols, and the time pressure of live restaurant service. The manipulation skills, equipment, and operational dynamics are fundamentally different."
    },
    {
      "question": "Are food safety annotations included?",
      "answer": "Yes. Every clip includes food safety compliance annotations: handwashing events, glove changes, temperature checks, cross-contamination risks, and time-temperature tracking for perishable ingredients. These annotations are aligned with ServSafe and HACCP standards."
    },
    {
      "question": "Can I request data from specific kitchen stations or cuisine types?",
      "answer": "Yes. Custom campaigns can target specific stations (grill, saute, prep, pastry, bar, expo), cuisine types, or service contexts (prep vs. rush hour vs. closing procedures). Contact us with your requirements for scoping."
    },
    {
      "question": "Is the data captured during actual restaurant service?",
      "answer": "Yes. Collection occurs during real business hours with active ticket flow. This captures authentic time pressure, multi-task coordination, environmental conditions (steam, heat, grease), and the realistic pacing of commercial food service operations."
    }
  ],
  "ctaHeading": "Request a Sample Pack",
  "ctaDescription": "Get a curated sample of egocentric restaurant video with food handling and service workflow annotations to evaluate for your food service robotics project.",
  "relatedGlossaryTerms": [
    "egocentric-video",
    "activity-annotation",
    "temporal-annotation"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "datasetProfile": {
    "modalities": [
      "rgb",
      "depth"
    ],
    "totalClips": "45K+",
    "totalHours": "300+",
    "annotationLayers": [
      "Food preparation actions (100+ verbs)",
      "Ingredient state tracking (raw through plated)",
      "Plating and presentation annotations",
      "Kitchen tool and equipment usage (30+ types)",
      "Food safety compliance checkpoints (15 types)",
      "Hand-object interaction contacts",
      "Instance segmentation (ingredients, tools, plates)",
      "Service workflow phases",
      "Depth maps (hardware RealSense D455)",
      "Station and service metadata",
      "Multi-ticket coordination events"
    ],
    "formats": [
      "RLDS",
      "HDF5",
      "WebDataset",
      "LeRobot",
      "MP4+JSON",
      "COCO"
    ],
    "resolution": "1920x1080",
    "fps": "30 fps"
  },
  "comparisonWithPublic": [
    {
      "name": "EPIC-KITCHENS-100",
      "clips": "~90K segments",
      "hours": "~100",
      "modalities": "RGB",
      "environments": "45 home kitchens",
      "annotations": "Verb-noun actions"
    },
    {
      "name": "YouCook2",
      "clips": "~2K videos",
      "hours": "~176",
      "modalities": "RGB (YouTube)",
      "environments": "Home cooking",
      "annotations": "Recipe steps, descriptions"
    },
    {
      "name": "50 Salads",
      "clips": "50 videos",
      "hours": "~4",
      "modalities": "RGB-D, accelerometer",
      "environments": "Lab kitchen",
      "annotations": "Fine-grained actions"
    },
    {
      "name": "Claru Egocentric Restaurant",
      "clips": "45K+",
      "hours": "300+",
      "modalities": "RGB-D",
      "environments": "15+ restaurant types",
      "annotations": "Food state, plating, service flow, tools, hygiene, hand-object"
    }
  ],
  "useCases": [
    {
      "modelType": "Kitchen Manipulation Policies",
      "description": "Training robot arms for cutting, portioning, cooking, and plating tasks using professional cook egocentric demonstrations.",
      "exampleModels": [
        "RT-2",
        "Diffusion Policy",
        "ACT",
        "pi0"
      ]
    },
    {
      "modelType": "Food Service Workflow Automation",
      "description": "Multi-task kitchen coordination, ticket management, and prep scheduling from experienced kitchen team demonstrations.",
      "exampleModels": [
        "OpenVLA",
        "Octo",
        "SayCan",
        "PALM-E"
      ]
    },
    {
      "modelType": "Food Safety Monitoring",
      "description": "Real-time food safety compliance detection including handwashing, temperature abuse, and cross-contamination risk from wearable camera perspectives.",
      "exampleModels": [
        "YOLOv8",
        "Florence-2",
        "InternVL",
        "DINOv2"
      ]
    }
  ],
  "keyPapers": [
    {
      "id": "damen-epic-kitchens-2022",
      "title": "Rescaling Egocentric Vision: Collection, Pipeline and Challenges for EPIC-KITCHENS-100",
      "authors": "Damen et al.",
      "venue": "IJCV 2022",
      "year": 2022,
      "url": "https://arxiv.org/abs/2006.13256"
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
      "id": "zhao-learning-cooking-2023",
      "title": "Learning to Cook: Manipulation of Deformable Food Objects",
      "authors": "Zhao et al.",
      "venue": "ICRA 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2306.07019"
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
  "claruRelevance": "Claru's collector network includes active food service professionals across 15+ restaurant types, capturing the commercial-scale food handling, plating precision, and service coordination that food service robots require. Unlike home cooking datasets, the data reflects professional-grade equipment operation, high-volume service pressure, food safety compliance, and the diverse manipulation skills needed across cuisine types and restaurant formats."
};

export default data;
