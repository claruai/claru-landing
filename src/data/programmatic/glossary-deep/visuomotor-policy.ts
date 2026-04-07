import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "visuomotor-policy",
  termSlug: "visuomotor-policy",
  category: "robotics-fundamentals",
  metaTitle: "Visuomotor Policy — Definition & Training Data | Claru",
  metaDescription: "A visuomotor policy maps raw camera images directly to robot motor commands. Learn end-to-end architectures, data requirements, and how they differ from VLA models.",
  primaryKeyword: "visuomotor policy",
  secondaryKeywords: ["visuomotor control", "end-to-end robot policy", "vision-based robot control", "image-to-action policy", "visual motor learning"],
  canonicalPath: "/glossary/visuomotor-policy",
  h1: "Visuomotor Policy: End-to-End Vision-to-Action Robot Control",
  heroSubtitle: "A visuomotor policy is a neural network that takes raw camera images as input and outputs motor commands as output, learning the entire perception-to-action pipeline end-to-end from data. Unlike modular approaches that separate perception (object detection) from planning (trajectory generation) from control (motor commands), visuomotor policies learn a single differentiable function that maps directly from pixels to actions.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Visuomotor Policy", href: "/glossary/visuomotor-policy" },
  ],
  sections: [],
  faqs: [
    {
      question: "What is the difference between a visuomotor policy and a VLA model?",
      answer: "A visuomotor policy maps visual observations directly to actions without processing language. A VLA model adds language conditioning, taking both visual observations and natural language instructions as input. Visuomotor policies execute a fixed task (always pick up the nearest object); VLA models can follow different instructions (pick up the red cup, push the blue block). VLA models typically use larger pretrained backbones and are more general, while visuomotor policies can be smaller and faster for single-task deployment.",
    },
    {
      question: "How many camera views does a visuomotor policy need?",
      answer: "Single-camera policies work for many tasks but multi-camera setups improve performance on tasks requiring depth perception or wide workspace coverage. A common setup is one wrist-mounted camera (close-up manipulation view) plus one fixed third-person camera (workspace overview). The RT-1 model used a single head-mounted camera. ACT and ALOHA use two wrist cameras plus a scene camera. Adding cameras increases data requirements linearly — each viewpoint needs to be present in all training demonstrations.",
    },
    {
      question: "Should vision encoders be pretrained or trained from scratch?",
      answer: "Pretrained vision encoders (R3M, CLIP, DINOv2, SigLIP) consistently outperform randomly initialized encoders, especially with limited robot data. R3M (pretrained on Ego4D) improves manipulation success by 20-40% over training from scratch. The standard practice is to initialize the vision encoder with pretrained weights and either freeze it (for small datasets) or fine-tune it with a lower learning rate (for large datasets). Training from scratch is only justified when you have 50,000+ demonstrations.",
    },
  ],
  ctaHeading: "Need Data for Visuomotor Policies?",
  ctaDescription: "Claru provides synchronized camera-action data from multiple viewpoints, optimized for training end-to-end visuomotor control policies.",
  relatedGlossaryTerms: ["vla", "behavioral-cloning", "diffusion-policy", "action-chunking", "egocentric-video"],
  relatedGuidePages: ["how-to-collect-teleoperation-data", "how-to-label-robot-demonstrations"],
  relatedSolutionSlugs: ["manipulation-trajectory-data", "teleoperation-data"],
  longDefinition: `A visuomotor policy is a neural network that maps raw visual observations (camera images) directly to robot motor commands (joint positions, end-effector poses, or torques), learning the complete perception-to-action chain as a single differentiable model. The term "visuomotor" combines "visual" (the input modality) with "motor" (the output modality), emphasizing the end-to-end nature of the mapping.

The end-to-end approach contrasts with the traditional modular pipeline in robotics, where separate modules handle perception (detecting objects and estimating their poses), planning (computing a trajectory from the current state to the goal), and control (converting trajectory waypoints to motor commands). Each module in the traditional pipeline introduces engineering effort, hand-tuned parameters, and error boundaries. A visuomotor policy replaces this entire pipeline with a single learned function, potentially capturing visual features and control strategies that a modular pipeline would miss.

Architecturally, a visuomotor policy consists of a vision encoder that processes camera images into a feature vector, and an action decoder that maps features to motor commands. The vision encoder is typically a convolutional neural network (ResNet) or Vision Transformer (ViT, DINOv2, SigLIP). The action decoder ranges from a simple MLP for single-step prediction to a Transformer with action chunking or a diffusion model for multi-step prediction. Modern visuomotor policies also incorporate proprioceptive state (joint positions, gripper width) as an additional input, concatenated with visual features before the action decoder.

The training signal for visuomotor policies comes from teleoperation demonstrations: paired recordings of what the robot's cameras saw and what actions the operator commanded at each timestep. The policy is trained through behavioral cloning (supervised learning on observation-action pairs), with the loss function being mean squared error for continuous actions or cross-entropy for discretized actions. The entire network — vision encoder and action decoder — is optimized end-to-end, allowing the vision encoder to learn features specifically useful for the control task rather than generic visual features.`,

  historicalContext: `End-to-end visuomotor learning was demonstrated by Levine et al. (2016) in "End-to-End Training of Deep Visuomotor Policies," which trained convolutional neural networks to map camera images directly to robot torque commands for tasks including screwing a cap onto a bottle. This paper established the visuomotor policy as a viable approach and showed that end-to-end training could learn visual representations tailored to the control task.

Earlier, Pomerleau's ALVINN (1989) was an end-to-end visuomotor policy for autonomous driving, mapping camera images to steering commands. But ALVINN used a shallow network and limited data; the deep learning era enabled visuomotor policies for the much harder problem of manipulation.

The 2020-2022 period saw rapid progress in visuomotor policy architectures. Zeng et al. (2021) demonstrated that Transporter Networks could learn manipulation from just 10 demonstrations using spatial equivariance inductive biases. Mandlekar et al. (2021) systematically compared visuomotor policy architectures in the robomimic benchmark. Nair et al. (2022) showed that pretraining vision encoders on egocentric video (R3M) dramatically improved visuomotor policy performance compared to random initialization.

The introduction of Diffusion Policy (Chi et al., 2023) and ACT (Zhao et al., 2023) represented a step change in visuomotor policy capability. Both models combined learned visual representations with multi-step action prediction, achieving manipulation success rates that were previously only possible with state-based (non-visual) policies. These architectures demonstrated that the visuomotor policy paradigm could handle complex, contact-rich manipulation tasks including bimanual coordination.`,

  practicalImplications: `Training visuomotor policies requires camera data and action labels with specific properties that affect the data collection and processing pipeline.

Camera calibration is essential. Visuomotor policies learn a mapping from pixel coordinates to physical actions, which depends on the camera's intrinsic parameters (focal length, principal point, distortion coefficients) and extrinsic parameters (position and orientation relative to the robot base). If the camera moves between data collection and deployment — even by a few millimeters — the policy may fail. Cameras should be rigidly mounted, and calibration should be verified before each collection session.

Image preprocessing affects policy performance more than many teams realize. The training images must match deployment conditions in resolution, aspect ratio, color space, and normalization. Common errors include training on center-cropped images but deploying with full-frame images, or training with one white-balance setting and deploying with another. Standardize image processing in a preprocessing function used identically during training and deployment.

The number of camera viewpoints affects both data requirements and policy capability. Each camera viewpoint requires its own vision encoder branch (or a shared encoder processing images sequentially), and all viewpoints must be present in every training demonstration. Adding a wrist camera to a scene camera approximately doubles the visual data bandwidth and increases training time, but provides close-up manipulation information that significantly improves grasp and insertion success rates. The tradeoff is worth it for contact-rich tasks.

For deployment, inference latency is a practical constraint. The policy must process camera images and output actions at the control frequency (10-20 Hz for manipulation). Large vision encoders (ViT-L with 304M parameters) run at approximately 10-15 Hz on an NVIDIA RTX 4090. Smaller encoders (ResNet-18, ViT-S) run at 30+ Hz but produce weaker representations. Quantization and TensorRT optimization can improve throughput by 2-3x without significant accuracy loss.`,

  commonMisconceptions: [
    {
      misconception: "Visuomotor policies require the robot to have eyes (cameras) on its body.",
      correction: "Visuomotor policies work with any camera placement: wrist-mounted, head-mounted, third-person fixed cameras, or combinations. The only requirement is that the camera viewpoint is consistent between training and deployment. Many successful visuomotor policies use fixed overhead cameras rather than body-mounted cameras. The choice of camera placement depends on the task — wrist cameras are better for close-up manipulation; overhead cameras are better for workspace-level planning.",
    },
    {
      misconception: "End-to-end visuomotor policies are black boxes that cannot be debugged.",
      correction: "Modern visuomotor policies are interpretable through several techniques: attention map visualization (what image regions the policy focuses on), feature ablation (masking image regions to identify critical visual information), action sensitivity analysis (how small image perturbations affect predicted actions), and intermediate representation probing (what concepts the vision encoder has learned). These tools make visuomotor policies more debuggable than complex modular pipelines with many interacting components.",
    },
    {
      misconception: "Visuomotor policies cannot handle changes in lighting or background.",
      correction: "Policies trained on diverse visual conditions generalize well to unseen lighting and backgrounds. The key is training data diversity: demonstrations collected under varied lighting conditions (morning, afternoon, artificial), with different backgrounds and object arrangements, produce policies that are robust to visual variation. Data augmentation (color jitter, random crops, background replacement) further improves robustness. Policies trained in a single condition are brittle, but this is a data problem, not an architectural limitation.",
    },
  ],
  keyPapers: [
    {
      id: "levine-visuomotor-2016",
      title: "End-to-End Training of Deep Visuomotor Policies",
      authors: "Levine et al.",
      venue: "JMLR 2016",
      year: 2016,
      url: "https://arxiv.org/abs/1504.00702",
    },
    {
      id: "nair-r3m-2022",
      title: "R3M: A Universal Visual Representation for Robot Manipulation",
      authors: "Nair et al.",
      venue: "CoRL 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2203.12601",
    },
    {
      id: "mandlekar-robomimic-2021",
      title: "What Matters in Learning from Offline Human Demonstrations for Robot Manipulation",
      authors: "Mandlekar et al.",
      venue: "CoRL 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2108.03298",
    },
  ],
  claruRelevance: `Claru provides the multi-viewpoint camera data and synchronized action labels that visuomotor policies require. Our teleoperation datasets include calibrated camera streams from wrist, head, and scene viewpoints, with all streams temporally synchronized to the action labels at the recording control frequency.

For teams training visuomotor policies, Claru ensures the visual diversity — varied lighting, backgrounds, object arrangements, and scene conditions — that produces robust policies. Each dataset delivery includes camera calibration files, recommended preprocessing parameters, and example dataloader code for PyTorch and JAX training pipelines.`,
};

export default data;
