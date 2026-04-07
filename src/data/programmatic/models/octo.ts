import type { ModelPageData } from "../types";

const data: ModelPageData = {
  slug: "octo",
  metaTitle: "Training Data for Octo | Data Requirements & Formats | Claru",
  metaDescription: "Complete guide to Octo training data requirements: RLDS format, multi-view RGB, diffusion action head, 800K trajectory pre-training, and how Claru delivers Octo-ready datasets.",
  primaryKeyword: "octo training data",
  secondaryKeywords: ["octo data requirements", "octo dataset format", "octo fine-tuning data", "octo robot policy RLDS", "octo model training", "octo diffusion policy data"],
  canonicalPath: "/models/octo",
  h1: "Training Data for Octo",
  heroSubtitle: "Octo is the first fully open-source generalist robot policy, pre-trained on 800K trajectories from Open X-Embodiment. This guide covers observation formats, action specifications, fine-tuning data volumes, and how Claru delivers Octo-ready datasets in RLDS format.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Models", href: "/models" },
    { label: "Octo", href: "/models/octo" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Octo?",
      paragraphs: [
        "Octo is a generalist robot manipulation policy developed by the Octo Model Team at UC Berkeley, released in May 2024 (arXiv:2405.12213). It is the first fully open-source generalist robot policy -- meaning the training code, model weights, and data pipeline are all publicly available. Octo was pre-trained on 800,000 robot trajectories from 25 datasets within the Open X-Embodiment (OXE) collection, making it one of the most broadly trained open robot policies available.",
        "The model's design prioritizes practical usability. Octo accepts flexible inputs -- single or dual camera views (primary third-person + wrist), natural language instructions or goal images for task specification -- and outputs continuous 7-DoF actions via a diffusion-based action head. This flexibility means a single pre-trained Octo checkpoint can be fine-tuned for different robots, camera configurations, and task types without architectural changes.",
        "Octo ships in three sizes: Octo-Tiny (10M parameters), Octo-Small (27M parameters), and Octo-Base (93M parameters). The base model is the strongest out-of-the-box, but the smaller variants are useful for compute-constrained deployment. All variants use the same transformer architecture and can be fine-tuned using the same pipeline. Fine-tuning Octo-Base for a new single-arm manipulator typically requires 100-200 demonstrations and takes 2-4 hours on a single GPU.",
        "Octo's position in the robot learning ecosystem is as the practical, accessible alternative to larger closed models. While it does not match the language understanding of 7B+ VLA models like OpenVLA or the emergent reasoning of 55B+ models like RT-2, Octo's small size (93M vs. 7B), fast inference (~10 Hz on consumer GPUs), and full open-source availability make it the default starting point for many robotics teams that need a pre-trained policy they can fine-tune and deploy quickly."
      ],
    },
    {
      type: "stats",
      heading: "Octo at a Glance",
      stats: [
        { value: "93M", label: "Parameters (Octo-Base)" },
        { value: "800K", label: "Pre-training trajectories" },
        { value: "25", label: "OXE datasets used" },
        { value: "~10 Hz", label: "Inference frequency" },
        { value: "100-200", label: "Demos for single-task fine-tuning" },
        { value: "256x256", label: "Observation resolution" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Octo Input/Output Specification",
      columns: ["Parameter", "Specification"],
      rows: [
        { Parameter: "Observation Format", Specification: "256x256 RGB images (supports primary + wrist dual-view)" },
        { Parameter: "Image Tokenization", Specification: "Lightweight CNN encoder, then 16x16 patch grouping" },
        { Parameter: "Language Tokenization", Specification: "T5 tokenizer + T5-Base language encoder" },
        { Parameter: "Task Specification", Specification: "Natural language instructions OR goal images" },
        { Parameter: "Action Format", Specification: "7-DoF continuous end-effector deltas (position + orientation + gripper)" },
        { Parameter: "Action Head", Specification: "Diffusion policy -- predicts 4-step action chunks" },
        { Parameter: "Action Prediction Window", Specification: "Window size 2 (2 observation frames), predicts 4 future actions" },
        { Parameter: "Control Frequency", Specification: "~10 Hz (variable per embodiment during pre-training)" },
        { Parameter: "Data Format", Specification: "RLDS (TensorFlow Datasets)" },
      ],
    },
    {
      type: "prose",
      heading: "Architecture and Key Innovations",
      paragraphs: [
        "Octo's architecture is a transformer that maps heterogeneous input tokens to output tokens. Observations (images from one or two cameras) are tokenized through a lightweight convolutional encoder that produces 16x16 patch features. Language instructions are tokenized via T5 and encoded with T5-Base. Task specification can alternatively be a goal image, tokenized through the same CNN pipeline. All tokens -- observation patches, language embeddings, and special readout tokens -- are concatenated into a single sequence and processed by the transformer backbone.",
        "The action head is a diffusion policy that takes the transformer's readout tokens and generates continuous 7-DoF actions through an iterative denoising process. Specifically, Octo predicts action chunks of 4 steps into the future, which provides temporal smoothness and reduces the effective decision frequency. The diffusion formulation is critical because it naturally handles multi-modal action distributions -- when there are multiple valid ways to accomplish a task, the diffusion head can represent all of them, unlike regression-based heads that average modes and produce invalid actions.",
        "A key architectural innovation is Octo's modular tokenization. Because observations, language, and goals are all converted to generic token sequences before the transformer processes them, the model can handle varying input configurations without architectural changes. A robot with only a single camera simply omits the wrist camera tokens. A task specified by a goal image replaces the language tokens with goal-image tokens. This modularity is what enables fine-tuning a single pre-trained checkpoint for diverse downstream setups.",
        "The pre-training mixture spans 25 OXE datasets covering single-arm and bi-manual manipulation, different camera configurations, and varying action spaces. During pre-training, Octo learns a shared representation across all these embodiments. Fine-tuning then specializes this representation for a target robot. The fine-tuning pipeline supports both full fine-tuning (updating all 93M parameters) and LoRA-based parameter-efficient fine-tuning, with LoRA often achieving comparable results using a fraction of the compute."
      ],
    },
    {
      type: "prose",
      heading: "Benchmark Results and Performance Characterization",
      paragraphs: [
        "The Octo team evaluated fine-tuned performance across multiple real-robot platforms, establishing quantitative benchmarks that ground the model's capabilities. On WidowX pick-and-place tasks after fine-tuning on 100-200 demonstrations, Octo-Base achieved 85-95% success rates -- competitive with task-specific Diffusion Policy baselines trained from scratch on the same data. On Franka Panda tasks including drawer manipulation and object rearrangement, fine-tuned Octo-Base matched or exceeded single-task BC (behavioral cloning) baselines while generalizing better to unseen initial conditions.",
        "The comparison between Octo model sizes reveals a clear scaling relationship. Octo-Base (93M) consistently outperformed Octo-Small (27M) by 10-20% absolute success rate after fine-tuning on identical data, while Octo-Small outperformed Octo-Tiny (10M) by a similar margin. This scaling behavior holds across all evaluated robot platforms and task types, suggesting that larger models extract more transferable representations from the OXE pretraining mixture. However, the diminishing returns at each scale step indicate that the 93M model size may be near the performance ceiling for transformer-only architectures without VLM-scale language backbones.",
        "Zero-shot performance (without fine-tuning) is deliberately weak. On a new robot that was not in the OXE pretraining set, Octo-Base achieves near-zero success rates without fine-tuning. This is by design: Octo was optimized as a pretraining foundation, not a zero-shot policy. The value of OXE pretraining manifests in fine-tuning efficiency -- fine-tuned Octo reaches target performance with roughly 3-10x fewer demonstrations than training from random initialization. For a pick-and-place task that requires 500 demonstrations when training from scratch, fine-tuning from the Octo checkpoint typically achieves equivalent success with 50-100 demonstrations.",
        "The diffusion action head's 4-step chunking provides measurable benefits for motion quality. In teleoperation replay experiments, Octo's 4-step chunks produced smoother end-effector trajectories with 40% fewer direction reversals compared to single-step action prediction. This translates to visibly more deliberate robot motions and reduced wear on hardware, though the chunking introduces a 400ms commitment window at 10 Hz that constrains reactivity.",
      ],
    },
    // Fine-Tuning Workflow
    {
      type: "prose",
      heading: "Fine-Tuning Workflow and Best Practices",
      paragraphs: [
        "The standard Octo fine-tuning workflow proceeds in three stages. First, data preparation: convert your teleoperated demonstrations into RLDS format with 256x256 RGB observations, normalized 7-DoF end-effector delta actions, and language instruction strings. Each episode should be a complete task execution from start to terminal condition. The Octo team provides dataset builder templates that handle the tfrecord serialization -- but the observation cropping, action normalization, and temporal alignment must be correct before conversion.",
        "Second, fine-tuning configuration: choose between full fine-tuning (all 93M parameters, recommended when you have 500+ demonstrations and a multi-GPU setup) and LoRA fine-tuning (rank 32 applied to attention layers, recommended for single-GPU setups with 100-500 demonstrations). LoRA fine-tuning takes 2-4 hours on a single A100 or RTX 4090 for 200 demonstrations. The learning rate, batch size, and number of training steps should be tuned on a held-out validation split -- the Octo repository provides sensible defaults that work for most manipulation setups.",
        "Third, evaluation: deploy the fine-tuned model on your physical robot at the target control frequency (typically 10 Hz for Octo-Base). The evaluation protocol should include a diverse set of initial conditions (varying object positions, orientations, and environmental configurations) to assess generalization beyond the training distribution. A common failure mode is overfitting to specific object placements in the training data -- if all training demonstrations start with the object in the same position, the policy may fail when the object appears elsewhere. Ensure demonstration diversity by systematically varying initial conditions during data collection.",
        "A critical but often overlooked step is action normalization validation. Octo expects actions as end-effector deltas in the robot's base frame with consistent units (meters for translation, radians for rotation). If the normalization statistics computed from your dataset are incorrect -- for example, if a few outlier demonstrations skew the normalization range -- the fine-tuned model will produce actions at the wrong scale. Claru's delivery pipeline includes automated normalization validation that flags statistical outliers before training begins, preventing this common failure mode.",
      ],
    },
    // Deployment Considerations
    {
      type: "prose",
      heading: "Deployment Considerations",
      paragraphs: [
        "Octo's 93M parameter count makes it deployable on edge hardware that larger VLA models cannot run on. Octo-Base runs at approximately 10 Hz on a consumer GPU (RTX 3090/4090) or 15 Hz on a datacenter A100. For compute-constrained robots, Octo-Small (27M) and Octo-Tiny (10M) provide further latency reduction at the cost of some generalization capability. No TPU or multi-GPU setup is required for either fine-tuning or inference.",
        "The diffusion action head produces temporally smooth 4-step action chunks, which is both an advantage (smoother motions than single-step prediction) and a design constraint (the policy commits to 4 future actions before re-observing the environment). For tasks requiring highly reactive control -- catching thrown objects, responding to sudden perturbations -- the 4-step commitment may be too long. In practice, most tabletop manipulation tasks at 10 Hz operate well within this constraint, as 4 steps at 10 Hz span only 400ms of execution.",
        "For teams transitioning from simulation to real-world deployment, Octo provides a natural bridge. Pre-training on 25 diverse OXE datasets gives the model exposure to a wide range of visual appearances and action distributions. Fine-tuning on real-world data from your specific robot and environment then adapts the pre-trained representations to your deployment context. This transfer learning approach typically requires 3-10x less real-world data than training from scratch, significantly reducing the data collection investment for new robot deployments.",
      ],
    },
    // Octo in the Ecosystem
    {
      type: "prose",
      heading: "Octo in the Robot Learning Ecosystem",
      paragraphs: [
        "Octo occupies a specific niche in the growing landscape of generalist robot policies: it is the practical, accessible option. While OpenVLA (7B parameters) offers stronger language understanding and semantic reasoning, Octo's 93M-parameter footprint means it fine-tunes in 2-4 hours on a single GPU rather than 10-15 hours, runs at 10 Hz rather than 5 Hz, and fits comfortably on consumer-grade hardware. For research teams that need to iterate quickly on new tasks and environments, this speed advantage translates directly to faster experimental cycles.",
        "The Octo team at UC Berkeley -- including Dibya Ghosh, Homer Walke, Oier Mees, Sudeep Dasari, and Karl Pertsch among others -- designed the model specifically for the fine-tuning use case. The pre-trained checkpoint is not intended to be deployed zero-shot (it performs poorly without fine-tuning on a target robot), but rather as a starting point that reduces the amount of task-specific data needed. This design philosophy differs from VLA models like RT-2 that aim for strong zero-shot generalization: Octo explicitly trades zero-shot capability for fine-tuning efficiency.",
        "The diffusion action head is a deliberate architectural choice that sets Octo apart from autoregressive VLA models. Where OpenVLA and RT-2 predict actions as discrete token sequences (which can produce quantization artifacts), Octo's diffusion head generates continuous action distributions through iterative denoising. This naturally handles multimodal action distributions -- when there are multiple valid ways to accomplish a task, the diffusion head can represent all of them. The 4-step action chunking provides temporal smoothness that single-step prediction methods lack, producing robot motions that appear more deliberate and controlled.",
        "For teams evaluating whether to use Octo or OpenVLA for a new project, the decision often comes down to two factors: whether the task requires strong language conditioning (favoring OpenVLA), and how much compute is available for fine-tuning and inference (favoring Octo). Many production teams start with Octo for rapid prototyping and switch to OpenVLA once they have confirmed the task is feasible and collected sufficient fine-tuning data.",
      ],
    },
    // Common Pitfalls
    {
      type: "prose",
      heading: "Common Pitfalls and How to Avoid Them",
      paragraphs: [
        "The most common failure in Octo fine-tuning is incorrect action normalization. Octo expects actions as 7-DoF end-effector deltas (dx, dy, dz, droll, dpitch, dyaw, gripper) normalized to a consistent range. If the normalization statistics are computed incorrectly -- due to outlier demonstrations, mixed units (meters vs millimeters), or inconsistent coordinate frames -- the fine-tuned model will produce actions at the wrong scale. Always validate that de-normalized actions from a few training examples produce physically reasonable robot motions before training begins.",
        "A second common pitfall is insufficient initial-condition diversity in fine-tuning data. If all demonstrations start with objects in similar positions, the fine-tuned policy will fail when objects appear in novel locations. Systematically vary initial conditions -- object positions, orientations, workspace clutter, and even camera viewpoint within task-compatible ranges -- across your demonstration set. A good rule of thumb is that no two demonstrations should have identical initial object configurations.",
        "Third, camera viewpoint matters more than many teams realize. Octo was pre-trained on data from diverse camera positions across the OXE datasets, but if your fine-tuning data uses a camera position that is substantially different from anything in the pre-training distribution (e.g., a very close overhead view), the pre-trained visual features may not transfer well. Matching your camera setup to one of the common OXE configurations (third-person at roughly 45-degree angle, 30-60cm from workspace) maximizes transfer from pre-training.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Octo vs. Related Generalist Robot Policies",
      columns: ["Model", "Parameters", "Pre-training Data", "Action Head", "Inference Speed", "Open Source"],
      rows: [
        { Model: "Octo-Base", Parameters: "93M", "Pre-training Data": "800K OXE trajectories", "Action Head": "Diffusion (4-step chunks)", "Inference Speed": "~10 Hz", "Open Source": "Fully (code + weights + data)" },
        { Model: "OpenVLA", Parameters: "7B", "Pre-training Data": "970K OXE trajectories", "Action Head": "Autoregressive token prediction", "Inference Speed": "~5 Hz", "Open Source": "Fully (code + weights)" },
        { Model: "RT-2-X (55B)", Parameters: "55B", "Pre-training Data": "130K Google demos + web VLM data", "Action Head": "Autoregressive token prediction", "Inference Speed": "~3 Hz", "Open Source": "No (paper only)" },
        { Model: "Diffusion Policy", Parameters: "~25M", "Pre-training Data": "Per-task only (no pre-training)", "Action Head": "Diffusion (16-step chunks)", "Inference Speed": "10-50 Hz", "Open Source": "Fully (code + weights)" },
        { Model: "pi-zero", Parameters: "~3B", "Pre-training Data": "10K+ hours multi-embodiment", "Action Head": "Flow matching", "Inference Speed": "~50 Hz", "Open Source": "Partially (openpi inference)" },
      ],
    },
    {
      type: "prose",
      heading: "Training Data Requirements",
      paragraphs: [
        "Octo consumes data exclusively in RLDS format (the TensorFlow Datasets format used by the Open X-Embodiment project). Each episode is a sequence of steps containing: RGB observations (256x256, one or two views), an action vector (typically 7-DoF end-effector deltas: dx, dy, dz, droll, dpitch, dyaw, gripper), a language instruction string, and episode metadata. The RLDS format requires specific dataset builders and tfrecord serialization -- Claru handles this conversion as part of our delivery pipeline.",
        "For fine-tuning Octo on a new single-arm manipulator with a single task, 100-200 high-quality teleoperated demonstrations are typically sufficient to achieve strong performance. The Octo team's own experiments showed reliable fine-tuning with as few as 100 demonstrations on tasks like pick-and-place and drawer manipulation. For multi-task fine-tuning on a single robot, 200-500 demonstrations per task (across 3-10 tasks) is recommended. For cross-embodiment fine-tuning (adapting to a new robot form factor), 500-2,000 demonstrations provide enough coverage of the new action space.",
        "Data quality requirements are strict. Observations must be temporally synchronized with actions within one control cycle (~100ms at 10 Hz). RGB images should be 256x256 after any cropping or resizing, captured from fixed camera positions within each task (camera position can vary across tasks). Actions must be expressed as end-effector deltas in the robot's base frame, with consistent units (meters for position, radians for orientation). Failed demonstrations or episodes with significant teleoperation artifacts (large discontinuities, gripper oscillation) should be filtered out before training.",
        "Language instructions should be concise, descriptive, and consistent across demonstrations of the same task. For example, 'pick up the red block and place it on the plate' is better than 'do the thing with the block.' Octo's T5-based language encoder can handle paraphrased instructions, but consistency within a fine-tuning dataset helps convergence. For goal-image conditioning instead of language, the goal image should be a 256x256 RGB frame showing the desired final state of the scene."
      ],
    },
    {
      type: "prose",
      heading: "How Claru Data Integrates with Octo",
      paragraphs: [
        "Claru delivers Octo-ready datasets in RLDS format with all the required metadata, tokenization-compatible preprocessing, and quality validation. Our pipeline handles the full conversion chain: raw teleoperation recordings are processed into RLDS-compatible tfrecord files with properly structured episode dictionaries containing observation tensors (256x256 RGB, one or two views), normalized 7-DoF action vectors, and paired language instructions.",
        "For dual-view setups, we provide synchronized primary (third-person) and wrist camera feeds. The Octo team's experiments showed that adding a wrist camera view improves fine manipulation performance by 15-25% on tasks requiring precise finger placement. Claru's data collection rigs capture both views with hardware-synchronized timestamps, ensuring the sub-100ms alignment Octo's training pipeline requires.",
        "Our typical delivery for an Octo fine-tuning project is 200-2,000 demonstrations across 3-10 tasks, with each demonstration fully annotated with language instructions, action normalization metadata, and quality scores. We provide a validation split (10-20% of episodes) pre-separated for evaluation. All datasets include documentation of camera intrinsics, extrinsics, robot URDF references, and action space definitions so that downstream users can reproduce and extend the fine-tuning without ambiguity."
      ],
    },
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        { id: "team-octo-2024", title: "Octo: An Open-Source Generalist Robot Policy", authors: "Octo Model Team (Ghosh, Homer, Shafiullah et al.)", venue: "RSS 2024 / arXiv 2405.12213", year: 2024, url: "https://arxiv.org/abs/2405.12213" },
        { id: "oneill-oxe-2024", title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models", authors: "O'Neill et al.", venue: "ICRA 2024 / arXiv 2310.08864", year: 2024, url: "https://arxiv.org/abs/2310.08864" },
        { id: "chi-diffusion-2023", title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion", authors: "Chi et al.", venue: "RSS 2023 / arXiv 2303.04137", year: 2023, url: "https://arxiv.org/abs/2303.04137" },
        { id: "kim-openvla-2024", title: "OpenVLA: An Open-Source Vision-Language-Action Model", authors: "Kim et al.", venue: "arXiv 2406.09246", year: 2024, url: "https://arxiv.org/abs/2406.09246" },
        { id: "brohan-rt2-2023", title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", authors: "Brohan et al.", venue: "arXiv 2307.15818", year: 2023, url: "https://arxiv.org/abs/2307.15818" },
        { id: "zhao-act-2023", title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware", authors: "Zhao et al.", venue: "RSS 2023 / arXiv 2304.13705", year: 2023, url: "https://arxiv.org/abs/2304.13705" },
      ],
    },
  ],
  faqs: [
    { question: "How does Octo compare to OpenVLA for fine-tuning?", answer: "Octo is 75x smaller (93M vs. 7B parameters), runs 2x faster at inference (~10 Hz vs. ~5 Hz), and fine-tunes in 2-4 hours on a single GPU vs. 10-15 hours for OpenVLA with LoRA. Octo uses a diffusion action head that produces smooth continuous actions, while OpenVLA uses autoregressive token prediction which can produce discretization artifacts. However, OpenVLA has stronger language understanding due to its Llama 2 backbone, making it better for complex language-conditioned tasks. For teams that need fast iteration and deployment, Octo is the practical choice. The Octo team's own benchmarks showed that for simple manipulation tasks like pick-and-place, the performance gap between Octo and OpenVLA narrows substantially after fine-tuning on the same demonstration set." },
    { question: "What is the minimum fine-tuning data for Octo?", answer: "100-200 demonstrations for single-task adaptation on a new robot. The Octo team demonstrated reliable fine-tuning on pick-and-place tasks with 100 demonstrations, achieving 85-95% success rates. For multi-task fine-tuning, 200-500 demonstrations per task across 3-10 tasks is recommended. For cross-embodiment adaptation to a completely new robot morphology, 500-2,000 demonstrations provide sufficient coverage. Fine-tuning uses the same RLDS format as pre-training, with 256x256 RGB observations and 7-DoF action labels. With LoRA fine-tuning, the compute requirement drops to 2-4 hours on a single A100 or RTX 4090, making rapid iteration feasible even for small teams." },
    { question: "Does Octo support multi-camera input?", answer: "Yes. Octo natively supports primary (third-person) and wrist camera views at 256x256 resolution. The modular tokenization means you can use one or both cameras without changing the model architecture -- a robot with only a single camera simply omits the wrist camera tokens from the input sequence. Adding a wrist camera improves fine manipulation performance by 15-25% on tasks requiring precise gripper placement, according to the Octo team's ablation studies. This dual-view capability is especially valuable for insertion, grasping thin objects, and any task where close-range visual feedback is critical. Claru collects hardware-synchronized dual-view data specifically formatted for Octo's multi-view input pipeline." },
    { question: "Can I use Octo with a non-standard robot?", answer: "Yes, this is one of Octo's key strengths. The pre-trained model has seen 25 different robot embodiments during OXE pre-training, ranging from single-arm WidowX and Franka manipulators to bi-manual setups. Fine-tuning on 100-500 demonstrations from your specific robot adapts the action head to your robot's kinematics and action space. You need to normalize your robot's actions to the 7-DoF end-effector delta format (position + orientation + gripper) that Octo expects, or you can modify the action head dimension during fine-tuning for robots with different DoF counts. The critical requirement is consistent action normalization -- Claru handles this conversion as part of our RLDS delivery pipeline." },
    { question: "What hardware do I need to fine-tune and deploy Octo?", answer: "Octo-Base (93M parameters) fine-tunes on a single GPU with 16GB+ VRAM in 2-4 hours for 200 demonstrations. Inference runs at ~10 Hz on consumer GPUs (RTX 3090/4090) or ~15 Hz on A100. For edge deployment, Octo-Small (27M) and Octo-Tiny (10M) offer reduced latency at the cost of some generalization. No TPU or multi-GPU setup is required for fine-tuning or inference. This hardware accessibility is a major advantage over larger models -- OpenVLA requires 24GB+ VRAM and 10-15 hours for LoRA fine-tuning, while RT-2 requires TPU pods that most teams cannot access." },
    { question: "How does Octo's diffusion action head differ from autoregressive action prediction?", answer: "Octo's diffusion head generates continuous 7-DoF actions through iterative denoising, predicting 4 future timesteps simultaneously as an action chunk. This approach has three key advantages over autoregressive token prediction used by OpenVLA and RT-2. First, continuous output avoids the quantization artifacts that 256-bin discretization introduces -- important for precise manipulation where sub-millimeter accuracy matters. Second, the diffusion process naturally represents multi-modal action distributions (multiple valid ways to accomplish a task) without mode averaging. Third, 4-step action chunking produces temporally smooth trajectories with fewer direction reversals. The tradeoff is that the diffusion denoising process requires multiple forward passes per action chunk, though at 93M parameters this overhead is manageable, maintaining ~10 Hz throughput on consumer GPUs." },
  ],
  ctaHeading: "Get RLDS Data Formatted for Octo",
  ctaDescription: "Tell us about your Octo project -- target robot, task suite, camera setup -- and we will deliver fine-tuning datasets in RLDS format with the exact observation resolution, action normalization, and language annotations your pipeline requires.",
  relatedGlossaryTerms: ["vla", "open-x-embodiment", "diffusion-policy", "rlds"],
  relatedGuidePages: ["how-to-convert-data-to-rlds-format", "how-to-build-a-cross-embodiment-dataset"],
  relatedSolutionSlugs: ["vla-training-data"],
  modelName: "Octo",
  organization: "UC Berkeley",
  year: 2024,
  inputSpec: {
    observationFormat: "256x256 RGB (supports multi-view: primary + wrist)",
    actionFormat: "7-DoF end-effector delta positions + gripper (continuous, via diffusion head)",
    languageConditioning: "Natural language instructions or goal images (T5-Base encoder)",
    controlFrequency: "~10 Hz (variable per embodiment)",
  },
  dataVolumeBenchmarks: "Octo was pre-trained on 800,000 trajectories from 25 datasets within the Open X-Embodiment collection, spanning single-arm manipulators, bi-manual robots, and varied camera configurations. This makes it the largest fully open-source generalist robot policy at release. For fine-tuning on a new single-arm robot, 100-200 demonstrations suffice for single-task adaptation, achieving 85-95% success rates on pick-and-place and drawer manipulation in the team's experiments. Multi-task fine-tuning benefits from 200-500 demonstrations per task across 3-10 tasks. Cross-embodiment adaptation to a completely new robot form factor typically requires 500-2,000 demonstrations. The model ships in three sizes -- Octo-Tiny (10M), Octo-Small (27M), and Octo-Base (93M) -- all fine-tunable on a single GPU in 2-4 hours. Pre-training from the Octo checkpoint reduces required demonstrations by 3-10x compared to training from random initialization.",
  trainingRecipe: "Octo's training follows a two-stage pipeline. Stage 1 (pre-training): the full transformer backbone and diffusion action head are trained on the 800K OXE trajectory mixture using a denoising diffusion objective on action chunks. Images are tokenized via a lightweight CNN into 16x16 patch features, and language is encoded with T5-Base. The transformer processes the concatenated token sequence and produces readout tokens consumed by the diffusion head, which predicts 4-step action chunks through iterative denoising. Pre-training runs on TPU pods for the base model. Stage 2 (fine-tuning): the pre-trained checkpoint is adapted to a target robot and task set. Fine-tuning supports both full parameter updates and LoRA-based parameter-efficient tuning (rank 32, applied to attention layers). Data must be in RLDS format with 256x256 RGB observations, 7-DoF normalized actions, and language instructions. Fine-tuning on 200 demonstrations takes 2-4 hours on a single A100 or RTX 4090.",
  claruIntegration: "Claru delivers Octo-ready data in RLDS format with multi-view RGB observations (primary + wrist camera at 256x256), paired language instructions, and continuous 7-DoF action labels. Our pipeline handles raw teleoperation recording conversion to RLDS-compatible tfrecords, action normalization to Octo's expected end-effector delta format, and temporal synchronization to sub-100ms alignment. We typically provide 200-2,000 demonstrations for fine-tuning with pre-separated validation splits, camera calibration metadata, and robot URDF references. Automated normalization validation flags statistical outliers before training begins.",
  keyPapers: [
    { id: "team-octo-2024", title: "Octo: An Open-Source Generalist Robot Policy", authors: "Octo Model Team (Ghosh, Homer, Shafiullah et al.)", venue: "RSS 2024 / arXiv 2405.12213", year: 2024, url: "https://arxiv.org/abs/2405.12213" },
    { id: "oneill-oxe-2024", title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models", authors: "O'Neill et al.", venue: "ICRA 2024 / arXiv 2310.08864", year: 2024, url: "https://arxiv.org/abs/2310.08864" },
    { id: "chi-diffusion-2023", title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion", authors: "Chi et al.", venue: "RSS 2023 / arXiv 2303.04137", year: 2023, url: "https://arxiv.org/abs/2303.04137" },
    { id: "kim-openvla-2024", title: "OpenVLA: An Open-Source Vision-Language-Action Model", authors: "Kim et al.", venue: "arXiv 2406.09246", year: 2024, url: "https://arxiv.org/abs/2406.09246" },
    { id: "brohan-rt2-2023", title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", authors: "Brohan et al.", venue: "arXiv 2307.15818", year: 2023, url: "https://arxiv.org/abs/2307.15818" },
    { id: "zhao-act-2023", title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware", authors: "Zhao et al.", venue: "RSS 2023 / arXiv 2304.13705", year: 2023, url: "https://arxiv.org/abs/2304.13705" },
  ],
};

export default data;
