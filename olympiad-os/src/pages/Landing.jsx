import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Trophy, Zap, Brain, Calendar, BookOpen, Star, ChevronRight, Eye, EyeOff, AlertCircle } from 'lucide-react'

const FEATURES = [
  { icon: Trophy, title: 'Problem Tracker', desc: 'Log every problem you solve with difficulty, topic, and notes. Earn XP and level up.' },
  { icon: Brain, title: 'AI Tutor', desc: 'Get instant help from an AI trained on olympiad strategies across all subjects.' },
  { icon: Calendar, title: 'Study Calendar', desc: 'Plan your sessions, set goals, and never miss a competition deadline.' },
  { icon: BookOpen, title: 'Reference Sheets', desc: 'Curated formulas and concepts for Math, Physics, Chemistry, Biology, and CS.' },
  { icon: Zap, title: 'Study Plans', desc: 'Structured plans for AMC, AIME, USAPhO, USABO, and more.' },
  { icon: Star, title: 'Achievements', desc: 'Unlock badges, maintain streaks, and track your journey to the olympiad.' },
]

const COMPETITIONS = ['AMC 8', 'AMC 10/12', 'AIME', 'USAMO', 'USAJMO', 'USAPhO', 'F=ma', 'USABO', 'USNCO', 'USACO', 'Science Olympiad', 'MATHCOUNTS']

export default function Landing() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, signup, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

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

  return (
    <div className="min-h-screen stars-bg flex flex-col">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-violet-600/8 blur-3xl animate-float" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-blue-600/8 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Olympiad <span className="text-violet-400">OS</span></span>
        </div>
        <div className="hidden md:flex items-center gap-2">
          {COMPETITIONS.slice(0, 6).map((c) => (
            <span key={c} className="text-xs px-3 py-1 rounded-full bg-white/5 text-slate-400 border border-white/8">{c}</span>
          ))}
          <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-slate-400 border border-white/8">+{COMPETITIONS.length - 6} more</span>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16 max-w-7xl mx-auto w-full px-8 py-16 flex-1">
        {/* Left — Hero */}
        <div className="flex-1 max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600/15 border border-violet-500/30 text-violet-300 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            The operating system for olympiad prep
          </div>

          <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-5">
            Study Smarter.<br />
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Compete Better.</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Track problems, earn XP, get AI-powered help, and follow structured study plans — all in one place for AMC, AIME, USAMO, USAPhO, USABO, and more.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card p-4 group hover:border-violet-500/30 transition-all duration-200">
                <Icon className="w-5 h-5 text-violet-400 mb-2" />
                <p className="text-white text-sm font-semibold mb-1">{title}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 text-slate-500 text-sm">
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Gamified XP system</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-violet-400" /> AI-powered tutor</span>
            <span className="flex items-center gap-1.5"><Trophy className="w-4 h-4 text-emerald-400" /> 12+ competitions</span>
          </div>
        </div>

        {/* Right — Auth form */}
        <div className="w-full max-w-md">
          <div className="glass-card glow-border p-8">
            <div className="flex gap-1 mb-8 bg-space-900 rounded-xl p-1">
              <button
                onClick={() => { setMode('login'); setError('') }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === 'login' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25' : 'text-slate-400 hover:text-white'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMode('signup'); setError('') }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === 'signup' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25' : 'text-slate-400 hover:text-white'}`}
              >
                Sign Up
              </button>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm text-slate-400 mb-2 font-medium">Full Name</label>
                  <input
                    className="input-field"
                    placeholder="Ada Lovelace"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm text-slate-400 mb-2 font-medium">Email</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="ada@math.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2 font-medium">Password</label>
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
                className="btn-primary w-full flex items-center justify-center gap-2 mt-2 shadow-lg shadow-violet-600/25 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : null}
                {mode === 'login' ? 'Sign In' : 'Create Account'}
                {!loading && <ChevronRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-slate-500 text-xs">or continue with</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            <button
              onClick={handleGoogle}
              disabled={loading}
              className="btn-secondary w-full flex items-center justify-center gap-3 disabled:opacity-60"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-slate-600 text-xs mt-5">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
