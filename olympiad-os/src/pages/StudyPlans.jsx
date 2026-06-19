import { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { ClipboardList, Plus, X, ChevronDown, ChevronUp, Check, Clock, Target, Trash2, BookOpen } from 'lucide-react'

const PRESET_PLANS = [
  {
    name: 'AMC 10/12 Foundation',
    competition: 'AMC 10A',
    duration: '8 weeks',
    level: 'beginner',
    description: 'Build a solid foundation for AMC 10/12 success. Covers core topics systematically.',
    weeks: [
      { week: 1, title: 'Algebra Basics', tasks: ['Review quadratics and polynomials', 'Practice 20 algebra AMC problems', 'Study AM-GM inequality', 'Take 1 old AMC test under timed conditions'] },
      { week: 2, title: 'Number Theory', tasks: ['Study modular arithmetic', 'Learn divisibility tricks', 'Practice 20 number theory problems', 'Review prime factorization and GCD/LCM'] },
      { week: 3, title: 'Geometry I', tasks: ['Review similar triangles and circles', 'Study Pythagorean theorem extensions', 'Practice 20 geometry problems', 'Learn area/perimeter shortcuts'] },
      { week: 4, title: 'Counting & Probability', tasks: ['Study permutations and combinations', 'Learn basic probability', 'Practice 25 counting problems', 'Study Pigeonhole Principle'] },
      { week: 5, title: 'Combinatorics', tasks: ['Stars and bars method', 'Recursion and Fibonacci-type problems', 'Practice 25 combinatorics problems', 'Study inclusion-exclusion'] },
      { week: 6, title: 'Geometry II', tasks: ['Trigonometry for AMC', 'Coordinate geometry tricks', 'Practice 25 advanced geometry problems', 'Study 3D geometry basics'] },
      { week: 7, title: 'Mixed Practice', tasks: ['Take 3 full AMC tests timed', 'Review all wrong answers thoroughly', 'Focus on weakest 2 topics', 'Study speed tricks and shortcuts'] },
      { week: 8, title: 'Final Prep', tasks: ['Take 2 full AMC tests', 'Review all 40+ wrong answers', 'Study hardest problem types (#20-25)', 'Mental preparation and strategy'] },
    ],
  },
  {
    name: 'AIME Intensive',
    competition: 'AIME I',
    duration: '6 weeks',
    level: 'intermediate',
    description: 'Focused preparation for AIME. Assumes AMC qualification and covers advanced techniques.',
    weeks: [
      { week: 1, title: 'Advanced Number Theory', tasks: ['Chinese Remainder Theorem', 'Euler\'s totient function', 'Solve 10 AIME number theory problems', 'Study Legendre\'s formula'] },
      { week: 2, title: 'Advanced Combinatorics', tasks: ['Generating functions intro', 'Advanced inclusion-exclusion', 'Solve 10 AIME combinatorics problems', 'Bijection and double-counting techniques'] },
      { week: 3, title: 'Polynomials & Sequences', tasks: ['Vieta\'s formulas deeply', 'Recurrence relations', 'Solve 10 AIME algebra problems', 'Study symmetric polynomials'] },
      { week: 4, title: 'Geometry', tasks: ['Power of a Point theorem', 'Radical axes', 'Solve 10 AIME geometry problems', 'Trigonometric identities for competition'] },
      { week: 5, title: 'Mixed Problem Sets', tasks: ['Solve 3 full AIME tests', 'Review and understand every wrong answer', 'Identify personal weakest topics', 'Speed practice on easier AIME problems'] },
      { week: 6, title: 'Contest Simulation', tasks: ['2 full timed AIME simulations', 'Review under exam conditions', 'Mental math practice', 'Last-minute technique review'] },
    ],
  },
  {
    name: 'USAPhO Prep',
    competition: 'USAPhO',
    duration: '10 weeks',
    level: 'advanced',
    description: 'Comprehensive physics olympiad preparation from F=ma through USAPhO.',
    weeks: [
      { week: 1, title: 'Classical Mechanics I', tasks: ['Review Newton\'s laws deeply', 'Kinematics in 2D/3D', 'Solve 15 F=ma problems', 'Study rotational motion fundamentals'] },
      { week: 2, title: 'Classical Mechanics II', tasks: ['Energy conservation techniques', 'Momentum and collisions', 'Lagrangian mechanics intro', 'Solve 10 USAPhO mechanics problems'] },
      { week: 3, title: 'Oscillations & Waves', tasks: ['SHM and damped oscillations', 'Coupled oscillators', 'Wave mechanics', 'Practice 10 oscillation problems'] },
      { week: 4, title: 'Electrostatics', tasks: ['Gauss\'s law applications', 'Electric potential', 'Capacitors in circuits', 'Solve 10 electrostatics problems'] },
      { week: 5, title: 'Electrodynamics', tasks: ['Faraday\'s law and induction', 'LRC circuits', 'Magnetic forces', 'Solve 10 EM problems'] },
      { week: 6, title: 'Thermodynamics', tasks: ['Laws of thermodynamics', 'Kinetic theory of gases', 'Carnot cycles', 'Practice entropy problems'] },
      { week: 7, title: 'Optics & Modern Physics', tasks: ['Geometric and wave optics', 'Special relativity basics', 'Quantum mechanics intro', 'Photoelectric effect problems'] },
      { week: 8, title: 'Problem Set 1', tasks: ['Solve 2019-2020 USAPhO problems', 'Deep review of solutions', 'Identify weak areas', 'Write clear solution write-ups'] },
      { week: 9, title: 'Problem Set 2', tasks: ['Solve 2021-2022 USAPhO problems', 'Time yourself strictly', 'Review all solutions', 'Practice clear diagram drawing'] },
      { week: 10, title: 'Final Simulation', tasks: ['Full USAPhO mock exam', 'Review solutions carefully', 'Focus on write-up quality', 'Physical intuition practice'] },
    ],
  },
  {
    name: 'USABO Semis Prep',
    competition: 'USABO',
    duration: '8 weeks',
    level: 'intermediate',
    description: 'Structured prep for the USABO Semifinal. Covers all major biology domains.',
    weeks: [
      { week: 1, title: 'Cell Biology', tasks: ['Cell structures and functions', 'Membrane transport mechanisms', 'Cell signaling pathways', 'Practice 30 cell bio questions'] },
      { week: 2, title: 'Genetics & Molecular Biology', tasks: ['DNA replication and repair', 'Gene expression regulation', 'Epigenetics basics', 'Mendelian and non-Mendelian genetics'] },
      { week: 3, title: 'Evolution & Ecology', tasks: ['Natural selection mechanisms', 'Population genetics', 'Ecological interactions', 'Evolutionary theory deep dive'] },
      { week: 4, title: 'Organismal Biology', tasks: ['Plant biology and physiology', 'Animal systems overview', 'Nervous and endocrine systems', 'Immune system mechanisms'] },
      { week: 5, title: 'Biochemistry', tasks: ['Enzyme kinetics', 'Metabolic pathways (glycolysis, TCA)', 'Photosynthesis mechanisms', 'Protein structure and function'] },
      { week: 6, title: 'Microbiology & Virology', tasks: ['Bacterial genetics', 'Viral replication cycles', 'Pathogen-host interactions', 'Biotechnology applications'] },
      { week: 7, title: 'Practice Exams', tasks: ['Take 3 USABO practice tests', 'Review wrong answers with textbook', 'Focus on weakest topics', 'Practice diagram and graph interpretation'] },
      { week: 8, title: 'Final Review', tasks: ['Flash card review of all systems', '2 full timed practice exams', 'Review Campbell Biology key chapters', 'Relax and trust your preparation'] },
    ],
  },
]

function PlanCard({ plan, onStart }) {
  const [expanded, setExpanded] = useState(false)
  const levelColors = { beginner: 'diff-easy', intermediate: 'diff-medium', advanced: 'diff-hard' }

  return (
    <div className="glass-card overflow-hidden hover:border-violet-500/20 transition-all duration-200">
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`badge ${levelColors[plan.level]}`}>{plan.level}</span>
              <span className="text-xs text-slate-500 bg-space-700 px-2 py-0.5 rounded-lg">{plan.competition}</span>
              <span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" />{plan.duration}</span>
            </div>
            <h3 className="text-white font-bold text-lg">{plan.name}</h3>
            <p className="text-slate-400 text-sm mt-1">{plan.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button onClick={() => onStart(plan)} className="btn-primary flex items-center gap-2 text-sm py-2">
            <Target className="w-4 h-4" /> Start Plan
          </button>
          <button onClick={() => setExpanded(!expanded)} className="btn-secondary flex items-center gap-2 text-sm py-2">
            {expanded ? <><ChevronUp className="w-4 h-4" /> Hide weeks</> : <><ChevronDown className="w-4 h-4" /> Preview weeks</>}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-white/5 p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {plan.weeks.map((w) => (
              <div key={w.week} className="bg-space-700 rounded-xl p-3 border border-white/5">
                <p className="text-violet-400 text-xs font-semibold mb-1">Week {w.week}</p>
                <p className="text-white text-sm font-semibold mb-2">{w.title}</p>
                <ul className="space-y-1">
                  {w.tasks.map((t, i) => (
                    <li key={i} className="text-slate-500 text-xs flex items-start gap-1.5">
                      <span className="mt-0.5 shrink-0">•</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ActivePlanCard({ plan, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(true)
  const totalTasks = plan.weeks.reduce((a, w) => a + w.tasks.length, 0)
  const completedTasks = plan.completedTasks?.length || 0
  const pct = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0

  function toggleTask(weekIdx, taskIdx) {
    const key = `${weekIdx}-${taskIdx}`
    const current = plan.completedTasks || []
    const updated = current.includes(key) ? current.filter((k) => k !== key) : [...current, key]
    onUpdate(plan.id, { completedTasks: updated, progress: Math.round((updated.length / totalTasks) * 100) })
  }

  return (
    <div className="glass-card overflow-hidden border border-violet-500/20">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="badge bg-violet-500/20 text-violet-400 border border-violet-500/30">Active</span>
              <span className="text-xs text-slate-500">{plan.competition}</span>
            </div>
            <h3 className="text-white font-bold text-lg">{plan.name}</h3>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>{completedTasks}/{totalTasks} tasks</span>
                  <span className="text-violet-400 font-semibold">{pct}%</span>
                </div>
                <div className="h-2 bg-space-700 rounded-full overflow-hidden">
                  <div className="h-full xp-bar-fill rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <button onClick={() => setExpanded(!expanded)} className="text-slate-500 hover:text-white transition-colors">
              {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            <button onClick={() => onDelete(plan.id)} className="text-slate-600 hover:text-red-400 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-white/5 p-5 space-y-4">
          {plan.weeks.map((week, wi) => (
            <div key={wi}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-violet-400 text-xs font-semibold">Week {week.week}</span>
                <span className="text-white text-sm font-semibold">{week.title}</span>
              </div>
              <div className="space-y-1.5">
                {week.tasks.map((task, ti) => {
                  const key = `${wi}-${ti}`
                  const done = plan.completedTasks?.includes(key)
                  return (
                    <label key={ti} className="flex items-start gap-3 cursor-pointer group">
                      <div
                        onClick={() => toggleTask(wi, ti)}
                        className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${done ? 'bg-emerald-500 border-emerald-500' : 'border-white/20 hover:border-emerald-500/50'}`}
                      >
                        {done && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`text-sm transition-colors ${done ? 'text-slate-600 line-through' : 'text-slate-300 group-hover:text-white'}`}>
                        {task}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function StudyPlans() {
  const { studyPlans, addStudyPlan, updateStudyPlan, deleteStudyPlan } = useData()
  const [tab, setTab] = useState('active')

  function startPlan(preset) {
    addStudyPlan({
      ...preset,
      completedTasks: [],
      progress: 0,
    })
    setTab('active')
  }

  return (
    <div className="p-8 space-y-6 animate-slide-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Study Plans</h1>
        <p className="text-slate-400">Structured week-by-week roadmaps for every competition</p>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab('active')} className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'active' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25' : 'btn-secondary'}`}>
          My Plans {studyPlans.length > 0 && `(${studyPlans.length})`}
        </button>
        <button onClick={() => setTab('browse')} className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'browse' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25' : 'btn-secondary'}`}>
          Browse Plans
        </button>
      </div>

      {tab === 'active' && (
        <div className="space-y-4">
          {studyPlans.length === 0 ? (
            <div className="glass-card p-16 text-center">
              <p className="text-4xl mb-4">📋</p>
              <p className="text-white font-semibold text-lg mb-2">No active plans</p>
              <p className="text-slate-500 mb-5">Browse our pre-made plans and start one to get a structured study roadmap</p>
              <button onClick={() => setTab('browse')} className="btn-primary flex items-center gap-2 mx-auto">
                <BookOpen className="w-4 h-4" /> Browse Plans
              </button>
            </div>
          ) : (
            studyPlans.map((plan) => (
              <ActivePlanCard
                key={plan.id}
                plan={plan}
                onUpdate={updateStudyPlan}
                onDelete={deleteStudyPlan}
              />
            ))
          )}
        </div>
      )}

      {tab === 'browse' && (
        <div className="space-y-4">
          {PRESET_PLANS.map((plan) => (
            <PlanCard key={plan.name} plan={plan} onStart={startPlan} />
          ))}
        </div>
      )}
    </div>
  )
}
