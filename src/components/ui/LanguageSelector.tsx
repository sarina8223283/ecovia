import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import languageIcon from '@/assets/icons/language-icon.png';

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'bho', name: 'Bhojpuri', native: 'भोजपुरी' },
  { code: 'mai', name: 'Maithili', native: 'मैथिली' },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्' },
  { code: 'ks', name: 'Kashmiri', native: 'कॉशुर' },
  { code: 'sd', name: 'Sindhi', native: 'سنڌي' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली' },
  { code: 'kok', name: 'Konkani', native: 'कोंकणी' },
];

const triggerGoogleTranslate = (langCode: string) => {
  // Try to find the combo box and change language
  const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
  if (combo) {
    combo.value = langCode;
    combo.dispatchEvent(new Event('change'));
    return true;
  }
  return false;
};

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(languages[0]);
  const [translating, setTranslating] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Detect current language from cookie on mount
  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/en\/(\w+)/);
    if (match) {
      const found = languages.find(l => l.code === match[1]);
      if (found) setSelected(found);
    }
  }, []);

  const handleSelect = useCallback((lang: typeof languages[0]) => {
    setSelected(lang);
    setIsOpen(false);

    if (lang.code === 'en') {
      // Reset to English: clear cookies and reload once
      document.cookie = 'googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = `googtrans=;path=/;domain=${window.location.hostname};expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      // Try combo first
      if (triggerGoogleTranslate('en')) return;
      window.location.reload();
      return;
    }

    setTranslating(true);

    // Set cookies for persistence
    document.cookie = `googtrans=/en/${lang.code};path=/;`;
    document.cookie = `googtrans=/en/${lang.code};path=/;domain=${window.location.hostname}`;

    // Attempt to trigger translation via combo box with polling
    let attempts = 0;
    const maxAttempts = 20;
    const interval = setInterval(() => {
      attempts++;
      const success = triggerGoogleTranslate(lang.code);
      if (success || attempts >= maxAttempts) {
        clearInterval(interval);
        setTranslating(false);
        // If combo was never found, reload as fallback
        if (!success && attempts >= maxAttempts) {
          window.location.reload();
        }
      }
    }, 250);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 hover:bg-secondary rounded-lg transition-colors flex items-center gap-1"
        aria-label="Select Language"
        title="Change Language"
        disabled={translating}
      >
        <img src={languageIcon} alt="Language" className="w-5 h-5 object-contain" />
        <span className="text-xs font-medium text-muted-foreground hidden sm:inline">
          {translating ? '...' : selected.code.toUpperCase()}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 max-h-80 overflow-y-auto bg-card rounded-xl shadow-elevated border border-border z-[100] py-1"
          >
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-secondary transition-colors ${
                  selected.code === lang.code ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'
                }`}
              >
                <span>{lang.name}</span>
                <span className="text-xs text-muted-foreground">{lang.native}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
