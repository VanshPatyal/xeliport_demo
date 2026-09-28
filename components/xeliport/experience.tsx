'use client'

import { useEffect, useRef, useState } from 'react'
import { BrowserFrame } from './browser-frame'
import { Dashboard } from './dashboard'
import { Hero } from './hero'
import { createRoute, initialRoutes, type TradeRoute } from './routes-data'

const BASE_ACTIVE_SHIPMENTS = 1284

export function Experience() {
  const [routes, setRoutes] = useState<TradeRoute[]>(initialRoutes)
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const sequence = useRef(0)
  const dashboardRef = useRef<HTMLDivElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  function initializeRoute() {
    const route = createRoute(sequence.current++)
    setRoutes((prev) => [route, ...prev])
    setHighlightId(route.id)
    dashboardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

    timers.current.push(
      setTimeout(() => {
        setRoutes((prev) => prev.map((r) => (r.id === route.id ? { ...r, status: 'Cleared' } : r)))
      }, 2200),
    )
  }

  const addedCount = routes.length - initialRoutes.length

  return (
    <>
      <Hero onInitialize={initializeRoute} />
      <section
        id="dashboard"
        ref={dashboardRef}
        aria-label="Xeliport dashboard demo"
        className="mx-auto w-full max-w-7xl scroll-mt-6 px-4 pb-24 sm:px-6"
      >
        <BrowserFrame>
          <Dashboard
            routes={routes}
            activeShipments={BASE_ACTIVE_SHIPMENTS + addedCount}
            highlightId={highlightId}
          />
        </BrowserFrame>
      </section>
    </>
  )
}
