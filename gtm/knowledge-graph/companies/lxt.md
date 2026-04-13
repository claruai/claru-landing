---
type: company
state: prospect
side: supply
name: LXT
slug: lxt
domain: lxt.ai
attio_id: d55b8c91-f5c1-5459-929b-53e0ff170bf4
relationship: supply-side-target
vertical: physical-ai-data
icp_score: 88
stage: researched
tags: [crowd-model, clickworker, annotation, video-collection, robotics-marketing, embodied-ai, enterprise, canada, global]
last_enriched: 2026-04-05
email_status: not-sent
last_contact:
last_updated: 2026-04-13
---

## Overview

LXT is a global AI training data company founded in 2010 by Mohammad Omar, headquartered in Toronto. They provide data collection, annotation, and evaluation services across text, audio, image, and video modalities. In December 2024 they acquired clickworker (6M+ freelancers), giving them a combined crowd of 7M+ contributors and 250K+ domain experts across 150+ countries and 1,000+ language locales. Integration completed July 2025. They explicitly market "physical AI," "embodied AI," and "robotics" training data on their website, including a dedicated robot learning datasets page. Revenue ~$89M (Growjo estimate). 500-1,000 employees.

## Evidence Card

| Field | Value |
|-------|-------|
| Founded | 2010 |
| Funding | Private (undisclosed). Acquired clickworker Dec 2024 for undisclosed amount. |
| Revenue | ~$89M (Growjo estimate, unverified) |
| Size | 500-1,000 employees; 7M+ crowd contributors |
| CEO | Mohammad Omar (Co-founder, CEO since 2010) |
| HQ | Toronto, Canada |
| Offices | US, UK, Egypt, India, Turkey, Australia, Germany, Romania |
| Clients | "Top 10 global technology companies," Fortune 500, startups. No named robotics clients. One case study: unnamed "AI-powered visual assessment" company (vehicle 360 videos for insurance). |
| Key products | Data collection, annotation (audio/image/text/video), HITL evaluation, crowd platform (ex-clickworker) |
| Certifications | ISO 27001, GDPR, HIPAA compliant |
| Key acquisition | clickworker (Dec 2024, integrated Jul 2025) -- 6M freelancers, microtask platform |

## Key People

| Name | Title | Email | Confidence |
|------|-------|-------|------------|
| Mohammad Omar | Co-founder & CEO | m.omar@lxt.ai | High -- RocketReach + pattern match, blog author slug mohammad_omar |
| Amr Nour-Eldin | VP Technology | a.nour-eldin@lxt.ai (pattern-derived) | Medium -- ZoomInfo shows a***@lxt.ai |
| Phil Hall | Chief Growth Officer | — | LinkedIn confirmed |
| Carolyn Harvey | COO | — | LinkedIn confirmed |

## Hiring Signals

- Careers page (lxt.ai/jobs) lists flexible remote annotation work, not traditional FTEs
- ZipRecruiter shows "Lxt Ai" jobs averaging $65.77/hr (US), mostly remote annotation/labeling
- LinkedIn shows "Data Response Annotator (Short-Term, Remote)" -- classic crowd microtask role
- Himalayas lists 5 remote jobs at LXT (as of search date)
- Glassdoor reviews exist for "LXT AI Data Annotator" -- confirms crowd contributor model
- **No robotics-specific or field-collection hiring signals found.** All roles are remote/online annotation.

## What They've Actually Shipped

1. **Vehicle 360 video collection (case study):** Collected 1,000+ walk-around videos of vehicles for an unnamed insurance AI company. North America focused. Standard smartphone video, not multi-sensor.
2. **clickworker platform integration (Jul 2025):** Unified 7M+ crowd into single platform for annotation microtasks.
3. **Robot learning datasets page (lxt.ai/datasets/robot/):** Markets teleoperation demo collection, failure trajectory annotation, hardware-specific training. Claims "remote and on-site collection options." **No published case studies, no named clients, no evidence of actual robotic data delivery.**
4. **Video data collection service (lxt.ai/services/video-data-collection/):** Claims 8M+ contributors for video capture in 150+ countries. Focus appears to be smartphone selfie/UGC-style, not protocol-grade egocentric.
5. **Action recognition datasets page (lxt.ai/datasets/custom-action-recognition-datasets/):** Marketing copy for custom datasets. No published examples.
6. **Core business remains text/audio/NLP:** CEO's background is Arabic linguistics (Google), company origin story was Arabic language data for a former employer. Speech/audio is their deepest expertise (VP Tech is ex-Nuance ASR scientist).

## Data Gap (why they'd need Claru)

1. **Pure crowd model cannot do protocol-grade field capture.** Their 7M workers are online freelancers doing microtasks from home. Collecting egocentric video in kitchens, warehouses, construction sites, and hospitals requires trained, equipped, physically-present collectors -- not clickworkers.
2. **No evidence of robotics data delivery.** The /datasets/robot/ page is marketing copy with zero case studies, zero named clients, zero published datasets. Compare this to their vehicle video case study which at least has specifics.
3. **No multi-sensor capability.** Their collection model is smartphone-based. Frontier robotics labs need synchronized stereo depth, IMU, force-torque, and specific camera rigs. A crowd platform cannot provision or calibrate this hardware.
4. **CEO and VP Tech backgrounds are NLP/speech, not robotics.** Mohammad Omar: Arabic linguist. Amr Nour-Eldin: ASR/speech processing. Their technical DNA is language data, not physical-world capture.
5. **Their case study proves the gap.** The vehicle 360 video project struggled with "low resolution, low lighting, file mismatches, camera orientation problems" from other vendors and from their own initial quality issues. This is basic smartphone video -- imagine the QA challenges with multi-sensor robotics capture.
6. **Geographic limitation for on-site robotics.** They claim "remote and on-site" robot data collection. On-site requires local teams with hardware access. Their workforce is distributed online contributors, not field teams.

## Pitch Angle

"You have 7M workers labeling data. When a client RFP includes egocentric video collection from real environments -- kitchens, factories, construction sites -- that's not something a crowd model can do. We handle the field capture piece. 2,000+ trained collectors, 100+ cities, multi-sensor rigs, protocol-grade QA. You keep the annotation revenue, we supply the raw capture you can't produce in-house."

**Why this works:** LXT is actively marketing robotics/embodied AI data but has no evidence of delivery capability. When an enterprise client asks for real-world video collection as part of a larger data deal, LXT either turns it down or cobbles together a low-quality smartphone approach. Claru fills that exact gap without competing on their core annotation business.

**Entry point:** Phil Hall (CGO) or Mohammad Omar directly. Frame as partnership/subcontract, not competition. Lead with the robot learning datasets page -- "We saw your robotics data offering. We do the physical capture piece that's hardest for crowd models."

## Related Companies

- [mecka-ai](mecka-ai.md) -- Similar supply-side target, gig-worker collection model (iPhone), Canada-based
- [imerit](imerit.md) -- Managed annotation workforce, potential co-delivery partner
- [scale-ai](scale-ai.md) -- Largest annotation platform, LXT competitor on annotation side
- [avala-ai](avala-ai.md) -- Direct competitor doing what we do (field capture + annotation)

## Sources

- [LXT Homepage](https://www.lxt.ai/)
- [LXT About Page](https://www.lxt.ai/about/)
- [LXT Robot Learning Datasets](https://www.lxt.ai/datasets/robot/)
- [LXT Video Data Collection Services](https://www.lxt.ai/services/video-data-collection/)
- [LXT Data Annotation Services](https://www.lxt.ai/services/data-annotation/)
- [LXT Case Study: AI-Powered Visual Assessment Video Collection](https://www.lxt.ai/case-studies/improving-an-ai-powered-platform-through-large-scale-high-quality-video-data-collection/)
- [LXT Acquires clickworker (PR)](https://www.lxt.ai/blog/lxt-acquires-clickworker-to-deliver-industry-leading-ai-data-solutions/)
- [LXT Completes clickworker Integration (PR, Jul 2025)](https://www.prnewswire.com/news-releases/lxt-completes-integration-of-clickworker-to-deliver-single-platform-for-industry-leading-ai-data-solutions-302517815.html)
- [LXT clickworker Acquisition -- Slator](https://slator.com/lxt-acquires-clickworker-in-data-for-ai-market-consolidation-move/)
- [Mohammad Omar Interview -- Unite.AI](https://www.unite.ai/mohammad-omar-co-founder-ceo-of-lxt-interview-series/)
- [Mohammad Omar Interview -- Pulse2](https://pulse2.com/lxt-profile-mohammad-omar-interview/)
- [Mohammad Omar -- The Org](https://theorg.com/org/lxt/org-chart/mohammad-omar)
- [Amr Nour-Eldin VP Technology Announcement](https://www.lxt.ai/blog/lxt-welcomes-amr-nour-eldin-as-vice-president-of-technology/)
- [Amr Nour-Eldin Interview -- Unite.AI](https://www.unite.ai/amr-nour-eldin-of-lxt/)
- [LXT Revenue Estimate -- Growjo](https://growjo.com/company/LXT)
- [LXT -- CBInsights](https://www.cbinsights.com/company/lxt)
- [LXT -- Crunchbase](https://www.crunchbase.com/organization/lxt)
- [LXT -- ZoomInfo](https://www.zoominfo.com/c/lxt/547040997)
- [LXT Careers](https://www.lxt.ai/jobs/)
- [LXT Glassdoor Reviews](https://www.glassdoor.com/Reviews/LXT-AI-Data-Annotator-Reviews-EI_IE3998824.0,3_KO4,21.htm)
- [LXT Profile -- Silicon Review](https://thesiliconreview.com/magazine/profile/lxt-only-aid-company-needs)
- [LXT AI Jobs -- ZipRecruiter](https://www.ziprecruiter.com/Jobs/Lxt-Ai)
