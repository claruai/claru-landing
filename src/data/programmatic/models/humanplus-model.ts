import type { ModelPageData } from "../types";

const data: ModelPageData = {
  slug: "humanplus-model",
  metaTitle:
    "Training Data for HumanPlus | Data Requirements & Formats | Claru",
  metaDescription:
    "Complete guide to HumanPlus training data: human-to-humanoid motion transfer, AMASS dataset, shadowing transformer, and how Claru delivers HumanPlus-ready data.",
  primaryKeyword: "HumanPlus training data",
  secondaryKeywords: [
    "HumanPlus data requirements",
    "HumanPlus humanoid dataset",
    "humanoid shadowing imitation data",
    "HumanPlus fine-tuning data",
    "HumanPlus motion retargeting data",
  ],
  canonicalPath: "/models/humanplus-model",
  h1: "Training Data for HumanPlus",
  heroSubtitle:
    "A comprehensive breakdown of Stanford's HumanPlus system -- its shadowing transformer trained on 40 hours of AMASS motion capture, the imitation transformer for autonomous skill learning, and how Claru provides the human motion and teleoperation data HumanPlus requires.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Models", href: "/models" },
    { label: "HumanPlus", href: "/models/humanplus-model" },
  ],

  // ---------------------------------------------------------------------------
  // Sections
  // ---------------------------------------------------------------------------
  sections: [
    // 1. What Is HumanPlus?
    {
      type: "prose",
      heading: "What Is HumanPlus?",
      paragraphs: [
        "HumanPlus is a full-stack system for humanoid robots to learn motion and autonomous skills from human data, developed at Stanford by Zipeng Fu, Qingqing Zhao, Qi Wu, Gordon Wetzstein, and Chelsea Finn. Published at CoRL 2024 (arXiv 2406.10454), HumanPlus demonstrates that a humanoid robot can learn to shadow human motion in real time using only a single RGB camera, then leverage that shadowing capability to collect task-specific demonstration data and learn autonomous skills via behavior cloning.",
        "The system runs on a custom 33-DoF humanoid built on the Unitree H1 platform, featuring two 6-DoF dexterous hands (Inspire Hands), two 1-DoF wrists, and a 19-DoF body (two 4-DoF arms, two 5-DoF legs, and a 1-DoF waist). Two egocentric RGB cameras are mounted on the head for visual perception. Using up to 40 teleoperated demonstrations per task, the humanoid autonomously completes tasks including wearing a shoe and standing up, unloading objects from warehouse racks, folding a sweatshirt, rearranging objects, typing on a keyboard, and greeting another robot -- with success rates ranging from 60% to 100%.",
        "The fundamental insight of HumanPlus is that the human body is the best teleoperation interface for a humanoid robot. Rather than designing complex teleoperation rigs with haptic gloves or VR controllers, HumanPlus uses off-the-shelf pose estimation to track a human operator's body motion from a single RGB camera, retargets that motion to the humanoid's joint space in real time, and uses the resulting data for imitation learning. This makes data collection as simple as having a person perform the task while the robot mirrors their movements.",
      ],
    },

    // 2. Key stats
    {
      type: "stats",
      heading: "HumanPlus at a Glance",
      stats: [
        { value: "33", label: "Degrees of freedom (body + hands)" },
        { value: "40 hr", label: "AMASS motion capture data for HST training" },
        { value: "11K+", label: "Unique motion sequences in AMASS" },
        { value: "10-40", label: "Demonstrations per autonomous task" },
        { value: "60-100%", label: "Autonomous task success rate range" },
        { value: "30 Hz", label: "Real-time shadowing control frequency" },
      ],
    },

    // 3. Input/output spec
    {
      type: "comparison-table",
      heading: "Input / Output Specification",
      columns: ["Parameter", "Specification"],
      rows: [
        {
          Parameter: "Shadowing Input",
          Specification:
            "Single RGB camera stream processed by off-the-shelf pose estimation (e.g., WHAM) to extract 3D human body and hand joint positions in real time",
        },
        {
          Parameter: "Shadowing Output",
          Specification:
            "33-DoF humanoid joint-position targets at 30 Hz via the Humanoid Shadowing Transformer (HST)",
        },
        {
          Parameter: "Autonomous Perception",
          Specification:
            "Two head-mounted egocentric RGB cameras providing stereo visual input for the imitation policy",
        },
        {
          Parameter: "Autonomous Action",
          Specification:
            "33-DoF joint-position targets at 30 Hz via the Human Imitation Transformer (HIT), trained on shadowing-collected demonstrations",
        },
        {
          Parameter: "Language Conditioning",
          Specification:
            "Not language-conditioned; task selection is implicit in the demonstration dataset used for training each skill",
        },
        {
          Parameter: "Control Frequency",
          Specification: "30 Hz for both shadowing and autonomous execution",
        },
      ],
    },

    // 4. Architecture & Key Innovations
    {
      type: "prose",
      heading: "Architecture and Key Innovations",
      paragraphs: [
        "HumanPlus relies on two decoder-only transformer models that operate at different stages of the learning pipeline. The Humanoid Shadowing Transformer (HST) is the low-level controller that converts retargeted human joint trajectories into stable humanoid motion. It is trained in simulation via reinforcement learning (PPO) on the AMASS dataset, which contains 40 hours and over 11,000 unique sequences of human motion capture data. The HST takes as input the current humanoid joint state and the retargeted target pose from the human operator, and outputs joint-position commands that achieve the target pose while maintaining balance and physical feasibility. A key property of the HST is zero-shot sim-to-real transfer -- the policy trained in simulation deploys directly to the physical humanoid without any real-world fine-tuning.",
        "The retargeting pipeline bridges the kinematic gap between human and humanoid bodies. Human 3D pose estimation (using models like WHAM) extracts body and hand joint positions from a single RGB camera at 30 Hz. These human joint positions are then mapped to the humanoid's joint space through kinematic retargeting that accounts for differences in limb lengths, joint limits, and morphology. The retargeted targets are physically achievable poses for the humanoid, not raw human joint angles.",
        "The Human Imitation Transformer (HIT) is the high-level autonomous policy that learns task-specific skills from demonstration data collected via shadowing. During data collection, a human operator performs the task while the robot shadows their motion in real time, producing pairs of (egocentric observation, robot action) data. The HIT takes egocentric RGB images from the two head-mounted cameras as input and predicts joint-position action chunks using a Transformer architecture similar to ACT (Action Chunking with Transformers). It uses a CVAE (Conditional Variational Autoencoder) formulation to handle multi-modal action distributions.",
        "The two-stage design (HST for motion transfer + HIT for task learning) creates a virtuous data collection loop. Because the HST enables real-time shadowing, data collection requires no specialized hardware beyond a camera pointed at the human operator. This makes it feasible to collect 10-40 demonstrations per task in minutes rather than hours, which is sufficient for the HIT to learn robust autonomous policies. The simplicity of the data collection pipeline is arguably HumanPlus's most important practical innovation.",
      ],
    },

    // 5. Comparison table
    {
      type: "comparison-table",
      heading: "Comparison with Related Models",
      description:
        "How HumanPlus compares to alternative humanoid learning approaches.",
      columns: [
        "Dimension",
        "HumanPlus",
        "GR00T N1",
        "H2O (1X Technologies)",
        "Mobile ALOHA",
      ],
      rows: [
        {
          Dimension: "Teleoperation method",
          HumanPlus: "RGB camera + pose estimation (no hardware needed)",
          "GR00T N1": "Standard teleoperation devices",
          "H2O (1X Technologies)": "Exoskeleton / VR controllers",
          "Mobile ALOHA": "Direct kinesthetic teaching",
        },
        {
          Dimension: "Embodiment",
          HumanPlus: "33-DoF humanoid (Unitree H1 + Inspire Hands)",
          "GR00T N1": "Cross-embodiment (humanoids, arms)",
          "H2O (1X Technologies)": "Humanoid (1X Neo)",
          "Mobile ALOHA": "Bimanual mobile manipulator",
        },
        {
          Dimension: "Demos per task",
          HumanPlus: "10-40",
          "GR00T N1": "500-2,000",
          "H2O (1X Technologies)": "Not publicly specified",
          "Mobile ALOHA": "50",
        },
        {
          Dimension: "Locomotion + manipulation",
          HumanPlus: "Yes (whole-body)",
          "GR00T N1": "Yes (whole-body)",
          "H2O (1X Technologies)": "Yes (whole-body)",
          "Mobile ALOHA": "Mobile base only (no walking)",
        },
        {
          Dimension: "Language conditioned",
          HumanPlus: "No",
          "GR00T N1": "Yes",
          "H2O (1X Technologies)": "No",
          "Mobile ALOHA": "No",
        },
      ],
    },

    // 6. Training Data Requirements
    {
      type: "prose",
      heading: "Training Data Requirements",
      paragraphs: [
        "HumanPlus has two distinct data requirements corresponding to its two transformer models. The Humanoid Shadowing Transformer (HST) is trained on human motion capture data in simulation. The published system uses the AMASS dataset, which aggregates motion capture data from multiple sources (CMU MoCap, Human3.6M, ACCAD, and others) into a unified SMPL format, totaling 40 hours and over 11,000 unique motion sequences. AMASS covers diverse activities including walking, running, dancing, sports, object manipulation, and daily activities. The HST is trained via PPO reinforcement learning in the MuJoCo physics simulator, where the humanoid attempts to track retargeted AMASS motions while maintaining balance. No real-world data is needed for this stage.",
        "The Human Imitation Transformer (HIT) requires task-specific demonstration data collected on the physical humanoid via shadowing. For each target skill, a human operator performs the task while the robot mirrors their motion in real time. The resulting data consists of synchronized egocentric RGB frames (from the two head-mounted cameras, typically at 480x640 resolution) and 33-DoF joint-position recordings at 30 Hz. The published tasks required between 10 and 40 demonstrations each -- for example, 20 demonstrations for folding a sweatshirt, 40 for wearing a shoe and standing up, and 10 for greeting another robot.",
        "For the HST, the critical data property is motion diversity. The 40 hours in AMASS cover a wide range of human activities, and this breadth is what enables the HST to track arbitrary human motion during deployment. If the target application involves motions significantly outside AMASS's coverage (e.g., highly specialized industrial movements or sports-specific techniques), supplementing with additional motion capture data improves shadowing fidelity. Each motion sequence should be in SMPL or SMPL-H format with 3D joint positions at 30+ Hz.",
        "For the HIT, data quality is more important than quantity. Because only 10-40 demonstrations are used per task, each demonstration must be a clean, successful execution of the target skill. The egocentric camera viewpoint should be consistent across demonstrations, the objects should be in approximately similar starting configurations, and the human operator should execute the task smoothly without hesitation or errors. Failed or partial demonstrations degrade HIT performance significantly at these small sample sizes.",
      ],
    },

    // 7. How Claru Data Integrates
    {
      type: "prose",
      heading: "How Claru Data Integrates with HumanPlus",
      paragraphs: [
        "Claru provides data for both stages of the HumanPlus pipeline. For the HST training stage, we offer extensive human motion capture datasets in SMPL/SMPL-H format that can supplement or replace AMASS for broader motion coverage. Our motion data spans diverse activities including household manipulation, industrial assembly, warehouse operations, personal care, and fitness -- captured via high-fidelity optical motion capture systems (Vicon, OptiTrack) at 120 Hz and downsampled to the target training rate. This expanded motion vocabulary enables the HST to track a wider range of human motions during shadowing, particularly for manipulation-heavy tasks that are underrepresented in standard mocap datasets.",
        "For the HIT training stage, Claru provides task-specific demonstration datasets collected on humanoid platforms via shadowing or direct teleoperation. Our collection pipeline captures synchronized egocentric RGB frames from head-mounted cameras at 30 Hz, full 33-DoF joint-position trajectories, and task success labels. We enforce strict data quality standards matching HumanPlus's requirements: each demonstration is a verified successful execution, camera viewpoints are consistent, and object configurations are controlled. For a typical HumanPlus skill, we deliver 20-50 high-quality demonstrations per task.",
        "Beyond direct data provision, Claru's egocentric video catalog (3M+ clips of human daily activities captured from head-mounted cameras) provides a rich source of task-relevant visual data for pretraining or augmenting HIT's vision backbone. While HumanPlus does not currently use video pretraining, the architecture is compatible with frozen pretrained vision encoders, and teams exploring this extension can leverage our egocentric video for backbone pretraining. All data includes full provenance documentation, sensor calibration, and compatibility verification with HumanPlus's open-source codebase.",
      ],
    },

    // 8. References
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "fu-humanplus-2024",
          title: "HumanPlus: Humanoid Shadowing and Imitation from Humans",
          authors: "Fu, Zhao, Wu, Wetzstein, & Finn",
          venue: "CoRL 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2406.10454",
        },
        {
          id: "mahmood-amass-2019",
          title:
            "AMASS: Archive of Motion Capture as Surface Shapes",
          authors: "Mahmood et al.",
          venue: "ICCV 2019",
          year: 2019,
          url: "https://arxiv.org/abs/1904.03278",
        },
        {
          id: "zhao-act-2023",
          title:
            "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
          authors: "Zhao et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2304.13705",
        },
        {
          id: "fu-mobile-aloha-2024",
          title:
            "Mobile ALOHA: Learning Bimanual Mobile Manipulation with Low-Cost Whole-Body Teleoperation",
          authors: "Fu et al.",
          venue: "arXiv 2401.02117",
          year: 2024,
          url: "https://arxiv.org/abs/2401.02117",
        },
        {
          id: "shin-wham-2024",
          title:
            "WHAM: Reconstructing World-grounded Humans with Accurate 3D Motion",
          authors: "Shin et al.",
          venue: "CVPR 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2312.07531",
        },
      ],
    },
  ],

  // ---------------------------------------------------------------------------
  // FAQs
  // ---------------------------------------------------------------------------
  faqs: [
    {
      question:
        "How does HumanPlus enable teleoperation without specialized hardware?",
      answer:
        "HumanPlus uses off-the-shelf 3D human pose estimation (such as WHAM) running on a single RGB camera pointed at the human operator. The estimated 3D body and hand joint positions are retargeted to the humanoid's 33-DoF joint space in real time at 30 Hz. The Humanoid Shadowing Transformer (HST) then converts these retargeted targets into physically stable joint-position commands. The operator simply performs the task naturally while being filmed -- no gloves, exoskeletons, or VR equipment needed.",
    },
    {
      question: "What is the AMASS dataset and why does HumanPlus use it?",
      answer:
        "AMASS (Archive of Motion Capture as Surface Shapes) aggregates human motion capture data from 15+ sources into a unified SMPL body model format. It contains 40 hours and over 11,000 unique motion sequences spanning walking, running, dancing, sports, and daily activities. HumanPlus trains its low-level Humanoid Shadowing Transformer on AMASS via reinforcement learning in simulation, teaching the humanoid to track diverse human motions while maintaining balance. The diversity of AMASS is critical -- it ensures the HST can handle arbitrary real-time human motion during deployment.",
    },
    {
      question: "How many demonstrations does HumanPlus need per task?",
      answer:
        "HumanPlus achieves autonomous task completion with remarkably few demonstrations: 10-40 per task in the published experiments. For example, folding a sweatshirt used 20 demonstrations, wearing a shoe and standing up used 40, and greeting another robot used just 10. The low data requirement is enabled by the egocentric viewpoint consistency (both human and robot see similar views during shadowing) and the Human Imitation Transformer's action chunking architecture.",
    },
    {
      question:
        "Can HumanPlus be adapted to different humanoid platforms?",
      answer:
        "The HumanPlus framework is platform-agnostic in principle, though the published system was built on the Unitree H1 with Inspire Hands (33 DoF total). Adapting to a different humanoid requires: (1) adjusting the kinematic retargeting to account for different limb proportions and joint limits, (2) retraining the HST in simulation with the new robot's URDF model and AMASS data, and (3) collecting task demonstrations via shadowing on the new platform. The HST retraining is the most computationally intensive step but remains feasible on a single GPU cluster.",
    },
    {
      question: "What data format does Claru deliver for HumanPlus?",
      answer:
        "For HST training, Claru delivers human motion capture data in SMPL/SMPL-H format at 30+ Hz with full 3D joint positions, compatible with HumanPlus's simulation training pipeline. For HIT training, we deliver task-specific demonstrations with synchronized egocentric RGB frames (480x640 at 30 Hz) and 33-DoF joint-position trajectories from the target humanoid platform. Each demonstration is verified for task success and motion quality. Data is packaged in HDF5 format compatible with HumanPlus's open-source codebase.",
    },
  ],

  // ---------------------------------------------------------------------------
  // CTA
  // ---------------------------------------------------------------------------
  ctaHeading: "Get HumanPlus-Ready Training Data",
  ctaDescription:
    "Tell us about your HumanPlus project -- target humanoid platform, task skills, and motion vocabulary -- and we will deliver human motion capture data for HST training and task-specific demonstrations for HIT learning.",

  // ---------------------------------------------------------------------------
  // Cross-links
  // ---------------------------------------------------------------------------
  relatedGlossaryTerms: [
    "humanoid-robot",
    "imitation-learning",
    "sim-to-real-transfer",
    "teleoperation",
    "foundation-model-robotics",
  ],
  relatedGuidePages: [
    "how-to-collect-teleoperation-data",
    "how-to-build-a-cross-embodiment-dataset",
  ],
  relatedSolutionSlugs: [],

  // ---------------------------------------------------------------------------
  // Model metadata
  // ---------------------------------------------------------------------------
  modelName: "HumanPlus",
  organization: "Stanford",
  year: 2024,

  inputSpec: {
    observationFormat:
      "Shadowing: single RGB camera + 3D pose estimation; Autonomous: two head-mounted egocentric RGB cameras (480x640)",
    actionFormat:
      "33-DoF humanoid joint-position targets (19 body + 12 hand + 2 wrist DoFs)",
    languageConditioning:
      "Not language-conditioned; task is defined by the demonstration dataset used for each skill",
    controlFrequency: "30 Hz (both shadowing and autonomous execution)",
  },

  dataVolumeBenchmarks:
    "HumanPlus operates at two very different data scales for its two training stages. The Humanoid Shadowing Transformer (HST) is trained on the AMASS motion capture dataset, which contains 40 hours of human motion data across over 11,000 unique motion sequences aggregated from 15+ motion capture sources (CMU MoCap, Human3.6M, ACCAD, and others). AMASS covers diverse activities including walking, running, dancing, object manipulation, and daily routines, all unified in SMPL body model format. The HST is trained via PPO reinforcement learning in MuJoCo simulation, where the humanoid tracks retargeted AMASS motions -- this stage uses no real-world robot data. The Human Imitation Transformer (HIT) operates at a much smaller data scale: 10-40 teleoperated demonstrations per task, collected in the real world via shadowing. Each demonstration consists of egocentric RGB frames from two head-mounted cameras at 30 Hz and 33-DoF joint-position recordings, producing approximately 3,000-12,000 observation-action pairs per demonstration (at 30 Hz over 100-400 second task executions). The total per-task dataset is therefore 30,000-480,000 observation-action pairs. In the published experiments, 6 tasks were evaluated: wearing a shoe (40 demos), unloading warehouse racks (30 demos), folding a sweatshirt (20 demos), rearranging objects (20 demos), typing on a keyboard (10 demos), and greeting a robot (10 demos). Despite these small per-task datasets, the HIT achieves 60-100% autonomous success rates, demonstrating that the egocentric viewpoint consistency and shadowing-based data collection provide unusually strong learning signal per demonstration.",

  trainingRecipe:
    "HumanPlus's training pipeline has three distinct stages. Stage 1 trains the Humanoid Shadowing Transformer (HST) in simulation. The AMASS motion capture dataset (40 hours, 11K+ sequences in SMPL format) is processed through a kinematic retargeting pipeline that maps human body joint positions to the 33-DoF humanoid's joint space, accounting for differences in limb lengths, joint limits, and morphology. In MuJoCo simulation, the humanoid is trained via PPO reinforcement learning to track the retargeted motion sequences while maintaining balance and physical stability. The reward function combines pose tracking accuracy, balance metrics, and energy penalties. Training runs for several hundred million environment steps on standard GPU clusters. The resulting HST policy transfers zero-shot to the real humanoid -- no real-world fine-tuning is needed. Stage 2 is real-world data collection via shadowing. A human operator performs the target task while a single RGB camera captures their motion. Off-the-shelf 3D pose estimation (WHAM) extracts body and hand joint positions at 30 Hz. These are retargeted to the humanoid's joint space and fed to the HST, which drives the robot to mirror the human's motion in real time. The robot's egocentric camera observations and actual joint positions are recorded as demonstration data. This produces 10-40 demonstrations per task in a single collection session. Stage 3 trains the Human Imitation Transformer (HIT) on the shadowing-collected demonstrations. The HIT uses a CVAE-based Transformer architecture similar to ACT: egocentric RGB images from both head cameras are encoded via a CNN backbone (ResNet-18), and a Transformer decoder predicts chunks of future 33-DoF joint-position actions. Training uses MSE loss on predicted vs. recorded actions with CVAE regularization. The HIT converges quickly (typically a few hours on a single GPU) given the small dataset sizes.",

  claruIntegration:
    "Claru provides data for all three stages of the HumanPlus pipeline. For HST training (Stage 1), we deliver human motion capture data in SMPL/SMPL-H format from optical motion capture systems (Vicon, OptiTrack) at 120 Hz, covering household manipulation, industrial tasks, and daily activities that extend AMASS's coverage. For HIT data collection (Stage 2), we provide the teleoperation infrastructure and trained operators to collect shadowing demonstrations on Unitree H1 and other humanoid platforms, delivering 20-50 high-quality demonstrations per task with synchronized egocentric RGB and 33-DoF joint trajectories at 30 Hz. For visual backbone pretraining extensions, our catalog of 3M+ egocentric human activity videos provides rich visual data from head-mounted cameras. All data includes task success labels, camera calibration, and format compatibility verification with HumanPlus's open-source codebase on GitHub.",

  keyPapers: [
    {
      id: "fu-humanplus-2024",
      title: "HumanPlus: Humanoid Shadowing and Imitation from Humans",
      authors: "Fu, Zhao, Wu, Wetzstein, & Finn",
      venue: "CoRL 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2406.10454",
    },
    {
      id: "mahmood-amass-2019",
      title: "AMASS: Archive of Motion Capture as Surface Shapes",
      authors: "Mahmood et al.",
      venue: "ICCV 2019",
      year: 2019,
      url: "https://arxiv.org/abs/1904.03278",
    },
    {
      id: "zhao-act-2023",
      title:
        "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
      authors: "Zhao et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.13705",
    },
    {
      id: "fu-mobile-aloha-2024",
      title:
        "Mobile ALOHA: Learning Bimanual Mobile Manipulation with Low-Cost Whole-Body Teleoperation",
      authors: "Fu et al.",
      venue: "arXiv 2401.02117",
      year: 2024,
      url: "https://arxiv.org/abs/2401.02117",
    },
    {
      id: "shin-wham-2024",
      title:
        "WHAM: Reconstructing World-grounded Humans with Accurate 3D Motion",
      authors: "Shin et al.",
      venue: "CVPR 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2312.07531",
    },
  ],
};

export default data;
