import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "activity-annotation",
  termSlug: "activity-annotation",
  category: "annotation-types",
  metaTitle: "Activity Annotation — Definition & Training Data | Claru",
  metaDescription: "Activity annotation labels human actions in video with temporal boundaries and semantic descriptions. Learn methods, data requirements, key papers, and best practices.",
  primaryKeyword: "activity annotation",
  secondaryKeywords: ["activity recognition labeling", "human activity annotation", "temporal activity labeling", "action recognition dataset", "video activity labels", "fine-grained activity annotation"],
  canonicalPath: "/glossary/activity-annotation",
  h1: "Activity Annotation: Definition, Applications, and Training Data Requirements",
  heroSubtitle: "Activity annotation is the process of labeling what people are doing in video data — from coarse categories like 'cooking' down to fine-grained atomic actions like 'crack egg into bowl.' This page covers annotation taxonomies, temporal segmentation methods, inter-annotator agreement, and data requirements for training activity recognition models.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Activity Annotation", href: "/glossary/activity-annotation" },
  ],
  sections: [],
  faqs: [
    {
      question: "What is the difference between activity annotation and action segmentation?",
      answer: "Activity annotation is the broader process of assigning semantic labels and temporal boundaries to human activities in video. Action segmentation is a specific computational task that takes a fully observed video and predicts per-frame action labels — it is one of the downstream tasks that activity annotations enable. Activity annotation also supports activity recognition (classifying trimmed clips), temporal action detection (finding when actions occur in untrimmed video), and action anticipation (predicting future actions). The annotation process produces the ground truth labels that train and evaluate all of these tasks.",
    },
    {
      question: "How many annotators are needed for reliable activity annotation?",
      answer: "Best practice requires at least two independent annotators per video, with a third adjudicator resolving disagreements. For fine-grained temporal annotation, inter-annotator agreement on segment boundaries typically varies by plus or minus 0.3 to 0.5 seconds — this temporal uncertainty is inherent to subjective boundary perception. The EPIC-KITCHENS dataset used a narrate-then-verify protocol where one person narrated actions while performing them and a second person verified timestamps. For large-scale projects, three annotators with majority voting on both labels and boundaries produces the most consistent ground truth, with Cohen's kappa above 0.75 considered acceptable for production use.",
    },
    {
      question: "What annotation tools are used for activity annotation in video?",
      answer: "The dominant tools are ELAN (developed by the Max Planck Institute for Psycholinguistics), which supports multi-tier temporal annotation with linguistic conventions, and CVAT (Computer Vision Annotation Tool), which handles both spatial and temporal labeling. VIA (VGG Image Annotator) offers a lightweight browser-based option. For egocentric video specifically, tools like EPIC Annotations use a two-pass approach: narration collection during recording followed by timestamp refinement in post-processing. Professional annotation teams typically use custom-built interfaces that integrate playback speed control, keyboard shortcuts for frequent labels, and pre-annotation from activity recognition models to accelerate human review.",
    },
    {
      question: "How does activity annotation differ for egocentric versus third-person video?",
      answer: "Egocentric (first-person) video presents unique annotation challenges. The camera wearer's hands are the primary actors, and the camera moves with the person's head, creating frequent motion blur and viewpoint changes. Activity boundaries are harder to define because transitions happen smoothly — the wearer reaches for an object while still completing a previous action. Egocentric annotation taxonomies must include hand-state labels (free, holding, operating), gaze proxies, and object interaction states that are less relevant in static third-person views. Third-person annotation benefits from stable viewpoints and full-body visibility but requires handling occlusions when multiple people are present. The EPIC-KITCHENS and Ego4D benchmarks have established annotation protocols specifically designed for egocentric activity labeling.",
    },
    {
      question: "What are the most important activity annotation datasets for physical AI?",
      answer: "For robotics and physical AI, the key datasets are: EPIC-KITCHENS-100 (100 hours of egocentric kitchen activity with 90,000 action segments across 97 verb and 300 noun classes), Ego4D (3,670 hours of egocentric video with episodic memory, hand-object interaction, and forecasting annotations), Something-Something V2 (220,000 clips of humans performing 174 predefined actions with objects), and ActivityNet (20,000 YouTube videos with 200 activity classes and temporal boundaries). For robot learning specifically, the Bridge Data V2 and Open X-Embodiment datasets include activity labels aligned with robot action trajectories, enabling direct use in imitation learning pipelines.",
    },
  ],
  ctaHeading: "Need Activity-Annotated Video Data?",
  ctaDescription: "Claru provides temporally annotated egocentric and third-person video datasets with fine-grained activity labels, object interactions, and hand-state annotations for physical AI training.",
  relatedGlossaryTerms: ["action-segmentation", "temporal-annotation", "egocentric-video", "hand-object-interaction"],
  relatedGuidePages: ["how-to-create-temporal-annotations-for-video"],
  relatedSolutionSlugs: ["egocentric-video-data"],

  longDefinition: `Activity annotation is the process of assigning semantic labels and precise temporal boundaries to human actions observed in video data. At its core, it answers three questions about each segment of video: what action is being performed, when does the action start and end, and what objects or entities are involved. The output is a structured timeline of labeled intervals — each defined by a start time, end time, action class, and optionally a set of noun labels identifying the objects being manipulated.

Activity annotation operates at multiple granularities. At the coarsest level, annotations describe high-level activities like "preparing a meal" or "cleaning a room" that span minutes. At an intermediate level, actions like "chopping vegetables" or "wiping counter" last seconds to tens of seconds. At the finest level, atomic actions like "grasp knife," "slice downward," "release knife" last fractions of a second. The choice of granularity depends on the downstream task: robot imitation learning typically requires atomic-level annotations that align with individual motor primitives, while video retrieval systems work with intermediate action descriptions.

The annotation taxonomy — the hierarchical vocabulary of action labels — is a critical design decision. Flat label sets with hundreds of independent categories produce sparse training data per class. Hierarchical taxonomies that decompose actions into verb-noun pairs (e.g., "pick up" + "cup") enable compositional generalization: a model trained on "pick up cup" and "put down plate" can potentially infer "pick up plate" without explicit training examples. The EPIC-KITCHENS dataset pioneered this approach with 97 verb classes and 300 noun classes, producing a combinatorial action space of thousands of verb-noun pairs from a manageable annotation vocabulary.

Temporal boundary annotation is the most labor-intensive and subjective component. Human annotators disagree on exact transition points between consecutive actions — the moment "reaching for cup" becomes "grasping cup" is perceptually ambiguous. This inter-annotator variability averages 0.3-0.5 seconds for fine-grained boundaries. Robust annotation protocols address this by collecting multiple independent annotations per segment and using either majority-vote boundaries or soft labels that encode the distribution of annotator opinions. For training data used in robot learning, temporal precision below 0.1 seconds is rarely necessary because robot control frequencies of 10-50 Hz already discretize time into 20-100ms intervals.`,

  historicalContext: `Activity annotation as a structured discipline began with the KTH Actions dataset (Schuldt et al., 2004), one of the first collections of human action clips with category labels. The six action classes — walking, jogging, running, boxing, waving, clapping — were recorded against uniform backgrounds, and annotation consisted simply of assigning each clip to one category. This clip-level classification paradigm dominated early activity recognition research.

The shift toward temporal annotation came with ActivityNet (Heilbron et al., 2015), which introduced temporal activity detection as a task: given an untrimmed video, identify the start and end times of activity instances. ActivityNet contained 20,000 YouTube videos annotated with 200 activity classes, establishing the template for large-scale temporal annotation efforts. The THUMOS challenge (2014-2015) further pushed temporal annotation quality by requiring per-frame labels for 20 sport action classes.

The egocentric video revolution transformed activity annotation requirements. EPIC-KITCHENS (Damen et al., 2018, expanded to EPIC-KITCHENS-100 in 2020) introduced the narrate-and-verify protocol: participants wore head-mounted cameras while cooking and narrated their actions in real time. These narrations were then time-aligned and mapped to a structured verb-noun taxonomy, producing 90,000 action segments across 100 hours of footage. This protocol addressed a fundamental scaling challenge: having people narrate as they act is far faster than having separate annotators watch and label recorded video.

Ego4D (Grauman et al., 2022) scaled egocentric annotation to an unprecedented 3,670 hours across 13 countries, introducing annotation tasks like episodic memory ("when did I last see my keys?"), hand-object interaction detection, and short-term action anticipation. The project employed over 100 annotators and developed specialized annotation interfaces for each task type. More recently, the Ego-Exo4D dataset (2024) paired egocentric and third-person views of the same activities, enabling annotation transfer between viewpoints — a capability directly relevant to robot learning from human demonstration.`,

  practicalImplications: `For teams building physical AI systems that learn from human demonstration, activity annotation quality directly determines policy performance. A manipulation policy trained on imprecise action boundaries will learn blurred transitions between motor primitives — it might hesitate or produce jerky motions at the transition between "reaching" and "grasping" if the training data inconsistently labels this boundary.

The annotation taxonomy should be designed in collaboration with the robotics team, not derived from generic activity recognition benchmarks. A taxonomy designed for video understanding might label an entire cooking sequence as "making pasta," but a robot learning system needs granular labels: "open cabinet," "grasp pot," "move pot to stove," "turn on burner," "open faucet," "fill pot." The mapping between human activity labels and robot action primitives must be explicit — each annotated segment should correspond to a meaningful unit of robot behavior.

Annotation speed varies dramatically with granularity and modality. Coarse activity labels for pre-segmented clips take 2-5 seconds per clip. Fine-grained temporal annotation of continuous video takes 5-10x real-time: annotating one hour of video requires 5-10 hours of annotator time. Adding spatial annotations (bounding boxes around objects being manipulated) increases cost by another 3-5x. For egocentric video with hand-object interaction labels, total annotation cost reaches 15-30x real-time.

Pre-annotation with activity recognition models reduces cost by 30-50%. Running a pretrained model like InternVideo or VideoMAE on raw footage produces draft labels that human annotators correct rather than create from scratch. This human-in-the-loop approach maintains annotation quality while dramatically improving throughput. The model's error patterns also expose taxonomy weaknesses — if the model consistently confuses "stirring" with "mixing," the taxonomy may need clearer definitions.

Claru delivers activity-annotated video with annotation protocols tailored to each client's downstream task. Our annotation pipelines use pre-annotation from vision-language models followed by human verification, producing temporally precise labels at scale. For robot learning teams, we align activity annotations with the specific action primitive vocabulary used in their policy architecture.`,

  commonMisconceptions: [
    {
      misconception: "Activity annotation is just about labeling what action is happening — temporal precision does not matter much.",
      correction: "Temporal precision is critical for downstream model performance. In robot imitation learning, misaligned boundaries between observation segments and action labels produce policies that are late to initiate actions or fail to transition between manipulation phases. In temporal action detection benchmarks, performance is measured at strict temporal IoU thresholds (0.5, 0.75) where even half-second boundary errors cause a detection to be scored as a miss. Professional annotation protocols specify target boundary precision of plus or minus 2 frames (about 66ms at 30fps).",
    },
    {
      misconception: "Automated activity recognition models have made human activity annotation obsolete.",
      correction: "Current activity recognition models achieve 40-60% top-1 accuracy on benchmarks like EPIC-KITCHENS-100, far below the reliability needed for training data ground truth. Models are useful as pre-annotators that reduce human effort by 30-50%, but human verification and correction remain essential. The hardest annotation cases — ambiguous transitions, occluded actions, multi-step procedures — are precisely where models fail and where correct labels matter most for training robust policies.",
    },
    {
      misconception: "A universal activity taxonomy works for all applications — you can reuse labels from academic benchmarks directly.",
      correction: "Activity taxonomies must be designed for the specific downstream task. Academic benchmarks like ActivityNet use categories optimized for web video understanding (e.g., 'playing basketball,' 'making a sandwich') that are too coarse for robotics. Robot learning requires atomic-level labels that map to executable motor primitives. A kitchen robotics system needs 'grasp spatula handle with right hand' rather than 'cooking.' Taxonomy design is an engineering decision that should involve the ML team, the annotation team, and domain experts.",
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
      id: "grauman-ego4d-2022",
      title: "Ego4D: Around the World in 3,000 Hours of Egocentric Video",
      authors: "Grauman et al.",
      venue: "CVPR 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2110.07058",
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
      id: "goyal-ssv2-2017",
      title: "The 'Something Something' Video Database for Learning and Evaluating Visual Common Sense",
      authors: "Goyal et al.",
      venue: "ICCV 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1706.04261",
    },
    {
      id: "grauman-egoexo4d-2024",
      title: "Ego-Exo4D: Understanding Skilled Human Activity from First- and Third-Person Perspectives",
      authors: "Grauman et al.",
      venue: "CVPR 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2311.18259",
    },
  ],

  claruRelevance: `Claru specializes in the exact activity annotation workflows that physical AI teams need. Our catalog of 386,000+ egocentric clips includes fine-grained temporal activity labels, verb-noun decompositions, and hand-object interaction annotations — the data modalities required for training robot imitation learning policies, action anticipation models, and embodied AI planners.

For teams that need custom activity annotation, Claru offers end-to-end annotation services: taxonomy co-design with your ML team, pre-annotation using state-of-the-art vision-language models, multi-annotator verification with adjudication, and delivery in your target format (EPIC-KITCHENS style narrations, Ego4D-format temporal segments, or custom schemas). Our annotation team operates across 100+ cities, capturing the geographic and cultural diversity of human activities that prevents models from overfitting to a single population's behavioral patterns. Quality is enforced through inter-annotator agreement monitoring, temporal boundary audits, and taxonomy compliance checks at every stage of the pipeline.`,
};

export default data;
