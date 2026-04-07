import type { FormatPageData } from "./types";

const data: FormatPageData = {
  "slug": "tfds",
  "metaTitle": "TFDS (TensorFlow Datasets) for Robotics Data | Claru",
  "metaDescription": "TFDS provides structured dataset pipelines for TensorFlow. Learn how robotics datasets are structured in TFDS and how Claru delivers TFDS-compatible data.",
  "primaryKeyword": "TensorFlow Datasets format robotics",
  "secondaryKeywords": [
    "TensorFlow Datasets format robotics data",
    "TensorFlow Datasets robotics training data",
    "TFDS robotics dataset format",
    "tfds robot data",
    "TFRecord robotics format",
    "tfds.load robotics",
    "TFDS DatasetBuilder robotics"
  ],
  "canonicalPath": "/formats/tfds",
  "h1": "TFDS (TensorFlow Datasets): Complete Guide for Robotics Data",
  "heroSubtitle": "TFDS provides structured dataset pipelines for TensorFlow. Learn how robotics datasets are structured in TFDS and how Claru delivers TFDS-compatible data.",
  "breadcrumbs": [
    {
      "label": "Home",
      "href": "/"
    },
    {
      "label": "Formats",
      "href": "/formats"
    },
    {
      "label": "TFDS",
      "href": "/formats/tfds"
    }
  ],
  "sections": [
    {
      "type": "prose",
      "heading": "Schema and Structure",
      "paragraphs": [
        "TFDS (TensorFlow Datasets) extends TFRecord with a standardized builder pattern that combines data serialization, schema definition, versioning, and pipeline integration into a single framework. A DatasetBuilder subclass defines a DatasetInfo object containing the feature structure (tfds.features.Image for images with automatic JPEG/PNG encoding, tfds.features.Tensor for numerical arrays with specified dtype and shape, tfds.features.Text for strings, tfds.features.FeaturesDict for nested dictionaries), the semantic version number (e.g., 1.0.0), and a human-readable description. Data is stored as sharded TFRecords (typically 256 MB per shard) with a dataset_info.json manifest that records the feature schema, split statistics, number of examples, and file checksums.",
        "The TFDS builder pattern provides a standardized way to define, generate, and version datasets. A DatasetBuilder subclass implements three key methods: _info() returns the DatasetInfo with feature connectors and metadata, _split_generators() defines how to discover and partition raw data files into train/validation/test splits, and _generate_examples() yields individual examples as (key, feature_dict) pairs that the framework serializes to sharded TFRecords with automatic checksumming. The builder system handles shard balancing (distributing examples evenly across shards), deterministic shuffling (consistent ordering across builds), and download management (caching raw data and tracking URLs). Version numbers follow semantic versioning: major version changes indicate backward-incompatible feature changes, minor versions add features, and patch versions fix data errors.",
        "TFDS's integration with tf.data provides production-grade data pipeline primitives that are critical for efficient GPU utilization during training. The tfds.load() function returns a tf.data.Dataset with configurable batching, shuffling (with configurable buffer size), prefetching (overlapping data loading with GPU computation), interleaving (reading from multiple shards simultaneously), and caching (keeping frequently accessed data in memory). For robotics pipelines, the combination of RLDS (which defines the episode/step structure on top of TFDS) with TFDS (which handles the storage and pipeline mechanics) has become the standard in the Google DeepMind ecosystem, powering RT-1, RT-2, Octo, and OpenVLA training runs. TFDS also supports loading datasets from Google Cloud Storage with automatic local caching, enabling efficient access to multi-terabyte datasets without full downloads."
      ]
    },
    {
      "type": "cards",
      "heading": "Frameworks and Models Using TFDS",
      "cards": [
        {
          "title": "TensorFlow / Keras",
          "description": "Native loading via tfds.load() with automatic batching, shuffling, prefetching, and distributed strategy support for multi-GPU training."
        },
        {
          "title": "JAX / Flax",
          "description": "TFDS integrates with JAX training loops via tfds.as_numpy() conversion, used by Google Brain robotics for all JAX-based model training."
        },
        {
          "title": "Google DeepMind Robotics",
          "description": "RT-1, RT-2, RT-X, Octo, and OpenVLA all use TFDS (via RLDS) as their primary dataset management framework."
        },
        {
          "title": "Open X-Embodiment",
          "description": "The largest cross-embodiment robotics dataset collection (60+ datasets) uses TFDS builders for standardized data access."
        },
        {
          "title": "Grain",
          "description": "Google's next-generation data loading library designed for JAX, providing efficient TFDS dataset access with multihost support."
        },
        {
          "title": "SeqIO",
          "description": "Sequence-to-sequence data pipeline from Google that builds on TFDS for text and multimodal datasets used in language models."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Reading and Writing TFDS Robotics Data in Python",
      "paragraphs": [
        "Loading a TFDS dataset requires just two lines: dataset = tfds.load('dataset_name', split='train') returns a tf.data.Dataset, and iterating with for example in dataset: accesses individual examples as nested dictionaries of tensors. For robotics RLDS datasets: dataset = tfds.load('bridge_dataset', split='train') returns the full BridgeData V2 collection. Each example is an episode containing a 'steps' dataset that you iterate: for episode in dataset: for step in episode['steps']: where step['observation']['image'] yields a decoded image tensor and step['action'] yields the action vector. The tfds.load() function handles downloading, caching, shuffling, and batching automatically.",
        "Creating a new TFDS dataset involves writing a DatasetBuilder subclass. The _info method returns tfds.core.DatasetInfo with a features dictionary: tfds.features.FeaturesDict({'image': tfds.features.Image(shape=(H, W, 3)), 'action': tfds.features.Tensor(shape=(7,), dtype=tf.float32), 'reward': tf.float32}). The _split_generators method points to raw data directories, and _generate_examples yields (example_key, example_dict) tuples. Running tfds build --datasets=your_dataset generates the sharded TFRecords, dataset_info.json, and label metadata. For the Open X-Embodiment ecosystem, builders follow the RLDS convention of yielding episodes as nested datasets of steps, and the repository at github.com/google-deepmind/open_x_embodiment maintains reference builder implementations.",
        "TFDS provides several advanced features critical for large-scale robotics training. The tfds.ReadConfig class controls reading behavior: num_parallel_reads (default 64) determines how many shards are read concurrently, interleave_cycle_length controls round-robin shard reading for better shuffling, and try_autocache enables automatic in-memory caching for datasets that fit in RAM. For distributed training across multiple TPU/GPU hosts, TFDS integrates with tf.distribute strategies to automatically shard data across workers, ensuring each worker processes a unique subset of examples. The tfds.benchmarks module provides throughput measurement tools, and well-configured TFDS pipelines achieve 1-10 GB/s data throughput on modern storage systems."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "When to Use TFDS vs Alternatives",
      "description": "TFDS is the natural choice for TensorFlow/JAX ecosystems but other frameworks may be better fits for PyTorch workflows.",
      "columns": [
        "Format",
        "Best For",
        "Framework",
        "Versioning",
        "Cloud Support"
      ],
      "rows": [
        {
          "Format": "TFDS",
          "Best For": "TF/JAX robotics, Open X-Embodiment",
          "Framework": "TensorFlow, JAX",
          "Versioning": "Built-in semantic versioning",
          "Cloud Support": "GCS native + caching"
        },
        {
          "Format": "HF Datasets",
          "Best For": "PyTorch/HF Hub ecosystem",
          "Framework": "PyTorch (primary), TF",
          "Versioning": "Git-based on HF Hub",
          "Cloud Support": "HF Hub streaming"
        },
        {
          "Format": "WebDataset",
          "Best For": "Large-scale distributed PyTorch",
          "Framework": "PyTorch",
          "Versioning": "Manual (shard naming)",
          "Cloud Support": "S3/HTTP streaming"
        },
        {
          "Format": "HDF5",
          "Best For": "Local training, robomimic/D4RL",
          "Framework": "Framework-agnostic",
          "Versioning": "Manual",
          "Cloud Support": "Poor (local files)"
        },
        {
          "Format": "LeRobot (Parquet+MP4)",
          "Best For": "HF robotics ecosystem",
          "Framework": "PyTorch",
          "Versioning": "Git-based on HF Hub",
          "Cloud Support": "HF Hub streaming"
        }
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Converting from Other Formats",
      "columns": [
        "Source Format",
        "Tool / Library",
        "Complexity",
        "Notes"
      ],
      "rows": [
        {
          "Source Format": "HDF5",
          "Tool / Library": "TFDS builder + h5py",
          "Complexity": "moderate",
          "Notes": "Write a DatasetBuilder that reads HDF5 groups, maps to feature connectors, yields examples."
        },
        {
          "Source Format": "WebDataset (tar shards)",
          "Tool / Library": "Custom TFDS builder",
          "Complexity": "moderate",
          "Notes": "Stream tar shards, group files by key prefix, map to TFDS feature structure."
        },
        {
          "Source Format": "CSV / JSON",
          "Tool / Library": "tfds.builder_from_directory",
          "Complexity": "trivial",
          "Notes": "Simple tabular data with file references can be loaded directly."
        },
        {
          "Source Format": "LeRobot (Parquet + MP4)",
          "Tool / Library": "Custom TFDS builder",
          "Complexity": "moderate",
          "Notes": "Read Parquet metadata, decode MP4 video frames, yield as TFDS episodes following RLDS structure."
        },
        {
          "Source Format": "ROS bag",
          "Tool / Library": "TFDS builder + rosbags",
          "Complexity": "complex",
          "Notes": "Deserialize ROS messages, synchronize multi-rate topics, segment into episodes, yield as TFDS examples."
        },
        {
          "Source Format": "Raw files (images + labels)",
          "Tool / Library": "TFDS builder + custom loader",
          "Complexity": "moderate",
          "Notes": "Define features matching your file types, implement _generate_examples to read and yield pairs."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "TFDS in the Google DeepMind Robotics Ecosystem",
      "paragraphs": [
        "TFDS is the foundational data layer for Google DeepMind's robotics research stack. The Open X-Embodiment project, which aggregates over 60 robotics datasets from 21 institutions into a unified collection for training cross-embodiment policies, uses TFDS builders for every dataset. Each contributing lab writes a DatasetBuilder that converts their native format (HDF5, custom CSVs, ROS bags) into a standardized RLDS-on-TFDS representation. This standardization enables models like RT-X and Octo to train on the entire collection with a single data loading pipeline, despite the extreme heterogeneity of the underlying data sources.",
        "The combination of TFDS and tf.data provides critical performance optimizations for large-scale robotics model training. TFDS's deterministic shuffling ensures reproducible training runs (important for ablation studies), while tf.data's prefetching and interleaving pipelines keep GPU utilization above 90% even when reading from networked storage. For TPU training (used by RT-2 and RT-X), TFDS's integration with tf.data.service enables distributed data preprocessing where CPU-bound operations (image decoding, augmentation) run on separate preprocessing workers, freeing TPU host CPUs for feeding data to accelerators.",
        "For teams outside the Google ecosystem who want to use TFDS datasets, several interoperability paths exist. The tfds.as_numpy() function strips TensorFlow tensors to NumPy arrays suitable for any framework. The dlimp library (used by the Octo team) wraps TFDS datasets in PyTorch-compatible iterators. The fog_x library provides a format-agnostic abstraction layer that can read both TFDS and other robotics formats. For teams that want to consume Open X-Embodiment data in PyTorch, Claru can convert any RLDS/TFDS dataset to LeRobot format (Parquet + MP4) for native HuggingFace Hub compatibility."
      ]
    },
    {
      "type": "citation-list",
      "heading": "References",
      "citations": [
        {
          "id": "tfds-2019",
          "title": "TensorFlow Datasets: A Collection of Ready-to-Use Datasets",
          "authors": "TensorFlow Team",
          "venue": "TensorFlow Documentation",
          "year": 2019,
          "url": "https://www.tensorflow.org/datasets"
        },
        {
          "id": "ramos-rlds-2021",
          "title": "RLDS: an Ecosystem to Generate, Share and Use RL Datasets",
          "authors": "Ramos et al.",
          "venue": "NeurIPS 2021 (Datasets & Benchmarks)",
          "year": 2021,
          "url": "https://arxiv.org/abs/2111.02767"
        },
        {
          "id": "open-x-2023",
          "title": "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
          "authors": "Open X-Embodiment Collaboration",
          "venue": "ICRA 2024",
          "year": 2023,
          "url": "https://arxiv.org/abs/2310.08864"
        },
        {
          "id": "team-octo-2024",
          "title": "Octo: An Open-Source Generalist Robot Policy",
          "authors": "Octo Model Team",
          "venue": "RSS 2024",
          "year": 2024,
          "url": "https://arxiv.org/abs/2405.12213"
        },
        {
          "id": "brohan-rt1-2023",
          "title": "RT-1: Robotics Transformer for Real-World Control at Scale",
          "authors": "Brohan et al.",
          "venue": "RSS 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2212.06817"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Claru Data Delivery in TFDS Format",
      "paragraphs": [
        "Claru provides custom TFDS DatasetBuilder code alongside the data, enabling one-line loading via tfds.load('claru_your_dataset'). Builders include properly typed feature connectors (tfds.features.Image with configurable encoding, tfds.features.Tensor with exact dtype and shape specifications), split configurations matching your train/val/test requirements, and comprehensive dataset documentation embedded in the DatasetInfo. Image features use JPEG compression by default with configurable quality (default 95), and proprioceptive state uses float32 precision.",
        "Every delivery includes the complete builder Python package that can be registered in your local TFDS installation, a set of pre-built TFRecord shards with checksums, and a verification script that runs the builder's built-in integrity checks. For teams targeting the Open X-Embodiment ecosystem, we validate schema compatibility with RT-X and Octo model expectations (observation dictionary structure, action space dimensionality, language instruction format). For teams needing PyTorch compatibility, we additionally deliver a dlimp-compatible wrapper and can provide the same data in LeRobot or HDF5 format."
      ]
    }
  ],
  "faqs": [
    {
      "question": "What is the difference between TFDS and RLDS?",
      "answer": "TFDS is the general-purpose dataset framework providing storage (sharded TFRecords), schema definition (feature connectors), versioning (semantic versions), and pipeline integration (tf.data). RLDS is built on top of TFDS specifically for reinforcement learning and robotics data, adding the episode-of-steps nesting structure and RL-specific fields (observation, action, reward, discount, is_first, is_last, is_terminal). Every RLDS dataset is a TFDS dataset, but not every TFDS dataset follows the RLDS conventions. For robotics data that will be used with RT-X, Octo, or OpenVLA, use RLDS. For other perception or classification tasks, standard TFDS is sufficient."
    },
    {
      "question": "Can I use TFDS data with PyTorch?",
      "answer": "Yes, via several approaches. The tfds.as_numpy() function converts tf.data.Dataset outputs to NumPy arrays, which can be wrapped in a PyTorch DataLoader. The dlimp library (github.com/kvablack/dlimp) provides a thin wrapper that converts TFDS datasets into PyTorch-compatible iterators and is the same tool used by the Octo model team. The fog_x library offers another format-agnostic abstraction layer. For teams wanting zero TensorFlow dependency, Claru can deliver the same data simultaneously in TFDS and a PyTorch-native format like HDF5, WebDataset, or LeRobot."
    },
    {
      "question": "How does TFDS handle versioning?",
      "answer": "TFDS has built-in semantic version management. Each DatasetBuilder specifies a VERSION attribute (e.g., tfds.core.Version('2.1.0')), and tfds.load() targets specific versions for reproducible training. Major version changes (2.0.0 to 3.0.0) indicate backward-incompatible changes like removed features or changed shapes. Minor versions (2.1.0 to 2.2.0) add new features. Patch versions (2.1.0 to 2.1.1) fix data errors. The TFDS catalog at tensorflow.org/datasets/catalog maintains version history for all registered datasets, and local builds store version-tagged directories."
    },
    {
      "question": "How does TFDS handle large datasets that do not fit in memory?",
      "answer": "TFDS uses sharded TFRecords (typically 256 MB per shard) that are read sequentially using tf.data's streaming infrastructure. The tf.data pipeline loads data lazily: only the current batch plus prefetched batches are in memory at any time. For datasets on Google Cloud Storage, TFDS downloads and caches shards on demand (configurable via download_and_prepare(download_dir=...)). The interleave operation reads from multiple shards simultaneously (default num_parallel_reads=64) for better I/O throughput, and the cache operation optionally stores the full dataset in memory for datasets that fit. Multi-terabyte datasets like Open X-Embodiment run efficiently because the streaming pipeline never loads the full dataset."
    },
    {
      "question": "How do I create a TFDS builder for my custom robotics dataset?",
      "answer": "Start by subclassing tfds.core.GeneratorBasedBuilder. In _info(), define your feature structure with tfds.features.FeaturesDict mapping field names to feature types (Image, Tensor, Text, etc.). In _split_generators(), return a dictionary mapping split names to generator configs pointing at your raw data. In _generate_examples(), yield (key, example_dict) pairs where each example matches the feature structure. Run tfds build to generate TFRecords. For RLDS-compatible robotics data, use the rlds.rlds_builder.RLDSBuilder base class which enforces the episode/step structure. Claru automates this entire process and delivers builder code that passes all TFDS and OXE validation checks."
    }
  ],
  "ctaHeading": "Get Data in TFDS Format",
  "ctaDescription": "Claru delivers robotics data as TFDS-compatible datasets with custom DatasetBuilder code, enabling one-line loading via tfds.load(). Tell us your requirements.",
  "relatedGlossaryTerms": [
    "rlds",
    "cross-embodiment-data",
    "data-enrichment"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "fileExtensions": [
    ".tfrecord"
  ],
  "schemaDescription": "TFDS extends TFRecord with a standardized builder pattern: DatasetBuilder classes define features (tfds.features.Image, Tensor, Text, FeaturesDict for nested structures), splits, and preprocessing. Data is stored as sharded TFRecords (typically 256 MB per shard) with a dataset_info.json manifest recording feature schema, split statistics, example counts, and file checksums. Feature connectors handle automatic encoding/decoding (JPEG for images, protobuf serialization for tensors). The builder system provides semantic versioning, deterministic shuffling, and download management.",
  "frameworksUsing": [
    {
      "name": "TensorFlow / Keras",
      "description": "Native loading via tfds.load() with automatic batching, shuffling, prefetching, and distributed strategy support."
    },
    {
      "name": "JAX / Flax",
      "description": "TFDS integrates with JAX training loops via tfds.as_numpy() conversion, used by Google DeepMind for all JAX-based robotics training."
    },
    {
      "name": "Google DeepMind Robotics",
      "description": "RT-1, RT-2, RT-X, Octo, and OpenVLA all use TFDS (via RLDS) as their primary dataset management framework."
    },
    {
      "name": "Open X-Embodiment",
      "description": "60+ cross-embodiment robotics datasets from 21 institutions, all standardized as TFDS builders.",
      "url": "https://robotics-transformer-x.github.io/"
    },
    {
      "name": "Grain",
      "description": "Google's next-generation data loading library for JAX with efficient TFDS dataset access and multihost support."
    },
    {
      "name": "SeqIO",
      "description": "Sequence-to-sequence data pipeline from Google building on TFDS for text and multimodal datasets."
    }
  ],
  "conversions": [
    {
      "sourceFormat": "HDF5",
      "toolOrLibrary": "TFDS builder + h5py",
      "complexity": "moderate",
      "notes": "Write a DatasetBuilder that reads HDF5 groups, maps to feature connectors, yields examples."
    },
    {
      "sourceFormat": "WebDataset",
      "toolOrLibrary": "Custom TFDS builder",
      "complexity": "moderate",
      "notes": "Stream tar shards, group files by key prefix, map to TFDS feature structure."
    },
    {
      "sourceFormat": "CSV / JSON",
      "toolOrLibrary": "tfds.builder_from_directory",
      "complexity": "trivial",
      "notes": "Simple tabular data with file references can be loaded directly."
    },
    {
      "sourceFormat": "LeRobot (Parquet + MP4)",
      "toolOrLibrary": "Custom TFDS builder",
      "complexity": "moderate",
      "notes": "Read Parquet metadata, decode MP4 video frames, yield as TFDS episodes following RLDS structure."
    },
    {
      "sourceFormat": "ROS bag",
      "toolOrLibrary": "TFDS builder + rosbags",
      "complexity": "complex",
      "notes": "Deserialize ROS messages, synchronize topics, segment into episodes, yield as TFDS examples."
    },
    {
      "sourceFormat": "Raw files (images + labels)",
      "toolOrLibrary": "TFDS builder + custom loader",
      "complexity": "moderate",
      "notes": "Define features matching file types, implement _generate_examples to read and yield pairs."
    }
  ],
  "keyPapers": [
    {
      "id": "tfds-2019",
      "title": "TensorFlow Datasets: A Collection of Ready-to-Use Datasets",
      "authors": "TensorFlow Team",
      "venue": "TensorFlow Documentation",
      "year": 2019,
      "url": "https://www.tensorflow.org/datasets"
    },
    {
      "id": "ramos-rlds-2021",
      "title": "RLDS: an Ecosystem to Generate, Share and Use RL Datasets",
      "authors": "Ramos et al.",
      "venue": "NeurIPS 2021 (Datasets & Benchmarks)",
      "year": 2021,
      "url": "https://arxiv.org/abs/2111.02767"
    },
    {
      "id": "open-x-2023",
      "title": "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      "authors": "Open X-Embodiment Collaboration",
      "venue": "ICRA 2024",
      "year": 2023,
      "url": "https://arxiv.org/abs/2310.08864"
    },
    {
      "id": "team-octo-2024",
      "title": "Octo: An Open-Source Generalist Robot Policy",
      "authors": "Octo Model Team",
      "venue": "RSS 2024",
      "year": 2024,
      "url": "https://arxiv.org/abs/2405.12213"
    },
    {
      "id": "brohan-rt1-2023",
      "title": "RT-1: Robotics Transformer for Real-World Control at Scale",
      "authors": "Brohan et al.",
      "venue": "RSS 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2212.06817"
    }
  ],
  "claruDelivery": "Claru provides custom TFDS DatasetBuilder code alongside data, enabling one-line loading via tfds.load('claru_your_dataset'). Builders include properly typed feature connectors, split configurations, comprehensive documentation, and RLDS compatibility for the Open X-Embodiment ecosystem. Every delivery includes a verification script and optional PyTorch-compatible wrappers."
};

export default data;
