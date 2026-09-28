import { ArrowRight, FileCheck2, Landmark, Route } from 'lucide-react'

const absorbed = [
  { icon: FileCheck2, label: 'HS codes auto-classified' },
  { icon: Landmark, label: 'Duties pre-calculated' },
  { icon: Route, label: 'Optimal lanes selected' },
]

export function Hero({ onInitialize }: { onInitialize: () => void }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-14 pt-10 text-center md:pt-16">
      <p className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-steel bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy">
        <span className="size-2 rounded-full bg-cargo" aria-hidden="true" />
        Cross-border trade, simplified
      </p>
      <h1 className="mx-auto max-w-4xl text-balance text-4xl font-black leading-[1.05] tracking-tight text-navy sm:text-5xl md:text-6xl">
        Global Trade &amp; Supply Chain Control Tower
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-navy-muted">
        Customs paperwork, tariff logic and carrier routing are handled by Xeliport, so your team only
        makes the decisions that matter. One click moves a shipment across borders.
      </p>
      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <button
          type="button"
          onClick={onInitialize}
          className="group inline-flex items-center gap-2 rounded-xl bg-cargo px-7 py-4 text-base font-bold text-white shadow-[0_10px_30px_-8px_rgba(249,115,22,0.65)] transition-all hover:-translate-y-0.5 hover:bg-cargo-strong focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cargo/40"
        >
          Initialize Cross-Border Route
          <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </button>
        <a
          href="#dashboard"
          className="rounded-xl px-5 py-4 text-base font-semibold text-navy underline-offset-4 hover:underline"
        >
          Explore the live demo
        </a>
      </div>
      <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {absorbed.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2 text-sm font-medium text-navy">
            <Icon className="size-4 text-cargo" aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>
    </section>
  )
}
