import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "sim-to-real-gap",
  termSlug: "sim-to-real-gap",
  category: "robotics-fundamentals",
  metaTitle: "Sim-to-Real Gap in Robotics — Definition & Data | Claru",
  metaDescription: "The sim-to-real gap is the performance drop when transferring robot policies from simulation to physical hardware. Learn causes, mitigation strategies, and data requirements.",
  primaryKeyword: "sim to real gap",
  secondaryKeywords: ["sim2real transfer", "simulation to reality", "domain gap robotics", "sim-to-real transfer learning", "domain randomization"],
  canonicalPath: "/glossary/sim-to-real-gap",
  h1: "Sim-to-Real Gap: Why Simulated Robot Policies Fail on Real Hardware",
  heroSubtitle: "The sim-to-real gap is the performance degradation that occurs when a robot policy trained entirely in simulation is deployed on physical hardware. Differences in visual rendering, contact physics, sensor noise, and actuator dynamics between simulator and real world cause policies to encounter conditions they never saw during training, leading to failures that range from reduced accuracy to complete task breakdown.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Sim-to-Real Gap", href: "/glossary/sim-to-real-gap" },
  ],
  sections: [],
  faqs: [
    {
      question: "How much real-world data is needed to close the sim-to-real gap?",
      answer: "The amount depends on the magnitude of the domain gap and task complexity. For manipulation tasks with moderate visual complexity, fine-tuning a simulation-pretrained policy on 500-2,000 real-world demonstrations typically recovers 80-95% of simulation performance. Tasks involving deformable objects or complex contact physics may require 5,000+ real demonstrations because simulation approximates these interactions poorly. Some teams use as few as 50-100 real demonstrations when combined with extensive domain randomization during simulation training.",
    },
    {
      question: "What causes the sim-to-real gap?",
      answer: "Four main sources contribute: (1) Visual gap — simulated rendering lacks the full complexity of real-world textures, lighting, reflections, and shadows. (2) Physics gap — simulators use simplified contact models that cannot reproduce deformable objects, friction variation, or fluid dynamics accurately. (3) Sensor gap — real cameras have noise, motion blur, rolling shutter artifacts, and lens distortion absent in simulation. (4) Actuator gap — real motors have backlash, compliance, latency, and torque limits that differ from idealized simulated joints.",
    },
    {
      question: "Is domain randomization or real-world fine-tuning more effective?",
      answer: "They are complementary, not competing strategies. Domain randomization during simulation training makes the policy robust to visual and physics variations it will encounter in the real world. Real-world fine-tuning then adapts the policy to the specific characteristics of the target hardware and environment. The most successful approaches combine both: train with aggressive domain randomization in simulation, then fine-tune on 100-1,000 real demonstrations. Using only domain randomization leaves residual gaps; using only real data requires much larger datasets.",
    },
    {
      question: "Can photorealistic simulation eliminate the sim-to-real gap?",
      answer: "Photorealistic rendering (NVIDIA Isaac Sim, Unreal Engine) significantly reduces the visual gap but does not eliminate the overall sim-to-real gap. Physics simulation remains the harder problem — contact dynamics, deformable objects, and material properties are difficult to model accurately regardless of visual fidelity. Teams using photorealistic simulators still observe 20-40% performance drops on contact-rich tasks. The gap narrows for tasks that are primarily visual (e.g., object detection) but remains substantial for tasks requiring precise force control.",
    },
  ],
  ctaHeading: "Need Real-World Data to Close the Gap?",
  ctaDescription: "Claru provides diverse real-world robot demonstration data that bridges the sim-to-real gap for manipulation, navigation, and interaction tasks.",
  relatedGlossaryTerms: ["domain-randomization", "synthetic-data", "behavioral-cloning", "transfer-learning-robotics", "diffusion-policy"],
  relatedGuidePages: ["how-to-bridge-sim-to-real-gap", "how-to-evaluate-sim-to-real-transfer"],
  relatedSolutionSlugs: ["sim-to-real-data"],
  longDefinition: `The sim-to-real gap refers to the systematic performance degradation that occurs when a robot control policy, trained entirely in a simulated environment, is deployed on physical hardware in the real world. This gap exists because no simulator perfectly reproduces the visual appearance, physics, sensor characteristics, and actuator dynamics of the real world. A policy that achieves 95% success rate in simulation may achieve only 30-60% on the same task with a physical robot.

The gap manifests across multiple dimensions simultaneously. The visual domain gap arises because simulated renderers, even photorealistic ones, produce textures, lighting patterns, shadows, and reflections that differ from camera images of real scenes. The physics domain gap occurs because simulators use mathematical approximations of contact mechanics — rigid body solvers, penalty-based contact models, simplified friction cones — that diverge from the complex, often discontinuous physics of real-world interactions. Object deformation, granular materials, liquids, and compliant surfaces are particularly poorly modeled.

The sensor domain gap accounts for the noise, distortion, and timing characteristics of real sensors that simulated sensors lack. Real RGB cameras exhibit motion blur, rolling shutter artifacts, auto-exposure fluctuations, and lens distortion. Real depth sensors have systematic biases near edges, missing data on reflective surfaces, and noise patterns that depend on distance and material. The actuator domain gap covers the differences between idealized simulated joints and real motors with backlash, compliance, torque limits, communication latency, and thermal effects.

Understanding the sim-to-real gap is essential for any team that uses simulation as part of their robot learning pipeline. The gap determines how much real-world data is needed to achieve production-level performance, which simulation parameters to randomize during training, and what data collection protocols to implement for real-world fine-tuning.`,

  historicalContext: `The sim-to-real gap was first systematically studied in the robotics community in the late 2000s as researchers began attempting to transfer learned controllers from physics engines to physical robots. Early work by Koos et al. (2010) on the "transferability approach" explicitly modeled the reality gap and proposed using a small number of real-world evaluations to select simulation-trained policies most likely to transfer.

The modern era of sim-to-real transfer began with two influential papers in 2017. Tobin et al. introduced domain randomization for object detection, showing that training on simulated images with randomized textures, lighting, and camera parameters could transfer directly to real-world perception without any real training data. Simultaneously, Peng et al. demonstrated sim-to-real transfer for locomotion policies by randomizing physics parameters (mass, friction, motor strength) during simulation training.

OpenAI's work on in-hand manipulation (2018-2019) brought sim-to-real to mainstream attention. They trained a policy in simulation to manipulate a Rubik's cube with a dexterous Shadow Hand, using massive domain randomization across 7,000 environments in parallel. The policy transferred to the physical hand, though with lower success rates than in simulation — a vivid demonstration of both the promise and limitations of sim-to-real transfer.

Since 2020, the field has shifted toward hybrid approaches that combine simulation pretraining with real-world fine-tuning. Google's BC-Z (2021) and RT-1 (2022) demonstrated that large-scale real-world data collection could bypass the sim-to-real gap entirely for certain tasks. Meanwhile, NVIDIA's Isaac Gym and Isaac Sim have pushed simulation fidelity to the point where the visual gap has narrowed substantially, though the physics gap remains significant. The current consensus is that simulation is a valuable pretraining tool but cannot fully replace real-world data for tasks involving complex contact physics.`,

  practicalImplications: `For teams building robot systems that use simulation as part of the training pipeline, the sim-to-real gap has direct implications for project planning, data budgets, and system architecture.

The first practical decision is which simulation platform to use. MuJoCo excels at contact-rich manipulation with fast simulation speeds, making it ideal for training policies that will be fine-tuned with real data. NVIDIA Isaac Sim offers photorealistic rendering and GPU-accelerated physics, reducing the visual gap but requiring more compute. PyBullet and Drake serve as lightweight alternatives for rapid prototyping. The choice of simulator determines the baseline gap magnitude and therefore the amount of real data needed.

Domain randomization parameters must be tuned carefully. Over-randomization produces policies that are robust but imprecise — a policy trained with extreme lighting variation may work in any lighting condition but never as well as a policy adapted to a specific environment. Under-randomization produces brittle policies that fail with any environmental change. The standard practice is to randomize visual parameters (textures, lighting, camera position) aggressively while randomizing physics parameters (mass, friction, damping) conservatively around measured values from the real system.

The amount of real-world data needed for fine-tuning depends on the task. For primarily visual tasks (object detection, pose estimation), 50-200 real images may suffice to close the visual gap. For manipulation tasks with simple contact (pick and place), 500-2,000 real demonstrations are typical. For contact-rich tasks (insertion, assembly, tool use), 2,000-10,000 real demonstrations may be needed because the physics gap dominates and cannot be bridged by visual adaptation alone.

The most effective sim-to-real pipeline in 2025-2026 follows a three-phase pattern: (1) pretrain in simulation with domain randomization across thousands of task variations, (2) collect a targeted real-world dataset on the deployment hardware and environment, (3) fine-tune the simulation-pretrained policy on real data. This approach typically requires 3-5x less real data than training from scratch while achieving comparable or better performance.`,

  commonMisconceptions: [
    {
      misconception: "Better rendering and more compute will eventually eliminate the sim-to-real gap.",
      correction: "Improving visual fidelity addresses only the visual component of the gap. Physics simulation is fundamentally limited by the computational cost of modeling contact at the resolution of real-world interactions. Deformable objects, granular materials, and thin compliant surfaces remain challenging regardless of compute budget. NVIDIA Isaac Sim with RTX rendering still shows 20-40% performance drops on contact-rich tasks. The gap is a multidimensional problem, not a single parameter to optimize.",
    },
    {
      misconception: "If a policy works in simulation with domain randomization, it will work in the real world.",
      correction: "Domain randomization makes policies more robust but does not guarantee transfer. The randomization ranges must encompass real-world conditions, which requires knowing what real conditions look like — creating a circular dependency. In practice, policies trained with even aggressive domain randomization typically see 15-30% success rate drops in the real world. Real-world validation and fine-tuning remain essential steps.",
    },
    {
      misconception: "The sim-to-real gap is only a problem for vision-based policies; state-based policies transfer directly.",
      correction: "State-based policies (using joint angles and end-effector poses rather than camera images) have a smaller visual gap but still face physics and actuator gaps. Real motors have latency, backlash, and compliance not captured in simulation. Real objects have friction and mass distributions that differ from simulated values. State-based locomotion policies from simulation regularly require real-world adaptation to achieve stable walking on physical robots.",
    },
  ],
  keyPapers: [
    {
      id: "tobin-domain-randomization-2017",
      title: "Domain Randomization for Transferring Deep Neural Networks from Simulation to the Real World",
      authors: "Tobin et al.",
      venue: "IROS 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1703.06907",
    },
    {
      id: "openai-rubiks-2019",
      title: "Solving Rubik's Cube with a Robot Hand",
      authors: "Akkaya et al.",
      venue: "arXiv 1910.07113",
      year: 2019,
      url: "https://arxiv.org/abs/1910.07113",
    },
    {
      id: "peng-sim-to-real-2018",
      title: "Sim-to-Real Transfer of Robotic Control with Dynamics Randomization",
      authors: "Peng et al.",
      venue: "ICRA 2018",
      year: 2018,
      url: "https://arxiv.org/abs/1710.06537",
    },
    {
      id: "zhao-sim-to-real-survey-2020",
      title: "Sim-to-Real Transfer in Deep Reinforcement Learning for Robotics: A Survey",
      authors: "Zhao et al.",
      venue: "arXiv 2009.13303",
      year: 2020,
      url: "https://arxiv.org/abs/2009.13303",
    },
  ],
  claruRelevance: `Claru provides the real-world data that bridges the sim-to-real gap. Teams that pretrain policies in simulation need diverse, high-quality real-world demonstrations for fine-tuning — exactly what Claru delivers. Our datasets of 386,000+ annotated clips capture the visual complexity, physical variability, and sensor characteristics of real environments that simulators cannot reproduce.

For sim-to-real fine-tuning specifically, Claru offers targeted data collection on client hardware and in client environments. We deploy skilled teleoperators who collect demonstrations on the actual robot platform that will be used in production, in the actual deployment setting, ensuring the fine-tuning data matches the deployment distribution. This targeted approach minimizes the fine-tuning data budget while maximizing transfer performance.`,
};

export default data;
