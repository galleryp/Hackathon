import { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, isToday } from 'date-fns'
import { ChevronLeft, ChevronRight, Plus, X, Clock, Tag } from 'lucide-react'

const EVENT_COLORS = ['#7c3aed', '#2563eb', '#10b981', '#f59e0b', '#ef4444', '#ec4899']

const COMP_DEADLINES = [
  { title: 'AMC 10A / 12A', date: '2024-11-06', color: '#7c3aed', type: 'competition' },
  { title: 'AMC 10B / 12B', date: '2024-11-13', color: '#7c3aed', type: 'competition' },
  { title: 'AIME I', date: '2025-02-06', color: '#2563eb', type: 'competition' },
  { title: 'AIME II', date: '2025-02-12', color: '#2563eb', type: 'competition' },
  { title: 'F=ma Exam', date: '2025-01-23', color: '#f59e0b', type: 'competition' },
  { title: 'USABO Semifinal', date: '2025-02-13', color: '#10b981', type: 'competition' },
  { title: 'AMC 8', date: '2025-01-18', color: '#ec4899', type: 'competition' },
]

function AddEventModal({ selectedDate, onClose, onSave }) {
  const [form, setForm] = useState({
    title: '', date: format(selectedDate || new Date(), 'yyyy-MM-dd'),
    time: '', duration: 60, type: 'study', color: EVENT_COLORS[0], notes: '',
  })
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-space-800 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-slide-in">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg">Add Event</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-500 hover:text-white" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Title</label>
            <input className="input-field" placeholder="e.g. AMC Practice Session" value={form.title} onChange={(e) => set('title', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Date</label>
              <input type="date" className="input-field" value={form.date} onChange={(e) => set('date', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Time</label>
              <input type="time" className="input-field" value={form.time} onChange={(e) => set('time', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Duration (min)</label>
              <input type="number" className="input-field" value={form.duration} onChange={(e) => set('duration', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Type</label>
              <select className="input-field" value={form.type} onChange={(e) => set('type', e.target.value)}>
                <option value="study">Study Session</option>
                <option value="competition">Competition</option>
                <option value="review">Review</option>
                <option value="mock">Mock Exam</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Color</label>
            <div className="flex gap-2">
              {EVENT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => set('color', c)}
                  className={`w-7 h-7 rounded-full transition-all duration-150 ${form.color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-space-800' : 'hover:scale-110'}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Notes</label>
            <textarea className="input-field resize-none" rows={2} placeholder="Goals for this session…" value={form.notes} onChange={(e) => set('notes', e.target.value)} />
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={() => form.title.trim() && onSave(form)} className="btn-primary flex-1">Add Event</button>
        </div>
      </div>
    </div>
  )
}

export default function Calendar() {
  const { calendarEvents, addCalendarEvent, deleteCalendarEvent } = useData()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const allEvents = [...calendarEvents, ...COMP_DEADLINES.map((e) => ({ ...e, id: `deadline-${e.title}`, readOnly: true }))]

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const calStart = startOfWeek(monthStart)
  const calEnd = endOfWeek(monthEnd)

  const days = []
  let day = calStart
  while (day <= calEnd) {
    days.push(day)
    day = addDays(day, 1)
  }

  function getEventsForDay(date) {
    const str = format(date, 'yyyy-MM-dd')
    return allEvents.filter((e) => e.date === str)
  }

  const selectedEvents = selectedDate ? getEventsForDay(selectedDate) : []
  const upcomingAll = allEvents
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 8)

  function handleSave(form) {
    addCalendarEvent(form)
    setShowModal(false)
  }

  return (
    <div className="p-8 animate-slide-in">
      {showModal && <AddEventModal selectedDate={selectedDate} onClose={() => setShowModal(false)} onSave={handleSave} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Study Calendar</h1>
          <p className="text-slate-400">Plan sessions, track competition deadlines, stay on track</p>
        </div>
        <button onClick={() => { setSelectedDate(new Date()); setShowModal(true) }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar grid */}
        <div className="xl:col-span-2 glass-card p-5">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="btn-secondary px-3 py-2">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-white font-bold text-lg">{format(currentMonth, 'MMMM yyyy')}</h2>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="btn-secondary px-3 py-2">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-slate-500 py-2">{d}</div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((d, i) => {
              const events = getEventsForDay(d)
              const inMonth = isSameMonth(d, currentMonth)
              const isSelected = selectedDate && isSameDay(d, selectedDate)
              const today = isToday(d)

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(d)}
                  className={`min-h-[72px] p-1.5 rounded-xl text-left transition-all duration-150 border ${
                    isSelected ? 'bg-violet-600/20 border-violet-500/50' :
                    today ? 'bg-white/5 border-white/15' :
                    'border-transparent hover:bg-white/5'
                  }`}
                >
                  <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${
                    today ? 'bg-violet-600 text-white' :
                    inMonth ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {format(d, 'd')}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {events.slice(0, 2).map((ev, j) => (
                      <div
                        key={j}
                        className="text-[10px] px-1.5 py-0.5 rounded-md truncate font-medium"
                        style={{ background: `${ev.color}25`, color: ev.color, border: `1px solid ${ev.color}40` }}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <div className="text-[10px] text-slate-500 px-1">+{events.length - 2} more</div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Selected day events */}
          {selectedDate && (
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold text-sm">{format(selectedDate, 'EEEE, MMM d')}</h3>
                <button
                  onClick={() => { setShowModal(true) }}
                  className="text-violet-400 hover:text-violet-300 text-xs flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
              {selectedEvents.length === 0 ? (
                <p className="text-slate-600 text-sm text-center py-4">No events — free to study!</p>
              ) : (
                <div className="space-y-2">
                  {selectedEvents.map((ev) => (
                    <div key={ev.id} className="p-3 rounded-xl border border-white/5 bg-space-700 group">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ background: ev.color }} />
                          <div>
                            <p className="text-white text-sm font-medium">{ev.title}</p>
                            {ev.time && <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" />{ev.time}{ev.duration ? ` · ${ev.duration}min` : ''}</p>}
                            {ev.notes && <p className="text-slate-600 text-xs mt-1">{ev.notes}</p>}
                          </div>
                        </div>
                        {!ev.readOnly && (
                          <button onClick={() => deleteCalendarEvent(ev.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {ev.readOnly && (
                        <span className="text-[10px] text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full mt-2 inline-block border border-violet-500/20">📌 Competition</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Upcoming events */}
          <div className="glass-card p-4">
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-violet-400" /> Upcoming
            </h3>
            {upcomingAll.length === 0 ? (
              <p className="text-slate-600 text-sm text-center py-4">No upcoming events</p>
            ) : (
              <div className="space-y-2">
                {upcomingAll.map((ev) => (
                  <div key={ev.id} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{ background: ev.color }} />
                    <div className="min-w-0">
                      <p className="text-slate-300 text-sm font-medium truncate">{ev.title}</p>
                      <p className="text-slate-600 text-xs">{format(new Date(ev.date), 'MMM d')}{ev.time ? ` · ${ev.time}` : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Competition deadlines legend */}
          <div className="glass-card p-4">
            <h3 className="text-white font-semibold text-sm mb-3">📌 Key Competitions 2024-25</h3>
            <div className="space-y-2">
              {COMP_DEADLINES.map((c) => (
                <div key={c.title} className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">{c.title}</span>
                  <span className="text-slate-500 text-xs font-mono">{format(new Date(c.date), 'MMM d')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
