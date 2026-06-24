'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import './work.css'

// Each card links to a live case study. `thumb` is the case study's hero image.
const PROJECTS: { title: string; desc: string; href?: string; thumb?: string }[] = [
  { title: 'Luxury Fitness App', desc: 'A premium iOS & Android strength-training experience designed end-to-end in a 2-week sprint — balancing luxury aesthetics with movement-first workout usability.', href: '/work/luxury-fitness-app', thumb: '/work/luxury-fitness-app/hero.webp' },
  { title: 'OneKey — AI Second Brain', desc: 'An AI-native, voice-first productivity product I designed end-to-end from 0→1, built to make capturing and structuring ideas feel invisible. Currently in internal beta.', href: '/work/onekey', thumb: '/work/onekey/hero.webp' },
  { title: 'ONO — Agri-commerce Ecosystem', desc: 'Connected experiences across an agri-tech B2B SaaS ecosystem — unifying ONO’s mOS and CASH products into one approachable, discoverable platform over an 8-month embedded role.', href: '/work/ono', thumb: '/work/ono/hero.webp' },
  { title: 'MyRoom — Trust-first Accommodation', desc: 'A research-driven consumer product that turns user psychology into a transparent, commute-first accommodation experience for people moving to new cities.', href: '/work/myroom', thumb: '/work/myroom/hero.webp' },
]

export default function WorkContent() {
  const router = useRouter()

  // Close transition: play the exit animation, then route home. Mirrors About.
  // Modified clicks (cmd/ctrl/middle) fall through to default new-tab behaviour.
  const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    const page = document.querySelector('.work-page')
    if (!page || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      router.push('/')
      return
    }
    page.classList.add('is-leaving')
    window.setTimeout(() => router.push('/'), 380)
  }

  return (
    <main className="work-page">
      {/* Back button — matches the About page exactly. */}
      <Link href="/" className="work-back" aria-label="Back to Canvas" onClick={handleBack}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/work/icon-arrow-left.svg" alt="" aria-hidden="true" width={18} height={18} />
        Back to Canvas
      </Link>

      <header className="work-wrap work-header">
        <h1 className="work-title">Projects</h1>
        <p className="work-subtitle">
          4 case studies across variety of industries including Agri-tech, SAAS, Health &amp; Fitness etc.
        </p>
      </header>

      <section className="work-wrap work-grid" aria-label="Projects">
        {PROJECTS.map((p, i) => {
          const card = (
            <article className="work-card">
              <div className="work-card-media">
                {p.thumb ? (
                  <Image src={p.thumb} alt={`${p.title} preview`} width={1680} height={1020} sizes="(max-width: 1000px) 100vw, 620px" className="work-card-img" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src="/work/placeholder.svg" alt="" aria-hidden="true" className="work-card-img" />
                )}
              </div>
              <div className="work-card-body">
                <h2 className="work-card-title">{p.title}</h2>
                <p className="work-card-desc">{p.desc}</p>
              </div>
            </article>
          )
          return (
            <div className="work-card-wrap" key={i}>
              {p.href
                ? <Link href={p.href} className="work-card-link" aria-label={p.title}>{card}</Link>
                : card}
            </div>
          )
        })}
      </section>

      {/* Footer CTA — matches the About page exactly. */}
      <footer className="work-wrap work-footer">
        <p className="work-cta">
          Let&rsquo;s Build something<br />
          useful <span className="work-cta-ghost">together</span> .
        </p>
        <div className="work-contact">
          <a className="work-contact-item" href="mailto:dhairyanarang077@gmail.com">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/work/icon-envelope.svg" alt="" aria-hidden="true" width={24} height={24} />
            dhairyanarang077@gmail.com
          </a>
          <a className="work-contact-item" href="https://www.linkedin.com/in/dhairya-narang/" target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/work/icon-linkedin.svg" alt="" aria-hidden="true" width={24} height={24} />
            LinkedIn
          </a>
        </div>
      </footer>
    </main>
  )
}
