import type { Metadata } from 'next'
import Link from 'next/link'
import './work.css'

export const metadata: Metadata = {
  title: 'Projects — Dhairya Narang',
  description: 'Selected work — case studies across a variety of industries.',
}

// Placeholder content — to be replaced with real case studies later.
const PROJECTS = [
  { title: 'Voice-First Thought Capture App', desc: 'An AI-native in-house product I designed end-to-end from 0→1, built to make capturing and structuring ideas feel invisible. Currently in internal beta.' },
  { title: 'Voice-First Thought Capture App', desc: 'An AI-native in-house product I designed end-to-end from 0→1, built to make capturing and structuring ideas feel invisible. Currently in internal beta.' },
  { title: 'Voice-First Thought Capture App', desc: 'An AI-native in-house product I designed end-to-end from 0→1, built to make capturing and structuring ideas feel invisible. Currently in internal beta.' },
  { title: 'Voice-First Thought Capture App', desc: 'An AI-native in-house product I designed end-to-end from 0→1, built to make capturing and structuring ideas feel invisible. Currently in internal beta.' },
]

export default function WorkPage() {
  return (
    <main className="work-page">
      <Link href="/" className="work-back" aria-label="Back to Canvas">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/work/icon-arrow-left.svg" alt="" aria-hidden="true" width={24} height={24} />
        Back
      </Link>

      <header className="work-wrap work-header">
        <h1 className="work-title">Projects</h1>
        <p className="work-subtitle">
          4 case studies across variety of industries including Agri-tech, SAAS, Health &amp; Fitness etc.
        </p>
      </header>

      <section className="work-wrap work-grid" aria-label="Projects">
        {PROJECTS.map((p, i) => (
          <div className="work-card-wrap" key={i}>
            <article className="work-card">
              <div className="work-card-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/work/placeholder.svg" alt="" aria-hidden="true" className="work-card-img" />
              </div>
              <div className="work-card-body">
                <h2 className="work-card-title">{p.title}</h2>
                <p className="work-card-desc">{p.desc}</p>
              </div>
            </article>
          </div>
        ))}
      </section>

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
