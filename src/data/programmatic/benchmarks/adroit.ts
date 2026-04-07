import type { BenchmarkPageData } from "./types";
const page: BenchmarkPageData = {
  slug: "adroit",
  benchmarkName: "ADROIT",
  benchmarkDescription: "ADROIT (Autonomous Dexterous RObot In-hand manipulation Tasks) is a benchmark for dexterous manipulation using the Shadow Hand \u2014 a 24-DOF anthropomorphic robot hand. Developed at the University of Washington, it provides standardized tasks testing in-hand manipulation: pen spinning, valve turning, door opening, and object relocation.",
  taskSet: "4 dexterous tasks: pen twirling, valve rotation, door opening with latch, object relocation. Each requires sophisticated multi-finger coordination and in-hand manipulation.",
  observationSpace: "Proprioceptive state (24 joint angles + velocities), object position and orientation, contact forces at fingertips.",
  actionSpace: "24-dimensional joint torques for the Shadow Hand. High-frequency control at 50Hz.",
  evaluationProtocol: "Task-specific success metrics: pen rotation angle, valve angle achieved, door opening angle, object displacement. Evaluation over randomized initial conditions.",
  simToRealGap: "MuJoCo simulation simplifies the Shadow Hand's tendon-driven actuation with ideal joint models. Real tendon coupling, cable friction, and actuator backlash significantly change hand dynamics. Contact physics between fingertips and objects misses real tactile feedback and finger deformation.",
  realWorldDataNeeds: "Real Shadow Hand or similar dexterous hand manipulation recordings with full joint state and contact force data. Tactile feedback during in-hand manipulation. Diverse object sets for manipulation generalization.",
  complementaryDatasets: [
    {
        "name": "Force-Torque Manipulation Dataset",
        "rationale": "Contact force data during manipulation provides the tactile signal that dexterous hand policies need."
    },
    {
        "name": "Custom Dexterous Hand Collection",
        "rationale": "Recordings on physical dexterous hands capture real actuator dynamics, tendon coupling, and contact physics."
    }
],
  keyPapers: [
    {
        "id": "rajeswaran-adroit-2018",
        "title": "Learning Complex Dexterous Manipulation with Deep Reinforcement Learning and Demonstrations",
        "authors": "Rajeswaran et al.",
        "venue": "RSS 2018",
        "year": 2018,
        "url": "https://arxiv.org/abs/1709.10087"
    },
    {
        "id": "chen-system-level-2023",
        "title": "Towards Human-Level Bimanual Dexterous Manipulation with Reinforcement Learning",
        "authors": "Chen et al.",
        "venue": "NeurIPS 2022",
        "year": 2022,
        "url": "https://arxiv.org/abs/2206.08686"
    }
],
  technicalAnalysis: "ADROIT represents the gold standard for in-hand dexterous manipulation benchmarks. The Shadow Hand's 24 degrees of freedom provide human-level dexterity in simulation, but the gap between simulated and real Shadow Hand performance remains one of the widest in robotics.\n\nThe tendon-driven actuation of the real Shadow Hand creates dynamics that MuJoCo's ideal joint models cannot capture. Real tendons have coupling (moving one finger affects others through shared routing), friction (varying with speed and temperature), and compliance (stretching under load). These actuator dynamics mean that a torque command produces different motions on the real hand than in simulation.\n\nThe contact physics gap is equally severe for in-hand manipulation. Pen spinning requires controlled slip between fingertips and pen surface \u2014 a phenomenon that depends on fingertip material compliance, surface texture, and applied normal force in ways that contact simulation approximates poorly. Real manipulation data with force feedback at fingertips provides the ground truth for calibrating contact models.\n\nADROIT's influence extends beyond its specific tasks. Many reinforcement learning methods are first validated on ADROIT tasks before being applied to real dexterous hardware. Real-world comparison data ensures these methods transfer rather than simply exploiting simulation artifacts.",
  metaTitle: "Real-World Data for ADROIT Benchmark | Claru",
  metaDescription: "Real-world manipulation and perception data for the ADROIT benchmark. Bridge the sim-to-real gap with purpose-collected training data.",
  primaryKeyword: "ADROIT real-world data",
  secondaryKeywords: ["adroit data", "ADROIT sim-to-real", "adroit benchmark data", "real data adroit"],
  canonicalPath: "/benchmarks/adroit",
  h1: "Real-World Data for ADROIT",
  heroSubtitle: "ADROIT provides standardized evaluation for robot learning. Real-world data validates whether simulation performance transfers to physical hardware.",
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Benchmarks", href: "/benchmarks" }, { label: "ADROIT", href: "/benchmarks/adroit" }],
  sections: [
    { type: "stats", heading: "ADROIT at a Glance", stats: [{ value: "Sim", label: "Environment" }, { value: "Multi", label: "Tasks" }, { value: "Standard", label: "Evaluation" }, { value: "Active", label: "Community" }] },
    { type: "prose", heading: "What Is ADROIT?", paragraphs: ["ADROIT (Autonomous Dexterous RObot In-hand manipulation Tasks) is a benchmark for dexterous manipulation using the Shadow Hand \u2014 a 24-DOF anthropomorphic robot hand. Developed at the University of Washington, it provides standardized tasks testing in-hand manipulation: pen spinning, valve turning, door opening, and object relocation."] },
    { type: "prose", heading: "The Sim-to-Real Gap", paragraphs: ["MuJoCo simulation simplifies the Shadow Hand's tendon-driven actuation with ideal joint models. Real tendon coupling, cable friction, and actuator backlash significantly change hand dynamics. Contact physics between fingertips and objects misses real tactile feedback and finger deformation.", "Real Shadow Hand or similar dexterous hand manipulation recordings with full joint state and contact force data. Tactile feedback during in-hand manipulation. Diverse object sets for manipulation generalization."] },
    { type: "prose", heading: "How Claru Supports ADROIT Users", paragraphs: ["Claru provides real-world data that complements ADROIT\'s simulation benchmark. For teams working on sim-to-real transfer, we collect manipulation and perception data in target environments and on specific robot platforms to enable direct comparison between simulated and real performance.", "Our distributed collector network captures data across diverse real-world conditions — different lighting, environments, and object sets — providing the distributional coverage that narrows the sim-to-real gap for ADROIT-trained policies."] },
    { type: "citation-list", heading: "Key References", citations: [{"id": "rajeswaran-adroit-2018", "title": "Learning Complex Dexterous Manipulation with Deep Reinforcement Learning and Demonstrations", "authors": "Rajeswaran et al.", "venue": "RSS 2018", "year": 2018, "url": "https://arxiv.org/abs/1709.10087"}, {"id": "chen-system-level-2023", "title": "Towards Human-Level Bimanual Dexterous Manipulation with Reinforcement Learning", "authors": "Chen et al.", "venue": "NeurIPS 2022", "year": 2022, "url": "https://arxiv.org/abs/2206.08686"}] }
  ],
  faqs: [
    { question: "What makes ADROIT important for robotics research?", answer: "ADROIT (Autonomous Dexterous RObot In-hand manipulation Tasks) is a benchmark for dexterous manipulation using the Shadow Hand \u2014 a 24-DOF anthropomorphic robot hand. Developed at the University of Washington, it provides standardized tasks testing in-hand manipulation: pen spinning, valve turning, door opening, and object relocation." },
    { question: "Why is real-world data important for ADROIT?", answer: "Real Shadow Hand or similar dexterous hand manipulation recordings with full joint state and contact force data. Tactile feedback during in-hand manipulation. Diverse object sets for manipulation generalization." },
    { question: "How does the sim-to-real gap affect ADROIT results?", answer: "MuJoCo simulation simplifies the Shadow Hand's tendon-driven actuation with ideal joint models. Real tendon coupling, cable friction, and actuator backlash significantly change hand dynamics. Contact physics between fingertips and objects misses real tactile feedback and finger deformation." },
    { question: "Can Claru collect data on specific robot platforms?", answer: "Yes. Claru coordinates data collection on specific robot platforms and in specific environments to enable direct comparison between simulated and real performance for ADROIT tasks." }
  ],
  ctaHeading: "Get Real-World Data for ADROIT",
  ctaDescription: "Discuss purpose-collected data to validate and improve your ADROIT-trained policies on physical hardware.",
  relatedGlossaryTerms: ["sim-to-real", "manipulation-trajectory", "behavioral-cloning"],
  relatedGuidePages: [],
  relatedSolutionSlugs: []
};
export default page;
