import { motion } from 'framer-motion';
import { Leaf, Heart, Award, Shield, Globe, Users, MessageCircle, Instagram, Facebook, FileCheck } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { Link } from 'react-router-dom';

const values = [
  {
    icon: Leaf,
    title: 'Purity',
    description: 'We source only the finest natural ingredients, ensuring every product is 100% pure and free from chemicals.',
  },
  {
    icon: Shield,
    title: 'Quality',
    description: 'Rigorous quality testing with NABL-approved labs guarantees consistent excellence in all our herbal powders.',
  },
  {
    icon: Heart,
    title: 'Tradition',
    description: 'We honor ancient Ayurvedic wisdom, preserving traditional processing methods for authentic benefits.',
  },
  {
    icon: Award,
    title: 'Sustainability',
    description: 'Our commitment to eco-friendly practices ensures we protect nature while harnessing its gifts.',
  },
];

const About = () => {
  const handleRequestCertificate = () => {
    const message = `Hi! I would like to request the quality test certificates for Mittika products.`;
    window.open(`https://wa.me/918758808684?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden bg-hero-pattern">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            Our Story
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6"
          >
            The Luxury of Earthly Purity
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Mittika by Ecovia Enterprises - Your Smart Path to Ecological Living. 
            Bringing nature's purest essence directly to you.
          </motion.p>
        </div>
      </section>

      {/* Image + Story Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Natural Collection Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-elevated bg-secondary">
                <img
                  src="https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80"
                  alt="Traditional herbal collection"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span className="text-xs font-medium text-foreground/70">ECOVIA</span>
                </div>
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-2xl shadow-lg">
                <p className="font-serif text-2xl font-bold">15+</p>
                <p className="text-sm text-primary-foreground/80">Premium Products</p>
              </div>
            </motion.div>

            {/* Right: Story Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                How We Collect
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-6">
                From Earth to Your Hands
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Every Mittika product begins its journey in the fields and forests of India, 
                  where skilled collectors handpick herbs, flowers, and plants at their peak potency. 
                  We work directly with farming communities who understand the rhythm of nature.
                </p>
                <p>
                  <strong className="text-foreground">Why we're sure about our products:</strong> Our quality 
                  isn't just promised—it's proven. Every batch is tested at NABL-approved laboratories 
                  before reaching you.
                </p>
                <p>
                  <strong className="text-foreground">"The Luxury of Earthly Purity"</strong> isn't just 
                  our tagline—it's our philosophy. We believe true luxury comes from authenticity, 
                  from products that are as pure as nature intended.
                </p>
                <p>
                  <strong className="text-foreground">Ecovia: Your Smart Path to Ecological Living</strong> — 
                  Our name reflects our mission: to create a path (via) that connects you to 
                  ecological (eco) wellness through smart, sustainable choices.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 sm:py-24 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Globe size={48} className="mx-auto text-primary-foreground/80 mb-6" />
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
              Our Vision
            </h2>
            <p className="text-lg text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              To serve each customer the natural essence directly from earth. We know that 
              today's conscious consumer seeks products that are truly natural, free from 
              adverse effects, and rich in inherent benefits. Mittika exists to fulfill 
              this need with unwavering commitment to purity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Ecovia Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                About Us
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-6">
                Ecovia Enterprises
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="prose prose-lg max-w-none text-muted-foreground"
            >
              <p className="text-lg leading-relaxed">
                <strong className="text-foreground">Ecovia Enterprises</strong> is a trusted trader and 
                supplier of premium-quality herbal powders, natural seeds, fruit & peel extracts, clays, 
                and essential plant-based products. We are dedicated to bringing the purity of nature to 
                our customers by sourcing and supplying authentic, chemical-free, and finely processed 
                herbal solutions.
              </p>
              <p className="text-lg leading-relaxed">
                <strong className="text-foreground">Mittika</strong> is dedicated to delivering quality, 
                purity, and consistency, ensuring that our clients receive products that align with 
                traditional Ayurvedic wisdom as well as modern herbal applications. Whether for personal 
                care, wellness, or industrial use, our products are crafted to support a healthier and 
                more natural lifestyle.
              </p>
            </motion.div>

            {/* Company Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6 bg-card rounded-xl shadow-soft">
                <h4 className="font-semibold text-foreground mb-2">Company</h4>
                <p className="text-muted-foreground">Ecovia Enterprises</p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl shadow-soft">
                <h4 className="font-semibold text-foreground mb-2">Brand</h4>
                <p className="text-muted-foreground">MITTIKA</p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl shadow-soft">
                <h4 className="font-semibold text-foreground mb-2">Director</h4>
                <p className="text-muted-foreground">Sagar Jadhav</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              What We Stand For
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mt-2">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 bg-card rounded-xl shadow-soft"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 text-primary rounded-full mb-4">
                  <value.icon size={28} />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Promise Section */}
      <section className="py-16 sm:py-24 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <FileCheck size={48} className="mx-auto text-primary mb-6" />
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Mittika Brand Promise
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Every product that bears the Mittika name is backed by our unwavering 
                commitment to quality assurance. We provide test certificates from 
                NABL-approved laboratories for all our products.
              </p>
              <p className="text-xl font-serif font-semibold text-primary mb-8">
                "Our price is higher because we promise quality."
              </p>
              <button
                onClick={handleRequestCertificate}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <MessageCircle size={20} />
                Request Test Certificates via WhatsApp
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Links Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
            Connect With Us
          </h2>
          <div className="flex justify-center gap-4">
            <a
              href="https://instagram.com/info.ecovia"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-card rounded-xl shadow-soft hover:shadow-card transition-all flex items-center gap-3"
            >
              <Instagram size={24} className="text-primary" />
              <span className="text-foreground font-medium">@info.ecovia</span>
            </a>
            <a
              href="https://www.facebook.com/share/1Bm5epz5C2/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-card rounded-xl shadow-soft hover:shadow-card transition-all flex items-center gap-3"
            >
              <Facebook size={24} className="text-primary" />
              <span className="text-foreground font-medium">Ecovia Enterprises</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Users size={48} className="mx-auto text-primary-foreground/80 mb-6" />
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Experience Mittika?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Explore our range of pure, natural herbal powders and experience 
            the luxury of earthly purity.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-background text-foreground px-8 py-4 rounded-lg font-medium hover:bg-background/90 transition-colors"
          >
            Explore Our Products
          </Link>
        </div>
      </section>

      <WhatsAppButton />
    </Layout>
  );
};

export default About;
