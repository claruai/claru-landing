---
type: company
state: prospect
side: demand
name: RoboForce
slug: roboforce
domain: roboforce.ai
attio_id: null
relationship: demand-side
vertical: physical-ai
icp_score: 85
stage: researched
tags: [active-pipeline, industrial-robotics, physical-ai-data, data-flywheel, nvidia-blueprint, $52M, cmu-alumni, amazon-robotics-alumni, waymo-alumni]
last_enriched: 2026-04-05
email_status: contacted
last_contact:
last_updated: 2026-04-13
---

## Overview

RoboForce is building physical AI robots for industrial/factory labor — founded in 2023 by a team from CMU, UMich, Amazon Robotics, Google, Waymo, Cruise, Tesla Robotics, ABB, and Apple. They raised $52M in March 2026 (oversubscribed, $67M total). Their core thesis: a continuous "AI data flywheel" combining real-world robot operational data + simulation to compound intelligence across deployments. They are early adopters of NVIDIA's Physical AI Data Factory Blueprint. The checklist lists "physical world training corpus" as their key product context — they are a data-intensive physical AI company.

## Evidence Card

| Field | Value |
|-------|-------|
| Founded | 2023 |
| Funding | $67M total. $52M latest round (March 2026, oversubscribed). |
| Size | ~50-100 (est.) |
| CEO | Undisclosed (founded by alumni from CMU, UMich, Amazon Robotics, Google, Waymo, Cruise, Tesla, ABB, Apple) |
| Location | Undisclosed (likely SF Bay Area / Pittsburgh given CMU + Waymo connections) |
| Clients | Industrial/factory labor customers (undisclosed) |
| Key product | Physical AI industrial robots + robot foundation model + AI data flywheel |

## Key People

| Name | Title | Email | Confidence |
|------|-------|-------|------------|
| (Founder/CEO name not found in public sources) | CEO | — | Low |

## Hiring Signals

$52M raise, oversubscribed, active hiring. Industrial robotics companies at this stage need data engineers, ML researchers, and operations staff.

## What They've Actually Shipped

- **Physical AI industrial robots**: Built for "dirty, dangerous factory jobs" — heavy industry, manufacturing, warehousing.
- **Robot foundation model**: Trained on real-world operational data + simulation (closed-loop data flywheel).
- **AI Data Flywheel**: Continuous system combining fleet operational data + synthetic simulation to compound intelligence.
- **NVIDIA Physical AI Data Factory Blueprint integration**: Among the first adopters of NVIDIA's blueprint for building physical AI training data pipelines. Running on Nebius infrastructure.
- **Revenue-generating deployments**: Implied by "robo-labor" positioning and industrial customer references.

## Data Gap / Relationship

RoboForce explicitly builds their AI on a "physical world training corpus" — their flywheel starts with real-world data from deployed robots. But early in deployment (before enough robots exist to generate self-sustaining data), they need external human demonstration data to bootstrap their foundation model. Claru's egocentric + industrial task video can accelerate their foundation model training before the flywheel has enough data of its own. Also: Claru's diverse environments (100+ cities, multiple industrial scenarios) broaden RoboForce's training distribution beyond their initial deployment sites.

## Pitch Angle

Lead with the bootstrap problem: "Before your data flywheel generates enough real-world data to be self-sustaining, foundation model training needs external human demonstration video. We've collected industrial-task egocentric footage across diverse environments — exactly the distribution bootstrapping material that closes the gap before your fleet reaches scale." Position Claru as complementary to (not competing with) their internal data flywheel. This is a technical, credible pitch for a technically-sophisticated team.

## Related Companies

- [physical-intelligence](physical-intelligence.md) — Physical AI foundation model lab
- [mind-robotics](mind-robotics.md) — Industrial robotics spinout (Rivian)
- [rhoda-ai](rhoda-ai.md) — Manufacturing/logistics robotics

## Sources

- [SiliconAngle: RoboForce raises $52M (March 2026)](https://siliconangle.com/2026/03/16/roboforce-raises-52m-develop-physical-ai-robots-industrial-labor/)
- [BusinessWire: RoboForce $52M announcement](https://www.businesswire.com/news/home/20260316568211/en/RoboForce-Raises-$52M-to-Scale-Physical-AI-Robo-Labor)
- [TechFundingNews: RoboForce $52M for industrial labor](https://techfundingnews.com/as-industrial-labour-shortages-grow-roboforce-grabs-52m-for-ai-robots/)
- [RoboForce homepage](https://www.roboforce.ai/)
- [NVIDIA Physical AI Data Factory Blueprint (RoboForce as early adopter)](https://nvidianews.nvidia.com/news/nvidia-announces-open-physical-ai-data-factory-blueprint-to-accelerate-robotics-vision-ai-agents-and-autonomous-vehicle-development)
- Internal: pipeline-status.md
