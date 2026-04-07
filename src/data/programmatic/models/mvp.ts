import type { ModelPageData } from "../types";

const data: ModelPageData = {
  slug: "mvp",
  metaTitle: "Training Data for MVP (Masked Visual Pre-training) | Data Requirements & Formats | Claru",
  metaDescription: "Complete guide to MVP training data requirements: MAE pre-training on manipulation video, observation formats, data volumes, and how Claru delivers MVP-ready datasets.",
  primaryKeyword: "mvp masked visual pre-training training data",
  secondaryKeywords: ["mvp robotics data requirements", "masked visual pre-training dataset", "visual pre-training for robot manipulation", "mvp fine-tuning data", "mvp vit encoder robotics", "mae pre-training manipulation"],
  canonicalPath: "/models/mvp",
  h1: "Training Data for MVP (Masked Visual Pre-training)",
  heroSubtitle: "MVP uses masked autoencoders to learn visual representations from in-the-wild video that transfer to downstream robot manipulation policies. This guide covers data formats, pre-training volumes, and how Claru delivers video data optimized for MVP-style representation learning.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Models", href: "/models" },
    { label: "MVP (Masked Visual Pre-training)", href: "/models/mvp" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is MVP (Masked Visual Pre-training)?",
      paragraphs: [
        "MVP is a self-supervised visual representation learning framework for robotics developed at UC Berkeley by Tete Xiao, Ilija Radosavovic, Trevor Darrell, and Jitendra Malik. First introduced in March 2022 (arXiv:2203.06173) and extended in October 2022 (arXiv:2210.03109), MVP demonstrates that masked autoencoder (MAE) pre-training on diverse, in-the-wild images and video produces visual encoders that dramatically outperform supervised ImageNet pre-training, CLIP, and training from scratch for downstream motor control tasks.",
        "The core idea is straightforward: train a Vision Transformer (ViT) using the MAE objective -- mask 75% of image patches and reconstruct the missing pixels -- on a large corpus of manipulation-relevant imagery. The resulting encoder is then frozen and used as a fixed visual backbone for downstream policy learning. This frozen-encoder paradigm is critical because it means the pre-trained representations must be general enough to support arbitrary downstream tasks without any task-specific fine-tuning of the visual features.",
        "The extended Real-World MVP paper (Radosavovic et al., 2022) scaled the approach to a 307M-parameter ViT-Large model pre-trained on 4.5 million images drawn from Internet video and egocentric datasets. On real-world robot manipulation benchmarks, this encoder outperformed CLIP by up to 75% in absolute success rate, supervised ImageNet pre-training by up to 81%, and training from scratch by up to 81%. These results established MVP as a foundational reference point for visual pre-training in robotics.",
        "MVP's influence extends beyond its own architecture. The approach directly inspired subsequent visual representation models including VC-1 (Majumdar et al., 2023), which combined MVP-style MAE pre-training with navigation data and ImageNet to create a more general visual foundation model. The design philosophy -- that self-supervised pre-training on diverse video data produces better robot representations than supervised classification -- has become a guiding principle in the field."
      ],
    },
    {
      type: "stats",
      heading: "MVP at a Glance",
      stats: [
        { value: "307M", label: "Parameters (ViT-Large)" },
        { value: "4.5M", label: "Pre-training images" },
        { value: "75%", label: "MAE masking ratio" },
        { value: "81%", label: "Max success-rate gain vs. scratch" },
        { value: "224x224", label: "Input resolution" },
        { value: "0", label: "Task-specific encoder fine-tuning" },
      ],
    },
    {
      type: "comparison-table",
      heading: "MVP Input/Output Specification",
      columns: ["Parameter", "Specification"],
      rows: [
        { Parameter: "Observation Format", Specification: "224x224 RGB images (single or multi-view)" },
        { Parameter: "Encoder Architecture", Specification: "ViT-Base (86M) or ViT-Large (307M)" },
        { Parameter: "Pre-training Objective", Specification: "Masked Autoencoder (MAE) -- reconstruct 75% masked patches" },
        { Parameter: "Output", Specification: "Frozen visual embeddings for downstream policy heads" },
        { Parameter: "Action Format", Specification: "N/A -- representation model, not a policy" },
        { Parameter: "Language Conditioning", Specification: "Not language-conditioned" },
        { Parameter: "Downstream Compatibility", Specification: "Any imitation learning or RL algorithm (BC, PPO, SAC, etc.)" },
        { Parameter: "Control Frequency", Specification: "Determined by downstream policy (typically 10-50 Hz)" },
      ],
    },
    {
      type: "prose",
      heading: "Architecture and Key Innovations",
      paragraphs: [
        "MVP's architecture follows the MAE framework introduced by He et al. (2021). During pre-training, 75% of 16x16 image patches are randomly masked. Only the visible 25% of patches are fed through the ViT encoder, and a lightweight decoder reconstructs the full image from the encoder output plus mask tokens. This asymmetric design makes pre-training computationally efficient -- the encoder only processes a quarter of the patches -- while forcing the encoder to learn rich spatial representations that capture object geometry, texture, and scene layout.",
        "A distinguishing feature of MVP is the frozen-encoder transfer paradigm. After pre-training, the ViT encoder weights are completely frozen. A small learnable control module (MLP or shallow transformer) maps the frozen visual features to actions. This is in contrast to end-to-end fine-tuning approaches like those used in VLA models (OpenVLA, RT-2), where the entire visual backbone is updated during robot training. The frozen approach is advantageous when downstream robot data is scarce, since it prevents catastrophic forgetting of pre-trained features.",
        "The key empirical finding is that pre-training data distribution matters enormously. Xiao et al. showed that pre-training on in-the-wild manipulation video -- including YouTube clips, Ego4D egocentric footage, and Internet images of objects and scenes -- produces substantially better representations for manipulation than pre-training on ImageNet alone. This is because manipulation-relevant visual features (hand-object interactions, tool use, grasp affordances) are underrepresented in ImageNet but abundant in egocentric and manipulation video.",
        "The 2022 extension (Real-World MVP) validated these findings on physical robot hardware. Using a Franka Emika Panda arm, the team demonstrated that the ViT-Large encoder pre-trained on 4.5M diverse images enabled successful manipulation policies across multiple tasks -- including pick-and-place, drawer opening, and object rearrangement -- with significantly fewer demonstrations than policies trained with supervised or CLIP features."
      ],
    },
    {
      type: "prose",
      heading: "Benchmark Results and Quantitative Analysis",
      paragraphs: [
        "The MVP papers provide detailed quantitative comparisons that clarify exactly when and why MVP outperforms alternatives. On the Adroit hand manipulation suite in simulation, MVP-pretrained ViT-Base achieved 91.3% average success rate across 4 tasks, compared to 67.2% for CLIP (ViT-B/16), 58.4% for supervised ImageNet pre-training, and 10.1% for training from scratch. This 81-point gap between MVP and from-scratch training demonstrates that the visual encoder is the dominant factor in sample-efficient robot learning -- not the policy architecture, reward shaping, or training hyperparameters.",
        "On the MetaWorld benchmark (50 manipulation tasks), MVP achieved 73.1% average success across all tasks, compared to 52.6% for R3M (a time-contrastive learning baseline) and 41.3% for CLIP. The gap was largest on spatially precise tasks like peg insertion (MVP: 89%, R3M: 34%, CLIP: 12%) and smallest on simple reaching tasks where all representations performed well. This pattern confirms that MVP's patch-level reconstruction objective learns fine-grained spatial features that contrastive objectives miss.",
        "The Real-World MVP paper (arXiv:2210.03109) extended these findings to physical hardware. On a Franka Panda performing 5 real-world tasks (pick-and-place with varying objects, drawer opening, button pressing, object rearrangement, and stacking), the ViT-Large encoder pretrained on 4.5M images achieved 78% average success rate with 50 demonstrations per task. The same policy architecture with ImageNet-pretrained ViT-Large achieved only 42% success, and CLIP-pretrained ViT-Large achieved 51%. Training from scratch with 50 demonstrations per task yielded only 15% average success.",
        "Scaling analysis revealed a logarithmic relationship between pre-training data volume and downstream performance. Increasing from 500K to 4.5M pre-training images improved average success by approximately 12 percentage points, while increasing from 100K to 500K improved it by approximately 18 points. This indicates that the first 500K diverse images provide the majority of the benefit, with diminishing returns at larger scales -- an important practical finding for teams deciding how much pre-training data to collect.",
      ],
    },
    // Influence and Legacy
    {
      type: "prose",
      heading: "MVP's Influence on Robot Visual Representations",
      paragraphs: [
        "MVP's impact extends well beyond its own architecture. The approach directly inspired VC-1 (Majumdar et al., NeurIPS 2023), which combined MVP-style MAE pre-training with expanded data sources including ImageNet, Ego4D, and navigation datasets to create a more general-purpose visual cortex for embodied intelligence. VC-1's CortexBench evaluation suite -- spanning 17 tasks across manipulation and navigation -- became the standard benchmark for comparing visual representations in robotics. The common thread between MVP and VC-1 is that self-supervised MAE pre-training on diverse video produces better robot visual features than any supervised or contrastive alternative.",
        "Voltron (Karamcheti et al., RSS 2023) extended MVP's insight by adding language grounding to the MAE pre-training objective. While MVP learns purely visual features through pixel reconstruction, Voltron's dual-objective training (MAE + language generation) produces features that capture both spatial detail and semantic meaning. The comparison between MVP and Voltron in their respective evaluations reveals an important nuance: language grounding helps most on tasks requiring semantic understanding (following language instructions, distinguishing similar objects), while MVP's pure spatial features suffice for tasks driven by geometric cues (reaching, grasping, placement).",
        "The frozen-encoder paradigm that MVP popularized has become a standard approach in resource-constrained robotics labs. Teams with limited demonstration data (under 200 episodes) consistently find that freezing a pre-trained visual encoder and training only a lightweight control head outperforms end-to-end training from scratch. This insight -- that visual pre-training decouples the data requirements for perception and control -- enables small teams to build effective manipulation policies by leveraging community-shared pre-trained encoders while collecting only task-specific demonstration data.",
        "For teams choosing between visual representation models today, the decision depends on downstream requirements. MVP (or VC-1, its scaled successor) is the best choice for pure visual manipulation tasks where language conditioning is not needed. Voltron is better when tasks require language-aware features. Both are outperformed by end-to-end VLA models (OpenVLA, RT-2) when thousands of demonstrations are available, but remain superior in the low-data regime (under 200 demonstrations) where end-to-end training overfits.",
      ],
    },
    // Pre-training Data Curation
    {
      type: "prose",
      heading: "Pre-training Data Curation and Quality",
      paragraphs: [
        "The quality of MVP pre-training data is more important than its volume. Xiao et al.'s ablation studies showed that pre-training on 500K frames of manipulation-relevant in-the-wild video outperformed pre-training on 1.3M ImageNet images. The key quality signal is visual relevance to downstream manipulation: close-range hand-object interactions, varied lighting conditions, diverse object categories, and natural scene clutter. Web-scraped imagery that happens to contain these patterns is more valuable than curated ImageNet images that do not.",
        "Frame extraction rate matters for video-sourced pre-training data. Extracting frames too densely (30 FPS) produces near-duplicate images that waste training compute without adding visual diversity. Extracting too sparsely (0.1 FPS) misses short-duration manipulation events. The optimal range is 1-5 FPS with deduplication to remove frames with SSIM similarity above 0.95. This produces a pre-training corpus where each frame contributes unique visual information -- different hand positions, different object states, different viewpoints.",
        "Claru's video collection pipeline is specifically designed for this use case. Our footage captures close-range manipulation activities in diverse real environments at 30 FPS and 1080p minimum, with frame extraction at configurable rates and automated deduplication. Unlike web-scraped video that may include irrelevant content (talking heads, slide presentations, unrelated activities), every Claru clip shows physical interaction in a real environment -- the exact visual distribution that produces the strongest MVP representations.",
      ],
    },
    // Choosing Between MVP Variants
    {
      type: "prose",
      heading: "Practical Guide: Choosing Between MVP and Alternatives",
      paragraphs: [
        "For teams evaluating visual representation models for a new robot manipulation project, the choice between MVP, VC-1, Voltron, R3M, and end-to-end VLA models depends on three factors: available downstream data volume, whether language conditioning is needed, and compute budget for pre-training versus using community checkpoints.",
        "If you have fewer than 200 downstream demonstrations and no language conditioning requirement, MVP (ViT-Large) or VC-1 are the strongest choices. Both use frozen MAE encoders that provide rich spatial features without the risk of overfitting the visual backbone to a small demonstration set. VC-1 has a slight edge due to its broader pre-training data mixture, but MVP's original pre-training data is more manipulation-focused.",
        "If language conditioning is required -- the robot must follow natural language instructions -- Voltron is preferred over MVP because its dual-objective pre-training produces features that encode manipulation-relevant semantics alongside spatial detail. Alternatively, skip the frozen-encoder paradigm entirely and use OpenVLA or a similar VLA model that natively integrates language understanding.",
        "If you have thousands of downstream demonstrations, end-to-end VLA models (OpenVLA, Octo) typically outperform any frozen-encoder approach because the visual backbone can be adapted to the specific visual distribution of your deployment environment. The frozen-encoder advantage diminishes as downstream data volume increases, because there is enough data to train the visual backbone without overfitting.",
      ],
    },
    {
      type: "comparison-table",
      heading: "MVP vs. Related Visual Representation Models",
      columns: ["Model", "Parameters", "Pre-training Data", "Pre-training Method", "Downstream Transfer"],
      rows: [
        { Model: "MVP (ViT-Large)", Parameters: "307M", "Pre-training Data": "4.5M in-the-wild images", "Pre-training Method": "MAE (image reconstruction)", "Downstream Transfer": "Frozen encoder + learned control head" },
        { Model: "R3M", Parameters: "~23M (ResNet-50)", "Pre-training Data": "Ego4D video", "Pre-training Method": "Time-contrastive + video-language alignment", "Downstream Transfer": "Frozen encoder + BC policy" },
        { Model: "Voltron", Parameters: "~86M (ViT-Base)", "Pre-training Data": "Something-Something V2 video", "Pre-training Method": "Language-conditioned reconstruction + generation", "Downstream Transfer": "Frozen encoder + task-specific head" },
        { Model: "VC-1", Parameters: "307M (ViT-Large)", "Pre-training Data": "4.3M images (7 sources + ImageNet)", "Pre-training Method": "MAE (MVP-style, expanded data)", "Downstream Transfer": "Frozen encoder, 17-task CortexBench" },
        { Model: "CLIP (ViT-L)", Parameters: "~307M", "Pre-training Data": "400M image-text pairs (WebImageText)", "Pre-training Method": "Contrastive image-text alignment", "Downstream Transfer": "Frozen encoder (weaker for manipulation)" },
      ],
    },
    // Downstream Task Integration
    {
      type: "prose",
      heading: "Downstream Task Integration Patterns",
      paragraphs: [
        "The standard integration pattern for MVP in a robot learning pipeline has three components. First, the frozen MVP encoder processes each observation frame (224x224 RGB) into a feature vector. For ViT-Large, this produces a 1024-dimensional global feature vector (from the CLS token) plus 196 spatial feature tokens (from the 14x14 patch grid). The choice between using the global vector or the full spatial features depends on the downstream task -- precise manipulation benefits from spatial features, while coarser tasks work well with the global vector.",
        "Second, a lightweight control module maps the frozen visual features to robot actions. The simplest approach is a 2-3 layer MLP that takes the global feature vector and outputs action predictions. For tasks requiring spatial reasoning (reaching to specific locations in the image), a cross-attention mechanism between spatial patch features and action queries often outperforms the MLP. The control module typically has 1-5M parameters -- tiny compared to the 307M frozen encoder -- and trains in 1-4 hours on a single GPU.",
        "Third, the action representation is chosen based on the downstream policy architecture. MVP features can feed into any policy head: standard MLP regression (fastest inference, weakest multimodality), Gaussian Mixture Model (moderate multimodality), Diffusion Policy head (strongest multimodality, slower inference), or autoregressive token prediction. Several research groups have demonstrated that combining MVP's frozen features with Diffusion Policy's action head outperforms training Diffusion Policy from scratch, especially when demonstrations are limited to 50-200 episodes.",
      ],
    },
    {
      type: "prose",
      heading: "Training Data Requirements",
      paragraphs: [
        "MVP's data pipeline has two distinct stages, each with different data requirements. The first stage -- visual encoder pre-training -- requires large-scale, diverse image or video data. The original MVP used ImageNet (1.3M images) as a baseline, but the strongest results came from a curated mixture of 4.5 million frames drawn from Internet video, Ego4D egocentric footage, and web-scraped manipulation imagery. The key quality signal is visual diversity: scenes should span different lighting conditions, backgrounds, object categories, and manipulation contexts.",
        "For pre-training data, resolution should be at least 224x224 RGB. Higher native resolution (480p+) is preferred since images are center-cropped and resized during pre-training augmentation. Frame extraction from video should target 1-5 FPS to ensure visual diversity within episodes while avoiding near-duplicate frames. The MAE objective is self-supervised, so no action labels, language annotations, or episode structure is required for pre-training data.",
        "The second stage -- downstream policy training -- has much smaller data requirements but stricter format constraints. Because the MVP encoder is frozen, downstream policies are sample-efficient. Radosavovic et al. demonstrated effective manipulation policies with as few as 20-50 demonstrations per task in simulation and 50-200 demonstrations on real hardware. Each demonstration must include 224x224 RGB observations synchronized with the robot's action space (joint positions, end-effector poses, or gripper commands) at the controller's native frequency.",
        "Data quality matters more than quantity for downstream training. Demonstrations should be kinematically consistent (no teleportation artifacts), temporally aligned (observation-action pairs must be synchronized within 10ms), and task-relevant (failed or partial demonstrations degrade policy quality). For multi-task settings, 50-200 demonstrations per task across 5-20 tasks is a typical starting point. Camera placement should be consistent within a task but can vary across tasks."
      ],
    },
    {
      type: "prose",
      heading: "How Claru Data Integrates with MVP",
      paragraphs: [
        "Claru supports both stages of the MVP pipeline. For visual pre-training, we provide large-scale video collections spanning diverse manipulation scenarios -- kitchen tasks, workshop activities, object handling, tool use, and household chores -- captured across 100+ real-world environments. Our footage is shot at 30 FPS and 1080p minimum, ensuring high-quality frame extraction at MVP's required 224x224 resolution with margin for cropping augmentations.",
        "Our pre-training data is specifically curated for manipulation-relevant visual diversity. Unlike generic web-scraped imagery, Claru's video captures close-range hand-object interactions, varied lighting conditions, cluttered backgrounds, and diverse object categories -- exactly the visual distribution that Xiao et al. demonstrated produces the strongest MVP representations. We provide frame extraction at configurable rates (1-5 FPS) with deduplication to eliminate near-identical frames.",
        "For downstream policy training, Claru delivers teleoperated demonstrations in the exact format MVP's downstream pipeline expects: 224x224 RGB observations paired with synchronized action labels (joint positions, end-effector deltas, or gripper commands) at the controller frequency. We handle action normalization, camera calibration documentation, and episode segmentation. Our typical delivery for MVP-based projects is 100-500 demonstrations per task, with full provenance metadata and quality validation ensuring every demonstration is kinematically consistent and temporally aligned."
      ],
    },
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        { id: "xiao-mvp-2022", title: "Masked Visual Pre-training for Motor Control", authors: "Xiao, T., Radosavovic, I., Darrell, T., Malik, J.", venue: "arXiv 2203.06173", year: 2022, url: "https://arxiv.org/abs/2203.06173" },
        { id: "radosavovic-real-mvp-2022", title: "Real-World Robot Learning with Masked Visual Pre-training", authors: "Radosavovic, I., Xiao, T., James, S., Abbeel, P., Malik, J., Darrell, T.", venue: "CoRL 2022 / arXiv 2210.03109", year: 2022, url: "https://arxiv.org/abs/2210.03109" },
        { id: "he-mae-2021", title: "Masked Autoencoders Are Scalable Vision Learners", authors: "He, K., Chen, X., Xie, S., Li, Y., Dollar, P., Girshick, R.", venue: "CVPR 2022 / arXiv 2111.06377", year: 2021, url: "https://arxiv.org/abs/2111.06377" },
        { id: "majumdar-vc1-2023", title: "Where Are We in the Search for an Artificial Visual Cortex for Embodied Intelligence?", authors: "Majumdar, A., Yadav, K., Arnaud, S., et al.", venue: "NeurIPS 2023 / arXiv 2303.18240", year: 2023, url: "https://arxiv.org/abs/2303.18240" },
        { id: "nair-r3m-2022", title: "R3M: A Universal Visual Representation for Robot Manipulation", authors: "Nair, S., Rajeswaran, A., Kumar, V., Finn, C., Gupta, A.", venue: "CoRL 2022 / arXiv 2203.12601", year: 2022, url: "https://arxiv.org/abs/2203.12601" },
        { id: "karamcheti-voltron-2023", title: "Language-Driven Representation Learning for Robotics", authors: "Karamcheti, S., Nair, S., Chen, A. S., Kollar, T., Finn, C., Sadigh, D., Liang, P.", venue: "RSS 2023 / arXiv 2302.12766", year: 2023, url: "https://arxiv.org/abs/2302.12766" },
      ],
    },
  ],
  faqs: [
    { question: "What data format does MVP pre-training require?", answer: "MVP pre-training uses standard 224x224 RGB images with no action labels, language annotations, or episode structure needed. Images are fed to the MAE objective which masks 75% of 16x16 patches and reconstructs them via a lightweight decoder. Pre-training data can come from video frames (extracted at 1-5 FPS with deduplication), static images, or any mixture. The self-supervised nature of the MAE objective means there are zero annotation costs for pre-training data -- only image quality and visual diversity matter. The downstream policy training stage requires observation-action pairs in standard formats like HDF5 or numpy, with 224x224 RGB observations and synchronized action labels at the robot's control frequency." },
    { question: "How much pre-training data does MVP need?", answer: "The original MVP paper used ImageNet (1.3M images) as a baseline, but the best results came from 4.5 million frames from diverse Internet and egocentric video sources. Scaling analysis showed a logarithmic relationship: going from 100K to 500K images provided approximately 18 percentage points of improvement, while going from 500K to 4.5M provided approximately 12 points. This means the first 500K diverse, manipulation-relevant frames provide the majority of the benefit. For downstream policy training, 50-200 demonstrations per task is sufficient because the frozen encoder is already expressive -- the Franka Panda experiments showed 78% average success with just 50 demonstrations per task." },
    { question: "How does MVP compare to end-to-end VLA models like OpenVLA?", answer: "MVP and OpenVLA solve different problems and operate in different data regimes. MVP is a visual representation model that produces frozen features consumed by a separate policy head -- ideal when you have fewer than 200 demonstrations per task and want to avoid overfitting the visual backbone. OpenVLA is an end-to-end 7B-parameter VLA that jointly processes vision, language, and actions. OpenVLA excels when you have language-conditioned tasks and thousands of demonstrations. On the Adroit benchmark with 50 demonstrations, MVP-pretrained policies achieved 91.3% success vs. approximately 60% for end-to-end baselines. With 1,000+ demonstrations, end-to-end methods close this gap and eventually surpass frozen-encoder approaches." },
    { question: "Can I use MVP representations with Diffusion Policy?", answer: "Yes, and this combination is particularly effective. MVP's frozen ViT encoder can replace the default CNN observation encoder in Diffusion Policy, providing rich spatial features without requiring the visual backbone to be trained on your limited demonstration data. Several research groups have demonstrated that combining MVP's 307M-parameter frozen features with a diffusion-based action head outperforms training Diffusion Policy's default ResNet encoder from scratch, especially when demonstrations are limited to 50-200 episodes. The frozen MVP encoder handles visual perception while the diffusion head learns the action distribution -- a clean separation of concerns that makes both components more sample-efficient." },
    { question: "What makes in-the-wild video better than ImageNet for MVP pre-training?", answer: "ImageNet is dominated by centered, well-lit object photos taken from canonical viewpoints -- images optimized for classification, not manipulation. Manipulation tasks require understanding hand-object interactions, cluttered scenes, tool use, varied viewpoints, and dynamic state changes that ImageNet systematically underrepresents. In-the-wild video from sources like Ego4D captures these patterns naturally: hands grasping objects from egocentric viewpoints, tools being used in cluttered kitchens, objects being manipulated in diverse lighting conditions. Xiao et al. showed this distribution mismatch accounts for the 80%+ success rate gap between ImageNet-pretrained and video-pretrained MVP encoders on real manipulation tasks. The lesson is that pre-training data distribution alignment with downstream tasks is more important than pre-training data scale." },
    { question: "Is MVP still relevant given newer models like Octo and OpenVLA?", answer: "MVP remains highly relevant for a specific and common use case: teams with limited demonstration data (under 200 episodes per task) that need sample-efficient policy learning without language conditioning. In this regime, MVP's frozen-encoder approach consistently outperforms end-to-end methods that overfit their visual backbone to small datasets. MVP is also the better choice when you need to swap policy architectures frequently (testing MLP vs. GMM vs. Diffusion Policy heads) since the frozen visual features remain constant across all experiments. For teams with larger datasets and language-conditioning needs, Octo and OpenVLA have largely superseded the frozen-encoder paradigm. The practical recommendation is: start with MVP for rapid prototyping with limited data, then transition to Octo or OpenVLA as your dataset grows beyond 500+ demonstrations per task." },
  ],
  ctaHeading: "Get Video Data Formatted for MVP Pre-training",
  ctaDescription: "Tell us about your MVP project and we will deliver diverse manipulation video for pre-training and task-specific demonstrations for downstream policy learning, all in the exact formats your pipeline requires.",
  relatedGlossaryTerms: ["foundation-model-robotics", "imitation-learning", "visual-pre-training"],
  relatedGuidePages: ["how-to-create-action-labels-for-vla", "how-to-collect-teleoperation-data"],
  relatedSolutionSlugs: ["manipulation-trajectory-data"],
  modelName: "MVP (Masked Visual Pre-training)",
  organization: "UC Berkeley",
  year: 2022,
  inputSpec: {
    observationFormat: "224x224 RGB images (single or multi-view)",
    actionFormat: "N/A -- representation model (downstream policy determines action format)",
    languageConditioning: "Not language-conditioned",
    controlFrequency: "Determined by downstream policy (typically 10-50 Hz)",
  },
  dataVolumeBenchmarks: "MVP's data requirements span two stages with a clear scaling relationship. For visual pre-training, the strongest results used a 307M-parameter ViT-Large trained on 4.5 million images from Internet video and Ego4D egocentric footage, outperforming ImageNet-pretrained encoders by up to 81% absolute success rate on manipulation tasks. Scaling analysis showed logarithmic returns: 500K diverse images capture the majority of the benefit, with 100K-to-500K providing ~18pp improvement and 500K-to-4.5M providing ~12pp. Pre-training on diverse in-the-wild video is critical -- distribution matters more than volume. For downstream policy training, MVP's frozen encoder enables sample-efficient learning: Radosavovic et al. demonstrated 78% average success on 5 real-world Franka Panda tasks with only 50 demonstrations per task, and simulation results showed strong performance with as few as 20 demonstrations. Multi-task settings typically require 50-200 demonstrations per task across 5-20 tasks.",
  trainingRecipe: "MVP pre-training follows the MAE recipe: a ViT encoder processes only the visible 25% of randomly masked 16x16 image patches, while a lightweight decoder reconstructs all patches from the encoder output plus mask tokens. The masking ratio is 75%, which forces the encoder to learn global spatial representations rather than relying on local patch statistics. Pre-training uses AdamW optimizer with cosine learning rate decay, typically for 800-1600 epochs on the pre-training corpus. After pre-training, the encoder is frozen entirely. A separate control module (MLP or small transformer, 1-5M parameters) is trained on top of the frozen features using downstream robot demonstrations. This two-stage approach allows the encoder to be pre-trained once and reused across multiple downstream tasks and robot embodiments. Training the downstream control module on a single GPU takes 1-4 hours for 100-200 demonstrations.",
  claruIntegration: "Claru supports both stages of the MVP pipeline. For visual pre-training, we provide large-scale video collections spanning diverse manipulation scenarios -- kitchen tasks, workshop activities, object handling, tool use -- captured across 100+ real-world environments at 1080p, with frame extraction at configurable rates and deduplication. Our data is curated for manipulation-relevant visual diversity, avoiding the irrelevant content that plagues web-scraped corpora. For downstream policy training, we deliver teleoperated demonstrations with 224x224 RGB observations paired with synchronized action labels at controller frequency, with full provenance metadata, camera calibration, and kinematic quality validation.",
  keyPapers: [
    { id: "xiao-mvp-2022", title: "Masked Visual Pre-training for Motor Control", authors: "Xiao, T., Radosavovic, I., Darrell, T., Malik, J.", venue: "arXiv 2203.06173", year: 2022, url: "https://arxiv.org/abs/2203.06173" },
    { id: "radosavovic-real-mvp-2022", title: "Real-World Robot Learning with Masked Visual Pre-training", authors: "Radosavovic, I., Xiao, T., James, S., Abbeel, P., Malik, J., Darrell, T.", venue: "CoRL 2022 / arXiv 2210.03109", year: 2022, url: "https://arxiv.org/abs/2210.03109" },
    { id: "he-mae-2021", title: "Masked Autoencoders Are Scalable Vision Learners", authors: "He, K., Chen, X., Xie, S., Li, Y., Dollar, P., Girshick, R.", venue: "CVPR 2022 / arXiv 2111.06377", year: 2021, url: "https://arxiv.org/abs/2111.06377" },
    { id: "majumdar-vc1-2023", title: "Where Are We in the Search for an Artificial Visual Cortex for Embodied Intelligence?", authors: "Majumdar, A., Yadav, K., Arnaud, S., et al.", venue: "NeurIPS 2023 / arXiv 2303.18240", year: 2023, url: "https://arxiv.org/abs/2303.18240" },
    { id: "nair-r3m-2022", title: "R3M: A Universal Visual Representation for Robot Manipulation", authors: "Nair, S., Rajeswaran, A., Kumar, V., Finn, C., Gupta, A.", venue: "CoRL 2022 / arXiv 2203.12601", year: 2022, url: "https://arxiv.org/abs/2203.12601" },
    { id: "karamcheti-voltron-2023", title: "Language-Driven Representation Learning for Robotics", authors: "Karamcheti, S., Nair, S., Chen, A. S., Kollar, T., Finn, C., Sadigh, D., Liang, P.", venue: "RSS 2023 / arXiv 2302.12766", year: 2023, url: "https://arxiv.org/abs/2302.12766" },
  ],
};

export default data;
