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

  const doLogin = async (e, overrideEmail, overridePassword) => {
    if (e) e.preventDefault()
    setError('')
    setLoading(true)

    const credentials = {
      email: overrideEmail ?? email,
      password: overridePassword ?? password,
    }

    try {
      const response = await api.post('/login', credentials)
      const { token, user } = response.data
      login(user, token)
      if (user.role === 'PATIENT') navigate('/patient/dashboard')
      else if (user.role === 'SECRETAIRE') navigate('/secretaire/dashboard')
      else if (user.role === 'DENTISTE') navigate('/dentiste/dashboard')
    } catch (err) {
      setError('Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => doLogin(e)

  // ─── Design de la page ───
  return (
    <div style={styles.container}>

      {/* Partie gauche — bleue */}
      <div style={styles.left}>
  <div style={{
    position: 'absolute',
    inset: 0,
    background: 'rgba(11, 31, 58, 0.22)',
      }}/>
        <div style={styles.logoBox}>🦷</div>
        <h1 style={styles.logoTitle}>Dentisto</h1>
        <p style={styles.logoSub}>Système de gestion du cabinet dentaire</p>

        <div style={styles.features}>
          <div style={styles.feature}> Gestion des rendez-vous</div>
          <div style={styles.feature}> Dossiers patients numérisés</div>
          <div style={styles.feature}> Ordonnances & prescriptions</div>
          <div style={styles.feature}> Facturation automatisée</div>
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
                placeholder="exemple@gmail.com"
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
            <div style={{ margin: '1.5rem 0', textAlign: 'center', color: '#94A3B8', fontSize: '0.8rem' }}>
  — Démonstration rapide —
</div>

<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '1rem' }}>
  <button type="button" style={styles.btnDemo} onClick={() => doLogin(null, 'patient@clinic.ma', 'password')}>
    👤 Patient
  </button>
  <button type="button" style={styles.btnDemo} onClick={() => doLogin(null, 'secretaire@clinic.ma', 'password')}>
    👩‍💼 Secrétaire
  </button>
  <button type="button" style={styles.btnDemo} onClick={() => doLogin(null, 'dentiste@clinic.ma', 'password')}>
    🦷 Dentiste
  </button>
</div>

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
  backgroundImage: 'url(https://adent.ch/wp-content/uploads/2022/04/cdsf_page_clinique_signature.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
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
  color: 'black',
  fontSize: '2.5rem',
  margin: '0 0 0.5rem',
  fontFamily: 'Georgia, serif',
  textShadow: '2px 2px 10px rgba(0,0,0,0.9)',  // ← zid had
},
logoSub: {
  color: 'black',                             // ← bdl rgba b white
  fontSize: '2.0rem',
  textAlign: 'center',
  marginBottom: '2rem',
  textShadow: '0 2px 6px rgba(0,0,0,0.8)',  // ← zid had
},
feature: {
  color: 'black',                             // ← bdl rgba b white
  padding: '12px 0',
  borderBottom: '1px solid rgba(0,0,0,0.1)',
  fontSize: '0.9rem',
  textShadow: '0 1px 4px rgba(0,0,0,0.8)',  // ← zid had
},
  feature: {
    color: 'rgb(0, 0, 0)',
    padding: '12px 0',
    borderBottom: '1px solid rgb(38, 227, 145)',
    fontSize: '1.5rem',
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
  btnDemo: {
  background: 'white',
  border: '1.5px solid #E2E8F0',
  borderRadius: '8px',
  padding: '8px',
  cursor: 'pointer',
  fontSize: '0.82rem',
  color: '#475569',
  fontFamily: 'inherit',
},
}

export default Login