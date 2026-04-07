import type { IndustryPageData } from "./types";

const data: IndustryPageData = {
  "slug": "manufacturing-robotics",
  "metaTitle": "Manufacturing Robotics Training Data | Claru",
  "metaDescription": "Training data for manufacturing robots: assembly, quality inspection, material handling, welding, and collaborative robots in factory environments.",
  "primaryKeyword": "manufacturing robotics training data",
  "secondaryKeywords": [
    "manufacturing robotics data",
    "factory robot AI data",
    "assembly robot training data",
    "quality inspection AI data",
    "cobot training datasets",
    "industrial robot data"
  ],
  "canonicalPath": "/industries/manufacturing-robotics",
  "h1": "Manufacturing Robotics Training Data",
  "heroSubtitle": "Training data for manufacturing robots: assembly, quality inspection, material handling, welding, and collaborative robots in factory environments. Built for ISO 10218 safety compliance and the precision requirements that define modern smart manufacturing.",
  "breadcrumbs": [
    { "label": "Home", "href": "/" },
    { "label": "Industries", "href": "/industries" },
    { "label": "Manufacturing Robotics", "href": "/industries/manufacturing-robotics" }
  ],
  "sections": [
    {
      "type": "prose",
      "heading": "Why Manufacturing Robotics Data Demands Factory-Floor Fidelity",
      "paragraphs": [
        "Manufacturing is the largest market for industrial robotics, with over 4 million operational robots worldwide as of 2024 according to the International Federation of Robotics (IFR). The industry installed over 540,000 new units in 2023 alone. But the next generation of manufacturing robots -- collaborative robots (cobots), vision-guided assembly systems, and AI-powered quality inspection -- requires training data that captures the real conditions of factory floors, not laboratory environments.",
        "The transition from pre-programmed industrial robots to learning-based systems is driven by product complexity and customization demands. A traditional automotive assembly line might produce one model at high volume, but modern manufacturers increasingly produce mixed-model lines where the robot must handle dozens of product variants on the same workstation. Companies like FANUC, ABB, KUKA, Universal Robots, and Realtime Robotics are deploying AI-enabled systems that learn from demonstrations rather than requiring explicit programming for each variant.",
        "Factory environments present distinct data challenges. Lighting is typically harsh fluorescent or LED with strong shadows from overhead fixtures. Metallic parts create specular reflections that confuse vision systems. Coolant mist from CNC machines degrades sensor surfaces. Vibration from stamping presses and compressors introduces noise into force-torque measurements. The ambient noise level on a typical factory floor exceeds 85 dB, making acoustic monitoring data inherently noisy. Training data must include these real-world degradation factors.",
        "Quality inspection is the fastest-growing application for AI in manufacturing. Traditional rule-based machine vision (checking dimensions, presence/absence) is being replaced by deep learning models that can detect subtle defects: surface scratches, porosity in castings, weld discontinuities, and cosmetic blemishes that vary in appearance. These models require tens of thousands of labeled defect images per defect class, with the added challenge that defect rates in well-run production lines are often below 0.1% -- creating extreme class imbalance that must be addressed through targeted collection campaigns."
      ]
    },
    {
      "type": "cards",
      "heading": "Regulatory Requirements",
      "cards": [
        {
          "title": "ISO 10218-1/2 (International)",
          "description": "Safety requirements for industrial robots (Part 1: robot systems, Part 2: integration). Training data for factory robots must include human proximity detection at safety-rated speeds, emergency stop response validation, and safeguarded space monitoring. ISO 10218-2 requires risk assessment data for each robot installation, covering all foreseeable hazard scenarios including unexpected human entry into the robot workspace."
        },
        {
          "title": "ISO/TS 15066 (International)",
          "description": "Collaborative robot safety specifying force and pressure limits for human-robot contact. Training data must capture contact scenarios for validating power and force limiting, speed and separation monitoring, hand guiding, and safety-rated monitored stop. Force-torque data must cover the 29 body regions defined in ISO/TS 15066 with biomechanical thresholds for quasi-static and transient contact."
        },
        {
          "title": "ISO 9001 / IATF 16949 (International)",
          "description": "Quality management systems for general manufacturing (ISO 9001) and automotive suppliers (IATF 16949). Training data for quality inspection systems must support traceability requirements: every defect annotation must be traceable to a specific inspector, annotation guideline version, and review cycle. Statistical process control (SPC) data must be compatible with quality management system reporting."
        },
        {
          "title": "EU Machinery Directive 2006/42/EC (EU)",
          "description": "Essential health and safety requirements for machinery including industrial robots. Requires comprehensive risk assessment documentation. Training data must cover degraded-mode scenarios (sensor failure, communication loss, power interruption) and demonstrate safe robot behavior during each failure mode. CE marking requires documentation of training data coverage for all identified hazards."
        },
        {
          "title": "OSHA 29 CFR 1910.212 / ANSI/RIA R15.06 (US)",
          "description": "Machine guarding requirements and robot safety standards in the US. Training data must include scenarios demonstrating safeguarding effectiveness: light curtain response, area scanner detection zones, safety mat activation, and two-hand control verification. Robot speed reduction when humans enter collaborative workspace zones must be validated with real-world data."
        },
        {
          "title": "EU AI Act -- High-Risk (EU)",
          "description": "The EU AI Act classifies safety-critical industrial robot AI as high-risk, requiring training data to meet quality criteria: documented completeness metrics, bias analysis, demographic representativeness audits for person detection, and ongoing monitoring. Data providers must supply technical documentation sufficient for conformity assessment under Article 10 data governance requirements."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Environment Characteristics",
      "cards": [
        {
          "title": "Harsh Industrial Lighting and Reflections",
          "description": "Factory floors use high-bay LED or fluorescent lighting creating strong shadows and specular highlights. Machined metal parts, chrome fixtures, and wet surfaces create intense reflections. Data challenge: Vision-based inspection and guidance systems must handle variable lighting across shifts (day/night), reflective surfaces that change appearance with viewing angle, and transitions between lit workstations and dim aisles."
        },
        {
          "title": "Coolant, Oil, and Particulate Contamination",
          "description": "CNC machines spray coolant mist, hydraulic systems leak oil, and grinding operations generate metal dust. Data challenge: Sensor surfaces accumulate contamination over hours of operation. Training data must represent the full degradation curve from clean sensors to fouled sensors, enabling models that maintain performance as conditions deteriorate between maintenance intervals."
        },
        {
          "title": "Vibration and Mechanical Noise",
          "description": "Stamping presses, compressors, CNC machines, and material handling equipment create continuous vibration (0.1-100 Hz) and noise exceeding 85 dB. Data challenge: Force-torque sensor readings include vibrational noise that must be filtered. Camera images suffer from motion blur. Acoustic quality inspection is challenged by high ambient noise floors."
        },
        {
          "title": "Mixed Human-Robot Collaborative Zones",
          "description": "Modern factories deploy cobots (Universal Robots, FANUC CRX, ABB GoFa) alongside human workers for flexible assembly tasks. Data challenge: Training data must capture diverse human body poses and PPE configurations (safety glasses, gloves, earplugs, steel-toe boots), variable worker speeds and movement patterns, and the handoff interactions where human and robot share a workpiece."
        },
        {
          "title": "High-Speed Repetitive Operations",
          "description": "Pick-and-place at 100+ cycles per minute, welding at travel speeds of 10-60 mm/s, and assembly with sub-second cycle times. Data challenge: High temporal resolution (500+ Hz for force-torque, 60+ FPS for vision) is required. Motion blur at high speeds degrades image quality. Synchronization between vision and force sensing must be sub-millisecond."
        },
        {
          "title": "Product Variant Diversity",
          "description": "Mixed-model production lines handle dozens to hundreds of product variants at the same workstation. Data challenge: Models must recognize parts, fixtures, and assembly configurations across all variants. Training data must cover the full product matrix, including rare variants that appear only a few times per shift."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Common Robotics Tasks",
      "cards": [
        {
          "title": "Vision-Guided Assembly",
          "description": "Robots using cameras to locate parts, determine orientation, and perform assembly operations (insertion, fastening, snapping). Data requirements: 6-DoF part pose estimation data across variant families, force-torque profiles for insertion and snap-fit operations, and success/failure classification for each assembly step."
        },
        {
          "title": "Surface Defect Inspection",
          "description": "Automated detection of scratches, dents, porosity, discoloration, and cosmetic defects on manufactured parts. Data requirements: High-resolution multi-angle imagery under controlled lighting with pixel-level defect masks. Defect classification per severity grade (pass, rework, scrap). Extreme class imbalance handling with defect rates below 0.1%."
        },
        {
          "title": "Weld Quality Assessment",
          "description": "Visual and sensor-based evaluation of weld seams for porosity, undercut, overlap, spatter, and dimensional conformance. Data requirements: Multi-angle weld imagery, cross-section profiles from laser profilometry, and defect classification per AWS D1.1 or ISO 5817 quality levels."
        },
        {
          "title": "Bin Picking and Kitting",
          "description": "Picking randomly oriented parts from bins and arranging them in kits or fixtures. Data requirements: Dense point clouds of randomly oriented parts with 6-DoF grasp annotations, collision-free grasp planning trajectories, and part identification across surface finish variations (raw, painted, plated, anodized)."
        },
        {
          "title": "Material Handling with AMRs",
          "description": "Autonomous mobile robots transporting materials between workstations, warehouses, and loading docks. Data requirements: Factory floor navigation data with dynamic obstacles (forklifts, pedestrians, pallet jacks), floor marking recognition, docking alignment data, and traffic management trajectories for multi-robot coordination."
        },
        {
          "title": "Collaborative Human-Robot Handoff",
          "description": "Coordinated tasks where human and robot alternate work on the same part or share a workstation. Data requirements: Human pose tracking in close proximity, handoff timing and force profiles, intent prediction data (when does the human need the robot to hold, release, or reposition), and safety-stop trigger scenarios."
        }
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Data Requirements by Robot Type in Manufacturing",
      "description": "Manufacturing robots span from compact cobots to massive gantry systems. Each type has distinct sensor, volume, and precision requirements.",
      "columns": ["Robot Type", "Primary Sensors", "Data Volume", "Key Annotations", "Update Frequency"],
      "rows": [
        {
          "Robot Type": "6-Axis Industrial Robot",
          "Primary Sensors": "RGB, force/torque, laser profiler",
          "Data Volume": "50K+ manipulation episodes",
          "Key Annotations": "Joint trajectories, force profiles, part pose, quality grade",
          "Update Frequency": "Per product changeover"
        },
        {
          "Robot Type": "Collaborative Robot (Cobot)",
          "Primary Sensors": "RGB-D, force/torque, proximity",
          "Data Volume": "100K+ interaction episodes",
          "Key Annotations": "Human pose, safety zone, handoff timing, contact force",
          "Update Frequency": "Per workstation reconfiguration"
        },
        {
          "Robot Type": "Vision Inspection System",
          "Primary Sensors": "RGB (multi-angle), structured light",
          "Data Volume": "500K+ inspection images",
          "Key Annotations": "Pixel-level defect masks, severity grade, defect type",
          "Update Frequency": "Per new defect type or product"
        },
        {
          "Robot Type": "AMR (Factory Floor)",
          "Primary Sensors": "LiDAR, RGB, wheel odometry",
          "Data Volume": "10K+ km navigation logs",
          "Key Annotations": "Obstacle class, floor marking, docking alignment",
          "Update Frequency": "Per layout change"
        },
        {
          "Robot Type": "Welding Robot",
          "Primary Sensors": "Arc sensor, laser profiler, RGB",
          "Data Volume": "100K+ weld seams",
          "Key Annotations": "Weld quality per AWS/ISO, defect type, dimensions",
          "Update Frequency": "Per joint type or material change"
        },
        {
          "Robot Type": "Bin Picking System",
          "Primary Sensors": "3D structured light, RGB",
          "Data Volume": "200K+ grasp attempts",
          "Key Annotations": "6-DoF grasp pose, collision-free path, part ID",
          "Update Frequency": "Per new part introduction"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Real-World Deployments",
      "paragraphs": [
        "FANUC, the world's largest industrial robot manufacturer with over 1 million robots installed, has deployed AI-powered bin picking systems that use deep learning for 6-DoF grasp estimation on randomly oriented parts. Their systems require training data covering the full diversity of parts in each application: different surface finishes (raw steel, chrome, painted, anodized), sizes, and orientations. FANUC's CRX collaborative robot line uses vision and force sensing for human-robot collaborative assembly, requiring training data that captures diverse human operator behaviors.",
        "ABB deploys over 500,000 robots globally across automotive, electronics, and general industry. Their PixelPaint system uses inkjet printing for automotive finishes, requiring micron-level accuracy and defect detection for paint quality. ABB's GoFa and SWIFTI cobots use AI-powered path planning that adapts in real time to human presence, requiring training data that covers the full range of human movements in collaborative workspaces.",
        "Universal Robots, the global cobot market leader with over 90,000 units deployed, has built an ecosystem where third-party AI companies (Photoneo, Zivid, Pickit) provide vision-guided manipulation. Training data for these systems must cover the enormous application diversity of UR cobots: from electronics assembly requiring sub-millimeter precision to palletizing boxes weighing up to 20 kg.",
        "Keyence and Cognex, the two largest machine vision companies, are increasingly integrating deep learning into their inspection platforms. Keyence's AI-powered IV3 series and Cognex's VisionPro ViDi use trained models for defect detection, OCR, and assembly verification. These systems require customer-specific training data because defect types are application-specific: a scratch on a smartphone screen looks nothing like porosity in an aluminum casting.",
        "Realtime Robotics provides motion planning software that generates collision-free paths in real time, enabling robots to work alongside humans without safety fences. Their system requires 3D environment models and human trajectory prediction data to plan safe paths that maintain productivity. Training data must include the worst-case human movements -- sudden reaches, dropped tools, stumbles -- that traditional safety systems handle with conservative blanket speed reductions."
      ]
    },
    {
      "type": "prose",
      "heading": "Relevant Data Modalities",
      "paragraphs": [
        "Manufacturing robotics requires a precision-focused sensor mix. Core modalities include industrial RGB cameras (GigE Vision or Camera Link, 1-20 megapixel, global shutter), structured light 3D sensors for point cloud generation, laser line profilers for weld and surface measurement, force-torque sensors (6-axis, 1-10 kHz sampling), proximity and safety sensors (laser scanners, light curtains), and encoder data from robot joints for trajectory recording. Thermal cameras are used for monitoring heat-affected zones in welding and for detecting overheating components in electronics assembly.",
        "The critical manufacturing requirement is precision and repeatability in annotations. A defect inspection dataset where annotators disagree on defect boundaries by 5 pixels may be acceptable for general object detection but is unacceptable for quality inspection where that 5-pixel uncertainty represents a pass/fail decision on a $500 part. Manufacturing annotation protocols require calibrated displays, standardized viewing conditions, and inter-annotator agreement metrics that meet production quality standards.",
        "Time-series data is essential for process monitoring. Manufacturing AI increasingly moves beyond single-frame inspection to process monitoring that analyzes trends over time: tool wear progression, dimensional drift across a production run, and statistical process control (SPC) signals. Training data must include sequential production data with process parameter metadata (machine settings, tool age, material lot) that enables models to detect out-of-control conditions before they produce defective parts."
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "ifr-world-robotics-2024",
          "title": "World Robotics 2024 -- Industrial Robots",
          "authors": "International Federation of Robotics",
          "venue": "IFR Statistical Department 2024",
          "year": 2024,
          "url": "https://ifr.org/worldrobotics/"
        },
        {
          "id": "li-defect-survey-2023",
          "title": "A Survey of Deep Learning-Based Surface Defect Detection in Manufacturing",
          "authors": "Li et al.",
          "venue": "Journal of Manufacturing Systems 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2307.07466"
        },
        {
          "id": "villani-cobot-survey-2018",
          "title": "Survey on Human-Robot Collaboration in Industrial Settings",
          "authors": "Villani et al.",
          "venue": "Mechatronics 2018",
          "year": 2018,
          "url": "https://doi.org/10.1016/j.mechatronics.2018.02.010"
        },
        {
          "id": "mahler-dexnet-2019",
          "title": "Learning Ambidextrous Robot Grasping Policies",
          "authors": "Mahler et al.",
          "venue": "Science Robotics 2019",
          "year": 2019,
          "url": "https://doi.org/10.1126/scirobotics.aau4984"
        },
        {
          "id": "morrison-grasp-2020",
          "title": "Closing the Loop for Robotic Grasping: A Real-Time Generative Grasp Synthesis Approach",
          "authors": "Morrison et al.",
          "venue": "Robotics and Autonomous Systems 2020",
          "year": 2020,
          "url": "https://doi.org/10.1016/j.robot.2019.103322"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Serves Manufacturing Robotics",
      "paragraphs": [
        "Claru collects training data on active factory floors with collectors trained on facility-specific safety protocols including OSHA lockout/tagout, PPE requirements, and machine guarding procedures. Our collection equipment is rated for industrial environments and includes machine-vision-grade cameras, structured light scanners, and calibrated force-torque sensors.",
        "Our annotation pipeline includes manufacturing-specific protocols: defect classification per customer-specific severity scales (with inter-annotator agreement metrics exceeding 95% on binary pass/fail), weld quality grading per AWS D1.1 or ISO 5817, 6-DoF part pose estimation with sub-millimeter ground truth from fiducial markers, and human-robot interaction annotations following ISO/TS 15066 body-region classifications. We deliver data in formats compatible with industrial vision platforms (GigE Vision, HALCON, VisionPro) and robot programming environments (FANUC TP, ABB RAPID, Universal Robots URScript).",
        "For quality inspection applications, we address the extreme class imbalance challenge through targeted defect collection campaigns. Rather than waiting for defects to appear naturally at 0.1% rates, we work with production engineering teams to capture known defect types from reject bins, controlled defect introduction panels, and process upset conditions, building balanced training sets that enable effective defect detection without relying solely on synthetic data augmentation."
      ]
    }
  ],
  "faqs": [
    {
      "question": "How does Claru handle the extreme class imbalance in manufacturing defect detection datasets?",
      "answer": "Manufacturing defect detection is inherently imbalanced because well-run production lines have defect rates below 0.1%. Claru addresses this through a multi-strategy approach. First, we conduct targeted collection campaigns focused on known defect types, working with production engineering to capture defects from reject bins, scrap analysis, and controlled introduction. Second, we capture under multiple lighting geometries and viewing angles to maximize defect visibility and create diverse positive examples from each defect instance. Third, we work with the customer's quality team to define defect severity scales and annotation guidelines that match production quality standards. Fourth, we track inter-annotator agreement metrics and require above 95% agreement on binary pass/fail decisions before releasing data. This produces datasets with sufficient positive examples per defect class to train effective detectors."
    },
    {
      "question": "Can Claru provide training data for collaborative robot safety validation?",
      "answer": "Yes. Our cobot datasets include scenarios specifically designed for ISO/TS 15066 safety validation. We capture human-robot proximity data across the four collaborative modes: safety-rated monitored stop, hand guiding, speed and separation monitoring, and power and force limiting. For power and force limiting, we include contact scenario data covering the 29 body regions defined in ISO/TS 15066, with force-torque measurements at quasi-static and transient contact conditions. Human subjects in our datasets wear motion capture markers for ground-truth pose estimation and include diverse body types and PPE configurations. Safety-stop trigger scenarios -- where the human enters the reduced-speed zone or makes unexpected contact -- are captured systematically to ensure training data covers the edge cases that safety systems must handle."
    },
    {
      "question": "What manufacturing sectors does Claru's data cover?",
      "answer": "Our manufacturing datasets span automotive (body assembly, paint inspection, powertrain, EV battery), electronics (PCB assembly, connector insertion, display inspection), aerospace (composite layup, fastener installation, NDT), medical device (clean room assembly, precision measurement), consumer goods (packaging, labeling, cosmetic inspection), and general metalworking (CNC machining, welding, casting, forging). Each sector has distinct defect types, precision requirements, and regulatory frameworks. We adapt our annotation protocols to match sector-specific quality standards: IATF 16949 for automotive, AS9100 for aerospace, ISO 13485 for medical devices, and customer-specific severity scales for consumer goods."
    },
    {
      "question": "Does Claru provide bin picking training data for random part orientation?",
      "answer": "Yes. Bin picking is one of our most requested manufacturing applications. Our datasets include dense 3D point clouds of randomly oriented parts captured with structured light sensors at production-relevant resolutions (0.1-0.5mm point spacing). Each scene is annotated with 6-DoF pose for every visible part instance, collision-free grasp points with approach vectors, and part segmentation masks that handle occlusion in dense piles. We cover parts across surface finishes (raw metal, painted, chrome, anodized, plastic) and sizes (from M3 screws to 300mm castings). Our data includes the critical failure modes: tangled parts, parts stuck to bin walls, and deformable packaging material mixed with rigid parts."
    },
    {
      "question": "How does Claru ensure annotation quality meets manufacturing precision standards?",
      "answer": "Manufacturing annotation requires higher precision than most domains because annotations directly affect production quality decisions. We implement a four-tier quality system. First, annotators complete domain training specific to the manufacturing application, including hands-on familiarization with the actual parts and defects. Second, all annotation is performed on calibrated displays under standardized viewing conditions. Third, every annotation passes through a two-stage review: peer review by a second annotator and expert review by a manufacturing quality specialist. Fourth, we compute inter-annotator agreement metrics on a rotating sample basis and require above 95% agreement on binary decisions and above 85% IoU on defect boundary delineation. Disagreements are resolved through consensus review with the customer's quality team, creating a documented annotation guideline that evolves with the project."
    }
  ],
  "ctaHeading": "Discuss Manufacturing Robotics Data Needs",
  "ctaDescription": "Tell us about your manufacturing robotics project -- whether it is defect inspection, bin picking, collaborative assembly, or AMR navigation. Claru will scope a data collection plan tailored to your factory environment and quality standards.",
  "relatedGlossaryTerms": [
    "embodied-ai",
    "physical-ai",
    "teleoperation-data",
    "imitation-learning",
    "sim-to-real-transfer"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "regulations": [
    {
      "name": "ISO 10218-1/2",
      "jurisdiction": "International",
      "description": "Safety requirements for industrial robots and robot system integration.",
      "dataImplications": "Training data must include human proximity detection at safety-rated speeds and emergency stop response validation."
    },
    {
      "name": "ISO/TS 15066",
      "jurisdiction": "International",
      "description": "Collaborative robot safety with force and pressure limits for 29 body regions.",
      "dataImplications": "Contact scenario data covering all four collaborative modes with biomechanical threshold validation."
    },
    {
      "name": "ISO 9001 / IATF 16949",
      "jurisdiction": "International",
      "description": "Quality management systems for manufacturing and automotive suppliers.",
      "dataImplications": "Defect annotations must be traceable to inspector, guideline version, and review cycle for QMS compliance."
    },
    {
      "name": "EU Machinery Directive 2006/42/EC",
      "jurisdiction": "EU",
      "description": "Essential health and safety requirements for industrial machinery.",
      "dataImplications": "Training data must cover degraded-mode scenarios: sensor failure, comms loss, power interruption."
    },
    {
      "name": "OSHA 1910.212 / ANSI/RIA R15.06",
      "jurisdiction": "US",
      "description": "Machine guarding and robot safety standards.",
      "dataImplications": "Safeguarding validation data: light curtain response, area scanner zones, safety mat activation."
    },
    {
      "name": "EU AI Act (High-Risk)",
      "jurisdiction": "EU",
      "description": "Safety-critical industrial robot AI classified as high-risk.",
      "dataImplications": "Documented completeness metrics, bias analysis, and data governance per Article 10."
    }
  ],
  "environmentCharacteristics": [
    {
      "characteristic": "Harsh Lighting and Reflections",
      "description": "High-bay LED/fluorescent, strong shadows, specular highlights on machined metal.",
      "dataChallenge": "Vision systems must handle variable lighting, reflective surfaces, and shift-to-shift changes."
    },
    {
      "characteristic": "Coolant, Oil, and Particulate",
      "description": "CNC coolant mist, hydraulic oil, grinding dust contaminate sensor surfaces.",
      "dataChallenge": "Training data must represent the full clean-to-fouled degradation curve between maintenance intervals."
    },
    {
      "characteristic": "Vibration and Noise",
      "description": "Stamping presses, compressors, CNC machines create 0.1-100 Hz vibration and 85+ dB noise.",
      "dataChallenge": "Force-torque noise filtering, camera motion blur, acoustic inspection above high noise floor."
    },
    {
      "characteristic": "Collaborative Human-Robot Zones",
      "description": "Cobots sharing workspace with human operators wearing varied PPE.",
      "dataChallenge": "Diverse human poses, PPE configurations, variable worker speeds, handoff interaction dynamics."
    },
    {
      "characteristic": "High-Speed Operations",
      "description": "100+ cycles/min pick-and-place, 10-60 mm/s welding, sub-second assembly cycles.",
      "dataChallenge": "500+ Hz force-torque, 60+ FPS vision, sub-millisecond synchronization required."
    },
    {
      "characteristic": "Product Variant Diversity",
      "description": "Mixed-model lines with dozens to hundreds of variants per workstation.",
      "dataChallenge": "Models must recognize all variants including rare ones appearing only a few times per shift."
    }
  ],
  "commonTasks": [
    {
      "task": "Vision-Guided Assembly",
      "description": "Camera-based part location, orientation, and assembly with insertion/fastening.",
      "dataRequirements": "6-DoF part pose across variants, force-torque insertion profiles, success/failure per assembly step."
    },
    {
      "task": "Surface Defect Inspection",
      "description": "Detection of scratches, dents, porosity, discoloration on manufactured parts.",
      "dataRequirements": "Multi-angle imagery, pixel-level defect masks, severity grades. Class imbalance <0.1% defect rate."
    },
    {
      "task": "Weld Quality Assessment",
      "description": "Visual and sensor evaluation of weld seams for porosity, undercut, spatter.",
      "dataRequirements": "Multi-angle weld imagery, laser profilometry, classification per AWS D1.1 or ISO 5817."
    },
    {
      "task": "Bin Picking and Kitting",
      "description": "Picking randomly oriented parts from bins for assembly or kitting.",
      "dataRequirements": "Dense 3D point clouds, 6-DoF grasp annotations, collision-free paths, surface finish variation."
    },
    {
      "task": "Factory Floor AMR Navigation",
      "description": "Autonomous material transport between workstations, warehouse, and docks.",
      "dataRequirements": "Dynamic obstacle avoidance (forklifts, pedestrians), floor marking recognition, docking alignment."
    },
    {
      "task": "Human-Robot Collaborative Handoff",
      "description": "Coordinated tasks with human-robot alternation on shared workpieces.",
      "dataRequirements": "Close-proximity human pose tracking, handoff timing, intent prediction, safety-stop trigger scenarios."
    }
  ],
  "relevantModalities": [
    "Industrial RGB (GigE Vision, global shutter)",
    "Structured light 3D",
    "Laser line profiler",
    "Force/torque (6-axis, 1-10 kHz)",
    "Proximity / safety sensors",
    "Robot joint encoders",
    "Thermal (heat-affected zones)",
    "Acoustic (process monitoring)"
  ],
  "keyPapers": [
    {
      "id": "ifr-world-robotics-2024",
      "title": "World Robotics 2024 -- Industrial Robots",
      "authors": "International Federation of Robotics",
      "venue": "IFR Statistical Department 2024",
      "year": 2024,
      "url": "https://ifr.org/worldrobotics/"
    },
    {
      "id": "li-defect-survey-2023",
      "title": "A Survey of Deep Learning-Based Surface Defect Detection in Manufacturing",
      "authors": "Li et al.",
      "venue": "Journal of Manufacturing Systems 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2307.07466"
    },
    {
      "id": "villani-cobot-survey-2018",
      "title": "Survey on Human-Robot Collaboration in Industrial Settings",
      "authors": "Villani et al.",
      "venue": "Mechatronics 2018",
      "year": 2018,
      "url": "https://doi.org/10.1016/j.mechatronics.2018.02.010"
    },
    {
      "id": "mahler-dexnet-2019",
      "title": "Learning Ambidextrous Robot Grasping Policies",
      "authors": "Mahler et al.",
      "venue": "Science Robotics 2019",
      "year": 2019,
      "url": "https://doi.org/10.1126/scirobotics.aau4984"
    },
    {
      "id": "morrison-grasp-2020",
      "title": "Closing the Loop for Robotic Grasping: A Real-Time Generative Grasp Synthesis Approach",
      "authors": "Morrison et al.",
      "venue": "Robotics and Autonomous Systems 2020",
      "year": 2020,
      "url": "https://doi.org/10.1016/j.robot.2019.103322"
    }
  ],
  "claruRelevance": "Claru collects on active factory floors with safety-trained collectors and industrial-grade capture equipment. Our annotation pipeline delivers manufacturing-precision quality: defect classification with 95%+ inter-annotator agreement, weld grading per AWS/ISO standards, 6-DoF pose estimation with sub-millimeter ground truth, and ISO/TS 15066 body-region contact annotations. We address extreme class imbalance through targeted defect collection campaigns and deliver in industrial vision platform formats."
};

export default data;
