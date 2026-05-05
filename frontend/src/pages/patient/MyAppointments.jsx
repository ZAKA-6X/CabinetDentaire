import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import api from '../../api'

function MyAppointments() {
  const [appointments, setAppointments] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/rendez-vous')
        setAppointments(res.data)
        setFiltered(res.data)
      } catch (err) {
        console.error('Erreur chargement RDV')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // ─── Filtrer par statut ───
  const handleFilter = (statut) => {
    setFilter(statut)
    if (!statut) {
      setFiltered(appointments)
    } else {
      setFiltered(appointments.filter(r => r.statut === statut))
    }
  }

  // ─── Annuler un RDV ───
  const handleCancel = async (id) => {
    if (!window.confirm('Confirmer l\'annulation ?')) return
    try {
      await api.delete(`/rendez-vous/${id}`)
      const updated = appointments.map(r =>
        r.id === id ? { ...r, statut: 'ANNULÉ' } : r
      )
      setAppointments(updated)
      setFiltered(updated)
    } catch (err) {
      alert('Erreur lors de l\'annulation')
    }
  }

  // ─── Badge couleur selon statut ───
  const getBadge = (statut) => {
    const badges = {
      'EN_ATTENTE': { background: '#FEF3C7', color: '#92400E' },
      'CONFIRMÉ':   { background: '#D1FAE5', color: '#065F46' },
      'ANNULÉ':     { background: '#FEE2E2', color: '#991B1B' },
      'COMPLÉTÉ':   { background: '#DBEAFE', color: '#1E40AF' },
    }
    return badges[statut] || { background: '#F1F5F9', color: '#475569' }
  }

  return (
    <Layout>
     <div>
        <div style={styles.welcome}>
          <h2 style={styles.title}>📋 Mes rendez-vous</h2>
          <p style={styles.sub}>Historique de tous vos rendez-vous</p>
        </div>

        <div style={styles.card}>

          {/* Filtre statut */}
          <div style={styles.filterBar}>
            {['', 'EN_ATTENTE', 'CONFIRMÉ', 'ANNULÉ', 'COMPLÉTÉ'].map(s => (
              <button
                key={s}
                onClick={() => handleFilter(s)}
                style={{
                  ...styles.filterBtn,
                  ...(filter === s ? styles.filterBtnActive : {})
                }}
              >
                {s || 'Tous'}
              </button>
            ))}
          </div>

          {/* Table */}
          {loading ? (
            <p style={{ color: '#94A3B8' }}>Chargement...</p>
          ) : filtered.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: '3rem' }}>📭</div>
              <p>Aucun rendez-vous trouvé</p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date & Heure</th>
                  <th style={styles.th}>Dentiste</th>
                  <th style={styles.th}>Notes</th>
                  <th style={styles.th}>Statut</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(rdv => (
                  <tr key={rdv.id}>
                    <td style={styles.td}>
                      <strong>{rdv.date}</strong>
                      <br />
                      <small style={{ color: '#94A3B8' }}>
                        {rdv.heure?.slice(0, 5)}
                      </small>
                    </td>
                    <td style={styles.td}>
                      Dr. {rdv.dentiste?.nom_complet}
                    </td>
                    <td style={styles.td}>
                      {rdv.notes || '—'}
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        ...getBadge(rdv.statut)
                      }}>
                        {rdv.statut}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {rdv.statut === 'EN_ATTENTE' && (
                        <button
                          style={styles.btnCancel}
                          onClick={() => handleCancel(rdv.id)}
                        >
                          Annuler
                        </button>
                      )}
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
    gap: '8px',
    marginBottom: '1.25rem',
    flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '6px 14px',
    border: '1.5px solid #E2E8F0',
    borderRadius: '99px',
    background: 'white',
    color: '#475569',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: '500',
  },
  filterBtnActive: {
    background: '#0B1F3A',
    color: 'white',
    borderColor: '#0B1F3A',
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: '#94A3B8',
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
  badge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '99px',
    fontSize: '0.75rem',
    fontWeight: '500',
  },
  btnCancel: {
    background: '#FEE2E2',
    color: '#991B1B',
    border: 'none',
    padding: '5px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.82rem',
  },
}

export default MyAppointments