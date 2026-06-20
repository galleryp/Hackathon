import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import Sidebar from './components/Layout/Sidebar'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import ProblemTracker from './pages/ProblemTracker'
import AITutor from './pages/AITutor'
import Calendar from './pages/Calendar'
import StudyPlans from './pages/StudyPlans'
import ReferenceSheets from './pages/ReferenceSheets'
import Achievements from './pages/Achievements'
import Settings from './pages/Settings'

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-space-950">
      <Sidebar />
      <main className="flex-1 min-h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  return children
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
          <Route element={
            <ProtectedRoute>
              <DataProvider>
                <AppLayout />
              </DataProvider>
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/problems" element={<ProblemTracker />} />
            <Route path="/tutor" element={<AITutor />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/plans" element={<StudyPlans />} />
            <Route path="/reference" element={<ReferenceSheets />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
