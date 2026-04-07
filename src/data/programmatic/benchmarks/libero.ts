import type { BenchmarkPageData } from "./types";

const page: BenchmarkPageData = {
  slug: "libero",
  benchmarkName: "LIBERO",
  benchmarkDescription:
    "LIBERO (LIfelong BEnchmark for RObot learning) evaluates lifelong and continual learning for robot manipulation. Created by Liu et al. at UT Austin and NVIDIA, published at NeurIPS 2024, it tests whether robot policies can learn new tasks without forgetting previously learned ones, using 130 language-annotated manipulation tasks organized into 5 evaluation suites built on the robosuite/MuJoCo framework.",
  taskSet:
    "130 language-annotated manipulation tasks organized into 5 suites that each isolate a different generalization axis: LIBERO-Spatial (10 tasks testing spatial reasoning), LIBERO-Object (10 tasks testing object category generalization), LIBERO-Goal (10 tasks testing goal understanding with the same objects), LIBERO-Long (10 long-horizon multi-step tasks), and LIBERO-90 (90 tasks for comprehensive continual learning evaluation). Each suite is designed so that tasks share some structure but differ on the target axis.",
  observationSpace:
    "RGB images from agentview camera (128x128) and eye-in-hand wrist camera (128x128), proprioceptive state including 7 joint positions, 7 joint velocities, and gripper aperture, and natural language task descriptions specifying the manipulation goal.",
  actionSpace:
    "7-DOF end-effector pose deltas (3D position delta, 3D orientation delta, gripper open/close) at 20 Hz control frequency on a simulated Franka Panda arm via robosuite's OSC controller.",
  evaluationProtocol:
    "Forward transfer (FWT): performance on new tasks after sequential training. Backward transfer (BWT): performance retention on old tasks after learning new ones. Average success rate (ASR) across all learned tasks after full training sequence. The benchmark evaluates catastrophic forgetting by measuring BWT, and positive transfer by measuring whether learning task N helps task N+1.",
  simToRealGap:
    "LIBERO uses robosuite environments with MuJoCo physics, sharing that framework's simplified contact modeling. The continual learning evaluation assumes sequential task presentation in fixed order, which does not match real deployment where tasks arrive unpredictably and concurrently. All LIBERO tasks share the same visual renderer, which means policies may learn simulation-specific visual shortcuts for retaining knowledge across tasks rather than robust physical understanding.",
  realWorldDataNeeds:
    "Sequential real-world task demonstrations showing progressive skill acquisition across changing environments. Data from evolving environments where new objects, tools, and tasks appear over time while visual and physical conditions change. Visual diversity across task suites to prevent policies from learning renderer-specific features. Data that captures both the learning of new skills and the maintenance of old ones in authentic conditions.",
  complementaryDatasets: [
    {
      name: "Egocentric Activity Dataset",
      rationale:
        "Real human activity across 100+ diverse environments naturally demonstrates continual learning — skills acquired in one kitchen transfer and adapt to others, with authentic visual and physical variation.",
    },
    {
      name: "Manipulation Trajectory Dataset",
      rationale:
        "Diverse manipulation data across many task types and environments provides the variety and volume needed for evaluating real-world lifelong learning robustness.",
    },
    {
      name: "Custom Sequential Task Collection",
      rationale:
        "Purpose-collected data with tasks introduced progressively in real environments mirrors LIBERO's continual learning evaluation with authentic visual and physical variation between task phases.",
    },
  ],
  keyPapers: [
    {
      id: "liu-libero-2024",
      title:
        "LIBERO: Benchmarking Knowledge Transfer for Lifelong Robot Learning",
      authors: "Liu et al.",
      venue: "NeurIPS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2306.03310",
    },
    {
      id: "kirkpatrick-ewc-2017",
      title:
        "Overcoming Catastrophic Forgetting in Neural Networks",
      authors: "Kirkpatrick et al.",
      venue: "PNAS 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1612.00796",
    },
    {
      id: "mandlekar-robomimic-2022",
      title:
        "RoboMimic: A Framework for Studying Robotic Manipulation Policy Learning",
      authors: "Mandlekar et al.",
      venue: "CoRL 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2108.03298",
    },
    {
      id: "zhu-robosuite-2020",
      title:
        "robosuite: A Modular Simulation Framework and Benchmark for Robot Learning",
      authors: "Zhu et al.",
      venue: "arXiv 2009.12293",
      year: 2020,
      url: "https://arxiv.org/abs/2009.12293",
    },
  ],
  technicalAnalysis:
    "LIBERO addresses a fundamental challenge for deployed robots: they must learn new tasks over their lifetime without forgetting how to do old ones. This continual learning problem is well-studied in computer vision but underexplored in robotics, where each new task involves both visual perception changes and motor skill adaptation.\n\nThe five task suites cleverly isolate different generalization axes. LIBERO-Spatial tests whether a policy can adapt when objects move to new locations. LIBERO-Object tests generalization when new object categories appear. LIBERO-Goal tests understanding of novel task specifications with familiar objects. LIBERO-Long tests multi-step sequencing. This structured evaluation reveals which aspects of manipulation knowledge transfer naturally and which must be explicitly preserved through continual learning mechanisms.\n\nHowever, LIBERO's simulation environment means all tasks share the same visual renderer, physics engine, and workspace geometry. A policy might develop continual learning strategies that exploit simulation-specific invariances — texture consistency, lighting uniformity, deterministic physics — rather than building robust physical understanding. Real-world continual learning is harder because visual and physical conditions change unpredictably between task acquisition phases.\n\nThe catastrophic forgetting problem is more severe in the real world because visual domain shifts between environments compound the task-level forgetting. A robot that learns to pick up cups in a bright lab and then learns drawer manipulation in a dim workshop may forget cup picking not because of task interference but because the visual features have shifted. LIBERO cannot measure this coupled visual-task forgetting because its visual domain is constant.\n\nReal-world data for lifelong learning must capture the natural progression of skill acquisition across changing environments. Claru's dataset collection across 100+ locations naturally provides this — different environments present different manipulation challenges, visual conditions, and object sets, mirroring the evolving deployment contexts that real robots face throughout their operational lifetime.",
  metaTitle:
    "Real-World Data for LIBERO Lifelong Robot Learning | Claru",
  metaDescription:
    "Sequential task, continual learning, and diverse manipulation data for LIBERO's lifelong robot learning benchmark across spatial, object, and goal generalization.",
  primaryKeyword: "LIBERO benchmark real-world data",
  secondaryKeywords: [
    "lifelong robot learning data",
    "continual learning robot data",
    "LIBERO sim-to-real",
    "sequential task learning data",
    "catastrophic forgetting robot",
  ],
  canonicalPath: "/benchmarks/libero",
  h1: "Real-World Data for LIBERO",
  heroSubtitle:
    "LIBERO evaluates lifelong robot learning — whether policies acquire new skills without forgetting old ones. Real-world data tests this in authentic, visually changing conditions.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Benchmarks", href: "/benchmarks" },
    { label: "LIBERO", href: "/benchmarks/libero" },
  ],
  sections: [
    {
      type: "stats",
      heading: "LIBERO at a Glance",
      stats: [
        { value: "130", label: "Tasks" },
        { value: "5", label: "Task Suites" },
        { value: "MuJoCo", label: "Physics Engine" },
        { value: "Lifelong", label: "Learning Focus" },
        { value: "20 Hz", label: "Control Freq" },
        { value: "2024", label: "Published" },
      ],
    },
    {
      type: "prose",
      heading: "What Is LIBERO?",
      paragraphs: [
        "LIBERO is a benchmark specifically designed to evaluate continual and lifelong learning for robot manipulation. While most benchmarks test whether a policy can learn a set of tasks, LIBERO tests whether a policy can learn new tasks sequentially without forgetting previously learned ones — the fundamental challenge of deploying robots that must expand their capabilities over time.",
        "The benchmark provides 130 language-annotated manipulation tasks built on robosuite and MuJoCo, organized into 5 evaluation suites. Each suite isolates a different axis of generalization: spatial reasoning, object category transfer, goal understanding, long-horizon sequencing, and comprehensive multi-task continual learning.",
        "LIBERO's key insight is that lifelong learning for robots is not just about memory retention — it is about knowledge transfer. When a robot learns to open drawers, that knowledge should help it learn to open cabinets. LIBERO's structured suites measure both positive transfer (new task learning benefits from old knowledge) and catastrophic forgetting (old task performance degrades after new learning).",
      ],
    },
    {
      type: "comparison-table",
      heading: "LIBERO Task Suites",
      description:
        "Each suite isolates a different generalization axis, revealing which aspects of manipulation knowledge transfer and which cause interference.",
      columns: ["Suite", "Tasks", "Generalization Axis", "What It Measures"],
      rows: [
        {
          Suite: "LIBERO-Spatial",
          Tasks: "10",
          "Generalization Axis": "Spatial arrangement",
          "What It Measures": "Can the policy adapt when objects are in new locations?",
        },
        {
          Suite: "LIBERO-Object",
          Tasks: "10",
          "Generalization Axis": "Object categories",
          "What It Measures": "Can the policy generalize grasping to new object types?",
        },
        {
          Suite: "LIBERO-Goal",
          Tasks: "10",
          "Generalization Axis": "Task specification",
          "What It Measures": "Can the policy understand new goals with familiar objects?",
        },
        {
          Suite: "LIBERO-Long",
          Tasks: "10",
          "Generalization Axis": "Temporal complexity",
          "What It Measures": "Can the policy handle multi-step task sequences?",
        },
        {
          Suite: "LIBERO-90",
          Tasks: "90",
          "Generalization Axis": "Comprehensive",
          "What It Measures": "Full-scale continual learning across diverse tasks",
        },
      ],
    },
    {
      type: "prose",
      heading: "Evaluation Protocol",
      paragraphs: [
        "LIBERO evaluates continual learning using three complementary metrics. Forward transfer (FWT) measures how learning previous tasks helps or hurts performance on new tasks. Backward transfer (BWT) measures how learning new tasks affects performance on previously learned tasks — negative BWT indicates catastrophic forgetting. Average success rate (ASR) tracks overall competence across all tasks after the full training sequence.",
        "Tasks are presented sequentially: the policy trains on task suite 1, is evaluated, then trains on suite 2, is re-evaluated on both suites 1 and 2, and so on. This sequential protocol mimics a deployed robot that encounters new tasks over its operational lifetime while needing to maintain old capabilities.",
        "The benchmark also supports different continual learning strategies — rehearsal (replaying old task data), regularization (constraining weight updates to preserve old knowledge), and architecture expansion (adding new capacity for new tasks). LIBERO's standardized evaluation enables fair comparison across these fundamentally different approaches.",
        "LIBERO-90 provides the most demanding evaluation: 90 tasks presented in 9 sequential phases of 10 tasks each. By phase 9, the policy must maintain performance on 80 previously learned tasks while acquiring 10 new ones — a realistic approximation of the capacity demands facing a long-lived robot system.",
      ],
    },
    {
      type: "comparison-table",
      heading: "LIBERO vs. Related Benchmarks",
      columns: ["Feature", "LIBERO", "CALVIN", "Meta-World", "RLBench"],
      rows: [
        {
          Feature: "Primary evaluation",
          LIBERO: "Continual learning (forgetting + transfer)",
          CALVIN: "Sequential task chaining",
          "Meta-World": "Multi-task / meta-learning",
          RLBench: "Multi-task success rate",
        },
        {
          Feature: "Task count",
          LIBERO: "130",
          CALVIN: "34",
          "Meta-World": "50",
          RLBench: "100",
        },
        {
          Feature: "Language conditioning",
          LIBERO: "Templated language goals",
          CALVIN: "Free-form natural language",
          "Meta-World": "Task ID only",
          RLBench: "Task name only",
        },
        {
          Feature: "Sequential protocol",
          LIBERO: "Sequential task suites (continual)",
          CALVIN: "Sequential task chains (single episode)",
          "Meta-World": "Multi-task simultaneous",
          RLBench: "Multi-task simultaneous",
        },
        {
          Feature: "Physics engine",
          LIBERO: "MuJoCo (robosuite)",
          CALVIN: "PyBullet",
          "Meta-World": "MuJoCo",
          RLBench: "CoppeliaSim",
        },
      ],
    },
    {
      type: "prose",
      heading: "Bridging Simulation to Real Lifelong Learning",
      paragraphs: [
        "LIBERO's simulation-based evaluation misses a critical dimension of real-world lifelong learning: visual domain shift. In LIBERO, all tasks share the same renderer, so the visual distribution is constant across the entire learning sequence. A real robot learning new tasks in new environments faces coupled visual and task changes — new tasks appear alongside new lighting, new surfaces, and new object appearances.",
        "This coupling makes real-world continual learning harder than LIBERO predicts. A policy that retains drawer-opening skills across LIBERO's task suites may forget those skills when deployed because the visual context has shifted, not because of task-level interference. Measuring this coupled forgetting requires data from sequential task acquisition in changing real environments.",
        "Real-world continual learning also faces a data scarcity constraint absent from LIBERO. In simulation, the policy can rehearse old tasks with unlimited re-generation of demonstrations. In reality, old-task demonstrations are fixed once collected, and generating new demonstrations is expensive. Training data strategies must account for this asymmetry.",
        "Claru's data collection across 100+ locations naturally models the real continual learning challenge. Different environments provide different tasks, visual conditions, and physical properties — mirroring how a real robot's task repertoire grows alongside its environmental experience.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports LIBERO Users",
      paragraphs: [
        "Claru provides the environmentally diverse manipulation data that tests lifelong learning under realistic conditions. Our collection spans 100+ real-world locations with naturally varying lighting, surfaces, objects, and task types — providing the coupled visual-task variation that LIBERO's simulation cannot generate.",
        "For teams building continual learning systems, Claru can structure data collection to mirror LIBERO's sequential protocol: Phase 1 data from environment set A, Phase 2 from environment set B, and so on. This produces real-world evaluation data where both the task and the visual domain shift between learning phases, testing the coupled forgetting that simulation-only evaluation misses.",
        "Our collection also provides natural task diversity at scale. Real human environments contain a mixture of spatial, object, and goal variations — the same generalization axes LIBERO tests, but instantiated in authentic conditions with real physics, real lighting, and real object diversity.",
      ],
    },
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "liu-libero-2024",
          title:
            "LIBERO: Benchmarking Knowledge Transfer for Lifelong Robot Learning",
          authors: "Liu et al.",
          venue: "NeurIPS 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2306.03310",
        },
        {
          id: "kirkpatrick-ewc-2017",
          title:
            "Overcoming Catastrophic Forgetting in Neural Networks",
          authors: "Kirkpatrick et al.",
          venue: "PNAS 2017",
          year: 2017,
          url: "https://arxiv.org/abs/1612.00796",
        },
        {
          id: "mandlekar-robomimic-2022",
          title:
            "RoboMimic: A Framework for Studying Robotic Manipulation Policy Learning",
          authors: "Mandlekar et al.",
          venue: "CoRL 2022",
          year: 2022,
          url: "https://arxiv.org/abs/2108.03298",
        },
        {
          id: "zhu-robosuite-2020",
          title:
            "robosuite: A Modular Simulation Framework and Benchmark for Robot Learning",
          authors: "Zhu et al.",
          venue: "arXiv 2009.12293",
          year: 2020,
          url: "https://arxiv.org/abs/2009.12293",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "What is lifelong robot learning?",
      answer:
        "Lifelong learning means a robot acquires new manipulation skills over time without forgetting previously learned ones. LIBERO evaluates this by sequentially presenting task suites and measuring forward transfer (does old knowledge help with new tasks?), backward transfer (does new learning harm old skills?), and average success across all accumulated tasks.",
    },
    {
      question: "Why does continual learning need real-world data?",
      answer:
        "LIBERO's simulation uses consistent visual rendering and physics across all tasks, so policies may learn simulation-specific shortcuts for retaining knowledge. Real-world continual learning involves changing visual conditions, new physical environments, and unpredictable task arrival — coupled domain shifts that LIBERO's constant simulation environment cannot measure.",
    },
    {
      question: "What is catastrophic forgetting in robot manipulation?",
      answer:
        "Catastrophic forgetting occurs when training a neural network on new tasks causes it to lose performance on previously learned tasks. In manipulation, this means a robot that learns drawer opening and then learns stacking might suddenly fail at drawer opening. LIBERO's backward transfer metric directly quantifies this forgetting across its 130 tasks.",
    },
    {
      question: "How does environmental diversity support lifelong learning?",
      answer:
        "Diverse environments force policies to learn robust representations that transfer across conditions rather than memorizing environment-specific features. Training on manipulation in many different real kitchens builds visual features that generalize when the robot encounters a new kitchen — exactly the cross-environment transfer that lifelong learning requires for deployment.",
    },
    {
      question: "What is the difference between LIBERO's 5 task suites?",
      answer:
        "Each suite isolates one generalization axis. LIBERO-Spatial varies object locations. LIBERO-Object introduces new object categories. LIBERO-Goal changes task specifications with familiar objects. LIBERO-Long tests multi-step sequences. LIBERO-90 provides comprehensive evaluation with 90 diverse tasks. Together, they reveal which generalization dimensions cause the most forgetting and the most transfer.",
    },
  ],
  ctaHeading: "Get Sequential Task Learning Data",
  ctaDescription:
    "Discuss diverse, progressively structured data for lifelong robot learning research with authentic environmental variation.",
  relatedGlossaryTerms: [
    "transfer-learning-robotics",
    "behavioral-cloning",
    "language-conditioned-policy",
    "continual-learning",
  ],
  relatedGuidePages: [
    "how-to-build-a-manipulation-dataset",
    "how-to-build-a-language-conditioned-dataset",
  ],
  relatedSolutionSlugs: [],
};
export default page;
