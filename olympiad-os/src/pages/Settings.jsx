import { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import { Settings as SettingsIcon, Key, User, Shield, Check } from 'lucide-react'

export default function Settings() {
  const { settings, updateSettings } = useData()
  const { user } = useAuth()
  const [apiKey, setApiKey] = useState(settings.anthropicKey || '')
  const [saved, setSaved] = useState(false)

  function save() {
    updateSettings({ anthropicKey: apiKey.trim() })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-8 max-w-2xl animate-slide-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
          <SettingsIcon className="w-7 h-7 text-violet-400" /> Settings
        </h1>
        <p className="text-slate-400">Manage your account and AI settings</p>
      </div>

      {/* Profile */}
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

      {/* AI Settings */}
      <div className="glass-card p-6 mb-4">
        <h2 className="text-white font-semibold mb-2 flex items-center gap-2"><Key className="w-4 h-4 text-violet-400" /> AI Tutor — Anthropic API Key</h2>
        <p className="text-slate-400 text-sm mb-4">
          Your API key is stored only in your browser's localStorage. It's never sent to our servers.
          Get a key at <span className="text-violet-400 font-medium">console.anthropic.com</span>.
        </p>
        <div className="flex gap-3">
          <input
            type="password"
            className="input-field flex-1 font-mono text-sm"
            placeholder="sk-ant-api03-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && save()}
          />
          <button onClick={save} className={`btn-primary flex items-center gap-2 shrink-0 ${saved ? 'bg-emerald-600 hover:bg-emerald-500' : ''}`}>
            {saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save Key'}
          </button>
        </div>
        {settings.anthropicKey && (
          <p className="text-emerald-400 text-xs mt-2 flex items-center gap-1">
            <Check className="w-3 h-3" /> API key configured — AI Tutor is ready
          </p>
        )}
      </div>

      {/* Privacy */}
      <div className="glass-card p-6">
        <h2 className="text-white font-semibold mb-2 flex items-center gap-2"><Shield className="w-4 h-4 text-violet-400" /> Privacy & Data</h2>
        <p className="text-slate-400 text-sm">
          All your study data (problems, sessions, plans) is stored locally in your browser using localStorage.
          It's private to your device and browser. No data is sent to external servers except when using the AI Tutor,
          which sends your messages directly to Anthropic using your API key.
        </p>
      </div>
    </div>
  )
}
