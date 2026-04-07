import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-convert-data-to-rlds-format",
  metaTitle: "How to Convert Data to RLDS Format (2026 Guide) | Claru",
  metaDescription: "Step-by-step instructions for converting robot demonstration data from HDF5, ROS bags, or custom formats into RLDS using TensorFlow Datasets and Apache Beam.",
  primaryKeyword: "how to convert data to RLDS format",
  secondaryKeywords: ["RLDS conversion guide","convert HDF5 to RLDS","RLDS dataset builder","RLDS format tutorial","tensorflow datasets robotics"],
  canonicalPath: "/guides/how-to-convert-data-to-rlds-format",
  h1: "How to Convert Robot Data to RLDS Format",
  heroSubtitle: "A technical walkthrough for converting robot demonstration data from HDF5, ROS bags, or proprietary formats into the RLDS standard used by Open X-Embodiment, Octo, and RT-X models.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Convert Robot Data to RLDS Format", href: "/guides/how-to-convert-data-to-rlds-format" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why RLDS Is the Standard Format for Robot Foundation Models",
      paragraphs: [
        "RLDS (Reinforcement Learning Datasets) has become the de facto standard for storing and sharing robot learning data. Built on TensorFlow Datasets, it provides a consistent schema for sequential decision-making data — observations, actions, rewards, and episode boundaries — backed by TFRecord storage that supports efficient shuffling, parallel reads, and cloud streaming. Every major robot foundation model (RT-2, Octo, OpenVLA, RT-X) consumes RLDS data natively.",
        "The Open X-Embodiment project catalyzed RLDS adoption by aggregating 22 robot datasets from different labs into a unified RLDS format, demonstrating that cross-embodiment training produces dramatically more capable generalist policies. If your data is not in RLDS format, it cannot participate in this ecosystem. Converting to RLDS is not just a format transformation — it is a prerequisite for leveraging the entire foundation model research stack.",
        "This guide provides a technical walkthrough for converting robot data from HDF5, ROS bags, or proprietary formats into RLDS, covering schema design, DatasetBuilder implementation, distributed builds with Apache Beam, and multi-stage validation."
      ]
    },
    {
      type: "stats",
      heading: "RLDS Format Key Parameters",
      stats: [
        { value: "100MB-1GB", label: "Recommended TFRecord shard size" },
        { value: "16-256", label: "Shard count range (single machine to TPU pod)" },
        { value: "22+", label: "Robot platforms in Open X-Embodiment (all RLDS)" },
        { value: "800K+", label: "Episodes in the RT-X training mixture" },
        { value: "< 1e-6", label: "Tolerable round-trip numerical error" },
        { value: "PNG", label: "Recommended image encoding (lossless)" }
      ]
    },
    {
      type: "pipeline",
      heading: "RLDS Conversion Pipeline",
      steps: [
        { stepNumber: 1, title: "Audit Source Data", description: "Document all fields, dtypes, shapes, and units in your source format. Create a source-to-RLDS mapping table." },
        { stepNumber: 2, title: "Define RLDS Schema", description: "Build the features_dict matching your observation-action contract. Test with builder.info.features before any data processing." },
        { stepNumber: 3, title: "Implement Episode Extraction", description: "Write format-specific readers (h5py for HDF5, rosbags for ROS) that yield Python dicts matching the schema. Normalize units at this stage." },
        { stepNumber: 4, title: "Build Dataset", description: "Wire up split generation and run tfds build. Use Apache Beam for datasets > 50K episodes. Verify shard count and total size." },
        { stepNumber: 5, title: "Validate End-to-End", description: "Load via tfds.load, compare statistics against source data, render visual validation videos, and run a model forward pass." }
      ]
    },
    {
      type: "cards",
      heading: "Common RLDS Conversion Bugs",
      cards: [
        {
          title: "Quaternion Convention Mismatch",
          description: "Some systems use [qw,qx,qy,qz], others [qx,qy,qz,qw]. A silent convention mismatch produces actions that rotate in wrong directions. Always verify against a known motion."
        },
        {
          title: "Action Coordinate Frame Confusion",
          description: "Delta EE actions can be in base frame, EE frame, or world frame. The wrong frame produces correct-looking numbers but nonsensical robot behavior. Cross-reference the model's expectation."
        },
        {
          title: "Off-by-One Episode Boundaries",
          description: "is_first and is_last flags must be set correctly. An off-by-one error means the first observation of each episode is actually the last from the previous episode — corrupting every episode pair."
        },
        {
          title: "JPEG Compression on Depth Maps",
          description: "JPEG encoding destroys depth precision through lossy compression. Always use PNG encoding for depth data. RGB images can use JPEG if storage is a concern."
        }
      ]
    },
    {
      type: "prose",
      heading: "RLDS Best Practices from the Open X-Embodiment Project",
      paragraphs: [
        "The Open X-Embodiment project, which aggregated 22 robot datasets into a unified RLDS training mixture, revealed several best practices for RLDS dataset creation that are not documented in the RLDS library itself. These lessons come from the practical experience of standardizing datasets from different labs with different conventions.",
        "First, use the standardized observation and action key names from the RT-X dataset spec: image (primary RGB), wrist_image (wrist-mounted camera), state (proprioceptive state), and the action tensor should be exactly 7 dimensions for single-arm manipulation (6-DoF EE delta + 1 gripper). If your robot has a different DOF count, pad or project to this standard to enable cross-embodiment training. Second, include a natural_language_instruction field in every step (not just episode metadata) because some models read the instruction at every timestep.",
        "Third, handle episode padding correctly. Different RLDS consumers handle variable-length episodes differently. Octo uses a fixed context window of 2-4 frames and discards shorter episodes. RT-2 processes full episodes. If your episodes are very short (under 10 steps), either merge consecutive short episodes or pad them with repeated final observations and zero actions. If your episodes are very long (over 1,000 steps), consider chunking them at natural task boundaries.",
        "Fourth, include a dataset_statistics.json file alongside the TFRecord shards containing per-feature min, max, mean, and standard deviation computed on the training split. Both Octo and OpenVLA read this file during training to automatically configure normalization. Without it, users must compute statistics themselves, which is error-prone and wastes GPU time on a data pass."
      ]
    }
  ],
  faqs: [
    {
      question: "What exactly is RLDS and why does it matter for robot learning?",
      answer: "RLDS (Reinforcement Learning Datasets) is a data specification and library built on top of TensorFlow Datasets (TFDS) that standardizes how sequential decision-making data is stored and loaded. Developed by Google DeepMind, it represents episodes as sequences of steps where each step contains an observation dict, an action, a reward, and a discount factor. The key advantage of RLDS is interoperability: datasets published in RLDS format work out-of-the-box with the Open X-Embodiment ecosystem, Octo, RT-2, and other foundation models. The underlying storage uses TFRecord shards, which support efficient shuffling, parallel reads, and streaming from cloud storage without downloading entire datasets. RLDS also enforces a consistent metadata schema via TFDS dataset_info, making it possible to programmatically discover what observation modalities and action spaces a dataset contains."
    },
    {
      question: "Can I convert ROS bag files directly to RLDS?",
      answer: "There is no single-command converter from ROS bags to RLDS, but the process is straightforward with an intermediate step. First, extract the ROS bag into a Python-native format using rosbags (a pure-Python ROS bag reader that handles both ROS1 and ROS2 bag formats without needing a ROS installation). Use rosbags to deserialize each topic into NumPy arrays, synchronize messages across topics using timestamp-based alignment with a configurable slop tolerance (typically 10-33 ms depending on your sensor rates), and write synchronized episodes to HDF5 or pickle files. Then implement a TFDS DatasetBuilder that reads these intermediate files and emits RLDS-structured examples. The rosbags library is installed via pip install rosbags and supports CompressedImage, JointState, PoseStamped, WrenchStamped, and all standard message types. For large bag files (>10 GB), process them in streaming mode to avoid memory issues."
    },
    {
      question: "How do I handle variable-length episodes in RLDS?",
      answer: "RLDS and TFDS handle variable-length episodes natively through TFRecord's protocol buffer serialization. Each episode is stored as a separate SequenceExample, and episodes within a dataset can have different numbers of steps. When you define your features_dict in the DatasetBuilder, use tfds.features.Dataset for the steps feature — this tells TFDS to treat it as a variable-length sequence. During training, you typically use tf.data windowing to create fixed-length subsequences: dataset.flat_map(lambda ep: ep['steps'].batch(window_size)) or pad shorter episodes to a fixed length with tf.data.padded_batch. Octo and RT-X both use windowed loading with a context length of 2-6 frames. If your episodes vary dramatically in length (e.g., 10 steps to 10,000 steps), consider splitting very long episodes into chunks at natural task boundaries to keep TFRecord shard sizes manageable."
    },
    {
      question: "What is the recommended shard size and count for RLDS datasets?",
      answer: "TFRecord shard sizing directly affects I/O performance during training. The TFDS documentation recommends shards between 100 MB and 1 GB each. For robot datasets with image observations, a common configuration is 256 episodes per shard for 256x256 RGB-only data, or 64-128 episodes per shard if you include depth maps. Aim for a total shard count that enables good parallelism during reading — at least 16 shards for single-machine training, and 64-256 shards if you plan to train on a TPU pod or multi-GPU cluster. You configure sharding in your DatasetBuilder by overriding _split_generators and setting num_shards in the SplitGenerator. For datasets over 1 TB, use Apache Beam as the TFDS pipeline runner to distribute shard writing across a Dataflow cluster. Test your I/O throughput by benchmarking tf.data.TFRecordDataset read speed and ensure you can saturate your accelerator's training throughput."
    },
    {
      question: "How do I validate that my RLDS conversion is correct?",
      answer: "Run a three-stage validation pipeline after conversion. First, structural validation: load the dataset with tfds.load and verify the feature spec matches your DatasetBuilder definition — check observation tensor shapes, dtypes, and value ranges. Second, statistical validation: sample 100 episodes and compute per-feature statistics (mean, std, min, max) for actions and observations. Compare these against statistics from your source data to catch normalization bugs, axis permutation errors, or unit conversion mistakes (e.g., joint positions in degrees vs. radians). Third, visual validation: render 10 random episodes as video (using matplotlib animation or imageio) with the action trajectory overlaid as arrows on the image frames. This catches subtle issues like camera stream swaps, temporal misalignment between observations and actions, or flipped depth maps. Publish the validation report as a Jupyter notebook alongside the dataset. The RLDS tools repository includes rlds.transformations.inspect that prints dataset statistics and samples."
    }
  ],
  ctaHeading: "Need RLDS Conversion Help?",
  ctaDescription: "Claru converts robot datasets to RLDS, HDF5, Zarr, or any target format. We handle the full pipeline from raw sensor logs to training-ready data.",
  relatedGlossaryTerms: ["rlds","open-x-embodiment","cross-embodiment-data","vla"],
  relatedGuidePages: ["how-to-build-a-cross-embodiment-dataset","how-to-create-a-robot-demonstration-dataset"],
  relatedSolutionSlugs: ["vla-training-data"],
  difficulty: "intermediate",
  estimatedTime: "2-5 days",
  prerequisites: ["Source dataset in HDF5, ROS bag, or custom format","Python 3.9+ with TensorFlow 2.15+","tensorflow-datasets >= 4.9.0 installed","Familiarity with TFRecord and protocol buffer concepts"],
  tools: ["TensorFlow Datasets","RLDS","Python","Apache Beam","h5py","rosbags","NumPy"],
  steps: [
    {
      stepNumber: 1,
      title: "Audit Your Source Data and Define the Target Schema",
      description: "Before writing any conversion code, thoroughly document what your source data contains and what the target RLDS schema should look like. Open your source files (HDF5 with h5py, ROS bags with rosbags, custom formats with their respective readers) and enumerate every field: image shapes and dtypes, joint state dimensions, action representations, timestamps, and metadata. Create a mapping table with three columns: source field name, source dtype/shape, and target RLDS feature name with its tfds.features type.\n\nFor the RLDS schema, the top-level structure is always: steps (a Dataset of individual timesteps), each containing observation (a FeaturesDict), action (a Tensor or FeaturesDict), reward (float32, optional for imitation learning), is_first (bool), is_last (bool), and is_terminal (bool). The observation dict typically includes image (tfds.features.Image with shape and encoding), state (Tensor for proprioception), and optionally depth, language_instruction (tfds.features.Text), and any task-specific fields. Define your action space precisely: for a 7-DoF arm with gripper, this is typically a Tensor of shape (7,) for delta joint positions plus (1,) for gripper, or (7,) for absolute end-effector pose [x,y,z,qx,qy,qz,qw] plus (1,) for gripper width. Getting the action representation wrong is the most common source of training failures after RLDS conversion, because models are extremely sensitive to the action coordinate frame and units.",
      tools: ["h5py", "rosbags", "Python REPL"],
      tips: ["Cross-reference your target model's expected input spec against your RLDS schema before writing any code — mismatches are expensive to debug downstream"]
    },
    {
      stepNumber: 2,
      title: "Set Up the TFDS DatasetBuilder Scaffold",
      description: "Create a new Python package for your RLDS dataset following the TFDS convention. Use the tfds CLI to scaffold the project: run tfds new my_robot_dataset, which creates a directory with __init__.py, my_robot_dataset_dataset_builder.py, and metadata files. The core of the conversion lives in the DatasetBuilder class, which extends tfds.core.GeneratorBasedBuilder. Override three methods: _info() to define the features schema, _split_generators() to map file paths to train/val/test splits, and _generate_examples() to yield individual episodes.\n\nIn _info(), construct the tfds.core.DatasetInfo with a features dict matching the schema you defined in Step 1. A typical robotics features dict looks like: tfds.features.FeaturesDict({'steps': tfds.features.Dataset({'observation': tfds.features.FeaturesDict({'image': tfds.features.Image(shape=(256, 256, 3), dtype=tf.uint8, encoding_format='png'), 'wrist_image': tfds.features.Image(shape=(256, 256, 3), dtype=tf.uint8, encoding_format='png'), 'state': tfds.features.Tensor(shape=(7,), dtype=tf.float32)}), 'action': tfds.features.Tensor(shape=(8,), dtype=tf.float32), 'reward': tf.float32, 'is_first': tf.bool, 'is_last': tf.bool, 'is_terminal': tf.bool, 'language_instruction': tfds.features.Text()})}). For image encoding, use encoding_format='png' for lossless storage or 'jpeg' if storage size is a concern (JPEG introduces artifacts in depth maps, so only use it for RGB). Set the homepage URL, citation BibTeX, and description fields in _info() as well — these become the dataset documentation that other researchers see when they discover your dataset.",
      tools: ["tensorflow-datasets CLI", "Python", "tfds.core.GeneratorBasedBuilder"],
      tips: ["Test your _info() method independently by instantiating the builder and calling builder.info.features — this validates the schema without requiring any data"]
    },
    {
      stepNumber: 3,
      title: "Implement Episode Extraction from Source Format",
      description: "Write the data extraction logic that reads your source format and yields Python dictionaries matching the RLDS schema. This is the most format-specific step and varies significantly depending on whether your source is HDF5 (robomimic convention), ROS bags, Zarr, or a custom binary format.\n\nFor HDF5 files following the robomimic convention: each HDF5 file contains one or more episodes under a data/ group, with datasets like data/obs/agentview_image, data/obs/robot0_eef_pos, data/actions, and data/rewards. Use h5py to iterate over episodes: for each demo in the file, extract the observation arrays, actions, and rewards, then construct a step dict for each timestep. Handle image encoding by compressing raw uint8 arrays to PNG bytes using cv2.imencode('.png', frame)[1].tobytes() — TFDS Image features expect either file paths or raw bytes. For ROS bags: use the rosbags library to open the bag, create a Reader, iterate over connections filtered by topic name, deserialize each message, and align messages across topics by timestamp. A common pattern is to build a per-topic buffer using collections.defaultdict(list), then merge buffers using numpy.searchsorted on the timestamp arrays to find nearest-neighbor correspondences. Set a maximum timestamp gap threshold (e.g., 33 ms for 30 Hz data) and drop any observation where a required topic has no message within that window.\n\nRegardless of source format, normalize all data to consistent units at this stage: joint positions in radians, end-effector positions in meters, quaternions in [qx,qy,qz,qw] convention (not [qw,qx,qy,qz] — this is a common source of bugs), and images in uint8 [0, 255]. Set the is_first flag to True for the first step, is_last to True for the final step, and is_terminal to True only if the episode ended due to a terminal condition (not timeout).",
      tools: ["h5py", "rosbags", "cv2", "NumPy"],
      tips: ["Write a standalone extraction script that processes a single episode and prints its structure before integrating with the TFDS builder — this makes debugging much faster"]
    },
    {
      stepNumber: 4,
      title: "Wire Up Split Generation and Build the Dataset",
      description: "Implement _split_generators() to partition your source files into train, validation, and test splits. If your source data is already split, map the file paths directly. If not, implement a deterministic split: sort all episode file paths alphabetically, hash each path with hashlib.md5, and assign to splits based on the hash modulus (e.g., hash % 10 < 8 for train, 8 for val, 9 for test). This approach is reproducible and avoids information leakage from temporal adjacency.\n\nImplement _generate_examples() as a generator function that takes a file path iterator and yields (key, episode_dict) tuples. The key must be a unique string identifier for each episode — typically the filename or a hash. The episode_dict must match the schema from _info() exactly. Then build the dataset by running: cd my_robot_dataset && tfds build --data_dir=/path/to/output. For small datasets (under 50,000 episodes), the default single-machine builder works fine. For large datasets, pass --beam_pipeline_options to use Apache Beam with a distributed runner. On Google Cloud, configure Dataflow: tfds build --data_dir=gs://bucket/datasets --beam_pipeline_options=\"--runner=DataflowRunner,--project=my-project,--temp_location=gs://bucket/tmp,--num_workers=16\". This distributes shard writing across 16 workers and can process millions of episodes in hours instead of days.\n\nAfter the build completes, verify the output: check that the expected number of TFRecord shards exist, that dataset_info.json contains the correct feature spec and split sizes, and that the total file size is reasonable. A dataset of 10,000 episodes with 256x256 RGB images at 100 timesteps per episode typically produces 50-100 GB of TFRecord data.",
      tools: ["tensorflow-datasets", "Apache Beam", "hashlib", "Google Cloud Dataflow (optional)"],
      tips: ["Always set a random seed in your split generation for reproducibility", "Run a small test build with --max_examples_per_split=10 to validate the pipeline before processing the full dataset"]
    },
    {
      stepNumber: 5,
      title: "Validate the Converted Dataset End-to-End",
      description: "Run comprehensive validation to ensure the RLDS dataset is correct and training-ready. Start by loading the dataset through the standard TFDS interface: ds = tfds.load('my_robot_dataset', data_dir='/path/to/output', split='train'). Iterate over 10 episodes and verify: observation image shapes match the spec, action tensor shapes and dtypes are correct, is_first is True only for the first step, is_last is True only for the final step, and no NaN or Inf values appear in any numeric feature.\n\nNext, run a statistical comparison between source and converted data. For 100 randomly sampled episodes, load the same episodes from both the original format and the RLDS format, then assert numerical equality: np.allclose(source_actions, rlds_actions, atol=1e-6) for float features, and np.array_equal(source_images, rlds_images) for images. This catches conversion bugs like axis transpositions, incorrect normalization, or off-by-one errors in episode boundaries. For images, also verify that PNG encoding round-trips losslessly by comparing decoded pixel values against the originals.\n\nFinally, run a visual validation: render 10 episodes as MP4 videos using imageio, overlaying the action trajectory as colored arrows on each frame. For manipulation tasks, project the end-effector target position into image coordinates using the camera intrinsics and extrinsics, and draw a circle at the projected point. This visual check catches the most insidious bugs: action coordinate frame mismatches, camera-to-base transform errors, and temporal misalignment between observations and actions. Save these validation videos and statistics as a Jupyter notebook that ships alongside the dataset.",
      tools: ["tfds.load", "NumPy", "imageio", "matplotlib", "Jupyter"],
      tips: ["Compare the action distribution histograms between source and converted datasets — any distribution shift indicates a conversion bug"]
    },
    {
      stepNumber: 6,
      title: "Register, Document, and Distribute the Dataset",
      description: "Make your RLDS dataset discoverable and usable by others. Register it with TFDS by adding your DatasetBuilder package to the TFDS namespace: create a setup.py with the tfds.core entry point so that tfds.load('my_robot_dataset') works after pip install. Alternatively, for private datasets, use the builder_cls parameter: tfds.load(builder=MyRobotDatasetBuilder, data_dir='/path'). Write a comprehensive dataset card following the Google dataset card template that includes: dataset description and intended use, data collection methodology (link to the collection protocol), observation and action space specifications with units, known limitations and biases, license and citation information, and example code for loading and visualizing the data.\n\nFor distribution, the most common options are: hosting TFRecord files on Google Cloud Storage (GCS) with public read access (cheapest for TFDS-native loading), uploading to Hugging Face Datasets Hub using huggingface-cli upload (widest discoverability), or distributing as a versioned artifact on your organization's internal artifact store. If hosting on GCS, configure the download URL in your DatasetBuilder so that tfds.load automatically downloads from your bucket. For Hugging Face, convert the TFRecord files to Parquet using the datasets library's from_tf_record method, though be aware that this loses some RLDS-specific metadata.\n\nVersion your dataset using semantic versioning in the DatasetBuilder (self.VERSION = tfds.core.Version('1.0.0')). Increment the minor version for additive changes (new episodes, additional features) and the major version for breaking changes (different action space, removed features). Always keep the previous version accessible to enable reproducibility of published results.",
      tools: ["tensorflow-datasets", "Hugging Face Hub CLI", "Google Cloud Storage", "setuptools"],
      tips: ["Include a minimal training script in your dataset package that loads 1 batch and runs 1 gradient step — this proves the data pipeline works end-to-end with a real model"]
    }
  ],
  keyPapers: [
    {
      id: "ramos-rlds-2021",
      title: "RLDS: An Ecosystem to Generate, Share, and Use Datasets in Reinforcement Learning",
      authors: "Ramos et al.",
      venue: "arXiv 2111.02767",
      year: 2021,
      url: "https://arxiv.org/abs/2111.02767"
    },
    {
      id: "open-x-embodiment-2024",
      title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Open X-Embodiment Collaboration",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864"
    },
    {
      id: "team-octo-2024",
      title: "Octo: An Open-Source Generalist Robot Policy",
      authors: "Octo Model Team",
      venue: "RSS 2024",
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
    }
  ],
  claruRelevance: "Claru has converted hundreds of robot datasets to RLDS format for teams training on Open X-Embodiment, Octo, and custom VLA architectures. We handle the full conversion pipeline — source format auditing, schema design, DatasetBuilder implementation, Apache Beam distributed builds, and multi-stage validation — delivering training-ready RLDS datasets with comprehensive documentation and loading scripts.",
};

export default data;
