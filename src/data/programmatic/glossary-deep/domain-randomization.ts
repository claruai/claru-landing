import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "domain-randomization",
  termSlug: "domain-randomization",
  category: "robotics-fundamentals",
  metaTitle: "Domain Randomization for Sim-to-Real Transfer | Claru",
  metaDescription: "Domain randomization trains robot policies on randomized simulation parameters to bridge the sim-to-real gap. Learn techniques, limits, and how real data complements it.",
  primaryKeyword: "domain randomization",
  secondaryKeywords: ["domain randomization robotics", "sim-to-real domain randomization", "visual domain randomization", "physics randomization", "DR simulation"],
  canonicalPath: "/glossary/domain-randomization",
  h1: "Domain Randomization: Training Robust Policies Through Simulation Diversity",
  heroSubtitle: "Domain randomization is a technique for bridging the sim-to-real gap by randomizing visual and physical parameters of the simulation environment during policy training. By exposing the policy to a wide range of textures, lighting conditions, object sizes, friction coefficients, and camera positions during training, the real world becomes just another variation within the training distribution rather than an out-of-distribution domain.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Domain Randomization", href: "/glossary/domain-randomization" },
  ],
  sections: [],
  faqs: [
    {
      question: "What parameters should be randomized for manipulation tasks?",
      answer: "Visual parameters: textures of objects and backgrounds, lighting direction/intensity/color, camera position/orientation (within +/-5cm and +/-10 degrees of nominal), and distractor objects. Physics parameters: object mass (+/-30% of estimated value), surface friction (0.2-1.2), joint damping, gripper friction, and table height. Randomize visual parameters aggressively (they are cheap to simulate and the gap is large) but physics parameters conservatively (centered on measured real-world values) because unrealistic physics produces behaviors that do not transfer.",
    },
    {
      question: "How much does domain randomization reduce the sim-to-real gap?",
      answer: "For visual tasks (object detection, pose estimation), domain randomization can close 70-90% of the gap, sometimes achieving zero-shot sim-to-real transfer. For manipulation tasks, it typically closes 40-60% of the gap, with the remaining gap due to physics modeling errors that randomization cannot address. Contact-rich tasks (insertion, assembly) see the least benefit from domain randomization because the physics gap dominates. Combining domain randomization with 100-1,000 real-world fine-tuning demonstrations closes most of the remaining gap.",
    },
    {
      question: "Can you over-randomize and hurt performance?",
      answer: "Yes. Over-randomization produces policies that are robust to everything but optimized for nothing. A policy trained with extreme mass randomization (objects ranging from 1g to 10kg) will grasp cautiously regardless of the actual object weight, reducing efficiency on normal objects. The solution is adaptive domain randomization (ADR) or automatic domain randomization, where the randomization ranges are expanded only when the policy masters the current range. OpenAI used ADR for their Rubik's cube manipulation work.",
    },
  ],
  ctaHeading: "Need Real-World Data to Complement Simulation?",
  ctaDescription: "Claru provides the real-world demonstrations that close the gap domain randomization leaves open.",
  relatedGlossaryTerms: ["sim-to-real-gap", "synthetic-data", "transfer-learning-robotics", "behavioral-cloning", "diffusion-policy"],
  relatedGuidePages: ["how-to-setup-domain-randomization-pipeline", "how-to-bridge-sim-to-real-gap"],
  relatedSolutionSlugs: ["sim-to-real-data"],
  longDefinition: `Domain randomization (DR) is a sim-to-real transfer technique that trains robot policies on simulations where visual and physical parameters are randomly varied at each episode or even each timestep. The core idea is simple but powerful: if the policy can succeed in simulations with randomly sampled textures, lighting, object sizes, friction values, and camera configurations, then the real world is just one more point in this already-broad training distribution, and the policy should handle it without explicit adaptation.

DR operates on two categories of parameters. Visual domain randomization varies the appearance of the simulated scene: object textures (sampled from random noise, internet images, or procedural generators), lighting conditions (direction, intensity, color temperature, number of light sources), camera parameters (position jitter, field of view, image noise), and background elements (random objects, distractors, floor textures). This is computationally cheap because rendering with randomized textures costs little more than rendering with fixed textures.

Physics domain randomization varies the physical properties of the simulation: object masses, friction coefficients, joint damping values, actuator delays, motor strengths, and gravity vectors. This is more delicate because unrealistic physics parameters produce training experiences that do not exist in the real world. If the simulation trains the robot on objects with negative friction (objects that slide uphill), the resulting policy may learn behaviors that are physically impossible. Physics randomization must be centered on measured or estimated real-world values with conservative variance.

The effectiveness of domain randomization depends on the gap being primarily parametric — the real world differs from the simulation in ways that can be expressed as variations of known parameters. For visual appearance, this assumption holds well: lighting, textures, and camera positions are parametric. For physics, the assumption is weaker: the real world contains phenomena (deformable contacts, granular materials, aerodynamic effects) that are not just different parameter values but fundamentally different physics than what the simulator models.`,

  historicalContext: `Domain randomization was introduced by Tobin et al. at OpenAI in 2017 for sim-to-real transfer of object detection networks. Their key experiment showed that a detector trained entirely on simulated images with randomized textures, lighting, and distractors achieved comparable performance to one trained on real images — without seeing a single real image during training. This was a surprising and influential result.

Peng et al. (2018) extended domain randomization to physics parameters for locomotion, randomizing mass, friction, and motor strength during policy training. The resulting policies transferred from MuJoCo simulation to a real quadruped robot. This established DR as a general-purpose sim-to-real technique applicable beyond perception.

OpenAI's Dactyl project (2018-2019) was the most ambitious application of domain randomization. They trained a policy in simulation to manipulate a Rubik's cube with a dexterous Shadow Hand, randomizing over 200 parameters including friction, object size, gravity, and actuator properties. The policy transferred to the physical hand and could solve the cube, demonstrating that massive DR could bridge the gap for complex dexterous manipulation. They introduced Automatic Domain Randomization (ADR), which progressively widens randomization ranges as the policy improves.

Since 2020, the field has increasingly combined DR with real-world fine-tuning rather than relying on DR alone. The industry consensus, validated by Google's RT models and Physical Intelligence's pi-zero, is that DR is a valuable pretraining strategy but not a complete sim-to-real solution. The best results come from DR-pretrained policies fine-tuned on moderate quantities of real-world data.`,

  practicalImplications: `Implementing domain randomization requires choosing which parameters to randomize, what ranges to use, and how to structure the training pipeline.

For visual DR, the minimum viable implementation randomizes: lighting (2-8 point lights with random positions, intensities, and colors), textures (random RGB values or sampled from a texture dataset for tabletop, objects, and walls), camera position (uniform noise of +/-3cm translation, +/-5 degrees rotation around the nominal position), and image augmentation (color jitter, Gaussian noise, random crops). Libraries like NVIDIA Isaac Sim and MuJoCo with dm_control provide built-in visual randomization. More sophisticated approaches use neural style transfer or diffusion-based texture generation for more realistic appearance variation.

For physics DR, randomize around measured values: object mass (+/-20-30%), surface friction (0.3-1.0 for most household objects), joint damping (+/-20%), and gripper friction (+/-25%). Avoid extreme ranges that produce physically implausible scenarios. Measuring real-world values (weighing objects, measuring friction with simple tests) and centering the randomization around those values significantly improves transfer.

Training with DR typically requires 3-5x more simulation episodes than training without DR because the policy must learn to handle the full range of conditions rather than optimizing for a single configuration. On GPU-accelerated simulators like Isaac Gym, this is manageable — training 10,000 environments in parallel for 1,000 episodes per environment takes hours rather than days.

The practical architecture for production sim-to-real transfer in 2025-2026 is: (1) Train in simulation with aggressive visual DR and conservative physics DR for 100,000-1,000,000 episodes. (2) Collect 500-2,000 real-world demonstrations on the target hardware. (3) Fine-tune the DR-pretrained policy on real data with a lower learning rate. This pipeline consistently outperforms either pure simulation training or pure real-world training.`,

  commonMisconceptions: [
    {
      misconception: "Domain randomization makes real-world data unnecessary.",
      correction: "DR reduces but does not eliminate the need for real data. Even with extensive DR, policies typically lose 15-40% of their simulation performance when transferred to reality. The physics gap (contact dynamics, deformable objects, sensor noise patterns) cannot be closed by randomizing parameters in a simplified physics engine. Real-world fine-tuning data remains necessary for production deployment, though DR reduces the required quantity by 3-10x compared to training from scratch on real data.",
    },
    {
      misconception: "More randomization is always better.",
      correction: "Excessive randomization produces policies that are maximally robust but minimally performant. A policy trained to handle objects with masses ranging from 1g to 100kg will grasp every object as if it might be extremely heavy, producing overly cautious and slow behavior. The optimal randomization range covers the variation the policy will encounter in deployment, plus a moderate safety margin. Automatic domain randomization (ADR) addresses this by expanding ranges only when the policy demonstrates mastery of the current range.",
    },
    {
      misconception: "Domain randomization works equally well for all robot tasks.",
      correction: "DR works best for tasks where the sim-to-real gap is primarily visual (object detection, reaching, coarse placement). It works poorly for tasks where the physics gap dominates: insertion into tight tolerances, manipulating deformable objects (cloth, rope, dough), tool use with precise force requirements, and any task involving fluid dynamics. For these contact-rich tasks, real-world data is essential because the relevant physical phenomena cannot be adequately modeled in current simulators regardless of parameter randomization.",
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
      id: "peng-dynamics-randomization-2018",
      title: "Sim-to-Real Transfer of Robotic Control with Dynamics Randomization",
      authors: "Peng et al.",
      venue: "ICRA 2018",
      year: 2018,
      url: "https://arxiv.org/abs/1710.06537",
    },
  ],
  claruRelevance: `Claru provides the real-world data layer that completes the domain randomization pipeline. Teams that pretrain policies with DR in simulation need high-quality real-world demonstrations for the fine-tuning stage that closes the remaining gap. Claru delivers these demonstrations with the quality guarantees that determine whether fine-tuning succeeds or fails.

Our data captures the real-world conditions that simulators cannot randomize toward: genuine object textures and materials, natural lighting variation, real sensor noise characteristics, and true contact physics. For teams using NVIDIA Isaac Sim or MuJoCo for DR pretraining, Claru's real-world datasets provide the complementary data source needed for production deployment.`,
};

export default data;
