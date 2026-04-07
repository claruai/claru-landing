import type { FormatPageData } from "./types";

const data: FormatPageData = {
  "slug": "rlds",
  "metaTitle": "RLDS (Reinforcement Learning Datasets) for Robotics Data | Claru",
  "metaDescription": "RLDS (Reinforcement Learning Datasets) is Google DeepMind's standard format for robotics datasets. Understand its schema, which models use it, and how Claru delivers data in RLDS format.",
  "primaryKeyword": "RLDS format robotics",
  "secondaryKeywords": [
    "RLDS format robotics data",
    "RLDS robotics training data",
    "RLDS robotics dataset format",
    "rlds robot data",
    "rlds tensorflow datasets",
    "open x-embodiment format"
  ],
  "canonicalPath": "/formats/rlds",
  "h1": "RLDS (Reinforcement Learning Datasets): Complete Guide for Robotics Data",
  "heroSubtitle": "RLDS (Reinforcement Learning Datasets) is Google DeepMind's standard format for robotics datasets. Understand its schema, which models use it, and how Claru delivers data in RLDS format.",
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
      "label": "RLDS",
      "href": "/formats/rlds"
    }
  ],
  "sections": [
    {
      "type": "prose",
      "heading": "Schema and Structure",
      "paragraphs": [
        "RLDS stores trajectories as sequences of (observation, action, reward, discount, is_terminal) tuples in TensorFlow's tf.data.Dataset format, serialized as TFRecord files. Each episode is a separate entry with nested feature dictionaries for images, proprioceptive state, and action vectors. Metadata is stored in dataset_info.json alongside the TFRecord shards.",
        "The core data model revolves around two nested levels: episodes and steps. Each episode is a tf.data.Dataset of steps, and the full dataset is a tf.data.Dataset of episodes. A step contains an observation dictionary (which can hold images as uint8 tensors, joint positions as float32 arrays, gripper state, and natural language instructions), an action array, a scalar reward, a discount factor, and boolean flags for is_first, is_last, and is_terminal. This two-level nesting distinguishes RLDS from flat dataset formats and makes it natural to express the sequential structure of robot demonstrations.",
        "Feature connectors in the dataset_info.json file define the dtype, shape, and encoding for every field. Images can be stored as raw tensors or JPEG/PNG-compressed bytes with a tfds.features.Image connector that handles decoding transparently. The dataset builder pattern means that adding a new dataset to the RLDS ecosystem requires implementing a single Python class with a _generate_examples method, and the TFDS infrastructure handles sharding, checksumming, and version management automatically."
      ]
    },
    {
      "type": "cards",
      "heading": "Frameworks and Models Using RLDS",
      "cards": [
        {
          "title": "RT-X / Open X-Embodiment",
          "description": "Google DeepMind's cross-embodiment models (RT-1, RT-2, RT-X) use RLDS as their primary training format."
        },
        {
          "title": "Octo",
          "description": "The Octo generalist robot policy was trained on RLDS-formatted Open X-Embodiment data."
        },
        {
          "title": "TensorFlow Datasets (TFDS)",
          "description": "RLDS is built on top of TFDS, making it natively loadable via tfds.load() with full pipeline support."
        },
        {
          "title": "OpenVLA",
          "description": "The open-source Vision-Language-Action model fine-tunes on RLDS datasets from the Open X-Embodiment collection."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Reading and Writing RLDS Data in Python",
      "paragraphs": [
        "Loading an RLDS dataset requires just two lines: call tfds.load('your_dataset') to get a tf.data.Dataset of episodes, then iterate over episodes and their steps. For example, `dataset = tfds.load('bridge_dataset', split='train')` returns the full BridgeData V2 collection in RLDS format. Each episode is accessed via `for episode in dataset: for step in episode['steps']:`, where step['observation']['image'] yields a decoded image tensor and step['action'] yields the 7-DoF action vector.",
        "Writing a new RLDS dataset involves creating a TFDS DatasetBuilder subclass. You define a features dictionary specifying every field's type and shape, implement _split_generators to point to raw data, and implement _generate_examples to yield (episode_key, episode_data) pairs. The envlogger library from Google DeepMind can also record RLDS datasets directly from a Gym environment by wrapping the environment with envlogger.DMEnvLogger, which writes episodes to disk in real-time as TFRecord shards. For teams working outside the TensorFlow ecosystem, the rlds_creator tool provides command-line conversion from common formats, and the fog_x library offers a format-agnostic abstraction layer over RLDS and other robotics dataset formats."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "When to Use RLDS vs Alternatives",
      "description": "RLDS is the natural choice for teams working within the Google DeepMind ecosystem, but other formats may be better fits depending on your framework and infrastructure.",
      "columns": [
        "Format",
        "Best For",
        "Episode Structure",
        "Cloud Native",
        "PyTorch Support"
      ],
      "rows": [
        {
          "Format": "RLDS",
          "Best For": "Open X-Embodiment, RT-X, Octo",
          "Episode Structure": "Native two-level nesting",
          "Cloud Native": "GCS via TFDS",
          "PyTorch Support": "Via dlimp bridge"
        },
        {
          "Format": "HDF5",
          "Best For": "robomimic, ManiSkill, D4RL",
          "Episode Structure": "Group hierarchy",
          "Cloud Native": "No (local files)",
          "PyTorch Support": "Native via h5py"
        },
        {
          "Format": "LeRobot",
          "Best For": "ACT, Diffusion Policy, HF Hub",
          "Episode Structure": "Parquet + MP4",
          "Cloud Native": "HF Hub streaming",
          "PyTorch Support": "Native"
        },
        {
          "Format": "WebDataset",
          "Best For": "Large-scale distributed training",
          "Episode Structure": "Flat samples in tar",
          "Cloud Native": "S3/HTTP streaming",
          "PyTorch Support": "Native"
        },
        {
          "Format": "Zarr",
          "Best For": "Cloud-native array access",
          "Episode Structure": "Group hierarchy",
          "Cloud Native": "S3/GCS direct access",
          "PyTorch Support": "Native via zarr-python"
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
          "Tool / Library": "rlds_creator + custom script",
          "Complexity": "moderate",
          "Notes": "Requires mapping HDF5 groups to RLDS episode/step structure."
        },
        {
          "Source Format": "WebDataset",
          "Tool / Library": "Custom Python script",
          "Complexity": "moderate",
          "Notes": "Convert tar shards to TFRecord with feature_connector mapping."
        },
        {
          "Source Format": "Zarr",
          "Tool / Library": "Custom Python script",
          "Complexity": "moderate",
          "Notes": "Map zarr arrays to RLDS step features with chunking alignment."
        },
        {
          "Source Format": "LeRobot (Parquet)",
          "Tool / Library": "Custom Python script",
          "Complexity": "moderate",
          "Notes": "Read Parquet rows and MP4 frames, yield as RLDS episodes."
        },
        {
          "Source Format": "ROS bag",
          "Tool / Library": "rosbag_reader + TFDS builder",
          "Complexity": "complex",
          "Notes": "Synchronize multi-rate topics, segment into episodes, write TFRecords."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Migration Guide: Moving to RLDS",
      "paragraphs": [
        "Migrating an existing robotics dataset to RLDS involves three phases: schema mapping, episode segmentation, and builder implementation. In the schema mapping phase, you define a features dictionary that maps your existing data fields to RLDS conventions. Observations go into a nested dictionary keyed by modality (image, wrist_image, state), actions are a single array matching your robot's action space, and metadata like natural language instructions are stored as tf.string features. The key decision is whether to store images as raw tensors (faster loading, larger files) or JPEG-compressed bytes (smaller files, decode overhead).",
        "Episode segmentation is the second critical step. If your data is already organized by episode (as in HDF5 group-per-episode layouts), this is straightforward. For continuous recordings like ROS bags, you need to define episode boundaries, typically at task completion, failure, or reset events. The Open X-Embodiment data standard recommends including the terminal observation (the observation after the last action) as a final step with is_last=True, which many downstream models rely on for value estimation.",
        "Finally, you implement a TFDS DatasetBuilder. The builder's _info method returns the feature structure, _split_generators defines train/val/test splits, and _generate_examples yields episodes. Running tfds build generates the sharded TFRecords, dataset_info.json, and label metadata. The resulting dataset can be loaded with a single tfds.load() call, and the Open X-Embodiment project maintains a registry of compatible builders at github.com/google-deepmind/open_x_embodiment."
      ]
    },
    {
      "type": "citation-list",
      "heading": "References",
      "citations": [
        {
          "id": "ramos-rlds-2021",
          "title": "RLDS: an Ecosystem to Generate, Share and Use Reinforcement Learning Datasets",
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
          "id": "kim-openvla-2024",
          "title": "OpenVLA: An Open-Source Vision-Language-Action Model",
          "authors": "Kim et al.",
          "venue": "CoRL 2024",
          "year": 2024,
          "url": "https://arxiv.org/abs/2406.09246"
        },
        {
          "id": "brohan-rt2-2023",
          "title": "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
          "authors": "Brohan et al.",
          "venue": "CoRL 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2307.15818"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Claru Data Delivery in RLDS Format",
      "paragraphs": [
        "Claru delivers datasets in RLDS format with standard episode/step structure compatible with the Open X-Embodiment ecosystem. Feature connectors are configured for your specific observation and action spaces, with dataset_info.json metadata and optional TFDS builder code for seamless integration.",
        "Every delivery includes a complete TFDS DatasetBuilder that can be registered in your local TFDS installation, enabling one-line loading with tfds.load('claru_your_dataset'). Image features are JPEG-compressed by default with configurable quality, and proprioceptive states use float32 precision. We validate schema compatibility with RT-X and Octo model expectations so your data is training-ready out of the box. For teams that need PyTorch compatibility, we include a dlimp-compatible wrapper and can additionally deliver the same data in LeRobot or HDF5 format at no extra cost."
      ]
    }
  ],
  "faqs": [
    {
      "question": "Is RLDS compatible with PyTorch training pipelines?",
      "answer": "RLDS is TensorFlow-native, but several community-maintained bridges exist for PyTorch. The dlimp library (github.com/kvablack/dlimp) provides a thin wrapper that converts RLDS datasets into PyTorch-compatible iterators, and it is the same tool used by the Octo model team for their PyTorch experiments. The tensorflow-datasets library also offers a tfds.as_numpy() function that strips TensorFlow tensors to NumPy arrays, which can then be wrapped in a standard PyTorch DataLoader. For teams that want zero TensorFlow dependency, Claru can deliver the same data simultaneously in both RLDS and a PyTorch-native format like HDF5 or LeRobot, ensuring you can use whichever framework fits your training infrastructure."
    },
    {
      "question": "How does RLDS handle multi-camera observations?",
      "answer": "RLDS stores multiple camera feeds as separate named features within each step's observation dictionary. A typical manipulation dataset might include observation/image (overhead camera), observation/wrist_image (wrist-mounted camera), and observation/side_image (side view), each as an independent tensor or JPEG-compressed bytes field. Camera calibration parameters, including intrinsics matrices and extrinsic poses, can be stored as per-step float arrays or as episode-level metadata attributes in the dataset_info.json. The Open X-Embodiment standard defines a conventional naming scheme for camera positions, which Claru follows to ensure compatibility with cross-embodiment models like RT-X and Octo."
    },
    {
      "question": "What is the maximum episode length RLDS supports?",
      "answer": "RLDS has no hard limit on episode length. Episodes of 10,000+ steps are common in manipulation datasets, and locomotion datasets may contain episodes with 100,000+ steps. Performance is managed through TFRecord sharding, where each shard is typically 200-500 MB, and the tf.data pipeline handles prefetching and parallel reads across shards automatically. For very long episodes, the primary concern is memory during dataset generation rather than at training time, since tf.data streams steps lazily. If your episodes are extremely long (millions of steps), consider splitting them into logical sub-episodes at natural breakpoints."
    },
    {
      "question": "How do I add a new dataset to the Open X-Embodiment collection in RLDS format?",
      "answer": "Contributing a dataset to Open X-Embodiment requires implementing a TFDS DatasetBuilder following the RLDS episode/step structure. Start by cloning the tensorflow_datasets repository and creating a new builder class in the robotics/ directory. Your builder must define the observation space (images, proprioceptive state), action space (joint positions, end-effector deltas, or gripper commands), and any language instruction fields. Run tfds build to generate TFRecords locally, then test with the Octo data loader to verify compatibility. The Open X-Embodiment team maintains a contribution guide at github.com/google-deepmind/open_x_embodiment with schema validation tools. Claru automates this entire process and delivers builder code that passes all OXE validation checks."
    },
    {
      "question": "What is the difference between RLDS and standard TFRecords?",
      "answer": "Standard TFRecords are a generic serialization format that can hold any protobuf-serialized data without enforcing structure. RLDS adds a specific semantic layer on top of TFRecords through the TFDS builder system: it mandates the episode-of-steps nesting, requires specific field names (observation, action, reward, discount, is_first, is_last, is_terminal), and uses feature connectors to define typed schemas. This structure means any RLDS-compatible model can load any RLDS dataset without format-specific parsing code. Standard TFRecords require you to know the exact proto schema at read time, while RLDS datasets are self-describing through their dataset_info.json. The tradeoff is that RLDS is more opinionated and requires more setup, but the payoff is interoperability across the entire Open X-Embodiment ecosystem."
    }
  ],
  "ctaHeading": "Get Data in RLDS Format",
  "ctaDescription": "Claru delivers robotics training data in RLDS format, ready to load into your pipeline. Tell us your requirements.",
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
  "schemaDescription": "RLDS stores trajectories as sequences of (observation, action, reward, discount, is_terminal) tuples in TensorFlow's tf.data.Dataset format, serialized as TFRecord files. Each episode is a separate entry with nested feature dictionaries for images, proprioceptive state, and action vectors. Metadata is stored in dataset_info.json alongside the TFRecord shards.",
  "frameworksUsing": [
    {
      "name": "RT-X / Open X-Embodiment",
      "description": "Google DeepMind's cross-embodiment models (RT-1, RT-2, RT-X) use RLDS as their primary training format."
    },
    {
      "name": "Octo",
      "description": "The Octo generalist robot policy was trained on RLDS-formatted Open X-Embodiment data."
    },
    {
      "name": "TensorFlow Datasets (TFDS)",
      "description": "RLDS is built on top of TFDS, making it natively loadable via tfds.load() with full pipeline support."
    },
    {
      "name": "OpenVLA",
      "description": "The open-source Vision-Language-Action model fine-tunes on RLDS datasets from the Open X-Embodiment collection."
    }
  ],
  "conversions": [
    {
      "sourceFormat": "HDF5",
      "toolOrLibrary": "rlds_creator + custom script",
      "complexity": "moderate",
      "notes": "Requires mapping HDF5 groups to RLDS episode/step structure."
    },
    {
      "sourceFormat": "WebDataset",
      "toolOrLibrary": "Custom Python script",
      "complexity": "moderate",
      "notes": "Convert tar shards to TFRecord with feature_connector mapping."
    },
    {
      "sourceFormat": "Zarr",
      "toolOrLibrary": "Custom Python script",
      "complexity": "moderate",
      "notes": "Map zarr arrays to RLDS step features with chunking alignment."
    },
    {
      "sourceFormat": "LeRobot (Parquet)",
      "toolOrLibrary": "Custom Python script",
      "complexity": "moderate",
      "notes": "Read Parquet rows and MP4 frames, yield as RLDS episodes."
    },
    {
      "sourceFormat": "ROS bag",
      "toolOrLibrary": "rosbag_reader + TFDS builder",
      "complexity": "complex",
      "notes": "Synchronize multi-rate topics, segment into episodes, write TFRecords."
    }
  ],
  "keyPapers": [
    {
      "id": "ramos-rlds-2021",
      "title": "RLDS: an Ecosystem to Generate, Share and Use Reinforcement Learning Datasets",
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
      "id": "kim-openvla-2024",
      "title": "OpenVLA: An Open-Source Vision-Language-Action Model",
      "authors": "Kim et al.",
      "venue": "CoRL 2024",
      "year": 2024,
      "url": "https://arxiv.org/abs/2406.09246"
    },
    {
      "id": "brohan-rt2-2023",
      "title": "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      "authors": "Brohan et al.",
      "venue": "CoRL 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2307.15818"
    }
  ],
  "claruDelivery": "Claru delivers datasets in RLDS format with standard episode/step structure compatible with the Open X-Embodiment ecosystem. Feature connectors are configured for your specific observation and action spaces, with dataset_info.json metadata and optional TFDS builder code for seamless integration. Every delivery includes a complete TFDS DatasetBuilder that can be registered in your local TFDS installation, enabling one-line loading with tfds.load()."
};

export default data;
