import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "diffusion-policy",
  termSlug: "diffusion-policy",
  category: "robotics-fundamentals",
  metaTitle: "Diffusion Policy in Robotics — Definition & Training Data | Claru",
  metaDescription: "Diffusion Policy frames robot action prediction as a denoising diffusion process. Learn how it works, why it handles multimodal actions, and what data it needs.",
  primaryKeyword: "diffusion policy",
  secondaryKeywords: ["diffusion policy robotics","denoising diffusion robot","diffusion policy training data","action diffusion model","Chi et al diffusion policy"],
  canonicalPath: "/glossary/diffusion-policy",
  h1: "Diffusion Policy: How Denoising Diffusion Models Control Robots",
  heroSubtitle: "Diffusion Policy generates robot action sequences by iteratively denoising random noise, conditioned on visual observations. This architecture naturally represents multimodal action distributions that regression-based policies cannot capture.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Diffusion Policy", href: "/glossary/diffusion-policy" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Diffusion Policy?",
      paragraphs: [
        "Diffusion Policy is a robot learning method introduced by Cheng Chi, Siyuan Feng, Yilun Du, Zhenjia Xu, Eric Jang, and Shuran Song at Columbia University and MIT (arXiv 2303.04137, RSS 2023). It frames action prediction as a conditional denoising diffusion process: instead of directly regressing from an observation to a single action, the policy generates action sequences by starting from pure Gaussian noise and iteratively removing noise over multiple denoising steps, conditioned on the current visual observation.",
        "The key advantage is multimodal action representation. In many manipulation tasks, multiple different actions are equally correct responses to the same observation. When a robot faces a table with two cups to pick up, both reaching left and reaching right are valid. Standard behavioral cloning with mean squared error loss averages these modes, producing an action that reaches toward neither cup — an invalid compromise. Diffusion Policy naturally represents both modes as peaks in the learned distribution, sampling from one or the other during inference.",
        "Architecturally, Diffusion Policy uses a conditional U-Net or Transformer that takes the current observation encoding and a noisy action sequence as input, and predicts the noise to remove at each denoising step. The observation is typically encoded by a pretrained vision encoder (ResNet, ViT, R3M, or DINOv2). The action sequence spans a horizon of 8 to 32 future timesteps, enabling the policy to plan coherent multi-step behaviors rather than predicting one action at a time. This temporal chunking is critical for producing smooth, stable robot motions.",
      ],
    },
    {
      type: "stats",
      heading: "Diffusion Policy at a Glance",
      stats: [
        { value: "RSS 2023", label: "Published (Chi et al.)" },
        { value: "11/11", label: "Simulated tasks with SOTA results" },
        { value: "8-32", label: "Action chunk horizon (steps)" },
        { value: "5-10 Hz", label: "Control rate (DDIM, 10-16 steps)" },
        { value: "100-500", label: "Demos for single-task learning" },
        { value: "30-50%", label: "Success rate gain over MSE BC" },
      ],
    },
    {
      type: "prose",
      heading: "How the Denoising Process Works",
      paragraphs: [
        "Training follows the standard diffusion training objective established by Ho et al. (2020) in DDPM. Given a clean action sequence from a demonstration, random Gaussian noise is added at a random noise level (sampled uniformly from the diffusion schedule). The neural network is trained to predict the added noise given the noisy action sequence and the observation conditioning. Over many training steps, the network learns to denoise action sequences at all noise levels, effectively learning the mapping from random noise to valid, task-appropriate actions.",
        "At inference time, the policy starts with pure Gaussian noise and runs 10 to 100 denoising steps (configurable via DDPM or DDIM schedulers) to generate a clean action sequence. Each step slightly denoises the action, gradually transforming random noise into a coherent multi-step plan. The first few actions of the predicted sequence are executed on the robot, then the process repeats with a fresh observation — a receding-horizon control approach that adapts to changing conditions while maintaining temporal consistency.",
        "The number of denoising steps directly controls the speed-quality tradeoff. Standard DDPM with 100 steps produces the highest-quality actions but runs at only 1-2 Hz on a GPU — too slow for reactive manipulation. DDIM (Denoising Diffusion Implicit Models) with 10-16 steps achieves 5-10 Hz, adequate for most tabletop manipulation. Consistency distillation and flow matching variants further reduce inference to 20-50 Hz, enabling deployment in latency-sensitive applications. Physical Intelligence's pi-zero uses flow matching — a related generative approach — to achieve production-grade inference speed.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Diffusion Policy vs. Other Robot Policy Architectures",
      description: "How Diffusion Policy compares to alternative approaches for learning manipulation from demonstrations.",
      columns: ["Dimension", "Diffusion Policy", "MLP BC", "ACT (CVAE)", "VLA (OpenVLA/RT-2)"],
      rows: [
        { Dimension: "Action Representation", "Diffusion Policy": "Multimodal (diffusion)", "MLP BC": "Unimodal (MSE)", "ACT (CVAE)": "Multimodal (latent variable)", "VLA (OpenVLA/RT-2)": "Discrete tokens" },
        { Dimension: "Temporal Structure", "Diffusion Policy": "Action chunks (8-32 steps)", "MLP BC": "Single-step", "ACT (CVAE)": "Action chunks (100 steps)", "VLA (OpenVLA/RT-2)": "Single-step (autoregressive)" },
        { Dimension: "Inference Speed", "Diffusion Policy": "5-10 Hz (DDIM)", "MLP BC": "100+ Hz", "ACT (CVAE)": "50+ Hz", "VLA (OpenVLA/RT-2)": "3-5 Hz" },
        { Dimension: "Language Conditioning", "Diffusion Policy": "Optional (extensions)", "MLP BC": "Optional", "ACT (CVAE)": "No (standard)", "VLA (OpenVLA/RT-2)": "Native (LLM backbone)" },
        { Dimension: "Data Efficiency", "Diffusion Policy": "100-500 demos", "MLP BC": "200-1000 demos", "ACT (CVAE)": "50-200 demos", "VLA (OpenVLA/RT-2)": "100-1000 demos" },
      ],
    },
    {
      type: "prose",
      heading: "Extensions: 3D, Language, and Production Scale",
      paragraphs: [
        "Since its introduction, Diffusion Policy has been extended in several important directions. 3D Diffusion Policy (DP3, Ze et al., RSS 2024) replaces the 2D image encoder with a sparse 3D point cloud encoder, achieving 20-35 percent improvement over 2D Diffusion Policy on tasks requiring spatial precision like stacking and insertion. The point cloud observations encode metric distances and surface geometry that 2D images represent only implicitly.",
        "Language-conditioned variants concatenate language embeddings with visual features as conditioning for the denoising process. SuSIE (Black et al., 2024) demonstrates language-conditioned diffusion for instruction-following manipulation, and Physical Intelligence's pi-zero combines a VLA backbone with a flow-matching action head — a close relative of diffusion that produces continuous actions through a similar iterative refinement process. The pi-zero architecture validates diffusion-family approaches at industrial production scale.",
        "The Robotics Diffusion Transformer (RDT, Liu et al., 2024) scales Diffusion Policy to larger model sizes and multi-embodiment training. By replacing the U-Net backbone with a Diffusion Transformer architecture and training on diverse robot demonstrations, RDT demonstrated that diffusion-based policies benefit from the same scaling laws that drive large language models — more parameters and more data produce better generalization.",
      ],
    },
    {
      type: "prose",
      heading: "Data Requirements for Diffusion Policy",
      paragraphs: [
        "Diffusion Policy requires demonstration data in the standard (observation, action) format, but the data requirements differ from behavioral cloning in an important way. Because Diffusion Policy can represent multimodal distributions, it benefits from demonstrations that include diverse strategies for the same task. If operators sometimes pick objects with a pinch grasp and sometimes with a power grasp, Diffusion Policy can learn both strategies and sample appropriately at inference time, whereas behavioral cloning averages the two grasps into an invalid intermediate.",
        "Chi et al. reported strong results with 100 to 200 demonstrations for single-task policies and 95 percent success on the PushT benchmark with just 200 demonstrations. For cross-task generalization, larger datasets of 10,000+ demonstrations spanning the task family are needed. Data collection for Diffusion Policy should emphasize trajectory diversity over count — 20 demonstrations each following a different strategy teach more than 100 demonstrations that repeat the same motion.",
        "Claru's data collection methodology naturally produces the trajectory diversity that Diffusion Policy leverages. By using multiple collectors in different environments, each performing tasks in their own natural style, the resulting dataset captures authentic multimodal behavior distributions. Each collector's approach to grasping, reaching, and manipulating objects differs subtly — exactly the kind of strategic variation that gives Diffusion Policy its advantage over unimodal alternatives.",
      ],
    },
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "chi-diffusion-policy-2023",
          title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
          authors: "Chi et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2303.04137",
        },
        {
          id: "janner-diffuser-2022",
          title: "Planning with Diffusion for Flexible Behavior Synthesis",
          authors: "Janner et al.",
          venue: "ICML 2022",
          year: 2022,
          url: "https://arxiv.org/abs/2205.09991",
        },
        {
          id: "ze-3d-diffusion-2024",
          title: "3D Diffusion Policy: Generalizable Visuomotor Policy Learning via Simple 3D Representations",
          authors: "Ze et al.",
          venue: "RSS 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2403.03954",
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
    },
  ],
  faqs: [
    {
        "question": "How many demonstrations does Diffusion Policy need to learn a manipulation task?",
        "answer": "For single-task learning, Diffusion Policy achieves strong results with 100-200 demonstrations on simple tasks and 500-2,000 for complex multi-step tasks. Chi et al. reported 95% success on PushT with just 200 demonstrations. For cross-task generalization, larger datasets of 10,000+ demonstrations are typical. The key factor is trajectory diversity rather than raw count."
    },
    {
        "question": "What is the inference speed of Diffusion Policy on a robot?",
        "answer": "Inference speed depends on the number of denoising steps and model size. Standard DDPM with 100 steps runs at 1-2 Hz. DDIM with 10-16 steps achieves 5-10 Hz on a modern GPU. Consistency distillation and flow matching variants push inference to 20+ Hz. Most manipulation tasks require 5-20 Hz control, making DDIM-based Diffusion Policy practical for production deployment."
    },
    {
        "question": "What makes Diffusion Policy better than behavioral cloning?",
        "answer": "Diffusion Policy handles multimodal action distributions — situations where multiple actions are correct for the same observation. Behavioral cloning averages these modes, producing suboptimal actions. Diffusion Policy also generates temporally coherent action chunks rather than single-step predictions, reducing jerky behavior. On standard benchmarks, Diffusion Policy achieves 30-50% higher success rates than behavioral cloning with identical training data."
    },
    {
        "question": "Can Diffusion Policy be combined with language instructions?",
        "answer": "Yes. Language-conditioned Diffusion Policy variants concatenate language embeddings with visual features as conditioning for the denoising process. SuSIE (Black et al., 2024) and pi-zero both demonstrate language-conditioned diffusion for instruction-following manipulation. The language conditioning allows a single policy to execute different tasks based on natural language commands."
    },
    {
        "question": "How does Diffusion Policy handle 3D observations like point clouds?",
        "answer": "3D Diffusion Policy (DP3), introduced by Ze et al. (2024), extends the Diffusion Policy framework to 3D observation spaces by replacing the 2D image encoder with a sparse 3D point cloud encoder. The point cloud is generated from one or more depth cameras and processed by a compact 3D encoder (typically a PointNet variant or sparse 3D convolutional network) that produces a spatial feature representation. This 3D feature conditions the denoising process identically to how 2D image features condition the original Diffusion Policy. DP3 demonstrated 20-35% improvement over 2D Diffusion Policy on tasks requiring spatial precision — stacking, insertion, and multi-object rearrangement — because point cloud observations encode metric distances and surface geometry that 2D images represent only implicitly. The tradeoff is that 3D observations require depth sensors and point cloud preprocessing, adding hardware and computational overhead to the data pipeline."
    }
],
  ctaHeading: "Building with Diffusion Policy?",
  ctaDescription: "Claru provides purpose-built datasets for physical AI and robotics. Tell us what your model needs to learn.",
  relatedGlossaryTerms: ["behavioral-cloning","imitation-learning","action-chunking","visuomotor-policy","diffusion-transformer"],
  relatedGuidePages: ["how-to-train-a-diffusion-policy","how-to-collect-teleoperation-data"],
  relatedSolutionSlugs: ["manipulation-trajectory-data","teleoperation-data"],
  longDefinition: "Diffusion Policy is a robot learning method introduced by Chi et al. (2023) that frames action prediction as a conditional denoising diffusion process. Instead of directly regressing from an observation to a single action, the policy generates action sequences by starting from pure Gaussian noise and iteratively removing noise over multiple denoising steps, conditioned on the current visual observation. This process produces a distribution over possible actions rather than a single point estimate.\n\nThe key advantage of Diffusion Policy is its ability to represent multimodal action distributions. In many manipulation tasks, multiple different actions are equally correct responses to the same observation. When a robot faces a table with two cups to pick up, both reaching left and reaching right are valid actions. Standard behavioral cloning with mean squared error loss averages these modes, producing an action that goes to neither cup. Diffusion Policy naturally represents both modes as peaks in the learned distribution, sampling from one or the other during inference.\n\nArchitecturally, Diffusion Policy uses a conditional U-Net or Transformer that takes the current observation encoding and a noisy action sequence as input, and predicts the noise to remove at each denoising step. The observation is typically encoded by a pretrained vision encoder (ResNet, ViT, or R3M). The action sequence spans a horizon of 8 to 32 future timesteps, enabling the policy to plan coherent multi-step behaviors rather than predicting one action at a time.\n\nTraining follows the standard diffusion training objective: given a clean action sequence from a demonstration, add random noise at a random noise level, and train the network to predict the added noise. At inference time, the policy runs 10 to 100 denoising steps (configurable via DDPM or DDIM schedulers) to generate a clean action sequence from random noise. The first few actions of the predicted sequence are executed, then the process repeats with a new observation — a receding-horizon control approach.",
  historicalContext: "Diffusion models were originally developed for image generation, with landmark papers including DDPM (Ho et al., 2020) and score-based models (Song & Ermon, 2019). The application to robot control emerged from the observation that robot action spaces share key properties with image pixel spaces: both are continuous, high-dimensional, and often multimodal.\n\nJanner et al. (2022) first applied diffusion models to trajectory planning in the Diffuser paper, showing that diffusion could generate coherent long-horizon plans in navigation tasks. Chi et al. (2023) then introduced Diffusion Policy for real-time visuomotor control, demonstrating state-of-the-art results on 11 manipulation tasks. Their key insight was that the receding-horizon formulation — generating an action chunk then executing only the first portion — produces smoother, more temporally consistent behavior than single-step prediction.\n\nSince its introduction, Diffusion Policy has become one of the dominant approaches for learning manipulation policies from demonstrations. It has been extended to 3D observation spaces (3D Diffusion Policy, Ze et al. 2024), bimanual manipulation (RDT, Liu et al. 2024), and combined with language conditioning for instruction-following (SuSIE, Black et al. 2024). Physical Intelligence adopted a related diffusion-based architecture for their pi-zero model, validating the approach at industrial scale.",
  practicalImplications: "Training a Diffusion Policy requires demonstration data in the standard (observation, action) format, but the data requirements differ from behavioral cloning in important ways. Because Diffusion Policy can represent multimodal distributions, it benefits from demonstrations that include diverse strategies for the same task. If operators sometimes pick objects with a pinch grasp and sometimes with a power grasp, Diffusion Policy can learn both strategies, whereas behavioral cloning would produce a confused average.\n\nThe number of demonstrations needed depends on task complexity. Chi et al. reported strong results with 100 to 200 demonstrations for single-task policies on tasks like pushing a T-shaped block. More complex tasks like multi-step assembly may require 500 to 2,000 demonstrations. Cross-task generalization requires larger datasets — typically 10,000+ demonstrations spanning the task family.\n\nInference speed is the primary practical constraint. A standard Diffusion Policy with 100 DDPM denoising steps runs at approximately 1-2 Hz on a GPU, too slow for reactive control. DDIM sampling with 10-16 steps achieves 5-10 Hz, adequate for most manipulation tasks. Consistency distillation and flow matching variants further reduce inference to near real-time speeds. Teams deploying Diffusion Policy in production must benchmark inference latency against their control frequency requirements.\n\nData collection for Diffusion Policy should emphasize trajectory diversity over trajectory count. Twenty demonstrations that each follow a different grasp strategy teach more than 100 demonstrations that repeat the same motion. Operators should be encouraged to vary their approach naturally rather than executing a scripted motion. The observation horizon (how many past frames the policy sees) and action horizon (how far ahead the policy predicts) are critical hyperparameters that must be tuned per task, typically through a grid search over observation horizons of 2-8 frames and action horizons of 8-32 steps.",
  commonMisconceptions: [
    {
        "misconception": "Diffusion Policy is too slow for real-time robot control.",
        "correction": "While the original DDPM formulation with 100 steps is slow (~1 Hz), DDIM sampling with 10-16 steps achieves 5-10 Hz, and consistency distillation variants reach 20+ Hz. Most manipulation tasks operate at 5-20 Hz control frequency, well within Diffusion Policy capabilities."
    },
    {
        "misconception": "Diffusion Policy requires orders of magnitude more data than behavioral cloning.",
        "correction": "Diffusion Policy often matches or outperforms behavioral cloning with the same amount of data. On the PushT benchmark, Diffusion Policy achieves 95% success with 200 demonstrations where BC achieves 60%. The multimodal distribution representation means the model uses each demonstration more effectively, not that it needs more demonstrations."
    },
    {
        "misconception": "Diffusion Policy only works for manipulation tasks.",
        "correction": "While most published results focus on manipulation, Diffusion Policy has been applied to navigation (Diffuser), locomotion (Janner et al.), and even autonomous driving trajectory prediction. The architecture is task-agnostic — it generates action sequences conditioned on any observation type."
    }
],
  keyPapers: [
    {
        "id": "chi-diffusion-policy-2023",
        "title": "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
        "authors": "Chi et al.",
        "venue": "RSS 2023",
        "year": 2023,
        "url": "https://arxiv.org/abs/2303.04137"
    },
    {
        "id": "janner-diffuser-2022",
        "title": "Planning with Diffusion for Flexible Behavior Synthesis",
        "authors": "Janner et al.",
        "venue": "ICML 2022",
        "year": 2022,
        "url": "https://arxiv.org/abs/2205.09991"
    },
    {
        "id": "ze-3d-diffusion-2024",
        "title": "3D Diffusion Policy: Generalizable Visuomotor Policy Learning via Simple 3D Representations",
        "authors": "Ze et al.",
        "venue": "RSS 2024",
        "year": 2024,
        "url": "https://arxiv.org/abs/2403.03954"
    },
    {
        "id": "black-pi0-2024",
        "title": "pi-zero: A Vision-Language-Action Flow Model for General Robot Control",
        "authors": "Black et al.",
        "venue": "arXiv 2410.24164",
        "year": 2024,
        "url": "https://arxiv.org/abs/2410.24164"
    }
],
  claruRelevance: "Claru provides the diverse, high-quality demonstration data that Diffusion Policy architectures require. Our teleoperation datasets capture multiple operator strategies for the same tasks — exactly the multimodal training signal that gives Diffusion Policy its advantage over regression-based approaches. With 386,000+ annotated clips spanning manipulation, navigation, and interaction tasks, Claru datasets provide the trajectory diversity and environmental variation needed to train robust diffusion-based robot policies.",
};

export default data;
