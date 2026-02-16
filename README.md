# Calcolatore RAL → Netto | Jet HR

**Prototipo realizzato come progetto per il processo di selezione alla posizione di AI Builder presso [Jet HR](https://www.jethr.com).**

> Calcola lo stipendio netto annuale e mensile partendo dalla RAL, con breakdown fiscale dettagliato aggiornato all'anno fiscale 2026.

---

## Perche questo progetto

Questo calcolatore e stato sviluppato come step del processo di selezione per la posizione di **AI Builder** presso Jet HR. L'obiettivo era dimostrare la capacita di:

- Costruire un prodotto funzionale e visivamente curato in tempi rapidi
- Replicare fedelmente il design system di un brand esistente (navbar, colori, tipografia)
- Implementare logica di calcolo fiscale accurata, verificata contro il calcolatore ufficiale Jet HR
- Utilizzare strumenti AI (Claude Code) come acceleratore nello sviluppo

---

## Funzionalita

- **Calcolo netto da RAL** con breakdown completo di ogni voce fiscale
- **IRPEF 2026** con i nuovi scaglioni (23% / **33%** / 43% — secondo scaglione ridotto dal 35%)
- **Selettore mensilita** (12, 13, 14) con ricalcolo del netto mensile
- **Aliquote dinamiche** nelle label — mostra lo scaglione effettivo applicato al reddito
- **Barre proporzionali** colorate per ogni voce (rosso trattenute, verde detrazioni, giallo netto)
- **Animazioni** — count-up numerico, ingresso a cascata del breakdown, spinner di caricamento
- **Design system Jet HR** — navbar scura, accenti gialli `#F5E027`, layout corporate
- **Responsive** — 2 colonne su desktop, stack verticale su mobile

---

## Parametri fiscali 2026

| Voce | Aliquota / Valore |
|------|-------------------|
| Contributi INPS dipendente | 9,19% |
| IRPEF — 1° scaglione (fino a 28.000) | 23% |
| IRPEF — 2° scaglione (28.001–50.000) | **33%** *(ridotto dal 35%)* |
| IRPEF — 3° scaglione (oltre 50.000) | 43% |
| Detrazioni lavoro dipendente | art. 13 TUIR |
| Ulteriore detrazione (20k–40k) | 1.000 € (L. 207/2024) |
| Bonus redditi bassi (fino a 20k) | 4,8%–7,1% (L. 207/2024) |
| Addizionale regionale Lombardia | 1,23%–1,73% (progressiva) |
| Addizionale comunale Milano | 0,80% (esenzione sotto 23.000 €) |

---

## Confronto con altri calcolatori

Testato con RAL 30.000 €, tempo indeterminato, 13 mensilita, Milano:

| Calcolatore | Netto mensile | Delta |
|-------------|---------------|-------|
| **Questo progetto** | **1.797 €** | — |
| Jet HR (jethr.com) | 1.800 € | +3 € |
| Stipendee (stipendee.it) | 1.797 € | 0 € |

---

## Tech Stack

| Tecnologia | Versione |
|------------|----------|
| Next.js | 16 (App Router) |
| React | 19 |
| TypeScript | 5 (strict mode) |
| Tailwind CSS | v4 |
| Font | Geist Sans |

---

## Struttura del progetto

```
app/
  globals.css            # Design system Jet HR (CSS custom properties + animazioni)
  layout.tsx             # Root layout, metadata, favicon Jet HR
  page.tsx               # Navbar con menu, hero section, footer

components/
  RalCalculator.tsx      # Calcolatore principale (input, risultati, animazioni)
  JetHRLogo.tsx          # Logo SVG Jet HR con props colore/dimensione

lib/
  calcola.ts             # Motore di calcolo fiscale puro (zero dipendenze)

public/
  favicon.png            # Favicon Jet HR
```

---

## Quick Start

```bash
npm install
npm run dev
```

Apri [localhost:3000](http://localhost:3000) nel browser.

```bash
# Build di produzione
npm run build

# Lint
npm run lint
```

---

## Deploy

Il progetto e ottimizzato per il deploy su **Vercel**. Basta collegare la repository e il deploy e automatico.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/euxhenjonex/ralcalculator-jetHR)

---

*Sviluppato con Next.js e Claude Code*
