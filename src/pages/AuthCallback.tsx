import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';

const AuthCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [msg, setMsg] = useState('Processing sign-in…');

  useEffect(() => {
    const code = params.get('code');
    const error = params.get('error') || params.get('error_description');
    if (error) { setMsg(`Sign-in failed: ${error}`); return; }
    if (code) {
      setMsg('Authorization received. Redirecting…');
      setTimeout(() => navigate('/account'), 1200);
    } else {
      setMsg('Awaiting authorization callback from Meta…');
    }
  }, [params, navigate]);

  return (
    <Layout>
      <Helmet><title>OAuth Callback – Ecovia Enterprises</title><link rel="canonical" href="https://ecovia.co.in/auth/callback" /></Helmet>
      <section className="py-16 min-h-[70vh] bg-hero-pattern">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-card rounded-2xl shadow-elevated p-8 text-center">
            <h1 className="font-serif text-2xl font-bold text-primary mb-3">Ecovia Enterprises — OAuth Callback</h1>
            <p className="text-muted-foreground">{msg}</p>
            <p className="text-xs text-muted-foreground mt-6">Valid OAuth Redirect URL: <code>https://ecovia.co.in/auth/callback</code></p>
          </div>
        </div>
      </section>
    </Layout>
  );
};
export default AuthCallback;