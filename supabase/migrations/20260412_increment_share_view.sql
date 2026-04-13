CREATE OR REPLACE FUNCTION public.increment_share_view(p_dataset_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE datasets
  SET share_view_count = share_view_count + 1,
      share_first_viewed_at = COALESCE(share_first_viewed_at, now())
  WHERE id = p_dataset_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
