'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import '../casestudy.css'

// ── Content (source of truth = the OneKey spec) ─────────────────────────────
const META = [
  { dt: 'Role', dd: 'Founding Product Designer' },
  { dt: 'Timeline', dd: '0 → 1 Product' },
  { dt: 'Team', dd: 'Founder + Developer + Me' },
  { dt: 'Responsibilities', dd: 'Product Thinking · AI UX · Visual Design · Handoff' },
]

const PILLARS = [
  { title: 'Capture', text: 'Speak thoughts instantly.' },
  { title: 'Organize', text: 'AI structures information.' },
  { title: 'Execute', text: 'Turn thoughts into action.' },
]

const PROBLEMS = [
  { title: 'Thoughts disappear quickly', text: 'A good idea has a shelf life of seconds before the moment passes.' },
  { title: 'Users switch between apps', text: 'Notes here, tasks there, reminders somewhere else — context scatters.' },
  { title: 'Capturing interrupts flow', text: 'Stopping to type pulls you out of the very thinking you wanted to keep.' },
]

const COMPETITORS = [
  { tool: 'Notion', strength: 'Powerful, flexible workspace.', limitation: 'Too heavy for a fleeting thought.', learning: 'Capture must be instant, not configured.' },
  { tool: 'Apple Notes', strength: 'Always one tap away.', limitation: 'Notes pile up, never structured.', learning: 'Structure should happen automatically.' },
  { tool: 'Todoist', strength: 'Excellent task management.', limitation: 'You must already know the task.', learning: 'Tasks should emerge from thinking.' },
  { tool: 'Voice Memos', strength: 'Effortless voice capture.', limitation: 'Audio is a dead end — nothing actionable.', learning: 'Voice needs to become structured text.' },
  { tool: 'ChatGPT', strength: 'Understands and organizes language.', limitation: 'Not built around capture or memory.', learning: 'AI belongs inside the capture loop.' },
]

const PRINCIPLES = [
  { title: 'Capture instantly', text: 'Voice-first, zero setup, open-to-spoken in one tap.' },
  { title: 'Structure automatically', text: 'AI turns raw speech into clean, organized notes.' },
  { title: 'Execute seamlessly', text: 'Tasks and automations flow straight out of your thoughts.' },
]

const DECISIONS = [
  {
    title: 'Voice becomes primary input',
    problem: 'Typing is the slowest part of capturing a thought.',
    decision: 'Make voice the default, primary input.',
    reason: 'Speaking is far faster than typing and keeps you in flow.',
    outcome: 'Capture starts the instant the idea does.',
  },
  {
    title: 'Tasks generated automatically',
    problem: 'Users rarely stop to create tasks manually.',
    decision: 'Let AI extract tasks from what you said.',
    reason: 'The intent is already in the words — surface it.',
    outcome: 'To-dos appear without anyone writing them.',
  },
  {
    title: 'Actions live beside notes',
    problem: 'Notes and tasks lived in separate apps.',
    decision: 'Keep actions attached to the note they came from.',
    reason: 'Context and action belong together.',
    outcome: 'One place to think and to act.',
  },
  {
    title: 'Reduce manual organization',
    problem: 'Filing and tagging is friction nobody enjoys.',
    decision: 'Automate organization; make it invisible.',
    reason: 'AI should remove decisions, not add them.',
    outcome: 'A second brain that organizes itself.',
  },
]

const FOUNDATION = [
  { name: 'Research', note: 'Mapped how people actually capture ideas today.' },
  { name: 'Wireframes', note: 'Sketched the fastest path from thought to saved.' },
  { name: 'AI Interactions', note: 'Designed how AI transcribes, structures and suggests.' },
  { name: 'Testing', note: 'Put the capture loop in front of real users.' },
  { name: 'Refinement', note: 'Tightened the flow until it felt invisible.' },
]

const IA = [
  { name: 'Brain Dump', note: 'Everything in your head, spoken out loud.' },
  { name: 'AI Processing', note: 'Speech becomes clean, structured language.' },
  { name: 'Structured Note', note: 'A readable note, organized for you.' },
  { name: 'Task Suggestions', note: 'Actionable items surfaced automatically.' },
  { name: 'Automations', note: 'Recurring intents become repeatable flows.' },
  { name: 'Execution', note: 'Tasks move out into your day.' },
]

const JOURNEY = [
  'A random idea strikes — mid-walk, mid-meeting, mid-shower.',
  'One tap opens OneKey, already listening.',
  'You speak the thought, naturally and unscripted.',
  'AI transcribes it into clean, readable text.',
  'AI extracts the tasks hidden inside what you said.',
  'You glance, tweak a word, confirm.',
  'An automation fires — the thought becomes action.',
]

const SCREENS = [
  { name: 'Home', cls: 'cs-span3 cs-rspan2' },
  { name: 'Brain Dump', cls: 'cs-span3 cs-rspan2' },
  { name: 'AI Processing', cls: 'cs-span2' },
  { name: 'Task Suggestions', cls: 'cs-span2' },
  { name: 'Calendar', cls: 'cs-span2' },
  { name: 'Automations', cls: 'cs-span3' },
  { name: 'Settings', cls: 'cs-span3' },
]

const COLLAB = [
  { title: 'Worked directly with founder', text: 'Translated a fast-moving vision into concrete product decisions.' },
  { title: 'Reduced product ambiguity', text: 'Turned open questions into clear, shippable scope.' },
  { title: 'Solved edge cases', text: 'Designed the empty, error and offline states up front.' },
  { title: 'Improved AI interactions', text: 'Tuned prompts and responses for trust and speed.' },
  { title: 'Supported implementation', text: 'Stayed in the build loop to keep design intent intact.' },
]

const OUTCOMES = [
  'Established product foundation',
  'Created scalable AI workflows',
  'Reduced friction in thought capture',
  'Unified product direction',
]

const REFLECTION = [
  { title: 'AI products require trust.', text: 'People only hand over their thinking when the output feels reliable every single time.' },
  { title: 'Speed is a feature.', text: 'If capture isn’t instant, the idea — and the user — are already gone.' },
  { title: 'AI should reduce decisions.', text: 'The best AI moments were the ones the user never had to think about.' },
]

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
    <main className="cs-page">
      <div className="cs-progress" aria-hidden="true"><i /></div>

      <Link href="/work" className="cs-back" aria-label="Back to Projects" onClick={handleBack}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/work/icon-arrow-left.svg" alt="" aria-hidden="true" width={18} height={18} />
        Back to Projects
      </Link>

      {/* ── 1 · HERO ─────────────────────────────────────────────────────── */}
      <header className="cs-wrap cs-hero">
        <p className="cs-hero-eyebrow reveal">In-house Product • AI Native • iOS + Web</p>
        <h1 className="cs-hero-title reveal" style={delay(0.06)}>
          Designing a voice-first second brain for founders and knowledge workers.
        </h1>
        <p className="cs-hero-sub reveal" style={delay(0.12)}>
          How we transformed scattered thoughts into actionable notes, tasks and automations.
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

      {/* ── 2 · PRODUCT OVERVIEW ─────────────────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">02 / Product Overview</p>
        <h2 className="cs-h2 reveal" style={delay(0.05)}>What exactly is OneKey?</h2>
        <p className="cs-lead reveal" style={delay(0.08)}>
          OneKey is a voice-first productivity product designed to help users capture thoughts
          instantly and convert them into structured notes, tasks and automations.
        </p>
        <div className="cs-cards cs-cards--3 reveal" style={delay(0.12)}>
          {PILLARS.map((c) => (
            <div className="cs-card-wrap" key={c.title}>
              <article className="cs-card">
                <h3 className="cs-card-title">{c.title}</h3>
                <p className="cs-card-text">{c.text}</p>
              </article>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3 · THE PROBLEM ──────────────────────────────────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">03 / The Problem</p>
          <h2 className="cs-h2 reveal" style={delay(0.05)}>Why thinking tools keep failing us.</h2>
          <div className="cs-cards cs-cards--3 reveal" style={delay(0.1)}>
            {PROBLEMS.map((c) => (
              <div className="cs-card-wrap" key={c.title}>
                <article className="cs-card">
                  <h3 className="cs-card-title">{c.title}</h3>
                  <p className="cs-card-text">{c.text}</p>
                </article>
              </div>
            ))}
          </div>
          <blockquote className="cs-quote reveal" style={delay(0.14)}>
            “We don’t need another note-taking app. We need a frictionless thinking companion.”
          </blockquote>
        </div>
      </section>

      {/* ── 4 · WHY EXISTING TOOLS FAILED ────────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">04 / Why Existing Tools Failed</p>
        <h2 className="cs-h2 reveal" style={delay(0.05)}>Each got one piece right — none got the loop.</h2>
        <div className="cs-compare cs-compare--4 reveal" style={delay(0.1)}>
          <div className="cs-compare-head">
            <span>Tool</span>
            <span>Strength</span>
            <span>Limitation</span>
            <span>Learning</span>
          </div>
          {COMPETITORS.map((c) => (
            <div className="cs-compare-row" key={c.tool}>
              <div className="cs-compare-ref">
                <span className="cs-logo" aria-hidden="true" />
                <span className="cs-compare-name">{c.tool}</span>
              </div>
              <div className="cs-compare-cell">{c.strength}</div>
              <div className="cs-compare-cell">{c.limitation}</div>
              <div className="cs-compare-cell"><strong>{c.learning}</strong></div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5 · DEFINING THE PRODUCT ─────────────────────────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">05 / Defining the Product</p>
          <h2 className="cs-h2 reveal" style={delay(0.05)}>What OneKey had to become.</h2>
          <div className="cs-northstar reveal" style={delay(0.1)}>
            <span className="cs-northstar-label">North Star</span>
            <span className="cs-northstar-text">Capture ideas in under 30 seconds.</span>
          </div>
          <div className="cs-cards cs-cards--3 reveal" style={delay(0.14)}>
            {PRINCIPLES.map((c) => (
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

      {/* ── 6 · FOUR PRODUCT DECISIONS ───────────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">06 / Four Product Decisions</p>
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

      {/* ── 7 · DESIGNING THE FOUNDATION ─────────────────────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">07 / Designing the Foundation</p>
          <h2 className="cs-h2 reveal" style={delay(0.05)}>How the product evolved.</h2>
          <div className="cs-timeline reveal" style={delay(0.1)}>
            {FOUNDATION.map((s, i) => (
              <div className="cs-timeline-step" key={s.name}>
                <span className="cs-timeline-num">{i + 1}</span>
                <span className="cs-timeline-name">{s.name}</span>
                <span className="cs-flow-note">{s.note}</span>
              </div>
            ))}
          </div>
          <div className="cs-media-3 reveal" style={delay(0.14)}>
            {['Research synthesis', 'Wireframe flows', 'AI interaction studies'].map((cap) => (
              <div className="cs-media cs-hoverable" key={cap}>
                <div className="cs-ph cs-ph--wide" data-label="1200 × 800" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8 · INFORMATION ARCHITECTURE ─────────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">08 / Information Architecture</p>
        <h2 className="cs-h2 reveal" style={delay(0.05)}>
          From a spoken thought to an executed action.
        </h2>
        <p className="cs-lead reveal" style={delay(0.08)}>
          The whole product is one pipeline — every spoken idea moves through the same path,
          gaining structure and intent at each step.
        </p>
        <div className="cs-flow reveal" style={delay(0.1)}>
          {IA.map((s, i) => (
            <div key={s.name}>
              <div className="cs-flow-step">
                <span className="cs-flow-index">{i + 1}</span>
                <div className="cs-flow-body">
                  <span className="cs-flow-name">{s.name}</span>
                  <span className="cs-flow-note">{s.note}</span>
                </div>
              </div>
              {i < IA.length - 1 && <div className="cs-flow-connector" />}
            </div>
          ))}
        </div>
      </section>

      {/* ── 9 · AI WORKFLOWS DEEP DIVE (sticky journey) ──────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">09 / AI Workflows — Deep Dive</p>
          <h2 className="cs-h2 reveal" style={delay(0.05)}>One idea, end to end.</h2>
          <div className="cs-sticky">
            <div className="cs-sticky-visual reveal cs-hoverable">
              <div className="cs-ph" data-label="Capture flow · 390 × 844" />
            </div>
            <div className="cs-sticky-steps reveal" style={delay(0.08)}>
              {JOURNEY.map((step, i) => (
                <div className="cs-sticky-step" key={i}>
                  <span className="cs-sticky-index">{i + 1}</span>
                  <span className="cs-sticky-text">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 10 · SELECTED SCREENS (bento) ────────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">10 / Selected Screens</p>
        <h2 className="cs-h2 reveal" style={delay(0.05)}>Visual execution, end to end.</h2>
        <div className="cs-bento reveal" style={delay(0.1)}>
          {SCREENS.map((s) => (
            <div className={`cs-bento-item cs-hoverable ${s.cls}`} key={s.name}>
              <div className="cs-ph" data-label="Screen" />
              <span className="cs-bento-cap">{s.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 11 · BEYOND FIGMA ────────────────────────────────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">11 / Beyond Figma</p>
          <h2 className="cs-h2 reveal" style={delay(0.05)}>Design didn’t stop at the file.</h2>
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
        </div>
      </section>

      {/* ── 12 · OUTCOMES ────────────────────────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">12 / Outcomes</p>
        <h2 className="cs-h2 reveal" style={delay(0.05)}>What the work created.</h2>
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
      </section>

      {/* ── 13 · REFLECTION ──────────────────────────────────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">13 / Reflection</p>
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

      {/* ── 14 · NEXT PROJECT ────────────────────────────────────────────── */}
      <section className="cs-wrap cs-section cs-section--tight">
        <p className="cs-eyebrow reveal">Next Project</p>
        <Link href="/work/ono" className="cs-next reveal cs-hoverable" style={delay(0.05)}>
          <div className="cs-next-inner">
            <div className="cs-next-media">
              <div className="cs-ph" data-label="ONO" />
            </div>
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
