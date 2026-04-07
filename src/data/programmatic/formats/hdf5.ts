import type { FormatPageData } from "./types";

const data: FormatPageData = {
  "slug": "hdf5",
  "metaTitle": "HDF5 (Hierarchical Data Format 5) for Robotics Data | Claru",
  "metaDescription": "HDF5 is the most widely used file format for robotics datasets. Learn its structure, compression options, and how Claru delivers robot training data in HDF5.",
  "primaryKeyword": "HDF5 format robotics",
  "secondaryKeywords": [
    "HDF5 format robotics data",
    "HDF5 robotics training data",
    "HDF5 robotics dataset format",
    "hdf5 robot data",
    "h5py robotics",
    "hierarchical data format robot learning"
  ],
  "canonicalPath": "/formats/hdf5",
  "h1": "HDF5 (Hierarchical Data Format 5): Complete Guide for Robotics Data",
  "heroSubtitle": "HDF5 is the most widely used file format for robotics datasets. Learn its structure, compression options, and how Claru delivers robot training data in HDF5.",
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
      "label": "HDF5",
      "href": "/formats/hdf5"
    }
  ],
  "sections": [
    {
      "type": "prose",
      "heading": "Schema and Structure",
      "paragraphs": [
        "HDF5 organizes data hierarchically: /episodes/episode_0/observations/images, /episodes/episode_0/actions, etc. Each group can contain datasets (multi-dimensional arrays) with arbitrary dtypes. Chunked storage enables partial reads, and built-in compression (gzip, lz4, zstd) reduces file size 2-5x. Metadata is stored as HDF5 attributes on groups or datasets.",
        "The HDF5 specification defines two core primitives: groups (analogous to filesystem directories) and datasets (analogous to files containing N-dimensional arrays). Groups can be nested to arbitrary depth, and both groups and datasets can carry key-value metadata as attributes. For robotics, the typical convention uses top-level groups for episodes, with each episode containing sub-groups for observations (further split by modality), actions, rewards, and metadata. The robomimic convention, widely adopted in manipulation research, structures files as /data/demo_0/obs/{camera_name, joint_positions, gripper_state} and /data/demo_0/actions, with a top-level /mask group defining train/val splits.",
        "HDF5's chunking mechanism is critical for training performance. When you create a dataset with chunks=(1, 480, 640, 3), each single-frame image occupies one chunk on disk, enabling O(1) random access to any frame without reading the entire array. The chunk size determines the minimum I/O granularity, so aligning chunks with your access pattern (per-step reads for training, per-episode reads for evaluation) is essential. Virtual datasets (VDS), introduced in HDF5 1.10, allow you to create a unified view across multiple physical files without copying data, which is valuable for combining datasets from different collection campaigns into a single logical dataset."
      ]
    },
    {
      "type": "cards",
      "heading": "Frameworks and Models Using HDF5",
      "cards": [
        {
          "title": "robomimic",
          "description": "NVIDIA's imitation learning framework uses HDF5 as its native data format for manipulation demonstrations."
        },
        {
          "title": "ManiSkill",
          "description": "The ManiSkill benchmark suite stores trajectories in HDF5 with per-step observations and actions."
        },
        {
          "title": "D4RL",
          "description": "The offline RL benchmark uses HDF5 for all its locomotion and manipulation datasets."
        },
        {
          "title": "RoboCasa",
          "description": "Large-scale simulation benchmark for household robotics, storing demonstrations in robomimic-style HDF5."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Reading and Writing HDF5 Robotics Data in Python",
      "paragraphs": [
        "The h5py library is the standard Python interface for HDF5. Reading a robomimic-style dataset is straightforward: open the file with h5py.File('dataset.hdf5', 'r'), then access episodes as f['data/demo_0/obs/agentview_image'][:] to get a NumPy array of all frames. For training, use f['data/demo_0/actions'][start:end] to read action slices without loading the entire episode. The key performance optimization is to keep the file handle open across batches rather than opening and closing it per sample, and to use HDF5's built-in chunked reading rather than loading entire arrays into memory.",
        "Writing a new robotics HDF5 dataset follows a pattern: create the file with h5py.File('output.hdf5', 'w'), then for each episode, create a group with f.create_group(f'data/demo_{i}'), and write observation arrays with f.create_dataset('data/demo_0/obs/image', data=images, chunks=(1, H, W, 3), compression='lz4'). Always store metadata as attributes: f['data/demo_0'].attrs['num_samples'] = len(actions). For large datasets, the hdf5plugin package provides access to fast compressors like LZ4 and Blosc that are not included in the default HDF5 installation. The command h5dump -H dataset.hdf5 (from the HDF5 command-line tools) lets you inspect the structure without loading data, and h5stat dataset.hdf5 reports file-level statistics including chunk utilization."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "When to Use HDF5 vs Alternatives",
      "description": "HDF5 is the most widely adopted format in manipulation research, but other formats may be better depending on your infrastructure.",
      "columns": [
        "Format",
        "Best For",
        "Random Access",
        "Cloud Streaming",
        "Compression"
      ],
      "rows": [
        {
          "Format": "HDF5",
          "Best For": "robomimic, D4RL, local training",
          "Random Access": "Excellent (chunked)",
          "Cloud Streaming": "Poor (requires download)",
          "Compression": "gzip, lz4, zstd, blosc"
        },
        {
          "Format": "Zarr",
          "Best For": "Cloud-native, parallel writes",
          "Random Access": "Excellent (chunked)",
          "Cloud Streaming": "Excellent (S3/GCS native)",
          "Compression": "Same codecs as HDF5"
        },
        {
          "Format": "RLDS",
          "Best For": "Open X-Embodiment, RT-X",
          "Random Access": "Moderate (sequential shards)",
          "Cloud Streaming": "Good (GCS via TFDS)",
          "Compression": "TFRecord built-in"
        },
        {
          "Format": "WebDataset",
          "Best For": "Distributed GPU training",
          "Random Access": "Poor (sequential tar)",
          "Cloud Streaming": "Excellent (HTTP/S3)",
          "Compression": "Per-file in tar"
        },
        {
          "Format": "LeRobot",
          "Best For": "HuggingFace ecosystem",
          "Random Access": "Moderate (Parquet index)",
          "Cloud Streaming": "Good (HF Hub)",
          "Compression": "MP4 video + Parquet"
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
          "Source Format": "RLDS",
          "Tool / Library": "Custom Python (h5py + tensorflow)",
          "Complexity": "moderate",
          "Notes": "Read TFRecords, write to HDF5 groups preserving episode structure."
        },
        {
          "Source Format": "Zarr",
          "Tool / Library": "zarr + h5py",
          "Complexity": "trivial",
          "Notes": "zarr can read/write HDF5 directly via zarr.open(store=zarr.storage.H5Store(...))."
        },
        {
          "Source Format": "WebDataset",
          "Tool / Library": "Custom Python",
          "Complexity": "moderate",
          "Notes": "Unpack tar shards, write samples to HDF5 episode groups."
        },
        {
          "Source Format": "ROS bag",
          "Tool / Library": "rosbag + h5py",
          "Complexity": "moderate",
          "Notes": "Extract synchronized topics by timestamp, write to episode groups."
        },
        {
          "Source Format": "LeRobot (Parquet)",
          "Tool / Library": "pandas + h5py",
          "Complexity": "moderate",
          "Notes": "Read Parquet metadata, decode MP4 frames, write to HDF5 arrays."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Migration Guide: Optimizing HDF5 for Training Performance",
      "paragraphs": [
        "The most common performance mistake with HDF5 robotics datasets is poor chunk alignment. If your training loop reads one step at a time but your chunks span 100 steps, every read loads 100x more data than needed. For imitation learning, set image dataset chunks to (1, H, W, C) and state/action dataset chunks to (1, state_dim) or (1, action_dim). If your training loop reads fixed-length windows (e.g., action chunking with horizon=16), align chunks to (16, action_dim) for optimal throughput.",
        "For distributed training, HDF5's file-locking mechanism can become a bottleneck when multiple workers read the same file. The solution is to set the HDF5_USE_FILE_LOCKING environment variable to FALSE and ensure workers access the file in read-only mode. Alternatively, shard the dataset into multiple HDF5 files (one per N episodes) and assign different shards to different workers. The robomimic framework provides a SequenceDataset class that handles this worker-to-shard assignment automatically.",
        "When migrating from raw video files to HDF5, consider your compression strategy carefully. Storing raw uint8 frames with LZ4 compression gives the fastest decompression (important for GPU-bound training), while JPEG-compressed bytes in an opaque dataset reduce file size by 5-10x at the cost of decode overhead and lossy quality. For proprioceptive data (joint positions, forces), float32 with no compression is typically fastest since these arrays are small. Always validate your HDF5 files after creation using h5py's built-in checksumming: create datasets with fletcher32=True to detect corruption."
      ]
    },
    {
      "type": "citation-list",
      "heading": "References",
      "citations": [
        {
          "id": "robomimic-2021",
          "title": "robomimic: A Framework for Robot Learning from Demonstration",
          "authors": "Mandlekar et al.",
          "venue": "CoRL 2021",
          "year": 2021,
          "url": "https://arxiv.org/abs/2108.03298"
        },
        {
          "id": "fu-d4rl-2020",
          "title": "D4RL: Datasets for Deep Data-Driven Reinforcement Learning",
          "authors": "Fu et al.",
          "venue": "arXiv 2020",
          "year": 2020,
          "url": "https://arxiv.org/abs/2004.06120"
        },
        {
          "id": "hdf-group-2022",
          "title": "HDF5 Reference Manual",
          "authors": "The HDF Group",
          "venue": "Technical Documentation",
          "year": 2022,
          "url": "https://www.hdfgroup.org/solutions/hdf5/"
        },
        {
          "id": "nasiriany-robocasa-2024",
          "title": "RoboCasa: Large-Scale Simulation of Everyday Tasks for Generalist Robots",
          "authors": "Nasiriany et al.",
          "venue": "RSS 2024",
          "year": 2024,
          "url": "https://arxiv.org/abs/2406.02523"
        },
        {
          "id": "gu-maniskill2-2023",
          "title": "ManiSkill2: A Unified Benchmark for Generalizable Manipulation Skills",
          "authors": "Gu et al.",
          "venue": "ICLR 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2302.04659"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Claru Data Delivery in HDF5 Format",
      "paragraphs": [
        "Claru delivers HDF5 files with standardized group hierarchy: /episodes/{id}/observations/{modality} and /episodes/{id}/actions. Chunked storage with lz4 compression balances read speed and file size. Metadata attributes include camera calibration, robot URDF paths, and task descriptions.",
        "Every HDF5 delivery is validated against the robomimic SequenceDataset loader to ensure compatibility with the most widely used imitation learning framework. We provide a Python verification script that checks chunk alignment, compression settings, dtype consistency, and attribute completeness. For teams using D4RL-style flat layouts, ManiSkill episode structures, or custom schemas, we adapt our output format to match your existing data pipeline. Large deliveries (100K+ episodes) are sharded across multiple HDF5 files with a manifest JSON that maps episode IDs to file paths."
      ]
    }
  ],
  "faqs": [
    {
      "question": "What compression should I use for robotics HDF5 files?",
      "answer": "LZ4 offers the best balance of compression ratio and decompression speed for GPU-bound training pipelines, achieving 2-3x compression on image data while decompressing at over 3 GB/s on modern CPUs. GZIP achieves better compression ratios (3-5x) but decompresses 5-10x slower, making it better for archival or storage-constrained scenarios. For the best overall compression, Blosc with LZ4 backend and shuffle filter can achieve near-GZIP ratios at near-LZ4 speed by exploiting the byte-level patterns in floating-point arrays. Install the hdf5plugin Python package to access LZ4 and Blosc codecs. Claru defaults to LZ4 with chunk sizes aligned to single-step reads, and we benchmark decompression throughput against your target GPU utilization."
    },
    {
      "question": "Can HDF5 handle large video datasets?",
      "answer": "Yes. The HDF5 specification supports files up to exabytes, and individual datasets can be larger than available RAM thanks to chunked I/O. For very large robotics datasets (100TB+), the standard practice is to shard across multiple HDF5 files with an index file or manifest JSON mapping episodes to shard paths. Each shard is typically 1-10 GB for optimal filesystem performance. The h5py library supports memory-mapped access via the driver='core' option for datasets that fit in memory, and the swmr=True (Single Writer Multiple Reader) mode enables concurrent reading during data collection. For datasets with hundreds of thousands of video episodes, Claru provides pre-sharded deliveries with a DataLoader-compatible manifest."
    },
    {
      "question": "Is HDF5 compatible with distributed training?",
      "answer": "HDF5 supports parallel I/O via MPI-IO when h5py is built with mpi4py support, but this requires a parallel-enabled HDF5 build which is uncommon in standard conda/pip installations. For simpler distributed training setups, the recommended approach is file sharding: assign different HDF5 shards to different GPU workers, with each worker reading its own subset of episodes. PyTorch's DistributedSampler handles this shard-to-worker mapping. Set the HDF5_USE_FILE_LOCKING=FALSE environment variable to prevent lock contention when multiple processes read the same file. For cloud training, consider converting to zarr or WebDataset since HDF5 lacks native cloud storage streaming."
    },
    {
      "question": "How do I inspect and debug an HDF5 robotics dataset?",
      "answer": "The HDF5 command-line tools provide essential debugging capabilities. Run h5dump -H dataset.hdf5 to print the full group/dataset tree without loading data, showing shapes, dtypes, chunk sizes, and compression filters. Use h5stat dataset.hdf5 for file-level statistics including total size, metadata overhead, and chunk utilization percentage. In Python, h5py's visititems method walks the entire tree: f.visititems(lambda name, obj: print(name, obj.shape if hasattr(obj, 'shape') else 'group')). For visual inspection, HDFView (from the HDF Group) and ViTables provide GUI-based browsing. The robomimic library includes a dataset_states_to_obs.py utility that replays demonstrations and renders observations, which is the gold standard for validating manipulation datasets."
    },
    {
      "question": "How does HDF5 compare to zarr for robotics data?",
      "answer": "HDF5 and zarr are architecturally similar (both offer chunked, compressed N-dimensional arrays with group hierarchies), but they differ in key operational aspects. HDF5 stores everything in a single monolithic file, which simplifies management but prevents concurrent writes and makes cloud access difficult. Zarr stores each chunk as a separate file in a directory or object store, enabling native S3/GCS access and parallel writes from multiple processes. HDF5 has broader tool support (HDFView, h5dump, MATLAB, C/C++ libraries), while zarr is Python-native with growing support in other languages. For local training on a single machine, HDF5 is more mature and better supported by robomimic and D4RL. For cloud-native or multi-writer workflows, zarr is the better choice. Claru can deliver in either format and provides conversion scripts between them."
    }
  ],
  "ctaHeading": "Get Data in HDF5 Format",
  "ctaDescription": "Claru delivers robotics training data in HDF5 format, ready to load into your pipeline. Tell us your requirements.",
  "relatedGlossaryTerms": [
    "rlds",
    "cross-embodiment-data",
    "data-enrichment"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "fileExtensions": [
    ".hdf5",
    ".h5"
  ],
  "schemaDescription": "HDF5 organizes data hierarchically: /episodes/episode_0/observations/images, /episodes/episode_0/actions, etc. Each group can contain datasets (multi-dimensional arrays) with arbitrary dtypes. Chunked storage enables partial reads, and built-in compression (gzip, lz4, zstd) reduces file size 2-5x. Metadata is stored as HDF5 attributes on groups or datasets.",
  "frameworksUsing": [
    {
      "name": "robomimic",
      "description": "NVIDIA's imitation learning framework uses HDF5 as its native data format for manipulation demonstrations."
    },
    {
      "name": "ManiSkill",
      "description": "The ManiSkill benchmark suite stores trajectories in HDF5 with per-step observations and actions."
    },
    {
      "name": "D4RL",
      "description": "The offline RL benchmark uses HDF5 for all its locomotion and manipulation datasets."
    },
    {
      "name": "RoboCasa",
      "description": "Large-scale simulation benchmark for household robotics, storing demonstrations in robomimic-style HDF5."
    }
  ],
  "conversions": [
    {
      "sourceFormat": "RLDS",
      "toolOrLibrary": "Custom Python (h5py + tensorflow)",
      "complexity": "moderate",
      "notes": "Read TFRecords, write to HDF5 groups preserving episode structure."
    },
    {
      "sourceFormat": "Zarr",
      "toolOrLibrary": "zarr + h5py",
      "complexity": "trivial",
      "notes": "zarr can read/write HDF5 directly via zarr.open(store=zarr.storage.H5Store(...))."
    },
    {
      "sourceFormat": "WebDataset",
      "toolOrLibrary": "Custom Python",
      "complexity": "moderate",
      "notes": "Unpack tar shards, write samples to HDF5 episode groups."
    },
    {
      "sourceFormat": "ROS bag",
      "toolOrLibrary": "rosbag + h5py",
      "complexity": "moderate",
      "notes": "Extract synchronized topics by timestamp, write to episode groups."
    },
    {
      "sourceFormat": "LeRobot (Parquet)",
      "toolOrLibrary": "pandas + h5py",
      "complexity": "moderate",
      "notes": "Read Parquet metadata, decode MP4 frames, write to HDF5 arrays."
    }
  ],
  "keyPapers": [
    {
      "id": "robomimic-2021",
      "title": "robomimic: A Framework for Robot Learning from Demonstration",
      "authors": "Mandlekar et al.",
      "venue": "CoRL 2021",
      "year": 2021,
      "url": "https://arxiv.org/abs/2108.03298"
    },
    {
      "id": "fu-d4rl-2020",
      "title": "D4RL: Datasets for Deep Data-Driven Reinforcement Learning",
      "authors": "Fu et al.",
      "venue": "arXiv 2020",
      "year": 2020,
      "url": "https://arxiv.org/abs/2004.06120"
    },
    {
      "id": "hdf-group-2022",
      "title": "HDF5 Reference Manual",
      "authors": "The HDF Group",
      "venue": "Technical Documentation",
      "year": 2022,
      "url": "https://www.hdfgroup.org/solutions/hdf5/"
    },
    {
      "id": "nasiriany-robocasa-2024",
      "title": "RoboCasa: Large-Scale Simulation of Everyday Tasks for Generalist Robots",
      "authors": "Nasiriany et al.",
      "venue": "RSS 2024",
      "year": 2024,
      "url": "https://arxiv.org/abs/2406.02523"
    },
    {
      "id": "gu-maniskill2-2023",
      "title": "ManiSkill2: A Unified Benchmark for Generalizable Manipulation Skills",
      "authors": "Gu et al.",
      "venue": "ICLR 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2302.04659"
    }
  ],
  "claruDelivery": "Claru delivers HDF5 files with standardized group hierarchy: /episodes/{id}/observations/{modality} and /episodes/{id}/actions. Chunked storage with lz4 compression balances read speed and file size. Metadata attributes include camera calibration, robot URDF paths, and task descriptions. Every delivery is validated against robomimic's SequenceDataset loader."
};

export default data;
