import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { products } from '@/data/products';
import { productSynonyms } from '@/data/searchSynonyms';
import { getClassification } from '@/data/classification';

interface Props {
  className?: string;
}

const ProductSearch = ({ className }: Props) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Cmd/Ctrl + K to open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const items = useMemo(
    () =>
      products.map((p) => {
        const cls = getClassification(p.id);
        const syns = productSynonyms[p.id] || [];
        // cmdk filters by `value` — include synonyms + botanical name + keywords
        const value = [
          p.name,
          p.id,
          p.category,
          cls?.botanicalName,
          ...syns,
          ...(cls?.keywords || []),
        ]
          .filter(Boolean)
          .join(' ');
        return { ...p, value, botanical: cls?.botanicalName };
      }),
    []
  );

  const go = (id: string) => {
    setOpen(false);
    navigate(`/product/${id}`);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          'p-2 hover:bg-primary/10 rounded-full transition-all duration-200 text-primary'
        }
        aria-label="Search products"
        title="Search products (Ctrl/Cmd + K)"
      >
        <Search size={22} strokeWidth={1.8} />
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search by name, Latin name, or use (e.g. amla, soapnut, multani)…" />
        <CommandList>
          <CommandEmpty>No matching Mittika products.</CommandEmpty>
          <CommandGroup heading="Mittika Cosmetic Grade Botanical Raw Materials">
            {items.map((p) => (
              <CommandItem key={p.id} value={p.value} onSelect={() => go(p.id)}>
                <img
                  src={p.image}
                  alt=""
                  className="w-8 h-8 rounded object-cover mr-2"
                  loading="lazy"
                />
                <div className="flex flex-col">
                  <span className="font-medium">{p.name}</span>
                  {p.botanical && (
                    <span className="text-xs text-muted-foreground italic">
                      {p.botanical} · {p.category}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default ProductSearch;