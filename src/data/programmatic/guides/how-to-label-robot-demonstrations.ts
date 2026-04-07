import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-label-robot-demonstrations",
  metaTitle: "How to Label Robot Demonstrations (2026 Guide) | Claru",
  metaDescription: "Practical guide to annotating robot demonstration data with action labels, success flags, task segments, language instructions, and quality scores for policy training.",
  primaryKeyword: "how to label robot demonstrations",
  secondaryKeywords: ["robot demonstration labeling", "annotation robot data", "label manipulation data", "robot data annotation guide"],
  canonicalPath: "/guides/how-to-label-robot-demonstrations",
  h1: "How to Label Robot Demonstrations for Policy Training",
  heroSubtitle: "A practitioner's guide to annotating robot demonstration data — defining label taxonomies, building annotation interfaces, applying action labels, success flags, task segmentation, language instructions, and quality scores for behavioral cloning and VLA training.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Label Robot Demonstrations for Policy Training", href: "/guides/how-to-label-robot-demonstrations" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Demonstration Labeling Is the Bottleneck in Robot Learning",
      paragraphs: [
        "Raw robot demonstrations — trajectories of joint positions, end-effector poses, images, and sensor readings — are necessary but not sufficient for training modern robot policies. Most policy architectures require additional labels: task success/failure flags for filtering bad demonstrations, language instructions for VLA conditioning, temporal segmentation into manipulation phases (approach, contact, transport, place), and quality scores for weighting high-quality demonstrations more heavily during training. These labels transform raw trajectories into structured training data.",
        "The labeling bottleneck is particularly acute for language-conditioned policies (RT-2, OpenVLA, Octo). Each demonstration must be paired with a natural language instruction that accurately describes the task — 'pick up the red mug and place it on the top shelf.' Writing these instructions post-hoc by watching demonstration videos takes 30-60 seconds per episode, which at 10,000 episodes means 80-160 hours of annotation labor. Errors in language labels directly degrade policy performance: ambiguous instructions ('put it there') teach the model to ignore language, while incorrect instructions ('pick up the blue cup' when the demonstrated cup is red) create conflicting training signal.",
      ],
    },
    {
      type: "prose",
      heading: "Choosing the Right Label Set for Your Model Architecture",
      paragraphs: [
        "The required label set depends entirely on your target model architecture — over-labeling wastes annotation budget, while under-labeling limits what the model can learn. Behavioral cloning models (Diffusion Policy, ACT) need only success/failure flags and optionally quality scores for data filtering. VLA models (RT-2, OpenVLA, Octo) additionally require language instructions paired with each episode. Hierarchical policies (SayCan, TAMP) require temporal phase segmentation and skill labels. Reward models for RLHF require pairwise preference comparisons between episodes rather than per-episode labels.",
        "Before committing to a label set, audit two things: (1) What labels does the training code actually consume? Read the dataloader source code and verify which fields it reads. Labels that are collected but never loaded into the model are wasted annotation effort. (2) What labels will you need in the next 6 months? If you plan to migrate from BC to RLHF, collecting quality scores and failure taxonomy now prevents re-labeling the entire dataset later. Budget for the labels you will need, not just the ones you need today.",
      ],
    },
    {
      type: "prose",
      heading: "Scaling Annotation with Semi-Automated Labeling",
      paragraphs: [
        "For datasets exceeding 5,000 episodes, fully manual annotation becomes prohibitively expensive. Semi-automated labeling uses pre-trained models to generate draft annotations that human annotators verify and correct, reducing per-episode annotation time by 30-50%. For language instructions, run a vision-language model (GPT-4V, Gemini Pro Vision) on 4-8 keyframes from each episode with a task-specific prompt to generate draft instructions. Annotators then verify the instruction is correct, fix object attributes or spatial references, and add paraphrases. The draft acceptance rate (fraction of drafts that are correct without modification) typically ranges from 60-80% depending on task complexity.",
        "For temporal phase segmentation, train a lightweight segmentation model (a 1D CNN or transformer operating on the end-effector velocity and gripper aperture signals) on the first 500 manually annotated episodes, then apply it to the remaining episodes as draft segmentation. Annotators review the draft boundaries, adjusting those that are off by more than 3 frames. This reduces per-episode segmentation time from 2-3 minutes to 30-60 seconds. For success/failure labels, implement an automatic success detector based on the task's success criterion (e.g., 'object within 3cm of target pose for 2+ seconds') and have annotators verify only the uncertain cases (episodes where the detector's confidence is between 0.3 and 0.7). These semi-automated approaches scale annotation throughput by 2-3x while maintaining inter-annotator agreement above 0.85 kappa on all label types.",
      ],
    },
  ],
  faqs: [
    {
      question: "How long does it take to label a single robot demonstration episode?",
      answer: "Labeling time depends on the annotation depth. A minimal label set (success/failure flag + one-sentence language instruction) takes 30-60 seconds per episode. A full label set (success flag, failure taxonomy, language instruction, temporal phase segmentation, grasp quality score, and task completion percentage) takes 3-5 minutes per episode. For 10,000 demonstrations, budget 80-160 hours for minimal labeling or 500-830 hours for full labeling. Annotation tools with keyboard shortcuts, pre-populated templates, and semi-automated suggestions (from a pre-trained captioning model) can reduce full labeling time by 30-40%.",
    },
    {
      question: "Should I label failed demonstrations or discard them?",
      answer: "Label failures — they are essential training signal. For behavioral cloning, include 10-20% failed demonstrations with explicit failure labels so the policy learns what not to do. For RLHF and DPO training, failed demonstrations serve as the 'rejected' response in preference pairs. Label each failure with a taxonomy: missed_grasp, dropped_object, collision, wrong_object, incomplete_task, timeout. This taxonomy enables per-failure-type analysis during model evaluation. The only demonstrations to discard are those with sensor corruption, extreme desynchronization, or operator errors that make the episode uninterpretable.",
    },
    {
      question: "How do you write good language instructions for VLA training?",
      answer: "Effective language instructions are specific, unambiguous, and grounded in the visual scene. Good: 'Pick up the red coffee mug from the left side of the counter and place it on the wooden shelf above the sink.' Bad: 'Put the cup on the shelf.' The instruction should contain enough detail that a human watching the video could verify whether the demonstration matches. Write instructions at the task level, not the motion level — 'stack the blue block on the red block' rather than 'move the gripper left 10cm, lower 5cm, close gripper.' Include object attributes (color, size, material) and spatial references (left, right, above, next to) to ground the language in the visual observation.",
    },
    {
      question: "What tools should I use for robot demonstration labeling?",
      answer: "Label Studio is the most flexible open-source option — it supports video playback with timeline annotation, text input for language instructions, categorical labels, and custom annotation interfaces. CVAT is an alternative for video-heavy workflows with stronger built-in video playback controls. For large-scale projects (10,000+ episodes), build a custom web interface using React with a video player component (video.js) and structured form inputs — the 2-3 weeks of development time pays for itself in annotator efficiency gains. Whichever tool you choose, add keyboard shortcuts for the most common actions (approve, reject, next episode) to maximize throughput.",
    },
    {
      question: "How do I quality-check language instructions at scale?",
      answer: "Run four automated checks on every language instruction. First, length check: reject instructions under 5 words or over 30 words. Second, entity grounding: extract object nouns from the instruction using spaCy NER and verify they appear in the scene's object inventory. Third, vocabulary compliance: check all verbs and spatial prepositions against your controlled vocabulary and flag non-standard terms. Fourth, semantic diversity: compute CLIP text embeddings for all instructions and flag any two instructions with cosine similarity above 0.98 as near-duplicates that should be paraphrased. These checks take under 1 second per instruction and catch 80% of annotation errors before human review.",
    },
  ],
  ctaHeading: "Need Help Labeling Robot Data?",
  ctaDescription: "Claru provides expert annotation services for robot demonstration data — language instructions, temporal segmentation, quality scoring, and failure taxonomy labeling with inter-annotator agreement tracking.",
  relatedGlossaryTerms: ["behavioral-cloning", "action-segmentation", "temporal-annotation", "imitation-learning"],
  relatedGuidePages: ["how-to-collect-teleoperation-data", "how-to-create-action-labels-for-vla"],
  relatedSolutionSlugs: ["manipulation-trajectory-data"],
  difficulty: "intermediate",
  estimatedTime: "1-2 weeks",
  prerequisites: ["Collected demonstration trajectories (video + actions)", "Defined task taxonomy", "Annotation tool access (Label Studio, CVAT, or custom)", "Language style guide for VLA instructions"],
  tools: ["Label Studio", "CVAT", "VGG Image Annotator (VIA)", "Python", "ffmpeg (for video processing)", "Whisper (for speech-to-text if using verbal instructions)"],
  steps: [
    {
      stepNumber: 1,
      title: "Define the Label Taxonomy and Annotation Schema",
      description: "Before any annotation begins, define exactly what labels are needed and how each label is specified. This taxonomy document is the single most important artifact in the labeling pipeline — ambiguity in the taxonomy produces inconsistent annotations that directly harm policy training.\n\nThe core label types for robot demonstrations are: (1) Task success — binary (success/failure), with an unambiguous success criterion per task (e.g., 'object is stable in the target location for 3+ seconds'). (2) Failure taxonomy — a hierarchical classification of failure modes: grasp_failure (missed, slipped, crushed), placement_failure (wrong location, unstable, dropped during transport), collision (with obstacle, with self), wrong_object (picked incorrect item), and timeout (task not completed within time limit). (3) Language instruction — a natural language description of the demonstrated task, written according to a style guide that specifies vocabulary, level of detail, and spatial reference conventions. (4) Temporal phase segmentation — splitting the episode into manipulation phases: idle, approach, pre-grasp, grasp, lift, transport, pre-place, place, retract. (5) Quality score — a 1-5 rating of demonstration quality (1 = barely successful/very inefficient, 5 = expert-level execution).\n\nCreate a taxonomy document with: definition of each label, examples of correct labeling, examples of common mistakes, and edge case decisions (e.g., 'if the object is placed successfully but slides 2cm after release, label as success with quality score 3'). Train annotators on this document with a 50-episode calibration set before production labeling begins.",
      tools: ["Google Docs or Notion for taxonomy document", "Calibration dataset (50 episodes)"],
      tips: [
        "Include 10+ edge case examples in the taxonomy document — edge cases cause 80% of inter-annotator disagreement, and resolving them upfront saves weeks of re-labeling",
        "Version the taxonomy document and record which version each episode was annotated under. Taxonomy updates mid-project require re-reviewing all previously annotated episodes.",
        "Use video screenshots from actual demonstrations as examples in the taxonomy document — abstract text descriptions of edge cases are ambiguous, while visual examples are unambiguous.",
      ],
    },
    {
      stepNumber: 2,
      title: "Set Up the Annotation Interface and Data Pipeline",
      description: "Configure an annotation tool that can display robot demonstration data (multi-view video, action trajectories, sensor readings) and collect structured labels efficiently. Label Studio is the most flexible open-source option for robotics data, supporting video annotation with temporal segmentation, text input for language instructions, and categorical labels for success/failure.\n\nBuild the data pipeline: (1) Convert raw demonstration data (ROS bags, HDF5 files, RLDS episodes) into a format the annotation tool can display. For video-based annotation, render multi-view camera feeds into a single tiled video (e.g., 2x2 grid of camera views) using ffmpeg. Include an action trajectory overlay on one view showing the end-effector path. (2) Pre-populate annotations where possible: run a pre-trained vision-language model (e.g., GPT-4V, Gemini Pro Vision) on the demonstration video to generate draft language instructions that annotators verify and correct rather than writing from scratch. This reduces per-episode annotation time by 40-50% for language labels. (3) Set up a review queue where a senior annotator spot-checks 20% of completed annotations for quality.\n\nFor temporal segmentation, use a video timeline interface where annotators click at phase transition points. Display the robot's joint velocity magnitude as a waveform alongside the video — velocity zero-crossings often correspond to phase transitions (approach stops before grasp begins), providing a visual guide that speeds up segmentation by 2-3x.",
      tools: ["Label Studio", "ffmpeg", "GPT-4V or Gemini (for draft language instructions)", "Python scripts for data conversion"],
      tips: [
        "Render the end-effector trajectory as a colored path overlay on the video (green = approach, yellow = grasp, blue = transport, red = place) — annotators segment 40% faster with this visual aid",
        "Pre-generate draft language instructions using a VLM (GPT-4V or Gemini Pro Vision) and have annotators verify and correct rather than writing from scratch. This reduces per-episode annotation time by 40-50% for language labels.",
      ],
    },
    {
      stepNumber: 3,
      title: "Write Language Instructions (for VLA Training)",
      description: "Language instruction labeling is the most time-consuming and error-prone annotation task. Establish a style guide that specifies: vocabulary (use 'pick up' not 'grab,' 'place on' not 'put on'), object descriptions (always include color + object type, optionally material and size), spatial references (relative to landmarks: 'left of the toaster,' 'on the top shelf'), and instruction granularity (task-level: 'pick up the red mug and place it on the shelf' not step-level: 'move right, lower, close gripper, lift, move left, lower, open gripper').\n\nFor large datasets (5,000+ episodes), use a two-stage process: (1) Auto-generate draft instructions by running a VLM on 4-8 keyframes from each episode. The VLM prompt should include the task name and object list to constrain the output. (2) Human annotators verify and correct each draft, fixing object descriptions, spatial references, and action verbs. This reduces annotation time from 60 seconds per episode (writing from scratch) to 20-30 seconds (verify and edit). Track the auto-draft acceptance rate — if it falls below 70%, the VLM prompt needs refinement.\n\nCommon pitfalls: (1) Ambiguous references — 'put it there' is useless for training; every instruction must uniquely identify the object and the target location. (2) Incorrect attributes — labeling a blue mug as 'green' creates contradictory training signal. (3) Over-specification — 'move the gripper 15.3 cm to the left' is too specific and will not generalize. (4) Under-specification — 'do the task' teaches the model nothing about language grounding. Aim for the Goldilocks zone: specific enough to disambiguate, general enough to transfer.",
      tools: ["VLM API (GPT-4V, Gemini)", "Label Studio text annotation", "Style guide document"],
      tips: ["Create 5 template instructions per task type that annotators can adapt — this ensures consistent vocabulary and level of detail across annotators and reduces writing fatigue"],
    },
    {
      stepNumber: 4,
      title: "Apply Temporal Segmentation and Phase Labels",
      description: "Temporal segmentation divides each demonstration episode into manipulation phases, enabling phase-conditioned policy training and allowing researchers to analyze which phase contributes most to task failure. The standard phase taxonomy for manipulation is: idle (robot stationary, not yet engaged), approach (moving toward the target object), pre-grasp (positioning the gripper for contact), grasp (closing the gripper on the object), post-grasp (stabilizing the grip, possibly adjusting), transport (moving the grasped object to the target location), pre-place (positioning for release), place (opening the gripper and releasing), and retract (withdrawing the gripper from the workspace).\n\nAnnotate phase transitions by identifying the frame where each phase begins. Use velocity and force signals as guides: the approach phase typically begins when end-effector velocity exceeds a threshold (moving toward the object), the grasp phase begins at force onset (gripper contacts the object), and the place phase begins at force reduction (object contacts the surface and gripper force decreases). For a 30 Hz video with 5-10 second episodes, each episode has 150-300 frames and 4-8 phase transitions, taking 1-2 minutes to segment with a well-designed timeline interface.\n\nFor datasets that will train hierarchical or options-based policies, add sub-phase labels within each major phase. For example, within 'approach': visual_servo (using camera feedback to align with object), blind_approach (final approach without visual feedback, relying on proprioception), and compliance_insertion (using force feedback for tight-clearance approaches). These sub-phase labels require annotators with robotics knowledge and take 3-5 minutes per episode.",
      tools: ["Label Studio timeline annotation", "Custom phase visualization scripts", "Action velocity and force waveform rendering"],
      tips: ["Automate the easy transitions first — grasp onset (force > threshold) and transport start (velocity > threshold after grasp) can be detected automatically, leaving annotators to handle only the ambiguous transitions like approach-to-pre-grasp"],
    },
    {
      stepNumber: 5,
      title: "Score Demonstration Quality and Flag Edge Cases",
      description: "Not all successful demonstrations are equally useful for training. A demonstration where the robot picks up an object efficiently (direct approach, clean grasp, smooth transport) teaches better manipulation behavior than one where the robot fumbles, re-grasps, and takes a circuitous path. Quality scoring enables weighted training where high-quality demonstrations contribute more to the loss function.\n\nUse a 1-5 quality scale: (1) Barely successful — multiple attempts, near-failures, very inefficient path. (2) Functional — completed the task but with unnecessary motions or hesitation. (3) Competent — reasonable execution with minor inefficiencies. (4) Skilled — efficient, smooth execution with good grasp selection. (5) Expert — optimal execution, could not be improved. Annotators watch the full episode video and assign a single quality score based on their overall impression of the execution.\n\nAdditionally, flag edge cases that deserve special attention during model development: near-miss grasps (success but gripper barely contacted the object), unusual object configurations (objects stacked, occluded, or in non-standard poses), and multi-strategy demonstrations (episodes where the robot used a different approach than the majority, such as a side-grasp instead of the typical top-down grasp). These flagged episodes are valuable for debugging policy failures and should be included in evaluation sets even if their quality score is low.",
      tools: ["Label Studio rating interface", "Custom quality score calibration set"],
      tips: ["Calibrate quality scores by having all annotators score the same 50 episodes, then discuss and resolve any score disagreements above 1 point — this calibration session dramatically improves consistency for the remaining episodes"],
    },
    {
      stepNumber: 6,
      title: "Validate Annotation Quality and Compute Agreement Metrics",
      description: "After annotation is complete, validate quality through inter-annotator agreement measurement and systematic error detection. Assign 15-20% of episodes to two independent annotators and compute agreement metrics for each label type.\n\nFor binary labels (success/failure): compute Cohen's kappa, targeting kappa > 0.85. For categorical labels (failure taxonomy, phase labels): compute Fleiss' kappa across all categories, targeting kappa > 0.75. For temporal segmentation: compute the mean absolute difference in phase transition timestamps between annotators, targeting < 5 frames (167 ms at 30 Hz). For quality scores: compute intra-class correlation coefficient (ICC), targeting ICC > 0.70. For language instructions: use BERTScore or sentence-BERT cosine similarity between the two annotators' instructions, targeting similarity > 0.80.\n\nIf any metric falls below the threshold, investigate the source of disagreement. Common causes: ambiguous taxonomy definitions (fix the taxonomy document and re-train), poorly designed annotation interface (improve visual aids), annotator fatigue (reduce session length or add breaks), and genuine ambiguity in the data (some episodes are truly ambiguous and should be flagged, not forced into a label). After resolving disagreements, produce the final label set by taking the senior annotator's label for disagreed items, or by majority vote if three annotators are available.\n\nPackage the labeled dataset with full provenance: who annotated each episode, the agreement scores, and the taxonomy version used. This metadata enables downstream users to filter by annotation confidence and to identify episodes that may need re-labeling if the taxonomy evolves.",
      tools: ["Python (statsmodels for kappa, sklearn for ICC)", "BERTScore", "Custom agreement dashboard"],
      tips: ["Run agreement validation after the first 500 episodes, not at the end — catching taxonomy ambiguities early saves re-labeling thousands of episodes"],
    },
  ],
  keyPapers: [
    { id: "brohan-rt2-2023", title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", authors: "Brohan et al.", venue: "arXiv 2307.15818", year: 2023, url: "https://arxiv.org/abs/2307.15818" },
    { id: "team-octo-2024", title: "Octo: An Open-Source Generalist Robot Policy", authors: "Octo Model Team", venue: "arXiv 2405.12213", year: 2024, url: "https://arxiv.org/abs/2405.12213" },
    { id: "chi-diffusion-2023", title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion", authors: "Chi et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2303.04137" },
  ],
  claruRelevance: "Claru provides end-to-end robot demonstration labeling services. Our annotators are trained on robotics-specific label taxonomies and use custom annotation interfaces with video playback, action trajectory overlays, and force/velocity waveforms. We pre-generate draft language instructions using VLMs and have human annotators verify and correct them, reducing cost by 40%. We track inter-annotator agreement on every batch and maintain kappa > 0.85 on success labels and > 0.75 on categorical labels. All annotations are delivered with full provenance metadata, agreement scores, and taxonomy documentation.",
};

export default data;
