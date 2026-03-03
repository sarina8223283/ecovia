import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { productPricing } from '@/data/pricing';

interface ProductCardProps {
  id?: string;
  name: string;
  description: string;
  image: string;
  category: 'skin' | 'hair' | 'wellness';
}

const categoryColors = {
  skin: 'bg-earth-light/20 text-earth',
  hair: 'bg-primary/10 text-primary',
  wellness: 'bg-leaf-light/20 text-leaf',
};

const categoryLabels = {
  skin: 'Skin Care',
  hair: 'Hair Care',
  wellness: 'Wellness',
};

const ProductCard = ({ id, name, description, image, category }: ProductCardProps) => {
  const CardWrapper = id ? Link : 'div';
  const wrapperProps = id ? { to: `/product/${id}` } : {};
  
  // Get pricing for the product (show 100g price as default)
  const pricing = id ? productPricing[id] : null;
  const defaultTier = pricing?.find(t => t.grams === 100);

  return (
    <CardWrapper {...wrapperProps as any}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="group bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 cursor-pointer h-full"
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <img
            src={image}
            alt={name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Category Badge */}
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${categoryColors[category]}`}>
            {categoryLabels[category]}
          </span>
          {/* Most Loved Badge */}
          <span className="absolute top-3 right-3 flex items-center gap-1 bg-rose-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            <Heart size={12} fill="currentColor" />
            Most Loved
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
            {description}
          </p>
          
          {/* Pricing */}
          {defaultTier && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground line-through">
                ₹{defaultTier.originalPrice}
              </span>
              <span className="text-lg font-bold text-primary">
                ₹{defaultTier.discountedPrice}
              </span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {defaultTier.discountPercent}% off
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </CardWrapper>
  );
};

export default ProductCard;
