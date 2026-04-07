import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-annotate-hand-object-interactions",
  metaTitle: "How to Annotate Hand-Object Interactions in Video (2026 Guide) | Claru",
  metaDescription: "Step-by-step guide to annotating hand-object interactions including grasp types, contact points, hand pose estimation, and temporal action segmentation.",
  primaryKeyword: "how to annotate hand-object interactions in video",
  secondaryKeywords: ["hand-object interaction annotation","hand pose labeling","grasp type annotation","contact point annotation","hand tracking dataset"],
  canonicalPath: "/guides/how-to-annotate-hand-object-interactions",
  h1: "How to Annotate Hand-Object Interactions in Video",
  heroSubtitle: "Step-by-step guide to annotating hand-object interactions including grasp types, contact points, hand pose estimation, and temporal action segmentation for robot learning.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Annotate Hand-Object Interactions in Video", href: "/guides/how-to-annotate-hand-object-interactions" },
  ],
  sections: [],
  faqs: [
    {
      question: "What annotation granularity is needed for hand-object interaction data?",
      answer: "It depends on your downstream model. For learning manipulation from human videos (like Dexterity from Human Videos or MimicGen), you need 21-keypoint hand pose per frame plus object 6-DoF pose, annotated at 10-30 fps. For grasp-type classification, per-clip labels using a taxonomy like the GRASP taxonomy (33 types) or the simplified Feix taxonomy (16 types) suffice. For contact-aware policies, you need per-frame binary contact maps between each finger segment and the object surface, typically at 5-10 fps."
    },
    {
      question: "Can I use automated hand pose estimators instead of manual annotation?",
      answer: "Yes, but with human-in-the-loop correction. Models like HaMeR, FrankMocap, or MediaPipe Hands estimate 21 3D keypoints per hand at real-time speed, but accuracy degrades severely during heavy occlusion (hand behind object, fingers wrapped around small items). The standard workflow is: run HaMeR on all frames, flag frames where wrist confidence drops below 0.7 or finger self-intersection is detected, then route those frames to human annotators for correction. This hybrid approach reduces annotation cost by 60-70% versus fully manual labeling."
    },
    {
      question: "How do you handle occlusion when the hand is hidden behind an object?",
      answer: "Occlusion is the primary challenge. Three strategies: (1) Use multi-view camera setups (minimum 3 cameras at 120-degree offsets) so at least one view sees the occluded fingers. (2) For single-view data, annotate visible keypoints with high confidence and occluded keypoints with low confidence, and mark them with an occlusion flag. Models can then weight loss by confidence during training. (3) Use temporal interpolation for brief occlusions under 5 frames where the hand pose before and after is known."
    },
    {
      question: "What frame rate should hand-object interaction annotations use?",
      answer: "For manipulation learning, annotate at 10 fps minimum. Fast interactions like tool use or pouring require 15-30 fps to capture the contact transition accurately. For coarse activity recognition (e.g., identifying pick-place-pour sequences), 2-5 fps annotations with temporal boundary labels are sufficient. The key constraint is that your annotation frame rate should match or exceed your policy's observation frequency. If your robot policy runs at 10 Hz, annotating at 5 fps creates aliasing."
    },
    {
      question: "How many annotated hand-object interaction clips are needed for robot learning?",
      answer: "For hand-to-robot retargeting (mapping human hand motions to a robot gripper), 200-500 diverse interaction clips per object category trains a reliable retargeting model. For learning manipulation primitives from human video, R3M and VIP used 4,000+ Ego4D clips. For fine-grained contact prediction, DexYCB used 1,000 grasps across 20 objects. A good starting point is 50 annotated clips per grasp type you want to cover, with 5+ object instances per category for generalization."
    }
  ],
  ctaHeading: "Need Help With This?",
  ctaDescription: "Talk to a Claru data collection specialist about your specific requirements.",
  relatedGlossaryTerms: ["hand-object-interaction","pose-estimation","keypoint-annotation","egocentric-video"],
  relatedGuidePages: ["how-to-collect-egocentric-video-data","how-to-annotate-manipulation-trajectories"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  difficulty: "intermediate",
  estimatedTime: "2-4 weeks",
  prerequisites: [
    "Video dataset of hand-object interactions (egocentric or third-person, minimum 640x480 at 15+ fps)",
    "Python 3.9+ with PyTorch, OpenCV, and MediaPipe installed",
    "Pre-trained hand pose estimator (HaMeR or FrankMocap weights downloaded)",
    "Annotation tool with video support (CVAT, VIA, or Label Studio with video backend)",
    "Defined grasp taxonomy for your application domain (e.g., Feix 16-type or custom)"
  ],
  tools: ["HaMeR","FrankMocap","MediaPipe Hands","CVAT","Label Studio","OpenCV","DexYCB toolkit","Python","100DOH detector"],
  steps: [
    {
      stepNumber: 1,
      title: "Define Your Annotation Taxonomy and Schema",
      description: "Before touching any video, define exactly what you are annotating and at what granularity. Hand-object interaction annotation spans multiple layers, and trying to annotate everything simultaneously burns time and creates inconsistent data. Choose from these annotation layers based on your downstream task:\n\n(1) Hand pose: 21 keypoints per hand following the MediaPipe/MANO convention (wrist + 4 joints per finger). Each keypoint has (x, y, z) in camera coordinates plus a visibility flag (visible, self-occluded, object-occluded, out-of-frame). (2) Grasp type: per-frame or per-clip label from a defined taxonomy. The Feix taxonomy defines 16 grasp types (precision pinch, power wrap, lateral tripod, etc.) and is the most widely adopted in robotics. For kitchen/household tasks, a simplified 6-type taxonomy (pinch, wrap, hook, press, twist, no-contact) often suffices. (3) Contact annotation: binary mask or sparse keypoints indicating which parts of the hand are in physical contact with the object surface. At minimum, annotate contact per finger (thumb, index, middle, ring, pinky) as a boolean per frame. (4) Temporal action boundaries: start/end timestamps for manipulation primitives (approach, contact, manipulate, release, retreat).\n\nCreate a formal annotation specification document with visual examples for each label. For grasp types, include reference photos showing the canonical hand configuration. For temporal boundaries, define the exact frame where each phase begins (e.g., \"contact starts at the first frame where any finger touches the object surface, visible as deformation or cessation of relative motion\"). Ambiguous definitions are the primary source of inter-annotator disagreement.",
      tools: ["Google Docs", "Figma"],
      tips: [
        "Start with a pilot of 20 clips annotated by 3 people independently, then measure agreement. Refine the taxonomy based on where disagreements cluster before scaling.",
        "Include a 'cannot determine' option for every annotation type. Forcing annotators to guess on ambiguous frames introduces systematic noise that is worse than missing data.",
        "Map your taxonomy to existing standards (GRASP taxonomy IDs, MANO keypoint order) so your dataset is compatible with published baselines."
      ]
    },
    {
      stepNumber: 2,
      title: "Run Automated Hand Pose Estimation as Pre-Annotation",
      description: "Use a state-of-the-art hand pose estimator to generate initial annotations that human annotators will then correct. This hybrid approach is 3-5x faster than fully manual annotation. The current best options are HaMeR (CVPR 2024, reconstructs MANO mesh from single images), FrankMocap (reconstructs both hand and body), and MediaPipe Hands (fastest, but 2D-only without a depth lifting step).\n\nFor HaMeR, install via `pip install hamer` and run batch inference: `python -m hamer.demo --img_folder /path/to/frames --out_folder /path/to/results --batch_size 16`. HaMeR outputs MANO parameters (pose, shape, translation) and 21 3D keypoints per detected hand. It also outputs a per-hand confidence score. On an NVIDIA A100, HaMeR processes approximately 30 fps at 640x480 resolution. For egocentric video where hands are large and central, accuracy is typically excellent (MPJPE under 10mm). For third-person video with small hands, accuracy degrades and you will need more human correction.\n\nFor each frame, extract and store: (a) 21 keypoints as a (21, 3) numpy array in camera coordinates, (b) hand bounding box as (x, y, w, h), (c) handedness (left/right), (d) overall confidence score (0-1), and (e) per-keypoint confidence. Save results as a JSON file per video clip with frame-level entries. Also generate a visualization overlay (skeleton drawn on the RGB frame) for each video so annotators can quickly scrub through and spot errors without needing to run inference themselves.\n\nCompute quality statistics across your dataset: what percentage of frames have confident detections (score > 0.8), how many frames have no detection at all (hand fully occluded or out of frame), and the distribution of per-keypoint confidence. Frames with detection confidence below 0.5 should be prioritized for manual annotation.",
      tools: ["HaMeR", "FrankMocap", "MediaPipe Hands", "PyTorch", "FFmpeg"],
      tips: [
        "Run hand detection on every frame, but only run full pose estimation on frames where the detection confidence exceeds 0.3. Below that threshold, the detection is likely a false positive (elbow, face, etc.) and the pose will be garbage.",
        "For egocentric video, crop a generous bounding box around each hand (1.5x the detection box) before feeding to the pose estimator. Tight crops cut off fingers and cause systematic errors on the pinky and thumb.",
        "Save MANO parameters alongside keypoints. Downstream users may want to fit the full hand mesh for contact computation, and re-running pose estimation is expensive."
      ]
    },
    {
      stepNumber: 3,
      title: "Set Up the Annotation Interface for Human Correction",
      description: "Configure your annotation tool to display pre-computed hand poses overlaid on video and let annotators correct keypoints, add grasp labels, and mark temporal boundaries in a single pass. CVAT (Computer Vision Annotation Tool) is the best open-source option for this workflow because it supports video-native annotation with interpolation, skeleton templates, and attribute labels per frame.\n\nIn CVAT, create a project with a skeleton task type. Define a skeleton template matching the 21-keypoint MANO hand model: wrist as root, then chains of 4 keypoints for each finger (MCP, PIP, DIP, tip). Enable the 'outside' attribute for occluded keypoints. Import the pre-computed poses from Step 2 using CVAT's annotation import (convert your JSON to CVAT XML format using the `datumaro` library: `datum convert -if custom_json -of cvat -i preds/ -o cvat_import/`). This pre-populates the skeleton on each frame so annotators correct rather than draw from scratch.\n\nAdd attribute fields to the skeleton object for per-frame annotation: `grasp_type` (dropdown with your taxonomy values), `contact_fingers` (multi-select: thumb, index, middle, ring, pinky), and `manipulation_phase` (dropdown: approach, contact, manipulate, release, retreat, idle). Configure the timeline view so annotators can see the manipulation phase as a color-coded track below the video, making temporal boundary annotation feel like editing a video timeline rather than labeling individual frames.\n\nSet up the annotation workflow with three stages: (1) Pose correction: annotator adjusts keypoint positions and marks occlusion flags, spending approximately 2-5 seconds per frame on frames with pre-annotation and 10-15 seconds on frames without. (2) Grasp and contact labeling: annotator scrubs through the corrected video and adds grasp type + contact finger labels at key transitions, using interpolation for stable grasps. (3) Review: a second annotator verifies a random 20% sample. Configure CVAT's project to enforce this ordering using task stages.",
      tools: ["CVAT", "datumaro", "Label Studio", "FFmpeg"],
      tips: [
        "Enable CVAT's automatic interpolation for skeleton tracks. When the annotator corrects keypoints on frame 10 and frame 20, CVAT linearly interpolates frames 11-19. This is accurate for slow movements and cuts annotation time by 5x for stable grasps.",
        "Set up keyboard shortcuts for grasp type labels. Annotators who can press 'p' for pinch and 'w' for wrap are 3x faster than those using dropdown menus.",
        "Limit annotation sessions to 2 hours. Hand pose correction is visually demanding and accuracy drops measurably after 90 minutes of continuous work."
      ]
    },
    {
      stepNumber: 4,
      title: "Annotate Contact Points and Object Interaction Semantics",
      description: "Beyond hand pose, annotate the interaction semantics that make the data useful for robot learning. This step adds three layers: fingertip contact points on the object surface, object identity and state, and manipulation intent.\n\nFor contact annotation, the most practical approach for video data is per-finger binary contact labels per frame. Create a timeline annotation track for each finger (thumb through pinky). An annotator marks the exact frame where each finger makes and breaks contact with the object. For higher-fidelity contact, annotate contact regions on the object surface using 2D bounding circles (center point + radius in pixels) around each contact area. This is especially important for dexterous manipulation tasks where the exact contact location on the object determines the manipulation outcome (e.g., grasping a mug by the handle vs. the body).\n\nFor object annotation, use a lightweight tracking approach. Draw a bounding box around the manipulated object on the first frame, assign it a category label (e.g., `mug`, `bottle`, `knife`) and an instance ID, then use a semi-automatic tracker (CSRT or SiamRPN in OpenCV) to propagate the box through the clip. Annotators verify and correct the tracked box every 10-20 frames. Include object state attributes where relevant: `empty/full` for containers, `open/closed` for doors and drawers, `on/off` for switches.\n\nFor manipulation intent, annotate a natural language description of the action per temporal segment. Keep descriptions atomic and structured: \"[hand] [verb] [object] [modifier]\", e.g., \"right hand grasps mug by handle\", \"left hand presses lid down\", \"right hand rotates jar counterclockwise\". These language annotations are directly consumable by vision-language-action models like RT-2 and OpenVLA that condition on natural language task descriptions. Aim for 5-15 words per segment. Store the language annotation as a separate track aligned to the temporal boundaries from Step 3.\n\nThis is the most time-intensive annotation layer. Budget 3-5 minutes per 10-second clip for contact + object + language annotation on top of the corrected hand pose.",
      tools: ["CVAT", "OpenCV trackers", "Label Studio"],
      tips: [
        "For contact annotation, play the video at 0.25x speed. Contact transitions happen in 1-3 frames and are easy to miss at normal playback speed.",
        "Use audio cues when available. The sound of contact (tap, slide, click) often pinpoints the exact contact frame more reliably than visual inspection alone.",
        "Standardize the language vocabulary across annotators. Create a controlled verb list (grasp, pinch, push, pull, twist, press, release, slide, pour, place) and enforce its use. Free-form descriptions create inconsistency that downstream language models struggle with."
      ]
    },
    {
      stepNumber: 5,
      title: "Validate Annotations with Automated and Human QA",
      description: "Run a multi-stage quality assurance pipeline before the annotated data enters your training set. For hand pose annotations, implement four automated checks:\n\n(1) Bone-length consistency: compute the distance between consecutive joints for each finger across all frames. Bone lengths should be constant (within 5% of the per-clip median) since the hand skeleton does not change size. Frames where any bone length deviates by more than 10% indicate a keypoint was dragged to the wrong location. Flag these automatically: `bone_lengths = np.linalg.norm(kp[1:] - kp[:-1], axis=-1)` then check `np.abs(bone_lengths - np.median(bone_lengths, axis=0)) > 0.1 * np.median(bone_lengths, axis=0)`.\n\n(2) Self-intersection: check that no two non-adjacent finger segments cross. Compute the minimum distance between each pair of finger bone segments using line-segment distance formulas. Distances under 5mm between non-adjacent fingers indicate an anatomically impossible configuration.\n\n(3) Temporal smoothness: compute the per-keypoint velocity between consecutive frames. Velocities exceeding 500mm per frame (at 30fps) indicate a keypoint jump, likely from a tracker failure or annotation error. Use a Savitzky-Golay filter (`scipy.signal.savgol_filter` with window=5, polyorder=2) to smooth keypoint trajectories, then flag frames where the raw-to-smoothed distance exceeds 10mm.\n\n(4) Contact consistency: when a finger is labeled as in contact with the object, verify that the fingertip keypoint is within 15mm of the object bounding box. A contact label with the finger clearly in the air is either a contact annotation error or a pose annotation error.\n\nFor inter-annotator agreement on grasp types, compute Cohen's kappa on the 20% overlap subset. Target kappa > 0.75 for the full taxonomy or > 0.85 for a simplified taxonomy. For temporal boundaries, compute the mean offset between annotators' boundary frames and target under 3 frames (100ms at 30fps). Generate a per-annotator quality dashboard and retrain underperforming annotators on the specific error patterns they exhibit.",
      tools: ["NumPy", "SciPy", "scikit-learn", "Matplotlib", "pandas"],
      tips: [
        "The bone-length check catches more errors than any other single metric. Implement it first and run it on every batch before human review.",
        "Sort flagged frames by error magnitude, not randomly. Reviewing the worst errors first is more efficient and reveals systematic annotation tool bugs.",
        "Track the correction rate (percentage of pre-annotated frames that required human modification) per video. Clips with correction rates above 50% likely have a fundamental issue (extreme motion blur, resolution too low) and may not be worth annotating."
      ]
    },
    {
      stepNumber: 6,
      title: "Export and Format for Downstream Consumption",
      description: "Package the validated annotations into formats that integrate directly with robot learning pipelines. The output for each video clip should be a single structured record containing synchronized streams: RGB frames, 21-keypoint hand pose per frame (left and right), grasp type labels, contact flags, temporal boundaries, object tracks, and language descriptions.\n\nFor RLDS format (consumed by RT-X, Octo, OpenVLA), structure each clip as an episode in a TFRecord. Store hand keypoints as `observation/hand_keypoints_left` (float32, shape [21, 3]) and `observation/hand_keypoints_right` (same). Store grasp type as `observation/grasp_type` (int32 index into your taxonomy). Store contact as `observation/contact_fingers` (bool, shape [5] for thumb through pinky). Store language as `language_instruction` (string). Use `tfds.features.FeaturesDict` for the episode spec and `tensorflow_datasets.builder` to create the dataset.\n\nFor HDF5 format (consumed by Diffusion Policy, ACT, MimicGen), organize each clip as a group: `/clip_N/rgb` (uint8, T x H x W x 3), `/clip_N/hand_pose_left` (float32, T x 21 x 3), `/clip_N/hand_pose_right` (float32, T x 21 x 3), `/clip_N/grasp_type` (int32, T), `/clip_N/contact` (bool, T x 2 x 5 for left/right x fingers), `/clip_N/language` (string attribute), `/clip_N/temporal_segments` (structured array with start_frame, end_frame, phase_label). Use chunked compression: `chunks=(min(T, 100), 21, 3), compression='lzf'` for keypoints.\n\nProvide a Python dataloader class with these methods: `__len__()` returning the number of clips, `__getitem__(idx)` returning a dictionary of tensors for one clip, and `get_statistics()` returning per-feature means and standard deviations for normalization. Include a visualization script that takes a clip index and renders an MP4 with skeleton overlay, contact indicators (green dots on contacting fingers), and the language description as a text overlay. This visualization is the single most important deliverable for building trust with downstream users.\n\nGenerate a dataset card (Markdown file) documenting: total clips, total frames, camera specs, annotation layers, taxonomy definitions, inter-annotator agreement scores, known limitations (e.g., 'left-hand annotations are lower quality due to occlusion bias in egocentric video'), and citation information.",
      tools: ["TensorFlow Datasets", "h5py", "NumPy", "FFmpeg", "Matplotlib"],
      tips: [
        "Include the raw MANO parameters alongside extracted keypoints. Users doing hand mesh reconstruction or contact simulation need the full parametric model, not just sparse keypoints.",
        "Split by scene, not by clip. If multiple clips come from the same kitchen, they must all go in the same split to prevent data leakage from shared backgrounds and objects.",
        "Provide normalization statistics (mean/std per keypoint) computed on the training split only. Downstream users frequently normalize input features and computing these on the full dataset introduces subtle test-set leakage."
      ]
    }
  ],
  keyPapers: [
    {
      id: "pavlakos-hamer-2024",
      title: "Reconstructing Hands in 3D with Transformers",
      authors: "Pavlakos et al.",
      venue: "CVPR 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2312.05251"
    },
    {
      id: "chao-dexycb-2021",
      title: "DexYCB: A Benchmark for Capturing Hand Grasping of Objects",
      authors: "Chao et al.",
      venue: "CVPR 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2104.04631"
    },
    {
      id: "shan-100doh-2020",
      title: "Understanding Human Hands in Contact at Internet Scale",
      authors: "Shan et al.",
      venue: "CVPR 2020",
      year: 2020,
      url: "https://arxiv.org/abs/2006.06669"
    },
    {
      id: "grauman-ego4d-2022",
      title: "Ego4D: Around the World in 3,000 Hours of Egocentric Video",
      authors: "Grauman et al.",
      venue: "CVPR 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2110.07058"
    },
    {
      id: "feix-grasp-taxonomy-2016",
      title: "The GRASP Taxonomy of Human Grasp Types",
      authors: "Feix et al.",
      venue: "IEEE Transactions on Human-Machine Systems 2016",
      year: 2016,
      url: "https://doi.org/10.1109/THMS.2015.2470657"
    }
  ],
  claruRelevance: "Hand-object interaction annotation is one of the most labor-intensive data tasks in physical AI, requiring annotators who can distinguish grasp types, identify contact transitions at frame-level precision, and correct 3D hand pose estimates under occlusion. Claru's annotation teams are trained on the GRASP taxonomy and our egocentric video collection infrastructure captures diverse hand-object interactions across 100+ real-world environments -- kitchens, workshops, offices, and retail settings. We run HaMeR-based pre-annotation in-house and deliver corrected 21-keypoint hand pose, per-finger contact labels, grasp-type classification, and temporal action segmentation with inter-annotator kappa scores exceeding 0.80. For teams building hand-to-robot retargeting pipelines or training manipulation policies from human demonstration video, Claru delivers ready-to-train datasets in RLDS or HDF5 format with dataloaders and visualization scripts included.",
};

export default data;
