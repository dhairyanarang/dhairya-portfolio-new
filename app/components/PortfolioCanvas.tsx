'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Renders an AI reply's Markdown. External links open in a new tab; mailto/tel
// stay in-page. Defined at module scope so it isn't recreated on every render.
const aiMarkdownComponents: Components = {
  a: ({ href, children }) => {
    const external = !!href && /^https?:/i.test(href)
    return (
      <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {children}
      </a>
    )
  },
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const FramerIcon = () => (
  <svg viewBox="0 0 256 384" preserveAspectRatio="xMidYMid" style={{width:24,height:24}}>
    <path fill="#000" d="M0 0h256v128H128L0 0Zm0 128h128l128 128H128v128L0 256V128Z"/>
  </svg>
)

const FigmaIcon = () => (
  <svg viewBox="0 0 54 80" fill="none" style={{width:16,height:24}}>
    <g clipPath="url(#figmaClip)">
      <path d="M13.3333 80.0002C20.6933 80.0002 26.6667 74.0268 26.6667 66.6668V53.3335H13.3333C5.97333 53.3335 0 59.3068 0 66.6668C0 74.0268 5.97333 80.0002 13.3333 80.0002Z" fill="#0ACF83"/>
      <path d="M0 39.9998C0 32.6398 5.97333 26.6665 13.3333 26.6665H26.6667V53.3332H13.3333C5.97333 53.3332 0 47.3598 0 39.9998Z" fill="#A259FF"/>
      <path d="M0 13.3333C0 5.97333 5.97333 0 13.3333 0H26.6667V26.6667H13.3333C5.97333 26.6667 0 20.6933 0 13.3333Z" fill="#F24E1E"/>
      <path d="M26.6667 0H40.0001C47.3601 0 53.3334 5.97333 53.3334 13.3333C53.3334 20.6933 47.3601 26.6667 40.0001 26.6667H26.6667V0Z" fill="#FF7262"/>
      <path d="M53.3334 39.9998C53.3334 47.3598 47.3601 53.3332 40.0001 53.3332C32.6401 53.3332 26.6667 47.3598 26.6667 39.9998C26.6667 32.6398 32.6401 26.6665 40.0001 26.6665C47.3601 26.6665 53.3334 32.6398 53.3334 39.9998Z" fill="#1ABCFE"/>
    </g>
    <defs><clipPath id="figmaClip"><rect width="53.3333" height="80" fill="white"/></clipPath></defs>
  </svg>
)

const NotionIcon = () => (
  <svg preserveAspectRatio="xMidYMid" viewBox="0 0 256 268" style={{width:24,height:24}}>
    <path fill="#FFF" d="M16.092 11.538 164.09.608c18.179-1.56 22.85-.508 34.28 7.801l47.243 33.282C253.406 47.414 256 48.975 256 55.207v182.527c0 11.439-4.155 18.205-18.696 19.24L65.44 267.378c-10.913.517-16.11-1.043-21.825-8.327L8.826 213.814C2.586 205.487 0 199.254 0 191.97V29.726c0-9.352 4.155-17.153 16.092-18.188Z"/>
    <path d="M164.09.608 16.092 11.538C4.155 12.573 0 20.374 0 29.726v162.245c0 7.284 2.585 13.516 8.826 21.843l34.789 45.237c5.715 7.284 10.912 8.844 21.825 8.327l171.864-10.404c14.532-1.035 18.696-7.801 18.696-19.24V55.207c0-5.911-2.336-7.614-9.21-12.66l-1.185-.856L198.37 8.409C186.94.1 182.27-.952 164.09.608ZM69.327 52.22c-14.033.945-17.216 1.159-25.186-5.323L23.876 30.778c-2.06-2.086-1.026-4.69 4.163-5.207l142.274-10.395c11.947-1.043 18.17 3.12 22.842 6.758l24.401 17.68c1.043.525 3.638 3.637.517 3.637L71.146 52.095l-1.819.125Zm-16.36 183.954V81.222c0-6.767 2.077-9.887 8.3-10.413L230.02 60.93c5.724-.517 8.31 3.12 8.31 9.879v153.917c0 6.767-1.044 12.49-10.387 13.008l-161.487 9.361c-9.343.517-13.489-2.594-13.489-10.921ZM212.377 89.53c1.034 4.681 0 9.362-4.681 9.897l-7.783 1.542v114.404c-6.758 3.637-12.981 5.715-18.18 5.715-8.308 0-10.386-2.604-16.609-10.396l-50.898-80.079v77.476l16.1 3.646s0 9.362-12.989 9.362l-35.814 2.077c-1.043-2.086 0-7.284 3.63-8.318l9.351-2.595V109.823l-12.98-1.052c-1.044-4.68 1.55-11.439 8.826-11.965l38.426-2.585 52.958 81.113v-71.76l-13.498-1.552c-1.043-5.733 3.111-9.896 8.3-10.404l35.84-2.087Z"/>
  </svg>
)

const SlackIcon = () => (
  <svg viewBox="0 0 2447.6 2452.5" style={{width:24,height:24}}>
    <g clipRule="evenodd" fillRule="evenodd">
      <path d="m897.4 0c-135.3.1-244.8 109.9-244.7 245.2-.1 135.3 109.5 245.1 244.8 245.2h244.8v-245.1c.1-135.3-109.5-245.1-244.9-245.3.1 0 .1 0 0 0m0 654h-652.6c-135.3.1-244.9 109.9-244.8 245.2-.2 135.3 109.4 245.1 244.7 245.3h652.7c135.3-.1 244.9-109.9 244.8-245.2.1-135.4-109.5-245.2-244.8-245.3z" fill="#36c5f0"/>
      <path d="m2447.6 899.2c.1-135.3-109.5-245.1-244.8-245.2-135.3.1-244.9 109.9-244.8 245.2v245.3h244.8c135.3-.1 244.9-109.9 244.8-245.3zm-652.7 0v-654c.1-135.2-109.4-245-244.7-245.2-135.3.1-244.9 109.9-244.8 245.2v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.3z" fill="#2eb67d"/>
      <path d="m1550.1 2452.5c135.3-.1 244.9-109.9 244.8-245.2.1-135.3-109.5-245.1-244.8-245.2h-244.8v245.2c-.1 135.2 109.5 245 244.8 245.2zm0-654.1h652.7c135.3-.1 244.9-109.9 244.8-245.2.2-135.3-109.4-245.1-244.7-245.3h-652.7c-135.3.1-244.9 109.9-244.8 245.2-.1 135.4 109.4 245.2 244.7 245.3z" fill="#ecb22e"/>
      <path d="m0 1553.2c-.1 135.3 109.5 245.1 244.8 245.2 135.3-.1 244.9-109.9 244.8-245.2v-245.2h-244.8c-135.3.1-244.9 109.9-244.8 245.2zm652.7 0v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.2v-653.9c.2-135.3-109.4-245.1-244.7-245.3-135.4 0-244.9 109.8-244.8 245.1 0 0 0 .1 0 0" fill="#e01e5a"/>
    </g>
  </svg>
)

const ClaudeIcon = () => (
  <svg preserveAspectRatio="xMidYMid" viewBox="0 0 256 257" style={{width:24,height:24}}>
    <path fill="#D97757" d="m50.228 170.321 50.357-28.257.843-2.463-.843-1.361h-2.462l-8.426-.518-28.775-.778-24.952-1.037-24.175-1.296-6.092-1.297L0 125.796l.583-3.759 5.12-3.434 7.324.648 16.202 1.101 24.304 1.685 17.629 1.037 26.118 2.722h4.148l.583-1.685-1.426-1.037-1.101-1.037-25.147-17.045-27.22-18.017-14.258-10.37-7.713-5.25-3.888-4.925-1.685-10.758 7-7.713 9.397.649 2.398.648 9.527 7.323 20.35 15.75L94.817 91.9l3.889 3.24 1.555-1.102.195-.777-1.75-2.917-14.453-26.118-15.425-26.572-6.87-11.018-1.814-6.61c-.648-2.723-1.102-4.991-1.102-7.778l7.972-10.823L71.42 0 82.05 1.426l4.472 3.888 6.61 15.101 10.694 23.786 16.591 32.34 4.861 9.592 2.592 8.879.973 2.722h1.685v-1.556l1.36-18.211 2.528-22.36 2.463-28.776.843-8.1 4.018-9.722 7.971-5.25 6.222 2.981 5.12 7.324-.713 4.73-3.046 19.768-5.962 30.98-3.889 20.739h2.268l2.593-2.593 10.499-13.934 17.628-22.036 7.778-8.749 9.073-9.657 5.833-4.601h11.018l8.1 12.055-3.628 12.443-11.342 14.388-9.398 12.184-13.48 18.147-8.426 14.518.778 1.166 2.01-.194 30.46-6.481 16.462-2.982 19.637-3.37 8.88 4.148.971 4.213-3.5 8.62-20.998 5.184-24.628 4.926-36.682 8.685-.454.324.519.648 16.526 1.555 7.065.389h17.304l32.21 2.398 8.426 5.574 5.055 6.805-.843 5.184-12.962 6.611-17.498-4.148-40.83-9.721-14-3.5h-1.944v1.167l11.666 11.406 21.387 19.314 26.767 24.887 1.36 6.157-3.434 4.86-3.63-.518-23.526-17.693-9.073-7.972-20.545-17.304h-1.36v1.814l4.73 6.935 25.017 37.59 1.296 11.536-1.814 3.76-6.481 2.268-7.13-1.297-14.647-20.544-15.1-23.138-12.185-20.739-1.49.843-7.194 77.448-3.37 3.953-7.778 2.981-6.48-4.925-3.436-7.972 3.435-15.749 4.148-20.544 3.37-16.333 3.046-20.285 1.815-6.74-.13-.454-1.49.194-15.295 20.999-23.267 31.433-18.406 19.702-4.407 1.75-7.648-3.954.713-7.064 4.277-6.286 25.47-32.405 15.36-20.092 9.917-11.6-.065-1.686h-.583L44.07 198.125l-12.055 1.555-5.185-4.86.648-7.972 2.463-2.593 20.35-13.999-.064.065Z"/>
  </svg>
)

const SparkleIcon = ({ className, width = 18, height = 18 }: { className?: string; width?: number; height?: number }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src="/Sparkle.svg" alt="" className={className} width={width} height={height} />
)

const CursorArrowSVG = () => (
  <svg width="16" height="20" viewBox="0 0 14 18" fill="none">
    <path d="M0.5 0.5L13 10.5H5.5L2.5 17.5L0.5 0.5Z" fill="#34C759"/>
  </svg>
)

const GhostArrowSVG = () => (
  <svg width="16" height="20" viewBox="0 0 14 18" fill="none">
    <path d="M0.5 0.5L13 10.5H5.5L2.5 17.5L0.5 0.5Z" fill="#5B4CDB"/>
  </svg>
)

const TaglineLines = ({ className }: { className?: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src="/hero-tagline-decorative-lines.svg" alt="" aria-hidden="true" className={className} />
)

// ─── Data ────────────────────────────────────────────────────────────────────

const GP_STORIES = [
  {
    problem: "Elevator rides felt agonisingly slow. Passengers complained constantly about wait times, even when lifts were running on schedule.",
    solution: "Someone installed floor-to-ceiling mirrors on the elevator walls. No mechanical upgrade. No faster motors.",
    why: "People got busy checking themselves out. The wait didn't get shorter — attention just went elsewhere. Perceived time is not the same as actual time."
  },
  {
    problem: "Furniture stores struggled to get customers to see — and buy — products beyond what they came in for. Most people walked in, grabbed one thing, and left.",
    solution: "IKEA designed their stores as a single winding path with no shortcuts. You follow the arrows whether you want to or not.",
    why: "Exposure drives desire. The more products people walked past, the more they bought. The maze isn't a flaw — it's the entire business model."
  },
  {
    problem: "Waiting for an elevator felt unbearable — not because lifts were actually slow, but because staring at a closed metal door gave people nothing to focus on but the wait itself.",
    solution: "Engineers made the shaft doors transparent. Passengers could now see the elevator car moving toward them in real time.",
    why: "Uncertainty is what makes waiting feel long, not the wait itself. Once you can see the lift coming, you're tracking progress — not suffering through emptiness."
  }
]

const WITTY_MESSAGES = [
  "let's keep this centered, please.",
  "nope. back you go.",
  "not today.",
  "i worked hard on that position.",
  "bruhhh... stop breaking my layout",
  "this is not a fidget toy.",
  "respectfully, no.",
  "that's my name, not a sticker."
]

// Public gist holding Dhairya's bio/résumé context that grounds the AI answers.
// Unpinned raw URL → always serves the latest Gist revision, so editing the Gist
// (résumé link, context, etc.) updates the AI without a code change.
const GIST_URL = "https://gist.githubusercontent.com/dhairyanarang/9d4ce39946c6f95e256a0b6baecc84a2/raw/dhairya-context.md"

// ─── Main Component ──────────────────────────────────────────────────────────

export default function PortfolioCanvas() {
  const canvasRef       = useRef<HTMLDivElement>(null)
  const dhairyaRef      = useRef<HTMLDivElement>(null)
  const narangRef       = useRef<HTMLDivElement>(null)
  const cursorArrowRef  = useRef<HTMLDivElement>(null)
  const cursorTagRef    = useRef<HTMLDivElement>(null)
  const ghostCursorRef  = useRef<HTMLDivElement>(null)
  const ghostTooltipRef = useRef<HTMLDivElement>(null)
  const dragCoordsRef   = useRef<HTMLDivElement>(null)
  const dragLineSVGRef  = useRef<SVGSVGElement>(null)
  const dragLineRef     = useRef<SVGLineElement>(null)
  const gpPanelRef      = useRef<HTMLDivElement>(null)
  const blurOverlayRef  = useRef<HTMLDivElement>(null)
  const gpStoryRef      = useRef<HTMLDivElement>(null)
  const aiPanelRef      = useRef<HTMLDivElement>(null)
  const aiMessagesRef   = useRef<HTMLDivElement>(null)
  const aiInputRef      = useRef<HTMLTextAreaElement>(null)
  const polaroidRef     = useRef<HTMLAnchorElement>(null)
  const projectDeckRef  = useRef<HTMLDivElement>(null)
  const deckCard1Ref    = useRef<HTMLAnchorElement>(null)
  const deckCard2Ref    = useRef<HTMLDivElement>(null)
  const deckCard3Ref    = useRef<HTMLDivElement>(null)
  const deckCard4Ref    = useRef<HTMLDivElement>(null)
  const contactRef      = useRef<HTMLAnchorElement>(null)
  const gpStickerRef    = useRef<HTMLDivElement>(null)
  const toolTipRef      = useRef<HTMLDivElement>(null)
  const dockTipRef      = useRef<HTMLDivElement>(null)
  const canvasResetRef  = useRef<HTMLButtonElement>(null)
  const activePanelRef  = useRef<'gp' | 'ai' | 'contact' | null>(null)
  const contactPanelRef = useRef<HTMLDivElement>(null)
  const fixedTopRightRef = useRef<HTMLDivElement>(null)

  const [clockText, setClockText] = useState('')
  const [cursorLabel, setCursorLabel] = useState('You')
  const [gpOpen, setGpOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const [gpStoryIdx, setGpStoryIdx] = useState(0)
  const [gpOrder, setGpOrder] = useState<number[]>([0, 1, 2])
  const [aiMessages, setAiMessages] = useState<Array<{role: 'user'|'ai', text: string, followups?: string[]}>>([])
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false) // mobile-only hamburger menu
  const router = useRouter() // client-side navigation (faster than full <a> reloads)
  const cachedContextRef = useRef<string | null>(null)

  const ghostGenRef   = useRef(0)
  const typingIntRef  = useRef<ReturnType<typeof setInterval> | null>(null)
  const blinkIntRef   = useRef<ReturnType<typeof setInterval> | null>(null)
  const panelIsOpenRef = useRef(false)
  const canvasScaleRef = useRef(0.85)
  const initialCanvasXRef = useRef(0)
  const initialCanvasYRef = useRef(0)
  const anyDragActiveRef = useRef(false)
  const mouseXRef = useRef(0)
  const mouseYRef = useRef(0)

  // ── Clock ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const update = () => {
      const now = new Date()
      const t = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' })
      setClockText(`Delhi, IND — ${t} IST`)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  // ── Close the mobile menu on an outside tap/click ───────────────────────────
  useEffect(() => {
    if (!menuOpen) return
    const onDown = (e: Event) => {
      const t = e.target as Node
      const menu = document.getElementById('mobile-menu')
      const btn = document.getElementById('mobile-menu-btn')
      if (menu && !menu.contains(t) && btn && !btn.contains(t)) setMenuOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [menuOpen])

  // ── GP helpers ────────────────────────────────────────────────────────────
  const shuffleGpOrder = useCallback(() => {
    const arr = [0, 1, 2]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    setGpOrder(arr)
    setGpStoryIdx(0)
  }, [])

  const currentStory = GP_STORIES[gpOrder[gpStoryIdx]]

  // ── AI helpers ─────────────────────────────────────────────────────────────
  const loadContext = useCallback(async () => {
    if (cachedContextRef.current) return cachedContextRef.current
    try {
      const res = await fetch(GIST_URL)
      cachedContextRef.current = await res.text()
    } catch {
      cachedContextRef.current = ''
    }
    return cachedContextRef.current
  }, [])

  const conversationRef = useRef<Array<{role: string, content: string}>>([])

  const sendAiMessage = useCallback(async (text: string) => {
    if (!text.trim() || aiLoading) return
    setShowIntro(false)
    setAiMessages(prev => [...prev, { role: 'user', text }])
    setAiInput('')
    setAiLoading(true)
    conversationRef.current.push({ role: 'user', content: text })

    const stripSym = (f: string) =>
      f.replace(/^[\s>→➜•·\-–—*]+/, '').replace(/^\d+[.)]\s*/, '').trim()
    // Safety net: the model sometimes tacks suggested follow-ups onto its answer
    // as "→ …" lines (we render those as buttons separately). Drop any such
    // trailing block, plus a "Follow-up / you might also ask" header above it.
    const cleanAnswer = (s: string) => {
      const lines = s.split('\n')
      let cut = lines.length
      for (let j = lines.length - 1; j >= 0; j--) {
        const t = lines[j].trim()
        if (t === '') { cut = j; continue }
        if (/^(?:→|➜|->)\s+/.test(t)) { cut = j; continue }
        break
      }
      // also drop a leftover "follow-up questions:" style header
      while (cut > 0) {
        const t = lines[cut - 1].trim()
        if (t === '' || /^\**\s*(follow[-\s]?up|you might (also )?ask|you (might|could) also|other questions|questions you).*:?\**$/i.test(t)) { cut--; continue }
        break
      }
      return lines.slice(0, cut).join('\n').trimEnd()
    }
    // Replace the in-progress AI bubble (always the last message once streaming starts).
    const updateLastAi = (patch: { text?: string; followups?: string[] }) =>
      setAiMessages(prev => {
        const next = [...prev]
        const last = next.length - 1
        if (last >= 0 && next[last].role === 'ai') next[last] = { ...next[last], ...patch }
        return next
      })

    try {
      const context = await loadContext()
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, messages: conversationRef.current }),
      })
      if (!response.ok || !response.body) throw new Error('ai-failed')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let full = ''         // the answer text received so far
      let streamDone = false
      let started = false   // has the visible bubble been created yet
      let shown = 0         // how many chars are currently revealed
      let finalized = false
      let finalAnswer = ''

      const finalize = () => {
        if (finalized) return
        finalized = true
        finalAnswer = cleanAnswer(full).trim() || "Sorry, I couldn't generate a response just now."
        conversationRef.current.push({ role: 'assistant', content: finalAnswer })
        if (!started) {
          setAiLoading(false)
          setAiMessages(prev => [...prev, { role: 'ai', text: finalAnswer, followups: [] }])
        } else {
          updateLastAi({ text: finalAnswer })
        }
      }

      // Pump the network stream into `full` as fast as it arrives…
      const pump = (async () => {
        try {
          for (;;) {
            const { done, value } = await reader.read()
            if (done) break
            full += decoder.decode(value, { stream: true })
          }
        } catch { /* upstream hiccup — reveal whatever arrived */ }
        streamDone = true
      })()

      // …while a steady ticker reveals it like typing, always chasing the buffer.
      const revealDone = new Promise<void>((resolve) => {
        const timer = setInterval(() => {
          const answer = cleanAnswer(full)
          if (!started && answer) {
            started = true
            setAiLoading(false) // swap the typing dots for the streaming bubble
            setAiMessages(prev => [...prev, { role: 'ai', text: '', followups: [] }])
          }
          if (started && shown < answer.length) {
            // Brisk-but-visible typewriter: more chars per tick on a faster tick
            // so long answers finish quickly, easing off near the end.
            shown += Math.max(4, Math.min(10, Math.ceil((answer.length - shown) / 40)))
            if (shown > answer.length) shown = answer.length
            updateLastAi({ text: answer.slice(0, shown) })
          } else if (streamDone) {
            clearInterval(timer)
            finalize()
            resolve()
          }
        }, 16)
      })

      // Fetch follow-ups in parallel — kick off the moment the full answer is
      // received (separate JSON call so a long answer can't crowd them out, and
      // turn-aware so they taper toward gentle wind-down nudges as the chat
      // deepens instead of forcing deep questions the context can't support).
      const turn = conversationRef.current.filter(m => m.role === 'user').length
      const followupsReady = pump.then(async () => {
        try {
          const fr = await fetch('/api/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: 'followups', question: text, answer: cleanAnswer(full).trim(), turn }),
          })
          if (!fr.ok) return [] as string[]
          const data = await fr.json()
          return Array.isArray(data.followups)
            ? data.followups.filter((x: unknown): x is string => typeof x === 'string').map(stripSym).filter(Boolean).slice(0, 3)
            : ([] as string[])
        } catch { return [] as string[] }
      })

      await revealDone
      const fu = await followupsReady
      if (fu.length) updateLastAi({ followups: fu })
    } catch {
      setAiMessages(prev => [...prev, { role: 'ai', text: 'Something went wrong. Reach out to Dhairya directly on LinkedIn.', followups: [] }])
    } finally {
      setAiLoading(false)
    }
  }, [aiLoading, loadContext])

  // ── Main GSAP setup ────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(Draggable, InertiaPlugin)

    // Guards against the effect re-running (Fast Refresh / Strict Mode) and
    // stacking duplicate Draggables + stale animation closures on the same
    // elements — the root cause of the ghost cursor appearing to ride the canvas.
    let effectCancelled = false

    const canvas      = canvasRef.current!
    const dhairyaWord = dhairyaRef.current!
    const narangWord  = narangRef.current!
    const cursorArrow = cursorArrowRef.current!
    const cursorTag   = cursorTagRef.current!
    const ghostCursor = ghostCursorRef.current!
    const ghostTooltip = ghostTooltipRef.current!

    // ── Canvas initial position ──
    // On phones the canvas is laid out as a fixed, viewport-sized screen (the
    // mobile composition lives in globals.css under @media max-width:768px), so
    // skip the scaled/offset transform and the panning there. Desktop is fully
    // unchanged — every mobile branch below is gated on this flag.
    const isMobileHome = window.matchMedia('(max-width: 768px)').matches
    // Small / short laptops (e.g. 13" HP) make the 0.85 canvas feel too zoomed-in;
    // scale it down a touch so more of the composition fits. Larger screens (15"
    // MacBook etc.) keep 0.85 unchanged.
    const smallScreen = !isMobileHome && (window.innerHeight < 900 || window.innerWidth < 1400)
    const baseScale = isMobileHome ? 1 : smallScreen ? 0.7 : 0.85
    const centerOffsetX = isMobileHome ? 0 : -2000 + window.innerWidth / 2
    const centerOffsetY = isMobileHome ? 0 : -2000 + window.innerHeight / 2 - 80
    gsap.set(canvas, { x: centerOffsetX, y: centerOffsetY, scale: baseScale })
    canvasScaleRef.current = baseScale
    initialCanvasXRef.current = centerOffsetX
    initialCanvasYRef.current = centerOffsetY

    const canvasOriginX = centerOffsetX
    const canvasOriginY = centerOffsetY

    const updateResetButton = () => {
      const btn = canvasResetRef.current
      if (!btn) return
      const x = Number(gsap.getProperty(canvas, 'x'))
      const y = Number(gsap.getProperty(canvas, 'y'))
      const dist = Math.sqrt(Math.pow(x - canvasOriginX, 2) + Math.pow(y - canvasOriginY, 2))
      btn.classList.toggle('visible', dist > 100)
    }

    // ── Background dot grid ──
    // The dots used to be painted across the whole 4000×4000 will-change canvas
    // layer, so Chrome re-rasterized textured tiles on every pan (the lag). We
    // render them on a small fixed element instead (cheap, painted once) and just
    // shift its background-position to match the canvas transform, so it still
    // scrolls with the pan exactly as before.
    const grid = document.getElementById('canvas-grid')
    const syncGrid = () => {
      if (!grid) return
      const gx = Number(gsap.getProperty(canvas, 'x'))
      const gy = Number(gsap.getProperty(canvas, 'y'))
      const sc = Number(gsap.getProperty(canvas, 'scaleX')) || canvasScaleRef.current
      const off = 2000 * (1 - sc)            // scale happens around the canvas centre (2000,2000)
      const size = 24 * sc
      grid.style.backgroundSize = `${size}px ${size}px`
      grid.style.backgroundPosition = `${gx + off}px ${gy + off}px`
    }
    syncGrid()

    // Touch/small-screen flag (mobile + tablet). Used to (a) give the scattered
    // canvas pieces a larger drag threshold so a TAP still fires its link/panel
    // while a real swipe still DRAGS, and (b) hand 2-finger gestures to the
    // browser for native pinch-zoom. Desktop (mouse) is unaffected.
    const isTouch = window.matchMedia('(max-width: 1024px)').matches
    const stickyMinMove = isTouch ? 8 : 2

    // ── Canvas draggable ──
    let dragDistance = 0, dragStartX = 0, dragStartY = 0

    // Phones are a fixed screen: don't create the pan Draggable at all (so panel
    // open/close can't re-enable it). The hero words stay draggable; stickers tap.
    if (!isMobileHome) Draggable.create(canvas, {
      type: 'x,y',
      inertia: true,
      edgeResistance: 0.65,
      minimumMovement: 2,
      zIndexBoost: false,
      onDragStart() {
        anyDragActiveRef.current = true
        dragStartX = this.x; dragStartY = this.y; dragDistance = 0
        // Intentionally do NOT touch the ghost cursor here. It lives in fixed
        // viewport space and runs an independent routine — panning the canvas
        // must not interrupt it or alter its trajectory.
      },
      onDrag() {
        dragDistance = Math.sqrt(Math.pow(this.x - dragStartX, 2) + Math.pow(this.y - dragStartY, 2))
        updateResetButton()
        syncGrid()
        gsap.set(cursorArrow, { x: this.pointerX, y: this.pointerY })
        gsap.set(cursorTag,   { x: this.pointerX + 22, y: this.pointerY + 16 })
      },
      onThrowUpdate() { syncGrid() },
      onDragEnd() {
        anyDragActiveRef.current = false
        updateResetButton()
      }
    })

    canvas.addEventListener('click', (e) => { if (dragDistance > 5) e.preventDefault() })

    // Native pinch-zoom on touch: the canvas Draggable preventDefaults touch
    // moves (needed for the pan), which also blocks the browser's pinch. When a
    // second finger lands we hand the gesture to the browser by disabling the
    // pan, then restore it once all fingers lift. Touch-only — never runs with a
    // mouse, so desktop panning is untouched. Skipped on phones (no panning to
    // hand off, and onTouchEndRestore must not re-enable the disabled pan).
    const onCanvasMultiTouch = (e: TouchEvent) => {
      if (e.touches.length >= 2) Draggable.get(canvas)?.disable()
    }
    const onTouchEndRestore = (e: TouchEvent) => {
      if (e.touches.length === 0 && !panelIsOpenRef.current) Draggable.get(canvas)?.enable()
    }
    if (isTouch && !isMobileHome) {
      canvas.addEventListener('touchstart', onCanvasMultiTouch, { passive: true, capture: true })
      document.addEventListener('touchend', onTouchEndRestore, { passive: true })
    }

    // ── Cursor tracking (throttled to one update per frame) ──
    let cursorRaf = 0
    const handleMouseMove = (e: MouseEvent) => {
      if (anyDragActiveRef.current) return
      mouseXRef.current = e.clientX
      mouseYRef.current = e.clientY
      if (cursorRaf) return
      cursorRaf = requestAnimationFrame(() => {
        cursorRaf = 0
        gsap.set(cursorArrow, { x: mouseXRef.current, y: mouseYRef.current })
        gsap.set(cursorTag,   { x: mouseXRef.current + 22, y: mouseYRef.current + 16 })
      })
    }
    document.addEventListener('mousemove', handleMouseMove)

    // ── Hero words positioning ──
    gsap.set(dhairyaWord, { xPercent: -50, yPercent: -100 })
    gsap.set(narangWord,  { xPercent: -50, yPercent: 0 })

    ;[dhairyaWord, narangWord].forEach(el => {
      el.addEventListener('mousedown', e => e.stopPropagation())
      el.addEventListener('pointerdown', e => e.stopPropagation())
      el.addEventListener('touchstart', e => e.stopPropagation(), { passive: false })
    })

    // ── Ghost cursor helpers ──
    const clearTyping = () => {
      if (typingIntRef.current) { clearInterval(typingIntRef.current); typingIntRef.current = null }
      if (blinkIntRef.current)  { clearInterval(blinkIntRef.current);  blinkIntRef.current  = null }
      ghostTooltip.textContent = ''
    }

    const typeMessage = (message: string, onComplete?: () => void) => {
      clearTyping()
      let typed = '', blink = true
      blinkIntRef.current = setInterval(() => {
        blink = !blink
        ghostTooltip.textContent = typed + (blink ? '|' : '')
      }, 500)
      typingIntRef.current = setInterval(() => {
        if (typed.length < message.length) {
          typed += message[typed.length]
          ghostTooltip.textContent = typed + (blink ? '|' : '')
        } else {
          clearInterval(typingIntRef.current!); clearInterval(blinkIntRef.current!)
          typingIntRef.current = null; blinkIntRef.current = null
          ghostTooltip.textContent = message
          if (onComplete) onComplete()
        }
      }, 45)
    }

    const highlightBorder = (el: HTMLElement) => {
      el.classList.remove('is-released')
      el.classList.add('is-snapping')
      const tooltip = el.querySelector('.word-status-tooltip') as HTMLElement
      if (tooltip) { tooltip.textContent = 'Aligning to grid...'; tooltip.classList.add('visible') }
    }

    const revertBorder = (el: HTMLElement) => {
      el.classList.remove('is-snapping')
      const tooltip = el.querySelector('.word-status-tooltip') as HTMLElement
      if (tooltip) tooltip.classList.remove('visible')
    }

    const getCorners = () => {
      const w = window.innerWidth, h = window.innerHeight
      return [{ x: -60, y: -60 }, { x: w + 60, y: -60 }, { x: -60, y: h + 60 }, { x: w + 60, y: h + 60 }]
    }

    const startGhostCursor = (wordEl: HTMLElement, homeCX: number, homeCY: number) => {
      gsap.killTweensOf(ghostCursor); clearTyping(); gsap.set(ghostCursor, { opacity: 0, clearProps: 'left,top,x,y' })
      ghostCursor.classList.remove('flip-left')
      const gen = ++ghostGenRef.current
      const message = WITTY_MESSAGES[Math.floor(Math.random() * WITTY_MESSAGES.length)]
      const corners = getCorners()
      const entryIdx = Math.floor(Math.random() * 4)
      const rect = wordEl.getBoundingClientRect()
      const droppedX = rect.left + rect.width / 2
      const droppedY = rect.top + rect.height / 2

      // Use left/top (not x/y transforms) so the position: fixed element stays
      // truly viewport-relative and unaffected by canvas compositor layer movement.
      gsap.set(ghostCursor, { clearProps: 'x,y', left: corners[entryIdx].x, top: corners[entryIdx].y })

      gsap.delayedCall(0.1, () => {
        if (ghostGenRef.current !== gen) return
        gsap.set(ghostCursor, { opacity: 1 })
        gsap.delayedCall(0.2, () => {
          if (ghostGenRef.current !== gen) return
          gsap.to(ghostCursor, {
            left: droppedX, top: droppedY, duration: 1.2, ease: 'power2.inOut',
            onComplete() {
              if (ghostGenRef.current !== gen) return
              highlightBorder(wordEl)
              gsap.to(wordEl, { x: 0, y: 0, duration: 1.2, ease: 'power2.out' })
              gsap.to(ghostCursor, {
                left: homeCX, top: homeCY, duration: 1.2, ease: 'power2.out',
                onComplete() {
                  if (ghostGenRef.current !== gen) return
                  revertBorder(wordEl)
                  gsap.delayedCall(0.6, () => {
                    if (ghostGenRef.current !== gen) return
                    // On phones, flip the pill to the cursor's left when it's in
                    // the right half so the typed line stays fully on-screen.
                    if (isMobileHome) ghostCursor.classList.toggle('flip-left', homeCX > window.innerWidth / 2)
                    typeMessage(message, () => {
                      gsap.delayedCall(1.5, () => {
                        if (ghostGenRef.current !== gen) return
                        const exitCorners = getCorners()
                        let exitIdx
                        do { exitIdx = Math.floor(Math.random() * 4) } while (exitIdx === entryIdx)
                        gsap.to(ghostCursor, {
                          left: exitCorners[exitIdx].x, top: exitCorners[exitIdx].y,
                          duration: 1.0, ease: 'power2.inOut',
                          onComplete() {
                            if (ghostGenRef.current !== gen) return
                            gsap.set(ghostCursor, { opacity: 0, clearProps: 'left,top' }); clearTyping()
                            wordEl.classList.remove('is-released')
                          }
                        })
                      })
                    })
                  })
                }
              })
            }
          })
        })
      })
    }

    // ── Make hero word draggable ──
    const makeHeroDraggable = (wordEl: HTMLElement) => {
      if (effectCancelled) return
      let homeCX = 0, homeCY = 0

      Draggable.create(wordEl, {
        type: 'x,y',
        inertia: false,
        onDragStart() {
          Draggable.get(canvas)?.disable()
          gsap.killTweensOf(wordEl)
          const rect = wordEl.getBoundingClientRect()
          homeCX = rect.left + rect.width / 2
          homeCY = rect.top + rect.height / 2

          if (dragCoordsRef.current) dragCoordsRef.current.style.display = 'block'
          if (dragLineSVGRef.current) dragLineSVGRef.current.style.display = 'block'

          ghostGenRef.current++; clearTyping()
          gsap.killTweensOf(ghostCursor); gsap.set(ghostCursor, { opacity: 0, clearProps: 'left,top,x,y' })

          const tooltip = wordEl.querySelector('.word-status-tooltip') as HTMLElement
          if (tooltip) { tooltip.classList.remove('visible'); tooltip.textContent = '' }
          wordEl.classList.remove('is-released', 'is-snapping')
          wordEl.classList.add('is-dragging')

          if (dragLineRef.current) {
            dragLineRef.current.setAttribute('x1', String(homeCX))
            dragLineRef.current.setAttribute('y1', String(homeCY))
            dragLineRef.current.setAttribute('x2', String(homeCX))
            dragLineRef.current.setAttribute('y2', String(homeCY))
          }
        },
        onDrag() {
          const dx = Math.round(this.x), dy = Math.round(this.y)
          if (dragCoordsRef.current) dragCoordsRef.current.textContent = `dx: ${dx}, dy: ${dy}`
          const rect = wordEl.getBoundingClientRect()
          const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2
          const midX = (homeCX + cx) / 2, midY = (homeCY + cy) / 2
          if (dragCoordsRef.current) {
            dragCoordsRef.current.style.transform = `translate3d(${midX}px, ${midY}px, 0) translate(-50%, -50%)`
          }
          if (dragLineRef.current) { dragLineRef.current.setAttribute('x2', String(cx)); dragLineRef.current.setAttribute('y2', String(cy)) }
          gsap.set(cursorArrow, { x: this.pointerX, y: this.pointerY })
          gsap.set(cursorTag,   { x: this.pointerX + 22, y: this.pointerY + 16 })
        },
        onDragEnd() {
          Draggable.get(canvas)?.enable()
          const droppedX = this.x, droppedY = this.y
          if (dragCoordsRef.current) dragCoordsRef.current.style.display = 'none'
          if (dragLineSVGRef.current) dragLineSVGRef.current.style.display = 'none'
          if (Math.abs(droppedX) < 4 && Math.abs(droppedY) < 4) {
            wordEl.classList.remove('is-dragging'); return
          }
          wordEl.classList.remove('is-dragging'); wordEl.classList.add('is-released')
          startGhostCursor(wordEl, homeCX, homeCY)
        }
      })
    }

    // ── Polaroid draggable ──
    if (polaroidRef.current) {
      const polaroid = polaroidRef.current
      let polDragDist = 0, polStartX = 0, polStartY = 0
      polaroid.addEventListener('mousedown',   e => e.stopPropagation())
      polaroid.addEventListener('pointerdown', e => e.stopPropagation())
      polaroid.addEventListener('touchstart',  e => e.stopPropagation(), { passive: false })
      // Phones: tap-only (no drag, so it can't be flung off-screen with no way back).
      if (!isMobileHome) Draggable.create(polaroid, {
        type: 'x,y', inertia: true, minimumMovement: stickyMinMove,
        onPress() { polDragDist = 0 },
        onDragStart() { Draggable.get(canvas)?.disable(); polDragDist = 0; polStartX = this.x; polStartY = this.y; gsap.to(polaroid, { rotation: -3, duration: 0.2 }) },
        onDrag() {
          polDragDist = Math.sqrt(Math.pow(this.x - polStartX, 2) + Math.pow(this.y - polStartY, 2))
          gsap.set(cursorArrow, { x: this.pointerX, y: this.pointerY }); gsap.set(cursorTag, { x: this.pointerX + 22, y: this.pointerY + 16 })
        },
        onDragEnd() { Draggable.get(canvas)?.enable(); gsap.to(polaroid, { rotation: -10, duration: 0.4, ease: 'elastic.out(1,0.6)' }) }
      })
      polaroid.addEventListener('click', e => { e.preventDefault(); if (polDragDist <= 5) router.push('/about') })
    }

    // ── Project deck fan ──
    const d1 = deckCard1Ref.current, d2 = deckCard2Ref.current
    const d3 = deckCard3Ref.current, d4 = deckCard4Ref.current
    const deckWrapper = projectDeckRef.current?.querySelector('.deck-wrapper')
    if (d1 && d2 && d3 && d4 && deckWrapper) {
      const stacked = [
        { el: d1, rotation: 0, zIndex: 14 }, { el: d2, rotation: 4, zIndex: 13 },
        { el: d3, rotation: 7, zIndex: 12 }, { el: d4, rotation: 10, zIndex: 11 }
      ]
      const fan = [
        { el: d1, rotation: 0, zIndex: 14 }, { el: d2, rotation: 8, zIndex: 13 },
        { el: d3, rotation: 14, zIndex: 12 }, { el: d4, rotation: 19, zIndex: 11 }
      ]
      stacked.forEach(({ el, rotation, zIndex }) => gsap.set(el, { rotation, zIndex, transformOrigin: 'bottom right' }))
      deckWrapper.addEventListener('mouseenter', () => {
        fan.forEach(({ el, rotation, zIndex }) => gsap.to(el, { rotation, zIndex, duration: 0.4, ease: 'power2.out', transformOrigin: 'bottom right' }))
      })
      deckWrapper.addEventListener('mouseleave', () => {
        stacked.forEach(({ el, rotation, zIndex }) => gsap.to(el, { rotation, zIndex, duration: 0.3, ease: 'power2.inOut', transformOrigin: 'bottom right' }))
      })
      // Deck draggable
      const deck = projectDeckRef.current!
      deck.addEventListener('mousedown',   e => e.stopPropagation())
      deck.addEventListener('pointerdown', e => e.stopPropagation())
      deck.addEventListener('touchstart',  e => e.stopPropagation(), { passive: false })
      let deckDragDist = 0, deckStartX = 0, deckStartY = 0
      if (!isMobileHome) Draggable.create(deck, {
        type: 'x,y', inertia: true, minimumMovement: stickyMinMove,
        onPress() { deckDragDist = 0 },
        onDragStart() { Draggable.get(canvas)?.disable(); anyDragActiveRef.current = true; deckDragDist = 0; deckStartX = this.x; deckStartY = this.y; gsap.to(deck, { rotation: 3, duration: 0.2 }) },
        onDrag() {
          deckDragDist = Math.sqrt(Math.pow(this.x - deckStartX, 2) + Math.pow(this.y - deckStartY, 2))
          gsap.set(cursorArrow, { x: this.pointerX, y: this.pointerY }); gsap.set(cursorTag, { x: this.pointerX + 22, y: this.pointerY + 16 })
        },
        onDragEnd() { Draggable.get(canvas)?.enable(); anyDragActiveRef.current = false; gsap.to(deck, { rotation: 0, duration: 0.4, ease: 'elastic.out(1,0.6)' }) }
      })
      d1.addEventListener('click', e => { e.preventDefault(); if (deckDragDist <= 5) router.push('/work') })
    }

    // ── Contact sticker draggable ──
    if (contactRef.current) {
      const c = contactRef.current
      let cDragDist = 0, cStartX = 0, cStartY = 0
      c.addEventListener('mousedown',   e => e.stopPropagation())
      c.addEventListener('pointerdown', e => e.stopPropagation())
      c.addEventListener('touchstart',  e => e.stopPropagation(), { passive: false })
      if (!isMobileHome) Draggable.create(c, {
        type: 'x,y', inertia: true, minimumMovement: stickyMinMove,
        onPress() { cDragDist = 0 },
        onDragStart() { Draggable.get(canvas)?.disable(); cDragDist = 0; cStartX = this.x; cStartY = this.y; gsap.to(c, { rotation: 5, duration: 0.2 }) },
        onDrag() {
          cDragDist = Math.sqrt(Math.pow(this.x - cStartX, 2) + Math.pow(this.y - cStartY, 2))
          gsap.set(cursorArrow, { x: this.pointerX, y: this.pointerY }); gsap.set(cursorTag, { x: this.pointerX + 22, y: this.pointerY + 16 })
        },
        onDragEnd() { Draggable.get(canvas)?.enable(); gsap.to(c, { rotation: 10, duration: 0.4, ease: 'elastic.out(1,0.6)' }) }
      })
      c.addEventListener('click', (e) => { e.preventDefault(); if (cDragDist <= 5) openContactPanel() })
    }

    // ── GP sticker draggable ──
    if (gpStickerRef.current) {
      const gp = gpStickerRef.current
      let gpDragDist = 0, gpStartX = 0, gpStartY = 0
      gp.addEventListener('mousedown',   e => e.stopPropagation())
      gp.addEventListener('pointerdown', e => e.stopPropagation())
      gp.addEventListener('touchstart',  e => e.stopPropagation(), { passive: false })
      if (!isMobileHome) Draggable.create(gp, {
        type: 'x,y', inertia: true, minimumMovement: stickyMinMove,
        onPress() { gpDragDist = 0 },
        onDragStart() { Draggable.get(canvas)?.disable(); gpDragDist = 0; gpStartX = this.x; gpStartY = this.y; gsap.to(gp, { rotation: 2, duration: 0.2 }) },
        onDrag() {
          gpDragDist = Math.sqrt(Math.pow(this.x - gpStartX, 2) + Math.pow(this.y - gpStartY, 2))
          gsap.set(cursorArrow, { x: this.pointerX, y: this.pointerY }); gsap.set(cursorTag, { x: this.pointerX + 22, y: this.pointerY + 16 })
        },
        onDragEnd() { Draggable.get(canvas)?.enable(); gsap.to(gp, { rotation: 6, duration: 0.4, ease: 'elastic.out(1,0.6)' }) }
      })
      gp.addEventListener('click', () => { if (gpDragDist <= 5) openGpPanel() })
    }

    // ── GP Panel ──
    const openGpPanel = () => {
      panelIsOpenRef.current = true
      activePanelRef.current = 'gp'
      setCursorLabel('You')
      Draggable.get(canvas)?.disable()
      shuffleGpOrder()
      setGpOpen(true)
      const overlay = blurOverlayRef.current, panel = gpPanelRef.current
      if (!overlay || !panel) return
      gsap.timeline()
        .set(overlay, { opacity: 0, display: 'block' })
        .to(overlay, { opacity: 1, duration: 0.2, ease: 'power2.out' }, 0)
        .to(panel, { x: 0, duration: 0.5, ease: 'power3.out' }, 0.05)
    }

    const closeGpPanel = () => {
      panelIsOpenRef.current = false
      activePanelRef.current = null
      Draggable.get(canvas)?.enable()
      setGpOpen(false)
      const overlay = blurOverlayRef.current, panel = gpPanelRef.current
      if (!overlay || !panel) return
      gsap.timeline()
        .to(panel, { x: '100%', duration: 0.26, ease: 'power2.in' }, 0)
        .to(overlay, { opacity: 0, duration: 0.18, ease: 'power1.in' }, 0.02)
        .set(overlay, { display: 'none' })
    }

    // Store closeGpPanel on window so buttons can call it
    ;(window as any).__closeGpPanel = closeGpPanel

    // ── AI Panel ──
    const openAiPanel = () => {
      panelIsOpenRef.current = true
      activePanelRef.current = 'ai'
      setCursorLabel('You')
      Draggable.get(canvas)?.disable()
      setAiOpen(true)
      const overlay = blurOverlayRef.current, panel = aiPanelRef.current
      if (!overlay || !panel) return
      gsap.set(aiPanelRef.current, { x: '100%' })
      gsap.timeline()
        .set(overlay, { opacity: 0, display: 'block' })
        .to(overlay, { opacity: 1, duration: 0.2, ease: 'power2.out' }, 0)
        .to(panel, { x: 0, duration: 0.5, ease: 'power3.out' }, 0.05)
      loadContext()
    }

    const closeAiPanel = () => {
      panelIsOpenRef.current = false
      activePanelRef.current = null
      Draggable.get(canvas)?.enable()
      setAiOpen(false)
      const overlay = blurOverlayRef.current, panel = aiPanelRef.current
      if (!overlay || !panel) return
      gsap.timeline()
        .to(panel, { x: '100%', duration: 0.26, ease: 'power2.in' }, 0)
        .to(overlay, { opacity: 0, duration: 0.18, ease: 'power1.in' }, 0.02)
        .set(overlay, { display: 'none' })
    }

    ;(window as any).__openAiPanel = openAiPanel
    ;(window as any).__closeAiPanel = closeAiPanel

    // ── Contact Panel ──
    const openContactPanel = () => {
      panelIsOpenRef.current = true
      activePanelRef.current = 'contact'
      setCursorLabel('You')
      Draggable.get(canvas)?.disable()
      const overlay = blurOverlayRef.current, panel = contactPanelRef.current
      if (!overlay || !panel) return
      gsap.set(panel, { x: '100%' })
      gsap.timeline()
        .set(overlay, { opacity: 0, display: 'block' })
        .to(overlay, { opacity: 1, duration: 0.2, ease: 'power2.out' }, 0)
        .to(panel, { x: 0, duration: 0.5, ease: 'power3.out' }, 0.05)
    }

    const closeContactPanel = () => {
      panelIsOpenRef.current = false
      activePanelRef.current = null
      Draggable.get(canvas)?.enable()
      const overlay = blurOverlayRef.current, panel = contactPanelRef.current
      if (!overlay || !panel) return
      gsap.timeline()
        .to(panel, { x: '100%', duration: 0.26, ease: 'power2.in' }, 0)
        .to(overlay, { opacity: 0, duration: 0.18, ease: 'power1.in' }, 0.02)
        .set(overlay, { display: 'none' })
    }
    ;(window as any).__openContactPanel = openContactPanel
    ;(window as any).__closeContactPanel = closeContactPanel
    ;(window as any).__openGpPanel = openGpPanel // used by the mobile menu

    // Clicking the dimmed overlay (anywhere outside the panel) closes the open
    // panel. The overlay also captures pointer events while visible, so canvas
    // elements beneath it are not hoverable/clickable. It is display:none when
    // no panel is open, so the canvas stays fully interactive then.
    const overlayEl = blurOverlayRef.current
    const handleOverlayClick = () => {
      if (activePanelRef.current === 'gp') closeGpPanel()
      else if (activePanelRef.current === 'ai') closeAiPanel()
      else if (activePanelRef.current === 'contact') closeContactPanel()
    }
    if (overlayEl) overlayEl.addEventListener('click', handleOverlayClick)

    // ── Scroll / pinch zoom ──
    const SCALE_MIN = 0.6, SCALE_MAX = 1.4, SCALE_STEP = 0.02
    const handleWheel = (e: WheelEvent) => {
      // When a panel (e.g. the AI chat) is open, let the wheel scroll it
      // natively — don't preventDefault, or the chat can't scroll.
      if (panelIsOpenRef.current) return
      e.preventDefault()
      if (e.ctrlKey) {
        const dir = e.deltaY > 0 ? -1 : 1
        const cx = Number(gsap.getProperty(canvas, 'x')), cy = Number(gsap.getProperty(canvas, 'y'))
        const cs = canvasScaleRef.current
        const ns = Math.min(SCALE_MAX, Math.max(SCALE_MIN, cs + dir * SCALE_STEP))
        if (ns === cs) return
        const cpx = (e.clientX - cx) / cs, cpy = (e.clientY - cy) / cs
        canvasScaleRef.current = ns
        gsap.to(canvas, { x: e.clientX - cpx * ns, y: e.clientY - cpy * ns, scale: ns, duration: 0.3, ease: 'power2.out', onUpdate() { Draggable.get(canvas)?.update(); updateResetButton(); syncGrid() } })
      } else {
        const cx = Number(gsap.getProperty(canvas, 'x')), cy = Number(gsap.getProperty(canvas, 'y'))
        gsap.set(canvas, { x: cx - (e.deltaX || 0), y: cy - (e.deltaY || 0) })
        Draggable.get(canvas)?.update(); updateResetButton(); syncGrid()
      }
    }
    document.addEventListener('wheel', handleWheel, { passive: false })

    // ── Canvas reset button ──
    const resetBtn = canvasResetRef.current
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        gsap.to(canvas, {
          x: initialCanvasXRef.current, y: initialCanvasYRef.current, scale: baseScale,
          duration: 0.8, ease: 'power3.out',
          onUpdate() { syncGrid() },
          onComplete() { canvasScaleRef.current = baseScale; Draggable.get(canvas)?.update(); updateResetButton() }
        })
      })
    }

    // ── Tool tooltips ──
    const toolStack = document.getElementById('tool-stack')
    const toolTip = toolTipRef.current
    if (toolStack && toolTip) {
      toolStack.querySelectorAll('.tool-icon').forEach(icon => {
        icon.addEventListener('mouseenter', () => {
          const label = (icon as HTMLElement).dataset.tip
          if (!label) return
          toolTip.textContent = label
          toolTip.classList.add('visible')
          const sr = toolStack.getBoundingClientRect(), ir = icon.getBoundingClientRect()
          toolTip.style.left = (sr.right + 8) + 'px'
          toolTip.style.top  = (ir.top + ir.height / 2) + 'px'
          toolTip.style.transform = 'translateY(-50%)'
        })
        icon.addEventListener('mouseleave', () => toolTip.classList.remove('visible'))
      })
    }

    // ── Dock tooltips ──
    const socialDock = document.getElementById('social-dock')
    const dockTip = dockTipRef.current
    if (socialDock && dockTip) {
      socialDock.querySelectorAll('.dock-icon').forEach(icon => {
        icon.addEventListener('mouseenter', () => {
          const label = (icon as HTMLElement).dataset.tip
          if (!label) return
          dockTip.textContent = label
          dockTip.classList.add('visible')
          const ir = icon.getBoundingClientRect()
          dockTip.style.left = (ir.left + ir.width / 2) + 'px'
          dockTip.style.top  = (ir.top - 8) + 'px'
          dockTip.style.transform = 'translate(-50%, -100%)'
        })
        icon.addEventListener('mouseleave', () => dockTip.classList.remove('visible'))
      })
    }

    // ── Entry animation ──
    const hasAnimated = sessionStorage.getItem('hasAnimated')
    const preloader = document.getElementById('preloader')
    if (hasAnimated) {
      if (preloader) preloader.style.display = 'none'
      makeHeroDraggable(dhairyaWord)
      makeHeroDraggable(narangWord)
    } else {
      sessionStorage.setItem('hasAnimated', 'true')
      gsap.set('#fixed-top-left', { opacity: 0 })
      gsap.set('#fixed-top-right', { opacity: 0 })
      gsap.set(dhairyaWord, { opacity: 0, y: 80 })
      gsap.set(narangWord,  { opacity: 0, y: 80 })
      gsap.set('#hero-tagline', { opacity: 0, y: 20 })
      gsap.set('#polaroid',     { opacity: 0, scale: 0.9, rotation: -10 })
      gsap.set('#project-deck', { opacity: 0, x: 30 })
      gsap.set('#good-problems-sticker', { opacity: 0, scale: 0, rotation: 6 })
      gsap.set('#contact-sticker',       { opacity: 0, scale: 0, rotation: 10 })
      gsap.set('#tool-stack',  { opacity: 0 })
      gsap.set('#social-dock', { opacity: 0 })
      gsap.set('#ask-ai-btn',  { opacity: 0 })

      const tl = gsap.timeline({ delay: 0.3, onComplete() { makeHeroDraggable(dhairyaWord); makeHeroDraggable(narangWord) } })
      tl.to(preloader!, { opacity: 0, duration: 0.4, ease: 'power2.out', onComplete: () => { if (preloader) preloader.style.display = 'none' } }, 0)
        .to('#fixed-top-left',  { opacity: 1, duration: 0.4 }, 0.1)
        .to('#fixed-top-right', { opacity: 1, duration: 0.4 }, 0.1)
        .to('#hero-tagline', { opacity: 1, y: 0, duration: 0.5 }, 0.2)
        .to(dhairyaWord,     { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.4)
        .to(narangWord,      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.55)
        .to('#polaroid', { opacity: 1, scale: 1, rotation: -10, duration: 0.5 }, 0.8)
        .to('#project-deck', { opacity: 1, x: 0, duration: 0.5 }, 0.9)
        .to('#good-problems-sticker', { opacity: 1, scale: 1, rotation: 6, duration: 0.6, ease: 'elastic.out(1,0.6)' }, 1.0)
        .to('#contact-sticker', { opacity: 1, scale: 1, rotation: 10, duration: 0.6, ease: 'elastic.out(1,0.6)' }, 1.1)
        .to('#tool-stack',  { opacity: 1, duration: 0.4 }, 1.2)
        .to('#social-dock', { opacity: 1, duration: 0.4 }, 1.3)
        .to('#ask-ai-btn',  { opacity: 1, duration: 0.3 }, 1.4)
    }

    return () => {
      // Fully tear down everything this effect created. Without this, Fast
      // Refresh / Strict-Mode re-mounts stack duplicate Draggables and stale
      // ghost-cursor closures on the same elements, and the leftover instances
      // fight over pointer events — which is what made the ghost cursor appear
      // to move with the canvas during a drag.
      effectCancelled = true

      document.removeEventListener('wheel', handleWheel)
      document.removeEventListener('mousemove', handleMouseMove)
      if (cursorRaf) cancelAnimationFrame(cursorRaf)
      canvas.removeEventListener('touchstart', onCanvasMultiTouch, true)
      document.removeEventListener('touchend', onTouchEndRestore)
      if (overlayEl) overlayEl.removeEventListener('click', handleOverlayClick)

      // Cancel any in-flight ghost-cursor sequence (its pending delayedCalls
      // bail out when the generation counter changes) and stop its typing timers.
      ghostGenRef.current++
      clearTyping()

      // Kill every Draggable instance created on these elements.
      ;[canvas, dhairyaWord, narangWord,
        polaroidRef.current, projectDeckRef.current,
        contactRef.current, gpStickerRef.current,
      ].forEach(el => { if (el) Draggable.get(el)?.kill() })

      // Kill any tweens still running on the animated elements.
      gsap.killTweensOf([ghostCursor, cursorArrow, cursorTag, dhairyaWord, narangWord])
    }
  }, [shuffleGpOrder, loadContext])

  // ── Auto-scroll AI messages ──────────────────────────────────────────────
  // Stick to the bottom as new text streams in, but only if the user is already
  // near the bottom — if they've scrolled up to read, leave them there.
  const stickBottomRef = useRef(true)
  const onAiMessagesScroll = useCallback(() => {
    const el = aiMessagesRef.current
    if (!el) return
    stickBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60
  }, [])
  useEffect(() => {
    const el = aiMessagesRef.current
    if (el && stickBottomRef.current) el.scrollTop = el.scrollHeight
  }, [aiMessages, aiLoading])

  // Auto-grow the chat textarea with its content (and reset when cleared).
  useEffect(() => {
    const el = aiInputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 132) + 'px'
  }, [aiInput])

  // ── GP shuffle click ──────────────────────────────────────────────────────
  const handleGpShuffle = () => {
    const nextIdx = (gpStoryIdx + 1) % gpOrder.length
    if (nextIdx === 0) shuffleGpOrder()
    else setGpStoryIdx(nextIdx)
  }

  // ── Close handlers ────────────────────────────────────────────────────────
  const handleCloseGp = () => { ;(window as any).__closeGpPanel?.() }
  const handleCloseAi = () => { ;(window as any).__closeAiPanel?.() }
  const handleCloseContact = () => { ;(window as any).__closeContactPanel?.() }
  const handleOpenAi  = () => { ;(window as any).__openAiPanel?.() }

  const handleAiReset = () => {
    conversationRef.current = []
    setAiMessages([])
    setShowIntro(true)
    setAiInput('')
  }

  const SUGGESTED = [
    "What's your experience like?",
    "What's your design process?",
    "How do you use AI in your workflow?",
    "What industries have you worked in?",
    "Are you available for work?"
  ]


  return (
    <>
      <div id="preloader" />

      {/* Fixed dot grid behind the canvas — its background-position is synced to
          the pan so it scrolls with the canvas, but it isn't painted across the
          giant canvas layer (which was the Chrome pan lag). */}
      <div id="canvas-grid" aria-hidden="true" />

      {/* ── Canvas ─────────────────────────────────────────────────────────── */}
      <div id="canvas" ref={canvasRef}>

        {/* DHAIRYA anchor */}
        <div id="dhairya-anchor">
          <div id="dhairya-word" className="hero-word hero-word-dhairya" ref={dhairyaRef}>
            <div className="word-status-tooltip" />
            <div className="corner-sq corner-tl" /><div className="corner-sq corner-tr" />
            <div className="corner-sq corner-bl" /><div className="corner-sq corner-br" />
            <span className="hero-drag-hint">DRAG TO MOVE</span>
            <div id="canvas-hero-line-filled" className="canvas-hero-line">DHAIRYA</div>
          </div>
        </div>

        {/* NARANG anchor */}
        <div id="narang-anchor">
          <div id="narang-word" className="hero-word" ref={narangRef}>
            <div className="word-status-tooltip" />
            <div className="corner-sq corner-tl" /><div className="corner-sq corner-tr" />
            <div className="corner-sq corner-bl" /><div className="corner-sq corner-br" />
            <span className="hero-drag-hint">DRAG TO MOVE</span>
            <div id="canvas-hero-line-outline" className="canvas-hero-line">NARANG</div>
          </div>
        </div>

        {/* Tagline */}
        <div id="hero-tagline">
          <TaglineLines />
          <div id="hero-tagline-text">Designing products. <span className="tagline-ai">Exploring AI.</span> Building what&apos;s next.</div>
          <TaglineLines className="tagline-svg-right" />
        </div>

        {/* Polaroid */}
        <a id="polaroid" ref={polaroidRef} href="/about" aria-label="About Me"
           onMouseEnter={() => setCursorLabel('My Story')}
           onMouseLeave={() => setCursorLabel('You')}>
          <Image id="polaroid-photo" src="/dhairya-photo.webp" alt="Dhairya Narang" width={220} height={220} style={{ borderRadius: 2, display: 'block', objectFit: 'cover' }} />
          <div id="polaroid-caption">About me <span className="polaroid-arrow">→</span></div>
        </a>

        {/* Project Deck */}
        <div id="project-deck" ref={projectDeckRef}
             onMouseEnter={() => setCursorLabel('View Work')}
             onMouseLeave={() => setCursorLabel('You')}>
          <div className="deck-wrapper">
            <div className="project-card" id="deck-card-4" ref={deckCard4Ref as React.RefObject<HTMLDivElement>}>
              <div className="card-image">
                <Image src="/OneKey-thumbnail.webp" alt="ONO" fill style={{ objectFit: 'cover' }} />
                <div className="card-tag-pill">Earlier Work</div>
              </div>
              <div className="card-content">
                <div className="card-name">ONO</div>
                <div className="card-desc">Agri-Tech Redesign</div>
                <div className="card-dots">
                  {['#E8462A','#FF8A80','#FFCCBC','#4E342E'].map(c => <div key={c} className="card-dot" style={{ background: c }} />)}
                </div>
              </div>
            </div>
            <div className="project-card" id="deck-card-3" ref={deckCard3Ref as React.RefObject<HTMLDivElement>}>
              <div className="card-image">
                <Image src="/OneKey-thumbnail.webp" alt="MyRoom" fill style={{ objectFit: 'cover' }} />
                <div className="card-tag-pill">Concept</div>
              </div>
              <div className="card-content">
                <div className="card-name">MyRoom</div>
                <div className="card-desc">Personal Exploration</div>
                <div className="card-dots">
                  {['#4CAF50','#81C784','#C8E6C9','#1B5E20'].map(c => <div key={c} className="card-dot" style={{ background: c }} />)}
                </div>
              </div>
            </div>
            <div className="project-card" id="deck-card-2" ref={deckCard2Ref as React.RefObject<HTMLDivElement>}>
              <div className="card-image">
                <Image src="/OneKey-thumbnail.webp" alt="Luxury Fitness App" fill style={{ objectFit: 'cover' }} />
                <div className="card-tag-pill"><div className="card-tag-gray-dot" />Delivered</div>
              </div>
              <div className="card-content">
                <div className="card-name">Luxury Fitness App</div>
                <div className="card-desc">Premium Mobile Experience</div>
                <div className="card-dots">
                  {['#C9A96E','#E8D4A8','#F5ECD8','#2C1810'].map(c => <div key={c} className="card-dot" style={{ background: c }} />)}
                </div>
              </div>
            </div>
            <a className="project-card" id="deck-card-1" ref={deckCard1Ref} href="/work" aria-label="View Work">
              <div className="card-image">
                <Image src="/OneKey-thumbnail.webp" alt="OneKey" fill style={{ objectFit: 'cover' }} />
                <div className="card-tag-pill"><div className="card-tag-live-dot" />Live App</div>
              </div>
              <div className="card-content">
                <div className="card-name">OneKey</div>
                <div className="card-desc">Voice-First AI Native</div>
                <div className="card-dots">
                  {['#5B4CDB','#A8B5FF','#C5BDFF','#1A1A2E'].map(c => <div key={c} className="card-dot" style={{ background: c }} />)}
                </div>
              </div>
            </a>
          </div>
          <div className="deck-label">Selected Work</div>
        </div>

        {/* Contact sticker */}
        <a id="contact-sticker" ref={contactRef} href="#" aria-label="Contact Dhairya"
           onMouseEnter={() => setCursorLabel("Let's Talk")}
           onMouseLeave={() => setCursorLabel('You')}>
          <Image src="/contact-me-trigger2.webp" alt="Contact Me" width={280} height={280} draggable={false} style={{ display: 'block', width: 280, height: 'auto' }} />
        </a>

        {/* Good Problems sticker */}
        <div id="good-problems-sticker" ref={gpStickerRef} role="button" tabIndex={0} aria-label="Good Problems"
             onMouseEnter={() => setCursorLabel('Good Problems')}
             onMouseLeave={() => setCursorLabel('You')}>
          <Image src="/good-problems-trigger.webp" alt="Good Problems" width={320} height={320} draggable={false} style={{ display: 'block', width: 320, height: 'auto' }} />
        </div>
      </div>

      {/* ── Fixed UI ───────────────────────────────────────────────────────── */}
      <div id="fixed-top-left">DHAIRYA NARANG</div>
      <div id="fixed-top-right" ref={fixedTopRightRef}>{clockText}</div>
      <button id="canvas-reset" ref={canvasResetRef}>FIND MY WAY BACK</button>

      {/* ── Mobile hamburger menu (small screens only; hidden on desktop via CSS).
            Reuses the existing panel-open functions and canvas routes so taps are
            reliable without fighting the drag-canvas. ─────────────────────────── */}
      <button
        id="mobile-menu-btn"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
      >
        {menuOpen ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round" /></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M3 6h16M3 11h16M3 16h16" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round" /></svg>
        )}
      </button>
      {menuOpen && (
        <nav id="mobile-menu" aria-label="Primary">
          <a className="mobile-menu-item" href="/work">Projects</a>
          <a className="mobile-menu-item" href="/about">About</a>
          <button className="mobile-menu-item" onClick={() => { setMenuOpen(false); (window as any).__openGpPanel?.() }}>Good Problems</button>
          <button className="mobile-menu-item" onClick={() => { setMenuOpen(false); (window as any).__openContactPanel?.() }}>Contact</button>
          <button className="mobile-menu-item" onClick={() => { setMenuOpen(false); (window as any).__openAiPanel?.() }}>Ask AI</button>
        </nav>
      )}

      {/* ── Custom cursor ─────────────────────────────────────────────────── */}
      <div id="cursor-arrow" ref={cursorArrowRef}><CursorArrowSVG /></div>
      <div id="cursor-tag" ref={cursorTagRef}>{cursorLabel}</div>

      {/* ── Drag overlays ─────────────────────────────────────────────────── */}
      <div id="drag-coords" ref={dragCoordsRef} />
      <svg id="drag-line-svg" ref={dragLineSVGRef} xmlns="http://www.w3.org/2000/svg">
        <line ref={dragLineRef} stroke="#E8462A" strokeWidth="1" strokeDasharray="5,4" x1="0" y1="0" x2="0" y2="0" />
      </svg>

      {/* ── Ghost cursor ──────────────────────────────────────────────────── */}
      <div id="ghost-cursor" ref={ghostCursorRef}>
        <GhostArrowSVG />
        <div id="ghost-cursor-pill">
          <div id="ghost-cursor-name">Dhairya</div>
          <div id="ghost-tooltip" ref={ghostTooltipRef} />
        </div>
      </div>

      {/* ── Tool stack ────────────────────────────────────────────────────── */}
      <div id="tool-stack" aria-label="Tools I use">
        <div className="tool-icon" data-tip="Framer"><FramerIcon /></div>
        <div className="tool-icon" data-tip="Figma"><FigmaIcon /></div>
        <div className="tool-divider" />
        <div className="tool-icon" data-tip="Notion"><NotionIcon /></div>
        <div className="tool-icon" data-tip="Slack"><SlackIcon /></div>
        <div className="tool-divider" />
        <div className="tool-icon" data-tip="Claude"><ClaudeIcon /></div>
        <div className="tool-icon" data-tip="Claude Code">
          <Image src="/claude-code.webp" alt="Claude Code" width={24} height={24} style={{ width: 24, height: 24, objectFit: 'cover', borderRadius: 6, display: 'block' }} />
        </div>
      </div>
      <div id="tool-tip" className="tool-tooltip" ref={toolTipRef} />

      {/* ── Social dock ───────────────────────────────────────────────────── */}
      <div id="social-dock" aria-label="Social links">
        <a className="dock-icon" href="https://www.behance.net/dhairyanarang36" target="_blank" rel="noopener noreferrer" data-tip="Behance">
          <svg viewBox="0 0 32 32" fill="none" style={{width:24,height:24}}>
            <g clipPath="url(#behClip)">
              <path d="M26.3333 0H5.66667C2.53705 0 0 2.53705 0 5.66667V25.5333C0 28.6629 2.53705 31.2 5.66667 31.2H26.3333C29.4629 31.2 32 28.6629 32 25.5333V5.66667C32 2.53705 29.4629 0 26.3333 0Z" fill="#000B1D"/>
              <path d="M5.65363 21.8579V8.22658C5.65363 8.0978 5.69655 8.02625 5.7824 8.01193C6.02557 7.99783 6.39766 7.9871 6.89868 7.97974C7.39946 7.97267 7.94327 7.96551 8.53012 7.95825C9.11678 7.95122 9.65345 7.94764 10.1401 7.94751C11.3135 7.94751 12.2472 8.07632 12.9415 8.33394C13.6355 8.59152 14.1686 8.91709 14.5408 9.31066C14.8846 9.65745 15.142 10.0803 15.2922 10.545C15.4134 10.9271 15.4785 11.3248 15.4853 11.7257C15.4929 12.154 15.4201 12.58 15.2707 12.9815C15.1478 13.3107 14.974 13.6186 14.7554 13.8938C14.5926 14.1029 14.3968 14.2841 14.1759 14.4305C14.4813 14.5923 14.766 14.7905 15.0238 15.0208C15.3577 15.3202 15.631 15.6809 15.8288 16.0834C16.0733 16.5991 16.1911 17.1659 16.1722 17.7363C16.1857 18.5527 15.9333 19.3514 15.4531 20.0118C14.9735 20.6702 14.2866 21.1818 13.3924 21.5467C12.4978 21.9116 11.428 22.0941 10.1831 22.0941H8.75551C8.30473 22.0941 7.88971 22.0905 7.51046 22.0833C7.1311 22.0759 6.80195 22.0688 6.52302 22.0619C6.24392 22.0545 6.00421 22.0509 5.80388 22.0511C5.70356 22.037 5.65347 21.9726 5.65363 21.8579ZM8.55161 10.5021V13.4859H10.0113C10.3978 13.4859 10.777 13.4931 11.1491 13.5074C11.416 13.5094 11.6821 13.5381 11.9433 13.5932C12.1329 13.4314 12.2895 13.2346 12.4049 13.0136C12.5349 12.7466 12.5976 12.4518 12.5873 12.155C12.6022 11.8178 12.504 11.4854 12.3082 11.2105C12.1002 10.9521 11.82 10.7615 11.5033 10.6631C11.069 10.5295 10.6158 10.4678 10.1616 10.4806H9.53904C9.35291 10.4806 9.18477 10.4842 9.03462 10.4913C8.88435 10.4987 8.72335 10.5023 8.55161 10.5021ZM8.55161 16.019V19.561C8.79477 19.5754 9.03807 19.5861 9.28149 19.5932C9.52465 19.6006 9.81803 19.6042 10.1616 19.6039C10.6868 19.6118 11.2106 19.5468 11.7179 19.4107C12.1104 19.3171 12.4656 19.1077 12.7376 18.8097C12.9707 18.5261 13.0927 18.1676 13.0811 17.8007C13.0893 17.4443 12.9923 17.0933 12.802 16.7918C12.6159 16.5057 12.2724 16.2982 11.7716 16.1693C11.577 16.1223 11.38 16.0864 11.1813 16.0619C10.9213 16.0312 10.6596 16.0169 10.3978 16.019L8.55161 16.019Z" fill="white"/>
              <path d="M20.5742 17.5002C20.6262 17.9011 20.7654 18.2858 20.9821 18.6272C21.2222 18.9851 21.5617 19.2649 21.9589 19.4322C22.3952 19.6328 22.964 19.7329 23.6654 19.7327C24.1296 19.7347 24.593 19.6952 25.0501 19.6147C25.4816 19.5375 25.9029 19.4115 26.3059 19.239C26.3773 19.182 26.4131 19.2175 26.4131 19.3463V21.3857C26.4167 21.4412 26.4056 21.4967 26.381 21.5467C26.3564 21.5857 26.3318 21.6187 26.2844 21.6432C25.8399 21.8535 25.3713 22.0085 24.8891 22.1048C24.2664 22.2218 23.6335 22.2757 23 22.2658C21.9837 22.2658 21.1321 22.1084 20.4454 21.7935C19.7963 21.5075 19.2229 21.0738 18.771 20.527C18.349 20.0117 18.0351 19.4167 17.848 18.7775C17.6627 18.1465 17.5687 16.4923 17.5689 16.8347C17.5669 16.1167 17.6792 15.403 17.9016 14.7203C18.1158 14.0543 18.4545 13.4351 18.8998 12.8956C19.339 12.3624 19.8882 11.9304 20.5098 11.6291C21.2089 11.3066 21.9727 11.1487 22.7424 11.1675C23.4545 11.1495 24.1618 11.2888 24.8139 11.5754C25.365 11.825 25.8474 12.2043 26.22 12.6809C26.5717 13.1348 26.8405 13.6471 27.0142 14.1943C27.1833 14.7217 27.2702 15.272 27.2718 15.8258C27.2718 16.1407 27.2611 16.427 27.2396 16.6845C27.2182 16.942 27.1766 17.2097 27.1625 17.3241C27.1553 17.3707 27.1321 17.4134 27.0968 17.4448C27.0615 17.4761 27.0165 17.4942 26.9693 17.4958C26.8834 17.4958 20.5742 17.5002 20.5742 17.5002ZM20.5742 15.4179H23.3864C23.7298 15.4179 23.9838 15.4143 24.1484 15.4072C24.253 15.4072 24.3573 15.3964 24.4597 15.375V15.2462C24.4554 15.0783 24.4265 14.9119 24.3738 14.7525C24.258 14.3862 24.0251 14.0681 23.711 13.8471C23.3969 13.626 23.0189 13.5142 22.635 13.5289C22.2738 13.507 21.914 13.5908 21.5995 13.7699C21.285 13.9491 21.0295 14.2159 20.8641 14.5378C20.7176 14.8123 20.6196 15.1101 20.5742 15.4179Z" fill="white"/>
              <path d="M19.2218 7.54453H25.6403C25.7404 7.54453 25.7908 7.60199 25.7908 7.71652V9.45798C25.7942 9.48135 25.792 9.50517 25.7846 9.52757C25.7771 9.54996 25.7645 9.57031 25.7478 9.587C25.7312 9.60369 25.7108 9.61627 25.6884 9.62372C25.666 9.63118 25.6422 9.63332 25.6188 9.62997H19.2003C19.0999 9.62997 19.0498 9.57288 19.0498 9.45798V7.69504C19.0498 7.59494 19.107 7.54453 19.2218 7.54453Z" fill="white"/>
            </g>
            <defs><clipPath id="behClip"><rect width="32" height="31.2" fill="white"/></clipPath></defs>
          </svg>
        </a>
        <a className="dock-icon" href="https://www.linkedin.com/in/dhairya-narang/" target="_blank" rel="noopener noreferrer" data-tip="LinkedIn">
          <svg preserveAspectRatio="xMidYMid" viewBox="0 0 256 256" style={{width:24,height:24}}>
            <path d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453" fill="#0A66C2"/>
          </svg>
        </a>
        <a className="dock-icon" href="mailto:dhairyanarang077@gmail.com" data-tip="Gmail">
          <svg viewBox="0 49.4 512 399.42" style={{width:24,height:24}}>
            <g fill="none" fillRule="evenodd"><g fillRule="nonzero">
              <path fill="#4285f4" d="M34.91 448.818h81.454V251L0 163.727V413.91c0 19.287 15.622 34.91 34.91 34.91z"/>
              <path fill="#34a853" d="M395.636 448.818h81.455c19.287 0 34.909-15.622 34.909-34.909V163.727L395.636 251z"/>
              <path fill="#fbbc04" d="M395.636 99.727V251L512 163.727v-46.545c0-43.142-49.25-67.782-83.782-41.891z"/>
            </g>
            <path fill="#ea4335" d="M116.364 251V99.727L256 204.455 395.636 99.727V251L256 355.727z"/>
            <path fill="#c5221f" fillRule="nonzero" d="M0 117.182v46.545L116.364 251V99.727L83.782 75.291C49.25 49.4 0 74.04 0 117.18z"/>
            </g>
          </svg>
        </a>
      </div>
      <div id="dock-tip" className="dock-tooltip" ref={dockTipRef} />

      {/* ── Blur overlay (click-outside-to-close + blocks canvas interaction) ── */}
      <div id="blur-overlay" ref={blurOverlayRef} />

      {/* ── GP Panel ──────────────────────────────────────────────────────── */}
      <div id="gp-panel" ref={gpPanelRef} role="dialog" aria-label="Good Problems" aria-modal="true">
        <button id="gp-close" onClick={handleCloseGp} aria-label="Close">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/close.svg" alt="Close" width={18} height={18} />
        </button>
        {/* Scrollable content — keeps the close button (absolute) and the footer
            CTA out of the scroll so "Another one" stays pinned + visible even on
            short laptop screens where the story would otherwise push it off-fold. */}
        <div id="gp-scroll">
          <div className="gp-eyebrow">Good Problems</div>
          <div className="gp-title">Problems worth admiring.</div>
          <div className="gp-intro">I&apos;m fascinated by problems that were solved in ways nobody expected. Not interface problems — real world ones. The kind that reveal something true about how people think and behave.</div>
          <hr className="gp-divider" />
          <div id="gp-story" ref={gpStoryRef}>
            {currentStory && (
              <>
                <div className="gp-story-label">The problem</div>
                <div className="gp-story-text">{currentStory.problem}</div>
                <div className="gp-story-label">The solution</div>
                <div className="gp-story-text">{currentStory.solution}</div>
                <div className="gp-story-label">Why it worked</div>
                <div className="gp-story-text" style={{ marginBottom: 0 }}>{currentStory.why}</div>
              </>
            )}
          </div>
        </div>
        <div className="gp-footer">
          <hr className="gp-divider" />
          <button id="gp-shuffle" onClick={handleGpShuffle}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/reset-chat.svg" alt="" aria-hidden="true" width={16} height={16} />
            Another one
          </button>
        </div>
      </div>

      {/* ── Contact Panel ─────────────────────────────────────────────────── */}
      <div id="contact-panel" ref={contactPanelRef} role="dialog" aria-label="Contact" aria-modal="true">
        <button id="contact-close" onClick={handleCloseContact} aria-label="Close">✕</button>
        <div className="gp-eyebrow">Contact</div>
        <div className="gp-title">Let&apos;s talk.</div>
        <div className="gp-intro">Got a project, a question, or just want to say hi? Reach out.</div>
        <hr className="gp-divider" />

        <a className="contact-row" href="mailto:dhairyanarang077@gmail.com">
          <span className="contact-row-label">Email</span>
          <span className="contact-row-value">dhairyanarang077@gmail.com</span>
        </a>
        <a className="contact-row" href="tel:+919729577391">
          <span className="contact-row-label">Phone</span>
          <span className="contact-row-value">97295-77391</span>
        </a>

        <div className="contact-connect-label">Connect on</div>
        <div className="contact-socials">
          <a className="contact-social" href="https://www.linkedin.com/in/dhairya-narang/" target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/linkedin.svg" alt="" aria-hidden="true" width={18} height={18} />
            LinkedIn
          </a>
          <a className="contact-social" href="https://www.behance.net/dhairyanarang36" target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/behance.svg" alt="" aria-hidden="true" width={18} height={18} />
            Behance
          </a>
          <a className="contact-social" href="https://www.instagram.com/dhairya.svg/" target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/instagram.svg" alt="" aria-hidden="true" width={18} height={18} />
            Instagram
          </a>
        </div>
      </div>

      {/* ── Ask AI Button ─────────────────────────────────────────────────── */}
      <button id="ask-ai-btn" onClick={handleOpenAi} aria-label="Ask AI about Dhairya"
              onMouseEnter={() => setCursorLabel('Ask AI')}
              onMouseLeave={() => setCursorLabel('You')}>
        <SparkleIcon className="ai-btn-icon" width={18} height={18} />
        <span className="ai-btn-text">Ask AI</span>
      </button>

      {/* ── AI Panel ──────────────────────────────────────────────────────── */}
      <div id="ai-panel" ref={aiPanelRef} role="dialog" aria-label="Ask AI" aria-modal="true">
        <div id="ai-panel-header">
          <div className="ai-header-left">
            <SparkleIcon className="ai-header-sparkle-img" width={20} height={20} />
            <div style={{ marginLeft: 10 }} className="ai-header-title-stack">
              <span className="ai-header-title-main">Ask Dhairya AI</span>
            </div>
          </div>
          <div className="ai-header-right">
            <button className="ai-header-icon-btn" onClick={handleAiReset} aria-label="Reset chat">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/reset-chat.svg" alt="Reset" width={18} height={18} />
            </button>
            <button className="ai-header-icon-btn" onClick={handleCloseAi} aria-label="Close">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/close.svg" alt="Close" width={18} height={18} />
            </button>
          </div>
        </div>

        <div id="ai-messages" ref={aiMessagesRef} onScroll={onAiMessagesScroll}>
          {showIntro && (
            <>
              <p id="ai-intro-text">Hi! I&apos;m Dhairya&apos;s AI Chatbot — ask me anything about his work, skills or experience.</p>
              <div className="ai-suggested-label">Suggested Questions</div>
              <div className="ai-chips-row">
                {SUGGESTED.map(q => (
                  <button key={q} className="ai-chip" onClick={() => sendAiMessage(q)}>{q}</button>
                ))}
              </div>
            </>
          )}
          {aiMessages.map((msg, i) => (
            <div key={i} className={`ai-msg-row ${msg.role}`}>
              {msg.role === 'ai' ? (
                <div className="ai-bubble ai ai-md">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={aiMarkdownComponents}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="ai-bubble user">{msg.text}</div>
              )}
              {/* Only the latest AI reply shows follow-ups (and only once it has settled). */}
              {msg.role === 'ai' && i === aiMessages.length - 1 && !aiLoading && msg.followups && msg.followups.length > 0 && (
                <div className="ai-followups">
                  {msg.followups.map(f => (
                    <button key={f} className="ai-chip ai-chip-followup" onClick={() => sendAiMessage(f)}>{f}</button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {aiLoading && (
            <div className="ai-msg-row ai">
              <div className="ai-bubble ai ai-bubble--typing" role="status" aria-label="Dhairya AI is typing">
                <span className="ai-typing-dot" /><span className="ai-typing-dot" /><span className="ai-typing-dot" />
              </div>
            </div>
          )}
        </div>

        <div id="ai-input-area">
          <textarea
            id="ai-input"
            ref={aiInputRef}
            placeholder="Ask me anything..."
            autoComplete="off"
            rows={1}
            value={aiInput}
            onChange={e => setAiInput(e.target.value)}
            onKeyDown={e => {
              // Enter sends; Shift+Enter inserts a newline.
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                if (aiInput.trim() && !aiLoading) sendAiMessage(aiInput)
              }
            }}
          />
          <button
            id="ai-send"
            disabled={!aiInput.trim() || aiLoading}
            aria-label="Send"
            onClick={() => sendAiMessage(aiInput)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/send.svg" alt="Send" width={20} height={20} />
          </button>
        </div>
      </div>
    </>
  )
}
