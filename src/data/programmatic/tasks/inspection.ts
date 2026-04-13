import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "inspection",
  metaTitle: "Inspection Training Data for Robotics | Claru",
  metaDescription:
    "Training data for robotic inspection: visual defect detection, dimensional verification, and surface quality assessment. Multi-sensor demonstrations with defect annotations for learned inspection policies.",
  primaryKeyword: "robotic inspection training data",
  secondaryKeywords: [
    "inspection task dataset",
    "robot quality inspection demonstrations",
    "visual defect detection training data",
    "automated inspection data",
    "surface inspection automation dataset",
    "dimensional measurement robot data"
],
  canonicalPath: "/training-data/inspection",
  h1: "Inspection Task Training Data",
  heroSubtitle:
    "Inspection datasets for robotic quality control — visual defect detection, dimensional measurement, and surface characterization with high-resolution imaging, defect taxonomy annotations, and viewpoint planning data.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Inspection", href: "/training-data/inspection" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Robotic Inspection and Why Does Data Matter?",
      paragraphs: [
        "Inspection is a critical robotic manipulation capability with growing demand across industrial automation, logistics, and service robotics. The task requires precise coordination of perception, planning, and control — making high-quality demonstration data essential for training policies that generalize beyond scripted trajectories. Traditional automation approaches rely on hand-coded programs that must be reprogrammed for each product variant or environment change, creating a bottleneck that learning-based approaches can overcome with sufficient training data.",
        "The data challenge in inspection is multifaceted. Success depends on precise force control, accurate state estimation, and adaptive behavior in response to environmental variation. Demonstrations must capture not just the nominal execution trajectory but the full range of corrective behaviors, error recovery strategies, and edge cases that arise in real operations. Without this diversity, learned policies overfit to idealized conditions and fail when deployed in the variability of production environments.",
        "Research has consistently shown that multimodal data — combining vision, force/torque sensing, and proprioception — dramatically improves policy performance for inspection tasks. Vision-only policies typically achieve 60-75% success rates on contact-rich variants of this task, while multimodal policies reach 85-95% by leveraging force feedback for precise contact state estimation and compliance control. This 15-30 percentage point improvement establishes multimodal demonstration data as essential for production-grade inspection systems.",
        "The commercial applications of robotic inspection span manufacturing, logistics, healthcare, and service industries. As labor costs rise and workforce availability tightens, automation of inspection operations becomes increasingly economically compelling. The primary barrier to adoption is not hardware capability but the availability of training data that captures the full complexity of real-world inspection scenarios — including material variation, environmental uncertainty, and the diverse strategies that experienced human operators employ.",
      ],
    },
    {
      type: "stats",
      heading: "Inspection Data by the Numbers",
      stats: [
        { value: "85-95%", label: "Multimodal policy success rate on inspection" },
        { value: "15-30 pp", label: "Success improvement from adding force modality" },
        { value: "500+", label: "Demonstrations for robust single-variant policy" },
        { value: "30 Hz", label: "Minimum video capture rate for demonstrations" },
        { value: "500 Hz", label: "Recommended force/torque sampling rate" },
        { value: "5-10K", label: "Demonstrations for multi-variant generalization" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Learning Approach",
      description:
        "Different learning architectures for inspection have distinct data requirements. Choose based on your deployment constraints and available sensing.",
      columns: [
        "Approach",
        "Data Volume",
        "Key Modalities",
        "Key Advantage",
        "Best For",
      ],
      rows: [
        {
          Approach: "Behavioral Cloning",
          "Data Volume": "500-5K demonstrations",
          "Key Modalities": "RGB + proprioception + force/torque",
          "Key Advantage": "Simple pipeline; direct demonstration mapping",
          "Best For": "Single-variant tasks with consistent setup",
        },
        {
          Approach: "Diffusion Policy",
          "Data Volume": "100-1K demonstrations",
          "Key Modalities": "Multi-view RGB + force/torque + proprioception",
          "Key Advantage": "Handles multimodal action distributions",
          "Best For": "Tasks with multiple valid strategies",
        },
        {
          Approach: "ACT (Action Chunking Transformers)",
          "Data Volume": "50-500 demonstrations",
          "Key Modalities": "RGB + proprioception (bimanual)",
          "Key Advantage": "Smooth trajectory generation; temporal coherence",
          "Best For": "Bimanual or long-horizon sequential tasks",
        },
        {
          Approach: "Sim-to-Real Transfer",
          "Data Volume": "500K+ sim + 200-1K real",
          "Key Modalities": "Sim state + real RGB-D for domain adaptation",
          "Key Advantage": "Scalable; diverse configuration coverage",
          "Best For": "Tasks with good simulation models available",
        },
        {
          Approach: "VLA Fine-tuning (RT-2, OpenVLA)",
          "Data Volume": "5K-50K demonstrations + language labels",
          "Key Modalities": "RGB + language instructions",
          "Key Advantage": "Zero-shot generalization to novel variants",
          "Best For": "Multi-task systems with language conditioning",
        },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Learned Inspection",
      paragraphs: [
        "Recent advances in robot learning have dramatically improved the capabilities of learned inspection policies. Diffusion Policy (Chi et al., 2023) has emerged as a leading architecture for contact-rich manipulation tasks, achieving state-of-the-art results on benchmarks that include inspection components. The key advantage of diffusion models for this task is their ability to represent multimodal action distributions — when multiple valid execution strategies exist, the policy generates diverse high-quality actions rather than averaging across strategies.",
        "ACT (Action Chunking with Transformers, Zhao et al., 2023) has shown particular promise for inspection tasks that require smooth, temporally coherent trajectories. By predicting action sequences of 10-50 timesteps rather than individual actions, ACT produces the continuous motions needed for contact-rich tasks without the jerky transitions that plague frame-by-frame policies. On real-robot benchmarks involving similar manipulation skills, ACT achieves 85-96% success rates with only 50-100 teleoperated demonstrations.",
        "Foundation models like RT-2 (Brohan et al., 2023) and OpenVLA (Kim et al., 2024) have demonstrated that pretrained vision-language models can be fine-tuned for inspection with significantly less task-specific data than training from scratch. RT-2 achieves 60-75% zero-shot success on novel task variants described in natural language, suggesting that internet-scale pretraining provides transferable understanding of physical interactions. However, precision-critical aspects of inspection still require task-specific demonstrations to achieve production-grade reliability.",
        "The Open X-Embodiment initiative (Padalkar et al., 2023) has aggregated 970K robot episodes across 60+ datasets, providing a large-scale pretraining corpus that improves downstream performance on inspection by 50-100% compared to training on individual datasets. Models pretrained on OXE and fine-tuned with 1K-5K task-specific demonstrations consistently outperform models trained from scratch on 10K demonstrations, establishing the pretrain-then-fine-tune paradigm as the most data-efficient approach for new inspection deployments.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Inspection Data",
      paragraphs: [
        "Data collection for inspection requires a workspace instrumented for high-fidelity demonstration capture. The standard setup includes 2-3 calibrated RGB-D cameras covering the workspace from multiple viewpoints (overhead, angled, wrist-mounted), a 6-axis force/torque sensor at the robot wrist for contact force measurement, and proprioceptive recording from robot joint encoders at 50-100 Hz. Camera placement should ensure continuous visibility of the manipulation target throughout the entire task execution, including during phases where the robot hand may occlude direct overhead views.",
        "Teleoperation is the primary collection method, with bilateral leader-follower systems (ALOHA-style) or VR controller interfaces enabling operators to perform natural task motions. Collection throughput depends on task complexity: simple single-action tasks yield 100-200 demonstrations per hour, while multi-step sequences with precision requirements drop to 30-60 per hour. Operators should be trained on the specific task procedures and complete a qualification round (20-50 successful demonstrations) before production collection begins. Rotate operators every 60-90 minutes to prevent fatigue-induced quality degradation.",
        "Annotation requirements include: task phase segmentation (approach, contact, execute, verify, retract), contact state labels at key frames, success/failure classification with failure mode taxonomy, natural language task description (1-3 sentences), and any task-specific measurements (force profiles, dimensional accuracy, completion metrics). For learning-based architectures that process raw sensor streams (RT-1, Diffusion Policy), lightweight annotations (success label + language description) suffice. For modular approaches or curriculum learning, richer per-frame annotations enable more targeted training.",
        "Data diversity drives generalization more than data volume. Systematically vary: object/part configurations (position, orientation, variant), environmental conditions (lighting, background clutter), operator strategies (encourage multiple valid approaches per task), and difficulty levels (easy baseline through challenging edge cases). Include 10-20% of demonstrations with intentional variation from nominal conditions — slightly different starting poses, minor obstacles, tool wear — to teach robust policies that handle the real-world variability absent from pristine lab setups.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Inspection Data Needs",
      paragraphs: [
        "Claru provides inspection data collection with precision-instrumented workstations designed for high-fidelity manipulation demonstrations. Each station features calibrated multi-view RGB-D cameras (2 fixed + 1 wrist-mounted, synchronized at 30 Hz), a 6-axis force/torque sensor at the robot wrist (500 Hz, 0.01 N resolution), and proprioceptive recording at 50-100 Hz. We support both kinesthetic teaching for force-sensitive tasks and bilateral teleoperation for complex multi-step sequences.",
        "Our operators are trained on inspection procedures specific to each client application, completing a qualification protocol before production data collection begins. We systematically vary task configurations, environmental conditions, and execution strategies to maximize data diversity. Each demonstration captures the complete task cycle with automatic phase segmentation, contact state annotations, success labels with failure mode classification, and natural language task descriptions.",
        "Claru delivers inspection datasets formatted for direct ingestion by Diffusion Policy, ACT/ALOHA, RT-2, OpenVLA, Octo, or custom architectures. Standard deliverables include synchronized multi-view video, force/torque profiles, proprioceptive streams, per-episode annotations, and train/validation/test splits. Our daily throughput enables rapid scaling to the demonstration volumes that modern foundation models and task-specific policies require for production-grade reliability.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "chi-diffusion-2023",
          title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
          authors: "Chi et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2303.04137",
        },
        {
          id: "zhao-act-2023",
          title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
          authors: "Zhao et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2304.13705",
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
          id: "padalkar-oxe-2023",
          title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
          authors: "Padalkar et al.",
          venue: "ICRA 2024",
          year: 2023,
          url: "https://arxiv.org/abs/2310.08864",
        },
        {
          id: "kim-openvla-2024",
          title: "OpenVLA: An Open-Source Vision-Language-Action Model",
          authors: "Kim et al.",
          venue: "CoRL 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2406.09246",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "How many demonstrations are needed for inspection?",
      answer:
        "For a single-variant task with Diffusion Policy, 100-500 demonstrations typically achieve 80%+ success. For multi-variant generalization across different configurations, 1,000-5,000 demonstrations are recommended. Foundation model fine-tuning (RT-2, OpenVLA) requires 5,000-50,000 demonstrations for broad generalization but can achieve 60-75% zero-shot success on novel variants with fewer task-specific demos. Start with 50-100 demonstrations to validate the pipeline before scaling.",
    },
    {
      question: "Is force/torque data essential for inspection demonstrations?",
      answer:
        "Force/torque data provides a 15-30 percentage point improvement on contact-rich variants of this task. Vision-only policies can succeed on simple variants (60-75%) but fail on precision-critical aspects where contact state information is essential. If your deployment involves sustained contact, tight tolerances, or force-sensitive materials, force/torque data is non-optional. Record at 500 Hz minimum to capture contact transients.",
    },
    {
      question: "Can simulation replace real inspection demonstrations?",
      answer:
        "Simulation is effective for pretraining perception and generating diverse configurations, but the sim-to-real gap for contact-rich inspection tasks is typically 15-25 percentage points. The optimal approach is simulation pretraining (100K+ episodes) followed by real-world fine-tuning (500-2,000 demonstrations), which outperforms either modality alone. Real demonstrations are essential for capturing material properties, friction variations, and sensor characteristics that simulation approximates poorly.",
    },
    {
      question: "What camera setup is recommended for data collection?",
      answer:
        "Minimum: 1 overhead RGB-D camera + 1 wrist-mounted RGB camera, synchronized at 30 Hz. Recommended: 2 fixed RGB-D cameras (overhead + angled) + 1 wrist-mounted RGB camera. The angled camera provides views during phases where the robot hand occludes overhead visibility. Use structured-light depth sensors (Zivid, Photoneo) for sub-millimeter accuracy when precise spatial reasoning is needed. Ensure consistent lighting across the workspace to avoid shadow-induced perception failures.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Inspection Task Data",
  ctaDescription:
    "Tell us about your inspection requirements and we will design a data collection plan matched to your specific application and deployment constraints.",
  relatedGlossaryTerms: [
    "contact-rich-manipulation",
    "manipulation-trajectory",
    "force-torque-data",
    "behavioral-cloning",
    "proprioceptive-data",
  ],
  relatedGuidePages: [
    "how-to-build-a-contact-rich-manipulation-dataset",
    "how-to-label-robot-demonstrations",
  ],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "High-res RGB + structured light + multispectral imaging + robot pose",
    volumeRange: "10K-100K inspection images with defect annotations",
    temporalResolution: "5-30 Hz imaging (resolution-dependent), per-image defect annotations",
    keyAnnotations: [
      "Defect type, location, and severity classification",
      "Bounding box and segmentation mask for each defect",
      "Dimensional measurements with tolerance pass/fail",
      "Surface roughness and texture characterization",
      "Inspection viewpoint pose and lighting conditions",
      "Part identity, specification, and inspection criteria"
],
  },
  relevantModels: [
    "YOLO / Faster R-CNN for defect detection",
    "Anomaly detection networks (PatchCore, DRAEM)",
    "Active viewpoint planning models",
    "3D reconstruction for dimensional inspection",
    "Foundation models for zero-shot defect detection",
    "Digital twin comparison systems"
],
  environmentTypes: [
    "Automotive quality line",
    "Electronics PCB inspection",
    "Pharmaceutical packaging inspection",
    "Aerospace NDT station",
    "Metal casting inspection",
    "Semiconductor wafer inspection"
],
  keyPapers: [
    {
      id: "chi-diffusion-2023",
      title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137",
    },
    {
      id: "zhao-act-2023",
      title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
      authors: "Zhao et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.13705",
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
      id: "padalkar-oxe-2023",
      title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Padalkar et al.",
      venue: "ICRA 2024",
      year: 2023,
      url: "https://arxiv.org/abs/2310.08864",
    },
  ],
  claruRelevance:
    "Claru provides inspection data collection with precision-instrumented workstations featuring calibrated multi-view RGB-D cameras (2 fixed + 1 wrist-mounted, synchronized at 30 Hz), 6-axis force/torque sensing at the wrist (500 Hz, 0.01 N resolution), and proprioceptive recording at 50-100 Hz. Our operators are trained on client-specific inspection procedures with qualification protocols before production collection. We systematically vary configurations, conditions, and strategies to maximize diversity. Deliverables include synchronized multi-view video, force profiles, proprioceptive streams, per-episode annotations, and formatted outputs for Diffusion Policy, ACT/ALOHA, RT-2, OpenVLA, Octo, or custom architectures.",
};

export default data;
