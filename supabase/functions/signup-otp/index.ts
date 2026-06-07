import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM = 'Ecovia Enterprises <onboarding@resend.dev>';

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
  <div style="font-family:Georgia,'Times New Roman',serif;max-width:560px;margin:0 auto;background:#fbfaf6;color:#333">
    <div style="background:linear-gradient(135deg,#2f5d3a 0%,#4d7a5e 55%,#c9a44a 100%);color:#fff;padding:28px 24px;border-radius:14px 14px 0 0;text-align:center">
      <p style="margin:0;font-size:11px;letter-spacing:4px;text-transform:uppercase;opacity:.9">Ecovia Enterprises</p>
      <h1 style="margin:6px 0 4px;font-family:'Playfair Display',Georgia,serif;font-size:30px">Mittika</h1>
      <p style="margin:0;font-size:13px;opacity:.92;font-style:italic">Pure Herbal Powders • Rooted in Ayurveda</p>
    </div>
    <div style="border:1px solid #eee;border-top:0;padding:26px;border-radius:0 0 14px 14px;background:#fff">
      <div style="background:#fff8e6;border:1px dashed #c9a44a;border-radius:12px;padding:14px;text-align:center;margin-bottom:22px">
        <h2 style="margin:0;font-family:'Playfair Display',Georgia,serif;font-size:20px;color:#2f5d3a">Welcome to the Mittika family 🌿</h2>
        <p style="margin:6px 0 0;font-size:13px;color:#7a5a14">Thanks for choosing authentic, lab-tested herbal powders.</p>
      </div>
      <p>Dear <strong style="color:#2f5d3a">${name || 'Customer'}</strong>,</p>
      <p style="line-height:1.6">Use the secure One-Time Password (OTP) below to verify your email and complete your Mittika account setup:</p>
      <div style="text-align:center;margin:24px 0">
        <span style="display:inline-block;font-family:monospace;font-size:36px;letter-spacing:12px;font-weight:bold;color:#2f5d3a;background:#f4f7f5;padding:16px 28px;border-radius:12px;border:2px dashed #c9a44a">${otp}</span>
      </div>
      <p style="font-size:13px;color:#666;text-align:center">⏱ Expires in 10 minutes. If you didn't request this, please ignore.</p>
      <div style="margin:26px 0 10px;padding:22px 20px;background:linear-gradient(135deg,#f4f7f5 0%,#fff8e6 100%);border-left:4px solid #c9a44a;border-radius:10px">
        <p style="margin:0;font-family:'Playfair Display',Georgia,serif;font-size:17px;color:#2f5d3a;font-style:italic;line-height:1.6;text-align:center">
          &ldquo;सर्वे भवन्तु सुखिनः, सर्वे सन्तु निरामयाः&rdquo;
        </p>
        <p style="margin:8px 0 0;font-size:12px;color:#7a5a14;text-align:center;letter-spacing:1px;text-transform:uppercase">
          May all be happy • May all be free from illness
        </p>
        <p style="margin:10px 0 0;font-size:12px;color:#555;text-align:center;line-height:1.5">
          From our soil to your kitchen — every Mittika powder is sun-dried, stone-ground, and NABL lab-tested. Welcome to a purer way of living. 🌱
        </p>
      </div>
      <p style="margin:18px 0 0;text-align:center;font-size:12px;color:#888">
        <strong style="color:#2f5d3a">Thanks for buying Mittika products</strong> — your journey to authentic Ayurveda begins here.
      </p>
      <hr style="border:none;border-top:1px solid #eee;margin:22px 0 14px">
      <p style="font-size:12px;color:#888;margin:0;line-height:1.6">
        Warm regards,<br>
        <strong style="color:#2f5d3a">Ecovia Enterprises OPC Pvt. Ltd.</strong><br>
        Brand: <em>Mittika</em><br>
        📧 info@ecovia.co.in &nbsp;•&nbsp; 📞 +91 87588 08684<br>
        🌐 <a href="https://ecovia.co.in" style="color:#4d7a5e;text-decoration:none">ecovia.co.in</a>
      </p>
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