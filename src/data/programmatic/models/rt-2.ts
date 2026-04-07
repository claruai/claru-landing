import type { ModelPageData } from "../types";

const data: ModelPageData = {
  slug: "rt-2",
  metaTitle: "Training Data for RT-2 | Data Requirements & Formats | Claru",
  metaDescription:
    "Complete guide to RT-2 training data requirements: observation format, action tokenization, data volumes, and how Claru delivers RT-2-ready datasets for VLA research.",
  primaryKeyword: "rt-2 training data",
  secondaryKeywords: [
    "rt-2 data requirements",
    "rt-2 dataset format",
    "data for rt-2",
    "rt-2 fine-tuning data",
    "vision-language-action training data",
    "rt-2 action tokenization",
  ],
  canonicalPath: "/models/rt-2",
  h1: "Training Data for RT-2",
  heroSubtitle:
    "Everything you need to know about RT-2's data requirements — observation formats, action tokenization into 256-bin text tokens, volume benchmarks from 130K real-robot demonstrations, and how Claru delivers RT-2-ready datasets for VLA fine-tuning and evaluation.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Models", href: "/models" },
    { label: "RT-2", href: "/models/rt-2" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is RT-2?",
      paragraphs: [
        "RT-2 (Robotic Transformer 2) is a vision-language-action (VLA) model from Google DeepMind that demonstrated, for the first time, that co-training a large vision-language model on both internet-scale image-text data and robot demonstration data produces emergent robotic capabilities not present in either data source alone. Published in July 2023 by Anthony Brohan and over 50 co-authors, RT-2 showed that a robot could interpret novel commands, reason about unseen objects, and perform multi-step semantic inference -- all without those behaviors being explicitly programmed or demonstrated in robot training data.",
        "The core insight behind RT-2 is treating robot actions as text tokens. Instead of building a separate action prediction head, RT-2 discretizes each of the 7 degrees of freedom in the end-effector action space into 256 bins and represents them as integer strings within the VLM vocabulary. A single output from the model might look like '1 128 91 241 5 101 127', where each number is a bin index for one action dimension. This allows the model to leverage the full reasoning capacity of its language backbone -- PaLI-X at 55 billion parameters or PaLM-E at 12 billion parameters -- to generate actions conditioned on visual observations and natural language instructions.",
        "In evaluation across over 6,000 real-robot trials, RT-2 achieved 62% success on tasks involving previously unseen objects (compared to 32% for RT-1), and could execute semantically complex commands like 'move the apple to the plate that is the same color' or 'pick up the object that could be used as a hammer.' These emergent capabilities arise entirely from web-scale pretraining transfer and were never demonstrated in the robot training data.",
        "RT-2 is not open-source, but its architecture has directly inspired open alternatives including OpenVLA and Octo. Understanding RT-2's data pipeline is essential for any team building VLA systems, as the action tokenization scheme and co-training methodology it established have become standard practice in the field.",
      ],
    },
    {
      type: "stats",
      heading: "RT-2 Key Metrics",
      stats: [
        { value: "55B", label: "Parameters (PaLI-X variant)" },
        { value: "130K", label: "Robot demonstrations" },
        { value: "13", label: "Everyday Robots used" },
        { value: "17 mo", label: "Data collection period" },
        { value: "256", label: "Bins per action dimension" },
        { value: "6,000+", label: "Real-robot evaluation trials" },
      ],
    },
    {
      type: "comparison-table",
      heading: "RT-2 Input/Output Specification",
      columns: ["Parameter", "Specification"],
      rows: [
        {
          Parameter: "Observation Format",
          Specification:
            "320x320 RGB images from a single head-mounted camera on the Everyday Robot",
        },
        {
          Parameter: "Action Format",
          Specification:
            "7-DoF end-effector deltas (x, y, z position + x, y, z rotation + gripper), each discretized into 256 bins and represented as text tokens",
        },
        {
          Parameter: "Language Conditioning",
          Specification:
            "Free-form natural language instructions (e.g., 'pick up the red can')",
        },
        {
          Parameter: "Control Frequency",
          Specification: "3 Hz action prediction rate",
        },
        {
          Parameter: "Action Horizon",
          Specification: "Single-step action prediction per inference call",
        },
        {
          Parameter: "Episode Length",
          Specification: "Typically 20-40 steps (7-13 seconds at 3 Hz)",
        },
      ],
    },
    {
      type: "prose",
      heading: "Architecture and Key Innovations",
      paragraphs: [
        "RT-2 builds on two VLM backbones: PaLI-X (55B parameters) and PaLM-E (12B parameters). Both were originally trained for visual question answering, image captioning, and other vision-language tasks on internet-scale datasets. The RT-2 training procedure co-fine-tunes these backbones on a mixture of their original web data and robot demonstration data, ensuring the model retains its language understanding while acquiring robotic control capabilities.",
        "The action tokenization mechanism is RT-2's most influential contribution. Each action dimension is uniformly discretized into 256 bins spanning the observed data range. The resulting integer tokens are formatted as a string (e.g., '1 128 91 241 5 101 127 217' for 7-DoF plus a terminate/continue flag) and appended to the training corpus alongside standard VQA-style question-answer pairs. At inference time, the model receives a camera image and a language instruction, and autoregressively generates 8 tokens that decode into a physical robot action.",
        "The co-training strategy mixes robot data at roughly a 50/50 ratio with web VLM data during fine-tuning. The authors found this ratio critical: too much robot data degrades the model's language reasoning, while too little fails to ground actions in the physical world. The PaLI-X 55B variant consistently outperformed the 12B PaLM-E variant, suggesting that scale in the language backbone directly translates to better robotic generalization.",
        "A key architectural difference from RT-1 is the elimination of a dedicated robot-specific network. RT-1 used a FiLM-conditioned EfficientNet architecture trained exclusively on robot data. RT-2 instead repurposes the general-purpose VLM, demonstrating that robot control can be treated as a special case of vision-language understanding. This paradigm shift opened the door to VLA architectures now used across the field.",
      ],
    },
    {
      type: "comparison-table",
      heading: "RT-2 vs Related Models",
      columns: ["Dimension", "RT-1", "RT-2 (PaLI-X)", "RT-2 (PaLM-E)", "OpenVLA"],
      rows: [
        {
          Dimension: "Parameters",
          "RT-1": "35M",
          "RT-2 (PaLI-X)": "55B",
          "RT-2 (PaLM-E)": "12B",
          OpenVLA: "7B",
        },
        {
          Dimension: "Robot Training Data",
          "RT-1": "130K demos",
          "RT-2 (PaLI-X)": "130K demos",
          "RT-2 (PaLM-E)": "130K demos",
          OpenVLA: "970K demos (OXE)",
        },
        {
          Dimension: "Web Data Co-Training",
          "RT-1": "None",
          "RT-2 (PaLI-X)": "Yes (VLM data)",
          "RT-2 (PaLM-E)": "Yes (VLM data)",
          OpenVLA: "Yes (Prismatic VLM)",
        },
        {
          Dimension: "Action Representation",
          "RT-1": "Discrete (custom head)",
          "RT-2 (PaLI-X)": "Text tokens (256 bins)",
          "RT-2 (PaLM-E)": "Text tokens (256 bins)",
          OpenVLA: "Text tokens (256 bins)",
        },
        {
          Dimension: "Novel Object Generalization",
          "RT-1": "32%",
          "RT-2 (PaLI-X)": "62%",
          "RT-2 (PaLM-E)": "~50%",
          OpenVLA: "Varies by embodiment",
        },
        {
          Dimension: "Open Source",
          "RT-1": "Yes",
          "RT-2 (PaLI-X)": "No",
          "RT-2 (PaLM-E)": "No",
          OpenVLA: "Yes",
        },
      ],
    },
    {
      type: "prose",
      heading: "Training Data Requirements",
      paragraphs: [
        "RT-2's robot demonstration corpus contains approximately 130,000 episodes collected over 17 months using a fleet of 13 mobile manipulators (Everyday Robots) in a real office kitchen environment. Each episode consists of a sequence of 320x320 RGB image observations paired with 7-DoF end-effector delta actions at 3 Hz. The episodes cover over 700 task descriptions involving tabletop manipulation: picking, placing, moving objects near/on/into other objects, opening and closing drawers, and wiping surfaces.",
        "The web-scale data component is equally important. For the PaLI-X variant, this includes billions of image-text pairs from internet sources used during original VLM pretraining. The co-fine-tuning stage then trains on a roughly equal mixture of robot episodes (formatted as 'instruction, image -> action tokens') and VLM tasks (formatted as 'question, image -> text answer'). This dual data stream is what enables emergent reasoning: the web data teaches the model about objects, spatial relationships, and language semantics, while the robot data teaches it to map these concepts to physical actions.",
        "For teams building RT-2-style systems, the data requirements extend beyond raw demonstration count. Each demonstration needs precise temporal alignment between camera frames and action labels, consistent 256-bin action normalization across the dataset, and diverse language instructions that match the free-form conditioning the model will receive at deployment. The original RT-2 dataset included multiple language templates per task (e.g., 'pick up the can', 'grab the soda can', 'take the red can') to improve instruction following robustness.",
        "Scaling laws from the RT-2 paper suggest that co-training on more robot data improves novel-object generalization roughly logarithmically. Moving from 10K to 130K demonstrations approximately doubled the emergent capability score. For fine-tuning RT-2-style architectures on a new embodiment, the community has found that 10,000-50,000 demonstrations across diverse tasks and environments are needed for strong zero-shot generalization, while 1,000-5,000 demonstrations suffice for single-task specialization.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Data Integrates with RT-2",
      paragraphs: [
        "While RT-2 itself is not publicly released, Claru provides datasets fully compatible with RT-2-style VLA architectures -- including OpenVLA, Octo, and custom PaLI-X fine-tuning pipelines. Our data delivery pipeline produces demonstrations at 320x320 resolution with free-form language instruction annotations and 7-DoF end-effector action labels discretized into the standard 256-bin tokenization scheme that RT-2 established.",
        "Claru's data collection methodology directly addresses the scaling bottleneck that limited the original RT-2 work. Where Google used 13 robots in a single kitchen over 17 months, Claru operates collection campaigns across 100+ cities with diverse home, office, warehouse, and retail environments. This environmental diversity is precisely what RT-2-style models need to generalize beyond the narrow distribution of training environments.",
        "Our quality pipeline enforces the temporal alignment and action normalization standards that RT-2-style training demands. Every episode undergoes automated checks for frame-action synchronization, action range consistency, and language instruction diversity. We deliver in RLDS format -- the standard for VLA training -- with complete metadata including camera intrinsics, robot URDF references, and action normalization statistics that training pipelines can consume directly.",
        "For teams pursuing the co-training paradigm RT-2 pioneered, Claru can also supply the scene-level visual data (without robot actions) needed for representation learning. Our egocentric video corpus covers manipulation scenarios with natural language descriptions, providing the diverse visual grounding data that complements robot demonstrations in the co-training mixture.",
      ],
    },
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
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
          id: "brohan-rt1-2022",
          title:
            "RT-1: Robotics Transformer for Real-World Control at Scale",
          authors: "Brohan et al.",
          venue: "RSS 2023 / arXiv 2212.06817",
          year: 2022,
          url: "https://arxiv.org/abs/2212.06817",
        },
        {
          id: "driess-palme-2023",
          title: "PaLM-E: An Embodied Multimodal Language Model",
          authors: "Driess et al.",
          venue: "ICML 2023 / arXiv 2303.03378",
          year: 2023,
          url: "https://arxiv.org/abs/2303.03378",
        },
        {
          id: "chen-palix-2023",
          title:
            "PaLI-X: On Scaling up a Multilingual Vision and Language Model",
          authors: "Chen et al.",
          venue: "arXiv 2305.18565",
          year: 2023,
          url: "https://arxiv.org/abs/2305.18565",
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
          id: "oneill-oxe-2024",
          title:
            "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
          authors: "O'Neill et al.",
          venue: "ICRA 2024 / arXiv 2310.08864",
          year: 2024,
          url: "https://arxiv.org/abs/2310.08864",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Is RT-2 available for public use?",
      answer:
        "RT-2 is not open-source. Google DeepMind has published the paper and detailed methodology but not released model weights or training code. Open-source alternatives that follow RT-2's VLA architecture include OpenVLA (7B parameters, trained on Open X-Embodiment) and Octo (93M parameters, generalist policy). Claru provides data compatible with all RT-2-style VLA architectures, delivered in RLDS format with 256-bin action tokenization.",
    },
    {
      question: "How does RT-2 differ from RT-1?",
      answer:
        "RT-1 used a 35M-parameter custom FiLM-conditioned EfficientNet trained exclusively on 130K robot demonstrations. RT-2 replaces this with a 55B-parameter PaLI-X (or 12B PaLM-E) vision-language model co-trained on both web data and the same robot demonstrations. The key difference is emergent reasoning: RT-2 can handle novel objects and complex instructions not present in robot training data (62% vs 32% success on unseen objects) because it transfers knowledge from internet-scale pretraining.",
    },
    {
      question:
        "What data volume does RT-2 need for fine-tuning on a new robot?",
      answer:
        "The original RT-2 used 130,000 demonstrations from 13 robots over 17 months. For fine-tuning RT-2-style architectures on a new embodiment, community experience suggests 10,000-50,000 diverse demonstrations for strong zero-shot generalization, or 1,000-5,000 for single-task specialization. The co-training paradigm means the model generalizes from fewer robot demonstrations than RT-1 would need, but data quality -- precise action labeling, diverse language instructions, and varied environments -- matters more than raw volume.",
    },
    {
      question: "What action tokenization format does RT-2 use?",
      answer:
        "RT-2 discretizes each of 7 action dimensions (x/y/z position deltas, x/y/z rotation deltas, and gripper open/close) into 256 uniform bins. The resulting bin indices are formatted as space-separated integers (e.g., '1 128 91 241 5 101 127') plus a terminate/continue token. This representation allows robot actions to be treated identically to natural language tokens in the VLM vocabulary, which is the key innovation enabling web-knowledge transfer.",
    },
    {
      question:
        "Can I use RT-2-style training with different robot hardware?",
      answer:
        "Yes. The action tokenization scheme is hardware-agnostic -- you just need to define the 7-DoF action space boundaries for your robot and discretize into 256 bins. OpenVLA has demonstrated this across 22 different robot embodiments in the Open X-Embodiment dataset. Claru collects data on client-specified hardware and delivers it with the correct action normalization for RT-2-style training pipelines.",
    },
  ],
  ctaHeading: "Get Data Formatted for RT-2-Style VLA Training",
  ctaDescription:
    "Tell us about your VLA project and we will deliver demonstrations with 256-bin action tokenization, language annotations, and RLDS formatting that your RT-2-style training pipeline requires.",
  relatedGlossaryTerms: [
    "vla",
    "foundation-model-robotics",
    "robot-learning",
    "action-tokenization",
  ],
  relatedGuidePages: [
    "how-to-create-action-labels-for-vla",
    "how-to-collect-teleoperation-data",
  ],
  relatedSolutionSlugs: ["vla-training-data"],
  modelName: "RT-2",
  organization: "Google DeepMind",
  year: 2023,
  inputSpec: {
    observationFormat: "320x320 RGB images (single head-mounted camera)",
    actionFormat:
      "7-DoF end-effector deltas + gripper, each discretized into 256 bins and emitted as text tokens",
    languageConditioning: "Free-form natural language instructions",
    controlFrequency: "3 Hz",
  },
  dataVolumeBenchmarks:
    "RT-2 was trained on approximately 130,000 robot demonstration episodes collected over 17 months using 13 Everyday Robots in a real office kitchen. Each episode consists of 320x320 RGB frames paired with 7-DoF actions at 3 Hz, covering 700+ task descriptions. The web-scale component includes billions of image-text pairs from PaLI-X pretraining. Co-fine-tuning mixes robot and web data at roughly a 50/50 ratio. The PaLI-X 55B variant outperformed the 12B PaLM-E variant on novel object generalization (62% vs ~50%), indicating that VLM backbone scale directly improves robotic transfer. For new embodiments, 10,000-50,000 demonstrations across diverse tasks are recommended for strong generalization, with 1,000-5,000 sufficient for single-task fine-tuning.",
  trainingRecipe:
    "RT-2 co-fine-tunes a pretrained VLM backbone (PaLI-X 55B or PaLM-E 12B) on a mixture of web vision-language data and robot demonstration data. Robot actions are tokenized by discretizing each of 7 DoF into 256 uniform bins and formatting the resulting integers as text strings. These action-token sequences are mixed with standard VQA-style pairs during fine-tuning, so the model learns to generate both natural language answers and physical robot actions from the same architecture. Training uses TPU v4 pods. The co-training ratio is critical -- approximately 50/50 web-to-robot data preserves language reasoning while grounding actions. At inference, the model receives a 320x320 image and a language instruction, then autoregressively generates 8 tokens (7 action dimensions + terminate flag) at 3 Hz.",
  claruIntegration:
    "Claru delivers datasets fully compatible with RT-2-style VLA architectures including OpenVLA and Octo. Our pipeline produces demonstrations at 320x320 resolution with free-form language instructions and 7-DoF actions discretized into the standard 256-bin tokenization scheme. Unlike the original RT-2 data from a single kitchen, Claru collects across 100+ cities in diverse environments -- homes, offices, warehouses, retail -- providing the distributional diversity RT-2-style models need to generalize. Every episode undergoes automated quality checks for frame-action synchronization, action range consistency, and language instruction diversity. We deliver in RLDS format with full metadata including camera intrinsics and action normalization statistics.",
  keyPapers: [
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
      id: "brohan-rt1-2022",
      title:
        "RT-1: Robotics Transformer for Real-World Control at Scale",
      authors: "Brohan et al.",
      venue: "RSS 2023 / arXiv 2212.06817",
      year: 2022,
      url: "https://arxiv.org/abs/2212.06817",
    },
    {
      id: "driess-palme-2023",
      title: "PaLM-E: An Embodied Multimodal Language Model",
      authors: "Driess et al.",
      venue: "ICML 2023 / arXiv 2303.03378",
      year: 2023,
      url: "https://arxiv.org/abs/2303.03378",
    },
    {
      id: "chen-palix-2023",
      title:
        "PaLI-X: On Scaling up a Multilingual Vision and Language Model",
      authors: "Chen et al.",
      venue: "arXiv 2305.18565",
      year: 2023,
      url: "https://arxiv.org/abs/2305.18565",
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
      id: "oneill-oxe-2024",
      title:
        "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "O'Neill et al.",
      venue: "ICRA 2024 / arXiv 2310.08864",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864",
    },
  ],
};

export default data;
