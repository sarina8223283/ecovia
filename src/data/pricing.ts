// Product pricing with original and discounted prices
export interface PriceTier {
  grams: number;
  label: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
}

export interface ProductPricing {
  productId: string;
  tiers: PriceTier[];
}

export const productPricing: Record<string, PriceTier[]> = {
  'multani-mitti': [
    { grams: 50, label: '50g', originalPrice: 80, discountedPrice: 30, discountPercent: 63 },
    { grams: 100, label: '100g', originalPrice: 120, discountedPrice: 50, discountPercent: 58 },
    { grams: 250, label: '250g', originalPrice: 240, discountedPrice: 120, discountPercent: 50 },
    { grams: 500, label: '500g', originalPrice: 350, discountedPrice: 200, discountPercent: 43 },
    { grams: 1000, label: '1 Kg', originalPrice: 550, discountedPrice: 350, discountPercent: 36 },
    { grams: 5000, label: '5 Kg', originalPrice: 1500, discountedPrice: 1000, discountPercent: 33 },
    { grams: 10000, label: '10 Kg', originalPrice: 2500, discountedPrice: 1800, discountPercent: 28 },
  ],
  'kasturi-haldi': [
    { grams: 50, label: '50g', originalPrice: 120, discountedPrice: 60, discountPercent: 50 },
    { grams: 100, label: '100g', originalPrice: 220, discountedPrice: 100, discountPercent: 55 },
    { grams: 250, label: '250g', originalPrice: 450, discountedPrice: 220, discountPercent: 51 },
    { grams: 500, label: '500g', originalPrice: 700, discountedPrice: 380, discountPercent: 46 },
    { grams: 1000, label: '1 Kg', originalPrice: 1200, discountedPrice: 650, discountPercent: 46 },
    { grams: 5000, label: '5 Kg', originalPrice: 3500, discountedPrice: 2500, discountPercent: 29 },
    { grams: 10000, label: '10 Kg', originalPrice: 6000, discountedPrice: 4000, discountPercent: 33 },
  ],
  'ritha-powder': [
    { grams: 50, label: '50g', originalPrice: 100, discountedPrice: 50, discountPercent: 50 },
    { grams: 100, label: '100g', originalPrice: 180, discountedPrice: 90, discountPercent: 50 },
    { grams: 250, label: '250g', originalPrice: 380, discountedPrice: 200, discountPercent: 47 },
    { grams: 500, label: '500g', originalPrice: 650, discountedPrice: 350, discountPercent: 46 },
    { grams: 1000, label: '1 Kg', originalPrice: 1000, discountedPrice: 600, discountPercent: 40 },
    { grams: 5000, label: '5 Kg', originalPrice: 3000, discountedPrice: 2200, discountPercent: 27 },
    { grams: 10000, label: '10 Kg', originalPrice: 5000, discountedPrice: 3800, discountPercent: 24 },
  ],
  'moringa-powder': [
    { grams: 50, label: '50g', originalPrice: 150, discountedPrice: 80, discountPercent: 47 },
    { grams: 100, label: '100g', originalPrice: 260, discountedPrice: 140, discountPercent: 46 },
    { grams: 250, label: '250g', originalPrice: 550, discountedPrice: 300, discountPercent: 45 },
    { grams: 500, label: '500g', originalPrice: 900, discountedPrice: 500, discountPercent: 44 },
    { grams: 1000, label: '1 Kg', originalPrice: 1200, discountedPrice: 800, discountPercent: 33 },
    { grams: 5000, label: '5 Kg', originalPrice: 4500, discountedPrice: 3500, discountPercent: 22 },
    { grams: 10000, label: '10 Kg', originalPrice: 8000, discountedPrice: 6500, discountPercent: 19 },
  ],
  'amla-powder': [
    { grams: 50, label: '50g', originalPrice: 130, discountedPrice: 70, discountPercent: 46 },
    { grams: 100, label: '100g', originalPrice: 240, discountedPrice: 120, discountPercent: 50 },
    { grams: 250, label: '250g', originalPrice: 500, discountedPrice: 280, discountPercent: 44 },
    { grams: 500, label: '500g', originalPrice: 850, discountedPrice: 500, discountPercent: 41 },
    { grams: 1000, label: '1 Kg', originalPrice: 1300, discountedPrice: 850, discountPercent: 35 },
    { grams: 5000, label: '5 Kg', originalPrice: 4500, discountedPrice: 3600, discountPercent: 20 },
    { grams: 10000, label: '10 Kg', originalPrice: 8500, discountedPrice: 6800, discountPercent: 20 },
  ],
  'shikakai-powder': [
    { grams: 50, label: '50g', originalPrice: 120, discountedPrice: 60, discountPercent: 50 },
    { grams: 100, label: '100g', originalPrice: 200, discountedPrice: 100, discountPercent: 50 },
    { grams: 250, label: '250g', originalPrice: 420, discountedPrice: 230, discountPercent: 45 },
    { grams: 500, label: '500g', originalPrice: 750, discountedPrice: 420, discountPercent: 44 },
    { grams: 1000, label: '1 Kg', originalPrice: 1200, discountedPrice: 750, discountPercent: 38 },
    { grams: 5000, label: '5 Kg', originalPrice: 4000, discountedPrice: 3000, discountPercent: 25 },
    { grams: 10000, label: '10 Kg', originalPrice: 7000, discountedPrice: 5800, discountPercent: 17 },
  ],
  'bhringraj-powder': [
    { grams: 50, label: '50g', originalPrice: 120, discountedPrice: 60, discountPercent: 50 },
    { grams: 100, label: '100g', originalPrice: 220, discountedPrice: 110, discountPercent: 50 },
    { grams: 250, label: '250g', originalPrice: 450, discountedPrice: 250, discountPercent: 44 },
    { grams: 500, label: '500g', originalPrice: 800, discountedPrice: 450, discountPercent: 44 },
    { grams: 1000, label: '1 Kg', originalPrice: 1250, discountedPrice: 800, discountPercent: 36 },
    { grams: 5000, label: '5 Kg', originalPrice: 4200, discountedPrice: 3200, discountPercent: 24 },
    { grams: 10000, label: '10 Kg', originalPrice: 7500, discountedPrice: 6000, discountPercent: 20 },
  ],
  'hibiscus-powder': [
    { grams: 50, label: '50g', originalPrice: 180, discountedPrice: 90, discountPercent: 50 },
    { grams: 100, label: '100g', originalPrice: 300, discountedPrice: 160, discountPercent: 47 },
    { grams: 250, label: '250g', originalPrice: 650, discountedPrice: 380, discountPercent: 42 },
    { grams: 500, label: '500g', originalPrice: 1200, discountedPrice: 700, discountPercent: 42 },
    { grams: 1000, label: '1 Kg', originalPrice: 1800, discountedPrice: 1200, discountPercent: 33 },
    { grams: 5000, label: '5 Kg', originalPrice: 6500, discountedPrice: 5000, discountPercent: 23 },
    { grams: 10000, label: '10 Kg', originalPrice: 11000, discountedPrice: 9000, discountPercent: 18 },
  ],
  'rose-petals-powder': [
    { grams: 50, label: '50g', originalPrice: 220, discountedPrice: 120, discountPercent: 45 },
    { grams: 100, label: '100g', originalPrice: 400, discountedPrice: 220, discountPercent: 45 },
    { grams: 250, label: '250g', originalPrice: 850, discountedPrice: 520, discountPercent: 39 },
    { grams: 500, label: '500g', originalPrice: 1500, discountedPrice: 900, discountPercent: 40 },
    { grams: 1000, label: '1 Kg', originalPrice: 2500, discountedPrice: 1800, discountPercent: 28 },
    { grams: 5000, label: '5 Kg', originalPrice: 9000, discountedPrice: 7500, discountPercent: 17 },
    { grams: 10000, label: '10 Kg', originalPrice: 16000, discountedPrice: 13000, discountPercent: 19 },
  ],
  'rosemary-powder': [
    { grams: 50, label: '50g', originalPrice: 180, discountedPrice: 100, discountPercent: 44 },
    { grams: 100, label: '100g', originalPrice: 320, discountedPrice: 180, discountPercent: 44 },
    { grams: 250, label: '250g', originalPrice: 700, discountedPrice: 400, discountPercent: 43 },
    { grams: 500, label: '500g', originalPrice: 1200, discountedPrice: 700, discountPercent: 42 },
    { grams: 1000, label: '1 Kg', originalPrice: 1800, discountedPrice: 1200, discountPercent: 33 },
    { grams: 5000, label: '5 Kg', originalPrice: 7000, discountedPrice: 5000, discountPercent: 29 },
    { grams: 10000, label: '10 Kg', originalPrice: 11500, discountedPrice: 9000, discountPercent: 22 },
  ],
  'neem-powder': [
    { grams: 50, label: '50g', originalPrice: 120, discountedPrice: 60, discountPercent: 50 },
    { grams: 100, label: '100g', originalPrice: 220, discountedPrice: 110, discountPercent: 50 },
    { grams: 250, label: '250g', originalPrice: 450, discountedPrice: 250, discountPercent: 44 },
    { grams: 500, label: '500g', originalPrice: 800, discountedPrice: 450, discountPercent: 44 },
    { grams: 1000, label: '1 Kg', originalPrice: 1200, discountedPrice: 800, discountPercent: 33 },
    { grams: 5000, label: '5 Kg', originalPrice: 4000, discountedPrice: 3200, discountPercent: 20 },
    { grams: 10000, label: '10 Kg', originalPrice: 7500, discountedPrice: 6000, discountPercent: 20 },
  ],
  'coconut-powder': [
    { grams: 50, label: '50g', originalPrice: 150, discountedPrice: 80, discountPercent: 47 },
    { grams: 100, label: '100g', originalPrice: 260, discountedPrice: 140, discountPercent: 46 },
    { grams: 250, label: '250g', originalPrice: 550, discountedPrice: 300, discountPercent: 45 },
    { grams: 500, label: '500g', originalPrice: 900, discountedPrice: 500, discountPercent: 44 },
    { grams: 1000, label: '1 Kg', originalPrice: 1300, discountedPrice: 900, discountPercent: 31 },
    { grams: 5000, label: '5 Kg', originalPrice: 4800, discountedPrice: 3800, discountPercent: 21 },
    { grams: 10000, label: '10 Kg', originalPrice: 9000, discountedPrice: 7000, discountPercent: 22 },
  ],
  'onion-powder': [
    { grams: 50, label: '50g', originalPrice: 180, discountedPrice: 100, discountPercent: 44 },
    { grams: 100, label: '100g', originalPrice: 320, discountedPrice: 180, discountPercent: 44 },
    { grams: 250, label: '250g', originalPrice: 700, discountedPrice: 400, discountPercent: 43 },
    { grams: 500, label: '500g', originalPrice: 1200, discountedPrice: 700, discountPercent: 42 },
    { grams: 1000, label: '1 Kg', originalPrice: 1800, discountedPrice: 1200, discountPercent: 33 },
    { grams: 5000, label: '5 Kg', originalPrice: 7000, discountedPrice: 5000, discountPercent: 29 },
    { grams: 10000, label: '10 Kg', originalPrice: 11500, discountedPrice: 9000, discountPercent: 22 },
  ],
  'orange-peel-powder': [
    { grams: 50, label: '50g', originalPrice: 160, discountedPrice: 90, discountPercent: 44 },
    { grams: 100, label: '100g', originalPrice: 280, discountedPrice: 160, discountPercent: 43 },
    { grams: 250, label: '250g', originalPrice: 600, discountedPrice: 380, discountPercent: 37 },
    { grams: 500, label: '500g', originalPrice: 1000, discountedPrice: 600, discountPercent: 40 },
    { grams: 1000, label: '1 Kg', originalPrice: 1500, discountedPrice: 1000, discountPercent: 33 },
    { grams: 5000, label: '5 Kg', originalPrice: 5500, discountedPrice: 4200, discountPercent: 24 },
    { grams: 10000, label: '10 Kg', originalPrice: 9500, discountedPrice: 7500, discountPercent: 21 },
  ],
  'brahmi-powder': [
    { grams: 50, label: '50g', originalPrice: 120, discountedPrice: 60, discountPercent: 50 },
    { grams: 100, label: '100g', originalPrice: 220, discountedPrice: 110, discountPercent: 50 },
    { grams: 250, label: '250g', originalPrice: 450, discountedPrice: 250, discountPercent: 44 },
    { grams: 500, label: '500g', originalPrice: 800, discountedPrice: 450, discountPercent: 44 },
    { grams: 1000, label: '1 Kg', originalPrice: 1200, discountedPrice: 800, discountPercent: 33 },
    { grams: 5000, label: '5 Kg', originalPrice: 4000, discountedPrice: 3200, discountPercent: 20 },
    { grams: 10000, label: '10 Kg', originalPrice: 7500, discountedPrice: 6000, discountPercent: 20 },
  ],
};

export const getProductPricing = (productId: string): PriceTier[] => {
  return productPricing[productId] || [];
};

export const getPriceForQuantity = (productId: string, grams: number): PriceTier | undefined => {
  const tiers = productPricing[productId];
  if (!tiers) return undefined;
  return tiers.find(t => t.grams === grams);
};
