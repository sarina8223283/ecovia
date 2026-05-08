
-- Allow guest orders
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS guest_email text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS guest_token text;

-- Drop & recreate orders RLS for guest support
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;

CREATE POLICY "Anyone can create orders"
ON public.orders FOR INSERT
WITH CHECK (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR (user_id IS NULL)
);

CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR (user_id IS NULL)
);

CREATE POLICY "Users can update their own orders"
ON public.orders FOR UPDATE
USING (auth.uid() = user_id);

-- Update order_items policies to allow guest inserts
DROP POLICY IF EXISTS "Users can create their order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can view their order items" ON public.order_items;

CREATE POLICY "Order owners can create items"
ON public.order_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND ((auth.uid() IS NOT NULL AND o.user_id = auth.uid()) OR o.user_id IS NULL)
  )
);

CREATE POLICY "Order owners can view items"
ON public.order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND ((auth.uid() IS NOT NULL AND o.user_id = auth.uid()) OR o.user_id IS NULL)
  )
);

-- Pending signups (custom OTP flow)
CREATE TABLE IF NOT EXISTS public.pending_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  full_name text NOT NULL,
  password text NOT NULL,
  otp_code text NOT NULL,
  attempts int NOT NULL DEFAULT 0,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pending_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deny_all_pending_signups"
ON public.pending_signups FOR ALL
USING (false) WITH CHECK (false);

-- Meta data deletion requests
CREATE TABLE IF NOT EXISTS public.meta_data_deletion_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  confirmation_code text NOT NULL UNIQUE,
  user_id_meta text,
  signed_request text,
  status text NOT NULL DEFAULT 'received',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.meta_data_deletion_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deny_all_meta_deletion"
ON public.meta_data_deletion_requests FOR ALL
USING (false) WITH CHECK (false);
