import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "language-conditioned-policy",
  termSlug: "language-conditioned-policy",
  category: "physical-ai-systems",
  metaTitle: "Language-Conditioned Policy — Definition & Training Data | Claru",
  metaDescription: "A language-conditioned policy executes robot actions based on natural language instructions. Learn about VLA architectures, training data requirements, and instruction grounding.",
  primaryKeyword: "language-conditioned policy",
  secondaryKeywords: ["instruction-following robot", "language-guided manipulation", "natural language robot control", "VLA policy", "language-grounded robot"],
  canonicalPath: "/glossary/language-conditioned-policy",
  h1: "Language-Conditioned Policy: Natural Language Control for Robot Manipulation",
  heroSubtitle: "A language-conditioned policy maps natural language instructions and visual observations to robot actions, enabling a single model to execute diverse tasks specified in plain English. This architecture is the foundation of modern vision-language-action (VLA) models that give robots general-purpose instruction-following capabilities.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Language-Conditioned Policy", href: "/glossary/language-conditioned-policy" },
  ],
  sections: [],
  faqs: [
    {
      question: "What training data does a language-conditioned policy require?",
      answer: "Language-conditioned policies require demonstration datasets where each trajectory is paired with one or more natural language instructions describing the task. The minimum data structure is (observation_sequence, action_sequence, language_instruction) tuples. Observations are typically RGB or RGB-D images from one or more cameras. Actions are robot joint positions, end-effector poses, or gripper commands at 5-30 Hz. Language instructions range from simple commands ('pick up the red cup') to complex multi-step descriptions ('move the plate to the left side of the table, then place the fork on top of it'). Dataset scale varies by architecture: single-task policies can learn from 100-500 demonstrations with consistent language templates, while general-purpose VLAs like RT-2 and OpenVLA require 100,000+ demonstrations spanning hundreds of tasks with diverse natural language paraphrases to achieve robust instruction following.",
    },
    {
      question: "How does language conditioning differ from task-ID conditioning?",
      answer: "Task-ID conditioning assigns each task a discrete integer label (task 0 = pick, task 1 = place, task 2 = pour) and trains a separate policy head or embedding per task. This approach cannot generalize to new tasks without retraining. Language conditioning replaces task IDs with natural language strings, processed through a language encoder (CLIP, T5, PaLM) that maps instructions to a continuous embedding space. This enables compositional generalization: a policy trained on 'pick up the red cup' and 'place the blue plate' can potentially execute 'pick up the blue cup' by composing understood concepts, even if that exact combination was never demonstrated. Language conditioning also supports fine-grained task specification ('gently place the egg' vs 'quickly place the block') that discrete task IDs cannot express.",
    },
    {
      question: "What language models are used to encode instructions in robot policies?",
      answer: "Three categories of language encoders are used. Contrastive models like CLIP and SigLIP encode instructions into fixed-size embeddings that align with visual representations, providing a compact language-vision interface. These work well for short, descriptive instructions. Encoder-decoder models like T5 and Flan-T5 produce contextual token sequences that capture instruction structure and can handle longer, more complex commands. Large autoregressive models like PaLM (used in RT-2) and Llama (used in OpenVLA) directly generate action tokens conditioned on language, leveraging the broad world knowledge encoded during internet-scale pretraining. The trend is toward larger language backbones because they bring better compositional understanding, commonsense reasoning about objects and tasks, and stronger zero-shot generalization to novel instructions.",
    },
    {
      question: "How important is language diversity in the training data?",
      answer: "Language diversity is critical for robust instruction following. Policies trained on templated instructions ('pick up the [object]') learn to pattern-match on templates rather than understand language semantics. When deployed with natural human instructions that deviate from templates ('grab that thing on the left', 'could you get me the red one?'), template-trained policies fail. RT-2 demonstrated that pairing robot demonstrations with diverse language descriptions — including paraphrases, synonyms, spatial references, and varying levels of specificity — dramatically improves instruction generalization. Best practice is to collect at least 5-10 distinct language paraphrases per task, including informal and elliptical phrasings that reflect how humans actually communicate with robots.",
    },
    {
      question: "How does Claru provide language-conditioned training data?",
      answer: "Claru produces language-paired demonstration datasets at two levels. First, our teleoperation campaigns capture manipulation demonstrations with real-time verbal instructions from operators, providing natural language-action alignment without post-hoc annotation. Second, our annotation pipeline generates diverse language descriptions for existing demonstration clips: each clip receives 5-10 paraphrases from multiple annotators covering formal commands, informal requests, spatial descriptions, and goal-state specifications. Language quality is enforced through paraphrase diversity scoring (no two descriptions for the same clip should share more than 40% of content words) and grounding accuracy checks (annotators verify that each instruction unambiguously describes the demonstrated behavior). Datasets are delivered with pre-computed language embeddings from CLIP, SigLIP, and T5 to accelerate training pipeline integration.",
    },
  ],
  ctaHeading: "Building a Language-Conditioned Policy?",
  ctaDescription: "Claru provides purpose-built datasets for physical AI and robotics. Tell us what your model needs to learn.",
  relatedGlossaryTerms: ["vla", "behavioral-cloning", "foundation-model-robotics", "imitation-learning"],
  relatedGuidePages: ["how-to-build-a-language-conditioned-dataset"],
  relatedSolutionSlugs: ["vla-training-data"],
  longDefinition: "A language-conditioned policy is a robot control model that takes both sensory observations (images, depth maps, proprioception) and a natural language instruction as input, and outputs motor actions that execute the described task. The language instruction serves as a task specification, enabling a single policy to perform many different tasks depending on what it is told to do, rather than requiring a separate policy per task.\n\nFormally, a language-conditioned policy is a function pi(a | o, l) that maps an observation o and language instruction l to an action distribution over a. The observation is typically one or more camera images, possibly augmented with robot proprioception (joint angles, gripper state). The language is processed by a frozen or fine-tuned language encoder that produces an embedding vector or token sequence. The action space is usually continuous (joint velocities, end-effector deltas) or discretized into bins. The policy is trained on demonstration data consisting of (observation, action, language) tuples collected through teleoperation or kinesthetic teaching.\n\nThe architecture of language-conditioned policies has evolved rapidly. Early approaches like CLIPort (Shridhar et al., 2022) used CLIP to encode language and images into a shared embedding space, predicting spatial action maps for pick-and-place. RT-1 (Brohan et al., 2023) trained a transformer policy on 130,000 demonstrations spanning 700+ tasks, achieving 97% success on seen tasks. RT-2 (Brohan et al., 2023) fine-tuned a vision-language model (PaLM-E) to output discretized actions, demonstrating that internet-scale language pretraining transfers to robot control. OpenVLA (Kim et al., 2024) showed that open-source VLAs fine-tuned from Llama-based vision-language models achieve competitive performance with a fraction of RT-2's compute.\n\nThe critical insight driving this architecture is that language provides a natural interface for compositional task specification. Instead of collecting separate demonstration datasets for 'pick up the red cup', 'pick up the blue plate', and 'pick up the green bowl', a language-conditioned policy learns the compositional structure — mapping color adjectives to visual features and object nouns to shape categories — enabling generalization to novel color-object combinations never seen in training.",
  historicalContext: "Language grounding in robotics has a long history predating modern deep learning. SHRDLU (Winograd, 1971) demonstrated a system that could manipulate virtual blocks based on natural language commands, but its hand-crafted parser could not scale to real-world language complexity. Through the 1990s and 2000s, robotics language understanding relied on semantic parsing — converting natural language to structured symbolic commands that a planner could execute.\n\nThe deep learning era enabled end-to-end language-conditioned policies that bypass explicit semantic parsing. Tellex et al. (2011) showed that probabilistic graphical models could ground natural language to robot actions in manipulation tasks. Andreas et al. (2017) introduced neural module networks for compositional language grounding. But these early neural approaches still required substantial hand-engineering of the language-action interface.\n\nThe pivotal transition came with large pretrained vision-language models. CLIPort (Shridhar et al., 2022) demonstrated that CLIP's language-image alignment transfers directly to robotic manipulation: by conditioning a transporter network on CLIP embeddings, the policy could follow novel language instructions for rearrangement tasks. SayCan (Ahn et al., 2022) showed that large language models could serve as high-level planners, decomposing complex instructions into sequences of primitive actions grounded by a low-level manipulation policy.\n\nRT-2 (Brohan et al., 2023) marked a paradigm shift by directly fine-tuning a 55-billion parameter vision-language model (PaLM-E) to output robot actions as text tokens. This demonstrated that the broad semantic knowledge encoded in internet-scale language models — understanding object categories, spatial relations, physical properties — transfers to robot control without explicit engineering. The open-source community followed with OpenVLA and other VLA models, democratizing language-conditioned robot learning.",
  practicalImplications: "Building effective language-conditioned policies requires careful attention to three aspects of the training data: language diversity, demonstration coverage, and language-action alignment.\n\nLanguage diversity determines whether the policy learns genuine language understanding or superficial template matching. If training instructions follow a rigid pattern ('pick up the [color] [object]'), the policy may fail when users give natural instructions ('grab that thing over there'). Best practice is to collect 5-10 distinct language paraphrases per task from multiple annotators, including formal imperative commands ('place the cup on the saucer'), informal requests ('could you put that cup down?'), goal-state descriptions ('the cup should be on the saucer'), and spatial references ('move it to the left of the plate'). Automated paraphrase diversity scoring ensures no two descriptions for the same task are too similar.\n\nDemonstration coverage must span the compositional space of objects, actions, and spatial relations that the policy will encounter. A policy trained only on 'pick up' tasks cannot generalize to 'pour' or 'push' actions regardless of language understanding. The demonstration set should cover the cross-product of target objects, action primitives, and spatial configurations, with enough examples per combination (10-50 demonstrations) for the policy to learn the sensorimotor mapping. Coverage gaps — object-action combinations missing from training — are the primary failure mode in deployment.\n\nLanguage-action alignment quality determines whether the policy learns the correct mapping between words and behaviors. Misaligned labels — an instruction saying 'pick up the cup' paired with a demonstration of placing the cup — create contradictory training signal. Alignment is best ensured by collecting language annotations contemporaneously with demonstrations (operators narrate as they teleop) rather than post-hoc (annotators describe previously recorded clips). When post-hoc annotation is necessary, Claru implements a verification step where a second annotator watches the demonstration and confirms the language description is accurate, flagging misalignments for correction.",
  commonMisconceptions: [
    {
      misconception: "Language-conditioned policies understand language the way humans do.",
      correction: "Current language-conditioned policies learn statistical associations between language tokens and visuomotor patterns, not semantic understanding. They can follow 'pick up the red cup' because they have learned the mapping from 'red' to visual features and 'pick up' to grasp motions, but they do not understand why a cup is different from a bowl or what 'red' means in an abstract sense. This is why deployment-time language must stay within the distribution of training instructions — genuinely novel phrasing or abstract instructions like 'make it tidy' fail unless the model was trained on similar language.",
    },
    {
      misconception: "You can train a language-conditioned policy by adding language labels to an existing demonstration dataset.",
      correction: "Post-hoc language labeling of existing demonstrations produces lower-quality training data than language collected during demonstration. Operators who narrate while teleoperating naturally describe what they are about to do and why, producing temporally aligned, action-grounded language. Post-hoc annotators describing a completed clip often produce descriptions that are semantically correct but temporally vague or lack the specificity needed for precise action grounding. The best datasets combine real-time narration with post-hoc paraphrasing to get both alignment quality and language diversity.",
    },
    {
      misconception: "Larger language models always produce better language-conditioned policies.",
      correction: "Larger language encoders bring better compositional understanding and zero-shot generalization, but they also increase inference latency and memory footprint. RT-2 with a 55B parameter PaLM-E backbone achieves impressive generalization but requires server-grade GPUs for inference. Smaller models like OpenVLA (7B parameters) and RT-1 (no LLM, just CLIP embeddings) run on edge hardware and achieve strong performance on seen task distributions. The right language model size depends on the deployment compute budget and the required generalization range. For fixed-task deployments, CLIP embeddings suffice; for open-ended instruction following, larger LLM backbones justify their cost.",
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
      id: "brohan-rt1-2023",
      title: "RT-1: Robotics Transformer for Real-World Control at Scale",
      authors: "Brohan et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2212.06817",
    },
    {
      id: "kim-openvla-2024",
      title: "OpenVLA: An Open-Source Vision-Language-Action Model",
      authors: "Kim et al.",
      venue: "arXiv 2406.09246",
      year: 2024,
      url: "https://arxiv.org/abs/2406.09246",
    },
    {
      id: "shridhar-cliport-2022",
      title: "CLIPort: What and Where Pathways for Robotic Manipulation",
      authors: "Shridhar et al.",
      venue: "CoRL 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2109.12098",
    },
    {
      id: "ahn-saycan-2022",
      title: "Do As I Can, Not As I Say: Grounding Language in Robotic Affordances",
      authors: "Ahn et al.",
      venue: "CoRL 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2204.01691",
    },
  ],
  claruRelevance: "Claru produces the language-paired demonstration data that language-conditioned policies and VLA models require. Our teleoperation campaigns capture manipulation demonstrations with real-time operator narration, ensuring tight temporal alignment between language and action. Our annotation pipeline then generates 5-10 diverse paraphrases per task from multiple annotators, covering the range of natural language expressions that deployed systems will encounter. Language quality controls enforce paraphrase diversity (no two descriptions share more than 40% of content words), grounding accuracy (each instruction unambiguously matches the demonstrated behavior), and compositional coverage (object-action-spatial combinations are systematically represented). With 386,000+ annotated clips and growing, Claru provides the scale and language variety that general-purpose language-conditioned policies demand.",
};

export default data;
