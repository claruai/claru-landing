import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "groot-n1",
  termSlug: "groot-n1",
  category: "models-architectures",
  metaTitle: "NVIDIA GR00T N1 — Humanoid Foundation Model | Claru",
  metaDescription: "GR00T N1 is NVIDIA's open foundation model for humanoid robot control. Learn its dual-system architecture, training data requirements, and how it fits the humanoid AI stack.",
  primaryKeyword: "GR00T N1",
  secondaryKeywords: ["NVIDIA GR00T", "humanoid foundation model", "GR00T robot model", "NVIDIA humanoid AI", "GR00T N1 training data"],
  canonicalPath: "/glossary/groot-n1",
  h1: "GR00T N1: NVIDIA's Foundation Model for Humanoid Robots",
  heroSubtitle: "GR00T N1 (Generalist Robot 00 Technology) is NVIDIA's open foundation model for humanoid robot control, released in March 2025. It uses a dual-system architecture: System 1 for fast reactive control (visuomotor policy) and System 2 for slow deliberate planning (vision-language reasoning). GR00T N1 represents NVIDIA's bet that humanoid robots will be the dominant form factor for general-purpose physical AI and that a foundation model approach can accelerate the entire industry.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "GR00T N1", href: "/glossary/groot-n1" },
  ],
  sections: [],
  faqs: [
    {
      question: "What is the dual-system architecture of GR00T N1?",
      answer: "GR00T N1 has two components inspired by Kahneman's System 1/System 2 thinking. System 1 is a fast reactive policy that processes visual observations and produces motor commands at 30+ Hz — handling balance, reflexive grasping, and continuous motion control. System 2 is a vision-language model that reasons about tasks, plans action sequences, and provides high-level guidance at 1-5 Hz. System 2 sets the goal; System 1 achieves it reactively. This separation allows fast physical control without waiting for slow language model inference.",
    },
    {
      question: "What training data does GR00T N1 use?",
      answer: "GR00T N1 is trained on three data sources: (1) Human motion capture data retargeted to humanoid kinematics, providing natural whole-body movement patterns. (2) Simulation data from NVIDIA Isaac Lab with domain randomization for locomotion and basic manipulation. (3) Real-world teleoperation data for dexterous manipulation and complex tasks. The model also leverages NVIDIA Cosmos (world model) data for visual pretraining. Exact dataset sizes are not publicly disclosed but are estimated at millions of motion clips and hundreds of thousands of manipulation trajectories.",
    },
    {
      question: "How does GR00T N1 relate to NVIDIA Isaac and Cosmos?",
      answer: "GR00T N1 sits atop NVIDIA's physical AI stack. Isaac Sim provides the simulation environment for training locomotion policies and generating synthetic data. Isaac Lab provides the RL training framework. Cosmos provides the world model for visual pretraining — understanding how physical scenes evolve. Omniverse provides the digital twin infrastructure for testing before real-world deployment. GR00T N1 is the model layer that consumes data from all these platforms and produces humanoid robot behavior.",
    },
  ],
  ctaHeading: "Training Humanoid Foundation Models?",
  ctaDescription: "Claru provides the real-world human activity data that humanoid models need for visual pretraining and manipulation fine-tuning.",
  relatedGlossaryTerms: ["humanoid-robot", "vla", "physical-ai", "pi-zero", "world-model"],
  relatedGuidePages: ["how-to-collect-egocentric-video-data", "how-to-build-a-cross-embodiment-dataset"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  longDefinition: `GR00T N1 (Generalist Robot 00 Technology, version N1) is NVIDIA's open-weight foundation model for humanoid robot control, announced at GTC 2025 and released as an open model for the robotics community. The model targets bipedal humanoid robots with dual-arm manipulation capability, the form factor that NVIDIA CEO Jensen Huang has identified as the next major platform for AI.

The dual-system architecture is the defining design choice. System 1 is a fast, reactive visuomotor policy running at 30+ Hz that handles the continuous control loop: maintaining balance, adjusting posture, tracking moving objects with the hands, and executing smooth trajectories. System 2 is a vision-language model running at 1-5 Hz that handles high-level reasoning: interpreting natural language instructions, planning multi-step task sequences, identifying objects and their affordances, and setting goals for System 1 to achieve. The two systems communicate through a shared representation space — System 2 produces goal representations that condition System 1's reactive behavior.

This architecture addresses a fundamental tension in humanoid control. Language models are too slow for reactive physical control (inference takes 100-500ms, but balance corrections must happen within 50ms). Visuomotor policies are too fast for deliberate planning (they react to immediate sensory input but cannot plan multi-step task sequences). By separating the fast reactive loop from the slow planning loop, GR00T N1 achieves both responsive physical control and intelligent task reasoning.

The model is designed to work with NVIDIA's broader physical AI infrastructure. Isaac Sim generates the simulated training environments. Isaac Lab provides the RL training framework for System 1 locomotion policies. Cosmos provides world model pretraining that teaches the visual backbone about physical dynamics. Omniverse enables digital twin testing where the model is evaluated in a simulated replica of the deployment environment before real-world deployment. This integrated stack is NVIDIA's play to become the platform provider for the humanoid robot industry.`,

  historicalContext: `NVIDIA's entry into humanoid robotics was signaled at GTC 2024, where Jensen Huang announced Project GR00T and described humanoid robots as potentially "the next multi-trillion-dollar industry." The initial announcement was a vision statement; the GR00T N1 model released in March 2025 was the first concrete implementation.

The intellectual foundations draw from NVIDIA's research in three areas. First, GPU-accelerated physics simulation (Isaac Gym, released 2021) enabled training locomotion policies at scale through massively parallel RL in simulation. Second, NVIDIA's work on world models (Cosmos, announced 2024) provided visual pretraining on physical dynamics. Third, partnerships with humanoid robot companies (Figure AI, Agility Robotics, Apptronik, 1X, Sanctuary AI) provided real-world hardware platforms and teleoperation data.

GR00T N1 was positioned as an "open" model to encourage ecosystem adoption, similar to how NVIDIA's CUDA platform became the standard for GPU computing by being broadly available. By providing a free foundation model, NVIDIA incentivizes humanoid robot companies to build on NVIDIA hardware (Jetson Orin for edge inference, DGX for training) and use NVIDIA's simulation and deployment tools. The model is open-weight but the full training pipeline and dataset are not publicly released.

In the broader competitive landscape, GR00T N1 competes with Physical Intelligence's pi-zero (focused on dexterous manipulation), Google DeepMind's RT-X models (focused on multi-task manipulation), and various proprietary models from humanoid companies. NVIDIA's unique advantage is the integration with their hardware and simulation stack, which no other company can match.`,

  practicalImplications: `For teams using or fine-tuning GR00T N1, the data requirements depend on which component is being adapted.

System 1 (reactive control) can be largely trained in simulation using NVIDIA Isaac Lab. Locomotion policies for walking, turning, stair climbing, and balance recovery are trained through RL with domain randomization. The sim-to-real transfer for locomotion is well-established, though teams must validate on their specific hardware. Manipulation components of System 1 require real-world teleoperation data because contact physics are poorly simulated.

System 2 (planning and reasoning) benefits from real-world visual data that teaches the model about object affordances, spatial layouts, and task structure in the deployment environment. Egocentric video of humans performing tasks provides a scalable pretraining signal. Fine-tuning on robot-specific data (what the robot's cameras actually see) adapts the model to the deployment viewpoint.

The data gap that most GR00T N1 users face is in whole-body coordination data: demonstrations of humanoid robots performing manipulation tasks while maintaining balance and adjusting posture. This data is scarce because humanoid teleoperation infrastructure is still maturing. Motion capture data from humans provides approximate whole-body coordination patterns but requires kinematic retargeting that introduces errors, particularly for humanoids with non-human proportions or different joint ranges.

For teams building on GR00T N1, Claru's egocentric video datasets provide the human activity data that System 2 needs for visual pretraining. Our data captures manipulation, navigation, and multi-step task execution from a first-person perspective across diverse environments — exactly the visual understanding that System 2 must develop to reason about tasks in new settings.`,

  commonMisconceptions: [
    {
      misconception: "GR00T N1 can make any humanoid robot intelligent out of the box.",
      correction: "GR00T N1 provides a foundation but requires substantial fine-tuning for each specific humanoid platform. Different humanoids have different kinematics, actuator properties, camera configurations, and payload capacities. The model must be adapted to each robot through hardware-specific teleoperation data and sim-to-real calibration. NVIDIA provides the starting point; each humanoid company must invest in the data and engineering to adapt it to their hardware.",
    },
    {
      misconception: "The dual-system architecture means GR00T N1 is two completely separate models.",
      correction: "System 1 and System 2 share visual representations and communicate through a learned interface. The vision encoder is shared — both systems see the world through the same learned features. System 2's goal representations condition System 1's behavior through cross-attention or goal-conditioned architectures. The separation is in the control frequency and reasoning depth, not in the underlying representations.",
    },
    {
      misconception: "NVIDIA's simulation tools eliminate the need for real-world data with GR00T N1.",
      correction: "NVIDIA Isaac Sim is excellent for locomotion training and visual domain randomization, but it cannot replace real-world data for manipulation tasks. The physics of grasping, tool use, and object interaction require real-world demonstrations. NVIDIA themselves invest in real-world data collection through partnerships with humanoid companies. The recommended pipeline is simulation pretraining + real-world fine-tuning, not simulation only.",
    },
  ],
  keyPapers: [
    {
      id: "nvidia-groot-n1-2025",
      title: "GR00T N1: An Open Foundation Model for Generalist Humanoid Robots",
      authors: "NVIDIA",
      venue: "NVIDIA Technical Report",
      year: 2025,
      url: "https://arxiv.org/abs/2503.14734",
    },
    {
      id: "makoviychuk-isaac-gym-2021",
      title: "Isaac Gym: High Performance GPU-Based Physics Simulation for Robot Learning",
      authors: "Makoviychuk et al.",
      venue: "NeurIPS 2021 Datasets and Benchmarks",
      year: 2021,
      url: "https://arxiv.org/abs/2108.10470",
    },
    {
      id: "radosavovic-humanoid-2024",
      title: "Real-World Humanoid Locomotion with Reinforcement Learning",
      authors: "Radosavovic et al.",
      venue: "Science Robotics 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2303.03381",
    },
  ],
  claruRelevance: `Claru provides the real-world visual and activity data that GR00T N1's System 2 needs for effective task reasoning. Our 386,000+ egocentric video clips capture human manipulation, navigation, and multi-step tasks from a first-person perspective across 12+ environment types — directly training the visual understanding that enables humanoid robots to plan and reason about tasks in new environments.

For teams fine-tuning GR00T N1 for specific deployment scenarios, Claru collects targeted egocentric data in the actual deployment environment, ensuring the model's visual representations match the conditions it will face in production. This environment-specific pretraining data complements the simulation-based locomotion training and hardware-specific teleoperation data in the full GR00T N1 fine-tuning pipeline.`,
};

export default data;
