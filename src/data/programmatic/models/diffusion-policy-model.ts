import type { ModelPageData } from "../types";

const data: ModelPageData = {
  slug: "diffusion-policy-model",
  metaTitle: "Training Data for Diffusion Policy — Formats, Volumes & Integration | Claru",
  metaDescription:
    "Deep-dive into Diffusion Policy training data: DDPM action denoising, CNN/ViT observation encoders, 100-200 demo sample efficiency, HDF5/zarr formats, and Claru integration.",
  primaryKeyword: "Diffusion Policy training data",
  secondaryKeywords: [
    "diffusion policy robot data",
    "diffusion policy data requirements",
    "DDPM robot manipulation",
    "action diffusion training data",
    "Chi et al diffusion policy",
  ],
  canonicalPath: "/models/diffusion-policy-model",
  h1: "Training Data for Diffusion Policy",
  heroSubtitle:
    "Diffusion Policy applies denoising diffusion probabilistic models (DDPM) to robot action generation, predicting temporally-correlated action chunks by iteratively denoising random Gaussian noise conditioned on visual observations. Introduced by Cheng Chi, Siyuan Feng, and colleagues at Columbia, MIT, and Toyota Research Institute in 2023, it achieves 80-90% success rates on manipulation tasks from just 100-200 demonstrations. This page covers its exact data specifications, training procedure, and Claru integration.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Models", href: "/models" },
    { label: "Diffusion Policy", href: "/models/diffusion-policy-model" },
  ],

  // ── Sections ──────────────────────────────────────────────────────────
  sections: [
    // 1. What Is Diffusion Policy?
    {
      type: "prose",
      heading: "What Is Diffusion Policy?",
      paragraphs: [
        "Diffusion Policy is a visuomotor policy learning framework that treats robot action generation as a conditional denoising process. Published at RSS 2023 by Cheng Chi, Siyuan Feng, Yilun Du, Zhenjia Xu, Eric Cousineau, Benjamin Burchfiel, and Shuran Song, it adapts the denoising diffusion probabilistic model (DDPM) framework — originally developed for image generation — to the problem of predicting robot actions from visual observations.",
        "The core idea is elegant: instead of directly predicting what action the robot should take (as in behavioral cloning) or sampling from a learned action distribution (as in a CVAE), Diffusion Policy starts with random Gaussian noise in action space and iteratively refines it into a high-quality action trajectory through a learned denoising process. The denoising is conditioned on the current visual observation, so the same noise can produce different actions depending on what the robot sees.",
        "This approach solves a critical problem in imitation learning: multi-modality. When a human demonstrator picks up a mug, they might reach from the left or the right — both are valid actions for the same observation. Standard behavioral cloning with MSE loss averages these modes, producing an action that reaches toward the middle (which is wrong). Diffusion Policy naturally handles this by learning the full multi-modal distribution and sampling from it, similar to how a diffusion image model can generate diverse images from the same text prompt.",
        "Since its publication, Diffusion Policy has become one of the most widely adopted frameworks for learning manipulation policies from demonstrations. It is used as the policy backbone in UMI (Universal Manipulation Interface), Octo, ALOHA Unleashed, and many industrial deployments. Its combination of sample efficiency (100-200 demonstrations), training speed (2-8 hours on one GPU), and robust multi-modal action generation makes it the default choice for teams that need a reliable manipulation policy without the infrastructure requirements of VLA-scale models.",
      ],
    },

    // 2. Stats
    {
      type: "stats",
      heading: "Diffusion Policy at a Glance",
      stats: [
        { value: "100-200", label: "Demonstrations for 80%+ success" },
        { value: "16", label: "Action chunk length (steps)" },
        { value: "100", label: "DDPM denoising steps (training)" },
        { value: "10-16", label: "DDIM denoising steps (inference)" },
        { value: "2-8 hrs", label: "Training time (1 GPU, 200 demos)" },
        { value: "~40ms", label: "Inference latency (DDIM, 10 steps)" },
      ],
    },

    // 3. Input/Output Specification
    {
      type: "comparison-table",
      heading: "Input / Output Specification",
      columns: ["Parameter", "Specification"],
      rows: [
        { Parameter: "Image observations", Specification: "1-3 camera views at 96x96 to 256x256 RGB; CNN (ResNet-18) or ViT encoder" },
        { Parameter: "Proprioceptive state", Specification: "Optional: EE pose (6-7 dim) or joint positions; concatenated with image features" },
        { Parameter: "Action space", Specification: "Continuous: EE delta (6-7 DoF) or absolute joint positions; dimension configurable" },
        { Parameter: "Action chunk length", Specification: "16 timesteps (configurable; represents observation-to-action horizon)" },
        { Parameter: "Observation horizon", Specification: "2 past observations (current + 1 previous) as default conditioning window" },
        { Parameter: "Diffusion schedule", Specification: "100 DDPM steps (training); 10-16 DDIM steps (inference) with cosine noise schedule" },
        { Parameter: "Control frequency", Specification: "10-50 Hz depending on robot; action chunks provide temporal bridging" },
        { Parameter: "Data format", Specification: "HDF5 or zarr; the robomimic/diffusion_policy codebase supports both" },
      ],
    },

    // 4. Architecture & Key Innovations
    {
      type: "prose",
      heading: "Architecture and Key Innovations",
      paragraphs: [
        "Diffusion Policy offers two observation encoder architectures: a CNN-based variant using ResNet-18 and a transformer-based variant using a ViT backbone. The CNN variant is faster to train and works well at 96x96 resolution; the ViT variant handles higher resolutions (224x224 or 256x256) and generally achieves 3-5% higher success rates at the cost of longer training. Both encoders produce a fixed-dimension feature vector per camera view, which is concatenated across views and optionally with proprioceptive state.",
        "The denoising network itself is a 1D temporal U-Net — a U-Net architecture where the spatial dimensions correspond to time steps in the action sequence rather than image pixels. The network takes as input the noisy action sequence (16 timesteps x action_dim) and the conditioning features from the observation encoder, and predicts the noise to subtract. The U-Net has 4 resolution levels with skip connections, using group normalization and SiLU activations. The conditioning features are injected via FiLM (Feature-wise Linear Modulation) at each resolution level.",
        "Training follows the standard DDPM objective: sample a random timestep t from [1, T=100], add Gaussian noise at level t to the ground-truth action chunk, and train the network to predict the added noise (epsilon-prediction). The cosine noise schedule from Nichol and Dhariwal (2021) is used instead of the original linear schedule, as it provides better gradient signal in the low-noise regime. The loss is simple MSE between predicted and actual noise, with no additional terms or auxiliary losses.",
        "At inference time, Diffusion Policy uses DDIM (Denoising Diffusion Implicit Models) to reduce the number of denoising steps from 100 to 10-16, bringing inference latency from ~400ms to ~40ms. The denoising starts from pure Gaussian noise and iteratively refines it into an action chunk. Temporal ensembling is then applied: the first 8 actions of the 16-step chunk are executed, and the next prediction starts with the remaining 8 as a warm-start, creating overlapping predictions that are averaged with exponential recency weighting.",
        "The observation horizon is a key but often overlooked design choice. Diffusion Policy conditions not just on the current observation but on the 2 most recent observations (a window of 2 timesteps). This provides implicit velocity information — the model can infer the direction of motion from consecutive frames. Expanding this to 3-4 observations provides marginal improvement on most tasks; reducing to 1 observation degrades performance by 5-10% on tasks with fast dynamics.",
      ],
    },

    // 5. Comparison with Related Models
    {
      type: "comparison-table",
      heading: "Comparison with Related Policy Learning Methods",
      columns: ["Attribute", "Diffusion Policy", "ACT (CVAE)", "Behavioral Cloning (MLP)", "IBC (Energy-Based)"],
      rows: [
        { Attribute: "Action generation", "Diffusion Policy": "Iterative denoising (10-100 steps)", "ACT (CVAE)": "Single-pass latent sampling", "Behavioral Cloning (MLP)": "Direct regression", "IBC (Energy-Based)": "Langevin dynamics sampling" },
        { Attribute: "Multi-modality handling", "Diffusion Policy": "Native (full distribution)", "ACT (CVAE)": "Via latent variable z", "Behavioral Cloning (MLP)": "None (mode averaging)", "IBC (Energy-Based)": "Via energy landscape" },
        { Attribute: "Sample efficiency", "Diffusion Policy": "100-200 demos for 80%+", "ACT (CVAE)": "50-200 demos for 80%+", "Behavioral Cloning (MLP)": "500-1000+ demos", "IBC (Energy-Based)": "200-500 demos" },
        { Attribute: "Inference latency", "Diffusion Policy": "~40ms (DDIM 10 steps)", "ACT (CVAE)": "~4ms (single pass)", "Behavioral Cloning (MLP)": "~1ms (single pass)", "IBC (Energy-Based)": "~200ms (Langevin)" },
        { Attribute: "Training time (200 demos)", "Diffusion Policy": "2-8 hours (1 GPU)", "ACT (CVAE)": "25 min (1 GPU)", "Behavioral Cloning (MLP)": "10-30 min (1 GPU)", "IBC (Energy-Based)": "4-12 hours (1 GPU)" },
        { Attribute: "Action chunks", "Diffusion Policy": "Yes (16-step)", "ACT (CVAE)": "Yes (100-step)", "Behavioral Cloning (MLP)": "No (single-step)", "IBC (Energy-Based)": "No (single-step)" },
      ],
    },

    // 6. Training Data Requirements
    {
      type: "prose",
      heading: "Training Data Requirements",
      paragraphs: [
        "Diffusion Policy is designed for task-specific training from modest demonstration datasets. The standard recipe uses 100-200 demonstrations per task, where each demonstration is a full episode from start to successful task completion. Chi et al. report 80-90% success rates on the RoboMimic benchmark tasks (Square, Can, Lift, Tool Hang, Transport) with this data scale, significantly outperforming behavioral cloning baselines trained on the same data.",
        "Each demonstration episode consists of synchronized streams: RGB images from 1-3 cameras at a fixed resolution (96x96 for the CNN encoder, 224x224 or 256x256 for the ViT encoder), and continuous actions at the robot's control frequency (typically 10-20 Hz for EE delta control). Proprioceptive state (joint positions or EE pose) is optional but generally improves performance by 3-5% on tasks with significant contact dynamics. All streams must be temporally aligned within one control timestep.",
        "The data format is either HDF5 or zarr. The diffusion_policy codebase (github.com/real-stanford/diffusion_policy) expects a specific directory structure: each episode in a separate HDF5 file or zarr group, with arrays for /obs/image (uint8), /obs/agent_pos (float32, optional proprioception), and /action (float32). Episode metadata includes the total timestep count. A dataset configuration YAML file specifies normalization ranges, image resolution, action dimension, and horizon lengths.",
        "Data quality for Diffusion Policy has specific nuances. Because the diffusion process learns the full action distribution, it is more tolerant of demonstration variability than MSE-based behavioral cloning — different strategies for the same task are captured as modes rather than averaged. However, the demonstrations must still be successful. Failed demonstrations corrupt the learned distribution by introducing action sequences that do not lead to task completion. A dataset with even 5% failed demonstrations can reduce success rates by 10-15%.",
        "Action normalization is handled by the training pipeline but the raw data must be within reasonable ranges. Actions should be in the robot's native control units (meters for EE position, radians for orientation/joints). The pipeline computes per-dimension min/max statistics and normalizes to [-1, 1]. If your data has outlier actions (e.g., from teleoperator input glitches), these should be clipped or the episodes should be removed, as they will distort the normalization range.",
      ],
    },

    // 7. How Claru Data Integrates
    {
      type: "prose",
      heading: "How Claru Data Integrates with Diffusion Policy",
      paragraphs: [
        "Claru delivers Diffusion Policy-ready datasets in HDF5 or zarr format with the exact directory structure and array layout that the diffusion_policy training codebase expects. Each delivery includes the dataset configuration YAML, pre-computed normalization statistics, and a validation script that verifies format compliance before training.",
        "Our collection pipeline captures multi-view RGB at configurable resolution (96x96 to 256x256) with synchronized proprioceptive state and continuous actions. We support both end-effector delta control (the most common Diffusion Policy configuration) and absolute joint position control. Actions are recorded in the robot's native control units with sub-millisecond temporal alignment across modalities.",
        "Quality control is specifically calibrated for Diffusion Policy's requirements. We verify that all demonstrations are successful completions (no failed episodes), that action magnitudes are within the expected range for the robot (flagging teleoperator input glitches), and that the demonstration set exhibits the diversity needed for multi-modal learning — for example, ensuring that a pick-and-place dataset includes approaches from multiple angles rather than always the same trajectory. We also verify temporal consistency within the observation horizon window (2-frame conditioning).",
        "For teams using the UMI (Universal Manipulation Interface) extension of Diffusion Policy, we provide data collected with handheld grippers that can be deployed on any robot without robot-specific teleoperation hardware. UMI data requires additional calibration metadata (gripper-to-camera transform, fisheye distortion parameters) that we include in every delivery. For teams scaling to multi-task Diffusion Policy, we provide task-conditioned datasets with consistent task labeling across demonstrations.",
      ],
    },

    // 8. Key References
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "chi-diffusion-2023",
          title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
          authors: "Chi et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2303.04137",
        },
        {
          id: "chi-umi-2024",
          title: "Universal Manipulation Interface: In-The-Wild Robot Teaching Without In-The-Wild Robots",
          authors: "Chi et al.",
          venue: "RSS 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2402.10329",
        },
        {
          id: "ho-ddpm-2020",
          title: "Denoising Diffusion Probabilistic Models",
          authors: "Ho et al.",
          venue: "NeurIPS 2020",
          year: 2020,
          url: "https://arxiv.org/abs/2006.11239",
        },
        {
          id: "song-ddim-2021",
          title: "Denoising Diffusion Implicit Models",
          authors: "Song et al.",
          venue: "ICLR 2021",
          year: 2021,
          url: "https://arxiv.org/abs/2010.02502",
        },
        {
          id: "mandlekar-robomimic-2022",
          title: "What Matters in Learning from Offline Human Demonstrations for Robot Manipulation",
          authors: "Mandlekar et al.",
          venue: "CoRL 2021",
          year: 2021,
          url: "https://arxiv.org/abs/2108.03298",
        },
        {
          id: "ze-3ddiffusion-2024",
          title: "3D Diffusion Policy: Generalizable Visuomotor Policy Learning via Simple 3D Representations",
          authors: "Ze et al.",
          venue: "RSS 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2403.03954",
        },
      ],
    },
  ],

  // ── FAQs ──────────────────────────────────────────────────────────────
  faqs: [
    {
      question: "Why is Diffusion Policy better than standard behavioral cloning for manipulation?",
      answer:
        "Standard behavioral cloning uses MSE loss, which averages over multiple valid action modes (e.g., reaching from the left vs. the right). This produces incorrect 'middle' actions. Diffusion Policy learns the full multi-modal action distribution through the denoising process and samples from it at inference time. It also predicts 16-step action chunks, providing temporal coherence that single-step BC lacks. These two properties together explain the 20-40% success rate improvement over MSE-BC on RoboMimic benchmarks.",
    },
    {
      question: "How long does Diffusion Policy inference take, and is it fast enough for real-time control?",
      answer:
        "With DDIM acceleration (10 denoising steps), inference takes approximately 40ms per action chunk prediction on an NVIDIA RTX 3090. Since each prediction produces 16 actions and the first 8 are executed, the effective per-action compute cost is ~5ms. This is fast enough for 10-50 Hz control. The full DDPM (100 steps) takes ~400ms and is too slow for real-time use — DDIM acceleration is essential for deployment.",
    },
    {
      question: "Should I use the CNN or ViT observation encoder variant?",
      answer:
        "The CNN (ResNet-18) variant is faster to train (2-3 hours for 200 demos), works at 96x96 resolution, and is the better default choice. The ViT variant handles higher resolutions (224x224+) and achieves 3-5% higher success on tasks where visual detail matters (e.g., small objects, precise alignment), but takes 6-8 hours to train and requires more GPU memory. Start with CNN; upgrade to ViT if your task requires visual precision.",
    },
    {
      question: "How many demonstrations do I actually need, and what determines the right number?",
      answer:
        "100-200 demonstrations for a single manipulation task achieve 80-90% success rates in the original paper. The key determinant is task variability: if objects always start in roughly the same position, 50 demonstrations may suffice. If there is significant variation in object position, orientation, or clutter, 200+ demonstrations are needed to cover the distribution. For multi-task training, 200-500 demonstrations per task with consistent observation configurations.",
    },
    {
      question: "Can Diffusion Policy work with depth images or point clouds instead of RGB?",
      answer:
        "The original Diffusion Policy uses RGB images, but extensions exist. 3D Diffusion Policy (Ze et al., 2024) replaces the 2D observation encoder with a 3D point cloud encoder and achieves significantly better generalization to novel object poses. This requires depth cameras and point cloud preprocessing. Claru supports data collection with RGB-D cameras and can deliver both RGB-only and point cloud formats depending on which Diffusion Policy variant you are using.",
    },
  ],

  // ── CTA ────────────────────────────────────────────────────────────────
  ctaHeading: "Get Manipulation Data for Diffusion Policy",
  ctaDescription:
    "Tell us about your manipulation task and robot setup. We deliver 100-500 demonstrations in HDF5/zarr format with multi-view RGB, continuous actions, and pre-computed normalization — ready for Diffusion Policy training.",

  // ── Cross-links ────────────────────────────────────────────────────────
  relatedGlossaryTerms: [
    "diffusion-policy",
    "visuomotor-policy",
    "action-chunking",
    "behavioral-cloning",
    "ddpm",
  ],
  relatedGuidePages: [
    "how-to-train-a-diffusion-policy",
    "how-to-build-a-manipulation-dataset",
  ],
  relatedSolutionSlugs: ["manipulation-trajectory-data"],

  // ── Model metadata ────────────────────────────────────────────────────
  modelName: "Diffusion Policy",
  organization: "Columbia / MIT / TRI",
  year: 2023,

  inputSpec: {
    observationFormat:
      "1-3 camera views at 96x96 (CNN) or 224x224 (ViT) RGB + optional proprioceptive state",
    actionFormat:
      "Continuous EE delta or joint positions, predicted as 16-step action chunks via DDPM denoising",
    languageConditioning:
      "Not natively supported in base Diffusion Policy; task identity via separate datasets",
    controlFrequency:
      "10-50 Hz (action chunks at ~25 Hz prediction frequency with 8-step execution overlap)",
  },

  dataVolumeBenchmarks:
    "Diffusion Policy is one of the most sample-efficient manipulation policy frameworks available. Chi et al. (2023) demonstrated 80-90% success rates on the RoboMimic benchmark suite — Square (86.4%), Can (90.0%), Lift (100%), Tool Hang (73.3%), Transport (73.3%) — using 200 demonstrations per task. On real-robot experiments, 100-200 demonstrations per task achieved comparable success rates on pushing, stacking, and pick-and-place. The paper also showed graceful degradation: with only 50 demonstrations, success drops by 10-15% but remains 20-30% higher than MSE-BC baselines at the same data scale. For the UMI extension on real robots, Chi et al. (2024) used 50-100 demonstrations per task with a handheld gripper, achieving 80%+ success on cup arrangement and dish clearing. Training on 200 demonstrations takes approximately 2-8 hours on a single NVIDIA RTX 3090, depending on the observation encoder choice (CNN vs. ViT). Each demonstration episode is typically 30-100 timesteps at 10-20 Hz, totaling 6K-20K individual observation-action pairs for a 200-episode dataset.",

  trainingRecipe:
    "Diffusion Policy training uses the standard DDPM objective with a cosine noise schedule. At each training step, a batch of observation-action sequences is sampled from the dataset. For each sequence, a random diffusion timestep t is drawn from [1, 100], Gaussian noise at level t is added to the ground-truth action chunk (16 steps), and the temporal U-Net is trained to predict the added noise conditioned on the observation features. The observation encoder (ResNet-18 for CNN variant, ViT-S for transformer variant) processes the 2-frame observation window and produces conditioning features injected via FiLM layers at each U-Net resolution level. The loss is MSE between predicted and actual noise, with no additional loss terms. Training uses AdamW optimizer with learning rate 1e-4, batch size 64, and cosine learning rate decay. For 200 demonstrations, training runs for 300 epochs (CNN) or 500 epochs (ViT). Exponential moving average (EMA) of model weights with decay 0.999 is maintained and used for evaluation. At inference time, DDIM with 10-16 steps replaces the full 100-step DDPM for real-time control. Temporal ensembling uses exponential recency weighting with w=0.01 over overlapping 16-step action chunks.",

  claruIntegration:
    "Claru delivers Diffusion Policy-ready datasets in HDF5 or zarr format matching the diffusion_policy codebase structure. Each delivery includes multi-view RGB at configurable resolution (96x96 to 256x256), synchronized proprioceptive state, continuous actions in the robot's native control space, the dataset configuration YAML, pre-computed normalization statistics, and a format validation script. Our QA pipeline verifies all demonstrations are successful completions, actions are within expected magnitude ranges, and the dataset covers sufficient demonstration diversity for multi-modal learning. We support both EE delta and joint position action spaces, and provide UMI-compatible data with handheld gripper calibration metadata where needed.",

  keyPapers: [
    {
      id: "chi-diffusion-2023",
      title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137",
    },
    {
      id: "chi-umi-2024",
      title: "Universal Manipulation Interface: In-The-Wild Robot Teaching Without In-The-Wild Robots",
      authors: "Chi et al.",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2402.10329",
    },
    {
      id: "ho-ddpm-2020",
      title: "Denoising Diffusion Probabilistic Models",
      authors: "Ho et al.",
      venue: "NeurIPS 2020",
      year: 2020,
      url: "https://arxiv.org/abs/2006.11239",
    },
    {
      id: "song-ddim-2021",
      title: "Denoising Diffusion Implicit Models",
      authors: "Song et al.",
      venue: "ICLR 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2010.02502",
    },
    {
      id: "mandlekar-robomimic-2022",
      title: "What Matters in Learning from Offline Human Demonstrations for Robot Manipulation",
      authors: "Mandlekar et al.",
      venue: "CoRL 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2108.03298",
    },
    {
      id: "ze-3ddiffusion-2024",
      title: "3D Diffusion Policy: Generalizable Visuomotor Policy Learning via Simple 3D Representations",
      authors: "Ze et al.",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2403.03954",
    },
  ],
};

export default data;
