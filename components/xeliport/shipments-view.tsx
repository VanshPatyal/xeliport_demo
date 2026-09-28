'use client'

import { useState } from 'react'
import { Check, Plane, Ship } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Panel, StatCard } from './panel'
import { CountryCode, StatusTag } from './routes-table'
import type { RouteStatus, TradeRoute } from './routes-data'

const stages = ['Booked', 'Departed', 'Customs', 'Delivered'] as const

const stageIndex: Record<RouteStatus, number> = {
  Initializing: 0,
  'In Transit': 1,
  Delayed: 1,
  'Customs Review': 2,
  Cleared: 3,
}

const modes = ['All', 'Sea', 'Air'] as const
type ModeFilter = (typeof modes)[number]

function ProgressTracker({ status }: { status: RouteStatus }) {
  const current = stageIndex[status]
  const delayed = status === 'Delayed'
  return (
    <ol className="flex items-center" aria-label={`Progress: ${stages[current]}`}>
      {stages.map((stage, i) => {
        const done = i <= current
        return (
          <li key={stage} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  'flex size-6 items-center justify-center rounded-full border-2 text-[10px] font-bold',
                  done
                    ? delayed && i === current
                      ? 'border-[#b91c1c] bg-[#b91c1c] text-white'
                      : 'border-cargo bg-cargo text-white'
                    : 'border-steel bg-white text-navy-muted',
                )}
              >
                {done ? <Check className="size-3.5" aria-hidden="true" /> : i + 1}
              </span>
              <span className={cn('text-[11px] font-semibold', done ? 'text-navy' : 'text-navy-muted')}>
                {stage}
              </span>
            </div>
            {i < stages.length - 1 && (
              <span
                className={cn('mx-1 mb-5 h-0.5 flex-1 rounded', i < current ? 'bg-cargo' : 'bg-steel')}
                aria-hidden="true"
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

export function ShipmentsView({ routes }: { routes: TradeRoute[] }) {
  const [mode, setMode] = useState<ModeFilter>('All')
  const visible = routes.filter((r) => mode === 'All' || r.mode === mode)
  const seaCount = routes.filter((r) => r.mode === 'Sea').length
  const airCount = routes.length - seaCount
  const attention = routes.filter((r) => r.status === 'Delayed' || r.status === 'Customs Review').length

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Ocean freight" value={String(seaCount)} hint="FCL & LCL containers" />
        <StatCard label="Air freight" value={String(airCount)} hint="Priority cargo" />
        <StatCard label="Needs attention" value={String(attention)} hint="Delayed or in review" />
      </div>

      <Panel
        id="shipments-heading"
        title="Shipment Tracker"
        description="Live milestones pulled from carriers, ports and customs authorities."
        action={
          <div role="tablist" aria-label="Filter by mode" className="flex gap-1 rounded-lg bg-[#eef3f8] p-1">
            {modes.map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={cn(
                  'rounded-md px-3 py-1 text-sm font-semibold transition-colors',
                  mode === m ? 'bg-white text-navy shadow-sm' : 'text-navy-muted hover:text-navy',
                )}
              >
                {m}
              </button>
            ))}
          </div>
        }
      >
        <ul className="divide-y divide-[#e2e8f0]">
          {visible.map((route) => {
            const ModeIcon = route.mode === 'Air' ? Plane : Ship
            return (
              <li
                key={route.id}
                className="grid gap-4 p-5 transition-colors duration-200 hover:bg-[#eaf2ff] md:grid-cols-[1.2fr_1.6fr_auto] md:items-center"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#fff4ec] text-cargo-strong">
                    <ModeIcon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-bold text-navy">{route.id}</p>
                    <p className="truncate text-sm font-semibold text-navy">{route.cargo}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-navy-muted">
                      <CountryCode code={route.originCode} />
                      {'→'}
                      <CountryCode code={route.destinationCode} />
                      <span className="truncate">{route.destinationPort}</span>
                    </p>
                  </div>
                </div>
                <ProgressTracker status={route.status} />
                <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
                  <StatusTag status={route.status} />
                  <p className="text-xs text-navy-muted">
                    ETA <span className="font-bold text-navy">{route.eta}</span>
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </Panel>
    </div>
  )
}
