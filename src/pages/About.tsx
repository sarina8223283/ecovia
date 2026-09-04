import { motion } from 'framer-motion';
import {
  Leaf, Heart, Award, Shield, Globe, Users, MessageCircle, Instagram, Facebook, FileCheck,
  ExternalLink, Layout as LayoutIcon, Server, Cloud, PenTool, Globe2, AppWindow, TestTube2,
  ShoppingCart, Layers, Boxes, Smartphone, Lightbulb, Bot, Mic, FileStack,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import CanonicalSEO from '@/components/seo/CanonicalSEO';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import DemoRequestForm from '@/components/forms/DemoRequestForm';
import { Link } from 'react-router-dom';
import aboutHero from '@/assets/about-hero.jpg';
import { useSiteContent, getContent } from '@/hooks/useSiteContent';

const digitalProducts = [
  { name: 'Ecovia ERP', url: 'https://erp.ecovia.co.in', desc: 'End-to-end ERP for inventory, purchase, production, sales and finance workflows.', icon: Boxes },
  { name: 'Ecovia QMS', url: 'https://qms.ecovia.co.in', desc: 'Quality Management System digitalisation — SOPs, deviations, CAPA, audits and documents.', icon: FileStack },
  { name: 'Ecovia Web Development', url: 'https://web.ecovia.co.in', desc: 'Websites, web apps and full-stack product engineering with SEO and performance built in.', icon: Globe2 },
  { name: 'Ecovia Agents', url: 'https://agent.ecovia.co.in', desc: 'AI chatbot builders, voice agents and automation agents trained on your business data.', icon: Bot },
  { name: 'Mittika by Ecovia', url: 'https://ecovia.co.in', desc: 'Cosmetic grade clay, herbal powders and botanical raw materials — the Mittika brand.', icon: Leaf },
];

const capabilities = [
  { icon: Bot, title: 'Chatbot Builder Service', desc: 'Custom AI assistants trained on your catalogue, SOPs and customer history.' },
  { icon: Mic, title: 'Voice Agent Service', desc: 'Inbound and outbound voice agents for support, qualification and follow-ups.' },
  { icon: Smartphone, title: 'Android App Builder', desc: 'From idea to a released Android app — UX, prototype, MVP and store release.' },
  { icon: Boxes, title: 'ERP & CRM Products', desc: 'Ready ERP and CRM platforms tailored to your operations, not generic templates.' },
  { icon: FileStack, title: 'QMS Digitalisation', desc: 'Paper-based quality systems converted into audit-ready digital workflows.' },
];

const services = [
  { no: '01', title: 'Frontend Development', tagline: 'Interfaces that perform.', desc: 'Responsive web interfaces, dashboards, SaaS surfaces, admin panels and customer portals — built with Next.js, React, TypeScript and modern component systems.', stack: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'shadcn/ui'], icon: LayoutIcon },
  { no: '02', title: 'Backend Development', tagline: 'Logic that survives contact with real users.', desc: 'REST APIs, business logic, authentication, authorization, database architecture, integrations, workflow engines, background jobs and notification systems.', stack: ['FastAPI', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'], icon: Server },
  { no: '03', title: 'Hosting & Deployment', tagline: 'Production-ready, not just pushed.', desc: 'VPS and cloud deployment, Docker, reverse proxy, SSL, DNS, backups, monitoring, CI/CD, staging and production environments.', stack: ['Docker', 'Nginx', 'PM2', 'Caddy', 'GitHub Actions'], icon: Cloud },
  { no: '04', title: 'Web Designing', tagline: 'Design systems, not just screens.', desc: 'UI/UX design, design systems, responsive design, wireframes, prototypes, landing pages, dashboards, SaaS UX and ecommerce UX.', stack: ['Figma', 'Design Tokens', 'Storybook'], icon: PenTool },
  { no: '05', title: 'Website Development', tagline: 'Sites that load fast and rank well.', desc: 'Business, corporate, service, portfolio, product and lead-generation websites with SEO, performance, responsive design, CMS readiness, analytics, forms, security and maintainability.', stack: ['Next.js', 'MDX', 'Tailwind', 'Vercel/PM2'], icon: Globe2 },
  { no: '06', title: 'Web Application Development', tagline: 'Software that runs your business.', desc: 'SaaS, ERP interfaces, CRM systems, QMS systems, workflow applications, dashboards, internal business tools, customer portals and document management systems.', stack: ['Next.js', 'FastAPI', 'PostgreSQL', 'Redis', 'Zod'], icon: AppWindow },
  { no: '07', title: 'Testing & Automation', tagline: 'Ship with evidence, not hope.', desc: 'Functional, regression, API, UI, browser, responsive, accessibility and performance testing — automated in CI so quality is repeatable, not lucky.', stack: ['Playwright', 'Vitest', 'Jest', 'GitHub Actions'], icon: TestTube2 },
  { no: '08', title: 'Ecommerce Development', tagline: 'Catalogues, carts, checkout — done right.', desc: 'Product catalogue, categories, search, filters, product detail, cart, checkout, customer accounts, order management, payment & shipping integration, inventory, coupons, invoices and admin dashboard. Supports B2C, B2B and D2C.', stack: ['Next.js', 'FastAPI', 'PostgreSQL', 'Stripe/Razorpay'], icon: ShoppingCart },
  { no: '09', title: 'Full-Stack Website Development', tagline: 'UI + Frontend + Backend + Database + Auth + Deploy + Test.', desc: 'The complete lifecycle. Ecovia owns the full technical implementation — interface, frontend, backend, database, authentication, deployment and testing — so you have one accountable partner, not a stack of vendors.', stack: ['Next.js', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'], icon: Layers },
  { no: '10', title: 'Web Apps', tagline: 'Software your business actually runs on.', desc: 'A dedicated category for SaaS products, workflow systems, enterprise dashboards, customer portals, internal tools, AI-powered applications, document systems and business automation.', stack: ['Next.js', 'FastAPI', 'PostgreSQL', 'Redis'], icon: AppWindow },
  { no: '11', title: 'Android App Design & Prototype', tagline: 'Idea → UX → Prototype → MVP → Test → Release.', desc: 'Android UI design, app UX, wireframes, clickable prototypes, MVP development, API integration, authentication, push notification architecture, offline-ready architecture and app testing.', stack: ['React Native', 'Kotlin', 'Expo', 'REST'], icon: Smartphone },
  { no: '12', title: 'Your Idea → Your Apps', tagline: 'Your Idea. Your Product. Your App.', desc: 'Bring an idea, a business problem, a workflow, a sketch, an Excel sheet, an existing website or application — Ecovia turns it into research, UX, prototype, web app, Android app, backend, deployment and tested software.', stack: ['Full Ecovia stack'], icon: Lightbulb },
];

const About = () => {
  const { data: content } = useSiteContent();

  const values = [
    {
      icon: Leaf,
      title: getContent(content, 'about_value_1_title', 'Purity'),
      description: getContent(content, 'about_value_1_desc', 'We source only the finest natural ingredients, ensuring every product is 100% pure and free from chemicals.'),
    },
    {
      icon: Shield,
      title: getContent(content, 'about_value_2_title', 'Quality'),
      description: getContent(content, 'about_value_2_desc', 'Rigorous quality testing with NABL-approved labs guarantees consistent excellence in all our herbal powders.'),
    },
    {
      icon: Heart,
      title: getContent(content, 'about_value_3_title', 'Tradition'),
      description: getContent(content, 'about_value_3_desc', 'We honor ancient Ayurvedic wisdom, preserving traditional processing methods for authentic benefits.'),
    },
    {
      icon: Award,
      title: getContent(content, 'about_value_4_title', 'Sustainability'),
      description: getContent(content, 'about_value_4_desc', 'Our commitment to eco-friendly practices ensures we protect nature while harnessing its gifts.'),
    },
  ];

  const handleRequestCertificate = () => {
    const message = `Hi! I would like to request the quality test certificates for Mittika products.`;
    window.open(`https://wa.me/918758808684?text=${encodeURIComponent(message)}`, '_blank');
  };

  const discussService = (title: string) => {
    const message = `Hi Ecovia! I would like to discuss the "${title}" service.`;
    window.open(`https://wa.me/918758808684?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Layout>
      <CanonicalSEO
        path="/about"
        title="About Ecovia Enterprises — Mittika & Ecovia Digital"
        description="Ecovia Enterprises runs Ecovia Digital (ERP, QMS, Web Development, AI Agents) and Mittika — 100% pure, NABL-tested cosmetic grade botanical raw materials."
      />
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden bg-hero-pattern">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            {getContent(content, 'about_hero_badge', 'Our Story')}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6"
          >
            {getContent(content, 'about_hero_heading', 'The Luxury of Earthly Purity')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            {getContent(content, 'about_hero_description', 'Mittika by Ecovia Enterprises — Your Smart Path to Ecological Living. Bringing nature\'s purest essence directly to you.')}
          </motion.p>
        </div>
      </section>

      {/* The Ecovia Group */}
      <section className="py-16 sm:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">The Ecovia Group</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-4">Five Products, One Company</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ecovia Enterprises operates five products across two brands — <strong className="text-foreground">Ecovia Digital</strong> for software,
              AI and quality systems, and <strong className="text-foreground">Mittika</strong> for cosmetic grade clay and botanical raw materials.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {digitalProducts.map((p, i) => (
              <motion.a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group p-6 bg-card rounded-2xl shadow-soft hover:shadow-card transition-all border border-border/60"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary">
                    <p.icon size={22} />
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-foreground">{p.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{p.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:underline">
                  {p.url.replace('https://', '')} <ExternalLink size={14} />
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Ecovia Digital capabilities */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Ecovia Digital</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mt-2">What We Build</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {capabilities.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="p-6 bg-card rounded-xl shadow-soft text-center"
              >
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                  <c.icon size={24} />
                </span>
                <h3 className="font-semibold text-foreground mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services 01-12 */}
      <section className="py-16 sm:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Services</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mt-2">Twelve Ways Ecovia Delivers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.article
                key={s.no}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
                className="flex flex-col p-6 bg-card rounded-2xl shadow-soft border border-border/60"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold tracking-[0.2em] text-primary/70">SERVICE {s.no}</span>
                  <s.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-1">{s.title}</h3>
                <p className="text-sm font-medium text-primary mb-3">{s.tagline}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.desc}</p>
                <div className="flex flex-wrap gap-2 mb-5 mt-auto">
                  {s.stack.map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary">{t}</span>
                  ))}
                </div>
                <button
                  onClick={() => discussService(s.title)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <MessageCircle size={16} /> Discuss this service
                </button>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Demo request */}
      <section id="demo" className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">Book a Demo</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-3">Show us what you need</h2>
              <p className="text-muted-foreground">
                Share your phone number and, if helpful, upload screenshots or sketches of your requirement. Our team responds within 24 hours.
              </p>
            </div>
            <DemoRequestForm />
          </div>
        </div>
      </section>

      {/* Image + Story Section */}
      <section className="py-16 sm:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-elevated bg-secondary relative">
                <img src={content?.['about_hero_image']?.image_url || aboutHero} alt="Mittika natural herbal product collection" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-white drop-shadow-lg tracking-widest bg-foreground/30 backdrop-blur-sm px-6 py-3 rounded-xl">ECOVIA</span>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-2xl shadow-lg">
                <p className="font-serif text-2xl font-bold">15+</p>
                <p className="text-sm text-primary-foreground/80">Premium Products</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                {getContent(content, 'about_story_label', 'How We Collect')}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-6">
                {getContent(content, 'about_story_heading', 'From Earth to Your Hands')}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{getContent(content, 'about_story_p1', 'Every Mittika product begins its journey in the fields and forests of India, where skilled collectors handpick herbs, flowers, and plants at their peak potency. We work directly with farming communities who understand the rhythm of nature.')}</p>
                <p><strong className="text-foreground">Why we're sure about our products:</strong> {getContent(content, 'about_story_p2', 'Our quality isn\'t just promised — it\'s proven. Every batch is tested at NABL-approved laboratories before reaching you.')}</p>
                <p><strong className="text-foreground">"The Luxury of Earthly Purity"</strong> {getContent(content, 'about_story_p3', 'isn\'t just our tagline — it\'s our philosophy. We believe true luxury comes from authenticity, from products that are as pure as nature intended.')}</p>
                <p><strong className="text-foreground">Ecovia: Your Smart Path to Ecological Living</strong> — {getContent(content, 'about_story_p4', 'Our name reflects our mission: to create a path (via) that connects you to ecological (eco) wellness through smart, sustainable choices.')}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 sm:py-24 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Globe size={48} className="mx-auto text-primary-foreground/80 mb-6" />
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
              {getContent(content, 'about_vision_heading', 'Our Vision')}
            </h2>
            <p className="text-lg text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              {getContent(content, 'about_vision_text', 'To serve each customer the natural essence directly from earth. We know that today\'s conscious consumer seeks products that are truly natural, free from adverse effects, and rich in inherent benefits. Mittika exists to fulfill this need with unwavering commitment to purity.')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Ecovia Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">About Us</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-6">
                {getContent(content, 'about_ecovia_heading', 'Ecovia Enterprises')}
              </h2>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-lg leading-relaxed">
                {getContent(content, 'about_ecovia_p1', 'Ecovia Enterprises is a trusted trader and supplier of premium-quality herbal powders, natural seeds, fruit & peel extracts, clays, and essential plant-based products. We are dedicated to bringing the purity of nature to our customers by sourcing and supplying authentic, chemical-free, and finely processed herbal solutions.')}
              </p>
              <p className="text-lg leading-relaxed">
                {getContent(content, 'about_ecovia_p2', 'Mittika is dedicated to delivering quality, purity, and consistency, ensuring that our clients receive products that align with traditional Ayurvedic wisdom as well as modern herbal applications.')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <div className="text-center p-6 bg-card rounded-xl shadow-soft">
                <h4 className="font-semibold text-foreground mb-2">Company</h4>
                <p className="text-muted-foreground">{getContent(content, 'about_company_name', 'Ecovia Enterprises OPC Pvt. Ltd.')}</p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl shadow-soft">
                <h4 className="font-semibold text-foreground mb-2">Brand</h4>
                <p className="text-muted-foreground">{getContent(content, 'about_brand_name', 'MITTIKA')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">What We Stand For</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mt-2">
              {getContent(content, 'about_values_heading', 'Our Core Values')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="text-center p-6 bg-card rounded-xl shadow-soft">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 text-primary rounded-full mb-4">
                  <value.icon size={28} />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Promise Section */}
      <section className="py-16 sm:py-24 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <FileCheck size={48} className="mx-auto text-primary mb-6" />
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6">
                {getContent(content, 'about_promise_heading', 'Mittika Brand Promise')}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {getContent(content, 'about_promise_text', 'Every product that bears the Mittika name is backed by our unwavering commitment to quality assurance. We provide test certificates from NABL-approved laboratories for all our products.')}
              </p>
              <p className="text-xl font-serif font-semibold text-primary mb-8">
                {getContent(content, 'about_promise_quote', '"Our price is higher because we promise quality."')}
              </p>
              <button onClick={handleRequestCertificate} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors">
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
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Connect With Us</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="https://instagram.com/info.ecovia" target="_blank" rel="noopener noreferrer" className="p-4 bg-card rounded-xl shadow-soft hover:shadow-card transition-all flex items-center gap-3">
              <Instagram size={24} className="text-primary" />
              <span className="text-foreground font-medium">@info.ecovia</span>
            </a>
            <a href="https://www.facebook.com/share/1Bm5epz5C2/" target="_blank" rel="noopener noreferrer" className="p-4 bg-card rounded-xl shadow-soft hover:shadow-card transition-all flex items-center gap-3">
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
            {getContent(content, 'about_cta_heading', 'Ready to Experience Mittika?')}
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            {getContent(content, 'about_cta_text', 'Explore our range of pure, natural herbal powders and experience the luxury of earthly purity.')}
          </p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-background text-foreground px-8 py-4 rounded-lg font-medium hover:bg-background/90 transition-colors">
            Explore Our Products
          </Link>
        </div>
      </section>

      <WhatsAppButton />
    </Layout>
  );
};

export default About;
