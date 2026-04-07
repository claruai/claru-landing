import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "multimodal-foundation-model",
  termSlug: "multimodal-foundation-model",
  category: "models-architectures",
  metaTitle: "Multimodal Foundation Model — Definition & Training Data | Claru",
  metaDescription: "Multimodal foundation models process text, images, video, and actions in a single architecture. Learn about VLMs, VLAs, training data requirements, and applications in robotics.",
  primaryKeyword: "multimodal foundation model",
  secondaryKeywords: ["multimodal AI", "vision-language model", "VLM foundation", "vision-language-action model", "multimodal pretraining"],
  canonicalPath: "/glossary/multimodal-foundation-model",
  h1: "Multimodal Foundation Model: Unified Architectures for Vision, Language, and Action",
  heroSubtitle: "A multimodal foundation model is a large neural network pretrained on data spanning multiple modalities — text, images, video, audio, and in some cases robotic actions — that can be adapted to diverse downstream tasks. For physical AI, these models are the bridge between internet-scale knowledge and embodied robot behavior.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Multimodal Foundation Model", href: "/glossary/multimodal-foundation-model" },
  ],
  sections: [],
  faqs: [
    {
      question: "What makes a model 'multimodal' versus a standard language model?",
      answer: "A standard language model (GPT, LLaMA) processes only text tokens. A multimodal model processes inputs from two or more modalities — typically vision and language, but sometimes also audio, depth, proprioception, or robot actions. The key architectural challenge is aligning representations across modalities so the model can reason jointly about an image and a text description, or a video and an instruction. Modern approaches use modality-specific encoders (a Vision Transformer for images, a text tokenizer for language) that feed into a shared transformer backbone. The alignment is learned during pretraining on paired data — image-caption pairs for vision-language models, video-text pairs for video understanding, and observation-action pairs for robot foundation models. CLIP (Radford et al., 2021) demonstrated that contrastive pretraining on 400 million image-text pairs produces aligned visual and textual representations. GPT-4V, Gemini, and Claude extended this to general-purpose multimodal reasoning. RT-2 and OpenVLA extended it further to robotic action prediction."
    },
    {
      question: "How are multimodal foundation models used in robotics?",
      answer: "In robotics, multimodal foundation models serve three primary roles. First, as perception backbones: a vision-language model like SigLIP or CLIP provides visual features pretrained on internet-scale data, which are far richer than features from ImageNet-pretrained models. Robot learning systems use these features as input representations, gaining generalization to novel objects and scenes the robot has never encountered. Second, as instruction interpreters: given a natural language command ('pick up the red cup and place it on the shelf'), a VLM grounds the instruction in the visual scene, identifying which object is the red cup and where the shelf is. Third, as end-to-end policy models: Vision-Language-Action (VLA) models like RT-2, OpenVLA, and pi-zero take image observations and language instructions as input and directly output robot actions. These models are pretrained on internet data for visual and linguistic understanding, then fine-tuned on robot demonstration datasets to map perception to motor commands."
    },
    {
      question: "What training data do multimodal foundation models need?",
      answer: "Training occurs in multiple stages with different data requirements. Pretraining requires massive paired multimodal datasets: CLIP was trained on 400 million image-text pairs from the internet; LLaVA used 1.5 million image-conversation pairs; Gemini was trained on a mixture of text, images, video, and code at undisclosed scale. For robotics adaptation, fine-tuning datasets are smaller but more specific. RT-2 fine-tuned PaLM-E on 130,000 robot demonstrations from RT-1. OpenVLA fine-tuned Llama 2 on 970,000 robot episodes from Open X-Embodiment. The critical data challenge for robotics is that robot demonstration data is orders of magnitude scarcer than internet data — there are trillions of image-text pairs online but only millions of robot episodes total across all labs worldwide. This scarcity makes the quality, diversity, and task coverage of robot fine-tuning data the primary bottleneck for VLA model performance."
    },
    {
      question: "What is the difference between a VLM and a VLA model?",
      answer: "A Vision-Language Model (VLM) takes images and text as input and produces text as output. It can describe scenes, answer visual questions, and follow visual instructions, but it cannot directly control a robot. Examples include GPT-4V, Gemini, LLaVA, and InternVL. A Vision-Language-Action (VLA) model extends the VLM architecture with an action output head that predicts robot motor commands — joint positions, end-effector velocities, or gripper states. The action tokens are typically appended to the model's vocabulary, so the same transformer that generates language tokens can also generate action tokens. RT-2 demonstrated this by tokenizing robot actions as text strings and fine-tuning PaLM-E to generate them. OpenVLA adopted a similar approach with Llama 2. The practical distinction is that VLMs are perception and reasoning modules that require a separate planning and control stack, while VLAs are end-to-end policies that map directly from observation to action."
    },
    {
      question: "How does Claru's data support training multimodal foundation models for robotics?",
      answer: "Claru provides the real-world visual and activity data that multimodal foundation models need for robotics adaptation. Our catalog of 386,000+ annotated video clips captures human activities, object interactions, and indoor/outdoor environments from egocentric and third-person viewpoints — the visual diversity that bridges internet pretraining to robot deployment settings. Each clip includes multi-modal annotations: natural language activity descriptions for vision-language alignment, object identity labels for grounding, spatial annotations (bounding boxes, segmentation masks) for precise localization, and temporal segmentation for action boundary detection. For teams fine-tuning VLA models, Claru provides observation-rich video data that augments sparse robot demonstration datasets with human activity data in the same environments where robots will operate. This approach, validated by research showing that human video pretraining improves robot policy generalization, reduces the robot-specific demonstration data needed by 3-5x."
    },
  ],
  ctaHeading: "Need Multimodal Training Data?",
  ctaDescription: "Claru provides purpose-built datasets for physical AI and robotics. Tell us what your model needs to learn.",
  relatedGlossaryTerms: ["vla", "foundation-model-robotics", "vision-transformer", "diffusion-transformer"],
  relatedGuidePages: [],
  relatedSolutionSlugs: ["vla-training-data"],
  longDefinition: "A multimodal foundation model is a large-scale neural network trained on data from multiple input modalities — such as text, images, video, audio, and structured data — that learns general-purpose representations transferable to a wide range of downstream tasks. The 'foundation' aspect refers to the model serving as a pretrained base that is adapted (fine-tuned, prompted, or used as a feature extractor) rather than trained from scratch for each application. The 'multimodal' aspect means the model can process and reason across different types of sensory input simultaneously.\n\nThe architectural core of modern multimodal foundation models is the transformer, which processes sequences of tokens regardless of their source modality. Each modality is converted into a sequence of tokens through a modality-specific encoder: images are patchified and projected by a Vision Transformer (ViT), text is tokenized by a language tokenizer (BPE or SentencePiece), audio is converted to spectrograms and patchified, and robot actions are discretized or projected into the token space. These token sequences are concatenated or interleaved and processed by a shared transformer decoder that learns cross-modal attention patterns.\n\nThe training paradigm follows a two-stage recipe. In the first stage, the model is pretrained on large-scale paired data from the internet — image-caption pairs, video-text pairs, interleaved image-text documents — using objectives like next-token prediction, contrastive alignment, or masked reconstruction. This stage gives the model broad visual understanding, language competence, and cross-modal reasoning. In the second stage, the model is fine-tuned on task-specific data with supervised learning or reinforcement learning from human feedback (RLHF). For robotics, this second stage uses robot demonstration data — observation-action pairs — to teach the model to map perceptual inputs to motor commands.\n\nFor physical AI, multimodal foundation models represent a paradigm shift from training task-specific models on narrow datasets to adapting general-purpose models to specific embodiments and tasks. The key insight is that visual understanding, spatial reasoning, language grounding, and physical intuition learned from internet-scale data transfer to robotic settings, dramatically reducing the amount of robot-specific data needed. RT-2 showed that a VLM fine-tuned on robot data acquires emergent capabilities — following instructions about novel objects, reasoning about spatial relationships, performing multi-step tasks — that were not present in the robot training data but were learned from internet pretraining.",
  historicalContext: "The concept of multimodal learning predates deep learning. Early work in the 2000s explored combining text and image features using kernel methods and topic models. However, the modern era began with the convergence of large-scale pretraining and transformer architectures.\n\nCLIP (Radford et al., 2021) was a watershed moment. By training a dual-encoder model on 400 million image-text pairs with a contrastive objective, OpenAI demonstrated that visual representations learned from natural language supervision transfer broadly across dozens of downstream tasks. CLIP's image encoder became the default visual backbone for a generation of multimodal models.\n\nThe vision-language model (VLM) era followed rapidly. Flamingo (Alayrac et al., 2022) showed that interleaving visual tokens with language model tokens enables few-shot visual reasoning. BLIP-2 (Li et al., 2023) introduced the Q-Former bridge module connecting frozen visual encoders to frozen language models. LLaVA (Liu et al., 2023) demonstrated that visual instruction tuning — fine-tuning on image-conversation pairs generated by GPT-4 — produces strong multimodal chatbots at modest cost. GPT-4V and Gemini brought multimodal reasoning to production scale.\n\nThe extension to robotic action began with PaLM-E (Driess et al., 2023), which embedded visual, textual, and robotic state tokens into a single 562-billion-parameter language model. RT-2 (Brohan et al., 2023) showed that a VLM fine-tuned on robot demonstrations can directly output action tokens, creating a vision-language-action (VLA) model. OpenVLA (Kim et al., 2024) replicated this approach using open-source components (Llama 2 + SigLIP), trained on the Open X-Embodiment dataset of 970,000 robot episodes across 22 robot embodiments. pi-zero from Physical Intelligence extended the approach with a flow-matching action head that generates continuous actions rather than discretized tokens.\n\nThis trajectory — from image-text pretraining (CLIP) to visual reasoning (Flamingo, LLaVA) to embodied action (RT-2, OpenVLA, pi-zero) — represents the progressive grounding of multimodal foundation models in the physical world.",
  practicalImplications: "For robotics teams building on multimodal foundation models, the critical practical decisions involve model selection, data curation for fine-tuning, and compute budgeting. The model selection landscape as of 2024-2025 splits into three tiers. Closed-source frontier models (GPT-4V, Gemini, Claude) offer the strongest general-purpose multimodal reasoning but cannot be fine-tuned for robot action prediction and have latency and cost constraints for real-time robot control. Open-source VLMs (LLaVA, InternVL, Qwen-VL) can be fine-tuned and deployed locally, making them suitable as perception and reasoning modules. Open-source VLAs (OpenVLA, Octo) are specifically designed for robot control and can be fine-tuned on custom robot data.\n\nFine-tuning data quality dominates model performance. The Open X-Embodiment dataset showed that training on diverse multi-robot data produces models that generalize across embodiments better than training on any single-robot dataset. However, data quality matters more than quantity — OpenVLA trained on a curated subset of Open X-Embodiment outperforms models trained on the full dataset, because low-quality demonstrations inject noise into the policy. For custom deployment, collecting 500-2,000 high-quality demonstrations in the target environment and task distribution typically yields better performance than using 50,000 demonstrations from a different setting.\n\nCompute requirements for fine-tuning are substantial but accessible. Fine-tuning a 7B-parameter VLA (like OpenVLA) on 50,000 robot episodes requires approximately 8 A100 GPUs for 24-48 hours. Smaller adaptations using LoRA (low-rank adaptation) can be done on a single GPU in hours. Inference on edge hardware (NVIDIA Jetson Orin) achieves 3-10 Hz action prediction depending on model size, which is sufficient for manipulation but marginal for high-speed reactive control.\n\nThe practical bottleneck for most teams is not model architecture but training data. Internet-scale pretraining is a solved problem handled by model providers. The unsolved problem is collecting sufficient high-quality robot demonstration data — or, equivalently, human activity data in robot-relevant environments — to teach the model about the specific tasks, objects, and physical interactions it will encounter in deployment.",
  commonMisconceptions: [
    {
      misconception: "Multimodal foundation models can be used directly for robot control without fine-tuning on robot data.",
      correction: "General-purpose VLMs like GPT-4V can describe scenes, identify objects, and reason about spatial relationships, but they cannot output motor commands. Converting a VLM into a robot controller requires fine-tuning on observation-action pairs from the target robot embodiment. Even VLA models pretrained on robot data (OpenVLA, RT-2) need fine-tuning on task-specific demonstrations to achieve reliable performance on novel tasks. The foundation model provides visual understanding and language grounding; the robot-specific data teaches it how to act."
    },
    {
      misconception: "Bigger multimodal models always produce better robot policies.",
      correction: "Model size improves visual reasoning and language understanding but does not automatically improve motor control. RT-2 with a 55B-parameter PaLM-E backbone outperformed the 12B version on tasks requiring semantic reasoning (e.g., 'pick up the object that is not a fruit') but showed minimal improvement on simple motor skills (e.g., 'pick up the green block'). For robotics, the bottleneck is typically the quantity and quality of robot demonstration data, not model capacity. A well-tuned 7B VLA on 2,000 high-quality demonstrations often outperforms a 70B VLA on 500 mediocre demonstrations."
    },
    {
      misconception: "Multimodal foundation models replace the need for specialized perception modules in robotics.",
      correction: "Foundation models provide general visual understanding but may not match the precision of task-specific perception modules. A specialized instance segmentation model fine-tuned on warehouse objects will produce more accurate masks than a general VLM asked to segment the same objects. Production robotics systems typically use foundation models for high-level reasoning and task planning while relying on specialized modules (depth estimation, object detection, grasp prediction) for precise perception. The trend is toward integration — using the foundation model's representations as features for specialized heads — rather than replacement."
    },
  ],
  keyPapers: [
    {
      id: "radford-clip-2021",
      title: "Learning Transferable Visual Models From Natural Language Supervision",
      authors: "Radford et al.",
      venue: "ICML 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2103.00020",
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
      id: "kim-openvla-2024",
      title: "OpenVLA: An Open-Source Vision-Language-Action Model",
      authors: "Kim et al.",
      venue: "CoRL 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2406.09246",
    },
    {
      id: "liu-llava-2023",
      title: "Visual Instruction Tuning",
      authors: "Liu et al.",
      venue: "NeurIPS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.08485",
    },
    {
      id: "driess-palme-2023",
      title: "PaLM-E: An Embodied Multimodal Language Model",
      authors: "Driess et al.",
      venue: "ICML 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.03378",
    },
  ],
  claruRelevance: "Claru provides the real-world multimodal data that bridges internet pretraining to robot deployment. Our catalog of 386,000+ annotated video clips spans egocentric activities, object interactions, and diverse indoor environments — paired with natural language descriptions, object identity labels, spatial annotations, and temporal segmentation. This multimodal annotation richness makes Claru's data directly usable for vision-language pretraining, visual instruction tuning, and VLA fine-tuning. For teams adapting open-source VLAs like OpenVLA to custom tasks, Claru captures demonstration-quality human activity data in target deployment environments, reducing the robot-specific data collection burden by providing observation-rich video that teaches visual grounding and spatial reasoning in the exact settings where the robot will operate. With 10,000+ collectors across 100+ cities, Claru delivers the environmental diversity that prevents multimodal models from overfitting to lab conditions.",
};

export default data;
