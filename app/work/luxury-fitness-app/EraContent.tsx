'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import '../casestudy.css'

// ── Content (source of truth = the case study spec) ─────────────────────────
const META = [
  { dt: 'Role', dd: 'Product Designer' },
  { dt: 'Timeline', dd: '2 Weeks' },
  { dt: 'Team', dd: 'Client + Developer + Me' },
  { dt: 'Responsibilities', dd: 'UX Strategy · Product Design · Visual Design · Handoff' },
]

const OVERVIEW = [
  { k: 'Role', v: 'Sole Product Designer' },
  { k: 'Team', v: 'Client + Developer + Me' },
  { k: 'Timeline', v: '2 Week Sprint' },
  { k: 'Platforms', v: 'iOS & Android' },
  { k: 'Responsibilities', v: 'UX Strategy · Product Design · Visual Design · Design System · Developer Handoff · Iteration Support' },
  { k: 'Tools', v: 'Figma · Prototyping · Dev Handoff' },
]

const CHALLENGE = [
  { kicker: 'Business Goal', title: 'Earn the subscription', text: 'Ship a premium fitness product that feels worth paying for and stands apart from the sea of free workout trackers.' },
  { kicker: 'User Goal', title: 'Train, don’t fiddle', text: 'Let serious lifters log workouts fast, see progression over time, and stay motivated without fighting the interface.' },
  { kicker: 'Product Goal', title: 'Calm the complexity', text: 'Turn dense workout data into a calm, movement-first experience — and deliver it within a two-week sprint.' },
]

const REFERENCES = [
  { name: 'Hevy', learning: 'Frictionless set logging keeps lifters in flow.', applied: 'One-tap set entry, mid-workout.' },
  { name: 'Ladder', learning: 'Structured programs build commitment.', applied: 'Guided flows with a clear next step.' },
  { name: 'Gymverse', learning: 'Visible progress drives return visits.', applied: 'Progression surfaced as the hero.' },
  { name: 'Home Workout', learning: 'Low-friction defaults welcome beginners.', applied: 'Sensible defaults so logging never stalls.' },
  { name: 'Rolex', learning: 'Luxury lives in restraint and detail.', applied: 'Generous space, quiet type, no clutter.' },
  { name: 'Porsche', learning: 'Premium signals precision and performance.', applied: 'Performance data treated as the jewel.' },
]

const CONSTRAINTS = [
  { title: '2 Week Timeline', text: 'Concept to developer-ready in ten working days.' },
  { title: 'Workout Complexity', text: 'Sets, reps, weight, RPE, rest, supersets — without overwhelm.' },
  { title: 'Developer Speed', text: 'Patterns simple enough to build in parallel.' },
  { title: 'Premium Aesthetics', text: 'Had to feel luxury-grade, not another free tracker.' },
  { title: 'Feature Density', text: 'Five product areas competing for one screen.' },
]

const PRIORITIES = [
  { name: 'Workout Experience', text: 'The core loop. If logging fails, nothing else matters.' },
  { name: 'Progression', text: 'The reason people stay — proof they’re improving.' },
  { name: 'Nutrition', text: 'Supports results, but secondary to training.' },
  { name: 'Leaderboard', text: 'A motivation layer — valuable, not foundational.' },
  { name: 'Subscription', text: 'Monetization, designed last once the value was clear.' },
]

const DECISIONS = [
  {
    title: 'Performance Data Hierarchy',
    problem: 'Too many metrics competed for attention.',
    decision: 'Surface one primary metric per screen; demote the rest.',
    reason: 'Lifters scan, they don’t read, mid-set.',
    outcome: 'Faster comprehension, calmer screens.',
  },
  {
    title: 'Workout Feedback Loop',
    problem: 'Logging felt like data entry, not progress.',
    decision: 'Immediate confirmation after every set.',
    reason: 'Small wins sustain motivation across a session.',
    outcome: 'Logging feels rewarding, not clerical.',
  },
  {
    title: 'Achievement States',
    problem: 'Milestones disappeared into history.',
    decision: 'Dedicated states for PRs and streaks.',
    reason: 'Recognition is what brings people back.',
    outcome: 'Memorable moments, not silent records.',
  },
  {
    title: 'Rest Timer Experience',
    problem: 'Timers interrupted the workout flow.',
    decision: 'A persistent, glanceable rest timer.',
    reason: 'Rest is part of the set, not a detour.',
    outcome: 'Uninterrupted rhythm between sets.',
  },
]

const FLOW = [
  { name: 'Start Workout', note: 'Pick a program or pick up where you left off.' },
  { name: 'Log Set', note: 'One tap to record reps and weight.' },
  { name: 'Add Feedback', note: 'Capture effort (RPE) without slowing down.' },
  { name: 'Rest Timer', note: 'A glanceable timer keeps the rhythm.' },
  { name: 'Next Exercise', note: 'The next move is always one step ahead.' },
  { name: 'Workout Complete', note: 'A clear, satisfying end state.' },
  { name: 'Capture Progress', note: 'Today’s session folds into the long arc.' },
]

const SCREENS = [
  { name: 'Home', cls: 'cs-bento-a' },
  { name: 'Workout', cls: 'cs-bento-b' },
  { name: 'Nutrition', cls: 'cs-bento-c' },
  { name: 'Progress', cls: 'cs-bento-d' },
  { name: 'Leaderboard', cls: 'cs-bento-e' },
]

const COLLAB = [
  { title: 'Reviewed implementation', text: 'Walked builds against the designs and flagged drift early.' },
  { title: 'Resolved edge cases', text: 'Defined empty, loading and error states before they shipped.' },
  { title: 'Reduced ambiguity', text: 'Annotated specs so behaviour wasn’t left to guesswork.' },
  { title: 'Refined interactions', text: 'Tuned motion and feedback alongside the developer.' },
  { title: 'Answered questions', text: 'Stayed close throughout the sprint to unblock fast.' },
]

const OUTCOMES = [
  'Developer-ready foundation',
  'Unified visual language',
  'Simplified workout complexity',
  'Reduced implementation ambiguity',
]

const REFLECTION = [
  { title: 'Premium is restraint.', text: 'The luxury wasn’t in more — it was in removing everything that wasn’t earning its place.' },
  { title: 'Fitness is movement-first.', text: 'Designing for a phone propped against a dumbbell rack changed every call I made about size and tap targets.' },
  { title: 'Collaboration ships.', text: 'Staying in the loop with the developer turned handoff from a wall into a conversation.' },
]

// inline custom property for reveal stagger
const delay = (s: number) => ({ ['--reveal-delay']: `${s}s` } as React.CSSProperties)

export default function EraContent() {
  const router = useRouter()

  // Reveal-on-scroll (same approach as About).
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

  // Close transition → back to the projects list. Mirrors About / Projects.
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
    <main className="cs-page">
      <div className="cs-progress" aria-hidden="true"><i /></div>

      <Link href="/work" className="cs-back" aria-label="Back to Projects" onClick={handleBack}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/work/icon-arrow-left.svg" alt="" aria-hidden="true" width={18} height={18} />
        Back to Projects
      </Link>

      {/* ── 1 · HERO ─────────────────────────────────────────────────────── */}
      <header className="cs-wrap cs-hero">
        <p className="cs-hero-eyebrow reveal">Client Work • iOS &amp; Android • 2026</p>
        <h1 className="cs-hero-title reveal" style={delay(0.06)}>
          Designing a premium fitness experience for serious strength training.
        </h1>
        <p className="cs-hero-sub reveal" style={delay(0.12)}>
          Balancing luxury aesthetics, workout usability, and long-term motivation within a 2-week sprint.
        </p>
        <dl className="cs-meta-cards reveal" style={delay(0.18)}>
          {META.map((m) => (
            <div className="cs-meta-card" key={m.dt}>
              <dt>{m.dt}</dt>
              <dd>{m.dd}</dd>
            </div>
          ))}
        </dl>
        <div className="cs-hero-media reveal cs-hoverable" style={delay(0.24)}>
          <div className="cs-ph cs-ph--hero" data-label="Hero · 16:10" />
        </div>
      </header>

      {/* ── 2 · PROJECT OVERVIEW ─────────────────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">02 / Project Overview</p>
        <h2 className="cs-h2 reveal" style={delay(0.05)}>What exactly I did.</h2>
        <div className="cs-table reveal" style={delay(0.1)}>
          {OVERVIEW.map((r) => (
            <div className="cs-table-row" key={r.k}>
              <div className="cs-table-key">{r.k}</div>
              <div className="cs-table-val">{r.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3 · THE CHALLENGE ────────────────────────────────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">03 / The Challenge</p>
          <h2 className="cs-h2 reveal" style={delay(0.05)}>Three goals, one screen.</h2>
          <div className="cs-cards cs-cards--3 reveal" style={delay(0.1)}>
            {CHALLENGE.map((c) => (
              <div className="cs-card-wrap" key={c.kicker}>
                <article className="cs-card">
                  <span className="cs-card-kicker">{c.kicker}</span>
                  <h3 className="cs-card-title">{c.title}</h3>
                  <p className="cs-card-text">{c.text}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 · UNDERSTANDING THE SPACE ──────────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">04 / Understanding the Space</p>
        <h2 className="cs-h2 reveal" style={delay(0.05)}>
          What I borrowed — from trackers and from luxury.
        </h2>
        <div className="cs-compare reveal" style={delay(0.1)}>
          <div className="cs-compare-head">
            <span>Reference</span>
            <span>Learning</span>
            <span>Applied to the App</span>
          </div>
          {REFERENCES.map((r) => (
            <div className="cs-compare-row" key={r.name}>
              <div className="cs-compare-ref">
                <span className="cs-logo" aria-hidden="true" />
                <span className="cs-compare-name">{r.name}</span>
              </div>
              <div className="cs-compare-cell">{r.learning}</div>
              <div className="cs-compare-cell"><strong>{r.applied}</strong></div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5 · DESIGN CONSTRAINTS ───────────────────────────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">05 / Design Constraints</p>
          <h2 className="cs-h2 reveal" style={delay(0.05)}>What I had to design around.</h2>
          <div className="cs-cards cs-cards--3 reveal" style={delay(0.1)}>
            {CONSTRAINTS.map((c) => (
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

      {/* ── 6 · PRODUCT PRIORITIZATION ───────────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">06 / Product Prioritization</p>
        <h2 className="cs-h2 reveal" style={delay(0.05)}>What ships first — and why.</h2>
        <div className="cs-priority reveal" style={delay(0.1)}>
          {PRIORITIES.map((p, i) => (
            <div className={`cs-priority-row${i === 0 ? ' cs-priority-row--lead' : ''}`} key={p.name}>
              <div className="cs-priority-num">{String(i + 1).padStart(2, '0')}</div>
              <div className="cs-priority-name">{p.name}</div>
              <div className="cs-priority-text">{p.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7 · KEY DESIGN DECISIONS ─────────────────────────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">07 / Key Design Decisions</p>
          <h2 className="cs-h2 reveal" style={delay(0.05)}>How I think, made explicit.</h2>
          <div className="cs-decisions reveal" style={delay(0.1)}>
            {DECISIONS.map((d) => (
              <article className="cs-decision" key={d.title}>
                <h3 className="cs-decision-title">{d.title}</h3>
                <div className="cs-pdro">
                  <div className="cs-pdro-item">
                    <span className="cs-pdro-label">Problem</span>
                    <span className="cs-pdro-text">{d.problem}</span>
                  </div>
                  <div className="cs-pdro-item">
                    <span className="cs-pdro-label">Decision</span>
                    <span className="cs-pdro-text">{d.decision}</span>
                  </div>
                  <div className="cs-pdro-item">
                    <span className="cs-pdro-label">Reason</span>
                    <span className="cs-pdro-text">{d.reason}</span>
                  </div>
                  <div className="cs-pdro-item cs-pdro-item--outcome">
                    <span className="cs-pdro-label">Outcome</span>
                    <span className="cs-pdro-text">{d.outcome}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8 · WORKOUT EXPERIENCE DEEP DIVE ─────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">08 / Workout Experience — Deep Dive</p>
        <h2 className="cs-h2 reveal" style={delay(0.05)}>
          The core loop, from first set to captured progress.
        </h2>
        <p className="cs-lead reveal" style={delay(0.08)}>
          The workout is where the product lives or dies. I designed the full session as one
          continuous rhythm — logging, feedback and rest never break the flow.
        </p>

        <div className="cs-flow reveal" style={delay(0.1)}>
          {FLOW.map((s, i) => (
            <div key={s.name}>
              <div className="cs-flow-step">
                <span className="cs-flow-index">{i + 1}</span>
                <div className="cs-flow-body">
                  <span className="cs-flow-name">{s.name}</span>
                  <span className="cs-flow-note">{s.note}</span>
                </div>
              </div>
              {i < FLOW.length - 1 && <div className="cs-flow-connector" />}
            </div>
          ))}
        </div>

        <div className="cs-phones reveal" style={delay(0.14)}>
          {['Start', 'Log Set', 'Rest Timer', 'Complete'].map((cap) => (
            <div className="cs-phone cs-hoverable" key={cap}>
              <div className="cs-ph cs-ph--phone" data-label="390 × 844" />
              <span className="cs-phone-cap">{cap}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 9 · SELECTED SCREENS ─────────────────────────────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">09 / Selected Screens</p>
          <h2 className="cs-h2 reveal" style={delay(0.05)}>Visual execution, end to end.</h2>
          <div className="cs-bento reveal" style={delay(0.1)}>
            {SCREENS.map((s) => (
              <div className={`cs-bento-item cs-hoverable ${s.cls}`} key={s.name}>
                <div className="cs-ph" data-label="Screen" />
                <span className="cs-bento-cap">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10 · COLLABORATION BEYOND FIGMA ──────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">10 / Collaboration Beyond Figma</p>
        <h2 className="cs-h2 reveal" style={delay(0.05)}>Design didn’t stop at handoff.</h2>
        <div className="cs-cards cs-cards--3 reveal" style={delay(0.1)}>
          {COLLAB.map((c) => (
            <div className="cs-card-wrap" key={c.title}>
              <article className="cs-card">
                <h3 className="cs-card-title">{c.title}</h3>
                <p className="cs-card-text">{c.text}</p>
              </article>
            </div>
          ))}
        </div>
      </section>

      {/* ── 11 · OUTCOMES ────────────────────────────────────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">11 / Outcomes</p>
          <h2 className="cs-h2 reveal" style={delay(0.05)}>What the work delivered.</h2>
          <div className="cs-outcomes reveal" style={delay(0.1)}>
            {OUTCOMES.map((o) => (
              <div className="cs-outcome" key={o}>
                <span className="cs-outcome-mark" aria-hidden="true">✓</span>
                <span className="cs-outcome-text">{o}</span>
              </div>
            ))}
          </div>
          <p className="cs-metric-note reveal" style={delay(0.14)}>
            Quantitative metrics to be added as the product reaches users post-launch.
          </p>
        </div>
      </section>

      {/* ── 12 · REFLECTION ──────────────────────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">12 / Reflection</p>
        <h2 className="cs-h2 reveal" style={delay(0.05)}>What I took away.</h2>
        <div className="cs-cards cs-cards--3 reveal" style={delay(0.1)}>
          {REFLECTION.map((r) => (
            <div className="cs-card-wrap" key={r.title}>
              <article className="cs-card">
                <h3 className="cs-card-title">{r.title}</h3>
                <p className="cs-card-text">{r.text}</p>
              </article>
            </div>
          ))}
        </div>
      </section>

      {/* ── 13 · NEXT PROJECT ────────────────────────────────────────────── */}
      <section className="cs-wrap cs-section cs-section--tight">
        <p className="cs-eyebrow reveal">Next Project</p>
        <Link href="/work/onekey" className="cs-next reveal cs-hoverable" style={delay(0.05)}>
          <div className="cs-next-inner">
            <div className="cs-next-media">
              <div className="cs-ph" data-label="OneKey" />
            </div>
            <div>
              <span className="cs-next-label">Case Study</span>
              <p className="cs-next-title">OneKey</p>
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
