import { ArrowRight } from 'lucide-react'
import { Panel, StatCard } from './panel'
import { CountryCode } from './routes-table'
import type { TradeRoute } from './routes-data'

const laneMeta: Record<string, { agreement: string; transitDays: number }> = {
  AE: { agreement: 'India–UAE CEPA', transitDays: 6 },
  GB: { agreement: 'UK DCTS', transitDays: 24 },
  SG: { agreement: 'India–Singapore CECA', transitDays: 2 },
  NL: { agreement: 'EU GSP', transitDays: 26 },
  US: { agreement: 'MFN tariff', transitDays: 3 },
  DE: { agreement: 'EU GSP', transitDays: 28 },
}

function parseDuty(duty: string) {
  return Number(duty.replace(/[^0-9.]/g, '')) || 0
}

type Lane = {
  code: string
  destination: string
  shipments: number
  cleared: number
  duty: number
  modes: Set<string>
}

export function TradeLanesView({ routes }: { routes: TradeRoute[] }) {
  const lanes = Object.values(
    routes.reduce<Record<string, Lane>>((acc, r) => {
      const lane = (acc[r.destinationCode] ??= {
        code: r.destinationCode,
        destination: r.destination,
        shipments: 0,
        cleared: 0,
        duty: 0,
        modes: new Set(),
      })
      lane.shipments++
      if (r.status === 'Cleared') lane.cleared++
      lane.duty += parseDuty(r.duty)
      lane.modes.add(r.mode)
      return acc
    }, {}),
  ).sort((a, b) => b.shipments - a.shipments)

  const maxShipments = Math.max(...lanes.map((l) => l.shipments), 1)
  const totalDuty = lanes.reduce((sum, l) => sum + l.duty, 0)
  const withAgreement = lanes.filter((l) => laneMeta[l.code]?.agreement !== 'MFN tariff').length

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active lanes" value={String(lanes.length)} hint="Origin: India" />
        <StatCard
          label="Duty calculated"
          value={`$${totalDuty.toLocaleString('en-US')}`}
          hint="Across all open shipments"
        />
        <StatCard label="Preferential tariffs" value={`${withAgreement}/${lanes.length}`} hint="Trade agreements applied" />
      </div>

      <Panel
        id="lanes-heading"
        title="Trade Lanes"
        description="Volume, clearance and preferential tariff coverage per destination."
      >
        <ul className="divide-y divide-[#e2e8f0]">
          {lanes.map((lane) => {
            const meta = laneMeta[lane.code] ?? { agreement: 'MFN tariff', transitDays: 14 }
            const clearance = Math.round((lane.cleared / lane.shipments) * 100)
            return (
              <li
                key={lane.code}
                className="group grid gap-4 p-5 transition-colors duration-200 hover:bg-[#eaf2ff] md:grid-cols-[1.3fr_1.5fr_repeat(3,minmax(0,0.7fr))] md:items-center"
              >
                <div className="flex items-center gap-2">
                  <CountryCode code="IN" />
                  <ArrowRight
                    className="size-4 text-navy-muted transition-all group-hover:translate-x-0.5 group-hover:text-cargo"
                    aria-label="to"
                  />
                  <CountryCode code={lane.code} />
                  <div className="ml-1 leading-tight">
                    <p className="font-bold text-navy">India to {lane.destination}</p>
                    <p className="text-xs text-navy-muted">{meta.agreement}</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-navy-muted">
                    <span>Volume</span>
                    <span className="tabular-nums text-navy">
                      {lane.shipments} shipment{lane.shipments > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#eef3f8]">
                    <div
                      className="h-full rounded-full bg-cargo transition-all duration-500"
                      style={{ width: `${(lane.shipments / maxShipments) * 100}%` }}
                    />
                  </div>
                </div>
                <Metric label="Clearance" value={`${clearance}%`} />
                <Metric label="Avg transit" value={`${meta.transitDays}d`} />
                <Metric label="Duty" value={`$${lane.duty.toLocaleString('en-US')}`} />
              </li>
            )
          })}
        </ul>
      </Panel>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="md:text-right">
      <p className="text-xs font-semibold text-navy-muted">{label}</p>
      <p className="font-bold tabular-nums text-navy">{value}</p>
    </div>
  )
}
