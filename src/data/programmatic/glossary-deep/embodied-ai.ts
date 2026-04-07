import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "embodied-ai",
  termSlug: "embodied-ai",
  category: "physical-ai-systems",
  metaTitle: "Embodied AI — Definition & Training Data Guide | Claru",
  metaDescription: "Embodied AI builds agents that perceive and act in the physical world through a body. Learn architectures, data requirements, and the shift from internet AI to physical intelligence.",
  primaryKeyword: "embodied AI",
  secondaryKeywords: ["embodied artificial intelligence", "embodied agent", "embodied AI training data", "physical embodied AI", "embodied intelligence"],
  canonicalPath: "/glossary/embodied-ai",
  h1: "Embodied AI: Intelligence That Lives in a Physical Body",
  heroSubtitle: "Embodied AI refers to artificial intelligence systems that perceive, reason about, and act in the physical world through a physical body — whether a robot arm, a humanoid, a drone, or an autonomous vehicle. Unlike disembodied AI that processes text and images in isolation, embodied AI must handle the constraints of real physics: gravity, friction, collision, and the irreversibility of physical actions.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Embodied AI", href: "/glossary/embodied-ai" },
  ],
  sections: [],
  faqs: [
    {
      question: "What is the difference between embodied AI and robotics?",
      answer: "Robotics encompasses the engineering of physical machines, including mechanical design, control systems, and sensor integration. Embodied AI focuses specifically on the intelligence and learning components — the algorithms that enable a robot to perceive its environment, make decisions, and learn new behaviors. A robot without AI is an automation system following programmed instructions; embodied AI adds the ability to adapt to novel situations, understand natural language commands, and learn from experience.",
    },
    {
      question: "What data modalities does embodied AI require?",
      answer: "Embodied AI typically requires multimodal data: RGB video from cameras, depth data from stereo or LiDAR sensors, proprioceptive data (joint positions, velocities, torques), tactile data from force/torque sensors, and sometimes audio. These streams must be temporally synchronized, as the agent must learn correlations across modalities — for example, that a specific visual appearance predicts a particular contact force during grasping.",
    },
    {
      question: "Why is real-world data essential for embodied AI?",
      answer: "The physical world is too complex to model accurately in simulation. Contact physics, deformable objects, lighting variation, and sensor noise create a sim-to-real gap that prevents simulation-only training from producing deployable agents. Embodied AI systems require real-world data to learn the true distribution of physical interactions. The most successful embodied AI systems (RT-2, pi-zero, GR00T) all train on large-scale real-world demonstration data.",
    },
    {
      question: "How does embodied AI differ from large language models?",
      answer: "LLMs process and generate text sequences with no physical grounding. Embodied AI must ground language understanding in physical perception and action — understanding that 'pick up the heavy red box' requires visual identification, weight estimation through proprioception, and grasp force adjustment. The key difference is the closed perception-action loop: embodied AI acts on the world and observes the consequences, creating a feedback cycle absent in text-only AI.",
    },
  ],
  ctaHeading: "Building Embodied AI Systems?",
  ctaDescription: "Claru provides the multimodal real-world data that embodied AI requires: egocentric video, manipulation trajectories, and rich annotation layers across diverse environments.",
  relatedGlossaryTerms: ["physical-ai", "vla", "world-model", "visuomotor-policy", "egocentric-video"],
  relatedGuidePages: ["how-to-collect-egocentric-video-data", "how-to-build-a-manipulation-dataset"],
  relatedSolutionSlugs: ["egocentric-video-data", "manipulation-trajectory-data"],
  longDefinition: `Embodied AI is the branch of artificial intelligence concerned with building agents that exist in and interact with the physical world through a physical body. The "embodiment" is the key differentiator: rather than processing data passively, an embodied AI agent has sensors that perceive the environment, actuators that change the environment, and a closed-loop control system that connects perception to action in real time.

The defining characteristic of embodied AI is the perception-action loop. The agent observes the world through its sensors (cameras, depth sensors, tactile arrays, proprioceptive encoders), processes these observations to understand the current state of the world and plan an action, executes the action through its actuators (motors, grippers, propellers), and then observes the consequences. This loop runs continuously at 10-100 Hz, and the agent must make decisions under real-time constraints — unlike a chatbot that can take seconds to generate a response, a robot catching a falling object must react within milliseconds.

Embodied AI encompasses several sub-problems. Perception requires understanding 3D scenes from sensor data: identifying objects, estimating their poses, recognizing materials, and predicting physical properties like weight and fragility. Planning requires reasoning about sequences of actions to achieve goals, accounting for physical constraints like reachability, stability, and collision avoidance. Control requires translating high-level plans into precise motor commands that execute reliably on imperfect hardware. Learning requires acquiring new skills from experience, demonstrations, or instructions without being explicitly programmed for each task.

The field is converging on foundation model approaches where large neural networks pretrained on diverse data serve as the backbone for embodied intelligence. VLA models (Vision-Language-Action) like RT-2 and OpenVLA represent the current frontier, combining internet-scale vision-language pretraining with robot-specific fine-tuning to produce agents that can follow natural language instructions to manipulate objects in real-world environments. However, these models require substantial quantities of real-world interaction data for fine-tuning, making data collection a critical bottleneck.`,

  historicalContext: `The concept of embodied intelligence has roots in cybernetics and the work of Grey Walter, whose "tortoise" robots in the late 1940s demonstrated that simple reactive circuits could produce complex-looking behavior in a physical environment. The philosopher Rodney Brooks formalized the importance of embodiment in AI with his 1991 paper "Intelligence Without Representation," arguing that intelligent behavior emerges from the interaction between an agent and its environment rather than from internal symbolic reasoning.

Brooks' Subsumption Architecture (1986) was an early embodied AI framework that rejected traditional symbolic AI planning in favor of layered reactive behaviors. His work at MIT led to robots like Genghis and Cog that demonstrated real-world behavior without world models or planning algorithms. This "behavior-based" approach dominated embodied AI through the 1990s.

The 2010s saw a shift toward deep learning for embodied AI. Levine et al. (2016) demonstrated end-to-end visuomotor policies that learned manipulation directly from camera images. The development of large-scale simulation environments (AI2-THOR, Habitat, Isaac Gym) enabled training embodied agents in virtual worlds before deploying them on physical hardware.

The current era, beginning around 2022, is defined by foundation models for embodied AI. Google's PaLM-E (2023) showed that a single large model could process both language and robot observations. RT-2 (2023) demonstrated that fine-tuning a vision-language model to output robot actions transfers world knowledge to physical control. NVIDIA's Project GR00T (2024-2025) targets general-purpose humanoid intelligence. These developments have made embodied AI a central focus of investment from major technology companies and startups alike.`,

  practicalImplications: `Building an embodied AI system requires data that captures the full complexity of physical interaction. Unlike training a vision model on curated images, embodied AI data must include the temporal dynamics of how scenes change in response to actions, the synchronization between multiple sensor modalities, and the physical context (what the robot was doing, why, and what happened as a result).

The data collection challenge for embodied AI is fundamentally harder than for disembodied AI. Internet images and text are abundant, but robot interaction data must be actively collected through hardware deployment. A single teleoperation demonstration takes 30-120 seconds and produces 300-6,000 timesteps of data. Building a dataset of 50,000 demonstrations requires 2,000-4,000 operator hours — a significant investment in human labor and hardware uptime.

Environment diversity is the most underappreciated data requirement. An embodied AI agent trained only in one kitchen will fail in a different kitchen with different cabinet heights, lighting conditions, and object arrangements. Production embodied AI systems need training data from dozens to hundreds of distinct environments to develop the visual and physical generalization needed for deployment. This makes data collection a logistics challenge as much as an engineering one.

The data format must capture the multimodal, temporal nature of embodied interaction. Standard formats include RLDS (for TensorFlow/JAX pipelines), HDF5 (for PyTorch), and zarr (for scalable cloud storage). Each timestep must include all synchronized sensor streams, action labels, and metadata (camera calibration, robot URDF, task description). Missing or misaligned data is a common source of training failures that can be invisible until model evaluation.`,

  commonMisconceptions: [
    {
      misconception: "Embodied AI just means putting a chatbot inside a robot.",
      correction: "Language models are one component of embodied AI, not the whole system. A robot needs real-time perception (processing camera images at 30+ fps), physical planning (computing collision-free trajectories), precise control (executing movements at the actuator level), and safety monitoring (detecting and responding to unexpected contact). The language component helps with instruction understanding but represents less than 10% of the total system complexity.",
    },
    {
      misconception: "Simulation can fully replace real-world data for training embodied AI.",
      correction: "Simulation is valuable for pretraining and scaling up data variety, but the sim-to-real gap means that models trained only in simulation lose 20-50% of performance when deployed on real hardware. Contact physics, deformable objects, sensor noise, and actuator dynamics are all imperfectly modeled. Every successful embodied AI system to date has used significant quantities of real-world interaction data.",
    },
    {
      misconception: "Embodied AI is only relevant for humanoid robots.",
      correction: "Embodied AI applies to any agent with a physical body: industrial robot arms, warehouse mobile robots, agricultural drones, autonomous vehicles, and surgical robots. Humanoid robots are the most dramatic application, but the largest near-term market for embodied AI is in manipulation arms and mobile platforms for logistics, manufacturing, and food service.",
    },
  ],
  keyPapers: [
    {
      id: "brooks-intelligence-1991",
      title: "Intelligence Without Representation",
      authors: "Brooks",
      venue: "Artificial Intelligence 47(1-3)",
      year: 1991,
      url: "https://people.csail.mit.edu/brooks/papers/representation.pdf",
    },
    {
      id: "driess-palme-2023",
      title: "PaLM-E: An Embodied Multimodal Language Model",
      authors: "Driess et al.",
      venue: "ICML 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.03378",
    },
    {
      id: "savva-habitat-2019",
      title: "Habitat: A Platform for Embodied AI Research",
      authors: "Savva et al.",
      venue: "ICCV 2019",
      year: 2019,
      url: "https://arxiv.org/abs/1904.01201",
    },
  ],
  claruRelevance: `Claru provides the real-world interaction data that embodied AI systems require for fine-tuning and deployment. Our datasets span 12+ environment types and capture the multimodal, temporally synchronized data streams — egocentric video, depth, action labels, and natural language annotations — that embodied AI architectures expect.

For teams building embodied AI products, Claru handles the logistics of large-scale real-world data collection across diverse environments. Our network of 10,000+ trained collectors in 100+ cities enables the geographic and environmental diversity that production embodied AI systems need to generalize beyond a single lab setting.`,
};

export default data;
