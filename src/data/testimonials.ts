export interface Testimonial {
  name: string;
  location: string;
  rating: number;
  review: string;
  productId: string;
}

export const testimonials: Testimonial[] = [
  // Amla Powder
  { name: 'Priya Sharma', location: 'Mumbai', rating: 5, review: 'My hair fall reduced significantly within 4 weeks! The powder is pure and smells natural. Highly recommend Mittika Amla Powder.', productId: 'amla-powder' },
  { name: 'Deepak Verma', location: 'Delhi', rating: 5, review: 'I mix this with my morning smoothie daily. My immunity has improved noticeably. Genuine quality product.', productId: 'amla-powder' },
  { name: 'Anita Desai', location: 'Pune', rating: 4, review: 'Great quality amla powder. My hair feels thicker after 2 months of regular use. Will definitely repurchase.', productId: 'amla-powder' },

  // Shikakai Powder
  { name: 'Kavitha Reddy', location: 'Hyderabad', rating: 5, review: 'Best natural shampoo I\'ve ever used! My hair is so soft and shiny now. No more chemical shampoos for me.', productId: 'shikakai-powder' },
  { name: 'Meena Kumari', location: 'Chennai', rating: 5, review: 'My grandmother used shikakai and now I do too. Mittika\'s quality is authentic and pure.', productId: 'shikakai-powder' },
  { name: 'Sonia Patel', location: 'Ahmedabad', rating: 4, review: 'Took a few washes to get used to no lather, but my hair has never been healthier. Dandruff completely gone!', productId: 'shikakai-powder' },

  // Ritha Powder
  { name: 'Ranjana Singh', location: 'Lucknow', rating: 5, review: 'Perfect natural cleanser. I use it for hair and even for washing delicate clothes. So versatile!', productId: 'ritha-powder' },
  { name: 'Geeta Nair', location: 'Kerala', rating: 5, review: 'My baby\'s hair is so soft after washing with ritha. Completely safe and natural. Love this product.', productId: 'ritha-powder' },
  { name: 'Neha Gupta', location: 'Jaipur', rating: 4, review: 'Combined with shikakai and amla - the best hair wash combination! Pure quality from Mittika.', productId: 'ritha-powder' },

  // Bhringraj Powder
  { name: 'Amit Kumar', location: 'Patna', rating: 5, review: 'My receding hairline has started filling in after 4 months of regular use. Truly the King of Herbs!', productId: 'bhringraj-powder' },
  { name: 'Sunita Devi', location: 'Varanasi', rating: 5, review: 'Grey hair has reduced noticeably. I make oil infusion and use daily. Excellent quality powder.', productId: 'bhringraj-powder' },
  { name: 'Rajesh Tiwari', location: 'Bhopal', rating: 4, review: 'Significant hair fall reduction within 6 weeks. I can see new baby hair growing. Thank you Mittika!', productId: 'bhringraj-powder' },

  // Hibiscus Powder
  { name: 'Lakshmi Iyer', location: 'Bangalore', rating: 5, review: 'My hair has beautiful natural reddish highlights now! The powder is so fresh and fragrant. Amazing quality.', productId: 'hibiscus-powder' },
  { name: 'Pooja Menon', location: 'Kochi', rating: 5, review: 'Best conditioner ever! My hair feels like silk after every wash. The hibiscus flower quality is outstanding.', productId: 'hibiscus-powder' },
  { name: 'Divya Joshi', location: 'Nagpur', rating: 4, review: 'Love the deep red color of this powder - shows it\'s made from real hibiscus flowers. Hair growth has improved.', productId: 'hibiscus-powder' },

  // Rose Petals Powder
  { name: 'Aditi Kapoor', location: 'Delhi', rating: 5, review: 'The most luxurious face pack I\'ve used! My skin glows after every application. Divine rose fragrance.', productId: 'rose-petals-powder' },
  { name: 'Nandini Rao', location: 'Mysore', rating: 5, review: 'I add this to my bathwater - feels like a spa experience at home. Pure rose petal quality. Worth every rupee.', productId: 'rose-petals-powder' },
  { name: 'Swati Mehta', location: 'Surat', rating: 5, review: 'My sensitive skin loves this! No irritation, just beautiful soft glowing skin. Mittika rose powder is the best.', productId: 'rose-petals-powder' },

  // Onion Powder
  { name: 'Vikram Shah', location: 'Mumbai', rating: 5, review: 'Was skeptical about the smell but the results are incredible! New hair growth visible in bald patches.', productId: 'onion-powder' },
  { name: 'Harish Bhatia', location: 'Chandigarh', rating: 4, review: 'Hair fall reduced by 80% in 2 months. The smell washes off easily. Great product for hair regrowth.', productId: 'onion-powder' },
  { name: 'Kavya Nair', location: 'Trivandrum', rating: 5, review: 'I infuse this in coconut oil and use as scalp massage oil. Hair density has improved significantly.', productId: 'onion-powder' },

  // Coconut Powder
  { name: 'Reshma Khan', location: 'Goa', rating: 5, review: 'Best deep conditioner for my dry curly hair! It\'s like a tropical spa treatment at home. Absolutely love it.', productId: 'coconut-powder' },
  { name: 'Tanvi Desai', location: 'Pune', rating: 5, review: 'I use this for face masks and hair - so versatile! The coconut quality is premium. Fresh tropical goodness.', productId: 'coconut-powder' },
  { name: 'Maya Pillai', location: 'Chennai', rating: 4, review: 'Excellent moisturizing powder. My dry scalp issues resolved after regular use. Pure coconut essence.', productId: 'coconut-powder' },

  // Multani Mitti
  { name: 'Sneha Jain', location: 'Indore', rating: 5, review: 'My oily skin has never looked better! Pores are visibly smaller after 3 weeks. Pure, smooth clay quality.', productId: 'multani-mitti' },
  { name: 'Rohit Agarwal', location: 'Kolkata', rating: 5, review: 'I use this as a weekly face mask and the results are amazing. Skin feels so clean and fresh. Top quality.', productId: 'multani-mitti' },
  { name: 'Pallavi Sharma', location: 'Dehradun', rating: 4, review: 'Removes tan beautifully. Mixed with rose water, it\'s the perfect summer face pack. Genuine Multani Mitti.', productId: 'multani-mitti' },

  // Brahmi Powder
  { name: 'Dr. Suresh Kumar', location: 'Bangalore', rating: 5, review: 'As an Ayurvedic practitioner, I recommend Mittika Brahmi to my patients. The quality and purity is exceptional.', productId: 'brahmi-powder' },
  { name: 'Arjun Pillai', location: 'Kochi', rating: 5, review: 'My concentration and memory have improved noticeably after 2 months of daily consumption. Truly the brain tonic.', productId: 'brahmi-powder' },
  { name: 'Meghna Das', location: 'Kolkata', rating: 4, review: 'I use it both for hair growth and as a brain supplement. Dual benefits from one pure product. Excellent!', productId: 'brahmi-powder' },

  // Moringa Powder
  { name: 'Fatima Begum', location: 'Hyderabad', rating: 5, review: 'My energy levels have skyrocketed since I started taking Mittika Moringa daily. Natural superfood at its best!', productId: 'moringa-powder' },
  { name: 'Kiran Patel', location: 'Ahmedabad', rating: 5, review: 'The greenest moringa powder I\'ve seen - shows it\'s shade-dried properly. Iron levels improved in blood tests.', productId: 'moringa-powder' },
  { name: 'Anand Mishra', location: 'Lucknow', rating: 4, review: 'Add to my morning smoothie daily. Feel more energetic and immune system is stronger. Great quality product.', productId: 'moringa-powder' },

  // Neem Powder
  { name: 'Shweta Kulkarni', location: 'Pune', rating: 5, review: 'My acne cleared up in just 3 weeks of using neem face packs! The antibacterial power is real. Pure neem.', productId: 'neem-powder' },
  { name: 'Ramesh Yadav', location: 'Varanasi', rating: 5, review: 'I use this for blood purification - taking with warm water daily. Skin has become much clearer. Authentic neem.', productId: 'neem-powder' },
  { name: 'Preeti Saxena', location: 'Jaipur', rating: 4, review: 'Dandruff completely gone after using neem scalp treatment for a month. The powder is potent and fresh.', productId: 'neem-powder' },

  // Kasturi Haldi
  { name: 'Rekha Sharma', location: 'Jaipur', rating: 5, review: 'Bridal glow achieved! Used as ubtan for my wedding prep. No yellow staining at all. Pure Kasturi Haldi magic.', productId: 'kasturi-haldi' },
  { name: 'Anjali Nair', location: 'Trivandrum', rating: 5, review: 'Dark spots faded in 4 weeks! This is the real Kasturi Haldi - not the cooking turmeric many brands sell.', productId: 'kasturi-haldi' },
  { name: 'Ritu Verma', location: 'Delhi', rating: 5, review: 'My skin literally glows now. Best investment in skincare. Mittika\'s Kasturi Haldi is exceptionally pure.', productId: 'kasturi-haldi' },

  // Rosemary Powder
  { name: 'Tanya Singh', location: 'Mumbai', rating: 5, review: 'Better than minoxidil! My hair growth has been incredible after 5 months of rosemary oil infusion. Pure quality.', productId: 'rosemary-powder' },
  { name: 'Nikhil Joshi', location: 'Pune', rating: 5, review: 'The aromatic quality shows this is genuine rosemary. Hair density improved and no side effects like chemical treatments.', productId: 'rosemary-powder' },
  { name: 'Simran Kaur', location: 'Chandigarh', rating: 4, review: 'Using as scalp rinse daily - baby hair growing around my temples! Fragrant and fresh powder. Love Mittika.', productId: 'rosemary-powder' },

  // Orange Peel Powder
  { name: 'Bhavna Patel', location: 'Ahmedabad', rating: 5, review: 'Best tan removal pack ever! My face glows after every use. Fresh citrus fragrance shows the quality.', productId: 'orange-peel-powder' },
  { name: 'Kriti Sharma', location: 'Delhi', rating: 5, review: 'Acne and blackheads reduced dramatically. Natural vitamin C is better than any chemical serum. Love it!', productId: 'orange-peel-powder' },
  { name: 'Ritika Malhotra', location: 'Chandigarh', rating: 4, review: 'My skin looks brighter and fresher. Mixed with yogurt, it\'s the perfect weekly exfoliating treatment. Pure quality.', productId: 'orange-peel-powder' },
];

export const getTestimonialsByProduct = (productId: string): Testimonial[] => {
  return testimonials.filter(t => t.productId === productId);
};
