import type { IndustryPageData } from "./types";

const data: IndustryPageData = {
  "slug": "food-service-robotics",
  "metaTitle": "Food Service Robotics Training Data | Claru",
  "metaDescription": "Training data for food service robots: cooking automation, food delivery, restaurant operations, and commercial kitchen management with FDA and HACCP compliance.",
  "primaryKeyword": "food service robotics training data",
  "secondaryKeywords": [
    "food service robotics data",
    "restaurant robot AI data",
    "cooking automation datasets",
    "food delivery robot data",
    "kitchen robot training data",
    "food safety AI data"
  ],
  "canonicalPath": "/industries/food-service-robotics",
  "h1": "Food Service Robotics Training Data",
  "heroSubtitle": "Training data for food service robots: cooking automation, food delivery, restaurant operations, and commercial kitchen management. Built for FDA FSMA, HACCP, and food safety requirements that govern every interaction between robots and consumable products.",
  "breadcrumbs": [
    { "label": "Home", "href": "/" },
    { "label": "Industries", "href": "/industries" },
    { "label": "Food Service Robotics", "href": "/industries/food-service-robotics" }
  ],
  "sections": [
    {
      "type": "prose",
      "heading": "Why Food Service Robotics Data Must Be Food-Safe",
      "paragraphs": [
        "Food service robots face a regulatory burden that most robotics sectors avoid: every surface the robot touches, every action it takes near food, and every environment it operates in must comply with food safety regulations. The FDA Food Safety Modernization Act (FSMA) requires preventive controls for food handling. HACCP (Hazard Analysis Critical Control Points) mandates documented monitoring of critical control points like temperature, cross-contamination, and allergen separation. A robot that flips burgers must not only manipulate food correctly -- it must do so in a way that satisfies a health inspector.",
        "The food service labor shortage is driving rapid adoption. The National Restaurant Association estimates the US restaurant industry is short over 500,000 workers, with turnover rates exceeding 75% annually. The global food service robotics market reached $1.6 billion in 2024 and is projected to exceed $5 billion by 2030. Companies like Miso Robotics (Flippy), Bear Robotics (Servi), Picnic Works, Sweetgreen (Infinite Kitchen), and Dexai Robotics deploy robots for cooking, delivery, assembly, and front-of-house service. Each of these systems needs training data captured in real commercial kitchens and dining rooms, not in lab environments that lack the steam, grease, heat, and chaos of an active restaurant.",
        "The physical environment in commercial kitchens is uniquely hostile to sensors. Temperatures near cooking stations exceed 50C ambient. Steam from dishwashers and fryers causes lens fog within minutes. Grease particles coat surfaces and aerosolize into the air. Floors are wet and slippery from constant cleaning. Lighting ranges from bright prep areas to dim dining rooms. Training data must capture all of these conditions to produce robust perception models that survive their first shift in a real kitchen.",
        "Food service also uniquely requires social intelligence in robot behavior. A delivery robot in a dining room is not navigating a warehouse -- it is moving through an intimate social space where guests expect quiet, non-intrusive service. Training data must capture the social norms of dining: not passing between conversing diners, yielding to staff carrying hot plates, and approaching tables at appropriate angles. This social navigation data does not exist in any public robotics dataset."
      ]
    },
    {
      "type": "cards",
      "heading": "Regulatory Requirements",
      "cards": [
        {
          "title": "FDA FSMA (US)",
          "description": "Food Safety Modernization Act requiring preventive controls for food facilities. Robots handling food must be trained on contamination prevention protocols. Training data must include scenarios demonstrating proper food handling: temperature compliance, hand-washing station interactions, sanitizer application, and allergen separation procedures. Data documentation must support FSMA preventive controls verification under 21 CFR Part 117."
        },
        {
          "title": "HACCP (International)",
          "description": "Hazard Analysis Critical Control Points system for food safety. Training data must capture all seven HACCP principles as they apply to robotic food handling: hazard analysis scenarios, critical control point monitoring (time-temperature abuse, cross-contamination), critical limits, monitoring procedures, corrective actions, verification, and record-keeping. Each robot action touching food is a potential CCP that must be documented."
        },
        {
          "title": "FDA 21 CFR 110/117 (US)",
          "description": "Current Good Manufacturing Practice (cGMP) for food facilities. Robot design and training must comply with sanitary design principles: food-contact surfaces must be smooth, non-porous, and cleanable per 3-A Sanitary Standards. Training data must include cleaning-in-place (CIP) procedures, sanitation verification captures, and allergen cleaning validation sequences showing effectiveness of wash-rinse-sanitize protocols."
        },
        {
          "title": "EU Regulation 852/2004 (EU)",
          "description": "Hygiene of foodstuffs regulation. Robots in EU food service must comply with HACCP-based food safety management. Training data must demonstrate temperature monitoring (cold chain at 0-5C, hot holding above 63C), pest control awareness, and food handler hygiene equivalent behaviors. All food contact training must be documented for regulatory audit under EU food hygiene package requirements."
        },
        {
          "title": "NSF/ANSI Standards (International)",
          "description": "NSF/ANSI 2 (food equipment materials), NSF/ANSI 51 (food equipment materials), and NSF 169 (special purpose food equipment) govern the materials and design of food-contact robot components. Training data must verify that robot end-effectors interact only with NSF-certified surfaces during food manipulation, and cleaning verification data must demonstrate that robot components meet NSF sanitation standards after wash cycles."
        },
        {
          "title": "FDA Food Code (US)",
          "description": "Model food safety guidance adopted by state and local health departments. The Food Code specifies time-temperature requirements (danger zone 5-57C for 4-hour maximum), handwashing frequencies, and cross-contamination prevention protocols. Robot training data must cover all Food Code critical control scenarios to ensure automated food handling meets the same standards that human food handlers are tested against during health inspections."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Environment Characteristics",
      "cards": [
        {
          "title": "High Heat and Steam",
          "description": "Fryers at 175C, grills at 260C+, steam from dishwashers and boiling water. Ambient kitchen temperatures routinely exceed 40C during service. Data challenge: Thermal interference with depth sensors, lens fogging within 2-3 minutes of exposure to steam, and heat shimmer distorting visual perception near cooking surfaces. Training data must include these degraded-vision conditions."
        },
        {
          "title": "Wet and Greasy Surfaces",
          "description": "Kitchen floors are wet from dishwashing, spills, and mandatory cleaning. Grease accumulates on surfaces, sensors, and robot housings. Aerosolized grease deposits form a film on camera lenses. Data challenge: Slip detection and traction estimation for mobile robots, grip estimation for manipulation with greasy or wet food objects, and sensor maintenance protocols for grease-fouled cameras."
        },
        {
          "title": "Rapid Tempo and Tight Spaces",
          "description": "Commercial kitchens during rush hours have 10-15 workers moving rapidly in confined spaces (often under 500 sq ft for QSR, 800-1200 sq ft for full-service). Staff carry hot pans, sharp knives, and heavy trays. Data challenge: Robust human tracking in extremely dense, fast-moving crowds with uniform appearance (chef whites, aprons, hats). Collision avoidance at close range with humans carrying hazardous items."
        },
        {
          "title": "Food Item Visual Diversity",
          "description": "Foods are deformable, variable in appearance, and change continuously during cooking. A raw patty looks different from medium-rare which looks different from well-done. Lettuce wilts, cheese melts, sauces spread. Data challenge: Object recognition must handle continuous appearance change during cooking, ingredient variation across batches and suppliers, and plating aesthetics that vary by concept."
        },
        {
          "title": "Allergen and Contamination Zones",
          "description": "Kitchens maintain separation between allergen-free and allergen-present zones. The FDA Big 9 allergens (milk, eggs, fish, shellfish, tree nuts, peanuts, wheat, soybeans, sesame) require strict handling protocols. Data challenge: Spatial zone understanding, cross-contamination risk detection, utensil tracking to ensure allergen-free tools are not used in contaminated areas, and verification of sanitization between allergen changeovers."
        },
        {
          "title": "Variable Lighting Across Zones",
          "description": "Bright fluorescent lighting in prep areas (500+ lux), warm dim lighting in dining rooms (50-100 lux), and mixed natural/artificial light near windows and outdoor patios. Data challenge: Perception models must handle dramatic lighting transitions as robots move between kitchen and dining areas, including glare from stainless steel surfaces and color temperature shifts that affect food appearance assessment."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Common Robotics Tasks",
      "cards": [
        {
          "title": "Cooking and Food Preparation",
          "description": "Autonomous or semi-autonomous cooking: grilling, frying, wok tossing, assembly of bowls/salads/pizzas. Data requirements: Manipulation trajectories for food items (deformable, variable weight, temperature-sensitive), cooking-state classification time-series (raw/cooking/done/overcooked), temperature compliance monitoring via thermal camera, and portion-size measurement calibrated to recipe specifications."
        },
        {
          "title": "Food Delivery (In-Restaurant)",
          "description": "Robot waiters navigating dining rooms to deliver food from kitchen to table. Data requirements: Restaurant floor maps across layout configurations, dynamic obstacle avoidance around seated diners (including children, high chairs, purses on floor), tray stability during navigation over uneven thresholds, and social navigation patterns (not passing between conversing diners, yielding to staff carrying hot dishes)."
        },
        {
          "title": "Dishwashing and Sanitation",
          "description": "Automated dish handling, loading, and sanitation verification. Data requirements: Dish classification across 50+ item types (plates, bowls, glasses, utensils, pots, sheet pans), cleanliness verification imagery under UV fluorescence, rack-loading manipulation sequences optimized for wash coverage, and sanitizer concentration monitoring with chemical test strip verification."
        },
        {
          "title": "Inventory and Freshness Monitoring",
          "description": "Automated tracking of ingredient freshness, storage temperature, and stock levels in walk-in coolers and dry storage. Data requirements: Food freshness classification (fresh, near-expiry, expired) across produce, dairy, protein, and dry goods categories. FIFO compliance verification imagery. Cold-chain temperature logging with alert thresholds per ingredient type."
        },
        {
          "title": "Last-Mile Food Delivery",
          "description": "Sidewalk robots and drones delivering food orders from restaurant to customer. Data requirements: Sidewalk navigation data at robot height (~50cm) across urban, suburban, and campus environments. Pedestrian avoidance, food thermal maintenance monitoring, delivery handoff interaction recordings including doorbell, voice, and contactless drop patterns. Curb-to-door navigation across driveways, lawns, and apartment lobbies."
        },
        {
          "title": "Food Assembly Line Automation",
          "description": "High-speed assembly of standardized menu items (burritos, salad bowls, pizza, sandwiches) from ingredient bins. Data requirements: Ingredient identification across 50+ items per concept, portion weight measurement with sub-gram accuracy, allergen zone tracking per assembly station, and visual quality verification comparing finished product to brand standard images."
        }
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Data Requirements by Robot Type in Food Service",
      "description": "Food service robots range from stationary cooking arms to mobile delivery robots. Each type faces distinct food-safety and environmental challenges.",
      "columns": ["Robot Type", "Primary Sensors", "Data Volume", "Key Annotations", "Food Safety Concern"],
      "rows": [
        {
          "Robot Type": "Cooking Robot (stationary)",
          "Primary Sensors": "RGB, thermal, force/torque",
          "Data Volume": "50K+ cooking episodes",
          "Key Annotations": "Food state, temperature, portion size, timing",
          "Food Safety Concern": "Temperature abuse, cross-contamination"
        },
        {
          "Robot Type": "In-Restaurant Delivery",
          "Primary Sensors": "RGB-D, LiDAR, tray IMU",
          "Data Volume": "10K+ delivery runs",
          "Key Annotations": "Path, obstacles, tray stability, table ID",
          "Food Safety Concern": "Food exposure during transit"
        },
        {
          "Robot Type": "Food Assembly Line",
          "Primary Sensors": "RGB, weight scale, portion sensor",
          "Data Volume": "100K+ assembly sequences",
          "Key Annotations": "Ingredient ID, portion weight, allergen flag",
          "Food Safety Concern": "Allergen cross-contact, portion accuracy"
        },
        {
          "Robot Type": "Sidewalk Delivery Robot",
          "Primary Sensors": "RGB, LiDAR, GPS, thermal (food)",
          "Data Volume": "50K+ km sidewalk data",
          "Key Annotations": "Pedestrian, terrain, food temp, handoff",
          "Food Safety Concern": "Cold chain maintenance, tampering"
        },
        {
          "Robot Type": "Sanitation / Cleaning Robot",
          "Primary Sensors": "RGB, UV fluorescence, chemical sensor",
          "Data Volume": "10K+ sanitation cycles",
          "Key Annotations": "Cleanliness grade, residue detection, sanitizer level",
          "Food Safety Concern": "Verification of sanitization efficacy"
        },
        {
          "Robot Type": "Inventory Management Robot",
          "Primary Sensors": "RGB, barcode/RFID, temperature probe",
          "Data Volume": "50K+ inventory scans",
          "Key Annotations": "Item ID, expiry date, storage temp, FIFO compliance",
          "Food Safety Concern": "Expired product identification, cold chain breaks"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Real-World Deployments",
      "paragraphs": [
        "Miso Robotics deploys Flippy 2, an autonomous fry station robot, in White Castle, Jack in the Box, CaliBurger, and Panera Bread locations across the US. Flippy handles basket lowering, cook-time management, and basket retrieval without human intervention, processing up to 60 baskets per hour. The training data challenge is cooking-state recognition: determining when chicken tenders are golden-brown versus still pale, when fries are crispy versus limp, all under intense overhead heat lamps and splashing oil. Miso reports Flippy reduces cook time variability by 40% compared to human operators.",
        "Bear Robotics' Servi robot operates as an autonomous food runner in over 10,000 restaurants globally, including Chili's, Denny's, and dozens of Asian restaurant chains. The robot navigates from kitchen to table, avoiding diners, servers, children, and high chairs. Training data must capture the social navigation norms of dining rooms -- not just obstacle avoidance, but culturally appropriate behavior like not interrupting table conversations, approaching from the side rather than head-on, and yielding to staff carrying hot plates.",
        "Sweetgreen's Infinite Kitchen uses an automated assembly system to build salad bowls from ingredient bins with sub-30-second throughput per bowl. Each ingredient must be correctly identified, portioned by weight, and placed in the bowl in the right order. Allergen tracking is critical: if a customer orders nut-free, the system must verify zero cross-contact with nut-containing ingredients through dedicated utensils and sanitized prep surfaces. The training data must cover the full visual diversity of 50+ produce ingredients across freshness states, suppliers, and seasons.",
        "Starship Technologies operates over 2,000 sidewalk delivery robots across university campuses, suburban neighborhoods, and select urban areas, having completed over 7 million deliveries. Nuro has deployed autonomous last-mile delivery vehicles in Houston, Phoenix, and Mountain View for partners including Domino's, Walmart, and FedEx. These systems must navigate sidewalks, cross streets, avoid pedestrians, and maintain food temperature during transit. Training data spans outdoor environments with weather variation, while also including the unique last-50-feet challenge of navigating from curb to front door.",
        "Dexai Robotics deploys Alfred, a food assembly robot used in corporate cafeterias and university dining halls. Alfred uses a multi-finger gripper to pick individual food items and assemble meals per customer specifications. The training data challenge is grasping deformable food items: a cherry tomato requires different force than a crouton, and a piece of grilled chicken changes shape when lifted. Dexai's approach relies on real-world manipulation demonstrations captured in active cafeteria environments."
      ]
    },
    {
      "type": "prose",
      "heading": "Relevant Data Modalities",
      "paragraphs": [
        "Food service robotics uses a distinctive sensor mix driven by food safety requirements. Core modalities include RGB cameras in steam-resistant sealed housings (IP65+), thermal cameras for food and equipment temperature monitoring calibrated to FDA danger zone thresholds (5-57C), force-torque sensors for delicate food handling (grasping a tomato without crushing it requires sub-Newton resolution), weight scales for portion control (accuracy to 1 gram), depth sensors for bin picking and plating, and chemical sensors for sanitizer concentration monitoring (quaternary ammonia or chlorine levels).",
        "A unique modality in food service is temporal food-state tracking: time-lapse captures that show ingredient transformation during cooking, storage, and holding. Training data must include continuous sequences showing food going from fresh to spoiled, raw to cooked, and hot to cold -- enabling models that can assess food safety compliance at any point in the preparation timeline. This is not just about cooking completion detection; it includes identifying when held food has been in the danger zone too long and must be discarded.",
        "Audio data is increasingly relevant for kitchen robots. The sound of oil sizzling changes as food cooks, timers beep to indicate completion, staff call out orders verbally, and the sound of a properly functioning exhaust hood differs from a failing one. Acoustic monitoring can detect equipment anomalies (compressor failures in walk-in coolers, unusual dishwasher cycles) that affect food safety before they become visible problems."
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "ahn-saycan-2022",
          "title": "Do As I Can, Not As I Say: Grounding Language in Robotic Affordances",
          "authors": "Ahn et al.",
          "venue": "CoRL 2022",
          "year": 2022,
          "url": "https://arxiv.org/abs/2204.01691"
        },
        {
          "id": "liu-food-recognition-2022",
          "title": "A Survey on Food Recognition with Deep Learning",
          "authors": "Liu et al.",
          "venue": "IEEE Access 2022",
          "year": 2022,
          "url": "https://doi.org/10.1109/ACCESS.2022.3147950"
        },
        {
          "id": "yang-cooking-robot-2023",
          "title": "A Survey on Robotic Cooking: Current Research and Future Directions",
          "authors": "Yang et al.",
          "venue": "Frontiers in Robotics and AI 2023",
          "year": 2023,
          "url": "https://doi.org/10.3389/frobt.2023.1168553"
        },
        {
          "id": "zeng-transporter-2021",
          "title": "Transporter Networks: Rearranging the Visual World for Robotic Manipulation",
          "authors": "Zeng et al.",
          "venue": "CoRL 2021",
          "year": 2021,
          "url": "https://arxiv.org/abs/2010.14406"
        },
        {
          "id": "min-food-image-2023",
          "title": "Large Scale Visual Food Recognition",
          "authors": "Min et al.",
          "venue": "IEEE Transactions on Pattern Analysis and Machine Intelligence 2023",
          "year": 2023,
          "url": "https://doi.org/10.1109/TPAMI.2023.3237871"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Serves Food Service Robotics",
      "paragraphs": [
        "Claru collects training data in active commercial kitchens and dining rooms, capturing the real conditions of food service: steam, grease, heat, rush-hour congestion, and authentic food preparation sequences. Our collectors hold food handler certifications (ServSafe or equivalent) and follow facility-specific sanitation protocols during data capture, including proper handwashing, hair restraint, and glove usage.",
        "Our annotation pipeline includes food-service-specific protocols: cooking-state classification following standardized doneness scales with paired thermal verification, food safety compliance annotations (temperature abuse events, cross-contamination risks, allergen zone violations, time-in-danger-zone tracking), portion-size estimation calibrated to recipe specifications with per-ingredient gram-level accuracy, and cleanliness grading for sanitation verification using both visual and UV fluorescence imagery.",
        "Data is delivered with HACCP-aligned documentation enabling clients to demonstrate training data traceability for food safety audits. Each dataset includes CCP coverage maps showing which critical control points are represented in the training data, ingredient-level allergen metadata, and provenance trails linking every sample to collector identity, facility, timestamp, and annotation review chain. Our format delivery supports integration with restaurant POS and kitchen display systems for real-time operational pairing."
      ]
    }
  ],
  "faqs": [
    {
      "question": "Does Claru's data cover the full range of commercial kitchen environments?",
      "answer": "Yes. Our food service datasets span quick-service restaurant (QSR) kitchens, full-service restaurant kitchens, ghost kitchens (delivery-only), institutional cafeterias, hospital and university dining facilities, and food manufacturing assembly lines. Each environment type has distinct layout patterns, equipment configurations, and workflow tempos. QSR kitchens are compact and high-throughput with standardized equipment. Full-service kitchens have more complex layouts with multiple stations (grill, saute, garde manger, pastry). Ghost kitchens often have multiple brand concepts sharing a single space. We capture data across these configurations to enable models that generalize across the food service industry rather than overfitting to a single kitchen layout."
    },
    {
      "question": "How does Claru handle food safety compliance in its training data?",
      "answer": "Food safety is embedded in every stage of our food service data collection. Our annotation pipeline flags HACCP-relevant events in every capture: temperature readings outside safe zones (danger zone: 5-57C for potentially hazardous foods per FDA Food Code), cross-contamination risks (raw protein near ready-to-eat items), time violations (food held in the danger zone exceeding 4 hours), and allergen separation failures. Each annotation references the specific HACCP principle and FDA FSMA preventive control it relates to. This enables clients to demonstrate that their robot's training data systematically covers the food safety scenarios that health inspectors evaluate, providing an auditable trail from training data to robot behavior."
    },
    {
      "question": "What cooking-state classification does Claru's annotation include?",
      "answer": "Our cooking-state annotations cover the continuous transformation of food during preparation. For proteins, we classify across standardized doneness levels (rare, medium-rare, medium, medium-well, well-done) with visual and thermal verification paired per frame. For fried items, we use a color-based classification scale (pale, light golden, golden brown, dark brown, burnt) tied to internal temperature readings. For baked goods, we annotate crust color, rise height, and structural integrity. Each cooking-state annotation includes paired thermal and visual data, enabling models to correlate visual appearance with food temperature for safety compliance. We also capture cooking failures (underdone, overcooked, burnt) and common defects (uneven cooking, sticking, breakage) that are essential for training quality control systems."
    },
    {
      "question": "Can Claru provide data for sidewalk delivery robot navigation?",
      "answer": "Yes. Our outdoor food delivery datasets cover sidewalk navigation in urban, suburban, and campus environments. We capture data from robot-height perspective (approximately 50cm above ground) with RGB, depth, and LiDAR. Annotations include sidewalk surface type and condition, curb cuts, crosswalk boundaries, pedestrian trajectories, and delivery-relevant features (house numbers, building entrances, mailboxes, apartment buzzers). We also capture the last-50-feet challenge: navigating from sidewalk to front door across driveways, lawns, porches, stairs, and apartment building lobbies. Weather variation covers dry, wet, snowy, and icy conditions across seasons. Each delivery route includes food temperature monitoring data, enabling training models that optimize route planning for both navigation safety and food quality maintenance."
    },
    {
      "question": "How does Claru address allergen tracking in food assembly training data?",
      "answer": "Allergen tracking is one of the most safety-critical aspects of food assembly robotics. Our datasets include detailed allergen metadata for every ingredient captured: the FDA Big 9 allergens (milk, eggs, fish, shellfish, tree nuts, peanuts, wheat, soybeans, sesame) are tagged at the ingredient level with the specific allergen proteins present. Assembly sequences include spatial annotations showing allergen zones, utensil tracking to verify no cross-contact between allergen-containing and allergen-free items, and cleaning verification captures between allergen changeovers demonstrating wash-rinse-sanitize protocol completion. We capture both correct and incorrect allergen handling to provide positive and negative training examples. Each sequence is annotated with the specific allergen protocol it demonstrates or violates, enabling models that can flag cross-contact risks in real time during food assembly."
    }
  ],
  "ctaHeading": "Discuss Food Service Robotics Data Needs",
  "ctaDescription": "Tell us about your food service robotics project -- whether it is kitchen cooking automation, restaurant delivery, or food assembly. Claru will scope a food-safety-compliant data collection plan for your operational environment.",
  "relatedGlossaryTerms": ["embodied-ai", "physical-ai", "teleoperation-data", "imitation-learning"],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "regulations": [
    {
      "name": "FDA FSMA",
      "jurisdiction": "US",
      "description": "Food Safety Modernization Act requiring preventive controls.",
      "dataImplications": "Data must include contamination prevention, temperature compliance, and allergen separation scenarios per 21 CFR Part 117."
    },
    {
      "name": "HACCP",
      "jurisdiction": "International",
      "description": "Hazard Analysis Critical Control Points for food safety.",
      "dataImplications": "All seven HACCP principles must be represented: hazard analysis, CCPs, critical limits, monitoring, corrective actions, verification, records."
    },
    {
      "name": "FDA 21 CFR 110/117",
      "jurisdiction": "US",
      "description": "Current Good Manufacturing Practice for food facilities.",
      "dataImplications": "Data must include CIP procedures, sanitation verification, and allergen cleaning validation per 3-A Sanitary Standards."
    },
    {
      "name": "EU Regulation 852/2004",
      "jurisdiction": "EU",
      "description": "Hygiene of foodstuffs regulation.",
      "dataImplications": "HACCP-based documentation, temperature monitoring (cold chain 0-5C, hot holding above 63C), and food handler hygiene behaviors."
    },
    {
      "name": "NSF/ANSI Food Equipment Standards",
      "jurisdiction": "International",
      "description": "NSF/ANSI 2, 51, and 169 for food equipment materials and sanitary design.",
      "dataImplications": "Robot end-effector interactions must verify NSF-certified surface compliance. Cleaning data must demonstrate NSF sanitation standards."
    },
    {
      "name": "FDA Food Code",
      "jurisdiction": "US",
      "description": "Model food safety guidance for state and local health departments.",
      "dataImplications": "Training data must cover all Food Code critical control scenarios: time-temperature, handwashing, and cross-contamination prevention."
    }
  ],
  "environmentCharacteristics": [
    {
      "characteristic": "High Heat and Steam",
      "description": "Fryers at 175C, grills at 260C+, dishwasher steam, ambient 40C+.",
      "dataChallenge": "Thermal interference, lens fogging within minutes, heat shimmer distorting visual perception."
    },
    {
      "characteristic": "Wet and Greasy Surfaces",
      "description": "Constant water and aerosolized grease on floors, equipment, and sensors.",
      "dataChallenge": "Slip detection, grip estimation for greasy objects, sensor fouling requiring maintenance protocols."
    },
    {
      "characteristic": "Rapid Tempo / Tight Spaces",
      "description": "10-15 workers in under 500-1200 sq ft during rush hours carrying hazardous items.",
      "dataChallenge": "Dense human tracking with uniform appearance, close-range collision avoidance with hot/sharp objects."
    },
    {
      "characteristic": "Food Visual Diversity",
      "description": "Deformable foods that change appearance continuously during cooking and holding.",
      "dataChallenge": "Recognition must handle continuous appearance change, batch variation, and seasonal ingredient differences."
    },
    {
      "characteristic": "Allergen Zones",
      "description": "Separation between allergen-free and allergen-present areas for Big 9 allergens.",
      "dataChallenge": "Spatial zone understanding, utensil tracking, cross-contamination detection across changeovers."
    },
    {
      "characteristic": "Variable Lighting",
      "description": "Bright prep areas (500+ lux) to dim dining rooms (50-100 lux) with mixed light sources.",
      "dataChallenge": "Dramatic lighting transitions between zones, stainless steel glare, color temperature shifts affecting food assessment."
    }
  ],
  "commonTasks": [
    {
      "task": "Cooking and Food Preparation",
      "description": "Autonomous grilling, frying, wok tossing, bowl/salad/pizza assembly.",
      "dataRequirements": "Manipulation trajectories for deformable food, cooking-state time-series, temperature monitoring, portion measurement."
    },
    {
      "task": "In-Restaurant Food Delivery",
      "description": "Robot waiters navigating dining rooms to tables.",
      "dataRequirements": "Restaurant maps, diner avoidance, tray stability, social navigation patterns respecting dining norms."
    },
    {
      "task": "Dishwashing and Sanitation",
      "description": "Automated dish handling, loading, and cleanliness verification.",
      "dataRequirements": "Dish classification (50+ types), cleanliness imagery with UV fluorescence, rack-loading sequences, sanitizer monitoring."
    },
    {
      "task": "Inventory and Freshness Monitoring",
      "description": "Tracking ingredient freshness and stock levels in storage areas.",
      "dataRequirements": "Freshness classification across categories, FIFO compliance, cold-chain temperature logs with alert thresholds."
    },
    {
      "task": "Last-Mile Food Delivery",
      "description": "Sidewalk robots delivering food from restaurant to customer.",
      "dataRequirements": "Sidewalk navigation at robot height, food thermal maintenance, delivery handoff recordings across building types."
    },
    {
      "task": "Food Assembly Line Automation",
      "description": "High-speed standardized meal assembly from ingredient bins.",
      "dataRequirements": "Ingredient identification (50+ items), portion weight to gram accuracy, allergen zone tracking, quality verification."
    }
  ],
  "relevantModalities": [
    "RGB (steam-resistant, IP65+)",
    "Thermal (food/equipment temperature, FDA calibrated)",
    "Force/torque (sub-Newton for deformable food)",
    "Weight / portion sensors (1g accuracy)",
    "Depth (bin picking, plating verification)",
    "Chemical sensors (sanitizer concentration)",
    "UV fluorescence (cleanliness verification)",
    "IMU (tray stability)"
  ],
  "keyPapers": [
    {
      "id": "ahn-saycan-2022",
      "title": "Do As I Can, Not As I Say: Grounding Language in Robotic Affordances",
      "authors": "Ahn et al.",
      "venue": "CoRL 2022",
      "year": 2022,
      "url": "https://arxiv.org/abs/2204.01691"
    },
    {
      "id": "liu-food-recognition-2022",
      "title": "A Survey on Food Recognition with Deep Learning",
      "authors": "Liu et al.",
      "venue": "IEEE Access 2022",
      "year": 2022,
      "url": "https://doi.org/10.1109/ACCESS.2022.3147950"
    },
    {
      "id": "yang-cooking-robot-2023",
      "title": "A Survey on Robotic Cooking: Current Research and Future Directions",
      "authors": "Yang et al.",
      "venue": "Frontiers in Robotics and AI 2023",
      "year": 2023,
      "url": "https://doi.org/10.3389/frobt.2023.1168553"
    },
    {
      "id": "zeng-transporter-2021",
      "title": "Transporter Networks: Rearranging the Visual World for Robotic Manipulation",
      "authors": "Zeng et al.",
      "venue": "CoRL 2021",
      "year": 2021,
      "url": "https://arxiv.org/abs/2010.14406"
    },
    {
      "id": "min-food-image-2023",
      "title": "Large Scale Visual Food Recognition",
      "authors": "Min et al.",
      "venue": "IEEE Transactions on Pattern Analysis and Machine Intelligence 2023",
      "year": 2023,
      "url": "https://doi.org/10.1109/TPAMI.2023.3237871"
    }
  ],
  "claruRelevance": "Claru collects in active commercial kitchens with ServSafe-certified collectors, capturing real cooking conditions including steam, grease, and rush-hour congestion. Our annotation pipeline includes HACCP-aligned food safety compliance labels, cooking-state classification with paired thermal verification, allergen tracking with Big 9 metadata, and CCP coverage mapping. Data is delivered with audit-ready documentation for food safety regulatory compliance."
};

export default data;
