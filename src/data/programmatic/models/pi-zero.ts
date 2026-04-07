import type { ModelPageData } from "../types";

const data: ModelPageData = {
  slug: "pi-zero",
  metaTitle: "Training Data for Pi-Zero (pi0) | Data Requirements & Formats | Claru",
  metaDescription:
    "Complete guide to pi0 training data: flow matching action format, multi-view observation spec, cross-embodiment volumes, and Claru-delivered pi0-ready datasets.",
  primaryKeyword: "pi-zero (pi0) training data",
  secondaryKeywords: [
    "pi-zero data requirements",
    "pi0 dataset format",
    "data for pi-zero",
    "pi-zero fine-tuning data",
    "physical intelligence pi0",
    "flow matching robot data",
    "vla training data",
  ],
  canonicalPath: "/models/pi-zero",
  h1: "Training Data for Pi-Zero (pi0)",
  heroSubtitle:
    "Everything you need to know about pi0's data requirements — flow matching action format, multi-view observation spec, cross-embodiment volume benchmarks, and how Claru delivers pi0-ready datasets for fine-tuning and evaluation.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Models", href: "/models" },
    { label: "Pi-Zero (pi0)", href: "/models/pi-zero" },
  ],

  sections: [
    {
      type: "prose",
      heading: "What Is Pi-Zero (pi0)?",
      paragraphs: [
        "Pi-Zero (pi0) is a vision-language-action (VLA) model introduced by Physical Intelligence in October 2024. It is the first generalist robot policy to demonstrate competence across a wide range of dexterous manipulation tasks — from folding laundry and assembling boxes to bussing tables — using a single set of weights. The key insight behind pi0 is that a pre-trained vision-language model (VLM) can serve as a universal robot backbone when coupled with an expressive action generation mechanism.",
        "Unlike prior VLAs such as RT-2 or OpenVLA that tokenize actions into discrete bins, pi0 generates continuous action trajectories via flow matching. Flow matching learns a vector field that maps a Gaussian noise distribution to the target action distribution in a single forward pass at inference time. This avoids the lossy discretization of high-dimensional action spaces and is significantly faster than iterative diffusion sampling, enabling real-time 50 Hz control on physical hardware.",
        "The pi0 architecture begins with a 3-billion-parameter PaLI-based VLM backbone pre-trained on internet-scale image-text data. During robot pre-training, the model ingests multi-view RGB images and a natural language instruction, encodes them through the VLM trunk, and passes the resulting latent representation to a flow matching action head. The action head outputs action chunks — sequences of 50 future waypoints at 50 Hz — that are sent directly to the robot's low-level controller.",
        "Physical Intelligence demonstrated pi0 on seven distinct robot embodiments including bi-manual ALOHA setups, single-arm Franka Pandas, and mobile manipulators. The paper reports that pi0 achieves state-of-the-art performance on standard benchmarks and, more importantly, solves real-world dexterous tasks that no prior generalist policy had addressed, such as folding multiple garment types and loading a dishwasher from a cluttered counter.",
      ],
    },
    {
      type: "stats",
      heading: "Key Metrics from the Paper",
      stats: [
        { value: "3B", label: "VLM backbone parameters" },
        { value: "50 Hz", label: "Action output frequency" },
        { value: "7+", label: "Robot embodiments trained" },
        { value: "10K+", label: "Cross-embodiment demonstrations" },
        { value: "50", label: "Action chunk length (timesteps)" },
        { value: "24-dim", label: "Typical action vector (bi-manual)" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Pi-Zero (pi0) Input/Output Specification",
      columns: ["Parameter", "Specification"],
      rows: [
        {
          Parameter: "Observation Format",
          Specification:
            "Multi-view RGB images (224x224 per view, typically 2-3 cameras) + natural language instruction",
        },
        {
          Parameter: "Action Format",
          Specification:
            "Continuous action chunks — 50 timesteps of joint positions or end-effector deltas, output as a single trajectory via flow matching",
        },
        {
          Parameter: "Language Conditioning",
          Specification:
            "Natural language task instructions processed by the VLM backbone (PaLI-based, pre-trained on web data)",
        },
        {
          Parameter: "Control Frequency",
          Specification:
            "50 Hz (action chunks decoded in one forward pass, streamed to low-level controller)",
        },
        {
          Parameter: "Proprioception",
          Specification:
            "Joint positions and velocities concatenated as auxiliary input tokens",
        },
        {
          Parameter: "Action Dimensionality",
          Specification:
            "Variable per embodiment: 7-DoF for single-arm, up to 24-DoF for bi-manual setups including dual grippers",
        },
      ],
    },
    {
      type: "prose",
      heading: "Architecture and Key Innovations",
      paragraphs: [
        "The core innovation in pi0 is the marriage of a pre-trained VLM with a flow matching action head. The VLM backbone — a PaLI variant with roughly 3B parameters — processes interleaved image and text tokens. Rather than auto-regressively decoding discretized action tokens (as in RT-2), pi0 attaches a lightweight MLP action head that is trained with the flow matching objective from Lipman et al. (2023). During training, the head learns to denoise a randomly sampled noise vector into the target action chunk, conditioned on the VLM's latent representation. At inference, a single forward pass through the denoising network produces the full 50-step action trajectory.",
        "This design has three practical consequences for data. First, because action generation is continuous, there is no discretization bottleneck — the model can represent the full precision of the action signal, which matters for tasks like cloth folding where sub-millimeter gripper precision is needed. Second, the flow matching head is much cheaper to train than a full diffusion model; a single denoising step replaces the 50-100 steps typical in DDPM-based policies. Third, the action chunk formulation naturally handles temporal coherence — the 50-step output is a smooth trajectory, not a sequence of independent decisions.",
        "Cross-embodiment training is achieved through embodiment-specific action heads that share the same VLM backbone. Each robot platform defines its own action dimensionality and normalization scheme, but the visual-language understanding is shared. This means that demonstrations from a Franka Panda performing pick-and-place tasks improve the model's language grounding even for an ALOHA robot performing different tasks. The shared trunk acts as a universal visual-semantic encoder, while the per-embodiment heads translate that understanding into hardware-specific motor commands.",
        "Physical Intelligence also introduced a post-training fine-tuning recipe where pi0 is further tuned on a narrow task distribution with as few as 100-200 demonstrations. This fine-tuning stage uses a lower learning rate and shorter training schedule, and the paper shows that it consistently improves performance on the target task without degrading the model's generalist capabilities.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Pi-Zero vs Related Vision-Language-Action Models",
      columns: ["Feature", "pi0 (2024)", "RT-2 (2023)", "OpenVLA (2024)", "Octo (2024)"],
      rows: [
        {
          Feature: "Action Generation",
          "pi0 (2024)": "Flow matching (continuous)",
          "RT-2 (2023)": "Tokenized (256 bins)",
          "OpenVLA (2024)": "Tokenized (256 bins)",
          "Octo (2024)": "Diffusion (iterative)",
        },
        {
          Feature: "VLM Backbone",
          "pi0 (2024)": "PaLI-based, 3B params",
          "RT-2 (2023)": "PaLI-X, 55B params",
          "OpenVLA (2024)": "Prismatic (SigLIP + DinoV2), 7B",
          "Octo (2024)": "Custom Transformer, 93M",
        },
        {
          Feature: "Action Frequency",
          "pi0 (2024)": "50 Hz",
          "RT-2 (2023)": "1-3 Hz",
          "OpenVLA (2024)": "1-5 Hz",
          "Octo (2024)": "4-10 Hz",
        },
        {
          Feature: "Cross-Embodiment",
          "pi0 (2024)": "7+ platforms",
          "RT-2 (2023)": "1 (Everyday Robot)",
          "OpenVLA (2024)": "22+ via Open X-Embodiment",
          "Octo (2024)": "22+ via Open X-Embodiment",
        },
        {
          Feature: "Open Weights",
          "pi0 (2024)": "No (proprietary)",
          "RT-2 (2023)": "No",
          "OpenVLA (2024)": "Yes",
          "Octo (2024)": "Yes",
        },
        {
          Feature: "Dexterous Tasks",
          "pi0 (2024)": "Folding, assembly, cooking",
          "RT-2 (2023)": "Pick/place, drawers",
          "OpenVLA (2024)": "Pick/place, drawers",
          "Octo (2024)": "Pick/place, basic manipulation",
        },
      ],
    },
    {
      type: "prose",
      heading: "Training Data Requirements",
      paragraphs: [
        "Pi-zero's training proceeds in three phases, each with distinct data requirements. Phase 1 is VLM pre-training on internet-scale image-text data (billions of image-text pairs). This phase uses the standard PaLI pre-training mix and is not specific to robotics. Phase 2 is cross-embodiment robot pre-training, where the model is trained on a diverse mixture of robot demonstration datasets spanning multiple hardware platforms. Physical Intelligence used a proprietary dataset of over 10,000 demonstrations across 7+ embodiments, supplemented by publicly available datasets. Phase 3 is task-specific fine-tuning on 100-1,000 high-quality demonstrations per target task.",
        "For teams building their own pi0-style pipelines, the critical data requirements center on Phase 2 and Phase 3. Robot demonstrations must include synchronized multi-view RGB images (typically 2-3 camera angles), continuous joint-state trajectories recorded at 50 Hz or higher, natural language task descriptions, and optionally proprioceptive signals such as joint torques and end-effector force/torque readings. The multi-view requirement is essential because pi0 uses cross-view attention to build spatial representations — a single wrist camera is insufficient for most manipulation tasks.",
        "Action labels must be continuous and high-frequency. Unlike RT-1 or RT-2 which operate at 3 Hz with discretized actions, pi0 expects dense 50 Hz joint position or end-effector delta trajectories. This means teleoperation systems must record at at least 50 Hz with sub-degree joint accuracy. For bi-manual setups (e.g., ALOHA), each demonstration contains a 24-dimensional action vector per timestep (7 joints + gripper per arm, times two arms), resulting in approximately 1,200 action dimensions per second of demonstration.",
        "Data diversity is more important than per-task volume. The paper demonstrates that cross-embodiment pre-training with heterogeneous data from multiple robot platforms significantly improves generalization, even when the target robot is not represented in the pre-training mix. For fine-tuning, the paper reports strong results with as few as 150 demonstrations per task when building on the pre-trained checkpoint, but emphasizes that demonstration quality — measured by task completion rate, smooth trajectories, and absence of pauses or recoveries — is critical.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Data Integrates with Pi-Zero (pi0)",
      paragraphs: [
        "Claru provides data compatible with pi0's demanding multi-view, high-frequency requirements. Our collection infrastructure captures synchronized multi-camera RGB streams at 60 Hz with hardware-triggered frame alignment, exceeding pi0's 50 Hz minimum. We record full proprioceptive state — joint positions, velocities, torques, and end-effector wrenches — alongside the visual streams, enabling teams to train with or without auxiliary proprioceptive inputs.",
        "For language conditioning, Claru's annotation pipeline generates hierarchical language descriptions: a concise task instruction (e.g., 'fold the blue shirt'), a step-level narration (e.g., 'grasp the right sleeve, fold it toward center'), and detailed per-timestep commentary where required. This multi-granularity annotation supports both the coarse task-level conditioning pi0 uses during pre-training and the fine-grained language grounding that improves generalization.",
        "Claru delivers datasets in formats directly consumable by pi0-style training pipelines, including RLDS (for TensorFlow-based workflows) and LeRobot HDF5 (for PyTorch). Our conversion pipeline handles action normalization per-embodiment, camera intrinsic/extrinsic calibration metadata, and episode-level quality scores. We also provide data provenance documentation covering collection environment, operator skill level, and hardware configuration — metadata that is essential for diagnosing training failures and understanding distribution shift.",
      ],
    },
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "black-pi0-2024",
          title:
            "\u03c00: A Vision-Language-Action Flow Model for General Robot Control",
          authors: "Black, K., Brown, N., Driess, D., Esmail, A., et al.",
          venue: "arXiv 2410.24164",
          year: 2024,
          url: "https://arxiv.org/abs/2410.24164",
        },
        {
          id: "lipman-flow-2023",
          title: "Flow Matching for Generative Modeling",
          authors: "Lipman, Y., Chen, R. T. Q., Ben-Hamu, H., Nickel, M.",
          venue: "ICLR 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2210.02747",
        },
        {
          id: "chi-diffusion-2023",
          title:
            "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
          authors: "Chi, C., Feng, S., Du, Y., Xu, Z., et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2303.04137",
        },
        {
          id: "brohan-rt2-2023",
          title:
            "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
          authors: "Brohan, A., Brown, N., Carbajal, J., et al.",
          venue: "arXiv 2307.15818",
          year: 2023,
          url: "https://arxiv.org/abs/2307.15818",
        },
        {
          id: "kim-openvla-2024",
          title:
            "OpenVLA: An Open-Source Vision-Language-Action Model",
          authors: "Kim, M. J., Pertsch, K., Karamcheti, S., et al.",
          venue: "arXiv 2406.09246",
          year: 2024,
          url: "https://arxiv.org/abs/2406.09246",
        },
        {
          id: "team-octo-2024",
          title:
            "Octo: An Open-Source Generalist Robot Policy",
          authors: "Ghosh, D., Walke, H., Pertsch, K., Black, K., et al.",
          venue: "arXiv 2405.12213",
          year: 2024,
          url: "https://arxiv.org/abs/2405.12213",
        },
      ],
    },
  ],

  faqs: [
    {
      question:
        "How does pi0's flow matching differ from Diffusion Policy's denoising approach?",
      answer:
        "Both flow matching and diffusion produce continuous action outputs, but they differ in inference cost and training objective. Diffusion Policy uses DDPM-style iterative denoising — typically 50-100 steps per action chunk — making it too slow for real-time 50 Hz control without acceleration tricks. Flow matching learns a direct vector field from noise to the action distribution and generates the full trajectory in a single forward pass. In practice this makes pi0 roughly 50x faster at inference than an unaccelerated Diffusion Policy, which is why Physical Intelligence was able to deploy it at 50 Hz on physical hardware.",
    },
    {
      question:
        "What recording frequency do I need for pi0-compatible demonstrations?",
      answer:
        "Pi0 operates at 50 Hz action output, so your teleoperation recordings should capture joint states at 50 Hz or higher to avoid aliasing. Camera frames at 30 Hz are acceptable since the model interpolates visual features, but 50+ Hz is preferred. Critically, all sensor streams must be hardware-synchronized — even 10ms of misalignment between cameras and joint encoders can degrade action chunk quality. Claru's collection infrastructure uses hardware-triggered synchronization at 60 Hz across all modalities.",
    },
    {
      question: "Can I fine-tune a pi0-style model with only 100 demonstrations?",
      answer:
        "Yes, but only if you start from a strong pre-trained checkpoint. The pi0 paper shows that 100-200 demonstrations per task are sufficient for fine-tuning when the base model has been pre-trained on diverse cross-embodiment data. Without this pre-training, 100 demonstrations would not be enough — you would need thousands. The quality of those demonstrations matters enormously: they should be smooth, successful completions without pauses, restarts, or recoveries. Claru's operators are trained to produce demonstration-quality trajectories that meet these criteria.",
    },
    {
      question:
        "Does pi0 support different robot hardware, and what does that mean for my data?",
      answer:
        "Pi0 supports cross-embodiment training through hardware-specific action heads that share a common VLM backbone. Each embodiment defines its own action dimensionality (e.g., 7-DoF for a single Franka arm, 14-DoF for dual-arm ALOHA) and normalization. When collecting data, you must record in your robot's native action space — pi0 does not require a canonical action format. However, if you plan to benefit from cross-embodiment pre-training, including data from other platforms in the mix will improve your results even if those platforms are different from your target hardware.",
    },
    {
      question:
        "What is the minimum data I need to pre-train a pi0-style model from scratch?",
      answer:
        "Full pi0-style pre-training requires two data sources: (1) internet-scale image-text data for VLM pre-training (billions of pairs, typically handled by starting from a public VLM checkpoint), and (2) a cross-embodiment robot dataset with at least 5,000-10,000 diverse demonstrations across multiple platforms and tasks. The paper uses a proprietary dataset of this scale. For teams without access to that volume, starting from a public VLM backbone (such as PaLI or LLaVA) and fine-tuning on 1,000-5,000 demonstrations from your target domain is a practical alternative. Claru can supply the cross-embodiment demonstration data to bootstrap this pre-training stage.",
    },
  ],

  ctaHeading: "Get Data Formatted for Pi-Zero (pi0)",
  ctaDescription:
    "Tell us about your pi0 project — target embodiment, task distribution, and volume — and we will deliver multi-view, 50 Hz demonstration datasets in the exact format your training pipeline requires.",
  relatedGlossaryTerms: [
    "vla",
    "diffusion-policy",
    "foundation-model-robotics",
    "visuomotor-policy",
    "flow-matching",
  ],
  relatedGuidePages: [
    "how-to-create-action-labels-for-vla",
    "how-to-train-a-diffusion-policy",
  ],
  relatedSolutionSlugs: ["vla-training-data"],

  modelName: "Pi-Zero (pi0)",
  organization: "Physical Intelligence",
  year: 2024,
  inputSpec: {
    observationFormat:
      "Multi-view RGB images (224x224 per view, 2-3 cameras) + natural language instruction",
    actionFormat:
      "Continuous action chunks — 50 timesteps of joint positions or end-effector deltas via flow matching",
    languageConditioning:
      "Natural language instructions processed by PaLI-based VLM backbone pre-trained on web data",
    controlFrequency: "50 Hz (action chunks decoded in a single forward pass)",
  },

  dataVolumeBenchmarks:
    "Pi0's training proceeds in three distinct data phases. Phase 1 uses internet-scale VLM pre-training (billions of image-text pairs, inherited from the PaLI backbone). Phase 2 is cross-embodiment robot pre-training on a proprietary dataset of over 10,000 demonstrations spanning 7+ robot platforms — including single-arm Franka Pandas, bi-manual ALOHA setups, and mobile manipulators — covering hundreds of distinct tasks across tabletop manipulation, cooking, laundry, and assembly domains. Phase 3 is task-specific fine-tuning, where the paper reports strong results with 100-1,000 demonstrations per task. Critically, demonstrations must be recorded at 50 Hz or higher with multi-view RGB and full proprioceptive state. For bi-manual tasks, each second of demonstration contains ~1,200 action dimensions (24 DoF x 50 Hz). The paper emphasizes that data diversity — variety of tasks, objects, environments, and embodiments — matters more than per-task volume for the pre-training phase.",

  trainingRecipe:
    "Pi0 training starts from a 3B-parameter PaLI-based VLM checkpoint pre-trained on internet-scale image-text data. Phase 2 (robot pre-training) attaches a flow matching action head — a lightweight MLP that takes the VLM's latent representation and a noise vector as input and outputs a denoised 50-step action chunk. The flow matching objective trains this head to learn a vector field mapping Gaussian noise to the target action distribution, following Lipman et al. (2023). Training uses cross-embodiment data with embodiment-specific action normalization. Each embodiment gets its own action head parameters while sharing the VLM backbone. Phase 2 trains for several hundred thousand steps on TPU pods. Phase 3 (fine-tuning) uses a reduced learning rate (typically 10x lower) and a narrow task distribution of 100-1,000 demonstrations. The fine-tuning stage trains for 10,000-50,000 steps and preserves generalist capabilities while boosting target-task success rate by 20-40 percentage points. At inference, a single forward pass through the flow matching head produces the complete 50-step action trajectory, enabling real-time 50 Hz control without iterative denoising.",

  claruIntegration:
    "Claru provides pi0-compatible data with synchronized multi-view RGB at 60 Hz (exceeding pi0's 50 Hz minimum), full proprioceptive recordings (joint positions, velocities, torques, end-effector wrenches), and hierarchical language annotations at task, step, and timestep granularity. Our collection infrastructure uses hardware-triggered frame synchronization to ensure sub-millisecond alignment across all sensor modalities — a strict requirement for pi0's action chunk training. We deliver in RLDS and LeRobot HDF5 formats with per-embodiment action normalization, camera calibration metadata, and episode-level quality scores. For teams bootstrapping cross-embodiment pre-training, Claru can supply diverse demonstration data across multiple robot platforms to seed the pre-training phase before task-specific fine-tuning.",

  keyPapers: [
    {
      id: "black-pi0-2024",
      title:
        "\u03c00: A Vision-Language-Action Flow Model for General Robot Control",
      authors: "Black, K., Brown, N., Driess, D., Esmail, A., et al.",
      venue: "arXiv 2410.24164",
      year: 2024,
      url: "https://arxiv.org/abs/2410.24164",
    },
    {
      id: "lipman-flow-2023",
      title: "Flow Matching for Generative Modeling",
      authors: "Lipman, Y., Chen, R. T. Q., Ben-Hamu, H., Nickel, M.",
      venue: "ICLR 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2210.02747",
    },
    {
      id: "chi-diffusion-2023",
      title:
        "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi, C., Feng, S., Du, Y., Xu, Z., et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137",
    },
    {
      id: "brohan-rt2-2023",
      title:
        "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan, A., Brown, N., Carbajal, J., et al.",
      venue: "arXiv 2307.15818",
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
      id: "team-octo-2024",
      title: "Octo: An Open-Source Generalist Robot Policy",
      authors: "Ghosh, D., Walke, H., Pertsch, K., Black, K., et al.",
      venue: "arXiv 2405.12213",
      year: 2024,
      url: "https://arxiv.org/abs/2405.12213",
    },
  ],
};

export default data;
