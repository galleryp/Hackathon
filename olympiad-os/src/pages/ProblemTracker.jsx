import { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { Plus, Search, Filter, CheckCircle2, Circle, Trash2, ExternalLink, ChevronDown, X, Zap } from 'lucide-react'
import { format } from 'date-fns'

const DIFFICULTIES = ['easy', 'medium', 'hard', 'insane']
const DIFF_LABELS = { easy: '1-2', medium: '3-5', hard: '6-8', insane: '9-10' }

function DiffBadge({ diff }) {
  const cls = { easy: 'diff-easy', medium: 'diff-medium', hard: 'diff-hard', insane: 'diff-insane' }
  return <span className={`badge ${cls[diff]}`}>{diff} <span className="opacity-60">({DIFF_LABELS[diff]})</span></span>
}

function ProblemModal({ onClose, onSave, OLYMPIADS, TOPICS }) {
  const [form, setForm] = useState({
    title: '', olympiad: 'AMC 10A', year: '', number: '',
    difficulty: 'medium', topic: '', subtopic: '',
    solved: false, timeMin: '', notes: '', url: '',
  })

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  function handleSave() {
    if (!form.title.trim()) return
    onSave({ ...form, year: form.year || new Date().getFullYear().toString() })
  }

  const topicOptions = Object.keys(TOPICS)
  const subtopics = form.topic ? TOPICS[form.topic] || [] : []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-space-800 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl animate-slide-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-space-800 z-10">
          <h2 className="text-white font-bold text-lg">Log Problem</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2 font-medium">Problem Title / Description *</label>
            <input className="input-field" placeholder="e.g. AMC 2024 #20 — Sum of digits problem" value={form.title} onChange={(e) => set('title', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-400 mb-2 font-medium">Competition</label>
              <select className="input-field" value={form.olympiad} onChange={(e) => set('olympiad', e.target.value)}>
                {OLYMPIADS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2 font-medium">Year</label>
              <input className="input-field" placeholder="2024" value={form.year} onChange={(e) => set('year', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-400 mb-2 font-medium">Problem #</label>
              <input className="input-field" placeholder="20" value={form.number} onChange={(e) => set('number', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2 font-medium">Time Spent (min)</label>
              <input type="number" className="input-field" placeholder="15" value={form.timeMin} onChange={(e) => set('timeMin', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2 font-medium">Difficulty</label>
            <div className="grid grid-cols-4 gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => set('difficulty', d)}
                  className={`py-2 px-3 rounded-xl text-sm font-medium border transition-all duration-150 ${form.difficulty === d
                    ? d === 'easy' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                    : d === 'medium' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                    : d === 'hard' ? 'bg-red-500/20 border-red-500/50 text-red-400'
                    : 'bg-violet-500/20 border-violet-500/50 text-violet-400'
                    : 'border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/20'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-400 mb-2 font-medium">Subject</label>
              <select className="input-field" value={form.topic} onChange={(e) => { set('topic', e.target.value); set('subtopic', '') }}>
                <option value="">Select…</option>
                {topicOptions.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2 font-medium">Topic</label>
              <select className="input-field" value={form.subtopic} onChange={(e) => set('subtopic', e.target.value)} disabled={!form.topic}>
                <option value="">Select…</option>
                {subtopics.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2 font-medium">Problem URL (optional)</label>
            <input className="input-field" placeholder="https://artofproblemsolving.com/..." value={form.url} onChange={(e) => set('url', e.target.value)} />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2 font-medium">Notes / Key Insight</label>
            <textarea className="input-field resize-none" rows={3} placeholder="What was the key trick? What did you learn?" value={form.notes} onChange={(e) => set('notes', e.target.value)} />
          </div>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => set('solved', !form.solved)}
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${form.solved ? 'bg-emerald-500 border-emerald-500' : 'border-white/20 hover:border-emerald-500/50'}`}
            >
              {form.solved && <CheckCircle2 className="w-4 h-4 text-white" />}
            </div>
            <span className="text-slate-300 text-sm font-medium group-hover:text-white">Mark as solved</span>
            {form.solved && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3" />
                +{form.difficulty === 'easy' ? 10 : form.difficulty === 'medium' ? 25 : form.difficulty === 'hard' ? 60 : 150} XP
              </span>
            )}
          </label>
        </div>

        <div className="flex gap-3 p-6 border-t border-white/5">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSave} className="btn-primary flex-1">Save Problem</button>
        </div>
      </div>
    </div>
  )
}

export default function ProblemTracker() {
  const { problems, addProblem, updateProblem, deleteProblem, OLYMPIADS, TOPICS } = useData()
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [filterOlympiad, setFilterOlympiad] = useState('all')
  const [filterDiff, setFilterDiff] = useState('all')
  const [filterSolved, setFilterSolved] = useState('all')
  const [filterTopic, setFilterTopic] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [toast, setToast] = useState(null)

  function handleSave(form) {
    const p = addProblem(form)
    setShowModal(false)
    const xpGain = form.solved
      ? { easy: 10, medium: 25, hard: 60, insane: 150 }[form.difficulty]
      : null
    if (xpGain) showToast(`Problem saved! +${xpGain} XP 🎉`)
    else showToast('Problem logged!')
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const filtered = problems.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.olympiad.toLowerCase().includes(search.toLowerCase())) return false
    if (filterOlympiad !== 'all' && p.olympiad !== filterOlympiad) return false
    if (filterDiff !== 'all' && p.difficulty !== filterDiff) return false
    if (filterSolved === 'solved' && !p.solved) return false
    if (filterSolved === 'unsolved' && p.solved) return false
    if (filterTopic !== 'all' && p.topic !== filterTopic) return false
    return true
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const solved = problems.filter((p) => p.solved).length
  const total = problems.length

  return (
    <div className="p-8 space-y-6 animate-slide-in">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-5 py-3 rounded-xl font-medium shadow-xl animate-slide-in">
          {toast}
        </div>
      )}

      {showModal && <ProblemModal onClose={() => setShowModal(false)} onSave={handleSave} OLYMPIADS={OLYMPIADS} TOPICS={TOPICS} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Problem Tracker</h1>
          <p className="text-slate-400">{solved}/{total} solved · {total === 0 ? 'Start logging problems to earn XP!' : `${Math.round((solved / total) * 100)}% completion rate`}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Log Problem
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {['easy', 'medium', 'hard', 'insane'].map((d) => {
          const count = problems.filter((p) => p.solved && p.difficulty === d).length
          return (
            <div key={d} className="glass-card p-4 text-center">
              <DiffBadge diff={d} />
              <p className="text-2xl font-bold text-white mt-2">{count}</p>
              <p className="text-slate-500 text-xs mt-0.5">solved</p>
            </div>
          )
        })}
      </div>

      {/* Search & Filter */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input className="input-field pl-10" placeholder="Search problems…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center gap-2 ${showFilters ? 'border-violet-500/50 text-violet-300' : ''}`}
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-white/5">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Competition</label>
              <select className="input-field text-sm py-2" value={filterOlympiad} onChange={(e) => setFilterOlympiad(e.target.value)}>
                <option value="all">All</option>
                {OLYMPIADS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Difficulty</label>
              <select className="input-field text-sm py-2" value={filterDiff} onChange={(e) => setFilterDiff(e.target.value)}>
                <option value="all">All</option>
                {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Status</label>
              <select className="input-field text-sm py-2" value={filterSolved} onChange={(e) => setFilterSolved(e.target.value)}>
                <option value="all">All</option>
                <option value="solved">Solved</option>
                <option value="unsolved">Unsolved</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Subject</label>
              <select className="input-field text-sm py-2" value={filterTopic} onChange={(e) => setFilterTopic(e.target.value)}>
                <option value="all">All</option>
                {Object.keys(TOPICS).map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Problem list */}
      {filtered.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <p className="text-5xl mb-4">📝</p>
          <p className="text-white font-semibold text-lg mb-2">
            {problems.length === 0 ? 'No problems logged yet' : 'No problems match your filters'}
          </p>
          <p className="text-slate-500 mb-5">
            {problems.length === 0 ? 'Start by logging a problem from any competition!' : 'Try adjusting your search or filters.'}
          </p>
          {problems.length === 0 && (
            <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" /> Log First Problem
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => (
            <div key={p.id} className="glass-card p-4 hover:border-white/10 transition-all duration-200 group">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => updateProblem(p.id, { solved: !p.solved })}
                  className="mt-0.5 shrink-0 transition-transform hover:scale-110"
                >
                  {p.solved
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    : <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className={`font-semibold text-sm leading-tight ${p.solved ? 'text-white' : 'text-slate-300'}`}>
                        {p.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-xs text-slate-500 bg-space-700 px-2 py-0.5 rounded-lg">{p.olympiad}</span>
                        {p.year && <span className="text-xs text-slate-600">{p.year}</span>}
                        {p.number && <span className="text-xs text-slate-600">#{p.number}</span>}
                        <DiffBadge diff={p.difficulty} />
                        {p.topic && <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20">{p.subtopic || p.topic}</span>}
                        {p.timeMin && <span className="text-xs text-slate-600">⏱ {p.timeMin}m</span>}
                      </div>
                      {p.notes && <p className="text-slate-500 text-xs mt-2 leading-relaxed line-clamp-2">{p.notes}</p>}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      {p.url && (
                        <a href={p.url} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-violet-400 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button onClick={() => deleteProblem(p.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-center text-slate-700 text-sm">
        Showing {filtered.length} of {problems.length} problems
      </p>
    </div>
  )
}
