import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "physical-ai",
  termSlug: "physical-ai",
  category: "physical-ai-systems",
  metaTitle: "Physical AI — Definition & Training Data Guide | Claru",
  metaDescription: "Physical AI builds models that understand and interact with the real world. Learn what distinguishes physical AI from digital AI and what data it requires.",
  primaryKeyword: "physical AI",
  secondaryKeywords: ["physical artificial intelligence", "physical AI training data", "physical AI models", "real world AI", "physical intelligence"],
  canonicalPath: "/glossary/physical-ai",
  h1: "Physical AI: Models That Understand and Act in the Real World",
  heroSubtitle: "Physical AI refers to artificial intelligence systems that understand the physical world — its geometry, physics, materials, and dynamics — and can either interact with it through a robot body or generate accurate simulations of it. Physical AI is the convergence of computer vision, robotics, physics simulation, and foundation models, unified by the requirement for training data that captures how the real world actually behaves.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Physical AI", href: "/glossary/physical-ai" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Physical AI?",
      paragraphs: [
        "Physical AI is an umbrella term for artificial intelligence systems that model, understand, or interact with the physical world. It encompasses robot control policies that manipulate objects, world models that simulate physical dynamics, video generation systems that produce physically plausible footage, digital twins that mirror real-world processes, and perception systems that reconstruct 3D environments from sensor data. The term gained prominence when NVIDIA CEO Jensen Huang used it during his GTC 2024 keynote to describe the next frontier of AI after language models.",
        "The defining characteristic of physical AI is that it must respect the constraints of real-world physics. A language model can generate text about objects passing through walls; a physical AI system must understand that solid objects cannot interpenetrate. A language model operates in a discrete token space; physical AI operates in continuous spaces where small perturbations can have large consequences — dropping a glass versus placing it gently on a table. This requirement for physical consistency makes physical AI fundamentally harder than digital AI and creates specific data requirements that text and image datasets cannot satisfy.",
        "The commercial opportunity is enormous. McKinsey estimates the global market for physical AI-enabled systems — including robotics, autonomous vehicles, and industrial automation — will exceed $200 billion annually by 2030. The bottleneck is not algorithms. The Transformer architecture that powers language models also powers VLA models for robots. The bottleneck is training data: collecting, annotating, and curating the real-world data that physical AI systems need to learn from.",
      ],
    },
    {
      type: "stats",
      heading: "Physical AI at a Glance",
      stats: [
        { value: "$200B+", label: "Projected market by 2030" },
        { value: "$10B+", label: "VC invested in 2024-2025" },
        { value: "GR00T", label: "NVIDIA humanoid model" },
        { value: "Cosmos", label: "NVIDIA world model platform" },
        { value: "pi-zero", label: "Physical Intelligence VLA" },
        { value: "3", label: "Data pyramid layers" },
      ],
    },
    {
      type: "prose",
      heading: "The Physical AI Data Pyramid",
      paragraphs: [
        "Physical AI data falls into three layers organized by collection difficulty, cost, and training value. At the base of the pyramid: passive video — recording scenes without robot interaction — is the cheapest to collect at scale. Any camera can capture it. Passive video provides observation data without action labels, useful for pretraining vision encoders and world models but insufficient for learning robot control directly. Internet video, egocentric recordings, and surveillance footage all fall in this category.",
        "In the middle of the pyramid: human demonstration data — egocentric video of people performing tasks — provides observation and implicit action information. When a human picks up a cup on camera, the video captures the visual trajectory of the hand, the object, and the scene change. This data is more expensive to collect than passive video (you need a camera-wearing person performing specific tasks) but less expensive than robot data. It is particularly valuable for pretraining visuomotor representations at moderate cost.",
        "At the top: robot teleoperation data — synchronized observations paired with explicit robot actions — is the most expensive but provides the exact training signal that manipulation policies need. Each demonstration requires a physical robot, a skilled teleoperator, and the target objects and environment. This data directly trains the action prediction models that control robots. The practical approach that most teams adopt is to build all three layers: large volumes of passive video at the base, moderate volumes of human demonstration data in the middle, and targeted robot teleoperation data at the top.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Physical AI vs. Digital AI",
      description: "How physical AI differs from language and image AI in its data requirements and challenges.",
      columns: ["Dimension", "Physical AI", "Language AI (LLMs)", "Image AI (Diffusion)"],
      rows: [
        { Dimension: "Data Source", "Physical AI": "Real-world sensors + robot demos", "Language AI (LLMs)": "Internet text", "Image AI (Diffusion)": "Internet images + captions" },
        { Dimension: "Data Scale", "Physical AI": "Thousands of hours (expensive)", "Language AI (LLMs)": "Trillions of tokens (cheap)", "Image AI (Diffusion)": "Billions of images (cheap)" },
        { Dimension: "Actions", "Physical AI": "Continuous physical actions", "Language AI (LLMs)": "Discrete token prediction", "Image AI (Diffusion)": "Pixel generation" },
        { Dimension: "Error Cost", "Physical AI": "Physical damage, safety risk", "Language AI (LLMs)": "Incorrect text output", "Image AI (Diffusion)": "Incorrect image" },
        { Dimension: "Sim-to-Real Gap", "Physical AI": "Fundamental challenge", "Language AI (LLMs)": "N/A", "Image AI (Diffusion)": "N/A" },
        { Dimension: "Environmental Diversity", "Physical AI": "Critical (homes, factories vary)", "Language AI (LLMs)": "Naturally diverse online", "Image AI (Diffusion)": "Naturally diverse online" },
      ],
    },
    {
      type: "prose",
      heading: "The Physical AI Ecosystem: Key Companies and Models",
      paragraphs: [
        "NVIDIA has positioned itself as the infrastructure layer for physical AI through three platforms: Isaac Sim for physics simulation, Cosmos for world foundation models trained on physical interaction video, and GR00T N1 for humanoid robot control. Jensen Huang's framing of physical AI as a product category catalyzed industry investment and established NVIDIA's GPU and simulation platforms as the default development environment for the field.",
        "Google DeepMind's robotics research established the VLA (Vision-Language-Action) paradigm with RT-2, demonstrating that large vision-language models can be co-trained on web data and robot demonstrations to produce models with emergent manipulation reasoning. DeepMind's partnership with Boston Dynamics extends this approach to the most mechanically capable humanoid platform. Physical Intelligence (founded by former Google researchers) built pi-zero, a VLA with flow-matching action prediction that targets production-grade manipulation.",
        "On the humanoid side, Figure AI ($2.6B funded, OpenAI partnership), 1X Technologies (data-centric approach, $20K consumer humanoid), Agility Robotics (Digit in Amazon warehouses), and Tesla (Optimus) are all building physical AI systems that require massive training data investments. The common thread across all these companies is that model architecture is largely converged (Transformers + diffusion/flow for actions) and the competitive differentiator is training data quality, diversity, and scale.",
      ],
    },
    {
      type: "prose",
      heading: "Why Physical AI Needs Real-World Data",
      paragraphs: [
        "The sim-to-real gap is the fundamental data challenge for physical AI. Simulated environments — even state-of-the-art platforms like NVIDIA Isaac Sim and MuJoCo — cannot perfectly model the complexity of real-world physical interactions. Contact dynamics between a robot fingertip and a real object depend on surface roughness, material compliance, moisture, temperature, and wear patterns that no simulator captures at sufficient fidelity. Deformable objects (fabric, food, paper) are especially difficult to simulate because their behavior depends on material properties that vary across instances.",
        "NVIDIA and other simulation providers invest in improving simulation fidelity, but the gap is fundamental rather than engineering. Real-world physics is governed by partial differential equations with parameters that vary continuously across materials and conditions. Simulation discretizes these equations on a finite grid with approximate material parameters. The approximation error propagates through learned policies, causing failures when the policy encounters real-world conditions that fall outside the simulator's approximation envelope.",
        "This is why all leading physical AI companies — from NVIDIA to Physical Intelligence to Figure AI — invest in real-world data collection alongside simulation. The industry consensus is that simulation reduces the amount of real-world data needed but does not eliminate the need entirely. The most capable physical AI systems use a combination: simulation for pretraining and policy search, real-world data for fine-tuning and validation. Claru exists to provide the real-world layer of this data stack at production scale.",
      ],
    },
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "brohan-rt2-2023",
          title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
          authors: "Brohan et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2307.15818",
        },
        {
          id: "black-pi0-2024",
          title: "pi-zero: A Vision-Language-Action Flow Model for General Robot Control",
          authors: "Black et al.",
          venue: "arXiv 2410.24164",
          year: 2024,
          url: "https://arxiv.org/abs/2410.24164",
        },
        {
          id: "nvidia-groot-2024",
          title: "GR00T N1: An Open Foundation Model for Generalist Humanoid Robots",
          authors: "NVIDIA",
          venue: "NVIDIA Technical Report",
          year: 2025,
          url: "https://arxiv.org/abs/2503.14734",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "What is the difference between physical AI and embodied AI?",
      answer: "Physical AI is the broader category — it includes any AI system that understands or models the physical world, whether or not it has a body. A video generation model that accurately simulates physics is physical AI but not embodied AI. A robot policy that controls a physical arm is both physical AI and embodied AI. Physical AI also encompasses physics simulators, world models, digital twins, and AR/VR systems that model real-world physics. Embodied AI is specifically about agents with physical bodies.",
    },
    {
      question: "Why is physical AI the next frontier after language AI?",
      answer: "Language AI (LLMs) operates on text, which is an abundant, easily collected, and well-structured data modality. Physical AI must learn from video, sensor data, and physical interactions, which are orders of magnitude harder to collect, annotate, and learn from. The physical world has continuous dynamics, irreversible actions, and safety constraints absent in text. Solving physical AI would enable robots to work in homes, factories, and hospitals — applications with larger economic impact than text generation but requiring fundamentally harder data and learning challenges.",
    },
    {
      question: "What companies are building physical AI?",
      answer: "NVIDIA (Isaac platform, GR00T humanoid model, Cosmos world model), Google DeepMind (RT-2, Genie 2, robotics research), Physical Intelligence (pi-zero VLA), Figure AI (humanoid robots), Tesla (Optimus), Boston Dynamics (Atlas), Agility Robotics (Digit), Covariant (warehouse manipulation), and numerous startups. Major investment from Softbank, Microsoft, Amazon, and venture funds signals that physical AI is one of the largest technology investment areas of 2025-2026.",
    },
  ],
  ctaHeading: "Building Physical AI?",
  ctaDescription: "Claru provides the real-world training data that physical AI models require: egocentric video, manipulation trajectories, and expert annotations across diverse environments.",
  relatedGlossaryTerms: ["embodied-ai", "vla", "world-model", "egocentric-video", "humanoid-robot"],
  relatedGuidePages: ["how-to-collect-egocentric-video-data", "how-to-build-a-manipulation-dataset"],
  relatedSolutionSlugs: ["egocentric-video-data", "manipulation-trajectory-data"],
  longDefinition: `Physical AI is an umbrella term for artificial intelligence systems that model, understand, or interact with the physical world. It encompasses robot control policies that manipulate objects, world models that simulate physical dynamics, video generation systems that produce physically plausible footage, digital twins that mirror real-world processes, and perception systems that reconstruct 3D environments from sensor data.

The defining characteristic of physical AI is that it must respect the constraints of real-world physics. A language model can generate text about objects passing through walls; a physical AI system must understand that solid objects cannot interpenetrate. A language model operates in a discrete token space; physical AI operates in continuous spaces where small perturbations can have large consequences (dropping a glass versus placing it gently). This requirement for physical consistency makes physical AI fundamentally harder than digital AI and creates specific data requirements.

Physical AI models are trained on data that captures real-world physics at the resolution needed for the target application. Robot manipulation policies need synchronized camera images and action labels at 10-50 Hz. World models need diverse video showing how objects, materials, and environments change over time. Perception systems need 3D reconstructions, depth maps, and semantic labels. The common thread is that all physical AI training data must be grounded in reality — synthetic data can supplement but not replace real-world observations because simulators cannot perfectly model the complexity of physical interactions.

The commercial opportunity for physical AI is immense. McKinsey estimates the global market for physical AI-enabled systems (including robotics, autonomous vehicles, and industrial automation) will exceed $200 billion annually by 2030. The bottleneck is not algorithms — the Transformer architecture that powers language models also powers VLA models for robots. The bottleneck is training data: collecting, annotating, and curating the real-world data that physical AI systems need to learn from.`,

  historicalContext: `The term "physical AI" gained prominence in 2023-2024, but the underlying research threads extend back decades. Computer vision researchers have studied 3D reconstruction, object physics, and scene understanding since the 1970s. Robotics researchers have developed learned controllers since the 1980s. The novelty of "physical AI" as a framing is the convergence of these fields through foundation models.

NVIDIA CEO Jensen Huang is widely credited with popularizing "physical AI" as a product category during his GTC 2024 keynote, where he announced the Cosmos platform for world foundation models and the GR00T model for humanoid robots. Huang argued that AI's next great challenge is understanding the physical world, and that this requires a new generation of foundation models trained on physical interaction data rather than text.

The foundations were laid by several research threads converging in 2022-2024. Google DeepMind's RT-2 (2023) showed that vision-language models could be fine-tuned for robot control, establishing the VLA paradigm. OpenAI's Sora (2024) demonstrated that video generation models implicitly learn physical dynamics. NVIDIA's Isaac Gym enabled massively parallel physics simulation for robot policy training. Physical Intelligence's pi-zero (2024) combined VLA architectures with flow matching for production-grade manipulation.

The investment cycle followed the terminology. In 2024-2025, over $10 billion in venture capital flowed into physical AI startups: humanoid robots (Figure AI, 1X Technologies, Agility Robotics), manipulation systems (Covariant, Dexterity, Formic), autonomous driving (Waymo, Aurora), and physical AI infrastructure (NVIDIA, Physical Intelligence). This investment has created unprecedented demand for physical AI training data — the raw material that these companies need to build their products.`,

  practicalImplications: `For teams building physical AI systems, the data strategy is the most important early decision. The choice of data modalities, collection scale, environment diversity, and annotation layers determines what the model can and cannot learn.

Physical AI data falls into three categories by collection difficulty and cost. Passive video (recording scenes without robot interaction) is the cheapest to collect at scale — any camera can capture it. But passive video provides observation data without action labels, useful for pretraining vision encoders and world models but insufficient for learning robot control. Human demonstration data (egocentric video of people performing tasks) provides observation and implicit action information, useful for pretraining visuomotor representations at moderate cost. Robot teleoperation data (observations paired with explicit robot actions) is the most expensive but provides the exact training signal that manipulation policies need.

The practical approach that most teams adopt is a data pyramid. At the base, large volumes (10,000+ hours) of passive and human demonstration video pretrain the visual backbone. In the middle, moderate volumes (1,000-10,000 episodes) of cross-embodiment robot data pretrain the policy backbone. At the top, smaller volumes (1,000-5,000 episodes) of on-hardware teleoperation data fine-tune for the specific deployment scenario.

Environment diversity is often underestimated. Physical AI systems that train in a single lab environment achieve impressive demo results but fail when deployed in a different setting with different lighting, surfaces, and object arrangements. Production systems need training data from dozens to hundreds of distinct environments. This is fundamentally a logistics problem: data collection must be geographically distributed, which requires a global network of collection sites and trained operators.`,

  commonMisconceptions: [
    {
      misconception: "Physical AI is just robotics with a new name.",
      correction: "Robotics traditionally focuses on the engineering of physical machines — mechanical design, control theory, sensor integration. Physical AI focuses on the intelligence component: learning to understand and predict physical phenomena from data. Physical AI includes applications beyond robotics: video generation models that simulate physics, digital twins that model industrial processes, and AR systems that overlay virtual objects with physically correct behavior. Robotics is the most visible application of physical AI but not the only one.",
    },
    {
      misconception: "Foundation models trained on internet text understand physics well enough for physical AI.",
      correction: "Language models have approximate commonsense knowledge of physics ('heavy objects are hard to lift', 'glass breaks when dropped') but lack the quantitative understanding needed for physical AI. They cannot predict whether a specific object will tip over given a specific force, or compute the trajectory needed to throw a ball to a specific location. Physical AI requires models trained on physical interaction data, not text descriptions of physics.",
    },
    {
      misconception: "NVIDIA's simulation tools will eliminate the need for real-world physical AI data.",
      correction: "NVIDIA Isaac Sim and Cosmos are powerful simulation platforms, but they face the fundamental sim-to-real gap: simulated physics cannot perfectly reproduce real-world contact, deformation, and material behavior. NVIDIA themselves invest in real-world data collection (through the GR00T program) alongside their simulation tools. The industry consensus is that simulation reduces but does not eliminate the need for real-world data. The most capable physical AI systems will combine both.",
    },
  ],
  keyPapers: [
    {
      id: "brohan-rt2-2023",
      title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2307.15818",
    },
    {
      id: "black-pi0-2024",
      title: "pi-zero: A Vision-Language-Action Flow Model for General Robot Control",
      authors: "Black et al.",
      venue: "arXiv 2410.24164",
      year: 2024,
      url: "https://arxiv.org/abs/2410.24164",
    },
    {
      id: "nvidia-groot-2024",
      title: "GR00T N1: An Open Foundation Model for Generalist Humanoid Robots",
      authors: "NVIDIA",
      venue: "NVIDIA Technical Report",
      year: 2025,
      url: "https://arxiv.org/abs/2503.14734",
    },
  ],
  claruRelevance: `Claru is a physical AI data company. We provide the three layers of the training data pyramid: large-scale egocentric video for visual pretraining, cross-environment human demonstration data for representation learning, and on-hardware teleoperation data for policy fine-tuning.

Our positioning within the physical AI ecosystem is as the data infrastructure layer. While model companies (NVIDIA, Physical Intelligence, Figure AI) build architectures and hardware, and simulation companies build virtual environments, Claru provides the real-world data that these systems cannot learn without. With 386,000+ annotated clips, 10,000+ trained collectors, and coverage across 100+ cities and 12+ environment types, Claru delivers physical AI training data at production scale.`,
};

export default data;
