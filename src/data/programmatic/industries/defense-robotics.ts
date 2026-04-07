import type { IndustryPageData } from "./types";

const data: IndustryPageData = {
  "slug": "defense-robotics",
  "metaTitle": "Defense Robotics Training Data | Claru",
  "metaDescription": "Training data for defense robots: EOD, reconnaissance, logistics, search-and-rescue, and autonomous ground vehicles. ITAR-aware collection protocols.",
  "primaryKeyword": "defense robotics training data",
  "secondaryKeywords": [
    "defense robotics data",
    "military robotics AI data",
    "ITAR compliant training data",
    "EOD robot datasets",
    "autonomous ground vehicle data",
    "UGV training data"
  ],
  "canonicalPath": "/industries/defense-robotics",
  "h1": "Defense Robotics Training Data",
  "heroSubtitle": "Training data for defense robots: EOD, reconnaissance, logistics, search-and-rescue, and autonomous ground vehicles in challenging terrain. Built with ITAR-aware collection protocols and full chain-of-custody documentation.",
  "breadcrumbs": [
    { "label": "Home", "href": "/" },
    { "label": "Industries", "href": "/industries" },
    { "label": "Defense Robotics", "href": "/industries/defense-robotics" }
  ],
  "sections": [
    {
      "type": "prose",
      "heading": "Why Defense Robotics Data Demands Specialized Handling",
      "paragraphs": [
        "Defense robotics operates under constraints that no commercial sector faces. Training data for military systems may be subject to ITAR (International Traffic in Arms Regulations), meaning it cannot be shared with foreign nationals or stored on servers outside the United States without State Department authorization. EAR (Export Administration Regulations) governs dual-use technologies. Even unclassified training data for defense robots requires documented chain-of-custody, personnel vetting, and secure storage infrastructure.",
        "The operational environments for defense robots are among the most challenging on Earth: desert sand, jungle canopy, arctic ice, rubble-filled urban ruins, and underground tunnel networks. Companies like Anduril, Shield AI, Ghost Robotics, Sarcos, and L3Harris build robots that must function in GPS-denied environments, under electronic warfare conditions, and in terrain that destroys commercial-grade hardware. The training data for these systems must be collected in representative environments, not on paved test tracks.",
        "The US defense robotics market is projected to exceed $30 billion by 2030, driven by the DoD's Replicator initiative (which aims to deploy thousands of autonomous systems), the Army Robotic Combat Vehicle (RCV) program, and the Navy's Unmanned Surface Vehicle fleet. Allied nations (UK DSTL, Australia's Defence Science and Technology Group, NATO cooperative programs) add additional demand. Each of these programs requires training data that meets defense-specific provenance, security, and bias documentation requirements.",
        "The DoD's Responsible AI principles (adopted in 2020 and formalized into a strategy in 2022) require that military AI systems be traceable, governable, and reliable. This means every training data sample must have documented provenance: who collected it, when, where, with what equipment, and through what annotation pipeline. NIST AI RMF (Risk Management Framework) compliance adds structured risk documentation requirements. DIB (Defense Industrial Base) contractors increasingly require their training data suppliers to demonstrate CMMC (Cybersecurity Maturity Model Certification) Level 2 compliance. These audit trails are not optional -- they are prerequisite for procurement."
      ]
    },
    {
      "type": "cards",
      "heading": "Regulatory Requirements",
      "cards": [
        {
          "title": "ITAR -- 22 CFR Parts 120-130 (US)",
          "description": "International Traffic in Arms Regulations controlling defense articles and technical data. Training data for defense robotics applications may constitute controlled technical data under ITAR Category XI (Military Electronics) or Category IV (Launch Vehicles, Guided Missiles). All collection personnel must be US persons. Data must be stored on ITAR-compliant infrastructure (US-only servers, FedRAMP-authorized cloud, or air-gapped systems). Export requires State Department DDTC licensing."
        },
        {
          "title": "DoD Responsible AI Principles (US)",
          "description": "Five principles adopted by the Department of Defense in 2020: responsible, equitable, traceable, reliable, and governable. The 2022 RAI Strategy and Implementation Pathway formalized these into actionable requirements. Training data must support full traceability from raw capture through annotation to model training. Bias analysis documentation is required, covering demographic representation, geographic diversity, and adversarial robustness. Data provenance must be sufficient for independent third-party audit."
        },
        {
          "title": "NIST AI Risk Management Framework (US)",
          "description": "NIST AI RMF provides structured risk documentation for AI systems, now mandated for federal acquisitions. Defense robotics data must include risk characterization metadata: what failure modes has the data been designed to cover, what are the known gaps, and what populations or environments are underrepresented. This documentation feeds directly into the Govern and Map functions of the RMF and is referenced in the DoD AI Acquisition Pathway."
        },
        {
          "title": "NATO STANAG 4586 / 4671 (International)",
          "description": "NATO Standardization Agreements for UAV systems (STANAG 4586 for interoperable command and control) and airworthiness (STANAG 4671 for UAV certification). Training data for autonomous UAVs operating within NATO coalitions must comply with interoperability standards. Data formats, coordinate systems, and classification levels must align with STANAG specifications to enable multi-national system integration."
        },
        {
          "title": "CMMC Level 2 (US)",
          "description": "Cybersecurity Maturity Model Certification for Defense Industrial Base contractors handling Controlled Unclassified Information (CUI). Training data providers working with defense primes must demonstrate CMMC Level 2 compliance, covering 110 security controls from NIST SP 800-171. This affects data storage, transmission, personnel access, and incident response procedures for all training data handling."
        },
        {
          "title": "EAR -- 15 CFR Parts 730-774 (US)",
          "description": "Export Administration Regulations governing dual-use items including AI software, sensors, and training datasets. Training data for robotics with dual-use applications (autonomous navigation, object detection, terrain classification) may be controlled under EAR Category 4 (computers) or Category 7 (navigation and avionics). Exportability depends on end-use and end-user screening, which must be documented in the data delivery chain."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Environment Characteristics",
      "cards": [
        {
          "title": "GPS-Denied and Comms-Degraded Environments",
          "description": "Defense robots must operate under electronic warfare conditions where GPS is jammed or spoofed and communications are intermittent or denied. Data challenge: Navigation training data must include scenarios with zero GPS availability, forcing reliance on visual odometry, LiDAR SLAM, and inertial navigation. Communication blackout scenarios require autonomous decision-making data where the robot must complete tasks without external guidance."
        },
        {
          "title": "Extreme and Diverse Terrain",
          "description": "Desert sand (soft, shifting), jungle undergrowth (dense vegetation, low visibility), arctic ice (featureless, extreme cold), mountain scree (loose rock, steep grades), and urban rubble (collapsed structures, debris fields). Data challenge: Terrain traversability models must cover an order of magnitude more surface types than commercial robotics, with load-bearing and traction characteristics that vary with weather, time of day, and recent disturbance."
        },
        {
          "title": "Adversarial and Deceptive Environments",
          "description": "Opponents may camouflage targets, deploy decoys, use thermal signature reduction, or manipulate the environment to mislead sensors. Data challenge: Object detection must be robust to adversarial visual patterns, camouflage netting across wavelengths (visual, thermal, radar), and objects deliberately designed to evade classification. Training data must include adversarial examples across the full spectrum of known deception techniques."
        },
        {
          "title": "Subterranean and Confined Spaces",
          "description": "Tunnel networks, natural caves, collapsed buildings, bunkers, and sewer systems with no natural light, limited ventilation, and potential structural instability. Data challenge: Complete absence of GPS and ambient light. Training data requires infrared, thermal, and active illumination captures in confined spaces with dust, smoke, and debris. Multi-level navigation without reliable altimetry reference."
        },
        {
          "title": "Day-Night and Weather Extremes",
          "description": "Operations span 24-hour cycles, from desert midday (50C+, intense glare) to arctic night (-50C, no visible light). Rain, snow, fog, sandstorms, and dust all degrade sensors. Data challenge: Perception models must maintain performance across the full day-night-weather envelope. Training data must cover low-light, no-light, and degraded-visibility conditions that are underrepresented in commercial datasets."
        },
        {
          "title": "Contested Electromagnetic Spectrum",
          "description": "Electronic warfare environments where active sensors (radar, LiDAR) may reveal the robot's position. Communication jamming and GPS spoofing are assumed. Data challenge: Training data must support passive-only sensing modes (visual, thermal, passive acoustic) for scenarios where active emissions are tactically inadvisable. Models must handle graceful degradation when sensor modalities are selectively denied."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Common Robotics Tasks",
      "cards": [
        {
          "title": "Explosive Ordnance Disposal (EOD)",
          "description": "Remote manipulation of suspected explosive devices using teleoperated or semi-autonomous robots. Data requirements: Teleoperation trajectories with force feedback for fine manipulation, object classification for ordnance types (IEDs, UXO, mines across 50+ threat categories), approach-path planning in cluttered environments, and failure-mode recordings for safe system degradation."
        },
        {
          "title": "Autonomous Off-Road Navigation",
          "description": "Unmanned ground vehicles traversing unimproved roads, trails, and cross-country terrain at speeds up to 30 mph. Data requirements: Multi-modal terrain data (RGB, LiDAR, radar, thermal) across desert, forest, arctic, and urban environments. GPS-denied navigation data using visual odometry and inertial measurement. Terrain traversability classification calibrated to specific vehicle weight classes."
        },
        {
          "title": "ISR (Intelligence, Surveillance, Reconnaissance)",
          "description": "Autonomous or semi-autonomous observation, target identification, and persistent surveillance. Data requirements: Long-range EO/IR imagery, motion detection in natural environments with high clutter, camouflage-robust classification data spanning visual/thermal/radar, and wide-area persistent surveillance with track continuity across sensor handoffs."
        },
        {
          "title": "Logistics and Resupply",
          "description": "Autonomous ground and air vehicles carrying supplies to forward positions through contested routes. Data requirements: Route planning data across threat environments with risk-weighted path optimization, load-sensing for cargo management, convoy-following trajectories with variable spacing, and landing-zone assessment for autonomous resupply drones including surface classification and obstacle clearance."
        },
        {
          "title": "Search and Rescue in Disaster/Conflict Zones",
          "description": "Locating and extracting personnel from collapsed structures, rubble, and hazardous environments. Data requirements: Thermal and audio detection of buried survivors, structural stability assessment from visual/LiDAR data, debris-field navigation over unstable surfaces, and victim-state classification (conscious, unconscious, critical)."
        },
        {
          "title": "Perimeter Security and Base Protection",
          "description": "Autonomous patrol robots monitoring installation perimeters 24/7 across weather conditions. Data requirements: Person detection and classification (authorized, unauthorized, civilian, threat) across day/night/weather. Vehicle identification at range. Intrusion path prediction. Anomaly detection for abandoned objects, fence breaches, and unusual approach patterns."
        }
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Data Requirements by Robot Type in Defense",
      "description": "Defense robots range from small throwable reconnaissance units to multi-ton autonomous vehicles. Each platform type has unique sensor, volume, and classification requirements.",
      "columns": ["Robot Type", "Primary Sensors", "Data Volume", "Key Annotations", "Classification Level"],
      "rows": [
        {
          "Robot Type": "Small UGV (recon/EOD)",
          "Primary Sensors": "RGB, thermal, force/torque",
          "Data Volume": "50K+ teleoperation episodes",
          "Key Annotations": "Object class, grasp trajectory, threat ID",
          "Classification Level": "CUI to Secret"
        },
        {
          "Robot Type": "Large UGV (logistics/RCV)",
          "Primary Sensors": "LiDAR, radar, RGB, IMU, GPS",
          "Data Volume": "100K+ km navigation logs",
          "Key Annotations": "Terrain class, route risk, convoy spacing",
          "Classification Level": "CUI to Secret"
        },
        {
          "Robot Type": "Autonomous UAV (ISR)",
          "Primary Sensors": "EO/IR, SAR, LiDAR",
          "Data Volume": "10K+ flight hours",
          "Key Annotations": "Target class, track ID, camouflage labels",
          "Classification Level": "Secret to TS/SCI"
        },
        {
          "Robot Type": "Quadruped (patrol/recon)",
          "Primary Sensors": "RGB-D, LiDAR, audio, thermal",
          "Data Volume": "10K+ hours patrol data",
          "Key Annotations": "Terrain traversability, anomaly detect, human ID",
          "Classification Level": "CUI to Secret"
        },
        {
          "Robot Type": "Subterranean Robot",
          "Primary Sensors": "Thermal, active IR, LiDAR, IMU",
          "Data Volume": "5K+ hours tunnel/cave data",
          "Key Annotations": "Structural stability, void detection, gas levels",
          "Classification Level": "CUI to Secret"
        },
        {
          "Robot Type": "Maritime USV/UUV",
          "Primary Sensors": "Sonar, radar, RGB, thermal",
          "Data Volume": "10K+ hours maritime data",
          "Key Annotations": "Vessel classification, mine detect, sea state",
          "Classification Level": "Secret to TS/SCI"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Real-World Deployments",
      "paragraphs": [
        "Anduril Industries deploys the Ghost UAS (unmanned aircraft system), Lattice autonomous command platform, and the Anvil counter-UAS interceptor for US and allied military forces. Their systems rely on edge AI for real-time object classification and threat assessment in communications-degraded environments. Anduril's Lattice processes sensor fusion from multiple autonomous platforms simultaneously, requiring training data that captures multi-platform perception scenarios where information from ground robots, aerial drones, and fixed sensors must be correlated.",
        "Shield AI's Nova 2 is a small autonomous quadcopter designed for building-clearing operations in GPS-denied indoor environments. It uses visual SLAM and learned obstacle avoidance to navigate through rooms, hallways, and stairwells autonomously without human control or GPS. The training data for Nova must cover the extreme diversity of indoor environments encountered in military operations: furnished rooms, empty warehouses, partially collapsed structures, smoke-filled corridors, and multi-story buildings with destroyed stairwells. Shield AI has raised over $700 million and received contracts from the US Air Force, Army, and Marine Corps.",
        "Ghost Robotics deploys the Vision 60 quadruped for perimeter security and reconnaissance at US military installations and with allied forces. The robot must distinguish between authorized personnel, unauthorized intruders, animals, and environmental anomalies across day/night conditions and all weather. The Vision 60 has been evaluated by the US Air Force at Tyndall Air Force Base for base security operations. Training data must include the full spectrum of scenarios a perimeter security system encounters, including deliberate evasion attempts and edge cases like personnel in non-standard uniforms.",
        "The DARPA Subterranean Challenge (2018-2021) highlighted the extreme data challenges of underground robotics. Winning teams like CERBERUS (a multi-robot team from ETH Zurich, University of Nevada Reno, and partners) and Team Explorer (CMU) demonstrated that tunnel, cave, and urban underground environments require fundamentally different perception approaches than surface operations. The competition's legacy datasets are now informing programs like the Army's Robotic Subterranean Exploration (RSX) initiative.",
        "L3Harris and Textron Systems produce the FLIR PackBot and Ripsaw M5 respectively for EOD and unmanned combat vehicle programs. QinetiQ's MAARS (Modular Advanced Armed Robotic System) and Milrem's THeMIS (Tracked Hybrid Modular Infantry System) represent allied programs with similar training data needs. The interoperability requirement -- that these systems must share data and coordinate with NATO partners -- creates additional data format standardization demands under STANAG frameworks."
      ]
    },
    {
      "type": "prose",
      "heading": "Relevant Data Modalities",
      "paragraphs": [
        "Defense robotics uses the widest sensor modality range of any vertical. Core modalities include RGB video (day cameras with wide dynamic range), thermal / LWIR (long-wave infrared for night and through-smoke detection), short-wave infrared (SWIR for camouflage penetration and enhanced night vision), LiDAR (terrain mapping and obstacle detection), radar (weather-penetrating detection and ground-penetrating for buried objects), SAR (synthetic aperture radar for wide-area surveillance), IMU (inertial navigation for GPS-denied environments), acoustic sensors (gunshot detection, voice, vehicle classification), and seismic/vibration sensors (vehicle approach detection).",
        "A unique defense requirement is multi-classification-level data management. A single training pipeline may need to ingest unclassified terrain data, CUI (Controlled Unclassified Information) threat signatures, and classified target-recognition data. The data architecture must support clean separation between classification levels while enabling model training across the combined dataset. Claru provides unclassified and CUI-level data collection services, with air-gapped delivery mechanisms for integration into classified training pipelines.",
        "Passive sensing is increasingly critical. In contested electromagnetic environments where active emissions (radar, LiDAR) may reveal a robot's position, systems must fall back to passive modalities: visual, thermal, passive acoustic, and inertial. Training data must support graceful degradation scenarios where the model transitions from full sensor suite to progressively reduced modality availability, maintaining acceptable performance at each degradation level."
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "tranzatto-cerberus-2022",
          "title": "CERBERUS: Autonomous Legged and Aerial Robotic Exploration in the DARPA Subterranean Challenge",
          "authors": "Tranzatto et al.",
          "venue": "Science Robotics 2022",
          "year": 2022,
          "url": "https://arxiv.org/abs/2201.07067"
        },
        {
          "id": "scherer-darpa-subt-2022",
          "title": "Resilient Autonomous Exploration in Subterranean Environments",
          "authors": "Scherer et al.",
          "venue": "Journal of Field Robotics 2022",
          "year": 2022,
          "url": "https://doi.org/10.1002/rob.22105"
        },
        {
          "id": "dod-rai-strategy-2022",
          "title": "US Department of Defense Responsible AI Strategy and Implementation Pathway",
          "authors": "US DoD Chief Digital and AI Office",
          "venue": "DoD 2022",
          "year": 2022,
          "url": "https://www.ai.mil/docs/RAI_Strategy_and_Implementation_Pathway.pdf"
        },
        {
          "id": "krotkov-darpa-perception-2018",
          "title": "The DARPA Robotics Challenge Finals: Results and Perspectives",
          "authors": "Krotkov et al.",
          "venue": "Journal of Field Robotics 2018",
          "year": 2018,
          "url": "https://doi.org/10.1002/rob.21806"
        },
        {
          "id": "wigness-off-road-2019",
          "title": "A RUGD Dataset for Autonomous Navigation and Visual Perception in Unstructured Outdoor Environments",
          "authors": "Wigness et al.",
          "venue": "IROS 2019",
          "year": 2019,
          "url": "https://doi.org/10.1109/IROS40897.2019.8968283"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Serves Defense Robotics",
      "paragraphs": [
        "Claru provides unclassified and CUI-level training data for defense robotics applications. Our collection personnel are US persons with documented background checks, and our data infrastructure supports ITAR compliance with US-only storage. We collect in representative environments -- desert, forest, arctic analogs, urban training facilities, and subterranean structures -- producing datasets that capture the operational diversity that defense robots encounter without requiring access to active military installations.",
        "Our annotation pipeline implements full chain-of-custody documentation: every sample is traceable from collector identity through annotation review to delivery, with timestamps and GPS coordinates where applicable. We provide bias analysis reports documenting demographic representation in person-detection data, geographic diversity in terrain data, and adversarial coverage in threat-scenario data. Risk characterization metadata is aligned with NIST AI RMF requirements, documenting known gaps and underrepresented conditions.",
        "Data is delivered via encrypted media or FedRAMP-authorized cloud transfer, with format compatibility for common defense robotics frameworks including ROS 2, STANAG-compliant message formats, and custom schemas per program specification. Our delivery packages include the provenance documentation and bias analysis reports required for DoD AI acquisition pathways, reducing the integration burden on prime contractors building AI-enabled defense systems."
      ]
    }
  ],
  "faqs": [
    {
      "question": "Is Claru's data collection ITAR compliant?",
      "answer": "Claru provides training data under ITAR-aware protocols. All collection personnel on defense projects are US persons. Data is stored on US-only infrastructure and is not accessible to foreign nationals. We maintain documented chain-of-custody from capture through annotation to delivery. For projects involving ITAR-controlled technical data, we work within the client's ITAR compliance framework and can operate under a client-provided Technology Control Plan. Our standard data delivery uses encrypted media or FedRAMP-authorized cloud services with access controls that satisfy ITAR requirements."
    },
    {
      "question": "What environments does Claru collect defense robotics data in?",
      "answer": "We collect in environments representative of defense operational theaters. This includes desert terrain (sand, rock, sparse vegetation in the US Southwest), forested areas (dense canopy, undergrowth, trails in the Pacific Northwest and Southeast), arctic analogs (snow, ice, low-visibility conditions), urban training facilities (buildings, streets, rubble piles at commercial MOUT sites), and subterranean structures (tunnels, basements, utility corridors, natural cave systems). We do not collect on active military installations without explicit government authorization, but we access civilian analogs that replicate the terrain, lighting, and structural characteristics of operational environments. Each collection campaign documents environmental conditions including weather, time of day, terrain type, and GPS availability."
    },
    {
      "question": "How does Claru handle GPS-denied navigation training data?",
      "answer": "GPS-denied environments are critical for defense robotics and represent a significant data gap in commercial datasets. Claru collects navigation data with simultaneous GPS and non-GPS localization, then provides ground-truth trajectories from GPS/RTK for training visual odometry and LiDAR SLAM systems. We also collect in naturally GPS-denied environments (underground, inside buildings, dense urban canyons) where only non-GPS localization is available, using surveyed control points for ground truth. This dual-collection approach enables training models that degrade gracefully from GPS-available to GPS-denied conditions rather than failing catastrophically when GPS is lost."
    },
    {
      "question": "Does Claru provide adversarial scenario data for defense perception systems?",
      "answer": "Yes. Our defense datasets include controlled adversarial scenarios collected in partnership with client threat assessment teams. This covers camouflage netting over vehicles and equipment across visual and thermal wavelengths, thermal signature reduction measures, decoy targets designed to confuse classification systems, and objects deliberately placed to trigger false positives. We also capture environmental adversarial conditions: smoke, dust clouds, deliberate lighting manipulation, and sensor-degrading conditions. Each adversarial scenario is annotated with the deception technique employed and the sensor modalities it targets, enabling systematic evaluation of perception system robustness against known threat patterns."
    },
    {
      "question": "What classification levels does Claru's data support?",
      "answer": "Claru collects and delivers data at the unclassified and CUI (Controlled Unclassified Information) levels. Our infrastructure supports CUI handling with appropriate marking, storage, and access controls aligned with NIST SP 800-171 and CMMC Level 2 requirements. For integration into classified training pipelines (Secret, TS/SCI), we deliver data via air-gapped encrypted media that the client's classified environment can ingest. We do not operate classified systems ourselves, but our data products are designed for seamless integration into multi-classification-level training pipelines where unclassified terrain data combines with classified threat signatures."
    }
  ],
  "ctaHeading": "Discuss Defense Robotics Data Needs",
  "ctaDescription": "Tell us about your defense robotics project. Claru will scope an ITAR-aware data collection plan with full chain-of-custody documentation tailored to your program requirements and acquisition pathway.",
  "relatedGlossaryTerms": ["embodied-ai", "physical-ai", "teleoperation-data", "sim-to-real-transfer"],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "regulations": [
    {
      "name": "ITAR (22 CFR 120-130)",
      "jurisdiction": "US",
      "description": "International Traffic in Arms Regulations controlling defense articles and technical data.",
      "dataImplications": "US-person collection personnel, US-only storage, State Department DDTC export licensing for transfer."
    },
    {
      "name": "DoD Responsible AI Principles",
      "jurisdiction": "US",
      "description": "Five principles: responsible, equitable, traceable, reliable, governable, with 2022 implementation pathway.",
      "dataImplications": "Full traceability from capture through annotation, bias analysis, provenance for third-party audit."
    },
    {
      "name": "NIST AI RMF",
      "jurisdiction": "US",
      "description": "Structured risk documentation for AI systems, mandated for federal acquisitions.",
      "dataImplications": "Risk characterization metadata: covered failure modes, known gaps, underrepresented populations and environments."
    },
    {
      "name": "NATO STANAG 4586/4671",
      "jurisdiction": "International (NATO)",
      "description": "Standardization agreements for UAV command/control and airworthiness.",
      "dataImplications": "Data formats and coordinate systems must align with STANAG for multi-national interoperability."
    },
    {
      "name": "CMMC Level 2",
      "jurisdiction": "US",
      "description": "Cybersecurity Maturity Model Certification for DIB contractors handling CUI.",
      "dataImplications": "Data storage, transmission, and personnel access must satisfy 110 NIST SP 800-171 security controls."
    },
    {
      "name": "EAR (15 CFR 730-774)",
      "jurisdiction": "US",
      "description": "Export Administration Regulations for dual-use technologies including AI training data.",
      "dataImplications": "Export requires end-use and end-user screening. Dual-use navigation and detection data may be controlled."
    }
  ],
  "environmentCharacteristics": [
    {
      "characteristic": "GPS-Denied / Comms-Degraded",
      "description": "Electronic warfare conditions with jammed/spoofed GPS and intermittent communications.",
      "dataChallenge": "Navigation data must cover zero-GPS scenarios with visual odometry, LiDAR SLAM, and inertial nav."
    },
    {
      "characteristic": "Extreme and Diverse Terrain",
      "description": "Desert, jungle, arctic, mountain, urban rubble with weather-variable conditions.",
      "dataChallenge": "Order of magnitude more terrain types than commercial robotics with weather-variable traction."
    },
    {
      "characteristic": "Adversarial Environments",
      "description": "Camouflage, decoys, thermal reduction, and deliberately manipulated environments.",
      "dataChallenge": "Detection must be robust to adversarial patterns across visual, thermal, and radar wavelengths."
    },
    {
      "characteristic": "Subterranean and Confined",
      "description": "Tunnels, caves, collapsed buildings, bunkers with no light or GPS.",
      "dataChallenge": "Complete GPS/light absence. Requires IR, thermal, active illumination in dust/smoke/instability."
    },
    {
      "characteristic": "Day-Night / Weather Extremes",
      "description": "24-hour operations from desert midday (50C+) to arctic night (-50C).",
      "dataChallenge": "Full day-night-weather envelope coverage including conditions absent from commercial datasets."
    },
    {
      "characteristic": "Contested EM Spectrum",
      "description": "Active sensors may reveal position; communication jamming and GPS spoofing assumed.",
      "dataChallenge": "Passive-only sensing modes for tactically sensitive scenarios. Graceful modality degradation."
    }
  ],
  "commonTasks": [
    {
      "task": "Explosive Ordnance Disposal",
      "description": "Remote manipulation of suspected explosive devices via teleoperation or semi-autonomy.",
      "dataRequirements": "Teleoperation trajectories, force feedback, ordnance classification (50+ types), approach-path planning."
    },
    {
      "task": "Autonomous Off-Road Navigation",
      "description": "UGVs traversing unimproved roads and cross-country terrain at operational speeds.",
      "dataRequirements": "Multi-modal terrain data across theaters. GPS-denied visual odometry data. Traversability per vehicle class."
    },
    {
      "task": "ISR (Surveillance/Reconnaissance)",
      "description": "Autonomous observation, target identification, and persistent surveillance.",
      "dataRequirements": "Long-range EO/IR, camouflage-robust classification, wide-area persistent surveillance with track continuity."
    },
    {
      "task": "Logistics and Resupply",
      "description": "Autonomous ground/air vehicles carrying supplies through contested routes.",
      "dataRequirements": "Risk-weighted route planning, convoy-following, landing-zone assessment with obstacle clearance."
    },
    {
      "task": "Search and Rescue",
      "description": "Locating personnel in collapsed structures and hazardous zones.",
      "dataRequirements": "Thermal/audio survivor detection, structural stability assessment, debris navigation, victim-state classification."
    },
    {
      "task": "Perimeter Security",
      "description": "Autonomous 24/7 patrol of installation perimeters across weather conditions.",
      "dataRequirements": "Day/night person detection and classification, vehicle ID, intrusion path prediction, anomaly detection."
    }
  ],
  "relevantModalities": [
    "RGB video (wide dynamic range)",
    "Thermal / LWIR (night, through-smoke)",
    "SWIR (camouflage penetration)",
    "LiDAR (terrain mapping)",
    "Radar / SAR (weather-penetrating)",
    "IMU (inertial navigation)",
    "Acoustic (gunshot, voice, vehicle)",
    "Force/torque (EOD manipulation)",
    "Seismic/vibration (approach detection)"
  ],
  "keyPapers": [
    {
      "id": "tranzatto-cerberus-2022",
      "title": "CERBERUS: Autonomous Legged and Aerial Robotic Exploration in the DARPA Subterranean Challenge",
      "authors": "Tranzatto et al.",
      "venue": "Science Robotics 2022",
      "year": 2022,
      "url": "https://arxiv.org/abs/2201.07067"
    },
    {
      "id": "scherer-darpa-subt-2022",
      "title": "Resilient Autonomous Exploration in Subterranean Environments",
      "authors": "Scherer et al.",
      "venue": "Journal of Field Robotics 2022",
      "year": 2022,
      "url": "https://doi.org/10.1002/rob.22105"
    },
    {
      "id": "dod-rai-strategy-2022",
      "title": "US Department of Defense Responsible AI Strategy and Implementation Pathway",
      "authors": "US DoD Chief Digital and AI Office",
      "venue": "DoD 2022",
      "year": 2022,
      "url": "https://www.ai.mil/docs/RAI_Strategy_and_Implementation_Pathway.pdf"
    },
    {
      "id": "krotkov-darpa-perception-2018",
      "title": "The DARPA Robotics Challenge Finals: Results and Perspectives",
      "authors": "Krotkov et al.",
      "venue": "Journal of Field Robotics 2018",
      "year": 2018,
      "url": "https://doi.org/10.1002/rob.21806"
    },
    {
      "id": "wigness-off-road-2019",
      "title": "A RUGD Dataset for Autonomous Navigation and Visual Perception in Unstructured Outdoor Environments",
      "authors": "Wigness et al.",
      "venue": "IROS 2019",
      "year": 2019,
      "url": "https://doi.org/10.1109/IROS40897.2019.8968283"
    }
  ],
  "claruRelevance": "Claru provides unclassified and CUI-level training data for defense robotics with ITAR-aware collection protocols, US-person collectors with documented background checks, US-only storage, and full chain-of-custody documentation. We deliver bias analysis reports, risk characterization metadata aligned with NIST AI RMF, and provenance trails that satisfy DoD Responsible AI and AI acquisition pathway requirements. Data is formatted for defense frameworks including ROS 2 and STANAG-compliant schemas."
};

export default data;
