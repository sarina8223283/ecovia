import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ADMIN_EMAIL = 'info@ecovia.co.in';
const FROM = 'Ecovia Enterprises <noreply@ecovia.co.in>';
const SIGNATURE = `
  <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
  <p style="font-size:12px;color:#999;margin:0">Warm regards,<br><strong>Ecovia Enterprises</strong><br>Brand: Mittika — Pure Herbal Powders<br>info@ecovia.co.in • +91 87588 08684 • <a href="https://ecovia.co.in">ecovia.co.in</a></p>`;

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
        <div style="font-family:Georgia,serif;max-width:640px;margin:0 auto;padding:24px;background:#fff;color:#333">
          <div style="background:#4d7a5e;color:#fff;padding:20px;border-radius:12px 12px 0 0">
            <h1 style="margin:0;font-size:22px">Mittika by Ecovia Enterprises</h1>
            <p style="margin:4px 0 0;opacity:.9;font-size:13px">Tax Invoice — ${invoiceNumber}</p>
          </div>
          <div style="border:1px solid #eee;border-top:0;padding:20px;border-radius:0 0 12px 12px">
            <p>Dear <strong>${customerName}</strong>,</p>
            <p>Thank you for your order <strong>${orderNumber}</strong>. Here is your invoice:</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0">
              <thead><tr style="background:#f4f7f5"><th style="text-align:left;padding:8px">Item</th><th style="text-align:left;padding:8px">Qty</th><th style="text-align:right;padding:8px">Total</th></tr></thead>
              <tbody>${itemRows}</tbody>
            </table>
            <div style="text-align:right;font-size:14px">
              <p>Subtotal: ₹${Number(subtotal).toFixed(2)}</p>
              ${discount > 0 ? `<p>Discount${couponCode ? ` (${couponCode})` : ''}: -₹${Number(discount).toFixed(2)}</p>` : ''}
              <p style="font-size:18px;font-weight:bold;color:#4d7a5e">Total: ₹${Number(total).toFixed(2)}</p>
            </div>
            <p style="font-size:13px;color:#666"><strong>Ship To:</strong><br>${customerAddress}<br>${customerPhone}</p>
            ${SIGNATURE}
          </div>
        </div>`;

      const out = await sendViaResend([to], `Your Mittika Invoice ${invoiceNumber}`, html, [ADMIN_EMAIL]);
      return new Response(JSON.stringify({ success: out.ok, provider: 'resend', result: out.result }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { orderNumber, customerName, customerPhone, customerEmail, totalAmount, items } = body;

    // Build email content
    const itemsList = items.map((i: any) => `• ${i.name} — ${i.quantity} — ₹${i.price}`).join('\n');

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4d7a5e; margin: 0;">🌿 New Order Received!</h1>
          <p style="color: #666; font-size: 14px;">Mittika by Ecovia Enterprises</p>
        </div>
        
        <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">Order: ${orderNumber}</h2>
          <p><strong>Customer:</strong> ${customerName}</p>
          <p><strong>Phone:</strong> ${customerPhone}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
        </div>
        
        <div style="background: #f0f7f2; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #4d7a5e; margin-top: 0;">Order Items:</h3>
          <pre style="font-family: Arial, sans-serif; white-space: pre-wrap; margin: 0;">${itemsList}</pre>
        </div>
        
        <div style="text-align: center; background: #4d7a5e; color: white; border-radius: 12px; padding: 15px;">
          <h2 style="margin: 0;">Total: ₹${Number(totalAmount).toFixed(2)}</h2>
          <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">UPI Payment Pending — sarina8223283@ptyes</p>
        </div>
        
        ${SIGNATURE}
      </div>
    `;

    // Send via Lovable AI email (using Supabase Auth admin API to send custom email)
    // Since we need transactional email, we'll use a simple webhook approach
    // For now, log the order and send WhatsApp notification
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    
    // Send WhatsApp notification to admin
    const whatsappMessage = `🌿 *NEW MITTIKA ORDER*\n\nOrder: ${orderNumber}\nCustomer: ${customerName}\nPhone: ${customerPhone}\nEmail: ${customerEmail}\n\n*Items:*\n${itemsList}\n\n*Total: ₹${Number(totalAmount).toFixed(2)}*\n\nPayment: UPI (sarina8223283@ptyes)\nStatus: Payment Pending ⏳`;

    // Email admin
    const adminSend = await sendViaResend([ADMIN_EMAIL], `🌿 New Order ${orderNumber} — ${customerName}`, emailHtml);
    // Email customer confirmation
    if (customerEmail) {
      await sendViaResend([customerEmail], `Order Confirmation ${orderNumber} — Mittika by Ecovia`, emailHtml);
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
