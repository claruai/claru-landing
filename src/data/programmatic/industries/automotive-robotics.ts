import type { IndustryPageData } from "./types";

const data: IndustryPageData = {
  "slug": "automotive-robotics",
  "metaTitle": "Automotive Robotics Training Data | Claru",
  "metaDescription": "Training data for automotive robotics: ADAS perception, autonomous driving, robotic assembly lines, paint-shop inspection, and EV battery handling.",
  "primaryKeyword": "automotive robotics training data",
  "secondaryKeywords": [
    "automotive robotics data",
    "ADAS training data",
    "autonomous driving datasets",
    "automotive assembly robot data",
    "vehicle inspection AI data",
    "EV battery robotics data"
  ],
  "canonicalPath": "/industries/automotive-robotics",
  "h1": "Automotive Robotics Training Data",
  "heroSubtitle": "Training data for automotive robotics: ADAS perception, autonomous driving, robotic assembly lines, paint-shop inspection, and EV battery handling. Purpose-built datasets for the safety standards that govern modern vehicle manufacturing and autonomy.",
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
      "label": "Automotive Robotics",
      "href": "/industries/automotive-robotics"
    }
  ],
  "sections": [
    {
      "type": "prose",
      "heading": "Why Automotive Robotics Data Is Uniquely Demanding",
      "paragraphs": [
        "Automotive robotics spans two fundamentally different domains: on-road autonomy (ADAS and self-driving) and in-factory automation (assembly, welding, painting, quality inspection). Each domain imposes distinct data requirements. On-road systems need millions of miles of driving scenarios with pixel-level semantic segmentation, 3D bounding boxes, and lane-level HD maps. Factory robots need sub-millimeter manipulation trajectories, force-torque profiles, and defect detection datasets with class imbalance ratios of 1000:1 or worse.",
        "The automotive industry is also uniquely regulation-heavy. A single autonomous driving perception model may need to satisfy UN ECE R157 in Europe, FMVSS in the United States, and GB/T standards in China simultaneously. Factory robots must comply with ISO 26262 for functional safety and ISO 10218 for collaborative operation. This regulatory patchwork makes provenance-tracked, audit-ready training data essential rather than optional.",
        "Companies like Tesla, BMW, and Hyundai are investing billions in robotic automation for next-generation EV factories. Tesla's Gigafactory uses over 1,000 robots for body assembly alone. BMW's Spartanburg plant deploys collaborative robots (cobots) alongside human workers for flexible assembly. The training data for these systems must capture the full diversity of parts, fixtures, and human-robot handoff scenarios that occur in real production."
      ]
    },
    {
      "type": "cards",
      "heading": "Regulatory Requirements",
      "cards": [
        {
          "title": "UN ECE R157 (International)",
          "description": "Regulation for Automated Lane Keeping Systems (ALKS). ALKS training data must include 37+ defined test scenarios spanning weather variations (rain, fog, snow, glare), lighting conditions (dawn, dusk, tunnel transitions, oncoming headlights), and traffic patterns (cut-ins, emergency braking, pedestrian crossings). Validation datasets must demonstrate performance across all 37 scenarios before type-approval."
        },
        {
          "title": "ISO 26262 (International)",
          "description": "Functional safety for automotive electrical and electronic systems. Training data for safety-critical automotive AI requires ASIL (Automotive Safety Integrity Level) classification from A to D. ASIL-D systems like automatic emergency braking demand systematic coverage of hazardous scenarios with documented failure-mode analysis. Each training example must be traceable to a specific safety requirement."
        },
        {
          "title": "FMVSS / NHTSA ADS Framework (US)",
          "description": "Federal Motor Vehicle Safety Standards and the NHTSA framework for Automated Driving Systems. US-market autonomous vehicles must demonstrate performance across the 37 pre-crash scenarios identified in NHTSA's crash typology. Training data must include the full Operational Design Domain with documented geographic, weather, and traffic density coverage."
        },
        {
          "title": "ISO 10218 / ISO/TS 15066 (International)",
          "description": "Safety requirements for industrial robots and collaborative robot force limits. Factory robots sharing workspace with human operators require training data that covers proximity detection at multiple speed thresholds, contact-force scenarios for collaborative operations, and emergency stop response patterns. Data must validate safety-rated monitored stop, hand guiding, speed/separation monitoring, and power/force limiting modes."
        },
        {
          "title": "EU AI Act (EU)",
          "description": "The EU AI Act classifies autonomous vehicle AI and safety-critical factory robot AI as high-risk systems. This requires training data to meet quality criteria including bias documentation, completeness metrics, demographic representativeness audits, and ongoing monitoring. Data providers must supply technical documentation sufficient for conformity assessments."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Environment Characteristics",
      "cards": [
        {
          "title": "Multi-Domain Operation",
          "description": "Automotive robots operate across radically different environments: open highways at 130 km/h, crowded urban intersections, climate-controlled paint shops, and high-temperature welding cells. Data challenge: No single dataset architecture covers all domains. Models must generalize across structured factory floors and unstructured road environments."
        },
        {
          "title": "Extreme Precision Requirements",
          "description": "Body-in-white assembly demands positioning accuracy of +/- 0.1mm. Paint application requires uniform film thickness within 5-micron tolerances. Data challenge: Manipulation trajectory data must capture sub-millimeter resolution with synchronized force-torque profiles, typically at 500 Hz or higher sampling rates."
        },
        {
          "title": "High-Speed Dynamic Scenes",
          "description": "Highway ADAS operates at speeds where objects close at 250+ km/h combined velocity. Factory conveyor lines move parts at 1-3 m/s with zero-tolerance timing. Data challenge: Sensor synchronization across cameras, LiDAR, and radar must be tighter than 1ms. Motion blur, rolling-shutter artifacts, and temporal misalignment corrupt training signal."
        },
        {
          "title": "Reflective and Specular Surfaces",
          "description": "Freshly painted vehicle bodies, chrome trim, and wet roads create challenging specular reflections. Data challenge: Standard RGB perception models fail on highly reflective surfaces. Training data must include polarimetric imaging or multi-exposure HDR captures with reflection-aware annotations."
        },
        {
          "title": "Mixed Human-Robot Zones",
          "description": "Modern automotive factories employ cobots working alongside human operators for tasks like windshield installation and quality checks. Data challenge: Training data must capture diverse human body poses, PPE configurations (gloves, safety glasses, helmets), and the variable speeds at which humans move within collaborative zones."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Common Robotics Tasks",
      "cards": [
        {
          "title": "ADAS Perception and Prediction",
          "description": "Object detection, tracking, and trajectory prediction for vehicles, pedestrians, and cyclists. Data requirements: Multi-sensor captures (camera, LiDAR, radar) with 3D bounding boxes, semantic segmentation, instance segmentation, and lane markings. Minimum 100K annotated frames per scenario class for long-tail coverage."
        },
        {
          "title": "Body-in-White Assembly",
          "description": "Robotic welding, riveting, and adhesive application on vehicle body structures. Data requirements: 6-DoF end-effector trajectories with force-torque profiles, weld-seam quality annotations (porosity, undercut, spatter), and joint-fit measurements at each assembly station."
        },
        {
          "title": "Paint Shop Inspection",
          "description": "Automated defect detection on painted vehicle surfaces: orange peel, runs, sags, dirt inclusions, and color mismatch. Data requirements: High-resolution multi-angle images under controlled lighting with pixel-level defect masks. Class ratios typically 500:1 to 2000:1 (defect-free to defective), requiring targeted defect augmentation."
        },
        {
          "title": "EV Battery Module Handling",
          "description": "Robotic insertion of battery cells into modules and packs, requiring precise force control to avoid cell damage. Data requirements: Manipulation trajectories with sub-Newton force resolution, thermal imaging for cell temperature monitoring, and failure-mode recordings (misalignment, over-insertion, connector damage)."
        },
        {
          "title": "Final Assembly and Quality Gate",
          "description": "Flexible assembly of trim, seats, wiring harnesses, and final inspection. Data requirements: Multi-view images of completed assemblies with annotation for gap-and-flush measurements, fastener presence/absence, and connector seating verification."
        }
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Data Requirements by Robot Type in Automotive",
      "description": "Different automotive robot types demand fundamentally different data profiles. This table summarizes key data characteristics by platform.",
      "columns": ["Robot Type", "Primary Sensors", "Data Volume", "Key Annotations", "Update Frequency"],
      "rows": [
        {
          "Robot Type": "ADAS / L2+ Perception",
          "Primary Sensors": "Camera, LiDAR, radar, IMU",
          "Data Volume": "1M+ annotated frames",
          "Key Annotations": "3D boxes, semantic seg, lane lines, trajectories",
          "Update Frequency": "Continuous (OTA model updates)"
        },
        {
          "Robot Type": "6-axis Assembly Robot",
          "Primary Sensors": "Force/torque, RGB, laser profiler",
          "Data Volume": "50K+ manipulation episodes",
          "Key Annotations": "Joint trajectories, force profiles, weld quality",
          "Update Frequency": "Per model year changeover"
        },
        {
          "Robot Type": "Paint Inspection Robot",
          "Primary Sensors": "Line-scan camera, deflectometry",
          "Data Volume": "500K+ surface images",
          "Key Annotations": "Pixel-level defect masks, severity grades",
          "Update Frequency": "Per new color/finish introduction"
        },
        {
          "Robot Type": "Collaborative Robot (Cobot)",
          "Primary Sensors": "RGB-D, force/torque, proximity",
          "Data Volume": "100K+ interaction episodes",
          "Key Annotations": "Human pose, safety zone status, handoff timing",
          "Update Frequency": "Per workstation reconfiguration"
        },
        {
          "Robot Type": "AMR / AGV (Factory Floor)",
          "Primary Sensors": "LiDAR, RGB, wheel odometry",
          "Data Volume": "10K+ km navigation logs",
          "Key Annotations": "Obstacle maps, pedestrian trajectories, path plans",
          "Update Frequency": "Per factory layout change"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Real-World Deployments",
      "paragraphs": [
        "Tesla's Fremont and Austin Gigafactories deploy over 1,000 FANUC and KUKA robots for body assembly, with a growing fleet of custom-designed robots for battery pack integration. Tesla's approach to training data is vertically integrated: every vehicle in its fleet collects driving data that feeds back into Autopilot model training, creating a data flywheel estimated at over 1 billion miles of driving data annually.",
        "BMW's Spartanburg plant uses ABB YuMi cobots for flexible door seal installation. The plant captures teleoperation demonstrations from skilled operators to train imitation-learning models that adapt to multiple vehicle models on the same line. BMW reports a 15% reduction in cycle time variability after deploying learned manipulation policies trained on real operator demonstrations.",
        "Hyundai's Singapore Innovation Centre, in partnership with Boston Dynamics, is developing mobile manipulation robots for final assembly tasks. These systems combine quadruped locomotion (Spot) with arm manipulation, requiring training data that captures both navigation in cluttered factory environments and dexterous object handling -- a data profile that does not exist in any public dataset.",
        "Rivian and other EV startups face a cold-start problem: they lack the decades of production data that incumbents like Toyota have accumulated. Rivian's Normal, Illinois factory uses a combination of simulation data and small-scale real-world demonstrations to bootstrap robot policies, but sim-to-real transfer gaps remain a significant challenge for paint quality inspection and flexible assembly."
      ]
    },
    {
      "type": "prose",
      "heading": "Relevant Data Modalities",
      "paragraphs": [
        "Automotive robotics demands the broadest sensor modality coverage of any industry vertical. On-road systems require synchronized camera arrays (6-12 cameras), LiDAR point clouds (64-128 beam), 4D radar returns, IMU data, and GPS/RTK positioning. Factory systems require RGB and hyperspectral cameras, structured-light depth sensors, force-torque sensors (6-axis, 1 kHz+), laser profilers for weld inspection, and deflectometry systems for paint quality.",
        "The critical differentiator for automotive data is temporal synchronization. ADAS data pipelines typically require all sensors synchronized to within 1ms using PTP (Precision Time Protocol) or hardware triggers. Factory robot data requires even tighter synchronization between vision and force sensing -- as low as 100 microseconds for contact-rich manipulation tasks."
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "sun-scalability-2020",
          "title": "Scalability in Perception for Autonomous Driving: Waymo Open Dataset",
          "authors": "Sun et al.",
          "venue": "CVPR 2020",
          "year": 2020,
          "url": "https://arxiv.org/abs/1912.04838"
        },
        {
          "id": "caesar-nuscenes-2020",
          "title": "nuScenes: A Multimodal Dataset for Autonomous Driving",
          "authors": "Caesar et al.",
          "venue": "CVPR 2020",
          "year": 2020,
          "url": "https://arxiv.org/abs/1903.11027"
        },
        {
          "id": "hoque-thriftydagger-2023",
          "title": "ThriftyDAgger: Budget-Aware Novelty and Risk Gating for Interactive Imitation Learning",
          "authors": "Hoque et al.",
          "venue": "CoRL 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2109.02603"
        },
        {
          "id": "luo-robust-grasp-2021",
          "title": "Robust Robotic Grasping of Automotive Parts for Flexible Manufacturing",
          "authors": "Luo et al.",
          "venue": "IEEE Transactions on Industrial Informatics 2021",
          "year": 2021,
          "url": "https://ieeexplore.ieee.org/document/9380500"
        },
        {
          "id": "li-paint-defect-2023",
          "title": "A Survey of Deep Learning-Based Surface Defect Detection in Manufacturing",
          "authors": "Li et al.",
          "venue": "Journal of Manufacturing Systems 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2307.07466"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Serves Automotive Robotics",
      "paragraphs": [
        "Claru provides training data for both sides of automotive robotics. For ADAS and autonomy teams, we deliver multi-sensor driving data collected in diverse geographies with full provenance documentation to support UN ECE R157 and NHTSA compliance. For factory automation teams, our collector network captures manipulation demonstrations, inspection imagery, and human-robot interaction data directly on production floors.",
        "Our annotation pipeline includes automotive-specific protocols: 3D bounding box annotation with occlusion and truncation flags, semantic segmentation using standardized automotive ontologies (compatible with nuScenes and Waymo label formats), weld-quality grading by certified welding inspectors, and paint-defect classification following OEM severity scales. All data is delivered with audit-ready provenance trails linking each sample to collector identity, capture timestamp, and annotation review chain."
      ]
    }
  ],
  "faqs": [
    {
      "question": "What makes automotive training data different from general-purpose robotics data?",
      "answer": "Automotive training data faces two unique pressures that general robotics data does not. First, regulatory requirements are extraordinarily specific: UN ECE R157 alone defines 37 test scenarios that must be covered, and ISO 26262 requires traceability from every training sample to a safety requirement at ASIL levels A through D. Second, the scale requirements are orders of magnitude larger. While a manipulation task might need 50,000 demonstrations, an ADAS perception model needs millions of annotated frames covering the long tail of rare events like emergency vehicles, construction zones, and adverse weather. This combination of regulatory specificity and extreme scale makes automotive data a specialized discipline."
    },
    {
      "question": "How does Claru handle the multi-sensor synchronization required for ADAS data?",
      "answer": "Claru's ADAS data collection uses hardware-triggered sensor arrays with Precision Time Protocol (PTP) synchronization to achieve sub-millisecond alignment across cameras, LiDAR, radar, and IMU. Each sensor frame includes a hardware timestamp that is verified during post-processing. We perform automated temporal alignment checks as part of our quality pipeline, flagging any frame pairs with synchronization drift exceeding 1ms. For factory robot data, we use EtherCAT-synchronized force-torque sensors paired with triggered cameras to achieve even tighter alignment for contact-rich manipulation tasks."
    },
    {
      "question": "Can Claru provide data compatible with existing automotive dataset formats like nuScenes or Waymo Open?",
      "answer": "Yes. Claru delivers ADAS perception data in formats directly compatible with the nuScenes devkit, Waymo Open Dataset format, and KITTI format. This means your existing training pipelines work without conversion overhead. Our annotation ontology covers the standard 23 object classes from nuScenes with optional extensions for OEM-specific categories. For factory robot data, we deliver in standard robotics formats including ROS bag, HDF5 with RLDS schema, and custom formats per client specification. Format compatibility is scoped during the project kickoff."
    },
    {
      "question": "How does Claru address the extreme class imbalance in paint defect detection datasets?",
      "answer": "Paint defect datasets are inherently imbalanced because modern paint processes have defect rates below 0.1%. Claru addresses this through a multi-stage strategy. First, we perform targeted collection campaigns focused specifically on defect-rich scenarios, including controlled defect introduction panels provided by the OEM. Second, we capture under multiple lighting geometries (diffuse, specular, dark-field) to maximize defect visibility. Third, our annotation pipeline includes defect-severity grading by trained inspectors using the OEM's own classification rubric. This produces datasets with enough positive examples per defect class to train effective detectors without relying solely on synthetic augmentation."
    },
    {
      "question": "What data does Claru provide for EV battery assembly robotics?",
      "answer": "EV battery assembly is one of the fastest-growing segments in automotive robotics, and the data requirements are distinct from traditional body assembly. Claru captures high-resolution manipulation trajectories for cell insertion, module stacking, and busbar welding with force-torque profiles at 1 kHz or higher. We include thermal imaging streams to monitor cell temperature during handling, which is critical for safety validation. Our datasets cover failure-mode scenarios including cell misalignment, connector damage, and over-insertion events that are essential for training robust anomaly detection. All battery assembly data includes material traceability metadata linking each capture to the cell chemistry and module design revision."
    }
  ],
  "ctaHeading": "Discuss Automotive Robotics Data Needs",
  "ctaDescription": "Tell us about your automotive robotics project -- whether it is ADAS perception, factory assembly automation, or EV battery handling. Claru will scope a data collection and annotation plan tailored to your regulatory and performance requirements.",
  "relatedGlossaryTerms": [
    "embodied-ai",
    "physical-ai",
    "teleoperation-data",
    "sim-to-real-transfer",
    "imitation-learning"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "regulations": [
    {
      "name": "UN ECE R157",
      "jurisdiction": "International",
      "description": "Regulation for Automated Lane Keeping Systems.",
      "dataImplications": "ALKS training data must include 37+ defined test scenarios with weather, lighting, and traffic variations."
    },
    {
      "name": "ISO 26262",
      "jurisdiction": "International",
      "description": "Functional safety for automotive electrical/electronic systems.",
      "dataImplications": "Training data for safety-critical automotive AI requires ASIL classification and systematic coverage of hazardous scenarios."
    },
    {
      "name": "FMVSS / NHTSA ADS Framework",
      "jurisdiction": "US",
      "description": "Federal Motor Vehicle Safety Standards for automated driving systems.",
      "dataImplications": "US-market ADS must demonstrate coverage of NHTSA's 37 pre-crash scenario typologies in training data."
    },
    {
      "name": "ISO 10218 / ISO/TS 15066",
      "jurisdiction": "International",
      "description": "Safety requirements for industrial and collaborative robots.",
      "dataImplications": "Factory robot training data must include human-proximity scenarios at safety-rated speeds and contact-force validation data."
    },
    {
      "name": "EU AI Act",
      "jurisdiction": "EU",
      "description": "High-risk AI system regulation for autonomous vehicles and safety-critical factory robots.",
      "dataImplications": "Requires bias documentation, completeness metrics, and demographic representativeness audits in training data."
    }
  ],
  "environmentCharacteristics": [
    {
      "characteristic": "Multi-Domain Operation",
      "description": "Robots operate across highways, urban intersections, paint shops, and welding cells.",
      "dataChallenge": "No single dataset architecture covers all domains. Models must generalize across structured and unstructured environments."
    },
    {
      "characteristic": "Extreme Precision Requirements",
      "description": "Body assembly demands +/- 0.1mm accuracy; paint requires 5-micron film thickness tolerances.",
      "dataChallenge": "Manipulation data must capture sub-millimeter resolution with synchronized force-torque at 500 Hz+."
    },
    {
      "characteristic": "High-Speed Dynamic Scenes",
      "description": "Highway closing speeds exceed 250 km/h; factory conveyors move at 1-3 m/s.",
      "dataChallenge": "Sub-millisecond sensor synchronization required; motion blur and temporal misalignment corrupt training signal."
    },
    {
      "characteristic": "Reflective and Specular Surfaces",
      "description": "Painted bodies, chrome trim, and wet roads create challenging specular reflections.",
      "dataChallenge": "Standard RGB fails on highly reflective surfaces. Multi-exposure HDR or polarimetric capture needed."
    },
    {
      "characteristic": "Mixed Human-Robot Zones",
      "description": "Cobots and human operators share workspace for flexible assembly tasks.",
      "dataChallenge": "Data must capture diverse human poses, PPE configurations, and variable movement speeds within collaborative zones."
    }
  ],
  "commonTasks": [
    {
      "task": "ADAS Perception and Prediction",
      "description": "Object detection, tracking, and trajectory prediction for vehicles, pedestrians, and cyclists.",
      "dataRequirements": "Multi-sensor captures with 3D bounding boxes, semantic segmentation, instance segmentation, lane markings. 100K+ annotated frames per scenario class."
    },
    {
      "task": "Body-in-White Assembly",
      "description": "Robotic welding, riveting, and adhesive application on vehicle body structures.",
      "dataRequirements": "6-DoF trajectories with force-torque profiles, weld-seam quality annotations, joint-fit measurements per station."
    },
    {
      "task": "Paint Shop Inspection",
      "description": "Automated defect detection on painted surfaces: orange peel, runs, dirt inclusions, color mismatch.",
      "dataRequirements": "High-res multi-angle images with pixel-level defect masks. Class ratios 500:1 to 2000:1."
    },
    {
      "task": "EV Battery Module Handling",
      "description": "Robotic cell insertion into modules with precise force control to prevent cell damage.",
      "dataRequirements": "Sub-Newton force resolution trajectories, thermal imaging, failure-mode recordings."
    },
    {
      "task": "Final Assembly and Quality Gate",
      "description": "Flexible assembly of trim, seats, wiring harnesses, and final visual inspection.",
      "dataRequirements": "Multi-view assembly images with gap-and-flush annotations, fastener presence/absence, connector seating verification."
    }
  ],
  "relevantModalities": [
    "RGB video (multi-camera arrays)",
    "LiDAR (64-128 beam)",
    "4D radar",
    "Force/torque (6-axis, 1 kHz+)",
    "IMU / GPS-RTK",
    "Thermal / hyperspectral",
    "Structured-light depth",
    "Laser profiler"
  ],
  "keyPapers": [
    {
      "id": "sun-scalability-2020",
      "title": "Scalability in Perception for Autonomous Driving: Waymo Open Dataset",
      "authors": "Sun et al.",
      "venue": "CVPR 2020",
      "year": 2020,
      "url": "https://arxiv.org/abs/1912.04838"
    },
    {
      "id": "caesar-nuscenes-2020",
      "title": "nuScenes: A Multimodal Dataset for Autonomous Driving",
      "authors": "Caesar et al.",
      "venue": "CVPR 2020",
      "year": 2020,
      "url": "https://arxiv.org/abs/1903.11027"
    },
    {
      "id": "hoque-thriftydagger-2023",
      "title": "ThriftyDAgger: Budget-Aware Novelty and Risk Gating for Interactive Imitation Learning",
      "authors": "Hoque et al.",
      "venue": "CoRL 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2109.02603"
    },
    {
      "id": "luo-robust-grasp-2021",
      "title": "Robust Robotic Grasping of Automotive Parts for Flexible Manufacturing",
      "authors": "Luo et al.",
      "venue": "IEEE Transactions on Industrial Informatics 2021",
      "year": 2021,
      "url": "https://ieeexplore.ieee.org/document/9380500"
    },
    {
      "id": "li-paint-defect-2023",
      "title": "A Survey of Deep Learning-Based Surface Defect Detection in Manufacturing",
      "authors": "Li et al.",
      "venue": "Journal of Manufacturing Systems 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2307.07466"
    }
  ],
  "claruRelevance": "Claru provides training data for both on-road autonomy and factory automation. For ADAS teams, we deliver multi-sensor driving data with full provenance for regulatory compliance. For factory teams, our collector network captures manipulation demonstrations, inspection imagery, and human-robot interaction data on production floors with audit-ready documentation."
};

export default data;
