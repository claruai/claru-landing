import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-collect-kitchen-activity-data",
  metaTitle: "How to Collect Kitchen Activity Data for AI Training (2026 Guide) | Claru",
  metaDescription: "Step-by-step guide to collecting kitchen activity data for AI training — covering camera placement, activity taxonomies, egocentric recording, and annotation pipelines for embodied AI.",
  primaryKeyword: "how to collect kitchen activity data for ai training",
  secondaryKeywords: ["kitchen activity dataset","cooking activity recognition data","egocentric kitchen data","kitchen robot training data","food preparation dataset"],
  canonicalPath: "/guides/how-to-collect-kitchen-activity-data",
  h1: "How to Collect Kitchen Activity Data for AI Training",
  heroSubtitle: "A practitioner's guide to building kitchen activity datasets — from instrumented kitchen design and activity taxonomy through egocentric video capture, temporal annotation, and formatting for activity recognition and robot policy training.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Collect Kitchen Activity Data for AI Training", href: "/guides/how-to-collect-kitchen-activity-data" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Kitchen Environments Are the Proving Ground for Embodied AI",
      paragraphs: [
        "Kitchens are the most demanding and most commercially relevant environment for embodied AI. They combine every challenge in robot perception and manipulation: diverse object categories (rigid containers, deformable food, articulated appliances, sharp tools), complex sequential tasks (recipes with 20-50 ordered steps), dynamic state changes (food transforms during cooking — raw to chopped to cooked), and safety-critical interactions (hot surfaces, sharp edges, human proximity).",
        "The EPIC-KITCHENS and Ego4D datasets demonstrated that large-scale kitchen video captures the full complexity of real-world activity. But these academic datasets were built for activity recognition research — they lack the structured annotations, robot-specific viewpoints, and manipulation primitives needed for training kitchen robots. Building a kitchen activity dataset for embodied AI requires combining academic rigor in temporal annotation with practical engineering for sensor placement, privacy compliance, and cross-kitchen generalization.",
        "This guide covers the complete pipeline from kitchen instrumentation and participant recruitment through egocentric and fixed-camera recording, temporal annotation with the EPIC-KITCHENS vocabulary, and formatting for both activity recognition models and robot policy training."
      ]
    },
    {
      type: "stats",
      heading: "Kitchen Activity Dataset Scale References",
      stats: [
        { value: "20-50", label: "Participant count for meaningful diversity" },
        { value: "60-150 hrs", label: "Raw video for fine-tuning approaches" },
        { value: "500+ hrs", label: "For training from scratch" },
        { value: "97 verbs", label: "EPIC-KITCHENS action vocabulary" },
        { value: "8-15 min", label: "Annotation time per minute of video" },
        { value: "$30-50/hr", label: "Participant compensation range" }
      ]
    },
    {
      type: "comparison-table",
      heading: "Kitchen Camera Configurations",
      columns: ["Setup", "Camera Type", "Resolution", "Best For", "Cost Per Unit"],
      rows: [
        { "Setup": "Overhead fixed", "Camera Type": "FLIR Blackfly S", "Resolution": "1080p 30fps", "Best For": "Workspace topology, recipe segmentation", "Cost Per Unit": "~$500" },
        { "Setup": "Counter-level fixed", "Camera Type": "FLIR Blackfly S", "Resolution": "1080p 30fps", "Best For": "Hand-object interaction detail", "Cost Per Unit": "~$500" },
        { "Setup": "Egocentric head-mount", "Camera Type": "GoPro Hero 12", "Resolution": "4K 30fps (use 1080p)", "Best For": "First-person view, gaze proxy", "Cost Per Unit": "~$400" },
        { "Setup": "Egocentric glasses", "Camera Type": "Meta Aria", "Resolution": "1408x1408 + IMU + eye tracking", "Best For": "Multi-modal egocentric with gaze", "Cost Per Unit": "~$1,500 (research program)" }
      ]
    },
    {
      type: "cards",
      heading: "Kitchen Data Collection Challenges",
      cards: [
        {
          title: "Cross-Kitchen Generalization",
          description: "Policies trained on a single lab kitchen overfit to that layout, lighting, and tool inventory. Collect across 10-20 real kitchens to capture the distribution shift that matters in deployment."
        },
        {
          title: "Privacy and Consent",
          description: "Recording in homes requires IRB approval, informed consent, media releases, and face de-identification before annotators see the data. Plan 2-4 weeks for compliance setup."
        },
        {
          title: "Camera Occlusion from Steam and Grease",
          description: "Cooking generates steam and grease splatter that occludes lenses mid-session. Use lens protectors, check camera feeds every 15 minutes, and include a lens-cleaning step in the protocol."
        },
        {
          title: "Naturalistic vs. Scripted Behavior",
          description: "Scripted cooking produces unnatural, stilted movements. Screen participants who can cook target recipes from memory and include free-cooking sessions for authentic behavior."
        }
      ]
    },
    {
      type: "prose",
      heading: "From Kitchen Video to Robot Training Data",
      paragraphs: [
        "Kitchen activity video serves two distinct downstream uses: training activity recognition models (which classify and segment human activities) and training robot manipulation policies (which learn motor skills from human demonstrations). These use cases have different annotation and formatting requirements.",
        "For activity recognition, the key deliverable is temporal annotations paired with video features. Extract per-frame visual features using I3D (16-frame clips for temporal modeling) or CLIP ViT-B/16 (single frames for efficient encoding), and pair them with dense action labels at 1-5 fps. The standard evaluation protocol uses the EPIC-KITCHENS splits and metrics (top-1/top-5 verb and noun accuracy).",
        "For robot policy training from kitchen video, the workflow is fundamentally different. You need hand-object interaction extraction (detect when and how the human hand contacts each object), action primitive labeling (map each interaction to a robot-executable primitive like 'grasp', 'pour', 'stir'), and 3D trajectory estimation (extract 6-DoF hand trajectories in world coordinates using hand pose estimation + camera calibration). Models like R3M and VIP learn visual representations from kitchen video that transfer to robot manipulation, but they require the video to be formatted as episodes with consistent frame rates and reward signals.",
        "The most efficient approach is to annotate the same kitchen video for both uses simultaneously: temporal action boundaries serve both activity recognition and robot skill segmentation, and the hand-object interaction annotations (which hands are holding which objects at each frame) feed directly into robot policy learning pipelines. This dual-use annotation strategy costs roughly 30% more than single-use but produces 2x the value per annotated hour of video."
      ]
    }
  ],
  faqs: [
    {
      question: "What camera setup works best for kitchen activity data collection?",
      answer: "The optimal camera configuration depends on your target model. For activity recognition models (video transformers, SlowFast networks), mount 3-4 fixed cameras to cover the full kitchen: one overhead at 2.5m height for workspace topology, two side-angle cameras at counter height covering the stove and prep areas, and one near the sink. Use global-shutter cameras (FLIR Blackfly S, ~$500 each) at 1080p 30fps to avoid rolling-shutter artifacts during fast knife or stirring motions. For egocentric models (Ego4D-style), equip participants with head-mounted cameras — the GoPro Hero 12 (4K 30fps, 155-degree FOV) or the Aria glasses from Meta (1408x1408, dual cameras with IMU) are the most common choices. The Aria glasses provide eye-tracking data as a bonus signal. For robot manipulation training, add wrist-mounted RealSense D435i cameras on the robot plus a top-down ZED 2i for precise workspace depth. Budget $2,000-5,000 for a fixed multi-camera kitchen setup, or $500-1,500 per participant for egocentric rigs."
    },
    {
      question: "How should I design the activity taxonomy for kitchen data?",
      answer: "Start with a hierarchical taxonomy that mirrors how kitchen tasks decompose naturally. Level 1 covers meal types (breakfast, lunch, dinner, snack, beverage). Level 2 covers recipes (scrambled eggs, pasta, salad, sandwich, coffee). Level 3 covers atomic actions — the EPIC-KITCHENS-100 verb-noun taxonomy is the industry standard with 97 verb classes (cut, pour, open, stir, peel, mix) and 300 noun classes (pan, knife, onion, plate). Map your target activities onto this vocabulary to enable transfer learning from EPIC-KITCHENS pretrained models. For robot training, add manipulation primitives: reach, grasp, transport, place, pour, stir, flip, with gripper state (open/closed) at each frame. Define clear temporal boundaries — an 'open drawer' action starts when the hand contacts the handle and ends when the drawer is fully extended and the hand releases. Ambiguous boundary definitions are the top source of inter-annotator disagreement. Pilot your taxonomy on 10 recordings and iterate until Cohen's kappa exceeds 0.75 on boundary annotations."
    },
    {
      question: "How do you handle privacy when recording in real kitchens?",
      answer: "Kitchen data collection involves recording participants in their homes or shared spaces, which creates significant privacy obligations. Implement a layered consent framework: written informed consent covering data use, retention, and sharing rights; a separate media release for any clips used in publications or demos; and clear opt-out procedures allowing participants to request deletion within 30 days. For face de-identification, apply a face blur pipeline post-collection using a RetinaFace detector + Gaussian blur (sigma=15) at the bounding box level — run this before any human annotator sees the data. If your use case requires face data (e.g., gaze direction), collect explicit biometric consent under GDPR Article 9 or equivalent. Remove all personally identifying metadata from files: GPS coordinates from GoPro EXIF data, WiFi SSIDs from Aria sensor logs, and any visible identifying information (mail, calendars, phone screens) via manual review. Store raw data on encrypted drives with access controls and only distribute the de-identified version."
    },
    {
      question: "What is the minimum dataset size for kitchen activity recognition?",
      answer: "Dataset size requirements vary by task and architecture. For fine-grained activity recognition with Video-MAE or TimeSFormer, EPIC-KITCHENS-100 demonstrated strong performance with ~90,000 action segments across 700 hours of video from 45 kitchens — but this represents the high end. For a practical starting point: 20-30 participants each recording 3-5 meal preparations (roughly 60-150 hours of raw video) yields enough diversity for few-shot or fine-tuning approaches. If training from scratch, target 500+ hours across 50+ unique kitchens. For robot manipulation in kitchen environments, the numbers are different: 200-1,000 demonstrations per task with teleoperation data, or 5,000-50,000 demonstrations from human video with action extraction. The key diversity axes are kitchens (layout, appliances, lighting), participants (age, handedness, skill level), and recipes (ingredient substitutions, technique variations). Insufficient kitchen diversity is the most common generalization failure."
    },
    {
      question: "Should I collect kitchen data in real homes or a lab kitchen?",
      answer: "Both have tradeoffs, and the best projects combine them. Lab kitchens provide controlled conditions: repeatable lighting, consistent camera angles, calibrated sensors, and easy access for researchers to debug issues. They work well for robot manipulation data where you need precise joint states and deterministic environment resets. However, lab kitchens suffer from severe distribution shift — policies trained solely on lab data often fail in real homes due to different layouts, lighting, clutter, and kitchen tool variations. Real home collection captures authentic activity patterns, diverse environments, and naturalistic behavior (people multitask, improvise, and make mistakes differently at home than in a lab). The EPIC-KITCHENS and Ego-Exo4D datasets proved this approach works at scale. Start with a lab kitchen for your pilot to validate the recording pipeline and annotation protocol, then scale to 10-20 real kitchens for the production dataset. Budget 30% more time per kitchen for real-home collection due to setup variability."
    }
  ],
  ctaHeading: "Need Kitchen Activity Data?",
  ctaDescription: "Claru operates egocentric and fixed-camera data collection across 100+ cities. Talk to a specialist about your kitchen activity recognition or robot manipulation data needs.",
  relatedGlossaryTerms: ["egocentric-video","activity-annotation","hand-object-interaction"],
  relatedGuidePages: ["how-to-create-temporal-annotations-for-video","how-to-create-a-robot-demonstration-dataset"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  difficulty: "intermediate",
  estimatedTime: "4-8 weeks",
  prerequisites: ["Camera equipment (fixed or egocentric)","Access to kitchen environments","IRB or ethics approval for human subjects","Python 3.10+ with video processing stack","Annotation tool (ELAN, CVAT, or Label Studio)"],
  tools: ["GoPro Hero 12 or Meta Aria","FLIR Blackfly S","Python","FFmpeg","ELAN","CVAT","Label Studio","PyTorch"],
  steps: [
    {
      stepNumber: 1,
      title: "Design the Activity Taxonomy and Recording Protocol",
      description: "Kitchen activity datasets demand a well-defined taxonomy before any camera is turned on. Start by selecting your target granularity: coarse-grained (meal-level labels like 'making breakfast'), medium-grained (recipe-level like 'scrambling eggs'), or fine-grained (action-level like 'crack egg into bowl'). For most embodied AI applications, fine-grained is necessary. Adopt the EPIC-KITCHENS verb-noun vocabulary as your baseline — its 97 verbs and 300 nouns cover the vast majority of kitchen activities and enable direct benchmarking against published results.\n\nCreate a recording protocol document specifying: target recipe list (15-30 recipes spanning breakfast, lunch, dinner, and snack categories), required ingredient and tool variations per recipe (e.g., 'cut tomato' must be recorded with both a chef's knife and a serrated knife, on both a cutting board and a plate), participant screening criteria (must be comfortable cooking the target recipes without instructions — scripted cooking produces unnaturally stilted movements), session structure (1 camera check, 2-3 meal recordings per session, each 15-45 minutes), and environment documentation requirements (photograph the kitchen layout, measure counter heights, record ambient light levels with a lux meter). For egocentric collection, specify the camera mounting position (forehead center, 15-degree downward tilt) and calibration procedure (look at 5 fiducial markers at known positions). Ship the protocol to 3 pilot participants and iterate based on issues discovered.",
      tools: ["EPIC-KITCHENS taxonomy reference", "Markdown/Notion for protocol"],
      tips: ["Include 2-3 'free cooking' sessions per participant where they prepare a meal of their choice — this captures naturalistic behavior patterns that scripted protocols miss"]
    },
    {
      stepNumber: 2,
      title: "Instrument the Kitchen and Calibrate Sensors",
      description: "Whether using a lab kitchen or real homes, sensor installation follows the same principles. For fixed cameras: mount using articulating arms with adhesive bases (no drilling in participants' homes) at positions covering the stove, prep area, sink, and refrigerator. Each camera should capture at least 60% overlap with an adjacent camera to enable multi-view reconstruction. Set all cameras to manual exposure (1/60s shutter, ISO 400-800 depending on lighting) to avoid auto-exposure fluctuations when flames or oven lights toggle. Synchronize cameras using PTP or by recording a visual sync clapboard at the start of each session — audio sync from the clap peaks achieves sub-frame accuracy.\n\nFor egocentric collection: configure GoPro cameras in Linear lens mode (reduces fisheye distortion), 1080p at 30fps (4K generates 300+ GB per session and rarely improves downstream model performance), with Protune enabled for flat color profile (better for post-processing). If using Meta Aria glasses, enable all sensor streams: RGB (1408x1408 at 30fps), stereo monochrome (640x480 at 30fps), IMU (1000 Hz), eye tracking (30 Hz), and hand tracking (30 Hz). The eye-tracking data is particularly valuable — it reveals which objects the participant is attending to, providing a natural curriculum signal for robot learning. Verify storage capacity: a 3-hour collection session generates 50-80 GB for a multi-camera fixed setup or 30-50 GB per egocentric rig. Bring spare SD cards and portable SSDs. Test the full pipeline with a 15-minute dry run before each participant arrives.",
      tools: ["GoPro Hero 12", "Meta Aria Companion App", "PTP sync tools", "OpenCV for calibration"],
      tips: ["Tape down all camera cables to the floor and countertops — participants will trip on loose cables, and a camera knocked askew mid-session invalidates the spatial calibration"]
    },
    {
      stepNumber: 3,
      title: "Recruit Participants and Run Collection Sessions",
      description: "Recruit 20-50 participants across a range of cooking skill levels, ages (18-65+), handedness, and cultural backgrounds to ensure recipe and technique diversity. Screen for cooking competence on your target recipes — participants should be able to cook without written instructions, as reading recipes during recording creates unnatural pauses and head-down posture that occludes the workspace in egocentric video. Compensate participants at $30-50/hour to reflect the effort of cooking 2-3 full meals per session.\n\nStructure each collection session as: (1) Consent and briefing (15 min) — explain the project, collect signed consent forms, review the recipe list. (2) Kitchen documentation (10 min) — photograph layout, measure workspace dimensions, note appliance brands and locations. (3) Sensor setup and calibration (15-20 min) — mount cameras, run sync, verify recording. (4) Warm-up recipe (15-20 min, not included in dataset) — participant makes a simple dish to get comfortable with the cameras. (5) Target recordings (2-3 recipes, 15-45 min each) — participant cooks naturally while a research assistant notes any equipment issues. (6) Post-session review (10 min) — quick playback to verify video quality, participant debriefs on any unusual steps. Schedule sessions across different times of day to capture varying natural light conditions. In real homes, visit each kitchen at least twice (different meal types) to amortize the setup cost and increase per-kitchen diversity.",
      tools: ["Google Forms for screening surveys", "DocuSign for consent"],
      tips: ["Have the research assistant log timestamped notes of unusual events during recording (dropped utensils, recipe deviations, camera bumps) — these notes save hours of annotation debugging later"]
    },
    {
      stepNumber: 4,
      title: "Annotate Activities with Temporal Boundaries",
      description: "Temporal annotation is the most labor-intensive step. For fine-grained action segments, each minute of raw video typically requires 8-15 minutes of annotation time. Use ELAN for dense temporal annotation (it handles multi-tier hierarchical labels natively) or CVAT for combined spatial-temporal annotation (bounding boxes + activity labels). Set up the annotation schema with three parallel tiers: Tier 1 (coarse) — recipe phase labels spanning 1-10 minutes (prep, cook, plate, clean). Tier 2 (fine) — verb-noun action segments spanning 1-30 seconds (cut_tomato, pour_oil, stir_sauce). Tier 3 (atomic) — optional contact/manipulation primitives spanning 0.2-2 seconds (reach, grasp, transport, release).\n\nTrain annotators in a 2-day bootcamp covering: the taxonomy with 50+ visual examples per action class, boundary rules (action starts at first intentional motion toward the target object, ends when the hand releases or the tool disengages), and edge cases (simultaneous bimanual actions get separate annotations per hand, background monitoring like watching a pot counts as 'check' not 'stir'). Require each annotator to pass a qualification test: annotate 3 reference videos and achieve Cohen's kappa > 0.75 against the gold standard. For the production dataset, double-annotate 20% of videos and resolve disagreements through adjudication. Use inter-annotator agreement metrics to identify ambiguous action classes — if two classes consistently confuse annotators (e.g., 'mix' vs 'stir'), either merge them or add clearer visual criteria to the guidelines.",
      tools: ["ELAN", "CVAT", "Label Studio", "Python (krippendorffs_alpha, sklearn.metrics.cohen_kappa_score)"],
      tips: ["Annotate at 0.5x playback speed for fine-grained actions and 2x speed for coarse recipe phases — matching playback speed to label granularity dramatically improves annotator consistency and throughput"]
    },
    {
      stepNumber: 5,
      title: "Extract Features and Validate Dataset Quality",
      description: "After annotation, build a feature extraction pipeline that converts raw video and labels into training-ready tensors. For each annotated action segment, extract: RGB frames at the target model's resolution (typically 224x224 or 256x256), optical flow fields using RAFT (state-of-the-art accuracy) or TV-L1 (faster, slightly lower quality) between consecutive frames, hand bounding boxes and poses using MediaPipe Hands or FrankMocap, and object bounding boxes using a DINO-v2 or Grounding-DINO detector fine-tuned on kitchen objects. Store extracted features in HDF5 with one file per session containing groups for each modality.\n\nRun comprehensive validation: (1) Annotation coverage — verify that >98% of video frames have at least one active annotation (gaps indicate annotator errors or genuinely idle periods that should be labeled as 'idle'). (2) Temporal consistency — check that no two annotations of the same tier overlap for the same hand (physical constraint violation). (3) Class distribution — compute the frequency of each verb-noun pair and flag rare combinations (<5 occurrences) that may need additional collection or merging with a parent class. (4) Visual quality — sample 100 random segments and verify: no camera occlusion from steam or grease splatter, no motion blur exceeding 10% of frames, and correct participant de-identification. (5) Cross-kitchen statistics — compute per-kitchen action distributions and verify no single kitchen contributes more than 10% of any action class. Generate a dataset statistics report with histograms, confusion matrices from inter-annotator agreement, and qualitative examples of each action class.",
      tools: ["RAFT optical flow", "MediaPipe Hands", "Grounding-DINO", "h5py", "FFmpeg"],
      tips: ["Compute optical flow at the original resolution, then downsample — computing flow on downsampled video produces significantly worse results for fast hand motions"]
    },
    {
      stepNumber: 6,
      title: "Format, Split, and Package for Training",
      description: "Convert the validated dataset into standard formats for activity recognition and/or robot learning. For video understanding models (SlowFast, Video-MAE, TimeSFormer), the standard format is a directory of video clips (one per action segment, trimmed with 0.5s context before and after the annotated boundaries) plus a CSV manifest mapping clip paths to labels. For Ego4D-compatible formatting, follow the Ego4D annotation JSON schema with video_uid, clip_uid, verb_label, noun_label, start_frame, and end_frame fields. For robot learning from human video (using models like R3M or VIP), output the full uncut episodes as HDF5 files with synchronized observation streams (images, depth if available, hand pose) and action labels at each frame.\n\nGenerate train/validation/test splits stratified by participant AND kitchen — never allow the same participant or kitchen to appear in both train and test, as models can overfit to kitchen-specific visual features (that distinctive red KitchenAid mixer) or participant-specific behavior patterns. A standard split is 70/15/15 by participant count. For temporal splits, some benchmarks additionally ensure that test videos are recorded on different days than training videos. Compute split-level statistics and verify that action class distributions are similar across splits using Jensen-Shannon divergence (target JSD < 0.05). Package the dataset with: the raw video files, extracted features, annotation files, split definitions, a dataloader compatible with PyTorch and the standard video understanding libraries (Decord for video loading, pytorchvideo for transforms), and a comprehensive dataset card documenting collection conditions, participant demographics, annotation guidelines, and known limitations.",
      tools: ["FFmpeg", "Decord", "pytorchvideo", "pandas", "HDF5"],
      tips: ["Always include the annotation guideline document and inter-annotator agreement report with the dataset release — without them, users cannot assess label reliability or resolve ambiguous cases"]
    }
  ],
  keyPapers: [
    {
      id: "damen-epic-kitchens-2022",
      title: "Rescaling Egocentric Vision: Collection, Pipeline and Challenges for EPIC-KITCHENS-100",
      authors: "Damen et al.",
      venue: "IJCV 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2006.13256"
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
      id: "grauman-ego-exo4d-2024",
      title: "Ego-Exo4D: Understanding Skilled Human Activity from First- and Third-Person Perspectives",
      authors: "Grauman et al.",
      venue: "CVPR 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2311.18259"
    },
    {
      id: "nair-r3m-2022",
      title: "R3M: A Universal Visual Representation for Robot Manipulation",
      authors: "Nair et al.",
      venue: "CoRL 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2203.12601"
    }
  ],
  claruRelevance: "Claru collects kitchen activity data across 100+ cities with both egocentric and fixed-camera setups. Our teams handle participant recruitment, instrumented kitchen setup, multi-session recording, temporal annotation with trained annotators, and delivery in EPIC-KITCHENS-compatible, Ego4D-compatible, or custom formats. We have particular depth in egocentric video collection for embodied AI — contact us to discuss your activity recognition or kitchen robot data needs.",
};

export default data;
