import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { useSiteContent, getContent } from '@/hooks/useSiteContent';

const Contact = () => {
  const { data: content } = useSiteContent();

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
            {getContent(content, 'contact_heading', 'Contact Us')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            {getContent(content, 'contact_description', "We're here to help you on your natural wellness journey. Reach out to us for any queries or support.")}
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
              <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                {getContent(content, 'contact_office_title', 'Our Office')}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {getContent(content, 'contact_address', 'Ecovia Enterprises OPC Pvt. Ltd.\nRabale, Navi Mumbai,\nMaharashtra, India').split('\n').map((line, i) => (
                  <span key={i}>{line}<br /></span>
                ))}
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
              <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                {getContent(content, 'contact_phone_title', 'Phone & WhatsApp')}
              </h3>
              <p className="text-muted-foreground mb-4">
                {getContent(content, 'contact_phone_hours', 'Mon-Sat from 9am to 6pm')}
              </p>
              <a href={`tel:${getContent(content, 'contact_phone', '+918758808684')}`} className="text-lg font-semibold text-primary hover:underline block mb-3">
                {getContent(content, 'contact_phone', '+91 8758808684')}
              </a>
              <a href={`https://wa.me/${getContent(content, 'contact_phone', '+918758808684').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#25D366] font-semibold hover:underline">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {getContent(content, 'contact_phone', '+91 8758808684')}
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
              <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                {getContent(content, 'contact_email_title', 'Email Us')}
              </h3>
              <p className="text-muted-foreground mb-4">
                {getContent(content, 'contact_email_subtitle', 'For general inquiries and support')}
              </p>
              <a href={`mailto:${getContent(content, 'contact_email', 'info@ecovia.co.in')}`} className="text-lg font-semibold text-primary hover:underline">
                {getContent(content, 'contact_email', 'info@ecovia.co.in')}
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 sm:py-20 relative">
        <div className="absolute inset-0 page-nature-overlay opacity-30 pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
            {getContent(content, 'contact_map_heading', 'Visit Us')}
          </h2>
          <div className="aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-card border border-border/50">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.5!2d73.0!3d19.17!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7bf7a2d8d1b8d%3A0x3d3e3c2b1a0f6f6f!2sRabale%2C%20Navi%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </Layout>
  );
};

export default Contact;
