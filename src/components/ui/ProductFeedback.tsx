import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, MessageSquarePlus, Package, Truck, Gift } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Feedback {
  id: string;
  product_id: string;
  reviewer_name: string;
  reviewer_location: string | null;
  rating: number;
  product_quality: number | null;
  delivery_rating: number | null;
  packaging_rating: number | null;
  review: string;
  created_at: string;
}

interface ProductFeedbackProps {
  productId: string;
  themeColor: string;
}

const StarInput = ({ value, onChange, size = 18 }: { value: number; onChange: (v: number) => void; size?: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <button key={i} type="button" onClick={() => onChange(i)} className="focus:outline-none">
        <Star size={size} className={i <= value ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'} />
      </button>
    ))}
  </div>
);

const StarDisplay = ({ rating, size = 12 }: { rating: number; size?: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} size={size} className={i <= rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/20'} />
    ))}
  </div>
);

const ProductFeedback = ({ productId, themeColor }: ProductFeedbackProps) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', location: '', rating: 0, productQuality: 0, deliveryRating: 0, packagingRating: 0, review: ''
  });

  useEffect(() => {
    fetchFeedbacks();
  }, [productId]);

  const fetchFeedbacks = async () => {
    const { data } = await supabase
      .from('product_feedback')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .limit(20);
    if (data) setFeedbacks(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.review || form.rating === 0) {
      toast.error('Please fill name, rating and review');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('product_feedback').insert({
      product_id: productId,
      reviewer_name: form.name,
      reviewer_location: form.location || null,
      rating: form.rating,
      product_quality: form.productQuality || null,
      delivery_rating: form.deliveryRating || null,
      packaging_rating: form.packagingRating || null,
      review: form.review
    });
    setSubmitting(false);
    if (error) {
      toast.error('Failed to submit feedback');
    } else {
      toast.success('Thank you for your feedback!');
      setForm({ name: '', location: '', rating: 0, productQuality: 0, deliveryRating: 0, packagingRating: 0, review: '' });
      setShowForm(false);
      fetchFeedbacks();
    }
  };

  const avgRating = feedbacks.length > 0 
    ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1) 
    : null;

  return (
    <section className="py-12 bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">Customer Feedback</h2>
            {avgRating && (
              <div className="flex items-center gap-2 mt-1">
                <StarDisplay rating={Math.round(Number(avgRating))} size={16} />
                <span className="text-sm text-muted-foreground">{avgRating} · {feedbacks.length} review{feedbacks.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: `hsl(${themeColor})`, color: 'white' }}
          >
            <MessageSquarePlus size={16} />
            Write a Review
          </button>
        </div>

        {/* Feedback Form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="bg-card rounded-xl p-6 shadow-soft mb-8 space-y-4 overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Name *</label>
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Location</label>
                  <input
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="City, State"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-2">
                    <Star size={14} /> Overall Rating *
                  </label>
                  <StarInput value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-2">
                    <Package size={14} /> Product Quality
                  </label>
                  <StarInput value={form.productQuality} onChange={v => setForm(f => ({ ...f, productQuality: v }))} size={16} />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-2">
                    <Truck size={14} /> Delivery
                  </label>
                  <StarInput value={form.deliveryRating} onChange={v => setForm(f => ({ ...f, deliveryRating: v }))} size={16} />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-2">
                    <Gift size={14} /> Packaging
                  </label>
                  <StarInput value={form.packagingRating} onChange={v => setForm(f => ({ ...f, packagingRating: v }))} size={16} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Your Review *</label>
                <textarea
                  value={form.review}
                  onChange={e => setForm(f => ({ ...f, review: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
                  placeholder="Share your experience with this product..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: `hsl(${themeColor})` }}
              >
                <Send size={14} />
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Feedback List */}
        {feedbacks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {feedbacks.map((fb, i) => (
              <motion.div
                key={fb.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-xl p-5 shadow-soft"
              >
                <div className="flex items-center justify-between mb-2">
                  <StarDisplay rating={fb.rating} size={14} />
                  <span className="text-xs text-muted-foreground">{new Date(fb.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-muted-foreground italic mb-3 leading-relaxed">"{fb.review}"</p>
                
                {(fb.product_quality || fb.delivery_rating || fb.packaging_rating) && (
                  <div className="flex flex-wrap gap-3 mb-3 text-xs text-muted-foreground">
                    {fb.product_quality && <span className="flex items-center gap-1"><Package size={10} /> {fb.product_quality}/5</span>}
                    {fb.delivery_rating && <span className="flex items-center gap-1"><Truck size={10} /> {fb.delivery_rating}/5</span>}
                    {fb.packaging_rating && <span className="flex items-center gap-1"><Gift size={10} /> {fb.packaging_rating}/5</span>}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: `hsl(${themeColor})` }}
                  >
                    {fb.reviewer_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{fb.reviewer_name}</p>
                    {fb.reviewer_location && <p className="text-xs text-muted-foreground">{fb.reviewer_location}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No reviews yet. Be the first to share your feedback!</p>
        )}
      </div>
    </section>
  );
};

export default ProductFeedback;
