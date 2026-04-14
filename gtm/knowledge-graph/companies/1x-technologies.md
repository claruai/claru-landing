---
type: company
state: prospect
side: demand
name: 1X Technologies
slug: 1x-technologies
domain: 1x.tech
attio_id: null
relationship: demand-side
vertical: physical-ai
icp_score: 88
stage: researched
tags: [active-pipeline, humanoid, home-robot, NEO, EVE, openai-backed, norway, palo-alto, bernt-bornich, eqt-ventures, series-b, world-model]
last_enriched: 2026-04-05
email_status: contacted
last_contact:
last_updated: 2026-04-13
---

## Overview

1X Technologies (formerly Halodi Robotics) is a Norwegian-American humanoid robotics company building robots for industrial and home environments. Founded in 2014 by Bernt Øivind Børnich, backed by OpenAI Startup Fund. Two products: EVE (wheeled, industrial/security) and NEO (bipedal, home use — available for pre-order at $20K or $499/month). HQ moved from Norway to Palo Alto in July 2025. Raised $100M Series B (Jan 2024, EQT Ventures + Samsung NEXT). Reportedly seeking $1B at $10B valuation. They have also published an AI world model for robot training.

## Evidence Card

| Field | Value |
|-------|-------|
| Founded | 2014 (as Halodi Robotics, renamed 1X Technologies) |
| Funding | $100M Series B (Jan 2024, EQT Ventures + Samsung NEXT). Seed/Series A from OpenAI Startup Fund, Tiger Global, others. Reportedly seeking $1B at $10B val. |
| Size | ~100-200 (est.) |
| CEO | Bernt Øivind Børnich (founder) |
| Location | Palo Alto, CA (HQ since July 2025); manufacturing in Hayward, CA + Moss, Norway |
| Clients | Industrial and institutional (EVE); consumer pre-orders for NEO (2026 delivery) |
| Key product | NEO (bipedal home humanoid, $20K/$499/mo), EVE (wheeled industrial humanoid) |

## Key People

| Name | Title | Email | Confidence |
|------|-------|-------|------------|
| Bernt Øivind Børnich | CEO / Founder | — | Low |

## Hiring Signals

Moving HQ to Palo Alto + seeking $1B means aggressive hiring. Data collection and robotics engineering roles likely open.

## What They've Actually Shipped

- **EVE**: Wheeled humanoid deployed in industrial, security, and logistics settings. Commercial product.
- **NEO Gamma**: Updated bipedal home humanoid (Feb 2025 update). Slim, human-like design. Pre-orders open (Oct 2025), delivery 2026. $20K early adopter / $499/month subscription.
- **AI World Model**: 1X published a world model specifically for robot training — pre-training on large-scale video data to learn physics, motion, and human action priors. This is a direct signal of their data strategy.
- **Target**: 10,000 NEO robots deployed in 2026 (originally stated for factories, pivoting to homes).

## Data Gap / Relationship

1X published a world model for robot training — they pre-train on video (human action videos) before fine-tuning on robot demonstrations. Their data needs: (1) home environment video — kitchens, living rooms, bedrooms, common household interactions, (2) diverse human action video for world model pre-training, (3) egocentric perspective footage for training NEO to see and interpret home environments from the robot's viewpoint. Claru's residential and egocentric collection is a direct fit. As 1X scales NEO pre-orders (delivery 2026), their data pipeline needs to scale proportionally.

## Pitch Angle

Lead with the home environment angle: "NEO will deploy in homes across NA and Europe. We've collected video from residential environments in 100+ cities — kitchens, living rooms, hallways, with diverse household objects and interaction scenarios. Exactly the distribution your world model needs to generalize across the homes NEO will ship into." Reference their published world model as evidence of their data strategy. This is a sophisticated team that will respect a data-specific pitch.

## Related Companies

- [physical-intelligence](physical-intelligence.md) — Physical AI foundation model (potential collaboration)
- [figure-ai](figure-ai.md) — Humanoid competitor
- [unitree](unitree.md) — Humanoid competitor (lower price point)

## Sources

- [Wikipedia: 1X Technologies](https://en.wikipedia.org/wiki/1X_Technologies)
- [Tech Startups: 1X raising $1B at $10B (Sept 2025)](https://techstartups.com/2025/09/24/norways-1x-raising-1b-at-10b-valuation-to-bring-humanoid-robot-neo-into-homes/)
- [Sifted: OpenAI-backed startup for in-home robots in 2026](https://sifted.eu/articles/1x-humanoid-robot-launch)
- [Maginative: 1X unveils AI World Model for robot training](https://www.maginative.com/article/norwegian-startup-1x-unveils-ai-world-model-for-robot-training/)
- [Interesting Engineering: 1X deploys humanoid robots in factories](https://interestingengineering.com/ai-robotics/1x-to-deploy-humanoid-robots-for-warehouses)
- [TechFundingNews: OpenAI-backed 1X raises $100M](https://techfundingnews.com/humanoid-robots-in-your-living-space-backed-by-open-ai-this-norweigian-startup-just-raised-100m-funding/)
- Internal: pipeline-status.md
