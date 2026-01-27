import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatsAppButton = () => {
  const phoneNumber = '918758808684';
  const message = encodeURIComponent('Hello, I would like to inquire about Mittika products.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-elevated hover:shadow-2xl transition-shadow"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={28} fill="white" />
    </motion.a>
  );
};

export default WhatsAppButton;