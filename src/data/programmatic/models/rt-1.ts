import type { ModelPageData } from "../types";

const data: ModelPageData = {
  slug: "rt-1",
  metaTitle: "Training Data for RT-1 | Data Requirements & Formats | Claru",
  metaDescription:
    "Complete guide to RT-1 training data: Google's 130K-demonstration Robotics Transformer, EfficientNet-FiLM-TokenLearner architecture, 744 tasks, and how Claru delivers RT-1-ready datasets.",
  primaryKeyword: "rt-1 training data",
  secondaryKeywords: [
    "rt-1 data requirements",
    "rt-1 dataset format",
    "robotics transformer training data",
    "rt-1 fine-tuning data",
    "google robotics transformer data",
    "rt-1 action labels",
  ],
  canonicalPath: "/models/rt-1",
  h1: "Training Data for RT-1",
  heroSubtitle:
    "A comprehensive breakdown of RT-1's architecture, its landmark 130,000-demonstration dataset collected across 744 tasks over 17 months, the specific observation and action formats it requires, and how Claru delivers RT-1-compatible datasets for research and production deployment.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Models", href: "/models" },
    { label: "RT-1", href: "/models/rt-1" },
  ],

  // ---------------------------------------------------------------------------
  // Sections
  // ---------------------------------------------------------------------------
  sections: [
    // 1. What Is RT-1?
    {
      type: "prose",
      heading: "What Is RT-1?",
      paragraphs: [
        "RT-1 (Robotics Transformer 1) is a large-scale robot learning model developed by Google's Everyday Robots team, published by Anthony Brohan, Noah Brown, Justice Carbajal, and over 45 co-authors in December 2022 (arXiv 2212.06817, presented at RSS 2023). RT-1 demonstrated for the first time that a single Transformer-based policy trained on a massive real-world dataset could perform over 700 instructions at a 97% success rate, while generalizing to novel tasks, distractors, and backgrounds significantly better than prior approaches.",
        "The central contribution was not a novel architecture but a proof of scale: by collecting 130,000 teleoperated demonstrations across 744 distinct tasks over 17 months using a fleet of 13 Everyday Robots mobile manipulators, the team showed that real-world robot data at sufficient scale and diversity produces policies that generalize robustly. This was a paradigm-defining result -- prior work had been limited to hundreds or low thousands of demonstrations and a handful of tasks, with correspondingly narrow generalization.",
        "RT-1's task repertoire covered a wide range of everyday manipulation behaviors: picking objects of various sizes and shapes, placing them in specific locations, opening and closing drawers, moving objects near other objects, upright placement, and basic navigation. The language-conditioned interface allowed operators to command the robot with natural language instructions like 'pick up the red can' or 'move the green chip bag near the orange,' and the model learned to ground these instructions in the visual scene and execute appropriate motor commands.",
        "RT-1's impact extends well beyond its own results. It established the data format and collection methodology that became the foundation for the Open X-Embodiment project, which aggregated robot datasets from 22 institutions. RT-1's successor, RT-2, demonstrated that pre-trained vision-language models could be fine-tuned for robot control, and the RT-1 data format (later standardized as RLDS) became the de facto standard for robot learning datasets. Understanding RT-1's data requirements is therefore essential for anyone working with modern robot learning systems.",
      ],
    },

    // 2. Key stats
    {
      type: "stats",
      heading: "RT-1 at a Glance",
      stats: [
        { value: "130K", label: "Real-world demonstrations" },
        { value: "744", label: "Distinct task instructions" },
        { value: "17 mo", label: "Data collection duration" },
        { value: "13", label: "Everyday Robot units in fleet" },
        { value: "97%", label: "Success rate on trained tasks" },
        { value: "35M", label: "Model parameters" },
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
            "300x300 RGB images from a single head-mounted camera, 6 images of history (current + 5 previous frames)",
        },
        {
          Parameter: "Action Format",
          Specification:
            "7-DoF end-effector delta (x, y, z position + roll, pitch, yaw rotation + gripper open/close), discretized into 256 bins per dimension",
        },
        {
          Parameter: "Base Movement",
          Specification:
            "3 additional action dimensions for mobile base (x velocity, y velocity, yaw rate), also discretized into 256 bins",
        },
        {
          Parameter: "Language Conditioning",
          Specification:
            "Natural language instructions encoded via Universal Sentence Encoder (USE), injected into the vision backbone via FiLM conditioning layers",
        },
        {
          Parameter: "Control Frequency",
          Specification:
            "3 Hz (one action inference every 333ms)",
        },
        {
          Parameter: "Terminate Action",
          Specification:
            "Binary 'episode termination' token indicating task completion, trained jointly with motor actions",
        },
      ],
    },

    // 4. Architecture & Key Innovations
    {
      type: "prose",
      heading: "Architecture and Key Innovations",
      paragraphs: [
        "RT-1's architecture is a carefully engineered pipeline of three components: a FiLM-conditioned EfficientNet-B3 image encoder, a TokenLearner compression module, and a Transformer decoder. The total model size is only 35 million parameters -- remarkably small compared to subsequent VLA models like RT-2 (55B) or OpenVLA (7B) -- yet it achieves strong performance because the architecture was specifically optimized for real-time robot control at 3 Hz inference.",
        "The image encoder is an EfficientNet-B3 backbone (26 MBConv blocks, 16M parameters) conditioned on language via Feature-wise Linear Modulation (FiLM). The natural language instruction is first encoded into a 512-dimensional embedding using Google's Universal Sentence Encoder, and this embedding is injected into each convolutional block of the EfficientNet via learned affine transformations. This produces 81 vision-language tokens per frame that capture both visual scene understanding and language-conditioned attention -- the model literally attends to different parts of the image depending on the instruction.",
        "The TokenLearner module compresses these 81 tokens down to just 8 tokens per frame. This aggressive compression is essential for real-time operation: with 6 frames of image history, the uncompressed token sequence would be 486 tokens, but TokenLearner reduces this to 48 tokens that capture the most informative spatial features. These 48 tokens (with positional encoding) are fed into a decoder-only Transformer backbone that predicts discretized action tokens.",
        "The action space discretization is a key design choice. Rather than predicting continuous action values, RT-1 discretizes each action dimension into 256 bins and treats action prediction as a classification problem. This avoids the mode-averaging problem that plagues continuous regression in multi-modal action distributions -- when there are multiple valid ways to grasp an object, regression averages them into an invalid action, while classification can represent each mode as a separate bin. The 7-DoF arm actions plus 3-DoF base actions plus 1 termination token yield 11 classification heads, each producing a softmax over 256 bins.",
      ],
    },

    // 5. Comparison table
    {
      type: "comparison-table",
      heading: "RT-1 vs Successor and Related Models",
      description:
        "How RT-1 compares to models it directly influenced.",
      columns: ["Dimension", "RT-1", "RT-2", "OpenVLA", "Octo"],
      rows: [
        {
          Dimension: "Architecture",
          "RT-1": "EfficientNet + TokenLearner + Transformer (35M)",
          "RT-2": "PaLI-X VLM with action tokens (55B)",
          OpenVLA: "Prismatic VLM + Llama 2 (7B)",
          Octo: "Custom transformer + diffusion head (93M)",
        },
        {
          Dimension: "Training data",
          "RT-1": "130K real-world demos (single embodiment)",
          "RT-2": "RT-1 data + web-scale VLM pretraining",
          OpenVLA: "970K demos (Open X-Embodiment, 22 embodiments)",
          Octo: "800K demos (Open X-Embodiment subset)",
        },
        {
          Dimension: "Tasks",
          "RT-1": "744 (all real-world)",
          "RT-2": "RT-1 tasks + emergent web-knowledge tasks",
          OpenVLA: "Varies by fine-tuning target",
          Octo: "Varies by fine-tuning target",
        },
        {
          Dimension: "Action space",
          "RT-1": "Discretized (256 bins per DoF)",
          "RT-2": "Discretized (256 bins, same as RT-1)",
          OpenVLA: "Discretized (256 bins per DoF)",
          Octo: "Continuous (diffusion action head)",
        },
        {
          Dimension: "Control frequency",
          "RT-1": "3 Hz",
          "RT-2": "1-3 Hz (larger model is slower)",
          OpenVLA: "5 Hz (with action chunking)",
          Octo: "Variable (embodiment-dependent)",
        },
        {
          Dimension: "Open source",
          "RT-1": "No (data format is public via RLDS)",
          "RT-2": "No",
          OpenVLA: "Yes (weights + training code)",
          Octo: "Yes (weights + training code)",
        },
      ],
    },

    // 6. Training Data Requirements
    {
      type: "prose",
      heading: "Training Data Requirements",
      paragraphs: [
        "RT-1's training dataset is one of the most extensively documented robot learning datasets in the literature. The 130,000 demonstrations were collected over 17 months using 13 Everyday Robots mobile manipulators operating in office kitchen environments. Each demonstration was collected via teleoperation, with a human operator controlling the robot arm and base using a remote interface. The demonstrations span 744 distinct task instructions, averaging approximately 175 demonstrations per task, though the distribution is long-tailed -- common tasks like 'pick up the Coke can' have 500+ demonstrations while rare tasks may have as few as 50.",
        "Each demonstration consists of: (1) A sequence of 300x300 RGB images from the robot's head-mounted camera at 3 Hz. (2) The corresponding 7-DoF end-effector delta actions (position + orientation + gripper), also at 3 Hz. (3) 3-DoF base velocity commands for the mobile base. (4) A natural language instruction string describing the task. (5) An episode termination signal indicating when the human operator judged the task complete. Typical episodes last 10-30 seconds (30-90 timesteps at 3 Hz).",
        "A critical lesson from RT-1 is that task diversity matters more than per-task volume. The paper's ablation studies showed that training on 744 tasks with moderate demonstrations per task produced substantially better generalization than training on fewer tasks with more demonstrations each. Specifically, the model generalized 25% better to novel tasks, 36% better to novel distractors, and 18% better to novel backgrounds compared to the next best baseline. This finding has shaped all subsequent data collection strategies in the field.",
        "The data collection methodology itself was a significant engineering achievement. The 13-robot fleet operated in parallel across multiple kitchen environments, with human operators working in shifts. Quality control included automatic filtering of demonstrations where the robot collided with objects, the task instruction was ambiguous, or the final state did not match the task specification. The team estimated that approximately 20% of raw demonstration attempts were discarded during quality control, meaning the effective collection effort was roughly 160,000 attempts to yield 130,000 clean demonstrations.",
        "For teams replicating RT-1's data format, the key specifications are: 300x300 RGB images (center-cropped from the camera's native resolution), 3 Hz recording frequency, 256-bin discretization for each action dimension with per-dimension normalization to the robot's workspace bounds, and Universal Sentence Encoder embeddings for the language instructions. The data is stored in RLDS format (TFRecord files with standardized episode structure), which has become the community standard for robot learning datasets.",
      ],
    },

    // 7. How Claru Data Integrates
    {
      type: "prose",
      heading: "How Claru Data Integrates with RT-1",
      paragraphs: [
        "Claru delivers datasets in the exact format RT-1 and its derivatives (RT-2, RT-X, OpenVLA) consume. Our data pipeline outputs RLDS-formatted TFRecord files with 300x300 RGB observations, discretized 7-DoF action labels (256 bins per dimension with workspace-normalized bounds), natural language task instructions, and episode termination signals. For teams using RT-1-derived architectures, our data can be mixed directly into the training pipeline without format conversion.",
        "While the RT-1 model weights are not publicly available, its data format lives on as the backbone of the Open X-Embodiment ecosystem. Claru provides RT-1-compatible data that is interoperable with OpenVLA, Octo, RT-2-X, and any model trained on RLDS-format datasets. This means data collected for RT-1 compatibility automatically works with the most widely used open-source robot learning models.",
        "Claru's primary value-add for RT-1-style training is task diversity at scale. RT-1's key insight -- that 744 tasks with moderate per-task demonstrations outperforms deep coverage of few tasks -- requires a data collection operation that can efficiently parallelize across many tasks. Our distributed collection network, spanning 100+ cities with trained operators on multiple robot platforms, can deliver the breadth of task coverage that RT-1-style training demands. We can collect 50-200 demonstrations each for dozens of manipulation tasks simultaneously, rather than the serial approach of exhaustively collecting one task at a time.",
        "For teams extending RT-1 to new robot platforms, Claru handles the action space mapping. We record raw end-effector poses and joint states, then discretize and normalize to the target action space specification. We provide complete calibration metadata including camera intrinsics, workspace bounds (used for action normalization), and robot URDF, enabling reproducible training and deployment.",
      ],
    },

    // 8. References
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "brohan-rt1-2022",
          title:
            "RT-1: Robotics Transformer for Real-World Control at Scale",
          authors: "Brohan, Brown, Carbajal et al.",
          venue: "RSS 2023 / arXiv 2212.06817",
          year: 2022,
          url: "https://arxiv.org/abs/2212.06817",
        },
        {
          id: "brohan-rt2-2023",
          title:
            "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
          authors: "Brohan et al.",
          venue: "CoRL 2023 / arXiv 2307.15818",
          year: 2023,
          url: "https://arxiv.org/abs/2307.15818",
        },
        {
          id: "oneill-oxe-2024",
          title:
            "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
          authors: "O'Neill et al.",
          venue: "ICRA 2024 / arXiv 2310.08864",
          year: 2024,
          url: "https://arxiv.org/abs/2310.08864",
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
          id: "ryoo-tokenlerner-2021",
          title:
            "TokenLearner: What Can 8 Learned Tokens Do for Images and Videos?",
          authors: "Ryoo, Piergiovanni, Arnab, Dehghani, Anandkumar",
          venue: "NeurIPS 2021 / arXiv 2106.11297",
          year: 2021,
          url: "https://arxiv.org/abs/2106.11297",
        },
        {
          id: "tan-efficientnet-2019",
          title:
            "EfficientNet: Rethinking Model Scaling for Convolutional Neural Networks",
          authors: "Tan & Le",
          venue: "ICML 2019 / arXiv 1905.11946",
          year: 2019,
          url: "https://arxiv.org/abs/1905.11946",
        },
      ],
    },
  ],

  // ---------------------------------------------------------------------------
  // FAQs
  // ---------------------------------------------------------------------------
  faqs: [
    {
      question: "Is RT-1 open-source, and can I use its data format?",
      answer:
        "The RT-1 model weights are not publicly released. However, the architecture is fully documented in the paper, and the data format has been standardized as RLDS (Reinforcement Learning Datasets Specification), which is the format used by the Open X-Embodiment project. Open-source models like OpenVLA and Octo accept RLDS-format data and follow RT-1-inspired architectures. Claru delivers data in RLDS format, making it compatible with all of these models.",
    },
    {
      question:
        "How does RT-1's 130K dataset compare to modern data requirements?",
      answer:
        "RT-1's 130K demonstrations was groundbreaking in 2022 but is now considered moderate scale. OpenVLA trains on 970K demonstrations across 22 embodiments, and proprietary systems like pi-zero use even larger datasets. However, RT-1's key lesson still holds: task diversity (744 tasks) matters as much or more than total volume. A dataset of 50K demonstrations across 500 diverse tasks will likely outperform 200K demonstrations across 50 tasks for generalization.",
    },
    {
      question: "Why does RT-1 use discretized actions instead of continuous?",
      answer:
        "Discretized actions (256 bins per dimension) solve the mode-averaging problem in multi-modal action distributions. When there are multiple valid ways to grasp an object, continuous regression averages them into an invalid intermediate action. Discretization treats each dimension as a classification problem, allowing the model to represent multiple action modes. This design choice was adopted by RT-2 and OpenVLA. The 256-bin resolution provides approximately 1mm position accuracy within typical robot workspaces.",
    },
    {
      question:
        "What are the key lessons from RT-1 for my own data collection?",
      answer:
        "Three principles from RT-1 have been validated by all subsequent work: (1) Real-world data at scale outperforms simulation transfer -- the 130K real-world demonstrations beat sim-to-real baselines on every metric. (2) Task diversity drives generalization more than per-task volume -- 744 tasks with ~175 demos each beat fewer tasks with more demos. (3) Consistent data quality is essential -- the team discarded ~20% of collection attempts during QA, maintaining a strict 'successful completion only' policy.",
    },
    {
      question:
        "Can I fine-tune RT-1-style models on data from a different robot?",
      answer:
        "Yes, but you need to match the data format. RT-1 expects 300x300 RGB images, 7-DoF end-effector deltas discretized into 256 bins, and USE-encoded language instructions. If your robot has a different action space (e.g., joint-space control), you need to convert to end-effector deltas. Claru handles this conversion as part of our delivery pipeline -- we record raw joint and end-effector data and convert to the target action format with proper workspace normalization.",
    },
  ],

  // ---------------------------------------------------------------------------
  // CTA
  // ---------------------------------------------------------------------------
  ctaHeading: "Get RT-1-Compatible Training Data",
  ctaDescription:
    "Tell us about your robot platform and target tasks. Claru delivers RLDS-formatted datasets with RT-1-compatible observations, discretized action labels, and language instructions -- ready for training RT-1, RT-2, OpenVLA, Octo, or any RLDS-compatible model.",

  // ---------------------------------------------------------------------------
  // Cross-links
  // ---------------------------------------------------------------------------
  relatedGlossaryTerms: [
    "vla",
    "foundation-model-robotics",
    "behavioral-cloning",
    "rlds",
    "open-x-embodiment",
  ],
  relatedGuidePages: [
    "how-to-collect-teleoperation-data",
    "how-to-create-action-labels-for-vla",
    "how-to-convert-data-to-rlds-format",
  ],
  relatedSolutionSlugs: ["vla-training-data"],

  // ---------------------------------------------------------------------------
  // Model metadata
  // ---------------------------------------------------------------------------
  modelName: "RT-1",
  organization: "Google (Everyday Robots)",
  year: 2022,

  inputSpec: {
    observationFormat:
      "300x300 RGB images (single head-mounted camera), 6-frame history (current + 5 previous)",
    actionFormat:
      "7-DoF end-effector delta (position + orientation + gripper) + 3-DoF base velocity, discretized into 256 bins per dimension",
    languageConditioning:
      "Natural language instructions encoded via Universal Sentence Encoder (USE), injected via FiLM conditioning",
    controlFrequency: "3 Hz",
  },

  dataVolumeBenchmarks:
    "RT-1's training dataset consists of 130,000 teleoperated demonstrations collected over 17 months using a fleet of 13 Everyday Robots mobile manipulators. The demonstrations span 744 distinct task instructions, averaging approximately 175 demonstrations per task, though the distribution is long-tailed (common tasks have 500+ demonstrations, rare tasks have as few as 50). Each demonstration comprises 300x300 RGB images at 3 Hz, 7-DoF discretized end-effector deltas, 3-DoF base velocity commands, a natural language instruction, and episode termination signals. Typical episodes last 10-30 seconds (30-90 timesteps). The team discarded approximately 20% of raw collection attempts during quality control, meaning the effective effort was roughly 160,000 attempts. On trained tasks, the model achieved 97% success. On novel tasks, novel distractors, and novel backgrounds, RT-1 generalized 25%, 36%, and 18% better than the next best baseline respectively. The critical finding was that task diversity (744 tasks) drove generalization more than per-task volume -- this result has shaped every major data collection effort since, including Open X-Embodiment.",

  trainingRecipe:
    "RT-1 uses a three-component architecture totaling 35M parameters. The image encoder is an EfficientNet-B3 (26 MBConv blocks, 16M parameters) conditioned on language via Feature-wise Linear Modulation (FiLM): the language instruction is encoded by the Universal Sentence Encoder into a 512-dim embedding, which modulates each convolutional block via learned affine transformations. This produces 81 vision-language tokens per frame. TokenLearner then compresses these to 8 tokens per frame, and with 6 frames of history the Transformer receives 48 tokens total. The decoder-only Transformer predicts discretized actions as classification over 256 bins for each of the 11 action dimensions (7 arm DoF + 3 base DoF + 1 termination). Training uses cross-entropy loss on the discretized action targets. The model trains on 130K demonstrations in RLDS format using TPU pods. Despite its small size (35M parameters), RT-1 achieves strong real-time performance at 3 Hz, making it practical for closed-loop deployment on physical robots.",

  claruIntegration:
    "Claru delivers RT-1-compatible datasets in RLDS format with 300x300 RGB observations, 256-bin discretized 7-DoF action labels, USE-encoded language instructions, and episode termination signals. Our data pipeline handles workspace-normalized action discretization, camera calibration, and the specific frame history format RT-1 expects. Since RT-1's data format is the foundation for the Open X-Embodiment ecosystem, Claru data also works directly with OpenVLA, Octo, RT-2-X, and any RLDS-compatible model. Our primary value-add is task diversity at scale: we can collect 50-200 demonstrations each across dozens of manipulation tasks simultaneously through our distributed network, matching RT-1's finding that breadth of task coverage drives generalization more than depth.",

  keyPapers: [
    {
      id: "brohan-rt1-2022",
      title:
        "RT-1: Robotics Transformer for Real-World Control at Scale",
      authors: "Brohan, Brown, Carbajal et al.",
      venue: "RSS 2023 / arXiv 2212.06817",
      year: 2022,
      url: "https://arxiv.org/abs/2212.06817",
    },
    {
      id: "brohan-rt2-2023",
      title:
        "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan et al.",
      venue: "CoRL 2023 / arXiv 2307.15818",
      year: 2023,
      url: "https://arxiv.org/abs/2307.15818",
    },
    {
      id: "oneill-oxe-2024",
      title:
        "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "O'Neill et al.",
      venue: "ICRA 2024 / arXiv 2310.08864",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864",
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
      id: "ryoo-tokenlerner-2021",
      title:
        "TokenLearner: What Can 8 Learned Tokens Do for Images and Videos?",
      authors: "Ryoo, Piergiovanni, Arnab, Dehghani, Anandkumar",
      venue: "NeurIPS 2021 / arXiv 2106.11297",
      year: 2021,
      url: "https://arxiv.org/abs/2106.11297",
    },
    {
      id: "tan-efficientnet-2019",
      title:
        "EfficientNet: Rethinking Model Scaling for Convolutional Neural Networks",
      authors: "Tan & Le",
      venue: "ICML 2019 / arXiv 1905.11946",
      year: 2019,
      url: "https://arxiv.org/abs/1905.11946",
    },
  ],
};

export default data;
