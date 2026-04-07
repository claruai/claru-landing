import type { ModelPageData } from "../types";

const data: ModelPageData = {
  slug: "pi-0-5",
  metaTitle: "Training Data for Pi-0.5 | Data Requirements & Formats | Claru",
  metaDescription:
    "Complete guide to pi-0.5 training data: FAST action tokenization, web-scale VLM pre-training, multi-embodiment robot data, and how Claru delivers pi-0.5-ready datasets.",
  primaryKeyword: "pi-0.5 training data",
  secondaryKeywords: [
    "pi-0.5 data requirements",
    "pi-0.5 dataset format",
    "data for pi-0.5",
    "pi-0.5 fine-tuning data",
    "physical intelligence pi-0.5",
    "pi-0.5 robot policy",
    "pi-0.5 FAST tokenizer",
  ],
  canonicalPath: "/models/pi-0-5",
  h1: "Training Data for Pi-0.5",
  heroSubtitle:
    "Pi-0.5 is Physical Intelligence's flagship vision-language-action model that combines web-scale VLM pre-training with the largest proprietary robot dataset ever assembled. This guide covers its FAST action tokenization, multi-embodiment data requirements, training volumes, and how Claru delivers pi-0.5-compatible datasets.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Models", href: "/models" },
    { label: "Pi-0.5", href: "/models/pi-0-5" },
  ],

  sections: [
    {
      type: "prose",
      heading: "What Is Pi-0.5?",
      paragraphs: [
        "Pi-0.5 is a vision-language-action (VLA) model released by Physical Intelligence (pi) in February 2025. It is the successor to pi-zero (pi0), the flow-matching-based generalist robot policy that demonstrated dexterous manipulation on seven embodiments in October 2024. Pi-0.5 represents a significant architectural and data-scale leap: it replaces pi0's flow matching action head with FAST (Fourier-domain Action Sequence Tokenization), moves to a larger VLM backbone, and is trained on what Physical Intelligence describes as the largest and most diverse proprietary robot dataset ever assembled for a single model.",
        "The core innovation in pi-0.5 is the FAST tokenizer, which converts continuous robot action trajectories into discrete token sequences that the VLM backbone can predict using standard autoregressive next-token prediction -- the same mechanism the model uses for language. FAST works by applying a discrete cosine transform (DCT) to action trajectories, quantizing the frequency-domain coefficients into a discrete codebook, and representing each action chunk as a short sequence of tokens. This eliminates the need for a separate action head (flow matching, diffusion, or regression) and allows the entire model to be trained with a single cross-entropy loss, dramatically simplifying the training pipeline.",
        "Pi-0.5 was trained on robot data from more than 10 different robot embodiments including single-arm manipulators (Franka Panda, UR5), bi-manual systems (ALOHA-style dual-arm setups), mobile manipulators, and humanoid robots. The training data includes both teleoperated demonstrations and autonomously collected data. Physical Intelligence has not disclosed exact dataset sizes, but public statements indicate the data is orders of magnitude larger than the Open X-Embodiment dataset (which contains approximately 1 million episodes). The model was evaluated on tasks spanning household manipulation (laundry folding, dishwasher loading), industrial assembly, dexterous manipulation (peg insertion, cable routing), and long-horizon multi-step tasks requiring extended planning.",
        "Pi-0.5's position in the field is as the most capable generalist robot policy demonstrated to date. While pi0 showed breakthrough results on dexterous tasks that no prior model could solve (folding different garment types, box assembly), pi-0.5 extends this to longer-horizon tasks, better generalization across environments, and faster inference. The model is partially open: Physical Intelligence released the 'openpi' inference framework for running pi-0.5-compatible models, but the full model weights and training data remain proprietary.",
      ],
    },
    {
      type: "stats",
      heading: "Pi-0.5 at a Glance",
      stats: [
        { value: "3B+", label: "VLM backbone parameters" },
        { value: "10+", label: "Robot embodiments in training" },
        { value: "50 Hz", label: "Action output frequency" },
        { value: "FAST", label: "Action tokenization method" },
        { value: "1", label: "Unified cross-entropy loss" },
        { value: "24-dim", label: "Typical action vector (bi-manual)" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Pi-0.5 Input/Output Specification",
      columns: ["Parameter", "Specification"],
      rows: [
        {
          Parameter: "Observation Format",
          Specification:
            "Multi-view RGB images (up to 3 cameras: primary, wrist left, wrist right) + proprioceptive state",
        },
        {
          Parameter: "Visual Encoder",
          Specification:
            "PaLI-based VLM backbone with ViT image encoder (pre-trained on web-scale image-text data)",
        },
        {
          Parameter: "Task Specification",
          Specification:
            "Natural language instructions with extended reasoning capabilities",
        },
        {
          Parameter: "Action Format",
          Specification:
            "Continuous action trajectories tokenized via FAST (DCT + discrete codebook); action chunks of 50 future steps",
        },
        {
          Parameter: "Action Dimensions",
          Specification:
            "Variable per embodiment: 7-DoF (single arm) to 24-DoF (bi-manual with torso); FAST handles arbitrary dimensions",
        },
        {
          Parameter: "Action Decoding",
          Specification:
            "Autoregressive token prediction (same as language); FAST tokens decoded back to continuous trajectories",
        },
        {
          Parameter: "Control Frequency",
          Specification:
            "50 Hz (action chunks of 50 steps predicted per forward pass)",
        },
        {
          Parameter: "Proprioception",
          Specification:
            "Joint positions, velocities, and gripper state concatenated as additional input tokens",
        },
      ],
    },
    {
      type: "prose",
      heading: "Architecture and Key Innovations",
      paragraphs: [
        "Pi-0.5's architecture is a vision-language-action model built on a pre-trained VLM backbone (PaLI-based, approximately 3 billion parameters). Multi-view RGB images are encoded by a ViT visual encoder into patch-level tokens. A natural language instruction is tokenized into text tokens. Proprioceptive state (joint angles, gripper state) is projected into the token embedding space. All tokens -- visual, language, and proprioceptive -- are concatenated into a single sequence and processed by the VLM transformer. The model then autoregressively generates FAST action tokens that decode back to continuous 50-step action trajectories.",
        "FAST (Fourier-domain Action Sequence Tokenization) is the key innovation that distinguishes pi-0.5 from both its predecessor pi0 and from other VLAs. Prior VLAs used one of three approaches to generate actions: (1) discretize each action dimension into bins and predict them as tokens (RT-2, OpenVLA) -- lossy and produces quantization artifacts; (2) use a diffusion or flow matching head on top of the VLM -- requires a separate loss and training infrastructure; or (3) regress continuous values directly -- uni-modal and cannot represent multi-modal action distributions. FAST solves all three problems: it converts a chunk of 50 continuous action steps into a short sequence of approximately 8-16 discrete tokens via DCT compression and codebook quantization, which the VLM predicts using the same cross-entropy loss used for language.",
        "The FAST tokenization process works as follows: (1) take a 50-step action trajectory (50 x D, where D is the action dimension); (2) apply a discrete cosine transform (DCT) along the temporal axis, which compresses the trajectory into a few dominant frequency coefficients; (3) quantize the DCT coefficients into entries from a learned discrete codebook; (4) flatten the quantized codes into a token sequence. At inference, the model generates FAST tokens autoregressively, the tokens are de-quantized to DCT coefficients, and the inverse DCT produces a continuous 50-step action trajectory. This gives pi-0.5 the best of both worlds: the training simplicity of token prediction and the expressiveness of continuous action generation.",
        "A second key innovation is pi-0.5's extended reasoning capability. Unlike pi0, which processes a single instruction and immediately generates actions, pi-0.5 can perform chain-of-thought reasoning before acting. For long-horizon tasks ('clean up the kitchen'), the model can break the task into sub-goals, reason about the current scene state, and generate an action plan before executing each step. This reasoning happens in the same token space as language and actions -- the model generates a text plan followed by action tokens, all in one autoregressive pass. This capability was enabled by training on demonstration data that includes annotated reasoning traces alongside actions.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Pi-0.5 vs. Related VLA Models",
      columns: ["Model", "Parameters", "Action Representation", "Training Data Scale", "Open Source", "Key Strength"],
      rows: [
        {
          Model: "pi-0.5",
          Parameters: "~3B",
          "Action Representation": "FAST tokens (DCT + codebook)",
          "Training Data Scale": "Largest proprietary robot dataset",
          "Open Source": "Partial (openpi inference)",
          "Key Strength": "Long-horizon dexterous tasks",
        },
        {
          Model: "pi-zero",
          Parameters: "~3B",
          "Action Representation": "Flow matching (continuous)",
          "Training Data Scale": "10K+ hrs multi-embodiment",
          "Open Source": "Partial (openpi inference)",
          "Key Strength": "Dexterous manipulation",
        },
        {
          Model: "OpenVLA",
          Parameters: "7B",
          "Action Representation": "Discrete bins (256/dim)",
          "Training Data Scale": "970K OXE demos",
          "Open Source": "Fully open",
          "Key Strength": "Language grounding",
        },
        {
          Model: "Octo",
          Parameters: "93M",
          "Action Representation": "Diffusion (continuous)",
          "Training Data Scale": "800K OXE demos",
          "Open Source": "Fully open",
          "Key Strength": "Fast fine-tuning",
        },
        {
          Model: "RT-2-X",
          Parameters: "55B",
          "Action Representation": "Discrete bins",
          "Training Data Scale": "130K Google demos + web VLM",
          "Open Source": "Closed",
          "Key Strength": "Emergent reasoning from VLM scale",
        },
      ],
    },
    {
      type: "prose",
      heading: "Training Data Requirements",
      paragraphs: [
        "Pi-0.5's training data has two components: web-scale vision-language data for VLM pre-training and multi-embodiment robot data for action fine-tuning. The VLM pre-training uses internet-scale image-text pairs, visual question answering data, and other multimodal datasets -- the same pre-training pipeline used by PaLI-class models. This gives the VLM backbone strong visual understanding, language fluency, and reasoning ability before it ever sees robot data.",
        "The robot training data is the most distinctive aspect of pi-0.5. Physical Intelligence collected what they describe as the largest and most diverse robot manipulation dataset ever assembled for a single model. The data spans 10+ robot embodiments including Franka Panda, UR5, ALOHA bi-manual systems, mobile manipulators with navigation, and humanoid upper-body platforms. Each demonstration is a trajectory of: multi-view RGB frames (up to 3 camera views synchronized at 50 Hz), proprioceptive state (joint positions, velocities, gripper state), a natural language task description, and continuous action labels (end-effector deltas or joint velocity commands, depending on the embodiment).",
        "For teams fine-tuning pi-0.5-compatible models via the openpi framework, the practical data requirements mirror those of other cross-embodiment VLAs but with emphasis on action trajectory quality. Because FAST tokenizes 50-step action chunks, the temporal smoothness and consistency of action trajectories is critical -- jerky teleoperation data, pauses, or discontinuities produce poor FAST tokens. Actions should be recorded at 50 Hz with smooth, continuous trajectories. Multi-view camera feeds should be hardware-synchronized. Language instructions should describe the full task, and for long-horizon tasks, annotated sub-goal descriptions are needed to train the reasoning capability.",
        "Data volume recommendations for fine-tuning: 200-500 demonstrations per task for single-task adaptation on a known embodiment, 1,000-5,000 demonstrations for multi-task training across a new embodiment, and 10,000+ demonstrations for training a new generalist policy across multiple embodiments. The FAST tokenizer needs to be trained (or at least calibrated) on the target action distribution, so the dataset should cover the full range of actions the robot will need to execute.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Data Integrates with Pi-0.5",
      paragraphs: [
        "Claru provides multi-embodiment demonstration data compatible with pi-0.5's input requirements and the openpi fine-tuning framework. Our datasets include multi-view RGB observations (up to 3 synchronized camera feeds at 50 Hz), proprioceptive state vectors, natural language task descriptions, and continuous action trajectories with the temporal smoothness that FAST tokenization requires. We capture all data at 50 Hz native frequency -- matching pi-0.5's action chunk rate -- so no temporal interpolation is needed.",
        "For long-horizon tasks that leverage pi-0.5's reasoning capability, Claru provides annotated reasoning traces alongside action data. Human annotators decompose multi-step tasks into sub-goals and describe the reasoning at each decision point. This annotation format matches the chain-of-thought training data that enables pi-0.5's extended planning. Our annotation protocol covers the task domains Physical Intelligence has demonstrated: household manipulation (laundry, kitchen tasks, tidying), industrial assembly (insertion, cable routing, part mating), and dexterous manipulation (deformable objects, tool use, bimanual coordination).",
        "Claru's collection network spans single-arm (Franka, UR5, xArm), bi-manual (ALOHA-type dual-arm setups), and mobile manipulation platforms. We deliver data in formats compatible with the openpi inference and fine-tuning framework, including pre-computed FAST codebook statistics for the target action space. Our quality pipeline validates temporal smoothness (rejecting trajectories with action discontinuities exceeding configurable thresholds), camera synchronization (sub-20ms cross-view alignment), and instruction quality (human review of all language annotations).",
      ],
    },
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "black-pi05-2025",
          title: "pi0.5: a Vision-Language-Action Model with Open-World Generalization",
          authors: "Black, K., Brown, N., Driess, D., Esmail, A., et al. (Physical Intelligence)",
          venue: "arXiv 2504.16054",
          year: 2025,
          url: "https://arxiv.org/abs/2504.16054",
        },
        {
          id: "black-pi0-2024",
          title: "pi0: A Vision-Language-Action Flow Model for General Robot Control",
          authors: "Black, K., Brown, N., Driess, D., Esmail, A., et al. (Physical Intelligence)",
          venue: "arXiv 2410.24164",
          year: 2024,
          url: "https://arxiv.org/abs/2410.24164",
        },
        {
          id: "pertsch-fast-2025",
          title: "FAST: Efficient Action Tokenization for Vision-Language-Action Models",
          authors: "Pertsch, K., Stachowicz, K., Ichter, B., et al.",
          venue: "arXiv 2501.09747",
          year: 2025,
          url: "https://arxiv.org/abs/2501.09747",
        },
        {
          id: "kim-openvla-2024",
          title: "OpenVLA: An Open-Source Vision-Language-Action Model",
          authors: "Kim, M. J., Pertsch, K., Karamcheti, S., et al.",
          venue: "arXiv 2406.09246",
          year: 2024,
          url: "https://arxiv.org/abs/2406.09246",
        },
        {
          id: "chi-diffusion-2023",
          title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
          authors: "Chi, C., Feng, S., Du, Y., et al.",
          venue: "RSS 2023 / arXiv 2303.04137",
          year: 2023,
          url: "https://arxiv.org/abs/2303.04137",
        },
        {
          id: "oneill-oxe-2024",
          title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
          authors: "Open X-Embodiment Collaboration",
          venue: "ICRA 2024 / arXiv 2310.08864",
          year: 2024,
          url: "https://arxiv.org/abs/2310.08864",
        },
      ],
    },
  ],

  faqs: [
    {
      question: "What is the difference between pi-0.5 and pi-zero (pi0)?",
      answer:
        "Pi-0.5 is the successor to pi-zero with three major changes. (1) Action representation: pi0 uses flow matching (a continuous generative model that maps noise to actions), while pi-0.5 uses FAST tokenization (DCT compression + discrete codebook), allowing actions to be predicted with the same autoregressive mechanism as language. (2) Reasoning: pi-0.5 can perform chain-of-thought reasoning before generating actions, enabling long-horizon planning that pi0 cannot do. (3) Data scale: pi-0.5 was trained on a significantly larger and more diverse robot dataset. The result is better generalization across tasks and environments, especially on multi-step tasks.",
    },
    {
      question: "What is FAST tokenization and why does it matter for training data?",
      answer:
        "FAST (Fourier-domain Action Sequence Tokenization) converts 50-step continuous action trajectories into short sequences of discrete tokens via DCT compression and codebook quantization. For training data, this means temporal smoothness is critical: the DCT transform assumes smooth, continuous trajectories, so jerky or discontinuous teleoperation data produces poor tokens and degrades model performance. Data should be captured at 50 Hz with smooth, deliberate motions. Claru's collection protocol enforces trajectory smoothness constraints specifically for FAST-compatible pipelines.",
    },
    {
      question: "Is pi-0.5 open source? Can I fine-tune it?",
      answer:
        "Partially. Physical Intelligence released 'openpi', an inference and fine-tuning framework compatible with pi-0.5-style models. The full pi-0.5 model weights and proprietary training data are not publicly available. However, the openpi framework allows researchers to fine-tune pi-0.5-compatible architectures on their own data using the same FAST tokenization and VLM backbone design. Claru delivers data in formats compatible with the openpi framework.",
    },
    {
      question: "How much data do I need to fine-tune a pi-0.5-compatible model?",
      answer:
        "For single-task adaptation on a known embodiment: 200-500 demonstrations. For multi-task fine-tuning on a new robot: 1,000-5,000 demonstrations across 5-20 tasks. For training a new generalist policy across multiple embodiments: 10,000+ demonstrations. All data should be captured at 50 Hz with multi-view RGB observations, proprioceptive state, continuous action trajectories, and natural language instructions. For long-horizon tasks, annotated sub-goal descriptions are recommended to train the reasoning capability.",
    },
    {
      question: "What camera setup does pi-0.5 expect?",
      answer:
        "Pi-0.5 supports up to 3 synchronized camera views: a primary third-person camera overlooking the workspace, and one or two wrist-mounted cameras for close-up manipulation views. All cameras should be hardware-synchronized to within 20ms. For bi-manual setups, separate wrist cameras on each arm provide the most useful information for dexterous coordination tasks. Claru's data collection rigs capture all views with hardware-synchronized timestamps at 50 Hz native frame rate.",
    },
  ],

  ctaHeading: "Get Multi-Embodiment Data for Pi-0.5-Compatible Models",
  ctaDescription:
    "Tell us about your pi-0.5 project -- target robot, task domains, and camera configuration -- and we will deliver 50 Hz multi-view datasets with smooth action trajectories, proprioceptive state, and language annotations compatible with the openpi fine-tuning framework.",
  relatedGlossaryTerms: [
    "vla",
    "foundation-model-robotics",
    "imitation-learning",
    "flow-matching",
    "action-chunking",
  ],
  relatedGuidePages: [
    "how-to-create-action-labels-for-vla",
    "how-to-collect-teleoperation-data",
  ],
  relatedSolutionSlugs: ["vla-training-data"],

  modelName: "Pi-0.5",
  organization: "Physical Intelligence",
  year: 2025,
  inputSpec: {
    observationFormat:
      "Multi-view RGB (up to 3 cameras: primary third-person + left/right wrist) + proprioceptive state (joint positions, velocities, gripper state)",
    actionFormat:
      "Continuous action trajectories (7-24 DoF depending on embodiment) tokenized via FAST into discrete codebook tokens; 50-step action chunks per forward pass",
    languageConditioning:
      "Natural language instructions with extended chain-of-thought reasoning capabilities",
    controlFrequency:
      "50 Hz (50-step action chunks predicted per inference pass)",
  },

  dataVolumeBenchmarks:
    "Pi-0.5 was trained on what Physical Intelligence describes as the largest and most diverse proprietary robot manipulation dataset ever assembled for a single model. The data spans 10+ robot embodiments including Franka Panda, UR5, ALOHA bi-manual systems, mobile manipulators, and humanoid platforms. While exact counts are not publicly disclosed, public statements indicate the dataset is orders of magnitude larger than Open X-Embodiment's approximately 1 million episodes. The training data includes both teleoperated demonstrations and autonomously collected data, covering household manipulation (laundry folding, dishwasher loading, kitchen tasks), industrial assembly (insertion, cable routing), and dexterous manipulation (deformable objects, tool use). Pi-0.5's predecessor pi0 was demonstrated on 7 embodiments with over 10,000 cross-embodiment demonstrations; pi-0.5 significantly expanded this scope. For fine-tuning via the openpi framework: 200-500 demonstrations per task for single-task adaptation, 1,000-5,000 for multi-task on a new embodiment, 10,000+ for new generalist policies.",

  trainingRecipe:
    "Pi-0.5 training begins with a PaLI-based VLM backbone pre-trained on web-scale image-text data (the same foundation used by pi0). The VLM is then fine-tuned on multi-embodiment robot data with FAST (Fourier-domain Action Sequence Tokenization) replacing pi0's flow matching action head. FAST tokenization works by: (1) taking a 50-step continuous action trajectory, (2) applying a discrete cosine transform along the temporal axis to compress it into dominant frequency coefficients, (3) quantizing those coefficients against a learned discrete codebook, (4) flattening the result into a token sequence. The VLM predicts these FAST tokens autoregressively using standard cross-entropy loss -- the same objective used for language tokens. This unifies the training pipeline: one loss, one optimizer, no separate action head training. For chain-of-thought reasoning, the training data includes annotated reasoning traces (text tokens describing sub-goals and scene state) that precede the FAST action tokens. The model learns to generate text reasoning followed by action tokens in a single autoregressive pass. All data is captured at 50 Hz with multi-view RGB, proprioceptive state, and language instructions.",

  claruIntegration:
    "Claru provides multi-embodiment demonstration data for pi-0.5-compatible pipelines via the openpi framework. Our datasets include hardware-synchronized multi-view RGB at 50 Hz (primary + wrist cameras), proprioceptive state vectors, smooth continuous action trajectories that produce clean FAST tokens, and human-written language instructions. For long-horizon tasks, we annotate reasoning traces with sub-goal descriptions. We deliver pre-computed FAST codebook statistics for the target action space, enabling immediate fine-tuning. Our collection spans single-arm, bi-manual, and mobile manipulation platforms across household, industrial, and dexterous task domains.",

  keyPapers: [
    {
      id: "black-pi05-2025",
      title: "pi0.5: a Vision-Language-Action Model with Open-World Generalization",
      authors: "Black, K., Brown, N., Driess, D., Esmail, A., et al. (Physical Intelligence)",
      venue: "arXiv 2504.16054",
      year: 2025,
      url: "https://arxiv.org/abs/2504.16054",
    },
    {
      id: "black-pi0-2024",
      title: "pi0: A Vision-Language-Action Flow Model for General Robot Control",
      authors: "Black, K., Brown, N., Driess, D., Esmail, A., et al. (Physical Intelligence)",
      venue: "arXiv 2410.24164",
      year: 2024,
      url: "https://arxiv.org/abs/2410.24164",
    },
    {
      id: "pertsch-fast-2025",
      title: "FAST: Efficient Action Tokenization for Vision-Language-Action Models",
      authors: "Pertsch, K., Stachowicz, K., Ichter, B., et al.",
      venue: "arXiv 2501.09747",
      year: 2025,
      url: "https://arxiv.org/abs/2501.09747",
    },
    {
      id: "kim-openvla-2024",
      title: "OpenVLA: An Open-Source Vision-Language-Action Model",
      authors: "Kim, M. J., Pertsch, K., Karamcheti, S., et al.",
      venue: "arXiv 2406.09246",
      year: 2024,
      url: "https://arxiv.org/abs/2406.09246",
    },
    {
      id: "chi-diffusion-2023",
      title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi, C., Feng, S., Du, Y., et al.",
      venue: "RSS 2023 / arXiv 2303.04137",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137",
    },
    {
      id: "oneill-oxe-2024",
      title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Open X-Embodiment Collaboration",
      venue: "ICRA 2024 / arXiv 2310.08864",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864",
    },
  ],
};

export default data;
