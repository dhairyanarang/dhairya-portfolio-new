'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import './about.css'

// Heavy 3D component — client-only (three.js needs WebGL/window) and lazy-loaded.
const Lanyard = dynamic(() => import('@/app/components/Lanyard'), { ssr: false })

const STATS = [
  { icon: '/about/icon-cube.svg',  value: '2+', label: 'Years of Experience' },
  { icon: '/about/icon-rocket.svg', value: '6+', label: 'Projects' },
  { icon: '/about/icon-globe.svg',  value: '4+', label: 'International Clients' },
]

// inline CSS custom property for stagger delay
const delay = (s: number) => ({ ['--reveal-delay']: `${s}s` } as React.CSSProperties)

export default function AboutContent() {
  const router = useRouter()
  // The interactive lanyard renders on desktop only (>1200px). At/below that the
  // ID card is hidden entirely — no static fallback — so nothing shifts/overlaps.
  const [showLanyard, setShowLanyard] = useState(false)
  // Defer mounting the lanyard until its section scrolls into view, so the card
  // drop animation plays as you arrive at it (not silently on page load).
  const [lanyardReady, setLanyardReady] = useState(false)
  const lanyardWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Desktop with a real mouse only: a min-width gate alone would still show the
    // (drag-only) card on large touch tablets like an iPad Pro, leaving its space
    // empty. Requiring a fine pointer + hover hides it on all touch devices.
    const mq = window.matchMedia('(min-width: 1201px) and (hover: hover) and (pointer: fine)')
    const update = () => setShowLanyard(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Warm the lanyard's code chunk + textures as soon as it's eligible to show, so
  // it renders (and the card drops) the instant its section scrolls into view —
  // removing the load delay between arriving and the drop.
  useEffect(() => {
    if (!showLanyard) return
    import('@/app/components/Lanyard') // also runs useGLTF.preload(card.glb)
    ;['/id-card-front.webp', '/id-card-back.webp', '/lanyard/strap1.webp'].forEach((src) => {
      const im = new window.Image()
      im.src = src
    })
  }, [showLanyard])

  useEffect(() => {
    if (!showLanyard) return
    const el = lanyardWrapRef.current
    if (!el || !('IntersectionObserver' in window)) {
      setLanyardReady(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLanyardReady(true)
          io.disconnect()
        }
      },
      // fire as soon as the lanyard column starts entering the viewport (a small
      // positive bottom margin triggers slightly early) so the drop plays the
      // moment the user scrolls to it, not after it's well past the fold.
      { rootMargin: '0px 0px 12% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [showLanyard])

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.about-page .reveal'))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Subtle scroll parallax on the hero: the photo (background) drifts slightly
  // DOWN so it scrolls a touch slower than the page, while the hero content
  // (foreground) drifts UP so it scrolls a touch faster — the small speed
  // difference between the two reads as depth. rAF-throttled, reduced-motion safe.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const hero = document.querySelector<HTMLElement>('.about-hero')
    const img = document.querySelector<HTMLElement>('.about-hero-img')
    const inner = document.querySelector<HTMLElement>('.about-hero-inner')
    if (!hero || !img) return

    let raf = 0
    const apply = () => {
      raf = 0
      const h = hero.offsetHeight || window.innerHeight
      const p = Math.min(Math.max(window.scrollY / h, 0), 1)
      // base scale 1.06 (set in CSS) gives ~3% overflow on each edge; the image
      // shift stays under that so the photo never reveals a gap.
      const imgY = p * h * 0.02   // background: drifts down, slightly slower
      const txtY = -p * h * 0.05  // foreground: drifts up, slightly faster
      img.style.transform = `translate3d(0, ${imgY}px, 0) scale(1.06)`
      if (inner) {
        inner.style.transform = `translate3d(0, ${txtY}px, 0)`
        inner.style.opacity = String(1 - p * 0.55)
      }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Close transition: play the exit animation, then route home. Modified clicks
  // (cmd/ctrl/middle) fall through to the browser's default new-tab behaviour.
  const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    const page = document.querySelector('.about-page')
    if (!page || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      router.push('/')
      return
    }
    page.classList.add('is-leaving')
    window.setTimeout(() => router.push('/'), 380)
  }

  return (
    <main
      className="about-page"
      style={{ fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif" }}
    >
      <Link href="/" className="about-back" aria-label="Back to Canvas" onClick={handleBack}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/about/icon-arrow-left.svg" alt="" aria-hidden="true" width={18} height={18} />
        Back to Canvas
      </Link>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="about-hero">
        <Image
          src="/About-hero.webp"
          alt="Dhairya Narang"
          fill
          priority
          sizes="100vw"
          className="about-hero-img"
        />
        <div className="about-hero-inner">
          <p className="about-eyebrow reveal" style={delay(0.05)}>About Me</p>
          <h1 className="about-title reveal" style={delay(0.12)}>
            Designer.<br />
            Problem Solver.<br />
            Product Builder.
          </h1>
          <p className="about-subtitle reveal" style={delay(0.2)}>
            I design digital products, build systems and use AI to work smarter and create more impact.
          </p>
          <div className="about-stats">
            {STATS.map((s, i) => (
              <div className="about-stat reveal" style={delay(0.32 + i * 0.1)} key={s.label}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.icon} alt="" aria-hidden="true" width={40} height={40} className="about-stat-icon" />
                <p className="about-stat-value">{s.value}</p>
                <p className="about-stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story + ID card ───────────────────────────────────────────────── */}
      <section className={`about-main${showLanyard ? '' : ' about-main--solo'}`}>
        <div className="about-story">
          <article className="about-block reveal">
            <p className="about-block-eyebrow">01 / The Detour</p>
            <div className="about-divider" />
            <h2 className="about-block-title">Not Part of the Plan</h2>
            <div className="about-prose">
              <p>{`I didn't plan on becoming a designer.`}</p>
              <p>A college project introduced me to Figma, and a simple shortcut—<strong>the Alt key</strong>—sent me down a rabbit hole of curiosity.</p>
              <p>What started as learning a tool quickly became an obsession with understanding <strong>how products work and why they work that way.</strong></p>
              <p>Turns out curiosity is a pretty good compass.</p>
            </div>
          </article>

          <article className="about-block reveal">
            <p className="about-block-eyebrow">02 / How I Think</p>
            <div className="about-divider" />
            <h2 className="about-block-title">Systems Over Screens</h2>
            <div className="about-prose">
              <p>{`What excites me most isn't the interface - it's the problem it's trying to solve.`}</p>
              <p>{`I've worked directly with founders, international clients, and developers across different kinds of products. Every project taught me the same thing: great design is rarely about screens. It's about understanding the `}<strong>trade-offs, aligning people around them, and building something that actually works.</strong></p>
              <p>{`Lately I've been using AI to compress what used to take days into hours - not to skip the thinking, but to do more of it.`}</p>
            </div>
          </article>

          <article className="about-block reveal">
            <p className="about-block-eyebrow">03 / Beyond Design</p>
            <div className="about-divider" />
            <h2 className="about-block-title">Beyond Design</h2>
            <div className="about-prose">
              <p>{`When I'm not designing, you'll probably find me at the gym, listening to music, following sports, or paying attention to small details most people overlook.`}</p>
              <p>{`I'm endlessly curious about how things work—whether it's a product, a process, or an everyday experience.`}</p>
            </div>
          </article>
        </div>

        {/* Desktop only (>1200px). The canvas mounts only once the column scrolls
            into view so the drop animation plays on arrival. Below 1200px nothing
            is rendered — the ID card is hidden entirely. */}
        {showLanyard && (
          <div className="about-lanyard" aria-hidden="true" ref={lanyardWrapRef}>
            {lanyardReady && (
              <Lanyard
                frontImage="/id-card-front.webp"
                backImage="/id-card-back.webp"
                position={[0, 0.5, 18]}
                fov={20}
                lanyardWidth={1}
                anchor={[2, 4, 0]}
              />
            )}
          </div>
        )}
      </section>

      {/* ── Gallery ───────────────────────────────────────────────────────── */}
      <section className="about-gallery reveal">
        <Image
          src="/Footer-band-image.webp"
          alt="Dhairya outdoors"
          fill
          sizes="(max-width: 1100px) 100vw, 1312px"
          style={{ objectFit: 'cover', objectPosition: 'center 28%' }}
        />
      </section>

      {/* ── Footer CTA ────────────────────────────────────────────────────── */}
      <footer className="about-footer reveal">
        <p className="about-cta">
          Let&rsquo;s Build something<br />
          useful <span className="about-cta-ghost">together</span> .
        </p>
        <div className="about-contact">
          <a className="about-contact-item" href="mailto:dhairyanarang077@gmail.com">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/about/icon-envelope.svg" alt="" aria-hidden="true" width={24} height={24} />
            dhairyanarang077@gmail.com
          </a>
          <a className="about-contact-item" href="https://www.linkedin.com/in/dhairya-narang/" target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/about/icon-linkedin.svg" alt="" aria-hidden="true" width={24} height={24} />
            LinkedIn
          </a>
        </div>
      </footer>
    </main>
  )
}
