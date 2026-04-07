import type { BenchmarkPageData } from "./types";
const page: BenchmarkPageData = {
  slug: "arnold",
  benchmarkName: "ARNOLD",
  benchmarkDescription: "ARNOLD (A Benchmark for Language-Grounded Task Learning with Continuous States in Realistic 3D Scenes) evaluates an agent's ability to follow natural language instructions to manipulate objects in photorealistic 3D environments. Built on NVIDIA AI2-THOR, it bridges language understanding and physical manipulation.",
  taskSet: "8 language-grounded manipulation tasks: pick up, reposition, open/close, toggle, pour, heat/cool. Each task is conditioned on natural language instructions with diverse phrasings.",
  observationSpace: "Photorealistic RGB images from agent's egocentric camera, depth maps, agent's current pose, object states.",
  actionSpace: "Discrete navigation actions plus continuous manipulation parameters (grasp pose, force, motion trajectory).",
  evaluationProtocol: "Success rate for achieving the target state described in natural language. Evaluated across diverse instruction phrasings and object arrangements.",
  simToRealGap: "AI2-THOR photorealistic rendering reduces visual gap but physical interactions (pouring, heating) use simplified state transitions rather than continuous physics. Language diversity in evaluation is limited to template-based variations.",
  realWorldDataNeeds: "Real-world language-grounded manipulation demonstrations. Diverse natural language instructions paired with manipulation actions. Real physical interactions (actual pouring, opening, toggling) rather than state transitions.",
  complementaryDatasets: [
    {
        "name": "Custom Language-Paired Collection",
        "rationale": "Real demonstrations paired with diverse natural language instructions provide the grounding data that templates cannot match."
    },
    {
        "name": "Egocentric Kitchen Video Dataset",
        "rationale": "Kitchen manipulation video provides visual pretraining for the household environments ARNOLD evaluates."
    },
    {
        "name": "Manipulation Trajectory Dataset",
        "rationale": "Real manipulation recordings provide authentic physics for the contact-rich interactions ARNOLD simulates."
    }
],
  keyPapers: [
    {
        "id": "gong-arnold-2023",
        "title": "ARNOLD: A Benchmark for Language-Grounded Task Learning with Continuous States in Realistic 3D Scenes",
        "authors": "Gong et al.",
        "venue": "ICCV 2023",
        "year": 2023,
        "url": "https://arxiv.org/abs/2304.04321"
    },
    {
        "id": "shridhar-cliport-2022",
        "title": "CLIPort: What and Where Pathways for Robotic Manipulation",
        "authors": "Shridhar et al.",
        "venue": "CoRL 2022",
        "year": 2022,
        "url": "https://arxiv.org/abs/2109.12098"
    }
],
  technicalAnalysis: "ARNOLD represents the convergence of natural language processing and robotic manipulation benchmarking. The benchmark tests whether models can understand language instructions, ground them in visual observations, and execute the corresponding physical manipulation \u2014 the core capability needed for language-conditioned robots.\n\nThe language grounding challenge in ARNOLD extends beyond simple object references. Instructions like 'pour the coffee into the blue mug on the counter' require resolving spatial references, understanding object attributes, and decomposing the instruction into a sequence of physical actions. Current VLA models achieve moderate success on template-based instructions but struggle with the compositional complexity of natural language.\n\nAI2-THOR's photorealistic rendering narrows the visual domain gap compared to MuJoCo or PyBullet-based benchmarks, but the physical interaction gap remains wide. Pouring in AI2-THOR is a state transition (liquid teleports from container A to container B), not a physical simulation of fluid dynamics. Similarly, opening doors and drawers uses simplified hinge models. Real-world data where these physical interactions actually occur provides the ground truth for evaluating whether models understand physical causality or just memorize simulation-specific shortcuts.\n\nThe instruction diversity gap is particularly important. Template-based evaluation ('pick up the [object] from the [location]') tests a narrow slice of language understanding. Real humans give instructions in diverse ways \u2014 elliptical, indirect, contextual. Training and evaluation on real language instructions, paired with actual demonstrations, tests genuine language grounding rather than template matching.",
  metaTitle: "Real-World Data for ARNOLD Benchmark | Claru",
  metaDescription: "Real-world manipulation and perception data for the ARNOLD benchmark. Bridge the sim-to-real gap with purpose-collected training data.",
  primaryKeyword: "ARNOLD real-world data",
  secondaryKeywords: ["arnold data", "ARNOLD sim-to-real", "arnold benchmark data", "real data arnold"],
  canonicalPath: "/benchmarks/arnold",
  h1: "Real-World Data for ARNOLD",
  heroSubtitle: "ARNOLD provides standardized evaluation for robot learning. Real-world data validates whether simulation performance transfers to physical hardware.",
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Benchmarks", href: "/benchmarks" }, { label: "ARNOLD", href: "/benchmarks/arnold" }],
  sections: [
    { type: "stats", heading: "ARNOLD at a Glance", stats: [{ value: "Sim", label: "Environment" }, { value: "Multi", label: "Tasks" }, { value: "Standard", label: "Evaluation" }, { value: "Active", label: "Community" }] },
    { type: "prose", heading: "What Is ARNOLD?", paragraphs: ["ARNOLD (A Benchmark for Language-Grounded Task Learning with Continuous States in Realistic 3D Scenes) evaluates an agent's ability to follow natural language instructions to manipulate objects in photorealistic 3D environments. Built on NVIDIA AI2-THOR, it bridges language understanding and physical manipulation."] },
    { type: "prose", heading: "The Sim-to-Real Gap", paragraphs: ["AI2-THOR photorealistic rendering reduces visual gap but physical interactions (pouring, heating) use simplified state transitions rather than continuous physics. Language diversity in evaluation is limited to template-based variations.", "Real-world language-grounded manipulation demonstrations. Diverse natural language instructions paired with manipulation actions. Real physical interactions (actual pouring, opening, toggling) rather than state transitions."] },
    { type: "prose", heading: "How Claru Supports ARNOLD Users", paragraphs: ["Claru provides real-world data that complements ARNOLD\'s simulation benchmark. For teams working on sim-to-real transfer, we collect manipulation and perception data in target environments and on specific robot platforms to enable direct comparison between simulated and real performance.", "Our distributed collector network captures data across diverse real-world conditions — different lighting, environments, and object sets — providing the distributional coverage that narrows the sim-to-real gap for ARNOLD-trained policies."] },
    { type: "citation-list", heading: "Key References", citations: [{"id": "gong-arnold-2023", "title": "ARNOLD: A Benchmark for Language-Grounded Task Learning with Continuous States in Realistic 3D Scenes", "authors": "Gong et al.", "venue": "ICCV 2023", "year": 2023, "url": "https://arxiv.org/abs/2304.04321"}, {"id": "shridhar-cliport-2022", "title": "CLIPort: What and Where Pathways for Robotic Manipulation", "authors": "Shridhar et al.", "venue": "CoRL 2022", "year": 2022, "url": "https://arxiv.org/abs/2109.12098"}] }
  ],
  faqs: [
    { question: "What makes ARNOLD important for robotics research?", answer: "ARNOLD (A Benchmark for Language-Grounded Task Learning with Continuous States in Realistic 3D Scenes) evaluates an agent's ability to follow natural language instructions to manipulate objects in photorealistic 3D environments. Built on NVIDIA AI2-THOR, it bridges language understanding and physical manipulation." },
    { question: "Why is real-world data important for ARNOLD?", answer: "Real-world language-grounded manipulation demonstrations. Diverse natural language instructions paired with manipulation actions. Real physical interactions (actual pouring, opening, toggling) rather than state transitions." },
    { question: "How does the sim-to-real gap affect ARNOLD results?", answer: "AI2-THOR photorealistic rendering reduces visual gap but physical interactions (pouring, heating) use simplified state transitions rather than continuous physics. Language diversity in evaluation is limited to template-based variations." },
    { question: "Can Claru collect data on specific robot platforms?", answer: "Yes. Claru coordinates data collection on specific robot platforms and in specific environments to enable direct comparison between simulated and real performance for ARNOLD tasks." }
  ],
  ctaHeading: "Get Real-World Data for ARNOLD",
  ctaDescription: "Discuss purpose-collected data to validate and improve your ARNOLD-trained policies on physical hardware.",
  relatedGlossaryTerms: ["sim-to-real", "manipulation-trajectory", "behavioral-cloning"],
  relatedGuidePages: [],
  relatedSolutionSlugs: []
};
export default page;
