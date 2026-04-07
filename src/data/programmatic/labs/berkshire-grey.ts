import type { LabPageData } from "./types";

const page: LabPageData = {
  slug: "berkshire-grey",
  companyName: "Berkshire Grey",
  companyDescription: "Berkshire Grey builds AI-enabled robotic systems for warehouse automation, retail fulfillment, and package handling. Founded in 2013 by Tom Wagner, the company has raised over $300 million, went public via SPAC in 2021, and was acquired by SoftBank Robotics in 2023. Their systems combine robotic picking, sorting, and packing with AI-powered perception and planning.",
  keyProducts: ["Robotic Pick (RPick)", "Robotic Sort (RSort)", "Robotic Pack (RPack)", "Intelligent Enterprise Robotics (IER) platform"],
  researchFocus: ["AI-powered robotic picking and sorting", "Package singulation and handling", "Multi-robot coordination for fulfillment", "Vision-based item recognition", "Autonomous warehouse workflow orchestration"],
  dataNeedsSummary: "Berkshire Grey's enterprise robotic systems handle diverse items across retail, grocery, and parcel sorting. Their AI perception needs training data covering the enormous SKU diversity of retail fulfillment \u2014 from small electronics to oversized items, transparent packaging, and deformable bags. Scaling across customer deployments requires visual data from diverse warehouse environments.",
  dataNeeds: [
    { title: "Diverse manipulation demonstrations", source: "Berkshire Grey product deployments and research publications", description: "Multi-modal recordings of manipulation tasks across diverse objects, environments, and conditions relevant to Berkshire Grey\'s deployment contexts." },
    { title: "Real-world environment recordings", source: "Berkshire Grey deployment requirements", description: "Visual and geometric recordings of target deployment environments capturing the specific layouts, lighting, and conditions Berkshire Grey\'s robots encounter." },
    { title: "Perception pretraining data", source: "Berkshire Grey AI architecture requirements", description: "Diverse egocentric and multi-view video for pretraining visual representations that ground Berkshire Grey\'s AI in real-world physical understanding." }
  ],
  dataMatches: [
    { labNeed: "Diverse manipulation demonstrations", claruOffering: "Manipulation Trajectory Dataset + Custom Collection", rationale: "Claru captures multi-modal manipulation recordings with dense annotations across diverse environments, matching the diversity Berkshire Grey needs for robust policy training." },
    { labNeed: "Real-world environment recordings", claruOffering: "Custom Environmental Recording Campaigns", rationale: "Claru coordinates multi-sensor recordings across partner facilities in Berkshire Grey\'s target deployment environments, capturing authentic visual distributions." },
    { labNeed: "Perception pretraining data", claruOffering: "Egocentric Activity Dataset (386K+ clips)", rationale: "Purpose-collected first-person video of human activities provides visual pretraining data that grounds Berkshire Grey\'s AI in real physical interactions." }
  ],
  keyPapers: [
    { id: "brohan-rt2-2023", title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", authors: "Brohan et al.", venue: "CoRL 2023", year: 2023, url: "https://arxiv.org/abs/2307.15818" },
    { id: "open-x-embodiment-2024", title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models", authors: "Open X-Embodiment Collaboration", venue: "ICRA 2024", year: 2024, url: "https://arxiv.org/abs/2310.08864" },
    { id: "kim-openvla-2024", title: "OpenVLA: An Open-Source Vision-Language-Action Model", authors: "Kim et al.", venue: "arXiv 2406.09246", year: 2024, url: "https://arxiv.org/abs/2406.09246" }
  ],
  technicalAnalysis: "Berkshire Grey operates at the intersection of industrial robotics and AI, building complete workflow automation systems rather than single-robot solutions. Their IER platform coordinates multiple robots for end-to-end fulfillment \u2014 picking items from bins, sorting them by order, and packing for shipment.\n\nThe perception challenge is extreme item diversity. A grocery fulfillment center handles fresh produce, frozen items, glass bottles, flexible packaging, and heavy items all in the same workflow. The AI must recognize items it has never seen before, determine optimal grasp strategies, and handle fragile items appropriately. This long-tail recognition problem demands training data far broader than any single customer deployment generates.\n\nPackage singulation \u2014 separating individual packages from a pile on a conveyor \u2014 requires understanding the physics of how packages stack, slide, and interact. Simulating these dynamics for soft packages, irregular shapes, and mixed-size loads remains unreliable. Real-world data of package singulation across diverse package types provides the training signal that makes singulation policies robust.\n\nMulti-robot coordination introduces data requirements beyond single-robot perception. The IER platform must predict handoff timing, manage shared workspace conflicts, and recover from individual robot failures without stopping the line. Training these coordination policies requires data from real multi-robot operations where timing jitter, communication latency, and mechanical variance create real coordination challenges.",
  metaTitle: "Training Data for Berkshire Grey | Claru",
  metaDescription: "How real-world data addresses Berkshire Grey\'s training data requirements for robotic systems and AI-powered automation.",
  primaryKeyword: "Berkshire Grey training data",
  secondaryKeywords: ["berkshire-grey data", "berkshire-grey robot data", "Berkshire Grey AI training", "robotics training data"],
  canonicalPath: "/for/berkshire-grey",
  h1: "Training Data for Berkshire Grey",
  heroSubtitle: "Berkshire Grey is building advanced robotic systems. Here is how real-world data accelerates their path from development to production deployment.",
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Labs", href: "/for" }, { label: "Berkshire Grey", href: "/for/berkshire-grey" }],
  sections: [
    { type: "prose", heading: "About Berkshire Grey", paragraphs: ["Berkshire Grey builds AI-enabled robotic systems for warehouse automation, retail fulfillment, and package handling. Founded in 2013 by Tom Wagner, the company has raised over $300 million, went public via SPAC in 2021, and was acquired by SoftBank Robotics in 2023. Their systems combine robotic picking, sorting, and packing with AI-powered perception and planning."] },
    { type: "stats", heading: "Berkshire Grey at a Glance", stats: [{ value: "2016+", label: "Founded" }, { value: "Funded", label: "Stage" }, { value: "Global", label: "Deployment" }, { value: "AI-First", label: "Approach" }] },
    { type: "prose", heading: "Data Requirements Analysis", paragraphs: ["Berkshire Grey's enterprise robotic systems handle diverse items across retail, grocery, and parcel sorting. Their AI perception needs training data covering the enormous SKU diversity of retail fulfillment \u2014 from small electronics to oversized items, transparent packaging, and deformable bags. Scaling across customer deployments requires visual data from diverse warehouse environments."] },
    { type: "prose", heading: "How Claru Supports Berkshire Grey", paragraphs: ["Claru addresses Berkshire Grey\'s data needs through purpose-built collection campaigns coordinated across our global network of 10,000+ collectors in 100+ cities. For manipulation data, Claru captures multi-modal recordings with dense annotations in diverse real-world environments. For perception pretraining, Claru\'s egocentric activity datasets provide the visual grounding data that AI systems need.", "Custom collection campaigns can target specific environments, object categories, and sensor configurations that Berkshire Grey\'s pipeline requires. Each dataset receives multi-layer annotation through Claru\'s quality-controlled pipeline and is delivered in any standard robotics format."] },
    { type: "citation-list", heading: "References", citations: [{ id: "brohan-rt2-2023", title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", authors: "Brohan et al.", venue: "CoRL 2023", year: 2023, url: "https://arxiv.org/abs/2307.15818" }, { id: "open-x-embodiment-2024", title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models", authors: "Open X-Embodiment Collaboration", venue: "ICRA 2024", year: 2024, url: "https://arxiv.org/abs/2310.08864" }] }
  ],
  faqs: [
    { question: "What type of training data does Berkshire Grey need?", answer: "Berkshire Grey's enterprise robotic systems handle diverse items across retail, grocery, and parcel sorting. Their AI perception needs training data covering the enormous SKU diversity of retail fulfillment \u2014 from small electronics to oversized items, transparent packaging, and deformable bags. Scaling across customer deployments requires visual data from diverse warehouse environments." },
    { question: "How does real-world data help Berkshire Grey\'s sim-to-real transfer?", answer: "Simulation cannot faithfully model the contact dynamics, material properties, and environmental conditions that Berkshire Grey\'s robots encounter in deployment. Real-world data provides the distributional coverage that fills simulation gaps." },
    { question: "Can Claru provide custom data collection for Berkshire Grey?", answer: "Yes. Claru operates a global network of 10,000+ data collectors across 100+ cities who can capture teleoperated demonstrations, egocentric video, and sensor data in target environments using standardized recording protocols." }
  ],
  ctaHeading: "Accelerate Berkshire Grey\'s Data Pipeline",
  ctaDescription: "Talk to our team about purpose-built datasets for Berkshire Grey\'s robotic systems.",
  relatedGlossaryTerms: ["manipulation-trajectory", "egocentric-video", "sim-to-real"],
  relatedGuidePages: [],
  relatedSolutionSlugs: []
};

export default page;
