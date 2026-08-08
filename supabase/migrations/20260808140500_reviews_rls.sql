-- Reviews
CREATE POLICY reviews_admin_all ON public.reviews
FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@bankseizedcars.online')
WITH CHECK (auth.jwt() ->> 'email' = 'admin@bankseizedcars.online');

GRANT ALL ON public.reviews TO authenticated;
