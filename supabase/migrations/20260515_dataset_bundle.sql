-- Bundle download support for the existing /share/<token> view (2026-05-15).
--
-- Lets a dataset expose a single downloadable archive (e.g. a lerobot v2.1
-- tarball) alongside the per-clip stream the share page already provides.
-- The bundle lives in S3; the share endpoint hands out a fresh 1-hour
-- presigned URL each time so the same /share/<token> link keeps working
-- indefinitely (or until share_expires_at).
--
-- All four columns are nullable / additive — no existing share link or
-- code path changes behaviour when bundle fields are NULL.

BEGIN;

ALTER TABLE public.datasets
  ADD COLUMN IF NOT EXISTS bundle_s3_bucket text,
  ADD COLUMN IF NOT EXISTS bundle_s3_key text,
  ADD COLUMN IF NOT EXISTS bundle_size_bytes bigint,
  ADD COLUMN IF NOT EXISTS bundle_format text,
  ADD COLUMN IF NOT EXISTS bundle_label text;

COMMENT ON COLUMN public.datasets.bundle_s3_bucket IS 'S3 bucket holding the downloadable archive (e.g. moonvalley-annotation-platform).';
COMMENT ON COLUMN public.datasets.bundle_s3_key IS 'S3 key for the downloadable archive (e.g. lerobot-exports/<slug>/v1/<slug>-v1.tar.gz). NULL = no bundle attached.';
COMMENT ON COLUMN public.datasets.bundle_size_bytes IS 'Size of the bundle in bytes (display on share page).';
COMMENT ON COLUMN public.datasets.bundle_format IS 'Free-form label such as ''lerobot-v2.1'' or ''parquet''. Display only.';
COMMENT ON COLUMN public.datasets.bundle_label IS 'Override for the download button label. Defaults to "Download bundle" when null.';

COMMIT;
