import { motion } from 'framer-motion';
import { Stethoscope } from 'lucide-react';

interface ProductCardProps {
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

const ProductCard = ({ name, description, image, category }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Category Badge */}
        <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${categoryColors[category]}`}>
          {categoryLabels[category]}
        </span>
        {/* Doctor Recommended Badge */}
        <span className="absolute top-3 right-3 flex items-center gap-1 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
          <Stethoscope size={12} />
          Doctor's Choice
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default ProductCard;