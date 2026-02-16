// Costanti fiscali 2026

const INPS_RATE = 0.0919;

const IRPEF_BRACKETS: [number, number][] = [
  [28_000, 0.23],
  [50_000, 0.33], // ridotta dal 35% al 33% per il 2026
  [Infinity, 0.43],
];

const DETRAZIONI_LAVORO = {
  SOGLIA_1: 15_000,
  SOGLIA_2: 28_000,
  SOGLIA_3: 50_000,
  IMPORTO_BASE_1: 1_955,
  IMPORTO_MINIMO_1: 690,
  IMPORTO_BASE_2: 1_910,
  INCREMENTO_2: 1_190,
  DIVISORE_2: 13_000,
  DIVISORE_3: 22_000,
};

const BONUS_BRACKETS: [number, number][] = [
  [8_500, 0.071],
  [15_000, 0.053],
  [20_000, 0.048],
];

const ULTERIORE_DETRAZIONE = {
  SOGLIA_MIN: 20_000,
  SOGLIA_MID: 32_000,
  SOGLIA_MAX: 40_000,
  IMPORTO: 1_000,
  DIVISORE: 8_000,
};

const ADDIZIONALE_REGIONALE_LOMBARDIA: [number, number][] = [
  [15_000, 0.0123],
  [28_000, 0.0158],
  [50_000, 0.0172],
  [Infinity, 0.0173],
];

const ADDIZIONALE_COMUNALE_MILANO = {
  ALIQUOTA: 0.008,
  SOGLIA_ESENZIONE: 23_000,
};

// Interfaccia risultato

export type Mensilita = 12 | 13 | 14;

export interface IrpefScaglione {
  min: number;
  max: number;
  aliquota: number;
  imponibile: number;
  imposta: number;
}

export interface CalcolaResult {
  ral: number;
  mensilita: Mensilita;
  contributiInps: number;
  imponibileIrpef: number;
  irpefLorda: number;
  irpefScaglioni: IrpefScaglione[];
  detrazioniLavoro: number;
  bonus: number;
  ulterioreDetrazione: number;
  irpefNetta: number;
  addizionaleRegionale: number;
  addizionaleComunale: number;
  nettoAnnuale: number;
  nettoMensile: number;
  aliquotaEffettiva: number;
}

// Helper: calcolo imposta progressiva per scaglioni

function calcProgressiveTax(
  imponibile: number,
  brackets: [number, number][]
): { total: number; details: IrpefScaglione[] } {
  let remaining = imponibile;
  let prevLimit = 0;
  let total = 0;
  const details: IrpefScaglione[] = [];

  for (const [limit, rate] of brackets) {
    if (remaining <= 0) break;
    const bracketSize = limit - prevLimit;
    const taxable = Math.min(remaining, bracketSize);
    const tax = taxable * rate;
    total += tax;
    details.push({
      min: prevLimit,
      max: limit === Infinity ? Infinity : limit,
      aliquota: rate,
      imponibile: taxable,
      imposta: tax,
    });
    remaining -= taxable;
    prevLimit = limit;
  }

  return { total, details };
}

// Calcolo detrazioni lavoro dipendente

function calcDetrazioniLavoro(reddito: number): number {
  const d = DETRAZIONI_LAVORO;
  if (reddito <= d.SOGLIA_1) {
    return Math.max(d.IMPORTO_BASE_1, d.IMPORTO_MINIMO_1);
  }
  if (reddito <= d.SOGLIA_2) {
    return d.IMPORTO_BASE_2 + d.INCREMENTO_2 * ((d.SOGLIA_2 - reddito) / d.DIVISORE_2);
  }
  if (reddito <= d.SOGLIA_3) {
    return d.IMPORTO_BASE_2 * ((d.SOGLIA_3 - reddito) / d.DIVISORE_3);
  }
  return 0;
}

// Calcolo bonus per redditi ≤ 20.000 (non tassabile)

function calcBonus(reddito: number): number {
  if (reddito > 20_000) return 0;
  for (const [limit, rate] of BONUS_BRACKETS) {
    if (reddito <= limit) {
      return reddito * rate;
    }
  }
  return 0;
}

// Calcolo ulteriore detrazione per redditi 20.001 - 40.000

function calcUlterioreDetrazione(reddito: number): number {
  const u = ULTERIORE_DETRAZIONE;
  if (reddito <= u.SOGLIA_MIN || reddito > u.SOGLIA_MAX) return 0;
  if (reddito <= u.SOGLIA_MID) return u.IMPORTO;
  return u.IMPORTO * ((u.SOGLIA_MAX - reddito) / u.DIVISORE);
}

// Calcolo addizionale comunale Milano

function calcAddizionaleComunale(imponibile: number): number {
  if (imponibile <= ADDIZIONALE_COMUNALE_MILANO.SOGLIA_ESENZIONE) return 0;
  return imponibile * ADDIZIONALE_COMUNALE_MILANO.ALIQUOTA;
}

// Funzione principale

export function calcolaStipendio(ral: number, mensilita: Mensilita = 13): CalcolaResult {
  // Step 1: Contributi INPS
  const contributiInps = ral * INPS_RATE;

  // Step 2: Imponibile IRPEF
  const imponibileIrpef = ral - contributiInps;

  // Step 3: IRPEF lorda
  const { total: irpefLorda, details: irpefScaglioni } = calcProgressiveTax(
    imponibileIrpef,
    IRPEF_BRACKETS
  );

  // Step 4: Detrazioni lavoro dipendente
  const detrazioniLavoro = calcDetrazioniLavoro(imponibileIrpef);

  // Step 5: Bonus (non tassabile)
  const bonus = calcBonus(imponibileIrpef);

  // Step 6: Ulteriore detrazione
  const ulterioreDetrazione = calcUlterioreDetrazione(imponibileIrpef);

  // Step 7: IRPEF netta
  const irpefNetta = Math.max(0, irpefLorda - detrazioniLavoro - ulterioreDetrazione);

  // Step 8: Addizionale regionale Lombardia
  const { total: addizionaleRegionale } = calcProgressiveTax(
    imponibileIrpef,
    ADDIZIONALE_REGIONALE_LOMBARDIA
  );

  // Step 9: Addizionale comunale Milano
  const addizionaleComunale = calcAddizionaleComunale(imponibileIrpef);

  // Step 10: Netto
  const nettoAnnuale =
    ral - contributiInps - irpefNetta - addizionaleRegionale - addizionaleComunale + bonus;
  const nettoMensile = nettoAnnuale / mensilita;

  const aliquotaEffettiva = ral > 0 ? ((ral - nettoAnnuale) / ral) * 100 : 0;

  return {
    ral,
    mensilita,
    contributiInps,
    imponibileIrpef,
    irpefLorda,
    irpefScaglioni,
    detrazioniLavoro,
    bonus,
    ulterioreDetrazione,
    irpefNetta,
    addizionaleRegionale,
    addizionaleComunale,
    nettoAnnuale,
    nettoMensile,
    aliquotaEffettiva,
  };
}
