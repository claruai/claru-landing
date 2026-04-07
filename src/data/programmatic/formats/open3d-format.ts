import type { FormatPageData } from "./types";

const data: FormatPageData = {
  "slug": "open3d-format",
  "metaTitle": "Open3D Format for Robotics Data | Claru",
  "metaDescription": "Open3D provides standard point cloud formats and processing tools for 3D robotics data. Understand PCD, PLY, and Open3D's tensor dataset format.",
  "primaryKeyword": "Open3D format robotics",
  "secondaryKeywords": [
    "Open3D format robotics data",
    "Open3D robotics training data",
    "Open3D robotics dataset format",
    "open3d-format robot data",
    "PCD point cloud format",
    "PLY mesh format robotics",
    "3D point cloud robotics"
  ],
  "canonicalPath": "/formats/open3d-format",
  "h1": "Open3D Format: Complete Guide for Robotics Data",
  "heroSubtitle": "Open3D provides standard point cloud formats and processing tools for 3D robotics data. Understand PCD, PLY, and Open3D's tensor dataset format.",
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
      "label": "Open3D Format",
      "href": "/formats/open3d-format"
    }
  ],
  "sections": [
    {
      "type": "prose",
      "heading": "Schema and Structure",
      "paragraphs": [
        "Open3D works with three primary 3D data formats, each with distinct strengths. PCD (Point Cloud Data) files, originally defined by the Point Cloud Library (PCL), store point clouds with a structured header specifying fields (e.g., x, y, z, rgb, normal_x, normal_y, normal_z), their sizes and types, the total point count, and the data encoding (ascii, binary, or binary_compressed). The binary_compressed variant uses LZF compression, reducing file sizes by 30-50% for typical robotics point clouds while maintaining fast decompression. PLY (Polygon File Format, also called Stanford Triangle Format) supports both point clouds and polygon meshes, with a header defining element types (vertex, face) and their properties. PLY is the preferred format when both point data and mesh topology are needed, such as for reconstructed 3D scenes or object models used in grasp planning.",
        "Open3D's native dataset format for RGBD reconstruction pipelines stores registered sequences as a directory structure: trajectory.json (camera poses as 4x4 transformation matrices for each frame), a depth/ directory with 16-bit PNG depth images, and a color/ directory with RGB images. The trajectory.json file contains an array of 4x4 homogeneous transformation matrices representing the camera-to-world transform for each frame, enabling TSDF (Truncated Signed Distance Function) volumetric integration to reconstruct dense 3D surfaces. This format is used by Open3D's reconstruction pipeline (open3d.pipelines.integration.ScalableTSDFVolume) and is interoperable with ElasticFusion, BundleFusion, and other real-time reconstruction systems.",
        "Open3D 0.18+ introduced a tensor-based data model (open3d.t.geometry) that stores point clouds and meshes as dictionaries of named tensors on CPU or GPU. This tensor geometry system supports arbitrary per-point and per-vertex attributes stored as named Open3D tensors, enabling seamless interoperability with PyTorch and TensorFlow via DLPack zero-copy transfer. For ML training on 3D data, the tensor API eliminates the conversion overhead between Open3D's legacy geometry objects and framework-specific tensor types, achieving throughput of 50-100 million points per second for operations like voxel downsampling and normal estimation on modern GPUs."
      ]
    },
    {
      "type": "cards",
      "heading": "Frameworks and Models Using Open3D Format",
      "cards": [
        {
          "title": "Open3D",
          "description": "The primary 3D processing library for robotics, providing I/O, registration, reconstruction, and visualization for PCD, PLY, and custom formats."
        },
        {
          "title": "Open3D-ML",
          "description": "Machine learning extension for Open3D supporting 3D semantic segmentation models (RandLA-Net, KPConv, PointTransformer) with native data loaders."
        },
        {
          "title": "CloudCompare",
          "description": "Open-source 3D point cloud processing and comparison tool supporting PCD, PLY, LAS, E57, and 20+ other formats."
        },
        {
          "title": "PCL (Point Cloud Library)",
          "description": "C++ library for point cloud processing that defined the PCD format and interoperates with Open3D through shared file formats."
        },
        {
          "title": "PyTorch3D",
          "description": "Meta's 3D deep learning library that loads PLY meshes and point clouds for differentiable rendering and 3D understanding."
        },
        {
          "title": "Meshlab",
          "description": "Open-source mesh processing system supporting PLY, OBJ, STL, and other formats for 3D model cleaning and decimation."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Reading and Writing 3D Data with Open3D in Python",
      "paragraphs": [
        "Open3D provides unified I/O for all supported 3D formats. Reading a point cloud is a single call: pcd = o3d.io.read_point_cloud('scene.pcd') or o3d.io.read_point_cloud('scene.ply'), returning an open3d.geometry.PointCloud with .points (Nx3 float64), .colors (Nx3 float64, 0-1 range), and .normals (Nx3 float64) attributes. For meshes: mesh = o3d.io.read_triangle_mesh('model.ply') returns an object with .vertices, .triangles, .vertex_normals, and .vertex_colors. The format is auto-detected from the file extension, and Open3D supports reading PCD (ascii/binary/binary_compressed), PLY (ascii/binary), OBJ, STL, OFF, and GLTF formats.",
        "Writing follows the same pattern: o3d.io.write_point_cloud('output.pcd', pcd, write_ascii=False, compressed=True) writes a binary compressed PCD file. For best compatibility with PCL-based C++ code, use PCD format with binary encoding. For exchange with Blender, MeshLab, or web viewers, PLY binary is preferred. The key performance consideration for large point clouds (10M+ points) is to avoid ASCII encoding, which is 5-10x slower to read and 3-5x larger on disk than binary. For RGBD sequences, o3d.io.read_pinhole_camera_trajectory('trajectory.json') loads the camera poses, and the reconstruction pipeline is initialized with o3d.pipelines.integration.ScalableTSDFVolume(voxel_length=0.005, sdf_trunc=0.04).",
        "For ML workflows, Open3D's tensor-based API (open3d.t.io) provides zero-copy conversion to PyTorch tensors. Loading a point cloud as tensors: tpcd = o3d.t.io.read_point_cloud('scene.ply'), then tpcd.point.positions.to(o3d.core.Device('cuda:0')) moves points to GPU, and tpcd.point.positions.to_dlpack() provides DLPack interop with PyTorch via torch.from_dlpack(). This pipeline achieves sub-millisecond conversion overhead for point clouds up to 1 million points, making it practical for on-the-fly data loading in training loops. Open3D-ML extends this with dataset classes for S3DIS, ScanNet, SemanticKITTI, and Toronto3D that handle format-specific loading and provide standardized train/val/test splits."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "When to Use Open3D Formats vs Alternatives",
      "description": "PCD and PLY are the most widely supported point cloud formats, but specialized formats may be better for specific applications.",
      "columns": [
        "Format",
        "Best For",
        "Mesh Support",
        "Compression",
        "Ecosystem"
      ],
      "rows": [
        {
          "Format": "PCD",
          "Best For": "Point clouds with custom fields",
          "Mesh Support": "No (points only)",
          "Compression": "LZF (binary_compressed)",
          "Ecosystem": "PCL, Open3D, ROS"
        },
        {
          "Format": "PLY",
          "Best For": "Point clouds + meshes",
          "Mesh Support": "Yes (vertices + faces)",
          "Compression": "None (binary is compact)",
          "Ecosystem": "Universal (Blender, MeshLab, etc.)"
        },
        {
          "Format": "LAS / LAZ",
          "Best For": "Aerial LiDAR, surveying",
          "Mesh Support": "No",
          "Compression": "LAZ (4-8x ratio)",
          "Ecosystem": "PDAL, LAStools, CloudCompare"
        },
        {
          "Format": "E57",
          "Best For": "Terrestrial laser scanning",
          "Mesh Support": "No",
          "Compression": "Built-in (efficient)",
          "Ecosystem": "FARO, Leica, CloudCompare"
        },
        {
          "Format": "NumPy (.npy/.npz)",
          "Best For": "ML training pipelines",
          "Mesh Support": "No (array only)",
          "Compression": "npz with zlib",
          "Ecosystem": "PyTorch, TensorFlow, NumPy"
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
          "Source Format": "ROS PointCloud2",
          "Tool / Library": "open3d + ros_numpy",
          "Complexity": "trivial",
          "Notes": "Convert ROS messages to Open3D point clouds via numpy intermediate: o3d.geometry.PointCloud(o3d.utility.Vector3dVector(points))."
        },
        {
          "Source Format": "Depth images (RGBD)",
          "Tool / Library": "o3d.geometry.PointCloud.create_from_depth_image()",
          "Complexity": "trivial",
          "Notes": "Project depth maps to 3D with camera intrinsics; supports both Open3D and custom pinhole models."
        },
        {
          "Source Format": "LiDAR binary (KITTI .bin)",
          "Tool / Library": "numpy + open3d",
          "Complexity": "trivial",
          "Notes": "Load binary float32 array with np.fromfile(), wrap as Open3D PointCloud with Vector3dVector."
        },
        {
          "Source Format": "LAS / LAZ (aerial LiDAR)",
          "Tool / Library": "laspy + open3d",
          "Complexity": "trivial",
          "Notes": "Read with laspy, extract xyz/rgb arrays, construct Open3D PointCloud objects."
        },
        {
          "Source Format": "OBJ / STL meshes",
          "Tool / Library": "o3d.io.read_triangle_mesh()",
          "Complexity": "trivial",
          "Notes": "Direct loading of OBJ (with materials) and STL (binary or ascii) mesh files."
        },
        {
          "Source Format": "NumPy arrays",
          "Tool / Library": "o3d.utility.Vector3dVector()",
          "Complexity": "trivial",
          "Notes": "Wrap (N,3) numpy arrays directly as Open3D point positions, colors, or normals."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Open3D in Robotics Perception and Manipulation Pipelines",
      "paragraphs": [
        "Open3D serves as the 3D processing backbone for many robotic manipulation systems. In a typical pick-and-place pipeline, depth cameras capture RGBD frames that are converted to point clouds using Open3D's create_from_rgbd_image() with the camera intrinsic matrix. These point clouds are then processed through a chain of Open3D operations: statistical outlier removal (remove_statistical_outlier) to clean noise, plane segmentation (segment_plane) to remove the table surface, DBSCAN clustering (cluster_dbscan) to segment individual objects, and ICP registration (registration_icp) to align detected objects against known 3D models for pose estimation. This entire pipeline runs at 5-15 Hz on a modern CPU depending on point cloud density.",
        "For 3D scene reconstruction in robotics, Open3D's TSDF integration pipeline converts a sequence of RGBD frames with known camera poses into a dense 3D mesh or point cloud. The ScalableTSDFVolume class uses a voxel hashing approach that allocates voxels only where data exists, enabling memory-efficient reconstruction of large scenes. A typical reconstruction with 5mm voxel resolution and 500 RGBD frames at 640x480 produces a mesh with 1-5 million vertices, consuming 2-4 GB of memory. The resulting mesh is directly usable for collision checking in motion planning (via Open3D's raycasting scene), navigation map generation, and digital twin creation.",
        "Open3D-ML extends the library with deep learning models for 3D semantic segmentation, which is increasingly important for scene understanding in robotics. Models like RandLA-Net (efficient random sampling for large-scale point clouds), KPConv (kernel point convolution for deformable 3D features), and PointTransformer (attention-based 3D understanding) are available as pre-trained Open3D-ML pipelines that ingest Open3D point cloud objects directly. Training on custom robotics datasets requires providing point clouds with per-point label arrays, which Open3D stores as custom attributes on the PointCloud object."
      ]
    },
    {
      "type": "citation-list",
      "heading": "References",
      "citations": [
        {
          "id": "zhou-open3d-2018",
          "title": "Open3D: A Modern Library for 3D Data Processing",
          "authors": "Zhou et al.",
          "venue": "arXiv 2018",
          "year": 2018,
          "url": "https://arxiv.org/abs/1801.09847"
        },
        {
          "id": "dai-scannet-2017",
          "title": "ScanNet: Richly-annotated 3D Reconstructions of Indoor Scenes",
          "authors": "Dai et al.",
          "venue": "CVPR 2017",
          "year": 2017,
          "url": "https://arxiv.org/abs/1702.04405"
        },
        {
          "id": "rusu-pcl-2011",
          "title": "3D is here: Point Cloud Library (PCL)",
          "authors": "Rusu and Cousins",
          "venue": "ICRA 2011",
          "year": 2011,
          "url": "https://ieeexplore.ieee.org/document/5980567"
        },
        {
          "id": "hu-randlanet-2020",
          "title": "RandLA-Net: Efficient Semantic Segmentation of Large-Scale Point Clouds",
          "authors": "Hu et al.",
          "venue": "CVPR 2020",
          "year": 2020,
          "url": "https://arxiv.org/abs/1911.11236"
        },
        {
          "id": "ravi-pytorch3d-2020",
          "title": "Accelerating 3D Deep Learning with PyTorch3D",
          "authors": "Ravi et al.",
          "venue": "SIGGRAPH Asia 2020",
          "year": 2020,
          "url": "https://arxiv.org/abs/2007.08501"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Claru Data Delivery in Open3D Format",
      "paragraphs": [
        "Claru delivers 3D data in Open3D-compatible formats (PCD binary compressed, PLY binary, or NumPy arrays) with calibration files for direct loading into Open3D processing pipelines. Point clouds include per-point RGB colors, surface normals, and optional semantic labels as custom PCD fields. For RGBD sequence datasets, we provide Open3D-compatible trajectory.json files with camera poses, enabling direct use with the TSDF reconstruction pipeline.",
        "For manipulation datasets, Claru provides pre-segmented object point clouds with per-object PLY meshes suitable for ICP-based pose refinement and collision checking. For 3D semantic segmentation training, we deliver point clouds with per-point labels in Open3D-ML compatible format, with class taxonomies defined for your target environment (warehouse shelving, kitchen surfaces, factory floor). Large-scale point cloud deliveries (100M+ points) are pre-partitioned into spatial tiles with overlap regions to enable distributed processing and training."
      ]
    }
  ],
  "faqs": [
    {
      "question": "What is the difference between PCD and PLY?",
      "answer": "PCD (Point Cloud Data) is optimized for point clouds with arbitrary per-point fields (position, color, normals, intensity, custom features) and supports LZF compression in binary_compressed mode. PLY (Polygon File Format) supports both point clouds and meshes (vertices + faces with texture coordinates), making it the preferred choice when mesh topology is needed alongside point data. For pure point clouds in robotics pipelines, PCD is simpler and has native support in PCL and ROS. For 3D models, reconstructed meshes, and exchange with CAD/graphics tools (Blender, MeshLab), PLY is more broadly compatible."
    },
    {
      "question": "Can Open3D handle large-scale point clouds?",
      "answer": "Open3D handles point clouds with tens of millions of points on a single machine. Key techniques for large-scale processing include voxel downsampling (o3d.geometry.PointCloud.voxel_down_sample with typical voxel sizes of 1-5cm), octree-based spatial indexing (o3d.geometry.Octree) for efficient neighbor queries, and GPU-accelerated operations via the Open3D tensor API. For point clouds exceeding 100 million points (e.g., city-scale LiDAR scans), the recommended approach is spatial tiling followed by per-tile processing, which Open3D's crop() function supports efficiently."
    },
    {
      "question": "How are registered RGBD sequences stored in Open3D format?",
      "answer": "Open3D's RGBD dataset format uses a directory with trajectory.json (array of 4x4 camera-to-world transformation matrices), depth/ (16-bit PNG depth images where pixel value multiplied by depth_scale gives meters), and color/ (RGB images as PNG or JPEG). The trajectory file stores one 4x4 matrix per frame as a flat 16-element array in row-major order. This format integrates directly with Open3D's TSDF integration pipeline: ScalableTSDFVolume for memory-efficient reconstruction, or UniformTSDFVolume for fixed-resolution voxel grids."
    },
    {
      "question": "How do I convert between Open3D and PyTorch tensors?",
      "answer": "Open3D's tensor API (o3d.t.geometry) provides zero-copy conversion via DLPack. Load a point cloud as tensors: tpcd = o3d.t.io.read_point_cloud('scene.ply'). Access positions as an Open3D tensor: positions = tpcd.point.positions. Convert to PyTorch: torch_positions = torch.from_dlpack(positions.to_dlpack()). The reverse direction works similarly: tpcd.point.positions = o3d.core.Tensor.from_dlpack(torch_tensor). This zero-copy path avoids memory allocation overhead and achieves sub-millisecond conversion for point clouds up to millions of points."
    },
    {
      "question": "What 3D ML models work natively with Open3D data?",
      "answer": "Open3D-ML provides pre-trained pipelines for 3D semantic segmentation: RandLA-Net (efficient for large-scale outdoor scans, 200K+ points per scene), KPConv (high accuracy on indoor scenes with deformable kernel points), and PointTransformer (attention-based architecture for fine-grained understanding). These models accept Open3D PointCloud objects with per-point label arrays for training and return per-point predictions for inference. Open3D-ML includes dataset loaders for S3DIS (indoor rooms), ScanNet (indoor reconstructions), SemanticKITTI (outdoor driving), and Toronto3D (urban mapping) with standardized data splits."
    }
  ],
  "ctaHeading": "Get Data in Open3D Format",
  "ctaDescription": "Claru delivers 3D robotics data in Open3D-compatible formats (PCD, PLY) with calibration, normals, and semantic labels ready for your processing pipeline. Tell us your requirements.",
  "relatedGlossaryTerms": [
    "rlds",
    "cross-embodiment-data",
    "data-enrichment"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "fileExtensions": [
    ".pcd",
    ".ply",
    ".xyz",
    ".obj"
  ],
  "schemaDescription": "Open3D works with three primary 3D formats: PCD (Point Cloud Data) files with structured headers defining per-point fields (x/y/z, rgb, normals) in ascii, binary, or binary_compressed (LZF) encoding; PLY (Polygon File Format) supporting both point clouds and polygon meshes with vertex and face elements; and Open3D's native RGBD dataset format with trajectory.json (4x4 camera-to-world transforms per frame) plus depth/ and color/ image directories. The tensor-based API (o3d.t.geometry) stores point clouds as named tensor dictionaries with DLPack zero-copy interop to PyTorch and TensorFlow.",
  "frameworksUsing": [
    {
      "name": "Open3D",
      "description": "Primary 3D processing library for robotics with I/O, registration, reconstruction, and visualization for PCD, PLY, and custom formats.",
      "url": "http://www.open3d.org/"
    },
    {
      "name": "Open3D-ML",
      "description": "Machine learning extension supporting RandLA-Net, KPConv, and PointTransformer for 3D semantic segmentation with native data loaders."
    },
    {
      "name": "CloudCompare",
      "description": "Open-source 3D point cloud processing and comparison tool supporting PCD, PLY, LAS, E57, and 20+ formats.",
      "url": "https://www.cloudcompare.org/"
    },
    {
      "name": "PCL (Point Cloud Library)",
      "description": "C++ library that defined the PCD format, providing filtering, segmentation, registration, and feature extraction for point clouds.",
      "url": "https://pointclouds.org/"
    },
    {
      "name": "PyTorch3D",
      "description": "Meta's 3D deep learning library loading PLY meshes and point clouds for differentiable rendering and 3D understanding.",
      "url": "https://pytorch3d.org/"
    },
    {
      "name": "Meshlab",
      "description": "Open-source mesh processing system for PLY, OBJ, STL cleaning, decimation, remeshing, and texture mapping."
    }
  ],
  "conversions": [
    {
      "sourceFormat": "ROS PointCloud2",
      "toolOrLibrary": "open3d + ros_numpy",
      "complexity": "trivial",
      "notes": "Convert ROS messages to Open3D point clouds via numpy: o3d.geometry.PointCloud(o3d.utility.Vector3dVector(points))."
    },
    {
      "sourceFormat": "Depth images (RGBD)",
      "toolOrLibrary": "o3d.geometry.PointCloud.create_from_depth_image()",
      "complexity": "trivial",
      "notes": "Project depth maps to 3D with camera intrinsics; supports Open3D and custom pinhole models."
    },
    {
      "sourceFormat": "LiDAR binary (KITTI .bin)",
      "toolOrLibrary": "numpy + open3d",
      "complexity": "trivial",
      "notes": "Load binary float32 with np.fromfile(), wrap as Open3D PointCloud with Vector3dVector."
    },
    {
      "sourceFormat": "LAS / LAZ (aerial LiDAR)",
      "toolOrLibrary": "laspy + open3d",
      "complexity": "trivial",
      "notes": "Read with laspy, extract xyz/rgb arrays, construct Open3D PointCloud objects."
    },
    {
      "sourceFormat": "OBJ / STL meshes",
      "toolOrLibrary": "o3d.io.read_triangle_mesh()",
      "complexity": "trivial",
      "notes": "Direct loading of OBJ (with materials) and STL (binary or ascii) mesh files into Open3D."
    },
    {
      "sourceFormat": "NumPy arrays",
      "toolOrLibrary": "o3d.utility.Vector3dVector()",
      "complexity": "trivial",
      "notes": "Wrap (N,3) numpy arrays directly as Open3D point positions, colors, or normals."
    }
  ],
  "keyPapers": [
    {
      "id": "zhou-open3d-2018",
      "title": "Open3D: A Modern Library for 3D Data Processing",
      "authors": "Zhou et al.",
      "venue": "arXiv 2018",
      "year": 2018,
      "url": "https://arxiv.org/abs/1801.09847"
    },
    {
      "id": "dai-scannet-2017",
      "title": "ScanNet: Richly-annotated 3D Reconstructions of Indoor Scenes",
      "authors": "Dai et al.",
      "venue": "CVPR 2017",
      "year": 2017,
      "url": "https://arxiv.org/abs/1702.04405"
    },
    {
      "id": "rusu-pcl-2011",
      "title": "3D is here: Point Cloud Library (PCL)",
      "authors": "Rusu and Cousins",
      "venue": "ICRA 2011",
      "year": 2011,
      "url": "https://ieeexplore.ieee.org/document/5980567"
    },
    {
      "id": "hu-randlanet-2020",
      "title": "RandLA-Net: Efficient Semantic Segmentation of Large-Scale Point Clouds",
      "authors": "Hu et al.",
      "venue": "CVPR 2020",
      "year": 2020,
      "url": "https://arxiv.org/abs/1911.11236"
    },
    {
      "id": "ravi-pytorch3d-2020",
      "title": "Accelerating 3D Deep Learning with PyTorch3D",
      "authors": "Ravi et al.",
      "venue": "SIGGRAPH Asia 2020",
      "year": 2020,
      "url": "https://arxiv.org/abs/2007.08501"
    }
  ],
  "claruDelivery": "Claru delivers 3D data in Open3D-compatible formats (PCD binary compressed, PLY binary) with per-point RGB colors, surface normals, and optional semantic labels. RGBD sequences include trajectory.json camera poses for TSDF reconstruction. Pre-segmented object point clouds and PLY meshes are provided for manipulation datasets, and large-scale deliveries are spatially tiled for distributed processing."
};

export default data;
