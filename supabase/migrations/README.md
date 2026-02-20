# Supabase Migrations

## How to Run

These SQL migration files are designed to be executed in the **Supabase SQL Editor** (since we use Supabase's hosted Postgres rather than the local CLI).

### Steps

1. Open your Supabase project dashboard at https://supabase.com/dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the migration file (`001_data_catalog_schema.sql`) and copy its entire contents
5. Paste into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. Verify the tables were created by navigating to **Table Editor** in the sidebar

### Migration Files

| File | Description |
|------|-------------|
| `001_data_catalog_schema.sql` | Creates all data catalog tables (dataset_categories, datasets, dataset_samples, leads, lead_dataset_access, custom_requests, settings), RLS policies, indexes, updated_at triggers, and seed data |

### Notes

- The migration is idempotent: it uses `IF NOT EXISTS` guards on tables and indexes, `OR REPLACE` on functions, `DROP TRIGGER IF EXISTS` before creating triggers, and `ON CONFLICT DO NOTHING` for seed data. It is safe to run multiple times.
- RLS is enabled on all tables. Admin operations use the `service_role` key which bypasses RLS entirely, so no admin-specific policies are needed.
- The `updated_at` trigger automatically sets the `updated_at` column to `now()` on every UPDATE for the `datasets`, `leads`, and `settings` tables.

### Verifying RLS Policies

After running the migration, you can verify RLS policies in the Supabase dashboard:

1. Go to **Authentication > Policies** to see all policies grouped by table
2. Or run this query in the SQL Editor:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```
