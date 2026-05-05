import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import api from '../../api'

function MyProfile() {
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    nom_complet: '',
    telephone: '',
    adresse: '',
    date_naissance: '',
    sexe: '',
    antecedents_medicaux: '',
    allergies: '',
    contact_urgence: '',
  })

  const [passwords, setPasswords] = useState({
    ancien: '',
    nouveau: '',
  })

  const [loading, setLoading] = useState(true)
  const [msgSuccess, setMsgSuccess] = useState('')
  const [msgError, setMsgError] = useState('')

  // ─── Charger profil ───
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/patient/profil')
        setFormData(res.data)
      } catch (err) {
        console.error('Erreur chargement profil')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  // ─── Mettre à jour champ ───
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // ─── Enregistrer profil ───
  const handleSave = async () => {
    try {
      await api.put('/patient/profil', formData)
      setMsgSuccess('✅ Profil mis à jour avec succès !')
      setMsgError('')
      setTimeout(() => setMsgSuccess(''), 3000)
    } catch (err) {
      setMsgError('❌ Erreur lors de la mise à jour')
      setMsgSuccess('')
    }
  }

  // ─── Changer mot de passe ───
  const handlePasswordChange = async () => {
    if (!passwords.ancien || !passwords.nouveau) {
      setMsgError('❌ Remplissez les deux champs')
      return
    }
    try {
      await api.put('/patient/password', passwords)
      setMsgSuccess('✅ Mot de passe modifié !')
      setPasswords({ ancien: '', nouveau: '' })
      setTimeout(() => setMsgSuccess(''), 3000)
    } catch (err) {
      setMsgError('❌ Ancien mot de passe incorrect')
    }
  }

  if (loading) return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '2rem', color: '#94A3B8' }}>Chargement...</div>
    </div>
  )

  return (
    <Layout>
  <div>
        <div style={styles.welcome}>
          <h2 style={styles.title}>👤 Mon profil</h2>
          <p style={styles.sub}>Gérez vos informations personnelles</p>
        </div>

        {/* Messages */}
        {msgSuccess && <div style={styles.successBox}>{msgSuccess}</div>}
        {msgError && <div style={styles.errorBox}>{msgError}</div>}

        <div style={styles.grid}>

          {/* ─── Infos personnelles ─── */}
          <div style={styles.card}>

            {/* Avatar */}
            <div style={styles.avatarSection}>
              <div style={styles.avatar}>
                {formData.nom_complet?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <strong style={{ color: '#0B1F3A' }}>
                  {formData.nom_complet}
                </strong>
                <div style={{ color: '#94A3B8', fontSize: '0.82rem' }}>
                  Patient
                </div>
              </div>
            </div>

            <h3 style={styles.cardTitle}>Informations personnelles</h3>

            <div style={styles.formGroup}>
              <label style={styles.label}>Nom complet</label>
              <input
                style={styles.input}
                name="nom_complet"
                value={formData.nom_complet}
                onChange={handleChange}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Téléphone</label>
              <input
                style={styles.input}
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Adresse</label>
              <input
                style={styles.input}
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
              />
            </div>
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Date de naissance</label>
                <input
                  style={styles.input}
                  type="date"
                  name="date_naissance"
                  value={formData.date_naissance}
                  onChange={handleChange}
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

            <button style={styles.btnSave} onClick={handleSave}>
              💾 Enregistrer
            </button>
          </div>

          {/* ─── Colonne droite ─── */}
          <div>

            {/* Infos médicales */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>🏥 Informations médicales</h3>

              <div style={styles.formGroup}>
                <label style={styles.label}>Antécédents médicaux</label>
                <textarea
                  style={styles.textarea}
                  name="antecedents_medicaux"
                  value={formData.antecedents_medicaux}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Diabète, hypertension..."
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Allergies</label>
                <input
                  style={styles.input}
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  placeholder="Pénicilline, latex..."
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Contact d'urgence</label>
                <input
                  style={styles.input}
                  name="contact_urgence"
                  value={formData.contact_urgence}
                  onChange={handleChange}
                  placeholder="Nom — Téléphone"
                />
              </div>

              <button style={styles.btnSave} onClick={handleSave}>
                💾 Enregistrer
              </button>
            </div>

            {/* Changer mot de passe */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>🔒 Changer le mot de passe</h3>

              <div style={styles.formGroup}>
                <label style={styles.label}>Ancien mot de passe</label>
                <input
                  style={styles.input}
                  type="password"
                  placeholder="••••••••"
                  value={passwords.ancien}
                  onChange={e => setPasswords({
                    ...passwords, ancien: e.target.value
                  })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nouveau mot de passe</label>
                <input
                  style={styles.input}
                  type="password"
                  placeholder="••••••••"
                  value={passwords.nouveau}
                  onChange={e => setPasswords({
                    ...passwords, nouveau: e.target.value
                  })}
                />
              </div>

              <button style={styles.btnOutline} onClick={handlePasswordChange}>
                🔑 Changer
              </button>
            </div>

          </div>
        </div>
     </div>
</Layout>
  )
}

const styles = {
 
  title: {
    fontSize: '1.6rem',
    color: '#0B1F3A',
    fontFamily: 'Georgia, serif',
    margin: 0,
  },
  sub: { color: '#94A3B8', fontSize: '0.9rem', marginTop: '4px' },
  successBox: {
    background: '#D1FAE5',
    border: '1px solid #6EE7B7',
    color: '#065F46',
    padding: '10px 14px',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '0.88rem',
  },
  errorBox: {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    color: '#EF4444',
    padding: '10px 14px',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '0.88rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    alignItems: 'start',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 24px rgba(11,31,58,0.08)',
    marginBottom: '1.5rem',
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #B2F0E8, #00C9A7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#0B1F3A',
  },
  cardTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '1rem',
    color: '#0B1F3A',
    margin: '0 0 1rem 0',
  },
  formGroup: { marginBottom: '1rem' },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  label: {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: '500',
    color: '#475569',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1.5px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '0.88rem',
    outline: 'none',
    background: '#F8FAFC',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: '1.5px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '0.88rem',
    outline: 'none',
    background: '#F8FAFC',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  btnSave: {
    background: '#0B1F3A',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.88rem',
    fontWeight: '500',
  },
  btnOutline: {
    background: 'white',
    color: '#0B1F3A',
    border: '1.5px solid #E2E8F0',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.88rem',
    fontWeight: '500',
  },
}

export default MyProfile