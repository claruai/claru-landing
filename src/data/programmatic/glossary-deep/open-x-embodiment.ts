import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "open-x-embodiment",
  termSlug: "open-x-embodiment",
  category: "models-architectures",
  metaTitle: "Open X-Embodiment (OXE) Dataset — Definition | Claru",
  metaDescription: "Open X-Embodiment is a 1M+ trajectory robot dataset from 22 embodiments across 21 institutions. Learn its structure, limitations, and how to extend it.",
  primaryKeyword: "Open X-Embodiment",
  secondaryKeywords: ["OXE dataset", "open x embodiment dataset", "cross embodiment robot data", "RT-X training data", "multi-robot dataset"],
  canonicalPath: "/glossary/open-x-embodiment",
  h1: "Open X-Embodiment: The Largest Open Cross-Robot Training Dataset",
  heroSubtitle: "Open X-Embodiment (OXE) is a large-scale robot learning dataset released by Google DeepMind and collaborators in 2023, aggregating over 1 million robot trajectories from 22 different robot embodiments across 21 research institutions. OXE established the principle that training on diverse cross-embodiment data produces more generalizable robot policies than training on a single embodiment. It is the foundation dataset for models like RT-X and Octo.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Open X-Embodiment", href: "/glossary/open-x-embodiment" },
  ],
  sections: [],
  faqs: [
    {
      question: "What robot platforms are included in Open X-Embodiment?",
      answer: "OXE includes data from 22 different robot embodiments including the Google Robot (large mobile manipulator), Franka Panda (7-DOF arm), UR5/UR5e (6-DOF arms), Kuka iiwa, xArm, WidowX, and several custom platforms. The dataset spans tabletop manipulation, mobile manipulation, and some navigation tasks. Each embodiment has different action spaces, camera configurations, and task distributions, which is both the strength and complexity of the dataset.",
    },
    {
      question: "What are the main limitations of OXE?",
      answer: "Key limitations include: (1) Uneven data distribution — Google's own robots contribute a disproportionate share of the total trajectories. (2) Limited embodiment diversity — most platforms are 6-7 DOF arms with parallel-jaw grippers; humanoids, dexterous hands, and mobile platforms are underrepresented. (3) Narrow environment diversity — most data comes from lab settings with clean backgrounds and controlled lighting. (4) Inconsistent quality — data quality varies significantly across contributing institutions. (5) Limited annotation — many trajectories have minimal language annotations or task metadata.",
    },
    {
      question: "How do you convert data to OXE/RLDS format?",
      answer: "OXE uses the RLDS (Reinforcement Learning Datasets) format, which stores trajectories as TensorFlow Dataset records with standardized field names. Each episode contains a sequence of steps, and each step includes observation (RGB images, possibly depth and state), action (joint positions, end-effector poses, or commands), discount, reward, and metadata. The TensorFlow Datasets library provides conversion tools. The main challenge is mapping your robot's action space to the RLDS schema and ensuring temporal alignment between observation and action streams.",
    },
  ],
  ctaHeading: "Need Data Beyond OXE?",
  ctaDescription: "Claru provides custom cross-embodiment datasets with greater environment diversity and quality control than open academic datasets.",
  relatedGlossaryTerms: ["cross-embodiment-data", "rlds", "vla", "manipulation-trajectory", "foundation-model-robotics"],
  relatedGuidePages: ["how-to-convert-data-to-rlds-format", "how-to-build-a-cross-embodiment-dataset"],
  relatedSolutionSlugs: ["cross-embodiment-data"],
  longDefinition: `Open X-Embodiment (OXE) is a collaborative robot learning dataset released in October 2023 through a partnership between Google DeepMind and 20 academic institutions. The dataset aggregates over 1 million robot trajectories spanning 22 different robot embodiments, 527 skills, and 160,266 tasks. OXE was created to test the hypothesis that robot learning benefits from cross-embodiment data — training on demonstrations from many different robots produces policies that generalize better than training on data from a single robot.

The key finding of the OXE paper was that RT-2-X (a VLA model trained on the full OXE dataset plus Google's internal data) showed 50% improvement in emergent skill generalization compared to RT-2 trained only on Google robot data. This demonstrated that exposure to diverse embodiments teaches the model transferable manipulation primitives that apply across robot platforms, even when the kinematics and action spaces differ significantly.

OXE is stored in the RLDS (Robot Learning Dataset Specification) format, built on TensorFlow Datasets. Each trajectory is stored as a sequence of (observation, action, reward, metadata) tuples. Observations typically include RGB images from one or more cameras, and some datasets include depth, proprioceptive state, and language instructions. Actions are stored in the native action space of each robot, with a metadata field documenting the action representation (delta joint positions, delta end-effector poses, absolute positions, etc.).

The dataset is publicly available and has become the de facto pretraining corpus for open-source robot foundation models. Octo (UC Berkeley, 2024) was trained on 800,000 OXE trajectories and demonstrated strong zero-shot transfer across manipulation tasks. OpenVLA (Stanford, 2024) used OXE as part of its training mix alongside internet-scale vision-language data. Any team building a robot foundation model today starts with OXE as the base training dataset.`,

  historicalContext: `OXE emerged from the scaling hypothesis in robot learning: that, like language models, robot policies would benefit from training on more diverse data even if that data comes from different sources with different characteristics. This hypothesis was controversial because robot data has an embodiment problem — actions from one robot cannot be directly applied to another with different kinematics.

The intellectual precursors include RoboNet (Dasari et al., 2019), which aggregated data from 7 robot platforms but at a smaller scale, and the Bridge Data project (UC Berkeley, 2022), which demonstrated that training on multi-task, multi-environment data from a single robot improved generalization. The OXE project dramatically scaled these ideas by bringing 21 institutions together.

The organizational achievement was as significant as the technical one. Convincing 21 research groups to standardize on a common data format, contribute their proprietary datasets, and coordinate a joint release required extensive coordination. The RLDS format served as the technical standard that made aggregation possible. Google DeepMind provided the infrastructure for hosting, processing, and distributing the combined dataset.

Since its release, OXE has become the foundation of the open-source robot learning ecosystem. New datasets contributed to the RLDS format can be seamlessly combined with OXE for training. This has created a data network effect: the more institutions contribute, the more valuable the combined dataset becomes, which encourages more contributions. As of 2026, the OXE ecosystem includes significantly more data than the original 2023 release.`,

  practicalImplications: `Using OXE effectively requires understanding its strengths, limitations, and the practical engineering needed to train on heterogeneous cross-embodiment data.

The primary engineering challenge is action space heterogeneity. Different robots in OXE use different action representations: some record absolute joint positions, others record delta joint positions, others record end-effector poses. A training pipeline must normalize these into a common representation. The standard approach is to convert all actions to delta end-effector poses (x, y, z, roll, pitch, yaw, gripper) — a 7-dimensional action space that transfers across most manipulation platforms. This normalization discards embodiment-specific information but enables cross-embodiment training.

Data quality varies significantly across OXE contributions. Some datasets have high-resolution images, precise action labels, and rich language annotations. Others have low-resolution images, noisy actions, and no language metadata. Effective use of OXE requires quality-aware training: either filtering low-quality datasets out entirely or using weighted sampling that prioritizes high-quality data while still benefiting from the diversity of lower-quality contributions.

For practical deployment, teams should treat OXE as a pretraining resource, not a complete training set. Pretrain on OXE to learn generalizable manipulation representations, then fine-tune on 1,000-5,000 high-quality demonstrations collected on the specific deployment robot in the target environment. This two-stage approach consistently outperforms either training on OXE alone (which lacks domain specificity) or training on deployment data alone (which lacks the generalizable representations learned from diverse cross-embodiment data).

The main gap in OXE for production use is environment diversity. Most OXE data comes from university labs with clean backgrounds, controlled lighting, and limited object variety. Real-world deployment environments (homes, warehouses, factories) have cluttered backgrounds, variable lighting, and diverse objects. Supplementing OXE with real-world data from diverse environments is essential for production deployment.`,

  commonMisconceptions: [
    {
      misconception: "OXE contains enough data to train a production-ready robot foundation model without additional data.",
      correction: "OXE provides a strong pretraining foundation but has significant gaps for production use. The environment diversity is limited to mostly lab settings. The embodiment coverage skews heavily toward 6-7 DOF arms. Language annotations are sparse. Production models need OXE supplemented with domain-specific data from the target deployment environment, collected with the target robot platform and annotated with the task descriptions the model will follow in production.",
    },
    {
      misconception: "Training on all of OXE is always better than training on a curated subset.",
      correction: "Noise in low-quality OXE datasets can degrade model performance. Research from Octo and OpenVLA shows that training on a carefully curated subset of OXE (filtering by image quality, action label consistency, and task relevance) produces better policies than training on the full dataset. Quality-weighted sampling — giving more weight to high-quality datasets during training — is the practical middle ground.",
    },
    {
      misconception: "OXE's cross-embodiment benefit means you don't need data from your specific robot.",
      correction: "Cross-embodiment pretraining improves the starting point for fine-tuning, but it does not eliminate the need for deployment-embodiment data. A model pretrained on OXE still requires 1,000-5,000 demonstrations on the target robot to achieve production-level performance. The cross-embodiment benefit is that it reduces the fine-tuning data requirement compared to training from scratch — not that it eliminates it.",
    },
  ],
  keyPapers: [
    {
      id: "oxe-collaboration-2023",
      title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Open X-Embodiment Collaboration",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864",
    },
    {
      id: "octo-2024",
      title: "Octo: An Open-Source Generalist Robot Policy",
      authors: "Team et al.",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2405.12213",
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
  claruRelevance: `Claru fills the gaps in OXE that production robot teams face. Where OXE provides lab-environment data from limited robot platforms, Claru delivers diverse real-world data collected across 12+ environment types and 100+ cities. Where OXE has sparse language annotations, Claru's data includes rich natural language task descriptions and narrations.

For teams using OXE as a pretraining base, Claru provides the fine-tuning layer: high-quality teleoperation data on the target robot platform, in environments that match the deployment setting, with the annotation layers the model requires. This OXE-pretrain + Claru-finetune pipeline is the practical path to production-ready robot policies.`,
};

export default data;
