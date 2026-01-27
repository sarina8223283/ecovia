import { motion } from 'framer-motion';
import { Leaf, Target, Heart, Award } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import aboutHero from '@/assets/about-hero.jpg';

const values = [
  {
    icon: Leaf,
    title: 'Purity',
    description: 'We source only the finest natural ingredients, ensuring every product is 100% pure and free from chemicals.',
  },
  {
    icon: Target,
    title: 'Quality',
    description: 'Rigorous quality control at every step guarantees consistent excellence in all our herbal powders.',
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
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={aboutHero}
            alt="Traditional herbal preparation"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

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
            About Mittika
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            A journey rooted in tradition, dedicated to bringing the purest 
            Ayurvedic wellness to modern lives.
          </motion.p>
        </div>
      </section>

      {/* About Ecovia */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                Ecovia Enterprises
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-6">
                The Company Behind Mittika
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Ecovia Enterprises was founded with a vision to bridge the gap 
                between ancient Ayurvedic traditions and modern wellness needs. 
                We believe that nature holds the answers to true health and beauty.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Under the guidance of our Director, <strong>Sagar Jadhav</strong>, 
                we have built a company that prioritizes authenticity, sustainability, 
                and customer satisfaction above all else.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Mittika, our flagship brand, represents our commitment to delivering 
                the highest quality herbal powders that are as effective as they are pure.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-2xl p-8 shadow-card"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Leaf className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-foreground">11+</h4>
                    <p className="text-sm text-muted-foreground">Premium Products</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-foreground">100%</h4>
                    <p className="text-sm text-muted-foreground">Natural & Pure</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-foreground">Quality</h4>
                    <p className="text-sm text-muted-foreground">Assured Products</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 sm:py-24 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl sm:text-4xl font-bold text-primary-foreground mb-6"
          >
            Our Mission
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed"
          >
            To deliver authentic, pure, and high-quality Ayurvedic herbal powders 
            that empower individuals to embrace natural wellness. We are committed 
            to preserving traditional knowledge while ensuring our products meet 
            the highest standards of purity and efficacy.
          </motion.p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-24">
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

      {/* The Mittika Promise */}
      <section className="py-16 sm:py-24 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6"
            >
              The Mittika Promise
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-4 text-muted-foreground leading-relaxed"
            >
              <p>
                Every product that bears the Mittika name is a testament to our 
                unwavering commitment to quality. From sourcing raw materials 
                from trusted farmers to using traditional processing methods, 
                we ensure that you receive only the purest herbal powders.
              </p>
              <p>
                We believe that wellness should be accessible, natural, and 
                authentic. That's why we never compromise on the quality of 
                our ingredients or cut corners in our production process.
              </p>
              <p className="font-medium text-foreground">
                When you choose Mittika, you choose purity. You choose tradition. 
                You choose nature's best.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </Layout>
  );
};

export default About;