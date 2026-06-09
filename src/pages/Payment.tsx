import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Copy, CheckCircle, AlertTriangle, Truck, Shield, ArrowLeft } from 'lucide-react';
import { Tag, X } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { openWhatsApp } from '@/lib/whatsapp';
import { buildInvoiceNumber } from '@/lib/invoice';

const UPI_ID = 'sarina8223283@ptyes';

const Payment = () => {
  const { items, getTotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = getTotal();
  // Read applied coupon from session
  const [couponData, setCouponData] = useState<{ code: string; discount: number } | null>(() => {
    try { const raw = sessionStorage.getItem('mittika_coupon'); return raw ? JSON.parse(raw) : null; } catch { return null; }
  });
  const [couponMeta, setCouponMeta] = useState<{ discount_type: 'percent' | 'flat'; discount_value: number } | null>(() => {
    try { const raw = sessionStorage.getItem('mittika_coupon_meta'); return raw ? JSON.parse(raw) : null; } catch { return null; }
  });
  const [couponInput, setCouponInput] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const discount = Number(couponData?.discount || 0);
  const finalTotal = Math.max(0, total - discount);
  const discountPercent = total > 0 ? (discount / total) * 100 : 0;

  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setValidatingCoupon(true);
    // Server-side validation against coupons table (RLS allows only active=true rows;
    // fake / inactive / expired codes therefore cannot be applied).
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code)
      .eq('active', true)
      .maybeSingle();
    setValidatingCoupon(false);
    if (error) { toast.error('Could not validate coupon. Try again.'); return; }
    if (!data) { toast.error(`"${code}" is not a valid coupon code. Please check and try again.`); return; }
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      toast.error(`Coupon "${code}" has expired and can no longer be used.`);
      return;
    }
    if (total < Number(data.min_order || 0)) {
      toast.error(`Coupon "${code}" requires a minimum order of ₹${data.min_order}.`);
      return;
    }
    if (data.product_id) {
      const hasProduct = items.some(it => it.productId === data.product_id);
      if (!hasProduct) {
        toast.error(`Coupon "${code}" is only valid when "${data.product_id}" is in your cart.`);
        return;
      }
    }
    let d = 0;
    if (data.discount_type === 'percent') d = (total * Number(data.discount_value)) / 100;
    else d = Number(data.discount_value);
    d = Math.min(d, total);
    const applied = { code: data.code, discount: d };
    setCouponData(applied);
    const meta = { discount_type: data.discount_type as 'percent' | 'flat', discount_value: Number(data.discount_value) };
    setCouponMeta(meta);
    sessionStorage.setItem('mittika_coupon', JSON.stringify(applied));
    sessionStorage.setItem('mittika_coupon_meta', JSON.stringify(meta));
    toast.success(`Coupon applied! You saved ₹${d.toFixed(2)}`);
  };

  const removeCoupon = () => {
    setCouponData(null);
    setCouponMeta(null);
    setCouponInput('');
    sessionStorage.removeItem('mittika_coupon');
    sessionStorage.removeItem('mittika_coupon_meta');
  };

  // Read guest details (or signed-in profile)
  const guest = (() => {
    try { const raw = sessionStorage.getItem('mittika_guest_details'); return raw ? JSON.parse(raw) : null; } catch { return null; }
  })();
  const customer = {
    name: profile?.full_name || guest?.full_name || '',
    email: user?.email || guest?.email || '',
    phone: profile?.phone || guest?.phone || '',
    address: profile?.address || guest?.address || '',
    city: profile?.city || guest?.city || '',
    state: profile?.state || guest?.state || '',
    pincode: profile?.pincode || guest?.pincode || '',
  };

  // Guard: must have completed checkout details (guest or signed-in)
  useEffect(() => {
    if (items.length === 0) return;
    const hasDetails = customer.name && customer.phone && customer.address && customer.city && customer.state && customer.pincode;
    if (!hasDetails) {
      navigate('/checkout');
    }
  }, [items.length, navigate, customer.name, customer.phone, customer.address, customer.pincode]);

  const copyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    toast.success('UPI ID copied!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleConfirmPayment = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create order
      const orderNumber = `MTK-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*10000).toString().padStart(4,'0')}`;
      const guestToken = user ? null : crypto.randomUUID();
      const { data: order, error: orderError } = await supabase.from('orders').insert({
        user_id: user?.id || null,
        guest_email: user ? null : customer.email,
        guest_token: guestToken,
        customer_name: customer.name || 'Customer',
        customer_phone: customer.phone || '',
        customer_email: customer.email || '',
        customer_address: customer.address ? `${customer.address}, ${customer.city || ''}, ${customer.state || ''} - ${customer.pincode || ''}` : '',
        order_number: orderNumber,
        total_amount: finalTotal,
        status: 'placed',
        invoice_number: buildInvoiceNumber(orderNumber),
        coupon_code: couponData?.code || null,
        discount_amount: discount,
        notes: `UPI Payment to ${UPI_ID}`,
      }).select().single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.productName,
        quantity_grams: item.quantityGrams,
        unit_price: item.pricePerGram,
        total_price: item.quantityGrams * item.pricePerGram,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // Send admin email notification
      try {
        await supabase.functions.invoke('order-notification', {
          body: {
            orderNumber,
            customerName: customer.name || 'Customer',
            customerPhone: customer.phone || '',
            customerEmail: customer.email || '',
            totalAmount: total,
            items: items.map(i => ({
              name: i.productName,
              quantity: i.quantityGrams >= 1000 ? `${i.quantityGrams/1000} Kg` : `${i.quantityGrams}g`,
              price: (i.quantityGrams * i.pricePerGram).toFixed(2),
            })),
          },
        });
      } catch (emailErr) {
        console.error('Email notification failed:', emailErr);
      }

      // Open WhatsApp for "order placed" notification
      if (customer.phone) {
        openWhatsApp(customer.phone, 'placed', {
          orderNumber,
          customerName: customer.name || 'Customer',
          total: finalTotal,
        });
      }

      sessionStorage.removeItem('mittika_coupon');
      sessionStorage.removeItem('mittika_guest_details');
      clearCart();
      setOrderPlaced(true);
      toast.success('Order placed successfully! 🎉');
      setTimeout(() => navigate(`/order/${orderNumber}${guestToken ? `?token=${guestToken}` : ''}`), 2500);
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center max-w-md"
          >
            <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Order Placed! 🌿</h1>
            <p className="text-muted-foreground mb-2">
              Thank you for your order. Please complete your UPI payment to <strong>{UPI_ID}</strong>.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Our team will verify your payment and process your order immediately. You'll receive confirmation via WhatsApp.
            </p>
            {!user && (
              <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-sm text-foreground">
                <strong>Want order tracking?</strong>{' '}
                <button onClick={() => navigate('/auth')} className="text-primary font-semibold hover:underline">Sign up or log in</button>{' '}
                to view live order status, download invoices and track delivery.
              </div>
            )}
            <button
              onClick={() => navigate('/products')}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Continue Shopping
            </button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Payment - Mittika by Ecovia Enterprises</title>
        <meta name="description" content="Complete your Mittika order payment via UPI. Secure advance payment for premium natural herbal powders." />
      </Helmet>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">Complete Your Payment</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* QR Code & UPI Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-6 text-center"
          >
            <h2 className="font-serif text-xl font-semibold mb-4">Scan & Pay via UPI</h2>
            <div className="bg-background rounded-xl p-4 mb-4 inline-block">
              <img
                src="/images/payment-qr.jpg"
                alt="Mittika UPI Payment QR Code - sarina8223283@ptyes"
                className="w-64 h-auto mx-auto rounded-lg"
              />
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-sm font-medium text-muted-foreground">UPI ID:</span>
              <code className="bg-secondary px-3 py-1.5 rounded-lg text-sm font-mono font-bold text-foreground">
                {UPI_ID}
              </code>
              <button
                onClick={copyUPI}
                className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                title="Copy UPI ID"
              >
                {copied ? <CheckCircle size={16} className="text-primary" /> : <Copy size={16} className="text-muted-foreground" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Scan with any UPI app — Paytm, PhonePe, GPay, BHIM
            </p>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Items */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-serif text-xl font-semibold mb-4">Order Summary</h2>
              {items.length === 0 ? (
                <p className="text-muted-foreground text-sm">Your cart is empty</p>
              ) : (
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.productId} className="flex justify-between items-center text-sm">
                      <div>
                        <span className="font-medium text-foreground">{item.productName}</span>
                        <span className="text-muted-foreground ml-2">
                          ({item.quantityGrams >= 1000 ? `${item.quantityGrams/1000} Kg` : `${item.quantityGrams}g`})
                        </span>
                      </div>
                      <span className="font-semibold text-foreground">₹{(item.quantityGrams * item.pricePerGram).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-3 space-y-1.5 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                    {discount > 0 && couponData && (
                      <>
                        <div className="flex justify-between text-primary">
                          <span className="flex items-center gap-1">
                            <Tag size={12}/> Coupon ({couponData.code})
                            {couponMeta?.discount_type === 'percent' && (
                              <span className="text-[11px] bg-primary/10 px-1.5 py-0.5 rounded-full">
                                {couponMeta.discount_value}% off
                              </span>
                            )}
                          </span>
                          <span>− ₹{discount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-muted-foreground italic pl-4">
                          <span>Effective discount</span>
                          <span>{discountPercent.toFixed(1)}% off subtotal</span>
                        </div>
                      </>
                    )}
                    <div className="border-t border-border pt-2 mt-1 flex justify-between font-bold text-lg">
                      <span>Total Payable</span>
                      <span className="text-primary">₹{finalTotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <p className="text-[11px] text-primary/80 text-right">You saved ₹{discount.toFixed(2)} 🎉</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Coupon code entry — server-validated, fake codes are rejected */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-serif text-base font-semibold mb-3 flex items-center gap-2">
                <Tag size={16} className="text-primary" /> Have a coupon code?
              </h3>
              {couponData ? (
                <div className="flex items-center justify-between bg-primary/10 border border-primary/20 px-3 py-2 rounded-lg">
                  <span className="text-sm font-medium text-primary flex items-center gap-2">
                    <Tag size={14} /> {couponData.code} — ₹{couponData.discount.toFixed(2)} off
                  </span>
                  <button onClick={removeCoupon} className="text-muted-foreground hover:text-destructive" aria-label="Remove coupon">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="ENTER COUPON CODE"
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-input bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none uppercase font-mono"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={validatingCoupon || !couponInput.trim()}
                    className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
                  >
                    {validatingCoupon ? 'Checking…' : 'Apply'}
                  </button>
                </div>
              )}
              <p className="text-[11px] text-muted-foreground mt-2">Only valid coupons issued by Mittika are accepted.</p>
            </div>

            {/* Policies */}
            <div className="bg-accent/30 border border-border rounded-2xl p-5 space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground">
                  <strong>No Returns:</strong> Our products are 100% natural in pure powder form. We do not accept returns once dispatched.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Shield size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground">
                  <strong>Advance Payment:</strong> All payments must be completed in advance for on-time delivery. Orders are processed immediately once payment is received.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Truck size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground">
                  <strong>Best Value:</strong> We offer the most affordable rates compared to our premium quality assurance standards in the market.
                </p>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleConfirmPayment}
              disabled={isSubmitting || items.length === 0}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Placing Order...' : `Confirm Order — ₹${finalTotal.toFixed(2)}`}
            </button>

            {!user && (
              <p className="text-center text-sm text-muted-foreground">
                Please{' '}
                <button onClick={() => navigate('/auth')} className="text-primary font-medium hover:underline">
                  sign in
                </button>{' '}
                before placing your order.
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Payment;
