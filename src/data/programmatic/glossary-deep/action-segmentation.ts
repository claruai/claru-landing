import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "action-segmentation",
  termSlug: "action-segmentation",
  category: "annotation-types",
  metaTitle: "Action Segmentation — Temporal Annotation for Robot Learning | Claru",
  metaDescription: "Action segmentation divides continuous video into labeled temporal intervals of discrete activities. Learn how temporal action boundaries drive robot skill learning and what annotation protocols produce training-ready segments.",
  primaryKeyword: "action segmentation",
  secondaryKeywords: ["temporal action segmentation", "action boundary detection", "activity segmentation", "temporal annotation robotics", "video action parsing"],
  canonicalPath: "/glossary/action-segmentation",
  h1: "Action Segmentation: Temporal Parsing of Continuous Activity for Robot Learning",
  heroSubtitle: "Action segmentation partitions untrimmed video streams into temporal intervals, each labeled with a discrete action class. In robotics, precise action boundaries determine where one skill ends and another begins — enabling modular policy learning, task decomposition, and hierarchical planning from demonstration data.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Action Segmentation", href: "/glossary/action-segmentation" },
  ],
  sections: [],
  faqs: [
    {
      question: "What is the difference between action segmentation and action recognition?",
      answer: "Action recognition classifies a pre-trimmed video clip into a single action category — the temporal boundaries are already provided. Action segmentation operates on untrimmed, continuous video and must simultaneously determine where each action starts and ends and what action is being performed. This joint boundary detection and classification problem is substantially harder because the model must handle smooth transitions between actions, ambiguous intermediate states, and variable-duration activities. In robotics, action segmentation is the more practically relevant task because robot demonstrations are continuous streams, not pre-cut clips. Models like MS-TCN (Farha & Gall, 2019) and ASFormer (Yi et al., 2021) were specifically designed for the segmentation variant."
    },
    {
      question: "How many annotated videos are needed to train an action segmentation model?",
      answer: "Standard benchmarks like Breakfast Actions (1,712 videos, 48 action classes) and 50 Salads (50 videos, 17 action classes) demonstrate that effective segmentation models can be trained with surprisingly modest data — 50 Salads achieves strong results with only 50 densely annotated sequences. For robotics-specific applications with 10-30 action classes, 200-500 fully annotated demonstrations typically suffice for temporal convolutional or Transformer-based segmentation models. The critical factor is annotation density: every frame must be labeled, and boundary precision within 1-3 frames significantly impacts downstream policy quality. Semi-supervised methods like timestamp supervision (Li et al., 2021) reduce annotation cost by requiring only a single timestamp per action instance rather than full boundary annotations."
    },
    {
      question: "What annotation tools are used for action segmentation labeling?",
      answer: "The most widely used tools for temporal action annotation include ELAN (developed at Max Planck Institute for Psycholinguistics), ANVIL, and VIA (VGG Image Annotator). For robotics-scale datasets, teams often build custom annotation interfaces that display the video timeline alongside robot state signals (joint positions, gripper state, force/torque readings), making it easier for annotators to identify precise action boundaries. The key design consideration is frame-level labeling efficiency — annotators typically mark start and end timestamps and assign a label, with the tool interpolating the label across all intermediate frames. Quality control involves inter-annotator agreement metrics, with Cohen's kappa above 0.8 considered acceptable for boundary consistency."
    },
    {
      question: "How does action segmentation improve robot learning from demonstrations?",
      answer: "Action segmentation enables three critical capabilities for robot learning. First, it supports hierarchical policy learning by decomposing long-horizon tasks into manageable sub-skills — a 5-minute assembly task becomes a sequence of 15-20 primitive actions that can each be learned independently. Second, it enables skill reuse: once a 'grasp' segment is identified across multiple demonstrations, the robot can learn a single grasp policy and reuse it in different task contexts. Third, segmentation provides the temporal structure needed for task-and-motion planning, where a high-level planner sequences skills and a low-level policy executes each skill. Without segmentation, end-to-end policies must implicitly learn both the task structure and the motor control, requiring significantly more data."
    },
    {
      question: "What are the main failure modes of action segmentation in robotics data?",
      answer: "The three most common failure modes are over-segmentation, boundary ambiguity, and class confusion during transitions. Over-segmentation occurs when the model fragments a single continuous action into multiple short segments, often triggered by brief pauses or hesitations in the demonstrator's motion. Boundary ambiguity arises during gradual transitions — when does 'reaching' end and 'grasping' begin? Different annotators may disagree by 5-15 frames. Class confusion during transitions happens because intermediate states between two actions may visually resemble a third action entirely. Mitigation strategies include temporal smoothing with minimum segment duration constraints, hierarchical segmentation with coarse-to-fine refinement, and training with boundary-aware loss functions that down-weight ambiguous transition frames."
    }
  ],
  ctaHeading: "Need Temporally Segmented Demonstration Data?",
  ctaDescription: "Claru provides frame-level action annotations on robot demonstrations and egocentric video. Tell us about your task vocabulary and we will deliver segmented datasets ready for skill learning.",
  relatedGlossaryTerms: ["temporal-annotation", "activity-annotation", "egocentric-video", "behavioral-cloning"],
  relatedGuidePages: ["how-to-create-temporal-annotations-for-video"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  longDefinition: "Action segmentation is the task of partitioning an untrimmed video sequence into non-overlapping temporal segments, each assigned a discrete action label from a predefined vocabulary. Given a video of T frames, the goal is to produce a sequence of labels y_1, y_2, ..., y_T where each y_t belongs to a set of K action classes. Unlike action recognition, which classifies pre-trimmed clips, segmentation must jointly solve boundary detection and classification on continuous, variable-length input.\n\nThe technical challenge stems from the temporal structure of activities. Actions vary dramatically in duration — a 'reach' might last 15 frames while a 'pour' lasts 200 frames. Adjacent actions share visual and motion features during transitions, creating ambiguous boundary regions. Modern architectures address these challenges through multi-scale temporal modeling. MS-TCN (Farha & Gall, 2019) introduced multi-stage temporal convolutional networks that apply successive refinement stages, each operating on the full temporal resolution. ASFormer (Yi et al., 2021) replaced the convolutional backbone with self-attention, capturing long-range temporal dependencies more effectively.\n\nIn robotics, action segmentation serves a specific purpose beyond video understanding: it decomposes continuous demonstrations into discrete skills that can be individually learned, composed, and transferred. A single 3-minute demonstration of a table-setting task might be segmented into 20-30 primitive actions (reach-plate, grasp-plate, place-plate, release, reach-fork, ...). Each segment provides a self-contained training example for a skill-specific policy, enabling modular learning that scales better than monolithic end-to-end approaches.\n\nThe annotation protocol for robotics data differs from standard video datasets. Robot demonstrations include multi-modal signals — RGB video, depth maps, joint positions, gripper states, force/torque readings — that provide supplementary evidence for boundary detection. A gripper closing event, for instance, unambiguously marks the transition from 'reaching' to 'grasping'. Annotation interfaces that display these auxiliary signals alongside video reduce annotator effort and improve boundary precision from approximately 10-frame uncertainty to 2-3 frames.",
  historicalContext: "Temporal action segmentation emerged from the broader activity recognition community in the mid-2000s. Early approaches applied Hidden Markov Models (HMMs) to hand-crafted features like improved Dense Trajectories (iDT), treating action sequences as stochastic processes with discrete hidden states. The Breakfast Actions dataset (Kuehne et al., 2014) and 50 Salads (Stein & McKenna, 2013) established the first standardized benchmarks, focusing on cooking activities filmed from fixed third-person cameras.\n\nThe transition to deep learning began with Temporal Convolutional Networks. Lea et al. (2017) introduced TCN architectures for action segmentation, demonstrating that 1D convolutions over temporal feature sequences outperformed recurrent approaches. Farha and Gall (2019) extended this with MS-TCN, a multi-stage architecture where each stage refines the predictions of the previous one, achieving significant improvements in boundary precision. This refinement paradigm became the dominant design pattern.\n\nThe Transformer era brought ASFormer (Yi et al., 2021), which replaced convolutions with self-attention for capturing long-range dependencies, and DiffAct (Liu et al., 2023), which applied denoising diffusion to temporal segmentation. Concurrently, the robotics community adopted action segmentation for demonstration parsing. The IKEA Assembly dataset (Ben-Shabat et al., 2021) and the Assembly101 benchmark (Sener et al., 2022) bridged the gap between kitchen activity understanding and manipulation skill decomposition, using multi-view video of procedural assembly tasks with fine-grained temporal annotations. Weakly-supervised methods that require only action ordering or timestamps rather than full frame-level labels have reduced annotation cost substantially, making large-scale robotics annotation feasible.",
  practicalImplications: "For teams building robot learning pipelines, action segmentation is a prerequisite for any hierarchical or compositional approach to policy learning. The practical workflow involves three stages: collecting demonstrations, annotating temporal boundaries, and training segmentation models that can automatically segment new demonstrations at scale.\n\nAnnotation quality is the single largest determinant of downstream policy performance. Frame-level labels with inconsistent boundaries inject noise into skill learning — if the 'grasp' segment sometimes includes the final 10 frames of 'reaching,' the grasp policy learns contradictory initial conditions. Industry practice is to use a two-pass annotation protocol: a first pass marks approximate boundaries, and a second pass by a different annotator refines boundaries to within 2-3 frames. Inter-annotator agreement (measured by segmental edit distance or F1@10) should exceed 85% before the dataset is considered training-ready.\n\nThe choice of action vocabulary is a critical design decision. Too few classes (5-8) force semantically distinct actions into the same category. Too many classes (50+) create sparse segments that are difficult to learn. The practical sweet spot for manipulation tasks is 15-30 action classes organized in a two-level hierarchy — coarse categories (reach, grasp, transport, place, release) refined by context (grasp-cup, grasp-plate). This hierarchical vocabulary supports both coarse task planning and fine-grained skill learning.\n\nAutomatic segmentation models can bootstrap annotation at scale once a seed dataset of 200-500 manually annotated demonstrations is available. The model segments new demonstrations automatically, and annotators correct errors rather than labeling from scratch — reducing per-demonstration annotation time from 15-20 minutes to 3-5 minutes. This human-in-the-loop approach is how production-scale datasets of 10,000+ segmented demonstrations are built economically.",
  commonMisconceptions: [
    {
      misconception: "Action segmentation requires every frame to be independently classified by a human annotator.",
      correction: "Modern annotation protocols use boundary-based labeling: annotators mark the start and end frame of each action, and all intermediate frames inherit the label automatically. This reduces annotation to marking 20-40 boundaries per 3-minute demonstration rather than classifying 5,400 individual frames. Semi-supervised methods like timestamp supervision (Li et al., 2021) further reduce requirements to a single timestamp per action instance, achieving 80-90% of fully supervised performance."
    },
    {
      misconception: "Action segmentation is solved by simply thresholding robot state changes like gripper open/close.",
      correction: "While gripper state changes provide useful boundary cues, they only capture a subset of action transitions. Many semantically meaningful boundaries — transitioning from 'aligning' to 'inserting,' or from 'stirring' to 'scooping' — occur without any discrete state change. Vision-based segmentation models capture these continuous transitions that rule-based state thresholding misses. In practice, combining state-change heuristics with learned segmentation models yields the best results, with heuristics providing high-precision boundary candidates and learned models filling in the gaps."
    },
    {
      misconception: "Longer videos are always harder to segment than shorter ones.",
      correction: "Segmentation difficulty depends more on the number of action transitions and the ambiguity of boundaries than on absolute video length. A 10-minute video with 15 well-separated actions is easier to segment than a 2-minute video with 30 rapid, overlapping micro-actions. The Breakfast Actions benchmark contains videos averaging 2.3 minutes with relatively clear boundaries, while Assembly101 has shorter clips with much denser transitions and lower segmentation accuracy. For robotics, fast manipulation sequences with sub-second actions (like the 'place-insert-screw' sequence in assembly) remain the hardest segmentation challenge."
    }
  ],
  keyPapers: [
    {
      id: "farha-mstcn-2019",
      title: "MS-TCN: Multi-Stage Temporal Convolutional Network for Action Segmentation",
      authors: "Farha & Gall",
      venue: "CVPR 2019",
      year: 2019,
      url: "https://arxiv.org/abs/1903.01945"
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
      id: "sener-assembly101-2022",
      title: "Assembly101: A Large-Scale Multi-View Video Dataset for Understanding Procedural Activities",
      authors: "Sener et al.",
      venue: "CVPR 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2203.14712"
    },
    {
      id: "liu-diffact-2023",
      title: "DiffAct: Diffusion Action Segmentation",
      authors: "Liu et al.",
      venue: "ICCV 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.09454"
    },
    {
      id: "li-timestamp-2021",
      title: "Temporal Action Segmentation from Timestamp Supervision",
      authors: "Li et al.",
      venue: "CVPR 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2103.06669"
    }
  ],
  claruRelevance: "Claru provides frame-level temporal action annotations on demonstration and egocentric video data, the exact annotation type that action segmentation models require for training. Our annotation team follows a two-pass boundary refinement protocol with inter-annotator agreement targets above 85% F1@10, ensuring the boundary precision needed for downstream skill learning. With 386,000+ annotated clips across manipulation, navigation, and daily activity domains, Claru datasets include hierarchical action vocabularies designed in collaboration with robotics researchers.\n\nOur annotation pipeline supports both dense frame-level labeling for seed datasets and model-assisted correction for scaling to 10,000+ demonstrations. Each clip ships with synchronized multi-modal signals — RGB video, depth, and where available, robot state and force/torque — displayed in custom annotation interfaces that help annotators achieve 2-3 frame boundary precision. Teams training hierarchical policies, skill libraries, or task planners from demonstration data can work directly from Claru's temporally segmented datasets without additional preprocessing.",
};

export default data;
