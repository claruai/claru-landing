import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "foundation-model-robotics",
  termSlug: "foundation-model-robotics",
  category: "physical-ai-systems",
  metaTitle: "Foundation Models for Robotics — Definition & Training Data | Claru",
  metaDescription: "Foundation models for robotics are large pretrained models that generalize across tasks, environments, and robot embodiments. Learn about RT-2, OpenVLA, pi-zero, Octo, and how internet-scale pretraining combines with robot data to create generalist manipulation policies.",
  primaryKeyword: "foundation model robotics",
  secondaryKeywords: ["robot foundation model", "general purpose robot model", "large-scale robot model", "generalist robot policy", "VLA foundation model"],
  canonicalPath: "/glossary/foundation-model-robotics",
  h1: "Foundation Models for Robotics: From Internet Pretraining to Generalist Robot Control",
  heroSubtitle: "Foundation models for robotics are large neural networks pretrained on internet-scale data (images, text, video) and fine-tuned on robot demonstrations to produce generalist policies that follow language instructions, manipulate novel objects, and transfer across robot embodiments. Models like RT-2, OpenVLA, and pi-zero represent the convergence of large language models with physical robot control.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Foundation Model for Robotics", href: "/glossary/foundation-model-robotics" },
  ],
  sections: [],
  faqs: [
    {
      question: "What makes a model a 'foundation model' for robotics rather than just a robot policy?",
      answer: "A foundation model for robotics has three distinguishing properties: (1) it is pretrained on large-scale data beyond robot demonstrations — typically internet images, text, and video that provide visual understanding, language comprehension, and common-sense reasoning; (2) it generalizes to novel objects, environments, and instructions not seen during robot-specific training; (3) it can be adapted to new robot embodiments or tasks through fine-tuning with modest amounts of task-specific data (50-500 demonstrations). A standard robot policy trained on 1,000 demonstrations for a specific task on a specific robot is not a foundation model — it is a specialist. RT-2 qualifies as a foundation model because its PaLM-E backbone was pretrained on internet-scale image-text data, giving it zero-shot understanding of thousands of object categories and natural language instructions that no robot dataset could cover.",
    },
    {
      question: "What is the role of internet pretraining in robot foundation models?",
      answer: "Internet pretraining provides two capabilities that robot-only data cannot: visual-semantic understanding and language grounding. A model pretrained on billions of image-text pairs (like PaLM-E, LLaVA, or Prismatic VLM) already understands what a 'red cup,' 'wrench,' or 'stuffed animal' looks like without ever seeing these objects in a robot setting. It can also parse complex natural language instructions ('pick up the fruit that is not the banana'). Robot demonstrations then teach the model how to translate this visual-semantic understanding into physical actions. The RT-2 paper (Brohan et al., 2023) demonstrated this transfer quantitatively: on novel objects not present in the robot training data, RT-2 achieved 62% success rate versus 32% for RT-1 (which had no internet pretraining), proving that internet knowledge transfers to physical manipulation.",
    },
    {
      question: "How much robot-specific data does a foundation model need?",
      answer: "The answer depends on the degree of generalization required. For fine-tuning a pretrained VLA to a single new task on a specific robot, 50-200 demonstrations suffice (demonstrated by Octo and OpenVLA). For broad multi-task capability on a single robot, 10,000-130,000 demonstrations are typical (RT-1 used 130K). For cross-embodiment generalization, the Open X-Embodiment dataset provides 1M+ trajectories from 22 robots. The critical insight is that internet pretraining dramatically reduces the robot data needed for visual and semantic understanding — the robot data only needs to teach the action mapping, not the perception. This is why a 7B-parameter VLA fine-tuned with 100 demonstrations on a new robot can outperform a 300M-parameter specialist policy trained from scratch with 1,000 demonstrations.",
    },
    {
      question: "What are the current limitations of robot foundation models?",
      answer: "Four major limitations persist. First, real-time performance: most foundation models run at 1-5 Hz due to the computational cost of large vision-language backbones, too slow for reactive contact-rich tasks. Pi-zero's flow matching approach partially addresses this, but latency remains a concern. Second, long-horizon reasoning: current models struggle with tasks requiring 10+ sequential steps with conditional branching (e.g., full meal preparation). Third, precise force control: internet pretraining provides no force/torque understanding, so foundation models still underperform specialized policies on tasks requiring sub-Newton force modulation. Fourth, safety and reliability: foundation models can hallucinate actions or fail to recognize dangerous situations because their training data does not systematically cover failure modes. Production deployment requires additional safety layers beyond the foundation model itself.",
    },
    {
      question: "Which robot foundation models are open-source and available for fine-tuning?",
      answer: "As of early 2026, the major open-source robot foundation models are: OpenVLA (Kim et al., 2024) — a 7B-parameter VLA based on Prismatic VLM, pretrained on OXE data, with open weights and training code. It is the most accessible starting point for teams wanting to fine-tune a foundation model on custom data. Octo (Team Octo, 2024) — a generalist policy pretrained on 800K OXE episodes, designed for efficient fine-tuning with as few as 50 demonstrations on new robots. It uses a Transformer architecture with flexible observation and action tokenization. HPT (Wang et al., 2024) — Heterogeneous Pretrained Transformers with a stem-trunk architecture for handling different observation and action spaces. RT-2 and pi-zero remain closed-source from Google DeepMind and Physical Intelligence respectively, though pi-zero's architecture is documented in sufficient detail for reproduction.",
    },
  ],
  ctaHeading: "Need Training Data for Robot Foundation Models?",
  ctaDescription: "Claru provides diverse demonstration data in RLDS format, ready for foundation model pretraining and fine-tuning. Tell us your model architecture and data requirements.",
  relatedGlossaryTerms: ["vla", "open-x-embodiment", "cross-embodiment-data", "embodied-ai"],
  relatedGuidePages: ["how-to-build-a-cross-embodiment-dataset"],
  relatedSolutionSlugs: ["vla-training-data"],
  longDefinition: "A foundation model for robotics is a large neural network, typically with hundreds of millions to tens of billions of parameters, that is pretrained on broad data (internet images, text, video, and/or multi-robot demonstrations) and can be adapted to diverse downstream robot tasks through fine-tuning or in-context learning. The term draws from the foundation model paradigm in NLP (Bommasani et al., 2021), where models like GPT and BERT — pretrained on internet text — serve as general-purpose starting points for specific applications.\n\nThe architecture of robot foundation models typically follows the Vision-Language-Action (VLA) pattern: a vision encoder (ViT, SigLIP) processes camera observations, a language model backbone (PaLM, LLaMA) processes natural language instructions and integrates visual features, and an action head maps the joint representation to robot-executable actions. The action head may output discretized action tokens (RT-2), continuous action vectors (OpenVLA), or denoised action sequences (pi-zero). The vision encoder and language backbone are initialized from internet-pretrained checkpoints, providing zero-shot visual recognition and language understanding that would require millions of robot demonstrations to learn from scratch.\n\nThe data recipe for robot foundation models has three tiers. The first tier is internet-scale pretraining data: billions of image-text pairs (LAION, CC3M, WebLI) and text corpora that give the model visual and linguistic understanding. The second tier is robot demonstration data: tens of thousands to millions of (observation, action, language instruction) trajectories from teleoperation, collected across diverse tasks and ideally across multiple robot embodiments. The third tier is task-specific fine-tuning data: 50-500 demonstrations on the specific robot and task for deployment, used to adapt the general model to the specific deployment context.\n\nThe key empirical finding that validates robot foundation models is positive transfer from internet pretraining to robot control. RT-2 demonstrated that on instructions involving novel objects (objects present in internet data but absent from robot training data), the foundation model achieved 62% success versus 32% for a model trained only on robot data. This 30-percentage-point gap represents knowledge that is effectively free — it comes from internet data that is orders of magnitude cheaper to collect than robot demonstrations.",
  historicalContext: "The concept of foundation models for robotics emerged from the convergence of three threads: large language models, vision-language pretraining, and large-scale robot data collection.\n\nThe language model foundation was laid by GPT-3 (Brown et al., 2020) and subsequent models that demonstrated that scale in pretraining data and parameters produces emergent generalization capabilities. The vision-language connection was established by CLIP (Radford et al., 2021) and Flamingo (Alayrac et al., 2022), which showed that joint image-text pretraining creates powerful visual representations that generalize to novel visual concepts.\n\nThe first robot foundation models appeared in 2022-2023. SayCan (Ahn et al., 2022) combined an LLM (PaLM) with value functions trained per-skill, using the LLM for high-level task planning and learned value functions for grounding. This was a composition rather than an end-to-end foundation model. RT-1 (Brohan et al., 2022) trained a Transformer on 130,000 demonstrations from 13 robots, demonstrating multi-task manipulation at scale. RT-2 (Brohan et al., 2023) was the first true VLA foundation model, fine-tuning a PaLM-E vision-language model on robot data to produce action tokens directly from vision and language inputs.\n\nThe open-source era began in 2024. OpenVLA (Kim et al., 2024) released a 7B-parameter VLA with open weights, enabling the broader community to fine-tune foundation models on custom robot data. Octo (Team Octo, 2024) provided a smaller, more efficient foundation model specifically designed for rapid fine-tuning with limited data. Physical Intelligence's pi-zero (Black et al., 2024) pushed the frontier by combining VLA pretraining with flow-matching action generation, achieving the broadest demonstrated task repertoire of any single robot policy. The trajectory is toward ever-larger models (pi-zero reportedly exceeds 3B parameters) trained on ever-broader data mixtures combining internet, human video, simulation, and multi-robot demonstrations.",
  practicalImplications: "For teams deciding whether to train from scratch or fine-tune a foundation model, the decision tree is straightforward. If your application involves a single robot performing a narrow set of tasks in a controlled environment (e.g., bin picking in a warehouse), a specialist policy trained from scratch on 500-2,000 demonstrations will likely outperform a fine-tuned foundation model at lower computational cost. If your application requires language-conditioned task execution, manipulation of diverse objects, or deployment across multiple robots or environments, a foundation model provides a dramatically better starting point.\n\nFine-tuning a robot foundation model follows established transfer learning practices. Start with a pretrained checkpoint (OpenVLA or Octo for open-source, or train your own from a vision-language base). Collect 50-500 demonstrations on your specific robot performing your target tasks. Fine-tune the model with a low learning rate (1e-5 to 5e-5), freezing the vision encoder initially and unfreezing it for the final training phase. The fine-tuning typically requires 8-32 A100 GPU-hours for a 7B model on 200 demonstrations — modest by modern ML standards.\n\nData quality for foundation model fine-tuning has specific requirements. Each demonstration must include a natural language instruction describing the task (e.g., 'pick up the red cup and place it on the plate'). The language should be varied — the same task should be described with different phrasings across demonstrations to prevent the model from overfitting to specific instruction templates. Visual diversity is equally important: vary lighting, camera angles, background clutter, and object arrangements across demonstrations.\n\nThe compute requirements for inference are substantial. A 7B VLA model requires 16-24 GB GPU memory and runs at 2-5 Hz on an NVIDIA A100 or RTX 4090. For deployment on embedded hardware (NVIDIA Jetson), model distillation or quantization (INT8) is necessary, which reduces quality by 5-15% but enables edge deployment. The alternative is running the model on a cloud GPU and streaming actions to the robot over a low-latency network — practical for lab environments but challenging for production deployment due to latency sensitivity.",
  commonMisconceptions: [
    {
      misconception: "Robot foundation models can perform any task zero-shot without any robot-specific training data.",
      correction: "Foundation models provide strong visual and semantic understanding from internet pretraining, but they still require robot-specific demonstration data to learn the mapping from observations to physical actions. Even RT-2, with its massive PaLM-E backbone, was fine-tuned on 130,000 robot demonstrations. The 'foundation' is in visual recognition and language understanding — the model knows what a cup looks like and what 'pick up' means. The robot data teaches it how to actually command a robot arm to perform the pick-up motion. Zero-shot performance on entirely novel motor skills is still poor.",
    },
    {
      misconception: "Bigger models always perform better for robot tasks.",
      correction: "Model size shows diminishing returns for narrow robot applications. Octo (93M parameters) matches or outperforms larger models on single-task fine-tuning benchmarks when given sufficient task-specific data. OpenVLA (7B) excels at multi-task, language-conditioned manipulation but runs at 2-5 Hz — too slow for reactive tasks. For a single-task deployment, a 100M-parameter specialist policy at 20+ Hz may outperform a 7B foundation model at 3 Hz purely due to control latency. The size advantage manifests primarily in breadth of generalization, not in peak performance on any single task.",
    },
    {
      misconception: "Internet pretraining data is sufficient — robot demonstration data will eventually become unnecessary.",
      correction: "While internet data teaches visual understanding and language grounding, it fundamentally cannot teach the embodied physics of manipulation: how much force to apply when grasping a soft object, how to recover from a slip, or how a deformable object responds to pushing. These physical skills must be learned from interactions with the physical world — either real demonstrations or high-fidelity simulation. The role of internet pretraining is to reduce the amount of robot data needed by handling the perception and reasoning components, not to eliminate robot data entirely. Estimates from multiple research groups suggest that even with perfect internet pretraining, at least 1,000-10,000 robot demonstrations per task category remain necessary for robust manipulation.",
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
      id: "kim-openvla-2024",
      title: "OpenVLA: An Open-Source Vision-Language-Action Model",
      authors: "Kim et al.",
      venue: "CoRL 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2406.09246",
    },
    {
      id: "black-pi0-2024",
      title: "pi0: A Vision-Language-Action Flow Model for General Robot Control",
      authors: "Black et al.",
      venue: "arXiv 2410.24164",
      year: 2024,
      url: "https://arxiv.org/abs/2410.24164",
    },
    {
      id: "team-octo-2024",
      title: "Octo: An Open-Source Generalist Robot Policy",
      authors: "Team Octo",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2405.12213",
    },
    {
      id: "brohan-rt1-2022",
      title: "RT-1: Robotics Transformer for Real-World Control at Scale",
      authors: "Brohan et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2212.06817",
    },
    {
      id: "bommasani-foundation-2021",
      title: "On the Opportunities and Risks of Foundation Models",
      authors: "Bommasani et al.",
      venue: "arXiv 2108.07258",
      year: 2021,
      url: "https://arxiv.org/abs/2108.07258",
    },
  ],
  claruRelevance: "Claru provides the robot demonstration data that serves as the second and third data tiers for foundation model training. For pretraining, our catalog of 386,000+ annotated clips spanning manipulation, navigation, and daily activities provides diverse robot interaction data in RLDS format, compatible with OXE-based training pipelines used by OpenVLA, Octo, and other foundation models. For fine-tuning, Claru collects task-specific demonstrations on the client's target robot with natural language instruction annotations, varied phrasing, and visual diversity.\n\nOur unique value for foundation model teams is environmental diversity at scale. Lab-collected datasets — even large ones like OXE — are visually homogeneous (same lab backgrounds, same lighting, same table surfaces). Claru's collection network captures demonstrations in 100+ cities across homes, kitchens, offices, workshops, and retail settings, providing the visual distribution breadth that foundation models need to generalize beyond the lab. This environmental diversity, combined with standardized action labels and language annotations, makes Claru datasets a direct complement to public cross-embodiment corpora for teams training or fine-tuning robot foundation models.",
};

export default data;
