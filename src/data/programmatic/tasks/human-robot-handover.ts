import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "human-robot-handover",
  metaTitle: "Human-Robot Handover Training Data | Claru",
  metaDescription: "Training data for human-robot handovers: giving and receiving objects, timing prediction, grasp adaptation. Multi-modal recordings of natural human-robot object exchange.",
  primaryKeyword: "human-robot handover training data",
  secondaryKeywords: ["robot handover dataset", "human-robot exchange data", "object handover demonstrations", "collaborative robot handover"],
  canonicalPath: "/training-data/human-robot-handover",
  h1: "Human-Robot Handover Training Data",
  heroSubtitle: "Natural human-robot object exchange datasets — timing prediction, adaptive grasp placement, load transfer dynamics, and socially-aware handover behavior with multi-modal sensor recordings spanning diverse objects, participants, and interaction contexts.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Human-Robot Handover", href: "/training-data/human-robot-handover" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Human-Robot Handover and Why Is It a Critical Capability?",
      paragraphs: [
        "Human-robot handover — the act of transferring an object between a human hand and a robot gripper — is one of the most fundamental capabilities for collaborative robots (cobots) deployed alongside humans. Every assistive, manufacturing, surgical, or service robot that operates in human environments must give objects to people and receive objects from them. A warehouse cobot passing a tool to a technician, a surgical assistant handing an instrument to a surgeon, a home robot delivering a glass of water — all require fluent handover behavior. The market for collaborative robots (cobots) is projected to exceed $12 billion by 2030, and handover capability is a prerequisite for most cobot applications.",
        "The difficulty lies in the interaction dynamics. Unlike pick-and-place manipulation where the robot acts alone, handover involves a reactive partner: the human. The robot must predict when the human is ready to receive (or give) the object, position the object where the human can comfortably grasp it, release at the right moment (too early drops the object, too late feels like a tug-of-war), and adapt to the human's reaching speed, grip preferences, and body posture. Human handover behavior is remarkably nuanced — we unconsciously orient a mug with the handle toward the receiver, hand a knife handle-first, and adjust our release timing based on whether the receiver has established a firm grip. Replicating this social intelligence in a robot requires training data that captures the full spectrum of human handover behavior.",
        "The data challenge is twofold. First, handover is inherently a two-agent interaction, requiring synchronized capture of both human motion (hand pose, body pose, gaze direction) and robot state (joint positions, gripper force, end-effector trajectory). Second, handover preferences are culturally and individually variable: preferred handover height, approach direction, and timing differ between people, and the 'right' behavior depends on the object (fragile items handed slowly, heavy items with clear load-transfer signaling). Training data must cover sufficient participant diversity to prevent the policy from overfitting to a single person's handover style.",
      ],
    },
    {
      type: "stats",
      heading: "Human-Robot Handover Data at a Glance",
      stats: [
        { value: "2K-20K", label: "Handover episodes needed" },
        { value: "<500ms", label: "Human patience for robot hesitation" },
        { value: "$12B", label: "Cobot market by 2030" },
        { value: "30+", label: "Participant diversity target" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Handover Type",
      description: "Different handover configurations require different sensor stacks and training volumes.",
      columns: ["Handover Type", "Data Volume", "Key Modalities", "Critical Challenge", "Timing Constraint"],
      rows: [
        { "Handover Type": "Robot-to-human (giving)", "Data Volume": "1K-5K episodes", "Key Modalities": "RGB + hand tracking + F/T + proprioception", "Critical Challenge": "Timing release to human grip establishment", "Timing Constraint": "Release within 200ms of grip detection" },
        { "Handover Type": "Human-to-robot (receiving)", "Data Volume": "2K-10K episodes", "Key Modalities": "RGB + hand tracking + depth + F/T", "Critical Challenge": "Predicting human intent + grasp pose selection", "Timing Constraint": "Pre-position gripper within 1s of offer" },
        { "Handover Type": "Moving handover (walking)", "Data Volume": "1K-5K episodes", "Key Modalities": "RGB + body tracking + F/T + navigation", "Critical Challenge": "Coordinating robot motion with walking human", "Timing Constraint": "Match walking speed + hand within 0.5s" },
        { "Handover Type": "Tool handover (oriented)", "Data Volume": "2K-10K episodes", "Key Modalities": "RGB + object pose + hand tracking + F/T", "Critical Challenge": "Presenting handle/grip-end to receiver", "Timing Constraint": "Hold orientation stable for 1-2s" },
        { "Handover Type": "Heavy object handover", "Data Volume": "1K-3K episodes", "Key Modalities": "RGB + F/T + body pose + load cell", "Critical Challenge": "Coordinating load transfer (shared support phase)", "Timing Constraint": "Gradual load transfer over 0.5-2s" },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Human-Robot Handover Research",
      paragraphs: [
        "Early handover systems used hard-coded rules: detect that a human hand is within a distance threshold, wait for grip force above a threshold, then release. These reactive systems are slow and awkward — the robot holds the object rigidly until the human grabs it, then abruptly releases, producing a jerky, unnatural exchange. The HandoverSim benchmark (Chao et al., CVPR 2022) formalized evaluation metrics for handover: success rate, handover duration (time from human reach initiation to complete transfer), and human effort (how much the human must adjust their reach). Their results showed that even well-tuned reactive controllers achieve handover durations 2-3x longer than human-human handovers.",
        "Learning-based approaches have progressed through three generations. Prediction-based methods (Yang et al., ICRA 2021) learn to predict the human's reaching trajectory from early motion cues (the first 200-500 ms of arm motion), enabling the robot to pre-position the object at the predicted receiving location before the human's hand arrives. These methods require 2,000-5,000 handover recordings with full body pose tracking to learn reaching trajectory prediction. Reactive force-based methods (Rosenberger et al., RA-L 2021) use force/torque sensing to detect when the human has established a grip and modulate the robot's grip force smoothly during the transfer phase, producing a more natural shared-support period rather than an abrupt release. The current state of the art combines both: predict the human's intent and pre-position the object, then use force feedback to execute a smooth load transfer.",
        "The Yang et al. (CoRL 2022) study on socially-aware handover demonstrated that humans prefer robots that orient objects for easy grasping (handle toward receiver), maintain eye-level presentation height, and approach from the front-right for right-handed receivers. Their policy, trained on 3,000 handover demonstrations with post-interaction human preference ratings, achieved a 4.2/5.0 naturalness score compared to 2.8/5.0 for a baseline reactive controller. The key data insight: handover quality requires not just success/failure labels but human subjective ratings of comfort, naturalness, and perceived safety. These preference annotations are expensive but essential for training socially fluent handover behavior.",
        "Multi-object and context-dependent handover is an emerging frontier. Handing a full coffee mug requires different orientation, speed, and grip than handing a pencil or a heavy wrench. Current datasets cover 10-30 object types, but production deployment in diverse environments requires handling hundreds of object categories with varying mass (1 g to 5 kg), fragility, sharp edges, and temperature. The training data must pair each object type with the appropriate handover strategy, including warnings for dangerous objects (sharp, hot, heavy) communicated through robot motion hesitation or verbal cues.",
      ],
    },
    {
      type: "prose",
      heading: "Sensor Stack and Collection Methodology for Handover Data",
      paragraphs: [
        "Handover data collection requires capturing both the robot and the human partner simultaneously, at sufficient resolution to model the interaction dynamics. The robot-side sensor stack includes: wrist-mounted RGB-D camera (for close-up view of the handover zone), proprioceptive data (joint positions and velocities at 50-100 Hz), and a 6-axis force/torque sensor at the wrist (for grip force and load transfer detection at 100-500 Hz). The human-side sensor stack includes: hand tracking (MediaPipe, Leap Motion, or marker-based OptiTrack for sub-millimeter accuracy), body pose estimation (from RGB cameras using SMPL-based methods or motion capture suit), and optionally eye gaze tracking (Tobii Pro Glasses or Pupil Labs) to capture attentional cues that predict handover intent.",
        "Participant recruitment is critical. Handover behavior varies with age, height, hand size, handedness, and cultural background. Datasets collected with only lab members (typically 5-10 young, tech-savvy adults) produce policies that fail on elderly users, children, or people with motor impairments. Claru's handover collection protocol requires a minimum of 30 unique participants spanning: age range (18-75), gender balance, left- and right-handed (minimum 20% left-handed), standing height range (150-190 cm), and no more than 3 participants from any single demographic group. Each participant performs 50-100 handover exchanges (both giving and receiving) with the robot, producing 1,500-3,000 episodes per collection campaign.",
        "The object set must span the physical diversity of real handover scenarios. We use a standardized object kit of 30-50 items organized by handover strategy type: symmetric objects (balls, cylinders — no orientation preference), handled objects (mugs, tools, scissors — handle orientation matters), fragile objects (eggs, glass cups — require slow approach and gentle grip), heavy objects (1-5 kg weights, books — require shared support phase), and dangerous objects (scissors, knives — require handle-first presentation and verbal warning). Each object is labeled with mass, center-of-mass location, preferred grasp type, and handover orientation rules.",
        "Annotation captures both the physical dynamics and the social quality of each handover. Physical annotations include: handover initiation timestamp (when the giver begins extending the object), grasp-establishment timestamp (when the receiver's grip reaches sufficient force), release-completion timestamp (when the giver fully releases), load transfer profile (force over time during the shared-support phase), and success/failure with failure taxonomy (dropped, human refusal to reach, collision, timeout). Social quality annotations are collected post-episode: the human participant rates each handover on a 1-5 scale for naturalness, comfort, perceived safety, and timing appropriateness. These ratings provide the reward signal for training preference-aligned handover policies.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets for Human-Robot Handover Research",
      columns: ["Dataset", "Year", "Scale", "Participants", "Objects", "Annotations"],
      rows: [
        { "Dataset": "HandoverSim", "Year": "2022", "Scale": "720 episodes (sim)", "Participants": "N/A (sim)", "Objects": "20 YCB objects", "Annotations": "Success + duration + effort" },
        { "Dataset": "Yang et al. Handover", "Year": "2022", "Scale": "3K episodes", "Participants": "20", "Objects": "15 objects", "Annotations": "Body pose + preference ratings" },
        { "Dataset": "Rosenberger F/T Handover", "Year": "2021", "Scale": "1.2K episodes", "Participants": "12", "Objects": "10 objects", "Annotations": "Force profiles + grip timing" },
        { "Dataset": "H2R Handover (CMU)", "Year": "2023", "Scale": "5K episodes", "Participants": "30", "Objects": "25 objects", "Annotations": "Hand pose + F/T + success" },
        { "Dataset": "Claru Custom", "Year": "2026", "Scale": "2K-20K+", "Participants": "30+", "Objects": "30-50 objects", "Annotations": "Full physical + social quality" },
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        { id: "chao-handoversim-2022", title: "HandoverSim: A Simulation Framework and Benchmark for Human-to-Robot Object Handovers", authors: "Chao et al.", venue: "CVPR 2022", year: 2022, url: "https://arxiv.org/abs/2205.09747" },
        { id: "yang-reactive-handover-2021", title: "Reactive Human-to-Robot Handovers of Arbitrary Objects", authors: "Yang et al.", venue: "ICRA 2021", year: 2021, url: "https://arxiv.org/abs/2011.08961" },
        { id: "rosenberger-force-handover-2021", title: "Object-Independent Human-to-Robot Handovers Using Real Time Robotic Vision", authors: "Rosenberger et al.", venue: "IEEE RA-L 2021", year: 2021, url: "https://doi.org/10.1109/LRA.2020.3037870" },
        { id: "yang-social-handover-2022", title: "Model Predictive Control for Fluid Human-to-Robot Handovers", authors: "Yang et al.", venue: "CoRL 2022", year: 2022, url: "https://arxiv.org/abs/2203.17134" },
      ],
    },
  ],
  faqs: [
    {
      question: "How many handover demonstrations are needed for a fluent handover policy?",
      answer: "For a basic reactive handover with a single gripper type, 500-1,000 episodes (from 10+ participants) achieve functional performance. For a socially-aware policy that adapts object orientation, approach direction, and timing to participant preferences, 3,000-10,000 episodes from 30+ participants are recommended. For multi-object policies that handle orientation-dependent objects (tools, mugs) and fragile items, budget 200-500 episodes per object category. The most impactful diversity axis is participant count — 2,000 episodes from 30 people outperforms 5,000 episodes from 5 people on generalization metrics.",
    },
    {
      question: "Why do you need force/torque sensing for handover data?",
      answer: "Force/torque sensing at the robot wrist is essential for two reasons. First, it enables detecting when the human has established a sufficient grip during robot-to-human handovers — the force profile shows a characteristic signature when the human begins pulling (3-8 N for typical objects) that triggers the robot's release sequence. Second, it captures the load transfer dynamics during the shared-support phase, where both human and robot simultaneously hold the object. Smooth load transfer (gradual force ramp rather than abrupt release) is the primary determinant of handover naturalness. Without F/T data, the policy cannot learn when to release or how to modulate its grip during transfer.",
    },
    {
      question: "How do you collect human preference ratings for handover quality?",
      answer: "After every 5-10 handover episodes, the human participant rates the most recent block on four dimensions using a tablet interface: naturalness (1-5), comfort (1-5), perceived safety (1-5), and timing appropriateness (1-5). This intermittent rating approach avoids survey fatigue while producing 100-200 ratings per participant session. Additionally, each episode is flagged for specific issues: 'robot hesitated too long,' 'approach was too fast,' 'object presented at wrong angle,' or 'release timing felt off.' These annotations provide the preference signal for RLHF-style policy refinement and are far more informative than binary success/failure labels.",
    },
    {
      question: "What participant diversity is needed for handover datasets?",
      answer: "Participant diversity is the strongest predictor of policy generalization for handover tasks. At minimum, recruit 30 unique participants with balanced representation across: age (18-75 range, including 5+ participants over 60), gender, handedness (20%+ left-handed), standing height range (150-190 cm), and arm reach ability. Include participants with mild motor limitations if the deployment context includes elderly or disabled users. No single demographic subgroup should represent more than 20% of total participants. Record participant demographics as metadata so the dataset can be analyzed for demographic bias in handover success rates.",
    },
    {
      question: "How should objects be selected for a handover dataset?",
      answer: "Organize objects by handover strategy type, not just physical category. Symmetric objects (balls, cubes) teach basic positional handover. Handled objects (mugs, scissors, wrenches) teach orientation-dependent presentation. Fragile objects (eggs, wine glasses) teach slow approach and gentle release. Heavy objects (1-5 kg dumbbells, thick books) teach the shared-support phase with gradual load transfer. Dangerous objects (kitchen knives, sharp tools) teach handle-first orientation and cautious approach speed. Include at least 3 objects per strategy type. Record each object's mass, center of mass, preferred grip type, and orientation rules as metadata.",
    },
    {
      question: "How does handover data differ between manufacturing and healthcare contexts?",
      answer: "Manufacturing and healthcare handovers differ in timing constraints, safety requirements, and object characteristics. In manufacturing, handovers prioritize speed and throughput — a worker receiving a tool from a cobot expects it within 1-2 seconds and wants minimal disruption to their workflow rhythm. Objects are typically rigid tools or parts with standardized shapes. Safety focuses on force limiting and collision avoidance per ISO/TS 15066 collaborative robot standards. In healthcare, handovers prioritize precision and gentleness — a surgeon receiving an instrument needs exact orientation (scalpel blade angle, forceps jaw direction) and a clean transfer zone free of contamination risk. Timing is slower but precision is higher. Objects include surgical instruments (long, thin, sharp), medication containers (small, sometimes fragile), and assistive devices (cups, utensils adapted for limited grip strength). Healthcare handover data must additionally annotate sterile zone compliance and instrument orientation correctness. Collecting data in both contexts requires different participant pools, object sets, and annotation protocols.",
    },
    {
      question: "Can simulation supplement real handover data?",
      answer: "Simulation is useful for pretraining handover prediction models but has significant limitations for the full handover pipeline. Simulated human motion (from models like SMPL-X or generated by motion synthesis networks) captures the biomechanics of reaching but lacks the micro-adjustments, hesitations, and gaze cues that real humans exhibit during object exchange. The HandoverSim benchmark provides a simulated environment for human-to-robot handover evaluation, but policies trained solely in HandoverSim achieve handover durations 2-3x longer than those fine-tuned with real human interaction data. The key gap is that human handover behavior is inherently social and reactive — real humans adjust their reaching speed based on whether the robot appears ready, redirect their grasp when the robot presents the object at an unexpected angle, and communicate frustration through body language when the robot hesitates too long. These social dynamics are absent from simulation. We recommend 10,000+ simulated handover trajectories for pretraining motion prediction, then 2,000-5,000 real episodes with diverse participants for policy fine-tuning.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Human-Robot Handover Data",
  ctaDescription: "Tell us your cobot platform, target deployment context (manufacturing, healthcare, service), object categories, and participant diversity requirements. We will design a collection campaign with the right participant pool, object set, and annotation depth.",
  relatedGlossaryTerms: ["manipulation-trajectory", "behavioral-cloning", "imitation-learning", "hand-object-interaction"],
  relatedGuidePages: ["how-to-build-a-manipulation-dataset", "how-to-collect-dexterous-manipulation-data"],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "RGB-D (wrist + external) + hand tracking + body pose + F/T (100-500 Hz) + eye gaze (optional)",
    volumeRange: "2K-20K handover episodes from 30+ participants",
    temporalResolution: "30 Hz video, 60 Hz hand tracking, 100-500 Hz force/torque, 50 Hz proprioception",
    keyAnnotations: ["Handover initiation/grasp-establishment/release timestamps", "Load transfer force profiles", "Object orientation correctness", "Human preference ratings (naturalness, comfort, safety, timing)", "Failure taxonomy (dropped, collision, timeout, refusal)"],
  },
  relevantModels: ["Handover timing prediction networks", "Grasp pose optimization for handover", "Social preference models (RLHF)", "Human body pose forecasting", "Force-based release controllers"],
  environmentTypes: ["Tabletop (seated)", "Standing workspace", "Collaborative manufacturing cell", "Kitchen / domestic", "Clinical / surgical"],
  keyPapers: [
    { id: "chao-handoversim-2022", title: "HandoverSim: A Simulation Framework and Benchmark for Human-to-Robot Object Handovers", authors: "Chao et al.", venue: "CVPR 2022", year: 2022, url: "https://arxiv.org/abs/2205.09747" },
    { id: "yang-reactive-handover-2021", title: "Reactive Human-to-Robot Handovers of Arbitrary Objects", authors: "Yang et al.", venue: "ICRA 2021", year: 2021, url: "https://arxiv.org/abs/2011.08961" },
    { id: "rosenberger-force-handover-2021", title: "Object-Independent Human-to-Robot Handovers Using Real Time Robotic Vision", authors: "Rosenberger et al.", venue: "IEEE RA-L 2021", year: 2021, url: "https://doi.org/10.1109/LRA.2020.3037870" },
    { id: "yang-social-handover-2022", title: "Model Predictive Control for Fluid Human-to-Robot Handovers", authors: "Yang et al.", venue: "CoRL 2022", year: 2022, url: "https://arxiv.org/abs/2203.17134" },
  ],
  claruRelevance: "Claru collects human-robot handover data with calibrated multi-sensor rigs capturing both robot state and human motion simultaneously. Our participant recruitment process ensures minimum 30 unique participants per campaign with demographic diversity tracking. We maintain a standardized object kit of 30-50 items organized by handover strategy type (symmetric, handled, fragile, heavy, dangerous) with full physical metadata. Annotations include precise timing labels (initiation, grasp-establishment, release), force/torque load-transfer profiles, object orientation correctness checks, and human preference ratings on naturalness, comfort, safety, and timing — all collected through a structured in-session rating protocol. We deliver in RLDS, HDF5, or custom formats with full sensor calibration, participant demographics (anonymized), object metadata, and stratified splits by participant, object category, and handover direction.",
};

export default data;
