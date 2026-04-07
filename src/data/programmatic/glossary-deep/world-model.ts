import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "world-model",
  termSlug: "world-model",
  category: "physical-ai-systems",
  metaTitle: "World Models in AI — Definition & Training Data | Claru",
  metaDescription: "World models learn to simulate how environments evolve in response to actions. Learn architectures, data requirements, and how video pretraining enables planning.",
  primaryKeyword: "world model",
  secondaryKeywords: ["world model AI", "learned simulator", "video prediction model", "world model robotics", "internal world model"],
  canonicalPath: "/glossary/world-model",
  h1: "World Models: Learned Simulators for Planning and Reasoning",
  heroSubtitle: "A world model is a learned internal representation that allows an AI agent to predict how its environment will change in response to its actions, without executing those actions in the real world. World models enable planning by mental simulation — the agent imagines the consequences of different action sequences and selects the best one before committing to physical execution. Training world models requires diverse real-world video that captures the causal structure of physical interactions.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "World Model", href: "/glossary/world-model" },
  ],
  sections: [],
  faqs: [
    {
      question: "What is the difference between a world model and a simulator?",
      answer: "A traditional simulator (MuJoCo, Isaac Sim) is a hand-engineered physics engine with explicit equations for gravity, friction, collision, and rendering. A world model is a neural network that learns to predict future states from data, without explicit physics equations. Simulators are accurate within their modeled phenomena but fail on unmodeled effects (deformable objects, novel materials). World models capture whatever patterns exist in the training data, including effects too complex to engineer explicitly, but their predictions are approximate and degrade outside the training distribution.",
    },
    {
      question: "How much video data is needed to train a world model?",
      answer: "Current video prediction world models require 10,000-1,000,000+ hours of video depending on the scope of physical phenomena they must capture. Sora (OpenAI) was trained on an undisclosed but reportedly massive video corpus. Genie 2 (DeepMind) used large-scale gameplay and real-world video. For domain-specific world models (e.g., predicting kitchen manipulation outcomes), 1,000-10,000 hours of in-domain video can produce useful predictions. The quality and diversity of the video matters as much as quantity — training on redundant footage of the same scene does not improve prediction quality.",
    },
    {
      question: "Can world models replace real-world data collection?",
      answer: "Not yet. Current world models produce plausible-looking video predictions but often violate physical constraints — objects pass through each other, masses change, and precise contact dynamics are unreliable. World models are useful for coarse planning (should the robot go left or right?) and data augmentation (generating additional visual variations of observed scenes) but cannot replace real-world demonstrations for learning fine-grained manipulation policies. The long-term vision is that improved world models will reduce the need for real-world data, but this remains an active research goal rather than a practical reality.",
    },
  ],
  ctaHeading: "Need Video Data for World Models?",
  ctaDescription: "Claru provides large-scale real-world video datasets that capture the physical dynamics world models must learn to predict.",
  relatedGlossaryTerms: ["video-prediction", "embodied-ai", "vla", "diffusion-transformer", "physical-ai"],
  relatedGuidePages: ["how-to-build-a-navigation-dataset", "how-to-collect-egocentric-video-data"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  longDefinition: `A world model is a neural network that learns to predict the future state of an environment given its current state and the actions taken by an agent. In the context of robotics and embodied AI, a world model takes the robot's current camera observations and a proposed action as input and outputs a prediction of what the camera will observe after the action is executed. This prediction capability enables the agent to plan by simulating multiple possible action sequences internally and selecting the one with the best predicted outcome.

World models operate at different levels of abstraction. Low-level world models predict raw sensory observations — the actual pixel values of future camera frames. These are the most direct but also the most computationally expensive, as generating photorealistic video frames requires large generative models. High-level world models predict abstract state representations rather than raw pixels, compressing the environment into a learned latent space where prediction is faster and more tractable. Hybrid approaches predict at an intermediate level, generating feature maps or semantic representations that capture task-relevant structure without the cost of pixel-level generation.

The connection between world models and video generation is deep and increasingly explicit. Modern video generation models (Sora, Genie 2, UniSim) can be viewed as world models that predict how visual scenes evolve over time. When conditioned on actions, these models become controllable simulators that predict the visual consequences of agent behavior. This convergence means that advances in video generation directly benefit world model research, and large-scale video datasets designed for generation can also train world models.

For robotics, world models serve three practical functions. First, they enable model-predictive control (MPC) where the robot plans multi-step action sequences by unrolling the world model forward and optimizing actions that lead to desired outcomes. Second, they provide a data augmentation mechanism, generating synthetic training examples by predicting plausible outcomes of actions not present in the real dataset. Third, they offer a safety mechanism, predicting whether a proposed action will lead to dangerous states (collision, dropping objects, exceeding joint limits) before execution.`,

  historicalContext: `The term "world model" was popularized in the AI context by Ha and Schmidhuber's 2018 paper "World Models," which trained a variational autoencoder to learn a latent representation of a car racing environment and a recurrent network to predict future latent states. The agent learned to drive by planning entirely within the "dream" of its world model, demonstrating that an agent could learn from imagined experience.

Earlier, Sutton's Dyna architecture (1991) formalized the idea of learning an environment model and using it to generate simulated experience for policy improvement. Dyna showed that world model-based planning accelerates reinforcement learning by allowing the agent to learn from both real and simulated transitions. However, early world models were limited to simple, low-dimensional state spaces.

The deep learning era enabled world models for visual observations. Hafner et al. developed a series of increasingly powerful world models: PlaNet (2019) learned latent dynamics for visual control, Dreamer (2020) combined model learning with actor-critic RL for continuous control, and DreamerV3 (2023) demonstrated a single world model architecture that achieved human-level performance on Atari, MuJoCo locomotion, and Minecraft simultaneously.

The video generation revolution beginning in 2023-2024 transformed world models from niche research into a major AI investment area. OpenAI's Sora (2024) demonstrated that large-scale video generation models implicitly learn physical dynamics, generating videos of objects falling, water flowing, and people interacting with believable physics. Google DeepMind's Genie 2 (2024) generated interactive 3D environments from single images. These models suggest that scaling video prediction may be a path to general-purpose world models, though significant challenges remain in achieving physically consistent predictions.`,

  practicalImplications: `Training a world model for robotics requires video data that captures the causal relationship between actions and their visual consequences. This is fundamentally different from passive video (surveillance footage, YouTube clips) because the training signal requires knowing what action caused each observed change.

For action-conditioned world models (the type most useful for robot planning), training data must include paired (observation, action, next_observation) triplets at the temporal resolution of the control loop. This typically means 10-30 Hz data with continuous action labels and synchronized camera observations. The data must come from the target domain — a world model trained on kitchen video will not predict warehouse dynamics accurately.

For visual pretraining world models (learning general physical dynamics without explicit actions), large-scale diverse video is the key resource. The video should capture a wide range of physical phenomena: rigid object motion, deformable object manipulation, liquid pouring, object stacking and unstacking, tool use, and various material interactions. Diversity in environments, objects, and activities is more important than total hours — 1,000 hours spanning 100 environment types is more useful than 10,000 hours from a single environment.

The computational cost of training and deploying world models is substantial. Current video prediction models require hundreds to thousands of GPU-hours to train and run at 1-10 fps during inference, far below the 10-50 Hz control frequency needed for reactive manipulation. This latency gap limits world models to high-level planning (selecting which subtask to attempt next) rather than fine-grained control (adjusting grip force in real time). Advances in efficient architectures and distillation are narrowing this gap but it remains a practical constraint.`,

  commonMisconceptions: [
    {
      misconception: "World models can generate unlimited training data, eliminating the need for real-world collection.",
      correction: "World model predictions are approximate and contain artifacts — objects passing through each other, incorrect material properties, inconsistent lighting. Training policies on world model predictions introduces compounding errors as the policy learns to exploit prediction artifacts rather than real physics. World models are useful for data augmentation (20-40% of the training mix) and coarse planning, but real-world demonstrations remain essential for learning precise manipulation skills.",
    },
    {
      misconception: "Video generation quality is equivalent to world model quality.",
      correction: "A video generation model can produce visually stunning footage that violates physical laws — objects changing mass, forces appearing from nowhere, spatial relationships being inconsistent between frames. A good world model must produce predictions that are physically consistent, not just visually plausible. Current video generation models often fail physics consistency tests even when they look photorealistic. Evaluation metrics must test physical plausibility, not just visual quality.",
    },
    {
      misconception: "World models learn physics from video alone.",
      correction: "World models learn correlations and patterns in video data, which overlap with but are not identical to physics. A world model might learn that dropped objects fall downward without learning Newton's gravitational constant. For robotics, this approximate understanding is often sufficient for planning, but it means world model predictions become unreliable for scenarios outside the training distribution — unusual objects, extreme forces, or novel physical interactions.",
    },
  ],
  keyPapers: [
    {
      id: "ha-world-models-2018",
      title: "World Models",
      authors: "Ha and Schmidhuber",
      venue: "NeurIPS 2018",
      year: 2018,
      url: "https://arxiv.org/abs/1803.10122",
    },
    {
      id: "hafner-dreamerv3-2023",
      title: "Mastering Diverse Domains through World Models",
      authors: "Hafner et al.",
      venue: "arXiv 2301.04104",
      year: 2023,
      url: "https://arxiv.org/abs/2301.04104",
    },
    {
      id: "yang-unisim-2023",
      title: "Learning Interactive Real-World Simulators",
      authors: "Yang et al.",
      venue: "ICLR 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.06114",
    },
    {
      id: "bruce-genie2-2024",
      title: "Genie 2: A Large-Scale Foundation World Model",
      authors: "Bruce et al.",
      venue: "Google DeepMind Technical Report",
      year: 2024,
      url: "https://deepmind.google/discover/blog/genie-2-a-large-scale-foundation-world-model/",
    },
  ],
  claruRelevance: `Claru provides the diverse real-world video data that world models need to learn physical dynamics. Our egocentric video datasets capture manipulation, object interaction, navigation, and tool use across 12+ environment types — the breadth of physical phenomena that world models must learn to predict.

For teams building action-conditioned world models, Claru's teleoperation datasets include synchronized observation-action pairs at 10-30 Hz, providing the action-conditioned training signal that passive video lacks. This enables training world models that predict the specific consequences of robot actions, not just general scene dynamics.`,
};

export default data;
