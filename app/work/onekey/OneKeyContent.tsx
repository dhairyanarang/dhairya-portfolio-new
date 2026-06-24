'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import '../casestudy.css'

// ── Content (source of truth = the OneKey Figma case study) ─────────────────
const HERO_TABLE = [
  { k: 'Role', v: 'Sole UX/UI Designer' },
  { k: 'Design Timeline', v: '8 months' },
  { k: 'Platforms', v: 'iOS, Android, WatchOS & MacOS' },
  { k: 'Responsibilities', v: 'UX Strategy · 0 → 1 Product Design · Design System · Developer Handoff · Iteration Support' },
  { k: 'Tools', v: 'Figma · Slack' },
]

const PROBLEM = [
  { title: 'Capture', text: 'Thoughts happen anywhere, but most tools expect users to stop what they’re doing first.' },
  { title: 'Organization', text: 'People spend more time maintaining systems than actually thinking.' },
  { title: 'Action', text: 'Ideas often never make it to execution.' },
]

const VISION = [
  { title: 'Capture instantly', text: 'Reduce the effort required to save thoughts.' },
  { title: 'Structure automatically', text: 'Transform raw thoughts into usable information.' },
  { title: 'Surface what matters', text: 'Bring ideas back at the right time.' },
  { title: 'Turn thoughts into action', text: 'Convert information into tasks and next steps.' },
]

const TURNING = ['More Features', 'More navigation', 'More complexity', 'Lower internal usage', 'Step back', 'Simplify']

const ECOSYSTEM = [
  { icon: 'icon-mobile', name: 'Mobile', text: 'Your primary second brain. View all your thoughts in form of properly structured notes.' },
  { icon: 'icon-watch', name: 'Apple Watch', text: 'Capture ideas in seconds without pulling out your phone.' },
  { icon: 'icon-mac', name: 'Apple Mac', text: 'Record thoughts from anywhere and sync seamlessly with OneKey.' },
]

const LOOP = [
  { name: 'Speak', text: 'Capture thoughts naturally.' },
  { name: 'Capture', text: 'Create a raw brain dump.' },
  { name: 'Structure', text: 'AI organizes information.' },
  { name: 'Review', text: 'Surface relevant insights.' },
  { name: 'Take Action', text: 'Turn ideas into tasks.' },
  { name: 'Return', text: 'Build a trusted system.' },
]

// Visual-execution groups (assets in /public/work/onekey). `single` = full-width.
const SCREENS = [
  { group: 'Onboarding Flow', single: false, w: 660, h: 1366, shots: ['onboarding-1', 'onboarding-2', 'onboarding-3'] },
  { group: 'Core Flow', single: false, w: 660, h: 1366, shots: ['core-1', 'core-2', 'core-3', 'core-4', 'core-5', 'core-6'] },
  { group: 'Watch App', single: true, w: 2240, h: 1680, shots: ['watch'] },
  { group: 'Mac App', single: true, w: 2240, h: 1437, shots: ['mac-1', 'mac-2'] },
]

const REFLECTION = [
  'Built a scalable multi-device ecosystem.',
  'Created a simplified information architecture.',
  'Reduced friction between capture and action.',
  'Designed around behaviour instead of features.',
  'Created and maintained Design System.',
  'Used Claude Code to actually contribute in dev.',
]

const BEYOND = [
  { label: 'Faster Iterations', text: 'Used AI-assisted workflows to quickly experiment, validate and refine experiences without waiting for lengthy development cycles.' },
  { label: 'Pull Request Contributions', text: 'Created and contributed to multiple pull requests to help bridge the gap between design intent and implementation.' },
  { label: 'Better Collaboration', text: 'Learned to communicate design decisions in a way that aligned closely with engineering requirements.' },
  { label: 'Technical Confidence', text: 'Developed a deeper understanding of product architecture, development constraints and how products are built end to end.' },
]

// inline custom property for reveal stagger
const delay = (s: number) => ({ ['--reveal-delay']: `${s}s` } as React.CSSProperties)

export default function OneKeyContent() {
  const router = useRouter()

  // Reveal-on-scroll (shared case-study motion).
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.cs-page .reveal'))
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
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Gentle reading-progress indicator.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const bar = document.querySelector<HTMLElement>('.cs-progress > i')
    if (!bar) return
    let raf = 0
    const apply = () => {
      raf = 0
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0
      bar.style.width = `${p * 100}%`
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Close transition → back to the projects list.
  const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    const page = document.querySelector('.cs-page')
    if (!page || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      router.push('/work')
      return
    }
    page.classList.add('is-leaving')
    window.setTimeout(() => router.push('/work'), 380)
  }

  return (
    <main className="cs-page cs-page--onekey">
      <div className="cs-progress" aria-hidden="true"><i /></div>

      <Link href="/work" className="cs-back" aria-label="Back to Projects" onClick={handleBack}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/work/icon-arrow-left.svg" alt="" aria-hidden="true" width={18} height={18} />
        Back to Projects
      </Link>

      {/* ── 1 · HERO ─────────────────────────────────────────────────────── */}
      <header className="cs-wrap cs-hero">
        <p className="cs-hero-eyebrow reveal">in-house product • iOS, Android, WatchOS &amp; macOS • 2026</p>
        <h1 className="cs-hero-title reveal" style={delay(0.06)}>
          Designing a voice-first second brain for people whose thoughts move faster than their systems.
        </h1>
        <p className="cs-hero-sub reveal" style={delay(0.12)}>
          OneKey is an ecosystem that helps people capture, organize and act on thoughts before they
          disappear. Through voice-first interactions across mobile, Apple Watch and Mac, the experience
          turns fleeting ideas into actionable outcomes.
        </p>
        <div className="cs-table reveal" style={delay(0.18)}>
          {HERO_TABLE.map((r) => (
            <div className="cs-table-row" key={r.k}>
              <div className="cs-table-key">{r.k}</div>
              <div className="cs-table-val">{r.v}</div>
            </div>
          ))}
        </div>
        <div className="cs-hero-media reveal cs-hoverable" style={delay(0.24)}>
          <div className="cs-ph cs-ph--hero cs-ph--img">
            <Image
              src="/work/onekey/hero.webp"
              alt="OneKey — speak, structure, execute"
              fill
              priority
              sizes="(max-width: 1000px) 100vw, 1120px"
              className="cs-ph-img"
            />
          </div>
        </div>
      </header>

      {/* ── 2 · THE PROBLEM ──────────────────────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">02 / The Problem</p>
        <h2 className="cs-h2 reveal" style={delay(0.05)}>Thoughts are easy to lose and difficult to revisit.</h2>
        <p className="cs-lead reveal" style={delay(0.08)}>
          Most productivity tools ask users to organize information before they’ve even captured it.
          The result is fragmented systems, forgotten ideas and constant context switching.
        </p>
        <div className="cs-cards cs-cards--3 reveal" style={delay(0.12)}>
          {PROBLEM.map((c) => (
            <div className="cs-card-wrap" key={c.title}>
              <article className="cs-card">
                <h3 className="cs-card-title">{c.title}</h3>
                <p className="cs-card-text">{c.text}</p>
              </article>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3 · PRODUCT VISION ───────────────────────────────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">03 / Product Vision</p>
          <h2 className="cs-h2 reveal" style={delay(0.05)}>OneKey had to become more than a note-taking app.</h2>
          <p className="cs-lead reveal" style={delay(0.08)}>
            The goal wasn’t to create another productivity tool. It was to create a system that
            removes friction between thinking and acting.
          </p>
          <div className="cs-cards cs-cards--4 reveal" style={delay(0.12)}>
            {VISION.map((c) => (
              <div className="cs-card-wrap" key={c.title}>
                <article className="cs-card">
                  <h3 className="cs-card-title">{c.title}</h3>
                  <p className="cs-card-text">{c.text}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 · THE TURNING POINT ────────────────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">04 / The Turning Point</p>
        <h2 className="cs-h2 reveal" style={delay(0.05)}>When adding more made the experience worse.</h2>
        <p className="cs-lead reveal" style={delay(0.08)}>
          As the product evolved, more features and navigation patterns were introduced to improve
          discoverability. Instead, it increased friction and made the experience harder to use.
        </p>
        <div className="cs-ladder reveal" style={delay(0.1)}>
          {TURNING.map((t) => (
            <div className="cs-ladder-step" key={t}>
              <span className="cs-ladder-mark" aria-hidden="true" />
              <span className="cs-ladder-label">{t}</span>
            </div>
          ))}
        </div>
        <p className="cs-ladder-note reveal" style={delay(0.14)}>
          This became a reminder that simplicity isn’t a feature. It’s the product itself.
        </p>
      </section>

      {/* ── 5 · THE ECOSYSTEM ────────────────────────────────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">05 / The Ecosystem</p>
          <h2 className="cs-h2 reveal" style={delay(0.05)}>Capture thoughts from wherever they happen.</h2>
          <p className="cs-lead reveal" style={delay(0.08)}>
            OneKey was designed as an ecosystem rather than a single app, ensuring users never need to
            change their environment to save a thought.
          </p>
          <div className="cs-cards cs-cards--3 reveal" style={delay(0.12)}>
            {ECOSYSTEM.map((c) => (
              <div className="cs-card-wrap" key={c.name}>
                <article className="cs-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="cs-card-icon" src={`/work/onekey/${c.icon}.svg`} alt="" aria-hidden="true" width={26} height={26} />
                  <h3 className="cs-card-title">{c.name}</h3>
                  <p className="cs-card-text">{c.text}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6 · CORE EXPERIENCE LOOP ─────────────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">06 / Core Experience Loop</p>
        <h2 className="cs-h2 reveal" style={delay(0.05)}>Every experience was designed around a single loop.</h2>
        <div className="cs-priority reveal" style={delay(0.1)}>
          {LOOP.map((p, i) => (
            <div className="cs-priority-row" key={p.name}>
              <div className="cs-priority-num">{String(i + 1).padStart(2, '0')}</div>
              <div className="cs-priority-name">{p.name}</div>
              <div className="cs-priority-text">{p.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7 · VISUAL EXECUTION ─────────────────────────────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">07 / Visual Execution</p>
          <h2 className="cs-h2 reveal" style={delay(0.05)}>Bringing the experience to life.</h2>
          {SCREENS.map((g) => (
            <div className="cs-screens-group reveal" key={g.group} style={delay(0.1)}>
              <h3 className="cs-screens-title">{g.group}</h3>
              <div className={`cs-screens${g.single ? ' cs-screens--single' : ''}`}>
                {g.shots.map((shot) => (
                  <div className="cs-screen cs-hoverable" key={shot}>
                    <Image
                      src={`/work/onekey/${shot}.webp`}
                      alt=""
                      aria-hidden="true"
                      width={g.w}
                      height={g.h}
                      sizes={g.single ? '(max-width: 1000px) 100vw, 900px' : '(max-width: 1000px) 45vw, 350px'}
                      className="cs-screen-img"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8 · REFLECTION ───────────────────────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">08 / Reflection</p>
        <h2 className="cs-h2 reveal" style={delay(0.05)}>What I took away.</h2>
        <div className="cs-outcomes reveal" style={delay(0.1)}>
          {REFLECTION.map((o) => (
            <div className="cs-outcome" key={o}>
              <span className="cs-outcome-mark" aria-hidden="true">✓</span>
              <span className="cs-outcome-text">{o}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 9 · BUILDING BEYOND DESIGN ───────────────────────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">09 / Building Beyond Design</p>
          <h2 className="cs-h2 reveal" style={delay(0.05)}>The work didn’t stop at handoff.</h2>
          <p className="cs-lead reveal" style={delay(0.08)}>
            This project pushed me beyond traditional product design workflows. I began using
            AI-assisted development to create pull requests, iterate faster and collaborate more
            effectively with engineers.
          </p>
          <dl className="cs-meta-cards reveal" style={delay(0.12)}>
            {BEYOND.map((r) => (
              <div className="cs-meta-card" key={r.label}>
                <dt>{r.label}</dt>
                <dd>{r.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── NEXT PROJECT ─────────────────────────────────────────────────── */}
      <section className="cs-wrap cs-section cs-section--tight">
        <p className="cs-eyebrow reveal">Next Project</p>
        <Link href="/work/ono" className="cs-next reveal" style={delay(0.05)}>
          <div className="cs-next-inner">
            <div>
              <span className="cs-next-label">Case Study</span>
              <p className="cs-next-title">ONO</p>
            </div>
            <span className="cs-next-cta">View project →</span>
          </div>
        </Link>
      </section>

      {/* ── Footer (matches About exactly) ───────────────────────────────── */}
      <footer className="cs-footer reveal">
        <p className="cs-cta">
          Let&rsquo;s Build something<br />
          useful <span className="cs-cta-ghost">together</span> .
        </p>
        <div className="cs-contact">
          <a className="cs-contact-item" href="mailto:dhairyanarang077@gmail.com">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/work/icon-envelope.svg" alt="" aria-hidden="true" width={24} height={24} />
            dhairyanarang077@gmail.com
          </a>
          <a className="cs-contact-item" href="https://www.linkedin.com/in/dhairya-narang/" target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/work/icon-linkedin.svg" alt="" aria-hidden="true" width={24} height={24} />
            LinkedIn
          </a>
        </div>
      </footer>
    </main>
  )
}
