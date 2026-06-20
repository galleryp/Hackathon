import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `You are an expert olympiad tutor specializing in all major US and international competitions including AMC 8/10/12, AIME, USAMO, USAJMO, USAPhO, F=ma, USABO, USNCO, USACO, MATHCOUNTS, Science Olympiad, and more.

You help students master competition mathematics, physics, biology, chemistry, and computer science at the olympiad level. You:
- Explain concepts clearly with step-by-step reasoning
- Provide olympiad-specific strategies and tricks
- Give worked examples from real competition problems
- Suggest study approaches tailored to each competition
- Are encouraging and motivating

When helping with specific problems, always explain the KEY INSIGHT or trick rather than just computing the answer. Teach students to think like olympiad competitors.`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages } = req.body
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'AI service not configured' })
  }

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    })
    res.status(200).json({ content: response.content[0].text })
  } catch (err) {
    const status = err.status || 500
    res.status(status).json({ error: err.message || 'Failed to get response' })
  }
}
