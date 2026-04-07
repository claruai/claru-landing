import type { LabPageData } from "./types";

const page: LabPageData = {
  slug: "realtime-robotics",
  companyName: "Realtime Robotics",
  companyDescription: "Realtime Robotics develops hardware-accelerated motion planning for industrial robots. Founded in 2016 by Duke University researchers, the company builds specialized processor chips and software that compute collision-free robot trajectories in milliseconds \u2014 orders of magnitude faster than traditional motion planners. Their technology enables robots to react to dynamic environments in real-time.",
  keyProducts: ["RapidPlan (motion planning software)", "RapidSense (perception integration)", "Motion Planning Processor (FPGA-based)", "Multi-Robot Coordination Suite"],
  researchFocus: ["Hardware-accelerated motion planning", "Real-time collision avoidance", "Multi-robot workspace coordination", "Dynamic environment adaptation", "Perception-to-planning pipeline optimization"],
  dataNeedsSummary: "Realtime Robotics' motion planning technology needs diverse environment data to validate and benchmark their planning algorithms across realistic scenarios. Their collision avoidance and multi-robot coordination require 3D scene data from real industrial environments with dynamic obstacles, tight workspaces, and complex robot cell configurations.",
  dataNeeds: [
    { title: "Diverse manipulation demonstrations", source: "Realtime Robotics product deployments and research publications", description: "Multi-modal recordings of manipulation tasks across diverse objects, environments, and conditions relevant to Realtime Robotics\'s deployment contexts." },
    { title: "Real-world environment recordings", source: "Realtime Robotics deployment requirements", description: "Visual and geometric recordings of target deployment environments capturing the specific layouts, lighting, and conditions Realtime Robotics\'s robots encounter." },
    { title: "Perception pretraining data", source: "Realtime Robotics AI architecture requirements", description: "Diverse egocentric and multi-view video for pretraining visual representations that ground Realtime Robotics\'s AI in real-world physical understanding." }
  ],
  dataMatches: [
    { labNeed: "Diverse manipulation demonstrations", claruOffering: "Manipulation Trajectory Dataset + Custom Collection", rationale: "Claru captures multi-modal manipulation recordings with dense annotations across diverse environments, matching the diversity Realtime Robotics needs for robust policy training." },
    { labNeed: "Real-world environment recordings", claruOffering: "Custom Environmental Recording Campaigns", rationale: "Claru coordinates multi-sensor recordings across partner facilities in Realtime Robotics\'s target deployment environments, capturing authentic visual distributions." },
    { labNeed: "Perception pretraining data", claruOffering: "Egocentric Activity Dataset (386K+ clips)", rationale: "Purpose-collected first-person video of human activities provides visual pretraining data that grounds Realtime Robotics\'s AI in real physical interactions." }
  ],
  keyPapers: [
    { id: "brohan-rt2-2023", title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", authors: "Brohan et al.", venue: "CoRL 2023", year: 2023, url: "https://arxiv.org/abs/2307.15818" },
    { id: "open-x-embodiment-2024", title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models", authors: "Open X-Embodiment Collaboration", venue: "ICRA 2024", year: 2024, url: "https://arxiv.org/abs/2310.08864" },
    { id: "kim-openvla-2024", title: "OpenVLA: An Open-Source Vision-Language-Action Model", authors: "Kim et al.", venue: "arXiv 2406.09246", year: 2024, url: "https://arxiv.org/abs/2406.09246" }
  ],
  technicalAnalysis: "Realtime Robotics attacks the computational bottleneck in robot motion planning. Traditional planners like RRT or PRM take seconds to compute collision-free paths \u2014 too slow for dynamic environments where obstacles move. Their FPGA-based processor computes optimal paths in milliseconds, enabling robots to react to environmental changes in real-time.\n\nThe value of real-world data for Realtime Robotics is primarily in benchmarking and validation rather than direct training. Their motion planner is algorithmic, not learned, but it must be validated against realistic scenarios: cluttered workcells, dynamic obstacles (human workers), multi-robot configurations, and tight-tolerance assembly operations. Real 3D scene data from industrial environments provides the test cases that ensure planning reliability.\n\nMulti-robot coordination is where data becomes most critical. When multiple robots share a workspace, the planning system must avoid inter-robot collisions while maintaining throughput. The timing constraints, workspace overlaps, and task sequencing of real multi-robot workcells create coordination challenges that synthetic scenarios underrepresent.\n\nThe perception-to-planning pipeline is the frontier for Realtime Robotics. Their RapidSense product integrates real-time 3D perception with the motion planner, creating a closed loop from camera to collision-free motion. Training and validating this perception-planning loop requires diverse real-world 3D scene data with dynamic objects.",
  metaTitle: "Training Data for Realtime Robotics | Claru",
  metaDescription: "How real-world data addresses Realtime Robotics\'s training data requirements for robotic systems and AI-powered automation.",
  primaryKeyword: "Realtime Robotics training data",
  secondaryKeywords: ["realtime-robotics data", "realtime-robotics robot data", "Realtime Robotics AI training", "robotics training data"],
  canonicalPath: "/for/realtime-robotics",
  h1: "Training Data for Realtime Robotics",
  heroSubtitle: "Realtime Robotics is building advanced robotic systems. Here is how real-world data accelerates their path from development to production deployment.",
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Labs", href: "/for" }, { label: "Realtime Robotics", href: "/for/realtime-robotics" }],
  sections: [
    { type: "prose", heading: "About Realtime Robotics", paragraphs: ["Realtime Robotics develops hardware-accelerated motion planning for industrial robots. Founded in 2016 by Duke University researchers, the company builds specialized processor chips and software that compute collision-free robot trajectories in milliseconds \u2014 orders of magnitude faster than traditional motion planners. Their technology enables robots to react to dynamic environments in real-time."] },
    { type: "stats", heading: "Realtime Robotics at a Glance", stats: [{ value: "2016+", label: "Founded" }, { value: "Funded", label: "Stage" }, { value: "Global", label: "Deployment" }, { value: "AI-First", label: "Approach" }] },
    { type: "prose", heading: "Data Requirements Analysis", paragraphs: ["Realtime Robotics' motion planning technology needs diverse environment data to validate and benchmark their planning algorithms across realistic scenarios. Their collision avoidance and multi-robot coordination require 3D scene data from real industrial environments with dynamic obstacles, tight workspaces, and complex robot cell configurations."] },
    { type: "prose", heading: "How Claru Supports Realtime Robotics", paragraphs: ["Claru addresses Realtime Robotics\'s data needs through purpose-built collection campaigns coordinated across our global network of 10,000+ collectors in 100+ cities. For manipulation data, Claru captures multi-modal recordings with dense annotations in diverse real-world environments. For perception pretraining, Claru\'s egocentric activity datasets provide the visual grounding data that AI systems need.", "Custom collection campaigns can target specific environments, object categories, and sensor configurations that Realtime Robotics\'s pipeline requires. Each dataset receives multi-layer annotation through Claru\'s quality-controlled pipeline and is delivered in any standard robotics format."] },
    { type: "citation-list", heading: "References", citations: [{ id: "brohan-rt2-2023", title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", authors: "Brohan et al.", venue: "CoRL 2023", year: 2023, url: "https://arxiv.org/abs/2307.15818" }, { id: "open-x-embodiment-2024", title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models", authors: "Open X-Embodiment Collaboration", venue: "ICRA 2024", year: 2024, url: "https://arxiv.org/abs/2310.08864" }] }
  ],
  faqs: [
    { question: "What type of training data does Realtime Robotics need?", answer: "Realtime Robotics' motion planning technology needs diverse environment data to validate and benchmark their planning algorithms across realistic scenarios. Their collision avoidance and multi-robot coordination require 3D scene data from real industrial environments with dynamic obstacles, tight workspaces, and complex robot cell configurations." },
    { question: "How does real-world data help Realtime Robotics\'s sim-to-real transfer?", answer: "Simulation cannot faithfully model the contact dynamics, material properties, and environmental conditions that Realtime Robotics\'s robots encounter in deployment. Real-world data provides the distributional coverage that fills simulation gaps." },
    { question: "Can Claru provide custom data collection for Realtime Robotics?", answer: "Yes. Claru operates a global network of 10,000+ data collectors across 100+ cities who can capture teleoperated demonstrations, egocentric video, and sensor data in target environments using standardized recording protocols." }
  ],
  ctaHeading: "Accelerate Realtime Robotics\'s Data Pipeline",
  ctaDescription: "Talk to our team about purpose-built datasets for Realtime Robotics\'s robotic systems.",
  relatedGlossaryTerms: ["manipulation-trajectory", "egocentric-video", "sim-to-real"],
  relatedGuidePages: [],
  relatedSolutionSlugs: []
};

export default page;
