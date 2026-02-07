import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { getTestimonialsByProduct, Testimonial } from '@/data/testimonials';

interface TestimonialsSectionProps {
  productId: string;
  themeColor: string;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-muted'}
      />
    ))}
  </div>
);

const TestimonialsSection = ({ productId, themeColor }: TestimonialsSectionProps) => {
  const reviews = getTestimonialsByProduct(productId);

  if (reviews.length === 0) return null;

  return (
    <section className="py-12 bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2 text-center">
          Customer Reviews
        </h2>
        <p className="text-muted-foreground text-center mb-8">
          What our customers say about this product
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl p-6 shadow-soft relative"
            >
              <Quote 
                size={32} 
                className="absolute top-4 right-4 opacity-10"
                style={{ color: `hsl(${themeColor})` }}
              />
              <StarRating rating={review.rating} />
              <p className="text-muted-foreground text-sm mt-3 mb-4 leading-relaxed italic">
                "{review.review}"
              </p>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: `hsl(${themeColor})` }}
                >
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
