import type { FormatPageData } from "./types";

const data: FormatPageData = {
  "slug": "webdataset",
  "metaTitle": "WebDataset (Tar-based Shards) for Robotics Data | Claru",
  "metaDescription": "WebDataset uses tar archives for efficient sequential I/O in large-scale training. Understand the shard format, streaming capability, and Claru's WebDataset delivery.",
  "primaryKeyword": "WebDataset format robotics",
  "secondaryKeywords": [
    "WebDataset format robotics data",
    "WebDataset robotics training data",
    "WebDataset robotics dataset format",
    "webdataset robot data",
    "tar shard training data",
    "WebDataset streaming S3",
    "distributed training dataset format"
  ],
  "canonicalPath": "/formats/webdataset",
  "h1": "WebDataset (Tar-based Shards): Complete Guide for Robotics Data",
  "heroSubtitle": "WebDataset uses tar archives for efficient sequential I/O in large-scale training. Understand the shard format, streaming capability, and Claru's WebDataset delivery.",
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
      "label": "WebDataset",
      "href": "/formats/webdataset"
    }
  ],
  "sections": [
    {
      "type": "prose",
      "heading": "Schema and Structure",
      "paragraphs": [
        "WebDataset, created by Thomas Breuel (formerly at Google Brain and NVIDIA), stores training samples as consecutive entries in standard POSIX tar archives. Each sample consists of multiple files sharing a common key prefix: 000042.jpg (image), 000042.json (metadata), 000042.actions.npy (action vector), 000042.state.npy (proprioceptive state). The key is everything before the first dot in the filename, and the extension determines the data type. This convention means that any file format can be embedded in a WebDataset shard: JPEG images, NumPy arrays, JSON metadata, PNG depth maps, protobuf messages, or raw binary blobs. Shards are typically 100 MB to 1 GB tar files named with a pattern like shard-{000000..001000}.tar, and the library supports brace expansion for specifying shard ranges in URLs.",
        "The naming convention is the core design insight of WebDataset. Within a tar shard, files are grouped into samples by their shared key prefix. The webdataset Python library (pip install webdataset) handles this grouping automatically during iteration, yielding dictionaries with extension-based keys: {'jpg': image_bytes, 'json': metadata_dict, 'actions.npy': action_array, 'state.npy': state_array}. Built-in decoders automatically handle common formats: JPEG/PNG images are decoded to PIL Images or NumPy arrays, .npy files are loaded as NumPy arrays, .json files are parsed to dictionaries, and .txt files are read as strings. Custom decoders can be registered for domain-specific formats via wds.decode(custom_handler).",
        "For distributed training, WebDataset's shard-based architecture provides a natural parallelism unit. Each GPU worker loads a different subset of shards, and the ResampledShards or ShardList classes handle shard-to-worker assignment with configurable shuffling granularity. Because tar files support efficient sequential streaming, data can flow directly from S3, GCS, or HTTP endpoints to GPU memory without intermediate disk writes, using standard Python HTTP libraries. The webdataset.ShardWriter class creates new shards automatically when the current shard exceeds a configurable maximum size (default 1 GB) or sample count (default 100,000), distributing samples evenly across shards for balanced distributed loading. This design achieves near-linear scaling: 8 GPU workers reading 8 shards simultaneously achieve 8x the throughput of a single worker."
      ]
    },
    {
      "type": "cards",
      "heading": "Frameworks and Models Using WebDataset",
      "cards": [
        {
          "title": "PyTorch DataPipes",
          "description": "WebDataset integrates with PyTorch's DataPipe system via torchdata, providing composable data loading primitives for distributed training."
        },
        {
          "title": "Hugging Face Datasets",
          "description": "The datasets library can stream WebDataset shards from Hugging Face Hub and S3, with automatic sample decoding and batching."
        },
        {
          "title": "NVIDIA DALI",
          "description": "NVIDIA's GPU-accelerated data loading library supports WebDataset as an input format, decoding images directly on GPU memory."
        },
        {
          "title": "OpenCLIP / LAION",
          "description": "The LAION-5B dataset (5 billion image-text pairs) and OpenCLIP training pipeline use WebDataset as their exclusive data format."
        },
        {
          "title": "Stable Diffusion training",
          "description": "Large-scale diffusion model training (Stable Diffusion, SDXL) uses WebDataset shards for efficient multi-node image-text pair loading."
        },
        {
          "title": "img2dataset",
          "description": "The standard tool for downloading and creating large-scale image datasets outputs WebDataset shards with configurable shard sizes."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Reading and Writing WebDataset in Python",
      "paragraphs": [
        "Reading a WebDataset is a single pipeline expression: dataset = wds.WebDataset('shards/shard-{000000..000099}.tar').decode('pil').to_tuple('jpg', 'json'). This loads 100 shards, decodes JPEG images as PIL Images, and yields (image, metadata) tuples. For PyTorch training: dataloader = wds.WebLoader(dataset, batch_size=32, num_workers=4) provides a standard DataLoader interface with automatic shard resampling for distributed training. The pipeline supports chaining operations: .shuffle(1000) shuffles samples within a 1000-sample buffer, .batched(32) creates batches, and .map(transform_fn) applies arbitrary transformations.",
        "Writing WebDataset shards uses the ShardWriter class: with wds.ShardWriter('output/shard-%06d.tar', maxcount=10000, maxsize=1e9) as sink: for each sample, sink.write({'__key__': f'{i:06d}', 'jpg': image_bytes, 'json': metadata_dict, 'actions.npy': action_array}). The __key__ field sets the sample key prefix, and other dictionary entries are written as files with the corresponding extension. ShardWriter automatically creates new shards when the current shard exceeds maxsize bytes or maxcount samples. For images, pass raw JPEG/PNG bytes (not decoded arrays) to avoid re-encoding overhead. For NumPy arrays, the .npy extension triggers automatic np.save encoding.",
        "For cloud-native training, WebDataset supports streaming from any URL that tar files can be served from. Reading from S3: dataset = wds.WebDataset('pipe:aws s3 cp s3://bucket/shard-{000..099}.tar -') streams shards through the AWS CLI. For HTTP: dataset = wds.WebDataset('https://host/shards/shard-{000..099}.tar') fetches shards via standard HTTP GET requests. The pipe: prefix enables arbitrary shell commands as data sources, supporting custom authentication, caching, and compression. For maximum throughput on cloud storage, the wds.WebDataset class supports parallel shard fetching via the shardshuffle parameter, overlapping network I/O with GPU computation."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "When to Use WebDataset vs Alternatives",
      "description": "WebDataset excels at large-scale distributed training but has tradeoffs for other access patterns.",
      "columns": [
        "Format",
        "Best For",
        "Random Access",
        "Cloud Streaming",
        "Write Pattern"
      ],
      "rows": [
        {
          "Format": "WebDataset",
          "Best For": "Large-scale distributed GPU training",
          "Random Access": "Poor (sequential tar)",
          "Cloud Streaming": "Excellent (S3/HTTP/GCS)",
          "Write Pattern": "Write-once, read-many"
        },
        {
          "Format": "HDF5",
          "Best For": "Local training, random frame access",
          "Random Access": "Excellent (chunked)",
          "Cloud Streaming": "Poor (monolithic file)",
          "Write Pattern": "Read-write"
        },
        {
          "Format": "RLDS (TFRecord)",
          "Best For": "TF/JAX ecosystem, Open X-Embodiment",
          "Random Access": "Moderate (shard + seek)",
          "Cloud Streaming": "Good (GCS via TFDS)",
          "Write Pattern": "Write-once"
        },
        {
          "Format": "LeRobot (Parquet+MP4)",
          "Best For": "HuggingFace robotics ecosystem",
          "Random Access": "Moderate (Parquet index)",
          "Cloud Streaming": "Good (HF Hub)",
          "Write Pattern": "Read-write (Parquet)"
        },
        {
          "Format": "Zarr",
          "Best For": "Cloud-native array access",
          "Random Access": "Excellent (per-chunk files)",
          "Cloud Streaming": "Excellent (S3/GCS native)",
          "Write Pattern": "Parallel write"
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
          "Tool / Library": "webdataset.ShardWriter + h5py",
          "Complexity": "moderate",
          "Notes": "Read HDF5 episodes, write each step as a tar sample with image, state, and action files."
        },
        {
          "Source Format": "RLDS (TFRecord)",
          "Tool / Library": "Custom Python (tensorflow + webdataset)",
          "Complexity": "moderate",
          "Notes": "Iterate TFRecord episodes and steps, write each step as a WebDataset sample with extension-mapped fields."
        },
        {
          "Source Format": "Individual files (images + labels)",
          "Tool / Library": "webdataset.ShardWriter",
          "Complexity": "trivial",
          "Notes": "Read files, write to tar shards: sink.write({'__key__': name, 'jpg': open(img).read(), 'json': label})."
        },
        {
          "Source Format": "img2dataset URLs",
          "Tool / Library": "img2dataset CLI",
          "Complexity": "trivial",
          "Notes": "img2dataset directly outputs WebDataset shards from URL lists with parallel downloading and resizing."
        },
        {
          "Source Format": "Parquet / CSV metadata + files",
          "Tool / Library": "Custom Python (pyarrow + webdataset)",
          "Complexity": "moderate",
          "Notes": "Read metadata from Parquet, load referenced files, write samples to WebDataset shards."
        },
        {
          "Source Format": "ROS bag",
          "Tool / Library": "Custom Python (rosbags + webdataset)",
          "Complexity": "moderate",
          "Notes": "Extract synchronized sensor data per timestep, write each step as a multi-file WebDataset sample."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "WebDataset for Robotics Training at Scale",
      "paragraphs": [
        "WebDataset has become the format of choice for large-scale vision model training, and this approach is increasingly adopted for robotics foundation models. The LAION-5B dataset (5.85 billion image-text pairs, ~240 TB) is stored entirely as WebDataset shards, and the OpenCLIP training pipeline reads these shards at over 10,000 samples per second per GPU node using WebDataset's streaming architecture. For robotics, the same pattern applies when training vision-language-action models or large-scale perception models on millions of trajectory steps: each step becomes a WebDataset sample with image, proprioceptive state, action, and language instruction as separate files within the shard.",
        "The key performance advantage of WebDataset over random-access formats (HDF5, Zarr) is its sequential I/O pattern. Modern storage systems (NVMe SSDs, cloud object stores) achieve maximum throughput on sequential reads: NVMe SSDs deliver 3-7 GB/s sequential versus 0.5-1 GB/s random, and S3 delivers roughly 100 MB/s per stream with practically unlimited parallel streams. WebDataset exploits this by reading each shard as a single sequential stream, achieving near-theoretical-maximum storage throughput. For a training cluster reading 64 shards in parallel from S3, this translates to 6+ GB/s aggregate throughput, which is sufficient to keep 8 A100 GPUs fully utilized on image-based training.",
        "For multi-modal robotics data, WebDataset's file-per-field approach maps naturally to the heterogeneous data types in robot demonstrations. A single WebDataset sample for a manipulation demonstration step might contain: 000042.cam0.jpg (overhead camera, JPEG compressed), 000042.cam1.jpg (wrist camera), 000042.depth.png (16-bit depth map), 000042.state.npy (7-DoF joint positions as float32), 000042.action.npy (7-DoF action vector), 000042.language.txt (natural language instruction), and 000042.meta.json (episode ID, timestamp, task label). The webdataset decoder handles each format appropriately based on extension, and custom decoders can handle domain-specific formats like compressed point clouds."
      ]
    },
    {
      "type": "citation-list",
      "heading": "References",
      "citations": [
        {
          "id": "breuel-webdataset-2023",
          "title": "WebDataset: A Python Library for Large-Scale Deep Learning Data I/O",
          "authors": "Breuel",
          "venue": "GitHub / PyPI",
          "year": 2023,
          "url": "https://github.com/webdataset/webdataset"
        },
        {
          "id": "schuhmann-laion5b-2022",
          "title": "LAION-5B: An Open Large-Scale Dataset for Training Next Generation Image-Text Models",
          "authors": "Schuhmann et al.",
          "venue": "NeurIPS 2022 (Datasets & Benchmarks)",
          "year": 2022,
          "url": "https://arxiv.org/abs/2210.08402"
        },
        {
          "id": "cherti-openclip-2023",
          "title": "Reproducible Scaling Laws for Contrastive Language-Image Learning",
          "authors": "Cherti et al.",
          "venue": "CVPR 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2212.07143"
        },
        {
          "id": "beaumont-img2dataset-2022",
          "title": "img2dataset: Easily turn large sets of image urls to an image dataset",
          "authors": "Beaumont",
          "venue": "GitHub",
          "year": 2022,
          "url": "https://github.com/rom1504/img2dataset"
        },
        {
          "id": "pytorch-datapipes-2022",
          "title": "TorchData: PyTorch Data Loading Utilities",
          "authors": "PyTorch Team",
          "venue": "PyTorch Documentation",
          "year": 2022,
          "url": "https://pytorch.org/data/"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Claru Data Delivery in WebDataset Format",
      "paragraphs": [
        "Claru delivers WebDataset shards optimized for your training cluster: shard sizes tuned to your storage backend (100 MB for NFS, 500 MB-1 GB for S3/GCS), consistent sample counts per shard for balanced distributed loading, and S3-compatible URLs for direct streaming with no local download required. Each shard contains multi-modal samples with JPEG-compressed images, NumPy arrays for proprioceptive state and actions, JSON metadata, and optional language instruction text files.",
        "Every delivery includes a shard manifest (JSON file listing all shard URLs, total sample count, and per-shard statistics) that integrates with distributed training coordinators. For teams using NVIDIA DALI, we provide DALI-compatible shard specifications. For teams using PyTorch DataPipes, we include a pre-built DataPipe configuration. Shard contents are validated for consistency (all samples have the same set of extensions, all arrays have consistent shapes) and a sample verification script is provided. For incremental data deliveries (adding new collection batches to an existing training set), new shards follow the existing naming convention and the manifest is updated atomically."
      ]
    }
  ],
  "faqs": [
    {
      "question": "Can WebDataset stream directly from S3 or GCS?",
      "answer": "Yes. WebDataset natively supports streaming from S3, GCS, HTTP, and any storage backend accessible via shell commands. For S3: wds.WebDataset('pipe:aws s3 cp s3://bucket/shard-{000..099}.tar -') streams shards through the AWS CLI with automatic credential handling. For HTTP: wds.WebDataset('https://host/shards/shard-{000..099}.tar') uses standard HTTP GET. For GCS: pipe:gsutil cp gs://bucket/shard-{000..099}.tar -. No local download is needed -- data flows directly from cloud storage to your training pipeline, and multiple shards are fetched in parallel for maximum throughput."
    },
    {
      "question": "How large should WebDataset shards be?",
      "answer": "100 MB to 1 GB per shard balances I/O efficiency with shuffling granularity and distributed load balancing. Smaller shards (100-200 MB) provide finer shuffling granularity (important for convergence on heterogeneous datasets) and better load balancing across workers, but add per-shard overhead. Larger shards (500 MB-1 GB) maximize sequential I/O throughput and minimize the number of HTTP connections for cloud streaming. For robotics datasets, a practical guideline is: 100 MB for local NFS training, 500 MB for S3/GCS streaming, and match your shard count to at least 10x your GPU count for good load balancing. Claru tunes shard sizes based on your specific training infrastructure."
    },
    {
      "question": "Is WebDataset good for robotics data with multiple modalities?",
      "answer": "Excellent. Each WebDataset sample can contain arbitrary file types grouped by a shared key prefix, naturally handling multi-modal robotics data. A single sample for a manipulation step might contain camera images (.jpg), depth maps (.depth.png), joint states (.state.npy), action vectors (.action.npy), force/torque readings (.ft.npy), language instructions (.txt), and metadata (.json). The webdataset library automatically groups files by key prefix and provides extension-based decoding. Custom decoders can handle domain-specific formats. This per-sample multi-file approach is more flexible than column-oriented formats when different modalities need different compression strategies."
    },
    {
      "question": "How does WebDataset handle shuffling for training?",
      "answer": "WebDataset provides two levels of shuffling. Shard-level shuffling: the ShardList or ResampledShards classes randomize the order in which shards are read, providing coarse-grained shuffling. Sample-level shuffling: the .shuffle(buffer_size) operation maintains a buffer of N samples and yields them in random order, providing fine-grained shuffling within the sequential read stream. A typical configuration uses both: wds.WebDataset(urls).shuffle(5000).decode('pil').batched(32). The buffer size controls the tradeoff between shuffling quality and memory usage. For robotics datasets where episodes should not be split across shards, ensure each shard contains complete episodes and shard-level shuffling provides episode-level randomization."
    },
    {
      "question": "Can I do random access with WebDataset?",
      "answer": "Standard WebDataset is optimized for sequential access and does not support efficient random access to individual samples. If you need random access (e.g., sampling specific episodes by ID), consider: (1) building a shard index that maps sample keys to (shard_path, offset) pairs, enabling seeking to specific samples within a shard; (2) using the wds.cached_tarfile module for repeated access to the same shards; or (3) using a complementary format like HDF5 or Zarr for random access workloads while keeping WebDataset for training. For most ML training, sequential access with shuffling is sufficient and provides better throughput than random access patterns."
    }
  ],
  "ctaHeading": "Get Data in WebDataset Format",
  "ctaDescription": "Claru delivers WebDataset shards optimized for your training cluster with S3-compatible streaming URLs and balanced distributed loading. Tell us your requirements.",
  "relatedGlossaryTerms": [
    "rlds",
    "cross-embodiment-data",
    "data-enrichment"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "fileExtensions": [
    ".tar",
    ".tar.gz"
  ],
  "schemaDescription": "WebDataset stores training samples as consecutive entries in standard POSIX tar archives. Related files share a common key prefix (e.g., 000042.jpg, 000042.json, 000042.actions.npy) and are grouped into samples by the library. Shards are typically 100 MB-1 GB tar files named with brace expansion patterns (shard-{000000..NNNNNN}.tar). The format supports streaming from S3, GCS, and HTTP without local download, with built-in decoders for JPEG/PNG images, NumPy arrays, JSON, and custom formats. ShardWriter creates balanced shards with configurable maximum size and sample count.",
  "frameworksUsing": [
    {
      "name": "PyTorch DataPipes",
      "description": "WebDataset integrates with PyTorch's DataPipe system via torchdata for composable distributed data loading."
    },
    {
      "name": "Hugging Face Datasets",
      "description": "The datasets library streams WebDataset shards from Hugging Face Hub and S3 with automatic sample decoding.",
      "url": "https://github.com/huggingface/datasets"
    },
    {
      "name": "NVIDIA DALI",
      "description": "GPU-accelerated data loading library supporting WebDataset as input with on-GPU image decoding.",
      "url": "https://developer.nvidia.com/dali"
    },
    {
      "name": "OpenCLIP / LAION",
      "description": "LAION-5B (5.85B image-text pairs) and OpenCLIP training use WebDataset as their exclusive data format.",
      "url": "https://github.com/mlfoundations/open_clip"
    },
    {
      "name": "img2dataset",
      "description": "Standard tool for creating large-scale image datasets from URL lists, outputting WebDataset shards with parallel downloading.",
      "url": "https://github.com/rom1504/img2dataset"
    },
    {
      "name": "Stable Diffusion training",
      "description": "Large-scale diffusion model training (SD, SDXL) uses WebDataset shards for efficient multi-node image-text pair loading."
    }
  ],
  "conversions": [
    {
      "sourceFormat": "HDF5",
      "toolOrLibrary": "webdataset.ShardWriter + h5py",
      "complexity": "moderate",
      "notes": "Read HDF5 episodes, write each step as a tar sample with image, state, and action files."
    },
    {
      "sourceFormat": "RLDS (TFRecord)",
      "toolOrLibrary": "Custom Python (tensorflow + webdataset)",
      "complexity": "moderate",
      "notes": "Iterate TFRecord episodes and steps, write each step as a WebDataset sample."
    },
    {
      "sourceFormat": "Individual files",
      "toolOrLibrary": "webdataset.ShardWriter",
      "complexity": "trivial",
      "notes": "Read files and write to tar shards using the ShardWriter API."
    },
    {
      "sourceFormat": "URL list (images)",
      "toolOrLibrary": "img2dataset",
      "complexity": "trivial",
      "notes": "img2dataset downloads and creates WebDataset shards from URL lists with parallel fetching and resizing."
    },
    {
      "sourceFormat": "Parquet metadata + files",
      "toolOrLibrary": "Custom Python (pyarrow + webdataset)",
      "complexity": "moderate",
      "notes": "Read metadata from Parquet, load referenced files, write samples to WebDataset shards."
    },
    {
      "sourceFormat": "ROS bag",
      "toolOrLibrary": "Custom Python (rosbags + webdataset)",
      "complexity": "moderate",
      "notes": "Extract synchronized sensor data per timestep, write each step as a multi-file WebDataset sample."
    }
  ],
  "keyPapers": [
    {
      "id": "breuel-webdataset-2023",
      "title": "WebDataset: A Python Library for Large-Scale Deep Learning Data I/O",
      "authors": "Breuel",
      "venue": "GitHub / PyPI",
      "year": 2023,
      "url": "https://github.com/webdataset/webdataset"
    },
    {
      "id": "schuhmann-laion5b-2022",
      "title": "LAION-5B: An Open Large-Scale Dataset for Training Next Generation Image-Text Models",
      "authors": "Schuhmann et al.",
      "venue": "NeurIPS 2022 (Datasets & Benchmarks)",
      "year": 2022,
      "url": "https://arxiv.org/abs/2210.08402"
    },
    {
      "id": "cherti-openclip-2023",
      "title": "Reproducible Scaling Laws for Contrastive Language-Image Learning",
      "authors": "Cherti et al.",
      "venue": "CVPR 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2212.07143"
    },
    {
      "id": "beaumont-img2dataset-2022",
      "title": "img2dataset: Easily turn large sets of image urls to an image dataset",
      "authors": "Beaumont",
      "venue": "GitHub",
      "year": 2022,
      "url": "https://github.com/rom1504/img2dataset"
    },
    {
      "id": "pytorch-datapipes-2022",
      "title": "TorchData: PyTorch Data Loading Utilities",
      "authors": "PyTorch Team",
      "venue": "PyTorch Documentation",
      "year": 2022,
      "url": "https://pytorch.org/data/"
    }
  ],
  "claruDelivery": "Claru delivers WebDataset shards optimized for your training cluster: shard sizes tuned to your storage backend, S3-compatible URLs for direct streaming, balanced sample counts per shard for distributed training, and shard manifests for training coordinator integration. Each delivery includes multi-modal samples with JPEG images, NumPy arrays, JSON metadata, and optional language instructions, validated for consistency across all shards."
};

export default data;
