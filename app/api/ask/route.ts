import { NextResponse } from 'next/server'

// Runs on the server only. The OpenAI key lives in process.env and is never sent
// to the browser. Two modes:
//   • default            — streams the Markdown answer token-by-token (typed live)
//   • mode:'followups'    — a quick, non-streamed JSON call that returns 2–3
//                           suggested follow-up questions for the last Q&A
// Keeping follow-ups in their own JSON call makes them reliable regardless of how
// long the answer is (a long answer can't crowd them out).
export const runtime = 'nodejs'

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'

type ChatMsg = { role: string; content: string }

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'AI is not configured.' }, { status: 500 })
  }

  let body: { context?: string; messages?: ChatMsg[]; mode?: string; question?: string; answer?: string; turn?: number }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 })
  }

  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` }

  // ── Follow-up suggestions (separate, reliable JSON call) ──
  if (body.mode === 'followups') {
    const q = (body.question || '').slice(0, 1000)
    const a = (body.answer || '').slice(0, 4000)
    const turn = Math.max(1, Math.min(20, Number(body.turn) || 1))
    const messages = [
      {
        role: 'system',
        content:
          `You suggest follow-up questions for the AI chat on Dhairya Narang's portfolio, whose knowledge is a single, limited context file. ` +
          `This is turn ${turn} of the conversation. Given the visitor's last question and the assistant's answer, suggest the follow-ups the visitor might naturally tap next. ` +
          `Each must be answerable from a portfolio/résumé context, under ~8 words, plain text, no leading symbols. Respond ONLY as JSON: {"followups":[...]}.\n` +
          `Taper as the conversation deepens — never force questions the limited context can't answer well:\n` +
          `- Turns 1-2: up to 3 specific, on-topic follow-ups.\n` +
          `- Turns 3-4: at most 2, broader; you may include a gentle nudge like "How can I get in touch with Dhairya?".\n` +
          `- Turn 5+: just 1-2 general, winding-down suggestions such as "How can I contact Dhairya?" or "What else can I explore?".\n` +
          `Never repeat questions already covered, and if there are no genuinely useful follow-ups, return fewer or an empty array.`,
      },
      { role: 'user', content: `Question: ${q}\n\nAnswer: ${a}` },
    ]
    try {
      const r = await fetch(OPENAI_URL, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          response_format: { type: 'json_object' },
          temperature: 0.7,
          max_tokens: 120,
        }),
      })
      if (!r.ok) return NextResponse.json({ followups: [] })
      const data = await r.json()
      let parsed: { followups?: unknown } = {}
      try { parsed = JSON.parse(data?.choices?.[0]?.message?.content || '{}') } catch { /* keep empty */ }
      const followups = Array.isArray(parsed.followups)
        ? parsed.followups.filter((x): x is string => typeof x === 'string').slice(0, 3)
        : []
      return NextResponse.json({ followups })
    } catch {
      return NextResponse.json({ followups: [] })
    }
  }

  // ── Main answer (streamed) ──
  const context = (body.context || '').slice(0, 24000)
  const history = (body.messages || []).slice(-12) // keep the last few turns only

  const system = `You are the friendly AI assistant on Dhairya Narang's portfolio website. ` +
    `Answer a visitor's questions about Dhairya's work, skills, projects and experience using ONLY the context below. Be warm, specific and concise.\n\n` +
    `FORMAT the answer as clean GitHub-flavoured Markdown so it reads well, not as one long block:\n` +
    `- Open with a short one-line summary sentence.\n` +
    `- When the answer has multiple parts, group them under short bold headings like **Experience** or **Tools** (use a couple of headings if it helps).\n` +
    `- Use "- " bullet points for lists, and **bold** for key terms (names, roles, numbers).\n` +
    `- Separate paragraphs/sections with a blank line. Keep it scannable and brief (a few short sections at most) — avoid walls of text.\n` +
    `- When it's useful (e.g. inviting the visitor to get in touch, or when the info isn't in the context), include Markdown links: ` +
    `[LinkedIn](https://www.linkedin.com/in/dhairya-narang/), [email](mailto:dhairyanarang077@gmail.com), [Behance](https://www.behance.net/dhairyanarang36).\n` +
    `If something isn't covered in the context, say you're not sure and point them to [LinkedIn](https://www.linkedin.com/in/dhairya-narang/) or [email](mailto:dhairyanarang077@gmail.com).\n\n` +
    `CONTEXT:\n${context}\n\n` +
    `REMINDER: Answer ONLY the question asked, using the context above. Do NOT end your answer with follow-up questions, "you might also ask", "feel free to ask", an arrow list (→ …) or any list of suggested questions — those are shown to the visitor separately as buttons.`

  const messages = [
    { role: 'system', content: system },
    ...history.map((m) => ({
      role: m.role === 'assistant' || m.role === 'ai' ? 'assistant' : 'user',
      content: m.content,
    })),
  ]

  let upstream: Response
  try {
    upstream = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.6,
        max_tokens: 700,
        stream: true,
      }),
    })
  } catch {
    return NextResponse.json({ error: 'AI request failed.' }, { status: 502 })
  }

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: 'AI request failed.' }, { status: 502 })
  }

  // Re-emit OpenAI's SSE stream as a plain-text stream of just the content deltas.
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const reader = upstream.body.getReader()

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = ''
      try {
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || '' // keep the partial last line for the next chunk
          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith('data:')) continue
            const data = trimmed.slice(5).trim()
            if (data === '[DONE]') {
              controller.close()
              return
            }
            try {
              const json = JSON.parse(data)
              const delta: string | undefined = json?.choices?.[0]?.delta?.content
              if (delta) controller.enqueue(encoder.encode(delta))
            } catch {
              // ignore keep-alives / non-JSON lines
            }
          }
        }
      } catch {
        // upstream hiccup — just end the stream with whatever we sent
      }
      controller.close()
    },
    cancel() {
      reader.cancel().catch(() => {})
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    },
  })
}
