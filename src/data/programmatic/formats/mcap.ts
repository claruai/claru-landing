import type { FormatPageData } from "./types";

const data: FormatPageData = {
  "slug": "mcap",
  "metaTitle": "MCAP (Modular Container for Autonomous Platforms) for Robotics Data | Claru",
  "metaDescription": "MCAP is a modern, high-performance container format for heterogeneous robotics data. Understand its advantages over ROS bags and how Claru uses MCAP.",
  "primaryKeyword": "MCAP format robotics",
  "secondaryKeywords": [
    "MCAP format robotics data",
    "MCAP  robotics training data",
    "MCAP  robotics dataset format",
    "mcap robot data"
  ],
  "canonicalPath": "/formats/mcap",
  "h1": "MCAP (Modular Container for Autonomous Platforms): Complete Guide for Robotics Data",
  "heroSubtitle": "MCAP is a modern, high-performance container format for heterogeneous robotics data. Understand its advantages over ROS bags and how Claru uses MCAP.",
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
      "label": "MCAP",
      "href": "/formats/mcap"
    }
  ],
  "sections": [
    {
      "type": "prose",
      "heading": "Schema and Structure",
      "paragraphs": [
        "MCAP stores timestamped messages in a single binary file with an efficient index for random access. It supports any serialization (Protobuf, Flatbuffers, ROS messages, JSON). The file structure: header, repeated (schema, channel, message) records, and a summary section with message indices for O(1) seek by timestamp.",
        "The MCAP binary layout is designed for both efficient writing and reading. During recording, messages are appended sequentially with channel and schema definitions interleaved as new topics appear. At file close, a summary section and index records are written to the end of the file, enabling fast seeking without scanning from the beginning. Each message record contains a channel ID (referencing the schema), a log_time (wall clock), a publish_time (message creation time), and the serialized payload bytes. The chunk-based organization groups messages within time windows, each independently compressed (LZ4 or ZSTD), enabling parallel decompression during playback.",
        "Unlike ROS 1 bags which use a monolithic format, MCAP's schema and channel definitions are embedded in the file itself, making MCAP files fully self-describing. You do not need external .msg files or a ROS installation to read an MCAP file. The mcap CLI tool (available via pip install mcap-cli or brew install mcap) provides commands for inspection (mcap info), conversion (mcap convert), and selective extraction (mcap cat) of messages by topic and time range."
      ]
    },
    {
      "type": "cards",
      "heading": "Frameworks and Models Using MCAP",
      "cards": [
        {
          "title": "Foxglove",
          "description": "Foxglove Studio uses MCAP as its primary data format for visualization."
        },
        {
          "title": "ROS 2 (Humble+)",
          "description": "ROS 2 Humble and later support MCAP as a bag storage backend."
        },
        {
          "title": "rerun.io",
          "description": "Rerun's logging format can export to MCAP for interoperability."
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
          "Source Format": "ROS bag",
          "Tool / Library": "mcap convert",
          "Complexity": "trivial",
          "Notes": "mcap CLI provides direct ROS bag to MCAP conversion."
        },
        {
          "Source Format": "Protobuf logs",
          "Tool / Library": "mcap Python writer",
          "Complexity": "moderate",
          "Notes": "Write protobuf messages with timestamps to MCAP channels."
        },
        {
          "Source Format": "MCAP to HDF5",
          "Tool / Library": "Custom mcap_reader + h5py",
          "Complexity": "moderate",
          "Notes": "Read channels, synchronize by timestamp, write to HDF5."
        }
      ]
    },
    {
      "type": "citation-list",
      "heading": "References",
      "citations": [
        {
          "id": "foxglove-mcap-2023",
          "title": "MCAP: A Modular Container Format for Pub/Sub Messages",
          "authors": "Foxglove Technologies",
          "venue": "Open Source Specification",
          "year": 2023,
          "url": "https://mcap.dev/spec"
        },
        {
          "id": "macenski-ros2-2022",
          "title": "Robot Operating System 2: Design, Architecture, and Uses In The Wild",
          "authors": "Macenski et al.",
          "venue": "Science Robotics 2022",
          "year": 2022,
          "url": "https://arxiv.org/abs/2211.07752"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Reading and Converting MCAP Data in Python",
      "paragraphs": [
        "The mcap Python package provides a straightforward reader API. Install with pip install mcap mcap-ros2-support, then open a file with from mcap.reader import make_reader and reader = make_reader(open('data.mcap', 'rb')). Iterate over messages with for schema, channel, message in reader.iter_messages(topics=['/camera/image', '/joint_states']). The decoded_examples feature can automatically deserialize ROS 2 messages to Python objects. For selective reading, use reader.iter_messages(start_time=t0, end_time=t1) to extract specific time ranges without scanning the entire file.",
        "Writing MCAP files uses the Writer API: from mcap.writer import Writer, then with open('output.mcap', 'wb') as f, Writer(f) as writer. Register schemas and channels first, then write messages with writer.add_message(). The Foxglove SDK also provides higher-level recording APIs for common sensor types. For batch conversion from MCAP to ML formats, Claru's pipeline reads MCAP files using the indexed reader (which leverages the summary section for O(1) topic discovery), synchronizes multi-rate channels, and writes to HDF5, RLDS, or LeRobot format."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "When to Use MCAP vs Alternatives",
      "description": "MCAP is the best modern choice for robot data recording. Convert to ML-optimized formats for training.",
      "columns": [
        "Format",
        "Recording",
        "Random Access",
        "File Size",
        "Ecosystem"
      ],
      "rows": [
        {
          "Format": "MCAP",
          "Recording": "Excellent",
          "Random Access": "O(1) indexed seek",
          "File Size": "Compact (LZ4/ZSTD)",
          "Ecosystem": "Foxglove, ROS 2"
        },
        {
          "Format": "ROS 1 bag",
          "Recording": "Good (ROS 1 only)",
          "Random Access": "Slow (trailing index)",
          "File Size": "Large (no compression)",
          "Ecosystem": "ROS 1, legacy tools"
        },
        {
          "Format": "ROS 2 SQLite",
          "Recording": "Good (ROS 2)",
          "Random Access": "Moderate (SQL queries)",
          "File Size": "Moderate",
          "Ecosystem": "ROS 2 default < Humble"
        },
        {
          "Format": "HDF5",
          "Recording": "Custom scripts needed",
          "Random Access": "Excellent (chunked)",
          "File Size": "Compact (LZ4/gzip)",
          "Ecosystem": "robomimic, D4RL"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Claru Data Delivery in MCAP Format",
      "paragraphs": [
        "Claru accepts MCAP files from your robot fleet and converts to ML-ready formats. We also deliver annotated data in MCAP format for teams that use Foxglove for visualization and debugging workflows.",
        "Our MCAP conversion pipeline supports all common serialization formats (ROS 2 CDR, Protobuf, JSON, FlatBuffers) and handles schema discovery automatically. For teams transitioning from ROS 1 bags to MCAP, we provide batch conversion using mcap convert with validation of message integrity. Every MCAP delivery includes the full schema registry embedded in the file, ensuring long-term readability without external dependencies."
      ]
    }
  ],
  "faqs": [
    {
      "question": "How does MCAP compare to ROS bags?",
      "answer": "MCAP offers three major improvements over ROS 1 bags. First, random access is dramatically faster because MCAP uses a structured index in the summary section that enables O(1) seeking by timestamp, compared to ROS 1's trailing index that requires scanning from the file end. Second, MCAP achieves smaller file sizes through per-chunk LZ4 or ZSTD compression, while ROS 1 bags store uncompressed data by default. Third, MCAP is serialization-agnostic, supporting Protobuf, FlatBuffers, JSON, and ROS messages in the same file, whereas ROS bags are tied to ROS message serialization. MCAP is now the default recording backend for ROS 2 Humble and later releases."
    },
    {
      "question": "Can MCAP store non-ROS data?",
      "answer": "Yes. MCAP is designed to be completely framework-agnostic. Each channel in an MCAP file references a schema that describes the serialization format and message type. You can store Protobuf messages, FlatBuffers, JSON objects, MessagePack, or even custom binary formats in the same file. This makes MCAP suitable for non-ROS robotics stacks, autonomous vehicle platforms, and industrial automation systems. Companies like Cruise, Waymo, and many AV startups use MCAP or MCAP-compatible formats for their sensor data logging. The Foxglove ecosystem provides SDKs in Python, C++, TypeScript, Go, and Swift for writing MCAP files from any platform."
    },
    {
      "question": "Is MCAP good for ML training?",
      "answer": "MCAP excels at recording and debugging but requires conversion for efficient ML training. Its sequential message-based storage pattern does not support the random-access-to-timesteps that training dataloaders need. However, MCAP's indexed structure makes selective extraction of specific topics and time ranges much faster than ROS bags, significantly speeding up the conversion-to-ML-format pipeline. The recommended workflow is to record data in MCAP format, then convert to HDF5, RLDS, zarr, or LeRobot for training. Claru automates this entire pipeline."
    },
    {
      "question": "How do I extract specific time ranges from an MCAP file?",
      "answer": "The mcap CLI provides topic and time-based filtering: mcap cat data.mcap --topics /camera/image,/joint_states --start 1000000000 --end 2000000000 outputs matching messages in JSON format. In Python, the McapReader.iter_messages() method accepts start_time and end_time parameters as nanosecond timestamps. Because MCAP's summary section indexes messages by timestamp, these filtered reads skip directly to the relevant chunks without scanning the entire file. For large MCAP files (100GB+), this indexed seeking can be 100x faster than equivalent operations on ROS 1 bags. The mcap CLI also supports conversion to ROS 1 bag format via mcap convert for teams with legacy tooling."
    },
    {
      "question": "What is the maximum file size MCAP supports?",
      "answer": "MCAP uses 64-bit offsets throughout its specification, supporting files up to 16 exabytes in theory. In practice, MCAP files from autonomous vehicle fleets commonly reach 50-200 GB per drive session without issues. For very long recording sessions, the chunked compression architecture means that the file remains readable even if recording is interrupted (only the last chunk and summary section may be incomplete). The mcap recover command can reconstruct the index from a truncated file. Claru's ingestion pipeline handles MCAP files of any size through streaming reads that never load the full file into memory."
    }
  ],
  "ctaHeading": "Get Data in MCAP Format",
  "ctaDescription": "Claru delivers robotics training data in MCAP format, ready to load into your pipeline. Tell us your requirements.",
  "relatedGlossaryTerms": [
    "rlds",
    "cross-embodiment-data",
    "data-enrichment"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "fileExtensions": [
    ".mcap"
  ],
  "schemaDescription": "MCAP stores timestamped messages in a single binary file with an efficient index for random access. It supports any serialization (Protobuf, Flatbuffers, ROS messages, JSON). The file structure: header, repeated (schema, channel, message) records, and a summary section with message indices for O(1) seek by timestamp.",
  "frameworksUsing": [
    {
      "name": "Foxglove",
      "description": "Foxglove Studio uses MCAP as its primary data format for visualization."
    },
    {
      "name": "ROS 2 (Humble+)",
      "description": "ROS 2 Humble and later support MCAP as a bag storage backend."
    },
    {
      "name": "rerun.io",
      "description": "Rerun's logging format can export to MCAP for interoperability."
    }
  ],
  "conversions": [
    {
      "sourceFormat": "ROS bag",
      "toolOrLibrary": "mcap convert",
      "complexity": "trivial",
      "notes": "mcap CLI provides direct ROS bag to MCAP conversion."
    },
    {
      "sourceFormat": "Protobuf logs",
      "toolOrLibrary": "mcap Python writer",
      "complexity": "moderate",
      "notes": "Write protobuf messages with timestamps to MCAP channels."
    },
    {
      "sourceFormat": "MCAP to HDF5",
      "toolOrLibrary": "Custom mcap_reader + h5py",
      "complexity": "moderate",
      "notes": "Read channels, synchronize by timestamp, write to HDF5."
    }
  ],
  "keyPapers": [
    {
      "id": "foxglove-mcap-2023",
      "title": "MCAP: A Modular Container Format for Pub/Sub Messages",
      "authors": "Foxglove Technologies",
      "venue": "Open Source Specification",
      "year": 2023,
      "url": "https://mcap.dev/spec"
    },
    {
      "id": "macenski-ros2-2022",
      "title": "Robot Operating System 2: Design, Architecture, and Uses In The Wild",
      "authors": "Macenski et al.",
      "venue": "Science Robotics 2022",
      "year": 2022,
      "url": "https://arxiv.org/abs/2211.07752"
    }
  ],
  "claruDelivery": "Claru accepts MCAP files from your robot fleet and converts to ML-ready formats. We also deliver annotated data in MCAP format for teams that use Foxglove for visualization and debugging workflows."
};

export default data;
