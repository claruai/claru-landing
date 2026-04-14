-- =============================================================================
-- Reply Events — Durable event store for Smartlead reply webhooks
-- Smartlead retries failed webhooks only 3 times then drops permanently.
-- The UNIQUE on smartlead_message_id enables idempotent upsert as safety net.
-- =============================================================================

CREATE TABLE IF NOT EXISTS reply_events (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  smartlead_message_id  text UNIQUE NOT NULL,
  campaign_id           text NOT NULL,
  lead_email            text NOT NULL,
  attio_record_id       text,
  reply_body            text,
  classification        text,
  confidence            numeric,
  attio_synced          boolean DEFAULT false,
  slack_notified        boolean DEFAULT false,
  created_at            timestamptz DEFAULT now(),
  processed_at          timestamptz
);

CREATE INDEX idx_reply_events_unsynced
  ON reply_events (attio_synced)
  WHERE attio_synced = false;
