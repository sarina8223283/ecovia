import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';

const EDGE_BASE = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/meta-webhook`;

const MetaWebhook = () => {
  const [params] = useSearchParams();
  const [status, setStatus] = useState<'idle'|'verifying'|'verified'|'failed'>('idle');

  useEffect(() => {
    const mode = params.get('hub.mode');
    const token = params.get('hub.verify_token');
    const challenge = params.get('hub.challenge');
    if (mode === 'subscribe' && token && challenge) {
      setStatus('verifying');
      // Forward to the edge function for actual token validation.
      fetch(`${EDGE_BASE}?hub.mode=${mode}&hub.verify_token=${encodeURIComponent(token)}&hub.challenge=${encodeURIComponent(challenge)}`)
        .then(r => r.ok ? r.text().then(t => { document.body.innerText = t; setStatus('verified'); }) : setStatus('failed'))
        .catch(() => setStatus('failed'));
    }
  }, [params]);

  return (
    <Layout>
      <Helmet>
        <title>Meta API Webhook – Ecovia Enterprises</title>
        <meta name="description" content="Meta (Facebook & Instagram) webhook endpoint for Ecovia Enterprises / Mittika." />
        <link rel="canonical" href="https://ecovia.co.in/webhook" />
      </Helmet>
      <section className="py-16 min-h-[70vh] bg-hero-pattern">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="bg-card rounded-2xl shadow-elevated p-8">
            <h1 className="font-serif text-3xl font-bold text-primary mb-3">Meta API Webhook</h1>
            <p className="text-muted-foreground mb-6">This endpoint is used by Meta (Facebook &amp; Instagram) to deliver webhook events to <strong>Ecovia Enterprises</strong> for the Mittika brand app.</p>
            {status === 'verifying' && <p className="text-amber-600">Verifying with Meta…</p>}
            {status === 'verified' && <p className="text-primary font-medium">✓ Verification challenge returned successfully.</p>}
            {status === 'failed' && <p className="text-destructive">Verification failed. Token mismatch.</p>}

            <div className="mt-6 space-y-3 text-sm">
              <div className="p-4 rounded-xl bg-secondary/40">
                <p className="font-medium text-foreground mb-1">Webhook URL</p>
                <code className="block break-all text-xs">{EDGE_BASE}</code>
              </div>
              <div className="p-4 rounded-xl bg-secondary/40">
                <p className="font-medium text-foreground mb-1">Uninstall Callback</p>
                <code className="block break-all text-xs">{EDGE_BASE}/uninstall</code>
              </div>
              <div className="p-4 rounded-xl bg-secondary/40">
                <p className="font-medium text-foreground mb-1">Data Deletion Callback</p>
                <code className="block break-all text-xs">{EDGE_BASE}/delete</code>
              </div>
              <div className="p-4 rounded-xl bg-secondary/40">
                <p className="font-medium text-foreground mb-1">OAuth Redirect URL</p>
                <code className="block break-all text-xs">https://ecovia.co.in/auth/callback</code>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-6">Operated by Ecovia Enterprises OPC Pvt. Ltd. — info@ecovia.co.in</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MetaWebhook;