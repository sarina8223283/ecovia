import { useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Facebook, Menu, X } from 'lucide-react';
import {
  LeafHome,
  HerbPouch,
  LeafGrid,
  HerbScroll,
  JarStack,
  GlobeLeaf,
  SproutSun,
  LeafShield,
  HerbalUsers,
  LeafChat,
  SproutGear,
  HerbalUser,
} from '@/components/icons/BotanicalIcons';
import CartDrawer from '@/components/ui/CartDrawer';
import PowderScanner from '@/components/ui/PowderScanner';
import LanguageSelector from '@/components/ui/LanguageSelector';
import { useAuth } from '@/contexts/AuthContext';
import ecoviaLogoIcon from '@/assets/ecovia-logo-icon.png';

const navLinks = [
  { name: 'Home', path: '/', icon: LeafHome },
  { name: 'Products', path: '/products', icon: HerbPouch },
  { name: 'Shop by Category', path: '/shop-by-category', icon: LeafGrid },
  { name: 'Directions of Use', path: '/directions', icon: HerbScroll },
  { name: 'Bulk Orders', path: '/bulk-orders', icon: JarStack },
  { name: 'Export', path: '/export', icon: GlobeLeaf },
  { name: 'About Us', path: '/about', icon: SproutSun },
  { name: 'Purity', path: '/purity', icon: LeafShield },
  { name: 'Visitors', path: '/visitors', icon: HerbalUsers },
  { name: 'Contact', path: '/contact', icon: LeafChat },
  { name: 'Admin', path: '/admin', icon: SproutGear },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.setItem('preferred_language', 'en');
    window.dispatchEvent(new CustomEvent('reset-language-english'));
    navigate('/');
  }, [navigate]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-primary/10 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a href="/" onClick={handleLogoClick} className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer mr-6" data-no-translate="true">
            <img src={ecoviaLogoIcon} alt="Ecovia Logo" className="h-9 sm:h-11 w-auto object-contain" />
            <div className="flex flex-col leading-none">
              <span className="font-serif text-base sm:text-lg lg:text-xl font-bold text-primary leading-tight">Ecovia Enterprises</span>
              <span className="text-[9px] sm:text-[11px] text-muted-foreground font-sans leading-tight">Brand: MITTIKA</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-0.5 2xl:gap-1 overflow-x-auto scrollbar-hide">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full font-sans text-[13px] 2xl:text-sm font-semibold transition-all duration-300 whitespace-nowrap group ${
                    active
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                      : 'text-foreground/70 hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  <Icon size={17} className={active ? 'text-primary-foreground' : 'text-primary group-hover:scale-110 transition-transform'} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Actions - Desktop (uniform 22px icons, p-2 buttons, primary green) */}
          <div className="hidden md:flex items-center gap-1.5">
            <PowderScanner />
            <LanguageSelector />
            <a href="https://instagram.com/info.ecovia" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-primary/10 rounded-full transition-all duration-200 text-primary" aria-label="Instagram">
              <Instagram size={22} strokeWidth={1.8} className="hover:scale-110 transition-transform" />
            </a>
            <a href="https://www.facebook.com/share/1Bm5epz5C2/" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-primary/10 rounded-full transition-all duration-200 text-primary" aria-label="Facebook">
              <Facebook size={22} strokeWidth={1.8} className="hover:scale-110 transition-transform" />
            </a>
            <CartDrawer />
            <Link to={user ? '/account' : '/auth'} className="p-2 hover:bg-primary/10 rounded-full transition-all duration-200 text-primary" aria-label="Account">
              <HerbalUser size={22} className="hover:scale-110 transition-transform" />
            </Link>
          </div>

          {/* Mobile / Tablet Actions */}
          <div className="flex xl:hidden items-center gap-1">
            <PowderScanner />
            <LanguageSelector />
            <CartDrawer />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-primary/10 rounded-full transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X size={24} strokeWidth={2.5} className="text-primary" />
              ) : (
                <Menu size={24} strokeWidth={2.5} className="text-primary" />
              )}
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
            className="xl:hidden overflow-hidden bg-background/98 backdrop-blur-md border-b border-primary/10"
          >
            <div className="container mx-auto px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-sans text-[15px] font-semibold transition-all duration-200 ${
                      active
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                        : 'text-foreground/70 hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    <Icon size={20} className={active ? 'text-primary-foreground' : 'text-primary'} />
                    {link.name}
                  </Link>
                );
              })}
              <div className="border-t border-primary/10 pt-3 mt-2">
                <Link to={user ? '/account' : '/auth'} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-sans text-[15px] font-semibold text-foreground/70 hover:bg-primary/10 hover:text-primary transition-all">
                  <HerbalUser size={20} className="text-primary" />
                  {user ? 'My Account' : 'Sign In'}
                </Link>
              </div>
              <div className="flex items-center gap-3 pt-2 px-4">
                <a href="https://instagram.com/info.ecovia" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-primary/10 rounded-full transition-all">
                  <Instagram size={22} strokeWidth={2} className="text-primary" />
                </a>
                <a href="https://www.facebook.com/share/1Bm5epz5C2/" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-primary/10 rounded-full transition-all">
                  <Facebook size={22} strokeWidth={2} className="text-primary" />
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
