 import { useState, useEffect } from 'react';
 import { useParams, Link } from 'react-router-dom';
 import { motion } from 'framer-motion';
 import { ArrowLeft, Plus, Minus, ShoppingBag, MessageCircle, Check, ChevronDown, ChevronUp } from 'lucide-react';
 import Layout from '@/components/layout/Layout';
 import WhatsAppButton from '@/components/ui/WhatsAppButton';
 import { getProductById, products } from '@/data/products';
 import { useCart } from '@/contexts/CartContext';
 import { toast } from 'sonner';
 import { Helmet } from 'react-helmet-async';
 
 const quantityOptions = [
   { grams: 50, label: '50g' },
   { grams: 100, label: '100g' },
   { grams: 250, label: '250g' },
   { grams: 500, label: '500g' },
   { grams: 1000, label: '1 Kg' },
   { grams: 2000, label: '2 Kg' },
   { grams: 5000, label: '5 Kg' },
   { grams: 10000, label: '10 Kg' },
 ];
 
 const ProductDetail = () => {
   const { id } = useParams<{ id: string }>();
   const product = getProductById(id || '');
   const { addItem } = useCart();
   const [selectedQuantity, setSelectedQuantity] = useState(100);
   const [openFaq, setOpenFaq] = useState<number | null>(null);
 
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
 
   const totalPrice = (selectedQuantity * product.pricePerGram).toFixed(2);
 
   const handleAddToCart = () => {
     addItem({
       productId: product.id,
       productName: product.name,
       quantityGrams: selectedQuantity,
       pricePerGram: product.pricePerGram,
       image: product.image
     });
     toast.success(`Added ${product.name} to cart!`);
   };
 
   const handleBuyNow = () => {
     const quantityLabel = quantityOptions.find(q => q.grams === selectedQuantity)?.label || `${selectedQuantity}g`;
     const message = `Hi! I'd like to order:\n\n*${product.name}*\nQuantity: ${quantityLabel}\nPrice: ₹${totalPrice}\n\nPlease confirm availability and payment details.`;
     const whatsappUrl = `https://wa.me/918758808684?text=${encodeURIComponent(message)}`;
     window.open(whatsappUrl, '_blank');
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
     "description": product.description,
     "brand": {
       "@type": "Brand",
       "name": "Mittika"
     },
     "manufacturer": {
       "@type": "Organization",
       "name": "Ecovia Enterprises"
     }
   };
 
   const relatedProducts = products
     .filter(p => p.category === product.category && p.id !== product.id)
     .slice(0, 4);
 
   return (
     <Layout>
       <Helmet>
         <title>{product.name} | Mittika by Ecovia Enterprises</title>
         <meta name="description" content={product.description} />
         <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
         <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
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
               <div className="relative aspect-square rounded-2xl overflow-hidden shadow-elevated">
                 <img 
                   src={product.image} 
                   alt={product.name}
                   className="w-full h-full object-cover"
                 />
                 {/* Watermark */}
                 <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                   <span className="text-xs font-medium text-foreground/70">ECOVIA</span>
                 </div>
                 {/* 100% Natural Badge */}
                 <div 
                   className="absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg"
                   style={{ backgroundColor: `hsl(${product.themeColor})` }}
                 >
                   100% Natural
                 </div>
               </div>
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
 
               {/* Quantity Selector */}
               <div className="mb-6">
                 <label className="block text-sm font-medium text-foreground mb-3">
                   Select Quantity
                 </label>
                 <div className="flex flex-wrap gap-2">
                   {quantityOptions.map(option => (
                     <button
                       key={option.grams}
                       onClick={() => setSelectedQuantity(option.grams)}
                       className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                         selectedQuantity === option.grams
                           ? 'bg-primary text-primary-foreground'
                           : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                       }`}
                     >
                       {option.label}
                     </button>
                   ))}
                 </div>
               </div>
 
               {/* Price */}
               <div className="mb-6">
                 <span className="text-3xl font-bold text-foreground">₹{totalPrice}</span>
                 <span className="text-muted-foreground ml-2">
                   (₹{product.pricePerGram}/g)
                 </span>
               </div>
 
               {/* Action Buttons */}
               <div className="flex flex-col sm:flex-row gap-3 mb-6">
                 <button
                   onClick={handleAddToCart}
                   className="flex-1 inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                 >
                   <Plus size={20} />
                   Add to Cart
                 </button>
                 <button
                   onClick={handleBuyNow}
                   className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                 >
                   <MessageCircle size={20} />
                   Buy Now via WhatsApp
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
 
       {/* Directions Section */}
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
                   <div className="aspect-square overflow-hidden">
                     <img 
                       src={relatedProduct.image} 
                       alt={relatedProduct.name}
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