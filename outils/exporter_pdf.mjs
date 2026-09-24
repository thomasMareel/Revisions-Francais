#!/usr/bin/env node
// Exporte des fiches Markdown du dépôt en PDF imprimables (A4), avec rendu des tableaux,
// des diagrammes Mermaid et des blocs <details> dépliés (les réponses sont visibles à l'impression).
//
// Usage (depuis la racine du dépôt) :
//   cd outils && npm install          # une seule fois par session (marked + mermaid)
//   node outils/exporter_pdf.mjs                       # tous les .md de echantillons/ et des dossiers de contenu
//   node outils/exporter_pdf.mjs echantillons/01_*.md  # fichiers précis
//
// Sortie : exports/pdf/<même chemin relatif>.pdf
// Chromium : celui de Playwright préinstallé (PLAYWRIGHT_BROWSERS_PATH) ; sinon définir CHROMIUM_PATH.

import { createRequire } from 'node:module';
import { readFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const require = createRequire(import.meta.url);
const OUTILS = dirname(fileURLToPath(import.meta.url));
const RACINE = resolve(OUTILS, '..');
const SORTIE = join(RACINE, 'exports', 'pdf');
// Dossiers exportés par défaut ; 00_pilotage/ et copies/ sont volontairement exclus.
const DOSSIERS_PAR_DEFAUT = ['echantillons', 'theme1_nature', 'theme2_creation', 'methode', 'entrainement'];

function chargerPlaywright() {
  for (const cible of ['playwright', '/opt/node22/lib/node_modules/playwright']) {
    try { return require(cible); } catch { /* essai suivant */ }
  }
  console.error('Playwright introuvable : installe-le (npm i -g playwright) ou ajuste le chemin.');
  process.exit(1);
}

function listerMarkdown(dossier) {
  if (!existsSync(dossier)) return [];
  return readdirSync(dossier).flatMap((nom) => {
    const chemin = join(dossier, nom);
    if (statSync(chemin).isDirectory()) return listerMarkdown(chemin);
    return extname(nom) === '.md' ? [chemin] : [];
  });
}

const echapper = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Les blocs ```mermaid deviennent des <div class="mermaid"> rendus dans la page.
marked.use({
  gfm: true,
  renderer: {
    code({ text, lang }) {
      if (lang === 'mermaid') return `<div class="mermaid">${echapper(text)}</div>`;
      return false; // rendu par défaut
    },
  },
});

const CSS = `
  @page { size: A4; margin: 16mm 15mm 18mm 15mm; }
  :root { --encre: #1d1d1f; --doux: #5b5b60; --filet: #d6d3cc; --fond-bloc: #f4f2ed; --accent: #7a3e1d; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font-family: 'Bitstream Charter', Charter, 'DejaVu Serif', Georgia, serif; font-size: 10.5pt;
         line-height: 1.45; color: var(--encre); background: #fff; margin: 0; }
  h1, h2, h3, h4 { font-family: 'DejaVu Sans', 'Liberation Sans', sans-serif; line-height: 1.2;
                   break-after: avoid; page-break-after: avoid; }
  h1 { font-size: 19pt; color: var(--accent); margin: 0 0 8pt; }
  h2 { font-size: 13.5pt; border-bottom: 1.5pt solid var(--filet); padding-bottom: 3pt; margin: 16pt 0 6pt; }
  h3 { font-size: 11.5pt; margin: 12pt 0 4pt; }
  p, li { orphans: 3; widows: 3; }
  blockquote { margin: 8pt 0; padding: 6pt 10pt; background: var(--fond-bloc);
               border-left: 3pt solid var(--accent); color: #333; }
  blockquote p { margin: 3pt 0; }
  table { border-collapse: collapse; width: 100%; margin: 8pt 0; font-size: 9pt; break-inside: auto; }
  th, td { border: 0.6pt solid var(--filet); padding: 4pt 5pt; vertical-align: top; text-align: left; }
  th { background: var(--fond-bloc); font-family: 'DejaVu Sans', sans-serif; }
  tr { break-inside: avoid; }
  code { font-family: 'DejaVu Sans Mono', monospace; font-size: 9pt; background: var(--fond-bloc); padding: 0 2pt; }
  pre { background: var(--fond-bloc); padding: 6pt; white-space: pre-wrap; font-size: 8.5pt; }
  details { margin: 4pt 0; padding: 3pt 8pt; border: 0.6pt solid var(--filet); border-radius: 3pt; break-inside: avoid; }
  details > summary { font-weight: 600; list-style: none; }
  details > summary::-webkit-details-marker { display: none; }
  .mermaid { margin: 8pt auto; text-align: center; break-inside: avoid; }
  a { color: var(--accent); text-decoration: none; }
  hr { border: 0; border-top: 0.8pt solid var(--filet); margin: 12pt 0; }
`;

function pageHtml(titre, corps) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${echapper(titre)}</title>
<style>${CSS}</style></head><body>${corps}</body></html>`;
}

async function exporter(navigateur, fichier) {
  const md = readFileSync(fichier, 'utf8');
  const titre = (md.match(/^#\s+(.+)$/m) || [, relative(RACINE, fichier)])[1];
  const corps = marked.parse(md).replace(/<details>/g, '<details open>');
  const page = await navigateur.newPage();
  await page.setContent(pageHtml(titre, corps), { waitUntil: 'load' });
  if (corps.includes('class="mermaid"')) {
    await page.addScriptTag({ path: join(OUTILS, 'node_modules', 'mermaid', 'dist', 'mermaid.min.js') });
    await page.evaluate(async () => {
      window.mermaid.initialize({ startOnLoad: false, theme: 'neutral', securityLevel: 'strict' });
      await window.mermaid.run({ querySelector: '.mermaid' });
    });
  }
  const cible = join(SORTIE, relative(RACINE, fichier)).replace(/\.md$/, '.pdf');
  mkdirSync(dirname(cible), { recursive: true });
  await page.pdf({
    path: cible, format: 'A4', printBackground: true, displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: `<div style="font-size:7pt;color:#888;width:100%;text-align:center;font-family:sans-serif">
      ${echapper(titre)} — <span class="pageNumber"></span>/<span class="totalPages"></span></div>`,
    margin: { top: '16mm', bottom: '18mm', left: '15mm', right: '15mm' },
  });
  await page.close();
  console.log(`✓ ${relative(RACINE, cible)}`);
}

const args = process.argv.slice(2);
const fichiers = (args.length ? args.map((a) => resolve(process.cwd(), a))
  : DOSSIERS_PAR_DEFAUT.flatMap((d) => listerMarkdown(join(RACINE, d)))).filter((f) => f.endsWith('.md'));
if (!fichiers.length) { console.error('Aucun fichier Markdown à exporter.'); process.exit(1); }

const { chromium } = chargerPlaywright();
const navigateur = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
let echecs = 0;
for (const f of fichiers) {
  try { await exporter(navigateur, f); } catch (e) { echecs++; console.error(`✗ ${relative(RACINE, f)} : ${e.message}`); }
}
await navigateur.close();
process.exit(echecs ? 1 : 0);
