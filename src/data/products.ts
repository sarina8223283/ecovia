import multaniMitti from '@/assets/products/multani-mitti.jpg';
import kasturiHaldi from '@/assets/products/kasturi-haldi.jpg';
import rithaPowder from '@/assets/products/ritha-powder.jpg';
import moringaPowder from '@/assets/products/moringa-powder.jpg';
import amlaPowder from '@/assets/products/amla-powder.jpg';
import shikakaiPowder from '@/assets/products/shikakai-powder.jpg';
import bhringrajPowder from '@/assets/products/bhringraj-powder.jpg';
import hibiscusPowder from '@/assets/products/hibiscus-powder.jpg';
import brahmiPowder from '@/assets/products/brahmi-powder.jpg';
import neemPowder from '@/assets/products/neem-powder.jpg';
import rosePetalsPowder from '@/assets/products/rose-petals-powder.jpg';
import coconutPowder from '@/assets/products/coconut-powder.jpg';
import onionPowder from '@/assets/products/onion-powder.jpg';
import orangePeelPowder from '@/assets/products/orange-peel-powder.jpg';

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: 'skin' | 'hair' | 'wellness';
}

export const products: Product[] = [
  {
    id: 'multani-mitti',
    name: 'Multani Mitti Powder',
    description: 'Natural clay powder that deeply cleanses pores, removes impurities, and leaves skin soft, refreshed, and glowing.',
    image: multaniMitti,
    category: 'skin',
  },
  {
    id: 'kasturi-haldi',
    name: 'Kasturi Haldi',
    description: 'Wild turmeric powder that brightens complexion, reduces blemishes, and provides natural antiseptic care for radiant skin.',
    image: kasturiHaldi,
    category: 'skin',
  },
  {
    id: 'ritha-powder',
    name: 'Ritha Powder',
    description: 'Natural soapnut powder that gently cleanses hair and scalp, adds shine, and promotes healthy hair growth.',
    image: rithaPowder,
    category: 'hair',
  },
  {
    id: 'moringa-powder',
    name: 'Moringa Powder',
    description: 'Nutrient-rich superfood powder packed with vitamins, antioxidants, and minerals for overall wellness and vitality.',
    image: moringaPowder,
    category: 'wellness',
  },
  {
    id: 'amla-powder',
    name: 'Amla Powder',
    description: 'Indian gooseberry powder rich in Vitamin C that strengthens hair, boosts immunity, and promotes digestive health.',
    image: amlaPowder,
    category: 'hair',
  },
  {
    id: 'shikakai-powder',
    name: 'Shikakai Powder',
    description: 'Traditional herb powder that naturally conditions hair, prevents dandruff, and promotes thick, lustrous locks.',
    image: shikakaiPowder,
    category: 'hair',
  },
  {
    id: 'bhringraj-powder',
    name: 'Bhringraj Powder',
    description: 'King of herbs for hair that reduces hair fall, prevents premature greying, and nourishes the scalp deeply.',
    image: bhringrajPowder,
    category: 'hair',
  },
  {
    id: 'hibiscus-powder',
    name: 'Hibiscus Powder',
    description: 'Flower powder that stimulates hair growth, adds natural color, and conditions hair for silky smooth texture.',
    image: hibiscusPowder,
    category: 'hair',
  },
  {
    id: 'brahmi-powder',
    name: 'Brahmi Powder',
    description: 'Ancient brain tonic that enhances memory, reduces stress, and promotes mental clarity and calm focus.',
    image: brahmiPowder,
    category: 'wellness',
  },
  {
    id: 'neem-powder',
    name: 'Neem Powder',
    description: 'Powerful antibacterial powder that purifies blood, treats skin conditions, and supports natural detoxification.',
    image: neemPowder,
    category: 'skin',
  },
  {
    id: 'rose-petals-powder',
    name: 'Rose Petals Powder',
    description: 'Delicate flower powder that tones skin, provides natural fragrance, and soothes sensitive complexions beautifully.',
    image: rosePetalsPowder,
    category: 'skin',
  },
  {
    id: 'coconut-powder',
    name: 'Coconut Powder',
    description: 'Nourishing powder rich in healthy fats that deeply moisturizes skin and hair. Doctor recommends mixing with water for a hydrating hair mask.',
    image: coconutPowder,
    category: 'hair',
  },
  {
    id: 'onion-powder',
    name: 'Onion Powder',
    description: 'Sulfur-rich powder that stimulates hair follicles, reduces hair fall, and promotes regrowth. Doctor recommends applying paste to scalp weekly.',
    image: onionPowder,
    category: 'hair',
  },
  {
    id: 'orange-peel-powder',
    name: 'Orange Peel Powder',
    description: 'Vitamin C rich powder that brightens skin, removes tan, and fights acne. Doctor recommends mixing with yogurt for a glowing face pack.',
    image: orangePeelPowder,
    category: 'skin',
  },
];