"use client";

import { useState, useEffect, useRef } from "react";
import { calcolaStipendio, type CalcolaResult, type Mensilita } from "@/lib/calcola";

function formatEur(value: number): string {
  return Math.round(value).toLocaleString("it-IT");
}

function formatPercent(value: number): string {
  return value.toLocaleString("it-IT", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }) + "%";
}

function formatInputValue(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return parseInt(digits, 10).toLocaleString("it-IT");
}

function parseInputValue(formatted: string): number {
  const digits = formatted.replace(/\D/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

const MENSILITA_OPTIONS: { value: Mensilita; label: string }[] = [
  { value: 12, label: "12" },
  { value: 13, label: "13" },
  { value: 14, label: "14" },
];

/* Count-up hook: animates from 0 to target over duration ms */
function useCountUp(target: number, duration: number, trigger: number) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (trigger === 0) return;
    const start = performance.now();
    const from = 0;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration, trigger]);

  return value;
}

export default function RalCalculator() {
  const [ralInput, setRalInput] = useState("");
  const [mensilita, setMensilita] = useState<Mensilita>(12);
  const [result, setResult] = useState<CalcolaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setRalInput(formatInputValue(e.target.value));
  }

  function handleCalcola() {
    const num = parseInputValue(ralInput);
    if (num <= 0) return;

    setLoading(true);
    setResult(null);

    // Brief loading state, then reveal with animation
    setTimeout(() => {
      setResult(calcolaStipendio(num, mensilita));
      setAnimKey((k) => k + 1);
      setLoading(false);
    }, 600);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleCalcola();
  }

  // Animated values
  const animNetto = useCountUp(result?.nettoAnnuale ?? 0, 800, animKey);
  const animMensile = useCountUp(result?.nettoMensile ?? 0, 800, animKey);
  const animAliquota = useCountUp(
    Math.round((result?.aliquotaEffettiva ?? 0) * 10),
    800,
    animKey
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 font-[family-name:var(--font-geist-sans)] md:py-12">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[380px_1fr] md:gap-8">
        {/* Left column — Input */}
        <div className="space-y-6">
          {/* RAL Input */}
          <div>
            <label
              htmlFor="ral-input"
              className="mb-2 block text-sm font-semibold text-[var(--jet-text)]"
            >
              Stipendio lordo annuale (RAL)
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--jet-text-secondary)] text-base font-medium">
                &euro;
              </span>
              <input
                id="ral-input"
                type="text"
                inputMode="numeric"
                placeholder="es. 30.000"
                value={ralInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="h-14 w-full rounded-lg border border-[var(--jet-border)] bg-white pl-10 pr-4 text-lg font-semibold text-[var(--jet-text)] placeholder:text-[var(--jet-text-secondary)] placeholder:font-normal focus:border-[var(--jet-yellow)] focus:outline-none focus:ring-2 focus:ring-[var(--jet-yellow)]/30 transition-colors"
              />
            </div>
          </div>

          {/* Mensilita */}
          <div>
            <p className="mb-3 text-sm font-semibold text-[var(--jet-text)]">
              Mensilit&agrave;
            </p>
            <div className="flex gap-2">
              {MENSILITA_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMensilita(opt.value)}
                  className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                    mensilita === opt.value
                      ? "border-[var(--jet-yellow)] bg-[var(--jet-yellow)]/10 text-[var(--jet-text)]"
                      : "border-[var(--jet-border)] bg-white text-[var(--jet-text-secondary)] hover:border-[var(--jet-yellow)]/50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contratto */}
          <div>
            <p className="mb-3 text-sm font-semibold text-[var(--jet-text)]">
              Tipo di contratto
            </p>
            <label className="flex items-center gap-3 rounded-lg border border-[var(--jet-border)] bg-white px-4 py-3 cursor-default">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--jet-yellow)] bg-[var(--jet-yellow)]">
                <span className="h-2 w-2 rounded-full bg-[var(--jet-text)]" />
              </span>
              <span className="text-sm text-[var(--jet-text)]">
                Tempo indeterminato
              </span>
            </label>
          </div>

          {/* Agevolazioni contributive */}
          <div>
            <p className="mb-3 text-sm font-semibold text-[var(--jet-text)]">
              Agevolazioni contributive
            </p>
            <label className="flex items-center gap-3 rounded-lg border border-[var(--jet-border)] bg-white px-4 py-3 cursor-default">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--jet-yellow)] bg-[var(--jet-yellow)]">
                <span className="h-2 w-2 rounded-full bg-[var(--jet-text)]" />
              </span>
              <span className="text-sm text-[var(--jet-text)]">
                Nessuna agevolazione
              </span>
            </label>
          </div>

          {/* Detrazioni fiscali */}
          <div>
            <p className="mb-3 text-sm font-semibold text-[var(--jet-text)]">
              Detrazioni fiscali
            </p>
            <label className="flex items-center gap-3 rounded-lg border border-[var(--jet-border)] bg-white px-4 py-3 cursor-default">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--jet-yellow)] bg-[var(--jet-yellow)]">
                <span className="h-2 w-2 rounded-full bg-[var(--jet-text)]" />
              </span>
              <span className="text-sm text-[var(--jet-text)]">
                Nessuna agevolazione
              </span>
            </label>
          </div>

          {/* Calcola button */}
          <button
            onClick={handleCalcola}
            disabled={loading}
            className="h-12 w-full rounded-full bg-[var(--jet-yellow)] px-8 text-sm font-bold text-[var(--jet-text)] transition-all hover:bg-[var(--jet-yellow-hover)] active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Calcolo in corso...
              </span>
            ) : (
              "Calcola"
            )}
          </button>
        </div>

        {/* Right column — Results */}
        <div className="rounded-xl border border-[var(--jet-border)] bg-[var(--jet-card)] overflow-hidden">
          {/* Header */}
          <div className="border-b border-[var(--jet-border)]">
            <div className="px-5 py-3.5 text-xs font-bold tracking-wider text-[var(--jet-text)]">
              NETTO
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[var(--jet-border)] border-t-[var(--jet-yellow)]" />
              <p className="text-sm text-[var(--jet-text-secondary)]">
                Calcolando il tuo netto...
              </p>
            </div>
          ) : result ? (
            <div
              key={animKey}
              className="animate-fade-in p-5 md:p-6"
              style={{ animation: "fadeSlideIn 0.5s ease-out" }}
            >
              {/* Main figure */}
              <div className="mb-6">
                <p className="text-sm text-[var(--jet-text-secondary)] mb-1">
                  Stipendio netto
                </p>
                <p className="text-4xl font-bold text-[var(--jet-text)] tracking-tight">
                  {formatEur(animNetto)}{" "}
                  <span className="text-lg font-medium text-[var(--jet-text-secondary)]">
                    &euro;
                  </span>
                </p>
                <p className="text-xs text-[var(--jet-text-secondary)] mt-1">
                  netto annuale
                </p>
              </div>

              <div className="mb-6 flex items-baseline gap-2 rounded-lg bg-white border border-[var(--jet-border)] px-4 py-3">
                <span className="text-sm text-[var(--jet-text-secondary)]">
                  Netto mensile (&times;{result.mensilita}):
                </span>
                <span className="text-xl font-bold text-[var(--jet-text)]">
                  {formatEur(animMensile)} &euro;
                </span>
              </div>

              <div className="mb-6 flex items-baseline gap-2 rounded-lg bg-white border border-[var(--jet-border)] px-4 py-3">
                <span className="text-sm text-[var(--jet-text-secondary)]">
                  Aliquota effettiva:
                </span>
                <span className="text-xl font-bold text-[var(--jet-text)]">
                  {(animAliquota / 10).toLocaleString("it-IT", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}%
                </span>
              </div>

              {/* Breakdown */}
              {(() => {
                // Aliquota marginale IRPEF (ultimo scaglione usato)
                const lastScaglione = result.irpefScaglioni[result.irpefScaglioni.length - 1];
                const irpefMarginale = lastScaglione
                  ? `${(lastScaglione.aliquota * 100).toFixed(0)}%`
                  : "23%";

                // Aliquota marginale addizionale regionale
                const imp = result.imponibileIrpef;
                const addRegMarginale =
                  imp <= 15_000 ? "1,23%" :
                  imp <= 28_000 ? "1,58%" :
                  imp <= 50_000 ? "1,72%" : "1,73%";

                return (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--jet-text-secondary)] mb-3">
                  Dettaglio calcolo
                </p>
                <div className="space-y-1">
                  <BreakdownRow
                    label="RAL lorda"
                    amount={result.ral}
                    ral={result.ral}
                    type="neutral"
                    delay={0}
                  />
                  <BreakdownRow
                    label="Contributi INPS (9,19%)"
                    amount={-result.contributiInps}
                    ral={result.ral}
                    type="negative"
                    delay={50}
                  />
                  <BreakdownRow
                    label="Imponibile IRPEF"
                    amount={result.imponibileIrpef}
                    ral={result.ral}
                    type="neutral"
                    bold
                    delay={100}
                  />

                  <div className="h-2" />

                  <BreakdownRow
                    label={`IRPEF lorda (scaglione max ${irpefMarginale})`}
                    amount={-result.irpefLorda}
                    ral={result.ral}
                    type="negative"
                    delay={150}
                  />
                  <BreakdownRow
                    label="Detrazioni lavoro dip. (art. 13 TUIR)"
                    amount={result.detrazioniLavoro}
                    ral={result.ral}
                    type="positive"
                    delay={200}
                  />
                  {result.ulterioreDetrazione > 0 && (
                    <BreakdownRow
                      label="Ulteriore detrazione (L. 207/2024)"
                      amount={result.ulterioreDetrazione}
                      ral={result.ral}
                      type="positive"
                      delay={250}
                    />
                  )}
                  <BreakdownRow
                    label="IRPEF netta"
                    amount={-result.irpefNetta}
                    ral={result.ral}
                    type="negative"
                    bold
                    delay={300}
                  />

                  <div className="h-2" />

                  <BreakdownRow
                    label={`Add. regionale (Lombardia, ${addRegMarginale})`}
                    amount={-result.addizionaleRegionale}
                    ral={result.ral}
                    type="negative"
                    delay={350}
                  />
                  <BreakdownRow
                    label="Add. comunale (Milano, 0,80%)"
                    amount={-result.addizionaleComunale}
                    ral={result.ral}
                    type="negative"
                    delay={400}
                  />

                  {result.bonus > 0 && (
                    <>
                      <div className="h-2" />
                      <BreakdownRow
                        label="Bonus (L. 207/2024, 4,8-7,1%)"
                        amount={result.bonus}
                        ral={result.ral}
                        type="positive"
                        delay={450}
                      />
                    </>
                  )}

                  <div className="h-2" />
                  <div className="border-t border-[var(--jet-border)] pt-2">
                    <BreakdownRow
                      label="Netto annuale"
                      amount={result.nettoAnnuale}
                      ral={result.ral}
                      type="result"
                      bold
                      delay={500}
                    />
                  </div>
                </div>
              </div>
                );
              })()}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-3 text-4xl opacity-20">&#8364;</div>
              <p className="text-sm text-[var(--jet-text-secondary)]">
                Inserisci la RAL e premi <strong>Calcola</strong>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Assunzioni */}
      <div className="mt-8 rounded-xl border border-[var(--jet-border)] bg-[var(--jet-card)] px-5 py-4 md:px-6">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--jet-text-secondary)] mb-2">
          Assunzioni del calcolo
        </p>
        <ul className="grid grid-cols-1 gap-x-8 gap-y-1 text-xs text-[var(--jet-text-secondary)] sm:grid-cols-2">
          <li>Dipendente a tempo indeterminato</li>
          <li>Residente a Milano (Lombardia)</li>
          <li>Solo reddito da lavoro dipendente</li>
          <li>Nessuna detrazione per familiari a carico</li>
          <li>Nessun benefit aziendale / welfare</li>
          <li>Nessuna agevolazione (under 36, rientro cervelli, ecc.)</li>
          <li>Anno fiscale 2026</li>
        </ul>
      </div>
    </div>
  );
}

/* Breakdown row with proportional bar + staggered entrance */

function BreakdownRow({
  label,
  amount,
  ral,
  type,
  bold,
  delay = 0,
}: {
  label: string;
  amount: number;
  ral: number;
  type: "negative" | "positive" | "neutral" | "result";
  bold?: boolean;
  delay?: number;
}) {
  const absAmount = Math.abs(amount);
  const pct = ral > 0 ? (absAmount / ral) * 100 : 0;
  const barWidth = Math.min(pct, 100);

  const sign = amount < 0 ? "\u2212" : amount > 0 && type === "positive" ? "+" : "";
  const formattedAmount = `${sign}${formatEur(absAmount)} \u20AC`;
  const formattedPct = `(${pct.toFixed(1)}%)`;

  const barColor =
    type === "negative"
      ? "bg-red-400/30"
      : type === "positive"
        ? "bg-emerald-400/30"
        : type === "result"
          ? "bg-[var(--jet-yellow)]/40"
          : "bg-[var(--jet-border)]";

  const textColor =
    type === "negative"
      ? "text-red-600"
      : type === "positive"
        ? "text-emerald-600"
        : type === "result"
          ? "text-[var(--jet-text)]"
          : "text-[var(--jet-text)]";

  return (
    <div
      className="group"
      style={{
        animation: `fadeSlideIn 0.4s ease-out ${delay}ms both`,
      }}
    >
      <div className="flex items-baseline justify-between py-1.5">
        <span
          className={`text-sm ${bold ? "font-semibold text-[var(--jet-text)]" : "text-[var(--jet-text-secondary)]"}`}
        >
          {label}
        </span>
        <span className="flex items-baseline gap-1.5 tabular-nums">
          <span
            className={`text-sm ${bold ? "font-semibold" : "font-medium"} ${textColor}`}
          >
            {formattedAmount}
          </span>
          <span className="text-[10px] text-[var(--jet-text-secondary)]">
            {formattedPct}
          </span>
        </span>
      </div>
      {/* Proportional bar */}
      <div className="h-1 w-full rounded-full bg-[var(--jet-border)]/40 overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{
            width: `${barWidth}%`,
            animation: `barGrow 0.6s ease-out ${delay + 200}ms both`,
          }}
        />
      </div>
    </div>
  );
}
