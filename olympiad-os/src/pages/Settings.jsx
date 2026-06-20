import { useAuth } from '../contexts/AuthContext'
import { Settings as SettingsIcon, User, Shield } from 'lucide-react'

export default function Settings() {
  const { user } = useAuth()

  return (
    <div className="p-8 max-w-2xl animate-slide-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
          <SettingsIcon className="w-7 h-7 text-violet-400" /> Settings
        </h1>
        <p className="text-slate-400">Manage your account</p>
      </div>

      <div className="glass-card p-6 mb-4">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2"><User className="w-4 h-4 text-violet-400" /> Profile</h2>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
            {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="text-white font-semibold">{user?.displayName || 'Student'}</p>
            <p className="text-slate-400 text-sm">{user?.email}</p>
            <p className="text-slate-600 text-xs mt-0.5">
              {user?.providerData?.[0]?.providerId === 'google.com' ? '🔵 Google account' : '📧 Email account'}
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-white font-semibold mb-2 flex items-center gap-2"><Shield className="w-4 h-4 text-violet-400" /> Privacy & Data</h2>
        <p className="text-slate-400 text-sm">
          All your study data (problems, sessions, plans) is stored locally in your browser using localStorage.
          It's private to your device and browser. The AI Tutor routes messages through our secure server — your conversations are never stored.
        </p>
      </div>
    </div>
  )
}
