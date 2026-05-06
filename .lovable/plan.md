# Implementation Plan

This is a large request spanning auth, orders, invoices, messaging, and coupons. Breaking it into clear deliverables.

## 1. Email OTP Signup Flow
- Switch signup from email-link confirmation to **6-digit OTP**
- New `Auth.tsx` flow: Email + Password + Name → "Send OTP" → OTP screen → verify → redirect to `/checkout` (personal details)
- Use Supabase `signInWithOtp` + `verifyOtp` (type `email`)
- Login flow stays password-based

## 2. Order Status Timeline
Add columns to `orders`:
- `status` enum extended: `placed | accepted | packed | shipped | delivered | cancelled`
- `accepted_at`, `packed_at`, `shipped_at`, `delivered_at` timestamps
- `tracking_number`, `courier` (optional)
- `invoice_url`, `invoice_number`

Show **horizontal stepper** (Placed → Accepted → Packed → Shipped → Delivered) on `Account.tsx` order detail row with check-marks + timestamps.

## 3. Sarina Admin — Order Management
In `/sarina-admin` add an **Orders tab**:
- List all orders with customer info
- Update status dropdown (advances timeline + sets timestamp)
- Add tracking number / courier
- Trigger WhatsApp notification on status change
- Create/manage coupons

## 4. Invoices
- After status = `delivered`, generate PDF invoice (jsPDF) with order + customer + items + GST/total
- Store filename `MTK-INV-{orderNumber}.pdf` in metadata; allow client-side regeneration on download
- "Download Invoice" button appears in account order history once delivered

## 5. WhatsApp Notifications (4 per order)
Edge function `whatsapp-notify` builds a `wa.me` deep link with message templated for each event:
- **Placed** — when order created
- **Accepted** — when admin marks accepted
- **Shipped/Dispatched** — when admin marks shipped (with tracking)
- **Delivered** — when admin marks delivered + invoice ready

Since true WhatsApp Business API requires Twilio/Meta credentials, default to opening `wa.me` link from admin (admin clicks "Send WA" button → opens chat pre-filled to customer's phone). Customer phone pulled from order. Auto-send via Twilio is optional future upgrade.

## 6. Coupons
New table `coupons`:
- `code` (unique), `discount_type` (percent/flat), `discount_value`, `applies_to_product_id` (nullable = all), `min_order`, `expires_at`, `active`
- `coupon_sends` table: log of which customers were notified
- Sarina admin UI: create coupon → select target customers (from order history) → "Send WhatsApp" generates wa.me link batch
- Checkout: apply coupon code, validate, deduct from total

## 7. Address Management
- `Account.tsx` Profile tab: edit residential + permanent address inline (already partially exists)
- Quick "Use this address" picker from past orders (read distinct addresses from orders)

## Technical Sections

### DB Migration
```sql
-- Orders timeline
ALTER TABLE orders 
  ADD COLUMN customer_email text,
  ADD COLUMN accepted_at timestamptz,
  ADD COLUMN packed_at timestamptz,
  ADD COLUMN shipped_at timestamptz,
  ADD COLUMN delivered_at timestamptz,
  ADD COLUMN tracking_number text,
  ADD COLUMN courier text,
  ADD COLUMN invoice_number text,
  ADD COLUMN coupon_code text,
  ADD COLUMN discount_amount numeric DEFAULT 0;

-- Coupons
CREATE TABLE coupons (
  id uuid PK,
  code text UNIQUE,
  discount_type text CHECK in ('percent','flat'),
  discount_value numeric,
  product_id text,  -- null = all
  min_order numeric DEFAULT 0,
  expires_at timestamptz,
  active boolean DEFAULT true,
  created_at timestamptz
);
ALTER TABLE coupons ENABLE RLS;
-- public read active coupons; admin (via edge function service role) writes

CREATE TABLE coupon_sends (
  id uuid PK, coupon_id uuid, user_id uuid, phone text, sent_at timestamptz
);
```

### Files to Create/Edit
- **Edit**: `src/pages/Auth.tsx` (OTP flow), `src/contexts/AuthContext.tsx` (verifyOtp), `src/pages/Account.tsx` (timeline + invoice download), `src/pages/SarinaAdmin.tsx` (orders + coupons tabs), `src/pages/Checkout.tsx` (coupon input), `src/pages/Payment.tsx` (post-payment status=placed + WA trigger)
- **Create**: `src/components/orders/OrderTimeline.tsx`, `src/lib/invoice.ts` (jsPDF gen), `src/lib/whatsapp.ts` (message templates + wa.me builder), `src/components/admin/OrdersAdmin.tsx`, `src/components/admin/CouponsAdmin.tsx`
- **Deps**: `jspdf`, `jspdf-autotable`

### WhatsApp Message Templates
```
Placed: "🌿 Mittika: Hi {name}, order {id} placed for ₹{total}. We'll confirm soon."
Accepted: "✅ Order {id} accepted. Packing starts shortly."
Shipped: "📦 Order {id} dispatched via {courier}. Track: {tracking}"
Delivered: "🎉 Order {id} delivered! Invoice: {url}. Thank you!"
```

## Out of Scope (future)
- True automated WhatsApp via Twilio API (manual wa.me click for now; can add Twilio connector later if user wants)
- Email notifications (already partially handled via existing order-notification function)

## Confirm
Reply **proceed** to implement, or tell me which parts to drop/reorder. Given size, I will ship in this order:
1. DB migration + OTP signup
2. Order timeline + admin status updates
3. Invoices + WhatsApp templates  
4. Coupons