import type { ModelPageData } from "../types";

const data: ModelPageData = {
  slug: "theia",
  metaTitle: "Training Data for Theia | Data Requirements & Formats | Claru",
  metaDescription:
    "Complete guide to Theia training data requirements: multi-teacher distillation from DINOv2, CLIP, SAM, and Depth Anything into a compact robot vision backbone.",
  primaryKeyword: "theia training data",
  secondaryKeywords: [
    "theia data requirements",
    "theia dataset format",
    "data for theia",
    "theia fine-tuning data",
    "theia vision foundation model",
    "theia robot learning distillation",
  ],
  canonicalPath: "/models/theia",
  h1: "Training Data for Theia",
  heroSubtitle:
    "Everything you need to know about Theia's data requirements -- the multi-teacher distillation model from the Boston Dynamics AI Institute that compresses DINOv2, CLIP, SAM, and Depth Anything into a compact vision backbone trained on just 1.2M images in ~150 GPU hours.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Models", href: "/models" },
    { label: "Theia", href: "/models/theia" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Theia?",
      paragraphs: [
        "Theia is a vision foundation model for robot learning developed by the Boston Dynamics AI Institute (now The AI Institute), published at CoRL 2024 by Jinghuan Shang, Karl Schmeckpeper, Brandon May, Maria Vittoria Minniti, Tarik Kelestemur, David Watkins, and Laura Herlant (arXiv 2407.20179). Theia addresses a fundamental problem in robot vision: individual vision foundation models (VFMs) like DINOv2, CLIP, SAM, and Depth Anything each excel at different visual capabilities, but running all of them at inference time is computationally prohibitive for real-time robot control.",
        "Theia solves this by distilling the knowledge from multiple teacher VFMs into a single compact student model. The student -- a DeiT (Data-efficient Image Transformer) backbone -- learns to produce feature representations that simultaneously approximate the outputs of all teacher models. The result is a small model (available in Tiny, Small, and Base variants) that captures the diverse visual knowledge of its teachers: semantic understanding from CLIP, spatial features from DINOv2, segmentation awareness from SAM, and geometric structure from Depth Anything.",
        "The efficiency gains are dramatic. Theia-Small and Theia-Base break scores of 80 on CortexBench -- a comprehensive robotics evaluation suite spanning 17 tasks across manipulation, navigation, and locomotion -- while using only a fraction of the inference computation that individual teacher models require. On real-world robot tasks tested with a WidowX 250s arm and a Boston Dynamics Spot, Theia representations outperformed each individual teacher model and prior robot learning representations.",
        "For robotics teams, Theia represents a practical path to deploying rich visual representations on compute-constrained platforms. Rather than choosing one VFM (and accepting its weaknesses), or running multiple VFMs (and accepting the latency), Theia provides a single efficient backbone that captures the strengths of all its teachers -- trained on just 1.2 million ImageNet images in approximately 150 GPU hours on NVIDIA H100 hardware.",
      ],
    },
    {
      type: "stats",
      heading: "Theia Key Metrics",
      stats: [
        { value: "~86M", label: "Parameters (Theia-Base)" },
        { value: "1.2M", label: "Training images (ImageNet)" },
        { value: "~150", label: "GPU hours (H100) to train" },
        { value: "4+", label: "Teacher VFMs distilled" },
        { value: "80+", label: "CortexBench score (Theia-B)" },
        { value: "4", label: "Real-world robot tasks validated" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Theia Input/Output Specification",
      columns: ["Parameter", "Specification"],
      rows: [
        {
          Parameter: "Input Format",
          Specification:
            "224x224 RGB images (standard ViT patch size 16)",
        },
        {
          Parameter: "Output Format",
          Specification:
            "Dense feature maps (not actions) -- used as visual backbone for downstream policy learning",
        },
        {
          Parameter: "Model Variants",
          Specification:
            "Theia-Tiny (DeiT-Tiny backbone), Theia-Small (DeiT-Small), Theia-Base (DeiT-Base, ~86M params)",
        },
        {
          Parameter: "Teacher Models",
          Specification:
            "DINOv2, CLIP, SAM (Segment Anything), Depth Anything, ViT variants",
        },
        {
          Parameter: "Language Conditioning",
          Specification:
            "Not directly -- Theia is a vision encoder; language conditioning happens in the downstream policy head",
        },
        {
          Parameter: "Inference Speed",
          Specification:
            "Real-time capable on edge GPUs (single forward pass, no ensemble required)",
        },
      ],
    },
    {
      type: "prose",
      heading: "Architecture and Key Innovations",
      paragraphs: [
        "Theia's architecture has two components: a visual encoder (the student DeiT backbone) and a set of feature translators used only during distillation training. The visual encoder processes 224x224 RGB images through a standard Vision Transformer with 16x16 patches, producing a set of feature tokens. During training, lightweight feature translator heads map these tokens to the representation space of each teacher model. After training, only the visual encoder is kept -- the translators are discarded, and the encoder's latent representations are used directly as input to downstream robot policy networks.",
        "The multi-teacher distillation objective is the key innovation. Each teacher model provides a target representation for the same input image: DINOv2 provides self-supervised visual features capturing object structure and spatial layout; CLIP provides semantically rich features aligned with language; SAM provides segmentation-aware features that encode object boundaries; and Depth Anything provides geometric features encoding 3D structure from monocular images. Theia minimizes the total distillation loss across all teachers simultaneously, forcing the student to learn a representation that encodes all these visual capabilities in a single forward pass.",
        "The authors evaluated multiple distillation configurations, denoted by suffixes like '-cdiv' (CLIP, DINOv2, ImageNet-ViT). The best-performing variants distill from the most diverse teacher sets, confirming that teacher diversity -- not just teacher quality -- drives downstream robot performance. This finding has implications for data curation: the training images should cover the full range of visual scenarios that the teachers specialize in.",
        "A notable property of Theia is its training efficiency. The 1.2 million training images come from ImageNet -- a standard computer vision dataset -- and training completes in approximately 150 GPU hours on NVIDIA H100 GPUs. This makes Theia reproducible for academic labs and practical for companies that want to customize the model by adding domain-specific teacher models or training on domain-specific image data.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Theia vs Related Vision Backbones for Robotics",
      columns: ["Dimension", "Theia-Base", "VC-1 (ViT-L)", "Voltron", "R3M", "CLIP (ViT-B)"],
      rows: [
        {
          Dimension: "Parameters",
          "Theia-Base": "~86M",
          "VC-1 (ViT-L)": "~307M",
          Voltron: "~86M (ViT-Small)",
          R3M: "~50M (ResNet-50)",
          "CLIP (ViT-B)": "~86M",
        },
        {
          Dimension: "Training Data",
          "Theia-Base": "1.2M ImageNet images",
          "VC-1 (ViT-L)": "4.3M+ images (Ego4D + IN)",
          Voltron: "220K+ videos (Sth-Sth-v2)",
          R3M: "Ego4D videos",
          "CLIP (ViT-B)": "400M image-text pairs",
        },
        {
          Dimension: "Training Method",
          "Theia-Base": "Multi-teacher distillation",
          "VC-1 (ViT-L)": "Masked autoencoding (MAE)",
          Voltron: "MAE + language alignment",
          R3M: "Time-contrastive + language",
          "CLIP (ViT-B)": "Contrastive image-text",
        },
        {
          Dimension: "Visual Capabilities",
          "Theia-Base": "Semantics + spatial + depth + segmentation",
          "VC-1 (ViT-L)": "Egocentric spatial features",
          Voltron: "Temporal + language-aligned",
          R3M: "Temporal + language-aligned",
          "CLIP (ViT-B)": "Semantics + language",
        },
        {
          Dimension: "CortexBench Avg",
          "Theia-Base": "80+",
          "VC-1 (ViT-L)": "~75 (best prior PVR)",
          Voltron: "Below VC-1 on average",
          R3M: "Below VC-1 on average",
          "CLIP (ViT-B)": "Variable across tasks",
        },
      ],
    },
    {
      type: "prose",
      heading: "Training Data Requirements",
      paragraphs: [
        "Theia's distillation-based training has fundamentally different data requirements from models that learn representations from scratch. Because the teacher models (DINOv2, CLIP, SAM, Depth Anything) were each pretrained on massive datasets, Theia's student only needs enough images to learn the mapping from pixels to the teachers' representation spaces. The original Theia used 1.2 million images from ImageNet-1K -- a small fraction of what any individual teacher was trained on.",
        "The key data property is visual diversity, not volume. The training images must span the range of visual scenarios the teachers handle: cluttered indoor scenes for SAM's segmentation, natural images for CLIP's semantics, varied depth arrangements for Depth Anything's geometry, and structured object layouts for DINOv2's spatial features. ImageNet covers these reasonably well for general-purpose distillation, but domain-specific deployments benefit from adding domain-representative images.",
        "For robotics-specific customization, the Theia authors showed that adding robot workspace images to the training set improved downstream manipulation performance. This makes intuitive sense: while the teachers encode general visual knowledge, the student benefits from seeing the specific visual distribution it will encounter at deployment -- overhead camera views, tabletop scenes, gripper-in-frame observations, warehouse shelves, etc.",
        "The downstream policy that sits on top of Theia features also has its own data requirements: standard robot demonstration data (observation-action pairs) collected via teleoperation. The authors validated on four real-world tasks: door opening, pick-and-place, and toy-microwave cooking on a WidowX 250s arm, and drawer opening on a Boston Dynamics Spot. Each task used 50-200 demonstrations for policy training, with Theia features as input. This is substantially less demonstration data than end-to-end VLA models require because the visual encoder is already trained.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Data Integrates with Theia",
      paragraphs: [
        "Claru supports both phases of the Theia pipeline: distillation pretraining of the vision backbone and downstream policy fine-tuning on robot demonstrations. For distillation, we provide diverse visual datasets -- indoor scenes, manipulation workspaces, warehouse environments, household settings -- that augment ImageNet with domain-specific coverage. This is particularly valuable for teams deploying Theia in environments underrepresented in ImageNet, such as industrial facilities, surgical settings, or outdoor construction sites.",
        "For downstream policy training, Claru collects teleoperated robot demonstrations on client-specified hardware at 224x224 resolution (Theia's input size). Since Theia provides the visual backbone, the demonstration data requirements are modest -- typically 50-200 demonstrations per task -- but quality matters enormously. Each demonstration needs consistent camera placement, clean action labels, and representative task variability. Our collection QA pipeline enforces these standards.",
        "Claru can also help teams extend Theia's teacher set. If your deployment requires visual capabilities not covered by the default teachers -- for example, thermal imaging for welding robots, or X-ray features for inspection systems -- we provide the diverse training images needed to distill additional teacher models alongside the existing ones. Our data delivery includes pre-computed teacher model features when requested, eliminating the need for clients to run expensive teacher inference during training.",
        "All data is delivered with complete provenance documentation, camera calibration metadata, and format compatibility with the open-source Theia codebase at github.com/bdaiinstitute/theia. We support both the distillation training format (images with teacher feature targets) and the downstream policy format (RLDS/HDF5 with action labels).",
      ],
    },
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
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
        {
          id: "oquab-dinov2-2023",
          title:
            "DINOv2: Learning Robust Visual Features without Supervision",
          authors: "Oquab et al.",
          venue: "arXiv 2304.07193",
          year: 2023,
          url: "https://arxiv.org/abs/2304.07193",
        },
        {
          id: "kirillov-sam-2023",
          title: "Segment Anything",
          authors: "Kirillov et al.",
          venue: "ICCV 2023 / arXiv 2304.02643",
          year: 2023,
          url: "https://arxiv.org/abs/2304.02643",
        },
        {
          id: "yang-depthanything-2024",
          title: "Depth Anything: Unleashing the Power of Large-Scale Unlabeled Data",
          authors: "Yang et al.",
          venue: "CVPR 2024 / arXiv 2401.10891",
          year: 2024,
          url: "https://arxiv.org/abs/2401.10891",
        },
        {
          id: "majumdar-vc1-2023",
          title:
            "Where Are We in the Search for an Artificial Visual Cortex for Embodied Intelligence?",
          authors: "Majumdar et al.",
          venue: "NeurIPS 2023 / arXiv 2303.18240",
          year: 2023,
          url: "https://arxiv.org/abs/2303.18240",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "What data format does Theia require for distillation training?",
      answer:
        "Theia's distillation training requires 224x224 RGB images paired with feature targets from each teacher model (DINOv2, CLIP, SAM, Depth Anything). The original model used 1.2M ImageNet images. The open-source codebase at github.com/bdaiinstitute/theia handles teacher feature extraction and training. Claru can provide both the diverse training images and pre-computed teacher features to accelerate your pipeline.",
    },
    {
      question:
        "How much data do I need to fine-tune a robot policy on top of Theia?",
      answer:
        "The Theia authors validated with 50-200 demonstrations per task on real-world WidowX and Spot robots. Because Theia provides a pretrained visual backbone, the downstream policy only needs to learn the mapping from features to actions -- substantially less data than end-to-end models like RT-2 or OpenVLA require. For multi-task policies, 500-2,000 demonstrations across 5-10 tasks is a reasonable starting point.",
    },
    {
      question: "How does Theia compare to just using DINOv2 or CLIP directly?",
      answer:
        "Individual VFMs each excel at different visual capabilities but have blind spots. CLIP has strong semantics but weak spatial precision. DINOv2 has strong spatial features but no language alignment. SAM understands boundaries but not semantics. Theia distills all of them into one model that consistently outperforms any individual teacher on CortexBench robotics tasks, with the same computational cost as running a single ViT-Base model.",
    },
    {
      question: "Can I add custom teacher models to Theia's distillation?",
      answer:
        "Yes. Theia's distillation framework is modular -- you add a new teacher by providing its feature extraction function and a corresponding translator head. The authors showed that more diverse teachers consistently improve downstream performance. Claru can provide the domain-specific training images needed to make custom teacher additions effective, such as industrial scene data for manufacturing robots or medical imaging data for surgical applications.",
    },
    {
      question: "What hardware do I need to run Theia at inference time?",
      answer:
        "Theia-Base (~86M parameters) runs in real-time on edge GPUs including NVIDIA Jetson Orin and similar platforms. This is one of its key advantages over approaches that require running multiple VFMs or large VLM backbones. The single-forward-pass design means latency is comparable to running any standard ViT-Base model -- typically under 10ms on an A100 and under 50ms on Jetson hardware.",
    },
  ],
  ctaHeading: "Get Data for Theia-Style Vision Backbone Training",
  ctaDescription:
    "Tell us about your robot vision project and we will deliver the diverse image data for distillation pretraining and the robot demonstrations for downstream policy fine-tuning.",
  relatedGlossaryTerms: [
    "foundation-model-robotics",
    "visual-representation-learning",
    "imitation-learning",
    "transfer-learning",
  ],
  relatedGuidePages: [
    "how-to-create-action-labels-for-vla",
    "how-to-collect-teleoperation-data",
  ],
  relatedSolutionSlugs: ["vla-training-data"],
  modelName: "Theia",
  organization: "The AI Institute (Boston Dynamics AI Institute)",
  year: 2024,
  inputSpec: {
    observationFormat: "224x224 RGB images (standard ViT patch-16 input)",
    actionFormat:
      "Not directly -- Theia is a visual encoder producing dense feature maps for downstream policy heads",
    languageConditioning:
      "Not at the encoder level; language conditioning is handled by the downstream policy",
    controlFrequency:
      "N/A (representation model); downstream policies typically operate at 5-50 Hz",
  },
  dataVolumeBenchmarks:
    "Theia was trained on 1.2 million images from ImageNet-1K using multi-teacher distillation from DINOv2, CLIP, SAM, Depth Anything, and ViT variants. Training completes in approximately 150 GPU hours on NVIDIA H100 hardware -- dramatically more efficient than training any teacher model from scratch. Theia-Base (~86M parameters) achieved scores above 80 on CortexBench, outperforming the prior best pre-trained visual representation (VC-1 at ~307M parameters). Real-world validation on 4 tasks (door opening, pick-and-place, toy-microwave cooking on WidowX 250s, drawer opening on Boston Dynamics Spot) used 50-200 demonstrations per task for downstream policy training. The key finding is that teacher diversity matters more than training data volume -- distilling from 4+ diverse VFMs on 1.2M images outperforms single-teacher distillation on the same data.",
  trainingRecipe:
    "Multi-teacher distillation with a DeiT backbone (Tiny/Small/Base variants). The student model processes 224x224 RGB images through a Vision Transformer with 16x16 patches. Lightweight feature translator heads map the student's token representations to each teacher's representation space. The training objective minimizes the sum of distillation losses across all teachers (DINOv2 for spatial features, CLIP for semantics, SAM for segmentation awareness, Depth Anything for geometry). Training uses standard ImageNet-1K images (1.2M) and converges in ~150 GPU hours on H100s. After training, the translator heads are discarded and only the visual encoder is deployed. Downstream robot policies are trained via behavioral cloning on the encoder's frozen or fine-tuned features, requiring 50-200 demonstrations per task.",
  claruIntegration:
    "Claru supports both phases of the Theia pipeline. For distillation pretraining, we provide diverse visual datasets -- indoor manipulation scenes, warehouse environments, household settings -- that augment ImageNet with domain-specific coverage. This is valuable for deployments in environments underrepresented in ImageNet such as industrial facilities or outdoor construction. For downstream policy training, we collect teleoperated demonstrations on client-specified hardware at 224x224 resolution. Since Theia provides the visual backbone, demonstration requirements are modest (50-200 per task) but quality-critical. We can also provide pre-computed teacher features to eliminate expensive teacher inference during training. All data includes camera calibration metadata and is compatible with the open-source Theia codebase.",
  keyPapers: [
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
    {
      id: "oquab-dinov2-2023",
      title:
        "DINOv2: Learning Robust Visual Features without Supervision",
      authors: "Oquab et al.",
      venue: "arXiv 2304.07193",
      year: 2023,
      url: "https://arxiv.org/abs/2304.07193",
    },
    {
      id: "kirillov-sam-2023",
      title: "Segment Anything",
      authors: "Kirillov et al.",
      venue: "ICCV 2023 / arXiv 2304.02643",
      year: 2023,
      url: "https://arxiv.org/abs/2304.02643",
    },
    {
      id: "yang-depthanything-2024",
      title: "Depth Anything: Unleashing the Power of Large-Scale Unlabeled Data",
      authors: "Yang et al.",
      venue: "CVPR 2024 / arXiv 2401.10891",
      year: 2024,
      url: "https://arxiv.org/abs/2401.10891",
    },
    {
      id: "majumdar-vc1-2023",
      title:
        "Where Are We in the Search for an Artificial Visual Cortex for Embodied Intelligence?",
      authors: "Majumdar et al.",
      venue: "NeurIPS 2023 / arXiv 2303.18240",
      year: 2023,
      url: "https://arxiv.org/abs/2303.18240",
    },
  ],
};

export default data;
