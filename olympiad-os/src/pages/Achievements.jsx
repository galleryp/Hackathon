import { useData } from '../contexts/DataContext'
import { Trophy, Lock } from 'lucide-react'

const LEVEL_TITLES = [
  { level: 1, title: 'Novice', xp: 0, desc: 'Just getting started', color: 'text-slate-400' },
  { level: 2, title: 'Apprentice', xp: 100, desc: 'Learning the basics', color: 'text-green-400' },
  { level: 3, title: 'Scholar', xp: 300, desc: 'Building knowledge', color: 'text-blue-400' },
  { level: 4, title: 'Competitor', xp: 700, desc: 'Ready for competition', color: 'text-cyan-400' },
  { level: 5, title: 'Expert', xp: 1500, desc: 'Consistently strong', color: 'text-violet-400' },
  { level: 6, title: 'Master', xp: 3000, desc: 'Top-tier competitor', color: 'text-amber-400' },
  { level: 7, title: 'Grandmaster', xp: 6000, desc: 'National-level talent', color: 'text-orange-400' },
  { level: 8, title: 'Olympian', xp: 12000, desc: 'Elite status', color: 'text-red-400' },
]

export default function Achievements() {
  const { earnedBadges, BADGES, xp, levelInfo, streak, solvedProblems } = useData()

  const earned = BADGES.filter((b) => earnedBadges.includes(b.id))
  const locked = BADGES.filter((b) => !earnedBadges.includes(b.id))

  return (
    <div className="p-8 space-y-8 animate-slide-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Achievements</h1>
        <p className="text-slate-400">Track your progress and unlock badges as you study</p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Badges Earned', value: `${earned.length}/${BADGES.length}`, icon: '🏅' },
          { label: 'Total XP', value: xp.toLocaleString(), icon: '⚡' },
          { label: 'Current Level', value: `${levelInfo.level} — ${levelInfo.title}`, icon: '⭐' },
          { label: 'Longest Streak', value: `${streak.count} days`, icon: '🔥' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="glass-card p-5 text-center">
            <span className="text-3xl">{icon}</span>
            <p className="text-white font-bold text-xl mt-2">{value}</p>
            <p className="text-slate-500 text-sm mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Level progression */}
      <div className="glass-card p-6">
        <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-violet-400" /> Level Progression
        </h2>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-space-600" />
          <div className="space-y-4">
            {LEVEL_TITLES.map((l) => {
              const reached = xp >= l.xp
              const current = levelInfo.level === l.level
              return (
                <div key={l.level} className={`flex items-center gap-4 relative pl-14 ${!reached ? 'opacity-40' : ''}`}>
                  <div className={`absolute left-3.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold ${current ? 'border-violet-500 bg-violet-600 text-white' : reached ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-slate-700 bg-space-700 text-slate-600'}`}>
                    {reached && !current ? '✓' : l.level}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${current ? 'text-violet-400' : reached ? l.color : 'text-slate-600'}`}>{l.title}</span>
                      {current && <span className="text-xs bg-violet-500/20 text-violet-400 border border-violet-500/30 px-2 py-0.5 rounded-full">Current</span>}
                      <span className="text-slate-600 text-xs">{l.xp.toLocaleString()} XP</span>
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5">{l.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Badges */}
      {earned.length > 0 && (
        <div>
          <h2 className="text-white font-bold text-lg mb-4">🏅 Earned Badges ({earned.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {earned.map((badge) => (
              <div key={badge.id} className="glass-card p-4 flex items-center gap-4 border border-violet-500/20 bg-violet-500/5">
                <span className="text-4xl">{badge.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold">{badge.name}</p>
                  <p className="text-slate-400 text-sm">{badge.desc}</p>
                </div>
                <span className="text-violet-400 text-sm font-bold shrink-0">+{badge.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked badges */}
      <div>
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-slate-500" /> Locked Badges ({locked.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {locked.map((badge) => (
            <div key={badge.id} className="glass-card p-4 flex items-center gap-4 opacity-50">
              <span className="text-4xl grayscale">{badge.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-slate-300 font-semibold">{badge.name}</p>
                <p className="text-slate-500 text-sm">{badge.desc}</p>
              </div>
              <span className="text-slate-600 text-sm font-bold shrink-0">+{badge.xp} XP</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
