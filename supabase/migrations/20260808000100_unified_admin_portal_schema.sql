-- Unified schema for storefront + admin portal
-- Safe to run multiple times (idempotent) before data migration.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  price numeric(12,2) NOT NULL DEFAULT 0,
  sale_price numeric(12,2),
  description text NOT NULL DEFAULT '',
  mileage text,
  transmission text,
  exterior_color text,
  interior_color text,
  fuel_type text,
  trim text,
  title_status text,
  body_type text,
  make text,
  year int,
  images text[] NOT NULL DEFAULT '{}',
  is_hot_deal boolean NOT NULL DEFAULT true,
  is_sold boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  cover_image text,
  category text NOT NULL DEFAULT 'Guides',
  keywords text[] NOT NULL DEFAULT '{}',
  meta_title text,
  meta_description text,
  author text NOT NULL DEFAULT 'Bank Seized Cars',
  read_minutes int NOT NULL DEFAULT 5,
  is_published boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL DEFAULT '',
  rating int NOT NULL DEFAULT 5,
  body text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE DEFAULT (
    'BSC-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))
  ),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  state text NOT NULL DEFAULT '',
  postcode text NOT NULL DEFAULT '',
  country text NOT NULL DEFAULT 'United States',
  payment_method text NOT NULL DEFAULT 'bank_transfer',
  notes text NOT NULL DEFAULT '',
  total numeric(12,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE SET NULL,
  vehicle_name text NOT NULL,
  vehicle_slug text NOT NULL DEFAULT '',
  image text,
  unit_price numeric(12,2) NOT NULL DEFAULT 0,
  quantity int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_vehicles_sort_order ON public.vehicles(sort_order);
CREATE INDEX IF NOT EXISTS idx_vehicles_slug ON public.vehicles(slug);
CREATE INDEX IF NOT EXISTS idx_vehicles_is_sold ON public.vehicles(is_sold);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON public.posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_sort_order ON public.reviews(sort_order);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_created_at ON public.newsletter_subscribers(created_at DESC);

-- ---------------------------------------------------------------------------
-- RLS + grants
-- ---------------------------------------------------------------------------

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.vehicles TO anon, authenticated;
GRANT SELECT ON public.posts TO anon, authenticated;
GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT INSERT ON public.orders TO anon, authenticated;
GRANT INSERT ON public.order_items TO anon, authenticated;
GRANT INSERT ON public.inquiries TO anon, authenticated;
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;

GRANT ALL ON public.vehicles TO service_role;
GRANT ALL ON public.posts TO service_role;
GRANT ALL ON public.reviews TO service_role;
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.order_items TO service_role;
GRANT ALL ON public.inquiries TO service_role;
GRANT ALL ON public.newsletter_subscribers TO service_role;
GRANT ALL ON public.admin_users TO service_role;

DROP POLICY IF EXISTS vehicles_public_read ON public.vehicles;
DROP POLICY IF EXISTS posts_public_read ON public.posts;
DROP POLICY IF EXISTS reviews_public_read ON public.reviews;
DROP POLICY IF EXISTS orders_public_insert ON public.orders;
DROP POLICY IF EXISTS order_items_public_insert ON public.order_items;
DROP POLICY IF EXISTS inquiries_public_insert ON public.inquiries;
DROP POLICY IF EXISTS newsletter_public_insert ON public.newsletter_subscribers;

CREATE POLICY vehicles_public_read
ON public.vehicles
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY posts_public_read
ON public.posts
FOR SELECT
TO anon, authenticated
USING (is_published = true);

CREATE POLICY reviews_public_read
ON public.reviews
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY orders_public_insert
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY order_items_public_insert
ON public.order_items
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY inquiries_public_insert
ON public.inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY newsletter_public_insert
ON public.newsletter_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS vehicles_touch ON public.vehicles;
CREATE TRIGGER vehicles_touch
BEFORE UPDATE ON public.vehicles
FOR EACH ROW
EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS posts_touch ON public.posts;
CREATE TRIGGER posts_touch
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Admin authentication helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.verify_admin_login(_username text, _password text)
RETURNS TABLE(id uuid, username text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT a.id, a.username
  FROM public.admin_users a
  WHERE a.username = _username
    AND a.password_hash = crypt(_password, a.password_hash);
$$;

CREATE OR REPLACE FUNCTION public.set_admin_password(_admin_id uuid, _password text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  UPDATE public.admin_users
  SET password_hash = crypt(_password, gen_salt('bf', 10))
  WHERE id = _admin_id;
END;
$$;

REVOKE ALL ON FUNCTION public.verify_admin_login(text, text) FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_admin_password(uuid, text) FROM public, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.verify_admin_login(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.set_admin_password(uuid, text) TO service_role;

INSERT INTO public.admin_users (username, password_hash)
VALUES ('admin', crypt('admin123', gen_salt('bf', 10)))
ON CONFLICT (username)
DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- ---------------------------------------------------------------------------
-- Optional seed reviews (insert only if table is empty)
-- ---------------------------------------------------------------------------

INSERT INTO public.reviews (name, location, rating, body, sort_order)
SELECT *
FROM (
  VALUES
    ('Jean M.','Texas',5,'I was honestly surprised by how smooth the whole process was. Got my car in Texas without any issues. Highly recommend!',1),
    ('Patrick K.','Ontario',5,'Great prices compared to local dealerships here in Toronto. Everything was clearly explained before I paid.',2),
    ('James D.','California',5,'I saved over $3,500 on my vehicle. The car was exactly as described. No hidden surprises.',3),
    ('Mike A.','New York',5,'Customer support was very responsive. They answered all my questions before I made the deposit.',4),
    ('Brian S.','Florida',5,'At first I was skeptical, but everything went well. Delivery was on time and the car runs perfectly.',5),
    ('Patrick T.','British Columbia',5,'Very professional service. I liked the transparency and the clear pricing.',6),
    ('Kevin L.','Illinois',5,'Got a really good deal compared to dealerships in my area. I''ll definitely use them again.',7),
    ('Ryan O.','Quebec',5,'Very reliable exporter. Clear communication and timely shipping. I appreciate the honesty.',8),
    ('Ashley C.','Alberta',5,'Simple process, no stress. Reserved my car and received it in less time than expected.',9),
    ('Chris N.','Nevada',5,'The vehicle matched the photos and description exactly. That''s rare these days.',10),
    ('Chris A.','Washington',5,'Fast communication and honest answers. That''s what made me trust them.',11),
    ('Jonathan K.','Georgia',5,'I''ve bought cars before, but this was by far the easiest experience.',12),
    ('Michael A.','Texas',5,'Great platform if you''re looking for affordable cars. Prices are really competitive.',13),
    ('Carlos M.','Ohio',5,'Everything was handled professionally from start to finish. Very satisfied.',14),
    ('Steven B.','Arizona',5,'No hidden fees, no pressure. Just a clean and simple buying experience.',15)
) AS seed(name, location, rating, body, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.reviews LIMIT 1);

COMMIT;
