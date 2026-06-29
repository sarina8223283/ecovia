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
  const [query, setQuery] = useState('');
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
        return { ...p, value, botanical: cls?.botanicalName, terms: [p.name.toLowerCase(), ...syns.map(s => s.toLowerCase()), cls?.botanicalName?.toLowerCase() ?? ''] };
      }),
    []
  );

  // Levenshtein distance for fuzzy "Did you mean"
  const distance = (a: string, b: string) => {
    const m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
      }
    }
    return dp[m][n];
  };

  const suggestion = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 3) return null;
    // already matches?
    const exact = items.some(p => p.value.toLowerCase().includes(q));
    if (exact) return null;
    let best: { id: string; name: string; term: string; d: number } | null = null;
    for (const p of items) {
      for (const t of p.terms) {
        if (!t) continue;
        const d = distance(q, t);
        const threshold = Math.max(1, Math.floor(Math.max(q.length, t.length) * 0.35));
        if (d <= threshold && (!best || d < best.d)) {
          best = { id: p.id, name: p.name, term: t, d };
        }
      }
    }
    return best;
  }, [query, items]);

  const go = (id: string) => {
    setOpen(false);
    setQuery('');
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
        <CommandInput
          placeholder="Search by name, Latin name, or use (e.g. amla, soapnut, multani)…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>
            <div className="py-2 px-3 text-sm">
              <p>No exact match for "{query}".</p>
              {suggestion && (
                <button
                  className="mt-2 text-primary hover:underline font-medium"
                  onClick={() => go(suggestion.id)}
                >
                  Did you mean <span className="italic">{suggestion.name}</span>?
                </button>
              )}
            </div>
          </CommandEmpty>
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