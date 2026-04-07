import type { ModelPageData } from "../types";

const data: ModelPageData = {
  slug: "act-aloha",
  metaTitle: "Training Data for ACT / ALOHA — Formats, Volumes & Integration | Claru",
  metaDescription:
    "Deep-dive into ACT and ALOHA training data: CVAE architecture, 4-camera observation format, 14-DoF bimanual actions, data volume benchmarks from RSS 2023, and Claru integration.",
  primaryKeyword: "ACT ALOHA training data",
  secondaryKeywords: [
    "action chunking transformer data",
    "ALOHA bimanual dataset",
    "ACT robot learning data requirements",
    "ALOHA teleoperation data format",
    "bimanual manipulation training data",
  ],
  canonicalPath: "/models/act-aloha",
  h1: "Training Data for ACT (Action Chunking with Transformers) / ALOHA",
  heroSubtitle:
    "ACT is a conditional variational autoencoder built on a transformer backbone that predicts temporally-correlated action chunks from multi-view images and proprioceptive state. Paired with the low-cost ALOHA bimanual teleoperation hardware, it achieves 80-95% success rates on fine-grained bimanual tasks from as few as 50 human demonstrations. This page details ACT's exact data requirements, training recipe, and how Claru delivers ALOHA-compatible datasets.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Models", href: "/models" },
    { label: "ACT / ALOHA", href: "/models/act-aloha" },
  ],

  // ── Sections ──────────────────────────────────────────────────────────
  sections: [
    // 1. What Is ACT / ALOHA?
    {
      type: "prose",
      heading: "What Is ACT / ALOHA?",
      paragraphs: [
        "Action Chunking with Transformers (ACT) is a visuomotor imitation learning algorithm introduced by Tony Zhao, Vikash Kumar, Sergey Levine, and Chelsea Finn at Stanford in 2023. The core insight is that predicting a single next action at each timestep leads to temporally incoherent behavior, especially in contact-rich bimanual manipulation. ACT instead predicts chunks of k future actions (typically k=100 at 50 Hz, covering 2 seconds of motion) in a single forward pass, drastically reducing compounding error and enabling smooth, human-like trajectories.",
        "The ALOHA hardware platform was co-designed with ACT as a low-cost bimanual teleoperation system. Each ALOHA station consists of two ViperX 300 6-DoF leader arms physically linked to two ViperX 300 follower arms, plus four Logitech C922 cameras (two wrist-mounted, two third-person views). The total bill of materials is roughly $20K — an order of magnitude cheaper than prior bimanual teleoperation rigs. This cost reduction is what makes it practical to collect the 50-200 demonstrations per task that ACT needs.",
        "Since the original RSS 2023 paper, the ACT/ALOHA line has expanded significantly. Mobile ALOHA (Fu et al., 2024) mounted the system on a mobile base, adding 2-DoF base velocity to the action space and demonstrating whole-body loco-manipulation like cooking shrimp and opening cabinets. ALOHA Unleashed (Zhao et al., 2024) scaled to 800+ demonstrations per task and introduced a diffusion-based variant of ACT that further improved performance on long-horizon dexterous tasks. ALOHA 2 (Google DeepMind, 2024) redesigned the hardware for higher rigidity and repeatability.",
        "What makes ACT distinctive in the landscape of robot learning models is its combination of sample efficiency, simplicity, and hardware accessibility. Unlike VLA models that require millions of internet-scale examples, ACT is a specialist — it learns one task at a time from a small number of high-quality demonstrations. This makes data quality, not data volume, the primary bottleneck.",
      ],
    },

    // 2. Stats
    {
      type: "stats",
      heading: "ACT / ALOHA at a Glance",
      stats: [
        { value: "50", label: "Demonstrations for 80%+ success (original ACT)" },
        { value: "14-DoF", label: "Bimanual action space (7 per arm)" },
        { value: "4", label: "Camera views (2 wrist + 2 third-person)" },
        { value: "50 Hz", label: "Control frequency" },
        { value: "k=100", label: "Action chunk length (2 sec horizon)" },
        { value: "$20K", label: "Approximate ALOHA hardware cost" },
      ],
    },

    // 3. Input/Output Specification
    {
      type: "comparison-table",
      heading: "Input / Output Specification",
      columns: ["Parameter", "Specification"],
      rows: [
        { Parameter: "Image observations", Specification: "4x 480x640 RGB images (2 wrist-mounted, 2 third-person); resized to 480x640 internally" },
        { Parameter: "Proprioceptive state", Specification: "14-dim joint positions (7-DoF per arm: 6 revolute joints + 1 gripper)" },
        { Parameter: "Action space", Specification: "14-dim absolute joint position targets, chunked (k=100 actions per prediction)" },
        { Parameter: "Action chunk horizon", Specification: "100 timesteps at 50 Hz = 2 seconds of future motion" },
        { Parameter: "Temporal ensembling", Specification: "Exponentially weighted average over overlapping action chunks (weight w=0.01)" },
        { Parameter: "Language conditioning", Specification: "Not supported in base ACT; task identity is implicit via dataset" },
        { Parameter: "Control frequency", Specification: "50 Hz (DynamixelSDK servo communication)" },
        { Parameter: "Data format", Specification: "HDF5 files: /observations/images/{cam_name}, /observations/qpos, /action" },
      ],
    },

    // 4. Architecture & Key Innovations
    {
      type: "prose",
      heading: "Architecture and Key Innovations",
      paragraphs: [
        "ACT's architecture is a Conditional Variational Autoencoder (CVAE) with a transformer encoder-decoder backbone. During training, the encoder takes the full sequence of ground-truth actions along with the current observation and compresses it into a latent variable z (typically 32-dimensional). The decoder then reconstructs the action chunk conditioned on both z and the observation. The training loss is the standard CVAE objective: reconstruction loss (L1 on predicted vs. ground-truth actions) plus a KL divergence term that regularizes the latent space.",
        "At inference time, the encoder is discarded. The decoder receives z sampled from the prior (a standard normal) along with the current observation, and predicts the full action chunk. The KL divergence weight (beta) is set very low (0.01) to prioritize reconstruction accuracy over latent space regularity — this is a deliberate design choice that keeps the model close to behavioral cloning while gaining the multi-modality benefits of the CVAE.",
        "The observation encoder uses a ResNet-18 backbone (pretrained on ImageNet) for each camera view, producing spatial feature maps that are flattened into tokens. These image tokens are concatenated with a proprioceptive state token and fed into the transformer decoder as cross-attention context. The transformer decoder uses 4 layers with 8 attention heads and hidden dimension 512.",
        "Temporal ensembling is a critical inference-time technique. Because the model runs at 50 Hz but predicts 100-step chunks, consecutive predictions overlap heavily. Rather than executing only the first action of each chunk, ACT maintains a buffer of overlapping predictions and computes an exponentially weighted average. This smooths out high-frequency noise and further reduces jitter. The ensembling weight w=0.01 means older predictions are down-weighted rapidly.",
        "The action chunking itself is the single most important innovation. Prior work in behavioral cloning for manipulation suffered from the 'jerky motion' problem: single-step prediction models tend to produce temporally discontinuous actions because they lack awareness of their own future behavior. By predicting 100 steps at once, ACT forces the model to plan a coherent trajectory segment, which naturally produces smooth, contact-aware motions.",
      ],
    },

    // 5. Comparison with Related Models
    {
      type: "comparison-table",
      heading: "Comparison with Related Approaches",
      columns: ["Attribute", "ACT / ALOHA", "Diffusion Policy", "OpenVLA", "RT-2"],
      rows: [
        { Attribute: "Architecture", "ACT / ALOHA": "CVAE + Transformer", "Diffusion Policy": "DDPM + CNN/ViT encoder", "OpenVLA": "Prismatic VLM + action head", "RT-2": "PaLI-X (55B) VLM" },
        { Attribute: "Demos per task", "ACT / ALOHA": "50-200", "Diffusion Policy": "100-200", "OpenVLA": "100K+ (pretraining)", "RT-2": "130K+ (pretraining)" },
        { Attribute: "Action representation", "ACT / ALOHA": "Absolute joint positions (chunked)", "Diffusion Policy": "EE delta or joint (chunked)", "OpenVLA": "Discretized 7-DoF EE delta", "RT-2": "Discretized 7-DoF EE delta" },
        { Attribute: "Language-conditioned", "ACT / ALOHA": "No", "Diffusion Policy": "No (base)", "OpenVLA": "Yes", "RT-2": "Yes" },
        { Attribute: "Multi-task", "ACT / ALOHA": "No (task-specific)", "Diffusion Policy": "Limited", "OpenVLA": "Yes (generalist)", "RT-2": "Yes (generalist)" },
        { Attribute: "Training time", "ACT / ALOHA": "~25 min (50 demos, 1 GPU)", "Diffusion Policy": "2-8 hrs (200 demos, 1 GPU)", "OpenVLA": "~14 days (8 A100s)", "RT-2": "Weeks (TPU v4 pod)" },
        { Attribute: "Bimanual support", "ACT / ALOHA": "Native (14-DoF)", "Diffusion Policy": "Via action dim config", "OpenVLA": "7-DoF EE only", "RT-2": "7-DoF EE only" },
      ],
    },

    // 6. Training Data Requirements
    {
      type: "prose",
      heading: "Training Data Requirements",
      paragraphs: [
        "ACT's data requirements are defined by the ALOHA hardware configuration. Each demonstration episode must include synchronized streams from all four cameras (two wrist-mounted, two third-person) at 50 Hz, along with 14-dimensional joint position readings (7 per arm) at the same frequency. The gripper position is included as the 7th joint dimension. Episodes are stored in HDF5 files with a specific structure: /observations/images/cam_high, /observations/images/cam_low, /observations/images/cam_left_wrist, /observations/images/cam_right_wrist for images, /observations/qpos for joint positions, and /action for target actions.",
        "Data quality matters far more than quantity for ACT. Zhao et al. demonstrated that 50 high-quality demonstrations can achieve 90%+ success on tasks like transferring a ball between cups. However, 'high-quality' has specific meaning here: demonstrations must be smooth (no jerky leader arm movements), consistent (the same general strategy each time), and cover the relevant workspace variation (different object positions within the expected range). A single bad demonstration — one with collisions, dropped objects, or dramatically different strategy — can measurably degrade policy performance.",
        "For Mobile ALOHA, the action space expands to 16 dimensions (14 arm joints + 2 base velocity). The data collection rate drops to approximately 5-10 demonstrations per hour because the operator must physically walk with the robot. Fu et al. used co-training: mixing 50 task-specific demonstrations with 800 demonstrations of generic base navigation and arm reaching to improve robustness.",
        "ALOHA Unleashed pushed the data scale to 800+ demonstrations for complex multi-step tasks like cooking. At this scale, data diversity becomes critical — demonstrations should vary object placements, approach angles, and timing. The dataset should also include natural recovery behaviors: if the operator drops an ingredient, they should pick it up and continue rather than restarting, so the policy learns to recover from perturbations.",
        "Action normalization is important: ACT expects absolute joint position targets, not delta actions. All joint values should be in radians within the servo range (typically -pi to +pi for revolute joints, 0 to 1 for grippers). The temporal alignment between cameras and joint readings must be tight — more than 20ms of desynchronization between modalities degrades performance.",
      ],
    },

    // 7. How Claru Data Integrates
    {
      type: "prose",
      heading: "How Claru Data Integrates with ACT / ALOHA",
      paragraphs: [
        "Claru operates ALOHA-compatible bimanual teleoperation stations with the same ViperX 300 leader-follower configuration and 4-camera setup described in the original paper. Our collection pipeline records synchronized 50 Hz joint positions and 480x640 RGB images from all four camera views, with hardware-triggered synchronization to keep inter-modality latency below 5ms.",
        "We deliver data in the exact HDF5 format ACT expects, with the standard key hierarchy (/observations/images/*, /observations/qpos, /action) and correct data types (uint8 for images, float64 for joint positions). Each delivery includes a metadata file documenting camera intrinsics, extrinsics relative to the robot base, servo PID gains, and joint limit configurations — everything needed to reproduce the setup or transfer to a different ALOHA build.",
        "Our operators are trained on ACT-specific data quality criteria: smooth leader arm trajectories, consistent task strategies, natural recovery from perturbations, and workspace variation. We run automated quality checks on every episode — flagging episodes with joint velocity spikes (indicating jerky demonstrations), camera frame drops, or synchronization drift. Rejected episodes are re-collected, not patched.",
        "For teams building on Mobile ALOHA, we provide base velocity co-training data in addition to task-specific demonstrations. For teams experimenting with ALOHA Unleashed's diffusion-based variant, we can deliver the same data in zarr format with the chunking structure the diffusion training loop expects. We also support custom embodiment configurations — if your bimanual setup uses different arms or camera placements, we adapt our collection pipeline to match your robot's kinematic configuration and deliver data in your target format.",
      ],
    },

    // 8. Key References
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "zhao-aloha-2023",
          title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
          authors: "Zhao et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2304.13705",
        },
        {
          id: "fu-mobile-aloha-2024",
          title: "Mobile ALOHA: Learning Bimanual Mobile Manipulation with Low-Cost Whole-Body Teleoperation",
          authors: "Fu et al.",
          venue: "arXiv 2401.02117",
          year: 2024,
          url: "https://arxiv.org/abs/2401.02117",
        },
        {
          id: "zhao-aloha-unleashed-2024",
          title: "ALOHA Unleashed: A Simple Recipe for Robot Dexterity",
          authors: "Zhao et al.",
          venue: "arXiv 2410.13126",
          year: 2024,
          url: "https://arxiv.org/abs/2410.13126",
        },
        {
          id: "zhao-aloha2-2024",
          title: "ALOHA 2: An Enhanced Low-Cost Hardware for Bimanual Teleoperation",
          authors: "Zhao et al.",
          venue: "arXiv 2405.02292",
          year: 2024,
          url: "https://arxiv.org/abs/2405.02292",
        },
        {
          id: "chi-diffusion-2023",
          title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
          authors: "Chi et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2303.04137",
        },
      ],
    },
  ],

  // ── FAQs ──────────────────────────────────────────────────────────────
  faqs: [
    {
      question: "How many demonstrations does ACT need per task, and how long does data collection take?",
      answer:
        "The original ACT paper demonstrated 80-95% success with 50 demonstrations on bimanual manipulation tasks like ball transfer and zipping. More complex tasks like cooking (ALOHA Unleashed) used 800+ demonstrations. Collection rate is approximately 10-20 demonstrations per hour for tabletop tasks and 5-10 per hour for mobile manipulation. A typical tabletop task requires one afternoon of focused data collection.",
    },
    {
      question: "Can ACT work with a single-arm robot instead of bimanual ALOHA?",
      answer:
        "Yes. ACT's CVAE architecture is agnostic to action dimensionality. For a single 7-DoF arm, set the action dimension to 7 (or 8 with gripper) and adjust the camera configuration. The action chunking mechanism works identically. Several groups have successfully trained ACT on single-arm setups with UR5, Franka Emika, and xArm robots using 2-3 camera views.",
    },
    {
      question: "What is action chunking and why does it matter for data quality?",
      answer:
        "Action chunking means predicting k future actions (k=100 for ACT at 50 Hz = 2 seconds) in a single forward pass instead of one action at a time. This reduces compounding error and produces smooth trajectories. For data quality, this means demonstrations themselves must be smooth — jerky or hesitant human motions become the training target. ACT cannot learn smooth behavior from noisy demonstrations because the chunk must faithfully reproduce the recorded trajectory.",
    },
    {
      question: "What HDF5 structure does ACT expect and how should I organize episodes?",
      answer:
        "Each episode is one HDF5 file containing: /observations/images/cam_high (uint8 array, T x H x W x 3), similar keys for cam_low, cam_left_wrist, cam_right_wrist; /observations/qpos (float64, T x 14); /action (float64, T x 14). T is the episode length in timesteps. Episodes are stored in a directory with sequential naming (episode_0.hdf5, episode_1.hdf5, etc.). A dataset_stats.pkl file storing per-dimension mean and standard deviation is generated during preprocessing.",
    },
    {
      question: "How does ACT differ from Diffusion Policy for bimanual manipulation?",
      answer:
        "Both predict action chunks, but ACT uses a CVAE (single-pass generation via latent variable sampling) while Diffusion Policy uses iterative denoising (typically 10-100 DDPM steps). ACT trains faster (~25 minutes vs. 2-8 hours for 50-200 demos) and has lower inference latency (~4ms vs. ~40-100ms). Diffusion Policy handles multi-modal action distributions more naturally. ALOHA Unleashed tested both and found the diffusion variant slightly outperformed CVAE-ACT on the most complex long-horizon tasks, at the cost of higher inference compute.",
    },
  ],

  // ── CTA ────────────────────────────────────────────────────────────────
  ctaHeading: "Get ALOHA-Compatible Training Data",
  ctaDescription:
    "Tell us about your bimanual manipulation task. We collect synchronized 4-camera, 14-DoF demonstrations on ALOHA hardware and deliver in ACT's HDF5 format, quality-checked and ready to train.",

  // ── Cross-links ────────────────────────────────────────────────────────
  relatedGlossaryTerms: [
    "action-chunking",
    "imitation-learning",
    "behavioral-cloning",
    "teleoperation",
    "bimanual-manipulation",
  ],
  relatedGuidePages: [
    "how-to-collect-teleoperation-data",
    "how-to-build-a-manipulation-dataset",
  ],
  relatedSolutionSlugs: ["teleoperation-data"],

  // ── Model metadata ────────────────────────────────────────────────────
  modelName: "ACT (Action Chunking with Transformers) / ALOHA",
  organization: "Stanford / Google DeepMind",
  year: 2023,

  inputSpec: {
    observationFormat:
      "4x 480x640 RGB images (2 wrist-mounted + 2 third-person) + 14-dim joint positions",
    actionFormat:
      "14-DoF absolute joint position targets, chunked (k=100 actions per prediction)",
    languageConditioning:
      "Not supported in base ACT (task identity is implicit via per-task training)",
    controlFrequency: "50 Hz",
  },

  dataVolumeBenchmarks:
    "ACT is remarkably sample-efficient for a behavioral cloning method. The original RSS 2023 paper reported 80-95% success on six bimanual manipulation tasks (ball transfer, cube handover, slot insertion, zipping, threading, tape) from just 50 demonstrations per task. Training on 50 episodes takes approximately 25 minutes on a single NVIDIA RTX 3090. Mobile ALOHA extended this to whole-body loco-manipulation tasks using co-training: 50 task-specific demonstrations supplemented with 800 demonstrations of generic reaching and navigation. ALOHA Unleashed scaled to 800+ demonstrations per task for complex multi-step cooking and assembly tasks, with training times of 2-4 hours. The critical insight is that additional demonstrations improve diversity coverage — more varied object placements and approach angles — rather than learning fundamentally new behaviors. Data quality remains paramount: filtering out the worst 10% of demonstrations by a simple smoothness metric improved success rates by 5-10 percentage points.",

  trainingRecipe:
    "ACT training follows the CVAE objective. The encoder receives the full ground-truth action sequence (T x 14) and current observation, projects them through a 4-layer transformer encoder with 8 heads and hidden dimension 512, and produces a 32-dimensional latent z via reparameterization. The decoder receives z along with tokenized observations (ResNet-18 features from each camera view plus proprioceptive state) and autoregressively predicts the action chunk. The loss is L_reconstruct (L1 between predicted and ground-truth actions) + beta * KL(q(z|actions, obs) || p(z)), with beta = 0.01. Training uses AdamW with learning rate 1e-5, batch size 8, and runs for 3000 epochs on small datasets (50 episodes) or 1000 epochs on larger ones (800+ episodes). The learning rate warms up linearly for 10% of training then decays via cosine schedule. No data augmentation is used in the original paper, though subsequent work has shown that random crop augmentation on camera images can improve robustness. Evaluation during training uses 10-20 real robot rollouts every N epochs, as there is no reliable offline metric for manipulation policy quality.",

  claruIntegration:
    "Claru operates ALOHA-compatible bimanual teleoperation stations with synchronized 4-camera recording at 50 Hz. Our collection pipeline produces HDF5 files in ACT's native format (/observations/images/*, /observations/qpos, /action) with hardware-triggered synchronization ensuring sub-5ms inter-modality latency. Operators are trained on ACT-specific quality criteria — smooth leader arm trajectories, consistent strategies, natural recovery behaviors. Automated QA flags episodes with joint velocity spikes, frame drops, or sync drift. For Mobile ALOHA projects, we provide base velocity co-training data alongside task demonstrations. We support custom embodiment configurations and deliver accompanying metadata (camera calibration, servo configurations, joint limits) for full reproducibility.",

  keyPapers: [
    {
      id: "zhao-aloha-2023",
      title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
      authors: "Zhao et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.13705",
    },
    {
      id: "fu-mobile-aloha-2024",
      title: "Mobile ALOHA: Learning Bimanual Mobile Manipulation with Low-Cost Whole-Body Teleoperation",
      authors: "Fu et al.",
      venue: "arXiv 2401.02117",
      year: 2024,
      url: "https://arxiv.org/abs/2401.02117",
    },
    {
      id: "zhao-aloha-unleashed-2024",
      title: "ALOHA Unleashed: A Simple Recipe for Robot Dexterity",
      authors: "Zhao et al.",
      venue: "arXiv 2410.13126",
      year: 2024,
      url: "https://arxiv.org/abs/2410.13126",
    },
    {
      id: "zhao-aloha2-2024",
      title: "ALOHA 2: An Enhanced Low-Cost Hardware for Bimanual Teleoperation",
      authors: "Zhao et al.",
      venue: "arXiv 2405.02292",
      year: 2024,
      url: "https://arxiv.org/abs/2405.02292",
    },
    {
      id: "chi-diffusion-2023",
      title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137",
    },
  ],
};

export default data;
