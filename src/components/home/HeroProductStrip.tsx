import { motion } from 'framer-motion';
import { products } from '@/data/products';

const HeroProductStrip = () => {
  // Duplicate for seamless scroll
  const stripProducts = [...products, ...products];

  return (
    <div className="w-full overflow-hidden py-4 bg-secondary/50 border-y border-border/30">
      <motion.div
        className="flex gap-6"
        animate={{ x: [0, -(products.length * 88)] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 30,
            ease: 'linear',
          },
        }}
      >
        {stripProducts.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            className="flex-shrink-0 flex flex-col items-center gap-1"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap max-w-[72px] truncate">
              {product.name.replace(' Powder', '')}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default HeroProductStrip;
