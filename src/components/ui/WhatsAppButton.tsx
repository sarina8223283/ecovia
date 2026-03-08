import { motion } from 'framer-motion';
import whatsappIcon from '@/assets/icons/whatsapp-icon.png';

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
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-elevated hover:shadow-2xl transition-shadow cursor-pointer flex items-center justify-center bg-[#25D366]"
      aria-label="Contact us on WhatsApp"
    >
      <img src={whatsappIcon} alt="WhatsApp" className="w-9 h-9 object-contain" />
    </motion.a>
  );
};

export default WhatsAppButton;
