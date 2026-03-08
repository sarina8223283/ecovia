import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Phone, Instagram, Facebook, ExternalLink, Sparkles, LayoutDashboard, ImagePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { products } from '@/data/products';
import { supabase } from '@/integrations/supabase/client';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  image_url?: string;
  links?: { label: string; action: () => void }[];
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sarina-chat`;

const SarinaBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Heyy! 😊✨ Finally someone came to talk to me! Main Sarina hoon — tumhari herbal bestie 💕 Kuch bhi puchho — skin, hair, periods, life advice, ya bas timepass karna ho... I'm all yours! 😘",
      isBot: true,
      links: [
        { label: '🌿 Hair Tips', action: () => {} },
        { label: '✨ Skin Glow', action: () => {} },
        { label: '💬 Just Chat', action: () => {} },
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileName = `chat-upload-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('site-images').upload(fileName, file, { contentType: file.type, upsert: true });
    if (error) { console.error('Upload error:', error); return null; }
    const { data } = supabase.storage.from('site-images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) setPendingImage(url);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async () => {
    if ((!input.trim() && !pendingImage) || isTyping) return;

    const userText = input.trim() || (pendingImage ? "Check this image" : "");
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userText,
      isBot: false,
      image_url: pendingImage || undefined,
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    const imageForRequest = pendingImage;
    setPendingImage(null);
    setIsTyping(true);

    // Build conversation history
    const conversationHistory = messages.slice(-10).map(m => ({
      role: m.isBot ? 'assistant' as const : 'user' as const,
      content: m.text,
      ...(m.image_url ? { image_url: m.image_url } : {}),
    }));
    conversationHistory.push({
      role: 'user',
      content: userText,
      ...(imageForRequest ? { image_url: imageForRequest } : {}),
    });

    let assistantText = '';

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || 'Connection failed');
      }

      if (!resp.body) throw new Error('No response body');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let streamDone = false;
      const botMsgId = (Date.now() + 1).toString();
      let hasToolCalls = false;
      const toolCalls: any[] = [];

      setMessages(prev => [...prev, { id: botMsgId, text: '', isBot: true }]);
      setIsTyping(false);

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') { streamDone = true; break; }

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta;
            
            // Handle tool calls
            if (delta?.tool_calls) {
              hasToolCalls = true;
              for (const tc of delta.tool_calls) {
                const idx = tc.index ?? 0;
                if (!toolCalls[idx]) toolCalls[idx] = { id: tc.id || '', function: { name: '', arguments: '' } };
                if (tc.function?.name) toolCalls[idx].function.name = tc.function.name;
                if (tc.function?.arguments) toolCalls[idx].function.arguments += tc.function.arguments;
              }
            }
            
            const content = delta?.content as string | undefined;
            if (content) {
              assistantText += content;
              const currentText = assistantText;
              setMessages(prev =>
                prev.map(m => m.id === botMsgId ? { ...m, text: currentText } : m)
              );
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // If AI wants to call tools, execute them and get a follow-up response
      if (hasToolCalls && toolCalls.length > 0) {
        setIsTyping(true);
        // Show a thinking message
        const thinkText = assistantText || "Let me check that for you... 🔍";
        setMessages(prev =>
          prev.map(m => m.id === botMsgId ? { ...m, text: thinkText } : m)
        );

        // Execute each tool call
        const toolResults: string[] = [];
        for (const tc of toolCalls) {
          try {
            const params = JSON.parse(tc.function.arguments || '{}');
            const toolResp = await fetch(CHAT_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
              },
              body: JSON.stringify({
                action: 'execute_tool',
                messages: { tool_name: tc.function.name, parameters: params },
              }),
            });
            const toolData = await toolResp.json();
            toolResults.push(JSON.stringify(toolData));
          } catch (err) {
            toolResults.push(`Error executing ${tc.function.name}: ${err}`);
          }
        }

        // Send tool results back to AI for a natural response
        const followUpMessages = [
          ...conversationHistory,
          { role: 'assistant' as const, content: assistantText || '', tool_calls: toolCalls.map((tc, i) => ({
            id: tc.id || `call_${i}`,
            type: 'function',
            function: { name: tc.function.name, arguments: tc.function.arguments },
          }))},
          ...toolCalls.map((tc, i) => ({
            role: 'tool' as const,
            content: toolResults[i],
            tool_call_id: tc.id || `call_${i}`,
          })),
        ];

        const followResp = await fetch(CHAT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: followUpMessages }),
        });

        if (followResp.ok && followResp.body) {
          const followReader = followResp.body.getReader();
          let followBuffer = '';
          let followText = '';
          let followDone = false;

          while (!followDone) {
            const { done, value } = await followReader.read();
            if (done) break;
            followBuffer += decoder.decode(value, { stream: true });

            let idx: number;
            while ((idx = followBuffer.indexOf('\n')) !== -1) {
              let fLine = followBuffer.slice(0, idx);
              followBuffer = followBuffer.slice(idx + 1);
              if (fLine.endsWith('\r')) fLine = fLine.slice(0, -1);
              if (!fLine.startsWith('data: ')) continue;
              const fJson = fLine.slice(6).trim();
              if (fJson === '[DONE]') { followDone = true; break; }
              try {
                const fp = JSON.parse(fJson);
                const fc = fp.choices?.[0]?.delta?.content;
                if (fc) {
                  followText += fc;
                  const ft = followText;
                  setMessages(prev =>
                    prev.map(m => m.id === botMsgId ? { ...m, text: ft } : m)
                  );
                }
              } catch { followBuffer = fLine + '\n' + followBuffer; break; }
            }
          }
          assistantText = followText;
        }
        setIsTyping(false);
      }

      // Add product links if mentioned
      const lowerText = assistantText.toLowerCase();
      const matchedProducts = products.filter(p =>
        lowerText.includes(p.name.toLowerCase()) || lowerText.includes(p.id.replace('-', ' '))
      );

      if (matchedProducts.length > 0) {
        const links = matchedProducts.slice(0, 3).map(p => ({
          label: `View ${p.name}`,
          action: () => { navigate(`/product/${p.id}`); setIsOpen(false); },
        }));
        setMessages(prev =>
          prev.map(m => m.id === botMsgId ? { ...m, links } : m)
        );
      }

    } catch (err: any) {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        text: err.message || "Oops, something went wrong! Let me connect you with the team 💫",
        isBot: true,
        links: [
          { label: '📞 Call Now', action: () => window.open('tel:+918758808684') },
          { label: '💬 WhatsApp', action: () => window.open('https://wa.me/918758808684') },
        ],
      }]);
    }
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
                  <p className="text-xs text-primary-foreground/80">Your Smart AI Bestie ✨</p>
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
                    {message.image_url && (
                      <img
                        src={message.image_url}
                        alt="Uploaded"
                        className="w-full max-h-40 object-cover rounded-lg mb-2"
                      />
                    )}
                    {message.isBot ? (
                      <div className="text-sm prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-strong:text-foreground">
                        <ReactMarkdown>{message.text}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                    )}
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

            {/* Pending Image Preview */}
            {pendingImage && (
              <div className="px-4 py-2 border-t border-border">
                <div className="relative inline-block">
                  <img src={pendingImage} alt="Upload preview" className="h-16 w-16 object-cover rounded-lg border border-border" />
                  <button
                    onClick={() => setPendingImage(null)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

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
              <button
                onClick={() => { navigate('/sarina-admin'); setIsOpen(false); }}
                className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1 font-medium"
              >
                <LayoutDashboard size={12} />
                Admin
              </button>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-10 h-10 rounded-full bg-secondary text-muted-foreground flex items-center justify-center hover:bg-secondary/80 transition-colors flex-shrink-0"
                  title="Upload image"
                >
                  <ImagePlus size={18} />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2.5 rounded-full bg-secondary border-0 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleSend}
                  disabled={(!input.trim() && !pendingImage) || isTyping}
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
