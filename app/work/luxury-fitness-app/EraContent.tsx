'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import '../casestudy.css'

// ── Content (source of truth = the ERA Figma case study) ────────────────────
const HERO_TABLE = [
  { k: 'Role', v: 'Sole UX/UI Designer' },
  { k: 'Design Timeline', v: '2 Week Sprint' },
  { k: 'Platforms', v: 'iOS & Android' },
  { k: 'Responsibilities', v: 'UX Strategy · 0 → 1 Product Design · Design System · Developer Handoff · Iteration Support' },
  { k: 'Tools', v: 'Figma · Slack' },
]

const ROLE = [
  { label: 'Product Thinking', text: 'Defined experiences that prioritised motivation, consistency and long-term engagement over simple workout tracking.' },
  { label: 'Experience Design', text: 'Designed intuitive flows across workouts, progress tracking and competitive experiences.' },
  { label: 'Visual Design', text: 'Built a premium visual language that balances performance with luxury-inspired aesthetics.' },
  { label: 'Collaboration', text: 'Worked closely with stakeholders and developers to align design decisions with business goals and technical feasibility.' },
]

const CHALLENGE = [
  { title: 'Elite, not intimidating', text: 'Design for serious lifters without making newcomers feel excluded.' },
  { title: 'Progress should feel rewarding', text: 'Every action should reinforce consistency and celebrate progress.' },
  { title: 'Utility should feel luxurious', text: 'Functional experiences shouldn’t feel clinical. Performance and aesthetics should coexist.' },
]

const REFERENCES = [
  { name: 'Hevy', logo: 'logo-hevy', learning: 'Frictionless set logging keeps lifters in flow.', applied: 'One-tap set entry, mid-workout.' },
  { name: 'Ladder', logo: 'logo-ladder', learning: 'Structured programs build commitment.', applied: 'Guided flows with a clear next step.' },
  { name: 'Gymverse', logo: 'logo-gymverse', learning: 'Visible progress drives return visits.', applied: 'Progression surfaced as the hero.' },
  { name: 'Home Workout', logo: 'logo-home-workout', learning: 'Low-friction defaults welcome beginners.', applied: 'Sensible defaults so logging never stalls.' },
  { name: 'Rolex', logo: 'logo-rolex', learning: 'Luxury lives in restraint and detail.', applied: 'Generous space, quiet type, no clutter.' },
]

const CONSTRAINTS = [
  { title: 'Premium without excess', text: 'The product needed to feel elevated without becoming visually overwhelming.' },
  { title: 'Motivation without distraction', text: 'Gamification had to encourage progress without competing for attention.' },
  { title: 'Complexity without friction', text: 'Multiple features had to remain simple and approachable.' },
]

const DECISIONS = [
  {
    title: 'Performance Data Hierarchy',
    problem: 'Too many metrics competed for attention.',
    decision: 'Show one main metric per screen; demote the rest.',
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

// Visual-execution screenshot groups (assets in /public/work/luxury-fitness-app)
const SCREENS = [
  { group: 'Onboarding Flow', shots: ['onboarding-1', 'onboarding-2', 'onboarding-3'] },
  { group: 'Core Flow', shots: ['core-1', 'core-2', 'core-3', 'core-4', 'core-5', 'core-6', 'core-7', 'core-8', 'core-9'] },
  { group: 'Other Flows', shots: ['other-1', 'other-2', 'other-3'] },
]

const COLLAB = [
  { title: 'Reviewed implementation', text: 'Walked builds against the designs and flagged drift early.' },
  { title: 'Resolved edge cases', text: 'Defined empty, loading and error states before they shipped.' },
  { title: 'Reduced ambiguity', text: 'Annotated specs so behaviour wasn’t left to guesswork.' },
  { title: 'Refined interactions', text: 'Tuned motion and feedback alongside the developer.' },
  { title: 'Answered questions', text: 'Stayed close throughout the sprint to unblock fast.' },
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
    <main className="cs-page cs-page--era">
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
          Designing a luxury fitness experience that makes consistency feel rewarding.
        </h1>
        <p className="cs-hero-sub reveal" style={delay(0.12)}>
          From workout logging to leaderboards and progress tracking, the goal was to create an
          experience that feels elite, motivating, and effortless to use.
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
              src="/work/luxury-fitness-app/hero.png"
              alt="ERA fitness app — track, compete, progress"
              fill
              priority
              sizes="(max-width: 1000px) 100vw, 1120px"
              className="cs-ph-img"
            />
          </div>
        </div>
      </header>

      {/* ── 2 · MY ROLE ──────────────────────────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">02 / My Role</p>
        <h2 className="cs-h2 reveal" style={delay(0.05)}>Designing beyond screens.</h2>
        <p className="cs-lead reveal" style={delay(0.08)}>
          As the Product Designer, my responsibility wasn’t just to create interfaces. I translated
          business goals into an experience that motivates users to return consistently and feel
          rewarded throughout their fitness journey.
        </p>
        <dl className="cs-meta-cards reveal" style={delay(0.12)}>
          {ROLE.map((r) => (
            <div className="cs-meta-card" key={r.label}>
              <dt>{r.label}</dt>
              <dd>{r.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── 3 · THE CHALLENGE ────────────────────────────────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">03 / The Challenge</p>
          <h2 className="cs-h2 reveal" style={delay(0.05)}>Three goals, one screen.</h2>
          <div className="cs-cards cs-cards--3 reveal" style={delay(0.1)}>
            {CHALLENGE.map((c) => (
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

      {/* ── 4 · DESIGN OPPORTUNITIES ─────────────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">04 / Design Opportunities</p>
        <h2 className="cs-h2 reveal" style={delay(0.05)}>
          Translating inspiration into product decisions.
        </h2>
        <p className="cs-lead reveal" style={delay(0.08)}>
          Rather than reinventing fitness experiences, I studied what already worked and identified
          opportunities to combine utility with emotion.
        </p>
        <div className="cs-compare reveal" style={delay(0.1)}>
          <div className="cs-compare-head">
            <span>Reference</span>
            <span>Learning</span>
            <span>Applied to the App</span>
          </div>
          {REFERENCES.map((r) => (
            <div className="cs-compare-row" key={r.name}>
              <div className="cs-compare-ref">
                <span className="cs-logo">
                  <Image
                    src={`/work/luxury-fitness-app/${r.logo}.png`}
                    alt={`${r.name} app icon`}
                    width={44}
                    height={44}
                    className="cs-logo-img"
                  />
                </span>
                <span className="cs-compare-name">{r.name}</span>
              </div>
              <div className="cs-compare-cell">{r.learning}</div>
              <div className="cs-compare-cell"><strong>{r.applied}</strong></div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5 · PRODUCT CONSTRAINTS ──────────────────────────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">05 / Product Constraints</p>
          <h2 className="cs-h2 reveal" style={delay(0.05)}>Designing within real-world limitations.</h2>
          <p className="cs-lead reveal" style={delay(0.08)}>
            Good product design isn’t about unlimited possibilities. It’s about making thoughtful
            decisions within constraints.
          </p>
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

      {/* ── 6 · KEY DESIGN DECISIONS ─────────────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">06 / Key Design Decisions</p>
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
      </section>

      {/* ── 8 · VISUAL EXECUTION ─────────────────────────────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">07 / Visual Execution</p>
          <h2 className="cs-h2 reveal" style={delay(0.05)}>Bringing the experience to life.</h2>
          <p className="cs-lead reveal" style={delay(0.08)}>
            Every screen was designed to reinforce motivation, minimise friction and strengthen the
            product’s premium identity.
          </p>
          {SCREENS.map((g) => (
            <div className="cs-screens-group reveal" key={g.group} style={delay(0.1)}>
              <h3 className="cs-screens-title">{g.group}</h3>
              <div className="cs-screens">
                {g.shots.map((shot) => (
                  <div className="cs-screen cs-hoverable" key={shot}>
                    <Image
                      src={`/work/luxury-fitness-app/${shot}.png`}
                      alt=""
                      aria-hidden="true"
                      width={660}
                      height={1366}
                      sizes="(max-width: 1000px) 45vw, 350px"
                      className="cs-screen-img"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 9 · COLLABORATION BEYOND FIGMA ───────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">08 / Collaboration Beyond Figma</p>
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

      {/* ── 11 · REFLECTION ──────────────────────────────────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">09 / Reflection</p>
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
        </div>
      </section>

      {/* ── NEXT PROJECT ─────────────────────────────────────────────────── */}
      <section className="cs-wrap cs-section cs-section--tight">
        <p className="cs-eyebrow reveal">Next Project</p>
        <Link href="/work/onekey" className="cs-next reveal" style={delay(0.05)}>
          <div className="cs-next-inner">
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
