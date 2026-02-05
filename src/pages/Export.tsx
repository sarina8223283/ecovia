 import { motion } from 'framer-motion';
 import { Globe, Ship, Shield, Award, FileCheck, MessageCircle, Check, ArrowRight } from 'lucide-react';
 import Layout from '@/components/layout/Layout';
 import WhatsAppButton from '@/components/ui/WhatsAppButton';
 import { products } from '@/data/products';
 import { Link } from 'react-router-dom';
 
 const exportCredentials = [
   { icon: FileCheck, title: 'FSSAI Certified', description: 'Food Safety and Standards Authority of India registered' },
   { icon: Shield, title: 'GMP Compliant', description: 'Good Manufacturing Practices certified facility' },
   { icon: Award, title: 'ISO Standards', description: 'International quality management standards' },
   { icon: Globe, title: 'Export Ready', description: 'Documentation and compliance for international shipping' },
 ];
 
 const exportBenefits = [
   'Competitive FOB/CIF pricing',
   'Private labeling and white label options',
   'Custom packaging as per destination requirements',
   'All export documentation handled',
   'Quality certificates and COA provided',
   'Regular shipment scheduling',
   'Dedicated export relationship manager',
   'Sample shipments available',
 ];
 
 const targetMarkets = [
   'United States', 'United Kingdom', 'Germany', 'France', 
   'Australia', 'Canada', 'UAE', 'Singapore', 'Japan', 'South Korea'
 ];
 
 const Export = () => {
   const handleExportInquiry = () => {
     const message = `Hi! I'm interested in importing Mittika products.\n\n*Company Details:*\n• Company Name: \n• Country: \n• Products Interested: \n• Estimated Quantity: \n\nPlease share your export catalog and pricing.`;
     window.open(`https://wa.me/918758808684?text=${encodeURIComponent(message)}`, '_blank');
   };
 
   return (
     <Layout>
       {/* Hero Section */}
       <section className="py-16 sm:py-24 bg-hero-pattern relative overflow-hidden">
         <div className="absolute inset-0 opacity-5">
           <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-primary blur-3xl" />
           <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-accent blur-3xl" />
         </div>
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
           >
             <Globe size={18} />
             International Export
           </motion.div>
           <motion.h1
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4"
           >
             Export Premium Indian <br />Herbal Products Worldwide
           </motion.h1>
           <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-muted-foreground max-w-2xl mx-auto text-lg mb-8"
           >
             Partner with Ecovia Enterprises for authentic Ayurvedic herbal powders. 
             We handle all export documentation and ensure international quality compliance.
           </motion.p>
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="flex flex-col sm:flex-row gap-4 justify-center"
           >
             <button
               onClick={handleExportInquiry}
               className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
             >
               <MessageCircle size={20} />
               Export Inquiry
             </button>
             <a
               href="mailto:info@ecovia.co.in?subject=Export Inquiry"
               className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-4 rounded-lg font-medium hover:bg-primary/10 transition-colors"
             >
               Email: info@ecovia.co.in
             </a>
           </motion.div>
         </div>
       </section>
 
       {/* Credentials */}
       <section className="py-16 sm:py-20">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
             <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
               Our Export Credentials
             </h2>
             <p className="text-muted-foreground max-w-xl mx-auto">
               We maintain the highest international standards for quality and compliance.
             </p>
           </div>
 
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {exportCredentials.map((cred, index) => (
               <motion.div
                 key={cred.title}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.1 }}
                 className="p-6 rounded-2xl bg-card shadow-card text-center"
               >
                 <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                   <cred.icon size={28} className="text-primary" />
                 </div>
                 <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                   {cred.title}
                 </h3>
                 <p className="text-sm text-muted-foreground">
                   {cred.description}
                 </p>
               </motion.div>
             ))}
           </div>
         </div>
       </section>
 
       {/* Export Benefits */}
       <section className="py-16 bg-secondary/30">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div>
               <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6">
                 Why Partner With Us for Export?
               </h2>
               <p className="text-muted-foreground mb-8">
                 Ecovia Enterprises is committed to delivering premium quality Indian herbal 
                 products to international markets with complete transparency and reliability.
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {exportBenefits.map((benefit, index) => (
                   <motion.div
                     key={index}
                     initial={{ opacity: 0, x: -20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: index * 0.05 }}
                     className="flex items-center gap-3"
                   >
                     <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                       <Check size={12} className="text-primary-foreground" />
                     </div>
                     <span className="text-sm text-foreground">{benefit}</span>
                   </motion.div>
                 ))}
               </div>
             </div>
             <div className="relative">
               <div className="grid grid-cols-2 gap-4">
                 {products.slice(0, 4).map((product, index) => (
                   <motion.div
                     key={product.id}
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     transition={{ delay: index * 0.1 }}
                     className="aspect-square rounded-xl overflow-hidden shadow-card"
                   >
                     <img 
                       src={product.image} 
                       alt={product.name}
                       className="w-full h-full object-cover"
                     />
                   </motion.div>
                 ))}
               </div>
               <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold shadow-lg">
                 15+ Products
               </div>
             </div>
           </div>
         </div>
       </section>
 
       {/* Target Markets */}
       <section className="py-16">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
             <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
               We Export To
             </h2>
             <p className="text-muted-foreground">
               Serving businesses across major international markets
             </p>
           </div>
 
           <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
             {targetMarkets.map((market, index) => (
               <motion.div
                 key={market}
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.05 }}
                 className="px-6 py-3 rounded-full bg-card shadow-sm border border-border"
               >
                 <span className="font-medium text-foreground">{market}</span>
               </motion.div>
             ))}
           </div>
         </div>
       </section>
 
       {/* Company Info */}
       <section className="py-16 bg-card">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <div className="max-w-4xl mx-auto text-center">
             <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6">
               About Ecovia Enterprises
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
               <div>
                 <h4 className="font-semibold text-foreground mb-2">Company</h4>
                 <p className="text-muted-foreground">Ecovia Enterprises</p>
               </div>
               <div>
                 <h4 className="font-semibold text-foreground mb-2">Brand</h4>
                 <p className="text-muted-foreground">MITTIKA</p>
               </div>
               <div>
                 <h4 className="font-semibold text-foreground mb-2">Director</h4>
                 <p className="text-muted-foreground">Sagar Jadhav</p>
               </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                 <h4 className="font-semibold text-foreground mb-2">Email</h4>
                 <a href="mailto:info@ecovia.co.in" className="text-primary hover:underline">
                   info@ecovia.co.in
                 </a>
               </div>
               <div>
                 <h4 className="font-semibold text-foreground mb-2">Phone</h4>
                 <a href="tel:+918758808684" className="text-primary hover:underline">
                   +91 8758808684
                 </a>
               </div>
             </div>
           </div>
         </div>
       </section>
 
       {/* CTA Section */}
       <section className="py-16 bg-primary">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <Ship size={48} className="mx-auto text-primary-foreground/80 mb-6" />
           <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
             Start Your Export Partnership Today
           </h2>
           <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
             Contact us for product catalogs, pricing, and to discuss your export requirements. 
             We look forward to building a long-term business relationship.
           </p>
           <button
             onClick={handleExportInquiry}
             className="inline-flex items-center gap-2 bg-background text-foreground px-8 py-4 rounded-lg font-medium hover:bg-background/90 transition-colors"
           >
             <MessageCircle size={20} />
             Send Export Inquiry
           </button>
         </div>
       </section>
 
       <WhatsAppButton />
     </Layout>
   );
 };
 
 export default Export;