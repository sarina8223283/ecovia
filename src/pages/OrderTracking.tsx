import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import OrderTimeline from '@/components/orders/OrderTimeline';
import { Helmet } from 'react-helmet-async';
import { Package, Download, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { downloadInvoice, buildInvoiceNumber } from '@/lib/invoice';

const OrderTracking = () => {
  const { orderNumber } = useParams();
  const [searchParams] = useSearchParams();
  const guestToken = searchParams.get('token');
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user && !guestToken) navigate('/auth');
  }, [user, authLoading, guestToken, navigate]);

  useEffect(() => {
    if (!orderNumber) return;
    if (!user && !guestToken) return;
    (async () => {
      let q = supabase.from('orders').select('*').eq('order_number', orderNumber);
      if (user) q = q.eq('user_id', user.id);
      else if (guestToken) q = q.eq('guest_token', guestToken);
      const { data: o } = await q.maybeSingle();
      if (!o) { setLoading(false); return; }
      setOrder(o);
      const { data: it } = await supabase.from('order_items').select('*').eq('order_id', o.id);
      setItems(it || []);
      setLoading(false);
    })();
  }, [user, orderNumber, guestToken]);

  const sendInvoiceEmail = async () => {
    if (!order) return;
    const subtotal = items.reduce((s, it: any) => s + Number(it.total_price), 0);
    try {
      await supabase.functions.invoke('order-notification', {
        body: {
          action: 'send_invoice',
          to: order.customer_email || user?.email,
          orderNumber: order.order_number,
          invoiceNumber: order.invoice_number || buildInvoiceNumber(order.order_number),
          customerName: order.customer_name,
          customerPhone: order.customer_phone,
          customerAddress: order.customer_address,
          items, subtotal,
          discount: Number(order.discount_amount || 0),
          total: Number(order.total_amount),
          couponCode: order.coupon_code,
        },
      });
      toast.success('Invoice emailed to ' + (order.customer_email || user?.email));
    } catch (e: any) {
      toast.error('Could not send email. You can download instead.');
    }
  };

  const downloadPdf = () => {
    if (!order) return;
    const subtotal = items.reduce((s, it: any) => s + Number(it.total_price), 0);
    downloadInvoice({
      orderNumber: order.order_number,
      invoiceNumber: order.invoice_number || buildInvoiceNumber(order.order_number),
      date: new Date(order.created_at).toLocaleDateString('en-IN'),
      customerName: order.customer_name,
      customerEmail: order.customer_email || user?.email || '',
      customerPhone: order.customer_phone,
      customerAddress: order.customer_address,
      items: items as any,
      subtotal,
      discount: Number(order.discount_amount || 0),
      total: Number(order.total_amount),
      couponCode: order.coupon_code || undefined,
      paidVia: 'UPI',
    });
  };

  if (loading) return <Layout><div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">Loading order…</div></Layout>;

  if (!order) return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center flex-col gap-3 text-center px-4">
        <Package className="w-12 h-12 text-muted-foreground/40" />
        <p className="text-lg">Order not found.</p>
        <Link to="/account?tab=orders" className="text-primary underline">Back to my orders</Link>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <Helmet><title>Order {order.order_number} – Tracking</title></Helmet>
      <section className="py-10 min-h-[80vh] bg-hero-pattern">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <Link to="/account?tab=orders" className="text-sm text-muted-foreground hover:text-foreground">← Back to all orders</Link>
          <div className="bg-card rounded-2xl shadow-elevated p-6 sm:p-8 mt-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h1 className="font-serif text-2xl font-bold">{order.order_number}</h1>
                <p className="text-sm text-muted-foreground">Placed {new Date(order.created_at).toLocaleString('en-IN')}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary capitalize text-sm font-medium">{order.status}</span>
            </div>

            <OrderTimeline status={order.status} timestamps={order} />

            {order.tracking_number && (
              <div className="mt-6 p-4 rounded-xl bg-secondary/40">
                <p className="text-sm">📦 Tracking: <span className="font-mono font-medium">{order.tracking_number}</span> {order.courier && `via ${order.courier}`}</p>
              </div>
            )}

            <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-secondary/30">
                <p className="font-medium mb-1">Delivery Address</p>
                <p className="flex gap-2 text-muted-foreground"><MapPin size={14} className="mt-0.5"/> {order.customer_address}</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/30">
                <p className="font-medium mb-1">Customer</p>
                <p className="text-muted-foreground">{order.customer_name}</p>
                <p className="flex gap-2 text-muted-foreground"><Phone size={14} className="mt-0.5"/>{order.customer_phone}</p>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="font-medium mb-2">Items</h2>
              <div className="space-y-2">
                {items.map(it => (
                  <div key={it.id} className="flex items-center justify-between text-sm py-2 border-b border-border/50">
                    <span>{it.product_name} × {it.quantity_grams >= 1000 ? `${it.quantity_grams/1000}kg` : `${it.quantity_grams}g`}</span>
                    <span className="font-medium">₹{Number(it.total_price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between font-bold">
                <span>Total</span><span>₹{Number(order.total_amount).toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={downloadPdf} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90">
                <Download size={16} /> Download Invoice
              </button>
              <button onClick={sendInvoiceEmail} className="inline-flex items-center gap-2 border border-primary text-primary px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/10">
                <Mail size={16} /> Email Invoice
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default OrderTracking;