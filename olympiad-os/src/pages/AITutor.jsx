import { useState, useRef, useEffect } from 'react'
import { useData } from '../contexts/DataContext'
import { useNavigate } from 'react-router-dom'
import { Send, Bot, User, Sparkles, Settings, RotateCcw, Copy, Check } from 'lucide-react'
import Anthropic from '@anthropic-ai/sdk'

const QUICK_PROMPTS = [
  { label: 'AMC trick', prompt: 'Explain the key tricks for solving AMC 10/12 competition problems quickly.' },
  { label: 'AIME strategy', prompt: 'What are the best strategies for the AIME? Focus on number theory and combinatorics.' },
  { label: 'Physics F=ma', prompt: 'Walk me through how to approach F=ma exam problems step by step.' },
  { label: 'Induction proofs', prompt: 'Teach me how to write strong mathematical induction proofs for olympiad competitions.' },
  { label: 'USABO bio', prompt: 'What topics are most important for the USABO exam and how should I study them?' },
  { label: 'Counting & Casework', prompt: 'Explain casework and complementary counting techniques for combinatorics olympiad problems.' },
]

const SYSTEM_PROMPT = `You are an expert olympiad tutor specializing in all major US and international competitions including AMC 8/10/12, AIME, USAMO, USAJMO, USAPhO, F=ma, USABO, USNCO, USACO, MATHCOUNTS, Science Olympiad, and more.

You help students master competition mathematics, physics, biology, chemistry, and computer science at the olympiad level. You:
- Explain concepts clearly with step-by-step reasoning
- Provide olympiad-specific strategies and tricks
- Give worked examples from real competition problems
- Suggest study approaches tailored to each competition
- Use LaTeX notation for math (e.g., $x^2 + y^2 = z^2$) when helpful
- Are encouraging and motivating

When helping with specific problems, always explain the KEY INSIGHT or trick rather than just computing the answer. Teach students to think like olympiad competitors.`

function MessageBubble({ msg }) {
  const [copied, setCopied] = useState(false)
  const isUser = msg.role === 'user'

  function copy() {
    navigator.clipboard.writeText(msg.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} group`}>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${isUser ? 'bg-violet-600' : 'bg-space-600 border border-white/10'}`}>
        {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-violet-400" />}
      </div>
      <div className={`max-w-[80%] relative ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${isUser ? 'chat-bubble-user text-white rounded-tr-sm' : 'chat-bubble-ai text-slate-200 rounded-tl-sm'}`}>
          {msg.content}
        </div>
        <button
          onClick={copy}
          className="opacity-0 group-hover:opacity-100 self-end text-slate-600 hover:text-slate-400 transition-all"
          title="Copy"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>
    </div>
  )
}

export default function AITutor() {
  const { settings, updateSettings } = useData()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your Olympiad AI Tutor 🎯\n\nI can help you with problem-solving strategies, concept explanations, and competition prep for AMC, AIME, USAMO, USAPhO, USABO, and more. What would you like to work on today?",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [tempKey, setTempKey] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(text) {
    const content = text || input.trim()
    if (!content || loading) return

    if (!settings.anthropicKey) {
      setShowKeyInput(true)
      return
    }

    setInput('')
    const userMsg = { role: 'user', content }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setLoading(true)

    try {
      const client = new Anthropic({
        apiKey: settings.anthropicKey,
        dangerouslyAllowBrowser: true,
      })

      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
      })

      const assistantMsg = { role: 'assistant', content: response.content[0].text }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (err) {
      const errText = err.status === 401
        ? '❌ Invalid API key. Please check your Anthropic API key in Settings.'
        : err.status === 429
        ? '⚠️ Rate limited. Please wait a moment before sending another message.'
        : `❌ Error: ${err.message || 'Failed to get response.'}`
      setMessages((prev) => [...prev, { role: 'assistant', content: errText }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function saveKey() {
    updateSettings({ anthropicKey: tempKey.trim() })
    setShowKeyInput(false)
    setTempKey('')
  }

  function clearChat() {
    setMessages([{
      role: 'assistant',
      content: "Chat cleared! I'm ready to help with any olympiad topic. What would you like to study?",
    }])
  }

  return (
    <div className="flex flex-col h-screen max-h-screen p-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-400" /> AI Tutor
          </h1>
          <p className="text-slate-400 text-sm">Expert help for AMC, AIME, USAMO, USAPhO, USABO & more</p>
        </div>
        <div className="flex gap-2">
          <button onClick={clearChat} className="btn-secondary flex items-center gap-2 text-sm py-2">
            <RotateCcw className="w-4 h-4" /> Clear
          </button>
          <button onClick={() => setShowKeyInput(true)} className="btn-secondary flex items-center gap-2 text-sm py-2">
            <Settings className="w-4 h-4" /> API Key
          </button>
        </div>
      </div>

      {/* API Key banner */}
      {!settings.anthropicKey && (
        <div className="mb-4 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-amber-400 font-medium text-sm">Anthropic API Key Required</p>
            <p className="text-amber-600 text-xs mt-0.5">Add your API key to start chatting with the AI tutor</p>
          </div>
          <button onClick={() => setShowKeyInput(true)} className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 px-4 py-2 rounded-xl text-sm font-medium transition-all">
            Add Key
          </button>
        </div>
      )}

      {/* API Key Modal */}
      {showKeyInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-space-800 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-white font-bold text-lg mb-2">Anthropic API Key</h3>
            <p className="text-slate-400 text-sm mb-4">
              Your key is stored locally in your browser and never sent to our servers.
              Get a key at <span className="text-violet-400">console.anthropic.com</span>.
            </p>
            <input
              className="input-field mb-4 font-mono text-sm"
              type="password"
              placeholder="sk-ant-..."
              value={tempKey || settings.anthropicKey}
              onChange={(e) => setTempKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveKey()}
            />
            <div className="flex gap-3">
              <button onClick={() => setShowKeyInput(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={saveKey} className="btn-primary flex-1">Save Key</button>
            </div>
          </div>
        </div>
      )}

      {/* Quick prompts */}
      <div className="flex gap-2 flex-wrap mb-4">
        {QUICK_PROMPTS.map(({ label, prompt }) => (
          <button
            key={label}
            onClick={() => sendMessage(prompt)}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-full bg-space-700 border border-white/8 text-slate-400 hover:text-violet-300 hover:border-violet-500/30 hover:bg-violet-500/10 transition-all disabled:opacity-40"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 min-h-0 pr-1">
        {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-space-600 border border-white/10 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-violet-400" />
            </div>
            <div className="chat-bubble-ai px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1 items-center h-5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            className="input-field resize-none pr-4 min-h-[52px] max-h-32 leading-relaxed"
            rows={1}
            placeholder="Ask anything about olympiad math, physics, biology, chemistry, CS…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ height: 'auto' }}
            onInput={(e) => {
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
            }}
          />
        </div>
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="btn-primary px-4 self-end shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <p className="text-center text-slate-700 text-xs mt-2">Press Enter to send · Shift+Enter for new line</p>
    </div>
  )
}
