import type { BenchmarkPageData } from "./types";
const page: BenchmarkPageData = {
  slug: "dexart-benchmark",
  benchmarkName: "DexArt",
  benchmarkDescription: "DexArt is a benchmark for dexterous manipulation of articulated objects using multi-finger robot hands. Created by researchers at UC San Diego and Tsinghua University, it focuses on manipulating objects with joints and hinges \u2014 laptops, faucets, toilets, drawers \u2014 using simulated dexterous hands in SAPIEN.",
  taskSet: "4 articulated object manipulation tasks: open laptop, turn faucet, flip toilet lid, open bucket. Each task requires coordinating multiple fingers to manipulate object joints.",
  observationSpace: "RGB-D images, point clouds of articulated objects, proprioceptive state of dexterous hand joints, object joint angles.",
  actionSpace: "Multi-finger joint position targets for simulated dexterous hands (Allegro Hand or Shadow Hand equivalent).",
  evaluationProtocol: "Success rate for achieving target joint angle of the articulated object. Generalization tested across object instances within each category.",
  simToRealGap: "SAPIEN articulated object simulation simplifies joint friction and backlash. Simulated multi-finger contact misses real finger deformation and tactile feedback. Object material properties (plastic, metal, porcelain) affect manipulation but are simplified in simulation.",
  realWorldDataNeeds: "Real dexterous manipulation recordings of articulated objects with multi-finger contact data. Force/torque data during hinge and joint manipulation. Diverse articulated object instances with real material properties.",
  complementaryDatasets: [
    {
        "name": "Custom Dexterous Manipulation Collection",
        "rationale": "Real multi-finger manipulation of articulated objects provides the contact dynamics simulation cannot faithfully model."
    },
    {
        "name": "Force-Torque Manipulation Dataset",
        "rationale": "Force data during joint manipulation captures the resistance, friction, and compliance of real hinges and mechanisms."
    }
],
  keyPapers: [
    {
        "id": "bao-dexart-2023",
        "title": "DexArt: Benchmarking Generalizable Dexterous Manipulation with Articulated Objects",
        "authors": "Bao et al.",
        "venue": "CVPR 2023",
        "year": 2023,
        "url": "https://arxiv.org/abs/2305.05706"
    },
    {
        "id": "chen-dextransfer-2023",
        "title": "Visual Dexterity: In-Hand Dexterous Manipulation from Depth",
        "authors": "Chen et al.",
        "venue": "ICML 2023",
        "year": 2023,
        "url": "https://arxiv.org/abs/2211.11744"
    }
],
  technicalAnalysis: "DexArt addresses a critical gap in dexterous manipulation benchmarks: most focus on grasping rigid objects, but real-world dexterous tasks often involve manipulating articulated objects \u2014 opening containers, turning handles, adjusting mechanisms. These tasks require coordinating multiple fingers to apply force at specific points while respecting the object's kinematic constraints.\n\nThe sim-to-real gap for dexterous manipulation of articulated objects is particularly wide. Real hinges have friction, backlash, and varying resistance that depend on material, lubrication, and wear. A simulated laptop hinge behaves identically every time; a real one varies across manufacturers, ages, and conditions. Multi-finger contact during these interactions involves complex finger deformation and slip dynamics that current physics engines approximate poorly.\n\nGeneralization across object instances is the benchmark's central challenge. A policy must learn to open laptops of different sizes, with different hinge stiffness, and different opening angles. Real-world data spanning diverse object instances provides the distributional coverage that simulated object randomization only approximates.\n\nThe benchmark's focus on everyday articulated objects connects directly to household robotics applications. A robot assistant that can open drawers, turn faucets, and operate appliance doors would address some of the most requested household tasks. Real-world data of humans manipulating these objects provides the demonstration data for learning these everyday skills.",
  metaTitle: "Real-World Data for DexArt Benchmark | Claru",
  metaDescription: "Real-world manipulation and perception data for the DexArt benchmark. Bridge the sim-to-real gap with purpose-collected training data.",
  primaryKeyword: "DexArt real-world data",
  secondaryKeywords: ["dexart-benchmark data", "DexArt sim-to-real", "dexart-benchmark benchmark data", "real data dexart-benchmark"],
  canonicalPath: "/benchmarks/dexart-benchmark",
  h1: "Real-World Data for DexArt",
  heroSubtitle: "DexArt provides standardized evaluation for robot learning. Real-world data validates whether simulation performance transfers to physical hardware.",
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Benchmarks", href: "/benchmarks" }, { label: "DexArt", href: "/benchmarks/dexart-benchmark" }],
  sections: [
    { type: "stats", heading: "DexArt at a Glance", stats: [{ value: "Sim", label: "Environment" }, { value: "Multi", label: "Tasks" }, { value: "Standard", label: "Evaluation" }, { value: "Active", label: "Community" }] },
    { type: "prose", heading: "What Is DexArt?", paragraphs: ["DexArt is a benchmark for dexterous manipulation of articulated objects using multi-finger robot hands. Created by researchers at UC San Diego and Tsinghua University, it focuses on manipulating objects with joints and hinges \u2014 laptops, faucets, toilets, drawers \u2014 using simulated dexterous hands in SAPIEN."] },
    { type: "prose", heading: "The Sim-to-Real Gap", paragraphs: ["SAPIEN articulated object simulation simplifies joint friction and backlash. Simulated multi-finger contact misses real finger deformation and tactile feedback. Object material properties (plastic, metal, porcelain) affect manipulation but are simplified in simulation.", "Real dexterous manipulation recordings of articulated objects with multi-finger contact data. Force/torque data during hinge and joint manipulation. Diverse articulated object instances with real material properties."] },
    { type: "prose", heading: "How Claru Supports DexArt Users", paragraphs: ["Claru provides real-world data that complements DexArt\'s simulation benchmark. For teams working on sim-to-real transfer, we collect manipulation and perception data in target environments and on specific robot platforms to enable direct comparison between simulated and real performance.", "Our distributed collector network captures data across diverse real-world conditions — different lighting, environments, and object sets — providing the distributional coverage that narrows the sim-to-real gap for DexArt-trained policies."] },
    { type: "citation-list", heading: "Key References", citations: [{"id": "bao-dexart-2023", "title": "DexArt: Benchmarking Generalizable Dexterous Manipulation with Articulated Objects", "authors": "Bao et al.", "venue": "CVPR 2023", "year": 2023, "url": "https://arxiv.org/abs/2305.05706"}, {"id": "chen-dextransfer-2023", "title": "Visual Dexterity: In-Hand Dexterous Manipulation from Depth", "authors": "Chen et al.", "venue": "ICML 2023", "year": 2023, "url": "https://arxiv.org/abs/2211.11744"}] }
  ],
  faqs: [
    { question: "What makes DexArt important for robotics research?", answer: "DexArt is a benchmark for dexterous manipulation of articulated objects using multi-finger robot hands. Created by researchers at UC San Diego and Tsinghua University, it focuses on manipulating objects with joints and hinges \u2014 laptops, faucets, toilets, drawers \u2014 using simulated dexterous hands in SAPIEN." },
    { question: "Why is real-world data important for DexArt?", answer: "Real dexterous manipulation recordings of articulated objects with multi-finger contact data. Force/torque data during hinge and joint manipulation. Diverse articulated object instances with real material properties." },
    { question: "How does the sim-to-real gap affect DexArt results?", answer: "SAPIEN articulated object simulation simplifies joint friction and backlash. Simulated multi-finger contact misses real finger deformation and tactile feedback. Object material properties (plastic, metal, porcelain) affect manipulation but are simplified in simulation." },
    { question: "Can Claru collect data on specific robot platforms?", answer: "Yes. Claru coordinates data collection on specific robot platforms and in specific environments to enable direct comparison between simulated and real performance for DexArt tasks." }
  ],
  ctaHeading: "Get Real-World Data for DexArt",
  ctaDescription: "Discuss purpose-collected data to validate and improve your DexArt-trained policies on physical hardware.",
  relatedGlossaryTerms: ["sim-to-real", "manipulation-trajectory", "behavioral-cloning"],
  relatedGuidePages: [],
  relatedSolutionSlugs: []
};
export default page;
