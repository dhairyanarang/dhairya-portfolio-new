'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import '../casestudy.css'

// ── Content (source of truth = the MyRoom spec) ─────────────────────────────
const TAGS = ['Consumer Product', 'Research Driven', 'UX Research', 'Mobile App', 'Trust Design', '14 Days']

const TLDR = [
  { kicker: 'Background', text: 'Young professionals moving to new cities often struggle with untrustworthy listings, hidden costs and safety concerns.' },
  { kicker: 'Problem', text: 'Current accommodation platforms optimize for listings instead of confidence.' },
  { kicker: 'Approach', text: 'Ran user interviews, surveys and competitor research to find what truly drives long-term accommodation decisions.' },
  { kicker: 'Outcome', text: 'A trust-first experience centered around transparency, commute and safety.' },
]

const METADATA = [
  { k: 'Role', v: 'End-to-End Product Designer' },
  { k: 'Type', v: 'Personal Project · Consumer Product' },
  { k: 'Duration', v: '14 Days' },
  { k: 'Responsibilities', v: 'Product Thinking · UX Research · Information Architecture · Visual Design · Design System · Usability Studies' },
]

const PROBLEMS = [
  { title: 'Hidden costs create distrust', text: 'Fees that surface late make people second-guess the whole listing.' },
  { title: 'Safety is hard to verify', text: 'There’s rarely a credible way to check how safe an area really is.' },
  { title: 'Commute shapes daily life', text: 'A great room loses its shine after a two-hour daily commute.' },
  { title: 'Options are hard to compare', text: 'Listings live in silos, so weighing trade-offs is exhausting.' },
]

const USERS = [
  { dt: 'Age', dd: '20–30 years' },
  { dt: 'Lifestyle', dd: 'Busy, digital-first users' },
  { dt: 'Priorities', dd: 'Safety, commute & affordability' },
  { dt: 'Mindset', dd: 'Pragmatic but anxious' },
]

const INSIGHTS = [
  { num: '80%', text: 'Prioritized office proximity.', decision: 'Commute-first discovery.' },
  { num: '75%', text: 'Prioritized safety.', decision: 'Dedicated safety sections.' },
  { num: '73%', text: 'Wanted transparent pricing.', decision: 'Complete cost breakdowns upfront.' },
  { num: '68%', text: 'Distrusted listing photos.', decision: 'Verified visuals only.' },
]

const MARKET = [
  { name: 'Airbnb', logo: 'airbnb-logo', strength: 'Polished discovery and booking.', gap: 'Built for short stays, not long-term living.', opportunity: 'Own long-term trust and transparency.' },
  { name: 'Stanza Living', logo: 'stanza-logo', strength: 'Managed living at scale.', gap: 'Limited choice and flexibility.', opportunity: 'Give users real, comparable options.' },
  { name: 'Zolo', logo: 'zolo-logo', strength: 'Wide inventory of PGs.', gap: 'Thin on trust and clarity.', opportunity: 'Lead with verification and cost clarity.' },
]

const JOURNEY = ['Discover', 'Compare', 'Evaluate', 'Trust', 'Book']

const IA = [
  { name: 'Onboarding', note: 'A quick, low-friction start.' },
  { name: 'Explore', note: 'Commute-first browsing.' },
  { name: 'Filters', note: 'Narrow to what matters.' },
  { name: 'Compare', note: 'Weigh options side by side.' },
  { name: 'Property Details', note: 'The trust-first deep dive.' },
  { name: 'Schedule Visit', note: 'Move from screen to real life.' },
  { name: 'Wishlist', note: 'Park and revisit favourites.' },
  { name: 'Messages', note: 'Talk directly, build confidence.' },
  { name: 'Profile', note: 'Manage everything in one place.' },
]

// ── Section 09 · Visual Execution ───────────────────────────────────────────
const COMPARE_SHOTS = ['compare-1', 'compare-2', 'compare-3']

const COMPARE_NOTES = [
  { title: 'Compare', text: 'Users can compare PGs on rent, safety score, amenities and more — tapping compare, then choosing the property to weigh it against.' },
  { title: 'Side-by-side view', text: 'A side-by-side layout highlights the key differences across rent, security, safety score and amenities at a glance.' },
]

const REFLECTION = [
  { title: 'User psychology beats features.', text: 'The decisions that mattered happened in people’s heads, long before any screen.' },
  { title: 'Trust is a UX problem.', text: 'Confidence has to be built into the flow — it can’t be assumed.' },
  { title: 'Relatable problems build understanding.', text: 'Having moved cities myself, the friction was personal — and that sharpened every call.' },
]

const delay = (s: number) => ({ ['--reveal-delay']: `${s}s` } as React.CSSProperties)

export default function MyRoomContent() {
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
    <main className="cs-page cs-page--myroom">
      <div className="cs-progress" aria-hidden="true"><i /></div>

      <Link href="/work" className="cs-back" aria-label="Back to Projects" onClick={handleBack}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/work/icon-arrow-left.svg" alt="" aria-hidden="true" width={18} height={18} />
        Back to Projects
      </Link>

      {/* ── 1 · HERO ─────────────────────────────────────────────────────── */}
      <header className="cs-wrap cs-hero">
        <p className="cs-hero-eyebrow reveal">Personal Project • Consumer Product • Mobile App</p>
        <h1 className="cs-hero-title reveal" style={delay(0.06)}>
          Designing a trust-first accommodation platform for people moving to new cities.
        </h1>
        <p className="cs-hero-sub reveal" style={delay(0.12)}>
          Making accommodation discovery more transparent, commute-first and confidence-driven.
        </p>
        <div className="cs-tags reveal" style={delay(0.18)}>
          {TAGS.map((t) => <span className="cs-tag" key={t}>{t}</span>)}
        </div>
        <div className="cs-hero-media reveal cs-hoverable" style={delay(0.24)}>
          <div className="cs-ph cs-ph--hero cs-ph--img">
            <Image
              src="/work/myroom/hero.webp"
              alt="MyRoom — trust-first accommodation case study"
              fill
              priority
              sizes="(max-width: 1000px) 100vw, 1120px"
              className="cs-ph-img"
            />
          </div>
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
        <div className="cs-table reveal" style={delay(0.14)}>
          {METADATA.map((r) => (
            <div className="cs-table-row" key={r.k}>
              <div className="cs-table-key">{r.k}</div>
              <div className="cs-table-val">{r.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3 · THE PROBLEM ──────────────────────────────────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">03 / The Problem</p>
          <h2 className="cs-h2 reveal" style={delay(0.05)}>Finding a home shouldn’t feel overwhelming.</h2>
          <div className="cs-cards cs-cards--2 reveal" style={delay(0.1)}>
            {PROBLEMS.map((c) => (
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

      {/* ── 4 · UNDERSTANDING USERS ──────────────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">04 / Understanding Users</p>
        <h2 className="cs-h2 reveal" style={delay(0.05)}>Moving cities is both exciting and stressful.</h2>
        <p className="cs-lead reveal" style={delay(0.08)}>
          Young professionals and students are often stepping into independent living for the first time, and
          their choices are driven by trust, comfort and confidence. They aren’t simply choosing a room — they’re
          choosing their lifestyle for the next few months or years.
        </p>
        <dl className="cs-meta-cards reveal" style={delay(0.12)}>
          {USERS.map((u) => (
            <div className="cs-meta-card" key={u.dt}>
              <dt>{u.dt}</dt>
              <dd>{u.dd}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── 5 · FOUR RESEARCH INSIGHTS ───────────────────────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">05 / Four Research Insights</p>
          <h2 className="cs-h2 reveal" style={delay(0.05)}>What the research made impossible to ignore.</h2>
          <div className="cs-insights reveal" style={delay(0.1)}>
            {INSIGHTS.map((i) => (
              <div className="cs-insight" key={i.num}>
                <span className="cs-insight-num">{i.num}</span>
                <span className="cs-insight-text">{i.text}</span>
                <div className="cs-insight-decision">
                  <span className="cs-card-kicker">Decision</span>
                  <span>{i.decision}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6 · MARKET OPPORTUNITY ───────────────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">06 / Market Opportunity</p>
        <h2 className="cs-h2 reveal" style={delay(0.05)}>Existing platforms solved discovery, not trust.</h2>
        <div className="cs-compare cs-compare--4 reveal" style={delay(0.1)}>
          <div className="cs-compare-head">
            <span>Platform</span>
            <span>Strength</span>
            <span>Gap</span>
            <span>Opportunity</span>
          </div>
          {MARKET.map((m) => (
            <div className="cs-compare-row" key={m.name}>
              <div className="cs-compare-ref">
                <span className="cs-logo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="cs-logo-img" src={`/work/myroom/${m.logo}.webp`} alt={`${m.name} logo`} width={44} height={44} />
                </span>
                <span className="cs-compare-name">{m.name}</span>
              </div>
              <div className="cs-compare-cell">{m.strength}</div>
              <div className="cs-compare-cell">{m.gap}</div>
              <div className="cs-compare-cell"><strong>{m.opportunity}</strong></div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7 · THE EXPERIENCE (decision-making journey) ─────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">07 / The Experience</p>
          <h2 className="cs-h2 reveal" style={delay(0.05)}>Building around real decision-making moments.</h2>
          <div className="cs-chain reveal" style={delay(0.1)}>
            {JOURNEY.map((node, i) => (
              <span key={node} style={{ display: 'contents' }}>
                <span className="cs-chain-node">{node}</span>
                {i < JOURNEY.length - 1 && <span className="cs-chain-arrow" aria-hidden="true">→</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8 · INFORMATION ARCHITECTURE (full-width flow) ───────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">08 / Information Architecture</p>
        <h2 className="cs-h2 reveal" style={delay(0.05)}>The full journey, mapped end to end.</h2>
        <div className="cs-flow cs-flow--wide reveal" style={delay(0.1)}>
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

      {/* ── 9 · VISUAL EXECUTION ─────────────────────────────────────────── */}
      <section className="cs-band">
        <div className="cs-wrap cs-section">
          <p className="cs-eyebrow reveal">09 / Visual Execution</p>
          <h2 className="cs-h2 reveal" style={delay(0.05)}>Transforming uncertainty into confidence.</h2>
          <p className="cs-lead reveal" style={delay(0.08)}>
            The property page is designed like a virtual property tour — each fold answers a specific
            user question in the order it naturally arises.
          </p>

          {/* Compare functionality */}
          <div className="cs-screens-group reveal" style={delay(0.1)}>
            <h3 className="cs-screens-title">Compare Functionality</h3>
            <div className="cs-screens">
              {COMPARE_SHOTS.map((shot) => (
                <div className="cs-screen cs-hoverable" key={shot}>
                  <Image
                    src={`/work/myroom/${shot}.webp`}
                    alt=""
                    aria-hidden="true"
                    width={680}
                    height={1386}
                    sizes="(max-width: 1000px) 45vw, 350px"
                    className="cs-screen-img"
                  />
                </div>
              ))}
            </div>
            <div className="cs-compare-notes">
              {COMPARE_NOTES.map((n) => (
                <div className="cs-annotate-note" key={n.title}>
                  <h4 className="cs-annotate-note-title">{n.title}</h4>
                  <p className="cs-annotate-note-text">{n.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Product detail page — single annotated diagram (self-titled image),
              with a little more breathing room above it. */}
          <div className="cs-diagram reveal" style={{ marginTop: 72, ...delay(0.1) }}>
            <Image
              src="/work/myroom/myroom-pdp.webp"
              alt="MyRoom product detail page — annotated virtual property tour"
              width={1680}
              height={7265}
              sizes="(max-width: 1000px) 680px, 1120px"
              className="cs-diagram-img"
            />
          </div>
        </div>
      </section>

      {/* ── 10 · REFLECTION ──────────────────────────────────────────────── */}
      <section className="cs-wrap cs-section">
        <p className="cs-eyebrow reveal">10 / Reflection</p>
        <h2 className="cs-h2 reveal" style={delay(0.05)}>What this project taught me.</h2>
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

      {/* ── NEXT PROJECT ─────────────────────────────────────────────────── */}
      <section className="cs-wrap cs-section cs-section--tight">
        <p className="cs-eyebrow reveal">Next Project</p>
        <Link href="/work/luxury-fitness-app" className="cs-next reveal" style={delay(0.05)}>
          <div className="cs-next-inner">
            <div>
              <span className="cs-next-label">Case Study</span>
              <p className="cs-next-title">Luxury Fitness App</p>
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
