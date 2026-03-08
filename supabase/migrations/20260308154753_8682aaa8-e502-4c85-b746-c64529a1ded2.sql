CREATE POLICY "Allow public uploads to site-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "Allow public updates to site-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'site-images');

CREATE POLICY "Allow public deletes from site-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'site-images');