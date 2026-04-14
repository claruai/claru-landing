---
type: company
state: prospect
side: supply
name: Sama
slug: sama
domain: sama.com
attio_id: ""
relationship: supply-side-target
vertical: physical-ai-data
icp_score: 95
stage: researched
tags: [managed-workforce, annotation, robotics, manufacturing, autonomous-vehicles, lidar, sensor-fusion, b-corp, kenya, uganda, enterprise, ethical-ai, google, nvidia, gm, continental]
last_enriched: 2026-04-05
email_status: not-sent
last_contact:
last_updated: 2026-04-13
---

## Overview

Sama (formerly Samasource) is a B Corp-certified AI training data company founded in 2008 by the late Leila Janah in Kenya. Headquartered in San Francisco, with delivery centers in Nairobi (Kenya), Kampala and Gulu (Uganda), and partner centers in India. CEO Wendy Gonzalez (former COO, joined 2015) leads a workforce of ~4,300 employees. Sama provides managed annotation services across image, video, text, audio, LiDAR, radar, and sensor fusion data. Named clients include Google, NVIDIA, GM, Ford, Walmart, Microsoft, and Continental. Revenue ~$470M (Getlatka estimate, Sep 2025 -- treat with caution, likely inflated or includes parent entity). Raised $84.8M total, most recently a $70M Series B in Nov 2021 led by CDPQ (Caisse de depot). They explicitly market a robotics and manufacturing vertical with a dedicated page, and have a Continental AI & Robotics Labs testimonial. Their annotation depth is world-class but their entire workforce sits in East African delivery centers -- they have zero field collection capability in NA/EU environments.

## Evidence Card

| Field | Value |
|-------|-------|
| Founded | 2008 (as Samasource) |
| Funding | $84.8M total. $70M Series B (Nov 2021) led by CDPQ, with First Ascent Ventures, Vistara Growth. |
| Revenue | ~$470M (Getlatka, Sep 2025, unverified -- likely overstated) |
| Size | ~4,300 employees (Getlatka). 1,000+ typically cited. Managed workforce model, not crowdsourced. |
| CEO | Wendy Gonzalez (CEO since ~2020, COO since 2015) |
| HQ | San Francisco, CA |
| Delivery centers | Nairobi, Kenya; Kampala, Uganda; Gulu, Uganda; partner centers in India |
| Named clients | Google, NVIDIA, GM, Ford, Walmart, Microsoft, Continental |
| Key products | Data annotation (2D/3D image, video, LiDAR, radar, sensor fusion, text, audio), RLHF, Sama Automate, Sama Multimodal, SamaHub, SamaAssure (99% quality guarantee) |
| Certifications | B Corp, ISO 9001, GDPR, SOC 2 |
| Founder | Leila Janah (1982-2020), social entrepreneur, "Give Work" mission |

## Key People

| Name | Title | Email | Confidence | Notes |
|------|-------|-------|------------|-------|
| Wendy Gonzalez | CEO | wgonzalez@sama.com (pattern-derived) | Medium | 20+ yr tech leader. EY, Capgemini, Cycle30 background. Joined 2015 as COO. |
| Duncan Curtis | SVP of Generative AI (fmr SVP Product) | dcurtis@sama.com | High (PDL-verified) | **Our planned contact.** Ex-Zoox (Head of Product), ex-Aptiv (VP Product), ex-Google (Play Store PM). Computer Software Engineering, QUT. 15 yr PM career. Robotics-native -- understands AV data pipelines. |
| (Unknown) | VP Engineering / CTO | — | — | Not surfaced in research. |

## Hiring Signals

- Careers page (sama.com/careers) lists positions through Greenhouse ATS
- AI 101 training program is their pipeline for annotation workforce -- applicants complete online assessment, then get hired based on business needs
- Uplers shows open positions as of Mar 2026, largely annotation and QA roles
- RemoteRocketship lists remote jobs at Sama -- annotation-focused
- **No robotics-specific field collection roles found.** All annotation roles are desk-based in delivery centers.
- **No NA/EU-based collection team hiring.** Their geographic footprint is Kenya, Uganda, India, SF HQ.

## What They've Actually Shipped

1. **Sama Automate (Apr 2025):** AI-powered automation platform combining ML pre-labeling with HITL validation. 40% reduction in annotation time in early deployments. Goal: 10x reduction by end of 2025.
2. **Sama Multimodal (Jun 2025):** Integration of images, video, text, audio, LiDAR, and radar in a single workflow. Widget-based architecture for rapid model integration. 35% accuracy improvement in a large retail pilot.
3. **Bulk Annotation (Nov 2025):** ML-powered grouping of similar items for batch classification. 80% throughput increase, 25% reduction in annotation inconsistencies in early pilots.
4. **3D LiDAR & Sensor Fusion annotation:** Full 3D bounding boxes, cuboids in 2D & 3D, point cloud to RGB projection, world coordinate conversion, ground detection with semi-supervised learning. This is genuine deep capability for AV data.
5. **Indoor Robotics case study:** Annotated RGB security footage for object detection (people, doors) to strengthen autonomous deployment models. High accuracy, GDPR-compliant, SamaAssure quality guarantee.
6. **Continental AI & Robotics Labs partnership:** Demetrio Aiello (Head of AI & Robotics Labs, Continental) testimonial -- "We have been impressed, not only with their consistent level of high quality, but with their entire approach to training data strategy." Called Sama "a true partner" and praised their in-house workforce for quickly ramping on visual data annotation.
7. **Robotics & Manufacturing vertical page (sama.com/robotics-manufacturing):** Markets annotation for assembly lines, AMRs, and robotics AI. Claims 99% accuracy rate. But this is all annotation of existing data -- not collection.

## Data Gap (why they'd need Claru)

1. **Zero physical collection capability.** Sama's entire workforce is in East African delivery centers (Kenya, Uganda) and partner sites in India. They annotate data that clients bring to them. They do not collect video, sensor data, or any physical-world captures.
2. **Kenya/Uganda centers cannot do NA/EU field capture.** When a client like Continental or GM needs egocentric video from North American kitchens, European factories, or US construction sites, Sama has no mechanism to produce that raw footage. The environments, equipment, and legal frameworks are completely different.
3. **Annotation-only business model.** Their entire stack -- Sama Automate, Multimodal, Bulk Annotation, SamaHub -- is designed for labeling data that already exists. There is no collection pipeline, no hardware provisioning, no field protocol system.
4. **Duncan Curtis knows this gap intimately.** He ran product at Zoox and Aptiv -- two companies that had to solve the real-world data collection problem for autonomous vehicles. He knows the difference between annotation depth and collection capability. He understands that training physical AI models requires purpose-collected data from target environments.
5. **Continental testimonial proves the use case.** Continental's AI & Robotics Labs already trust Sama for annotation. When Continental (or any Sama robotics client) needs field-collected egocentric video from real manufacturing environments, Sama cannot deliver it in-house.
6. **Competitive pressure from Scale AI and newer players.** Sama's annotation margins are under pressure from platform-first tools (Labelbox, SuperAnnotate, V7) and from Scale AI's end-to-end positioning. Offering a collection partnership extends their value proposition without capex.

## Pitch Angle

"You have the annotation depth that frontier labs need. When those same labs need field-collected egocentric video from NA/EU environments, that's a different operation from what your Kenya/Uganda centers deliver. We handle the capture piece -- 2,000+ trained collectors, 100+ cities, multi-sensor rigs, protocol-grade QA. You keep the annotation revenue, we supply the raw capture you can't produce in-house."

**Why this works:** Sama is actively marketing robotics and manufacturing data but their capability is annotation-only. When a client RFP includes real-world video collection from target environments, Sama either turns it down or asks the client to self-collect. Claru fills that exact gap without competing on annotation.

**Why Duncan Curtis is the right contact:** He spent years at Zoox and Aptiv where the AV data collection problem was central. He understands that annotation quality is necessary but not sufficient -- you also need purpose-collected data from real environments. His role as SVP of Generative AI means he's shaping Sama's product roadmap for frontier AI use cases, including robotics.

**Entry approach:** Lead with the Continental relationship. "Your robotics clients already trust your annotation. When they need the raw egocentric video from NA/EU environments to annotate, we're the collection layer." Frame as partnership/subcontract. Never position as competition.

## Related Companies

- [lxt](lxt.md) -- Similar supply-side target, crowd model with robotics marketing but no collection capability
- [imerit](imerit.md) -- Managed annotation workforce, potential co-delivery partner
- [scale-ai](scale-ai.md) -- Largest annotation platform, Sama's primary competitor
- [avala-ai](avala-ai.md) -- Direct competitor doing what we do (field capture + annotation)
- [lightwheel-ai](lightwheel-ai.md) -- Competitor/co-delivery in physical AI data

## Sources

- [Sama Homepage](https://www.sama.com/)
- [Sama Robotics & Manufacturing Page](https://www.sama.com/robotics-manufacturing)
- [Sama Our Story (Leila Janah)](https://www.sama.com/our-story)
- [Sama Leila Janah Founder Page](https://www.sama.com/leila-janah-founder)
- [Sama Impact Page](https://www.sama.com/impact)
- [Sama Our Team](https://www.sama.com/our-team)
- [Sama Careers](https://www.sama.com/careers)
- [Sama Case Studies](https://www.sama.com/case-studies)
- [Sama Indoor Robotics Case Study](https://www.sama.com/case-studies/how-indoor-robotics-improved-training-data-to-enhance-model-performance)
- [Sama 3D LiDAR & Radar Annotation](https://www.sama.com/3d-lidar-radar-point-cloud-annotation)
- [Sama Video Annotation Services](https://www.sama.com/2d-video-annotation-tool-services)
- [Sama GenAI Services](https://www.sama.com/gen-ai)
- [Sama Data Annotation Platform](https://www.sama.com/data-annotation-and-validation-platform)
- [Sama Automate Launch (Apr 2025)](https://www.sama.com/blog/sama-introduces-new-data-automation-platform)
- [Sama Automate Launch -- Yahoo Finance](https://finance.yahoo.com/news/sama-introduces-data-automation-platform-120000989.html)
- [Sama Multimodal Launch (Jun 2025)](https://www.accessnewswire.com/newsroom/en/business-and-professional-services/sama-launches-multimodal-ai-leveraging-diverse-data-types-alongs-1035156)
- [Sama Multimodal -- Enterprise Times](https://www.enterprisetimes.co.uk/2025/06/05/sama-boosts-next-gen-ai-models-with-multimodal-ai-launch/)
- [Sama Bulk Annotation Launch (Nov 2025)](https://www.accessnewswire.com/newsroom/en/business-and-professional-services/sama-eliminates-repetitive-work-in-ai-data-labeling-with-launch-1103945)
- [Sama Bulk Annotation -- IT Brief](https://itbrief.news/story/sama-launches-bulk-annotation-to-boost-ai-labelling-by-80)
- [Sama Data Curation + 3D Annotation Features](https://www.sama.com/blog/new-from-sama-data-curation-self-service)
- [Sama Series B Announcement ($70M)](https://www.sama.com/blog/series-b)
- [Sama B Corp Certification](https://www.webwire.com/ViewPressRel.asp?aId=264409)
- [Sama Revenue -- Getlatka](https://getlatka.com/companies/sama.com)
- [Sama -- Crunchbase](https://www.crunchbase.com/organization/samasource)
- [Sama -- CB Insights](https://www.cbinsights.com/company/samasource/financials)
- [Sama -- Tracxn](https://tracxn.com/d/companies/sama/__xlPoMyw1WX5-W1__84Yj4ZJ-Lytm0ZG2ne6Yb2Xf7Zw)
- [Sama -- Wikipedia](https://en.wikipedia.org/wiki/Sama_(company))
- [Sama Customer Reviews -- FeaturedCustomers (36 reviews)](https://www.featuredcustomers.com/vendor/sama)
- [Sama Company Review -- Label Your Data](https://labelyourdata.com/articles/sama-review)
- [Sama Review -- AI Chief](https://aichief.com/ai-productivity-tools/sama-ai/)
- [Sama Reviews -- G2](https://www.g2.com/products/sama/reviews)
- [Sama Top 5 Review -- HeroHunt](https://www.herohunt.ai/blog/top-5-data-annotation-for-ai-labs-full-reviews/)
- [Wendy Gonzalez -- The Org](https://theorg.com/org/sama/org-chart/wendy-gonzalez)
- [Wendy Gonzalez -- LinkedIn](https://www.linkedin.com/in/wendy-gonzalez-a319788/)
- [Duncan Curtis Joins Sama -- Business Wire (Dec 2022)](https://www.businesswire.com/news/home/20221206005435/en/Computer-Vision-Expert-Duncan-Curtis-Joins-Sama-Leadership-Team-as-Senior-Vice-President-of-Product)
- [Duncan Curtis -- LinkedIn](https://www.linkedin.com/in/duncan-curtis-38a5569/)
- [Duncan Curtis -- Authority Magazine](https://medium.com/authority-magazine/brand-makeovers-duncan-curtis-on-the-5-things-you-should-do-to-upgrade-and-re-energize-your-brand-311991e1feeb)
- [Duncan Curtis -- Coruzant](https://coruzant.com/profiles/duncan-curtis/)
- [Wendy Gonzalez & Duncan Curtis -- DataCamp Podcast](https://www.datacamp.com/podcast/human-guardrails-in-generative-ai)
- [Sama -- Partnership on AI](https://www.partnershiponai.org/partners/samasource/)
- [Sama AI 101 Training](https://www.sama.com/ai101)
- [Sama -- AIPE](https://aiproduct.engineer/ai-ecosystem/sama-b3e7f9beb5f6)
