# Agent Team Architecture for Outbound
**Last updated:** 2026-04-13 | Complete Tier 1-3 pipeline: fact sheets, verifier, banned pattern gate, reply classifier.

---

## The Problem With Single-Agent Outbound

When one agent builds an entire 30-lead campaign sequentially:
- Context window fills up with company research, email drafts, scoring tables
- Work degrades as context gets compressed
- Rate limits hit harder (one agent hitting APIs back-to-back)
- Mistakes compound — a bad pattern early gets replicated across all 30
- Quality review happens after the fact, not inline

The correct architecture is a swarm: 20-30 focused agents working in parallel, each owning one company end-to-end, with a QA agent and orchestrator.

---

## The Target Pipeline

### Phase 1: Prospect (Parallel — up to 6 agents per wave)

Launch one **Prospector Agent** per target company. Each agent:
1. Researches the company (funding, product, hiring, papers, public statements)
2. Identifies the right decision maker (title, stage-appropriate)
3. Verifies email (Hunter.io, PDL, Apollo, pattern)
4. Finds ONE specific non-swappable signal for T1 opener
5. **Outputs a structured JSON fact sheet** per `gtm/playbooks/research-fact-sheet-schema.md`

The fact sheet schema enforces:
- `signal.source_url` is REQUIRED — no URL means signal must be null
- `existing_relationship` must be checked BEFORE research proceeds (Attio, Smartlead, Gmail, contacts-master.md)
- If any existing relationship is found, lead goes to human review, not cold sequence

Cap at 6 parallel agents at a time to avoid rate limits. Run in waves of 6.

**Reference:** `gtm/playbooks/research-fact-sheet-schema.md`

### Phase 2: Relationship Check (Single agent, fast)

One **Conflict Check Agent** runs before any copy is written:
- Checks all returned leads against Attio (existing interaction?)
- Checks all Smartlead campaigns (already emailed?)
- Checks Gmail for existing threads
- Cross-checks `existing_relationship` fields from fact sheets
- Removes any conflict leads
- Returns clean list

### Phase 3: Copywriting (Parallel — one agent per lead)

One **Copywriter Agent** per lead. Each agent:
1. Reads the fact sheet JSON from Phase 1 — **and nothing else**
2. Reads `gtm/strategy/messaging.md` and `gtm/playbooks/copy.md`
3. Writes T1, T2, T3
4. Self-scores on 6 dimensions (avg >= 9.5, no dim < 7)
5. Iterates until passing
6. Returns scored copy

The copywriter cannot hallucinate what isn't in the fact sheet — it has no other context about the lead.

### Phase 3.5: Banned Pattern Gate (Static — no LLM)

**Every draft runs through the deterministic pattern filter before LLM-based checks.**

`scripts/banned-pattern-gate.py` catches:
- Em-dashes, slop phrases ("I'd love to", "impressive work", "I came across")
- Opening with "I " or "We "
- Subject > 5 words, body > 80 words
- Multiple questions, hyperlinks, banned words (delve, leverage, etc.)
- Supply-side: any mention of "claru.ai" or "Claru"

Returns `{ pass, violations }`. Any violation = rewrite before proceeding.

**Reference:** `scripts/banned-pattern-gate.py` (run with `--test` to verify)

### Phase 4: Verification (Single agent per lead)

One **Verifier Agent** per lead cross-checks the draft against its source fact sheet. Runs 6 checks in order:

1. **Hallucination check:** Every claim traces to `verified_facts` or `signal.detail`
2. **Signal URL check:** `signal.source_url` present and referenced in opener
3. **Channel check:** If `channel=supply`, no mention of claru.ai
4. **Copy rules check:** Em-dashes, opening with I/We, word count, subject length, meeting CTA
5. **Posture check:** Founder or consultant? Apply posture test from `strategy/messaging.md`
6. **Dedup check:** `existing_relationship` all false — if any true, hard reject

Output: `{ pass, failures, revision_note }`

If `pass=false`, draft routes back to copywriter with `revision_note`. Max 2 revision loops, then human escalation.

**Reference:** `gtm/playbooks/verifier-agent.md`

### Phase 5: QA (Single agent — reviews all 30)

One **QA Supervisor Agent** reads the full batch and checks for:
- Any remaining em-dashes anywhere in T1/T2 bodies
- Accusatory openers (calling out gap/failure before trust)
- Gap-audit CTAs instead of open-offer CTAs
- Duplicate opener structures across the batch (structure variety check)
- Subject lines over 5 words
- Bodies over 80 words
- Missing credibility line in T1
- Missing full corpus inventory in bridge

Returns: pass list + fail list with specific violations.

### Phase 6: Fix Loop

For each failing lead, a new **Copywriter Agent** rewrites with QA violations as explicit constraints. QA re-scores. Loops until all pass.

### Phase 7: Human Review Gate

The full batch is presented to John for final approval. No emails load to Smartlead without explicit human sign-off. This is non-negotiable.

### Phase 8: Load (Single agent)

**Loader Agent** compiles master file and runs Smartlead CLI to:
- Create campaign (DRAFTED, not ACTIVE)
- Add all leads with custom fields (including `attio_record_id`)
- Verify all leads loaded correctly

---

## Reply Handling Pipeline

When a reply arrives via Smartlead webhook:

```
Smartlead webhook (EMAIL_REPLIED)
  -> Supabase Edge Function: handle-smartlead-reply
     1. Parse payload (lead_email, reply_body, campaign_id)
     2. Write to reply_events table (durable, idempotent)
     3. Classify reply via Claude Haiku (7 categories)
     4. Route per category rules
```

**7 categories:** interested, question, objection, ooo, unsubscribe, referral, not_interested

**Confidence threshold:** < 0.75 routes to human review. The classifier never generates response content — classify and route only.

**Reference:** `gtm/playbooks/reply-classifier.md`

---

## Shared State: campaign_leads Table

The `campaign_leads` Supabase table is the shared blackboard for agent swarms:

```
Status flow: pending -> dedup_checked -> researching -> research_done ->
             writing -> draft_done -> qa -> human_approved -> loaded
```

- Atomic claim locking via `SELECT FOR UPDATE SKIP LOCKED`
- `channel` column determines voice rules (demand vs supply)
- `research_output` stores the fact sheet JSON
- `draft_output` stores scored copy
- `qa_score` and `qa_failures` track QA results

---

## Role Definitions

| Role | Count | Scope | Tools |
|------|-------|-------|-------|
| Orchestrator | 1 | Coordinates all phases, tracks state | All |
| Prospector | 1 per company | Research + email verify + fact sheet output | WebSearch, WebFetch, Bash (Hunter CLI) |
| Conflict Checker | 1 | Attio + Smartlead + Gmail cross-check | mcp__attio, Bash (smartlead CLI), mcp__gmail |
| Copywriter | 1 per lead | Write T1/T2/T3 from fact sheet only + self-score | Read (GTM files), Write |
| Banned Pattern Gate | 1 (static) | Regex-based slop filter, no LLM | scripts/banned-pattern-gate.py |
| Verifier | 1 per lead | Cross-check draft against fact sheet (6 checks) | Read (fact sheet + draft) |
| QA Supervisor | 1 | Full batch review on 6 dimensions | Read |
| Reply Classifier | 1 per reply | 7-category classification, no response generation | Claude Haiku |
| Loader | 1 | Master file compile + Smartlead load | Bash (smartlead CLI), Write |

---

## How to Invoke

In Claude Code, orchestrate via the Agent tool:

```
# Launch 6 prospector agents in parallel (one wave)
Agent(subagent_type="general-purpose", prompt="Research [Company]. Output a structured JSON fact sheet per gtm/playbooks/research-fact-sheet-schema.md. Check Attio, Smartlead, Gmail, contacts-master.md for existing relationships first.")
```

Run in waves of 6 to respect rate limits. After each wave completes, launch the next.

For copywriter agents:
```
Agent(subagent_type="general-purpose", run_in_background=True, prompt="Write T1/T2/T3 for [Company] / [Contact]. Input: [fact sheet JSON]. Rules: gtm/strategy/messaging.md, gtm/playbooks/copy.md. Score all 6 dimensions. Return scored copy only.")
```

For the banned pattern gate:
```
echo '{"subject":"...", "body":"...", "channel":"demand"}' | python scripts/banned-pattern-gate.py
```

---

## What This Replaces

**Old approach (broken):**
One conversation thread does research, writing, scoring, loading for all 30 leads. Context degrades at lead #15. QA is manual. Takes multiple sessions.

**New approach:**
Orchestrator fires 30 scoped agents. Each agent returns one clean artifact. Banned pattern gate catches slop statically. Verifier cross-checks against fact sheets. QA agent does a single pass. Loader runs one Smartlead batch. Single session, parallelized.

---

## Wave Size Limits

- **Max 6 prospector agents in parallel** — Hunter.io + web search rate limits
- **Max 10 copywriter agents in parallel** — no rate limit issue, but easier to QA in batches
- **1 QA agent reviews all 30** — needs full batch visible
- **1 loader agent** — sequential Smartlead API calls

---

## Quality Gates (Non-Negotiable)

Before the loader runs, all of these must be true:
- [ ] All fact sheets have `signal.source_url` or `signal: null`
- [ ] All `existing_relationship` fields checked — no conflicts in batch
- [ ] Banned pattern gate passes on every email (0 violations)
- [ ] Verifier passes on every email (6/6 checks)
- [ ] All T1 openers are non-swappable (specific observable signal only)
- [ ] Zero accusatory openers (no gap declarations before trust)
- [ ] All CTAs are open offers, not probes or closes
- [ ] All T3s are one sentence only
- [ ] All subjects 2-5 words lowercase
- [ ] All bodies under 80 words
- [ ] Full corpus in every T1 bridge
- [ ] Human has reviewed and approved the full batch

---

## Reference Files

- Research fact sheet schema: `gtm/playbooks/research-fact-sheet-schema.md`
- Verifier agent: `gtm/playbooks/verifier-agent.md`
- Reply classifier: `gtm/playbooks/reply-classifier.md`
- Banned pattern gate: `scripts/banned-pattern-gate.py`
- Voice rules: `gtm/strategy/messaging.md`
- Copy patterns: `gtm/playbooks/copy.md`
- Anti-accusatory rules: `gtm/playbooks/anti-accusatory-openers.md`
- Campaign quality: `gtm/strategy/campaign-quality.md`
