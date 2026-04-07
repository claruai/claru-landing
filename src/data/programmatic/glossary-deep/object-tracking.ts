import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "object-tracking",
  termSlug: "object-tracking",
  category: "computer-vision",
  metaTitle: "Object Tracking — Definition & Training Data | Claru",
  metaDescription: "Object tracking follows specific targets across video frames. Learn about SOT, MOT, tracking-by-detection, and training data requirements for robotics and embodied AI.",
  primaryKeyword: "object tracking",
  secondaryKeywords: ["visual object tracking", "multi-object tracking", "MOT", "video tracking", "single object tracking"],
  canonicalPath: "/glossary/object-tracking",
  h1: "Object Tracking: Following Objects Across Video Frames for Robotic Perception",
  heroSubtitle: "Object tracking maintains the identity and location of one or more targets across consecutive video frames. For robotics, it is the perceptual capability that lets a robot follow a moving object, track its own manipulation targets, and maintain situational awareness of dynamic environments.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Object Tracking", href: "/glossary/object-tracking" },
  ],
  sections: [],
  faqs: [
    {
      question: "What is the difference between single object tracking and multi-object tracking?",
      answer: "Single Object Tracking (SOT) follows one target initialized in the first frame, predicting its bounding box or mask in every subsequent frame. The tracker is given the target appearance at initialization and must handle appearance changes, occlusions, and background clutter. MOT (Multi-Object Tracking) simultaneously tracks all objects of one or more classes across frames, maintaining unique identity assignments even when objects occlude each other, enter or leave the frame, or have similar appearances. SOT is used when a robot must follow a specific object (the cup it is about to grasp), while MOT is used for scene-level understanding (tracking all people and objects in a workspace). SOT benchmarks include GOT-10k and LaSOT; MOT benchmarks include MOT17, MOT20, and TAO. The computational demands differ significantly: SOT runs a single template-matching model, while MOT requires detection, feature extraction, and combinatorial assignment at every frame."
    },
    {
      question: "What training data is needed for object tracking models?",
      answer: "SOT models require video sequences with per-frame bounding box annotations of the target object. GOT-10k provides 10,000 video sequences with 1.5 million annotated frames across 563 object classes. LaSOT provides 1,400 long sequences (2,500 frames average) with dense annotations. For MOT, training data requires detection-level annotations (bounding boxes with class labels) plus identity annotations (consistent ID assignments across frames) for every tracked object. MOT17 provides 14 video sequences in pedestrian-heavy scenes with complete identity tracks. For robotics-specific tracking, the key data gap is domain coverage: existing benchmarks focus on surveillance and driving scenarios, not tabletop manipulation, warehouse logistics, or egocentric views. Custom tracking datasets for robotics typically need 100-500 annotated video sequences in the target environment, with identity-consistent annotations across full interaction episodes."
    },
    {
      question: "How does tracking differ from detection applied to every frame?",
      answer: "Running an object detector independently on every frame produces per-frame detections without identity — the detector cannot tell whether the cup in frame 10 is the same cup as in frame 9. Tracking adds temporal association: it links detections across frames into consistent identity tracks. This identity persistence is critical for robotics because the robot needs to know that the object it planned to grasp in frame 10 is the same object it detected in frame 5. Modern tracking-by-detection methods (ByteTrack, BoT-SORT, OC-SORT) run a detector per frame and use motion models (Kalman filters) and appearance features (ReID embeddings) to associate detections across frames. End-to-end tracking methods (TrackFormer, MOTR) jointly detect and track in a single transformer pass. Detection alone is sufficient for static scenes; tracking is necessary whenever objects move, the camera moves, or the robot needs to maintain a plan that references specific object instances over time."
    },
    {
      question: "What are the main challenges in object tracking for robotics?",
      answer: "Robotics introduces tracking challenges absent from typical surveillance benchmarks. Egocentric viewpoint: robot-mounted cameras produce rapid viewpoint changes during manipulation, causing dramatic appearance variation. Severe occlusion: during grasping, the robot's own gripper occludes the target object for multiple frames. Fast motion: robot arm movement causes motion blur and large frame-to-frame displacement. Small objects: many manipulation targets (screws, connectors, utensils) are small and lack distinctive texture. Similar objects: a bin of identical parts requires tracking that distinguishes between visually identical instances based on spatial position alone. Deformable objects: cloth, rope, and food items change shape during manipulation, defeating appearance-based matching. Each challenge requires specific data coverage in training: datasets must include occluded sequences, fast-motion sequences, small-object sequences, and same-class multi-instance sequences to produce robust trackers."
    },
    {
      question: "How does Claru provide tracking annotation data for robotics?",
      answer: "Claru produces identity-consistent object tracking annotations across video sequences captured in real-world robotics environments. Our annotation pipeline assigns persistent object IDs across full video sequences — from the moment an object enters the scene through manipulation, occlusion, and re-appearance. Annotators use tracking-assisted tools that propagate bounding boxes or masks using optical flow, with manual correction at every frame where automatic propagation fails (occlusion boundaries, fast motion, appearance change). Quality control enforces identity consistency: automated checks flag ID switches, ensure no two tracks share the same ID, and verify that tracks survive brief occlusions rather than being incorrectly terminated. For multi-object scenarios, we annotate all task-relevant objects simultaneously, producing the complete scene-level tracking ground truth needed for MOT training. Datasets are delivered in MOT Challenge format or COCO-VID format compatible with standard tracking frameworks."
    },
  ],
  ctaHeading: "Need Object Tracking Data?",
  ctaDescription: "Claru provides purpose-built datasets for physical AI and robotics. Tell us what your model needs to learn.",
  relatedGlossaryTerms: ["bounding-box-annotation", "optical-flow", "instance-segmentation", "sam"],
  relatedGuidePages: ["how-to-build-an-object-tracking-dataset"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  longDefinition: `Object tracking is the computer vision task of estimating the location (and optionally the shape) of one or more target objects across consecutive video frames while maintaining consistent identity assignments. Given a video sequence, a tracker outputs a set of trajectories, where each trajectory is a time-indexed series of bounding boxes or segmentation masks associated with a unique object identity. The tracker must handle appearance changes due to lighting, viewpoint, and deformation; temporary disappearances due to occlusion or frame exit; and confusion with similar-looking objects or background regions.

The field divides into two paradigms. Single Object Tracking (SOT) initializes on one target in the first frame and follows it through the video. The tracker maintains a model of the target's appearance and searches for the best match in each subsequent frame. Modern SOT methods (SiamFC, SiamRPN, DiMP, MixFormer) use Siamese networks or transformer architectures that compare a template of the target with search regions in the current frame. Multi-Object Tracking (MOT) simultaneously tracks all objects of interest, typically combining per-frame detection with cross-frame association. The dominant paradigm is tracking-by-detection: a detector (YOLO, DETR) produces per-frame detections, and an association algorithm (Hungarian matching, greedy assignment) links detections across frames using motion cues (Kalman filter predictions) and appearance similarity (ReID features).

For robotics, object tracking is a core perceptual primitive. A robot manipulating objects in a dynamic environment must track the pose of its targets through the manipulation sequence — from initial detection, through approach, during grasping (when the gripper occludes the object), and through placement. Tracking also enables the robot to monitor other agents (humans, other robots) and moving obstacles for safety and coordination. Video object segmentation (VOS), which produces per-pixel masks rather than bounding boxes, provides the precise spatial information needed for manipulation planning.

Recent advances have unified tracking with segmentation. SAM 2 (Ravi et al., 2024) extends the Segment Anything Model to video, producing temporally consistent masks from a single click initialization. This enables zero-shot video object segmentation without task-specific training, significantly reducing the data annotation burden for robotics tracking applications.`,
  historicalContext: `Object tracking research dates to the 1980s with Kalman filter-based approaches for radar target tracking, which were adapted to visual tracking in the 1990s. Early visual trackers used color histograms (Mean Shift, 1998), template matching, and particle filters (Condensation, 1998) to follow objects through video.

The deep learning era transformed tracking starting around 2015. SiamFC (Bertinetto et al., 2016) introduced Siamese networks for SOT, framing tracking as cross-correlation between a target template and search regions. This approach was fast and trainable end-to-end, spawning a family of Siamese trackers (SiamRPN, SiamMask, SiamRPN++) that dominated SOT benchmarks for several years.

For MOT, the SORT algorithm (Bewley et al., 2016) combined Kalman filter motion prediction with Hungarian algorithm assignment, establishing the tracking-by-detection framework. DeepSORT (Wojke et al., 2017) added appearance-based re-identification features, enabling tracking through longer occlusions. ByteTrack (Zhang et al., 2022) showed that associating low-confidence detections as a second step significantly improves tracking accuracy, achieving state-of-the-art results with a simple design.

Transformer-based methods have recently unified detection and tracking. TrackFormer (Meinhardt et al., 2022) and MOTR (Zeng et al., 2022) perform joint detection and tracking in a single transformer pass, eliminating the separate association step. For SOT, MixFormer (Cui et al., 2022) and OSTrack (Ye et al., 2022) use vision transformers to fuse template and search features, achieving strong performance with simpler architectures than Siamese networks.

SAM 2 (Ravi et al., 2024) represents the latest paradigm shift: a promptable foundation model for video segmentation and tracking. By extending SAM to video with a memory mechanism, SAM 2 achieves state-of-the-art video object segmentation from a single-frame initialization, generalizing zero-shot to novel domains.`,
  practicalImplications: `Deploying object tracking in robotics requires decisions about architecture, data, and integration. The first decision is SOT versus MOT. If the robot operates on a single known target (pick this specific object), SOT is simpler and faster. If the robot must maintain awareness of multiple objects (monitor all items on a table, track all people in a workspace), MOT is necessary. Hybrid approaches are common: MOT for scene-level awareness with SOT refinement for the active manipulation target.

Data requirements depend on the tracking paradigm. SOT models pretrained on GOT-10k or LaSOT generalize reasonably to new object categories but struggle with domain-specific challenges (egocentric viewpoints, gripper occlusion). Fine-tuning on 100-500 domain-specific video sequences significantly improves robustness. MOT models are more sensitive to the detector quality than the tracker itself — investing in better detection training data (more annotated frames in the target domain) typically improves tracking more than improving the association algorithm.

For production robotics, the main failure mode is identity switches — the tracker incorrectly swaps the IDs of two objects that pass near each other or occlude each other. Identity switches are catastrophic for manipulation: if the robot's target ID jumps to a different object mid-task, the robot will grasp the wrong item. Reducing identity switches requires strong appearance features (trained on domain-specific data) and robust motion models. Evaluation should track the IDS (Identity Switches) and IDSW (Identity Switch Rate) metrics, not just MOTA (Multi-Object Tracking Accuracy), which can hide identity switch problems behind high detection accuracy.

Integration with the robot's planning stack requires careful attention to tracking latency and failure recovery. Tracking must run at frame rate (30+ Hz) to provide timely state estimates for reactive control. When tracking fails (the target is lost), the system needs a recovery strategy — typically re-initializing from a new detection or requesting human guidance. Production systems should implement confidence monitoring that detects tracking degradation before failure.`,
  commonMisconceptions: [
    {
      misconception: "Running a fast object detector on every frame is equivalent to tracking.",
      correction: "Detection produces independent per-frame results without identity persistence. If three identical cups are on a table, a detector will find three cups in every frame but cannot tell you which detection in frame 10 corresponds to which detection in frame 9. Tracking adds the identity association layer that links detections into consistent trajectories. Without tracking, a robot cannot maintain a plan that references specific objects over time — it would lose track of which cup it intended to pick up the moment any cup moves or the camera shifts."
    },
    {
      misconception: "Tracking models trained on surveillance data generalize well to robotics scenarios.",
      correction: "Surveillance tracking benchmarks (MOT17, MOT20) feature mostly upright pedestrians viewed from fixed overhead or street-level cameras with moderate motion. Robotics tracking involves radically different viewpoints (egocentric, wrist-mounted), extreme occlusions (gripper covering the target), diverse object categories (not just people), and rapid camera motion during manipulation. Models trained exclusively on surveillance data typically lose targets within seconds in robot manipulation scenarios. Domain-specific training data — even small amounts (100-500 sequences) — is necessary for reliable robotics tracking."
    },
    {
      misconception: "SAM 2 and other foundation models eliminate the need for tracking-specific training data.",
      correction: "SAM 2 provides impressive zero-shot video object segmentation, but it has limitations in robotics contexts. It requires a human-provided initialization (click or box) in the first frame, it can lose objects during extended heavy occlusion (like a gripper fully covering a target), and its temporal memory mechanism can drift on very long sequences. For production robotics, SAM 2 is best used as a powerful initialization and pre-labeling tool, with domain-specific fine-tuning or a specialized tracker for the challenging segments. Training data for the robotics-specific failure modes remains necessary."
    },
  ],
  keyPapers: [
    {
      id: "zhang-bytetrack-2022",
      title: "ByteTrack: Multi-Object Tracking by Associating Every Detection Box",
      authors: "Zhang et al.",
      venue: "ECCV 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2110.06864",
    },
    {
      id: "ravi-sam2-2024",
      title: "SAM 2: Segment Anything in Images and Videos",
      authors: "Ravi et al.",
      venue: "arXiv",
      year: 2024,
      url: "https://arxiv.org/abs/2408.00714",
    },
    {
      id: "bertinetto-siamfc-2016",
      title: "Fully-Convolutional Siamese Networks for Object Tracking",
      authors: "Bertinetto et al.",
      venue: "ECCV 2016 Workshops",
      year: 2016,
      url: "https://arxiv.org/abs/1606.09549",
    },
    {
      id: "cui-mixformer-2022",
      title: "MixFormer: End-to-End Tracking with Iterative Mixed Attention",
      authors: "Cui et al.",
      venue: "CVPR 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2203.11082",
    },
    {
      id: "wojke-deepsort-2017",
      title: "Simple Online and Realtime Tracking with a Deep Association Metric",
      authors: "Wojke, Bewley, and Paulus",
      venue: "ICIP 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1703.07402",
    },
  ],
  claruRelevance: "Claru provides identity-consistent tracking annotations across video sequences captured in real-world robotics environments. Our annotation pipeline maintains persistent object IDs through full manipulation episodes — including the gripper occlusion, fast motion, and viewpoint changes where off-the-shelf trackers fail. For each video sequence, annotators produce frame-level bounding boxes or segmentation masks with verified identity consistency, using optical-flow-assisted propagation with per-frame human correction. Quality controls include automated ID-switch detection, occlusion-gap verification, and inter-annotator tracking consistency checks on double-annotated sequences. With 386,000+ annotated video clips in our catalog — including egocentric activity sequences, workplace recordings, and game environment footage — Claru provides the diversity and scale that tracking models need to generalize beyond laboratory settings to real-world robotic deployment.",
};

export default data;
