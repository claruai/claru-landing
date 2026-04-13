import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "sam",
  termSlug: "sam",
  category: "models-architectures",
  metaTitle: "Segment Anything Model (SAM) — Definition & Training Data | Claru",
  metaDescription: "SAM (Segment Anything Model) is Meta AI's foundation model for promptable image segmentation. Learn how SAM transforms robotics perception and what data powers it.",
  primaryKeyword: "SAM model",
  secondaryKeywords: ["segment anything", "SAM segmentation", "foundation segmentation model", "promptable segmentation", "SAM 2"],
  canonicalPath: "/glossary/sam",
  h1: "Segment Anything Model (SAM): Definition, Applications, and Training Data Requirements",
  heroSubtitle: "The Segment Anything Model (SAM) is a foundation model for image segmentation developed by Meta AI. Given an input image and a prompt — a point, bounding box, or text description — SAM produces a high-quality segmentation mask for the indicated object or region. Trained on the SA-1B dataset of 1.1 billion masks across 11 million images, SAM demonstrates zero-shot segmentation capabilities that make it a powerful perception component in robotics and physical AI systems.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Segment Anything Model (SAM)", href: "/glossary/sam" },
  ],
  sections: [],
  faqs: [
    {
      question: "How does SAM's promptable segmentation work?",
      answer: "SAM uses a three-component architecture. First, a heavyweight image encoder (ViT-H) processes the input image once, producing dense feature embeddings. Second, a lightweight prompt encoder converts the user's input — a point click, a bounding box, a coarse mask, or a text query — into embedding vectors. Third, a lightweight mask decoder combines the image and prompt embeddings to predict one or more segmentation masks with associated confidence scores. The key design insight is that the expensive image encoding runs once, and the cheap prompt encoding and mask decoding can run many times with different prompts at interactive speed (50ms per prompt on GPU). This architecture enables real-time interactive segmentation where a robotics system can rapidly query different objects in a scene by providing different point or box prompts to the same encoded image."
    },
    {
      question: "What is the SA-1B dataset and why was it important for SAM?",
      answer: "SA-1B is the dataset used to train SAM, containing over 1.1 billion segmentation masks across 11 million licensed, privacy-respecting images. It was created through a data engine that iteratively improved both the model and the annotations: human annotators used an early version of SAM to assist their labeling, the improved annotations trained a better model, and the cycle repeated. This model-in-the-loop annotation process produced masks at a scale orders of magnitude beyond previous segmentation datasets — COCO has 2.5 million masks, SA-1B has 400 times more. The dataset's scale and diversity are what enable SAM's zero-shot generalization: the model has seen enough variety to segment objects it was never explicitly trained on. For robotics applications, SA-1B's coverage of everyday objects, environments, and viewpoints provides the visual grounding that enables SAM to work out-of-the-box in robot workspace settings."
    },
    {
      question: "How is SAM used in robotics perception pipelines?",
      answer: "SAM serves multiple roles in robotics perception. For object segmentation, SAM produces pixel-precise masks of target objects given point or box prompts from an upstream detector, providing the precise boundaries needed for grasp planning. For scene decomposition, SAM's 'segment everything' mode generates masks for all visible objects, which can be filtered and classified by a separate recognition model. For interactive manipulation, SAM enables a pipeline where a language instruction ('pick up the red cup') is grounded to a bounding box by a vision-language model, then refined to a precise mask by SAM. SAM 2 extends this to video, maintaining consistent object tracking across frames — critical for manipulation tasks where the robot needs to track the target object throughout an action sequence. The model's speed (20-50ms per prompt) makes it practical for real-time robotics applications on GPU-equipped platforms."
    },
    {
      question: "What are the limitations of SAM for robotics applications?",
      answer: "SAM has several limitations relevant to robotics deployment. It segments visual boundaries but does not understand physical properties — it cannot distinguish between a rigid cup and a deformable bag based on the mask alone. Segmentation quality degrades on transparent objects (glass, clear plastic), highly reflective surfaces, and thin structures (wires, strings) that are common in manipulation scenarios. SAM produces class-agnostic masks: it can separate an object from its background but does not identify what the object is, requiring a separate classification step. Performance on egocentric, close-range views typical of wrist-mounted robot cameras is weaker than on the internet-style photos that dominate SA-1B training data. For domain-specific applications, fine-tuning SAM on robot-perspective images with task-relevant objects typically improves mask quality by 5-15% IoU on the target domain."
    },
    {
      question: "How does Claru's data complement SAM for physical AI applications?",
      answer: "Claru provides the domain-specific image and video data needed to fine-tune and evaluate SAM for robotics environments that differ from SA-1B's internet-photo distribution. Our catalog includes egocentric manipulation views, close-range tabletop scenes, industrial workspace imagery, and outdoor environments captured across 100+ cities — the specific viewpoints and conditions where out-of-the-box SAM performance degrades. Our annotation pipeline produces pixel-precise segmentation masks with object identity labels, enabling both SAM fine-tuning (improving mask quality on domain-specific objects) and SAM evaluation (measuring real-world performance on the target distribution). For teams using SAM as a component in larger perception systems, Claru provides the annotated data to validate that SAM's zero-shot capabilities meet the precision requirements of their specific manipulation, navigation, or interaction tasks."
    }
  ],
  ctaHeading: "Need Segmentation Data for Physical AI?",
  ctaDescription: "Claru provides pixel-precise segmentation annotations from diverse real-world environments. Fine-tune and evaluate SAM for your specific robotics domain.",
  relatedGlossaryTerms: ["semantic-segmentation", "instance-segmentation", "panoptic-segmentation", "object-tracking"],
  relatedGuidePages: ["how-to-create-semantic-segmentation-dataset"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  longDefinition: "The Segment Anything Model (SAM) is a foundation model for image segmentation released by Meta AI in April 2023. It was designed to be a general-purpose, promptable segmentation system: given an image and a prompt indicating what to segment (a point click, a bounding box, a coarse mask, or a text description), SAM produces a detailed segmentation mask delineating the indicated object or region at pixel precision. The model was trained on SA-1B, a dataset of 1.1 billion masks spanning 11 million images, making it the largest segmentation dataset and model at the time of release.\n\nSAM's architecture separates the expensive image encoding step from the cheap prompt processing and mask generation steps. The image encoder — a Vision Transformer (ViT-H with 632 million parameters) — processes the full image once to produce dense feature embeddings. The prompt encoder maps different prompt types (points, boxes, masks, text) to a common embedding space. The mask decoder — a lightweight transformer with only 4 million parameters — combines image and prompt embeddings to predict segmentation masks. This asymmetric design means that once an image is encoded (~150ms on GPU), any number of prompts can be processed in real time (~50ms each), enabling interactive and iterative segmentation workflows that are impractical with traditional per-query segmentation models.\n\nFor physical AI and robotics, SAM addresses a fundamental perception challenge: producing accurate object boundaries for downstream reasoning. Grasp planning requires knowing exactly where an object ends and the supporting surface begins. Navigation requires precise obstacle boundaries for collision avoidance. Manipulation planning needs object masks to estimate shape, pose, and grasp affordances. Before SAM, obtaining these masks required either training task-specific segmentation models (expensive, narrow) or using generic models that underperformed on novel objects. SAM's zero-shot capability — segmenting objects it has never been explicitly trained on — provides a general-purpose solution that works across the diverse objects and environments that robots encounter.\n\nSAM 2 (Ravi et al., 2024) extended the model to video segmentation, adding temporal consistency through a memory attention mechanism that tracks objects across frames. For robotics, this is critical: during a manipulation task, the robot needs to maintain consistent segmentation of the target object as it moves, deforms, or becomes partially occluded. SAM 2 achieves this with a streaming architecture that processes video frames sequentially, propagating object identities through a memory bank of previous frame embeddings. On the SA-V video dataset (50,900 videos with 642,600 masklets), SAM 2 demonstrated state-of-the-art video object segmentation while maintaining real-time performance.",
  historicalContext: "Image segmentation has been a core computer vision problem since the field's inception, evolving through distinct methodological eras. Early approaches in the 1970s-1990s used edge detection, region growing, and graph-based methods to partition images into coherent regions. These methods made no assumptions about object categories and produced unsupervised segmentations based on low-level image properties — color similarity, texture boundaries, contour continuity.\n\nSemantic segmentation emerged as a supervised learning task with Fully Convolutional Networks (Long et al., 2015), which adapted classification CNNs to produce dense per-pixel class predictions. DeepLab (Chen et al., 2017), PSPNet (Zhao et al., 2017), and UNet (Ronneberger et al., 2015) refined the approach, achieving strong performance on benchmarks like PASCAL VOC, Cityscapes, and ADE20K. However, these models required training on dataset-specific class taxonomies and could not segment objects outside their training vocabulary.\n\nInstance segmentation — detecting and segmenting individual objects — was formalized by Mask R-CNN (He et al., 2017), which extended the Faster R-CNN object detector with a mask prediction branch. YOLACT and SOLOv2 provided faster alternatives. These models combined detection and segmentation but remained vocabulary-bound: they could only segment categories seen during training.\n\nThe path to SAM was paved by several developments. CLIP (Radford et al., 2021) demonstrated that vision-language pretraining enabled zero-shot visual recognition. GroupViT and CLIPSeg showed that similar approaches could produce open-vocabulary segmentation. The Segment Anything project extended this further by asking: can a model be trained to segment any object, not just objects from a fixed vocabulary, given a spatial prompt? The answer required not just a new model architecture but a new scale of training data — hence the SA-1B dataset and its model-in-the-loop annotation engine. SAM's release in April 2023 was followed by rapid community adoption, with SAM being integrated into annotation tools (Label Studio, Roboflow, CVAT), robotics perception stacks, and medical imaging pipelines within months.",
  practicalImplications: "Integrating SAM into a robotics perception pipeline requires decisions about prompt generation, mask selection, and computational budgeting. The choice of prompt type determines segmentation quality and automation level. Point prompts (a single click on the object of interest) are fast to generate programmatically (from detector outputs or user input) but can be ambiguous — a point on a cup might segment just the handle, the cup body, or the entire cup with its contents. Box prompts from an upstream object detector produce more reliable segmentation by constraining the spatial extent. For fully automated pipelines, a common pattern is: run an object detector (DINO, Grounding DINO, or YOLO) to get bounding boxes, then refine each box to a precise mask with SAM.\n\nSAM often produces multiple candidate masks per prompt at different granularity levels (part, object, group). The mask decoder outputs three masks with confidence scores — typically corresponding to sub-part, whole-object, and super-object segmentations. Selecting the right granularity level requires task-specific logic: grasp planning needs the whole-object mask, while dexterous manipulation might need the part-level mask (the cup handle specifically).\n\nComputational cost on robot hardware is a practical concern. The ViT-H image encoder requires ~150ms on an NVIDIA Jetson Orin, which limits the frame rate to ~7 FPS if run on every frame. Strategies to improve throughput include: using the smaller ViT-B variant (3x faster, modest accuracy loss), encoding only keyframes and propagating masks using SAM 2's memory mechanism, or running the encoder asynchronously while the control loop uses the most recent mask. For tabletop manipulation at 1-5 Hz control rates, the standard ViT-H runs comfortably; for mobile navigation at 10+ Hz, the smaller variants or sparse encoding strategies become necessary.\n\nClaru supports SAM-based robotics perception by providing domain-specific data for fine-tuning and evaluation. Our annotated images from robot workspace environments — captured with the same cameras, viewpoints, and lighting that the deployed system will encounter — enable teams to measure and improve SAM's performance on their specific target domain. Annotations include pixel-precise masks in COCO format, object identity labels, and per-mask quality scores, compatible with SAM fine-tuning and standard evaluation pipelines.",
  commonMisconceptions: [
    {
      misconception: "SAM understands what objects are — it provides semantic segmentation.",
      correction: "SAM produces class-agnostic masks: it can precisely delineate object boundaries but does not identify what the object is. A SAM mask tells you where the object is, not whether it is a cup, a tool, or a hand. For robotics applications that need both precise boundaries and object identity, SAM must be combined with a classification or detection model. Common architectures pair Grounding DINO (open-vocabulary detection) with SAM (mask refinement), or use CLIP to classify SAM-generated masks. This composable design is a strength — SAM handles spatial precision while separate models handle semantic understanding."
    },
    {
      misconception: "SAM works equally well on all types of images, including robot camera footage.",
      correction: "SAM was trained primarily on internet-style photographs — third-person views of scenes and objects captured by consumer cameras. Performance degrades on image types underrepresented in SA-1B: egocentric views from head-mounted or wrist-mounted cameras, extreme close-up manipulation views, low-light and high-contrast industrial environments, and images with extensive motion blur. Transparent objects (glass, clear containers) and highly reflective surfaces (polished metal) are particularly challenging because the visual boundaries SAM relies on are weak or misleading for these materials. Fine-tuning on domain-representative data improves performance by 5-15% IoU on the target distribution."
    },
    {
      misconception: "SAM replaces the need for custom segmentation datasets — just use it zero-shot.",
      correction: "SAM's zero-shot capability provides a strong baseline, but production robotics systems typically need higher precision than zero-shot performance delivers. A 2-3 pixel error at mask boundaries, acceptable for general-purpose segmentation, can cause grasp failures when the robot's gripper closes on empty space or collides with an object edge. Fine-tuning SAM on 500-2000 annotated images from the target domain — specific robot camera, specific workspace, specific object categories — typically closes the gap between good zero-shot performance and reliable deployment-grade precision. The fine-tuning investment is far less than training a model from scratch, making it a cost-effective path to production quality."
    }
  ],
  keyPapers: [
    {
      id: "kirillov-sam-2023",
      title: "Segment Anything",
      authors: "Kirillov et al.",
      venue: "ICCV 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.02643"
    },
    {
      id: "ravi-sam2-2024",
      title: "SAM 2: Segment Anything in Images and Videos",
      authors: "Ravi et al.",
      venue: "arXiv 2408.00714",
      year: 2024,
      url: "https://arxiv.org/abs/2408.00714"
    },
    {
      id: "liu-grounding-dino-2023",
      title: "Grounding DINO: Marrying DINO with Grounded Pre-Training for Open-Set Object Detection",
      authors: "Liu et al.",
      venue: "ECCV 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2303.05499"
    },
    {
      id: "he-maskrcnn-2017",
      title: "Mask R-CNN",
      authors: "He et al.",
      venue: "ICCV 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1703.06870"
    },
    {
      id: "cheng-mask2former-2022",
      title: "Masked-attention Mask Transformer for Universal Image Segmentation",
      authors: "Cheng et al.",
      venue: "CVPR 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2112.01527"
    }
  ],
  claruRelevance: "Claru provides the domain-specific annotation data that bridges SAM's general zero-shot capabilities with the precision requirements of production robotics. Our 10,000+ annotators produce pixel-precise segmentation masks across diverse real-world environments — kitchens, workshops, retail spaces, outdoor settings — using the same cameras and viewpoints that robot perception systems encounter in deployment. For teams fine-tuning SAM on their target domain, Claru delivers COCO-format mask annotations with object identity labels, covering the specific object categories, surface materials, and lighting conditions where zero-shot performance falls short. For teams evaluating SAM within larger perception pipelines, our annotated test sets provide ground truth for measuring mask IoU, boundary precision, and downstream task impact. With 3M+ annotated clips spanning 100+ cities, Claru enables robotics teams to maximize SAM's potential by closing the gap between internet-photo pretraining and real-world deployment conditions.",
};

export default data;
