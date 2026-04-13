import type { ModelPageData } from "../types";

const data: ModelPageData = {
  slug: "crossformer",
  metaTitle: "Training Data for CrossFormer — Formats, Volumes & Integration | Claru",
  metaDescription:
    "Deep-dive into CrossFormer: cross-embodiment transformer architecture, heterogeneous tokenization, OXE pretraining on 900K+ episodes, and how Claru provides CrossFormer-ready multi-robot data.",
  primaryKeyword: "CrossFormer training data",
  secondaryKeywords: [
    "CrossFormer cross-embodiment data",
    "CrossFormer robot policy",
    "cross-embodiment transformer training",
    "heterogeneous robot dataset",
    "multi-robot training data",
  ],
  canonicalPath: "/models/crossformer",
  h1: "Training Data for CrossFormer",
  heroSubtitle:
    "CrossFormer is a cross-embodiment transformer policy from UC Berkeley and CMU that handles heterogeneous observation and action spaces through embodiment-specific tokenization layers. Pretrained on 900K+ episodes from the Open X-Embodiment dataset spanning 20+ robot platforms, CrossFormer can be fine-tuned to new embodiments with as few as 50 demonstrations. This page details CrossFormer's data requirements and how Claru provides multi-platform demonstration data.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Models", href: "/models" },
    { label: "CrossFormer", href: "/models/crossformer" },
  ],

  // ── Sections ──────────────────────────────────────────────────────────
  sections: [
    // 1. What Is CrossFormer?
    {
      type: "prose",
      heading: "What Is CrossFormer?",
      paragraphs: [
        "CrossFormer is a cross-embodiment robot policy introduced by Doshi, Walke, Mees, Dasari, and Levine at UC Berkeley and Carnegie Mellon University in 2024. It addresses a fundamental challenge in generalist robot learning: different robots have different numbers of cameras, different action spaces (some use 6-DoF end-effector control, others use 7-DoF joint positions, others use 2-DoF base velocity), and different observation modalities. Prior approaches either forced all robots into a lowest-common-denominator representation (losing information) or trained separate models per embodiment (losing cross-embodiment transfer).",
        "CrossFormer's key innovation is a set of embodiment-specific tokenizer and detokenizer layers that sit between the robot's raw observation/action space and a shared transformer backbone. The tokenizer maps each robot's unique observations (variable numbers of camera views, proprioceptive dimensions, and language inputs) into a fixed set of tokens that the shared transformer can process. The detokenizer maps the transformer's output back into the robot's specific action space. The shared transformer learns manipulation knowledge that transfers across embodiments, while the tokenizer/detokenizer layers handle the embodiment-specific translation.",
        "CrossFormer was pretrained on a large subset of the Open X-Embodiment (OXE) dataset — approximately 900K episodes spanning over 20 robot platforms including WidowX 250, Franka Emika, Google Robot, ALOHA, xArm, UR5, and others. After pretraining, CrossFormer can be fine-tuned to a new embodiment using only 50-200 demonstrations, and the fine-tuned policy outperforms policies trained from scratch on the same target data.",
        "The model is open-source and builds on the Octo codebase, making it straightforward to integrate into existing OXE-compatible training pipelines. CrossFormer represents the current state of the art for cross-embodiment transfer in manipulation, outperforming both Octo and RT-2-X on several benchmark tasks when fine-tuned with limited target-embodiment data.",
      ],
    },

    // 2. Stats
    {
      type: "stats",
      heading: "CrossFormer at a Glance",
      stats: [
        { value: "900K+", label: "Pretraining episodes (OXE subset)" },
        { value: "20+", label: "Robot platforms in pretraining data" },
        { value: "50-200", label: "Demos for effective fine-tuning" },
        { value: "130M", label: "Approximate model parameters" },
        { value: "4-step", label: "Action chunk prediction horizon" },
        { value: "RLDS", label: "Primary data format" },
      ],
    },

    // 3. Input/Output Specification
    {
      type: "comparison-table",
      heading: "Input / Output Specification",
      columns: ["Parameter", "Specification"],
      rows: [
        { Parameter: "Image observations", Specification: "Variable: 1-4 camera views, resized to 224x224 RGB; tokenized by per-embodiment ViT encoder" },
        { Parameter: "Proprioceptive state", Specification: "Variable dimension per embodiment (e.g., 7-dim for WidowX, 14-dim for ALOHA); tokenized by learned linear projections" },
        { Parameter: "Action space", Specification: "Variable dimension per embodiment; detokenized from shared transformer output via per-embodiment MLP heads" },
        { Parameter: "Action chunks", Specification: "4-step action chunks predicted per forward pass" },
        { Parameter: "Language conditioning", Specification: "Natural language instructions encoded via T5-base; optional per embodiment" },
        { Parameter: "Control frequency", Specification: "Variable per embodiment (typically 2-50 Hz); handled by per-embodiment action scaling" },
        { Parameter: "Data format", Specification: "RLDS (TensorFlow Datasets) following OXE conventions" },
        { Parameter: "Supported embodiments", Specification: "Any embodiment with RGB images + continuous actions; new embodiments require training tokenizer/detokenizer" },
      ],
    },

    // 4. Architecture & Key Innovations
    {
      type: "prose",
      heading: "Architecture and Key Innovations",
      paragraphs: [
        "CrossFormer's architecture has three distinct components: embodiment-specific input tokenizers, a shared transformer backbone, and embodiment-specific action detokenizers. During both pretraining and fine-tuning, only the tokenizers and detokenizers for the active embodiment(s) are updated alongside the shared backbone. When fine-tuning on a new embodiment, new tokenizer and detokenizer layers are initialized while the shared backbone is loaded from the pretrained checkpoint.",
        "The input tokenizer for each embodiment consists of a ViT-S/16 image encoder (one per camera view), a linear projection for proprioceptive state, and the shared T5-base language encoder. Each tokenizer maps its inputs into a fixed number of tokens (typically 16-64 tokens per observation) with the same embedding dimension as the shared transformer (768-dim). This fixed-size token representation is what enables heterogeneous inputs to be processed by the same transformer.",
        "The shared transformer backbone is a standard decoder-only transformer with 12 layers, 12 attention heads, and 768-dim hidden states. It processes sequences of observation tokens with causal attention and outputs a set of action tokens. The action tokens are passed to the embodiment-specific detokenizer, which is a small MLP (2 layers, 256 hidden units) that maps the transformer's output to the target action dimension and applies per-embodiment action scaling.",
        "A critical design choice is the action chunk prediction with a diffusion head, inherited from Octo. Rather than predicting a single action, CrossFormer predicts 4-step action chunks using DDPM denoising with 10 diffusion steps. This provides temporal consistency and handles multi-modal action distributions. The diffusion head operates in the detokenizer space, so it is embodiment-specific.",
        "CrossFormer's pretraining uses a dataset mixture strategy that upweights high-quality datasets. BridgeData V2 and DROID receive higher sampling weights than smaller or lower-quality datasets. The mixture is balanced so that each embodiment contributes roughly proportionally to the gradient signal, preventing the largest datasets from dominating. This balancing is critical — without it, the shared backbone overfits to the distribution of the largest embodiment and transfers poorly to smaller ones.",
      ],
    },

    // 5. Comparison with Related Models
    {
      type: "comparison-table",
      heading: "Comparison with Related Cross-Embodiment Models",
      columns: ["Attribute", "CrossFormer", "Octo", "RT-2-X", "HPT"],
      rows: [
        { Attribute: "Cross-embodiment mechanism", "CrossFormer": "Per-embodiment tokenizers + shared trunk", "Octo": "Task-specific adapters + shared trunk", "RT-2-X": "Unified action tokenization", "HPT": "Heterogeneous pre-training with stem/trunk/head" },
        { Attribute: "Pretraining data", "CrossFormer": "900K+ OXE episodes", "Octo": "800K+ OXE episodes", "RT-2-X": "~1M mixed-embodiment", "HPT": "200K+ multi-embodiment" },
        { Attribute: "Open-source", "CrossFormer": "Yes", "Octo": "Yes", "RT-2-X": "No", "HPT": "Yes" },
        { Attribute: "Fine-tuning data needed", "CrossFormer": "50-200 demonstrations", "Octo": "25-200 demonstrations", "RT-2-X": "100+ demonstrations", "HPT": "50-200 demonstrations" },
        { Attribute: "Action representation", "CrossFormer": "Diffusion, 4-step chunks", "Octo": "Diffusion, 4-step chunks", "RT-2-X": "Discretized tokens", "HPT": "Continuous, variable dim" },
        { Attribute: "New embodiment support", "CrossFormer": "Train new tokenizer/detokenizer only", "Octo": "New adapter heads", "RT-2-X": "Requires retraining", "HPT": "New stem/head modules" },
      ],
    },

    // 6. Training Data Requirements
    {
      type: "prose",
      heading: "Training Data Requirements",
      paragraphs: [
        "CrossFormer's data requirements depend on whether you are contributing to pretraining, fine-tuning an existing CrossFormer checkpoint, or training tokenizer/detokenizer layers for a new embodiment. Each scenario has different volume and format requirements.",
        "For pretraining contributions, data must be in RLDS format following OXE conventions. Each episode needs: RGB images from one or more cameras (resized to 256x256 before augmentation crops to 224x224), proprioceptive state as a float vector, continuous actions in the robot's native control space, and optionally a natural language instruction. The RLDS metadata must specify the embodiment name, action dimension, proprioceptive dimension, and number of camera views. The OXE dataset builder template provides the required schema.",
        "For fine-tuning CrossFormer to a new task on an already-supported embodiment (e.g., WidowX 250, Franka Emika), you need 50-200 demonstrations of the target task in RLDS format. The Doshi et al. paper shows that 100 demonstrations on a WidowX 250 achieve within 5% of the performance of 500 demonstrations when starting from the CrossFormer pretrained checkpoint. This is 2-3x more sample-efficient than Octo fine-tuning on the same tasks.",
        "For adding a new embodiment not seen during pretraining, you need to train new tokenizer and detokenizer layers. This requires 200-1,000 demonstrations on the new embodiment, covering a variety of tasks (not just the target task). The more diverse the training tasks, the better the tokenizer/detokenizer layers learn to represent the new embodiment's observation and action space. Doshi et al. recommend at least 5 distinct tasks for tokenizer training.",
        "Data quality considerations mirror those of Octo and BridgeData V2: demonstrations should be successful completions of the intended task, with consistent camera viewpoints within an embodiment, and actions in continuous control space (not discretized). Action normalization to zero-mean, unit-variance per dimension is handled by the training pipeline but requires accurate dataset statistics. Language instructions, if present, should use simple imperative sentences that match the style of the OXE pretraining data.",
      ],
    },

    // 7. How Claru Data Integrates
    {
      type: "prose",
      heading: "How Claru Data Integrates with CrossFormer",
      paragraphs: [
        "Claru provides cross-embodiment demonstration data from multiple robot platforms, delivered in RLDS format with the OXE-standard metadata that CrossFormer requires. Our current collection capabilities span WidowX 250, Franka Emika, Universal Robots UR5e, and ALOHA bimanual configurations — covering the most common embodiments in the CrossFormer pretraining distribution.",
        "For teams fine-tuning CrossFormer on a supported embodiment, we deliver targeted task-specific datasets of 100-500 demonstrations per task. Each dataset includes the correct RLDS feature specification, per-embodiment action normalization statistics, and language annotations. We match the camera configurations, image resolutions, and control frequencies of the pretraining data for the target embodiment to minimize distributional shift.",
        "For teams onboarding a new embodiment to CrossFormer, we collect the diverse multi-task demonstration corpus (200-1,000 episodes across 5+ tasks) needed to train effective tokenizer/detokenizer layers. We work with your team to define the task distribution and ensure sufficient coverage of the embodiment's workspace and manipulation capabilities.",
        "Our quality pipeline validates cross-embodiment data compatibility: action dimensions match the declared embodiment specification, image resolutions are consistent within each embodiment, proprioceptive state vectors have the correct dimension and value ranges, and language annotations follow OXE conventions. This validation prevents silent data corruption that could degrade the shared transformer backbone during co-training.",
      ],
    },

    // 8. Key References
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "doshi-crossformer-2024",
          title: "Scaling Cross-Embodied Learning: One Policy for Manipulation across Robots with Different Observations and Action Spaces",
          authors: "Doshi et al.",
          venue: "CoRL 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2408.11812",
        },
        {
          id: "team-octo-2024",
          title: "Octo: An Open-Source Generalist Robot Policy",
          authors: "Octo Model Team",
          venue: "RSS 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2405.12213",
        },
        {
          id: "open-x-embodiment-2024",
          title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
          authors: "Open X-Embodiment Collaboration",
          venue: "ICRA 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2310.08864",
        },
        {
          id: "liang-hpt-2024",
          title: "HPT: Scaling Heterogeneous Pre-Training for Robot Manipulation",
          authors: "Liang et al.",
          venue: "arXiv 2409.20537",
          year: 2024,
          url: "https://arxiv.org/abs/2409.20537",
        },
        {
          id: "walke-bridgedata-v2-2023",
          title: "BridgeData V2: A Dataset for Robot Learning at Scale",
          authors: "Walke et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2308.12952",
        },
      ],
    },
  ],

  // ── FAQs ──────────────────────────────────────────────────────────────
  faqs: [
    {
      question: "How does CrossFormer handle robots with different numbers of cameras and action dimensions?",
      answer:
        "CrossFormer uses per-embodiment tokenizer and detokenizer layers. Each embodiment's tokenizer maps its specific observation configuration (e.g., 1 camera + 7-dim proprioception for WidowX, or 4 cameras + 14-dim proprioception for ALOHA) into a fixed-size set of tokens. The shared transformer processes these tokens identically regardless of source embodiment. The detokenizer then maps transformer outputs back to the embodiment's specific action dimension. New embodiments require training new tokenizer/detokenizer layers, which takes 200-1,000 demonstrations.",
    },
    {
      question: "What advantage does CrossFormer have over just training separate per-robot policies?",
      answer:
        "CrossFormer's shared transformer backbone encodes manipulation knowledge that transfers across embodiments — things like how to approach an object, when to close a gripper, and how to handle visual occlusion. This means a new embodiment can leverage 900K+ episodes of cross-embodiment experience through the pretrained backbone, even though none of that data was collected on the target robot. In practice, this yields 15-30% higher success rates when fine-tuning with 50-200 demonstrations, compared to training from scratch on the same data.",
    },
    {
      question: "Can I use CrossFormer with a robot that was not in the original pretraining set?",
      answer:
        "Yes, that is one of CrossFormer's primary design goals. You need to train new tokenizer and detokenizer layers for your embodiment, which requires 200-1,000 demonstrations across at least 5 different tasks. The shared transformer backbone is initialized from the pretrained checkpoint and fine-tuned alongside the new layers. This typically takes 4-8 hours on a single GPU and achieves significantly better performance than training from scratch.",
    },
    {
      question: "What is the difference between CrossFormer and Octo for cross-embodiment transfer?",
      answer:
        "Octo uses task-specific adapter heads that map to predefined action space categories (e.g., EE delta, joint position). CrossFormer replaces this with embodiment-specific tokenizer/detokenizer pairs that can handle any continuous action space without predefined categories. CrossFormer also uses a different pretraining mixture strategy that better balances across embodiments. On benchmark tasks, CrossFormer achieves 5-15% higher success rates than Octo when fine-tuning with limited data (50-200 demonstrations).",
    },
    {
      question: "What data format does CrossFormer require and how does it differ from Octo's format?",
      answer:
        "CrossFormer uses the same RLDS (TensorFlow Datasets) format as Octo, following OXE conventions. The main difference is in metadata: CrossFormer datasets must specify the embodiment name (used to route to the correct tokenizer/detokenizer), action dimension, proprioceptive dimension, and camera view count. If your data is already in OXE-compatible RLDS format, it works with CrossFormer with minimal modification — you just need to ensure the embodiment metadata is correctly specified.",
    },
  ],

  // ── CTA ────────────────────────────────────────────────────────────────
  ctaHeading: "Get Multi-Robot Training Data for CrossFormer",
  ctaDescription:
    "Tell us about your robot platform and target tasks. We collect cross-embodiment demonstrations in RLDS format, ready for CrossFormer fine-tuning or new-embodiment onboarding.",

  // ── Cross-links ────────────────────────────────────────────────────────
  relatedGlossaryTerms: [
    "cross-embodiment",
    "vla",
    "foundation-model-robotics",
    "imitation-learning",
    "rlds",
  ],
  relatedGuidePages: [
    "how-to-create-action-labels-for-vla",
    "how-to-collect-teleoperation-data",
  ],
  relatedSolutionSlugs: ["teleoperation-data"],

  // ── Model metadata ────────────────────────────────────────────────────
  modelName: "CrossFormer",
  organization: "UC Berkeley / CMU",
  year: 2024,

  inputSpec: {
    observationFormat:
      "Variable: 1-4 camera views at 224x224 RGB + variable-dim proprioceptive state, per embodiment",
    actionFormat:
      "Variable continuous action dimensions per embodiment, predicted as 4-step diffusion action chunks",
    languageConditioning:
      "Natural language instructions via T5-base encoder (optional per embodiment)",
    controlFrequency:
      "Variable per embodiment (2-50 Hz); action scaling handled by per-embodiment detokenizer",
  },

  dataVolumeBenchmarks:
    "CrossFormer was pretrained on approximately 900K episodes from the Open X-Embodiment dataset, spanning over 20 robot embodiments. The pretraining mixture is carefully balanced across embodiments to prevent the largest datasets (BridgeData V2 at 60K episodes, RT-1 at 130K episodes) from dominating the gradient signal. For fine-tuning on a supported embodiment, 50-200 demonstrations achieve strong performance — the paper demonstrates that 100 demonstrations on WidowX 250 tasks yield success rates within 5% of those achieved with 500 demonstrations. For new embodiment onboarding, 200-1,000 demonstrations across 5+ tasks are recommended to train effective tokenizer/detokenizer layers. The total pretraining dataset is approximately 400 GB in RLDS format. Pretraining from scratch takes approximately 72 hours on 8 TPU v3 chips, while fine-tuning on a new task takes 2-4 hours on a single A100 GPU.",

  trainingRecipe:
    "CrossFormer pretraining follows the Octo recipe with key modifications for cross-embodiment balancing. The shared transformer backbone (12 layers, 12 heads, 768-dim) is trained alongside all embodiment-specific tokenizers and detokenizers simultaneously. The training uses AdamW optimizer with cosine learning rate schedule (peak 3e-4, 2K warmup steps) and batch size 256 distributed across 8 TPU v3 chips. Each batch is assembled by sampling proportionally across embodiments using a temperature-based weighting that upweights under-represented embodiments. The diffusion action head uses 10 DDPM denoising steps during training and inference, predicting 4-step action chunks. Data augmentation includes random crops (224x224 from 256x256 source images), color jitter, and random horizontal flips with corresponding action mirroring. Pretraining runs for 300K gradient steps (~72 hours). For fine-tuning, new tokenizer/detokenizer layers are randomly initialized while the shared backbone is loaded from the pretrained checkpoint. Fine-tuning uses a lower learning rate (3e-5) for the backbone and higher rate (3e-4) for the new layers, running 20K-50K steps.",

  claruIntegration:
    "Claru provides cross-embodiment demonstration data from multiple robot platforms in RLDS format with OXE-standard metadata. Our collection spans WidowX 250, Franka Emika, UR5e, and ALOHA configurations, covering the most common embodiments in CrossFormer's pretraining distribution. For fine-tuning on supported embodiments, we deliver 100-500 demonstrations per task with matched camera configurations, image resolutions, and control frequencies. For new embodiment onboarding, we collect the diverse multi-task corpus (200-1,000 episodes across 5+ tasks) needed to train effective tokenizer/detokenizer layers. All data includes per-embodiment action normalization statistics and validated RLDS metadata specifying embodiment name, action dimension, and camera configuration.",

  keyPapers: [
    {
      id: "doshi-crossformer-2024",
      title: "Scaling Cross-Embodied Learning: One Policy for Manipulation across Robots with Different Observations and Action Spaces",
      authors: "Doshi et al.",
      venue: "CoRL 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2408.11812",
    },
    {
      id: "team-octo-2024",
      title: "Octo: An Open-Source Generalist Robot Policy",
      authors: "Octo Model Team",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2405.12213",
    },
    {
      id: "open-x-embodiment-2024",
      title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Open X-Embodiment Collaboration",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864",
    },
    {
      id: "liang-hpt-2024",
      title: "HPT: Scaling Heterogeneous Pre-Training for Robot Manipulation",
      authors: "Liang et al.",
      venue: "arXiv 2409.20537",
      year: 2024,
      url: "https://arxiv.org/abs/2409.20537",
    },
    {
      id: "walke-bridgedata-v2-2023",
      title: "BridgeData V2: A Dataset for Robot Learning at Scale",
      authors: "Walke et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2308.12952",
    },
  ],
};

export default data;
