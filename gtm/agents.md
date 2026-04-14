# Agent Team Architecture for Outbound
**Last updated:** 2026-04-06 | The way outbound should run — not as a single agent doing serial work.

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

## The Target Architecture

### Phase 1: Prospect (Parallel — 30 agents)

Launch one **Prospector Agent** per target company. Each agent:
1. Researches the company (funding, product, hiring, papers, public statements)
2. Identifies the right decision maker (title, stage-appropriate)
3. Verifies email (Hunter.io, PDL, Apollo, pattern)
4. Finds ONE specific non-swappable signal for T1 opener
5. Returns: `{ company, contact, email, confidence, signal, signal_source }`

Cap at 6 parallel agents at a time to avoid rate limits. Run in waves of 6.

### Phase 2: Relationship Check (Single agent, fast)

One **Conflict Check Agent** runs before any copy is written:
- Checks all returned leads against Attio (existing interaction?)
- Checks all Smartlead campaigns (already emailed?)
- Checks Gmail for existing threads
- Removes any conflict leads
- Returns clean list

### Phase 3: Copywriting (Parallel — one agent per lead)

One **Copywriter Agent** per lead. Each agent:
1. Reads the signal from Phase 1
2. Reads `gtm/strategy/messaging.md` and `gtm/playbooks/copy.md`
3. Writes T1, T2, T3
4. Self-scores on 6 dimensions (avg ≥9.5, no dim <7)
5. Iterates until passing
6. Returns scored copy

### Phase 3.5: Verification (Single agent per lead)

One **Verifier Agent** per lead cross-checks the draft against its source fact sheet. Runs 6 checks in order: hallucination, signal URL, channel, copy rules, posture, dedup. If any check fails, the draft routes back to the copywriter with a revision note. Max 2 revision loops, then human escalation.

**Reference:** `gtm/playbooks/verifier-agent.md` — full prompt template, check definitions, and test examples.

### Phase 4: QA (Single agent — reviews all 30)

One **QA Agent** reads the full batch and checks for:
- Any em-dashes (—) anywhere in T1/T2 bodies
- Accusatory openers (calling out gap/failure before trust)
- Gap-audit CTAs ("what can't you do?") instead of client behavior CTAs
- Duplicate opener structures across the batch (structure variety check)
- Subject lines over 5 words
- Bodies over 80 words
- Missing credibility line in T1
- Missing full corpus inventory in bridge

Returns: pass list + fail list with specific violations.

### Phase 5: Fix Loop

For each failing lead, a new **Copywriter Agent** rewrites with QA violations as explicit constraints. QA re-scores. Loops until all pass.

### Phase 6: Load (Single agent)

**Loader Agent** compiles master file and runs Smartlead CLI to:
- Create campaign (DRAFTED, not ACTIVE)
- Add all leads with custom fields
- Verify all 26+ leads loaded correctly

---

## Role Definitions

| Role | Count | Scope | Tools |
|------|-------|-------|-------|
| Orchestrator | 1 | Coordinates all phases, tracks state | All |
| Prospector | 1 per company | Research + email verify + signal find | WebSearch, WebFetch, Bash (Hunter CLI) |
| Conflict Checker | 1 | Attio + Smartlead + Gmail cross-check | mcp__attio, Bash (smartlead CLI), mcp__gmail |
| Copywriter | 1 per lead | Write T1/T2/T3 + self-score | Read (GTM files), Write |
| Verifier | 1 per lead | Cross-check draft against fact sheet (6 checks) | Read (fact sheet + draft) |
| QA Reviewer | 1 | Full batch review on 6 dimensions | Read |
| Loader | 1 | Master file compile + Smartlead load | Bash (smartlead CLI), Write |

---

## How to Invoke

In Claude Code, orchestrate via the Agent tool:

```
# Launch 6 prospector agents in parallel (one wave)
Agent(subagent_type="general-purpose", prompt="Research [Company]. Find decision maker, verify email, find ONE specific non-swappable signal. Return JSON: {company, contact, email, confidence, signal, signal_source}")
```

Run in waves of 6 to respect rate limits. After each wave completes, launch the next.

For copywriter agents:
```
Agent(subagent_type="general-purpose", run_in_background=True, prompt="Write supply-side T1/T2/T3 for [Company] / [Contact]. Signal: [signal]. Rules: gtm/strategy/messaging.md, gtm/playbooks/copy.md. Score all 6 dimensions. Return scored copy only.")
```

---

## What This Replaces

**Old approach (broken):**
One conversation thread does research, writing, scoring, loading for all 30 leads. Context degrades at lead #15. QA is manual. Takes multiple sessions.

**New approach:**
Orchestrator fires 30 scoped agents. Each agent returns one clean artifact. QA agent does a single pass. Loader runs one Smartlead batch. Single session, parallelized.

---

## Wave Size Limits

- **Max 6 prospector agents in parallel** — Hunter.io + web search rate limits
- **Max 10 copywriter agents in parallel** — no rate limit issue, but easier to QA in batches
- **1 QA agent reviews all 30** — needs full batch visible
- **1 loader agent** — sequential Smartlead API calls

---

## Quality Gates (Non-Negotiable)

Before the loader runs, QA must confirm:
- [ ] All T1 openers are non-swappable (specific observable signal only)
- [ ] Zero accusatory openers (no gap declarations before trust)
- [ ] Zero em-dashes in T1/T2 bodies
- [ ] All CTAs are client behavior questions (yes/no about THEIR clients)
- [ ] All T3s are one sentence only
- [ ] All subjects 2-5 words lowercase
- [ ] All bodies under 80 words
- [ ] Full corpus in every T1 bridge (400K+ egocentric, 2M cinematic, 10K+ gaming, annotation workforce, 2K+ collectors)
- [ ] Credibility line in every T1

---

## Reference Files

- Voice rules: `gtm/strategy/messaging.md`
- Copy patterns: `gtm/playbooks/copy.md`
- Anti-accusatory rules: `gtm/playbooks/anti-accusatory-openers.md`
- Campaign quality: `gtm/strategy/campaign-quality.md`
