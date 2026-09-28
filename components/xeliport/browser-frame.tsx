import { Lock, RotateCw } from 'lucide-react'

export function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-steel bg-white shadow-[0_30px_80px_-30px_rgba(30,58,138,0.35)]">
      <div className="flex items-center gap-4 border-b border-steel bg-[#eef3f8] px-4 py-3">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="mx-auto flex w-full max-w-md items-center gap-2 rounded-md border border-steel bg-white px-3 py-1.5">
          <Lock className="size-3.5 text-navy-muted" aria-hidden="true" />
          <span className="flex-1 truncate text-center font-mono text-xs text-navy">
            <span className="text-navy-muted">https://</span>xeliport.com/dashboard-demo
          </span>
          <RotateCw className="size-3.5 text-navy-muted" aria-hidden="true" />
        </div>
        <div className="hidden w-[52px] sm:block" aria-hidden="true" />
      </div>
      {children}
    </div>
  )
}
