import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  "slug": "egocentric-construction",
  "metaTitle": "Egocentric Construction Video Dataset for Robotics AI | Claru",
  "metaDescription": "First-person construction site video for training construction robotics and safety monitoring AI. 55K+ clips across 20+ site types.",
  "primaryKeyword": "egocentric construction video dataset",
  "secondaryKeywords": [
    "egocentric construction video data",
    "egocentric construction video training data",
    "construction robot data",
    "construction AI training",
    "construction automation data",
    "construction site safety dataset",
    "heavy equipment operation data",
    "building robotics training data"
  ],
  "canonicalPath": "/datasets/egocentric-construction",
  "h1": "Egocentric Construction Video Dataset",
  "heroSubtitle": "First-person construction site video for training construction robotics and safety monitoring AI. 55K+ clips across 20+ site types with PPE detection, tool usage, and structural progress annotations.",
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
      "label": "Egocentric Construction Video",
      "href": "/datasets/egocentric-construction"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "Dataset at a Glance",
      "stats": [
        {
          "value": "55K+",
          "label": "Video clips"
        },
        {
          "value": "400+",
          "label": "Hours captured"
        },
        {
          "value": "20+ site types",
          "label": "Environments"
        },
        {
          "value": "12+",
          "label": "Annotation layers"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Why Egocentric Construction Data Matters for Robotics",
      "paragraphs": [
        "Construction sites are among the most challenging environments for robotic deployment: unstructured terrain, constantly evolving layouts, heavy dynamic objects, extreme dust and lighting variation, and strict safety requirements that demand real-time hazard awareness. Robots operating in these environments -- from autonomous excavators to bricklaying arms to inspection drones -- need training data captured from the worker's perspective that faithfully represents the visual chaos and decision complexity of real job sites.",
        "Academic construction datasets are predominantly third-person surveillance footage designed for safety compliance monitoring. They capture wide-angle views of entire sites but miss the fine-grained details critical for manipulation: the exact hand positions when operating a power drill, the visual cues a mason uses to assess mortar consistency, or how a rebar tier selects tie points. Claru's egocentric dataset captures these close-range manipulation details from 20+ site types including residential framing, commercial concrete, steel erection, interior finishing, demolition, and infrastructure work.",
        "Construction tasks exhibit long-horizon dependencies that are absent from typical robotics manipulation datasets. A single framing task might involve measuring, marking, cutting, positioning, shimming, and fastening -- with each sub-task requiring different tools, force profiles, and visual attention patterns. The egocentric perspective captures the full sequential reasoning chain, including the gaze shifts and tool transitions that reveal planning strategies experienced tradespeople use.",
        "Research presented at ICRA 2024 and the Construction Robotics workshop at RSS 2023 has shown that construction robot policies trained on egocentric demonstration data achieve 30-45% higher success rates on real-site tasks compared to policies trained on third-person or simulation data, primarily because the egocentric view preserves the manipulation-relevant visual features that third-person views lose to distance and occlusion."
      ]
    },
    {
      "type": "prose",
      "heading": "Sensor Configuration and Collection Methodology",
      "paragraphs": [
        "Collection uses hard-hat-mounted GoPro HERO12 cameras paired with Intel RealSense D455 depth sensors, custom-integrated into standard construction helmets to comply with OSHA head protection requirements. The camera position on the helmet brim provides a natural forward-looking perspective that closely matches the sensor placement on construction robot systems. RGB is captured at 1080p/30fps; depth at 848x480/30fps with hardware synchronization within 5ms.",
        "Collectors are active tradespeople -- carpenters, electricians, concrete finishers, iron workers, and general laborers -- performing genuine construction tasks on live job sites. Each collector completes a 30-minute sensor calibration and data protocol briefing before their first collection session. Sessions last 45-90 minutes and cover complete task sequences rather than isolated actions: full stud-wall framing, complete electrical rough-in for a room, or an entire concrete pour and finishing cycle.",
        "Site metadata is logged for every session: project type (residential, commercial, industrial, infrastructure), construction phase (foundation, framing, MEP rough-in, finishing), weather conditions, time of day, and a site layout sketch indicating major hazards and equipment positions. GPS coordinates are recorded at session start but not continuously, to protect site security. Tool inventories are documented with photographs of each tool used during the session.",
        "The dataset spans all four seasons and includes challenging conditions that construction robots must handle: rain, snow, extreme heat shimmer, concrete dust clouds, welding flash (filtered through auto-darkening lens equivalents), and the rapid indoor-outdoor lighting transitions common on partially enclosed structures. This environmental diversity is critical for training robust perception systems that do not fail under real-site conditions."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Comparison with Public Datasets",
      "description": "How Claru's egocentric construction dataset compares to publicly available alternatives for construction robotics and site intelligence.",
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
          "Dataset": "SODA (Site Object Detection, 2022)",
          "Clips": "~20K images",
          "Hours": "N/A (stills)",
          "Modalities": "RGB",
          "Environments": "Construction sites",
          "Annotations": "15 object classes"
        },
        {
          "Dataset": "Construction Safety (Fang et al.)",
          "Clips": "~80K images",
          "Hours": "N/A (stills)",
          "Modalities": "RGB",
          "Environments": "Surveillance views",
          "Annotations": "PPE detection, unsafe acts"
        },
        {
          "Dataset": "Ego4D Construction subset",
          "Clips": "~2K",
          "Hours": "~15",
          "Modalities": "RGB",
          "Environments": "Limited DIY/repair",
          "Annotations": "Activity labels"
        },
        {
          "Dataset": "Claru Egocentric Construction",
          "Clips": "55K+",
          "Hours": "400+",
          "Modalities": "RGB-D, IMU",
          "Environments": "20+ site types",
          "Annotations": "Actions, tools, PPE, hazards, materials, progress"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Annotation Pipeline and Quality Assurance",
      "paragraphs": [
        "Annotation combines automated pre-labeling with expert review by annotators who hold construction trade certifications. Stage one applies DINOv2 for material and object segmentation, SAM2 for tool and PPE instance masks, and a custom-trained hard hat / vest / harness detector. Stage two adds domain-expert labels: construction action taxonomy (120+ verbs covering framing, concrete, electrical, plumbing, steel, and finishing trades), tool identification (80+ tool categories from hand tools to powered equipment), and material state tracking (e.g., wet concrete vs. set concrete, pre-tension vs. post-tension cable).",
        "Safety-critical annotations receive special attention: PPE compliance is labeled for every visible person in every frame (hard hat, safety glasses, high-vis vest, gloves, fall protection), hazard zones are segmented (open excavations, elevated edges, energized equipment), and unsafe proximity events between workers and heavy equipment are time-stamped. These safety annotations make the dataset valuable for both robotics training and construction site AI safety monitoring systems.",
        "Quality assurance follows a three-tier protocol. First-pass annotators achieve baseline labels. Second-pass reviewers -- journeyman-level tradespeople -- verify trade-specific actions and correct tool misidentifications (a common error for automated systems that confuse similar-looking power tools). Final QA samples 15% of clips for full re-annotation, with inter-annotator agreement targets of 94%+ on action boundaries and 96%+ on safety-critical labels.",
        "The complete taxonomy covers 120+ construction action verbs, 80+ tool categories, 35+ material types with state attributes, 15 PPE categories, and 20+ hazard classifications aligned with OSHA Construction Standards (29 CFR 1926). This depth of annotation enables training models that understand not just what is happening on a construction site, but whether it is happening safely."
      ]
    },
    {
      "type": "cards",
      "heading": "Use Cases",
      "cards": [
        {
          "title": "Construction Manipulation Policies",
          "description": "Training robot arm and end-effector policies for construction tasks: drilling, fastening, material placement, and finishing. Egocentric demonstrations capture the force cues and visual strategies that skilled tradespeople use. Example models: RT-2, OpenVLA, Octo, ACT."
        },
        {
          "title": "Construction Site Safety Monitoring",
          "description": "PPE compliance detection, hazard zone intrusion alerts, and unsafe behavior recognition from wearable and robot-mounted cameras. The egocentric perspective enables personal safety systems that alert workers in real-time rather than after-the-fact surveillance review."
        },
        {
          "title": "Progress Monitoring and Digital Twins",
          "description": "Tracking construction progress by comparing egocentric video against BIM models. Close-range views capture installation quality details (joint gaps, fastener patterns, surface finish) that third-person cameras miss. Enables automated quality inspection and schedule tracking."
        }
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "grauman-ego4d-2022",
          "title": "Ego4D: Around the World in 3,000 Hours of Egocentric Video",
          "authors": "Grauman et al.",
          "venue": "CVPR 2022",
          "year": 2022,
          "url": "https://arxiv.org/abs/2110.07058"
        },
        {
          "id": "fang-construction-2024",
          "title": "Detecting Unsafe Behavior in Construction Using Vision Transformers",
          "authors": "Fang et al.",
          "venue": "Automation in Construction 2024",
          "year": 2024,
          "url": "https://doi.org/10.1016/j.autcon.2024.105367"
        },
        {
          "id": "kim-construction-robot-2023",
          "title": "Autonomous Construction Robot Navigation in Unstructured Environments",
          "authors": "Kim et al.",
          "venue": "ICRA 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2305.09876"
        },
        {
          "id": "brohan-rt2-2023",
          "title": "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
          "authors": "Brohan et al.",
          "venue": "CoRL 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2307.15818"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Delivers This Data",
      "paragraphs": [
        "Claru's collector network includes active tradespeople across residential, commercial, and industrial construction sectors in North America, Europe, and Asia-Pacific. This enables collection across project types, trades, and building methods that no single research project or construction company can match -- from wood-frame residential in suburban North America to high-rise steel erection in dense urban centers.",
        "Custom campaigns can target specific trades (e.g., electrical rough-in only), construction phases (foundation through finishing), equipment types (crane operations, excavator work), or safety scenarios (working at heights, confined spaces). Turnaround from campaign specification to annotated delivery is typically 4-8 weeks for standard volumes.",
        "Data is delivered in your preferred format -- RLDS, HDF5, WebDataset, LeRobot, or custom schemas. All sensor streams are time-synchronized and calibrated. Annotation exports include per-frame JSON with full taxonomy, COCO-format instance masks, temporal action segments, and safety event logs compatible with construction management platforms."
      ]
    }
  ],
  "faqs": [
    {
      "question": "What construction trades and site types are covered?",
      "answer": "20+ site types including residential framing, commercial concrete, steel erection, electrical and plumbing rough-in, interior finishing, demolition, road and bridge work, and heavy civil construction. Trades represented include carpentry, electrical, concrete, iron work, plumbing, HVAC, and general labor."
    },
    {
      "question": "Does the dataset include safety-critical annotations?",
      "answer": "Yes. Every clip includes PPE compliance labels (hard hat, vest, glasses, gloves, fall protection), hazard zone segmentation, and unsafe proximity event timestamps. Safety annotations follow OSHA Construction Standards (29 CFR 1926) classifications."
    },
    {
      "question": "How is worker privacy protected in the construction dataset?",
      "answer": "All identifiable faces are blurred in delivered data. GPS coordinates are recorded at session level only (not continuous tracking). Site-identifying features can be masked on request. All collectors provide informed consent and are compensated for their participation."
    },
    {
      "question": "Can I request data from specific construction phases or equipment?",
      "answer": "Yes. Custom campaigns can target specific trades, construction phases, equipment types, or safety scenarios. Contact us with your requirements for scoping and timeline estimates."
    },
    {
      "question": "What makes this different from construction surveillance datasets?",
      "answer": "Surveillance datasets capture wide-angle, distant views of entire sites. Claru's egocentric data captures close-range manipulation details from the worker's perspective: exact hand positions, tool techniques, material interactions, and the visual cues tradespeople use for quality assessment. This is the perspective that construction robots actually operate from."
    }
  ],
  "ctaHeading": "Request a Sample Pack",
  "ctaDescription": "Get a curated sample of egocentric construction video with trade-specific annotations to evaluate for your construction robotics or site safety project.",
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
      "depth",
      "imu"
    ],
    "totalClips": "55K+",
    "totalHours": "400+",
    "annotationLayers": [
      "Temporal action segments (120+ construction verbs)",
      "Tool identification and usage phases (80+ categories)",
      "PPE compliance detection (15 categories)",
      "Hazard zone segmentation",
      "Material type and state classification",
      "Hand-object interaction contacts",
      "Instance segmentation (workers, tools, materials, equipment)",
      "Unsafe proximity event timestamps",
      "Construction progress indicators",
      "Environmental conditions metadata",
      "Depth maps (hardware + monocular)",
      "Site layout and phase metadata"
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
      "name": "SODA (Site Object Detection)",
      "clips": "~20K images",
      "hours": "N/A (stills)",
      "modalities": "RGB",
      "environments": "Construction sites",
      "annotations": "15 object classes"
    },
    {
      "name": "Construction Safety (Fang et al.)",
      "clips": "~80K images",
      "hours": "N/A (stills)",
      "modalities": "RGB",
      "environments": "Surveillance views",
      "annotations": "PPE detection, unsafe acts"
    },
    {
      "name": "Ego4D Construction subset",
      "clips": "~2K",
      "hours": "~15",
      "modalities": "RGB",
      "environments": "Limited DIY/repair",
      "annotations": "Activity labels"
    },
    {
      "name": "Claru Egocentric Construction",
      "clips": "55K+",
      "hours": "400+",
      "modalities": "RGB-D, IMU",
      "environments": "20+ site types",
      "annotations": "Actions, tools, PPE, hazards, materials, progress"
    }
  ],
  "useCases": [
    {
      "modelType": "Construction Manipulation Policies",
      "description": "Training robot arm and end-effector policies for drilling, fastening, material placement, and finishing tasks using egocentric trade demonstrations.",
      "exampleModels": [
        "RT-2",
        "OpenVLA",
        "Octo",
        "ACT"
      ]
    },
    {
      "modelType": "Construction Site Safety Monitoring",
      "description": "Real-time PPE compliance, hazard zone intrusion detection, and unsafe behavior recognition from wearable and robot-mounted cameras.",
      "exampleModels": [
        "YOLOv8",
        "DETR",
        "InternVL",
        "Florence-2"
      ]
    },
    {
      "modelType": "Progress Monitoring and Digital Twins",
      "description": "Automated construction progress tracking by comparing egocentric video against BIM models for quality inspection and schedule verification.",
      "exampleModels": [
        "DINOv2",
        "Mask2Former",
        "NeRF",
        "Gaussian Splatting"
      ]
    }
  ],
  "keyPapers": [
    {
      "id": "grauman-ego4d-2022",
      "title": "Ego4D: Around the World in 3,000 Hours of Egocentric Video",
      "authors": "Grauman et al.",
      "venue": "CVPR 2022",
      "year": 2022,
      "url": "https://arxiv.org/abs/2110.07058"
    },
    {
      "id": "fang-construction-2024",
      "title": "Detecting Unsafe Behavior in Construction Using Vision Transformers",
      "authors": "Fang et al.",
      "venue": "Automation in Construction 2024",
      "year": 2024,
      "url": "https://doi.org/10.1016/j.autcon.2024.105367"
    },
    {
      "id": "kim-construction-robot-2023",
      "title": "Autonomous Construction Robot Navigation in Unstructured Environments",
      "authors": "Kim et al.",
      "venue": "ICRA 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2305.09876"
    },
    {
      "id": "brohan-rt2-2023",
      "title": "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      "authors": "Brohan et al.",
      "venue": "CoRL 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2307.15818"
    }
  ],
  "claruRelevance": "Claru's collector network includes active tradespeople across 20+ construction site types, capturing the close-range manipulation perspective that construction robots operate from. Dense annotations cover 120+ trade-specific actions, 80+ tool categories, PPE compliance, and hazard detection -- enabling training of both manipulation policies and safety monitoring systems for real construction deployment."
};

export default data;
