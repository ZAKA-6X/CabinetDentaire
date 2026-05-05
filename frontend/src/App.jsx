import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'

// ─── Auth ───
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// ─── Patient ───
import PatientDashboard from './pages/patient/PatientDashboard'
import BookAppointment from './pages/patient/BookAppointment'
import MyAppointments from './pages/patient/MyAppointments'
import MyVisits from './pages/patient/MyVisits'
import MyPrescriptions from './pages/patient/MyPrescriptions'
import MyInvoices from './pages/patient/MyInvoices'
import MyProfile from './pages/patient/MyProfile'

// ─── Secretaire ───
import SecretaireDashboard from './pages/secretaire/SecretaireDashboard'
import ManageAppointments from './pages/secretaire/ManageAppointments'
import ManagePayments from './pages/secretaire/ManagePayments'
import ManageMedications from './pages/secretaire/ManageMedications'
import ManageOperations from './pages/secretaire/ManageOperations'
import PatientsList from './pages/secretaire/PatientsList'

// ─── Dentiste ───
import DentisteDashboard from './pages/dentiste/DentisteDashboard'
import RecordVisit from './pages/dentiste/RecordVisit'
import IssuePrescription from './pages/dentiste/IssuePrescription'
import PatientHistory from './pages/dentiste/PatientHistory'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />

        {/* ─── Auth ─── */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ─── Patient ─── */}
        <Route path="/patient/dashboard" element={
          <ProtectedRoute roles={['PATIENT']}>
            <PatientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/patient/reserver" element={
          <ProtectedRoute roles={['PATIENT']}>
            <BookAppointment />
          </ProtectedRoute>
        } />
        <Route path="/patient/rendez-vous" element={
          <ProtectedRoute roles={['PATIENT']}>
            <MyAppointments />
          </ProtectedRoute>
        } />
        <Route path="/patient/visites" element={
          <ProtectedRoute roles={['PATIENT']}>
            <MyVisits />
          </ProtectedRoute>
        } />
        <Route path="/patient/ordonnances" element={
          <ProtectedRoute roles={['PATIENT']}>
            <MyPrescriptions />
          </ProtectedRoute>
        } />
        <Route path="/patient/factures" element={
          <ProtectedRoute roles={['PATIENT']}>
            <MyInvoices />
          </ProtectedRoute>
        } />
        <Route path="/patient/profil" element={
          <ProtectedRoute roles={['PATIENT']}>
            <MyProfile />
          </ProtectedRoute>
        } />

        {/* ─── Secretaire ─── */}
        <Route path="/secretaire/dashboard" element={
          <ProtectedRoute roles={['SECRETAIRE']}>
            <SecretaireDashboard />
          </ProtectedRoute>
        } />
        <Route path="/secretaire/rendez-vous" element={
          <ProtectedRoute roles={['SECRETAIRE']}>
            <ManageAppointments />
          </ProtectedRoute>
        } />
        <Route path="/secretaire/paiements" element={
          <ProtectedRoute roles={['SECRETAIRE']}>
            <ManagePayments />
          </ProtectedRoute>
        } />
        <Route path="/secretaire/medicaments" element={
          <ProtectedRoute roles={['SECRETAIRE']}>
            <ManageMedications />
          </ProtectedRoute>
        } />
        <Route path="/secretaire/operations" element={
          <ProtectedRoute roles={['SECRETAIRE']}>
            <ManageOperations />
          </ProtectedRoute>
        } />
        <Route path="/secretaire/patients" element={
          <ProtectedRoute roles={['SECRETAIRE']}>
            <PatientsList />
          </ProtectedRoute>
        } />

        {/* ─── Dentiste ─── */}
        <Route path="/dentiste/dashboard" element={
          <ProtectedRoute roles={['DENTISTE']}>
            <DentisteDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dentiste/visite/:rdv_id" element={
          <ProtectedRoute roles={['DENTISTE']}>
            <RecordVisit />
          </ProtectedRoute>
        } />
        <Route path="/dentiste/visite/nouvelle" element={
          <ProtectedRoute roles={['DENTISTE']}>
            <RecordVisit />
          </ProtectedRoute>
        } />
        <Route path="/dentiste/ordonnance/:visite_id" element={
          <ProtectedRoute roles={['DENTISTE']}>
            <IssuePrescription />
          </ProtectedRoute>
        } />
        <Route path="/dentiste/ordonnance/nouvelle" element={
          <ProtectedRoute roles={['DENTISTE']}>
            <IssuePrescription />
          </ProtectedRoute>
        } />
        <Route path="/dentiste/patient/:id/historique" element={
          <ProtectedRoute roles={['DENTISTE']}>
            <PatientHistory />
          </ProtectedRoute>
        } />
        <Route path="/dentiste/patients" element={
          <ProtectedRoute roles={['DENTISTE']}>
            <PatientHistory />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App