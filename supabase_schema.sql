-- ============================================================================
-- GHOSH TYRE ZONE – SUPABASE DATABASE & STORAGE SETUP SCRIPT
-- Run this entire script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================================

-- Enable UUID generation extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. PRODUCTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY DEFAULT ('prod-' || gen_random_uuid()::text),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sku TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  category_slug TEXT NOT NULL DEFAULT 'tyres',
  sub_category TEXT DEFAULT '',
  vehicle_types TEXT[] NOT NULL DEFAULT ARRAY['Car']::TEXT[],
  compatible_models TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  price NUMERIC DEFAULT NULL,
  contact_for_price BOOLEAN NOT NULL DEFAULT TRUE,
  availability TEXT NOT NULL DEFAULT 'In Stock',
  short_description TEXT NOT NULL DEFAULT '',
  full_description TEXT NOT NULL DEFAULT '',
  specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
  tyre_specs JSONB DEFAULT '{}'::jsonb,
  images TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  visual_type TEXT NOT NULL DEFAULT 'tyre-car',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  additional_info TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policies for products (Public Read, Anon/Authenticated Insert/Update/Delete for Admin Portal)
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products"
  ON public.products FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Admin can insert products" ON public.products;
CREATE POLICY "Admin can insert products"
  ON public.products FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can update products" ON public.products;
CREATE POLICY "Admin can update products"
  ON public.products FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can delete products" ON public.products;
CREATE POLICY "Admin can delete products"
  ON public.products FOR DELETE
  TO public
  USING (true);

-- ============================================================================
-- 2. BLOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.blogs (
  id TEXT PRIMARY KEY DEFAULT ('blog-' || gen_random_uuid()::text),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  featured_image TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT 'Ghosh Tyre Zone Technical Team',
  category TEXT NOT NULL DEFAULT 'Tyre Care Guide',
  read_time TEXT NOT NULL DEFAULT '4 min read',
  key_takeaways TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  published_date TEXT NOT NULL DEFAULT '',
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on blogs
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view blogs" ON public.blogs;
CREATE POLICY "Public can view blogs"
  ON public.blogs FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Admin can insert blogs" ON public.blogs;
CREATE POLICY "Admin can insert blogs"
  ON public.blogs FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can update blogs" ON public.blogs;
CREATE POLICY "Admin can update blogs"
  ON public.blogs FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can delete blogs" ON public.blogs;
CREATE POLICY "Admin can delete blogs"
  ON public.blogs FOR DELETE
  TO public
  USING (true);

-- ============================================================================
-- 3. ENQUIRIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.enquiries (
  id TEXT PRIMARY KEY DEFAULT ('enq-' || gen_random_uuid()::text),
  reference_no TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'product',
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT DEFAULT '',
  city TEXT NOT NULL DEFAULT 'Kolkata',
  state TEXT DEFAULT 'West Bengal',
  pincode TEXT DEFAULT '',
  vehicle_type TEXT DEFAULT '',
  vehicle_model TEXT DEFAULT '',
  service_name TEXT DEFAULT '',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  message TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'New',
  admin_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on enquiries
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert enquiries" ON public.enquiries;
CREATE POLICY "Public can insert enquiries"
  ON public.enquiries FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can view enquiries" ON public.enquiries;
CREATE POLICY "Admin can view enquiries"
  ON public.enquiries FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Admin can update enquiries" ON public.enquiries;
CREATE POLICY "Admin can update enquiries"
  ON public.enquiries FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can delete enquiries" ON public.enquiries;
CREATE POLICY "Admin can delete enquiries"
  ON public.enquiries FOR DELETE
  TO public
  USING (true);

-- ============================================================================
-- 4. STORAGE BUCKETS (product-images & blog-images) + RLS POLICIES
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public Read Access for product-images & blog-images
DROP POLICY IF EXISTS "Public read access for product-images" ON storage.objects;
CREATE POLICY "Public read access for product-images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id IN ('product-images', 'blog-images'));

-- Insert Access for product-images & blog-images
DROP POLICY IF EXISTS "Allow uploads to product-images and blog-images" ON storage.objects;
CREATE POLICY "Allow uploads to product-images and blog-images"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id IN ('product-images', 'blog-images'));

-- Update Access for product-images & blog-images
DROP POLICY IF EXISTS "Allow updates to product-images and blog-images" ON storage.objects;
CREATE POLICY "Allow updates to product-images and blog-images"
  ON storage.objects FOR UPDATE
  TO public
  USING (bucket_id IN ('product-images', 'blog-images'));

-- Delete Access for product-images & blog-images
DROP POLICY IF EXISTS "Allow deletes from product-images and blog-images" ON storage.objects;
CREATE POLICY "Allow deletes from product-images and blog-images"
  ON storage.objects FOR DELETE
  TO public
  USING (bucket_id IN ('product-images', 'blog-images'));
