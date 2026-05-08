import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM = 'Ecovia Enterprises <noreply@ecovia.co.in>';

function genOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) throw new Error('Email service not configured');
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], subject, html, reply_to: 'info@ecovia.co.in' }),
  });
  if (!r.ok) {
    const err = await r.text();
    throw new Error(`Resend error: ${err}`);
  }
  return r.json();
}

function otpEmailHtml(name: string, otp: string) {
  return `
  <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:24px;background:#fff;color:#333">
    <div style="background:#4d7a5e;color:#fff;padding:20px;border-radius:12px 12px 0 0;text-align:center">
      <h1 style="margin:0;font-size:22px">Ecovia Enterprises</h1>
      <p style="margin:4px 0 0;opacity:.9;font-size:13px">Brand: Mittika — Pure Herbal Powders</p>
    </div>
    <div style="border:1px solid #eee;border-top:0;padding:24px;border-radius:0 0 12px 12px">
      <p>Dear <strong>${name || 'Customer'}</strong>,</p>
      <p>Use the One-Time Password (OTP) below to verify your email and finish creating your Mittika account:</p>
      <div style="text-align:center;margin:24px 0">
        <span style="display:inline-block;font-family:monospace;font-size:34px;letter-spacing:10px;font-weight:bold;color:#4d7a5e;background:#f4f7f5;padding:14px 26px;border-radius:10px;border:2px dashed #c9a44a">${otp}</span>
      </div>
      <p style="font-size:13px;color:#666">This code expires in 10 minutes. If you did not request this, you can safely ignore the email.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
      <p style="font-size:12px;color:#999;margin:0">Warm regards,<br><strong>Ecovia Enterprises</strong><br>info@ecovia.co.in • +91 87588 08684<br>ecovia.co.in</p>
    </div>
  </div>`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  try {
    const { action, email, password, fullName, otp } = await req.json();

    if (action === 'send') {
      if (!email || !password || !fullName) {
        return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      // Check if user already exists
      const { data: existing } = await supabase.auth.admin.listUsers();
      if (existing?.users?.some((u: any) => u.email?.toLowerCase() === email.toLowerCase())) {
        return new Response(JSON.stringify({ error: 'An account with this email already exists. Please sign in.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      const code = genOtp();
      const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      await supabase.from('pending_signups').upsert({
        email: email.toLowerCase(),
        full_name: fullName,
        password,
        otp_code: code,
        expires_at: expires,
        attempts: 0,
      }, { onConflict: 'email' });

      await sendEmail(email, 'Your Ecovia / Mittika OTP Code', otpEmailHtml(fullName, code));
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'verify') {
      if (!email || !otp) {
        return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      const { data: pending } = await supabase.from('pending_signups').select('*').eq('email', email.toLowerCase()).maybeSingle();
      if (!pending) return new Response(JSON.stringify({ error: 'No signup pending. Please request a new OTP.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      if (new Date(pending.expires_at) < new Date()) {
        return new Response(JSON.stringify({ error: 'OTP expired. Please request a new one.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      if (pending.attempts >= 5) {
        return new Response(JSON.stringify({ error: 'Too many attempts. Please request a new OTP.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      if (pending.otp_code !== otp) {
        await supabase.from('pending_signups').update({ attempts: pending.attempts + 1 }).eq('email', email.toLowerCase());
        return new Response(JSON.stringify({ error: 'Invalid OTP' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Create the user (email already verified)
      const { data: created, error: createErr } = await supabase.auth.admin.createUser({
        email: pending.email,
        password: pending.password,
        email_confirm: true,
        user_metadata: { full_name: pending.full_name },
      });
      if (createErr) {
        return new Response(JSON.stringify({ error: createErr.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      await supabase.from('pending_signups').delete().eq('email', email.toLowerCase());

      return new Response(JSON.stringify({ success: true, userId: created.user?.id }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e: any) {
    console.error('signup-otp error', e);
    return new Response(JSON.stringify({ error: e.message || 'Server error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});