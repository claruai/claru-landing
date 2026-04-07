import type { ModelPageData } from "../types";

const data: ModelPageData = {
  slug: "genima",
  metaTitle: "Training Data for GENIMA | Data Requirements & Formats | Claru",
  metaDescription:
    "Complete guide to GENIMA training data: affordance image generation, ACT controller inputs, RLBench benchmarks, and how Claru delivers GENIMA-ready datasets.",
  primaryKeyword: "GENIMA training data",
  secondaryKeywords: [
    "GENIMA data requirements",
    "GENIMA affordance dataset",
    "generative image as action models data",
    "GENIMA fine-tuning data",
    "GENIMA robot manipulation dataset",
  ],
  canonicalPath: "/models/genima",
  h1: "Training Data for GENIMA (Generative Image as Action Models)",
  heroSubtitle:
    "A deep dive into GENIMA's affordance-centric architecture, the Stable Diffusion backbone it fine-tunes, the ACT controller it pairs with, and the specific data formats and volumes required to replicate or extend its results on your own manipulation tasks.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Models", href: "/models" },
    { label: "GENIMA", href: "/models/genima" },
  ],

  // ---------------------------------------------------------------------------
  // Sections
  // ---------------------------------------------------------------------------
  sections: [
    // 1. What Is GENIMA?
    {
      type: "prose",
      heading: "What Is GENIMA?",
      paragraphs: [
        "GENIMA (Generative Image as Action Models) is a behavior-cloning framework developed at the Dyson Robot Learning Lab by Mohit Shridhar, Yat Long Lo, and Stephen James. Published in July 2024 (arXiv 2407.07875), GENIMA introduces a fundamentally different approach to visuomotor policy learning: instead of regressing actions directly from images, it fine-tunes a pretrained image generation model to 'draw' target joint positions as colored spheres overlaid on the current RGB observation. A downstream ACT-style controller then converts those visual affordance targets into executable robot joint trajectories.",
        "The key insight is that lifting the action representation into image space lets the policy inherit the strong visual priors of internet-pretrained diffusion models. Because Stable Diffusion already understands geometry, lighting, and object identity, the resulting policy is far more robust to visual perturbations than a standard visuomotor approach. GENIMA outperforms ACT in 16 out of 25 RLBench simulation tasks and beats Diffusion Policy in all 25 tasks, while also demonstrating strong generalization on 9 real-world manipulation tasks with a Franka Panda arm.",
        "A distinctive emergent property of GENIMA is canonical texture reversion: the diffusion model tends to normalize object appearances to canonical colors and textures during affordance image generation, making the policy invariant to randomized object colors, distractors, lighting changes, and background textures. This property is not explicitly trained but arises from the visual priors of the pretrained diffusion backbone.",
      ],
    },

    // 2. Key stats
    {
      type: "stats",
      heading: "GENIMA at a Glance",
      stats: [
        { value: "25", label: "RLBench simulation tasks evaluated" },
        { value: "9", label: "Real-world manipulation tasks" },
        { value: "16/25", label: "Tasks where GENIMA beats ACT" },
        { value: "25/25", label: "Tasks where GENIMA beats Diffusion Policy" },
        { value: "20-50", label: "Demonstrations per task (few-shot)" },
        { value: "~64%", label: "Avg. real-world success rate" },
      ],
    },

    // 3. Input/output spec table
    {
      type: "comparison-table",
      heading: "Input / Output Specification",
      columns: ["Parameter", "Specification"],
      rows: [
        {
          Parameter: "Observation Format",
          Specification:
            "Single or multi-view 128x128 RGB images (RLBench); 480x640 RGB (real-world Franka)",
        },
        {
          Parameter: "Action Representation",
          Specification:
            "Colored spheres drawn on the observation image encoding 3D joint-position targets, decoded by an ACT controller into a sequence of joint positions",
        },
        {
          Parameter: "Language Conditioning",
          Specification:
            "Natural language task instructions fed as text prompts to the Stable Diffusion backbone",
        },
        {
          Parameter: "Control Frequency",
          Specification: "10 Hz (action chunk length varies by task)",
        },
        {
          Parameter: "Diffusion Backbone",
          Specification:
            "SD-Turbo (single-step distilled Stable Diffusion) with ControlNet conditioning on the current RGB frame",
        },
        {
          Parameter: "Controller",
          Specification:
            "ACT (Action Chunking with Transformers) using ResNet-18 vision encoder and Transformer action decoder",
        },
      ],
    },

    // 4. Architecture & Key Innovations
    {
      type: "prose",
      heading: "Architecture and Key Innovations",
      paragraphs: [
        "GENIMA's architecture is a two-stage pipeline. Stage 1 is an affordance image generator built by fine-tuning SD-Turbo with ControlNet. The ControlNet adapter takes the current RGB observation as a spatial conditioning signal, while the text encoder receives the language instruction. The denoising UNet then generates an output image identical to the observation but with colored spheres overlaid at the predicted 3D positions of each robot joint, projected into the camera frame. Because SD-Turbo is a single-step distilled model, this generation requires only one forward pass, keeping inference latency low.",
        "Stage 2 is an ACT-based controller that consumes the generated affordance image. The controller uses a ResNet-18 backbone to encode the affordance image and a Transformer decoder to predict a chunk of future joint-position actions. The ACT architecture enables temporal action chunking, producing smooth multi-step trajectories from a single affordance image rather than requiring per-timestep replanning.",
        "The two-stage decomposition offers a clean separation of concerns. The diffusion model handles the 'what' and 'where' of manipulation (spatial reasoning, object identity, grasp point selection), while the ACT controller handles the 'how' (motion planning, trajectory smoothness, dynamics). This separation means each stage can be trained and debugged independently, and the affordance images provide an interpretable intermediate representation that engineers can visually inspect.",
        "A critical innovation is the use of internet-pretrained visual priors for policy robustness. Because the diffusion backbone was trained on billions of internet images, it implicitly encodes strong priors about 3D geometry, lighting, material properties, and object categories. These priors transfer directly to the manipulation policy, enabling zero-shot generalization to novel object instances, colors, and backgrounds that would require explicit domain randomization in conventional approaches.",
      ],
    },

    // 5. Comparison table vs related models
    {
      type: "comparison-table",
      heading: "Comparison with Related Models",
      description:
        "How GENIMA compares to alternative visuomotor policy architectures on key dimensions.",
      columns: ["Dimension", "GENIMA", "ACT", "Diffusion Policy", "RT-2"],
      rows: [
        {
          Dimension: "Action representation",
          GENIMA: "Affordance images (visual targets)",
          ACT: "Direct joint-position chunks",
          "Diffusion Policy": "Diffused continuous actions",
          "RT-2": "Discretized token actions",
        },
        {
          Dimension: "Pretrained backbone",
          GENIMA: "SD-Turbo (image generation)",
          ACT: "None (trained from scratch)",
          "Diffusion Policy": "None (trained from scratch)",
          "RT-2": "PaLI-X VLM",
        },
        {
          Dimension: "Visual robustness",
          GENIMA: "High (canonical texture reversion)",
          ACT: "Low (overfits to textures)",
          "Diffusion Policy": "Moderate",
          "RT-2": "High (VLM priors)",
        },
        {
          Dimension: "Demos per task",
          GENIMA: "20-50",
          ACT: "50-100",
          "Diffusion Policy": "100-200",
          "RT-2": "100K+ (large-scale)",
        },
        {
          Dimension: "Language conditioning",
          GENIMA: "Yes (text-to-image prompt)",
          ACT: "No",
          "Diffusion Policy": "Optional",
          "RT-2": "Yes (VLM)",
        },
      ],
    },

    // 6. Training Data Requirements
    {
      type: "prose",
      heading: "Training Data Requirements",
      paragraphs: [
        "GENIMA's data-efficiency is one of its most compelling properties. In the RLBench evaluation, each of the 25 tasks was trained with as few as 20 to 50 demonstrations, a fraction of what standard visuomotor policies require. Each demonstration consists of an RGB observation stream (128x128 resolution in simulation, 480x640 in real-world), paired with ground-truth robot joint positions at each timestep. From these joint positions, the training pipeline renders colored sphere overlays on the observation images to create the affordance image targets used to fine-tune the diffusion model.",
        "For real-world deployment, the authors collected 9 manipulation tasks on a Franka Panda arm with a wrist-mounted RealSense camera. Each task used between 20 and 50 teleoperated demonstrations. The teleoperation data includes RGB frames, 7-DoF joint positions, and gripper state at 10 Hz. The affordance sphere rendering is computed offline from the recorded joint trajectories using known camera intrinsics and extrinsics, so no special annotation beyond standard teleoperation recording is needed.",
        "The ControlNet fine-tuning of SD-Turbo requires paired (observation, affordance_image) samples. The observation is the raw RGB frame, and the affordance image is the same frame with colored spheres at each joint position projected into the camera view. Training typically converges in 10,000 to 50,000 gradient steps with a batch size of 8 to 16 on a single A100 GPU. The ACT controller is trained separately on the affordance images and corresponding action chunks, using the same demonstration dataset.",
        "For teams looking to extend GENIMA to new tasks, the minimum viable dataset is approximately 20 high-quality teleoperated demonstrations per task, with consistent camera placement and calibrated intrinsics. Increasing to 50 demonstrations per task provides meaningful improvements in success rate, particularly for tasks involving articulated objects or precise contact dynamics.",
      ],
    },

    // 7. How Claru Data Integrates
    {
      type: "prose",
      heading: "How Claru Data Integrates with GENIMA",
      paragraphs: [
        "Claru provides teleoperated robot demonstration datasets with the precise data modalities GENIMA requires: time-synchronized RGB image streams, 7-DoF joint positions, gripper states, and calibrated camera parameters. Our collection pipeline uses instrumented Franka Panda and UR5e setups with RealSense and ZED cameras, producing data at 10-30 Hz with sub-millimeter joint-position accuracy from high-resolution encoders.",
        "For GENIMA specifically, the critical data annotation is the joint-position trajectory at each timestep, which is used to render the affordance sphere targets. Claru's data includes full kinematic chain recordings (joint positions, end-effector poses, and gripper width) that can be directly projected into the camera frame to generate GENIMA's colored sphere training targets. We also provide camera intrinsic and extrinsic calibration files in standard formats (JSON, YAML) compatible with the GENIMA codebase.",
        "Beyond raw demonstrations, Claru can supply datasets with controlled visual diversity -- varying object instances, lighting conditions, backgrounds, and distractor objects -- that stress-test GENIMA's canonical texture reversion property and verify generalization before deployment. Our data quality pipeline includes trajectory smoothness validation, camera calibration verification, and demonstration success labeling to ensure that every sample in the training set represents a successful task completion.",
      ],
    },

    // 8. References
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "shridhar-genima-2024",
          title: "Generative Image as Action Models",
          authors: "Shridhar, Lo, & James",
          venue: "arXiv 2407.07875",
          year: 2024,
          url: "https://arxiv.org/abs/2407.07875",
        },
        {
          id: "zhao-act-2023",
          title:
            "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
          authors: "Zhao et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2304.13705",
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
        {
          id: "zhang-controlnet-2023",
          title:
            "Adding Conditional Control to Text-to-Image Diffusion Models",
          authors: "Zhang, Rao, & Agrawala",
          venue: "ICCV 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2302.05543",
        },
        {
          id: "james-rlbench-2020",
          title:
            "RLBench: The Robot Learning Benchmark & Learning Environment",
          authors: "James et al.",
          venue: "IEEE Robotics and Automation Letters",
          year: 2020,
          url: "https://arxiv.org/abs/1909.12271",
        },
      ],
    },
  ],

  // ---------------------------------------------------------------------------
  // FAQs
  // ---------------------------------------------------------------------------
  faqs: [
    {
      question: "How does GENIMA achieve robustness to visual perturbations?",
      answer:
        "GENIMA inherits the visual priors of Stable Diffusion, which was pretrained on billions of internet images. During affordance image generation, the diffusion model exhibits an emergent canonical texture reversion property, normalizing object appearances to canonical colors and textures. This makes the policy invariant to randomized object colors, distractors, lighting changes, and background textures without explicit domain randomization.",
    },
    {
      question: "How many demonstrations does GENIMA need per task?",
      answer:
        "GENIMA is highly data-efficient compared to conventional visuomotor approaches. In the RLBench evaluation, each task was trained with 20 to 50 demonstrations. For real-world Franka Panda tasks, the same range (20-50 demonstrations) was sufficient to achieve an average 64% success rate across 9 manipulation tasks. This is roughly 2-5x fewer demonstrations than what standard ACT or Diffusion Policy baselines require.",
    },
    {
      question:
        "What is the difference between the diffusion agent and the ACT controller in GENIMA?",
      answer:
        "The diffusion agent (Stage 1) is a fine-tuned SD-Turbo model with ControlNet that generates an affordance image showing where the robot joints should move, rendered as colored spheres on the current observation. The ACT controller (Stage 2) takes this affordance image as input and outputs a chunk of joint-position actions that move the robot toward those visual targets. The diffusion model handles spatial reasoning and the controller handles trajectory generation.",
    },
    {
      question: "Can GENIMA handle language instructions?",
      answer:
        "Yes. The Stable Diffusion backbone natively accepts text prompts, which GENIMA repurposes to encode task instructions. The language instruction is passed through the text encoder of SD-Turbo and conditions the denoising process, allowing the same model to generate different affordance images for different tasks given the same observation. This is a natural advantage of building on a text-to-image foundation model.",
    },
    {
      question:
        "What data format does Claru deliver for GENIMA fine-tuning?",
      answer:
        "Claru delivers teleoperated demonstration datasets containing time-synchronized RGB image streams (480x640 or higher), 7-DoF joint-position trajectories, gripper states, and calibrated camera intrinsic/extrinsic parameters at 10 Hz. These recordings can be directly used to render GENIMA's colored sphere affordance targets using the provided camera calibration, without any additional annotation. We deliver in HDF5 or the GENIMA codebase's native format.",
    },
  ],

  // ---------------------------------------------------------------------------
  // CTA
  // ---------------------------------------------------------------------------
  ctaHeading: "Get GENIMA-Ready Demonstration Data",
  ctaDescription:
    "Tell us about your GENIMA project -- target tasks, robot platform, and camera setup -- and we will deliver calibrated teleoperation datasets formatted for GENIMA's affordance image training pipeline.",

  // ---------------------------------------------------------------------------
  // Cross-links
  // ---------------------------------------------------------------------------
  relatedGlossaryTerms: [
    "vla",
    "diffusion-policy",
    "imitation-learning",
    "affordance",
    "foundation-model-robotics",
  ],
  relatedGuidePages: [
    "how-to-create-action-labels-for-vla",
    "how-to-collect-teleoperation-data",
  ],
  relatedSolutionSlugs: [],

  // ---------------------------------------------------------------------------
  // Model metadata
  // ---------------------------------------------------------------------------
  modelName: "GENIMA",
  organization: "Dyson Robot Learning Lab",
  year: 2024,

  inputSpec: {
    observationFormat:
      "Single or multi-view RGB images (128x128 sim, 480x640 real) with ControlNet conditioning",
    actionFormat:
      "Colored sphere affordance images decoded by ACT controller into 7-DoF joint-position action chunks",
    languageConditioning:
      "Natural language task instructions via SD-Turbo text encoder",
    controlFrequency: "10 Hz",
  },

  dataVolumeBenchmarks:
    "GENIMA is remarkably data-efficient, requiring only 20 to 50 teleoperated demonstrations per task to achieve competitive performance. In the RLBench benchmark suite, the model was evaluated across 25 simulation tasks, each trained with this small demonstration budget, and outperformed ACT in 16 of 25 tasks and Diffusion Policy in all 25 tasks. The real-world evaluation covered 9 manipulation tasks on a Franka Panda arm, where 20-50 demonstrations per task yielded an average success rate of approximately 64%. Each demonstration consists of an RGB observation stream at 10 Hz paired with 7-DoF joint positions and gripper state. The total training data per task is therefore on the order of 2,000 to 10,000 observation-action pairs (assuming 100-200 timesteps per demonstration at 10 Hz). The ControlNet fine-tuning of SD-Turbo converges in 10,000 to 50,000 gradient steps with batch sizes of 8-16. The ACT controller is trained separately on the same dataset. For teams scaling to multi-task policies, a combined dataset of 500-1,250 demonstrations across 25 tasks (20-50 each) is representative of the original evaluation. Compared to VLA models like RT-2 that require hundreds of thousands of demonstrations, GENIMA's data requirements are 100-1,000x smaller, making it practical for labs without massive data collection infrastructure.",

  trainingRecipe:
    "GENIMA's training proceeds in two independent stages. Stage 1 fine-tunes SD-Turbo (a single-step distilled Stable Diffusion model) using ControlNet adapters. The current RGB observation serves as the ControlNet conditioning signal, while the task instruction is encoded via the text encoder. The training target is an affordance image: the same RGB observation overlaid with colored spheres at each robot joint's 3D position projected into the camera frame. These sphere positions are computed from the recorded joint trajectories using known forward kinematics and camera calibration. Fine-tuning uses a standard diffusion denoising loss on the affordance image, with the ControlNet adapter weights updated while the main UNet weights can be optionally frozen or fine-tuned at a lower learning rate. Training typically uses a single NVIDIA A100 GPU and converges in approximately 10K-50K steps. Stage 2 trains the ACT controller: a ResNet-18 vision encoder processes the generated affordance image, and a Transformer decoder predicts a chunk of future joint-position actions (typically 10-20 steps). The ACT training uses standard MSE or smooth-L1 loss on the action chunks with a CVAE (Conditional Variational Autoencoder) regularization term. Both stages use the same teleoperation dataset but process it differently -- Stage 1 sees (observation, affordance_image) pairs while Stage 2 sees (affordance_image, action_chunk) pairs. At inference time, the pipeline runs sequentially: observation goes into ControlNet, the generated affordance image goes into ACT, and the output action chunk is executed on the robot.",

  claruIntegration:
    "Claru provides the exact data modalities GENIMA requires for both training stages: time-synchronized RGB image streams, 7-DoF joint-position trajectories, gripper states, and calibrated camera parameters (intrinsics and extrinsics in JSON/YAML format). Our teleoperation data is collected on instrumented Franka Panda and UR5e platforms at 10-30 Hz with sub-millimeter joint-position accuracy from high-resolution encoders. For GENIMA's affordance image training, the critical requirement is accurate joint-position recordings that can be projected into the camera frame to render the colored sphere targets -- Claru's data includes full kinematic chain recordings and verified camera calibrations that make this projection straightforward. We also provide datasets with controlled visual diversity (varying objects, lighting, backgrounds) to validate GENIMA's canonical texture reversion property before deployment. Every dataset includes trajectory smoothness validation, success labeling, and format conversion to the GENIMA codebase's native HDF5 structure.",

  keyPapers: [
    {
      id: "shridhar-genima-2024",
      title: "Generative Image as Action Models",
      authors: "Shridhar, Lo, & James",
      venue: "arXiv 2407.07875",
      year: 2024,
      url: "https://arxiv.org/abs/2407.07875",
    },
    {
      id: "zhao-act-2023",
      title:
        "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
      authors: "Zhao et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.13705",
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
    {
      id: "zhang-controlnet-2023",
      title: "Adding Conditional Control to Text-to-Image Diffusion Models",
      authors: "Zhang, Rao, & Agrawala",
      venue: "ICCV 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2302.05543",
    },
    {
      id: "james-rlbench-2020",
      title: "RLBench: The Robot Learning Benchmark & Learning Environment",
      authors: "James et al.",
      venue: "IEEE Robotics and Automation Letters",
      year: 2020,
      url: "https://arxiv.org/abs/1909.12271",
    },
  ],
};

export default data;
