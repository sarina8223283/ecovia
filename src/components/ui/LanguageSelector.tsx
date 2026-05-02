import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { LanguageGlobe } from '@/components/icons/BotanicalIcons';

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

const EXCLUDED_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'TEXTAREA',
  'INPUT',
  'SELECT',
  'OPTION',
  'CODE',
  'PRE',
  'SVG',
]);

const TRANSLATION_CACHE_KEY = 'mittika_translation_cache_v2';
const PREFERRED_LANGUAGE_KEY = 'preferred_language';

// Manual overrides for key brand phrases where Google Translate is inaccurate
const MANUAL_OVERRIDES: Record<string, Record<string, string>> = {
  mr: {
    'Experience the': 'अनुभव घ्या',
    'Luxury': 'लक्जरी',
    'of': 'चा',
    'Earthly Purity': 'पृथ्वीच्या शुद्धतेचा',
    'The Luxury of Earthly Purity': 'अनुभव घ्या पृथ्वीच्या लक्जरी शुद्धतेचा',
    '100% Pure & Natural': '१००% शुद्ध आणि नैसर्गिक',
    'Mittika brings you authentic, chemical-free herbal powders rooted in ancient Ayurvedic traditions. Elevate your wellness journey naturally.':
      'मिटिका तुम्हाला प्राचीन आयुर्वेदिक परंपरांवर आधारित अस्सल, रसायनमुक्त हर्बल पावडर देते. तुमचा निरोगीपणाचा प्रवास नैसर्गिकरित्या उंचावा.',
    'Explore Products': 'उत्पादने एक्सप्लोर करा',
    'Contact Us': 'आमच्याशी संपर्क साधा',
    'Our Products': 'आमची उत्पादने',
    'Mittika Collection': 'मिटिका संग्रह',
    'Quick Links': 'द्रुत दुवे',
    'Home': 'मुख्यपृष्ठ',
    'Products': 'उत्पादने',
    'About Us': 'आमच्याबद्दल',
    'Contact': 'संपर्क',
    'Shop by Category': 'श्रेणीनुसार खरेदी करा',
    'Directions of Use': 'वापरण्याचे मार्गदर्शन',
    'Bulk Orders': 'मोठ्या प्रमाणात ऑर्डर',
    'Export': 'निर्यात',
    'Purity': 'शुद्धता',
    'Visitors': 'अभ्यागत',
    'Delivering authentic, pure, and natural ayurvedic powders crafted from traditional wisdom. Experience the power of nature with every product.':
      'पारंपरिक ज्ञानातून तयार केलेले अस्सल, शुद्ध आणि नैसर्गिक आयुर्वेदिक पावडर. प्रत्येक उत्पादनासह निसर्गाच्या शक्तीचा अनुभव घ्या.',
    'Skin Care': 'त्वचा काळजी',
    'Hair Care': 'केसांची काळजी',
    'Wellness': 'निरोगीपणा',
    'All Products': 'सर्व उत्पादने',
    'Most Loved': 'सर्वाधिक आवडते',
    'Add to Cart': 'कार्टमध्ये जोडा',
    'Explore our range of pure, natural herbal powders and experience the luxury of earthly purity.':
      'आमच्या शुद्ध, नैसर्गिक हर्बल पावडरची श्रेणी एक्सप्लोर करा आणि पृथ्वीच्या शुद्धतेच्या लक्जरीचा अनुभव घ्या.',
  },
  hi: {
    'Experience the': 'अनुभव करें',
    'Luxury': 'विलासिता',
    'of': 'का',
    'Earthly Purity': 'पृथ्वी की शुद्धता',
    'The Luxury of Earthly Purity': 'पृथ्वी की शुद्धता की विलासिता का अनुभव करें',
    '100% Pure & Natural': '100% शुद्ध और प्राकृतिक',
    'Mittika brings you authentic, chemical-free herbal powders rooted in ancient Ayurvedic traditions. Elevate your wellness journey naturally.':
      'मिट्टिका आपके लिए प्राचीन आयुर्वेदिक परंपराओं पर आधारित प्रामाणिक, रसायन-मुक्त हर्बल पाउडर लाता है। अपनी स्वास्थ्य यात्रा को स्वाभाविक रूप से ऊंचा उठाएं।',
    'Explore Products': 'उत्पाद देखें',
    'Contact Us': 'संपर्क करें',
    'Our Products': 'हमारे उत्पाद',
    'Mittika Collection': 'मिट्टिका संग्रह',
    'Quick Links': 'त्वरित लिंक',
    'Home': 'होम',
    'Products': 'उत्पाद',
    'About Us': 'हमारे बारे में',
    'Contact': 'संपर्क',
    'Shop by Category': 'श्रेणी के अनुसार खरीदें',
    'Directions of Use': 'उपयोग के निर्देश',
    'Bulk Orders': 'थोक ऑर्डर',
    'Export': 'निर्यात',
    'Purity': 'शुद्धता',
    'Visitors': 'आगंतुक',
    'Delivering authentic, pure, and natural ayurvedic powders crafted from traditional wisdom. Experience the power of nature with every product.':
      'पारंपरिक ज्ञान से तैयार प्रामाणिक, शुद्ध और प्राकृतिक आयुर्वेदिक पाउडर। हर उत्पाद के साथ प्रकृति की शक्ति का अनुभव करें।',
    'Skin Care': 'त्वचा की देखभाल',
    'Hair Care': 'बालों की देखभाल',
    'Wellness': 'कल्याण',
    'All Products': 'सभी उत्पाद',
    'Most Loved': 'सबसे ज्यादा पसंद',
    'Add to Cart': 'कार्ट में जोड़ें',
    'Explore our range of pure, natural herbal powders and experience the luxury of earthly purity.':
      'हमारे शुद्ध, प्राकृतिक हर्बल पाउडर की श्रृंखला देखें और पृथ्वी की शुद्धता की विलासिता का अनुभव करें।',
  },
};

type CacheShape = Record<string, Record<string, string>>;

const readCache = (): CacheShape => {
  try {
    return JSON.parse(localStorage.getItem(TRANSLATION_CACHE_KEY) || '{}');
  } catch {
    return {};
  }
};

const writeCache = (cache: CacheShape) => {
  localStorage.setItem(TRANSLATION_CACHE_KEY, JSON.stringify(cache));
};

const translateText = async (text: string, targetLang: string): Promise<string> => {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) return text;

  const data = await res.json();
  const translated = Array.isArray(data?.[0])
    ? data[0].map((part: any[]) => part?.[0] || '').join('')
    : text;

  return translated || text;
};

const LanguageSelector = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(languages[0]);
  const [translating, setTranslating] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const originalTextsRef = useRef<Map<Text, string>>(new Map());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(PREFERRED_LANGUAGE_KEY);
    const found = languages.find((l) => l.code === saved);
    if (found) setSelected(found);
  }, []);

  const getTextNodes = useCallback(() => {
    const nodes: Text[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

    while (walker.nextNode()) {
      const textNode = walker.currentNode as Text;
      const parent = textNode.parentElement;
      if (!parent) continue;

      if (EXCLUDED_TAGS.has(parent.tagName)) continue;
      if (parent.closest('[data-no-translate="true"]')) continue;

      const raw = textNode.textContent || '';
      const trimmed = raw.trim();
      if (!trimmed || trimmed.length < 2) continue;

      nodes.push(textNode);
    }

    return nodes;
  }, []);

  const restoreEnglish = useCallback(() => {
    originalTextsRef.current.forEach((original, node) => {
      if (node.isConnected) node.textContent = original;
    });
    document.documentElement.lang = 'en';
  }, []);

  // Listen for logo-click reset to English
  useEffect(() => {
    const handler = () => {
      setSelected(languages[0]);
      restoreEnglish();
    };
    window.addEventListener('reset-language-english', handler);
    return () => window.removeEventListener('reset-language-english', handler);
  }, [restoreEnglish]);

  const applyTranslation = useCallback(async (langCode: string) => {
    const nodes = getTextNodes();
    if (!nodes.length) return;

    const cache = readCache();
    cache[langCode] = cache[langCode] || {};

    // Seed manual overrides into cache (always override)
    const overrides = MANUAL_OVERRIDES[langCode];
    if (overrides) {
      Object.entries(overrides).forEach(([key, val]) => {
        cache[langCode][key] = val;
      });
    }

    nodes.forEach((node) => {
      if (!originalTextsRef.current.has(node)) {
        originalTextsRef.current.set(node, node.textContent || '');
      }
    });

    const uniqueTexts = Array.from(
      new Set(
        nodes
          .map((n) => (originalTextsRef.current.get(n) || '').trim())
          .filter(Boolean)
      )
    );

    const missing = uniqueTexts.filter((t) => !cache[langCode][t]);

    for (let i = 0; i < missing.length; i += 24) {
      const chunk = missing.slice(i, i + 24);
      const results = await Promise.all(
        chunk.map(async (t) => {
          try {
            const translated = await translateText(t, langCode);
            return { t, translated };
          } catch {
            return { t, translated: t };
          }
        })
      );

      results.forEach(({ t, translated }) => {
        cache[langCode][t] = translated;
      });
    }

    writeCache(cache);

    nodes.forEach((node) => {
      const original = originalTextsRef.current.get(node) || '';
      const trimmed = original.trim();
      if (!trimmed) return;

      const translated = cache[langCode][trimmed] || trimmed;
      node.textContent = original.replace(trimmed, translated);
    });

    document.documentElement.lang = langCode;
  }, [getTextNodes]);

  const handleSelect = useCallback(async (lang: typeof languages[0]) => {
    setSelected(lang);
    setIsOpen(false);
    localStorage.setItem(PREFERRED_LANGUAGE_KEY, lang.code);

    if (lang.code === 'en') {
      setTranslating(true);
      restoreEnglish();
      setTranslating(false);
      toast({ title: '🌐 Language changed', description: 'Switched back to English' });
      return;
    }

    toast({ title: '🌐 Translating...', description: `Switching to ${lang.name} (${lang.native})` });
    setTranslating(true);
    try {
      restoreEnglish();
      await applyTranslation(lang.code);
      toast({ title: '✅ Translation complete', description: `Now viewing in ${lang.name} (${lang.native})` });
    } finally {
      setTranslating(false);
    }
  }, [applyTranslation, restoreEnglish]);

  useEffect(() => {
    if (selected.code === 'en') return;

    let isMounted = true;
    const run = async () => {
      setTranslating(true);
      try {
        await applyTranslation(selected.code);
      } finally {
        if (isMounted) setTranslating(false);
      }
    };

    const timer = setTimeout(run, 120);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [location.pathname, selected.code, applyTranslation]);

  useEffect(() => {
    if (selected.code === 'en') return;

    const observer = new MutationObserver(() => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        void applyTranslation(selected.code);
      }, 180);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [selected.code, applyTranslation]);

  return (
    <div ref={ref} className="relative" data-no-translate="true">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-primary/10 rounded-full transition-all duration-200 flex items-center gap-1 text-primary"
        aria-label="Select Language"
        title="Change Language"
        disabled={translating}
      >
        <LanguageGlobe size={22} className="hover:scale-110 transition-transform" />
        <span className="text-[11px] font-bold text-primary hidden sm:inline tracking-wide">
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
            {languages.map((lang) => (
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
