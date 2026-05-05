import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, roles }) {
  const { user, token } = useAuth()

  // Machi connecté → redirect login
  if (!token) {
    return <Navigate to="/login" />
  }

  // Connecté mais rôle machi msmah
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/login" />
  }

  // Kol chi mezyan → afficher la page
  return children
}

export default ProtectedRoute