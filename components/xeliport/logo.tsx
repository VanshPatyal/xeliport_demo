import { cn } from '@/lib/utils'

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <span
        aria-hidden="true"
        className={cn(
          'flex items-center justify-center rounded-md bg-navy font-black text-white',
          compact ? 'size-7 text-sm' : 'size-9 text-base',
        )}
      >
        X
        <span className="-ml-0.5 mt-2 size-1.5 rounded-full bg-cargo" />
      </span>
      <span className={cn('font-extrabold tracking-tight text-navy', compact ? 'text-base' : 'text-xl')}>
        Xeliport
      </span>
    </span>
  )
}
