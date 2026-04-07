import type { FormatPageData } from "./types";

const data: FormatPageData = {
  "slug": "kitti-format",
  "metaTitle": "KITTI Format for Robotics Data | Claru",
  "metaDescription": "The KITTI format is one of the most widely supported data formats in autonomous driving and 3D vision. Learn its file structure and how Claru delivers KITTI-compatible data.",
  "primaryKeyword": "KITTI format robotics",
  "secondaryKeywords": [
    "KITTI format robotics data",
    "KITTI robotics training data",
    "KITTI robotics dataset format",
    "kitti-format robot data",
    "KITTI 3D object detection",
    "KITTI point cloud format",
    "KITTI calibration format"
  ],
  "canonicalPath": "/formats/kitti-format",
  "h1": "KITTI Format: Complete Guide for Robotics Data",
  "heroSubtitle": "The KITTI format is one of the most widely supported data formats in autonomous driving and 3D vision. Learn its file structure and how Claru delivers KITTI-compatible data.",
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
      "label": "KITTI Format",
      "href": "/formats/kitti-format"
    }
  ],
  "sections": [
    {
      "type": "prose",
      "heading": "Schema and Structure",
      "paragraphs": [
        "KITTI format uses a file-based directory structure developed by the Karlsruhe Institute of Technology and Toyota Technological Institute at Chicago for their 2012 vision benchmark suite. The format organizes data by modality: images in /image_02/ (left color camera) and /image_03/ (right color camera), LiDAR point clouds in /velodyne/ as binary float32 files (each point stored as 4 floats: x, y, z, reflectance), calibration data in /calib/ as text files containing projection matrices, and labels in /label_02/ as space-delimited text files. Each frame is identified by a 6-digit zero-padded index (000000.png, 000000.bin, 000000.txt), and all modalities for a given frame share the same index number.",
        "The KITTI label format encodes 3D bounding boxes as a single line per object with 15 space-delimited fields: type (class name like Car, Pedestrian, Cyclist), truncated (float 0-1 indicating how much of the object is outside the image), occluded (integer 0-3 from fully visible to fully occluded), alpha (observation angle in radians), 2D bbox (left, top, right, bottom in pixels), 3D dimensions (height, width, length in meters), 3D location (x, y, z of the bottom center in camera coordinates), and rotation_y (yaw rotation around the vertical Y-axis in radians). The 3D bounding box is parameterized as a 7-DoF representation: (x, y, z, h, w, l, ry), where the center is defined as the bottom face center of the box. This convention means the Y-axis points downward (camera convention), which is a common source of confusion when interfacing with LiDAR-centric systems that use Z-up conventions.",
        "The calibration files contain four projection matrices (P0-P3 for each camera) and two transformation matrices (Tr_velo_to_cam for Velodyne LiDAR to camera 0, and Tr_imu_to_velo for IMU to Velodyne). The projection matrices are 3x4 and encode both camera intrinsics and the rigid transformation from the reference camera (camera 0) to each target camera. To project a LiDAR point to the left color image (camera 2): first apply Tr_velo_to_cam to transform from Velodyne to camera 0 coordinates, then left-multiply by the rectification matrix R0_rect (3x3 stored as 3x4 with zero translation), and finally by P2 (3x4) to get homogeneous pixel coordinates. This multi-step projection pipeline is the most implementation-intensive aspect of working with KITTI format."
      ]
    },
    {
      "type": "cards",
      "heading": "Frameworks and Models Using KITTI Format",
      "cards": [
        {
          "title": "OpenPCDet",
          "description": "OpenMMLab's point cloud detection framework with KITTI as a primary benchmark, supporting PointPillars, SECOND, PV-RCNN, and CenterPoint."
        },
        {
          "title": "SECOND",
          "description": "Sparse Embedded Convolutional Detection network, one of the first efficient voxel-based 3D detectors, designed for KITTI-format data."
        },
        {
          "title": "PointPillars",
          "description": "Real-time 3D object detection using pillar-based point cloud encoding, achieving the best speed-accuracy tradeoff on KITTI benchmark."
        },
        {
          "title": "PV-RCNN / PV-RCNN++",
          "description": "Point-voxel feature fusion for 3D detection, state-of-the-art on KITTI 3D detection with both voxel and point-level features."
        },
        {
          "title": "MMDetection3D",
          "description": "OpenMMLab's 3D detection toolbox with comprehensive KITTI data loaders, evaluation, and visualization for 20+ detection models."
        },
        {
          "title": "CenterPoint",
          "description": "Center-based 3D detection and tracking model, evaluated on both KITTI and nuScenes with KITTI-format data loading support."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Reading and Writing KITTI Format Data in Python",
      "paragraphs": [
        "Reading KITTI point clouds is straightforward: points = np.fromfile('000000.bin', dtype=np.float32).reshape(-1, 4) yields an (N, 4) array of [x, y, z, reflectance]. Images are standard PNG files loadable with cv2.imread() or PIL.Image.open(). Label files are parsed line-by-line, splitting on whitespace: each line produces a dictionary with type, truncated, occluded, alpha, bbox (4 floats), dimensions (3 floats), location (3 floats), and rotation_y. The calibration file contains key-value lines like P2: followed by 12 floats representing the 3x4 projection matrix.",
        "Writing KITTI-format data requires careful attention to coordinate conventions. Point clouds must be in the Velodyne coordinate frame (X-forward, Y-left, Z-up) and written as contiguous float32 binary: points.astype(np.float32).tofile('000000.bin'). Labels must use the camera 2 coordinate frame (X-right, Y-down, Z-forward), which means applying the Velodyne-to-camera transformation to any LiDAR-centric annotations before writing. The 2D bounding box must be the tight axis-aligned enclosure of the projected 3D box corners in image space, and the alpha angle is the observation angle (not the global yaw), computed as alpha = rotation_y - arctan2(location_z, location_x).",
        "The KITTI evaluation toolkit (devkit provided by the benchmark organizers) computes Average Precision (AP) at three difficulty levels: Easy (minimum bbox height 40px, max occlusion 0, max truncation 0.15), Moderate (25px, occlusion 1, truncation 0.30), and Hard (25px, occlusion 2, truncation 0.50). For 3D detection, the IoU threshold is 0.7 for cars and 0.5 for pedestrians and cyclists. The evaluation computes both BEV (Bird's Eye View) AP and 3D AP. Many 3D detection papers report the 40-point interpolated AP (R40) rather than the original 11-point interpolated AP (R11), a change introduced by the KITTI benchmark in 2019 that produced different numerical values for the same detections."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "When to Use KITTI Format vs Alternatives",
      "description": "KITTI is the most widely supported format in open-source 3D detection code, but newer formats offer more features.",
      "columns": [
        "Format",
        "Best For",
        "Temporal Support",
        "Multi-sensor",
        "Open-source Support"
      ],
      "rows": [
        {
          "Format": "KITTI",
          "Best For": "3D detection, stereo, optical flow",
          "Temporal Support": "Sequences (separate split)",
          "Multi-sensor": "Stereo + LiDAR + IMU",
          "Open-source Support": "Excellent (most frameworks)"
        },
        {
          "Format": "nuScenes",
          "Best For": "Multi-sensor temporal driving",
          "Temporal Support": "Native (linked samples)",
          "Multi-sensor": "6 cameras + LiDAR + radar",
          "Open-source Support": "Good (growing)"
        },
        {
          "Format": "Waymo Open",
          "Best For": "Large-scale diverse driving",
          "Temporal Support": "Native (segments)",
          "Multi-sensor": "5 cameras + 5 LiDARs",
          "Open-source Support": "Moderate (protobuf)"
        },
        {
          "Format": "Argoverse 2",
          "Best For": "HD maps + 3D detection",
          "Temporal Support": "Native (sequences)",
          "Multi-sensor": "7 cameras + 2 LiDARs",
          "Open-source Support": "Good (av2 SDK)"
        },
        {
          "Format": "ONCE",
          "Best For": "One-million-scene 3D detection",
          "Temporal Support": "Native",
          "Multi-sensor": "Camera + LiDAR",
          "Open-source Support": "Moderate"
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
          "Source Format": "nuScenes",
          "Tool / Library": "nuscenes-devkit export_kitti()",
          "Complexity": "moderate",
          "Notes": "Convert relational schema to KITTI file structure; handles coordinate frame transformation and calibration matrix generation."
        },
        {
          "Source Format": "Waymo Open",
          "Tool / Library": "waymo_open_dataset / custom script",
          "Complexity": "moderate",
          "Notes": "Extract camera images and LiDAR from protobuf TFRecords, write KITTI-compatible files with calibration mapping."
        },
        {
          "Source Format": "ROS bag (camera + LiDAR)",
          "Tool / Library": "Custom Python (rosbags + cv2)",
          "Complexity": "moderate",
          "Notes": "Extract synchronized camera and LiDAR topics, compute calibration from TF tree, write to KITTI directory structure."
        },
        {
          "Source Format": "Custom sensors",
          "Tool / Library": "Custom Python",
          "Complexity": "trivial",
          "Notes": "Write images as PNG and point clouds as binary float32 following KITTI naming and coordinate conventions."
        },
        {
          "Source Format": "Argoverse 2",
          "Tool / Library": "av2 SDK + custom script",
          "Complexity": "moderate",
          "Notes": "Extract per-frame LiDAR sweeps and camera images, transform annotations from global to camera frame."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "KITTI Format Beyond Autonomous Driving",
      "paragraphs": [
        "Although KITTI format was designed for autonomous driving, its simplicity has led to widespread adoption in other robotics domains. Indoor navigation systems use KITTI format for RGB-D SLAM evaluation by substituting depth camera data for LiDAR point clouds. Agricultural robotics teams use the label format for 3D crop detection with modified category names. Warehouse robotics systems adopt KITTI format for forklift and pallet detection because the extensive ecosystem of pre-trained 3D detectors (PointPillars, SECOND, CenterPoint) can be fine-tuned on domain-specific KITTI-format data with minimal code changes.",
        "The KITTI format's main limitation is the lack of native temporal linking between frames. In the original KITTI benchmark, tracking sequences are stored in a separate split with consecutive frame indices, but there is no explicit mechanism to link annotations across time (no tracking IDs in the detection label format, though the tracking split adds them). Newer formats like nuScenes address this with linked sample tokens, and Argoverse 2 uses unique track UUIDs. For teams that need temporal consistency in KITTI format, the standard workaround is to add a track_id column to the label files (position 16), which most KITTI-compatible loaders ignore but can be parsed by custom code.",
        "Despite these limitations, KITTI format remains the most broadly supported format in 3D detection research as of 2026. The OpenPCDet framework alone supports over 20 different detection architectures that all consume KITTI-format data, and nearly every new 3D detection paper includes KITTI benchmark results. This means that training a model on KITTI-format data gives you access to the largest collection of pre-trained checkpoints, training recipes, and community-maintained codebases of any 3D detection format."
      ]
    },
    {
      "type": "citation-list",
      "heading": "References",
      "citations": [
        {
          "id": "geiger-kitti-2012",
          "title": "Are We Ready for Autonomous Driving? The KITTI Vision Benchmark Suite",
          "authors": "Geiger et al.",
          "venue": "CVPR 2012",
          "year": 2012,
          "url": "https://www.cvlibs.net/publications/Geiger2012CVPR.pdf"
        },
        {
          "id": "geiger-kitti-2013",
          "title": "Vision meets Robotics: The KITTI Dataset",
          "authors": "Geiger et al.",
          "venue": "IJRR 2013",
          "year": 2013,
          "url": "https://www.cvlibs.net/publications/Geiger2013IJRR.pdf"
        },
        {
          "id": "lang-pointpillars-2019",
          "title": "PointPillars: Fast Encoders for Object Detection from Point Clouds",
          "authors": "Lang et al.",
          "venue": "CVPR 2019",
          "year": 2019,
          "url": "https://arxiv.org/abs/1812.05784"
        },
        {
          "id": "yan-second-2018",
          "title": "SECOND: Sparsely Embedded Convolutional Detection",
          "authors": "Yan et al.",
          "venue": "Sensors 2018",
          "year": 2018,
          "url": "https://www.mdpi.com/1424-8220/18/10/3337"
        },
        {
          "id": "shi-pvrcnn-2020",
          "title": "PV-RCNN: Point-Voxel Feature Set Abstraction for 3D Object Detection",
          "authors": "Shi et al.",
          "venue": "CVPR 2020",
          "year": 2020,
          "url": "https://arxiv.org/abs/1912.13192"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Claru Data Delivery in KITTI Format",
      "paragraphs": [
        "Claru delivers data in KITTI format with complete calibration files ensuring geometric consistency between camera images, LiDAR point clouds, and 3D annotations. All labels follow the standard 15-field format with accurate 3D bounding boxes, occlusion levels, and truncation estimates. Point clouds are delivered as binary float32 files in the Velodyne coordinate frame with reflectance values, and calibration matrices are computed from rigorous multi-target camera-LiDAR calibration procedures.",
        "For teams migrating from or benchmarking against the original KITTI dataset, Claru maintains strict format compatibility verified by running the official KITTI evaluation toolkit against delivered data. For applications beyond standard automotive categories, we define custom class taxonomies (e.g., pallet, forklift, shelf for warehouse robotics) while maintaining the same label file structure. Large deliveries include pre-computed train/val splits following KITTI's Moderate difficulty distribution, and we provide OpenPCDet-compatible configuration files for immediate training with any of the 20+ supported detection architectures."
      ]
    }
  ],
  "faqs": [
    {
      "question": "Is KITTI format still relevant in 2026?",
      "answer": "Yes. While newer formats like nuScenes and Waymo Open offer richer annotation schemas and temporal linking, KITTI format remains the most widely supported format in open-source 3D detection frameworks. OpenPCDet, MMDetection3D, and dozens of individual model repositories all provide KITTI data loaders. Nearly every 3D detection paper published at top venues still includes KITTI benchmark results. For teams that want to leverage the broadest possible ecosystem of pre-trained models and training recipes, KITTI format is the pragmatic choice."
    },
    {
      "question": "What are KITTI format's main limitations?",
      "answer": "KITTI format lacks native support for temporal sequences (no built-in frame linking or tracking IDs in the detection split), multi-sweep LiDAR accumulation (each frame is a single 360-degree scan), rich attribute annotations (no pedestrian posture, vehicle state, etc.), and map data (no lane markings or drivable area). The format also uses camera-centric coordinates for labels, which requires coordinate transformations when working with LiDAR-centric detection models. For applications requiring these features, nuScenes or Argoverse 2 formats are preferred."
    },
    {
      "question": "How are 3D bounding boxes represented in KITTI format?",
      "answer": "KITTI uses 7-DoF boxes parameterized as (x, y, z, h, w, l, ry): the 3D center location (x, y, z) in camera 2 coordinates where Y points down, dimensions in meters (height, width, length), and yaw rotation (ry) around the Y-axis in radians. The (x, y, z) location refers to the bottom face center of the box, not the geometric center. This means y_center = y - h/2 if you need the true 3D center. Only yaw rotation is annotated; roll and pitch are assumed to be zero (objects are on a flat ground plane)."
    },
    {
      "question": "How do I project LiDAR points onto the camera image in KITTI?",
      "answer": "The projection requires three matrices from the calibration file: Tr_velo_to_cam (4x4 Velodyne-to-camera-0 transform), R0_rect (3x3 rectification matrix, padded to 4x4), and P2 (3x4 projection for camera 2). For a LiDAR point p = [x, y, z, 1]^T in Velodyne coordinates: p_cam = R0_rect @ Tr_velo_to_cam @ p, then p_img = P2 @ p_cam, and finally pixel coordinates are (p_img[0]/p_img[2], p_img[1]/p_img[2]). Filter out points behind the camera (p_cam[2] < 0) and outside image bounds before visualization."
    },
    {
      "question": "Can I use KITTI format for indoor robotics?",
      "answer": "Yes, with some adaptations. Replace the Velodyne LiDAR data with depth camera point clouds (converted to the same binary float32 format), use your camera calibration for the projection matrices, and define indoor-specific category names in the label files. The KITTI format's simplicity (flat files, text labels, standard images) makes it easy to adapt to any camera+depth sensor setup. Several indoor 3D detection projects have successfully used KITTI format for warehouse, factory, and domestic robotics applications."
    }
  ],
  "ctaHeading": "Get Data in KITTI Format",
  "ctaDescription": "Claru delivers robotics data in KITTI format with accurate calibration, 3D annotations, and compatibility with 20+ open-source detection frameworks. Tell us your requirements.",
  "relatedGlossaryTerms": [
    "rlds",
    "cross-embodiment-data",
    "data-enrichment"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "fileExtensions": [
    ".bin",
    ".txt",
    ".png"
  ],
  "schemaDescription": "KITTI uses a file-based directory structure: images in /image_02/ and /image_03/ (left/right color cameras as PNG), LiDAR points in /velodyne/ as binary float32 files (x, y, z, reflectance per point), calibration in /calib/ as text files with 3x4 projection matrices (P0-P3) and Velodyne-to-camera transforms, and labels in /label_02/ as 15-field space-delimited text (type, truncated, occluded, alpha, 2D bbox, 3D dimensions in meters, 3D location in camera coordinates, yaw rotation). Each frame shares a 6-digit zero-padded index across all modalities.",
  "frameworksUsing": [
    {
      "name": "OpenPCDet",
      "description": "OpenMMLab's point cloud detection framework supporting 20+ architectures with KITTI as a primary benchmark.",
      "url": "https://github.com/open-mmlab/OpenPCDet"
    },
    {
      "name": "SECOND",
      "description": "Sparse Embedded Convolutional Detection network, one of the first efficient voxel-based 3D detectors for KITTI data."
    },
    {
      "name": "PointPillars",
      "description": "Real-time 3D detection using pillar-based point cloud encoding, achieving the best speed-accuracy tradeoff on KITTI.",
      "url": "https://github.com/nutonomy/second.pytorch"
    },
    {
      "name": "PV-RCNN / PV-RCNN++",
      "description": "Point-voxel feature fusion for 3D detection, state-of-the-art on KITTI with combined voxel and point-level features."
    },
    {
      "name": "MMDetection3D",
      "description": "OpenMMLab's 3D detection toolbox with comprehensive KITTI data loaders, evaluation, and visualization.",
      "url": "https://github.com/open-mmlab/mmdetection3d"
    },
    {
      "name": "CenterPoint",
      "description": "Center-based 3D detection and tracking model evaluated on KITTI with anchor-free detection heads."
    }
  ],
  "conversions": [
    {
      "sourceFormat": "nuScenes",
      "toolOrLibrary": "nuscenes-devkit export_kitti()",
      "complexity": "moderate",
      "notes": "Convert relational schema to KITTI file structure with coordinate frame transformation and calibration mapping."
    },
    {
      "sourceFormat": "Waymo Open",
      "toolOrLibrary": "waymo_open_dataset + custom script",
      "complexity": "moderate",
      "notes": "Extract camera images and LiDAR from protobuf TFRecords, write KITTI-compatible files."
    },
    {
      "sourceFormat": "ROS bag",
      "toolOrLibrary": "Custom Python (rosbags + cv2)",
      "complexity": "moderate",
      "notes": "Extract synchronized camera and LiDAR topics, compute calibration from TF tree."
    },
    {
      "sourceFormat": "Custom sensors",
      "toolOrLibrary": "Custom Python",
      "complexity": "trivial",
      "notes": "Write images as PNG and point clouds as binary float32 following KITTI naming conventions."
    },
    {
      "sourceFormat": "Argoverse 2",
      "toolOrLibrary": "av2 SDK + custom script",
      "complexity": "moderate",
      "notes": "Extract per-frame LiDAR sweeps and camera images, transform annotations from global to camera frame."
    }
  ],
  "keyPapers": [
    {
      "id": "geiger-kitti-2012",
      "title": "Are We Ready for Autonomous Driving? The KITTI Vision Benchmark Suite",
      "authors": "Geiger et al.",
      "venue": "CVPR 2012",
      "year": 2012,
      "url": "https://www.cvlibs.net/publications/Geiger2012CVPR.pdf"
    },
    {
      "id": "geiger-kitti-2013",
      "title": "Vision meets Robotics: The KITTI Dataset",
      "authors": "Geiger et al.",
      "venue": "IJRR 2013",
      "year": 2013,
      "url": "https://www.cvlibs.net/publications/Geiger2013IJRR.pdf"
    },
    {
      "id": "lang-pointpillars-2019",
      "title": "PointPillars: Fast Encoders for Object Detection from Point Clouds",
      "authors": "Lang et al.",
      "venue": "CVPR 2019",
      "year": 2019,
      "url": "https://arxiv.org/abs/1812.05784"
    },
    {
      "id": "yan-second-2018",
      "title": "SECOND: Sparsely Embedded Convolutional Detection",
      "authors": "Yan et al.",
      "venue": "Sensors 2018",
      "year": 2018,
      "url": "https://www.mdpi.com/1424-8220/18/10/3337"
    },
    {
      "id": "shi-pvrcnn-2020",
      "title": "PV-RCNN: Point-Voxel Feature Set Abstraction for 3D Object Detection",
      "authors": "Shi et al.",
      "venue": "CVPR 2020",
      "year": 2020,
      "url": "https://arxiv.org/abs/1912.13192"
    }
  ],
  "claruDelivery": "Claru delivers data in KITTI format with complete calibration files, accurate 3D bounding box labels, and binary LiDAR point clouds. All deliveries are validated against the official KITTI evaluation toolkit. For custom domains, we define application-specific category taxonomies while maintaining strict format compatibility with OpenPCDet, MMDetection3D, and the broader KITTI ecosystem."
};

export default data;
