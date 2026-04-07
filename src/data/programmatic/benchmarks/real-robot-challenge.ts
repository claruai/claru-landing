import type { BenchmarkPageData } from "./types";
const page: BenchmarkPageData = {
  "slug": "real-robot-challenge",
  "benchmarkName": "Real Robot Challenge",
  "benchmarkDescription": "The Real Robot Challenge (RRC) is a unique benchmark that provides remote access to real TriFinger robot platforms for evaluation. Organized by the Max Planck Institute, it allows researchers worldwide to submit policies that are evaluated on actual physical hardware — eliminating the sim-to-real gap in evaluation while highlighting it in training.",
  "taskSet": "Dexterous manipulation with the TriFinger platform: object repositioning (move cube to target pose), in-hand manipulation (rotate cube to target orientation), and object pushing. Tasks evaluated on real hardware with real contact dynamics.",
  "observationSpace": "RGB images from 3 cameras, joint positions and velocities (9 joints), fingertip positions, and object pose estimated from vision.",
  "actionSpace": "9-DOF joint position targets for the three TriFinger fingers.",
  "evaluationProtocol": "Cumulative reward on real hardware over evaluation episodes. Policies are uploaded and executed on remote real robots, providing ground-truth real-world performance without sim-to-real gap in evaluation.",
  "simToRealGap": "RRC inverts the typical benchmark paradigm: evaluation is on real hardware, so there is no sim-to-real gap in evaluation. Instead, the challenge is in training — participants typically train in simulation and must achieve robust sim-to-real transfer. The benchmark reveals which training strategies actually transfer to real dexterous manipulation.",
  "realWorldDataNeeds": "Real-world TriFinger manipulation data for improving sim-to-real transfer in training. Dexterous manipulation recordings with diverse objects beyond cubes. Multi-finger coordination data showing human-level dexterity for pretraining manipulation representations.",
  "complementaryDatasets": [
    {
      "name": "Custom Dexterous Manipulation Collection",
      "rationale": "Purpose-collected multi-finger manipulation data provides training signal for the TriFinger's specific kinematic structure and contact dynamics."
    },
    {
      "name": "Egocentric Activity Dataset",
      "rationale": "Human hand manipulation provides visual pretraining data showing dexterous coordination that transfers to multi-finger robot control."
    },
    {
      "name": "Manipulation Trajectory Dataset",
      "rationale": "Diverse real-world manipulation recordings provide general manipulation understanding that complements TriFinger-specific data."
    }
  ],
  "keyPapers": [
    {
      "id": "guertler-rrc-2023",
      "title": "Benchmarking Dexterous Manipulation on Real Robots",
      "authors": "Guertler et al.",
      "venue": "RSS Workshop 2023",
      "year": 2023,
      "url": "https://real-robot-challenge.com/"
    },
    {
      "id": "allshire-trifinger-2022",
      "title": "Transferring Dexterous Manipulation from GPU Simulation to a Remote Real-World TriFinger",
      "authors": "Allshire et al.",
      "venue": "IROS 2022",
      "year": 2022,
      "url": "https://arxiv.org/abs/2108.09779"
    },
    {
      "id": "chen-dexhand-2023",
      "title": "Visual Dexterity: In-Hand Reorientation of Novel Objects",
      "authors": "Chen et al.",
      "venue": "ICRA 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2211.11744"
    }
  ],
  "technicalAnalysis": `The Real Robot Challenge uniquely combines remote hardware access with standardized evaluation. Researchers worldwide can test their policies on identical TriFinger hardware, eliminating the variability introduced by different labs using different robots. This standardization makes RRC results the most reliable indicator of actual policy performance.

RRC's historical results reveal stark realities about sim-to-real transfer. Policies that achieve near-perfect performance in TriFinger simulation often lose 30-60% of their success rate on real hardware. The primary failure modes are contact dynamics (finger-object friction), object state estimation (vision-based pose tracking errors), and actuator response (real motors have delay and backlash).

This benchmark highlights the value of real-world manipulation data not for evaluation but for training. Teams that incorporate real robot data into their training pipeline — either through real-world fine-tuning or sim-to-real calibration — consistently outperform pure simulation-trained approaches.

Claru can provide dexterous manipulation data that supports RRC participants' training pipelines. While TriFinger-specific data is valuable, broader dexterous manipulation data (including human hand manipulation) provides transferable representations for multi-finger coordination and object manipulation.`,
  "metaTitle": "Real-World Data for Real Robot Challenge (RRC) | Claru",
  "metaDescription": "Dexterous manipulation, sim-to-real calibration, and multi-finger coordination data for the Real Robot Challenge's remote hardware evaluation platform.",
  "primaryKeyword": "Real Robot Challenge data",
  "secondaryKeywords": [
    "RRC training data",
    "TriFinger manipulation data",
    "dexterous robot challenge data",
    "real robot evaluation data"
  ],
  "canonicalPath": "/benchmarks/real-robot-challenge",
  "h1": "Real-World Data for Real Robot Challenge",
  "heroSubtitle": "RRC evaluates on real hardware. The challenge is training policies that survive the transition from simulation to physical TriFinger robots.",
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
      "label": "Real Robot Challenge",
      "href": "/benchmarks/real-robot-challenge"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "Real Robot Challenge at a Glance",
      "stats": [
        { "value": "Real HW", "label": "Evaluation Setting" },
        { "value": "TriFinger", "label": "Robot Platform" },
        { "value": "9-DOF", "label": "Action Space (3x3 joints)" },
        { "value": "Remote", "label": "Access Model" },
        { "value": "30-60%", "label": "Typical Sim-to-Real Drop" },
        { "value": "MPI", "label": "Organizer" }
      ]
    },
    {
      "type": "prose",
      "heading": "What Is the Real Robot Challenge?",
      "paragraphs": [
        "The Real Robot Challenge (RRC) is a unique benchmark organized by the Max Planck Institute for Intelligent Systems that provides remote access to real TriFinger robot platforms for evaluation. Researchers worldwide submit trained policies that are executed on identical physical hardware, eliminating sim-to-real gap in evaluation while exposing it in training.",
        "The TriFinger platform has three independently actuated fingers with 3 joints each (9 DOF total), enabling dexterous manipulation of objects through multi-finger coordination. The standardized hardware ensures that all participants are evaluated under identical physical conditions, making results directly comparable across labs and methods.",
        "RRC inverts the typical benchmark paradigm: instead of evaluating in simulation and hoping policies transfer, it evaluates on real hardware and challenges participants to develop training methods that achieve robust sim-to-real transfer. The benchmark's historical results provide the most reliable data on how much performance policies actually lose during transfer."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "RRC Task Categories",
      "description": "RRC tasks test different aspects of dexterous manipulation, each with distinct sim-to-real challenges.",
      "columns": ["Task", "Objective", "Key Challenge", "Typical Sim-to-Real Drop"],
      "rows": [
        { "Task": "Cube Repositioning", "Objective": "Move cube to target position", "Key Challenge": "Finger-object friction coordination", "Typical Sim-to-Real Drop": "30-40%" },
        { "Task": "Cube Reorientation", "Objective": "Rotate cube to target orientation", "Key Challenge": "In-hand manipulation, contact state tracking", "Typical Sim-to-Real Drop": "40-60%" },
        { "Task": "Object Pushing", "Objective": "Push object to target without lifting", "Key Challenge": "Surface friction, pushing direction control", "Typical Sim-to-Real Drop": "20-35%" }
      ]
    },
    {
      "type": "prose",
      "heading": "Evaluation Protocol",
      "paragraphs": [
        "RRC evaluates policies by cumulative reward on real hardware over standardized evaluation episodes. Participants upload trained policy code to the RRC servers, which execute the policy on physical TriFinger robots. Results include per-episode performance, variance across trials, and comparison to baselines — all measured on real hardware.",
        "The remote evaluation model enables worldwide participation without requiring each lab to own a TriFinger platform. It also ensures standardized conditions — the same robot calibration, lighting, camera setup, and object properties across all evaluations. This eliminates the hardware variability that makes cross-lab comparison of real-world results unreliable.",
        "Multiple competition phases have tested different task difficulties and policy submission formats, building a longitudinal dataset of sim-to-real transfer quality across years of submissions."
      ]
    },
    {
      "type": "prose",
      "heading": "What RRC Reveals About Sim-to-Real Transfer",
      "paragraphs": [
        "RRC's historical results provide stark evidence about the sim-to-real gap. Policies that achieve near-perfect performance in TriFinger simulation typically lose 30-60% of their reward on real hardware. The primary failure modes are consistent across submissions: finger-object friction (real contact is stickier and less predictable than simulated), object state estimation (vision-based pose tracking has latency and noise), and actuator response (real motors have delay and backlash that simulation ignores).",
        "Teams that incorporate real-world data into their training — through system identification, domain randomization calibrated to real measurements, or direct real-world fine-tuning — consistently outperform pure simulation approaches. This empirical evidence from standardized real-world evaluation provides the strongest case for the value of real-world training data in dexterous manipulation.",
        "The in-hand reorientation task shows the largest sim-to-real gap because it requires continuous contact management — maintaining grip while rotating the cube. Small friction modeling errors accumulate through the rotation, causing the cube to slip or jam. Real-world contact data for calibrating simulation friction models is the most impactful data investment for this task.",
        "Claru can provide dexterous manipulation data that supports RRC participants' training pipelines. While TriFinger-specific data is most directly useful, broader dexterous manipulation data (including human hand manipulation) provides transferable representations for multi-finger coordination."
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Supports RRC Participants",
      "paragraphs": [
        "Claru provides dexterous manipulation data for training policies that must transfer to real TriFinger hardware. Our egocentric activity dataset captures human multi-finger manipulation of small objects, providing visual pretraining data showing the adaptive grip strategies that dexterous policies need to learn.",
        "For teams building sim-to-real calibration pipelines, Claru can collect physical property measurements — friction coefficients of common manipulation surfaces, actuator response profiles, and camera calibration data — that improve simulation fidelity for TriFinger training environments.",
        "Our collection network can also capture multi-finger manipulation demonstrations on diverse objects beyond cubes, expanding the training distribution to build general dexterous skills that transfer better than task-specific simulation training."
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        { "id": "guertler-rrc-2023", "title": "Benchmarking Dexterous Manipulation on Real Robots", "authors": "Guertler et al.", "venue": "RSS Workshop 2023", "year": 2023, "url": "https://real-robot-challenge.com/" },
        { "id": "allshire-trifinger-2022", "title": "Transferring Dexterous Manipulation from GPU Simulation to a Remote Real-World TriFinger", "authors": "Allshire et al.", "venue": "IROS 2022", "year": 2022, "url": "https://arxiv.org/abs/2108.09779" },
        { "id": "chen-dexhand-2023", "title": "Visual Dexterity: In-Hand Reorientation of Novel Objects", "authors": "Chen et al.", "venue": "ICRA 2023", "year": 2023, "url": "https://arxiv.org/abs/2211.11744" }
      ]
    }
  ],
  "faqs": [
    {
      "question": "Why is evaluating on real hardware important?",
      "answer": "Simulation evaluation cannot reveal real-world failure modes. Policies that score perfectly in simulation often lose 30-60% performance on real hardware due to unmodeled contact dynamics, actuator delays, and vision noise. RRC's real hardware evaluation provides ground-truth performance measurements."
    },
    {
      "question": "What makes the TriFinger platform challenging?",
      "answer": "TriFinger has three fingers with 3 joints each (9 DOF total), creating a high-dimensional contact space for object manipulation. Multi-finger coordination requires precise timing and force distribution that simulation models imperfectly — making sim-to-real transfer particularly difficult."
    },
    {
      "question": "How does real dexterous data help RRC participants?",
      "answer": "Teams that incorporate real robot data — through fine-tuning or simulation calibration — consistently outperform pure simulation approaches. Real dexterous manipulation data provides authentic contact dynamics, actuator response characteristics, and vision noise that improve training for RRC."
    },
    {
      "question": "Why does in-hand reorientation show the largest sim-to-real gap?",
      "answer": "In-hand reorientation requires continuous contact management — maintaining grip while rotating the object. Small friction modeling errors accumulate through the rotation, causing slips or jams that do not occur in simulation. This task amplifies every physics modeling inaccuracy because the contact state changes continuously throughout the manipulation."
    },
    {
      "question": "Can anyone participate in the Real Robot Challenge?",
      "answer": "Yes. RRC provides remote access to physical TriFinger robots — participants submit trained policy code that is executed on real hardware. This means any researcher worldwide can evaluate on standardized real robots without owning the hardware, democratizing access to real-world benchmarking."
    }
  ],
  "ctaHeading": "Data for Dexterous Manipulation",
  "ctaDescription": "Discuss dexterous manipulation data for training policies that transfer to real TriFinger hardware.",
  "relatedGlossaryTerms": [
    "dexterous-manipulation",
    "sim-to-real-gap",
    "hand-object-interaction",
    "contact-rich-manipulation"
  ],
  "relatedGuidePages": [
    "how-to-collect-dexterous-manipulation-data",
    "how-to-bridge-sim-to-real-gap"
  ],
  "relatedSolutionSlugs": []
};
export default page;
