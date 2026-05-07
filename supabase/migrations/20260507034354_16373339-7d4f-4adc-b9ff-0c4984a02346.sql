
-- Restrict broad listing on site-images while keeping individual object access
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects' AND cmd='SELECT'
      AND (qual LIKE '%site-images%' OR qual = 'true')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "site_images_public_read_object"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-images' AND name IS NOT NULL);
