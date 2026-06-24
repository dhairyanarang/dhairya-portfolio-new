'use client'

import { useEffect } from 'react'

// Loads Microsoft Clarity on the client — but NOT during local development, so
// only real visitors are recorded (no localhost / `npm run dev` sessions polluting
// the recordings).
export default function Clarity({ id }: { id: string }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    const host = window.location.hostname
    if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local')) return
    if ((window as unknown as { clarity?: unknown }).clarity) return // already loaded

    ;(function (c: any, l: Document, a: string, r: string, i: string) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) }
      const t = l.createElement(r) as HTMLScriptElement
      t.async = true
      t.src = 'https://www.clarity.ms/tag/' + i
      const y = l.getElementsByTagName(r)[0]
      y.parentNode!.insertBefore(t, y)
    })(window, document, 'clarity', 'script', id)
  }, [id])

  return null
}
