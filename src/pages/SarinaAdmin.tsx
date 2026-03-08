import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Lock, LogOut, Loader2, RefreshCw, LayoutDashboard, MessageSquare, FileText, Palette, Image as ImageIcon, Trash2, Edit3, Plus, Eye, ArrowLeft, Paperclip, X, ZoomIn, CheckCircle, XCircle, ArrowRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const FUNC_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sarina-admin`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  images?: { url: string; model?: string; contentKey?: string }[];
  pendingDeploy?: boolean;
  changePreview?: { key: string; current_value: string; new_value: string; is_new: boolean }[];
}

interface ContentItem {
  id: string;
  content_key: string;
  content_value: string;
  content_type: string;
  image_url: string | null;
  updated_at: string;
}

type Tab = 'chat' | 'content' | 'theme' | 'images';

const callFunction = async (body: any, retries = 3): Promise<any> => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120000);

      const resp = await fetch(FUNC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ANON_KEY}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (resp.status === 429) {
        const wait = Math.min(3000 * Math.pow(2, attempt), 15000);
        console.log(`Rate limited, waiting ${wait}ms (attempt ${attempt + 1}/${retries + 1})`);
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, wait));
          continue;
        }
        throw new Error('Rate limited. Please wait a moment and try again.');
      }
      if (resp.status === 402) {
        throw new Error('AI credits exhausted. Please add credits in workspace settings.');
      }
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'Request failed' }));
        // Auto-retry on server errors
        if (resp.status >= 500 && attempt < retries) {
          console.log(`Server error ${resp.status}, retrying (attempt ${attempt + 1}/${retries + 1})`);
          await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
          continue;
        }
        throw new Error(err.error || `Error ${resp.status}`);
      }
      return resp.json();
    } catch (err: any) {
      if (err.name === 'AbortError') {
        if (attempt < retries) {
          console.log(`Request timed out, retrying (attempt ${attempt + 1}/${retries + 1})`);
          continue;
        }
        throw new Error('Request timed out. The operation took too long.');
      }
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
    }
  }
};

// ─── Birth Year Gate ───
const BIRTH_YEAR_ANSWER = '1997';

const PasswordGate = ({ onAuth }: { onAuth: () => void }) => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim() === BIRTH_YEAR_ANSWER) {
      onAuth();
      toast({ title: '🔓 Access granted', description: 'Welcome to Sarina Admin' });
    } else {
      setError(true);
      toast({ title: '❌ Incorrect answer', description: 'Please try again', variant: 'destructive' });
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-foreground">Sarina Admin</h1>
            <p className="text-muted-foreground text-sm mt-2">Answer the security question to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">What is your birth year?</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={answer}
                onChange={e => setAnswer(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter year (e.g., 1990)"
                className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-destructive ring-2 ring-destructive/30' : 'border-border'} bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors`}
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={answer.length !== 4}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Unlock Sarina Admin
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Content Manager Tab ───
const ContentManager = () => {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-content'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_content').select('*').order('content_key');
      if (error) throw error;
      return data as ContentItem[];
    },
  });

  const saveContent = async (key: string, value: string) => {
    try {
      await callFunction({ action: 'execute_tool', tool_call: { tool_name: 'update_content', parameters: { content_key: key, content_value: value } } });
      queryClient.invalidateQueries({ queryKey: ['admin-content'] });
      queryClient.invalidateQueries({ queryKey: ['site-content'] });
      setEditingKey(null);
      toast({ title: '✅ Saved', description: `"${key}" updated` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const deleteContent = async (key: string) => {
    if (!confirm(`Delete "${key}"?`)) return;
    try {
      await callFunction({ action: 'execute_tool', tool_call: { tool_name: 'delete_content', parameters: { content_key: key } } });
      queryClient.invalidateQueries({ queryKey: ['admin-content'] });
      queryClient.invalidateQueries({ queryKey: ['site-content'] });
      toast({ title: '🗑️ Deleted', description: `"${key}" removed` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const addContent = async () => {
    if (!newKey.trim() || !newValue.trim()) return;
    await saveContent(newKey.trim(), newValue.trim());
    setNewKey('');
    setNewValue('');
    setShowAdd(false);
  };

  if (isLoading) return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-lg font-bold text-foreground">Content Manager</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1 text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {showAdd && (
        <div className="bg-primary/5 rounded-xl p-4 space-y-2 border border-primary/20">
          <input value={newKey} onChange={e => setNewKey(e.target.value)} placeholder="Content key (e.g., about_heading)" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
          <textarea value={newValue} onChange={e => setNewValue(e.target.value)} placeholder="Content value" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm min-h-[60px]" />
          <div className="flex gap-2">
            <button onClick={addContent} className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-lg">Save</button>
            <button onClick={() => setShowAdd(false)} className="text-sm bg-secondary text-secondary-foreground px-3 py-1.5 rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      {items.map(item => (
        <div key={item.id} className="bg-card border border-border rounded-xl p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-primary font-medium">{item.content_key}</p>
              {editingKey === item.content_key ? (
                <div className="mt-1 space-y-2">
                  <textarea
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm min-h-[60px]"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button onClick={() => saveContent(item.content_key, editValue)} className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-lg">Save</button>
                    <button onClick={() => setEditingKey(null)} className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-lg">Cancel</button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-foreground/80 mt-0.5 break-words">{item.content_value}</p>
              )}
              {item.image_url && <img src={item.image_url} alt={item.content_key} className="mt-2 rounded-lg max-h-24 object-contain" />}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => { setEditingKey(item.content_key); setEditValue(item.content_value); }} className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => deleteContent(item.content_key)} className="p-1.5 hover:bg-destructive/10 rounded-lg text-destructive/60">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Theme Editor Tab ───
const ThemeEditor = () => {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const queryClient = useQueryClient();

  const { data: themes = [], isLoading } = useQuery({
    queryKey: ['admin-theme'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_theme').select('*').order('theme_key');
      if (error) throw error;
      return data as any[];
    },
  });

  const saveTheme = async (key: string, value: string) => {
    try {
      await callFunction({ action: 'execute_tool', tool_call: { tool_name: 'update_theme', parameters: { theme_key: key, theme_value: value } } });
      queryClient.invalidateQueries({ queryKey: ['admin-theme'] });
      toast({ title: '🎨 Saved', description: `Theme "${key}" updated` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const presets = [
    { key: 'primary_color', label: 'Primary Color', placeholder: '#4d7a5e' },
    { key: 'accent_color', label: 'Accent Color', placeholder: '#d4a853' },
    { key: 'font_heading', label: 'Heading Font', placeholder: 'Playfair Display' },
    { key: 'font_body', label: 'Body Font', placeholder: 'Inter' },
  ];

  if (isLoading) return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="p-4 space-y-4">
      <h2 className="font-serif text-lg font-bold text-foreground">Theme Settings</h2>
      <p className="text-xs text-muted-foreground">Configure colors, fonts, and styling.</p>

      {presets.map(preset => {
        const current = themes.find((t: any) => t.theme_key === preset.key);
        return (
          <div key={preset.key} className="bg-card border border-border rounded-xl p-3">
            <label className="text-xs font-medium text-foreground">{preset.label}</label>
            <div className="flex gap-2 mt-1">
              <input
                defaultValue={current?.theme_value || ''}
                placeholder={preset.placeholder}
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                onBlur={e => {
                  if (e.target.value && e.target.value !== (current?.theme_value || '')) {
                    saveTheme(preset.key, e.target.value);
                  }
                }}
              />
              {preset.key.includes('color') && (
                <input
                  type="color"
                  defaultValue={current?.theme_value || preset.placeholder}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                  onChange={e => saveTheme(preset.key, e.target.value)}
                />
              )}
            </div>
          </div>
        );
      })}

      <div className="bg-card border border-border rounded-xl p-3">
        <label className="text-xs font-medium text-foreground">Add Custom Setting</label>
        <div className="flex gap-2 mt-1">
          <input value={newKey} onChange={e => setNewKey(e.target.value)} placeholder="Key" className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm" />
          <input value={newValue} onChange={e => setNewValue(e.target.value)} placeholder="Value" className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm" />
          <button onClick={() => { if (newKey && newValue) { saveTheme(newKey, newValue); setNewKey(''); setNewValue(''); } }} className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm">Add</button>
        </div>
      </div>

      {themes.filter((t: any) => !presets.some(p => p.key === t.theme_key)).map((t: any) => (
        <div key={t.id} className="bg-card border border-border rounded-xl p-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-primary">{t.theme_key}</p>
            <p className="text-sm text-foreground/80">{t.theme_value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Image Gallery Tab ───
const ImageGallery = () => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copyMsg, setCopyMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['admin-images'],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from('site-images').list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
      if (error) throw error;
      return (data || []).filter(f => f.name !== '.emptyFolderPlaceholder').map(file => ({
        name: file.name,
        url: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/site-images/${file.name}`,
        created: file.created_at,
      }));
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop() || 'png';
        const fileName = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage.from('site-images').upload(fileName, file, { contentType: file.type, upsert: true });
        if (error) throw error;
      }
      queryClient.invalidateQueries({ queryKey: ['admin-images'] });
      toast({ title: '✅ Uploaded', description: `${files.length} image(s) uploaded successfully` });
    } catch (err: any) {
      toast({ title: 'Upload Error', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    setDeleting(name);
    try {
      const { error } = await supabase.storage.from('site-images').remove([name]);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['admin-images'] });
      toast({ title: '🗑️ Deleted', description: `"${name}" removed` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setDeleting(null);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopyMsg(url);
    setTimeout(() => setCopyMsg(null), 2000);
    toast({ title: '📋 Copied', description: 'Image URL copied to clipboard' });
  };

  if (isLoading) return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-lg font-bold text-foreground">Image Gallery</h2>
        <div className="flex items-center gap-2">
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No images yet. Upload photos or ask Sarina to generate one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {images.map(img => (
            <div key={img.name} className="bg-card border border-border rounded-xl overflow-hidden group relative">
              <img src={img.url} alt={img.name} className="w-full h-32 object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button onClick={() => copyUrl(img.url)} className="p-2 bg-white/90 rounded-lg hover:bg-white text-foreground" title="Copy URL">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(img.name)} disabled={deleting === img.name} className="p-2 bg-white/90 rounded-lg hover:bg-white text-destructive" title="Delete">
                  {deleting === img.name ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
              <div className="p-2">
                <p className="text-xs text-muted-foreground truncate">{img.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Progress Tracker ───
interface BatchProgress {
  total: number;
  completed: number;
  current: string;
  successes: string[];
  failures: string[];
  images: string[];
}

const PRODUCT_NAMES: Record<string, string> = {
  "amla-powder": "Amla Powder", "shikakai-powder": "Shikakai Powder", "ritha-powder": "Ritha Powder",
  "bhringraj-powder": "Bhringraj Powder", "hibiscus-powder": "Hibiscus Powder", "onion-powder": "Onion Powder",
  "coconut-powder": "Coconut Powder", "rosemary-powder": "Rosemary Powder", "rose-petals-powder": "Rose Petals Powder",
  "multani-mitti": "Multani Mitti", "neem-powder": "Neem Powder", "kasturi-haldi": "Kasturi Haldi",
  "orange-peel-powder": "Orange Peel Powder", "brahmi-powder": "Brahmi Powder", "moringa-powder": "Moringa Powder",
};

const BatchProgressUI = ({ progress }: { progress: BatchProgress }) => {
  const pct = Math.round((progress.completed / progress.total) * 100);
  return (
    <div className="bg-card border border-border rounded-2xl px-4 py-3 max-w-[85%] space-y-3">
      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-primary flex-shrink-0" />
        <span className="text-sm font-medium text-foreground">Generating images...</span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{progress.completed}/{progress.total} completed</span>
          <span className="font-semibold text-primary">{pct}%</span>
        </div>
        <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
          <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.4, ease: 'easeOut' }} />
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted-foreground">Currently generating:</span>
        <span className="font-medium text-foreground bg-primary/10 px-2 py-0.5 rounded-full">{progress.current}</span>
      </div>
      <div className="flex gap-3 text-xs">
        {progress.successes.length > 0 && <span className="text-primary">✅ {progress.successes.length} done</span>}
        {progress.failures.length > 0 && <span className="text-destructive">❌ {progress.failures.length} failed</span>}
      </div>
      {progress.images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {progress.images.slice(-4).map((img, i) => (
            <img key={i} src={img} alt="Generated" className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-border" />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Image Zoom Modal ───
const ImageZoomModal = ({ src, onClose }: { src: string; onClose: () => void }) => (
  <AnimatePresence>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 cursor-pointer" onClick={onClose}>
      <motion.img initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
        src={src} alt="Zoomed" className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()} />
      <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white">
        <X className="w-6 h-6" />
      </button>
    </motion.div>
  </AnimatePresence>
);

// ─── Deploy Confirmation Banner ───
const DeployConfirmBanner = ({ images, onConfirm, onReject, deploying }: {
  images: { url: string; model?: string; contentKey?: string }[];
  onConfirm: () => void;
  onReject: () => void;
  deploying?: boolean;
}) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-accent/10 border border-accent rounded-2xl p-4 space-y-3">
    <p className="text-sm font-medium text-foreground">📋 Review before deploying:</p>
    <div className="grid grid-cols-2 gap-2">
      {images.map((img, i) => (
        <div key={i} className="relative">
          <img src={img.url} alt="Preview" className="rounded-xl w-full h-28 object-cover border border-border" />
          {img.model && (
            <span className="absolute bottom-1 left-1 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded-full">
              🤖 {img.model.split('/').pop()}
            </span>
          )}
          {img.contentKey && (
            <span className="absolute top-1 left-1 text-[9px] bg-primary/80 text-primary-foreground px-1.5 py-0.5 rounded-full">
              {img.contentKey}
            </span>
          )}
        </div>
      ))}
    </div>
    <div className="flex gap-2">
      <button onClick={onConfirm} disabled={deploying}
        className="flex-1 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5">
        {deploying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
        {deploying ? 'Deploying...' : 'Deploy to Website'}
      </button>
      <button onClick={onReject} disabled={deploying}
        className="flex-1 py-2 bg-secondary text-secondary-foreground rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5">
        <XCircle className="w-4 h-4" />
        Discard
      </button>
    </div>
  </motion.div>
);


const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '🌿 **Welcome to Sarina AI Editor!**\n\nI can **deploy changes live** to your website — changes appear **instantly** in real-time. Try:\n\n- ✏️ "Change hero heading to Welcome to Mittika"\n- 🖼️ "Generate a high-quality banner of herbal powders"\n- 🖼️ "Generate benefit images for all 15 products"\n- 📎 Upload PDFs, images, or documents as reference\n- 📋 "Show me all live content"\n- 🎨 "Set primary color to dark green"\n\n💡 **Images are previewed first** — you approve before they go live!' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [batchProgress, setBatchProgress] = useState<BatchProgress | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; url: string; type: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [pendingDeploy, setPendingDeploy] = useState<{ url: string; model?: string; contentKey?: string }[] | null>(null);
  const [deploying, setDeploying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, batchProgress]);

  const invalidateCaches = () => {
    queryClient.invalidateQueries({ queryKey: ['site-content'] });
    queryClient.invalidateQueries({ queryKey: ['admin-content'] });
    queryClient.invalidateQueries({ queryKey: ['admin-theme'] });
    queryClient.invalidateQueries({ queryKey: ['admin-images'] });
  };

  // Auto-retry wrapper: if a tool fails, retry with simplified approach
  const executeToolWithRecovery = async (toolName: string, parameters: any, retryCount = 0): Promise<string> => {
    try {
      const result = await callFunction({ action: 'execute_tool', tool_call: { tool_name: toolName, parameters } });

      if (result.batch_mode) {
        return await executeBatchImages({ product_ids: result.product_ids, image_type: result.image_type });
      }

      // Handle image generation failure with auto-retry
      if (toolName === 'generate_image' && !result.success && result.error_type === 'generation_failed' && retryCount < 2) {
        console.log(`Image gen failed, auto-retrying with fast mode (attempt ${retryCount + 1})`);
        setStatusText('🔄 Auto-retrying with faster model...');
        await new Promise(r => setTimeout(r, 2000));
        return executeToolWithRecovery(toolName, { ...parameters, quality: 'fast' }, retryCount + 1);
      }

      if (['update_content', 'delete_content', 'update_theme', 'bulk_update_content', 'bulk_delete_content'].includes(toolName)) {
        invalidateCaches();
      }

      // For preview images, also invalidate
      if (toolName === 'generate_image' && result.success) {
        invalidateCaches();
      }

      return JSON.stringify(result);
    } catch (err: any) {
      // Auto-retry on transient errors
      if (retryCount < 2 && !err.message.includes('credits')) {
        console.log(`Tool ${toolName} failed: ${err.message}, auto-retrying (attempt ${retryCount + 1})`);
        setStatusText(`🔄 Auto-recovering from error... (attempt ${retryCount + 1})`);
        await new Promise(r => setTimeout(r, 3000 * (retryCount + 1)));
        return executeToolWithRecovery(toolName, parameters, retryCount + 1);
      }
      return JSON.stringify({ error: err.message, error_type: 'tool_error' });
    }
  };

  const executeBatchImages = async (parameters: any): Promise<string> => {
    const { product_ids, image_type } = parameters;
    const ids: string[] = product_ids === 'all' ? Object.keys(PRODUCT_NAMES) : (Array.isArray(product_ids) ? product_ids : [product_ids]);
    const total = ids.length;

    const progress: BatchProgress = { total, completed: 0, current: PRODUCT_NAMES[ids[0]] || ids[0], successes: [], failures: [], images: [] };
    setBatchProgress({ ...progress });

    for (let i = 0; i < ids.length; i++) {
      const pid = ids[i];
      const name = PRODUCT_NAMES[pid] || pid;
      progress.current = name;
      setBatchProgress({ ...progress });

      const prompt = image_type === 'comparison'
        ? `Professional clean product comparison infographic: Mittika ${name} (premium, natural, lab-tested, pure herbal) vs generic market ${name.toLowerCase()} (artificial, chemical additives, no testing). Side-by-side layout, earthy green and gold colors, modern minimalist design, professional quality.`
        : `Professional infographic showing top 5 benefits of ${name} herbal powder. Beautiful icons for each benefit. Earthy natural colors (green, gold, brown). Clean premium modern design. Mittika brand style. High quality.`;

      const contentKey = `${pid}_${image_type}_image`;

      // Batch mode: auto_deploy = true
      let success = false;
      for (let attempt = 0; attempt <= 2 && !success; attempt++) {
        try {
          const result = await callFunction({
            action: 'execute_tool',
            tool_call: { tool_name: 'generate_image', parameters: { prompt, content_key: contentKey, auto_deploy: true, quality: attempt > 0 ? 'fast' : 'auto' } },
          }, 3);

          if (result.image_url) {
            progress.successes.push(name);
            progress.images.push(result.image_url);
            toast({ title: `✅ ${name}`, description: `${image_type} image generated (${result.model_used?.split('/').pop() || 'ai'})` });
            success = true;
          } else if (attempt < 2) {
            setStatusText(`🔄 Retrying ${name} with faster model...`);
            await new Promise(r => setTimeout(r, 3000));
          } else {
            progress.failures.push(`${name}: ${result.message || 'Failed'}`);
            toast({ title: `⚠️ ${name}`, description: result.message || 'Failed after retries', variant: 'destructive' });
          }
        } catch (err: any) {
          if (attempt < 2) {
            setStatusText(`🔄 Recovering error for ${name}...`);
            await new Promise(r => setTimeout(r, 3000));
          } else {
            progress.failures.push(`${name}: ${err.message}`);
            toast({ title: `❌ ${name}`, description: err.message, variant: 'destructive' });
          }
        }
      }

      progress.completed = i + 1;
      setBatchProgress({ ...progress });

      if (i < ids.length - 1) await new Promise(r => setTimeout(r, 3000));
    }

    invalidateCaches();
    setBatchProgress(null);

    return JSON.stringify({
      success: true, deployed: true,
      message: `🖼️ Batch complete: ${progress.successes.length}/${total} ${image_type} images generated & deployed. ${progress.failures.length > 0 ? `\n\nFailed: ${progress.failures.join(', ')}` : '✨ All successful!'}`,
      results: progress.successes.map(name => ({ product: name })),
      images: progress.images,
    });
  };

  // Deploy confirmed preview images
  const handleDeployConfirm = async () => {
    if (!pendingDeploy) return;
    setDeploying(true);
    let deployed = 0;
    
    for (const img of pendingDeploy) {
      if (img.contentKey) {
        try {
          await callFunction({ action: 'deploy_image', tool_call: { image_url: img.url, content_key: img.contentKey } });
          deployed++;
        } catch (err: any) {
          console.error('Deploy error:', err);
          // Auto-retry once
          try {
            await new Promise(r => setTimeout(r, 1000));
            await callFunction({ action: 'deploy_image', tool_call: { image_url: img.url, content_key: img.contentKey } });
            deployed++;
          } catch {
            toast({ title: 'Deploy Error', description: `Failed to deploy ${img.contentKey}: ${err.message}`, variant: 'destructive' });
          }
        }
      }
    }

    invalidateCaches();
    setPendingDeploy(null);
    setDeploying(false);
    
    if (deployed > 0) {
      toast({ title: '🚀 Deployed!', description: `${deployed} image(s) are now live on the website!` });
      setMessages(prev => [...prev, { role: 'assistant', content: `✅ **${deployed} image(s) deployed live!** Changes are visible on the website now.` }]);
    }
  };

  const handleDeployReject = () => {
    setPendingDeploy(null);
    setMessages(prev => [...prev, { role: 'assistant', content: '🗑️ Images discarded. Ask me to generate new ones with a different style!' }]);
  };

  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const uploaded: typeof attachedFiles = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop() || 'bin';
        const fileName = `chat-upload-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
        const { error } = await supabase.storage.from('site-images').upload(fileName, file, { contentType: file.type, upsert: true });
        if (error) throw error;

        const { data: urlData } = supabase.storage.from('site-images').getPublicUrl(fileName);
        uploaded.push({ name: file.name, url: urlData.publicUrl, type: file.type });
      }
      setAttachedFiles(prev => [...prev, ...uploaded]);
      toast({ title: '📎 Files attached', description: `${uploaded.length} file(s) ready for Sarina` });
    } catch (err: any) {
      toast({ title: 'Upload Error', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = useCallback(async () => {
    if ((!input.trim() && attachedFiles.length === 0) || loading) return;

    let userContent = input.trim();
    const fileUrls: { name: string; url: string; type: string }[] = [...attachedFiles];
    if (fileUrls.length > 0) {
      const fileList = fileUrls.map(f => `📎 ${f.name} (${f.type})`).join('\n');
      userContent = userContent ? `${userContent}\n\n**Attached files:**\n${fileList}` : `**Attached files:**\n${fileList}`;
    }

    const userMessage: Message = { role: 'user', content: userContent };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setAttachedFiles([]);
    setLoading(true);

    // Auto-recovery loop: if the entire chat call fails, retry up to 2 times
    let chatAttempt = 0;
    const maxChatAttempts = 3;

    while (chatAttempt < maxChatAttempts) {
      try {
        setStatusText(chatAttempt > 0 ? `🔄 Auto-recovering (attempt ${chatAttempt + 1})...` : '🤔 Sarina is thinking...');

        let aiContent = input.trim();
        if (fileUrls.length > 0) {
          const fileInfo = fileUrls.map(f => `Uploaded file: ${f.name} (type: ${f.type}, url: ${f.url})`).join('\n');
          aiContent = aiContent ? `${aiContent}\n\n${fileInfo}` : fileInfo;
        }

        const aiMessages = [
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: aiContent },
        ];
        const result = await callFunction({ action: 'chat', messages: aiMessages });

        if (result.tool_calls?.length > 0) {
          const toolResults: string[] = [];
          const previewImages: { url: string; model?: string; contentKey?: string }[] = [];
          const deployedImages: { url: string; model?: string }[] = [];

          for (const tc of result.tool_calls) {
            const fn = tc.function;
            const params = typeof fn.arguments === 'string' ? JSON.parse(fn.arguments) : fn.arguments;

            const toolLabels: Record<string, string> = {
              update_content: '✏️ Updating content...',
              bulk_update_content: '✏️ Bulk updating content...',
              generate_image: '🖼️ Generating image...',
              generate_product_images: '🖼️ Starting batch image generation...',
              update_theme: '🎨 Updating theme...',
              list_content: '📋 Listing content...',
              delete_content: '🗑️ Deleting content...',
              bulk_delete_content: '🗑️ Bulk deleting content...',
              get_website_info: '📖 Getting info...',
              analyze_file: '📄 Analyzing uploaded file...',
            };
            setStatusText(toolLabels[fn.name] || `⚙️ Running ${fn.name}...`);

            const toolResult = await executeToolWithRecovery(fn.name, params);
            toolResults.push(`**${fn.name}**: ${toolResult}`);

            try {
              const parsed = JSON.parse(toolResult);
              if (parsed.image_url) {
                if (parsed.preview && !parsed.deployed) {
                  // Preview image — needs confirmation
                  previewImages.push({ url: parsed.image_url, model: parsed.model_used, contentKey: parsed.content_key });
                } else if (parsed.deployed) {
                  deployedImages.push({ url: parsed.image_url, model: parsed.model_used });
                }
              }
              if (parsed.images?.length) deployedImages.push(...parsed.images.map((u: string) => ({ url: u })));
              if (parsed.deployed && !parsed.preview) {
                toast({ title: '🚀 Deployed Live', description: parsed.message || 'Change is live!' });
              }
            } catch {}
          }

          setStatusText('📝 Summarizing changes...');
          const followUp = await callFunction({
            action: 'chat',
            messages: [
              ...aiMessages,
              { role: 'assistant', content: result.message || 'Executing...' },
              { role: 'user', content: `Tool results:\n${toolResults.join('\n')}\n\nSummarize what was done. Mention which AI model was used for generated images. If images are in preview mode, tell the user to approve them.` },
            ],
          });

          const allImages = [...previewImages, ...deployedImages];
          setMessages(prev => [...prev, {
            role: 'assistant' as const,
            content: followUp.message || 'Changes applied!',
            images: allImages.length > 0 ? allImages.slice(0, 8) : undefined,
          }]);

          // Show deploy confirmation only for preview images
          if (previewImages.length > 0) {
            setPendingDeploy(previewImages);
          }
        } else {
          setMessages(prev => [...prev, { role: 'assistant' as const, content: result.message || 'Done.' }]);
        }

        // Success - break out of retry loop
        break;
      } catch (err: any) {
        chatAttempt++;
        if (chatAttempt < maxChatAttempts && !err.message.includes('credits')) {
          console.log(`Chat attempt ${chatAttempt} failed: ${err.message}, auto-retrying...`);
          setStatusText(`🔄 Auto-recovering from error (attempt ${chatAttempt + 1}/${maxChatAttempts})...`);
          await new Promise(r => setTimeout(r, 3000 * chatAttempt));
        } else {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `❌ **Error:** ${err.message}\n\n💡 **Auto-recovery exhausted.** Try:\n- Simplifying your request\n- Breaking it into smaller steps\n- Waiting a moment and trying again` 
          }]);
          break;
        }
      }
    }

    setLoading(false);
    setStatusText('');
    setBatchProgress(null);
  }, [input, loading, messages, attachedFiles]);

  return (
    <div className="flex flex-col h-full">
      {zoomedImage && <ImageZoomModal src={zoomedImage} onClose={() => setZoomedImage(null)} />}

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground'}`}>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
              {msg.images && msg.images.length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {msg.images.map((img, j) => (
                      <div key={j} className="relative group cursor-pointer" onClick={() => setZoomedImage(img.url)}>
                        <img src={img.url} alt="Generated" className="rounded-xl w-full h-32 object-cover border border-border" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <ZoomIn className="w-6 h-6 text-white drop-shadow-lg" />
                        </div>
                        {img.model && (
                          <span className="absolute bottom-1 left-1 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded-full">
                            🤖 {img.model.split('/').pop()}
                          </span>
                        )}
                        {img.contentKey && (
                          <span className="absolute top-1 left-1 text-[9px] bg-primary/80 text-primary-foreground px-1.5 py-0.5 rounded-full">
                            {img.contentKey}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {batchProgress && (
          <div className="flex justify-start">
            <BatchProgressUI progress={batchProgress} />
          </div>
        )}

        {pendingDeploy && pendingDeploy.length > 0 && (
          <div className="flex justify-start max-w-[85%]">
            <DeployConfirmBanner images={pendingDeploy} onConfirm={handleDeployConfirm} onReject={handleDeployReject} deploying={deploying} />
          </div>
        )}

        {loading && !batchProgress && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-2 max-w-[85%]">
              <Loader2 className="w-4 h-4 animate-spin text-primary flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{statusText || 'Sarina is working...'}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {attachedFiles.length > 0 && (
        <div className="px-3 py-2 border-t border-border bg-secondary/30 flex gap-2 overflow-x-auto">
          {attachedFiles.map((file, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-card border border-border rounded-lg px-2 py-1 text-xs flex-shrink-0">
              {file.type.startsWith('image/') ? (
                <img src={file.url} alt={file.name} className="w-6 h-6 rounded object-cover" />
              ) : (
                <FileText className="w-4 h-4 text-primary" />
              )}
              <span className="max-w-[100px] truncate text-foreground">{file.name}</span>
              <button onClick={() => removeAttachment(i)} className="p-0.5 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-border bg-card px-3 py-2">
        <div className="flex items-center gap-2">
          <input ref={fileInputRef} type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt" multiple onChange={handleFileUpload} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} disabled={loading || uploading}
            className="p-2.5 hover:bg-secondary rounded-xl transition-colors text-muted-foreground disabled:opacity-50" title="Attach files">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
          </button>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Tell Sarina what to change..." className="flex-1 px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-primary outline-none" disabled={loading} />
          <button onClick={handleSend} disabled={loading || (!input.trim() && attachedFiles.length === 0)} className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Dashboard ───
const SarinaAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  if (!isAuthenticated) {
    return <PasswordGate onAuth={() => setIsAuthenticated(true)} />;
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'chat', label: 'AI Editor', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'content', label: 'Content', icon: <FileText className="w-4 h-4" /> },
    { id: 'theme', label: 'Theme', icon: <Palette className="w-4 h-4" /> },
    { id: 'images', label: 'Images', icon: <ImageIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col">
      <div className="bg-card border-b border-border px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground" title="Back to website">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
          <div>
            <h1 className="font-serif text-sm font-bold text-foreground">Sarina Admin</h1>
            <p className="text-[10px] text-muted-foreground">AI Website Editor • Auto-Recovery Enabled</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Link to="/" target="_blank" className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground" title="Preview site">
            <Eye className="w-4 h-4" />
          </Link>
          <button onClick={() => setIsAuthenticated(false)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground" title="Lock">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-card border-b border-border px-2 flex gap-1 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}>
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'chat' && <AIChat />}
        {activeTab === 'content' && <div className="flex-1 overflow-y-auto"><ContentManager /></div>}
        {activeTab === 'theme' && <div className="flex-1 overflow-y-auto"><ThemeEditor /></div>}
        {activeTab === 'images' && <div className="flex-1 overflow-y-auto"><ImageGallery /></div>}
      </div>
    </div>
  );
};

export default SarinaAdmin;
