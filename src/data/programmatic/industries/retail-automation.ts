import type { IndustryPageData } from "./types";

const data: IndustryPageData = {
  "slug": "retail-automation",
  "metaTitle": "Retail Automation Training Data | Claru",
  "metaDescription": "Training data for retail robots: shelf scanning, autonomous delivery, micro-fulfillment, checkout-free stores, and customer-facing service robots.",
  "primaryKeyword": "retail automation robotics training data",
  "secondaryKeywords": [
    "retail robotics data",
    "shelf scanning robot data",
    "autonomous delivery training data",
    "micro-fulfillment robot data",
    "checkout-free store AI data",
    "retail inventory robot datasets",
    "last-mile delivery robot data"
  ],
  "canonicalPath": "/industries/retail-automation",
  "h1": "Retail Automation Training Data",
  "heroSubtitle": "Training data for retail robots: shelf scanning, autonomous delivery, micro-fulfillment, checkout-free stores, and customer-facing service robots. Purpose-built datasets for the privacy constraints, crowded environments, and product diversity that define retail robotics.",
  "breadcrumbs": [
    { "label": "Home", "href": "/" },
    { "label": "Industries", "href": "/industries" },
    { "label": "Retail Automation", "href": "/industries/retail-automation" }
  ],
  "sections": [
    {
      "type": "prose",
      "heading": "Why Retail Robotics Data Requires a Different Approach",
      "paragraphs": [
        "Retail is the fastest-growing segment for service robotics, with the global retail robot market projected to exceed $14 billion by 2028. Unlike industrial robots operating in controlled factory environments, retail robots operate in unstructured, dynamic, and densely populated spaces where the primary obstacle is the customer. Every aspect of retail robot training data must account for the unpredictability of human behavior -- shoppers who suddenly change direction, children who run into aisles, and elderly customers using mobility aids who move at different speeds.",
        "The leading retail robot deployments illustrate the data challenge. Simbe Robotics' Tally shelf-scanning robot operates in over 100 retail chains, autonomously navigating store aisles to audit inventory, pricing, and planogram compliance. Brain Corp powers over 30,000 autonomous floor-cleaning and shelf-scanning robots deployed in retailers including Walmart, Kroger, and Sam's Club. Ocado's grid-based warehouse robots process over 220,000 orders per week at their automated Customer Fulfillment Centres. Each deployment requires training data that captures the specific store layouts, product assortments, and customer traffic patterns of real retail environments.",
        "Privacy is a first-order constraint that does not exist at the same level in industrial robotics. Retail robots operate among the general public, capturing images and video of customers, employees, and sometimes children. Data collection must comply with GDPR, CCPA, state biometric privacy laws (Illinois BIPA, Texas CUBI), and the retailer's own privacy commitments. Payment terminal areas are subject to PCI DSS restrictions. This means retail training data requires systematic face anonymization, payment area exclusion zones, and consent management protocols that add significant complexity compared to factory data collection.",
        "Product diversity is another defining challenge. A typical grocery store carries 30,000-50,000 SKUs. A home improvement store may carry over 250,000. Shelf-scanning robots must recognize products across sizes, packaging variants, promotional displays, and out-of-stock conditions. Training data must include every product facing, shelf configuration, and lighting condition encountered across a store chain's locations -- a combinatorial problem that scales rapidly with product count and store count."
      ]
    },
    {
      "type": "cards",
      "heading": "Regulatory Requirements",
      "cards": [
        {
          "title": "ADA / Equality Act Compliance (US/UK)",
          "description": "Retail robots must navigate without blocking accessible paths, wheelchair ramps, or assistance animal routes. Training data must include scenarios with wheelchair users, motorized scooters, walkers, canes, guide dogs, and other mobility aids. Robot footprint must allow 36-inch minimum clear passage per ADA guidelines. Data must capture the full range of mobility devices and assistance animals encountered in public retail spaces."
        },
        {
          "title": "GDPR / CCPA / State Privacy Laws",
          "description": "Retail robots capture images of the general public, triggering privacy obligations. GDPR requires lawful basis for processing, data minimization, and the right to erasure. CCPA grants California consumers the right to know what data is collected. Illinois BIPA requires written consent before collecting biometric identifiers. Training data must implement systematic face anonymization, customer consent management, and data retention limits."
        },
        {
          "title": "PCI DSS (International)",
          "description": "Payment Card Industry Data Security Standard prohibits capturing payment card data. Retail robot cameras near checkout areas must not record card numbers, PINs, or payment terminal screens. Training data collection must implement exclusion zones around payment terminals and self-checkout stations, with automated detection and redaction of any inadvertently captured payment information."
        },
        {
          "title": "FDA 21 CFR 110 / EU Regulation 852/2004",
          "description": "Food safety regulations apply to robots operating in grocery, deli, and food service areas. Robots must not introduce contamination risks. Training data for food-area robots must include the specific hygiene zone boundaries, product handling protocols, and cross-contamination prevention scenarios defined by food safety regulations."
        },
        {
          "title": "Local Sidewalk Robot Regulations (Varies)",
          "description": "Last-mile delivery robots face a patchwork of state and municipal regulations. Over 20 US states have passed delivery robot legislation, with varying weight limits (typically 80-120 lbs), speed limits (6-12 mph on sidewalks), and operational constraints (some jurisdictions ban sidewalk operation entirely). Training data must cover the specific infrastructure and pedestrian patterns of each jurisdiction where robots operate."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Environment Characteristics",
      "cards": [
        {
          "title": "Dense and Unpredictable Pedestrian Traffic",
          "description": "Retail stores during peak hours have pedestrian densities exceeding 0.5 persons per square meter. Shoppers stop abruptly, reverse direction, and cluster around promotional displays. Children behave unpredictably. Data challenge: Training data must capture the full distribution of pedestrian behaviors including worst-case scenarios: sudden stops, running children, dropped items, and crowded aisle bottlenecks. Data from off-peak hours alone will not train robust navigation."
        },
        {
          "title": "Extreme Product Visual Diversity",
          "description": "A grocery store contains 30,000-50,000 SKUs with packaging that changes seasonally. Products are transparent (water bottles), reflective (metal cans), deformable (bags), and near-identical between competing brands. Data challenge: Product recognition models must distinguish between thousands of visually similar items. Training data must cover every planogram configuration, seasonal packaging, promotional displays, and out-of-stock shelf gaps."
        },
        {
          "title": "Variable and Mixed Lighting",
          "description": "Retail environments combine fluorescent ceiling lights, LED accent lighting, natural light from windows and skylights, and refrigerator case lighting. Lighting changes throughout the day and varies dramatically between store sections. Data challenge: Product images captured under one lighting condition may not match the same product under different lighting. Training data must include the full lighting variation envelope across store zones and times of day."
        },
        {
          "title": "Narrow Aisles and Tight Turns",
          "description": "Standard grocery aisles are 1.2-1.8 meters wide when stocked. Endcaps, promotional displays, and floor stacks create additional obstacles. Checkout lanes are narrow corridors. Data challenge: Robot navigation must plan paths through constrained spaces while maintaining ADA-compliant clearance for shoppers. Training data must include the full range of aisle configurations from wide main aisles to narrow specialty sections."
        },
        {
          "title": "Floor Surface Variability",
          "description": "Retail floors include polished concrete, tile, carpet (in department stores), rubber mats near entrances, and spills. Seasonal transitions (wet floors from rain or snow) change traction. Data challenge: Robot localization systems that use floor features must handle specular reflections from polished floors and visual pattern changes from wet surfaces. Odometry calibration changes with floor material."
        }
      ]
    },
    {
      "type": "cards",
      "heading": "Common Robotics Tasks",
      "cards": [
        {
          "title": "Shelf Scanning and Inventory Audit",
          "description": "Autonomous robots traversing store aisles to scan shelves for out-of-stock items, planogram compliance, price accuracy, and promotional display verification. Data requirements: High-resolution shelf images (4K+) with per-SKU bounding boxes, product identification labels matched to UPC database, out-of-stock annotations, and planogram deviation flags. Coverage must include all shelf heights from floor level to top shelf (2+ meters)."
        },
        {
          "title": "Micro-Fulfillment Picking",
          "description": "Robots picking individual items from storage for online grocery orders in automated micro-fulfillment centers (MFCs). Data requirements: Dense bin images with per-item segmentation, grasp point annotations for deformable (produce bags) and rigid (cans, bottles) items, pick success/failure labels, and bin restock detection. Systems like those from Ocado, AutoStore, and Fabric handle 50,000+ SKUs."
        },
        {
          "title": "Last-Mile Delivery Navigation",
          "description": "Sidewalk robots delivering packages from stores to homes within 1-3 mile radius. Data requirements: Sidewalk and pedestrian path mapping, curb cut detection, crosswalk identification, pedestrian and cyclist avoidance, weather condition adaptation (rain, snow, darkness), and delivery point identification (doorstep, mailbox, designated area). Companies like Starship Technologies and Serve Robotics operate fleets of 1,000+ robots."
        },
        {
          "title": "Customer-Facing Service and Wayfinding",
          "description": "Robots that greet customers, answer questions, and guide them to product locations within the store. Data requirements: Natural language interaction datasets in noisy retail environments (60-80 dB ambient noise), human intent classification (looking for help vs. browsing), gesture recognition for pointing and beckoning, and multi-language support for diverse customer demographics."
        },
        {
          "title": "Autonomous Cleaning",
          "description": "Floor scrubbers and sweepers navigating store aisles during and after operating hours. Data requirements: Floor condition classification (clean, dusty, wet, spill), obstacle detection at floor level (dropped products, carts, feet), cleaning coverage mapping, and navigation in both empty-store and occupied-store configurations. Brain Corp powers over 30,000 cleaning robots in retail."
        },
        {
          "title": "Checkout-Free Store Perception",
          "description": "Computer vision systems tracking customers and product interactions in checkout-free stores (Amazon Just Walk Out, Grabango, AiFi). Data requirements: Multi-camera multi-person tracking, product pick/put-back event detection, hand-product interaction classification, and customer identity maintenance across camera handoffs throughout the store visit."
        }
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Data Requirements by Robot Type in Retail",
      "description": "Retail robots range from shelf-scanning towers to sidewalk delivery pods. Each type has distinct sensor, privacy, and interaction requirements.",
      "columns": ["Robot Type", "Primary Sensors", "Data Volume", "Key Annotations", "Privacy Constraint"],
      "rows": [
        {
          "Robot Type": "Shelf Scanner (in-store)",
          "Primary Sensors": "RGB array (multi-height), depth",
          "Data Volume": "1M+ shelf images per chain",
          "Key Annotations": "Per-SKU bounding box, OOS, planogram deviation",
          "Privacy Constraint": "Face anonymization, employee consent"
        },
        {
          "Robot Type": "MFC Picking Robot",
          "Primary Sensors": "RGB-D, gripper force, bin sensor",
          "Data Volume": "500K+ pick episodes",
          "Key Annotations": "Item segmentation, grasp point, pick success",
          "Privacy Constraint": "Minimal (warehouse only)"
        },
        {
          "Robot Type": "Sidewalk Delivery Robot",
          "Primary Sensors": "RGB, LiDAR, GPS, IMU",
          "Data Volume": "50K+ km delivery routes",
          "Key Annotations": "Sidewalk map, curb cuts, pedestrians, weather",
          "Privacy Constraint": "Pedestrian anonymization, property boundaries"
        },
        {
          "Robot Type": "Customer Service Robot",
          "Primary Sensors": "RGB-D, microphone array, speaker",
          "Data Volume": "100K+ interaction episodes",
          "Key Annotations": "Intent, gesture, NLP, satisfaction",
          "Privacy Constraint": "Full GDPR/CCPA consent, voice anonymization"
        },
        {
          "Robot Type": "Autonomous Floor Cleaner",
          "Primary Sensors": "LiDAR, RGB, ultrasonic",
          "Data Volume": "10K+ hours cleaning routes",
          "Key Annotations": "Floor condition, obstacle class, coverage map",
          "Privacy Constraint": "Face anonymization during store hours"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Real-World Deployments",
      "paragraphs": [
        "Simbe Robotics deploys its Tally shelf-scanning robot in over 100 retail chains globally, including major grocery and home improvement retailers. Tally navigates store aisles autonomously, capturing shelf images at multiple heights and angles. The robot identifies out-of-stock items, pricing errors, and planogram deviations with reported accuracy exceeding 95%. Training data for Tally must cover the specific planograms, product assortments, and store layouts of each retail chain, as a shelf that looks 'correct' in one chain may violate planogram rules in another.",
        "Brain Corp's BrainOS powers over 30,000 autonomous robots deployed across retailers including Walmart, Kroger, Sam's Club, and Schnucks. Their platform supports both floor cleaning (Tennant T7AMR) and shelf scanning (SoftBank Whiz). Brain Corp's fleet has driven over 1 billion autonomous miles in retail environments, generating massive datasets on pedestrian behavior, store layouts, and obstacle patterns. The training data challenge is generalization: a robot trained in Walmart stores must also work in Kroger stores with different aisle widths, lighting, and customer demographics.",
        "Starship Technologies has completed over 7 million autonomous deliveries across university campuses and suburban neighborhoods, with a fleet exceeding 2,500 robots. Their sidewalk robots navigate using a combination of computer vision, GPS, and ultra-wideband sensors. Training data must cover the enormous variety of sidewalk conditions: cracked pavement, construction detours, snow-covered paths, unmarked crosswalks, and the unpredictable behavior of pedestrians, cyclists, and dogs encountered on delivery routes.",
        "Ocado's automated Customer Fulfillment Centres use a grid of thousands of robots moving on a 3D track system to pick groceries for online orders. The Andover CFC processes over 220,000 orders per week. Each robot must navigate the grid, avoid other robots, and manipulate a diverse range of products from fragile eggs to heavy bottles. The training data includes millions of pick episodes with success/failure labels, product damage annotations, and grid traffic patterns that optimize throughput.",
        "Amazon's Just Walk Out technology, deployed in over 140 stores before being scaled back in 2024, used ceiling-mounted camera arrays and shelf sensors to track shoppers and their product selections. The system required training data covering multi-person tracking across hundreds of cameras, product interaction detection (pick vs. put-back vs. examine), and identity maintenance as customers moved through camera coverage zones. The data challenges -- occlusion in crowded conditions, visually similar products, and edge cases like customers handing items to each other -- proved significant enough that Amazon shifted toward a hybrid approach combining computer vision with simpler smart cart technology."
      ]
    },
    {
      "type": "prose",
      "heading": "Relevant Data Modalities",
      "paragraphs": [
        "Retail robotics uses a sensor mix optimized for close-range indoor navigation and fine-grained product recognition. Core modalities include RGB cameras (2-12 megapixel, often in multi-camera arrays for shelf scanning), depth sensors (structured light or stereo for 3D shelf mapping and obstacle detection), 2D LiDAR (for navigation and obstacle avoidance in aisles), ultrasonic sensors (for low-height obstacle detection like shopping cart wheels and feet), and weight sensors (for smart shelves in checkout-free stores). Delivery robots add GPS, IMU, and wheel odometry for outdoor navigation.",
        "Audio is more important in retail than in most other robotics domains. Customer service robots require microphone arrays for speech recognition in noisy environments (60-80 dB from music, announcements, and chatter). Sound localization helps robots identify when a customer is speaking to them versus to a companion. Training data must include retail-specific audio with realistic ambient noise profiles, regional accents, and the reverberant acoustics of large retail spaces.",
        "Privacy-preserving sensor modalities are an emerging area. Some retail deployments use thermal cameras or structured-light depth-only sensors that capture occupancy and movement without identifiable imagery. Radar-based people counting avoids capturing any visual data. Training data for these privacy-first approaches requires paired captures: a privacy-preserving modality (thermal, depth-only, radar) captured simultaneously with a ground-truth-providing modality (RGB with consent), enabling model training on the privacy-safe modality with transfer from the ground-truth source."
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "khandelwal-retail-robots-2017",
          "title": "BWIBots: A Platform for Bridging the Gap Between AI and Human-Robot Interaction Research",
          "authors": "Khandelwal et al.",
          "venue": "International Journal of Robotics Research 2017",
          "year": 2017,
          "url": "https://doi.org/10.1177/0278364917710766"
        },
        {
          "id": "tonkin-retail-navigation-2023",
          "title": "Mobile Robot Navigation in Dynamic Retail Environments",
          "authors": "Tonkin et al.",
          "venue": "Robotics and Autonomous Systems 2023",
          "year": 2023,
          "url": "https://doi.org/10.1016/j.robot.2023.104425"
        },
        {
          "id": "goldman-product-recognition-2022",
          "title": "Retail Product Recognition: Challenges and Approaches",
          "authors": "Goldman et al.",
          "venue": "IEEE/CVF CVPR Workshop 2022",
          "year": 2022,
          "url": "https://arxiv.org/abs/2205.00275"
        },
        {
          "id": "starship-delivery-2024",
          "title": "Autonomous Delivery Robot Fleet Operations at Scale",
          "authors": "Starship Technologies",
          "venue": "Industry White Paper 2024",
          "year": 2024,
          "url": "https://www.starship.xyz/technology/"
        },
        {
          "id": "brain-corp-fleet-2024",
          "title": "BrainOS: Autonomous Navigation for Commercial Robots at Scale",
          "authors": "Brain Corp",
          "venue": "Industry Report 2024",
          "year": 2024,
          "url": "https://www.braincorp.com/resources"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Serves Retail Automation",
      "paragraphs": [
        "Claru collects training data in retail environments with privacy as a first-order constraint. All captured imagery passes through our automated anonymization pipeline, which applies face detection and blurring at capture time -- before any data leaves the collection device. We implement PCI DSS exclusion zones around payment terminals and checkout areas. For deployments requiring customer consent, we provide multi-language consent signage and opt-out mechanisms that comply with GDPR, CCPA, and state biometric privacy laws.",
        "For shelf scanning and inventory applications, our annotation pipeline delivers per-SKU product bounding boxes matched to the retailer's product database, with out-of-stock detection, planogram deviation flags, and price label verification. We handle the extreme product diversity of retail environments by building chain-specific product recognition datasets that cover the full assortment including seasonal, promotional, and private-label items. Our annotators are trained on retail-specific challenges: distinguishing nearly identical products from competing brands, recognizing partially obscured items behind shelf dividers, and correctly labeling items in non-standard display positions.",
        "For delivery robots, we collect sidewalk navigation data across diverse neighborhoods with annotations for curb cuts, crosswalks, pedestrian zones, construction barriers, and weather conditions. All retail data is delivered with full privacy compliance documentation including anonymization verification reports and data protection impact assessments suitable for GDPR Article 35 submissions."
      ]
    }
  ],
  "faqs": [
    {
      "question": "How does Claru handle privacy when collecting retail training data?",
      "answer": "Privacy is our primary constraint in retail data collection. We implement a multi-layer privacy framework. First, face detection and blurring runs on the collection device in real time, ensuring no identifiable imagery is ever stored or transmitted. Second, we implement PCI DSS exclusion zones that prevent cameras from capturing payment terminal screens, card readers, or PIN pads. Third, for jurisdictions requiring explicit consent (GDPR, Illinois BIPA), we deploy multi-language consent signage at store entrances and provide opt-out mechanisms. Fourth, our data retention policy automatically deletes raw captures after annotation is complete, retaining only the anonymized, annotated dataset. We provide a Data Protection Impact Assessment template for each retail client."
    },
    {
      "question": "Can Claru build product recognition datasets for stores with 50,000+ SKUs?",
      "answer": "Yes. Large-SKU product recognition is one of our core retail capabilities. We approach the scale challenge systematically. First, we capture reference images of every product facing in the retailer's planogram under controlled lighting to build a product database. Second, we capture in-situ shelf images across multiple stores with real-world lighting, partial occlusion, and shelf wear. Third, our annotation pipeline links each in-situ product instance to the reference database using UPC codes. We handle the practical challenges of retail product recognition: seasonal packaging changes are captured through quarterly update campaigns, promotional and seasonal displays are annotated separately, and we maintain a catalog of visually similar products that require extra annotation attention."
    },
    {
      "question": "What data does Claru provide for sidewalk delivery robots?",
      "answer": "Our sidewalk delivery datasets cover the full spectrum of last-mile navigation challenges. We collect route data across diverse suburban and urban neighborhoods with annotations for sidewalk surface condition (cracks, slopes, lips), curb cuts and their accessibility compliance, crosswalk locations and signal timing, construction detours, and seasonal conditions (snow, ice, fallen leaves, wet surfaces). Pedestrian and cyclist behavior data is captured with anonymized tracks showing velocity, trajectory, and interaction patterns with the robot's path. We cover the regulatory requirements of specific jurisdictions, including the weight and speed limits defined in each state's delivery robot legislation."
    },
    {
      "question": "How does Claru handle the variable lighting in retail environments?",
      "answer": "Retail lighting is challenging because it combines multiple sources (fluorescent, LED, natural, refrigerator) that vary by store zone and time of day. Our collection methodology captures shelf images at multiple times: morning (high natural light from windows), midday (peak fluorescent), and evening (reduced natural light). We capture in all store zones including the dramatically different lighting of produce sections, refrigerated aisles, and bakery/deli areas. Each image is annotated with lighting zone metadata. For shelf-scanning robots that operate during store hours, we additionally capture under the robot's own illumination to ensure training data matches the robot's actual sensing conditions."
    },
    {
      "question": "Does Claru provide training data for checkout-free store systems?",
      "answer": "Yes. We provide multi-camera datasets for checkout-free store perception, including multi-person tracking across overlapping camera fields of view, product interaction event detection (pick, put-back, examine, hand-to-companion), and customer identity maintenance across camera handoffs. These datasets are especially privacy-sensitive and require explicit participant consent. We recruit consented participants who simulate realistic shopping behaviors including the edge cases that challenge these systems: reaching behind products, handling multiple items simultaneously, returning items to wrong locations, and crowded scenarios where multiple customers interact with the same shelf section."
    }
  ],
  "ctaHeading": "Discuss Retail Automation Data Needs",
  "ctaDescription": "Tell us about your retail robotics project -- whether it is shelf scanning, micro-fulfillment, delivery robots, or checkout-free perception. Claru will scope a privacy-compliant data collection plan tailored to your store environments and product assortment.",
  "relatedGlossaryTerms": [
    "embodied-ai",
    "physical-ai",
    "teleoperation-data",
    "egocentric-video",
    "sim-to-real-transfer"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "regulations": [
    {
      "name": "ADA / Equality Act",
      "jurisdiction": "US / UK",
      "description": "Accessibility requirements for robots operating in public retail spaces.",
      "dataImplications": "Training data must include wheelchair users, mobility aids, guide dogs, and 36-inch minimum clearance scenarios."
    },
    {
      "name": "GDPR / CCPA / State Privacy Laws",
      "jurisdiction": "EU / US",
      "description": "Privacy obligations for capturing images of the general public.",
      "dataImplications": "Systematic face anonymization, consent management, data minimization, and right-to-erasure support."
    },
    {
      "name": "PCI DSS",
      "jurisdiction": "International",
      "description": "Payment card data security prohibiting capture of card numbers and PINs.",
      "dataImplications": "Exclusion zones around payment terminals; automated detection and redaction of payment information."
    },
    {
      "name": "FDA 21 CFR 110 / EU 852/2004",
      "jurisdiction": "US / EU",
      "description": "Food safety regulations for robots operating near food areas.",
      "dataImplications": "Hygiene zone boundaries, product handling protocols, and cross-contamination prevention scenarios."
    },
    {
      "name": "State Delivery Robot Laws (US)",
      "jurisdiction": "US (varies by state)",
      "description": "Over 20 US states regulate sidewalk delivery robots with varying weight, speed, and operational limits.",
      "dataImplications": "Jurisdiction-specific sidewalk and pedestrian data matching local regulatory constraints."
    }
  ],
  "environmentCharacteristics": [
    {
      "characteristic": "Dense Pedestrian Traffic",
      "description": "Peak-hour density exceeding 0.5 persons/sq meter with unpredictable movement patterns.",
      "dataChallenge": "Must capture full behavior distribution: sudden stops, running children, crowded bottlenecks."
    },
    {
      "characteristic": "Extreme Product Diversity",
      "description": "30,000-250,000 SKUs per store with seasonal packaging changes.",
      "dataChallenge": "Product recognition across thousands of visually similar items, promotional variants, and out-of-stock gaps."
    },
    {
      "characteristic": "Variable Mixed Lighting",
      "description": "Fluorescent, LED, natural, and refrigerator lighting varying by zone and time of day.",
      "dataChallenge": "Product appearance changes dramatically with lighting. Data must cover all zones and times."
    },
    {
      "characteristic": "Narrow Constrained Aisles",
      "description": "1.2-1.8 meter aisle widths plus endcaps, displays, and floor stacks.",
      "dataChallenge": "Navigation through tight spaces maintaining ADA clearance for shoppers and mobility devices."
    },
    {
      "characteristic": "Floor Surface Variability",
      "description": "Polished concrete, tile, carpet, rubber mats, and seasonal wet/snow conditions.",
      "dataChallenge": "Localization on specular floors; odometry calibration changes with floor material and condition."
    }
  ],
  "commonTasks": [
    {
      "task": "Shelf Scanning and Inventory Audit",
      "description": "Autonomous aisle traversal to scan shelves for out-of-stock, pricing, and planogram compliance.",
      "dataRequirements": "4K+ shelf images with per-SKU bounding boxes, OOS annotations, and planogram deviation flags."
    },
    {
      "task": "Micro-Fulfillment Picking",
      "description": "Picking individual items from storage bins for online grocery orders.",
      "dataRequirements": "Dense bin images with per-item segmentation, grasp points for deformable and rigid items, pick success labels."
    },
    {
      "task": "Last-Mile Delivery Navigation",
      "description": "Sidewalk robots delivering packages within 1-3 mile radius.",
      "dataRequirements": "Sidewalk mapping, curb cuts, crosswalks, pedestrian avoidance, weather adaptation, delivery point ID."
    },
    {
      "task": "Customer Service and Wayfinding",
      "description": "Greeting customers, answering questions, guiding to product locations.",
      "dataRequirements": "NLP in 60-80 dB noise, human intent classification, gesture recognition, multi-language support."
    },
    {
      "task": "Autonomous Floor Cleaning",
      "description": "Navigating store aisles for floor scrubbing during and after operating hours.",
      "dataRequirements": "Floor condition classification, low-height obstacle detection, coverage mapping, occupied/empty-store nav."
    },
    {
      "task": "Checkout-Free Perception",
      "description": "Multi-camera tracking of customers and product interactions for frictionless checkout.",
      "dataRequirements": "Multi-person tracking, product pick/put-back detection, identity maintenance across camera handoffs."
    }
  ],
  "relevantModalities": [
    "RGB camera (2-12 MP, multi-camera arrays)",
    "Structured-light depth / stereo",
    "2D LiDAR (navigation)",
    "Ultrasonic (low-height obstacles)",
    "Weight sensors (smart shelves)",
    "Microphone array (speech, ambient)",
    "GPS / IMU / wheel odometry (outdoor delivery)",
    "Thermal / depth-only (privacy-preserving)"
  ],
  "keyPapers": [
    {
      "id": "khandelwal-retail-robots-2017",
      "title": "BWIBots: A Platform for Bridging the Gap Between AI and Human-Robot Interaction Research",
      "authors": "Khandelwal et al.",
      "venue": "International Journal of Robotics Research 2017",
      "year": 2017,
      "url": "https://doi.org/10.1177/0278364917710766"
    },
    {
      "id": "tonkin-retail-navigation-2023",
      "title": "Mobile Robot Navigation in Dynamic Retail Environments",
      "authors": "Tonkin et al.",
      "venue": "Robotics and Autonomous Systems 2023",
      "year": 2023,
      "url": "https://doi.org/10.1016/j.robot.2023.104425"
    },
    {
      "id": "goldman-product-recognition-2022",
      "title": "Retail Product Recognition: Challenges and Approaches",
      "authors": "Goldman et al.",
      "venue": "IEEE/CVF CVPR Workshop 2022",
      "year": 2022,
      "url": "https://arxiv.org/abs/2205.00275"
    },
    {
      "id": "starship-delivery-2024",
      "title": "Autonomous Delivery Robot Fleet Operations at Scale",
      "authors": "Starship Technologies",
      "venue": "Industry White Paper 2024",
      "year": 2024,
      "url": "https://www.starship.xyz/technology/"
    },
    {
      "id": "brain-corp-fleet-2024",
      "title": "BrainOS: Autonomous Navigation for Commercial Robots at Scale",
      "authors": "Brain Corp",
      "venue": "Industry Report 2024",
      "year": 2024,
      "url": "https://www.braincorp.com/resources"
    }
  ],
  "claruRelevance": "Claru collects retail training data with privacy as the primary constraint -- real-time face anonymization, PCI DSS exclusion zones, and GDPR/CCPA compliance documentation. We deliver per-SKU shelf scanning datasets matched to retailer product databases, privacy-compliant pedestrian navigation data for delivery robots, and multi-camera interaction datasets for checkout-free perception. All data includes anonymization verification reports and data protection impact assessments."
};

export default data;
