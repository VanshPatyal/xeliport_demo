import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Panel({
  id,
  title,
  description,
  action,
  children,
  className,
}: {
  id: string
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      aria-labelledby={id}
      className={cn(
        'rounded-xl border border-steel bg-white shadow-[0_4px_16px_-6px_rgba(30,58,138,0.15)]',
        className,
      )}
    >
      <div className="flex flex-col gap-3 border-b border-steel p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id={id} className="text-lg font-extrabold text-navy">
            {title}
          </h2>
          {description && <p className="text-sm text-navy-muted">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

export function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <article className="rounded-xl border border-steel border-l-4 border-l-cargo bg-white p-4 shadow-[0_4px_16px_-6px_rgba(30,58,138,0.15)]">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-navy-muted">{label}</h3>
      <p className="mt-1 text-2xl font-black tabular-nums text-navy">{value}</p>
      <p className="mt-1 text-xs text-navy-muted">{hint}</p>
    </article>
  )
}
