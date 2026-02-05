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
 import rosemaryPowder from '@/assets/products/rosemary-powder.jpg';
 
 export interface FAQ {
   question: string;
   answer: string;
 }
 
 export interface Product {
   id: string;
   name: string;
   description: string;
   fullDescription: string;
   image: string;
   category: 'skin' | 'hair' | 'wellness';
   benefits: string[];
   directions: string[];
   ingredients: string;
   faqs: FAQ[];
   themeColor: string;
   pricePerGram: number;
 }
 
 export const products: Product[] = [
   {
     id: 'amla-powder',
     name: 'Amla Powder',
     description: 'Indian gooseberry powder rich in Vitamin C that strengthens hair, boosts immunity, and promotes digestive health.',
     fullDescription: 'Our 100% pure Amla Powder is derived from premium Indian Gooseberries (Emblica officinalis), one of the most revered fruits in Ayurveda. Known as the "Mother of Herbs," Amla has been used for centuries to promote lustrous hair, glowing skin, and overall wellness. Rich in Vitamin C and antioxidants, this superfood powder supports natural beauty from within.',
     image: amlaPowder,
     category: 'hair',
     benefits: [
       'Strengthens hair follicles and reduces hair fall',
       'Rich in Vitamin C for boosted immunity',
       'Promotes natural hair growth and thickness',
       'Improves digestion and metabolism',
       'Natural antioxidant that fights free radicals',
       'Enhances skin radiance when used topically'
     ],
     directions: [
       'For Hair: Mix 2-3 tablespoons with water to form a paste. Apply to scalp and hair, leave for 30-45 minutes, then rinse.',
       'For Skin: Mix 1 tablespoon with rose water or yogurt. Apply as face pack for 15-20 minutes.',
       'For Wellness: Add 1 teaspoon to warm water or smoothies daily for immunity boost.',
       'Storage: Keep in a cool, dry place away from direct sunlight.'
     ],
     ingredients: '100% Pure Amla (Indian Gooseberry) Powder - No additives, no preservatives',
     faqs: [
       { question: 'Can I use Amla powder daily on my hair?', answer: 'Yes, you can use Amla powder 2-3 times a week for best results. Daily use as a hair oil with carrier oils is also beneficial.' },
       { question: 'Does Amla powder darken grey hair?', answer: 'Amla powder can help prevent premature greying and may gradually darken grey hair with regular use over several months.' },
       { question: 'Is this Amla powder edible?', answer: 'Yes, our Amla powder is food-grade and can be consumed. Add to water, juices, or smoothies for immunity benefits.' },
       { question: 'How long does it take to see results on hair?', answer: 'With consistent use 2-3 times weekly, you may notice reduced hair fall within 4-6 weeks and improved hair texture within 8-12 weeks.' }
     ],
     themeColor: '85 45% 40%',
     pricePerGram: 0.50
   },
   {
     id: 'shikakai-powder',
     name: 'Shikakai Powder',
     description: 'Traditional herb powder that naturally conditions hair, prevents dandruff, and promotes thick, lustrous locks.',
     fullDescription: 'Shikakai, meaning "fruit for hair," is a treasured Ayurvedic ingredient used for centuries as a natural hair cleanser. Our pure Shikakai Powder gently cleanses without stripping natural oils, while conditioning and strengthening each strand. It\'s the perfect chemical-free alternative to modern shampoos.',
     image: shikakaiPowder,
     category: 'hair',
     benefits: [
       'Natural hair cleanser without harsh chemicals',
       'Conditions and softens hair naturally',
       'Prevents and treats dandruff effectively',
       'Promotes hair growth and thickness',
       'Detangles hair and adds natural shine',
       'Strengthens hair roots and reduces breakage'
     ],
     directions: [
       'As Shampoo: Mix 3-4 tablespoons with warm water to make a paste. Apply to wet hair, massage gently, leave for 5 minutes, then rinse.',
       'Hair Mask: Combine with Amla and Reetha powder in equal parts. Apply for 30 minutes before washing.',
       'Pre-wash Treatment: Apply paste to dry hair 30 minutes before washing for deep conditioning.',
       'Note: Shikakai naturally has low pH and won\'t lather like commercial shampoo.'
     ],
     ingredients: '100% Pure Shikakai (Acacia Concinna) Powder - Naturally sourced, no chemicals',
     faqs: [
       { question: 'Why doesn\'t Shikakai lather like regular shampoo?', answer: 'Shikakai is a natural cleanser that works without sodium lauryl sulfate (SLS), so it doesn\'t produce foam. It cleans effectively through its natural saponins.' },
       { question: 'Can I use Shikakai on colored hair?', answer: 'Yes, Shikakai is gentle and safe for colored or chemically treated hair. It may actually help maintain color longer.' },
       { question: 'How often should I wash hair with Shikakai?', answer: 'You can use Shikakai 2-3 times per week as your regular hair cleanser. Adjust based on your hair type and needs.' },
       { question: 'Is Shikakai suitable for all hair types?', answer: 'Yes, Shikakai is gentle enough for all hair types including oily, dry, curly, and straight hair.' }
     ],
     themeColor: '35 50% 35%',
     pricePerGram: 0.45
   },
   {
     id: 'ritha-powder',
     name: 'Ritha Powder',
     description: 'Natural soapnut powder that gently cleanses hair and scalp, adds shine, and promotes healthy hair growth.',
     fullDescription: 'Ritha, also known as Soapnut or Reetha, is nature\'s own soap. Our premium Ritha Powder is made from handpicked soapnuts, providing a gentle yet effective cleansing experience. Rich in natural saponins, it creates a mild lather that removes dirt and excess oil while keeping your hair soft and shiny.',
     image: rithaPowder,
     category: 'hair',
     benefits: [
       'Natural surfactant that creates gentle lather',
       'Removes dirt and excess oil effectively',
       'Safe for sensitive scalps and skin',
       'Adds natural volume and bounce to hair',
       'Eco-friendly and biodegradable cleanser',
       'Can be used as natural fabric softener'
     ],
     directions: [
       'Hair Wash: Mix 2-3 tablespoons with warm water, let soak for 10 minutes. Apply to scalp, massage, and rinse thoroughly.',
       'Combined Wash: Mix equal parts Ritha, Shikakai, and Amla for a complete hair care solution.',
       'Body Wash: Dilute in water and use as a gentle, natural body cleanser.',
       'Tip: Strain the mixture through a cloth to remove any particles before application.'
     ],
     ingredients: '100% Pure Ritha (Sapindus Mukorossi) Powder - Wild harvested, chemical-free',
     faqs: [
       { question: 'Is Ritha safe for baby hair?', answer: 'Yes, Ritha is extremely gentle and safe for babies. Its natural cleansing properties are mild enough for sensitive baby skin and hair.' },
       { question: 'Can Ritha cause hair dryness?', answer: 'Unlike chemical shampoos, Ritha cleanses without stripping natural oils. If you feel dryness, reduce frequency or mix with conditioning herbs like Amla.' },
       { question: 'How is Ritha different from chemical shampoos?', answer: 'Ritha uses natural saponins instead of harsh sulfates. It cleans effectively while being gentler on hair, scalp, and the environment.' },
       { question: 'Can I use Ritha for laundry?', answer: 'Yes! Ritha is an excellent natural detergent for delicate fabrics and baby clothes. It\'s hypoallergenic and eco-friendly.' }
     ],
     themeColor: '30 40% 40%',
     pricePerGram: 0.40
   },
   {
     id: 'bhringraj-powder',
     name: 'Bhringraj Powder',
     description: 'King of herbs for hair that reduces hair fall, prevents premature greying, and nourishes the scalp deeply.',
     fullDescription: 'Known as "Keshraja" or the King of Hair, Bhringraj has been revered in Ayurveda for thousands of years. Our pure Bhringraj Powder is your natural solution for all hair concerns - from hair fall to premature greying. It deeply nourishes the scalp, strengthens hair roots, and promotes thick, healthy hair growth.',
     image: bhringrajPowder,
     category: 'hair',
     benefits: [
       'Significantly reduces hair fall and breakage',
       'Prevents and reverses premature greying',
       'Promotes rapid hair growth',
       'Deeply conditions dry, damaged hair',
       'Treats dandruff and scalp conditions',
       'Adds natural black sheen to hair'
     ],
     directions: [
       'Hair Mask: Mix 3 tablespoons with coconut or sesame oil. Apply to scalp, massage for 10 minutes, leave overnight or for 2 hours, then wash.',
       'Quick Treatment: Make paste with water, apply to scalp for 30 minutes before washing.',
       'Hair Oil: Infuse powder in warm coconut oil for a week. Use as regular hair oil.',
       'For best results, use consistently 2-3 times per week.'
     ],
     ingredients: '100% Pure Bhringraj (Eclipta Alba) Powder - Organically grown, sun-dried',
     faqs: [
       { question: 'Can Bhringraj regrow hair on bald patches?', answer: 'Bhringraj can stimulate dormant hair follicles and promote regrowth in areas of thinning. Results vary based on the cause and duration of hair loss.' },
       { question: 'How long until I see results for grey hair?', answer: 'With consistent use, you may notice gradual darkening of grey hair within 3-6 months. Results depend on individual factors.' },
       { question: 'Can I mix Bhringraj with other hair powders?', answer: 'Absolutely! Bhringraj works wonderfully with Amla, Brahmi, and Hibiscus for enhanced benefits.' },
       { question: 'Is Bhringraj safe during pregnancy?', answer: 'Topical use is generally considered safe. However, consult your healthcare provider before use during pregnancy.' }
     ],
     themeColor: '120 25% 35%',
     pricePerGram: 0.55
   },
   {
     id: 'hibiscus-powder',
     name: 'Hibiscus Powder',
     description: 'Flower powder that stimulates hair growth, adds natural color, and conditions hair for silky smooth texture.',
     fullDescription: 'Our vibrant Hibiscus Powder is made from premium dried hibiscus flowers (Hibiscus rosa-sinensis), known as the "Flower of Hair Care." This beautiful red powder is packed with amino acids, vitamins, and natural conditioning agents that transform dull, lifeless hair into silky, voluminous locks.',
     image: hibiscusPowder,
     category: 'hair',
     benefits: [
       'Stimulates hair follicles for faster growth',
       'Natural conditioner for silky, soft hair',
       'Adds reddish highlights to dark hair',
       'Prevents split ends and breakage',
       'Controls excess oil production',
       'Rich in antioxidants for scalp health'
     ],
     directions: [
       'Hair Mask: Mix 2-3 tablespoons with yogurt or coconut milk. Apply to hair, leave for 30-45 minutes, rinse well.',
       'Natural Color: Mix with henna for enhanced red tones in hair.',
       'Scalp Treatment: Make paste with water, apply to scalp, massage gently, leave for 20 minutes.',
       'Conditioning: Add to your regular hair mask recipes for extra conditioning.'
     ],
     ingredients: '100% Pure Hibiscus Flower Powder - Shade-dried to preserve nutrients',
     faqs: [
       { question: 'Will Hibiscus powder change my hair color?', answer: 'Hibiscus can add subtle reddish-burgundy tones to dark hair with regular use. The effect is gradual and natural-looking.' },
       { question: 'Can I use Hibiscus on blonde or light hair?', answer: 'Hibiscus may impart a noticeable pink or red tint on lighter hair. Test on a small section first if you have light-colored hair.' },
       { question: 'Is Hibiscus good for thinning hair?', answer: 'Yes! Hibiscus stimulates blood circulation to the scalp and nourishes hair follicles, promoting thicker, healthier hair growth.' },
       { question: 'Can I use Hibiscus powder daily?', answer: 'For hair masks, 2-3 times per week is ideal. Daily use as a rinse (steeped in water) is also beneficial.' }
     ],
     themeColor: '340 60% 45%',
     pricePerGram: 0.48
   },
   {
     id: 'rose-petals-powder',
     name: 'Rose Petals Powder',
     description: 'Delicate flower powder that tones skin, provides natural fragrance, and soothes sensitive complexions beautifully.',
     fullDescription: 'Experience the luxury of pure Rose Petal Powder, crafted from hand-picked damascena roses. This exquisite powder carries the timeless beauty secrets of royalty. Rich in natural oils and antioxidants, it gently tones, hydrates, and adds a natural glow to your skin while enveloping you in the divine fragrance of roses.',
     image: rosePetalsPowder,
     category: 'skin',
     benefits: [
       'Natural skin toner and astringent',
       'Soothes sensitive and irritated skin',
       'Provides deep hydration and moisture',
       'Anti-aging properties reduce fine lines',
       'Natural fragrance for aromatherapy benefits',
       'Balances skin pH and controls oiliness'
     ],
     directions: [
       'Face Pack: Mix 2 tablespoons with rose water or milk. Apply evenly, leave for 20 minutes, rinse with cool water.',
       'Toner: Mix 1 teaspoon in distilled water, strain, use as natural face mist.',
       'Bath Soak: Add 4-5 tablespoons to bathwater for a luxurious, aromatic experience.',
       'Lip Care: Mix with honey for a natural lip scrub.'
     ],
     ingredients: '100% Pure Rose Petal Powder - Handpicked Rosa Damascena, no artificial fragrance',
     faqs: [
       { question: 'Is Rose Petal Powder suitable for oily skin?', answer: 'Yes! Rose powder has natural astringent properties that help control excess oil while keeping skin hydrated.' },
       { question: 'Can I use this for anti-aging?', answer: 'Rose petals are rich in antioxidants and vitamin C, which help fight free radicals and reduce signs of aging with regular use.' },
       { question: 'How does rose powder help with acne?', answer: 'Rose powder has antibacterial and anti-inflammatory properties that can help soothe acne-prone skin and reduce redness.' },
       { question: 'Can I ingest Rose Petal Powder?', answer: 'Our rose petal powder is cosmetic grade. For edible rose powder, please look for food-grade certified products.' }
     ],
     themeColor: '350 55% 55%',
     pricePerGram: 0.60
   },
   {
     id: 'onion-powder',
     name: 'Onion Powder',
     description: 'Sulfur-rich powder that stimulates hair follicles, reduces hair fall, and promotes regrowth naturally.',
     fullDescription: 'Harness the power of onions for incredible hair growth with our pure Onion Powder. Rich in sulfur, quercetin, and antioxidants, this potent powder has been scientifically shown to boost collagen production, improve blood circulation to the scalp, and significantly reduce hair fall. Transform thin, weak hair into thick, voluminous locks.',
     image: onionPowder,
     category: 'hair',
     benefits: [
       'High sulfur content boosts collagen and keratin',
       'Significantly reduces hair fall',
       'Stimulates dormant hair follicles',
       'Improves blood circulation to scalp',
       'Fights scalp infections and dandruff',
       'Adds strength and shine to hair'
     ],
     directions: [
       'Hair Mask: Mix 2 tablespoons with coconut oil or yogurt. Apply to scalp, leave for 30-45 minutes, wash thoroughly with mild shampoo.',
       'Spot Treatment: Make thick paste with water, apply to thinning areas, leave for 20 minutes.',
       'Hair Oil: Infuse in warm oil for a week, strain, and use as scalp massage oil.',
       'Note: Strong smell is normal; wash with aromatic shampoo to neutralize.'
     ],
     ingredients: '100% Pure Onion Powder - Dehydrated red onions, no additives',
     faqs: [
       { question: 'Does Onion Powder smell bad?', answer: 'Yes, onion has a strong natural smell. The smell washes away after shampooing. You can add essential oils to mask the scent.' },
       { question: 'How long until I see hair regrowth?', answer: 'Most users notice reduced hair fall within 4-6 weeks. Visible regrowth typically appears after 3-4 months of consistent use.' },
       { question: 'Can Onion Powder irritate the scalp?', answer: 'Some people may experience mild tingling. If you have a sensitive scalp, do a patch test first and dilute with oil.' },
       { question: 'Is this effective for alopecia?', answer: 'Studies show onion juice can help with patchy alopecia. Results vary; consult a dermatologist for severe hair loss.' }
     ],
     themeColor: '40 60% 40%',
     pricePerGram: 0.35
   },
   {
     id: 'coconut-powder',
     name: 'Coconut Powder',
     description: 'Nourishing powder rich in healthy fats that deeply moisturizes skin and hair for ultimate hydration.',
     fullDescription: 'Our premium Coconut Powder captures all the moisturizing benefits of fresh coconuts in a convenient form. Rich in lauric acid, vitamin E, and healthy fats, this versatile powder provides deep nourishment for both skin and hair. Experience the tropical goodness that has made coconut a beauty staple across cultures.',
     image: coconutPowder,
     category: 'hair',
     benefits: [
       'Intense moisturization for dry hair and skin',
       'Rich in lauric acid with antimicrobial properties',
       'Penetrates hair shaft for deep conditioning',
       'Prevents protein loss from hair',
       'Soothes dry, flaky scalp',
       'Natural source of vitamin E'
     ],
     directions: [
       'Hair Mask: Mix 3 tablespoons with warm water to form creamy paste. Apply to damp hair, cover with cap, leave 1-2 hours, wash.',
       'Deep Conditioner: Combine with banana or avocado for intense moisture treatment.',
       'Scalp Treatment: Mix with honey, apply to scalp, massage gently, leave 30 minutes.',
       'Body Scrub: Mix with sugar and oil for an exfoliating body polish.'
     ],
     ingredients: '100% Pure Desiccated Coconut Powder - No added sugar, no preservatives',
     faqs: [
       { question: 'Is Coconut Powder good for protein-sensitive hair?', answer: 'Coconut actually helps prevent protein loss rather than adding protein. It\'s generally safe for most hair types including protein-sensitive hair.' },
       { question: 'Can I use this on my face?', answer: 'Yes! Coconut powder is excellent for facial masks, especially for dry skin. It may be comedogenic for acne-prone skin, so patch test first.' },
       { question: 'How is this different from coconut oil?', answer: 'Coconut powder contains the fiber and flesh of coconut, providing exfoliation along with moisturization. It\'s less greasy than pure oil.' },
       { question: 'Can I cook with this powder?', answer: 'Yes, our coconut powder is food-grade and can be used in cooking, smoothies, and desserts.' }
     ],
     themeColor: '30 30% 75%',
     pricePerGram: 0.40
   },
   {
     id: 'multani-mitti',
     name: 'Multani Mitti Powder',
     description: 'Natural clay powder that deeply cleanses pores, removes impurities, and leaves skin soft, refreshed, and glowing.',
     fullDescription: 'Multani Mitti, or Fuller\'s Earth, is a time-tested beauty secret from ancient India. This mineral-rich clay deeply cleanses pores, absorbs excess oil, and removes impurities, leaving your skin feeling refreshed and radiant. Perfect for oily and acne-prone skin, it\'s nature\'s most effective clarifying treatment.',
     image: multaniMitti,
     category: 'skin',
     benefits: [
       'Deep cleanses and unclogs pores',
       'Absorbs excess oil and sebum',
       'Removes tan and sun damage',
       'Tightens skin and minimizes pores',
       'Natural cooling effect on skin',
       'Improves blood circulation'
     ],
     directions: [
       'Face Pack: Mix 2 tablespoons with rose water to form smooth paste. Apply evenly, let dry 15-20 minutes, rinse with water.',
       'For Dry Skin: Add honey or milk to prevent over-drying.',
       'Body Pack: Mix with sandalwood powder for full body application before bath.',
       'Caution: Do not let it dry completely on very dry skin; mist with water as needed.'
     ],
     ingredients: '100% Pure Multani Mitti (Fuller\'s Earth) - Natural, unprocessed',
     faqs: [
       { question: 'Is Multani Mitti suitable for dry skin?', answer: 'Multani Mitti is best for oily skin. If you have dry skin, add moisturizing ingredients like honey, milk, or yogurt to the mask.' },
       { question: 'How often should I use Multani Mitti?', answer: 'For oily skin, use 2-3 times per week. For combination skin, once a week is sufficient. Avoid overuse to prevent dryness.' },
       { question: 'Can Multani Mitti remove pimples?', answer: 'Multani Mitti helps absorb excess oil and unclog pores, which can prevent new breakouts. It\'s not a treatment for existing pimples.' },
       { question: 'Why does my face feel tight after using it?', answer: 'This is normal due to the clay\'s oil-absorbing properties. Always moisturize after rinsing. If discomfort persists, add hydrating ingredients.' }
     ],
     themeColor: '40 35% 50%',
     pricePerGram: 0.30
   },
   {
     id: 'brahmi-powder',
     name: 'Brahmi Powder',
     description: 'Ancient brain tonic that enhances memory, reduces stress, and promotes mental clarity and calm focus.',
     fullDescription: 'Brahmi (Bacopa monnieri) is one of Ayurveda\'s most prized herbs for mental wellness. Our pure Brahmi Powder supports cognitive function, enhances memory, and reduces stress and anxiety naturally. Beyond brain health, it\'s also excellent for hair growth and scalp nourishment, making it a truly versatile herb.',
     image: brahmiPowder,
     category: 'wellness',
     benefits: [
       'Enhances memory and concentration',
       'Reduces stress and anxiety naturally',
       'Supports overall brain health',
       'Promotes hair growth when applied topically',
       'Natural adaptogen for stress management',
       'Improves quality of sleep'
     ],
     directions: [
       'For Brain Health: Mix 1/2 teaspoon in warm milk or water. Consume once daily, preferably in the morning.',
       'Hair Treatment: Mix 2 tablespoons with coconut oil, apply to scalp, leave for 30 minutes, then wash.',
       'Stress Relief: Add to herbal tea with honey for calming effects.',
       'Best taken consistently for 2-3 months for full cognitive benefits.'
     ],
     ingredients: '100% Pure Brahmi (Bacopa monnieri) Powder - Organically cultivated',
     faqs: [
       { question: 'How long does Brahmi take to improve memory?', answer: 'Studies show cognitive benefits typically appear after 8-12 weeks of consistent daily use. Be patient and consistent.' },
       { question: 'Can children take Brahmi?', answer: 'Brahmi is traditionally given to children for memory. Consult a pediatrician for appropriate dosage based on age.' },
       { question: 'Does Brahmi cause drowsiness?', answer: 'Brahmi is calming but shouldn\'t cause daytime drowsiness at normal doses. It may actually improve sleep quality when taken at night.' },
       { question: 'Can I use Brahmi for hair and consume it too?', answer: 'Yes! You can use Brahmi both topically for hair and consume it for cognitive benefits. They complement each other well.' }
     ],
     themeColor: '130 35% 45%',
     pricePerGram: 0.52
   },
   {
     id: 'moringa-powder',
     name: 'Moringa Powder',
     description: 'Nutrient-rich superfood powder packed with vitamins, antioxidants, and minerals for overall wellness and vitality.',
     fullDescription: 'Moringa, the "Miracle Tree," is one of the most nutrient-dense plants on Earth. Our premium Moringa Powder contains 90+ nutrients including complete proteins, essential vitamins, and minerals. It\'s nature\'s multivitamin, supporting energy, immunity, and overall vitality. Start your day with this green superfood for transformative health benefits.',
     image: moringaPowder,
     category: 'wellness',
     benefits: [
       'Complete protein with all 9 essential amino acids',
       'Rich in iron, calcium, and vitamin A',
       'Powerful antioxidant and anti-inflammatory',
       'Supports healthy blood sugar levels',
       'Boosts energy and reduces fatigue',
       'Supports immune system function'
     ],
     directions: [
       'Daily Supplement: Add 1 teaspoon to smoothies, juices, or water. Start with small doses.',
       'Energy Boost: Mix in morning tea or coffee for sustained energy.',
       'Face Mask: Combine with honey for an antioxidant-rich facial.',
       'Tip: Start with 1/2 teaspoon and gradually increase to 1-2 teaspoons daily.'
     ],
     ingredients: '100% Pure Moringa Leaf Powder - Shade-dried to preserve nutrients',
     faqs: [
       { question: 'Can I take Moringa every day?', answer: 'Yes! Moringa is safe for daily consumption. Start with small amounts and gradually increase to 1-2 teaspoons per day.' },
       { question: 'Does Moringa taste bad?', answer: 'Moringa has a mild, earthy, slightly grassy taste. It blends well in smoothies, where fruits can mask the flavor.' },
       { question: 'Is Moringa safe during pregnancy?', answer: 'While Moringa is nutritious, pregnant women should consult their doctor before use as some parts of the plant may affect pregnancy.' },
       { question: 'Can Moringa help with weight loss?', answer: 'Moringa can support weight management by boosting metabolism and providing nutrients that reduce cravings. It\'s not a weight loss drug.' }
     ],
     themeColor: '100 50% 40%',
     pricePerGram: 0.55
   },
   {
     id: 'neem-powder',
     name: 'Neem Powder',
     description: 'Powerful antibacterial powder that purifies blood, treats skin conditions, and supports natural detoxification.',
     fullDescription: 'Neem has been called the "Village Pharmacy" in India for its incredible healing properties. Our pure Neem Powder is nature\'s most potent antibacterial, antifungal, and blood purifying agent. From acne to dandruff, from wound healing to internal detox, Neem is your go-to solution for holistic health and clear, radiant skin.',
     image: neemPowder,
     category: 'skin',
     benefits: [
       'Powerful antibacterial and antifungal action',
       'Clears acne, pimples, and skin infections',
       'Natural blood purifier and detoxifier',
       'Treats dandruff and scalp conditions',
       'Supports oral health and hygiene',
       'Repels insects naturally'
     ],
     directions: [
       'Face Pack: Mix 1 tablespoon with rose water or yogurt. Apply to face, leave 15 minutes, rinse. Use 2x weekly.',
       'Scalp Treatment: Mix with coconut oil, apply to scalp, leave 30 minutes, wash with mild shampoo.',
       'Internal Detox: Add 1/4 teaspoon to warm water, drink on empty stomach (consult practitioner first).',
       'Caution: Neem is very potent; always dilute and patch test before use.'
     ],
     ingredients: '100% Pure Neem Leaf Powder - Organically grown, naturally dried',
     faqs: [
       { question: 'Is Neem safe to consume?', answer: 'Small amounts are traditionally consumed for detox. Start with 1/4 teaspoon. Avoid during pregnancy. Consult an Ayurvedic practitioner.' },
       { question: 'Can Neem cure acne?', answer: 'Neem\'s antibacterial properties can significantly reduce acne-causing bacteria. For severe acne, combine with professional treatment.' },
       { question: 'Is Neem safe for sensitive skin?', answer: 'Neem is potent and may irritate sensitive skin. Always do a patch test and mix with soothing ingredients like aloe vera or rose water.' },
       { question: 'How does Neem help with dandruff?', answer: 'Neem\'s antifungal properties target the fungus that causes dandruff while soothing scalp irritation and reducing flakiness.' }
     ],
     themeColor: '120 40% 35%',
     pricePerGram: 0.38
   },
   {
     id: 'kasturi-haldi',
     name: 'Kasturi Haldi Powder',
     description: 'Wild turmeric powder that brightens complexion, reduces blemishes, and provides natural antiseptic care for radiant skin.',
     fullDescription: 'Kasturi Haldi (Wild Turmeric) is the beauty secret behind the legendary bridal glow of Indian women. Unlike regular turmeric, Kasturi Haldi doesn\'t stain the skin yellow, making it perfect for facial applications. Its powerful curcumin content brightens complexion, fades blemishes, and gives you naturally radiant, even-toned skin.',
     image: kasturiHaldi,
     category: 'skin',
     benefits: [
       'Brightens skin without yellow staining',
       'Fades dark spots, scars, and blemishes',
       'Natural antiseptic for skin infections',
       'Anti-inflammatory for skin irritation',
       'Delays signs of aging and wrinkles',
       'Evens out skin tone naturally'
     ],
     directions: [
       'Brightening Pack: Mix 1 tablespoon with gram flour and milk. Apply, leave 15-20 minutes, scrub gently while rinsing.',
       'Spot Treatment: Make thick paste with rose water, apply to dark spots before bed.',
       'Bridal Ubtan: Mix with sandalwood, milk cream, and saffron for traditional bridal glow.',
       'Weekly Treatment: Use 2-3 times per week for best results.'
     ],
     ingredients: '100% Pure Kasturi Haldi (Curcuma Aromatica) Powder - Wild harvested, cosmetic grade',
     faqs: [
       { question: 'Does Kasturi Haldi stain skin like regular turmeric?', answer: 'No! Kasturi Haldi is specifically prized because it doesn\'t leave a yellow stain on skin, making it ideal for facial use.' },
       { question: 'Can I use this for cooking?', answer: 'Kasturi Haldi is primarily used for cosmetics and has a different flavor profile. Use regular turmeric for cooking.' },
       { question: 'How long to see skin brightening results?', answer: 'With regular use 2-3 times weekly, you may notice brighter, more even skin within 3-4 weeks.' },
       { question: 'Is Kasturi Haldi safe for all skin types?', answer: 'Yes, it\'s generally safe for all skin types. However, do a patch test if you have very sensitive skin or turmeric allergies.' }
     ],
     themeColor: '45 70% 50%',
     pricePerGram: 0.65
   },
   {
     id: 'rosemary-powder',
     name: 'Rosemary Powder',
     description: 'Aromatic herb powder that stimulates hair growth, improves circulation, and provides natural antioxidant benefits.',
     fullDescription: 'Rosemary has emerged as one of the most effective natural remedies for hair growth, with studies showing it can be as effective as minoxidil! Our pure Rosemary Powder stimulates blood circulation to the scalp, strengthens hair follicles, and prevents premature greying. Its antioxidant properties also benefit skin health and mental clarity.',
     image: rosemaryPowder,
     category: 'hair',
     benefits: [
       'Clinically shown to stimulate hair growth',
       'Improves blood circulation to scalp',
       'Prevents premature greying',
       'Natural antioxidant for scalp health',
       'Reduces dandruff and scalp irritation',
       'Adds shine and strength to hair'
     ],
     directions: [
       'Hair Growth Oil: Infuse 2 tablespoons in warm olive oil, leave for a week. Massage into scalp daily.',
       'Hair Mask: Mix with yogurt and honey, apply to hair and scalp, leave 30 minutes.',
       'Scalp Rinse: Steep in hot water, cool, strain, and use as final rinse after shampooing.',
       'For best results, use consistently for at least 6 months.'
     ],
     ingredients: '100% Pure Rosemary (Rosmarinus officinalis) Leaf Powder - Naturally dried',
     faqs: [
       { question: 'Is Rosemary really as effective as Minoxidil?', answer: 'A 2015 study showed rosemary oil performed as well as 2% minoxidil for hair regrowth with fewer side effects. Results may vary.' },
       { question: 'Can Rosemary help with alopecia?', answer: 'Rosemary has shown promise in treating various types of hair loss due to its circulation-boosting and anti-inflammatory properties.' },
       { question: 'How long until I see hair growth?', answer: 'Like most natural remedies, rosemary requires consistent use. Most people see noticeable results after 3-6 months of regular application.' },
       { question: 'Can I use Rosemary on colored hair?', answer: 'Yes, rosemary is safe for colored hair and may actually help maintain color vibrancy due to its antioxidant properties.' }
     ],
     themeColor: '160 35% 40%',
     pricePerGram: 0.58
   },
   {
     id: 'orange-peel-powder',
     name: 'Orange Peel Powder',
     description: 'Vitamin C rich powder that brightens skin, removes tan, and fights acne for a fresh, glowing complexion.',
     fullDescription: 'Don\'t throw away those orange peels - they\'re a skincare goldmine! Our Orange Peel Powder is packed with Vitamin C, citric acid, and natural AHAs that gently exfoliate, brighten, and rejuvenate dull skin. It\'s your natural solution for tan removal, acne control, and achieving that fresh, citrusy glow.',
     image: orangePeelPowder,
     category: 'skin',
     benefits: [
       'Rich in Vitamin C for brightening',
       'Natural AHAs gently exfoliate skin',
       'Removes tan and sun damage',
       'Fights acne and prevents breakouts',
       'Reduces blackheads and whiteheads',
       'Refreshing citrus aromatherapy'
     ],
     directions: [
       'Brightening Pack: Mix 2 tablespoons with yogurt. Apply to face and neck, leave 15-20 minutes, rinse.',
       'Tan Removal: Combine with tomato juice, apply to tanned areas, leave until dry.',
       'Acne Treatment: Mix with neem powder and rose water for spot treatment.',
       'Caution: Citrus can increase sun sensitivity; always use sunscreen after treatment.'
     ],
     ingredients: '100% Pure Orange Peel Powder - Sun-dried, finely ground',
     faqs: [
       { question: 'Can Orange Peel cause skin sensitivity?', answer: 'Yes, citrus can increase photosensitivity. Always apply sunscreen after using orange peel treatments and avoid direct sun exposure.' },
       { question: 'How quickly does it remove tan?', answer: 'With regular use 2-3 times weekly, you may notice visible tan reduction within 2-3 weeks. Deep tans take longer.' },
       { question: 'Is Orange Peel good for oily skin?', answer: 'Excellent! Orange peel helps control excess oil production while keeping skin fresh and preventing acne.' },
       { question: 'Can I use this daily?', answer: 'Orange peel is mildly acidic. For most skin types, 2-3 times weekly is ideal. Daily use may cause over-exfoliation.' }
     ],
     themeColor: '30 85% 55%',
     pricePerGram: 0.35
   }
 ];
 
 export const getProductById = (id: string): Product | undefined => {
   return products.find(p => p.id === id);
 };
 
 export const getProductsByCategory = (category: 'skin' | 'hair' | 'wellness'): Product[] => {
   return products.filter(p => p.category === category);
 };