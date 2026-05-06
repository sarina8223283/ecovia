
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_email text,
  ADD COLUMN IF NOT EXISTS accepted_at timestamptz,
  ADD COLUMN IF NOT EXISTS packed_at timestamptz,
  ADD COLUMN IF NOT EXISTS shipped_at timestamptz,
  ADD COLUMN IF NOT EXISTS delivered_at timestamptz,
  ADD COLUMN IF NOT EXISTS tracking_number text,
  ADD COLUMN IF NOT EXISTS courier text,
  ADD COLUMN IF NOT EXISTS invoice_number text,
  ADD COLUMN IF NOT EXISTS coupon_code text,
  ADD COLUMN IF NOT EXISTS discount_amount numeric DEFAULT 0;

-- Allow admin updates via service role (no auth.uid). Add a permissive policy gated by service_role implicitly bypassing RLS; we still add public read of own already exists. Add admin update policy using a setting check is complex; rely on service role for admin updates.

CREATE TABLE IF NOT EXISTS public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('percent','flat')),
  discount_value numeric NOT NULL,
  product_id text,
  min_order numeric NOT NULL DEFAULT 0,
  expires_at timestamptz,
  active boolean NOT NULL DEFAULT true,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active coupons" ON public.coupons FOR SELECT USING (active = true);

CREATE TABLE IF NOT EXISTS public.coupon_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id uuid REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id uuid,
  phone text,
  full_name text,
  sent_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.coupon_sends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own coupon sends" ON public.coupon_sends FOR SELECT USING (auth.uid() = user_id);
