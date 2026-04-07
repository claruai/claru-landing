import type { FormatPageData } from "./types";

const data: FormatPageData = {
  "slug": "bop-format",
  "metaTitle": "BOP Format (Benchmark for 6D Object Pose) for Robotics Data | Claru",
  "metaDescription": "BOP is the standard format for 6D object pose estimation benchmarks. Learn its structure and how Claru delivers pose estimation training data in BOP format.",
  "primaryKeyword": "BOP format robotics",
  "secondaryKeywords": [
    "BOP format robotics data",
    "BOP robotics training data",
    "BOP robotics dataset format",
    "bop-format robot data",
    "6D pose estimation format",
    "BOP challenge dataset",
    "object pose estimation data"
  ],
  "canonicalPath": "/formats/bop-format",
  "h1": "BOP Format (Benchmark for 6D Object Pose): Complete Guide for Robotics Data",
  "heroSubtitle": "BOP is the standard format for 6D object pose estimation benchmarks. Learn its structure and how Claru delivers pose estimation training data in BOP format.",
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
      "label": "BOP Format",
      "href": "/formats/bop-format"
    }
  ],
  "sections": [
    {
      "type": "prose",
      "heading": "Schema and Structure",
      "paragraphs": [
        "BOP (Benchmark for 6D Object Pose Estimation) defines a standardized directory structure for storing RGB-D scenes with ground-truth 6D object poses. Each dataset is organized into scenes (numbered directories), where each scene contains scene_camera.json (per-frame camera intrinsics as 3x3 K matrix plus optional depth_scale), scene_gt.json (per-frame list of object annotations with obj_id, rotation matrix R as 9 floats in row-major order, and translation vector t in millimeters), and subdirectories for rgb/ (color images as PNG or JPEG), depth/ (16-bit PNG depth maps), and optionally mask/ and mask_visib/ (per-object binary masks distinguishing full object extent from visible portion). Object 3D models live in a separate models/ directory as PLY mesh files, indexed by models_info.json which stores per-model diameter, min/max XYZ extents, and symmetry annotations.",
        "The BOP format encodes 6D pose as a rigid transformation from the model coordinate frame to the camera coordinate frame. The rotation matrix R is a 3x3 orthonormal matrix stored as 9 float values in row-major order, and the translation vector t is [tx, ty, tz] in millimeters from the camera optical center to the object origin. Camera intrinsics are stored as fx, fy (focal lengths in pixels), cx, cy (principal point in pixels), and depth_scale (multiplier to convert 16-bit depth values to millimeters, typically 0.1 or 1.0). This convention means that a 3D model point p_m in model coordinates transforms to camera coordinates as p_c = R * p_m + t, and projects to pixel coordinates as u = fx * p_c.x / p_c.z + cx, v = fy * p_c.y / p_c.z + cy.",
        "The BOP Toolkit (bop_toolkit_lib) provides Python utilities for loading, visualizing, and evaluating BOP-format datasets. The standard evaluation metrics are VSD (Visible Surface Discrepancy), MSSD (Maximum Symmetry-Aware Surface Distance), and MSPD (Maximum Symmetry-Aware Projection Distance), computed at error thresholds that account for object symmetry. The BOP Challenge, running annually since 2017 at ECCV and ICCV workshops, has established these metrics as the community standard for pose estimation evaluation. As of BOP Challenge 2024, the benchmark includes 11 core datasets covering household objects (T-LESS, YCB-V, LM-O), industrial parts (ITODD), and textured objects (TUD-L, HB), with over 350,000 annotated object instances across 50,000+ images."
      ]
    },
    {
      "type": "cards",
      "heading": "Frameworks and Models Using BOP Format",
      "cards": [
        {
          "title": "CosyPose",
          "description": "Multi-view multi-object 6D pose estimation from INRIA, trained and evaluated on BOP-format datasets with iterative render-and-compare refinement."
        },
        {
          "title": "MegaPose",
          "description": "Foundation model for 6D pose estimation of novel objects, using BOP datasets for training with render-based data augmentation."
        },
        {
          "title": "FoundationPose",
          "description": "NVIDIA's unified 6D pose estimation and tracking model, benchmarked on BOP Challenge 2023-2024 with state-of-the-art results on YCB-V and T-LESS."
        },
        {
          "title": "GDR-Net / GDRNPP",
          "description": "Geometry-guided direct regression network for 6D pose, top performer on BOP Challenge 2022 with direct dense correspondence prediction."
        },
        {
          "title": "SAM-6D",
          "description": "Segment Anything Model adapted for 6D pose estimation, using SAM segmentation as a front-end for BOP-format pose refinement."
        },
        {
          "title": "BOP Toolkit",
          "description": "Official Python toolkit for loading, rendering, evaluating, and visualizing BOP-format datasets with support for all 11 core benchmarks."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Reading and Working with BOP Format Data in Python",
      "paragraphs": [
        "The bop_toolkit_lib Python package provides the standard API for BOP data. Loading a scene requires reading the JSON metadata files: scene_camera = json.load(open('scene_camera.json')), scene_gt = json.load(open('scene_gt.json')), where keys are string frame indices ('0', '1', ...). For each frame, scene_gt[str(frame_id)] returns a list of object annotations, each containing 'obj_id' (integer), 'cam_R_m2c' (9-element rotation matrix), and 'cam_t_m2c' (3-element translation in mm). The bop_toolkit_lib.inout module provides load_scene_gt(), load_scene_camera(), and load_ply() functions that handle format variations across BOP dataset versions.",
        "Rendering BOP objects for training data augmentation is a critical workflow. The BOP Toolkit includes a rendering pipeline using Blender (via BlenderProc) or OpenGL that takes the 3D model PLY files and scene_gt.json poses to generate synthetic RGB-D images with pixel-perfect ground truth. BlenderProc, the recommended renderer for BOP, can generate photorealistic training data by compositing BOP object models onto random backgrounds with physically-based lighting. The BOP Challenge 2020 established that models trained on BlenderProc-generated synthetic data (PBR training images) can match or exceed models trained on real data alone, which has made synthetic-to-real transfer via BOP format a standard practice in pose estimation research.",
        "For evaluation, the bop_toolkit_lib.score module computes VSD, MSSD, and MSPD metrics. VSD measures the visible surface discrepancy between the rendered ground-truth pose and the predicted pose, accounting for occlusion. MSSD and MSPD are symmetry-aware metrics that consider all equivalent poses for symmetric objects (e.g., a cylinder can be rotated around its axis). The BOP evaluation server at bop.felk.cvut.cz accepts result CSV files with columns scene_id, im_id, obj_id, score, R (rotation as 9 space-separated floats), t (translation as 3 space-separated floats), and time (inference time in seconds), providing standardized leaderboard evaluation."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "When to Use BOP Format vs Alternatives",
      "description": "BOP is the standard for 6D pose estimation evaluation, but other formats may be more appropriate depending on your application.",
      "columns": [
        "Format",
        "Best For",
        "Pose Representation",
        "Depth Support",
        "Evaluation Tools"
      ],
      "rows": [
        {
          "Format": "BOP",
          "Best For": "6D pose estimation benchmarks",
          "Pose Representation": "R (3x3) + t (mm)",
          "Depth Support": "16-bit PNG depth maps",
          "Evaluation Tools": "VSD, MSSD, MSPD metrics"
        },
        {
          "Format": "COCO + 6D extension",
          "Best For": "Detection + coarse pose",
          "Pose Representation": "Quaternion or Euler angles",
          "Depth Support": "Optional",
          "Evaluation Tools": "Custom (no standard)"
        },
        {
          "Format": "NOCS (Normalized Object Coordinate Space)",
          "Best For": "Category-level pose estimation",
          "Pose Representation": "Scale + R + t",
          "Depth Support": "Required (depth + NOCS maps)",
          "Evaluation Tools": "IoU-based metrics"
        },
        {
          "Format": "ObjectNet3D / Pix3D",
          "Best For": "Pose from single RGB images",
          "Pose Representation": "Azimuth/elevation/in-plane",
          "Depth Support": "No (RGB only)",
          "Evaluation Tools": "Geodesic rotation error"
        },
        {
          "Format": "LINEMOD (legacy)",
          "Best For": "Legacy pose estimation work",
          "Pose Representation": "R (3x3) + t",
          "Depth Support": "Yes",
          "Evaluation Tools": "ADD/ADI metrics"
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
          "Source Format": "Custom RGBD",
          "Tool / Library": "Custom Python",
          "Complexity": "moderate",
          "Notes": "Requires per-frame camera calibration and ground-truth 6D pose annotations in R+t form."
        },
        {
          "Source Format": "ROS bag + ArUco/AprilTag",
          "Tool / Library": "Custom pipeline",
          "Complexity": "complex",
          "Notes": "Extract camera data, compute object poses from fiducial markers, refine with ICP, write BOP structure."
        },
        {
          "Source Format": "Simulation (Isaac Sim / BlenderProc)",
          "Tool / Library": "BlenderProc BOP writer",
          "Complexity": "trivial",
          "Notes": "BlenderProc has native BOP format output; Isaac Sim requires custom exporter mapping render metadata to scene_gt.json."
        },
        {
          "Source Format": "LINEMOD format",
          "Tool / Library": "bop_toolkit converters",
          "Complexity": "trivial",
          "Notes": "BOP Toolkit includes converters from legacy LINEMOD pose format to BOP structure."
        },
        {
          "Source Format": "NOCS predictions",
          "Tool / Library": "Custom Python",
          "Complexity": "moderate",
          "Notes": "Extract per-object R, t, scale from NOCS coordinate maps using Umeyama alignment, write to BOP JSON."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "BOP Format for Robotic Grasping and Manipulation",
      "paragraphs": [
        "While BOP was designed for pose estimation benchmarking, its precise 6D pose representation makes it directly applicable to robotic grasping and manipulation planning. Accurate 6D object pose is a prerequisite for grasp planning systems like GraspNet-1Billion, Contact-GraspNet, and AnyGrasp, which require knowing the exact position and orientation of target objects to compute stable grasp configurations. The BOP format's explicit camera intrinsics and depth maps enable seamless integration with depth-based grasp planners that operate in 3D camera coordinates.",
        "For bin picking and warehouse automation, BOP-format data captures the exact scenario that pose estimation models must handle: multiple objects at known poses with varying levels of occlusion. The mask_visib/ directory explicitly encodes which portions of each object are visible, which is critical for training models that must handle heavy occlusion (objects stacked in bins). The T-LESS and ITODD BOP datasets specifically target industrial scenarios with texture-less objects and cluttered arrangements, making them directly relevant for factory automation perception pipelines.",
        "The BOP format also supports the synthetic-to-real transfer workflow that has become standard in industrial robotics. Teams generate large-scale synthetic training data using BlenderProc with their specific object CAD models, outputting directly in BOP format. They then collect a smaller real-world validation set (also in BOP format) to evaluate sim-to-real transfer quality. The consistent format across synthetic and real data ensures that the same training and evaluation code works for both, reducing the engineering overhead of domain adaptation experiments."
      ]
    },
    {
      "type": "citation-list",
      "heading": "References",
      "citations": [
        {
          "id": "hodan-bop-2018",
          "title": "BOP: Benchmark for 6D Object Pose Estimation",
          "authors": "Hodan et al.",
          "venue": "ECCV 2018",
          "year": 2018,
          "url": "https://arxiv.org/abs/1808.08319"
        },
        {
          "id": "hodan-bop-2024",
          "title": "BOP Challenge 2024 on Detection, Segmentation and Pose Estimation of Seen and Unseen Rigid Objects",
          "authors": "Hodan et al.",
          "venue": "ECCV 2024 Workshop",
          "year": 2024,
          "url": "https://bop.felk.cvut.cz/challenges/bop-challenge-2024/"
        },
        {
          "id": "labbe-cosypose-2020",
          "title": "CosyPose: Consistent multi-view multi-object 6D pose estimation",
          "authors": "Labbe et al.",
          "venue": "ECCV 2020",
          "year": 2020,
          "url": "https://arxiv.org/abs/2008.08465"
        },
        {
          "id": "labbe-megapose-2023",
          "title": "MegaPose: 6D Pose Estimation of Novel Objects via Render & Compare",
          "authors": "Labbe et al.",
          "venue": "CoRL 2022",
          "year": 2023,
          "url": "https://arxiv.org/abs/2212.06870"
        },
        {
          "id": "wen-foundationpose-2024",
          "title": "FoundationPose: Unified 6D Pose Estimation and Tracking of Novel Objects",
          "authors": "Wen et al.",
          "venue": "CVPR 2024",
          "year": 2024,
          "url": "https://arxiv.org/abs/2312.08344"
        },
        {
          "id": "denninger-blenderproc-2023",
          "title": "BlenderProc2: A Modular Procedural Pipeline for Photorealistic Rendering",
          "authors": "Denninger et al.",
          "venue": "JOSS 2023",
          "year": 2023,
          "url": "https://github.com/DLR-RM/BlenderProc"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Claru Data Delivery in BOP Format",
      "paragraphs": [
        "Claru delivers 6D pose estimation data in BOP format with ground-truth poses computed from multi-view photogrammetry pipelines. For real-world data collection, we use multi-camera rigs with ArUco or AprilTag fiducial markers for initial pose estimation, followed by ICP (Iterative Closest Point) refinement against high-resolution 3D scans to achieve sub-millimeter translational and sub-degree rotational accuracy. Object 3D models are provided as textured PLY meshes captured via structured-light scanning or photogrammetry, with models_info.json populated with accurate diameter, extent, and symmetry metadata.",
        "Every BOP delivery includes RGB images, registered 16-bit depth maps, per-object instance masks (both full and visible-only), and complete camera calibration. For teams requiring synthetic training data augmentation, we provide BlenderProc-compatible scene configurations that reproduce the lighting and camera conditions of the real collection environment. Large-scale deliveries follow the BOP Challenge sharding convention with separate scene directories, and all data is validated against the BOP Toolkit's integrity checker to ensure correct JSON formatting, consistent frame indexing, and valid rotation matrices (orthonormality within 1e-6 tolerance)."
      ]
    }
  ],
  "faqs": [
    {
      "question": "How are ground-truth poses obtained for real-world BOP data?",
      "answer": "For real-world data, Claru uses a multi-stage pipeline: initial pose estimation from fiducial markers (ArUco or AprilTag) attached to a calibration rig, multi-view triangulation to establish 3D object positions, and ICP refinement against high-resolution 3D scans of each object to achieve sub-millimeter accuracy. For textureless or symmetric objects where marker-based methods are insufficient, we use multi-view optimization with learned dense correspondences. Synthetic data generated via BlenderProc or Isaac Sim provides pixel-perfect ground truth directly from the renderer."
    },
    {
      "question": "What object types are supported by BOP format?",
      "answer": "BOP format works with any rigid object that can be represented as a 3D mesh. The 11 core BOP datasets cover household items (mugs, bowls, cans in YCB-V), industrial parts (texture-less metallic components in ITODD and T-LESS), textured objects (TUD-L), and small items (electrical connectors in LM-O). Claru provides pose data for custom objects from your production line, household inventory, or laboratory environment, with 3D models generated from structured-light scanning or photogrammetry."
    },
    {
      "question": "Is BOP format used outside pose estimation?",
      "answer": "While designed for 6D pose estimation, BOP's structured scene representation is increasingly used for robotic grasping research (where accurate object pose is a prerequisite for grasp planning), bin picking evaluation (where the multi-object cluttered scenes in BOP directly match industrial scenarios), and sim-to-real transfer evaluation (where BOP provides a standardized evaluation protocol for comparing synthetic and real training data). The BOP Challenge 2024 expanded to include detection and segmentation tracks alongside pose estimation, reflecting this broader adoption."
    },
    {
      "question": "How does BOP handle symmetric objects?",
      "answer": "BOP addresses object symmetry through the models_info.json file, which specifies symmetry properties for each object. The evaluation metrics (MSSD and MSPD) are symmetry-aware: they compute the minimum error over all equivalent poses for symmetric objects. A cylinder, for example, has continuous rotational symmetry around its axis, so any rotation around that axis is considered equally correct. Discrete symmetries (e.g., a rectangular box has 4 equivalent orientations) are also handled. The BOP Toolkit automatically accounts for symmetry during evaluation, and Claru annotates symmetry properties for all custom objects in deliveries."
    },
    {
      "question": "What is the relationship between BOP and BlenderProc?",
      "answer": "BlenderProc is the recommended tool for generating synthetic BOP-format training data. It takes object PLY models from the BOP models/ directory, places them in physically simulated scenes using Blender's rigid body engine, applies randomized PBR materials and HDRI lighting, and outputs RGB-D images with ground truth in BOP format. The BOP Challenge provides official PBR training images generated with BlenderProc for all 11 core datasets. BlenderProc's BopWriter module ensures format compliance, and the resulting synthetic data can be used directly with any BOP-compatible training pipeline."
    }
  ],
  "ctaHeading": "Get Data in BOP Format",
  "ctaDescription": "Claru delivers 6D pose estimation data in BOP format with sub-millimeter ground-truth poses, textured 3D models, and BOP Toolkit-validated annotations. Tell us your requirements.",
  "relatedGlossaryTerms": [
    "rlds",
    "cross-embodiment-data",
    "data-enrichment"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "fileExtensions": [
    ".json",
    ".png",
    ".ply"
  ],
  "schemaDescription": "BOP format organizes scenes as numbered directories containing scene_camera.json (per-frame camera intrinsics K, depth_scale), scene_gt.json (per-frame object annotations with obj_id, 3x3 rotation matrix R in row-major order, and translation vector t in millimeters), and subdirectories for rgb/, depth/ (16-bit PNG), mask/, and mask_visib/ (per-object binary masks). Object 3D models are stored as PLY meshes in a models/ directory with models_info.json providing diameter, XYZ extents, and symmetry annotations. The evaluation protocol uses VSD, MSSD, and MSPD metrics computed by the official BOP Toolkit.",
  "frameworksUsing": [
    {
      "name": "CosyPose",
      "description": "Multi-view multi-object 6D pose estimation from INRIA, trained and evaluated on BOP datasets with render-and-compare refinement.",
      "url": "https://github.com/ylabbe/cosypose"
    },
    {
      "name": "MegaPose",
      "description": "Foundation model for 6D pose estimation of novel objects using render-and-compare on BOP datasets.",
      "url": "https://github.com/megapose6d/megapose6d"
    },
    {
      "name": "FoundationPose",
      "description": "NVIDIA's unified 6D pose estimation and tracking model, state-of-the-art on BOP Challenge 2024.",
      "url": "https://github.com/NVlabs/FoundationPose"
    },
    {
      "name": "GDR-Net / GDRNPP",
      "description": "Geometry-guided direct regression network, top performer on BOP Challenge 2022 with dense correspondence prediction."
    },
    {
      "name": "BOP Toolkit",
      "description": "Official Python toolkit for loading, rendering, evaluating, and visualizing BOP-format datasets.",
      "url": "https://github.com/thodan/bop_toolkit"
    },
    {
      "name": "BlenderProc",
      "description": "Modular procedural pipeline for generating photorealistic synthetic training data in BOP format.",
      "url": "https://github.com/DLR-RM/BlenderProc"
    }
  ],
  "conversions": [
    {
      "sourceFormat": "Custom RGBD",
      "toolOrLibrary": "Custom Python",
      "complexity": "moderate",
      "notes": "Requires per-frame camera calibration and ground-truth 6D pose annotations in R+t form."
    },
    {
      "sourceFormat": "ROS bag + ArUco/AprilTag",
      "toolOrLibrary": "Custom pipeline",
      "complexity": "complex",
      "notes": "Extract camera data, compute poses from fiducial markers, refine with ICP, write BOP structure."
    },
    {
      "sourceFormat": "BlenderProc / Isaac Sim",
      "toolOrLibrary": "BlenderProc BopWriter",
      "complexity": "trivial",
      "notes": "BlenderProc has native BOP format output; Isaac Sim requires a custom exporter."
    },
    {
      "sourceFormat": "LINEMOD format",
      "toolOrLibrary": "bop_toolkit converters",
      "complexity": "trivial",
      "notes": "BOP Toolkit includes converters from legacy LINEMOD pose format to BOP structure."
    },
    {
      "sourceFormat": "NOCS predictions",
      "toolOrLibrary": "Custom Python",
      "complexity": "moderate",
      "notes": "Extract per-object R, t, scale from NOCS coordinate maps using Umeyama alignment."
    }
  ],
  "keyPapers": [
    {
      "id": "hodan-bop-2018",
      "title": "BOP: Benchmark for 6D Object Pose Estimation",
      "authors": "Hodan et al.",
      "venue": "ECCV 2018",
      "year": 2018,
      "url": "https://arxiv.org/abs/1808.08319"
    },
    {
      "id": "hodan-bop-2024",
      "title": "BOP Challenge 2024 on Detection, Segmentation and Pose Estimation of Seen and Unseen Rigid Objects",
      "authors": "Hodan et al.",
      "venue": "ECCV 2024 Workshop",
      "year": 2024,
      "url": "https://bop.felk.cvut.cz/challenges/bop-challenge-2024/"
    },
    {
      "id": "labbe-megapose-2023",
      "title": "MegaPose: 6D Pose Estimation of Novel Objects via Render & Compare",
      "authors": "Labbe et al.",
      "venue": "CoRL 2022",
      "year": 2023,
      "url": "https://arxiv.org/abs/2212.06870"
    },
    {
      "id": "wen-foundationpose-2024",
      "title": "FoundationPose: Unified 6D Pose Estimation and Tracking of Novel Objects",
      "authors": "Wen et al.",
      "venue": "CVPR 2024",
      "year": 2024,
      "url": "https://arxiv.org/abs/2312.08344"
    },
    {
      "id": "denninger-blenderproc-2023",
      "title": "BlenderProc2: A Modular Procedural Pipeline for Photorealistic Rendering",
      "authors": "Denninger et al.",
      "venue": "JOSS 2023",
      "year": 2023,
      "url": "https://github.com/DLR-RM/BlenderProc"
    }
  ],
  "claruDelivery": "Claru delivers 6D pose estimation data in BOP format with ground-truth poses from multi-view triangulation and ICP refinement achieving sub-millimeter accuracy. Object models are provided as textured PLY meshes with accurate diameter, extent, and symmetry metadata. Every delivery includes RGB images, registered 16-bit depth maps, per-object instance masks, complete camera calibration, and BOP Toolkit validation reports."
};

export default data;
