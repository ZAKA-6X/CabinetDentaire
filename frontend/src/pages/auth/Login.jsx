import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api'

function Login() {
  // ─── Les données du formulaire ───
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // ─── Hooks navigation et auth ───
  const navigate = useNavigate()
  const { login } = useAuth()

  // ─── Fonction soumission formulaire ───
  const handleSubmit = async (e) => {
    e.preventDefault() // Empêcher refresh de la page
    setError('')
    setLoading(true)

    try {
      // Appel API login vers backend
      const response = await api.post('/login', { email, password })
      const { token, user } = response.data

      // Sauvegarder dans AuthContext
      login(user, token)

      // Redirection selon le rôle
      if (user.role === 'PATIENT') navigate('/patient/dashboard')
      else if (user.role === 'SECRETAIRE') navigate('/secretaire/dashboard')
      else if (user.role === 'DENTISTE') navigate('/dentiste/dashboard')

    } catch (err) {
      setError('Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  // ─── Design de la page ───
  return (
    <div style={styles.container}>

      {/* Partie gauche — bleue */}
      <div style={styles.left}>
        <div style={styles.logoBox}>🦷</div>
        <h1 style={styles.logoTitle}>DentaApp</h1>
        <p style={styles.logoSub}>Système de gestion du cabinet dentaire</p>

        <div style={styles.features}>
          <div style={styles.feature}>📅 Gestion des rendez-vous</div>
          <div style={styles.feature}>📋 Dossiers patients numérisés</div>
          <div style={styles.feature}>💊 Ordonnances & prescriptions</div>
          <div style={styles.feature}>💳 Facturation automatisée</div>
        </div>
      </div>

      {/* Partie droite — formulaire */}
      <div style={styles.right}>
        <div style={styles.formBox}>
          <h2 style={styles.title}>Bon retour !</h2>
          <p style={styles.subtitle}>Connectez-vous à votre espace</p>

          {/* Message d'erreur */}
          {error && (
            <div style={styles.errorBox}>
              ❌ {error}
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>

            <div style={styles.formGroup}>
              <label style={styles.label}>Adresse email</label>
              <input
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <button
              type="submit"
              style={styles.btn}
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter →'}
            </button>

          </form>

          <p style={styles.switchText}>
            Pas encore de compte ?{' '}
            <Link to="/register" style={styles.link}>S'inscrire</Link>
          </p>
        </div>
      </div>

    </div>
  )
}

// ─── Styles ───
const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
  },
  left: {
    width: '45%',
    background: '#0B1F3A',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
  },
  logoBox: {
    fontSize: '3rem',
    background: '#00C9A7',
    borderRadius: '20px',
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  logoTitle: {
    color: 'white',
    fontSize: '2rem',
    margin: '0 0 0.5rem',
    fontFamily: 'Georgia, serif',
  },
  logoSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.9rem',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  features: {
    width: '100%',
    marginTop: '1rem',
  },
  feature: {
    color: 'rgba(255,255,255,0.75)',
    padding: '12px 0',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    fontSize: '0.9rem',
  },
  right: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'white',
    padding: '2rem',
  },
  formBox: {
    width: '100%',
    maxWidth: '420px',
  },
  title: {
    fontSize: '1.8rem',
    color: '#0B1F3A',
    marginBottom: '0.3rem',
    fontFamily: 'Georgia, serif',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: '0.9rem',
    marginBottom: '2rem',
  },
  errorBox: {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    color: '#EF4444',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    marginBottom: '1rem',
  },
  formGroup: {
    marginBottom: '1.2rem',
  },
  label: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: '500',
    color: '#475569',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    border: '1.5px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  btn: {
    width: '100%',
    padding: '13px',
    background: '#0B1F3A',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  switchText: {
    textAlign: 'center',
    marginTop: '1.5rem',
    fontSize: '0.88rem',
    color: '#94A3B8',
  },
  link: {
    color: '#00C9A7',
    textDecoration: 'none',
    fontWeight: '500',
  },
}

export default Login