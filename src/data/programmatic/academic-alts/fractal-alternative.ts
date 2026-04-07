import type { AcademicAltPageData } from "../types";

const data: AcademicAltPageData = {
  slug: "fractal-alternative",
  metaTitle: "FRACTAL (RT-1 Dataset) Alternative for Production Robotics | Claru",
  metaDescription:
    "Compare Google's FRACTAL/RT-1 dataset of 130K demonstrations across 744 tasks with Claru's targeted commercial data. Platform specificity, quality, and deployment readiness compared.",
  primaryKeyword: "fractal rt-1 dataset alternative",
  secondaryKeywords: [
    "rt-1 dataset alternative",
    "fractal dataset vs claru",
    "robotics transformer training data",
    "google everyday robots dataset",
    "rt-1 data limitations",
  ],
  canonicalPath: "/compare/fractal-alternative",
  h1: "FRACTAL (RT-1 Dataset) Alternative: Targeted Commercial Data for Production Robotics",
  heroSubtitle:
    "Google's FRACTAL dataset -- the training corpus behind RT-1 (Robotics Transformer) -- contains 130,000 demonstrations across 744 tasks collected from 13 Everyday Robots over 17 months. It proved that large-scale, language-conditioned imitation learning works for real robots. But the dataset is locked to a discontinued robot platform, limited to Google office environments, and lacks the sensor diversity that production systems require. Compare FRACTAL with Claru's targeted, multi-modal data collected on your robot.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Compare", href: "/compare" },
    { label: "FRACTAL (RT-1 Dataset) Alternative", href: "/compare/fractal-alternative" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is the FRACTAL (RT-1) Dataset?",
      paragraphs: [
        "FRACTAL is the large-scale robot demonstration dataset used to train RT-1 (Robotics Transformer 1), published by Anthony Brohan and over 50 co-authors at Google's Everyday Robots division in December 2022 (arXiv 2212.06817). The dataset contains approximately 130,000 teleoperated demonstrations spanning 744 distinct tasks, collected from 13 Everyday Robots mobile manipulators over a 17-month period in Google office environments. RT-1 represented a landmark result: a single 35-million-parameter transformer model that could execute over 700 instructions at a 97% success rate, demonstrating that scaling data quantity and task diversity -- rather than model complexity -- was the key driver of real-world robot performance.",
        "The RT-1 architecture uses a FiLM-conditioned EfficientNet to process 300x300 RGB images, a TokenLearner to compress visual tokens, and a Transformer backbone to predict discretized 7-DoF actions (x, y, z, roll, pitch, yaw, gripper) conditioned on natural language instructions. The FRACTAL dataset was designed specifically for this architecture: every demonstration includes a 300x300 RGB image stream and a corresponding natural language task description. The action space captures end-effector position and orientation deltas in the robot's base frame, plus a binary gripper command, recorded at approximately 3 Hz.",
        "The 744 tasks cover a broad range of tabletop and mobile manipulation skills organized in Google's office kitchen and break room environments: picking and placing objects, opening and closing drawers, pulling napkins from holders, moving objects between surfaces, and combinations of these primitives. The paper showed that RT-1 generalized to novel objects (25% better than the next baseline), novel distractors (36% better), and novel backgrounds (18% better), establishing that data diversity is a stronger driver of generalization than architectural innovation alone.",
        "FRACTAL is released as part of the Open X-Embodiment (OXE) collection under an Apache 2.0 license via TensorFlow Datasets in the RLDS format. It is one of the largest single-robot demonstration datasets in OXE and has been used as a key pretraining ingredient for generalist policies including Octo and OpenVLA. However, the Everyday Robots division was shut down in early 2023, and the robot platform is no longer manufactured -- meaning the dataset cannot be extended with new data from the same robot, and researchers cannot replicate the exact hardware setup.",
      ],
    },
    {
      type: "stats",
      heading: "FRACTAL at a Glance",
      stats: [
        { value: "130K", label: "Robot Demonstrations" },
        { value: "744", label: "Distinct Tasks" },
        { value: "13", label: "Everyday Robots" },
        { value: "17mo", label: "Collection Duration" },
        { value: "97%", label: "RT-1 Success Rate" },
        { value: "Apache 2.0", label: "License (via OXE)" },
      ],
    },
    {
      type: "comparison-table",
      heading: "FRACTAL vs. Claru: Side-by-Side Comparison",
      description:
        "A detailed comparison across the dimensions that matter when moving from research pretraining to production deployment on your robot platform.",
      columns: ["Dimension", "FRACTAL (RT-1)", "Claru"],
      rows: [
        {
          Dimension: "License",
          "FRACTAL (RT-1)": "Apache 2.0 (via OXE) -- permissive commercial use",
          Claru: "Commercial license with IP assignment",
        },
        {
          Dimension: "Scale",
          "FRACTAL (RT-1)": "130K demonstrations, 744 tasks, 13 robots, 17 months",
          Claru: "1K to 1M+ demonstrations scoped to your deployment",
        },
        {
          Dimension: "Robot Platform",
          "FRACTAL (RT-1)": "Google Everyday Robots mobile manipulator (discontinued)",
          Claru: "Your specific robot platform and end-effector",
        },
        {
          Dimension: "Visual Input",
          "FRACTAL (RT-1)": "300x300 RGB only -- no depth, no stereo",
          Claru: "Full resolution RGB + depth + multi-view cameras",
        },
        {
          Dimension: "Action Space",
          "FRACTAL (RT-1)": "7-DoF discretized end-effector deltas at ~3 Hz",
          Claru: "Continuous actions matching your control interface at your frequency",
        },
        {
          Dimension: "Sensor Modalities",
          "FRACTAL (RT-1)": "RGB images and language only -- no force, depth, or proprioception",
          Claru: "RGB + depth + force/torque + proprioception + tactile",
        },
        {
          Dimension: "Environment",
          "FRACTAL (RT-1)": "Google office kitchens and break rooms exclusively",
          Claru: "Your actual deployment environment",
        },
        {
          Dimension: "Task Scope",
          "FRACTAL (RT-1)": "Office manipulation: pick-place, drawer open/close, napkin pull",
          Claru: "Custom task sets matching your production requirements",
        },
        {
          Dimension: "Expandability",
          "FRACTAL (RT-1)": "Frozen -- Everyday Robots discontinued, no new data possible",
          Claru: "Continuous collection on your timeline",
        },
        {
          Dimension: "Quality Control",
          "FRACTAL (RT-1)": "High-quality teleoperation with Google's internal standards",
          Claru: "Multi-stage QC with automated checks and >90% annotator agreement",
        },
      ],
    },
    {
      type: "prose",
      heading: "Key Limitations of FRACTAL for Production Use",
      paragraphs: [
        "FRACTAL's most fundamental production limitation is platform lock-in to a discontinued robot. The Everyday Robots mobile manipulator was a custom platform designed and manufactured internally at Google. When Google shut down the Everyday Robots division in early 2023, the platform ceased production. Teams cannot procure this robot, cannot extend the dataset with new demonstrations on the same hardware, and face a significant embodiment gap when transferring FRACTAL-trained policies to their own robots. The morphology, kinematics, gripper design, and camera placement of the Everyday Robot differ from commercial platforms like Franka, UR, xArm, and other robots commonly used in production deployments.",
        "The sensor modality coverage is remarkably sparse for a dataset of FRACTAL's scale. Demonstrations include only 300x300 RGB images and language instructions -- there is no depth data, no force/torque sensing, no proprioceptive state recording (joint positions, velocities, or torques), and no tactile information. This was a deliberate design choice for RT-1 (which was designed to learn purely from vision and language), but it limits the dataset's utility for training policies that leverage multi-modal sensing for contact-rich manipulation. Modern manipulation architectures increasingly rely on force feedback and proprioception for tasks that require precise contact control.",
        "The action space is discretized into 256 bins per dimension at approximately 3 Hz -- a design choice that worked well for RT-1's discrete action prediction but is incompatible with architectures that expect continuous action labels at higher frequencies. Policies based on diffusion (Diffusion Policy), flow matching, or continuous action regression require fundamentally different action representations. Converting FRACTAL's discretized actions back to continuous values introduces quantization noise that can degrade fine manipulation performance.",
        "The environment diversity is limited to Google's corporate office settings. All 130,000 demonstrations were collected in Google office kitchens, break rooms, and similar spaces. The visual backgrounds, lighting conditions, furniture, and object sets reflect this specific corporate environment. Production robots deploy in factories, warehouses, hospitals, retail stores, restaurants, and homes -- environments that look nothing like a Google office. Policies pretrained on FRACTAL alone will require substantial domain-specific fine-tuning data to bridge this environment gap.",
      ],
    },
    {
      type: "prose",
      heading: "When to Use FRACTAL vs. Commercial Data",
      paragraphs: [
        "FRACTAL is valuable as a pretraining component within the broader OXE collection. Its 130,000 demonstrations are among the highest-quality single-robot data in OXE, and policies pretrained on OXE (which includes FRACTAL as a major subset) develop strong manipulation priors that transfer across embodiments. If you are building a generalist robot policy using OXE pretraining, FRACTAL contributes important manipulation skills -- particularly pick-and-place, drawer interaction, and multi-step task chaining. The Apache 2.0 license makes this pretraining use commercially permissible.",
        "FRACTAL is also relevant if your research specifically involves the Robotics Transformer architecture family (RT-1, RT-2, RT-X). The dataset was designed for this architecture, and reproducing or extending RT-1 results requires FRACTAL data. For benchmarking new architectures against RT-1-class performance, FRACTAL provides the standard training corpus.",
        "Switch to commercial data when your deployment involves any robot other than the Everyday Robot. The embodiment gap between the Everyday Robot's custom morphology and commercial platforms means that FRACTAL demonstrations cannot directly train policies for your hardware. Even with cross-embodiment transfer, the domain-specific fine-tuning data for your robot and environment is what determines production success rates. Claru provides this fine-tuning data with demonstrations collected on your exact platform.",
        "The recommended production pipeline is: pretrain on OXE (which includes FRACTAL) for broad manipulation priors, then fine-tune on Claru's targeted data for your specific robot, tasks, and deployment environment. This combination leverages FRACTAL's scale for general capability while grounding policy behavior in the hardware and conditions of actual deployment.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Complements FRACTAL",
      paragraphs: [
        "Claru provides what FRACTAL cannot: demonstrations on your specific robot, in your specific environment, with the full sensor stack that modern architectures demand. Where FRACTAL offers 130,000 demonstrations on a discontinued Google robot in office settings, Claru delivers targeted demonstrations collected by trained teleoperators on your physical hardware, manipulating your actual production objects under your real deployment conditions. This eliminates both the embodiment gap and the environment gap in a single data source.",
        "Every Claru demonstration includes the multi-modal sensor coverage that FRACTAL lacks: full-resolution RGB and depth imagery, 6-axis force/torque measurements at the wrist, complete proprioceptive state (joint positions, velocities, and torques), and gripper contact detection. These modalities are precisely synchronized at your robot's control frequency -- whether that is 10 Hz, 30 Hz, or higher -- and actions are delivered as continuous values rather than discretized bins, making the data compatible with diffusion policies, flow matching, and other modern continuous-action architectures.",
        "Claru's task scope is defined by your deployment needs, not by what was available in a Google office break room. Whether your robot needs to perform surgical instrument handoffs, warehouse bin picking, food preparation, electronic assembly, or any other manipulation task, our data collection is scoped to your specific requirements. Task definitions, success criteria, and failure mode categorizations are defined collaboratively before collection begins.",
        "All data ships with a commercial license and IP assignment. It is delivered in RLDS format (matching OXE's standard for seamless co-training), as well as HDF5, zarr, and LeRobot formats. Because Claru's collection is ongoing, your dataset grows alongside your deployment requirements rather than remaining frozen like FRACTAL.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "brohan-rt1-2023",
          title: "RT-1: Robotics Transformer for Real-World Control at Scale",
          authors: "Brohan et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2212.06817",
        },
        {
          id: "brohan-rt2-2023",
          title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
          authors: "Brohan et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2307.15818",
        },
        {
          id: "embodiment-collaboration-2024",
          title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
          authors: "Open X-Embodiment Collaboration",
          venue: "ICRA 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2310.08864",
        },
        {
          id: "team-octo-2024",
          title: "Octo: An Open-Source Generalist Robot Policy",
          authors: "Octo Model Team",
          venue: "RSS 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2405.12213",
        },
        {
          id: "chi-diffusion-2023",
          title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
          authors: "Chi et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2303.04137",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Can I use the FRACTAL dataset commercially?",
      answer:
        "Yes. FRACTAL is released as part of the Open X-Embodiment collection under an Apache 2.0 license, which permits commercial use. However, the dataset is limited to the Google Everyday Robots platform (now discontinued), 300x300 RGB images without depth or force data, and Google office environments. While commercially licensable, FRACTAL alone is unlikely to meet the needs of production deployment on a different robot platform in a different environment. Claru provides complementary commercial data collected on your specific hardware and deployment setting.",
    },
    {
      question: "Is the Everyday Robots platform still available?",
      answer:
        "No. Google shut down the Everyday Robots division in early 2023, and the mobile manipulator platform is no longer manufactured. This means the FRACTAL dataset is permanently frozen -- no new demonstrations can be collected on the same hardware, and the exact platform cannot be procured for deployment. Teams working with FRACTAL data must transfer learned policies to different robot embodiments, which introduces an embodiment gap that requires fine-tuning on demonstrations from the target platform. Claru collects data on commercially available robot platforms that your team can actually purchase and deploy.",
    },
    {
      question: "How does RT-1's 97% success rate translate to production performance?",
      answer:
        "RT-1's 97% success rate was measured on its training distribution -- the specific set of 744 tasks in Google's office environment using the Everyday Robot. This does not mean RT-1 (or a policy trained on FRACTAL data) will achieve 97% success on a different robot, different tasks, or a different environment. Cross-embodiment transfer studies from the OXE collaboration show that performance typically drops significantly when moving to new platforms. Achieving high success rates in production requires domain-specific fine-tuning data from your actual deployment conditions, which is what Claru provides.",
    },
    {
      question: "Why does FRACTAL only have 300x300 RGB images?",
      answer:
        "RT-1 was designed around a specific architectural choice: compress visual input through an EfficientNet encoder operating on 300x300 images. The FRACTAL dataset was collected specifically for this architecture, so all imagery was captured at this resolution. The dataset includes no depth, force/torque, proprioceptive, or tactile data because RT-1 was designed to learn purely from vision and language. Modern architectures increasingly benefit from higher-resolution inputs and multi-modal sensing -- diffusion policies, for example, can leverage depth and proprioception to improve contact-rich manipulation performance.",
    },
    {
      question: "Should I use FRACTAL or Bridge V2 for pretraining my robot policy?",
      answer:
        "Both are valuable as part of the OXE pretraining mix, but they contribute differently. FRACTAL provides 130K demonstrations from a mobile manipulator doing office tasks at ~3 Hz with 300x300 RGB. Bridge V2 provides ~60K demonstrations from a WidowX tabletop arm doing kitchen tasks at higher resolution. If your deployment involves a tabletop arm, Bridge V2 may be more directly relevant. If you want maximum data diversity, use both within the OXE collection. Regardless of your pretraining mix, production deployment requires fine-tuning on domain-specific data from your actual robot and environment -- which is what Claru delivers.",
    },
  ],
  ctaHeading: "From Research Pretraining to Production Deployment",
  ctaDescription:
    "Complement your FRACTAL/OXE pretraining with targeted, multi-modal data collected on your robot platform and in your deployment environment. Get a custom data collection plan from our team.",
  relatedGlossaryTerms: [
    "robotics-transformer",
    "imitation-learning",
    "cross-embodiment-data",
    "rlds",
    "vla",
  ],
  relatedGuidePages: [
    "how-to-build-a-cross-embodiment-dataset",
    "how-to-evaluate-training-data-quality",
  ],
  relatedSolutionSlugs: ["vla-training-data"],
  datasetName: "FRACTAL (RT-1 Dataset)",
  academicProfile: {
    institution: "Google (Everyday Robots Division)",
    year: 2022,
    scale:
      "130,000 demonstrations across 744 tasks from 13 Everyday Robots over 17 months",
    license: "Apache 2.0 (via Open X-Embodiment)",
    modalities: [
      "RGB images (300x300)",
      "7-DoF discretized end-effector actions (~3 Hz)",
      "Natural language task instructions",
    ],
  },
  limitations: [
    "Locked to the discontinued Google Everyday Robots platform -- no new data collection possible",
    "RGB-only at 300x300 resolution -- no depth, force/torque, proprioception, or tactile data",
    "Discretized action space (256 bins) incompatible with continuous-action architectures",
    "Low temporal resolution (~3 Hz) insufficient for tasks requiring reactive control",
    "All environments are Google corporate offices -- no production environment diversity",
    "Significant embodiment gap when transferring to commercial robot platforms",
    "Object set limited to office items -- no industrial, medical, food service, or retail objects",
    "Cannot be extended or customized for new tasks, objects, or environments",
  ],
  claruAdvantages: [
    "Data collected on your specific robot platform -- no embodiment gap",
    "Full multi-modal sensor coverage: RGB, depth, force/torque, proprioception, tactile",
    "Continuous actions at your robot's control frequency (10-100+ Hz)",
    "Data from your actual deployment environment, not Google office settings",
    "Custom task definitions matching your production requirements",
    "RLDS-compatible delivery for seamless co-training with OXE/FRACTAL",
    "Commercial license with IP assignment",
    "Continuous collection that grows with your evolving deployment needs",
  ],
  keyPapers: [
    {
      id: "brohan-rt1-2023",
      title: "RT-1: Robotics Transformer for Real-World Control at Scale",
      authors: "Brohan et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2212.06817",
    },
    {
      id: "brohan-rt2-2023",
      title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2307.15818",
    },
    {
      id: "embodiment-collaboration-2024",
      title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Open X-Embodiment Collaboration",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864",
    },
    {
      id: "team-octo-2024",
      title: "Octo: An Open-Source Generalist Robot Policy",
      authors: "Octo Model Team",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2405.12213",
    },
    {
      id: "chi-diffusion-2023",
      title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137",
    },
  ],
  claruRelevance:
    "FRACTAL demonstrated a landmark result: that a single transformer policy trained on 130,000 demonstrations across 744 tasks could achieve 97% success rate on a real robot, proving the viability of large-scale imitation learning. As part of the OXE collection, FRACTAL remains one of the most important pretraining data sources for generalist robot policies. However, production deployment reveals FRACTAL's structural constraints: the Everyday Robot platform is discontinued, the sensor modalities are limited to low-resolution RGB, the action space is discretized and slow, and the environments are exclusively Google offices. Claru addresses each of these gaps with demonstrations collected on your specific robot platform, in your actual deployment environment, with the full sensor stack and continuous action labels that modern architectures require. Teams that pretrain on OXE (including FRACTAL) and fine-tune on Claru data capture the broad manipulation priors that data diversity provides while grounding policy behavior in the hardware, objects, and conditions of real deployment. We deliver in RLDS format for seamless integration with OXE-based training pipelines.",
};

export default data;
