// Mittika Cosmetic Grade Classification
// Repositions catalog as "Premium Botanical Raw Materials for DIY Skin Care, Hair Care,
// Soap Making, Cosmetic Formulations and Traditional Beauty Applications" — a safer
// compliance posture that keeps marketing aligned with cosmetic / topical intended use.

export interface ProductClassification {
  grade: string;                 // e.g. "Cosmetic Grade Botanical Raw Material"
  intendedUse: string;           // single primary purpose statement
  applications: string[];        // DIY use cases — formulations, masks, soap, etc.
  formats: string[];             // physical form / processing
  botanicalName?: string;        // INCI / Latin name
  partUsed?: string;             // leaf, fruit, peel, clay, etc.
  externalUseOnly: boolean;      // true when not food-certified
  diySuitable: boolean;
  safetyNotes: string[];         // patch test, sun sensitivity, etc.
  keywords: string[];            // AI-search / LLM grounding keywords
}

const COSMETIC_GRADE = 'Cosmetic Grade Botanical Raw Material';

const baseCosmetic = (): Pick<ProductClassification,
  'grade' | 'externalUseOnly' | 'diySuitable' | 'formats'
> => ({
  grade: COSMETIC_GRADE,
  externalUseOnly: true,
  diySuitable: true,
  formats: ['Finely milled powder', 'Single-ingredient', 'No additives, no preservatives'],
});

export const productClassifications: Record<string, ProductClassification> = {
  'amla-powder': {
    ...baseCosmetic(),
    intendedUse: 'Traditionally used in hair care and DIY cosmetic formulations.',
    applications: ['Hair masks', 'Herbal hair rinses', 'Henna mixes', 'Scalp pastes', 'Cosmetic formulations'],
    botanicalName: 'Emblica officinalis',
    partUsed: 'Dried fruit',
    safetyNotes: ['For external use only', 'Patch test before first use'],
    keywords: ['amla powder', 'emblica officinalis powder', 'cosmetic grade amla', 'DIY hair mask raw material', 'natural hair care powder'],
  },
  'shikakai-powder': {
    ...baseCosmetic(),
    intendedUse: 'Traditionally used as a natural hair-cleansing raw material in DIY formulations.',
    applications: ['Herbal shampoo blends', 'Hair masks', 'Cleansing pastes', 'Soap making'],
    botanicalName: 'Acacia concinna',
    partUsed: 'Dried pods',
    safetyNotes: ['For external use only', 'Avoid direct eye contact'],
    keywords: ['shikakai powder', 'acacia concinna', 'natural hair cleanser raw material', 'herbal shampoo ingredient'],
  },
  'ritha-powder': {
    ...baseCosmetic(),
    intendedUse: 'Traditionally used as a natural surfactant raw material for hair and body cleansers.',
    applications: ['Herbal shampoos', 'Natural body wash blends', 'Soap making', 'Eco-cleansers'],
    botanicalName: 'Sapindus mukorossi',
    partUsed: 'Dried soapnut',
    safetyNotes: ['For external use only', 'Avoid eye contact'],
    keywords: ['reetha powder', 'soapnut powder', 'sapindus mukorossi', 'natural surfactant raw material'],
  },
  'bhringraj-powder': {
    ...baseCosmetic(),
    intendedUse: 'Traditionally used in hair-care formulations and scalp pastes.',
    applications: ['Hair masks', 'Oil infusions', 'Scalp pastes', 'Herbal hair blends'],
    botanicalName: 'Eclipta alba',
    partUsed: 'Leaf',
    safetyNotes: ['For external use only', 'Patch test before first use'],
    keywords: ['bhringraj powder', 'eclipta alba', 'cosmetic grade hair powder', 'DIY hair mask ingredient'],
  },
  'hibiscus-powder': {
    ...baseCosmetic(),
    intendedUse: 'Traditionally used in hair-care formulations and natural hair rinses.',
    applications: ['Hair masks', 'Herbal hair rinses', 'Henna blends', 'Soap colorant'],
    botanicalName: 'Hibiscus rosa-sinensis',
    partUsed: 'Dried flower',
    safetyNotes: ['For external use only', 'May tint very light hair'],
    keywords: ['hibiscus powder', 'hibiscus rosa sinensis', 'cosmetic grade flower powder', 'natural hair colorant'],
  },
  'rose-petals-powder': {
    ...baseCosmetic(),
    intendedUse: 'Traditionally used in skin-care formulations and aromatic bath blends.',
    applications: ['Face packs', 'Ubtan blends', 'Bath soaks', 'Soap making', 'Lip scrub formulations'],
    botanicalName: 'Rosa damascena',
    partUsed: 'Dried petals',
    safetyNotes: ['For external use only', 'Patch test recommended'],
    keywords: ['rose petal powder', 'rosa damascena powder', 'cosmetic grade flower powder', 'DIY skin care raw material'],
  },
  'onion-powder': {
    ...baseCosmetic(),
    intendedUse: 'Traditionally used in scalp-care formulations and DIY hair-oil infusions.',
    applications: ['Scalp pastes', 'Hair masks', 'Oil infusions'],
    botanicalName: 'Allium cepa',
    partUsed: 'Dehydrated red onion',
    safetyNotes: ['For external use only', 'Patch test — may tingle on sensitive scalps', 'Avoid eye contact'],
    keywords: ['onion powder cosmetic', 'allium cepa powder', 'sulfur rich hair raw material', 'DIY scalp formulation'],
  },
  'coconut-powder': {
    ...baseCosmetic(),
    intendedUse: 'Traditionally used in DIY skin and hair cosmetic formulations.',
    applications: ['Hair masks', 'Body scrubs', 'Face packs for dry skin', 'Soap making'],
    botanicalName: 'Cocos nucifera',
    partUsed: 'Desiccated kernel',
    safetyNotes: ['For external cosmetic use', 'Patch test if acne-prone'],
    keywords: ['coconut powder cosmetic grade', 'desiccated coconut raw material', 'DIY body scrub ingredient'],
  },
  'multani-mitti': {
    ...baseCosmetic(),
    intendedUse: 'Traditionally used as a clay raw material in face packs and body packs.',
    applications: ['Face packs', 'Body packs', 'Soap making', 'Ubtan blends'],
    botanicalName: 'Fuller’s Earth (Calcium bentonite)',
    partUsed: 'Natural mineral clay',
    safetyNotes: ['For external use only', 'Moisturise after rinsing'],
    keywords: ['multani mitti', 'fullers earth powder', 'cosmetic grade clay', 'DIY face pack raw material'],
  },
  'brahmi-powder': {
    ...baseCosmetic(),
    intendedUse: 'Traditionally used in hair-care and scalp formulations.',
    applications: ['Hair masks', 'Scalp oil infusions', 'Herbal hair blends'],
    botanicalName: 'Bacopa monnieri',
    partUsed: 'Leaf',
    safetyNotes: ['For external use only', 'Patch test before first use'],
    keywords: ['brahmi powder', 'bacopa monnieri powder', 'cosmetic grade hair raw material'],
  },
  'moringa-powder': {
    ...baseCosmetic(),
    intendedUse: 'Traditionally used in DIY skin-care formulations and cosmetic blends.',
    applications: ['Face packs', 'Hair masks', 'Soap making', 'Cosmetic formulations'],
    botanicalName: 'Moringa oleifera',
    partUsed: 'Leaf',
    safetyNotes: ['For external cosmetic use', 'Patch test recommended'],
    keywords: ['moringa powder cosmetic', 'moringa oleifera leaf powder', 'antioxidant skin care raw material'],
  },
  'neem-powder': {
    ...baseCosmetic(),
    intendedUse: 'Traditionally used in skin-care and scalp-care formulations.',
    applications: ['Face packs', 'Scalp pastes', 'Soap making', 'Spot treatment blends'],
    botanicalName: 'Azadirachta indica',
    partUsed: 'Leaf',
    safetyNotes: ['For external use only', 'Dilute — potent; patch test first', 'Avoid during pregnancy'],
    keywords: ['neem powder', 'azadirachta indica powder', 'cosmetic grade neem', 'DIY acne face pack raw material'],
  },
  'kasturi-haldi': {
    ...baseCosmetic(),
    intendedUse: 'Traditionally used as a cosmetic turmeric raw material — non-staining, for facial formulations.',
    applications: ['Brightening face packs', 'Bridal ubtan', 'Spot-treatment blends', 'Soap making'],
    botanicalName: 'Curcuma aromatica',
    partUsed: 'Wild turmeric rhizome',
    safetyNotes: ['For external cosmetic use only — not for culinary use', 'Patch test if turmeric-sensitive'],
    keywords: ['kasturi haldi', 'wild turmeric powder', 'curcuma aromatica', 'cosmetic grade turmeric raw material'],
  },
  'rosemary-powder': {
    ...baseCosmetic(),
    intendedUse: 'Traditionally used in hair-care formulations and DIY scalp tonics.',
    applications: ['Hair-oil infusions', 'Scalp rinses', 'Hair masks', 'Soap making'],
    botanicalName: 'Rosmarinus officinalis',
    partUsed: 'Leaf',
    safetyNotes: ['For external use only', 'Avoid during pregnancy'],
    keywords: ['rosemary powder', 'rosmarinus officinalis powder', 'cosmetic grade herbal raw material'],
  },
  'orange-peel-powder': {
    ...baseCosmetic(),
    intendedUse: 'Traditionally used in skin-brightening face packs and exfoliating cosmetic blends.',
    applications: ['Face packs', 'Gentle exfoliating scrubs', 'Soap making', 'Ubtan blends'],
    botanicalName: 'Citrus sinensis',
    partUsed: 'Sun-dried peel',
    safetyNotes: ['For external use only', 'Citrus can increase photosensitivity — use sunscreen after'],
    keywords: ['orange peel powder', 'citrus sinensis peel powder', 'cosmetic grade exfoliant raw material'],
  },
};

export const getClassification = (id: string): ProductClassification | undefined =>
  productClassifications[id];