import { motion } from 'framer-motion';
import { Shield, FlaskConical, CheckCircle, FileCheck, MessageCircle, Eye, Droplets, Hand } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

const purityTests = [
  {
    product: 'Turmeric / Kasturi Haldi',
    icon: Droplets,
    tests: [
      'Water Test: Add a pinch to warm water. Pure turmeric settles slowly; adulterated turmeric floats and colors water immediately.',
      'Lemon Test: Add lemon juice to turmeric paste. Pure turmeric turns slightly orange; chemical additives turn bright red.',
      'Chalk Test: Rub on rough surface. Pure turmeric leaves a natural yellow; artificial color leaves a bright streak.',
    ],
  },
  {
    product: 'Multani Mitti (Fuller\'s Earth)',
    icon: Hand,
    tests: [
      'Touch Test: Pure Multani Mitti feels smooth, silky, and cool to touch. Gritty texture indicates sand adulteration.',
      'Water Test: Pure Multani Mitti dissolves completely in water without leaving residue.',
      'Smell Test: Pure clay has a natural, earthy smell. Chemical smell indicates processing additives.',
    ],
  },
  {
    product: 'Amla Powder',
    icon: FlaskConical,
    tests: [
      'Taste Test: Pure Amla has a distinctly sour and slightly bitter taste with no sweetness.',
      'Color Test: Natural Amla powder is greenish-brown, not bright green (which indicates artificial color).',
      'Water Test: When mixed with water, pure Amla creates a slightly slimy texture due to natural pectin.',
    ],
  },
  {
    product: 'Neem Powder',
    icon: Eye,
    tests: [
      'Smell Test: Pure Neem has a strong, bitter, characteristic odor. Lack of smell indicates old or adulterated product.',
      'Taste Test: Pure Neem is extremely bitter. Less bitterness may indicate dilution.',
      'Color Test: Should be olive green, not bright green or brown.',
    ],
  },
  {
    product: 'Rose Petal Powder',
    icon: Droplets,
    tests: [
      'Color Test: Natural rose powder is pinkish-brown, not bright pink (artificial color) or pure red.',
      'Smell Test: Should have subtle, natural rose fragrance, not overwhelming synthetic perfume.',
      'Water Test: Natural rose powder will slightly color water pink; artificial colors will create intense color immediately.',
    ],
  },
  {
    product: 'Shikakai & Ritha',
    icon: FlaskConical,
    tests: [
      'Foam Test: When mixed with water and shaken, pure Shikakai/Ritha creates natural, mild foam.',
      'Smell Test: Should have a natural, slightly woody smell. Chemical smell indicates SLS addition.',
      'pH Test: Natural Shikakai has low pH (acidic). You can test with pH strips if available.',
    ],
  },
];

const PurityVerification = () => {
  const handleRequestCertificate = () => {
    const message = `Hi! I would like to request the NABL-approved lab test certificates for Mittika products. Please share the quality testing reports.`;
    window.open(`https://wa.me/918758808684?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 sm:py-24 bg-hero-pattern relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Shield size={18} />
            Quality Assurance
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4"
          >
            Purity Verification
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg mb-8"
          >
            We believe in complete transparency. Learn how to verify the purity of your 
            herbal products at home, and request our NABL-approved lab test certificates anytime.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleRequestCertificate}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <FileCheck size={20} />
            Request Test Certificates
          </motion.button>
        </div>
      </section>

      {/* Our Promise Section */}
      <section className="py-16 sm:py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Our Quality Promise
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              At Mittika, we understand that <strong>"Price is higher because we promise Quality."</strong> Every 
              product undergoes rigorous testing at NABL-approved laboratories. We don't just claim purity—we 
              prove it with certified test reports that you can request anytime.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-background shadow-soft">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <FlaskConical size={24} className="text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-foreground mb-2">NABL Approved Labs</h3>
                <p className="text-sm text-muted-foreground">
                  All products tested at nationally accredited laboratories
                </p>
              </div>
              <div className="p-6 rounded-xl bg-background shadow-soft">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <FileCheck size={24} className="text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-foreground mb-2">Certified Reports</h3>
                <p className="text-sm text-muted-foreground">
                  Request detailed test certificates for any product
                </p>
              </div>
              <div className="p-6 rounded-xl bg-background shadow-soft">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield size={24} className="text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-foreground mb-2">100% Transparency</h3>
                <p className="text-sm text-muted-foreground">
                  Nothing to hide—ask us anything about our sourcing and testing
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Home Tests Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Home-Based Purity Tests
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Empower yourself with these simple tests you can perform at home to verify 
              the purity of your herbal products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {purityTests.map((item, index) => (
              <motion.div
                key={item.product}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-card"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <item.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground">
                    {item.product}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {item.tests.map((test, testIndex) => (
                    <li key={testIndex} className="flex gap-3">
                      <CheckCircle size={18} className="text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-sm">{test}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield size={48} className="mx-auto text-primary-foreground/80 mb-6" />
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Still Have Questions About Quality?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            We're always happy to discuss our quality standards, sourcing methods, and testing 
            procedures. Request test certificates or speak with our team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRequestCertificate}
              className="inline-flex items-center gap-2 bg-background text-foreground px-8 py-4 rounded-lg font-medium hover:bg-background/90 transition-colors"
            >
              <FileCheck size={20} />
              Request Certificates
            </button>
            <a
              href="https://wa.me/918758808684"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-primary-foreground text-primary-foreground px-8 py-4 rounded-lg font-medium hover:bg-primary-foreground/10 transition-colors"
            >
              <MessageCircle size={20} />
              Talk to Expert
            </a>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </Layout>
  );
};

export default PurityVerification;
