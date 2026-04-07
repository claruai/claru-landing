import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "zero-shot-generalization",
  termSlug: "zero-shot-generalization",
  category: "robotics-fundamentals",
  metaTitle: "Zero-Shot Generalization — Definition & Training Data | Claru",
  metaDescription: "Zero-shot generalization is a robot's ability to perform tasks, handle objects, or operate in environments never seen during training. Learn what enables it and what data it requires.",
  primaryKeyword: "zero-shot generalization robotics",
  secondaryKeywords: ["zero-shot robot", "unseen task generalization", "novel object generalization", "out-of-distribution robotics", "robot transfer learning", "generalist robot policy"],
  canonicalPath: "/glossary/zero-shot-generalization",
  h1: "Zero-Shot Generalization: Definition, Applications, and Training Data Requirements",
  heroSubtitle: "Zero-shot generalization is a robot's ability to successfully perform tasks, manipulate objects, or operate in environments that were never present in its training data. This page covers what enables zero-shot generalization, why it depends more on training data diversity than model architecture, and how the field is progressing toward truly general-purpose robots.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Zero-Shot Generalization", href: "/glossary/zero-shot-generalization" },
  ],
  sections: [],
  faqs: [
    {
      question: "What does zero-shot generalization mean in robotics?",
      answer: "In robotics, zero-shot generalization refers to a policy's ability to succeed on inputs it has never encountered during training — new objects, new environments, new task instructions, or new robot embodiments — without any additional fine-tuning or adaptation. The term 'zero-shot' means zero additional training examples from the target domain. For example, a manipulation policy trained on picking up cups, bowls, and plates that can also pick up a wine glass it has never seen is demonstrating zero-shot object generalization. A policy trained in lab kitchens that works in a real home kitchen demonstrates zero-shot environment generalization. This is distinct from few-shot generalization (where a handful of demonstrations in the new domain are provided) and from fine-tuning (where the model is retrained on new domain data).",
    },
    {
      question: "What training data properties enable zero-shot generalization?",
      answer: "Three data properties are critical. First, diversity: the training data must cover enough variation across the relevant dimension (objects, environments, lighting, viewpoints) that the model learns what is invariant versus what varies. A model trained on 100 different cups learns 'cupness' as a category; a model trained on 1 cup learns that specific cup. Second, scale: larger datasets provide more coverage of the combinatorial space of real-world conditions. The Open X-Embodiment project showed that combining data from 22 robot platforms improved zero-shot transfer to held-out robots. Third, language grounding: conditioning policies on natural language instructions (as in VLA models like RT-2 and OpenVLA) enables generalization to new tasks described in language, leveraging the world knowledge embedded in the language model's pretraining data.",
    },
    {
      question: "How is zero-shot generalization measured in robot learning?",
      answer: "The standard evaluation protocol holds out specific instances along one or more dimensions and measures task success rate on those held-out instances. Environment generalization: train on rooms A-E, test on room F. Object generalization: train on objects 1-50, test on objects 51-60. Instruction generalization: train on instructions using vocabulary A, test on paraphrased instructions using vocabulary B. Embodiment generalization: train on robots A-C, test on robot D. The RT-2 paper reported zero-shot generalization by testing whether a robot trained on standard manipulation objects could follow instructions involving novel objects (like 'pick up the Taylor Swift figurine') that were mentioned only in the language model's pretraining data. Success rates on held-out instances are always lower than on training-distribution instances — the gap between the two quantifies the generalization difficulty.",
    },
    {
      question: "Can simulation domain randomization achieve zero-shot sim-to-real generalization?",
      answer: "Domain randomization — randomly varying textures, colors, lighting, camera positions, and physics parameters during simulation training — can enable zero-shot transfer from simulation to reality for specific tasks. Notable successes include OpenAI's Rubik's cube manipulation (2019) and ManiSkill's sim-to-real transfer results. However, domain randomization has fundamental limitations: it covers random visual variation but misses the structured variation of real environments. Real kitchens differ from simulated kitchens not just in texture but in layout, object inventory, and physical properties (friction, deformability) that domain randomization does not capture. The most successful sim-to-real approaches combine domain randomization with a smaller amount of real-world data for fine-tuning, achieving better zero-shot performance than either approach alone.",
    },
    {
      question: "What is the current state of zero-shot generalization in production robotics?",
      answer: "As of 2025, zero-shot generalization in production robotics is limited but improving rapidly. The best systems achieve 70-85% success on novel objects within familiar categories (new cups, new bowls) but drop to 30-50% on truly out-of-distribution objects (objects from categories never seen in training). Environment generalization remains the hardest axis: policies trained in one physical location typically need at minimum 1,000-5,000 demonstrations from a new location to perform reliably. The frontier is VLA models like RT-2 and OpenVLA, which leverage internet-scale vision-language pretraining to recognize novel objects from language descriptions, and cross-embodiment training from Open X-Embodiment, which enables partial transfer across robot platforms. Full zero-shot generalization — a single policy that works on any object, in any environment, on any robot — remains an open research problem that requires orders of magnitude more diverse training data.",
    },
  ],
  ctaHeading: "Need Diverse Training Data for Generalizable Robots?",
  ctaDescription: "Claru provides the diverse, multi-environment training data that zero-shot generalization demands — collected across 100+ cities with 10,000+ contributors to cover the real-world variation that lab data cannot.",
  relatedGlossaryTerms: ["foundation-model-robotics", "vla", "language-conditioned-policy", "cross-embodiment-data"],
  relatedGuidePages: ["how-to-build-a-language-conditioned-dataset"],
  relatedSolutionSlugs: ["vla-training-data"],

  longDefinition: `Zero-shot generalization in robotics is the ability of a learned policy to successfully handle inputs from outside its training distribution without any additional data collection, fine-tuning, or adaptation. The "zero-shot" qualifier distinguishes it from few-shot adaptation (where a small number of demonstrations from the new domain guide the model) and from full fine-tuning (where the model is retrained on new domain data). A robot that can pick up a novel object it has never seen, follow a task instruction phrased in words it has never encountered, or operate in a new environment with different lighting and layout — all without any additional training — is demonstrating zero-shot generalization.

Zero-shot generalization is the central capability gap between current robot learning systems and the vision of general-purpose robots. Today's best systems are narrow specialists: they work reliably on the specific tasks, objects, and environments present in their training data, but performance degrades sharply when any of these factors deviates from the training distribution. The degree of degradation — the "generalization gap" — varies by axis: novel object instances within familiar categories (a new cup design) cause 5-15% success rate drops, novel environments cause 20-40% drops, and novel task categories cause 40-60% drops.

The theoretical foundation for understanding zero-shot generalization comes from distribution shift theory. A learned policy approximates a mapping from observations to actions that is accurate within the support of the training distribution. Outside that support, the policy extrapolates, and the quality of extrapolation depends on whether the model has learned the correct underlying structure (invariant features) rather than superficial correlations (spurious features). A model that learned "grasp objects at their center of mass" generalizes to new objects; a model that learned "move the gripper to pixel coordinate (240, 180)" does not. The training data determines which structure the model learns: diverse data that varies the irrelevant dimensions (background, lighting, object color) while maintaining the relevant structure (object shape, grasp affordance) teaches the model to rely on the right features.

Large-scale pretraining on internet data provides a powerful mechanism for zero-shot generalization in robot learning. VLA models like RT-2 inherit world knowledge from their vision-language backbone: the language model knows what a "wine glass" is from text pretraining, and the vision encoder knows what wine glasses look like from image pretraining. This knowledge transfers to robot control — RT-2 can follow the instruction "pick up the wine glass" even if no wine glass appeared in its robot training data, because the VLM backbone provides the semantic grounding. This is conceptual zero-shot generalization: the robot has never manipulated a wine glass, but it can identify one and attempt a grasp strategy based on knowledge of similarly shaped objects in its training data.`,

  historicalContext: `The concept of generalization in machine learning dates to Vapnik's statistical learning theory (1995), which formalized the conditions under which a model trained on samples from one distribution will perform well on new samples from the same distribution. Zero-shot generalization — performing well on a different distribution — was not part of this classical framework and was initially considered outside the scope of principled ML theory.

In robotics, the generalization problem was first confronted practically in the sim-to-real transfer literature. Tobin et al. (2017) introduced domain randomization as a systematic approach: by randomly varying visual and physical properties in simulation during training, the resulting policy becomes robust to the specific visual properties of the real world, which appear as just another random variation. This achieved zero-shot sim-to-real transfer for simple tasks like object picking and pushing. OpenAI's Dactyl project (2019) demonstrated domain randomization at scale for dexterous manipulation, training entirely in simulation to solve a Rubik's cube with a physical robot hand.

The modern era of zero-shot generalization in robot learning began with Google's RT-2 (Brohan et al., 2023), which was the first to demonstrate that vision-language pretraining could enable robots to generalize to concepts not present in their robot training data. By fine-tuning a PaLI-X vision-language model to output robot actions, RT-2 inherited PaLI-X's knowledge of tens of thousands of object categories, enabling instruction-following for novel objects. The RT-2-X variant, trained on the Open X-Embodiment dataset from 22 robot platforms, additionally demonstrated cross-embodiment generalization: a single policy that worked across different robot arms and grippers.

The Octo model (Team et al., 2024) showed that a generalist policy trained on 800,000 trajectories from diverse robots could be zero-shot deployed on a new robot platform with 50-60% success, compared to 30% for a policy trained only on that platform's data. Physical Intelligence's pi-zero (2024) pushed this further with a VLA that combined flow matching with vision-language conditioning, achieving zero-shot multi-task performance across manipulation, folding, and bimanual tasks. The trend is clear: zero-shot generalization improves with data diversity and scale, and the remaining gaps are primarily data problems, not architecture problems.`,

  practicalImplications: `For teams building robot systems that need to generalize beyond their training conditions, the practical path to zero-shot generalization involves three investment areas: training data diversity, model architecture selection, and evaluation methodology.

Training data diversity is the highest-leverage investment. The RT-1 paper showed that training on data from 7 buildings versus 1 building doubled zero-shot success in novel buildings (53% vs 24%). The Open X-Embodiment project showed that pooling data from multiple labs improved zero-shot transfer to held-out robots by 20 percentage points. These improvements come purely from data diversity — the model architecture was held constant. The practical implication is that teams should invest in collecting data from as many distinct environments, objects, and operators as possible, rather than collecting dense data from a single lab. Collecting 1,000 demonstrations each from 50 environments produces a more generalizable policy than collecting 50,000 demonstrations from 1 environment.

Model architecture determines the ceiling for generalization but not the floor. VLA architectures with pretrained vision-language backbones (RT-2, OpenVLA, pi-zero) have the highest generalization ceiling because they inherit world knowledge from internet-scale pretraining. However, even a VLA model trained on non-diverse data will not generalize — the architecture provides the capacity for generalization, but the training data determines whether that capacity is realized. For teams with limited data budgets, starting with an open-weight VLA (OpenVLA) and fine-tuning on diverse data is more effective than training a custom architecture from scratch.

Evaluation methodology must distinguish between interpolation and extrapolation. Standard train-test splits that randomly partition data test interpolation — the test samples are statistically similar to training samples. Generalization evaluation requires held-out splits along specific axes: environments, objects, or instructions that are systematically different from anything in the training set. If your test environments are merely different rooms in the same building, you are testing interpolation. If they are rooms in a completely different building type (kitchen versus workshop), you are testing genuine generalization. The evaluation must be honest about which type of novelty is being tested.

Claru's data collection model is specifically designed to support zero-shot generalization. Our network of 10,000+ data collectors across 100+ cities provides the environmental, demographic, and object diversity that generalization requires. Rather than collecting dense data in a few locations, we collect broadly distributed data across many locations, ensuring that the resulting training sets cover the full range of conditions a robot will encounter during deployment. Each dataset ships with diversity metrics and held-out evaluation splits designed to measure genuine zero-shot generalization rather than within-distribution performance.`,

  commonMisconceptions: [
    {
      misconception: "Zero-shot generalization is primarily an architecture problem — the right model architecture will generalize from any training data.",
      correction: "The strongest evidence from the past three years of robot learning research shows that data diversity is the primary driver of zero-shot generalization, not model architecture. Google tested RT-2 with different backbone sizes (5B vs 55B parameters) and found that the larger model improved generalization by only 3-5 percentage points — far less than the improvement from adding more diverse training environments or embodiments. OpenVLA, Octo, and pi-zero all achieve their generalization capabilities through diverse training data, not through architectural innovations. The architecture enables generalization; the data delivers it.",
    },
    {
      misconception: "A robot that generalizes to novel objects automatically generalizes to novel environments and tasks.",
      correction: "Generalization is axis-specific, not universal. A model can have excellent object generalization (handling novel instances of familiar categories) while failing completely on environment generalization (new lighting, backgrounds, layouts). Each generalization axis requires diversity along that specific dimension in the training data. Object diversity improves object generalization. Environment diversity improves environment generalization. Task diversity improves task generalization. There is limited cross-axis transfer: training on more objects in the same room does not help the model handle a new room. Teams must invest in diversity along every axis they need to generalize across.",
    },
    {
      misconception: "Zero-shot generalization means the robot will work perfectly on anything it has never seen before.",
      correction: "Zero-shot generalization is a spectrum, not a binary. Even the best current systems show degraded performance on out-of-distribution inputs — the question is how much degradation. RT-2 achieves approximately 60% success on novel-object manipulation versus 90% on training objects. OpenVLA achieves approximately 50% on zero-shot cross-task transfer versus 75% on in-distribution tasks. These numbers represent significant progress toward general-purpose robots but are far from the reliability needed for autonomous deployment. Production systems should plan for graceful degradation: detecting when inputs fall outside the training distribution and requesting human assistance rather than attempting unreliable execution.",
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
      id: "open-x-embodiment-2023",
      title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Open X-Embodiment Collaboration",
      venue: "ICRA 2024",
      year: 2024,
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
    {
      id: "octo-2024",
      title: "Octo: An Open-Source Generalist Robot Policy",
      authors: "Team et al.",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2405.12213",
    },
    {
      id: "tobin-domainrand-2017",
      title: "Domain Randomization for Transferring Deep Neural Networks from Simulation to the Real World",
      authors: "Tobin et al.",
      venue: "IROS 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1703.06907",
    },
  ],

  claruRelevance: `Zero-shot generalization is the capability that Claru's data model is designed to enable. Our collection network of 10,000+ contributors across 100+ cities produces training datasets with the environmental, object, and behavioral diversity that generalization demands. A manipulation policy trained on Claru data encounters new objects, new kitchens, new lighting conditions, and new operator strategies during training — building the robustness needed to generalize at deployment time rather than memorizing a narrow training distribution.

For teams building generalist robot policies or VLA models, Claru provides the data diversity that architecture alone cannot deliver. Our datasets come with held-out evaluation splits designed to measure genuine zero-shot generalization: environments, object sets, and task categories systematically excluded from training to provide honest generalization measurements. Combined with our diversity metrics (Vendi Score, per-dimension coverage reports, gap analysis), clients can identify exactly where their model's generalization is strong, where it is weak, and what additional data to collect to close the gaps.`,
};

export default data;
