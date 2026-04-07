import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-build-an-object-tracking-dataset",
  metaTitle: "How to Build an Object Tracking Dataset (2026 Guide) | Claru",
  metaDescription: "Step-by-step guide to building object tracking datasets for robotics, covering multi-object annotation, temporal consistency, occlusion handling, and evaluation.",
  primaryKeyword: "how to build an object tracking dataset",
  secondaryKeywords: ["object tracking dataset creation", "multi-object tracking annotation", "MOT dataset robotics", "visual object tracking training data"],
  canonicalPath: "/guides/how-to-build-an-object-tracking-dataset",
  h1: "How to Build an Object Tracking Dataset",
  heroSubtitle: "Step-by-step guide to building object tracking datasets for robotics applications, covering bounding box and mask annotation, temporal ID consistency, occlusion labeling, and benchmark-ready evaluation splits.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Build an Object Tracking Dataset", href: "/guides/how-to-build-an-object-tracking-dataset" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Object Tracking Datasets Matter for Robotics",
      paragraphs: [
        "Object tracking is the backbone of real-time scene understanding for any robot operating in dynamic environments. Unlike static object detection that processes each frame independently, tracking maintains persistent object identities across time — enabling a robot to reason about object permanence, predict motion trajectories, and coordinate manipulation sequences that involve multiple objects.",
        "Modern tracking-by-detection pipelines (ByteTrack, BoT-SORT) achieve impressive results on surveillance and autonomous driving benchmarks, but robotics tracking has unique requirements: objects are manipulated by the robot itself (causing extreme appearance changes), camera viewpoints shift as the robot moves, and scenes contain heavy occlusion from cluttered workspaces. Building a domain-specific tracking dataset that captures these challenges is essential for deploying reliable perception in real-world robotic systems.",
        "The investment in a well-constructed tracking dataset pays dividends across the perception stack: object tracking feeds into grasp planning (which object to grasp next), task progress monitoring (has the robot placed all items?), and safety systems (tracking humans and obstacles in the workspace)."
      ]
    },
    {
      type: "stats",
      heading: "Object Tracking Dataset Benchmarks",
      stats: [
        { value: "50+", label: "Video sequences (minimum recommended)" },
        { value: "50K-100K", label: "Annotated frames for a usable dataset" },
        { value: "0.85+", label: "Target inter-annotator IoU" },
        { value: "5-10x", label: "Speed gain with bounding boxes vs. masks" },
        { value: "50-70%", label: "Annotation time saved by pre-annotations" },
        { value: "90+", label: "Target MOTA for inter-annotator agreement" }
      ]
    },
    {
      type: "cards",
      heading: "Common Tracking Annotation Failure Modes",
      cards: [
        {
          title: "ID Switches at Occlusions",
          description: "When objects pass behind each other, annotators sometimes swap their track IDs. Use appearance-based checks (ReID embeddings) to detect sudden feature changes within a track."
        },
        {
          title: "Inconsistent Box Tightness",
          description: "Some annotators draw tight boxes, others leave padding. Define a 0-5% padding standard and run automated checks on box-to-object boundary alignment."
        },
        {
          title: "Missing Small Objects",
          description: "Objects under 32x32 pixels are frequently missed during annotation. Use a detection model to flag frames where more objects are visible than annotated."
        },
        {
          title: "Ghost Tracks on Backgrounds",
          description: "Annotators occasionally create tracks on static background features or shadows. Validate by checking for zero-motion tracks that persist beyond 30 frames."
        }
      ]
    },
    {
      type: "comparison-table",
      heading: "Tracking Annotation Formats Compared",
      description: "Choose the output format based on your downstream tracking model and evaluation tools.",
      columns: ["Format", "Best For", "Tool Support", "Instance Support"],
      rows: [
        { "Format": "MOT Challenge CSV", "Best For": "Multi-object tracking evaluation", "Tool Support": "py-motmetrics, TrackEval", "Instance Support": "Track IDs per row" },
        { "Format": "COCO Video JSON", "Best For": "Detection + tracking combined", "Tool Support": "pycocotools, Detectron2", "Instance Support": "Instance + track IDs" },
        { "Format": "TAO Format", "Best For": "Long-tail category tracking", "Tool Support": "tao-toolkit", "Instance Support": "Federated categories" },
        { "Format": "Custom HDF5", "Best For": "Robot-specific pipelines", "Tool Support": "h5py, custom loaders", "Instance Support": "Flexible per-project" }
      ]
    },
    {
      type: "prose",
      heading: "Scaling Tracking Annotation with Model-Assisted Pipelines",
      paragraphs: [
        "For datasets exceeding 10,000 frames, purely manual annotation becomes prohibitively expensive. Model-assisted annotation pipelines use a pretrained detector (YOLOv8x or RT-DETR) to generate per-frame detections, then a tracker (ByteTrack or BoT-SORT) to assign preliminary track IDs. Human annotators then correct rather than create — fixing missed detections, adjusting box boundaries, and correcting ID switches at occlusion points.",
        "The key to effective model-assisted pipelines is calibrating pre-annotation quality. Pre-annotations that are 70-85% correct hit the sweet spot: enough correct predictions to save time, but enough errors to keep annotators engaged. If pre-annotations exceed 90% accuracy, annotators develop 'acceptance bias' and stop checking carefully. If they fall below 60%, annotators lose trust and start redrawing from scratch, negating the speed benefit.",
        "Include attention checks in the pipeline: deliberately inject a few frames where the detector missed obvious objects, and track whether annotators catch them. This measures annotator vigilance and provides an ongoing quality signal throughout the annotation campaign. Flag any annotator who misses more than 30% of attention checks for retraining.",
        "For video tracking specifically, SAM 2's video propagation mode can generate segmentation masks on intermediate frames from keyframe annotations, but this only helps if your downstream model needs masks rather than boxes. For box-only annotation, the keyframe-interpolation workflow in CVAT (annotate every 5th frame, linear interpolation between) is the most time-efficient approach, reducing manual annotation effort by 60-70%."
      ]
    }
  ],
  faqs: [
    {
      question: "Should I annotate with bounding boxes or segmentation masks for tracking?",
      answer: "Bounding boxes are 5-10x faster to annotate and sufficient for most tracking algorithms (SORT, DeepSORT, ByteTrack, BoT-SORT). Use bounding boxes if your downstream model outputs detections as boxes and tracks them via association. Segmentation masks are needed when your application requires precise object boundaries, such as robotic grasping where the gripper pose depends on the exact object shape, or when objects frequently overlap and box-level annotation cannot distinguish between them. The annotation cost difference is substantial: experienced annotators produce 800-1,200 bounding box annotations per hour using interpolation tools (annotate every 5th frame, interpolate between), but only 100-200 segmentation mask annotations per hour even with SAM2-assisted pre-annotation. A practical middle ground is to annotate all frames with bounding boxes and add segmentation masks only on keyframes (every 10th-30th frame), which gives tracking algorithms box-level supervision for association and mask-level supervision for appearance modeling."
    },
    {
      question: "How do I maintain consistent object IDs across occlusions?",
      answer: "Occlusion handling is the hardest aspect of tracking annotation and the primary source of annotator errors. Establish explicit rules: when an object is partially occluded (more than 50% visible), continue the same track ID and annotate the visible portion. When an object is fully occluded (0% visible), mark the track as occluded in the annotation but maintain the ID assignment for when it reappears. Use the visibility attribute with four levels: fully visible, partially occluded (25-75% visible), mostly occluded (less than 25% visible), and fully occluded. Provide annotators with a reference sheet showing example images for each occlusion level. The critical pitfall is ID switches: when object A passes behind object B and reappears on the other side, naive annotators sometimes swap the IDs. Prevent this by requiring annotators to track appearance features (color, size, distinctive markings) and by including an automated consistency check that flags any track where the appearance embedding (computed via a ReID model like BoT-SORT's feature extractor) changes suddenly between consecutive visible frames."
    },
    {
      question: "What frame rate should I annotate at for tracking datasets?",
      answer: "Annotate at the frame rate your tracking algorithm will process, typically 10-30 FPS. Lower rates reduce annotation cost but increase the difficulty of association between frames (objects move further between consecutive annotations). For slow-moving robotic manipulation scenarios where objects move at under 5 cm/s, annotating at 5-10 FPS is sufficient because objects barely move between frames. For fast-moving scenarios (objects thrown, robot arms sweeping quickly, outdoor mobile robots), annotate at 15-30 FPS to keep inter-frame displacement below 20-30 pixels, which is the comfortable range for appearance-based trackers. A cost-effective approach is to annotate keyframes at 2-5 FPS manually, then use linear interpolation for intermediate frames, followed by a correction pass where annotators review and adjust the interpolated annotations at full frame rate. This reduces manual annotation effort by 60-70% while maintaining sub-pixel accuracy on non-occluded linear-motion segments. CVAT and Label Studio both support this keyframe-interpolation workflow natively."
    },
    {
      question: "How many tracks and frames do I need for a useful tracking dataset?",
      answer: "The MOT Challenge benchmarks provide useful reference points. MOT17 contains approximately 11,000 frames with 2,300 unique tracks and has been the standard evaluation benchmark for years. TAO (Tracking Any Object) contains 2,907 videos with 17,287 tracks across 833 categories. For a domain-specific robotics tracking dataset, aim for at least 50 video sequences totaling 50,000-100,000 annotated frames with 500-2,000 unique track IDs. More important than raw size is diversity along key axes: number of simultaneous objects per frame (include scenes with 2-5, 5-15, and 15-50 objects), occlusion frequency (at least 30% of sequences should contain significant occlusion events), object size variation (small objects under 32x32 pixels, medium 32-96 pixels, large over 96 pixels), and camera motion (static, slow pan, fast ego-motion). Track your coverage across these axes and identify gaps before scaling production annotation."
    },
    {
      question: "How do I evaluate the quality of my tracking annotations?",
      answer: "Run three evaluation methods. First, measure inter-annotator agreement by having two independent annotators label the same 10-15 video sequences, then compute the MOTA (Multiple Object Tracking Accuracy) and IDF1 (Identity F1) scores treating one annotator as ground truth and the other as the prediction. MOTA above 85 and IDF1 above 80 indicate good agreement. Second, run an automated consistency check: for each track, compute the frame-to-frame IoU (Intersection over Union) between consecutive bounding boxes. Any jump where IoU drops below 0.3 between adjacent frames (and the object was not flagged as occluded) indicates a likely annotation error, such as a box that slipped to the wrong object or a sudden size change. Third, train a simple tracker (ByteTrack with a YOLO detector) on your annotations and evaluate it on a held-out split. If the tracker achieves MOTA within 10 points of human inter-annotator agreement, the annotations are internally consistent. If the gap is larger, there are systematic annotation errors that the tracker is learning to reproduce."
    }
  ],
  ctaHeading: "Need Help With This?",
  ctaDescription: "Talk to a Claru specialist about your object tracking annotation and dataset requirements.",
  relatedGlossaryTerms: ["object-tracking", "bounding-box-annotation", "instance-segmentation"],
  relatedGuidePages: ["how-to-create-temporal-annotations-for-video"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  difficulty: "intermediate",
  estimatedTime: "2-4 weeks",
  prerequisites: ["Video data (30+ sequences at 10-30 FPS)", "Annotation platform (CVAT, Label Studio, or Supervisely)", "Python 3.9+ for evaluation scripts", "Object category taxonomy defined"],
  tools: ["CVAT", "Label Studio", "SAM2", "ByteTrack", "py-motmetrics", "FFmpeg", "OpenCV"],
  steps: [
    {
      stepNumber: 1,
      title: "Define Tracking Taxonomy and Annotation Specification",
      description: "Before any annotation begins, precisely define what gets tracked, how it gets labeled, and what metadata each track carries. Create an object category taxonomy that lists every trackable class relevant to your domain. For a kitchen robotics application, this might include: mug, plate, bowl, knife, spatula, cutting_board, food_item (with sub-categories for fruits, vegetables, proteins), hand_left, hand_right, and appliance. For warehouse robotics: box, pallet, forklift, worker, shelf, conveyor_item. Keep the taxonomy to 10-30 categories to maintain annotator accuracy. Each category needs a clear visual definition with 5-10 example images showing borderline cases.\n\nDefine the annotation format: axis-aligned bounding boxes (x, y, width, height) in MOT Challenge format, or rotated bounding boxes (x, y, width, height, angle) for elongated objects that benefit from tight fits, or segmentation masks in COCO format with RLE encoding. Specify the track metadata schema: each track has a unique integer ID (persistent across all frames where the object is visible), a category label, per-frame visibility flag (visible, partially occluded, fully occluded, out of frame), and per-frame bounding box or mask coordinates. Define rules for track lifecycle: a new track ID is created when an object first appears in the frame (not when it first exists in the scene). A track is terminated when the object permanently leaves the camera view. If the same object exits and re-enters the frame, it keeps the same ID if the gap is under 30 frames, but receives a new ID if the gap is longer (this matches standard MOT evaluation conventions)."
    },
    {
      stepNumber: 2,
      title: "Prepare Video Data and Generate Pre-Annotations",
      description: "Process your raw video into annotation-ready sequences and generate machine-assisted pre-annotations to accelerate human labeling. Extract videos at the target annotation frame rate using FFmpeg: ffmpeg -i input.mp4 -vf fps=15 -q:v 2 frames/%06d.jpg. Organize sequences into a directory structure that matches your annotation tool's expected format. For CVAT, create a task per video sequence with frames uploaded in order.\n\nGenerate pre-annotations using a two-stage pipeline. First, run an object detector (YOLOv8x or RT-DETR-L fine-tuned on your category taxonomy) on every frame to produce per-frame detections with class labels and confidence scores. Second, run a tracker (ByteTrack with default parameters: track_thresh=0.5, match_thresh=0.8, track_buffer=30) on the detections to assign preliminary track IDs. Export these pre-annotations in the annotation tool's import format (CVAT XML, Label Studio JSON, or MOT Challenge CSV). Pre-annotations reduce manual annotation time by 50-70% because annotators correct existing boxes rather than drawing from scratch.\n\nCritical pitfall: pre-annotation quality directly impacts annotator behavior. If pre-annotations are mostly correct, annotators tend to accept them without careful inspection, missing subtle errors. If pre-annotations are frequently wrong, annotators lose trust and start ignoring them, negating the speed benefit. Calibrate your detector and tracker on a small test set before generating pre-annotations for the full dataset. The sweet spot is 70-85% precision: enough correct boxes to save time, but enough errors to keep annotators engaged. Include deliberately empty frames (where the detector missed obvious objects) as attention checks to verify annotators are not blindly accepting pre-annotations."
    },
    {
      stepNumber: 3,
      title: "Execute Multi-Pass Annotation with Quality Controls",
      description: "Structure annotation as a three-pass process: spatial annotation, temporal linking, and quality review. In the first pass (spatial), annotators draw or adjust bounding boxes on keyframes spaced 5-10 frames apart, ensuring tight fits around each object. In CVAT, use the Track mode which automatically enables linear interpolation between keyframes. Annotators should adjust the box on any frame where the interpolated position deviates from the true object position by more than 10% of the object size. This pass produces per-frame boxes with approximate track IDs.\n\nIn the second pass (temporal linking), a specialized annotator reviews each track's temporal consistency. They verify that the same physical object maintains the same track ID across the full sequence, correct any ID switches at occlusion boundaries, and fill in visibility flags for occluded frames. This pass is best performed by watching the video at 2-4x speed with track IDs overlaid on the visualization. Assign this pass to your most experienced annotators because temporal consistency errors (ID switches) are harder to detect and more damaging to tracker training than spatial inaccuracy.\n\nIn the third pass (quality review), a senior annotator or QA specialist reviews a stratified 15-20% sample of the annotated sequences. They check for: boxes that are consistently too loose or too tight (more than 15% padding or cutting into the object), ID switches at occlusion events, missing tracks (objects present in the frame but not annotated), ghost tracks (annotations on locations where no object exists), and incorrect category labels. Compute per-annotator error rates from this review and use them to weight annotator compensation and assign retraining. Target an error rate below 5% of boxes per frame after the three-pass process. Any sequence with an error rate above 10% should be fully re-annotated rather than patched."
    },
    {
      stepNumber: 4,
      title: "Handle Occlusion, Re-Identification, and Edge Cases",
      description: "Occlusion events are the highest-value annotations in a tracking dataset because they test the tracker's ability to maintain identity through visual disappearance. Develop detailed annotation guidelines for each occlusion scenario and verify compliance through targeted audits.\n\nFor partial occlusion (object still partially visible): annotate the visible portion of the object. If using bounding boxes, draw the box around the full estimated extent of the object including the occluded region, and set the visibility flag to partially_occluded. If using masks, annotate only the visible pixels. This distinction matters because some trackers use the estimated full bounding box for association while others use only the visible mask for appearance matching.\n\nFor full occlusion (object completely hidden behind another object): cease annotating the bounding box or mask, set the visibility flag to fully_occluded, and crucially maintain the track ID in the annotation metadata so that when the object reappears, it can be re-linked. Provide annotators with a playhead that shows upcoming frames so they can anticipate where the object will reappear and maintain the correct ID.\n\nFor out-of-frame events: when an object moves outside the camera's field of view, set the visibility flag to out_of_frame. If the object re-enters within 30 frames (1-2 seconds at 15-30 FPS), reuse the same track ID. For longer absences, create a new track ID. Document this threshold in the annotation spec because it directly affects IDF1 evaluation scores.\n\nFor object state changes: some objects change appearance during tracking (a box being opened, a mug being filled, food being cut). Maintain the same track ID through appearance changes as long as the physical object remains the same entity. Add an appearance_change event annotation at the frame where the change occurs. These annotations are particularly valuable for training re-identification features in tracking models."
    },
    {
      stepNumber: 5,
      title: "Validate Annotations with Automated Metrics",
      description: "Run a battery of automated consistency checks before finalizing the dataset. These checks catch errors that human review misses and provide quantitative quality scores for the entire dataset.\n\nTemporal consistency check: for every track, compute IoU between the bounding box on frame t and frame t+1. Flag any instance where IoU drops below 0.5 between consecutive frames and the object is not flagged as occluded. This catches box jumps, ID switches, and annotation gaps. For a 10,000-frame dataset with 50 tracks, expect 2-5% of frame transitions to be flagged; review each flag and correct genuine errors.\n\nSize consistency check: compute the bounding box area for each track over time and flag sudden size changes exceeding 50% between consecutive frames (excluding occlusion transitions). Objects in real video change size gradually due to camera motion and perspective, so sudden jumps indicate the box snapped to a different object or the annotator made an error.\n\nCategory consistency check: for each track, verify that the category label does not change across frames (it should not, since a mug does not become a plate). Any track with inconsistent categories has an ID switch embedded in it.\n\nCoverage check: count the number of distinct objects visible in each frame (using a reference detector or manual count on a sample) and compare against the number of annotated tracks. Coverage should exceed 95%. Frames with significantly lower coverage contain missed annotations.\n\nCompute aggregate quality metrics for the full dataset: mean boxes per frame, mean track length, occlusion event frequency, ID consistency score (fraction of tracks that pass the temporal consistency check), and category distribution. Publish these metrics in the dataset card. They serve as the contract between annotation and model training teams."
    },
    {
      stepNumber: 6,
      title: "Format for Evaluation and Training Pipelines",
      description: "Export the validated annotations in standard tracking formats and generate evaluation-ready splits. The MOT Challenge format is the most widely adopted: a single CSV file per sequence with columns (frame_id, track_id, x, y, w, h, confidence, class_id, visibility). This format is directly compatible with py-motmetrics for MOTA/IDF1/HOTA evaluation and with most tracking libraries (mmtracking, TrackEval, norfair). For COCO-style evaluation, export annotations as a COCO JSON with the video_annotations extension that includes track_id per annotation.\n\nGenerate train/validation/test splits by held-out video sequences, not by sampling frames from the same videos. Hold out 15-20% of sequences for testing, ensuring the test set covers the full range of difficulty: include at least 2 easy sequences (few objects, no occlusion), 3 medium sequences (moderate object count, some occlusion), and 2 hard sequences (dense objects, frequent occlusion, fast motion). Create a splits.json manifest documenting the assignment.\n\nPackage the dataset with evaluation infrastructure. Include a Python evaluation script that loads predictions in MOT format, computes MOTA, IDF1, HOTA, MT (mostly tracked), ML (mostly lost), and FP/FN/ID-switch counts per sequence and averaged across the dataset. Include a visualization script that renders tracking results as color-coded bounding boxes overlaid on video frames, with track IDs displayed, exported as MP4 for easy review. Include a baseline: run ByteTrack with a YOLO detector on the test set and report the numbers, so downstream users have a concrete performance reference point. The dataset card should document: total frames, total tracks, frames per second, object categories, annotation type (box vs. mask), occlusion statistics, and the evaluation protocol (which metrics are primary, how confidence thresholds are handled)."
    }
  ],
  keyPapers: [
    {
      id: "zhang-bytetrack-2022",
      title: "ByteTrack: Multi-Object Tracking by Associating Every Detection Box",
      authors: "Zhang et al.",
      venue: "ECCV 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2110.06864"
    },
    {
      id: "luiten-hota-2021",
      title: "HOTA: A Higher Order Metric for Evaluating Multi-Object Tracking",
      authors: "Luiten et al.",
      venue: "IJCV 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2009.07736"
    },
    {
      id: "dave-tao-2020",
      title: "TAO: A Large-Scale Benchmark for Tracking Any Object",
      authors: "Dave et al.",
      venue: "ECCV 2020",
      year: 2020,
      url: "https://arxiv.org/abs/2005.10356"
    },
    {
      id: "aharon-bot-sort-2022",
      title: "BoT-SORT: Robust Associations Multi-Pedestrian Tracking",
      authors: "Aharon et al.",
      venue: "arXiv 2206.14651",
      year: 2022,
      url: "https://arxiv.org/abs/2206.14651"
    }
  ],
  claruRelevance: "Claru provides production-grade object tracking annotation for robotics datasets, with annotators trained on multi-object temporal consistency, occlusion handling, and re-identification. Our three-pass annotation workflow (spatial, temporal linking, QA review) achieves inter-annotator MOTA agreement above 90. We deliver in MOT Challenge, COCO, and custom formats with automated quality metrics and baseline evaluation results included.",
};

export default data;
