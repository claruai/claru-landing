import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "raft",
  termSlug: "raft",
  category: "models-architectures",
  metaTitle: "RAFT (Optical Flow) — Definition & Training Data | Claru",
  metaDescription: "RAFT (Recurrent All-Pairs Field Transforms) is a neural network architecture for dense optical flow estimation. Learn how it applies to robotics perception and what training data it needs.",
  primaryKeyword: "RAFT optical flow",
  secondaryKeywords: ["recurrent all-pairs field transforms", "RAFT model", "dense optical flow", "optical flow estimation", "motion estimation"],
  canonicalPath: "/glossary/raft",
  h1: "RAFT (Optical Flow): Definition, Applications, and Training Data Requirements",
  heroSubtitle: "RAFT (Recurrent All-Pairs Field Transforms) is a deep learning architecture that estimates dense optical flow — the per-pixel motion between consecutive video frames. Introduced by Teed and Deng in 2020, RAFT set a new state of the art on optical flow benchmarks and has become the dominant backbone for motion estimation in robotics perception, video understanding, and physical AI systems.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "RAFT (Optical Flow)", href: "/glossary/raft" },
  ],
  sections: [],
  faqs: [
    {
      question: "How does RAFT estimate optical flow differently from previous methods?",
      answer: "RAFT introduced three key innovations that separated it from prior optical flow architectures. First, it builds a full 4D correlation volume by computing all pairwise dot products between feature vectors at every pixel in both frames, rather than using a cost volume at a single resolution. Second, it uses a lightweight recurrent update operator (a ConvGRU) that iteratively refines the flow estimate by looking up values in the correlation volume at the current predicted correspondence locations. Third, it operates at a single resolution and upsamples the final result, avoiding the coarse-to-fine pyramid processing that earlier methods like FlowNet and PWC-Net relied on. The iterative refinement approach produces progressively better estimates with each recurrence step — typically 12-32 iterations during training, with accuracy improving monotonically. This design also provides a natural accuracy-compute tradeoff: fewer iterations at inference time produce faster but less precise flow estimates."
    },
    {
      question: "What training data does RAFT need for optical flow estimation?",
      answer: "RAFT is trained on paired consecutive frames with dense ground-truth optical flow fields — a 2D displacement vector for every pixel indicating where that pixel moved between frames. The standard training pipeline uses synthetic datasets where ground truth is available by construction: FlyingChairs (22,000 image pairs of random chair images moving over backgrounds), FlyingThings3D (derived from ShapeNet 3D models with known motion), and Sintel (rendered from the open-source animated film with complex realistic motion). Fine-tuning on domain-specific real data uses KITTI 2015 (200 training pairs from autonomous driving with sparse LiDAR-derived flow) or HD1K (1,000 pairs of high-resolution driving scenes). For robotics applications, the domain gap between synthetic training data and real-world robot camera footage means that models benefit significantly from fine-tuning on real data from the target environment and camera setup."
    },
    {
      question: "How is optical flow from RAFT used in robotics applications?",
      answer: "In robotics, RAFT-derived optical flow serves multiple perception functions. For object tracking, flow fields indicate which pixels belong to moving objects versus static background, enabling segmentation without explicit object detectors. For manipulation, flow between frames reveals the motion of objects being grasped or pushed, providing feedback on whether an action succeeded. For navigation, ego-motion estimation from optical flow complements odometry and IMU data, improving localization in GPS-denied environments. For imitation learning from video, optical flow provides motion supervision — the flow field between demonstration frames encodes the spatial transformation that a robot policy should reproduce. Flow is also used to detect unexpected motion (a person entering the workspace, an object slipping) that should trigger safety stops. RAFT's real-time capability (10-30 FPS on embedded GPUs) makes these applications practical in deployed robotics systems."
    },
    {
      question: "What are the main limitations of RAFT for robotics use cases?",
      answer: "RAFT has several limitations in robotics contexts. Large displacements (objects moving more than 25% of image width between frames) degrade accuracy because the correlation volume lookup becomes unreliable at extreme offsets — this matters for fast-moving robot arms or rapid camera motion. Textureless surfaces (white walls, uniform packaging) produce ambiguous correlations and unreliable flow, a fundamental limitation of appearance-based matching. Occlusion boundaries where objects appear or disappear between frames produce flow discontinuities that the smooth update operator struggles to represent sharply. Transparent and reflective surfaces confuse the feature matching. Computational cost on resource-constrained robot hardware may require the RAFT-Small variant, which trades accuracy for speed. For applications requiring sub-pixel precision (visual servoing, precision assembly), these limitations must be characterized and mitigated through domain-specific training data and appropriate fallback strategies."
    },
    {
      question: "How does Claru's video data support optical flow training and evaluation?",
      answer: "Claru's catalog of 3M+ video clips provides the diverse real-world footage that RAFT and its successors need for domain adaptation and evaluation. Our egocentric and third-person video captures span kitchens, workshops, retail environments, and outdoor settings with the natural motion patterns — hands manipulating objects, people walking through spaces, objects being placed and picked up — that robotics flow models must handle. We can generate pseudo ground-truth optical flow from multi-view stereo rigs or sequential depth captures, providing domain-specific training signal that synthetic datasets cannot match. For evaluation, our annotation pipeline produces object segmentation masks that enable flow accuracy assessment on specific scene elements (foreground objects versus background). With video captured at 30-60 FPS using calibrated cameras, Claru delivers the temporal resolution and environmental diversity needed to fine-tune and validate optical flow models for physical AI deployment."
    }
  ],
  ctaHeading: "Need Video Data for Motion Estimation?",
  ctaDescription: "Claru provides diverse real-world video data for optical flow training and evaluation. Calibrated captures across varied environments, lighting, and motion patterns.",
  relatedGlossaryTerms: ["optical-flow", "video-prediction", "egocentric-video", "object-tracking"],
  relatedGuidePages: ["how-to-create-temporal-annotations-for-video"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  longDefinition: "RAFT (Recurrent All-Pairs Field Transforms) is a neural network architecture for dense optical flow estimation introduced by Zachary Teed and Jia Deng at Princeton University in 2020. Optical flow — the apparent motion of pixels between consecutive video frames — is a fundamental representation for understanding dynamics in visual scenes, and RAFT's architecture set new performance standards across all major optical flow benchmarks while maintaining computational efficiency suitable for deployment.\n\nThe architecture consists of three stages. First, a shared feature encoder extracts per-pixel feature vectors from both input frames, and a separate context encoder processes the first frame to produce features that guide the update process. Second, a 4D correlation volume is constructed by computing dot products between all pairs of feature vectors across the two frames, capturing appearance similarity at every possible displacement. This correlation volume is indexed at multiple scales to handle both fine and coarse motion. Third, a recurrent update operator — a convolutional gated recurrent unit (ConvGRU) — iteratively refines the flow estimate. At each iteration, the operator looks up correlation values at the currently predicted correspondence locations, combines them with context features, and produces a flow update. This iterative refinement converges to accurate estimates over 12-32 iterations, with each step reducing the endpoint error.\n\nRAFT's significance for physical AI stems from optical flow's central role in understanding dynamics. For robotics perception, flow fields reveal which parts of a scene are moving and in what direction — information critical for object tracking, manipulation monitoring, and collision prediction. For video understanding and world models, flow provides dense motion supervision that complements sparse keypoint tracking. For imitation learning from video demonstrations, flow encodes the spatial transformations between frames that a learned policy should reproduce. RAFT's accuracy and efficiency have made it the default optical flow backbone in many robotics perception pipelines, and its architecture has influenced subsequent work including FlowFormer, SKFlow, and VideoFlow.\n\nTraining RAFT requires pairs of consecutive frames with dense ground-truth optical flow — a displacement vector for every pixel. Because obtaining exact flow ground truth from real video is nearly impossible (it would require tracking every surface point at sub-pixel precision), the field relies heavily on synthetic data. The standard training schedule uses FlyingChairs and FlyingThings3D for pretraining, then fine-tunes on Sintel (a rendered animated film with complex motion) and optionally KITTI (autonomous driving with sparse LiDAR-derived flow). For robotics applications, this synthetic training pipeline introduces a domain gap: the appearance statistics, motion patterns, and camera characteristics of synthetic datasets differ from real robot camera footage, and fine-tuning on domain-specific video data typically improves accuracy by 10-30% on the target distribution.",
  historicalContext: "Optical flow estimation has been a central problem in computer vision since Horn and Schunck (1981) formulated it as a variational optimization — minimizing a brightness constancy constraint with a smoothness regularizer. Lucas-Kanade (1981) introduced the sparse, patch-based approach. These variational methods dominated for decades, with progressively more sophisticated regularizers, multi-scale strategies, and robust penalty functions. The Large Displacement Optical Flow method (Brox et al., 2009) and EpicFlow (Revaud et al., 2015) represented the pinnacle of pre-deep-learning flow estimation.\n\nFlowNet (Dosovitskiy et al., 2015) was the first end-to-end deep learning approach to optical flow, demonstrating that a convolutional network could directly regress flow from image pairs. FlowNet2 (Ilg et al., 2017) stacked multiple FlowNet modules to achieve competitive accuracy with traditional methods. SpyNet (Ranjan and Black, 2017) introduced the coarse-to-fine spatial pyramid that became standard. PWC-Net (Sun et al., 2018) combined learnable feature pyramids with cost volumes and achieved state-of-the-art results with a compact architecture.\n\nRAFT (Teed and Deng, 2020) departed from the coarse-to-fine paradigm entirely. By constructing a full correlation volume at a single resolution and using iterative refinement through a recurrent operator, RAFT achieved substantial improvements: reducing error by 16% on the Sintel final pass benchmark and 5.1% on KITTI 2015 compared to the previous state of the art. The paper received the Best Paper Award at ECCV 2020. Subsequent work built on RAFT's foundation: GMA (Jiang et al., 2021) added global motion aggregation to handle occlusion, FlowFormer (Huang et al., 2022) replaced the ConvGRU with a transformer, and RAFT-Stereo adapted the architecture for stereo depth estimation. The RAFT paradigm — correlation volumes plus iterative refinement — has become the dominant design pattern for dense correspondence problems in computer vision.",
  practicalImplications: "Deploying RAFT in robotics perception systems involves several practical considerations. Inference speed on embedded hardware determines whether real-time applications are feasible: the full RAFT model runs at 10-15 FPS on an NVIDIA Jetson Orin at 640x480 resolution with 12 iterations, while RAFT-Small achieves 25-30 FPS with some accuracy loss. Reducing the number of refinement iterations to 6-8 provides a 2x speedup with only modest accuracy degradation — a worthwhile tradeoff for reactive control applications.\n\nInput resolution affects both accuracy and speed. RAFT processes images at a fixed resolution (typically 440x1024 for training) and can handle arbitrary resolutions at inference, but accuracy degrades on resolutions far from the training distribution. For robot cameras that capture at 1280x720 or 1920x1080, downscaling to RAFT's native range before flow estimation and then upscaling the result is standard practice. The upscaling introduces quantization error, so applications requiring sub-pixel flow precision (visual servoing) may need higher-resolution variants.\n\nThe domain gap between synthetic training data and real robot camera footage is the primary accuracy bottleneck for deployment. RAFT trained only on FlyingChairs, FlyingThings3D, and Sintel will produce systematically worse flow estimates on real-world robot footage due to differences in motion statistics (synthetic scenes have unrealistic velocity distributions), appearance (rendered surfaces versus real materials), and camera characteristics (noise, rolling shutter, auto-exposure changes). Fine-tuning on a small set of real-world pairs with pseudo ground-truth flow (derived from depth sensors, multi-view stereo, or manual annotation of key correspondences) typically closes 50-70% of this gap.\n\nClaru supports optical flow applications through diverse, calibrated video capture across real-world environments. Our multi-camera rigs enable multi-view stereo flow computation for pseudo ground-truth generation, and our annotation pipeline can produce sparse correspondence annotations and motion segmentation masks for fine-tuning and evaluation. Videos are delivered with camera intrinsics, timestamps, and exposure metadata that flow models need for proper preprocessing.",
  commonMisconceptions: [
    {
      misconception: "RAFT produces perfect optical flow that can be used as ground truth for downstream tasks.",
      correction: "RAFT produces excellent flow estimates but they are not ground truth. Endpoint errors of 1-3 pixels are typical on real-world footage, and errors increase significantly in regions with occlusion, textureless surfaces, specular reflections, and very large displacements. Using RAFT output as supervision for downstream models (distillation, self-supervision) propagates these errors. For applications requiring precise motion measurements — visual servoing, deformable object tracking, sub-millimeter positioning — RAFT flow should be treated as an estimate with known uncertainty characteristics, not as ground truth."
    },
    {
      misconception: "Optical flow is outdated now that video transformers can process temporal sequences directly.",
      correction: "While video transformers and 3D convolutional networks can implicitly learn motion representations, explicit optical flow remains valuable for three reasons. First, flow provides an interpretable, dense motion representation that can be inspected and validated. Second, flow serves as a strong inductive bias — precomputing motion and providing it as an additional input channel consistently improves downstream task performance. Third, flow enables efficient video processing by identifying static regions that do not need reprocessing. The most effective video understanding systems combine explicit flow with learned temporal features rather than relying exclusively on either."
    },
    {
      misconception: "RAFT works well out of the box on any video without domain-specific tuning.",
      correction: "RAFT's training on synthetic data (FlyingChairs, FlyingThings3D, Sintel) means it inherits the motion statistics, appearance distributions, and camera models of those datasets. On real-world robot camera footage — which may feature close-range manipulation views, egocentric head motion, industrial environments with specular surfaces, or unusual frame rates — accuracy drops by 20-40% compared to benchmark numbers. Fine-tuning on even a small amount of domain-representative data (500-2000 pairs) substantially closes this gap and is strongly recommended for any production deployment."
    }
  ],
  keyPapers: [
    {
      id: "teed-raft-2020",
      title: "RAFT: Recurrent All-Pairs Field Transforms for Optical Flow",
      authors: "Teed and Deng",
      venue: "ECCV 2020",
      year: 2020,
      url: "https://arxiv.org/abs/2003.12039"
    },
    {
      id: "huang-flowformer-2022",
      title: "FlowFormer: A Transformer Architecture for Optical Flow",
      authors: "Huang et al.",
      venue: "ECCV 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2203.16194"
    },
    {
      id: "jiang-gma-2021",
      title: "Learning to Estimate Hidden Motions with Global Motion Aggregation",
      authors: "Jiang et al.",
      venue: "ICCV 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2104.02409"
    },
    {
      id: "teed-raft-stereo-2021",
      title: "RAFT-Stereo: Multilevel Recurrent Field Transforms for Stereo Matching",
      authors: "Teed and Deng",
      venue: "3DV 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2109.07547"
    },
    {
      id: "sun-pwcnet-2018",
      title: "PWC-Net: CNNs for Optical Flow Using Pyramid, Warping, and Cost Volume",
      authors: "Sun et al.",
      venue: "CVPR 2018",
      year: 2018,
      url: "https://arxiv.org/abs/1709.02371"
    }
  ],
  claruRelevance: "Claru provides the diverse real-world video data that RAFT and successor optical flow models need for domain adaptation and evaluation in robotics contexts. Our catalog of 3M+ video clips captures the motion patterns — hand-object interactions, human locomotion, object displacement, camera ego-motion — that physical AI systems must track reliably. Videos are recorded at 30-60 FPS with calibrated cameras across 100+ cities, spanning kitchens, workshops, retail environments, and outdoor settings that represent deployment conditions. Our multi-camera capture rigs enable multi-view stereo flow computation for pseudo ground-truth generation, and our annotation pipeline produces motion segmentation masks and sparse correspondence labels for fine-tuning and evaluation. For teams fine-tuning RAFT on domain-specific data, Claru delivers the environmental diversity and capture quality that close the gap between synthetic benchmark performance and real-world reliability.",
};

export default data;
