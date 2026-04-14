---
type: company
state: active
side: demand
name: GetReal Labs
slug: getreal-labs
domain: getreallabs.com
attio_id: 8bbf1e3d
relationship: demand-side
vertical: video-gen
icp_score: 52
stage: sample_sent
tags: [active-pipeline, reviewing-samples, deepfake-detection, content-authentication, hany-farid, cybersecurity, forensics, tina-nikoukhah, berkeley]
last_enriched: 2026-04-05
email_status: contacted
last_contact: 
last_updated: 2026-04-13
---

## Overview

GetReal Security (operating as GetReal Labs at getreallabs.com) is a deepfake and synthetic media detection company co-founded by Professor Hany Farid (UC Berkeley, world's leading deepfake detection researcher) along with Ted Schlein and Roger Thornton. They raised $17.5M Series A (March 2025) from Forgepoint Capital, Ballistic Ventures, Evolution Equity, and K2 Access Fund. Hany is an active prospect — he said "I'll have a look today and follow up soon" on March 30 and hasn't followed up. Tina Nikoukhah is also cc'd.

## Evidence Card

| Field | Value |
|-------|-------|
| Founded | 2022 |
| Funding | $17.5M Series A (March 2025). Forgepoint Capital leading; Ballistic Ventures, Evolution Equity, K2 Access Fund |
| Size | ~20-40 (est.) |
| CEO / Co-founder | Hany Farid (UC Berkeley professor, co-founder) |
| Other co-founders | Ted Schlein, Roger Thornton |
| Location | Berkeley / San Francisco, CA |
| Clients | Fortune 500 companies testing deepfake-in-call detection; enterprise security buyers |
| Key product | Forensics-as-a-service platform: Inspect (exec deepfake protection), Protect (media screening), Respond (human analyst team) |

## Key People

| Name | Title | Email | Confidence |
|------|-------|-------|------------|
| Hany Farid | Co-founder (CEO or Chief Scientist) | hany@getreallabs.com | Confirmed (multi-touch thread since Mar 16) |
| Tina Nikoukhah | — | — | Confirmed (cc'd on thread) |
| Ted Schlein | Co-founder | — | Low |
| Roger Thornton | Co-founder | — | Low |

## Hiring Signals

None found for data annotation or collection. Core hiring likely in detection engineering and enterprise sales.

## What They've Actually Shipped

- **Forensics-as-a-Service platform**: Three products — "Inspect" (executive deepfake protection for live video calls), "Protect" (media screening API for organizations), "Respond" (human analyst team doing deeper forensic analysis).
- **Detection toolkit**: Analyzes images, video, audio for AI-generation or manual manipulation signs. Detects real-time live call deepfakes.
- **Web interface + API + integrations**: Live SaaS deployment for enterprise customers including Fortune 500.
- **Lab division** (getreallabs.com): Research-focused arm studying manipulation detection techniques.

## Data Gap / Relationship

GetReal's core product is detection — they need synthetic/manipulated media datasets to train and evaluate their detectors. This is the Claru angle: to build accurate deepfake detectors, you need massive amounts of real authentic video to establish "ground truth" baselines, and synthetic/manipulated variants to train classifiers. Claru's egocentric and naturalistic video corpus could serve as high-quality authentic-video ground truth for GetReal's training data. Alternatively, if GetReal is looking to expand detection to physical settings (robot video manipulation, synthetic training data authentication), Claru's dataset context becomes even more relevant. The ICP score is lower than physical AI labs because GetReal's primary training data need is less immediate than robotics companies.

## Pitch Angle

Hany said he'd look and follow up — a gentle nudge is appropriate. Don't push on the calendar. Acknowledge the samples were shared and ask if there are specific data types that would be more useful for GetReal's research baseline. The framing should be: "We collect naturalistic video from real environments — this could serve as authenticated ground truth for your detection training pipeline." If Hany has looked at the samples and has questions, be ready to address technical specifics (collection methodology, camera specs, licensing).

## Related Companies

- [pika-labs](pika-labs.md) — Video gen; GetReal detects what companies like Pika produce
- [decart-ai](decart-ai.md) — Real-time video AI; on the "generative" side vs. GetReal's "detection" side

## Sources

- [TechCrunch: GetReal raises $17.5M (March 2025)](https://techcrunch.com/2025/03/26/has-getreal-cracked-the-code-on-ai-deepfakes-18m-and-an-impressive-client-list-says-yes/)
- [SecurityWeek: GetReal Labs emerges from stealth](https://www.securityweek.com/getreal-labs-emerges-from-stealth-to-tackle-deepfakes/)
- [UC Berkeley iSchool: Hany Farid's GetReal](https://www.ischool.berkeley.edu/news/2024/hany-farid-unveils-new-deepfake-detection-company-getreal-labs)
- [GetReal Security homepage](https://www.getrealsecurity.com)
- [PR Newswire: GetReal launches](https://www.prnewswire.com/news-releases/getreal-labs-launches-to-combat-malicious-manipulated-content-and-deepfakes-302184768.html)
- Internal: pipeline-status.md (Hany said "I'll look today" Mar 30, no follow-up)
