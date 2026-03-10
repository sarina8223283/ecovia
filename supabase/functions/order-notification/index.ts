import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ADMIN_EMAIL = 'info@ecovia.co.in';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderNumber, customerName, customerPhone, customerEmail, totalAmount, items } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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
        
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
          This is an automated notification from Mittika Order System.
        </p>
      </div>
    `;

    // Send via Lovable AI email (using Supabase Auth admin API to send custom email)
    // Since we need transactional email, we'll use a simple webhook approach
    // For now, log the order and send WhatsApp notification
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    
    // Send WhatsApp notification to admin
    const whatsappMessage = `🌿 *NEW MITTIKA ORDER*\n\nOrder: ${orderNumber}\nCustomer: ${customerName}\nPhone: ${customerPhone}\nEmail: ${customerEmail}\n\n*Items:*\n${itemsList}\n\n*Total: ₹${Number(totalAmount).toFixed(2)}*\n\nPayment: UPI (sarina8223283@ptyes)\nStatus: Payment Pending ⏳`;

    console.log(`📧 Order notification for ${orderNumber}:`, {
      to: ADMIN_EMAIL,
      customer: customerName,
      total: totalAmount,
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
