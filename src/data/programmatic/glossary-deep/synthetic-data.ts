import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "synthetic-data",
  termSlug: "synthetic-data",
  category: "data-modalities",
  metaTitle: "Synthetic Data for Robotics — Sim-to-Real, Domain Randomization & Limits | Claru",
  metaDescription:
    "Synthetic data is generated in simulation to train robot learning models. Learn about domain randomization, sim-to-real transfer, where synthetic data works, and where real data remains essential.",
  primaryKeyword: "synthetic data robotics",
  secondaryKeywords: [
    "simulation data robot learning",
    "sim-to-real transfer data",
    "domain randomization",
    "synthetic training data",
    "robot simulation data",
    "simulated robot demonstrations",
  ],
  canonicalPath: "/glossary/synthetic-data",
  h1: "Synthetic Data for Robotics: Simulation, Domain Randomization, and Real-World Limits",
  heroSubtitle:
    "Synthetic data generated in simulation can scale robot training datasets to millions of episodes at near-zero marginal cost. But the sim-to-real gap means simulation cannot fully replace real-world demonstrations — the most successful robot learning systems combine both. This page covers how synthetic data is generated, where it helps most, and what it cannot replace.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Synthetic Data", href: "/glossary/synthetic-data" },
  ],
  sections: [],
  faqs: [
    {
      question: "What percentage of a robot training dataset should be synthetic vs real?",
      answer:
        "The optimal mix depends on the task. For locomotion and navigation, synthetic data can constitute 80-90% of the training set because terrain and obstacle physics are well-modeled in modern simulators. For manipulation involving deformable objects, liquids, or soft contacts, real data should dominate (60-80%) because these physics are poorly approximated in simulation. The Octo model used approximately 25% simulated data from RoboCasa alongside real demonstrations and showed consistent improvement from the synthetic augmentation. A practical rule: start with 100% real data, then add synthetic data incrementally while measuring real-world success rate — stop when improvement plateaus.",
    },
    {
      question: "How does domain randomization improve sim-to-real transfer?",
      answer:
        "Domain randomization varies visual and physical parameters in simulation (textures, lighting, camera positions, object masses, friction coefficients) to produce a distribution of environments so broad that the real world falls within it as just another sample. Tobin et al. (2017) showed that a policy trained on randomized simulated images could transfer to real robots for grasping without any real-world fine-tuning. The key parameters to randomize: lighting direction and intensity (3-5 point lights), texture colors and patterns (applied to all surfaces), camera intrinsics (FOV plus or minus 5 degrees), object mass (plus or minus 30%), and friction (plus or minus 50%). Under-randomization causes the policy to overfit to simulation; over-randomization degrades performance by making the task artificially harder than reality.",
    },
    {
      question: "What are the main simulators used for generating robotics training data?",
      answer:
        "MuJoCo (DeepMind) is the most widely used physics engine for manipulation research — fast, accurate contact dynamics, and free since 2022. Isaac Sim (NVIDIA) provides GPU-accelerated parallel simulation at 10,000+ environments simultaneously, making it the tool of choice for large-scale RL. PyBullet is lightweight and easy to set up but has less accurate contact physics. SAPIEN supports articulated objects (drawers, cabinets) and is used by ManiSkill benchmarks. Drake (MIT/Toyota) provides the most accurate rigid-body and hydroelastic contact models. Habitat (Meta) and AI2-THOR (Allen Institute) focus on indoor navigation and scene-level tasks.",
    },
    {
      question: "Can synthetic data replace teleoperation for collecting robot demonstrations?",
      answer:
        "For behavior cloning and VLA training, not yet. Simulated demonstrations require a scripted or RL policy to generate actions, which means you need a working policy before you can generate training data (a chicken-and-egg problem). Teleoperation bypasses this entirely because the human provides the intelligence. Where synthetic data excels is augmenting real demonstrations: you can train a BC policy on 500 real demonstrations, then use that policy to generate 5,000 rollouts in simulation with domain randomization, collecting only the successful trajectories. This semi-synthetic approach was used in the RT-1 training pipeline.",
    },
    {
      question: "What is the sim-to-real gap and how do you measure it?",
      answer:
        "The sim-to-real gap is the performance drop when a policy trained in simulation is deployed on real hardware without fine-tuning. It is measured as the delta in task success rate: sim-to-real gap = success_rate_sim minus success_rate_real. For well-tuned domain randomization on grasping tasks, the gap is typically 10-20 percentage points (e.g., 95% sim to 75-85% real). For contact-rich manipulation, the gap can exceed 40 percentage points due to inaccurate contact physics. For locomotion on rigid terrain, the gap is often less than 5% because rigid-body dynamics are well-modeled.",
    },
  ],
  ctaHeading: "Need Real-World Data to Complement Your Simulation?",
  ctaDescription:
    "Claru provides the real-world demonstration data that bridges the sim-to-real gap. Our teleoperation datasets capture the contact physics, material interactions, and environmental diversity that simulation cannot replicate.",
  relatedGlossaryTerms: [
    "sim-to-real-gap",
    "domain-randomization",
    "behavioral-cloning",
    "depth-data",
    "transfer-learning-robotics",
  ],
  relatedGuidePages: [
    "how-to-bridge-sim-to-real-gap",
    "how-to-setup-domain-randomization-pipeline",
  ],
  relatedSolutionSlugs: ["manipulation-trajectory-data"],

  longDefinition: `Synthetic data for robotics refers to training data generated procedurally in physics simulation rather than collected from real robots in real environments. A simulator renders camera images, computes object poses and contact forces, and records the state-action trajectories of scripted or learned policies as they perform tasks in virtual environments. This data can then be used to train robot perception models, visuomotor policies, or reinforcement learning agents.

The fundamental appeal of synthetic data is economics. Collecting one hour of real-world teleoperation data costs $50-200 in operator time and requires physical hardware. Generating one hour of simulated data costs fractions of a cent in cloud compute. NVIDIA's Isaac Gym can simulate 10,000+ robot environments in parallel on a single GPU, producing millions of transitions per minute. This four-to-five order-of-magnitude cost reduction makes it possible to explore training strategies that would be prohibitively expensive with real data alone.

Synthetic data generation involves three key components: (1) a physics engine that simulates rigid-body dynamics, contact forces, and optionally soft-body/fluid physics, (2) a rendering engine that produces realistic camera images with proper lighting, materials, and sensor noise, and (3) a task specification that defines objects, their initial configurations, success conditions, and optionally a scripted or RL policy to generate diverse demonstrations. The fidelity of each component determines how well the synthetic data transfers to real-world deployment.

The critical limitation is the sim-to-real gap. No simulator perfectly models reality. Contact physics — the forces that arise when a robot touches objects — are approximated using simplified models (point contacts, penalty methods, compliant contacts) that diverge from real physics, especially for soft materials, liquids, granular media, and tight-tolerance assemblies. Visual appearance differs due to simplified material models, lighting approximations, and the absence of real-world clutter and wear. These discrepancies cause policies trained purely on synthetic data to underperform when deployed on real hardware, sometimes catastrophically.`,

  historicalContext: `The use of simulation for robot learning dates to the earliest days of the field. The Dyna architecture (Sutton, 1991) proposed using a learned model of the environment as a simulator to generate additional training data for reinforcement learning — an early form of synthetic data augmentation. However, practical robotics simulation remained limited by the computational cost and physical accuracy of available simulators through the 2000s.

The watershed moment came in 2017-2018 with two parallel developments. First, Tobin et al. (2017) at OpenAI demonstrated domain randomization — training a grasping policy on simulated images with wildly randomized visual parameters (textures, colors, lighting, camera poses) so that the resulting policy was robust to any visual environment, including reality. This showed that the sim-to-real gap could be addressed without making the simulator more realistic, but rather by making it more diverse. Second, Isaac Gym (Makoviychuk et al., 2021) enabled GPU-accelerated parallel simulation at unprecedented scale, making it possible to train RL policies on billions of simulated transitions in hours rather than weeks.

These developments triggered an explosion of sim-to-real transfer work. Akkaya et al. (2019) at OpenAI trained a dexterous hand to solve a Rubik's cube using automatic domain randomization in simulation with zero real-world data — one of the most impressive sim-to-real demonstrations to date, though it required 13,000 years of simulated experience. More recently, large-scale robot learning projects have adopted a hybrid approach. The Octo model (Team et al., 2024) includes simulated data from RoboCasa alongside real demonstrations. The consensus has shifted from "can simulation replace real data?" to "what is the optimal simulation-to-real data ratio for each task domain?"`,

  practicalImplications: `For teams building robot learning systems, the practical question is not whether to use synthetic data but how to integrate it effectively alongside real data. The key principles:

First, use simulation for perception and coarse policy pretraining, then fine-tune on real data. A vision model pretrained on millions of simulated images with domain randomization learns features that transfer well to real cameras. A manipulation policy pretrained in simulation learns the gross structure of reach-grasp-place motions. Fine-tuning on 100-500 real demonstrations then adapts the policy to the specific contact dynamics and visual appearance of the target environment. This pretraining plus fine-tuning recipe consistently outperforms training on either data source alone.

Second, invest in visual realism for perception tasks, and physical realism for contact-rich manipulation. For object detection and pose estimation, modern renderers (Blender, NVIDIA Omniverse) can produce photorealistic images that require minimal domain adaptation. For manipulation policies that depend on contact forces (insertion, assembly, deformable object handling), the physics engine's contact model matters more than the visual quality. MuJoCo's contact solver is adequate for rigid grasping but insufficient for simulating cloth folding or liquid pouring.

Third, measure the sim-to-real gap explicitly before committing to a simulation-heavy strategy. Deploy your sim-trained policy on the real robot and measure success rate. If the gap exceeds 20 percentage points, the simulation is not faithful enough for your task and you should invest in real data collection rather than more sophisticated domain randomization. Claru regularly sees teams that spent months tuning simulation parameters when 200 hours of teleoperation data would have produced a better policy faster.

The economics of hybrid data pipelines: for a typical manipulation project, 200-500 real teleoperation demonstrations ($10K-25K from Claru) plus 50K-500K simulated augmentations ($500-2,000 in compute) produces better results than either $25K of pure real data or $2K of pure simulated data.`,

  commonMisconceptions: [
    {
      misconception:
        "Synthetic data will soon make real-world data collection obsolete for robot learning.",
      correction:
        "This is the most persistent and most wrong misconception in the field. The sim-to-real gap in contact-rich manipulation has not substantially narrowed in 5 years of research because the fundamental physics modeling challenges (deformable contacts, friction variability, material properties) remain unsolved. The most advanced sim-to-real results (OpenAI Rubik's cube) required 13,000 years of simulated experience and months of domain randomization tuning — not a scalable recipe. Every commercial robot learning deployment today uses primarily real data.",
    },
    {
      misconception:
        "More domain randomization always improves sim-to-real transfer.",
      correction:
        "Over-randomization degrades performance by making the training distribution unnecessarily broad. If you randomize object masses by plus or minus 90%, the policy must learn to handle objects 10x heavier or lighter than anything it will encounter in reality, wasting model capacity. Vuong et al. (2019) showed that automatic domain randomization — starting with narrow ranges and expanding only when policy performance plateaus — outperforms uniform wide randomization.",
    },
    {
      misconception:
        "Photorealistic rendering is necessary for sim-to-real visual transfer.",
      correction:
        "For many tasks, abstract or domain-randomized rendering transfers as well as or better than photorealistic rendering. Tobin et al. (2017) used deliberately non-photorealistic randomized textures and achieved strong sim-to-real transfer for grasping. The key insight: the policy needs to learn task-relevant features (object shape, gripper position) that are invariant to visual appearance, not to recognize realistic materials.",
    },
  ],

  keyPapers: [
    {
      id: "tobin-domain-rand-2017",
      title:
        "Domain Randomization for Transferring Deep Neural Networks from Simulation to the Real World",
      authors: "Tobin et al.",
      venue: "IROS 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1703.06907",
    },
    {
      id: "akkaya-rubik-2019",
      title: "Solving Rubik's Cube with a Robot Hand",
      authors: "Akkaya et al.",
      venue: "arXiv 1910.07113",
      year: 2019,
      url: "https://arxiv.org/abs/1910.07113",
    },
    {
      id: "makoviychuk-isaac-gym-2021",
      title:
        "Isaac Gym: High Performance GPU-Based Physics Simulation for Robot Learning",
      authors: "Makoviychuk et al.",
      venue: "NeurIPS 2021 Datasets and Benchmarks",
      year: 2021,
      url: "https://arxiv.org/abs/2108.10470",
    },
    {
      id: "james-sim2real-2019",
      title:
        "Sim-to-Real via Sim-to-Sim: Data-efficient Robotic Grasping via Randomized-to-Canonical Adaptation Networks",
      authors: "James et al.",
      venue: "CVPR 2019",
      year: 2019,
      url: "https://arxiv.org/abs/1812.07252",
    },
    {
      id: "hofer-sim2real-survey-2021",
      title: "Sim2Real in Robotics and Automation: Applications and Challenges",
      authors: "Hofer et al.",
      venue: "IEEE T-ASE 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2009.13303",
    },
  ],

  claruRelevance: `Claru exists precisely because synthetic data cannot replace real-world demonstration data for contact-rich manipulation. Our teleoperation datasets capture the contact dynamics, material interactions, object deformations, and environmental diversity that no simulator currently reproduces. Teams that have invested months in simulation-only approaches consistently find that 200-500 real Claru demonstrations outperform millions of simulated trajectories on real-world deployment metrics.

We also support hybrid data strategies: Claru datasets are delivered in formats compatible with RoboCasa, MuJoCo, and Isaac Sim, enabling teams to use our real demonstrations as the fine-tuning dataset atop their simulation pretraining. Our quality pipeline validates that real and simulated data use consistent action space representations, observation formats, and normalization schemes — preventing the integration bugs that commonly arise when combining data sources.`,
};

export default data;
