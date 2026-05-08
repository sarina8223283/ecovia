import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';

const WebhookUninstall = () => {
  useEffect(() => { /* POST handled by edge function meta-webhook/uninstall */ }, []);
  return (
    <Layout>
      <Helmet><title>App Uninstall Callback – Ecovia Enterprises</title><link rel="canonical" href="https://ecovia.co.in/webhook/uninstall" /></Helmet>
      <section className="py-16 min-h-[70vh] bg-hero-pattern">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-card rounded-2xl shadow-elevated p-8">
            <h1 className="font-serif text-3xl font-bold text-primary mb-3">Meta App Uninstall Callback</h1>
            <p className="text-muted-foreground mb-4">This endpoint receives <strong>POST</strong> requests from Meta when a user removes the Ecovia Enterprises / Mittika app from their Facebook or Instagram account. It always returns HTTP 200.</p>
            <p className="text-sm">Endpoint: <code className="block mt-2 break-all bg-secondary/40 p-3 rounded-lg text-xs">{`https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/meta-webhook/uninstall`}</code></p>
          </div>
        </div>
      </section>
    </Layout>
  );
};
export default WebhookUninstall;