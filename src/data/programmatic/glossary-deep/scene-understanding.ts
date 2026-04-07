import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "scene-understanding",
  termSlug: "scene-understanding",
  category: "computer-vision",
  metaTitle: "Scene Understanding — Definition & Training Data | Claru",
  metaDescription: "Scene understanding combines object recognition, spatial reasoning, and semantic parsing to build a holistic model of environments. Learn architectures, datasets, and robotics applications.",
  primaryKeyword: "scene understanding",
  secondaryKeywords: ["3D scene understanding", "scene parsing", "environment perception", "holistic scene analysis", "scene graph"],
  canonicalPath: "/glossary/scene-understanding",
  h1: "Scene Understanding: Holistic Environment Perception for Robotics",
  heroSubtitle: "Scene understanding is the ability to parse a visual environment into its constituent objects, surfaces, spatial relationships, and functional affordances. For robots, it is the perception layer that transforms raw sensor data into an actionable representation of what is where, what it is made of, and what can be done with it.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Scene Understanding", href: "/glossary/scene-understanding" },
  ],
  sections: [],
  faqs: [
    {
      question: "What does scene understanding include beyond object detection?",
      answer: "Object detection identifies individual objects with bounding boxes and class labels, but scene understanding goes far beyond this. It encompasses semantic segmentation (labeling every pixel with a class), instance segmentation (distinguishing individual objects), depth estimation (recovering 3D structure), surface normal estimation (understanding surface orientations), scene layout estimation (identifying room structure like floor, walls, ceiling), object affordance prediction (what actions each object supports such as a chair being sittable or a handle being graspable), scene graph generation (modeling relationships between objects like the cup is ON the table or the drawer is PART OF the cabinet), and activity context (this is a kitchen in meal preparation mode). Full scene understanding integrates all of these into a coherent spatial-semantic model that a robot can query for planning: Where are graspable objects? What surfaces are traversable? Which objects are movable versus fixed?"
    },
    {
      question: "What is a scene graph and why does it matter for robotics?",
      answer: "A scene graph is a structured representation where nodes represent objects and edges represent spatial, semantic, or functional relationships between them. A kitchen scene graph might encode: mug-ON-counter, counter-PART_OF-kitchen, mug-NEAR-toaster, mug-CONTAINS-coffee. For robotics, scene graphs are valuable because they provide a queryable, symbolic representation of the environment that bridges perception and planning. A robot asked to put the mug in the dishwasher can query the scene graph to find the mug's location (ON counter), the dishwasher's location, and the spatial path between them. Scene graph generation models like Neural Motifs (Zellers et al., 2018) and recent transformer-based approaches predict scene graphs from images, though accuracy on complex scenes remains limited. Training these models requires images annotated with object bounding boxes, class labels, and pairwise relationship labels, which is a labor-intensive annotation task."
    },
    {
      question: "What training data is needed for scene understanding models?",
      answer: "Scene understanding requires multi-task annotated datasets that combine several label types per image. ScanNet (Dai et al., 2017) provides 1,513 indoor scenes with 3D meshes, semantic labels, instance labels, and camera poses, serving as the standard benchmark for 3D scene understanding. ADE20K (Zhou et al., 2017) provides 20,000+ images with per-pixel semantic labels across 150 categories, emphasizing scene-level diversity. COCO-Panoptic combines instance and stuff segmentation across 200,000 images. For scene graphs, Visual Genome (Krishna et al., 2017) provides 108,000 images with 2.3 million relationships between 3.8 million object instances. For robotics-specific scene understanding, the data gap is functional and interactive annotations: existing datasets label what objects are but rarely label what they afford (graspable, openable, fillable) or how they relate to task execution. Custom datasets capturing robot deployment environments with both semantic and functional annotations are typically necessary."
    },
    {
      question: "How do 3D and 2D scene understanding differ for robotics?",
      answer: "2D scene understanding operates on individual images, producing per-pixel labels, bounding boxes, and 2D relationship graphs. It is fast, works with standard cameras, and leverages massive pretrained models. However, it loses 3D spatial information and cannot tell you that the table is 1.2 meters tall or that there is a clear path between the robot and the shelf. 3D scene understanding operates on point clouds, depth maps, or multi-view reconstructions, producing volumetric occupancy maps, 3D bounding boxes, and metric spatial relationships. It preserves the geometric information robots need for navigation and manipulation but requires depth sensors or multi-view capture and is more computationally expensive. Modern approaches increasingly fuse 2D and 3D: running a powerful 2D model (SAM, Mask2Former) on images and projecting results into 3D using depth, or using 3D representations like NeRFs and 3D Gaussians with 2D feature distillation (LERF, LangSplat) to create queryable 3D scene representations."
    },
    {
      question: "How does Claru provide scene understanding training data?",
      answer: "Claru captures multi-modal scene data optimized for holistic environment perception. Our datasets include synchronized RGB images, depth maps, and camera intrinsics captured across diverse indoor environments including kitchens, warehouses, offices, retail spaces, and homes. Annotations span multiple scene understanding tasks per image: semantic segmentation (per-pixel class labels for 50-150 categories depending on the domain), instance segmentation (individual object masks), object identity (consistent IDs across viewpoints), spatial relationship labels (on, in, next-to, part-of), and activity context (what task is happening in the scene). For 3D scene understanding, we provide multi-view capture sets that enable 3D reconstruction with per-point semantic labels. Our annotation pipeline leverages SAM for mask pre-labeling, Depth Anything V2 for depth pseudo-labels, and expert human annotators for semantic classification, relationship labeling, and quality verification."
    },
  ],
  ctaHeading: "Need Scene Understanding Data?",
  ctaDescription: "Claru provides purpose-built datasets for physical AI and robotics. Tell us what your model needs to learn.",
  relatedGlossaryTerms: ["semantic-segmentation", "panoptic-segmentation", "point-cloud", "depth-data"],
  relatedGuidePages: ["how-to-create-semantic-segmentation-dataset"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  longDefinition: "Scene understanding is the comprehensive perception of a visual environment, integrating object recognition, spatial reasoning, surface analysis, and functional interpretation into a unified representation that supports decision-making and action planning. Unlike individual vision tasks that extract specific attributes (object detection finds objects, depth estimation recovers geometry, segmentation classifies pixels), scene understanding synthesizes these outputs into a holistic model of what is in the environment, where everything is, how things relate to each other, and what actions are possible.\n\nThe canonical output of a scene understanding system is a scene representation that can be queried by a planning module. This might take the form of a semantic map (a 2D or 3D grid where each cell stores occupancy, class label, and traversability), a scene graph (a structured graph of objects and relationships), or an implicit neural representation (a learned 3D field that can be queried for semantics at any point). Each representation trades off between completeness, query speed, and the annotation effort needed to train the underlying models.\n\nFor robotics, scene understanding serves as the interface between raw perception and task planning. A mobile robot navigating a warehouse needs to understand which areas are traversable (floor), which are obstacles (shelves, pallets, people), and which are goal-relevant (the target shelf, the loading dock). A manipulation robot needs to understand object identities (which item to pick), spatial relationships (the target item is behind another item), surface properties (the object is fragile, the surface is slippery), and functional affordances (this handle can be grasped, this lid can be twisted). The quality of scene understanding directly determines the complexity of tasks a robot can perform.\n\nModern approaches increasingly leverage foundation models for scene understanding. Open-vocabulary detectors (Grounding DINO, OWL-ViT) identify objects from text descriptions without training on specific categories. Vision-language models (GPT-4V, LLaVA) answer natural language questions about scenes. 3D-aware models (LERF, LangSplat) embed language features into 3D representations, enabling queries like 'find the red mug on the second shelf' in a 3D point cloud. These advances reduce the need for exhaustive category-specific training data but still require domain-specific evaluation and adaptation for reliable robot deployment.",
  historicalContext: "Scene understanding has been a goal of computer vision since the field's inception. The early blocks world research of the 1960s and 1970s (Roberts, 1963; Waltz, 1975) attempted to parse simple geometric scenes into objects and spatial relationships. The Marr paradigm (1982) proposed a hierarchical visual processing pipeline from primal sketch to 2.5D sketch to 3D model, establishing the theoretical framework for progressive scene analysis.\n\nThe semantic segmentation revolution began with Fully Convolutional Networks (Long et al., 2015), which adapted classification networks to produce per-pixel labels. DeepLab (Chen et al., 2017) introduced atrous convolutions and CRF post-processing for refined boundaries. PSPNet (Zhao et al., 2017) added pyramid pooling for multi-scale context. These architectures established semantic segmentation as a tractable large-scale task, enabled by datasets like PASCAL VOC, Cityscapes, and ADE20K.\n\nPanoptic segmentation (Kirillov et al., 2019) unified instance and semantic segmentation into a single task that labels every pixel with both a class and an instance ID. Mask2Former (Cheng et al., 2022) achieved state-of-the-art panoptic segmentation with a universal architecture. For 3D, ScanNet (Dai et al., 2017) and SUN RGB-D (Song et al., 2015) established benchmarks for indoor scene understanding with 3D annotations.\n\nScene graph generation emerged as a structured alternative to flat segmentation. Visual Genome (Krishna et al., 2017) provided the training data. Neural Motifs (Zellers et al., 2018) and subsequent work showed that language priors significantly improve relationship prediction. The foundation model era has transformed the landscape: SAM provides zero-shot segmentation, Grounding DINO enables open-vocabulary detection, and LangSplat and LERF embed language features into 3D Gaussian Splat and NeRF representations. These tools make scene understanding more accessible but shift the challenge from model training to representation design and domain adaptation.",
  practicalImplications: "Building a scene understanding pipeline for robotics requires selecting representations, models, and training data that match the robot's task requirements. For mobile navigation, a 2D semantic map (occupancy grid with per-cell class labels) is often sufficient. The map can be built from semantic segmentation (Mask2Former on RGB) projected using depth estimates, then accumulated over multiple viewpoints. Training data needs: 5,000-20,000 images from the deployment environment annotated with 10-30 semantic classes (floor, wall, door, obstacle, person) plus depth from sensors or MDE models.\n\nFor manipulation, richer scene representations are needed. At minimum, the robot needs instance-level segmentation (to identify individual graspable objects), depth (to localize them in 3D), and some form of affordance or grasp quality prediction. Scene graphs add relationship reasoning (the target object is behind another object, requiring a move-aside action). Training data needs: 2,000-10,000 images with instance masks, depth, object class labels, and optionally relationship annotations and affordance labels.\n\nThe annotation cost of scene understanding data scales with representational richness. Per-pixel semantic segmentation takes 1-3 minutes per image. Adding instance segmentation adds 30-60 seconds per object. Scene graph relationship labeling adds 5-10 seconds per object pair. Affordance labels add 10-20 seconds per object. For a dataset of 5,000 images with 10 objects each, full multi-task annotation might take 500-1,000 annotator-hours. SAM-assisted pre-labeling reduces segmentation time by 50-70%, and model-assisted pre-labeling for relationships and affordances is an active research area.\n\nEvaluation should test the full perception-to-planning chain, not just individual task metrics. A scene understanding system with 90% segmentation mIoU but frequent confusion between open door and closed door will cause navigation failures that the aggregate metric does not capture. Task-specific evaluation, measuring manipulation success rate or navigation completion rate when using the scene understanding system, provides the ground truth for whether the perception is good enough.",
  commonMisconceptions: [
    {
      misconception: "Scene understanding is just running multiple vision models in parallel on the same image.",
      correction: "Running separate detectors, segmenters, and depth estimators independently produces inconsistent results: the detector might find an object that the segmenter misses, or depth estimates might not align with segmentation boundaries. True scene understanding requires integration ensuring that object identities are consistent across tasks, that 3D geometry aligns with 2D segmentation, and that relationships are grounded in verified spatial positions. Modern unified architectures (Mask2Former for panoptic, OneFormer for multi-task) address this by sharing representations across tasks, but system-level consistency checking remains necessary for robotics reliability."
    },
    {
      misconception: "Pretrained foundation models like SAM and GPT-4V provide sufficient scene understanding for robotics out of the box.",
      correction: "Foundation models provide powerful building blocks but not complete scene understanding. SAM segments objects but does not classify them. GPT-4V describes scenes in natural language but cannot produce metric spatial information (exact object positions and dimensions) needed for manipulation. Neither model produces the structured, queryable representations (semantic maps, scene graphs, affordance maps) that robot planners consume. Production robotics systems use foundation models as feature extractors and initialization tools, with domain-specific heads and post-processing to produce the structured outputs the robot stack requires."
    },
    {
      misconception: "More semantic classes in the annotation taxonomy always improve scene understanding utility.",
      correction: "Taxonomies with hundreds of fine-grained classes provide comprehensive coverage but introduce annotation noise on ambiguous boundaries (is this a counter or a table?) and require more training data per class. For robotics, a smaller taxonomy of 20-50 classes aligned with the robot's task vocabulary is more practical and often more accurate. The taxonomy should distinguish between functionally different surfaces (graspable objects vs. background) rather than pursuing maximal visual taxonomy coverage. A warehouse robot needs to distinguish between product, shelf, floor, person, and robot rather than between 200 product subcategories."
    },
  ],
  keyPapers: [
    {
      id: "dai-scannet-2017",
      title: "ScanNet: Richly-annotated 3D Reconstructions of Indoor Scenes",
      authors: "Dai et al.",
      venue: "CVPR 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1702.04405",
    },
    {
      id: "krishna-visualgenome-2017",
      title: "Visual Genome: Connecting Language and Vision Using Crowdsourced Dense Image Annotations",
      authors: "Krishna et al.",
      venue: "IJCV",
      year: 2017,
      url: "https://arxiv.org/abs/1602.07332",
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
      id: "zhou-ade20k-2017",
      title: "Scene Parsing through ADE20K Dataset",
      authors: "Zhou et al.",
      venue: "CVPR 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1608.05442",
    },
    {
      id: "kirillov-panoptic-2019",
      title: "Panoptic Segmentation",
      authors: "Kirillov et al.",
      venue: "CVPR 2019",
      year: 2019,
      url: "https://arxiv.org/abs/1801.00868",
    },
  ],
  claruRelevance: "Claru delivers multi-task annotated scene data purpose-built for robotic scene understanding. Our datasets pair synchronized RGB and depth streams with layered annotations: per-pixel semantic segmentation across domain-appropriate taxonomies (20-150 classes), instance segmentation with persistent object IDs across viewpoints, spatial relationship labels between objects, and scene-level metadata (room type, activity context, lighting conditions). For 3D scene understanding, we provide multi-view capture sets with camera poses enabling 3D reconstruction with per-point semantic labels. With 10,000+ collectors across 100+ cities capturing scenes in kitchens, warehouses, retail spaces, offices, and homes, Claru provides the environmental diversity needed for scene understanding models to generalize beyond controlled lab environments to real-world robot deployment.",
};

export default data;
