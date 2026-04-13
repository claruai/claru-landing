import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "humanoid-robot",
  termSlug: "humanoid-robot",
  category: "physical-ai-systems",
  metaTitle: "Humanoid Robot Training Data — Definition & Guide | Claru",
  metaDescription: "Humanoid robots require whole-body control data spanning locomotion, manipulation, and balance. Learn data needs for Figure, Tesla Optimus, and Agility Digit.",
  primaryKeyword: "humanoid robot",
  secondaryKeywords: ["humanoid robot AI", "humanoid training data", "humanoid robot learning", "bipedal robot", "general-purpose humanoid"],
  canonicalPath: "/glossary/humanoid-robot",
  h1: "Humanoid Robots: Training Data for Whole-Body Intelligent Machines",
  heroSubtitle: "A humanoid robot is a robot with a human-like body plan — bipedal legs, a torso, two arms, and often a head with sensors. Humanoid robots are designed to operate in environments built for humans (homes, offices, factories) without environment modification. Training a humanoid robot requires data that spans locomotion, manipulation, balance, and whole-body coordination — a superset of the data needs for fixed-base manipulation arms.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Humanoid Robot", href: "/glossary/humanoid-robot" },
  ],
  sections: [],
  faqs: [
    {
      question: "What companies are building humanoid robots in 2025-2026?",
      answer: "Major programs include: Figure AI (Figure 02, $2.6B valuation), Tesla (Optimus Gen 2), Agility Robotics (Digit, deployed in Amazon warehouses), 1X Technologies (NEO), Apptronik (Apollo), Unitree (H1, G1), Boston Dynamics (Atlas), Sanctuary AI (Phoenix), and NVIDIA (providing GR00T foundation model for humanoids). Chinese companies including UBTECH, Fourier Intelligence, and Agibot are also investing heavily. The total venture capital flowing into humanoid robotics exceeded $5 billion in 2024.",
    },
    {
      question: "What training data does a humanoid robot need?",
      answer: "Four data categories: (1) Locomotion — walking, turning, climbing stairs, stepping over obstacles, recovering from pushes. Mostly trained in simulation with sim-to-real transfer. (2) Manipulation — grasping, carrying, placing, using tools. Requires real-world teleoperation data because contact physics are hard to simulate. (3) Whole-body coordination — reaching while balancing, carrying objects while walking, crouching to access low shelves. Requires synchronized full-body action labels. (4) Navigation — path planning through cluttered environments. Combines vision data with occupancy mapping.",
    },
    {
      question: "Why is humanoid robot data collection harder than arm robot data?",
      answer: "Three reasons: (1) Higher DOF — a humanoid has 30-50+ actuated joints compared to 6-7 for a manipulation arm, making the action space much larger. (2) Balance coupling — every manipulation action affects balance, and every step affects manipulation, so the data must capture full-body coordination. (3) Safety — a falling humanoid can damage itself and its environment, making real-world data collection more hazardous and requiring extensive safety monitoring. Teleoperation for humanoids requires specialized interfaces (full-body exoskeletons or motion capture suits).",
    },
  ],
  ctaHeading: "Building for Humanoid Robots?",
  ctaDescription: "Claru provides human activity data that maps directly to humanoid robot training: egocentric video of manipulation, navigation, and whole-body tasks in diverse environments.",
  relatedGlossaryTerms: ["physical-ai", "vla", "embodied-ai", "groot-n1", "pi-zero"],
  relatedGuidePages: ["how-to-collect-egocentric-video-data", "how-to-build-a-manipulation-dataset"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  longDefinition: `Humanoid robots are robots designed with a body plan that approximates the human form: two legs for bipedal locomotion, two arms for manipulation, a torso for structural support, and a head for sensor mounting. The humanoid form factor is motivated by the observation that human environments (doorways, staircases, workstations, vehicles) are designed for human body dimensions and capabilities. A robot that matches the human form can operate in these environments without costly modifications.

The AI challenge for humanoid robots is uniquely demanding because the system must simultaneously solve locomotion (maintaining balance while walking on varied terrain), manipulation (grasping and moving objects with human-like dexterity), and coordination (performing manipulation tasks while maintaining balance, walking while carrying objects). These problems are coupled — an arm movement shifts the center of mass, requiring compensatory adjustments from the legs and torso. The control policy must reason about the entire body simultaneously.

Training humanoid robot policies requires data that captures this whole-body coordination. Unlike fixed-base manipulation arms where the data consists of (camera_image, 7D_action) pairs, humanoid data includes full-body joint configurations (30-50+ dimensions), foot contact states, center-of-mass trajectories, and the coupling between upper-body manipulation and lower-body balance. This high-dimensional action space makes learning significantly harder and requires more training data.

The data pipeline for humanoid robots typically follows a layered approach. Locomotion policies are trained primarily in simulation (using physics engines like MuJoCo or Isaac Sim) with domain randomization, because walking data can be generated through RL in simulation at scale. Manipulation policies require real-world teleoperation data because contact physics are too complex to simulate accurately. Whole-body policies that coordinate locomotion and manipulation are typically trained by composing pretrained locomotion and manipulation modules, then fine-tuning on whole-body demonstration data.`,

  historicalContext: `Humanoid robots have been built since Honda's P2 (1996) and ASIMO (2000), but these early systems used hand-programmed controllers with no machine learning. Boston Dynamics' Atlas (2013-present) demonstrated remarkable physical capabilities through a combination of optimization-based control and extensive engineering, but also without learned policies.

The shift toward learning-based humanoid control began with DeepMind's work on simulated locomotion (2017-2019), showing that reinforcement learning could discover natural-looking walking, running, and getting-up behaviors in simulation. Agility Robotics' Digit (2020-present) was the first humanoid designed for learned locomotion in deployment, using RL-trained walking policies transferred from simulation.

NVIDIA's announcement of GR00T (Generalist Robot 00 Technology) in 2024 marked the entry of foundation model approaches into humanoid robotics. GR00T N1 is a VLA-class model specifically designed for humanoid whole-body control, trained on a combination of human motion capture data, teleoperation demonstrations, and simulated experience. The model takes natural language instructions and visual observations as input and produces whole-body action commands.

The 2024-2025 investment cycle has accelerated humanoid development dramatically. Figure AI's partnership with OpenAI, Tesla's Optimus deployments in its own factories, and Agility's Digit robots operating in Amazon warehouses have moved humanoids from research curiosities to early commercial deployment. The common bottleneck across all these programs is training data: generating enough diverse, high-quality whole-body interaction data to train policies that generalize beyond the factory floor.`,

  practicalImplications: `Humanoid robot data needs differ from manipulation arm data in several important ways that affect collection strategy and infrastructure.

Human motion capture data is a valuable proxy training signal for humanoid robots. A person performing household tasks while wearing a motion capture suit generates kinematic data that can be retargeted to a humanoid robot's joint space. This data captures natural human movement patterns — how people reach while maintaining balance, how they coordinate walking and carrying, how they adjust posture for different tasks. CMU's Motion Capture Database, AMASS (Archive of Motion Capture As Surface Meshes), and commercially available motion capture datasets provide thousands of hours of such data. However, retargeting introduces errors because human and robot body proportions differ.

Teleoperation for humanoid robots is more complex than for manipulation arms. Full-body teleoperation requires either a motion capture suit (mapping human body motion to robot joints), a VR system with hand and body tracking, or a specialized exoskeleton. Each interface has latency, mapping accuracy, and fatigue tradeoffs. Most current humanoid teleoperation systems control the arms and head through VR/exoskeleton while the legs use semi-autonomous locomotion (the operator specifies walking direction and speed, not individual leg joint positions).

Egocentric video from humans performing daily tasks provides a scalable pretraining resource for humanoid vision systems. A person wearing a head-mounted camera generates visual data from approximately the same viewpoint as a humanoid robot's head cameras. This data trains vision encoders to recognize objects, understand spatial layouts, and parse human activities — all useful for humanoid AI. Claru's catalog of 386,000+ egocentric clips directly supports humanoid vision pretraining.

The simulation-to-real pipeline is critical for locomotion. Walking policies are almost exclusively pretrained in simulation because real-world locomotion training would involve many falls and potential hardware damage. Domain randomization over terrain types, friction, slopes, and perturbation forces produces walking policies that transfer to physical hardware. Real-world fine-tuning then adapts the policy to the specific actuator dynamics and ground surfaces of the deployment environment.`,

  commonMisconceptions: [
    {
      misconception: "Humanoid robots need to look exactly like humans to work in human environments.",
      correction: "The critical factor is body dimensions and capabilities, not visual appearance. A humanoid robot needs to fit through standard doorways (80cm), reach standard counter heights (90cm), and navigate standard staircases (18cm rise, 28cm run). It does not need a human face, hair, or skin. Most commercial humanoids have clearly robotic appearances. The human form factor is an engineering specification for environmental compatibility, not an aesthetic choice.",
    },
    {
      misconception: "Humanoid robots can learn everything from simulation.",
      correction: "Locomotion transfers well from simulation because it involves relatively predictable ground contact physics. Manipulation transfers poorly because grasping, tool use, and object interaction involve complex contact dynamics that simulators approximate crudely. Whole-body tasks (manipulating objects while walking) are particularly hard to simulate because errors in both locomotion and manipulation physics compound. Real-world data remains essential for any humanoid task involving manipulation.",
    },
    {
      misconception: "A humanoid robot is just an arm robot with legs.",
      correction: "The coupling between locomotion and manipulation is the defining challenge. Every arm movement affects balance, requiring compensatory adjustments from the torso and legs. Walking while carrying an object is not just walking + holding — the object shifts the center of mass, changes the moment of inertia, and requires continuous balance adaptation. This coupling means humanoid control is a fundamentally different problem from manipulating with a fixed-base arm, requiring different data, architectures, and training procedures.",
    },
  ],
  keyPapers: [
    {
      id: "nvidia-groot-2024",
      title: "GR00T N1: An Open Foundation Model for Generalist Humanoid Robots",
      authors: "NVIDIA",
      venue: "NVIDIA Technical Report",
      year: 2025,
      url: "https://arxiv.org/abs/2503.14734",
    },
    {
      id: "radosavovic-humanoid-2024",
      title: "Real-World Humanoid Locomotion with Reinforcement Learning",
      authors: "Radosavovic et al.",
      venue: "Science Robotics 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2303.03381",
    },
    {
      id: "cheng-expressive-2024",
      title: "Expressive Whole-Body Control for Humanoid Robots",
      authors: "Cheng et al.",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2402.16796",
    },
  ],
  claruRelevance: `Claru supports humanoid robot development through our large-scale egocentric video datasets. Human activity data captured from a first-person perspective closely matches the visual input of a humanoid robot's head cameras, providing a scalable pretraining resource for humanoid vision systems.

Our collection network captures the full range of human activities that humanoid robots must eventually perform: household manipulation, object carrying and transport, navigation through cluttered spaces, and multi-step task sequences. For teams building humanoid AI systems, Claru provides the human activity data at scale that enables visual pretraining before expensive robot-specific data collection begins.`,
};

export default data;
