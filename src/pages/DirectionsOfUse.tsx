import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronUp, Leaf } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { products } from '@/data/products';
import { Link } from 'react-router-dom';

const DirectionsOfUse = () => {
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 sm:py-24 bg-hero-pattern relative overflow-hidden">
        <div className="absolute inset-0 nature-bg opacity-30" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <BookOpen size={18} />
            Usage Guide
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4"
          >
            Directions of Use
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            Learn how to get the best results from our 100% pure ayurvedic herbal powders. 
            Follow these traditional methods for maximum natural benefits.
          </motion.p>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-background rounded-xl shadow-soft">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Leaf size={24} className="text-primary" />
              </div>
              <h3 className="font-serif font-semibold text-foreground mb-2">Always Patch Test</h3>
              <p className="text-sm text-muted-foreground">Apply a small amount on your wrist and wait 24 hours before full application.</p>
            </div>
            <div className="text-center p-6 bg-background rounded-xl shadow-soft">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Leaf size={24} className="text-primary" />
              </div>
              <h3 className="font-serif font-semibold text-foreground mb-2">Consistency is Key</h3>
              <p className="text-sm text-muted-foreground">Natural remedies work best with regular use. Follow recommended frequency for 4-8 weeks.</p>
            </div>
            <div className="text-center p-6 bg-background rounded-xl shadow-soft">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Leaf size={24} className="text-primary" />
              </div>
              <h3 className="font-serif font-semibold text-foreground mb-2">Store Properly</h3>
              <p className="text-sm text-muted-foreground">Keep all powders in a cool, dry place away from direct sunlight in airtight containers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Directions */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-4">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
                className="bg-card rounded-2xl shadow-soft overflow-hidden border border-border/50"
              >
                {/* Header */}
                <button
                  onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                  className="w-full flex items-center gap-4 p-4 sm:p-6 hover:bg-secondary/30 transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 text-left">
                    <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground">
                      {product.name}
                    </h3>
                    <span 
                      className="text-xs font-medium capitalize px-2 py-0.5 rounded-full mt-1 inline-block"
                      style={{ 
                        backgroundColor: `hsl(${product.themeColor} / 0.15)`,
                        color: `hsl(${product.themeColor})`
                      }}
                    >
                      {product.category} Care
                    </span>
                  </div>
                  {expandedProduct === product.id ? (
                    <ChevronUp size={24} className="text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown size={24} className="text-muted-foreground flex-shrink-0" />
                  )}
                </button>

                {/* Expanded Content */}
                {expandedProduct === product.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="px-4 sm:px-6 pb-6"
                  >
                    <div className="border-t border-border/50 pt-4">
                      {/* Directions */}
                      <h4 className="font-semibold text-foreground mb-3">How to Use:</h4>
                      <div className="space-y-3 mb-6">
                        {product.directions.map((direction, i) => (
                          <div key={i} className="flex gap-3">
                            <span 
                              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
                              style={{ backgroundColor: `hsl(${product.themeColor})` }}
                            >
                              {i + 1}
                            </span>
                            <p className="text-muted-foreground text-sm pt-0.5">{direction}</p>
                          </div>
                        ))}
                      </div>

                      {/* Key Benefits */}
                      <h4 className="font-semibold text-foreground mb-3">Key Benefits:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                        {product.benefits.slice(0, 4).map((benefit, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Leaf size={14} className="text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-muted-foreground">{benefit}</span>
                          </div>
                        ))}
                      </div>

                      {/* Ingredients */}
                      <div className="p-3 bg-secondary/50 rounded-lg mb-4">
                        <p className="text-sm text-muted-foreground">
                          <strong className="text-foreground">Ingredients:</strong> {product.ingredients}
                        </p>
                      </div>

                      {/* Link to product */}
                      <Link
                        to={`/product/${product.id}`}
                        className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:underline"
                      >
                        View full product details →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Need Personalized Guidance?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Chat with Sarina, our AI wellness assistant, or connect with our experts for personalized usage recommendations.
          </p>
          <a
            href="https://wa.me/918758808684"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-background text-foreground px-8 py-4 rounded-lg font-medium hover:bg-background/90 transition-colors"
          >
            Talk to Our Experts
          </a>
        </div>
      </section>

      <WhatsAppButton />
    </Layout>
  );
};

export default DirectionsOfUse;
