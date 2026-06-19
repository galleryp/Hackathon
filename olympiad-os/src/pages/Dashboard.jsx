import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { CheckCircle2, TrendingUp, Zap, Target, BookOpen, ArrowRight, Star, Award } from 'lucide-react'
import { format, subDays } from 'date-fns'

export default function Dashboard() {
  const { user } = useAuth()
  const { problems, xp, levelInfo, streak, earnedBadges, BADGES, solvedProblems, calendarEvents } = useData()
  const navigate = useNavigate()

  const firstName = user?.displayName?.split(' ')[0] || 'Student'

  // Last 7 days activity
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    const dayStr = format(date, 'yyyy-MM-dd')
    const count = problems.filter((p) => p.solved && p.createdAt?.startsWith(dayStr)).length
    return { day: format(date, 'EEE'), count }
  })

  // By olympiad breakdown
  const byOlympiad = {}
  solvedProblems.forEach((p) => {
    byOlympiad[p.olympiad] = (byOlympiad[p.olympiad] || 0) + 1
  })
  const olympiadData = Object.entries(byOlympiad)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }))

  const DIFF_COLORS = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444', insane: '#8b5cf6' }
  const byDiff = { easy: 0, medium: 0, hard: 0, insane: 0 }
  solvedProblems.forEach((p) => { byDiff[p.difficulty] = (byDiff[p.difficulty] || 0) + 1 })

  const xpInLevel = xp - [0, 0, 100, 300, 700, 1500, 3000, 6000][levelInfo.level] || 0
  const xpForLevel = (levelInfo.nextXP === Infinity ? xp + 1 : levelInfo.nextXP) - [0, 0, 100, 300, 700, 1500, 3000, 6000][levelInfo.level] || 1
  const pct = Math.min(100, (xpInLevel / xpForLevel) * 100)

  const upcomingEvents = calendarEvents
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3)

  const recentBadges = earnedBadges.slice(-3).map((id) => BADGES.find((b) => b.id === id)).filter(Boolean)

  const STAT_CARDS = [
    { label: 'Problems Solved', value: solvedProblems.length, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', sub: `of ${problems.length} logged` },
    { label: 'Total XP', value: xp.toLocaleString(), icon: Zap, color: 'text-violet-400', bg: 'bg-violet-500/10', sub: `Level ${levelInfo.level} ${levelInfo.title}` },
    { label: 'Day Streak', value: streak.count, icon: Star, color: 'text-orange-400', bg: 'bg-orange-500/10', sub: streak.count >= 1 ? 'Keep it up!' : 'Solve today!' },
    { label: 'Badges Earned', value: earnedBadges.length, icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/10', sub: `of ${BADGES.length} total` },
  ]

  return (
    <div className="p-8 space-y-8 animate-slide-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            Welcome back, <span className="text-violet-400">{firstName}</span> 👋
          </h1>
          <p className="text-slate-400">
            {solvedProblems.length === 0
              ? "Let's get started — log your first problem!"
              : `You've solved ${solvedProblems.length} problem${solvedProblems.length !== 1 ? 's' : ''} so far. Keep grinding!`}
          </p>
        </div>
        <button onClick={() => navigate('/problems')} className="btn-primary flex items-center gap-2">
          <Target className="w-4 h-4" /> Log Problem
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, bg, sub }) => (
          <div key={label} className="glass-card p-5 hover:border-white/10 transition-all duration-200">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
            <p className="text-slate-400 text-sm font-medium">{label}</p>
            <p className="text-slate-600 text-xs mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* XP Progress */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-white font-semibold">Level {levelInfo.level} — {levelInfo.title}</p>
            <p className="text-slate-400 text-sm">{xpInLevel} / {levelInfo.nextXP === Infinity ? '∞' : xpForLevel} XP to next level</p>
          </div>
          <span className="text-violet-400 font-mono text-lg font-bold">{Math.round(pct)}%</span>
        </div>
        <div className="h-3 bg-space-700 rounded-full overflow-hidden">
          <div className="h-full xp-bar-fill rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Activity chart */}
        <div className="glass-card p-5 xl:col-span-2">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-violet-400" /> Problems This Week
          </h3>
          {last7.some((d) => d.count > 0) ? (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={last7} barSize={28}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis hide allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#10101e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#e2e8f0' }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex flex-col items-center justify-center text-slate-500">
              <BookOpen className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm">No problems yet this week</p>
              <button onClick={() => navigate('/problems')} className="mt-3 text-violet-400 text-sm flex items-center gap-1 hover:underline">
                Log your first <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* By difficulty */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4">By Difficulty</h3>
          <div className="space-y-3">
            {Object.entries(byDiff).map(([diff, count]) => (
              <div key={diff}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize text-slate-400">{diff}</span>
                  <span className="text-white font-medium">{count}</span>
                </div>
                <div className="h-2 bg-space-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: solvedProblems.length ? `${(count / solvedProblems.length) * 100}%` : '0%',
                      backgroundColor: DIFF_COLORS[diff],
                    }}
                  />
                </div>
              </div>
            ))}
            {solvedProblems.length === 0 && (
              <p className="text-slate-600 text-sm text-center py-4">No problems logged yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top olympiads */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-violet-400" /> Top Competitions
          </h3>
          {olympiadData.length > 0 ? (
            <div className="space-y-3">
              {olympiadData.map(({ name, count }, i) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="text-slate-600 text-sm w-5 font-mono">{i + 1}.</span>
                  <span className="text-slate-300 text-sm flex-1 font-medium">{name}</span>
                  <span className="text-violet-400 text-sm font-bold">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 text-sm text-center py-6">Log problems to see your breakdown</p>
          )}
        </div>

        {/* Upcoming events */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              📅 Upcoming Sessions
            </h3>
            <button onClick={() => navigate('/calendar')} className="text-violet-400 text-sm hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map((ev) => (
                <div key={ev.id} className="flex items-center gap-3 p-3 bg-space-700 rounded-xl border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-violet-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{ev.title}</p>
                    <p className="text-slate-500 text-xs">{format(new Date(ev.date), 'MMM d, yyyy')}{ev.time ? ` · ${ev.time}` : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-slate-600 text-sm mb-3">No upcoming sessions</p>
              <button onClick={() => navigate('/calendar')} className="text-violet-400 text-sm flex items-center gap-1 mx-auto hover:underline">
                Add to calendar <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent badges */}
      {recentBadges.length > 0 && (
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">🏅 Recently Unlocked</h3>
            <button onClick={() => navigate('/achievements')} className="text-violet-400 text-sm hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex gap-4 flex-wrap">
            {recentBadges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-3 bg-space-700 border border-violet-500/20 px-4 py-3 rounded-xl">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <p className="text-white text-sm font-semibold">{badge.name}</p>
                  <p className="text-slate-500 text-xs">{badge.desc}</p>
                </div>
                <span className="text-violet-400 text-xs font-bold ml-2">+{badge.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Log Problem', icon: '✏️', path: '/problems' },
          { label: 'Ask AI Tutor', icon: '🤖', path: '/tutor' },
          { label: 'View Plans', icon: '📋', path: '/plans' },
          { label: 'Reference Sheets', icon: '📚', path: '/reference' },
        ].map(({ label, icon, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className="glass-card p-4 flex items-center gap-3 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-200 group"
          >
            <span className="text-xl">{icon}</span>
            <span className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">{label}</span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 ml-auto transition-colors" />
          </button>
        ))}
      </div>
    </div>
  )
}
