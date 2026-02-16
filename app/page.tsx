import RalCalculator from "@/components/RalCalculator";
import JetHRLogo from "@/components/JetHRLogo";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-[family-name:var(--font-geist-sans)]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[var(--jet-black)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          {/* Left: logo + menu */}
          <div className="flex items-center gap-8">
            <JetHRLogo color="#FFFFFF" width={120} height={33} />
            {/* Desktop menu */}
            <ul className="hidden items-center gap-1 lg:flex">
              <NavItem label="Piattaforma" hasDropdown />
              <NavItem label="Consulente del lavoro" />
              <NavItem label="Per chi" hasDropdown />
              <NavItem label="Risorse" hasDropdown />
              <NavItem label="Recensioni" />
              <NavItem label="Prezzi" />
            </ul>
          </div>
          {/* Right: buttons */}
          <div className="flex items-center gap-3">
            <span className="hidden h-9 cursor-default items-center rounded-full border border-white/30 px-5 text-xs font-semibold text-white sm:inline-flex">
              Accedi
            </span>
            <span className="inline-flex h-9 items-center rounded-full bg-[var(--jet-yellow)] px-5 text-xs font-bold text-[var(--jet-text)]">
              Richiedi una demo
            </span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="border-b border-[var(--jet-border)] bg-white px-4 py-10 text-center md:py-14">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--jet-text)] md:text-4xl">
          Calcolo netto dipendente dalla RAL
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base text-[var(--jet-text-secondary)]">
          Scopri quanto guadagnerai al netto di tasse e contributi.
          Inserisci la tua RAL e ottieni subito il dettaglio completo.
        </p>
      </header>

      {/* Main */}
      <main className="flex-1 bg-[var(--jet-card)]">
        <RalCalculator />
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--jet-border)] bg-white px-4 py-5">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 text-xs text-[var(--jet-text-secondary)] sm:flex-row">
          <div className="flex items-center gap-2">
            <JetHRLogo color="#11150A" width={72} height={20} />
            <span>&middot; Anno fiscale 2026</span>
          </div>
          <span>&copy; 2026 Jet HR S.r.l.</span>
        </div>
      </footer>
    </div>
  );
}

function NavItem({ label, hasDropdown }: { label: string; hasDropdown?: boolean }) {
  return (
    <li className="flex cursor-default items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-medium text-white/80 transition-colors hover:text-white">
      {label}
      {hasDropdown && (
        <svg
          className="h-3.5 w-3.5 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      )}
    </li>
  );
}
