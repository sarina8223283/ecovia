import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, Save, LogOut, Download, FileText } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import OrderTimeline from '@/components/orders/OrderTimeline';
import { downloadInvoice, buildInvoiceNumber } from '@/lib/invoice';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_email?: string | null;
  accepted_at?: string | null;
  packed_at?: string | null;
  shipped_at?: string | null;
  delivered_at?: string | null;
  tracking_number?: string | null;
  courier?: string | null;
  invoice_number?: string | null;
  coupon_code?: string | null;
  discount_amount?: number | null;
}

const Account = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, profile, loading, signOut, updateProfile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>(
    searchParams.get('tab') === 'orders' ? 'orders' : 'profile'
  );
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: '', phone: '', address: '', city: '', state: '', pincode: '', permanent_address: ''
  });

  useEffect(() => { if (!loading && !user) navigate('/auth'); }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        pincode: profile.pincode || '',
        permanent_address: (profile as any).permanent_address || '',
      });
    }
  }, [profile]);

  useEffect(() => { if (user) fetchOrders(); }, [user]);

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').eq('user_id', user?.id).order('created_at', { ascending: false });
    if (data) setOrders(data as any);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile(form as any);
    if (error) toast.error(error.message); else toast.success('Profile updated successfully!');
    setSaving(false);
  };

  const handleSignOut = async () => { await signOut(); navigate('/'); toast.success('Signed out successfully'); };

  const handleDownloadInvoice = async (order: Order) => {
    // Fetch order items
    const { data: items, error } = await supabase.from('order_items').select('*').eq('order_id', order.id);
    if (error || !items) { toast.error('Could not load invoice items'); return; }
    const subtotal = items.reduce((s, it: any) => s + Number(it.total_price), 0);
    const discount = Number(order.discount_amount || 0);
    downloadInvoice({
      orderNumber: order.order_number,
      invoiceNumber: order.invoice_number || buildInvoiceNumber(order.order_number),
      date: new Date(order.delivered_at || order.created_at).toLocaleDateString('en-IN'),
      customerName: order.customer_name,
      customerEmail: order.customer_email || user?.email || '',
      customerPhone: order.customer_phone,
      customerAddress: order.customer_address,
      items: items as any,
      subtotal,
      discount,
      total: Number(order.total_amount),
      couponCode: order.coupon_code || undefined,
      paidVia: 'UPI',
    });
    toast.success('Invoice downloaded');
  };

  if (loading) return <Layout><div className="min-h-[60vh] flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading...</div></div></Layout>;

  return (
    <Layout>
      <section className="py-12 bg-hero-pattern min-h-[80vh]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="font-serif text-3xl font-bold text-foreground">My Account</h1>
              <button onClick={handleSignOut} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <LogOut size={18} /> Sign Out
              </button>
            </div>

            <div className="flex gap-4 mb-6">
              <button onClick={() => setActiveTab('profile')} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'profile' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
                <User size={18} /> Profile
              </button>
              <button onClick={() => setActiveTab('orders')} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'orders' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
                <Package size={18} /> Order History
              </button>
            </div>

            {activeTab === 'profile' ? (
              <div className="bg-card rounded-2xl shadow-elevated p-6 sm:p-8">
                <h2 className="font-serif text-xl font-bold text-foreground mb-6">Profile Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2"><label className="block text-sm font-medium text-foreground mb-2">Full Name</label><input type="text" value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" /></div>
                  <div><label className="block text-sm font-medium text-foreground mb-2">Phone Number</label><input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" /></div>
                  <div><label className="block text-sm font-medium text-foreground mb-2">Pincode</label><input type="text" value={form.pincode} onChange={e => setForm(p => ({ ...p, pincode: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" /></div>
                  <div className="sm:col-span-2"><label className="block text-sm font-medium text-foreground mb-2">Residential Address</label><textarea value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} rows={2} className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none" /></div>
                  <div><label className="block text-sm font-medium text-foreground mb-2">City</label><input type="text" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" /></div>
                  <div><label className="block text-sm font-medium text-foreground mb-2">State</label><input type="text" value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" /></div>
                  <div className="sm:col-span-2"><label className="block text-sm font-medium text-foreground mb-2">Permanent Address</label><textarea value={form.permanent_address} onChange={e => setForm(p => ({ ...p, permanent_address: e.target.value }))} rows={2} className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none" /></div>
                </div>
                <button onClick={handleSave} disabled={saving} className="mt-6 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                  <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            ) : (
              <div className="bg-card rounded-2xl shadow-elevated p-6 sm:p-8">
                <h2 className="font-serif text-xl font-bold text-foreground mb-6">Order History</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground mb-4">No orders yet</p>
                    <Link to="/products" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors">Start Shopping</Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map(order => {
                      const isDelivered = order.status === 'delivered' || order.status === 'completed';
                      return (
                        <div key={order.id} className="p-5 rounded-xl bg-secondary/30 border border-border">
                          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                            <div>
                              <span className="font-semibold text-foreground">{order.order_number}</span>
                              <p className="text-xs text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-primary">₹{Number(order.total_amount).toFixed(2)}</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${isDelivered ? 'bg-primary/20 text-primary' : 'bg-amber-500/20 text-amber-700'}`}>
                                {order.status?.replace('_', ' ')}
                              </span>
                            </div>
                          </div>

                          <OrderTimeline status={order.status as any} timestamps={order} />

                          {order.tracking_number && (
                            <p className="mt-3 text-sm text-muted-foreground">
                              📦 Tracking: <span className="font-mono font-medium text-foreground">{order.tracking_number}</span>
                              {order.courier && <span className="ml-2">via {order.courier}</span>}
                            </p>
                          )}

                          {isDelivered && (
                            <button
                              onClick={() => handleDownloadInvoice(order)}
                              className="mt-4 inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                            >
                              <Download size={16} /> Download Invoice
                            </button>
                          )}
                          {!isDelivered && (
                            <p className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground">
                              <FileText size={14} /> Invoice available after delivery
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Account;
