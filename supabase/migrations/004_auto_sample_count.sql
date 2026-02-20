-- Auto-update total_samples on datasets when samples are inserted/deleted
CREATE OR REPLACE FUNCTION update_dataset_sample_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE datasets SET total_samples = (
      SELECT COUNT(*) FROM dataset_samples WHERE dataset_id = NEW.dataset_id
    ) WHERE id = NEW.dataset_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE datasets SET total_samples = (
      SELECT COUNT(*) FROM dataset_samples WHERE dataset_id = OLD.dataset_id
    ) WHERE id = OLD.dataset_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_sample_count ON dataset_samples;
CREATE TRIGGER trigger_update_sample_count
  AFTER INSERT OR DELETE ON dataset_samples
  FOR EACH ROW
  EXECUTE FUNCTION update_dataset_sample_count();

-- Backfill current counts
UPDATE datasets SET total_samples = (
  SELECT COUNT(*) FROM dataset_samples WHERE dataset_samples.dataset_id = datasets.id
);
