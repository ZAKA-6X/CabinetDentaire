import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api'

function Register() {
  // ─── Les données du formulaire ───
  const [formData, setFormData] = useState({
    nom_complet: '',
    email: '',
    password: '',
    telephone: '',
    adresse: '',
    date_naissance: '',
    sexe: 'Masculin',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  // ─── Mettre à jour les champs ───
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // ─── Soumission formulaire ───
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post('/register', formData)
      // Inscription réussie → redirection login
      navigate('/login')
    } catch (err) {
      setError('Erreur lors de l\'inscription. Vérifiez vos informations.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.left}>
      <div style={{
    position: 'absolute',
    inset: 0,
    background: 'rgba(11, 31, 58, 0.22)',
      }}/>

      {/* Partie gauche */}
        <div style={styles.logoBox}>🦷</div>
        <h1 style={styles.logoTitle}>Dentisto</h1>
        <p style={styles.logoSub}>Rejoignez notre cabinet dentaire</p>
        <div style={styles.features}>
          <div style={styles.feature}> Inscription rapide et sécurisée</div>
          <div style={styles.feature}> Réservez vos rendez-vous en ligne</div>
          <div style={styles.feature}> Accédez à votre dossier médical</div>
          <div style={styles.feature}>Consultez vos ordonnances</div>
        </div>
      </div>

      {/* Partie droite — formulaire */}
      <div style={styles.right}>
        <div style={styles.formBox}>
          <h2 style={styles.title}>Créer un compte</h2>
          <p style={styles.subtitle}>Remplissez vos informations personnelles</p>

          {/* Message erreur */}
          {error && (
            <div style={styles.errorBox}>❌ {error}</div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Nom + Email */}
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nom complet</label>
                <input
                  style={styles.input}
                  type="text"
                  name="nom_complet"
                  placeholder="Nom Prénom"
                  value={formData.nom_complet}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  style={styles.input}
                  type="email"
                  name="email"
                  placeholder="exemple@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password + Téléphone */}
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Mot de passe</label>
                <input
                  style={styles.input}
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Téléphone</label>
                <input
                  style={styles.input}
                  type="tel"
                  name="telephone"
                  placeholder="+212 x xx-xxx-xxx"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Adresse */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Adresse</label>
              <input
                style={styles.input}
                type="text"
                name="adresse"
                placeholder="123 Rue, Ville"
                value={formData.adresse}
                onChange={handleChange}
                required
              />
            </div>

            {/* Date naissance + Sexe */}
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Date de naissance</label>
                <input
                  style={styles.input}
                  type="date"
                  name="date_naissance"
                  value={formData.date_naissance}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Sexe</label>
                <select
                  style={styles.input}
                  name="sexe"
                  value={formData.sexe}
                  onChange={handleChange}
                >
                  <option>Masculin</option>
                  <option>Féminin</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              style={styles.btn}
              disabled={loading}
            >
              {loading ? 'Inscription...' : 'Créer mon compte →'}
            </button>

          </form>

          <p style={styles.switchText}>
            Déjà un compte ?{' '}
            <Link to="/login" style={styles.link}>Se connecter</Link>
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
  textShadow: '2px 2px 10px rgba(0,0,0,0.9)',  // ← zid had
},
feature: {
  color: 'black',                             // ← bdl rgba b white
  padding: '12px 0',
  borderBottom: '1px solid rgba(0,0,0,0.1)',
  fontSize: '0.9rem',
  textShadow: '2px 2px 10px rgba(0,0,0,0.9)',  // ← zid had
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
    maxWidth: '540px',
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
    marginBottom: '1.5rem',
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
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  formGroup: {
    marginBottom: '1rem',
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
    background: '#F8FAFC',
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

export default Register