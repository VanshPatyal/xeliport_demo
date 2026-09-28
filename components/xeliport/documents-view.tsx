'use client'

import { useState } from 'react'
import { Download, FileCheck2, FileClock, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Panel, StatCard } from './panel'
import type { TradeRoute } from './routes-data'

type DocStatus = 'Verified' | 'Pending' | 'Generating'

type TradeDocument = {
  id: string
  name: string
  shipmentId: string
  lane: string
  status: DocStatus
}

const docTypes = ['Commercial Invoice', 'Bill of Lading', 'Certificate of Origin', 'Packing List'] as const

const docStatusStyles: Record<DocStatus, string> = {
  Verified: 'bg-[#e8f7ee] text-[#15803d] ring-[#bbe5cb]',
  Pending: 'bg-[#fff4ec] text-[#c2410c] ring-[#fed7aa]',
  Generating: 'bg-[#f1f5f9] text-navy-muted ring-steel',
}

function buildDocuments(routes: TradeRoute[]): TradeDocument[] {
  return routes.flatMap((route) =>
    docTypes.map((name, i) => {
      let status: DocStatus = 'Verified'
      if (route.status === 'Initializing') status = 'Generating'
      else if ((route.status === 'Customs Review' || route.status === 'Delayed') && i >= 2) status = 'Pending'
      const type = name === 'Bill of Lading' && route.mode === 'Air' ? 'Air Waybill' : name
      return {
        id: `${route.id}-${i}`,
        name: type,
        shipmentId: route.id,
        lane: `${route.originCode} → ${route.destinationCode}`,
        status,
      }
    }),
  )
}

const filters = ['All', 'Verified', 'Pending', 'Generating'] as const
type Filter = (typeof filters)[number]

export function DocumentsView({ routes }: { routes: TradeRoute[] }) {
  const [filter, setFilter] = useState<Filter>('All')
  const documents = buildDocuments(routes)
  const visible = documents.filter((d) => filter === 'All' || d.status === filter)
  const verified = documents.filter((d) => d.status === 'Verified').length
  const pending = documents.filter((d) => d.status === 'Pending').length

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Documents filed" value={String(documents.length)} hint="Auto-generated per shipment" />
        <StatCard label="Verified" value={String(verified)} hint="Accepted by customs" />
        <StatCard label="Awaiting review" value={String(pending)} hint="Flagged for broker sign-off" />
      </div>

      <Panel
        id="documents-heading"
        title="Trade Documents"
        description="Invoices, waybills and certificates prepared and filed by Xeliport."
      >
        <div role="tablist" aria-label="Filter documents" className="flex gap-1 overflow-x-auto border-b border-steel px-5 py-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                'shrink-0 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors',
                filter === f ? 'bg-navy text-white' : 'text-navy-muted hover:bg-[#eef3f8] hover:text-navy',
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="max-h-[480px] overflow-auto">
          <table className="w-full min-w-[640px] border-collapse whitespace-nowrap text-left text-sm">
            <thead className="sticky top-0">
              <tr className="bg-[#f8fafc] text-xs font-bold uppercase tracking-wider text-navy-muted">
                <th scope="col" className="px-4 py-3">Document</th>
                <th scope="col" className="px-4 py-3">Shipment</th>
                <th scope="col" className="px-4 py-3">Lane</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((doc) => {
                const Icon = doc.status === 'Verified' ? FileCheck2 : doc.status === 'Pending' ? FileClock : FileText
                return (
                  <tr key={doc.id} className="border-t border-[#e2e8f0] transition-colors duration-200 hover:bg-[#eaf2ff]">
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 font-semibold text-navy">
                        <Icon className="size-4 text-cargo-strong" aria-hidden="true" />
                        {doc.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-bold text-navy">{doc.shipmentId}</td>
                    <td className="px-4 py-3 font-mono text-xs text-navy-muted">{doc.lane}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset',
                          docStatusStyles[doc.status],
                        )}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        disabled={doc.status === 'Generating'}
                        className="inline-flex items-center gap-1.5 rounded-md border border-steel px-2.5 py-1 text-xs font-semibold text-navy transition-colors hover:border-cargo hover:text-cargo-strong disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Download className="size-3.5" aria-hidden="true" />
                        PDF
                        <span className="sr-only">
                          {doc.name} for {doc.shipmentId}
                        </span>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
