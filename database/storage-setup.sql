-- Supabase Storage Setup for Gentle Electronics
-- Run this in the Supabase SQL Editor to create the products storage bucket

-- Create the 'products' storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'products');

-- Allow authenticated users to update files
CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'products');

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'products');

-- Allow public read access for product images
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products');

-- Store Settings table (for Admin Settings page)
CREATE TABLE IF NOT EXISTS public.store_settings (
  key text PRIMARY KEY,
  value text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings viewable by authenticated" ON public.store_settings
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Settings insertable by authenticated" ON public.store_settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Settings updatable by authenticated" ON public.store_settings
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Settings deletable by authenticated" ON public.store_settings
  FOR DELETE USING (auth.role() = 'authenticated');
