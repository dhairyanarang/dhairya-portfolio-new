'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import '../casestudy.css'

// ── Content (source of truth = the ONO spec) ────────────────────────────────
const TAGS = ['Agri-tech', 'B2B SaaS', '8 Months', 'Product Design', 'Systems Design', 'Platform Thinking']

const TLDR = [
  { kicker: 'Background', text: 'ONO is an agri-tech startup building products for agricultural trading, bookkeeping, credit and operational management.' },
  { kicker: 'Problem', text: 'Users perceived ONO as multiple disconnected products instead of one connected ecosystem.' },
  { kicker: 'Approach', text: 'Worked closely with founders, product managers, developers and QA to build connected experiences across products.' },
  { kicker: 'Outcome', text: 'Improved product discoverability and reduced friction across the ecosystem.' },
]

const METRICS = [
  { num: '8', label: 'Months embedded with the team' },
  { num: '2', label: 'Major products — mOS + CASH' },
  { num: '1', label: 'Unified ecosystem of connected journeys' },
  { num: '4+', label: 'Cross-functional stakeholder groups' },
]

const METADATA = [
  { k: 'Role', v: 'In-house UI/UX Designer' },
  { k: 'Category', v: 'Agri-tech Startup' },
  { k: 'Location', v: 'Bangalore' },
  { k: 'Duration', v: '8 Months' },
  { k: 'Team', v: 'Founder · Product Managers · Developers · QA' },
  { k: 'Responsibilities', v: 'Product Design · UX Strategy · Design Systems · Cross-functional Collaboration · Developer Handoff · Iteration Support' },
]

const ECOSYSTEM = ['Farmers', 'Commission Agents', 'Traders', 'ONO Products']

const BIG_PROBLEMS = [
  { title: 'Low Product Awareness', text: 'Users only knew the product they initially installed.' },
  { title: 'Fragmented Experiences', text: 'Multiple products created multiple entry points.' },
  { title: 'Low Cross-product Adoption', text: 'Users rarely explored other ONO products.' },
  { title: 'Disconnected Journeys', text: 'Switching products interrupted workflows.' },
]

const MOS_DECISIONS = [
  { title: 'Dashboard over navigation overload', problem: 'Multiple products meant multiple menus to learn.', decision: 'A single dashboard as the home for everything.', reason: 'One predictable place beats many scattered entry points.' },
  { title: 'Product discovery made visible', problem: 'Users only knew the one product they had installed.', decision: 'Surface the rest of the ecosystem on the dashboard.', reason: 'You can’t adopt what you can’t see.' },
  { title: 'Reusable components for familiarity', problem: 'Each product looked and behaved differently.', decision: 'A shared component library across mOS.', reason: 'Familiarity lowers the curve for first-time digital users.' },
  { title: 'Business goals aligned with user goals', problem: 'Growth targets could have meant pushy cross-sell.', decision: 'Make discovery helpful, never promotional.', reason: 'Adoption sticks when it genuinely serves the user.' },
]

const MOS_SHOTS = ['Dashboard', 'Smartboard', 'Profile', 'Product Navigation']

const NAV_OPTIONS = [
  { title: 'Tab Navigation', flag: 'Problem', text: 'Not scalable as the product set grew.', chosen: false },
  { title: 'Hamburger Menu', flag: 'Problem', text: 'Poor discoverability — options stayed hidden.', chosen: false },
  { title: 'Floating Action Button', flag: 'Problem', text: 'Hidden actions users rarely found.', chosen: false },
  { title: 'Horizontal Product Carousel', flag: 'Final solution', text: 'Scannable, scalable, and surfaced products in context.', chosen: true },
]

const CASH_PROBLEMS = [
  { title: 'Loan Status', text: 'No clear answer to “where does my loan stand right now?”' },
  { title: 'Repayment Tracking', text: 'Hard to tell what was due, paid, or still pending.' },
  { title: 'Outstanding Amounts', text: 'The total a user still owed was buried.' },
  { title: 'Application Progress', text: 'No visibility into where an application was stuck.' },
]

const CASH_DECISIONS = [
  { title: 'Bring summaries upfront', problem: 'Key numbers were buried inside sub-screens.', decision: 'Lead with balance, dues and status at the top.', reason: 'The most-asked questions deserve the most prominent space.' },
  { title: 'Separate loans and applications', problem: 'Active loans and pending applications were mixed together.', decision: 'Split them into distinct, labelled spaces.', reason: 'Different states call for different actions.' },
  { title: 'Increase repayment visibility', problem: 'Users couldn’t tell what was due or already paid.', decision: 'Make repayment timelines explicit and scannable.', reason: 'Clarity around money builds trust.' },
  { title: 'Reduce dependency on support', problem: 'Every small question became a support call.', decision: 'Add self-service status and history.', reason: 'Self-serve answers scale; support calls don’t.' },
]

const CASH_SHOTS = ['Smartboard', 'Loans', 'Applications', 'Search', 'Filters', 'Loan Cards']

const SYSTEMS = [
  { title: 'Ecosystems are products too.', text: 'The connective tissue between apps needed as much care as any single screen.' },
  { title: 'Discoverability drives adoption.', text: 'People only adopt what they can actually find.' },
  { title: 'Complexity stays behind the scenes.', text: 'The system can be intricate; the surface has to stay calm.' },
]

const OUTCOMES = [
  'Increased product awareness',
  'Reduced switching friction',
  'Improved cross-product adoption',
  'Better stakeholder alignment',
]

const REFLECTION = [
  { title: 'Closeness with founders accelerated decisions.', text: 'Direct access meant fewer handoffs and faster, sharper calls.' },
  { title: 'Design systems matter more as products scale.', text: 'What felt optional early became the backbone across mOS and CASH.' },
  { title: 'Business problems reveal bigger opportunities.', text: 'The fragmentation pain pointed straight at the ecosystem opportunity.' },
]

const delay = (s: number) => ({ ['--reveal-delay']: `${s}s` } as React.CSSProperties)

// 3-field decision card (Problem / Decision / Reason) — reuses the shared cs-decision styles
function DecisionCard({ d }: { d: { title: string; problem: string; decision: string; reason: string } }) {
  return (
    <article className="cs-decision">
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
        <div className="cs-pdro-item cs-pdro-item--outcome">
          <span className="cs-pdro-label">Reason</span>
          <span className="cs-pdro-text">{d.reason}</span>
        </div>
      </div>
    </article>
  )
}

export default function OnoContent() {
  const router = useRouter()

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
        <p className="cs-hero-eyebrow reveal">Agri-tech • B2B SaaS • Ecosystem Design</p>
        <h1 className="cs-hero-title reveal" style={delay(0.06)}>
          Designing connected experiences for India’s agri-commerce ecosystem.
        </h1>
        <p className="cs-hero-sub reveal" style={delay(0.12)}>
          Helping commission agents and traders navigate multiple products through one connected experience.
        </p>
        <div className="cs-tags reveal" style={delay(0.18)}>
          {TAGS.map((t) => <span className="cs-tag" key={t}>{t}</span>)}
        </div>
        <div className="cs-hero-media reveal cs-hoverable" style={delay(0.24)}>
          <div className="cs-ph cs-ph--hero" data-label="ONO ecosystem · 1600 × 900" />
        </div>
      </header>

      {/* ── 2 · TL;DR ────────────────────────────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">02 / TL;DR</p>
        <h2 className="cs-h2 reveal" style={delay(0.05)}>The story in four lines.</h2>
        <div className="cs-cards cs-cards--2 reveal" style={delay(0.1)}>
          {TLDR.map((c) => (
            <div className="cs-card-wrap" key={c.kicker}>
              <article className="cs-card">
                <span className="cs-card-kicker">{c.kicker}</span>
                <p className="cs-card-text">{c.text}</p>
              </article>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3 · PROJECT SNAPSHOT ─────────────────────────────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">03 / Project Snapshot</p>
          <h2 className="cs-h2 reveal" style={delay(0.05)}>At a glance.</h2>
          <div className="cs-metrics reveal" style={delay(0.1)}>
            {METRICS.map((m) => (
              <div className="cs-metric" key={m.label}>
                <span className="cs-metric-num">{m.num}</span>
                <span className="cs-metric-label">{m.label}</span>
              </div>
            ))}
          </div>
          <div className="cs-table reveal" style={delay(0.14)}>
            {METADATA.map((r) => (
              <div className="cs-table-row" key={r.k}>
                <div className="cs-table-key">{r.k}</div>
                <div className="cs-table-val">{r.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 · UNDERSTANDING ONO ────────────────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">04 / Understanding ONO</p>
        <h2 className="cs-h2 reveal" style={delay(0.05)}>Building for users who weren’t digital natives.</h2>
        <p className="cs-lead reveal" style={delay(0.08)}>
          Most users were commission agents and traders operating within India’s mandi ecosystem —
          many of them first-time digital users. The challenge wasn’t adding features; it was bringing
          technology in without adding complexity. The products had to feel approachable, familiar and trustworthy.
        </p>
        <div className="cs-chain reveal" style={delay(0.12)}>
          {ECOSYSTEM.map((node, i) => (
            <span key={node} style={{ display: 'contents' }}>
              <span className="cs-chain-node">{node}</span>
              {i < ECOSYSTEM.length - 1 && <span className="cs-chain-arrow" aria-hidden="true">→</span>}
            </span>
          ))}
        </div>
      </section>

      {/* ── 5 · THE BIGGER PROBLEM ───────────────────────────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">05 / The Bigger Problem</p>
          <h2 className="cs-h2 reveal" style={delay(0.05)}>A fragmented ecosystem created friction.</h2>
          <div className="cs-cards cs-cards--2 reveal" style={delay(0.1)}>
            {BIG_PROBLEMS.map((c) => (
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

      {/* ── 6 · mOS DEEP DIVE ────────────────────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">06 / mOS — Deep Dive</p>
        <h2 className="cs-h2 reveal" style={delay(0.05)}>Unifying ONO’s ecosystem under one roof.</h2>
        <p className="cs-lead reveal" style={delay(0.08)}>
          mOS is a central operating system that connects ONO’s products into one experience. Instead of
          juggling multiple apps, users get a single entry point — cutting friction while making the rest of
          the ecosystem easy to discover.
        </p>

        <h3 className="cs-eyebrow reveal" style={{ marginTop: 56 }}>Key Decisions</h3>
        <div className="cs-decisions reveal" style={delay(0.06)}>
          {MOS_DECISIONS.map((d) => <DecisionCard d={d} key={d.title} />)}
        </div>

        <h3 className="cs-eyebrow reveal" style={{ marginTop: 56 }}>Inside mOS</h3>
        <div className="cs-shots reveal" style={delay(0.06)}>
          {MOS_SHOTS.map((s) => (
            <div className="cs-shot cs-hoverable" key={s}>
              <div className="cs-ph" data-label="Screen" />
              <span className="cs-shot-cap">{s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7 · NAVIGATION EXPLORATION ───────────────────────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">07 / Navigation Exploration</p>
          <h2 className="cs-h2 reveal" style={delay(0.05)}>Exploring multiple ways to connect products.</h2>
          <div className="cs-cards cs-cards--4 reveal" style={delay(0.1)}>
            {NAV_OPTIONS.map((o) => (
              <div className="cs-card-wrap" key={o.title}>
                <article className={`cs-card${o.chosen ? ' cs-card--chosen' : ''}`}>
                  <span className="cs-card-kicker">{o.flag}</span>
                  <h3 className="cs-card-title">{o.title}</h3>
                  <p className="cs-card-text">{o.text}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8 · CASH DEEP DIVE ───────────────────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">08 / CASH — Deep Dive</p>
        <h2 className="cs-h2 reveal" style={delay(0.05)}>Making financial products easier to understand.</h2>
        <p className="cs-lead reveal" style={delay(0.08)}>
          CASH is ONO’s lending product — it helps users apply for loans and manage repayments. The existing
          experience lacked hierarchy and clarity, so the rework focused on trust, visibility and self-service.
        </p>

        <h3 className="cs-eyebrow reveal" style={{ marginTop: 56 }}>What users struggled with</h3>
        <div className="cs-cards cs-cards--2 reveal" style={delay(0.06)}>
          {CASH_PROBLEMS.map((c) => (
            <div className="cs-card-wrap" key={c.title}>
              <article className="cs-card">
                <h3 className="cs-card-title">{c.title}</h3>
                <p className="cs-card-text">{c.text}</p>
              </article>
            </div>
          ))}
        </div>

        <h3 className="cs-eyebrow reveal" style={{ marginTop: 56 }}>Key Decisions</h3>
        <div className="cs-decisions reveal" style={delay(0.06)}>
          {CASH_DECISIONS.map((d) => <DecisionCard d={d} key={d.title} />)}
        </div>

        <h3 className="cs-eyebrow reveal" style={{ marginTop: 56 }}>Before &amp; After</h3>
        <div className="cs-ba reveal" style={delay(0.06)}>
          <div className="cs-ba-item cs-hoverable">
            <div className="cs-ph" data-label="1600 × 900" />
            <span className="cs-ba-label">Before</span>
          </div>
          <div className="cs-ba-item cs-ba-item--after cs-hoverable">
            <div className="cs-ph" data-label="1600 × 900" />
            <span className="cs-ba-label">After</span>
          </div>
        </div>

        <h3 className="cs-eyebrow reveal" style={{ marginTop: 56 }}>Inside CASH</h3>
        <div className="cs-shots cs-shots--3 reveal" style={delay(0.06)}>
          {CASH_SHOTS.map((s) => (
            <div className="cs-shot cs-hoverable" key={s}>
              <div className="cs-ph" data-label="Screen" />
              <span className="cs-shot-cap">{s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 9 · SYSTEMS THINKING ─────────────────────────────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">09 / Systems Thinking</p>
          <h2 className="cs-h2 reveal" style={delay(0.05)}>Beyond individual screens.</h2>
          <p className="cs-lead reveal" style={delay(0.08)}>
            The biggest lesson from ONO was that products rarely exist in isolation. Building ecosystems meant
            balancing users, business priorities and technical constraints at the same time.
          </p>
          <div className="cs-cards cs-cards--3 reveal" style={delay(0.12)}>
            {SYSTEMS.map((c) => (
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

      {/* ── 10 · OUTCOMES ────────────────────────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">10 / Outcomes</p>
        <h2 className="cs-h2 reveal" style={delay(0.05)}>What the work changed.</h2>
        <div className="cs-outcomes reveal" style={delay(0.1)}>
          {OUTCOMES.map((o) => (
            <div className="cs-outcome" key={o}>
              <span className="cs-outcome-mark" aria-hidden="true">✓</span>
              <span className="cs-outcome-text">{o}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 11 · REFLECTION ──────────────────────────────────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">11 / Reflection</p>
          <h2 className="cs-h2 reveal" style={delay(0.05)}>Key takeaways.</h2>
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

      {/* ── 12 · NEXT PROJECT ────────────────────────────────────────────── */}
      <section className="cs-wrap cs-section cs-section--tight">
        <p className="cs-eyebrow reveal">Next Project</p>
        <Link href="/work/myroom" className="cs-next reveal cs-hoverable" style={delay(0.05)}>
          <div className="cs-next-inner">
            <div className="cs-next-media">
              <div className="cs-ph" data-label="MyRoom" />
            </div>
            <div>
              <span className="cs-next-label">Case Study</span>
              <p className="cs-next-title">MyRoom</p>
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
