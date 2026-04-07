import type { ModelPageData } from "../types";

const data: ModelPageData = {
  slug: "r3m",
  metaTitle: "Training Data for R3M | Data Requirements & Formats | Claru",
  metaDescription:
    "Complete guide to R3M training data: Ego4D pretraining, time-contrastive learning, visual representation format, and Claru-delivered egocentric video for R3M pipelines.",
  primaryKeyword: "r3m training data",
  secondaryKeywords: [
    "r3m data requirements",
    "r3m dataset format",
    "data for r3m",
    "r3m visual representations",
    "ego4d robot pretraining",
    "reusable representations robotic manipulation",
    "r3m fine-tuning data",
  ],
  canonicalPath: "/models/r3m",
  h1: "Training Data for R3M",
  heroSubtitle:
    "Everything you need to know about R3M's data requirements — Ego4D pretraining volumes, time-contrastive learning format, downstream task data, and how Claru delivers egocentric video datasets for R3M-style visual representation pipelines.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Models", href: "/models" },
    { label: "R3M", href: "/models/r3m" },
  ],

  sections: [
    {
      type: "prose",
      heading: "What Is R3M?",
      paragraphs: [
        "R3M (Reusable Representations for Robotic Manipulation) is a visual representation learning model introduced by Nair et al. from Meta AI in 2022. R3M's core thesis is simple but powerful: large-scale human activity video — specifically egocentric (first-person) footage of people performing everyday tasks — contains enough visual and semantic structure to learn general-purpose representations that transfer to robot manipulation, even though the videos contain no robots at all.",
        "The model is pre-trained on 3,670 hours of egocentric video from the Ego4D dataset, which captures over 930 participants performing daily activities in kitchens, workshops, gardens, and social settings across 74 locations in 9 countries. R3M learns a 2048-dimensional visual embedding space by combining two training objectives: a time-contrastive loss that enforces temporal coherence in the learned features, and a video-language alignment loss that grounds the visual representations in natural language descriptions of the activities being performed.",
        "The practical value of R3M is that it dramatically reduces the amount of robot demonstration data needed for downstream policy learning. In the original paper, Nair et al. show that R3M representations enable 20-40% higher success rates on manipulation tasks compared to training from scratch, and that policies trained with R3M features require significantly fewer demonstrations to achieve comparable performance. This makes R3M especially attractive for teams that cannot afford to collect thousands of robot demonstrations but have access to (or can collect) egocentric human activity video.",
        "R3M is open-source, with pre-trained checkpoints available for ResNet-18, ResNet-34, and ResNet-50 backbones. The model is designed to be used as a frozen feature extractor: you pass a 224x224 RGB frame through the R3M encoder, extract the 2048-dimensional feature vector, and use that as the observation input to your downstream policy (behavioral cloning, reinforcement learning, or hybrid approaches).",
      ],
    },
    {
      type: "stats",
      heading: "Key Metrics from the Paper",
      stats: [
        { value: "3,670 hrs", label: "Ego4D pretraining video" },
        { value: "2,048-dim", label: "Visual embedding dimension" },
        { value: "20-40%", label: "Fewer demos needed vs. scratch" },
        { value: "930+", label: "Ego4D participants" },
        { value: "74", label: "Unique filming locations" },
        { value: "9", label: "Countries in Ego4D collection" },
      ],
    },
    {
      type: "comparison-table",
      heading: "R3M Input/Output Specification",
      columns: ["Parameter", "Specification"],
      rows: [
        {
          Parameter: "Pretraining Input",
          Specification:
            "224x224 RGB frames from egocentric video + paired natural language narrations (Ego4D)",
        },
        {
          Parameter: "Output Representation",
          Specification:
            "2048-dimensional visual feature vector per frame (from ResNet-50 backbone)",
        },
        {
          Parameter: "Downstream Observation",
          Specification:
            "The 2048-dim R3M embedding replaces raw pixels as input to policy networks",
        },
        {
          Parameter: "Action Format",
          Specification:
            "N/A for R3M itself — downstream policies define their own action spaces (e.g., 7-DoF delta end-effector)",
        },
        {
          Parameter: "Language Conditioning",
          Specification:
            "Language-aligned embedding space via video-language contrastive loss during pretraining",
        },
        {
          Parameter: "Backbone Options",
          Specification:
            "ResNet-18 (512-dim), ResNet-34 (512-dim), ResNet-50 (2048-dim)",
        },
      ],
    },
    {
      type: "prose",
      heading: "Architecture and Key Innovations",
      paragraphs: [
        "R3M's architecture consists of a standard ResNet visual encoder trained with two complementary self-supervised objectives. The first is a time-contrastive learning (TCN) loss: given two frames from the same video that are close in time, their embeddings should be similar, while frames that are far apart should be dissimilar. This objective forces the network to learn features that capture the temporal dynamics of manipulation — the progression from grasping to lifting to placing — rather than static visual appearance alone.",
        "The second objective is a video-language alignment loss inspired by CLIP. Each video clip in Ego4D is paired with a natural language narration describing the activity (e.g., 'the person picks up the screwdriver and tightens the bolt'). R3M uses a contrastive loss to align the visual embedding of the video frames with the text embedding of the narration, grounding the visual features in semantic understanding. This dual-objective training produces representations that are both temporally coherent and semantically meaningful.",
        "A key innovation in R3M is the demonstration that human egocentric video — not robot demonstration data — is sufficient for pretraining manipulation representations. Previous work (e.g., MVP, VIP) had explored similar ideas, but R3M was the first to show consistent, large-margin improvements across a diverse set of real-world robot manipulation tasks using a simple, reproducible training recipe. The 20-40% sample efficiency improvement is not on simulated benchmarks — it was measured on real Franka Emika Panda tasks including pick-and-place, drawer opening, and lid removal.",
        "In practice, R3M is used as a frozen feature extractor. The workflow is: (1) collect robot demonstrations with an RGB camera, (2) pass each 224x224 frame through the pre-trained R3M encoder, (3) extract the 2048-dim embedding, (4) train a downstream policy (e.g., a 2-layer MLP for behavioral cloning) on the embeddings plus action labels. Because the R3M features are so information-rich, the downstream policy can be very lightweight — often a simple MLP trained in minutes rather than a large network trained over hours.",
      ],
    },
    {
      type: "comparison-table",
      heading: "R3M vs Related Visual Representation Models",
      columns: ["Feature", "R3M (2022)", "MVP (2022)", "VC-1 (2023)", "Voltron (2023)"],
      rows: [
        {
          Feature: "Pretraining Data",
          "R3M (2022)": "Ego4D (3,670 hrs egocentric)",
          "MVP (2022)": "Ego4D + HOI4D + 100DOH",
          "VC-1 (2023)": "Ego4D + ImageNet + other curated",
          "Voltron (2023)": "Something-Something V2 (174K clips)",
        },
        {
          Feature: "Training Objective",
          "R3M (2022)": "TCN + language alignment",
          "MVP (2022)": "Masked autoencoding (MAE)",
          "VC-1 (2023)": "MAE (ViT-L backbone)",
          "Voltron (2023)": "Language-conditioned MAE",
        },
        {
          Feature: "Embedding Dimension",
          "R3M (2022)": "2048 (ResNet-50)",
          "MVP (2022)": "1024 (ViT-B)",
          "VC-1 (2023)": "1024 (ViT-L)",
          "Voltron (2023)": "384 / 768 (ViT-S / ViT-B)",
        },
        {
          Feature: "Open Source",
          "R3M (2022)": "Yes (PyTorch, 3 backbones)",
          "MVP (2022)": "Yes (PyTorch)",
          "VC-1 (2023)": "Yes (PyTorch)",
          "Voltron (2023)": "Yes (PyTorch)",
        },
        {
          Feature: "Language Grounding",
          "R3M (2022)": "Yes (contrastive)",
          "MVP (2022)": "No",
          "VC-1 (2023)": "No",
          "Voltron (2023)": "Yes (generative)",
        },
        {
          Feature: "Key Downstream Gains",
          "R3M (2022)": "20-40% sample efficiency on real robot",
          "MVP (2022)": "Competitive with R3M on Franka tasks",
          "VC-1 (2023)": "Best on broad benchmark suite",
          "Voltron (2023)": "Strong on language-conditioned tasks",
        },
      ],
    },
    {
      type: "prose",
      heading: "Training Data Requirements",
      paragraphs: [
        "R3M's data requirements split into two categories: pretraining data (egocentric video) and downstream data (robot demonstrations). For pretraining, R3M uses 3,670 hours of Ego4D video. The critical properties of this data are: (1) egocentric perspective — the camera is mounted on the person's head, providing a viewpoint structurally similar to a robot's wrist or head camera; (2) hand-object interaction density — the majority of frames show human hands manipulating objects, which provides rich supervision for learning manipulation-relevant features; and (3) paired language narrations — Ego4D provides timestamped natural language descriptions that R3M uses for language alignment.",
        "For teams looking to extend or supplement R3M's pretraining, the key data quality metrics are activity density (frames should primarily show purposeful hand-object interactions, not walking or idle periods), narration coverage (at least one language description per 5-minute clip), and environmental diversity (kitchens, workshops, offices, outdoor settings). The original Ego4D dataset covers 74 locations across 9 countries, and R3M benefits from this geographic and environmental diversity because it prevents the representations from overfitting to specific background textures or lighting conditions.",
        "For downstream robot policy training with R3M features, the data requirements are substantially lower than training from raw pixels. The paper demonstrates that 25-50 demonstrations per task are often sufficient when using R3M features as input, compared to 100-200+ demonstrations when training from scratch. Each demonstration consists of a trajectory of 224x224 RGB frames (from any camera angle, though wrist-mounted or overhead cameras work best) paired with the robot's action labels. The R3M encoder processes each frame independently — there is no temporal context window — so the downstream data pipeline is straightforward.",
        "One practical consideration is camera viewpoint distribution. R3M was pretrained on head-mounted egocentric video (approximately 160-degree field of view, looking down at hands). It transfers best to robot cameras with similar viewpoints — wrist-mounted cameras and head-mounted cameras on humanoid robots. For fixed third-person cameras (common in tabletop manipulation setups), the viewpoint gap can reduce transfer quality. Supplementing the pretraining data with additional egocentric footage from environments similar to your deployment setting can close this gap.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Data Integrates with R3M",
      paragraphs: [
        "Claru's egocentric activity video datasets are a natural supplement to Ego4D for R3M-style pretraining. Our collection spans activities and environments not covered in the original Ego4D dataset — including industrial assembly, warehouse logistics, laboratory work, and agricultural tasks — with all footage captured from head-mounted cameras at 30+ fps with 1080p resolution. Every clip includes timestamped natural language narrations generated by our annotation team, matching the narration density and format that R3M's language alignment objective requires.",
        "For downstream robot demonstration data, Claru provides the complete pipeline: 224x224 RGB observations from calibrated cameras (wrist-mounted, overhead, or multi-view configurations), paired action labels in your robot's native action space, and episode metadata including success/failure labels and task descriptions. Because R3M representations reduce the required demonstration count by 20-40%, Claru's focused collection of 50-100 high-quality demonstrations per task becomes sufficient for strong downstream performance — a cost-effective alternative to collecting hundreds or thousands of demonstrations.",
        "Claru delivers pretraining video in the formats R3M's training pipeline expects: MP4 video at 224x224 resolution with associated narration files in JSON. For downstream robot data, we deliver in HDF5 or RLDS format with pre-computed R3M embeddings as an option — meaning your team can skip the feature extraction step entirely and start training policies immediately. All datasets include provenance documentation covering camera specifications, collection environment metadata, and annotation quality scores.",
      ],
    },
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "nair-r3m-2022",
          title:
            "R3M: A Universal Visual Representation for Robot Manipulation",
          authors: "Nair, S., Rajeswaran, A., Kumar, V., Finn, C., Gupta, A.",
          venue: "CoRL 2022",
          year: 2022,
          url: "https://arxiv.org/abs/2203.12601",
        },
        {
          id: "grauman-ego4d-2022",
          title:
            "Ego4D: Around the World in 3,000 Hours of Egocentric Video",
          authors: "Grauman, K., Westbury, A., Byrne, E., et al.",
          venue: "CVPR 2022",
          year: 2022,
          url: "https://arxiv.org/abs/2110.07058",
        },
        {
          id: "radosavovic-mvp-2023",
          title:
            "Real-World Robot Learning with Masked Visual Pre-training",
          authors: "Radosavovic, I., Xiao, T., James, S., Abbeel, P., Malik, J., Darrell, T.",
          venue: "CoRL 2022",
          year: 2022,
          url: "https://arxiv.org/abs/2210.03109",
        },
        {
          id: "majumdar-vc1-2023",
          title:
            "Where Are We in the Search for an Artificial Visual Cortex for Embodied Intelligence?",
          authors: "Majumdar, A., Yadav, K., Arnaud, S., et al.",
          venue: "NeurIPS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2303.18240",
        },
        {
          id: "karamcheti-voltron-2023",
          title:
            "Language-Driven Representation Learning for Robotics",
          authors: "Karamcheti, S., Nair, S., Chen, A. S., et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2302.12766",
        },
        {
          id: "sermanet-tcn-2018",
          title:
            "Time-Contrastive Networks: Self-Supervised Learning from Video",
          authors: "Sermanet, P., Lynch, C., Chebotar, Y., et al.",
          venue: "ICRA 2018",
          year: 2018,
          url: "https://arxiv.org/abs/1704.06888",
        },
      ],
    },
  ],

  faqs: [
    {
      question: "R3M is a representation model, not a policy. How does it use training data differently?",
      answer:
        "Unlike end-to-end VLA models that consume robot demonstrations directly, R3M has a two-stage data pipeline. Stage 1 (pretraining) uses large-scale human egocentric video — no robots needed — to learn visual features via time-contrastive and language alignment objectives. Stage 2 (downstream policy training) uses a small set of robot demonstrations where R3M features replace raw pixels as the policy's observation input. This decoupling means the expensive data collection (thousands of hours of video) uses cheap human footage, while the robot-specific collection is kept small (25-50 demos per task).",
    },
    {
      question: "Can I extend R3M pretraining with my own egocentric video data?",
      answer:
        "Yes, and this is often recommended when your target domain differs significantly from Ego4D's coverage. R3M's pretraining script is open-source and supports adding custom video data. The key requirements are: egocentric viewpoint (head-mounted or chest-mounted camera), dense hand-object interactions in the footage, and paired natural language narrations for the language alignment objective. Claru provides domain-specific egocentric video with narrations that can be mixed directly into R3M's pretraining pipeline.",
    },
    {
      question: "How does R3M compare to training from scratch with more robot data?",
      answer:
        "The R3M paper shows that policies using R3M features with 25 demonstrations outperform policies trained from raw pixels with 100+ demonstrations on Franka manipulation tasks. However, at very large data scales (1,000+ demonstrations), the gap narrows. R3M's advantage is most pronounced in the low-data regime that most real-world robotics teams operate in. If you can collect thousands of demonstrations per task, training from scratch with a large encoder may eventually match or exceed R3M, but for most teams, R3M's sample efficiency advantage saves months of data collection.",
    },
    {
      question: "Which R3M backbone should I use — ResNet-18, 34, or 50?",
      answer:
        "ResNet-50 produces the highest-quality 2048-dimensional embeddings and is recommended for most use cases. ResNet-18 and ResNet-34 produce 512-dimensional embeddings that are faster to compute but lower quality. If you are running on resource-constrained hardware (e.g., edge inference on a robot with limited GPU), ResNet-18 provides a good speed-quality tradeoff. For research and offline policy training where compute is not a constraint, always use ResNet-50.",
    },
    {
      question: "Does the camera viewpoint in my robot setup matter for R3M transfer?",
      answer:
        "Yes, significantly. R3M was pretrained on head-mounted egocentric video, so it transfers best to cameras with similar viewpoints — wrist-mounted cameras, head cameras on humanoids, or overhead cameras looking down at a manipulation workspace. Fixed third-person side-view cameras show reduced transfer quality because the visual perspective gap is too large. If your robot uses a third-person camera, consider supplementing R3M pretraining with egocentric footage from a similar viewpoint, or switch to a multi-view representation model like VC-1 that is pretrained on more diverse viewpoints.",
    },
  ],

  ctaHeading: "Get Egocentric Video Data for R3M Pretraining",
  ctaDescription:
    "Tell us about your R3M pipeline — target tasks, camera setup, and domain — and we will deliver egocentric video with narrations and robot demonstrations formatted for R3M's pretraining and downstream training stages.",
  relatedGlossaryTerms: [
    "visual-representation-learning",
    "foundation-model-robotics",
    "imitation-learning",
    "egocentric-video",
    "time-contrastive-learning",
  ],
  relatedGuidePages: [
    "how-to-create-action-labels-for-vla",
    "how-to-collect-teleoperation-data",
  ],
  relatedSolutionSlugs: ["egocentric-video-data"],

  modelName: "R3M",
  organization: "Meta AI (Nair et al.)",
  year: 2022,
  inputSpec: {
    observationFormat:
      "224x224 RGB frames from egocentric video (pretraining) or robot cameras (downstream)",
    actionFormat:
      "N/A for R3M itself — outputs 2048-dim visual embeddings consumed by downstream policies",
    languageConditioning:
      "Language-aligned embedding space via contrastive loss on Ego4D narrations",
    controlFrequency:
      "N/A (visual representation model, not a policy — downstream policies define their own control rate)",
  },

  dataVolumeBenchmarks:
    "R3M is pretrained on 3,670 hours of egocentric video from the Ego4D dataset, comprising footage from 930+ participants across 74 locations in 9 countries. The video primarily captures hand-object interaction activities — cooking, crafting, repair work, gardening — with paired natural language narrations at approximately one description per 5-minute clip. For downstream robot policy training with R3M features, the data requirements are dramatically lower than pixel-based training: the paper demonstrates that 25-50 demonstrations per task are sufficient for strong performance on Franka Panda manipulation benchmarks (pick-and-place, drawer opening, lid removal), compared to 100-200+ demonstrations needed when training from scratch. The representation transfers best when the downstream camera viewpoint matches the egocentric pretraining perspective — wrist-mounted and overhead cameras outperform fixed third-person views. For teams extending the pretraining with custom data, at least 500 hours of additional egocentric video with narrations is recommended to meaningfully shift the representation.",

  trainingRecipe:
    "R3M training uses a ResNet-50 backbone (other options: ResNet-18, ResNet-34) with two self-supervised objectives applied jointly. The time-contrastive learning (TCN) loss samples pairs of frames from the same video: nearby frames (within 0.5 seconds) form positive pairs, while distant frames (5+ seconds apart) form negatives. The embedding distance between positive pairs is minimized while negative pairs are pushed apart, forcing the network to encode temporal progression of activities rather than static appearance. The video-language alignment loss operates similarly to CLIP: the visual embedding of a video clip is contrasted against the text embedding of its narration, using a symmetric cross-entropy loss. Both objectives are combined with equal weighting. Training proceeds for 20 epochs on the full Ego4D dataset using SGD with a cosine learning rate schedule, initial learning rate of 0.1, batch size 256, and standard data augmentation (random crops, color jitter, horizontal flips). The resulting 2048-dimensional embeddings are then frozen and used as drop-in observation features for downstream policy learning. Downstream policies are typically lightweight MLPs (2-3 layers, 256 hidden units) trained with behavioral cloning using MSE loss on the action predictions.",

  claruIntegration:
    "Claru's egocentric activity video datasets directly supplement Ego4D for R3M-style pretraining. Our footage spans domains underrepresented in Ego4D — industrial assembly, warehouse logistics, laboratory protocols, agricultural tasks — captured from head-mounted cameras at 30+ fps with 1080p resolution. Every clip includes timestamped natural language narrations in the format R3M's training pipeline expects. For downstream robot demonstration data, Claru delivers 224x224 RGB observations from calibrated cameras with action labels, plus optional pre-computed R3M embeddings so teams can skip the feature extraction step. Because R3M features reduce the required demonstration count by 20-40%, a focused Claru collection of 50-100 demonstrations per task is often sufficient for production-grade policies.",

  keyPapers: [
    {
      id: "nair-r3m-2022",
      title:
        "R3M: A Universal Visual Representation for Robot Manipulation",
      authors: "Nair, S., Rajeswaran, A., Kumar, V., Finn, C., Gupta, A.",
      venue: "CoRL 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2203.12601",
    },
    {
      id: "grauman-ego4d-2022",
      title:
        "Ego4D: Around the World in 3,000 Hours of Egocentric Video",
      authors: "Grauman, K., Westbury, A., Byrne, E., et al.",
      venue: "CVPR 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2110.07058",
    },
    {
      id: "radosavovic-mvp-2023",
      title:
        "Real-World Robot Learning with Masked Visual Pre-training",
      authors: "Radosavovic, I., Xiao, T., James, S., Abbeel, P., Malik, J., Darrell, T.",
      venue: "CoRL 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2210.03109",
    },
    {
      id: "majumdar-vc1-2023",
      title:
        "Where Are We in the Search for an Artificial Visual Cortex for Embodied Intelligence?",
      authors: "Majumdar, A., Yadav, K., Arnaud, S., et al.",
      venue: "NeurIPS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.18240",
    },
    {
      id: "karamcheti-voltron-2023",
      title:
        "Language-Driven Representation Learning for Robotics",
      authors: "Karamcheti, S., Nair, S., Chen, A. S., et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2302.12766",
    },
    {
      id: "sermanet-tcn-2018",
      title:
        "Time-Contrastive Networks: Self-Supervised Learning from Video",
      authors: "Sermanet, P., Lynch, C., Chebotar, Y., et al.",
      venue: "ICRA 2018",
      year: 2018,
      url: "https://arxiv.org/abs/1704.06888",
    },
  ],
};

export default data;
