import type { LabPageData } from "./types";

const page: LabPageData = {
  slug: "mit-csail-robotics",
  companyName: "MIT CSAIL Robotics",
  companyDescription:
    "MIT's Computer Science and Artificial Intelligence Laboratory (CSAIL) houses multiple robotics groups including Pulkit Agrawal's Improbable AI Lab, Russ Tedrake's Robot Locomotion Group, and Daniela Rus's Distributed Robotics Lab. CSAIL research spans contact-rich manipulation, model-predictive control, soft robotics, dexterous hands, and multi-robot systems. Russ Tedrake also holds the Toyota Professorship, reflecting deep industry ties.",
  keyProducts: [
    "Drake Simulator",
    "EyeSight Hand (Dexterous Robot Hand)",
    "Soft Robotics Platforms",
    "Contact-Rich Planning Research",
  ],
  researchFocus: [
    "Contact-rich manipulation planning",
    "Model-predictive control for legged robots",
    "Dexterous manipulation with tactile sensing",
    "Soft robotics and material manipulation",
    "Diffusion-based policy learning",
  ],
  dataNeedsSummary:
    "MIT CSAIL's robotics groups approach manipulation and locomotion through physics-based modeling complemented by learning-based methods. Drake simulator provides high-fidelity contact simulation but requires real-world validation data. The Improbable AI Lab's foundation policies need diverse manipulation demonstrations. The EyeSight Hand project demands tactile-visual data for dexterous manipulation at a scale that single-lab collection cannot achieve.",
  dataNeeds: [
    {
      title: "Contact-rich manipulation data with physics annotations",
      source:
        "Pang et al., Tedrake Group contact planning research (TRO 2023)",
      description:
        "Manipulation recordings with detailed contact state annotations — contact locations, normal forces, friction measurements — for training and validating contact-aware planners built on Drake's physics engine.",
    },
    {
      title: "Real-world locomotion for model validation",
      source:
        "Tedrake Group's model-predictive control research on quadrupeds and humanoids",
      description:
        "Real-world locomotion recordings with full kinematics and ground reaction forces for validating Drake-based locomotion controllers on real terrain types that simulation approximates imprecisely.",
    },
    {
      title: "Diverse manipulation for learning-based policies",
      source:
        "Improbable AI Lab foundation policies research (Agrawal, CoRL 2024)",
      description:
        "Large-scale manipulation demonstrations across varied objects and environments for training generalizable manipulation policies using diffusion-based and other modern policy learning approaches.",
    },
    {
      title: "Dexterous hand manipulation with tactile feedback",
      source:
        "EyeSight Hand project (IROS 2024) and tactile sensing research",
      description:
        "In-hand manipulation recordings with synchronized vision and tactile sensor data for training dexterous manipulation policies on CSAIL's EyeSight Hand and similar fully-actuated hand platforms.",
    },
    {
      title: "Deformable object manipulation data",
      source:
        "Rus Lab soft robotics and material manipulation research",
      description:
        "Recordings of cloth folding, cable routing, flexible material handling, and other deformable object interactions with high-resolution visual tracking of material deformation states.",
    },
  ],
  dataMatches: [
    {
      labNeed: "Contact-rich manipulation data with physics annotations",
      claruOffering:
        "Manipulation Trajectory Dataset with contact annotations",
      rationale:
        "Claru's manipulation data captures contact-rich interactions. Enhanced annotation protocols can add contact state, force estimates, and friction characterization needed for Drake-based physics planners.",
    },
    {
      labNeed: "Real-world locomotion for model validation",
      claruOffering: "Custom Locomotion Data Collection",
      rationale:
        "Claru can collect body-worn sensor data with synchronized force measurements across diverse terrain types — from polished indoor floors to outdoor gravel — for Drake model validation campaigns across conditions simulation handles poorly.",
    },
    {
      labNeed: "Diverse manipulation for learning-based policies",
      claruOffering:
        "Manipulation Trajectory Dataset + Egocentric Activity Dataset",
      rationale:
        "Claru's existing datasets provide diverse manipulation examples across hundreds of object types and environments, suitable for pretraining and fine-tuning the diffusion-based and multimodal manipulation policies developed by the Improbable AI Lab.",
    },
    {
      labNeed: "Dexterous hand manipulation with tactile feedback",
      claruOffering: "Custom Dexterous Manipulation Collection",
      rationale:
        "Claru can coordinate collection campaigns with multi-camera setups and tactile sensor integration to capture the finger-level manipulation detail needed for dexterous hand policy training.",
    },
  ],
  keyPapers: [
    {
      id: "pang-contact-2023",
      title:
        "Global Planning for Contact-Rich Manipulation via Local Smoothing of Quasi-Dynamic Contact Models",
      authors: "Pang et al.",
      venue: "TRO 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2206.10787",
    },
    {
      id: "agrawal-diffusion-2024",
      title:
        "Learning Multimodal Behaviors from Scratch with Diffusion Policy Gradient",
      authors: "Agrawal et al.",
      venue: "NeurIPS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2406.00681",
    },
    {
      id: "tedrake-drake-2019",
      title:
        "Drake: Model-Based Design and Verification for Robotics",
      authors: "Tedrake, R.",
      venue: "MIT Technical Report",
      year: 2019,
      url: "https://drake.mit.edu/",
    },
    {
      id: "liu-eyesight-hand-2024",
      title:
        "EyeSight Hand: Design of a Fully-Actuated Dexterous Robot Hand with Integrated Vision-Based Tactile Sensors and Compliant Actuation",
      authors: "Liu et al.",
      venue: "IROS 2024",
      year: 2024,
      url: "https://ieeexplore.ieee.org/document/10802619",
    },
    {
      id: "agrawal-few-shot-2024",
      title:
        "Few-shot Task Learning through Inverse Generative Modeling",
      authors: "Agrawal et al.",
      venue: "NeurIPS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2411.02987",
    },
    {
      id: "agrawal-action-space-2024",
      title:
        "Action Space Design in Reinforcement Learning for Robot Motor Skills",
      authors: "Agrawal et al.",
      venue: "CoRL 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2410.09874",
    },
  ],
  technicalAnalysis:
    "MIT CSAIL's robotics groups represent a distinctive blend of physics-based modeling and learning-based approaches that creates unusually specific data requirements. Russ Tedrake's group — he holds the Toyota Professorship in EECS, Aeronautics, and Mechanical Engineering — develops Drake, arguably the most physically accurate robot simulator available, emphasizing contact dynamics and optimization-based control. Pulkit Agrawal's Improbable AI Lab takes a complementary learning-first approach, publishing four papers at NeurIPS 2024 and CoRL 2024 on diffusion policy gradients, few-shot task learning, action space design, and dexterous manipulation. Both groups require real-world data, but for different reasons: Tedrake for model validation, Agrawal for policy training.\n\nThe contact-rich manipulation research is particularly data-demanding. Contact between rigid bodies creates discontinuous dynamics — a slight change in grasp position can cause an object to slip or remain stable. Modeling these discontinuities accurately requires real-world contact measurements that capture the friction, compliance, and geometric properties of real objects on real surfaces. Drake's contact models are theoretically sophisticated but need calibration data from real manipulation experiments to close the sim-to-real gap. Without this calibration, Drake's predictions diverge from reality in subtle but operationally significant ways.\n\nThe EyeSight Hand project, presented at IROS 2024, introduces a new dimension to CSAIL's data requirements. This fully-actuated dexterous robot hand integrates vision-based tactile sensors with compliant actuation — enabling it to sense contact through embedded cameras that observe fingertip deformation. Training policies for this hand requires synchronized visual and tactile data streams during in-hand manipulation tasks, a data modality that barely exists at scale. The hand's 15+ degrees of freedom create a high-dimensional action space that demands large quantities of demonstration data to cover adequately.\n\nDaniela Rus's soft robotics research adds a material dimension. Soft robot grippers and actuators interact with objects through distributed contact — the gripper deforms around the object rather than making point contacts. Training controllers for soft manipulation requires data that captures the deformation dynamics of both gripper and object, including material compliance, viscoelastic properties, and shape recovery behavior. This is among the most challenging data collection problems in robotics because the relevant physical quantities are difficult to measure with standard sensors.\n\nCSAIL's influence on the field means that data created for their research propagates widely. Drake is used by hundreds of research groups worldwide. Datasets and benchmarks created at CSAIL become community standards — making investment in high-quality, diverse data for CSAIL research a high-leverage contribution to the entire robot learning ecosystem.",

  metaTitle: "Training Data for MIT CSAIL Robotics Research | Claru",
  metaDescription:
    "Contact-rich manipulation, locomotion validation, and dexterous hand data for MIT CSAIL's robotics groups including Drake, Improbable AI Lab, and EyeSight Hand.",
  primaryKeyword: "MIT CSAIL robotics training data",
  secondaryKeywords: [
    "Drake simulator validation data",
    "contact-rich manipulation data",
    "MIT robotics data",
    "Improbable AI Lab data",
  ],
  canonicalPath: "/for/mit-csail-robotics",
  h1: "Training Data for MIT CSAIL Robotics",
  heroSubtitle:
    "CSAIL combines physics-based modeling with learning-based policies. Both approaches need real-world data — Drake for validation, Improbable AI Lab for training.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Labs", href: "/for" },
    {
      label: "MIT CSAIL Robotics",
      href: "/for/mit-csail-robotics",
    },
  ],
  sections: [
    {
      type: "prose",
      heading: "About MIT CSAIL Robotics",
      paragraphs: [
        "MIT's Computer Science and Artificial Intelligence Laboratory (CSAIL), founded in 2003 through the merger of the AI Lab and the Laboratory for Computer Science, is home to multiple world-leading robotics research groups. The lab operates within MIT's Schwarzman College of Computing and has produced foundational contributions to robot manipulation, locomotion, and perception that have shaped the field for decades.",
        "Russ Tedrake holds the Toyota Professorship of EECS, Aeronautics and Astronautics, and Mechanical Engineering — a title that reflects the depth of MIT's industry relationships. His Robot Locomotion Group develops Drake, the open-source simulation platform used by hundreds of research labs and companies for physics-based robot planning and control. Pulkit Agrawal's Improbable AI Lab focuses on learning-based approaches to manipulation, publishing prolifically at top venues including four papers at NeurIPS and CoRL in 2024 alone.",
        "Daniela Rus, CSAIL's director, leads the Distributed Robotics Lab with research spanning soft robotics, multi-robot coordination, and autonomous vehicles. The breadth of CSAIL's robotics portfolio — from the molecular scale to fleet-level coordination — makes it one of the most comprehensive robotics research environments in the world.",
      ],
    },
    {
      type: "stats",
      heading: "MIT CSAIL Robotics at a Glance",
      stats: [
        { value: "3+", label: "Major Robotics Groups" },
        { value: "Drake", label: "Simulation Platform" },
        { value: "2003", label: "CSAIL Founded" },
        { value: "Toyota", label: "Tedrake Chair" },
        { value: "IROS 2024", label: "EyeSight Hand Debut" },
        { value: "4", label: "NeurIPS/CoRL 2024 Papers" },
      ],
    },
    {
      type: "prose",
      heading: "Research Focus and Key Projects",
      paragraphs: [
        "The Tedrake Group's Drake simulator represents a unique research asset. Unlike game-engine-based simulators (Isaac Gym, MuJoCo), Drake emphasizes physical accuracy over simulation speed — making it the tool of choice when contact dynamics must be modeled precisely. This makes Drake particularly valuable for manipulation planning in contact-rich scenarios: fitting parts together, sliding objects along surfaces, and operating tools where millimeter-level precision matters. However, Drake's accuracy is only as good as its calibration data from the real world.",
        "The Improbable AI Lab's 2024 research output demonstrates the frontier of learning-based manipulation. Their work on diffusion policy gradients shows that diffusion models can learn complex manipulation behaviors from scratch rather than requiring pretrained representations. Their few-shot task learning research demonstrates that robots can learn new manipulation skills from just a handful of demonstrations when the underlying model has been pretrained on diverse data. Both research directions are bottlenecked by the diversity and quality of available manipulation training data.",
        "The EyeSight Hand represents CSAIL's push into dexterous manipulation with integrated sensing. Unlike hands that rely on external cameras alone, EyeSight embeds vision-based tactile sensors directly into the fingertips, enabling the hand to sense contact pressure, slip, and object texture through internal cameras that observe fingertip deformation. This creates a new data modality requirement: synchronized external vision, tactile images, proprioception, and action labels during dexterous manipulation tasks.",
      ],
    },
    {
      type: "prose",
      heading: "Data Requirements Analysis",
      paragraphs: [
        "CSAIL's data requirements are unusually specific compared to most robotics labs because of the physics-modeling emphasis. Drake needs validation data with precise force and contact measurements — not just video of robots grasping objects, but recordings with measured surface friction coefficients, contact patch geometries, and object mass distributions. This level of physical annotation is rare in existing datasets.",
        "The Improbable AI Lab's learning-based approach has more conventional data needs but at larger scale. Diffusion policy training benefits from thousands of manipulation demonstrations across diverse object categories, surface types, and lighting conditions. The few-shot learning research specifically needs datasets with many different tasks, each represented by a small number of demonstrations — a distribution that standard manipulation datasets are not designed to provide.",
        "The dexterous hand dimension adds a third data requirement that few other labs share. Training policies for a 15+ DOF hand with integrated tactile sensing requires data that most manipulation datasets do not contain: finger-level joint angles, tactile images from each fingertip, and detailed contact annotations during precision grasping, in-hand rotation, and tool use.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports MIT CSAIL",
      paragraphs: [
        "Claru's manipulation trajectory dataset provides the environmental and object diversity that CSAIL's learning-based research requires. Demonstrations collected across 100+ cities with thousands of unique objects capture the visual and physical distribution that makes trained policies robust — whether for diffusion policy pretraining or few-shot task generalization.",
        "For Drake validation, Claru's ability to coordinate data collection with standardized force-sensing instrumentation produces the physics-annotated data that simulation calibration requires. Multi-camera recordings with synchronized force measurements in diverse environments give the Tedrake Group the calibration signal needed to keep Drake's contact models grounded in physical reality.",
        "Claru's egocentric activity dataset of 386K+ clips serves as a pretraining resource for CSAIL's research on learning manipulation from human demonstrations. The dataset captures human activities with temporal annotations and activity labels — providing the visual pretraining signal that improves downstream robot manipulation performance across all of CSAIL's learning-based research programs.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "pang-contact-2023",
          title:
            "Global Planning for Contact-Rich Manipulation via Local Smoothing of Quasi-Dynamic Contact Models",
          authors: "Pang et al.",
          venue: "TRO 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2206.10787",
        },
        {
          id: "agrawal-diffusion-2024",
          title:
            "Learning Multimodal Behaviors from Scratch with Diffusion Policy Gradient",
          authors: "Agrawal et al.",
          venue: "NeurIPS 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2406.00681",
        },
        {
          id: "liu-eyesight-hand-2024",
          title:
            "EyeSight Hand: Design of a Fully-Actuated Dexterous Robot Hand",
          authors: "Liu et al.",
          venue: "IROS 2024",
          year: 2024,
          url: "https://ieeexplore.ieee.org/document/10802619",
        },
        {
          id: "tedrake-drake-2019",
          title:
            "Drake: Model-Based Design and Verification for Robotics",
          authors: "Tedrake, R.",
          venue: "MIT Technical Report",
          year: 2019,
          url: "https://drake.mit.edu/",
        },
      ],
    },
  ],
  faqs: [
    {
      question:
        "Why does Drake simulator need real-world data despite being physics-based?",
      answer:
        "Drake provides high-fidelity contact simulation but its models need calibration against real-world measurements. Surface friction, material compliance, and geometric imperfections differ between simulation and reality. Real-world manipulation data with force measurements validates and improves Drake's contact models, keeping simulation grounded in physical truth.",
    },
    {
      question: "What is contact-rich manipulation data?",
      answer:
        "Contact-rich manipulation involves tasks where success depends on detailed contact interactions — fitting parts together, sliding objects along surfaces, stacking items. Data must capture contact locations, normal forces, friction, and object states with high temporal resolution to be useful for training or validating contact-aware planners like those built on Drake.",
    },
    {
      question: "What is the EyeSight Hand and what data does it need?",
      answer:
        "EyeSight Hand is a fully-actuated dexterous robot hand developed at CSAIL with vision-based tactile sensors embedded in each fingertip. It needs synchronized data streams including external camera views, internal tactile images from each fingertip, joint angles, and force measurements during precision grasping and in-hand manipulation tasks.",
    },
    {
      question:
        "How does CSAIL's research influence the broader robotics community?",
      answer:
        "Drake is used by hundreds of research labs and companies worldwide for physics-based robot planning. CSAIL-created datasets, benchmarks, and tools become community standards. High-quality, diverse data created for CSAIL research propagates to thousands of researchers, making investment in CSAIL-targeted data a high-leverage contribution to the field.",
    },
    {
      question:
        "What is diffusion policy and why does the Improbable AI Lab need diverse data for it?",
      answer:
        "Diffusion policy learns robot manipulation by modeling the distribution of successful actions using a denoising diffusion process. The Improbable AI Lab's 2024 research showed these models can learn complex behaviors from scratch — but the diversity and quality of training data determines how well policies generalize to new objects, environments, and tasks.",
    },
  ],
  ctaHeading: "Data for Physics-Grounded Robot Learning",
  ctaDescription:
    "Discuss contact-rich manipulation and locomotion data for MIT CSAIL's robotics research.",
  relatedGlossaryTerms: [
    "contact-rich-manipulation",
    "sim-to-real-gap",
    "manipulation-trajectory",
    "proprioceptive-data",
  ],
  relatedGuidePages: [
    "how-to-build-a-contact-rich-manipulation-dataset",
    "how-to-evaluate-sim-to-real-transfer",
  ],
  relatedSolutionSlugs: [],
};

export default page;
