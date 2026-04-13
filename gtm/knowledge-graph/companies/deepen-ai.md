---
type: company
state: prospect
side: supply
name: Deepen AI
slug: deepen-ai
domain: deepen.ai
attio_id: c4d6eba0-5e36-5934-9718-d02b43dd419a
relationship: supply-side-target
vertical: physical-ai-data
icp_score: 73
stage: researched
tags: [lidar-annotation, sensor-calibration, autonomous-vehicles, robotics, sensor-fusion, safety-validation, physical-ai, ford, honda, toyota, bosch, trimble, silicon-valley, detroit, hyderabad, munich, aws-marketplace, autoware-foundation, cron-ai-partnership, safety-pool, ces-2026, vla-framework]
last_enriched: 2026-04-05
email_status: not-sent
last_contact:
last_updated: 2026-04-13
---

## Overview

Deepen AI is a safety-first data lifecycle tools and services company founded in 2017 by Mohammad Musa (ex-Google). Headquartered in Silicon Valley, CA, with satellite offices in Detroit, Pittsburgh, Hyderabad, Munich, Hong Kong, and Tokyo. Employee count is ~202 as of late 2025, with $22.2M in revenue (Nov 2025, per Latka). They serve 100+ customers globally and claim to have processed more LiDAR data than any other company on Earth -- 50,000+ hours of driving data contributing to 300,000+ test scenarios in Safety Pool, the world's largest scenario database for automated driving. Named clients include Ford, Honda, Toyota, Trimble, and Bosch. Their annotation services team is 350+ skilled sensor fusion data annotators (likely concentrated in Hyderabad). Seed-funded by Plug and Play Tech Center, Driventure, and Endure Capital (undisclosed amount, 2018).

Deepen AI positions itself as "Physical AI data infrastructure" -- distinct from pure annotation shops. Their platform is a unified suite of three products (Deepen Annotate, Deepen Calibrate, Deepen Validate) covering the full data lifecycle from sensor calibration through annotation to label validation. At CES 2026 they previewed Targetless Calibration (automatic multi-sensor alignment without physical calibration targets) and a Vision-Language-Action (VLA) framework connecting multi-sensor data with higher-level action planning for autonomous robotic systems.

Critically for Claru: Deepen AI is a tools + services company focused on LiDAR/radar/camera sensor fusion for AV and robotics. Their entire annotation workforce is trained on 3D point cloud and multi-sensor fusion -- a completely different modality from egocentric video, human activity recognition, and manipulation data. When their OEM clients (Ford, Honda, Toyota) begin asking for human activity datasets alongside vehicle-mounted sensor data -- e.g., pedestrian behavior prediction, hand-object interaction for humanoid robots, egocentric kitchen/warehouse footage -- Deepen has no mechanism to collect or annotate that modality.

## Evidence Card

| Field | Value |
|-------|-------|
| Founded | 2017 |
| Funding | Seed round (2018, undisclosed amount). 9 investors total. Lead: Plug and Play Tech Center. Others include Driventure, Endure Capital. |
| Revenue | $22.2M (Nov 2025, Latka) |
| Size | ~202 employees. 350+ data annotators (sensor fusion). |
| CEO | Mohammad Musa (Founder & CEO since 2017) |
| HQ | Silicon Valley, California |
| Offices | Detroit, MI; Pittsburgh, PA; Hyderabad, India; Munich, Germany; Hong Kong; Tokyo, Japan |
| Named clients | Ford, Honda, Toyota, Trimble, Bosch. Careers page historically mentioned Uber, Samsung, Starsky Robotics, Quanergy. |
| Key products | Deepen Annotate (2D/3D AI-assisted annotation), Deepen Calibrate (multi-sensor calibration -- LiDAR, Radar, Camera, IMU, Vehicle), Deepen Validate (automated label validation + vendor benchmarking) |
| Partnerships | Cron AI (5-year strategic partnership for 3D perception + annotation), Autoware Foundation (member, all technical working groups), WMG University of Warwick (Safety Pool scenario database) |
| Verticals | Autonomous vehicles, robotics, ADAS, drones, mining, retail |
| AWS | Listed on AWS Marketplace as "Data Annotation by Deepen AI" |
| Annotation types | Bounding boxes, instance & semantic segmentation, polylines, keypoints, scenarios (all LiDAR/camera/radar sensor fusion) |
| Recent milestones | CES 2025: Annotate 2.0 launch. May 2025: Unified suite (Annotate + Calibrate + Validate). CES 2026: Targetless Calibration + VLA framework preview. |

## Key People

| Name | Title | Email | Confidence | Notes |
|------|-------|-------|------------|-------|
| Mohammad Musa | Founder & CEO | mohammad@deepen.ai | High (Hunter 99%) | BS/MS Computer Engineering (Santa Clara U). Product Mgmt at UC Berkeley Haas. Management Science & Engineering cert from Stanford. Ex-Google (head of launch & readiness, Google Apps for Work -- Gmail, Calendar, Drive, Docs, Sheets, Slides). Prior: Havok (acq. Intel), Emergent Game Tech (acq. Gamebase), Sonics (acq. Facebook). Adjunct Professor, Engineering Management at Santa Clara University (2019-2023). Lead PM Instructor at Product School (2016-2021). Active conference speaker -- AV Tech Expo NA 2026, AV Tech Expo Europe 2025, Automotive Testing Expo NA 2026. |
| (Co-founder) | VP Business Development | -- | -- | Name not surfaced in research. Listed on The Org as co-founder and VP of BD. |
| (Co-founder) | Co-founder | -- | -- | Second co-founder listed on The Org. Name not surfaced. |

## Hiring Signals

- Careers page (deepen.ai/careers) lists Software Engineering roles for AI-driven 2D/3D annotation applications
- Historically hiring for annotation platform engineers, not field collectors
- 350+ annotators are sensor fusion specialists (LiDAR/camera/radar) -- desk-based labeling, not data collection
- **No egocentric video collection roles found.** All hiring is for annotation platform engineering and sensor fusion labeling
- **No field collector recruitment.** No roles for distributed data collection, hardware provisioning, or multi-city field operations
- Detroit and Pittsburgh offices are likely sales/BD for automotive OEM relationships, not collection operations

## What They've Actually Shipped

1. **Deepen Annotate (v2.0, CES 2025):** AI-assisted 2D/3D annotation platform with built-in QA and analytics. Supports bounding boxes, segmentation, polylines, keypoints across LiDAR/camera/radar. Combination of automated processes and human oversight.
2. **Deepen Calibrate:** Multi-sensor calibration tool covering LiDAR, Radar, Camera, Vehicle, IMU. Intrinsic and extrinsic calibrations for major sensor pairs. Covers R&D, factory, and real-time use cases. Reduces calibration time from hours to minutes. CES 2026 preview of Targetless Calibration (no physical calibration targets needed).
3. **Deepen Validate (launched May 2025):** Automated label validation that detects and fixes gaps in annotations. Benchmarks performance across multiple external labeling vendors. Completes the unified Calibrate-Annotate-Validate pipeline.
4. **Safety Pool Scenario Database:** Co-powered with WMG University of Warwick. World's largest scenario database for automated driving -- 300,000+ test scenarios from 50,000+ hours of driving data. Used by academia, governments, and industry to test/certify ADAS and ADS.
5. **Cron AI Partnership (5-year strategic):** Bridges Cron AI's 3D adaptive perception technology with Deepen's annotation tools. Addresses training data annotation issues and reduces adaptation costs for LiDAR deployments.
6. **VLA Framework (previewed CES 2026):** Vision-Language-Action framework connecting multi-sensor data with higher-level understanding and action planning for autonomous robotic systems. Signals expansion from pure AV into broader physical AI/robotics.
7. **AWS Marketplace Listing:** Enterprise-grade annotation services accessible through AWS procurement channel. Lowers friction for enterprise clients already on AWS.
8. **Autoware Foundation Membership:** Joined virtually all Autoware technical working groups (ODD, calibration, annotation toolchain). Embeds Deepen into the open-source AV development ecosystem.

## Data Gap (why they'd need Claru)

1. **Sensor modality mismatch.** Deepen's entire stack is built for vehicle-mounted sensor fusion -- LiDAR point clouds, radar returns, multi-camera arrays on car rooftops. They have zero capability in egocentric video (body-worn cameras), human activity recognition, hand-object interaction, or manipulation datasets. Different sensors, different collection protocols, different annotation taxonomies.
2. **No data collection infrastructure.** Deepen is a tools + annotation services company. They annotate data that clients bring them (or that comes from vehicle fleets). They do not operate field collection networks, recruit distributed collectors, or manage hardware provisioning for video capture. When an OEM client asks for human behavior data, Deepen cannot source it.
3. **OEM clients are expanding into physical AI.** Ford, Honda, and Toyota are all investing in humanoid robotics and household/warehouse automation alongside their AV programs. These initiatives need human activity data (cooking, cleaning, manipulation, navigation in cluttered environments) that vehicle-mounted sensors never capture.
4. **350+ annotators trained on wrong modality.** Their sensor fusion annotators are experts in 3D bounding boxes, point cloud segmentation, and LiDAR-camera fusion. They are not trained in egocentric video annotation -- action recognition, temporal boundaries, hand-object contact states, spatial relationships in indoor environments.
5. **Geographic concentration in Hyderabad.** The annotation workforce appears concentrated in India. Even if they wanted to collect egocentric video, the footage would be of Indian environments -- not the North American and European homes, kitchens, warehouses, and construction sites where their OEM clients' robots will operate.
6. **VLA framework signals ambition without data.** The CES 2026 VLA framework preview shows Deepen wants to move into robotic action planning. But VLA models need ground-truth human demonstration data to train on -- exactly what Claru collects. Deepen has the tooling ambition but no supply-side mechanism for the underlying data.
7. **Competitive pressure to expand beyond AV.** With $22.2M revenue and ~200 employees, Deepen is a solid but not dominant player in AV annotation. Scale AI, Labelbox, and others compete aggressively on the annotation platform side. Offering clients a complete physical AI data solution (AV sensor data via Deepen + human activity data via Claru) differentiates without requiring Deepen to build new infrastructure.

## Pitch Angle

"When your OEM clients ask for egocentric/human activity data alongside LiDAR, we handle that modality. Different sensor stack, different collection methodology, same client relationship."

**Why this works:** Deepen's entire value proposition is LiDAR/radar/camera sensor fusion for AV. Their OEM clients (Ford, Honda, Toyota) are simultaneously investing in humanoid robotics and indoor automation. These programs need human activity datasets -- egocentric video of cooking, manipulation, warehouse navigation, construction tasks -- that vehicle-mounted sensors never capture and that Deepen's annotation workforce is not trained to produce. Claru fills a modality gap without competing on Deepen's core LiDAR annotation business.

**Why Mohammad is the right contact:** As founder/CEO of a 200-person company, he owns strategic partnerships directly. His CES 2026 VLA framework preview shows he's thinking about robotics beyond pure AV. His Google product management background means he evaluates partnerships through a platform extensibility lens -- "what extends our platform's value without requiring us to build new capabilities?"

**Entry approach:** Lead with the VLA framework. "You previewed VLA at CES -- connecting sensor data to action planning for robotics. The missing input is human demonstration data. When Ford or Toyota asks you to support their humanoid robotics program alongside their AV program, you need egocentric video of humans doing the tasks those robots will perform. We collect that data across 100+ cities in NA/EU with protocol-grade QA. You keep the annotation and calibration revenue. We supply the modality your platform doesn't cover."

**Risk factors:** Deepen is smaller ($22M, 200 people) and may not have the BD bandwidth to pursue partnerships aggressively. The VLA framework is a preview, not a shipped product -- robotics may still be aspirational. OEM clients may procure human activity data directly without going through Deepen. Best approach is to position as an easy "yes" -- a subcontract relationship that costs Deepen nothing and makes their OEM proposals more complete.

## Related Companies

- [imerit](imerit.md) -- Similar supply-side target, managed annotation workforce, markets egocentric video collection but limited to India/Bhutan delivery centers
- [sama](sama.md) -- Annotation-only with East African delivery centers, no collection capability
- [cortex-ai](cortex-ai.md) -- Annotation platform competitor
- [centific](centific.md) -- Data services company, ex-Pactera EDGE
- [cloudfactory](cloudfactory.md) -- Managed workforce annotation, Nepal/Kenya delivery
- [sigma-ai](sigma-ai.md) -- Annotation services provider

## Sources

- [Deepen AI Homepage](https://www.deepen.ai)
- [Deepen AI Services](https://www.deepen.ai/services)
- [Deepen AI Calibrate](https://www.deepen.ai/calibrate)
- [Deepen AI Calibrate Package (startups/SMBs)](https://www.deepen.ai/calibrate-package)
- [Deepen AI Careers](https://www.deepen.ai/careers)
- [Deepen AI CES 2026 Press Release -- PR Newswire](https://www.prnewswire.com/news-releases/deepen-ai-brings-safety-first-data-infrastructure-for-avs-and-robotics-to-ces-2026-302652350.html)
- [Deepen AI CES 2026 -- AI-TechPark](https://ai-techpark.com/deepen-ai-brings-safety-first-av-data-infrastructure-to-ces-2026/)
- [Deepen AI CES 2026 -- Traffic Technology Today](https://www.traffictechnologytoday.com/news/event-news/ces-2026-deepen-ai-data-infrastructure-tools-for-avs.html)
- [Deepen AI CES 2025 -- Annotate 2.0](https://www.cbs42.com/business/press-releases/ein-presswire/773574736/deepen-ai-to-showcase-annotate-2-0-and-advanced-sensor-calibration-solutions-at-ces-2025/)
- [Deepen AI Unified Suite -- EIN Presswire (May 2025)](https://www.einpresswire.com/article/814254503/deepen-ai-unveils-fully-unified-annotation-calibration-validation-suite)
- [Deepen AI Integrated Calibration + Annotation -- Blog](https://www.deepen.ai/blog/deepen-ai-launches-integrated-solutions-for-enhanced-sensor-calibration-and-data-annotation)
- [Deepen AI + Cron AI 5-Year Partnership -- Blog](https://www.deepen.ai/blog/deepen-ai-and-cron-ai-agree-on-a-five-year-long-term-strategic-partnership)
- [Safety Pool Scenario Database](https://www.safetypool.ai/)
- [Safety Pool -- Key Members](https://www.safetypool.ai/about)
- [Safety Pool -- Deepen AI Blog](https://www.deepen.ai/blog/revolutionising-automated-driving-systems-with-safety-pool)
- [Deepen AI Joins Autoware Foundation](https://autoware.org/deepen-ai-joins-the-autoware-foundation/)
- [Deepen AI -- Autoware Profile](https://autoware.org/autowareio/deepen-ai/)
- [Data Annotation by Deepen AI -- AWS Marketplace](https://aws.amazon.com/marketplace/pp/prodview-msx7szkeihe2o)
- [Deepen AI Seed Round -- Prism News](https://www.prismnews.com/news/deepen-ai-closes-seed-round-to-scale-sensor-fusion-ground-truth-for-autonomy)
- [Deepen AI Revenue -- Latka](https://getlatka.com/companies/deepen.ai)
- [Deepen AI -- Crunchbase](https://www.crunchbase.com/organization/deepen-ai)
- [Deepen AI -- CB Insights](https://www.cbinsights.com/company/deepen-ai)
- [Deepen AI -- Tracxn](https://tracxn.com/d/companies/deepen/__eqmzqQ9pxXxxhiFXjakNred9_ruJhpg7Dt7kx-j0hP0)
- [Deepen AI -- Dealroom](https://app.dealroom.co/companies/deepen_ai)
- [Deepen AI -- Wellfound Funding](https://wellfound.com/company/deepen-ai/funding)
- [Deepen AI Leadership -- The Org](https://theorg.com/org/deepen-ai/org-chart/mohammad-musa)
- [Deepen AI People -- CB Insights](https://www.cbinsights.com/company/deepen-ai/people)
- [Mohammad Musa -- LinkedIn](https://www.linkedin.com/in/mohammad)
- [Mohammad Musa -- Crunchbase](https://www.crunchbase.com/person/mohammad-musa)
- [Mohammad Musa -- Santa Clara University Faculty](https://www.scu.edu/engineering/faculty/musa-mohammad/)
- [Mohammad Musa -- Product School](https://productschool.com/product-leaders/mohammad-musa)
- [Mohammad Musa -- Muraena (Advisor Profile)](https://muraena.ai/profile/mohammad_musa_3a44cd0b)
- [Mohammad Musa -- RocketReach](https://rocketreach.co/mohammad-musa-email_9341848)
- [Mohammad Musa -- AV Tech Expo NA 2026 Speaker](https://autonomousvehicletechnologyexpo-usa.com/speakers/mohammad-musa)
- [Mohammad Musa -- AV Tech Expo Europe 2025 Speaker](https://autonomousvehicletechnologyexpo.com/speakers/mohammad-musa)
- [Mohammad Musa -- Automotive Testing Expo NA 2026 Speaker](https://testingexpo-usa.com/speakers/mohammad-musa)
- [Deepen AI -- ExpertBeacon Review](https://expertbeacon.com/deepen-ai-annotation-platform-autonomous-vehicles/)
- [Top 5 LiDAR Annotation Tools 2025 -- Mindkosh](https://mindkosh.com/blog/the-top-5-lidar-annotation-tools-in-2025/)
- [Deepen AI -- LeadIQ Company Profile](https://leadiq.com/c/deepen-ai/5a1d9ddd23000054008dc588)
