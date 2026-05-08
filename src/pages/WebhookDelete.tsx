import Layout from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';

const WebhookDelete = () => (
  <Layout>
    <Helmet><title>Data Deletion Callback – Ecovia Enterprises</title><link rel="canonical" href="https://ecovia.co.in/webhook/delete" /></Helmet>
    <section className="py-16 min-h-[70vh] bg-hero-pattern">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-card rounded-2xl shadow-elevated p-8">
          <h1 className="font-serif text-3xl font-bold text-primary mb-3">Meta Data Deletion Callback</h1>
          <p className="text-muted-foreground mb-4">Receives POST requests from Meta with a signed_request, removes user data tied to the Meta user ID, logs a confirmation code and returns the status URL.</p>
          <code className="block mt-2 break-all bg-secondary/40 p-3 rounded-lg text-xs">{`https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/meta-webhook/delete`}</code>
          <p className="text-sm mt-4">Self-serve: <a className="text-primary underline" href="/data-deletion">/data-deletion</a>.</p>
        </div>
      </div>
    </section>
  </Layout>
);
export default WebhookDelete;