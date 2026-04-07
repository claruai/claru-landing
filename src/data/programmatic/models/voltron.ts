import type { ModelPageData } from "../types";

const data: ModelPageData = {
  slug: "voltron",
  metaTitle:
    "Training Data for Voltron | Data Requirements & Formats | Claru",
  metaDescription:
    "Complete guide to Voltron training data: Stanford's language-driven visual representations for robotics, Something-Something-v2 pretraining, and how Claru delivers Voltron-ready data.",
  primaryKeyword: "voltron training data",
  secondaryKeywords: [
    "voltron data requirements",
    "voltron dataset format",
    "voltron robot visual representations",
    "voltron pretraining data",
    "language-driven representation learning robotics",
    "voltron stanford robot learning",
  ],
  canonicalPath: "/models/voltron",
  h1: "Training Data for Voltron",
  heroSubtitle:
    "A comprehensive breakdown of Voltron's language-driven visual representation framework, its dual pretraining objectives (masked autoencoding + language grounding), the Something-Something-v2 pretraining corpus, and how Claru delivers video and language data for Voltron-style representation learning.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Models", href: "/models" },
    { label: "Voltron", href: "/models/voltron" },
  ],

  // ---------------------------------------------------------------------------
  // Sections
  // ---------------------------------------------------------------------------
  sections: [
    // 1. What Is Voltron?
    {
      type: "prose",
      heading: "What Is Voltron?",
      paragraphs: [
        "Voltron is a framework for language-driven visual representation learning for robotics, developed at Stanford by Siddharth Karamcheti, Suraj Nair, Annie S. Chen, Thomas Kollar, Chelsea Finn, Dorsa Sadigh, and Percy Liang (arXiv 2302.12766, presented at RSS 2023). Voltron addresses a fundamental tension in visual representation learning for robots: masked autoencoding approaches (like MAE) excel at capturing low-level spatial features but miss high-level semantics, while contrastive learning approaches (like CLIP) capture semantic understanding but lose fine-grained spatial detail. Voltron resolves this by combining both objectives, using language as the bridge.",
        "The key insight is that language naturally encodes the high-level semantics that pure visual self-supervision misses. When a human describes a video as 'pushing the red cup to the left,' that language grounds abstract visual features in manipulation-relevant concepts (object identity, spatial relationships, action types). Voltron exploits this by jointly training a visual encoder with two objectives: (1) masked autoencoding of video frames to learn spatial features, and (2) visually-grounded language generation to learn semantic features. The resulting representations capture both the fine-grained visual detail needed for precise motor control and the high-level understanding needed for language-conditioned task execution.",
        "Voltron was pretrained primarily on the Something-Something-v2 dataset -- 220,847 labeled video clips of humans performing templated manipulation actions like 'pushing something from left to right,' 'picking something up,' and 'putting something onto something.' These short clips with structured language descriptions are ideal for learning manipulation-relevant visual features grounded in language. The authors also explored pretraining on Ego4D data and found that the combination of both datasets produced the strongest representations.",
        "On a custom evaluation suite spanning five robot learning tasks (including simulated manipulation and real-world WidowX control), Voltron's language-driven representations outperformed the prior state of the art (R3M, MVP, CLIP features) by 15-25%, with the largest gains on tasks requiring higher-level semantic understanding (e.g., following language instructions to manipulate specific objects). The representations are open-source, making Voltron a practical drop-in visual backbone for any robot learning pipeline that can benefit from language-aware visual features.",
      ],
    },

    // 2. Key stats
    {
      type: "stats",
      heading: "Voltron at a Glance",
      stats: [
        { value: "220K+", label: "Pretraining videos (Sth-Sth-v2)" },
        { value: "174", label: "Language templates in pretraining data" },
        { value: "ViT-S/B", label: "Architecture variants (22M-86M params)" },
        { value: "15-25%", label: "Improvement over prior visual representations" },
        { value: "5", label: "Robot learning evaluation tasks" },
        { value: "2", label: "Pretraining objectives (MAE + language)" },
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
            "224x224 RGB video frames (single or multi-frame depending on variant)",
        },
        {
          Parameter: "Output Format",
          Specification:
            "Dense visual feature representations (ViT-S: 384-dim, ViT-B: 768-dim) used as input to downstream policy heads",
        },
        {
          Parameter: "Language Input",
          Specification:
            "Natural language captions paired with video frames during pretraining (e.g., Something-Something-v2 templates)",
        },
        {
          Parameter: "Pretraining Objectives",
          Specification:
            "Dual: (1) Masked autoencoding of video patches, (2) Visually-grounded language generation conditioned on visual features",
        },
        {
          Parameter: "Action Prediction",
          Specification:
            "Not directly -- Voltron outputs visual features; a separate policy head maps features to robot actions",
        },
        {
          Parameter: "Temporal Handling",
          Specification:
            "Frame-pair or multi-frame variants encode temporal dynamics; single-frame variant processes individual images",
        },
      ],
    },

    // 4. Architecture & Key Innovations
    {
      type: "prose",
      heading: "Architecture and Key Innovations",
      paragraphs: [
        "Voltron offers multiple representation variants built on the Vision Transformer (ViT) architecture. The base visual encoder processes 224x224 RGB images as 16x16 patches through a standard ViT (Small or Base scale, 22M-86M parameters). The key architectural innovation is the dual pretraining setup: the same visual encoder is trained simultaneously with a masked autoencoding decoder (reconstructing masked patches from visible ones) and a language generation decoder (producing natural language descriptions of the scene conditioned on the visual features).",
        "The masked autoencoding branch follows the MAE (Masked Autoencoders) approach: 75% of image patches are randomly masked, and a lightweight decoder reconstructs the missing pixels from the encoder's representations of visible patches. This branch forces the encoder to develop strong spatial features -- understanding object shapes, positions, textures, and scene layout at a fine-grained level. These features are critical for precise motor control where millimeter-level visual accuracy matters.",
        "The language generation branch uses a lightweight autoregressive text decoder that generates natural language descriptions conditioned on the visual encoder's output. During pretraining on Something-Something-v2, the decoder learns to produce descriptions like 'pushing something from left to right' from the visual features alone. This forces the visual encoder to develop features that capture high-level manipulation semantics: object identity, action type, spatial relationships, and before/after state changes. Without this language grounding, pure MAE encoders produce features that are good at pixel-level reconstruction but poor at distinguishing semantically different manipulation scenarios.",
        "Voltron provides three representation variants with different temporal properties: V-Cond (single-frame, produces static scene features), V-Dual (frame-pair, captures short-term dynamics between two frames), and V-Gen (language-conditioned generation, the full dual-objective model). The paper's ablation studies show that V-Gen consistently outperforms the other variants, confirming that the combination of spatial (MAE) and semantic (language) objectives produces the strongest representations. The performance gap is largest on tasks requiring language understanding or long-horizon reasoning, where pure spatial features are insufficient.",
      ],
    },

    // 5. Comparison table
    {
      type: "comparison-table",
      heading: "Voltron vs Related Visual Representation Models",
      description:
        "How Voltron compares to other visual backbones for robot learning.",
      columns: ["Dimension", "Voltron", "VC-1", "R3M", "MVP"],
      rows: [
        {
          Dimension: "Architecture",
          Voltron: "ViT-S/B (22-86M) with dual decoder",
          "VC-1": "ViT-L (307M)",
          R3M: "ResNet-50 (25M)",
          MVP: "ViT-B (86M)",
        },
        {
          Dimension: "Pretraining method",
          Voltron: "MAE + language generation (dual objective)",
          "VC-1": "MAE (self-supervised)",
          R3M: "Time-contrastive + language + L1",
          MVP: "MAE (self-supervised)",
        },
        {
          Dimension: "Pretraining data",
          Voltron: "Something-Something-v2 (220K videos) + optional Ego4D",
          "VC-1": "4,000+ hrs egocentric video + ImageNet (4.3M images)",
          R3M: "Ego4D (4,000+ hrs video)",
          MVP: "Multiple video datasets",
        },
        {
          Dimension: "Language awareness",
          Voltron: "Yes (explicit language generation objective)",
          "VC-1": "No (pure visual MAE)",
          R3M: "Partial (language reward term)",
          MVP: "No (pure visual MAE)",
        },
        {
          Dimension: "Spatial feature quality",
          Voltron: "Strong (MAE branch)",
          "VC-1": "Very strong (large model + MAE)",
          R3M: "Moderate (ResNet + contrastive)",
          MVP: "Strong (MAE)",
        },
        {
          Dimension: "Open source",
          Voltron: "Yes (weights, code, evaluation suite)",
          "VC-1": "Yes (weights, code, CortexBench)",
          R3M: "Yes (weights, code)",
          MVP: "Yes (weights, code)",
        },
      ],
    },

    // 6. Training Data Requirements
    {
      type: "prose",
      heading: "Training Data Requirements",
      paragraphs: [
        "Voltron's pretraining requires video data paired with natural language descriptions -- this language pairing is what distinguishes it from pure self-supervised approaches like VC-1 or MVP. The primary pretraining dataset is Something-Something-v2, which contains 220,847 labeled video clips of humans performing 174 templated manipulation actions. Each clip is 2-6 seconds long and shows a single manipulation action (pushing, pulling, picking up, putting down, opening, closing, etc.) with a structured natural language description like 'Pushing [something] from left to right' where [something] is replaced with the specific object in that clip.",
        "Something-Something-v2 is particularly well-suited for Voltron because the videos are manipulation-focused (not general activities), the language descriptions are structured and manipulation-relevant (not arbitrary captions), and the short clip length means each video captures a single coherent action. The 174 language templates cover a comprehensive taxonomy of basic manipulation primitives, and the variation across 220K clips ensures the model sees diverse objects, backgrounds, and execution styles for each template.",
        "The authors also explored pretraining on Ego4D data (egocentric daily activity video with Narrator text descriptions) and found that combining Something-Something-v2 with Ego4D produced slightly better representations than either alone. However, Something-Something-v2 alone was sufficient for strong performance, and the marginal benefit of adding Ego4D was smaller than the benefit of the language generation objective itself. This suggests that data quality (manipulation-focused, language-paired) matters more than data volume for Voltron-style pretraining.",
        "For downstream policy training on Voltron features, the data requirements follow the standard pattern for frozen-encoder approaches: you need robot demonstration data with RGB observations (224x224, matching Voltron's input resolution) and action labels in your target format. Voltron features typically reduce downstream data requirements by 15-25% compared to ImageNet features and by even more compared to training from scratch. The language-aware features are especially valuable when the downstream task involves language conditioning (e.g., instruction-following), as the features already encode manipulation-relevant language semantics.",
      ],
    },

    // 7. How Claru Data Integrates
    {
      type: "prose",
      heading: "How Claru Data Integrates with Voltron",
      paragraphs: [
        "Claru provides both the video-language data for Voltron-style representation pretraining and the robot demonstration data for downstream policy training. For pretraining, our video collection pipeline captures short manipulation clips (2-10 seconds) with paired natural language descriptions -- the exact format Voltron's dual-objective training requires. Unlike Something-Something-v2's 174 fixed templates, Claru's descriptions are free-form natural language generated by our annotation team, providing richer and more diverse language grounding.",
        "Our pretraining data extends beyond Something-Something-v2's scope in two important dimensions. First, environmental diversity: Something-Something-v2 clips are largely collected in controlled indoor settings with clean backgrounds, while Claru's videos span kitchens, offices, warehouses, outdoor environments, and industrial settings across 100+ cities. This diversity produces more robust visual features that transfer better to real-world robot deployment scenarios. Second, object diversity: our clips feature a much wider range of objects, tools, and materials than the household items in Something-Something-v2.",
        "For downstream policy training, Claru delivers robot demonstration datasets with Voltron-compatible observations. Our data includes 224x224 RGB frames (matching Voltron's expected resolution), action labels in your target format, and language instructions for language-conditioned tasks. We can deliver data pre-processed with Voltron feature extraction -- running the frozen encoder on our frames and delivering feature vectors alongside raw images -- which eliminates the feature extraction bottleneck during policy training.",
        "We also support teams that want to extend Voltron's pretraining to new domains. Our video-language annotation pipeline can produce the (video_frame, language_description) pairs that Voltron's dual-objective training consumes, covering manipulation domains not represented in Something-Something-v2. For example, we can provide video-language pairs for tool use, bimanual manipulation, deformable object handling, or industrial assembly tasks -- enabling domain-specialized Voltron variants that outperform the generic pretrained model on specific applications.",
      ],
    },

    // 8. References
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "karamcheti-voltron-2023",
          title:
            "Language-Driven Representation Learning for Robotics",
          authors:
            "Karamcheti, Nair, Chen, Kollar, Finn, Sadigh, Liang",
          venue: "RSS 2023 / arXiv 2302.12766",
          year: 2023,
          url: "https://arxiv.org/abs/2302.12766",
        },
        {
          id: "goyal-sthsthv2-2017",
          title:
            "The 'Something Something' Video Database for Learning and Evaluating Visual Common Sense",
          authors: "Goyal, Kahou, Michalski et al.",
          venue: "ICCV 2017",
          year: 2017,
          url: "https://arxiv.org/abs/1706.04261",
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
          id: "radford-clip-2021",
          title:
            "Learning Transferable Visual Models From Natural Language Supervision",
          authors: "Radford, Kim, Hallacy et al.",
          venue: "ICML 2021 / arXiv 2103.00020",
          year: 2021,
          url: "https://arxiv.org/abs/2103.00020",
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
        "How does Voltron differ from VC-1 and other visual encoders?",
      answer:
        "Voltron's distinguishing feature is its dual pretraining objective: masked autoencoding for spatial features plus language generation for semantic features. VC-1 uses only MAE (no language), R3M uses language as a reward signal but not as an explicit generation objective, and MVP uses only MAE. Voltron's language generation branch forces the visual encoder to develop features that capture manipulation-relevant semantics (object identity, action type, spatial relationships), which is why it outperforms these alternatives by 15-25% on tasks requiring higher-level understanding.",
    },
    {
      question:
        "Why does Voltron use Something-Something-v2 instead of larger datasets?",
      answer:
        "Something-Something-v2 is specifically designed for manipulation understanding: 220K short clips of single manipulation actions with structured language descriptions covering 174 action templates. This is more relevant for robot manipulation than general video datasets (Kinetics, Ego4D) because every clip shows a hand-object interaction with a precise language description. The authors showed that this targeted, manipulation-focused dataset with language annotations outperformed larger but less focused datasets for learning manipulation-relevant features.",
    },
    {
      question: "Which Voltron variant should I use?",
      answer:
        "V-Gen (the full dual-objective model with language generation) consistently outperforms V-Cond (single-frame) and V-Dual (frame-pair) across all evaluation tasks. The performance gap is largest on language-conditioned tasks. Use V-Gen unless you have a specific constraint (e.g., no language annotations in your downstream task, in which case V-Dual still outperforms non-language alternatives). For model size, ViT-B provides stronger features than ViT-S if you can afford the compute.",
    },
    {
      question:
        "How much downstream data do I need when using Voltron features?",
      answer:
        "Voltron features reduce downstream data requirements compared to training from scratch or using ImageNet features. On the paper's evaluation suite, Voltron achieved competitive performance with 15-25% less data than prior representations. For typical manipulation tasks, 100-1,000 demonstrations with Voltron features is a practical range. The language-aware features are especially data-efficient for instruction-following tasks because the features already encode manipulation semantics from pretraining.",
    },
    {
      question:
        "Can I extend Voltron's pretraining with my own video-language data?",
      answer:
        "Yes, the code is open-source. Extending pretraining with domain-specific video-language pairs (e.g., industrial manipulation, tool use, deformable objects) can improve features for your target domain. The key requirement is that your data provides paired (video_frame, language_description) annotations covering manipulation-relevant actions. Claru can produce these annotations for custom video corpora, providing the language grounding that Voltron's dual-objective training requires.",
    },
  ],

  // ---------------------------------------------------------------------------
  // CTA
  // ---------------------------------------------------------------------------
  ctaHeading: "Get Video-Language Data for Voltron-Style Pretraining",
  ctaDescription:
    "Tell us about your robot learning application. Claru delivers manipulation video clips with language descriptions for Voltron pretraining, plus robot demonstrations for downstream policy training on Voltron features.",

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
  modelName: "Voltron",
  organization: "Stanford",
  year: 2023,

  inputSpec: {
    observationFormat:
      "224x224 RGB video frames processed as 16x16 patches by ViT (Small or Base scale)",
    actionFormat:
      "Not directly -- Voltron outputs visual feature representations (384-dim ViT-S, 768-dim ViT-B); a separate policy head maps to actions",
    languageConditioning:
      "Language-conditioned visual features via explicit language generation objective during pretraining",
    controlFrequency:
      "N/A (visual representation model); downstream policies typically operate at 5-20 Hz",
  },

  dataVolumeBenchmarks:
    "Voltron was primarily pretrained on Something-Something-v2, containing 220,847 labeled video clips of humans performing 174 templated manipulation actions. Each clip is 2-6 seconds long with a structured natural language description (e.g., 'Pushing [something] from left to right'). The authors also explored adding Ego4D data and found that the combination produced slightly stronger features than either dataset alone. For pretraining, each training sample consists of a video frame (or frame pair, depending on the variant) at 224x224 resolution plus the associated language description. The dual-objective training (MAE + language generation) processes these samples with both a patch reconstruction loss and a next-token language generation loss. On the custom evaluation suite spanning 5 robot learning tasks, Voltron's language-driven representations outperformed prior state-of-the-art (R3M, MVP, CLIP features) by 15-25%, with the largest improvements on tasks requiring semantic understanding. For downstream policy training on Voltron features, the standard range is 100-1,000 demonstrations per task, with Voltron features enabling competitive performance with less data than alternative visual backbones.",

  trainingRecipe:
    "Voltron uses a Vision Transformer (ViT-S or ViT-B, 22-86M parameters) with 16x16 pixel patches as the visual encoder, trained with two simultaneous objectives. The masked autoencoding (MAE) branch randomly masks 75% of image patches and trains a lightweight decoder to reconstruct the missing pixels from the encoder's visible-patch representations, forcing the encoder to develop strong spatial features. The language generation branch uses a lightweight autoregressive text decoder conditioned on the visual encoder's output to produce natural language descriptions of the scene (using Something-Something-v2's structured labels as targets). Both branches share the same visual encoder, so gradient signals from both objectives shape the learned representations. The result is features that capture fine-grained spatial detail (from MAE) and high-level manipulation semantics (from language generation). Three variants are offered: V-Cond (single-frame + language), V-Dual (frame-pair + MAE), and V-Gen (full dual-objective with language generation). V-Gen consistently produces the strongest representations. After pretraining, the encoder is frozen and a task-specific policy head is trained on robot demonstration data.",

  claruIntegration:
    "Claru provides both video-language data for Voltron-style pretraining and robot demonstrations for downstream policy training. For pretraining, we deliver short manipulation video clips (2-10 seconds) with paired free-form natural language descriptions -- extending beyond Something-Something-v2's 174 fixed templates to richer, more diverse language grounding. Our clips span manipulation scenarios in kitchens, offices, warehouses, and industrial settings across 100+ cities, providing environmental and object diversity that produces more robust features for real-world deployment. For downstream policy training, we deliver 224x224 RGB frames with action labels and optional pre-extracted Voltron features. For teams extending Voltron to new domains, our video-language annotation pipeline produces the paired annotations that Voltron's dual-objective training consumes, covering tool use, bimanual manipulation, deformable object handling, and other domains not represented in Something-Something-v2.",

  keyPapers: [
    {
      id: "karamcheti-voltron-2023",
      title: "Language-Driven Representation Learning for Robotics",
      authors: "Karamcheti, Nair, Chen, Kollar, Finn, Sadigh, Liang",
      venue: "RSS 2023 / arXiv 2302.12766",
      year: 2023,
      url: "https://arxiv.org/abs/2302.12766",
    },
    {
      id: "goyal-sthsthv2-2017",
      title:
        "The 'Something Something' Video Database for Learning and Evaluating Visual Common Sense",
      authors: "Goyal, Kahou, Michalski et al.",
      venue: "ICCV 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1706.04261",
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
      id: "radford-clip-2021",
      title:
        "Learning Transferable Visual Models From Natural Language Supervision",
      authors: "Radford, Kim, Hallacy et al.",
      venue: "ICML 2021 / arXiv 2103.00020",
      year: 2021,
      url: "https://arxiv.org/abs/2103.00020",
    },
  ],
};

export default data;
