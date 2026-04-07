import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "semantic-segmentation",
  termSlug: "semantic-segmentation",
  category: "annotation-types",
  metaTitle: "Semantic Segmentation — Definition & Training Data | Claru",
  metaDescription: "Semantic segmentation assigns a class label to every pixel in an image. Learn about annotation methods, architectures like DeepLab and Mask2Former, and dataset requirements for robotics.",
  primaryKeyword: "semantic segmentation",
  secondaryKeywords: ["pixel-level labeling", "scene parsing", "semantic labeling", "dense prediction", "per-pixel classification"],
  canonicalPath: "/glossary/semantic-segmentation",
  h1: "Semantic Segmentation: Per-Pixel Classification for Scene Understanding and Robotics",
  heroSubtitle: "Semantic segmentation assigns a class label to every pixel in an image, producing a dense map of what each surface region represents. For physical AI, it is the foundational perception task that tells a robot what is where in its environment at pixel-level precision.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Semantic Segmentation", href: "/glossary/semantic-segmentation" },
  ],
  sections: [],
  faqs: [
    {
      question: "How does semantic segmentation differ from instance and panoptic segmentation?",
      answer: "Semantic segmentation assigns a class label to every pixel but does not distinguish between individual objects of the same class. If three cups sit on a table, all cup pixels receive the same cup label. Instance segmentation assigns a unique mask to each individual object (three separate cup masks) but does not label background regions like floor or wall. Panoptic segmentation unifies both: thing classes (countable objects like cups, people) get instance-level masks, while stuff classes (amorphous regions like floor, sky, wall) get semantic labels. For robotics, the choice depends on the task: navigation typically needs semantic segmentation (is this pixel traversable floor or obstacle?), manipulation needs instance segmentation (which specific object to grasp), and comprehensive scene understanding needs panoptic segmentation for both spatial planning and object-level reasoning."
    },
    {
      question: "What annotation tools and methods are used for semantic segmentation labeling?",
      answer: "Semantic segmentation annotation involves assigning a class label to every pixel in an image. The primary methods are: polygon annotation, where annotators trace object boundaries with click-based polygon tools (CVAT, Labelbox, V7) and fill the interior with a class label, typically taking 2-10 minutes per image depending on scene complexity. Brush and superpixel annotation, where annotators paint labels directly using brush tools or click on superpixel regions to fill, which is faster for amorphous classes like floor and wall. SAM-assisted annotation, where Meta's Segment Anything Model generates mask proposals from single clicks, and annotators assign class labels to each mask, reducing time by 50-70% for scenes with distinct objects. For robotics datasets, the annotation taxonomy must be carefully designed: too many classes increases annotation time and introduces inter-annotator disagreement on ambiguous boundaries, while too few classes limits the robot's ability to reason about its environment."
    },
    {
      question: "How much training data does a semantic segmentation model need?",
      answer: "Data requirements depend on the number of classes, domain complexity, and whether pretraining is used. For models pretrained on ADE20K (20,000+ images, 150 classes) or COCO (200,000+ images, 133 classes), fine-tuning on a new domain with 500-2,000 annotated images typically achieves production-grade performance for taxonomies of 20-50 classes. Training from scratch requires 5,000-20,000 annotated images. Each additional class generally requires proportionally more data, with rare classes being the bottleneck. A class appearing in only 2% of images needs 10x more total images to accumulate sufficient pixel coverage. For robotics, the critical data consideration is domain coverage rather than raw quantity: 1,000 images spanning 20 different rooms with varied lighting outperform 5,000 images from a single room, because the model must generalize to deployment-time variation."
    },
    {
      question: "What metrics evaluate semantic segmentation quality?",
      answer: "The primary metric is mean Intersection over Union (mIoU), computed by averaging per-class IoU across all classes. Per-class IoU measures the overlap between predicted and ground-truth pixels for each class, accounting for both false positives and false negatives. mIoU is the standard benchmark metric (ADE20K, Cityscapes, COCO) but can mask poor performance on rare classes behind strong performance on common classes. Frequency-weighted IoU (fwIoU) weights each class by its pixel frequency, better reflecting typical-case performance. For robotics, per-class analysis is more informative than aggregate mIoU: a model with 75% mIoU that correctly segments floor (95% IoU) but fails on small graspable objects (30% IoU) may be excellent for navigation but useless for manipulation. Boundary F1 score evaluates prediction quality specifically along class boundaries, which is where segmentation errors most affect downstream tasks like collision detection."
    },
    {
      question: "How does Claru produce semantic segmentation data for robotics?",
      answer: "Claru's semantic segmentation pipeline is optimized for the multi-environment, domain-specific requirements of robotics. Each project begins with taxonomy co-design: we work with the client's robotics team to define a class set that matches the robot's task vocabulary and deployment environment, balancing coverage against annotation consistency. Production annotation combines SAM-assisted pre-labeling (generating mask proposals from single clicks) with expert human classification and boundary refinement. Annotators assign class labels to each mask, correct boundaries at object edges, and ensure complete pixel coverage with no unlabeled pixels. Quality control includes automated mIoU checks against a gold-standard subset, per-annotator consistency monitoring, and boundary precision analysis. For video datasets, we propagate semantic labels across frames using optical flow with human correction at scene changes, achieving 3-5x throughput improvement over per-frame annotation. Datasets are delivered in standard formats (PNG label maps, COCO-Panoptic JSON) compatible with MMSegmentation, Detectron2, and other training frameworks."
    },
  ],
  ctaHeading: "Need Semantic Segmentation Data?",
  ctaDescription: "Claru provides purpose-built datasets for physical AI and robotics. Tell us what your model needs to learn.",
  relatedGlossaryTerms: ["instance-segmentation", "panoptic-segmentation", "sam", "scene-understanding"],
  relatedGuidePages: ["how-to-create-semantic-segmentation-dataset"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  longDefinition: "Semantic segmentation is the computer vision task of assigning a categorical class label to every pixel in an image, producing a dense spatial map of the scene's semantic content. Given an input image of H x W pixels, the output is a label map of the same dimensions where each pixel's value corresponds to a predefined class (e.g., 0=background, 1=floor, 2=wall, 3=table, 4=person). Unlike object detection, which localizes objects with bounding boxes, semantic segmentation provides pixel-precise delineation of every surface and region in the image.\n\nThe task is formally a per-pixel classification problem: for each pixel, the model outputs a probability distribution over C classes and assigns the class with the highest probability. The loss function is typically cross-entropy computed per pixel, averaged over all pixels in the image. Class imbalance is a pervasive challenge: floor pixels may constitute 40% of indoor images while small objects like cups constitute less than 1%, requiring weighted losses, oversampling, or specialized architectures.\n\nFor robotics, semantic segmentation provides the spatial-semantic foundation for scene understanding. A mobile robot navigating an indoor environment uses semantic segmentation to classify every visible surface: floor (traversable), walls (boundary), doors (transition), furniture (obstacle), and people (dynamic obstacle requiring safety margins). A manipulation robot uses it to identify target objects, determine available workspace, and distinguish graspable surfaces from background. The pixel-level precision is important because coarse localization (bounding boxes) does not provide the spatial detail needed for safe navigation near obstacles or precise manipulation near object boundaries.\n\nModern architectures have converged on encoder-decoder designs with transformer backbones. The encoder extracts multi-scale features from the input image, and the decoder upsamples these features to full resolution while incorporating class-specific attention. Mask2Former (Cheng et al., 2022) unified semantic, instance, and panoptic segmentation into a single architecture based on masked attention. SegFormer (Xie et al., 2021) demonstrated that a lightweight decoder on a hierarchical ViT encoder achieves strong results efficiently. For real-time robotics, models like BiSeNetV2 and DDRNet achieve 100+ FPS on edge GPUs with competitive accuracy.",
  historicalContext: "Semantic segmentation has a long history in computer vision. Early approaches used hand-crafted features with graphical models: TextonBoost (Shotton et al., 2006) combined texture, layout, and context features in a boosted classifier, and Conditional Random Fields (CRFs) imposed spatial smoothness on pixel-wise predictions.\n\nThe deep learning era began with Fully Convolutional Networks (FCN, Long et al., 2015), which adapted VGG classification networks to produce per-pixel predictions by replacing fully connected layers with convolutional layers and adding upsampling. FCN established the encoder-decoder paradigm and demonstrated end-to-end trainability for dense prediction.\n\nDeepLab (Chen et al., 2017) introduced atrous (dilated) convolutions that expand the receptive field without reducing spatial resolution, and CRF post-processing for boundary refinement. DeepLabV3+ added an encoder-decoder structure with atrous spatial pyramid pooling (ASPP), achieving strong results on PASCAL VOC and Cityscapes. PSPNet (Zhao et al., 2017) introduced pyramid pooling to capture multi-scale context.\n\nThe PASCAL VOC (2005-2012), Cityscapes (2016), and ADE20K (2017) benchmarks drove progress through standardized evaluation. ADE20K's 150-class taxonomy covering diverse indoor and outdoor scenes made it the primary benchmark for general-purpose semantic segmentation.\n\nTransformer-based architectures brought the next leap. SETR (Zheng et al., 2021) applied Vision Transformers to segmentation. SegFormer (Xie et al., 2021) designed a hierarchical ViT encoder with a lightweight MLP decoder. Mask2Former (Cheng et al., 2022) unified semantic, instance, and panoptic segmentation with a masked attention mechanism. OneFormer (Jain et al., 2023) extended this to handle all three tasks with a single model conditioned on task tokens.\n\nMost recently, SAM (Kirillov et al., 2023) demonstrated that training on 1.1 billion masks produces a class-agnostic segmentation model with zero-shot generalization. SAM does not perform semantic segmentation directly (it produces masks without class labels), but it has transformed annotation workflows by providing high-quality mask proposals that annotators then classify.",
  practicalImplications: "Building a semantic segmentation dataset for robotics involves coordinating taxonomy design, data capture, annotation, and quality assurance. The taxonomy should be designed top-down from the robot's task requirements, not bottom-up from visual scene content. A navigation robot needs functional classes (traversable, obstacle, dynamic-obstacle, goal) more than fine-grained object classes (chair, table, sofa). A manipulation robot needs object-level classes aligned with its task vocabulary. The taxonomy should have 15-50 classes for most robotics applications; larger taxonomies increase annotation cost linearly and introduce inter-annotator disagreement on ambiguous boundaries.\n\nAnnotation throughput varies with scene complexity and tool sophistication. Polygon-based annotation of a moderately complex indoor scene (10-20 distinct regions) takes 5-15 minutes per image with professional annotators. SAM-assisted workflows reduce this to 2-5 minutes: the annotator clicks on each region to generate a SAM mask proposal, assigns a class label, and corrects any boundary errors. For video datasets, temporal propagation of labels using optical flow reduces per-frame cost to 30-60 seconds for scenes without significant changes.\n\nClass imbalance is the dominant quality challenge. Small objects (cups, tools, handles) may occupy less than 1% of pixels in a typical image, causing the model to neglect them in favor of dominant classes (floor, wall). Addressing this requires: collecting images with close-up views of small objects rather than only wide establishing shots, using weighted cross-entropy or Dice loss that penalizes errors on rare classes more heavily, and evaluating per-class IoU rather than just mIoU to catch systematic failures on rare but task-critical classes.\n\nEdge deployment requires model architecture selection based on latency budgets. For real-time navigation (30+ FPS at 640x480 on NVIDIA Jetson Orin), lightweight models like BiSeNetV2 or SegFormer-B0 are appropriate, achieving 70-75% mIoU on ADE20K. For offline analysis or slower manipulation tasks (5-10 FPS acceptable), larger models like SegFormer-B5 or Mask2Former with Swin-L backbone achieve 80-85% mIoU. TensorRT optimization can double throughput with minimal accuracy loss.",
  commonMisconceptions: [
    {
      misconception: "Semantic segmentation is just image classification applied to every pixel independently.",
      correction: "While the output is a per-pixel classification, modern semantic segmentation models capture extensive spatial context through large receptive fields, attention mechanisms, and multi-scale feature aggregation. A pixel's class prediction depends not just on its local appearance but on the entire image context. Architectures like DeepLab (with atrous convolutions), PSPNet (with pyramid pooling), and Mask2Former (with cross-attention) explicitly model spatial relationships. This contextual reasoning is why modern semantic segmentation far outperforms naive per-pixel classification."
    },
    {
      misconception: "Higher mIoU on standard benchmarks always means better performance for robotics.",
      correction: "Standard benchmarks (ADE20K, Cityscapes) evaluate on internet photos or driving scenes with specific viewpoints, lighting, and class distributions very different from robotics deployment. A model achieving 85% mIoU on ADE20K may drop to 60% on egocentric robot footage because of unfamiliar viewpoints, motion blur, and non-standard object appearances. More critically, aggregate mIoU hides per-class performance: a robotics model that scores 95% on floor and wall but 30% on small graspable objects has high mIoU but is useless for manipulation. Evaluation must use in-domain test data from the target deployment environment, measured per-class."
    },
    {
      misconception: "SAM (Segment Anything) solves semantic segmentation without any training data.",
      correction: "SAM is a class-agnostic segmentation model that segments objects into masks but does not assign class labels. Given a click on a cup, SAM produces a mask covering the cup, but it does not know the mask represents a cup. To convert SAM masks into semantic segmentation, each mask must be classified, which requires either a separate classification model, a vision-language model for open-vocabulary labeling, or human annotators. SAM is best understood as a powerful annotation accelerator that reduces the segmentation step from manual polygon drawing to single-click mask generation, but the semantic classification step still requires human labels or a trained classifier."
    },
  ],
  keyPapers: [
    {
      id: "long-fcn-2015",
      title: "Fully Convolutional Networks for Semantic Segmentation",
      authors: "Long, Shelhamer, and Darrell",
      venue: "CVPR 2015",
      year: 2015,
      url: "https://arxiv.org/abs/1411.4038",
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
      id: "xie-segformer-2021",
      title: "SegFormer: Simple and Efficient Design for Semantic Segmentation with Transformers",
      authors: "Xie et al.",
      venue: "NeurIPS 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2105.15203",
    },
    {
      id: "chen-deeplabv3-2017",
      title: "Rethinking Atrous Convolution for Semantic Image Segmentation",
      authors: "Chen et al.",
      venue: "arXiv",
      year: 2017,
      url: "https://arxiv.org/abs/1706.05587",
    },
    {
      id: "kirillov-sam-2023",
      title: "Segment Anything",
      authors: "Kirillov et al.",
      venue: "ICCV 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.02643",
    },
  ],
  claruRelevance: "Claru delivers production-grade semantic segmentation training data for robotics teams that need pixel-precise scene understanding in their deployment environments. Our pipeline combines SAM-assisted mask generation with expert human classification to produce fully annotated label maps with zero unlabeled pixels. Taxonomies are co-designed with each client's robotics team to match their task vocabulary and planning requirements, from 15-class navigation taxonomies (floor, wall, door, obstacle, person) to 80+ class manipulation taxonomies covering specific object categories, surface types, and functional regions. Quality control enforces per-class IoU targets on gold-standard subsets, continuous inter-annotator agreement monitoring, and boundary precision analysis at class transitions. For video datasets, optical-flow-based label propagation with human correction achieves 3-5x throughput improvement while maintaining frame-level accuracy. With 10,000+ collectors across 100+ cities and over 1.1 million annotated objects in our catalog, Claru provides the environmental diversity and annotation precision that robot scene understanding models need to generalize from training to real-world deployment.",
};

export default data;
