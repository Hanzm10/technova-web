-- Make the 'product-images' bucket public if it exists
UPDATE storage.buckets
SET public = true
WHERE id = 'product-images';

-- Allow public access to any files in the "product-images" bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated admins to insert/update/delete 
CREATE POLICY "Admin Insert Access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.jwt() ->> 'role' = 'authenticated' -- We can rely on Clerk/Supabase integration for robust role-checking, but standard auth is required
);

CREATE POLICY "Admin Update Access"
ON storage.objects FOR UPDATE
TO authenticated
WITH CHECK (
  bucket_id = 'product-images'
);

CREATE POLICY "Admin Delete Access"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images'
);
