---
type: company
state: prospect
side: demand
name: Avala AI
slug: avala-ai
domain: avala.ai
attio_id: null
relationship: competitor
vertical: physical-ai-data
icp_score: null
stage: tracking
tags: [competitor, egocentric-video, robotics, annotation, data-collection, ALOHA, bimanual-robot, SAM3, depth-estimation, MANO-hands, Tesla-Autopilot, humanoid, physical-ai, forward-deployed-engineers, san-francisco, kenya, india, sri-lanka, haiti, SOC2, GDPR, ISO-27001, TISAX]
last_enriched: 2026-04-05
email_status: DO-NOT-CONTACT
last_contact:
last_updated: 2026-04-13
---

## Overview

Avala AI is the closest direct competitor to Claru in the physical AI data market. Founded in 2020 by Emal Alwis (ex-Tesla Autopilot engineer #3, reporting directly to Elon Musk for six years), Avala positions itself as "the unified data engine for Physical AI and frontier models." They do both egocentric video collection AND robotics annotation -- the exact same two-sided value proposition Claru offers.

They claim $12.3M revenue (2025, per GetLatka) on $4.2M total funding, with a team of ~112 employees plus a 15,000+ person global annotation workforce across 5 continents (Kenya, India, Sri Lanka, Haiti, and others). HQ in San Francisco. They operate a fleet of 10 ALOHA bimanual robots for teleoperation data collection, have collected 2,000+ hours of egocentric rig footage, and serve humanoid companies including Figure, Galbot, Unitree, Agility, and 1X -- every single one of Claru's primary target customers.

Their annotation pipeline uses SAM3 auto-annotation for 80-90% of labels, with their human workforce handling QA and edge cases. They deliver in RLDS, HDF5, and Open X-Embodiment formats. They also embed "forward deployed engineers" from Tesla and Waymo directly into client teams.

This company should be treated as Claru's primary competitive threat. They have deeper technical infrastructure, more funding, a larger workforce, real revenue, and they already serve the exact accounts Claru is prospecting.

## Evidence Card

| Field | Value |
|-------|-------|
| Founded | 2020 (incorporated May 2020) |
| Funding | $4.2M total. Seed round led by MaC Venture Capital and Flybridge (April 2021). 13 investors including Seeders, at.inc/, Bossa Invest, Wonder Ventures, Valor Equity Partners. |
| Revenue | $12.3M (2025, per GetLatka). Unverified but plausible given client list and team size. |
| Size | ~112 employees (GetLatka 2025). PitchBook shows older figure of 31 (likely core engineering/ops only, excluding annotation workforce). 15,000+ annotators across 5 continents. |
| CEO | Emal Alwis (Founder & CEO/CTO) |
| HQ | San Francisco, California |
| Annotation centers | Kenya, India, Sri Lanka, Haiti (confirmed). Claimed "5 continents." |
| Named clients | Figure, Galbot, Unitree, Agility, 1X (humanoid robotics). Also claims Amazon, Toyota, BMW, Bosch (industrial automation). Also targets NVIDIA GR00T, Google DeepMind, Physical Intelligence (foundation model labs). |
| Key products | Unified data engine platform (Python SDK, REST API, CLI), Mission Control visualization, SAM3 auto-annotation pipeline, ALOHA robot fleet (10 units), egocentric capture rig deployments, forward deployed engineering |
| Verticals | Humanoid robotics, autonomous vehicles, industrial automation, robotics foundation models |
| Certifications | SOC 2 Type II, GDPR & EU Data Privacy, ISO 27001, TISAX |
| Capture specs | 50Hz multi-sensor fusion, 2,000+ hrs egocentric footage collected, 10 ALOHA bimanual robot units |
| Annotation specs | SAM3 auto-annotation (80-90% coverage, 30ms inference), 70-keypoint body pose (SAM3D Body), MANO hand reconstructions, depth estimation + SLAM, >1B annotations/day claimed capacity |
| Output formats | RLDS, HDF5, Open X-Embodiment compatible |
| Speaker engagements | ADAS & Autonomous Vehicle Technology Summit NA 2025 (Emal Alwis as speaker) |

## Key People

| Name | Title | Email | Confidence | Notes |
|------|-------|-------|------------|-------|
| Emal Alwis | Founder & CEO/CTO | emal@avala.ai | High (PDL-verified) | Tesla Autopilot AI engineer #3 (Feb 2014 - Jul 2019), reported directly to Elon Musk. Sri Lankan immigrant. Background in AI, software engineering, and neuroengineering. Speaker at ADAS summit 2025. DO NOT CONTACT -- competitor CEO. |
| Ignacio Orlandini | Engineering | -- | Low | Found on LinkedIn associated with Avala AI. Role unclear. |
| Michael Palank | Unknown | -- | Low | Published LinkedIn article "Avala: People-First AI" -- likely advisor or team member. |

## What They've Actually Shipped

1. **Unified Data Engine Platform:** Full-stack data infrastructure with Python SDK, REST API, CLI, and "Mission Control" visualization dashboard. Handles dataset management, versioning, annotation triggering, and export. This is a real software product, not just a services wrapper.

2. **ALOHA Robot Fleet (10 units):** Bimanual teleoperation robots for robotics demonstration data collection. ALOHA is an open-source platform (Stanford/Google origins) -- Avala has 10 units deployed with trained operators collecting manipulation demonstrations. This gives them robotics-native data that pure egocentric capture cannot provide.

3. **Egocentric Capture Rig Deployments:** 2,000+ hours of egocentric footage collected using calibrated multi-camera arrays with synchronized recording and onboard compute for preprocessing. 50Hz capture frequency with multi-sensor fusion. 15,000+ trained operators capturing "kinematically valid trajectories -- not scripted lab demos."

4. **SAM3 Auto-Annotation Pipeline:** Meta's SAM3 handles 80-90% of annotation at 30ms inference speed. Includes object segmentation with temporal tracking, 3D body pose reconstruction (70 keypoints via SAM3D Body), MANO hand mesh reconstructions, depth map estimation via SLAM, and timestamped action labels. Human workforce verifies and enriches the remaining 10-20%.

5. **Forward Deployed Engineering:** Senior engineers from Tesla and Waymo embed directly into client teams -- joining their Slack, reviewing data, optimizing annotation pipelines. This is a Palantir-style deployment model applied to data annotation.

6. **Training-Ready Output Pipeline:** Delivers in multiple robotics-native formats (RLDS, HDF5, Open X-Embodiment) with instance segmentation masks + tracking, full body pose sequences (MHR skeleton format), depth maps, scene descriptions, and 3D hand reconstructions.

7. **Neural Digital Twin / 4D World Modeling:** Blog content describes Gaussian Splat scene rendering, GPU-accelerated point cloud visualization, multi-sensor MCAP playback, and 3D annotation tools working directly on spatial data. Unclear how much of this is shipped vs. aspirational.

8. **Community Partnerships:** Works with AFASDA, Next Step, Shortlist, Dandora, and Nawiri organizations -- suggests ethical sourcing narrative similar to Sama/iMerit impact model.

## Their Strengths (vs Claru)

1. **Revenue and traction.** $12.3M revenue (2025) vs. Claru's pre-revenue/early-revenue stage. They have proven product-market fit with paying customers at scale.

2. **Exact target customer overlap.** Figure, Galbot, Unitree, Agility, 1X -- these are all on Claru's prospect list and Avala already serves them. Walking into these accounts means displacing an incumbent.

3. **ALOHA robot fleet.** 10 bimanual teleoperation robots is a differentiated asset. Claru does egocentric human video; Avala also does robot demonstration data. For manipulation-focused robotics companies, robot-native demonstrations may be more valuable than human egocentric footage.

4. **Founder credibility.** Emal Alwis as Tesla Autopilot #3 reporting to Musk is an extremely strong signal for AV/robotics buyers. He lived the data quality problem at the company that consumes more vision training data than almost anyone else on Earth.

5. **Software platform maturity.** Python SDK, REST API, CLI, Mission Control dashboard, versioning, programmatic annotation triggering. This is a real data infrastructure product, not just a services company with a portal.

6. **Auto-annotation pipeline.** SAM3 at 80-90% coverage with 30ms inference, plus MANO hands and depth estimation. Their annotation tech stack is more sophisticated than most competitors.

7. **Scale of workforce.** 15,000+ annotators across 5 continents gives them genuine global coverage and burst capacity. Claru has 2,000+ collectors -- Avala's workforce is 7x larger.

8. **Compliance certifications.** SOC 2 Type II + GDPR + ISO 27001 + TISAX covers enterprise procurement requirements for automotive (TISAX is VW/BMW/Mercedes supplier requirement).

9. **Forward deployed engineering model.** Embedding engineers into client teams creates deep lock-in and switching costs. Once your data pipeline depends on Avala engineers in your Slack, it's hard to rip out.

10. **Investor quality.** Valor Equity Partners is a serious growth investor (they led Crusoe Energy's $1.38B round, close to Tesla/SpaceX ecosystem). MaC Venture Capital and Flybridge are strong seed-stage funds.

## Their Weaknesses (vs Claru)

1. **Revenue efficiency suggests services-heavy model.** $12.3M revenue with 112 employees + 15,000 annotators implies very thin margins. If those 15,000 annotators are real (not just a registered pool), the labor cost structure is massive. Claru's leaner model with 2,000+ collectors could have better unit economics.

2. **"Claims" vs. verified client relationships.** Avala lists Figure, Galbot, Unitree, Agility, 1X, Amazon, Toyota, BMW, Bosch as clients on their marketing site. But these are unverified claims on a startup's use-case page. No case studies, no named testimonials, no press releases confirming these relationships. Some may be aspirational or based on pilot-stage work.

3. **Underfunded for their ambitions.** $4.2M total funding is tiny for a company claiming $12.3M revenue, 15,000 annotators, and enterprise clients like Toyota and BMW. Either the revenue number is inflated, the workforce number is a registered (not active) pool, or they are severely capital-constrained. Compare to Scale AI ($14.3B valuation), Sama ($62M raised), or even iMerit ($24.3M raised).

4. **Collection hours are modest.** 2,000+ hours of egocentric footage is a good start but not massive. At 50Hz capture, that's solid data volume, but Figure alone is reportedly building datasets requiring orders of magnitude more footage. This could indicate collection is newer or smaller than their annotation business.

5. **Blog content is aspirational/conceptual.** Their "Data Collection as Infrastructure" blog post reads as a thought leadership framework, not a case study with real numbers. The Neural Digital Twin and 4D world modeling capabilities are described conceptually. Compare to concrete shipped features -- the gap between marketing and verifiable product is unclear.

6. **No geographic specificity on collection.** Avala doesn't specify where their 2,000+ hours of egocentric footage were collected. If it's primarily from annotation center countries (Kenya, India, Sri Lanka, Haiti), it has the same domain-mismatch problem as iMerit -- robots deploying in US/EU homes need footage from US/EU homes. Claru's explicit "100+ cities" positioning in NA/EU is a potential differentiator if Avala's collection is in developing markets.

7. **Small engineering core.** PitchBook's 31-employee figure vs. GetLatka's 112 suggests the core product/engineering team may be quite small, with the delta being ops/sales/support. Building and maintaining a platform (SDK, API, CLI, dashboards) plus robotics hardware ops with a small eng team is a stretch.

8. **TISAX certification is specific.** TISAX is automotive-specific (German OEM supply chain). Having it signals their primary customer base may still be ADAS/AV rather than humanoid robotics. The humanoid robotics positioning could be newer and less proven.

## Competitive Strategy

### DO NOT CONTACT
Avala AI is a direct competitor. Do not reach out, do not pitch, do not attempt partnership. Track them passively through public sources.

### Where Claru Can Still Win

1. **Speed to specific accounts.** Not all humanoid companies are locked into Avala. Newer entrants, companies unhappy with Avala's quality/pricing, and labs Avala hasn't reached yet are still open. Move fast on accounts not yet on their client list.

2. **NA/EU geographic collection specificity.** If Claru can prove collection from specific North American and European environments where robots will actually deploy (homes, warehouses, retail, construction), this is a concrete differentiator vs. a competitor whose collection geography is unclear.

3. **Lean pricing.** If Avala's cost structure is heavy (15K annotators + ALOHA fleet + forward deployed engineers + platform), Claru may be able to undercut significantly on egocentric collection. Offer the same capture quality at a better price point.

4. **Curation over volume.** Avala's messaging is about scale (1B annotations/day, 15K annotators). Claru can position on curation quality -- purpose-built datasets for specific use cases rather than pipeline volume.

5. **Transparency on collection methodology.** Avala's "2,000+ hours" is vague. Claru can differentiate by being transparent about exactly where footage was collected, what environments, what demographics, what equipment, what QA protocols. Frontier labs care about data provenance.

6. **Annotation-only clients.** Some robotics companies collect their own data and only need annotation. Claru's enrichment pipeline (Gemini, GPT-4o, depth estimation, SAM3) can compete on the annotation-only side, especially if priced below Avala's integrated offering.

### What to Monitor

- Any Avala funding announcements (they are very underfunded for their claimed scale -- a Series A would be a signal they're accelerating)
- New client announcements or case studies that verify the Figure/Agility/1X claims
- Hiring patterns -- are they hiring field collectors in NA/EU or staying concentrated in developing markets?
- Platform updates -- SDK releases, new annotation types, new robot hardware
- Emal Alwis conference appearances and public statements about roadmap
- Whether the $12.3M revenue figure appears in verified sources (Crunchbase, press releases) beyond GetLatka

## Related Companies

- [imerit](imerit.md) -- Managed-workforce annotation, potential Claru supply-side partner (India/Bhutan delivery centers, no NA/EU collection)
- [lightwheel-ai](lightwheel-ai.md) -- Large-scale egocentric provider, 300K+ hours, competitor in collection
- [build-ai](build-ai.md) -- Industrial-focused egocentric video, 100K hours factory worker footage
- [sama](sama.md) -- Annotation-only with East African delivery centers, not a collection competitor
- [scale-ai](scale-ai.md) -- Largest annotation platform ($14.3B valuation), different positioning but overlapping customer base
- [cortex-ai](cortex-ai.md) -- Annotation platform competitor
- [mecka-ai](mecka-ai.md) -- Robotics data company

## Sources

- [Avala AI Homepage](https://avala.ai/)
- [Avala AI Company Page](https://avala.ai/company)
- [Avala AI Robotics & Embodied AI Use Case](https://avala.ai/fr/usecases/robotics)
- [Avala AI Physical AI & Spatial Computing Docs](https://avala.ai/docs/getting-started/use-cases/physical-ai)
- [Avala AI Blog -- Data Collection as Infrastructure](https://about.avala.ai/news/data-collection-as-a-service)
- [Avala AI LinkedIn](https://www.linkedin.com/company/avala-ai)
- [Avala AI GitHub](https://github.com/avala-ai)
- [Avala AI Crunchbase](https://www.crunchbase.com/organization/avala)
- [Avala AI PitchBook](https://pitchbook.com/profiles/company/466532-29)
- [Avala AI ZoomInfo](https://www.zoominfo.com/c/avala-ai/541624373)
- [Avala AI CB Insights](https://www.cbinsights.com/company/avala)
- [Avala AI GetLatka ($12.3M revenue, 112 employees)](https://getlatka.com/companies/avala.ai)
- [Avala Launches Platform For Ethical AI -- Pulse2](https://pulse2.com/avala-ai/)
- [Emal Alwis -- LinkedIn](https://www.linkedin.com/in/emalwis)
- [Emal Alwis -- The Org](https://theorg.com/org/avala-ai/org-chart/emal-alwis)
- [Emal Alwis -- Crunchbase](https://www.crunchbase.com/person/emal-alwis)
- [Emal Alwis -- ContactOut](https://contactout.com/Emal-Alwis-3190857)
- [Emal Alwis -- Affluense AI](https://www.affluense.ai/profile/emal-alwis-avala-ai-93ec99)
- [Emal Alwis -- ADAS Summit 2025 Speaker](https://autonomousvehicletechnologyexpo-usa.com/speakers/emal-alwis)
- [Emal Alwis -- SuperAGI Research](https://sales.superagi.com/contact/emal-alwis)
- [Michael Palank -- "Avala: People-First AI" LinkedIn Article](https://www.linkedin.com/pulse/avala-people-first-ai-michael-palank)
- [Ignacio Orlandini -- LinkedIn (Avala AI)](https://www.linkedin.com/in/ignacioorlandini/)
