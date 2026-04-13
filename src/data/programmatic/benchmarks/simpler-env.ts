import type { BenchmarkPageData } from "./types";
const page: BenchmarkPageData = {
  "slug": "simpler-env",
  "benchmarkName": "SimplerEnv",
  "benchmarkDescription": "SimplerEnv is an evaluation framework designed to bridge simulation and real-world robot evaluation. Created by researchers at UC San Diego and UC Berkeley, it provides simulated replicas of real evaluation setups (Google's RT evaluation suite, Bridge environments) to enable reproducible benchmarking that correlates with real-world performance.",
  "taskSet": "Faithful simulated replicas of Google RT evaluation tasks (pick, move, open/close drawer) and Bridge V2 tabletop manipulation tasks. Tasks use exact 3D scans of real evaluation objects and workspace layouts.",
  "observationSpace": "RGB images from camera poses matching real evaluation setups, proprioceptive state matching real robot configurations.",
  "actionSpace": "Matching the real robot action spaces (RT-1 and Bridge platforms) with calibrated dynamics.",
  "evaluationProtocol": "Success rate in simulation measured for correlation with real-world success rate. The benchmark validates itself by demonstrating that simulated evaluation rankings match real-world rankings.",
  "simToRealGap": "SimplerEnv explicitly minimizes sim-to-real gap by using 3D scans of real evaluation objects and calibrated dynamics. However, the correlation is imperfect — some policies rank differently in sim vs. real, revealing residual gaps in contact dynamics, lighting, and object material properties.",
  "realWorldDataNeeds": "Real-world evaluation data from the exact setups SimplerEnv replicates (Google RT stations, Bridge environments). Calibration data to improve sim-real correlation. Data from new evaluation setups to extend SimplerEnv coverage.",
  "complementaryDatasets": [
    {
      "name": "Manipulation Trajectory Dataset",
      "rationale": "Real-world manipulation recordings provide calibration ground-truth for improving SimplerEnv's sim-real correlation on specific task categories."
    },
    {
      "name": "Custom Evaluation Setup Replication",
      "rationale": "Data collected on exact replicas of evaluation setups helps validate and improve SimplerEnv's simulation fidelity."
    },
    {
      "name": "Egocentric Activity Dataset",
      "rationale": "Diverse real-world visual data provides context for understanding where visual sim-to-real gaps persist."
    }
  ],
  "keyPapers": [
    {
      "id": "li-simpler-2024",
      "title": "Evaluating Real-World Robot Manipulation Policies in Simulation",
      "authors": "Li et al.",
      "venue": "CoRL 2024",
      "year": 2024,
      "url": "https://arxiv.org/abs/2405.05941"
    },
    {
      "id": "brohan-rt1-2023",
      "title": "RT-1: Robotics Transformer for Real-World Control at Scale",
      "authors": "Brohan et al.",
      "venue": "RSS 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2212.06817"
    },
    {
      "id": "walke-bridge-v2-2024",
      "title": "BridgeData V2: A Dataset for Robot Learning at Scale",
      "authors": "Walke et al.",
      "venue": "CoRL 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2308.12952"
    }
  ],
  "technicalAnalysis": `SimplerEnv takes a novel approach to the sim-to-real problem: rather than trying to make simulation perfectly realistic, it aims to make simulation a reliable predictor of real-world performance. If simulation rankings correlate with real-world rankings, researchers can use simulation for rapid evaluation without physical robots.

The approach is promising but imperfect. SimplerEnv demonstrates 0.8+ correlation between simulated and real success rates for some policy families, but the correlation drops for policies that are sensitive to contact dynamics or visual details that simulation approximates poorly.

Improving correlation requires real-world calibration data — measurements of actual object friction, weight, and compliance that can tune simulation parameters. Each calibration measurement improves the fidelity of simulated evaluation across all future experiments.

Claru can provide both calibration data (physical measurements of objects and surfaces) and validation data (real-world policy evaluations that verify simulation predictions). This two-pronged data approach improves SimplerEnv's reliability as a real-world performance predictor.`,
  "metaTitle": "Real-World Data for SimplerEnv Evaluation Framework | Claru",
  "metaDescription": "Calibration, validation, and evaluation setup data for SimplerEnv's sim-real correlation framework for robot manipulation policy evaluation.",
  "primaryKeyword": "SimplerEnv real-world data",
  "secondaryKeywords": [
    "SimplerEnv calibration data",
    "sim-real correlation data",
    "robot evaluation data",
    "SimplerEnv benchmark"
  ],
  "canonicalPath": "/benchmarks/simpler-env",
  "h1": "Real-World Data for SimplerEnv",
  "heroSubtitle": "SimplerEnv predicts real-world robot performance from simulation. Real-world calibration data makes those predictions more accurate.",
  "breadcrumbs": [
    {
      "label": "Home",
      "href": "/"
    },
    {
      "label": "Benchmarks",
      "href": "/benchmarks"
    },
    {
      "label": "SimplerEnv",
      "href": "/benchmarks/simpler-env"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "SimplerEnv at a Glance",
      "stats": [
        { "value": "0.8+", "label": "Sim-Real Correlation" },
        { "value": "RT-1/RT-2", "label": "Replicated Setups" },
        { "value": "Bridge V2", "label": "Replicated Setup" },
        { "value": "ManiSkill2", "label": "Simulation Backend" },
        { "value": "2024", "label": "Released" }
      ]
    },
    {
      "type": "prose",
      "heading": "What Is SimplerEnv?",
      "paragraphs": [
        "SimplerEnv is a simulation-based evaluation framework created by Li et al. at UC San Diego and UC Berkeley, presented at CoRL 2024. Unlike traditional benchmarks that propose new tasks, SimplerEnv creates faithful simulated replicas of existing real-world evaluation setups — specifically Google's RT evaluation stations and the Bridge V2 tabletop environments.",
        "The core idea is that if simulated evaluation rankings reliably predict real-world rankings, researchers can iterate much faster. Instead of testing every policy variant on physical hardware (expensive, slow, error-prone), they test in SimplerEnv and only deploy the most promising candidates on real robots.",
        "SimplerEnv achieves this by using 3D scans of actual evaluation objects, calibrated camera poses matching real setups, and SAPIEN/ManiSkill2 physics tuned to match measured real-world dynamics. The result is a simulation environment that does not aim for general realism but for specific correlation with particular real-world evaluation setups."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Replicated Evaluation Setups",
      "description": "SimplerEnv faithfully replicates specific real-world robot evaluation stations, matching objects, cameras, and workspace geometry.",
      "columns": ["Setup", "Robot", "Tasks", "Sim-Real Correlation"],
      "rows": [
        { "Setup": "Google RT Station", "Robot": "Google Robot (Everyday Robots)", "Tasks": "Pick, move, drawer open/close", "Sim-Real Correlation": "0.8+ on supported policies" },
        { "Setup": "Bridge V2 Tabletop", "Robot": "WidowX 250", "Tasks": "Tabletop manipulation with diverse objects", "Sim-Real Correlation": "0.7-0.8 depending on task" }
      ]
    },
    {
      "type": "prose",
      "heading": "Evaluation Protocol",
      "paragraphs": [
        "SimplerEnv evaluates policies using the same metrics as the real evaluation setups it replicates — success rate over deterministic evaluation episodes with fixed initial conditions. The key output is not the absolute success rate but the rank ordering of policies: does the policy that performs best in SimplerEnv also perform best on real hardware?",
        "Rank correlation (Spearman's rho) between simulated and real success rates is the primary validation metric. A correlation above 0.8 means SimplerEnv can reliably identify the best policy variant without physical testing. The correlation is validated by running a set of known policies in both simulation and reality and comparing rankings.",
        "SimplerEnv also reports the absolute success rate gap — how much simulated performance overestimates or underestimates real performance. This gap varies by policy architecture, with some policies showing consistent offsets (simulation always overestimates by 10-15%) while others show inconsistent gaps that limit SimplerEnv's predictive value."
      ]
    },
    {
      "type": "prose",
      "heading": "Bridging Simulated Evaluation to Real Deployment",
      "paragraphs": [
        "SimplerEnv's correlation is strong but imperfect. Policies that are sensitive to contact dynamics (grasping deformable objects, insertion tasks) show lower correlation because the physics gap between simulation and reality is largest for these interactions. Policies that rely primarily on visual processing (object detection, spatial reasoning) correlate better because SimplerEnv's 3D scans provide good visual fidelity.",
        "Improving correlation requires real-world calibration data — measurements of actual object properties (weight, friction, center of mass) and sensor characteristics (camera noise profile, depth accuracy) that tune simulation parameters. Each calibration measurement improves fidelity across all future experiments, making calibration data a high-leverage investment.",
        "SimplerEnv is most valuable as a filter, not a replacement for real evaluation. By screening hundreds of policy variants in simulation and selecting the top 5-10 for real testing, teams can reduce physical testing costs by 10-20x while maintaining high probability of finding the best-performing policy.",
        "Claru can provide both calibration data (physical measurements of evaluation objects and surfaces) and validation data (real-world policy evaluations that verify simulation predictions), improving SimplerEnv's reliability as a performance predictor."
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Supports SimplerEnv Users",
      "paragraphs": [
        "Claru provides the real-world data that makes SimplerEnv more accurate and extends its coverage. Our calibration data — physical measurements of object properties and environmental conditions — tunes simulation parameters for better sim-real correlation.",
        "For teams extending SimplerEnv to new evaluation setups beyond Google RT and Bridge V2, Claru can collect the reference data needed: 3D scans of evaluation objects, calibrated camera measurements, and baseline real-world policy evaluations that validate new simulated environments.",
        "Our manipulation trajectory dataset also provides ground-truth data for tasks where SimplerEnv's correlation is weakest — contact-rich interactions where physics fidelity matters most. This data helps identify which simulation parameters need the most improvement for a given task category."
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        { "id": "li-simpler-2024", "title": "Evaluating Real-World Robot Manipulation Policies in Simulation", "authors": "Li et al.", "venue": "CoRL 2024", "year": 2024, "url": "https://arxiv.org/abs/2405.05941" },
        { "id": "brohan-rt1-2023", "title": "RT-1: Robotics Transformer for Real-World Control at Scale", "authors": "Brohan et al.", "venue": "RSS 2023", "year": 2023, "url": "https://arxiv.org/abs/2212.06817" },
        { "id": "walke-bridge-v2-2024", "title": "BridgeData V2: A Dataset for Robot Learning at Scale", "authors": "Walke et al.", "venue": "CoRL 2023", "year": 2023, "url": "https://arxiv.org/abs/2308.12952" }
      ]
    }
  ],
  "faqs": [
    {
      "question": "How does SimplerEnv differ from other benchmarks?",
      "answer": "Instead of proposing new tasks, SimplerEnv creates faithful simulated replicas of existing real-world evaluation setups. Its goal is reliable correlation between simulated and real performance, enabling rapid evaluation without physical robots."
    },
    {
      "question": "Why is sim-real correlation important?",
      "answer": "If simulation rankings reliably predict real-world rankings, researchers can evaluate hundreds of policy variants in simulation and only test the best ones on real robots. This dramatically accelerates research iteration while reducing physical hardware requirements."
    },
    {
      "question": "How does calibration data improve SimplerEnv?",
      "answer": "Measuring real object properties (friction, weight, compliance) and real sensor characteristics (noise, distortion) tunes simulation parameters. Better calibration improves the correlation between simulated and real performance across all future experiments."
    },
    {
      "question": "Which policies show poor sim-real correlation in SimplerEnv?",
      "answer": "Policies that rely heavily on contact dynamics — grasping deformable objects, tight-tolerance insertion, force-sensitive manipulation — show lower correlation because physics simplifications have the largest impact on these tasks. Policies that primarily use visual reasoning for spatial planning correlate better because SimplerEnv's 3D scans provide good visual fidelity."
    },
    {
      "question": "Can SimplerEnv replace real-world testing entirely?",
      "answer": "No. SimplerEnv is a filter, not a replacement. It reliably identifies the best policy variants from a large pool, reducing real-world testing costs by 10-20x. But final deployment validation must still happen on real hardware because the residual sim-real gap can affect performance in ways that simulation cannot predict."
    }
  ],
  "ctaHeading": "Calibrate Simulation Against Reality",
  "ctaDescription": "Discuss real-world calibration and validation data for improving SimplerEnv's sim-real correlation.",
  "relatedGlossaryTerms": [
    "sim-to-real-gap",
    "domain-randomization",
    "manipulation-trajectory"
  ],
  "relatedGuidePages": [
    "how-to-evaluate-sim-to-real-transfer",
    "how-to-bridge-sim-to-real-gap"
  ],
  "relatedSolutionSlugs": []
};
export default page;
