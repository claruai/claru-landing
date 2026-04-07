import type { FormatPageData } from "./types";

const data: FormatPageData = {
  "slug": "ros-bag",
  "metaTitle": "ROS Bag for Robotics Data | Claru",
  "metaDescription": "ROS bags record timestamped sensor data from Robot Operating System. Learn the ROS 1/2 bag formats and how Claru converts between ROS and ML formats.",
  "primaryKeyword": "ROS bag format robotics",
  "secondaryKeywords": [
    "ROS bag format robotics data",
    "ROS bag robotics training data",
    "ROS bag robotics dataset format",
    "ros-bag robot data",
    "rosbag2 mcap",
    "ros bag to hdf5 conversion"
  ],
  "canonicalPath": "/formats/ros-bag",
  "h1": "ROS Bag: Complete Guide for Robotics Data",
  "heroSubtitle": "ROS bags record timestamped sensor data from Robot Operating System. Learn the ROS 1/2 bag formats and how Claru converts between ROS and ML formats.",
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
      "label": "ROS Bag",
      "href": "/formats/ros-bag"
    }
  ],
  "sections": [
    {
      "type": "prose",
      "heading": "Schema and Structure",
      "paragraphs": [
        "ROS 1 bags (.bag) use a custom binary format storing serialized messages with timestamps and topic names. ROS 2 bags (.db3) use SQLite3 databases with a messages table. Both store arbitrary ROS message types: sensor_msgs/Image, sensor_msgs/JointState, geometry_msgs/Pose, etc. MCAP is the emerging successor format for ROS 2.",
        "A ROS bag is fundamentally a time-ordered log of publish-subscribe messages. Each message has a timestamp, a topic name (e.g., /camera/rgb/image_raw, /joint_states, /wrench), and a serialized payload matching a ROS message definition (.msg file). ROS 1 bags use a custom binary container with an index section at the end for fast topic-based seeking. ROS 2 bags default to SQLite3 (.db3 files) with a schema table mapping topic IDs to message types and a messages table storing serialized payloads with timestamps. Since ROS 2 Humble, MCAP has become the recommended storage backend due to better random access performance and smaller file sizes.",
        "The critical challenge with ROS bags for ML training is multi-rate sensor synchronization. A typical robot publishes camera images at 30 Hz, joint states at 100 Hz, and force/torque readings at 1000 Hz. These streams are not synchronized at the hardware level, so converting a bag to a structured dataset requires choosing a reference clock (usually the camera timestamps) and interpolating or nearest-neighbor matching all other streams to that clock. Message types are defined by .msg files which specify field names and types, and the rosbag library handles deserialization automatically."
      ]
    },
    {
      "type": "cards",
      "heading": "Frameworks and Models Using ROS Bag",
      "cards": [
        {
          "title": "ROS/ROS 2",
          "description": "Native recording and playback in the Robot Operating System via rosbag record and ros2 bag."
        },
        {
          "title": "Foxglove Studio",
          "description": "Visualization and debugging tool that natively reads ROS bags and MCAP files."
        },
        {
          "title": "rosbag2",
          "description": "ROS 2 bag recording with pluggable storage backends (SQLite, MCAP)."
        },
        {
          "title": "ROS Bridge / rosbridge_suite",
          "description": "WebSocket bridge enabling non-ROS systems to subscribe to ROS topics for data collection."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Reading and Converting ROS Bags in Python",
      "paragraphs": [
        "For ROS 1 bags, the rosbag Python package provides the standard interface. Open a bag with bag = rosbag.Bag('data.bag'), then iterate with for topic, msg, t in bag.read_messages(topics=['/camera/rgb/image_raw', '/joint_states']). Image messages (sensor_msgs/Image) can be converted to NumPy arrays using the cv_bridge package: bridge.imgmsg_to_cv2(msg, 'bgr8'). Joint states arrive as sensor_msgs/JointState with .position, .velocity, and .effort arrays. For ROS 2 bags, the rosbag2_py library or the mcap Python package (if stored as MCAP) provides equivalent functionality.",
        "Converting a ROS bag to an ML-ready format involves four steps: topic selection (choose which sensor streams to include), time synchronization (align all streams to a common clock), episode segmentation (split continuous recording into task-bounded episodes), and format writing (output to HDF5, RLDS, or WebDataset). The most reliable synchronization approach is approximate time synchronization using the message_filters.ApproximateTimeSynchronizer from ROS, which buffers messages from multiple topics and emits synchronized tuples when timestamps are within a configurable tolerance (typically 30-50ms for camera-joint alignment). For post-hoc conversion without ROS installed, the rosbags library (pip install rosbags) provides a pure-Python reader that works without a ROS installation."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "When to Use ROS Bag vs Alternatives",
      "description": "ROS bags are the natural format during data collection on ROS-based robots, but should be converted to ML-optimized formats before training.",
      "columns": [
        "Format",
        "Best For",
        "Collection",
        "ML Training",
        "Visualization"
      ],
      "rows": [
        {
          "Format": "ROS Bag",
          "Best For": "Live robot recording",
          "Collection": "Excellent (native ROS)",
          "ML Training": "Poor (sequential, needs sync)",
          "Visualization": "Foxglove, RViz, rqt_bag"
        },
        {
          "Format": "MCAP",
          "Best For": "Modern ROS 2 recording",
          "Collection": "Excellent (ROS 2 Humble+)",
          "ML Training": "Poor (still needs conversion)",
          "Visualization": "Foxglove native"
        },
        {
          "Format": "HDF5",
          "Best For": "Post-conversion training",
          "Collection": "Custom scripts needed",
          "ML Training": "Excellent (random access)",
          "Visualization": "HDFView, custom Python"
        },
        {
          "Format": "RLDS",
          "Best For": "Open X-Embodiment ecosystem",
          "Collection": "envlogger wrapper",
          "ML Training": "Excellent (tf.data pipeline)",
          "Visualization": "Custom TF pipelines"
        },
        {
          "Format": "LeRobot",
          "Best For": "HuggingFace ecosystem",
          "Collection": "LeRobot record API",
          "ML Training": "Excellent (PyTorch native)",
          "Visualization": "Built-in visualizer"
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
          "Source Format": "ROS bag to HDF5",
          "Tool / Library": "rosbag + cv_bridge + h5py",
          "Complexity": "moderate",
          "Notes": "Extract topics by timestamp, synchronize streams, write to HDF5 episodes."
        },
        {
          "Source Format": "ROS bag to RLDS",
          "Tool / Library": "rosbag + TFDS builder",
          "Complexity": "complex",
          "Notes": "Synchronize multi-rate topics, segment episodes, write TFRecords."
        },
        {
          "Source Format": "ROS bag to WebDataset",
          "Tool / Library": "rosbag + webdataset",
          "Complexity": "moderate",
          "Notes": "Extract synchronized frames, write to tar shards."
        },
        {
          "Source Format": "ROS bag to MCAP",
          "Tool / Library": "mcap CLI or rosbag2_mcap",
          "Complexity": "trivial",
          "Notes": "Direct container conversion preserving all messages."
        },
        {
          "Source Format": "ROS bag to LeRobot",
          "Tool / Library": "rosbag + lerobot",
          "Complexity": "complex",
          "Notes": "Synchronize topics, encode images as MP4, write Parquet metadata."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Migration Guide: ROS Bag to ML-Ready Format",
      "paragraphs": [
        "The ROS bag to ML-ready format conversion is the single most common data engineering task in robotics ML. The process begins with bag inspection: use rosbag info data.bag (ROS 1) or ros2 bag info data/ (ROS 2) to list all topics, their message types, message counts, and time ranges. Identify your observation topics (cameras, joint states, force/torque), action topics (joint commands, end-effector velocities), and metadata topics (task labels, episode markers). For multi-bag collections from fleet operations, write a manifest CSV mapping bag paths to metadata (robot ID, task type, collection date).",
        "Time synchronization is the hardest part of the conversion. The gold standard is hardware-triggered synchronization where all sensors share a common trigger signal, but most research setups use software timestamps with 10-50ms jitter. For post-hoc synchronization, implement a SyncBuffer class that queues incoming messages per topic and emits synchronized tuples when all topics have messages within a tolerance window. For camera-joint alignment at 30 Hz camera rate, 33ms tolerance works well. Interpolate proprioceptive signals (joint positions, velocities) to camera timestamps rather than nearest-neighbor matching, since joint states typically arrive at higher rates (100-1000 Hz).",
        "Episode segmentation can be done manually (annotating start/end times in a CSV), automatically (detecting gripper open/close events, task completion signals, or velocity-to-zero transitions), or by recording explicit markers during collection (publishing to a /episode_marker topic). After segmentation, write each episode to your target format. Claru's conversion pipeline handles all of these steps, accepting raw bag files from your robot fleet and delivering synchronized, segmented, ML-ready datasets in your format of choice."
      ]
    },
    {
      "type": "citation-list",
      "heading": "References",
      "citations": [
        {
          "id": "quigley-ros-2009",
          "title": "ROS: an Open-Source Robot Operating System",
          "authors": "Quigley et al.",
          "venue": "ICRA 2009 Workshop",
          "year": 2009,
          "url": "https://www.willowgarage.com/sites/default/files/icraoss09-ROS.pdf"
        },
        {
          "id": "macenski-ros2-2022",
          "title": "Robot Operating System 2: Design, Architecture, and Uses In The Wild",
          "authors": "Macenski et al.",
          "venue": "Science Robotics 2022",
          "year": 2022,
          "url": "https://arxiv.org/abs/2211.07752"
        },
        {
          "id": "foxglove-mcap-2023",
          "title": "MCAP: A Modular Container Format for Pub/Sub Messages",
          "authors": "Foxglove Technologies",
          "venue": "Open Source Specification",
          "year": 2023,
          "url": "https://mcap.dev/spec"
        },
        {
          "id": "erickson-rosbags-2023",
          "title": "rosbags: A Pure Python Library for Reading and Writing ROS Bag Files",
          "authors": "Ternaris GmbH",
          "venue": "Open Source Library",
          "year": 2023,
          "url": "https://gitlab.com/ternaris/rosbags"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Claru Data Delivery in ROS Bag Format",
      "paragraphs": [
        "Claru accepts ROS bag uploads from your robot fleet and converts them to ML-ready formats (RLDS, HDF5, WebDataset, LeRobot). Our pipeline handles topic synchronization, image decompression, and timestamp alignment across multi-rate sensor streams.",
        "The Claru conversion pipeline supports both ROS 1 bags (.bag) and ROS 2 bags (.db3, .mcap) without requiring a ROS installation. We automatically detect message types, identify camera and proprioceptive streams, and apply the appropriate synchronization strategy. For fleets collecting thousands of bags per week, Claru provides a batch ingestion API that accepts S3 paths or direct uploads, processes bags in parallel, and delivers consolidated ML-ready datasets with episode-level metadata and quality reports. Each delivery includes a provenance log mapping every training sample back to its source bag, topic, and timestamp range."
      ]
    }
  ],
  "faqs": [
    {
      "question": "Should I store training data as ROS bags?",
      "answer": "ROS bags are excellent for recording raw sensor data during robot operation, but they are suboptimal for ML training due to sequential access patterns, multi-rate topic synchronization overhead, and lack of random access to individual timesteps. The best practice is to record as ROS bags during data collection (since this integrates naturally with the ROS ecosystem and captures all sensor streams), then convert to an ML-optimized format (HDF5, RLDS, WebDataset, or LeRobot) before training. This two-stage workflow preserves the full raw data in bags for debugging and re-processing while providing efficient training-time access through the converted format. Claru automates this conversion pipeline for teams collecting at scale."
    },
    {
      "question": "What is the difference between ROS 1 and ROS 2 bags?",
      "answer": "ROS 1 bags use a custom binary format (.bag extension) with an append-only write pattern and a trailing index for topic-based seeking. ROS 2 bags use a pluggable storage backend architecture: the default is SQLite3 (.db3), but since ROS 2 Humble (2022), MCAP has become the recommended backend. MCAP offers better random access performance (indexed seeking vs SQLite queries), smaller file sizes (better compression), and format-agnostic message storage (not tied to ROS serialization). Both formats store the same conceptual data -- timestamped messages on named topics -- but with different serialization. For conversion to ML formats, the main difference is the reader library: rosbag Python package for ROS 1, rosbag2_py or the mcap/rosbags packages for ROS 2."
    },
    {
      "question": "How does Claru handle multi-rate sensor synchronization?",
      "answer": "Claru's conversion pipeline implements a configurable SyncBuffer that handles the common multi-rate challenge in robotics data. The buffer uses a reference clock, typically the lowest-rate camera stream, and for each reference timestamp, finds the nearest messages from all other topics within a configurable tolerance window (default 33ms for 30Hz cameras). Proprioceptive data (joint positions, velocities, forces) arriving at higher rates (100-1000 Hz) is linearly interpolated to the reference timestamps rather than nearest-neighbor matched, which avoids quantization artifacts in smooth trajectories. For action labels, we use the most recent command before each camera frame. The pipeline reports synchronization statistics including maximum jitter, dropped frames, and interpolation quality metrics."
    },
    {
      "question": "Can I convert ROS bags without a ROS installation?",
      "answer": "Yes. The rosbags Python package (pip install rosbags) provides a pure-Python reader and writer for both ROS 1 and ROS 2 bag formats without any ROS dependency. It can read .bag files (ROS 1), .db3 files (ROS 2 SQLite), and MCAP files, deserialize standard message types (sensor_msgs, geometry_msgs, etc.), and convert between formats. For custom message types, you need to provide the .msg definition files so the library can generate deserializers. The mcap Python package (pip install mcap mcap-ros2-support) is another ROS-free option specifically for MCAP-format bags. Claru's conversion pipeline uses these pure-Python readers, which means we process your bags on standard cloud infrastructure without requiring ROS containers."
    },
    {
      "question": "How do I handle compressed image topics in ROS bags?",
      "answer": "ROS cameras often publish on both /camera/image_raw (uncompressed sensor_msgs/Image) and /camera/image_compressed (compressed sensor_msgs/CompressedImage with JPEG or PNG encoding). Recording compressed topics reduces bag file sizes by 5-10x but requires decompression during conversion. In Python, use cv2.imdecode(np.frombuffer(msg.data, np.uint8), cv2.IMREAD_COLOR) to decode CompressedImage messages to NumPy arrays. Some camera drivers also publish on /camera/image_raw/compressed using the image_transport plugin, which uses the same CompressedImage message type. When configuring recording, prefer compressed topics to keep bag sizes manageable: ros2 bag record /camera/image_compressed /joint_states. Claru's pipeline automatically detects and handles both compressed and raw image topics."
    }
  ],
  "ctaHeading": "Get Data in ROS Bag Format",
  "ctaDescription": "Claru converts your ROS bags to ML-ready formats and delivers robotics training data in any format. Tell us your requirements.",
  "relatedGlossaryTerms": [
    "rlds",
    "cross-embodiment-data",
    "data-enrichment"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "fileExtensions": [
    ".bag",
    ".db3",
    ".mcap"
  ],
  "schemaDescription": "ROS 1 bags (.bag) use a custom binary format storing serialized messages with timestamps and topic names. ROS 2 bags (.db3) use SQLite3 databases with a messages table. Both store arbitrary ROS message types: sensor_msgs/Image, sensor_msgs/JointState, geometry_msgs/Pose, etc. MCAP is the emerging successor format for ROS 2.",
  "frameworksUsing": [
    {
      "name": "ROS/ROS 2",
      "description": "Native recording and playback in the Robot Operating System."
    },
    {
      "name": "Foxglove Studio",
      "description": "Visualization and debugging tool that natively reads ROS bags."
    },
    {
      "name": "rosbag2",
      "description": "ROS 2 bag recording with pluggable storage backends (SQLite, MCAP)."
    },
    {
      "name": "ROS Bridge / rosbridge_suite",
      "description": "WebSocket bridge enabling non-ROS systems to subscribe to ROS topics for data collection."
    }
  ],
  "conversions": [
    {
      "sourceFormat": "ROS bag to HDF5",
      "toolOrLibrary": "rosbag + cv_bridge + h5py",
      "complexity": "moderate",
      "notes": "Extract topics by timestamp, synchronize streams, write to HDF5 episodes."
    },
    {
      "sourceFormat": "ROS bag to RLDS",
      "toolOrLibrary": "rosbag + TFDS builder",
      "complexity": "complex",
      "notes": "Synchronize multi-rate topics, segment episodes, write TFRecords."
    },
    {
      "sourceFormat": "ROS bag to WebDataset",
      "toolOrLibrary": "rosbag + webdataset",
      "complexity": "moderate",
      "notes": "Extract synchronized frames, write to tar shards."
    },
    {
      "sourceFormat": "ROS bag to MCAP",
      "toolOrLibrary": "mcap CLI or rosbag2_mcap",
      "complexity": "trivial",
      "notes": "Direct container conversion preserving all messages."
    },
    {
      "sourceFormat": "ROS bag to LeRobot",
      "toolOrLibrary": "rosbag + lerobot",
      "complexity": "complex",
      "notes": "Synchronize topics, encode images as MP4, write Parquet metadata."
    }
  ],
  "keyPapers": [
    {
      "id": "quigley-ros-2009",
      "title": "ROS: an Open-Source Robot Operating System",
      "authors": "Quigley et al.",
      "venue": "ICRA 2009 Workshop",
      "year": 2009,
      "url": "https://www.willowgarage.com/sites/default/files/icraoss09-ROS.pdf"
    },
    {
      "id": "macenski-ros2-2022",
      "title": "Robot Operating System 2: Design, Architecture, and Uses In The Wild",
      "authors": "Macenski et al.",
      "venue": "Science Robotics 2022",
      "year": 2022,
      "url": "https://arxiv.org/abs/2211.07752"
    },
    {
      "id": "foxglove-mcap-2023",
      "title": "MCAP: A Modular Container Format for Pub/Sub Messages",
      "authors": "Foxglove Technologies",
      "venue": "Open Source Specification",
      "year": 2023,
      "url": "https://mcap.dev/spec"
    },
    {
      "id": "erickson-rosbags-2023",
      "title": "rosbags: A Pure Python Library for Reading and Writing ROS Bag Files",
      "authors": "Ternaris GmbH",
      "venue": "Open Source Library",
      "year": 2023,
      "url": "https://gitlab.com/ternaris/rosbags"
    }
  ],
  "claruDelivery": "Claru accepts ROS bag uploads from your robot fleet and converts them to ML-ready formats (RLDS, HDF5, WebDataset, LeRobot). Our pipeline handles topic synchronization, image decompression, and timestamp alignment across multi-rate sensor streams. Batch ingestion API available for fleet-scale data collection."
};

export default data;
