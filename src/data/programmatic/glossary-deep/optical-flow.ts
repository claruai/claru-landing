import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "optical-flow",
  termSlug: "optical-flow",
  category: "computer-vision",
  metaTitle: "Optical Flow — Definition & Training Data | Claru",
  metaDescription: "Optical flow estimates per-pixel motion between consecutive video frames. Learn about RAFT, FlowNet, training data, and applications in robotics and video understanding.",
  primaryKeyword: "optical flow",
  secondaryKeywords: ["motion estimation", "flow field", "pixel motion", "video motion analysis", "RAFT optical flow"],
  canonicalPath: "/glossary/optical-flow",
  h1: "Optical Flow: Per-Pixel Motion Estimation for Video Understanding and Robotics",
  heroSubtitle: "Optical flow estimates the apparent 2D motion of every pixel between consecutive video frames, producing a dense vector field that encodes how the visual scene is moving. For robotics, it provides real-time motion cues for obstacle avoidance, object tracking, ego-motion estimation, and action recognition.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Optical Flow", href: "/glossary/optical-flow" },
  ],
  sections: [],
  faqs: [
    {
      question: "What is optical flow and what does its output look like?",
      answer: "Optical flow is a dense per-pixel motion field between two consecutive video frames. For every pixel in frame t, the flow field specifies a 2D displacement vector (dx, dy) indicating where that pixel moved to in frame t+1. The output is a two-channel image the same size as the input, where one channel encodes horizontal motion and the other encodes vertical motion. Positive dx means the pixel moved right; positive dy means it moved down. Flow is typically visualized using HSV color coding: hue represents motion direction (red=right, cyan=left, green=down, purple=up) and saturation represents motion magnitude. A perfectly static scene produces a zero flow field. Camera rotation produces a characteristic radial flow pattern. Moving objects create flow discontinuities at their boundaries, which is why optical flow is useful for motion segmentation."
    },
    {
      question: "What training data is needed for optical flow models?",
      answer: "Training optical flow models requires pairs of consecutive frames with dense ground-truth flow fields. Because ground-truth optical flow is impossible to obtain from real video with perfect accuracy (you cannot know the true motion of every pixel), the field relies heavily on synthetic data. FlyingChairs (Dosovitskiy et al., 2015) provides 22,000 synthetic image pairs of chairs floating over random backgrounds. FlyingThings3D extends this to 3D rendered scenes with 25,000 pairs. Sintel (Butler et al., 2012) provides 1,041 pairs from the open-source animated film. For real-world evaluation, KITTI Flow provides 400 image pairs with sparse LiDAR-derived flow. The standard training recipe is: pretrain on FlyingChairs, then FlyingThings3D, then optionally fine-tune on domain-specific data. For robotics applications, the key data gap is indoor manipulation scenes with fast hand motion and close-range object interactions, which are poorly represented in existing synthetic benchmarks."
    },
    {
      question: "How is optical flow used in robotics applications?",
      answer: "Optical flow serves multiple roles in robotic perception. For ego-motion estimation, the global flow pattern reveals how the robot's camera is moving — forward motion produces an expanding radial flow pattern centered on the focus of expansion. For obstacle detection, independently moving objects create flow fields inconsistent with the ego-motion model, enabling detection without object recognition. For manipulation, flow between frames during grasping reveals how the object is moving in response to the robot's actions, providing real-time visual feedback for closed-loop control. For action recognition in human-robot collaboration, flow captures the temporal dynamics of human movements that static frames cannot — distinguishing between someone reaching for an object (flow toward the object) versus pulling their hand back (flow away). Flow is also used as an input feature for video prediction models and world models that must anticipate future visual states."
    },
    {
      question: "What are the main optical flow architectures used today?",
      answer: "RAFT (Recurrent All-Pairs Field Transforms, Teed and Deng, 2020) is the dominant architecture, achieving state-of-the-art accuracy while maintaining reasonable speed. RAFT constructs a 4D correlation volume between all pairs of pixels in two frames, then iteratively refines the flow estimate using a recurrent GRU unit. FlowFormer (Huang et al., 2022) applies transformers to the correlation volume, achieving improved accuracy on challenging cases. For real-time applications, RAFT-Small and FlowNet2 trade accuracy for speed, running at 50-100+ FPS on GPU. GMFlow (Xu et al., 2022) reformulates flow estimation as a global matching problem using transformers, achieving competitive accuracy with better efficiency. For video (not just pairs), VideoFlow extends flow estimation to leverage temporal context across multiple frames, improving consistency in long sequences. The choice depends on the robotics application: manipulation typically needs accuracy (RAFT), while navigation needs speed (RAFT-Small or dedicated hardware implementations)."
    },
    {
      question: "How does Claru support optical flow data needs for robotics?",
      answer: "Claru provides video datasets captured at frame rates and resolutions suitable for optical flow computation, along with pre-computed flow fields using state-of-the-art models (RAFT, UniMatch). Our egocentric video datasets capture hand-object interactions, indoor navigation, and activity sequences at 30 FPS — the temporal density needed for reliable flow estimation. For teams training custom flow models for domain-specific robotics, Claru provides video pairs from target environments (kitchens, warehouses, retail spaces) with the motion patterns, lighting conditions, and object types that determine whether a flow model generalizes to deployment. We also use optical flow internally as an annotation acceleration tool: flow-based mask propagation reduces per-frame segmentation annotation time by 3-5x, and flow-based keypoint tracking enables efficient video keypoint annotation with human correction only where tracking fails."
    },
  ],
  ctaHeading: "Need Video Data for Motion Understanding?",
  ctaDescription: "Claru provides purpose-built datasets for physical AI and robotics. Tell us what your model needs to learn.",
  relatedGlossaryTerms: ["video-prediction", "raft", "egocentric-video", "object-tracking"],
  relatedGuidePages: ["how-to-create-temporal-annotations-for-video"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  longDefinition: `Optical flow is the pattern of apparent motion of visual elements in a scene between two consecutive observations, represented as a dense 2D vector field. For each pixel (x, y) in a reference frame I_t, the optical flow field (u, v) specifies the displacement to the corresponding pixel location (x+u, y+v) in the subsequent frame I_{t+1}. The resulting flow field has the same spatial dimensions as the input images but two channels (horizontal and vertical displacement), encoding where every visible surface point moved between frames.

The computation rests on the brightness constancy assumption: a pixel's intensity does not change between frames, only its position. Formally, I(x, y, t) = I(x+u, y+v, t+1). This assumption fails under lighting changes, specular reflections, transparency, and large displacements, making robust flow estimation a long-standing challenge. Modern deep learning methods relax this assumption by learning motion patterns from data, handling the violations through implicit priors captured during training.

Optical flow captures two sources of motion: ego-motion (the camera or robot moving) and independent object motion (things in the scene moving). Decomposing total flow into these components is essential for robotics. Ego-motion flow is geometrically constrained — it can be predicted from the camera's rotation and translation plus the scene's depth — while object motion flow is unconstrained and signals dynamic elements the robot must react to. Scene flow extends optical flow to 3D, estimating per-point 3D motion vectors rather than 2D image displacements, directly providing the information needed for robotic spatial reasoning.

For robotics training data, optical flow serves both as a target for training flow estimation models and as an intermediate representation for other tasks. Video prediction models use flow to warp frames forward in time. Action recognition models use flow as a motion feature channel. Video object segmentation uses flow to propagate annotations across frames. The quality and coverage of flow training data — particularly for fast motions, thin structures, and occlusion boundaries — directly determines the reliability of all downstream applications that consume flow estimates.`,
  historicalContext: `The concept of optical flow was formalized by James Gibson in 1950 in his ecological approach to visual perception, describing how patterns of visual motion provide information about an observer's movement through the environment. The computational formulation was established by Horn and Schunck (1981), who derived the optical flow constraint equation from the brightness constancy assumption and proposed a variational method to solve it. Lucas and Kanade (1981) introduced a local method assuming constant flow within small windows, which remains the basis for feature tracking algorithms today.

For decades, variational methods dominated. The Lucas-Kanade tracker became standard for sparse feature tracking (used in visual odometry and SLAM), while global variational methods (TV-L1, Classic+NL) competed on accuracy benchmarks. The Middlebury optical flow benchmark (Baker et al., 2011) established standardized evaluation, though its small indoor scenes limited generalization.

The deep learning revolution began with FlowNet (Dosovitskiy et al., 2015), which demonstrated that a convolutional neural network could estimate optical flow from image pairs in a single forward pass. FlowNet2 (Ilg et al., 2017) stacked multiple FlowNet modules to achieve accuracy competitive with variational methods. PWC-Net (Sun et al., 2018) introduced a coarse-to-fine pyramid architecture with cost volume processing, achieving state-of-the-art results with greater efficiency.

RAFT (Teed and Deng, 2020) represented a paradigm shift. Rather than predicting flow in a single pass or coarse-to-fine cascade, RAFT constructs a full 4D correlation volume and iteratively refines flow using a recurrent update operator. RAFT achieved dramatically better accuracy than prior methods and proved more robust to out-of-distribution inputs. Subsequent work — GMA, FlowFormer, GMFlow, UniMatch — builds on RAFT's correlation volume approach while adding attention mechanisms and transformer architectures.`,
  practicalImplications: `For robotics teams using optical flow, key practical decisions involve model selection, runtime optimization, and integration with the perception stack. RAFT with 12 iterations achieves the best accuracy but runs at only 10-15 FPS on an NVIDIA Jetson Orin at 640x480 resolution. Reducing to 6 iterations roughly doubles speed with modest accuracy degradation. RAFT-Small runs at 40+ FPS with approximately 15% higher endpoint error. For real-time navigation at 30+ FPS, lightweight models or hardware-accelerated Lucas-Kanade tracking may be necessary, with RAFT reserved for offline analysis or lower-rate dense flow computation.

Training data strategy depends on whether you need a general-purpose flow model or a domain-specific one. General-purpose models pretrained on FlyingChairs and FlyingThings3D transfer well to most real-world scenes. For robotics-specific improvements, fine-tuning on synthetic data rendered from the target environment (using simulators like Isaac Sim or MuJoCo with domain randomization) typically improves accuracy by 10-20% on in-domain evaluation. Real-world flow ground truth is extremely expensive to obtain (requiring multi-view rigs and 3D reconstruction), so synthetic data remains the primary training source.

Integration patterns in robotics stacks vary by application. For visual odometry, flow is decomposed into rotational and translational components using the camera intrinsic matrix and the essential matrix. For object segmentation, flow inconsistent with the ego-motion model signals independently moving objects. For manipulation feedback, flow in the gripper region indicates whether the object is being successfully manipulated. For video annotation pipelines, flow-based mask warping accelerates temporal annotation by propagating labels from keyframes to intermediate frames with human correction at occlusion boundaries.`,
  commonMisconceptions: [
    {
      misconception: "Optical flow gives you the 3D motion of objects in the scene.",
      correction: "Optical flow is a 2D image-space quantity: it tells you how pixels moved on the image plane, not how objects moved in 3D space. The same 3D motion produces different optical flow depending on the camera's focal length, the object's distance, and the camera's own motion. Converting optical flow to 3D scene flow requires depth information. For robotics, this means optical flow alone cannot tell you whether an obstacle is moving toward the robot or parallel to it — you need flow plus depth (or stereo flow) to recover 3D motion for planning."
    },
    {
      misconception: "Optical flow models trained on synthetic data do not work well on real-world robotics video.",
      correction: "Modern flow models (RAFT and successors) generalize surprisingly well from synthetic training data to real-world video, because optical flow is a low-level motion estimation task less affected by the domain gap than high-level recognition tasks. RAFT trained only on FlyingChairs and FlyingThings3D achieves strong performance on KITTI and Sintel real-world benchmarks without any real-world fine-tuning. The main failure modes in real robotics scenarios are motion blur (from fast camera or hand movement), large displacements exceeding the model's search range, and textureless regions where the brightness constancy assumption provides no constraint."
    },
    {
      misconception: "Dense optical flow is always better than sparse feature tracking for robotics.",
      correction: "Dense flow (RAFT, FlowNet) estimates motion for every pixel but is computationally expensive and can be noisy in textureless regions. Sparse feature tracking (Lucas-Kanade, SuperPoint+SuperGlue) tracks only distinctive keypoints but runs 10-100x faster and provides more reliable correspondences. For visual odometry and SLAM, sparse tracking is standard because the geometric constraints only need a few reliable correspondences, not dense flow. Dense flow is preferred when per-pixel motion information is needed — for video segmentation propagation, action recognition, or detecting independently moving objects across the full field of view."
    },
  ],
  keyPapers: [
    {
      id: "teed-raft-2020",
      title: "RAFT: Recurrent All-Pairs Field Transforms for Optical Flow",
      authors: "Teed and Deng",
      venue: "ECCV 2020",
      year: 2020,
      url: "https://arxiv.org/abs/2003.12039",
    },
    {
      id: "dosovitskiy-flownet-2015",
      title: "FlowNet: Learning Optical Flow with Convolutional Networks",
      authors: "Dosovitskiy et al.",
      venue: "ICCV 2015",
      year: 2015,
      url: "https://arxiv.org/abs/1504.06852",
    },
    {
      id: "horn-schunck-1981",
      title: "Determining Optical Flow",
      authors: "Horn and Schunck",
      venue: "Artificial Intelligence",
      year: 1981,
      url: "https://doi.org/10.1016/0004-3702(81)90024-2",
    },
    {
      id: "huang-flowformer-2022",
      title: "FlowFormer: A Transformer Architecture for Optical Flow",
      authors: "Huang et al.",
      venue: "ECCV 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2203.16194",
    },
    {
      id: "butler-sintel-2012",
      title: "A Naturalistic Open Source Movie for Optical Flow Evaluation",
      authors: "Butler et al.",
      venue: "ECCV 2012",
      year: 2012,
      url: "https://doi.org/10.1007/978-3-642-33783-3_44",
    },
  ],
  claruRelevance: "Claru provides high-frame-rate video datasets optimized for optical flow computation and downstream motion understanding tasks. Our egocentric and third-person video datasets are captured at 30 FPS with controlled exposure settings that minimize motion blur — the primary failure mode for flow estimation in robotics scenarios. For teams training custom flow models, Claru provides video from indoor robotics environments (kitchens, warehouses, workspaces) with the fast hand motions, close-range object interactions, and dynamic lighting that standard synthetic benchmarks do not cover. We also use optical flow as a core tool in our annotation pipeline: RAFT-based flow computation enables mask propagation across video frames, reducing per-frame segmentation annotation time by 3-5x. With 386,000+ video clips in our catalog spanning diverse environments and activity types, Claru provides the temporal data density that motion understanding models require.",
};

export default data;
