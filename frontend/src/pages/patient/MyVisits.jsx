import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import api from '../../api'

function MyVisits() {
  const navigate = useNavigate()
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')

  useEffect(() => {
    fetchVisits()
  }, [])

  const fetchVisits = async () => {
    try {
      const res = await api.get('/visites')
      setVisits(res.data)
    } catch (err) {
      console.error('Erreur chargement visites')
    } finally {
      setLoading(false)
    }
  }

  // ─── Filtrer par dates ───
  const handleFilter = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/visites?date_debut=${dateDebut}&date_fin=${dateFin}`)
      setVisits(res.data)
    } catch (err) {
      console.error('Erreur filtre')
    } finally {
      setLoading(false)
    }
  }

  // ─── Badge facture ───
  const getBadge = (statut) => {
    if (statut === 'PAYÉE') return { background: '#D1FAE5', color: '#065F46' }
    return { background: '#FEF3C7', color: '#92400E' }
  }

  return (
   <Layout>
  <div>
        <div style={styles.welcome}>
          <h2 style={styles.title}>🏥 Mes visites</h2>
          <p style={styles.sub}>Historique de toutes vos visites</p>
        </div>

        <div style={styles.card}>

          {/* Filtre dates */}
          <div style={styles.filterBar}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Date début</label>
              <input
                type="date"
                value={dateDebut}
                onChange={e => setDateDebut(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Date fin</label>
              <input
                type="date"
                value={dateFin}
                onChange={e => setDateFin(e.target.value)}
                style={styles.input}
              />
            </div>
            <button style={styles.btnFilter} onClick={handleFilter}>
              🔍 Filtrer
            </button>
            <button style={styles.btnReset} onClick={() => {
              setDateDebut('')
              setDateFin('')
              fetchVisits()
            }}>
              Réinitialiser
            </button>
          </div>

          {/* Table */}
          {loading ? (
            <p style={{ color: '#94A3B8' }}>Chargement...</p>
          ) : visits.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: '3rem' }}>📭</div>
              <p>Aucune visite trouvée</p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Diagnostic</th>
                  <th style={styles.th}>Traitement</th>
                  <th style={styles.th}>Facture</th>
                  <th style={styles.th}>Détails</th>
                </tr>
              </thead>
              <tbody>
                {visits.map(visite => (
                  <tr key={visite.id}>
                    <td style={styles.td}>
                      <strong>{visite.date}</strong>
                    </td>
                    <td style={styles.td}>{visite.diagnostic}</td>
                    <td style={styles.td}>{visite.traitement_fourni}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        ...getBadge(visite.facture?.statut)
                      }}>
                        {visite.facture?.statut || 'En attente'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button
                        style={styles.btnDetail}
                        onClick={() => navigate(`/patient/visites/${visite.id}`)}
                      >
                        Voir →
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

const styles = {
  
  title: {
    fontSize: '1.6rem',
    color: '#0B1F3A',
    fontFamily: 'Georgia, serif',
    margin: 0,
  },
  sub: { color: '#94A3B8', fontSize: '0.9rem', marginTop: '4px' },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 24px rgba(11,31,58,0.08)',
  },
  filterBar: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.25rem',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  formGroup: { display: 'flex', flexDirection: 'column' },
  label: {
    fontSize: '0.82rem',
    color: '#475569',
    fontWeight: '500',
    marginBottom: '4px',
  },
  input: {
    padding: '8px 12px',
    border: '1.5px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '0.88rem',
    outline: 'none',
    background: '#F8FAFC',
  },
  btnFilter: {
    padding: '8px 16px',
    background: '#0B1F3A',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.88rem',
  },
  btnReset: {
    padding: '8px 16px',
    background: 'white',
    color: '#475569',
    border: '1.5px solid #E2E8F0',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.88rem',
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: '#94A3B8',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
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
  badge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '99px',
    fontSize: '0.75rem',
    fontWeight: '500',
  },
  btnDetail: {
    background: '#F1F5F9',
    color: '#0B1F3A',
    border: 'none',
    padding: '5px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: '500',
  },
}

export default MyVisits