import type { IndustryPageData } from "./types";

const data: IndustryPageData = {
  "slug": "mining-robotics",
  "metaTitle": "Mining Robotics Training Data | Claru",
  "metaDescription": "Training data for mining robots: autonomous hauling, tunnel inspection, drilling automation, and safety monitoring in underground and surface mines.",
  "primaryKeyword": "mining robotics training data",
  "secondaryKeywords": [
    "mining robotics data",
    "autonomous haul truck data",
    "underground mining robot AI",
    "mine inspection robot datasets",
    "autonomous drilling data",
    "mining safety AI data"
  ],
  "canonicalPath": "/industries/mining-robotics",
  "h1": "Mining Robotics Training Data",
  "heroSubtitle": "Training data for mining robots: autonomous hauling, tunnel inspection, drilling automation, and safety monitoring in underground and surface mines. Built for the extreme environmental conditions, MSHA safety requirements, and GPS-denied operations that define mining robotics.",
  "breadcrumbs": [
    { "label": "Home", "href": "/" },
    { "label": "Industries", "href": "/industries" },
    { "label": "Mining Robotics", "href": "/industries/mining-robotics" }
  ],
  "sections": [
    {
      "type": "prose",
      "heading": "Why Mining Robotics Data Is Uniquely Extreme",
      "paragraphs": [
        "Mining is one of the most dangerous industries on Earth. The International Labour Organization estimates that mining accounts for 8% of fatal workplace accidents globally despite employing only 1% of the workforce. Autonomous robotics offers a path to remove humans from the most hazardous mining tasks: operating haul trucks on pit benches, inspecting unstable tunnel roofs, drilling blast patterns, and entering confined spaces after blasting. But training these systems requires data from the actual operating environments -- and mining environments are among the harshest on the planet.",
        "The autonomous mining market is growing rapidly, projected to reach $5.4 billion by 2030. Caterpillar has deployed over 650 autonomous haul trucks across mines in Australia, North and South America, which have collectively moved over 5 billion tonnes of material. Komatsu's FrontRunner autonomous haulage system operates at major mines including Rio Tinto's Pilbara iron ore operations. Sandvik's AutoMine system runs underground load-haul-dump (LHD) vehicles in mines on every continent. Each of these systems requires massive training datasets from the specific mine environments where they operate.",
        "Mining environments change continuously. Open-pit mines reshape terrain daily as benches are excavated and dumps grow. Underground mines advance faces, install ground support, and reconfigure ventilation. Dust from blasting, vehicle traffic, and crushing operations reduces visibility to near-zero for hours at a time. Water ingress creates mud that changes road surface traction. Lighting underground ranges from pitch darkness to intense headlamp glare. No static dataset captures the dynamic reality of an active mine.",
        "Regulatory oversight is intense. In the US, the Mine Safety and Health Administration (MSHA) under 30 CFR governs all aspects of mine safety including autonomous equipment. Australia's state mine safety regulators (NSW Resources Regulator, Queensland Mines Inspectorate) have developed specific frameworks for autonomous mining equipment. The International Council on Mining and Metals (ICMM) has published autonomous equipment safety principles. Training data must support compliance with these frameworks by documenting the safety scenarios autonomous systems must handle."
      ]
    },
    {
      "type": "cards",
      "heading": "Regulatory Requirements",
      "cards": [
        {
          "title": "MSHA 30 CFR (US)",
          "description": "Mine Safety and Health Administration regulations governing all US mines. Part 56/57 covers surface and underground metal/nonmetal mines; Part 75/77 covers coal mines. Autonomous equipment must meet MSHA proximity detection requirements for all personnel and equipment types. Training data must include detection scenarios for miners on foot, light vehicles, heavy equipment, and the distinctive PPE worn in mines (reflective strips, cap lamps, self-rescuers)."
        },
        {
          "title": "ISO 17757 (International)",
          "description": "Earth-moving machinery safety for autonomous and semi-autonomous systems, widely referenced in mining. Requires training data covering the full operational design domain: slope stability limits (haul roads at 8-12% grade, pit walls at 45-70 degrees), edge-of-bench detection, adverse weather conditions, and communication-loss scenarios. Data must validate both autonomous operation and emergency stop response."
        },
        {
          "title": "NSW MDG-2007 / Queensland QGN-15 (Australia)",
          "description": "Australian state guidelines for autonomous mining equipment, among the most detailed globally due to Australia's leadership in autonomous mining deployment. Require documented hazard analysis for all autonomous operation scenarios, including interaction with manned equipment, pedestrians, and wildlife. Training data must demonstrate system performance across all identified hazard scenarios with documented gap analysis."
        },
        {
          "title": "ICMM Innovation for Cleaner, Safer Vehicles (International)",
          "description": "International Council on Mining and Metals principles for autonomous vehicles in mining. Emphasizes interoperability between different OEM autonomous systems operating in the same mine. Training data for multi-OEM autonomous fleets must cover mixed-traffic scenarios where Caterpillar, Komatsu, Hitachi, and Liebherr autonomous trucks share haul roads with manned vehicles."
        },
        {
          "title": "OSHA / MSHA Proximity Detection (US)",
          "description": "MSHA requires proximity detection and collision avoidance systems on mining equipment. Training data must cover detection at specified distances for different target types: personnel at 50+ feet, light vehicles at 100+ feet, and heavy equipment at 200+ feet. Data must include the challenging detection conditions specific to mines: dust-obscured targets, targets behind berms, and targets in radar shadow zones."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Environment Characteristics",
      "cards": [
        {
          "title": "Extreme Dust and Reduced Visibility",
          "description": "Blasting generates dust clouds that reduce visibility to under 10 meters for hours. Haul truck traffic on unpaved roads creates continuous dust. Crushing and screening operations generate fine particulate. Data challenge: Vision-based perception is severely degraded. Training data must include every dust-density level from clear to near-zero-visibility, and models must learn to use radar and LiDAR when cameras are blind."
        },
        {
          "title": "GPS-Denied Underground Environments",
          "description": "Underground mines have no GPS coverage. Tunnels are narrow (4-6m wide for single-lane), dark, and irregularly shaped with rough walls. Ground support (bolts, mesh, shotcrete) changes wall appearance. Data challenge: Navigation relies on LiDAR SLAM, wheel odometry, and fixed reference points. Training data must include the full range of tunnel profiles, ground support types, and the gradual changes as mining advances."
        },
        {
          "title": "Continuously Changing Terrain",
          "description": "Open-pit benches change daily. Underground faces advance 3-5 meters per blast. Dump surfaces shift as material is deposited. Road surfaces degrade between grading cycles. Data challenge: Maps expire rapidly. Training data must include time-series terrain captures showing the evolution of mine geometry, enabling models that handle non-stationary environments."
        },
        {
          "title": "Extreme Grades and Unstable Edges",
          "description": "Haul roads climb 8-12% grades. Pit walls stand at 45-70 degrees. Bench edges with 30+ meter drops lack guardrails. Dump edges are inherently unstable. Data challenge: Precise edge detection is safety-critical. Training data must include edge scenarios under all visibility conditions, with ground truth from survey-grade measurements."
        },
        {
          "title": "Wide Temperature and Altitude Range",
          "description": "Mines operate from -40C (Canadian Arctic, Siberia) to +50C (Australian outback, Chilean desert). Altitude ranges from sea level to 5,000+ meters (Andean copper mines). Data challenge: Sensor performance varies with temperature and altitude. Engine power and braking performance change with altitude, affecting vehicle dynamics that models must predict."
        },
        {
          "title": "Mixed Autonomous and Manned Traffic",
          "description": "Most mines operate mixed fleets where autonomous haul trucks share roads with manned light vehicles, water trucks, graders, and personnel carriers. Data challenge: Detection and behavior prediction for manned vehicles is critical, as human drivers may not follow the precise rules that autonomous vehicles expect."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Common Robotics Tasks",
      "cards": [
        {
          "title": "Autonomous Haulage",
          "description": "Self-driving haul trucks (200-400 ton class) moving ore and waste between load points, dump locations, and crushers. Data requirements: GPS-RTK positioning (surface), LiDAR-SLAM (underground), terrain traversability for unpaved roads, edge detection at bench and dump boundaries, traffic management data for multi-truck operations, and loading/dumping interaction with manned excavators."
        },
        {
          "title": "Autonomous Drilling",
          "description": "Robotic drill rigs executing blast pattern drilling with centimeter-level accuracy. Data requirements: Drill pattern GPS coordinates, rock hardness feedback from drill performance data, hole quality measurements, ground condition assessment from drill cuttings analysis, and safety exclusion zone monitoring during drilling operations."
        },
        {
          "title": "Underground Tunnel Inspection",
          "description": "Robots inspecting tunnel walls, roof, and ground support for stability, water ingress, and ventilation integrity. Data requirements: LiDAR scans of tunnel profiles with ground support annotations (bolt pattern, mesh condition, shotcrete thickness), convergence measurement data, water inflow mapping, and comparison with as-designed tunnel geometry."
        },
        {
          "title": "Ore Body Mapping and Grade Control",
          "description": "Autonomous sampling and geological mapping of ore bodies to optimize extraction. Data requirements: Hyperspectral and multispectral imagery of exposed rock faces, drill core imagery with mineralogical annotations, grade estimation data correlated with assay results, and 3D geological models registered to mine coordinate systems."
        },
        {
          "title": "Proximity Detection and Collision Avoidance",
          "description": "Detecting personnel, vehicles, and equipment around autonomous machines. Data requirements: Multi-sensor (radar, LiDAR, camera, thermal) detection data covering all target types at MSHA-specified distances, in dust, rain, fog, darkness, and behind partial obstructions like berms and buildings."
        }
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Data Requirements by Robot Type in Mining",
      "description": "Mining robots range from 400-ton autonomous haul trucks to small inspection drones. Each operates under extreme conditions unique to mining.",
      "columns": ["Robot Type", "Primary Sensors", "Data Volume", "Key Annotations", "Operating Condition"],
      "rows": [
        {
          "Robot Type": "Autonomous Haul Truck (surface)",
          "Primary Sensors": "GPS-RTK, radar, LiDAR, RGB",
          "Data Volume": "100K+ km haul logs",
          "Key Annotations": "Road edge, grade, traffic, load state",
          "Operating Condition": "Dust, rain, -40C to +50C"
        },
        {
          "Robot Type": "Underground LHD/Truck",
          "Primary Sensors": "LiDAR, radar, proximity, IMU",
          "Data Volume": "50K+ hours underground",
          "Key Annotations": "Tunnel profile, traffic, ground support",
          "Operating Condition": "No GPS, no light, dust, water"
        },
        {
          "Robot Type": "Autonomous Drill Rig",
          "Primary Sensors": "GPS-RTK, drill feedback, LiDAR",
          "Data Volume": "100K+ drill holes",
          "Key Annotations": "Rock hardness, hole quality, exclusion zone",
          "Operating Condition": "Dust, vibration, grade"
        },
        {
          "Robot Type": "Inspection Drone (underground)",
          "Primary Sensors": "LiDAR, RGB (active light), thermal",
          "Data Volume": "5K+ tunnel inspections",
          "Key Annotations": "Ground support condition, convergence, water",
          "Operating Condition": "No GPS, no light, confined"
        },
        {
          "Robot Type": "Survey Drone (surface)",
          "Primary Sensors": "RGB, LiDAR, multispectral",
          "Data Volume": "10K+ survey flights",
          "Key Annotations": "Terrain model, stockpile volume, edge detection",
          "Operating Condition": "Wind, dust, altitude"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Real-World Deployments",
      "paragraphs": [
        "Caterpillar's MineStar Command autonomous haulage system operates over 650 trucks across mines in Australia, North America, and South America. At BHP's Jimblebar iron ore mine in Western Australia, over 50 autonomous Cat 793F trucks (230 tons each) operate 24/7 with zero lost-time injuries from autonomous haulage since deployment. The training data challenge is that each mine has unique road geometry, dust conditions, and weather patterns, requiring site-specific perception tuning on top of the base autonomous model.",
        "Komatsu's FrontRunner AHS (Autonomous Haulage System) runs at Rio Tinto's Pilbara operations and Codelco's Gabriela Mistral copper mine in Chile. FrontRunner trucks operate alongside manned vehicles, requiring sophisticated mixed-traffic management. The system has hauled over 5 billion tonnes of material. Training data must cover the interaction patterns between autonomous trucks and manned equipment, including excavator loading sequences where the truck must position precisely in the loading zone.",
        "Sandvik's AutoMine operates underground in over 60 mines worldwide, controlling LHD loaders and trucks autonomously in tunnels where no GPS is available. The system relies on LiDAR SLAM and reference point navigation. Sandvik's OptiMine platform adds teleoperation capability for tasks that remain too complex for full autonomy. Training data for underground systems must capture the extreme visual homogeneity of tunnel environments -- where every stretch of shotcreted wall looks similar -- while enabling precise localization.",
        "Exyn Technologies deploys autonomous drones for underground mine inspection and mapping. Their drones navigate without GPS using LiDAR SLAM and can map an entire stope (underground cavity) in minutes, a task that previously required hours of survey work and exposed humans to unstable roof conditions. Training data for underground drones must handle complete darkness, dust after blasting, and the complex 3D geometries of stopes, raises, and ore passes.",
        "Hard-Line's TeleOp and Assist systems enable teleoperation and semi-autonomous control of underground mining equipment from surface control rooms, eliminating the need for operators underground during blasting and development cycles. The training data challenge is latency-tolerant manipulation: operators control equipment over communication links with 50-500ms latency, and AI assist systems must predict operator intent to compensate for delay."
      ]
    },
    {
      "type": "prose",
      "heading": "Relevant Data Modalities",
      "paragraphs": [
        "Mining robotics requires sensors hardened for extreme conditions. Core modalities include radar (dust-penetrating, primary perception in reduced visibility), LiDAR (3D mapping, used in both surface and underground), GPS-RTK (centimeter positioning on surface), industrial RGB cameras (in dust-sealed housings), thermal cameras (personnel detection in darkness and dust), proximity sensors (radar and magnetic field for close-range detection), IMU (for dead reckoning during GPS outages), and drill performance sensors (bit force, rotary torque, penetration rate) for autonomous drilling.",
        "Radar is the most critical sensing modality in mining because it penetrates dust and precipitation that blind cameras and degrade LiDAR. Mining-specific radar systems operate at 77-79 GHz and must detect personnel at ranges exceeding 50 meters in dense dust. Training data must include radar returns under all dust-density levels with corresponding ground truth from clear-weather captures, enabling models to maintain detection performance as conditions degrade.",
        "Underground mining introduces unique modalities: ground-penetrating radar for geological assessment, seismic sensors for rock stability monitoring, atmospheric sensors (methane, CO, O2, dust concentration), and barometric altimeters for multi-level navigation. Training data for underground systems must include these environmental monitoring modalities alongside navigation data, enabling robots that can detect deteriorating ground conditions and unsafe atmospheres before they become hazards."
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "marshall-mining-robots-2016",
          "title": "Robotics in Mining",
          "authors": "Marshall et al.",
          "venue": "Springer Handbook of Robotics 2016",
          "year": 2016,
          "url": "https://doi.org/10.1007/978-3-319-32552-1_59"
        },
        {
          "id": "dadhich-mining-automation-2016",
          "title": "Key Challenges in Automation of Earth-Moving Machines",
          "authors": "Dadhich et al.",
          "venue": "Automation in Construction 2016",
          "year": 2016,
          "url": "https://doi.org/10.1016/j.autcon.2016.05.009"
        },
        {
          "id": "zlot-underground-mapping-2014",
          "title": "Efficiently Capturing Large, Complex Cultural Heritage Sites with a Handheld Mobile 3D Laser Mapping System",
          "authors": "Zlot et al.",
          "venue": "Journal of Cultural Heritage 2014",
          "year": 2014,
          "url": "https://doi.org/10.1016/j.culher.2013.11.009"
        },
        {
          "id": "schunnesson-drill-monitoring-1998",
          "title": "Rock Characterisation Using Percussive Drilling",
          "authors": "Schunnesson",
          "venue": "International Journal of Rock Mechanics and Mining Sciences 1998",
          "year": 1998,
          "url": "https://doi.org/10.1016/S0148-9062(97)00332-X"
        },
        {
          "id": "rogers-mining-autonomy-2019",
          "title": "The Future of Autonomous Mining",
          "authors": "Rogers et al.",
          "venue": "CIM Journal 2019",
          "year": 2019,
          "url": "https://doi.org/10.1080/19236026.2019.1645215"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Serves Mining Robotics",
      "paragraphs": [
        "Claru collects training data at active mine sites with collectors who hold MSHA Part 46/48 surface mine training certifications (or international equivalents) and site-specific safety inductions. Our collection equipment is rated for dusty, wet, and temperature-extreme environments with sealed housings, ruggedized mounts, and battery systems rated for -40C to +55C operation.",
        "Our annotation pipeline includes mining-specific protocols: road edge and bench boundary detection with survey-grade ground truth, personnel detection across the full range of mining PPE (hard hats, reflective vests, cap lamps, self-rescuers, hearing protection), ground support condition assessment per Q-system or RMR classification, and dust-degraded sensor data labeling that documents visibility conditions for each capture. We deliver site-specific datasets that capture the unique geometry, terrain, and traffic patterns of each mine.",
        "For autonomous haulage systems, we provide multi-condition road network data covering dry, wet, icy, and freshly graded surfaces with labeled traction characteristics. For underground systems, we deliver LiDAR-registered tunnel datasets with ground support annotations, convergence measurements, and atmospheric monitoring data. All mining data includes the provenance documentation and hazard scenario coverage analysis required for MSHA compliance and Australian mine safety regulator submissions."
      ]
    }
  ],
  "faqs": [
    {
      "question": "Can Claru collect data at active mining sites?",
      "answer": "Yes. Our collectors hold MSHA Part 46 (surface) or Part 48 (underground) certifications for US mines, and equivalent certifications for international mines. All collectors complete the mine's site-specific safety induction before accessing the operation. We coordinate collection campaigns with the mine's safety department and dispatch office to ensure our activities do not interfere with production or create safety conflicts. Collection equipment is inspected for compliance with mine standards including high-visibility markings, two-way radio, and emergency response equipment. For underground collection, our personnel carry self-rescuers and complete emergency egress training."
    },
    {
      "question": "How does Claru handle the extreme dust conditions in mining?",
      "answer": "Dust is the defining sensor challenge in mining, and our collection methodology specifically addresses it. We capture data across the full dust-density spectrum, from clear conditions to near-zero visibility during and after blasting. Each capture is annotated with visibility-distance estimates and dust-density classifications. For optical sensors (cameras, LiDAR), we document lens and window fouling over time, providing degradation-curve data that trains models to compensate for progressive sensor contamination. Our equipment uses sealed housings with automatic lens cleaning systems, and we collect parallel radar data that penetrates dust, providing ground-truth references for training multi-modal fusion models that fall back to radar when optical sensors are blind."
    },
    {
      "question": "Does Claru provide underground mining training data?",
      "answer": "Yes. Our underground datasets include LiDAR scans of tunnel profiles across multiple ground support configurations (pattern bolting, mesh and shotcrete, steel sets, cable bolts), navigation data collected without GPS using LiDAR SLAM with surveyed control points for ground truth, atmospheric monitoring data (methane, CO, O2, dust), and multi-level navigation trajectories through declines, ramps, and level access drives. The extreme visual homogeneity of underground environments -- where shotcreted walls look similar everywhere -- makes localization particularly challenging, and our datasets include the reference-point and feature-based landmarks that underground navigation systems use for localization."
    },
    {
      "question": "What personnel detection scenarios does Claru's mining dataset cover?",
      "answer": "Mining personnel detection is safety-critical and must work at MSHA-specified distances across all conditions. Our datasets include detection scenarios at ranges from 5 meters to 200+ meters, covering personnel on foot (wearing full mining PPE including hard hat, reflective vest, cap lamp, and self-rescuer), personnel in light vehicles, and personnel partially obscured by berms, equipment, or structures. We capture in all visibility conditions: clear, moderate dust, heavy dust, rain, fog, darkness, and dawn/dusk glare. Each scenario is annotated with target type, range, visibility condition, and detection ground truth from multi-sensor fusion. We include the challenging false-positive scenarios specific to mining: reflective road signs, equipment strobe lights, and wildlife."
    },
    {
      "question": "How does Claru handle the continuously changing terrain in mining?",
      "answer": "Mining environments change daily, making static datasets rapidly obsolete. Claru addresses this through longitudinal collection campaigns where we capture the same mine areas at regular intervals -- typically weekly for active haul roads and monthly for pit geometry. This produces time-series terrain data showing road condition evolution between grading cycles, bench advancement from excavation, dump surface changes as material is deposited, and stockpile growth and depletion. Each capture is registered to the mine coordinate system using survey control points, enabling precise change detection. This temporal data trains models that adapt to terrain changes rather than memorizing a fixed mine layout."
    }
  ],
  "ctaHeading": "Discuss Mining Robotics Data Needs",
  "ctaDescription": "Tell us about your mining robotics project -- whether it is autonomous haulage, underground navigation, drill automation, or mine inspection. Claru will scope a site-specific data collection plan with MSHA-compliant safety protocols.",
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
      "name": "MSHA 30 CFR Parts 56/57/75/77",
      "jurisdiction": "US",
      "description": "Mine Safety and Health Administration regulations for surface and underground mines.",
      "dataImplications": "Proximity detection at MSHA-specified distances for all personnel and equipment types in all visibility conditions."
    },
    {
      "name": "ISO 17757",
      "jurisdiction": "International",
      "description": "Earth-moving machinery safety for autonomous/semi-autonomous systems.",
      "dataImplications": "Full ODD coverage: slope stability, edge detection, adverse weather, communication-loss scenarios."
    },
    {
      "name": "NSW MDG-2007 / QLD QGN-15",
      "jurisdiction": "Australia",
      "description": "Australian state guidelines for autonomous mining equipment.",
      "dataImplications": "Documented hazard analysis for all autonomous scenarios with performance data across identified hazards."
    },
    {
      "name": "ICMM Autonomous Vehicle Principles",
      "jurisdiction": "International",
      "description": "International Council on Mining and Metals autonomous vehicle safety principles.",
      "dataImplications": "Multi-OEM interoperability data for mixed autonomous fleet operations."
    },
    {
      "name": "MSHA Proximity Detection Requirements",
      "jurisdiction": "US",
      "description": "Mandatory collision avoidance systems on mining equipment.",
      "dataImplications": "Detection data at 50+ ft (personnel), 100+ ft (light vehicles), 200+ ft (heavy equipment) in dust/rain/dark."
    }
  ],
  "environmentCharacteristics": [
    {
      "characteristic": "Extreme Dust / Reduced Visibility",
      "description": "Blasting, traffic, and crushing create dust that reduces visibility to under 10m.",
      "dataChallenge": "Vision degraded for hours. Radar becomes primary. Data must cover full dust-density spectrum."
    },
    {
      "characteristic": "GPS-Denied Underground",
      "description": "No GPS. Narrow tunnels (4-6m), complete darkness, rough irregular walls.",
      "dataChallenge": "LiDAR SLAM, wheel odometry, and reference-point navigation. Visual homogeneity makes localization hard."
    },
    {
      "characteristic": "Continuously Changing Terrain",
      "description": "Open-pit benches change daily. Underground faces advance 3-5m per blast.",
      "dataChallenge": "Maps expire rapidly. Time-series terrain captures needed for non-stationary environment models."
    },
    {
      "characteristic": "Extreme Grades and Unstable Edges",
      "description": "8-12% road grades, 45-70 degree pit walls, 30m+ bench drops without guardrails.",
      "dataChallenge": "Edge detection is safety-critical. Ground truth from survey measurements across all visibility conditions."
    },
    {
      "characteristic": "Extreme Temperature and Altitude",
      "description": "Operations from -40C (Arctic) to +50C (desert). Altitude up to 5,000m (Andean mines).",
      "dataChallenge": "Sensor performance varies. Vehicle dynamics change with altitude. Data must cover the full operating envelope."
    },
    {
      "characteristic": "Mixed Autonomous/Manned Traffic",
      "description": "Autonomous trucks share roads with manned vehicles, graders, and personnel carriers.",
      "dataChallenge": "Detection and behavior prediction for human-driven vehicles that may not follow autonomous traffic rules."
    }
  ],
  "commonTasks": [
    {
      "task": "Autonomous Haulage",
      "description": "Self-driving 200-400 ton haul trucks on mine roads between load, dump, and crusher.",
      "dataRequirements": "GPS-RTK positioning, terrain traversability, edge detection, traffic management, loading/dumping interaction."
    },
    {
      "task": "Autonomous Drilling",
      "description": "Robotic drill rigs executing blast patterns with centimeter accuracy.",
      "dataRequirements": "Drill pattern coordinates, rock hardness feedback, hole quality, exclusion zone monitoring."
    },
    {
      "task": "Underground Tunnel Inspection",
      "description": "Robot inspection of tunnel walls, roof, and ground support stability.",
      "dataRequirements": "LiDAR tunnel profiles, ground support annotations (bolt, mesh, shotcrete), convergence, water inflow mapping."
    },
    {
      "task": "Ore Body Mapping",
      "description": "Autonomous geological sampling and grade estimation.",
      "dataRequirements": "Hyperspectral rock face imagery, drill core mineralogy, grade data correlated with assays."
    },
    {
      "task": "Proximity Detection / Collision Avoidance",
      "description": "Detecting personnel, vehicles, and equipment around autonomous machines.",
      "dataRequirements": "Multi-sensor detection at MSHA distances in dust, rain, fog, darkness, and behind obstructions."
    }
  ],
  "relevantModalities": [
    "Radar (77-79 GHz, dust-penetrating)",
    "LiDAR (3D mapping, SLAM underground)",
    "GPS-RTK (surface positioning)",
    "RGB (dust-sealed housing)",
    "Thermal (personnel detection)",
    "Proximity (radar, magnetic field)",
    "IMU (dead reckoning)",
    "Drill performance sensors (force, torque, rate)",
    "Atmospheric (methane, CO, O2, dust)"
  ],
  "keyPapers": [
    {
      "id": "marshall-mining-robots-2016",
      "title": "Robotics in Mining",
      "authors": "Marshall et al.",
      "venue": "Springer Handbook of Robotics 2016",
      "year": 2016,
      "url": "https://doi.org/10.1007/978-3-319-32552-1_59"
    },
    {
      "id": "dadhich-mining-automation-2016",
      "title": "Key Challenges in Automation of Earth-Moving Machines",
      "authors": "Dadhich et al.",
      "venue": "Automation in Construction 2016",
      "year": 2016,
      "url": "https://doi.org/10.1016/j.autcon.2016.05.009"
    },
    {
      "id": "zlot-underground-mapping-2014",
      "title": "3D Mapping for Underground Mine Applications",
      "authors": "Zlot and Bosse",
      "venue": "Journal of Field Robotics 2014",
      "year": 2014,
      "url": "https://doi.org/10.1002/rob.21481"
    },
    {
      "id": "schunnesson-drill-monitoring-1998",
      "title": "Rock Characterisation Using Percussive Drilling",
      "authors": "Schunnesson",
      "venue": "International Journal of Rock Mechanics and Mining Sciences 1998",
      "year": 1998,
      "url": "https://doi.org/10.1016/S0148-9062(97)00332-X"
    },
    {
      "id": "rogers-mining-autonomy-2019",
      "title": "The Future of Autonomous Mining",
      "authors": "Rogers et al.",
      "venue": "CIM Journal 2019",
      "year": 2019,
      "url": "https://doi.org/10.1080/19236026.2019.1645215"
    }
  ],
  "claruRelevance": "Claru collects at active mine sites with MSHA-certified collectors, ruggedized equipment rated for -40C to +55C, and mine-specific annotation protocols. We deliver site-specific datasets covering autonomous haulage roads, underground tunnel profiles, proximity detection scenarios across all visibility conditions, and longitudinal terrain data showing mine geometry evolution. All data includes the provenance documentation and hazard scenario coverage analysis required for MSHA and Australian mine safety regulator submissions."
};

export default data;
