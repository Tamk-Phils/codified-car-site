-- Admin RLS Policies for Supabase Auth
-- Run this in your Supabase SQL Editor to grant the admin user full access to the database.

-- Vehicles
DROP POLICY IF EXISTS vehicles_admin_all ON public.vehicles;
CREATE POLICY vehicles_admin_all ON public.vehicles
FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@bankseizedcars.online')
WITH CHECK (auth.jwt() ->> 'email' = 'admin@bankseizedcars.online');

-- Posts
DROP POLICY IF EXISTS posts_admin_all ON public.posts;
CREATE POLICY posts_admin_all ON public.posts
FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@bankseizedcars.online')
WITH CHECK (auth.jwt() ->> 'email' = 'admin@bankseizedcars.online');

-- Orders
DROP POLICY IF EXISTS orders_admin_all ON public.orders;
CREATE POLICY orders_admin_all ON public.orders
FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@bankseizedcars.online')
WITH CHECK (auth.jwt() ->> 'email' = 'admin@bankseizedcars.online');

-- Order Items
DROP POLICY IF EXISTS order_items_admin_all ON public.order_items;
CREATE POLICY order_items_admin_all ON public.order_items
FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@bankseizedcars.online')
WITH CHECK (auth.jwt() ->> 'email' = 'admin@bankseizedcars.online');

-- Inquiries
DROP POLICY IF EXISTS inquiries_admin_all ON public.inquiries;
CREATE POLICY inquiries_admin_all ON public.inquiries
FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@bankseizedcars.online')
WITH CHECK (auth.jwt() ->> 'email' = 'admin@bankseizedcars.online');

-- Newsletter Subscribers
DROP POLICY IF EXISTS newsletter_admin_all ON public.newsletter_subscribers;
CREATE POLICY newsletter_admin_all ON public.newsletter_subscribers
FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@bankseizedcars.online')
WITH CHECK (auth.jwt() ->> 'email' = 'admin@bankseizedcars.online');

-- Grants
GRANT ALL ON public.vehicles TO authenticated;
GRANT ALL ON public.posts TO authenticated;
GRANT ALL ON public.orders TO authenticated;
GRANT ALL ON public.order_items TO authenticated;
GRANT ALL ON public.inquiries TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO authenticated;
