import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { z } from 'zod';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Tag, X } from 'lucide-react';

const schema = z.object({
  full_name: z.string().trim().min(2, 'Full name is required').max(100),
  email: z.string().trim().email('Invalid email').max(255),
  phone: z.string().trim().min(7, 'Phone number is required').max(20),
  address: z.string().trim().min(5, 'Residential address is required').max(500),
  city: z.string().trim().min(1, 'City is required').max(100),
  state: z.string().trim().min(1, 'State is required').max(100),
  pincode: z.string().trim().min(4, 'Pincode is required').max(10),
  permanent_address: z.string().trim().min(5, 'Permanent address is required').max(500),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { user, profile, loading, updateProfile } = useAuth();
  const { items, getTotal } = useCart();
  const [saving, setSaving] = useState(false);
  const [sameAddress, setSameAddress] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [validating, setValidating] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    permanent_address: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth?redirect=/checkout');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile || user) {
      setForm(prev => ({
        ...prev,
        full_name: profile?.full_name || prev.full_name,
        email: user?.email || prev.email,
        phone: profile?.phone || prev.phone,
        address: profile?.address || prev.address,
        city: profile?.city || prev.city,
        state: profile?.state || prev.state,
        pincode: profile?.pincode || prev.pincode,
        permanent_address: (profile as any)?.permanent_address || prev.permanent_address,
      }));
    }
  }, [profile, user]);

  useEffect(() => {
    if (sameAddress) {
      setForm(prev => ({ ...prev, permanent_address: prev.address }));
    }
  }, [sameAddress, form.address]);

  if (!loading && items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-2xl font-bold mb-4">Your cart is empty</h1>
          <button onClick={() => navigate('/products')} className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium">Browse Products</button>
        </div>
      </Layout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const first = Object.values(result.error.flatten().fieldErrors).flat()[0];
      toast.error(first || 'Please fill all required fields');
      return;
    }
    setSaving(true);
    const { error } = await updateProfile({
      full_name: form.full_name,
      phone: form.phone,
      address: form.address,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      permanent_address: form.permanent_address,
    } as any);
    setSaving(false);
    if (error) {
      toast.error('Could not save your details. Please try again.');
      return;
    }
    navigate('/payment');
  };

  const subtotal = getTotal();
  const total = Math.max(0, subtotal - (appliedCoupon?.discount || 0));

  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setValidating(true);
    const { data, error } = await supabase.from('coupons').select('*').eq('code', code).eq('active', true).maybeSingle();
    setValidating(false);
    if (error || !data) { toast.error('Invalid or inactive coupon'); return; }
    if (data.expires_at && new Date(data.expires_at) < new Date()) { toast.error('Coupon has expired'); return; }
    if (subtotal < Number(data.min_order || 0)) { toast.error(`Minimum order ₹${data.min_order} required`); return; }
    let discount = 0;
    if (data.discount_type === 'percent') discount = (subtotal * Number(data.discount_value)) / 100;
    else discount = Number(data.discount_value);
    discount = Math.min(discount, subtotal);
    setAppliedCoupon({ code: data.code, discount });
    sessionStorage.setItem('mittika_coupon', JSON.stringify({ code: data.code, discount }));
    toast.success(`Coupon applied! You saved ₹${discount.toFixed(2)}`);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    sessionStorage.removeItem('mittika_coupon');
  };

  const input = "w-full px-4 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors";

  return (
    <Layout>
      <Helmet>
        <title>Checkout — Mittika by Ecovia Enterprises</title>
      </Helmet>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Checkout</h1>
        <p className="text-muted-foreground mb-8">Confirm your details before payment.</p>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-card rounded-2xl shadow-elevated p-6 sm:p-8 space-y-5"
          >
            <h2 className="font-serif text-xl font-bold mb-4">Customer Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input type="text" required value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} className={input} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className={input} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <input type="tel" required placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className={input} />
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="font-medium text-foreground mb-3">Residential / Shipping Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-2">Address *</label>
                  <textarea required rows={2} value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className={`${input} resize-none`} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">City *</label>
                  <input type="text" required value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} className={input} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">State *</label>
                  <input type="text" required value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} className={input} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Pincode *</label>
                  <input type="text" required value={form.pincode} onChange={e => setForm(p => ({ ...p, pincode: e.target.value }))} className={input} />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-foreground">Permanent Address</h3>
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={sameAddress} onChange={e => setSameAddress(e.target.checked)} />
                  Same as residential
                </label>
              </div>
              <textarea
                required
                rows={2}
                disabled={sameAddress}
                value={form.permanent_address}
                onChange={e => setForm(p => ({ ...p, permanent_address: e.target.value }))}
                className={`${input} resize-none ${sameAddress ? 'opacity-60' : ''}`}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Continue to Payment'}
              <ArrowRight size={18} />
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl shadow-elevated p-6 h-fit space-y-4"
          >
            <h2 className="font-serif text-xl font-bold mb-2">Order Summary</h2>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.productId} className="flex justify-between gap-4 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{item.productName}</p>
                    <p className="text-muted-foreground text-xs">
                      {item.quantityGrams >= 1000 ? `${item.quantityGrams/1000} Kg` : `${item.quantityGrams}g`}
                    </p>
                  </div>
                  <span className="font-semibold">₹{(item.quantityGrams * item.pricePerGram).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="border-t border-border pt-3">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-primary/10 px-3 py-2 rounded-lg">
                  <span className="text-sm font-medium text-primary flex items-center gap-2"><Tag size={14}/> {appliedCoupon.code}</span>
                  <button onClick={removeCoupon} className="text-muted-foreground hover:text-destructive"><X size={14}/></button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())} placeholder="Coupon code" className="flex-1 px-3 py-2 text-sm rounded-lg border border-input bg-background focus:border-primary outline-none uppercase" />
                  <button type="button" onClick={applyCoupon} disabled={validating || !couponInput.trim()} className="px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 disabled:opacity-50">Apply</button>
                </div>
              )}
            </div>

            <div className="border-t border-border pt-3 space-y-1">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              {appliedCoupon && <div className="flex justify-between text-sm text-primary"><span>Discount</span><span>- ₹{appliedCoupon.discount.toFixed(2)}</span></div>}
              <div className="flex justify-between font-bold pt-1"><span>Total</span><span className="text-primary">₹{total.toFixed(2)}</span></div>
            </div>
            <div className="flex items-start gap-2 text-xs text-muted-foreground pt-2">
              <ShieldCheck size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <span>Your details are saved securely to your Mittika account.</span>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;