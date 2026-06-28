import { ShieldCheck, Leaf, FlaskConical, AlertTriangle } from 'lucide-react';
import type { ProductClassification as PC } from '@/data/classification';

interface Props {
  productName: string;
  classification: PC;
  themeColor: string;
}

// Semantic, AI-search-optimised classification panel.
// Uses <dl>/<dt>/<dd> so LLM crawlers (ChatGPT, Perplexity, Google AI Overviews,
// Gemini) can extract structured product facts cleanly.
const ProductClassification = ({ productName, classification, themeColor }: Props) => {
  const c = classification;
  return (
    <section
      aria-labelledby="classification-heading"
      className="py-10"
      itemScope
      itemType="https://schema.org/Product"
    >
      <meta itemProp="name" content={productName} />
      <meta itemProp="category" content={c.grade} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <header
            className="px-6 py-4 flex items-center gap-3 border-b border-border"
            style={{ background: `hsl(${themeColor} / 0.08)` }}
          >
            <ShieldCheck size={22} style={{ color: `hsl(${themeColor})` }} />
            <h2 id="classification-heading" className="font-serif text-xl sm:text-2xl font-bold text-foreground">
              Product Classification & Intended Use
            </h2>
          </header>

          <div className="px-6 py-5">
            <p className="text-sm text-muted-foreground mb-5">
              <strong className="text-foreground">{productName}</strong> is sold by
              Ecovia Enterprises (Mittika) as a{' '}
              <strong className="text-foreground">{c.grade}</strong> — a premium
              botanical raw material for DIY skin care, hair care, soap making,
              cosmetic formulations and traditional beauty applications.
            </p>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <div>
                <dt className="font-semibold text-foreground flex items-center gap-2">
                  <Leaf size={14} style={{ color: `hsl(${themeColor})` }} /> Grade
                </dt>
                <dd className="text-muted-foreground mt-1">{c.grade}</dd>
              </div>

              <div>
                <dt className="font-semibold text-foreground">Intended Use</dt>
                <dd className="text-muted-foreground mt-1">{c.intendedUse}</dd>
              </div>

              {c.botanicalName && (
                <div>
                  <dt className="font-semibold text-foreground">Botanical Name</dt>
                  <dd className="text-muted-foreground mt-1 italic">{c.botanicalName}</dd>
                </div>
              )}

              {c.partUsed && (
                <div>
                  <dt className="font-semibold text-foreground">Part Used</dt>
                  <dd className="text-muted-foreground mt-1">{c.partUsed}</dd>
                </div>
              )}

              <div className="sm:col-span-2">
                <dt className="font-semibold text-foreground flex items-center gap-2">
                  <FlaskConical size={14} style={{ color: `hsl(${themeColor})` }} /> Suitable Applications
                </dt>
                <dd className="mt-1">
                  <ul className="flex flex-wrap gap-2">
                    {c.applications.map((a) => (
                      <li
                        key={a}
                        className="px-3 py-1 rounded-full text-xs font-medium border"
                        style={{
                          backgroundColor: `hsl(${themeColor} / 0.08)`,
                          borderColor: `hsl(${themeColor} / 0.25)`,
                          color: `hsl(${themeColor})`,
                        }}
                      >
                        {a}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="font-semibold text-foreground">Format</dt>
                <dd className="text-muted-foreground mt-1">{c.formats.join(' · ')}</dd>
              </div>
            </dl>

            {/* Compliance notice */}
            <div
              className="mt-6 flex gap-3 p-4 rounded-lg border"
              style={{
                backgroundColor: 'hsl(45 90% 96%)',
                borderColor: 'hsl(45 70% 70%)',
              }}
            >
              <AlertTriangle size={18} className="flex-shrink-0 mt-0.5 text-amber-700" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <p className="font-semibold mb-1">For External Cosmetic Use Only</p>
                <p>
                  This product is supplied as a raw material for cosmetic
                  formulations and traditional beauty applications. It is{' '}
                  <strong>not sold as a food, supplement, drug, or medicine</strong>,
                  and no medical, therapeutic or curative claims are made.
                  {c.safetyNotes.length > 0 && (
                    <> Safety: {c.safetyNotes.join(' • ')}.</>
                  )}{' '}
                  Discontinue use if irritation occurs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductClassification;