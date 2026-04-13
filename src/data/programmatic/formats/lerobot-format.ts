import type { FormatPageData } from "./types";

const data: FormatPageData = {
  "slug": "lerobot-format",
  "metaTitle": "LeRobot Format for Robotics Data | Claru",
  "metaDescription": "LeRobot is Hugging Face's open-source robotics framework with its own dataset format. Learn the schema, ecosystem, and how Claru delivers LeRobot-compatible data.",
  "primaryKeyword": "LeRobot format robotics",
  "secondaryKeywords": [
    "LeRobot format robotics data",
    "LeRobot robotics training data",
    "LeRobot robotics dataset format",
    "lerobot hugging face robotics",
    "lerobot dataset hub",
    "act diffusion policy data format"
  ],
  "canonicalPath": "/formats/lerobot-format",
  "h1": "LeRobot Format: Complete Guide for Robotics Data",
  "heroSubtitle": "LeRobot is Hugging Face's open-source robotics framework with its own dataset format. Learn the schema, ecosystem, and how Claru delivers LeRobot-compatible data.",
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
      "label": "LeRobot Format",
      "href": "/formats/lerobot-format"
    }
  ],
  "sections": [
    {
      "type": "prose",
      "heading": "Schema and Structure",
      "paragraphs": [
        "LeRobot datasets are stored on Hugging Face Hub with a specific structure: episodes stored in Parquet files with observation columns (images as paths, proprioceptive state as arrays) and action columns. Video frames are stored separately as MP4 files referenced by episode/frame indices. Metadata is in a dataset_info.json with robot config, fps, and feature descriptions.",
        "The LeRobot v2 dataset format represents a significant evolution in how robotics data is organized. Each dataset consists of three core components: a metadata directory containing info.json (dataset-level configuration including fps, robot type, and feature definitions), episode Parquet files partitioned by episode index, and video directories organized by camera name. The Parquet files store one row per timestep with columns for episode_index, frame_index, timestamp, state vectors (as fixed-length arrays), action vectors, and boolean flags like next.done. Image observations are not embedded in the Parquet files but instead stored as MP4 video files at videos/{camera_name}/episode_{index}.mp4, with the Parquet rows providing frame-level indexing into these videos.",
        "This separation of tabular data (Parquet) from visual data (MP4) is a deliberate design choice that reduces storage by 90%+ compared to per-frame image storage, while enabling efficient video compression across temporal frames. The info.json file defines every feature's dtype, shape, and names array (e.g., joint names for state vectors), making datasets fully self-describing. LeRobot v2 also introduced a standardized task column and episode-level task mapping, enabling multi-task datasets where different episodes correspond to different instructions."
      ]
    },
    {
      "type": "cards",
      "heading": "Frameworks and Models Using LeRobot Format",
      "cards": [
        {
          "title": "LeRobot Framework",
          "description": "Hugging Face's complete robot learning framework for training and evaluating policies."
        },
        {
          "title": "ACT (Action Chunking Transformer)",
          "description": "Trained on LeRobot-formatted data for bimanual manipulation tasks."
        },
        {
          "title": "Diffusion Policy",
          "description": "LeRobot includes Diffusion Policy implementation consuming LeRobot datasets natively."
        },
        {
          "title": "pi0 / Physical Intelligence",
          "description": "Physical Intelligence's foundation model consumes data compatible with the LeRobot ecosystem."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Reading and Writing LeRobot Data in Python",
      "paragraphs": [
        "Loading a LeRobot dataset from Hugging Face Hub is a single function call: from lerobot.common.datasets.lerobot_dataset import LeRobotDataset, then dataset = LeRobotDataset('lerobot/aloha_sim_transfer_cube_human'). This returns a PyTorch-compatible dataset object where dataset[i] yields a dictionary with state, action, and decoded image tensors for timestep i. The framework handles video decoding, Parquet reading, and timestamp alignment transparently. For streaming access without full download, pass streaming=True to load data on-the-fly from Hub storage.",
        "Creating a new LeRobot dataset involves the LeRobotDataset.create() factory method. You specify the robot type, fps, and feature definitions, then call dataset.add_frame() for each timestep with a dictionary of observations and actions. At episode boundaries, call dataset.save_episode() to flush the current episode's Parquet data and compress video frames. The framework automatically generates info.json, handles MP4 encoding with configurable quality (crf parameter, default 20), and structures the Hub-compatible directory layout. After recording, push to Hub with dataset.push_to_hub('your-org/your-dataset'). The lerobot CLI also provides lerobot/scripts/push_dataset_to_hub.py for batch conversion from existing formats."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "When to Use LeRobot Format vs Alternatives",
      "description": "LeRobot format excels in the Hugging Face ecosystem and for teams using modern policy architectures. Consider alternatives for non-Python workflows or legacy infrastructure.",
      "columns": [
        "Format",
        "Best For",
        "Hub Integration",
        "Video Storage",
        "Policy Support"
      ],
      "rows": [
        {
          "Format": "LeRobot",
          "Best For": "ACT, Diffusion Policy, VQ-BeT",
          "Hub Integration": "Native HF Hub",
          "Video Storage": "MP4 compressed",
          "Policy Support": "4+ built-in policies"
        },
        {
          "Format": "RLDS",
          "Best For": "RT-X, Octo, OpenVLA",
          "Hub Integration": "None (TFDS ecosystem)",
          "Video Storage": "Per-frame in TFRecord",
          "Policy Support": "OXE ecosystem"
        },
        {
          "Format": "HDF5",
          "Best For": "robomimic, D4RL",
          "Hub Integration": "Manual upload",
          "Video Storage": "Raw frames in arrays",
          "Policy Support": "robomimic policies"
        },
        {
          "Format": "Zarr",
          "Best For": "Cloud-native, BridgeData V2",
          "Hub Integration": "Manual upload",
          "Video Storage": "Raw frames in arrays",
          "Policy Support": "Custom loaders"
        },
        {
          "Format": "WebDataset",
          "Best For": "Large-scale distributed",
          "Hub Integration": "HF Hub streaming",
          "Video Storage": "Per-frame in tar",
          "Policy Support": "Custom loaders"
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
          "Tool / Library": "lerobot.scripts.convert",
          "Complexity": "trivial",
          "Notes": "LeRobot provides built-in RLDS conversion scripts."
        },
        {
          "Source Format": "HDF5",
          "Tool / Library": "Custom Python + lerobot",
          "Complexity": "moderate",
          "Notes": "Map HDF5 episodes to LeRobot's Parquet + MP4 structure."
        },
        {
          "Source Format": "ROS bag",
          "Tool / Library": "Custom Python",
          "Complexity": "complex",
          "Notes": "Extract synchronized topics and convert to LeRobot schema."
        },
        {
          "Source Format": "Raw video + CSV",
          "Tool / Library": "LeRobotDataset.create()",
          "Complexity": "moderate",
          "Notes": "Read video frames and tabular data, call add_frame() per timestep."
        },
        {
          "Source Format": "Zarr",
          "Tool / Library": "Custom Python",
          "Complexity": "moderate",
          "Notes": "Read zarr arrays, encode images as MP4, write Parquet metadata."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Migration Guide: Converting Existing Datasets to LeRobot Format",
      "paragraphs": [
        "Migrating to LeRobot format involves three steps: defining the feature schema, converting episode data, and publishing to Hub. Start by creating an info.json that maps your observation and action spaces to LeRobot's feature format. Each feature needs a dtype (float32, int64, or video for images), shape (e.g., [7] for a 7-DoF action space), and names array listing each dimension. The robot_type field should match one of LeRobot's supported configurations (aloha, koch, so100, etc.) or use a custom string for unsupported hardware.",
        "For the data conversion itself, the most common pattern is reading from your source format episode by episode, calling LeRobotDataset.add_frame() with the observation and action data for each timestep, and calling save_episode() at episode boundaries. Image observations should be passed as numpy uint8 arrays (H, W, 3); the framework handles MP4 encoding internally. The critical detail is matching your source fps to the target fps specified in info.json. If your source data was collected at 30 Hz but your target policy expects 10 Hz, downsample during conversion rather than at training time.",
        "After conversion, validate the dataset by loading it back with LeRobotDataset and checking that episode counts, frame counts, and feature shapes match your expectations. Run the built-in visualization with python -m lerobot.scripts.visualize_dataset --repo-id your-org/your-dataset to render episodes as video. Push to a private Hub repo for team access, or make it public to contribute to the growing LeRobot dataset ecosystem, which already includes over 200 community-contributed datasets across dozens of robot embodiments."
      ]
    },
    {
      "type": "citation-list",
      "heading": "References",
      "citations": [
        {
          "id": "cadene-lerobot-2024",
          "title": "LeRobot: State-of-the-Art Machine Learning for Real-World Robotics in a Million Lines of Code",
          "authors": "Cadene et al.",
          "venue": "Hugging Face 2024",
          "year": 2024,
          "url": "https://github.com/huggingface/lerobot"
        },
        {
          "id": "zhao-act-2023",
          "title": "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
          "authors": "Zhao et al.",
          "venue": "RSS 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2304.13705"
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
          "id": "lee-vqbet-2024",
          "title": "Behavior Generation with Latent Actions",
          "authors": "Lee et al.",
          "venue": "ICML 2024",
          "year": 2024,
          "url": "https://arxiv.org/abs/2403.03181"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Claru Data Delivery in LeRobot Format",
      "paragraphs": [
        "Claru delivers datasets in LeRobot format ready to push to Hugging Face Hub or load locally. We configure the info.json for your specific embodiment, with proper camera indices, action space definitions, and task descriptions.",
        "Every delivery includes validated Parquet files with correct episode indexing, MP4 videos encoded at configurable quality levels, and a complete info.json with your robot's joint names and feature specifications. We test each dataset by loading it with LeRobotDataset and running a training smoke test with ACT and Diffusion Policy to verify compatibility. For teams with private Hub organizations, Claru can push directly to your repository with appropriate access tokens. We also provide a conversion script for teams that need the same data in RLDS or HDF5 format alongside the LeRobot delivery."
      ]
    }
  ],
  "faqs": [
    {
      "question": "Can LeRobot data be hosted on Hugging Face Hub?",
      "answer": "Yes, Hub hosting is the primary distribution mechanism for LeRobot datasets. Claru can deliver data pre-structured for direct upload using huggingface_hub's upload_folder API, or push it to a private Hub repository on your behalf. Once on Hub, datasets are versioned with Git LFS for large files (MP4 videos, Parquet shards), support branch-based experimentation, and can be loaded with a single LeRobotDataset() call that handles downloading, caching, and streaming. Hub-hosted datasets also get automatic dataset cards, viewer integration, and community download metrics. For organizations with data privacy requirements, Hugging Face offers private repos and organization-level access controls."
    },
    {
      "question": "What policy architectures does LeRobot support?",
      "answer": "LeRobot ships with four built-in policy implementations: ACT (Action Chunking with Transformers) for high-frequency bimanual manipulation, Diffusion Policy for complex multi-modal action distributions, TDMPC for model-based reinforcement learning with temporal difference objectives, and VQ-BeT (Vector Quantized Behavior Transformers) for discretized action generation. The format is architecture-agnostic, meaning any custom policy can consume LeRobot datasets by subclassing the base Policy class and implementing the forward() and select_action() methods. The training configuration uses Hydra YAML files, so switching between policies on the same dataset is a single command-line argument change. Community contributors have also added implementations of pi0-style diffusion transformers and CrossFormer architectures."
    },
    {
      "question": "How does LeRobot handle video data?",
      "answer": "Videos are stored as MP4 files using H.264 encoding with a configurable Constant Rate Factor (CRF). The default CRF of 20 provides a good balance between quality and file size, reducing storage by 90-95% compared to per-frame PNG or raw uint8 arrays. Each camera has its own directory of episode videos at videos/{camera_name}/episode_{index}.mp4. Frame-level access is handled by the Parquet metadata table, which maps each timestep to a (video_path, frame_index) pair. At training time, LeRobot uses torchvision.io or decord for GPU-accelerated video decoding, reading only the requested frames rather than decoding entire episodes. For datasets with very high frame rates (60+ Hz), you can configure the video encoding to use a different codec or CRF to manage file sizes."
    },
    {
      "question": "How does LeRobot v2 differ from v1?",
      "answer": "LeRobot v2 introduced several breaking changes that significantly improve the format. The most visible change is the move from a single monolithic Parquet file to episode-partitioned Parquet files, enabling faster loading when working with subsets of episodes. V2 also added a standardized task column for multi-task datasets (each episode maps to a task string like 'pick up the red cube'), a more structured info.json with explicit feature definitions including joint names and dimension labels, and improved video encoding with configurable quality. The conversion path from v1 to v2 is automated via lerobot.scripts.v1_to_v2, which handles the re-partitioning and schema migration. V2 datasets are backward-incompatible with v1 loaders, so Claru delivers exclusively in v2 format."
    },
    {
      "question": "Can I use LeRobot format for simulation data?",
      "answer": "Absolutely. LeRobot format works identically for simulation and real-world data. The framework includes built-in simulation environments (ALOHA Sim via dm_control, PushT via gym) that record directly to LeRobot format for development and debugging. For custom simulators like Isaac Sim, MuJoCo, or PyBullet, you create a LeRobotDataset, render frames from your simulator at each timestep, and call add_frame() with the rendered images and state/action vectors. The key advantage is that policies trained on simulated LeRobot data can be directly evaluated on real-robot LeRobot data with zero format conversion, enabling seamless sim-to-real transfer experiments. The dataset's info.json tracks whether data is from simulation or real-world collection, and Claru can deliver mixed simulation-real datasets for domain adaptation research."
    }
  ],
  "ctaHeading": "Get Data in LeRobot Format",
  "ctaDescription": "Claru delivers robotics training data in LeRobot format, ready to load into your pipeline. Tell us your requirements.",
  "relatedGlossaryTerms": [
    "rlds",
    "cross-embodiment-data",
    "data-enrichment"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "fileExtensions": [
    ".parquet",
    ".mp4"
  ],
  "schemaDescription": "LeRobot datasets are stored on Hugging Face Hub with a specific structure: episodes stored in Parquet files with observation columns (images as paths, proprioceptive state as arrays) and action columns. Video frames are stored separately as MP4 files referenced by episode/frame indices. Metadata is in a dataset_info.json with robot config, fps, and feature descriptions.",
  "frameworksUsing": [
    {
      "name": "LeRobot Framework",
      "description": "Hugging Face's complete robot learning framework for training and evaluating policies."
    },
    {
      "name": "ACT (Action Chunking Transformer)",
      "description": "Trained on LeRobot-formatted data for bimanual manipulation."
    },
    {
      "name": "Diffusion Policy",
      "description": "LeRobot includes Diffusion Policy implementation consuming LeRobot datasets natively."
    },
    {
      "name": "pi0 / Physical Intelligence",
      "description": "Physical Intelligence's foundation model consumes data compatible with the LeRobot ecosystem."
    }
  ],
  "conversions": [
    {
      "sourceFormat": "RLDS",
      "toolOrLibrary": "lerobot.scripts.convert",
      "complexity": "trivial",
      "notes": "LeRobot provides built-in RLDS conversion scripts."
    },
    {
      "sourceFormat": "HDF5",
      "toolOrLibrary": "Custom Python + lerobot",
      "complexity": "moderate",
      "notes": "Map HDF5 episodes to LeRobot's Parquet + MP4 structure."
    },
    {
      "sourceFormat": "ROS bag",
      "toolOrLibrary": "Custom Python",
      "complexity": "complex",
      "notes": "Extract synchronized topics and convert to LeRobot schema."
    },
    {
      "sourceFormat": "Raw video + CSV",
      "toolOrLibrary": "LeRobotDataset.create()",
      "complexity": "moderate",
      "notes": "Read video frames and tabular data, call add_frame() per timestep."
    },
    {
      "sourceFormat": "Zarr",
      "toolOrLibrary": "Custom Python",
      "complexity": "moderate",
      "notes": "Read zarr arrays, encode images as MP4, write Parquet metadata."
    }
  ],
  "keyPapers": [
    {
      "id": "cadene-lerobot-2024",
      "title": "LeRobot: State-of-the-Art Machine Learning for Real-World Robotics in a Million Lines of Code",
      "authors": "Cadene et al.",
      "venue": "Hugging Face 2024",
      "year": 2024,
      "url": "https://github.com/huggingface/lerobot"
    },
    {
      "id": "zhao-act-2023",
      "title": "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
      "authors": "Zhao et al.",
      "venue": "RSS 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2304.13705"
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
      "id": "lee-vqbet-2024",
      "title": "Behavior Generation with Latent Actions",
      "authors": "Lee et al.",
      "venue": "ICML 2024",
      "year": 2024,
      "url": "https://arxiv.org/abs/2403.03181"
    }
  ],
  "claruDelivery": "Claru delivers datasets in LeRobot format ready to push to Hugging Face Hub or load locally. We configure the info.json for your specific embodiment, with proper camera indices, action space definitions, and task descriptions. Every delivery is smoke-tested with ACT and Diffusion Policy training loops."
};

export default data;
