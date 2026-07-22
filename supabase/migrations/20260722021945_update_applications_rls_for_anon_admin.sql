
/*
# Update applications RLS for anon admin access

The admin panel now uses a simple client-side credential check (admin/admin999)
instead of Supabase Auth. Since the admin client uses the anon key, RLS policies
must allow anon to SELECT, UPDATE, and DELETE applications.

1. Security changes
  - Drop existing auth-only SELECT/UPDATE/DELETE policies
  - Create new anon+authenticated SELECT/UPDATE/DELETE policies
  - INSERT policy unchanged (already open to anon for the public form)
*/

DROP POLICY IF EXISTS "auth_select_applications" ON applications;
DROP POLICY IF EXISTS "auth_update_applications" ON applications;
DROP POLICY IF EXISTS "auth_delete_applications" ON applications;

CREATE POLICY "anon_select_applications" ON applications FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "anon_update_applications" ON applications FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "anon_delete_applications" ON applications FOR DELETE
  TO anon, authenticated USING (true);
