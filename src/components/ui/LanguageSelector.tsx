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

const TRANSLATION_CACHE_KEY = 'mittika_translation_cache_v1';

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
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(languages[0]);
  const [translating, setTranslating] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const originalTextsRef = useRef<Map<Text, string>>(new Map());

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('preferred_language');
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
      if (node.isConnected) {
        node.textContent = original;
      }
    });
    document.documentElement.lang = 'en';
  }, []);

  const applyTranslation = useCallback(async (langCode: string) => {
    const nodes = getTextNodes();
    const cache = readCache();
    cache[langCode] = cache[langCode] || {};

    // Capture original text once
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

    // Translate missing items in small chunks for smoother UI
    const missing = uniqueTexts.filter((t) => !cache[langCode][t]);

    for (let i = 0; i < missing.length; i += 12) {
      const chunk = missing.slice(i, i + 12);
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

      writeCache(cache);
    }

    // Apply translated strings
    nodes.forEach((node) => {
      const original = originalTextsRef.current.get(node) || '';
      const trimmed = original.trim();
      const translated = cache[langCode][trimmed] || trimmed;
      if (!trimmed) return;
      node.textContent = original.replace(trimmed, translated);
    });

    document.documentElement.lang = langCode;
  }, [getTextNodes]);

  const handleSelect = useCallback(async (lang: typeof languages[0]) => {
    setSelected(lang);
    setIsOpen(false);
    localStorage.setItem('preferred_language', lang.code);

    setTranslating(true);
    try {
      if (lang.code === 'en') {
        restoreEnglish();
      } else {
        await applyTranslation(lang.code);
      }
    } finally {
      setTranslating(false);
    }
  }, [applyTranslation, restoreEnglish]);

  return (
    <div ref={ref} className="relative" data-no-translate="true">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 hover:bg-secondary rounded-lg transition-colors flex items-center gap-1"
        aria-label="Select Language"
        title="Change Language"
        disabled={translating}
      >
        <img src={languageIcon} alt="Language" className="w-8 h-8 object-contain" />
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
