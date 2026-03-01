import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

const Contact = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-hero-pattern relative overflow-hidden">
        <div className="absolute inset-0 nature-bg opacity-30" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            We're here to help you on your natural wellness journey. Reach out to us for any queries or support.
          </motion.p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-card relative">
        <div className="absolute inset-0 page-nature-overlay opacity-50 pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-background p-8 rounded-2xl shadow-soft text-center hover:shadow-card transition-all border border-border/50"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <MapPin size={28} className="text-primary" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground mb-4">Our Office</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ecovia Enterprises OPC Pvt. Ltd.<br />
                Pune, Maharashtra, India
              </p>
            </motion.div>

            {/* Phone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-background p-8 rounded-2xl shadow-soft text-center hover:shadow-card transition-all border border-border/50"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Phone size={28} className="text-primary" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground mb-4">Phone & WhatsApp</h3>
              <p className="text-muted-foreground mb-4">
                Mon-Sat from 9am to 6pm
              </p>
              <a 
                href="tel:+918758808684" 
                className="text-lg font-semibold text-primary hover:underline block mb-2"
              >
                +91 8758808684
              </a>
              <a 
                href="https://wa.me/918758808684" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
              >
                Chat on WhatsApp →
              </a>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-background p-8 rounded-2xl shadow-soft text-center hover:shadow-card transition-all border border-border/50"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Mail size={28} className="text-primary" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground mb-4">Email Us</h3>
              <p className="text-muted-foreground mb-4">
                For general inquiries and support
              </p>
              <a 
                href="mailto:info@ecovia.co.in" 
                className="text-lg font-semibold text-primary hover:underline"
              >
                info@ecovia.co.in
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 sm:py-20 relative">
        <div className="absolute inset-0 page-nature-overlay opacity-30 pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Visit Us</h2>
          <div className="aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-card border border-border/50">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.567073286523!2d73.856743!3d18.520430!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c06277d3d379%3A0x85f3611804c77c61!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </Layout>
  );
};

export default Contact;