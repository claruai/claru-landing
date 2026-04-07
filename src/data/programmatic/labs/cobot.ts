import type { LabPageData } from "./types";

const page: LabPageData = {
  slug: "cobot",
  companyName: "Cobot (Collaborative Robotics)",
  companyDescription:
    "Collaborative Robotics (Cobot) builds autonomous mobile manipulators designed for logistics and warehouse environments. Founded by Brad Porter, former VP at Amazon Robotics, the company focuses on robots that work alongside humans in fulfillment centers with minimal infrastructure changes.",
  keyProducts: ["Cobot Mobile Manipulator"],
  researchFocus: [
    "Autonomous mobile manipulation in logistics",
    "Human-robot collaboration in fulfillment",
    "Perception for cluttered warehouse environments",
    "Minimal-infrastructure deployment",
    "Fleet coordination and multi-robot planning",
  ],
  dataNeedsSummary:
    "Cobot's focus on warehouse logistics with minimal infrastructure requirements means their robots must perceive and navigate real warehouse environments using onboard sensors alone. They need data from diverse fulfillment centers to train perception and manipulation models that work without custom QR codes, conveyor integration, or modified shelving.",
  dataNeeds: [
    {
      title: "Warehouse perception data without infrastructure markers",
      source: "Cobot's design philosophy of minimal infrastructure deployment",
      description: "Visual data from diverse warehouses without fiducial markers — training perception models that work with natural features, product labels, and shelf geometry.",
    },
    {
      title: "Mobile manipulation in cluttered aisles",
      source: "Brad Porter's public talks on warehouse robotics challenges",
      description: "Manipulation recordings in realistic warehouse aisle conditions with nearby inventory, varying shelf heights, and limited workspace for approach and retrieval.",
    },
    {
      title: "Human co-worker activity patterns",
      source: "Collaborative deployment model emphasizing human-robot shared workspace",
      description: "Data on human worker movement patterns, picking behaviors, and cart/pallet interactions in fulfillment centers for training safe collaborative policies.",
    },
    {
      title: "Inventory diversity and product recognition",
      source: "Amazon-style fulfillment center product variety requirements",
      description: "Visual data covering tens of thousands of SKU types across product categories — electronics, apparel, groceries, household goods — with varying packaging, labeling, and physical dimensions for robust object recognition.",
    },
    {
      title: "Shift-pattern and throughput optimization data",
      source: "Cobot's focus on operational ROI for logistics customers",
      description: "Time-series data from real fulfillment operations capturing order flow rates, worker density changes, aisle congestion patterns, and seasonal volume spikes that affect robot path planning and task scheduling.",
    },
  ],
  dataMatches: [
    {
      labNeed: "Warehouse perception data without infrastructure markers",
      claruOffering: "Custom Warehouse Visual Collection",
      rationale: "Claru can collect visual data in real warehouses without any infrastructure modifications, capturing the authentic visual conditions that Cobot's robots must handle.",
    },
    {
      labNeed: "Mobile manipulation in cluttered aisles",
      claruOffering: "Manipulation Trajectory Dataset + Egocentric Activity Dataset",
      rationale: "Claru's manipulation and egocentric data provides examples of object interactions in constrained spaces, supplemented by targeted warehouse collection campaigns.",
    },
    {
      labNeed: "Human co-worker activity patterns",
      claruOffering: "Egocentric Activity Dataset (~386K clips)",
      rationale: "Claru's egocentric video captures human activities from a first-person perspective — including workplace scenarios that parallel fulfillment center workflows.",
    },
    {
      labNeed: "Inventory diversity and product recognition",
      claruOffering: "Custom Product Scanning Collection",
      rationale: "Claru's global collector network can capture images and videos of diverse product categories across retail and warehouse environments, providing the SKU-level visual variety needed for robust recognition models.",
    },
  ],
  keyPapers: [
    {
      id: "porter-warehouse-2024",
      title: "Scaling Warehouse Robotics Without Infrastructure",
      authors: "Porter, B.",
      venue: "Collaborative Robotics Blog",
      year: 2024,
      url: "https://www.cobot.co/",
    },
    {
      id: "yokoyama-mobile-manip-2023",
      title: "Adaptive Skill Coordination for Robotic Mobile Manipulation",
      authors: "Yokoyama et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.00410",
    },
    {
      id: "xia-navigation-2023",
      title: "Kinematic-Aware Mobile Manipulation",
      authors: "Xia et al.",
      venue: "IROS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2011.00487",
    },
    {
      id: "gu-rt-trajectory-2023",
      title: "RT-Trajectory: Robotic Task Generalization via Hindsight Trajectory Sketches",
      authors: "Gu et al.",
      venue: "arXiv 2311.01977",
      year: 2023,
      url: "https://arxiv.org/abs/2311.01977",
    },
    {
      id: "correll-warehouse-2016",
      title: "Analysis and Observations from the First Amazon Picking Challenge",
      authors: "Correll et al.",
      venue: "TRO 2018",
      year: 2018,
      url: "https://arxiv.org/abs/1601.05484",
    },
    {
      id: "wu-tidybot-2023",
      title: "TidyBot: Personalized Robot Assistance with Large Language Models",
      authors: "Wu et al.",
      venue: "IROS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2305.18238",
    },
  ],
  technicalAnalysis:
    "Cobot's founding team from Amazon Robotics brings deep operational understanding of warehouse logistics. Brad Porter's insight is that most warehouse robotics fails not because of hardware limitations but because of deployment complexity — robots that require custom infrastructure, modified shelving, or fiducial markers are impractical for the majority of fulfillment operations. This philosophy drives Cobot toward perception-first robotics that must work with existing warehouse infrastructure.\n\nThis design decision creates a specific and demanding data requirement: visual data from real, unmodified warehouses. Most warehouse robot training data is collected in structured settings with QR codes, standardized shelving, and controlled lighting. Cobot needs data from warehouses as they actually exist — with handwritten labels, mixed shelving systems, varying inventory densities, and non-uniform lighting. This data diversity is essential for training perception models that generalize across the heterogeneous warehouse landscape.\n\nThe mobile manipulation dimension adds complexity. Unlike fixed-base picking systems, Cobot's robots must coordinate base movement with arm manipulation — approaching shelves, positioning for picks, navigating cluttered aisles with inventory. This integrated behavior requires training data that captures the full mobile manipulation pipeline from navigation through approach to grasp execution.\n\nThe collaborative aspect is perhaps the most data-critical. Cobot's robots share aisles with human pickers, requiring accurate prediction of human movement patterns, picking behaviors, and potential interference. This demands training data collected during actual human fulfillment operations — something that cannot be simulated because human behavior in warehouses follows patterns shaped by fatigue, shift timing, and workflow optimization that are inherently unpredictable.\n\nAt fleet scale, Cobot must also solve multi-robot coordination problems. When dozens of mobile manipulators share a warehouse floor, path planning becomes a multi-agent problem where each robot's navigation affects every other robot. Training this coordination requires data from real multi-agent environments where congestion, deadlocks, and priority conflicts emerge naturally from operational throughput demands.",

  metaTitle: "Training Data for Collaborative Robotics (Cobot) | Claru",
  metaDescription:
    "Warehouse perception, mobile manipulation, and human collaboration data for Collaborative Robotics' infrastructure-minimal autonomous fulfillment robots.",
  primaryKeyword: "Cobot training data",
  secondaryKeywords: ["Collaborative Robotics data", "warehouse robot training data", "mobile manipulation data", "fulfillment robotics"],
  canonicalPath: "/for/cobot",
  h1: "Training Data for Collaborative Robotics",
  heroSubtitle:
    "Cobot builds warehouse robots that work without custom infrastructure. That means their perception and navigation must handle real warehouses as they actually exist.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Labs", href: "/for" },
    { label: "Cobot", href: "/for/cobot" },
  ],
  sections: [
    {
      type: "prose",
      heading: "About Collaborative Robotics",
      paragraphs: [
        "Collaborative Robotics was founded in 2022 by Brad Porter, who served as VP of Robotics at Amazon where he oversaw the deployment of more than 750,000 robotic drive units across Amazon's global fulfillment network. At Amazon, Porter saw firsthand that the biggest obstacle to warehouse automation was not robot capability but deployment complexity — the extensive infrastructure modifications required by most robotic systems made them impractical for the majority of facilities.",
        "Cobot's mobile manipulator is designed to drop into existing warehouses and begin operating on day one. The robot uses onboard perception — stereo cameras, LiDAR, and depth sensors — to understand its environment without any installed fiducial markers, floor guides, or custom shelving. This infrastructure-minimal approach dramatically reduces deployment cost and time, making robotic automation accessible to mid-size fulfillment operations that cannot justify the capital expenditure of traditional warehouse automation.",
        "The company has raised over $100 million in funding from investors including Sequoia Capital and Khosla Ventures. Cobot is headquartered in Santa Clara, California, with a growing engineering team drawn from Amazon Robotics, Google, and leading mobile manipulation research labs.",
      ],
    },
    {
      type: "stats",
      heading: "Cobot at a Glance",
      stats: [
        { value: "2022", label: "Founded" },
        { value: "Amazon", label: "Founder Origin" },
        { value: "$100M+", label: "Total Funding" },
        { value: "750K+", label: "Robots at Amazon (Porter)" },
        { value: "Zero", label: "Infrastructure Required" },
      ],
    },
    {
      type: "prose",
      heading: "Research Focus and Key Projects",
      paragraphs: [
        "Cobot's research program is focused on three core capabilities: infrastructure-free perception, coordinated mobile manipulation, and safe human-robot coexistence. Unlike most robotics startups that emphasize novel hardware, Cobot's differentiation is entirely on the software and AI side — building perception and planning systems robust enough to handle the visual and geometric chaos of real warehouses.",
        "The perception challenge is substantial. A typical fulfillment center contains tens of thousands of unique products across hundreds of shelving configurations, with lighting that varies from fluorescent-lit interior aisles to daylight-exposed loading docks. Products are often stored in non-standardized ways: loose items in bins, irregularly stacked boxes, and products with reflective or transparent packaging that confounds depth sensors. Cobot's vision system must handle all of this without the crutch of QR codes or standardized labels.",
        "On the manipulation side, Cobot's mobile platform must coordinate arm movement with base positioning in real time. Picking an item from a high shelf requires the base to position itself at the correct distance, the arm to plan a collision-free trajectory through surrounding inventory, and the gripper to execute a stable grasp on potentially fragile or deformable products — all while a human picker may be approaching from the adjacent aisle.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Warehouse Robotics Approaches",
      description: "How Cobot's infrastructure-minimal approach compares to traditional warehouse automation systems.",
      columns: ["Feature", "Cobot", "Traditional AGV Systems", "Fixed Picking Stations"],
      rows: [
        { "Feature": "Infrastructure Required", "Cobot": "None", "Traditional AGV Systems": "Floor markers, WiFi beacons", "Fixed Picking Stations": "Conveyor integration" },
        { "Feature": "Deployment Time", "Cobot": "Days", "Traditional AGV Systems": "Weeks to months", "Fixed Picking Stations": "Months" },
        { "Feature": "Manipulation", "Cobot": "Full arm + gripper", "Traditional AGV Systems": "Transport only", "Fixed Picking Stations": "Fixed-base arm" },
        { "Feature": "Human Coexistence", "Cobot": "Shared aisles", "Traditional AGV Systems": "Zoned separation", "Fixed Picking Stations": "Caged workstations" },
        { "Feature": "Adaptability", "Cobot": "Any warehouse layout", "Traditional AGV Systems": "Requires mapped routes", "Fixed Picking Stations": "Fixed location" },
      ],
    },
    {
      type: "prose",
      heading: "Data Requirements Analysis",
      paragraphs: [
        "Cobot's infrastructure-minimal philosophy means their robots must learn to perceive and navigate from raw sensory input rather than relying on environmental modifications. This places an exceptionally high burden on training data quality and diversity. The perception model must generalize across warehouse types that differ in shelving material, aisle width, ceiling height, lighting, and product density.",
        "The mobile manipulation pipeline requires data that captures the full task sequence: detecting a target item on a shelf, navigating the base to an appropriate approach position, planning an arm trajectory that avoids surrounding inventory, executing the grasp, and stowing the item — all in a single continuous recording. Most existing manipulation datasets capture only the grasp execution phase, missing the navigation and approach planning that are critical for mobile platforms.",
        "Human coexistence data is perhaps the hardest requirement to satisfy. The robot must predict human worker behavior to avoid collisions and coordinate shared aisle access. This requires recordings from active fulfillment operations where human workers are performing their normal tasks — data that captures the real cadence of warehouse work rather than the artificial patterns that emerge when workers know they are being recorded.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Cobot",
      paragraphs: [
        "Claru's collector network spans real warehouse and fulfillment environments, enabling data collection under authentic operating conditions. By deploying body-worn cameras and standardized sensor rigs in active warehouses, Claru captures the visual conditions, human activity patterns, and environmental geometry that Cobot's perception models must handle.",
        "For product recognition, Claru can systematically capture images and videos of diverse product categories across retail and warehouse settings. This provides the SKU-level visual variety needed for recognition models that work with any inventory mix — from electronics to groceries to apparel.",
        "Claru's egocentric activity dataset of 386K+ clips is directly valuable for Cobot's human behavior prediction models. First-person video of people performing workplace tasks captures the movement patterns, body language, and interaction rhythms that robots must understand to share space safely with human workers.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "correll-warehouse-2016",
          title: "Analysis and Observations from the First Amazon Picking Challenge",
          authors: "Correll et al.",
          venue: "TRO 2018",
          year: 2018,
          url: "https://arxiv.org/abs/1601.05484",
        },
        {
          id: "yokoyama-mobile-manip-2023",
          title: "Adaptive Skill Coordination for Robotic Mobile Manipulation",
          authors: "Yokoyama et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2304.00410",
        },
        {
          id: "gu-rt-trajectory-2023",
          title: "RT-Trajectory: Robotic Task Generalization via Hindsight Trajectory Sketches",
          authors: "Gu et al.",
          venue: "arXiv 2311.01977",
          year: 2023,
          url: "https://arxiv.org/abs/2311.01977",
        },
        {
          id: "wu-tidybot-2023",
          title: "TidyBot: Personalized Robot Assistance with Large Language Models",
          authors: "Wu et al.",
          venue: "IROS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2305.18238",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Why does Cobot need data from unmodified warehouses?",
      answer: "Cobot's key differentiator is deployment without custom infrastructure — no QR codes, modified shelving, or fiducial markers. This means their perception models must work with natural warehouse features: handwritten labels, mixed shelving systems, varying inventory, and non-uniform lighting. Training data must come from real, unmodified facilities.",
    },
    {
      question: "What is mobile manipulation and why does it need special data?",
      answer: "Mobile manipulation combines base navigation with arm manipulation — the robot must approach shelves, position itself, and execute picks in cluttered aisles. Unlike fixed-base picking, this requires training data that captures the full pipeline from navigation through manipulation in realistic warehouse geometries.",
    },
    {
      question: "How important is human activity data for Cobot's robots?",
      answer: "Extremely important. Cobot's robots share aisles with human pickers, requiring accurate prediction of human movement, picking behavior, and potential interference. This data must come from real fulfillment operations because human warehouse behavior follows patterns shaped by fatigue, workflow optimization, and social dynamics that simulations cannot capture.",
    },
    {
      question: "How does Brad Porter's Amazon experience shape Cobot's data needs?",
      answer: "Porter oversaw 750,000+ robotic units at Amazon and learned that deployment complexity — not robot capability — is the primary barrier to warehouse automation. This drives Cobot's infrastructure-minimal approach, which shifts the burden from physical infrastructure to perception AI, making training data diversity across warehouse types the critical requirement.",
    },
    {
      question: "Can simulation replace real warehouse data for Cobot's training?",
      answer: "Simulation helps for basic navigation but fails to capture the visual complexity of real warehouses — handwritten shelf labels, mixed product packaging, non-uniform lighting, and dynamic human activity patterns. Cobot's infrastructure-free approach means the perception system must handle visual conditions that are impossible to fully simulate, making real-world data essential.",
    },
  ],
  ctaHeading: "Data for Infrastructure-Free Warehouse Robots",
  ctaDescription: "Discuss authentic warehouse data collection for Cobot's perception and manipulation systems.",
  relatedGlossaryTerms: ["egocentric-video", "scene-understanding", "manipulation-trajectory"],
  relatedGuidePages: ["how-to-collect-warehouse-robot-data", "how-to-collect-egocentric-video-data"],
  relatedSolutionSlugs: [],
};

export default page;
