import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "video-prediction",
  termSlug: "video-prediction",
  category: "computer-vision",
  metaTitle: "Video Prediction — Definition & Training Data | Claru",
  metaDescription: "Video prediction models forecast future video frames from past observations, serving as world models for robotics planning. Learn architectures, training data needs, and key papers.",
  primaryKeyword: "video prediction",
  secondaryKeywords: ["future frame prediction", "video generation model", "temporal prediction", "world model video", "action-conditioned video prediction", "video diffusion model"],
  canonicalPath: "/glossary/video-prediction",
  h1: "Video Prediction: Definition, Applications, and Training Data Requirements",
  heroSubtitle: "Video prediction is the task of generating future video frames given past observations and optionally future actions. In robotics, video prediction models serve as learned world models — they predict what will happen if the robot takes a specific action, enabling planning by imagining outcomes before executing them. This page covers video prediction architectures, training data requirements, action conditioning, and applications in robot planning.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Video Prediction", href: "/glossary/video-prediction" },
  ],
  sections: [],
  faqs: [
    {
      question: "How is video prediction used as a world model for robotics?",
      answer: "A world model predicts the consequences of actions before they are executed. Action-conditioned video prediction serves this role: given the current camera observation and a proposed robot action, the model generates predicted future frames showing what the scene will look like after the action. The robot's planner evaluates multiple candidate actions by generating predicted videos for each, scoring the predicted outcomes against the task objective, and selecting the action whose predicted outcome best achieves the goal. UniPi (Du et al., 2023) demonstrated this approach by training a text-conditioned video generation model and using it to plan robot actions — the model imagined reaching a language-specified goal state, and inverse dynamics extracted the actions needed to realize that imagined trajectory. SuSIE (Black et al., 2023) used video prediction as a subgoal generator, predicting what the scene should look like a few steps ahead and then using a low-level controller to reach that predicted subgoal.",
    },
    {
      question: "What training data do video prediction models need?",
      answer: "Video prediction models require large amounts of temporally coherent video data. For unconditional video prediction (predicting natural scene dynamics), internet video datasets like WebVid-10M, Kinetics-700, and Something-Something V2 provide diverse training data. For action-conditioned video prediction in robotics, the training data must include synchronized video observations and robot actions — each frame paired with the action the robot was executing at that moment. The Open X-Embodiment dataset, Bridge Data V2, and DROID provide this paired video-action data from robot manipulation. Data volume requirements are substantial: current state-of-the-art video generation models like Sora are trained on millions of video clips. Robotics-specific video prediction models like UniPi and GR-1 are trained on hundreds of thousands to millions of video clips combining internet video with robot data.",
    },
    {
      question: "What architectures are used for video prediction?",
      answer: "The dominant architectures have evolved from deterministic CNNs to modern diffusion and transformer models. Early approaches like CDNA (Finn et al., 2016) used convolutional networks to predict pixel transformations conditioned on actions. Variational approaches like SVG (Denton and Fergus, 2018) introduced stochastic prediction to handle the inherent uncertainty of future outcomes. The current state of the art uses video diffusion models — adapting the denoising diffusion framework from image generation to video by adding temporal attention layers that maintain consistency across frames. Models like Stable Video Diffusion, VideoGPT, and CogVideo generate high-quality multi-second video predictions. For robotics specifically, architectures like AVID, UniPi, and Genie condition the generation on robot actions or language instructions, producing action-conditioned predictions suitable for planning.",
    },
    {
      question: "How is video prediction quality evaluated?",
      answer: "Video prediction quality is assessed along three dimensions. Visual quality measures how realistic individual predicted frames look, using metrics like FID (Frechet Inception Distance) and FVD (Frechet Video Distance) that compare the distribution of generated frames to real frames. Temporal consistency measures whether the predicted video maintains coherent motion and object identity across frames — objects should not appear, disappear, or change shape unexpectedly. Physical plausibility measures whether predicted dynamics follow real-world physics: objects should fall downward, rigid objects should not deform, and contacts should produce realistic responses. For robotics applications, task-relevant accuracy is the most important metric: does the predicted video correctly show the outcome of the conditioned action? A prediction that is visually imperfect but correctly predicts that a push action will move an object to the left is more useful for planning than a photorealistic prediction that gets the physics wrong.",
    },
    {
      question: "What is the relationship between video prediction and video generation models like Sora?",
      answer: "Video prediction and video generation share architectures and training methods but differ in conditioning and application. Video generation models like Sora, Kling, and Runway Gen-3 generate video from text prompts, optimizing for visual quality and creative control. Video prediction models generate video conditioned on initial frames and optionally actions, optimizing for physical accuracy and temporal consistency. The key difference is that video prediction must be faithful to the initial observation and physically plausible, while video generation prioritizes aesthetic quality and prompt adherence. However, the underlying models are converging: Sora-class models demonstrate strong physical understanding that could serve as world models, and robotics researchers are increasingly using adapted video generation models for action-conditioned prediction. The training data difference is also converging — both benefit from large-scale diverse video, though robotics prediction additionally requires action-labeled data.",
    },
  ],
  ctaHeading: "Need Video Data for World Model Training?",
  ctaDescription: "Claru provides millions of annotated video clips spanning diverse real-world environments — the training data that video prediction models need to learn accurate physical dynamics for robot planning.",
  relatedGlossaryTerms: ["world-model", "optical-flow", "diffusion-transformer", "egocentric-video"],
  relatedGuidePages: ["how-to-collect-egocentric-video-data"],
  relatedSolutionSlugs: ["video-generation-training-data"],

  longDefinition: `Video prediction is the task of generating plausible future video frames given a sequence of past frames and optionally conditioning signals such as robot actions, language instructions, or goal images. The model takes as input a context window of observed frames and outputs predicted frames for a specified future horizon. The challenge is that the future is inherently uncertain — the same initial frames could lead to many different valid continuations depending on unobserved factors and stochastic events. Good video prediction models must capture both the deterministic aspects of scene dynamics (gravity, rigid body motion, kinematic constraints) and the stochastic aspects (which direction a person will walk, how objects will be rearranged).

In robotics, video prediction serves as a learned world model — an internal simulator that predicts the consequences of actions in the robot's actual visual environment. Classical model-based reinforcement learning uses explicit physics simulators as world models, but these simulators require precise knowledge of object geometries, masses, friction coefficients, and contact dynamics that are difficult to obtain in unstructured environments. Learned video prediction models bypass this requirement by predicting directly in pixel space: given what the camera currently sees and what action the robot plans to take, the model predicts what the camera will see after the action. This prediction-in-pixel-space approach works without explicit physical modeling because the training data implicitly encodes all relevant physics.

Action-conditioned video prediction adds a critical capability: the model predicts different futures depending on the action taken. This enables planning by generating predicted videos for multiple candidate actions and selecting the action whose predicted outcome best achieves the task goal. The planning loop is: observe the current scene, propose several candidate actions, generate predicted futures for each action using the video prediction model, evaluate each predicted future against the goal, and execute the best action. This model-predictive control approach has been demonstrated by UniPi, SuSIE, and AVID for tabletop manipulation tasks.

The training data requirements for video prediction models are substantial. The model must learn the visual appearance of diverse scenes (requiring millions of diverse video frames), the dynamics of physical interactions (requiring videos of objects being manipulated, falling, sliding, and colliding), and the mapping from actions to outcomes (requiring synchronized video-action pairs for the action-conditioned variant). Internet video provides visual diversity and general physical dynamics at scale, while robot-specific datasets provide the action-conditioned training signal. The most effective training recipes combine both sources, using internet video for pretraining and robot data for fine-tuning the action-conditioning mechanism.

Video prediction quality has improved dramatically with the advent of video diffusion models. These models generate video through iterative denoising, starting from noise and progressively refining it into a coherent video. The diffusion framework naturally handles the stochasticity of future prediction — different noise samples produce different valid futures from the same initial condition. Temporal attention mechanisms maintain consistency across generated frames, and classifier-free guidance enables trading off diversity for fidelity. Current models can generate physically plausible 2-4 second predictions at 256x256 resolution, sufficient for short-horizon robot planning.`,

  historicalContext: `Video prediction research began with deterministic next-frame prediction using convolutional networks. Ranzato et al. (2014) and Srivastava et al. (2015) applied recurrent neural networks to predict future video frames, but the results were blurry because deterministic models average over possible futures. Mathieu et al. (2016) introduced adversarial training for sharper predictions, establishing the GAN-based video prediction paradigm.

Action-conditioned video prediction for robotics was pioneered by Finn et al. (2016) with the CDNA (Convolutional Dynamic Neural Advection) model, which predicted pixel-level transformations conditioned on robot actions. This work demonstrated that video prediction could serve as a learned dynamics model for robot planning. Ebert et al. (2018) built on this with visual foresight — using action-conditioned video prediction for model-predictive control of a robotic arm, achieving goal-reaching tasks purely through imagined planning.

The stochastic video prediction era was marked by SVG (Denton and Fergus, 2018) and Video Transformer (Weissenborn et al., 2020), which introduced variational and autoregressive approaches to handle the inherent uncertainty of future prediction. These models could generate multiple diverse plausible futures from the same initial condition.

The diffusion revolution transformed video prediction starting in 2022. Video Diffusion Models (Ho et al., 2022) adapted the denoising diffusion framework to video, producing unprecedented temporal coherence and visual quality. Make-A-Video (Singer et al., 2022) and Imagen Video (Ho et al., 2022) demonstrated text-to-video generation at scale. UniPi (Du et al., 2023) applied video diffusion to robotic planning, using a text-conditioned video generation model as a world model for robot manipulation. This approach showed that internet-scale video generation models, fine-tuned on robot data, could serve as effective world models for physical AI.

The current frontier includes Sora (OpenAI, 2024) and similar large-scale video models that demonstrate emergent physical understanding from training on massive video data, and specialized robotics world models like AVID, GR-1, and Genie-2 that combine internet-scale pretraining with action-conditioned prediction for robot planning.`,

  practicalImplications: `For robotics teams, video prediction models are becoming practical tools for planning and data augmentation. The key practical decision is whether to use video prediction as an explicit planning module (generating predicted futures at runtime) or as an implicit world model whose knowledge is distilled into a policy during training.

Explicit planning with video prediction generates predicted videos at runtime and evaluates them against the goal. This approach, demonstrated by UniPi and SuSIE, is flexible — the same world model works for any goal specified in language or images — but computationally expensive. Generating a 2-second predicted video at 256x256 takes 1-5 seconds on an A100 GPU, and planning requires generating 10-100 candidate videos per action step. This makes explicit video planning practical for slow, deliberate manipulation but too slow for real-time reactive control.

Implicit world models train a policy that has internalized world knowledge without generating explicit video predictions at runtime. The training process uses video prediction as an auxiliary objective that forces the model to understand scene dynamics, but at deployment time the model directly outputs actions without generating frames. This approach is faster at runtime but less interpretable and less flexible — changing the goal requires retraining rather than re-specifying the goal to the planner.

Training data for video prediction should be diverse, high-quality, and capture realistic physical dynamics. Internet video provides visual diversity but often has editing cuts, camera motion unrelated to content, and compressed artifacts that degrade prediction quality. Egocentric video of human activities provides more robotics-relevant dynamics — hands manipulating objects in real environments — with continuous observation and natural physics. Claru's egocentric video catalog provides exactly this type of data: millions of frames of human-object interaction in diverse real environments, with the temporal continuity and physical realism that video prediction models need to learn accurate dynamics.

For action-conditioned video prediction, training data must include synchronized robot observations and actions. Claru can enrich egocentric video with pseudo-action labels (hand trajectories, grasp events, object displacements) derived from our vision model enrichment pipeline, providing a bridge between abundant human video data and the action-conditioned format that robotics world models require.`,

  commonMisconceptions: [
    {
      misconception: "Video prediction models need to generate photorealistic output to be useful for robot planning.",
      correction: "For planning purposes, physical accuracy matters more than visual quality. A prediction that correctly shows an object sliding to the left after a push — even if slightly blurry — is more useful than a photorealistic prediction that gets the physics wrong. Research has shown that policies planned using visually imperfect but physically accurate predictions outperform those using high-quality but physically inaccurate predictions. Some approaches skip pixel-level prediction entirely, predicting in a learned latent space where physical dynamics are easier to model, then decoding back to pixels only for visualization.",
    },
    {
      misconception: "Video prediction can reliably forecast many seconds into the future.",
      correction: "Current video prediction models produce reliable predictions for 0.5-4 seconds, after which accumulated errors cause the prediction to diverge from reality. Object positions drift, new objects that should enter the scene are not predicted, and physical interactions become implausible. For robotics planning, this limitation is addressed through receding-horizon planning: the model predicts only a short horizon (0.5-2 seconds), the robot executes the first action, re-observes the scene, and re-plans. This closed-loop approach prevents error accumulation because each planning step uses fresh observations rather than compounding predicted frames.",
    },
    {
      misconception: "Internet video is sufficient training data for robotics video prediction — robot-specific data is not needed.",
      correction: "Internet video teaches general visual dynamics and scene understanding, but it lacks the action-conditioning signal needed for robot planning. A model trained only on internet video can predict what happens next in a scene but cannot predict what happens if the robot takes a specific action. The action-conditioned variant requires paired video-action data from robot interaction. The best training recipe combines both: internet video for pretraining (visual diversity and general physics) followed by fine-tuning on robot-specific data (action conditioning and manipulation dynamics). This matches the pretrain-then-finetune paradigm that has proven effective across all domains of transfer learning.",
    },
  ],

  keyPapers: [
    {
      id: "du-unipi-2023",
      title: "Learning Universal Policies via Text-Guided Video Generation",
      authors: "Du et al.",
      venue: "NeurIPS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2302.00111",
    },
    {
      id: "finn-cdna-2016",
      title: "Unsupervised Learning for Physical Interaction through Video Prediction",
      authors: "Finn et al.",
      venue: "NeurIPS 2016",
      year: 2016,
      url: "https://arxiv.org/abs/1605.07157",
    },
    {
      id: "black-susie-2023",
      title: "Zero-Shot Robotic Manipulation with Pretrained Image-Editing Diffusion Models",
      authors: "Black et al.",
      venue: "ICLR 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.10639",
    },
    {
      id: "ho-videodiffusion-2022",
      title: "Video Diffusion Models",
      authors: "Ho et al.",
      venue: "NeurIPS 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2204.03458",
    },
    {
      id: "wu-genie2-2024",
      title: "Genie 2: A Large-Scale Foundation World Model",
      authors: "DeepMind",
      venue: "DeepMind Technical Report 2024",
      year: 2024,
      url: "https://deepmind.google/discover/blog/genie-2-a-large-scale-foundation-world-model/",
    },
  ],

  claruRelevance: `Claru provides the diverse, temporally coherent video data that video prediction models need to learn accurate physical dynamics. Our catalog of 3M+ annotated clips captures human-object interactions across thousands of real-world environments — kitchens, workshops, living spaces, outdoor settings — with the visual diversity, physical realism, and temporal continuity that video prediction models require.

For teams building world models for robot planning, Claru offers video data enriched with per-frame depth maps, optical flow, hand pose estimates, and object interaction labels. These enrichments provide additional supervision signals that improve video prediction quality: depth maps enable 3D-aware prediction, optical flow provides motion supervision, and object interaction labels help the model focus on physically meaningful dynamics rather than background motion. Our egocentric perspective matches the camera viewpoint of manipulation robots, providing directly relevant training data for action-conditioned video prediction in manipulation settings.`,
};

export default data;
