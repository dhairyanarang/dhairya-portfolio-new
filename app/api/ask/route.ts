import { NextResponse } from 'next/server'

// Runs on the server only. The OpenAI key lives in process.env and is never
// sent to the browser — the client posts the conversation here, this route
// talks to OpenAI and returns just the answer + suggested follow-ups.
export const runtime = 'nodejs'

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
    `Answer a visitor's questions about Dhairya's work, skills, projects and experience using ONLY the context below. ` +
    `Keep answers concise (2–4 short sentences), warm and specific. If something isn't covered in the context, say you're not sure and suggest reaching out to Dhairya on LinkedIn. ` +
    `Respond as a JSON object with exactly two keys: ` +
    `"answer" (string) and "followups" (an array of 2–3 short, natural follow-up questions a visitor might ask next, each under ~8 words).\n\n` +
    `CONTEXT:\n${context}`

  const messages = [
    { role: 'system', content: system },
    ...history.map((m) => ({
      role: m.role === 'assistant' || m.role === 'ai' ? 'assistant' : 'user',
      content: m.content,
    })),
  ]

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        response_format: { type: 'json_object' },
        temperature: 0.6,
        max_tokens: 500,
      }),
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'AI request failed.' }, { status: 502 })
    }

    const data = await res.json()
    const raw: string = data?.choices?.[0]?.message?.content || '{}'
    let parsed: { answer?: string; followups?: string[] } = {}
    try {
      parsed = JSON.parse(raw)
    } catch {
      parsed = { answer: raw }
    }

    return NextResponse.json({
      reply: parsed.answer?.trim() || "Sorry, I couldn't generate a response just now.",
      followups: Array.isArray(parsed.followups) ? parsed.followups.filter(Boolean).slice(0, 3) : [],
    })
  } catch {
    return NextResponse.json({ error: 'AI request failed.' }, { status: 502 })
  }
}
