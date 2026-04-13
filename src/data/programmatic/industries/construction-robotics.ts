import type { IndustryPageData } from "./types";

const data: IndustryPageData = {
  "slug": "construction-robotics",
  "metaTitle": "Construction Robotics Training Data | Claru",
  "metaDescription": "Training data for construction robots: bricklaying, concrete finishing, site inspection drones, demolition, and heavy equipment automation on active sites.",
  "primaryKeyword": "construction robotics training data",
  "secondaryKeywords": [
    "construction robotics data",
    "construction site AI data",
    "autonomous heavy equipment data",
    "construction drone inspection data",
    "robotic bricklaying datasets",
    "BIM robotics training data"
  ],
  "canonicalPath": "/industries/construction-robotics",
  "h1": "Construction Robotics Training Data",
  "heroSubtitle": "Training data for construction robots: bricklaying, concrete finishing, site inspection drones, demolition, and heavy equipment automation on active construction sites. Built for the safety standards and environmental variability that define jobsite robotics.",
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
      "label": "Construction Robotics",
      "href": "/industries/construction-robotics"
    }
  ],
  "sections": [
    {
      "type": "prose",
      "heading": "Why Construction Robotics Data Is Uniquely Challenging",
      "paragraphs": [
        "Construction sites are among the most data-hostile environments for robotics. Unlike factories with controlled lighting and fixed layouts, a construction site changes daily. Walls appear, floors get poured, scaffolding moves, and the ground conditions shift with weather. A robot trained on Monday's site map may navigate a fundamentally different environment by Friday. This temporal non-stationarity makes construction one of the hardest domains for learning-based robotics.",
        "The labor shortage in construction is acute: the US construction industry needs an estimated 500,000+ additional workers annually. Companies like Built Robotics, Dusty Robotics, and Construction Robotics Inc. are deploying autonomous excavators, layout-printing robots, and bricklaying systems to fill this gap. But each of these systems requires training data that captures the messy reality of jobsites -- mud, dust, uneven terrain, temporary structures, and unpredictable human activity.",
        "Safety regulations add another layer. OSHA 29 CFR 1926 governs construction safety in the US, with specific requirements for fall protection zones, excavation safety, and heavy equipment proximity. The EU Machinery Directive (2006/42/EC) mandates risk assessments for autonomous construction equipment. Training data must document these safety scenarios to enable compliant autonomous operation."
      ]
    },
    {
      "type": "cards",
      "heading": "Regulatory Requirements",
      "cards": [
        {
          "title": "OSHA 29 CFR 1926 (US)",
          "description": "Construction industry safety standards covering fall protection, excavation, scaffolding, and heavy equipment. Robots operating on US construction sites must recognize exclusion zones, overhead hazards, and trench boundaries. Training data must include annotated examples of workers in fall-risk positions, unsecured edges, and equipment approach zones at distances specified in OSHA Subpart O (motor vehicles and mechanized equipment)."
        },
        {
          "title": "EU Machinery Directive 2006/42/EC (EU)",
          "description": "Safety requirements for machinery including autonomous construction equipment. Requires comprehensive risk assessment data covering all foreseeable misuse scenarios. Autonomous excavators and concrete-finishing robots must demonstrate safe behavior during power loss, sensor failure, and unexpected human entry into the work zone. Training data must cover these degraded-mode scenarios."
        },
        {
          "title": "ISO 17757 (International)",
          "description": "Earth-moving machinery safety standard for autonomous and semi-autonomous systems. Requires training data covering the complete operational design domain including slope stability limits, edge-of-excavation detection, and adverse weather conditions. Data must validate both autonomous navigation and emergency-stop response on grades up to the machine's rated capability."
        },
        {
          "title": "ANSI/ASSP A10.48 (US)",
          "description": "Criteria for safety practices with the operation of drones on construction sites. Drone inspection data must include documented flight plans, geofence boundaries, and visual observer positioning. Training data for autonomous drone inspection must cover no-fly zone recognition, temporary flight restriction awareness, and abort-landing scenario planning."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Environment Characteristics",
      "cards": [
        {
          "title": "Temporally Non-Stationary Layouts",
          "description": "Construction sites change daily as structures rise, formwork moves, and materials arrive. Data challenge: Maps and navigation data expire rapidly. Models need continuous re-mapping capability, and training data must include time-series captures showing site evolution across construction phases."
        },
        {
          "title": "Unstructured and Deformable Terrain",
          "description": "Mud, gravel, sand, loose soil, and freshly poured concrete create surfaces that deform under robot weight. Data challenge: Terrain traversability assessment requires not just visual data but soil-type classification and load-bearing estimation. Standard indoor navigation datasets are useless here."
        },
        {
          "title": "Extreme Dust, Vibration, and Weather",
          "description": "Concrete cutting generates dense dust clouds. Pile driving creates extreme vibration. Sites operate in rain, snow, and temperatures from -20C to +45C. Data challenge: Sensor degradation from dust accumulation, lens contamination, and vibration-induced blur must be represented in training data for robust perception."
        },
        {
          "title": "Dense Human Activity with PPE Variation",
          "description": "Construction workers wear hard hats, high-visibility vests, harnesses, and face shields that alter their visual appearance. Workers operate power tools, carry materials, and move unpredictably. Data challenge: Person detection models must handle extreme PPE variation, partial occlusion by carried materials, and workers in non-standard poses (crouching, climbing, leaning)."
        },
        {
          "title": "Multi-Story Vertical Environments",
          "description": "High-rise construction involves operations across multiple open floors connected by temporary stairs and hoists. Data challenge: 3D navigation across incomplete floor plates, open edges without guardrails, and vertical transitions between levels via construction elevators."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Common Robotics Tasks",
      "cards": [
        {
          "title": "Autonomous Excavation",
          "description": "Self-driving excavators and bulldozers performing earthwork, trenching, and grading. Data requirements: GPS-RTK positioning logs, bucket trajectory recordings, soil classification from penetration resistance, grade control sensor data, and proximity detection for workers and equipment within the swing radius."
        },
        {
          "title": "Robotic Bricklaying and Masonry",
          "description": "Automated placement of bricks, blocks, or panels according to BIM specifications. Data requirements: Manipulation trajectories with mortar application timing, course-level quality inspection images, placement accuracy measurements (deviation from BIM coordinates), and environmental condition logs (temperature, humidity affecting mortar cure)."
        },
        {
          "title": "Drone-Based Site Inspection",
          "description": "Autonomous UAV flights for progress monitoring, safety audits, and structural inspection. Data requirements: Georeferenced orthophotos, 3D point clouds from photogrammetry, defect annotations on concrete and steel elements, and safety-violation detection (missing guardrails, unsecured edges, PPE non-compliance)."
        },
        {
          "title": "Concrete Finishing and 3D Printing",
          "description": "Robotic screeding, troweling, and additive manufacturing of concrete structures. Data requirements: Surface flatness measurements (FF/FL numbers), toolpath trajectories with force feedback, concrete slump and workability metrics, and time-series data showing surface quality evolution during curing."
        },
        {
          "title": "Layout and Marking",
          "description": "Autonomous robots that print full-scale floor plans directly onto concrete decks from BIM models. Data requirements: Localization data relative to BIM coordinate systems, print-quality inspection images, deviation measurements from design intent, and obstacle-avoidance trajectories around rebar and MEP penetrations."
        }
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Data Requirements by Robot Type in Construction",
      "description": "Construction robots range from multi-ton excavators to lightweight inspection drones. Each demands different sensor suites, data volumes, and annotation types.",
      "columns": ["Robot Type", "Primary Sensors", "Data Volume", "Key Annotations", "Update Frequency"],
      "rows": [
        {
          "Robot Type": "Autonomous Excavator",
          "Primary Sensors": "GPS-RTK, LiDAR, stereo camera, IMU",
          "Data Volume": "10K+ hours operation logs",
          "Key Annotations": "Terrain class, grade targets, proximity zones, bucket trajectories",
          "Update Frequency": "Per site / soil type change"
        },
        {
          "Robot Type": "Bricklaying / Masonry Robot",
          "Primary Sensors": "RGB-D, force/torque, laser scanner",
          "Data Volume": "50K+ placement episodes",
          "Key Annotations": "Placement accuracy, mortar quality, course alignment",
          "Update Frequency": "Per wall type / material change"
        },
        {
          "Robot Type": "Inspection Drone (UAV)",
          "Primary Sensors": "RGB (gimbal), thermal, LiDAR",
          "Data Volume": "100K+ georeferenced images",
          "Key Annotations": "Defect masks, progress status, safety violations",
          "Update Frequency": "Weekly flight campaigns"
        },
        {
          "Robot Type": "Layout / Marking Robot",
          "Primary Sensors": "Total station, RGB, wheel odometry",
          "Data Volume": "1K+ floor layouts",
          "Key Annotations": "BIM deviation, obstacle maps, print quality",
          "Update Frequency": "Per floor / building phase"
        },
        {
          "Robot Type": "Demolition Robot",
          "Primary Sensors": "LiDAR, RGB, vibration, dust sensor",
          "Data Volume": "5K+ hours demolition logs",
          "Key Annotations": "Structural element IDs, exclusion zones, debris trajectory",
          "Update Frequency": "Per structure / demolition phase"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Real-World Deployments",
      "paragraphs": [
        "Built Robotics retrofits standard construction equipment (excavators, dozers, compact track loaders) with autonomous control systems. Their Exosystem platform has been deployed on solar farm grading, pipeline trenching, and residential site preparation projects across the US. The core challenge is that every jobsite has unique soil conditions, grades, and utility locations -- meaning the perception and planning systems must generalize across sites without extensive per-site tuning.",
        "Dusty Robotics deploys the FieldPrinter, an autonomous robot that prints full-scale BIM layouts onto concrete decks. Deployed on projects by DPR Construction, Swinerton, and Hensel Phelps, the system replaces manual chalk-line layout with sub-1/16-inch accuracy. The training data challenge is localization: the robot must precisely register its position relative to the BIM coordinate system on a featureless concrete slab, often in multi-story buildings where GPS is unavailable.",
        "Construction Robotics developed the SAM100 (Semi-Automated Mason), which lays bricks at rates of 300-400 per hour compared to a human mason's 300-500 per day. The system requires training data for brick grasping under varying mortar conditions, course-level quality assessment, and adaptive placement when as-built conditions deviate from BIM design intent.",
        "Skydio and DJI Enterprise drones are widely deployed for construction site inspection. Skydio's autonomous flight capability uses visual SLAM for GPS-denied environments like inside buildings under construction. Training these systems requires diverse datasets of construction-stage environments with structural elements at various completion stages."
      ]
    },
    {
      "type": "prose",
      "heading": "Relevant Data Modalities",
      "paragraphs": [
        "Construction robotics requires a broad sensor mix tailored to harsh outdoor conditions. Primary modalities include RGB video (dust-resistant housings), LiDAR for 3D mapping and terrain assessment, GPS-RTK for centimeter-level positioning, IMU for motion tracking on vibrating platforms, thermal imaging for concrete curing and insulation inspection, and force-torque sensing for material placement tasks.",
        "A unique requirement is BIM integration. Construction robots must operate relative to Building Information Model coordinates, not just GPS or local SLAM frames. Training data must include BIM-registered point clouds and images with annotations that reference BIM element IDs, enabling models to understand not just what they see but what it means in the context of the construction plan."
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "melenbrink-construction-2020",
          "title": "On-Site Autonomous Construction Robots: Towards Unsupervised Building",
          "authors": "Melenbrink et al.",
          "venue": "Automation in Construction 2020",
          "year": 2020,
          "url": "https://doi.org/10.1016/j.autcon.2020.103312"
        },
        {
          "id": "kim-excavator-2021",
          "title": "Autonomous Excavator System for Material Loading Tasks",
          "authors": "Kim et al.",
          "venue": "Science Robotics 2021",
          "year": 2021,
          "url": "https://arxiv.org/abs/2106.07832"
        },
        {
          "id": "ham-drone-inspection-2016",
          "title": "Visual Monitoring of Civil Infrastructure Systems via Camera-Equipped Unmanned Aerial Vehicles",
          "authors": "Ham et al.",
          "venue": "Journal of Infrastructure Systems 2016",
          "year": 2016,
          "url": "https://doi.org/10.1061/(ASCE)IS.1943-555X.0000252"
        },
        {
          "id": "gharbia-bim-robotics-2020",
          "title": "Robotic Technologies for On-Site Building Construction: A Systematic Review",
          "authors": "Gharbia et al.",
          "venue": "Journal of Building Engineering 2020",
          "year": 2020,
          "url": "https://doi.org/10.1016/j.jobe.2019.101584"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Serves Construction Robotics",
      "paragraphs": [
        "Claru's collector network operates on active construction sites, capturing the environmental variability that indoor-collected data cannot replicate. Our collectors are trained on OSHA site safety protocols and equipped with ruggedized capture hardware suited to dust, vibration, and weather exposure. We collect multi-modal data across construction phases -- from site preparation through finishing -- providing time-series datasets that show how environments evolve.",
        "Our annotation pipeline includes construction-specific protocols: BIM-registered defect annotation where each finding is linked to the relevant BIM element ID, terrain traversability classification calibrated to specific machine weights, safety-violation detection following OSHA Subpart M (fall protection) and Subpart O (equipment proximity), and progress-tracking annotations that compare as-built conditions to BIM design intent. All data is delivered with full chain-of-custody documentation for regulatory compliance."
      ]
    }
  ],
  "faqs": [
    {
      "question": "How does Claru handle the constantly changing nature of construction sites?",
      "answer": "Construction sites change daily, which makes static datasets quickly obsolete. Claru addresses this through longitudinal collection campaigns where we return to the same site at regular intervals across construction phases. This produces time-series datasets showing site evolution from earthwork through structure, enclosure, and finishing. Our annotation pipeline timestamps every capture and links it to the relevant construction phase and BIM model revision. For autonomous navigation systems, we provide sequential map snapshots that train models to handle environmental non-stationarity rather than memorizing a fixed layout."
    },
    {
      "question": "What safety certifications do Claru's construction site collectors hold?",
      "answer": "All Claru collectors assigned to construction projects complete OSHA 10-hour Construction Safety Training at minimum, with lead collectors holding OSHA 30-hour certifications. Collectors are briefed on site-specific safety plans before every collection session, including designated walkways, exclusion zones, overhead hazard areas, and emergency procedures. Our collection equipment is inspected for site compliance including high-visibility markings and hard-hat-compatible camera mounts. We carry general liability and workers compensation insurance with limits that meet general contractor requirements for subcontractor access."
    },
    {
      "question": "Can Claru provide BIM-registered training data for layout and inspection robots?",
      "answer": "Yes. Claru delivers data with BIM coordinate registration, meaning every image, point cloud, and annotation includes spatial references tied to the project's BIM model. We work with the project team to obtain BIM exports in IFC or Revit format, establish control-point networks on site using total stations, and register all captured data to the BIM coordinate system. This enables training data where a detected crack is not just located in pixel space but linked to a specific BIM element (e.g., column C-4, level 3), which is essential for inspection robots that must generate reports referencing the design model."
    },
    {
      "question": "What terrain types does Claru's construction dataset cover?",
      "answer": "Our construction datasets include captures across a wide range of terrain conditions: compacted gravel, loose fill dirt, wet clay, sandy soil, freshly poured concrete (before and after curing), asphalt, mud, standing water, and frozen ground. Each terrain type is annotated with traversability ratings calibrated to specific machine weight classes (compact equipment under 5 tons, standard excavators 15-30 tons, and heavy equipment over 30 tons). We also capture transitional zones where terrain types change abruptly, such as the boundary between paved access roads and unprepared ground."
    },
    {
      "question": "Does Claru's data include worker detection scenarios specific to construction sites?",
      "answer": "Yes, and this is one of the most important differentiators of construction-specific training data. Construction workers look significantly different from pedestrians in general datasets. They wear hard hats, high-visibility vests, safety harnesses, face shields, and often carry tools or materials that alter their silhouette. Our datasets include workers in construction-specific poses: crouching to inspect formwork, climbing ladders, operating overhead cranes, working at height on scaffolding, and moving through partially enclosed spaces. We annotate PPE compliance status for each detected person, which serves double duty for both safety-system training and regulatory compliance monitoring."
    }
  ],
  "ctaHeading": "Discuss Construction Robotics Data Needs",
  "ctaDescription": "Tell us about your construction robotics project -- whether it is autonomous earthwork, drone inspection, or robotic assembly. Claru will scope a data collection and annotation plan tailored to your jobsite requirements and safety standards.",
  "relatedGlossaryTerms": [
    "embodied-ai",
    "physical-ai",
    "teleoperation-data",
    "sim-to-real-transfer"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "regulations": [
    {
      "name": "OSHA 29 CFR 1926",
      "jurisdiction": "US",
      "description": "Construction industry safety standards covering fall protection, excavation, scaffolding, and heavy equipment.",
      "dataImplications": "Data must include fall-risk zones, exclusion areas, trench boundaries, and equipment proximity scenarios per OSHA Subparts M and O."
    },
    {
      "name": "EU Machinery Directive 2006/42/EC",
      "jurisdiction": "EU",
      "description": "Safety requirements for autonomous construction machinery.",
      "dataImplications": "Training data must cover degraded-mode scenarios: power loss, sensor failure, and unexpected human entry."
    },
    {
      "name": "ISO 17757",
      "jurisdiction": "International",
      "description": "Earth-moving machinery safety for autonomous/semi-autonomous systems.",
      "dataImplications": "Data must cover slope stability, edge detection, adverse weather across the full operational envelope."
    },
    {
      "name": "ANSI/ASSP A10.48",
      "jurisdiction": "US",
      "description": "Safety practices for drone operations on construction sites.",
      "dataImplications": "Drone training data must include geofence boundaries, no-fly zone recognition, and abort-landing scenarios."
    }
  ],
  "environmentCharacteristics": [
    {
      "characteristic": "Temporally Non-Stationary Layouts",
      "description": "Sites change daily as structures rise, formwork moves, and materials arrive.",
      "dataChallenge": "Maps expire rapidly. Training data must include time-series captures showing site evolution."
    },
    {
      "characteristic": "Unstructured and Deformable Terrain",
      "description": "Mud, gravel, sand, loose soil, and freshly poured concrete.",
      "dataChallenge": "Terrain traversability requires visual + soil-type classification. Indoor datasets are useless."
    },
    {
      "characteristic": "Extreme Dust, Vibration, and Weather",
      "description": "Concrete cutting dust, pile driving vibration, operations in rain/snow/-20C to +45C.",
      "dataChallenge": "Sensor degradation from dust, lens contamination, and vibration blur must be in training data."
    },
    {
      "characteristic": "Dense Human Activity with PPE Variation",
      "description": "Workers in hard hats, harnesses, face shields, carrying tools and materials.",
      "dataChallenge": "Person detection must handle extreme PPE variation, occlusion, and non-standard poses."
    },
    {
      "characteristic": "Multi-Story Vertical Environments",
      "description": "Operations across incomplete floor plates, open edges, construction elevators.",
      "dataChallenge": "3D navigation across levels with temporary structures and no guardrails."
    }
  ],
  "commonTasks": [
    {
      "task": "Autonomous Excavation",
      "description": "Self-driving excavators performing earthwork, trenching, and grading.",
      "dataRequirements": "GPS-RTK logs, bucket trajectories, soil classification, grade control data, proximity detection."
    },
    {
      "task": "Robotic Bricklaying and Masonry",
      "description": "Automated brick/block placement according to BIM specifications.",
      "dataRequirements": "Manipulation trajectories, mortar timing, placement accuracy vs BIM coordinates, environmental logs."
    },
    {
      "task": "Drone-Based Site Inspection",
      "description": "Autonomous UAV flights for progress monitoring and safety audits.",
      "dataRequirements": "Georeferenced orthophotos, 3D point clouds, defect annotations, safety-violation detection."
    },
    {
      "task": "Concrete Finishing and 3D Printing",
      "description": "Robotic screeding, troweling, and additive concrete manufacturing.",
      "dataRequirements": "Surface flatness measurements, toolpath trajectories, force feedback, curing time-series data."
    },
    {
      "task": "Layout and Marking",
      "description": "Autonomous robots printing BIM layouts onto concrete decks.",
      "dataRequirements": "BIM-registered localization, print quality inspection, deviation measurements, obstacle avoidance."
    }
  ],
  "relevantModalities": [
    "RGB video (dust-resistant)",
    "LiDAR (3D mapping)",
    "GPS-RTK",
    "IMU",
    "Thermal imaging",
    "Force/torque",
    "Total station / BIM registration",
    "Photogrammetry point clouds"
  ],
  "keyPapers": [
    {
      "id": "melenbrink-construction-2020",
      "title": "On-Site Autonomous Construction Robots: Towards Unsupervised Building",
      "authors": "Melenbrink et al.",
      "venue": "Automation in Construction 2020",
      "year": 2020,
      "url": "https://doi.org/10.1016/j.autcon.2020.103312"
    },
    {
      "id": "kim-excavator-2021",
      "title": "Autonomous Excavator System for Material Loading Tasks",
      "authors": "Kim et al.",
      "venue": "Science Robotics 2021",
      "year": 2021,
      "url": "https://arxiv.org/abs/2106.07832"
    },
    {
      "id": "ham-drone-inspection-2016",
      "title": "Visual Monitoring of Civil Infrastructure Systems via Camera-Equipped Unmanned Aerial Vehicles",
      "authors": "Ham et al.",
      "venue": "Journal of Infrastructure Systems 2016",
      "year": 2016,
      "url": "https://doi.org/10.1061/(ASCE)IS.1943-555X.0000252"
    },
    {
      "id": "gharbia-bim-robotics-2020",
      "title": "Robotic Technologies for On-Site Building Construction: A Systematic Review",
      "authors": "Gharbia et al.",
      "venue": "Journal of Building Engineering 2020",
      "year": 2020,
      "url": "https://doi.org/10.1016/j.jobe.2019.101584"
    }
  ],
  "claruRelevance": "Claru's collector network operates on active construction sites with OSHA-trained personnel and ruggedized equipment. We capture multi-modal data across construction phases with BIM-registered annotations, delivering time-series datasets that reflect the evolving nature of jobsite environments."
};

export default data;
