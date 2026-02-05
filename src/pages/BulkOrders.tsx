 import { motion } from 'framer-motion';
 import { Package, Percent, Truck, MessageCircle, Check, ArrowRight } from 'lucide-react';
 import Layout from '@/components/layout/Layout';
 import WhatsAppButton from '@/components/ui/WhatsAppButton';
 import { products } from '@/data/products';
 import { Link } from 'react-router-dom';
 
 const discountTiers = [
   { minKg: 5, maxKg: 10, discount: 10, label: '5-10 Kg' },
   { minKg: 10, maxKg: 25, discount: 15, label: '10-25 Kg' },
   { minKg: 25, maxKg: 50, discount: 18, label: '25-50 Kg' },
   { minKg: 50, maxKg: null, discount: 20, label: '50+ Kg' },
 ];
 
 const benefits = [
   'Discounted wholesale pricing up to 20% off',
   'Direct sourcing from trusted farmers',
   'Quality assurance and lab testing reports',
   'Custom packaging options available',
   'Regular supply contracts',
   'Priority customer support',
 ];
 
 const BulkOrders = () => {
   const handleBulkInquiry = () => {
     const message = `Hi! I'm interested in bulk/wholesale orders for Mittika products.\n\nPlease share:\n• Available products and pricing\n• Minimum order quantities\n• Delivery timeline\n• Payment terms\n\nThank you!`;
     window.open(`https://wa.me/918758808684?text=${encodeURIComponent(message)}`, '_blank');
   };
 
   return (
     <Layout>
       {/* Hero Section */}
       <section className="py-16 sm:py-24 bg-hero-pattern">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
           >
             <Package size={18} />
             Wholesale & Bulk Orders
           </motion.div>
           <motion.h1
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4"
           >
             Bulk Order Discounts
           </motion.h1>
           <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-muted-foreground max-w-2xl mx-auto text-lg mb-8"
           >
             Save up to 20% on large orders. Perfect for retailers, spas, salons, 
             Ayurvedic practitioners, and wellness businesses.
           </motion.p>
           <motion.button
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             onClick={handleBulkInquiry}
             className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
           >
             <MessageCircle size={20} />
             Get Bulk Quote
           </motion.button>
         </div>
       </section>
 
       {/* Discount Tiers */}
       <section className="py-16 sm:py-20">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
             <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
               Volume-Based Discounts
             </h2>
             <p className="text-muted-foreground max-w-xl mx-auto">
               The more you order, the more you save. Our tiered pricing rewards larger orders.
             </p>
           </div>
 
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
             {discountTiers.map((tier, index) => (
               <motion.div
                 key={tier.label}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.1 }}
                 className={`relative p-6 rounded-2xl text-center ${
                   tier.discount === 20 
                     ? 'bg-primary text-primary-foreground' 
                     : 'bg-card shadow-card'
                 }`}
               >
                 {tier.discount === 20 && (
                   <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
                     BEST VALUE
                   </div>
                 )}
                 <div className="flex items-center justify-center gap-1 mb-2">
                   <Percent size={24} />
                   <span className="text-4xl font-bold">{tier.discount}</span>
                 </div>
                 <p className={`text-sm mb-1 ${tier.discount === 20 ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                   Discount
                 </p>
                 <p className={`font-semibold ${tier.discount === 20 ? '' : 'text-foreground'}`}>
                   {tier.label}
                 </p>
               </motion.div>
             ))}
           </div>
         </div>
       </section>
 
       {/* Benefits */}
       <section className="py-16 bg-secondary/30">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div>
               <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6">
                 Why Choose Mittika for Bulk Orders?
               </h2>
               <div className="space-y-4">
                 {benefits.map((benefit, index) => (
                   <motion.div
                     key={index}
                     initial={{ opacity: 0, x: -20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: index * 0.1 }}
                     className="flex items-center gap-3"
                   >
                     <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                       <Check size={14} className="text-primary-foreground" />
                     </div>
                     <span className="text-foreground">{benefit}</span>
                   </motion.div>
                 ))}
               </div>
             </div>
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
           </div>
         </div>
       </section>
 
       {/* Available Products */}
       <section className="py-16">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
             <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
               Products Available for Bulk Orders
             </h2>
             <p className="text-muted-foreground">
               All 15 of our premium herbal powders are available in bulk quantities
             </p>
           </div>
 
           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
             {products.map((product, index) => (
               <motion.div
                 key={product.id}
                 initial={{ opacity: 0, y: 10 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.05 }}
                 className="p-4 rounded-xl bg-card shadow-sm text-center"
               >
                 <img 
                   src={product.image} 
                   alt={product.name}
                   className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                 />
                 <p className="text-sm font-medium text-foreground line-clamp-2">
                   {product.name}
                 </p>
               </motion.div>
             ))}
           </div>
         </div>
       </section>
 
       {/* CTA Section */}
       <section className="py-16 bg-primary">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
             Ready to Place a Bulk Order?
           </h2>
           <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
             Contact us today for a customized quote based on your requirements.
             We offer flexible payment terms and reliable delivery.
           </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <button
               onClick={handleBulkInquiry}
               className="inline-flex items-center justify-center gap-2 bg-background text-foreground px-8 py-4 rounded-lg font-medium hover:bg-background/90 transition-colors"
             >
               <MessageCircle size={20} />
               Contact on WhatsApp
             </button>
             <Link
               to="/contact"
               className="inline-flex items-center justify-center gap-2 border-2 border-primary-foreground text-primary-foreground px-8 py-4 rounded-lg font-medium hover:bg-primary-foreground/10 transition-colors"
             >
               Send Email Inquiry
               <ArrowRight size={18} />
             </Link>
           </div>
         </div>
       </section>
 
       <WhatsAppButton />
     </Layout>
   );
 };
 
 export default BulkOrders;