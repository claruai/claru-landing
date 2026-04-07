import type { BenchmarkPageData } from "./types";
const page: BenchmarkPageData = {
  slug: "furniture-bench-benchmark",
  benchmarkName: "FurnitureBench",
  benchmarkDescription: "FurnitureBench is a real-world furniture assembly benchmark that provides standardized tasks, hardware setup, and evaluation protocols for contact-rich, long-horizon manipulation. Created by researchers at CMU, it defines assembly tasks using real IKEA-style furniture parts with a Franka Panda robot.",
  taskSet: "3 assembly tasks of increasing difficulty: one-leg table assembly (4 steps), round table assembly (8 steps), and cabinet assembly (12 steps). Each requires precise alignment, insertion, and fastening.",
  observationSpace: "RGB images from 2 cameras (front and wrist), robot proprioception (joint positions, velocities, gripper width), force/torque at end-effector.",
  actionSpace: "7-DOF end-effector delta poses (position + orientation + gripper). 10Hz control frequency.",
  evaluationProtocol: "Success rate for complete assembly. Per-step success rate for partial credit. Time to completion as secondary metric. Real robot evaluation required.",
  simToRealGap: "FurnitureBench is a real-world benchmark by design, but teams that pre-train in simulation face gaps in insertion dynamics (real dowel-hole friction vs simulated), part alignment tolerances (real parts have manufacturing variance), and force feedback during tight-fit assembly.",
  realWorldDataNeeds: "Additional real-world assembly demonstrations beyond the provided dataset. Diverse demonstrator skill levels. Assembly demonstrations with force/torque data for contact-rich insertion steps.",
  complementaryDatasets: [
    {
        "name": "Manipulation Trajectory Dataset",
        "rationale": "Real assembly manipulation recordings complement FurnitureBench demonstrations with diverse contact-rich interactions."
    },
    {
        "name": "Force-Torque Manipulation Dataset",
        "rationale": "Force data during insertion and fastening captures the contact dynamics critical for furniture assembly policies."
    },
    {
        "name": "Custom Assembly Collection",
        "rationale": "Additional demonstrations on FurnitureBench hardware expand the training distribution for the benchmark's specific tasks."
    }
],
  keyPapers: [
    {
        "id": "heo-furniturebench-2023",
        "title": "FurnitureBench: Reproducible Real-World Benchmark for Long-Horizon Complex Manipulation",
        "authors": "Heo et al.",
        "venue": "RSS 2023",
        "year": 2023,
        "url": "https://arxiv.org/abs/2305.12821"
    },
    {
        "id": "zhao-act-2023",
        "title": "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
        "authors": "Zhao et al.",
        "venue": "RSS 2023",
        "year": 2023,
        "url": "https://arxiv.org/abs/2304.13705"
    }
],
  technicalAnalysis: "FurnitureBench stands out among manipulation benchmarks because it is explicitly designed as a real-world benchmark. While most benchmarks exist in simulation with optional real-world transfer, FurnitureBench defines the hardware setup, furniture parts, and evaluation protocol for reproducible real-world experiments.\n\nThe assembly tasks test long-horizon planning and contact-rich manipulation simultaneously. The 12-step cabinet assembly requires maintaining a plan over minutes of execution while handling the precise alignment and insertion that furniture assembly demands. A single failed insertion step invalidates the entire assembly, making robustness to contact uncertainty critical.\n\nThe benchmark provides a small set of human teleoperation demonstrations, but teams consistently find they need more data \u2014 especially for the harder tasks. The provided demonstrations come from expert teleoperators; data from demonstrators of varying skill levels would enable research on learning from suboptimal demonstrations.\n\nForce/torque data during assembly is particularly valuable for the insertion steps. Real dowel-into-hole insertion requires force modulation: enough force to seat the dowel but not so much that the table frame is damaged or pushed out of alignment. The force profile of a successful insertion differs from a failed one in ways that vision alone cannot capture.\n\nFurnitureBench's real-world nature makes it an ideal validation target for sim-to-real transfer research. Teams that pre-train in simulation can evaluate directly on the benchmark's standardized hardware, providing rigorous comparison of transfer methods.",
  metaTitle: "Real-World Data for FurnitureBench Benchmark | Claru",
  metaDescription: "Real-world manipulation and perception data for the FurnitureBench benchmark. Bridge the sim-to-real gap with purpose-collected training data.",
  primaryKeyword: "FurnitureBench real-world data",
  secondaryKeywords: ["furniture-bench-benchmark data", "FurnitureBench sim-to-real", "furniture-bench-benchmark benchmark data", "real data furniture-bench-benchmark"],
  canonicalPath: "/benchmarks/furniture-bench-benchmark",
  h1: "Real-World Data for FurnitureBench",
  heroSubtitle: "FurnitureBench provides standardized evaluation for robot learning. Real-world data validates whether simulation performance transfers to physical hardware.",
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Benchmarks", href: "/benchmarks" }, { label: "FurnitureBench", href: "/benchmarks/furniture-bench-benchmark" }],
  sections: [
    { type: "stats", heading: "FurnitureBench at a Glance", stats: [{ value: "Sim", label: "Environment" }, { value: "Multi", label: "Tasks" }, { value: "Standard", label: "Evaluation" }, { value: "Active", label: "Community" }] },
    { type: "prose", heading: "What Is FurnitureBench?", paragraphs: ["FurnitureBench is a real-world furniture assembly benchmark that provides standardized tasks, hardware setup, and evaluation protocols for contact-rich, long-horizon manipulation. Created by researchers at CMU, it defines assembly tasks using real IKEA-style furniture parts with a Franka Panda robot."] },
    { type: "prose", heading: "The Sim-to-Real Gap", paragraphs: ["FurnitureBench is a real-world benchmark by design, but teams that pre-train in simulation face gaps in insertion dynamics (real dowel-hole friction vs simulated), part alignment tolerances (real parts have manufacturing variance), and force feedback during tight-fit assembly.", "Additional real-world assembly demonstrations beyond the provided dataset. Diverse demonstrator skill levels. Assembly demonstrations with force/torque data for contact-rich insertion steps."] },
    { type: "prose", heading: "How Claru Supports FurnitureBench Users", paragraphs: ["Claru provides real-world data that complements FurnitureBench\'s simulation benchmark. For teams working on sim-to-real transfer, we collect manipulation and perception data in target environments and on specific robot platforms to enable direct comparison between simulated and real performance.", "Our distributed collector network captures data across diverse real-world conditions — different lighting, environments, and object sets — providing the distributional coverage that narrows the sim-to-real gap for FurnitureBench-trained policies."] },
    { type: "citation-list", heading: "Key References", citations: [{"id": "heo-furniturebench-2023", "title": "FurnitureBench: Reproducible Real-World Benchmark for Long-Horizon Complex Manipulation", "authors": "Heo et al.", "venue": "RSS 2023", "year": 2023, "url": "https://arxiv.org/abs/2305.12821"}, {"id": "zhao-act-2023", "title": "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware", "authors": "Zhao et al.", "venue": "RSS 2023", "year": 2023, "url": "https://arxiv.org/abs/2304.13705"}] }
  ],
  faqs: [
    { question: "What makes FurnitureBench important for robotics research?", answer: "FurnitureBench is a real-world furniture assembly benchmark that provides standardized tasks, hardware setup, and evaluation protocols for contact-rich, long-horizon manipulation. Created by researchers at CMU, it defines assembly tasks using real IKEA-style furniture parts with a Franka Panda robot." },
    { question: "Why is real-world data important for FurnitureBench?", answer: "Additional real-world assembly demonstrations beyond the provided dataset. Diverse demonstrator skill levels. Assembly demonstrations with force/torque data for contact-rich insertion steps." },
    { question: "How does the sim-to-real gap affect FurnitureBench results?", answer: "FurnitureBench is a real-world benchmark by design, but teams that pre-train in simulation face gaps in insertion dynamics (real dowel-hole friction vs simulated), part alignment tolerances (real parts have manufacturing variance), and force feedback during tight-fit assembly." },
    { question: "Can Claru collect data on specific robot platforms?", answer: "Yes. Claru coordinates data collection on specific robot platforms and in specific environments to enable direct comparison between simulated and real performance for FurnitureBench tasks." }
  ],
  ctaHeading: "Get Real-World Data for FurnitureBench",
  ctaDescription: "Discuss purpose-collected data to validate and improve your FurnitureBench-trained policies on physical hardware.",
  relatedGlossaryTerms: ["sim-to-real", "manipulation-trajectory", "behavioral-cloning"],
  relatedGuidePages: [],
  relatedSolutionSlugs: []
};
export default page;
