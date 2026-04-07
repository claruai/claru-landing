import type { ModelPageData } from "../types";

const data: ModelPageData = {
  slug: "openvla",
  metaTitle: "Training Data for OpenVLA | Data Requirements & Formats | Claru",
  metaDescription: "Complete guide to OpenVLA training data requirements: RLDS format, 224x224 RGB, tokenized 7-DoF actions, 970K demonstrations, and how Claru delivers OpenVLA-ready datasets.",
  primaryKeyword: "openvla training data",
  secondaryKeywords: ["openvla data requirements", "openvla dataset format", "openvla fine-tuning data", "openvla RLDS format", "openvla-oft training", "vision-language-action model data"],
  canonicalPath: "/models/openvla",
  h1: "Training Data for OpenVLA",
  heroSubtitle: "OpenVLA is a 7B-parameter open-source vision-language-action model that outperforms RT-2-X (55B) while being fully open. This guide covers observation formats, action tokenization, fine-tuning data volumes, and how Claru delivers OpenVLA-ready datasets in RLDS format.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Models", href: "/models" },
    { label: "OpenVLA", href: "/models/openvla" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is OpenVLA?",
      paragraphs: [
        "OpenVLA is a 7-billion-parameter open-source vision-language-action model developed by Moo Jin Kim, Karl Pertsch, Siddharth Karamcheti, and collaborators at Stanford University, UC Berkeley, Toyota Research Institute (TRI), Google DeepMind, Physical Intelligence, and MIT (arXiv:2406.09246, June 2024). It was trained on 970,000 robot manipulation trajectories from the Open X-Embodiment dataset spanning 22 robot embodiments, making it the largest and most capable fully open VLA at release.",
        "OpenVLA's architecture fuses a Prismatic vision-language model backbone with a robot action prediction head. The visual encoder combines two complementary backbones -- DINOv2 (for spatial/geometric features) and SigLIP (for semantic/language-aligned features) -- whose outputs are fused and projected into the input space of a Llama 2 7B language model. The language model then predicts discretized robot actions as token sequences, the same way it would predict the next word in a sentence. This design lets OpenVLA inherit the language understanding, reasoning, and few-shot capabilities of the underlying LLM.",
        "The headline result: OpenVLA outperforms the closed RT-2-X model (55B parameters) by 16.5% absolute task success rate across 29 tasks and multiple robot embodiments, despite being 7x smaller. On the WidowX robot benchmark used in the RT-2-X evaluation, OpenVLA achieved 90%+ success on several tasks that RT-2-X struggled with. This demonstrated that open models with strong VLM backbones can match or exceed much larger closed models when trained on sufficient robot data.",
        "OpenVLA was trained on a cluster of 64 A100 GPUs for 14 days, totaling approximately 21,500 A100-hours. Fine-tuning for a specific robot and task set is far more accessible: with LoRA (Low-Rank Adaptation), fine-tuning takes 10-15 hours on a single A100 GPU. The follow-up work OpenVLA-OFT (arXiv:2502.19645) introduced an optimized fine-tuning recipe with parallel decoding and continuous action representations that increased inference speed by 26x and boosted the LIBERO benchmark average from 76.5% to 97.1%."
      ],
    },
    {
      type: "stats",
      heading: "OpenVLA at a Glance",
      stats: [
        { value: "7B", label: "Parameters" },
        { value: "970K", label: "Pre-training demonstrations" },
        { value: "22", label: "Robot embodiments in training" },
        { value: "16.5%", label: "Absolute gain over RT-2-X (55B)" },
        { value: "21,500", label: "A100-hours for pre-training" },
        { value: "224x224", label: "Observation resolution" },
      ],
    },
    {
      type: "comparison-table",
      heading: "OpenVLA Input/Output Specification",
      columns: ["Parameter", "Specification"],
      rows: [
        { Parameter: "Observation Format", Specification: "224x224 RGB images (single third-person view)" },
        { Parameter: "Visual Encoder", Specification: "Fused DINOv2 + SigLIP (Prismatic VLM backbone)" },
        { Parameter: "Language Model", Specification: "Llama 2 7B" },
        { Parameter: "Task Specification", Specification: "Natural language task instructions" },
        { Parameter: "Action Format", Specification: "7-DoF end-effector deltas + gripper (discretized to 256 bins per dimension)" },
        { Parameter: "Action Decoding", Specification: "Autoregressive token prediction (7 tokens per timestep)" },
        { Parameter: "Control Frequency", Specification: "~5 Hz (autoregressive decoding bottleneck)" },
        { Parameter: "Data Format", Specification: "RLDS (TensorFlow Datasets)" },
        { Parameter: "Fine-tuning Methods", Specification: "Full fine-tuning (64 A100s) or LoRA (single A100, 10-15 hrs)" },
      ],
    },
    {
      type: "prose",
      heading: "Architecture and Key Innovations",
      paragraphs: [
        "OpenVLA's architecture has three main components wired in sequence. First, the visual encoder: 224x224 RGB images are processed through both a DINOv2 ViT backbone (which excels at spatial/geometric features like object boundaries and depth cues) and a SigLIP backbone (which provides semantically rich, language-aligned features). The two feature sets are fused through a learned projector that maps them into the Llama 2 embedding space. This dual-encoder design is a direct contribution of the Prismatic VLM framework (Karamcheti et al., 2024), which showed that combining complementary vision backbones outperforms any single encoder.",
        "Second, the language model backbone: Llama 2 7B processes the projected visual tokens alongside tokenized natural language instructions. The key insight is that robot actions are represented as discrete tokens in the same vocabulary space as language. Each continuous action dimension (dx, dy, dz, droll, dpitch, dyaw, gripper) is discretized into 256 bins, and the model predicts these 7 action tokens autoregressively, exactly as it would predict the next 7 words. This co-representation of language and actions in a shared token space is what enables transfer from web-scale VLM pre-training to robot control.",
        "Third, the action tokenization scheme: 7-DoF end-effector deltas are normalized per-dimension and mapped to 256 discrete bins. During inference, the model generates 7 tokens autoregressively (one per action dimension), then the tokens are de-discretized back to continuous values. This tokenization is the main inference bottleneck -- generating 7 tokens sequentially limits OpenVLA to ~5 Hz. The OpenVLA-OFT follow-up addressed this by switching to parallel decoding with continuous action representations, achieving 26x faster action generation while improving task success rates.",
        "The training procedure has two stages. Stage 1: vision-language pre-training using the Prismatic VLM recipe on web-scale image-text data, which teaches the model visual grounding, object recognition, spatial reasoning, and instruction following. Stage 2: robot action fine-tuning on the 970K OXE trajectories, where the model learns to predict discretized actions conditioned on visual observations and language instructions. The full Stage 2 training ran for 14 days on 64 A100 GPUs with a batch size of 2048."
      ],
    },
    {
      type: "prose",
      heading: "Benchmark Results and Performance Analysis",
      paragraphs: [
        "OpenVLA's evaluation spans multiple robot platforms and task suites, providing a comprehensive picture of where the model excels and where it falls short. On the WidowX Bridge evaluation used in the RT-2-X paper (29 tasks), OpenVLA achieved an average success rate of 73.5% compared to RT-2-X's 57.0% -- a 16.5 percentage point advantage despite OpenVLA being 7x smaller. The improvement was most pronounced on tasks requiring semantic understanding: 'put the carrot in the pot' (OpenVLA: 92%, RT-2-X: 68%) and 'place the knife on the cutting board' (OpenVLA: 88%, RT-2-X: 52%).",
        "On the LIBERO benchmark suite (130 tasks across 5 task suites), the base OpenVLA fine-tuned with the standard recipe achieved 76.5% average success. The OpenVLA-OFT optimized fine-tuning recipe pushed this to 97.1% -- a 20.6 percentage point improvement from the same pretrained checkpoint, demonstrating that the original recipe left substantial performance on the table. The LIBERO-Long suite (multi-step sequential tasks) showed the largest gains, from 66.2% to 96.8%, suggesting that action chunking in OFT is particularly beneficial for temporally extended tasks.",
        "Cross-embodiment transfer analysis revealed that OpenVLA's performance scales with the amount of training data available for each embodiment in OXE. Embodiments with more than 50K demonstrations in OXE (WidowX, Google Robot) showed strong zero-shot and few-shot fine-tuning performance. Embodiments with fewer than 5K demonstrations in OXE (Kuka, xArm) required more fine-tuning data to reach equivalent performance, suggesting that pretraining data volume per embodiment is a more important predictor than total pretraining volume.",
        "Comparison with Octo (93M parameters) on matched fine-tuning data showed that OpenVLA outperformed Octo by 10-25% on language-conditioned tasks requiring semantic object discrimination ('pick up the red cup, not the blue one'), but Octo matched or slightly exceeded OpenVLA on simple geometric tasks ('push the block forward'). This confirms that OpenVLA's advantage is specifically in language grounding from the Llama 2 backbone, not in low-level motor control quality.",
      ],
    },
    // OpenVLA-OFT
    {
      type: "prose",
      heading: "OpenVLA-OFT: Optimized Fine-Tuning",
      paragraphs: [
        "OpenVLA-OFT (arXiv 2502.19645, Kim et al., February 2025) addresses the three main practical limitations of the original OpenVLA fine-tuning recipe: slow inference speed, action discretization artifacts, and lack of temporal action coherence. OFT changes three design decisions during the fine-tuning stage while keeping the pre-trained VLM backbone identical.",
        "First, parallel decoding replaces autoregressive generation. Instead of predicting 7 action tokens sequentially (requiring 7 forward passes), OFT predicts all action dimensions simultaneously in a single forward pass. This change alone increases inference speed from approximately 5 Hz to over 100 Hz. Second, continuous L1 regression replaces discretized token prediction. Rather than mapping continuous actions to 256 discrete bins (which introduces quantization noise), OFT regresses directly to continuous action values using an L1 loss. This eliminates the discretization artifacts that sometimes caused jittery robot motions. Third, action chunking predicts 5 future timesteps per inference call, providing temporal smoothness similar to Diffusion Policy and ACT.",
        "Together, these three changes increase inference speed by 26x (from approximately 5 Hz to approximately 130 Hz) and improve the LIBERO benchmark average from 76.5 percent to 97.1 percent. The LIBERO improvement is particularly striking because it demonstrates that the original OpenVLA's performance was substantially bottlenecked by the fine-tuning recipe, not by the pre-trained representations. The same pre-trained backbone produces dramatically better results when fine-tuned with a more appropriate action prediction formulation.",
        "For teams starting new OpenVLA projects today, OFT is the recommended fine-tuning approach. The pre-trained checkpoint is identical -- only the fine-tuning procedure and action head differ. Claru delivers data compatible with both the standard tokenized format (for teams using the original recipe) and continuous action labels (for OFT), so teams can experiment with both approaches without re-collecting data.",
      ],
    },
    // Practical Deployment
    {
      type: "prose",
      heading: "Deployment and Integration Considerations",
      paragraphs: [
        "OpenVLA's 7B parameter count places it in a middle ground between lightweight models like Octo (93M) and large closed models like RT-2-X (55B). The model fits on a single A100 or RTX 4090 (16GB+ VRAM) for inference, making it deployable on robot-mounted compute without cloud connectivity. However, the original autoregressive decoding limits inference to approximately 5 Hz -- adequate for careful manipulation but insufficient for dynamic tasks. OpenVLA-OFT's parallel decoding resolves this, pushing inference to speeds competitive with much smaller models.",
        "The dual visual encoder (DINOv2 + SigLIP) provides both geometric precision and semantic richness. DINOv2's features encode object boundaries, surface normals, and spatial structure -- critical for precise grasping and placement. SigLIP's features encode semantic object identity, category, and visual-language alignment -- critical for following language instructions about specific objects. This complementary encoding is why OpenVLA outperforms single-encoder models on tasks requiring both precision and semantic understanding.",
        "A practical consideration for deployment teams: OpenVLA's visual encoder is sensitive to camera distribution shift. The pre-trained model has seen primarily tabletop manipulation from third-person cameras in the OXE dataset. If your deployment camera is significantly different (overhead view, very close-up, industrial lighting with high contrast), you may need more fine-tuning data to bridge the visual gap. Claru collects data with camera configurations matched to your deployment setup -- same viewpoint, similar lighting, same workspace framing -- minimizing the distribution shift that degrades fine-tuning efficiency.",
      ],
    },
    // Language Instruction Design
    {
      type: "prose",
      heading: "Language Instruction Design for OpenVLA",
      paragraphs: [
        "OpenVLA's Llama 2 backbone gives it strong language understanding that can be leveraged or squandered depending on how language instructions are designed during data collection. The key principle is instruction diversity: for each task, provide multiple semantically equivalent but syntactically different instructions across demonstrations. Instead of always labeling a task 'pick up the red block,' alternate between 'grab the red cube,' 'lift the crimson block,' 'take the red block off the table,' and similar variations. This teaches the model that different phrasings map to the same physical behavior.",
        "Instruction granularity matters. OpenVLA processes one instruction per timestep and predicts a single action step. The instruction should describe the complete task ('pick up the red cup and place it on the saucer'), not individual sub-steps ('move left,' 'close gripper'). Sub-step instructions require a higher-level planner to decompose tasks, which adds architectural complexity. For multi-step tasks, the single high-level instruction is maintained throughout the episode, and the model implicitly learns the temporal sequence of sub-actions needed to complete the task.",
        "For teams collecting data for OpenVLA fine-tuning, Claru's annotation pipeline produces natural language instructions that follow these principles. Human annotators watch complete episodes and describe tasks in varied, natural language -- not templated descriptions or programmatic labels. Each annotator's phrasing style differs naturally, producing the instruction diversity that OpenVLA's language backbone needs for robust generalization to novel commands at deployment time.",
      ],
    },
    // Common Failure Modes
    {
      type: "prose",
      heading: "Common Failure Modes and Debugging",
      paragraphs: [
        "The most frequently encountered OpenVLA failure mode during fine-tuning is the model producing actions at the wrong scale -- the robot moves too far or not far enough per timestep. This almost always traces back to incorrect action normalization. OpenVLA normalizes each action dimension independently using per-dimension statistics from the training dataset. If the normalization range is skewed by a few outlier demonstrations (e.g., one episode where the teleoperator made an unusually large movement), all actions will be rescaled incorrectly. The fix is to filter outlier episodes before computing normalization statistics, using a threshold of 3 standard deviations per dimension.",
        "A second common failure is the model appearing to 'understand' the instruction (evidenced by correct initial approach direction) but failing to complete the task (dropping the object, missing the target). This typically indicates insufficient demonstration coverage of the task's later phases. Teleoperation demonstrations tend to have consistent early phases (approach the object) but divergent late phases (different grasp orientations, different placement strategies). If the late-phase diversity is underrepresented in training data, the model's predictions degrade as the episode progresses. Collecting additional demonstrations that specifically vary the completion phase resolves this.",
        "Third, visual domain shift between fine-tuning and deployment environments can cause silent performance degradation. The model appears to work (smooth motions, reasonable trajectories) but success rates are lower than expected. This happens when lighting, background, or camera viewpoint at deployment differ from the fine-tuning data distribution. The DINOv2+SigLIP encoder is relatively robust to small visual shifts, but large changes (industrial halogen lighting vs. fluorescent, cluttered warehouse background vs. clean tabletop) require additional fine-tuning data from the deployment environment. Claru addresses this by collecting data in environments that match the target deployment conditions.",
      ],
    },
    {
      type: "comparison-table",
      heading: "OpenVLA vs. Related VLA Models",
      columns: ["Model", "Parameters", "Pre-training Data", "Action Representation", "Open Source", "Inference Speed"],
      rows: [
        { Model: "OpenVLA", Parameters: "7B", "Pre-training Data": "970K OXE demos", "Action Representation": "Discretized tokens (256 bins x 7-DoF)", "Open Source": "Fully open", "Inference Speed": "~5 Hz" },
        { Model: "OpenVLA-OFT", Parameters: "7B", "Pre-training Data": "Same + task fine-tuning", "Action Representation": "Continuous L1 regression (parallel decoding)", "Open Source": "Fully open", "Inference Speed": "~130 Hz" },
        { Model: "RT-2-X", Parameters: "55B", "Pre-training Data": "130K Google demos + web VLM", "Action Representation": "Discretized tokens", "Open Source": "Closed", "Inference Speed": "~3 Hz" },
        { Model: "Octo-Base", Parameters: "93M", "Pre-training Data": "800K OXE demos", "Action Representation": "Continuous (diffusion head)", "Open Source": "Fully open", "Inference Speed": "~10 Hz" },
        { Model: "pi-zero", Parameters: "~3B", "Pre-training Data": "10K+ hrs multi-embodiment", "Action Representation": "Continuous (flow matching)", "Open Source": "Partially open", "Inference Speed": "~50 Hz" },
      ],
    },
    {
      type: "prose",
      heading: "Training Data Requirements",
      paragraphs: [
        "OpenVLA consumes data in RLDS format. Each episode contains a sequence of steps with: a 224x224 RGB observation (single third-person camera view), a natural language task instruction string, and a 7-DoF action vector (end-effector position delta, orientation delta, and gripper state). Actions are normalized per-dimension across the training dataset and then discretized into 256 bins. The RLDS format requires TensorFlow Datasets builders with specific episode and step schemas -- getting this format right is critical for training to converge.",
        "For fine-tuning OpenVLA on a new robot and task set, data volumes depend on the fine-tuning strategy. With LoRA fine-tuning (rank 32, applied to attention layers), 100-500 demonstrations per task typically achieve 80%+ success rates on single-task manipulation. Kim et al. showed strong results with just 100 demonstrations on several WidowX tasks. For multi-task fine-tuning across 10+ tasks on a single robot, 200-1,000 demonstrations per task is recommended. Full fine-tuning (updating all 7B parameters) benefits from more data but requires significantly more compute.",
        "Language instructions must be paired with every demonstration. OpenVLA's Llama 2 backbone has strong language grounding, so natural, descriptive instructions work well: 'pick up the red cup and place it on the saucer' is more effective than 'task_3.' Instructions should be varied across demonstrations of the same task (paraphrased) to improve generalization, but semantically consistent. Each demonstration should have one instruction that describes the full task; sub-step instructions are not used in the standard fine-tuning pipeline.",
        "Image quality matters. Observations should be well-lit, with the workspace clearly visible in the frame. OpenVLA processes single 224x224 images -- if your raw camera produces higher resolution, crop to the workspace region and resize. The DINOv2+SigLIP visual encoder is sensitive to image distribution shifts: if fine-tuning images look dramatically different from the OXE pre-training distribution (industrial vs. tabletop, very different lighting), you may need more demonstrations to bridge the visual gap."
      ],
    },
    {
      type: "prose",
      heading: "How Claru Data Integrates with OpenVLA",
      paragraphs: [
        "Claru delivers OpenVLA-ready datasets in RLDS format with 224x224 RGB observations, paired natural language instructions, and correctly normalized 7-DoF action vectors. Our pipeline handles the full conversion from raw teleoperation recordings to RLDS-compatible tfrecords, including per-dimension action normalization statistics, workspace-region cropping, and instruction annotation. Every dataset ships with the normalization parameters needed for de-discretization at inference time.",
        "We provide natural language instructions for every demonstration, written by human annotators who watch the full episode and describe the task in natural, varied language. This produces the instruction diversity that OpenVLA's Llama 2 backbone leverages for generalization. For teams running OpenVLA-OFT's optimized fine-tuning recipe, we also deliver continuous (un-discretized) action labels compatible with the L1 regression objective and parallel decoding setup.",
        "Our typical delivery for an OpenVLA project is 500-5,000 task-specific demonstrations with paired language instructions across 5-20 manipulation tasks. We include pre-computed action normalization statistics, a held-out validation split, camera calibration metadata, and a data loading verification script that confirms RLDS schema compatibility before training begins."
      ],
    },
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        { id: "kim-openvla-2024", title: "OpenVLA: An Open-Source Vision-Language-Action Model", authors: "Kim, M. J., Pertsch, K., Karamcheti, S., et al.", venue: "CoRL 2024 / arXiv 2406.09246", year: 2024, url: "https://arxiv.org/abs/2406.09246" },
        { id: "kim-openvla-oft-2025", title: "Fine-Tuning Vision-Language-Action Models: Optimizing Speed and Success", authors: "Kim, M. J., Pertsch, K., Karamcheti, S., et al.", venue: "arXiv 2502.19645", year: 2025, url: "https://arxiv.org/abs/2502.19645" },
        { id: "karamcheti-prismatic-2024", title: "Prismatic VLMs: Investigating the Design Space of Visually-Conditioned Language Models", authors: "Karamcheti, S., et al.", venue: "ICML 2024 / arXiv 2402.07865", year: 2024, url: "https://arxiv.org/abs/2402.07865" },
        { id: "oneill-oxe-2024", title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models", authors: "Open X-Embodiment Collaboration", venue: "ICRA 2024 / arXiv 2310.08864", year: 2024, url: "https://arxiv.org/abs/2310.08864" },
        { id: "brohan-rt2-2023", title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", authors: "Brohan, A., et al.", venue: "CoRL 2023 / arXiv 2307.15818", year: 2023, url: "https://arxiv.org/abs/2307.15818" },
        { id: "team-octo-2024", title: "Octo: An Open-Source Generalist Robot Policy", authors: "Octo Model Team", venue: "RSS 2024 / arXiv 2405.12213", year: 2024, url: "https://arxiv.org/abs/2405.12213" },
      ],
    },
  ],
  faqs: [
    { question: "How much data do I need to fine-tune OpenVLA for my robot?", answer: "For single-task fine-tuning with LoRA, 100-500 demonstrations typically achieve 80%+ success rates. Kim et al. showed strong results with just 100 demonstrations on WidowX tasks. For multi-task fine-tuning across 10+ tasks on one robot, 200-1,000 demonstrations per task is recommended. Data must be in RLDS format with 224x224 RGB observations, language instructions, and normalized 7-DoF actions discretized to 256 bins per dimension. The OpenVLA-OFT recipe achieves stronger results with the same data volume by switching to continuous action regression and parallel decoding, so the same dataset serves both the original and optimized fine-tuning approaches." },
    { question: "Can OpenVLA work with wrist camera data?", answer: "The base OpenVLA model uses a single third-person camera view at 224x224. The architecture processes one image per timestep through its DINOv2+SigLIP visual encoder. Multi-view extensions are being developed by the community but are not part of the official release. For tasks requiring wrist-camera precision, Octo (which natively supports dual-view) or Diffusion Policy may be better choices. If your task benefits from both strong language conditioning (OpenVLA's strength) and wrist camera data, the practical approach is to fine-tune OpenVLA with third-person views and separately evaluate whether the wrist view is critical for your specific tasks. Claru can collect data with both views and deliver the appropriate single-view format for OpenVLA." },
    { question: "What is the minimum hardware to run OpenVLA?", answer: "Inference: OpenVLA's 7B parameters require ~16GB GPU memory, fitting on a single A100, RTX 4090, or RTX 3090. Inference runs at ~5 Hz due to autoregressive action decoding (7 sequential tokens per timestep). OpenVLA-OFT's parallel decoding pushes this to ~130 Hz by predicting all dimensions simultaneously. Fine-tuning with LoRA: 24GB VRAM (single A100 or RTX 4090), 10-15 hours for 200 demonstrations. Full fine-tuning: 40-80GB VRAM or multi-GPU setup. For comparison, Octo-Base (93M) requires only 16GB and fine-tunes in 2-4 hours, making it better for rapid iteration on constrained hardware." },
    { question: "How does OpenVLA compare to Octo for fine-tuning?", answer: "OpenVLA (7B) has stronger language understanding and semantic grounding due to its Llama 2 backbone and DINOv2+SigLIP visual encoder, making it better for language-conditioned tasks and novel object generalization. In direct comparisons on matched data, OpenVLA outperforms Octo by 10-25% on tasks requiring semantic discrimination ('pick up the red cup, not the blue one'). Octo (93M) is 75x smaller, fine-tunes faster (2-4 hrs vs. 10-15 hrs), runs at ~10 Hz vs. ~5 Hz, and supports multi-view input natively. For language-heavy tasks with visual variety, OpenVLA is stronger. For fast deployment with simple task specifications, Octo is more practical. Many teams start with Octo for prototyping and move to OpenVLA for production." },
    { question: "What is the difference between OpenVLA and OpenVLA-OFT?", answer: "OpenVLA-OFT (Optimized Fine-Tuning) changes three design decisions during fine-tuning while keeping the pretrained VLM backbone identical: (1) parallel decoding replaces autoregressive generation, predicting all 7 action dimensions simultaneously in one forward pass instead of 7 sequential tokens; (2) continuous L1 regression replaces discretized 256-bin token prediction, eliminating quantization noise that caused jittery motions; (3) action chunking predicts 5 future timesteps per call, providing temporal smoothness. Together these changes increase inference speed by 26x (from ~5 Hz to ~130 Hz) and improve LIBERO benchmark success from 76.5% to 97.1%. The same training data works for both recipes -- Claru delivers data compatible with both approaches." },
    { question: "How does OpenVLA handle novel objects not seen during training?", answer: "OpenVLA demonstrates strong novel object generalization thanks to the Prismatic VLM backbone pretrained on internet-scale image-text data. The DINOv2 encoder provides geometric features (shape, boundaries, spatial structure) that generalize across object instances, while SigLIP provides semantic features aligned with language ('cup', 'tool', 'container') that enable recognition of unseen objects through their linguistic descriptions. On the WidowX benchmark, OpenVLA achieved significantly higher success rates than RT-2-X on tasks involving objects not present in the robot training data. The critical data requirement for maintaining this generalization during fine-tuning is instruction diversity -- if all fine-tuning instructions use identical object names, the model may overfit to those specific terms and lose its ability to generalize to novel descriptions." },
  ],
  ctaHeading: "Get RLDS Data Formatted for OpenVLA",
  ctaDescription: "Tell us about your OpenVLA project -- target robot, task suite, language instruction needs -- and we will deliver fine-tuning datasets in RLDS format with 224x224 observations, paired language annotations, and normalized action vectors.",
  relatedGlossaryTerms: ["vla", "open-x-embodiment", "imitation-learning", "rlds"],
  relatedGuidePages: ["how-to-create-action-labels-for-vla", "how-to-convert-data-to-rlds-format"],
  relatedSolutionSlugs: ["vla-training-data"],
  modelName: "OpenVLA",
  organization: "Stanford / TRI / UC Berkeley",
  year: 2024,
  inputSpec: {
    observationFormat: "224x224 RGB images (single third-person view)",
    actionFormat: "7-DoF end-effector deltas + gripper (discretized to 256 bins per dimension)",
    languageConditioning: "Natural language task instructions (Llama 2 7B backbone)",
    controlFrequency: "~5 Hz (autoregressive); ~130 Hz with OpenVLA-OFT parallel decoding",
  },
  dataVolumeBenchmarks: "OpenVLA was pre-trained on 970,000 robot manipulation trajectories from the Open X-Embodiment dataset spanning 22 robot embodiments. Training consumed 21,500 A100-hours (64 A100 GPUs for 14 days, batch size 2048). The model outperformed the closed RT-2-X (55B) by 16.5% absolute task success rate across 29 tasks despite being 7x smaller. On the LIBERO benchmark, the base fine-tuning recipe achieved 76.5% average success, while OpenVLA-OFT pushed this to 97.1% with the same pretrained backbone. For fine-tuning, LoRA adaptation on a single A100 takes 10-15 hours. Kim et al. demonstrated 80%+ success rates with as few as 100 demonstrations on single-task WidowX benchmarks. Multi-task fine-tuning across 10+ tasks benefits from 200-1,000 demonstrations per task. Cross-embodiment analysis showed performance scales with per-embodiment pretraining data volume -- embodiments with 50K+ OXE demos transferred better than those with under 5K.",
  trainingRecipe: "OpenVLA training has two stages. Stage 1 (VLM pre-training): the Prismatic VLM backbone -- DINOv2 + SigLIP visual encoders fused into Llama 2 7B -- is pre-trained on web-scale image-text data for visual grounding, object recognition, and instruction following. Stage 2 (robot action fine-tuning): the VLM is further trained on 970K OXE trajectories where 7-DoF end-effector actions are discretized into 256 bins per dimension and predicted as token sequences by the language model head. The action tokenization maps continuous action values to discrete vocabulary tokens, enabling the LLM to generate actions using the same autoregressive mechanism it uses for language. Training uses cross-entropy loss on the action tokens. Fine-tuning a new embodiment requires RLDS-formatted data with per-dimension action normalization statistics. LoRA fine-tuning (rank 32, attention layers) on a single A100 is the recommended approach for most teams. OpenVLA-OFT replaces autoregressive decoding with parallel prediction, 256-bin discretization with continuous L1 regression, and single-step prediction with 5-step action chunking.",
  claruIntegration: "Claru delivers OpenVLA-ready datasets in RLDS format with 224x224 RGB observations, human-written natural language instructions (varied across demonstrations for each task), and correctly normalized 7-DoF action vectors. We handle workspace-region cropping, per-dimension normalization statistics, and RLDS schema validation. For OpenVLA-OFT users, we also provide continuous action labels for L1 regression. Typical delivery: 500-5,000 demonstrations across 5-20 tasks, with held-out validation splits, data loading verification scripts, and camera configuration documentation to minimize visual domain shift between collection and deployment.",
  keyPapers: [
    { id: "kim-openvla-2024", title: "OpenVLA: An Open-Source Vision-Language-Action Model", authors: "Kim, M. J., Pertsch, K., Karamcheti, S., et al.", venue: "CoRL 2024 / arXiv 2406.09246", year: 2024, url: "https://arxiv.org/abs/2406.09246" },
    { id: "kim-openvla-oft-2025", title: "Fine-Tuning Vision-Language-Action Models: Optimizing Speed and Success", authors: "Kim, M. J., Pertsch, K., Karamcheti, S., et al.", venue: "arXiv 2502.19645", year: 2025, url: "https://arxiv.org/abs/2502.19645" },
    { id: "karamcheti-prismatic-2024", title: "Prismatic VLMs: Investigating the Design Space of Visually-Conditioned Language Models", authors: "Karamcheti, S., et al.", venue: "ICML 2024 / arXiv 2402.07865", year: 2024, url: "https://arxiv.org/abs/2402.07865" },
    { id: "oneill-oxe-2024", title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models", authors: "Open X-Embodiment Collaboration", venue: "ICRA 2024 / arXiv 2310.08864", year: 2024, url: "https://arxiv.org/abs/2310.08864" },
    { id: "brohan-rt2-2023", title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", authors: "Brohan, A., et al.", venue: "CoRL 2023 / arXiv 2307.15818", year: 2023, url: "https://arxiv.org/abs/2307.15818" },
    { id: "team-octo-2024", title: "Octo: An Open-Source Generalist Robot Policy", authors: "Octo Model Team", venue: "RSS 2024 / arXiv 2405.12213", year: 2024, url: "https://arxiv.org/abs/2405.12213" },
  ],
};

export default data;
