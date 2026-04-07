import type { BenchmarkPageData } from "./types";

const page: BenchmarkPageData = {
  slug: "maniskill",
  benchmarkName: "ManiSkill",
  benchmarkDescription:
    "ManiSkill is a GPU-parallelized simulation benchmark from the SAPIEN team at UC San Diego. Now in its third iteration (ManiSkill3, 2024), it provides high-fidelity object manipulation tasks using the SAPIEN physics engine with photorealistic ray-traced rendering, supporting single-arm, dual-arm, mobile manipulation, and humanoid evaluation. ManiSkill can run thousands of parallel environments on a single GPU, making it a standard for high-throughput policy training and evaluation in manipulation research.",
  taskSet:
    "Over 20 manipulation tasks across four categories: rigid body (pick-and-place, peg insertion, stacking), articulated objects (door opening, drawer manipulation, cabinet interaction using PartNet-Mobility meshes), soft body (cloth folding, rope manipulation in ManiSkill2), and assembly (gear insertion, plug insertion). ManiSkill3 adds mobile manipulation and humanoid tasks, significantly expanding the embodiment diversity.",
  observationSpace:
    "RGB-D images from configurable camera arrays (up to 4 cameras with 128x128 to 512x512 resolution), dense point clouds, full proprioceptive state (joint positions, velocities, gripper aperture), and privileged simulation state for oracle baselines. ManiSkill3 adds ray-traced rendering with realistic reflections and shadows.",
  actionSpace:
    "Joint position targets or end-effector delta poses (6-DOF + gripper) supporting Franka Panda, xArm, and mobile manipulation platforms. ManiSkill3 adds whole-body control for humanoid robots and dual-arm configurations. Control frequency is configurable, typically 20 Hz.",
  evaluationProtocol:
    "Success rate over 100+ evaluation episodes with randomized object poses and configurations. GPU-parallelized evaluation enables benchmarking thousands of policy rollouts in minutes rather than hours. ManiSkill3 introduces partial success metrics for long-horizon tasks, measuring sub-goal completion when the full task is not achieved.",
  simToRealGap:
    "SAPIEN provides better contact modeling than PyBullet but still simplifies deformable contacts, surface textures, and material properties. Object meshes from PartNet-Mobility provide geometric fidelity but lack authentic friction coefficients, mass distributions, and surface compliance. ManiSkill3's ray-traced rendering improves visual transfer but cannot capture real sensor noise, motion blur, auto-exposure, or lens distortion present in real camera data.",
  realWorldDataNeeds:
    "Real-world manipulation with the same object categories as ManiSkill — articulated objects (doors, drawers, cabinets), assembly tasks (peg insertion, gear meshing), and pick-and-place with diverse rigid objects. Critical gaps include authentic material friction profiles, real sensor noise characteristics, object state estimation under occlusion, and the mechanical variation of real articulated objects (each real door hinge is unique).",
  complementaryDatasets: [
    {
      name: "Manipulation Trajectory Dataset",
      rationale:
        "Real-world recordings of articulated object manipulation provide authentic contact dynamics that SAPIEN physics approximates but cannot perfectly model — real friction profiles, hinge resistance, and surface deformation.",
    },
    {
      name: "Egocentric Activity Dataset",
      rationale:
        "Human demonstrations of object interactions across 100+ environments provide visual pretraining data with real-world textures, lighting variation, and object appearances that complement ManiSkill3's ray-traced rendering.",
    },
    {
      name: "Custom Articulated Object Collection",
      rationale:
        "Purpose-collected data with real doors, drawers, and cabinets captures the mechanical variation — different hinge types, slide mechanisms, spring tensions — that simulation parametrizes but each real instance instantiates uniquely.",
    },
  ],
  keyPapers: [
    {
      id: "mu-maniskill-2021",
      title:
        "ManiSkill: Generalizable Manipulation Skill Benchmark with Large-Scale Demonstrations",
      authors: "Mu et al.",
      venue: "NeurIPS 2021 Datasets Track",
      year: 2021,
      url: "https://arxiv.org/abs/2107.14483",
    },
    {
      id: "gu-maniskill2-2023",
      title:
        "ManiSkill2: A Unified Benchmark for Generalizable Manipulation Skills",
      authors: "Gu et al.",
      venue: "ICLR 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2302.04659",
    },
    {
      id: "tao-maniskill3-2024",
      title:
        "ManiSkill3: GPU Parallelized Robotics Simulation and Benchmark",
      authors: "Tao et al.",
      venue: "arXiv 2410.00425",
      year: 2024,
      url: "https://arxiv.org/abs/2410.00425",
    },
    {
      id: "xiang-sapien-2020",
      title:
        "SAPIEN: A SimulAted Part-based Interactive ENvironment",
      authors: "Xiang et al.",
      venue: "CVPR 2020",
      year: 2020,
      url: "https://arxiv.org/abs/2003.08515",
    },
    {
      id: "mo-partnet-2019",
      title:
        "PartNet: A Large-Scale Benchmark for Fine-Grained and Hierarchical Part-Level 3D Object Understanding",
      authors: "Mo et al.",
      venue: "CVPR 2019",
      year: 2019,
      url: "https://arxiv.org/abs/1812.02713",
    },
  ],
  technicalAnalysis:
    "ManiSkill represents the state-of-the-art in GPU-parallelized manipulation benchmarks. ManiSkill3 can run 4,096+ parallel environments on a single RTX 4090, completing a full training run in hours rather than days. This throughput advantage makes it a preferred platform for reinforcement learning research, but physics simplifications create transfer gaps that scale with task contact complexity.\n\nThe articulated object category is particularly challenging for sim-to-real. Real doors have complex hinge dynamics with friction that varies over the range of motion — many hinges are stiffer at the extremes due to weatherstripping or magnetic catches. Real drawers have slides with stick-slip behavior that depends on loading. Real cabinets have damped hinges with nonlinear resistance profiles. ManiSkill parametrizes these properties with SAPIEN's articulated body model, but each real instance has a unique friction curve that no parametric model can capture a priori.\n\nThe PartNet-Mobility object meshes provide geometric fidelity unmatched by procedurally generated shapes. However, scanned geometry without material properties leaves a critical gap — friction coefficients, surface compliance, mass distribution, and center of gravity must be estimated or hand-tuned in simulation. A policy that learns to exploit simulation's default friction may apply forces that slip on real surfaces.\n\nManiSkill3's ray-traced rendering represents a significant visual upgrade over ManiSkill2's rasterized rendering, producing realistic reflections, soft shadows, and global illumination. This narrows the visual sim-to-real gap but does not eliminate it. Real cameras have auto-exposure, rolling shutter, motion blur, and chromatic aberration that ray-tracing does not model. Real environments have dust, fingerprints on surfaces, and specular reflections from unexpected light sources.\n\nReal-world data collected on the same object categories provides the ground truth that calibrates simulation parameters and validates transfer. By recording manipulation of real doors, drawers, and cabinets with force sensors and multi-camera systems, researchers can measure actual friction profiles, spring constants, and mechanical properties that ManiSkill must simulate accurately for reliable transfer.",
  metaTitle:
    "Real-World Data for ManiSkill Manipulation Benchmark | Claru",
  metaDescription:
    "Authentic manipulation data for ManiSkill's articulated object, assembly, and pick-and-place tasks to bridge the GPU-simulation-to-real-world gap.",
  primaryKeyword: "ManiSkill real-world data",
  secondaryKeywords: [
    "ManiSkill sim-to-real",
    "SAPIEN manipulation data",
    "GPU simulation robot data",
    "articulated object manipulation data",
    "ManiSkill3 benchmark",
  ],
  canonicalPath: "/benchmarks/maniskill",
  h1: "Real-World Data for ManiSkill",
  heroSubtitle:
    "ManiSkill enables GPU-parallelized manipulation training at 4,096+ environments per GPU. Real-world data ensures those simulated policies transfer to physical hardware.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Benchmarks", href: "/benchmarks" },
    { label: "ManiSkill", href: "/benchmarks/maniskill" },
  ],
  sections: [
    {
      type: "stats",
      heading: "ManiSkill at a Glance",
      stats: [
        { value: "20+", label: "Tasks" },
        { value: "4,096+", label: "Parallel Envs/GPU" },
        { value: "SAPIEN", label: "Physics Engine" },
        { value: "Ray-traced", label: "Rendering (v3)" },
        { value: "5+", label: "Robot Platforms" },
        { value: "2021", label: "First Release" },
      ],
    },
    {
      type: "prose",
      heading: "What Is ManiSkill?",
      paragraphs: [
        "ManiSkill is a GPU-parallelized simulation benchmark and learning environment built on the SAPIEN physics engine, developed by the SAPIEN team at UC San Diego. First released in 2021, it has evolved through three major versions — ManiSkill (NeurIPS 2021), ManiSkill2 (ICLR 2023), and ManiSkill3 (2024) — each expanding task diversity, embodiment support, and simulation throughput.",
        "ManiSkill's defining feature is massive GPU parallelization. ManiSkill3 can simulate over 4,096 manipulation environments simultaneously on a single consumer GPU, reducing training time from days to hours. This throughput enables reinforcement learning methods that require millions of environment interactions to converge, making ManiSkill a preferred platform for RL-based manipulation research.",
        "The benchmark uses real object meshes from the PartNet-Mobility dataset, providing geometrically accurate articulated objects (doors, drawers, cabinets, faucets) rather than procedurally generated primitives. ManiSkill3 further improves visual fidelity with ray-traced rendering that produces realistic reflections, shadows, and global illumination, narrowing the visual gap between simulation and reality.",
        "ManiSkill supports multiple robot platforms (Franka Panda, xArm, mobile manipulators, humanoids) and multiple observation modalities (RGB-D, point clouds, proprioception), making it a versatile platform for studying cross-embodiment transfer and multi-modal policy learning.",
      ],
    },
    {
      type: "comparison-table",
      heading: "ManiSkill Task Suite",
      description:
        "ManiSkill's tasks span rigid body manipulation, articulated object interaction, soft body deformation, and assembly, each presenting different sim-to-real transfer challenges.",
      columns: ["Task Category", "Example Tasks", "Key Transfer Challenge", "Object Source"],
      rows: [
        {
          "Task Category": "Rigid Body",
          "Example Tasks": "Pick-and-place, stacking, peg insertion",
          "Key Transfer Challenge": "Grasp stability, friction, object mass",
          "Object Source": "YCB objects, procedural",
        },
        {
          "Task Category": "Articulated Objects",
          "Example Tasks": "Open door, open drawer, turn faucet",
          "Key Transfer Challenge": "Hinge friction, mechanism resistance, backlash",
          "Object Source": "PartNet-Mobility",
        },
        {
          "Task Category": "Soft Body",
          "Example Tasks": "Cloth folding, rope manipulation",
          "Key Transfer Challenge": "Deformable material simulation fidelity",
          "Object Source": "Procedural",
        },
        {
          "Task Category": "Assembly",
          "Example Tasks": "Gear insertion, plug socket",
          "Key Transfer Challenge": "Tight tolerance, contact-rich insertion",
          "Object Source": "CAD models",
        },
        {
          "Task Category": "Mobile Manipulation",
          "Example Tasks": "Navigate-and-pick, open cabinet while mobile",
          "Key Transfer Challenge": "Base-arm coordination, navigation errors",
          "Object Source": "PartNet-Mobility + scenes",
        },
      ],
    },
    {
      type: "prose",
      heading: "Evaluation Protocol",
      paragraphs: [
        "ManiSkill evaluates policies using success rate over 100 or more episodes with randomized initial conditions — object poses, robot starting configurations, and (for articulated objects) mechanism states. GPU parallelization enables running all evaluation episodes simultaneously, producing results in seconds rather than the hours required by serial evaluation.",
        "ManiSkill2 introduced generalization evaluation: training on a set of object instances (e.g., 20 different cabinet models from PartNet-Mobility) and evaluating on held-out instances. This tests whether policies learn generalizable manipulation strategies or overfit to specific object geometries. The generalization gap — performance on seen versus unseen objects — is a primary metric for articulated object tasks.",
        "ManiSkill3 adds partial success metrics for long-horizon tasks. Instead of binary success/failure, the benchmark measures sub-goal completion — a policy that opens a door halfway gets partial credit. This finer-grained evaluation better distinguishes policies that are close to solving a task from those that fail completely, and provides more signal for comparing sim-to-real transfer quality.",
        "The benchmark also tracks sample efficiency: how many environment steps a policy needs to reach a target success rate. GPU parallelization changes the sample efficiency landscape by making wall-clock time proportional to number of gradient steps rather than number of environment steps, favoring architectures that can leverage parallel data collection.",
      ],
    },
    {
      type: "comparison-table",
      heading: "ManiSkill vs. Related Benchmarks",
      description:
        "How ManiSkill compares to other manipulation simulation benchmarks on key dimensions.",
      columns: ["Feature", "ManiSkill 3", "RLBench", "robosuite", "LIBERO"],
      rows: [
        {
          Feature: "Physics Engine",
          "ManiSkill 3": "SAPIEN (GPU)",
          RLBench: "CoppeliaSim",
          robosuite: "MuJoCo",
          LIBERO: "MuJoCo (robosuite)",
        },
        {
          Feature: "GPU Parallelization",
          "ManiSkill 3": "4,096+ envs/GPU",
          RLBench: "No",
          robosuite: "No",
          LIBERO: "No",
        },
        {
          Feature: "Rendering",
          "ManiSkill 3": "Ray-traced",
          RLBench: "Rasterized",
          robosuite: "Rasterized",
          LIBERO: "Rasterized",
        },
        {
          Feature: "Object Meshes",
          "ManiSkill 3": "PartNet-Mobility scans",
          RLBench: "Procedural",
          robosuite: "Procedural",
          LIBERO: "Procedural",
        },
        {
          Feature: "Embodiment Diversity",
          "ManiSkill 3": "Panda, xArm, mobile, humanoid",
          RLBench: "Panda only",
          robosuite: "Panda, Sawyer, UR5e, IIWA, Jaco",
          LIBERO: "Panda only",
        },
        {
          Feature: "Task Count",
          "ManiSkill 3": "20+",
          RLBench: "100",
          robosuite: "8",
          LIBERO: "130",
        },
      ],
    },
    {
      type: "prose",
      heading: "Bridging GPU Simulation to Real Hardware",
      paragraphs: [
        "ManiSkill's GPU parallelization is a training advantage, not a transfer advantage. Running 4,096 simulated environments does not improve the physics fidelity of any single environment. A policy may converge faster in ManiSkill3 than in a serial simulator, but if it converges to behaviors that exploit SAPIEN's simplified contact model, the speed amplifies the problem rather than solving it.",
        "The articulated object sim-to-real gap is particularly pronounced. SAPIEN models articulated joints with parametric friction and damping coefficients, but real hinges exhibit stick-slip friction, wear patterns, and temperature-dependent resistance that no parametric model captures fully. A door-opening policy trained in ManiSkill may apply constant force where a real door requires a force spike to overcome a magnetic catch, then smooth control through the swing range.",
        "ManiSkill3's ray-traced rendering narrows the visual gap significantly — real-looking shadows, reflections, and ambient occlusion reduce the need for domain randomization in visual processing. However, real cameras produce noisy, auto-exposed, motion-blurred images that ray-tracing does not replicate. Policies that rely on clean pixel-perfect observations may degrade when confronted with real sensor artifacts.",
        "Real-world data addresses these gaps at the source. Manipulation recordings on real articulated objects capture the full complexity of mechanical interaction — friction curves, compliance profiles, and mechanism idiosyncrasies that cannot be parametrized. Combined with ManiSkill's high-throughput simulation for exploration and pre-training, small amounts of real-world fine-tuning data can bridge the remaining transfer gap efficiently.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports ManiSkill Users",
      paragraphs: [
        "Claru provides the real-world manipulation data that complements ManiSkill's simulated training. Our data collection covers the same object categories — articulated cabinets, drawers, doors, and rigid objects for pick-and-place — on real hardware with force sensors and multi-camera systems that capture the contact dynamics SAPIEN approximates.",
        "For teams using ManiSkill's PartNet-Mobility objects, Claru can coordinate collection with the real-world counterparts of specific simulated objects — matching the geometric category so that sim-to-real comparison is direct. Real door manipulation data with force measurements provides the ground truth for calibrating SAPIEN's joint friction parameters.",
        "Our egocentric activity dataset provides large-scale visual pretraining data that complements ManiSkill3's ray-traced rendering. While ray-tracing produces clean photorealistic images, real-world video captures the visual diversity — varying lighting, surface wear, specular reflections, motion blur — that makes vision encoders robust to deployment conditions.",
      ],
    },
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "mu-maniskill-2021",
          title:
            "ManiSkill: Generalizable Manipulation Skill Benchmark with Large-Scale Demonstrations",
          authors: "Mu et al.",
          venue: "NeurIPS 2021 Datasets Track",
          year: 2021,
          url: "https://arxiv.org/abs/2107.14483",
        },
        {
          id: "gu-maniskill2-2023",
          title:
            "ManiSkill2: A Unified Benchmark for Generalizable Manipulation Skills",
          authors: "Gu et al.",
          venue: "ICLR 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2302.04659",
        },
        {
          id: "tao-maniskill3-2024",
          title:
            "ManiSkill3: GPU Parallelized Robotics Simulation and Benchmark",
          authors: "Tao et al.",
          venue: "arXiv 2410.00425",
          year: 2024,
          url: "https://arxiv.org/abs/2410.00425",
        },
        {
          id: "xiang-sapien-2020",
          title:
            "SAPIEN: A SimulAted Part-based Interactive ENvironment",
          authors: "Xiang et al.",
          venue: "CVPR 2020",
          year: 2020,
          url: "https://arxiv.org/abs/2003.08515",
        },
        {
          id: "mo-partnet-2019",
          title:
            "PartNet: A Large-Scale Benchmark for Fine-Grained and Hierarchical Part-Level 3D Object Understanding",
          authors: "Mo et al.",
          venue: "CVPR 2019",
          year: 2019,
          url: "https://arxiv.org/abs/1812.02713",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "What makes ManiSkill different from other manipulation benchmarks?",
      answer:
        "ManiSkill's key differentiator is GPU-parallelized simulation — over 4,096 environments running simultaneously on one GPU, reducing training from days to hours. It also uses real object meshes from PartNet-Mobility rather than procedural shapes, and ManiSkill3 adds ray-traced rendering for improved visual fidelity. This combination of throughput, geometric accuracy, and visual quality makes it the preferred platform for high-sample-efficiency manipulation research.",
    },
    {
      question: "Why do GPU-simulated policies still need real-world validation?",
      answer:
        "GPU parallelization speeds up training but does not improve physics fidelity. Contact dynamics, material properties, and sensor characteristics are still simplified in each parallel environment. Policies may converge faster to behaviors that exploit simulation artifacts — simplified friction, perfect state observation, deterministic contacts — rather than learning the robust manipulation strategies needed for real hardware.",
    },
    {
      question: "How does real articulated object data complement ManiSkill?",
      answer:
        "Real doors, drawers, and cabinets each have unique mechanical properties — hinge friction curves, magnetic catches, weight-dependent slide resistance — that ManiSkill parametrizes with fixed coefficients. Real-world force measurements during manipulation provide ground truth for calibrating simulation parameters and for fine-tuning policies that must handle the mechanical variation of deployed environments.",
    },
    {
      question: "What changed between ManiSkill2 and ManiSkill3?",
      answer:
        "ManiSkill3 introduced ray-traced rendering for photorealistic visuals, expanded embodiment support to include humanoids and mobile manipulators, added partial success metrics for long-horizon tasks, and significantly improved GPU parallelization throughput. It also restructured the task API to support custom task creation, making the benchmark extensible to new manipulation domains.",
    },
    {
      question: "Does ManiSkill's PartNet-Mobility integration solve the object diversity problem?",
      answer:
        "Partially. PartNet-Mobility provides hundreds of geometrically diverse articulated objects scanned from real products, which is far better than procedural primitives for generalization research. However, the scans capture geometry without material properties — friction, mass distribution, surface compliance, and mechanism resistance must still be estimated or hand-tuned. Real-world data provides the material property ground truth that geometry scans lack.",
    },
  ],
  ctaHeading: "Get Real-World Articulated Object Data",
  ctaDescription:
    "Discuss purpose-collected manipulation data for ManiSkill's articulated object and assembly task categories on real hardware.",
  relatedGlossaryTerms: [
    "sim-to-real-gap",
    "manipulation-trajectory",
    "point-cloud",
    "depth-data",
    "gpu-simulation",
  ],
  relatedGuidePages: [
    "how-to-bridge-sim-to-real-gap",
    "how-to-build-a-manipulation-dataset",
  ],
  relatedSolutionSlugs: [],
};
export default page;
