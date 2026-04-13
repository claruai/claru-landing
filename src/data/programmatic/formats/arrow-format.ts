import type { FormatPageData } from "./types";

const data: FormatPageData = {
  "slug": "arrow-format",
  "metaTitle": "Apache Arrow / Parquet for Robotics Data | Claru",
  "metaDescription": "Apache Arrow and Parquet provide columnar data storage for efficient analytics and ML training. Learn how robotics tabular data is stored in Arrow format.",
  "primaryKeyword": "Apache Arrow format robotics",
  "secondaryKeywords": [
    "Apache Arrow format robotics data",
    "Apache Arrow robotics training data",
    "Parquet robotics dataset format",
    "arrow-format robot data",
    "columnar storage robotics",
    "LeRobot Parquet format",
    "pyarrow robotics data"
  ],
  "canonicalPath": "/formats/arrow-format",
  "h1": "Apache Arrow / Parquet: Complete Guide for Robotics Data",
  "heroSubtitle": "Apache Arrow and Parquet provide columnar data storage for efficient analytics and ML training. Learn how robotics tabular data is stored in Arrow format.",
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
      "label": "Apache Arrow / Parquet",
      "href": "/formats/arrow-format"
    }
  ],
  "sections": [
    {
      "type": "prose",
      "heading": "Schema and Structure",
      "paragraphs": [
        "Apache Arrow defines a language-independent columnar memory format designed for efficient analytical operations. Data is organized in record batches where each column is a contiguous array of a single type, enabling SIMD (Single Instruction, Multiple Data) vectorized processing and zero-copy reads between processes. Arrow supports rich nested types including structs, lists, maps, and union types, making it capable of representing complex robotics data structures like variable-length joint trajectories and nested observation dictionaries. The in-memory layout uses 64-byte alignment for cache-line efficiency and maintains validity bitmaps for null handling.",
        "Apache Parquet is the complementary on-disk format, storing Arrow-compatible columnar data with efficient compression. Parquet files are organized into row groups (typically 64-128 MB each), where each row group contains column chunks that can be independently compressed with codecs like Snappy (fast, ~2x compression), ZSTD (balanced, ~4x compression), or LZ4 (low-latency, ~2.5x compression). Column-level statistics (min, max, null count) in the file footer enable predicate pushdown, allowing queries to skip entire row groups that do not match filter conditions. For robotics tabular data such as joint trajectories, sensor readings, and episode metadata, this column-oriented layout enables reading only the specific columns needed for a given analysis without scanning irrelevant data.",
        "The Arrow ecosystem includes Arrow IPC (Inter-Process Communication) format for streaming between processes, Arrow Flight for high-throughput network data transfer, and the Feather format (Arrow IPC with file metadata) for fast local persistence. In robotics pipelines, Arrow IPC is particularly valuable for zero-copy data sharing between a data collection process and a real-time monitoring dashboard, or between a preprocessing step and a training loop running in separate processes. The pyarrow library provides the Python interface, while arrow-rs (Rust), Arrow C++ (libarrow), and Arrow Java provide native implementations for other languages."
      ]
    },
    {
      "type": "cards",
      "heading": "Frameworks and Models Using Apache Arrow / Parquet",
      "cards": [
        {
          "title": "Hugging Face Datasets",
          "description": "The datasets library uses Arrow as its in-memory format and Parquet for on-disk storage, enabling memory-mapped access to datasets larger than RAM."
        },
        {
          "title": "LeRobot",
          "description": "Hugging Face's robotics framework stores trajectory metadata and tabular episode data in Parquet files, with video frames stored as MP4 and indexed by Parquet timestamps."
        },
        {
          "title": "Polars",
          "description": "High-performance DataFrame library built natively on Arrow, offering 10-100x speedups over pandas for analytical queries on robotics metadata."
        },
        {
          "title": "DuckDB",
          "description": "In-process analytical database that reads Parquet files directly and queries them with SQL, useful for exploring large robotics dataset metadata."
        },
        {
          "title": "Apache Spark",
          "description": "Distributed computing framework that uses Parquet as its default persistent storage format for large-scale data processing pipelines."
        },
        {
          "title": "Delta Lake / Iceberg",
          "description": "Table formats built on Parquet that add ACID transactions, schema evolution, and time travel for versioned robotics dataset management."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Reading and Writing Arrow/Parquet Robotics Data in Python",
      "paragraphs": [
        "The pyarrow library (pip install pyarrow) is the standard Python interface for both Arrow and Parquet. Reading a Parquet file is straightforward: pq.read_table('episodes.parquet') returns an Arrow Table that can be converted to pandas with .to_pandas() or to NumPy with .to_pydict() for individual columns. For large files, use pq.ParquetFile('episodes.parquet').read_row_group(i) to load specific row groups, or pq.read_table('episodes.parquet', columns=['joint_positions', 'timestamp']) to read only needed columns. Memory-mapped reading via pq.read_table(..., memory_map=True) avoids copying data into Python's heap, which is critical for datasets that approach available RAM.",
        "Writing robotics data to Parquet follows a pattern of building Arrow arrays and tables. For a trajectory dataset: create arrays with pa.array(joint_positions_list, type=pa.list_(pa.float32())), build a table with pa.table({'timestamp': timestamps, 'joint_positions': joints, 'episode_id': episodes}), then write with pq.write_table(table, 'episodes.parquet', compression='zstd', row_group_size=65536). The row_group_size parameter controls the granularity of predicate pushdown and should be tuned to your query patterns: smaller row groups enable finer-grained skipping but add metadata overhead. For time-series robotics data, sorting by timestamp before writing ensures that temporal range queries can skip most row groups.",
        "The Hugging Face datasets library wraps pyarrow with higher-level APIs for ML workflows. Loading a LeRobot dataset returns a datasets.Dataset backed by memory-mapped Arrow files: dataset = datasets.load_dataset('lerobot/aloha_sim_transfer_cube'). The dataset supports .select(), .filter(), and .map() operations that execute lazily on Arrow arrays without materializing intermediate copies. For custom robotics datasets, datasets.Dataset.from_parquet('your_data.parquet') creates a HF-compatible dataset from any Parquet file, enabling integration with the Hugging Face Hub for versioned dataset hosting and streaming."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "When to Use Parquet vs Alternatives",
      "description": "Parquet excels at tabular robotics data but other formats may be better for array-heavy or sequential workloads.",
      "columns": [
        "Format",
        "Best For",
        "Column Access",
        "Cloud Native",
        "Compression"
      ],
      "rows": [
        {
          "Format": "Parquet",
          "Best For": "Tabular metadata, episode indices, sensor logs",
          "Column Access": "Excellent (columnar)",
          "Cloud Native": "Excellent (S3/GCS)",
          "Compression": "Snappy, ZSTD, LZ4, Brotli"
        },
        {
          "Format": "HDF5",
          "Best For": "Multi-dimensional arrays, images, chunked access",
          "Column Access": "Moderate (dataset-level)",
          "Cloud Native": "Poor (monolithic file)",
          "Compression": "gzip, lz4, zstd, blosc"
        },
        {
          "Format": "Arrow IPC / Feather",
          "Best For": "Fast IPC, low-latency local persistence",
          "Column Access": "Excellent (columnar)",
          "Cloud Native": "Moderate",
          "Compression": "LZ4, ZSTD"
        },
        {
          "Format": "CSV",
          "Best For": "Human-readable exchange, small datasets",
          "Column Access": "None (row-based scan)",
          "Cloud Native": "Good (any storage)",
          "Compression": "External (gzip)"
        },
        {
          "Format": "LeRobot (Parquet + MP4)",
          "Best For": "HF Hub robotics, video + tabular",
          "Column Access": "Parquet columns + video frames",
          "Cloud Native": "Good (HF Hub streaming)",
          "Compression": "ZSTD (Parquet) + H.264 (video)"
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
          "Source Format": "CSV",
          "Tool / Library": "pyarrow.csv.read_csv()",
          "Complexity": "trivial",
          "Notes": "Direct conversion with automatic type inference; use ConvertOptions for explicit schemas."
        },
        {
          "Source Format": "HDF5",
          "Tool / Library": "Custom h5py + pyarrow",
          "Complexity": "moderate",
          "Notes": "Read HDF5 arrays per episode, flatten to columnar layout, write row groups to Parquet."
        },
        {
          "Source Format": "pandas DataFrame",
          "Tool / Library": "df.to_parquet()",
          "Complexity": "trivial",
          "Notes": "Direct conversion; use engine='pyarrow' and compression='zstd' for best results."
        },
        {
          "Source Format": "JSON / JSONL",
          "Tool / Library": "pyarrow.json.read_json()",
          "Complexity": "trivial",
          "Notes": "Infers schema from JSON structure; supports nested records as Arrow structs."
        },
        {
          "Source Format": "RLDS (TFRecord)",
          "Tool / Library": "Custom Python (tensorflow + pyarrow)",
          "Complexity": "moderate",
          "Notes": "Iterate TFRecords, extract features, build Arrow tables; used by LeRobot for RLDS-to-Parquet conversion."
        },
        {
          "Source Format": "ROS bag",
          "Tool / Library": "rosbags + pyarrow",
          "Complexity": "moderate",
          "Notes": "Deserialize ROS messages, extract fields, write timestamped rows to sorted Parquet files."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Arrow and Parquet in Robotics Data Pipelines",
      "paragraphs": [
        "In modern robotics data pipelines, Parquet has emerged as the metadata and index layer that ties together multi-modal data stored across different formats. The LeRobot framework exemplifies this pattern: video frames are stored as MP4 files for compression efficiency, while all tabular data (timestamps, joint positions, action vectors, episode boundaries, language instructions) lives in Parquet files. The Parquet episode index enables efficient temporal lookups and episode filtering without scanning video data. This separation of concerns allows teams to query metadata at analytical speeds (millions of rows per second via DuckDB or Polars) while keeping bulk sensor data in format-appropriate containers.",
        "Arrow Flight, the network-native data transfer protocol in the Arrow ecosystem, is gaining traction for real-time robotics data streaming. Flight provides gRPC-based endpoints that transfer Arrow record batches with zero serialization overhead, achieving throughput of 2-4 GB/s on 10 GbE networks. For robotics fleet management, a central Flight server can ingest telemetry from hundreds of robots simultaneously, with each robot's data landing as Arrow record batches that are immediately queryable. The Arrow Flight SQL extension adds SQL query capabilities over Flight endpoints, enabling analysts to query live robot fleet data with standard SQL tools.",
        "For dataset versioning and reproducibility, table formats like Delta Lake and Apache Iceberg build on Parquet to add transactional guarantees. These formats maintain a transaction log alongside Parquet data files, enabling schema evolution (adding new sensor columns without rewriting existing data), time travel (querying the dataset as it existed at any past point), and atomic updates (safely adding new episodes while others are reading). For robotics teams managing evolving datasets across multiple collection campaigns, these table formats solve the practical problem of data versioning that raw Parquet files do not address."
      ]
    },
    {
      "type": "citation-list",
      "heading": "References",
      "citations": [
        {
          "id": "arrow-spec-2023",
          "title": "Apache Arrow Columnar Format Specification",
          "authors": "Apache Arrow Project",
          "venue": "Apache Foundation",
          "year": 2023,
          "url": "https://arrow.apache.org/docs/format/Columnar.html"
        },
        {
          "id": "parquet-spec-2023",
          "title": "Apache Parquet Format Specification",
          "authors": "Apache Parquet Project",
          "venue": "Apache Foundation",
          "year": 2023,
          "url": "https://parquet.apache.org/documentation/latest/"
        },
        {
          "id": "cadene-lerobot-2024",
          "title": "LeRobot: State-of-the-Art Machine Learning for Real-World Robotics",
          "authors": "Cadene et al.",
          "venue": "Hugging Face 2024",
          "year": 2024,
          "url": "https://github.com/huggingface/lerobot"
        },
        {
          "id": "lhoest-datasets-2021",
          "title": "Datasets: A Community Library for Natural Language Processing",
          "authors": "Lhoest et al.",
          "venue": "EMNLP 2021 (System Demonstrations)",
          "year": 2021,
          "url": "https://arxiv.org/abs/2109.02846"
        },
        {
          "id": "arrow-flight-2019",
          "title": "Apache Arrow Flight: A Framework for Fast Data Transport",
          "authors": "Apache Arrow Project",
          "venue": "Apache Foundation Technical Documentation",
          "year": 2019,
          "url": "https://arrow.apache.org/docs/format/Flight.html"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Claru Data Delivery in Apache Arrow / Parquet Format",
      "paragraphs": [
        "Claru delivers tabular robotics data (joint states, sensor readings, episode metadata, action vectors, language instructions) in Parquet format with optimized row group sizes tuned for your training workload. Numeric columns use float32 precision by default with configurable dtype overrides, and categorical columns (task labels, robot IDs, environment names) use dictionary encoding for 5-10x compression on repetitive string data. All Parquet files include column-level statistics in the footer for efficient predicate pushdown during filtering operations.",
        "For teams using the Hugging Face ecosystem, Claru provides LeRobot-compatible deliveries with Parquet metadata files and MP4 video files structured for direct upload to the Hugging Face Hub. For teams running analytical queries on large datasets, we additionally provide DuckDB-compatible Parquet with sorted columns and Bloom filter indexes for sub-second point queries on datasets with millions of rows. Every delivery includes a schema documentation file mapping column names to their semantic meaning, units, and coordinate frame conventions."
      ]
    }
  ],
  "faqs": [
    {
      "question": "When should I use Parquet vs HDF5 for robotics data?",
      "answer": "Use Parquet for tabular data where columnar access matters: joint trajectories, episode metadata, sensor logs, action labels, and language instructions. Parquet excels at analytical queries (filtering episodes by task type, computing statistics across thousands of trajectories) and integrates natively with tools like DuckDB, Polars, and pandas. Use HDF5 for dense multi-dimensional array data (images, depth maps, point clouds) where chunked random access to individual frames is the primary access pattern. Many modern robotics frameworks (LeRobot, Open X-Embodiment datasets) use both: Parquet for the metadata and tabular index, HDF5 or MP4 for the bulk sensor data."
    },
    {
      "question": "Does Arrow support images and video?",
      "answer": "Arrow can store images as binary columns (pa.binary() or pa.large_binary()), but this is not recommended for large datasets because columnar compression is inefficient on opaque binary blobs. The recommended pattern is to store images as separate files (JPEG, PNG, or MP4 video) and use Arrow/Parquet for the metadata index with file paths, timestamps, and frame offsets. This is exactly how LeRobot works: Parquet files contain trajectory metadata with timestamp columns that index into MP4 video files. Hugging Face datasets also support this pattern via the Image and Video feature types, which store file references in Arrow and handle decoding transparently."
    },
    {
      "question": "How does Parquet handle time-series data from robots?",
      "answer": "Parquet supports timestamp columns with nanosecond precision (pa.timestamp('ns')), which is sufficient for even the highest-frequency robot sensors (1 kHz IMU data at microsecond resolution). For efficient time-range queries, sort your data by timestamp before writing and enable column statistics in the Parquet footer. This allows readers to skip entire row groups whose timestamp range does not overlap the query window. For multi-rate sensor fusion (e.g., 30 Hz camera + 100 Hz force/torque), store each sensor stream in its own Parquet file sorted by timestamp, then join on timestamp ranges at query time using DuckDB's ASOF JOIN or Polars' join_asof()."
    },
    {
      "question": "What is the difference between Arrow IPC, Feather, and Parquet?",
      "answer": "Arrow IPC is the streaming protocol for passing Arrow record batches between processes with zero serialization overhead. Feather (v2) is Arrow IPC written to a file with additional metadata, designed for fast local read/write (no compression by default, but supports LZ4/ZSTD). Parquet is the analytics-optimized on-disk format with columnar compression, predicate pushdown, and row group organization. Use Feather for temporary local persistence where read/write speed matters more than file size. Use Parquet for long-term storage, cloud hosting, and analytical queries. Arrow IPC is typically used programmatically (not saved to files) for inter-process communication in data pipelines."
    },
    {
      "question": "Can I query Parquet robotics data with SQL?",
      "answer": "Yes. DuckDB (pip install duckdb) can query Parquet files directly with SQL: SELECT episode_id, AVG(gripper_force) FROM 'episodes.parquet' WHERE task = 'pick_and_place' GROUP BY episode_id. DuckDB reads Parquet with predicate pushdown and columnar projection, so queries on large datasets are fast without loading everything into memory. This is particularly useful for robotics dataset exploration: finding episodes that match specific criteria, computing per-episode statistics, and generating train/val/test splits based on metadata conditions."
    }
  ],
  "ctaHeading": "Get Data in Apache Arrow / Parquet Format",
  "ctaDescription": "Claru delivers robotics training data in Parquet format with optimized row groups, column statistics, and LeRobot-compatible structure. Tell us your requirements.",
  "relatedGlossaryTerms": [
    "rlds",
    "cross-embodiment-data",
    "data-enrichment"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "fileExtensions": [
    ".parquet",
    ".arrow",
    ".feather"
  ],
  "schemaDescription": "Arrow defines a language-independent columnar memory format with 64-byte aligned record batches, validity bitmaps for nulls, and rich nested types (structs, lists, maps). Parquet is the on-disk counterpart organized into row groups (64-128 MB) with column-level compression (Snappy, ZSTD, LZ4), predicate pushdown via min/max statistics, and dictionary encoding for repetitive values. For robotics, tabular data (joint states, sensor readings, timestamps, episode metadata) is stored as typed columns, while binary data (images, point clouds) is referenced by file path with Parquet serving as the metadata index layer.",
  "frameworksUsing": [
    {
      "name": "Hugging Face Datasets",
      "description": "Uses Arrow as its in-memory format and Parquet for on-disk storage, supporting memory-mapped access to datasets larger than RAM.",
      "url": "https://github.com/huggingface/datasets"
    },
    {
      "name": "LeRobot",
      "description": "Hugging Face's robotics framework stores trajectory metadata in Parquet with video frames as MP4, indexed by Parquet timestamps.",
      "url": "https://github.com/huggingface/lerobot"
    },
    {
      "name": "Polars",
      "description": "High-performance DataFrame library built natively on Arrow, offering 10-100x speedups over pandas for analytical queries.",
      "url": "https://github.com/pola-rs/polars"
    },
    {
      "name": "DuckDB",
      "description": "In-process analytical database that queries Parquet files directly with SQL, useful for exploring large robotics metadata.",
      "url": "https://duckdb.org/"
    },
    {
      "name": "Apache Spark",
      "description": "Distributed computing framework using Parquet as its default persistent storage format for large-scale data processing.",
      "url": "https://spark.apache.org/"
    },
    {
      "name": "Delta Lake",
      "description": "Table format built on Parquet adding ACID transactions, schema evolution, and time travel for versioned dataset management.",
      "url": "https://delta.io/"
    }
  ],
  "conversions": [
    {
      "sourceFormat": "CSV",
      "toolOrLibrary": "pyarrow.csv.read_csv()",
      "complexity": "trivial",
      "notes": "Direct conversion with automatic type inference; use ConvertOptions for explicit schemas."
    },
    {
      "sourceFormat": "HDF5",
      "toolOrLibrary": "Custom h5py + pyarrow",
      "complexity": "moderate",
      "notes": "Read HDF5 arrays per episode, flatten to columnar layout, write row groups to Parquet."
    },
    {
      "sourceFormat": "pandas DataFrame",
      "toolOrLibrary": "df.to_parquet()",
      "complexity": "trivial",
      "notes": "Direct conversion; use engine='pyarrow' and compression='zstd' for best results."
    },
    {
      "sourceFormat": "JSON / JSONL",
      "toolOrLibrary": "pyarrow.json.read_json()",
      "complexity": "trivial",
      "notes": "Infers schema from JSON structure; supports nested records as Arrow structs."
    },
    {
      "sourceFormat": "RLDS (TFRecord)",
      "toolOrLibrary": "Custom Python (tensorflow + pyarrow)",
      "complexity": "moderate",
      "notes": "Iterate TFRecords, extract features, build Arrow tables for LeRobot-compatible output."
    },
    {
      "sourceFormat": "ROS bag",
      "toolOrLibrary": "rosbags + pyarrow",
      "complexity": "moderate",
      "notes": "Deserialize ROS messages, extract fields, write timestamped rows to sorted Parquet files."
    }
  ],
  "keyPapers": [
    {
      "id": "arrow-spec-2023",
      "title": "Apache Arrow Columnar Format Specification",
      "authors": "Apache Arrow Project",
      "venue": "Apache Foundation",
      "year": 2023,
      "url": "https://arrow.apache.org/docs/format/Columnar.html"
    },
    {
      "id": "parquet-spec-2023",
      "title": "Apache Parquet Format Specification",
      "authors": "Apache Parquet Project",
      "venue": "Apache Foundation",
      "year": 2023,
      "url": "https://parquet.apache.org/documentation/latest/"
    },
    {
      "id": "cadene-lerobot-2024",
      "title": "LeRobot: State-of-the-Art Machine Learning for Real-World Robotics",
      "authors": "Cadene et al.",
      "venue": "Hugging Face 2024",
      "year": 2024,
      "url": "https://github.com/huggingface/lerobot"
    },
    {
      "id": "lhoest-datasets-2021",
      "title": "Datasets: A Community Library for Natural Language Processing",
      "authors": "Lhoest et al.",
      "venue": "EMNLP 2021 (System Demonstrations)",
      "year": 2021,
      "url": "https://arxiv.org/abs/2109.02846"
    },
    {
      "id": "arrow-flight-2019",
      "title": "Apache Arrow Flight: A Framework for Fast Data Transport",
      "authors": "Apache Arrow Project",
      "venue": "Apache Foundation Technical Documentation",
      "year": 2019,
      "url": "https://arrow.apache.org/docs/format/Flight.html"
    }
  ],
  "claruDelivery": "Claru delivers tabular robotics data in Parquet format with optimized row group sizes, ZSTD compression, dictionary encoding for categorical columns, and column-level statistics for predicate pushdown. For LeRobot-compatible deliveries, Parquet metadata files are paired with MP4 video files structured for direct upload to the Hugging Face Hub. Every delivery includes schema documentation mapping column names to their semantic meaning, units, and coordinate frame conventions."
};

export default data;
