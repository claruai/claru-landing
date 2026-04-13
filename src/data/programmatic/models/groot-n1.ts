import type { ModelPageData } from "../types";

const data: ModelPageData = {
  slug: "groot-n1",
  metaTitle: "Training Data for GR00T N1 | Data Requirements & Formats | Claru",
  metaDescription:
    "Complete guide to NVIDIA GR00T N1 training data: dual-system VLA architecture, 2.2B parameters, flow-matching actions, and how Claru delivers GR00T-ready datasets.",
  primaryKeyword: "GR00T N1 training data",
  secondaryKeywords: [
    "GR00T N1 data requirements",
    "NVIDIA humanoid foundation model data",
    "GR00T N1 dataset format",
    "GR00T N1 fine-tuning data",
    "GR00T N1 humanoid robot training",
  ],
  canonicalPath: "/models/groot-n1",
  h1: "Training Data for GR00T N1",
  heroSubtitle:
    "A detailed breakdown of NVIDIA's GR00T N1 humanoid foundation model -- its dual-system architecture with Eagle-2 VLM and Diffusion Transformer, the heterogeneous data mixture it trains on, and how Claru provides the human video and robot demonstration data GR00T N1 requires.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Models", href: "/models" },
    { label: "GR00T N1", href: "/models/groot-n1" },
  ],

  // ---------------------------------------------------------------------------
  // Sections
  // ---------------------------------------------------------------------------
  sections: [
    // 1. What Is GR00T N1?
    {
      type: "prose",
      heading: "What Is GR00T N1?",
      paragraphs: [
        "GR00T N1 is an open foundation model for generalist humanoid robots, developed by NVIDIA and published in March 2025 (arXiv 2503.14734). It is a Vision-Language-Action (VLA) model with a dual-system architecture inspired by human cognitive processing: a System 2 reasoning module (a pretrained Vision-Language Model) handles task understanding and environmental interpretation, while a System 1 action module (a Diffusion Transformer) generates fluid motor actions in real time. Both modules are tightly coupled and jointly trained end-to-end.",
        "The publicly released GR00T-N1-2B model contains 2.2 billion parameters in total, with 1.34 billion in the VLM backbone (NVIDIA Eagle-2, fine-tuned from SmolLM2 and SigLIP-2). The model supports cross-embodiment deployment from tabletop robot arms to full-size humanoid robots, and was validated on platforms including the Fourier GR-1 humanoid, ALOHA bimanual arms, and single-arm manipulation setups. Pretraining consumed approximately 50,000 NVIDIA H100 GPU hours using up to 1,024 GPUs.",
        "A defining feature of GR00T N1 is its ability to learn from heterogeneous data sources -- not just teleoperated robot trajectories, but also human egocentric videos and synthetically generated trajectories. For data sources that lack action labels (like human videos), GR00T N1 employs a learned latent-action codebook and trained inverse dynamics models (IDMs) to infer pseudo-actions, enabling the model to extract manipulation knowledge from video datasets that were never collected with robots.",
      ],
    },

    // 2. Key stats
    {
      type: "stats",
      heading: "GR00T N1 at a Glance",
      stats: [
        { value: "2.2B", label: "Total parameters (GR00T-N1-2B)" },
        { value: "1.34B", label: "VLM backbone parameters (Eagle-2)" },
        { value: "50K", label: "H100 GPU hours for pretraining" },
        { value: "1,024", label: "Max GPUs used in a single training run" },
        { value: "10 Hz", label: "System 2 (VLM) inference frequency" },
        { value: "3", label: "Data layers: real robot, human video, synthetic" },
      ],
    },

    // 3. Input/output spec
    {
      type: "comparison-table",
      heading: "Input / Output Specification",
      columns: ["Parameter", "Specification"],
      rows: [
        {
          Parameter: "System 2 (Reasoning)",
          Specification:
            "Eagle-2 VLM (SigLIP-2 image encoder + SmolLM2 LLM) processes multi-view RGB images and language instructions at 10 Hz",
        },
        {
          Parameter: "System 1 (Action)",
          Specification:
            "Diffusion Transformer with action flow-matching cross-attends to VLM output tokens and generates motor actions via embodiment-specific encoders/decoders",
        },
        {
          Parameter: "Observation Format",
          Specification:
            "Multi-view RGB images at configurable resolution, plus proprioceptive state (joint positions, velocities)",
        },
        {
          Parameter: "Action Format",
          Specification:
            "Continuous joint-position targets generated via flow matching, with embodiment-specific action decoders handling variable DoF counts",
        },
        {
          Parameter: "Language Conditioning",
          Specification:
            "Natural language instructions processed by the Eagle-2 VLM; also supports video demonstration conditioning",
        },
        {
          Parameter: "Control Frequency",
          Specification:
            "System 2 runs at 10 Hz for task reasoning; System 1 Diffusion Transformer can output actions at higher rates for motor control",
        },
      ],
    },

    // 4. Architecture & Key Innovations
    {
      type: "prose",
      heading: "Architecture and Key Innovations",
      paragraphs: [
        "GR00T N1's dual-system design is its most distinctive architectural choice. System 2 is the NVIDIA Eagle-2 VLM, which combines a SigLIP-2 image encoder with a SmolLM2 language model. This module processes the robot's camera views and natural language instructions to produce a rich contextual representation of the current task state. Running at 10 Hz on an NVIDIA L40 GPU, it provides the high-level reasoning about what the robot should do and why.",
        "System 1 is a Diffusion Transformer trained with action flow matching. It cross-attends to the VLM's output token sequence and generates continuous motor actions through iterative denoising. The key design choice here is the use of embodiment-specific encoders and decoders: the encoder maps the robot's proprioceptive state (which varies in dimensionality across embodiments) into a fixed-size latent representation, and the decoder maps the Diffusion Transformer's output back to the robot's native action space. This allows a single shared Diffusion Transformer trunk to serve multiple robot morphologies.",
        "The pseudo-action mechanism for training on actionless data is a critical innovation. For human egocentric videos, GR00T N1 trains a VQ-VAE model that extracts features from consecutive video frames and maps them to a discrete latent-action codebook. For synthetically generated video trajectories, a separate Diffusion Transformer-based inverse dynamics model (IDM) is trained to predict actions from consecutive observation pairs. Both mechanisms produce pseudo-action labels that are used as flow-matching targets during training, treating each data source as a separate 'embodiment' with its own encoder/decoder pair.",
        "The end-to-end joint training of System 1 and System 2 ensures tight coupling between reasoning and action. Unlike pipeline approaches where a VLM first produces a plan and a separate controller executes it, GR00T N1's gradient flows through both modules during training, allowing the VLM to learn representations that are directly useful for action generation and the Diffusion Transformer to leverage the VLM's semantic understanding.",
      ],
    },

    // 5. Comparison table
    {
      type: "comparison-table",
      heading: "Comparison with Related Models",
      description:
        "How GR00T N1 compares to alternative humanoid and generalist robot foundation models.",
      columns: ["Dimension", "GR00T N1", "OpenVLA", "HPT", "pi0"],
      rows: [
        {
          Dimension: "Architecture",
          "GR00T N1": "Dual-system: VLM + Diffusion Transformer",
          OpenVLA: "Single VLM with action token head",
          HPT: "Modular stems + shared transformer trunk",
          pi0: "VLM + flow matching action head",
        },
        {
          Dimension: "Parameters",
          "GR00T N1": "2.2B (1.34B VLM)",
          OpenVLA: "7B",
          HPT: "Up to 1B",
          pi0: "Proprietary (VLM-scale)",
        },
        {
          Dimension: "Target embodiments",
          "GR00T N1": "Humanoids, bimanual arms, single arms",
          OpenVLA: "Single-arm manipulators",
          HPT: "Cross-embodiment (any robot)",
          pi0: "Cross-embodiment (arms)",
        },
        {
          Dimension: "Actionless data usage",
          "GR00T N1": "Yes (latent codebook + IDM pseudo-actions)",
          OpenVLA: "No (requires action labels)",
          HPT: "Partial (human video via separate stem)",
          pi0: "No (requires action labels)",
        },
        {
          Dimension: "Open weights",
          "GR00T N1": "Yes (Hugging Face)",
          OpenVLA: "Yes",
          HPT: "Yes (GitHub)",
          pi0: "No",
        },
      ],
    },

    // 6. Training Data Requirements
    {
      type: "prose",
      heading: "Training Data Requirements",
      paragraphs: [
        "GR00T N1 trains on a heterogeneous mixture spanning three data layers. Layer 1 is real robot trajectories with ground-truth action labels -- teleoperated demonstrations on platforms like the Fourier GR-1 humanoid and ALOHA bimanual arms. These trajectories provide multi-view RGB frames, joint-position recordings, and end-effector poses at 10-50 Hz, paired with natural language task descriptions. The Open X-Embodiment dataset is also used for cross-embodiment pretraining.",
        "Layer 2 is human egocentric video without action labels. GR00T N1 uses large-scale human activity datasets where a person performs manipulation tasks filmed from a head-mounted or chest-mounted camera. To extract training signal from these videos, a VQ-VAE model is trained on consecutive frame pairs to learn a latent-action codebook. The resulting discrete latent actions serve as pseudo-action targets during flow-matching training, with the human video treated as a separate 'embodiment' with its own encoder/decoder.",
        "Layer 3 is synthetically generated data -- video trajectories produced by neural video generation models or physics simulators. For neural-generated videos, a Diffusion Transformer-based inverse dynamics model (IDM) is trained to predict actions from observation pairs. For simulator data (e.g., from NVIDIA Isaac Sim), ground-truth actions are available directly. Synthetic data is particularly valuable for scaling the diversity of tasks and environments beyond what is practical to collect physically.",
        "For teams fine-tuning GR00T N1 on a new humanoid platform or task set, NVIDIA's documentation recommends starting with 500-2,000 high-quality teleoperated demonstrations per task family on the target embodiment. For new embodiment integration where the model has no prior exposure to the robot's morphology, 5,000-20,000 demonstrations covering locomotion, manipulation, and whole-body coordination are recommended. The data should include multi-view RGB from at least 2 cameras, full joint-state recordings at 50+ Hz, and natural language task labels.",
      ],
    },

    // 7. How Claru Data Integrates
    {
      type: "prose",
      heading: "How Claru Data Integrates with GR00T N1",
      paragraphs: [
        "Claru provides data for all three layers of GR00T N1's training mixture. For Layer 1 (real robot trajectories), we collect teleoperated demonstrations on humanoid and bimanual platforms with multi-view RGB cameras, full joint-state recordings at 50 Hz, and calibrated camera intrinsics/extrinsics. Our data includes natural language task descriptions and trajectory-level success labels, matching the format GR00T N1's training pipeline expects.",
        "For Layer 2 (human video), Claru's catalog of 3M+ egocentric human activity videos provides a rich source of manipulation knowledge. Our egocentric footage spans kitchen tasks, tool use, object rearrangement, personal care, and industrial assembly -- all captured from head-mounted or chest-mounted cameras with verified temporal segmentation. This data can be used to train the VQ-VAE latent-action codebook that GR00T N1 uses to extract pseudo-actions from human video.",
        "For Layer 3 (synthetic data), Claru can provide curated simulation datasets generated in NVIDIA Isaac Sim and other physics engines, with ground-truth action labels and domain-randomized visual conditions. We also provide the paired observation sequences needed to train the inverse dynamics model used for pseudo-action labeling of neural-generated video. All data is delivered in LeRobot-compatible HDF5 format with the metadata schema GR00T N1's open-source training code expects.",
      ],
    },

    // 8. References
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "nvidia-groot-n1-2025",
          title:
            "GR00T N1: An Open Foundation Model for Generalist Humanoid Robots",
          authors: "Bjorck et al.",
          venue: "arXiv 2503.14734",
          year: 2025,
          url: "https://arxiv.org/abs/2503.14734",
        },
        {
          id: "black-pi0-2024",
          title:
            "pi0: A Vision-Language-Action Flow Model for General Robot Control",
          authors: "Black et al.",
          venue: "arXiv 2410.24164",
          year: 2024,
          url: "https://arxiv.org/abs/2410.24164",
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
          id: "lipman-flow-2023",
          title: "Flow Matching for Generative Modeling",
          authors: "Lipman et al.",
          venue: "ICLR 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2210.02747",
        },
        {
          id: "shi-eagle2-2025",
          title:
            "Eagle 2: Building Post-Training Data Strategies from Scratch for Frontier Vision-Language Models",
          authors: "Shi et al.",
          venue: "arXiv 2501.14818",
          year: 2025,
          url: "https://arxiv.org/abs/2501.14818",
        },
      ],
    },
  ],

  // ---------------------------------------------------------------------------
  // FAQs
  // ---------------------------------------------------------------------------
  faqs: [
    {
      question: "Is GR00T N1 open source?",
      answer:
        "Yes. NVIDIA released GR00T-N1-2B as an open foundation model in March 2025, with model weights available on Hugging Face and training/fine-tuning code on GitHub (NVIDIA/Isaac-GR00T). The model can be fine-tuned for specific humanoid platforms and tasks using standard PyTorch workflows. Subsequent versions (N1.5, N1.6) have also been released with improved performance.",
    },
    {
      question: "What robot platforms does GR00T N1 support?",
      answer:
        "GR00T N1 uses embodiment-specific encoders and decoders that can adapt to any robot morphology. The published model was validated on the Fourier GR-1 humanoid (for bimanual manipulation), ALOHA bimanual arms, and standard single-arm setups. For new platforms, fine-tuning with embodiment-specific demonstrations is required. The encoder/decoder design means the shared VLM and Diffusion Transformer trunk transfer across embodiments.",
    },
    {
      question: "How does GR00T N1 learn from human videos without action labels?",
      answer:
        "GR00T N1 trains a VQ-VAE model on consecutive video frame pairs to learn a discrete latent-action codebook. For each pair of consecutive frames in a human video, the VQ-VAE encoder extracts a continuous embedding that is mapped to the nearest codebook entry. These discrete latent actions serve as pseudo-action targets during flow-matching training, with the human video treated as a separate embodiment with its own encoder/decoder pair. This allows the model to extract manipulation knowledge from millions of human activity videos.",
    },
    {
      question: "How much compute does GR00T N1 pretraining require?",
      answer:
        "The published GR00T-N1-2B model required approximately 50,000 NVIDIA H100 GPU hours for pretraining, using up to 1,024 GPUs in a single training run. Fine-tuning on a new embodiment or task set is significantly less expensive -- typically feasible on 8-64 GPUs over a few days, depending on the dataset size and desired level of adaptation.",
    },
    {
      question: "What data format does Claru deliver for GR00T N1?",
      answer:
        "Claru delivers datasets in LeRobot-compatible HDF5 format matching GR00T N1's open-source training code expectations. Each dataset includes multi-view RGB images, full joint-state recordings at 50+ Hz, natural language task descriptions, and camera calibration files. For human video data, we provide egocentric footage with temporal segmentation suitable for VQ-VAE latent-action codebook training. All data includes trajectory-level success labels and quality metadata.",
    },
  ],

  // ---------------------------------------------------------------------------
  // CTA
  // ---------------------------------------------------------------------------
  ctaHeading: "Get GR00T N1-Ready Training Data",
  ctaDescription:
    "Tell us about your GR00T N1 project -- target humanoid platform, task families, and deployment environment -- and we will deliver multi-modal datasets formatted for GR00T N1's three-layer training pipeline.",

  // ---------------------------------------------------------------------------
  // Cross-links
  // ---------------------------------------------------------------------------
  relatedGlossaryTerms: [
    "groot-n1",
    "humanoid-robot",
    "foundation-model-robotics",
    "world-model",
    "vla",
  ],
  relatedGuidePages: [
    "how-to-collect-teleoperation-data",
    "how-to-build-a-cross-embodiment-dataset",
  ],
  relatedSolutionSlugs: [],

  // ---------------------------------------------------------------------------
  // Model metadata
  // ---------------------------------------------------------------------------
  modelName: "GR00T N1",
  organization: "NVIDIA",
  year: 2025,

  inputSpec: {
    observationFormat:
      "Multi-view RGB images at configurable resolution + proprioceptive state (joint positions, velocities)",
    actionFormat:
      "Continuous joint-position targets via Diffusion Transformer with action flow matching; embodiment-specific encoders/decoders handle variable DoF",
    languageConditioning:
      "Natural language instructions processed by Eagle-2 VLM (SigLIP-2 + SmolLM2); also supports video demonstration conditioning",
    controlFrequency:
      "System 2 at 10 Hz (reasoning); System 1 at higher rates (motor control)",
  },

  dataVolumeBenchmarks:
    "GR00T N1 trains on a heterogeneous data mixture spanning three layers. Layer 1 is real robot trajectories -- teleoperated demonstrations on humanoid and bimanual platforms with ground-truth action labels. This includes data from the Fourier GR-1 humanoid, ALOHA bimanual arms, and the Open X-Embodiment collection (800K+ episodes across 22 robot embodiments). Layer 2 is human egocentric video -- large-scale human activity datasets captured from head-mounted cameras, processed through a VQ-VAE latent-action codebook to extract pseudo-actions from consecutive frame pairs. Layer 3 is synthetically generated data from physics simulators (NVIDIA Isaac Sim) and neural video generation models, with actions inferred via trained inverse dynamics models. The total data mixture is not publicly quantified, but the model's 50,000 H100 GPU hour training budget and 1,024-GPU training runs indicate a dataset on the order of millions of trajectories across all three layers. For fine-tuning on new embodiments, NVIDIA recommends 500-2,000 demonstrations per task family for task adaptation on a supported platform, and 5,000-20,000 demonstrations for full new-embodiment integration covering locomotion, manipulation, and whole-body tasks. Each demonstration should include multi-view RGB at minimum 2 camera views, full joint-state recordings at 50+ Hz, and natural language task descriptions. The GR00T-N1-2B model has 2.2B total parameters (1.34B in the Eagle-2 VLM backbone), making it significantly more parameter-efficient than many VLA alternatives while maintaining strong cross-embodiment generalization.",

  trainingRecipe:
    "GR00T N1's training is end-to-end across both systems. The Eagle-2 VLM (System 2) is initialized from pretrained SmolLM2 (language) and SigLIP-2 (vision) weights. The Diffusion Transformer (System 1) is trained with action flow matching, where the model learns to denoise random Gaussian noise into valid action sequences conditioned on the VLM's output tokens. Training samples batches uniformly across the three data layers: real robot trajectories (with ground-truth actions), human egocentric video (with VQ-VAE latent pseudo-actions), and synthetic trajectories (with ground-truth or IDM-predicted actions). Each data source is treated as a separate embodiment with its own proprioceptive encoder and action decoder, while the VLM and Diffusion Transformer trunk are shared. The VQ-VAE latent-action codebook is trained as a preprocessing step: a VQ-VAE model is trained on pairs of consecutive video frames to learn a discrete codebook of 'latent actions' that describe frame-to-frame transitions. For neural-generated video, a separate Diffusion Transformer IDM is trained to predict actions from observation pairs. The main model training uses a composite loss combining the flow-matching denoising loss on actions with standard VLM language modeling objectives. Pretraining of GR00T-N1-2B used approximately 50,000 H100 GPU hours on clusters of up to 1,024 GPUs. Fine-tuning for specific embodiments freezes the VLM backbone and updates only the Diffusion Transformer and embodiment-specific encoder/decoder heads, typically requiring 8-64 GPUs for a few days.",

  claruIntegration:
    "Claru provides data across all three layers of GR00T N1's training mixture. For real robot trajectories (Layer 1), we deliver teleoperated demonstrations on humanoid and bimanual platforms with multi-view RGB, full joint-state recordings at 50+ Hz, and natural language task labels in LeRobot-compatible HDF5 format. For human video (Layer 2), our catalog of 3M+ egocentric activity videos -- spanning kitchen tasks, tool use, assembly, and daily activities from head-mounted cameras -- provides the raw footage needed to train GR00T N1's VQ-VAE latent-action codebook. For synthetic data (Layer 3), we provide curated simulation datasets from NVIDIA Isaac Sim with ground-truth actions and domain-randomized visuals. All deliverables include camera calibration, trajectory success labels, and quality metadata. We support fine-tuning workflows for new humanoid embodiments with 500-20,000 demonstration packages tailored to your platform's DoF count and task families.",

  keyPapers: [
    {
      id: "nvidia-groot-n1-2025",
      title:
        "GR00T N1: An Open Foundation Model for Generalist Humanoid Robots",
      authors: "Bjorck et al.",
      venue: "arXiv 2503.14734",
      year: 2025,
      url: "https://arxiv.org/abs/2503.14734",
    },
    {
      id: "black-pi0-2024",
      title:
        "pi0: A Vision-Language-Action Flow Model for General Robot Control",
      authors: "Black et al.",
      venue: "arXiv 2410.24164",
      year: 2024,
      url: "https://arxiv.org/abs/2410.24164",
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
      id: "lipman-flow-2023",
      title: "Flow Matching for Generative Modeling",
      authors: "Lipman et al.",
      venue: "ICLR 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2210.02747",
    },
    {
      id: "shi-eagle2-2025",
      title:
        "Eagle 2: Building Post-Training Data Strategies from Scratch for Frontier Vision-Language Models",
      authors: "Shi et al.",
      venue: "arXiv 2501.14818",
      year: 2025,
      url: "https://arxiv.org/abs/2501.14818",
    },
  ],
};

export default data;
