import type { FormatPageData } from "./types";

const data: FormatPageData = {
  "slug": "protobuf-robotics",
  "metaTitle": "Protocol Buffers for Robotics Data | Claru",
  "metaDescription": "Protocol Buffers (protobuf) provide efficient binary serialization for robotics data schemas. Learn how protobuf is used in robotics pipelines and MCAP containers.",
  "primaryKeyword": "protobuf robotics data",
  "secondaryKeywords": [
    "protobuf robotics data format",
    "protocol buffers robotics training data",
    "protobuf robot data serialization",
    "protobuf-robotics dataset format",
    "MCAP protobuf container",
    "Waymo protobuf format",
    "gRPC robotics"
  ],
  "canonicalPath": "/formats/protobuf-robotics",
  "h1": "Protocol Buffers for Robotics: Complete Guide for Robotics Data",
  "heroSubtitle": "Protocol Buffers (protobuf) provide efficient binary serialization for robotics data schemas. Learn how protobuf is used in robotics pipelines and MCAP containers.",
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
      "label": "Protocol Buffers for Robotics",
      "href": "/formats/protobuf-robotics"
    }
  ],
  "sections": [
    {
      "type": "prose",
      "heading": "Schema and Structure",
      "paragraphs": [
        "Protocol Buffers (protobuf), developed by Google and open-sourced in 2008, define data schemas in .proto files using a compact Interface Definition Language (IDL). A robotics observation message might be defined as: message Observation { bytes image = 1; repeated float joint_positions = 2; double timestamp = 3; Pose gripper_pose = 4; }, where each field has a unique numeric tag used for binary encoding. The proto3 syntax (current standard since 2016) uses variable-length encoding for integers (1-10 bytes depending on value), fixed-width encoding for floats and doubles, and length-delimited encoding for strings, bytes, and nested messages. This produces serialized payloads that are 3-10x smaller than equivalent JSON and 20-100x faster to parse.",
        "In robotics, protobuf serves three distinct roles: real-time message passing (via gRPC with sub-millisecond serialization), data logging (via MCAP containers or raw binary files), and dataset distribution (as used by the Waymo Open Dataset). The schema-first approach ensures that producer and consumer always agree on the data structure, with backward compatibility maintained through field numbering rules: new fields can be added without breaking old readers, and deprecated fields are never reused. For robotics teams managing data across collection robots, processing servers, and training clusters, this schema evolution capability is critical because sensor configurations change across data collection campaigns.",
        "The protobuf compiler (protoc) generates language-specific code from .proto files for C++ (libprotobuf), Python (protobuf package), Go, Java, C#, Rust (prost), and more. In a typical robotics pipeline, the same .proto file generates C++ code for the real-time robot controller (zero-allocation serialization at 1 kHz+), Python code for data processing and ML training, and Go/Java code for cloud services. The proto3 Any type allows embedding arbitrary message types with self-describing type URLs, which MCAP uses to store heterogeneous message streams in a single container. The proto3 map type provides efficient key-value storage, useful for per-object annotations in scene descriptions."
      ]
    },
    {
      "type": "cards",
      "heading": "Frameworks and Models Using Protocol Buffers",
      "cards": [
        {
          "title": "gRPC",
          "description": "Google's high-performance RPC framework using protobuf for service definitions and message serialization, widely used for robot-cloud communication."
        },
        {
          "title": "MCAP",
          "description": "Foxglove's modular container format that stores timestamped protobuf (and other) messages with index tables for random access and time-range queries."
        },
        {
          "title": "Waymo Open Dataset",
          "description": "Google's large-scale autonomous driving dataset uses protobuf for all sensor data (camera images, LiDAR range images) and annotation serialization."
        },
        {
          "title": "Foxglove Studio",
          "description": "Robotics data visualization tool that natively renders protobuf messages from MCAP files and live gRPC/WebSocket streams."
        },
        {
          "title": "ROS 2 (via Protobuf bridge)",
          "description": "While ROS 2 uses its own IDL, protobuf bridges enable interoperability with protobuf-based systems via rosbridge or custom transport plugins."
        },
        {
          "title": "TensorFlow (TFRecord)",
          "description": "TFRecord files store serialized tf.train.Example protobuf messages, making protobuf the underlying encoding for all RLDS and TFDS datasets."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Working with Protobuf in Robotics Pipelines",
      "paragraphs": [
        "The standard workflow for protobuf-based robotics data begins with schema definition. A well-structured robotics .proto file defines messages for each data type: SensorFrame (timestamp, sensor_id, data as oneof { Image, PointCloud, IMU }), RobotState (joint_positions, joint_velocities, gripper_state), Action (joint_commands or end_effector_deltas), and Episode (repeated SensorFrame observations, repeated Action actions, metadata). Using protobuf's oneof for polymorphic sensor data avoids the overhead of storing empty fields for unused sensor types. The repeated keyword defines variable-length arrays, and bytes fields store opaque binary blobs (JPEG images, compressed point clouds) without protobuf overhead.",
        "For data logging during robot operation, MCAP (developed by Foxglove) has emerged as the standard container format for protobuf messages. MCAP wraps timestamped protobuf messages with per-channel metadata and a chunk-based index structure that enables O(log n) time-range queries without reading the entire file. A typical MCAP file from a robot logging session contains channels for each sensor (camera images at 30 Hz, LiDAR at 10 Hz, joint state at 100 Hz, force/torque at 1 kHz), with each message serialized as protobuf. The MCAP specification supports chunk compression (LZ4 or ZSTD), achieving 2-4x compression on typical robotics data while maintaining random access through the chunk index.",
        "Converting protobuf-logged data to ML training formats is a common pipeline step. For Waymo Open Dataset, the official processing pipeline reads protobuf TFRecords (tf.train.Example containing serialized Waymo-specific protobuf messages), extracts camera images, LiDAR range images, and 3D annotations, and converts to framework-specific formats (KITTI, nuScenes, or custom). For MCAP-logged data, the mcap Python library (pip install mcap mcap-protobuf-support) provides an iterator-based reader: for schema, channel, message in reader.iter_messages(), then MyProtoMessage.FromString(message.data) deserializes each message. This read-convert-write pattern is the standard approach for turning protobuf-logged operational data into training-ready datasets."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "When to Use Protobuf vs Alternatives",
      "description": "Protobuf excels at schema-defined serialization but may not be optimal for all robotics data storage scenarios.",
      "columns": [
        "Format",
        "Best For",
        "Schema",
        "Speed",
        "Human Readable"
      ],
      "rows": [
        {
          "Format": "Protobuf",
          "Best For": "Real-time messages, logging, gRPC",
          "Schema": "Required (.proto files)",
          "Speed": "Excellent (3-10x faster than JSON)",
          "Human Readable": "No (binary)"
        },
        {
          "Format": "FlatBuffers",
          "Best For": "Zero-copy read-heavy workloads",
          "Schema": "Required (.fbs files)",
          "Speed": "Excellent (zero deserialize)",
          "Human Readable": "No (binary)"
        },
        {
          "Format": "JSON",
          "Best For": "Config files, debugging, APIs",
          "Schema": "Optional (JSON Schema)",
          "Speed": "Slow (text parsing)",
          "Human Readable": "Yes"
        },
        {
          "Format": "MessagePack",
          "Best For": "Schema-less binary encoding",
          "Schema": "None (self-describing)",
          "Speed": "Good (2-5x faster than JSON)",
          "Human Readable": "No (binary)"
        },
        {
          "Format": "Cap'n Proto",
          "Best For": "Zero-copy with RPC support",
          "Schema": "Required (.capnp files)",
          "Speed": "Excellent (zero-copy reads)",
          "Human Readable": "No (binary)"
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
          "Source Format": "ROS messages (msg/srv)",
          "Tool / Library": "rosbridge + protobuf",
          "Complexity": "moderate",
          "Notes": "Map ROS message types to equivalent protobuf schemas; rosbridge provides JSON intermediate."
        },
        {
          "Source Format": "JSON",
          "Tool / Library": "protobuf json_format",
          "Complexity": "trivial",
          "Notes": "google.protobuf.json_format.Parse() converts JSON strings to protobuf messages with field name matching."
        },
        {
          "Source Format": "HDF5",
          "Tool / Library": "Custom Python (h5py + protobuf)",
          "Complexity": "moderate",
          "Notes": "Read HDF5 arrays, populate protobuf messages, serialize to binary or MCAP container."
        },
        {
          "Source Format": "MCAP (protobuf channels)",
          "Tool / Library": "mcap Python library",
          "Complexity": "trivial",
          "Notes": "MCAP reader provides direct access to serialized protobuf messages with time-range queries."
        },
        {
          "Source Format": "Waymo TFRecord (protobuf)",
          "Tool / Library": "waymo_open_dataset Python package",
          "Complexity": "moderate",
          "Notes": "Read tf.train.Example records, deserialize embedded Waymo protobuf messages, extract sensor data."
        },
        {
          "Source Format": "FlatBuffers",
          "Tool / Library": "Custom conversion script",
          "Complexity": "moderate",
          "Notes": "Read FlatBuffer objects, map fields to equivalent protobuf message structure, serialize."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Protobuf in Production Robotics Systems",
      "paragraphs": [
        "In production robotics deployments, protobuf serves as the universal data language connecting all system components. The robot controller publishes joint states, sensor readings, and status messages as protobuf over gRPC at 100-1000 Hz. A logging service subscribes to these streams and writes timestamped protobuf messages to MCAP files for post-hoc analysis. A perception service receives camera and LiDAR protobuf messages, runs inference, and returns detections as protobuf response messages. This uniform serialization layer means that any component can be replaced or upgraded independently as long as the .proto contract is maintained.",
        "The Waymo Open Dataset demonstrates protobuf at scale for ML training data. Each TFRecord file contains serialized tf.train.Example messages wrapping Waymo-specific protobuf messages (Frame, CameraImage, RangeImage, Label). A single Frame message encodes data from 5 cameras and 5 LiDAR sensors with full 3D annotations, serializing to approximately 10 MB. The protobuf schema defines nested structures for camera calibration (CameraCalibration message), LiDAR calibration (LaserCalibration), and 3D labels (Label with Box message containing center_x/y/z, width, length, height, heading). This level of schema formalization makes it possible to process the 1000+ hour dataset programmatically without ambiguity in field interpretation.",
        "For teams transitioning from development (where data is often stored in ad-hoc formats) to production (where schema consistency is critical), protobuf provides a migration path. Starting with a simple .proto file defining your robot's observation and action spaces, you can progressively add fields for new sensors, new annotation types, and operational metadata. Protobuf's backward compatibility rules guarantee that data written with older schemas remains readable with newer schemas, and tools like buf (buf.build) provide linting, breaking change detection, and registry services for managing .proto files across teams."
      ]
    },
    {
      "type": "citation-list",
      "heading": "References",
      "citations": [
        {
          "id": "google-protobuf-2008",
          "title": "Protocol Buffers: Google's Data Interchange Format",
          "authors": "Google",
          "venue": "Google Developers",
          "year": 2008,
          "url": "https://protobuf.dev/"
        },
        {
          "id": "sun-waymo-2020",
          "title": "Scalability in Perception for Autonomous Driving: Waymo Open Dataset",
          "authors": "Sun et al.",
          "venue": "CVPR 2020",
          "year": 2020,
          "url": "https://arxiv.org/abs/1912.04838"
        },
        {
          "id": "mcap-spec-2022",
          "title": "MCAP: A Modular Container Format for Heterogeneous Timestamped Data",
          "authors": "Foxglove",
          "venue": "Foxglove Technical Documentation",
          "year": 2022,
          "url": "https://mcap.dev/spec"
        },
        {
          "id": "grpc-2015",
          "title": "gRPC: A High Performance, Open Source Universal RPC Framework",
          "authors": "Google",
          "venue": "Google Developers",
          "year": 2015,
          "url": "https://grpc.io/"
        },
        {
          "id": "flatbuffers-2014",
          "title": "FlatBuffers: Memory Efficient Serialization Library",
          "authors": "Google",
          "venue": "Google Developers",
          "year": 2014,
          "url": "https://flatbuffers.dev/"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Claru Data Delivery in Protobuf Format",
      "paragraphs": [
        "Claru provides complete .proto schema definitions alongside data deliveries for teams using protobuf-based pipelines. Schemas are designed following protobuf best practices: field numbering reserves ranges for future extension, oneof types handle polymorphic sensor data, and nested messages represent complex structures like camera calibration and 6D poses. All .proto files are compatible with proto3 syntax and validated with buf lint for style consistency.",
        "Data can be delivered as serialized protobuf messages within MCAP containers (with LZ4 or ZSTD chunk compression, indexed for time-range queries), as standalone binary protobuf files (one per episode or one per frame), or as TFRecord files with protobuf payload for TensorFlow ecosystem compatibility. For teams using gRPC-based robot communication, we provide service definitions (.proto files with service and rpc declarations) that enable streaming data delivery directly into your robot's existing gRPC infrastructure. Every delivery includes a Python example script demonstrating message deserialization and conversion to NumPy arrays."
      ]
    }
  ],
  "faqs": [
    {
      "question": "Should I use protobuf for ML training data?",
      "answer": "Protobuf is excellent for real-time data pipelines, operational logging, and schema-enforced data distribution, but it is suboptimal for batch ML training where random access and columnar operations matter. The recommended pattern is: log data in protobuf (via MCAP or gRPC streams) during robot operation, then convert to a training-optimized format (HDF5 for chunked array access, WebDataset for distributed streaming, RLDS for the Open X-Embodiment ecosystem) for model training. Protobuf's serialization overhead (requiring full message parsing) makes it slower than memory-mapped formats for training data loading."
    },
    {
      "question": "How does protobuf compare to FlatBuffers for robotics?",
      "answer": "Protobuf requires deserialization (parsing binary data into language-specific objects), while FlatBuffers allows zero-copy access to individual fields without parsing the entire message. FlatBuffers is faster for read-heavy workloads where you only need a few fields from large messages, such as extracting a timestamp from a multi-megabyte sensor frame. Protobuf is more mature, has broader language support, better tooling (buf, grpc), and smaller wire size due to variable-length encoding. Both work with MCAP containers. For most robotics teams, protobuf is the pragmatic choice unless nanosecond-level deserialization latency is critical."
    },
    {
      "question": "Can protobuf handle image data efficiently?",
      "answer": "Protobuf can store images as bytes fields, which adds minimal overhead (a 2-byte field tag + varint length prefix) to the raw image data. For JPEG-compressed images, the protobuf overhead is less than 0.01% of the payload. However, protobuf does not provide any image-specific compression or decoding. For image-heavy datasets, the recommended pattern is storing JPEG/PNG compressed bytes in protobuf bytes fields (as Waymo does), or storing images as separate files referenced by path from a protobuf metadata message. The bytes field has a default size limit of 2 GB in most implementations, which is sufficient for any single image."
    },
    {
      "question": "What is the relationship between protobuf and MCAP?",
      "answer": "MCAP is a container format that can store any serialized message format, with protobuf being the most commonly used encoding. MCAP adds temporal indexing (each message has a log_time and publish_time), channel metadata (topic names, schema references), and chunk-based compression on top of the raw protobuf messages. Think of MCAP as the 'outer envelope' and protobuf as the 'message format'. MCAP also supports ROS message encoding, JSON, FlatBuffers, and custom encodings. For robotics data logging, MCAP+protobuf has largely replaced raw ROS bag files in non-ROS systems."
    },
    {
      "question": "How does the Waymo Open Dataset use protobuf?",
      "answer": "Waymo stores all data as protobuf messages inside TFRecord files. Each TFRecord entry is a tf.train.Example containing serialized bytes of a Waymo Frame protobuf message. The Frame message contains nested CameraImage messages (5 cameras with JPEG bytes, calibration, and pose), RangeImage messages (5 LiDARs with range/intensity/elongation encoded as matrices), CameraLabels and LaserLabels (2D and 3D bounding boxes), and vehicle pose in a global reference frame. The .proto schema files are distributed with the waymo_open_dataset Python package, and the official tools provide deserialization and visualization utilities."
    }
  ],
  "ctaHeading": "Get Data in Protobuf Format",
  "ctaDescription": "Claru provides .proto schema definitions and serialized data in MCAP containers or standalone protobuf files, ready for your robotics pipeline. Tell us your requirements.",
  "relatedGlossaryTerms": [
    "rlds",
    "cross-embodiment-data",
    "data-enrichment"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "fileExtensions": [
    ".pb",
    ".proto",
    ".binpb",
    ".mcap"
  ],
  "schemaDescription": "Protobuf defines data schemas in .proto files with typed fields and unique numeric tags for binary encoding. Proto3 syntax uses variable-length encoding for integers (1-10 bytes), fixed-width for floats/doubles, and length-delimited for strings, bytes, and nested messages, producing payloads 3-10x smaller than JSON. Robotics applications use protobuf for real-time gRPC message passing (sub-millisecond serialization), MCAP container logging (timestamped messages with chunk indexing), and dataset distribution (as used by Waymo Open Dataset via TFRecord). Schema evolution is backward-compatible through field numbering rules.",
  "frameworksUsing": [
    {
      "name": "gRPC",
      "description": "Google's high-performance RPC framework using protobuf for service definitions and serialization, widely used for robot-cloud communication.",
      "url": "https://grpc.io/"
    },
    {
      "name": "MCAP",
      "description": "Foxglove's modular container format storing timestamped protobuf messages with chunk-based indexing for random access and time-range queries.",
      "url": "https://mcap.dev/"
    },
    {
      "name": "Waymo Open Dataset",
      "description": "Google's large-scale driving dataset using protobuf for all sensor data and annotation serialization within TFRecord files.",
      "url": "https://waymo.com/open/"
    },
    {
      "name": "Foxglove Studio",
      "description": "Robotics data visualization tool natively rendering protobuf messages from MCAP files and live gRPC/WebSocket streams.",
      "url": "https://foxglove.dev/"
    },
    {
      "name": "TensorFlow (TFRecord)",
      "description": "TFRecord files store serialized tf.train.Example protobuf messages, making protobuf the underlying encoding for RLDS and TFDS datasets."
    },
    {
      "name": "buf",
      "description": "Modern toolchain for protobuf: linting, breaking change detection, code generation, and schema registry for managing .proto files across teams.",
      "url": "https://buf.build/"
    }
  ],
  "conversions": [
    {
      "sourceFormat": "ROS messages (msg/srv)",
      "toolOrLibrary": "rosbridge + protobuf",
      "complexity": "moderate",
      "notes": "Map ROS message types to equivalent protobuf schemas; rosbridge provides JSON intermediate format."
    },
    {
      "sourceFormat": "JSON",
      "toolOrLibrary": "protobuf json_format",
      "complexity": "trivial",
      "notes": "google.protobuf.json_format.Parse() converts JSON strings to protobuf messages with field name matching."
    },
    {
      "sourceFormat": "HDF5",
      "toolOrLibrary": "Custom Python (h5py + protobuf)",
      "complexity": "moderate",
      "notes": "Read HDF5 arrays, populate protobuf message fields, serialize to binary or MCAP container."
    },
    {
      "sourceFormat": "MCAP (protobuf channels)",
      "toolOrLibrary": "mcap Python library",
      "complexity": "trivial",
      "notes": "MCAP reader provides direct access to serialized protobuf messages with time-range queries."
    },
    {
      "sourceFormat": "Waymo TFRecord",
      "toolOrLibrary": "waymo_open_dataset Python package",
      "complexity": "moderate",
      "notes": "Read tf.train.Example records, deserialize embedded Waymo protobuf messages, extract sensor data."
    },
    {
      "sourceFormat": "FlatBuffers",
      "toolOrLibrary": "Custom conversion script",
      "complexity": "moderate",
      "notes": "Read FlatBuffer objects, map fields to equivalent protobuf message structure, serialize."
    }
  ],
  "keyPapers": [
    {
      "id": "google-protobuf-2008",
      "title": "Protocol Buffers: Google's Data Interchange Format",
      "authors": "Google",
      "venue": "Google Developers",
      "year": 2008,
      "url": "https://protobuf.dev/"
    },
    {
      "id": "sun-waymo-2020",
      "title": "Scalability in Perception for Autonomous Driving: Waymo Open Dataset",
      "authors": "Sun et al.",
      "venue": "CVPR 2020",
      "year": 2020,
      "url": "https://arxiv.org/abs/1912.04838"
    },
    {
      "id": "mcap-spec-2022",
      "title": "MCAP: A Modular Container Format for Heterogeneous Timestamped Data",
      "authors": "Foxglove",
      "venue": "Foxglove Technical Documentation",
      "year": 2022,
      "url": "https://mcap.dev/spec"
    },
    {
      "id": "grpc-2015",
      "title": "gRPC: A High Performance, Open Source Universal RPC Framework",
      "authors": "Google",
      "venue": "Google Developers",
      "year": 2015,
      "url": "https://grpc.io/"
    },
    {
      "id": "flatbuffers-2014",
      "title": "FlatBuffers: Memory Efficient Serialization Library",
      "authors": "Google",
      "venue": "Google Developers",
      "year": 2014,
      "url": "https://flatbuffers.dev/"
    }
  ],
  "claruDelivery": "Claru provides .proto schema definitions alongside data deliveries with proto3 syntax, buf-linted for consistency. Data is delivered as serialized protobuf messages within MCAP containers (LZ4/ZSTD compressed, indexed for time-range queries), standalone binary protobuf files, or TFRecord files. For gRPC-based robot systems, we provide service definitions enabling streaming data delivery into your existing infrastructure."
};

export default data;
