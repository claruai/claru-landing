-- Remove auto-count trigger so total_samples is manually managed
DROP TRIGGER IF EXISTS trigger_update_sample_count ON dataset_samples;
DROP FUNCTION IF EXISTS update_dataset_sample_count();
