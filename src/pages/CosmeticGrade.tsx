import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Sparkles, Leaf, Heart, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/ui/ProductCard';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { products } from '@/data/products';
import { getClassification } from '@/data/classification';

type Cat = 'skin' | 'hair' | 'wellness' | 'all';

const meta: Record<Exclude<Cat, 'all'>, { title: string; icon: any; tag: string; copy: string }> = {
  skin: {
    title: 'Cosmetic Grade Skin Care Raw Materials',
    icon: Sparkles,
    tag: 'Skin Care · Cosmetic Grade',
    copy: 'Single-ingredient botanical powders and clays for DIY face packs, ubtans, soap making and cosmetic formulations. 100% pure, NABL-tested, external use only.',
  },
  hair: {
    title: 'Cosmetic Grade Hair Care Raw Materials',
    icon: Leaf,
    tag: 'Hair Care · Cosmetic Grade',
    copy: 'Ayurvedic hair-care botanicals — Amla, Shikakai, Reetha, Bhringraj, Hibiscus, Brahmi, Onion, Rosemary — milled for DIY shampoo blends, scalp pastes, hair masks and oil infusions.',
  },
  wellness: {
    title: 'Cosmetic Grade Botanical Wellness Powders',
    icon: Heart,
    tag: 'Wellness · Cosmetic Grade',
    copy: 'Antioxidant-rich botanical powders for DIY cosmetic and topical wellness formulations. External cosmetic use only.',
  },
};

const CosmeticGrade = () => {
  const { category } = useParams<{ category?: string }>();
  const cat = (category ?? 'all') as Cat;
  if (cat !== 'all' && !['skin', 'hair', 'wellness'].includes(cat)) {
    return <Navigate to="/cosmetic-grade" replace />;
  }

  const filtered = cat === 'all' ? products : products.filter(p => p.category === cat);
  const baseUrl = 'https://ecovia.co.in';
  const pageUrl = cat === 'all' ? `${baseUrl}/cosmetic-grade` : `${baseUrl}/cosmetic-grade/${cat}`;

  const heading = cat === 'all'
    ? 'Mittika Cosmetic Grade Botanical Raw Materials'
    : meta[cat].title;
  const intro = cat === 'all'
    ? 'The complete Mittika catalogue of premium cosmetic-grade botanical raw materials — single-ingredient powders for DIY skin care, hair care, soap making and cosmetic formulations. 100% pure, NABL-tested, external use only.'
    : meta[cat].copy;

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: heading,
    description: intro,
    url: pageUrl,
    numberOfItems: filtered.length,
    itemListElement: filtered.map((p, i) => {
      const c = getClassification(p.id);
      return {
        '@type': 'ListItem',
        position: i + 1,
        url: `${baseUrl}/product/${p.id}`,
        name: c?.botanicalName ? `${p.name} — ${c.botanicalName} (Cosmetic Grade Botanical Raw Material)` : `${p.name} (Cosmetic Grade Botanical Raw Material)`,
      };
    }),
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Cosmetic Grade', item: `${baseUrl}/cosmetic-grade` },
      ...(cat !== 'all' ? [{ '@type': 'ListItem', position: 3, name: meta[cat].title, item: pageUrl }] : []),
    ],
  };

  const Icon = cat !== 'all' ? meta[cat].icon : Leaf;

  return (
    <Layout>
      <Helmet>
        <title>{heading} | Mittika by Ecovia Enterprises</title>
        <meta name="description" content={intro} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={heading} />
        <meta property="og:description" content={intro} />
        <meta property="og:url" content={pageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={heading} />
        <meta name="twitter:description" content={intro} />
        <script type="application/ld+json">{JSON.stringify(itemList)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <section className="py-16 sm:py-24 bg-hero-pattern">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Icon size={16} />
            {cat === 'all' ? 'Cosmetic Grade · 15 SKUs' : meta[cat].tag}
          </motion.span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4 max-w-3xl mx-auto">
            {heading}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">{intro}</p>

          {cat === 'all' && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {(['skin', 'hair', 'wellness'] as const).map(c => (
                <Link key={c} to={`/cosmetic-grade/${c}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition">
                  {meta[c].title.replace('Cosmetic Grade ', '')} <ArrowRight size={14} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <ProductCard id={product.id} name={product.name} description={product.description} image={product.image} category={product.category} />
              </motion.div>
            ))}
          </div>

          {/* AI-friendly classification recap */}
          <div className="mt-16 prose prose-sm max-w-3xl mx-auto text-muted-foreground">
            <h2 className="font-serif text-2xl text-foreground">About Cosmetic Grade Botanical Raw Materials</h2>
            <p>
              Every Mittika SKU on this page is supplied as a <strong>Cosmetic Grade Botanical Raw Material</strong> —
              a single-ingredient powder with no additives or preservatives, intended for external use only in DIY
              skin care, hair care, soap making, and cosmetic formulations. We do not sell food, supplements, or
              ingestible products. Each batch is NABL-tested for purity and milled in small lots to preserve
              colour and aroma.
            </p>
            <ul>
              <li><strong>Format:</strong> Finely milled single-ingredient powder</li>
              <li><strong>Use:</strong> External cosmetic / topical DIY formulations</li>
              <li><strong>Audience:</strong> DIY formulators, soap makers, indie cosmetic brands, beauty enthusiasts</li>
              <li><strong>Testing:</strong> NABL-tested purity</li>
            </ul>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </Layout>
  );
};

export default CosmeticGrade;