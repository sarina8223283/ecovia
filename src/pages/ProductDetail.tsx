import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, ShoppingBag, Check, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import TestimonialsSection from '@/components/ui/TestimonialsSection';
import ProductFeedback from '@/components/ui/ProductFeedback';
import { getProductById, products } from '@/data/products';
import { productPricing } from '@/data/pricing';
import { getClassification } from '@/data/classification';
import ProductClassification from '@/components/product/ProductClassification';
import { useCart } from '@/contexts/CartContext';
import { useSiteContent } from '@/hooks/useSiteContent';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || '');
  const { addItem } = useCart();
  const navigate = useNavigate();
  const { data: siteContent } = useSiteContent();
  const [selectedQuantity, setSelectedQuantity] = useState(100);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Build carousel media: main image (0), 2nd image (1), VIDEO at 3rd position (2 — Sarina manageable),
  // then remaining additional images. Each item is { type: 'image' | 'video', src }.
  const carouselMedia = useMemo(() => {
    if (!product) return [] as Array<{ type: 'image' | 'video'; src: string }>;
    const media: Array<{ type: 'image' | 'video'; src: string }> = [
      { type: 'image', src: product.image },
    ];
    const getEntry = (k: string) => {
      const e = siteContent?.[k];
      return e?.image_url || (e?.content_value && /^https?:\/\//.test(e.content_value) ? e.content_value : null);
    };
    // 2nd image slot
    const img1 = getEntry(`${id}_image_1`);
    if (img1) media.push({ type: 'image', src: img1 });
    // 3rd slot = video (Sarina uploads to {id}_video_1)
    const video1 = getEntry(`${id}_video_1`);
    if (video1) media.push({ type: 'video', src: video1 });
    // Remaining images
    for (let i = 2; i <= 10; i++) {
      const v = getEntry(`${id}_image_${i}`);
      if (v) media.push({ type: 'image', src: v });
    }
    const v2 = getEntry(`${id}_video_2`);
    if (v2) media.push({ type: 'video', src: v2 });
    return media;
  }, [product, siteContent, id]);
  const carouselImages = carouselMedia; // alias to minimize downstream changes

  // Get AI-generated images for this product
  const benefitsImageUrl = siteContent?.[`${id}_benefits_image`]?.image_url;
  const comparisonImageUrl = siteContent?.[`${id}_comparison_image`]?.image_url;
  const midPageBannerUrl = siteContent?.[`${id}_mid_page_banner`]?.image_url || siteContent?.[`${id}_mid_page_banner`]?.content_value;

  // Get pricing tiers for this product
  const pricingTiers = id ? productPricing[id] || [] : [];
  const selectedTier = pricingTiers.find(t => t.grams === selectedQuantity);
  const classification = id ? getClassification(id) : undefined;

  if (!product) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-serif font-bold mb-4">Product Not Found</h1>
            <Link to="/products" className="text-primary hover:underline">
              ← Back to Products
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    if (!selectedTier) return;
    addItem({
      productId: product.id,
      productName: product.name,
      quantityGrams: selectedQuantity,
      pricePerGram: selectedTier.discountedPrice / selectedTier.grams,
      image: product.image
    });
    toast.success(`Added ${product.name} to cart!`);
  };

  const handleBuyNow = () => {
    if (!selectedTier) return;
    addItem({
      productId: product.id,
      productName: product.name,
      quantityGrams: selectedQuantity,
      pricePerGram: selectedTier.discountedPrice / selectedTier.grams,
      image: product.image,
    });
    navigate('/checkout');
  };

  // FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": product.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // Product Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": classification
      ? `${product.name} — ${classification.grade}. ${classification.intendedUse} ${product.description}`
      : product.description,
    "category": classification?.grade || 'Cosmetic Grade Botanical Raw Material',
    "image": product.image,
    "material": classification?.partUsed,
    "audience": {
      "@type": "PeopleAudience",
      "audienceType": "DIY formulators, soap makers, cosmetic brands, beauty enthusiasts"
    },
    "additionalProperty": classification ? [
      { "@type": "PropertyValue", "name": "Grade", "value": classification.grade },
      { "@type": "PropertyValue", "name": "Intended Use", "value": classification.intendedUse },
      { "@type": "PropertyValue", "name": "Applications", "value": classification.applications.join(', ') },
      { "@type": "PropertyValue", "name": "Format", "value": classification.formats.join(', ') },
      { "@type": "PropertyValue", "name": "External Use Only", "value": classification.externalUseOnly ? 'Yes' : 'No' },
      ...(classification.botanicalName ? [{ "@type": "PropertyValue", "name": "Botanical Name", "value": classification.botanicalName }] : []),
      ...(classification.partUsed ? [{ "@type": "PropertyValue", "name": "Part Used", "value": classification.partUsed }] : []),
    ] : undefined,
    "brand": {
      "@type": "Brand",
      "name": "Mittika"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Ecovia Enterprises"
    },
    "offers": selectedTier ? {
      "@type": "Offer",
      "price": selectedTier.discountedPrice,
      "priceCurrency": "INR"
    } : undefined
  };

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const ogDescription = classification
    ? `${product.name} — ${classification.grade}${classification.botanicalName ? ` (${classification.botanicalName})` : ''}. ${classification.intendedUse} Applications: ${classification.applications.slice(0, 3).join(', ')}. By Mittika · Ecovia Enterprises.`
    : product.description;
  const ogTitle = `${product.name}${classification?.botanicalName ? ` — ${classification.botanicalName}` : ''} | Mittika`;
  const productUrl = `https://ecovia.co.in/product/${product.id}`;
  const absoluteImage = product.image.startsWith('http')
    ? product.image
    : `https://ecovia.co.in${product.image.startsWith('/') ? '' : '/'}${product.image}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ecovia.co.in/" },
      { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://ecovia.co.in/products" },
      { "@type": "ListItem", "position": 3, "name": `${product.category.charAt(0).toUpperCase() + product.category.slice(1)} Care`, "item": `https://ecovia.co.in/shop-by-category?category=${product.category}` },
      { "@type": "ListItem", "position": 4, "name": product.name, "item": productUrl },
    ],
  };

  return (
    <Layout>
      <Helmet>
        <title>{product.name} | Mittika by Ecovia Enterprises</title>
        <meta
          name="description"
          content={ogDescription}
        />
        {classification && (
          <meta name="keywords" content={classification.keywords.join(', ')} />
        )}
        <link rel="canonical" href={productUrl} />
        {/* Open Graph */}
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="Mittika by Ecovia Enterprises" />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:url" content={productUrl} />
        <meta property="og:image" content={absoluteImage} />
        <meta property="og:image:alt" content={`${product.name} — ${classification?.grade || 'Mittika herbal powder'}`} />
        <meta property="og:locale" content="en_IN" />
        <meta property="product:brand" content="Mittika" />
        <meta property="product:availability" content="in stock" />
        <meta property="product:condition" content="new" />
        <meta property="product:category" content={classification?.grade || 'Cosmetic Grade Botanical Raw Material'} />
        {selectedTier && (
          <>
            <meta property="product:price:amount" content={String(selectedTier.discountedPrice)} />
            <meta property="product:price:currency" content="INR" />
          </>
        )}
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@ecovia_india" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={absoluteImage} />
        <meta name="twitter:image:alt" content={`${product.name} — Mittika`} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      {/* Themed Background */}
      <div 
        className="fixed inset-0 -z-10 opacity-5"
        style={{ 
          background: `linear-gradient(135deg, hsl(${product.themeColor}) 0%, hsl(var(--background)) 50%, hsl(${product.themeColor} / 0.3) 100%)`
        }}
      />

      {/* Breadcrumb */}
      <section className="py-4 border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Products
          </Link>
        </div>
      </section>

      {/* Product Hero */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              {/* Main Image with Carousel */}
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-elevated">
                <AnimatePresence mode="wait">
                  {carouselMedia[currentImageIndex]?.type === 'video' ? (
                    <motion.video
                      key={currentImageIndex}
                      src={carouselMedia[currentImageIndex].src}
                      controls
                      playsInline
                      preload="metadata"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full object-cover bg-black"
                    />
                  ) : (
                    <motion.img
                      key={currentImageIndex}
                      src={carouselMedia[currentImageIndex]?.src || product.image}
                      alt={`${product.name} - Image ${currentImageIndex + 1}`}
                      loading="eager"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full object-cover"
                    />
                  )}
                </AnimatePresence>
                {/* Mittika Brand */}
                <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span className="text-xs font-serif font-semibold text-primary">MITTIKA</span>
                </div>
                {/* 100% Natural Badge */}
                <div 
                  className="absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg"
                  style={{ backgroundColor: `hsl(${product.themeColor})` }}
                >
                  100% Natural
                </div>
                {/* Carousel Navigation Arrows */}
                {carouselImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev === 0 ? carouselImages.length - 1 : prev - 1)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-background transition-colors"
                    >
                      <ChevronLeft size={20} className="text-foreground" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev === carouselImages.length - 1 ? 0 : prev + 1)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-background transition-colors"
                    >
                      <ChevronRight size={20} className="text-foreground" />
                    </button>
                  </>
                )}
              </div>
              {/* Thumbnail Strip */}
              {carouselImages.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {carouselMedia.map((m, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        idx === currentImageIndex ? 'border-primary shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      {m.type === 'video' ? (
                        <div className="relative w-full h-full bg-black">
                          <video src={m.src} className="w-full h-full object-cover" muted preload="metadata" />
                          <span className="absolute inset-0 flex items-center justify-center text-white text-xl">▶</span>
                        </div>
                      ) : (
                        <img src={m.src} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span 
                className="inline-block w-fit px-3 py-1 rounded-full text-xs font-medium mb-4 capitalize"
                style={{ 
                  backgroundColor: `hsl(${product.themeColor} / 0.15)`,
                  color: `hsl(${product.themeColor})`
                }}
              >
                {product.category} Care
              </span>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                {product.name}
              </h1>

              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {product.fullDescription}
              </p>

              {/* Quantity Selector with Pricing */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Select Quantity
                </label>
                <div className="flex flex-wrap gap-2">
                  {pricingTiers.map(tier => (
                    <button
                      key={tier.grams}
                      onClick={() => setSelectedQuantity(tier.grams)}
                      className={`flex flex-col items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedQuantity === tier.grams
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      <span>{tier.label}</span>
                      <span className="text-xs opacity-80">₹{tier.discountedPrice}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Display */}
              {selectedTier && (
                <div className="mb-6 p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{selectedTier.originalPrice}
                    </span>
                    <span className="text-3xl font-bold text-foreground">
                      ₹{selectedTier.discountedPrice}
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                      {selectedTier.discountPercent}% OFF
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You save ₹{selectedTier.originalPrice - selectedTier.discountedPrice}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedTier}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50"
                >
                  <Plus size={20} />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!selectedTier}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <ShoppingBag size={20} />
                  Buy Now
                </button>
              </div>

              {/* Ingredients */}
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <h4 className="font-medium text-foreground mb-1">Ingredients</h4>
                <p className="text-sm text-muted-foreground">{product.ingredients}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
            Key Benefits
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-lg bg-card shadow-sm"
              >
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `hsl(${product.themeColor})` }}
                >
                  <Check size={14} className="text-white" />
                </div>
                <span className="text-foreground">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI-Generated Benefits Infographic */}
      {benefitsImageUrl && (
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
              Benefits at a Glance
            </h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <img
                src={benefitsImageUrl}
                alt={`${product.name} benefits infographic`}
                loading="lazy"
                onError={(e) => { (e.currentTarget.parentElement?.parentElement as HTMLElement | null)?.style.setProperty('display','none'); }}
                className="w-full rounded-2xl shadow-elevated border border-border"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* AI-Generated Comparison Image */}
      {comparisonImageUrl && (
        <section className="py-12 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
              Mittika vs Others
            </h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <img
                src={comparisonImageUrl}
                alt={`${product.name} - Mittika vs generic comparison`}
                loading="lazy"
                onError={(e) => { (e.currentTarget.closest('section') as HTMLElement | null)?.style.setProperty('display','none'); }}
                className="w-full rounded-2xl shadow-elevated border border-border"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Mid-Page Banner (Sarina-manageable via {product_id}_mid_page_banner) */}
      {midPageBannerUrl && (
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <img
                src={midPageBannerUrl}
                alt={`${product.name} promotional banner`}
                loading="lazy"
                onError={(e) => { (e.currentTarget.closest('section') as HTMLElement | null)?.style.setProperty('display','none'); }}
                className="w-full rounded-2xl shadow-elevated border border-border"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Product Classification — AI-search optimised, compliance-aligned */}
      {classification && (
        <ProductClassification
          productName={product.name}
          classification={classification}
          themeColor={product.themeColor}
        />
      )}

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
            How to Use
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {product.directions.map((direction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-4 rounded-lg bg-card shadow-sm"
              >
                <span 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white"
                  style={{ backgroundColor: `hsl(${product.themeColor})` }}
                >
                  {index + 1}
                </span>
                <p className="text-foreground pt-1">{direction}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <TestimonialsSection productId={product.id} themeColor={product.themeColor} />

      {/* Customer Feedback */}
      <ProductFeedback productId={product.id} themeColor={product.themeColor} />

      {/* FAQ Section */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {product.faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-lg bg-background border border-border overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors"
                >
                  <span className="font-medium text-foreground pr-4">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp size={20} className="text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown size={20} className="text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map(relatedProduct => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="group rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-card transition-all"
                >
                  <div className="aspect-square overflow-hidden relative">
                    <img 
                      src={relatedProduct.image} 
                      alt={relatedProduct.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-foreground text-sm line-clamp-1">
                      {relatedProduct.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <WhatsAppButton />
    </Layout>
  );
};

export default ProductDetail;
