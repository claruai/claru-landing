import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "temporal-annotation",
  termSlug: "temporal-annotation",
  category: "annotation-types",
  metaTitle: "Temporal Annotation — Definition & Training Data | Claru",
  metaDescription: "Temporal annotation assigns time-aligned labels to video data, marking when events start and end. Learn methods, tools, inter-annotator agreement, and best practices for robotics video datasets.",
  primaryKeyword: "temporal annotation",
  secondaryKeywords: ["time-stamped annotation", "temporal labeling", "video temporal annotation", "temporal segmentation labeling", "frame-level annotation", "event boundary annotation"],
  canonicalPath: "/glossary/temporal-annotation",
  h1: "Temporal Annotation: Definition, Applications, and Training Data Requirements",
  heroSubtitle: "Temporal annotation is the process of assigning time-aligned labels to video data — marking the start and end times of events, actions, states, or other phenomena. Unlike spatial annotation (labeling where things are in an image), temporal annotation labels when things happen in a video sequence. This page covers annotation methods, temporal granularity, inter-annotator agreement on boundaries, and requirements for robotics training data.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Temporal Annotation", href: "/glossary/temporal-annotation" },
  ],
  sections: [],
  faqs: [
    {
      question: "What types of temporal annotations exist for video data?",
      answer: "Temporal annotations span several types with increasing complexity. Clip-level labels assign a single category to an entire pre-segmented video clip (e.g., this 3-second clip shows pouring). Temporal boundary annotations mark the start and end timestamps of events within longer untrimmed videos, producing a timeline of labeled intervals. Frame-level annotations assign a label to every individual frame, creating dense per-frame segmentation of the video timeline. Temporal relation annotations capture ordering and overlap between events (action A happens before action B, or action C overlaps with action D). For robotics, the most common format is temporal boundary annotation with verb-noun action labels — each segment is labeled with what action is being performed and on which object, with precise start and end timestamps.",
    },
    {
      question: "How precise do temporal boundaries need to be for robot learning?",
      answer: "The required temporal precision depends on the downstream application. For activity recognition (classifying what is happening in a clip), boundary precision of plus or minus 0.5 seconds is adequate because the model classifies the overall content, not the exact transition points. For temporal action detection (finding when actions occur in untrimmed video), benchmark evaluation at temporal IoU 0.5 requires boundaries within about 0.25 seconds of ground truth. For robot imitation learning, where action labels are aligned with robot control commands at 10-50 Hz, boundary precision of plus or minus 2-3 frames (66-100ms at 30fps) is desirable because misaligned boundaries cause the policy to associate the wrong visual observations with action transitions. Professional annotation protocols achieve this through frame-by-frame scrubbing at the transitions, with playback at reduced speed.",
    },
    {
      question: "What tools are used for temporal annotation of video?",
      answer: "ELAN, developed by the Max Planck Institute for Psycholinguistics, is the standard tool for multi-tier temporal annotation. It supports multiple parallel annotation tracks (one for actions, one for objects, one for hand states), time-aligned to the video with millisecond precision. CVAT supports temporal annotation through its video mode with keyframe interpolation. Anvil is a research tool supporting multi-layer temporal annotation with configurable coding schemes. For large-scale production annotation, custom web-based tools are common, featuring keyboard shortcuts for rapid boundary placement, variable-speed playback, waveform displays for audio-visual alignment, and pre-annotation from temporal action detection models to accelerate human review. The choice of tool affects annotation throughput: ELAN averages 5-8x real-time for fine-grained temporal annotation, while optimized custom tools with model pre-annotation can achieve 2-4x real-time.",
    },
    {
      question: "How is inter-annotator agreement measured for temporal annotations?",
      answer: "Temporal annotation agreement has two components: label agreement (do annotators assign the same category?) and boundary agreement (do annotators place segment boundaries at the same timestamps?). Label agreement is measured with Cohen's kappa or Fleiss' kappa, with values above 0.75 considered good. Boundary agreement is measured by the mean absolute difference between annotator boundary timestamps — typically 0.3-0.5 seconds for action transitions in continuous video. Temporal IoU between annotator segments measures both simultaneously: the intersection of two annotators' segments divided by their union. Mean pairwise temporal IoU above 0.7 indicates acceptable agreement for training data. For EPIC-KITCHENS, the narrate-then-verify protocol achieved temporal IoU of approximately 0.65-0.75 between the original narrator timestamps and the verification timestamps, establishing a practical baseline for egocentric activity annotation.",
    },
    {
      question: "How does temporal annotation for robotics differ from annotation for video understanding?",
      answer: "Robotics temporal annotation has three distinctive requirements. First, the temporal granularity must match the robot's control frequency — if the robot operates at 20 Hz, annotations need to distinguish actions at 50ms resolution, much finer than the 0.5-1 second granularity typical in video understanding benchmarks. Second, the label vocabulary must align with executable robot actions: rather than abstract categories like cooking or cleaning, the labels must map to specific motor primitives like approach object, close gripper, lift, and move to target. Third, annotations must capture the contact events and state changes that trigger transitions between robot control modes — the moment the gripper contacts the object, the moment the object lifts off the surface, the moment the object is released. These physical events have precise temporal locations that matter for training contact-aware manipulation policies.",
    },
  ],
  ctaHeading: "Need Temporally Annotated Video Data?",
  ctaDescription: "Claru provides video datasets with frame-precise temporal annotations, action boundaries, and hand-state labels tailored to robot imitation learning pipelines.",
  relatedGlossaryTerms: ["action-segmentation", "activity-annotation", "keypoint-annotation", "egocentric-video"],
  relatedGuidePages: ["how-to-create-temporal-annotations-for-video"],
  relatedSolutionSlugs: ["egocentric-video-data"],

  longDefinition: `Temporal annotation is the process of assigning time-aligned semantic labels to segments of video data. Each annotation consists of a start timestamp, an end timestamp, and a label describing what occurs during that interval. The fundamental unit of temporal annotation is the labeled segment — a contiguous time interval with an associated semantic description. These segments can be nested (a high-level activity contains multiple sub-actions), overlapping (two concurrent events share the same timespan), or gapped (periods of no annotated activity between labeled segments).

The annotation process requires human annotators to make two types of decisions simultaneously: classification (what label to assign) and boundary placement (when does the event start and end). Of these, boundary placement is more subjective and more labor-intensive. Action transitions in real-world video are rarely instantaneous — the transition from reaching for a cup to grasping the cup involves a continuous motion where the boundary is perceptually ambiguous. Professional annotation protocols address this ambiguity by defining explicit boundary conventions: the reach-to-grasp boundary occurs at the frame when the fingers first contact the object, not when the hand shape begins to change.

For robotics training data, temporal annotation serves as the supervisory signal that segments continuous video into discrete action episodes. An imitation learning system needs to know which frames correspond to which action — the visual observations during reaching should be associated with reaching actions, and the observations during grasping should be associated with grasping actions. Misaligned temporal boundaries cause the policy to learn incorrect observation-action associations, producing hesitation or premature transitions during execution.

Temporal annotation granularity varies by application. Coarse temporal annotation labels multi-minute activity segments (making breakfast, cleaning the kitchen). Medium-grain annotation labels individual actions lasting 2-30 seconds (crack egg, stir mixture, wipe counter). Fine-grain annotation labels atomic sub-actions lasting 0.2-2 seconds (reach for spatula, grasp handle, lift spatula). The computational cost of annotation scales inversely with granularity: coarse annotation takes 1-2x real-time, medium annotation 3-5x, and fine-grain annotation 8-15x real-time. For robot learning, the required granularity depends on the policy architecture: high-level task planners need coarse annotations, while low-level visuomotor policies need fine-grain atomic action labels.

The annotation taxonomy — the vocabulary of labels — is a critical design decision. Hierarchical verb-noun taxonomies (pioneered by EPIC-KITCHENS with 97 verbs and 300 nouns) enable compositional labeling: new verb-noun combinations not explicitly in the training data can still be represented. Flat taxonomies with predefined action categories are simpler to annotate but cannot represent novel action-object combinations. For robotics, the taxonomy should map directly to the robot's action primitive vocabulary, ensuring that every annotated segment corresponds to an executable behavior.`,

  historicalContext: `Temporal annotation of video has roots in film studies and linguistic discourse analysis from the mid-20th century, where researchers manually coded behavioral sequences in observational recordings. The first computational application was in speech recognition, where phoneme-level temporal annotations (forced alignment) became standard in the 1980s.

In computer vision, temporal annotation at scale began with the TRECVid benchmark (2003-present), which required temporal localization of semantic concepts in broadcast video. The THUMOS Challenge (2014-2015) introduced temporal action detection as a formal task: given an untrimmed video, identify all instances of predefined action classes with their temporal boundaries. THUMOS provided per-frame annotations for 20 sport action classes across 413 untrimmed videos.

ActivityNet (Heilbron et al., 2015) scaled temporal annotation to 20,000 YouTube videos with 200 activity classes, establishing the large-scale temporal annotation paradigm. The annotation protocol used a two-pass approach: first, annotators identified whether an activity was present in a video, then they marked temporal boundaries for each instance.

The EPIC-KITCHENS dataset (Damen et al., 2018) introduced the narrate-then-verify protocol for egocentric video temporal annotation. Participants wearing head-mounted cameras narrated their actions in real time while cooking, producing natural language descriptions time-aligned with the video. A second pass converted these narrations into structured verb-noun annotations with refined timestamps. This protocol was significantly faster than having separate annotators watch and label pre-recorded video, enabling 100 hours of fine-grained temporal annotation.

Ego4D (Grauman et al., 2022) scaled temporal annotation to 3,670 hours of egocentric video with multiple annotation types: episodic memory queries, hand-object interactions, action anticipation labels, and social interaction events. The project employed over 100 annotators across 13 countries and developed specialized annotation interfaces for each temporal task type. More recently, the emergence of vision-language models has enabled semi-automated temporal annotation: models like InternVideo or TimeSformer generate draft temporal labels that human annotators verify and correct, reducing annotation time by 30-50%.`,

  practicalImplications: `For teams building robot learning systems from video demonstrations, temporal annotation design directly impacts policy quality. The annotation protocol should be co-designed with the ML team, not adopted from generic video understanding benchmarks.

Start by defining the action primitive vocabulary based on the robot's capabilities. If the robot has discrete skill primitives (reach, grasp, lift, move, place, release), the temporal annotations should use exactly these labels, ensuring a direct mapping from annotated segments to executable skills. If the policy architecture uses continuous action representations, the temporal annotations define the segmentation points where the training loss is computed — getting these wrong degrades the entire pipeline.

Annotation speed versus precision involves explicit tradeoffs. For coarse temporal annotation (labeling which action is happening at each moment, with boundary precision of 0.5 seconds), annotation throughput of 3-5x real-time is achievable. For precise boundary annotation (exact frame of contact, release, state change), throughput drops to 8-15x real-time. A practical approach is two-pass annotation: first pass at 3x real-time for coarse labels and approximate boundaries, second pass refining only the boundaries that fall near action transitions, where precision matters most.

Pre-annotation with temporal action detection models can accelerate the process. Running a pretrained model like ActionFormer or TriDet on the video produces draft temporal segments that human annotators correct. This is faster than annotating from scratch because most segments are approximately correct and only need minor boundary adjustments. The model's systematic errors also reveal taxonomy ambiguities — if it consistently confuses stirring with mixing, the taxonomy may need clearer definitions.

Claru delivers temporally annotated video with annotation protocols tailored to each client's robot learning architecture. Our annotation pipelines produce frame-precise temporal boundaries with verb-noun action labels, hand-state annotations, and contact event markers. For egocentric video, we use a narrate-then-verify protocol inspired by EPIC-KITCHENS, producing natural language descriptions aligned with structured temporal labels. Quality is enforced through inter-annotator agreement monitoring on boundary timestamps, with target mean absolute boundary difference below 3 frames at 30fps.`,

  commonMisconceptions: [
    {
      misconception: "Temporal annotation is just activity recognition labels applied to video clips — it does not require special tools or expertise.",
      correction: "Clip-level labels (one label per pre-segmented clip) are a simplified form of temporal annotation, but production temporal annotation involves placing precise boundaries in untrimmed video, handling overlapping events, and maintaining consistency across annotators. The boundary placement task alone requires specialized tools with frame-level scrubbing, variable-speed playback, and keyboard shortcuts for rapid boundary adjustment. Untrained annotators produce boundaries with 1-2 second variability, while professional annotators achieve 0.1-0.2 second precision using proper tools and calibration — a 10x difference in quality.",
    },
    {
      misconception: "Automated temporal action detection models can replace human temporal annotation.",
      correction: "State-of-the-art temporal action detection achieves 30-40% mAP at temporal IoU 0.5 on benchmarks like ActivityNet and THUMOS — meaning more than half of predicted segments are either incorrectly located or incorrectly classified. These models are useful as pre-annotators that reduce human effort by 30-50%, but human verification and correction remain essential for training data quality. The hardest cases — ambiguous transitions, concurrent actions, rare events — are precisely where models fail and where correct annotations matter most for training robust policies.",
    },
    {
      misconception: "Finer temporal granularity is always better — annotating at the frame level is ideal.",
      correction: "Frame-level annotation (labeling every frame independently) is prohibitively expensive for long videos and introduces its own consistency problems — annotators make different frame-by-frame decisions even for the same event. For most robotics applications, segment-level annotation with precise boundaries is more practical and equally effective. A segment annotation that says reach from frame 100 to frame 150 conveys the same information as 50 individual frame labels saying reach, but is faster to produce and more consistent. Frame-level annotation is only necessary when the label vocabulary changes at sub-second timescales, which is rare even in fine-grained manipulation.",
    },
  ],

  keyPapers: [
    {
      id: "damen-epickitchens-2018",
      title: "Scaling Egocentric Vision: The EPIC-KITCHENS Dataset",
      authors: "Damen et al.",
      venue: "ECCV 2018",
      year: 2018,
      url: "https://arxiv.org/abs/1804.02748",
    },
    {
      id: "heilbron-activitynet-2015",
      title: "ActivityNet: A Large-Scale Video Benchmark for Human Activity Understanding",
      authors: "Heilbron et al.",
      venue: "CVPR 2015",
      year: 2015,
      url: "https://arxiv.org/abs/1503.02531",
    },
    {
      id: "zhang-actionformer-2022",
      title: "ActionFormer: Localizing Moments of Actions with Transformers",
      authors: "Zhang et al.",
      venue: "ECCV 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2202.07925",
    },
    {
      id: "grauman-ego4d-2022",
      title: "Ego4D: Around the World in 3,000 Hours of Egocentric Video",
      authors: "Grauman et al.",
      venue: "CVPR 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2110.07058",
    },
    {
      id: "farha-mstcn-2019",
      title: "MS-TCN: Multi-Stage Temporal Convolutional Network for Action Segmentation",
      authors: "Farha and Gall",
      venue: "CVPR 2019",
      year: 2019,
      url: "https://arxiv.org/abs/1903.01945",
    },
  ],

  claruRelevance: `Claru specializes in the temporal annotation workflows that physical AI teams need. Our catalog of 386,000+ egocentric clips includes fine-grained temporal labels with frame-precise action boundaries, verb-noun decompositions, and hand-state annotations — the exact data format required for training robot imitation learning policies, temporal action detection models, and action anticipation systems.

For custom temporal annotation projects, Claru provides end-to-end services: taxonomy co-design with your ML team, pre-annotation using temporal action detection models, multi-annotator verification with boundary agreement monitoring, and delivery in your target format. Our annotators are trained on robotics-specific boundary conventions (contact events, state changes, grasp transitions) that generic video annotation workforces do not handle well. Quality is enforced through inter-annotator agreement auditing, with target boundary precision below 3 frames at 30fps and Cohen's kappa above 0.75 for label agreement.`,
};

export default data;
