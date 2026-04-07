import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "vision-transformer",
  termSlug: "vision-transformer",
  category: "models-architectures",
  metaTitle: "Vision Transformer (ViT) — Definition & Training Data | Claru",
  metaDescription: "The Vision Transformer (ViT) applies the transformer architecture to image recognition by treating images as sequences of patches. Learn how ViT works, its role in robotics, training data needs, and key papers.",
  primaryKeyword: "vision transformer",
  secondaryKeywords: ["ViT model", "visual transformer", "image transformer", "patch embedding", "vision transformer robotics", "ViT backbone"],
  canonicalPath: "/glossary/vision-transformer",
  h1: "Vision Transformer (ViT): Definition, Applications, and Training Data Requirements",
  heroSubtitle: "The Vision Transformer (ViT) applies the transformer architecture — originally designed for natural language processing — to image recognition by splitting images into fixed-size patches and processing them as a sequence. ViT and its descendants (DINOv2, MAE, SigLIP) now serve as the default visual backbone for robotics foundation models. This page covers the ViT architecture, pretraining strategies, the role of training data scale and diversity, and applications in physical AI.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Vision Transformer (ViT)", href: "/glossary/vision-transformer" },
  ],
  sections: [],
  faqs: [
    {
      question: "How does a Vision Transformer process images?",
      answer: "A Vision Transformer divides an input image into a grid of fixed-size patches (typically 14x14 or 16x16 pixels). Each patch is linearly projected into a vector (the patch embedding), and a learnable position embedding is added to encode spatial location. The resulting sequence of patch embeddings, prepended with a special CLS (classification) token, is fed into a standard transformer encoder consisting of multi-head self-attention layers and feed-forward networks. The self-attention mechanism allows every patch to attend to every other patch, capturing global relationships across the image from the first layer — unlike CNNs, which build global understanding only through successive layers of local convolutions. The CLS token's output representation serves as the global image representation for classification or downstream tasks. ViT-Base has 86M parameters with 12 transformer layers, ViT-Large has 307M with 24 layers, and ViT-Huge has 632M with 32 layers.",
    },
    {
      question: "Why are Vision Transformers preferred over CNNs for robotics foundation models?",
      answer: "ViTs have three advantages for robotics. First, they scale better with data and compute — ViT performance improves log-linearly with pretraining data size, while CNNs saturate earlier. This makes ViTs ideal for the pretrain-on-billions-finetune-on-thousands paradigm used in robot learning. Second, ViTs produce patch-level features with spatial correspondence, making it easy to extract both global scene understanding (from the CLS token) and local spatial features (from individual patch tokens) that robotic manipulation needs. Third, ViTs share the transformer architecture with the language models used in vision-language-action models, enabling simpler integration — RT-2, OpenVLA, and pi-zero all use ViT visual encoders that feed directly into transformer-based action decoders. The result is a unified architecture from pixels to actions. DINOv2 ViTs are the current default visual backbone for robotics, providing strong zero-shot features for depth estimation, segmentation, and manipulation policy learning.",
    },
    {
      question: "What pretraining strategies work best for ViTs used in robotics?",
      answer: "Three pretraining strategies have proven effective for robotics. Self-supervised pretraining with DINOv2 (Oquab et al., 2023) trains the ViT to produce consistent representations under different image augmentations without any labels, learning features that capture object structure, shape, and spatial relationships. DINOv2 features transfer well to diverse robotics tasks including depth estimation (Depth Anything), pose estimation (ViTPose), and manipulation policy learning. Contrastive language-image pretraining with CLIP or SigLIP aligns visual and text representations, enabling zero-shot recognition and language-conditioned robot control. Masked autoencoder (MAE) pretraining trains the ViT to reconstruct masked image patches, learning detailed spatial features useful for dense prediction tasks. For robotics specifically, R3M pretrained a ViT on egocentric video with time-contrastive and video-language alignment objectives, producing representations that transferred better to manipulation than generic ImageNet pretraining.",
    },
    {
      question: "How much training data does a ViT need for effective pretraining?",
      answer: "The original ViT paper (Dosovitskiy et al., 2021) showed that ViTs require substantially more pretraining data than CNNs to achieve comparable performance. ViT trained on ImageNet-1K (1.3M images) underperformed CNNs, but ViT trained on ImageNet-21K (14M images) matched CNNs, and ViT trained on JFT-300M (300M images) surpassed all CNNs. DINOv2 was pretrained on LVD-142M, a curated dataset of 142 million images. CLIP was trained on 400 million image-text pairs. The data-hungry nature of ViTs is a consequence of the architecture: unlike CNNs, which have built-in inductive biases for spatial locality and translation equivariance, ViTs must learn these properties from data. More data means more opportunities to learn these visual priors. For robotics, this means that the quality of the pretrained ViT backbone depends heavily on the scale and diversity of its pretraining data — which is why the largest, most diverse pretrained models (DINOv2-g, SigLIP-400M) consistently produce the best robot learning results.",
    },
    {
      question: "What are the main Vision Transformer variants used in robotics today?",
      answer: "The primary ViT variants in current robotics systems are: DINOv2 (self-supervised ViT providing strong general visual features, used as the backbone for Depth Anything V2, ViTPose, and many manipulation policies), SigLIP (efficient contrastive vision-language model used in RT-2 and PaLI-based robot policies), MAE (masked autoencoder for dense spatial features, used in some manipulation architectures), and EVA-02 (scaled ViT with improved training recipe, used as the vision backbone in several VLA models). For real-time robotics, the ViT-S (Small) and ViT-B (Base) variants provide the best accuracy-speed tradeoff. For offline data enrichment and training, ViT-L (Large) and ViT-g (Giant) provide maximum feature quality at the cost of slower inference. The choice of variant depends on whether the ViT runs at deployment time (favoring smaller models) or only during training and data processing (favoring larger models).",
    },
  ],
  ctaHeading: "Need Visual Training Data for ViT-Based Robot Policies?",
  ctaDescription: "Claru provides diverse, high-quality video datasets that complement ViT-pretrained backbones — the environmental and object diversity that fine-tuning needs to bridge from general vision to robot-specific perception.",
  relatedGlossaryTerms: ["diffusion-transformer", "vitpose", "depth-anything-v2", "sam"],
  relatedGuidePages: [],
  relatedSolutionSlugs: ["egocentric-video-data"],

  longDefinition: `The Vision Transformer (ViT) is a neural network architecture that applies the transformer model — originally developed for natural language processing (Vaswani et al., 2017) — to image recognition tasks. Introduced by Dosovitskiy et al. (2021) in the paper "An Image is Worth 16x16 Words," ViT demonstrated that a pure transformer architecture, without any convolutional layers, could match or exceed the performance of the best convolutional neural networks (CNNs) when pretrained on sufficiently large datasets.

The key insight of ViT is that an image can be treated as a sequence of tokens, analogous to words in a sentence. The image is divided into a grid of non-overlapping patches (typically 16x16 pixels for a 224x224 image, producing 196 patches). Each patch is flattened and linearly projected into a d-dimensional embedding vector. Learnable position embeddings are added to encode the spatial location of each patch within the image. A special CLS (classification) token is prepended to the sequence. This sequence of patch embeddings is then processed by a standard transformer encoder consisting of alternating layers of multi-head self-attention and position-wise feed-forward networks, with layer normalization and residual connections.

The self-attention mechanism is what gives ViTs their distinctive capabilities. Every patch attends to every other patch in every layer, enabling the model to capture long-range dependencies from the first layer. A patch in the top-left corner of the image can directly attend to a patch in the bottom-right corner, something that a CNN can only achieve through many layers of convolution. This global receptive field is particularly valuable for robotics perception, where understanding the spatial relationship between distant objects (a tool on a table and a target location on a shelf) is essential for manipulation planning.

ViTs have become the dominant visual backbone in robotics for several reasons. The transformer architecture scales efficiently with model size and data volume — larger ViTs trained on more data consistently produce better features, following scaling laws similar to those observed in language models. ViTs share the same architecture as the language models used in vision-language-action (VLA) systems, enabling seamless integration: the visual patch tokens from a ViT encoder can be directly concatenated with language tokens and processed by a transformer decoder that outputs robot actions. This architectural uniformity simplifies model design and training compared to hybrid CNN-transformer architectures.

The pretraining recipe for ViTs determines the quality of the resulting visual features. Self-supervised methods like DINO (Caron et al., 2021) and its successor DINOv2 (Oquab et al., 2023) train ViTs without any labels by requiring the model to produce consistent representations under different augmentations of the same image. DINOv2 features have been shown to capture rich semantic and geometric information: they can be used for depth estimation, segmentation, correspondence matching, and image retrieval without any task-specific fine-tuning. Contrastive vision-language pretraining with CLIP (Radford et al., 2021) and SigLIP (Zhai et al., 2023) aligns visual and text embeddings, enabling zero-shot recognition and language-conditioned robot control. Both pretraining approaches produce ViT backbones that transfer strongly to robotics downstream tasks.`,

  historicalContext: `The Vision Transformer emerged from the convergence of two research threads: the transformer architecture from NLP and the observation that convolutions might not be necessary for visual recognition. The transformer was introduced by Vaswani et al. (2017) for machine translation, with its self-attention mechanism enabling effective modeling of long-range dependencies in sequences. Researchers quickly explored applying transformers to vision: DETR (Carion et al., 2020) used a transformer decoder for object detection on top of CNN features, and iGPT (Chen et al., 2020) applied GPT-style autoregressive modeling directly to pixel sequences.

ViT (Dosovitskiy et al., 2021) was the breakthrough that proved a pure transformer, with no convolution at all, could match the best CNNs when given enough training data. The paper showed a clear scaling relationship: ViT underperformed CNNs on ImageNet-1K (1.3M images) but matched them on ImageNet-21K (14M images) and surpassed them on JFT-300M (300M images). This established that ViTs have weaker inductive biases than CNNs but compensate through data-driven learning.

The self-supervised revolution rapidly followed. DINO (Caron et al., 2021) showed that self-supervised ViTs learn features with emergent properties: attention maps that naturally segment objects, features that capture semantic similarity, and representations that transfer well to diverse downstream tasks. DINOv2 (Oquab et al., 2023) scaled this to 142M images and produced what many consider the best general-purpose visual features available. In parallel, CLIP (Radford et al., 2021) demonstrated that contrastive vision-language pretraining on 400M image-text pairs from the internet produced ViTs with remarkable zero-shot recognition ability.

For robotics, the adoption of ViT backbones accelerated with R3M (Nair et al., 2022), which showed that ViTs pretrained on egocentric video transferred better to manipulation than ImageNet-pretrained models. RT-2 (Brohan et al., 2023) used a PaLI-based ViT-language model for robot control, demonstrating that ViT-pretrained visual understanding could be directly connected to robot action generation. Today, virtually all leading robot learning systems — OpenVLA, pi-zero, GR-1, HPT — use ViT-family visual encoders as their perception backbone.`,

  practicalImplications: `For robotics teams, the Vision Transformer is not a model you build from scratch but a pretrained component you select and integrate. The key decisions are which pretrained ViT to use, whether to freeze or fine-tune it, and how to connect it to the rest of the robot learning pipeline.

Selecting the right pretrained ViT depends on the downstream task. For general manipulation with language conditioning, SigLIP or CLIP-pretrained ViTs provide the vision-language alignment needed for instruction following. For tasks requiring fine-grained spatial understanding (grasping, precise placement), DINOv2-pretrained ViTs provide richer spatial features. For tasks requiring dense prediction (depth estimation, segmentation), MAE-pretrained ViTs provide the strongest dense features. Many leading systems use DINOv2 as the default because its features support the widest range of downstream tasks.

Freezing versus fine-tuning the ViT backbone is a crucial decision. Freezing (using the pretrained ViT as a fixed feature extractor) preserves the broad visual knowledge from pretraining and prevents overfitting on small robot datasets. Fine-tuning (updating ViT weights during robot policy training) adapts the features to the specific visual domain but risks catastrophic forgetting if the robot dataset is small. The common compromise is partial fine-tuning: freezing early ViT layers that capture general visual features while fine-tuning later layers that capture task-relevant abstractions. Parameter-efficient methods like LoRA enable fine-tuning with minimal additional parameters, providing adaptation without overfitting risk.

The ViT model size affects both training data requirements and deployment speed. ViT-S (22M parameters) runs at 100+ FPS on consumer GPUs and works well with limited fine-tuning data. ViT-B (86M) provides better features at 50+ FPS. ViT-L (307M) provides the best commonly-used features but requires 15+ GB GPU memory and runs at 10-30 FPS. For real-time robot control at 10-50 Hz, ViT-S or ViT-B is practical; for offline data processing and batch inference, ViT-L provides maximum quality.

Claru's video datasets are designed to complement ViT-pretrained backbones. Our data provides the domain-specific visual diversity (real-world manipulation environments, diverse objects, varied lighting) that bridges the gap between the general visual features learned during ViT pretraining and the specific visual patterns encountered in robot deployment.`,

  commonMisconceptions: [
    {
      misconception: "Vision Transformers are always better than CNNs for robotics applications.",
      correction: "ViTs outperform CNNs when pretrained on large-scale data, but at small data scales or for specific architectures, CNNs can be more efficient. ConvNeXt, a modernized CNN, matches ViT performance at similar compute budgets. For edge deployment on resource-constrained robot hardware (embedded GPUs with 2-4GB memory), efficient CNN architectures like EfficientNet or MobileNet may be more practical than ViTs. The ViT advantage is strongest when leveraging large pretrained models (DINOv2-L, SigLIP-400M) that have learned rich visual representations from billions of images — it is the pretraining scale that matters, not the architecture in isolation.",
    },
    {
      misconception: "ViTs process images without any notion of spatial structure — they treat patches as an unordered set.",
      correction: "While the self-attention mechanism is permutation-equivariant (it does not inherently know patch order), ViTs use position embeddings that encode the 2D spatial location of each patch. These position embeddings, either learned or sinusoidal, provide the model with explicit spatial information. Experiments have shown that ViTs learn meaningful spatial representations: attention maps in intermediate layers correspond to semantically meaningful regions, and the learned position embeddings capture 2D grid structure. The spatial understanding of ViTs is learned from data through position embeddings rather than hard-coded through convolution kernels, which is why they require more data but ultimately achieve more flexible spatial reasoning.",
    },
    {
      misconception: "You need to pretrain your own ViT for robotics — generic pretrained models do not work well.",
      correction: "Generic pretrained ViTs (DINOv2, CLIP) transfer remarkably well to robotics tasks without robotics-specific pretraining. DINOv2 features support strong zero-shot depth estimation, segmentation, and correspondence matching in robot environments. CLIP features enable zero-shot object recognition and language-conditioned grasping. Robotics-specific pretraining (R3M, VC-1) provides modest additional gains for manipulation tasks specifically, but the benefit over generic DINOv2 is typically 5-15% in task success rate — meaningful but not essential. For most teams, using off-the-shelf DINOv2 or SigLIP and investing effort in fine-tuning and data collection is more practical than pretraining a custom ViT, which requires millions of GPU-hours.",
    },
  ],

  keyPapers: [
    {
      id: "dosovitskiy-vit-2021",
      title: "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale",
      authors: "Dosovitskiy et al.",
      venue: "ICLR 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2010.11929",
    },
    {
      id: "oquab-dinov2-2023",
      title: "DINOv2: Learning Robust Visual Features without Supervision",
      authors: "Oquab et al.",
      venue: "TMLR 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2304.07193",
    },
    {
      id: "radford-clip-2021",
      title: "Learning Transferable Visual Models From Natural Language Supervision",
      authors: "Radford et al.",
      venue: "ICML 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2103.00020",
    },
    {
      id: "he-mae-2022",
      title: "Masked Autoencoders Are Scalable Vision Learners",
      authors: "He et al.",
      venue: "CVPR 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2111.06377",
    },
    {
      id: "caron-dino-2021",
      title: "Emerging Properties in Self-Supervised Vision Transformers",
      authors: "Caron et al.",
      venue: "ICCV 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2104.14294",
    },
  ],

  claruRelevance: `Claru's video datasets complement ViT-pretrained backbones by providing the domain-specific visual diversity needed during fine-tuning. While DINOv2 and CLIP learn excellent general visual features from internet data, they have limited exposure to the specific visual patterns of robotic manipulation: hands grasping objects at close range, cluttered tabletops, egocentric viewpoints of everyday activities, and the particular lighting and background conditions of deployment environments.

Our catalog of 3M+ annotated clips provides this domain-specific visual data across 100+ cities and thousands of environments. For teams fine-tuning ViT backbones for robot perception, Claru delivers the visual diversity that prevents overfitting during fine-tuning — ensuring the adapted ViT retains its general visual capabilities while learning the domain-specific patterns relevant to physical AI deployment. Our multi-model enrichment pipeline (Depth Anything V2, ViTPose, RAFT) runs on ViT-family models, producing the dense annotation layers that enable training ViT-based perception systems for manipulation, navigation, and scene understanding.`,
};

export default data;
