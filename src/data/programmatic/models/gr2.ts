import type { ModelPageData } from "../types";

const data: ModelPageData = {
  slug: "gr2",
  metaTitle: "Training Data for GR-2 | Data Requirements & Formats | Claru",
  metaDescription:
    "Complete guide to GR-2 training data: ByteDance's 3B-parameter video-language-action model, 38M video clip pretraining, and how Claru delivers GR-2-ready datasets.",
  primaryKeyword: "GR-2 training data",
  secondaryKeywords: [
    "GR-2 data requirements",
    "GR-2 dataset format",
    "ByteDance robot model data",
    "GR-2 fine-tuning data",
    "GR-2 video pretraining robot manipulation",
  ],
  canonicalPath: "/models/gr2",
  h1: "Training Data for GR-2",
  heroSubtitle:
    "A comprehensive breakdown of GR-2's generative video-language-action architecture, its 38-million-clip video pretraining pipeline, robot trajectory fine-tuning requirements, and how Claru delivers data for both training stages.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Models", href: "/models" },
    { label: "GR-2", href: "/models/gr2" },
  ],

  // ---------------------------------------------------------------------------
  // Sections
  // ---------------------------------------------------------------------------
  sections: [
    // 1. What Is GR-2?
    {
      type: "prose",
      heading: "What Is GR-2?",
      paragraphs: [
        "GR-2 is a generative video-language-action model for robot manipulation developed by ByteDance Research, published in October 2024 (arXiv 2410.06158). It builds on the foundation laid by GR-1 and represents a significant scaling leap: GR-2 is pretrained on 38 million video clips comprising over 50 billion tokens from internet video data, then fine-tuned on robot trajectories for both video prediction and action generation. The result is a generalist robot agent capable of accomplishing over 100 manipulation tasks with a 97.7% average success rate.",
        "GR-2's core thesis is that learning world dynamics from large-scale internet video provides a powerful inductive bias for robot manipulation. By first training a video generation model that understands physics, object permanence, and cause-effect relationships from passive video observation, and then adapting this model to predict robot actions, GR-2 transfers general world knowledge into a manipulation policy. This two-stage approach (video pretraining followed by robot fine-tuning) avoids the need for hundreds of thousands of robot demonstrations and enables strong generalization to novel objects, backgrounds, and environments.",
        "The model follows a GPT-style autoregressive architecture that operates on tokenized image sequences. Video frames are encoded into discrete tokens via a VQGAN encoder, and the transformer predicts future frame tokens conditioned on the current observation and language instruction. During the robot fine-tuning stage, action tokens are interleaved with video tokens, allowing the model to jointly predict future visual observations and the robot actions that produce them. This joint video-action prediction provides a natural grounding signal that forces the action predictions to be physically consistent with the predicted visual outcomes.",
      ],
    },

    // 2. Key stats
    {
      type: "stats",
      heading: "GR-2 at a Glance",
      stats: [
        { value: "3B", label: "Total model parameters" },
        { value: "38M", label: "Video clips in pretraining corpus" },
        { value: "50B+", label: "Tokens processed during pretraining" },
        { value: "100+", label: "Manipulation tasks learned" },
        { value: "97.7%", label: "Average multi-task success rate" },
        { value: "~5,000", label: "Robot trajectories for fine-tuning" },
      ],
    },

    // 3. Input/output spec
    {
      type: "comparison-table",
      heading: "Input / Output Specification",
      columns: ["Parameter", "Specification"],
      rows: [
        {
          Parameter: "Observation Format",
          Specification:
            "Multi-view RGB video frames, tokenized via VQGAN into discrete tokens",
        },
        {
          Parameter: "Action Format",
          Specification:
            "Continuous end-effector pose deltas (position + orientation) predicted alongside future video tokens",
        },
        {
          Parameter: "Language Conditioning",
          Specification:
            "Natural language task instructions encoded via a text encoder and cross-attended by the transformer",
        },
        {
          Parameter: "Control Frequency",
          Specification: "10 Hz (matching typical teleoperation recording rates)",
        },
        {
          Parameter: "Video Generation",
          Specification:
            "GPT-style autoregressive prediction of future VQGAN tokens, decoded to RGB frames for visualization or planning",
        },
        {
          Parameter: "Pretraining Data",
          Specification:
            "Public datasets including Howto100M, Ego4D, Something-Something V2, EPIC-KITCHENS, Kinetics-700",
        },
      ],
    },

    // 4. Architecture & Key Innovations
    {
      type: "prose",
      heading: "Architecture and Key Innovations",
      paragraphs: [
        "GR-2's architecture is a GPT-style causal transformer that operates over sequences of tokenized video frames and text. RGB frames are first encoded by a VQGAN encoder into a grid of discrete tokens. These video tokens, along with text tokens from the language instruction, are concatenated into a single sequence that the transformer processes autoregressively. The model predicts future frame tokens at each timestep, learning a generative model of visual dynamics conditioned on language.",
        "The key architectural innovation over GR-1 is the massive scale of video pretraining and the integration of action prediction into the autoregressive sequence. During robot fine-tuning, action tokens (representing end-effector pose deltas) are inserted between video frame tokens. The transformer learns to predict both the next frame and the corresponding action, creating a tightly coupled video-action generation model. This design means the model's action predictions are inherently grounded in its visual predictions -- if the model predicts a certain visual future, the actions it generates are consistent with producing that visual outcome.",
        "Another important innovation is GR-2's approach to generalization. By pretraining on 38 million diverse internet video clips spanning cooking, crafting, tool use, and general object manipulation, the model develops a broad understanding of physical interactions before ever seeing robot data. The fine-tuning stage then adapts this general knowledge to specific robot embodiments using a comparatively small dataset of roughly 5,000 robot trajectories (approximately 50 demonstrations per task across 100+ tasks).",
        "GR-2 also demonstrates strong scaling properties: performance improves consistently with model size, pretraining data volume, and fine-tuning data volume. The 3B parameter model represents the current published configuration, but the architecture is designed to scale further. This scaling behavior is a strong indicator that larger models and more data will continue to improve manipulation performance, making GR-2's approach a viable path toward general-purpose robot foundation models.",
      ],
    },

    // 5. Comparison table
    {
      type: "comparison-table",
      heading: "Comparison with Related Models",
      description:
        "How GR-2 compares to alternative generalist robot manipulation approaches.",
      columns: ["Dimension", "GR-2", "GR-1", "RT-2", "Octo"],
      rows: [
        {
          Dimension: "Architecture",
          "GR-2": "GPT-style video-language-action transformer",
          "GR-1": "Video generation transformer",
          "RT-2": "VLM with action tokens",
          Octo: "Transformer with diffusion action head",
        },
        {
          Dimension: "Pretraining data",
          "GR-2": "38M video clips (50B+ tokens)",
          "GR-1": "~5M video clips",
          "RT-2": "Web-scale VLM data",
          Octo: "Open X-Embodiment (800K episodes)",
        },
        {
          Dimension: "Parameters",
          "GR-2": "3B",
          "GR-1": "~300M",
          "RT-2": "55B (PaLI-X)",
          Octo: "93M",
        },
        {
          Dimension: "Fine-tuning demos",
          "GR-2": "~5,000 trajectories (50/task)",
          "GR-1": "~1,000 trajectories",
          "RT-2": "130K robot episodes",
          Octo: "800K cross-embodiment episodes",
        },
        {
          Dimension: "Multi-task success",
          "GR-2": "97.7% (100+ tasks)",
          "GR-1": "94.9% (CALVIN)",
          "RT-2": "~62% (RT-2 eval)",
          Octo: "Varies by embodiment",
        },
      ],
    },

    // 6. Training Data Requirements
    {
      type: "prose",
      heading: "Training Data Requirements",
      paragraphs: [
        "GR-2's training pipeline has two distinct data requirements corresponding to its two training stages. Stage 1 (video pretraining) requires massive-scale video data with text descriptions. The published model used 38 million video clips sourced from public datasets including Howto100M (instructional cooking and DIY videos), Ego4D (egocentric daily activity footage), Something-Something V2 (short object interaction clips), EPIC-KITCHENS (kitchen activity recordings), and Kinetics-700 (diverse human action videos). The total corpus exceeds 50 billion tokens. Each video clip is paired with a text description (either from the original dataset metadata or generated via captioning models).",
        "Stage 2 (robot fine-tuning) requires teleoperated robot manipulation trajectories with paired video frames and action labels. The published evaluation used approximately 5,000 robot trajectories spanning over 100 manipulation tasks, averaging about 50 demonstrations per task. Each trajectory consists of multi-view RGB video frames at 10 Hz and corresponding end-effector pose deltas (6-DoF position and orientation changes). The fine-tuning data also includes the natural language task instruction for each trajectory.",
        "For teams adapting GR-2 to their own tasks, the video pretraining stage can be replicated or a pretrained checkpoint can be used directly. The critical data collection effort is the robot fine-tuning stage. Based on the published results, 50 demonstrations per task is sufficient for strong performance when building on the pretrained video model. For new manipulation tasks not covered by the original training, 30-100 demonstrations per task is a reasonable target. The data should be collected via teleoperation at 10 Hz with calibrated multi-view cameras and precise end-effector pose recording.",
        "Data quality matters significantly for GR-2's fine-tuning stage. Because the model learns from only ~50 demonstrations per task, each trajectory must be a successful, clean execution. Failed demonstrations, partial completions, or noisy recordings will degrade performance more than in large-scale training regimes. Claru's quality-controlled teleoperation pipelines ensure that every delivered trajectory represents a verified successful task completion with smooth, consistent motion profiles.",
      ],
    },

    // 7. How Claru Data Integrates
    {
      type: "prose",
      heading: "How Claru Data Integrates with GR-2",
      paragraphs: [
        "Claru provides data for both stages of GR-2's training pipeline. For the video pretraining stage, Claru's catalog of over 3 million human activity video clips -- including egocentric daily activities, kitchen tasks, workplace operations, and object manipulation -- can supplement or extend the public datasets used in GR-2's original pretraining. Our videos come with verified text descriptions and temporal segmentation, matching the (video, text) pair format GR-2's pretraining expects.",
        "For the robot fine-tuning stage, Claru delivers teleoperated manipulation datasets with multi-view RGB video at 10 Hz, end-effector pose trajectories (6-DoF position + orientation deltas), joint-position recordings, gripper states, and natural language task descriptions. Our data is collected on instrumented robot platforms (Franka Panda, UR5e, xArm) with calibrated multi-camera rigs, providing the multi-view observations that GR-2's architecture leverages. Each trajectory is validated for task success and trajectory smoothness.",
        "A key value-add for GR-2 fine-tuning is Claru's ability to collect diverse task demonstrations at scale. Since GR-2 benefits from covering many tasks with moderate demonstrations per task (~50 each), Claru's distributed collection network can efficiently parallelize data collection across dozens of manipulation tasks simultaneously. We deliver datasets formatted with VQGAN-compatible frame resolutions and the tokenization metadata GR-2's training pipeline requires.",
      ],
    },

    // 8. References
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "cheang-gr2-2024",
          title:
            "GR-2: A Generative Video-Language-Action Model with Web-Scale Knowledge for Robot Manipulation",
          authors: "Cheang et al.",
          venue: "arXiv 2410.06158",
          year: 2024,
          url: "https://arxiv.org/abs/2410.06158",
        },
        {
          id: "wu-gr1-2023",
          title:
            "Unleashing Large-Scale Video Generative Pre-training for Visual Robot Manipulation",
          authors: "Wu et al.",
          venue: "arXiv 2312.13139",
          year: 2023,
          url: "https://arxiv.org/abs/2312.13139",
        },
        {
          id: "brohan-rt2-2023",
          title:
            "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
          authors: "Brohan et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2307.15818",
        },
        {
          id: "esser-vqgan-2021",
          title:
            "Taming Transformers for High-Resolution Image Synthesis",
          authors: "Esser, Rombach, & Ommer",
          venue: "CVPR 2021",
          year: 2021,
          url: "https://arxiv.org/abs/2012.09841",
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
      ],
    },
  ],

  // ---------------------------------------------------------------------------
  // FAQs
  // ---------------------------------------------------------------------------
  faqs: [
    {
      question: "How does GR-2 differ from GR-1?",
      answer:
        "GR-2 is a major scaling upgrade over GR-1. GR-1 was pretrained on roughly 5 million video clips, while GR-2 uses 38 million clips (50 billion+ tokens). GR-2 introduces joint video-action prediction during fine-tuning, where action tokens are interleaved with video frame tokens in the autoregressive sequence. GR-2 also scales to 3B parameters (vs. ~300M for GR-1) and demonstrates 97.7% success across 100+ tasks, compared to GR-1's 94.9% on the CALVIN benchmark.",
    },
    {
      question: "What video data does GR-2 use for pretraining?",
      answer:
        "GR-2 is pretrained on 38 million video clips sourced from public datasets including Howto100M (instructional videos), Ego4D (egocentric daily activities), Something-Something V2 (object interactions), EPIC-KITCHENS (kitchen activities), and Kinetics-700 (diverse human actions). Each clip is paired with a text description. This massive pretraining teaches the model physics, object dynamics, and cause-effect relationships before it ever sees robot data.",
    },
    {
      question: "How many robot demonstrations does GR-2 need for fine-tuning?",
      answer:
        "GR-2 achieves strong multi-task performance with approximately 5,000 robot trajectories spanning 100+ tasks, averaging about 50 demonstrations per task. This is remarkably efficient given the model's generalization capabilities, and is possible because the video pretraining stage provides a strong foundation of world knowledge. For adding new tasks to an existing model, 30-100 demonstrations per task is a practical target.",
    },
    {
      question: "Can I use GR-2 with my own robot platform?",
      answer:
        "GR-2's architecture processes multi-view RGB video and outputs end-effector pose deltas, so it can in principle work with any robot arm that provides RGB camera views and accepts end-effector commands. Fine-tuning on demonstrations collected on your specific platform is required for best performance. The video pretraining weights transfer across embodiments, but the action prediction layer must be adapted to your robot's action space.",
    },
    {
      question: "What data format does Claru deliver for GR-2 fine-tuning?",
      answer:
        "Claru delivers multi-view RGB video at 10 Hz with frame resolutions compatible with GR-2's VQGAN tokenizer, along with 6-DoF end-effector pose deltas, joint-position recordings, gripper states, and natural language task descriptions. Datasets are formatted in HDF5 or RLDS with full metadata including camera calibration, robot URDF, and trajectory-level success labels. We can match the exact tokenization format GR-2's training pipeline expects.",
    },
  ],

  // ---------------------------------------------------------------------------
  // CTA
  // ---------------------------------------------------------------------------
  ctaHeading: "Get GR-2-Ready Training Data",
  ctaDescription:
    "Tell us about your GR-2 project -- target tasks, robot platform, and camera configuration -- and we will deliver video and robot demonstration datasets formatted for both GR-2 pretraining and fine-tuning stages.",

  // ---------------------------------------------------------------------------
  // Cross-links
  // ---------------------------------------------------------------------------
  relatedGlossaryTerms: [
    "vla",
    "foundation-model-robotics",
    "imitation-learning",
    "world-model",
    "video-prediction",
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
  modelName: "GR-2",
  organization: "ByteDance Research",
  year: 2024,

  inputSpec: {
    observationFormat:
      "Multi-view RGB video frames tokenized via VQGAN into discrete tokens",
    actionFormat:
      "Continuous 6-DoF end-effector pose deltas interleaved with video tokens in autoregressive sequence",
    languageConditioning:
      "Natural language task instructions via text encoder with cross-attention",
    controlFrequency: "10 Hz",
  },

  dataVolumeBenchmarks:
    "GR-2's training operates at two vastly different data scales. The video pretraining stage consumes 38 million video clips amounting to over 50 billion tokens, sourced from public internet video datasets including Howto100M, Ego4D, Something-Something V2, EPIC-KITCHENS, and Kinetics-700. This pretraining corpus is orders of magnitude larger than what previous robot learning models used for video understanding. The robot fine-tuning stage is comparatively modest: approximately 5,000 teleoperated manipulation trajectories spanning over 100 tasks, averaging about 50 demonstrations per task. Each trajectory consists of multi-view RGB frames at 10 Hz and 6-DoF end-effector pose deltas. The fine-tuning dataset totals roughly 500,000 to 1,000,000 observation-action pairs. Despite the relatively small fine-tuning set, GR-2 achieves a 97.7% average success rate across its 100+ task repertoire, demonstrating that the video pretraining provides sufficient world knowledge to enable strong performance with limited robot-specific data. This is a roughly 7x improvement in data efficiency over GR-1, which used a similar number of robot demos but with only 5 million pretraining video clips and achieved lower success rates. For teams extending GR-2 to new tasks, the empirical evidence suggests that 30-100 demonstrations per new task is sufficient when building on GR-2's pretrained weights.",

  trainingRecipe:
    "GR-2's training follows a two-stage procedure. Stage 1 is large-scale video generation pretraining: RGB video frames are encoded into discrete tokens using a VQGAN encoder, and a GPT-style causal transformer is trained to autoregressively predict future frame tokens conditioned on text descriptions. This stage processes 38 million video clips (50B+ tokens) and teaches the model to understand visual dynamics, physics, object permanence, and cause-effect relationships. The transformer uses standard next-token prediction loss on the VQGAN token sequences. Stage 2 is robot fine-tuning: the pretrained video model is adapted using approximately 5,000 teleoperated robot trajectories. During this stage, action tokens (representing 6-DoF end-effector pose deltas) are interleaved with video frame tokens in the autoregressive sequence. The model is trained to jointly predict future video frames and the corresponding robot actions, using a combination of video generation loss and action prediction loss. This joint training ensures that action predictions are grounded in the model's visual predictions -- if the model predicts a certain visual outcome, the actions it generates are physically consistent with producing that outcome. Fine-tuning is performed with standard language instruction conditioning, where the text encoder processes the natural language task description and the transformer cross-attends to the resulting text embeddings. The 3B parameter model is trained on multi-GPU clusters. The fine-tuning stage converges relatively quickly compared to pretraining, as the model already possesses strong visual dynamics understanding from Stage 1.",

  claruIntegration:
    "Claru provides data for both stages of GR-2's pipeline. For video pretraining, our catalog of 3M+ human activity video clips (egocentric daily activities, kitchen tasks, object manipulation, workplace operations) supplements the public datasets used in GR-2's original pretraining, with verified text descriptions and temporal segmentation matching GR-2's expected (video, text) pair format. For robot fine-tuning, we deliver teleoperated manipulation trajectories with multi-view RGB video at 10 Hz, 6-DoF end-effector pose deltas, joint-position recordings, gripper states, and natural language task descriptions. Data is collected on calibrated Franka Panda, UR5e, and xArm platforms and delivered in HDF5 or RLDS format with VQGAN-compatible frame resolutions. Our distributed collection network can efficiently parallelize data collection across dozens of manipulation tasks, matching GR-2's many-task training paradigm. Every trajectory is validated for task success and smooth motion quality.",

  keyPapers: [
    {
      id: "cheang-gr2-2024",
      title:
        "GR-2: A Generative Video-Language-Action Model with Web-Scale Knowledge for Robot Manipulation",
      authors: "Cheang et al.",
      venue: "arXiv 2410.06158",
      year: 2024,
      url: "https://arxiv.org/abs/2410.06158",
    },
    {
      id: "wu-gr1-2023",
      title:
        "Unleashing Large-Scale Video Generative Pre-training for Visual Robot Manipulation",
      authors: "Wu et al.",
      venue: "arXiv 2312.13139",
      year: 2023,
      url: "https://arxiv.org/abs/2312.13139",
    },
    {
      id: "brohan-rt2-2023",
      title:
        "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2307.15818",
    },
    {
      id: "esser-vqgan-2021",
      title: "Taming Transformers for High-Resolution Image Synthesis",
      authors: "Esser, Rombach, & Ommer",
      venue: "CVPR 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2012.09841",
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
  ],
};

export default data;
