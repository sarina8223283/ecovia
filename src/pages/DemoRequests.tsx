import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Inbox, RefreshCw, Mail, Phone, Building2, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { toast } from '@/hooks/use-toast';

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sarina-admin`;

interface DemoRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string | null;
  service?: string | null;
  message?: string | null;
  status: string;
  created_at: string;
  image_urls?: string[];
}

const STATUSES = ['new', 'contacted', 'closed'];

const callFn = async (body: Record<string, unknown>) => {
  const resp = await fetch(FN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify(body),
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(data.error || 'Request failed');
  return data;
};

const DemoRequests = () => {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<DemoRequest[]>([]);

  const load = async (pw: string) => {
    setLoading(true);
    try {
      const data = await callFn({ action: 'list_demo_requests', password: pw });
      setRequests(data.requests || []);
      setUnlocked(true);
    } catch (err: any) {
      toast({ title: 'Could not load requests', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const setStatus = async (id: string, status: string) => {
    setRequests(prev => prev.map(r => (r.id === id ? { ...r, status } : r)));
    try {
      await callFn({ action: 'update_demo_request', password, tool_call: { id, status } });
    } catch (err: any) {
      toast({ title: 'Update failed', description: err.message, variant: 'destructive' });
    }
  };

  if (!unlocked) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center p-4">
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onSubmit={e => { e.preventDefault(); load(password); }}
            className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl p-8 space-y-4"
          >
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-foreground">Demo &amp; Enquiry Requests</h1>
              <p className="text-muted-foreground text-sm mt-2">Enter the admin password to continue</p>
            </div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Admin password"
              autoFocus
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
            />
            <button
              type="submit"
              disabled={!password.trim() || loading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              Unlock
            </button>
          </motion.form>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Inbox className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground">Demo &amp; Enquiry Requests</h1>
              <p className="text-sm text-muted-foreground">{requests.length} total requests</p>
            </div>
          </div>
          <button
            onClick={() => load(password)}
            className="px-4 py-2 rounded-xl border border-border text-sm flex items-center gap-2 hover:bg-secondary/40 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {requests.length === 0 && (
          <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground">
            No requests yet.
          </div>
        )}

        <div className="space-y-4">
          {requests.map(r => (
            <div key={r.id} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-foreground">{r.name}</h3>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <a href={`mailto:${r.email}`} className="flex items-center gap-1 hover:text-primary">
                      <Mail className="w-3.5 h-3.5" />{r.email}
                    </a>
                    <a href={`tel:${r.phone}`} className="flex items-center gap-1 hover:text-primary">
                      <Phone className="w-3.5 h-3.5" />{r.phone}
                    </a>
                    {r.company && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" />{r.company}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleString('en-IN')}
                  </span>
                  <select
                    value={r.status}
                    onChange={e => setStatus(r.id, e.target.value)}
                    className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-foreground"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {r.service && (
                <p className="mt-3 text-sm">
                  <span className="text-muted-foreground">Interested in: </span>
                  <span className="text-primary font-medium">{r.service}</span>
                </p>
              )}
              {r.message && <p className="mt-2 text-sm text-foreground/90 whitespace-pre-line">{r.message}</p>}

              {r.image_urls && r.image_urls.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.image_urls.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer">
                      <img src={url} alt={`Attachment ${i + 1}`} loading="lazy" className="h-20 w-20 object-cover rounded-lg border border-border" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default DemoRequests;
