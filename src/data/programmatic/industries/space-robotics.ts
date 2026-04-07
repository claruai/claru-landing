import type { IndustryPageData } from "./types";

const data: IndustryPageData = {
  "slug": "space-robotics",
  "metaTitle": "Space Robotics Training Data | Claru",
  "metaDescription": "Training data for space robots: satellite servicing, lunar and Mars exploration, orbital assembly, debris removal, and space station maintenance.",
  "primaryKeyword": "space robotics training data",
  "secondaryKeywords": [
    "space robotics data",
    "satellite servicing robot data",
    "lunar rover training data",
    "orbital assembly AI data",
    "space debris removal data",
    "planetary exploration robot datasets",
    "in-orbit servicing training data"
  ],
  "canonicalPath": "/industries/space-robotics",
  "h1": "Space Robotics Training Data",
  "heroSubtitle": "Training data for space robots: satellite servicing, lunar and Mars exploration, orbital assembly, debris removal, and space station maintenance. Built for the extreme radiation, lighting, and communication constraints that define operations beyond Earth.",
  "breadcrumbs": [
    { "label": "Home", "href": "/" },
    { "label": "Industries", "href": "/industries" },
    { "label": "Space Robotics", "href": "/industries/space-robotics" }
  ],
  "sections": [
    {
      "type": "prose",
      "heading": "Why Space Robotics Data Is the Hardest Domain in Robotics",
      "paragraphs": [
        "Space robotics operates under constraints that no terrestrial domain approaches. Communication delays range from 1.3 seconds for the Moon to 4-24 minutes for Mars, making real-time teleoperation impossible for planetary missions. Radiation degrades electronics and sensor performance over mission lifetimes. Lighting conditions swing from direct sunlight (equivalent to 137,000 lux) to total darkness within a single orbit, with no atmosphere to diffuse light. Microgravity eliminates the gravitational references that terrestrial robots rely on for manipulation. These constraints mean that space robots must be significantly more autonomous than their Earth-bound counterparts, and the training data that enables this autonomy must be prepared on the ground before launch.",
        "The space robotics market is growing rapidly, driven by the commercialization of space. Morgan Stanley projects the space economy to reach $1 trillion by 2040. In-orbit servicing, assembly, and manufacturing (ISAM) is one of the fastest-growing segments. Northrop Grumman's Mission Extension Vehicle (MEV) has successfully docked with and extended the life of Intelsat satellites. Astroscale launched ADRAS-J in 2024 to demonstrate proximity operations with a piece of space debris. NASA's OSAM-1 mission (formerly Restore-L) aims to robotically refuel a satellite in orbit. Each of these missions relies on autonomous or semi-autonomous robotics trained on data that must capture the unique visual and physical conditions of space.",
        "Planetary exploration pushes autonomy requirements to their limits. NASA's Perseverance rover on Mars uses the AutoNav autonomous driving system that processes stereo images to plan safe paths across Martian terrain. The rover has driven over 30 km autonomously, but training data for AutoNav was generated entirely from simulated Mars terrain and analogue sites on Earth, because no real Mars driving data existed before the mission launched. This highlights the fundamental space robotics data problem: you cannot collect data in the target environment before the mission, so training data must come from simulation, analogue environments, and hardware-in-the-loop testing.",
        "The Canadarm2 and Dextre robotic systems on the International Space Station demonstrate the manipulation data challenge. These systems have performed over 100 capture and berthing operations, but each operation is unique -- different visiting vehicles, different lighting conditions, different thermal states. Teleoperation data from ISS robotics captures is among the most valuable manipulation datasets in existence, but the total volume is tiny compared to what modern learning-based systems require. Ground-based analogue data from neutral buoyancy pools and air-bearing tables must supplement the limited on-orbit data."
      ]
    },
    {
      "type": "cards",
      "heading": "Regulatory Requirements",
      "cards": [
        {
          "title": "NASA-STD-8719.13 / NASA-STD-8719.14 (US)",
          "description": "NASA Software Safety Standard and Process for Limiting Orbital Debris. AI systems on NASA missions must meet software assurance levels commensurate with the criticality of the function. Training data for autonomous navigation and manipulation must be fully traceable, with documented test coverage for all identified failure modes. Orbital debris requirements constrain autonomous maneuvering -- training data must include collision avoidance scenarios based on tracked debris catalogs."
        },
        {
          "title": "ECSS-E-ST-40C / ECSS-Q-ST-80C (ESA)",
          "description": "European Cooperation for Space Standardization for software engineering and quality assurance. Space AI software must achieve qualification levels from A (critical) to D (non-critical). Training data for flight-critical AI requires full traceability from requirements through test cases, with documented independence between training and validation datasets. ECSS mandates independent verification and validation (IV&V) of software quality."
        },
        {
          "title": "ITU Radio Regulations / FCC Part 25 (International/US)",
          "description": "Spectrum management regulations constrain the bandwidth available for robot telemetry and telecommand. Typical deep-space links provide 0.5-5 Mbps, severely limiting the data that can be uplinked for model updates or downlinked for telemetry. Training data must account for bandwidth-constrained operations where the robot cannot rely on cloud inference or real-time human guidance."
        },
        {
          "title": "UN Outer Space Treaty / IADC Guidelines (International)",
          "description": "International framework governing space activities including debris mitigation. Autonomous robots performing proximity operations must comply with IADC guidelines for collision avoidance and end-of-life disposal. Training data for autonomous rendezvous and proximity operations must include conjunction assessment scenarios with cataloged objects and uncertain debris tracks."
        },
        {
          "title": "ITAR / EAR Export Controls (US)",
          "description": "International Traffic in Arms Regulations and Export Administration Regulations restrict the sharing of space technology including AI training data for spacecraft systems. Training datasets for space robotics may be export-controlled, requiring US-person-only annotation teams and ITAR-compliant data handling infrastructure. This significantly constrains the annotation workforce and data pipeline architecture."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Environment Characteristics",
      "cards": [
        {
          "title": "Extreme Lighting Dynamics",
          "description": "In orbit, direct sunlight illuminates surfaces at 1,361 W/m2 while shadows are near-total darkness with no atmospheric scattering. Orbital dawn/dusk transitions occur in seconds. Planetary surfaces have no atmospheric haze. Data challenge: Camera dynamic range is insufficient to capture both sunlit and shadowed regions simultaneously. Training data must include HDR captures across the full solar illumination range with accurate shadow maps."
        },
        {
          "title": "Communication Delay and Bandwidth Limits",
          "description": "Moon: 1.3s round-trip. Mars: 8-48 minutes. GEO orbit: 0.5s. Deep-space links provide 0.5-5 Mbps. Data challenge: Robots must make autonomous decisions within the communication gap. Training data must support policies that are robust without real-time human oversight, including contingency behaviors for communication blackouts."
        },
        {
          "title": "Microgravity and Reduced Gravity",
          "description": "Orbital operations occur in microgravity where objects do not fall and tools float away. Lunar gravity is 1/6 Earth. Mars gravity is 3/8 Earth. Data challenge: Manipulation dynamics are fundamentally different from Earth. Force-torque profiles, object trajectories after release, and cable/tether behavior all change. Ground-based analogue data from parabolic flights, neutral buoyancy, and air-bearing tables only partially captures these dynamics."
        },
        {
          "title": "Radiation-Degraded Sensor Performance",
          "description": "Galactic cosmic rays and solar particle events cause single-event upsets in electronics and progressive degradation of camera sensors (hot pixels, charge transfer inefficiency). Data challenge: Training data must include sensor degradation models that simulate progressive performance loss over mission lifetime. Models must maintain performance as sensor quality deteriorates."
        },
        {
          "title": "Featureless and Repetitive Terrain",
          "description": "Lunar and Martian surfaces are dominated by regolith with sparse visual features. Orbital environments contain reflective spacecraft surfaces against the black of space. Data challenge: Visual odometry and SLAM struggle with feature-poor environments. Training data must include terrain with varying feature density, including worst-case flat regolith plains and uniform spacecraft surfaces."
        },
        {
          "title": "Thermal Extremes",
          "description": "Orbital temperatures swing from +120C (sun-facing) to -180C (shadow) within minutes. Lunar surface: +127C (day) to -173C (night). Data challenge: Thermal expansion and contraction affect mechanical calibration. Training data must account for thermally-induced dimensional changes in both the robot and target objects."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Common Robotics Tasks",
      "cards": [
        {
          "title": "Satellite Proximity Operations and Docking",
          "description": "Autonomous approach, inspection, and docking with cooperative or non-cooperative target satellites. Data requirements: Monocular and stereo imagery of target spacecraft under all illumination conditions (sun angles from 0 to 180 degrees), relative pose estimation ground truth from motion capture or laser ranging, approach trajectory data with plume impingement constraints, and docking mechanism alignment data at sub-centimeter accuracy."
        },
        {
          "title": "Planetary Surface Navigation",
          "description": "Autonomous rover traversal across rocky, sandy, and sloped terrain on the Moon or Mars. Data requirements: Stereo imagery of terrain analogue sites with traversability annotations (rock size, slope, soil type), wheel-terrain interaction data for various regolith types, slip estimation models, and hazard detection for craters, rocks, and steep slopes. Minimum 1,000 km of analogue driving data for long-range autonomy."
        },
        {
          "title": "In-Orbit Manipulation and Assembly",
          "description": "Robotic arms capturing, manipulating, and assembling structures in microgravity. Data requirements: 6-DoF manipulation trajectories in microgravity analogues (neutral buoyancy, air bearing), force-torque profiles for microgravity grapple and berthing, free-floating object tracking and state estimation, and thermal deflection models for large structures."
        },
        {
          "title": "Space Debris Inspection and Removal",
          "description": "Approaching, characterizing, and capturing tumbling debris objects. Data requirements: Multi-axis rotation state estimation from monocular imagery, tumble rate and axis determination, surface material classification from reflectance, and capture trajectory planning data for objects with unknown mass and inertia properties."
        },
        {
          "title": "Extraterrestrial Sample Collection",
          "description": "Robotic arms and drills collecting soil, rock, and atmospheric samples on planetary surfaces. Data requirements: Drill force-penetration data for various rock types, sample tube manipulation trajectories, visual classification of scientifically interesting rock targets, and caching/storage manipulation for sample return missions."
        }
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Data Requirements by Space Robot Type",
      "description": "Space robots operate across domains from LEO to deep space, each with unique sensor, autonomy, and data constraints.",
      "columns": ["Robot Type", "Primary Sensors", "Autonomy Level", "Key Data Challenge", "Data Source"],
      "rows": [
        {
          "Robot Type": "GEO Servicing Vehicle",
          "Primary Sensors": "Monocular/stereo RGB, LiDAR, star tracker",
          "Autonomy Level": "Semi-autonomous with ground oversight",
          "Key Data Challenge": "Target pose estimation under extreme lighting",
          "Data Source": "Simulation + hardware-in-the-loop"
        },
        {
          "Robot Type": "LEO Debris Removal",
          "Primary Sensors": "RGB, LiDAR, radar",
          "Autonomy Level": "High (tumbling target, short contact window)",
          "Key Data Challenge": "Tumble state estimation, unknown inertia",
          "Data Source": "Simulation + ground testbed"
        },
        {
          "Robot Type": "Planetary Rover",
          "Primary Sensors": "Stereo RGB, IMU, wheel encoders",
          "Autonomy Level": "High (minutes to hours of communication delay)",
          "Key Data Challenge": "Terrain traversability in featureless regolith",
          "Data Source": "Analogue sites + simulation"
        },
        {
          "Robot Type": "ISS Robotic Arm",
          "Primary Sensors": "RGB, force/torque, joint encoders",
          "Autonomy Level": "Teleoperated with autonomous sub-tasks",
          "Key Data Challenge": "Microgravity manipulation dynamics",
          "Data Source": "Neutral buoyancy + on-orbit telemetry"
        },
        {
          "Robot Type": "Orbital Assembly Robot",
          "Primary Sensors": "Stereo RGB, LiDAR, force/torque",
          "Autonomy Level": "Semi-autonomous (repetitive assembly tasks)",
          "Key Data Challenge": "Thermal deformation of large structures",
          "Data Source": "Simulation + thermal-vacuum chamber"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Real-World Deployments and Missions",
      "paragraphs": [
        "Northrop Grumman's Mission Extension Vehicle (MEV-1 and MEV-2) successfully docked with Intelsat satellites in 2020 and 2021, extending their operational lives by providing propulsion and attitude control. MEV uses autonomous proximity operations guided by computer vision that must handle the extreme lighting of geostationary orbit -- where the target satellite alternates between full sun illumination and Earth shadow every 24 hours. The training data for MEV's autonomous approach came from extensive simulation and ground-based testing using spacecraft mockups under simulated orbital lighting.",
        "Astroscale's ADRAS-J mission, launched in February 2024, demonstrated autonomous proximity operations with a Japanese H-IIA rocket upper stage -- a piece of real space debris tumbling in orbit. This was the world's first commercial debris inspection mission. ADRAS-J approached to within meters of the tumbling target and captured detailed images of its condition. Training data for the mission required simulating the optical appearance of the target under every possible sun angle, with the added complexity that the target's tumble state was only approximately known before launch.",
        "NASA's Perseverance rover has driven over 30 km on Mars using the AutoNav autonomous driving system. AutoNav processes stereo images to create 3D terrain maps, identifies hazards (rocks, steep slopes, soft sand), and plans safe paths -- all with 4-24 minute communication delays to Earth. The training data challenge was enormous: AutoNav had to be trained entirely on Earth using Mars terrain analogues (Mojave Desert, Atacama Desert, Iceland) and high-fidelity simulation. The rover's onboard compute is radiation-hardened but limited (200 MHz PowerPC BAE RAD750), constraining the model architectures that can run in real time.",
        "The Canadarm2 and Dextre systems on the International Space Station have performed over 100 robotic operations including satellite deployment, cargo berthing, and external maintenance. Canada's MDA (now part of MDA Space) operates these systems from the ground with 0.5-second communication delay. Teleoperator training data from Canadarm2 captures is used to develop the autonomous capabilities planned for the Canadarm3 system on NASA's Gateway lunar station, which will need much higher autonomy due to the 1.3-second lunar communication delay and intermittent ground contact.",
        "GITAI, a Japanese-American startup, has demonstrated robotic assembly and maintenance tasks on the ISS using their S2 robotic arm. In 2024 tests, the GITAI system autonomously performed panel installation tasks inside the station. The company is developing robots for lunar surface construction and satellite servicing. Their training approach combines teleoperation demonstrations on ISS (limited and extremely valuable) with extensive ground testing in analogue environments."
      ]
    },
    {
      "type": "prose",
      "heading": "Relevant Data Modalities",
      "paragraphs": [
        "Space robotics uses a constrained sensor palette driven by radiation tolerance, power limits, and mass budgets. Core modalities include radiation-hardened cameras (typically 1-5 megapixel, global shutter, specialized for extreme dynamic range), stereo camera pairs for depth estimation, LiDAR for relative navigation in proximity operations, star trackers and sun sensors for attitude determination, force-torque sensors for manipulation (6-axis, radiation-tolerant), and IMUs for inertial navigation. Planetary rovers add wheel current sensors for terrain interaction and spectrometers for science targeting.",
        "The dominant data modality for space robotics training is synthetic imagery from physics-based rendering. Because real space data is extremely scarce and expensive to collect, most training data comes from renderers that accurately model solar illumination, Earth albedo, spacecraft material reflectance (multi-layer insulation, solar panels, aluminum, carbon fiber), and camera sensor characteristics (noise, blooming, charge transfer). Tools like NASA's Gazebo-based simulation environments, NVIDIA Isaac Sim, and custom renderers built on physically-based rendering engines generate the bulk of training data for space missions.",
        "Ground-based analogue data provides the essential bridge between simulation and reality. Neutral buoyancy facilities (NASA's Neutral Buoyancy Laboratory, ESA's Neutral Buoyancy Facility) simulate microgravity for manipulation tasks. Planetary analogue sites (Devon Island for Mars, volcanic fields in Iceland and Hawaii for lunar terrain) provide terrain data. Hardware-in-the-loop testbeds with flight-representative sensors and actuators capture the sensor noise, actuator backlash, and control latency that simulation often underpredicts."
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "flores-abad-space-servicing-2014",
          "title": "A Review of Space Robotics Technologies for On-Orbit Servicing",
          "authors": "Flores-Abad et al.",
          "venue": "Progress in Aerospace Sciences 2014",
          "year": 2014,
          "url": "https://doi.org/10.1016/j.paerosci.2014.03.002"
        },
        {
          "id": "nesnas-autonav-2021",
          "title": "Autonomous Navigation for Mars Surface Exploration",
          "authors": "Nesnas et al.",
          "venue": "IEEE Aerospace Conference 2021",
          "year": 2021,
          "url": "https://doi.org/10.1109/AERO50100.2021.9438374"
        },
        {
          "id": "opromolla-pose-estimation-2017",
          "title": "A Review of Cooperative and Uncooperative Spacecraft Pose Determination Techniques for Close-Proximity Operations",
          "authors": "Opromolla et al.",
          "venue": "Progress in Aerospace Sciences 2017",
          "year": 2017,
          "url": "https://doi.org/10.1016/j.paerosci.2017.07.001"
        },
        {
          "id": "park-speed-2022",
          "title": "SPEED+: Next-Generation Dataset for Spacecraft Pose Estimation across Domain Gap",
          "authors": "Park et al.",
          "venue": "IEEE Aerospace Conference 2022",
          "year": 2022,
          "url": "https://arxiv.org/abs/2110.03101"
        },
        {
          "id": "matthies-terrain-2007",
          "title": "Computer Vision on Mars",
          "authors": "Matthies et al.",
          "venue": "International Journal of Computer Vision 2007",
          "year": 2007,
          "url": "https://doi.org/10.1007/s11263-007-0046-z"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Serves Space Robotics",
      "paragraphs": [
        "Claru provides training data for space robotics through three channels: analogue environment data collection, human-annotated synthetic imagery, and teleoperation demonstration data from ground testbeds. For planetary exploration, we collect terrain data at analogue sites with survey-grade ground truth, annotated for traversability, rock size distribution, slope, and soil type. Our collector teams operate at sites selected for geological similarity to target planetary bodies.",
        "For orbital robotics, we provide expert annotation of synthetic imagery generated from mission-specific simulation environments. Our annotators label spacecraft poses, component boundaries, docking interface features, and degradation indicators (thermal blanket damage, solar panel cracking, micrometeorite impacts) on rendered imagery. We support the SPEED+ pose estimation format and custom annotation schemas defined by mission teams. Our ITAR-compliant data handling infrastructure ensures that export-controlled training data is processed exclusively by US persons on US-based systems.",
        "For manipulation tasks, we capture teleoperation demonstrations on representative ground testbeds using flight-analogue robotic arms. These demonstrations provide the imitation learning data that seeds autonomous manipulation policies. We record synchronized video, force-torque, and joint-state data at rates compatible with space-qualified control systems. All data is delivered with the full traceability documentation required by NASA-STD-8719.13 and ECSS-Q-ST-80C."
      ]
    }
  ],
  "faqs": [
    {
      "question": "How does Claru address the sim-to-real gap for space robotics training data?",
      "answer": "The sim-to-real gap is the central data challenge in space robotics because you cannot collect training data in the target environment before the mission. Claru addresses this through a three-layer approach. First, we collect data at planetary analogue sites and ground testbeds that replicate key aspects of the space environment (terrain, lighting, gravity analogues). Second, we provide expert annotation of synthetic imagery from physics-based renderers, where our annotators verify that rendered scenes match the visual fidelity required for perception training. Third, we support domain randomization strategies by annotating synthetic data generated with systematic variation in lighting, texture, and sensor noise, helping models generalize beyond any single simulation fidelity level. Our analogue site data serves as the bridge for validating that simulation-trained models transfer to physical environments."
    },
    {
      "question": "Can Claru handle ITAR-controlled space robotics data?",
      "answer": "Yes. Claru maintains an ITAR-compliant data handling infrastructure for export-controlled space technology. All annotation work on ITAR-controlled datasets is performed by US persons on systems that meet ITAR data security requirements. Our ITAR compliance covers the full data lifecycle: collection at secure facilities, annotation on access-controlled workstations, quality review by cleared personnel, and delivery through encrypted channels. We can provide the compliance documentation required by prime contractors and government customers."
    },
    {
      "question": "What planetary analogue sites does Claru collect data at?",
      "answer": "We collect terrain data at sites selected for geological similarity to target planetary bodies. For Mars analogues, we work at Mojave Desert sites (similar basaltic terrain and rock distributions), Atacama Desert (hyperarid conditions matching Mars surface), and Icelandic volcanic fields (basaltic lava flows and weathering patterns). For lunar analogues, we collect at volcanic cinder fields in Arizona and Hawaii that replicate lunar regolith properties. Each site is captured with survey-grade ground truth from RTK-GPS and total station measurements, with annotations for traversability, rock size distribution, slope, and soil bearing capacity."
    },
    {
      "question": "How does Claru handle the extreme lighting conditions of orbital operations?",
      "answer": "Orbital lighting swings from 137,000 lux direct sunlight to near-total shadow darkness within seconds of an orbital dawn/dusk transition. We address this by providing training data that systematically covers the full solar illumination envelope. For synthetic data, we annotate imagery rendered at solar phase angles from 0 to 180 degrees, including the particularly challenging backlit and high-phase-angle conditions where spacecraft features are barely visible. For ground testbed data, we use programmable lighting rigs that reproduce orbital lighting profiles including the abrupt transitions. Our annotations include illumination metadata (sun angle, albedo conditions, shadow map) so that models can be evaluated per-condition rather than in aggregate."
    },
    {
      "question": "What data does Claru provide for autonomous docking and proximity operations?",
      "answer": "Our proximity operations datasets include monocular and stereo imagery of spacecraft mockups under simulated orbital lighting with 6-DoF relative pose ground truth from motion capture or laser tracking. We cover the full approach trajectory from long-range detection (kilometers) through final approach (meters) to docking contact. Annotations include target spacecraft component identification (solar panels, antennas, docking interfaces, thruster nozzles), surface condition assessment for servicing missions, and keep-out zone boundaries for plume impingement protection. We support both cooperative targets (with known geometry and fiducial markers) and non-cooperative targets (debris or failed satellites with unknown attitude state)."
    }
  ],
  "ctaHeading": "Discuss Space Robotics Data Needs",
  "ctaDescription": "Tell us about your space robotics mission -- whether it is satellite servicing, planetary exploration, orbital assembly, or debris removal. Claru will scope a data plan covering analogue collection, synthetic annotation, and ground testbed demonstrations with full NASA/ESA traceability.",
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
      "name": "NASA-STD-8719.13/14",
      "jurisdiction": "US",
      "description": "NASA Software Safety Standard and Orbital Debris limitation requirements.",
      "dataImplications": "Full traceability from requirements through test cases. Collision avoidance training scenarios required."
    },
    {
      "name": "ECSS-E-ST-40C / ECSS-Q-ST-80C",
      "jurisdiction": "International (ESA)",
      "description": "ESA software engineering and quality assurance standards.",
      "dataImplications": "Training/validation dataset independence. IV&V of software including training data quality."
    },
    {
      "name": "ITU Radio Regulations / FCC Part 25",
      "jurisdiction": "International / US",
      "description": "Spectrum management constraining communication bandwidth for robot telemetry.",
      "dataImplications": "Training data must support bandwidth-constrained operations without cloud inference."
    },
    {
      "name": "UN Outer Space Treaty / IADC Guidelines",
      "jurisdiction": "International",
      "description": "Framework governing space activities including debris mitigation.",
      "dataImplications": "Conjunction assessment scenarios with cataloged objects and uncertain debris tracks."
    },
    {
      "name": "ITAR / EAR Export Controls",
      "jurisdiction": "US",
      "description": "Export control restricting sharing of space technology including AI training data.",
      "dataImplications": "US-person-only annotation teams and ITAR-compliant data handling infrastructure."
    }
  ],
  "environmentCharacteristics": [
    {
      "characteristic": "Extreme Lighting Dynamics",
      "description": "1,361 W/m2 direct sun to near-total shadow with orbital transitions in seconds.",
      "dataChallenge": "HDR capture across full solar range. Camera dynamic range insufficient for both sunlit and shadowed regions."
    },
    {
      "characteristic": "Communication Delay",
      "description": "1.3s (Moon) to 4-24 min (Mars). GEO: 0.5s. Bandwidth: 0.5-5 Mbps.",
      "dataChallenge": "Robots must operate autonomously within communication gaps including blackout contingencies."
    },
    {
      "characteristic": "Microgravity / Reduced Gravity",
      "description": "Orbital microgravity. Moon: 1/6g. Mars: 3/8g. Objects float, cables drift.",
      "dataChallenge": "Manipulation dynamics differ fundamentally from Earth. Ground analogues only partially replicate."
    },
    {
      "characteristic": "Radiation-Degraded Sensors",
      "description": "Cosmic rays and solar events cause hot pixels, charge transfer issues over mission lifetime.",
      "dataChallenge": "Sensor degradation models must simulate progressive performance loss."
    },
    {
      "characteristic": "Featureless Terrain",
      "description": "Lunar/Martian regolith with sparse visual features. Orbital: reflective surfaces against black space.",
      "dataChallenge": "Visual odometry struggles. Data must include worst-case feature-poor environments."
    },
    {
      "characteristic": "Thermal Extremes",
      "description": "+120C to -180C swings within minutes (orbital). +127C to -173C (lunar surface).",
      "dataChallenge": "Thermal expansion affects calibration. Data must account for thermally-induced dimensional changes."
    }
  ],
  "commonTasks": [
    {
      "task": "Satellite Proximity Operations and Docking",
      "description": "Autonomous approach, inspection, and docking with cooperative or non-cooperative targets.",
      "dataRequirements": "Imagery under all sun angles, relative pose ground truth, approach trajectories with plume constraints."
    },
    {
      "task": "Planetary Surface Navigation",
      "description": "Autonomous rover traversal across rocky, sandy, and sloped terrain on Moon/Mars.",
      "dataRequirements": "Stereo terrain imagery with traversability annotations, wheel-terrain interaction, hazard detection."
    },
    {
      "task": "In-Orbit Manipulation and Assembly",
      "description": "Robotic arms capturing, manipulating, and assembling structures in microgravity.",
      "dataRequirements": "Microgravity analogue trajectories, grapple force-torque, free-floating object tracking."
    },
    {
      "task": "Space Debris Inspection and Removal",
      "description": "Approaching, characterizing, and capturing tumbling debris objects.",
      "dataRequirements": "Tumble state estimation from monocular imagery, surface material classification, capture trajectory planning."
    },
    {
      "task": "Extraterrestrial Sample Collection",
      "description": "Robotic drills and arms collecting soil, rock, and atmospheric samples.",
      "dataRequirements": "Drill force-penetration data, sample tube manipulation, visual rock classification for science targeting."
    }
  ],
  "relevantModalities": [
    "Radiation-hardened RGB (1-5 MP, global shutter)",
    "Stereo camera pairs",
    "LiDAR (proximity operations)",
    "Star tracker / sun sensor",
    "Force/torque (radiation-tolerant)",
    "IMU (inertial navigation)",
    "Wheel current sensors (rovers)",
    "Spectrometer (science targeting)"
  ],
  "keyPapers": [
    {
      "id": "flores-abad-space-servicing-2014",
      "title": "A Review of Space Robotics Technologies for On-Orbit Servicing",
      "authors": "Flores-Abad et al.",
      "venue": "Progress in Aerospace Sciences 2014",
      "year": 2014,
      "url": "https://doi.org/10.1016/j.paerosci.2014.03.002"
    },
    {
      "id": "nesnas-autonav-2021",
      "title": "Autonomous Navigation for Mars Surface Exploration",
      "authors": "Nesnas et al.",
      "venue": "IEEE Aerospace Conference 2021",
      "year": 2021,
      "url": "https://doi.org/10.1109/AERO50100.2021.9438374"
    },
    {
      "id": "opromolla-pose-estimation-2017",
      "title": "A Review of Cooperative and Uncooperative Spacecraft Pose Determination Techniques",
      "authors": "Opromolla et al.",
      "venue": "Progress in Aerospace Sciences 2017",
      "year": 2017,
      "url": "https://doi.org/10.1016/j.paerosci.2017.07.001"
    },
    {
      "id": "park-speed-2022",
      "title": "SPEED+: Next-Generation Dataset for Spacecraft Pose Estimation across Domain Gap",
      "authors": "Park et al.",
      "venue": "IEEE Aerospace Conference 2022",
      "year": 2022,
      "url": "https://arxiv.org/abs/2110.03101"
    },
    {
      "id": "matthies-terrain-2007",
      "title": "Computer Vision on Mars",
      "authors": "Matthies et al.",
      "venue": "International Journal of Computer Vision 2007",
      "year": 2007,
      "url": "https://doi.org/10.1007/s11263-007-0046-z"
    }
  ],
  "claruRelevance": "Claru serves space robotics through analogue environment data collection, expert annotation of synthetic imagery, and teleoperation demonstrations on ground testbeds. We maintain ITAR-compliant data handling infrastructure for export-controlled projects. Our deliverables include planetary terrain datasets from analogue sites, annotated rendered imagery for orbital proximity operations, and manipulation demonstrations with full NASA/ESA traceability documentation."
};

export default data;
