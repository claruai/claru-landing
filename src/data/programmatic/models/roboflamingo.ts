import type { ModelPageData } from "../types";

const data: ModelPageData = {
  slug: "roboflamingo",
  metaTitle: "Training Data for RoboFlamingo | Data Requirements & Formats | Claru",
  metaDescription:
    "Complete guide to RoboFlamingo training data: Flamingo VLM backbone, CALVIN benchmark, multi-view observation format, and how Claru delivers VLM-compatible robot datasets.",
  primaryKeyword: "roboflamingo training data",
  secondaryKeywords: [
    "roboflamingo data requirements",
    "roboflamingo dataset format",
    "data for roboflamingo",
    "roboflamingo fine-tuning data",
    "flamingo robot control",
    "vlm robot manipulation data",
    "roboflamingo CALVIN",
  ],
  canonicalPath: "/models/roboflamingo",
  h1: "Training Data for RoboFlamingo",
  heroSubtitle:
    "RoboFlamingo adapts the powerful Flamingo vision-language model for robot manipulation, achieving state-of-the-art performance on the CALVIN benchmark with minimal robot-specific fine-tuning. This guide covers observation formats, action specifications, training data volumes, and how Claru delivers VLM-compatible datasets for RoboFlamingo-style pipelines.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Models", href: "/models" },
    { label: "RoboFlamingo", href: "/models/roboflamingo" },
  ],

  sections: [
    {
      type: "prose",
      heading: "What Is RoboFlamingo?",
      paragraphs: [
        "RoboFlamingo is a vision-language-action model developed by Xinghang Li, Minghuan Liu, Hanbo Zhang, and collaborators at ByteDance Research, published in 2023 (arXiv:2311.01378). It adapts DeepMind's Flamingo vision-language model -- originally designed for visual question answering and image captioning -- for robot manipulation by adding a lightweight action prediction head on top of the frozen (or partially unfrozen) VLM backbone. The central result: RoboFlamingo achieved state-of-the-art performance on the CALVIN long-horizon manipulation benchmark, completing 4.2 out of 5 chained subtasks in sequence -- surpassing all prior methods at the time of publication.",
        "The key insight behind RoboFlamingo is that pre-trained vision-language models already encode rich visual understanding, spatial reasoning, and language grounding from web-scale pre-training. Rather than training a robot policy from scratch (which requires massive amounts of robot data), RoboFlamingo reuses the Flamingo VLM's representations and only trains a small action head to map those representations to robot actions. This transfer learning approach dramatically reduces the amount of robot-specific data needed: RoboFlamingo achieves strong performance with as few as a few hundred demonstrations per task.",
        "RoboFlamingo processes a history of RGB observations (multiple frames from one or more cameras) and a natural language instruction through Flamingo's cross-attention-based architecture, where visual features from a frozen CLIP ViT encoder are attended to by the language model via gated cross-attention layers. The language model (based on Chinchilla/LLaMA-style architectures) produces a contextualized representation that captures both what is in the scene and what the instruction asks for. A lightweight MLP action head then predicts continuous end-effector actions from this representation.",
        "RoboFlamingo's position in the robot learning landscape is as a demonstration of efficient VLM-to-robot transfer. While later models like OpenVLA and pi-zero have surpassed it in scale and capability, RoboFlamingo was one of the first to show that a frozen VLM backbone with a trained action head can compete with or beat end-to-end trained robot policies. This finding has influenced the design of nearly every subsequent VLA model.",
      ],
    },
    {
      type: "stats",
      heading: "Key Metrics from the Paper",
      stats: [
        { value: "4.2/5", label: "Chained subtasks on CALVIN" },
        { value: "3B+", label: "Flamingo VLM parameters" },
        { value: "~10M", label: "Trainable action head parameters" },
        { value: "5 Hz", label: "Control frequency" },
        { value: "200x200", label: "Observation resolution (CALVIN)" },
        { value: "1st", label: "VLM-based model to top CALVIN benchmark" },
      ],
    },
    {
      type: "comparison-table",
      heading: "RoboFlamingo Input/Output Specification",
      columns: ["Parameter", "Specification"],
      rows: [
        {
          Parameter: "Observation Format",
          Specification:
            "RGB images (200x200 on CALVIN; higher resolutions for real-world) from static and/or gripper cameras",
        },
        {
          Parameter: "Visual Encoder",
          Specification:
            "Frozen CLIP ViT-L/14 producing per-frame visual tokens, attended via gated cross-attention in the language model",
        },
        {
          Parameter: "Language Model",
          Specification:
            "Flamingo-style decoder (Chinchilla/LLaMA-based) with gated cross-attention to visual tokens",
        },
        {
          Parameter: "Observation History",
          Specification:
            "Multiple frames (typically 6-12 recent observations) providing temporal context for the policy",
        },
        {
          Parameter: "Task Specification",
          Specification:
            "Natural language instructions (e.g., 'push the red block to the left')",
        },
        {
          Parameter: "Action Format",
          Specification:
            "7-DoF continuous end-effector actions: 3D position delta + 3D orientation delta + gripper binary",
        },
        {
          Parameter: "Action Head",
          Specification:
            "Lightweight MLP (2-3 layers) trained on top of frozen/partially-unfrozen VLM features",
        },
        {
          Parameter: "Control Frequency",
          Specification:
            "5 Hz (one action prediction per forward pass)",
        },
      ],
    },
    {
      type: "prose",
      heading: "Architecture and Key Innovations",
      paragraphs: [
        "RoboFlamingo's architecture has three components. First, the visual encoder: a frozen CLIP ViT-L/14 processes each RGB observation frame independently, producing a sequence of visual tokens (patch embeddings) for each frame. The visual tokens from multiple frames (the observation history window) are all available for cross-attention. Second, the language model: a Flamingo-style decoder processes the language instruction tokens while attending to the visual tokens via gated cross-attention layers. These layers allow the language model to selectively attend to relevant visual information at each layer of the transformer, building up a representation that fuses language and vision. Third, the action head: a lightweight MLP (typically 2-3 layers, approximately 10M parameters) maps the language model's final hidden state to a 7-DoF continuous action prediction.",
        "The gated cross-attention mechanism is the key architectural element inherited from Flamingo. In each transformer layer, after self-attention on the text tokens, a cross-attention layer attends from text tokens to visual tokens. A learnable gating parameter (initialized to zero) controls how much visual information flows into the language model at each layer. This gating mechanism allows the pre-trained language model to be gradually and stably fine-tuned to incorporate visual information without catastrophic forgetting of its language capabilities.",
        "A critical design decision in RoboFlamingo is how much of the VLM backbone to unfreeze during robot fine-tuning. The paper evaluates three strategies: (1) fully frozen backbone with only the action head trained -- fastest and most data-efficient but limited in representational adaptation; (2) unfreezing the top N transformer layers while keeping the visual encoder and lower layers frozen -- the recommended approach, balancing adaptation and stability; (3) full fine-tuning of all parameters -- requires the most data and risks overfitting on small datasets. The paper found that unfreezing the top 2-4 transformer layers produced the best CALVIN benchmark results.",
        "RoboFlamingo also introduced the use of observation history for VLM-based robot policies. Rather than processing a single observation frame (as in RT-2 or the original VLA concept), RoboFlamingo feeds 6-12 recent frames to the visual encoder, giving the language model temporal context. This is critical for tasks that require understanding motion direction, tracking objects across time, or detecting whether an action has succeeded. The multi-frame approach leverages Flamingo's native ability to process interleaved image-text sequences, which was originally designed for few-shot image understanding from multiple examples.",
      ],
    },
    {
      type: "comparison-table",
      heading: "RoboFlamingo vs. Related VLM-Based Robot Policies",
      columns: ["Model", "VLM Backbone", "Action Head", "Trainable Params", "Key Benchmark", "Open Source"],
      rows: [
        {
          Model: "RoboFlamingo",
          "VLM Backbone": "Flamingo (3B+)",
          "Action Head": "MLP (~10M)",
          "Trainable Params": "~10-50M (action head + top layers)",
          "Key Benchmark": "CALVIN (4.2/5 chained tasks)",
          "Open Source": "Yes (code + recipe)",
        },
        {
          Model: "RT-2",
          "VLM Backbone": "PaLI-X (55B)",
          "Action Head": "Autoregressive tokens",
          "Trainable Params": "55B (all)",
          "Key Benchmark": "Google Robot (real-world)",
          "Open Source": "No",
        },
        {
          Model: "OpenVLA",
          "VLM Backbone": "Prismatic (7B)",
          "Action Head": "Autoregressive tokens",
          "Trainable Params": "7B (all, or LoRA)",
          "Key Benchmark": "OXE + WidowX (real-world)",
          "Open Source": "Yes",
        },
        {
          Model: "SuSIE",
          "VLM Backbone": "InstructPix2Pix",
          "Action Head": "Diffusion",
          "Trainable Params": "~100M",
          "Key Benchmark": "CALVIN + Bridge",
          "Open Source": "Yes",
        },
        {
          Model: "GR-2",
          "VLM Backbone": "Video GPT + action head",
          "Action Head": "Autoregressive",
          "Trainable Params": "~3B (all)",
          "Key Benchmark": "GR-1 embodiment (real-world)",
          "Open Source": "No",
        },
      ],
    },
    {
      type: "prose",
      heading: "Training Data Requirements",
      paragraphs: [
        "RoboFlamingo's data requirements depend on which components are being trained. For the action head only (frozen VLM backbone), a few hundred demonstrations per task can produce strong results. The CALVIN benchmark evaluation used approximately 24,000 demonstrations across 34 tasks in a simulated tabletop environment, but the paper showed that strong performance was achievable with subsets of this data. For real-world fine-tuning with a partially unfrozen backbone, 200-1,000 demonstrations per task is a practical range.",
        "Each demonstration consists of a sequence of timesteps, where each timestep contains: an RGB observation (200x200 for CALVIN, typically 224x224 or higher for real-world), a 7-DoF action vector (position delta, orientation delta, gripper command), and a natural language instruction describing the task. The observation history window means each training sample actually includes 6-12 consecutive frames, not just a single frame. Actions should be recorded at the control frequency (5 Hz for standard RoboFlamingo).",
        "Language instructions are essential for RoboFlamingo's performance. The Flamingo backbone's language understanding is what enables task conditioning and generalization to novel task descriptions. Instructions should be natural language descriptions of the task ('push the red block to the left,' 'open the drawer and pick up the pink block'), not symbolic codes. Instruction diversity matters: using varied paraphrases across demonstrations of the same task improves generalization. The CALVIN benchmark provides 34 distinct task types with natural language descriptions, and RoboFlamingo chains up to 5 of these tasks in sequence.",
        "For real-world deployment, the main data quality considerations are: (1) camera consistency -- the visual encoder (CLIP ViT) is sensitive to camera placement changes, so camera positions should be fixed within each task environment; (2) temporal consistency -- observations should be captured at a steady 5 Hz with no dropped frames or timestamp irregularities; (3) action quality -- demonstrations should be smooth and successful, with jerky or failed episodes filtered out; and (4) multi-view support -- RoboFlamingo can process observations from multiple cameras (e.g., static overhead + gripper-mounted), which improves performance on fine manipulation tasks.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Data Integrates with RoboFlamingo",
      paragraphs: [
        "Claru provides VLM-compatible demonstration data for RoboFlamingo-style training pipelines. Our datasets include multi-frame RGB observation histories (6-12 frames per sample at 5 Hz), paired natural language task instructions with varied paraphrases, and continuous 7-DoF end-effector action labels. Every demonstration is captured from fixed camera positions with consistent lighting conditions, matching the stability requirements of CLIP ViT-based visual encoders.",
        "For teams building RoboFlamingo-style models for real-world tasks, Claru provides demonstrations from both static workspace cameras and gripper-mounted cameras, synchronized at 5 Hz. Our annotation team writes natural language instructions for each demonstration, with 3-5 paraphrases per task type to build the instruction diversity that improves Flamingo-backbone generalization. We also provide task chaining annotations for long-horizon evaluation: sequences of 3-5 subtasks that test the model's ability to complete multi-step manipulation plans.",
        "Claru's typical delivery for a RoboFlamingo project is 500-5,000 demonstrations across 10-30 task types, with multi-camera observations, diverse language annotations, and pre-defined evaluation sequences. We provide data in HDF5 or RLDS format with all fields the training pipeline expects: observation tensors, action vectors, language strings, episode boundaries, and camera calibration metadata. For teams evaluating on CALVIN-style benchmarks, we also provide task success classifiers trained on our data to enable automated evaluation.",
      ],
    },
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "li-roboflamingo-2023",
          title: "Vision-Language Foundation Models as Effective Robot Imitators",
          authors: "Li, X., Liu, M., Zhang, H., Yu, C., Xu, J., Wu, H., Cheang, C., Jing, Y., et al.",
          venue: "arXiv 2311.01378",
          year: 2023,
          url: "https://arxiv.org/abs/2311.01378",
        },
        {
          id: "alayrac-flamingo-2022",
          title: "Flamingo: a Visual Language Model for Few-Shot Learning",
          authors: "Alayrac, J.-B., Donahue, J., Luc, P., et al.",
          venue: "NeurIPS 2022 / arXiv 2204.14198",
          year: 2022,
          url: "https://arxiv.org/abs/2204.14198",
        },
        {
          id: "mees-calvin-2022",
          title: "CALVIN: A Benchmark for Language-Conditioned Policy Learning for Long-Horizon Robot Manipulation Tasks",
          authors: "Mees, O., Hermann, L., Rosete-Beas, E., Burgard, W.",
          venue: "IEEE RA-L 2022 / arXiv 2112.03227",
          year: 2022,
          url: "https://arxiv.org/abs/2112.03227",
        },
        {
          id: "brohan-rt2-2023",
          title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
          authors: "Brohan, A., Brown, N., Carbajal, J., et al.",
          venue: "CoRL 2023 / arXiv 2307.15818",
          year: 2023,
          url: "https://arxiv.org/abs/2307.15818",
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
          id: "radford-clip-2021",
          title: "Learning Transferable Visual Models From Natural Language Supervision",
          authors: "Radford, A., Kim, J. W., Hallacy, C., et al.",
          venue: "ICML 2021 / arXiv 2103.00020",
          year: 2021,
          url: "https://arxiv.org/abs/2103.00020",
        },
      ],
    },
  ],

  faqs: [
    {
      question: "How does RoboFlamingo differ from RT-2 and OpenVLA?",
      answer:
        "RoboFlamingo freezes (or partially freezes) the VLM backbone and only trains a small action head (~10M parameters), while RT-2 and OpenVLA fine-tune the entire model on robot data. This makes RoboFlamingo much cheaper to train and more data-efficient, but limits how much the visual representation can adapt to the robot domain. RoboFlamingo also uses a multi-frame observation history (6-12 frames) rather than single-frame input, giving it better temporal understanding. The tradeoff: RoboFlamingo is faster to iterate on and needs less data, but RT-2 and OpenVLA can achieve stronger performance when large robot datasets are available.",
    },
    {
      question: "What is the CALVIN benchmark and why does it matter for RoboFlamingo?",
      answer:
        "CALVIN (Composable and Language-Conditioned Visual Imitation Learning) is a simulated benchmark for long-horizon robot manipulation. It tests a policy's ability to complete sequences of 5 chained subtasks in a tabletop environment (e.g., 'open the drawer, then pick up the pink block, then place it on the table'). RoboFlamingo achieved 4.2 out of 5 chained tasks, which was state-of-the-art at publication. CALVIN matters because it tests both single-task manipulation and multi-task chaining -- a key capability for real-world deployment where robots must perform extended sequences of actions.",
    },
    {
      question: "How much data do I need to train a RoboFlamingo-style model?",
      answer:
        "With a frozen VLM backbone and only the action head trained, a few hundred demonstrations per task can produce strong results. The CALVIN evaluation used ~24,000 demonstrations across 34 tasks, but subsets achieved good performance. For real-world deployment with a partially unfrozen backbone (recommended: top 2-4 transformer layers), 200-1,000 demonstrations per task is a practical range. Multi-camera setups and diverse language instructions improve performance but are not strictly required.",
    },
    {
      question: "Can I use an open-source Flamingo model for RoboFlamingo?",
      answer:
        "Yes. The original Flamingo model from DeepMind is not publicly available, but several open-source replicas exist: OpenFlamingo (from LAION), Idefics/Idefics2 (from Hugging Face), and others. RoboFlamingo's architecture is compatible with any model that uses gated cross-attention to fuse visual and language tokens. OpenFlamingo 9B is the most commonly used open alternative. Claru delivers data compatible with all major Flamingo-style backbones.",
    },
    {
      question: "Does RoboFlamingo support multi-camera input?",
      answer:
        "Yes. RoboFlamingo can process observations from multiple cameras by treating each camera's frames as additional visual tokens in the cross-attention mechanism. The CALVIN benchmark uses a static camera and a gripper camera. For real-world deployment, adding a gripper or wrist camera improves performance on tasks requiring precise manipulation. Claru provides hardware-synchronized multi-camera data from both static and gripper-mounted cameras, formatted for Flamingo-style cross-attention processing.",
    },
  ],

  ctaHeading: "Get VLM-Compatible Data for RoboFlamingo",
  ctaDescription:
    "Tell us about your RoboFlamingo project -- target tasks, camera setup, and VLM backbone -- and we will deliver multi-frame demonstrations with diverse language annotations, continuous action labels, and evaluation sequences formatted for your training pipeline.",
  relatedGlossaryTerms: [
    "vla",
    "foundation-model-robotics",
    "imitation-learning",
    "vision-language-model",
  ],
  relatedGuidePages: [
    "how-to-create-action-labels-for-vla",
    "how-to-collect-teleoperation-data",
  ],
  relatedSolutionSlugs: ["vla-training-data"],

  modelName: "RoboFlamingo",
  organization: "ByteDance Research",
  year: 2023,
  inputSpec: {
    observationFormat:
      "RGB images (200x200 CALVIN / 224x224+ real-world) from static and gripper cameras; 6-12 frame observation history per prediction",
    actionFormat:
      "7-DoF continuous end-effector actions: 3D position delta + 3D orientation delta + binary gripper command",
    languageConditioning:
      "Natural language task instructions processed by Flamingo-style gated cross-attention language model",
    controlFrequency:
      "5 Hz (one action prediction per forward pass)",
  },

  dataVolumeBenchmarks:
    "RoboFlamingo was evaluated on the CALVIN long-horizon manipulation benchmark, which contains approximately 24,000 demonstrations across 34 tabletop manipulation task types in simulation. The model achieved state-of-the-art performance of 4.2 out of 5 chained subtasks. The Flamingo VLM backbone was pre-trained on web-scale image-text data (the same data used for Flamingo's visual question answering capabilities), providing strong visual and language understanding before any robot-specific fine-tuning. For the robot-specific component, only the action head (~10M parameters) and optionally the top 2-4 transformer layers are fine-tuned on robot demonstrations. The paper showed that strong performance was achievable with subsets of the full CALVIN dataset, suggesting that a few hundred demonstrations per task is sufficient when the VLM backbone provides strong visual features. For real-world deployment, 200-1,000 demonstrations per task with natural language instructions is recommended, with multi-camera setups (static + gripper camera) improving fine manipulation performance.",

  trainingRecipe:
    "RoboFlamingo training has two stages. Stage 1 (VLM pre-training, done by DeepMind or using open-source replicas): the Flamingo model is pre-trained on web-scale image-text data for visual question answering and image captioning. The visual encoder (CLIP ViT-L/14) learns to produce semantic visual features, and the language model learns gated cross-attention to selectively attend to visual information. Stage 2 (robot fine-tuning): the pre-trained Flamingo backbone is either fully frozen or partially unfrozen (top 2-4 transformer layers), and a lightweight MLP action head (~10M parameters, 2-3 layers) is added to predict 7-DoF continuous end-effector actions from the language model's final hidden state. The action head is trained with MSE loss on the action predictions. The observation history (6-12 recent frames) is fed through the frozen CLIP visual encoder, producing per-frame visual tokens that the language model attends to via cross-attention. Language instructions are tokenized and processed by the language model in the standard autoregressive fashion. Training on the CALVIN benchmark takes 10-20 hours on 4 A100 GPUs. The partially-unfrozen strategy (top 2-4 layers) outperforms both fully frozen and fully fine-tuned approaches on CALVIN.",

  claruIntegration:
    "Claru provides VLM-compatible demonstration data for RoboFlamingo-style training: multi-frame RGB observations from static and gripper cameras at 5 Hz, paired natural language instructions with 3-5 paraphrases per task type, and continuous 7-DoF action labels. We deliver data in HDF5 or RLDS format with observation history windows pre-constructed for direct ingestion into Flamingo cross-attention pipelines. For long-horizon evaluation, we provide task chaining sequences (3-5 subtasks per sequence) matching the CALVIN evaluation protocol. Our typical delivery is 500-5,000 demonstrations across 10-30 tasks with camera calibration metadata and automated success classifiers.",

  keyPapers: [
    {
      id: "li-roboflamingo-2023",
      title: "Vision-Language Foundation Models as Effective Robot Imitators",
      authors: "Li, X., Liu, M., Zhang, H., Yu, C., Xu, J., Wu, H., Cheang, C., Jing, Y., et al.",
      venue: "arXiv 2311.01378",
      year: 2023,
      url: "https://arxiv.org/abs/2311.01378",
    },
    {
      id: "alayrac-flamingo-2022",
      title: "Flamingo: a Visual Language Model for Few-Shot Learning",
      authors: "Alayrac, J.-B., Donahue, J., Luc, P., et al.",
      venue: "NeurIPS 2022 / arXiv 2204.14198",
      year: 2022,
      url: "https://arxiv.org/abs/2204.14198",
    },
    {
      id: "mees-calvin-2022",
      title: "CALVIN: A Benchmark for Language-Conditioned Policy Learning for Long-Horizon Robot Manipulation Tasks",
      authors: "Mees, O., Hermann, L., Rosete-Beas, E., Burgard, W.",
      venue: "IEEE RA-L 2022 / arXiv 2112.03227",
      year: 2022,
      url: "https://arxiv.org/abs/2112.03227",
    },
    {
      id: "brohan-rt2-2023",
      title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan, A., Brown, N., Carbajal, J., et al.",
      venue: "CoRL 2023 / arXiv 2307.15818",
      year: 2023,
      url: "https://arxiv.org/abs/2307.15818",
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
      id: "radford-clip-2021",
      title: "Learning Transferable Visual Models From Natural Language Supervision",
      authors: "Radford, A., Kim, J. W., Hallacy, C., et al.",
      venue: "ICML 2021 / arXiv 2103.00020",
      year: 2021,
      url: "https://arxiv.org/abs/2103.00020",
    },
  ],
};

export default data;
