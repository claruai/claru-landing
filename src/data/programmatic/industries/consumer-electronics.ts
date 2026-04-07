import type { IndustryPageData } from "./types";

const data: IndustryPageData = {
  "slug": "consumer-electronics",
  "metaTitle": "Consumer Electronics Robotics Data | Claru",
  "metaDescription": "Training data for consumer robots: home assistants, robotic vacuums, lawn mowers, personal companions, and domestic manipulation robots in real homes.",
  "primaryKeyword": "consumer electronics robotics training data",
  "secondaryKeywords": [
    "consumer robotics data",
    "home robot training data",
    "robotic vacuum datasets",
    "personal robot AI data",
    "domestic robot training data",
    "household robotics datasets"
  ],
  "canonicalPath": "/industries/consumer-electronics",
  "h1": "Consumer Electronics Robotics Data",
  "heroSubtitle": "Training data for consumer robots: home assistants, robotic vacuums, lawn mowers, personal companions, and domestic manipulation robots. Captured in real homes across diverse layouts, demographics, and living conditions.",
  "breadcrumbs": [
    { "label": "Home", "href": "/" },
    { "label": "Industries", "href": "/industries" },
    { "label": "Consumer Electronics Robotics", "href": "/industries/consumer-electronics" }
  ],
  "sections": [
    {
      "type": "prose",
      "heading": "Why Consumer Robotics Data Requires Real Homes",
      "paragraphs": [
        "Consumer robots face a problem that industrial robots do not: every deployment environment is unique. A robotic vacuum does not operate in a controlled factory but in millions of different living rooms, each with distinct furniture layouts, floor types, lighting, clutter patterns, and occupants including children, elderly individuals, and pets. The long tail of home environments is effectively infinite, making real-home data collection essential.",
        "The consumer robotics market is projected to exceed $30 billion by 2030, driven by companies like iRobot (Roomba), Ecovacs (Deebot), Samsung (Jet Bot), and emerging players like Hello Robot (Stretch) and 1X Technologies (NEO). Tesla's Optimus humanoid targets home deployment. Each of these systems needs training data that reflects the messy, unpredictable reality of domestic environments -- not the clean, staged rooms found in synthetic datasets.",
        "Privacy and safety regulations add unique constraints. Consumer robots equipped with cameras operate in the most private spaces imaginable: bedrooms, bathrooms, children's rooms. The EU AI Act classifies consumer-facing AI as high-risk when it involves biometric processing. UL 4600 requires demonstrating safety across foreseeable home hazards. Training data must be collected with informed consent, privacy-preserving annotation protocols, and documented demographic coverage."
      ]
    },
    {
      "type": "cards",
      "heading": "Regulatory Requirements",
      "cards": [
        {
          "title": "UL 4600 (US)",
          "description": "Standard for Safety for Evaluation of Autonomous Products. Consumer robot training data must cover foreseeable home hazards: stairs, glass doors, pets, children, fragile items, loose cables, and wet floors. Safety cases require documented evidence of performance across these scenarios, with particular attention to failure modes that could cause physical harm in domestic settings."
        },
        {
          "title": "EU AI Act -- High-Risk Classification (EU)",
          "description": "The EU AI Act classifies consumer robots with biometric processing capabilities (face recognition, voice identification) as high-risk AI systems. Training data must include bias documentation across demographic groups, transparency documentation for consumers, and ongoing monitoring data. Robots marketed to children face additional scrutiny under the Digital Services Act."
        },
        {
          "title": "GDPR / CCPA (EU / US-CA)",
          "description": "Consumer robots collecting visual data in homes must comply with data protection regulations. Training data collection requires informed consent from all household members, anonymization of personally identifiable information (faces, documents, screens), and documented data retention policies. Children under 16 require parental consent under GDPR Article 8."
        },
        {
          "title": "IEC 62443 / Consumer IoT Security (International)",
          "description": "Cybersecurity requirements for networked consumer devices. Training data pipelines must implement secure data handling to prevent exposure of home imagery. Data must be encrypted in transit and at rest, with access controls that prevent unauthorized access to private home captures."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Environment Characteristics",
      "cards": [
        {
          "title": "Extreme Layout Diversity",
          "description": "Studio apartments, suburban houses, multi-story homes, assisted living facilities -- every deployment is unique. Data challenge: Models must generalize across thousands of distinct floor plans. No two homes share the same furniture arrangement, and occupants rearrange frequently."
        },
        {
          "title": "Mixed Floor Surfaces",
          "description": "Homes contain hardwood, carpet, tile, rugs, thresholds, and transitions between surfaces within a single room. Data challenge: Navigation and cleaning robots must handle surface transitions without getting stuck, requiring terrain-type classification data with transition geometry."
        },
        {
          "title": "Cluttered and Dynamic Spaces",
          "description": "Toys on the floor, shoes by the door, pet bowls, charging cables, scattered mail. Homes are inherently cluttered and the clutter changes daily. Data challenge: Object detection must handle thousands of household items in unpredictable arrangements, unlike the controlled object sets in research labs."
        },
        {
          "title": "Occupant Diversity",
          "description": "Homes contain adults, children, elderly, pets, and visitors. Occupants may be sleeping, moving unpredictably, or approaching the robot. Data challenge: Person detection must work across all ages, body types, clothing, and activity states. Pet detection must cover common species and sizes."
        },
        {
          "title": "Variable Lighting and Acoustics",
          "description": "Homes range from bright sunlit rooms to pitch-dark hallways at night. Acoustics vary from quiet bedrooms to noisy kitchens. Data challenge: Vision and audio models must handle the full diurnal lighting cycle and background noise from TVs, appliances, and conversations."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Common Robotics Tasks",
      "cards": [
        {
          "title": "Floor Coverage Navigation",
          "description": "Systematic coverage of all reachable floor area while avoiding obstacles and hazards. Data requirements: Egocentric SLAM data from robot height (10-30cm), floor-plan maps with furniture labels, cliff/stair detection data, and stuck-state recovery scenarios."
        },
        {
          "title": "Domestic Manipulation",
          "description": "Picking up objects, opening doors, loading dishwashers, folding laundry -- the emerging frontier of home robot capabilities. Data requirements: Manipulation demonstrations across 500+ household object categories, force-sensitive grasping data for fragile items, and multi-step task recordings (e.g., clear table: detect dishes, grasp, carry to sink, place)."
        },
        {
          "title": "Human-Robot Social Interaction",
          "description": "Companion robots, assistive robots for elderly care, and domestic assistants that respond to gestures and speech. Data requirements: Multi-modal interaction recordings (audio + video + pose), emotion recognition data across demographics, personal space modeling, and culturally appropriate behavior patterns."
        },
        {
          "title": "Outdoor Domestic Navigation",
          "description": "Lawn mowing robots, gutter-cleaning robots, and delivery robots operating in yards and driveways. Data requirements: GPS-RTK boundary mapping, terrain classification (grass, gravel, pavement, mulch), obstacle detection for garden features, weather-variant captures."
        },
        {
          "title": "Home Security and Monitoring",
          "description": "Autonomous patrol robots that detect anomalies, check locks, and monitor for hazards like water leaks or smoke. Data requirements: Normal-state baseline imagery per room, anomaly detection training with rare-event examples, night-vision captures, and temporal pattern learning data."
        }
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Data Requirements by Robot Type in Consumer Electronics",
      "description": "Consumer robots span from simple floor cleaners to humanoid home assistants. Each category has distinct sensor profiles and data needs.",
      "columns": ["Robot Type", "Primary Sensors", "Data Volume", "Key Annotations", "Update Frequency"],
      "rows": [
        {
          "Robot Type": "Robotic Vacuum / Mop",
          "Primary Sensors": "LiDAR/VSLAM, cliff sensors, bump sensors",
          "Data Volume": "50K+ home runs",
          "Key Annotations": "Floor type, obstacle class, room label, coverage map",
          "Update Frequency": "Seasonal (holiday clutter, summer/winter)"
        },
        {
          "Robot Type": "Home Manipulation Robot",
          "Primary Sensors": "RGB-D, force/torque, tactile",
          "Data Volume": "100K+ manipulation demos",
          "Key Annotations": "Object class, grasp type, task steps, success/fail",
          "Update Frequency": "Per new object/task category"
        },
        {
          "Robot Type": "Companion / Assistive Robot",
          "Primary Sensors": "RGB, microphone array, depth",
          "Data Volume": "10K+ hours interaction",
          "Key Annotations": "Speech transcripts, gesture labels, emotion, engagement",
          "Update Frequency": "Per language/culture addition"
        },
        {
          "Robot Type": "Lawn Mowing Robot",
          "Primary Sensors": "GPS-RTK, RGB, ultrasonic",
          "Data Volume": "10K+ yard maps",
          "Key Annotations": "Terrain type, boundary, obstacle class, mow pattern",
          "Update Frequency": "Seasonal (growth patterns, weather)"
        },
        {
          "Robot Type": "Home Security Robot",
          "Primary Sensors": "RGB (day/night), thermal, microphone",
          "Data Volume": "100K+ patrol hours",
          "Key Annotations": "Anomaly labels, person/pet ID, lock status, hazard type",
          "Update Frequency": "Per environment change"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Real-World Deployments",
      "paragraphs": [
        "iRobot has deployed over 40 million Roomba robots worldwide, making it the largest fleet of home robots. Their latest models use visual SLAM with onboard cameras for mapping and obstacle avoidance. iRobot's data challenge is navigating the extreme long tail of home environments -- their robots encounter pet waste, socks, cable tangles, and holiday decorations that no simulation can fully capture.",
        "Hello Robot's Stretch is a mobile manipulation robot designed for home assistance, targeting elderly care and disability support. At approximately $25,000, it represents the emerging market of domestic manipulation robots that can open drawers, pick up objects from the floor, and operate light switches. Training Stretch requires manipulation demonstrations across real home environments with genuine household objects, not lab-curated object sets.",
        "Samsung's Ballie and LG's CLOi represent the companion robot category, combining navigation with social interaction. These robots must understand household routines, respond to voice commands, recognize family members, and navigate safely around children and pets. The training data for these systems must capture the nuances of domestic social dynamics -- something that cannot be synthesized from industrial or academic datasets.",
        "1X Technologies (backed by OpenAI) and Figure AI are developing humanoid robots with explicit home deployment ambitions. Tesla's Optimus prototyping includes domestic task demonstrations. These systems require the broadest training data profile in consumer robotics: full-body bipedal locomotion in cluttered homes, dexterous manipulation of household objects, and natural human interaction patterns."
      ]
    },
    {
      "type": "prose",
      "heading": "Relevant Data Modalities",
      "paragraphs": [
        "Consumer robotics uses cost-constrained sensors optimized for home environments. Primary modalities include monocular or stereo RGB cameras, structured-light or ToF depth sensors, 2D LiDAR for navigation, microphone arrays for speech and sound detection, IMU for motion tracking, and tactile/force sensors for manipulation robots. Unlike industrial robotics, consumer systems must achieve robust performance with sensors costing under $50 per unit.",
        "A critical distinction is the privacy-sensitivity of consumer robot data. Every frame may contain faces, personal documents, screens with private information, and images of children. Claru's collection pipeline includes real-time face blurring, document redaction, and screen masking before any data leaves the collection device, ensuring privacy compliance at the point of capture rather than in post-processing."
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "yenamandra-homerobot-2023",
          "title": "HomeRobot: Open-Vocabulary Mobile Manipulation",
          "authors": "Yenamandra et al.",
          "venue": "CoRL 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2306.11565"
        },
        {
          "id": "srivastava-behavior-2022",
          "title": "BEHAVIOR-1K: A Benchmark for Embodied AI with 1,000 Everyday Activities and Realistic Simulation",
          "authors": "Li et al.",
          "venue": "CoRL 2022",
          "year": 2022,
          "url": "https://arxiv.org/abs/2403.09227"
        },
        {
          "id": "savva-habitat-2019",
          "title": "Habitat: A Platform for Embodied AI Research",
          "authors": "Savva et al.",
          "venue": "ICCV 2019",
          "year": 2019,
          "url": "https://arxiv.org/abs/1904.01201"
        },
        {
          "id": "wu-tidybot-2023",
          "title": "TidyBot: Personalized Robot Assistance with Large Language Models",
          "authors": "Wu et al.",
          "venue": "IROS 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2305.18035"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Serves Consumer Electronics Robotics",
      "paragraphs": [
        "Claru's distributed collector network captures data in real homes across diverse geographies, demographics, and living situations. Our collectors operate in apartments, suburban houses, multi-generational homes, and assisted-living facilities, producing datasets that reflect the true distribution of domestic environments rather than the biased sample of university lab spaces.",
        "Our privacy-first collection pipeline implements face blurring, document redaction, and screen masking at the point of capture. All household members provide informed consent before collection begins. Annotations include privacy-sensitive metadata flags, enabling clients to filter datasets by consent level. We deliver in formats compatible with Habitat, AI2-THOR, and standard robotics pipelines (ROS bag, HDF5), with optional GDPR Data Protection Impact Assessment documentation."
      ]
    }
  ],
  "faqs": [
    {
      "question": "How does Claru protect privacy when collecting data in real homes?",
      "answer": "Privacy protection is built into every stage of our home data collection pipeline. Before any collection, all household members (including guests present during capture) sign informed consent forms that explain what data is collected, how it will be used, and their right to request deletion. During capture, our collection devices run on-device face detection and blurring, document text redaction, and screen content masking in real time -- private information never leaves the home in identifiable form. All captures are encrypted at rest and in transit. Our annotation team works only with privacy-processed data. We provide full GDPR Article 30 records of processing activities and can supply Data Protection Impact Assessment documentation on request."
    },
    {
      "question": "What range of home types and demographics does Claru's dataset cover?",
      "answer": "Our home robotics datasets span the full spectrum of residential environments. We collect in studio apartments under 400 square feet, suburban single-family homes, multi-story townhouses, rural farmhouses, and assisted-living facilities. Demographics include single-occupant households, families with young children, multi-generational homes, homes with multiple pets, and seniors living independently. Geographic coverage spans urban, suburban, and rural areas across North America and Europe. Each capture session records metadata including home type, approximate square footage, number of occupants, pet presence, and flooring types, enabling clients to balance their training data across demographic dimensions."
    },
    {
      "question": "Can Claru provide manipulation training data for household objects?",
      "answer": "Yes. Our domestic manipulation datasets include teleoperated demonstrations across 500+ household object categories including dishes, utensils, clothing, cleaning supplies, food containers, remote controls, books, and personal care items. Each demonstration records RGB-D video, end-effector trajectory, and force-torque profiles. We capture multi-step task sequences such as clearing a dining table, loading a dishwasher, sorting laundry, and organizing a shelf. Objects are genuine household items in their natural positions, not lab-curated object sets placed on clean tables. This matters because real kitchen drawers are cluttered, real laundry baskets contain tangled clothing, and real shelves have items of varying sizes packed tightly together."
    },
    {
      "question": "How does Claru handle the extreme variability of home environments?",
      "answer": "We address home environment variability through scale and systematic sampling. Rather than deeply capturing a few homes, we collect across hundreds of distinct households, ensuring broad coverage of floor plans, furniture styles, clutter levels, lighting conditions, and occupant demographics. Each home is captured at multiple times of day to cover the diurnal lighting cycle. We revisit homes seasonally to capture holiday decorations, seasonal furniture changes, and weather-related conditions like condensation on windows. Our dataset metadata enables stratified sampling so clients can ensure their training data is balanced across home types, regions, and demographic variables rather than biased toward any single home configuration."
    },
    {
      "question": "Does Claru's data include edge cases like pet interference and child safety scenarios?",
      "answer": "Yes, and these edge cases are among the most valuable parts of our home robotics datasets. We specifically recruit households with pets (dogs, cats, and small animals) and young children, and we capture the unpredictable interactions that occur when robots operate near them. This includes pets sleeping on robot charging stations, cats batting at robot sensors, dogs following robots through rooms, toddlers placing toys on or in front of robots, and children attempting to ride or pick up robots. Each interaction is annotated with safety-relevant metadata including proximity distances, contact events, and the robot's behavioral response. These edge cases are nearly impossible to collect in controlled settings but are critical for UL 4600 safety validation."
    }
  ],
  "ctaHeading": "Discuss Consumer Electronics Robotics Data Needs",
  "ctaDescription": "Tell us about your consumer robot project -- whether it is floor care, home manipulation, or companion robotics. Claru will scope a privacy-compliant data collection plan tailored to your product's domestic deployment requirements.",
  "relatedGlossaryTerms": [
    "embodied-ai",
    "physical-ai",
    "teleoperation-data",
    "imitation-learning"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "regulations": [
    { "name": "UL 4600", "jurisdiction": "US", "description": "Standard for Safety for Evaluation of Autonomous Products.", "dataImplications": "Training data must cover foreseeable home hazards: stairs, pets, children, fragile items, loose cables, wet floors." },
    { "name": "EU AI Act (High-Risk)", "jurisdiction": "EU", "description": "High-risk classification for consumer robots with biometric processing.", "dataImplications": "Requires bias documentation, demographic representativeness, and transparency documentation for consumers." },
    { "name": "GDPR / CCPA", "jurisdiction": "EU / US-CA", "description": "Data protection for visual data collected in private homes.", "dataImplications": "Informed consent from all household members, face anonymization, documented retention policies." },
    { "name": "IEC 62443", "jurisdiction": "International", "description": "Cybersecurity for networked consumer IoT devices.", "dataImplications": "Training data pipelines must implement encryption and access controls for private home imagery." }
  ],
  "environmentCharacteristics": [
    { "characteristic": "Extreme Layout Diversity", "description": "Every home is unique: studios, houses, multi-story, assisted living.", "dataChallenge": "Models must generalize across thousands of floor plans with frequently rearranged furniture." },
    { "characteristic": "Mixed Floor Surfaces", "description": "Hardwood, carpet, tile, rugs, and transitions within single rooms.", "dataChallenge": "Terrain classification with transition geometry for navigation and cleaning robots." },
    { "characteristic": "Cluttered and Dynamic Spaces", "description": "Toys, shoes, cables, pet bowls -- clutter changes daily.", "dataChallenge": "Thousands of household items in unpredictable arrangements unlike controlled lab settings." },
    { "characteristic": "Occupant Diversity", "description": "Adults, children, elderly, pets, visitors of all ages and sizes.", "dataChallenge": "Person/pet detection across all demographics, clothing, and activity states." },
    { "characteristic": "Variable Lighting and Acoustics", "description": "Bright sunlit rooms to pitch-dark hallways; quiet to noisy.", "dataChallenge": "Full diurnal lighting cycle and background noise from TVs, appliances, conversations." }
  ],
  "commonTasks": [
    { "task": "Floor Coverage Navigation", "description": "Systematic coverage of all reachable floor area while avoiding obstacles.", "dataRequirements": "Egocentric SLAM from robot height, floor-plan maps, cliff detection, stuck-state recovery." },
    { "task": "Domestic Manipulation", "description": "Picking objects, opening doors, loading dishwashers, folding laundry.", "dataRequirements": "500+ object categories, force-sensitive grasping, multi-step task recordings." },
    { "task": "Human-Robot Social Interaction", "description": "Companion and assistive robots responding to gestures and speech.", "dataRequirements": "Multi-modal recordings (audio+video+pose), emotion recognition, personal space modeling." },
    { "task": "Outdoor Domestic Navigation", "description": "Lawn mowing, gutter cleaning, driveway delivery.", "dataRequirements": "GPS-RTK boundary mapping, terrain classification, weather-variant captures." },
    { "task": "Home Security Monitoring", "description": "Autonomous patrol, anomaly detection, hazard identification.", "dataRequirements": "Normal-state baselines, rare-event examples, night vision, temporal patterns." }
  ],
  "relevantModalities": [
    "RGB video (monocular/stereo)",
    "Depth (structured-light / ToF)",
    "2D LiDAR",
    "Microphone array",
    "IMU",
    "Tactile / force sensors",
    "GPS-RTK (outdoor)"
  ],
  "keyPapers": [
    { "id": "yenamandra-homerobot-2023", "title": "HomeRobot: Open-Vocabulary Mobile Manipulation", "authors": "Yenamandra et al.", "venue": "CoRL 2023", "year": 2023, "url": "https://arxiv.org/abs/2306.11565" },
    { "id": "srivastava-behavior-2022", "title": "BEHAVIOR-1K: A Benchmark for Embodied AI with 1,000 Everyday Activities", "authors": "Li et al.", "venue": "CoRL 2022", "year": 2022, "url": "https://arxiv.org/abs/2403.09227" },
    { "id": "savva-habitat-2019", "title": "Habitat: A Platform for Embodied AI Research", "authors": "Savva et al.", "venue": "ICCV 2019", "year": 2019, "url": "https://arxiv.org/abs/1904.01201" },
    { "id": "wu-tidybot-2023", "title": "TidyBot: Personalized Robot Assistance with Large Language Models", "authors": "Wu et al.", "venue": "IROS 2023", "year": 2023, "url": "https://arxiv.org/abs/2305.18035" }
  ],
  "claruRelevance": "Claru captures data in real homes across diverse geographies and demographics with a privacy-first pipeline including on-device face blurring and document redaction. Our domestic datasets reflect the true distribution of home environments rather than biased lab spaces."
};

export default data;
