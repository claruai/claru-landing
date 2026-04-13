import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "keypoint-annotation",
  termSlug: "keypoint-annotation",
  category: "annotation-types",
  metaTitle: "Keypoint Annotation — Definition & Training Data | Claru",
  metaDescription: "Keypoint annotation marks specific landmark points on objects, bodies, or hands in images and video. Learn annotation standards, tools, and dataset requirements for robotics.",
  primaryKeyword: "keypoint annotation",
  secondaryKeywords: ["keypoint labeling", "landmark annotation", "skeleton annotation", "pose keypoint data", "joint annotation"],
  canonicalPath: "/glossary/keypoint-annotation",
  h1: "Keypoint Annotation: Landmark Labeling for Pose Estimation and Robot Learning",
  heroSubtitle: "Keypoint annotation marks semantically meaningful landmark points — joint centers, fingertips, object corners — on images or video frames. These sparse but precise spatial annotations are the training signal for pose estimation models that give robots spatial awareness of bodies, hands, and objects.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Keypoint Annotation", href: "/glossary/keypoint-annotation" },
  ],
  sections: [],
  faqs: [
    {
      question: "What types of keypoints are annotated for robotics applications?",
      answer: "Robotics keypoint annotation spans three primary domains. Body keypoints follow the COCO 17-joint skeleton (nose, eyes, ears, shoulders, elbows, wrists, hips, knees, ankles) or the more detailed HALPE 136-joint format that adds hand and foot joints. Hand keypoints use the 21-joint MediaPipe hand model (4 joints per finger plus wrist) or the MANO 778-vertex hand mesh, critical for dexterous manipulation and hand-object interaction research. Object keypoints mark semantically meaningful points on rigid objects — corner points, handle endpoints, axis centers — enabling 6-DOF pose estimation from 2D images. For articulated objects like tools or drawers, keypoints mark joint locations and articulation axes. Each domain requires annotators with specific training: body pose annotators need anatomy knowledge, hand annotators need expertise in occluded joint inference, and object annotators need understanding of 3D geometry projected into 2D views."
    },
    {
      question: "How accurate do keypoint annotations need to be for robot learning?",
      answer: "Accuracy requirements vary by downstream task. For body pose estimation used in human-robot collaboration (predicting where a person will move), 5-10 pixel error is acceptable because the robot needs approximate spatial awareness, not sub-pixel precision. For hand pose estimation driving dexterous manipulation, 2-5 pixel error is the target — at typical image resolutions (640x480), this translates to roughly 3-8mm spatial error, which can mean the difference between a successful and failed fingertip grasp. For object pose estimation used in pick-and-place, keypoint error must be below 3 pixels to achieve the 1-2cm pose accuracy needed for reliable grasping. Professional annotation pipelines achieve these targets through zoom-assisted labeling (annotators zoom to 400-800% on the keypoint region), cross-hair cursor tools, and multi-annotator averaging where the final keypoint position is the mean of 2-3 independent annotations."
    },
    {
      question: "How long does keypoint annotation take per image?",
      answer: "Annotation time depends on the number of keypoints, visibility complexity, and tool sophistication. For COCO-format body pose (17 keypoints per person), experienced annotators average 30-60 seconds per person instance, with occluded joints taking longer due to inference requirements. Hand keypoints (21 joints) take 45-90 seconds per hand because finger joints are frequently self-occluded and require careful placement. Object keypoints vary widely: 4-8 corner keypoints on a box take 15-30 seconds, while 20+ keypoints on a complex tool take 2-3 minutes. Video keypoint annotation can be accelerated 3-5x using tracking-assisted tools that propagate keypoints across frames using optical flow, with the annotator correcting only frames where tracking fails. At Claru, SAM-assisted tools and custom interpolation reduce per-frame annotation time to 5-15 seconds for video sequences after the initial keyframe is annotated."
    },
    {
      question: "What is the difference between keypoint annotation and pose estimation?",
      answer: "Keypoint annotation is the human labeling process that produces ground truth data; pose estimation is the model that learns to predict keypoints automatically from that data. Annotators manually place keypoint markers on images, producing (x, y, visibility) tuples for each landmark. These annotations become the training labels for pose estimation models like HRNet, ViTPose, or MediaPipe. The relationship is circular: better annotations train better models, and better models (used as pre-labeling assistants) help annotators work faster and more accurately. In production pipelines, model-assisted annotation combines both: a pre-trained pose estimator generates initial keypoint predictions, and human annotators correct errors, particularly on occluded or ambiguous joints where models are weakest."
    },
    {
      question: "How does Claru handle keypoint annotation for physical AI datasets?",
      answer: "Claru's keypoint annotation pipeline is optimized for the three domains most relevant to physical AI: body pose, hand pose, and object landmarks. For body and hand keypoints, annotators use model-assisted pre-labeling (ViTPose for bodies, MediaPipe for hands) followed by human correction, achieving 2-3x throughput improvement over manual annotation while maintaining sub-5-pixel accuracy. For object keypoints, Claru defines custom keypoint schemas per object category in collaboration with each client, ensuring the annotated landmarks correspond to the geometric features relevant to their manipulation task. All keypoint annotations include visibility flags (visible, occluded-but-inferable, not-present) essential for training models that handle real-world occlusion. Quality is enforced through anatomical plausibility checks (bone length ratios, joint angle limits), multi-annotator agreement (mean distance between independent annotations below 3 pixels), and automated outlier detection."
    },
  ],
  ctaHeading: "Need Keypoint Annotation Data?",
  ctaDescription: "Claru provides purpose-built datasets for physical AI and robotics. Tell us what your model needs to learn.",
  relatedGlossaryTerms: ["pose-estimation", "hand-object-interaction", "vitpose", "temporal-annotation"],
  relatedGuidePages: ["how-to-annotate-hand-object-interactions"],
  relatedSolutionSlugs: ["manipulation-trajectory-data"],
  longDefinition: "Keypoint annotation is the process of marking specific, semantically defined landmark points on objects, human bodies, or hands in images and video frames. Each keypoint is a 2D coordinate (x, y) paired with a visibility flag indicating whether the point is visible, occluded but inferrable from context, or absent from the frame. A set of keypoints connected by predefined edges forms a skeleton — a sparse but structured representation of an entity's spatial configuration.\n\nThe COCO keypoint format, which defines 17 body landmarks (nose, left/right eye, ear, shoulder, elbow, wrist, hip, knee, ankle), has become the de facto standard for human pose datasets. Extensions like HALPE (136 keypoints including hand and foot joints) and Whole-Body COCO (133 keypoints) provide finer granularity for applications that require hand and facial landmark detail. For hands specifically, the 21-joint model (wrist plus 4 joints per finger) used by MediaPipe and FreiHAND has become standard.\n\nIn robotics, keypoint annotations serve multiple functions beyond pose estimation. Object keypoints enable category-level 6-DOF pose estimation, where a model predicts the 3D position and orientation of any object within a category from a single RGB image — KeypointDeformer (Jakab et al., 2021) and NOCS (Wang et al., 2019) pioneered this approach. Keypoints also define grasp affordances: specific points on an object that indicate where and how to grasp it. For articulated objects like doors or drawers, keypoints mark joint axes and handle locations that determine the manipulation strategy.\n\nThe quality of keypoint annotations is measured by mean per-joint position error (MPJPE) against expert ground truth, typically reported in pixels for 2D annotations or millimeters for 3D. State-of-the-art pose estimation models achieve MPJPE of 3-5 pixels on standard benchmarks, which sets the target accuracy for training annotations — annotations less accurate than the model's target performance provide contradictory training signal.",
  historicalContext: "Keypoint annotation emerged from the computer vision community's need for structured spatial ground truth. The Buffy Stickmen dataset (Ferrari et al., 2008) was among the first to provide joint-level body annotations for training pose estimators, with 748 annotated images from TV shows. The LSP (Leeds Sports Pose) dataset (Johnson and Everingham, 2010) expanded to 2,000 images with 14 body keypoints.\n\nThe COCO dataset (Lin et al., 2014) established the modern standard for keypoint annotation at scale, providing 250,000 person instances annotated with 17 body keypoints across 200,000 images. COCO's annotation protocol — which included visibility flags, crowd annotations, and standardized evaluation metrics (OKS-based AP) — became the template that subsequent datasets followed. The MPII Human Pose dataset (Andriluka et al., 2014) contributed 25,000 annotated images with 16 body joints and richer activity annotations.\n\nHand keypoint annotation developed separately, driven by the gesture recognition and sign language communities. The FreiHAND dataset (Zimmermann et al., 2019) provided 130,000 hand images with 21 keypoints and 3D mesh annotations. InterHand2.6M (Moon et al., 2020) scaled to 2.6 million frames of two-hand interaction with 42 keypoints (21 per hand), enabling the first models for two-hand pose estimation during mutual occlusion.\n\nRecent advances in foundation models have transformed the annotation process itself. Models like ViTPose (Xu et al., 2022) achieve near-human accuracy on body keypoints, enabling model-assisted annotation where the human corrects model predictions rather than annotating from scratch. This has shifted the annotation bottleneck from body pose (where models are strong) to hand pose and object keypoints (where models still require significant human correction), particularly in cluttered robotic manipulation scenes.",
  practicalImplications: "Designing a keypoint annotation protocol for robotics requires three key decisions: keypoint schema definition, visibility handling, and quality assurance methodology.\n\nKeypoint schema definition determines which points are annotated and how they connect. For standard body and hand pose, established schemas (COCO-17, HALPE-136, MediaPipe-21) should be used directly to enable transfer learning from large pre-existing datasets. For object keypoints, custom schemas must be designed per object category, selecting points that are visually identifiable from multiple viewpoints, semantically meaningful for the manipulation task, and consistently locatable across object instances within the category. A good practice is to define 8-12 keypoints per object category, including at least 4 non-coplanar points to enable unique 6-DOF pose recovery through PnP algorithms.\n\nVisibility handling is critical for real-world robotics data where occlusion is the norm rather than the exception. The standard three-level visibility flag (visible / occluded-but-labeled / not-in-frame) must be consistently applied. For occluded keypoints, annotators estimate the position based on body knowledge (for human joints), geometric reasoning (for object points), or temporal context (for video sequences where the point was recently visible). Training annotators to accurately place occluded keypoints is the single highest-impact quality investment — models trained with accurate occluded keypoint labels significantly outperform those trained only on visible keypoints.\n\nQuality assurance for keypoint annotation combines automated checks with human review. Automated checks include anatomical plausibility validation (bone segment lengths within physiological ranges, joint angles within biomechanical limits), temporal consistency checks for video (keypoint displacement between frames below physically plausible velocity thresholds), and left-right symmetry checks. Human review targets the hardest cases: heavily occluded joints, ambiguous hand configurations, and edge cases where annotators frequently disagree. Claru computes per-keypoint agreement metrics across multiple annotators, identifying specific joints that require guideline refinement or additional annotator training.",
  commonMisconceptions: [
    {
      misconception: "Keypoint annotation is just clicking points on an image — any annotator can do it quickly.",
      correction: "Accurate keypoint annotation requires trained spatial reasoning, especially for occluded joints. Placing an invisible hip joint behind a table, or a self-occluded fingertip during a grasp, demands anatomical knowledge and geometric inference. Untrained annotators produce 2-3x higher error rates on occluded keypoints compared to trained specialists. Annotation time ranges from 30 seconds to 3 minutes per instance depending on the number of keypoints and occlusion complexity — far from a quick click-and-done task.",
    },
    {
      misconception: "2D keypoint annotations are obsolete now that 3D pose estimation exists.",
      correction: "2D keypoint annotations remain essential for two reasons. First, 3D ground truth requires expensive multi-camera setups or depth sensors, while 2D annotations can be produced from any monocular image or video, enabling annotation of diverse in-the-wild data at scale. Second, the dominant approach to 3D pose estimation (lifting 2D detections to 3D) still requires 2D keypoint training data. Even models that predict 3D pose directly are typically supervised with 2D keypoint reprojection losses because 2D annotations are more abundant and cheaper to produce than 3D ground truth.",
    },
    {
      misconception: "More keypoints per skeleton always improves downstream model performance.",
      correction: "Beyond a task-specific threshold, additional keypoints add annotation cost without improving the downstream task. For human-robot collision avoidance, the 17-joint COCO skeleton is sufficient. For dexterous hand manipulation, the 21-joint hand model is necessary but the 778-vertex MANO mesh is overkill for most policy learning applications. For object pose estimation, 8-12 keypoints per category are typically sufficient for accurate 6-DOF recovery. The right number of keypoints is the minimum set that captures the geometric information needed for the specific manipulation or interaction task.",
    },
  ],
  keyPapers: [
    {
      id: "xu-vitpose-2022",
      title: "ViTPose: Simple Vision Transformer Baselines for Human Pose Estimation",
      authors: "Xu et al.",
      venue: "NeurIPS 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2204.12484",
    },
    {
      id: "lin-coco-keypoints-2014",
      title: "Microsoft COCO: Common Objects in Context",
      authors: "Lin et al.",
      venue: "ECCV 2014",
      year: 2014,
      url: "https://arxiv.org/abs/1405.0312",
    },
    {
      id: "zimmermann-freihand-2019",
      title: "FreiHAND: A Dataset for Markerless Capture of Hand Pose and Shape from Single RGB Images",
      authors: "Zimmermann et al.",
      venue: "ICCV 2019",
      year: 2019,
      url: "https://arxiv.org/abs/1909.04349",
    },
    {
      id: "moon-interhand-2020",
      title: "InterHand2.6M: A Dataset and Baseline for 3D Interacting Hand Pose Estimation from a Single RGB Image",
      authors: "Moon et al.",
      venue: "ECCV 2020",
      year: 2020,
      url: "https://arxiv.org/abs/2008.09309",
    },
    {
      id: "wang-nocs-2019",
      title: "Normalized Object Coordinate Space for Category-Level 6D Object Pose and Size Estimation",
      authors: "Wang et al.",
      venue: "CVPR 2019",
      year: 2019,
      url: "https://arxiv.org/abs/1901.02970",
    },
  ],
  claruRelevance: "Claru delivers production-grade keypoint annotation across the three domains central to physical AI: body pose, hand pose, and object landmarks. Our annotation pipeline uses model-assisted pre-labeling — ViTPose for body skeletons, MediaPipe for hand joints — with human correction that focuses annotator effort on the occluded and ambiguous joints where models are weakest. For object keypoints, Claru collaborates with each client to define custom keypoint schemas aligned to their manipulation tasks, ensuring the annotated landmarks carry direct geometric meaning for grasp planning and pose estimation. Quality controls include anatomical plausibility checks, temporal consistency validation for video sequences, and multi-annotator agreement monitoring with a target MPJPE below 3 pixels. Our 10,000+ trained annotators across 100+ cities produce keypoint data at scale across diverse environments and object categories, delivering the volume and variety that production pose estimation systems require.",
};

export default data;
