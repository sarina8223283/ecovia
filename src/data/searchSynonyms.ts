// Synonyms / aliases / common misspellings → product id
// Used by the internal product search so users (and AI agents) can find SKUs
// via Latin names, regional spellings, transliterations, and intended uses.
export const productSynonyms: Record<string, string[]> = {
  'amla-powder': ['amla', 'amalaki', 'indian gooseberry', 'emblica officinalis', 'emblica', 'avla', 'nellikai'],
  'shikakai-powder': ['shikakai', 'sheekakai', 'acacia concinna', 'shikakayi', 'sikakai', 'hair cleanser herb'],
  'ritha-powder': ['ritha', 'reetha', 'reeta', 'soapnut', 'soap nut', 'sapindus mukorossi', 'aritha'],
  'bhringraj-powder': ['bhringraj', 'bringraj', 'bhringaraj', 'eclipta alba', 'false daisy', 'kesharaj', 'king of hair'],
  'hibiscus-powder': ['hibiscus', 'jaswand', 'gudhal', 'hibiscus rosa sinensis', 'shoeflower'],
  'rose-petals-powder': ['rose', 'rose petal', 'rose petals', 'gulab', 'rosa damascena', 'damask rose'],
  'onion-powder': ['onion', 'red onion', 'allium cepa', 'kanda', 'pyaaz', 'sulfur for hair'],
  'coconut-powder': ['coconut', 'nariyal', 'cocos nucifera', 'desiccated coconut', 'copra'],
  'multani-mitti': ['multani mitti', 'multani', 'fullers earth', 'fuller earth', 'calcium bentonite', 'mulpani mitti', 'cosmetic clay'],
  'brahmi-powder': ['brahmi', 'bacopa monnieri', 'water hyssop', 'jalanimba'],
  'moringa-powder': ['moringa', 'drumstick leaf', 'moringa oleifera', 'sahjan', 'shevga'],
  'neem-powder': ['neem', 'azadirachta indica', 'nimba', 'margosa', 'indian lilac'],
  'kasturi-haldi': ['kasturi haldi', 'wild turmeric', 'curcuma aromatica', 'amba haldi', 'kasturi manjal', 'cosmetic turmeric'],
  'rosemary-powder': ['rosemary', 'rosmarinus officinalis', 'gulmehendi'],
  'orange-peel-powder': ['orange peel', 'orange', 'citrus sinensis', 'santra chilka', 'narangi peel'],
};

export const getSynonyms = (id: string): string[] => productSynonyms[id] || [];