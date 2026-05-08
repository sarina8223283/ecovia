import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-hub-signature, x-hub-signature-256',
};

const VERIFY_TOKEN = Deno.env.get('META_VERIFY_TOKEN') || '';

function genCode() {
  return `MTK-DEL-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 1000)}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/+/, '').split('/').filter(Boolean);
  // path looks like ['meta-webhook', ...sub]
  const sub = path.slice(1).join('/');

  // ---- GET verification (Meta sends hub.mode/verify_token/challenge) ----
  if (req.method === 'GET') {
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');
    if (mode === 'subscribe' && token && VERIFY_TOKEN && token === VERIFY_TOKEN) {
      return new Response(challenge || 'OK', { status: 200, headers: { ...corsHeaders, 'Content-Type': 'text/plain' } });
    }
    return new Response('Forbidden', { status: 403, headers: corsHeaders });
  }

  // ---- POST endpoints ----
  if (req.method === 'POST') {
    let body: any = {};
    try { body = await req.json(); } catch { body = {}; }

    // /meta-webhook/uninstall  -- accept and 200
    if (sub === 'uninstall') {
      console.log('Meta app uninstall received', body);
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // /meta-webhook/delete -- data deletion callback
    if (sub === 'delete') {
      const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
      const code = genCode();
      const signed = body.signed_request || '';
      let userIdMeta: string | undefined;
      try {
        // signed_request format: base64.payloadBase64
        const parts = String(signed).split('.');
        if (parts.length === 2) {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          userIdMeta = payload.user_id;
        }
      } catch (_) { /* ignore */ }

      await supabase.from('meta_data_deletion_requests').insert({
        confirmation_code: code,
        user_id_meta: userIdMeta || null,
        signed_request: signed || null,
        status: 'received',
      });

      const origin = 'https://ecovia.co.in';
      return new Response(JSON.stringify({
        url: `${origin}/data-deletion?code=${code}`,
        confirmation_code: code,
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Default webhook (Messenger / Instagram message events) — log + 200
    console.log('Meta webhook event', JSON.stringify(body));
    return new Response('EVENT_RECEIVED', { status: 200, headers: { ...corsHeaders, 'Content-Type': 'text/plain' } });
  }

  return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
});