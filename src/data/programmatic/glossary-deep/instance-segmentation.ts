import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "instance-segmentation",
  termSlug: "instance-segmentation",
  category: "annotation-types",
  metaTitle: "Instance Segmentation — Definition & Training Data | Claru",
  metaDescription: "Instance segmentation assigns a pixel-level mask to each distinct object in an image. Learn annotation methods, mask quality standards, and dataset requirements for robotics.",
  primaryKeyword: "instance segmentation",
  secondaryKeywords: ["instance mask annotation", "instance-level segmentation", "per-object mask", "Mask R-CNN training data", "instance segmentation dataset"],
  canonicalPath: "/glossary/instance-segmentation",
  h1: "Instance Segmentation: Pixel-Level Object Masks for Robotic Perception",
  heroSubtitle: "Instance segmentation assigns a unique pixel-level mask to every individual object in an image, distinguishing between separate instances of the same class. It is the perceptual foundation that lets robots identify, count, and spatially reason about individual objects in cluttered scenes.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Instance Segmentation", href: "/glossary/instance-segmentation" },
  ],
  sections: [],
  faqs: [
    {
      question: "How does instance segmentation differ from semantic segmentation?",
      answer: "Semantic segmentation labels every pixel with a class (e.g., 'cup', 'table') but does not distinguish between different objects of the same class. If three cups sit on a table, semantic segmentation paints all cup pixels the same color. Instance segmentation assigns a unique mask to each individual cup, enabling the system to count objects, track them independently, and plan manipulation actions for specific targets. For robotics, this distinction is critical: a robot asked to 'pick up the red cup' must isolate that specific instance from other cups in the scene. Panoptic segmentation combines both, assigning class labels and instance IDs to every pixel including background 'stuff' classes like floor and wall."
    },
    {
      question: "What annotation tools are used for instance segmentation labeling?",
      answer: "Professional instance segmentation annotation uses a combination of interactive tools. Polygon-based tools like CVAT, Labelbox, and V7 let annotators click vertices around object boundaries, which are then filled to create masks. This is the most common method, averaging 30-90 seconds per object depending on boundary complexity. Brush and superpixel tools allow painting masks directly, useful for irregular shapes. SAM-assisted annotation uses Meta's Segment Anything Model to generate mask proposals from a single click, with the annotator correcting edges — this can reduce annotation time by 3-5x. For video instance segmentation, tools like VIA and Scalabel propagate masks across frames using optical flow, requiring manual correction only when tracking fails. The choice of tool directly impacts annotation throughput and boundary quality."
    },
    {
      question: "How much annotated data does an instance segmentation model need?",
      answer: "Data requirements depend heavily on the domain gap from pre-training data. Models fine-tuned from COCO-pretrained weights (trained on 118,000 images with 860,000 instance masks) typically need 500 to 5,000 domain-specific annotated images to achieve production-grade performance on new object categories. Training from scratch requires 10,000+ images. For robotics-specific classes not well represented in COCO — such as industrial parts, deformable objects, or transparent containers — even fine-tuning requires the upper end of that range. Few-shot instance segmentation methods like Mask2Former with prompted adaptation can work with as few as 10-50 examples per class, but with reduced boundary precision compared to fully supervised training."
    },
    {
      question: "What mask quality metrics matter for robotic manipulation?",
      answer: "The standard metric is mask AP (average precision) evaluated at multiple IoU thresholds. COCO uses AP@[0.5:0.95], averaging across IoU thresholds from 0.5 to 0.95 in steps of 0.05. For robotics, the high-IoU metrics (AP75 and above) matter more than AP50 because manipulation requires precise object boundaries — a mask that includes 10% of the adjacent table surface will cause the robot to misestimate object geometry and plan poor grasps. Boundary F1 score measures mask quality specifically along edges, which is where manipulation-critical geometry lies. In practice, robotic grasping systems require AP75 above 60% and boundary F1 above 0.7 to achieve reliable grasp planning on the segmented objects."
    },
    {
      question: "How does Claru produce instance segmentation training data for robotics?",
      answer: "Claru's annotation pipeline combines SAM-assisted pre-labeling with expert human refinement to produce high-precision instance masks at scale. Our annotators first run Segment Anything to generate initial mask proposals, then manually correct boundaries with sub-pixel precision using polygon editing tools. Each mask undergoes a two-stage review: automated checks flag masks with boundary irregularities, thin protrusions, or suspiciously low IoU against SAM's confidence map, then a second human annotator verifies and corrects flagged instances. For robotics-specific domains, we capture training images under varied lighting, clutter levels, and camera viewpoints to ensure the resulting models generalize to deployment conditions. Datasets are delivered in COCO format with per-instance mask polygons, bounding boxes, class labels, and occlusion flags."
    },
  ],
  ctaHeading: "Need Instance Segmentation Data?",
  ctaDescription: "Claru provides purpose-built datasets for physical AI and robotics. Tell us what your model needs to learn.",
  relatedGlossaryTerms: ["semantic-segmentation", "panoptic-segmentation", "sam", "object-tracking"],
  relatedGuidePages: ["how-to-create-semantic-segmentation-dataset"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  longDefinition: "Instance segmentation is the computer vision task of detecting every object in an image and producing a pixel-precise mask for each individual instance. Unlike object detection, which outputs bounding boxes, instance segmentation delineates the exact spatial extent of each object down to the pixel level. Unlike semantic segmentation, which labels pixels by class without distinguishing individuals, instance segmentation assigns a unique identity to each object — enabling counting, individual tracking, and per-object reasoning.\n\nThe task is formally defined as follows: given an input image, produce a set of (mask, class, confidence) tuples, where each mask is a binary pixel map covering exactly one object instance. Modern architectures solve this through two paradigms. Two-stage methods like Mask R-CNN (He et al., 2017) first detect objects with bounding boxes, then predict a mask within each box. Single-stage methods like SOLO (Wang et al., 2020) and mask-classification approaches like Mask2Former (Cheng et al., 2022) directly predict masks without an intermediate detection step, often achieving better speed-accuracy tradeoffs.\n\nFor robotics, instance segmentation serves as a critical perceptual primitive. A robot operating in a cluttered kitchen must segment individual dishes, utensils, and food items to plan grasps, avoid collisions, and execute task-relevant actions on specific objects. The precision of instance masks directly determines downstream manipulation success — a mask that bleeds onto the table surface causes the robot to overestimate object width, leading to failed grasps. Video instance segmentation extends the task temporally, tracking each instance's mask across frames, which is essential for robots that must maintain object identity during manipulation sequences.\n\nTraining instance segmentation models requires datasets with per-pixel mask annotations for every object instance in every image. COCO (Lin et al., 2014) established the community standard with 80 object categories and over 860,000 instance masks across 118,000 training images. Domain-specific robotics applications typically fine-tune COCO-pretrained models on smaller annotated datasets (500-5,000 images) that cover deployment-specific objects, viewpoints, and lighting conditions.",
  historicalContext: "Instance segmentation emerged as a distinct task in the mid-2010s, bridging the gap between object detection and semantic segmentation. Before deep learning, approaches like Multiscale Combinatorial Grouping (Arbelaez et al., 2014) generated object segment proposals through bottom-up region merging, but accuracy was limited.\n\nThe field was transformed by Mask R-CNN (He et al., 2017), which extended the Faster R-CNN detector with a parallel mask prediction branch. By adding a small fully convolutional network that predicts a binary mask within each detected bounding box, Mask R-CNN achieved state-of-the-art results with an elegant architecture. The paper won the Marr Prize at ICCV 2017 and established the dominant paradigm for the next several years.\n\nThe COCO benchmark (Lin et al., 2014) played a crucial role in driving progress. Its 80-category instance annotation protocol and standardized evaluation metrics (mask AP at multiple IoU thresholds) created a common playing field. Annual COCO challenges pushed the state of the art from 37.1 AP in 2017 to over 50 AP by 2022, with successive innovations in feature pyramid networks, deformable convolutions, and attention mechanisms.\n\nA paradigm shift came with mask-classification approaches. DETR (Carion et al., 2020) introduced transformer-based set prediction for object detection, and Mask2Former (Cheng et al., 2022) extended this to a unified architecture that handles instance, semantic, and panoptic segmentation with a single model. Most recently, the Segment Anything Model (SAM, Kirillov et al., 2023) demonstrated that training on 11 million images with 1.1 billion masks produces a promptable segmentation model with zero-shot generalization to novel domains — fundamentally changing how instance segmentation annotations are produced by enabling interactive, SAM-assisted labeling workflows.",
  practicalImplications: "Producing instance segmentation training data for robotics applications involves balancing annotation precision, throughput, and domain coverage. The standard annotation workflow starts with image capture across the target deployment environment under varied lighting, clutter configurations, and camera angles. For tabletop manipulation, a typical dataset requires 2,000-5,000 images with 5-20 object instances per image, yielding 10,000-100,000 individual mask annotations.\n\nAnnotation cost and time are dominated by mask boundary precision. Rough polygon annotations (10-15 vertices per object) take 20-30 seconds per instance and achieve approximately 85% IoU with ground truth. Fine polygon annotations (30-50+ vertices) take 60-120 seconds per instance but achieve 92-95% IoU. For robotics applications where mask boundary precision directly affects grasp planning, fine annotations are worth the added cost. SAM-assisted annotation reduces time by 50-70%: an annotator clicks a point on each object, SAM generates a mask proposal, and the annotator corrects only the errors.\n\nDomain-specific challenges arise frequently in robotics settings. Transparent objects (glasses, bottles) and reflective surfaces (metal tools, mirrors) defeat standard segmentation models trained on opaque objects — specialized datasets like Trans10K and ClearGrasp address this gap. Thin and articulated objects (cables, chains, scissors) require higher annotation precision than typical COCO-style polygons provide. Heavily occluded objects in clutter require amodal instance segmentation, where the model predicts the full mask including occluded regions — critical for grasp planning on partially visible objects.\n\nClaru's annotation pipeline addresses these challenges through specialized annotator training, SAM-assisted pre-labeling with human verification, and automated quality checks that flag masks with boundary irregularities. Datasets are delivered in COCO-compatible JSON format with RLE-encoded masks, enabling direct use with Detectron2, MMDetection, and other standard training frameworks.",
  commonMisconceptions: [
    {
      misconception: "Bounding box annotations are sufficient for robotic manipulation — instance segmentation is overkill.",
      correction: "Bounding boxes include significant background and adjacent-object pixels, leading to inaccurate shape estimation. For bin-picking, a bounding box around a bolt also includes the neighboring bolts, making it impossible to plan a collision-free grasp. Instance masks provide the exact object footprint, enabling precise 3D shape reconstruction, contact surface estimation, and collision-aware grasp planning. The added annotation cost (2-3x over bounding boxes) pays for itself in reduced grasp failure rates."
    },
    {
      misconception: "SAM eliminates the need for human annotation of instance segmentation data.",
      correction: "SAM provides excellent zero-shot mask proposals but still requires human guidance and correction for production-quality annotations. SAM does not assign class labels, cannot handle heavily occluded instances without prompting, and struggles with transparent, reflective, and thin objects. In practice, SAM reduces annotation time by 50-70% but does not eliminate the human annotator. The most efficient workflow uses SAM for initial mask generation and human annotators for correction, class assignment, and quality verification."
    },
    {
      misconception: "More object categories in training always improves instance segmentation performance.",
      correction: "Adding categories without sufficient per-category examples can degrade performance. A model trained on 80 categories with 1,000 instances each outperforms one trained on 200 categories with 200 instances each, because the per-category supervision is too sparse in the latter case. For robotics, it is more effective to train on 20-40 categories that match the deployment domain with deep per-category coverage (500+ instances each across varied viewpoints and lighting) than to pursue broad category coverage with thin annotation."
    },
  ],
  keyPapers: [
    {
      id: "he-maskrcnn-2017",
      title: "Mask R-CNN",
      authors: "He et al.",
      venue: "ICCV 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1703.06870",
    },
    {
      id: "cheng-mask2former-2022",
      title: "Masked-attention Mask Transformer for Universal Image Segmentation",
      authors: "Cheng et al.",
      venue: "CVPR 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2112.01527",
    },
    {
      id: "kirillov-sam-2023",
      title: "Segment Anything",
      authors: "Kirillov et al.",
      venue: "ICCV 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.02643",
    },
    {
      id: "lin-coco-2014",
      title: "Microsoft COCO: Common Objects in Context",
      authors: "Lin et al.",
      venue: "ECCV 2014",
      year: 2014,
      url: "https://arxiv.org/abs/1405.0312",
    },
    {
      id: "wang-solo-2020",
      title: "SOLO: Segmenting Objects by Locations",
      authors: "Wang et al.",
      venue: "ECCV 2020",
      year: 2020,
      url: "https://arxiv.org/abs/1912.04488",
    },
  ],
  claruRelevance: "Claru delivers production-grade instance segmentation training data for robotics teams that need precise per-object masks in deployment-specific domains. Our annotation pipeline combines SAM-assisted pre-labeling with expert human refinement: annotators generate initial masks with single-click prompts, then correct boundaries to sub-pixel precision using polygon editing tools. Two-stage quality review — automated boundary checks followed by human verification — ensures mask AP75 exceeds 90% against held-out expert annotations. Claru captures training images in real-world environments matching client deployment conditions (warehouse shelves, kitchen counters, assembly lines), covering the lighting variation, clutter density, and viewpoint diversity that determine whether a model generalizes from training to production. With 10,000+ data collectors across 100+ cities and over 1.1 million annotated objects in our catalog, Claru provides the scale and quality needed for reliable robotic perception.",
};

export default data;
