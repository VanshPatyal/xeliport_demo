'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Panel } from './panel'

const automations = [
  { key: 'autoFile', label: 'Auto-file customs declarations', hint: 'Submit entries to destination authorities as soon as cargo departs.' },
  { key: 'autoReroute', label: 'Reroute on predicted delays', hint: 'Switch carriers or ports when congestion risk exceeds 70%.' },
  { key: 'dutyOptimize', label: 'Apply preferential tariffs', hint: 'Claim FTA benefits automatically with certificates of origin.' },
  { key: 'alerts', label: 'Exception alerts', hint: 'Notify the team by email when a shipment needs human review.' },
] as const

type AutomationKey = (typeof automations)[number]['key']

const inputClass =
  'h-10 w-full rounded-lg border border-steel bg-[#f4f8fb] px-3 text-sm text-navy focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15'

export function SettingsView() {
  const [toggles, setToggles] = useState<Record<AutomationKey, boolean>>({
    autoFile: true,
    autoReroute: true,
    dutyOptimize: true,
    alerts: false,
  })
  const [saved, setSaved] = useState(false)

  function toggle(key: AutomationKey) {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }))
    setSaved(false)
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        setSaved(true)
      }}
      onChange={() => setSaved(false)}
    >
      <Panel id="company-heading" title="Company Profile" description="Used on every generated trade document.">
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-navy">
            Legal entity name
            <input className={inputClass} defaultValue="Nair Exports Pvt. Ltd." />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-navy">
            IEC number
            <input className={cn(inputClass, 'font-mono')} defaultValue="0515092847" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-navy">
            Default currency
            <select className={inputClass} defaultValue="USD">
              <option value="USD">USD — US Dollar</option>
              <option value="INR">INR — Indian Rupee</option>
              <option value="AED">AED — UAE Dirham</option>
              <option value="GBP">GBP — British Pound</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-navy">
            Default Incoterm
            <select className={inputClass} defaultValue="FOB">
              <option value="FOB">FOB — Free On Board</option>
              <option value="CIF">CIF — Cost, Insurance & Freight</option>
              <option value="DAP">DAP — Delivered At Place</option>
              <option value="DDP">DDP — Delivered Duty Paid</option>
            </select>
          </label>
        </div>
      </Panel>

      <Panel id="automation-heading" title="Automation Rules" description="Let Xeliport absorb routine compliance work.">
        <ul className="divide-y divide-[#e2e8f0]">
          {automations.map(({ key, label, hint }) => (
            <li key={key} className="flex items-center justify-between gap-4 p-5 transition-colors hover:bg-[#eaf2ff]">
              <div>
                <p id={`${key}-label`} className="text-sm font-bold text-navy">
                  {label}
                </p>
                <p className="text-xs text-navy-muted">{hint}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={toggles[key]}
                aria-labelledby={`${key}-label`}
                onClick={() => toggle(key)}
                className={cn(
                  'relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/30',
                  toggles[key] ? 'bg-cargo' : 'bg-steel',
                )}
              >
                <span
                  className={cn(
                    'absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform',
                    toggles[key] && 'translate-x-5',
                  )}
                  aria-hidden="true"
                />
              </button>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="flex items-center justify-end gap-3">
        <p role="status" className="text-sm font-semibold text-[#15803d]">
          {saved && (
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-4" aria-hidden="true" />
              Settings saved
            </span>
          )}
        </p>
        <button
          type="submit"
          className="rounded-lg bg-cargo px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-cargo-strong"
        >
          Save changes
        </button>
      </div>
    </form>
  )
}
