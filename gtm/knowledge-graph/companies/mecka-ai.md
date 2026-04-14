---
type: company
state: prospect
side: supply
name: Mecka AI
slug: mecka-ai
domain: mecka.ai
attio_id: null
relationship: supply-side-target
vertical: physical-ai-data
icp_score: 95
stage: researched
tags: [egocentric, robotics, collection, funded-2025, gig-model, scale-ai-partner, canada]
last_enriched: 2026-04-05
email_status: not-sent
last_contact:
last_updated: 2026-04-13
---

## Overview

Mecka AI is building the "Scale AI of robotics data." They hire gig workers (baristas, cooks, mechanics) to film themselves performing daily tasks using iPhones, then analyze and label the raw video for robotics companies. Founded 2024 by Josh Gao. Canada-based.

## Evidence Card

| Field | Value |
|-------|-------|
| Founded | 2024 |
| Funding | $8M seed (Neo, SV Angel, A-Star, Cade, Offline VC) Aug 2025. Conflicting reports of $40M also Aug 2025. |
| Size | ~15 employees |
| CEO | Josh Gao (Ivey Business School, zero robotics background) |
| Location | Canada |
| Clients | 1X Technologies (confirmed). 4 "leading research labs" via EgoVerse partnership. |
| Key product | EgoVerse dataset (egocentric human data for robot learning) |
| Partners | Scale AI (co-launched EgoVerse), Stanford, UCSD, Zurich, Meta Reality Labs |

## Key People

| Name | Title | Email | Confidence |
|------|-------|-------|------------|
| Josh Gao | CEO | josh@mecka.ai | Pattern-derived, not verified |
| Jason Chong | — | — | LinkedIn found |
| Eric Lok | — | — | LinkedIn found |

## Hiring Signals

- Ashby careers page exists (jobs.ashbyhq.com/mecka.ai) but no specific "data annotator" or "data collector" postings found in web search as of 2026-04-05
- Their model IS gig-worker collection, so they recruit contributors through the platform, not traditional job postings
- Hardware team "still being hired" per earlier research

## What They've Actually Shipped

- ~1,300 hrs via EgoVerse (Scale AI partnership)
- 30K hrs proprietary claimed
- iPhone-based gig collection in "mostly Canada"
- Custom rig deployed to Canada
- Automated annotation pipelines (no human QA layer mentioned)
- Open-source EgoVerse: egocentric video + hand/camera tracking + dense language annotations

## Data Gap (why they'd need Claru)

1. **No industrial/factory capability.** Their gig workers film daily life, not industrial environments
2. **No stereo depth or IMU.** iPhone-only capture lacks the sensor richness frontier labs need
3. **No human QA.** Automated annotation only. Quality ceiling on complex manipulation tasks
4. **Canada-centric.** Hardware deployment mostly in Canada. Any non-NA request exceeds their model
5. **Single client dependency.** Only confirmed client is 1X Technologies

## Pitch Angle (subcontractor)

"Your 1X client will scale. When they ask for industrial environments, multi-sensor capture, or geographies outside Canada, your iPhone rig can't cover it. We handle that piece. 2,000+ collectors, 100+ cities, annotation pipeline built for video/robotics."

## Competitive Position

- Direct comparison: Mecka = gig-economy collection (low cost, high volume, lower quality), Claru = protocol-grade collection (trained collectors, controlled environments, dense annotations)
- Mecka's EgoVerse academic partnership gives them credibility but also locks them into open-source which limits enterprise
- Their $40M (if real) means they'll try to build everything in-house. The window to pitch subcontract is NOW, before they scale ops.

## Email Thread

No outreach sent yet. Not in Attio. Email not verified.

## Related Companies

- [1x-technologies](1x-technologies.md) — Mecka's client, our demand-side target
- [build-ai](build-ai.md) — Similar upstart, raw MP4 without annotation
- [cortex-ai](cortex-ai.md) — Similar upstart, YC, nothing shipped
- [avala-ai](avala-ai.md) — Competitor doing exactly what we do

## Sources

- [Robotics Data Startup Mecka AI Raises $8 Million](https://www.upstartsmedia.com/p/mecka-ai-robotics-data-startup)
- [Mecka AI Secures $40M](https://www.trysignalbase.com/news/funding/mecka-ai-secures-40m-to-revolutionize-human-data-for-ai-and-robotics-training)
- [EgoVerse — Scale AI blog](https://scale.com/blog/egoverse)
- [Josh Gao on X re: EgoVerse](https://x.com/joshavata/status/2036121879426261457)
- [Mecka on Tracxn](https://tracxn.com/d/companies/mecka/__1AgRVfULX1BNMF6I9Gx8V39V7OTT-ec_mmklEND0s_E)
