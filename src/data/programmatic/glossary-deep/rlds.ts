import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "rlds",
  termSlug: "rlds",
  category: "data-quality-pipelines",
  metaTitle: "RLDS Format — Definition & Training Data | Claru",
  metaDescription: "RLDS (Reinforcement Learning Datasets) is the standard data format for robot learning datasets. Learn how RLDS structures episodes, observations, and actions for cross-embodiment training.",
  primaryKeyword: "RLDS format",
  secondaryKeywords: ["reinforcement learning datasets", "RLDS specification", "TensorFlow datasets robotics", "robot data format", "episode data structure"],
  canonicalPath: "/glossary/rlds",
  h1: "RLDS Format: Definition, Applications, and Training Data Requirements",
  heroSubtitle: "RLDS (Reinforcement Learning Datasets) is a data specification and storage format designed for sequential decision-making data — episodes composed of timesteps containing observations, actions, rewards, and metadata. Developed by Google DeepMind and adopted by the Open X-Embodiment project, RLDS has become the de facto standard for storing and sharing robot learning datasets across research groups and robot platforms.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "RLDS Format", href: "/glossary/rlds" },
  ],
  sections: [],
  faqs: [
    {
      question: "What is the structure of an RLDS dataset?",
      answer: "An RLDS dataset is organized hierarchically: a dataset contains episodes, and each episode contains an ordered sequence of steps (timesteps). Each step is a dictionary with standardized keys: 'observation' (sensor data — images, proprioception, language instructions), 'action' (the motor command executed), 'reward' (a scalar signal, often 0/1 for task success), 'discount' (for RL discounting), and 'is_terminal' / 'is_first' / 'is_last' (boolean flags marking episode boundaries). The observation and action fields are themselves nested dictionaries that can contain images, joint states, end-effector poses, and language strings. This nested structure accommodates the diversity of robot sensor suites and control interfaces while maintaining a consistent outer schema. RLDS is built on TensorFlow Datasets (TFDS), using Apache Beam for parallel dataset generation and TFRecord files for storage."
    },
    {
      question: "Why was RLDS created instead of using existing formats like HDF5?",
      answer: "Before RLDS, robot learning datasets used ad-hoc formats — HDF5, pickle files, custom binary formats, CSV logs — with no standard schema for episodes, observations, or actions. This fragmentation meant that using a dataset from another lab required writing custom data loaders, understanding undocumented conventions, and manually handling edge cases like variable-length episodes and missing fields. RLDS solved this by defining a universal schema (episodes of steps with standardized fields), providing tooling for dataset creation, validation, and loading, and building on the mature TensorFlow Datasets infrastructure for storage, versioning, and distribution. The Open X-Embodiment project demonstrated the value of this standardization by combining 60+ datasets from 22 robot platforms into a single training mixture — possible only because all data followed the RLDS schema."
    },
    {
      question: "Can RLDS datasets be used with PyTorch training pipelines?",
      answer: "Yes. While RLDS is built on TensorFlow Datasets, multiple bridge libraries enable consumption from PyTorch. The 'dlimp' library (used by the Octo project) and 'rlds-to-torch' provide PyTorch DataLoader wrappers that read RLDS TFRecord files and yield PyTorch tensors. The 'oxe_torch_dataloader' from the Open X-Embodiment project provides a production-ready PyTorch interface with configurable data augmentation, frame stacking, and action chunking. Performance is comparable to native PyTorch dataloaders because the underlying TFRecord format supports parallel reads and prefetching. Alternatively, RLDS datasets can be converted to HDF5 or zarr for native PyTorch consumption, though this sacrifices the versioning and documentation metadata that RLDS provides. Most teams developing for both frameworks maintain the canonical dataset in RLDS and convert to PyTorch-native formats as a build step."
    },
    {
      question: "What metadata does RLDS capture beyond raw sensor data?",
      answer: "RLDS datasets include structured metadata at multiple levels. Dataset-level metadata documents the robot platform, sensor configuration, task descriptions, collection methodology, and licensing information. Episode-level metadata can include the task variant, environment configuration, success/failure outcome, operator ID, and quality scores. Step-level metadata contains timestamps, sensor-specific parameters (camera intrinsics, exposure settings), and control mode information. This metadata is critical for dataset curation — filtering episodes by task success, selecting data from specific environments, or weighting samples by quality score during training. The RLDS builder API enforces metadata schema validation, preventing the undocumented field conventions that plagued earlier ad-hoc formats."
    },
    {
      question: "How does Claru deliver training data in RLDS format?",
      answer: "Claru's data delivery pipeline produces RLDS-compliant datasets that integrate directly with Open X-Embodiment training infrastructure and cross-embodiment model pipelines. Each dataset is generated using the official RLDS builder API with validated schemas, comprehensive dataset-level documentation (robot platform, sensor specs, task descriptions, collection protocols), and episode-level metadata including task success labels and quality scores. Observation dictionaries include camera images at the recorded resolution, proprioceptive state vectors with documented units and coordinate frames, and language instructions where applicable. Action fields use the canonical representation for the target robot platform. We validate schema compliance, episode completeness, and observation-action alignment before delivery, and provide TFDS dataset cards with statistics on episode lengths, task distributions, and data quality metrics. For teams using PyTorch, we also deliver HDF5 or zarr conversions alongside the canonical RLDS format."
    }
  ],
  ctaHeading: "Need Training Data in RLDS Format?",
  ctaDescription: "Claru delivers robot learning datasets in RLDS format with full metadata, schema validation, and cross-framework compatibility. Ready for Open X-Embodiment and VLA training.",
  relatedGlossaryTerms: ["open-x-embodiment", "cross-embodiment-data", "vla", "foundation-model-robotics"],
  relatedGuidePages: ["how-to-convert-data-to-rlds-format"],
  relatedSolutionSlugs: ["vla-training-data"],
  longDefinition: "RLDS (Reinforcement Learning Datasets) is a data specification, storage format, and toolchain for sequential decision-making datasets, developed by Google DeepMind and built on the TensorFlow Datasets (TFDS) infrastructure. It provides a standardized schema for representing episodes of agent-environment interaction — the fundamental data structure in reinforcement learning, imitation learning, and robot learning — along with tools for dataset creation, validation, transformation, and consumption.\n\nThe RLDS schema represents a dataset as a collection of episodes, where each episode is an ordered sequence of steps. Each step contains a fixed set of fields: an observation (the sensory state perceived by the agent), an action (the command executed), a reward (the scalar feedback signal), a discount factor, and boolean flags indicating whether the step is the first or last in the episode. Observations and actions are nested dictionaries that accommodate the heterogeneous sensor suites and control interfaces of different robot platforms — a single observation might contain multiple camera images at different resolutions, a proprioceptive state vector, a language instruction string, and a task embedding vector.\n\nThe significance of RLDS for robot learning cannot be overstated. Before its adoption, every research group stored robot data in custom formats with undocumented schemas, making cross-lab data sharing effectively impossible without significant engineering effort. The Open X-Embodiment project (Embodiment Collaboration, 2023) demonstrated what standardization enables: by converting 60+ existing datasets from 22 different robot platforms to RLDS format, the team created a unified training mixture of over 1 million real robot episodes. This mixture trained the RT-X models, which showed that cross-embodiment pretraining on diverse RLDS data improved policy performance on individual robots by 50% on average compared to training on that robot's data alone.\n\nRLDS is implemented on top of TensorFlow Datasets, which provides versioning (each dataset version is immutable and reproducible), documentation (dataset cards with statistics and descriptions), distribution (datasets can be loaded with a single function call from Google Cloud Storage or local storage), and parallel processing (Apache Beam pipelines for efficient dataset generation). The TFRecord storage format supports random access, parallel reads, and efficient compression. While RLDS is natively TensorFlow-compatible, bridge libraries like dlimp and oxe_torch_dataloader provide PyTorch DataLoader interfaces with comparable performance, and conversion to HDF5 or zarr is straightforward for teams that prefer native PyTorch storage.",
  historicalContext: "The data format landscape for robot learning evolved through several stages of increasing standardization. Early robot learning experiments in the 2000s and 2010s used whatever format was convenient — CSV logs of joint positions, ROS bag files of sensor streams, pickle files of Python dictionaries, or MATLAB .mat files. Each lab developed its own conventions for episode boundaries, observation formats, and action representations, creating silos that prevented data sharing.\n\nHDF5 emerged as an informal standard in the mid-2010s, offering hierarchical data organization, efficient compression, and cross-language support. RoboTurk (Mandlekar et al., 2018) and RoboMimic (Mandlekar et al., 2021) used HDF5 with specific group hierarchies for episodes and timesteps. The robomimic and robosuite ecosystems standardized around HDF5, and the format remains widely used in PyTorch-based robot learning pipelines. However, HDF5 lacked a formal schema specification — two HDF5 files from different labs would use different key names, data types, and organizational hierarchies, requiring custom loader code.\n\nThe RLDS specification was developed at Google DeepMind (published as Ramos et al., 2021) to address this fragmentation. By building on TensorFlow Datasets, RLDS inherited a mature infrastructure for dataset versioning, documentation, and distribution. The specification defined a universal schema for sequential decision-making data that could accommodate any robot platform. The initial adoption was within Google's robotics research groups (RT-1, RT-2).\n\nThe Open X-Embodiment project (2023) cemented RLDS as the community standard. By converting 60+ datasets from 22 robot platforms across 21 institutions to RLDS format, the project demonstrated that standardization was both feasible and valuable. The resulting RT-X models, trained on this unified RLDS mixture, established that cross-embodiment pretraining works — and only works — when data follows a consistent format. Subsequent generalist robot policies (Octo, OpenVLA, pi-zero) have all adopted RLDS as their primary data format, making it the de facto standard for the field.",
  practicalImplications: "Converting existing robot data to RLDS format requires understanding both the RLDS schema and your source data's conventions. The RLDS builder API expects data organized as episodes containing steps, where each step has an observation dict, action array, reward scalar, and terminal flags. Common conversion challenges include: identifying episode boundaries in continuous recording logs (typically using task success/failure signals or time gaps), aligning observations and actions that were recorded at different rates (requiring interpolation or nearest-timestamp matching), and mapping robot-specific state representations to the RLDS observation and action schemas.\n\nFor new data collection, building RLDS-native recording pipelines avoids conversion overhead. The RLDS EnvLogger wraps a Gym or dm_env environment and records directly to RLDS format. For teleoperation data where a human controls the robot, custom recording scripts can write RLDS steps in real time by capturing observations and actions at each control timestep. Quality validation should run during recording — checking that episode lengths are within expected ranges, observations contain valid data (no NaN values, images are not black), and actions are within the robot's kinematic limits.\n\nThe choice of observation and action representations within RLDS affects downstream training. Camera images can be stored at full resolution or resized; the tradeoff is storage size versus information loss. Proprioceptive states should include all available signals (joint positions, velocities, torques, end-effector pose) with documented units and coordinate frames. Actions should use the representation expected by the training pipeline — absolute joint positions, delta joint positions, or end-effector space commands. The Open X-Embodiment project standardized on delta end-effector actions for cross-embodiment training, but robot-specific datasets often use joint-space representations for platform-specific fine-tuning.\n\nClaru delivers datasets in fully validated RLDS format with comprehensive documentation, enabling direct consumption by RT-X, Octo, OpenVLA, and custom training pipelines. Our RLDS builder scripts produce immutable, versioned datasets with dataset cards, per-episode metadata, and observation-action schema documentation. For teams that require PyTorch-native formats, we provide parallel deliveries in HDF5 and zarr with identical data and metadata.",
  commonMisconceptions: [
    {
      misconception: "RLDS is only for TensorFlow users and cannot be used with PyTorch.",
      correction: "While RLDS is built on TensorFlow Datasets, it is framework-agnostic in practice. The dlimp library (used by Octo), oxe_torch_dataloader, and rlds-to-torch all provide native PyTorch DataLoader interfaces that read RLDS TFRecord files without requiring TensorFlow at training time. Performance is comparable to native PyTorch dataloaders because TFRecord supports parallel reads and prefetching. The most widely used open-source robot policies — Octo (JAX), OpenVLA (PyTorch), and pi-zero (PyTorch) — all consume RLDS data despite different training frameworks."
    },
    {
      misconception: "Converting data to RLDS is a one-time trivial task.",
      correction: "RLDS conversion requires careful attention to schema mapping, episode boundary detection, temporal alignment, and metadata extraction. Common pitfalls include misaligning observation timestamps with action timestamps (creating off-by-one errors that degrade policy learning), using inconsistent coordinate frames across episodes, and losing metadata that is present in the source format but not mapped to RLDS fields. Thorough validation — checking episode lengths, observation ranges, action distributions, and temporal consistency — is essential after conversion. Teams that rush conversion to 'just get the data into RLDS' frequently discover training failures weeks later caused by subtle data alignment issues."
    },
    {
      misconception: "RLDS is only needed for cross-embodiment training; single-robot projects can use any format.",
      correction: "Even for single-robot projects, RLDS provides significant benefits: immutable dataset versions prevent accidental data corruption, dataset cards enforce documentation that prevents knowledge loss when team members change, schema validation catches data quality issues early, and the standardized format means that pretrained models (RT-X, Octo) can be directly fine-tuned on your data without format conversion. The upfront investment in RLDS-native data collection pays off in reproducibility, data quality, and compatibility with the growing ecosystem of RLDS-based tools and models."
    }
  ],
  keyPapers: [
    {
      id: "ramos-rlds-2021",
      title: "RLDS: an Ecosystem to Generate, Share and Use Datasets in Reinforcement Learning",
      authors: "Ramos et al.",
      venue: "arXiv 2111.02767",
      year: 2021,
      url: "https://arxiv.org/abs/2111.02767"
    },
    {
      id: "embodiment-collaboration-oxe-2023",
      title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Embodiment Collaboration",
      venue: "arXiv 2310.08864",
      year: 2023,
      url: "https://arxiv.org/abs/2310.08864"
    },
    {
      id: "team-octo-2024",
      title: "Octo: An Open-Source Generalist Robot Policy",
      authors: "Octo Model Team",
      venue: "arXiv 2405.12213",
      year: 2024,
      url: "https://arxiv.org/abs/2405.12213"
    },
    {
      id: "kim-openvla-2024",
      title: "OpenVLA: An Open-Source Vision-Language-Action Model",
      authors: "Kim et al.",
      venue: "arXiv 2406.09246",
      year: 2024,
      url: "https://arxiv.org/abs/2406.09246"
    },
    {
      id: "brohan-rt2-2023",
      title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan et al.",
      venue: "arXiv 2307.15818",
      year: 2023,
      url: "https://arxiv.org/abs/2307.15818"
    }
  ],
  claruRelevance: "Claru delivers robot learning datasets in fully validated RLDS format, ready for direct consumption by the Open X-Embodiment training infrastructure and generalist robot policies including RT-X, Octo, OpenVLA, and pi-zero. Our RLDS builder pipeline produces immutable, versioned datasets with comprehensive dataset cards documenting robot platforms, sensor specifications, task descriptions, and collection protocols. Each dataset includes per-episode metadata — task success labels, quality scores, operator IDs, and environment configurations — enabling fine-grained data curation and filtering for training. Observation and action schemas follow Open X-Embodiment conventions with documented units, coordinate frames, and robot-specific parameters. Schema validation, temporal alignment verification, and observation completeness checks run automatically before delivery. For teams using PyTorch, we provide parallel deliveries in HDF5 and zarr formats with identical data and metadata. With 3M+ annotated clips across diverse manipulation, navigation, and interaction tasks, Claru provides the RLDS-formatted data at the scale that cross-embodiment foundation models require.",
};

export default data;
