-- =============================================================================
-- US-001: Create reply_queue table
-- Stores inbound email replies for admin review and approval.
-- Service-role key bypasses RLS — no policies = only service-role can R/W.
-- =============================================================================

CREATE TABLE public.reply_queue (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id           uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  inbox             text NOT NULL CHECK (inbox IN ('claru', 'moonvalley')),
  sender_email      text NOT NULL,
  sender_name       text,
  gmail_message_id  text NOT NULL,
  gmail_thread_id   text,
  received_at       timestamptz NOT NULL,
  subject           text,
  body_full         text,
  body_snippet      text GENERATED ALWAYS AS (left(body_full, 500)) STORED,
  classification    text NOT NULL CHECK (classification IN (
                      'interested', 'question', 'requirements',
                      'not_interested', 'bounce', 'internal_forward',
                      'unsubscribe', 'unknown'
                    )),
  draft_response    text,
  draft_status      text NOT NULL DEFAULT 'pending' CHECK (draft_status IN (
                      'pending', 'approved', 'dismissed', 'sent',
                      'snoozed', 'needs_manual_draft'
                    )),
  snoozed_until     timestamptz,
  approved_at       timestamptz,
  sent_at           timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- Deduplication: same inbox + gmail message ID must be unique
ALTER TABLE public.reply_queue
  ADD CONSTRAINT reply_queue_inbox_message_unique UNIQUE (inbox, gmail_message_id);

-- Partial index on pending/actionable items for fast queue page loads
CREATE INDEX idx_reply_queue_pending
  ON public.reply_queue (draft_status, received_at DESC)
  WHERE draft_status IN ('pending', 'snoozed', 'needs_manual_draft');

-- RLS: enable with no policies — only service-role key can access
ALTER TABLE public.reply_queue ENABLE ROW LEVEL SECURITY;

-- updated_at trigger
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.reply_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
