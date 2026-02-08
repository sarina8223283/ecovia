import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-2">Mittika</h3>
            <p className="text-sm opacity-80 mb-4">by Ecovia Enterprises OPC Pvt. Ltd.</p>
            <p className="text-sm opacity-90 leading-relaxed max-w-md">
              Delivering authentic, pure, and natural ayurvedic powders crafted from 
              traditional wisdom. Experience the power of nature with every product.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone size={16} className="opacity-80" />
                <a href="tel:+918758808684" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  +91 8758808684
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="opacity-80" />
                <span className="text-sm opacity-80">info@mittika.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="opacity-80 mt-1" />
                <span className="text-sm opacity-80">
                  Ecovia Enterprises<br />India
                </span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com/info.ecovia"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={20} className="opacity-90" />
              </a>
              <a
                href="https://www.facebook.com/share/1Bm5epz5C2/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook size={20} className="opacity-90" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-10 pt-8 text-center">
          <p className="text-sm opacity-70">
            © {currentYear} Ecovia Enterprises OPC Pvt. Ltd. – All Rights Reserved | Brand: Mittika
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;