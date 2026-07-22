
/*
# Storage bucket and policies for resumes

Creates the resumes bucket and RLS policies for uploads.
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('resumes', 'resumes', false, 10485760, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "anon_upload_resumes" ON storage.objects;
CREATE POLICY "anon_upload_resumes" ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'resumes');

DROP POLICY IF EXISTS "auth_read_resumes" ON storage.objects;
CREATE POLICY "auth_read_resumes" ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'resumes');
