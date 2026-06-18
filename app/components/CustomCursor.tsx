'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// The custom green cursor + trailing label, shared across every page EXCEPT home
// (the home route renders its own, canvas-integrated version inside
// PortfolioCanvas). Same #cursor-arrow / #cursor-tag markup + globals.css styling
// so it looks identical everywhere. Elements can set a `data-cursor="…"` label.
export default function CustomCursor() {
  const pathname = usePathname()
  const arrowRef = useRef<HTMLDivElement>(null)
  const tagRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (pathname === '/') return // home handles its own cursor
    // mouse-driven devices only
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const arrow = arrowRef.current
    const tag = tagRef.current
    if (!arrow || !tag) return

    let raf = 0
    let x = -100
    let y = -100
    let shown = false
    const render = () => {
      raf = 0
      arrow.style.transform = `translate3d(${x}px, ${y}px, 0)`
      tag.style.transform = `translate3d(${x + 22}px, ${y + 16}px, 0)`
    }
    const onMove = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      if (!shown) {
        shown = true
        arrow.style.opacity = '1'
        tag.style.opacity = '1'
      }
      if (!raf) raf = requestAnimationFrame(render)
    }
    const onOver = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.('[data-cursor]') as HTMLElement | null
      tag.textContent = el?.dataset.cursor || 'You'
    }
    const hide = () => { arrow.style.opacity = '0'; tag.style.opacity = '0'; shown = false }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('mouseleave', hide)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      document.removeEventListener('mouseleave', hide)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [pathname])

  if (pathname === '/') return null

  return (
    <>
      <div id="cursor-arrow" ref={arrowRef} style={{ opacity: 0 }}>
        <svg width="16" height="20" viewBox="0 0 14 18" fill="none">
          <path d="M0.5 0.5L13 10.5H5.5L2.5 17.5L0.5 0.5Z" fill="#34C759" />
        </svg>
      </div>
      <div id="cursor-tag" ref={tagRef} style={{ opacity: 0 }}>You</div>
    </>
  )
}
