import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-train-a-diffusion-policy",
  metaTitle: "How to Train a Diffusion Policy (2026 Guide) | Claru",
  metaDescription: "Step-by-step guide to training a Diffusion Policy for robot manipulation from demonstration data. Covers data prep, architecture choices, hyperparameters, and deployment.",
  primaryKeyword: "how to train a diffusion policy",
  secondaryKeywords: ["diffusion policy training guide", "train diffusion policy robotics", "diffusion policy tutorial", "robot diffusion model training"],
  canonicalPath: "/guides/how-to-train-a-diffusion-policy",
  h1: "How to Train a Diffusion Policy from Demonstration Data",
  heroSubtitle: "A practical guide to training a Diffusion Policy for robot manipulation. Covers data preparation, architecture selection (U-Net vs. Transformer), noise schedule configuration, action chunking parameters, observation horizon tuning, and deployment optimization. Assumes you have a demonstration dataset and want to train a policy that can control a real robot.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Train a Diffusion Policy", href: "/guides/how-to-train-a-diffusion-policy" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Diffusion Policy Outperforms Standard Behavioral Cloning",
      paragraphs: [
        "Diffusion Policy represents a paradigm shift in robot imitation learning. Traditional behavioral cloning maps observations to single actions via a deterministic or Gaussian policy, which fails catastrophically when the demonstration data contains multiple valid strategies for the same observation. Diffusion Policy instead models the full multi-modal action distribution by learning to reverse a noise diffusion process — starting from random Gaussian noise and iteratively denoising it into coherent action sequences conditioned on the current observation.",
        "This multi-modal modeling is critical for real-world robotics. When human demonstrators approach a pick-and-place task, some reach from the left, others from the right. A standard BC policy averages these trajectories, producing an action that reaches straight down the middle — hitting the object instead of grasping it. Diffusion Policy samples from one coherent strategy per inference, producing natural, committed trajectories.",
        "The combination of action chunking (predicting K future actions at once) with the diffusion framework produces temporally consistent plans that execute smoothly on real hardware. This guide covers the practical steps to go from a demonstration dataset to a deployed Diffusion Policy."
      ]
    },
    {
      type: "stats",
      heading: "Diffusion Policy Training Benchmarks",
      stats: [
        { value: "100-200", label: "Demos for single-task manipulation" },
        { value: "2-6 hrs", label: "Training time on A100 (500 demos)" },
        { value: "5-15 Hz", label: "Inference speed with DDIM (10-16 steps)" },
        { value: "20-50%", label: "Success rate gain over standard BC" },
        { value: "0.995", label: "Recommended EMA decay for model weights" },
        { value: "[-1, 1]", label: "Required action normalization range" }
      ]
    },
    {
      type: "comparison-table",
      heading: "Diffusion Policy Architecture Options",
      columns: ["Backbone", "Action Dims", "Training Speed", "Multi-Task Scaling", "Best Use Case"],
      rows: [
        { "Backbone": "Conditional U-Net", "Action Dims": "6-8 DOF", "Training Speed": "Faster", "Multi-Task Scaling": "Limited", "Best Use Case": "Single-task manipulation" },
        { "Backbone": "Transformer", "Action Dims": "8-24+ DOF", "Training Speed": "Slower", "Multi-Task Scaling": "Better", "Best Use Case": "Multi-task, high-DOF, bimanual" },
        { "Backbone": "U-Net + Frozen ViT Encoder", "Action Dims": "6-8 DOF", "Training Speed": "Fastest (cached features)", "Multi-Task Scaling": "Limited", "Best Use Case": "Small datasets (<1K demos)" },
        { "Backbone": "Transformer + Fine-tuned DINOv2", "Action Dims": "8-24+ DOF", "Training Speed": "Slowest", "Multi-Task Scaling": "Best", "Best Use Case": "Large-scale multi-task with visual diversity" }
      ]
    },
    {
      type: "cards",
      heading: "Common Training Pitfalls",
      cards: [
        {
          title: "Incorrect Action Normalization",
          description: "The diffusion noise schedule assumes actions are in [-1, 1]. Using raw joint angles or unnormalized EE deltas causes training to diverge or produce static policies."
        },
        {
          title: "Missing EMA Weights",
          description: "The Exponential Moving Average model typically outperforms the training model by 5-10%. Always evaluate both and deploy the EMA checkpoint."
        },
        {
          title: "Overfitting on Small Datasets",
          description: "With fewer than 500 demonstrations, the model memorizes trajectories. Use early stopping on validation loss, stronger augmentation, and frozen vision encoders."
        },
        {
          title: "DDPM at Inference Time",
          description: "Training uses DDPM (100 steps) but inference must use DDIM (10-16 steps) for real-time control. Forgetting to switch yields 1-2 Hz inference — unusable for reactive manipulation."
        }
      ]
    },
    {
      type: "prose",
      heading: "Data Quality Requirements Specific to Diffusion Policy",
      paragraphs: [
        "Diffusion Policy is more data-efficient than standard behavioral cloning, but it has specific data quality requirements that other architectures are more forgiving of. The most critical is trajectory smoothness. The diffusion model learns to generate action sequences by reversing a noise process — if the training trajectories contain jerky, discontinuous actions (from teleoperation latency spikes, control mode switches, or operator hesitation), the model learns that jerkiness as part of the action distribution and reproduces it during deployment.",
        "Filter demonstrations by jerk magnitude before training. Compute the third derivative of the end-effector position trajectory using finite differences, take the absolute mean, and remove episodes above the 90th percentile. This aggressive filtering produces a smaller but smoother dataset that trains significantly better policies. For a 500-episode dataset, removing the jerkiest 50 episodes typically improves success rate by 5-10%.",
        "Multi-modal diversity is the second critical quality dimension. Diffusion Policy's key advantage over BC is its ability to model multiple valid strategies. But this only works if the dataset actually contains multiple strategies — a dataset where every operator uses the same approach angle and grasp type will train an equally uni-modal Diffusion Policy. Verify strategy diversity by clustering trajectory embeddings and ensuring at least 3-5 distinct clusters per task.",
        "Finally, ensure consistent action coordinate frames throughout the dataset. Diffusion Policy is extremely sensitive to mixed action conventions — even a single episode where the action frame is robot-base instead of end-effector (or vice versa) can destabilize training. Run an automated check that verifies the action covariance structure is consistent across all episodes."
      ]
    }
  ],
  faqs: [
    {
      question: "How many demonstrations do I need for Diffusion Policy?",
      answer: "For a single task on a specific robot: 100-200 demonstrations for simple tasks (pushing, reaching), 500-1,000 for moderate tasks (pick-and-place with varied objects), and 2,000+ for complex multi-step tasks. Diffusion Policy is more sample-efficient than basic behavioral cloning because it handles multimodal action distributions — 200 Diffusion Policy demonstrations often outperform 1,000 BC demonstrations on tasks with multiple valid strategies.",
    },
    {
      question: "How long does training take?",
      answer: "Training a Diffusion Policy on 500 demonstrations for a single task takes 2-6 hours on a single NVIDIA A100 or RTX 4090. Larger datasets (5,000+ demonstrations) and multi-task training take 12-48 hours. The training is straightforward supervised learning (no RL loop), so it is much faster and more stable than RL-based approaches. Most of the time investment is in data preparation and hyperparameter tuning, not the training itself.",
    },
    {
      question: "U-Net or Transformer backbone — which should I choose?",
      answer: "For most manipulation tasks with moderate action dimensions (6-8 DOF), U-Net performs well and trains faster. Choose the Transformer backbone when: (1) the action dimension is high (bimanual manipulation, dexterous hands), (2) you need to condition on long observation histories, or (3) you plan to scale to large multi-task datasets. The original Diffusion Policy paper showed comparable performance for both backbones on standard benchmarks, with U-Net being slightly faster to train.",
    },
    {
      question: "What inference speed can I expect on a real robot?",
      answer: "With DDIM sampling (10-16 steps): 5-15 Hz on an RTX 4090, adequate for most manipulation tasks. With DDPM (100 steps): 1-2 Hz, too slow for reactive control. Consistency distillation can push inference to 20+ Hz with minimal quality loss. For deployment, always benchmark inference latency on your target compute hardware — inference on Jetson Orin is 3-5x slower than on a desktop GPU.",
    },
  ],
  ctaHeading: "Need Demonstration Data?",
  ctaDescription: "Claru provides the high-quality, diverse demonstration datasets that Diffusion Policy architectures require for robust training.",
  relatedGlossaryTerms: ["diffusion-policy", "behavioral-cloning", "action-chunking", "visuomotor-policy"],
  relatedGuidePages: ["how-to-collect-teleoperation-data", "how-to-create-action-labels-for-vla"],
  relatedSolutionSlugs: ["manipulation-trajectory-data"],
  difficulty: "advanced",
  estimatedTime: "1-2 weeks",
  prerequisites: [
    "Demonstration dataset (100+ episodes with synchronized observations and actions)",
    "Python 3.9+ with PyTorch 2.0+",
    "GPU with 16+ GB VRAM (A100, RTX 4090, or equivalent)",
    "Familiarity with behavioral cloning and robot action spaces",
  ],
  tools: ["PyTorch", "diffusers (HuggingFace)", "robomimic", "wandb", "NumPy", "einops"],
  steps: [
    {
      stepNumber: 1,
      title: "Prepare Your Demonstration Dataset",
      description: "Load your demonstration dataset and normalize the observation and action spaces. For observations: resize images to the target resolution (typically 84x84 or 128x128 for efficiency, 224x224 if using a pretrained vision encoder). Normalize pixel values to [-1, 1] or [0, 1] depending on the vision encoder. For proprioceptive state: compute per-dimension mean and standard deviation across the dataset and normalize to zero mean, unit variance.\n\nFor actions: normalization is critical for diffusion models. Compute the min and max of each action dimension across the dataset and normalize to [-1, 1]. The diffusion process operates in this normalized space. Store the normalization statistics separately — you will need them to denormalize predicted actions during deployment. Verify that no action values are clipped after normalization, which would indicate outlier demonstrations that should be inspected.",
      tools: ["PyTorch", "NumPy"],
      tips: ["Always normalize actions to [-1, 1] for diffusion — the Gaussian noise schedule assumes this range.", "Save normalization statistics as part of the model checkpoint for deployment."],
    },
    {
      stepNumber: 2,
      title: "Choose Architecture and Configure Hyperparameters",
      description: "Select the denoising backbone (Conditional U-Net or Transformer), observation horizon (T_obs), prediction horizon / action chunk size (T_pred), and action execution horizon (T_exec). For U-Net: use the architecture from the original Diffusion Policy codebase with channel dimensions [256, 512, 1024]. For Transformer: use 4-8 layers with 256-512 hidden dimension.\n\nSet the observation horizon T_obs to 2-4 frames — this gives the model velocity information without excessive memory. Set the prediction horizon T_pred to 8-32 steps — this is the action chunk size. Longer chunks provide more temporal consistency but less reactivity. Set the execution horizon T_exec to T_pred/4 or T_pred/2 — execute this many actions before re-planning. For the noise schedule: use 100 DDPM steps for training, DDIM with 10-16 steps for inference.",
      tools: ["PyTorch", "diffusers"],
      tips: ["Start with the default hyperparameters from the official Diffusion Policy implementation before tuning.", "The prediction horizon should match the typical duration of a coherent sub-action in your task."],
    },
    {
      stepNumber: 3,
      title: "Implement the Vision Encoder",
      description: "Set up the vision encoder that processes raw camera images into feature vectors for the diffusion backbone. For pretrained encoders: use ResNet-18 (fast, lightweight), ResNet-50 (more capacity), or a ViT-based encoder (DINOv2, SigLIP) for best representation quality. Load pretrained weights and decide whether to freeze or fine-tune.\n\nFor frozen encoders: extract features offline for the entire dataset and cache them, reducing training time by 3-5x since the vision encoder does not need to run during training. For fine-tuned encoders: use a lower learning rate (1e-5) for the encoder than for the diffusion head (1e-4). If using multiple camera viewpoints, use separate encoder branches or process images sequentially through a shared encoder and concatenate the features.",
      tools: ["torchvision", "timm"],
      tips: ["Freezing the vision encoder is recommended when you have fewer than 1,000 demonstrations. Fine-tune only with larger datasets.", "R3M or DINOv2 features work well as frozen representations for manipulation tasks."],
    },
    {
      stepNumber: 4,
      title: "Train the Diffusion Model",
      description: "Train the conditional diffusion model using the standard denoising objective. At each training step: sample a batch of (observation, action_chunk) pairs from the dataset, sample random noise levels uniformly from [0, T], add the sampled noise to the action chunks, and train the network to predict the added noise conditioned on the observations and the noise level. Use AdamW optimizer with learning rate 1e-4, batch size 64-256, and train for 100-500 epochs.\n\nMonitor training with two metrics: the MSE loss (should decrease steadily) and action prediction quality on a held-out validation set. For validation, run the full denoising process (DDIM with 10 steps) on validation observations and compute the MSE between predicted and ground-truth action chunks. Implement early stopping based on validation loss to prevent overfitting, which is a real risk with small datasets (< 500 demonstrations).",
      tools: ["PyTorch", "wandb"],
      tips: ["Use EMA (Exponential Moving Average) of model weights with decay 0.995 — the EMA model often performs 5-10% better than the final training model.", "Learning rate warmup (1000 steps linear warmup) stabilizes early training."],
    },
    {
      stepNumber: 5,
      title: "Evaluate in Simulation",
      description: "Before deploying on real hardware, evaluate the trained policy in simulation. Set up the simulation environment to match your real-world setup (same camera positions, same object models, same action space). Run 50-100 episodes in simulation and measure: task success rate, average completion time, trajectory smoothness (jerk metric), and failure mode distribution.\n\nCompare against a behavioral cloning baseline trained on the same data. Diffusion Policy should outperform BC by 20-50% on tasks with multimodal action distributions (multiple valid strategies for the same observation). If Diffusion Policy underperforms BC, check: action normalization (the most common bug), noise schedule parameters, and observation horizon settings. Visualize the denoising process on a few examples to verify the model generates coherent action sequences.",
      tools: ["MuJoCo", "robosuite", "robomimic"],
      tips: ["If success rate in simulation is below 50%, the issue is usually data quality or action normalization, not model capacity.", "Visualize predicted action trajectories overlaid on the workspace to catch gross errors."],
    },
    {
      stepNumber: 6,
      title: "Optimize for Real-Time Deployment",
      description: "Configure the inference pipeline for real-time robot control. Switch from DDPM (100 steps) to DDIM (10-16 steps) for inference — this reduces latency by 6-10x with minimal quality loss. Benchmark the full inference pipeline end-to-end: image capture, preprocessing, vision encoding, diffusion denoising, action denormalization, and robot command sending. The total latency must be under the control period (50ms at 20 Hz, 100ms at 10 Hz).\n\nOptimization techniques: TorchScript or torch.compile the model for 1.5-2x speedup. Use mixed precision (fp16) for the diffusion backbone. Batch the observation encoding if using multiple cameras. Pre-allocate tensors to avoid dynamic memory allocation. If the pipeline is still too slow, reduce the DDIM steps to 5-8 or use consistency distillation to produce a single-step model.",
      tips: ["Always benchmark on the actual deployment hardware, not your training machine.", "Profile the pipeline to identify the bottleneck — it is often image preprocessing, not the diffusion model itself."],
    },
    {
      stepNumber: 7,
      title: "Deploy and Iterate on Real Hardware",
      description: "Deploy the policy on the real robot with safety monitoring. Start with a reduced action magnitude (scale predicted actions by 0.5) to verify the policy behaves reasonably before running at full scale. Monitor for: jerky motions (action normalization issues), drift over time (observation encoder mismatch between training and deployment), and task-specific failure modes.\n\nCommon real-world issues and fixes: (1) Camera viewpoint has shifted since data collection — recalibrate or re-collect a small dataset from the current viewpoint. (2) Objects look different than in training — add data augmentation (color jitter, brightness) to the training pipeline and retrain. (3) Policy hesitates at decision points — increase the prediction horizon to commit to longer plans. Collect additional demonstrations targeting observed failure modes and retrain with the expanded dataset. This collect-evaluate-expand cycle typically requires 2-3 iterations to reach production performance.",
      tips: ["Record all deployment episodes (successes and failures) for future training data.", "Keep the demonstration dataset growing — add 50-100 new demonstrations after each deployment iteration."],
    },
  ],
  keyPapers: [
    {
      id: "chi-diffusion-policy-2023",
      title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137",
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
      id: "song-ddim-2020",
      title: "Denoising Diffusion Implicit Models",
      authors: "Song et al.",
      venue: "ICLR 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2010.02502",
    },
  ],
  claruRelevance: "Claru provides the high-quality demonstration datasets that Diffusion Policy training requires. Our teleoperation data features smooth, temporally consistent demonstrations from skilled operators — exactly the trajectory quality that determines whether a Diffusion Policy learns coherent multi-step action chunks or noisy, inconsistent predictions. We deliver datasets normalized and formatted for direct consumption by the Diffusion Policy training pipeline.",
};

export default data;
