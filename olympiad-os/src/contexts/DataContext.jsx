import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const DataContext = createContext(null)

export function useData() {
  return useContext(DataContext)
}

const OLYMPIADS = [
  'AMC 8', 'AMC 10A', 'AMC 10B', 'AMC 12A', 'AMC 12B',
  'AIME I', 'AIME II',
  'USAJMO', 'USAMO',
  'MATHCOUNTS', 'HMMT', 'PUMAC',
  'USAPhO', 'F=ma', 'Science Olympiad',
  'USABO', 'IBO',
  'USNCO', 'IChO',
  'USACO',
  'AMO', 'ARML',
]

const TOPICS = {
  Math: ['Number Theory', 'Combinatorics', 'Algebra', 'Geometry', 'Inequalities', 'Polynomials', 'Sequences', 'Probability'],
  Physics: ['Mechanics', 'Electromagnetism', 'Thermodynamics', 'Optics', 'Modern Physics', 'Waves', 'Fluid Mechanics'],
  Biology: ['Cell Biology', 'Genetics', 'Evolution', 'Ecology', 'Physiology', 'Biochemistry', 'Microbiology'],
  Chemistry: ['Stoichiometry', 'Thermochemistry', 'Kinetics', 'Equilibrium', 'Organic Chemistry', 'Electrochemistry'],
  'Computer Science': ['Greedy', 'Dynamic Programming', 'Graph Theory', 'Data Structures', 'Binary Search', 'Sorting'],
}

const BADGES = [
  { id: 'first_blood', name: 'First Blood', desc: 'Solve your first problem', icon: '🎯', xp: 50 },
  { id: 'hot_streak_3', name: 'On Fire', desc: '3-day streak', icon: '🔥', xp: 100 },
  { id: 'hot_streak_7', name: 'Week Warrior', desc: '7-day streak', icon: '⚡', xp: 250 },
  { id: 'hot_streak_30', name: 'Monthly Master', desc: '30-day streak', icon: '🌟', xp: 1000 },
  { id: 'ten_problems', name: 'Problem Solver', desc: 'Solve 10 problems', icon: '💡', xp: 200 },
  { id: 'fifty_problems', name: 'Grinder', desc: 'Solve 50 problems', icon: '⚙️', xp: 500 },
  { id: 'hundred_problems', name: 'Century Club', desc: 'Solve 100 problems', icon: '🏆', xp: 1500 },
  { id: 'multi_olympiad', name: 'Polymath', desc: 'Log problems from 3+ olympiads', icon: '🧠', xp: 300 },
  { id: 'hard_mode', name: 'Hard Mode', desc: 'Solve 10 hard problems', icon: '💪', xp: 400 },
  { id: 'early_bird', name: 'Early Bird', desc: 'Study before 7am', icon: '🌅', xp: 150 },
]

function getKey(uid, suffix) {
  return `olympiad_os_${uid}_${suffix}`
}

function load(uid, key, def) {
  try {
    const raw = localStorage.getItem(getKey(uid, key))
    return raw ? JSON.parse(raw) : def
  } catch {
    return def
  }
}

function save(uid, key, val) {
  localStorage.setItem(getKey(uid, key), JSON.stringify(val))
}

function calcLevel(xp) {
  if (xp < 100) return { level: 1, title: 'Novice', nextXP: 100 }
  if (xp < 300) return { level: 2, title: 'Apprentice', nextXP: 300 }
  if (xp < 700) return { level: 3, title: 'Scholar', nextXP: 700 }
  if (xp < 1500) return { level: 4, title: 'Competitor', nextXP: 1500 }
  if (xp < 3000) return { level: 5, title: 'Expert', nextXP: 3000 }
  if (xp < 6000) return { level: 6, title: 'Master', nextXP: 6000 }
  if (xp < 12000) return { level: 7, title: 'Grandmaster', nextXP: 12000 }
  return { level: 8, title: 'Olympian', nextXP: Infinity }
}

export function DataProvider({ children }) {
  const { user } = useAuth()
  const uid = user?.uid || 'guest'

  const [problems, setProblems] = useState(() => load(uid, 'problems', []))
  const [studySessions, setStudySessions] = useState(() => load(uid, 'sessions', []))
  const [earnedBadges, setEarnedBadges] = useState(() => load(uid, 'badges', []))
  const [xp, setXp] = useState(() => load(uid, 'xp', 0))
  const [streak, setStreak] = useState(() => load(uid, 'streak', { count: 0, lastDate: null }))
  const [studyPlans, setStudyPlans] = useState(() => load(uid, 'study_plans', []))
  const [calendarEvents, setCalendarEvents] = useState(() => load(uid, 'calendar', []))
  const [settings, setSettings] = useState(() => load(uid, 'settings', { anthropicKey: '' }))

  useEffect(() => { save(uid, 'problems', problems) }, [problems, uid])
  useEffect(() => { save(uid, 'sessions', studySessions) }, [studySessions, uid])
  useEffect(() => { save(uid, 'badges', earnedBadges) }, [earnedBadges, uid])
  useEffect(() => { save(uid, 'xp', xp) }, [xp, uid])
  useEffect(() => { save(uid, 'streak', streak) }, [streak, uid])
  useEffect(() => { save(uid, 'study_plans', studyPlans) }, [studyPlans, uid])
  useEffect(() => { save(uid, 'calendar', calendarEvents) }, [calendarEvents, uid])
  useEffect(() => { save(uid, 'settings', settings) }, [settings, uid])

  function addXP(amount) {
    setXp((prev) => prev + amount)
  }

  function checkAndAwardBadges(newProblems) {
    const newBadges = []
    const solved = newProblems.filter((p) => p.solved)
    const hardSolved = solved.filter((p) => p.difficulty === 'hard' || p.difficulty === 'insane')
    const olympiadSet = new Set(solved.map((p) => p.olympiad))

    const check = (id, cond) => {
      if (cond && !earnedBadges.includes(id)) {
        newBadges.push(id)
        const badge = BADGES.find((b) => b.id === id)
        if (badge) addXP(badge.xp)
      }
    }

    check('first_blood', solved.length >= 1)
    check('ten_problems', solved.length >= 10)
    check('fifty_problems', solved.length >= 50)
    check('hundred_problems', solved.length >= 100)
    check('multi_olympiad', olympiadSet.size >= 3)
    check('hard_mode', hardSolved.length >= 10)

    if (newBadges.length > 0) {
      setEarnedBadges((prev) => [...prev, ...newBadges])
    }
    return newBadges
  }

  function updateStreak() {
    const today = new Date().toDateString()
    setStreak((prev) => {
      if (prev.lastDate === today) return prev
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      const newCount = prev.lastDate === yesterday ? prev.count + 1 : 1
      const next = { count: newCount, lastDate: today }

      const newBadges = []
      if (newCount >= 3 && !earnedBadges.includes('hot_streak_3')) newBadges.push('hot_streak_3')
      if (newCount >= 7 && !earnedBadges.includes('hot_streak_7')) newBadges.push('hot_streak_7')
      if (newCount >= 30 && !earnedBadges.includes('hot_streak_30')) newBadges.push('hot_streak_30')
      if (newBadges.length > 0) setEarnedBadges((prev2) => [...prev2, ...newBadges])

      return next
    })
  }

  function addProblem(problem) {
    const newProblem = {
      id: Date.now().toString(),
      ...problem,
      createdAt: new Date().toISOString(),
    }
    const next = [...problems, newProblem]
    setProblems(next)
    if (problem.solved) {
      const xpMap = { easy: 10, medium: 25, hard: 60, insane: 150 }
      addXP(xpMap[problem.difficulty] || 10)
      checkAndAwardBadges(next)
      updateStreak()
    }
    return newProblem
  }

  function updateProblem(id, updates) {
    const next = problems.map((p) => (p.id === id ? { ...p, ...updates } : p))
    setProblems(next)
    if (updates.solved) {
      const prob = problems.find((p) => p.id === id)
      if (prob && !prob.solved) {
        const xpMap = { easy: 10, medium: 25, hard: 60, insane: 150 }
        addXP(xpMap[prob.difficulty] || 10)
        checkAndAwardBadges(next)
        updateStreak()
      }
    }
  }

  function deleteProblem(id) {
    setProblems((prev) => prev.filter((p) => p.id !== id))
  }

  function addCalendarEvent(event) {
    const newEvent = { id: Date.now().toString(), ...event }
    setCalendarEvents((prev) => [...prev, newEvent])
    return newEvent
  }

  function deleteCalendarEvent(id) {
    setCalendarEvents((prev) => prev.filter((e) => e.id !== id))
  }

  function addStudyPlan(plan) {
    const newPlan = { id: Date.now().toString(), ...plan, createdAt: new Date().toISOString(), progress: 0 }
    setStudyPlans((prev) => [...prev, newPlan])
    return newPlan
  }

  function updateStudyPlan(id, updates) {
    setStudyPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }

  function deleteStudyPlan(id) {
    setStudyPlans((prev) => prev.filter((p) => p.id !== id))
  }

  function updateSettings(updates) {
    setSettings((prev) => ({ ...prev, ...updates }))
  }

  const levelInfo = calcLevel(xp)
  const solvedProblems = problems.filter((p) => p.solved)
  const totalProblems = problems.length

  return (
    <DataContext.Provider value={{
      problems, addProblem, updateProblem, deleteProblem,
      studySessions, setStudySessions,
      earnedBadges, BADGES,
      xp, addXP, levelInfo,
      streak,
      studyPlans, addStudyPlan, updateStudyPlan, deleteStudyPlan,
      calendarEvents, addCalendarEvent, deleteCalendarEvent,
      settings, updateSettings,
      solvedProblems, totalProblems,
      OLYMPIADS, TOPICS,
    }}>
      {children}
    </DataContext.Provider>
  )
}
