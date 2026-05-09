import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ADMIN_EMAIL = 'info@ecovia.co.in';
// Resend's shared sender — works without DNS/domain verification.
// Display name still reads "Ecovia Enterprises" in the recipient's inbox.
const FROM = 'Ecovia Enterprises <onboarding@resend.dev>';

const BRAND_HEADER = `
  <div style="background:linear-gradient(135deg,#2f5d3a 0%,#4d7a5e 55%,#c9a44a 100%);color:#fff;padding:28px 24px;border-radius:14px 14px 0 0;text-align:center">
    <p style="margin:0;font-size:11px;letter-spacing:4px;text-transform:uppercase;opacity:.9">Ecovia Enterprises</p>
    <h1 style="margin:6px 0 4px;font-family:'Playfair Display',Georgia,serif;font-size:30px;letter-spacing:1px">Mittika</h1>
    <p style="margin:0;font-size:13px;opacity:.92;font-style:italic">Pure Herbal Powders • Rooted in Ayurveda</p>
  </div>`;

const THANK_YOU_BANNER = `
  <div style="background:#fff8e6;border:1px dashed #c9a44a;border-radius:12px;padding:18px;text-align:center;margin:18px 0 22px">
    <p style="margin:0;font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#7a5a14">A Heartfelt Thank You</p>
    <h2 style="margin:6px 0 0;font-family:'Playfair Display',Georgia,serif;font-size:22px;color:#2f5d3a">Thanks for Buying Mittika Products 🌿</h2>
    <p style="margin:8px 0 0;font-size:13px;color:#5b6b60">Every order supports authentic Ayurvedic traditions and small Indian farmers.</p>
  </div>`;

const SIGNATURE = `
  <hr style="border:none;border-top:1px solid #eee;margin:24px 0 16px">
  <p style="font-size:12px;color:#888;margin:0;line-height:1.6">
    Warm regards,<br>
    <strong style="color:#2f5d3a">Ecovia Enterprises OPC Pvt. Ltd.</strong><br>
    Brand: <em>Mittika</em> — Pure Herbal Powders<br>
    📧 info@ecovia.co.in &nbsp;•&nbsp; 📞 +91 87588 08684<br>
    🌐 <a href="https://ecovia.co.in" style="color:#4d7a5e;text-decoration:none">ecovia.co.in</a>
  </p>
  <p style="font-size:11px;color:#bbb;margin:14px 0 0;text-align:center">© ${new Date().getFullYear()} Ecovia Enterprises. All rights reserved.</p>`;

async function sendViaResend(to: string[], subject: string, html: string, bcc?: string[]) {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  if (!RESEND_API_KEY) return { ok: false, error: 'no_resend_key' };
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to, bcc, subject, html, reply_to: 'info@ecovia.co.in' }),
  });
  return { ok: r.ok, result: await r.json().catch(() => ({})) };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const action = body.action || 'admin_notify';

    // Customer-facing invoice email
    if (action === 'send_invoice') {
      const { to, orderNumber, invoiceNumber, customerName, customerPhone, customerAddress, items, subtotal, discount, total, couponCode } = body;
      if (!to || !orderNumber) {
        return new Response(JSON.stringify({ error: 'Missing recipient or order' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      const itemRows = (items || []).map((it: any) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee">${it.product_name}</td><td style="padding:8px;border-bottom:1px solid #eee">${it.quantity_grams >= 1000 ? `${it.quantity_grams/1000} Kg` : `${it.quantity_grams} g`}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">₹${Number(it.total_price).toFixed(2)}</td></tr>`
      ).join('');
      const html = `
        <div style="font-family:Georgia,'Times New Roman',serif;max-width:640px;margin:0 auto;background:#fbfaf6;color:#333">
          ${BRAND_HEADER}
          <div style="border:1px solid #eee;border-top:0;padding:24px;border-radius:0 0 14px 14px;background:#fff">
            <p style="margin:0 0 6px;font-size:13px;color:#888;letter-spacing:2px;text-transform:uppercase">Tax Invoice — ${invoiceNumber}</p>
            ${THANK_YOU_BANNER}
            <p style="margin:0 0 6px">Dear <strong style="color:#2f5d3a">${customerName}</strong>,</p>
            <p style="margin:0 0 14px;line-height:1.6">We are honoured to deliver authentic, lab-tested herbal powders to your doorstep. Below is your invoice for order <strong>${orderNumber}</strong>.</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
              <thead><tr style="background:#f4f7f5;color:#2f5d3a"><th style="text-align:left;padding:10px;border-bottom:2px solid #c9a44a">Item</th><th style="text-align:left;padding:10px;border-bottom:2px solid #c9a44a">Qty</th><th style="text-align:right;padding:10px;border-bottom:2px solid #c9a44a">Total</th></tr></thead>
              <tbody>${itemRows}</tbody>
            </table>
            <div style="text-align:right;font-size:14px;margin-top:10px">
              <p style="margin:4px 0">Subtotal: ₹${Number(subtotal).toFixed(2)}</p>
              ${discount > 0 ? `<p style="margin:4px 0;color:#c9a44a">Discount${couponCode ? ` (${couponCode})` : ''}: −₹${Number(discount).toFixed(2)}</p>` : ''}
              <p style="font-size:20px;font-weight:bold;color:#2f5d3a;margin:10px 0 0;padding-top:10px;border-top:1px solid #eee">Total Paid: ₹${Number(total).toFixed(2)}</p>
            </div>
            <div style="background:#f4f7f5;border-radius:10px;padding:14px;margin:18px 0;font-size:13px;color:#444">
              <strong style="color:#2f5d3a">Ship To:</strong><br>${customerAddress}<br>📞 ${customerPhone}
            </div>
            <p style="font-size:12px;color:#888;line-height:1.6;margin:16px 0 0">This is a computer-generated invoice and does not require a signature. As per our policy, herbal powders are non-returnable once dispatched.</p>
            ${SIGNATURE}
          </div>
        </div>`;

      const out = await sendViaResend([to], `Your Mittika Invoice ${invoiceNumber}`, html, [ADMIN_EMAIL]);
      return new Response(JSON.stringify({ success: out.ok, provider: 'resend', result: out.result }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { orderNumber, customerName, customerPhone, customerEmail, totalAmount, items } = body;

    // Build email content
    const itemsList = items.map((i: any) => `• ${i.name} — ${i.quantity} — ₹${i.price}`).join('\n');

    const adminHtml = `
      <div style="font-family:Georgia,'Times New Roman',serif;max-width:640px;margin:0 auto;background:#fbfaf6;color:#333">
        ${BRAND_HEADER}
        <div style="border:1px solid #eee;border-top:0;padding:24px;border-radius:0 0 14px 14px;background:#fff">
          <h2 style="color:#2f5d3a;margin:0 0 14px;font-family:'Playfair Display',Georgia,serif">🌿 New Order Received</h2>
          <div style="background:#f4f7f5;border-radius:10px;padding:16px;margin-bottom:18px">
            <p style="margin:0 0 6px"><strong>Order:</strong> ${orderNumber}</p>
            <p style="margin:0 0 6px"><strong>Customer:</strong> ${customerName}</p>
            <p style="margin:0 0 6px"><strong>Phone:</strong> ${customerPhone}</p>
            <p style="margin:0"><strong>Email:</strong> ${customerEmail}</p>
          </div>
          <div style="background:#fff8e6;border-radius:10px;padding:16px;margin-bottom:18px">
            <h3 style="color:#7a5a14;margin:0 0 10px">Order Items</h3>
            <pre style="font-family:Georgia,serif;white-space:pre-wrap;margin:0;font-size:14px">${itemsList}</pre>
          </div>
          <div style="text-align:center;background:linear-gradient(135deg,#2f5d3a,#4d7a5e);color:#fff;border-radius:12px;padding:18px">
            <h2 style="margin:0;font-family:'Playfair Display',serif">Total: ₹${Number(totalAmount).toFixed(2)}</h2>
            <p style="margin:6px 0 0;font-size:13px;opacity:.9">UPI Payment — sarina8223283@ptyes</p>
          </div>
          ${SIGNATURE}
        </div>
      </div>`;

    const customerHtml = `
      <div style="font-family:Georgia,'Times New Roman',serif;max-width:640px;margin:0 auto;background:#fbfaf6;color:#333">
        ${BRAND_HEADER}
        <div style="border:1px solid #eee;border-top:0;padding:24px;border-radius:0 0 14px 14px;background:#fff">
          ${THANK_YOU_BANNER}
          <p style="margin:0 0 8px">Dear <strong style="color:#2f5d3a">${customerName}</strong>,</p>
          <p style="margin:0 0 16px;line-height:1.7">We have received your order with <strong>Ecovia Enterprises</strong> for the <em>Mittika</em> herbal collection. Each pouch is hand-packed with care, NABL-tested for purity, and blessed before it leaves our facility. We can't wait for you to experience it.</p>
          <div style="background:#f4f7f5;border-radius:10px;padding:16px;margin:0 0 18px">
            <p style="margin:0 0 8px;font-size:13px;color:#5b6b60;letter-spacing:2px;text-transform:uppercase">Order Summary</p>
            <p style="margin:0 0 6px"><strong>Order Number:</strong> ${orderNumber}</p>
            <pre style="font-family:Georgia,serif;white-space:pre-wrap;margin:8px 0 0;font-size:14px">${itemsList}</pre>
          </div>
          <div style="text-align:center;background:linear-gradient(135deg,#2f5d3a,#4d7a5e);color:#fff;border-radius:12px;padding:18px;margin-bottom:18px">
            <p style="margin:0;font-size:12px;letter-spacing:3px;text-transform:uppercase;opacity:.85">Order Total</p>
            <h2 style="margin:6px 0 0;font-family:'Playfair Display',serif;font-size:28px">₹${Number(totalAmount).toFixed(2)}</h2>
          </div>
          <p style="margin:0 0 8px;line-height:1.6">You'll receive WhatsApp updates as your order is <strong>Accepted → Packed → Shipped → Delivered</strong>. You can track it any time at <a href="https://ecovia.co.in/order/${orderNumber}" style="color:#4d7a5e">ecovia.co.in/order/${orderNumber}</a>.</p>
          <p style="margin:14px 0 0;font-style:italic;color:#7a5a14;text-align:center">"In every grain of Mittika, lies the wisdom of generations." 🌱</p>
          ${SIGNATURE}
        </div>
      </div>`;

    // Send via Lovable AI email (using Supabase Auth admin API to send custom email)
    // Since we need transactional email, we'll use a simple webhook approach
    // For now, log the order and send WhatsApp notification
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    
    // Send WhatsApp notification to admin
    const whatsappMessage = `🌿 *NEW MITTIKA ORDER*\n\nOrder: ${orderNumber}\nCustomer: ${customerName}\nPhone: ${customerPhone}\nEmail: ${customerEmail}\n\n*Items:*\n${itemsList}\n\n*Total: ₹${Number(totalAmount).toFixed(2)}*\n\nPayment: UPI (sarina8223283@ptyes)\nStatus: Payment Pending ⏳`;

    // Email admin
    const adminSend = await sendViaResend([ADMIN_EMAIL], `🌿 New Order ${orderNumber} — ${customerName}`, adminHtml);
    // Email customer confirmation
    if (customerEmail) {
      await sendViaResend([customerEmail], `Thanks for Buying Mittika 🌿 — Order ${orderNumber}`, customerHtml);
    }

    console.log(`📧 Order notification for ${orderNumber}:`, {
      to: ADMIN_EMAIL,
      customer: customerName,
      total: totalAmount,
      adminSent: adminSend.ok,
      whatsappMessage,
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Order notification sent',
      orderNumber,
      whatsappUrl: `https://wa.me/918758808684?text=${encodeURIComponent(whatsappMessage)}`,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Order notification error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
