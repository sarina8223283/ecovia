import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Instagram, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CartDrawer from '@/components/ui/CartDrawer';
import PowderScanner from '@/components/ui/PowderScanner';
import { useAuth } from '@/contexts/AuthContext';
import ecoviaLogoIcon from '@/assets/ecovia-logo-icon.png';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'Shop by Category', path: '/shop-by-category' },
  { name: 'Directions of Use', path: '/directions' },
  { name: 'Bulk Orders', path: '/bulk-orders' },
  { name: 'Export', path: '/export' },
  { name: 'About Us', path: '/about' },
  { name: 'Purity', path: '/purity' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Single Row: Logo + Brand + Nav + Actions */}
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Icon + Brand Name (Left) - merged in single row */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img 
              src={ecoviaLogoIcon} 
              alt="Ecovia Logo" 
              className="h-8 sm:h-10 w-auto object-contain"
            />
            <div className="flex flex-col leading-none">
              <span className="font-serif text-sm sm:text-base font-bold text-primary leading-tight">
                Ecovia Enterprises
              </span>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground font-sans leading-tight">
                Brand: MITTIKA
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-3 2xl:gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative font-sans text-xs 2xl:text-sm font-medium transition-colors duration-200 hover:text-primary whitespace-nowrap ${
                  isActive(link.path) ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Social Links */}
            <div className="flex items-center gap-1">
              <a
                href="https://instagram.com/info.ecovia"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} className="text-muted-foreground hover:text-primary" />
              </a>
              <a
                href="https://www.facebook.com/share/1Bm5epz5C2/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} className="text-muted-foreground hover:text-primary" />
              </a>
            </div>

            {/* Cart */}
            <CartDrawer />

            {/* Account */}
            <Link
              to={user ? '/account' : '/auth'}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Account"
            >
              <User size={20} className={user ? 'text-primary' : 'text-foreground'} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
            <CartDrawer />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="xl:hidden overflow-hidden bg-background border-b border-border"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 font-sans text-base font-medium transition-colors ${
                    isActive(link.path) ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="border-t border-border pt-3 mt-3">
                <Link
                  to={user ? '/account' : '/auth'}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 py-2 font-sans text-base font-medium text-muted-foreground"
                >
                  <User size={18} />
                  {user ? 'My Account' : 'Sign In'}
                </Link>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <a
                  href="https://instagram.com/info.ecovia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://www.facebook.com/share/1Bm5epz5C2/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Facebook size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
