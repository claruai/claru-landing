import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  "slug": "egocentric-workshop",
  "metaTitle": "Egocentric Workshop Video Dataset for Robotics AI | Claru",
  "metaDescription": "First-person workshop and maker-space video for training tool-use robots and craft manipulation AI. 40K+ clips across 20+ workshop types.",
  "primaryKeyword": "egocentric workshop video dataset",
  "secondaryKeywords": [
    "egocentric workshop video data",
    "egocentric workshop video training data",
    "workshop robot data",
    "workshop AI training",
    "workshop automation data",
    "tool use robotics dataset",
    "maker-space robot training data",
    "manufacturing manipulation AI"
  ],
  "canonicalPath": "/datasets/egocentric-workshop",
  "h1": "Egocentric Workshop Video Dataset",
  "heroSubtitle": "First-person workshop and maker-space video for training tool-use robots and craft manipulation AI. 40K+ clips across 20+ workshop types with tool grasp, material transformation, and assembly sequence annotations.",
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
      "label": "Egocentric Workshop Video",
      "href": "/datasets/egocentric-workshop"
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
          "value": "280+",
          "label": "Hours captured"
        },
        {
          "value": "20+ workshop types",
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
      "heading": "Why Egocentric Workshop Data Matters for Robotics",
      "paragraphs": [
        "Tool use is one of the defining capabilities that separates general-purpose manipulation robots from simple pick-and-place systems. A robot that can wield a screwdriver, operate a drill press, apply a clamp, or sand a surface unlocks an enormous range of practical applications in manufacturing, maintenance, repair, and craft production. Training these capabilities requires demonstration data that captures the precise grip forces, approach angles, and visual feedback loops that skilled tool users have internalized through years of practice.",
        "Workshop environments encompass the broadest diversity of tool-material interactions found in any single domain: woodworking shops use hand planes, chisels, routers, and table saws; metal shops involve lathes, mills, welders, and grinders; electronics workshops require soldering irons, oscilloscopes, and precision hand tools; automotive shops combine pneumatic tools, hydraulic lifts, and diagnostic equipment. Each workshop type demands different manipulation strategies, force profiles, and safety protocols.",
        "Claru's egocentric workshop dataset captures skilled craftspeople performing genuine tasks in 20+ workshop types: woodworking, metalworking, automotive repair, electronics assembly, 3D printing labs, CNC shops, welding shops, upholstery studios, bicycle repair, plumbing workshops, HVAC service, appliance repair, jewelry making, ceramics studios, glass blowing, leather working, and general maker-spaces. This breadth is critical because tool-use skills transfer between domains -- a robot that learns proper screwdriver technique in electronics assembly can generalize to furniture assembly if the training data captures sufficient tool diversity.",
        "Research from CoRL 2023 and RSS 2024 shows that tool-use policies trained on diverse egocentric demonstration data exhibit 40-60% better cross-task generalization compared to policies trained in simulation or on single-workshop data, because real-world tool use involves material-dependent feedback (the resistance of hardwood vs. softwood, the yield point of different metals) that simulation cannot faithfully reproduce."
      ]
    },
    {
      "type": "prose",
      "heading": "Sensor Configuration and Collection Methodology",
      "paragraphs": [
        "Collection uses head-mounted GoPro HERO12 cameras with protective housings rated for workshop environments (impact-resistant polycarbonate with anti-fog ventilation). Depth from co-mounted Intel RealSense D455 provides aligned RGB-D at the 0.2-1.5m working distance typical for bench and machine work. For environments with excessive vibration (machine shops during cutting operations), a secondary body-mounted IMU (Xsens MTi-630) provides supplementary motion data for vibration rejection in post-processing.",
        "Collectors are experienced craftspeople, technicians, and tradespeople performing genuine workshop tasks on real projects. Sessions last 45-90 minutes and cover complete task sequences: a full woodworking joint (measuring, marking, cutting, fitting, gluing, clamping), a complete electronic circuit assembly (component placement, soldering, inspection, testing), or an automotive brake job (disassembly, inspection, component swap, reassembly, bleeding, testing). This ensures the data captures the full decision chain, including the inspection and verification steps that distinguish skilled work from novice attempts.",
        "Workshop metadata includes facility type, primary materials being worked, tool inventory with photographs, project type and complexity level, and ambient conditions (temperature, humidity, dust level, ventilation type). For machine tool operations, spindle speed, feed rate, and material grade are recorded when available. This metadata enables researchers to correlate manipulation strategies with material properties and machine settings.",
        "The dataset captures the full range of workshop conditions: the fine dust of woodworking shops, the metallic particle haze of grinding operations, the bright arc light of welding (through auto-darkening filters), the steam of heat-treating, the close-range precision of electronics work under magnification, and the oil-film visual distortion common in automotive and machining environments. These challenging visual conditions are exactly what workshop robots must handle reliably."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Comparison with Public Datasets",
      "description": "How Claru's egocentric workshop dataset compares to publicly available alternatives for tool-use robotics and manufacturing AI.",
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
          "Dataset": "Assembly101 (CVPR 2022)",
          "Clips": "~4K sequences",
          "Hours": "~513",
          "Modalities": "RGB (multi-view)",
          "Environments": "Toy assembly (single)",
          "Annotations": "Fine-grained assembly actions"
        },
        {
          "Dataset": "Ego4D (Hand-Object, 2022)",
          "Clips": "~10K segments",
          "Hours": "~50 (subset)",
          "Modalities": "RGB",
          "Environments": "Mixed activities",
          "Annotations": "Hand-object contacts, state changes"
        },
        {
          "Dataset": "IndustReal (ICRA 2023)",
          "Clips": "~1K",
          "Hours": "~10",
          "Modalities": "RGB-D",
          "Environments": "Industrial assembly jigs",
          "Annotations": "Insertion, threading tasks"
        },
        {
          "Dataset": "Claru Egocentric Workshop",
          "Clips": "40K+",
          "Hours": "280+",
          "Modalities": "RGB-D, IMU",
          "Environments": "20+ workshop types",
          "Annotations": "Tool grasps, material state, assembly, safety, techniques"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Annotation Pipeline and Quality Assurance",
      "paragraphs": [
        "Stage one automated pre-labeling applies DINOv2 for tool and material segmentation, SAM2 for instance-level masks of tools, workpieces, and fasteners, and a custom tool-state classifier that detects whether tools are idle, being gripped, in active use, or being returned to storage. DepthAnything V2 supplements hardware depth for reflective metal surfaces and transparent materials (acrylic, glass) where stereo matching fails.",
        "Stage two human annotation is performed by annotators with workshop experience. They add: tool-use action taxonomy (110+ verbs covering measuring, marking, cutting, shaping, joining, finishing, and assembly operations across all workshop types), grasp type classification using the Feix taxonomy adapted for tool use (power grasp, precision pinch, hook grip, lateral pinch, and tool-specific grips like trigger pull and torque wrench hold), material state tracking (stock, measured, marked, cut, shaped, joined, finished), and safety event annotations (eye protection, hearing protection, guard usage, lockout-tagout).",
        "Stage three QA achieves 95%+ agreement on action boundaries, 94%+ on tool identification (critical because workshop robots must select the correct tool), and 96%+ on safety event detection. Tool identification is particularly challenging because many workshop tools look similar in the egocentric view (different screwdriver types, various plier configurations, multiple wrench sizes) -- annotators with trade experience are essential for accurate labeling.",
        "The complete taxonomy covers 110+ workshop action verbs (measure, scribe, crosscut, rip, dado, rabbet, mortise, tenon, braze, sweat, crimp, chase, ream), 90+ tool categories across all workshop types, 40+ material types with state attributes, grasp classifications per the Feix taxonomy, and 12 workshop safety compliance categories. This depth enables training models that can select appropriate tools, plan multi-step fabrication sequences, and execute skilled manipulation techniques."
      ]
    },
    {
      "type": "cards",
      "heading": "Use Cases",
      "cards": [
        {
          "title": "Tool-Use Manipulation Policies",
          "description": "Training robot arms to wield hand and power tools with appropriate grip, force, and technique. Egocentric demonstrations from skilled craftspeople capture the force modulation and visual feedback patterns that define competent tool use. Example architectures: RT-2, Diffusion Policy, ACT, pi0."
        },
        {
          "title": "Assembly Sequence Planning",
          "description": "Learning multi-step assembly and fabrication sequences from expert demonstrations. Models observe how skilled workers decompose complex builds into ordered operations, select appropriate tools for each step, and verify quality at each stage. Applications in manufacturing co-bots and automated assembly systems."
        },
        {
          "title": "Material State Understanding",
          "description": "Training models to recognize material transformations during workshop processes: raw stock through measured, marked, cut, shaped, joined, and finished states. Critical for robots that must assess work progress, detect defects, and determine when a process step is complete."
        }
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "sener-assembly101-2022",
          "title": "Assembly101: A Large-Scale Multi-View Video Dataset for Understanding Procedural Activities",
          "authors": "Sener et al.",
          "venue": "CVPR 2022",
          "year": 2022,
          "url": "https://arxiv.org/abs/2203.14712"
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
          "id": "fang-anygrasp-2023",
          "title": "AnyGrasp: Robust and Efficient Grasp Perception in Spatial and Temporal Domains",
          "authors": "Fang et al.",
          "venue": "IEEE T-RO 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2212.08333"
        },
        {
          "id": "team-pi0-2024",
          "title": "pi0: A Vision-Language-Action Flow Model for General Robot Control",
          "authors": "Physical Intelligence",
          "venue": "arXiv 2024",
          "year": 2024,
          "url": "https://arxiv.org/abs/2410.24164"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Delivers This Data",
      "paragraphs": [
        "Claru's collector network includes skilled craftspeople and technicians across 20+ workshop types, from traditional woodworking shops to modern FabLabs and CNC facilities. This breadth enables collection of the tool diversity and material variety that tool-use robots need for cross-domain generalization -- a single large-scale collection campaign can capture data spanning hand tools, power tools, and machine tools across multiple material families.",
        "Custom campaigns can target specific workshop types (woodworking, metalworking, electronics, automotive), tool categories (hand tools only, or power tool focus), material types, or skill levels (apprentice through master craftsperson). Turnaround from campaign specification to annotated delivery is typically 4-6 weeks for standard volumes.",
        "Data is delivered in your preferred format with full sensor calibration data, tool inventories, and material specifications. Grasp type annotations are available as a separate layer for teams working specifically on grasp planning. All format conversions (RLDS, HDF5, WebDataset, LeRobot, custom schemas) are handled at no additional cost."
      ]
    }
  ],
  "faqs": [
    {
      "question": "What workshop types are covered?",
      "answer": "20+ types including woodworking, metalworking, automotive repair, electronics assembly, 3D printing labs, CNC shops, welding, upholstery, bicycle repair, plumbing, HVAC, appliance repair, jewelry making, ceramics, glass, leather working, and general maker-spaces."
    },
    {
      "question": "How many tool categories are annotated?",
      "answer": "90+ tool categories spanning hand tools (chisels, planes, screwdrivers, wrenches, pliers), power tools (drills, saws, grinders, sanders, routers), machine tools (lathes, mills, drill presses), and specialty tools unique to specific trades. Each tool instance includes grasp type classification."
    },
    {
      "question": "Does the dataset include grasp type annotations?",
      "answer": "Yes. Every tool-use instance is annotated with grasp type following the Feix taxonomy adapted for tool use: power grasp, precision pinch, hook grip, lateral pinch, and tool-specific grips. This enables training grasp planning models alongside manipulation policies."
    },
    {
      "question": "Can I request data for specific skill levels?",
      "answer": "Yes. Collections can target specific skill levels from apprentice to master craftsperson. Skill-stratified data is valuable for learning both competent technique (from experts) and common error patterns (from apprentices) that robots should recognize and avoid."
    },
    {
      "question": "Is machine tool operation included?",
      "answer": "Yes. The dataset includes lathe, mill, drill press, table saw, band saw, and CNC operations. Machine tool clips include spindle speed and feed rate metadata when available, and capture the setup, operation, and workpiece inspection phases of machine operations."
    }
  ],
  "ctaHeading": "Request a Sample Pack",
  "ctaDescription": "Get a curated sample of egocentric workshop video with tool-use and material transformation annotations to evaluate for your robotics or manufacturing project.",
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
    "totalClips": "40K+",
    "totalHours": "280+",
    "annotationLayers": [
      "Tool-use action segments (110+ verbs)",
      "Grasp type classification (Feix taxonomy)",
      "Tool identification and state (90+ categories)",
      "Material state tracking (stock through finished)",
      "Hand-object interaction contacts",
      "Assembly sequence and dependency graphs",
      "Instance segmentation (tools, workpieces, fasteners)",
      "Workshop safety compliance events",
      "Depth maps (hardware + monocular)",
      "Machine tool parameters metadata",
      "Workpiece quality inspection annotations"
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
      "name": "Assembly101",
      "clips": "~4K sequences",
      "hours": "~513",
      "modalities": "RGB (multi-view)",
      "environments": "Toy assembly (single)",
      "annotations": "Fine-grained assembly actions"
    },
    {
      "name": "Ego4D Hand-Object subset",
      "clips": "~10K segments",
      "hours": "~50",
      "modalities": "RGB",
      "environments": "Mixed activities",
      "annotations": "Hand-object contacts, state changes"
    },
    {
      "name": "IndustReal",
      "clips": "~1K",
      "hours": "~10",
      "modalities": "RGB-D",
      "environments": "Industrial assembly jigs",
      "annotations": "Insertion, threading tasks"
    },
    {
      "name": "Claru Egocentric Workshop",
      "clips": "40K+",
      "hours": "280+",
      "modalities": "RGB-D, IMU",
      "environments": "20+ workshop types",
      "annotations": "Tool grasps, material state, assembly, safety, techniques"
    }
  ],
  "useCases": [
    {
      "modelType": "Tool-Use Manipulation Policies",
      "description": "Training robot arms to wield hand and power tools with appropriate grip, force, and technique using skilled craftsperson demonstrations.",
      "exampleModels": [
        "RT-2",
        "Diffusion Policy",
        "ACT",
        "pi0"
      ]
    },
    {
      "modelType": "Assembly Sequence Planning",
      "description": "Learning multi-step fabrication and assembly sequences from expert demonstrations, including tool selection and quality verification at each stage.",
      "exampleModels": [
        "SayCan",
        "PALM-E",
        "OpenVLA",
        "Inner Monologue"
      ]
    },
    {
      "modelType": "Material State Understanding",
      "description": "Recognizing material transformations during workshop processes for work progress assessment, defect detection, and process completion verification.",
      "exampleModels": [
        "DINOv2",
        "Florence-2",
        "Mask2Former",
        "InternVL"
      ]
    }
  ],
  "keyPapers": [
    {
      "id": "sener-assembly101-2022",
      "title": "Assembly101: A Large-Scale Multi-View Video Dataset for Understanding Procedural Activities",
      "authors": "Sener et al.",
      "venue": "CVPR 2022",
      "year": 2022,
      "url": "https://arxiv.org/abs/2203.14712"
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
      "id": "fang-anygrasp-2023",
      "title": "AnyGrasp: Robust and Efficient Grasp Perception in Spatial and Temporal Domains",
      "authors": "Fang et al.",
      "venue": "IEEE T-RO 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2212.08333"
    },
    {
      "id": "team-pi0-2024",
      "title": "pi0: A Vision-Language-Action Flow Model for General Robot Control",
      "authors": "Physical Intelligence",
      "venue": "arXiv 2024",
      "year": 2024,
      "url": "https://arxiv.org/abs/2410.24164"
    }
  ],
  "claruRelevance": "Claru's collector network includes skilled craftspeople and technicians across 20+ workshop types, capturing the diverse tool-material interactions that tool-use robots require for cross-domain generalization. Dense annotations covering 110+ action verbs, 90+ tool categories with grasp types, material state tracking, and assembly sequences enable training manipulation policies that can wield tools with appropriate technique and plan multi-step fabrication tasks."
};

export default data;
