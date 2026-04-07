import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-create-temporal-annotations-for-video",
  metaTitle: "How to Create Temporal Annotations for Video Data (2026 Guide) | Claru",
  metaDescription: "Step-by-step guide to temporal video annotation for robotics — covering action segmentation, phase labeling, hierarchical activity parsing, and quality validation with inter-annotator agreement.",
  primaryKeyword: "how to create temporal annotations for video data",
  secondaryKeywords: ["temporal video annotation","action segmentation annotation","video activity labeling","temporal boundary labeling","video phase annotation robotics"],
  canonicalPath: "/guides/how-to-create-temporal-annotations-for-video",
  h1: "How to Create Temporal Annotations for Video Data",
  heroSubtitle: "Step-by-step guide to creating temporal annotations for video datasets used in robot learning — covering action boundary segmentation, hierarchical activity labeling, and validation with inter-annotator agreement metrics.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Create Temporal Annotations for Video Data", href: "/guides/how-to-create-temporal-annotations-for-video" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Temporal Annotations Are Critical for Robot Learning from Video",
      paragraphs: [
        "Raw video is dense, redundant, and unstructured. Temporal annotations transform video into structured training signal by segmenting continuous footage into discrete, labeled action segments with precise boundaries. This structure is essential for training action segmentation models, skill-based robot policies, hierarchical planners, and video language models.",
        "The challenge of temporal annotation lies in boundary precision. Unlike spatial annotation where object boundaries are visually obvious, action boundaries are often gradual transitions — when exactly does 'reaching' become 'grasping'? Inconsistent boundary definitions between annotators create noisy labels that degrade model performance. The key to high-quality temporal annotations is a rigorous annotation protocol with explicit boundary rules, calibration rounds to align annotators, and continuous agreement monitoring.",
        "This guide covers the full temporal annotation pipeline from taxonomy design through tool configuration, annotator calibration, production annotation with quality controls, and export for action segmentation model training."
      ]
    },
    {
      type: "stats",
      heading: "Temporal Annotation Benchmarks",
      stats: [
        { value: "8-15 min", label: "Annotation time per minute of video (fine-grained)" },
        { value: "0.75+", label: "Target Cohen's kappa for action labels" },
        { value: "<200ms", label: "Target boundary precision between annotators" },
        { value: "8-15", label: "Recommended Level 2 action classes" },
        { value: "2-5x", label: "Sparse-then-propagate speed vs. per-frame labeling" },
        { value: "10-20x", label: "Speed gain from boundary-only annotation" }
      ]
    },
    {
      type: "comparison-table",
      heading: "Temporal Annotation Tools Compared",
      columns: ["Tool", "Best For", "Multi-Tier Labels", "Collaboration", "Learning Curve"],
      rows: [
        { "Tool": "ELAN", "Best For": "Dense multi-tier linguistic annotation", "Multi-Tier Labels": "Excellent (unlimited tiers)", "Collaboration": "Limited (file-based)", "Learning Curve": "Steep" },
        { "Tool": "CVAT", "Best For": "Combined spatial + temporal annotation", "Multi-Tier Labels": "Good (label groups)", "Collaboration": "Good (web-based, Docker)", "Learning Curve": "Moderate" },
        { "Tool": "Label Studio", "Best For": "Customizable annotation interfaces", "Multi-Tier Labels": "Good (configurable)", "Collaboration": "Good (web-based)", "Learning Curve": "Moderate" },
        { "Tool": "Labelbox", "Best For": "Large-scale managed annotation", "Multi-Tier Labels": "Good", "Collaboration": "Excellent (managed workforce)", "Learning Curve": "Low" }
      ]
    },
    {
      type: "cards",
      heading: "Keys to Consistent Temporal Annotation",
      cards: [
        {
          title: "Observable State Changes Only",
          description: "Define boundaries using visible physical events (hand contacts object, object lifts off surface) rather than inferred intent. This makes boundaries unambiguous and reproducible."
        },
        {
          title: "Calibration Rounds Before Production",
          description: "Have all annotators independently label 10 reference videos, then review disagreements together. Expect 10-20% agreement improvement after calibration. Repeat periodically."
        },
        {
          title: "Transition Validity Rules",
          description: "Define which action-to-action transitions are physically possible. Automated checks flag impossible transitions (e.g., 'place' after 'reach' without 'grasp') as annotation errors."
        },
        {
          title: "Minimum Duration Thresholds",
          description: "Actions shorter than 0.3 seconds are difficult to annotate consistently and may indicate boundary errors. Flag sub-threshold segments for review."
        }
      ]
    },
    {
      type: "prose",
      heading: "Scaling Temporal Annotation with Model-Assisted Pre-Segmentation",
      paragraphs: [
        "For datasets exceeding 100 hours of video, purely manual temporal annotation becomes prohibitively expensive at 8-15 minutes per minute of video. Model-assisted pre-segmentation reduces this cost by 50-70%. Run a pretrained action segmentation model (MS-TCN++ or ASFormer, trained on a related dataset like EPIC-KITCHENS or Breakfast) on your raw video to generate initial temporal segmentations. Human annotators then correct the model's predictions rather than annotating from scratch.",
        "The quality of pre-segmentations depends heavily on domain similarity between the pretraining data and your target videos. Kitchen activity videos pre-segmented by an EPIC-KITCHENS-trained model will be 60-80% correct. Industrial manipulation videos may only be 30-40% correct if no similar training data exists. Calibrate by running the pre-segmentation model on your 10-video calibration set and measuring frame-level accuracy against the gold standard annotations.",
        "When pre-segmentation accuracy exceeds 60%, annotators save time by correcting boundaries rather than placing them. When accuracy is below 40%, annotators find it faster to ignore the pre-segmentation and annotate from scratch. In the middle zone (40-60%), provide both the pre-segmented timeline and a clean timeline, letting each annotator choose their preferred starting point.",
        "An emerging approach uses vision-language models (Gemini, GPT-4V) to generate coarse temporal narrations from video frames, which are then parsed into structured action labels. This 'caption-then-parse' pipeline works well for Tier 1 (activity-level) annotations but lacks the temporal precision needed for Tier 2 (action-level) boundary annotation. Use VLM-generated narrations as a pre-labeling signal that helps annotators identify which action classes are present, while still requiring human precision for boundary placement."
      ]
    }
  ],
  faqs: [
    {
      question: "What is the difference between temporal annotation, action segmentation, and activity recognition?",
      answer: "These terms describe different levels of temporal understanding. Temporal annotation is the broad term for any time-stamped label on video data. Action segmentation assigns a class label to every frame of a video (dense labeling), producing frame-level predictions like 'reaching', 'grasping', 'lifting', 'transporting', 'placing' for each timestep. Activity recognition classifies an entire video clip (or a trimmed segment) into a single activity class like 'pick and place' or 'pour liquid'. For robotics training data, action segmentation is more valuable because it provides fine-grained temporal structure that models can use for skill decomposition and subtask sequencing. A third variant, temporal action detection, identifies the start and end times of action instances within untrimmed video without labeling every frame. Your choice depends on the downstream model: video foundation models typically need action segmentation labels, while reward models for RL may only need activity-level labels with success/failure annotations."
    },
    {
      question: "How should I define action boundaries in temporal annotations?",
      answer: "Action boundaries are the most contentious aspect of temporal annotation because transitions between actions are often gradual rather than instantaneous. Define boundaries using observable physical state changes, not inferred intent. For manipulation tasks, use these conventions: a 'reach' action starts when the hand/gripper begins moving toward the target object and ends when contact is first established. 'Grasp' starts at first contact and ends when the object is securely held (no relative motion between gripper and object for 3+ frames). 'Transport' starts when the object begins moving from its initial position and ends when the gripper reaches the vicinity of the target location (within 5cm). 'Place' starts at the approach to the target location and ends when the object is released and the gripper opens. These conventions should be codified in an annotation guide with frame-level visual examples showing the exact boundary frames. Test boundary definitions with 3 annotators on 10 videos and compute the mean absolute boundary displacement — if it exceeds 5 frames at 30 fps (167ms), the definition needs tightening."
    },
    {
      question: "How do I measure inter-annotator agreement for temporal annotations?",
      answer: "Use multiple metrics because no single metric captures all aspects of agreement. Frame-level agreement: compute Cohen's kappa or Fleiss' kappa (for >2 annotators) on per-frame class labels. Target: kappa > 0.75 for action segmentation of manipulation tasks. Segmental F1 score: compute the F1 score at the segment level — a predicted segment matches a ground truth segment if they overlap by more than 50% (or 25% for short actions). This metric is more lenient on boundary jitter than frame-level metrics. Edit distance (Levenshtein distance): compare the ordered sequence of action labels, ignoring exact timing. Low edit distance with high frame-level disagreement suggests annotators agree on the action sequence but disagree on exact boundaries. Boundary precision: for each annotator pair, compute the mean absolute difference in boundary timestamps for matching action transitions. Target: <200ms (6 frames at 30 fps) for manipulation tasks. Report all four metrics in your dataset documentation, as they reveal different types of annotator disagreement."
    },
    {
      question: "What annotation tools work best for temporal video annotation?",
      answer: "ELAN (by the Max Planck Institute) is the gold standard for linguistic and behavioral temporal annotation — it supports multiple parallel tiers, frame-level precision, and exports to CSV/XML. However, its learning curve is steep and it lacks built-in collaboration features. CVAT's video annotation mode supports temporal segments with class labels and is easier to deploy for teams (Docker-based, web UI). Label Studio supports video timeline annotation with customizable labeling interfaces. For large-scale production annotation, Labelbox and Scale AI offer managed temporal annotation workflows with built-in quality management and workforce. For programmatic annotation (model-assisted), use PyAnnote for audio-visual diarization or build custom annotation UIs with Streamlit and OpenCV — display the video with a timeline scrubber, let annotators click to place boundary markers, and store annotations as a list of (start_frame, end_frame, label) tuples. Regardless of tool, export annotations as a standardized JSON or CSV format: one row per segment with video_id, start_time, end_time, start_frame, end_frame, label, and annotator_id."
    },
    {
      question: "Should I annotate every frame or just key boundaries?",
      answer: "Annotate boundaries (sparse annotation) and then propagate to dense frame-level labels automatically. Having annotators label every frame individually is prohibitively slow (a 1-minute video at 30 fps has 1,800 frames) and introduces inconsistency because annotators cannot maintain attention to individual frame differences over long videos. The efficient workflow is: (1) annotator watches the full video once at 1x speed to understand the activity, (2) on a second pass at 0.5x speed, they place boundary markers at each action transition, (3) they assign class labels to the segments between boundaries. This takes 2-5x the video duration for a trained annotator. The boundary timestamps are then programmatically expanded into dense frame-level labels by assigning each frame the label of its containing segment. For frames exactly at boundaries, assign to the following segment (convention: boundaries mark the start of new actions). This sparse-then-propagate approach is 10-20x faster than per-frame labeling and produces more consistent annotations because annotators focus on the semantically meaningful transitions rather than redundant frame-by-frame decisions."
    }
  ],
  ctaHeading: "Need Temporal Video Annotation?",
  ctaDescription: "Claru provides temporal annotation for robotics and activity recognition datasets. Our annotators are trained in action boundary labeling for manipulation, navigation, and human activity video.",
  relatedGlossaryTerms: ["temporal-annotation","action-segmentation","activity-annotation","optical-flow"],
  relatedGuidePages: ["how-to-collect-egocentric-video-data","how-to-annotate-hand-object-interactions"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  difficulty: "intermediate",
  estimatedTime: "1-3 weeks",
  prerequisites: ["Video dataset with consistent frame rate","Defined action/activity taxonomy","Annotation tool (ELAN, CVAT, or Label Studio)","Python 3.10+ with pandas, NumPy, and OpenCV"],
  tools: ["ELAN","CVAT","Label Studio","Python","pandas","NumPy","OpenCV","scikit-learn (for agreement metrics)"],
  steps: [
    {
      stepNumber: 1,
      title: "Define the Action Taxonomy and Temporal Granularity",
      description: "The action taxonomy defines what labels annotators will assign to temporal segments. For robotics video, design a hierarchical taxonomy with 2-3 levels that captures both coarse activities and fine-grained actions. Level 1 (activity): the high-level task, e.g., 'make_coffee', 'set_table', 'pick_and_place'. Level 2 (action): individual manipulation primitives within the activity, e.g., 'reach', 'grasp', 'lift', 'transport', 'place', 'release', 'retract'. Level 3 (optional, sub-action): finer distinctions, e.g., 'power_grasp' vs. 'precision_grasp', 'push_slide' vs. 'push_topple'.\n\nFor the EPIC-KITCHENS-style annotation used in egocentric video research, actions are decomposed into verb-noun pairs: the verb captures the motion primitive ('pick_up', 'put_down', 'pour', 'cut', 'stir') and the noun captures the interacted object ('mug', 'plate', 'knife'). This decomposition is powerful for models that learn compositional task understanding but requires annotators to label both the temporal segment and the interacted objects.\n\nChoose a temporal granularity that matches your downstream model's capabilities. For action segmentation models (MS-TCN, ASFormer), annotate at the individual action level (Level 2) with boundaries at every primitive transition — these models operate at 1-5 fps on the action label space. For video language models that process longer contexts, activity-level (Level 1) annotation with start/end times may suffice. For skill-based robot learning (options framework, skill primitives), Level 2 action annotation is essential because each action segment maps to a learned skill. Write a taxonomy document with a visual example for each label showing 3-5 video frames around the characteristic moment of that action. Include transition rules: which action-to-action transitions are valid (e.g., 'grasp' can only follow 'reach' or 'adjust_grasp', never 'transport').",
      tools: ["Taxonomy design document (Markdown or Notion)", "Video frame extraction (ffmpeg)"],
      tips: ["Limit Level 2 to 8-15 action classes — more classes exponentially increase annotator disagreement without proportionally increasing model performance"]
    },
    {
      stepNumber: 2,
      title: "Configure the Annotation Tool and Workflow",
      description: "Set up your annotation tool for efficient temporal labeling. For ELAN: create a template (.etf) file with controlled vocabulary tiers for each annotation level. Define one tier per taxonomy level (Activity, Action, Object) with a controlled vocabulary entry for each class. Set the time resolution to match your video frame rate — for 30 fps video, set ELAN's time step to 33ms. Enable waveform display for any audio tracks, as sound cues (contact sounds, motor noise) help annotators identify action boundaries. For CVAT: create a project with 'Video' type, add labels corresponding to your action taxonomy, and configure the timeline annotation mode. For Label Studio: use the 'Video timeline labeling' template and configure label groups for each taxonomy level.\n\nDesign the annotation workflow as a two-pass process. Pass 1 (coarse segmentation): the annotator watches the video at 1x speed and places approximate boundary markers at every action transition, assigning preliminary labels. This pass takes 1-2x the video duration and captures the overall temporal structure. Pass 2 (boundary refinement): the annotator reviews each boundary at 0.25-0.5x speed, frame-steps (arrow keys in ELAN, or frame-by-frame mode in CVAT) to find the exact transition frame, and corrects any label errors from Pass 1. This pass takes 1-3x the video duration depending on the density of transitions.\n\nFor production-scale annotation (100+ hours of video), implement a three-stage pipeline: Stage 1 annotators do Pass 1+2, Stage 2 reviewers check every annotation for boundary precision and label correctness (accepting, correcting, or rejecting each segment), and Stage 3 adjudicators resolve disagreements between Stage 1 and Stage 2 on rejected segments. This pipeline costs approximately 8-12x the video duration in total annotator time but produces research-grade annotations.",
      tools: ["ELAN", "CVAT", "Label Studio", "ffmpeg (for video preparation)"],
      tips: ["Pre-segment videos into 5-10 minute clips for annotation sessions — annotator attention degrades after 15 minutes of continuous temporal labeling"]
    },
    {
      stepNumber: 3,
      title: "Execute Annotation with Calibration Rounds",
      description: "Before full-scale annotation, run calibration rounds to align annotator understanding and establish quality baselines. Select 10 representative videos (covering all activity types and difficulty levels) as the calibration set. Have all annotators independently annotate the same 10 videos. Compute inter-annotator agreement using four metrics: frame-level Cohen's kappa, segmental F1 at 50% overlap, mean boundary displacement in frames, and edit distance between the action sequence transcripts.\n\nReview disagreements in a group calibration session. Project the annotated videos on screen and walk through every boundary where annotators disagree by more than 5 frames. Discuss the reasoning, identify ambiguous cases, and update the annotation guidelines with specific rulings for each ambiguity pattern. Common sources of disagreement include: the exact frame where 'reach' transitions to 'grasp' (resolve by defining 'grasp starts at first frame where gripper contacts object, visible as deformation or no relative motion'), whether a brief pause during transport constitutes a separate 'hold' action (resolve by setting a minimum duration threshold, typically 0.5 seconds), and how to handle simultaneous actions (resolve by defining a priority ordering or using parallel annotation tiers).\n\nAfter the calibration session, have all annotators re-annotate 5 of the 10 calibration videos. Compute agreement again — it should improve by 10-20 percentage points. If any annotator's agreement with the group consensus remains below kappa 0.70, provide additional one-on-one coaching before they contribute to the production dataset. Maintain the 10-video calibration set as an ongoing quality reference: every 100 videos annotated, have each annotator re-annotate one calibration video to detect quality drift over time.",
      tools: ["Python (scikit-learn for kappa computation)", "pandas", "Custom agreement analysis scripts"],
      tips: ["Record the calibration discussion sessions — these recordings are invaluable for training new annotators months later when the original team may have moved on"]
    },
    {
      stepNumber: 4,
      title: "Scale Up Annotation and Monitor Quality",
      description: "Run production annotation with continuous quality monitoring. Divide the video dataset into batches of 50-100 videos. For each batch, assign 80% of videos to single annotators (efficiency) and 20% to double annotation (quality measurement). The double-annotated subset provides an ongoing estimate of annotation quality without the cost of annotating everything twice.\n\nBuild an automated quality dashboard that tracks per-batch metrics: mean segment count per minute of video (sudden drops indicate under-segmentation, where the annotator missed action transitions), mean segment duration distribution (flag outliers — segments shorter than 0.3 seconds or longer than 30 seconds may indicate errors), class distribution (should remain roughly stable across batches unless the video content changes), and boundary precision on the double-annotated subset (mean absolute boundary displacement). Set alerts for: any annotator whose mean boundary displacement exceeds 10 frames (333ms at 30fps), any batch where the class distribution deviates more than 2 standard deviations from the running mean, or any video with no annotated segments (completely forgotten annotation).\n\nImplement automated consistency checks: (1) Transition validity — verify that every action-to-action transition in the annotations is in the set of valid transitions defined in the taxonomy. Flag invalid transitions (e.g., 'place' followed by 'reach' without an intermediate 'release') for review. (2) Temporal coverage — verify that annotations cover the full video duration with no gaps (every frame has a label) and no overlaps (no frame has two labels at the same annotation level). (3) Minimum duration — flag segments shorter than your minimum threshold (typically 0.3 seconds for manipulation actions) as potential annotation errors. These automated checks catch 80% of annotation errors before human review.",
      tools: ["Streamlit dashboard", "pandas", "matplotlib", "scikit-learn"],
      tips: ["Plot a running chart of each annotator's throughput (videos per hour) alongside their agreement scores — throughput that increases while agreement decreases indicates an annotator is rushing"]
    },
    {
      stepNumber: 5,
      title: "Post-Process and Export Annotations",
      description: "After annotation, run a standardized post-processing pipeline to clean, merge, and export the temporal labels. First, resolve double-annotated videos: for the 20% overlap subset, compute segment-level agreement and use the following merge strategy. For segments where both annotators agree on the label and boundaries are within 3 frames: use the average boundary. For segments where labels disagree: send to an adjudicator. For segments where one annotator has a segment the other missed: send to an adjudicator. After adjudication, merge all annotations into a single canonical set.\n\nConvert boundary-based annotations to dense frame-level labels. For each video, create a NumPy array of shape (num_frames,) with integer class labels. Map boundary timestamps to frame indices: frame_idx = round(timestamp_seconds * fps). For hierarchical annotations, create one array per taxonomy level. Handle the 'background' or 'transition' frames explicitly — frames between the end of one action and the start of the next that do not clearly belong to either action. Either assign them to the preceding action (common convention), create a dedicated 'transition' class (used in some action segmentation benchmarks), or leave them unlabeled (less common but more honest about annotation uncertainty).\n\nExport in multiple formats to maximize compatibility: (1) Frame-level CSV: one row per frame with columns video_id, frame_index, timestamp, action_label, activity_label. (2) Segment-level JSON: one object per segment with video_id, start_frame, end_frame, start_time, end_time, label, taxonomy_level. (3) EPIC-KITCHENS format (if applicable): verb_class, noun_class, start_frame, stop_frame per action segment. (4) ActivityNet format: one JSON per video with 'annotations' list containing segment start/end times and labels. Compute and publish dataset statistics: total annotated hours, per-class segment counts and total duration, mean/median segment duration per class, class transition frequency matrix, and the double-annotation agreement metrics.",
      tools: ["NumPy", "pandas", "JSON", "ffmpeg (for timestamp-to-frame mapping)"],
      tips: ["Publish both segment-level and frame-level exports — different downstream models expect different formats, and format conversion is a common source of off-by-one errors"]
    },
    {
      stepNumber: 6,
      title: "Validate with an Action Segmentation Baseline",
      description: "Train a temporal action segmentation model on your annotations to validate that the labels are learnable and internally consistent. Use MS-TCN++ (Multi-Stage Temporal Convolutional Network) or ASFormer as a proven baseline — both are straightforward to set up and train in under 24 hours on a single GPU. Extract per-frame visual features using a pretrained I3D backbone (kinetics-pretrained) or CLIP ViT-B/16 — process each frame (or a 16-frame clip for I3D) through the feature extractor and store the resulting feature vectors as NumPy arrays, one per video.\n\nTrain MS-TCN++ with 4 stages, 10 layers per stage, and 64 filters for 50 epochs on your training split using the standard cross-entropy + truncated mean squared error over the log-probabilities loss. Evaluate on the validation split using three standard metrics: frame-level accuracy (Acc), segmental F1 score at overlaps of {10%, 25%, 50%} (F1@{10,25,50}), and segmental edit distance. For a well-annotated manipulation dataset with 8-12 action classes, expect: Acc > 65%, F1@50 > 55%, and edit distance < 30% of the mean number of segments per video.\n\nIf performance is below these thresholds, analyze the per-class confusion matrix to identify systematically confused action pairs. Common issues: 'reach' and 'retract' are confused because they involve similar arm motion (both are free-space movement of the end-effector) — consider merging them into 'free_motion' or adding a directional feature. Very short actions (<0.5s) have low recall because the temporal model smooths them out — verify these annotations are consistent and consider a minimum duration threshold. If one activity type has dramatically lower performance than others, check whether the annotators who labeled those videos passed calibration. Publish the baseline results with the dataset as a reproducibility reference.",
      tools: ["MS-TCN++ or ASFormer", "I3D or CLIP for feature extraction", "PyTorch", "wandb"],
      tips: ["The segmental edit distance metric is the most informative single number for annotation quality — high edit distance means the model predicts the wrong action sequence, indicating either noisy labels or insufficient data for rare actions"]
    }
  ],
  keyPapers: [
    {
      id: "li-ms-tcn-2020",
      title: "MS-TCN++: Multi-Stage Temporal Convolutional Network for Action Segmentation",
      authors: "Li et al.",
      venue: "TPAMI 2020",
      year: 2020,
      url: "https://arxiv.org/abs/2006.09220"
    },
    {
      id: "yi-asformer-2021",
      title: "ASFormer: Transformer for Action Segmentation",
      authors: "Yi et al.",
      venue: "BMVC 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2110.08568"
    },
    {
      id: "damen-epic-kitchens-2022",
      title: "Rescaling Egocentric Vision: Collection, Pipeline, and Challenges for EPIC-KITCHENS-100",
      authors: "Damen et al.",
      venue: "IJCV 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2006.13256"
    }
  ],
  claruRelevance: "Claru provides temporal video annotation for robotics and activity recognition datasets. Our annotation teams are trained in action boundary labeling for manipulation, navigation, and human activity video, using calibrated workflows that deliver consistent annotations at scale. We handle taxonomy design, annotator calibration, production annotation, quality validation, and delivery in all standard formats.",
};

export default data;
