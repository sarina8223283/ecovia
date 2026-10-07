import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Check,
  ClipboardCheck,
  FileCheck2,
  FlaskConical,
  MessageCircle,
  PackageCheck,
  Repeat2,
  Scale,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { products } from '@/data/products';
import { useSiteContent, getContent } from '@/hooks/useSiteContent';

const PHONE_NUMBER = '918758808684';

const b2bPillars = [
  {
    icon: BadgeCheck,
    title: 'Quality',
    description: 'Carefully sourced botanical ingredients with dependable quality for professional applications.',
  },
  {
    icon: Repeat2,
    title: 'Consistency',
    description: 'Consistent powder form, processing standards and supply specifications across repeat orders.',
  },
  {
    icon: FileCheck2,
    title: 'Documentation',
    description: 'COA, product specifications and batch traceability are available for informed procurement.',
  },
  {
    icon: Truck,
    title: 'Supply Reliability',
    description: 'Reliable fulfilment for regular supply requirements and long-term B2B relationships.',
  },
];

const documentation = [
  'Certificate of Analysis (COA)',
  'Product specifications',
  'Batch traceability',
  'Regular supply support',
];

const openWhatsApp = (message: string) => {
  window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
};

const BulkOrders = () => {
  const { data: content } = useSiteContent();

  const handleBulkQuote = () => {
    openWhatsApp(
      `Hello Ecovia Enterprises, I would like a B2B bulk quote for Mrittika botanical ingredients.\n\nProduct(s):\nQuantity required (minimum 10 kg total):\nBusiness name:\nDelivery location:\nRegular supply requirement:\nDocumentation required: COA / specifications / batch traceability\n\nPlease share pricing and availability.`,
    );
  };

  const handleSampleRequest = () => {
    openWhatsApp(
      `Hello Ecovia Enterprises, I would like to request B2B samples of Mrittika botanical ingredients.\n\nProduct(s):\nBusiness name:\nApplication or use case:\nDelivery location:\n\nI understand the samples are provided at no cost and delivery charges apply.`,
    );
  };

  return (
    <Layout>
      <section className="relative overflow-hidden bg-hero-pattern py-16 sm:py-24">
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
            >
              <Boxes size={18} />
              B2B Botanical Ingredients Supplier
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="mb-6 max-w-3xl font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Mrittika for dependable bulk ingredient supply
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="mb-8 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
            >
              Quality, consistency, documentation and supply reliability for manufacturers, formulators,
              wellness businesses, retailers and professional buyers.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Button size="lg" onClick={handleBulkQuote} className="h-12 px-6 text-base">
                <MessageCircle /> Request Bulk Quote
              </Button>
              <Button size="lg" variant="outline" onClick={handleSampleRequest} className="h-12 px-6 text-base">
                <FlaskConical /> Request B2B Samples
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card py-8">
        <div className="container mx-auto grid grid-cols-1 gap-6 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3">
            <Scale className="mt-0.5 shrink-0 text-primary" size={24} />
            <div>
              <p className="font-semibold text-foreground">10 kg minimum order</p>
              <p className="text-sm text-muted-foreground">Applied to every B2B bulk deal</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <PackageCheck className="mt-0.5 shrink-0 text-primary" size={24} />
            <div>
              <p className="font-semibold text-foreground">Powder form available</p>
              <p className="text-sm text-muted-foreground">Across the Mrittika ingredient range</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ClipboardCheck className="mt-0.5 shrink-0 text-primary" size={24} />
            <div>
              <p className="font-semibold text-foreground">Procurement documentation</p>
              <p className="text-sm text-muted-foreground">COA, specifications and traceability</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">The Mrittika B2B Standard</p>
            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Built around what professional buyers need
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {b2bPillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="bg-card p-6"
              >
                <pillar.icon className="mb-5 text-primary" size={30} />
                <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">{pillar.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/30 py-16 sm:py-20">
        <div className="container mx-auto grid grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Flexible MOQ</p>
            <h2 className="mb-5 font-serif text-3xl font-bold text-foreground sm:text-4xl">Build your 10 kg bulk order</h2>
            <p className="mb-8 leading-relaxed text-muted-foreground">
              Meet the minimum with one ingredient or combine two products. Larger and repeat requirements can be quoted
              according to quantity, availability and supply schedule.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="mb-1 text-3xl font-bold text-primary">10 kg</p>
                <p className="font-semibold text-foreground">One product</p>
                <p className="mt-1 text-sm text-muted-foreground">Choose any single powder in a minimum 10 kg quantity.</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="mb-1 text-3xl font-bold text-primary">5 kg + 5 kg</p>
                <p className="font-semibold text-foreground">Two-product mix</p>
                <p className="mt-1 text-sm text-muted-foreground">Combine two different powders to reach the 10 kg minimum.</p>
              </div>
            </div>
            <Button onClick={handleBulkQuote} className="mt-8">
              Get a Bulk Deal on WhatsApp <ArrowRight />
            </Button>
          </div>

          <div className="border-l-0 border-border lg:border-l lg:pl-12">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Samples & Documentation</p>
            <h2 className="mb-5 font-serif text-3xl font-bold text-foreground sm:text-4xl">Evaluate before regular supply</h2>
            <p className="mb-6 leading-relaxed text-muted-foreground">
              B2B samples are provided at no cost; only delivery charges apply. Tell us the ingredients and application
              you are evaluating when requesting your sample.
            </p>
            <ul className="mb-6 space-y-3">
              {documentation.map((item) => (
                <li key={item} className="flex items-center gap-3 text-foreground">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check size={14} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mb-7 flex items-start gap-3 rounded-lg border border-accent/40 bg-accent/10 p-4">
              <ShieldCheck className="mt-0.5 shrink-0 text-primary" size={22} />
              <p className="text-sm leading-relaxed text-foreground">
                Additional testing data or custom test reports can be arranged at extra cost according to your requirements.
              </p>
            </div>
            <Button variant="outline" onClick={handleSampleRequest}>
              <FlaskConical /> Request Samples on WhatsApp
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Available in Powder Form</p>
              <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                {getContent(content, 'bulk_products_heading', 'Botanical ingredients for B2B supply')}
              </h2>
            </div>
            <Link to="/products" className="inline-flex items-center gap-2 font-medium text-primary hover:underline">
              View specifications <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(index * 0.04, 0.3) }}
                className="rounded-lg border border-border bg-card p-4 text-center"
              >
                <img
                  src={product.image}
                  alt={`${product.name} powder for B2B supply`}
                  loading="lazy"
                  decoding="async"
                  className="mx-auto mb-3 h-16 w-16 rounded-full object-cover"
                />
                <p className="line-clamp-2 text-sm font-medium text-foreground">{product.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">Powder form</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 font-serif text-3xl font-bold text-primary-foreground sm:text-4xl">
            Need a dependable ingredient supply partner?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-primary-foreground/80">
            Share your products, quantities, delivery location and documentation needs for a tailored B2B quote.
          </p>
          <Button variant="secondary" size="lg" onClick={handleBulkQuote} className="h-12 px-7 text-base">
            <MessageCircle /> Request Your Bulk Quote
          </Button>
        </div>
      </section>

      <WhatsAppButton />
    </Layout>
  );
};

export default BulkOrders;