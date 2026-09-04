import { useState } from 'react';
import { z } from 'zod';
import { Loader2, Upload, X, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const demoSchema = z.object({
  name: z.string().trim().nonempty({ message: 'Name is required' }).max(100),
  email: z.string().trim().email({ message: 'Enter a valid email address' }).max(255),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[0-9\s-]{8,16}$/, { message: 'Enter a valid phone number' }),
  company: z.string().trim().max(120).optional().or(z.literal('')),
  service: z.string().trim().max(120).optional().or(z.literal('')),
  message: z.string().trim().max(1500).optional().or(z.literal('')),
});

const SERVICES = [
  'Ecovia ERP',
  'Ecovia QMS',
  'Ecovia Web Development',
  'Ecovia Agents (AI Chatbot / Voice)',
  'Android App Design & Prototype',
  'Ecommerce Development',
  'Testing & Automation',
  'Mittika Clay & Herbal Products',
  'Other / Not sure yet',
];

const MAX_FILES = 5;

const DemoRequestForm = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', service: '', message: '' });
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const picked = Array.from(list).filter((f) => f.type.startsWith('image/') && f.size <= 10 * 1024 * 1024);
    if (picked.length !== list.length) {
      toast({ title: 'Some files skipped', description: 'Only images up to 10MB each are allowed.' });
    }
    setFiles((prev) => [...prev, ...picked].slice(0, MAX_FILES));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = demoSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { fieldErrors[String(i.path[0])] = i.message; });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const paths: string[] = [];
      for (const file of files) {
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name.replace(/[^\w.-]/g, '_')}`;
        const { error } = await supabase.storage.from('demo-uploads').upload(path, file, { contentType: file.type });
        if (error) throw error;
        paths.push(path);
      }

      const { error: insertError } = await supabase.from('demo_requests').insert({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        company: parsed.data.company || null,
        service: parsed.data.service || null,
        message: parsed.data.message || null,
        image_paths: paths,
      });
      if (insertError) throw insertError;

      setDone(true);
      setForm({ name: '', email: '', phone: '', company: '', service: '', message: '' });
      setFiles([]);
      toast({ title: 'Demo request sent 🌿', description: 'Our Ecovia team will reach out within 24 hours.' });
    } catch (err) {
      toast({ title: 'Could not send request', description: 'Please try again or WhatsApp us at +91 8758808684.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40';

  if (done) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-card p-8 text-center shadow-soft">
        <h3 className="font-serif text-2xl font-bold text-foreground mb-2">Thank you! 🌿</h3>
        <p className="text-muted-foreground mb-6">Your demo request has reached Ecovia Enterprises. We will contact you within 24 hours.</p>
        <button onClick={() => setDone(false)} className="text-primary font-medium hover:underline">Send another request</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="demo-name" className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
          <input id="demo-name" className={inputClass} value={form.name} maxLength={100} onChange={(e) => set('name', e.target.value)} placeholder="Your name" />
          {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="demo-phone" className="block text-sm font-medium text-foreground mb-2">Phone Number *</label>
          <input id="demo-phone" type="tel" className={inputClass} value={form.phone} maxLength={16} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98765 43210" />
          {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label htmlFor="demo-email" className="block text-sm font-medium text-foreground mb-2">Email *</label>
          <input id="demo-email" type="email" className={inputClass} value={form.email} maxLength={255} onChange={(e) => set('email', e.target.value)} placeholder="you@company.com" />
          {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="demo-company" className="block text-sm font-medium text-foreground mb-2">Company</label>
          <input id="demo-company" className={inputClass} value={form.company} maxLength={120} onChange={(e) => set('company', e.target.value)} placeholder="Company / Brand" />
        </div>
      </div>

      <div>
        <label htmlFor="demo-service" className="block text-sm font-medium text-foreground mb-2">What do you need a demo for?</label>
        <select id="demo-service" className={inputClass} value={form.service} onChange={(e) => set('service', e.target.value)}>
          <option value="">Select a product or service</option>
          {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="demo-message" className="block text-sm font-medium text-foreground mb-2">Your requirement</label>
        <textarea id="demo-message" rows={4} className={inputClass} value={form.message} maxLength={1500} onChange={(e) => set('message', e.target.value)} placeholder="Tell us about your workflow, current tools, timelines…" />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Reference images (optional, up to {MAX_FILES})</label>
        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl px-4 py-6 cursor-pointer hover:border-primary/50 transition-colors">
          <Upload size={22} className="text-primary" />
          <span className="text-sm text-muted-foreground">Upload screenshots, sketches or sample reports (PNG/JPG, max 10MB)</span>
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
        </label>
        {files.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {files.map((file, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                <img src={URL.createObjectURL(file)} alt={`Demo reference ${i + 1}`} className="w-full h-full object-cover" />
                <button type="button" onClick={() => setFiles((p) => p.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-foreground/70 text-background rounded-full p-1" aria-label="Remove image">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="submit" disabled={submitting} className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-60">
        {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        {submitting ? 'Sending…' : 'Request a Demo'}
      </button>
    </form>
  );
};

export default DemoRequestForm;
