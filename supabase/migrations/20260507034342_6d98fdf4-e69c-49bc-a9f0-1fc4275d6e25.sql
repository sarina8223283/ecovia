
-- Lock admin_settings: deny all by default
CREATE POLICY "deny_all_admin_settings_select" ON public.admin_settings FOR SELECT USING (false);
CREATE POLICY "deny_all_admin_settings_modify" ON public.admin_settings FOR ALL USING (false) WITH CHECK (false);

-- Tighten permissive insert policies with rate-limit-ish checks (ensure at least required columns are non-null)
DROP POLICY IF EXISTS "Anyone can submit feedback" ON public.product_feedback;
CREATE POLICY "Anyone can submit feedback" ON public.product_feedback
FOR INSERT WITH CHECK (
  length(reviewer_name) BETWEEN 1 AND 100
  AND length(review) BETWEEN 1 AND 2000
  AND rating BETWEEN 1 AND 5
  AND length(product_id) BETWEEN 1 AND 100
);

DROP POLICY IF EXISTS "Anyone can insert page views" ON public.page_views;
CREATE POLICY "Anyone can insert page views" ON public.page_views
FOR INSERT WITH CHECK (
  length(page_path) BETWEEN 1 AND 500
);

-- Restrict SECURITY DEFINER function execution
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.generate_order_number() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
