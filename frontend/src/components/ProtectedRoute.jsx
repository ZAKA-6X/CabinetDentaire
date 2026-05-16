import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, roles }) {
  const { user, token } = useAuth()

  // Pas de token → rediriger vers login
  if (!token) {
    return <Navigate to="/login" />
  }

  // Rôle non autorisé → rediriger vers login
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/login" />
  }

  // Accès autorisé → afficher la page
  return children
}

export default ProtectedRoute
