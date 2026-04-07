import type { FormatPageData } from "./types";

const data: FormatPageData = {
  "slug": "zarr",
  "metaTitle": "Zarr (Chunked Array Storage) for Robotics Data | Claru",
  "metaDescription": "Zarr provides chunked, compressed N-dimensional array storage ideal for large robotics datasets. Understand its structure and cloud-native capabilities.",
  "primaryKeyword": "zarr format robotics",
  "secondaryKeywords": [
    "zarr format robotics data",
    "zarr robotics training data",
    "zarr robotics dataset format",
    "zarr robot data",
    "zarr cloud native array storage",
    "zarr v3 robotics"
  ],
  "canonicalPath": "/formats/zarr",
  "h1": "Zarr (Chunked Array Storage): Complete Guide for Robotics Data",
  "heroSubtitle": "Zarr provides chunked, compressed N-dimensional array storage ideal for large robotics datasets. Understand its structure and cloud-native capabilities.",
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
      "label": "Zarr",
      "href": "/formats/zarr"
    }
  ],
  "sections": [
    {
      "type": "prose",
      "heading": "Schema and Structure",
      "paragraphs": [
        "Zarr stores N-dimensional arrays in chunked format with per-chunk compression. A dataset is a directory (or zip file, or cloud object store) containing chunks named by their indices (e.g., 0.0.0, 0.0.1). Metadata in .zarray and .zattrs JSON files describes dtype, shape, chunks, and compressor. Groups organize arrays hierarchically like HDF5.",
        "The fundamental advantage of zarr's architecture is that each chunk is an independent file (or object in a cloud store), which means different chunks can be read, written, or compressed completely independently. This is in stark contrast to HDF5, where the entire file is a single monolithic container with internal addressing. For robotics datasets, this translates to true parallel writes (multiple robots can write different episodes simultaneously to the same zarr store without locking), native cloud access (each chunk is a separate S3/GCS object that can be fetched independently), and incremental updates (adding new episodes does not require rewriting existing data).",
        "Zarr v3, the latest specification, introduces a more flexible metadata system with zarr.json replacing the separate .zarray/.zattrs files, support for variable-length data types (useful for storing natural language instructions alongside fixed-size arrays), and a codec pipeline that allows chaining multiple transformations (e.g., delta encoding followed by Blosc compression) per chunk. The v3 spec also standardizes the storage-agnostic interface, making it easier to swap between local filesystem, S3, GCS, and Azure Blob backends without changing application code."
      ]
    },
    {
      "type": "cards",
      "heading": "Frameworks and Models Using Zarr",
      "cards": [
        {
          "title": "robomimic v2",
          "description": "Recent robomimic versions support zarr as an alternative to HDF5 for manipulation datasets."
        },
        {
          "title": "BridgeData V2",
          "description": "BridgeData V2 uses zarr for efficient cloud-hosted dataset access across research groups."
        },
        {
          "title": "Xarray/Dask",
          "description": "Scientific computing stack for out-of-core array operations on zarr data."
        },
        {
          "title": "Diffusion Policy (Chi et al.)",
          "description": "The original Diffusion Policy codebase uses zarr for storing demonstration datasets."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Reading and Writing Zarr Robotics Data in Python",
      "paragraphs": [
        "Reading a zarr dataset is straightforward with the zarr-python library. Open a local store with z = zarr.open('dataset.zarr', mode='r'), then access arrays as z['episodes/0/observations/image'][:] for a NumPy array. For cloud access, use z = zarr.open('s3://bucket/dataset.zarr', mode='r', storage_options={'anon': False}) with fsspec handling authentication. Slicing works lazily: z['actions'][100:200] only downloads the chunks covering that range, making it efficient to sample random timesteps from a large cloud-hosted dataset.",
        "Writing a new zarr robotics dataset follows the group-creation pattern: root = zarr.open('output.zarr', mode='w'), then for each episode, create groups with ep = root.create_group(f'episodes/{i}') and write data with ep.create_dataset('observations/image', data=images, chunks=(1, 480, 640, 3), compressor=zarr.Blosc(cname='lz4', clevel=5)). The zarr.convenience.copy_store function enables efficient format conversion from HDF5 to zarr (or vice versa) without loading all data into memory. For Diffusion Policy-style datasets, the convention stores observations and actions as flat arrays indexed by timestep with separate episode_ends arrays marking boundaries, which the Diffusion Policy codebase reads via its ReplayBuffer class."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "When to Use Zarr vs Alternatives",
      "description": "Zarr excels in cloud-native and parallel-write scenarios. For local-only workflows with existing tooling, HDF5 may be simpler.",
      "columns": [
        "Format",
        "Cloud Native",
        "Parallel Write",
        "Compression",
        "Tool Ecosystem"
      ],
      "rows": [
        {
          "Format": "Zarr",
          "Cloud Native": "Excellent (S3, GCS, Azure)",
          "Parallel Write": "Yes (per-chunk)",
          "Compression": "Blosc, LZ4, ZSTD, Zlib",
          "Tool Ecosystem": "Python-centric, growing"
        },
        {
          "Format": "HDF5",
          "Cloud Native": "Poor (requires download)",
          "Parallel Write": "MPI-IO only",
          "Compression": "Same codecs + shuffle",
          "Tool Ecosystem": "Mature (C, C++, Java, MATLAB)"
        },
        {
          "Format": "RLDS (TFRecord)",
          "Cloud Native": "GCS via TFDS",
          "Parallel Write": "Via shard separation",
          "Compression": "TFRecord built-in",
          "Tool Ecosystem": "TensorFlow ecosystem"
        },
        {
          "Format": "WebDataset",
          "Cloud Native": "Excellent (HTTP/S3)",
          "Parallel Write": "Via shard separation",
          "Compression": "Per-file in tar",
          "Tool Ecosystem": "PyTorch-centric"
        },
        {
          "Format": "LeRobot (Parquet)",
          "Cloud Native": "HF Hub streaming",
          "Parallel Write": "Via episode partitioning",
          "Compression": "MP4 video + Snappy",
          "Tool Ecosystem": "HuggingFace ecosystem"
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
          "Tool / Library": "zarr.convenience.copy_store",
          "Complexity": "trivial",
          "Notes": "zarr can read HDF5 directly and convert to zarr format."
        },
        {
          "Source Format": "NumPy arrays",
          "Tool / Library": "zarr.save()",
          "Complexity": "trivial",
          "Notes": "Direct conversion from NumPy arrays to zarr chunks."
        },
        {
          "Source Format": "RLDS",
          "Tool / Library": "Custom Python",
          "Complexity": "moderate",
          "Notes": "Read TFRecords, write observation/action arrays as zarr groups."
        },
        {
          "Source Format": "ROS bag",
          "Tool / Library": "rosbag + zarr",
          "Complexity": "moderate",
          "Notes": "Extract synchronized topics, write to zarr groups by episode."
        },
        {
          "Source Format": "LeRobot (Parquet)",
          "Tool / Library": "pandas + zarr",
          "Complexity": "moderate",
          "Notes": "Read Parquet metadata, decode MP4 frames, write to zarr arrays."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Migration Guide: Moving from HDF5 to Zarr",
      "paragraphs": [
        "Migrating from HDF5 to zarr is one of the simplest format conversions in the robotics data ecosystem because zarr was explicitly designed with HDF5 compatibility in mind. The zarr library can read HDF5 files directly via zarr.open(h5py.File('data.hdf5', 'r'), mode='r'), which presents the HDF5 hierarchy as a zarr group tree. For a full conversion, zarr.convenience.copy_store copies all groups, datasets, attributes, and compression settings from HDF5 to a zarr store in a single call. The converted zarr store maintains the same group hierarchy, so code that accesses data by path (e.g., root['episodes/0/observations/image']) works identically on both formats.",
        "The primary migration decision is chunk layout. HDF5 and zarr use the same chunking concept, but zarr's per-chunk-file architecture means that very small chunks (e.g., 1 KB each) create millions of tiny files that overwhelm filesystem metadata operations. For robotics data on S3, the optimal chunk size is 1-10 MB per chunk, which typically means chunking images as (32, H, W, 3) rather than (1, H, W, 3) to avoid excessive S3 GET requests during training. The zarr.rechunk function (from the rechunker package) can re-chunk an existing zarr store without loading all data into memory.",
        "After migration, update your data loading code to use zarr.open() instead of h5py.File(). For Diffusion Policy users, the framework already expects zarr stores and no code changes are needed. For robomimic users, the ZarrDataset class provides a drop-in replacement for the HDF5-based SequenceDataset. Test your training pipeline end-to-end after migration, paying attention to data loading throughput: zarr's parallel chunk reads can improve throughput 2-4x over HDF5 on multi-core machines."
      ]
    },
    {
      "type": "citation-list",
      "heading": "References",
      "citations": [
        {
          "id": "zarr-dev-2022",
          "title": "Zarr: An Implementation of Chunked, Compressed, N-Dimensional Arrays",
          "authors": "Zarr Development Team",
          "venue": "zarr-python Documentation",
          "year": 2022,
          "url": "https://zarr.readthedocs.io/"
        },
        {
          "id": "walke-bridge-2024",
          "title": "BridgeData V2: A Dataset for Robot Learning at Scale",
          "authors": "Walke et al.",
          "venue": "CoRL 2024",
          "year": 2024,
          "url": "https://arxiv.org/abs/2308.12952"
        },
        {
          "id": "chi-diffusion-2023",
          "title": "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
          "authors": "Chi et al.",
          "venue": "RSS 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2303.04137"
        },
        {
          "id": "miles-zarr-2024",
          "title": "Zarr v3 Specification",
          "authors": "Zarr Community",
          "venue": "Zarr Specs",
          "year": 2024,
          "url": "https://zarr-specs.readthedocs.io/en/latest/v3/core/v3.0.html"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Claru Data Delivery in Zarr Format",
      "paragraphs": [
        "Claru delivers zarr datasets with optimized chunk sizes for your access patterns -- contiguous episode reads or random step access. Cloud-hosted zarr stores on S3 enable direct streaming without local download.",
        "Every zarr delivery is tuned for your specific infrastructure. For cloud training clusters, we host zarr stores on S3 with chunk sizes optimized for your batch size and number of data-loading workers, typically targeting 2-8 MB per chunk. For local workstations, we deliver consolidated zarr stores (zarr.convenience.consolidate_metadata) that eliminate the per-chunk metadata lookups that can slow down initial dataset scanning. We include a zarr-compatible DataLoader implementation that handles parallel chunk fetching, episode shuffling, and prefetching, tested to saturate GPU utilization on A100 and H100 training rigs."
      ]
    }
  ],
  "faqs": [
    {
      "question": "How does zarr compare to HDF5?",
      "answer": "Zarr and HDF5 share the same core abstraction (chunked, compressed N-dimensional arrays organized in group hierarchies), but they differ fundamentally in storage architecture. HDF5 stores everything in a single monolithic file with internal addressing, while zarr stores each chunk as a separate filesystem file or cloud object. This gives zarr three major advantages: native cloud storage support (each chunk is an independent S3/GCS object), true parallel writes (multiple processes can write different chunks without locking), and incremental updates (adding episodes does not require rewriting the file). HDF5 has broader language support (C, C++, Java, MATLAB, Fortran bindings), a more mature tool ecosystem (HDFView, h5dump, h5repack), and slightly better performance for sequential local reads. For new robotics projects, zarr is increasingly preferred, especially for cloud-native or multi-robot data collection workflows."
    },
    {
      "question": "Can zarr be accessed from S3 directly?",
      "answer": "Yes, and this is zarr's primary advantage over HDF5. Zarr supports S3, GCS, Azure Blob Storage, and HTTP endpoints as storage backends via the fsspec library. To open an S3-hosted zarr store, use zarr.open('s3://your-bucket/dataset.zarr', mode='r', storage_options={'key': 'ACCESS_KEY', 'secret': 'SECRET_KEY'}). Each array slice only downloads the chunks needed for that slice, so reading a single episode from a 10TB dataset transfers only megabytes. For authenticated access, pass AWS credentials via storage_options or rely on IAM roles. The s3fs library handles connection pooling and retry logic automatically. Claru delivers zarr stores on S3 with pre-configured IAM policies for your team's AWS accounts."
    },
    {
      "question": "What chunk size should I use for robotics data?",
      "answer": "Chunk sizing depends on your access patterns and storage backend. For cloud storage (S3/GCS), target 1-10 MB per chunk to balance request overhead against granularity. For image arrays at 480x640x3 uint8, this means chunking as (8, 480, 640, 3) to (32, 480, 640, 3) rather than single-frame chunks. For proprioceptive data (joint states, forces), chunk along the time axis at 500-2000 steps per chunk. On local SSDs, smaller chunks (256 KB - 1 MB) work well because filesystem overhead is minimal. The rechunker package (pip install rechunker) can re-chunk an existing zarr store to different chunk sizes without loading all data into memory, which is essential for tuning performance after initial dataset creation. Claru benchmarks chunk sizes against your specific training pipeline before delivery."
    },
    {
      "question": "Does zarr support concurrent reads and writes?",
      "answer": "Zarr supports concurrent reads from any number of processes by design, since each chunk is an independent file. Concurrent writes are also supported as long as different processes write to different chunks (which naturally happens when different robots or collection workers write different episodes). The zarr.sync module provides a ProcessSynchronizer and ThreadSynchronizer for coordinating writes to the same chunk from multiple processes, though this is rarely needed in robotics data collection. For multi-robot fleet data collection, the recommended pattern is to have each robot write to a separate zarr group (e.g., root/robot_0, root/robot_1) and merge them after collection using zarr's group copy operations. This avoids any coordination overhead during the time-critical collection phase."
    },
    {
      "question": "How do I consolidate zarr metadata for faster initial loading?",
      "answer": "By default, opening a zarr store requires reading metadata files (.zarray, .zattrs, .zgroup) from every group and array in the hierarchy, which can result in hundreds of HTTP requests for a large dataset on cloud storage. The zarr.convenience.consolidate_metadata function reads all metadata into a single .zmetadata file at the root of the store, reducing the initial scan to a single request. Call it after writing your dataset: zarr.consolidate_metadata('s3://bucket/dataset.zarr'). When opening a consolidated store, use zarr.open_consolidated() instead of zarr.open(). This is especially important for S3-hosted datasets where each metadata file is a separate GET request with ~50ms latency. Claru delivers all cloud-hosted zarr stores with pre-consolidated metadata."
    }
  ],
  "ctaHeading": "Get Data in Zarr Format",
  "ctaDescription": "Claru delivers robotics training data in Zarr format, ready to load into your pipeline. Tell us your requirements.",
  "relatedGlossaryTerms": [
    "rlds",
    "cross-embodiment-data",
    "data-enrichment"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "fileExtensions": [
    ".zarr",
    ".zip"
  ],
  "schemaDescription": "Zarr stores N-dimensional arrays in chunked format with per-chunk compression. A dataset is a directory (or zip file, or cloud object store) containing chunks named by their indices (e.g., 0.0.0, 0.0.1). Metadata in .zarray and .zattrs JSON files describes dtype, shape, chunks, and compressor. Groups organize arrays hierarchically like HDF5.",
  "frameworksUsing": [
    {
      "name": "robomimic v2",
      "description": "Recent robomimic versions support zarr as an alternative to HDF5."
    },
    {
      "name": "BridgeData V2",
      "description": "BridgeData V2 uses zarr for efficient cloud-hosted dataset access."
    },
    {
      "name": "Xarray/Dask",
      "description": "Scientific computing stack for out-of-core array operations on zarr data."
    },
    {
      "name": "Diffusion Policy (Chi et al.)",
      "description": "The original Diffusion Policy codebase uses zarr for storing demonstration datasets."
    }
  ],
  "conversions": [
    {
      "sourceFormat": "HDF5",
      "toolOrLibrary": "zarr.convenience.copy_store",
      "complexity": "trivial",
      "notes": "zarr can read HDF5 directly and convert to zarr format."
    },
    {
      "sourceFormat": "NumPy arrays",
      "toolOrLibrary": "zarr.save()",
      "complexity": "trivial",
      "notes": "Direct conversion from NumPy arrays to zarr chunks."
    },
    {
      "sourceFormat": "RLDS",
      "toolOrLibrary": "Custom Python",
      "complexity": "moderate",
      "notes": "Read TFRecords, write observation/action arrays as zarr groups."
    },
    {
      "sourceFormat": "ROS bag",
      "toolOrLibrary": "rosbag + zarr",
      "complexity": "moderate",
      "notes": "Extract synchronized topics, write to zarr groups by episode."
    },
    {
      "sourceFormat": "LeRobot (Parquet)",
      "toolOrLibrary": "pandas + zarr",
      "complexity": "moderate",
      "notes": "Read Parquet metadata, decode MP4 frames, write to zarr arrays."
    }
  ],
  "keyPapers": [
    {
      "id": "zarr-dev-2022",
      "title": "Zarr: An Implementation of Chunked, Compressed, N-Dimensional Arrays",
      "authors": "Zarr Development Team",
      "venue": "zarr-python Documentation",
      "year": 2022,
      "url": "https://zarr.readthedocs.io/"
    },
    {
      "id": "walke-bridge-2024",
      "title": "BridgeData V2: A Dataset for Robot Learning at Scale",
      "authors": "Walke et al.",
      "venue": "CoRL 2024",
      "year": 2024,
      "url": "https://arxiv.org/abs/2308.12952"
    },
    {
      "id": "chi-diffusion-2023",
      "title": "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      "authors": "Chi et al.",
      "venue": "RSS 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2303.04137"
    },
    {
      "id": "miles-zarr-2024",
      "title": "Zarr v3 Specification",
      "authors": "Zarr Community",
      "venue": "Zarr Specs",
      "year": 2024,
      "url": "https://zarr-specs.readthedocs.io/en/latest/v3/core/v3.0.html"
    }
  ],
  "claruDelivery": "Claru delivers zarr datasets with optimized chunk sizes for your access patterns -- contiguous episode reads or random step access. Cloud-hosted zarr stores on S3 enable direct streaming without local download. All cloud deliveries include pre-consolidated metadata for fast initial loading."
};

export default data;
