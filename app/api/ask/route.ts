import { NextResponse } from 'next/server'

// Runs on the server only. The OpenAI key lives in process.env and is never sent
// to the browser — the client posts the conversation here, this route talks to
// OpenAI and *streams* the reply back token-by-token so it appears as it's typed.
//
// The model writes its Markdown answer, then a line `<<<FOLLOWUPS>>>`, then a JSON
// array of follow-up questions. The client renders everything before the marker
// as the answer (live) and parses the array after it once the stream ends.
export const runtime = 'nodejs'

const FOLLOWUPS_MARKER = '<<<FOLLOWUPS>>>'

type ChatMsg = { role: string; content: string }

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'AI is not configured.' }, { status: 500 })
  }

  let body: { context?: string; messages?: ChatMsg[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 })
  }

  const context = (body.context || '').slice(0, 24000)
  const history = (body.messages || []).slice(-12) // keep the last few turns only

  const system = `You are the friendly AI assistant on Dhairya Narang's portfolio website. ` +
    `Answer a visitor's questions about Dhairya's work, skills, projects and experience using ONLY the context below. Be warm, specific and concise.\n\n` +
    `Write your reply as clean GitHub-flavoured Markdown so it reads well, not as one long block:\n` +
    `- Open with a short one-line summary sentence.\n` +
    `- When the answer has multiple parts, group them under short bold headings like **Experience** or **Tools** (use a couple of headings if it helps).\n` +
    `- Use "- " bullet points for lists, and **bold** for key terms (names, roles, numbers).\n` +
    `- Separate paragraphs/sections with a blank line. Keep it scannable and brief — avoid walls of text. ` +
    `Keep the answer itself under ~180 words even for broad questions (summarise at a high level), so there is always room for the follow-ups.\n` +
    `- When it's useful (e.g. inviting the visitor to get in touch, or when the info isn't in the context), include Markdown links: ` +
    `[LinkedIn](https://www.linkedin.com/in/dhairya-narang/), [email](mailto:dhairyanarang077@gmail.com), [Behance](https://www.behance.net/dhairyanarang36).\n` +
    `If something isn't covered in the context, say you're not sure and point them to [LinkedIn](https://www.linkedin.com/in/dhairya-narang/) or [email](mailto:dhairyanarang077@gmail.com).\n\n` +
    `After the complete answer, output a new line containing EXACTLY:\n${FOLLOWUPS_MARKER}\n` +
    `then on the next line a JSON array of 2–3 short, natural follow-up questions a visitor might ask next ` +
    `(plain text, each under ~8 words, with NO leading arrows, dashes, bullets, numbers or other symbols). Output nothing after the array.\n\n` +
    `CONTEXT:\n${context}`

  const messages = [
    { role: 'system', content: system },
    ...history.map((m) => ({
      role: m.role === 'assistant' || m.role === 'ai' ? 'assistant' : 'user',
      content: m.content,
    })),
  ]

  let upstream: Response
  try {
    upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.6,
        max_tokens: 900,
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
