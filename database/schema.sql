-- Supabase Schema for Gentle Electronics

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text UNIQUE NOT NULL,
  role text DEFAULT 'admin'::text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 3. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price numeric NOT NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url text,
  is_available boolean DEFAULT true NOT NULL,
  is_featured boolean DEFAULT false NOT NULL,
  sku text,
  stock_quantity integer,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 4. Product Images Table
CREATE TABLE IF NOT EXISTS public.product_images (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  alt_text text,
  display_order integer DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Sales Table
CREATE TABLE IF NOT EXISTS public.sales (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  reference text UNIQUE NOT NULL,
  sale_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  total_amount numeric NOT NULL,
  customer_name text,
  customer_phone text,
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Sale Items Table
CREATE TABLE IF NOT EXISTS public.sale_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id uuid REFERENCES public.sales(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL,
  unit_price numeric NOT NULL,
  subtotal numeric NOT NULL
);

-- 7. Checkout Events Table
CREATE TABLE IF NOT EXISTS public.checkout_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type text NOT NULL,
  order_reference text NOT NULL,
  total_amount numeric NOT NULL,
  product_count integer NOT NULL,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) Setup

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkout_events ENABLE ROW LEVEL SECURITY;

-- Profiles: Only the user can read their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

-- Categories: Public read, Authenticated write
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Categories are insertable by authenticated users" ON public.categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Categories are updatable by authenticated users" ON public.categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Categories are deletable by authenticated users" ON public.categories FOR DELETE USING (auth.role() = 'authenticated');

-- Products
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Products are insertable by authenticated users" ON public.products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Products are updatable by authenticated users" ON public.products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Products are deletable by authenticated users" ON public.products FOR DELETE USING (auth.role() = 'authenticated');

-- Product Images
CREATE POLICY "Product images are viewable by everyone" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Product images are insertable by authenticated users" ON public.product_images FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Product images are updatable by authenticated users" ON public.product_images FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Product images are deletable by authenticated users" ON public.product_images FOR DELETE USING (auth.role() = 'authenticated');

-- Sales, Sale Items, Checkout Events
CREATE POLICY "Sales are viewable by authenticated users only" ON public.sales FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Sales are insertable by authenticated users only" ON public.sales FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Sales are updatable by authenticated users only" ON public.sales FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Sales are deletable by authenticated users only" ON public.sales FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Sale items are viewable by authenticated users only" ON public.sale_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Sale items are insertable by authenticated users only" ON public.sale_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Sale items are updatable by authenticated users only" ON public.sale_items FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Sale items are deletable by authenticated users only" ON public.sale_items FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Checkout events are insertable by everyone" ON public.checkout_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Checkout events are viewable by authenticated users only" ON public.checkout_events FOR SELECT USING (auth.role() = 'authenticated');
