import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "hand-object-interaction",
  termSlug: "hand-object-interaction",
  category: "computer-vision",
  metaTitle: "Hand-Object Interaction — Definition & Training Data | Claru",
  metaDescription: "Hand-object interaction captures how human hands grasp, manipulate, and release objects. Learn about HOI datasets, annotation methods, and training data for dexterous robot policies.",
  primaryKeyword: "hand-object interaction",
  secondaryKeywords: ["HOI detection", "hand manipulation dataset", "grasp contact annotation", "hand-object contact", "egocentric hand tracking"],
  canonicalPath: "/glossary/hand-object-interaction",
  h1: "Hand-Object Interaction: Datasets, Annotation, and Training Data for Dexterous Robotics",
  heroSubtitle: "Hand-object interaction (HOI) research studies how human hands contact, grasp, manipulate, and release objects. HOI datasets provide the demonstration data that teaches dexterous robots to replicate human manipulation skills in unstructured environments.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Hand-Object Interaction", href: "/glossary/hand-object-interaction" },
  ],
  sections: [],
  faqs: [
    {
      question: "What data modalities are captured in hand-object interaction datasets?",
      answer: "HOI datasets typically combine multiple synchronized streams. RGB video from egocentric (head-mounted) or exocentric (third-person) cameras captures the visual scene. Depth sensors or stereo cameras provide 3D geometry. Hand pose is recorded either through marker-based motion capture systems (OptiTrack, Vicon) that track reflective markers on gloves, or through markerless vision-based hand pose estimators like MediaPipe or FrankMocap. Object pose is tracked using fiducial markers (ArUco), known 3D models, or learned 6-DOF pose estimators. Contact information is captured through tactile gloves with pressure sensors, or inferred from hand-object proximity using the 3D pose data. Some datasets like GRAB and ContactPose also include full-body pose captured by a body-worn IMU suit or multi-camera mocap system, enabling study of how posture and reach affect manipulation strategies."
    },
    {
      question: "How are hand-object interaction datasets used to train robot policies?",
      answer: "HOI datasets train robots through two main pathways. The first is hand pose retargeting, where human hand trajectories are mapped onto robot gripper or dexterous hand joint configurations, then used as demonstration data for imitation learning. DexMV (Qin et al., 2022) demonstrated this by retargeting GRAB dataset hand poses to a simulated Shadow Hand. The second pathway is learning visual affordances: given an image of an object, predict where and how a hand would contact it. These affordance predictions then guide robot grasp planning. H2O (Kwon et al., 2021) showed that egocentric HOI videos can teach robots which objects to interact with and what manipulation actions to apply. Both pathways require high-quality hand pose annotations, accurate object models, and precise temporal alignment between observation and contact events."
    },
    {
      question: "What are the biggest challenges in collecting hand-object interaction data?",
      answer: "The primary challenge is simultaneous accurate tracking of both the hand and the object during contact. When fingers wrap around an object, they create mutual occlusions that degrade vision-based tracking accuracy. Marker-based mocap systems solve this but require instrumented gloves that alter natural grasp behavior. Tactile sensors capture contact forces directly but add bulk to the fingers. A second challenge is annotation scalability: labeling per-frame contact states, grasp types, and action phases across hours of video requires domain expertise and is slow (10-30 minutes per minute of video for detailed annotations). Third, capturing diverse HOI data requires hundreds of distinct objects spanning different sizes, shapes, materials, and weights, which creates significant logistical overhead for data collection campaigns."
    },
    {
      question: "What is the difference between HOI detection and HOI reconstruction?",
      answer: "HOI detection identifies which person-object pairs are interacting in an image and classifies the interaction type from a predefined verb vocabulary (e.g., 'holding', 'pouring', 'cutting'). It operates on single images and outputs bounding boxes plus interaction labels. HICO-DET and V-COCO are standard detection benchmarks. HOI reconstruction recovers the full 3D geometry of the interaction: 3D hand mesh, 3D object mesh, and contact map between them. This requires either multi-view cameras, depth sensors, or strong 3D shape priors. Datasets like ContactPose, GRAB, and OakInk support reconstruction tasks. For robotics, reconstruction is far more valuable because it provides the precise spatial relationships needed for grasp retargeting and contact-based manipulation planning, while detection provides only coarse semantic labels."
    },
    {
      question: "How does Claru support hand-object interaction data collection?",
      answer: "Claru's distributed data collection network captures egocentric and exocentric hand-object interaction video across diverse real-world environments — kitchens, workshops, offices, and retail settings that represent actual robot deployment conditions. Our collectors use head-mounted cameras with depth sensing to record first-person manipulation of everyday objects, producing the varied interaction data that lab-based mocap setups cannot replicate. Claru's annotation pipeline then labels each clip with hand pose keypoints, object bounding boxes, contact state transitions, grasp taxonomy labels (using the Feix grasp taxonomy), and fine-grained action phases. Multi-annotator agreement checks ensure labeling consistency. The resulting datasets support both affordance learning and hand-to-robot retargeting pipelines, delivered in formats compatible with standard HOI benchmarks and robot learning frameworks."
    },
  ],
  ctaHeading: "Need Hand-Object Interaction Data?",
  ctaDescription: "Claru provides purpose-built datasets for physical AI and robotics. Tell us what your model needs to learn.",
  relatedGlossaryTerms: ["pose-estimation", "keypoint-annotation", "egocentric-video", "manipulation-trajectory"],
  relatedGuidePages: ["how-to-annotate-hand-object-interactions"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  longDefinition: "Hand-object interaction (HOI) is a multidisciplinary research area at the intersection of computer vision, biomechanics, and robotics that studies how human hands physically engage with objects. An HOI dataset captures the spatial, temporal, and force-based relationships between hand surfaces and object surfaces during manipulation — from the initial reach and contact establishment through the grasp, in-hand adjustment, functional use, and release phases of object handling.\n\nAt the vision level, HOI encompasses detection (identifying interacting hand-object pairs in images), recognition (classifying the interaction type), and reconstruction (recovering full 3D hand and object meshes with contact maps). Detection benchmarks like HICO-DET (Chao et al., 2018) contain over 150,000 annotated human-object pairs spanning 600 interaction categories. Reconstruction datasets like GRAB (Taheri et al., 2020) provide mocap-quality 3D hand and body meshes during natural grasping of 51 everyday objects, captured from 10 subjects.\n\nFor robotics, the critical value of HOI data lies in demonstrations of dexterous manipulation strategies. Human hands solve manipulation problems that robots struggle with: adjusting grip mid-task, using fingertip sensitivity to detect slip, exploiting gravity and surface friction as manipulation aids. HOI datasets encode these strategies implicitly in the joint trajectories and contact sequences. Methods like DexMV and DexArt retarget human hand data to robot hands, using HOI demonstrations as the supervision signal for dexterous policy learning.\n\nThe field distinguishes between egocentric and exocentric HOI data. Egocentric data, captured from head-mounted cameras, provides the first-person viewpoint that matches how an embodied agent perceives its own manipulation. Datasets like Ego4D, Epic-Kitchens, and H2O capture thousands of hours of egocentric manipulation. Exocentric data from fixed or third-person cameras captures the full spatial context of the interaction, including body posture and workspace layout. The most informative HOI datasets combine both viewpoints with synchronized 3D hand tracking, enabling models to learn viewpoint-invariant manipulation representations.",
  historicalContext: "Early hand-object interaction research focused on grasp taxonomy rather than data collection. Cutkosky (1989) defined a 16-category grasp taxonomy for manufacturing, and Feix et al. (2016) expanded this to 33 grasp types through analysis of human manipulation videos. These taxonomies provided the vocabulary but not the data for learning manipulation.\n\nThe first large-scale HOI datasets emerged from the computer vision community. HICO (Chao et al., 2015) introduced 600 human-object interaction categories annotated on 47,774 images, enabling the first deep learning models for HOI detection. V-COCO (Gupta and Malik, 2015) provided 10,396 images with interaction annotations grounded in the COCO object detection dataset.\n\nA major shift occurred around 2020 when researchers began capturing 3D HOI data with mocap-grade accuracy. ContactPose (Brahmbhatt et al., 2020) recorded 3D hand-object contact maps using thermal cameras that detect heat transfer at contact points — a clever alternative to instrumenting the hand. GRAB (Taheri et al., 2020) captured full 3D body and hand meshes during natural grasping using a body-worn mocap suit, producing 1.6 million frames of 3D interaction data. OakInk (Yang et al., 2022) combined markerless hand tracking with object pose estimation to capture 50,000 interaction sequences across 1,800 objects.\n\nThe egocentric video revolution further expanded HOI data availability. Ego4D (Grauman et al., 2022) released 3,670 hours of egocentric video from 923 participants worldwide, with hand-object interaction annotations for a large subset. Epic-Kitchens (Damen et al., 2022) captured 100 hours of unscripted kitchen activities with dense temporal annotations. These datasets shifted HOI research from posed lab captures to naturalistic, in-the-wild manipulation data that better represents the diversity of real-world interactions.",
  practicalImplications: "Building an effective HOI dataset for robotics requires careful decisions about capture methodology, annotation granularity, and downstream compatibility. The capture setup must balance tracking accuracy against naturalistic behavior — mocap gloves with markers achieve millimeter-level hand pose accuracy but alter how people grasp small or flexible objects, while markerless vision-based tracking preserves natural behavior at the cost of 5-15mm pose error during heavy occlusion.\n\nAnnotation granularity should match the intended use case. For affordance learning (predicting where to grasp an object), coarse annotations of contact regions and grasp type are sufficient and can be produced at 5-10 annotations per minute. For hand-to-robot retargeting, per-frame 3D hand joint positions and per-vertex contact labels are needed, requiring either automated tracking with manual correction or full mocap — annotation throughput drops to 1-3 minutes of video processed per hour of annotator time. For action recognition, temporal phase boundaries (reach, contact, manipulate, release) and verb-noun action labels are the minimum requirement.\n\nObject diversity is the single most impactful factor for generalization. HOI datasets with 50 or fewer objects tend to overfit to specific geometries. The OakInk dataset demonstrated that expanding to 1,800 objects across shape and material categories dramatically improved cross-object generalization in downstream grasp prediction models. For production datasets, Claru targets a minimum of 200 unique objects per domain (kitchen, workshop, warehouse), stratified across size, shape, weight, and material categories.\n\nData format compatibility determines integration cost. The standard format for 3D HOI data is MANO hand model parameters (pose and shape vectors) plus rigid object 6-DOF pose per frame, stored in HDF5 or pickle files. For video-based HOI, the Ego4D and Epic-Kitchens formats (MP4 video + JSON temporal annotations) are widely adopted. Claru delivers HOI datasets with MANO-compatible hand representations, object mesh registrations, and temporal annotations in formats that plug directly into DexMV, DexArt, and custom imitation learning pipelines.",
  commonMisconceptions: [
    {
      misconception: "HOI detection on 2D images is sufficient for training robot manipulation.",
      correction: "2D HOI detection identifies what interactions are happening but not the precise 3D geometry of how they happen. A label of 'holding cup' does not specify finger positions, contact forces, or approach trajectory. Robot manipulation requires 3D HOI reconstruction — full hand mesh, object mesh, and contact map — to extract the spatial information needed for grasp retargeting and policy learning. Detection-only datasets like HICO-DET are useful for scene understanding but not for manipulation skill transfer."
    },
    {
      misconception: "Synthetic HOI data from physics simulation is as useful as real human demonstration data.",
      correction: "Simulated HOI data from environments like Isaac Gym can generate millions of grasp trajectories but misses the subtle manipulation strategies that humans employ unconsciously: exploiting surface texture for grip, using gravity assists, pre-shaping the hand during approach based on visual affordances, and adapting grip force dynamically during manipulation. Real human HOI data encodes these implicit strategies. The most effective pipeline pre-trains on simulation for coverage and fine-tunes on real human demonstrations for strategy quality."
    },
    {
      misconception: "You need motion capture equipment to collect useful HOI data.",
      correction: "Modern markerless hand pose estimators like FrankMocap and HaMeR achieve 10-15mm accuracy from monocular RGB video, sufficient for many robotics applications. Egocentric cameras like GoPro or Meta Quest Pro headsets can capture naturalistic HOI data without any instrumentation. For contact detection, proxy signals like hand-object distance thresholds (from estimated 3D hand and object poses) replace direct contact sensing in many pipelines. Purpose-built data collection rigs with depth cameras further improve accuracy without mocap infrastructure."
    },
  ],
  keyPapers: [
    {
      id: "taheri-grab-2020",
      title: "GRAB: A Dataset of Whole-Body Human Grasping of Objects",
      authors: "Taheri et al.",
      venue: "ECCV 2020",
      year: 2020,
      url: "https://arxiv.org/abs/2008.11200",
    },
    {
      id: "brahmbhatt-contactpose-2020",
      title: "ContactPose: A Dataset of Grasps with Object Contact and Hand Pose",
      authors: "Brahmbhatt et al.",
      venue: "ECCV 2020",
      year: 2020,
      url: "https://arxiv.org/abs/2007.09545",
    },
    {
      id: "yang-oakink-2022",
      title: "OakInk: A Large-scale Knowledge Repository for Understanding Hand-Object Interaction",
      authors: "Yang et al.",
      venue: "CVPR 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2203.15709",
    },
    {
      id: "qin-dexmv-2022",
      title: "DexMV: Imitation Learning for Dexterous Manipulation from Human Videos",
      authors: "Qin et al.",
      venue: "ECCV 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2108.05877",
    },
    {
      id: "kwon-h2o-2021",
      title: "H2O: Two Hands Manipulating Objects for First Person Interaction Recognition",
      authors: "Kwon et al.",
      venue: "ICCV 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2104.11181",
    },
  ],
  claruRelevance: "Claru's data collection infrastructure is purpose-built for capturing the diverse, real-world hand-object interaction data that dexterous robotics demands. Our 10,000+ collectors across 100+ cities record egocentric manipulation video in authentic environments — kitchens, warehouses, retail floors, and workshops — using standardized camera rigs with depth sensing. This geographic and environmental diversity produces HOI data spanning thousands of unique objects, manipulation strategies, and interaction contexts that single-lab captures cannot match. Claru's annotation pipeline labels hand keypoints, object poses, contact states, grasp taxonomy classes, and temporal action phases, with multi-annotator redundancy enforcing consistency. For teams building dexterous robot policies via hand-to-robot retargeting or visual affordance learning, Claru provides the volume and variety of human demonstration data that bridges the gap between lab prototypes and production deployment.",
};

export default data;
