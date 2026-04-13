import type { LabPageData } from "./types";

const page: LabPageData = {
  slug: "collaborative-robotics",
  companyName: "Collaborative Robotics",
  companyDescription: "Collaborative Robotics (Cobot) builds mobile manipulator robots designed to work alongside people in commercial environments. Founded in 2022 by Brad Porter (former VP at Amazon Robotics and Scale AI), the company has raised over $100 million. Their robot combines mobile base navigation with manipulation capabilities, targeting healthcare, hospitality, and logistics applications.",
  keyProducts: ["Cobot mobile manipulator platform", "Navigation + manipulation integrated system", "Cloud fleet management"],
  researchFocus: ["Mobile manipulation in human environments", "Safe human-robot interaction", "Multi-floor autonomous navigation", "Task learning from demonstrations", "Cloud-connected fleet intelligence"],
  dataNeedsSummary: "Collaborative Robotics' mobile manipulator must navigate and manipulate in spaces designed for people \u2014 hospitals, hotels, offices, warehouses. Their data needs span diverse indoor environments with the specific obstacle types, floor plans, and human interaction patterns these spaces present. The mobile manipulation paradigm requires data that jointly captures navigation and manipulation.",
  dataNeeds: [
    { title: "Diverse manipulation demonstrations", source: "Collaborative Robotics product deployments and research publications", description: "Multi-modal recordings of manipulation tasks across diverse objects, environments, and conditions relevant to Collaborative Robotics\'s deployment contexts." },
    { title: "Real-world environment recordings", source: "Collaborative Robotics deployment requirements", description: "Visual and geometric recordings of target deployment environments capturing the specific layouts, lighting, and conditions Collaborative Robotics\'s robots encounter." },
    { title: "Perception pretraining data", source: "Collaborative Robotics AI architecture requirements", description: "Diverse egocentric and multi-view video for pretraining visual representations that ground Collaborative Robotics\'s AI in real-world physical understanding." }
  ],
  dataMatches: [
    { labNeed: "Diverse manipulation demonstrations", claruOffering: "Manipulation Trajectory Dataset + Custom Collection", rationale: "Claru captures multi-modal manipulation recordings with dense annotations across diverse environments, matching the diversity Collaborative Robotics needs for robust policy training." },
    { labNeed: "Real-world environment recordings", claruOffering: "Custom Environmental Recording Campaigns", rationale: "Claru coordinates multi-sensor recordings across partner facilities in Collaborative Robotics\'s target deployment environments, capturing authentic visual distributions." },
    { labNeed: "Perception pretraining data", claruOffering: "Egocentric Activity Dataset (386K+ clips)", rationale: "Purpose-collected first-person video of human activities provides visual pretraining data that grounds Collaborative Robotics\'s AI in real physical interactions." }
  ],
  keyPapers: [
    { id: "brohan-rt2-2023", title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", authors: "Brohan et al.", venue: "CoRL 2023", year: 2023, url: "https://arxiv.org/abs/2307.15818" },
    { id: "open-x-embodiment-2024", title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models", authors: "Open X-Embodiment Collaboration", venue: "ICRA 2024", year: 2024, url: "https://arxiv.org/abs/2310.08864" },
    { id: "kim-openvla-2024", title: "OpenVLA: An Open-Source Vision-Language-Action Model", authors: "Kim et al.", venue: "arXiv 2406.09246", year: 2024, url: "https://arxiv.org/abs/2406.09246" }
  ],
  technicalAnalysis: "Brad Porter's experience at Amazon Robotics (where he oversaw 750K+ robots) and Scale AI (data infrastructure at massive scale) directly shapes Collaborative Robotics' approach. The company understands that the data bottleneck \u2014 not hardware \u2014 is what limits mobile manipulation deployment.\n\nThe mobile manipulator form factor creates compound data requirements. Navigation data alone is not enough; the robot must understand how to position its base to enable manipulation, how to navigate while carrying objects, and how to share space safely with people. This coupled navigation-manipulation capability requires training data where both modalities are captured simultaneously.\n\nHealthcare deployment presents unique environmental and interaction requirements. Hospital corridors, patient rooms, nursing stations, and supply areas each have specific layouts, obstacle types, and human behavior patterns. Training data from real healthcare facilities \u2014 not simulated hospital environments \u2014 captures the specific visual distributions, navigation constraints, and human interaction patterns that healthcare robots encounter.\n\nThe cloud fleet intelligence dimension adds another data requirement: learning from the collective experience of deployed robots. When one robot encounters a new situation, the fleet should benefit. This requires standardized data capture from every deployed robot plus the infrastructure to aggregate, annotate, and incorporate new experiences into model updates.",
  metaTitle: "Training Data for Collaborative Robotics | Claru",
  metaDescription: "How real-world data addresses Collaborative Robotics\'s training data requirements for robotic systems and AI-powered automation.",
  primaryKeyword: "Collaborative Robotics training data",
  secondaryKeywords: ["collaborative-robotics data", "collaborative-robotics robot data", "Collaborative Robotics AI training", "robotics training data"],
  canonicalPath: "/for/collaborative-robotics",
  h1: "Training Data for Collaborative Robotics",
  heroSubtitle: "Collaborative Robotics is building advanced robotic systems. Here is how real-world data accelerates their path from development to production deployment.",
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Labs", href: "/for" }, { label: "Collaborative Robotics", href: "/for/collaborative-robotics" }],
  sections: [
    { type: "prose", heading: "About Collaborative Robotics", paragraphs: ["Collaborative Robotics (Cobot) builds mobile manipulator robots designed to work alongside people in commercial environments. Founded in 2022 by Brad Porter (former VP at Amazon Robotics and Scale AI), the company has raised over $100 million. Their robot combines mobile base navigation with manipulation capabilities, targeting healthcare, hospitality, and logistics applications."] },
    { type: "stats", heading: "Collaborative Robotics at a Glance", stats: [{ value: "2016+", label: "Founded" }, { value: "Funded", label: "Stage" }, { value: "Global", label: "Deployment" }, { value: "AI-First", label: "Approach" }] },
    { type: "prose", heading: "Data Requirements Analysis", paragraphs: ["Collaborative Robotics' mobile manipulator must navigate and manipulate in spaces designed for people \u2014 hospitals, hotels, offices, warehouses. Their data needs span diverse indoor environments with the specific obstacle types, floor plans, and human interaction patterns these spaces present. The mobile manipulation paradigm requires data that jointly captures navigation and manipulation."] },
    { type: "prose", heading: "How Claru Supports Collaborative Robotics", paragraphs: ["Claru addresses Collaborative Robotics\'s data needs through purpose-built collection campaigns coordinated across our global network of 10,000+ collectors in 100+ cities. For manipulation data, Claru captures multi-modal recordings with dense annotations in diverse real-world environments. For perception pretraining, Claru\'s egocentric activity datasets provide the visual grounding data that AI systems need.", "Custom collection campaigns can target specific environments, object categories, and sensor configurations that Collaborative Robotics\'s pipeline requires. Each dataset receives multi-layer annotation through Claru\'s quality-controlled pipeline and is delivered in any standard robotics format."] },
    { type: "citation-list", heading: "References", citations: [{ id: "brohan-rt2-2023", title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", authors: "Brohan et al.", venue: "CoRL 2023", year: 2023, url: "https://arxiv.org/abs/2307.15818" }, { id: "open-x-embodiment-2024", title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models", authors: "Open X-Embodiment Collaboration", venue: "ICRA 2024", year: 2024, url: "https://arxiv.org/abs/2310.08864" }] }
  ],
  faqs: [
    { question: "What type of training data does Collaborative Robotics need?", answer: "Collaborative Robotics' mobile manipulator must navigate and manipulate in spaces designed for people \u2014 hospitals, hotels, offices, warehouses. Their data needs span diverse indoor environments with the specific obstacle types, floor plans, and human interaction patterns these spaces present. The mobile manipulation paradigm requires data that jointly captures navigation and manipulation." },
    { question: "How does real-world data help Collaborative Robotics\'s sim-to-real transfer?", answer: "Simulation cannot faithfully model the contact dynamics, material properties, and environmental conditions that Collaborative Robotics\'s robots encounter in deployment. Real-world data provides the distributional coverage that fills simulation gaps." },
    { question: "Can Claru provide custom data collection for Collaborative Robotics?", answer: "Yes. Claru operates a global network of 10,000+ data collectors across 100+ cities who can capture teleoperated demonstrations, egocentric video, and sensor data in target environments using standardized recording protocols." }
  ],
  ctaHeading: "Accelerate Collaborative Robotics\'s Data Pipeline",
  ctaDescription: "Talk to our team about purpose-built datasets for Collaborative Robotics\'s robotic systems.",
  relatedGlossaryTerms: ["manipulation-trajectory", "egocentric-video", "sim-to-real"],
  relatedGuidePages: [],
  relatedSolutionSlugs: []
};

export default page;
