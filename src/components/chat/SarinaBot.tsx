import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Phone, Instagram, Facebook, ExternalLink, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { products } from '@/data/products';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  links?: { label: string; action: () => void }[];
}

const qualityTests = [
  {
    product: 'turmeric',
    test: 'Water Test: Add a pinch of turmeric to warm water. Pure turmeric settles at the bottom, while adulterated turmeric leaves a yellow color and floats.',
  },
  {
    product: 'multani',
    test: 'Touch Test: Pure Multani Mitti feels smooth and silky. It should dissolve completely in water without leaving any grit.',
  },
  {
    product: 'amla',
    test: 'Taste Test: Pure Amla powder has a sour, slightly bitter taste. It should not have any added sweetness or unusual flavors.',
  },
  {
    product: 'neem',
    test: 'Smell Test: Pure Neem powder has a strong, bitter, and earthy smell. Lack of smell indicates poor quality or old stock.',
  },
  {
    product: 'rose',
    test: 'Color Test: Pure rose petal powder should be a natural pinkish-brown, not bright pink (which indicates artificial color).',
  },
  {
    product: 'henna',
    test: 'Release Test: Mix with water and let sit. Pure henna releases color slowly (2-4 hours). Quick color release means chemical additives.',
  },
];

const productResponses: Record<string, string> = {
  amla: 'Amla Powder is our vitamin C powerhouse! Great for hair strengthening and immunity boost. Mix with water for hair mask or consume with warm water for internal benefits.',
  shikakai: 'Shikakai is nature\'s shampoo! It gently cleanses without stripping natural oils. Mix with water to form paste and use as a chemical-free hair wash.',
  ritha: 'Ritha (Soapnut) creates natural lather for gentle cleansing. Perfect for sensitive scalps. Soak in warm water, strain, and use the liquid as shampoo.',
  bhringraj: 'Bhringraj is the "King of Hair" - excellent for hair fall and premature greying. Mix with coconut oil for best results. Leave overnight and wash.',
  hibiscus: 'Hibiscus adds natural color and conditions beautifully. Mix with yogurt for a luxurious hair mask that promotes growth and adds shine.',
  rose: 'Rose Petal Powder is perfect for glowing skin! Mix with rose water for a luxurious face pack. Also great for lip care mixed with honey.',
  multani: 'Multani Mitti is your go-to for oily skin! Mix with rose water, apply for 15 mins, and rinse for clean, refreshed skin. Use 2-3 times weekly.',
  neem: 'Neem is antibacterial and antifungal. Great for acne-prone skin and scalp issues. Mix with aloe or rose water for gentler application.',
  moringa: 'Moringa is a superfood! Contains 90+ nutrients. Add 1 tsp to smoothies or warm water daily. Also great as a face mask for antioxidant benefits.',
  brahmi: 'Brahmi enhances memory and reduces stress. Take 1/2 tsp with warm milk daily. Also apply with oil on scalp for hair growth benefits.',
  coconut: 'Coconut Powder deeply moisturizes dry hair and skin. Mix with water or milk for a conditioning mask. Also edible for smoothies!',
  onion: 'Onion Powder boosts hair growth with sulfur. Mix with oil, apply to scalp. Yes, it has a smell but washes away with good shampoo!',
  orange: 'Orange Peel Powder brightens and removes tan. Mix with yogurt, apply for 15-20 mins. Use sunscreen after as citrus increases sun sensitivity.',
  kasturi: 'Kasturi Haldi (Wild Turmeric) brightens WITHOUT staining yellow! Perfect for face packs. Mix with gram flour and milk for bridal glow.',
  rosemary: 'Rosemary is clinically proven to stimulate hair growth! Infuse in warm oil for a week, then massage daily. Results in 3-6 months.',
};

const SarinaBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m Sarina, your Mittika wellness assistant 🌿 I\'m here to help you with product questions, quality verification, and home-based purity tests. How can I assist you today?',
      isBot: true,
      links: [
        { label: 'Browse Products', action: () => {} },
        { label: 'Quality Tests', action: () => {} },
        { label: 'Talk to Expert', action: () => {} },
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = (text: string, links?: Message['links']) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: true,
      links,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
    };
    setMessages(prev => [...prev, userMessage]);
    const query = input.toLowerCase();
    setInput('');
    setIsTyping(true);

    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsTyping(false);

    // Product queries
    for (const [key, response] of Object.entries(productResponses)) {
      if (query.includes(key)) {
        addBotMessage(response, [
          { label: `View ${key.charAt(0).toUpperCase() + key.slice(1)} Product`, action: () => {
            const product = products.find(p => p.id.includes(key) || p.name.toLowerCase().includes(key));
            if (product) {
              navigate(`/product/${product.id}`);
              setIsOpen(false);
            }
          }},
        ]);
        return;
      }
    }

    // Quality test queries
    if (query.includes('test') || query.includes('quality') || query.includes('pure') || query.includes('check') || query.includes('verify')) {
      let testResponse = 'Here are some home-based purity tests you can try:\n\n';
      qualityTests.forEach(t => {
        testResponse += `🧪 ${t.product.toUpperCase()}: ${t.test}\n\n`;
      });
      testResponse += 'For official test certificates, I can connect you with our team!';
      addBotMessage(testResponse, [
        { label: 'Request Test Certificates', action: () => {
          window.open('https://wa.me/918758808684?text=Hi! I would like to request the test certificates for Mittika products.', '_blank');
        }},
        { label: 'View Purity Verification', action: () => {
          navigate('/purity');
          setIsOpen(false);
        }},
      ]);
      return;
    }

    // Certificate request
    if (query.includes('certificate') || query.includes('nabl') || query.includes('lab')) {
      addBotMessage('We test all our products with NABL approved laboratories. You can request test certificates anytime! Would you like me to connect you with our team?', [
        { label: 'Request Certificates via WhatsApp', action: () => {
          window.open('https://wa.me/918758808684?text=Hi! I would like to request the NABL lab test certificates for Mittika products.', '_blank');
        }},
      ]);
      return;
    }

    // Navigation queries
    if (query.includes('product') || query.includes('shop') || query.includes('buy')) {
      addBotMessage('I\'d love to help you explore our products! We have 15 pure herbal powders across Skin Care, Hair Care, and Wellness categories.', [
        { label: 'View All Products', action: () => { navigate('/products'); setIsOpen(false); }},
        { label: 'Shop by Category', action: () => { navigate('/shop-by-category'); setIsOpen(false); }},
      ]);
      return;
    }

    if (query.includes('bulk') || query.includes('wholesale')) {
      addBotMessage('For bulk orders, we offer special discounts starting from 10% off. Let me take you to our bulk orders page!', [
        { label: 'View Bulk Order Options', action: () => { navigate('/bulk-orders'); setIsOpen(false); }},
        { label: 'Contact for Custom Quote', action: () => {
          window.open('https://wa.me/918758808684?text=Hi! I\'m interested in bulk orders for Mittika products.', '_blank');
        }},
      ]);
      return;
    }

    if (query.includes('export') || query.includes('international')) {
      addBotMessage('Yes! We export to multiple countries. Our products meet international quality standards with full documentation.', [
        { label: 'View Export Details', action: () => { navigate('/export'); setIsOpen(false); }},
      ]);
      return;
    }

    if (query.includes('about') || query.includes('company') || query.includes('story')) {
      addBotMessage('Mittika by Ecovia Enterprises is dedicated to bringing the luxury of earthly purity. Our vision is to serve natural essence directly from earth!', [
        { label: 'Read Our Story', action: () => { navigate('/about'); setIsOpen(false); }},
      ]);
      return;
    }

    // Call/contact queries
    if (query.includes('call') || query.includes('speak') || query.includes('talk') || query.includes('contact') || query.includes('human')) {
      addBotMessage('I\'d be happy to connect you with our Director, Sagar Jadhav! You can reach us through these channels:', [
        { label: '📞 Call Now', action: () => { window.open('tel:+918758808684'); }},
        { label: '💬 WhatsApp', action: () => { window.open('https://wa.me/918758808684'); }},
      ]);
      return;
    }

    // Social media
    if (query.includes('social') || query.includes('instagram') || query.includes('facebook') || query.includes('follow')) {
      addBotMessage('Connect with us on social media for updates, tips, and more! 📱', [
        { label: 'Instagram', action: () => { window.open('https://instagram.com/info.ecovia', '_blank'); }},
        { label: 'Facebook', action: () => { window.open('https://www.facebook.com/share/1Bm5epz5C2/', '_blank'); }},
      ]);
      return;
    }

    // Price queries
    if (query.includes('price') || query.includes('cost') || query.includes('rate')) {
      addBotMessage('Our prices vary by product and quantity. We offer great discounts - up to 63% off on some items! Check product pages for specific pricing with strikethrough original prices.', [
        { label: 'View Products & Prices', action: () => { navigate('/products'); setIsOpen(false); }},
      ]);
      return;
    }

    // Usage/how to use
    if (query.includes('use') || query.includes('how') || query.includes('apply')) {
      addBotMessage('Each product has specific usage instructions. Generally:\n\n🌿 Hair: Mix powder with water/oil, apply to scalp, leave 30-45 mins\n✨ Skin: Mix with rose water/milk, apply as face pack for 15-20 mins\n💪 Wellness: Add to warm water or smoothies\n\nWhich product would you like specific instructions for?');
      return;
    }

    // Default response
    addBotMessage('I\'m here to help with product questions, purity tests, and connecting you with our team. Could you tell me more about what you\'re looking for?', [
      { label: 'Browse Products', action: () => { navigate('/products'); setIsOpen(false); }},
      { label: 'Quality Verification', action: () => { navigate('/purity'); setIsOpen(false); }},
      { label: 'Talk to Expert', action: () => { window.open('https://wa.me/918758808684'); }},
    ]);
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-elevated flex items-center justify-center hover:bg-primary/90 transition-colors"
            aria-label="Chat with Sarina"
          >
            <Sparkles size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-100px)] bg-card rounded-2xl shadow-elevated flex flex-col overflow-hidden border border-border"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Sarina</h3>
                  <p className="text-xs text-primary-foreground/80">Mittika Wellness Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.isBot
                        ? 'bg-secondary text-secondary-foreground rounded-tl-md'
                        : 'bg-primary text-primary-foreground rounded-tr-md'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    {message.links && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.links.map((link, i) => (
                          <button
                            key={i}
                            onClick={link.action}
                            className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1"
                          >
                            {link.label}
                            <ExternalLink size={10} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-secondary rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 border-t border-border flex gap-2 overflow-x-auto">
              <button
                onClick={() => window.open('tel:+918758808684')}
                className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 flex items-center gap-1"
              >
                <Phone size={12} />
                Call
              </button>
              <button
                onClick={() => window.open('https://instagram.com/info.ecovia', '_blank')}
                className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 flex items-center gap-1"
              >
                <Instagram size={12} />
                Instagram
              </button>
              <button
                onClick={() => window.open('https://www.facebook.com/share/1Bm5epz5C2/', '_blank')}
                className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 flex items-center gap-1"
              >
                <Facebook size={12} />
                Facebook
              </button>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about products, quality tests..."
                  className="flex-1 px-4 py-2.5 rounded-full bg-secondary border-0 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 hover:bg-primary/90 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SarinaBot;
