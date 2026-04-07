import type { ModelPageData } from "../types";

const data: ModelPageData = {
  slug: "palm-e",
  metaTitle: "Training Data for PaLM-E | Data Requirements & Formats | Claru",
  metaDescription:
    "Complete guide to PaLM-E training data: multi-modal sensor embedding, embodied reasoning volumes, robot interaction data, and how Claru delivers PaLM-E-compatible datasets.",
  primaryKeyword: "palm-e training data",
  secondaryKeywords: [
    "palm-e data requirements",
    "palm-e dataset format",
    "data for palm-e",
    "palm-e embodied language model",
    "embodied multimodal llm data",
    "palm-e robot planning data",
    "palm-e fine-tuning",
  ],
  canonicalPath: "/models/palm-e",
  h1: "Training Data for PaLM-E",
  heroSubtitle:
    "PaLM-E is Google DeepMind's 562-billion-parameter embodied multimodal language model that grounds language reasoning in real-world sensor data. This guide covers its multi-modal input requirements, robot interaction data formats, training volumes, and how Claru delivers data for PaLM-E-style embodied reasoning pipelines.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Models", href: "/models" },
    { label: "PaLM-E", href: "/models/palm-e" },
  ],

  sections: [
    {
      type: "prose",
      heading: "What Is PaLM-E?",
      paragraphs: [
        "PaLM-E (Pathways Language Model - Embodied) is an embodied multimodal large language model introduced by Danny Driess, Fei Xia, Mehdi S. M. Sajjadi, and collaborators at Google DeepMind and TU Berlin in March 2023 (arXiv:2303.03378). At 562 billion parameters, PaLM-E is the largest vision-language model ever applied to robotics. Its core innovation is embedding continuous sensor data -- RGB images, scene state vectors, and object-centric representations -- directly into the token sequence of a large language model (PaLM 540B), enabling the LLM to reason about the physical world and generate executable robot plans.",
        "The key insight behind PaLM-E is that robot planning requires grounded reasoning: understanding what objects are in a scene, what actions are physically possible, and how those actions change the state of the world. Traditional robot planners rely on hand-crafted symbolic representations of the world, which break down when the environment is complex or novel. PaLM-E replaces this symbolic pipeline by training an LLM to reason directly from raw sensor data, generating step-by-step plans in natural language that a low-level controller then executes.",
        "PaLM-E demonstrated several breakthrough capabilities. It could perform multi-step mobile manipulation planning from a single RGB image ('bring me the chips from the kitchen counter'), reason about affordances ('can I push the heavy box?' vs. 'can I push the paper cup?'), handle failures by re-planning when an action does not produce the expected outcome, and transfer knowledge across robot embodiments. Crucially, Driess et al. showed that PaLM-E exhibited positive transfer: training on a mixture of internet-scale vision-language data and robot-specific interaction data produced a model that was better at both tasks than models trained on either data source alone.",
        "PaLM-E operates at the planning level, not the motor control level. It generates high-level action plans ('1. Navigate to counter. 2. Pick up bag of chips. 3. Navigate to user. 4. Hand over chips.') that are then executed by lower-level policies (e.g., RT-1 or SayCan primitives). This architectural separation means PaLM-E's data requirements are fundamentally different from end-to-end VLA models like OpenVLA or Octo: instead of continuous motor commands, PaLM-E consumes and produces natural language plans grounded in visual observations.",
      ],
    },
    {
      type: "stats",
      heading: "Key Metrics from the Paper",
      stats: [
        { value: "562B", label: "Total parameters" },
        { value: "540B", label: "PaLM language backbone" },
        { value: "22B", label: "ViT visual encoder (ViT-22B)" },
        { value: "3", label: "Robot embodiments tested" },
        { value: "6", label: "Task domains demonstrated" },
        { value: "1st", label: "LLM to show positive transfer across embodied+VL tasks" },
      ],
    },
    {
      type: "comparison-table",
      heading: "PaLM-E Input/Output Specification",
      columns: ["Parameter", "Specification"],
      rows: [
        {
          Parameter: "Visual Input",
          Specification:
            "RGB images (224x224 or 512x512) encoded by ViT-22B or ViT-4B into continuous embedding tokens",
        },
        {
          Parameter: "State Input (optional)",
          Specification:
            "Scene state vectors (object positions, bounding boxes) or object-centric representations (OSRT)",
        },
        {
          Parameter: "Language Input",
          Specification:
            "Natural language task instructions or questions about the scene",
        },
        {
          Parameter: "Output",
          Specification:
            "Natural language plans (step-by-step action sequences) or answers to embodied reasoning questions",
        },
        {
          Parameter: "Action Level",
          Specification:
            "High-level planning (not low-level motor commands); plans executed by downstream controllers like RT-1 or SayCan",
        },
        {
          Parameter: "Sensor Embedding",
          Specification:
            "Continuous sensor tokens interleaved with text tokens in the PaLM input sequence",
        },
        {
          Parameter: "Control Frequency",
          Specification:
            "Plan-level (~1-2 Hz for plan generation; downstream controllers operate at 3-10 Hz)",
        },
      ],
    },
    {
      type: "prose",
      heading: "Architecture and Key Innovations",
      paragraphs: [
        "PaLM-E's architecture is a standard decoder-only transformer (PaLM 540B) with one critical modification: continuous sensor inputs are projected into the language model's token embedding space and interleaved with text tokens in the input sequence. For visual inputs, ViT-22B encodes an RGB image into a sequence of patch embeddings (e.g., 256 tokens for a 224x224 image with 14x14 patches). These visual tokens are then linearly projected into the same dimensionality as PaLM's text token embeddings and inserted at specific positions in the input sequence marked by special placeholder tokens.",
        "The paper explored three types of sensor encodings: (1) ViT-based image encoding, where raw RGB images are processed through a Vision Transformer to produce patch-level embeddings; (2) object-centric representations using OSRT (Object Scene Representation Transformer), which encodes the scene as a set of object-level feature vectors; and (3) state vector encoding, where low-dimensional scene state (object positions, orientations, bounding boxes) is linearly projected into the token space. The ViT-based encoding performed best overall, but combining ViT features with state vectors showed the strongest results on tasks requiring precise spatial reasoning.",
        "A major innovation in PaLM-E is the demonstration of positive transfer between internet-scale VLM training and robot-specific training. When trained jointly on visual question answering (VQA), image captioning, and robot planning tasks, PaLM-E performed better on all tasks compared to models trained on any single data mixture. This transfer was especially pronounced at scale: the 562B model showed stronger positive transfer than the 12B and 84B variants. This finding suggests that the knowledge encoded in web-scale language and vision data (commonsense reasoning, object recognition, spatial understanding) directly benefits embodied reasoning.",
        "PaLM-E also introduced geometric input encodings that inject 3D structural information into the language model. Neural radiance fields (NeRFs) and point clouds can be encoded as token sequences and inserted alongside image and text tokens. This allows PaLM-E to reason about 3D spatial relationships, occlusions, and viewpoint-dependent visibility -- capabilities that are critical for real-world robot planning but absent from most 2D vision-language models.",
      ],
    },
    {
      type: "comparison-table",
      heading: "PaLM-E vs. Related Embodied Reasoning Models",
      columns: ["Feature", "PaLM-E (2023)", "SayCan (2022)", "RT-2 (2023)", "Code as Policies (2023)"],
      rows: [
        {
          Feature: "Architecture",
          "PaLM-E (2023)": "LLM + multi-modal sensor embedding",
          "SayCan (2022)": "LLM + value function scoring",
          "RT-2 (2023)": "VLM + direct action prediction",
          "Code as Policies (2023)": "LLM generating executable Python code",
        },
        {
          Feature: "Action Level",
          "PaLM-E (2023)": "High-level NL plans",
          "SayCan (2022)": "Selects from primitive skill library",
          "RT-2 (2023)": "Low-level motor commands",
          "Code as Policies (2023)": "Code-based policy composition",
        },
        {
          Feature: "Sensor Grounding",
          "PaLM-E (2023)": "Direct (images embedded as tokens)",
          "SayCan (2022)": "Indirect (via affordance scoring)",
          "RT-2 (2023)": "Direct (image-to-action)",
          "Code as Policies (2023)": "None (text-only reasoning)",
        },
        {
          Feature: "Failure Recovery",
          "PaLM-E (2023)": "Re-plans from new observation",
          "SayCan (2022)": "Re-scores affordances",
          "RT-2 (2023)": "No explicit re-planning",
          "Code as Policies (2023)": "Conditional logic in generated code",
        },
        {
          Feature: "Parameters",
          "PaLM-E (2023)": "562B",
          "SayCan (2022)": "540B (PaLM) + learned affordances",
          "RT-2 (2023)": "55B",
          "Code as Policies (2023)": "540B (PaLM, no fine-tuning)",
        },
        {
          Feature: "Open Source",
          "PaLM-E (2023)": "No (paper only)",
          "SayCan (2022)": "No",
          "RT-2 (2023)": "No",
          "Code as Policies (2023)": "Code released, model closed",
        },
      ],
    },
    {
      type: "prose",
      heading: "Training Data Requirements",
      paragraphs: [
        "PaLM-E's training data is a mixture of internet-scale vision-language data and robot-specific interaction data. The internet-scale component is standard VLM training data: image-text pairs from web crawls, visual question answering datasets (VQAv2, OK-VQA), image captioning datasets (COCO Captions), and other multimodal benchmarks. This data teaches the model visual recognition, commonsense reasoning, and language fluency. The paper reports training on the same data mixture as PaLI (Chen et al., 2022), which includes billions of image-text pairs.",
        "The robot-specific component consists of embodied interaction data from three platforms: (1) a mobile manipulation robot (similar to the Everyday Robots platform) performing kitchen tasks like fetching objects, opening drawers, and wiping surfaces; (2) a tabletop robot arm performing language-conditioned pick-and-place and stacking tasks; and (3) a simulated tabletop environment (Language-Table) with pushing and arrangement tasks. Each robot interaction episode contains: an initial RGB observation, a natural language task description, a sequence of intermediate observations, and the step-by-step plan (in natural language) that was executed to accomplish the task.",
        "The critical data format for robot interaction episodes is the interleaved multi-modal sequence. A training example looks like: [image_1] 'Bring me the chips from the counter.' [image_2] 'Step 1: Navigate to counter.' [image_3] 'Step 2: Pick up bag of chips.' [image_4] 'Step 3: Navigate to user.' [image_5] 'Step 4: Hand over chips.' -- where each [image_N] is an RGB frame from the robot's camera encoded as visual tokens. The model learns to generate the step-by-step text plan conditioned on the interleaved visual observations.",
        "For teams building PaLM-E-style embodied reasoning systems, the key data requirement is paired visual observation + language plan data. Each interaction episode needs: (1) RGB images captured at key moments during task execution (typically 3-10 frames per episode showing the start state, intermediate states, and goal state); (2) a natural language task description; and (3) a step-by-step natural language plan describing the actions taken. Annotations should describe what the robot does in each step at a semantic level ('pick up the blue cup'), not at a motor level ('move end-effector to [0.3, 0.2, 0.1]'). This planning-level annotation is what distinguishes PaLM-E data from the motor-level data required by VLA models like OpenVLA or Octo.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Data Integrates with PaLM-E",
      paragraphs: [
        "Claru provides the embodied interaction data that PaLM-E-style models require: RGB observation sequences paired with natural language task descriptions and step-by-step execution plans. Our annotation pipeline produces planning-level descriptions (not motor-level action labels) -- human annotators watch robot task execution videos and write the multi-step plans that a language model should learn to generate. Each episode includes 3-10 keyframe observations with paired plan steps, matching the interleaved multi-modal format PaLM-E uses.",
        "For teams building PaLM-E-inspired systems at smaller scale (using open-source LLM backbones like Llama 3 or Gemma 2 instead of the closed PaLM 540B), Claru delivers data in a flexible format: JSON episodes with base64-encoded or file-referenced images, task descriptions, and step-by-step plans that can be tokenized and interleaved by any VLM training pipeline. We also provide scene-level metadata -- object identities, approximate positions, and affordance labels -- that can be used as supplementary state vector inputs alongside RGB observations.",
        "Claru's collection network spans the task domains PaLM-E was designed to handle: kitchen manipulation, tabletop rearrangement, mobile manipulation in home and office environments, and multi-object interaction tasks requiring sequential planning. We capture both RGB keyframes and full video for each episode, enabling teams to choose their preferred observation sampling strategy. All language annotations are written by trained annotators following a planning-level description protocol that produces the grounded, actionable text PaLM-E's training objective expects.",
      ],
    },
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "driess-palme-2023",
          title: "PaLM-E: An Embodied Multimodal Language Model",
          authors: "Driess, D., Xia, F., Sajjadi, M. S. M., Lynch, C., Chowdhery, A., et al.",
          venue: "ICML 2023 / arXiv 2303.03378",
          year: 2023,
          url: "https://arxiv.org/abs/2303.03378",
        },
        {
          id: "chowdhery-palm-2022",
          title: "PaLM: Scaling Language Modeling with Pathways",
          authors: "Chowdhery, A., Narang, S., Devlin, J., et al.",
          venue: "arXiv 2204.02311",
          year: 2022,
          url: "https://arxiv.org/abs/2204.02311",
        },
        {
          id: "ahn-saycan-2022",
          title: "Do As I Can, Not As I Say: Grounding Language in Robotic Affordances",
          authors: "Ahn, M., Brohan, A., Brown, N., et al.",
          venue: "arXiv 2204.01691",
          year: 2022,
          url: "https://arxiv.org/abs/2204.01691",
        },
        {
          id: "brohan-rt1-2023",
          title: "RT-1: Robotics Transformer for Real-World Control at Scale",
          authors: "Brohan, A., Brown, N., Carbajal, J., et al.",
          venue: "RSS 2023 / arXiv 2212.06817",
          year: 2023,
          url: "https://arxiv.org/abs/2212.06817",
        },
        {
          id: "brohan-rt2-2023",
          title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
          authors: "Brohan, A., Brown, N., Carbajal, J., et al.",
          venue: "CoRL 2023 / arXiv 2307.15818",
          year: 2023,
          url: "https://arxiv.org/abs/2307.15818",
        },
        {
          id: "liang-code-policies-2023",
          title: "Code as Policies: Language Model Programs for Embodied Control",
          authors: "Liang, J., Huang, W., Xia, F., et al.",
          venue: "ICRA 2023 / arXiv 2209.07753",
          year: 2023,
          url: "https://arxiv.org/abs/2209.07753",
        },
      ],
    },
  ],

  faqs: [
    {
      question: "PaLM-E generates plans, not motor commands. How is this different from a VLA model?",
      answer:
        "VLA models like OpenVLA and Octo are end-to-end: they take an image and language instruction and directly output low-level motor commands (e.g., 7-DoF end-effector deltas at 5-10 Hz). PaLM-E operates at the planning level: it takes an image and a task description and generates a step-by-step natural language plan ('1. Pick up cup. 2. Move to sink. 3. Place cup in sink.'). This plan is then executed by a separate low-level policy (like RT-1) that handles the actual motor control. The advantage is that PaLM-E can reason about multi-step tasks requiring sequential logic, while VLA models are typically limited to single-step actions.",
    },
    {
      question: "Can I build a PaLM-E-style system with open-source models?",
      answer:
        "Yes. PaLM-E's architecture -- embedding visual tokens into an LLM's input sequence -- has been replicated with open-source components. You can use Llama 3 or Gemma 2 as the language backbone and a ViT (e.g., DINOv2 or SigLIP) as the visual encoder. The key ingredient is the robot interaction training data: interleaved image-text sequences where the model learns to generate grounded plans. Claru provides this data in formats compatible with open-source VLM training pipelines. The quality gap between open replicas and the original PaLM-E comes primarily from scale (562B vs. 7-70B parameters) and the volume of internet-scale pre-training data.",
    },
    {
      question: "What kind of robot data does PaLM-E need?",
      answer:
        "PaLM-E needs embodied interaction episodes consisting of: (1) RGB images captured at key moments during task execution (3-10 frames per episode), (2) a natural language task description, and (3) a step-by-step natural language plan describing the actions taken. The plans should be at the semantic level ('pick up the red cup') not the motor level ('move to [x,y,z]'). This is fundamentally different from VLA training data, which requires continuous action labels at every timestep. PaLM-E's data is cheaper to annotate because the labels are natural language descriptions rather than precise motor commands.",
    },
    {
      question: "How much robot data did PaLM-E use?",
      answer:
        "The paper does not disclose exact counts, but the robot data component is relatively small compared to the internet-scale VLM data. PaLM-E used interaction data from three platforms: a mobile manipulator (thousands of episodes across kitchen tasks), a tabletop robot arm (hundreds of episodes of pick-and-place and stacking), and a simulated environment (Language-Table, with thousands of episodes). The critical finding was positive transfer: internet-scale VLM training dramatically improved robot planning performance, meaning the model needed less robot-specific data than expected.",
    },
    {
      question: "Is PaLM-E open source?",
      answer:
        "No. PaLM-E is a Google DeepMind research project with no public model weights or training code. The paper describes the architecture and training procedure in detail, and several groups have built open-source replicas using Llama-based backbones. For teams that want PaLM-E-style embodied reasoning, the practical path is to use an open-source VLM (e.g., Llava, Prismatic, or Idefics2) and fine-tune it on interleaved image-plan data. Claru provides the robot interaction data needed for this fine-tuning step.",
    },
  ],

  ctaHeading: "Get Embodied Reasoning Data for PaLM-E-Style Models",
  ctaDescription:
    "Tell us about your embodied reasoning project -- target tasks, robot platform, and LLM backbone -- and we will deliver interleaved image-plan datasets with the observation format, planning-level annotations, and scene metadata your training pipeline requires.",
  relatedGlossaryTerms: [
    "vla",
    "foundation-model-robotics",
    "imitation-learning",
    "embodied-ai",
  ],
  relatedGuidePages: [
    "how-to-create-action-labels-for-vla",
    "how-to-collect-teleoperation-data",
  ],
  relatedSolutionSlugs: ["vla-training-data"],

  modelName: "PaLM-E",
  organization: "Google DeepMind / TU Berlin",
  year: 2023,
  inputSpec: {
    observationFormat:
      "Multi-modal: 224x224 or 512x512 RGB images (ViT-22B encoder) + optional scene state vectors and object-centric representations",
    actionFormat:
      "High-level natural language plans (step-by-step action sequences), not low-level motor commands; downstream controllers (RT-1, SayCan primitives) execute the plans",
    languageConditioning:
      "Natural language task instructions and reasoning queries, processed by PaLM 540B language backbone",
    controlFrequency:
      "Plan-level (~1-2 Hz for plan generation); downstream motor controllers operate at 3-10 Hz",
  },

  dataVolumeBenchmarks:
    "PaLM-E was trained on a mixture of internet-scale vision-language data and robot-specific interaction data. The internet-scale component follows the PaLI training recipe: billions of image-text pairs from web crawls, VQA datasets (VQAv2, OK-VQA), and image captioning datasets (COCO Captions). The robot-specific component consists of embodied interaction episodes from three platforms: a mobile manipulator performing kitchen tasks (navigation, fetching, drawer manipulation), a tabletop robot arm performing language-conditioned pick-and-place and stacking, and a simulated tabletop environment (Language-Table) with pushing and arrangement tasks. Each episode contains RGB keyframe observations, a task description, and a step-by-step natural language execution plan. The paper demonstrated that training jointly on internet VLM data and robot interaction data produced positive transfer -- the 562B model performed better on both VLM benchmarks and robot planning tasks than models trained on either data source alone. This positive transfer was stronger at larger scales, suggesting that more diverse web data improves embodied reasoning.",

  trainingRecipe:
    "PaLM-E embeds continuous sensor data as tokens in PaLM 540B's input sequence. Visual tokens from ViT-22B are linearly projected to match PaLM's token embedding dimension and inserted at placeholder positions in the text sequence. The model is trained with a standard language modeling objective (next-token prediction) on interleaved multi-modal sequences: [image_1] 'Task description' [image_2] 'Step 1: action' [image_3] 'Step 2: action' ... The training mixture combines internet-scale image-text data (VQA, captioning, web crawl pairs) with robot interaction data. The robot data teaches grounded plan generation -- given an observation and task, produce the correct step-by-step plan. The paper evaluated three model scales: PaLM-E 12B, PaLM-E 84B, and PaLM-E 562B, with positive transfer increasing at larger scales. Three visual encoding strategies were compared: ViT image features, OSRT object-centric features, and state vector features, with ViT performing best overall and the combination of ViT + state vectors strongest for spatial reasoning tasks. Training infrastructure details are not disclosed but align with Google's TPU pod-based training for PaLM-scale models.",

  claruIntegration:
    "Claru provides the embodied interaction data that PaLM-E-style models require: RGB observation sequences paired with natural language task descriptions and step-by-step execution plans. Our annotators produce planning-level descriptions ('pick up the blue mug, move to the sink, place mug in sink') rather than motor-level labels, matching PaLM-E's training format. We deliver data as interleaved image-text episodes in JSON format compatible with open-source VLM fine-tuning pipelines. Our collection covers kitchen manipulation, tabletop rearrangement, mobile manipulation, and multi-object sequential tasks -- the task domains PaLM-E was designed to handle.",

  keyPapers: [
    {
      id: "driess-palme-2023",
      title: "PaLM-E: An Embodied Multimodal Language Model",
      authors: "Driess, D., Xia, F., Sajjadi, M. S. M., Lynch, C., Chowdhery, A., et al.",
      venue: "ICML 2023 / arXiv 2303.03378",
      year: 2023,
      url: "https://arxiv.org/abs/2303.03378",
    },
    {
      id: "chowdhery-palm-2022",
      title: "PaLM: Scaling Language Modeling with Pathways",
      authors: "Chowdhery, A., Narang, S., Devlin, J., et al.",
      venue: "arXiv 2204.02311",
      year: 2022,
      url: "https://arxiv.org/abs/2204.02311",
    },
    {
      id: "ahn-saycan-2022",
      title: "Do As I Can, Not As I Say: Grounding Language in Robotic Affordances",
      authors: "Ahn, M., Brohan, A., Brown, N., et al.",
      venue: "arXiv 2204.01691",
      year: 2022,
      url: "https://arxiv.org/abs/2204.01691",
    },
    {
      id: "brohan-rt1-2023",
      title: "RT-1: Robotics Transformer for Real-World Control at Scale",
      authors: "Brohan, A., Brown, N., Carbajal, J., et al.",
      venue: "RSS 2023 / arXiv 2212.06817",
      year: 2023,
      url: "https://arxiv.org/abs/2212.06817",
    },
    {
      id: "brohan-rt2-2023",
      title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan, A., Brown, N., Carbajal, J., et al.",
      venue: "CoRL 2023 / arXiv 2307.15818",
      year: 2023,
      url: "https://arxiv.org/abs/2307.15818",
    },
    {
      id: "liang-code-policies-2023",
      title: "Code as Policies: Language Model Programs for Embodied Control",
      authors: "Liang, J., Huang, W., Xia, F., et al.",
      venue: "ICRA 2023 / arXiv 2209.07753",
      year: 2023,
      url: "https://arxiv.org/abs/2209.07753",
    },
  ],
};

export default data;
