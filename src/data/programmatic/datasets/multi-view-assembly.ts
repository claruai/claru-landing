import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  "slug": "multi-view-assembly",
  "metaTitle": "Multi-View Assembly Dataset for Robotics AI | Claru",
  "metaDescription": "Synchronized multi-camera recordings of assembly tasks for training 3D-aware assembly and manufacturing policies. 30K+ trajectories.",
  "primaryKeyword": "multi-view assembly dataset",
  "secondaryKeywords": [
    "multi-view assembly data",
    "multi-view assembly training data",
    "assembly robot data",
    "assembly AI training",
    "assembly automation data",
    "multi-camera manufacturing dataset",
    "3D assembly robotics data",
    "factory assembly training data"
  ],
  "canonicalPath": "/datasets/multi-view-assembly",
  "h1": "Multi-View Assembly Dataset",
  "heroSubtitle": "Synchronized multi-camera recordings of assembly tasks for training 3D-aware manipulation policies. 30K+ trajectories across 15+ assembly configurations with part tracking, insertion state, and 3D pose annotations.",
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
      "label": "Multi-View Assembly",
      "href": "/datasets/multi-view-assembly"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "Dataset at a Glance",
      "stats": [
        {
          "value": "30K+",
          "label": "Trajectories"
        },
        {
          "value": "200+",
          "label": "Hours captured"
        },
        {
          "value": "15+ assembly setups",
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
      "heading": "Why Multi-View Assembly Data Matters for Robotics",
      "paragraphs": [
        "Assembly is the core value-creation step in manufacturing: taking individual components and combining them into functional products. It is also one of the hardest manipulation tasks for robots because it requires millimeter-level precision, 6-DoF spatial reasoning, force-sensitive insertion, and the ability to handle parts that may be flexible, threaded, snap-fit, or adhesive-bonded. Multi-view data is essential for assembly robotics because single-camera views suffer from occlusion at exactly the moments that matter most -- when a part is being inserted into a receptacle, when fingers contact a surface, or when a fastener engages a thread.",
        "The multi-view approach provides the 3D geometric information that assembly robots need: depth from stereo triangulation, object pose from multi-angle correspondence, and occlusion-free tracking through viewpoint redundancy. When camera A's view is blocked by the robot's own gripper during insertion, cameras B and C maintain part visibility. This redundancy is not available in single-camera or even stereo datasets, and it is critical for training policies that must reason about 3D geometry during contact-rich manipulation.",
        "Existing multi-view assembly datasets like Assembly101 focus on a single product type (toy take-apart kits) with limited diversity. Real manufacturing assembly spans an enormous range of complexity: PCB component placement, automotive sub-assembly, consumer electronics integration, mechanical fastening, cable routing, and quality inspection. Claru's multi-view assembly dataset captures 15+ distinct assembly configurations across electronics, automotive, consumer goods, and general mechanical assembly, with calibrated multi-camera setups that enable 3D reconstruction and novel view synthesis.",
        "Research from CoRL 2023 and ICRA 2024 demonstrates that assembly policies trained on multi-view data with 3D annotations achieve 50-70% higher success rates on contact-rich insertion tasks compared to single-view policies, with the improvement increasing for tasks requiring higher precision (sub-millimeter tolerances on PCB component placement) or complex 3D reasoning (cable routing, gasket seating)."
      ]
    },
    {
      "type": "prose",
      "heading": "Sensor Configuration and Collection Methodology",
      "paragraphs": [
        "Each assembly station uses 4-6 synchronized cameras arranged to provide full coverage of the workspace from complementary angles. The typical configuration includes: two overhead cameras (FLIR Blackfly S, 1920x1080, global shutter) at 45-degree opposing angles for top-down coverage, two side-mounted cameras at workpiece level for insertion visibility, and 1-2 Intel RealSense D455 depth sensors providing direct depth measurements. All cameras are hardware-triggered to a common clock with synchronization within 1ms across all views.",
        "Camera calibration uses a multi-stage process: intrinsic calibration per camera via ChArUco board, stereo calibration between each camera pair, and a global multi-camera calibration that establishes a unified world coordinate frame for the assembly workspace. Calibration is verified at the start of each collection session using a calibration object placed at known positions. Reprojection error is maintained below 0.5 pixels across all camera pairs.",
        "Collectors are trained assembly technicians performing genuine assembly tasks on real components -- not toy or simplified proxies. Assembly configurations include: PCB through-hole and SMD component placement, automotive connector and harness assembly, consumer electronics snap-fit and screw-fastened assembly, mechanical bearing and shaft insertion, cable routing and management, gasket and seal installation, and quality inspection with go/no-go gauging. Each configuration is captured with multiple part variants and assembly sequences to increase diversity.",
        "Force-torque data is captured for a subset of the dataset (approximately 8K trajectories) using ATI Nano17 sensors mounted on the collection fixtures. This F/T data provides ground-truth contact forces during insertion, threading, and snap-fit operations -- critical for training force-aware assembly policies that must modulate contact forces to avoid damaging parts or failing insertions."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Comparison with Public Datasets",
      "description": "How Claru's multi-view assembly dataset compares to publicly available alternatives for assembly robotics.",
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
          "Environments": "Toy disassembly (1 type)",
          "Annotations": "Fine-grained actions"
        },
        {
          "Dataset": "IndustReal (ICRA 2023)",
          "Clips": "~1K",
          "Hours": "~10",
          "Modalities": "RGB-D",
          "Environments": "Industrial insertion jigs",
          "Annotations": "Insertion success/fail"
        },
        {
          "Dataset": "IKEA ASM (2021)",
          "Clips": "~370",
          "Hours": "~35",
          "Modalities": "RGB-D, IMU",
          "Environments": "IKEA furniture",
          "Annotations": "Assembly actions, poses"
        },
        {
          "Dataset": "Claru Multi-View Assembly",
          "Clips": "30K+",
          "Hours": "200+",
          "Modalities": "Multi-RGB, Depth, F/T",
          "Environments": "15+ assembly configs",
          "Annotations": "3D pose, insertion state, force, part tracking, sequence"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Annotation Pipeline and Quality Assurance",
      "paragraphs": [
        "Multi-view annotation leverages the geometric redundancy of the camera setup for higher-quality labels than single-view annotation can achieve. Stage one automated processing includes: multi-view stereo reconstruction for dense 3D point clouds of each assembly state, SAM2-based part segmentation propagated across views via known camera geometry, and automated part pose estimation using multi-view triangulation of detected keypoints.",
        "Stage two human annotation adds: assembly step classification following a hierarchical taxonomy (phase, step, substep) with 200+ assembly actions across all configurations, part insertion state tracking (approaching, contacting, partial insertion, fully seated, fastened), 6-DoF object poses for key components verified against the multi-view 3D reconstruction, contact event timestamps (first contact, full engagement, fastener torque achieved), and assembly quality indicators (part alignment tolerance, insertion completeness, visual defect flags).",
        "Stage three QA exploits the multi-view geometry for automated verification: 3D annotations are checked for consistency across all camera views using reprojection. If a 6-DoF pose annotation is correct, it must project accurately into every camera image. Annotations with reprojection errors exceeding 3 pixels in any view are flagged for re-annotation. This geometric cross-checking achieves annotation accuracy that is impossible with single-view data. Overall targets: 97%+ on part identification, 95%+ on insertion state classification, and sub-millimeter accuracy on 3D pose annotations (verified via multi-view reprojection).",
        "The complete taxonomy covers 200+ assembly actions across 15+ configurations, 6 insertion state categories, force-torque profiles for contact-rich operations, per-frame 6-DoF poses for manipulated parts, assembly sequence dependency graphs (which parts must be installed before others), and quality metrics for each completed assembly step."
      ]
    },
    {
      "type": "cards",
      "heading": "Use Cases",
      "cards": [
        {
          "title": "3D-Aware Assembly Policies",
          "description": "Training manipulation policies that reason about 3D geometry during contact-rich assembly: insertion, threading, snap-fit, and fastening. Multi-view data enables policies that maintain spatial awareness even under self-occlusion. Example architectures: ACT, Diffusion Policy, 3D Diffuser Actor, EquiBot."
        },
        {
          "title": "Assembly Sequence Planning",
          "description": "Learning optimal assembly orders and dependency graphs from expert demonstrations. Models observe how experienced technicians decompose complex assemblies into ordered steps, handle part variants, and recover from insertion failures. Applications in manufacturing execution systems and co-bot programming."
        },
        {
          "title": "Quality Inspection and Verification",
          "description": "Training visual inspection models that verify assembly completeness and quality from multiple viewpoints. Multi-view coverage ensures every joint, fastener, and connection is visible for inspection. Critical for zero-defect manufacturing in automotive and electronics."
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
          "id": "tang-industreal-2023",
          "title": "IndustReal: Transferring Contact-Rich Assembly Tasks from Simulation to Reality",
          "authors": "Tang et al.",
          "venue": "RSS 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2305.17110"
        },
        {
          "id": "ke-3d-diffuser-2024",
          "title": "3D Diffuser Actor: Policy Diffusion with 3D Scene Representations",
          "authors": "Ke et al.",
          "venue": "CoRL 2024",
          "year": 2024,
          "url": "https://arxiv.org/abs/2402.10885"
        },
        {
          "id": "chi-diffusion-policy-2023",
          "title": "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
          "authors": "Chi et al.",
          "venue": "RSS 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2303.04137"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Delivers This Data",
      "paragraphs": [
        "Claru operates calibrated multi-camera assembly stations across partner manufacturing facilities and dedicated collection spaces. Each station is configured for the specific assembly type being captured, with camera positions optimized for maximum coverage of insertion zones, fastening points, and quality-critical areas. This infrastructure enables rapid data collection across assembly configurations that would take months to set up from scratch.",
        "Custom campaigns can target specific assembly types (PCB, automotive, consumer electronics), precision requirements (coarse assembly vs. sub-millimeter insertion), force-torque instrumented subsets, or particular failure modes (for training robust recovery policies). Turnaround from configuration specification to annotated delivery is typically 4-8 weeks.",
        "Data is delivered with full camera calibration parameters (intrinsics, extrinsics, distortion coefficients), enabling customers to reproject annotations into any camera view or reconstruct 3D point clouds. All multi-view frames are time-synchronized with timestamps. Format options include RLDS, HDF5, WebDataset, and custom schemas with 3D annotations in standard formats (PLY, PCD, JSON)."
      ]
    }
  ],
  "faqs": [
    {
      "question": "How many cameras are used per assembly station?",
      "answer": "4-6 synchronized cameras per station: typically 2 overhead at opposing 45-degree angles, 2 side-mounted at workpiece level, and 1-2 RealSense depth sensors. Camera positions are optimized per assembly type for maximum coverage of insertion zones and critical areas."
    },
    {
      "question": "Is force-torque data available?",
      "answer": "Yes, for approximately 8K trajectories. ATI Nano17 sensors capture 6-axis force-torque data during insertion, threading, and snap-fit operations at 1KHz, synchronized with video streams. F/T subsets are available for specific assembly types on request."
    },
    {
      "question": "What assembly types are covered?",
      "answer": "15+ configurations including PCB component placement (through-hole and SMD), automotive connector and harness assembly, consumer electronics snap-fit and screw assembly, mechanical bearing insertion, cable routing, gasket installation, and quality inspection tasks."
    },
    {
      "question": "Can 3D point clouds be reconstructed from the data?",
      "answer": "Yes. Full camera calibration (intrinsics, extrinsics, distortion) is provided, enabling multi-view stereo reconstruction, novel view synthesis, and 3D annotation reprojection. Pre-computed dense point clouds are available for a subset of the data."
    },
    {
      "question": "What precision levels are represented?",
      "answer": "Assembly tasks range from coarse (large connector insertion with 2-3mm tolerance) to fine (PCB component placement with sub-millimeter tolerance, precision bearing insertion). 3D pose annotations achieve sub-millimeter accuracy verified via multi-view reprojection."
    }
  ],
  "ctaHeading": "Request a Sample Pack",
  "ctaDescription": "Get a curated sample of multi-view assembly data with 3D annotations and camera calibration files to evaluate for your assembly robotics project.",
  "relatedGlossaryTerms": [
    "depth-data",
    "rgb-d-data",
    "point-cloud"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "datasetProfile": {
    "modalities": [
      "rgb",
      "depth",
      "point-cloud",
      "force-torque"
    ],
    "totalClips": "30K+",
    "totalHours": "200+",
    "annotationLayers": [
      "Assembly step taxonomy (200+ actions)",
      "Part insertion state tracking (6 states)",
      "6-DoF object pose per frame",
      "Contact event timestamps",
      "Force-torque profiles (8K+ trajectories)",
      "Part identification and tracking across views",
      "Assembly sequence dependency graphs",
      "Quality inspection indicators",
      "Multi-view instance segmentation",
      "Dense 3D point clouds (subset)",
      "Camera calibration (intrinsics + extrinsics)",
      "Assembly completion verification"
    ],
    "formats": [
      "RLDS",
      "HDF5",
      "WebDataset",
      "MP4+JSON",
      "PLY",
      "PCD"
    ],
    "resolution": "1920x1080 per view (4-6 views)",
    "fps": "30 fps"
  },
  "comparisonWithPublic": [
    {
      "name": "Assembly101",
      "clips": "~4K sequences",
      "hours": "~513",
      "modalities": "RGB (multi-view)",
      "environments": "Toy disassembly (1 type)",
      "annotations": "Fine-grained actions"
    },
    {
      "name": "IndustReal",
      "clips": "~1K",
      "hours": "~10",
      "modalities": "RGB-D",
      "environments": "Industrial insertion jigs",
      "annotations": "Insertion success/fail"
    },
    {
      "name": "IKEA ASM",
      "clips": "~370",
      "hours": "~35",
      "modalities": "RGB-D, IMU",
      "environments": "IKEA furniture",
      "annotations": "Assembly actions, poses"
    },
    {
      "name": "Claru Multi-View Assembly",
      "clips": "30K+",
      "hours": "200+",
      "modalities": "Multi-RGB, Depth, F/T",
      "environments": "15+ assembly configs",
      "annotations": "3D pose, insertion state, force, part tracking, sequence"
    }
  ],
  "useCases": [
    {
      "modelType": "3D-Aware Assembly Policies",
      "description": "Training manipulation policies that reason about 3D geometry during contact-rich insertion, threading, snap-fit, and fastening operations.",
      "exampleModels": [
        "ACT",
        "Diffusion Policy",
        "3D Diffuser Actor",
        "EquiBot"
      ]
    },
    {
      "modelType": "Assembly Sequence Planning",
      "description": "Learning optimal assembly orders, dependency graphs, and failure recovery strategies from expert technician demonstrations.",
      "exampleModels": [
        "SayCan",
        "PALM-E",
        "Code as Policies",
        "Inner Monologue"
      ]
    },
    {
      "modelType": "Assembly Quality Inspection",
      "description": "Multi-view visual inspection for verifying assembly completeness, fastener engagement, part alignment, and defect detection in manufacturing.",
      "exampleModels": [
        "PatchCore",
        "DINOv2",
        "Mask2Former",
        "Grounding DINO"
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
      "id": "tang-industreal-2023",
      "title": "IndustReal: Transferring Contact-Rich Assembly Tasks from Simulation to Reality",
      "authors": "Tang et al.",
      "venue": "RSS 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2305.17110"
    },
    {
      "id": "ke-3d-diffuser-2024",
      "title": "3D Diffuser Actor: Policy Diffusion with 3D Scene Representations",
      "authors": "Ke et al.",
      "venue": "CoRL 2024",
      "year": 2024,
      "url": "https://arxiv.org/abs/2402.10885"
    },
    {
      "id": "chi-diffusion-policy-2023",
      "title": "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      "authors": "Chi et al.",
      "venue": "RSS 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2303.04137"
    }
  ],
  "claruRelevance": "Claru operates calibrated multi-camera assembly stations capturing 4-6 synchronized views of real manufacturing assembly tasks across 15+ configurations. Unlike single-product academic datasets, the data spans PCB, automotive, consumer electronics, and mechanical assembly with 3D pose annotations verified via multi-view reprojection. Force-torque instrumented subsets provide ground-truth contact data for training force-aware insertion policies."
};

export default data;
