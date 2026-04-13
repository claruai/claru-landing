import type { ModelPageData } from "../types";

const data: ModelPageData = {
  slug: "vc-1",
  metaTitle: "Training Data for VC-1 | Data Requirements & Formats | Claru",
  metaDescription:
    "Complete guide to VC-1 training data: Meta's Visual Cortex model pretrained on 4,000+ hours of egocentric video, CortexBench evaluation, and how Claru delivers VC-1-ready data.",
  primaryKeyword: "vc-1 training data",
  secondaryKeywords: [
    "vc-1 data requirements",
    "vc-1 dataset format",
    "visual cortex robot training data",
    "vc-1 pretraining data",
    "meta embodied ai visual representations",
    "vc-1 egocentric video data",
  ],
  canonicalPath: "/models/vc-1",
  h1: "Training Data for VC-1",
  heroSubtitle:
    "A comprehensive breakdown of VC-1's visual representation architecture, its 4,000+ hours of egocentric video pretraining corpus, the CortexBench evaluation suite spanning 17 embodied AI tasks, and how Claru delivers visual data for VC-1-style representation learning and downstream policy training.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Models", href: "/models" },
    { label: "VC-1", href: "/models/vc-1" },
  ],

  // ---------------------------------------------------------------------------
  // Sections
  // ---------------------------------------------------------------------------
  sections: [
    // 1. What Is VC-1?
    {
      type: "prose",
      heading: "What Is VC-1?",
      paragraphs: [
        "VC-1 (Visual Cortex 1) is a visual foundation model for embodied AI developed by Meta AI, published by Arjun Majumdar, Karmesh Yadav, Sergio Arnaud, and colleagues in 2023 (arXiv 2303.18240, presented at NeurIPS 2023). The paper presents the largest and most comprehensive empirical study of pretrained visual representations (PVRs) for robotics, and VC-1 is the model that emerged from this study -- a Vision Transformer (ViT-L, 307M parameters) pretrained via Masked Auto-Encoding (MAE) on a carefully curated mixture of egocentric video and web images that outperforms all prior visual representations on the authors' CortexBench evaluation suite.",
        "Unlike end-to-end VLA models (RT-1, OpenVLA) that map directly from pixels to actions, VC-1 is a visual encoder -- it produces rich feature representations from images that are then consumed by downstream policy heads for specific tasks. This separation of visual representation learning from policy learning is a fundamentally different design philosophy. The thesis is that a general-purpose visual understanding model, pretrained on large-scale human activity data, provides better features for robot learning than task-specific representations or representations trained on generic web images (like ImageNet).",
        "The paper's core contribution is methodological rigor. Rather than proposing a single model, the authors systematically varied pretraining data composition (which datasets, what mixture), model size (ViT-S through ViT-L), and pretraining objective (MAE, contrastive, supervised) across 17 downstream tasks spanning locomotion, navigation, dexterous manipulation, and mobile manipulation. This produced a comprehensive map of what works and what doesn't in visual pretraining for embodied AI. The winning configuration -- ViT-L with MAE pretraining on egocentric video + ImageNet -- became VC-1.",
        "VC-1's practical significance is that it provides an open-source, high-quality visual backbone that any robot learning team can use as a drop-in replacement for ImageNet-pretrained features. The pretrained weights, training code, and evaluation suite are all publicly available, and the model has been adopted across multiple research groups as a standard visual encoder for robot policies.",
      ],
    },

    // 2. Key stats
    {
      type: "stats",
      heading: "VC-1 at a Glance",
      stats: [
        { value: "307M", label: "Parameters (ViT-L)" },
        { value: "4,000+", label: "Hours of egocentric video" },
        { value: "4.3M", label: "Images in pretraining corpus" },
        { value: "7", label: "Egocentric video source datasets" },
        { value: "17", label: "CortexBench evaluation tasks" },
        { value: "10K+", label: "GPU-hours for training" },
      ],
    },

    // 3. Input/output spec
    {
      type: "comparison-table",
      heading: "Input / Output Specification",
      columns: ["Parameter", "Specification"],
      rows: [
        {
          Parameter: "Input Format",
          Specification:
            "224x224 RGB images (single frame), resized and normalized to ImageNet statistics",
        },
        {
          Parameter: "Output Format",
          Specification:
            "Dense feature map (ViT-L: 1024-dim patch tokens) or global CLS token, used as input to downstream policy heads",
        },
        {
          Parameter: "Architecture",
          Specification:
            "Vision Transformer Large (ViT-L/16): 24 transformer layers, 1024 hidden dimension, 16x16 patch size",
        },
        {
          Parameter: "Pretraining Objective",
          Specification:
            "Masked Auto-Encoding (MAE): reconstruct randomly masked image patches (75% masking ratio)",
        },
        {
          Parameter: "Action Prediction",
          Specification:
            "Not directly -- VC-1 outputs visual features; a separate policy head (MLP, Transformer, or diffusion) maps features to actions",
        },
        {
          Parameter: "Multi-frame Support",
          Specification:
            "Single-frame by default; temporal policies stack features from multiple frames at the policy level",
        },
      ],
    },

    // 4. Architecture & Key Findings
    {
      type: "prose",
      heading: "Architecture and Key Findings",
      paragraphs: [
        "VC-1's architecture is a standard Vision Transformer Large (ViT-L/16) with 307M parameters, 24 transformer layers, 1024-dim hidden representations, and 16x16 pixel patches. The model is pretrained using Masked Auto-Encoding (MAE): 75% of image patches are randomly masked, and the model learns to reconstruct the missing pixels from the visible patches. This self-supervised objective forces the model to develop rich spatial understanding without requiring any labels.",
        "The paper's key innovation is not the architecture but the systematic study of pretraining data composition. The authors created datasets with different mixtures of: (1) Ego4D -- 3,670 hours of egocentric video from daily activities. (2) Six additional egocentric video sources (Epic-Kitchens, Something-Something-v2, 100 Days of Hands, and others) totaling 4,000+ hours across 7 datasets. (3) ImageNet -- 1.2M static web images. (4) Robot manipulation datasets. They trained ViT models at multiple scales on different slices of this data to understand which combinations produce the best downstream features.",
        "The critical finding was that data mixture matters enormously, and the best mixture depends on the downstream task domain. For manipulation tasks, egocentric video (particularly hand-object interaction footage) provides the strongest features. For navigation, ImageNet contributes more. The overall best configuration -- VC-1 -- uses a mixture of all egocentric video sources plus ImageNet, trained with MAE at ViT-L scale. This mixture outperforms any single data source, and the egocentric video component is essential: removing it degrades manipulation task features by 10-20%.",
        "Another surprising finding was that scaling dataset size and diversity does not universally improve performance. Adding more data helps on average, but for specific tasks, the wrong data can actually degrade performance. For example, adding navigation-heavy video data slightly hurts dexterous manipulation features. This suggests that teams building VC-1-style models should curate their pretraining data for their target task domain rather than blindly maximizing scale.",
      ],
    },

    // 5. Comparison table
    {
      type: "comparison-table",
      heading: "VC-1 vs Related Visual Representation Models",
      description:
        "How VC-1 compares to other visual backbones used in robot learning.",
      columns: ["Dimension", "VC-1", "Voltron", "R3M", "Theia"],
      rows: [
        {
          Dimension: "Architecture",
          "VC-1": "ViT-L/16 (307M)",
          Voltron: "ViT-S to ViT-B (~22-86M)",
          R3M: "ResNet-50 (25M)",
          Theia: "ViT-S to ViT-B (~22-86M)",
        },
        {
          Dimension: "Pretraining method",
          "VC-1": "MAE (self-supervised)",
          Voltron: "MAE + language alignment",
          R3M: "Time-contrastive + language + L1 (self-supervised)",
          Theia: "Multi-teacher distillation (DINOv2, SAM, Depth Anything)",
        },
        {
          Dimension: "Pretraining data",
          "VC-1": "4,000+ hrs egocentric video + ImageNet (4.3M images)",
          Voltron: "Something-Something-v2 (220K videos)",
          R3M: "Ego4D (4,000+ hrs video)",
          Theia: "ImageNet (1.2M images)",
        },
        {
          Dimension: "Evaluation breadth",
          "VC-1": "17 tasks (CortexBench: manipulation, navigation, locomotion)",
          Voltron: "5 robot manipulation tasks",
          R3M: "3 manipulation tasks (Franka Kitchen, Adroit, DMC)",
          Theia: "CortexBench + additional manipulation benchmarks",
        },
        {
          Dimension: "Open source",
          "VC-1": "Yes (weights, code, CortexBench)",
          Voltron: "Yes (weights, code, evaluation suite)",
          R3M: "Yes (weights, code)",
          Theia: "Yes (weights, code)",
        },
      ],
    },

    // 6. Training Data Requirements
    {
      type: "prose",
      heading: "Training Data Requirements",
      paragraphs: [
        "VC-1's pretraining corpus consists of two main components. The egocentric video component draws from 7 datasets totaling over 4,000 hours: Ego4D (3,670 hours of daily activities across 74 locations in 9 countries), Epic-Kitchens (100 hours of kitchen activity), Something-Something-v2 (220,847 video clips of object interactions), 100 Days of Hands, and three additional egocentric sources. From these videos, the authors sampled 4.3 million individual frames for MAE pretraining. The static image component is ImageNet (1.2 million images), which provides object-centric visual features that complement the egocentric video's activity-centric features.",
        "For MAE pretraining, each training sample is a single 224x224 RGB image -- no temporal structure, no action labels, no language annotations. The images are resized and normalized to ImageNet statistics (mean and standard deviation per channel). The 75% masking ratio means the model only sees 49 of the 196 patches per image during training, forcing it to learn strong spatial priors. Training the ViT-L model to convergence required over 10,000 GPU-hours on NVIDIA A100 GPUs.",
        "For downstream policy training (not VC-1 pretraining, but using VC-1 features), the data requirements depend on the specific task. The CortexBench evaluation includes tasks with as few as 25 demonstrations (dexterous manipulation in simulation) and as many as 50,000 episodes (navigation in Habitat). The VC-1 features reduce the data requirements for downstream tasks compared to training from scratch, but the exact reduction varies by task. On manipulation tasks, VC-1 features typically enable competitive performance with 2-5x less downstream data than training a CNN from scratch.",
        "For teams building VC-1-style visual encoders, the pretraining data curation is the most important decision. The paper shows that indiscriminate data aggregation can hurt specific tasks -- you want egocentric hand-object interaction video for manipulation, navigation footage for navigation, and so on. The Ego4D dataset is the single most impactful data source because it provides massive scale (3,670 hours) with diverse manipulation activities. Adding ImageNet on top helps because it provides complementary object-centric features (isolated objects on clean backgrounds, which aids object recognition in cluttered robot scenes).",
      ],
    },

    // 7. How Claru Data Integrates
    {
      type: "prose",
      heading: "How Claru Data Integrates with VC-1",
      paragraphs: [
        "Claru provides both the egocentric video data for VC-1-style visual pretraining and the robot demonstration data for downstream policy training on VC-1 features. For pretraining, our catalog of 3M+ human activity video clips spans domains beyond Ego4D's coverage: workplace operations, warehouse activities, retail environments, outdoor tasks, and culturally diverse domestic settings collected across 100+ cities. These videos provide the hand-object interaction footage that VC-1's paper identified as the most impactful pretraining data for manipulation tasks.",
        "A key advantage of Claru's pretraining data is environmental diversity. Ego4D, while large (3,670 hours), is concentrated in specific geographic and cultural contexts. The VC-1 paper showed that data diversity matters -- broader visual diversity in pretraining produces more robust features. Claru's global collection network naturally provides this diversity: our egocentric videos capture manipulation activities in kitchens, offices, factories, and outdoor settings across different lighting conditions, object types, and cultural contexts that expand the visual vocabulary beyond what any single academic dataset covers.",
        "For downstream policy training, Claru delivers robot demonstration datasets with VC-1-compatible observations. Our data includes 224x224 RGB frames (matching VC-1's expected input resolution), action labels in the downstream policy's native format, and language annotations. We can deliver data pre-processed with VC-1 feature extraction -- running the frozen VC-1 encoder on our RGB frames and delivering the resulting 1024-dim feature vectors alongside the raw images -- which significantly accelerates policy training for teams that want to skip the feature extraction step during training.",
        "We also support teams that want to extend or retrain VC-1 itself. Our video data pipeline can deliver frame-level samples at any target resolution with consistent normalization, formatted for MAE pretraining. We provide dataset metadata including activity labels, hand-object contact segments, and scene descriptions that enable targeted curation -- for example, filtering for hand-object interaction frames to create a manipulation-focused pretraining corpus, which the VC-1 paper identified as the most effective data strategy for manipulation-centric embodied AI.",
      ],
    },

    // 8. References
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "majumdar-vc1-2023",
          title:
            "Where Are We in the Search for an Artificial Visual Cortex for Embodied Intelligence?",
          authors: "Majumdar, Yadav, Arnaud et al.",
          venue: "NeurIPS 2023 / arXiv 2303.18240",
          year: 2023,
          url: "https://arxiv.org/abs/2303.18240",
        },
        {
          id: "he-mae-2022",
          title: "Masked Autoencoders Are Scalable Vision Learners",
          authors: "He, Chen, Xie, Li, Dollar, Girshick",
          venue: "CVPR 2022 / arXiv 2111.06377",
          year: 2022,
          url: "https://arxiv.org/abs/2111.06377",
        },
        {
          id: "grauman-ego4d-2022",
          title:
            "Ego4D: Around the World in 3,000 Hours of Egocentric Video",
          authors: "Grauman et al.",
          venue: "CVPR 2022 / arXiv 2110.07058",
          year: 2022,
          url: "https://arxiv.org/abs/2110.07058",
        },
        {
          id: "nair-r3m-2022",
          title:
            "R3M: A Universal Visual Representation for Robot Manipulation",
          authors: "Nair, Rajeswaran, Kumar, Finn, Gupta",
          venue: "CoRL 2022 / arXiv 2203.12601",
          year: 2022,
          url: "https://arxiv.org/abs/2203.12601",
        },
        {
          id: "karamcheti-voltron-2023",
          title:
            "Language-Driven Representation Learning for Robotics",
          authors: "Karamcheti, Nair, Chen, Kollar, Finn, Sadigh, Liang",
          venue: "RSS 2023 / arXiv 2302.12766",
          year: 2023,
          url: "https://arxiv.org/abs/2302.12766",
        },
        {
          id: "shang-theia-2024",
          title:
            "Theia: Distilling Diverse Vision Foundation Models for Robot Learning",
          authors:
            "Shang, Schmeckpeper, May, Minniti, Kelestemur, Watkins, Herlant",
          venue: "CoRL 2024 / arXiv 2407.20179",
          year: 2024,
          url: "https://arxiv.org/abs/2407.20179",
        },
      ],
    },
  ],

  // ---------------------------------------------------------------------------
  // FAQs
  // ---------------------------------------------------------------------------
  faqs: [
    {
      question:
        "How is VC-1 different from end-to-end VLA models like RT-1 or OpenVLA?",
      answer:
        "VC-1 is a visual encoder, not an end-to-end policy. It takes 224x224 RGB images and outputs rich feature representations (1024-dim patch tokens from ViT-L). A separate downstream policy head (MLP, Transformer, or diffusion model) then maps these features to robot actions. This separation means VC-1 can be pretrained on massive amounts of unlabeled video (4,000+ hours, no action labels needed), and the resulting features can be reused across many different robot tasks and embodiments without repretraining.",
    },
    {
      question:
        "Why does VC-1 use egocentric video instead of robot data for pretraining?",
      answer:
        "Egocentric video (especially hand-object interactions) provides visual features that transfer well to robot manipulation because humans and robots interact with objects similarly from a visual perspective. The VC-1 paper showed that egocentric video features outperform both ImageNet features and robot-data features for manipulation tasks. The key insight is that 4,000+ hours of human activity video captures far more visual diversity than any existing robot dataset, and this diversity is what makes the features general-purpose.",
    },
    {
      question:
        "How much downstream data do I need when using VC-1 features?",
      answer:
        "It depends on the task, but VC-1 features typically reduce downstream data requirements by 2-5x compared to training from scratch. On CortexBench manipulation tasks, competitive policies can be trained with 25-500 demonstrations when built on VC-1 features. For more complex tasks or real-world deployment, 1,000-5,000 demonstrations on VC-1 features is a practical range. The features handle visual understanding, so the policy head only needs to learn the action mapping.",
    },
    {
      question:
        "Can I add my own data to VC-1's pretraining corpus and retrain?",
      answer:
        "Yes, the code is open-source. The paper shows that data composition significantly affects downstream performance, so adding domain-relevant video (e.g., kitchen footage for a kitchen robot) can improve task-specific features. However, indiscriminate data addition can hurt -- adding navigation video slightly degrades manipulation features. Claru can help curate domain-specific video corpora filtered for hand-object interactions, specific activity types, or target environments.",
    },
    {
      question:
        "What is CortexBench and how should I interpret VC-1's results?",
      answer:
        "CortexBench is the 17-task evaluation suite the VC-1 authors created to comprehensively assess visual representations for embodied AI. It spans dexterous manipulation (Adroit, DexMV), locomotion (DMC), mobile manipulation (Habitat), and navigation tasks. VC-1 outperforms all prior representations on average across CortexBench, but does not dominate on every individual task -- some tasks favor other models. This means VC-1 is the safest default choice, but if you know your specific task domain, a task-specialized model might perform better.",
    },
  ],

  // ---------------------------------------------------------------------------
  // CTA
  // ---------------------------------------------------------------------------
  ctaHeading: "Get Visual Pretraining Data for VC-1-Style Models",
  ctaDescription:
    "Tell us about your embodied AI application. Claru delivers egocentric video data for visual pretraining and robot demonstrations for downstream policy training -- formatted for VC-1, R3M, Voltron, or any visual representation learning pipeline.",

  // ---------------------------------------------------------------------------
  // Cross-links
  // ---------------------------------------------------------------------------
  relatedGlossaryTerms: [
    "foundation-model-robotics",
    "visual-representation-learning",
    "self-supervised-learning",
    "vla",
    "imitation-learning",
  ],
  relatedGuidePages: [
    "how-to-collect-teleoperation-data",
    "how-to-create-action-labels-for-vla",
  ],
  relatedSolutionSlugs: [],

  // ---------------------------------------------------------------------------
  // Model metadata
  // ---------------------------------------------------------------------------
  modelName: "VC-1",
  organization: "Meta AI",
  year: 2023,

  inputSpec: {
    observationFormat:
      "224x224 RGB images normalized to ImageNet statistics, processed as 16x16 patches by ViT-L",
    actionFormat:
      "Not directly -- VC-1 outputs visual feature representations (1024-dim); a separate policy head maps features to robot actions",
    languageConditioning:
      "Not included in VC-1 itself; language conditioning is handled at the downstream policy level",
    controlFrequency:
      "N/A (visual representation model); downstream policies typically operate at 5-20 Hz",
  },

  dataVolumeBenchmarks:
    "VC-1 (ViT-L, 307M parameters) was pretrained on 4.3 million images sampled from over 4,000 hours of egocentric video across 7 datasets: Ego4D (3,670 hours from 74 locations across 9 countries), Epic-Kitchens (100 hours of kitchen activity), Something-Something-v2 (220K clips), 100 Days of Hands, and three additional egocentric sources. This egocentric corpus was mixed with ImageNet (1.2M images) for optimal downstream performance. The paper's systematic study showed that this mixture outperforms any single data source, and that egocentric video is essential -- removing it degrades manipulation task features by 10-20%. Training the ViT-L model required over 10,000 GPU-hours on A100 GPUs. On CortexBench (17 tasks spanning manipulation, navigation, and locomotion), VC-1 outperformed all prior pretrained visual representations on average. For downstream policy training on VC-1 features, the evaluation tasks used between 25 demonstrations (dexterous manipulation in simulation) and 50,000 episodes (navigation), with VC-1 features typically enabling competitive performance with 2-5x less data than training from scratch.",

  trainingRecipe:
    "VC-1 is pretrained with Masked Auto-Encoding (MAE) on a curated mixture of egocentric video frames and ImageNet images. The architecture is Vision Transformer Large (ViT-L/16): 24 transformer layers, 1024 hidden dimension, 16x16 pixel patch size, 307M total parameters. During MAE pretraining, 75% of image patches are randomly masked and the model learns to reconstruct the missing pixels from the visible 25%. Each training sample is a single 224x224 RGB frame (no temporal structure or labels needed). The egocentric video component provides hand-object interaction features critical for manipulation, while ImageNet provides complementary object-centric features. The authors systematically evaluated alternative pretraining objectives (contrastive learning, supervised classification) and found that MAE consistently produced the best downstream features at ViT-L scale. After pretraining, the VC-1 encoder is frozen and a task-specific policy head (typically a shallow MLP or small Transformer) is trained on robot demonstration data to map VC-1 features to actions. This frozen-encoder paradigm makes VC-1 features reusable across tasks without expensive repretraining.",

  claruIntegration:
    "Claru provides both the egocentric video for VC-1-style visual pretraining and the robot demonstrations for downstream policy training on VC-1 features. Our 3M+ human activity video clips span domains beyond Ego4D's coverage -- workplace operations, warehouse tasks, retail environments, and domestic activities across 100+ cities -- providing the environmental diversity that the VC-1 paper identified as critical for robust features. For downstream policy training, we deliver 224x224 RGB frames with action labels and can provide pre-extracted VC-1 features (1024-dim vectors) alongside raw images to accelerate training. For teams extending VC-1, we curate domain-specific video corpora filtered for hand-object interactions, target activity types, or specific environments, matching the paper's finding that data curation matters more than indiscriminate scaling.",

  keyPapers: [
    {
      id: "majumdar-vc1-2023",
      title:
        "Where Are We in the Search for an Artificial Visual Cortex for Embodied Intelligence?",
      authors: "Majumdar, Yadav, Arnaud et al.",
      venue: "NeurIPS 2023 / arXiv 2303.18240",
      year: 2023,
      url: "https://arxiv.org/abs/2303.18240",
    },
    {
      id: "he-mae-2022",
      title: "Masked Autoencoders Are Scalable Vision Learners",
      authors: "He, Chen, Xie, Li, Dollar, Girshick",
      venue: "CVPR 2022 / arXiv 2111.06377",
      year: 2022,
      url: "https://arxiv.org/abs/2111.06377",
    },
    {
      id: "grauman-ego4d-2022",
      title:
        "Ego4D: Around the World in 3,000 Hours of Egocentric Video",
      authors: "Grauman et al.",
      venue: "CVPR 2022 / arXiv 2110.07058",
      year: 2022,
      url: "https://arxiv.org/abs/2110.07058",
    },
    {
      id: "nair-r3m-2022",
      title:
        "R3M: A Universal Visual Representation for Robot Manipulation",
      authors: "Nair, Rajeswaran, Kumar, Finn, Gupta",
      venue: "CoRL 2022 / arXiv 2203.12601",
      year: 2022,
      url: "https://arxiv.org/abs/2203.12601",
    },
    {
      id: "karamcheti-voltron-2023",
      title: "Language-Driven Representation Learning for Robotics",
      authors: "Karamcheti, Nair, Chen, Kollar, Finn, Sadigh, Liang",
      venue: "RSS 2023 / arXiv 2302.12766",
      year: 2023,
      url: "https://arxiv.org/abs/2302.12766",
    },
    {
      id: "shang-theia-2024",
      title:
        "Theia: Distilling Diverse Vision Foundation Models for Robot Learning",
      authors:
        "Shang, Schmeckpeper, May, Minniti, Kelestemur, Watkins, Herlant",
      venue: "CoRL 2024 / arXiv 2407.20179",
      year: 2024,
      url: "https://arxiv.org/abs/2407.20179",
    },
  ],
};

export default data;
