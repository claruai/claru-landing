import type { BenchmarkPageData } from "./types";

const page: BenchmarkPageData = {
  slug: "rlbench",
  benchmarkName: "RLBench",
  benchmarkDescription:
    "RLBench is a large-scale benchmark and learning environment built on CoppeliaSim (V-REP) and PyRep. Created by Stephen James et al. at Imperial College London in 2020, it provides 100 carefully designed manipulation tasks with scripted demonstrations, supporting both reinforcement learning and imitation learning research. Each task includes multiple variations in object position, color, size, and count, making it the de facto standard for evaluating multi-task manipulation policies.",
  taskSet:
    "100 manipulation tasks spanning reach target, pick and place, stack blocks, open drawer, slide block, press button, put items in drawer, close jar, screw nail, place wine at rack, and complex multi-step sequences like set the table and put groceries in cupboard. Each task has 10-60 variations that change object color, position, and quantity. Tasks range from simple single-step reaching to complex multi-step sequences requiring 6+ coordinated actions.",
  observationSpace:
    "RGB images from up to 4 cameras (front, left shoulder, right shoulder, wrist) at 128x128 resolution, aligned depth maps, joint positions (7 joints), joint velocities, gripper open/close state, and task-specific low-dimensional state observations. Demonstrations include full 6-DOF end-effector waypoint trajectories.",
  actionSpace:
    "7-DOF joint velocities or 6-DOF end-effector delta poses (3D position + quaternion orientation) with binary gripper open/close. Most recent methods use keyframe-based action representations, predicting next-best-pose waypoints rather than continuous joint commands.",
  evaluationProtocol:
    "Success rate on held-out task variations over 25 evaluation episodes per task. Multi-task evaluation measures average success rate across all 100 tasks or a standard 18-task subset. Single-task evaluation uses 100 episodes per task with randomized initial conditions. Methods are compared on the number of demonstrations used (1, 5, 10, 20, 100 demos per task).",
  simToRealGap:
    "RLBench's CoppeliaSim physics diverges from real-world contact dynamics — objects slide unrealistically on surfaces, grasps succeed or fail discretely rather than exhibiting partial slip, and contacts are modeled as spring-damper systems with simplified friction. Camera rendering lacks photorealistic lighting, textures, and optical effects present in real sensor data. The simulated Franka Panda ignores real joint friction, backlash, torque limits, and the nonlinear dynamics of the real robot's impedance controller.",
  realWorldDataNeeds:
    "Real-world manipulation recordings on the same task categories as RLBench — pick-and-place, stacking, drawer operations, button pressing, jar manipulation, and multi-step sequences — collected with real robots or human demonstrations. Critical needs include authentic contact dynamics with diverse objects, photorealistic visual data from real environments, demonstrations on physical hardware with real actuator limitations, and multi-camera recordings that match RLBench's 4-camera observation setup.",
  complementaryDatasets: [
    {
      name: "Egocentric Activity Dataset",
      rationale:
        "Human demonstrations of manipulation tasks parallel to RLBench categories provide visual pretraining data that bridges the non-photorealistic simulation rendering gap across 100+ real-world environments.",
    },
    {
      name: "Manipulation Trajectory Dataset",
      rationale:
        "Real-world manipulation recordings with multi-camera views and temporal annotations provide authentic contact dynamics for tasks similar to RLBench's 100-task suite, including pick-and-place, drawer operations, and assembly.",
    },
    {
      name: "Custom Task-Matched Collection",
      rationale:
        "Purpose-collected real-world demonstrations of specific RLBench tasks enable direct sim-to-real comparison, simulation parameter calibration, and policy fine-tuning on physical hardware.",
    },
  ],
  keyPapers: [
    {
      id: "james-rlbench-2020",
      title:
        "RLBench: The Robot Learning Benchmark & Learning Environment",
      authors: "James et al.",
      venue: "RA-L 2020",
      year: 2020,
      url: "https://arxiv.org/abs/1909.12271",
    },
    {
      id: "shridhar-peract-2023",
      title:
        "Perceiver-Actor: A Multi-Task Transformer for Robotic Manipulation",
      authors: "Shridhar et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2209.05451",
    },
    {
      id: "goyal-rvt-2023",
      title:
        "RVT: Robotic View Transformer for 3D Object Manipulation",
      authors: "Goyal et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2306.14896",
    },
    {
      id: "gervet-act3d-2023",
      title:
        "Act3D: 3D Feature Field Transformers for Multi-Task Robotic Manipulation",
      authors: "Gervet et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2306.17817",
    },
    {
      id: "goyal-rvt2-2024",
      title:
        "RVT-2: Learning Precise Manipulation from Few Demonstrations",
      authors: "Goyal et al.",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2406.08545",
    },
  ],
  technicalAnalysis:
    "RLBench has become the de facto standard for evaluating multi-task manipulation policies. PerAct, RVT, RVT-2, Act3D, and GNFactor all benchmark against RLBench's task suite, creating a well-established leaderboard that drives architectural innovation. However, high RLBench scores do not reliably predict real-world performance, and this gap is well-documented.\n\nThe visual sim-to-real gap is particularly pronounced. CoppeliaSim's rendering engine produces clean, uniform lighting with simple flat-colored textures — nothing like the complex visual environment a real robot encounters. Models that learn to exploit RLBench's visual shortcuts (e.g., object color as the sole distinguishing feature between blocks) fail when confronted with photorealistic visual complexity where objects have similar colors, specular highlights, and partial occlusion.\n\nThe contact dynamics gap is equally critical. CoppeliaSim models contacts as spring-damper systems with simplified Coulomb friction. Real-world grasps involve complex friction cones, material deformation, surface contamination, and the compliance of real gripper pads. A policy that achieves 95% grasp success in RLBench may drop to 60% on real hardware because its learned grasping strategy relies on simulation-specific contact behavior that does not exist physically.\n\nThe keyframe action representation used by modern RLBench methods (PerAct, RVT) introduces an additional transfer challenge. These methods predict discrete next-best-pose waypoints, and a motion planner connects the waypoints. In simulation, motion planning always succeeds because the environment is fully known. On real hardware, motion planning must handle uncertainty, obstacles not in the model, and joint limits that the simulation's idealized robot does not have.\n\nBridging this gap requires real-world data collected on the same task categories. Claru can coordinate collection of manipulation demonstrations that directly parallel RLBench tasks — pick-and-place with real objects, drawer operations in real furniture, stacking with physical blocks — providing the authentic data needed to validate and calibrate simulation-trained policies before deployment.",
  metaTitle:
    "Real-World Data for RLBench Manipulation Benchmark | Claru",
  metaDescription:
    "Bridge the sim-to-real gap for RLBench's 100-task manipulation benchmark with real-world data, authentic contact dynamics, and photorealistic visual recordings.",
  primaryKeyword: "RLBench real-world data",
  secondaryKeywords: [
    "RLBench sim-to-real",
    "manipulation benchmark data",
    "RLBench transfer",
    "robot manipulation benchmark",
    "multi-task manipulation data",
  ],
  canonicalPath: "/benchmarks/rlbench",
  h1: "Real-World Data for RLBench",
  heroSubtitle:
    "RLBench is the standard benchmark for multi-task manipulation with 100 tasks. Real-world data reveals whether those simulation scores transfer to physical robots.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Benchmarks", href: "/benchmarks" },
    { label: "RLBench", href: "/benchmarks/rlbench" },
  ],
  sections: [
    {
      type: "stats",
      heading: "RLBench at a Glance",
      stats: [
        { value: "100", label: "Tasks" },
        { value: "7-DOF", label: "Action Space" },
        { value: "4", label: "Camera Views" },
        { value: "25", label: "Eval Episodes/Task" },
        { value: "CoppeliaSim", label: "Physics Engine" },
        { value: "2020", label: "Released" },
      ],
    },
    {
      type: "prose",
      heading: "What Is RLBench?",
      paragraphs: [
        "RLBench is the most widely used benchmark for evaluating multi-task manipulation policies in robot learning. Created by Stephen James and colleagues at Imperial College London, it provides 100 distinct manipulation tasks — from simple reaching to complex multi-step sequences like setting a table — in a unified CoppeliaSim simulation environment with a Franka Panda arm.",
        "Each task comes with scripted demonstrations (typically 100 per task), multi-camera observations from 4 viewpoints, and parameterized variations that change object properties and placement. This combination of task diversity, demonstration availability, and standardized evaluation has made RLBench the primary benchmark for architectures like PerAct, RVT, RVT-2, Act3D, and GNFactor.",
        "RLBench's design philosophy emphasizes breadth over depth: 100 tasks test generalization across manipulation categories, while per-task variations test robustness within a category. The few-shot evaluation protocol (training with 1, 5, 10, or 100 demonstrations per task) tests data efficiency, which is critical for real-world deployment where demonstrations are expensive to collect.",
        "Despite its popularity, RLBench has known limitations as a predictor of real-world performance. Its CoppeliaSim physics engine, non-photorealistic rendering, and idealized robot model create systematic gaps that high benchmark scores do not bridge. Understanding these gaps is essential for teams planning to deploy RLBench-evaluated policies on physical hardware.",
      ],
    },
    {
      type: "comparison-table",
      heading: "RLBench Task Categories",
      description:
        "RLBench's 100 tasks span manipulation primitives, tool use, articulated objects, and multi-step sequences. Each category presents different sim-to-real transfer challenges.",
      columns: ["Category", "Example Tasks", "Task Count", "Primary Transfer Gap"],
      rows: [
        {
          Category: "Pick & Place",
          "Example Tasks": "Pick up cup, place wine at rack",
          "Task Count": "~25",
          "Primary Transfer Gap": "Grasp stability, object weight, friction",
        },
        {
          Category: "Stacking & Assembly",
          "Example Tasks": "Stack blocks, stack cups, put ring on peg",
          "Task Count": "~15",
          "Primary Transfer Gap": "Contact-rich insertion, alignment tolerance",
        },
        {
          Category: "Articulated Objects",
          "Example Tasks": "Open drawer, open door, turn tap",
          "Task Count": "~15",
          "Primary Transfer Gap": "Mechanism friction, hinge dynamics",
        },
        {
          Category: "Tool Use",
          "Example Tasks": "Screw nail, sweep to dustpan",
          "Task Count": "~10",
          "Primary Transfer Gap": "Tool-object contact, force application",
        },
        {
          Category: "Reaching & Pressing",
          "Example Tasks": "Reach target, press button, push button",
          "Task Count": "~10",
          "Primary Transfer Gap": "Minimal (coarse positioning transfers well)",
        },
        {
          Category: "Multi-Step Sequences",
          "Example Tasks": "Set the table, put groceries in cupboard",
          "Task Count": "~10",
          "Primary Transfer Gap": "Error compounding, state estimation",
        },
        {
          Category: "Precision Manipulation",
          "Example Tasks": "Close jar, insert peg, place cups",
          "Task Count": "~15",
          "Primary Transfer Gap": "Tight tolerances, compliance control",
        },
      ],
    },
    {
      type: "prose",
      heading: "Evaluation Protocol",
      paragraphs: [
        "RLBench's evaluation protocol tests both multi-task generalization and data efficiency. The standard multi-task evaluation trains a single policy on all 100 tasks (or a standard 18-task subset) using a fixed number of demonstrations per task, then measures average success rate across held-out variations. The 18-task subset — used by PerAct, RVT, and Act3D — tests a representative sample spanning all manipulation categories.",
        "Data efficiency is measured by training with 1, 5, 10, 20, or 100 demonstrations per task and comparing success rates. This protocol reflects real-world constraints where collecting 100 demonstrations per task on physical hardware is expensive, but 5-10 demonstrations may be feasible. Methods that achieve high performance with few demonstrations are more practical for deployment.",
        "Each evaluation episode randomizes initial conditions: object positions, target locations, and task-specific parameters (e.g., which drawer to open, which block color to pick). The 25 episodes per task provide statistical confidence in success rate estimates. Methods are compared on both mean success rate and per-task breakdown, since aggregate scores can mask category-specific failures.",
        "Modern RLBench methods use keyframe-based action representations: instead of predicting continuous joint commands, they predict the next 6-DOF waypoint and use CoppeliaSim's built-in motion planner to reach it. This reduces the control problem to a series of perception-to-pose predictions but introduces a dependency on motion planning that has its own sim-to-real transfer challenges.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Sim vs. Real: Key Gaps in RLBench",
      columns: ["Dimension", "RLBench (Simulation)", "Real World"],
      rows: [
        {
          Dimension: "Contact Physics",
          "RLBench (Simulation)": "Spring-damper contacts, uniform Coulomb friction",
          "Real World": "Complex friction cones, material deformation, surface contamination",
        },
        {
          Dimension: "Visual Rendering",
          "RLBench (Simulation)": "Flat lighting, simple textures, no reflections",
          "Real World": "Complex shadows, specular highlights, clutter, varying lighting",
        },
        {
          Dimension: "Actuator Model",
          "RLBench (Simulation)": "Ideal joint control, no backlash or friction",
          "Real World": "Joint friction, backlash, torque limits, impedance control dynamics",
        },
        {
          Dimension: "Object Diversity",
          "RLBench (Simulation)": "Parameterized variations (color, size, position)",
          "Real World": "Infinite geometry, material, and weight variety",
        },
        {
          Dimension: "Motion Planning",
          "RLBench (Simulation)": "Always succeeds with full environment knowledge",
          "Real World": "Uncertain geometry, obstacles, joint limit collisions",
        },
        {
          Dimension: "Sensor Model",
          "RLBench (Simulation)": "Perfect RGB-D, no noise, no occlusion artifacts",
          "Real World": "Sensor noise, depth holes, motion blur, auto-exposure",
        },
      ],
    },
    {
      type: "comparison-table",
      heading: "RLBench vs. Related Benchmarks",
      description:
        "How RLBench compares to other widely used manipulation benchmarks.",
      columns: ["Feature", "RLBench", "ManiSkill 3", "LIBERO", "CALVIN"],
      rows: [
        {
          Feature: "Task count",
          RLBench: "100",
          "ManiSkill 3": "20+",
          LIBERO: "130",
          CALVIN: "34",
        },
        {
          Feature: "Physics engine",
          RLBench: "CoppeliaSim",
          "ManiSkill 3": "SAPIEN",
          LIBERO: "MuJoCo",
          CALVIN: "PyBullet",
        },
        {
          Feature: "GPU parallel",
          RLBench: "No",
          "ManiSkill 3": "Yes (4K+ envs)",
          LIBERO: "No",
          CALVIN: "No",
        },
        {
          Feature: "Multi-step eval",
          RLBench: "Some tasks",
          "ManiSkill 3": "Some tasks",
          LIBERO: "10-step suites",
          CALVIN: "5-step chains",
        },
        {
          Feature: "Language conditioning",
          RLBench: "Task name only",
          "ManiSkill 3": "Task name",
          LIBERO: "Templated",
          CALVIN: "Free-form natural language",
        },
        {
          Feature: "Rendering quality",
          RLBench: "Basic rasterized",
          "ManiSkill 3": "Ray-traced",
          LIBERO: "Basic rasterized",
          CALVIN: "Basic rasterized",
        },
      ],
    },
    {
      type: "prose",
      heading: "Bridging RLBench Simulation to Real Robots",
      paragraphs: [
        "The most successful RLBench-to-real transfer approaches use RLBench for architectural development and hyperparameter tuning, then fine-tune on a small amount of real-world data. This strategy leverages RLBench's fast, cheap evaluation to explore the design space, then uses expensive real-world demonstrations to bridge the remaining domain gap.",
        "Visual domain adaptation is the most studied gap. Approaches include domain randomization during simulation training, contrastive pretraining on real images, and neural rendering to make simulation look photorealistic. However, even state-of-the-art visual adaptation cannot fully bridge the gap because RLBench's visual simplicity means policies learn features that are not just visually different but semantically different from real-world visual features.",
        "The contact dynamics gap requires more than visual adaptation. A stacking policy that works in RLBench may place blocks at angles that are stable in CoppeliaSim's spring-damper model but topple on a real table. A drawer-opening policy may apply forces that work against CoppeliaSim's simplified friction but slip on real drawer slides. These physical transfer failures require real-world interaction data, not just real-world images.",
        "The keyframe action representation introduces a transfer-specific challenge. RLBench methods predict waypoints and use CoppeliaSim's motion planner to connect them. On real hardware, the motion planner must be replaced with a real-world planner that handles uncertainty, and the gap between planned and executed trajectories must be handled by a compliant controller. Real-world demonstration data that captures both waypoints and the intermediate trajectory execution provides training signal for this full pipeline.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports RLBench Users",
      paragraphs: [
        "Claru provides the real-world data that complements RLBench's simulation-based evaluation. For teams developing architectures on RLBench's 100-task suite, we coordinate collection of task-matched real-world demonstrations — pick-and-place with real objects, drawer operations on real furniture, stacking with physical blocks — enabling direct sim-to-real comparison.",
        "Our multi-camera collection protocol can match RLBench's 4-camera setup (front, left shoulder, right shoulder, wrist), providing observation-compatible real-world recordings for methods that depend on specific viewpoint configurations. Force and torque measurements during collection provide the contact dynamics ground truth that CoppeliaSim's physics engine does not capture.",
        "For teams using the few-shot evaluation protocol, Claru can provide exactly 5, 10, or 20 real-world demonstrations per task category, matching the evaluation budget. This enables apple-to-apple comparison of few-shot performance in simulation versus reality, quantifying the actual sim-to-real transfer gap for a specific architecture and data regime.",
      ],
    },
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "james-rlbench-2020",
          title:
            "RLBench: The Robot Learning Benchmark & Learning Environment",
          authors: "James et al.",
          venue: "RA-L 2020",
          year: 2020,
          url: "https://arxiv.org/abs/1909.12271",
        },
        {
          id: "shridhar-peract-2023",
          title:
            "Perceiver-Actor: A Multi-Task Transformer for Robotic Manipulation",
          authors: "Shridhar et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2209.05451",
        },
        {
          id: "goyal-rvt-2023",
          title:
            "RVT: Robotic View Transformer for 3D Object Manipulation",
          authors: "Goyal et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2306.14896",
        },
        {
          id: "gervet-act3d-2023",
          title:
            "Act3D: 3D Feature Field Transformers for Multi-Task Robotic Manipulation",
          authors: "Gervet et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2306.17817",
        },
        {
          id: "goyal-rvt2-2024",
          title:
            "RVT-2: Learning Precise Manipulation from Few Demonstrations",
          authors: "Goyal et al.",
          venue: "RSS 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2406.08545",
        },
      ],
    },
  ],
  faqs: [
    {
      question:
        "Why don't high RLBench scores translate to real-world robot performance?",
      answer:
        "RLBench uses simplified physics (spring-damper contacts), idealized actuators (no backlash or friction), and non-photorealistic rendering (flat lighting, simple textures). Policies learn to exploit simulation-specific shortcuts — relying on uniform object colors for identification, assuming perfect friction for grasping, depending on exact motion planning — that do not exist on real hardware. The visual gap, contact dynamics gap, and actuator model gap each independently contribute to performance drops during transfer.",
    },
    {
      question:
        "Which RLBench tasks are hardest to transfer to real robots?",
      answer:
        "Contact-rich tasks like stacking, insertion, and jar manipulation are hardest to transfer because they depend on friction and contact dynamics that CoppeliaSim models poorly. Multi-step tasks like set the table are also challenging due to compounding errors across steps. Tasks requiring only coarse positioning (reach target, push button) transfer most easily because they tolerate larger execution errors.",
    },
    {
      question:
        "How can real-world data improve RLBench-trained policies?",
      answer:
        "Three primary approaches: (1) Fine-tuning simulation-trained policies with a small number of real demonstrations to adapt contact strategies and visual features. (2) Calibrating simulation parameters using real-world force measurements to improve physics fidelity before training. (3) Training domain adaptation models on paired simulation and real visual data to translate between observation domains. The most effective approach combines all three.",
    },
    {
      question:
        "What is the standard evaluation protocol for RLBench?",
      answer:
        "The standard multi-task evaluation trains a single policy on 18 representative tasks (or all 100) using 1, 5, 10, 20, or 100 demonstrations per task, then evaluates success rate over 25 episodes per task with randomized initial conditions. The few-shot protocol (especially 5 and 10 demonstrations) is most commonly reported because it reflects the practical constraint of limited real-world data availability.",
    },
    {
      question:
        "How do keyframe-based methods affect sim-to-real transfer from RLBench?",
      answer:
        "Keyframe methods like PerAct and RVT predict 6-DOF waypoints rather than continuous joint commands, reducing the policy to a series of perception-to-pose predictions. This simplifies the learning problem but introduces dependency on a motion planner to connect waypoints. In simulation, motion planning always succeeds; on real hardware, planning must handle uncertainty, collision avoidance with imprecise geometry, and the gap between planned and executed trajectories requires compliant control.",
    },
  ],
  ctaHeading: "Get Real-World Data for RLBench Tasks",
  ctaDescription:
    "Discuss purpose-collected manipulation data that parallels RLBench's 100-task suite for sim-to-real validation and policy fine-tuning.",
  relatedGlossaryTerms: [
    "sim-to-real-gap",
    "manipulation-trajectory",
    "behavioral-cloning",
    "domain-randomization",
    "keyframe-action",
  ],
  relatedGuidePages: [
    "how-to-bridge-sim-to-real-gap",
    "how-to-evaluate-sim-to-real-transfer",
  ],
  relatedSolutionSlugs: [],
};
export default page;
