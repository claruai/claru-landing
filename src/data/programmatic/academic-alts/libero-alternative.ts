import type { AcademicAltPageData } from "../types";

const data: AcademicAltPageData = {
  slug: "libero-alternative",
  metaTitle: "LIBERO Alternative for Production Robot Training | Claru",
  metaDescription:
    "Compare LIBERO's 130 simulated lifelong-learning tasks with Claru's real-world training data. Licensing, scale, sim-to-real gap, and production readiness compared.",
  primaryKeyword: "libero alternative",
  secondaryKeywords: [
    "libero vs claru",
    "libero dataset limitations",
    "libero commercial alternative",
    "libero sim-to-real gap",
    "robot lifelong learning data",
  ],
  canonicalPath: "/compare/libero-alternative",
  h1: "LIBERO Alternative: Real-World Training Data for Production Robotics",
  heroSubtitle:
    "LIBERO pioneered benchmarking for lifelong robot learning with 130 simulated manipulation tasks. But simulation-only data hits a wall when you need to deploy in the real world. Compare LIBERO with Claru's production-grade, real-world data collection service.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Compare", href: "/compare" },
    { label: "LIBERO Alternative", href: "/compare/libero-alternative" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is LIBERO?",
      paragraphs: [
        "LIBERO (Lifelong Robotic Benchmark for Learning) is a benchmark suite published by Bo Liu, Yifeng Zhu, Chongkai Gao, and colleagues at UT Austin in 2023. It was designed specifically to evaluate lifelong and continual learning algorithms for robotic manipulation. The benchmark organizes 130 procedurally generated tasks into five task suites -- LIBERO-Spatial, LIBERO-Object, LIBERO-Goal, LIBERO-Long, and LIBERO-100 -- each isolating a different axis of task variation so researchers can measure how well policies transfer knowledge across sequentially presented tasks.",
        "All demonstrations in LIBERO are collected in the BDDL-based simulation environment built on the robosuite framework, using a Franka Emika Panda arm with a parallel-jaw gripper. Each task suite contains carefully controlled variations: LIBERO-Spatial changes object layouts while holding objects and goals fixed, LIBERO-Object swaps in novel objects while preserving spatial relationships, and LIBERO-Goal introduces new manipulation objectives. LIBERO-Long chains multiple subtasks into extended sequences, while LIBERO-100 provides a larger-scale evaluation with 100 diverse tasks. Each task comes with 50 expert demonstrations, yielding approximately 6,500 total demonstrations across the full benchmark.",
        "The dataset records 128x128 pixel agentview and eye-in-hand RGB images, 7-DoF joint positions and velocities, gripper state, and end-effector pose at each timestep. Language instructions accompany every task (e.g., 'pick up the red mug and place it on the shelf'). LIBERO is released under the MIT License, making it one of the most permissively licensed robotics benchmarks available. It has become a standard evaluation platform for continual learning methods, with adoption by research groups studying policy architectures like Diffusion Policy, ACT, and various transformer-based approaches.",
        "Since its release, LIBERO has been cited extensively in lifelong learning and multitask robotics research. Its structured task decomposition makes it especially useful for ablation studies. However, its value is fundamentally as a benchmark for algorithmic comparison rather than as a source of training data for real-world deployment.",
      ],
    },
    {
      type: "stats",
      heading: "LIBERO at a Glance",
      stats: [
        { value: "130", label: "Manipulation Tasks" },
        { value: "5", label: "Task Suites" },
        { value: "~6,500", label: "Expert Demonstrations" },
        { value: "50", label: "Demos per Task" },
        { value: "128x128", label: "Image Resolution" },
        { value: "1", label: "Robot (Simulated Franka)" },
      ],
    },
    {
      type: "comparison-table",
      heading: "LIBERO vs. Claru: Side-by-Side Comparison",
      description:
        "A detailed comparison across the dimensions that matter most when moving from research benchmarking to production deployment.",
      columns: ["Dimension", "LIBERO", "Claru"],
      rows: [
        {
          Dimension: "Data Source",
          LIBERO: "Simulation only (robosuite/BDDL)",
          Claru: "Real-world teleoperated demonstrations",
        },
        {
          Dimension: "Scale",
          LIBERO: "~6,500 demos across 130 tasks",
          Claru: "1K to 1M+ demos, scaled to your needs",
        },
        {
          Dimension: "Robot Platform",
          LIBERO: "Simulated Franka Panda only",
          Claru: "Any physical robot you deploy",
        },
        {
          Dimension: "Image Resolution",
          LIBERO: "128x128 RGB (agentview + wrist)",
          Claru: "Up to 4K RGB, configurable multi-view",
        },
        {
          Dimension: "Sensor Modalities",
          LIBERO: "RGB images, joint state, gripper state",
          Claru: "RGB + depth + force/torque + proprioception + tactile",
        },
        {
          Dimension: "Task Customization",
          LIBERO: "Fixed 130 tasks, procedurally generated",
          Claru: "Custom tasks designed for your deployment scenario",
        },
        {
          Dimension: "Environment Diversity",
          LIBERO: "Single simulated tabletop scene",
          Claru: "Real kitchens, warehouses, labs, factories",
        },
        {
          Dimension: "Language Annotations",
          LIBERO: "Template-based task instructions",
          Claru: "Free-form natural language with multi-annotator agreement",
        },
        {
          Dimension: "License",
          LIBERO: "MIT License",
          Claru: "Commercial license with IP assignment",
        },
        {
          Dimension: "Ongoing Collection",
          LIBERO: "Static benchmark (version-based updates)",
          Claru: "Continuous collection and iterative expansion",
        },
      ],
    },
    {
      type: "prose",
      heading: "Key Limitations of LIBERO for Production Use",
      paragraphs: [
        "The most fundamental limitation of LIBERO for production robotics is the sim-to-real gap. Every demonstration in the dataset is generated in simulation with perfect physics, deterministic lighting, and idealized object geometries. Policies trained exclusively on LIBERO data routinely fail when transferred to physical robots due to visual domain shift, unmodeled contact dynamics, and sensor noise that the simulation does not capture. While sim-to-real transfer techniques like domain randomization can narrow this gap, they cannot close it entirely for contact-rich manipulation.",
        "LIBERO's image resolution of 128x128 pixels is well below what production vision systems require. Modern visuomotor policies increasingly rely on high-resolution inputs (640x480 or above) to perceive fine-grained object features like texture, deformation, and small-part geometry. The low resolution was a practical choice for benchmark speed but limits the visual complexity of tasks that can be meaningfully evaluated.",
        "The dataset is restricted to a single robot morphology -- the Franka Emika Panda with a parallel-jaw gripper. Teams deploying different arm configurations, dexterous hands, mobile manipulators, or dual-arm systems cannot directly benefit from LIBERO data. The simulated Franka also lacks the kinematic imprecision and joint compliance that characterize real hardware.",
        "Task diversity, while impressive for a benchmark, is concentrated on tabletop manipulation in a single simulated kitchen-like scene. Real production environments span warehouses, retail shelves, hospital rooms, and manufacturing lines -- none of which are represented. The procedurally generated task variations control for specific factors (spatial, object, goal) but do not capture the unconstrained variability of real-world deployment.",
        "Finally, LIBERO contains no force/torque, tactile, or depth data. For contact-rich tasks like insertion, packing, or tool use, proprioceptive and haptic feedback is critical for reliable execution. The absence of these modalities makes LIBERO unsuitable as training data for policies that must handle compliant or force-sensitive manipulation.",
      ],
    },
    {
      type: "prose",
      heading: "When to Use LIBERO vs. Commercial Data",
      paragraphs: [
        "LIBERO is the right choice when your goal is algorithmic benchmarking. If you are publishing a paper on continual learning, multitask policy architectures, or knowledge transfer across sequential task distributions, LIBERO's controlled task suites provide exactly the structure needed for clean experimental comparisons. The five-suite decomposition lets you isolate whether your method improves on spatial generalization, object generalization, or long-horizon reasoning -- distinctions that would be confounded in unstructured real-world data.",
        "LIBERO is also useful for rapid prototyping. Because it runs entirely in simulation, you can iterate on policy architectures and training recipes without hardware overhead. Teams that are still in the algorithm development phase, before they have committed to a specific robot platform or deployment domain, can use LIBERO to validate ideas cheaply.",
        "Switch to Claru when you have a specific deployment target. If you know which robot you are shipping, which environment it will operate in, and which tasks it must execute, you need data that matches those exact conditions. Simulation data cannot capture the visual texture of your specific warehouse shelving, the mass distribution of your specific product SKUs, or the backlash in your specific actuators. Claru collects teleoperated demonstrations on your hardware, in your space, with the sensor suite you will use in production.",
        "The strongest approach for many teams is a combined pipeline: pretrain on simulation data (LIBERO or similar) for broad manipulation priors, then fine-tune on Claru's real-world demonstrations for deployment-specific performance. This combination leverages LIBERO's task diversity for general capability while relying on real data to close the sim-to-real gap.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Complements LIBERO",
      paragraphs: [
        "Claru's data collection service directly addresses LIBERO's core gaps. Where LIBERO provides simulated demonstrations on a single robot in a single scene, Claru deploys trained teleoperators to collect demonstrations on your physical robot in your actual deployment environment. This eliminates the sim-to-real transfer problem entirely -- the training data is real data from the start.",
        "For teams that have built initial policies using LIBERO, Claru provides the fine-tuning data layer that bridges the gap to production. Our demonstrations are collected at the resolution, frame rate, and sensor configuration your policy expects. We support multi-view setups with calibrated extrinsics, synchronized force/torque and tactile streams, and high-frequency proprioceptive logging -- modalities that simply do not exist in LIBERO.",
        "Claru also scales beyond LIBERO's fixed 50-demo-per-task ceiling. Production policies often require hundreds or thousands of demonstrations per task variant to achieve the reliability needed for deployment. We can collect 10,000+ demonstrations for a single task across environmental variations (different lighting, different object instances, different operator styles) that stress-test your policy's robustness in ways simulation cannot.",
        "Data is delivered in your preferred format -- RLDS, HDF5, zarr, or LeRobot -- with standardized schemas that plug directly into training pipelines. Every demonstration passes our multi-stage quality control process: automated trajectory validation, visual inspection for failure modes, and inter-annotator agreement checks on language annotations. The result is data that is not only real but production-grade.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "liu-libero-2023",
          title:
            "LIBERO: Benchmarking Knowledge Transfer for Lifelong Robot Learning",
          authors: "Liu et al.",
          venue: "NeurIPS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2306.03310",
        },
        {
          id: "chi-diffusion-2023",
          title:
            "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
          authors: "Chi et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2303.04137",
        },
        {
          id: "zhao-act-2023",
          title:
            "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
          authors: "Zhao et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2304.13705",
        },
        {
          id: "zhu-robosuite-2020",
          title:
            "robosuite: A Modular Simulation Framework and Benchmark for Robot Learning",
          authors: "Zhu et al.",
          venue: "arXiv 2020",
          year: 2020,
          url: "https://arxiv.org/abs/2009.12293",
        },
      ],
    },
  ],
  faqs: [
    {
      question:
        "Is LIBERO suitable for training production robot policies?",
      answer:
        "LIBERO is designed as a research benchmark for evaluating continual and lifelong learning algorithms, not as a training data source for production systems. Its 6,500 simulated demonstrations at 128x128 resolution lack the visual fidelity, sensor diversity, and environmental realism needed for reliable real-world deployment. It is best used for algorithmic comparison and prototyping, with real-world data added for production fine-tuning.",
    },
    {
      question: "Can I use LIBERO data commercially?",
      answer:
        "Yes. LIBERO is released under the MIT License, which permits commercial use without restriction. However, the practical limitation is that simulation-only data typically requires substantial additional real-world data to achieve production-level performance, which is where a service like Claru comes in.",
    },
    {
      question:
        "How does LIBERO's sim-to-real gap affect policy performance?",
      answer:
        "Policies trained exclusively on LIBERO's simulated data experience significant performance degradation when deployed on physical robots. The gap manifests in visual perception (synthetic vs. real textures and lighting), dynamics (idealized vs. noisy contact physics), and sensor characteristics (clean simulation vs. noisy real sensors). Domain randomization helps but does not fully close this gap for contact-rich tasks.",
    },
    {
      question:
        "What is the best way to combine LIBERO with real-world data?",
      answer:
        "The most effective approach is a pretrain-then-fine-tune pipeline. Use LIBERO (or similar simulation benchmarks) during pretraining to learn broad manipulation primitives and spatial reasoning. Then fine-tune on real-world demonstrations from Claru that match your exact robot, environment, and task requirements. This typically outperforms either data source alone.",
    },
    {
      question: "Does Claru support the same tasks as LIBERO?",
      answer:
        "Claru does not replicate LIBERO's specific task suite, because those tasks are defined within a simulation environment. Instead, Claru collects demonstrations for the real-world tasks you actually need -- pick-and-place, packing, assembly, tool use, or any custom manipulation task on your specific robot platform and in your actual deployment environment.",
    },
  ],
  ctaHeading: "Close the Sim-to-Real Gap",
  ctaDescription:
    "Get real-world demonstrations on your robot, in your environment, at the scale your policy needs. Talk to our team about complementing your LIBERO research with production-grade training data.",
  relatedGlossaryTerms: [
    "sim-to-real-transfer",
    "imitation-learning",
    "lifelong-learning",
    "cross-embodiment-data",
  ],
  relatedGuidePages: [
    "how-to-build-a-cross-embodiment-dataset",
    "how-to-evaluate-training-data-quality",
  ],
  relatedSolutionSlugs: ["vla-training-data"],
  datasetName: "LIBERO",
  academicProfile: {
    institution: "UT Austin",
    year: 2023,
    scale:
      "130 tasks across 5 task suites, ~6,500 expert demonstrations in simulation",
    license: "MIT License",
    modalities: [
      "128x128 RGB images (agentview + wrist camera)",
      "7-DoF joint positions and velocities",
      "Gripper state",
      "End-effector pose",
      "Template language instructions",
    ],
  },
  limitations: [
    "Simulation-only data with no real-world demonstrations -- policies face significant sim-to-real gap",
    "Low image resolution (128x128) insufficient for fine-grained visual manipulation",
    "Single robot morphology (simulated Franka Panda with parallel-jaw gripper)",
    "Single tabletop scene with procedural variations -- no environmental diversity",
    "No force/torque, tactile, or depth sensor data",
    "Fixed at 50 demonstrations per task -- too few for production-grade training",
    "Template-based language instructions lack the variability of natural language",
    "Static benchmark with no mechanism for domain-specific task expansion",
  ],
  claruAdvantages: [
    "Real-world demonstrations on your physical robot -- zero sim-to-real gap",
    "High-resolution RGB (up to 4K), depth, force/torque, and tactile data",
    "Any robot platform: arms, mobile manipulators, dexterous hands, dual-arm",
    "Demonstrations in your actual deployment environment with real-world variability",
    "Scalable from hundreds to hundreds of thousands of demonstrations per task",
    "Free-form natural language annotations with multi-annotator agreement validation",
    "Commercial license with full IP assignment for production deployment",
    "Continuous collection and iterative expansion as your requirements evolve",
  ],
  keyPapers: [
    {
      id: "liu-libero-2023",
      title:
        "LIBERO: Benchmarking Knowledge Transfer for Lifelong Robot Learning",
      authors: "Liu et al.",
      venue: "NeurIPS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2306.03310",
    },
    {
      id: "chi-diffusion-2023",
      title:
        "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137",
    },
    {
      id: "zhao-act-2023",
      title:
        "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
      authors: "Zhao et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.13705",
    },
    {
      id: "zhu-robosuite-2020",
      title:
        "robosuite: A Modular Simulation Framework and Benchmark for Robot Learning",
      authors: "Zhu et al.",
      venue: "arXiv 2020",
      year: 2020,
      url: "https://arxiv.org/abs/2009.12293",
    },
  ],
  claruRelevance:
    "LIBERO has established itself as the standard benchmark for lifelong robot learning, and its structured task suites provide a rigorous framework for comparing continual learning algorithms. However, the transition from benchmarking to deployment reveals LIBERO's core limitation: it is entirely simulated. Every demonstration lives inside robosuite's physics engine, with idealized rendering, perfect sensor models, and deterministic dynamics. Policies that achieve high success rates on LIBERO's evaluation suite routinely struggle on physical hardware, where visual textures differ, contact dynamics are stochastic, and sensor noise is ever-present. Claru directly addresses this gap by collecting teleoperated demonstrations on your actual robot hardware, in the environments where your system will operate. Our data captures the visual complexity, physical dynamics, and sensor characteristics that simulation cannot replicate. Teams that have validated their algorithm on LIBERO can use Claru's real-world data for the critical fine-tuning phase that takes a research prototype to a deployable product. We deliver data in RLDS, HDF5, or LeRobot format with standardized observation and action schemas, making it straightforward to integrate Claru demonstrations into the same training pipeline you used for LIBERO. The result is a policy that inherits broad manipulation priors from simulation while grounding its behavior in the real-world data it needs to succeed in production.",
};

export default data;
