import type { IndustryPageData } from "./types";

const data: IndustryPageData = {
  "slug": "underwater-robotics",
  "metaTitle": "Underwater Robotics Training Data | Claru",
  "metaDescription": "Training data for underwater robots: subsea inspection, offshore energy, marine research, aquaculture, and port security in challenging aquatic environments.",
  "primaryKeyword": "underwater robotics training data",
  "secondaryKeywords": [
    "underwater robotics data",
    "subsea ROV training data",
    "AUV navigation datasets",
    "underwater inspection AI data",
    "offshore energy robot data",
    "marine robotics datasets",
    "subsea manipulation training data"
  ],
  "canonicalPath": "/industries/underwater-robotics",
  "h1": "Underwater Robotics Training Data",
  "heroSubtitle": "Training data for underwater robots: subsea inspection, offshore energy, marine research, aquaculture, and port security in challenging aquatic environments. Purpose-built datasets for the extreme visibility, pressure, and communication constraints that define subsea operations.",
  "breadcrumbs": [
    { "label": "Home", "href": "/" },
    { "label": "Industries", "href": "/industries" },
    { "label": "Underwater Robotics", "href": "/industries/underwater-robotics" }
  ],
  "sections": [
    {
      "type": "prose",
      "heading": "Why Underwater Robotics Data Is a Class Apart",
      "paragraphs": [
        "The underwater environment is arguably the most sensor-hostile domain in robotics. GPS does not penetrate water. Radio frequency communication is limited to extremely low frequencies with negligible bandwidth. Visible light attenuates exponentially -- in turbid coastal waters, visibility drops below 1 meter. Pressure increases by 1 atmosphere every 10 meters, reaching over 1,000 atmospheres in the deepest ocean trenches. These fundamental physics constraints make underwater robotics data collection orders of magnitude more difficult and expensive than terrestrial data collection.",
        "Despite these challenges, the underwater robotics market is large and growing. The global subsea robotics market was valued at $4.2 billion in 2023 and is projected to reach $7.3 billion by 2030, driven primarily by offshore energy (oil, gas, and offshore wind), aquaculture, defense, and marine science. The offshore wind industry alone is expected to install over 380 GW of capacity by 2032, and every offshore wind turbine requires regular subsea inspection of its foundations, cables, and scour protection -- tasks increasingly performed by autonomous underwater vehicles (AUVs) and remotely operated vehicles (ROVs).",
        "The leading companies in subsea robotics reflect this market diversity. Oceaneering operates the world's largest ROV fleet with over 250 vehicles serving the offshore energy industry. Saab Seaeye manufactures electric ROVs deployed across energy, defense, and science. Kongsberg Maritime's HUGIN and MUNIN AUVs perform bathymetric survey and pipeline inspection autonomously for days at a time. Blue Robotics has democratized access with affordable ROV platforms for research and inspection. Each deployment requires training data that captures the specific visual and physical conditions of the operational environment.",
        "The data challenge is compounded by the near-total absence of public underwater robotics datasets. While terrestrial robotics benefits from large-scale open datasets (Open X-Embodiment, DROID, nuScenes), no equivalent exists for underwater operations. The underwater domain is data-scarce by nature: every hour of underwater data requires a vessel, an ROV or AUV, trained operators, and favorable sea conditions. This makes every real-world underwater dataset extremely valuable and creates a critical need for purpose-built training data from actual subsea environments."
      ]
    },
    {
      "type": "cards",
      "heading": "Regulatory Requirements",
      "cards": [
        {
          "title": "IMCA R 004 / IMCA D 045 (International)",
          "description": "International Marine Contractors Association guidance on the use of ROVs and autonomous underwater vehicles. IMCA R 004 covers ROV operations including emergency recovery procedures. Training data for autonomous subsea operations must include emergency response scenarios: loss of communications, loss of positioning, entanglement with subsea infrastructure, and collision avoidance with diver operations. IMCA D 045 specifies ROV intervention requirements for subsea construction."
        },
        {
          "title": "DNV-ST-0168 / DNV-RP-0457 (International)",
          "description": "Det Norske Veritas standards for subsea ROV operations and autonomous underwater vehicle operations. DNV-ST-0168 covers ROV system safety. DNV-RP-0457 specifically addresses autonomous and semi-autonomous underwater vehicle operations, requiring documented risk assessment, sensor redundancy validation, and failure-mode testing. Training data must cover all failure modes identified in the risk assessment with documented system response."
        },
        {
          "title": "API RP 2I / API RP 2FPS (US)",
          "description": "American Petroleum Institute recommended practices for in-service inspection of mooring hardware and subsea structures. Defines inspection categories and acceptance criteria for offshore infrastructure. Training data for AI-powered inspection must align with API acceptance criteria: crack detection thresholds, corrosion classification grades, and marine growth assessment per API standards."
        },
        {
          "title": "MARPOL / IMO Maritime Regulations (International)",
          "description": "International Maritime Organization regulations covering pollution prevention and maritime safety. Autonomous surface vehicles (ASVs) and AUVs operating in shipping lanes must comply with COLREGS (collision regulations). Training data must include vessel traffic scenarios in accordance with COLREGS rules for autonomous surface operations."
        },
        {
          "title": "UNCLOS / National EEZ Regulations (International)",
          "description": "United Nations Convention on the Law of the Sea governs marine research and operations in Exclusive Economic Zones. Autonomous underwater vehicles operating in foreign EEZs may require permits and operational notifications. Training data collection in international waters or foreign EEZs requires compliance with the coastal state's marine research regulations."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Environment Characteristics",
      "cards": [
        {
          "title": "Extreme Visibility Limitation",
          "description": "Underwater visibility ranges from 30+ meters in clear tropical water to less than 0.5 meters in turbid coastal and estuarine environments. Suspended sediment, plankton blooms, and disturbed seabed reduce visibility dynamically. Data challenge: Camera-based perception that works in clear water fails entirely in turbid conditions. Training data must span the full visibility spectrum with paired optical and acoustic captures, enabling models that switch modalities as conditions degrade."
        },
        {
          "title": "No GPS, No RF Communication",
          "description": "GPS signals do not penetrate water. Radio frequency communication works only at extremely low frequencies (ELF) with negligible bandwidth. Underwater positioning uses acoustic systems (USBL, LBL, GNSS-aided INS) with accuracy of 0.1% to 1% of range. Data challenge: Navigation and localization rely entirely on acoustic positioning, inertial navigation with Doppler velocity logs, and terrain-relative navigation. Training data must include acoustic positioning noise profiles and INS drift characteristics."
        },
        {
          "title": "Pressure, Temperature, and Salinity Gradients",
          "description": "Pressure increases 1 atm per 10m depth. Temperature drops from 25C surface to 2-4C at depth. Salinity varies from brackish estuaries to hypersaline seas. Thermoclines and haloclines create density layers that affect acoustic propagation. Data challenge: Sensor calibration changes with depth and water properties. Acoustic velocity varies with temperature and salinity, affecting sonar accuracy. Data must include the full depth and water-property envelope of the operational domain."
        },
        {
          "title": "Marine Growth and Biofouling",
          "description": "Subsea structures accumulate marine growth (barnacles, mussels, algae, corals) that obscures inspection targets. Growth patterns vary by geography, depth, and season. Data challenge: Inspection AI must distinguish between structural damage (cracks, corrosion, dents) and marine growth that obscures or mimics damage. Training data must include structures at every marine growth stage from newly installed (clean) to heavily fouled, across different marine ecosystems."
        },
        {
          "title": "Strong and Variable Currents",
          "description": "Ocean currents range from negligible to 3+ knots in tidal channels and river mouths. Currents vary with depth, tide, and season. Subsea vehicles must maintain station in currents that can exceed their thrust capacity. Data challenge: Vehicle dynamics change dramatically with current speed and direction. Training data must include navigation and manipulation in calm conditions through strong cross-currents, with current velocity as a metadata field."
        },
        {
          "title": "Artificial and Bioluminescent Lighting Only",
          "description": "Below 200 meters, there is no natural light. All illumination comes from vehicle-mounted lights that create a narrow cone of visibility with rapid falloff. Backscatter from particles in the water column creates the underwater equivalent of driving in fog with high beams. Data challenge: Training data must replicate the specific light patterns of vehicle-mounted illumination, including backscatter, color absorption (red light attenuates first), and the shadow patterns created by vehicle-mounted light arrays."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Common Robotics Tasks",
      "cards": [
        {
          "title": "Subsea Infrastructure Inspection",
          "description": "Visual and instrument inspection of pipelines, risers, wellheads, manifolds, cables, and structural members. Data requirements: High-resolution video and still images with defect annotations (cracks, corrosion pits, dents, buckles, free-spans, coating damage) classified per API RP 2I or DNV-RP-C203 criteria. Marine growth assessment per growth category. Cathodic protection anode measurement. Minimum 10,000 annotated inspection images per structure type."
        },
        {
          "title": "Pipeline Survey and Inspection",
          "description": "Following pipelines for hundreds of kilometers to assess burial depth, free-span length, coating condition, and third-party damage. Data requirements: Continuous video with pipeline tracking, side-scan sonar for burial depth assessment, CP survey data correlated with position, and anomaly detection for exposed and damaged sections."
        },
        {
          "title": "Subsea Manipulation and Intervention",
          "description": "ROV manipulator operations: valve turning, connector mating, bolt tensioning, tool deployment, and debris removal. Data requirements: Dual-arm manipulation trajectories with force-torque in water column (accounting for buoyancy and drag), tool-target alignment data, and success/failure labels for intervention tasks. Current speed and direction must be recorded as it directly affects manipulation accuracy."
        },
        {
          "title": "Bathymetric Survey and Seabed Mapping",
          "description": "AUV-based multibeam sonar survey for seabed topography, habitat mapping, and pre-construction site characterization. Data requirements: Multibeam echosounder data with seabed classification (rock, sand, mud, gravel, coral), backscatter intensity for substrate characterization, and sub-bottom profiler data for geological assessment."
        },
        {
          "title": "Offshore Wind Turbine Foundation Inspection",
          "description": "Inspecting monopile, jacket, and gravity-base foundations for structural integrity, scour, and cable protection. Data requirements: Foundation surface imagery with corrosion and impact damage annotations, scour measurement data around foundations, cable entry point inspection, and J-tube condition assessment. The offshore wind sector requires inspection data for thousands of identical structures across multiple wind farms."
        },
        {
          "title": "Aquaculture Net Inspection and Monitoring",
          "description": "Inspecting fish farm nets for holes, biofouling, and structural damage. Monitoring fish behavior, health, and feeding. Data requirements: Net condition imagery with damage annotations (holes, abrasion, fouling severity), fish counting and size estimation, and biomass assessment. Dead fish detection and sea lice monitoring for health assessment."
        }
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Data Requirements by Underwater Robot Type",
      "description": "Underwater robots range from observation-class micro-ROVs to work-class systems with manipulator arms. Each operates under unique depth, power, and sensing constraints.",
      "columns": ["Robot Type", "Primary Sensors", "Depth Rating", "Key Annotations", "Operating Constraint"],
      "rows": [
        {
          "Robot Type": "Work-Class ROV",
          "Primary Sensors": "HD camera, sonar, manipulator F/T",
          "Depth Rating": "3,000-6,000m",
          "Key Annotations": "Defect class, manipulation trajectory, tool use",
          "Operating Constraint": "Tethered, vessel-dependent, current-limited"
        },
        {
          "Robot Type": "Survey AUV",
          "Primary Sensors": "Multibeam sonar, SAS, camera",
          "Depth Rating": "3,000-6,000m",
          "Key Annotations": "Seabed class, pipeline state, bathymetry",
          "Operating Constraint": "Endurance (24-72 hrs), acoustic nav only"
        },
        {
          "Robot Type": "Observation-Class ROV",
          "Primary Sensors": "HD camera, depth, compass",
          "Depth Rating": "300-1,000m",
          "Key Annotations": "Structure condition, marine growth, fauna ID",
          "Operating Constraint": "Limited thrust, poor station-keeping in current"
        },
        {
          "Robot Type": "Autonomous Inspection AUV",
          "Primary Sensors": "Camera, structured light, INS",
          "Depth Rating": "300-3,000m",
          "Key Annotations": "Defect detection, CP reading, pipeline track",
          "Operating Constraint": "Pre-programmed mission, limited real-time control"
        },
        {
          "Robot Type": "Hybrid ROV/AUV (HROV)",
          "Primary Sensors": "Camera, sonar, manipulator, INS",
          "Depth Rating": "4,000-11,000m",
          "Key Annotations": "Full inspection + manipulation + survey",
          "Operating Constraint": "Mode switching between tethered and autonomous"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Real-World Deployments",
      "paragraphs": [
        "Oceaneering, the world's largest ROV operator, maintains a fleet of over 250 work-class ROVs deployed globally for offshore oil and gas inspection, maintenance, and construction support. Their Freedom autonomous vehicle performs light intervention tasks without a vessel-deployed tether. Oceaneering's AI ambitions require training data from the enormous diversity of subsea infrastructure they inspect: deepwater wellheads in the Gulf of Mexico, aging North Sea platforms, and new offshore wind foundations in the Baltic and North Seas. The visual appearance of the same structure type varies dramatically by age, marine growth region, and water clarity.",
        "Kongsberg Maritime's HUGIN AUV has completed over 20,000 missions worldwide, performing bathymetric survey, mine countermeasures, and pipeline inspection. HUGIN operates autonomously for 24-72 hours at depths to 6,000 meters, navigating using an integrated INS with GNSS-aided calibration and terrain-relative navigation. The training data for HUGIN's autonomous mission planning comes from thousands of prior surveys that map seabed terrain, current patterns, and acoustic propagation conditions at each operating site.",
        "Saab Seaeye's Sabertooth is a hybrid ROV/AUV that can operate both tethered (for real-time human control) and untethered (for autonomous survey). Equinor uses Sabertooth for resident subsea inspection at the Asgard field in the Norwegian Sea, where the vehicle lives permanently on the seabed in a docking station and performs regular inspections without vessel support. Training data for resident subsea vehicles must capture the gradual changes in a subsea installation over months and years -- progressing marine growth, seasonal visibility variation, and new features like anode wastage.",
        "In the aquaculture sector, companies like BioSort and AKVA Group deploy underwater cameras and ROVs for fish farm monitoring. These systems count fish, estimate biomass, detect sea lice and disease, and inspect net integrity. Norway's aquaculture industry, the world's largest, uses AI-powered fish monitoring across thousands of pens. Training data must include the enormous visual diversity of farmed fish species (Atlantic salmon at various life stages, cod, trout) across seasons, lighting conditions, and water quality.",
        "For defense and port security, companies like ECA Group (now Exail) and Teledyne Marine provide AUVs for mine countermeasures and harbour surveillance. The US Navy's mine countermeasure operations use autonomous sonar-based detection systems that require training data with targets on diverse seabed types: sand, mud, rock, and cluttered environments with natural and man-made debris. The false-alarm rate in mine detection is driven entirely by the quality and diversity of the training data."
      ]
    },
    {
      "type": "prose",
      "heading": "Relevant Data Modalities",
      "paragraphs": [
        "Underwater robotics uses a sensor mix dictated by the physics of the ocean. Acoustic sensors dominate at range: multibeam echosounders map seabed bathymetry, side-scan sonar creates acoustic imagery of the seabed and structures, synthetic aperture sonar (SAS) provides high-resolution acoustic images, and acoustic positioning systems (USBL, LBL) provide navigation fixes. Optical sensors are limited to close range: HD cameras (typically 1080p to 4K) with vehicle-mounted LED lighting for visual inspection, structured light systems for 3D measurement of subsea assets, and laser scalers for dimensional reference.",
        "Navigation sensors include inertial navigation systems (INS) with Doppler velocity logs (DVL) for velocity-over-ground measurement, depth sensors (pressure transducers), altimeters for height above seabed, and acoustic positioning receivers. The combination of INS+DVL provides dead-reckoning navigation that drifts at approximately 0.1% of distance traveled, requiring periodic acoustic position fixes.",
        "Emerging modalities include 3D profiling sonar for structure inspection in zero-visibility conditions, laser scanning (LiDAR adapted for underwater use at short range), underwater hyperspectral imaging for biological survey and mineral identification, and chemical sensors (dissolved hydrocarbon, pH, dissolved oxygen) for environmental monitoring. Training data for these emerging sensors is especially scarce, as the technology is still maturing and few operational datasets exist."
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "christ-rov-technology-2013",
          "title": "The ROV Manual: A User Guide for Remotely Operated Vehicles",
          "authors": "Christ and Wernli",
          "venue": "Butterworth-Heinemann 2013",
          "year": 2013,
          "url": "https://doi.org/10.1016/C2011-0-08974-4"
        },
        {
          "id": "leonard-auv-navigation-2016",
          "title": "Autonomous Underwater Vehicle Navigation",
          "authors": "Leonard et al.",
          "venue": "Springer Handbook of Ocean Engineering 2016",
          "year": 2016,
          "url": "https://doi.org/10.1007/978-3-319-16649-0_14"
        },
        {
          "id": "lu-underwater-detection-2023",
          "title": "A Survey on Deep Learning for Underwater Object Detection",
          "authors": "Lu et al.",
          "venue": "Neurocomputing 2023",
          "year": 2023,
          "url": "https://doi.org/10.1016/j.neucom.2023.01.005"
        },
        {
          "id": "fabbri-underwater-image-2018",
          "title": "Enhancing Underwater Imagery Using Generative Adversarial Networks",
          "authors": "Fabbri et al.",
          "venue": "ICRA 2018",
          "year": 2018,
          "url": "https://arxiv.org/abs/1801.04011"
        },
        {
          "id": "sahoo-subsea-inspection-2023",
          "title": "AI-Based Subsea Infrastructure Inspection: A Review",
          "authors": "Sahoo et al.",
          "venue": "Ocean Engineering 2023",
          "year": 2023,
          "url": "https://doi.org/10.1016/j.oceaneng.2023.114581"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Serves Underwater Robotics",
      "paragraphs": [
        "Claru collects underwater training data using ROV and diver-operated camera systems across a range of marine environments: offshore platforms, subsea pipelines, port infrastructure, and aquaculture sites. Our collectors include commercial divers and ROV pilots with offshore survival training (BOSIET/HUET certified) who understand the operational context of each inspection task. We capture in conditions ranging from 30-meter tropical visibility to sub-meter turbid North Sea conditions, ensuring training data spans the full operational envelope.",
        "Our annotation pipeline includes subsea-specific protocols: defect classification per API RP 2I and DNV-RP-C203 standards for offshore structural inspection, pipeline condition assessment per DNVGL-RP-F116, marine growth classification by type and severity, cathodic protection assessment from anode imagery, and scour measurement around offshore wind foundations. Our annotators are trained on the visual appearance of underwater corrosion, fatigue cracking, and impact damage, distinguishing real defects from marine growth artifacts that often mimic or obscure damage.",
        "For AUV and autonomous inspection applications, we deliver paired optical-acoustic datasets where camera imagery and sonar data are co-registered to the same subsea features, enabling training of multi-modal fusion models that maintain inspection capability as visibility degrades. All underwater data includes depth, water temperature, visibility estimate, current speed, and positioning metadata. We deliver in industry-standard formats compatible with offshore asset management systems (Veristar, SAP PM, Meridium)."
      ]
    }
  ],
  "faqs": [
    {
      "question": "How does Claru handle the extreme visibility variation in underwater environments?",
      "answer": "Visibility is the defining challenge of underwater data, ranging from 30+ meters in clear tropical water to less than 0.5 meters in turbid conditions. Claru addresses this by collecting across the full visibility spectrum and annotating every capture with a visibility-distance estimate. In clear conditions, we capture detailed optical imagery for defect detection training. In turbid conditions, we capture paired acoustic-optical data where sonar provides the primary perception and optical cameras provide close-range detail. We annotate both modalities against the same ground truth, enabling training of multi-modal fusion models that gracefully degrade as visibility drops. For inspection applications, we include the specific lighting geometry of vehicle-mounted illumination, including backscatter effects that worsen with turbidity."
    },
    {
      "question": "Can Claru provide training data for autonomous subsea inspection (resident ROV/AUV)?",
      "answer": "Yes. Resident subsea vehicles that operate from seabed docking stations represent the future of offshore inspection, and their training data requirements are distinct from vessel-deployed operations. Claru provides longitudinal datasets that capture the same subsea structures over multiple visits, showing the gradual progression of marine growth, anode depletion, and seasonal visibility changes. We include navigation data with acoustic positioning fixes and terrain-relative features for autonomous localization. Our datasets cover the docking and undocking sequences, station-keeping in variable currents, and the approach trajectories to inspection targets. All data includes the environmental metadata (current, temperature, visibility) needed to train policies that adapt to changing conditions."
    },
    {
      "question": "What defect types does Claru annotate for subsea infrastructure inspection?",
      "answer": "Our annotation taxonomy covers the full range of subsea structural defects per API RP 2I and DNV standards. For steel structures: general corrosion (classified by depth), pitting corrosion (classified by density and depth), fatigue cracking (classified by length and orientation), impact damage (dents classified by depth-to-diameter ratio), coating damage (disbondment, blistering, mechanical damage), weld defects (visible undercut, misalignment, porosity), and free-span assessment for pipelines. For concrete: spalling, rebar exposure, cracking, and settlement. Marine growth is separately classified by type (hard fouling, soft fouling, kelp, coral) and coverage percentage. Each defect annotation includes severity grade, location referenced to the structural drawing, and recommended inspection action."
    },
    {
      "question": "Does Claru provide training data for offshore wind foundation inspection?",
      "answer": "Yes. Offshore wind is one of the fastest-growing applications for underwater robotics, with thousands of turbine foundations requiring regular inspection. Claru provides inspection datasets covering monopile, jacket, gravity-base, and floating foundation types. Our annotations include corrosion mapping on steel surfaces, scour depth measurement around foundations, cable entry and J-tube condition, grouted connection integrity, and marine growth assessment. The offshore wind sector benefits from structural similarity -- foundations within a wind farm are identical -- so training data from a subset of foundations transfers well to the full fleet. We capture a representative sample across the wind farm to cover variation in water depth, seabed type, current exposure, and marine growth patterns."
    },
    {
      "question": "How does Claru handle the color distortion in underwater imagery?",
      "answer": "Water absorbs light wavelengths differently: red light is lost within the first 5 meters, followed by orange and yellow, leaving only blue-green at depth. Vehicle-mounted lights partially restore color at close range but create uneven illumination with a bright center and rapid falloff. Claru addresses this by capturing raw (non-white-balanced) imagery alongside metadata about depth, water type (turbidity, color), and light configuration. Our annotation pipeline works with both raw and color-corrected imagery, so training data can support models that operate on either. For inspection applications, we provide defect annotations on both raw and corrected versions, as some defects (rust staining, discoloration) are more visible in specific color channels."
    }
  ],
  "ctaHeading": "Discuss Underwater Robotics Data Needs",
  "ctaDescription": "Tell us about your underwater robotics project -- whether it is subsea inspection, pipeline survey, autonomous navigation, or aquaculture monitoring. Claru will scope a marine data collection plan with certified offshore collectors and subsea-specific annotation protocols.",
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
      "name": "IMCA R 004 / IMCA D 045",
      "jurisdiction": "International",
      "description": "IMCA guidance on ROV and AUV operations including emergency procedures.",
      "dataImplications": "Emergency scenarios: comms loss, position loss, entanglement, and diver-proximity safety cases."
    },
    {
      "name": "DNV-ST-0168 / DNV-RP-0457",
      "jurisdiction": "International",
      "description": "DNV standards for ROV system safety and autonomous underwater vehicle operations.",
      "dataImplications": "Failure-mode testing data, sensor redundancy validation, and documented risk assessment coverage."
    },
    {
      "name": "API RP 2I / API RP 2FPS",
      "jurisdiction": "US",
      "description": "API recommended practices for subsea structure and mooring inspection.",
      "dataImplications": "Defect annotations aligned with API acceptance criteria: crack thresholds, corrosion grades, growth assessment."
    },
    {
      "name": "MARPOL / IMO COLREGS",
      "jurisdiction": "International",
      "description": "Maritime safety and collision regulations for autonomous surface vessels.",
      "dataImplications": "Vessel traffic scenarios in accordance with COLREGS rules for surface operations."
    },
    {
      "name": "UNCLOS / National EEZ Regulations",
      "jurisdiction": "International",
      "description": "Law of the Sea governing marine research and AUV operations in foreign waters.",
      "dataImplications": "Data collection permits and operational notifications for foreign EEZ operations."
    }
  ],
  "environmentCharacteristics": [
    {
      "characteristic": "Extreme Visibility Limitation",
      "description": "30+ meters (tropical clear) to <0.5 meters (turbid coastal). Dynamic degradation from sediment and blooms.",
      "dataChallenge": "Camera-based perception fails in turbidity. Must pair optical with acoustic across full visibility spectrum."
    },
    {
      "characteristic": "No GPS, No RF Communication",
      "description": "Acoustic positioning (0.1-1% of range accuracy). INS+DVL dead reckoning drifts at ~0.1% of distance.",
      "dataChallenge": "Navigation relies entirely on acoustic/inertial systems. Data must include positioning noise profiles."
    },
    {
      "characteristic": "Pressure, Temperature, Salinity Gradients",
      "description": "+1 atm per 10m depth. Thermoclines and haloclines affect acoustic propagation.",
      "dataChallenge": "Sensor calibration changes with depth. Acoustic velocity varies. Data must cover full depth envelope."
    },
    {
      "characteristic": "Marine Growth and Biofouling",
      "description": "Structures accumulate barnacles, mussels, algae, coral that obscure inspection targets.",
      "dataChallenge": "Distinguish damage from growth. Data must include every growth stage across marine ecosystems."
    },
    {
      "characteristic": "Strong Variable Currents",
      "description": "0 to 3+ knots, varying with depth, tide, and season. Can exceed vehicle thrust capacity.",
      "dataChallenge": "Vehicle dynamics change dramatically. Navigation and manipulation data must include current metadata."
    },
    {
      "characteristic": "Artificial Lighting Only at Depth",
      "description": "No natural light below 200m. Vehicle-mounted LEDs create narrow cone with backscatter.",
      "dataChallenge": "Must replicate specific light patterns, color absorption (red lost first), and backscatter fog effect."
    }
  ],
  "commonTasks": [
    {
      "task": "Subsea Infrastructure Inspection",
      "description": "Visual and instrument inspection of pipelines, risers, wellheads, manifolds, and structural members.",
      "dataRequirements": "HD video/stills with defect annotations per API/DNV criteria. Marine growth classification. 10K+ images per structure type."
    },
    {
      "task": "Pipeline Survey and Inspection",
      "description": "Following pipelines for hundreds of km assessing burial depth, coating, and damage.",
      "dataRequirements": "Continuous video with tracking, side-scan sonar for burial, CP survey, anomaly detection."
    },
    {
      "task": "Subsea Manipulation and Intervention",
      "description": "ROV manipulator operations: valve turning, connector mating, bolt tensioning, tool deployment.",
      "dataRequirements": "Dual-arm trajectories with force-torque accounting for buoyancy and drag. Current metadata required."
    },
    {
      "task": "Bathymetric Survey",
      "description": "AUV-based multibeam sonar survey for seabed mapping and site characterization.",
      "dataRequirements": "Multibeam data with seabed classification, backscatter intensity, sub-bottom profiler data."
    },
    {
      "task": "Offshore Wind Foundation Inspection",
      "description": "Inspecting monopile, jacket, and gravity-base foundations for structural integrity and scour.",
      "dataRequirements": "Foundation imagery with corrosion/impact annotations, scour measurement, cable entry condition."
    },
    {
      "task": "Aquaculture Monitoring",
      "description": "Fish farm net inspection, fish counting, health monitoring, and biomass estimation.",
      "dataRequirements": "Net condition imagery, fish count/size data, dead fish detection, sea lice monitoring."
    }
  ],
  "relevantModalities": [
    "Multibeam echosounder (bathymetry)",
    "Side-scan sonar / SAS (acoustic imagery)",
    "HD camera (1080p-4K, LED-illuminated)",
    "Structured light (3D measurement)",
    "INS + DVL (navigation)",
    "Acoustic positioning (USBL, LBL)",
    "Depth / pressure transducer",
    "Chemical sensors (hydrocarbon, pH, DO)",
    "3D profiling sonar (zero-vis inspection)"
  ],
  "keyPapers": [
    {
      "id": "christ-rov-technology-2013",
      "title": "The ROV Manual: A User Guide for Remotely Operated Vehicles",
      "authors": "Christ and Wernli",
      "venue": "Butterworth-Heinemann 2013",
      "year": 2013,
      "url": "https://doi.org/10.1016/C2011-0-08974-4"
    },
    {
      "id": "leonard-auv-navigation-2016",
      "title": "Autonomous Underwater Vehicle Navigation",
      "authors": "Leonard et al.",
      "venue": "Springer Handbook of Ocean Engineering 2016",
      "year": 2016,
      "url": "https://doi.org/10.1007/978-3-319-16649-0_14"
    },
    {
      "id": "lu-underwater-detection-2023",
      "title": "A Survey on Deep Learning for Underwater Object Detection",
      "authors": "Lu et al.",
      "venue": "Neurocomputing 2023",
      "year": 2023,
      "url": "https://doi.org/10.1016/j.neucom.2023.01.005"
    },
    {
      "id": "fabbri-underwater-image-2018",
      "title": "Enhancing Underwater Imagery Using Generative Adversarial Networks",
      "authors": "Fabbri et al.",
      "venue": "ICRA 2018",
      "year": 2018,
      "url": "https://arxiv.org/abs/1801.04011"
    },
    {
      "id": "sahoo-subsea-inspection-2023",
      "title": "AI-Based Subsea Infrastructure Inspection: A Review",
      "authors": "Sahoo et al.",
      "venue": "Ocean Engineering 2023",
      "year": 2023,
      "url": "https://doi.org/10.1016/j.oceaneng.2023.114581"
    }
  ],
  "claruRelevance": "Claru collects underwater training data with BOSIET/HUET-certified offshore collectors and ROV pilots across marine environments from tropical to North Sea conditions. Our annotation pipeline covers subsea-specific defect classification per API/DNV standards, marine growth assessment, and paired optical-acoustic datasets for multi-modal fusion. All data includes depth, temperature, visibility, current, and positioning metadata for environment-aware model training."
};

export default data;
