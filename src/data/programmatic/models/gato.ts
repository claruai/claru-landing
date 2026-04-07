import type { ModelPageData } from "../types";

const data: ModelPageData = {
  slug: "gato",
  metaTitle: "Training Data for Gato — Formats, Volumes & Integration | Claru",
  metaDescription:
    "Deep-dive into DeepMind's Gato: generalist agent architecture, unified tokenization across 604 tasks, robotics data requirements, and how Claru provides Gato-compatible demonstration data.",
  primaryKeyword: "Gato training data",
  secondaryKeywords: [
    "Gato DeepMind robot data",
    "Gato generalist agent training",
    "multi-task robot policy data",
    "Gato tokenized actions",
    "generalist robot model data requirements",
  ],
  canonicalPath: "/models/gato",
  h1: "Training Data for Gato",
  heroSubtitle:
    "Gato is DeepMind's generalist agent — a single 1.2B-parameter transformer trained on 604 distinct tasks spanning Atari games, image captioning, text dialogue, and real-world robot manipulation. By tokenizing all modalities into a unified sequence format, Gato demonstrated that a single set of neural network weights can perform both digital and physical tasks. This page covers Gato's robotics data specification, tokenization scheme, and how Claru provides compatible demonstration data.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Models", href: "/models" },
    { label: "Gato", href: "/models/gato" },
  ],

  // ── Sections ──────────────────────────────────────────────────────────
  sections: [
    // 1. What Is Gato?
    {
      type: "prose",
      heading: "What Is Gato?",
      paragraphs: [
        "Gato is a generalist agent published by Scott Reed, Konrad Zolna, Emilio Parisotto, and colleagues at DeepMind in May 2022. The paper's central thesis is provocative: rather than building specialist models for each task, a single large transformer can learn to play Atari games, caption images, chat, stack blocks with a real robot arm, and navigate in simulated environments — all with the same weights. Gato achieved this by converting every modality (text, images, continuous actions, discrete actions, proprioceptive states) into a common token sequence and training with a standard autoregressive language modeling objective.",
        "The robotics component of Gato is what makes it relevant to the physical AI community. Gato was trained on real-world robot manipulation data from a Sawyer robot arm performing block stacking tasks, as well as simulated robot data from DM Control Suite locomotion tasks and RGB Stacking benchmarks. On the real Sawyer stacking task, Gato achieved 87% success averaged across 1-5 block configurations — competitive with specialist policies trained exclusively on stacking data.",
        "Gato was a proof-of-concept rather than a production-ready robotics model. With 1.2 billion parameters, it is smaller than most modern VLAs (OpenVLA has 7B, RT-2 has 55B). Its robotics performance, while impressive for a generalist, falls short of specialist models on difficult manipulation tasks. The real significance of Gato is architectural: it demonstrated that the unified tokenization paradigm works for physical control, directly inspiring the VLA (Vision-Language-Action) model family that followed — including RT-2, Octo, and OpenVLA.",
        "Understanding Gato's data requirements is relevant for two audiences: teams building on Gato-style multi-task architectures (unified tokenization of diverse modalities), and teams interested in how multi-task pretraining on non-robotics data (games, text, images) can improve robotics policy performance. The data pipeline for Gato-style models is fundamentally different from specialist models like ACT or Diffusion Policy — it requires tokenization of continuous values and interleaving of heterogeneous episode formats.",
      ],
    },

    // 2. Stats
    {
      type: "stats",
      heading: "Gato at a Glance",
      stats: [
        { value: "1.2B", label: "Model parameters" },
        { value: "604", label: "Distinct tasks in training data" },
        { value: "1024", label: "Vocabulary size (tokenized actions/observations)" },
        { value: "87%", label: "Success on real Sawyer block stacking" },
        { value: "8K", label: "Sequence length (tokens)" },
        { value: "~600", label: "Robotics episodes (real Sawyer stacking)" },
      ],
    },

    // 3. Input/Output Specification
    {
      type: "comparison-table",
      heading: "Input / Output Specification (Robotics Component)",
      columns: ["Parameter", "Specification"],
      rows: [
        { Parameter: "Image observations", Specification: "RGB images tokenized into 16x16 patches via ResNet encoder, then discretized to 1024-vocab tokens" },
        { Parameter: "Proprioceptive state", Specification: "Continuous joint positions/velocities, mu-law encoded and discretized to 1024 bins" },
        { Parameter: "Action space", Specification: "Continuous joint velocity commands, mu-law encoded and discretized to 1024 bins per dimension" },
        { Parameter: "Tokenization scheme", Specification: "All modalities converted to integer tokens in [0, 1023]; separator tokens delineate modality boundaries" },
        { Parameter: "Sequence format", Specification: "Interleaved: [image tokens | proprioception tokens | action tokens | separator] per timestep" },
        { Parameter: "Control frequency", Specification: "Variable per environment; ~5-20 Hz for robotics tasks" },
        { Parameter: "Episode context length", Specification: "Up to 8,192 tokens (~20-50 timesteps depending on observation size)" },
        { Parameter: "Robot platforms", Specification: "Rethink Sawyer (real block stacking), DM Control Suite (simulated locomotion), RGB Stacking (simulated)" },
      ],
    },

    // 4. Architecture & Key Innovations
    {
      type: "prose",
      heading: "Architecture and Key Innovations",
      paragraphs: [
        "Gato's architecture is a decoder-only transformer with 24 layers, 16 attention heads, and a hidden dimension of 2048 — the same fundamental architecture as GPT-2/GPT-3. The key innovation is not in the transformer itself but in the tokenization pipeline that converts heterogeneous data into a unified token vocabulary.",
        "For images, Gato uses a ResNet block to encode each image into a sequence of embedding vectors (one per 16x16 patch), which are then projected into the transformer's embedding space. Unlike language tokens, image tokens retain spatial structure through position embeddings. For the robotics tasks, observations typically include one RGB image from a workspace camera.",
        "For continuous values (joint positions, joint velocities, end-effector positions, force readings), Gato applies mu-law encoding to compress the dynamic range, then uniformly discretizes the result into 1024 bins. Each continuous dimension becomes a single integer token in [0, 1023]. A 7-DoF joint position reading thus becomes 7 tokens. This discretization introduces quantization error — with 1024 bins over a typical joint range of [-pi, pi], the resolution is approximately 0.006 radians (0.35 degrees), which is sufficient for most manipulation tasks but may limit precision on high-accuracy assembly.",
        "The training objective is standard autoregressive next-token prediction. At each position in the sequence, the model predicts the next token given all preceding tokens. For action tokens, this means the model predicts the discretized action given the observation and all preceding actions in the episode. For image tokens, the model predicts the next image patch token. The same cross-entropy loss applies to all token types, with masking applied to image tokens during robotics training (the model is not required to predict images, only actions).",
        "Multi-task learning is handled through prompting: each episode begins with a task-identifying prefix sequence. For robotics tasks, this prefix implicitly identifies the robot embodiment and task through the structure of the observation tokens. The model learns to associate different token patterns with different behavioral policies. At inference time, the model conditions on the task prefix and the current observation tokens, then autoregressively generates action tokens.",
      ],
    },

    // 5. Comparison with Related Models
    {
      type: "comparison-table",
      heading: "Comparison with Related Generalist Models",
      columns: ["Attribute", "Gato", "RT-2", "Octo", "OpenVLA"],
      rows: [
        { Attribute: "Parameters", "Gato": "1.2B", "RT-2": "55B (PaLI-X)", "Octo": "93M", "OpenVLA": "7B (Prismatic)" },
        { Attribute: "Non-robotics pretraining", "Gato": "Yes (Atari, text, images)", "RT-2": "Yes (web-scale VLM)", "Octo": "No (robot-only)", "OpenVLA": "Yes (VLM backbone)" },
        { Attribute: "Action representation", "Gato": "Discretized tokens (1024 bins)", "RT-2": "Discretized tokens (256 bins)", "Octo": "Continuous (diffusion)", "OpenVLA": "Discretized tokens (256 bins)" },
        { Attribute: "Language conditioning", "Gato": "Text tokens in same vocabulary", "RT-2": "Natural language via VLM", "Octo": "T5 encoder (optional)", "OpenVLA": "Natural language via VLM" },
        { Attribute: "Real robot tasks trained", "Gato": "Block stacking (Sawyer)", "RT-2": "700+ skills (Everyday Robot)", "Octo": "BridgeData V2 + OXE", "OpenVLA": "970K episodes (OXE)" },
        { Attribute: "Open-source", "Gato": "No", "RT-2": "No", "Octo": "Yes", "OpenVLA": "Yes" },
        { Attribute: "Year", "Gato": "2022", "RT-2": "2023", "Octo": "2024", "OpenVLA": "2024" },
      ],
    },

    // 6. Training Data Requirements
    {
      type: "prose",
      heading: "Training Data Requirements",
      paragraphs: [
        "Gato's training data spans a remarkable breadth of domains. The full training set includes: 604 Atari games with ~200M frames of gameplay, MassiveText corpus for language tasks, image-caption pairs from ALIGN and JFT datasets, DM Control Suite simulated locomotion (23 tasks), DM Lab navigation tasks, simulated RGB Stacking tasks, and real-world Sawyer block stacking demonstrations. The robotics component is a small fraction of the total data volume — approximately 600 real Sawyer episodes and tens of thousands of simulated episodes.",
        "For teams building Gato-style architectures, the robotics data must be tokenized following the specific scheme: continuous values are mu-law encoded (mu=100), then uniformly quantized to 1024 integer bins. Each observation-action timestep is serialized as a token sequence: [image patch tokens (typically 256-1024 tokens depending on resolution) | proprioception tokens (7-14 tokens for joint positions/velocities) | action tokens (7 tokens for a 7-DoF arm) | separator token]. Episodes are packed into sequences of up to 8,192 tokens.",
        "The mu-law encoding is critical and often overlooked. Standard uniform discretization of continuous values performs poorly because the distribution of joint values and velocities is not uniform — values cluster near rest positions. Mu-law encoding (with mu=100) compresses the dynamic range so that small values near zero get more bins and large values get fewer bins, matching the empirical distribution. The formula is: encoded = sign(x) * ln(1 + mu * |x|) / ln(1 + mu), then uniformly discretized to [0, 1023].",
        "For real-world robot demonstrations specifically, the Gato paper used data from a Sawyer robot performing block stacking with 1-5 blocks. Each episode contains approximately 100-300 timesteps of RGB images at 64x64 resolution, 7-dim joint positions, 7-dim joint velocities, and 7-dim joint velocity commands as actions. The total real-world robotics dataset is modest — approximately 600 episodes — but the massive non-robotics pretraining data provides a strong prior for visual understanding and sequential decision-making.",
        "Data quality for Gato-style training differs from specialist models. Because the model trains on 604 tasks simultaneously, the gradient signal from any single robotics task is diluted. This means the model is less sensitive to individual bad demonstrations but requires that the overall task distribution be well-represented. For robotics fine-tuning or evaluation, the tokenization must exactly match the pretraining scheme — different mu-law parameters or bin counts will produce meaningless tokens that the model cannot interpret.",
      ],
    },

    // 7. How Claru Data Integrates
    {
      type: "prose",
      heading: "How Claru Data Integrates with Gato-Style Architectures",
      paragraphs: [
        "Claru provides robot demonstration data pre-tokenized for Gato-style multi-modal transformer architectures. Our pipeline handles the full tokenization chain: mu-law encoding of continuous values with configurable mu parameter (default 100), uniform discretization to the target vocabulary size (1024 bins by default), image patch tokenization via a provided ResNet encoder, and sequence assembly with correct separator tokens and modality ordering.",
        "For teams fine-tuning or evaluating on Gato-style models, we deliver data in the exact serialized token format the model expects — packed sequences of up to 8,192 tokens with correct episode boundaries. Each delivery includes the tokenization configuration (mu parameter, bin count, image resolution, patch size) and a detokenization script for inspecting the data in human-readable form.",
        "For teams building new Gato-inspired architectures (which is the more common use case in 2024-2026, given that Gato itself is not open-source), we deliver raw demonstration data alongside the tokenized version. The raw data includes RGB images at configurable resolution, continuous joint positions/velocities, continuous actions, and episode metadata. This allows teams to experiment with different tokenization schemes — varying the vocabulary size, mu parameter, or switching to learned tokenization (as in recent VQ-VAE approaches) — without re-collecting demonstrations.",
        "Our collection covers the manipulation tasks most commonly used in Gato-style benchmarks: block stacking (1-5 blocks), pick-and-place with diverse objects, and tabletop rearrangement. We collect on multiple robot platforms (WidowX 250, Franka Emika, UR5e) to support cross-embodiment training. Each delivery includes task-identifying metadata that can serve as the episode prefix tokens for multi-task training.",
      ],
    },

    // 8. Key References
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "reed-gato-2022",
          title: "A Generalist Agent",
          authors: "Reed et al.",
          venue: "TMLR 2022",
          year: 2022,
          url: "https://arxiv.org/abs/2205.06175",
        },
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
          id: "team-octo-2024",
          title: "Octo: An Open-Source Generalist Robot Policy",
          authors: "Octo Model Team",
          venue: "RSS 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2405.12213",
        },
        {
          id: "lee-multimodal-2022",
          title: "Multi-Game Decision Transformers",
          authors: "Lee et al.",
          venue: "NeurIPS 2022",
          year: 2022,
          url: "https://arxiv.org/abs/2205.15241",
        },
      ],
    },
  ],

  // ── FAQs ──────────────────────────────────────────────────────────────
  faqs: [
    {
      question: "Is Gato open-source and can I train my own version?",
      answer:
        "No, Gato is not open-source. DeepMind published the architecture and training details but did not release the model weights, training code, or full dataset. However, the architecture is a standard decoder-only transformer, and the tokenization scheme is fully described in the paper. Several open-source reimplementations exist. For practical deployment, most teams now use Octo or OpenVLA, which are open-source and offer better robotics performance than Gato.",
    },
    {
      question: "How does Gato's action discretization affect manipulation precision?",
      answer:
        "Gato discretizes continuous actions into 1024 bins per dimension using mu-law encoding. For a typical joint range of [-pi, pi], this gives approximately 0.006 radian (0.35 degree) resolution. For most manipulation tasks (pick-and-place, stacking, pushing), this resolution is sufficient. For precision assembly tasks requiring sub-millimeter accuracy (peg insertion, connector mating), the quantization error may be limiting. RT-2 and OpenVLA use only 256 bins, which is coarser but still works for most tasks.",
    },
    {
      question: "Does non-robotics pretraining data (Atari, text, images) actually help robotics performance?",
      answer:
        "The evidence is mixed. Gato showed that a single model can do both, but did not ablate whether Atari/text pretraining improves robotics performance versus robotics-only training. RT-2 showed clear evidence that VLM pretraining on web data improves language-conditioned manipulation. The current consensus is that visual and language pretraining helps (through better perception and instruction following), but game-playing pretraining likely does not transfer to real-world manipulation.",
    },
    {
      question: "How many real robot demonstrations did Gato use, and is that enough?",
      answer:
        "Gato used approximately 600 real Sawyer block stacking demonstrations, supplemented by tens of thousands of simulated episodes. This is a very small number by modern standards — BridgeData V2 has 60K episodes, RT-1 used 130K. The key insight is that Gato's multi-task pretraining provides a strong sequential decision-making prior, so fewer robotics-specific demonstrations are needed. For building a Gato-style system today, 500-5,000 real demonstrations per task type is a reasonable starting point.",
    },
    {
      question: "What is the difference between Gato's approach and modern VLA models like RT-2 or OpenVLA?",
      answer:
        "Gato was the pioneer of the 'tokenize everything into one sequence' paradigm, but modern VLAs have refined it significantly. RT-2 and OpenVLA use pretrained vision-language model backbones (PaLI-X, Prismatic) that provide much stronger visual and language understanding than training from scratch. They use dedicated action tokenization schemes rather than treating actions the same as text. And they train on orders of magnitude more robotics data. Gato proved the concept; VLAs made it practical.",
    },
  ],

  // ── CTA ────────────────────────────────────────────────────────────────
  ctaHeading: "Get Tokenized Robot Demonstration Data",
  ctaDescription:
    "Tell us about your multi-modal transformer architecture. We deliver robot demonstrations pre-tokenized for Gato-style models or as raw continuous data for custom tokenization pipelines.",

  // ── Cross-links ────────────────────────────────────────────────────────
  relatedGlossaryTerms: [
    "vla",
    "foundation-model-robotics",
    "imitation-learning",
    "generalist-agent",
    "action-tokenization",
  ],
  relatedGuidePages: [
    "how-to-create-action-labels-for-vla",
    "how-to-collect-teleoperation-data",
  ],
  relatedSolutionSlugs: ["teleoperation-data"],

  // ── Model metadata ────────────────────────────────────────────────────
  modelName: "Gato",
  organization: "Google DeepMind",
  year: 2022,

  inputSpec: {
    observationFormat:
      "RGB images tokenized into 16x16 patches via ResNet encoder + continuous proprioceptive state mu-law encoded to 1024 bins",
    actionFormat:
      "Continuous joint velocity commands, mu-law encoded and discretized to 1024 integer tokens per dimension",
    languageConditioning:
      "Text-based task conditioning via same token vocabulary (text tokens interleaved with observation/action tokens)",
    controlFrequency:
      "Variable per environment: ~5-20 Hz for robotics tasks, up to 60 Hz for Atari games",
  },

  dataVolumeBenchmarks:
    "Gato was trained on data from 604 distinct tasks. The full training corpus includes approximately 200 million Atari frames across 604 games, millions of text tokens from MassiveText, billions of image-caption tokens from ALIGN/JFT, and comparatively modest robotics data: approximately 600 real Sawyer block stacking episodes plus tens of thousands of simulated DM Control Suite and RGB Stacking episodes. The robotics episodes contain 100-300 timesteps each at 64x64 image resolution. Despite the small robotics data volume, Gato achieved 87% success on 1-5 block stacking with the real Sawyer, suggesting strong transfer from non-robotics pretraining. On simulated locomotion (DM Control Suite), Gato matched or exceeded specialist policies on 14 of 23 tasks. The total training dataset exceeds 10TB when including all modalities. Training ran for approximately 4 days on 256 TPU v3 chips. For teams building similar multi-task architectures, the paper suggests that robotics performance scales with both the amount of robotics-specific data and the diversity of non-robotics pretraining data.",

  trainingRecipe:
    "Gato uses a standard autoregressive transformer (24 layers, 16 heads, 2048 hidden dim, 1.2B parameters) trained with next-token prediction. All modalities are tokenized into a shared vocabulary: text as SentencePiece tokens (32K vocabulary), images as ResNet-encoded patch embeddings (no discretization — these are continuous embeddings), and continuous values (proprioception, actions) as mu-law encoded integers in [0, 1023]. Episodes from all 604 tasks are interleaved during training with sampling weights proportional to the inverse of each task's dataset size (smaller datasets are upsampled). The context window is 8,192 tokens. Training uses AdamW with linear warmup (10K steps) to peak learning rate 1e-4, then cosine decay. Batch size is 512 sequences distributed across 256 TPU v3 chips. Training runs for 1M steps (~4 days). For the robotics tasks specifically, action tokens are predicted with cross-entropy loss, while image token loss is masked (the model does not need to reconstruct images). Dropout of 0.1 is applied throughout. No data augmentation is used for robotics episodes; Atari frames use standard random crop and color jitter. Evaluation uses greedy decoding (argmax) for action tokens rather than sampling.",

  claruIntegration:
    "Claru provides robot demonstration data pre-tokenized for Gato-style multi-modal transformer architectures. Our pipeline handles mu-law encoding (configurable mu parameter, default 100), uniform discretization to target vocabulary size (1024 bins by default), image patch tokenization, and sequence assembly with correct separator tokens and modality ordering. For teams building new architectures, we also deliver raw continuous data alongside tokenized versions, enabling experimentation with different tokenization schemes. Our collection covers block stacking, pick-and-place, and tabletop rearrangement tasks across multiple robot platforms (WidowX 250, Franka Emika, UR5e), with per-episode task metadata suitable for multi-task conditioning.",

  keyPapers: [
    {
      id: "reed-gato-2022",
      title: "A Generalist Agent",
      authors: "Reed et al.",
      venue: "TMLR 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2205.06175",
    },
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
      id: "team-octo-2024",
      title: "Octo: An Open-Source Generalist Robot Policy",
      authors: "Octo Model Team",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2405.12213",
    },
    {
      id: "lee-multimodal-2022",
      title: "Multi-Game Decision Transformers",
      authors: "Lee et al.",
      venue: "NeurIPS 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2205.15241",
    },
  ],
};

export default data;
