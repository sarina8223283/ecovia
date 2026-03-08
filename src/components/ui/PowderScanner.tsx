import { useState, useRef } from 'react';
import { Loader2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import cameraIcon from '@/assets/icons/camera-icon.png';
import closeIcon from '@/assets/icons/close-icon.png';

const IDENTIFY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/identify-powder`;

const PowderScanner = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<{ productId: string | null; confidence: string; name: string; description: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setIsLoading(true);
    setResult(null);

    const base64Reader = new FileReader();
    base64Reader.onload = async (ev) => {
      const base64 = (ev.target?.result as string).split(',')[1];
      try {
        const resp = await fetch(IDENTIFY_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ imageBase64: base64 }),
        });

        if (!resp.ok) throw new Error('Failed to identify');
        const data = await resp.json();
        setResult(data);
      } catch {
        toast({ title: 'Error', description: 'Could not identify the powder. Please try again.', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    base64Reader.readAsDataURL(file);
  };

  const reset = () => {
    setPreview(null);
    setResult(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
        aria-label="Scan Powder"
        title="Identify powder from image"
      >
        <img src={cameraIcon} alt="Scan" className="w-8 h-8 object-contain" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-foreground/50 flex items-center justify-center p-4"
            onClick={() => { setIsOpen(false); reset(); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl shadow-elevated w-full max-w-md overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div>
                  <h3 className="font-serif font-semibold text-foreground">Powder Scanner</h3>
                  <p className="text-xs text-muted-foreground">Upload a powder image to identify it</p>
                </div>
                <button onClick={() => { setIsOpen(false); reset(); }} className="p-2 hover:bg-secondary rounded-full">
                  <img src={closeIcon} alt="Close" className="w-5 h-5 object-contain" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {!preview ? (
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 border border-border rounded-xl p-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <img src={cameraIcon} alt="Camera" className="w-6 h-6 object-contain" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-foreground block">Take a Photo</span>
                        <span className="text-xs text-muted-foreground">Use your camera to capture powder</span>
                      </div>
                      <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />
                    </label>
                    <label className="flex items-center gap-3 border border-border rounded-xl p-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-foreground block">Upload from Device</span>
                        <span className="text-xs text-muted-foreground">Choose from gallery or files</span>
                      </div>
                      <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-xl overflow-hidden">
                      <img src={preview} alt="Uploaded powder" className="w-full h-48 object-cover" />
                      {isLoading && (
                        <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center">
                          <Loader2 size={32} className="text-primary-foreground animate-spin" />
                        </div>
                      )}
                    </div>
                    {result && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-secondary rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-foreground">{result.name}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            result.confidence === 'high' ? 'bg-green-100 text-green-700' :
                            result.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {result.confidence} confidence
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{result.description}</p>
                        {result.productId && (
                          <button
                            onClick={() => { navigate(`/product/${result.productId}`); setIsOpen(false); reset(); }}
                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors w-full justify-center"
                          >
                            View Product Page
                            <ExternalLink size={14} />
                          </button>
                        )}
                      </motion.div>
                    )}
                    <button onClick={reset} className="text-sm text-primary font-medium hover:underline w-full text-center">
                      Scan another powder
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PowderScanner;
