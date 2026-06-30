import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import CanonicalSEO from '@/components/seo/CanonicalSEO';
import ProductCard from '@/components/ui/ProductCard';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { products } from '@/data/products';
import { useSiteContent, getContent } from '@/hooks/useSiteContent';
import herbalThemeBg from '@/assets/herbal-theme-bg.png';

type Category = 'all' | 'skin' | 'hair' | 'wellness';

const categories: { value: Category; label: string }[] = [
  { value: 'all', label: 'All Products' },
  { value: 'skin', label: 'Skin Care' },
  { value: 'hair', label: 'Hair Care' },
  { value: 'wellness', label: 'Wellness' },
];

const Products = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const { data: content } = useSiteContent();

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <Layout>
      <CanonicalSEO
        path="/products"
        title="All Mittika Products — Cosmetic Grade Botanical Raw Materials"
        description="Browse the complete Mittika catalogue of NABL-tested cosmetic grade botanical powders for DIY skin, hair and wellness formulations."
      />
      {/* Hero Section with strong herbal background */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={herbalThemeBg} alt="" loading="eager" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background/70" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            {getContent(content, 'products_badge', 'Mittika Collection')}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4"
          >
            {getContent(content, 'products_heading', 'Our Products')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            {getContent(content, 'products_description', 'Explore our complete range of 100% pure, natural, and chemical-free ayurvedic herbal powders for skin, hair, and wellness.')}
          </motion.p>
        </div>
      </section>

      {/* Products Grid with subtle herbal watermark */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img src={herbalThemeBg} alt="" loading="lazy" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background/80" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setActiveCategory(category.value)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {category.label}
              </button>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
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

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-4">
            {getContent(content, 'products_cta_heading', 'Interested in Our Products?')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            {getContent(content, 'products_cta_text', 'Contact us for wholesale inquiries, bulk orders, or to learn more about our product range. We\'re here to help you embrace natural wellness.')}
          </p>
          <a
            href="https://wa.me/918758808684"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Contact on WhatsApp
          </a>
        </div>
      </section>

      <WhatsAppButton />
    </Layout>
  );
};

export default Products;
