import type { IndustryPageData } from "./types";

const data: IndustryPageData = {
  "slug": "energy-robotics",
  "metaTitle": "Energy Robotics Training Data | Claru",
  "metaDescription": "Training data for energy sector robots: power plant inspection, pipeline monitoring, wind turbine maintenance, solar farm operations, and oil rig automation.",
  "primaryKeyword": "energy robotics training data",
  "secondaryKeywords": [
    "energy robotics data",
    "pipeline inspection robot data",
    "wind turbine maintenance AI",
    "solar farm robotics data",
    "oil and gas robot datasets",
    "power plant inspection data"
  ],
  "canonicalPath": "/industries/energy-robotics",
  "h1": "Energy Robotics Training Data",
  "heroSubtitle": "Training data for energy sector robots: power plant inspection, pipeline monitoring, wind turbine maintenance, solar farm operations, and oil rig automation. Built for hazardous environments where sensor degradation and explosive atmospheres define the data challenge.",
  "breadcrumbs": [
    { "label": "Home", "href": "/" },
    { "label": "Industries", "href": "/industries" },
    { "label": "Energy Robotics", "href": "/industries/energy-robotics" }
  ],
  "sections": [
    {
      "type": "prose",
      "heading": "Why Energy Robotics Data Is a Domain Apart",
      "paragraphs": [
        "Energy infrastructure presents some of the most hazardous operating environments for robotics: explosive atmospheres in oil refineries, high-voltage zones in power substations, extreme heights on wind turbines, and corrosive subsea conditions on offshore platforms. These environments are dangerous for humans -- which is exactly why robots are needed -- but they are equally hostile to sensors and data collection equipment.",
        "The energy sector is investing aggressively in robotic inspection and maintenance. Boston Dynamics' Spot is deployed at dozens of oil and gas facilities for routine inspection rounds. Energy Robotics GmbH provides autonomy software for quadrupeds and wheeled robots in refineries. Flyability's Elios drones inspect confined spaces inside boilers and tanks. SkySpecs has inspected over 350,000 wind turbines with autonomous drones. Each of these systems requires training data from the specific energy environments where they operate.",
        "The global energy robotics market exceeded $7 billion in 2024 and is projected to reach $15 billion by 2030, driven by aging infrastructure that demands more inspection, a shrinking skilled workforce, and increasingly stringent safety regulations. The International Energy Agency estimates that global power grids alone require $600 billion in annual investment through 2030, with a significant portion going to inspection and maintenance automation. Every dollar of that investment depends on AI systems trained on representative, high-quality data.",
        "Regulatory requirements in energy are particularly stringent. NERC CIP standards protect the bulk power system's cybersecurity. ATEX (EU) and Class/Division (US) ratings govern equipment in explosive atmospheres. OSHA Process Safety Management (29 CFR 1910.119) covers highly hazardous chemicals. Nuclear facilities add NRC 10 CFR 50 regulations. Training data collected in these environments must comply with facility access requirements, data handling restrictions, and safety protocols that are significantly more demanding than commercial or academic settings."
      ]
    },
    {
      "type": "cards",
      "heading": "Regulatory Requirements",
      "cards": [
        {
          "title": "NERC CIP Standards (US/Canada)",
          "description": "Critical Infrastructure Protection standards for the bulk electric system. Data collected from power generation and transmission facilities may contain BES Cyber System Information. Training data must be handled under CIP-004 (personnel and training), CIP-011 (information protection), and facility access must comply with CIP-006 physical security requirements. CIP-013 adds supply chain risk management for any third-party data handling."
        },
        {
          "title": "ATEX Directive 2014/34/EU (EU)",
          "description": "Equipment for use in explosive atmospheres. Robots and sensors operating in ATEX Zone 1 or Zone 2 must be certified intrinsically safe (Ex ia or Ex ib). Training data for these environments must include gas detection scenarios, emergency shutdown sequences, and sensor behavior under explosive atmosphere conditions. Data collection equipment itself must be ATEX-rated -- a constraint that eliminates most commercial-grade cameras and LiDAR units."
        },
        {
          "title": "OSHA PSM -- 29 CFR 1910.119 (US)",
          "description": "Process Safety Management for highly hazardous chemicals. Robotic inspection in facilities handling threshold quantities of listed chemicals requires adherence to PSM protocols. Training data must include scenarios relevant to mechanical integrity verification, leak detection, and process hazard analysis. Collectors must complete facility-specific PSM training covering emergency response procedures, hot work permits, and line-breaking protocols."
        },
        {
          "title": "API 1160 / ASME B31.8S (US)",
          "description": "Pipeline integrity management standards. Autonomous pipeline inspection robots (smart pigs and external crawlers) must produce data that meets integrity management program requirements. Training data for defect detection must cover the specific anomaly types defined in these standards: corrosion (internal and external), dents, cracking (SCC, fatigue, hydrogen-induced), and laminations. API 1163 governs in-line inspection system qualification."
        },
        {
          "title": "NRC 10 CFR 50 (US)",
          "description": "Nuclear Regulatory Commission licensing requirements for nuclear power plants. Robots operating in nuclear facilities face radiation exposure limits, contamination control requirements, and ALARA (As Low As Reasonably Achievable) dose management. Training data collected in nuclear environments must document radiation zone classifications, and all equipment must be decontaminable or disposable."
        },
        {
          "title": "IEC 61400-24 / IEC 61400-25 (International)",
          "description": "Wind turbine lightning protection and communications standards. Drone inspection data for wind turbines must be annotated per IEC 61400-24 lightning damage categories. Condition monitoring data must align with IEC 61400-25 information models to ensure interoperability with SCADA systems and predictive maintenance platforms."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Environment Characteristics",
      "cards": [
        {
          "title": "Explosive and Hazardous Atmospheres",
          "description": "Refineries, gas processing plants, and petrochemical facilities contain flammable gas/vapor zones classified under ATEX or NEC Class/Division systems. Data challenge: All collection equipment must be intrinsically safe rated. Sensor selection is constrained by ATEX/Class-Division certification. Standard commercial cameras and LiDAR may not be permitted, limiting available training modalities to certified units with lower resolution and narrower field of view."
        },
        {
          "title": "Extreme Heights and Confined Spaces",
          "description": "Wind turbine nacelles at 80-150m height, boiler interiors, pressure vessel manholes, cable tunnels, and cooling tower shells. Data challenge: Limited sensor access, constrained lighting, and spatial geometry that differs radically from open-environment datasets. Drone data near turbine blades must handle extreme downdrafts, blade proximity turbulence, and precise standoff distance maintenance."
        },
        {
          "title": "Corrosive and Fouled Environments",
          "description": "Offshore salt spray, refinery chemical residue, thermal cycling that degrades sensor surfaces, and coal dust in power plants. Data challenge: Lens fouling, corrosion-induced color shifts, and gradual sensor degradation must be represented in training data to build robust perception models. Models trained only on clean-lens imagery fail catastrophically after hours of real-world deployment."
        },
        {
          "title": "High-Voltage and Electromagnetic Interference",
          "description": "Power substations operating at 110-765 kV, transmission lines, and generator halls expose robots to intense EMI. Data challenge: EMI can corrupt sensor data, create artifacts in cameras, interfere with LiDAR return signals, and disrupt communication links. Training data must include EMI-affected captures so models learn to handle or reject these artifacts rather than misclassifying them."
        },
        {
          "title": "Remote and Access-Restricted Sites",
          "description": "Offshore platforms accessible only by helicopter, remote pipelines crossing thousands of kilometers of wilderness, desert solar farms, and arctic wind installations. Data challenge: Limited data backhaul bandwidth (often satellite-only), no local compute infrastructure, and extreme logistics costs for on-site collection campaigns. On-device processing capability and intermittent connectivity must be assumed in training data pipeline design."
        },
        {
          "title": "Extreme Temperature Ranges",
          "description": "Gas turbine exhaust paths exceed 600C. LNG facilities operate at -162C. Solar farms in desert regions cycle between -5C overnight and 55C midday. Data challenge: Thermal cameras must be calibrated across the full operating range. Sensor behavior changes with temperature -- dark current noise increases in heat, battery performance degrades in cold. Training data must represent the full thermal envelope."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Common Robotics Tasks",
      "cards": [
        {
          "title": "Routine Facility Inspection",
          "description": "Autonomous patrol robots conducting scheduled inspection rounds at refineries, substations, and power plants. Data requirements: Multi-modal baseline imagery (visual, thermal, acoustic) with gauge reading annotations, leak detection labels, corrosion grading per ASTM D610, and anomaly-vs-normal classification across equipment types. Patrol data must cover day/night cycles and seasonal variation."
        },
        {
          "title": "Wind Turbine Blade Inspection",
          "description": "Drone-based visual inspection of turbine blades for cracks, erosion, lightning damage, and delamination. Data requirements: High-resolution blade surface imagery (minimum 0.5mm/pixel) with pixel-level defect annotations, severity grading per IEC 61400-24, and blade-position metadata (leading edge, trailing edge, root, tip, spanwise location). Datasets must span blade manufacturers including Vestas, Siemens Gamesa, GE, and LM Wind Power."
        },
        {
          "title": "Pipeline Integrity Assessment",
          "description": "Internal (smart pig) and external (crawler/drone) inspection of pipeline surfaces. Data requirements: Magnetic flux leakage (MFL) data, ultrasonic thickness readings, visual corrosion imagery, and defect classification per API 1160 categories. External datasets must cover above-ground, buried, and subsea pipeline segments with coating condition assessment."
        },
        {
          "title": "Solar Panel Inspection",
          "description": "Drone-based thermal and visual inspection of photovoltaic arrays for hotspots, micro-cracks, soiling, and PID (potential-induced degradation). Data requirements: Registered thermal+RGB image pairs at cell-level resolution, defect annotations per IEC 62446-3 guidelines, degradation trajectory data across seasons, and soiling-level classification calibrated to power-loss estimates."
        },
        {
          "title": "Confined Space Entry and Assessment",
          "description": "Drones or small robots entering boilers, heat recovery steam generators, tanks, and vessels for internal inspection. Data requirements: 360-degree or multi-angle captures in zero-ambient-light confined spaces, surface defect detection under active illumination, spatial mapping of internal geometries, and refractory condition assessment for lined vessels."
        },
        {
          "title": "Substation Equipment Monitoring",
          "description": "Thermal and visual monitoring of transformers, circuit breakers, bushings, and insulators for hotspots and degradation. Data requirements: Calibrated thermal imagery with absolute temperature readings, partial discharge acoustic signatures, oil-leak detection annotations, and insulator contamination grading per IEC 60815."
        }
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Data Requirements by Robot Type in Energy",
      "description": "Energy robots range from quadruped facility patrol robots to pipeline inspection pigs. Each has unique sensor, certification, and data requirements.",
      "columns": ["Robot Type", "Primary Sensors", "Data Volume", "Key Annotations", "Certification"],
      "rows": [
        {
          "Robot Type": "Quadruped Patrol (Spot-class)",
          "Primary Sensors": "RGB, thermal, acoustic, LiDAR",
          "Data Volume": "10K+ patrol hours",
          "Key Annotations": "Gauge readings, leak detect, corrosion grade, anomaly class",
          "Certification": "ATEX Zone 2 / Class I Div 2"
        },
        {
          "Robot Type": "Wind Turbine Inspection Drone",
          "Primary Sensors": "High-res RGB (50+ MP), thermal",
          "Data Volume": "100K+ blade images",
          "Key Annotations": "Defect type, severity 1-5, blade position, dimensions",
          "Certification": "Part 107 / EASA Specific Category"
        },
        {
          "Robot Type": "Pipeline Smart Pig (ILI)",
          "Primary Sensors": "MFL, UT, caliper, gyroscope",
          "Data Volume": "10K+ km pipeline scans",
          "Key Annotations": "Anomaly class (corrosion, dent, crack), wall thickness, location",
          "Certification": "API 1163 qualified"
        },
        {
          "Robot Type": "Solar Inspection Drone",
          "Primary Sensors": "Thermal, RGB, multispectral",
          "Data Volume": "500K+ panel images",
          "Key Annotations": "Hotspot, micro-crack, soiling level, string fault ID",
          "Certification": "Part 107 / EASA"
        },
        {
          "Robot Type": "Confined Space Drone (Elios-class)",
          "Primary Sensors": "RGB (active light), LiDAR, gas sensor",
          "Data Volume": "5K+ vessel inspections",
          "Key Annotations": "Surface defect, wall thickness estimate, corrosion map",
          "Certification": "ATEX Zone 1 / Class I Div 1"
        },
        {
          "Robot Type": "Substation Inspection Robot",
          "Primary Sensors": "Thermal, RGB, acoustic (PD), UV corona",
          "Data Volume": "50K+ equipment inspections",
          "Key Annotations": "Hotspot delta-T, insulator condition, oil leak, corona level",
          "Certification": "IEC 61010 (high voltage proximity)"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Real-World Deployments",
      "paragraphs": [
        "Boston Dynamics' Spot robot is deployed at BP, Shell, TotalEnergies, and National Grid facilities for autonomous inspection rounds. At the Skarv FPSO (floating production, storage, and offloading) in the North Sea, Spot performs routine thermal and visual inspections in areas that previously required human entry into hazardous zones. BP has reported that Spot reduces the time for routine inspection rounds by 30% while improving detection consistency. The training data challenge is that each facility has unique equipment layouts, and inspection baselines must be established per-site to enable meaningful anomaly detection.",
        "SkySpecs has conducted over 350,000 wind turbine inspections across 40+ countries, making them the largest wind blade inspection dataset holder in the world. Their autonomous drones fly pre-programmed patterns around each blade, capturing standardized imagery that enables consistent defect tracking across time. Training models to reliably detect leading-edge erosion, lightning strikes, and structural cracks requires datasets spanning blade manufacturers, ages (1-25+ years), and geographic conditions from arctic Scandinavia to tropical Southeast Asia.",
        "Energy Robotics GmbH provides autonomy software that runs on multiple robot platforms (Spot, ANYmal, Husky, Taurob) for oil and gas facility inspection. Their platform-agnostic approach means the perception models must generalize across different sensor configurations and robot form factors, requiring training data collected from multiple viewpoints and sensor heights within the same facility. The company has deployed at Equinor, OMV, and BASF sites across Europe and the Middle East.",
        "Flyability's Elios 3 drone specializes in confined space inspection for power generation. It has been used inside boilers, heat recovery steam generators, nuclear containment buildings, and wind turbine towers. The training data requirement is uniquely challenging: zero ambient light, active-illumination-only imaging, dust and particulate interference, and complex 3D geometries that GPS-based localization cannot support. Flyability has performed over 100,000 confined space flights, generating one of the largest proprietary confined-space imagery datasets in existence.",
        "In solar, Raptor Maps has inspected over 100 GW of solar assets using drone-based thermal imagery, building the industry's largest solar inspection dataset. Their platform uses machine learning to automatically detect and classify hotspots, micro-cracks, bypass diode failures, and string-level faults. Training these models requires paired thermal-RGB imagery at cell-level resolution across panel technologies (monocrystalline, polycrystalline, thin-film) and mounting configurations (ground-mount, rooftop, single-axis tracker, dual-axis tracker)."
      ]
    },
    {
      "type": "prose",
      "heading": "Relevant Data Modalities",
      "paragraphs": [
        "Energy robotics requires sensor modalities tailored to harsh industrial environments. Core modalities include industrial-grade RGB cameras (sealed, explosion-proof housings rated to IP67 or higher), thermal / LWIR cameras for heat anomaly detection (calibrated for absolute temperature measurement, not just relative), acoustic sensors and ultrasonic microphones for leak and mechanical fault detection, LiDAR for facility mapping and change detection, ultrasonic thickness gauges for corrosion assessment, magnetic flux leakage (MFL) sensors for pipeline integrity, gas detection sensors (H2S, LEL, O2) for hazardous atmosphere monitoring, and UV corona cameras for high-voltage insulator inspection.",
        "A critical energy-sector requirement is temporal baseline comparison. Unlike one-shot inspection, energy robots build up baseline maps of facility equipment over time. A thermal hotspot on a transformer bushing is only meaningful in context -- is it 5C hotter than last month? Training data must include time-series captures of the same equipment across months or years, enabling models to distinguish between normal aging and actionable degradation. This longitudinal requirement makes energy robotics data collection an ongoing relationship, not a one-time project.",
        "Acoustic data is an underappreciated modality in energy. Ultrasonic leak detection can identify gas leaks at distances of 30+ meters. Acoustic emission monitoring detects bearing failures, partial discharge in transformers, and steam trap malfunctions. Training models for acoustic anomaly detection requires large libraries of normal operating sounds for each equipment type, paired with labeled anomaly recordings that are inherently rare -- often requiring synthetic augmentation of real fault signatures."
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "shihavuddin-wind-2019",
          "title": "Wind Turbine Surface Damage Detection by Deep Learning Aided Drone Inspection Analysis",
          "authors": "Shihavuddin et al.",
          "venue": "Energies 2019",
          "year": 2019,
          "url": "https://doi.org/10.3390/en12183834"
        },
        {
          "id": "vidal-pipeline-2021",
          "title": "A Review of Pipeline Inspection Technologies and Their Applications",
          "authors": "Vidal et al.",
          "venue": "Sensors 2021",
          "year": 2021,
          "url": "https://doi.org/10.3390/s21144176"
        },
        {
          "id": "tsoukalas-solar-2022",
          "title": "A Review of Machine Learning and Deep Learning for PV Fault Detection",
          "authors": "Tsoukalas et al.",
          "venue": "Renewable Energy 2022",
          "year": 2022,
          "url": "https://doi.org/10.1016/j.renene.2022.01.036"
        },
        {
          "id": "rw-energy-robotics-2023",
          "title": "Autonomous Mobile Robots for Industrial Inspection: A Survey",
          "authors": "Zhao et al.",
          "venue": "Robotics and Autonomous Systems 2023",
          "year": 2023,
          "url": "https://doi.org/10.1016/j.robot.2023.104425"
        },
        {
          "id": "wang-turbine-dl-2022",
          "title": "A Deep Learning Approach for Wind Turbine Blade Defect Detection",
          "authors": "Wang et al.",
          "venue": "IEEE Transactions on Industrial Informatics 2022",
          "year": 2022,
          "url": "https://doi.org/10.1109/TII.2021.3075907"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Serves Energy Robotics",
      "paragraphs": [
        "Claru collects training data in active energy facilities with collectors trained on facility-specific safety protocols including OSHA PSM, hot work permits, H2S awareness (ANSI Z390.1), and ATEX zone classification. Our collection equipment includes explosion-proof camera housings rated for Zone 2 environments and thermal cameras calibrated for industrial temperature ranges from -40C to 650C.",
        "Our annotation pipeline includes energy-specific protocols: corrosion grading per ASTM D610 and ISO 8501 surface preparation standards, gauge reading extraction from analog instruments (pressure, temperature, level, flow), thermal anomaly classification with absolute delta-T thresholds referenced to baseline measurements, defect severity grading aligned with client maintenance priority scales (P1-P5 urgency), and acoustic anomaly labeling for leak and mechanical fault signatures.",
        "We deliver longitudinal datasets with spatially registered baselines for temporal change detection, enabling the anomaly detection models that energy robotics systems require. Each dataset includes facility metadata (equipment ID, manufacturer, age, service history) that enables models to contextualize inspections rather than treating each image in isolation. Our data is delivered in formats compatible with common energy inspection platforms including IBM Maximo, SAP PM, and proprietary SCADA integration interfaces."
      ]
    }
  ],
  "faqs": [
    {
      "question": "Can Claru collect data in ATEX-rated explosive atmosphere zones?",
      "answer": "Claru operates collection equipment rated for ATEX Zone 2 (IIC, T4) and Class I Division 2 (Groups A-D) environments, which covers the majority of outdoor areas in refineries and gas processing plants. For Zone 1 or Division 1 areas requiring higher-rated intrinsically safe equipment, we work with the facility operator to use their approved equipment or certified rental units. All collection personnel complete facility-specific safety orientation including hot work awareness, H2S training (ANSI Z390.1), and emergency muster procedures before accessing energy facilities. Our collection protocols are reviewed and approved by the facility's safety department before any work begins."
    },
    {
      "question": "How does Claru handle NERC CIP data restrictions for power grid facilities?",
      "answer": "Data collected from NERC CIP-covered facilities (bulk electric system generation, transmission, and control centers) is handled under information protection protocols aligned with CIP-011 requirements. We do not capture BES Cyber System Information or control system interfaces in our visual datasets. Facility access complies with CIP-006 physical security requirements including personnel vetting and authorized access documentation. All data is stored on secure infrastructure with access limited to authorized personnel. We work with each utility's NERC compliance team to scope collection boundaries that avoid CIP-restricted information while still capturing the environmental and equipment data needed for robot training."
    },
    {
      "question": "What defect types are covered in Claru's wind turbine blade inspection datasets?",
      "answer": "Our wind turbine datasets cover the full taxonomy of blade defects encountered in commercial wind farms: leading-edge erosion (from rain, hail, and insect impact), lightning strike damage (receptor burns, surface tracking, delamination), structural cracks (longitudinal and transverse), gelcoat damage (chips, crazing, discoloration), trailing-edge splitting, and bond-line failures. Each defect is annotated with type, severity grade (1-5 scale aligned with common industry practice), estimated dimensions, and blade-position metadata (spanwise location, chordwise position, suction/pressure side). Our datasets include blades from major manufacturers (Vestas, Siemens Gamesa, GE, LM Wind Power) across multiple age ranges and climate conditions from arctic to tropical."
    },
    {
      "question": "Does Claru provide temporal baseline data for anomaly detection?",
      "answer": "Yes. Temporal baseline comparison is fundamental to energy infrastructure inspection, and our collection campaigns are designed for longitudinal coverage. We capture registered baseline imagery of equipment and structures at regular intervals -- typically monthly or quarterly depending on the application. Each capture is spatially registered to the same coordinate frame, enabling pixel-level comparison across time points. Our annotations include change classification (new anomaly, progressing anomaly, stable condition, repaired item) with timestamps. This temporal structure enables training anomaly detection models that distinguish normal aging and environmental variation from actionable degradation requiring maintenance intervention."
    },
    {
      "question": "What sensor modalities does Claru support for pipeline inspection training data?",
      "answer": "Our pipeline inspection datasets cover both internal (in-line inspection) and external inspection modalities. For external inspection, we provide high-resolution visual imagery, thermal captures for temperature anomaly detection, and acoustic emission data for leak localization. For in-line inspection training data, we work with pipeline operators to capture and annotate magnetic flux leakage (MFL) data, ultrasonic wall-thickness measurements, and caliper data for geometry assessment. Annotations classify anomalies per API 1160 categories: metal loss (internal/external corrosion), geometric anomalies (dents, ovality, wrinkle bends), cracking (SCC, fatigue), and manufacturing defects. Each annotation includes estimated defect dimensions and repair-urgency classification aligned with the operator's integrity management plan."
    }
  ],
  "ctaHeading": "Discuss Energy Robotics Data Needs",
  "ctaDescription": "Tell us about your energy robotics project -- whether it is facility patrol, wind blade inspection, pipeline integrity, or confined space operations. Claru will scope a safety-compliant data collection plan tailored to your operational environment.",
  "relatedGlossaryTerms": ["embodied-ai", "physical-ai", "teleoperation-data"],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "regulations": [
    {
      "name": "NERC CIP Standards",
      "jurisdiction": "US/Canada",
      "description": "Critical Infrastructure Protection for bulk electric system.",
      "dataImplications": "Data from CIP-covered facilities must comply with CIP-004, CIP-006, CIP-011, and CIP-013 for personnel, access, information protection, and supply chain risk."
    },
    {
      "name": "ATEX Directive 2014/34/EU",
      "jurisdiction": "EU",
      "description": "Equipment certification for explosive atmospheres.",
      "dataImplications": "Collection equipment must be ATEX-rated. Data must include gas detection and emergency shutdown scenarios."
    },
    {
      "name": "OSHA PSM (29 CFR 1910.119)",
      "jurisdiction": "US",
      "description": "Process Safety Management for highly hazardous chemicals.",
      "dataImplications": "Inspection data must cover mechanical integrity verification, leak detection, and process hazard scenarios."
    },
    {
      "name": "API 1160 / ASME B31.8S",
      "jurisdiction": "US",
      "description": "Pipeline integrity management standards.",
      "dataImplications": "Defect detection must cover API-defined anomaly types: corrosion, dents, cracking, laminations."
    },
    {
      "name": "NRC 10 CFR 50",
      "jurisdiction": "US",
      "description": "Nuclear power plant licensing and safety requirements.",
      "dataImplications": "Robot data in nuclear zones must document radiation classification, ALARA compliance, and decontamination procedures."
    },
    {
      "name": "IEC 61400-24",
      "jurisdiction": "International",
      "description": "Wind turbine lightning protection system design and verification.",
      "dataImplications": "Blade defect annotations must align with IEC lightning damage categories for interoperability with turbine OEM systems."
    }
  ],
  "environmentCharacteristics": [
    {
      "characteristic": "Explosive/Hazardous Atmospheres",
      "description": "Refineries and gas plants with flammable vapor zones classified under ATEX or NEC systems.",
      "dataChallenge": "ATEX-rated equipment only. Constrained sensor selection limits available training modalities and resolution."
    },
    {
      "characteristic": "Extreme Heights / Confined Spaces",
      "description": "Wind turbine nacelles at 80-150m, boiler interiors, pressure vessels, cooling towers.",
      "dataChallenge": "Limited access, constrained lighting, radical spatial geometry differences from open environments."
    },
    {
      "characteristic": "Corrosive and Fouled Environments",
      "description": "Salt spray, chemical residue, thermal cycling, and coal dust degrade sensors.",
      "dataChallenge": "Lens fouling and corrosion-induced artifacts must be represented for robust perception models."
    },
    {
      "characteristic": "High EMI Zones",
      "description": "Substations (110-765 kV), generators, and transmission lines.",
      "dataChallenge": "EMI corrupts sensor data and communication. Models must handle EMI-induced artifacts."
    },
    {
      "characteristic": "Remote / Access-Restricted Sites",
      "description": "Offshore platforms, remote pipelines, arctic installations, desert solar farms.",
      "dataChallenge": "Limited bandwidth. On-device processing and intermittent connectivity must be assumed."
    },
    {
      "characteristic": "Extreme Temperature Ranges",
      "description": "Gas turbine exhaust at 600C+, LNG at -162C, desert solar cycling -5C to 55C.",
      "dataChallenge": "Sensors behave differently across thermal extremes. Calibration data must cover the full operating envelope."
    }
  ],
  "commonTasks": [
    {
      "task": "Routine Facility Inspection",
      "description": "Autonomous patrol at refineries, substations, power plants.",
      "dataRequirements": "Multi-modal baselines with gauge readings, leak detection, corrosion grading per ASTM D610, anomaly classification."
    },
    {
      "task": "Wind Turbine Blade Inspection",
      "description": "Drone-based crack, erosion, lightning, and delamination detection.",
      "dataRequirements": "High-res blade imagery (0.5mm/pixel), pixel-level defect masks, severity grades per IEC 61400-24."
    },
    {
      "task": "Pipeline Integrity Assessment",
      "description": "Internal (ILI) and external pipeline surface inspection.",
      "dataRequirements": "MFL, UT thickness, visual corrosion, defect classification per API 1160 categories."
    },
    {
      "task": "Solar Panel Inspection",
      "description": "Thermal and visual drone inspection of PV arrays.",
      "dataRequirements": "Registered thermal+RGB pairs, cell-level annotations per IEC 62446-3, degradation trajectories."
    },
    {
      "task": "Confined Space Inspection",
      "description": "Drones entering boilers, tanks, and vessels.",
      "dataRequirements": "360-degree zero-light captures, active illumination, surface defects, spatial mapping."
    },
    {
      "task": "Substation Equipment Monitoring",
      "description": "Thermal, visual, and acoustic monitoring of transformers, breakers, insulators.",
      "dataRequirements": "Calibrated thermal imagery, partial discharge acoustics, oil-leak detection, corona discharge capture."
    }
  ],
  "relevantModalities": [
    "RGB (explosion-proof housing)",
    "Thermal / LWIR (calibrated absolute temperature)",
    "Acoustic / ultrasonic (leak detection)",
    "LiDAR (facility mapping)",
    "Ultrasonic thickness gauge",
    "MFL (magnetic flux leakage)",
    "Gas detection (H2S, LEL, O2)",
    "UV corona camera",
    "IMU"
  ],
  "keyPapers": [
    {
      "id": "shihavuddin-wind-2019",
      "title": "Wind Turbine Surface Damage Detection by Deep Learning Aided Drone Inspection Analysis",
      "authors": "Shihavuddin et al.",
      "venue": "Energies 2019",
      "year": 2019,
      "url": "https://doi.org/10.3390/en12183834"
    },
    {
      "id": "vidal-pipeline-2021",
      "title": "A Review of Pipeline Inspection Technologies and Their Applications",
      "authors": "Vidal et al.",
      "venue": "Sensors 2021",
      "year": 2021,
      "url": "https://doi.org/10.3390/s21144176"
    },
    {
      "id": "tsoukalas-solar-2022",
      "title": "A Review of Machine Learning and Deep Learning for PV Fault Detection",
      "authors": "Tsoukalas et al.",
      "venue": "Renewable Energy 2022",
      "year": 2022,
      "url": "https://doi.org/10.1016/j.renene.2022.01.036"
    },
    {
      "id": "rw-energy-robotics-2023",
      "title": "Autonomous Mobile Robots for Industrial Inspection: A Survey",
      "authors": "Zhao et al.",
      "venue": "Robotics and Autonomous Systems 2023",
      "year": 2023,
      "url": "https://doi.org/10.1016/j.robot.2023.104425"
    },
    {
      "id": "wang-turbine-dl-2022",
      "title": "A Deep Learning Approach for Wind Turbine Blade Defect Detection",
      "authors": "Wang et al.",
      "venue": "IEEE Transactions on Industrial Informatics 2022",
      "year": 2022,
      "url": "https://doi.org/10.1109/TII.2021.3075907"
    }
  ],
  "claruRelevance": "Claru collects in active energy facilities with safety-trained collectors holding OSHA PSM, H2S, and ATEX zone certifications. We use explosion-proof and intrinsically safe collection equipment, and deliver longitudinal datasets with registered baselines for temporal change detection. Our annotation pipeline implements energy-specific protocols including corrosion grading per ASTM D610, gauge reading extraction, thermal anomaly classification with calibrated delta-T thresholds, and defect severity grading aligned with maintenance priority scales. Data is formatted for integration with SCADA systems and enterprise asset management platforms."
};

export default data;
