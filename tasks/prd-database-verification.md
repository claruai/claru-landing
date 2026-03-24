# PRD: Systematic Deep Verification, Re-qualification & Expansion of Target Customers Database

## Introduction

Verify every claim in the Claru Target Customers Notion database (~100 companies, ~90 unverified), re-qualify each company against our ICP with fresh evidence, re-scan all job boards to verify hiring signals, and discover new companies during the research process. The goal is a database where every field is sourced, every tier is justified, and no detail is fabricated.

## Goals

- Every field in every Notion entry traces to a verifiable source URL
- Every UNVERIFIED claim is explicitly marked with ⚠️
- No fabricated job posting titles, funding amounts, or founder details
- All job board hiring signals re-verified with actual URLs and verbatim JD text
- Each company re-qualified: does this company fit our ICP based on VERIFIED evidence?
- Outreach Tiers re-evaluated based on verified data + verified hiring signals
- Companies with insufficient public information downgraded to Monitor/Disqualified
- New companies discovered during research are added to the database with full enrichment
- Database is clean enough that John can open any entry and send an email with confidence

## User Stories

### US-001: Pull current database state and plan batches
**Description:** As the verification system, I need to read all ~90 unverified companies from Notion and plan the execution order.

**Acceptance Criteria:**
- [ ] Query all companies from Notion database (data_source_id: 2e2cef67-3196-8066-8f74-000b5a3d9de9)
- [ ] Exclude the 10 already verified: Parametric, Lightscreen AI, Tuesday Lab, CraftStory, Cerrion, Genesis AI, DYNA Robotics, Coram AI, Sereact, Protex AI
- [ ] Capture current values for all fields
- [ ] Group by Outreach Tier: Tier 1 (remaining) → Tier 2 → Tier 3 → Monitor → Disqualified
- [ ] Split into batches of 5 companies each
- [ ] Log batch plan to progress.txt

**Recommended agents/skills:** `general-purpose` (Notion MCP query)

---

### US-002: Deep research + job board verification — batch template
**Description:** As a researcher, I need to verify every claim AND re-scan job boards for 5 companies per batch.

**This story repeats for each batch. Each iteration processes 5 companies.**

**Acceptance Criteria:**
- [ ] Deploy web-research-specialist agent for 5 companies
- [ ] For each company, find WITH SOURCE URLs:
  1. **What they build** — visit their actual website, quote what it says
  2. **YC batch** — find YC company page URL, or confirm no YC affiliation
  3. **Funding** — find press releases or TechCrunch articles with amounts, investors, dates
  4. **Founders** — verify names, titles, current roles, backgrounds with LinkedIn URLs. Check if anyone has left or stepped back.
  5. **Job postings** — visit their actual careers/jobs page (URL). Find ACTUAL posting URLs. Copy VERBATIM text from JDs about data/annotation/ML roles. If a job board is JS-rendered, use agent-browser skill. Confirm each role is CURRENTLY OPEN (not expired/filled).
  6. **Team size** — find a source (YC page, LinkedIn, press)
  7. **Contact email** — verify from a public source (personal site, YC page, press release). Mark as VERIFIED, PATTERN, or UNVERIFIED.
- [ ] Flag anything UNVERIFIED explicitly
- [ ] Report discrepancies between research findings and current Notion values
- [ ] If during research you discover a NEW company that fits our ICP (trains CV/video/speech models, needs data/annotation, right size), note it for addition

**Recommended agents/skills:** `web-research-specialist`, `agent-browser` (for JS-rendered job boards)

---

### US-003: QA comparison + re-qualification + Notion update — batch template
**Description:** As QA, I need to compare research against current Notion data, re-qualify each company, fix discrepancies, and update entries.

**This story repeats for each batch, paired with US-002.**

**Acceptance Criteria:**
- [ ] For each company, compare research findings to current Notion values field by field
- [ ] Overwrite structured fields (Stage, Founder/POC, Contact Email, Website, Notes) with verified data
- [ ] Rewrite Claru Fit Analysis with ONLY verified information:
  - Hiring signals with ✅ VERIFIED (actual job URL + verbatim JD text) or ⚠️ UNVERIFIED
  - What Claru can sell them (mapped to our actual catalog based on their VERIFIED needs)
  - Who to contact (verified name + email + source)
  - Recommended pitch angle (based on their verified thesis, not assumptions)
- [ ] **Re-qualify against ICP:** Based on verified evidence, does this company:
  - Train proprietary models that need data? (not just API wrappers)
  - Have the right size/stage for us to sell to?
  - Have a warm connection (YC, shared investor)?
  - Have active hiring signals for data/annotation roles?
  - Have a clear need that maps to our catalog or services?
- [ ] Re-evaluate Outreach Tier based on verified qualification:
  - Upgrade if verified signals are stronger than initially assessed
  - Downgrade to Monitor if claims don't hold up
  - Downgrade to Disqualified if basics can't be verified or company doesn't fit ICP
- [ ] Update Notion via mcp__notion__notion-update-page for each company
- [ ] If new companies were discovered during research, create Notion entries with full enrichment via mcp__notion__notion-create-pages
- [ ] Log completed batch + key findings + any tier changes to progress.txt

**Recommended agents/skills:** `general-purpose` (Notion MCP update + analysis)

---

### US-004 through US-021: Execute all batches
**Description:** Repeat US-002 + US-003 for all remaining companies in priority order.

**Batch execution order:**
1. Remaining Tier 1 companies not yet verified (~10, batches of 5)
2. Tier 2 companies (~36, batches of 5 = ~7 cycles)
3. Tier 3 companies (7, batches of 5 = ~2 cycles)
4. Monitor companies (15, batches of 5 = 3 cycles)
5. Disqualified companies (22, batches of 5 = ~5 cycles)

**Total: ~18-20 research+QA cycles**

**Acceptance Criteria per cycle:**
- [ ] Research agent completes with source URLs for all claims
- [ ] QA comparison identifies all discrepancies
- [ ] Notion entries updated with verified data
- [ ] Tier re-evaluated based on evidence
- [ ] New companies added if discovered
- [ ] Progress logged

---

### US-022: Final QA sweep
**Description:** As QA, I need to run a final consistency check across all companies after all batches complete.

**Acceptance Criteria:**
- [ ] Query all companies from Notion (should now be 100+)
- [ ] Check: no empty fields in Tier 1/2/3 companies
- [ ] Check: no "via website" or generic emails in Tier 1 companies
- [ ] Check: all Tier 1/2 Claru Fit Analysis fields contain ✅ or ⚠️ verification tags
- [ ] Check: Outreach Tier consistent with hiring signal data
- [ ] Check: Priority consistent with Outreach Tier
- [ ] Check: no Disqualified companies with strong verified hiring signals (should have been upgraded)
- [ ] Check: all newly added companies have full field enrichment
- [ ] Generate summary report: total verified, total tier changes, total new companies added, total discrepancies fixed
- [ ] Report any remaining issues

---

## Functional Requirements

- FR-1: Each company's research must produce source URLs for every claim
- FR-2: Job boards must be RE-SCANNED during verification — don't trust previous hiring signal data. Visit actual careers pages and find current postings with URLs.
- FR-3: Discrepancies between research and Notion must be documented before overwriting
- FR-4: Structured fields (Stage, Founder, Email, Notes) are overwritten with verified data
- FR-5: Claru Fit Analysis is REWRITTEN (not appended) with verified-only information
- FR-6: Companies with insufficient public information downgraded to Monitor or Disqualified
- FR-7: Each company is re-qualified against the ICP using VERIFIED evidence only
- FR-8: New companies discovered during research are added with full enrichment
- FR-9: Batches of 5 companies per research agent
- FR-10: Progress logged after each batch completion
- FR-11: UNVERIFIED claims explicitly flagged with ⚠️
- FR-12: For JS-rendered job boards that can't be fetched via web search, use agent-browser skill

## Non-Goals

- Not changing the database schema
- Not doing outreach (separate exercise after this)
- Not re-verifying the 10 "1st Wave Outbound" companies (already done) — but DO update the Outbound page if new data emerges about those 10 or if a newly discovered company should replace one

## Technical Considerations

- Use web-research-specialist agents for deep research (5 companies per agent)
- Use agent-browser skill for JS-rendered careers pages (Ashby, Greenhouse, Lever, Workable)
- Use Notion MCP for all database reads, writes, and creates
- Process order: Tier 1 remaining → Tier 2 → Tier 3 → Monitor → Disqualified
- The 10 "1st Wave Outbound" companies are already verified — skip them
- Rate limits: sequential batches (Ralph loop), one research agent at a time
- Each Ralph iteration = 1 batch of 5 companies (research + QA + Notion update)

## ICP Qualification Criteria (for re-qualification step)

Reference `references/business-context.md` in the prospect-researcher skill, or use this summary:

**Type 1 — Frontier Labs:** Training foundation models (robotics, video, speech, multimodal) that need real-world data. Pre-Seed to Series B, 3-50 people, founder/CTO is buyer.

**Type 2 — Applied AI:** Building products that detect/classify specific human behaviors via camera/video. Behavior is too specific for public datasets. Seed to Series B, have internal ML team.

**Type 3 — Foundation Model Labs:** Training video gen, speech, multimodal, or world models. Need massive scale training data. Series A+, actively training proprietary models.

**Disqualify if:** Competitor (sells data/annotation), API wrapper (no internal ML), Chinese-only investors, university lab, acquired/shut down, domain mismatch.

## Success Metrics

- 100% of Tier 1/2/3 companies have verified data with source URLs
- Zero fabricated details in any Tier 1/2 entry
- All hiring signals verified with actual job posting URLs
- All Outreach Tiers justified by verified evidence
- New companies added expand the qualified pipeline
- Database passes the "John opens any entry and trusts it" test

## Quality Assurance Requirements

Each batch must include:
1. **Deep research** — web-research-specialist with source URLs for every claim
2. **Job board re-scan** — actual careers page visited, current postings confirmed with URLs
3. **QA comparison** — diff current vs. research findings
4. **ICP re-qualification** — does verified evidence support the tier?
5. **Notion update** — corrected data pushed with verification tags

### Execution Guidelines
- **Ralph loop**: Sequential batches. Each iteration = 1 batch of 5 companies.
- **Progress tracking**: Log completed batches, key findings, tier changes, and new companies to progress.txt
- **Autonomous execution**: Each story runs independently. Research → QA → Update → next.

## Additional Rules

**Updating 1st Wave Outbound page:** If verification of any company produces new data that's relevant to the 10 companies in the Outbound page (e.g., a company we dropped discovers a new job posting, or a newly discovered company should replace one of the 10), update the Outbound Notion page (321cef67319680e3b396f578aa92f62c) accordingly. The Outbound page should always reflect the best current data.

**Minimum bar for pre-seed 2-person companies:** Keep them in the database (don't downgrade) IF:
1. We know who backed them (YC, named VC, notable angels) — this validates they're real
2. We know what they're building and it maps to our ICP (robotics, video gen, speech, CV)
3. Their work directly involves needing data/annotation (training models, not just wrapping APIs)

Pre-seed funding IS a buying signal if the company is building foundation models or robotics — they've raised enough to start purchasing data, especially annotation/labeling services. Many pre-seed robotics and foundation model companies are actively buying data.

Only downgrade pre-seed companies if: we can't verify what they build, can't identify who backed them, OR they're clearly just an API wrapper with no model training.

## Open Questions

None — all resolved.
