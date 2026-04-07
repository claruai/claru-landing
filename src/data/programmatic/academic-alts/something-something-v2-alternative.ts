import type { AcademicAltPageData } from "../types";

const data: AcademicAltPageData = {
  slug: "something-something-v2-alternative",
  metaTitle: "Something-Something V2 Alternative for Robot Training | Claru",
  metaDescription:
    "Compare Something-Something V2's 220K human action videos with Claru's robot-specific data. Action understanding, embodiment gap, and production readiness compared.",
  primaryKeyword: "something-something v2 alternative",
  secondaryKeywords: [
    "something-something v2 vs claru",
    "sthsth v2 limitations",
    "something-something v2 commercial alternative",
    "human action video for robots",
    "temporal reasoning training data",
  ],
  canonicalPath: "/compare/something-something-v2-alternative",
  h1: "Something-Something V2 Alternative: Robot-Specific Training Data for Physical AI",
  heroSubtitle:
    "Something-Something V2 provides 220K+ crowd-sourced videos of humans performing 174 actions with everyday objects. Its focus on temporal reasoning makes it a popular pretraining source for video understanding models used in robotics. But human hand videos are not robot demonstrations. Compare with Claru's robot-specific data.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Compare", href: "/compare" },
    { label: "Something-Something V2 Alternative", href: "/compare/something-something-v2-alternative" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Something-Something V2?",
      paragraphs: [
        "Something-Something V2 (SSv2) is a large-scale video understanding dataset created by TwentyBN (later acquired by Qualcomm AI Research) and published in 2017 with a major V2 update. It contains 220,847 short video clips showing crowd-sourced workers performing 174 predefined actions with everyday objects. Unlike datasets that rely on appearance cues (a beach suggests 'surfing'), SSv2 was specifically designed to require temporal reasoning -- understanding the sequence and dynamics of an action, not just recognizing a static scene.",
        "Each video shows a human hand interacting with an object on a surface: pushing something left to right, picking something up, turning something upside down, covering something, folding something, pretending to put something on a surface, and 168 other actions. The actions are defined as templates with object slots (e.g., 'Pushing [something] from left to right'), where the object varies across clips. This template structure means models must learn the action dynamics (the 'pushing' motion) rather than memorizing object-action correlations.",
        "SSv2 became a standard benchmark for video understanding models and has been influential in robotics research as a pretraining dataset. Because the actions involve physical object manipulation with temporal structure (beginning, middle, end of an action), SSv2 representations capture manipulation-relevant visual dynamics that ImageNet or Kinetics pretraining does not. Researchers have used SSv2-pretrained video encoders as visual backbones for robotic manipulation policies, including early VLA work.",
        "The dataset is released under a research-only license controlled by the TwentyBN terms of use, which does not permit commercial use. This is a critical distinction from many robotics datasets. SSv2 provides only RGB video and action class labels -- no depth, no 3D pose, no force measurements, and no robot-specific observations.",
      ],
    },
    {
      type: "stats",
      heading: "Something-Something V2 at a Glance",
      stats: [
        { value: "220,847", label: "Video Clips" },
        { value: "174", label: "Action Categories" },
        { value: "~2-6 sec", label: "Clip Duration" },
        { value: "Crowd-sourced", label: "Annotators (AMT workers)" },
        { value: "Research-only", label: "License (Non-Commercial)" },
        { value: "Human hands", label: "Not Robot Demonstrations" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Something-Something V2 vs. Claru: Side-by-Side Comparison",
      description:
        "A comparison for teams considering SSv2 for pretraining robotic manipulation models.",
      columns: ["Dimension", "Something-Something V2", "Claru"],
      rows: [
        {
          Dimension: "Content",
          "Something-Something V2": "Human hands manipulating everyday objects",
          Claru: "Robot end-effectors performing deployment tasks",
        },
        {
          Dimension: "Scale",
          "Something-Something V2": "220,847 short video clips",
          Claru: "1K to 1M+ robot demonstrations",
        },
        {
          Dimension: "Action Granularity",
          "Something-Something V2": "174 coarse action categories",
          Claru: "Fine-grained task-specific demonstrations with full trajectories",
        },
        {
          Dimension: "Embodiment",
          "Something-Something V2": "Human hands (no robot morphology)",
          Claru: "Your specific robot platform and end-effector",
        },
        {
          Dimension: "Action Labels",
          "Something-Something V2": "Category label only (no trajectories)",
          Claru: "Full action trajectories (EE pose, joint positions, gripper state)",
        },
        {
          Dimension: "Sensor Modalities",
          "Something-Something V2": "RGB video only",
          Claru: "RGB + depth + force/torque + proprioception + tactile",
        },
        {
          Dimension: "Viewpoint",
          "Something-Something V2": "Variable (crowd-sourced, uncontrolled)",
          Claru: "Calibrated multi-view with known extrinsics",
        },
        {
          Dimension: "License",
          "Something-Something V2": "Research-only (non-commercial TwentyBN terms)",
          Claru: "Commercial license with IP assignment",
        },
        {
          Dimension: "Robot Applicability",
          "Something-Something V2": "Visual pretraining only -- no direct policy training",
          Claru: "Direct policy training for deployment",
        },
        {
          Dimension: "Language Annotations",
          "Something-Something V2": "Template action descriptions with object slots",
          Claru: "Free-form natural language with multi-annotator validation",
        },
      ],
    },
    {
      type: "prose",
      heading: "Key Limitations of Something-Something V2 for Production Robotics",
      paragraphs: [
        "The fundamental limitation of SSv2 for robotics is the embodiment gap. SSv2 shows human hands, not robot grippers. Human hands have 27 degrees of freedom, compliant fingers, tactile sensitivity, and dexterous grasp capabilities that no current robot gripper matches. A model pretrained on SSv2 learns the visual dynamics of human manipulation, which differ fundamentally from robot manipulation: different grasp strategies, different approach angles, different contact patterns, and different failure modes. The visual representations may transfer partially, but they carry assumptions about manipulation physics that do not hold for robot end-effectors.",
        "SSv2 contains no actionable robot data. There are no joint positions, end-effector poses, gripper states, or motor commands -- the data modalities that policies consume to produce robot behavior. SSv2 can only serve as a visual pretraining source (learning representations), never as direct training data for a manipulation policy. The jump from 'recognizing that a human is pushing something' to 'controlling a robot to push something' requires entirely different data.",
        "The research-only license is a hard blocker for commercial deployment. The TwentyBN terms of use explicitly restrict commercial use. Any model pretrained on SSv2 that is deployed in a commercial product carries licensing risk. This is not a gray area -- the terms are clear. Teams building products need pretraining data with commercial rights, which SSv2 does not provide.",
        "SSv2's 174 action categories are coarse, classification-oriented labels designed for video understanding benchmarks. They describe what happens ('pushing left to right') but not how -- the fine-grained trajectory, the force profile, the grip configuration, the timing of contact transitions. Robot policies need the 'how' at a control-frequency level, not just the 'what' at a video-clip level.",
        "Camera viewpoints in SSv2 are uncontrolled -- each crowd worker used their own phone or webcam at whatever angle was convenient. This creates viewpoint variability that is useful for robust visual recognition but provides no calibrated spatial information. Robot manipulation requires known camera geometry (intrinsics, extrinsics) to reconstruct 3D spatial relationships between the robot, objects, and environment.",
      ],
    },
    {
      type: "prose",
      heading: "When to Use Something-Something V2 vs. Commercial Data",
      paragraphs: [
        "SSv2 is valuable for academic research on temporal video understanding, action recognition, and video representation learning. If your research involves developing or benchmarking video models that must understand the temporal dynamics of object manipulation (not just static scene recognition), SSv2's template-based action categories provide the right evaluation framework.",
        "SSv2 also has documented value as a pretraining dataset for robotic visual encoders in research settings. Multiple papers have shown that video encoders pretrained on SSv2 produce better visual features for manipulation than those pretrained on Kinetics or ImageNet, because SSv2's content is closer to the physical interactions robots perform. This pretraining benefit is real but diminishes as more robot-specific pretraining corpora (like OXE) become available.",
        "Switch to Claru for any path that leads to commercial deployment. If you need data to train or fine-tune a manipulation policy, if you need commercial licensing, if you need robot-specific observations, or if you need action trajectories rather than classification labels -- Claru provides data that SSv2 structurally cannot. Our demonstrations are collected on real robots performing real tasks, with the full observation and action space your policy requires.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Complements Something-Something V2",
      paragraphs: [
        "For teams that have leveraged SSv2 for visual encoder pretraining, Claru provides the robot-specific data needed to train a complete manipulation policy. SSv2 teaches your visual backbone about the temporal dynamics of physical interactions; Claru teaches your policy how your specific robot should execute those interactions, with full action trajectories, multi-modal observations, and task-specific language annotations.",
        "Claru addresses SSv2's embodiment gap by collecting data on your actual robot. Where SSv2 shows a human hand pushing a mug, Claru shows your gripper pushing your target objects in your environment. The visual features, grasp configurations, and contact dynamics are specific to your hardware, eliminating the need for cross-embodiment transfer between human hands and robot end-effectors.",
        "Our commercial license removes the legal risk that SSv2's research-only terms create. Models trained on Claru data can be deployed in commercial products without licensing concerns. For teams that have been using SSv2 in research and are now commercializing their approach, Claru provides a clean licensing path forward.",
        "Data is delivered with the full multi-modal sensor suite that SSv2 lacks: synchronized RGB-D from calibrated cameras, proprioception, force/torque, and optional tactile data, alongside standardized action labels at your control frequency. This transforms a visual pretraining resource into a complete policy training pipeline.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "goyal-sthsth-2017",
          title: "The 'Something Something' Video Database for Learning and Evaluating Visual Common Sense",
          authors: "Goyal et al.",
          venue: "ICCV 2017",
          year: 2017,
          url: "https://arxiv.org/abs/1706.04261",
        },
        {
          id: "mahdisoltani-sthsthv2-2018",
          title: "Effectiveness of Self-Supervised Pre-Training for Predicting the Future in Videos",
          authors: "Mahdisoltani et al.",
          venue: "arXiv 2018",
          year: 2018,
          url: "https://arxiv.org/abs/1811.06382",
        },
        {
          id: "nair-r3m-2022",
          title: "R3M: A Universal Visual Representation for Robot Manipulation",
          authors: "Nair et al.",
          venue: "CoRL 2022",
          year: 2022,
          url: "https://arxiv.org/abs/2203.12601",
        },
        {
          id: "karamcheti-voltron-2023",
          title: "Language-Driven Representation Learning for Robotics",
          authors: "Karamcheti et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2302.12766",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Can I use Something-Something V2 to train a robot policy directly?",
      answer:
        "No. SSv2 contains only RGB videos of human hands with action category labels. It has no robot state, no action trajectories, no proprioception, and no end-effector commands. It can be used to pretrain visual encoders that are then integrated into a robot policy, but the policy itself must be trained on robot-specific demonstration data like what Claru provides.",
    },
    {
      question: "Can I use Something-Something V2 commercially?",
      answer:
        "No. SSv2 is released under TwentyBN's research-only terms of use, which explicitly prohibit commercial use. Any model pretrained on SSv2 and deployed in a commercial product carries licensing risk. Claru provides all data under a commercial license with IP assignment.",
    },
    {
      question: "Is SSv2 pretraining still useful for robotics given newer datasets like OXE?",
      answer:
        "SSv2 pretraining provides some value for visual representation learning, as its temporal action structure teaches models about manipulation dynamics. However, robot-specific pretraining corpora (OXE, DROID, Bridge V2) are increasingly preferred because they capture robot morphology, camera viewpoints, and manipulation strategies more relevant to downstream policy training. The marginal benefit of SSv2 pretraining is diminishing.",
    },
    {
      question: "How does the embodiment gap between human hands and robots affect transfer?",
      answer:
        "The embodiment gap is substantial. Human hands use different grasp strategies, approach angles, and contact patterns than robot grippers. Visual features learned from SSv2 capture general manipulation dynamics but embed assumptions about human hand morphology that do not apply to parallel-jaw grippers, suction cups, or dexterous robot hands. Fine-tuning on robot-specific data from Claru is essential to bridge this gap.",
    },
    {
      question: "Does Claru provide video-level action categories like SSv2?",
      answer:
        "Claru goes far beyond video-level categories. We provide frame-level action trajectories (end-effector poses, joint positions, gripper states) at your control frequency, plus natural language task descriptions. This gives your policy the precise control signals it needs to reproduce the demonstrated behavior, not just a coarse category label.",
    },
  ],
  ctaHeading: "Robot Data for Robot Policies",
  ctaDescription:
    "Replace human hand videos with expert robot demonstrations on your platform. Get multi-modal data with commercial licensing for direct policy training.",
  relatedGlossaryTerms: [
    "embodiment-gap",
    "visual-pretraining",
    "temporal-reasoning",
    "imitation-learning",
  ],
  relatedGuidePages: [
    "how-to-build-a-cross-embodiment-dataset",
    "how-to-evaluate-training-data-quality",
  ],
  relatedSolutionSlugs: ["vla-training-data"],
  datasetName: "Something-Something V2",
  academicProfile: {
    institution: "TwentyBN / Qualcomm AI Research",
    year: 2017,
    scale:
      "220,847 video clips of 174 action categories performed by crowd workers with everyday objects",
    license: "Research-only (TwentyBN terms of use -- non-commercial)",
    modalities: [
      "RGB video (variable resolution, uncontrolled viewpoint)",
      "Action category labels (174 template-based categories)",
      "Object labels within action templates",
    ],
  },
  limitations: [
    "Human hand demonstrations, not robot data -- fundamental embodiment gap for manipulation policies",
    "No robot state, action trajectories, proprioception, or motor commands -- cannot train robot policies directly",
    "Research-only license explicitly prohibits commercial use -- legal blocker for deployment",
    "Coarse category labels, not fine-grained manipulation trajectories at control frequency",
    "Uncontrolled camera viewpoints with no calibration -- no 3D spatial information",
    "No depth, force/torque, or tactile data",
    "Crowd-sourced quality with no control over demonstration technique or environment",
    "Actions are 2-6 second clips -- no long-horizon task sequences",
  ],
  claruAdvantages: [
    "Robot-specific demonstrations on your platform with your end-effector -- no embodiment gap",
    "Full action trajectories at control frequency (EE pose, joint state, gripper commands)",
    "Commercial license with IP assignment -- clear path to production deployment",
    "Multi-modal sensor streams: RGB-D, force/torque, proprioception, tactile",
    "Calibrated multi-view cameras with known intrinsics and extrinsics",
    "Natural language task annotations with multi-annotator validation",
    "Expert-quality demonstrations with systematic quality control",
    "Long-horizon task demonstrations, not just isolated 2-6 second clips",
  ],
  keyPapers: [
    {
      id: "goyal-sthsth-2017",
      title: "The 'Something Something' Video Database for Learning and Evaluating Visual Common Sense",
      authors: "Goyal et al.",
      venue: "ICCV 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1706.04261",
    },
    {
      id: "nair-r3m-2022",
      title: "R3M: A Universal Visual Representation for Robot Manipulation",
      authors: "Nair et al.",
      venue: "CoRL 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2203.12601",
    },
    {
      id: "karamcheti-voltron-2023",
      title: "Language-Driven Representation Learning for Robotics",
      authors: "Karamcheti et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2302.12766",
    },
  ],
  claruRelevance:
    "Something-Something V2 occupies a unique position in the robotics data landscape: it is not a robotics dataset at all, but its focus on temporal object manipulation dynamics has made it a popular pretraining resource for robotic visual encoders. Research from R3M, Voltron, and related work demonstrated that SSv2-pretrained representations outperform ImageNet and Kinetics representations for manipulation tasks, precisely because SSv2's content involves physical object interactions rather than scene recognition. However, SSv2's utility for robotics is strictly limited to visual pretraining. It provides no robot-specific observations, no action trajectories, no multi-modal sensor data, and crucially, no commercial license. Claru provides everything SSv2 cannot: expert robot demonstrations with full action trajectories on your specific platform, multi-modal observations including depth and force/torque, calibrated camera geometry, and natural language annotations -- all under a commercial license suitable for product deployment. For teams that have used SSv2 to bootstrap visual representations, Claru delivers the robot-specific data needed to convert those representations into deployed manipulation policies. As robot-specific pretraining corpora like OXE grow, Claru's demonstrations serve double duty: both as fine-tuning data for SSv2-pretrained encoders and as part of the robot-specific pretraining mix that is replacing human video pretraining in the field.",
};

export default data;
