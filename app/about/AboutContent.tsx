'use client'

import { useEffect, useState } from 'react'
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
  // The interactive lanyard only renders on desktop; mobile gets a static card.
  const [showLanyard, setShowLanyard] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1101px)')
    const update = () => setShowLanyard(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

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

  return (
    <main
      className="about-page"
      style={{ fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif" }}
    >
      <Link href="/" className="about-back" aria-label="Back to Canvas">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/about/icon-arrow-left.svg" alt="" aria-hidden="true" width={18} height={18} />
        Back to Canvas
      </Link>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="about-hero">
        <Image
          src="/about/hero.jpg"
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
      <section className="about-main">
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

        {showLanyard ? (
          <div className="about-lanyard" aria-hidden="true">
            <Lanyard
              frontImage="/id-card-front.png"
              backImage="/id-card-back.png"
              position={[0, 0.5, 18]}
              fov={20}
              lanyardWidth={1}
              anchor={[2, 4, 0]}
            />
          </div>
        ) : (
          <div className="about-idcard reveal" style={delay(0.1)}>
            <Image
              src="/id-card-front.png"
              alt="Dhairya Narang — Product Designer ID badge"
              width={345}
              height={483}
              className="about-idcard-img"
            />
          </div>
        )}
      </section>

      {/* ── Gallery ───────────────────────────────────────────────────────── */}
      <section className="about-gallery reveal">
        <Image
          src="/Footer-band-image.png"
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
