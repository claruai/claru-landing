-- =============================================================================
-- US-003: Create inbox_sync_state table
-- Checkpoint table for inbox reader agent watermark.
-- Agent reads last_processed_at to derive after:YYYY/MM/DD Gmail query.
-- =============================================================================

CREATE TABLE public.inbox_sync_state (
  inbox             text PRIMARY KEY CHECK (inbox IN ('claru', 'moonvalley')),
  last_processed_at timestamptz NOT NULL DEFAULT '1970-01-01 00:00:00+00',
  last_message_id   text,
  last_error        text,
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- RLS: enable with no policies — only service-role key can access
ALTER TABLE public.inbox_sync_state ENABLE ROW LEVEL SECURITY;

-- updated_at trigger
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.inbox_sync_state
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed both inboxes
INSERT INTO public.inbox_sync_state (inbox)
VALUES ('claru'), ('moonvalley')
ON CONFLICT (inbox) DO NOTHING;
