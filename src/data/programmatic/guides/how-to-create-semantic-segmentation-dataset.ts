import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-create-semantic-segmentation-dataset",
  metaTitle: "How to Create a Semantic Segmentation Dataset for Robotics (2026 Guide) | Claru",
  metaDescription: "Step-by-step guide to building semantic segmentation datasets for robotics using SAM 2, manual polygon annotation, and model-assisted labeling pipelines.",
  primaryKeyword: "how to create a semantic segmentation dataset for robotics",
  secondaryKeywords: ["robot segmentation dataset","semantic segmentation annotation","SAM2 robotics annotation","pixel-level labeling","segmentation mask creation"],
  canonicalPath: "/guides/how-to-create-semantic-segmentation-dataset",
  h1: "How to Create a Semantic Segmentation Dataset for Robotics",
  heroSubtitle: "Step-by-step guide to building pixel-accurate semantic segmentation datasets for robot perception, covering class taxonomy design, annotation tooling, model-assisted labeling with SAM 2, and quality validation.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Create a Semantic Segmentation Dataset for Robotics", href: "/guides/how-to-create-semantic-segmentation-dataset" },
  ],
  sections: [
    {
      type: "prose",
      heading: "The Role of Semantic Segmentation in Robot Perception",
      paragraphs: [
        "Semantic segmentation provides robots with a pixel-level understanding of their environment — every pixel in every camera frame is classified into a meaningful category. This dense scene understanding enables robots to identify graspable objects, avoid obstacles, find support surfaces, and distinguish between target objects and distractors in cluttered real-world environments.",
        "The advent of foundation models like SAM 2 has dramatically reduced the cost of segmentation annotation by providing high-quality initial masks from simple point or box prompts. However, SAM 2 alone does not solve the annotation problem for robotics — it has no concept of your domain-specific class taxonomy, struggles with transparent and thin objects common in robotic workspaces, and produces instance masks without semantic labels. Building a production segmentation dataset requires combining SAM 2's spatial precision with human annotators who understand your class taxonomy and edge cases.",
        "This guide covers the complete pipeline from taxonomy design through model-assisted annotation, quality validation, and packaging for training with Mask2Former, SegFormer, or custom architectures."
      ]
    },
    {
      type: "stats",
      heading: "Segmentation Dataset Scale Guidelines",
      stats: [
        { value: "500-2K", label: "Images for fine-tuning pretrained models" },
        { value: "5K-15K", label: "Images for novel domains (industrial, underwater)" },
        { value: "85%+", label: "Target inter-annotator IoU for rigid objects" },
        { value: "60-80%", label: "Annotation time saved with SAM 2 assistance" },
        { value: "15-25", label: "Max recommended class count for efficiency" },
        { value: "3-8 min", label: "Per-image annotation time with SAM 2" }
      ]
    },
    {
      type: "cards",
      heading: "Challenging Object Categories for Robotics Segmentation",
      cards: [
        {
          title: "Transparent Objects",
          description: "Glass containers, clear plastic bins, and liquid surfaces confuse both depth sensors and segmentation models. Collect extra examples and consider specialized models like Trans2Seg."
        },
        {
          title: "Thin Structures",
          description: "Wires, cables, chain links, and utensil handles are often only 1-5 pixels wide. SAM 2 frequently misses these. Use fine polygon annotation and ensure at least 500 examples."
        },
        {
          title: "Deformable Objects",
          description: "Cloth, bags, and food items change shape between frames. Define boundary rules for partially folded and compressed states. Target inter-annotator IoU above 70%."
        },
        {
          title: "Reflective Surfaces",
          description: "Metal tools, polished countertops, and chrome fixtures create specular highlights that shift with viewpoint. Annotators must label the physical object boundary, not the reflection boundary."
        }
      ]
    },
    {
      type: "comparison-table",
      heading: "Segmentation Annotation Formats",
      columns: ["Format", "Storage Efficiency", "Instance Support", "Tool Compatibility"],
      rows: [
        { "Format": "COCO JSON (RLE masks)", "Storage Efficiency": "5-10x better than PNG", "Instance Support": "Full instance + category", "Tool Compatibility": "Detectron2, MMDet, pycocotools" },
        { "Format": "Cityscapes PNG label maps", "Storage Efficiency": "Baseline (uint8 per pixel)", "Instance Support": "Semantic only (no instances)", "Tool Compatibility": "MMSegmentation, SegFormer" },
        { "Format": "PASCAL VOC per-class PNG", "Storage Efficiency": "Poor (one file per class)", "Instance Support": "Limited", "Tool Compatibility": "Legacy — not recommended" },
        { "Format": "Panoptic PNG + JSON", "Storage Efficiency": "Moderate", "Instance Support": "Full panoptic (stuff + things)", "Tool Compatibility": "Detectron2, Mask2Former" }
      ]
    },
    {
      type: "prose",
      heading: "From Annotation to Training: Bridging the Quality Gap",
      paragraphs: [
        "A common mistake is treating annotation completion as the finish line. In practice, the gap between 'all images annotated' and 'dataset ready for training' requires systematic post-processing. Morphological cleanup (removing single-pixel spurs, filling small holes) improves mask boundary quality without changing semantic content. Label map conversion ensures compatibility with your target training framework — Detectron2 expects COCO JSON, MMSegmentation expects Cityscapes-format PNG label maps, and custom pipelines often need both.",
        "The most informative validation is training a baseline segmentation model and analyzing per-class IoU. Classes with unusually low IoU reveal annotation problems that statistical checks alone cannot detect: inconsistent boundary definitions between annotators, classes that are too visually similar to distinguish reliably, or underrepresented classes that need more examples. A confusion matrix from validation predictions pinpoints exactly which class pairs are being confused.",
        "Plan for at least one iteration cycle: annotate, train baseline, identify weak classes, collect more examples or clarify guidelines, re-annotate the weak subset, retrain. This cycle typically takes 1-2 weeks and improves mIoU by 5-15 points compared to a single-pass annotation effort.",
        "For datasets intended for deployment on real robots, validate on images captured from the actual robot cameras in the actual operating environment. A segmentation model that achieves 80% mIoU on the annotation validation split may drop to 50% on robot-captured images due to viewpoint, resolution, and lighting differences. Close this gap by including robot-perspective images in the annotation set from the beginning."
      ]
    }
  ],
  faqs: [
    {
      question: "How many annotated images do I need for a robotics segmentation model?",
      answer: "For fine-tuning a pretrained segmentation model (like SAM 2 or Mask2Former pretrained on COCO) on a specific robotics domain, 500-2,000 annotated images are typically sufficient if the domain is well-represented in the pretraining data (indoor scenes, common objects). For novel environments (underwater, agricultural, industrial) where pretrained features transfer poorly, expect to need 5,000-15,000 images. For training from scratch, aim for 20,000+ images with a minimum of 500 instances per class. A practical approach: start with 500 images, fine-tune, evaluate per-class IoU, and double the dataset for any class below 60% IoU. Classes with thin, deformable, or transparent geometry (wires, fabrics, glass containers) consistently need 3-5x more examples than rigid objects. For video segmentation where temporal consistency matters, annotate every 5th frame and propagate labels using optical flow or SAM 2's video propagation mode."
    },
    {
      question: "Should I use polygon annotation or model-assisted segmentation?",
      answer: "Use a hybrid approach. Pure manual polygon annotation produces the highest quality masks (sub-pixel boundary accuracy) but costs $0.50-2.00 per image for complex scenes with 10+ objects. Model-assisted segmentation using SAM 2 reduces annotation time by 60-80%: the annotator provides point or box prompts, SAM 2 generates the mask, and the annotator corrects errors by adding positive/negative point prompts. For robotics scenes, SAM 2 works well on rigid objects with clear boundaries but struggles with transparent objects (glass bottles, clear bins), thin structures (wires, cables, chain links), and highly cluttered scenes where objects overlap extensively. Use SAM 2-assisted annotation as the first pass, then send a 20% sample for manual polygon correction to establish a quality baseline. If the automatic masks have less than 90% IoU against manual corrections, increase the correction sample rate. The optimal pipeline: SAM 2 generates initial masks, annotators review and correct every mask, and a QA reviewer checks a 10% sample against pixel-level ground truth."
    },
    {
      question: "What class taxonomy should I use for robotics segmentation?",
      answer: "Design your taxonomy around the decisions your robot needs to make, not around object identity. Group objects by functional category relevant to manipulation: graspable_rigid (bottles, boxes, tools), graspable_deformable (bags, cloth, food), support_surface (table, shelf, counter), obstacle_static (wall, pillar, furniture), obstacle_dynamic (human, pet, other robot), container (bin, drawer, cabinet), and background. Avoid overly fine-grained taxonomies (individual SKUs) unless your model specifically needs to distinguish them — it is much easier to split a class later than to merge inconsistently annotated classes. For navigation tasks, use traversable_ground, obstacle, wall, door, dynamic_obstacle, ramp, and stairs. Include an unlabeled/void class for pixels that do not fit any category (image borders, severely occluded regions, ambiguous areas). Limit the total taxonomy to 15-25 classes for practical annotation efficiency. More classes increase annotation time linearly and inter-annotator disagreement exponentially."
    },
    {
      question: "How do I handle occlusion and overlapping objects in segmentation labels?",
      answer: "Robotics scenes frequently contain heavy occlusion from cluttered shelves, stacked objects, and partial visibility. Define a clear occlusion policy before annotation begins. For semantic segmentation (where each pixel gets one class label), occluded pixels belong to the frontmost visible object. For instance segmentation (where each instance gets a unique mask), annotate the full visible extent of each object. The key decision is whether to annotate amodal masks (the complete object shape including occluded regions) or modal masks (only visible pixels). Amodal annotation is more useful for robot planning (the robot needs to know where the full object is, not just the visible part) but is 2-3x more expensive because annotators must infer hidden geometry. A practical compromise: annotate modal masks for all objects, then amodal masks only for the target objects the robot will interact with. Use a separate annotation layer for occlusion ordering so the model can reason about depth relationships. Store both modal and amodal masks when available — different downstream models may need either."
    },
    {
      question: "What annotation format should I use for robotics segmentation datasets?",
      answer: "COCO format is the de facto standard and provides maximum compatibility with existing tooling. Each image's annotations are stored as a list of segments, where each segment contains: category_id (integer), segmentation (polygon coordinates as a list of [x,y] pairs, or RLE-encoded binary mask), bbox (bounding box), and area (pixel count). For video segmentation, extend with a video_id and frame_index field. Store masks as RLE (Run-Length Encoding) using the pycocotools mask utilities — RLE is 5-10x more space-efficient than PNG masks for typical robotics scenes and supports exact pixel-level encoding without compression artifacts. Alternative formats: Cityscapes format (PNG label maps where pixel value = class ID) is simpler but does not support instance segmentation. PASCAL VOC format (per-class PNG masks) is rarely used in new projects. If your downstream model uses a specific format (e.g., Detectron2 expects COCO, MMSegmentation supports multiple formats), target that format directly to avoid lossy conversion steps."
    }
  ],
  ctaHeading: "Need Segmentation Annotation?",
  ctaDescription: "Claru provides pixel-accurate segmentation annotation for robotics datasets. Our annotators specialize in industrial, warehouse, and kitchen environments.",
  relatedGlossaryTerms: ["semantic-segmentation","instance-segmentation","sam","panoptic-segmentation"],
  relatedGuidePages: ["how-to-annotate-depth-maps","how-to-annotate-hand-object-interactions"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  difficulty: "intermediate",
  estimatedTime: "2-4 weeks",
  prerequisites: ["Image or video dataset from your target robot environment","Python 3.10+ with OpenCV, NumPy, and pycocotools","GPU access for running SAM 2 (RTX 3090 or better recommended)","Annotation platform access (Label Studio, CVAT, or Labelbox)"],
  tools: ["SAM 2","Label Studio","CVAT","Python","OpenCV","pycocotools","Detectron2","MMSegmentation"],
  steps: [
    {
      stepNumber: 1,
      title: "Design the Class Taxonomy and Annotation Guidelines",
      description: "The class taxonomy is the foundation of your segmentation dataset — mistakes here propagate to every annotated image and cannot be easily fixed retroactively. Start by inventorying every distinct surface and object type that appears in your robot's operating environment. Photograph or screenshot 50-100 representative scenes and manually list every visible entity. Group entities into functional classes relevant to your robot's perception needs.\n\nFor a tabletop manipulation robot, a proven taxonomy includes: target_object (the object the robot will grasp — may have subclasses per SKU if needed), support_surface (table, counter, shelf), container (bin, box, drawer), obstacle_rigid (appliance, wall, fixture), obstacle_deformable (cloth, paper, bag), robot_arm (the robot's own links, visible in egocentric views), gripper (the end-effector, annotated separately from the arm for grasp planning), human_hand (critical for human-robot interaction scenarios), and background (everything else). Write an annotation guideline document (8-15 pages) that includes: a visual example for each class showing correct annotation, boundary rules for ambiguous cases (e.g., is a plate on a table part of the table or a separate object?), minimum annotation size (ignore objects smaller than 20x20 pixels), occlusion handling policy, and how to label partially visible objects at image borders. The guideline document should have a glossary section with 2-3 positive and 2-3 negative examples per class, showing exactly where boundaries should be drawn. Test the guidelines with 3 annotators on 20 images and compute inter-annotator IoU — if any class has IoU below 80%, the guidelines for that class need clarification.",
      tools: ["Google Docs or Notion", "Image annotation examples"],
      tips: ["Have your ML engineer review the taxonomy before annotation begins — they can catch classes that will be too rare to learn or too similar to distinguish"]
    },
    {
      stepNumber: 2,
      title: "Set Up the Annotation Pipeline with Model-Assisted Labeling",
      description: "Configure your annotation platform with SAM 2 integration for model-assisted labeling. This dramatically reduces annotation time while maintaining high quality. Install SAM 2 locally (pip install segment-anything-2) and download the ViT-H checkpoint (2.4 GB). For Label Studio, install the SAM 2 ML backend: follow the Label Studio ML backend documentation to create a custom backend that accepts point/box prompts from the annotation UI and returns SAM 2-generated masks.\n\nThe annotation workflow becomes: (1) The annotator views an image and identifies the first object to annotate. (2) They click a positive point on the object or draw a bounding box around it. (3) SAM 2 generates a mask prediction in real-time (~100ms per prompt on an RTX 3090). (4) The annotator reviews the mask and adds corrective points — positive points on missed regions, negative points on incorrectly included regions. (5) After 0-3 correction rounds, the annotator accepts the mask and assigns the class label. (6) Repeat for all objects in the image. This workflow reduces per-image annotation time from 15-30 minutes (manual polygons) to 3-8 minutes.\n\nFor video datasets, use SAM 2's video propagation mode: annotate keyframes (every 10th-20th frame) with the interactive workflow above, then run SAM 2's propagate_in_video function to fill intermediate frames. The annotator reviews propagated frames and corrects drift, which typically occurs at occlusion boundaries and during fast motion. Configure CVAT or Label Studio for video annotation mode with interpolation support. Set up a two-stage pipeline: Stage 1 (annotators) creates and corrects masks, Stage 2 (QA reviewers) validates a 15% random sample against pixel-level ground truth.",
      tools: ["SAM 2 (segment-anything-2)", "Label Studio", "CVAT", "GPU server"],
      tips: ["Pre-compute SAM 2 image embeddings for all images in batch mode before annotation begins — this eliminates the per-image encoding delay and makes the interactive annotation feel instantaneous"]
    },
    {
      stepNumber: 3,
      title: "Execute Annotation with Quality Controls",
      description: "Run annotation in structured batches with systematic quality monitoring. Divide your dataset into batches of 200-500 images. For each batch, have annotators complete the full batch, then run automated quality checks before proceeding to the next batch.\n\nAutomated quality checks include: (1) Coverage validation — every image must have at least one annotated segment, and no more than 30% of pixels should be unlabeled/background (for typical robotics scenes). Flag images where background exceeds 70% for manual review, as they may be missing annotations. (2) Class distribution monitoring — compute per-class pixel counts across the batch and compare to expected ratios. If a class suddenly drops to near-zero, annotators may be forgetting it or misclassifying it. (3) Mask quality checks — detect masks with fewer than 50 pixels (likely annotation errors), masks with more than 10 disconnected components (likely incorrect merging), and masks where the boundary smoothness (perimeter^2 / area ratio) exceeds 200 (jagged boundaries suggesting sloppy polygon editing). (4) Temporal consistency (video datasets) — for consecutive frames, compute IoU between corresponding object masks. If IoU drops below 0.5 for a static object between adjacent frames, the annotation has a temporal discontinuity.\n\nInter-annotator agreement: have 2 annotators independently annotate the same 50 images (a 10% overlap set). Compute per-class mean IoU between their annotations. Target: >85% IoU for large rigid objects, >75% for deformable objects, >70% for thin structures. If agreement falls below these thresholds, hold a calibration session where annotators review disagreements together and update the guidelines. Track annotator-level quality metrics and provide individual feedback — annotation quality varies 2-3x between annotators, and targeted coaching of the lowest performers yields the highest quality improvement per dollar spent.",
      tools: ["pycocotools", "NumPy", "custom QA scripts", "pandas for metrics tracking"],
      tips: ["Annotate the hardest images first (heavy occlusion, many small objects) when annotators are freshest — quality degrades over long sessions, and errors on hard images are most expensive to fix"]
    },
    {
      stepNumber: 4,
      title: "Post-Process and Export in Target Format",
      description: "After annotation, run a post-processing pipeline to clean, standardize, and export the dataset. First, clean mask boundaries: apply morphological operations (cv2.morphologyEx with a 3x3 kernel) to remove single-pixel spurs and fill single-pixel holes that arise from imprecise polygon vertices. For masks generated by SAM 2, apply a bilateral filter (cv2.bilateralFilter) on the mask probability map before thresholding to smooth boundaries while preserving sharp edges at object discontinuities.\n\nConvert all annotations to COCO format using pycocotools. For each image, create an annotation entry for each object instance with: id (unique across the dataset), image_id, category_id, segmentation (RLE-encoded mask using pycocotools.mask.encode), bbox (derived from the mask), area (pixel count), and iscrowd (0 for individual instances, 1 for crowd annotations of indistinguishable groups like a pile of bolts). Generate the categories list from your taxonomy, and the images list with file_name, width, height, and id for each image.\n\nGenerate train/validation/test splits (70/15/15 for small datasets, 80/10/10 for large). For video datasets, split at the video level (not frame level) to prevent information leakage between splits. Verify the split by computing per-class pixel frequency in each split — relative frequencies should be within 5% of the global distribution. Export additional derived formats if needed: PNG label maps for MMSegmentation (where pixel value equals class ID, stored as uint8 for up to 255 classes), and panoptic format (PNG with instance-encoded pixel values) for panoptic segmentation models. Compute and publish dataset statistics: total images, per-class instance counts, per-class pixel percentages, mean objects per image, and class co-occurrence matrix.",
      tools: ["OpenCV", "pycocotools", "NumPy", "PIL/Pillow", "JSON"],
      tips: ["Generate a visual mosaic showing 20 random images with their annotation masks overlaid — this is the single most useful artifact for quickly communicating dataset quality to stakeholders"]
    },
    {
      stepNumber: 5,
      title: "Validate with a Segmentation Model Training Baseline",
      description: "The ultimate validation for a segmentation dataset is training a model on it and evaluating per-class performance. Run a baseline training experiment using a proven architecture: Mask2Former with a Swin-L backbone pretrained on COCO for instance segmentation, or SegFormer-B4 pretrained on ADE20K for semantic segmentation. Use the MMSegmentation or Detectron2 framework to simplify configuration.\n\nTrain for 40,000 iterations with default hyperparameters (AdamW, learning rate 1e-4 with polynomial decay, batch size 4 on 2 GPUs, image size 512x512 with random crop and horizontal flip augmentation). Evaluate on the validation split using standard metrics: mean IoU (mIoU), per-class IoU, mean accuracy, and frequency-weighted IoU. For instance segmentation, also compute AP (Average Precision) at IoU thresholds 0.5, 0.75, and 0.5:0.95.\n\nAnalyze per-class IoU to identify annotation quality issues. Classes with unusually low IoU (below 40%) relative to expectations indicate either: insufficient training examples for that class (check the instance count), inconsistent annotation guidelines (high inter-annotator disagreement), or systematic labeling errors (annotators consistently misclassifying one object type as another). For the last case, generate a confusion matrix from the validation predictions and check for off-diagonal concentrations — if 'bin' and 'box' are frequently confused, your guidelines may need clearer boundary criteria. Fix the identified issues (add more examples, clarify guidelines, correct systematic errors), retrain, and verify improvement. Publish the baseline model checkpoint and evaluation metrics alongside the dataset — they serve as a reproducible reference for downstream users.",
      tools: ["MMSegmentation or Detectron2", "Mask2Former or SegFormer", "PyTorch", "wandb"],
      tips: ["If a class has low IoU but high accuracy, the model is predicting the correct class but with imprecise boundaries — this usually indicates inconsistent boundary annotations rather than missing data"]
    },
    {
      stepNumber: 6,
      title: "Document and Distribute the Dataset",
      description: "Create comprehensive documentation and publish the dataset for use by your team or the research community. Write a dataset card (following the Hugging Face dataset card template) that covers: dataset description and intended use, collection methodology and environment conditions, annotation protocol and quality metrics (inter-annotator IoU, QA pass rate), class taxonomy with visual examples, known limitations (classes with low representation, environments not covered, lighting conditions not present), license, and citation BibTeX.\n\nPackage the dataset with the following directory structure: images/{split}/ containing the raw images, annotations/{split}.json in COCO format, label_maps/{split}/ containing PNG label maps (optional), and a README.md with the dataset card. Include a Python loading script that demonstrates: loading the dataset with pycocotools, visualizing 5 annotated images, computing dataset statistics, and integrating with MMSegmentation or Detectron2 dataloaders. For distribution, upload to Hugging Face Datasets Hub for maximum discoverability (huggingface-cli upload my-org/my-segmentation-dataset ./dataset/ --repo-type dataset), or host on your cloud storage with a download script.\n\nVersion your dataset using semantic versioning (v1.0.0). Document the change log: what images were added, what annotations were corrected, and what class definitions changed between versions. Maintain backward compatibility by never deleting images or changing image IDs — add new images with new IDs and deprecate old annotations by incrementing the version. This enables reproducibility of published results that depend on specific dataset versions.",
      tools: ["Hugging Face Hub", "pycocotools", "Python", "JSON"],
      tips: ["Include the annotation guidelines document with the dataset release — downstream users need to understand the boundary rules and ambiguity resolutions to correctly extend or modify the dataset"]
    }
  ],
  keyPapers: [
    {
      id: "ravi-sam2-2024",
      title: "SAM 2: Segment Anything in Images and Videos",
      authors: "Ravi et al.",
      venue: "arXiv 2408.00714",
      year: 2024,
      url: "https://arxiv.org/abs/2408.00714"
    },
    {
      id: "cheng-mask2former-2022",
      title: "Masked-attention Mask Transformer for Universal Image Segmentation",
      authors: "Cheng et al.",
      venue: "CVPR 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2112.01527"
    },
    {
      id: "xie-segformer-2021",
      title: "SegFormer: Simple and Efficient Design for Semantic Segmentation with Transformers",
      authors: "Xie et al.",
      venue: "NeurIPS 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2105.15203"
    }
  ],
  claruRelevance: "Claru provides pixel-accurate semantic and instance segmentation annotation for robotics datasets. Our annotation teams specialize in industrial, warehouse, kitchen, and outdoor environments, using SAM 2-assisted workflows to deliver high-quality masks at scale. We handle the full pipeline from taxonomy design through annotation, quality validation, and delivery in COCO, Cityscapes, or custom formats.",
};

export default data;
