import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import api from '../../api'

function SecretaireDashboard() {
  const navigate = useNavigate()

  const [stats, setStats] = useState({
    rdvEnAttente: 0,
    facturesEnAttente: 0,
    totalPatients: 0,
    rdvCeMois: 0,
  })
  const [rdvEnAttente, setRdvEnAttente] = useState([])
  const [loading, setLoading] = useState(true)

  // ─── Charger les données ───
  useEffect(() => {
    const fetchData = async () => {
      try {
        const rdvRes = await api.get('/rendez-vous')
        const rdvs = rdvRes.data

        const enAttente = rdvs.filter(r => r.statut === 'EN_ATTENTE')
        setRdvEnAttente(enAttente)
        setStats(prev => ({
          ...prev,
          rdvEnAttente: enAttente.length,
        }))
      } catch (err) {
        console.error('Erreur chargement')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // ─── Confirmer un RDV ───
  const handleConfirm = async (id) => {
    try {
      await api.put(`/rendez-vous/${id}/confirm`)
      setRdvEnAttente(prev => prev.filter(r => r.id !== id))
      setStats(prev => ({
        ...prev,
        rdvEnAttente: prev.rdvEnAttente - 1
      }))
      alert('✅ RDV confirmé — Email envoyé au patient')
    } catch (err) {
      alert('Erreur lors de la confirmation')
    }
  }

  // ─── Rejeter un RDV ───
  const handleReject = async (id) => {
    const raison = prompt('Raison du rejet :')
    if (!raison) return
    try {
      await api.put(`/rendez-vous/${id}/reject`, { raison })
      setRdvEnAttente(prev => prev.filter(r => r.id !== id))
      setStats(prev => ({
        ...prev,
        rdvEnAttente: prev.rdvEnAttente - 1
      }))
      alert('RDV rejeté — Email envoyé au patient')
    } catch (err) {
      alert('Erreur lors du rejet')
    }
  }

  return (
    <Layout>
  <div>

        {/* Titre */}
        <div style={styles.welcome}>
          <h2 style={styles.welcomeTitle}>Tableau de bord 👩‍💼</h2>
          <p style={styles.welcomeSub}>Gestion du cabinet dentaire</p>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#FEF3C7'}}>⏳</div>
            <div>
              <div style={styles.statNum}>{stats.rdvEnAttente}</div>
              <div style={styles.statLbl}>RDV en attente</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#FEE2E2'}}>💳</div>
            <div>
              <div style={styles.statNum}>{stats.facturesEnAttente}</div>
              <div style={styles.statLbl}>Factures à encaisser</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#E6FAF6'}}>👥</div>
            <div>
              <div style={styles.statNum}>{stats.totalPatients}</div>
              <div style={styles.statLbl}>Patients enregistrés</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#E8F4FD'}}>📅</div>
            <div>
              <div style={styles.statNum}>{stats.rdvCeMois}</div>
              <div style={styles.statLbl}>RDV ce mois</div>
            </div>
          </div>
        </div>

        {/* Raccourcis */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>⚡ Raccourcis</h3>
          <div style={styles.shortcutGrid}>
            <div style={styles.shortcut} onClick={() => navigate('/secretaire/rendez-vous')}>
              <div style={styles.shortcutIcon}>📋</div>
              <span style={styles.shortcutLabel}>Rendez-vous</span>
            </div>
            <div style={styles.shortcut} onClick={() => navigate('/secretaire/paiements')}>
              <div style={styles.shortcutIcon}>💳</div>
              <span style={styles.shortcutLabel}>Paiements</span>
            </div>
            <div style={styles.shortcut} onClick={() => navigate('/secretaire/medicaments')}>
              <div style={styles.shortcutIcon}>💊</div>
              <span style={styles.shortcutLabel}>Médicaments</span>
            </div>
            <div style={styles.shortcut} onClick={() => navigate('/secretaire/operations')}>
              <div style={styles.shortcutIcon}>⚙️</div>
              <span style={styles.shortcutLabel}>Opérations</span>
            </div>
            <div style={styles.shortcut} onClick={() => navigate('/secretaire/patients')}>
              <div style={styles.shortcutIcon}>👥</div>
              <span style={styles.shortcutLabel}>Patients</span>
            </div>
          </div>
        </div>

        {/* RDV en attente */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>⏳ Demandes en attente</h3>
            <button
              style={styles.linkBtn}
              onClick={() => navigate('/secretaire/rendez-vous')}
            >
              Voir tout →
            </button>
          </div>

          {loading ? (
            <p style={{ color: '#94A3B8' }}>Chargement...</p>
          ) : rdvEnAttente.length === 0 ? (
            <p style={{ color: '#94A3B8' }}>Aucune demande en attente ✅</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Patient</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Notes</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rdvEnAttente.map(rdv => (
                  <tr key={rdv.id}>
                    <td style={styles.td}>
                      <strong>{rdv.patient?.nom_complet}</strong>
                    </td>
                    <td style={styles.td}>{rdv.date} — {rdv.heure?.slice(0,5)}</td>
                    <td style={styles.td}>{rdv.notes || '—'}</td>
                    <td style={styles.td}>
                      <button
                        style={styles.btnConfirm}
                        onClick={() => handleConfirm(rdv.id)}
                      >
                        ✓ Confirmer
                      </button>
                      <button
                        style={styles.btnReject}
                        onClick={() => handleReject(rdv.id)}
                      >
                        ✕ Rejeter
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
</Layout>
  )
}

// ─── Styles ───
const styles = {
 
  welcomeTitle: {
    fontSize: '1.6rem',
    color: '#0B1F3A',
    fontFamily: 'Georgia, serif',
    margin: 0,
  },
  welcomeSub: {
    color: '#94A3B8',
    fontSize: '0.9rem',
    marginTop: '4px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  statCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '1.25rem',
    boxShadow: '0 4px 24px rgba(11,31,58,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.4rem',
    flexShrink: 0,
  },
  statNum: {
    fontSize: '1.8rem',
    fontWeight: '600',
    color: '#0B1F3A',
    lineHeight: 1,
  },
  statLbl: {
    fontSize: '0.82rem',
    color: '#94A3B8',
    marginTop: '4px',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 24px rgba(11,31,58,0.08)',
    marginBottom: '1.5rem',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  cardTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '1.05rem',
    color: '#0B1F3A',
    margin: 0,
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#00C9A7',
    cursor: 'pointer',
    fontSize: '0.88rem',
    fontWeight: '500',
  },
  shortcutGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: '1rem',
  },
  shortcut: {
    border: '1.5px solid #E2E8F0',
    borderRadius: '12px',
    padding: '1.25rem',
    textAlign: 'center',
    cursor: 'pointer',
  },
  shortcutIcon: {
    fontSize: '2rem',
    marginBottom: '0.6rem',
  },
  shortcutLabel: {
    fontSize: '0.82rem',
    color: '#475569',
    fontWeight: '500',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '10px 14px',
    fontSize: '0.78rem',
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    borderBottom: '1px solid #E2E8F0',
  },
  td: {
    padding: '13px 14px',
    fontSize: '0.88rem',
    borderBottom: '1px solid #F1F5F9',
  },
  btnConfirm: {
    background: '#D1FAE5',
    color: '#065F46',
    border: 'none',
    padding: '5px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.82rem',
    marginRight: '6px',
  },
  btnReject: {
    background: '#FEE2E2',
    color: '#991B1B',
    border: 'none',
    padding: '5px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.82rem',
  },
}

export default SecretaireDashboard