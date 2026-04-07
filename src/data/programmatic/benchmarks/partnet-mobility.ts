import type { BenchmarkPageData } from "./types";
const page: BenchmarkPageData = {
  slug: "partnet-mobility",
  benchmarkName: "PartNet-Mobility",
  benchmarkDescription: "PartNet-Mobility is a large-scale dataset and benchmark of articulated 3D objects with part-level annotations and mobility information. Built on SAPIEN, it provides over 2,000 articulated object models across 46 categories with annotated joints, motion ranges, and part semantics for training manipulation policies.",
  taskSet: "Manipulation of articulated objects across 46 categories: cabinets, refrigerators, microwaves, laptops, scissors, and more. Each object has annotated joints (revolute, prismatic) with motion range limits.",
  observationSpace: "Point clouds or RGB-D of articulated objects, joint state information (angles, positions), part segmentation masks.",
  actionSpace: "End-effector actions (grasp + pull/push) or joint-level torques applied to articulated object parts.",
  evaluationProtocol: "Manipulation success measured by achieving target joint states. Generalization across object instances within categories and across unseen categories.",
  simToRealGap: "SAPIEN provides reasonable articulation simulation but simplifies joint friction, backlash, and wear. Real cabinet hinges, drawer slides, and laptop joints have resistance profiles that vary with age, load, and environmental conditions. Material interactions between gripper and object surfaces are simplified.",
  realWorldDataNeeds: "Real articulated object manipulation recordings with diverse object instances. Joint friction and resistance measurements from real objects. Multi-modal data (vision + force) during articulated object manipulation.",
  complementaryDatasets: [
    {
        "name": "Custom Articulated Object Collection",
        "rationale": "Real manipulation recordings of diverse articulated objects capture the joint friction, resistance, and material properties simulation simplifies."
    },
    {
        "name": "Force-Torque Manipulation Dataset",
        "rationale": "Force data during opening, closing, and adjusting articulated objects provides essential training signal for force-adaptive manipulation."
    },
    {
        "name": "Egocentric Activity Dataset",
        "rationale": "First-person video of humans using articulated objects in daily life provides visual pretraining for household manipulation policies."
    }
],
  keyPapers: [
    {
        "id": "xiang-sapien-2020",
        "title": "SAPIEN: A SimulAted Part-based Interactive ENvironment",
        "authors": "Xiang et al.",
        "venue": "CVPR 2020",
        "year": 2020,
        "url": "https://arxiv.org/abs/2003.08515"
    },
    {
        "id": "mo-partnet-2019",
        "title": "PartNet: A Large-Scale Benchmark for Fine-Grained and Hierarchical Part-Level 3D Object Understanding",
        "authors": "Mo et al.",
        "venue": "CVPR 2019",
        "year": 2019,
        "url": "https://arxiv.org/abs/1812.02713"
    }
],
  technicalAnalysis: "PartNet-Mobility is the definitive resource for articulated object manipulation research, providing the 3D models and annotations that nearly all articulated manipulation work builds on. The benchmark's value lies in the scale and diversity of its object collection \u2014 over 2,000 models across 46 categories, each with annotated part hierarchy and joint definitions.\n\nThe sim-to-real gap for articulated objects is deceptively wide. In simulation, a cabinet door has a single revolute joint with constant friction. In reality, the same cabinet door has a hinge with varying friction depending on load and position, a soft-close mechanism that changes resistance near the closed position, and a latch or magnetic catch that creates a step change in required force. These joint dynamics vary across manufacturers, ages, and conditions in ways that parameterized simulation models cannot capture.\n\nGeneralization across object instances is the benchmark's central challenge and the area where real-world data has the highest impact. A policy must learn to open cabinets of different sizes with different hinge types, drawers with different slide mechanisms, and refrigerators with different handle configurations. Simulation can randomize parameters, but real-world data captures the actual distribution of joint characteristics that randomization only approximates.\n\nThe part-level annotation structure of PartNet-Mobility enables research on part-aware manipulation \u2014 policies that understand which part to grasp, which direction to apply force, and how the object's kinematics constrain the motion. Real-world data validating these part-aware policies ensures they work with the imprecise part segmentation that real perception provides, not just the perfect annotations available in simulation.",
  metaTitle: "Real-World Data for PartNet-Mobility Benchmark | Claru",
  metaDescription: "Real-world manipulation and perception data for the PartNet-Mobility benchmark. Bridge the sim-to-real gap with purpose-collected training data.",
  primaryKeyword: "PartNet-Mobility real-world data",
  secondaryKeywords: ["partnet-mobility data", "PartNet-Mobility sim-to-real", "partnet-mobility benchmark data", "real data partnet-mobility"],
  canonicalPath: "/benchmarks/partnet-mobility",
  h1: "Real-World Data for PartNet-Mobility",
  heroSubtitle: "PartNet-Mobility provides standardized evaluation for robot learning. Real-world data validates whether simulation performance transfers to physical hardware.",
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Benchmarks", href: "/benchmarks" }, { label: "PartNet-Mobility", href: "/benchmarks/partnet-mobility" }],
  sections: [
    { type: "stats", heading: "PartNet-Mobility at a Glance", stats: [{ value: "Sim", label: "Environment" }, { value: "Multi", label: "Tasks" }, { value: "Standard", label: "Evaluation" }, { value: "Active", label: "Community" }] },
    { type: "prose", heading: "What Is PartNet-Mobility?", paragraphs: ["PartNet-Mobility is a large-scale dataset and benchmark of articulated 3D objects with part-level annotations and mobility information. Built on SAPIEN, it provides over 2,000 articulated object models across 46 categories with annotated joints, motion ranges, and part semantics for training manipulation policies."] },
    { type: "prose", heading: "The Sim-to-Real Gap", paragraphs: ["SAPIEN provides reasonable articulation simulation but simplifies joint friction, backlash, and wear. Real cabinet hinges, drawer slides, and laptop joints have resistance profiles that vary with age, load, and environmental conditions. Material interactions between gripper and object surfaces are simplified.", "Real articulated object manipulation recordings with diverse object instances. Joint friction and resistance measurements from real objects. Multi-modal data (vision + force) during articulated object manipulation."] },
    { type: "prose", heading: "How Claru Supports PartNet-Mobility Users", paragraphs: ["Claru provides real-world data that complements PartNet-Mobility\'s simulation benchmark. For teams working on sim-to-real transfer, we collect manipulation and perception data in target environments and on specific robot platforms to enable direct comparison between simulated and real performance.", "Our distributed collector network captures data across diverse real-world conditions — different lighting, environments, and object sets — providing the distributional coverage that narrows the sim-to-real gap for PartNet-Mobility-trained policies."] },
    { type: "citation-list", heading: "Key References", citations: [{"id": "xiang-sapien-2020", "title": "SAPIEN: A SimulAted Part-based Interactive ENvironment", "authors": "Xiang et al.", "venue": "CVPR 2020", "year": 2020, "url": "https://arxiv.org/abs/2003.08515"}, {"id": "mo-partnet-2019", "title": "PartNet: A Large-Scale Benchmark for Fine-Grained and Hierarchical Part-Level 3D Object Understanding", "authors": "Mo et al.", "venue": "CVPR 2019", "year": 2019, "url": "https://arxiv.org/abs/1812.02713"}] }
  ],
  faqs: [
    { question: "What makes PartNet-Mobility important for robotics research?", answer: "PartNet-Mobility is a large-scale dataset and benchmark of articulated 3D objects with part-level annotations and mobility information. Built on SAPIEN, it provides over 2,000 articulated object models across 46 categories with annotated joints, motion ranges, and part semantics for training manipulation policies." },
    { question: "Why is real-world data important for PartNet-Mobility?", answer: "Real articulated object manipulation recordings with diverse object instances. Joint friction and resistance measurements from real objects. Multi-modal data (vision + force) during articulated object manipulation." },
    { question: "How does the sim-to-real gap affect PartNet-Mobility results?", answer: "SAPIEN provides reasonable articulation simulation but simplifies joint friction, backlash, and wear. Real cabinet hinges, drawer slides, and laptop joints have resistance profiles that vary with age, load, and environmental conditions. Material interactions between gripper and object surfaces are simplified." },
    { question: "Can Claru collect data on specific robot platforms?", answer: "Yes. Claru coordinates data collection on specific robot platforms and in specific environments to enable direct comparison between simulated and real performance for PartNet-Mobility tasks." }
  ],
  ctaHeading: "Get Real-World Data for PartNet-Mobility",
  ctaDescription: "Discuss purpose-collected data to validate and improve your PartNet-Mobility-trained policies on physical hardware.",
  relatedGlossaryTerms: ["sim-to-real", "manipulation-trajectory", "behavioral-cloning"],
  relatedGuidePages: [],
  relatedSolutionSlugs: []
};
export default page;
