import type { BenchmarkPageData } from "./types";

const page: BenchmarkPageData = {
  slug: "furniture-bench",
  benchmarkName: "FurnitureBench",
  benchmarkDescription:
    "FurnitureBench is a real-world furniture assembly benchmark created by Heo et al. at CMU and KAIST, presented at RSS 2023. It uses real IKEA-style 3D-printed furniture kits with standardized assembly sequences, providing both a physical evaluation protocol with reproducible hardware and a matched simulation environment in Isaac Gym for training. It is one of the few benchmarks with standardized real-world evaluation that any lab can replicate.",
  taskSet:
    "3 furniture assembly tasks of increasing difficulty: one-leg table (4 assembly steps), round table (8 assembly steps), and lamp assembly (11 assembly steps). Each requires multi-step manipulation including part identification, grasping, alignment under tight tolerances, insertion, and fastening. Tasks use 3D-printed parts with standardized dimensions and color-coded components.",
  observationSpace:
    "RGB images from front camera (640x480) and wrist-mounted camera, 7-DOF robot joint positions and velocities, end-effector 6-DOF pose, binary gripper state, and wrist-mounted force/torque measurements (6-axis).",
  actionSpace:
    "7-DOF end-effector delta poses (3D position + 3D orientation + gripper open/close) on a Franka Panda arm, executed at 10 Hz control frequency. OSC (Operational Space Control) impedance controller handles low-level joint commands.",
  evaluationProtocol:
    "Success rate on real hardware using standardized 3D-printed furniture kits. Assembly is measured by completion of each ordered subtask (pick part, transport, pre-align, insert, fasten) and overall assembly completion. Each task has a defined subtask sequence — success on step N requires completion of steps 1 through N-1. Evaluation uses 10-20 trials per task with randomized initial part placement.",
  simToRealGap:
    "FurnitureBench uniquely provides both simulation (Isaac Gym) and real evaluation, enabling direct sim-to-real comparison. The main gaps are insertion physics — peg-hole alignment with sub-millimeter tolerances requires force-sensitive control that simulation models imprecisely. Real 3D-printed parts have slight compliance, layer-line texture, and manufacturing variation that printed copies of the same part are not identical. Visual appearance differs between the simulation renderer and real parts under lab lighting.",
  realWorldDataNeeds:
    "Assembly demonstrations on real furniture kits with 6-axis force/torque feedback during insertion phases. Diverse assembly strategies showing different approach angles, grip choices, and recovery from misalignment. Data from assembly in varied lighting conditions and workspace configurations. Multi-modal demonstrations (teleoperation and human hand) to capture both robot-executable and human-expert strategies.",
  complementaryDatasets: [
    {
      name: "Manipulation Trajectory Dataset",
      rationale:
        "Contact-rich manipulation data with force measurements provides pretraining for the precise insertion and alignment skills that FurnitureBench's peg-in-hole assembly demands.",
    },
    {
      name: "Custom Assembly Task Collection",
      rationale:
        "Purpose-collected assembly demonstrations with diverse furniture kits and assembly strategies provide direct training data for multi-step assembly sequencing and error recovery.",
    },
    {
      name: "Egocentric Activity Dataset",
      rationale:
        "Human furniture assembly video from 100+ environments provides visual pretraining for understanding multi-step assembly sequences with natural error recovery and strategy adaptation.",
    },
  ],
  keyPapers: [
    {
      id: "heo-furniturebench-2023",
      title:
        "FurnitureBench: Reproducible Real-World Benchmark for Long-Horizon Complex Manipulation",
      authors: "Heo et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2305.12821",
    },
    {
      id: "lee-ikea-2021",
      title:
        "IKEA Furniture Assembly Environment for Long-Horizon Complex Manipulation Tasks",
      authors: "Lee et al.",
      venue: "ICRA 2021",
      year: 2021,
      url: "https://arxiv.org/abs/1911.07246",
    },
    {
      id: "chi-diffusion-policy-2023",
      title:
        "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137",
    },
    {
      id: "zhao-aloha-2023",
      title:
        "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
      authors: "Zhao et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.13705",
    },
  ],
  technicalAnalysis:
    "FurnitureBench is distinctive because it provides standardized physical evaluation — real 3D-printed furniture kits that any lab can reproduce from published STL files. This eliminates the hardware variability that makes comparing real-world results across labs difficult. Any researcher with a Franka Panda and a 3D printer can reproduce the exact evaluation conditions.\n\nThe assembly tasks test manipulation skills that most benchmarks ignore: precise alignment under sub-millimeter tolerances, multi-step sequencing with strict ordering dependencies (you cannot attach the tabletop before the legs), and force-sensitive insertion where visual observation alone is insufficient. These skills are directly relevant to manufacturing robotics and industrial assembly.\n\nThe insertion phase presents the hardest sim-to-real challenge. Peg-in-hole insertion with tight tolerances requires compliant, force-sensitive control — the robot must feel when the peg contacts the hole edge and adjust its approach angle and force vector. Isaac Gym models contact with simplified penalty-based methods that miss the stick-slip friction, part compliance, and alignment sensitivity of real insertion. A policy that learns to 'jam and push' in simulation will damage parts on real hardware.\n\nThe multi-step nature compounds the challenge. The lamp assembly requires 11 sequential steps, and failure at any step prevents completion. If the one-leg insertion has 85% success, the probability of completing all 4 steps of the one-leg table drops to ~52%. For the 11-step lamp, even 95% per-step success yields only ~57% full assembly completion.\n\nReal-world assembly data with force measurements during insertion provides the training signal simulation cannot generate. Demonstrations showing how force profiles change during successful versus failed insertions, and how experienced assemblers adapt their approach angle based on tactile feedback, provide the compliant control strategies that are absent from simulation-only training.",
  metaTitle:
    "Real-World Data for FurnitureBench Assembly Benchmark | Claru",
  metaDescription:
    "Furniture assembly, precision insertion, and multi-step manipulation data for FurnitureBench's reproducible real-world robot learning benchmark.",
  primaryKeyword: "FurnitureBench real-world data",
  secondaryKeywords: [
    "furniture assembly robot data",
    "precision insertion data",
    "long-horizon manipulation data",
    "FurnitureBench training data",
    "peg-in-hole robot data",
  ],
  canonicalPath: "/benchmarks/furniture-bench",
  h1: "Real-World Data for FurnitureBench",
  heroSubtitle:
    "FurnitureBench standardizes real-world furniture assembly evaluation with reproducible 3D-printed kits. Diverse assembly demonstrations build policies that handle the precision insertion and force control that simulation cannot teach.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Benchmarks", href: "/benchmarks" },
    { label: "FurnitureBench", href: "/benchmarks/furniture-bench" },
  ],
  sections: [
    {
      type: "stats",
      heading: "FurnitureBench at a Glance",
      stats: [
        { value: "3", label: "Assembly Tasks" },
        { value: "4-11", label: "Steps per Task" },
        { value: "Real HW", label: "Evaluation" },
        { value: "Franka Panda", label: "Robot" },
        { value: "10 Hz", label: "Control Freq" },
        { value: "2023", label: "Released" },
      ],
    },
    {
      type: "prose",
      heading: "What Is FurnitureBench?",
      paragraphs: [
        "FurnitureBench is a reproducible real-world benchmark for long-horizon, contact-rich manipulation created by researchers at CMU and KAIST. It provides IKEA-style furniture assembly tasks with standardized 3D-printed parts — any lab can download the STL files, print the parts, and reproduce the exact evaluation conditions on a Franka Panda arm.",
        "The benchmark fills a critical gap in robot learning evaluation. Most manipulation benchmarks run entirely in simulation, while real-world evaluations vary across labs due to different hardware, objects, and evaluation criteria. FurnitureBench standardizes all three: the robot platform (Franka Panda), the task objects (identical 3D-printed kits), and the evaluation protocol (ordered subtask completion).",
        "Three tasks test increasing assembly complexity. The one-leg table requires picking up a leg, aligning it with the base, and inserting it — 4 steps testing basic precision manipulation. The round table adds more parts and spatial planning. The lamp assembly demands 11 sequential steps including delicate component handling and multi-stage insertion sequences.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Assembly Task Breakdown",
      description:
        "Each FurnitureBench task requires ordered subtask completion. Failure at any step prevents subsequent steps.",
      columns: ["Task", "Assembly Steps", "Key Skill Tested", "Difficulty"],
      rows: [
        {
          Task: "One-Leg Table",
          "Assembly Steps": "4 (pick leg, pre-align, insert, verify)",
          "Key Skill Tested": "Precision peg insertion",
          Difficulty: "Medium",
        },
        {
          Task: "Round Table",
          "Assembly Steps": "8 (multi-leg + tabletop attachment)",
          "Key Skill Tested": "Sequential precision + spatial planning",
          Difficulty: "Hard",
        },
        {
          Task: "Lamp Assembly",
          "Assembly Steps": "11 (base, pole, shade, bulb, wiring)",
          "Key Skill Tested": "Delicate component handling + multi-stage insertion",
          Difficulty: "Very Hard",
        },
      ],
    },
    {
      type: "prose",
      heading: "Evaluation Protocol",
      paragraphs: [
        "FurnitureBench evaluates on real hardware using the standardized 3D-printed furniture kits. Each task is attempted 10-20 times with randomized initial part placement on the workspace. Success is measured at the subtask level — completing step 3 of 4 scores partial credit — and at the full-task level.",
        "The ordered dependency structure makes evaluation strict: step N can only succeed if steps 1 through N-1 completed successfully. This means per-step success rates multiply. A policy with 90% success on individual insertion steps achieves only ~73% on the 4-step one-leg table and ~31% on the 11-step lamp — demonstrating why long-horizon assembly requires near-perfect per-step reliability.",
        "The benchmark also provides a matched Isaac Gym simulation environment for training, enabling researchers to measure the exact sim-to-real gap for their approach. Published results show significant drops from simulation to real hardware, particularly on insertion steps where force-sensitive control is critical.",
        "Phase-based evaluation separates transport (moving parts to the assembly location) from insertion (precision alignment and force-controlled joining), revealing which manipulation skill limits overall assembly success.",
      ],
    },
    {
      type: "comparison-table",
      heading: "FurnitureBench vs. Related Assembly Benchmarks",
      columns: ["Feature", "FurnitureBench", "IKEA Furniture (Lee)", "Factory (Isaac)", "RLBench Assembly"],
      rows: [
        {
          Feature: "Real hardware eval",
          FurnitureBench: "Yes (standardized kits)",
          "IKEA Furniture (Lee)": "Simulation only",
          "Factory (Isaac)": "Simulation only",
          "RLBench Assembly": "Simulation only",
        },
        {
          Feature: "Reproducible",
          FurnitureBench: "3D-printed STL files",
          "IKEA Furniture (Lee)": "N/A (sim only)",
          "Factory (Isaac)": "N/A (sim only)",
          "RLBench Assembly": "N/A (sim only)",
        },
        {
          Feature: "Force feedback",
          FurnitureBench: "6-axis F/T sensor",
          "IKEA Furniture (Lee)": "Simulated contact",
          "Factory (Isaac)": "Simulated contact",
          "RLBench Assembly": "Simulated contact",
        },
        {
          Feature: "Task complexity",
          FurnitureBench: "4-11 ordered steps",
          "IKEA Furniture (Lee)": "Multi-step assembly",
          "Factory (Isaac)": "Single insertion",
          "RLBench Assembly": "1-3 steps",
        },
      ],
    },
    {
      type: "prose",
      heading: "Bridging Simulation to Real Assembly",
      paragraphs: [
        "The insertion phase is where sim-to-real transfer fails most dramatically. Isaac Gym's penalty-based contact model treats surfaces as elastic boundaries, while real peg-in-hole insertion involves complex friction cones, chamfer contact guidance, and part compliance. A policy that learns to use brute force in simulation will either jam or damage parts on real hardware.",
        "Real insertion requires compliant control — applying force along the insertion axis while maintaining lateral compliance to accommodate alignment errors. The force profile during successful insertion is distinctive: a force spike when the peg contacts the hole, a drop as the chamfer guides alignment, and steady resistance during sliding insertion. Simulation models produce qualitatively different force profiles, meaning policies learn the wrong force expectations.",
        "Manufacturing variation in 3D-printed parts adds another layer. Two prints of the same leg will have slightly different dimensions, layer-line texture, and surface finish. A policy must be robust to these variations, which are absent from simulation where every part is geometrically perfect.",
        "Real-world assembly demonstrations with concurrent force/torque recording provide the training signal that bridges these gaps. By learning the actual force profiles of successful insertions and the adaptation strategies of human assemblers, policies can develop the compliant, force-aware control that FurnitureBench's real evaluation demands.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports FurnitureBench Users",
      paragraphs: [
        "Claru provides assembly manipulation data that complements FurnitureBench's simulation training environment. We can coordinate collection of furniture assembly demonstrations using the standardized 3D-printed kits across multiple locations, providing diverse approach strategies and environmental conditions that a single lab setup cannot offer.",
        "Our collection protocol captures synchronized video (multi-camera) and 6-axis force/torque data during all manipulation phases, with particular emphasis on the insertion steps where sim-to-real transfer fails. This force-annotated data enables training of compliant insertion controllers that respond to real contact dynamics.",
        "For teams extending beyond FurnitureBench's 3 tasks, Claru can collect assembly demonstrations with diverse real furniture components — IKEA flat-pack products, modular shelving systems, and other consumer assembly tasks — providing the breadth of assembly experience that transfers to the precision manipulation FurnitureBench evaluates.",
      ],
    },
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "heo-furniturebench-2023",
          title:
            "FurnitureBench: Reproducible Real-World Benchmark for Long-Horizon Complex Manipulation",
          authors: "Heo et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2305.12821",
        },
        {
          id: "lee-ikea-2021",
          title:
            "IKEA Furniture Assembly Environment for Long-Horizon Complex Manipulation Tasks",
          authors: "Lee et al.",
          venue: "ICRA 2021",
          year: 2021,
          url: "https://arxiv.org/abs/1911.07246",
        },
        {
          id: "chi-diffusion-policy-2023",
          title:
            "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
          authors: "Chi et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2303.04137",
        },
        {
          id: "zhao-aloha-2023",
          title:
            "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
          authors: "Zhao et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2304.13705",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "What makes FurnitureBench unique among manipulation benchmarks?",
      answer:
        "FurnitureBench provides standardized physical furniture kits (3D-printed from published STL files) that any lab can reproduce. This enables direct comparison of real-world results across institutions — something most benchmarks cannot offer because of hardware and object variability. It is one of very few benchmarks with reproducible real-world evaluation.",
    },
    {
      question: "Why is furniture assembly a good robot learning benchmark?",
      answer:
        "Assembly tests manipulation skills most benchmarks ignore: precision alignment under sub-millimeter tolerances, multi-step sequencing with strict ordering dependencies, and force-sensitive insertion. These skills are directly relevant to manufacturing robotics, and the long-horizon nature (up to 11 steps) exposes compounding errors that single-step benchmarks miss.",
    },
    {
      question: "How does force data improve assembly policy learning?",
      answer:
        "Insertion phases require compliant, force-sensitive control — detecting when a peg contacts the hole edge and adjusting approach angle and force vector. Simulation models contact with penalty-based methods that produce qualitatively wrong force profiles. Real force measurements during insertion provide the ground truth for learning compliant control strategies that avoid jamming or part damage.",
    },
    {
      question: "Why do per-step success rates matter so much for assembly?",
      answer:
        "Assembly steps must complete in order — step N requires steps 1 through N-1. Success rates multiply across steps. Even 90% per-step reliability yields only ~31% success on the 11-step lamp assembly. This compounding math means small improvements in per-step precision have outsized effects on full-task completion, making FurnitureBench a sensitive test of manipulation reliability.",
    },
    {
      question: "Can simulation training alone solve FurnitureBench?",
      answer:
        "Published results show significant sim-to-real drops, particularly on insertion steps. Simulation-only approaches achieve reasonable transport performance (moving parts to the workspace) but fail on precision insertion where contact dynamics, part compliance, and manufacturing variation are critical. Hybrid approaches combining simulation pre-training with real-world fine-tuning on force-annotated demonstrations perform best.",
    },
  ],
  ctaHeading: "Get Assembly Manipulation Data",
  ctaDescription:
    "Discuss real-world assembly and insertion data for FurnitureBench-style tasks with force/torque measurements.",
  relatedGlossaryTerms: [
    "contact-rich-manipulation",
    "manipulation-trajectory",
    "behavioral-cloning",
    "force-torque-sensing",
  ],
  relatedGuidePages: [
    "how-to-build-a-contact-rich-manipulation-dataset",
    "how-to-annotate-manipulation-trajectories",
  ],
  relatedSolutionSlugs: [],
};
export default page;
