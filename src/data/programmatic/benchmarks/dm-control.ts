import type { BenchmarkPageData } from "./types";
const page: BenchmarkPageData = {
  slug: "dm-control",
  benchmarkName: "DeepMind Control Suite",
  benchmarkDescription: "The DeepMind Control Suite (dm_control) is a set of continuous control tasks built on MuJoCo, providing standardized benchmarks for reinforcement learning in locomotion, manipulation, and balance. Created by DeepMind, it has become one of the most widely used RL benchmarks for evaluating policy learning algorithms.",
  taskSet: "30+ control tasks across domains: locomotion (walker, cheetah, hopper, humanoid, quadruped), manipulation (reacher, finger), and balance (cartpole, pendulum, acrobot). Parametric difficulty levels.",
  observationSpace: "Proprioceptive state: joint positions, velocities, body orientations. Some tasks include visual observations (pixel rendering from MuJoCo cameras).",
  actionSpace: "Continuous joint torques or position targets. Action dimensions vary from 1 (cartpole) to 21 (humanoid).",
  evaluationProtocol: "Cumulative reward over fixed episode length. Standard evaluation over 10-100 episodes with reporting of mean and standard deviation.",
  simToRealGap: "MuJoCo physics provides accurate rigid-body dynamics but simplifies ground contact, actuator models, and environmental forces. The humanoid locomotion tasks use idealized body models that miss real biomechanical complexity. Visual observations render clean scenes without real-world visual noise.",
  realWorldDataNeeds: "Real-world locomotion recordings for ground truth comparison. Sensor noise characterization from physical systems. Real visual observations with authentic lighting, textures, and environmental conditions.",
  complementaryDatasets: [
    {
        "name": "Custom Locomotion Data Collection",
        "rationale": "Real walking, balancing, and reaching data provides ground truth for calibrating dm_control's simplified physics."
    },
    {
        "name": "Egocentric Activity Dataset",
        "rationale": "Real-world visual data provides authentic visual features for the pixel-based observation variants of dm_control tasks."
    }
],
  keyPapers: [
    {
        "id": "tassa-dmcontrol-2018",
        "title": "DeepMind Control Suite",
        "authors": "Tassa et al.",
        "venue": "arXiv 1801.00690",
        "year": 2018,
        "url": "https://arxiv.org/abs/1801.00690"
    },
    {
        "id": "hafner-dreamer-2020",
        "title": "Dream to Control: Learning Behaviors by Latent Imagination",
        "authors": "Hafner et al.",
        "venue": "ICLR 2020",
        "year": 2020,
        "url": "https://arxiv.org/abs/1912.01603"
    }
],
  technicalAnalysis: "The DeepMind Control Suite serves as the common evaluation language for reinforcement learning research. Nearly every RL algorithm paper includes dm_control results, making it arguably the most influential benchmark in continuous control. However, its influence creates a risk: algorithms optimized for dm_control may exploit simulation-specific features that do not transfer to real systems.\n\nThe locomotion tasks (walker, cheetah, humanoid) use idealized body models with perfect joint actuation and simplified ground contact. Real bipedal walking involves compliant joints, ground reaction forces that vary with surface material, and the vestibular/proprioceptive feedback loops that biological locomotion depends on. Policies that achieve high reward on dm_control humanoid often produce unstable gaits on real hardware.\n\nThe visual observation variants of dm_control tasks render clean MuJoCo scenes \u2014 uniform lighting, no shadows, no visual noise. This creates a significant visual domain gap. A visuomotor policy trained on dm_control's clean renderings fails when confronted with real camera imagery containing noise, glare, occlusion, and background clutter.\n\nReal-world comparison data for dm_control tasks serves two purposes: validating that top-performing RL algorithms actually transfer to physical systems, and quantifying the sim-to-real gap for each task category. This data is the reality check that keeps algorithmic progress grounded in practical relevance.",
  metaTitle: "Real-World Data for DeepMind Control Suite Benchmark | Claru",
  metaDescription: "Real-world manipulation and perception data for the DeepMind Control Suite benchmark. Bridge the sim-to-real gap with purpose-collected training data.",
  primaryKeyword: "DeepMind Control Suite real-world data",
  secondaryKeywords: ["dm-control data", "DeepMind Control Suite sim-to-real", "dm-control benchmark data", "real data dm-control"],
  canonicalPath: "/benchmarks/dm-control",
  h1: "Real-World Data for DeepMind Control Suite",
  heroSubtitle: "DeepMind Control Suite provides standardized evaluation for robot learning. Real-world data validates whether simulation performance transfers to physical hardware.",
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Benchmarks", href: "/benchmarks" }, { label: "DeepMind Control Suite", href: "/benchmarks/dm-control" }],
  sections: [
    { type: "stats", heading: "DeepMind Control Suite at a Glance", stats: [{ value: "Sim", label: "Environment" }, { value: "Multi", label: "Tasks" }, { value: "Standard", label: "Evaluation" }, { value: "Active", label: "Community" }] },
    { type: "prose", heading: "What Is DeepMind Control Suite?", paragraphs: ["The DeepMind Control Suite (dm_control) is a set of continuous control tasks built on MuJoCo, providing standardized benchmarks for reinforcement learning in locomotion, manipulation, and balance. Created by DeepMind, it has become one of the most widely used RL benchmarks for evaluating policy learning algorithms."] },
    { type: "prose", heading: "The Sim-to-Real Gap", paragraphs: ["MuJoCo physics provides accurate rigid-body dynamics but simplifies ground contact, actuator models, and environmental forces. The humanoid locomotion tasks use idealized body models that miss real biomechanical complexity. Visual observations render clean scenes without real-world visual noise.", "Real-world locomotion recordings for ground truth comparison. Sensor noise characterization from physical systems. Real visual observations with authentic lighting, textures, and environmental conditions."] },
    { type: "prose", heading: "How Claru Supports DeepMind Control Suite Users", paragraphs: ["Claru provides real-world data that complements DeepMind Control Suite\'s simulation benchmark. For teams working on sim-to-real transfer, we collect manipulation and perception data in target environments and on specific robot platforms to enable direct comparison between simulated and real performance.", "Our distributed collector network captures data across diverse real-world conditions — different lighting, environments, and object sets — providing the distributional coverage that narrows the sim-to-real gap for DeepMind Control Suite-trained policies."] },
    { type: "citation-list", heading: "Key References", citations: [{"id": "tassa-dmcontrol-2018", "title": "DeepMind Control Suite", "authors": "Tassa et al.", "venue": "arXiv 1801.00690", "year": 2018, "url": "https://arxiv.org/abs/1801.00690"}, {"id": "hafner-dreamer-2020", "title": "Dream to Control: Learning Behaviors by Latent Imagination", "authors": "Hafner et al.", "venue": "ICLR 2020", "year": 2020, "url": "https://arxiv.org/abs/1912.01603"}] }
  ],
  faqs: [
    { question: "What makes DeepMind Control Suite important for robotics research?", answer: "The DeepMind Control Suite (dm_control) is a set of continuous control tasks built on MuJoCo, providing standardized benchmarks for reinforcement learning in locomotion, manipulation, and balance. Created by DeepMind, it has become one of the most widely used RL benchmarks for evaluating policy learning algorithms." },
    { question: "Why is real-world data important for DeepMind Control Suite?", answer: "Real-world locomotion recordings for ground truth comparison. Sensor noise characterization from physical systems. Real visual observations with authentic lighting, textures, and environmental conditions." },
    { question: "How does the sim-to-real gap affect DeepMind Control Suite results?", answer: "MuJoCo physics provides accurate rigid-body dynamics but simplifies ground contact, actuator models, and environmental forces. The humanoid locomotion tasks use idealized body models that miss real biomechanical complexity. Visual observations render clean scenes without real-world visual noise." },
    { question: "Can Claru collect data on specific robot platforms?", answer: "Yes. Claru coordinates data collection on specific robot platforms and in specific environments to enable direct comparison between simulated and real performance for DeepMind Control Suite tasks." }
  ],
  ctaHeading: "Get Real-World Data for DeepMind Control Suite",
  ctaDescription: "Discuss purpose-collected data to validate and improve your DeepMind Control Suite-trained policies on physical hardware.",
  relatedGlossaryTerms: ["sim-to-real", "manipulation-trajectory", "behavioral-cloning"],
  relatedGuidePages: [],
  relatedSolutionSlugs: []
};
export default page;
