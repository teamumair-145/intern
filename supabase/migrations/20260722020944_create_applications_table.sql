
/*
# Create internship applications table

1. New Tables
  - `applications`
    - `id` (uuid, primary key)
    - `full_name` (text, not null)
    - `email` (text, not null)
    - `phone` (text)
    - `education` (text) — current education level
    - `track` (text, not null) — selected internship track
    - `duration` (text, not null) — 2 weeks or 1 month
    - `motivation` (text) — why they want to join
    - `resume_url` (text) — storage path to uploaded resume
    - `resume_filename` (text) — original filename
    - `status` (text, default 'pending') — application status
    - `created_at` (timestamptz, default now())

2. Security
  - Enable RLS
  - Anon + authenticated can INSERT (public apply form)
  - Only authenticated can SELECT/UPDATE/DELETE (admin panel)
*/

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  education text,
  track text NOT NULL,
  duration text NOT NULL,
  motivation text,
  resume_url text,
  resume_filename text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_applications" ON applications;
CREATE POLICY "anon_insert_applications" ON applications FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_applications" ON applications;
CREATE POLICY "auth_select_applications" ON applications FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_applications" ON applications;
CREATE POLICY "auth_update_applications" ON applications FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_applications" ON applications;
CREATE POLICY "auth_delete_applications" ON applications FOR DELETE
  TO authenticated USING (true);
