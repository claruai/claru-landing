import type { LabPageData } from "./types";

const page: LabPageData = {
  slug: "dexterity-ai",
  companyName: "Dexterity AI",
  companyDescription: "Dexterity AI builds intelligent robotic systems for logistics and supply chain automation. Founded in 2020 by Samir Menon (formerly at Stanford Robotics Lab), the company applies AI to make industrial robots handle the full diversity of items in logistics \u2014 from small packages to irregularly shaped products. Dexterity has raised over $140 million and deploys systems with major logistics operators.",
  keyProducts: ["DexR (intelligent robotic depalletizer)", "DexPack (robotic packing system)", "DexSort (robotic sorting system)", "Dexterity Intelligence (AI platform)"],
  researchFocus: ["Contact-rich manipulation for logistics", "Mixed-SKU depalletizing", "Intelligent packing optimization", "Sim-to-real transfer for manipulation", "Tactile sensing for package handling"],
  dataNeedsSummary: "Dexterity AI's logistics automation requires handling the enormous diversity of package types \u2014 from uniform cartons to irregular shapes, fragile items, and heavy loads. Their AI platform needs training data covering this full diversity of package geometries, materials, and handling requirements across real logistics environments.",
  dataNeeds: [
    { title: "Diverse manipulation demonstrations", source: "Dexterity AI product deployments and research publications", description: "Multi-modal recordings of manipulation tasks across diverse objects, environments, and conditions relevant to Dexterity AI\'s deployment contexts." },
    { title: "Real-world environment recordings", source: "Dexterity AI deployment requirements", description: "Visual and geometric recordings of target deployment environments capturing the specific layouts, lighting, and conditions Dexterity AI\'s robots encounter." },
    { title: "Perception pretraining data", source: "Dexterity AI AI architecture requirements", description: "Diverse egocentric and multi-view video for pretraining visual representations that ground Dexterity AI\'s AI in real-world physical understanding." }
  ],
  dataMatches: [
    { labNeed: "Diverse manipulation demonstrations", claruOffering: "Manipulation Trajectory Dataset + Custom Collection", rationale: "Claru captures multi-modal manipulation recordings with dense annotations across diverse environments, matching the diversity Dexterity AI needs for robust policy training." },
    { labNeed: "Real-world environment recordings", claruOffering: "Custom Environmental Recording Campaigns", rationale: "Claru coordinates multi-sensor recordings across partner facilities in Dexterity AI\'s target deployment environments, capturing authentic visual distributions." },
    { labNeed: "Perception pretraining data", claruOffering: "Egocentric Activity Dataset (386K+ clips)", rationale: "Purpose-collected first-person video of human activities provides visual pretraining data that grounds Dexterity AI\'s AI in real physical interactions." }
  ],
  keyPapers: [
    { id: "brohan-rt2-2023", title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", authors: "Brohan et al.", venue: "CoRL 2023", year: 2023, url: "https://arxiv.org/abs/2307.15818" },
    { id: "open-x-embodiment-2024", title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models", authors: "Open X-Embodiment Collaboration", venue: "ICRA 2024", year: 2024, url: "https://arxiv.org/abs/2310.08864" },
    { id: "kim-openvla-2024", title: "OpenVLA: An Open-Source Vision-Language-Action Model", authors: "Kim et al.", venue: "arXiv 2406.09246", year: 2024, url: "https://arxiv.org/abs/2406.09246" }
  ],
  technicalAnalysis: "Dexterity AI focuses on the most physically demanding tasks in logistics: depalletizing (removing items from pallets), packing (placing items into boxes), and sorting (routing items to destinations). These tasks involve contact-rich manipulation where the robot must handle objects of varying weight, fragility, and shape without damage.\n\nThe depalletizing challenge is particularly data-intensive. A mixed-SKU pallet contains items of different sizes, weights, and packaging types stacked in irregular arrangements. The AI must determine pick order (which item to remove first without destabilizing the stack), grasp strategy, and placement. Simulating the physics of stacked packages \u2014 friction between cardboard surfaces, weight distribution, stack stability \u2014 remains unreliable for the diverse package types in real logistics.\n\nDexterity's approach to sim-to-real transfer starts with simulation for initial policy training, then relies on real-world data for fine-tuning and distribution matching. The gap between simulated and real package interactions (cardboard deformation, tape adhesion, shrink-wrap behavior) requires substantial real-world data to bridge. This data must cover the long tail of package types that logistics operators handle.\n\nThe contact-rich nature of logistics manipulation means force and tactile data is essential. How hard can you grip a cardboard box before crushing it? How does grip force vary between a heavy case of water and a fragile electronics box? Real-world force data from diverse package handling provides the supervision signal for policies that apply appropriate force across package types.",
  metaTitle: "Training Data for Dexterity AI | Claru",
  metaDescription: "How real-world data addresses Dexterity AI\'s training data requirements for robotic systems and AI-powered automation.",
  primaryKeyword: "Dexterity AI training data",
  secondaryKeywords: ["dexterity-ai data", "dexterity-ai robot data", "Dexterity AI AI training", "robotics training data"],
  canonicalPath: "/for/dexterity-ai",
  h1: "Training Data for Dexterity AI",
  heroSubtitle: "Dexterity AI is building advanced robotic systems. Here is how real-world data accelerates their path from development to production deployment.",
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Labs", href: "/for" }, { label: "Dexterity AI", href: "/for/dexterity-ai" }],
  sections: [
    { type: "prose", heading: "About Dexterity AI", paragraphs: ["Dexterity AI builds intelligent robotic systems for logistics and supply chain automation. Founded in 2020 by Samir Menon (formerly at Stanford Robotics Lab), the company applies AI to make industrial robots handle the full diversity of items in logistics \u2014 from small packages to irregularly shaped products. Dexterity has raised over $140 million and deploys systems with major logistics operators."] },
    { type: "stats", heading: "Dexterity AI at a Glance", stats: [{ value: "2016+", label: "Founded" }, { value: "Funded", label: "Stage" }, { value: "Global", label: "Deployment" }, { value: "AI-First", label: "Approach" }] },
    { type: "prose", heading: "Data Requirements Analysis", paragraphs: ["Dexterity AI's logistics automation requires handling the enormous diversity of package types \u2014 from uniform cartons to irregular shapes, fragile items, and heavy loads. Their AI platform needs training data covering this full diversity of package geometries, materials, and handling requirements across real logistics environments."] },
    { type: "prose", heading: "How Claru Supports Dexterity AI", paragraphs: ["Claru addresses Dexterity AI\'s data needs through purpose-built collection campaigns coordinated across our global network of 10,000+ collectors in 100+ cities. For manipulation data, Claru captures multi-modal recordings with dense annotations in diverse real-world environments. For perception pretraining, Claru\'s egocentric activity datasets provide the visual grounding data that AI systems need.", "Custom collection campaigns can target specific environments, object categories, and sensor configurations that Dexterity AI\'s pipeline requires. Each dataset receives multi-layer annotation through Claru\'s quality-controlled pipeline and is delivered in any standard robotics format."] },
    { type: "citation-list", heading: "References", citations: [{ id: "brohan-rt2-2023", title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", authors: "Brohan et al.", venue: "CoRL 2023", year: 2023, url: "https://arxiv.org/abs/2307.15818" }, { id: "open-x-embodiment-2024", title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models", authors: "Open X-Embodiment Collaboration", venue: "ICRA 2024", year: 2024, url: "https://arxiv.org/abs/2310.08864" }] }
  ],
  faqs: [
    { question: "What type of training data does Dexterity AI need?", answer: "Dexterity AI's logistics automation requires handling the enormous diversity of package types \u2014 from uniform cartons to irregular shapes, fragile items, and heavy loads. Their AI platform needs training data covering this full diversity of package geometries, materials, and handling requirements across real logistics environments." },
    { question: "How does real-world data help Dexterity AI\'s sim-to-real transfer?", answer: "Simulation cannot faithfully model the contact dynamics, material properties, and environmental conditions that Dexterity AI\'s robots encounter in deployment. Real-world data provides the distributional coverage that fills simulation gaps." },
    { question: "Can Claru provide custom data collection for Dexterity AI?", answer: "Yes. Claru operates a global network of 10,000+ data collectors across 100+ cities who can capture teleoperated demonstrations, egocentric video, and sensor data in target environments using standardized recording protocols." }
  ],
  ctaHeading: "Accelerate Dexterity AI\'s Data Pipeline",
  ctaDescription: "Talk to our team about purpose-built datasets for Dexterity AI\'s robotic systems.",
  relatedGlossaryTerms: ["manipulation-trajectory", "egocentric-video", "sim-to-real"],
  relatedGuidePages: [],
  relatedSolutionSlugs: []
};

export default page;
