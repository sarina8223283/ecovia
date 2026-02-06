import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Leaf, Heart } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/ui/ProductCard';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { products } from '@/data/products';

const categories = [
  {
    id: 'skin',
    name: 'Skin Care',
    description: 'Radiant skin with nature\'s best clays, flowers, and herbs',
    icon: Sparkles,
    color: 'from-amber-400 to-orange-500',
    bgColor: 'bg-amber-50',
    products: products.filter(p => p.category === 'skin'),
  },
  {
    id: 'hair',
    name: 'Hair Care',
    description: 'Luscious locks with traditional Ayurvedic hair herbs',
    icon: Leaf,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    products: products.filter(p => p.category === 'hair'),
  },
  {
    id: 'wellness',
    name: 'Wellness',
    description: 'Inner health and vitality with superfood powders',
    icon: Heart,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    products: products.filter(p => p.category === 'wellness'),
  },
];

const ShopByCategory = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 sm:py-24 bg-hero-pattern">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            Explore Our Collections
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4"
          >
            Shop by Category
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            Discover our curated collections of 100% pure, natural herbal powders 
            organized for your specific wellness needs.
          </motion.p>
        </div>
      </section>

      {/* Categories */}
      {categories.map((category, categoryIndex) => (
        <section key={category.id} className={`py-16 ${categoryIndex % 2 === 1 ? 'bg-secondary/30' : ''}`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center gap-4 mb-10"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                <category.icon size={32} className="text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="font-serif text-3xl font-bold text-foreground">
                  {category.name}
                </h2>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
              <div className="sm:ml-auto">
                <span className="text-sm text-muted-foreground bg-secondary px-4 py-2 rounded-full">
                  {category.products.length} Products
                </span>
              </div>
            </motion.div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    description={product.description}
                    image={product.image}
                    category={product.category}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Contact us for custom orders, bulk quantities, or to learn about our full product range.
          </p>
          <a
            href="https://wa.me/918758808684"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-background text-foreground px-8 py-4 rounded-lg font-medium hover:bg-background/90 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>

      <WhatsAppButton />
    </Layout>
  );
};

export default ShopByCategory;
