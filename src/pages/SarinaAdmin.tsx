import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Lock, LogOut, Loader2, Image, RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import { toast } from '@/hooks/use-toast';

const FUNC_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sarina-admin`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  images?: string[];
  toolResults?: string[];
}

const SarinaAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '🌿 **Welcome to Sarina Admin!**\n\nI can help you manage your Mittika website. Here\'s what I can do:\n\n- ✏️ **Edit text content** — hero section, descriptions, buttons\n- 🎨 **Generate images** — create product photos, banners\n- 🎯 **Update theme** — colors, fonts, styling\n- 📋 **View all content** — see what\'s currently on the site\n\nJust tell me what you\'d like to change!' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callFunction = async (body: any) => {
    const resp = await fetch(FUNC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ANON_KEY}`,
      },
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(err.error || `Error ${resp.status}`);
    }
    return resp.json();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const result = await callFunction({ action: 'verify_password', password });
      if (result.valid) {
        setIsAuthenticated(true);
        toast({ title: '🔓 Access granted', description: 'Welcome to Sarina Admin' });
      } else {
        toast({ title: '❌ Invalid password', description: 'Please try again', variant: 'destructive' });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setAuthLoading(false);
    }
  };

  const executeTool = async (toolName: string, parameters: any): Promise<string> => {
    try {
      const result = await callFunction({
        action: 'execute_tool',
        tool_call: { tool_name: toolName, parameters },
      });
      // Invalidate content cache after any modification
      if (['update_content', 'delete_content', 'generate_image', 'update_theme'].includes(toolName)) {
        queryClient.invalidateQueries({ queryKey: ['site-content'] });
      }
      return JSON.stringify(result);
    } catch (err: any) {
      return JSON.stringify({ error: err.message });
    }
  };

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Build conversation for AI (without images/toolResults)
      const aiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      
      const result = await callFunction({ action: 'chat', messages: aiMessages });

      // Process tool calls if any
      if (result.tool_calls?.length > 0) {
        const toolResults: string[] = [];
        const images: string[] = [];

        for (const tc of result.tool_calls) {
          const fn = tc.function;
          const params = typeof fn.arguments === 'string' ? JSON.parse(fn.arguments) : fn.arguments;
          const toolResult = await executeTool(fn.name, params);
          toolResults.push(`**${fn.name}**: ${toolResult}`);

          // Check for generated images
          try {
            const parsed = JSON.parse(toolResult);
            if (parsed.image_url) images.push(parsed.image_url);
          } catch {}
        }

        // Send tool results back to AI for a summary
        const followUp = await callFunction({
          action: 'chat',
          messages: [
            ...aiMessages,
            { role: 'assistant', content: result.message || 'Executing changes...' },
            { role: 'user', content: `Tool execution results:\n${toolResults.join('\n')}\n\nPlease summarize what was done.` },
          ],
        });

        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: followUp.message || result.message || 'Changes applied successfully!',
            images: images.length > 0 ? images : undefined,
            toolResults,
          },
        ]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: result.message || 'I couldn\'t process that request.' }]);
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, queryClient]);

  // Password gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-foreground">Sarina Admin</h1>
              <p className="text-muted-foreground text-sm mt-2">Enter password to access website editor</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Admin password"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                autoFocus
              />
              <button
                type="submit"
                disabled={authLoading || !password}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                Unlock Sarina Admin
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold text-foreground">Sarina Admin</h1>
            <p className="text-xs text-muted-foreground">AI Website Editor — Mittika</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['site-content'] })}
            className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground"
            title="Refresh content"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground"
            title="Lock admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-4xl mx-auto w-full">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-foreground'
                }`}
              >
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                {msg.images?.map((img, j) => (
                  <div key={j} className="mt-3">
                    <img src={img} alt="Generated" className="rounded-xl max-w-full max-h-64 object-contain" />
                    <p className="text-xs mt-1 opacity-70">🖼️ AI Generated Image</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Sarina is working...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Tell Sarina what to change on the website..."
            className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2 max-w-4xl mx-auto">
          Try: "Change the hero heading to Welcome to Mittika" • "Generate a banner image of herbal powders" • "Show me all current content"
        </p>
      </div>
    </div>
  );
};

export default SarinaAdmin;
