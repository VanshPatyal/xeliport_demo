'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, Loader2, Plane, Search, Ship } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RouteStatus, TradeRoute } from './routes-data'

const statusStyles: Record<RouteStatus, string> = {
  Cleared: 'bg-[#e8f7ee] text-[#15803d] ring-[#bbe5cb]',
  'In Transit': 'bg-[#e8effc] text-navy ring-[#c7d5f3]',
  'Customs Review': 'bg-[#fff4ec] text-[#c2410c] ring-[#fed7aa]',
  Delayed: 'bg-[#fdecec] text-[#b91c1c] ring-[#f8caca]',
  Initializing: 'bg-[#f1f5f9] text-navy-muted ring-steel',
}

const filters = ['All', 'Cleared', 'In Transit', 'Customs Review', 'Delayed'] as const
type Filter = (typeof filters)[number]

export function StatusTag({ status }: { status: RouteStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset',
        statusStyles[status],
      )}
    >
      {status === 'Initializing' ? (
        <Loader2 className="size-3 animate-spin" aria-hidden="true" />
      ) : (
        <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      )}
      {status}
    </span>
  )
}

export function CountryCode({ code }: { code: string }) {
  return (
    <span className="inline-flex h-6 min-w-8 items-center justify-center rounded border border-steel bg-[#f4f8fb] px-1 font-mono text-[11px] font-bold text-navy">
      {code}
    </span>
  )
}

export function RoutesTable({ routes, highlightId }: { routes: TradeRoute[]; highlightId: string | null }) {
  const [filter, setFilter] = useState<Filter>('All')
  const [query, setQuery] = useState('')

  const visibleRoutes = useMemo(() => {
    const q = query.trim().toLowerCase()
    return routes.filter((route) => {
      const matchesFilter = filter === 'All' || route.status === filter
      const matchesQuery =
        !q ||
        [route.id, route.destination, route.destinationPort, route.originPort, route.cargo]
          .join(' ')
          .toLowerCase()
          .includes(q)
      return matchesFilter && matchesQuery
    })
  }, [routes, filter, query])

  return (
    <section
      aria-labelledby="routes-heading"
      className="rounded-xl border border-steel bg-white shadow-[0_4px_16px_-6px_rgba(30,58,138,0.15)]"
    >
      <div className="flex flex-col gap-4 border-b border-steel p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 id="routes-heading" className="text-lg font-extrabold text-navy">
            Active Trade Routes
          </h2>
          <p className="text-sm text-navy-muted">
            Tariffs, HS codes and filings resolved automatically for every lane.
          </p>
        </div>
        <label className="relative flex items-center">
          <span className="sr-only">Search routes</span>
          <Search className="pointer-events-none absolute left-3 size-4 text-navy-muted" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ID, port, cargo..."
            className="h-9 w-full rounded-lg border border-steel bg-[#f4f8fb] pl-9 pr-3 text-sm text-navy placeholder:text-navy-muted/70 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15 lg:w-64"
          />
        </label>
      </div>

      <div role="tablist" aria-label="Filter by status" className="flex gap-1 overflow-x-auto border-b border-steel px-5 py-2">
        {filters.map((f) => {
          const count = f === 'All' ? routes.length : routes.filter((r) => r.status === f).length
          const active = filter === f
          return (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors',
                active ? 'bg-navy text-white' : 'text-navy-muted hover:bg-[#eef3f8] hover:text-navy',
              )}
            >
              {f}
              <span
                className={cn(
                  'rounded px-1.5 text-xs tabular-nums',
                  active ? 'bg-white/20 text-white' : 'bg-[#eef3f8] text-navy',
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse whitespace-nowrap text-left text-sm">
          <thead>
            <tr className="bg-[#f8fafc] text-xs font-bold uppercase tracking-wider text-navy-muted">
              <th scope="col" className="px-4 py-3">Shipment</th>
              <th scope="col" className="px-4 py-3">Route</th>
              <th scope="col" className="px-4 py-3">Cargo · HS Code</th>
              <th scope="col" className="px-4 py-3 text-right">Duty (auto)</th>
              <th scope="col" className="px-4 py-3">ETA</th>
              <th scope="col" className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {visibleRoutes.map((route) => {
              const ModeIcon = route.mode === 'Air' ? Plane : Ship
              return (
                <tr
                  key={route.id}
                  className={cn(
                    'group cursor-pointer border-t border-[#e2e8f0] transition-colors duration-200 hover:bg-[#eaf2ff]',
                    highlightId === route.id && 'animate-in fade-in slide-in-from-top-2 bg-[#fff7f0] duration-500',
                  )}
                >
                  <td className="relative px-4 py-4">
                    <span
                      className="absolute inset-y-0 left-0 w-1 origin-center scale-y-0 bg-cargo transition-transform duration-200 group-hover:scale-y-100"
                      aria-hidden="true"
                    />
                    <p className="font-mono text-xs font-bold text-navy">{route.id}</p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-navy-muted">
                      <ModeIcon className="size-3.5" aria-hidden="true" />
                      {route.mode} freight
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <CountryCode code={route.originCode} />
                      <ArrowRight
                        className="size-4 text-navy-muted transition-all group-hover:translate-x-0.5 group-hover:text-cargo"
                        aria-label="to"
                      />
                      <CountryCode code={route.destinationCode} />
                      <div className="ml-1 leading-tight">
                        <p className="font-bold text-navy">
                          {route.origin} to {route.destination}
                        </p>
                        <p className="text-xs text-navy-muted">
                          {route.originPort} → {route.destinationPort}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-navy">{route.cargo}</p>
                    <p className="font-mono text-xs text-navy-muted">HS {route.hsCode}</p>
                  </td>
                  <td className="px-4 py-4 text-right font-bold tabular-nums text-navy">{route.duty}</td>
                  <td className="px-4 py-4 font-medium tabular-nums text-navy">{route.eta}</td>
                  <td className="px-4 py-4">
                    <StatusTag status={route.status} />
                  </td>
                </tr>
              )
            })}
            {visibleRoutes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-navy-muted">
                  No routes match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
