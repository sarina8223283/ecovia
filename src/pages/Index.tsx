import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Shield, Heart } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/ui/ProductCard';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import HeroProductStrip from '@/components/home/HeroProductStrip';
import { products } from '@/data/products';
import heroBanner from '@/assets/hero-banner.jpg';

const Index = () => {
  const featuredProducts = products.slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-earth/5">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBanner}
            alt="Natural herbal powders"
            className="w-full h-full object-cover opacity-100"
          />
          {/* Gradient overlay for better text readability and vibrant look */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-6 shadow-lg backdrop-blur-sm"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              100% Pure & Natural
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-[1.1] drop-shadow-sm"
            >
              Experience the <br/>
              <span className="text-primary relative inline-block">
                Luxury
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span> of <br/>
              Earthly Purity
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl sm:text-2xl text-foreground/80 mb-10 leading-relaxed font-light max-w-2xl"
            >
              Mittika brings you authentic, chemical-free herbal powders rooted in 
              ancient Ayurvedic traditions. Elevate your wellness journey naturally.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-medium hover:bg-primary/90 hover:scale-105 transition-all shadow-xl shadow-primary/20"
              >
                Explore Collection
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-md text-foreground border border-foreground/10 px-8 py-4 rounded-xl text-lg font-medium hover:bg-white/80 transition-all"
              >
                Our Story
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Image Strip */}
      <HeroProductStrip />

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Leaf,
                title: '100% Natural',
                description: 'Pure herbal powders sourced directly from nature, with no chemicals or additives.',
              },
              {
                icon: Shield,
                title: 'Quality Assured',
                description: 'Rigorous quality testing ensures every product meets the highest purity standards.',
              },
              {
                icon: Heart,
                title: 'Traditional Wisdom',
                description: 'Recipes passed down through generations of Ayurvedic practitioners.',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 text-primary rounded-full mb-4">
                  <feature.icon size={28} />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-primary font-medium text-sm uppercase tracking-wider"
            >
              Our Collection
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-4"
            >
              Featured Products
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              Discover our handpicked selection of premium ayurvedic powders, 
              carefully crafted for your natural beauty and wellness needs.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                image={product.image}
                category={product.category}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
            >
              View All Products
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 sm:py-24 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                About Mittika
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-6">
                Rooted in Nature, Crafted with Care
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Mittika, by Ecovia Enterprises, is dedicated to bringing you the 
                purest form of Ayurvedic wellness. Our products are sourced from 
                trusted farmers who share our commitment to sustainability and quality.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Every powder is processed using traditional methods to preserve 
                the natural potency of herbs, ensuring you receive authentic 
                benefits passed down through generations.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Learn More About Us
                <ArrowRight size={18} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-6">
                  <Link to={`/product/${products[0].id}`}>
                    <img
                      src={products[0].image}
                      alt={products[0].name}
                      loading="lazy"
                      decoding="async"
                      className="w-full aspect-square object-cover rounded-xl shadow-card hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <Link to={`/product/${products[4].id}`}>
                    <img
                      src={products[4].image}
                      alt={products[4].name}
                      loading="lazy"
                      decoding="async"
                      className="w-full aspect-[4/3] object-cover rounded-xl shadow-card hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
                <div className="flex flex-col gap-6 pt-8">
                  <Link to={`/product/${products[3].id}`}>
                    <img
                      src={products[3].image}
                      alt={products[3].name}
                      loading="lazy"
                      decoding="async"
                      className="w-full aspect-[4/3] object-cover rounded-xl shadow-card hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <Link to={`/product/${products[9].id}`}>
                    <img
                      src={products[9].image}
                      alt={products[9].name}
                      loading="lazy"
                      decoding="async"
                      className="w-full aspect-square object-cover rounded-xl shadow-card hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl sm:text-4xl font-bold text-primary-foreground mb-4"
          >
            Ready to Experience Natural Wellness?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto"
          >
            Connect with us to explore our complete range of authentic Ayurvedic powders.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-background text-foreground px-8 py-4 rounded-lg font-medium hover:bg-background/90 transition-colors"
            >
              Contact Us Today
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <WhatsAppButton />
    </Layout>
  );
};

export default Index;
