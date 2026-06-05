import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Lock, Send, Sparkles, Tag, MessageCircle, Mail, Users, Loader2, Check, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import { waLink } from '@/lib/whatsapp';

const ADMIN_PASSWORD = '7524';

interface Customer {
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
}

const SARINA_TEMPLATES = [
  {
    name: 'Festive Offer',
    headline: '🌿 A Festive Gift from Mittika, Just for You',
    body: `As one of our most cherished customers, we wanted to share a heartfelt token of appreciation this festive season.\n\nEnjoy an exclusive discount on your next order of our pure, hand-crafted Ayurvedic herbal powders — created with love at Ecovia Enterprises.\n\nUse your personal coupon code below at checkout. Best wishes from the entire Mittika family! 🪔`,
  },
  {
    name: 'Welcome Back',
    headline: '✨ We Miss You — Here\'s Something Special',
    body: `It\'s been a while since your last order, and we\'d love to welcome you back to Mittika.\n\nWe\'ve prepared a personal discount just for you — a small thank-you for being part of our journey toward chemical-free, authentic Ayurvedic care.\n\nApply your exclusive code at checkout and rediscover the powders you love. 🌿`,
  },
  {
    name: 'New Launch',
    headline: '🌱 Be the First — New Mittika Launch',
    body: `We\'re excited to share something new with you! Our latest hand-sourced herbal powder is now live on the Mittika store.\n\nAs a valued customer, here\'s an early-access coupon to try it before anyone else.\n\nWith warmth,\nThe Mittika Team`,
  },
  {
    name: 'Thank You Reward',
    headline: '💚 A Small Thank You from Mittika',
    body: `Thank you for trusting Mittika for your wellness journey. Your support means the world to a small Indian brand like ours.\n\nAs a token of gratitude, please accept this exclusive discount on your next purchase.\n\nWith love & gratitude,\nEcovia Enterprises • Mittika`,
  },
];

const PasswordGate = ({ onAuth }: { onAuth: () => void }) => {
  const [val, setVal] = useState('');
  const [err, setErr] = useState(false);
  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-serif text-2xl font-bold">Customer Outreach</h1>
              <p className="text-muted-foreground text-sm mt-2">Enter admin password</p>
            </div>
            <form onSubmit={e => { e.preventDefault(); if (val.trim() === ADMIN_PASSWORD) onAuth(); else { setErr(true); toast.error('Incorrect password'); setTimeout(() => setErr(false), 1500);} }}>
              <input type="password" value={val} onChange={e => setVal(e.target.value)} placeholder="Password"
                className={`w-full px-4 py-3 rounded-xl border ${err ? 'border-destructive' : 'border-border'} bg-background mb-4`} autoFocus />
              <button type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium">Unlock</button>
            </form>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

const OutreachPanel = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [headline, setHeadline] = useState('');
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState<'email' | 'whatsapp' | 'both'>('email');
  const [includeCoupon, setIncludeCoupon] = useState(true);
  const [coupon, setCoupon] = useState({
    code: '',
    discount_type: 'percent' as 'percent' | 'flat',
    discount_value: '15',
    min_order: '0',
    expires_at: '',
  });
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['outreach-customers'],
    queryFn: async () => {
      const { data } = await supabase
        .from('orders')
        .select('customer_name, customer_phone, customer_email')
        .order('created_at', { ascending: false });
      const seen = new Set<string>();
      const list: Customer[] = [];
      (data || []).forEach((c: any) => {
        const key = (c.customer_email || c.customer_phone || '').toLowerCase();
        if (!key || seen.has(key)) return;
        seen.add(key);
        list.push(c);
      });
      return list;
    },
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return customers;
    return customers.filter((c: Customer) =>
      (c.customer_name || '').toLowerCase().includes(q) ||
      (c.customer_email || '').toLowerCase().includes(q) ||
      (c.customer_phone || '').includes(q)
    );
  }, [customers, search]);

  const toggle = (key: string) => {
    setSelected(prev => {
      const n = new Set(prev);
      if (n.has(key)) n.delete(key); else n.add(key);
      return n;
    });
  };

  const selectAll = () => setSelected(new Set(filtered.map(c => c.customer_email || c.customer_phone)));
  const clearAll = () => setSelected(new Set());

  const applySarinaDraft = (tpl: typeof SARINA_TEMPLATES[number]) => {
    setHeadline(tpl.headline);
    setMessage(tpl.body);
    if (includeCoupon && !coupon.code) {
      // Auto-generate a unique-ish code
      const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
      setCoupon(p => ({ ...p, code: `MITTIKA${rand}` }));
    }
    toast.success('🌿 Sarina drafted your message');
  };

  const send = async () => {
    if (selected.size === 0) { toast.error('Select at least one customer'); return; }
    if (!headline.trim() || !message.trim()) { toast.error('Headline and message required'); return; }
    if (includeCoupon && (!coupon.code.trim() || !coupon.discount_value)) { toast.error('Coupon code & value required'); return; }

    const chosen = customers.filter((c: Customer) => selected.has(c.customer_email || c.customer_phone));
    setSending(true);

    try {
      if (channel === 'email' || channel === 'both') {
        const recipients = chosen
          .filter(c => !!c.customer_email)
          .map(c => ({ email: c.customer_email, name: c.customer_name, phone: c.customer_phone }));
        if (recipients.length === 0 && channel === 'email') {
          toast.error('Selected customers have no email');
        } else if (recipients.length > 0) {
          const { data, error } = await supabase.functions.invoke('customer-outreach', {
            body: {
              recipients,
              headline,
              message,
              coupon: includeCoupon ? {
                code: coupon.code.trim().toUpperCase(),
                discount_type: coupon.discount_type,
                discount_value: Number(coupon.discount_value),
                min_order: Number(coupon.min_order || 0),
                expires_at: coupon.expires_at || null,
              } : null,
            },
          });
          if (error) throw error;
          const okCount = (data as any)?.results?.filter((r: any) => r.ok).length || 0;
          toast.success(`📧 Sent ${okCount}/${recipients.length} emails${includeCoupon ? ' with coupon ' + coupon.code.toUpperCase() : ''}`);
        }
      }

      if (channel === 'whatsapp' || channel === 'both') {
        // WhatsApp: open each chat (browser will open multiple tabs)
        const phones = chosen.filter(c => !!c.customer_phone);
        const couponLine = includeCoupon
          ? `\n\n🎁 Your coupon: *${coupon.code.toUpperCase()}* (${coupon.discount_type === 'percent' ? coupon.discount_value + '% OFF' : '₹' + coupon.discount_value + ' OFF'})\nShop: https://ecovia.co.in/products`
          : '\n\nShop now: https://ecovia.co.in/products';
        phones.forEach((c, idx) => {
          setTimeout(() => {
            const text = `*${headline}*\n\nHi ${c.customer_name || 'Customer'},\n\n${message}${couponLine}\n\n— Team Mittika`;
            window.open(waLink(c.customer_phone, text), '_blank');
          }, idx * 250);
        });
        toast.success(`📱 Opening WhatsApp for ${phones.length} customer(s)`);
      }

      setSelected(new Set());
    } catch (e: any) {
      toast.error(e?.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout>
      <Helmet><title>Customer Outreach — Admin</title></Helmet>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft size={16}/> Back to Admin
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold">Customer Outreach</h1>
            <p className="text-sm text-muted-foreground">Email & WhatsApp customers about offers — with Sarina auto-drafting</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Customers */}
          <div className="lg:col-span-1 bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold flex items-center gap-2"><Users size={16} className="text-primary"/> Customers ({selected.size}/{filtered.length})</h2>
            </div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name / email / phone"
              className="w-full mb-3 px-3 py-2 text-sm border border-border rounded-lg bg-background"/>
            <div className="flex gap-2 mb-3 text-xs">
              <button onClick={selectAll} className="text-primary hover:underline">Select all</button>
              <button onClick={clearAll} className="text-muted-foreground hover:underline">Clear</button>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-primary"/></div>
            ) : (
              <div className="max-h-[420px] overflow-y-auto space-y-1 -mr-2 pr-2">
                {filtered.map((c: Customer) => {
                  const key = c.customer_email || c.customer_phone;
                  const on = selected.has(key);
                  return (
                    <button key={key} onClick={() => toggle(key)}
                      className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-colors ${on ? 'bg-primary/10 border-primary/40' : 'border-border hover:bg-secondary/40'}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{c.customer_name || 'Customer'}</p>
                          {c.customer_email && <p className="text-muted-foreground truncate">{c.customer_email}</p>}
                          {c.customer_phone && <p className="text-muted-foreground">{c.customer_phone}</p>}
                        </div>
                        {on && <Check size={14} className="text-primary flex-shrink-0 mt-1"/>}
                      </div>
                    </button>
                  );
                })}
                {filtered.length === 0 && <p className="text-xs text-muted-foreground text-center py-6">No customers found</p>}
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="lg:col-span-2 space-y-5">
            {/* Sarina draft */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/20 border border-primary/20 rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                <Sparkles size={14}/> Sarina Auto-Draft
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SARINA_TEMPLATES.map(tpl => (
                  <button key={tpl.name} onClick={() => applySarinaDraft(tpl)}
                    className="text-xs px-3 py-2 bg-card border border-border rounded-lg hover:border-primary/40 hover:bg-primary/5 transition-colors">
                    {tpl.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Composer */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
              <h2 className="font-semibold">Compose Offer</h2>
              <input value={headline} onChange={e => setHeadline(e.target.value)} placeholder="Headline / Email subject"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background"/>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={6} placeholder="Your message to the customer…"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background resize-y"/>

              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <label className="text-sm font-medium">Channel:</label>
                {(['email','whatsapp','both'] as const).map(c => (
                  <button key={c} onClick={() => setChannel(c)}
                    className={`text-xs px-3 py-1.5 rounded-full border ${channel===c ? 'bg-primary text-primary-foreground border-primary' : 'border-border'}`}>
                    {c === 'email' && <Mail size={12} className="inline mr-1"/>}
                    {c === 'whatsapp' && <MessageCircle size={12} className="inline mr-1"/>}
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Coupon */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={includeCoupon} onChange={e => setIncludeCoupon(e.target.checked)} className="w-4 h-4"/>
                <span className="font-semibold flex items-center gap-2"><Tag size={16} className="text-primary"/> Attach a real coupon code</span>
              </label>
              {includeCoupon && (
                <>
                  <p className="text-xs text-muted-foreground">
                    The code is stored in the database and auto-validated at checkout. Fake / unknown codes are rejected by the system.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <input value={coupon.code} onChange={e => setCoupon(p => ({...p, code: e.target.value.toUpperCase()}))}
                      placeholder="CODE" className="px-3 py-2 text-sm border border-border rounded-lg bg-background uppercase font-mono col-span-2 sm:col-span-1"/>
                    <select value={coupon.discount_type} onChange={e => setCoupon(p => ({...p, discount_type: e.target.value as any}))}
                      className="px-3 py-2 text-sm border border-border rounded-lg bg-background">
                      <option value="percent">% Percent</option>
                      <option value="flat">₹ Flat</option>
                    </select>
                    <input type="number" value={coupon.discount_value} onChange={e => setCoupon(p => ({...p, discount_value: e.target.value}))}
                      placeholder="Value" className="px-3 py-2 text-sm border border-border rounded-lg bg-background"/>
                    <input type="number" value={coupon.min_order} onChange={e => setCoupon(p => ({...p, min_order: e.target.value}))}
                      placeholder="Min order ₹" className="px-3 py-2 text-sm border border-border rounded-lg bg-background"/>
                    <input type="date" value={coupon.expires_at} onChange={e => setCoupon(p => ({...p, expires_at: e.target.value}))}
                      className="px-3 py-2 text-sm border border-border rounded-lg bg-background"/>
                  </div>
                </>
              )}
            </div>

            <button onClick={send} disabled={sending || selected.size === 0}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50">
              {sending ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send size={16}/>}
              {sending ? 'Sending…' : `Send to ${selected.size} customer${selected.size === 1 ? '' : 's'}`}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const CustomerOutreach = () => {
  const [auth, setAuth] = useState(false);
  if (!auth) return <PasswordGate onAuth={() => setAuth(true)} />;
  return <OutreachPanel />;
};

export default CustomerOutreach;