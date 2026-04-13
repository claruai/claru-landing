import type { IndustryPageData } from "./types";

const data: IndustryPageData = {
  "slug": "hospitality-robotics",
  "metaTitle": "Hospitality Robotics Training Data | Claru",
  "metaDescription": "Training data for hospitality robots: hotel concierge, room service delivery, cleaning automation, and guest interaction in hotels, resorts, and event venues.",
  "primaryKeyword": "hospitality robotics training data",
  "secondaryKeywords": [
    "hospitality robotics data",
    "hotel robot AI data",
    "room service robot datasets",
    "hospitality cleaning robot data",
    "concierge robot training data",
    "guest interaction AI data"
  ],
  "canonicalPath": "/industries/hospitality-robotics",
  "h1": "Hospitality Robotics Training Data",
  "heroSubtitle": "Training data for hospitality robots: hotel concierge, room service delivery, cleaning automation, and guest interaction in hotels and resorts. Built for the ADA accessibility, guest privacy, and cultural sensitivity requirements that define service robotics in public-facing environments.",
  "breadcrumbs": [
    { "label": "Home", "href": "/" },
    { "label": "Industries", "href": "/industries" },
    { "label": "Hospitality Robotics", "href": "/industries/hospitality-robotics" }
  ],
  "sections": [
    {
      "type": "prose",
      "heading": "Why Hospitality Robotics Data Requires Human-Centered Design",
      "paragraphs": [
        "Hospitality robotics occupies a unique position in the robotics landscape: these robots operate in spaces designed for human comfort and social interaction. A delivery robot navigating a hotel corridor is not moving through a warehouse -- it is sharing space with guests who paid for a premium experience. The robot's behavior must be quiet, unobtrusive, and culturally appropriate. It must yield to guests, navigate around luggage carts and strollers, and operate elevators without blocking access. Training data for hospitality robots must capture these social norms in addition to basic navigation.",
        "The hospitality labor shortage is driving adoption. The American Hotel and Lodging Association reported that 82% of hotels were understaffed in 2024, with housekeeping and front-desk positions being the hardest to fill. The global hospitality robotics market is projected to reach $3.1 billion by 2030. Companies like Relay Robotics (formerly Savioke), Bear Robotics, LG CLOi, Pudu Robotics, and Richtech Robotics deploy robots for room service delivery, concierge assistance, cleaning, and food-and-beverage service in hotels, resorts, casinos, and cruise ships.",
        "Guest privacy is a paramount concern. Hotels are private spaces where guests expect confidentiality. A robot with cameras navigating corridors and lobbies raises immediate privacy questions under GDPR (EU), CCPA (California), and hotel brand standards. Training data collection in hospitality environments must navigate consent requirements, exclude personally identifiable imagery from guest rooms, and comply with hotel-specific data policies that are often stricter than statutory minimums.",
        "The physical environment in hospitality varies enormously across properties. A luxury resort in Bali has different floor surfaces, lighting, and spatial layouts than a business hotel in Manhattan. Cruise ship corridors pitch and roll with the sea. Casino floors have low lighting and dense crowds. Conference centers have massive open spaces that transform daily. Training data must cover this diversity to enable models that generalize across the hospitality industry rather than overfitting to a single property type."
      ]
    },
    {
      "type": "cards",
      "heading": "Regulatory Requirements",
      "cards": [
        {
          "title": "ADA / ADA Accessibility Guidelines (US)",
          "description": "Americans with Disabilities Act requires that robots in public accommodations do not impede accessible routes. Hotel robots must maintain minimum 36-inch clear passage width in corridors, must not block elevator access for wheelchair users, and must yield to service animals. Training data must include scenarios with wheelchair users, motorized scooters, walkers, canes, service animals, and visually impaired guests with guide dogs."
        },
        {
          "title": "GDPR -- Guest Data Protection (EU)",
          "description": "General Data Protection Regulation applies to any robot collecting visual data in EU hospitality venues. Guest consent is required for any identifiable imagery. Robots must not capture images inside guest rooms without explicit consent. Training data collection in EU properties requires Data Protection Impact Assessments (DPIAs) and documented lawful basis for processing. Hotel chains typically require data processing agreements (DPAs) with any third-party collectors."
        },
        {
          "title": "CCPA / CPRA (California, US)",
          "description": "California Consumer Privacy Act and its successor California Privacy Rights Act impose notice and opt-out requirements for collection of personal information including biometric data. Hotel robots operating in California must post notices about camera usage. Training data must be collected with appropriate consumer notices and must not include biometric identifiers (facial features usable for facial recognition) without explicit consent."
        },
        {
          "title": "Fire Safety and Egress Codes (International)",
          "description": "NFPA 101 (US Life Safety Code) and local fire codes require that robots do not obstruct means of egress including corridors, stairwells, and exits. Training data must include emergency scenarios where the robot must clear egress paths within required timeframes. Robots must recognize fire alarms and move to designated safe positions, requiring audio detection training data for alarm sounds and PA announcements."
        },
        {
          "title": "ISO 13482 (International)",
          "description": "Safety requirements for personal care robots, applicable to service robots in hospitality environments. Covers collision avoidance with guests, safe behavior around children and elderly individuals, and graceful degradation during sensor failure. Training data must include vulnerable-population scenarios: small children below typical sensor height, elderly guests with walkers, and guests with visual or hearing impairments."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Environment Characteristics",
      "cards": [
        {
          "title": "Varied Floor Surfaces and Transitions",
          "description": "Hotels feature marble lobbies, carpeted corridors, tiled pool decks, outdoor stone patios, and rubber-matted kitchen areas -- often within a single property. Data challenge: Traction and navigation behavior changes dramatically between surfaces. Transition thresholds, elevator gaps, and ramp gradients create mobility hazards. Training data must include all surface types with labeled traction characteristics."
        },
        {
          "title": "Low-Light and Aesthetically Lit Environments",
          "description": "Hospitality environments prioritize ambiance over illumination. Hotel corridors are dimly lit (50-100 lux). Bars, restaurants, and spa areas operate at very low light levels (10-50 lux). Event spaces change lighting dramatically for different functions. Data challenge: Perception models must function reliably across a 10x-50x lighting range, including mixed warm/cool color temperatures that affect object recognition."
        },
        {
          "title": "High Guest Density with Unpredictable Movement",
          "description": "Hotel lobbies, conference center hallways, casino floors, and pool areas have dense pedestrian traffic with unpredictable movement patterns. Guests stop suddenly, children run, luggage carts create blind spots. Data challenge: Social-aware navigation in dense, unpredictable crowds where the robot must yield gracefully and never appear aggressive or impatient."
        },
        {
          "title": "Elevator and Multi-Floor Navigation",
          "description": "Hotels are multi-story buildings where robots must summon and ride elevators, share elevator space with guests, and navigate between floors. Data challenge: Elevator interaction is a complex multi-step task: detecting elevator doors, entering without collision, pressing floor buttons or communicating with elevator API, detecting arrival, and exiting while yielding to waiting guests."
        },
        {
          "title": "Privacy-Sensitive Zones",
          "description": "Guest room corridors, spa areas, and fitness centers are privacy-sensitive. Robots must minimize visual data capture in these zones. Data challenge: Training data collection is restricted in guest-occupied areas. Proxy environments and controlled-access collection sessions with consenting participants are required, adding significant logistical complexity."
        },
        {
          "title": "Acoustic Sensitivity",
          "description": "Hotels enforce noise standards, especially during nighttime hours. Robot motors, wheels on hard floors, and notification sounds must meet acceptable decibel levels. Data challenge: Audio training data must include the acoustic characteristics of different times of day, and robot behavior models must learn time-of-day-appropriate noise thresholds that differ between 2 PM checkout rush and 2 AM quiet hours."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Common Robotics Tasks",
      "cards": [
        {
          "title": "Room Service and Amenity Delivery",
          "description": "Autonomous delivery of food, beverages, towels, toiletries, and packages from service areas to guest rooms. Data requirements: Multi-floor navigation trajectories including elevator interaction sequences, door-approach behavior (stopping at appropriate distance, notifying guest via phone integration), payload stability monitoring during transport, and delivery handoff interaction recordings."
        },
        {
          "title": "Lobby Concierge and Wayfinding",
          "description": "Interactive robots providing directions, property information, and local recommendations to guests in hotel lobbies. Data requirements: Multi-language natural language interaction recordings, gesture and pointing direction annotations for wayfinding, cultural appropriateness labels across guest demographics, and conversational repair sequences for misunderstandings."
        },
        {
          "title": "Autonomous Floor Cleaning",
          "description": "Robots performing vacuum, scrub, and polish operations across large hotel floor areas during low-occupancy periods. Data requirements: Floor surface classification for cleaning method selection, furniture and obstacle mapping that changes with event setups, soiling detection imagery for prioritization, and coverage path optimization data across property layouts."
        },
        {
          "title": "Pool and Outdoor Area Monitoring",
          "description": "Robots patrolling pool decks, gardens, and outdoor venues for towel collection, safety monitoring, and cleanliness assessment. Data requirements: Wet surface detection, pool safety monitoring (unattended children, slip hazards), outdoor lighting and weather variation data, and navigation across uneven outdoor surfaces."
        },
        {
          "title": "Conference and Event Setup Assistance",
          "description": "Robots assisting with room configuration changes, equipment delivery, and event logistics in banquet and conference spaces. Data requirements: Room configuration recognition (theater, classroom, banquet, U-shape), equipment identification and placement verification against event orders, and navigation through temporary stage, AV, and furniture arrangements."
        }
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Data Requirements by Robot Type in Hospitality",
      "description": "Hospitality robots range from compact delivery units to large-scale floor cleaning machines. Each must meet the industry's unique guest-experience and privacy standards.",
      "columns": ["Robot Type", "Primary Sensors", "Data Volume", "Key Annotations", "Guest Experience Factor"],
      "rows": [
        {
          "Robot Type": "Room Delivery Robot",
          "Primary Sensors": "RGB-D, LiDAR, IMU, proximity",
          "Data Volume": "10K+ delivery runs",
          "Key Annotations": "Path, elevator interaction, door approach, handoff",
          "Guest Experience Factor": "Quiet operation, polite yielding"
        },
        {
          "Robot Type": "Lobby Concierge Robot",
          "Primary Sensors": "RGB, microphone array, touchscreen",
          "Data Volume": "50K+ interaction sessions",
          "Key Annotations": "Intent class, language, gesture, satisfaction",
          "Guest Experience Factor": "Natural conversation, cultural awareness"
        },
        {
          "Robot Type": "Floor Cleaning Robot",
          "Primary Sensors": "LiDAR, RGB, soiling sensor",
          "Data Volume": "5K+ cleaning sessions",
          "Key Annotations": "Surface type, soiling level, coverage map",
          "Guest Experience Factor": "Invisible operation during guest hours"
        },
        {
          "Robot Type": "Food & Beverage Runner",
          "Primary Sensors": "RGB-D, LiDAR, tray IMU",
          "Data Volume": "10K+ service runs",
          "Key Annotations": "Path, table ID, tray stability, social navigation",
          "Guest Experience Factor": "Non-intrusive dining room navigation"
        },
        {
          "Robot Type": "Security Patrol Robot",
          "Primary Sensors": "RGB, thermal, audio, LiDAR",
          "Data Volume": "10K+ patrol hours",
          "Key Annotations": "Anomaly detect, person count, access violation",
          "Guest Experience Factor": "Discreet presence, not intimidating"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Real-World Deployments",
      "paragraphs": [
        "Relay Robotics (formerly Savioke) pioneered hotel delivery robots with deployments at Marriott, Hilton, and Hyatt properties across the US and Asia. Their Relay robot autonomously delivers amenities from the front desk to guest rooms, including elevator navigation and guest notification via phone call on arrival. Relay has completed over 1 million autonomous deliveries. The key training data challenge is elevator interaction reliability: the robot must handle different elevator manufacturers, door timing, and the social dynamics of sharing an elevator car with guests.",
        "Bear Robotics deploys Servi in hotel restaurants and bars at properties including MGM Resorts and Hilton. The robot runs food and beverages from the kitchen or bar to tables in dining areas. In hotel F&B settings, the navigation challenge differs from standalone restaurants: dining rooms are often adjacent to lobbies and corridors, requiring the robot to transition between dense dining areas and open lobby spaces without disrupting either environment.",
        "Pudu Robotics has deployed over 80,000 service robots globally across hospitality, with the BellaBot and KettyBot operating in hotels across Asia, Europe, and North America. Their robots handle both delivery and interactive greeting functions. The scale of Pudu's deployment means their perception models must generalize across an enormous diversity of property types, from compact urban hotels to sprawling resort complexes.",
        "LG CLOi robots are deployed at the Sheraton Los Angeles San Gabriel and other properties for guiding, delivery, and cleaning functions. LG's approach integrates the robot with hotel property management systems (PMS), enabling the robot to know room status (occupied, vacant, checked-out) and adjust behavior accordingly. Training data must include hotel-operational metadata: robots behave differently when a floor is fully occupied versus when housekeeping is active.",
        "Richtech Robotics deploys ADAM, a bartender robot, and Matradee, a food service robot, at hotels, casinos, and event venues. ADAM can prepare cocktails autonomously, requiring training data for liquid handling, bottle identification, pour volume estimation, and garnish placement. The hospitality context adds constraints that a standalone bar robot would not face: ADAM must engage with guests conversationally while preparing drinks, requiring multi-modal interaction data."
      ]
    },
    {
      "type": "prose",
      "heading": "Relevant Data Modalities",
      "paragraphs": [
        "Hospitality robotics demands a sensor mix optimized for human-proximate operation in aesthetically designed spaces. Core modalities include RGB-D cameras (compact, quiet, with low-light capability), 2D/3D LiDAR for navigation and obstacle detection (in housings that match hotel aesthetics), microphone arrays for voice interaction and ambient noise monitoring, IMU for elevator and ramp navigation, proximity sensors for close-range guest detection, and touchscreen interaction logs for concierge functions.",
        "A hospitality-specific modality is acoustic environment sensing. Hotels enforce noise standards, and robots must adjust behavior based on ambient noise levels and time of day. Training data must include acoustic profiles of different hotel zones (lobby, corridor, restaurant, spa, pool) across time of day, enabling models that modulate robot speed, motor power, and notification volume to match the environment's acoustic expectations.",
        "Privacy-preserving sensing is increasingly important. Some hotel chains are exploring edge-processed perception that never transmits raw imagery off-device, using only semantic representations (occupancy counts, obstacle positions) for cloud analytics. Training data must support both full-imagery and privacy-preserving semantic modes to enable hotels to choose their preferred privacy posture."
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "ivanov-hotel-robots-2019",
          "title": "Adoption of Robots and Service Automation by Tourism and Hospitality Companies",
          "authors": "Ivanov et al.",
          "venue": "Revista Turismo e Desenvolvimento 2019",
          "year": 2019,
          "url": "https://doi.org/10.34624/rtd.v1i31.9135"
        },
        {
          "id": "lu-hotel-robot-2020",
          "title": "Service Robots, Customer Experience, and Hotel Performance",
          "authors": "Lu et al.",
          "venue": "International Journal of Hospitality Management 2020",
          "year": 2020,
          "url": "https://doi.org/10.1016/j.ijhm.2019.102423"
        },
        {
          "id": "kuo-social-navigation-2023",
          "title": "Social-Aware Robot Navigation in Indoor Environments: A Survey",
          "authors": "Kuo et al.",
          "venue": "Robotics and Autonomous Systems 2023",
          "year": 2023,
          "url": "https://doi.org/10.1016/j.robot.2023.104350"
        },
        {
          "id": "pinillos-service-robot-2016",
          "title": "Long-Term Assessment of a Service Robot in a Hotel Environment",
          "authors": "Pinillos et al.",
          "venue": "Robotics and Autonomous Systems 2016",
          "year": 2016,
          "url": "https://doi.org/10.1016/j.robot.2016.01.014"
        },
        {
          "id": "chiang-robot-hotel-2019",
          "title": "An Exploration of the Role of Robots in Hospitality: Guest Acceptance and Experience",
          "authors": "Chiang et al.",
          "venue": "Journal of Hospitality Marketing and Management 2019",
          "year": 2019,
          "url": "https://doi.org/10.1080/19368623.2019.1600554"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Serves Hospitality Robotics",
      "paragraphs": [
        "Claru collects training data in active hotel, resort, and event venue environments with collectors who understand hospitality service standards and guest privacy requirements. Our collection protocols include GDPR-compliant consent management for properties in EU jurisdictions, face-blurring pipelines for any imagery captured in guest-occupied areas, and coordination with hotel management to schedule collection during appropriate operational windows.",
        "Our annotation pipeline includes hospitality-specific protocols: social navigation scoring (did the robot yield appropriately to guests, maintain comfortable distance, avoid blocking corridors), elevator interaction segmentation (approach, door detection, entry, ride, exit), surface classification for cleaning robots (marble, carpet, tile, wood with associated cleaning method labels), and guest interaction quality annotations for concierge robots (intent recognition accuracy, response appropriateness, conversation completion rate).",
        "We deliver data in formats compatible with major hotel PMS (property management system) integration layers, enabling training data to include operational context like room occupancy status, housekeeping schedules, and event calendars. This operational metadata allows robot behavior models to learn context-dependent policies -- moving faster during vacant-floor periods and more cautiously during peak guest hours."
      ]
    }
  ],
  "faqs": [
    {
      "question": "How does Claru handle guest privacy when collecting data in hotels?",
      "answer": "Guest privacy is our highest priority in hospitality data collection. We implement a multi-layered privacy approach: first, all collection sessions are coordinated with hotel management and conducted under a documented data processing agreement. Second, we deploy automated face-blurring pipelines that process all imagery before human annotators access it. Third, we never collect data inside occupied guest rooms -- room-level data is captured only in unoccupied, prepared rooms with management authorization. Fourth, in EU properties, we conduct Data Protection Impact Assessments (DPIAs) and ensure GDPR-compliant notice and consent mechanisms are in place. Our privacy protocols are reviewed by the hotel's legal team before any collection begins, and we adapt to brand-specific privacy policies that may exceed statutory requirements."
    },
    {
      "question": "Can Claru provide elevator interaction training data?",
      "answer": "Yes. Elevator interaction is one of the most complex navigation tasks for hospitality robots, and we provide dedicated datasets covering the full interaction sequence: detecting elevator lobbies, summoning elevators (via API integration or physical button press), detecting door open/close states across different elevator manufacturers (Otis, Schindler, ThyssenKrupp, KONE, Mitsubishi), entering the car while yielding to exiting passengers, riding with guests in shared elevator space, detecting floor arrival, and exiting while yielding to waiting guests. Our datasets cover different elevator types (single-car, bank of elevators, service elevators) and include failure scenarios (doors closing on robot, full elevator cars, out-of-service elevators) that are critical for robust deployment."
    },
    {
      "question": "What property types does Claru's hospitality dataset cover?",
      "answer": "Our hospitality datasets span the full range of accommodation types: urban business hotels (compact layouts, high elevator usage), resort properties (expansive grounds, outdoor navigation, pool areas), casino hotels (low-light gaming floors, high-density crowd navigation), boutique hotels (narrow corridors, unique architectural features), convention hotels (large open conference spaces that reconfigure daily), and cruise ships (moving platform, narrow corridors, multi-deck navigation). Each property type has distinct spatial characteristics, guest demographics, and operational patterns that affect robot behavior requirements. We capture data across multiple properties per type to ensure models generalize rather than memorizing a single building's layout."
    },
    {
      "question": "Does Claru provide multi-language interaction data for concierge robots?",
      "answer": "Yes. Hotels serve international guests, and concierge robots must handle multi-language interactions. Our interaction datasets cover English, Mandarin, Spanish, Japanese, Korean, Arabic, French, German, and additional languages based on the property's guest demographics. Each interaction is annotated with language, intent classification, response appropriateness, and interaction outcome (question answered, handoff to human staff, unresolved). We also capture code-switching scenarios where guests switch between languages mid-conversation, which is common in international travel contexts and represents a significant challenge for dialogue systems."
    },
    {
      "question": "How does Claru ensure robot behavior meets hospitality service standards?",
      "answer": "Hospitality is a service industry where robot behavior directly affects guest satisfaction scores and brand reputation. Our annotation pipeline includes service-quality scoring based on hospitality industry standards: approach distance and angle (not startling guests), yielding behavior (always giving right-of-way to guests), noise level appropriateness (quieter operations during nighttime hours), and interaction tone (polite, helpful, not pushy). We work with hotel operations teams to define property-specific service standards and annotate training data against those standards. This enables robots to learn behavior policies that align with each brand's service culture rather than generic obstacle avoidance."
    }
  ],
  "ctaHeading": "Discuss Hospitality Robotics Data Needs",
  "ctaDescription": "Tell us about your hospitality robotics project -- whether it is room delivery, concierge interaction, cleaning automation, or multi-property deployment. Claru will scope a privacy-compliant data collection plan tailored to your brand standards.",
  "relatedGlossaryTerms": [
    "embodied-ai",
    "physical-ai",
    "teleoperation-data",
    "imitation-learning"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "regulations": [
    {
      "name": "ADA / ADA Accessibility Guidelines",
      "jurisdiction": "US",
      "description": "Americans with Disabilities Act accessibility requirements for public accommodations.",
      "dataImplications": "Training data must include wheelchair users, service animals, mobility aids. Robots must maintain 36-inch clear passage."
    },
    {
      "name": "GDPR (Guest Data Protection)",
      "jurisdiction": "EU",
      "description": "General Data Protection Regulation applying to visual data collection in hospitality venues.",
      "dataImplications": "DPIAs required. Guest consent for identifiable imagery. No room interior capture without explicit consent."
    },
    {
      "name": "CCPA / CPRA",
      "jurisdiction": "California, US",
      "description": "California Consumer Privacy Act and Privacy Rights Act for personal information collection.",
      "dataImplications": "Notice and opt-out requirements. No biometric identifiers without explicit consent."
    },
    {
      "name": "NFPA 101 / Fire Egress Codes",
      "jurisdiction": "US / International",
      "description": "Life Safety Code requiring unobstructed means of egress.",
      "dataImplications": "Training data must include emergency scenarios. Robots must recognize alarms and clear egress paths."
    },
    {
      "name": "ISO 13482",
      "jurisdiction": "International",
      "description": "Safety requirements for personal care and service robots.",
      "dataImplications": "Data must include vulnerable populations: children, elderly, visually/hearing impaired guests."
    }
  ],
  "environmentCharacteristics": [
    {
      "characteristic": "Varied Floor Surfaces",
      "description": "Marble, carpet, tile, wood, rubber, and outdoor stone within a single property.",
      "dataChallenge": "Traction changes dramatically. Transition thresholds and ramp gradients create mobility hazards."
    },
    {
      "characteristic": "Low-Light Aesthetic Environments",
      "description": "Corridors at 50-100 lux, bars at 10-50 lux, event spaces with dynamic lighting.",
      "dataChallenge": "Perception across 10-50x lighting range with mixed warm/cool color temperatures."
    },
    {
      "characteristic": "High Guest Density",
      "description": "Lobbies, conference halls, casino floors with dense, unpredictable pedestrian traffic.",
      "dataChallenge": "Social-aware navigation in unpredictable crowds. Robot must yield gracefully."
    },
    {
      "characteristic": "Multi-Floor Elevator Navigation",
      "description": "Multi-story buildings requiring elevator summoning, riding, and floor transitions.",
      "dataChallenge": "Complex multi-step elevator interaction across manufacturers with shared-car guest dynamics."
    },
    {
      "characteristic": "Privacy-Sensitive Zones",
      "description": "Guest corridors, spa areas, and fitness centers with restricted data capture.",
      "dataChallenge": "Collection restricted in guest areas. Proxy environments and consenting participants required."
    },
    {
      "characteristic": "Acoustic Sensitivity",
      "description": "Noise standards vary by zone and time of day; nighttime quiet hours enforced.",
      "dataChallenge": "Audio training for time-of-day noise thresholds. Robot speed and notification volume adaptation."
    }
  ],
  "commonTasks": [
    {
      "task": "Room Service and Amenity Delivery",
      "description": "Autonomous delivery from service areas to guest rooms across multiple floors.",
      "dataRequirements": "Multi-floor trajectories, elevator interaction, door-approach behavior, payload stability, handoff recordings."
    },
    {
      "task": "Lobby Concierge and Wayfinding",
      "description": "Interactive guidance, property information, and local recommendations.",
      "dataRequirements": "Multi-language interaction recordings, gesture annotations, cultural appropriateness labels, conversation repair data."
    },
    {
      "task": "Autonomous Floor Cleaning",
      "description": "Vacuum, scrub, and polish operations during low-occupancy periods.",
      "dataRequirements": "Surface classification, furniture mapping, soiling detection, coverage optimization across layouts."
    },
    {
      "task": "Pool and Outdoor Monitoring",
      "description": "Patrol pool decks and outdoor venues for safety and cleanliness.",
      "dataRequirements": "Wet surface detection, safety monitoring, weather variation data, uneven outdoor navigation."
    },
    {
      "task": "Conference/Event Setup Assistance",
      "description": "Room configuration verification and equipment delivery for events.",
      "dataRequirements": "Room configuration recognition, equipment ID, placement verification against event orders."
    }
  ],
  "relevantModalities": [
    "RGB-D (compact, low-light capable)",
    "2D/3D LiDAR (aesthetic housing)",
    "Microphone array (voice interaction)",
    "IMU (elevator/ramp navigation)",
    "Proximity sensors (close-range guest detection)",
    "Touchscreen interaction logs",
    "Acoustic environment sensors",
    "Thermal (optional, security applications)"
  ],
  "keyPapers": [
    {
      "id": "ivanov-hotel-robots-2019",
      "title": "Adoption of Robots and Service Automation by Tourism and Hospitality Companies",
      "authors": "Ivanov et al.",
      "venue": "Revista Turismo e Desenvolvimento 2019",
      "year": 2019,
      "url": "https://doi.org/10.34624/rtd.v1i31.9135"
    },
    {
      "id": "lu-hotel-robot-2020",
      "title": "Service Robots, Customer Experience, and Hotel Performance",
      "authors": "Lu et al.",
      "venue": "International Journal of Hospitality Management 2020",
      "year": 2020,
      "url": "https://doi.org/10.1016/j.ijhm.2019.102423"
    },
    {
      "id": "kuo-social-navigation-2023",
      "title": "Social-Aware Robot Navigation in Indoor Environments: A Survey",
      "authors": "Kuo et al.",
      "venue": "Robotics and Autonomous Systems 2023",
      "year": 2023,
      "url": "https://doi.org/10.1016/j.robot.2023.104350"
    },
    {
      "id": "pinillos-service-robot-2016",
      "title": "Long-Term Assessment of a Service Robot in a Hotel Environment",
      "authors": "Pinillos et al.",
      "venue": "Robotics and Autonomous Systems 2016",
      "year": 2016,
      "url": "https://doi.org/10.1016/j.robot.2016.01.014"
    },
    {
      "id": "chiang-robot-hotel-2019",
      "title": "An Exploration of the Role of Robots in Hospitality: Guest Acceptance and Experience",
      "authors": "Chiang et al.",
      "venue": "Journal of Hospitality Marketing and Management 2019",
      "year": 2019,
      "url": "https://doi.org/10.1080/19368623.2019.1600554"
    }
  ],
  "claruRelevance": "Claru collects in active hotels, resorts, and event venues with privacy-compliant protocols including GDPR DPIAs, face-blurring pipelines, and hotel brand-approved collection procedures. Our annotation pipeline includes social navigation scoring, elevator interaction segmentation, surface classification for cleaning robots, and multi-language interaction quality labels. Data integrates with hotel PMS systems to include operational context like occupancy and housekeeping schedules."
};

export default data;
