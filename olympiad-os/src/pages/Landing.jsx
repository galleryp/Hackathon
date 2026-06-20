import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Eye, EyeOff, AlertCircle, Check } from 'lucide-react'

const STATS = [
  { value: '250K+', label: 'Active Students' },
  { value: '1M+', label: 'Problems Solved' },
  { value: '∞', label: 'Problems Available' },
  { value: '12+', label: 'Competitions Covered' },
]

const FEATURES = [
  { icon: '🏆', title: 'Problem Tracker', desc: 'Log every problem. Earn XP. Level up.' },
  { icon: '🤖', title: 'AI Tutor', desc: 'Instant expert help, any topic, any time.' },
  { icon: '📅', title: 'Study Calendar', desc: 'Never miss a deadline again.' },
  { icon: '📚', title: 'Reference Sheets', desc: 'Every formula you need, instantly.' },
  { icon: '📋', title: 'Study Plans', desc: 'Week-by-week roadmaps to the podium.' },
  { icon: '🎖️', title: 'Achievements', desc: 'Badges, streaks, and glory await.' },
]

const COMPETITIONS = ['AMC 8', 'AMC 10/12', 'AIME', 'USAMO', 'USAJMO', 'USAPhO', 'F=ma', 'USABO', 'USNCO', 'USACO', 'Science Olympiad', 'MATHCOUNTS', 'HMMT', 'PUMAC', 'IBO', 'IChO']

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start || typeof target !== 'number') return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return count
}

function StatCard({ value, label, animate }) {
  const isNumber = /^[\d,]+/.test(value)
  const numericValue = isNumber ? parseInt(value.replace(/[^0-9]/g, '')) : null
  const suffix = isNumber ? value.replace(/^[\d,]+/, '') : ''
  const count = useCountUp(numericValue, 2000, animate)

  const display = numericValue !== null
    ? count.toLocaleString() + suffix
    : value

  return (
    <div className="text-center group">
      <div className="relative inline-block">
        <div className="text-4xl md:text-5xl font-black text-white mb-1 tracking-tight group-hover:text-violet-300 transition-colors duration-300">
          {display}
        </div>
        <div className="absolute -inset-4 bg-violet-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
      </div>
      <div className="text-slate-400 text-sm font-medium tracking-wide uppercase">{label}</div>
    </div>
  )
}

function TrophyScene({ scrollY }) {
  const rotate = scrollY * 0.15
  const float = Math.sin(Date.now() / 1500) * 8

  return (
    <div
      className="relative w-48 h-48 md:w-64 md:h-64 mx-auto"
      style={{ transform: `rotateY(${rotate}deg)`, transition: 'transform 0.1s linear' }}
    >
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-violet-500/10 blur-3xl animate-pulse" />
      {/* Rotating ring */}
      <div
        className="absolute inset-4 rounded-full border border-violet-500/30"
        style={{ transform: `rotateZ(${rotate * 2}deg)`, borderStyle: 'dashed' }}
      />
      <div
        className="absolute inset-8 rounded-full border border-blue-500/20"
        style={{ transform: `rotateZ(${-rotate * 1.5}deg)`, borderStyle: 'dashed' }}
      />
      {/* Trophy emoji */}
      <div
        className="absolute inset-0 flex items-center justify-center text-7xl md:text-8xl select-none"
        style={{ filter: 'drop-shadow(0 0 30px rgba(124,58,237,0.6))' }}
      >
        🏆
      </div>
      {/* Orbiting dots */}
      {[0, 120, 240].map((deg, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-violet-400"
          style={{
            top: '50%',
            left: '50%',
            transform: `rotate(${deg + rotate * 3}deg) translateX(80px) translateY(-50%)`,
            boxShadow: '0 0 8px rgba(167,139,250,0.8)',
          }}
        />
      ))}
    </div>
  )
}

export default function Landing() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef(null)
  const animFrameRef = useRef(null)
  const { login, signup, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        animFrameRef.current = requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        if (!name.trim()) { setError('Please enter your name'); setLoading(false); return }
        await signup(email, password, name)
      }
      navigate('/dashboard')
    } catch (err) {
      const msgs = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/email-already-in-use': 'Email already in use.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/invalid-email': 'Invalid email address.',
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/network-request-failed': 'Network error. Check your connection.',
        'auth/configuration-not-found': 'Firebase not configured. See .env.example to set up.',
      }
      setError(msgs[err.code] || err.message || 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
      navigate('/dashboard')
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.code === 'auth/configuration-not-found'
          ? 'Firebase not configured. See .env.example to set up.'
          : 'Google sign-in failed. Please try email/password.')
      }
    } finally {
      setLoading(false)
    }
  }

  const heroOpacity = Math.max(0, 1 - scrollY / 600)
  const heroTranslate = scrollY * 0.3

  return (
    <div className="min-h-screen bg-space-950 overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-violet-600/6 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/6 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-violet-900/5 blur-[160px]" />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/40">
            <span className="text-lg">🏆</span>
          </div>
          <span className="text-xl font-black text-white tracking-tight">Olympiad <span className="text-violet-400">OS</span></span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 bg-white/3 border border-white/8 rounded-2xl px-3 py-2">
          {COMPETITIONS.slice(0, 8).map((c) => (
            <span key={c} className="text-xs px-2.5 py-1 rounded-lg text-slate-500 hover:text-slate-300 transition-colors cursor-default">{c}</span>
          ))}
          <span className="text-xs px-2.5 py-1 rounded-lg text-violet-400 font-semibold">+{COMPETITIONS.length - 8} more</span>
        </div>
      </nav>

      {/* Hero section */}
      <section
        className="relative z-10 min-h-screen flex items-center"
        style={{ opacity: heroOpacity, transform: `translateY(${heroTranslate}px)` }}
      >
        <div className="max-w-7xl mx-auto px-8 w-full flex flex-col lg:flex-row items-center gap-16 py-16">
          {/* Left */}
          <div className="flex-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-semibold mb-8 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              The #1 Olympiad Prep Platform
            </div>

            <h1 className="text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
              Study Smarter.<br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #a78bfa 0%, #818cf8 50%, #60a5fa 100%)' }}
              >
                Compete Better.
              </span>
            </h1>

            <p className="text-slate-400 text-xl leading-relaxed mb-10 max-w-lg">
              The all-in-one platform for AMC, AIME, USAMO, USAPhO, USABO, and every olympiad in between. Track problems, get AI tutoring, and follow structured plans to reach the top.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              {['No credit card', 'Free forever', 'AI-powered'].map((tag) => (
                <div key={tag} className="flex items-center gap-2 text-slate-400 text-sm">
                  <Check className="w-4 h-4 text-emerald-400" />
                  {tag}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {FEATURES.map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="group relative p-4 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/5 hover:border-violet-500/30 transition-all duration-300 cursor-default overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="text-2xl mb-2 block">{icon}</span>
                  <p className="text-white text-sm font-semibold mb-0.5">{title}</p>
                  <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Auth */}
          <div className="w-full max-w-md shrink-0">
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(16,16,30,0.95) 60%)', border: '1px solid rgba(167,139,250,0.2)', boxShadow: '0 0 60px rgba(124,58,237,0.15), inset 0 1px 0 rgba(255,255,255,0.08)' }}
            >
              {/* Top accent line */}
              <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.6), transparent)' }} />

              <div className="p-8">
                <div className="flex gap-1 mb-7 bg-black/20 rounded-2xl p-1 border border-white/5">
                  {['login', 'signup'].map((m) => (
                    <button
                      key={m}
                      onClick={() => { setMode(m); setError('') }}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${mode === m ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {m === 'login' ? 'Sign In' : 'Sign Up'}
                    </button>
                  ))}
                </div>

                {error && (
                  <div className="mb-5 flex items-start gap-3 bg-red-500/10 border border-red-500/25 rounded-2xl px-4 py-3 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">Full Name</label>
                      <input className="input-field" placeholder="Ada Lovelace" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">Email</label>
                    <input type="email" className="input-field" placeholder="ada@math.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">Password</label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        className="input-field pr-12"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}
                  >
                    {loading ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : null}
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                    {!loading && <ChevronRight className="w-4 h-4" />}
                  </button>
                </form>

                <div className="my-5 flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/6" />
                  <span className="text-slate-600 text-xs font-medium">or</span>
                  <div className="flex-1 h-px bg-white/6" />
                </div>

                <button
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-white/10 bg-white/3 hover:bg-white/6 hover:border-white/20 text-slate-300 font-semibold text-sm transition-all duration-200 disabled:opacity-60 active:scale-95"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trophy + Stats section */}
      <section ref={statsRef} className="relative z-10 py-32 px-8">
        <div className="max-w-5xl mx-auto">
          {/* Section label */}
          <p className="text-center text-violet-400 text-xs font-bold tracking-[0.3em] uppercase mb-16">Trusted by the best</p>

          {/* Trophy */}
          <div className="mb-20">
            <TrophyScene scrollY={scrollY} />
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {STATS.map(({ value, label }) => (
              <StatCard key={label} value={value} label={label} animate={statsVisible} />
            ))}
          </div>

          {/* Divider */}
          <div className="mt-20 h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.2), transparent)' }} />
        </div>
      </section>

      {/* Competition belt */}
      <section className="relative z-10 py-16 overflow-hidden">
        <div className="flex gap-3 animate-marquee whitespace-nowrap">
          {[...COMPETITIONS, ...COMPETITIONS, ...COMPETITIONS].map((c, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/8 bg-white/2 text-slate-400 text-sm font-medium shrink-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* Features deep-dive */}
      <section className="relative z-10 py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-400 text-xs font-bold tracking-[0.3em] uppercase mb-4">Everything you need</p>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Built for Olympiad Champions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '🎯', title: 'XP & Leveling', desc: 'Every problem solved earns XP. Rise from Novice to Olympian across 8 levels.', accent: 'violet' },
              { icon: '🔥', title: 'Streaks & Badges', desc: 'Build daily habits with streaks. Unlock 10 exclusive badges as you hit milestones.', accent: 'orange' },
              { icon: '🤖', title: 'AI Tutor', desc: 'Powered by Claude — get expert explanations, strategies, and hints instantly.', accent: 'blue' },
              { icon: '📊', title: 'Progress Analytics', desc: 'See your stats by difficulty, competition, and topic. Know exactly where to improve.', accent: 'emerald' },
              { icon: '📚', title: 'Reference Library', desc: '200+ formulas across Math, Physics, Biology, Chemistry, and CS. All searchable.', accent: 'amber' },
              { icon: '🗓️', title: 'Smart Calendar', desc: 'Built-in 2024-25 competition dates, plus a personal study planner.', accent: 'pink' },
            ].map(({ icon, title, desc, accent }) => (
              <div
                key={title}
                className="group relative p-6 rounded-3xl border border-white/5 bg-white/2 hover:border-white/10 hover:bg-white/4 transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 bg-${accent}-500`} />
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24 px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="relative p-12 rounded-3xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(37,99,235,0.1))', border: '1px solid rgba(167,139,250,0.2)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent" />
            <div className="relative">
              <div className="text-5xl mb-6">🚀</div>
              <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Ready to reach the top?</h2>
              <p className="text-slate-400 mb-8 text-lg">Join thousands of students already using Olympiad OS to sharpen their skills and earn their place on the podium.</p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white transition-all duration-200 active:scale-95 hover:shadow-2xl hover:shadow-violet-600/30"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 24px rgba(124,58,237,0.4)' }}
              >
                Get Started Free <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-slate-600 text-sm">
          <span className="font-bold text-slate-500">Olympiad <span className="text-violet-500">OS</span></span>
          <span>Built for competitors. By competitors.</span>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  )
}
