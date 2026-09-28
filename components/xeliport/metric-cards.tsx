import { Clock, Ship, ShieldCheck, TrendingDown, TrendingUp } from 'lucide-react'

type Metric = {
  label: string
  value: string
  delta: string
  trend: 'up' | 'down'
  context: string
  icon: typeof Ship
}

export function MetricCards({ activeShipments }: { activeShipments: number }) {
  const metrics: Metric[] = [
    {
      label: 'Active Shipments',
      value: activeShipments.toLocaleString('en-US'),
      delta: '+12.4%',
      trend: 'up',
      context: 'vs. last 30 days',
      icon: Ship,
    },
    {
      label: 'Customs Clearance Rate',
      value: '98.6%',
      delta: '+2.1%',
      trend: 'up',
      context: 'auto-filed declarations',
      icon: ShieldCheck,
    },
    {
      label: 'Transit Delays',
      value: '14',
      delta: '-31%',
      trend: 'down',
      context: 'rerouted automatically',
      icon: Clock,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map(({ label, value, delta, trend, context, icon: Icon }) => {
        const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown
        return (
          <article
            key={label}
            className="rounded-xl border border-steel border-l-4 border-l-cargo bg-white p-5 shadow-[0_4px_16px_-6px_rgba(30,58,138,0.15)] transition-shadow hover:shadow-[0_10px_28px_-8px_rgba(30,58,138,0.25)]"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-semibold text-navy-muted">{label}</h3>
              <span className="flex size-9 items-center justify-center rounded-lg bg-[#fff4ec] text-cargo-strong">
                <Icon className="size-5" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-2 text-3xl font-black tracking-tight text-navy tabular-nums">{value}</p>
            <p className="mt-3 flex items-center gap-2 text-xs text-navy-muted">
              <span className="inline-flex items-center gap-1 rounded-md bg-[#e8f7ee] px-1.5 py-0.5 font-bold text-[#15803d]">
                <TrendIcon className="size-3.5" aria-hidden="true" />
                {delta}
              </span>
              {context}
            </p>
          </article>
        )
      })}
    </div>
  )
}
