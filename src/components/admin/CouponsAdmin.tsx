import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, MessageCircle, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { waLink } from '@/lib/whatsapp';

export const CouponsAdmin = () => {
  const qc = useQueryClient();
  const [form, setForm] = useState({ code: '', discount_type: 'percent', discount_value: '10', min_order: '0', product_id: '', expires_at: '', description: '' });
  const [saving, setSaving] = useState(false);

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: async () => {
      const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: async () => {
      const { data } = await supabase.from('orders').select('customer_name, customer_phone').not('customer_phone', 'is', null);
      const seen = new Set<string>();
      return (data || []).filter(c => { if (seen.has(c.customer_phone)) return false; seen.add(c.customer_phone); return true; });
    },
  });

  const create = async () => {
    if (!form.code.trim() || !form.discount_value) { toast({ title: 'Missing fields', variant: 'destructive' }); return; }
    setSaving(true);
    const { error } = await supabase.from('coupons').insert({
      code: form.code.trim().toUpperCase(),
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      min_order: Number(form.min_order || 0),
      product_id: form.product_id || null,
      expires_at: form.expires_at || null,
      description: form.description || null,
      active: true,
    });
    setSaving(false);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: '🎁 Coupon created' });
    setForm({ code: '', discount_type: 'percent', discount_value: '10', min_order: '0', product_id: '', expires_at: '', description: '' });
    qc.invalidateQueries({ queryKey: ['admin-coupons'] });
  };

  const sendCouponWA = (coupon: any, customer: any) => {
    const valStr = coupon.discount_type === 'percent' ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} OFF`;
    const msg = `🎁 *Mittika Exclusive Offer for you!*\n\nHi ${customer.customer_name},\nUse code *${coupon.code}* and get *${valStr}* on your next order.${coupon.description ? `\n\n${coupon.description}` : ''}\n\nShop now: https://ecovia.co.in/products`;
    window.open(waLink(customer.customer_phone, msg), '_blank');
  };

  if (isLoading) return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary"/></div>;

  return (
    <div className="p-4 space-y-4">
      <h2 className="font-serif text-lg font-bold">Coupons</h2>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <input value={form.code} onChange={e => setForm(p => ({...p, code: e.target.value.toUpperCase()}))} placeholder="CODE (e.g. MITTIKA10)" className="px-3 py-2 text-sm rounded-lg border border-border bg-background uppercase"/>
          <select value={form.discount_type} onChange={e => setForm(p => ({...p, discount_type: e.target.value}))} className="px-3 py-2 text-sm rounded-lg border border-border bg-background">
            <option value="percent">% Percent</option>
            <option value="flat">₹ Flat</option>
          </select>
          <input type="number" value={form.discount_value} onChange={e => setForm(p => ({...p, discount_value: e.target.value}))} placeholder="Value" className="px-3 py-2 text-sm rounded-lg border border-border bg-background"/>
          <input type="number" value={form.min_order} onChange={e => setForm(p => ({...p, min_order: e.target.value}))} placeholder="Min order ₹" className="px-3 py-2 text-sm rounded-lg border border-border bg-background"/>
          <input value={form.product_id} onChange={e => setForm(p => ({...p, product_id: e.target.value}))} placeholder="Product ID (blank = all)" className="px-3 py-2 text-sm rounded-lg border border-border bg-background"/>
          <input type="date" value={form.expires_at} onChange={e => setForm(p => ({...p, expires_at: e.target.value}))} className="px-3 py-2 text-sm rounded-lg border border-border bg-background"/>
        </div>
        <input value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} placeholder="Description (optional)" className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background"/>
        <button onClick={create} disabled={saving} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
          <Plus size={14}/> Create Coupon
        </button>
      </div>

      {coupons.map((c: any) => (
        <div key={c.id} className="bg-card border border-border rounded-xl p-3">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <p className="font-mono font-bold text-primary flex items-center gap-1"><Tag size={14}/> {c.code}</p>
              <p className="text-xs text-muted-foreground">
                {c.discount_type === 'percent' ? `${c.discount_value}% off` : `₹${c.discount_value} off`}
                {c.min_order > 0 && ` • Min ₹${c.min_order}`}
                {c.product_id && ` • ${c.product_id}`}
              </p>
              {c.description && <p className="text-xs text-foreground/80 mt-1">{c.description}</p>}
            </div>
          </div>
          <details className="mt-2">
            <summary className="text-xs cursor-pointer text-primary">Send to customers ({customers.length})</summary>
            <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
              {customers.map((cust: any) => (
                <button key={cust.customer_phone} onClick={() => sendCouponWA(c, cust)}
                  className="w-full text-left text-xs px-2 py-1 hover:bg-secondary rounded flex items-center justify-between">
                  <span>{cust.customer_name} — {cust.customer_phone}</span>
                  <MessageCircle size={12} className="text-primary"/>
                </button>
              ))}
            </div>
          </details>
        </div>
      ))}
    </div>
  );
};

export default CouponsAdmin;