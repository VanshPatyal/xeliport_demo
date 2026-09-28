'use client'

import { useState } from 'react'
import { Bell, Boxes, ChevronDown, FileText, Globe2, LayoutDashboard, PackageSearch, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from './logo'
import { MetricCards } from './metric-cards'
import { RoutesTable } from './routes-table'
import { ShipmentsView } from './shipments-view'
import { TradeLanesView } from './trade-lanes-view'
import { DocumentsView } from './documents-view'
import { SettingsView } from './settings-view'
import { marketFilters, productCategories, type TradeRoute } from './routes-data'

const nav = [
  { label: 'Overview', icon: LayoutDashboard, subtitle: 'Good morning, Priya' },
  { label: 'Shipments', icon: Boxes, subtitle: 'Shipments' },
  { label: 'Trade Lanes', icon: Globe2, subtitle: 'Trade Lanes' },
  { label: 'Documents', icon: FileText, subtitle: 'Documents' },
  { label: 'Settings', icon: Settings, subtitle: 'Settings' },
] as const

type View = (typeof nav)[number]['label']

export function Dashboard({
  routes,
  activeShipments,
  highlightId,
}: {
  routes: TradeRoute[]
  activeShipments: number
  highlightId: string | null
}) {
  const [view, setView] = useState<View>('Overview')
  const [market, setMarket] = useState<string>('ALL')
  const [category, setCategory] = useState<string>('ALL')
  const current = nav.find((n) => n.label === view) ?? nav[0]

  const filteredRoutes = routes.filter(
    (r) => (market === 'ALL' || r.destinationCode === market) && (category === 'ALL' || r.category === category),
  )
  const isFiltered = market !== 'ALL' || category !== 'ALL'
  const scopedShipments = isFiltered
    ? Math.round((activeShipments * filteredRoutes.length) / Math.max(routes.length, 1))
    : activeShipments
  const marketLabel = marketFilters.find((m) => m.code === market)?.label ?? 'All markets'
  const categoryLabel = category === 'ALL' ? 'All categories' : category

  return (
    <div className="flex min-h-[640px] bg-ice">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-steel bg-white p-4 lg:flex">
        <Logo compact className="px-2 pb-6" />
        <nav aria-label="Dashboard" className="flex flex-col gap-1">
          {nav.map(({ label, icon: Icon }) => {
            const active = view === label
            return (
              <button
                key={label}
                type="button"
                onClick={() => setView(label)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors',
                  active ? 'bg-[#fff4ec] text-[#c2410c]' : 'text-navy-muted hover:bg-[#eef3f8] hover:text-navy',
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </button>
            )
          })}
        </nav>
        <div className="mt-auto rounded-lg border border-steel bg-[#f4f8fb] p-3">
          <p className="text-xs font-bold text-navy">Compliance engine</p>
          <p className="mt-1 text-xs leading-relaxed text-navy-muted">
            184 regulations monitored across 42 countries.
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-steel bg-white px-5 py-4 md:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-navy-muted">Control Tower</p>
            <h2 className="text-xl font-extrabold text-navy">{current.subtitle}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative flex size-9 items-center justify-center rounded-lg border border-steel text-navy transition-colors hover:bg-[#eef3f8]"
            >
              <Bell className="size-4" aria-hidden="true" />
              <span className="sr-only">Notifications</span>
              <span className="absolute right-2 top-2 size-2 rounded-full bg-cargo" aria-hidden="true" />
            </button>
            <span
              className="flex size-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-white"
              aria-label="Priya Nair"
            >
              PN
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-steel bg-white px-5 py-3 md:px-6">
          <div role="group" aria-label="Destination market" className="flex items-center gap-1.5">
            {[{ code: 'ALL', label: 'All' }, ...marketFilters].map(({ code, label }) => {
              const active = market === code
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setMarket(code)}
                  aria-pressed={active}
                  className={cn(
                    'h-9 min-w-12 rounded-md border px-3 text-sm font-extrabold tracking-wide transition-colors',
                    active
                      ? 'border-navy bg-navy text-white shadow-sm'
                      : 'border-steel bg-[#eef3f8] text-navy-muted hover:border-navy/40 hover:text-navy',
                  )}
                >
                  {label}
                </button>
              )
            })}
          </div>

          <div className="relative">
            <label htmlFor="category-filter" className="sr-only">
              Product category
            </label>
            <select
              id="category-filter"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-9 appearance-none rounded-md border border-navy/40 bg-white pl-3 pr-9 text-sm font-semibold text-navy transition-colors hover:border-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-cargo"
            >
              <option value="ALL">All categories</option>
              {productCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-navy"
              aria-hidden="true"
            />
          </div>

          <p className="text-xs font-semibold text-navy-muted" aria-live="polite">
            {filteredRoutes.length} route{filteredRoutes.length === 1 ? '' : 's'} · {marketLabel} · {categoryLabel}
          </p>

          {isFiltered && (
            <button
              type="button"
              onClick={() => {
                setMarket('ALL')
                setCategory('ALL')
              }}
              className="ml-auto text-xs font-bold text-[#c2410c] hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>

        <nav aria-label="Dashboard sections" className="flex gap-1 overflow-x-auto border-b border-steel bg-white px-3 py-2 lg:hidden">
          {nav.map(({ label, icon: Icon }) => {
            const active = view === label
            return (
              <button
                key={label}
                type="button"
                onClick={() => setView(label)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors',
                  active ? 'bg-[#fff4ec] text-[#c2410c]' : 'text-navy-muted hover:bg-[#eef3f8] hover:text-navy',
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </button>
            )
          })}
        </nav>

        <div key={view} className="flex flex-col gap-6 p-5 animate-in fade-in duration-300 md:p-6">
          {view !== 'Settings' && filteredRoutes.length === 0 ? (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-steel bg-white px-6 py-14 text-center">
              <PackageSearch className="size-8 text-navy-muted" aria-hidden="true" />
              <p className="mt-3 text-base font-extrabold text-navy">No active routes for this selection</p>
              <p className="mt-1 text-sm text-navy-muted">
                {categoryLabel} to {marketLabel} has no shipments right now. Try another market or category.
              </p>
            </div>
          ) : (
            <>
              {view === 'Overview' && (
                <>
                  <MetricCards activeShipments={scopedShipments} />
                  <RoutesTable routes={filteredRoutes} highlightId={highlightId} />
                </>
              )}
              {view === 'Shipments' && <ShipmentsView routes={filteredRoutes} />}
              {view === 'Trade Lanes' && <TradeLanesView routes={filteredRoutes} />}
              {view === 'Documents' && <DocumentsView routes={filteredRoutes} />}
              {view === 'Settings' && <SettingsView />}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
