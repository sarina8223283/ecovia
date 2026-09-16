-- ORDERS
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;

CREATE POLICY "Users can view their own orders" ON public.orders
FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Users and guests can create orders" ON public.orders
FOR INSERT TO anon, authenticated
WITH CHECK (
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
  OR (user_id IS NULL AND guest_token IS NOT NULL)
);

CREATE POLICY "Users can update their own orders" ON public.orders
FOR UPDATE TO authenticated
USING (auth.uid() IS NOT NULL AND user_id = auth.uid())
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- ORDER ITEMS
DROP POLICY IF EXISTS "Order owners can view items" ON public.order_items;
DROP POLICY IF EXISTS "Order owners can create items" ON public.order_items;

CREATE POLICY "Order owners can view items" ON public.order_items
FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.orders o
  WHERE o.id = order_items.order_id
    AND auth.uid() IS NOT NULL
    AND o.user_id = auth.uid()
));

CREATE POLICY "Order owners can create items" ON public.order_items
FOR INSERT TO anon, authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM public.orders o
  WHERE o.id = order_items.order_id
    AND (
      (auth.uid() IS NOT NULL AND o.user_id = auth.uid())
      OR (o.user_id IS NULL AND o.guest_token IS NOT NULL AND o.created_at > now() - interval '30 minutes')
    )
));

-- Guest order lookup via token only
CREATE OR REPLACE FUNCTION public.get_guest_order(p_order_number text, p_guest_token text)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'order', to_jsonb(o) - 'guest_token',
    'items', COALESCE((SELECT jsonb_agg(to_jsonb(i)) FROM public.order_items i WHERE i.order_id = o.id), '[]'::jsonb)
  )
  FROM public.orders o
  WHERE o.order_number = p_order_number
    AND p_guest_token IS NOT NULL
    AND o.guest_token = p_guest_token
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_guest_order(text, text) FROM public;
GRANT EXECUTE ON FUNCTION public.get_guest_order(text, text) TO anon, authenticated;

-- PRODUCT FEEDBACK: public reads go through a PII-reduced view
DROP POLICY IF EXISTS "Anyone can view feedback" ON public.product_feedback;
REVOKE SELECT ON public.product_feedback FROM anon, authenticated;

CREATE OR REPLACE VIEW public.public_product_reviews AS
SELECT
  f.id,
  f.product_id,
  f.reviewer_name,
  NULLIF(btrim(split_part(f.reviewer_location, ',', 1)), '') AS reviewer_location,
  f.rating,
  f.product_quality,
  f.delivery_rating,
  f.packaging_rating,
  f.review,
  f.created_at
FROM public.product_feedback f;

GRANT SELECT ON public.public_product_reviews TO anon, authenticated;

-- SITE CONTENT: stop broadcasting every change over realtime
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime DROP TABLE public.site_content;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- STORAGE: site-images is read-only for the public
DROP POLICY IF EXISTS "Allow public deletes from site-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates to site-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads to site-images" ON storage.objects;

CREATE POLICY "Chat attachments upload to site-images" ON storage.objects
FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'site-images' AND name LIKE 'chat-uploads/%');

CREATE POLICY "Authenticated users manage site-images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'site-images')
WITH CHECK (bucket_id = 'site-images');
