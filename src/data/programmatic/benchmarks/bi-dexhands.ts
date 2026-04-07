import type { BenchmarkPageData } from "./types";
const page: BenchmarkPageData = {
  slug: "bi-dexhands",
  benchmarkName: "Bi-DexHands",
  benchmarkDescription: "Bi-DexHands is a benchmark for bimanual dexterous manipulation using two multi-finger robot hands. Developed at PKU, it provides standardized tasks requiring coordination between two dexterous hands in IsaacGym \u2014 a GPU-accelerated simulation environment.",
  taskSet: "20+ bimanual tasks: pass object hand-to-hand, reorient objects cooperatively, open bottles, fold cloth, stack blocks with two hands. Tasks require inter-hand coordination and force distribution.",
  observationSpace: "Joint positions and velocities for both hands (48+ DOF total), object pose, contact forces at fingertips of both hands.",
  actionSpace: "Joint position targets for two simulated dexterous hands. 48+ dimensional action space.",
  evaluationProtocol: "Task-specific success metrics evaluated over parallel GPU environments. Reports success rate, time to completion, and coordination quality metrics.",
  simToRealGap: "IsaacGym GPU parallelism enables massive training throughput but simplified contact between two hands and shared objects. Real bimanual dexterous manipulation involves inter-hand communication delays, asymmetric hand capabilities, and the physical coupling of forces through shared objects that simulation approximates.",
  realWorldDataNeeds: "Real bimanual dexterous manipulation recordings with dual-hand force sensing. Object handoff data with authentic timing and force coordination. Deformable object manipulation (cloth, rope) with two hands.",
  complementaryDatasets: [
    {
        "name": "Custom Bimanual Dexterous Collection",
        "rationale": "Real two-hand manipulation captures the coordination dynamics, timing constraints, and force distribution that simulation simplifies."
    },
    {
        "name": "Force-Torque Manipulation Dataset",
        "rationale": "Dual-hand force data during cooperative manipulation provides the coordination signal bimanual policies need."
    }
],
  keyPapers: [
    {
        "id": "chen-bidexhands-2022",
        "title": "Towards Human-Level Bimanual Dexterous Manipulation with Reinforcement Learning",
        "authors": "Chen et al.",
        "venue": "NeurIPS 2022",
        "year": 2022,
        "url": "https://arxiv.org/abs/2206.08686"
    },
    {
        "id": "makoviychuk-isaac-2021",
        "title": "Isaac Gym: High Performance GPU-Based Physics Simulation for Robot Learning",
        "authors": "Makoviychuk et al.",
        "venue": "NeurIPS 2021",
        "year": 2021,
        "url": "https://arxiv.org/abs/2108.10470"
    }
],
  technicalAnalysis: "Bi-DexHands pushes dexterous manipulation into the bimanual domain, where coordination between two multi-finger hands creates challenges that single-hand benchmarks do not address. The 48+ dimensional action space (two hands with 24+ DOF each) creates an enormous exploration problem that current RL methods can only handle with GPU-accelerated parallel simulation.\n\nThe coordination challenge is the benchmark's defining characteristic. Tasks like passing an object from one hand to another require precise timing of release and catch, force distribution that prevents dropping, and the ability to regrasp if the initial handoff is imperfect. Simulation assumes both hands receive and execute commands simultaneously, but real bimanual systems face communication latency and asynchronous control loops.\n\nDeformable object tasks (cloth folding, rope manipulation) are included in Bi-DexHands but represent the hardest sim-to-real transfer problem. The physics of fabric and rope deformation under multi-finger manipulation involves complex material properties that IsaacGym approximates. Real-world bimanual manipulation of deformable objects provides essential validation data.\n\nThe GPU-accelerated training paradigm that Bi-DexHands enables (training across thousands of parallel environments) produces policies that have seen massive simulated experience but zero real-world experience. Real bimanual manipulation data provides the distribution calibration that bridges this simulation-reality gap.",
  metaTitle: "Real-World Data for Bi-DexHands Benchmark | Claru",
  metaDescription: "Real-world manipulation and perception data for the Bi-DexHands benchmark. Bridge the sim-to-real gap with purpose-collected training data.",
  primaryKeyword: "Bi-DexHands real-world data",
  secondaryKeywords: ["bi-dexhands data", "Bi-DexHands sim-to-real", "bi-dexhands benchmark data", "real data bi-dexhands"],
  canonicalPath: "/benchmarks/bi-dexhands",
  h1: "Real-World Data for Bi-DexHands",
  heroSubtitle: "Bi-DexHands provides standardized evaluation for robot learning. Real-world data validates whether simulation performance transfers to physical hardware.",
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Benchmarks", href: "/benchmarks" }, { label: "Bi-DexHands", href: "/benchmarks/bi-dexhands" }],
  sections: [
    { type: "stats", heading: "Bi-DexHands at a Glance", stats: [{ value: "Sim", label: "Environment" }, { value: "Multi", label: "Tasks" }, { value: "Standard", label: "Evaluation" }, { value: "Active", label: "Community" }] },
    { type: "prose", heading: "What Is Bi-DexHands?", paragraphs: ["Bi-DexHands is a benchmark for bimanual dexterous manipulation using two multi-finger robot hands. Developed at PKU, it provides standardized tasks requiring coordination between two dexterous hands in IsaacGym \u2014 a GPU-accelerated simulation environment."] },
    { type: "prose", heading: "The Sim-to-Real Gap", paragraphs: ["IsaacGym GPU parallelism enables massive training throughput but simplified contact between two hands and shared objects. Real bimanual dexterous manipulation involves inter-hand communication delays, asymmetric hand capabilities, and the physical coupling of forces through shared objects that simulation approximates.", "Real bimanual dexterous manipulation recordings with dual-hand force sensing. Object handoff data with authentic timing and force coordination. Deformable object manipulation (cloth, rope) with two hands."] },
    { type: "prose", heading: "How Claru Supports Bi-DexHands Users", paragraphs: ["Claru provides real-world data that complements Bi-DexHands\'s simulation benchmark. For teams working on sim-to-real transfer, we collect manipulation and perception data in target environments and on specific robot platforms to enable direct comparison between simulated and real performance.", "Our distributed collector network captures data across diverse real-world conditions — different lighting, environments, and object sets — providing the distributional coverage that narrows the sim-to-real gap for Bi-DexHands-trained policies."] },
    { type: "citation-list", heading: "Key References", citations: [{"id": "chen-bidexhands-2022", "title": "Towards Human-Level Bimanual Dexterous Manipulation with Reinforcement Learning", "authors": "Chen et al.", "venue": "NeurIPS 2022", "year": 2022, "url": "https://arxiv.org/abs/2206.08686"}, {"id": "makoviychuk-isaac-2021", "title": "Isaac Gym: High Performance GPU-Based Physics Simulation for Robot Learning", "authors": "Makoviychuk et al.", "venue": "NeurIPS 2021", "year": 2021, "url": "https://arxiv.org/abs/2108.10470"}] }
  ],
  faqs: [
    { question: "What makes Bi-DexHands important for robotics research?", answer: "Bi-DexHands is a benchmark for bimanual dexterous manipulation using two multi-finger robot hands. Developed at PKU, it provides standardized tasks requiring coordination between two dexterous hands in IsaacGym \u2014 a GPU-accelerated simulation environment." },
    { question: "Why is real-world data important for Bi-DexHands?", answer: "Real bimanual dexterous manipulation recordings with dual-hand force sensing. Object handoff data with authentic timing and force coordination. Deformable object manipulation (cloth, rope) with two hands." },
    { question: "How does the sim-to-real gap affect Bi-DexHands results?", answer: "IsaacGym GPU parallelism enables massive training throughput but simplified contact between two hands and shared objects. Real bimanual dexterous manipulation involves inter-hand communication delays, asymmetric hand capabilities, and the physical coupling of forces through shared objects that simulation approximates." },
    { question: "Can Claru collect data on specific robot platforms?", answer: "Yes. Claru coordinates data collection on specific robot platforms and in specific environments to enable direct comparison between simulated and real performance for Bi-DexHands tasks." }
  ],
  ctaHeading: "Get Real-World Data for Bi-DexHands",
  ctaDescription: "Discuss purpose-collected data to validate and improve your Bi-DexHands-trained policies on physical hardware.",
  relatedGlossaryTerms: ["sim-to-real", "manipulation-trajectory", "behavioral-cloning"],
  relatedGuidePages: [],
  relatedSolutionSlugs: []
};
export default page;
