import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "vla",
  termSlug: "vla",
  category: "physical-ai-systems",
  metaTitle: "VLA Model (Vision-Language-Action) — Definition & Training Data | Claru",
  metaDescription: "A VLA model unifies vision, language, and action in a single neural network for robot control. Learn how VLA models work, their data requirements, and key research papers.",
  primaryKeyword: "VLA model",
  secondaryKeywords: ["vision-language-action model", "VLA training data", "VLA robot", "OpenVLA", "RT-2 model", "robot foundation model"],
  canonicalPath: "/glossary/vla",
  h1: "VLA Model (Vision-Language-Action): Definition, Architecture, and Training Data",
  heroSubtitle: "Vision-Language-Action models represent the frontier of robot learning — a single neural network that sees, understands language, and controls a robot body. This page covers what VLA models are, how they evolved, what data they require, and where the field is heading.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "VLA Model", href: "/glossary/vla" },
  ],
  sections: [],
  faqs: [
    {
      question: "How much training data does a VLA model need?",
      answer: "Current VLA models require between 50,000 and 1,000,000 demonstration trajectories depending on task complexity and model architecture. Google's RT-2 was trained on data from 13 robots over 17 months. The Octo model used 800,000 trajectories from Open X-Embodiment. Smaller task-specific VLAs like OpenVLA can fine-tune on 10,000-50,000 demonstrations for a single robot platform, but generalist models need significantly more data across diverse embodiments and environments.",
    },
    {
      question: "What is the difference between a VLA model and a visuomotor policy?",
      answer: "A visuomotor policy maps visual observations directly to motor actions but does not process language instructions. A VLA model adds language conditioning, enabling instruction-following behavior where the same model can execute different tasks based on natural language commands. VLA models typically use pretrained vision-language backbones (like PaLI or SigLIP) whereas visuomotor policies often train vision encoders from scratch on robot data.",
    },
    {
      question: "Can VLA models generalize to new objects and environments?",
      answer: "VLA models show limited but improving generalization capabilities. RT-2 demonstrated generalization to novel objects mentioned only in its language pretraining data. OpenVLA showed cross-task transfer across manipulation primitives. However, generalization to truly novel environments or significantly different robot morphologies remains a major challenge. The consensus in the field is that broader, more diverse training data is the primary lever for improving generalization.",
    },
    {
      question: "What robot hardware do VLA models work with?",
      answer: "VLA models are architecture-agnostic in principle but require training data from each target embodiment. Most published VLA research uses 6-7 DOF robotic arms (Franka Panda, UR5, Kuka iiwa) with parallel-jaw or dexterous grippers. NVIDIA's GR00T N1 targets humanoid robots. Google's RT-X models were trained across 22 different robot platforms. Deploying a VLA on new hardware typically requires collecting 10,000+ demonstrations on that specific robot.",
    },
    {
      question: "What data format do VLA models expect?",
      answer: "VLA models require synchronized triplets of observations (RGB images, sometimes depth), language instructions (natural language strings), and action labels (joint positions, end-effector poses, or motor commands at 10-50 Hz). Common storage formats include RLDS (TensorFlow Datasets for robotics), HDF5, and zarr. Each trajectory also needs metadata including robot URDF, camera intrinsics, and task success labels.",
    },
  ],
  ctaHeading: "Need VLA Training Data?",
  ctaDescription: "Claru provides purpose-built datasets for VLA model training — synchronized video-action trajectories collected through teleoperation across diverse environments and embodiments.",
  relatedGlossaryTerms: ["embodied-ai", "visuomotor-policy", "behavioral-cloning", "open-x-embodiment", "diffusion-policy"],
  relatedGuidePages: ["how-to-create-action-labels-for-vla", "how-to-collect-teleoperation-data"],
  relatedSolutionSlugs: ["vla-training-data", "teleoperation-data"],

  longDefinition: `A Vision-Language-Action (VLA) model is a neural network architecture that processes visual observations and natural language instructions as inputs and produces robot control actions as outputs. VLA models represent a unification of three previously separate capabilities: computer vision (understanding what the robot sees), natural language processing (understanding what the robot is told to do), and motor control (producing the physical actions to accomplish the task).

The core insight behind VLA models is that large-scale pretraining on internet-scale vision and language data provides a rich foundation of world knowledge that transfers to physical robot control. A VLA model pretrained on billions of image-text pairs already understands concepts like "red cup," "kitchen counter," and "pick up" — the robot learning stage then grounds these concepts in physical action spaces.

Architecturally, VLA models typically consist of three components: a vision encoder (often a Vision Transformer like SigLIP or DINOv2) that processes camera images into visual tokens, a language model backbone (often a pretrained LLM like PaLM or LLaMA) that processes both visual tokens and language instruction tokens, and an action head that maps the language model's hidden states to continuous robot action outputs. The action head must output at the control frequency of the robot — typically 10 to 50 Hz for manipulation tasks.

Training a VLA model proceeds in stages. The vision-language backbone is first pretrained on internet-scale data. It is then fine-tuned on robot demonstration data: trajectories of (image, instruction, action) triplets collected through teleoperation or kinesthetic teaching. The scale of robot data required is substantial — the RT-2 model used data from 13 robots collected over 17 months, while the Octo model leveraged 800,000 trajectories from the Open X-Embodiment dataset.`,

  historicalContext: `The concept of combining vision and action for robot control dates to the 1980s, but modern VLA models emerged from three converging threads. First, the success of large vision-language models (VLMs) like CLIP (2021), Flamingo (2022), and PaLI (2022) demonstrated that multimodal pretraining creates powerful visual representations. Second, the robotics community accumulated large-scale demonstration datasets through projects like RoboNet (2019), Bridge Data (2022), and Open X-Embodiment (2023). Third, the insight from instruction-tuned LLMs that language could serve as a universal task interface inspired researchers to condition robot policies on natural language.

Google's SayCan (2022) was an early precursor that used a language model to plan high-level steps and a separate low-level policy to execute them. RT-1 (2022) was a Transformer-based policy trained on 130,000 demonstrations from a single robot, showing strong multi-task performance. RT-2 (2023) was the breakthrough VLA — it fine-tuned a PaLI-X vision-language model to output tokenized robot actions, demonstrating that VLM pretraining transfers to robot control and enables generalization to novel objects and concepts.

Since RT-2, the field has accelerated rapidly. OpenVLA (2024) open-sourced a 7B parameter VLA trained on Open X-Embodiment data. NVIDIA's GR00T N1 (2025) targeted humanoid robot control. Physical Intelligence's pi-zero (2024) combined VLA architecture with flow matching for high-frequency bimanual manipulation. The trend is clear: VLA models are becoming the default architecture for instruction-following robot policies, and the bottleneck has shifted from model architecture to training data quality and scale.`,

  practicalImplications: `For teams building VLA-based robot systems, the practical data requirements are substantial and specific. Each training trajectory must include synchronized streams: RGB images from one or more cameras at 5-30 fps, natural language task instructions, and robot action labels (joint positions, end-effector 6-DOF poses, or motor torques) at the control frequency. A single demonstration for a tabletop manipulation task produces 500-2,000 timesteps of data.

Data quality matters more than raw quantity. Demonstrations must come from skilled operators — novice teleoperators produce suboptimal trajectories that degrade policy performance. The instruction set must be diverse: if all demonstrations of "pick up the cup" use the same phrasing, the model will not generalize to "grab the mug" or "take the red container." Environment diversity is equally critical: training only in one kitchen produces a policy that fails in a different kitchen with different lighting, backgrounds, and object arrangements.

The most practical path to a working VLA system today involves three phases. First, fine-tune an open-weight VLA (like OpenVLA) on 10,000-50,000 demonstrations collected on your specific robot in your target environment. Second, augment the dataset with language paraphrases, camera viewpoint variations, and object substitutions to improve robustness. Third, iterate through real-world deployment, identifying failure modes, and collecting targeted demonstrations to address them. This data flywheel — deploy, observe failures, collect data, retrain — is the operational core of VLA system development.

The total cost of a production VLA dataset depends on the scope of tasks and environments. Collecting 50,000 high-quality teleoperation demonstrations typically requires 2,000-4,000 operator hours at current data collection speeds of 12-25 demonstrations per operator hour. At typical contractor rates, this represents a dataset cost of $100,000 to $400,000 — a significant investment that motivates careful planning of the data collection protocol.`,

  commonMisconceptions: [
    {
      misconception: "VLA models can learn any task from a few demonstrations, similar to few-shot learning in language models.",
      correction: "While VLA models leverage vision-language pretraining for faster learning, they still require thousands to tens of thousands of demonstrations per task family. Few-shot robot learning remains an active research problem. In practice, deploying a VLA on a new task requires at minimum 1,000 demonstrations for simple single-object manipulation and 10,000+ for complex multi-step tasks.",
    },
    {
      misconception: "Larger language model backbones always produce better VLA models.",
      correction: "Model size helps but has diminishing returns for robot control. The RT-2-X comparison showed that a 55B parameter VLA only marginally outperformed a 5B parameter version on most manipulation benchmarks. Inference latency is a real constraint — a 70B parameter model cannot run at 10 Hz on edge hardware, making it impractical for real-time robot control. The current sweet spot is 1-7B parameters with efficient architectures.",
    },
    {
      misconception: "Simulation data can replace real-world demonstrations for VLA training.",
      correction: "Simulation data helps with pretraining but cannot fully replace real-world data due to the sim-to-real gap. Contact physics, deformable objects, lighting variation, and sensor noise in simulation do not match reality closely enough. The most successful VLA models (RT-2, Octo, OpenVLA) were all trained primarily on real-world demonstrations. Simulation can augment real data — typically constituting 20-40% of the training mix — but the real-world component remains essential.",
    },
  ],

  keyPapers: [
    {
      id: "brohan-rt2-2023",
      title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2307.15818",
    },
    {
      id: "kim-openvla-2024",
      title: "OpenVLA: An Open-Source Vision-Language-Action Model",
      authors: "Kim et al.",
      venue: "CoRL 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2406.09246",
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
      id: "brohan-rt1-2022",
      title: "RT-1: Robotics Transformer for Real-World Control at Scale",
      authors: "Brohan et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2212.06817",
    },
    {
      id: "black-pi0-2024",
      title: "pi-zero: A Vision-Language-Action Flow Model for General Robot Control",
      authors: "Black et al.",
      venue: "arXiv 2410.24164",
      year: 2024,
      url: "https://arxiv.org/abs/2410.24164",
    },
  ],

  claruRelevance: `Claru provides the core training data that VLA models require: synchronized video-action trajectories collected through professional teleoperation in diverse real-world environments. Our dataset of 386,000+ annotated egocentric clips spans 12+ environment types and includes the camera streams, action labels, and natural language annotations that VLA architectures expect.

For teams fine-tuning VLA models on custom hardware, Claru offers purpose-built data collection: skilled teleoperators collecting demonstrations on your specific robot platform, in your target environments, with the task instruction diversity needed for robust language conditioning. Our data passes through a quality pipeline that validates action-observation synchronization, filters failed demonstrations, and ensures trajectory completeness — the exact quality standards that determine whether a VLA model trains successfully or fails to converge.`,
};

export default data;
