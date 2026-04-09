# Agent Schedule Configuration

All Remote Task agents for the Claru Agent-First CRM.
Deploy via: `/schedule cron "<cron>" <AGENT_PROMPT>`

---

## Active Agents

### 1. Inbox Reader (US-014/015/016)
**Schedule:** Every 30 minutes  
**Cron:** `*/30 * * * *`  
**Prompt:** `INBOX_READER_AGENT_PROMPT` from `src/lib/agent/inbox-reader.ts`  
**What it does:** Reads both inboxes (claru + moonvalley) using date-based checkpoints,
matches senders to leads, classifies intent, generates draft replies, writes to reply_queue.  
**Auth needed:** Google Workspace MCP (claru inbox), Composio MCP (moonvalley inbox), Supabase service-role.

---

### 2. Smartlead Sync (US-020)
**Schedule:** Hourly  
**Cron:** `0 * * * *`  
**Prompt:** `SMARTLEAD_SYNC_AGENT_PROMPT` from `src/lib/agent/smartlead-sync.ts`  
**What it does:** For each active lead with a smartlead_lead_id, fetches current campaign
name and sequence step from Smartlead API and syncs to lead_crm_data.  
**Auth needed:** `SMARTLEAD_API_KEY` env var (used as `?api_key=` query param).  
**Rate limit:** 200ms delay between calls; abort entire run on HTTP 429.

---

### 3. Signal Scanner (US-021)
**Schedule:** Daily at 8am ET (1pm UTC)  
**Cron:** `0 13 * * *`  
**Prompt:** `SIGNAL_SCANNER_AGENT_PROMPT` from `src/lib/agent/signal-scanner.ts`  
**What it does:** Scans `gtm/knowledge-graph/companies/*.md` for high-ICP companies
(icp_score >= 80 on 0-100 scale) not yet in the leads table. Writes new entries to
prospect_signals for admin review.  
**Auth needed:** Supabase service-role (reads leads, writes prospect_signals).

---

## Feasibility Prerequisites

Before deploying inbox reader, complete the spike in `tasks/spike-remote-task-results.md`:
1. Verify Google Workspace MCP is accessible from Remote Task context
2. Verify Composio MCP (or REST fallback) works for moonvalley inbox
3. Verify Smartlead API responds correctly (check field names for sequence step)

---

## Environment Variables Required

```bash
# Admin access control (server-only — NO NEXT_PUBLIC_ prefix)
ADMIN_EMAILS=john@claru.ai,john@moonvalley.com,chad@claru.ai

# Smartlead API (used as ?api_key= query param)
SMARTLEAD_API_KEY=<key>

# Supabase service-role (already present)
SUPABASE_SERVICE_ROLE_KEY=<key>
```
