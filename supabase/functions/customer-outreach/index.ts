import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FROM = 'Ecovia Enterprises <onboarding@resend.dev>';

const BRAND_HEADER = `
  <div style="background:linear-gradient(135deg,#2f5d3a 0%,#4d7a5e 55%,#c9a44a 100%);color:#fff;padding:28px 24px;border-radius:14px 14px 0 0;text-align:center">
    <p style="margin:0;font-size:11px;letter-spacing:4px;text-transform:uppercase;opacity:.9">Ecovia Enterprises</p>
    <h1 style="margin:6px 0 4px;font-family:'Playfair Display',Georgia,serif;font-size:30px;letter-spacing:1px">Mittika</h1>
    <p style="margin:0;font-size:13px;opacity:.92;font-style:italic">Pure Herbal Powders • Rooted in Ayurveda</p>
  </div>`;

const SIGNATURE = `
  <hr style="border:none;border-top:1px solid #eee;margin:24px 0 16px">
  <p style="font-size:12px;color:#888;margin:0;line-height:1.6">
    Warm regards,<br>
    <strong style="color:#2f5d3a">Ecovia Enterprises OPC Pvt. Ltd.</strong><br>
    Brand: <em>Mittika</em> — Pure Herbal Powders<br>
    📧 info@ecovia.co.in &nbsp;•&nbsp; 📞 +91 87588 08684<br>
    🌐 <a href="https://ecovia.co.in" style="color:#4d7a5e;text-decoration:none">ecovia.co.in</a>
  </p>`;

function buildOfferHtml(opts: {
  customerName: string;
  headline: string;
  body: string;
  couponCode?: string;
  discountLabel?: string;
  expiresLabel?: string;
}) {
  const couponBlock = opts.couponCode ? `
    <div style="margin:24px 0;padding:22px;background:linear-gradient(135deg,#fff8e6,#fdf3d4);border:2px dashed #c9a44a;border-radius:14px;text-align:center">
      <p style="margin:0;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#7a5a14">Your Exclusive Coupon</p>
      <p style="margin:10px 0 6px;font-family:'Courier New',monospace;font-size:28px;font-weight:800;color:#2f5d3a;letter-spacing:4px">${opts.couponCode}</p>
      ${opts.discountLabel ? `<p style="margin:0;font-size:15px;color:#2f5d3a;font-weight:600">${opts.discountLabel}</p>` : ''}
      ${opts.expiresLabel ? `<p style="margin:6px 0 0;font-size:11px;color:#7a5a14">Valid till ${opts.expiresLabel}</p>` : ''}
      <a href="https://ecovia.co.in/products" style="display:inline-block;margin-top:14px;background:#2f5d3a;color:#fff;padding:11px 26px;border-radius:999px;text-decoration:none;font-weight:600;font-size:14px">Shop Now & Apply Code</a>
    </div>` : `
    <div style="text-align:center;margin:20px 0">
      <a href="https://ecovia.co.in/products" style="display:inline-block;background:#2f5d3a;color:#fff;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:600;font-size:14px">Shop Mittika Products</a>
    </div>`;

  return `<!doctype html><html><body style="margin:0;background:#f5f3ee;font-family:'Helvetica Neue',Arial,sans-serif;color:#2a2a2a">
    <div style="max-width:620px;margin:24px auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,.06)">
      ${BRAND_HEADER}
      <div style="padding:28px 28px 8px">
        <h2 style="margin:0 0 6px;font-family:'Playfair Display',Georgia,serif;color:#2f5d3a;font-size:24px">${opts.headline}</h2>
        <p style="margin:0 0 14px;font-size:14px;color:#5b6b60">Hi ${opts.customerName || 'there'},</p>
        <div style="font-size:15px;line-height:1.65;color:#3a4a40;white-space:pre-line">${opts.body}</div>
        ${couponBlock}
        ${SIGNATURE}
      </div>
    </div>
  </body></html>`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const body = await req.json();
    const {
      recipients,            // [{ email, name, phone }]
      headline,
      message,
      coupon,                // optional: { code, discount_type, discount_value, min_order, expires_at, description }
    } = body;

    if (!Array.isArray(recipients) || recipients.length === 0) {
      return new Response(JSON.stringify({ error: 'No recipients' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (!headline || !message) {
      return new Response(JSON.stringify({ error: 'Headline and message required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Create coupon via service role (bypasses RLS, ensures only server can mint real codes)
    let couponRecord: any = null;
    if (coupon && coupon.code && coupon.discount_value) {
      const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
      const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const admin = createClient(SUPABASE_URL, SERVICE_KEY);
      const code = String(coupon.code).trim().toUpperCase();
      // upsert by code (don't duplicate if admin re-sends)
      const { data: existing } = await admin.from('coupons').select('*').eq('code', code).maybeSingle();
      if (existing) {
        couponRecord = existing;
      } else {
        const { data: ins, error: insErr } = await admin.from('coupons').insert({
          code,
          discount_type: coupon.discount_type || 'percent',
          discount_value: Number(coupon.discount_value),
          min_order: Number(coupon.min_order || 0),
          expires_at: coupon.expires_at || null,
          description: coupon.description || `Exclusive offer for select Mittika customers`,
          active: true,
        }).select().single();
        if (insErr) {
          return new Response(JSON.stringify({ error: 'Coupon creation failed: ' + insErr.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        couponRecord = ins;
      }
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'Email service unavailable' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const discountLabel = couponRecord
      ? (couponRecord.discount_type === 'percent'
          ? `${couponRecord.discount_value}% OFF your next order`
          : `Flat ₹${couponRecord.discount_value} OFF`)
      : undefined;
    const expiresLabel = couponRecord?.expires_at
      ? new Date(couponRecord.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      : undefined;

    const results: any[] = [];
    for (const r of recipients) {
      if (!r?.email) { results.push({ email: r?.email, ok: false, error: 'no_email' }); continue; }
      const html = buildOfferHtml({
        customerName: r.name || 'Valued Customer',
        headline,
        body: message,
        couponCode: couponRecord?.code,
        discountLabel,
        expiresLabel,
      });
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: FROM, to: [r.email], subject: headline, html, reply_to: 'info@ecovia.co.in' }),
      });
      const j = await resp.json().catch(() => ({}));
      results.push({ email: r.email, ok: resp.ok, id: j?.id, error: resp.ok ? undefined : j });
    }

    return new Response(JSON.stringify({ ok: true, coupon: couponRecord, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'failed' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});