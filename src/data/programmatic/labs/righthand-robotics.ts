import type { LabPageData } from "./types";

const page: LabPageData = {
  slug: "righthand-robotics",
  companyName: "RightHand Robotics",
  companyDescription: "RightHand Robotics builds intelligent robotic picking systems for e-commerce and logistics fulfillment. Founded in 2014 by a team from the Harvard Biorobotics Lab, the company combines proprietary soft gripper hardware with AI-powered pick planning software. Their RightPick platform handles millions of picks per month across customer warehouses.",
  keyProducts: ["RightPick 3 (intelligent picking system)", "RightPick AI (pick planning software)", "Soft gripper end-effector hardware"],
  researchFocus: ["Soft robotics for adaptive grasping", "Vision-based grasp planning", "Piece-level warehouse picking", "Multi-item order fulfillment automation", "Grasp success prediction"],
  dataNeedsSummary: "RightHand Robotics' piece-level picking system needs training data covering the enormous diversity of e-commerce SKUs \u2014 from small electronics to irregularly shaped products to flexible packaging. Their soft gripper approach reduces the grasp planning complexity compared to rigid grippers, but still requires extensive visual data to plan pick points and predict grasp success across unfamiliar objects.",
  dataNeeds: [
    {
        "title": "Diverse SKU visual recognition data",
        "source": "RightHand Robotics product literature and customer deployments",
        "description": "High-resolution images and video of diverse e-commerce products from multiple angles, in various packaging states, and under warehouse lighting conditions for training pick-point detection and object recognition."
    },
    {
        "title": "Grasp outcome recordings",
        "source": "RightHand Robotics research on grasp prediction",
        "description": "Video recordings of grasp attempts (successful and failed) across diverse objects to train grasp success prediction models that determine optimal pick strategies before execution."
    },
    {
        "title": "Warehouse environment recordings",
        "source": "RightPick deployment requirements",
        "description": "Visual recordings of diverse warehouse bin and tote configurations with realistic product arrangements, lighting conditions, and clutter patterns for training perception systems."
    }
],
  dataMatches: [
    {
        "labNeed": "Diverse SKU visual recognition data",
        "claruOffering": "Custom Product Photography + Egocentric Warehouse Dataset",
        "rationale": "Claru can capture multi-angle product imagery across thousands of SKU categories in warehouse conditions, plus egocentric video of human pickers handling the same products for action-conditioned visual features."
    },
    {
        "labNeed": "Grasp outcome recordings",
        "claruOffering": "Manipulation Trajectory Dataset",
        "rationale": "Claru's manipulation recordings include diverse grasping interactions with success/failure outcomes across object types, providing the grasp prediction training data RightHand needs."
    },
    {
        "labNeed": "Warehouse environment recordings",
        "claruOffering": "Egocentric Warehouse Video Dataset + Custom Collection",
        "rationale": "Purpose-collected warehouse video across 20+ facilities captures the diversity of bin configurations, lighting, and product arrangements that RightPick encounters in deployment."
    }
],
  keyPapers: [
    {
        "id": "deimel-soft-2016",
        "title": "A Novel Type of Compliant and Underactuated Robotic Hand for Dexterous Grasping",
        "authors": "Deimel et al.",
        "venue": "IJRR 2016",
        "year": 2016,
        "url": "https://journals.sagepub.com/doi/abs/10.1177/0278364915592961"
    },
    {
        "id": "mahler-dexnet-2019",
        "title": "Learning Ambidextrous Robot Grasping Policies",
        "authors": "Mahler et al.",
        "venue": "Science Robotics 2019",
        "year": 2019,
        "url": "https://arxiv.org/abs/1903.04349"
    },
    {
        "id": "morrison-closing-2020",
        "title": "Closing the Loop for Robotic Grasping",
        "authors": "Morrison et al.",
        "venue": "RSS 2020",
        "year": 2020,
        "url": "https://arxiv.org/abs/1804.05172"
    }
],
  technicalAnalysis: "RightHand Robotics occupies a unique position in warehouse automation: they combine custom soft gripper hardware with AI-powered pick planning software. The soft gripper approach provides inherent adaptability \u2014 compliant fingers conform to object shapes without requiring precise grasp point computation. But this hardware advantage does not eliminate the need for sophisticated AI.\n\nThe pick planning challenge for e-commerce fulfillment is one of extreme object diversity. A typical e-commerce warehouse handles tens of thousands to millions of unique SKUs, and new products arrive constantly. The AI system must determine optimal pick points for objects it has never seen before, predict whether a planned grasp will succeed, and recover gracefully from failed attempts.\n\nRightHand's grasp success prediction is the critical bottleneck. Before executing a pick, the system must assess the probability of success for candidate grasp configurations. This prediction model requires training data covering diverse object-grasp-outcome triplets \u2014 what does a successful grasp of a small boxed electronics item look like versus a bagged clothing item versus a cylindrical bottle? The diversity of real-world objects far exceeds what any single warehouse fleet encounters.\n\nThe perception challenge in bin picking is compounded by clutter and occlusion. Products in warehouse totes are typically jumbled, partially occluded by other items, and viewed under variable warehouse lighting. Training data must capture these realistic visual conditions rather than the clean single-object presentations of typical product photography.",
  metaTitle: "Training Data for RightHand Robotics | Claru",
  metaDescription: "How real-world data addresses RightHand Robotics\'s training data requirements for robotic systems and AI-powered automation.",
  primaryKeyword: "RightHand Robotics training data",
  secondaryKeywords: ["righthand-robotics data", "righthand-robotics robot data", "RightHand Robotics AI training", "robotics training data righthand-robotics"],
  canonicalPath: "/for/righthand-robotics",
  h1: "Training Data for RightHand Robotics",
  heroSubtitle: "RightHand Robotics is building advanced robotic systems. Here is how real-world data accelerates their development from prototype to production deployment.",
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Labs", href: "/for" }, { label: "RightHand Robotics", href: "/for/righthand-robotics" }],
  sections: [
    { type: "prose", heading: "About RightHand Robotics", paragraphs: ["RightHand Robotics builds intelligent robotic picking systems for e-commerce and logistics fulfillment. Founded in 2014 by a team from the Harvard Biorobotics Lab, the company combines proprietary soft gripper hardware with AI-powered pick planning software. Their RightPick platform handles millions of picks per month across customer warehouses."] },
    { type: "stats", heading: "RightHand Robotics at a Glance", stats: [{ value: "2017+", label: "Founded" }, { value: "Series B+", label: "Funding Stage" }, { value: "Global", label: "Deployment" }, { value: "AI-First", label: "Approach" }] },
    { type: "prose", heading: "Data Requirements Analysis", paragraphs: ["RightHand Robotics' piece-level picking system needs training data covering the enormous diversity of e-commerce SKUs \u2014 from small electronics to irregularly shaped products to flexible packaging. Their soft gripper approach reduces the grasp planning complexity compared to rigid grippers, but still requires extensive visual data to plan pick points and predict grasp success across unfamiliar objects."] },
    { type: "prose", heading: "How Claru Supports RightHand Robotics", paragraphs: ["Claru addresses RightHand Robotics\'s data needs through purpose-built collection campaigns coordinated across our global network of 10,000+ collectors in 100+ cities. For manipulation data, Claru captures multi-modal recordings with dense annotations in diverse real-world environments. For perception pretraining, Claru\'s egocentric activity datasets provide the visual grounding data that AI systems need.", "Custom collection campaigns can target specific environments, object categories, and sensor configurations that RightHand Robotics\'s pipeline requires. Each dataset receives multi-layer annotation through Claru\'s quality-controlled pipeline and is delivered in any standard robotics format."] },
    { type: "citation-list", heading: "References", citations: [{"id": "deimel-soft-2016", "title": "A Novel Type of Compliant and Underactuated Robotic Hand for Dexterous Grasping", "authors": "Deimel et al.", "venue": "IJRR 2016", "year": 2016, "url": "https://journals.sagepub.com/doi/abs/10.1177/0278364915592961"}, {"id": "mahler-dexnet-2019", "title": "Learning Ambidextrous Robot Grasping Policies", "authors": "Mahler et al.", "venue": "Science Robotics 2019", "year": 2019, "url": "https://arxiv.org/abs/1903.04349"}, {"id": "morrison-closing-2020", "title": "Closing the Loop for Robotic Grasping", "authors": "Morrison et al.", "venue": "RSS 2020", "year": 2020, "url": "https://arxiv.org/abs/1804.05172"}] }
  ],
  faqs: [
    { question: "What type of training data does RightHand Robotics need?", answer: "RightHand Robotics' piece-level picking system needs training data covering the enormous diversity of e-commerce SKUs \u2014 from small electronics to irregularly shaped products to flexible packaging. Their soft gripper approach reduces the grasp planning complexity compared to rigid grippers, but still requires extensive visual data to plan pick points and predict grasp success across unfamiliar objects." },
    { question: "How does real-world data help RightHand Robotics\'s sim-to-real transfer?", answer: "Simulation cannot faithfully model the contact dynamics, material properties, and environmental conditions that RightHand Robotics\'s robots encounter in deployment. Real-world data provides the distributional coverage that fills simulation gaps — authentic surfaces, lighting conditions, and object interactions from actual deployment environments." },
    { question: "Can Claru provide custom data collection for RightHand Robotics?", answer: "Yes. Claru operates a global network of 10,000+ data collectors across 100+ cities who can capture teleoperated demonstrations, egocentric video, and sensor data in target environments using standardized recording protocols." }
  ],
  ctaHeading: "Accelerate RightHand Robotics\'s Data Pipeline",
  ctaDescription: "Talk to our team about purpose-built datasets for RightHand Robotics\'s robotic systems.",
  relatedGlossaryTerms: ["manipulation-trajectory", "egocentric-video", "sim-to-real"],
  relatedGuidePages: [],
  relatedSolutionSlugs: []
};

export default page;
