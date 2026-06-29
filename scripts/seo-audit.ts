#!/usr/bin/env tsx
/**
 * Mittika SEO Audit — runs in CI before deployment.
 * Fails the build if any product is missing critical SEO content,
 * or any <img> in the source tree is missing an alt attribute.
 *
 *   bunx tsx scripts/seo-audit.ts
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src');
const errors: string[] = [];
const warnings: string[] = [];

// ---------- 1. Product content audit ----------
try {
  // Parse products.ts as text (avoids ts-node dependency).
  const productsTxt = readFileSync(join(SRC, 'data/products.ts'), 'utf8');
  const idMatches = [...productsTxt.matchAll(/id:\s*['"]([a-z0-9-]+)['"]/g)].map(m => m[1]);
  const descMatches = [...productsTxt.matchAll(/description:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  const imageMatches = [...productsTxt.matchAll(/image:\s*([A-Za-z0-9_]+)/g)].map(m => m[1]);

  console.log(`📦 Found ${idMatches.length} products in products.ts`);

  idMatches.forEach((id, i) => {
    const desc = descMatches[i];
    if (!desc || desc.length < 40) {
      errors.push(`Product "${id}" has missing/short description (<40 chars).`);
    }
    if (!imageMatches[i]) {
      errors.push(`Product "${id}" has no image binding.`);
    }
  });

  // Classification coverage
  const clsTxt = readFileSync(join(SRC, 'data/classification.ts'), 'utf8');
  idMatches.forEach((id) => {
    if (!clsTxt.includes(`'${id}'`)) {
      warnings.push(`Product "${id}" has no entry in classification.ts (weaker AI grounding).`);
    }
  });

  // Synonyms coverage
  const synTxt = readFileSync(join(SRC, 'data/searchSynonyms.ts'), 'utf8');
  idMatches.forEach((id) => {
    if (!synTxt.includes(`'${id}'`)) {
      warnings.push(`Product "${id}" has no entry in searchSynonyms.ts (weaker search recall).`);
    }
  });
} catch (e) {
  errors.push(`Failed to parse products.ts: ${(e as Error).message}`);
}

// ---------- 2. <img> alt-text audit across src ----------
const walk = (dir: string, out: string[] = []): string[] => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (['.tsx', '.jsx', '.html'].includes(extname(f))) out.push(p);
  }
  return out;
};

const imgTagRe = /<img\b[^>]*?>/gis;
const altRe = /\balt\s*=/;
let missingAlt = 0;
for (const file of walk(SRC)) {
  const src = readFileSync(file, 'utf8');
  const tags = src.match(imgTagRe) || [];
  for (const tag of tags) {
    if (!altRe.test(tag)) {
      missingAlt++;
      errors.push(`Missing alt attribute in ${file.replace(ROOT + '/', '')}: ${tag.replace(/\s+/g, ' ').slice(0, 90)}…`);
    }
  }
}

// ---------- 3. Sitemap sanity ----------
const sitemap = join(ROOT, 'public/sitemap.xml');
if (!existsSync(sitemap)) {
  errors.push('public/sitemap.xml is missing.');
} else {
  const xml = readFileSync(sitemap, 'utf8');
  if (!xml.includes('https://ecovia.co.in/')) {
    warnings.push('sitemap.xml does not reference https://ecovia.co.in/.');
  }
}

// ---------- Report ----------
console.log(`\n🔍 SEO Audit — ${errors.length} error(s), ${warnings.length} warning(s), ${missingAlt} missing alts.`);
if (warnings.length) {
  console.log('\n⚠️  Warnings:');
  warnings.forEach(w => console.log('   • ' + w));
}
if (errors.length) {
  console.log('\n❌ Errors:');
  errors.forEach(e => console.log('   • ' + e));
  process.exit(1);
}
console.log('\n✅ SEO audit passed.');