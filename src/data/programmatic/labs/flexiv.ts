import type { LabPageData } from "./types";

const page: LabPageData = {
  slug: "flexiv",
  companyName: "Flexiv",
  companyDescription: "Flexiv develops adaptive robots with force-controlled, AI-powered manipulation capabilities. Founded in 2016 by Shiquan Wang (Stanford PhD), the company builds robots that combine high-precision force control with AI-based task learning. Their Rizon series robots feature built-in force/torque sensing and adaptive compliance, targeting manufacturing, healthcare, and research applications. Flexiv has raised over $400 million.",
  keyProducts: ["Rizon 4 (7-DOF force-controlled robot arm)", "Rizon 4s (high-speed variant)", "Rizon 10 (high-payload variant)", "Grav (AI-powered gripper)", "FlexivOS (robot operating system)"],
  researchFocus: ["Force-controlled adaptive manipulation", "AI-based task learning and generalization", "Contact-rich assembly automation", "Compliant manipulation for delicate objects", "Multi-modal sensory fusion for manipulation"],
  dataNeedsSummary: "Flexiv's force-controlled robots excel at contact-rich manipulation tasks like polishing, assembly, and insertion that require precise force modulation. Their AI task learning system needs training data that captures both visual observations and force/torque signals during diverse manipulation tasks \u2014 data that is extremely scarce in existing public datasets.",
  dataNeeds: [
    { title: "Diverse manipulation demonstrations", source: "Flexiv product deployments and research publications", description: "Multi-modal recordings of manipulation tasks across diverse objects, environments, and conditions relevant to Flexiv\'s deployment contexts." },
    { title: "Real-world environment recordings", source: "Flexiv deployment requirements", description: "Visual and geometric recordings of target deployment environments capturing the specific layouts, lighting, and conditions Flexiv\'s robots encounter." },
    { title: "Perception pretraining data", source: "Flexiv AI architecture requirements", description: "Diverse egocentric and multi-view video for pretraining visual representations that ground Flexiv\'s AI in real-world physical understanding." }
  ],
  dataMatches: [
    { labNeed: "Diverse manipulation demonstrations", claruOffering: "Manipulation Trajectory Dataset + Custom Collection", rationale: "Claru captures multi-modal manipulation recordings with dense annotations across diverse environments, matching the diversity Flexiv needs for robust policy training." },
    { labNeed: "Real-world environment recordings", claruOffering: "Custom Environmental Recording Campaigns", rationale: "Claru coordinates multi-sensor recordings across partner facilities in Flexiv\'s target deployment environments, capturing authentic visual distributions." },
    { labNeed: "Perception pretraining data", claruOffering: "Egocentric Activity Dataset (386K+ clips)", rationale: "Purpose-collected first-person video of human activities provides visual pretraining data that grounds Flexiv\'s AI in real physical interactions." }
  ],
  keyPapers: [
    { id: "brohan-rt2-2023", title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", authors: "Brohan et al.", venue: "CoRL 2023", year: 2023, url: "https://arxiv.org/abs/2307.15818" },
    { id: "open-x-embodiment-2024", title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models", authors: "Open X-Embodiment Collaboration", venue: "ICRA 2024", year: 2024, url: "https://arxiv.org/abs/2310.08864" },
    { id: "kim-openvla-2024", title: "OpenVLA: An Open-Source Vision-Language-Action Model", authors: "Kim et al.", venue: "arXiv 2406.09246", year: 2024, url: "https://arxiv.org/abs/2406.09246" }
  ],
  technicalAnalysis: "Flexiv occupies a unique position in robotics: they build hardware with industry-leading force control (0.1N force resolution, 1kHz control loop) and then layer AI on top to make that hardware adaptable to new tasks. This combination addresses the fundamental limitation of traditional industrial robots \u2014 they are precise but rigid, unable to adapt to variation in parts, fixtures, or environments.\n\nThe force-controlled approach creates a specific data requirement that most robotics datasets do not address. Flexiv's AI needs training data that pairs visual observations with synchronized force/torque signals \u2014 what does the robot see AND feel during a polishing operation, an insertion task, or a deformable object manipulation? This multi-modal data (vision + force) is extremely scarce in public datasets, which overwhelmingly focus on vision-only data.\n\nContact-rich assembly tasks like peg-in-hole insertion, snap-fit assembly, and screw driving depend on force feedback to detect contact states, adjust insertion angle, and apply appropriate force. The physics of these contact interactions vary across materials (metal-on-metal vs plastic-on-plastic), tolerances (tight vs loose fit), and geometric configurations. Real-world force data from diverse assembly tasks provides the training signal for force-adaptive policies.\n\nFlexiv's compliant manipulation for delicate objects \u2014 medical devices, food items, electronics components \u2014 requires understanding how much force different objects can withstand. A force policy trained only on rigid objects will damage a ripe tomato or a flexible circuit board. Training data must include diverse object compliance characteristics captured through real force-controlled manipulation, not just visual observation.",
  metaTitle: "Training Data for Flexiv | Claru",
  metaDescription: "How real-world data addresses Flexiv\'s training data requirements for robotic systems and AI-powered automation.",
  primaryKeyword: "Flexiv training data",
  secondaryKeywords: ["flexiv data", "flexiv robot data", "Flexiv AI training", "robotics training data"],
  canonicalPath: "/for/flexiv",
  h1: "Training Data for Flexiv",
  heroSubtitle: "Flexiv is building advanced robotic systems. Here is how real-world data accelerates their path from development to production deployment.",
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Labs", href: "/for" }, { label: "Flexiv", href: "/for/flexiv" }],
  sections: [
    { type: "prose", heading: "About Flexiv", paragraphs: ["Flexiv develops adaptive robots with force-controlled, AI-powered manipulation capabilities. Founded in 2016 by Shiquan Wang (Stanford PhD), the company builds robots that combine high-precision force control with AI-based task learning. Their Rizon series robots feature built-in force/torque sensing and adaptive compliance, targeting manufacturing, healthcare, and research applications. Flexiv has raised over $400 million."] },
    { type: "stats", heading: "Flexiv at a Glance", stats: [{ value: "2016+", label: "Founded" }, { value: "Funded", label: "Stage" }, { value: "Global", label: "Deployment" }, { value: "AI-First", label: "Approach" }] },
    { type: "prose", heading: "Data Requirements Analysis", paragraphs: ["Flexiv's force-controlled robots excel at contact-rich manipulation tasks like polishing, assembly, and insertion that require precise force modulation. Their AI task learning system needs training data that captures both visual observations and force/torque signals during diverse manipulation tasks \u2014 data that is extremely scarce in existing public datasets."] },
    { type: "prose", heading: "How Claru Supports Flexiv", paragraphs: ["Claru addresses Flexiv\'s data needs through purpose-built collection campaigns coordinated across our global network of 10,000+ collectors in 100+ cities. For manipulation data, Claru captures multi-modal recordings with dense annotations in diverse real-world environments. For perception pretraining, Claru\'s egocentric activity datasets provide the visual grounding data that AI systems need.", "Custom collection campaigns can target specific environments, object categories, and sensor configurations that Flexiv\'s pipeline requires. Each dataset receives multi-layer annotation through Claru\'s quality-controlled pipeline and is delivered in any standard robotics format."] },
    { type: "citation-list", heading: "References", citations: [{ id: "brohan-rt2-2023", title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", authors: "Brohan et al.", venue: "CoRL 2023", year: 2023, url: "https://arxiv.org/abs/2307.15818" }, { id: "open-x-embodiment-2024", title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models", authors: "Open X-Embodiment Collaboration", venue: "ICRA 2024", year: 2024, url: "https://arxiv.org/abs/2310.08864" }] }
  ],
  faqs: [
    { question: "What type of training data does Flexiv need?", answer: "Flexiv's force-controlled robots excel at contact-rich manipulation tasks like polishing, assembly, and insertion that require precise force modulation. Their AI task learning system needs training data that captures both visual observations and force/torque signals during diverse manipulation tasks \u2014 data that is extremely scarce in existing public datasets." },
    { question: "How does real-world data help Flexiv\'s sim-to-real transfer?", answer: "Simulation cannot faithfully model the contact dynamics, material properties, and environmental conditions that Flexiv\'s robots encounter in deployment. Real-world data provides the distributional coverage that fills simulation gaps." },
    { question: "Can Claru provide custom data collection for Flexiv?", answer: "Yes. Claru operates a global network of 10,000+ data collectors across 100+ cities who can capture teleoperated demonstrations, egocentric video, and sensor data in target environments using standardized recording protocols." }
  ],
  ctaHeading: "Accelerate Flexiv\'s Data Pipeline",
  ctaDescription: "Talk to our team about purpose-built datasets for Flexiv\'s robotic systems.",
  relatedGlossaryTerms: ["manipulation-trajectory", "egocentric-video", "sim-to-real"],
  relatedGuidePages: [],
  relatedSolutionSlugs: []
};

export default page;
