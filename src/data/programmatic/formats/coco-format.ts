import type { FormatPageData } from "./types";

const data: FormatPageData = {
  "slug": "coco-format",
  "metaTitle": "COCO Format (Common Objects in Context) for Robotics Data | Claru",
  "metaDescription": "COCO format is the most widely used annotation format for object detection and segmentation. Learn its structure and how Claru delivers robotics annotations in COCO format.",
  "primaryKeyword": "COCO format robotics",
  "secondaryKeywords": [
    "COCO format robotics data",
    "COCO annotation format",
    "COCO robotics training data",
    "COCO robotics dataset format",
    "coco-format robot data",
    "COCO instance segmentation",
    "COCO keypoint detection",
    "pycocotools robotics"
  ],
  "canonicalPath": "/formats/coco-format",
  "h1": "COCO Format (Common Objects in Context): Complete Guide for Robotics Data",
  "heroSubtitle": "COCO format is the most widely used annotation format for object detection and segmentation. Learn its structure and how Claru delivers robotics annotations in COCO format.",
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
      "label": "COCO Format",
      "href": "/formats/coco-format"
    }
  ],
  "sections": [
    {
      "type": "prose",
      "heading": "Schema and Structure",
      "paragraphs": [
        "COCO annotations are stored as a single JSON file containing three core sections: images (an array of objects with id, file_name, width, and height), annotations (an array with id, image_id, category_id, bbox in [x, y, width, height] format, segmentation polygons or RLE-encoded masks, and area), and categories (an array with id, name, and supercategory). The bounding box convention uses top-left origin with width and height, distinguishing COCO from Pascal VOC's [xmin, ymin, xmax, ymax] format. The iscrowd flag differentiates individual instance annotations (polygon segmentation) from crowd regions (RLE mask).",
        "The COCO format supports five distinct annotation types through separate JSON structures: object detection (bounding boxes), instance segmentation (per-pixel masks), keypoint detection (skeleton-based pose with visibility flags), panoptic segmentation (unified stuff and things), and image captioning (natural language descriptions). For keypoint detection, the categories array includes a keypoints field listing joint names and a skeleton field defining connectivity as pairs of keypoint indices. Each annotation carries a keypoints array of [x, y, visibility] triplets where visibility is 0 (not labeled), 1 (labeled but not visible), or 2 (labeled and visible). The panoptic extension, introduced by Kirillov et al. in 2019, uses PNG images where each pixel encodes a segment ID via R + G*256 + B*256*256, enabling both stuff (sky, road) and things (car, person) to be represented in a single annotation.",
        "For robotics perception, the COCO format is particularly valuable because it standardizes the interface between annotation tools and model training frameworks. A single annotations JSON file can contain hundreds of thousands of annotations across thousands of images, with category hierarchies expressed through the supercategory field. The info section records dataset metadata (year, version, description, contributor, url, date_created), and the licenses array maps license IDs to names and URLs. This self-describing structure means any tool that reads COCO format can ingest any COCO-compatible dataset without format-specific adapters."
      ]
    },
    {
      "type": "cards",
      "heading": "Frameworks and Models Using COCO Format",
      "cards": [
        {
          "title": "Detectron2",
          "description": "Meta AI's detection and segmentation framework uses COCO as its primary data format, with built-in DatasetCatalog registration for COCO-style annotations."
        },
        {
          "title": "MMDetection",
          "description": "OpenMMLab's comprehensive detection toolbox supports all COCO annotation types including instance segmentation, panoptic segmentation, and keypoint detection."
        },
        {
          "title": "YOLO (Ultralytics)",
          "description": "YOLOv8 and YOLOv11 natively import COCO format annotations, automatically converting to YOLO's normalized xywh format during training."
        },
        {
          "title": "DETR / RT-DETR",
          "description": "Transformer-based detection models from Meta and Baidu use COCO format for training and evaluation via the pycocotools evaluation API."
        },
        {
          "title": "Grounding DINO",
          "description": "Open-set object detection model that evaluates on COCO format benchmarks and accepts COCO-style annotations for fine-tuning."
        },
        {
          "title": "SAM (Segment Anything)",
          "description": "Meta's Segment Anything Model was trained on SA-1B using an extended COCO-style annotation format with per-mask quality scores."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Reading and Writing COCO Annotations in Python",
      "paragraphs": [
        "The pycocotools library (pip install pycocotools) is the standard API for working with COCO annotations. Initialize with coco = COCO('annotations.json'), then query annotations by image with coco.getAnnIds(imgIds=[img_id]) or by category with coco.getAnnIds(catIds=[cat_id]). The API handles both polygon and RLE segmentation formats transparently, and coco.annToMask(ann) converts any annotation to a binary mask. For evaluation, COCOeval computes the standard AP metrics at IoU thresholds from 0.5 to 0.95 in steps of 0.05, giving the COCO-standard mAP that is the de facto reporting metric in detection research.",
        "Creating a new COCO annotation file follows a straightforward pattern: build the images, annotations, and categories arrays as Python lists of dictionaries, then serialize with json.dump(). Each annotation must have a unique id (typically a running integer), and the image_id must reference a valid entry in the images array. For segmentation, polygon points are stored as a flat list [x1, y1, x2, y2, ...] representing one or more closed polygons, and the area field should be computed from the segmentation mask using pycocotools.mask.area(). The bbox field must be [x, y, w, h] where (x, y) is the top-left corner. Tools like FiftyOne (fiftyone.zoo.datasets) and CVAT provide COCO export with correct formatting, while Label Studio and Labelbox offer one-click COCO JSON export.",
        "For large-scale annotation projects, the COCO Results Format enables submitting model predictions separately from ground truth. A results file is a JSON array where each entry contains image_id, category_id, score, and the detection-specific fields (bbox for detection, segmentation for instance segmentation, keypoints for pose). This separation of predictions from ground truth allows evaluation without modifying the original annotation file and enables server-side evaluation on held-out test sets, which is how the COCO Challenge leaderboard operates."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "When to Use COCO Format vs Alternatives",
      "description": "COCO is the most widely supported perception annotation format, but alternatives may be better for specific use cases.",
      "columns": [
        "Format",
        "Best For",
        "Annotation Types",
        "Tool Support",
        "3D Support"
      ],
      "rows": [
        {
          "Format": "COCO",
          "Best For": "Detection, segmentation, keypoints",
          "Annotation Types": "Bbox, polygon, RLE, keypoints, captions",
          "Tool Support": "Excellent (universal)",
          "3D Support": "None (2D only)"
        },
        {
          "Format": "Pascal VOC",
          "Best For": "Simple bounding box detection",
          "Annotation Types": "Bbox, segmentation (XML)",
          "Tool Support": "Good (legacy)",
          "3D Support": "None"
        },
        {
          "Format": "KITTI",
          "Best For": "Autonomous driving 3D detection",
          "Annotation Types": "3D bbox, tracking IDs",
          "Tool Support": "Good (driving domain)",
          "3D Support": "Yes (7-DoF boxes)"
        },
        {
          "Format": "nuScenes",
          "Best For": "Multi-sensor driving data",
          "Annotation Types": "3D bbox, tracking, attributes",
          "Tool Support": "Moderate",
          "3D Support": "Yes (full 3D)"
        },
        {
          "Format": "YOLO",
          "Best For": "Fast YOLO training",
          "Annotation Types": "Bbox (normalized), segmentation",
          "Tool Support": "Good (Ultralytics)",
          "3D Support": "None"
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
          "Source Format": "Pascal VOC",
          "Tool / Library": "pycocotools / custom script",
          "Complexity": "trivial",
          "Notes": "Convert VOC XML annotations to COCO JSON; map xmin/ymin/xmax/ymax to x/y/w/h."
        },
        {
          "Source Format": "KITTI labels",
          "Tool / Library": "Custom Python",
          "Complexity": "moderate",
          "Notes": "Map KITTI text labels and 2D boxes to COCO annotation structure; 3D info is discarded."
        },
        {
          "Source Format": "Label Studio export",
          "Tool / Library": "Built-in export",
          "Complexity": "trivial",
          "Notes": "Label Studio exports directly to COCO format with polygon and bbox annotations."
        },
        {
          "Source Format": "YOLO (Ultralytics)",
          "Tool / Library": "ultralytics.utils.converters",
          "Complexity": "trivial",
          "Notes": "Convert YOLO's normalized xywh center-format labels to COCO's absolute xywh top-left format."
        },
        {
          "Source Format": "CVAT annotations",
          "Tool / Library": "CVAT built-in export",
          "Complexity": "trivial",
          "Notes": "CVAT exports detection, segmentation, and keypoint annotations directly in COCO format."
        },
        {
          "Source Format": "Labelbox export",
          "Tool / Library": "labelbox SDK",
          "Complexity": "moderate",
          "Notes": "Labelbox NDJSON export can be converted to COCO using their Python SDK converters."
        }
      ]
    },
    {
      "type": "prose",
      "heading": "COCO for Robotics Perception Pipelines",
      "paragraphs": [
        "In robotics applications, COCO format serves as the standard for perception annotations that feed into grasping, navigation, and manipulation pipelines. Object detection annotations in COCO format are used to train the perception modules of systems like GraspNet, Contact-GraspNet, and AnyGrasp, where accurate bounding boxes and segmentation masks are prerequisites for grasp pose estimation. For bin picking and warehouse automation, COCO instance segmentation provides the per-object masks needed to separate overlapping items before grasp planning.",
        "Keypoint annotations in COCO format extend naturally to robotic manipulation of articulated objects. The skeleton definition allows representing hinge joints on cabinet doors, drawer handles, and tool grips as connected keypoint graphs. The SAPIEN and PartNet-Mobility benchmarks define keypoint schemas for articulated household objects following COCO conventions. For human-robot collaboration, COCO keypoint annotations trained on the COCO-WholeBody dataset (133 keypoints covering body, face, hands, and feet) provide the pose estimation foundation for safe proximity monitoring and handover planning.",
        "The COCO evaluation metrics (AP@[.5:.95], AP@.5, AP@.75, AR@[1,10,100]) have become the universal reporting standard for detection and segmentation. In robotics, these metrics are supplemented with task-specific evaluations (grasp success rate, pick-and-place accuracy), but COCO AP remains the accepted baseline for comparing perception model quality. The pycocotools.cocoeval module computes these metrics efficiently, handling edge cases like crowd annotations, small/medium/large object splits, and per-category AP breakdowns."
      ]
    },
    {
      "type": "citation-list",
      "heading": "References",
      "citations": [
        {
          "id": "lin-coco-2014",
          "title": "Microsoft COCO: Common Objects in Context",
          "authors": "Lin et al.",
          "venue": "ECCV 2014",
          "year": 2014,
          "url": "https://arxiv.org/abs/1405.0312"
        },
        {
          "id": "kirillov-coco-panoptic-2019",
          "title": "Panoptic Segmentation",
          "authors": "Kirillov et al.",
          "venue": "CVPR 2019",
          "year": 2019,
          "url": "https://arxiv.org/abs/1801.00868"
        },
        {
          "id": "wu-detectron2-2019",
          "title": "Detectron2",
          "authors": "Wu et al.",
          "venue": "Meta AI Research",
          "year": 2019,
          "url": "https://github.com/facebookresearch/detectron2"
        },
        {
          "id": "kirillov-sam-2023",
          "title": "Segment Anything",
          "authors": "Kirillov et al.",
          "venue": "ICCV 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2304.02643"
        },
        {
          "id": "jin-cocowholebody-2020",
          "title": "Whole-Body Human Pose Estimation in the Wild",
          "authors": "Jin et al.",
          "venue": "ECCV 2020",
          "year": 2020,
          "url": "https://arxiv.org/abs/2007.11858"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Claru Data Delivery in COCO Format",
      "paragraphs": [
        "Claru delivers object detection, instance segmentation, panoptic segmentation, and keypoint annotations in COCO format. Every annotation file is validated against the official COCO schema using pycocotools to ensure correct annotation IDs, bounding box consistency, segmentation mask integrity, and category mapping. Annotations are COCO-compatible for direct use with Detectron2, MMDetection, Ultralytics YOLO, and any framework that accepts COCO JSON.",
        "For robotics perception projects, Claru provides custom category taxonomies aligned with your object inventory, whether that is warehouse SKUs, kitchen utensils, industrial parts, or articulated household objects. Keypoint annotations include application-specific skeleton definitions for grasp points, functional parts, and articulation joints. Large deliveries include per-split annotation files (train, val, test) with stratified category distributions and a statistics report documenting per-category instance counts, bbox size distributions, and annotation density per image."
      ]
    }
  ],
  "faqs": [
    {
      "question": "Does COCO format support video annotations?",
      "answer": "Standard COCO is image-based, but the COCO Video extension (used in the YouTube-VIS benchmark) adds a videos array and frame-level annotations with tracking instance IDs that persist across frames. The TAO (Tracking Any Object) dataset extends this further with long-tail category tracking. Claru supports both static image COCO and video COCO with consistent track IDs for multi-object tracking in robotics scenarios like conveyor belt monitoring or warehouse activity recognition."
    },
    {
      "question": "How are segmentation masks stored in COCO format?",
      "answer": "COCO supports two segmentation encodings. Polygon annotations store a list of [x1, y1, x2, y2, ...] vertex coordinates defining closed contours, which is space-efficient for simple shapes. RLE (Run-Length Encoding) stores binary masks as alternating run lengths of zeros and ones, which is more compact for complex shapes with holes. The iscrowd flag indicates whether an annotation uses RLE (iscrowd=1, for crowd regions) or polygons (iscrowd=0, for individual instances). The pycocotools library converts between formats transparently via the mask.encode() and mask.decode() functions, and Claru provides both representations in every delivery."
    },
    {
      "question": "Is COCO format suitable for robotics data?",
      "answer": "COCO is excellent for perception annotations (detection, segmentation, keypoints) that feed into robotics perception pipelines. It does not capture action sequences, temporal dynamics, or robot state, so it is not a replacement for trajectory formats like RLDS or HDF5. The standard approach in robotics is to use COCO annotations for the perception layer (identifying and localizing objects) and pair them with trajectory data in RLDS, HDF5, or LeRobot format for the policy learning layer. Claru delivers both perception annotations in COCO format and trajectory data in your preferred policy format as a unified package."
    },
    {
      "question": "What is the difference between COCO's bbox and Pascal VOC's bbox format?",
      "answer": "COCO uses [x, y, width, height] where (x, y) is the top-left corner. Pascal VOC uses [xmin, ymin, xmax, ymax] representing the two corner points. This seemingly minor difference is one of the most common sources of bugs in detection pipelines. When converting, xmin=x, ymin=y, xmax=x+width, ymax=y+height. Both pycocotools and FiftyOne handle this conversion correctly. Claru validates all bbox coordinates against image dimensions to catch off-by-one and format confusion errors before delivery."
    },
    {
      "question": "How do I evaluate model performance on COCO annotations?",
      "answer": "Use the pycocotools.cocoeval.COCOeval class: load ground truth with COCO('gt.json'), load predictions with coco_gt.loadRes('predictions.json'), then run COCOeval(coco_gt, coco_pred, 'bbox').evaluate(). The standard metrics are AP@[.5:.95] (averaged over 10 IoU thresholds), AP@.5 (PASCAL-style), AP@.75 (strict), and AR@[1,10,100] (recall at different detection counts). For segmentation, replace 'bbox' with 'segm'. Results are broken down by object size (small <32x32, medium 32-96, large >96 pixels), which is critical for robotics where objects vary dramatically in apparent size depending on camera distance."
    }
  ],
  "ctaHeading": "Get Data in COCO Format",
  "ctaDescription": "Claru delivers robotics perception annotations in COCO format, validated against pycocotools and ready to load into Detectron2, MMDetection, or YOLO. Tell us your requirements.",
  "relatedGlossaryTerms": [
    "rlds",
    "cross-embodiment-data",
    "data-enrichment"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "fileExtensions": [
    ".json",
    ".jpg",
    ".png"
  ],
  "schemaDescription": "COCO annotations are stored as a single JSON file containing three core sections: images (id, file_name, width, height), annotations (id, image_id, category_id, bbox in [x,y,w,h], segmentation as polygon or RLE, area, iscrowd), and categories (id, name, supercategory). The format supports five annotation types: object detection, instance segmentation, keypoint detection (with skeleton definitions), panoptic segmentation (PNG-encoded segment maps), and image captioning. Each annotation carries a unique ID and references its parent image and category by ID, enabling efficient cross-referencing via pycocotools.",
  "frameworksUsing": [
    {
      "name": "Detectron2",
      "description": "Meta AI's detection and segmentation framework with native COCO DatasetCatalog registration and pycocotools evaluation.",
      "url": "https://github.com/facebookresearch/detectron2"
    },
    {
      "name": "MMDetection",
      "description": "OpenMMLab's comprehensive detection toolbox supporting all COCO annotation types including panoptic and keypoint.",
      "url": "https://github.com/open-mmlab/mmdetection"
    },
    {
      "name": "YOLO (Ultralytics)",
      "description": "YOLOv8 and YOLOv11 natively import COCO annotations with automatic format conversion during training.",
      "url": "https://github.com/ultralytics/ultralytics"
    },
    {
      "name": "DETR / RT-DETR",
      "description": "Transformer-based detectors using COCO format for training and evaluation via the standard pycocotools API."
    },
    {
      "name": "Grounding DINO",
      "description": "Open-set detection model benchmarked on COCO and compatible with COCO-style annotations for fine-tuning."
    },
    {
      "name": "SAM (Segment Anything)",
      "description": "Meta's foundation segmentation model trained on SA-1B in an extended COCO-style annotation format."
    }
  ],
  "conversions": [
    {
      "sourceFormat": "Pascal VOC",
      "toolOrLibrary": "pycocotools / custom script",
      "complexity": "trivial",
      "notes": "Convert VOC XML annotations to COCO JSON; map xmin/ymin/xmax/ymax to x/y/w/h format."
    },
    {
      "sourceFormat": "KITTI labels",
      "toolOrLibrary": "Custom Python",
      "complexity": "moderate",
      "notes": "Map KITTI text labels to COCO annotation structure; 3D bounding box information is discarded."
    },
    {
      "sourceFormat": "Label Studio export",
      "toolOrLibrary": "Built-in export",
      "complexity": "trivial",
      "notes": "Label Studio can export directly to COCO format with polygon and bounding box annotations."
    },
    {
      "sourceFormat": "YOLO (Ultralytics)",
      "toolOrLibrary": "ultralytics.utils.converters",
      "complexity": "trivial",
      "notes": "Convert YOLO normalized center-format labels to COCO absolute top-left format."
    },
    {
      "sourceFormat": "CVAT annotations",
      "toolOrLibrary": "CVAT built-in export",
      "complexity": "trivial",
      "notes": "CVAT exports all annotation types directly in COCO JSON format."
    },
    {
      "sourceFormat": "Labelbox NDJSON",
      "toolOrLibrary": "labelbox SDK",
      "complexity": "moderate",
      "notes": "Convert Labelbox NDJSON export to COCO using their Python SDK or FiftyOne converters."
    }
  ],
  "keyPapers": [
    {
      "id": "lin-coco-2014",
      "title": "Microsoft COCO: Common Objects in Context",
      "authors": "Lin et al.",
      "venue": "ECCV 2014",
      "year": 2014,
      "url": "https://arxiv.org/abs/1405.0312"
    },
    {
      "id": "kirillov-coco-panoptic-2019",
      "title": "Panoptic Segmentation",
      "authors": "Kirillov et al.",
      "venue": "CVPR 2019",
      "year": 2019,
      "url": "https://arxiv.org/abs/1801.00868"
    },
    {
      "id": "wu-detectron2-2019",
      "title": "Detectron2",
      "authors": "Wu et al.",
      "venue": "Meta AI Research",
      "year": 2019,
      "url": "https://github.com/facebookresearch/detectron2"
    },
    {
      "id": "kirillov-sam-2023",
      "title": "Segment Anything",
      "authors": "Kirillov et al.",
      "venue": "ICCV 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2304.02643"
    },
    {
      "id": "jin-cocowholebody-2020",
      "title": "Whole-Body Human Pose Estimation in the Wild",
      "authors": "Jin et al.",
      "venue": "ECCV 2020",
      "year": 2020,
      "url": "https://arxiv.org/abs/2007.11858"
    }
  ],
  "claruDelivery": "Claru delivers object detection, instance segmentation, panoptic segmentation, and keypoint annotations in COCO format. Every annotation file is validated against the official COCO schema using pycocotools. Annotations include custom category taxonomies aligned to your object inventory, per-split files (train/val/test) with stratified distributions, and a statistics report documenting per-category counts and bbox size distributions."
};

export default data;
