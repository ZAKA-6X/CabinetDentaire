import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// ─── Pages Auth ───
// (ghadi ncréiwhom men b3d)
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// ─── Pages Patient ───
import PatientDashboard from './pages/patient/PatientDashboard'

// ─── Pages Secrétaire ───
import SecretaireDashboard from './pages/secretaire/SecretaireDashboard'

// ─── Pages Dentiste ───
import DentisteDashboard from './pages/dentiste/DentisteDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Page par défaut → redirect vers login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Pages Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Pages Patient */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />

        {/* Pages Secrétaire */}
        <Route path="/secretaire/dashboard" element={<SecretaireDashboard />} />

        {/* Pages Dentiste */}
        <Route path="/dentiste/dashboard" element={<DentisteDashboard />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App