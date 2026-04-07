import type { ModelPageData } from "../types";

const data: ModelPageData = {
  slug: "bridgedata-v2-model",
  metaTitle: "Training Data for BridgeData V2 — Formats, Volumes & Integration | Claru",
  metaDescription:
    "Deep-dive into BridgeData V2: 60K+ demonstrations across 24 environments, RLDS format, WidowX 250 data spec, and how Claru extends BridgeData V2 coverage for generalist robot policies.",
  primaryKeyword: "BridgeData V2 training data",
  secondaryKeywords: [
    "BridgeData V2 dataset format",
    "BridgeData V2 RLDS",
    "bridge data robot manipulation",
    "WidowX 250 demonstration data",
    "generalist manipulation dataset",
  ],
  canonicalPath: "/models/bridgedata-v2-model",
  h1: "Training Data for BridgeData V2",
  heroSubtitle:
    "BridgeData V2 is a large-scale robot manipulation dataset of 60,096 demonstrations collected across 24 environments on a WidowX 250 robot arm. It serves as both a pretraining corpus and benchmark for generalist manipulation policies including Octo, RT-X, and CrossFormer. This page covers the dataset's structure, collection methodology, and how Claru provides supplementary demonstrations that expand BridgeData V2's environment and object coverage.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Models", href: "/models" },
    { label: "BridgeData V2", href: "/models/bridgedata-v2-model" },
  ],

  // ── Sections ──────────────────────────────────────────────────────────
  sections: [
    // 1. What Is BridgeData V2?
    {
      type: "prose",
      heading: "What Is BridgeData V2?",
      paragraphs: [
        "BridgeData V2 is a large-scale robot manipulation dataset created by Homer Walke, Kevin Black, and colleagues at UC Berkeley's RAIL lab, published in 2023. It extends the original BridgeData (2022) with significantly more demonstrations, environments, and skill coverage. The dataset contains 60,096 teleoperated demonstrations across 13 manipulation skills (pick-and-place, pushing, stacking, folding, sweeping, etc.) performed in 24 distinct real-world environments (kitchen counters, desks, shelves, toy kitchens).",
        "What makes BridgeData V2 distinctive is its role in the ecosystem. Unlike model-specific datasets collected for a single paper, BridgeData V2 was explicitly designed as a shared pretraining resource for the community. It was one of the founding datasets in the Open X-Embodiment (OXE) project and is the primary pretraining source for Octo, the first open-source generalist robot policy. Nearly every major generalist manipulation policy published since 2023 has either pretrained on or evaluated against BridgeData V2.",
        "The data was collected on a WidowX 250 6-DoF robot arm with a parallel-jaw gripper, controlled via a 3Dconnexion SpaceMouse for teleoperation. Each episode includes an RGB observation from a single third-person camera (256x256 resolution), the end-effector delta action (6-DoF position/rotation delta + 1-DoF gripper), and a natural language instruction describing the task. Episodes average 30-50 timesteps at 5 Hz control frequency.",
        "BridgeData V2 is stored in RLDS (Reinforcement Learning Datasets) format, the TensorFlow-based dataset format adopted by the OXE consortium. Each episode is a tf.data.Dataset of steps, where each step contains observation images, actions, language instructions, and metadata. This format integrates directly with the training pipelines of Octo, RT-X, and other OXE-compatible models.",
      ],
    },

    // 2. Stats
    {
      type: "stats",
      heading: "BridgeData V2 at a Glance",
      stats: [
        { value: "60,096", label: "Total demonstrations" },
        { value: "13", label: "Manipulation skills" },
        { value: "24", label: "Real-world environments" },
        { value: "5 Hz", label: "Control frequency" },
        { value: "256x256", label: "Image resolution (RGB)" },
        { value: "7-DoF", label: "Action space (6 EE delta + gripper)" },
      ],
    },

    // 3. Input/Output Specification
    {
      type: "comparison-table",
      heading: "Input / Output Specification",
      columns: ["Parameter", "Specification"],
      rows: [
        { Parameter: "Primary camera", Specification: "Single third-person RGB at 256x256; some episodes include wrist camera" },
        { Parameter: "Action space", Specification: "7-DoF: 3D EE position delta, 3D rotation delta (axis-angle), 1D gripper binary" },
        { Parameter: "Proprioceptive state", Specification: "7-dim EE pose (position + quaternion) + gripper opening" },
        { Parameter: "Language instruction", Specification: "Natural language string per episode (e.g., 'put the corn in the pot')" },
        { Parameter: "Control frequency", Specification: "5 Hz (200ms between actions)" },
        { Parameter: "Episode length", Specification: "30-50 timesteps typical (6-10 seconds)" },
        { Parameter: "Data format", Specification: "RLDS (TensorFlow Datasets) with Apache Beam pipeline" },
        { Parameter: "Robot platform", Specification: "Trossen WidowX 250 6-DoF with AG-95 parallel-jaw gripper" },
      ],
    },

    // 4. Architecture & Collection Methodology
    {
      type: "prose",
      heading: "Collection Methodology and Dataset Design",
      paragraphs: [
        "BridgeData V2 was collected through a distributed effort across multiple lab spaces and student apartments at UC Berkeley over approximately 18 months. The key design principle was environment diversity over per-task demonstration count. Rather than collecting 10,000 demonstrations of a single pick-and-place task, the team collected 50-500 demonstrations per task-environment combination across many combinations. This encourages policies trained on the data to generalize across environments rather than memorize specific configurations.",
        "Teleoperation used a 3Dconnexion SpaceMouse that maps 6-DoF hand movements to end-effector velocity commands. This is a lower-bandwidth interface than leader-follower teleoperation (as in ALOHA), but it is dramatically cheaper and allows non-roboticists to collect data after minimal training. The trade-off is that demonstrations tend to be slower and less dexterous — BridgeData V2 tasks are primarily tabletop pick-and-place rather than fine-grained bimanual manipulation.",
        "The 13 skill categories were chosen to cover the manipulation primitives most commonly needed in household and kitchen environments: pick and place, push, pull, stack, unstack, open/close containers, fold, sweep, wipe, pour, screw/unscrew, and tool use. Each episode has a language annotation describing the task in natural language, enabling language-conditioned policy learning. These annotations were written by the demonstrators during collection, not post-hoc labeled.",
        "Quality control relied on success labels: each demonstration was marked as successful or failed by the demonstrator. The published dataset includes only successful demonstrations. Failed attempts (approximately 15-20% of all collection attempts) were discarded. No additional annotation or filtering was applied, which means the dataset contains some demonstrations with suboptimal trajectories — the object was placed successfully but the motion was not the smoothest possible path.",
      ],
    },

    // 5. Comparison with Related Datasets
    {
      type: "comparison-table",
      heading: "Comparison with Related Datasets and Models",
      columns: ["Attribute", "BridgeData V2", "RT-1 Dataset", "DROID", "RoboSet"],
      rows: [
        { Attribute: "Total demonstrations", "BridgeData V2": "60K", "RT-1 Dataset": "130K", "DROID": "76K", "RoboSet": "100K+" },
        { Attribute: "Robot platform", "BridgeData V2": "WidowX 250", "RT-1 Dataset": "Everyday Robots", "DROID": "Franka Emika", "RoboSet": "Franka Emika" },
        { Attribute: "Environments", "BridgeData V2": "24 (real homes/labs)", "RT-1 Dataset": "~3 (office kitchens)", "DROID": "22 institutions", "RoboSet": "Lab environments" },
        { Attribute: "Language labels", "BridgeData V2": "Yes (per episode)", "RT-1 Dataset": "Yes", "DROID": "Yes", "RoboSet": "Yes" },
        { Attribute: "Publicly available", "BridgeData V2": "Yes (fully open)", "RT-1 Dataset": "No", "DROID": "Yes", "RoboSet": "Yes" },
        { Attribute: "Data format", "BridgeData V2": "RLDS", "RT-1 Dataset": "Proprietary", "DROID": "RLDS", "RoboSet": "HDF5" },
        { Attribute: "Used for pretraining", "BridgeData V2": "Octo, RT-X, CrossFormer", "RT-1 Dataset": "RT-1, RT-2", "DROID": "DROID policy", "RoboSet": "RoboAgent" },
      ],
    },

    // 6. Training Data Requirements
    {
      type: "prose",
      heading: "Training Data Requirements for BridgeData V2-Compatible Policies",
      paragraphs: [
        "When people talk about training data requirements for BridgeData V2, they typically mean one of two things: how to add your own data to BridgeData V2 for co-training, or how to fine-tune a policy that was pretrained on BridgeData V2. Both have specific format requirements.",
        "For co-training (adding new data to the BridgeData V2 corpus), your data must be in RLDS format with matching observation and action specifications. Observations should be 256x256 RGB images from a similar third-person viewpoint. Actions must be 7-dimensional end-effector deltas in the same coordinate frame convention: xyz position delta in meters, rotation delta as axis-angle in radians, and binary gripper command. Each episode needs a language instruction string. The RLDS conversion requires writing a dataset builder class using TensorFlow Datasets; the OXE project provides templates.",
        "For fine-tuning an Octo model pretrained on BridgeData V2, the requirements are more flexible. Octo's architecture supports variable observation configurations and action dimensions through its task-specific adapter layers. You can fine-tune with as few as 20-50 demonstrations on a new task, provided the task is within the distribution of manipulation behaviors seen during pretraining. For tasks that are far out-of-distribution (e.g., deformable object manipulation, which BridgeData V2 barely covers), you may need 200-500 demonstrations.",
        "Action normalization is critical. BridgeData V2 actions are recorded as small deltas at 5 Hz — typical position deltas are 1-3 centimeters per step, rotation deltas are 0-0.1 radians per step. If your robot operates at a different control frequency, you need to resample actions to match. If your robot uses joint position control instead of EE delta control, you need to convert through forward/inverse kinematics and account for the different action semantics.",
        "Image preprocessing matters more than you might expect. BridgeData V2 images were collected with consumer webcams in natural lighting. If your environment has dramatically different lighting, background clutter, or camera viewpoint, the visual gap can be larger than the task gap. Augmentation (random crops, color jitter) during training helps, but collecting 20-50 demonstrations in your target environment for fine-tuning is usually necessary.",
      ],
    },

    // 7. How Claru Data Integrates
    {
      type: "prose",
      heading: "How Claru Data Integrates with BridgeData V2",
      paragraphs: [
        "Claru supplements BridgeData V2 with additional real-world demonstrations in environments and object categories not covered by the original dataset. BridgeData V2's 24 environments are predominantly Bay Area student apartments and lab spaces — Claru provides demonstrations from commercial kitchens, warehouses, retail shelves, and other settings that better represent production deployment scenarios.",
        "We collect on WidowX 250-compatible hardware with identical action space conventions (7-DoF EE delta at 5 Hz) and deliver in RLDS format, ready for direct concatenation with the BridgeData V2 corpus. Each demonstration includes a natural language instruction following BridgeData V2's annotation conventions. We also support Franka Emika and other platforms for teams using DROID-style pretraining.",
        "For teams fine-tuning Octo or CrossFormer on custom tasks, we provide targeted fine-tuning datasets of 50-500 demonstrations per task in the exact format the model expects. We handle the RLDS conversion pipeline, action normalization, and image preprocessing so your team can focus on training rather than data engineering.",
        "Our quality pipeline goes beyond BridgeData V2's success/failure labeling. We compute trajectory smoothness metrics, check for consistent camera framing, validate action magnitude ranges, and verify language instruction quality. This additional QA layer means our supplementary data integrates cleanly without introducing distributional noise that could degrade policy performance during co-training.",
      ],
    },

    // 8. Key References
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "walke-bridgedata-v2-2023",
          title: "BridgeData V2: A Dataset for Robot Learning at Scale",
          authors: "Walke et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2308.12952",
        },
        {
          id: "team-octo-2024",
          title: "Octo: An Open-Source Generalist Robot Policy",
          authors: "Octo Model Team",
          venue: "RSS 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2405.12213",
        },
        {
          id: "ebert-bridge-2022",
          title: "Bridge Data: Boosting Generalization of Robotic Skills with Cross-Domain Datasets",
          authors: "Ebert et al.",
          venue: "RSS 2022",
          year: 2022,
          url: "https://arxiv.org/abs/2109.13396",
        },
        {
          id: "open-x-embodiment-2024",
          title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
          authors: "Open X-Embodiment Collaboration",
          venue: "ICRA 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2310.08864",
        },
        {
          id: "khazatsky-droid-2024",
          title: "DROID: A Large-Scale In-The-Wild Robot Manipulation Dataset",
          authors: "Khazatsky et al.",
          venue: "RSS 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2403.12945",
        },
      ],
    },
  ],

  // ── FAQs ──────────────────────────────────────────────────────────────
  faqs: [
    {
      question: "Is BridgeData V2 a model or a dataset?",
      answer:
        "BridgeData V2 is primarily a dataset — 60,096 teleoperated demonstrations on a WidowX 250 robot. It is not a model architecture. However, policies trained on it (Octo, RT-X, CrossFormer) are often referred to by the dataset name. When people say 'training data for BridgeData V2,' they typically mean data that is compatible with policies pretrained on the BridgeData V2 corpus.",
    },
    {
      question: "How do I convert my data to RLDS format for BridgeData V2 compatibility?",
      answer:
        "You need to write a TFDS (TensorFlow Datasets) builder class that defines your dataset's feature specification and implements a _generate_examples method. The OXE project provides a template at github.com/kpertsch/rlds_dataset_builder. Key fields: image observation as uint8 tensor, 7-dim float action, language instruction as string, and boolean episode metadata. Claru delivers data pre-converted to RLDS so teams can skip this engineering step.",
    },
    {
      question: "How many demonstrations do I need to fine-tune an Octo model pretrained on BridgeData V2?",
      answer:
        "The Octo paper shows effective fine-tuning with as few as 25-50 demonstrations for tasks that are similar to BridgeData V2's distribution (tabletop pick-and-place with common objects). For out-of-distribution tasks — different object categories, deformable objects, or significantly different environments — plan for 200-500 demonstrations. Fine-tuning takes 1-2 hours on a single GPU.",
    },
    {
      question: "Can I use BridgeData V2 with a robot other than WidowX 250?",
      answer:
        "Yes, but you need to handle the embodiment gap. For same-morphology robots (other 6-DoF arms with parallel grippers), you primarily need to recalibrate action scaling since different arms have different workspace dimensions and velocity limits. For different morphologies (bimanual, mobile, dexterous hands), you need a cross-embodiment model like Octo or CrossFormer that explicitly handles heterogeneous action spaces through tokenization adapters.",
    },
    {
      question: "What are the main gaps in BridgeData V2's coverage?",
      answer:
        "BridgeData V2 is strong on pick-and-place in kitchen/desk environments but has limited coverage of: deformable object manipulation (cloth, rope, bags), tool use beyond basic scooping, tasks requiring precise force control (inserting pegs, turning screws), outdoor or industrial environments, and multi-step long-horizon tasks. These gaps are where supplementary data from providers like Claru adds the most value.",
    },
  ],

  // ── CTA ────────────────────────────────────────────────────────────────
  ctaHeading: "Extend BridgeData V2 for Your Use Case",
  ctaDescription:
    "Tell us about your target tasks and environments. We collect supplementary demonstrations in RLDS format that plug directly into your BridgeData V2-pretrained training pipeline.",

  // ── Cross-links ────────────────────────────────────────────────────────
  relatedGlossaryTerms: [
    "vla",
    "foundation-model-robotics",
    "imitation-learning",
    "rlds",
    "cross-embodiment",
  ],
  relatedGuidePages: [
    "how-to-create-action-labels-for-vla",
    "how-to-collect-teleoperation-data",
  ],
  relatedSolutionSlugs: ["teleoperation-data"],

  // ── Model metadata ────────────────────────────────────────────────────
  modelName: "BridgeData V2",
  organization: "UC Berkeley",
  year: 2023,

  inputSpec: {
    observationFormat:
      "256x256 RGB from third-person camera (optional wrist camera); 8-dim proprioceptive state",
    actionFormat:
      "7-DoF end-effector delta: 3D position + 3D rotation (axis-angle) + 1D gripper",
    languageConditioning:
      "Natural language goal description per episode (e.g., 'put the corn in the pot')",
    controlFrequency: "5 Hz",
  },

  dataVolumeBenchmarks:
    "BridgeData V2 contains 60,096 successful demonstrations across 13 manipulation skills in 24 real-world environments. The original BridgeData (2022) had 7,200 demonstrations in 10 environments, so V2 represents an 8x scale increase. Within the dataset, the distribution is heavily skewed: pick-and-place accounts for roughly 40% of demonstrations, while rarer skills like tool use or pouring have 500-2,000 demonstrations each. Policies pretrained on the full 60K corpus (such as Octo) show 15-25% higher success rates on held-out tasks compared to training on any single-environment subset. For fine-tuning, the Octo team demonstrated that 25-50 demonstrations on a new task achieve 60-80% of the performance of 500 demonstrations, indicating strong transfer from the BridgeData V2 pretraining. The dataset totals approximately 1.8 million individual timesteps and 150 GB in RLDS format on disk.",

  trainingRecipe:
    "BridgeData V2 is used as a pretraining corpus rather than having its own training recipe. The canonical training pipeline is Octo's: a diffusion-based transformer policy with separate observation tokenizers for images (ViT-S/16) and language (T5-base), a transformer trunk with 12 layers, and a diffusion action head that predicts 4-step action chunks. Pretraining on the full 60K BridgeData V2 corpus plus selected OXE datasets runs for 300K gradient steps with batch size 256 on 8 TPU v3 chips, taking approximately 48 hours. The learning rate follows a cosine schedule with peak 3e-4 and 2K warm-up steps. Data augmentation includes random image crops (224x224 from 256x256), color jitter, and random horizontal flips of both images and actions. For fine-tuning on a target task, the standard recipe freezes the observation encoders and trains only the transformer trunk and action head for 20K-50K steps at learning rate 3e-5. Alternative training recipes using BridgeData V2 include RT-X (cross-embodiment co-training with 22 other datasets) and CrossFormer (heterogeneous tokenization).",

  claruIntegration:
    "Claru supplements BridgeData V2 with additional real-world demonstrations in environments and object categories not covered by the original dataset. We collect on WidowX 250-compatible hardware with identical 7-DoF EE delta actions at 5 Hz and deliver in RLDS format for direct concatenation with the BridgeData V2 corpus. Our environment coverage extends to commercial kitchens, retail shelves, warehouses, and other production-relevant settings that go beyond BridgeData V2's Bay Area apartment distribution. Each demonstration includes quality-validated language instructions, and our QA pipeline verifies action normalization ranges, camera framing consistency, and trajectory smoothness to ensure clean integration with existing co-training pipelines.",

  keyPapers: [
    {
      id: "walke-bridgedata-v2-2023",
      title: "BridgeData V2: A Dataset for Robot Learning at Scale",
      authors: "Walke et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2308.12952",
    },
    {
      id: "team-octo-2024",
      title: "Octo: An Open-Source Generalist Robot Policy",
      authors: "Octo Model Team",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2405.12213",
    },
    {
      id: "ebert-bridge-2022",
      title: "Bridge Data: Boosting Generalization of Robotic Skills with Cross-Domain Datasets",
      authors: "Ebert et al.",
      venue: "RSS 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2109.13396",
    },
    {
      id: "open-x-embodiment-2024",
      title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Open X-Embodiment Collaboration",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864",
    },
    {
      id: "khazatsky-droid-2024",
      title: "DROID: A Large-Scale In-The-Wild Robot Manipulation Dataset",
      authors: "Khazatsky et al.",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2403.12945",
    },
  ],
};

export default data;
