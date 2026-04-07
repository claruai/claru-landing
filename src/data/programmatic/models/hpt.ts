import type { ModelPageData } from "../types";

const data: ModelPageData = {
  slug: "hpt",
  metaTitle: "Training Data for HPT | Data Requirements & Formats | Claru",
  metaDescription:
    "Complete guide to HPT (Heterogeneous Pre-trained Transformers) training data: 52 datasets, 200K+ trajectories, modular stem-trunk-head architecture, and Claru integration.",
  primaryKeyword: "HPT training data",
  secondaryKeywords: [
    "HPT data requirements",
    "heterogeneous pre-trained transformers data",
    "HPT robot learning dataset",
    "HPT fine-tuning data",
    "HPT cross-embodiment pretraining",
  ],
  canonicalPath: "/models/hpt",
  h1: "Training Data for HPT (Heterogeneous Pre-trained Transformers)",
  heroSubtitle:
    "A detailed breakdown of HPT's modular stem-trunk-head architecture, its pretraining across 52 heterogeneous datasets with 200K+ trajectories, scaling behavior up to 1B parameters, and how Claru provides multi-modal robot data for HPT pretraining and fine-tuning.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Models", href: "/models" },
    { label: "HPT", href: "/models/hpt" },
  ],

  // ---------------------------------------------------------------------------
  // Sections
  // ---------------------------------------------------------------------------
  sections: [
    // 1. What Is HPT?
    {
      type: "prose",
      heading: "What Is HPT?",
      paragraphs: [
        "HPT (Heterogeneous Pre-trained Transformers) is a scalable framework for pretraining robot policies across heterogeneous data sources, developed by Lirui Wang and Xinlei Chen (MIT CSAIL) together with Jialiang Zhao and Kaiming He (Meta FAIR). Published as a NeurIPS 2024 Spotlight paper (arXiv 2409.20537), HPT addresses a fundamental challenge in robot foundation models: how to pretrain a single policy network on data from dozens of different robot embodiments, sensor configurations, and task domains without requiring a unified data format.",
        "The key insight is a modular architecture split into three components: embodiment-specific stems that tokenize heterogeneous inputs into a fixed-length token sequence, a shared transformer trunk that processes these tokens into a universal representation, and task/embodiment-specific heads that decode actions for the target robot. By standardizing the interface between stems and trunk (a fixed number of tokens, typically 16 for vision and 16 for proprioception), HPT can pretrain its trunk on data from 52 different datasets spanning simulation, real-world teleoperation, human demonstration video, and deployed robot logs -- totaling over 200,000 trajectories.",
        "HPT demonstrates clear scaling behavior: increasing the trunk size up to 1 billion parameters and the number of pretraining datasets up to 52 consistently improves downstream fine-tuning performance. Pretrained HPT policies outperform baselines by over 20% on unseen tasks in multiple simulation benchmarks and real-world evaluations, including dynamic contact-rich manipulation and long-horizon assembly tasks.",
      ],
    },

    // 2. Key stats
    {
      type: "stats",
      heading: "HPT at a Glance",
      stats: [
        { value: "52", label: "Heterogeneous datasets in pretraining" },
        { value: "200K+", label: "Robot trajectories in training mixture" },
        { value: "1B", label: "Maximum trunk parameters tested" },
        { value: "16+16", label: "Vision + proprioception tokens per stem" },
        { value: ">20%", label: "Fine-tuning improvement over baselines" },
        { value: "4", label: "Data categories: real teleop, human video, sim, deployed" },
      ],
    },

    // 3. Input/output spec
    {
      type: "comparison-table",
      heading: "Input / Output Specification",
      columns: ["Parameter", "Specification"],
      rows: [
        {
          Parameter: "Vision Stem",
          Specification:
            "Pre-trained image encoders (ViT, ResNet) map camera views to features; an attention mechanism compresses to 16 fixed tokens",
        },
        {
          Parameter: "Proprioception Stem",
          Specification:
            "MLP maps variable-dimension proprioceptive state to a feature vector; 16 learnable query tokens attend to this feature",
        },
        {
          Parameter: "Trunk",
          Specification:
            "Shared transformer (scalable to 1B parameters) processes concatenated 32-token sequence into universal representations",
        },
        {
          Parameter: "Action Head",
          Specification:
            "Embodiment-specific decoder maps trunk output to the target action space (variable dimensionality per robot)",
        },
        {
          Parameter: "Language Conditioning",
          Specification:
            "Task embeddings (not natural language) via learned task tokens; language can be added through the vision stem",
        },
        {
          Parameter: "Control Frequency",
          Specification:
            "Variable per embodiment (matches the control rate of each source dataset)",
        },
      ],
    },

    // 4. Architecture & Key Innovations
    {
      type: "prose",
      heading: "Architecture and Key Innovations",
      paragraphs: [
        "HPT's architecture is deliberately modular to accommodate the extreme heterogeneity of robot data. The vision stem takes camera images from any number of views and any resolution, processes them through a pre-trained image encoder (options include ViT-B, ViT-L, or ResNet-50), and uses a cross-attention mechanism with 16 learnable query tokens to compress the variable-length visual features into a fixed 16-token sequence. This compression is critical -- it means the trunk never needs to handle variable-length inputs regardless of how many cameras or what resolution the source data uses.",
        "The proprioception stem handles the even more heterogeneous proprioceptive inputs. Different robots have different numbers of joints (from 6-DoF arms to 33-DoF humanoids), different state representations (joint positions, velocities, torques, end-effector poses), and different coordinate frames. HPT's proprioception stem uses a learnable MLP to map any proprioceptive vector to a fixed-dimension feature, then applies the same 16-learnable-query cross-attention mechanism to produce 16 proprioception tokens. This design means a single pretrained trunk can process data from a 6-DoF Franka arm and a 33-DoF humanoid using only different stem weights.",
        "The shared transformer trunk is the core pretrained component. It processes the concatenated 32-token sequence (16 vision + 16 proprioception) through standard transformer blocks. The trunk weights are shared across all datasets during pretraining and transferred to new embodiments during fine-tuning. HPT's experiments show that scaling the trunk from small (tens of millions of parameters) to large (1 billion parameters) consistently improves downstream performance, indicating that the trunk is learning genuinely useful cross-embodiment representations rather than memorizing dataset-specific patterns.",
        "The action head is an embodiment-specific decoder that maps the trunk's output representation to the target robot's action space. During pretraining, each dataset has its own head. During fine-tuning on a new embodiment, a new head is initialized while the pretrained trunk is transferred (optionally frozen or fine-tuned at a lower learning rate). The modular head design means HPT never needs to reconcile different action spaces into a single representation -- each head simply decodes to whatever the target robot expects (joint positions, velocities, end-effector deltas, etc.).",
      ],
    },

    // 5. Comparison table
    {
      type: "comparison-table",
      heading: "Comparison with Related Models",
      description:
        "How HPT compares to alternative cross-embodiment robot pretraining approaches.",
      columns: ["Dimension", "HPT", "Octo", "OpenVLA", "GR00T N1"],
      rows: [
        {
          Dimension: "Architecture",
          HPT: "Modular stems + shared trunk + heads",
          Octo: "Transformer with diffusion head",
          OpenVLA: "VLM with action token head",
          "GR00T N1": "VLM + Diffusion Transformer",
        },
        {
          Dimension: "Pretraining datasets",
          HPT: "52 datasets (200K+ trajectories)",
          Octo: "Open X-Embodiment (800K episodes)",
          OpenVLA: "Open X-Embodiment (970K episodes)",
          "GR00T N1": "Real robot + human video + synthetic",
        },
        {
          Dimension: "Max parameters",
          HPT: "1B (trunk only)",
          Octo: "93M",
          OpenVLA: "7B",
          "GR00T N1": "2.2B",
        },
        {
          Dimension: "Heterogeneous inputs",
          HPT: "Yes (any sensor via stems)",
          Octo: "Limited (fixed observation format)",
          OpenVLA: "RGB only",
          "GR00T N1": "Yes (embodiment-specific encoders)",
        },
        {
          Dimension: "Language conditioning",
          HPT: "Task embeddings (optional language)",
          Octo: "Natural language",
          OpenVLA: "Natural language",
          "GR00T N1": "Natural language + video",
        },
      ],
    },

    // 6. Training Data Requirements
    {
      type: "prose",
      heading: "Training Data Requirements",
      paragraphs: [
        "HPT's pretraining data mixture is one of the most diverse in robot learning. The published model was pretrained on 52 datasets totaling over 200,000 trajectories, organized into four categories: real-world teleoperation data (human operators controlling robots via haptic devices, VR controllers, or kinesthetic teaching), human demonstration video (third-person and egocentric recordings of humans performing tasks), simulation data (trajectories from physics simulators like MuJoCo, Isaac Gym, and RoboCasa), and deployed robot logs (data from autonomous robot policies running in production).",
        "Each dataset in the mixture has its own observation format (different camera configurations, resolutions, and proprioceptive state dimensions) and action space (different DoF counts, coordinate frames, and control modes). HPT handles this heterogeneity through its modular stem design -- each dataset gets its own stem configuration that tokenizes its specific inputs into the shared 32-token format. The trunk then processes all datasets uniformly.",
        "For teams fine-tuning HPT on a new embodiment or task, the key data requirement is providing enough demonstrations to train the new stem and head while leveraging the pretrained trunk. HPT's experiments show that the pretrained trunk improves fine-tuning performance by over 20% compared to training from scratch, even on tasks and embodiments not seen during pretraining. For a new single-arm manipulation task, 50-200 demonstrations is typically sufficient. For a new embodiment with significantly different morphology, 500-2,000 demonstrations covering diverse tasks provides enough signal to train effective new stems and heads.",
        "Data quality requirements for HPT pretraining favor diversity over volume for any single dataset. The scaling experiments show that adding more datasets (even small ones with only hundreds of trajectories) consistently improves downstream performance, while simply adding more trajectories from existing datasets shows diminishing returns. This means HPT benefits most from broad coverage across robot platforms, environments, and task types rather than deep coverage of a narrow domain.",
      ],
    },

    // 7. How Claru Data Integrates
    {
      type: "prose",
      heading: "How Claru Data Integrates with HPT",
      paragraphs: [
        "Claru provides multi-modal robot data that directly supports HPT's heterogeneous pretraining paradigm. Our datasets span multiple robot platforms (Franka Panda, UR5e, xArm, Unitree), multiple sensor configurations (single-view and multi-view RGB, depth, point clouds, force/torque), and multiple control modes (joint positions, end-effector deltas, joint velocities). This diversity is exactly what HPT's pretraining benefits from most -- each new dataset from a different platform and sensor configuration adds a new stem to the mixture and improves the shared trunk's representations.",
        "For HPT fine-tuning, Claru delivers demonstration datasets with the specific observation and action formats your target embodiment uses. Each dataset includes synchronized visual observations (RGB and optionally depth/point cloud), proprioceptive state recordings (joint positions, velocities, and optionally torques), and action labels at the embodiment's native control rate. We provide the metadata (sensor specifications, robot URDF, action space definition) needed to configure HPT's stem and head for your specific robot.",
        "HPT's stem architecture requires that the vision and proprioception inputs are time-synchronized and that the proprioceptive state includes all degrees of freedom the robot uses for control. Claru's data collection pipeline ensures sub-millisecond synchronization between camera frames and proprioceptive state recordings, and our quality validation checks verify that every trajectory has complete, gap-free proprioceptive coverage. All data is delivered in HDF5 format compatible with HPT's open-source training code on GitHub.",
      ],
    },

    // 8. References
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "wang-hpt-2024",
          title:
            "Scaling Proprioceptive-Visual Learning with Heterogeneous Pre-trained Transformers",
          authors: "Wang, Zhao, Chen, & He",
          venue: "NeurIPS 2024 (Spotlight)",
          year: 2024,
          url: "https://arxiv.org/abs/2409.20537",
        },
        {
          id: "team-octo-2024",
          title:
            "Octo: An Open-Source Generalist Robot Policy",
          authors: "Octo Model Team",
          venue: "arXiv 2405.12213",
          year: 2024,
          url: "https://arxiv.org/abs/2405.12213",
        },
        {
          id: "kim-openvla-2024",
          title:
            "OpenVLA: An Open-Source Vision-Language-Action Model",
          authors: "Kim et al.",
          venue: "arXiv 2406.09246",
          year: 2024,
          url: "https://arxiv.org/abs/2406.09246",
        },
        {
          id: "oneill-oxe-2024",
          title:
            "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
          authors: "O'Neill et al.",
          venue: "ICRA 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2310.08864",
        },
        {
          id: "chi-diffusion-2023",
          title:
            "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
          authors: "Chi et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2303.04137",
        },
      ],
    },
  ],

  // ---------------------------------------------------------------------------
  // FAQs
  // ---------------------------------------------------------------------------
  faqs: [
    {
      question: "How does HPT handle data from different robot embodiments?",
      answer:
        "HPT uses embodiment-specific stems that tokenize heterogeneous inputs into a fixed-length token sequence. The vision stem uses a pre-trained image encoder plus cross-attention with 16 learnable query tokens to handle any number of camera views at any resolution. The proprioception stem uses an MLP plus cross-attention with 16 query tokens to handle any proprioceptive state dimension. This produces a uniform 32-token input for the shared transformer trunk, regardless of the source robot's sensor configuration.",
    },
    {
      question: "What scaling behavior does HPT exhibit?",
      answer:
        "HPT shows consistent improvements along two scaling axes. First, increasing the trunk size from small to 1B parameters improves downstream fine-tuning performance. Second, increasing the number of pretraining datasets from a handful to 52 also improves performance, with each additional dataset contributing marginal gains even when it contains only hundreds of trajectories. The scaling curves have not yet saturated, suggesting that larger trunks and more diverse data mixtures will continue to improve results.",
    },
    {
      question: "Does HPT support natural language instructions?",
      answer:
        "HPT's published implementation uses learned task embeddings rather than natural language conditioning. However, the architecture is flexible -- language instructions can be integrated through the vision stem (e.g., by rendering text on the image or using a CLIP-style encoder) or by adding a dedicated language stem that produces additional tokens for the trunk. The modular design means language conditioning can be added without changing the trunk architecture.",
    },
    {
      question: "How much data does HPT need for fine-tuning on a new robot?",
      answer:
        "HPT's pretrained trunk provides strong initialization that reduces fine-tuning data requirements by approximately 20% compared to training from scratch. For a new single-arm manipulation task on a supported embodiment, 50-200 demonstrations is typically sufficient. For a new embodiment with different morphology, 500-2,000 demonstrations covering diverse tasks are recommended to train the new stem and head while leveraging the pretrained trunk.",
    },
    {
      question: "What data format does Claru deliver for HPT?",
      answer:
        "Claru delivers demonstration datasets in HDF5 format compatible with HPT's open-source training code (github.com/liruiw/HPT). Each dataset includes synchronized RGB images (and optionally depth/point clouds), proprioceptive state recordings with all DoFs at the robot's native control rate, and action labels. We also provide the sensor metadata, robot URDF, and action space specification needed to configure HPT's embodiment-specific stems and heads for your platform.",
    },
  ],

  // ---------------------------------------------------------------------------
  // CTA
  // ---------------------------------------------------------------------------
  ctaHeading: "Get HPT-Ready Multi-Modal Robot Data",
  ctaDescription:
    "Tell us about your HPT project -- target robot platform, sensor configuration, and task domains -- and we will deliver diverse, multi-modal demonstration datasets optimized for HPT's heterogeneous pretraining pipeline.",

  // ---------------------------------------------------------------------------
  // Cross-links
  // ---------------------------------------------------------------------------
  relatedGlossaryTerms: [
    "vla",
    "foundation-model-robotics",
    "imitation-learning",
    "cross-embodiment",
  ],
  relatedGuidePages: [
    "how-to-create-action-labels-for-vla",
    "how-to-collect-teleoperation-data",
    "how-to-build-a-cross-embodiment-dataset",
  ],
  relatedSolutionSlugs: [],

  // ---------------------------------------------------------------------------
  // Model metadata
  // ---------------------------------------------------------------------------
  modelName: "HPT",
  organization: "MIT CSAIL / Meta FAIR",
  year: 2024,

  inputSpec: {
    observationFormat:
      "Heterogeneous: any combination of RGB, depth, point clouds, proprioception -- tokenized to 32 fixed tokens via embodiment-specific stems",
    actionFormat:
      "Variable action spaces (joint positions, velocities, end-effector deltas) decoded by embodiment-specific heads",
    languageConditioning:
      "Task embeddings via learned tokens (language can be added through vision or dedicated stem)",
    controlFrequency:
      "Variable per embodiment (matches source dataset control rate)",
  },

  dataVolumeBenchmarks:
    "HPT was pretrained on one of the most diverse robot data mixtures published to date: 52 datasets totaling over 200,000 trajectories across four categories. Real-world teleoperation data includes demonstrations from multiple robot platforms (Franka Panda, UR5, KUKA, Kinova, xArm, and others) collected via haptic devices, VR controllers, and kinesthetic teaching. Human demonstration video includes third-person and egocentric recordings of humans performing manipulation tasks, processed through human-to-robot retargeting pipelines. Simulation data spans physics engines including MuJoCo, Isaac Gym, and RoboCasa across hundreds of task variants. Deployed robot logs include data from autonomous policies running on real hardware. The total training mixture covers at least 15 distinct robot embodiments with DoF counts ranging from 6 (single arms) to 30+ (humanoids), proprioceptive state dimensions ranging from 7 to 70+, and action spaces spanning joint positions, joint velocities, and Cartesian end-effector commands. Each dataset contributes between 100 and 50,000 trajectories. HPT's scaling experiments demonstrate that dataset diversity matters more than per-dataset volume -- adding a new dataset with just a few hundred trajectories from an unseen embodiment consistently improves the pretrained trunk's downstream transfer performance by measurable margins. For fine-tuning, the pretrained HPT trunk improves performance by over 20% compared to training from scratch, with 50-200 demonstrations sufficient for single-task adaptation and 500-2,000 for new embodiment integration.",

  trainingRecipe:
    "HPT's training proceeds in two phases: heterogeneous pretraining and embodiment-specific fine-tuning. During pretraining, each of the 52 source datasets is assigned its own vision stem, proprioception stem, and action head. The vision stem applies a frozen pretrained image encoder (e.g., ViT-B/16 from DINOv2 or a ResNet-50) to each camera view, then uses a cross-attention layer with 16 learnable query tokens to compress the visual features into a fixed 16-token sequence. The proprioception stem passes the variable-dimension proprioceptive state through an MLP, then uses the same cross-attention mechanism with 16 learnable queries to produce 16 proprioception tokens. The 32 concatenated tokens are fed into the shared transformer trunk. The trunk processes these tokens through standard transformer blocks and outputs a 32-token representation that the action head decodes into the target robot's action space. Training uses a standard MSE loss on predicted vs. ground-truth actions, with batches sampled uniformly across all 52 datasets to ensure balanced representation. The stem weights, trunk weights, and head weights are all updated during pretraining, but only the trunk is transferred to new tasks. Pretraining scales to 1B trunk parameters on GPU clusters. During fine-tuning for a new embodiment, new stems and a new head are initialized for the target robot's sensors and action space. The pretrained trunk is loaded and either frozen or fine-tuned at a reduced learning rate (typically 10x lower than the stem and head learning rates). Fine-tuning converges in significantly fewer iterations than training from scratch, and the resulting policy outperforms scratch-trained baselines by over 20% on average across simulation and real-world evaluations.",

  claruIntegration:
    "Claru provides multi-modal robot data spanning the diversity HPT benefits from most. Our catalog includes data from 5+ robot platforms (Franka Panda, UR5e, xArm, Unitree, custom humanoids) with multiple sensor configurations (single and multi-view RGB at various resolutions, depth cameras, wrist-mounted force/torque sensors). Each dataset includes time-synchronized visual observations, complete proprioceptive state recordings (all DoFs, positions, velocities, and optionally torques), and action labels at the robot's native control rate. For HPT pretraining, we can contribute new heterogeneous datasets that add unique embodiment-sensor combinations to the mixture, directly improving the pretrained trunk's representational breadth. For fine-tuning on a new platform, we deliver 50-2,000 demonstrations with the metadata (sensor specs, URDF, action space definition) needed to configure HPT's new stems and heads. All data is in HDF5 format compatible with HPT's GitHub codebase.",

  keyPapers: [
    {
      id: "wang-hpt-2024",
      title:
        "Scaling Proprioceptive-Visual Learning with Heterogeneous Pre-trained Transformers",
      authors: "Wang, Zhao, Chen, & He",
      venue: "NeurIPS 2024 (Spotlight)",
      year: 2024,
      url: "https://arxiv.org/abs/2409.20537",
    },
    {
      id: "team-octo-2024",
      title: "Octo: An Open-Source Generalist Robot Policy",
      authors: "Octo Model Team",
      venue: "arXiv 2405.12213",
      year: 2024,
      url: "https://arxiv.org/abs/2405.12213",
    },
    {
      id: "kim-openvla-2024",
      title: "OpenVLA: An Open-Source Vision-Language-Action Model",
      authors: "Kim et al.",
      venue: "arXiv 2406.09246",
      year: 2024,
      url: "https://arxiv.org/abs/2406.09246",
    },
    {
      id: "oneill-oxe-2024",
      title:
        "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "O'Neill et al.",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864",
    },
    {
      id: "chi-diffusion-2023",
      title:
        "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137",
    },
  ],
};

export default data;
