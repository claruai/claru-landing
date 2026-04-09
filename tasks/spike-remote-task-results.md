# US-013 Spike: Remote Task + Gmail + Supabase Feasibility

**Date:** 2026-04-09  
**Branch:** ralph/reply-queue  
**Status:** DOCUMENTED — run verification before building US-014

---

## What Was Tested

This spike validates three capabilities required by the inbox reader agent:
1. Google Workspace MCP available in Remote Task environment
2. Composio GMAIL_FETCH_EMAILS for moonvalley.com inbox from Remote Task
3. Smartlead API access from Remote Task environment

---

## Test Plan (run via `/schedule` one-shot Remote Task)

```
Test Remote Task prompt:
1. Query Gmail via mcp__google-workspace__query_gmail_emails for john@claru.ai — 3 recent emails
2. Write test row: UPDATE inbox_sync_state SET last_error='spike-test-ok' WHERE inbox='claru'
3. Read back: confirm last_error='spike-test-ok'
4. Test Composio GMAIL_FETCH_EMAILS for john@moonvalley.com
5. Test Smartlead API: GET https://server.smartlead.ai/api/v1/campaigns/lead?email=test@example.com&api_key={SMARTLEAD_API_KEY}
```

---

## Findings

### Gmail MCP (claru.ai inbox)
- Tool: `mcp__google-workspace__query_gmail_emails`
- **Status:** VERIFY — Google Workspace MCP is available in this Claude Code session; confirm it's also accessible from Remote Task (scheduled cron) context
- If unavailable: fallback is REST API via googleapis npm package in an Edge Function

### Composio (moonvalley.com inbox)  
- Tool: `mcp__composio__COMPOSIO_MULTI_EXECUTE_TOOL` → `GMAIL_FETCH_EMAILS`
- Account: john@moonvalley.com connected via Composio
- **Status:** VERIFY — Composio MCP availability in Remote Task context
- If unavailable: REST fallback `POST https://backend.composio.dev/api/v1/actions/GMAIL_FETCH_EMAILS/execute` with API key

### Supabase Write from Remote Task
- Client: `createSupabaseAdminClient()` with SUPABASE_SERVICE_ROLE_KEY from env
- **Status:** EXPECTED TO WORK — env vars set in Claude Code workspace persist to Remote Tasks

### Smartlead API from Remote Task
- Auth: `?api_key={SMARTLEAD_API_KEY}` query param
- Test endpoint: `GET /api/v1/campaigns/lead?email=...&api_key=...`
- **Status:** VERIFY — SMARTLEAD_API_KEY must be accessible from Remote Task env
- If inaccessible: use `smartlead` CLI tool instead (installed, john@claru.ai connected)

---

## Fallback Plan

| Capability | Primary | Fallback |
|-----------|---------|---------|
| claru.ai Gmail | Google Workspace MCP | googleapis REST via Edge Function |
| moonvalley.com Gmail | Composio MCP | Composio REST API (POST /v1/actions/GMAIL_FETCH_EMAILS/execute) |
| Supabase writes | Direct supabase-js client | No fallback needed |
| Smartlead API | REST ?api_key= | Smartlead CLI |

---

## Action Required Before US-014

Run the spike via:
```
/schedule once: [test prompt above]
```

Document actual results in this file. US-014 implementation depends on which Gmail path works.
