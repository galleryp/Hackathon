import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import {
  LayoutDashboard, CheckSquare, Brain, Calendar,
  BookOpen, ClipboardList, Trophy, LogOut, Settings, Zap,
} from 'lucide-react'

const NAV = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/problems', icon: CheckSquare, label: 'Problems' },
  { path: '/tutor', icon: Brain, label: 'AI Tutor' },
  { path: '/calendar', icon: Calendar, label: 'Calendar' },
  { path: '/plans', icon: ClipboardList, label: 'Study Plans' },
  { path: '/reference', icon: BookOpen, label: 'Reference' },
  { path: '/achievements', icon: Trophy, label: 'Achievements' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { xp, levelInfo, streak, earnedBadges, BADGES } = useData()
  const navigate = useNavigate()
  const loc = useLocation()

  const xpInLevel = xp - [0, 0, 100, 300, 700, 1500, 3000, 6000][levelInfo.level] || 0
  const xpForLevel = (levelInfo.nextXP === Infinity ? xp + 1 : levelInfo.nextXP) - [0, 0, 100, 300, 700, 1500, 3000, 6000][levelInfo.level] || 1
  const pct = Math.min(100, (xpInLevel / xpForLevel) * 100)

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col bg-space-900 border-r border-white/5 overflow-y-auto">
      {/* Logo */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/30">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-base leading-tight">Olympiad OS</p>
            <p className="text-violet-400 text-xs font-medium">Study Platform</p>
          </div>
        </div>
      </div>

      {/* User card */}
      <div className="p-4 border-b border-white/5">
        <div className="glass-card p-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{user?.displayName || 'Student'}</p>
              <p className="text-violet-400 text-xs font-medium">Lv.{levelInfo.level} {levelInfo.title}</p>
            </div>
            {streak.count > 0 && (
              <div className="ml-auto flex items-center gap-1 text-orange-400 text-sm font-bold">
                <span className="streak-fire">🔥</span>
                <span>{streak.count}</span>
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-violet-400" />{xp.toLocaleString()} XP</span>
              <span>{levelInfo.nextXP === Infinity ? '🏆 Max' : `${levelInfo.nextXP.toLocaleString()} XP`}</span>
            </div>
            <div className="h-1.5 bg-space-700 rounded-full overflow-hidden">
              <div className="h-full xp-bar-fill rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ path, icon: Icon, label }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`w-full ${loc.pathname === path ? 'nav-item-active' : 'nav-item'}`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-white/5 space-y-1">
        <button onClick={() => navigate('/settings')} className="nav-item w-full">
          <Settings className="w-4 h-4" />
          Settings
        </button>
        <button onClick={logout} className="nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
